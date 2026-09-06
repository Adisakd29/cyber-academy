const express = require('express');
const path = require('path');
const fs = require('fs');

const db = require('./lib/db');
const auth = require('./lib/auth');
const apiRoutes = require('./lib/api');

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));
app.use(auth.attachUser);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
const CONTENT_DIR = path.join(__dirname, 'content');

/**
 * โหลดเนื้อหาทุกไฟล์ในโฟลเดอร์ content โดยอัตโนมัติ
 * - ไฟล์ที่ขึ้นต้นด้วย "_" จะถูกข้าม (ใช้เป็นเทมเพลต)
 * - เพิ่มไฟล์ใหม่ = เนื้อหาใหม่โผล่ทันที ของเก่าไม่หาย
 */
function loadCourses() {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.js') && !f.startsWith('_') && f !== 'index.js')
    .sort();

  const courses = [];
  for (const file of files) {
    const full = path.join(CONTENT_DIR, file);
    try {
      delete require.cache[require.resolve(full)];
      const course = require(full);
      if (!course || !course.id) {
        console.warn(`[content] ข้าม ${file}: ไม่มีฟิลด์ id`);
        continue;
      }
      course.__file = file;
      courses.push(course);
    } catch (err) {
      console.error(`[content] อ่าน ${file} ไม่สำเร็จ:`, err.message);
    }
  }
  courses.sort((a, b) => (a.order || 999) - (b.order || 999));
  return courses;
}

let cache = null;
function getCourses() {
  if (process.env.NODE_ENV !== 'production') return loadCourses(); // dev: reload ทุกครั้ง
  if (!cache) cache = loadCourses();
  return cache;
}

app.get('/api/courses', (req, res) => {
  const courses = getCourses();
  // ส่งเฉพาะข้อมูลสรุปเพื่อให้หน้าแรกโหลดเร็ว
  res.json(
    courses.map((c) => ({
      id: c.id,
      order: c.order,
      code: c.code,
      title: c.title,
      subtitle: c.subtitle,
      summary: c.summary,
      objectives: c.objectives || [],
      lessons: (c.lessons || []).map((l) => ({
        id: l.id,
        title: l.title,
        minutes: l.minutes,
        exp: l.exp || 60,
        blurb: l.blurb || '',
        challenges: (l.blocks || [])
          .filter((b) => b.type === 'chal')
          .map((b) => ({ cat: b.cat, title: b.title, points: b.points || 0, level: b.level || '' })),
      })),
      hasFinalQuiz: Array.isArray(c.finalQuiz) && c.finalQuiz.length > 0,
    }))
  );
});

app.get('/api/courses/:id', (req, res) => {
  const course = getCourses().find((c) => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: 'ไม่พบหลักสูตรนี้' });
  res.json(course);
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, courses: getCourses().length, store: db.kind });
});

app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

db.ready
  .catch((e) => console.error('[db] เริ่มต้นฐานข้อมูลไม่สำเร็จ:', e.message))
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(
        `เปิดใช้งานที่ http://localhost:${PORT}  (เนื้อหา ${getCourses().length} หลักสูตร, ที่เก็บข้อมูล ${db.kind})`
      );
    });
  });
