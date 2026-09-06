/* ==========================================================
   คลังความรู้ความมั่นคงปลอดภัยไซเบอร์ — สคริปต์หลัก
   ========================================================== */

/* ---------- 1. ความคืบหน้าของผู้เรียน ---------- */

const STORE_KEY = 'cyberacademy.progress.v1';

const RANKS = [
  'ผู้เฝ้าระวังฝึกหัด',
  'นักสังเกตการณ์',
  'ผู้พิทักษ์ข้อมูล',
  'นักวิเคราะห์ภัยคุกคาม',
  'วิศวกรความปลอดภัย',
  'ผู้ตอบสนองเหตุการณ์',
  'สถาปนิกความมั่นคง',
  'ผู้เชี่ยวชาญไซเบอร์',
  'ที่ปรึกษาความมั่นคงไซเบอร์',
  'ปรมาจารย์ไซเบอร์',
];

const blank = () => ({ v: 1, exp: 0, lessons: {}, ex: {}, labs: {}, quiz: {}, badges: {} });

let S = load();
let ME = null; // ผู้ใช้ที่ล็อกอินอยู่ เป็น null เมื่อใช้งานแบบผู้เยี่ยมชม
let syncTimer = null;
let syncing = false;

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return blank();
    return Object.assign(blank(), JSON.parse(raw));
  } catch (e) {
    return blank();
  }
}
function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(S));
  } catch (e) {
    /* โหมดส่วนตัวของเบราว์เซอร์อาจบันทึกไม่ได้ */
  }
  scheduleSync();
}

/* ---------- 1.1 เรียก API และซิงก์ความคืบหน้า ---------- */

async function api(path, opt = {}) {
  const r = await fetch('/api' + path, {
    method: opt.method || 'GET',
    headers: opt.body ? { 'Content-Type': 'application/json' } : undefined,
    body: opt.body ? JSON.stringify(opt.body) : undefined,
    credentials: 'same-origin',
  });
  let data = {};
  try {
    data = await r.json();
  } catch (e) {
    /* บางคำตอบอาจไม่มีเนื้อหา */
  }
  if (!r.ok) throw new Error(data.error || 'เกิดข้อผิดพลาด (' + r.status + ')');
  return data;
}

function scheduleSync() {
  if (!ME) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(pushProgress, 1200);
}

async function pushProgress() {
  if (!ME || syncing) return;
  syncing = true;
  try {
    await api('/progress', { method: 'PUT', body: { progress: S } });
  } catch (e) {
    console.warn('ซิงก์ความคืบหน้าไม่สำเร็จ', e.message);
  }
  syncing = false;
}

/** รวมความคืบหน้าสองชุดเข้าด้วยกัน โดยยึดผลที่ดีกว่าเป็นหลัก */
function mergeProgress(a, b) {
  const out = blank();
  out.exp = Math.max(a.exp || 0, b.exp || 0);
  ['lessons', 'labs', 'badges'].forEach((k) => Object.assign(out[k], a[k] || {}, b[k] || {}));
  const ex = Object.assign({}, a.ex || {}, b.ex || {});
  Object.keys(ex).forEach((k) => {
    if ((a.ex || {})[k] === 'ok' || (b.ex || {})[k] === 'ok') ex[k] = 'ok';
  });
  out.ex = ex;
  const q = Object.assign({}, a.quiz || {});
  Object.entries(b.quiz || {}).forEach(([k, v]) => {
    if (!q[k] || (v && v.score > q[k].score)) q[k] = v;
  });
  out.quiz = q;
  return out;
}

/** อ่านสถานะผู้ใช้จากเซิร์ฟเวอร์ตอนเปิดหน้าเว็บ */
async function loadMe() {
  try {
    const { user } = await api('/me');
    ME = user;
    if (ME) {
      const { progress } = await api('/progress');
      if (progress) {
        const merged = mergeProgress(progress, S);
        const changed = JSON.stringify(merged) !== JSON.stringify(progress);
        S = merged;
        localStorage.setItem(STORE_KEY, JSON.stringify(S));
        if (changed) pushProgress();
      } else {
        pushProgress();
      }
    }
  } catch (e) {
    ME = null; // เซิร์ฟเวอร์มีปัญหา ใช้งานต่อแบบผู้เยี่ยมชมได้
  }
  paintXP();
  paintAcct();
}

/** ตัวย่อของชื่อ ใช้แสดงแทนรูปเมื่อยังไม่ได้ตั้งรูปโปรไฟล์ */
const initial = (u) => (u && u.displayName ? [...u.displayName.trim()][0] : '?');

function avatarEl(u, cls) {
  if (u && u.avatar)
    return h('img', { class: 'avatar ' + (cls || ''), src: u.avatar, alt: u.displayName || '' });
  return h('div', { class: 'avatar ' + (cls || '') }, initial(u));
}

function paintAcct() {
  const box = document.getElementById('acct');
  box.innerHTML = '';
  if (!ME) {
    box.appendChild(
      h('a', { class: 'acctbtn plain', href: '#/login', style: 'text-decoration:none' }, 'เข้าสู่ระบบ')
    );
    return;
  }
  const btn = h('button', { class: 'acctbtn' }, avatarEl(ME), h('span', {}, ME.displayName));
  const menu = h(
    'div',
    { class: 'acctmenu', hidden: 'hidden' },
    h('div', { class: 'who' }, h('b', {}, ME.displayName), '@' + ME.username),
    h('div', { class: 'sep' }),
    h('a', { href: '#/profile' }, 'โปรไฟล์ของฉัน'),
    h('a', { href: '#/friends' }, 'เพื่อน'),
    h('a', { href: '#/leaderboard' }, 'กระดานคะแนน'),
    h('div', { class: 'sep' }),
    h(
      'button',
      {
        onclick: async () => {
          await pushProgress();
          try {
            await api('/auth/logout', { method: 'POST' });
          } catch (e) {}
          ME = null;
          paintAcct();
          toast('ออกจากระบบแล้ว ความคืบหน้ายังอยู่ในเครื่องนี้');
          location.hash = '#/';
        },
      },
      'ออกจากระบบ'
    )
  );
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
  });
  document.addEventListener('click', () => (menu.hidden = true));
  menu.addEventListener('click', () => (menu.hidden = true));
  box.append(btn, menu);
}

// เกณฑ์ EXP สะสมของแต่ละระดับ: T(n) = 30 * (n² − 1)
const need = (n) => 30 * (n * n - 1);
function levelInfo(exp) {
  let lv = 1;
  while (lv < RANKS.length && exp >= need(lv + 1)) lv++;
  const base = need(lv);
  const next = lv < RANKS.length ? need(lv + 1) : base;
  const span = Math.max(1, next - base);
  return {
    level: lv,
    rank: RANKS[lv - 1],
    pct: lv >= RANKS.length ? 100 : Math.min(100, Math.round(((exp - base) / span) * 100)),
    next,
    max: lv >= RANKS.length,
  };
}

function addExp(n, why) {
  if (!n) return;
  const before = levelInfo(S.exp).level;
  S.exp += n;
  save();
  paintXP();
  toast(`+${n} EXP · ${why}`);
  const after = levelInfo(S.exp).level;
  if (after > before) {
    setTimeout(() => toast(`เลื่อนระดับเป็น ${after} — ${RANKS[after - 1]}`, 'teal'), 500);
  }
}

function toast(msg, kind) {
  const box = document.getElementById('toaster');
  const t = document.createElement('div');
  t.className = 'toast' + (kind ? ' ' + kind : '');
  t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 400);
  }, 3200);
}

function paintXP() {
  const i = levelInfo(S.exp);
  document.getElementById('lvNum').textContent = i.level;
  document.getElementById('rankName').textContent = i.rank;
  document.getElementById('xpText').textContent = i.max
    ? `${S.exp} EXP · ระดับสูงสุด`
    : `${S.exp} / ${i.next} EXP`;
  document.getElementById('xpFill').style.width = i.pct + '%';
  document.getElementById('xpRing').style.setProperty('--p', i.pct + '%');
}

/* ---------- 2. ข้อมูลเนื้อหา ---------- */

let INDEX = null;
const DETAIL = {};

async function getIndex() {
  if (!INDEX) INDEX = await (await fetch('/api/courses')).json();
  return INDEX;
}
async function getCourse(id) {
  if (!DETAIL[id]) {
    const r = await fetch('/api/courses/' + encodeURIComponent(id));
    if (!r.ok) return null;
    DETAIL[id] = await r.json();
  }
  return DETAIL[id];
}

const isExercise = (b) => ['quiz', 'multi', 'tf', 'fill', 'match', 'order'].includes(b.type);

function courseStats(c) {
  const total = c.lessons.length + (c.hasFinalQuiz || c.finalQuiz ? 1 : 0);
  let done = c.lessons.filter((l) => S.lessons[c.id + '/' + l.id]).length;
  if ((c.hasFinalQuiz || c.finalQuiz) && S.quiz[c.id]) done++;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

/* ---------- 3. เครื่องมือช่วยสร้าง DOM ---------- */

function h(tag, attrs, ...kids) {
  const n = document.createElement(tag);
  if (attrs)
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') n.className = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined && v !== false) n.setAttribute(k, v);
    }
  for (const kid of kids.flat()) {
    if (kid === null || kid === undefined || kid === false) continue;
    n.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
  }
  return n;
}
const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/* ---------- 4. เราเตอร์ ---------- */

const main = () => document.getElementById('main');

// ตัวจับเวลาและตัวฟังเหตุการณ์ของหน้าบทเรียน ต้องล้างทุกครั้งที่เปลี่ยนหน้า
let lessonTimer = null;
let lessonScroll = null;
let lessonProgress = null;

function clearLessonWatchers() {
  if (lessonTimer) clearInterval(lessonTimer);
  lessonTimer = null;
  if (lessonScroll) window.removeEventListener('scroll', lessonScroll);
  lessonScroll = null;
  if (lessonProgress) document.removeEventListener('ca:progress', lessonProgress);
  lessonProgress = null;
}

async function route() {
  const hash = location.hash.replace(/^#/, '') || '/';
  const p = hash.split('/').filter(Boolean);
  window.scrollTo(0, 0);
  closeNav();
  clearLessonWatchers();
  main().innerHTML = '<p class="empty">กำลังโหลด…</p>';

  try {
    if (p[0] === 'c' && p[1]) await viewCourse(p[1]);
    else if (p[0] === 'l' && p[1] && p[2]) await viewLesson(p[1], p[2]);
    else if (p[0] === 'q' && p[1]) await viewFinal(p[1]);
    else if (p[0] === 'login') await viewAuth('login');
    else if (p[0] === 'register') await viewAuth('register');
    else if (p[0] === 'profile') await viewProfile();
    else if (p[0] === 'friends') await viewFriends();
    else if (p[0] === 'leaderboard') await viewLeaderboard();
    else if (p[0] === 'ctfboard') await viewCtfBoard();
    else await viewHome();
  } catch (e) {
    console.error(e);
    main().innerHTML =
      '<p class="empty">โหลดเนื้อหาไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง หากยังไม่ได้ให้ตรวจสอบว่าเซิร์ฟเวอร์ทำงานอยู่</p>';
  }
  buildTOC();
  main().focus({ preventScroll: true });
}

/* ---------- 5. สารบัญด้านข้าง ---------- */

async function buildTOC() {
  const idx = await getIndex();
  const toc = document.getElementById('toc');
  const cur = location.hash.replace(/^#/, '');
  toc.innerHTML = '';

  idx.forEach((c) => {
    const st = courseStats(c);
    const box = h('div', { class: 'toc-course' });
    const head = h(
      'a',
      {
        class: 'toc-head' + (st.pct === 100 ? ' done' : st.done > 0 ? ' partial' : ''),
        href: '#/c/' + c.id,
        style: 'text-decoration:none',
      },
      h('span', { class: 'dot' }),
      h('span', {}, c.title)
    );
    box.appendChild(head);

    const ul = h('ul', { class: 'toc-list' });
    c.lessons.forEach((l) => {
      const href = `/l/${c.id}/${l.id}`;
      ul.appendChild(
        h(
          'li',
          {},
          h(
            'a',
            {
              href: '#' + href,
              class:
                (S.lessons[c.id + '/' + l.id] ? 'done ' : '') + (cur === href ? 'active' : ''),
            },
            h('span', {}, l.title)
          )
        )
      );
    });
    if (c.hasFinalQuiz) {
      const href = `/q/${c.id}`;
      ul.appendChild(
        h(
          'li',
          {},
          h(
            'a',
            {
              href: '#' + href,
              class:
                'quiz ' + (S.quiz[c.id] ? 'done ' : '') + (cur === href ? 'active' : ''),
            },
            h('span', {}, 'แบบทดสอบท้ายหมวด')
          )
        )
      );
    }
    box.appendChild(ul);
    toc.appendChild(box);
  });
}

/* ---------- 6. หน้าแรก ---------- */

async function viewHome() {
  const idx = await getIndex();
  const m = main();
  m.innerHTML = '';

  const totalLessons = idx.reduce((a, c) => a + c.lessons.length, 0);
  const doneLessons = idx.reduce(
    (a, c) => a + c.lessons.filter((l) => S.lessons[c.id + '/' + l.id]).length,
    0
  );
  const info = levelInfo(S.exp);

  m.appendChild(
    h(
      'section',
      { class: 'hero' },
      h('h1', {}, 'อ่านทบทวนความมั่นคงปลอดภัยไซเบอร์'),
      h(
        'p',
        {},
        'เนื้อหาแบบละเอียดพร้อมแบบฝึกหัดคั่นระหว่างอ่านและแล็บให้ลงมือทำจริง เก็บ EXP ไปเรื่อย ๆ ความคืบหน้าถูกบันทึกไว้ในเครื่องของคุณ'
      ),
      h(
        'div',
        { class: 'herostats' },
        h('div', {}, h('b', {}, String(S.exp)), h('small', {}, 'EXP สะสม')),
        h('div', {}, h('b', {}, 'ระดับ ' + info.level), h('small', {}, info.rank)),
        h('div', {}, h('b', {}, `${doneLessons}/${totalLessons}`), h('small', {}, 'บทเรียนที่อ่านจบ')),
        h(
          'div',
          {},
          h('b', {}, String(Object.keys(S.labs).length)),
          h('small', {}, 'แล็บที่ทำสำเร็จ')
        )
      )
    )
  );

  m.appendChild(h('p', { class: 'sect-title' }, 'หมวดเนื้อหา'));
  const cards = h('div', { class: 'cards' });
  idx.forEach((c) => {
    const st = courseStats(c);
    cards.appendChild(
      h(
        'a',
        { class: 'card', href: '#/c/' + c.id },
        h('div', { class: 'code' }, c.code || ''),
        h('h3', {}, c.title),
        h('p', {}, c.subtitle || ''),
        h('div', { class: 'meter' }, h('i', { style: `width:${st.pct}%` })),
        h(
          'div',
          { class: 'metertext' },
          h('span', {}, `${c.lessons.length} บทเรียน`),
          h('span', {}, `${st.pct}%`)
        )
      )
    );
  });
  m.appendChild(cards);

  // เหรียญตรา
  const badges = [];
  idx.forEach((c) => {
    const st = courseStats(c);
    badges.push({ on: st.pct === 100, icon: '🎓', label: 'จบหมวด' + (c.code ? ' ' + c.code : '') });
  });
  badges.push({ on: Object.keys(S.labs).length >= 4, icon: '🧪', label: 'ทำแล็บครบ 4 รายการ' });
  badges.push({
    on: Object.values(S.quiz).some((q) => q && q.score === q.total),
    icon: '🏅',
    label: 'ทำแบบทดสอบท้ายหมวดได้เต็ม',
  });
  badges.push({ on: S.exp >= 1000, icon: '⚡', label: 'สะสมครบ 1,000 EXP' });

  m.appendChild(h('p', { class: 'sect-title', style: 'margin-top:34px' }, 'เหรียญตรา'));
  const bb = h('div', { class: 'badgebox' });
  badges.forEach((b) =>
    bb.appendChild(h('div', { class: 'badge' + (b.on ? '' : ' off') }, h('i', {}, b.icon), b.label))
  );
  m.appendChild(bb);
}

/* ---------- 7. หน้าหมวด ---------- */

async function viewCourse(cid) {
  const c = await getCourse(cid);
  if (!c) return (main().innerHTML = '<p class="empty">ไม่พบหมวดเนื้อหานี้</p>');
  const m = main();
  m.innerHTML = '';

  m.appendChild(h('div', { class: 'crumb' }, h('a', { href: '#/' }, 'หน้าแรก'), ' / ' + (c.code || '')));
  m.appendChild(h('h1', { class: 'page' }, c.title));
  m.appendChild(h('p', { class: 'lead' }, c.summary || ''));

  if (c.objectives && c.objectives.length) {
    m.appendChild(
      h(
        'div',
        { class: 'objbox' },
        h('h4', {}, 'เมื่อเรียนจบหมวดนี้ คุณจะสามารถ'),
        h('ul', {}, c.objectives.map((o) => h('li', {}, o)))
      )
    );
  }

  // ปุ่มลัดสำหรับหมวด CTF
  if (c.id === 'ctf') {
    m.appendChild(
      h(
        'div',
        { class: 'btnrow', style: 'margin:0 0 26px' },
        h('a', { class: 'btn gold', href: '#/ctfboard', style: 'text-decoration:none' }, 'เปิดกระดานโจทย์ Jeopardy'),
        h('a', { class: 'btn ghost', href: '#/leaderboard', style: 'text-decoration:none' }, 'ดูกระดานคะแนน')
      )
    );
  }

  const list = h('div', { class: 'lessonlist' });
  c.lessons.forEach((l, i) => {
    const done = !!S.lessons[c.id + '/' + l.id];
    list.appendChild(
      h(
        'a',
        { class: 'lessonrow' + (done ? ' done' : ''), href: `#/l/${c.id}/${l.id}` },
        h('span', { class: 'n' }, done ? '✓' : String(i + 1)),
        h('span', {}, h('b', {}, l.title), h('small', {}, l.blurb || '')),
        h('span', { class: 't' }, `${l.minutes || 20} นาที`)
      )
    );
  });

  if (c.finalQuiz && c.finalQuiz.length) {
    const q = S.quiz[c.id];
    list.appendChild(
      h(
        'a',
        { class: 'lessonrow' + (q ? ' done' : ''), href: `#/q/${c.id}` },
        h('span', { class: 'n' }, q ? '✓' : '★'),
        h(
          'span',
          {},
          h('b', {}, 'แบบทดสอบท้ายหมวด'),
          h('small', {}, q ? `ทำแล้ว ได้ ${q.score} จาก ${q.total} ข้อ` : `${c.finalQuiz.length} ข้อ`)
        ),
        h('span', { class: 't' }, 'สรุปความเข้าใจ')
      )
    );
  }
  m.appendChild(list);
}

/* ---------- 8. หน้าบทเรียน ---------- */

async function viewLesson(cid, lid) {
  const c = await getCourse(cid);
  if (!c) return (main().innerHTML = '<p class="empty">ไม่พบหมวดเนื้อหานี้</p>');
  const i = c.lessons.findIndex((l) => l.id === lid);
  if (i < 0) return (main().innerHTML = '<p class="empty">ไม่พบบทเรียนนี้</p>');
  const L = c.lessons[i];

  const m = main();
  m.innerHTML = '';
  m.appendChild(
    h(
      'div',
      { class: 'crumb' },
      h('a', { href: '#/' }, 'หน้าแรก'),
      ' / ',
      h('a', { href: '#/c/' + c.id }, c.title),
      ` / บทที่ ${i + 1}`
    )
  );
  m.appendChild(h('h1', { class: 'page' }, L.title));
  if (L.blurb) m.appendChild(h('p', { class: 'lead' }, L.blurb));

  const art = h('article', { class: 'reader' });
  L.blocks.forEach((b, bi) => art.appendChild(renderBlock(b, `${c.id}.${L.id}.${bi}`)));
  m.appendChild(art);

  // ── กล่องจบบทเรียน พร้อมเงื่อนไขที่ต้องผ่านก่อน ─────────────
  const key = c.id + '/' + L.id;
  const exKeys = [];
  const labKeys = [];
  L.blocks.forEach((b, bi) => {
    if (isExercise(b)) exKeys.push(`${c.id}.${L.id}.${bi}`);
    if (b.type === 'lab') labKeys.push(`${c.id}.${L.id}.${bi}`);
  });

  // เวลาอ่านขั้นต่ำ คิดจาก 40% ของเวลาที่ประเมินไว้ อย่างน้อย 2 นาที
  const needSec = Math.max(120, Math.round((L.minutes || 20) * 60 * 0.4));
  let spent = 0;
  let reachedEnd = false;

  const fin = h('div', { class: 'finishbox gate' });
  m.appendChild(fin);

  const countOk = (keys) => keys.filter((k) => S.ex[k] === 'ok').length;
  const countLabs = (keys) => keys.filter((k) => S.labs[k]).length;

  function requirements() {
    const r = [
      {
        ok: spent >= needSec,
        label: `ใช้เวลากับบทนี้อย่างน้อย ${Math.round(needSec / 60)} นาที`,
        detail:
          spent >= needSec
            ? ''
            : `เหลืออีก ${Math.ceil((needSec - spent) / 60)} นาที (นับเฉพาะตอนเปิดหน้านี้อยู่)`,
      },
      { ok: reachedEnd, label: 'เลื่อนอ่านจนถึงท้ายบท', detail: reachedEnd ? '' : 'ยังอ่านไม่ถึงท้ายบท' },
    ];
    if (exKeys.length) {
      const n = countOk(exKeys);
      r.push({
        ok: n === exKeys.length,
        label: `ตอบแบบฝึกหัดในบทให้ถูกครบทุกข้อ`,
        detail: `ตอบถูกแล้ว ${n} จาก ${exKeys.length} ข้อ`,
      });
    }
    if (labKeys.length) {
      const n = countLabs(labKeys);
      r.push({
        ok: n === labKeys.length,
        label: 'ทำแล็บในบทให้สำเร็จครบ',
        detail: `สำเร็จแล้ว ${n} จาก ${labKeys.length} แล็บ`,
      });
    }
    return r;
  }

  function paintFin() {
    fin.innerHTML = '';
    if (S.lessons[key]) {
      fin.className = 'finishbox done';
      fin.appendChild(h('h3', {}, 'เรียนจบบทนี้แล้ว'));
      fin.appendChild(h('p', {}, 'กลับมาอ่านทบทวนซ้ำได้ตลอดเวลา ความคืบหน้าจะไม่หายไป'));
      return;
    }
    fin.className = 'finishbox gate';
    const reqs = requirements();
    const all = reqs.every((r) => r.ok);

    fin.appendChild(h('h3', {}, all ? 'ครบทุกเงื่อนไขแล้ว' : 'ยังเรียนไม่จบบทนี้'));
    fin.appendChild(
      h(
        'p',
        {},
        all
          ? `กดยืนยันเพื่อรับ ${L.exp || 60} EXP`
          : 'ทำให้ครบทุกข้อด้านล่างก่อน จึงจะบันทึกว่าเรียนจบได้'
      )
    );

    const ul = h('ul', { class: 'reqlist' });
    reqs.forEach((r) =>
      ul.appendChild(
        h(
          'li',
          { class: r.ok ? 'ok' : '' },
          h('span', { class: 'mark' }, r.ok ? '✓' : '○'),
          h('span', {}, h('b', {}, r.label), r.detail ? h('small', {}, r.detail) : null)
        )
      )
    );
    fin.appendChild(ul);

    const btn = h(
      'button',
      {
        class: 'btn gold',
        disabled: all ? null : 'disabled',
        onclick: () => {
          if (!requirements().every((r) => r.ok)) return;
          S.lessons[key] = true;
          save();
          addExp(L.exp || 60, 'เรียนจบ ' + L.title);
          paintFin();
          buildTOC();
        },
      },
      'บันทึกว่าเรียนจบบทนี้'
    );
    fin.appendChild(btn);
  }

  paintFin();

  // นับเวลาเฉพาะตอนที่ผู้เรียนเปิดหน้านี้อยู่จริง
  lessonTimer = setInterval(() => {
    if (document.visibilityState === 'visible' && !S.lessons[key]) {
      spent++;
      if (spent <= needSec + 1) paintFin();
    }
  }, 1000);

  const onScroll = () => {
    if (reachedEnd) return;
    const r = fin.getBoundingClientRect();
    if (r.top < window.innerHeight - 40) {
      reachedEnd = true;
      paintFin();
    }
  };
  lessonScroll = onScroll;
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  lessonProgress = () => paintFin();
  document.addEventListener('ca:progress', lessonProgress);

  // ตัวนำทางบท
  const prev = c.lessons[i - 1];
  const next = c.lessons[i + 1];
  m.appendChild(
    h(
      'div',
      { class: 'pager' },
      prev
        ? h('a', { class: 'btn ghost', href: `#/l/${c.id}/${prev.id}` }, '← ' + prev.title)
        : h('span', {}),
      next
        ? h('a', { class: 'btn ghost', href: `#/l/${c.id}/${next.id}` }, next.title + ' →')
        : c.finalQuiz && c.finalQuiz.length
        ? h('a', { class: 'btn ghost', href: `#/q/${c.id}` }, 'แบบทดสอบท้ายหมวด →')
        : h('span', {})
    )
  );
}

/* ---------- 9. แบบทดสอบท้ายหมวด ---------- */

async function viewFinal(cid) {
  const c = await getCourse(cid);
  if (!c || !c.finalQuiz) return (main().innerHTML = '<p class="empty">ไม่พบแบบทดสอบ</p>');
  const m = main();
  m.innerHTML = '';
  m.appendChild(
    h(
      'div',
      { class: 'crumb' },
      h('a', { href: '#/' }, 'หน้าแรก'),
      ' / ',
      h('a', { href: '#/c/' + c.id }, c.title)
    )
  );
  m.appendChild(h('h1', { class: 'page' }, 'แบบทดสอบท้ายหมวด'));
  m.appendChild(
    h(
      'p',
      { class: 'lead' },
      'ทำให้ครบทุกข้อแล้วกดส่งคำตอบ ระบบจะเฉลยพร้อมคำอธิบายรายข้อ ทำซ้ำได้ไม่จำกัดครั้ง'
    )
  );

  const prev = S.quiz[c.id];
  if (prev) {
    m.appendChild(
      h(
        'div',
        { class: 'scoreboard' },
        h('div', { class: 'big' }, `${prev.score}/${prev.total}`),
        h('p', {}, 'คะแนนครั้งล่าสุดของคุณ')
      )
    );
  }

  const art = h('article', { class: 'reader' });
  const items = [];
  c.finalQuiz.forEach((b, bi) => {
    const node = renderBlock(b, `${c.id}.final.${bi}`, { silent: true });
    items.push(node);
    art.appendChild(node);
  });
  m.appendChild(art);

  const out = h('div', { class: 'finishbox' });
  out.appendChild(
    h(
      'button',
      {
        class: 'btn gold',
        onclick: () => {
          let score = 0;
          items.forEach((n) => {
            if (n.__check && n.__check()) score++;
          });
          const total = items.length;
          const before = S.quiz[c.id];
          S.quiz[c.id] = { score, total };
          save();
          const gain = score * 15 + (score === total ? 30 : 0);
          if (!before || before.score < score) addExp(gain, 'แบบทดสอบท้ายหมวด');
          out.innerHTML = '';
          out.appendChild(h('h3', {}, `ได้ ${score} จาก ${total} ข้อ`));
          out.appendChild(
            h(
              'p',
              {},
              score === total
                ? 'ตอบถูกทุกข้อ เยี่ยมมาก ลองไปต่อที่หมวดถัดไปได้เลย'
                : 'เลื่อนขึ้นไปอ่านคำอธิบายของข้อที่ตอบผิด แล้วกลับมาทำใหม่ได้'
            )
          );
          out.appendChild(h('a', { class: 'btn ghost', href: '#/c/' + c.id }, 'กลับไปหน้าหมวด'));
          buildTOC();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      },
      'ส่งคำตอบ'
    )
  );
  m.appendChild(out);
}

/* ---------- 9.1 หน้าเข้าสู่ระบบและสมัครสมาชิก ---------- */

async function viewAuth(mode) {
  const m = main();
  m.innerHTML = '';
  if (ME) {
    location.hash = '#/profile';
    return;
  }
  const reg = mode === 'register';
  const box = h('div', { class: 'authbox' });
  box.appendChild(h('h1', {}, reg ? 'สร้างบัญชีใหม่' : 'เข้าสู่ระบบ'));
  box.appendChild(
    h(
      'p',
      { class: 'sub' },
      reg
        ? 'มีบัญชีแล้วจะเรียนต่อจากเครื่องไหนก็ได้ ตั้งรูปโปรไฟล์และเพิ่มเพื่อนเพื่อเทียบความคืบหน้ากันได้'
        : 'ความคืบหน้าที่สะสมไว้ในเครื่องนี้จะถูกรวมเข้ากับบัญชีของคุณโดยอัตโนมัติ'
    )
  );

  const err = h('div', { class: 'formerr', hidden: 'hidden' });
  box.appendChild(err);

  const f = {};
  const field = (key, label, attrs, hint) => {
    f[key] = h('input', attrs);
    const wrap = h('div', { class: 'field' }, h('label', {}, label), f[key]);
    if (hint) wrap.appendChild(h('div', { class: 'hint' }, hint));
    box.appendChild(wrap);
  };

  if (reg) {
    field('displayName', 'ชื่อที่แสดง', { type: 'text', placeholder: 'เช่น ครูสมชาย ใจดี', maxlength: '40' });
    field('username', 'ชื่อผู้ใช้', { type: 'text', placeholder: 'somchai', maxlength: '20' }, 'ยาว 3–20 ตัว ใช้ได้เฉพาะ a-z ตัวเลข จุด และขีดล่าง เพื่อนจะใช้ชื่อนี้ค้นหาคุณ');
    field('email', 'อีเมล', { type: 'email', placeholder: 'you@example.com', autocomplete: 'email' });
    field('password', 'รหัสผ่าน', { type: 'password', autocomplete: 'new-password' }, 'อย่างน้อย 8 ตัวอักษร แนะนำให้ใช้วลียาว ๆ ตามที่เรียนในบทที่ 3');
  } else {
    field('identifier', 'อีเมลหรือชื่อผู้ใช้', { type: 'text', autocomplete: 'username' });
    field('password', 'รหัสผ่าน', { type: 'password', autocomplete: 'current-password' });
  }

  const btn = h('button', { class: 'btn gold' }, reg ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ');
  box.appendChild(h('div', { class: 'btnrow' }, btn));
  box.appendChild(
    h(
      'div',
      { class: 'authalt' },
      reg ? 'มีบัญชีอยู่แล้ว ' : 'ยังไม่มีบัญชี ',
      h('a', { href: reg ? '#/login' : '#/register' }, reg ? 'เข้าสู่ระบบที่นี่' : 'สมัครสมาชิกที่นี่')
    )
  );
  box.appendChild(
    h(
      'p',
      { class: 'hint', style: 'margin-top:14px' },
      'จะใช้งานต่อโดยไม่สมัครสมาชิกก็ได้ ความคืบหน้าจะถูกเก็บไว้เฉพาะในเบราว์เซอร์เครื่องนี้'
    )
  );

  async function submit() {
    err.hidden = true;
    btn.disabled = true;
    btn.textContent = 'กำลังดำเนินการ…';
    try {
      const body = {};
      Object.entries(f).forEach(([k, el]) => (body[k] = el.value));
      if (reg) body.progress = S;
      const { user } = await api(reg ? '/auth/register' : '/auth/login', { method: 'POST', body });
      ME = user;
      const { progress } = await api('/progress');
      if (progress) {
        S = mergeProgress(progress, S);
        localStorage.setItem(STORE_KEY, JSON.stringify(S));
        pushProgress();
      }
      paintXP();
      paintAcct();
      toast(reg ? 'สมัครสมาชิกเรียบร้อย ยินดีต้อนรับ' : 'เข้าสู่ระบบเรียบร้อย', 'teal');
      location.hash = '#/profile';
    } catch (e) {
      err.hidden = false;
      err.textContent = e.message;
      btn.disabled = false;
      btn.textContent = reg ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ';
    }
  }
  btn.addEventListener('click', submit);
  Object.values(f).forEach((el) =>
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit();
    })
  );

  m.appendChild(box);
  (f.displayName || f.identifier).focus();
}

/* ---------- 9.2 หน้าโปรไฟล์ ---------- */

async function viewProfile() {
  const m = main();
  m.innerHTML = '';
  if (!ME) {
    m.appendChild(
      h(
        'div',
        { class: 'authbox' },
        h('h1', {}, 'ยังไม่ได้เข้าสู่ระบบ'),
        h('p', { class: 'sub' }, 'เข้าสู่ระบบเพื่อตั้งรูปโปรไฟล์ เพิ่มเพื่อน และเรียนต่อได้จากทุกเครื่อง'),
        h('div', { class: 'btnrow' }, h('a', { class: 'btn gold', href: '#/login', style: 'text-decoration:none' }, 'เข้าสู่ระบบ'), h('a', { class: 'btn ghost', href: '#/register', style: 'text-decoration:none' }, 'สมัครสมาชิก'))
      )
    );
    return;
  }

  const info = levelInfo(S.exp);
  const av = avatarEl(ME, 'big');

  const head = h(
    'div',
    { class: 'profhead' },
    av,
    h(
      'div',
      {},
      h('h1', {}, ME.displayName),
      h('div', { class: 'uname' }, '@' + ME.username),
      h(
        'div',
        { class: 'statrow' },
        h('div', {}, h('b', {}, 'ระดับ ' + info.level), h('small', {}, info.rank)),
        h('div', {}, h('b', {}, String(S.exp)), h('small', {}, 'EXP สะสม')),
        h('div', {}, h('b', {}, String(Object.keys(S.lessons).length)), h('small', {}, 'บทเรียนที่จบ')),
        h('div', {}, h('b', {}, String(Object.keys(S.labs).length)), h('small', {}, 'แล็บที่สำเร็จ'))
      )
    )
  );
  m.appendChild(head);

  /* ตั้งรูปโปรไฟล์ */
  const msg = h('div', { class: 'formok', hidden: 'hidden' });
  const fileIn = h('input', { type: 'file', accept: 'image/png,image/jpeg,image/webp', hidden: 'hidden' });
  const nameIn = h('input', { type: 'text', value: ME.displayName, maxlength: '40' });

  const card = h('div', { class: 'authbox', style: 'max-width:520px' });
  card.appendChild(h('h1', { style: 'font-size:21px' }, 'แก้ไขโปรไฟล์'));
  card.appendChild(msg);
  card.appendChild(h('div', { class: 'field' }, h('label', {}, 'ชื่อที่แสดง'), nameIn));
  card.appendChild(
    h(
      'div',
      { class: 'field' },
      h('label', {}, 'รูปโปรไฟล์'),
      h(
        'div',
        { class: 'btnrow' },
        h('button', { class: 'btn ghost sm', onclick: () => fileIn.click() }, 'เลือกรูปจากเครื่อง'),
        ME.avatar
          ? h(
              'button',
              {
                class: 'btn danger sm',
                onclick: () => saveProfile({ avatar: '' }),
              },
              'ลบรูปออก'
            )
          : null,
        fileIn
      ),
      h('div', { class: 'hint' }, 'ระบบจะย่อรูปให้เหลือ 256 พิกเซลในเบราว์เซอร์ก่อนอัปโหลด จึงใช้พื้นที่น้อยและอัปโหลดเร็ว')
    )
  );
  card.appendChild(
    h(
      'div',
      { class: 'btnrow' },
      h('button', { class: 'btn gold', onclick: () => saveProfile({ displayName: nameIn.value }) }, 'บันทึก')
    )
  );
  m.appendChild(card);

  async function saveProfile(patch) {
    try {
      const { user } = await api('/me', { method: 'PATCH', body: patch });
      ME = user;
      paintAcct();
      msg.hidden = false;
      msg.className = 'formok';
      msg.textContent = 'บันทึกเรียบร้อย';
      if (patch.avatar !== undefined) viewProfile();
    } catch (e) {
      msg.hidden = false;
      msg.className = 'formerr';
      msg.textContent = e.message;
    }
  }

  fileIn.addEventListener('change', async () => {
    const file = fileIn.files[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file, 256);
      await saveProfile({ avatar: dataUrl });
    } catch (e) {
      msg.hidden = false;
      msg.className = 'formerr';
      msg.textContent = 'อ่านไฟล์รูปไม่สำเร็จ';
    }
    fileIn.value = '';
  });
}

/** ย่อรูปในเบราว์เซอร์ให้เป็นสี่เหลี่ยมจัตุรัสแล้วคืนค่าเป็น data URL */
function resizeImage(file, size) {
  return new Promise((res, rej) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const side = Math.min(img.width, img.height);
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      res(c.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      rej(new Error('bad image'));
    };
    img.src = url;
  });
}

/* ---------- 9.3 หน้าเพื่อน ---------- */

async function viewFriends() {
  const m = main();
  m.innerHTML = '';
  if (!ME) {
    location.hash = '#/login';
    return;
  }
  m.appendChild(h('h1', { class: 'page' }, 'เพื่อน'));
  m.appendChild(
    h('p', { class: 'lead' }, 'เพิ่มเพื่อนด้วยชื่อผู้ใช้ แล้วดูว่าใครเรียนไปถึงไหนแล้วบ้าง เห็นเฉพาะระดับและ EXP ไม่เห็นคำตอบของกันและกัน')
  );

  const err = h('div', { class: 'formerr', hidden: 'hidden' });
  const q = h('input', { type: 'text', placeholder: 'พิมพ์ชื่อผู้ใช้หรือชื่อที่แสดง', maxlength: '40' });
  const results = h('div', {});
  m.appendChild(
    h(
      'div',
      { class: 'authbox', style: 'max-width:560px;margin-bottom:30px' },
      h('h1', { style: 'font-size:20px' }, 'ค้นหาเพื่อน'),
      err,
      h('div', { class: 'field' }, q),
      results
    )
  );

  const lists = h('div', {});
  m.appendChild(lists);

  const personRow = (u, actions, rankNo) =>
    h(
      'div',
      { class: 'person' },
      rankNo ? h('div', { class: 'rank' + (rankNo === 1 ? ' gold' : '') }, String(rankNo)) : null,
      avatarEl(u, 'sm'),
      h('div', { class: 'who' }, h('b', {}, u.displayName), h('small', {}, '@' + u.username)),
      u.stats
        ? h('div', { class: 'lv' }, `ระดับ ${levelInfo(u.stats.exp).level} · ${u.stats.exp} EXP`)
        : null,
      ...actions
    );

  async function refresh() {
    lists.innerHTML = '<p class="empty">กำลังโหลด…</p>';
    try {
      const d = await api('/friends');
      lists.innerHTML = '';

      if (d.incoming.length) {
        lists.appendChild(h('p', { class: 'sect-title' }, `คำขอเป็นเพื่อน (${d.incoming.length})`));
        d.incoming.forEach((u) =>
          lists.appendChild(
            personRow(u, [
              h(
                'button',
                {
                  class: 'btn sm',
                  onclick: async () => {
                    await api('/friends/accept', { method: 'POST', body: { id: u.id } });
                    toast('เพิ่มเพื่อนแล้ว', 'teal');
                    refresh();
                  },
                },
                'ตอบรับ'
              ),
              h(
                'button',
                {
                  class: 'btn danger sm',
                  onclick: async () => {
                    await api('/friends/remove', { method: 'POST', body: { id: u.id } });
                    refresh();
                  },
                },
                'ปฏิเสธ'
              ),
            ])
          )
        );
      }

      lists.appendChild(
        h('p', { class: 'sect-title', style: 'margin-top:26px' }, 'อันดับเพื่อนตาม EXP')
      );
      const me = { ...ME, stats: { exp: S.exp } };
      const board = d.friends.concat([me]).sort((a, b) => b.stats.exp - a.stats.exp);
      if (board.length === 1) {
        lists.appendChild(
          h('p', { class: 'empty' }, 'ยังไม่มีเพื่อน ลองค้นหาชื่อผู้ใช้ของเพื่อนครูด้านบนแล้วส่งคำขอดู')
        );
      }
      board.forEach((u, i) =>
        lists.appendChild(
          personRow(
            u,
            u.id === ME.id
              ? [h('span', { class: 'lv', style: 'background:var(--gold-soft)' }, 'คุณ')]
              : [
                  h(
                    'button',
                    {
                      class: 'btn danger sm',
                      onclick: async () => {
                        if (!confirm(`ลบ ${u.displayName} ออกจากรายชื่อเพื่อน`)) return;
                        await api('/friends/remove', { method: 'POST', body: { id: u.id } });
                        refresh();
                      },
                    },
                    'ลบ'
                  ),
                ],
            i + 1
          )
        )
      );

      if (d.outgoing.length) {
        lists.appendChild(h('p', { class: 'sect-title', style: 'margin-top:26px' }, 'คำขอที่ส่งไปแล้ว'));
        d.outgoing.forEach((u) =>
          lists.appendChild(
            personRow(u, [
              h(
                'button',
                {
                  class: 'btn danger sm',
                  onclick: async () => {
                    await api('/friends/remove', { method: 'POST', body: { id: u.id } });
                    refresh();
                  },
                },
                'ยกเลิก'
              ),
            ])
          )
        );
      }
    } catch (e) {
      lists.innerHTML = '';
      lists.appendChild(h('p', { class: 'empty' }, e.message));
    }
  }

  let t = null;
  q.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(async () => {
      err.hidden = true;
      results.innerHTML = '';
      if (q.value.trim().length < 2) return;
      try {
        const { users } = await api('/friends/search?q=' + encodeURIComponent(q.value.trim()));
        if (!users.length) {
          results.appendChild(h('p', { class: 'empty', style: 'padding:8px 0' }, 'ไม่พบผู้ใช้ที่ตรงกัน'));
          return;
        }
        users.forEach((u) => {
          const label =
            u.relation === 'friend'
              ? 'เป็นเพื่อนแล้ว'
              : u.relation === 'outgoing'
              ? 'รอตอบรับ'
              : u.relation === 'incoming'
              ? 'ตอบรับคำขอ'
              : 'ส่งคำขอ';
          const b = h(
            'button',
            { class: 'btn sm', disabled: u.relation === 'friend' || u.relation === 'outgoing' ? 'disabled' : null },
            label
          );
          b.addEventListener('click', async () => {
            try {
              if (u.relation === 'incoming')
                await api('/friends/accept', { method: 'POST', body: { id: u.id } });
              else await api('/friends/request', { method: 'POST', body: { username: u.username } });
              b.disabled = true;
              b.textContent = 'ส่งแล้ว';
              toast('ดำเนินการเรียบร้อย', 'teal');
              refresh();
            } catch (e) {
              err.hidden = false;
              err.textContent = e.message;
            }
          });
          results.appendChild(personRow(u, [b]));
        });
      } catch (e) {
        err.hidden = false;
        err.textContent = e.message;
      }
    }, 350);
  });

  refresh();
}

/* ---------- 9.4 กระดานคะแนนรวม ---------- */

async function viewLeaderboard() {
  const m = main();
  m.innerHTML = '<p class="empty">กำลังโหลดกระดานคะแนน…</p>';
  let data;
  try {
    data = await api('/leaderboard');
  } catch (e) {
    m.innerHTML = '';
    m.appendChild(h('h1', { class: 'page' }, 'กระดานคะแนน'));
    m.appendChild(
      h(
        'p',
        { class: 'empty' },
        ME ? e.message : 'กระดานคะแนนใช้ได้เมื่อระบบเชื่อมต่อฐานข้อมูล ลองเข้าสู่ระบบก่อน'
      )
    );
    return;
  }
  m.innerHTML = '';
  m.appendChild(h('h1', { class: 'page' }, 'กระดานคะแนนรวม'));
  m.appendChild(
    h(
      'p',
      { class: 'lead' },
      `ผู้เรียนทั้งหมด ${data.total} คน` +
        (data.myRank ? ` · อันดับของคุณคือ ${data.myRank}` : '')
    )
  );

  if (!data.board.length) {
    m.appendChild(h('p', { class: 'empty' }, 'ยังไม่มีใครเริ่มสะสม EXP เป็นคนแรกสิ'));
    return;
  }

  const medal = ['🥇', '🥈', '🥉'];
  const table = h('div', { class: 'lbtable' });
  table.appendChild(
    h(
      'div',
      { class: 'lbrow lbhead' },
      h('span', { class: 'lbrank' }, 'อันดับ'),
      h('span', { class: 'lbname' }, 'ผู้เรียน'),
      h('span', { class: 'lbnum' }, 'ระดับ'),
      h('span', { class: 'lbnum' }, 'EXP'),
      h('span', { class: 'lbnum hidesm' }, 'บท'),
      h('span', { class: 'lbnum hidesm' }, 'แล็บ'),
      h('span', { class: 'lbnum' }, 'CTF')
    )
  );
  data.board.forEach((r, i) => {
    const isMe = r.username === data.me;
    table.appendChild(
      h(
        'div',
        { class: 'lbrow' + (isMe ? ' me' : '') + (i < 3 ? ' top' : '') },
        h('span', { class: 'lbrank' }, i < 3 ? medal[i] : String(i + 1)),
        h(
          'span',
          { class: 'lbname' },
          avatarEl({ displayName: r.displayName, avatar: r.avatar }, 'sm'),
          h('span', {}, h('b', {}, r.displayName), h('small', {}, '@' + r.username))
        ),
        h('span', { class: 'lbnum' }, String(r.level)),
        h('span', { class: 'lbnum lbexp' }, r.exp.toLocaleString('th-TH')),
        h('span', { class: 'lbnum hidesm' }, String(r.lessons)),
        h('span', { class: 'lbnum hidesm' }, String(r.labs)),
        h('span', { class: 'lbnum' }, String(r.ctf))
      )
    );
  });
  m.appendChild(table);

  if (!ME) {
    m.appendChild(
      h(
        'p',
        { class: 'hint', style: 'margin-top:18px' },
        'เข้าสู่ระบบเพื่อให้ชื่อของคุณปรากฏบนกระดานนี้'
      )
    );
  }
}

/* ---------- 9.5 กระดานโจทย์ CTF แบบ Jeopardy ---------- */

async function viewCtfBoard() {
  const m = main();
  m.innerHTML = '<p class="empty">กำลังโหลดกระดานโจทย์…</p>';
  const idx = await getIndex();
  // รวมทุกหลักสูตรที่มีโจทย์ CTF (บล็อก chal)
  const ctfCourses = idx.filter((c) => c.lessons.some((l) => (l.challenges || []).length));
  if (!ctfCourses.length) {
    m.innerHTML = '<p class="empty">ยังไม่มีหมวดโจทย์ CTF</p>';
    return;
  }

  // รวบรวมโจทย์ทั้งหมดพร้อมคีย์สถานะ แยกตามหมวด
  const byCat = {};
  let totalPts = 0;
  let solvedPts = 0;
  for (const meta of ctfCourses) {
    const full = await getCourse(meta.id);
    full.lessons.forEach((l) => {
      l.blocks.forEach((b, bi) => {
        if (b.type !== 'chal') return;
        const key = `chal.${meta.id}.${l.id}.${bi}`;
        const solved = S.ex[key] === 'ok';
        const cat = b.cat || 'อื่น ๆ';
        (byCat[cat] = byCat[cat] || []).push({
          title: b.title,
          points: b.points || 0,
          level: b.level || '',
          solved,
          courseId: meta.id,
          lessonId: l.id,
        });
        totalPts += b.points || 0;
        if (solved) solvedPts += b.points || 0;
      });
    });
  }

  m.innerHTML = '';
  m.appendChild(h('h1', { class: 'page' }, 'กระดานโจทย์ CTF'));
  m.appendChild(
    h(
      'p',
      { class: 'lead' },
      `เลือกทำโจทย์ข้อไหนก่อนก็ได้ตามสไตล์ Jeopardy คลิกที่โจทย์เพื่อไปยังบทที่มีโจทย์นั้น ได้แล้ว ${solvedPts} จาก ${totalPts} คะแนน`
    )
  );

  // แถบความคืบหน้า
  const pct = totalPts ? Math.round((solvedPts / totalPts) * 100) : 0;
  m.appendChild(
    h(
      'div',
      { class: 'ctfprog' },
      h('div', { class: 'ctfprogbar' }, h('i', { style: `width:${pct}%` })),
      h('div', { class: 'ctfprogtext' }, `${pct}%`)
    )
  );

  const board = h('div', { class: 'ctfboard' });
  const catOrder = ['Crypto', 'Web', 'Forensics', 'Reverse', 'Network', 'Mobile', 'Programming'];
  const rankOf = (c) => {
    const i = catOrder.indexOf(c);
    return i < 0 ? 99 : i;
  };
  const cats = Object.keys(byCat).sort((a, b) => rankOf(a) - rankOf(b));
  cats.forEach((cat) => {
    const col = h('div', { class: 'ctfcol' });
    col.appendChild(h('div', { class: 'ctfcat' }, cat));
    byCat[cat]
      .sort((a, b) => a.points - b.points)
      .forEach((ch) => {
        col.appendChild(
          h(
            'a',
            {
              class: 'ctfcell' + (ch.solved ? ' done' : ''),
              href: `#/l/${ch.courseId}/${ch.lessonId}`,
              title: ch.title,
            },
            h('span', { class: 'ctfpts' }, ch.solved ? '✓' : String(ch.points)),
            h('span', { class: 'ctfchtitle' }, ch.title)
          )
        );
      });
    board.appendChild(col);
  });
  m.appendChild(board);
}

/* ---------- 10. ตัวเรนเดอร์บล็อกเนื้อหา ---------- */

function renderBlock(b, key, opt) {
  opt = opt || {};
  switch (b.type) {
    case 'h':
      return h('h2', {}, b.text);
    case 'text':
      return h('div', { html: b.html });
    case 'list': {
      const box = h('div', { class: 'listbox' });
      if (b.title) box.appendChild(h('h4', {}, b.title));
      const l = h(b.ordered ? 'ol' : 'ul', {});
      b.items.forEach((it) => l.appendChild(h('li', { html: it })));
      box.appendChild(l);
      return box;
    }
    case 'term': {
      const box = h('div', { class: 'termlist' });
      b.items.forEach((it) =>
        box.appendChild(h('dl', { class: 'term' }, h('dt', {}, it.t), h('dd', { html: it.d })))
      );
      return box;
    }
    case 'table': {
      const w = h('div', { class: 'tablewrap' });
      const t = h('table', {});
      if (b.caption) t.appendChild(h('caption', {}, b.caption));
      t.appendChild(h('thead', {}, h('tr', {}, b.head.map((x) => h('th', { html: x })))));
      t.appendChild(
        h('tbody', {}, b.rows.map((r) => h('tr', {}, r.map((x) => h('td', { html: x })))))
      );
      w.appendChild(t);
      return w;
    }
    case 'note': {
      const n = h('div', { class: 'note ' + (b.variant || 'info') });
      if (b.title) n.appendChild(h('h4', {}, b.title));
      n.appendChild(h('div', { html: b.html }));
      return n;
    }
    case 'key':
      return h(
        'div',
        { class: 'keybox' },
        h('h4', {}, b.title || 'สรุป'),
        h('ul', {}, b.items.map((x) => h('li', { html: x })))
      );
    case 'figure': {
      const f = h('figure', { class: 'fig' });
      if (b.title) f.appendChild(h('div', { class: 'figtitle' }, b.title));
      f.appendChild(h('div', { class: 'figbody', html: b.svg }));
      if (b.caption) f.appendChild(h('figcaption', { html: b.caption }));
      return f;
    }
    case 'code': {
      const box = h('div', { class: 'codeblock' });
      if (b.title) box.appendChild(h('div', { class: 'codetitle' }, b.title));
      const pre = h('pre', {}, h('code', {}, b.text));
      const copy = h('button', { class: 'copybtn' }, 'คัดลอก');
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(b.text);
          copy.textContent = 'คัดลอกแล้ว';
          setTimeout(() => (copy.textContent = 'คัดลอก'), 1600);
        } catch (e) {
          copy.textContent = 'คัดลอกไม่ได้';
        }
      });
      box.append(pre, copy);
      if (b.note) box.appendChild(h('div', { class: 'codenote', html: b.note }));
      return box;
    }
    case 'chal':
      return renderChallenge(b, key);
    case 'walk': {
      const w = h('div', { class: 'walk' });
      w.appendChild(
        h(
          'div',
          { class: 'walkhead' },
          h('div', { class: 'walktitle' }, b.title),
          b.meta ? h('div', { class: 'walkmeta' }, b.meta) : null
        )
      );
      const ol = h('ol', { class: 'walksteps' });
      b.steps.forEach((s) => {
        const li = h('li', {});
        li.appendChild(h('div', { class: 'stept' }, s.t));
        if (s.d) li.appendChild(h('div', { class: 'stepd', html: s.d }));
        if (s.cmd) {
          const pre = h('pre', { class: 'stepcmd' }, h('code', {}, s.cmd));
          const cp = h('button', { class: 'copybtn small' }, 'คัดลอก');
          cp.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(s.cmd);
              cp.textContent = 'คัดลอกแล้ว';
              setTimeout(() => (cp.textContent = 'คัดลอก'), 1600);
            } catch (e) {
              cp.textContent = 'คัดลอกไม่ได้';
            }
          });
          li.appendChild(h('div', { class: 'cmdwrap' }, pre, cp));
        }
        if (s.out) li.appendChild(h('pre', { class: 'stepout' }, h('code', {}, s.out)));
        if (s.tip) li.appendChild(h('div', { class: 'steptip', html: '<b>เคล็ดลับ</b> ' + s.tip }));
        if (s.warn) li.appendChild(h('div', { class: 'stepwarn', html: '<b>ระวัง</b> ' + s.warn }));
        if (s.fix) li.appendChild(h('div', { class: 'stepfix', html: '<b>ถ้าติดปัญหา</b> ' + s.fix }));
        ol.appendChild(li);
      });
      w.appendChild(ol);
      if (b.done) w.appendChild(h('div', { class: 'walkdone', html: '<b>ทำถึงตรงนี้แล้วควรได้</b> ' + b.done }));
      return w;
    }
    case 'lab':
      return renderLab(b, key);
    default:
      if (isExercise(b)) return renderExercise(b, key, opt);
      return h('div', {});
  }
}

/* ---------- 11. แบบฝึกหัด ---------- */

const EX_LABEL = {
  quiz: 'เลือกคำตอบข้อเดียว',
  multi: 'เลือกได้หลายข้อ',
  tf: 'ถูกหรือผิด',
  fill: 'เติมคำในช่องว่าง',
  match: 'จับคู่',
  order: 'เรียงลำดับ',
};

function renderExercise(b, key, opt) {
  const box = h('div', { class: 'ex' });
  box.appendChild(h('div', { class: 'tag' }, 'แบบฝึกหัด · ' + EX_LABEL[b.type]));
  box.appendChild(h('div', { class: 'q' }, b.q));

  const body = h('div', {});
  box.appendChild(body);

  const fb = h('div', { class: 'feedback', hidden: 'hidden' });
  const btnRow = h('div', { class: 'btnrow' });
  const checkBtn = h('button', { class: 'btn' }, 'ตรวจคำตอบ');
  const retryBtn = h('button', { class: 'btn ghost', hidden: 'hidden' }, 'ลองใหม่');
  btnRow.append(checkBtn, retryBtn);
  if (!opt.silent) box.append(btnRow, fb);
  else box.appendChild(fb);

  let api = null;
  const build = () => {
    body.innerHTML = '';
    api = EX_BUILD[b.type](b, body);
  };
  build();

  function lock(ok) {
    api.lock(ok);
    box.classList.toggle('ok', ok);
    box.classList.toggle('no', !ok);
    fb.hidden = false;
    fb.className = 'feedback ' + (ok ? 'ok' : 'no');
    fb.innerHTML =
      `<b>${ok ? 'ถูกต้อง' : 'ยังไม่ถูก'}</b>` + (b.explain ? esc(b.explain).replace(/\n/g, '<br>') : '');
    checkBtn.hidden = true;
    retryBtn.hidden = ok;
  }

  checkBtn.addEventListener('click', () => {
    const ok = api.check();
    if (ok) {
      if (S.ex[key] !== 'ok') {
        const first = !S.ex[key];
        S.ex[key] = 'ok';
        save();
        addExp(first ? 10 : 4, 'ตอบแบบฝึกหัดถูก');
      }
    } else {
      if (!S.ex[key]) S.ex[key] = 'try';
      save();
    }
    lock(ok);
    document.dispatchEvent(new CustomEvent('ca:progress'));
  });

  retryBtn.addEventListener('click', () => {
    build();
    box.classList.remove('ok', 'no');
    fb.hidden = true;
    checkBtn.hidden = false;
    retryBtn.hidden = true;
  });

  // ใช้ตอนส่งแบบทดสอบท้ายหมวดทีเดียวทั้งชุด
  box.__check = () => {
    const ok = api.check();
    lock(ok);
    retryBtn.hidden = true;
    return ok;
  };

  // ถ้าเคยตอบถูกไว้แล้ว ให้แสดงเป็นเฉลยทันที
  if (!opt.silent && S.ex[key] === 'ok') {
    api.reveal();
    lock(true);
    retryBtn.hidden = false;
    retryBtn.textContent = 'ลองทำอีกครั้ง';
  }
  return box;
}

const EX_BUILD = {
  /* เลือกตอบข้อเดียว + ถูกผิด */
  quiz(b, body) {
    return choiceEngine(body, b.choices, [b.answer], false);
  },
  tf(b, body) {
    return choiceEngine(body, ['ถูก', 'ผิด'], [b.answer ? 0 : 1], false);
  },
  multi(b, body) {
    return choiceEngine(body, b.choices, b.answers, true);
  },

  /* เติมคำ */
  fill(b, body) {
    const parts = b.q.split(/_{3,}/);
    const inp = h('input', { class: 'txtin', type: 'text', placeholder: 'พิมพ์คำตอบ' });
    body.appendChild(h('p', { style: 'margin-bottom:12px' }, parts.join(' ______ ')));
    body.appendChild(inp);
    const norm = (s) => String(s).trim().toLowerCase().replace(/\s+/g, ' ');
    return {
      check: () => b.answers.some((a) => norm(a) === norm(inp.value)),
      reveal: () => (inp.value = b.answers[0]),
      lock: (ok) => {
        inp.disabled = true;
        inp.style.borderColor = ok ? 'var(--teal)' : 'var(--crimson)';
        if (!ok) body.appendChild(h('p', { style: 'margin:10px 0 0;font-size:16px' }, 'คำตอบที่ถูกคือ ' + b.answers[0]));
      },
    };
  },

  /* จับคู่ */
  match(b, body) {
    const rights = shuffle(b.pairs.map((p) => p[1]));
    const rows = b.pairs.map((p) => {
      const sel = h(
        'select',
        {},
        h('option', { value: '' }, '— เลือก —'),
        rights.map((r) => h('option', { value: r }, r))
      );
      const row = h('div', { class: 'matchrow' }, h('div', { class: 'l' }, p[0]), sel);
      body.appendChild(row);
      return { row, sel, want: p[1] };
    });
    return {
      check: () => rows.every((r) => r.sel.value === r.want),
      reveal: () => rows.forEach((r) => (r.sel.value = r.want)),
      lock: () =>
        rows.forEach((r) => {
          r.sel.disabled = true;
          r.row.classList.add(r.sel.value === r.want ? 'right' : 'wrong');
          if (r.sel.value !== r.want) {
            r.row.appendChild(
              h('div', { style: 'grid-column:1/-1;font-size:15.5px;color:var(--crimson)' }, 'คำตอบที่ถูกคือ ' + r.want)
            );
          }
        }),
    };
  },

  /* เรียงลำดับ */
  order(b, body) {
    let cur = shuffle(b.items);
    if (cur.join('|') === b.items.join('|') && cur.length > 2) cur = shuffle(cur);
    const ul = h('ul', { class: 'orderlist' });
    body.appendChild(ul);
    let locked = false;

    function paint() {
      ul.innerHTML = '';
      cur.forEach((txt, i) => {
        const up = h('button', { title: 'เลื่อนขึ้น', disabled: i === 0 || locked }, '▲');
        const dn = h('button', { title: 'เลื่อนลง', disabled: i === cur.length - 1 || locked }, '▼');
        up.addEventListener('click', () => {
          [cur[i - 1], cur[i]] = [cur[i], cur[i - 1]];
          paint();
        });
        dn.addEventListener('click', () => {
          [cur[i + 1], cur[i]] = [cur[i], cur[i + 1]];
          paint();
        });
        const li = h(
          'li',
          { class: 'orderitem' + (locked ? (txt === b.items[i] ? ' right' : ' wrong') : '') },
          h('span', { class: 'num' }, String(i + 1)),
          h('span', {}, txt),
          h('span', { class: 'ordbtns' }, up, dn)
        );
        ul.appendChild(li);
      });
    }
    paint();
    return {
      check: () => cur.join('|') === b.items.join('|'),
      reveal: () => {
        cur = b.items.slice();
        paint();
      },
      lock: (ok) => {
        locked = true;
        paint();
        if (!ok) {
          body.appendChild(
            h(
              'div',
              { style: 'margin-top:10px;font-size:16px' },
              'ลำดับที่ถูกต้องคือ ' + b.items.map((x, i) => `${i + 1}. ${x}`).join('  ')
            )
          );
        }
      },
    };
  },
};

function choiceEngine(body, choices, answers, multi) {
  const opts = h('div', { class: 'opts' });
  const name = 'g' + Math.random().toString(36).slice(2);
  const nodes = choices.map((c, i) => {
    const inp = h('input', { type: multi ? 'checkbox' : 'radio', name, value: String(i) });
    const lab = h('label', { class: 'opt' }, inp, h('span', { html: c }));
    inp.addEventListener('change', () => {
      if (!multi) opts.querySelectorAll('.opt').forEach((o) => o.classList.remove('sel'));
      lab.classList.toggle('sel', inp.checked);
    });
    opts.appendChild(lab);
    return { inp, lab };
  });
  body.appendChild(opts);
  const picked = () => nodes.map((n, i) => (n.inp.checked ? i : -1)).filter((i) => i >= 0);
  return {
    check: () => {
      const p = picked();
      return p.length === answers.length && p.every((i) => answers.includes(i));
    },
    reveal: () =>
      nodes.forEach((n, i) => {
        n.inp.checked = answers.includes(i);
        n.lab.classList.toggle('sel', n.inp.checked);
      }),
    lock: () =>
      nodes.forEach((n, i) => {
        n.inp.disabled = true;
        n.lab.classList.add('locked');
        n.lab.classList.remove('sel');
        if (answers.includes(i)) n.lab.classList.add('right');
        else if (n.inp.checked) n.lab.classList.add('wrong');
      }),
  };
}

/* ---------- 11.5 โจทย์ฝึกแบบ CTF ---------- */

function renderChallenge(b, key) {
  // ใช้คีย์นำหน้า chal. เพื่อให้เซิร์ฟเวอร์นับโจทย์ CTF ได้ไม่ว่าอยู่หลักสูตรใด
  key = 'chal.' + key;
  const solved = S.ex[key] === 'ok';
  const box = h('div', { class: 'chal' + (solved ? ' solved' : '') });

  box.appendChild(
    h(
      'div',
      { class: 'chalhead' },
      h('span', { class: 'chalcat' }, b.cat || 'Challenge'),
      b.points ? h('span', { class: 'chalpts' }, b.points + ' คะแนน') : null,
      b.level ? h('span', { class: 'challv' }, b.level) : null
    )
  );
  box.appendChild(h('h4', { class: 'chaltitle' }, b.title));
  if (b.brief) box.appendChild(h('div', { class: 'chalbrief', html: b.brief }));
  if (b.files && b.files.length) {
    box.appendChild(
      h(
        'div',
        { class: 'chalfiles' },
        'ไฟล์ที่ให้มา: ',
        ...b.files.map((f) => h('code', {}, f))
      )
    );
  }
  if (b.data) box.appendChild(h('pre', { class: 'chaldata' }, h('code', {}, b.data)));

  /* ช่องกรอกธง */
  const inp = h('input', {
    class: 'flaginp',
    type: 'text',
    placeholder: b.format || 'STDiO{...}',
    value: solved ? b.flag : '',
    disabled: solved ? 'disabled' : null,
  });
  const verdict = h('div', { class: 'chalverdict', hidden: solved ? null : 'hidden' });
  if (solved) {
    verdict.className = 'chalverdict ok';
    verdict.textContent = 'ตอบถูกแล้ว';
  }
  const submit = h('button', { class: 'btn sm', disabled: solved ? 'disabled' : null }, 'ส่งธง');

  const norm = (s) => String(s).trim().replace(/\s+/g, '');
  submit.addEventListener('click', () => {
    const ok = norm(inp.value).toLowerCase() === norm(b.flag).toLowerCase();
    verdict.hidden = false;
    verdict.className = 'chalverdict ' + (ok ? 'ok' : 'no');
    verdict.textContent = ok ? 'ถูกต้อง ธงนี้เป็นของคุณแล้ว' : 'ยังไม่ใช่ ลองอ่านคำใบ้ดู';
    if (ok) {
      box.classList.add('solved');
      inp.disabled = true;
      submit.disabled = true;
      if (S.ex[key] !== 'ok') {
        S.ex[key] = 'ok';
        save();
        addExp(b.exp || 20, 'แก้โจทย์ CTF ได้');
      }
      document.dispatchEvent(new CustomEvent('ca:progress'));
    }
  });
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit.click();
  });
  box.appendChild(h('div', { class: 'flagrow' }, inp, submit));
  box.appendChild(verdict);

  /* คำใบ้ทีละข้อ */
  const hintBox = h('div', { class: 'chalhints' });
  let shown = 0;
  if (b.hints && b.hints.length) {
    const hintBtn = h('button', { class: 'linkbtn2' }, `ขอคำใบ้ (${b.hints.length} ข้อ)`);
    hintBtn.addEventListener('click', () => {
      if (shown >= b.hints.length) return;
      hintBox.appendChild(
        h('div', { class: 'hintitem' }, h('b', {}, `คำใบ้ที่ ${shown + 1} `), b.hints[shown])
      );
      shown++;
      hintBtn.textContent =
        shown >= b.hints.length ? 'ดูคำใบ้ครบแล้ว' : `ขอคำใบ้เพิ่ม (เหลือ ${b.hints.length - shown} ข้อ)`;
      if (shown >= b.hints.length) hintBtn.disabled = true;
    });
    box.appendChild(hintBtn);
  }
  box.appendChild(hintBox);

  /* เฉลย */
  if (b.solution) {
    const solBox = h('div', { class: 'chalsol', hidden: 'hidden' });
    solBox.appendChild(h('h5', {}, 'แนวทางแก้โจทย์'));
    solBox.appendChild(h('div', { html: b.solution }));
    if (b.flag) solBox.appendChild(h('div', { class: 'chalflag' }, 'ธง: ' + b.flag));
    const solBtn = h('button', { class: 'linkbtn2 danger' }, 'เปิดดูเฉลย');
    solBtn.addEventListener('click', () => {
      solBox.hidden = !solBox.hidden;
      solBtn.textContent = solBox.hidden ? 'เปิดดูเฉลย' : 'ซ่อนเฉลย';
    });
    box.append(solBtn, solBox);
  }
  return box;
}

/* ---------- 12. แล็บ ---------- */

function renderLab(b, key) {
  const wrap = h('div', { class: 'lab' });
  wrap.appendChild(h('div', { class: 'tag' }, 'แล็บปฏิบัติ'));
  wrap.appendChild(h('h3', {}, b.title));
  if (b.goal) wrap.appendChild(h('p', { class: 'goal' }, 'เป้าหมาย: ' + b.goal));
  if (b.brief) wrap.appendChild(h('div', { class: 'brief', html: b.brief }));

  const panel = h('div', { class: 'labpanel' });
  wrap.appendChild(panel);

  const status = h('div', {});
  wrap.appendChild(status);

  const done = () => {
    if (!S.labs[key]) {
      S.labs[key] = true;
      save();
      addExp(b.exp || 50, 'ทำแล็บสำเร็จ');
    }
    paintStatus();
    document.dispatchEvent(new CustomEvent('ca:progress'));
  };

  function paintStatus() {
    status.innerHTML = '';
    if (S.labs[key]) {
      status.appendChild(
        h('div', { class: 'labresult pass', style: 'margin-top:14px' }, 'แล็บนี้ทำสำเร็จแล้ว ทดลองซ้ำได้ตามต้องการ')
      );
    }
    status.appendChild(
      h(
        'button',
        {
          class: 'btn ghost sm',
          style: 'margin-top:12px',
          onclick: () => {
            panel.innerHTML = '';
            start();
          },
        },
        S.labs[key] ? 'ทำแล็บนี้อีกครั้ง' : 'เริ่มแล็บนี้ใหม่'
      )
    );
  }

  function start() {
    const fn = LABS[b.tool];
    if (fn) fn(panel, done, S.labs[key]);
    else panel.appendChild(h('p', {}, 'ไม่พบเครื่องมือแล็บชื่อ ' + b.tool));
  }

  start();
  paintStatus();
  return wrap;
}

const LABS = {};

/* แล็บ 1 — ความแข็งแรงของรหัสผ่าน */
LABS.password = (p, done) => {
  const inp = h('input', { type: 'text', placeholder: 'พิมพ์รหัสผ่านทดลอง (อย่าใช้รหัสจริง)' });
  const bar = h('i');
  const stats = h('div', { class: 'pwstats' });
  const notes = h('ul', { class: 'pwnotes' });
  p.append(
    h('div', { class: 'field' }, h('label', {}, 'รหัสผ่านทดลอง'), inp),
    h('div', { class: 'strength' }, bar),
    stats,
    notes
  );
  const tried = new Set();
  let best = 0;
  const btn = h('button', { class: 'btn gold', disabled: 'disabled' }, 'บันทึกผลแล็บ');
  const hint = h('p', { style: 'font-size:15px;color:#A9BED2;margin:14px 0 8px' }, 'ทดลองอย่างน้อย 3 รูปแบบ และทำให้มีรูปแบบหนึ่งได้เอนโทรปีตั้งแต่ 60 บิตขึ้นไป');
  p.append(hint, btn);
  btn.addEventListener('click', () => {
    done();
    btn.disabled = true;
    btn.textContent = 'บันทึกแล้ว';
  });

  const COMMON = ['password', 'passw0rd', '123456', 'qwerty', 'admin', 'iloveyou', 'welcome', 'letmein', 'abc123', 'monkey', '111111', 'dragon'];

  inp.addEventListener('input', () => {
    const v = inp.value;
    if (!v) {
      bar.style.width = '0';
      stats.innerHTML = '';
      notes.innerHTML = '';
      return;
    }
    let pool = 0;
    if (/[a-z]/.test(v)) pool += 26;
    if (/[A-Z]/.test(v)) pool += 26;
    if (/[0-9]/.test(v)) pool += 10;
    if (/[^A-Za-z0-9\u0E00-\u0E7F]/.test(v)) pool += 33;
    if (/[\u0E00-\u0E7F]/.test(v)) pool += 70;
    let bits = v.length * Math.log2(Math.max(pool, 2));

    const tips = [];
    const low = v.toLowerCase().replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/@/g, 'a').replace(/\$/g, 's');
    if (COMMON.some((c) => low.includes(c))) {
      bits *= 0.35;
      tips.push('มีคำที่อยู่ในคลังรหัสผ่านยอดนิยม ถูกเดาได้ในไม่กี่วินาที');
    }
    if (/^[A-Za-z]+\d{1,4}[!@#]?$/.test(v)) {
      bits *= 0.6;
      tips.push('รูปแบบ “คำ + ตัวเลข + อักขระพิเศษ” เป็นรูปแบบที่โปรแกรมเดารหัสลองเป็นอันดับต้น ๆ');
    }
    if (/(.)\1{2,}/.test(v)) {
      bits *= 0.8;
      tips.push('มีอักขระซ้ำติดกันสามตัวขึ้นไป');
    }
    if (/(19|20)\d{2}|25[0-9]{2}/.test(v)) {
      bits *= 0.75;
      tips.push('มีเลขปี ซึ่งเป็นสิ่งที่ผู้โจมตีลองเป็นอันดับแรก ๆ');
    }
    if (v.length < 12) tips.push('สั้นกว่า 12 ตัวอักษร ควรเพิ่มความยาวก่อนเพิ่มความซับซ้อน');
    if (!tips.length) tips.push('ไม่พบรูปแบบที่คาดเดาง่าย');

    bits = Math.round(bits);
    best = Math.max(best, bits);
    tried.add(v);
    btn.disabled = !(tried.size >= 3 && best >= 60);

    const pct = Math.min(100, (bits / 100) * 100);
    const color = bits < 35 ? '#C0392B' : bits < 60 ? '#D9A125' : bits < 80 ? '#4FA88C' : '#3FBFAF';
    bar.style.width = pct + '%';
    bar.style.background = color;

    // เดา 1e10 ครั้งต่อวินาที
    const secs = Math.pow(2, bits - 1) / 1e10;
    stats.innerHTML =
      `<span>เอนโทรปี <b>${bits}</b> บิต</span>` +
      `<span>ความยาว <b>${v.length}</b> ตัว</span>` +
      `<span>เวลาเดาโดยประมาณ <b>${humanTime(secs)}</b></span>`;
    notes.innerHTML = tips.map((t) => `<li>${esc(t)}</li>`).join('');
  });
};

function humanTime(s) {
  if (s < 1) return 'ทันที';
  const u = [
    [60, 'วินาที'],
    [60, 'นาที'],
    [24, 'ชั่วโมง'],
    [365, 'วัน'],
    [1000, 'ปี'],
  ];
  let v = s,
    name = 'วินาที';
  for (const [d, n] of u) {
    if (v < d) {
      name = n;
      break;
    }
    v /= d;
    name = n;
  }
  if (v > 1e6) return 'มากกว่าล้าน' + name;
  return Math.round(v).toLocaleString('th-TH') + ' ' + name;
}

/* แล็บ 2 — SHA-256 */
LABS.hash = (p, done) => {
  const a = h('input', { type: 'text', value: 'ความมั่นคงปลอดภัยไซเบอร์' });
  const b = h('input', { type: 'text', value: 'ความมั่นคงปลอดภัยไซเบอร์ ' });
  const oa = h('div', { class: 'hashout' });
  const ob = h('div', { class: 'hashout' });
  const info = h('p', { style: 'font-size:15.5px;color:#A9BED2;margin:12px 0 0' });
  const btn = h('button', { class: 'btn gold', style: 'margin-top:14px', disabled: 'disabled' }, 'บันทึกผลแล็บ');

  p.append(
    h('div', { class: 'field' }, h('label', {}, 'ข้อความที่ 1'), a, oa),
    h('div', { class: 'field' }, h('label', {}, 'ข้อความที่ 2'), b, ob),
    info,
    btn
  );
  btn.addEventListener('click', () => {
    done();
    btn.disabled = true;
    btn.textContent = 'บันทึกแล้ว';
  });

  async function sha(t) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
    return [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, '0')).join('');
  }
  async function run() {
    if (!crypto.subtle) {
      oa.textContent = 'เบราว์เซอร์นี้ไม่รองรับ Web Crypto (ต้องเปิดผ่าน https หรือ localhost)';
      return;
    }
    const [x, y] = await Promise.all([sha(a.value), sha(b.value)]);
    let diff = 0;
    const mark = (s, o) =>
      [...s]
        .map((ch, i) => {
          if (ch !== o[i]) {
            diff++;
            return `<span class="diff">${ch}</span>`;
          }
          return ch;
        })
        .join('');
    oa.innerHTML = mark(x, y);
    diff = 0;
    ob.innerHTML = mark(y, x);
    info.textContent = `ต่างกัน ${diff} ตัวอักษรจากทั้งหมด 64 ตัว คิดเป็น ${Math.round((diff / 64) * 100)}% ทั้งที่ข้อความต้นทางต่างกันเพียงเล็กน้อย นี่คือ Avalanche Effect`;
    btn.disabled = !(a.value && b.value && a.value !== b.value);
  }
  a.addEventListener('input', run);
  b.addEventListener('input', run);
  run();
};

/* แล็บ 3 — จับผิดอีเมลฟิชชิง */
LABS.phishing = (p, done) => {
  const CLUES = [
    { id: 1, real: true, why: 'โดเมนผู้ส่งไม่ใช่โดเมนของหน่วยงาน และสะกดเลียนแบบให้ดูคล้าย' },
    { id: 2, real: false, why: 'วันเวลาที่ส่งเป็นเรื่องปกติ ไม่ใช่จุดผิดสังเกตในตัวเอง' },
    { id: 3, real: true, why: 'ทักทายแบบกว้าง ๆ ไม่ระบุชื่อผู้รับ ทั้งที่หน่วยงานย่อมรู้ชื่อเรา' },
    { id: 4, real: true, why: 'สร้างความเร่งด่วนและขู่ว่าบัญชีจะถูกระงับ เป็นกลไกกดดันทางอารมณ์' },
    { id: 5, real: true, why: 'ข้อความลิงก์กับปลายทางจริงไม่ตรงกัน โดเมนจริงคือ vec-secure-login.net' },
    { id: 6, real: true, why: 'ขอให้กรอกรหัสผ่านเดิม ซึ่งหน่วยงานที่ถูกต้องจะไม่ขอเด็ดขาด' },
    { id: 7, real: false, why: 'การมีลายเซ็นท้ายอีเมลเป็นเรื่องปกติ และผู้โจมตีก็ปลอมได้ง่าย จึงไม่ใช่ตัวชี้ขาด' },
    { id: 8, real: true, why: 'ภาษาผิดปกติและสะกดผิด เป็นสัญญาณที่พบบ่อยในอีเมลหลอกลวง' },
  ];
  const picked = new Set();
  const mail = h('div', { class: 'mail' });

  const clue = (id, txt) => {
    const btn = h('button', { class: 'clue', type: 'button' }, txt);
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      picked.has(id) ? picked.delete(id) : picked.add(id);
      btn.classList.toggle('on', picked.has(id));
    });
    btn.dataset.id = id;
    return btn;
  };

  mail.appendChild(
    h(
      'div',
      { class: 'hdr' },
      h('div', {}, h('span', {}, 'จาก'), clue(1, 'ฝ่ายไอที <it-support@vec-secure-login.net>')),
      h('div', {}, h('span', {}, 'วันที่'), clue(2, 'วันอาทิตย์ 23:47 น.')),
      h('div', {}, h('span', {}, 'เรื่อง'), clue(8, 'แจ้งเตื่อน! บัญชีของท่านจะถูกระงับภายใน 24 ชม.'))
    )
  );
  mail.append(
    h('p', {}, clue(3, 'เรียน ท่านผู้ใช้บริการ')),
    h(
      'p',
      {},
      'ระบบตรวจพบการเข้าใช้งานที่ผิดปกติจากบัญชีของท่าน ',
      clue(4, 'หากไม่ยืนยันตัวตนภายใน 24 ชั่วโมง บัญชีของท่านจะถูกระงับถาวรทันที')
    ),
    h('p', {}, 'กรุณายืนยันตัวตนที่ ', clue(5, 'https://vec.go.th.vec-secure-login.net/verify')),
    h('p', {}, clue(6, 'โดยกรอกชื่อผู้ใช้และรหัสผ่านเดิมของท่านเพื่อยืนยันความเป็นเจ้าของบัญชี')),
    h('p', {}, clue(7, 'ขอแสดงความนับถือ / ฝ่ายเทคโนโลยีสารสนเทศ'))
  );
  p.appendChild(mail);

  const btn = h('button', { class: 'btn gold', style: 'margin-top:16px' }, 'ตรวจคำตอบ');
  const out = h('div', {});
  p.append(btn, out);

  btn.addEventListener('click', () => {
    const reals = CLUES.filter((c) => c.real).map((c) => c.id);
    let hit = 0,
      fp = 0;
    mail.querySelectorAll('.clue').forEach((el) => {
      const id = +el.dataset.id;
      el.disabled = true;
      el.classList.remove('on');
      if (reals.includes(id)) {
        if (picked.has(id)) {
          el.classList.add('hit');
          hit++;
        } else el.classList.add('miss');
      } else if (picked.has(id)) {
        el.classList.add('miss');
        fp++;
      }
    });
    const pass = hit >= 5 && fp <= 1;
    out.innerHTML = '';
    const res = h('div', { class: 'labresult' + (pass ? ' pass' : '') });
    res.appendChild(
      h('h4', {}, `พบจุดผิดสังเกต ${hit} จาก ${reals.length} จุด · เลือกเกินไป ${fp} จุด`)
    );
    const ul = h('ul', {});
    CLUES.forEach((c) => ul.appendChild(h('li', {}, (c.real ? '✔ ' : '✘ ') + c.why)));
    res.appendChild(ul);
    out.appendChild(res);
    btn.hidden = true;
    if (pass) done();
  });
};

/* แล็บ 4 — ตรวจโดเมน */
LABS.urlcheck = (p, done) => {
  const DATA = [
    { u: 'https://www.vec.go.th/news/2569', safe: true, why: 'โดเมนหลักคือ vec.go.th ซึ่งเป็นโดเมนราชการไทย' },
    { u: 'https://vec.go.th.login-verify.com/portal', safe: false, why: 'โดเมนจริงคือ login-verify.com ส่วน vec.go.th เป็นเพียงซับโดเมนที่ใครก็ตั้งได้' },
    { u: 'https://accounts.google.com/signin', safe: true, why: 'โดเมนหลักคือ google.com และ accounts เป็นซับโดเมนของเจ้าของจริง' },
    { u: 'http://192.168.44.9/bank-login', safe: false, why: 'ใช้หมายเลขไอพีแทนชื่อโดเมนและไม่ได้เข้ารหัส เป็นรูปแบบที่พบในหน้าเว็บปลอม' },
    { u: 'https://ncsa-th.secure-alert.net/urgent', safe: false, why: 'เลียนชื่อหน่วยงานไว้ที่ซับโดเมน แต่เจ้าของจริงคือ secure-alert.net' },
    { u: 'https://www.ncsa.or.th/', safe: true, why: 'เป็นโดเมนของหน่วยงานโดยตรง ไม่มีส่วนต่อท้ายที่ผิดปกติ' },
  ];
  const rows = DATA.map((d) => {
    const yes = h('button', { class: 'pill' }, 'น่าเชื่อถือ');
    const no = h('button', { class: 'pill' }, 'น่าสงสัย');
    let pick = null;
    yes.addEventListener('click', () => {
      pick = true;
      yes.classList.add('sel');
      no.classList.remove('sel');
    });
    no.addEventListener('click', () => {
      pick = false;
      no.classList.add('sel');
      yes.classList.remove('sel');
    });
    const why = h('div', { class: 'why', hidden: 'hidden' }, d.why);
    const row = h('div', { class: 'urlrow' }, h('div', { class: 'u' }, d.u), yes, no, why);
    p.appendChild(row);
    return { d, yes, no, why, get pick() { return pick; } };
  });

  const btn = h('button', { class: 'btn gold', style: 'margin-top:16px' }, 'ตรวจคำตอบ');
  const out = h('div', {});
  p.append(btn, out);
  btn.addEventListener('click', () => {
    let ok = 0;
    rows.forEach((r) => {
      const right = r.pick === r.d.safe;
      if (right) ok++;
      [r.yes, r.no].forEach((b) => (b.disabled = true));
      const chosen = r.pick === true ? r.yes : r.pick === false ? r.no : null;
      if (chosen) {
        chosen.classList.remove('sel');
        chosen.classList.add(right ? 'right' : 'wrong');
      }
      (r.d.safe ? r.yes : r.no).classList.add('right');
      r.why.hidden = false;
    });
    const pass = ok >= 5;
    out.innerHTML = '';
    out.appendChild(
      h(
        'div',
        { class: 'labresult' + (pass ? ' pass' : '') },
        h('h4', {}, `ตอบถูก ${ok} จาก ${rows.length} ข้อ`),
        pass
          ? 'อ่านโดเมนได้แม่นแล้ว จำหลักไว้ว่าให้ดูสองส่วนสุดท้ายก่อนเครื่องหมายทับแรกเสมอ'
          : 'ลองทบทวนหลักการอ่านโดเมนจากขวาไปซ้าย แล้วกลับมาทำใหม่อีกครั้ง'
      )
    );
    btn.hidden = true;
    if (pass) done();
  });
};

/* แล็บ 5 — จำแนกข้อมูลตาม PDPA */
LABS.pdpa = (p, done) => {
  const T = ['ข้อมูลทั่วไป', 'ข้อมูลอ่อนไหว', 'ไม่ใช่ข้อมูลส่วนบุคคล'];
  const DATA = [
    { n: 'ชื่อ นามสกุล ของนักเรียน', a: 0, why: 'ระบุตัวบุคคลได้โดยตรง เป็นข้อมูลส่วนบุคคลทั่วไป' },
    { n: 'ผลตรวจสุขภาพประจำปีของนักเรียน', a: 1, why: 'ข้อมูลสุขภาพจัดเป็นข้อมูลอ่อนไหวตามมาตรา 26' },
    { n: 'ชื่อวิทยาลัยและที่ตั้ง', a: 2, why: 'เป็นข้อมูลของหน่วยงาน ไม่ใช่ข้อมูลของบุคคลธรรมดา' },
    { n: 'ศาสนาที่ระบุในทะเบียนประวัติ', a: 1, why: 'ความเชื่อทางศาสนาเป็นข้อมูลอ่อนไหว' },
    { n: 'เบอร์โทรศัพท์ของผู้ปกครอง', a: 0, why: 'ระบุตัวบุคคลได้ เป็นข้อมูลส่วนบุคคลทั่วไป' },
    { n: 'ลายนิ้วมือที่ใช้สแกนเข้าอาคาร', a: 1, why: 'เป็นข้อมูลชีวภาพที่ใช้ยืนยันตัวตน จัดเป็นข้อมูลอ่อนไหว' },
    { n: 'จำนวนนักเรียนทั้งหมดของวิทยาลัย', a: 2, why: 'เป็นตัวเลขรวมที่ไม่สามารถระบุตัวบุคคลใดได้' },
    { n: 'ประวัติการถูกลงโทษทางวินัยของนักเรียน', a: 0, why: 'เป็นข้อมูลส่วนบุคคลทั่วไปที่ต้องคุ้มครองเข้มงวด ส่วนที่จัดเป็นข้อมูลอ่อนไหวคือประวัติอาชญากรรม ซึ่งเป็นคนละเรื่องกับวินัยของสถานศึกษา' },
  ];
  const rows = DATA.map((d) => {
    const sel = h('select', {}, h('option', { value: '' }, '— เลือกประเภท —'), T.map((t, i) => h('option', { value: String(i) }, t)));
    const why = h('div', { class: 'why', hidden: 'hidden' }, d.why);
    p.appendChild(h('div', { class: 'urlrow' }, h('div', { class: 'u', style: 'font-family:inherit;font-size:16.5px' }, d.n), h('div', { style: 'min-width:200px' }, sel), why));
    return { d, sel, why };
  });
  const btn = h('button', { class: 'btn gold', style: 'margin-top:16px' }, 'ตรวจคำตอบ');
  const out = h('div', {});
  p.append(btn, out);
  btn.addEventListener('click', () => {
    let ok = 0;
    rows.forEach((r) => {
      const right = +r.sel.value === r.d.a;
      if (right) ok++;
      r.sel.disabled = true;
      r.sel.style.borderColor = right ? '#3FBFAF' : '#E07A6E';
      r.why.hidden = false;
      r.why.textContent = (right ? '✔ ' : `✘ คำตอบที่ถูกคือ ${T[r.d.a]} — `) + r.d.why;
    });
    const pass = ok >= 6;
    out.innerHTML = '';
    out.appendChild(
      h(
        'div',
        { class: 'labresult' + (pass ? ' pass' : '') },
        h('h4', {}, `ตอบถูก ${ok} จาก ${rows.length} ข้อ`),
        pass ? 'จำแนกได้ดี หลักสำคัญคือถามว่าข้อมูลนี้ระบุตัวบุคคลได้หรือไม่ แล้วจึงถามว่าอยู่ในรายการอ่อนไหวหรือเปล่า' : 'ลองทบทวนรายการข้อมูลอ่อนไหวในบทเรียนอีกครั้ง'
      )
    );
    btn.hidden = true;
    if (pass) done();
  });
};

/* แล็บ 6 — ตารางความเสี่ยง */
LABS.risk = (p, done) => {
  const DATA = [
    { n: 'ครูใช้รหัสผ่านเดียวกันทุกระบบ และไม่มีการเปิด MFA', L: [4, 5], I: [3, 5] },
    { n: 'เซิร์ฟเวอร์ทะเบียนไม่มีการสำรองข้อมูลนอกสถานที่', L: [2, 4], I: [5, 5] },
    { n: 'เครื่องในห้องปฏิบัติการยังใช้ระบบปฏิบัติการที่หมดการสนับสนุนแล้ว', L: [4, 5], I: [3, 4] },
    { n: 'ไฟล์รายชื่อนักเรียนถูกส่งผ่านแอปแชตส่วนตัวเป็นประจำ', L: [4, 5], I: [3, 4] },
  ];
  const chips = [];
  DATA.forEach((d) => {
    const ls = h('input', { type: 'range', min: '1', max: '5', value: '3' });
    const is = h('input', { type: 'range', min: '1', max: '5', value: '3' });
    const lv = h('b', {}, '3');
    const iv = h('b', {}, '3');
    const chip = h('span', { class: 'scorechip' }, '9');
    const upd = () => {
      const L = +ls.value,
        I = +is.value,
        s = L * I;
      lv.textContent = L;
      iv.textContent = I;
      chip.textContent = s;
      chip.style.background = s >= 20 ? '#8E1F17' : s >= 12 ? '#C0392B' : s >= 6 ? '#B8860F' : '#147D74';
    };
    ls.addEventListener('input', upd);
    is.addEventListener('input', upd);
    p.appendChild(
      h(
        'div',
        { class: 'riskrow' },
        h('div', { class: 'name' }, d.n),
        h(
          'div',
          { class: 'sliders' },
          h('label', {}, 'โอกาสเกิด ', ls, lv),
          h('label', {}, 'ผลกระทบ ', is, iv),
          chip
        )
      )
    );
    chips.push({ d, ls, is });
    upd();
  });

  const btn = h('button', { class: 'btn gold', style: 'margin-top:16px' }, 'เทียบกับการประเมินของผู้เชี่ยวชาญ');
  const out = h('div', {});
  p.append(btn, out);
  btn.addEventListener('click', () => {
    let near = 0;
    const ul = h('ul', {});
    chips.forEach((c) => {
      const L = +c.ls.value,
        I = +c.is.value;
      const okL = L >= c.d.L[0] && L <= c.d.L[1];
      const okI = I >= c.d.I[0] && I <= c.d.I[1];
      if (okL && okI) near++;
      ul.appendChild(
        h(
          'li',
          {},
          `${c.d.n} — ผู้เชี่ยวชาญให้โอกาสเกิด ${c.d.L[0]}–${c.d.L[1]} และผลกระทบ ${c.d.I[0]}–${c.d.I[1]} (คุณให้ ${L} และ ${I})`
        )
      );
    });
    out.innerHTML = '';
    const res = h('div', { class: 'labresult pass' });
    res.appendChild(h('h4', {}, `ประเมินใกล้เคียงช่วงอ้างอิง ${near} จาก ${chips.length} รายการ`));
    res.appendChild(
      h(
        'p',
        { style: 'margin:6px 0' },
        'การประเมินความเสี่ยงไม่มีคำตอบถูกผิดตายตัว สิ่งสำคัญคือใช้เกณฑ์เดียวกันทั้งองค์กรและบันทึกเหตุผลไว้ให้ตรวจสอบย้อนหลังได้'
      )
    );
    res.appendChild(ul);
    out.appendChild(res);
    btn.hidden = true;
    done();
  });
};

/* แล็บ 7 — ประเมินความพร้อมองค์กร */
LABS.checklist = (p, done) => {
  const ITEMS = [
    'มีบัญชีรายการอุปกรณ์และซอฟต์แวร์ที่ใช้งานอยู่ในเครือข่าย',
    'ปิดหรือถอนสิทธิ์บัญชีของผู้ที่ลาออก ย้าย หรือเกษียณ ภายในเวลาที่กำหนด',
    'เปิดใช้การยืนยันตัวตนหลายปัจจัยกับบัญชีผู้ดูแลระบบทุกบัญชี',
    'สำรองข้อมูลตามกฎ 3-2-1 และเคยทดสอบกู้คืนจริงภายในหนึ่งปีที่ผ่านมา',
    'อัปเดตแพตช์ระบบปฏิบัติการและซอฟต์แวร์อย่างสม่ำเสมอ',
    'จัดเก็บข้อมูลจราจรทางคอมพิวเตอร์ย้อนหลังได้ไม่น้อยกว่า 90 วัน',
    'มีนโยบายความมั่นคงปลอดภัยสารสนเทศที่ผู้บริหารลงนามและเผยแพร่แล้ว',
    'มีแผนรับมือเหตุการณ์ผิดปกติ พร้อมรายชื่อผู้ติดต่อนอกเวลาราชการ',
    'มีประกาศความเป็นส่วนตัวและแนวปฏิบัติตาม PDPA ที่ใช้งานจริง',
    'จัดอบรมสร้างความตระหนักให้บุคลากรอย่างน้อยปีละครั้ง',
  ];
  const OPT = ['ยังไม่มี', 'มีบางส่วน', 'ครบถ้วน'];
  const rows = ITEMS.map((t) => {
    const btns = OPT.map((o, i) => h('button', { class: 'pill' }, o));
    let val = null;
    btns.forEach((b, i) =>
      b.addEventListener('click', () => {
        val = i;
        btns.forEach((x) => x.classList.remove('sel'));
        b.classList.add('sel');
      })
    );
    p.appendChild(h('div', { class: 'ck' }, h('div', { class: 't' }, t), h('div', { class: 'opts3' }, btns)));
    return { t, get val() { return val; } };
  });
  const btn = h('button', { class: 'btn gold', style: 'margin-top:16px' }, 'สรุปผลประเมิน');
  const out = h('div', {});
  p.append(btn, out);
  btn.addEventListener('click', () => {
    const answered = rows.filter((r) => r.val !== null);
    if (answered.length < rows.length) {
      out.innerHTML = '';
      out.appendChild(h('div', { class: 'labresult' }, 'กรุณาเลือกสถานะให้ครบทุกรายการก่อนสรุปผล'));
      return;
    }
    const score = rows.reduce((a, r) => a + r.val, 0);
    const pct = Math.round((score / (rows.length * 2)) * 100);
    const gaps = rows.filter((r) => r.val === 0).slice(0, 3);
    const partial = rows.filter((r) => r.val === 1).slice(0, 3 - gaps.length);
    const todo = gaps.concat(partial);
    out.innerHTML = '';
    const res = h('div', { class: 'labresult pass' });
    res.appendChild(h('h4', {}, `ความพร้อมโดยรวม ${pct}%`));
    res.appendChild(
      h(
        'p',
        { style: 'margin:6px 0' },
        pct >= 80
          ? 'อยู่ในระดับดี ขั้นถัดไปคือทำให้ทุกอย่างมีหลักฐานตรวจสอบย้อนหลังได้และทบทวนตามรอบ'
          : pct >= 50
          ? 'มีพื้นฐานอยู่แล้ว ควรเร่งปิดช่องว่างที่ยังไม่มีก่อนเป็นอันดับแรก'
          : 'ยังมีช่องว่างมาก แนะนำให้เริ่มจากรายการพื้นฐานสามข้อด้านล่างนี้ก่อน'
      )
    );
    if (todo.length) {
      res.appendChild(h('p', { style: 'margin:10px 0 0' }, 'สามเรื่องที่ควรลงมือทำก่อน'));
      res.appendChild(h('ol', {}, todo.map((r) => h('li', {}, r.t))));
    }
    out.appendChild(res);
    btn.hidden = true;
    done();
  });
};

/* แล็บ 8 — อ่านคำเตือนใบรับรอง */
LABS.cert = (p, done) => {
  const DATA = [
    {
      n: 'เข้าเว็บของหน่วยงาน แล้วขึ้นว่า “ใบรับรองหมดอายุเมื่อ 40 วันที่แล้ว”',
      go: false,
      why: 'ใบรับรองหมดอายุแปลว่าไม่มีใครยืนยันความถูกต้องอยู่ในขณะนี้ และมักเป็นสัญญาณว่าเว็บถูกปล่อยปละละเลย ควรแจ้งผู้ดูแลระบบให้ต่ออายุก่อน',
    },
    {
      n: 'เข้า https://www.vec.go.th แล้วใบรับรองระบุชื่อโดเมนว่า secure-cdn.example.net',
      go: false,
      why: 'ชื่อโดเมนในใบรับรองไม่ตรงกับโดเมนที่กำลังเข้า เป็นสัญญาณคลาสสิกของการแทรกกลางทาง ห้ามไปต่อเด็ดขาด',
    },
    {
      n: 'เข้าระบบภายในของวิทยาลัยที่ใช้ใบรับรองที่ออกโดยเซิร์ฟเวอร์ของวิทยาลัยเอง และเครื่องได้ติดตั้งใบรับรองรากของวิทยาลัยไว้แล้ว',
      go: true,
      why: 'ใบรับรองที่ออกเองใช้ได้กับระบบภายใน ตราบใดที่มีการติดตั้งใบรับรองรากไว้บนเครื่องผู้ใช้อย่างเป็นระบบ ไม่ใช่ให้ผู้ใช้กดข้ามคำเตือนเอง',
    },
    {
      n: 'เข้าเว็บที่มีกุญแจล็อกและใบรับรองถูกต้องทุกอย่าง แต่โดเมนคือ vec-go-th-login.com',
      go: false,
      why: 'ใบรับรองถูกต้องแต่โดเมนไม่ใช่ของหน่วยงาน นี่คือกรณีที่แสดงว่ากุญแจล็อกรับรองแค่การเข้ารหัส ไม่ได้รับรองว่าปลายทางน่าไว้ใจ',
    },
    {
      n: 'เชื่อมต่อ Wi-Fi ของร้านกาแฟ แล้วทุกเว็บที่เปิดขึ้นคำเตือนใบรับรองเหมือนกันหมด',
      go: false,
      why: 'อาการที่ทุกเว็บเตือนพร้อมกันบ่งชี้ว่ามีอุปกรณ์แทรกกลางทางกำลังเปลี่ยนใบรับรองของทุกเว็บ ควรตัดการเชื่อมต่อทันที',
    },
  ];
  const rows = DATA.map((d) => {
    const yes = h('button', { class: 'pill' }, 'ไปต่อได้');
    const no = h('button', { class: 'pill' }, 'ควรหยุด');
    let pick = null;
    yes.addEventListener('click', () => { pick = true; yes.classList.add('sel'); no.classList.remove('sel'); });
    no.addEventListener('click', () => { pick = false; no.classList.add('sel'); yes.classList.remove('sel'); });
    const why = h('div', { class: 'why', hidden: 'hidden' }, d.why);
    p.appendChild(
      h('div', { class: 'urlrow' }, h('div', { class: 'u', style: 'font-family:inherit;font-size:16px' }, d.n), yes, no, why)
    );
    return { d, yes, no, why, get pick() { return pick; } };
  });
  const btn = h('button', { class: 'btn gold', style: 'margin-top:16px' }, 'ตรวจคำตอบ');
  const out = h('div', {});
  p.append(btn, out);
  btn.addEventListener('click', () => {
    let ok = 0;
    rows.forEach((r) => {
      const right = r.pick === r.d.go;
      if (right) ok++;
      [r.yes, r.no].forEach((b) => (b.disabled = true));
      const chosen = r.pick === true ? r.yes : r.pick === false ? r.no : null;
      if (chosen) { chosen.classList.remove('sel'); chosen.classList.add(right ? 'right' : 'wrong'); }
      (r.d.go ? r.yes : r.no).classList.add('right');
      r.why.hidden = false;
    });
    const pass = ok >= 4;
    out.innerHTML = '';
    out.appendChild(
      h('div', { class: 'labresult' + (pass ? ' pass' : '') },
        h('h4', {}, `ตอบถูก ${ok} จาก ${rows.length} ข้อ`),
        pass
          ? 'หลักที่ใช้ตัดสินคือ คำเตือนที่เกิดจากการตั้งค่าภายในที่ควบคุมได้ ต่างจากคำเตือนที่บ่งชี้ว่ามีคนแทรกกลางทาง'
          : 'ทบทวนสี่สิ่งที่เบราว์เซอร์ตรวจในใบรับรอง แล้วลองใหม่อีกครั้ง'
      )
    );
    btn.hidden = true;
    if (pass) done();
  });
};

/* แล็บ 9 — กฎไฟร์วอลล์ระหว่างวงเครือข่าย */
LABS.firewall = (p, done) => {
  const DATA = [
    { s: 'วงนักเรียน', d: 'อินเทอร์เน็ต (เว็บ)', allow: true, why: 'จำเป็นต่อการเรียนการสอน แต่ควรจำกัดเฉพาะพอร์ตเว็บและผ่านระบบกรองเนื้อหา' },
    { s: 'วงนักเรียน', d: 'เซิร์ฟเวอร์ทะเบียน', allow: false, why: 'ไม่มีเหตุผลทางการทำงานใดที่เครื่องนักเรียนต้องคุยกับเซิร์ฟเวอร์ทะเบียนโดยตรง เส้นทางนี้คือทางที่มัลแวร์จะลามไป' },
    { s: 'วงนักเรียน', d: 'วงบุคลากร', allow: false, why: 'ต้องปิด เพราะเป็นเส้นทางที่ใช้โจมตีเครื่องครูจากเครื่องนักเรียนที่ถูกยึด' },
    { s: 'วงบุคลากร', d: 'เว็บระบบทะเบียน (พอร์ต 443 เท่านั้น)', allow: true, why: 'จำเป็นต่อการทำงาน แต่ต้องเปิดเฉพาะพอร์ตของเว็บแอปพลิเคชัน ไม่ใช่เปิดทุกพอร์ต' },
    { s: 'วงบุคลากร', d: 'ฐานข้อมูลของระบบทะเบียนโดยตรง', allow: false, why: 'ผู้ใช้ควรเข้าผ่านแอปพลิเคชันเท่านั้น การเปิดให้ต่อฐานข้อมูลตรงเป็นช่องทางขโมยข้อมูลทั้งก้อน' },
    { s: 'เซิร์ฟเวอร์ทะเบียน', d: 'อินเทอร์เน็ตขาออกทั้งหมด', allow: false, why: 'ควรอนุญาตเฉพาะปลายทางที่จำเป็น เช่น เซิร์ฟเวอร์อัปเดต การเปิดขาออกทั้งหมดคือช่องทางที่ผู้โจมตีใช้ส่งข้อมูลออกและรับคำสั่ง' },
    { s: 'เครือข่ายผู้มาติดต่อ', d: 'ทุกวงภายใน', allow: false, why: 'เครือข่ายสำหรับแขกต้องแยกขาดจากทุกวงภายใน ให้ออกอินเทอร์เน็ตได้อย่างเดียว' },
  ];
  const rows = DATA.map((d) => {
    const a = h('button', { class: 'pill' }, 'อนุญาต');
    const b = h('button', { class: 'pill' }, 'ปฏิเสธ');
    let pick = null;
    a.addEventListener('click', () => { pick = true; a.classList.add('sel'); b.classList.remove('sel'); });
    b.addEventListener('click', () => { pick = false; b.classList.add('sel'); a.classList.remove('sel'); });
    const why = h('div', { class: 'why', hidden: 'hidden' }, d.why);
    p.appendChild(
      h('div', { class: 'urlrow' },
        h('div', { class: 'u', style: 'font-family:inherit;font-size:16px' }, `${d.s}  →  ${d.d}`),
        a, b, why)
    );
    return { d, a, b, why, get pick() { return pick; } };
  });
  const btn = h('button', { class: 'btn gold', style: 'margin-top:16px' }, 'ตรวจชุดกฎ');
  const out = h('div', {});
  p.append(btn, out);
  btn.addEventListener('click', () => {
    let ok = 0, risky = 0;
    rows.forEach((r) => {
      const right = r.pick === r.d.allow;
      if (right) ok++;
      else if (r.pick === true && r.d.allow === false) risky++;
      [r.a, r.b].forEach((x) => (x.disabled = true));
      const chosen = r.pick === true ? r.a : r.pick === false ? r.b : null;
      if (chosen) { chosen.classList.remove('sel'); chosen.classList.add(right ? 'right' : 'wrong'); }
      (r.d.allow ? r.a : r.b).classList.add('right');
      r.why.hidden = false;
    });
    const pass = ok >= 6;
    out.innerHTML = '';
    out.appendChild(
      h('div', { class: 'labresult' + (pass ? ' pass' : '') },
        h('h4', {}, `ตั้งกฎถูกต้อง ${ok} จาก ${rows.length} เส้นทาง` + (risky ? ` · เปิดเส้นทางเสี่ยงไว้ ${risky} เส้นทาง` : '')),
        pass
          ? 'ยึดหลักเดิมไว้เสมอ คือปฏิเสธทั้งหมดก่อน แล้วเปิดเฉพาะเส้นทางที่อธิบายเหตุผลทางการทำงานได้'
          : 'ลองถามตัวเองทีละเส้นทางว่า “ถ้าปิดเส้นทางนี้ มีงานอะไรทำไม่ได้บ้าง” ถ้าตอบไม่ได้ แปลว่าควรปิด'
      )
    );
    btn.hidden = true;
    if (pass) done();
  });
};

/* ตัวช่วยสร้างแล็บแบบ "แต่ละรายการเลือกหนึ่งตัวเลือก" ใช้ซ้ำได้หลายแล็บ */
function choiceLab(p, done, cfg) {
  const rows = cfg.items.map((d) => {
    const btns = cfg.options.map((label, i) => {
      const b = h('button', { class: 'pill' }, label);
      b.addEventListener('click', () => {
        if (b.disabled) return;
        row.pick = i;
        btns.forEach((x) => x.classList.remove('sel'));
        b.classList.add('sel');
      });
      return b;
    });
    const why = h('div', { class: 'why', hidden: 'hidden' }, d.why);
    const row = {
      d,
      btns,
      why,
      pick: null,
      el: h(
        'div',
        { class: 'urlrow' },
        h(
          'div',
          { class: 'u', style: cfg.mono ? '' : 'font-family:inherit;font-size:16px' },
          d.n
        ),
        ...btns,
        why
      ),
    };
    p.appendChild(row.el);
    return row;
  });

  const btn = h('button', { class: 'btn gold', style: 'margin-top:16px' }, 'ตรวจคำตอบ');
  const out = h('div', {});
  p.append(btn, out);

  btn.addEventListener('click', () => {
    let ok = 0;
    rows.forEach((r) => {
      const right = r.pick === r.d.a;
      if (right) ok++;
      r.btns.forEach((b, i) => {
        b.disabled = true;
        b.classList.remove('sel');
        if (i === r.d.a) b.classList.add('right');
        else if (i === r.pick) b.classList.add('wrong');
      });
      r.why.hidden = false;
      r.why.textContent = (right ? '✔ ' : `✘ คำตอบที่ถูกคือ “${cfg.options[r.d.a]}” — `) + r.d.why;
    });
    const pass = ok >= Math.ceil(rows.length * (cfg.passRatio || 0.8));
    out.innerHTML = '';
    out.appendChild(
      h(
        'div',
        { class: 'labresult' + (pass ? ' pass' : '') },
        h('h4', {}, `ตอบถูก ${ok} จาก ${rows.length} ข้อ`),
        pass ? cfg.okMsg : cfg.badMsg
      )
    );
    btn.hidden = true;
    if (pass) done();
  });
}

/* ตัวช่วยสร้างแล็บแบบ "กรอกคำตอบเป็นข้อความ" */
function textLab(p, done, cfg) {
  const norm = (s) => String(s).trim().toLowerCase().replace(/\s+/g, ' ');
  const rows = cfg.items.map((d) => {
    const inp = h('input', { type: 'text', placeholder: d.ph || '' });
    const why = h('div', { class: 'why', hidden: 'hidden' }, d.why);
    p.appendChild(
      h(
        'div',
        { class: 'field' },
        h('label', {}, d.q),
        inp,
        why
      )
    );
    return { d, inp, why };
  });
  const btn = h('button', { class: 'btn gold', style: 'margin-top:6px' }, 'ตรวจคำตอบ');
  const out = h('div', {});
  p.append(btn, out);
  btn.addEventListener('click', () => {
    let ok = 0;
    rows.forEach((r) => {
      const right = r.d.answers.some((a) => norm(a) === norm(r.inp.value));
      if (right) ok++;
      r.inp.disabled = true;
      r.inp.style.borderColor = right ? '#3FBFAF' : '#E07A6E';
      r.why.hidden = false;
      r.why.textContent = (right ? '✔ ' : `✘ คำตอบที่ถูกคือ ${r.d.answers[0]} — `) + r.d.why;
    });
    const pass = ok >= Math.ceil(rows.length * (cfg.passRatio || 0.75));
    out.innerHTML = '';
    out.appendChild(
      h(
        'div',
        { class: 'labresult' + (pass ? ' pass' : '') },
        h('h4', {}, `ตอบถูก ${ok} จาก ${rows.length} ข้อ`),
        pass ? cfg.okMsg : cfg.badMsg
      )
    );
    btn.hidden = true;
    if (pass) done();
  });
}

/* แล็บ 10 — คำนวณซับเน็ต */
LABS.subnet = (p, done) => {
  // คำนวณคำตอบจากเลขไอพีจริง จึงไม่มีทางพิมพ์เฉลยผิด
  const toInt = (ip) => ip.split('.').reduce((a, o) => (a << 8) + (+o), 0) >>> 0;
  const toIp = (n) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.');
  const calc = (cidr) => {
    const [ip, bits] = cidr.split('/');
    const b = +bits;
    const mask = b === 0 ? 0 : (0xffffffff << (32 - b)) >>> 0;
    const net = (toInt(ip) & mask) >>> 0;
    const bc = (net | (~mask >>> 0)) >>> 0;
    return {
      net: toIp(net),
      bc: toIp(bc),
      mask: toIp(mask),
      hosts: b >= 31 ? 0 : Math.pow(2, 32 - b) - 2,
    };
  };
  const cases = ['192.168.10.77/26', '10.20.30.200/28', '172.16.5.130/25'];
  const items = [];
  cases.forEach((c) => {
    const r = calc(c);
    items.push(
      { q: `${c} — หมายเลขเครือข่าย (Network address)`, answers: [r.net], ph: 'x.x.x.x', why: `ซับเน็ตมาสก์คือ ${r.mask}` },
      { q: `${c} — หมายเลขบรอดแคสต์`, answers: [r.bc], ph: 'x.x.x.x', why: 'ได้จากการเปิดบิตส่วนโฮสต์ให้เป็น 1 ทั้งหมด' },
      { q: `${c} — จำนวนโฮสต์ที่ใช้งานได้`, answers: [String(r.hosts), r.hosts.toLocaleString('en-US')], ph: 'ตัวเลข', why: 'คิดจาก 2 ยกกำลังจำนวนบิตโฮสต์ แล้วลบ 2 สำหรับหมายเลขเครือข่ายและบรอดแคสต์' }
    );
  });
  p.appendChild(
    h('p', { style: 'font-size:15px;color:#A9BED2;margin:0 0 14px' },
      'ตอบเป็นเลขไอพีเต็มรูปแบบ เช่น 192.168.1.0 และตอบจำนวนโฮสต์เป็นตัวเลขล้วน')
  );
  textLab(p, done, {
    items,
    passRatio: 0.7,
    okMsg: 'คำนวณซับเน็ตได้แล้ว ทักษะนี้จำเป็นทั้งตอนแบ่งวงเครือข่าย ตั้งกฎไฟร์วอลล์ และกำหนดขอบเขตการสแกน',
    badMsg: 'ลองแปลงเลขออกเทตที่ซับเน็ตตัดผ่านเป็นเลขฐานสอง แล้วดูว่าบิตไหนเป็นส่วนเครือข่ายบิตไหนเป็นส่วนโฮสต์',
  });
};

/* แล็บ 11 — ประกอบคำสั่ง Nmap */
LABS.nmapcmd = (p, done) => {
  const FLAGS = [
    ['-sn', 'ค้นหาเครื่องที่มีชีวิต โดยไม่สแกนพอร์ต'],
    ['-sV', 'ระบุบริการและเวอร์ชันที่รันบนพอร์ต'],
    ['-O', 'เดาระบบปฏิบัติการของเป้าหมาย'],
    ['-p 22,80,443', 'สแกนเฉพาะพอร์ตที่ระบุ'],
    ['-p-', 'สแกนทุกพอร์ตตั้งแต่ 1 ถึง 65535'],
    ['-T4', 'เร่งความเร็วการสแกน'],
    ['-A', 'เปิดทุกอย่างพร้อมกัน ทั้งเวอร์ชัน ระบบปฏิบัติการ และสคริปต์'],
  ];
  const TASKS = [
    { n: 'อยากรู้ว่าในวงแล็บ 192.168.56.0/24 มีเครื่องเปิดอยู่กี่เครื่อง โดยยังไม่ต้องสแกนพอร์ต', want: ['-sn'] },
    { n: 'อยากรู้ว่าเซิร์ฟเวอร์เป้าหมายเปิดพอร์ต 22, 80 และ 443 หรือไม่ และแต่ละพอร์ตรันซอฟต์แวร์เวอร์ชันอะไร', want: ['-sV', '-p 22,80,443'] },
    { n: 'ต้องการรายงานเชิงลึกที่สุดสำหรับเครื่องเป้าหมายเครื่องเดียวในแล็บ ทั้งเวอร์ชันบริการและระบบปฏิบัติการ', want: ['-A'] },
  ];
  const rows = TASKS.map((tk) => {
    const boxes = FLAGS.map(([f, d]) => {
      const cb = h('input', { type: 'checkbox' });
      const lab = h(
        'label',
        { style: 'display:flex;gap:8px;align-items:flex-start;font-size:14px;color:#DCE6EF;margin:0 0 5px' },
        cb,
        h('span', {}, h('code', { style: 'color:#F0D48A;background:rgba(0,0,0,.3)' }, f), ' ' + d)
      );
      return { f, cb, lab };
    });
    const why = h('div', { class: 'why', hidden: 'hidden' });
    const wrap = h(
      'div',
      { style: 'padding:14px 0;border-bottom:1px solid rgba(255,255,255,.1)' },
      h('div', { style: 'font-size:16px;margin-bottom:10px' }, tk.n),
      ...boxes.map((b) => b.lab),
      why
    );
    p.appendChild(wrap);
    return { tk, boxes, why };
  });
  const btn = h('button', { class: 'btn gold', style: 'margin-top:16px' }, 'ตรวจคำสั่ง');
  const out = h('div', {});
  p.append(btn, out);
  btn.addEventListener('click', () => {
    let ok = 0;
    rows.forEach((r) => {
      const picked = r.boxes.filter((b) => b.cb.checked).map((b) => b.f);
      const right =
        picked.length === r.tk.want.length && picked.every((f) => r.tk.want.includes(f));
      if (right) ok++;
      r.boxes.forEach((b) => (b.cb.disabled = true));
      r.why.hidden = false;
      r.why.textContent =
        (right ? '✔ ถูกต้อง — ' : '✘ ยังไม่ตรง — ') +
        `คำสั่งที่เหมาะสมคือ nmap ${r.tk.want.join(' ')} <เป้าหมาย>`;
    });
    const pass = ok >= 2;
    out.innerHTML = '';
    out.appendChild(
      h(
        'div',
        { class: 'labresult' + (pass ? ' pass' : '') },
        h('h4', {}, `ประกอบคำสั่งถูก ${ok} จาก ${rows.length} ข้อ`),
        pass
          ? 'หลักคือเลือกเท่าที่จำเป็นต่อคำถาม ยิ่งใส่ตัวเลือกมากยิ่งช้าและยิ่งถูกตรวจจับง่าย'
          : 'ทบทวนว่าแต่ละตัวเลือกตอบคำถามอะไร แล้วเลือกเฉพาะตัวที่จำเป็นจริง ๆ'
      )
    );
    btn.hidden = true;
    if (pass) done();
  });
};

/* แล็บ 12 — เขียน display filter ของ Wireshark */
LABS.wireshark = (p, done) => {
  p.appendChild(
    h('p', { style: 'font-size:15px;color:#A9BED2;margin:0 0 14px' },
      'พิมพ์ display filter ให้ถูกต้อง ตัวพิมพ์เล็กพิมพ์ใหญ่และช่องว่างส่วนเกินไม่มีผล')
  );
  textLab(p, done, {
    items: [
      {
        q: 'แสดงเฉพาะทราฟฟิก HTTP',
        answers: ['http'],
        ph: 'เช่น dns',
        why: 'Wireshark ใช้ชื่อโปรโตคอลตัวพิมพ์เล็กเป็นตัวกรองได้โดยตรง',
      },
      {
        q: 'แสดงเฉพาะแพ็กเก็ตที่มีไอพีต้นทางเป็น 192.168.1.10',
        answers: ['ip.src == 192.168.1.10', 'ip.src==192.168.1.10', 'ip.src eq 192.168.1.10'],
        ph: 'ip.src == ...',
        why: 'ใช้ ip.src สำหรับต้นทาง และ ip.dst สำหรับปลายทาง ส่วน ip.addr ใช้เมื่อสนใจทั้งสองฝั่ง',
      },
      {
        q: 'แสดงเฉพาะทราฟฟิก TCP ที่วิ่งไปยังพอร์ต 3389',
        answers: ['tcp.dstport == 3389', 'tcp.dstport==3389', 'tcp.dstport eq 3389'],
        ph: 'tcp.dstport == ...',
        why: 'ถ้าใช้ tcp.port จะได้ทั้งขาไปและขากลับ ซึ่งบางครั้งก็ต้องการ แต่โจทย์นี้ระบุขาไปอย่างเดียว',
      },
      {
        q: 'แสดงเฉพาะแพ็กเก็ต TCP ที่ตั้งธง SYN ไว้ (ใช้ตรวจร่องรอยการสแกนพอร์ต)',
        answers: ['tcp.flags.syn == 1', 'tcp.flags.syn==1', 'tcp.flags.syn eq 1'],
        ph: 'tcp.flags.syn == ...',
        why: 'การเห็น SYN จำนวนมากไปยังหลายพอร์ตในเวลาสั้น ๆ คือลายเซ็นของการสแกนพอร์ต',
      },
      {
        q: 'แสดงเฉพาะการสอบถาม DNS ที่ไม่ใช่คำตอบ',
        answers: ['dns.flags.response == 0', 'dns.flags.response==0', 'dns.flags.response eq 0'],
        ph: 'dns.flags.response == ...',
        why: 'ค่า 0 คือคำถาม ส่วน 1 คือคำตอบ ใช้แยกดูว่าเครื่องพยายามถามหาโดเมนอะไรบ้าง',
      },
    ],
    passRatio: 0.6,
    okMsg: 'เขียน display filter ได้แล้ว จำไว้ว่า display filter ใช้ตอนดู ส่วน capture filter ใช้ตอนดักจับและมีไวยากรณ์คนละแบบ',
    badMsg: 'ลองใช้ปุ่มสร้างตัวกรองในโปรแกรมจริงดูก่อน แล้วสังเกตข้อความที่โปรแกรมเติมให้ในช่องตัวกรอง',
  });
};

/* แล็บ 13 — ประกอบกฎ Snort */
LABS.snort = (p, done) => {
  const parts = [
    { k: 'action', label: 'สิ่งที่ต้องการให้ทำ', opts: ['alert', 'drop', 'pass'], want: 0, why: 'โจทย์ต้องการแค่แจ้งเตือน ไม่ได้ต้องการบล็อก และการใช้ drop ต้องรันในโหมด IPS เท่านั้น' },
    { k: 'proto', label: 'โปรโตคอล', opts: ['tcp', 'udp', 'icmp'], want: 0, why: 'RDP ทำงานบน TCP พอร์ต 3389' },
    { k: 'src', label: 'ต้นทาง', opts: ['$HOME_NET', '$EXTERNAL_NET', 'any'], want: 1, why: 'โจทย์ระบุว่ามาจากภายนอกองค์กร จึงใช้ $EXTERNAL_NET' },
    { k: 'dst', label: 'ปลายทาง', opts: ['$HOME_NET', '$EXTERNAL_NET', 'any'], want: 0, why: 'ปลายทางคือเครื่องภายในองค์กรของเรา' },
    { k: 'port', label: 'พอร์ตปลายทาง', opts: ['22', '443', '3389'], want: 2, why: 'RDP ใช้พอร์ต 3389 ซึ่งเป็นเป้าโจมตีที่พบบ่อยมาก' },
    { k: 'sid', label: 'หมายเลขกฎ', opts: ['sid:1;', 'sid:1000001;', 'ไม่ต้องใส่'], want: 1, why: 'กฎที่เขียนเองต้องใช้หมายเลขตั้งแต่ 1000000 ขึ้นไป เพื่อไม่ชนกับกฎมาตรฐาน และทุกกฎต้องมี sid' },
  ];
  p.appendChild(
    h('p', { style: 'font-size:16px;margin:0 0 6px' },
      'โจทย์: ต้องการให้ระบบ แจ้งเตือน เมื่อมีการพยายามเชื่อมต่อ RDP จากภายนอกเข้ามายังเครื่องภายในองค์กร')
  );
  const preview = h('div', { class: 'hashout', style: 'margin:12px 0 16px' });
  p.appendChild(preview);

  const rows = parts.map((pt) => {
    const sel = h('select', {}, h('option', { value: '' }, '— เลือก —'), pt.opts.map((o, i) => h('option', { value: String(i) }, o)));
    sel.addEventListener('change', paint);
    const why = h('div', { class: 'why', hidden: 'hidden' }, pt.why);
    p.appendChild(
      h('div', { class: 'urlrow' },
        h('div', { class: 'u', style: 'font-family:inherit;font-size:16px' }, pt.label),
        h('div', { style: 'min-width:190px' }, sel), why)
    );
    return { pt, sel, why };
  });

  function paint() {
    const v = (i) => {
      const s = rows[i].sel.value;
      return s === '' ? '…' : parts[i].opts[+s];
    };
    preview.textContent =
      `${v(0)} ${v(1)} ${v(2)} any -> ${v(3)} ${v(4)} ( msg:"RDP attempt from outside"; flow:to_server; ${v(5) === 'ไม่ต้องใส่' ? '' : v(5)} rev:1; )`;
  }
  paint();

  const btn = h('button', { class: 'btn gold', style: 'margin-top:16px' }, 'ตรวจกฎ');
  const out = h('div', {});
  p.append(btn, out);
  btn.addEventListener('click', () => {
    let ok = 0;
    rows.forEach((r) => {
      const right = +r.sel.value === r.pt.want;
      if (right) ok++;
      r.sel.disabled = true;
      r.sel.style.borderColor = right ? '#3FBFAF' : '#E07A6E';
      r.why.hidden = false;
      r.why.textContent = (right ? '✔ ' : `✘ ที่ถูกคือ ${r.pt.opts[r.pt.want]} — `) + r.pt.why;
    });
    const pass = ok >= 5;
    out.innerHTML = '';
    out.appendChild(
      h(
        'div',
        { class: 'labresult' + (pass ? ' pass' : '') },
        h('h4', {}, `ถูกต้อง ${ok} จาก ${rows.length} ส่วน`),
        pass
          ? 'ก่อนนำกฎขึ้นใช้จริง ควรรันในโหมดแจ้งเตือนสักระยะเพื่อดูว่ามีการแจ้งเตือนผิดพลาดมากแค่ไหน แล้วจึงค่อยพิจารณาปรับเป็น drop'
          : 'ทบทวนโครงสร้างส่วนหัวของกฎ คือ action protocol ต้นทาง พอร์ต -> ปลายทาง พอร์ต'
      )
    );
    btn.hidden = true;
    if (pass) done();
  });
};

/* แล็บ 14 — จัดลำดับความสำคัญของช่องโหว่ */
LABS.cvss = (p, done) => {
  p.appendChild(
    h('p', { style: 'font-size:15px;color:#A9BED2;margin:0 0 14px' },
      'ผลสแกนของสถานศึกษาแห่งหนึ่ง ให้จัดลำดับว่าควรจัดการเมื่อใด โดยดูทั้งคะแนนและบริบท')
  );
  choiceLab(p, done, {
    options: ['แก้ทันที', 'ภายในรอบถัดไป', 'เฝ้าระวังไว้ก่อน'],
    passRatio: 0.8,
    items: [
      {
        n: 'CVSS 9.8 — ช่องโหว่รันโค้ดระยะไกลบนเว็บเซิร์ฟเวอร์ระบบทะเบียนที่เปิดสู่อินเทอร์เน็ต และมีโค้ดโจมตีเผยแพร่แล้ว',
        a: 0,
        why: 'คะแนนสูง เข้าถึงได้จากอินเทอร์เน็ต และมีโค้ดโจมตีพร้อมใช้ ครบทั้งสามปัจจัย ต้องแก้เป็นอันดับแรก',
      },
      {
        n: 'CVSS 9.1 — ช่องโหว่บนเครื่องพิมพ์ในห้องพักครู ซึ่งอยู่ในวงภายในและไม่เปิดออกอินเทอร์เน็ต',
        a: 1,
        why: 'คะแนนสูงแต่เข้าถึงจากภายนอกไม่ได้ จึงเร่งด่วนน้อยกว่าข้อแรก แต่ยังต้องแก้เพราะเป็นจุดตั้งหลักของผู้โจมตีที่เข้ามาได้แล้ว',
      },
      {
        n: 'CVSS 7.5 — เซิร์ฟเวอร์ยังใช้โปรโตคอล SMBv1 ซึ่งเลิกใช้ไปแล้ว และเป็นช่องทางที่แรนซัมแวร์ใช้แพร่กระจาย',
        a: 0,
        why: 'คะแนนไม่สูงที่สุดแต่เป็นเส้นทางแพร่กระจายของแรนซัมแวร์ที่รู้จักกันดี การปิด SMBv1 ทำได้เร็วและได้ผลมาก จึงควรทำทันที',
      },
      {
        n: 'CVSS 5.3 — เว็บเซิร์ฟเวอร์เปิดเผยหมายเลขเวอร์ชันของซอฟต์แวร์ใน HTTP header',
        a: 2,
        why: 'เป็นการเปิดเผยข้อมูลที่ช่วยผู้โจมตีวางแผน แต่ไม่ได้ทำให้ถูกเจาะโดยตรง จัดการตามความสะดวกได้',
      },
      {
        n: 'CVSS 4.3 — ใบรับรอง TLS ของเว็บภายในจะหมดอายุในอีก 20 วัน',
        a: 1,
        why: 'ไม่ใช่ช่องโหว่ที่ถูกเจาะได้ทันที แต่มีกำหนดเวลาชัดเจน ถ้าปล่อยจนหมดอายุจะกระทบการให้บริการ จึงควรจัดการในรอบถัดไปก่อนถึงกำหนด',
      },
    ],
    okMsg: 'จัดลำดับได้ดี หลักคือ ดูคะแนนเป็นจุดตั้งต้น แล้วถ่วงด้วยสามคำถาม คือเข้าถึงจากอินเทอร์เน็ตได้ไหม มีข้อมูลสำคัญไหม และมีโค้ดโจมตีแล้วหรือยัง',
    badMsg: 'ลองทบทวนว่าคะแนน CVSS ไม่ได้บอกความเร่งด่วนโดยตรง บริบทของเครื่องนั้นสำคัญไม่แพ้คะแนน',
  });
};

/* ---------- 13. เมนู ปุ่มจัดการข้อมูล และการเริ่มทำงาน ---------- */

function closeNav() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('scrim').hidden = true;
  document.getElementById('navToggle').setAttribute('aria-expanded', 'false');
}
document.getElementById('navToggle').addEventListener('click', () => {
  const sb = document.getElementById('sidebar');
  const open = sb.classList.toggle('open');
  document.getElementById('scrim').hidden = !open;
  document.getElementById('navToggle').setAttribute('aria-expanded', String(open));
});
document.getElementById('scrim').addEventListener('click', closeNav);

document.getElementById('btnExport').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ความคืบหน้า-คลังความรู้ไซเบอร์.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('btnImport').addEventListener('click', () => document.getElementById('fileInput').click());
document.getElementById('fileInput').addEventListener('change', (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      S = Object.assign(blank(), JSON.parse(r.result));
      save();
      paintXP();
      route();
      toast('นำเข้าความคืบหน้าเรียบร้อย');
    } catch (err) {
      toast('ไฟล์ไม่ถูกต้อง');
    }
  };
  r.readAsText(f);
  e.target.value = '';
});
document.getElementById('btnReset').addEventListener('click', () => {
  if (!confirm('ล้างความคืบหน้าทั้งหมดและเริ่มใหม่จากศูนย์ ยืนยันหรือไม่')) return;
  S = blank();
  save();
  paintXP();
  route();
  toast('ล้างความคืบหน้าแล้ว');
});

window.addEventListener('hashchange', route);

// ลงทะเบียน service worker เพื่อให้เบราว์เซอร์เสนอให้ติดตั้งเป็นแอปบนหน้าโฮม
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* ถ้าลงทะเบียนไม่ได้ เว็บก็ยังใช้งานได้ตามปกติ */
    });
  });
}
window.addEventListener('beforeunload', () => {
  if (ME && syncTimer) {
    clearTimeout(syncTimer);
    try {
      navigator.sendBeacon(
        '/api/progress',
        new Blob([JSON.stringify({ progress: S })], { type: 'application/json' })
      );
    } catch (e) {}
  }
});

paintXP();
paintAcct();
route();
loadMe();
