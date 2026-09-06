/**
 * เส้นทาง API ของบัญชีผู้ใช้ ความคืบหน้า และระบบเพื่อน
 */

const express = require('express');
const db = require('./db');
const A = require('./auth');

const router = express.Router();

/* ---------- ตัวช่วยตรวจข้อมูลนำเข้า ---------- */

const RE_USER = /^[a-z0-9_.]{3,20}$/;
const RE_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const AVATAR_MAX = 300 * 1024; // ไบต์ของสตริง data URL

const clean = (s, max) => String(s ?? '').trim().slice(0, max);

/** ข้อมูลผู้ใช้ที่ปลอดภัยพอจะส่งออกไปให้ฝั่งหน้าเว็บ */
const publicUser = (u) =>
  u && {
    id: u.id,
    username: u.username,
    displayName: u.display_name,
    avatar: u.avatar || null,
    createdAt: u.created_at,
  };

const expOf = (data) => (data && typeof data.exp === 'number' ? data.exp : 0);

// สูตรระดับต้องตรงกับฝั่งหน้าเว็บ: ต้องใช้ EXP สะสม 30*(n²−1) เพื่อขึ้นระดับ n
const RANK_MAX = 10;
function levelOf(exp) {
  let lv = 1;
  while (lv < RANK_MAX && exp >= 30 * ((lv + 1) * (lv + 1) - 1)) lv++;
  return lv;
}

function statsOf(data) {
  const d = data || {};
  // นับเฉพาะโจทย์ CTF จากคีย์ ex ที่ขึ้นต้นด้วย chal. และมีค่า ok
  const ctfSolved = Object.entries(d.ex || {}).filter(
    ([k, v]) => v === 'ok' && k.startsWith('chal.')
  ).length;
  return {
    exp: expOf(d),
    lessons: Object.keys(d.lessons || {}).length,
    labs: Object.keys(d.labs || {}).length,
    ctf: ctfSolved,
  };
}

/* ═══════════════════ สมัครสมาชิกและเข้าสู่ระบบ ═══════════════════ */

router.post('/auth/register', async (req, res) => {
  try {
    const email = clean(req.body.email, 120).toLowerCase();
    const username = clean(req.body.username, 20).toLowerCase();
    const displayName = clean(req.body.displayName, 40) || username;
    const password = String(req.body.password ?? '');

    if (!RE_MAIL.test(email)) return res.status(400).json({ error: 'รูปแบบอีเมลไม่ถูกต้อง' });
    if (!RE_USER.test(username))
      return res.status(400).json({
        error: 'ชื่อผู้ใช้ต้องยาว 3–20 ตัว ใช้ได้เฉพาะ a-z ตัวเลข จุด และขีดล่าง',
      });
    if (password.length < 8)
      return res.status(400).json({ error: 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร' });

    if (await db.users.byEmail(email))
      return res.status(409).json({ error: 'อีเมลนี้ถูกใช้สมัครไปแล้ว' });
    if (await db.users.byUsername(username))
      return res.status(409).json({ error: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' });

    const user = await db.users.create({
      id: A.id(12),
      email,
      username,
      displayName,
      passHash: await A.hashPassword(password),
    });

    // ย้ายความคืบหน้าที่สะสมไว้ตอนยังไม่ล็อกอิน (ถ้าส่งมาด้วย)
    if (req.body.progress && typeof req.body.progress === 'object') {
      await db.progress.set(user.id, req.body.progress);
    }

    await A.startSession(res, user.id);
    res.json({ user: publicUser(user) });
  } catch (e) {
    console.error('[register]', e.message);
    res.status(500).json({ error: 'สมัครสมาชิกไม่สำเร็จ' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const idf = clean(req.body.identifier, 120).toLowerCase();
    const password = String(req.body.password ?? '');
    const key = (req.ip || 'x') + '|' + idf;

    if (!A.rateLimit(key))
      return res
        .status(429)
        .json({ error: 'พยายามเข้าสู่ระบบบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่' });

    const user = idf.includes('@') ? await db.users.byEmail(idf) : await db.users.byUsername(idf);
    const ok = user && (await A.verifyPassword(password, user.pass_hash));
    if (!ok) return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });

    A.rateReset(key);
    await A.startSession(res, user.id);
    res.json({ user: publicUser(user) });
  } catch (e) {
    console.error('[login]', e.message);
    res.status(500).json({ error: 'เข้าสู่ระบบไม่สำเร็จ' });
  }
});

router.post('/auth/logout', async (req, res) => {
  await A.endSession(req, res);
  res.json({ ok: true });
});

/* ═══════════════════ โปรไฟล์ ═══════════════════ */

router.get('/me', async (req, res) => {
  if (!req.user) return res.json({ user: null });
  const data = await db.progress.get(req.user.id);
  res.json({ user: publicUser(req.user), stats: statsOf(data) });
});

router.patch('/me', A.requireUser, async (req, res) => {
  try {
    const patch = {};

    if (req.body.displayName !== undefined) {
      const dn = clean(req.body.displayName, 40);
      if (dn.length < 1) return res.status(400).json({ error: 'ชื่อที่แสดงต้องไม่ว่าง' });
      patch.displayName = dn;
    }

    if (req.body.avatar !== undefined) {
      const av = req.body.avatar;
      if (av === null || av === '') {
        patch.avatar = '';
      } else {
        if (typeof av !== 'string' || !/^data:image\/(png|jpeg|webp);base64,/.test(av))
          return res.status(400).json({ error: 'รูปโปรไฟล์ต้องเป็นไฟล์ภาพ PNG, JPEG หรือ WebP' });
        if (av.length > AVATAR_MAX)
          return res.status(413).json({ error: 'รูปโปรไฟล์ใหญ่เกินไป กรุณาเลือกภาพที่เล็กลง' });
        patch.avatar = av;
      }
    }

    const u = await db.users.update(req.user.id, patch);
    res.json({ user: publicUser(u) });
  } catch (e) {
    console.error('[patch me]', e.message);
    res.status(500).json({ error: 'บันทึกโปรไฟล์ไม่สำเร็จ' });
  }
});

/* ═══════════════════ ความคืบหน้าการเรียน ═══════════════════ */

router.get('/progress', A.requireUser, async (req, res) => {
  res.json({ progress: (await db.progress.get(req.user.id)) || null });
});

async function saveProgress(req, res) {
  const p = req.body.progress;
  if (!p || typeof p !== 'object') return res.status(400).json({ error: 'ข้อมูลไม่ถูกต้อง' });
  if (JSON.stringify(p).length > 200 * 1024)
    return res.status(413).json({ error: 'ข้อมูลความคืบหน้าใหญ่เกินไป' });
  await db.progress.set(req.user.id, p);
  res.json({ ok: true });
}

router.put('/progress', A.requireUser, saveProgress);
// sendBeacon ส่งได้เฉพาะ POST จึงเปิดเส้นทางเดียวกันไว้สำหรับตอนปิดแท็บ
router.post('/progress', A.requireUser, saveProgress);

/* ═══════════════════ ระบบเพื่อน ═══════════════════ */

/** รวมข้อมูลผู้ใช้ + สถิติ ให้เป็นรายการเดียวกัน */
async function decorate(ids) {
  if (!ids.length) return [];
  const [users, progs] = await Promise.all([db.users.byIds(ids), db.friends.expOf(ids)]);
  return users.map((u) => ({ ...publicUser(u), stats: statsOf(progs[u.id]) }));
}

router.get('/friends', A.requireUser, async (req, res) => {
  try {
    const me = req.user.id;
    const mine = await db.friends.listFor(me);
    const incomingRows = await db.friends.incoming(me);

    const accepted = mine.filter((r) => r.status === 'accepted').map((r) => r.friend_id);
    const outgoing = mine.filter((r) => r.status === 'pending').map((r) => r.friend_id);
    const incoming = incomingRows.map((r) => r.user_id).filter((x) => !accepted.includes(x));

    const [f, i, o] = await Promise.all([
      decorate(accepted),
      decorate(incoming),
      decorate(outgoing),
    ]);
    f.sort((a, b) => b.stats.exp - a.stats.exp);
    res.json({ friends: f, incoming: i, outgoing: o });
  } catch (e) {
    console.error('[friends]', e.message);
    res.status(500).json({ error: 'โหลดรายชื่อเพื่อนไม่สำเร็จ' });
  }
});

router.get('/friends/search', A.requireUser, async (req, res) => {
  const term = clean(req.query.q, 40);
  if (term.length < 2) return res.json({ users: [] });
  const rows = await db.users.search(term, 10);
  const mine = await db.friends.listFor(req.user.id);
  const incoming = await db.friends.incoming(req.user.id);
  const map = {};
  mine.forEach((r) => (map[r.friend_id] = r.status === 'accepted' ? 'friend' : 'outgoing'));
  incoming.forEach((r) => {
    if (!map[r.user_id]) map[r.user_id] = 'incoming';
  });
  res.json({
    users: rows
      .filter((u) => u.id !== req.user.id)
      .map((u) => ({ ...publicUser(u), relation: map[u.id] || 'none' })),
  });
});

router.post('/friends/request', A.requireUser, async (req, res) => {
  try {
    const uname = clean(req.body.username, 20).toLowerCase();
    const target = await db.users.byUsername(uname);
    if (!target) return res.status(404).json({ error: 'ไม่พบชื่อผู้ใช้นี้' });
    if (target.id === req.user.id)
      return res.status(400).json({ error: 'เพิ่มตัวเองเป็นเพื่อนไม่ได้' });

    const existing = await db.friends.get(req.user.id, target.id);
    if (existing && existing.status === 'accepted')
      return res.status(409).json({ error: 'เป็นเพื่อนกันอยู่แล้ว' });
    if (existing && existing.status === 'pending')
      return res.status(409).json({ error: 'ส่งคำขอไปแล้ว รอการตอบรับ' });

    // ถ้าอีกฝ่ายส่งคำขอมาก่อนหน้านี้ ให้ถือว่าตอบรับทันที
    const reverse = await db.friends.get(target.id, req.user.id);
    if (reverse && reverse.status === 'pending') {
      await db.friends.set(target.id, req.user.id, 'accepted');
      await db.friends.set(req.user.id, target.id, 'accepted');
      return res.json({ status: 'accepted' });
    }

    await db.friends.set(req.user.id, target.id, 'pending');
    res.json({ status: 'pending' });
  } catch (e) {
    console.error('[friend request]', e.message);
    res.status(500).json({ error: 'ส่งคำขอไม่สำเร็จ' });
  }
});

router.post('/friends/accept', A.requireUser, async (req, res) => {
  const from = clean(req.body.id, 40);
  const row = await db.friends.get(from, req.user.id);
  if (!row || row.status !== 'pending')
    return res.status(404).json({ error: 'ไม่พบคำขอเป็นเพื่อนนี้' });
  await db.friends.set(from, req.user.id, 'accepted');
  await db.friends.set(req.user.id, from, 'accepted');
  res.json({ ok: true });
});

router.post('/friends/remove', A.requireUser, async (req, res) => {
  await db.friends.remove(req.user.id, clean(req.body.id, 40));
  res.json({ ok: true });
});

/* ═══════════════════ กระดานคะแนนรวม ═══════════════════ */

router.get('/leaderboard', async (req, res) => {
  try {
    const rows = await db.leaderboard.top(100);
    const total = await db.leaderboard.count();
    const board = rows
      .map((r) => {
        const st = statsOf(r.data);
        return {
          username: r.username,
          displayName: r.display_name,
          avatar: r.avatar || null,
          exp: st.exp,
          level: levelOf(st.exp),
          lessons: st.lessons,
          labs: st.labs,
          ctf: st.ctf,
        };
      })
      .filter((r) => r.exp > 0); // แสดงเฉพาะคนที่เริ่มเรียนแล้ว

    // หาอันดับของผู้ใช้ปัจจุบัน
    let myRank = null;
    if (req.user) {
      const idx = board.findIndex((r) => r.username === req.user.username);
      if (idx >= 0) myRank = idx + 1;
    }
    res.json({ board, total, myRank, me: req.user ? req.user.username : null });
  } catch (e) {
    console.error('[leaderboard]', e.message);
    res.status(500).json({ error: 'โหลดกระดานคะแนนไม่สำเร็จ' });
  }
});

module.exports = router;
