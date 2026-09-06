/**
 * การพิสูจน์ตัวตน
 * ------------------------------------------------------------------
 * - แฮชรหัสผ่านด้วย scrypt ซึ่งมีอยู่ใน Node.js อยู่แล้ว ไม่ต้องพึ่งไลบรารีภายนอก
 *   scrypt เป็นอัลกอริทึมประเภท key stretching ที่จงใจให้ช้าและกินหน่วยความจำ
 * - เซสชันเก็บในฐานข้อมูล ส่งรหัสเซสชันผ่านคุกกี้แบบ httpOnly
 */

const crypto = require('crypto');
const db = require('./db');

const SESSION_DAYS = 30;
const COOKIE = 'ca_sid';
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

const id = (n = 24) => crypto.randomBytes(n).toString('base64url');

/* ---------- รหัสผ่าน ---------- */

function hashPassword(pw) {
  return new Promise((res, rej) => {
    const salt = crypto.randomBytes(16);
    crypto.scrypt(pw.normalize('NFKC'), salt, SCRYPT.keylen, SCRYPT, (e, key) =>
      e ? rej(e) : res(`scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('base64')}$${key.toString('base64')}`)
    );
  });
}

function verifyPassword(pw, stored) {
  return new Promise((res) => {
    try {
      const [alg, N, r, p, saltB64, keyB64] = String(stored).split('$');
      if (alg !== 'scrypt') return res(false);
      const salt = Buffer.from(saltB64, 'base64');
      const key = Buffer.from(keyB64, 'base64');
      crypto.scrypt(
        pw.normalize('NFKC'),
        salt,
        key.length,
        { N: +N, r: +r, p: +p },
        (e, got) => res(!e && got.length === key.length && crypto.timingSafeEqual(got, key))
      );
    } catch (e) {
      res(false);
    }
  });
}

/* ---------- คุกกี้และเซสชัน ---------- */

function readCookie(req, name) {
  const raw = req.headers.cookie;
  if (!raw) return null;
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

function setSessionCookie(res, sid, maxAgeSec) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE}=${encodeURIComponent(sid)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${secure}`
  );
}

function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
}

async function startSession(res, userId) {
  const sid = id(32);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5).toISOString();
  await db.sessions.create({ id: sid, userId, expiresAt });
  setSessionCookie(res, sid, SESSION_DAYS * 86400);
  return sid;
}

async function endSession(req, res) {
  const sid = readCookie(req, COOKIE);
  if (sid) await db.sessions.remove(sid);
  clearSessionCookie(res);
}

/** อ่านผู้ใช้จากคุกกี้ ใส่ไว้ที่ req.user (เป็น null ถ้ายังไม่ล็อกอิน) */
async function attachUser(req, res, next) {
  req.user = null;
  try {
    const sid = readCookie(req, COOKIE);
    if (sid) {
      const s = await db.sessions.get(sid);
      if (s) req.user = await db.users.byId(s.user_id);
    }
  } catch (e) {
    /* ถ้าฐานข้อมูลมีปัญหา ให้ถือว่าเป็นผู้เยี่ยมชม */
  }
  next();
}

function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'ต้องเข้าสู่ระบบก่อน' });
  next();
}

/* ---------- จำกัดจำนวนครั้งที่ลองล็อกอิน ---------- */

const attempts = new Map();
function rateLimit(key, max = 8, windowMs = 15 * 60 * 1000) {
  const t = Date.now();
  const rec = attempts.get(key);
  if (!rec || t - rec.start > windowMs) {
    attempts.set(key, { start: t, n: 1 });
    return true;
  }
  rec.n++;
  return rec.n <= max;
}
function rateReset(key) {
  attempts.delete(key);
}
setInterval(() => {
  const t = Date.now();
  for (const [k, v] of attempts) if (t - v.start > 30 * 60 * 1000) attempts.delete(k);
}, 10 * 60 * 1000).unref?.();

module.exports = {
  id,
  hashPassword,
  verifyPassword,
  startSession,
  endSession,
  attachUser,
  requireUser,
  rateLimit,
  rateReset,
};
