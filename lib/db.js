/**
 * ชั้นเก็บข้อมูล
 * ------------------------------------------------------------------
 * มีสองไดรเวอร์ที่ให้หน้าตาการเรียกใช้เหมือนกันทุกประการ
 *   1) PostgreSQL — ใช้เมื่อมีตัวแปรสภาพแวดล้อม DATABASE_URL (บน Railway)
 *   2) ไฟล์ JSON  — ใช้เมื่อไม่มี เหมาะกับการพัฒนาในเครื่องโดยไม่ต้องติดตั้งอะไร
 *
 * ข้อมูลที่เก็บ: ผู้ใช้ เซสชัน ความคืบหน้าการเรียน และความสัมพันธ์เพื่อน
 */

const fs = require('fs');
const path = require('path');

const USE_PG = !!process.env.DATABASE_URL;
const FILE = process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'store.json');

const now = () => new Date().toISOString();

/* ═══════════════════ ไดรเวอร์ PostgreSQL ═══════════════════ */

function pgDriver() {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.PGSSL === 'off' ? false : { rejectUnauthorized: false },
    max: 5,
  });
  const q = (text, params) => pool.query(text, params);
  const one = async (text, params) => (await q(text, params)).rows[0] || null;

  return {
    kind: 'postgres',

    async init() {
      await q(`CREATE TABLE IF NOT EXISTS users (
        id           TEXT PRIMARY KEY,
        email        TEXT UNIQUE NOT NULL,
        username     TEXT UNIQUE NOT NULL,
        display_name TEXT NOT NULL,
        avatar       TEXT,
        pass_hash    TEXT NOT NULL,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
      )`);
      await q(`CREATE TABLE IF NOT EXISTS sessions (
        id         TEXT PRIMARY KEY,
        user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL
      )`);
      await q(`CREATE TABLE IF NOT EXISTS progress (
        user_id    TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        data       JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`);
      await q(`CREATE TABLE IF NOT EXISTS friends (
        user_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        friend_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status    TEXT NOT NULL,
        PRIMARY KEY (user_id, friend_id)
      )`);
      await q(`CREATE INDEX IF NOT EXISTS friends_user_idx ON friends(user_id)`);
    },

    users: {
      create: (u) =>
        one(
          `INSERT INTO users (id,email,username,display_name,avatar,pass_hash)
           VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
          [u.id, u.email, u.username, u.displayName, u.avatar || null, u.passHash]
        ),
      byId: (id) => one(`SELECT * FROM users WHERE id=$1`, [id]),
      byEmail: (e) => one(`SELECT * FROM users WHERE email=$1`, [e]),
      byUsername: (n) => one(`SELECT * FROM users WHERE username=$1`, [n]),
      byIds: async (ids) => {
        if (!ids.length) return [];
        const ph = ids.map((_, i) => '$' + (i + 1)).join(',');
        return (await q(`SELECT * FROM users WHERE id IN (${ph})`, ids)).rows;
      },
      update: (id, f) =>
        one(
          `UPDATE users SET
             display_name = COALESCE($2, display_name),
             avatar       = COALESCE($3, avatar)
           WHERE id=$1 RETURNING *`,
          [id, f.displayName ?? null, f.avatar ?? null]
        ),
      search: async (term, limit) =>
        (
          await q(
            `SELECT * FROM users
             WHERE username ILIKE $1 OR display_name ILIKE $1
             ORDER BY username LIMIT $2`,
            ['%' + term + '%', limit]
          )
        ).rows,
    },

    sessions: {
      create: (s) =>
        one(`INSERT INTO sessions (id,user_id,expires_at) VALUES ($1,$2,$3) RETURNING *`, [
          s.id, s.userId, s.expiresAt,
        ]),
      get: (id) => one(`SELECT * FROM sessions WHERE id=$1 AND expires_at > now()`, [id]),
      remove: (id) => q(`DELETE FROM sessions WHERE id=$1`, [id]),
      purge: () => q(`DELETE FROM sessions WHERE expires_at <= now()`),
    },

    progress: {
      get: async (uid) => {
        const r = await one(`SELECT data FROM progress WHERE user_id=$1`, [uid]);
        return r ? r.data : null;
      },
      set: (uid, data) =>
        q(
          `INSERT INTO progress (user_id,data,updated_at) VALUES ($1,$2,now())
           ON CONFLICT (user_id) DO UPDATE SET data=$2, updated_at=now()`,
          [uid, JSON.stringify(data)]
        ),
    },

    friends: {
      set: (a, b, status) =>
        q(
          `INSERT INTO friends (user_id,friend_id,status) VALUES ($1,$2,$3)
           ON CONFLICT (user_id,friend_id) DO UPDATE SET status=$3`,
          [a, b, status]
        ),
      get: (a, b) => one(`SELECT * FROM friends WHERE user_id=$1 AND friend_id=$2`, [a, b]),
      listFor: async (uid) => (await q(`SELECT * FROM friends WHERE user_id=$1`, [uid])).rows,
      incoming: async (uid) =>
        (await q(`SELECT * FROM friends WHERE friend_id=$1 AND status='pending'`, [uid])).rows,
      remove: (a, b) =>
        q(
          `DELETE FROM friends WHERE (user_id=$1 AND friend_id=$2) OR (user_id=$2 AND friend_id=$1)`,
          [a, b]
        ),
      expOf: async (ids) => {
        if (!ids.length) return {};
        const ph = ids.map((_, i) => '$' + (i + 1)).join(',');
        const rows = (await q(`SELECT user_id, data FROM progress WHERE user_id IN (${ph})`, ids))
          .rows;
        const out = {};
        rows.forEach((r) => (out[r.user_id] = r.data));
        return out;
      },
    },

    leaderboard: {
      // ดึงผู้ใช้ทุกคนพร้อมความคืบหน้า เรียงตาม EXP มากไปน้อย จำกัดจำนวน
      top: async (limit) => {
        const rows = (
          await q(
            `SELECT u.id, u.username, u.display_name, u.avatar, p.data
             FROM users u LEFT JOIN progress p ON p.user_id = u.id
             ORDER BY COALESCE((p.data->>'exp')::int, 0) DESC
             LIMIT $1`,
            [limit]
          )
        ).rows;
        return rows.map((r) => ({
          id: r.id,
          username: r.username,
          display_name: r.display_name,
          avatar: r.avatar,
          data: r.data || {},
        }));
      },
      count: async () => (await q(`SELECT COUNT(*)::int AS n FROM users`)).rows[0].n,
    },
  };
}

/* ═══════════════════ ไดรเวอร์ไฟล์ JSON ═══════════════════ */

function fileDriver() {
  let mem = { users: [], sessions: [], progress: {}, friends: [] };
  let dirty = false;
  let timer = null;

  function persist() {
    dirty = true;
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      if (!dirty) return;
      dirty = false;
      try {
        fs.mkdirSync(path.dirname(FILE), { recursive: true });
        fs.writeFileSync(FILE + '.tmp', JSON.stringify(mem));
        fs.renameSync(FILE + '.tmp', FILE);
      } catch (e) {
        console.error('[db] เขียนไฟล์ไม่สำเร็จ:', e.message);
      }
    }, 300);
  }

  const clone = (o) => (o ? JSON.parse(JSON.stringify(o)) : o);
  const low = (s) => String(s || '').toLowerCase();

  return {
    kind: 'file',

    async init() {
      try {
        if (fs.existsSync(FILE)) mem = Object.assign(mem, JSON.parse(fs.readFileSync(FILE, 'utf8')));
      } catch (e) {
        console.error('[db] อ่านไฟล์เดิมไม่สำเร็จ เริ่มใหม่:', e.message);
      }
    },

    users: {
      async create(u) {
        const row = {
          id: u.id,
          email: u.email,
          username: u.username,
          display_name: u.displayName,
          avatar: u.avatar || null,
          pass_hash: u.passHash,
          created_at: now(),
        };
        mem.users.push(row);
        persist();
        return clone(row);
      },
      async byId(id) {
        return clone(mem.users.find((u) => u.id === id) || null);
      },
      async byEmail(e) {
        return clone(mem.users.find((u) => low(u.email) === low(e)) || null);
      },
      async byUsername(n) {
        return clone(mem.users.find((u) => low(u.username) === low(n)) || null);
      },
      async byIds(ids) {
        return clone(mem.users.filter((u) => ids.includes(u.id)));
      },
      async update(id, f) {
        const u = mem.users.find((x) => x.id === id);
        if (!u) return null;
        if (f.displayName != null) u.display_name = f.displayName;
        if (f.avatar != null) u.avatar = f.avatar;
        persist();
        return clone(u);
      },
      async search(term, limit) {
        const t = low(term);
        return clone(
          mem.users
            .filter((u) => low(u.username).includes(t) || low(u.display_name).includes(t))
            .slice(0, limit)
        );
      },
    },

    sessions: {
      async create(s) {
        const row = { id: s.id, user_id: s.userId, expires_at: s.expiresAt };
        mem.sessions.push(row);
        persist();
        return clone(row);
      },
      async get(id) {
        const s = mem.sessions.find((x) => x.id === id);
        if (!s) return null;
        if (new Date(s.expires_at) <= new Date()) return null;
        return clone(s);
      },
      async remove(id) {
        mem.sessions = mem.sessions.filter((s) => s.id !== id);
        persist();
      },
      async purge() {
        const n = new Date();
        mem.sessions = mem.sessions.filter((s) => new Date(s.expires_at) > n);
        persist();
      },
    },

    progress: {
      async get(uid) {
        return clone(mem.progress[uid] || null);
      },
      async set(uid, data) {
        mem.progress[uid] = clone(data);
        persist();
      },
    },

    friends: {
      async set(a, b, status) {
        const r = mem.friends.find((x) => x.user_id === a && x.friend_id === b);
        if (r) r.status = status;
        else mem.friends.push({ user_id: a, friend_id: b, status });
        persist();
      },
      async get(a, b) {
        return clone(mem.friends.find((x) => x.user_id === a && x.friend_id === b) || null);
      },
      async listFor(uid) {
        return clone(mem.friends.filter((x) => x.user_id === uid));
      },
      async incoming(uid) {
        return clone(mem.friends.filter((x) => x.friend_id === uid && x.status === 'pending'));
      },
      async remove(a, b) {
        mem.friends = mem.friends.filter(
          (x) => !((x.user_id === a && x.friend_id === b) || (x.user_id === b && x.friend_id === a))
        );
        persist();
      },
      async expOf(ids) {
        const out = {};
        ids.forEach((id) => {
          if (mem.progress[id]) out[id] = clone(mem.progress[id]);
        });
        return out;
      },
    },

    leaderboard: {
      async top(limit) {
        return clone(
          mem.users
            .map((u) => ({
              id: u.id,
              username: u.username,
              display_name: u.display_name,
              avatar: u.avatar,
              data: mem.progress[u.id] || {},
            }))
            .sort((a, b) => (b.data.exp || 0) - (a.data.exp || 0))
            .slice(0, limit)
        );
      },
      async count() {
        return mem.users.length;
      },
    },
  };
}

const db = USE_PG ? pgDriver() : fileDriver();

db.ready = db.init().then(() => {
  console.log(`[db] ใช้ที่เก็บข้อมูลแบบ ${db.kind}`);
  setInterval(() => db.sessions.purge().catch(() => {}), 6 * 60 * 60 * 1000).unref?.();
});

module.exports = db;
