/**
 * คลังภาพประกอบแบบ SVG
 * ------------------------------------------------------------------
 * ไฟล์นี้ขึ้นต้นด้วย _ จึงไม่ถูกโหลดเป็นหมวดเนื้อหา แต่ให้ไฟล์อื่น require ไปใช้
 *
 *   const F = require('./_figures');
 *   { type: 'figure', title: '...', svg: F.ciaTriad, caption: '...' }
 *
 * ทุกภาพวางบนพื้นขาว ใช้จานสีเดียวกับเว็บ และปรับขนาดตามความกว้างคอลัมน์เอง
 */

const INK = '#0F2338';
const INK2 = '#35506D';
const INK3 = '#6E8299';
const GOLD = '#B8860F';
const GOLDL = '#F6E9C6';
const TEAL = '#147D74';
const TEALL = '#DCEFEC';
const CRIM = '#A8342A';
const CRIML = '#F7E3E0';
const PAPER = '#EDF1F5';
const LINE = '#D3DCE5';

const FONT = 'IBM Plex Sans Thai, sans-serif';
const DISP = 'Chakra Petch, IBM Plex Sans Thai, sans-serif';

/** เปิดแท็ก svg พร้อมค่าตั้งต้นที่ใช้ซ้ำทุกภาพ */
const svg = (w, hgt, body) =>
  `<svg viewBox="0 0 ${w} ${hgt}" xmlns="http://www.w3.org/2000/svg" role="img" ` +
  `font-family="${FONT}" font-size="14">${body}</svg>`;

/** กล่องสี่เหลี่ยมมุมมนพร้อมข้อความหลายบรรทัด */
function box(x, y, w, hgt, lines, o = {}) {
  const fill = o.fill || '#fff';
  const stroke = o.stroke || LINE;
  const color = o.color || INK;
  const size = o.size || 14;
  const weight = o.weight || 400;
  const font = o.display ? DISP : FONT;
  const arr = [].concat(lines);
  const lh = o.lh || size * 1.5;
  const startY = y + hgt / 2 - ((arr.length - 1) * lh) / 2 + size * 0.36;
  const text = arr
    .map(
      (t, i) =>
        `<text x="${x + w / 2}" y="${startY + i * lh}" text-anchor="middle" fill="${color}" ` +
        `font-size="${size}" font-weight="${weight}" font-family="${font}">${t}</text>`
    )
    .join('');
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${hgt}" rx="${o.r ?? 9}" fill="${fill}" ` +
    `stroke="${stroke}" stroke-width="${o.sw || 1.5}"/>${text}`
  );
}

/** ข้อความบรรทัดเดียว */
const t = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" fill="${o.color || INK2}" font-size="${o.size || 14}" ` +
  `font-weight="${o.weight || 400}" text-anchor="${o.anchor || 'start'}" ` +
  `font-family="${o.display ? DISP : FONT}">${s}</text>`;

/** หัวลูกศร ใช้ร่วมกันทุกภาพ */
const ARROWS = `<defs>
<marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
  <path d="M0 0 L10 5 L0 10 z" fill="${INK3}"/></marker>
<marker id="arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
  <path d="M0 0 L10 5 L0 10 z" fill="${GOLD}"/></marker>
<marker id="art" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
  <path d="M0 0 L10 5 L0 10 z" fill="${TEAL}"/></marker>
<marker id="arc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
  <path d="M0 0 L10 5 L0 10 z" fill="${CRIM}"/></marker>
</defs>`;

const line = (x1, y1, x2, y2, o = {}) =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${o.color || INK3}" stroke-width="${o.w || 1.6}" ` +
  `fill="none" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''} ` +
  `${o.arrow === false ? '' : `marker-end="url(#${o.m || 'ar'})"`}/>`;

const F = {};

/* ══════════════ CS-101 พื้นฐาน ══════════════ */

F.ciaTriad = svg(
  660,
  330,
  ARROWS +
    `<path d="M330 28 L610 296 L50 296 Z" fill="${PAPER}" stroke="${LINE}" stroke-width="2"/>` +
    box(240, 8, 180, 52, ['Confidentiality', 'การรักษาความลับ'], {
      fill: '#fff', stroke: INK, color: INK, weight: 600, display: true, size: 15, lh: 19,
    }) +
    box(10, 268, 190, 52, ['Availability', 'ความพร้อมใช้งาน'], {
      fill: '#fff', stroke: TEAL, color: TEAL, weight: 600, display: true, size: 15, lh: 19,
    }) +
    box(460, 268, 190, 52, ['Integrity', 'ความถูกต้องครบถ้วน'], {
      fill: '#fff', stroke: GOLD, color: GOLD, weight: 600, display: true, size: 15, lh: 19,
    }) +
    box(240, 150, 180, 56, ['ข้อมูลและระบบ', 'ที่ต้องปกป้อง'], {
      fill: INK, stroke: INK, color: '#fff', weight: 600, display: true, size: 15, lh: 19,
    }) +
    t(330, 92, 'เข้ารหัส · กำหนดสิทธิ์ · พิสูจน์ตัวตน', { anchor: 'middle', size: 13, color: INK3 }) +
    t(105, 258, 'สำรองข้อมูล · ระบบสำรอง', { anchor: 'middle', size: 13, color: INK3 }) +
    t(555, 258, 'ค่าแฮช · ลายเซ็นดิจิทัล · log', { anchor: 'middle', size: 13, color: INK3 }) +
    t(330, 318, 'เพิ่มด้านหนึ่งมากเกินไป มักทำให้อีกด้านแย่ลง', {
      anchor: 'middle', size: 13.5, color: CRIM, weight: 600,
    })
);

F.riskFormula = svg(
  660,
  300,
  ARROWS +
    box(20, 20, 150, 62, ['สินทรัพย์', 'สิ่งที่เราหวงแหน'], { fill: TEALL, stroke: TEAL, color: TEAL, weight: 600, display: true, size: 15, lh: 18 }) +
    box(255, 20, 150, 62, ['ภัยคุกคาม', 'สิ่งภายนอก'], { fill: CRIML, stroke: CRIM, color: CRIM, weight: 600, display: true, size: 15, lh: 18 }) +
    box(490, 20, 150, 62, ['ช่องโหว่', 'จุดอ่อนของเรา'], { fill: GOLDL, stroke: GOLD, color: GOLD, weight: 600, display: true, size: 15, lh: 18 }) +
    line(330, 90, 330, 128, { m: 'ar' }) +
    line(565, 90, 400, 128, { m: 'ar' }) +
    line(95, 90, 260, 128, { m: 'ar' }) +
    box(180, 132, 300, 58, ['ความเสี่ยง = โอกาสเกิด × ผลกระทบ'], {
      fill: INK, stroke: INK, color: '#fff', weight: 700, display: true, size: 17,
    }) +
    line(255, 198, 190, 232, { m: 'art' }) +
    line(405, 198, 470, 232, { m: 'art' }) +
    box(30, 236, 300, 54, ['ลดโอกาสเกิด → ปิดช่องโหว่', 'แพตช์ · MFA · จำกัดสิทธิ์'], {
      fill: '#fff', stroke: TEAL, color: INK2, size: 13.5, lh: 18,
    }) +
    box(340, 236, 300, 54, ['ลดผลกระทบ → เตรียมรับมือ', 'สำรองข้อมูล · แผนความต่อเนื่อง'], {
      fill: '#fff', stroke: TEAL, color: INK2, size: 13.5, lh: 18,
    }) +
    t(650, 108, 'ภัยคุกคามอยู่นอกการควบคุมของเรา', { anchor: 'end', size: 12.5, color: INK3 })
);

F.defenseDepth = svg(
  660,
  300,
  ARROWS +
    [
      ['ชั้นกายภาพ — ล็อกห้อง กล้องวงจรปิด', 0],
      ['ชั้นเครือข่าย — ไฟร์วอลล์ แยกวงเครือข่าย', 1],
      ['ชั้นอุปกรณ์ — แพตช์ โปรแกรมป้องกันมัลแวร์', 2],
      ['ชั้นแอปและข้อมูล — สิทธิ์ เข้ารหัส สำรองข้อมูล', 3],
    ]
      .map(
        ([label, i]) =>
          `<rect x="${20 + i * 34}" y="${20 + i * 28}" width="${560 - i * 68}" height="${
            252 - i * 56
          }" rx="12" fill="${i % 2 ? PAPER : '#fff'}" stroke="${LINE}" stroke-width="1.5"/>` +
          t(30 + i * 34 + 12, 40 + i * 28, label, { size: 13, color: INK2, weight: 600 })
      )
      .join('') +
    box(180, 150, 240, 56, ['สินทรัพย์ที่ต้องปกป้อง'], {
      fill: INK, stroke: INK, color: '#fff', weight: 600, display: true, size: 15,
    }) +
    line(645, 90, 500, 90, { m: 'arc', color: CRIM }) +
    t(650, 76, 'ผู้โจมตี', { anchor: 'end', size: 13, color: CRIM, weight: 600 }) +
    t(650, 286, 'ชั้นที่คุ้มค่าที่สุดและถูกละเลยที่สุดคือ “คน”', { anchor: 'end', size: 13, color: GOLD, weight: 600 })
);

F.ransomwareChain = svg(
  660,
  250,
  ARROWS +
    [
      ['1', 'เข้ามาได้', 'อีเมลหลอกลวง หรือ', 'รหัสผ่านที่รั่วไหล'],
      ['2', 'ตั้งหลัก', 'ฝังตัวและเปิด', 'ช่องทางกลับเข้ามา'],
      ['3', 'ขยายสิทธิ์', 'ไล่หาบัญชี', 'ผู้ดูแลระบบ'],
      ['4', 'ลบสำรอง', 'ทำลายไฟล์สำรอง', 'ก่อนลงมือจริง'],
      ['5', 'เข้ารหัส', 'ลงมือคืนวันศุกร์', 'หรือวันหยุดยาว'],
    ]
      .map(([n, title, l1, l2], i) => {
        const x = 12 + i * 129;
        const danger = i >= 3;
        return (
          box(x, 100, 116, 58, [l1, l2], {
            fill: danger ? CRIML : '#fff',
            stroke: danger ? CRIM : LINE,
            color: INK2,
            size: 12,
            lh: 17,
          }) +
          `<circle cx="${x + 58}" cy="44" r="16" fill="${danger ? CRIM : INK}"/>` +
          t(x + 58, 49, n, { anchor: 'middle', color: '#fff', weight: 700, size: 14, display: true }) +
          `<text x="${x + 58}" y="86" text-anchor="middle" font-size="13.5" font-weight="600" fill="${
            danger ? CRIM : INK
          }" font-family="${DISP}">${title}</text>` +
          (i < 4 ? line(x + 118, 129, x + 127, 129, { m: 'ar' }) : '')
        );
      })
      .join('') +
    t(12, 196, 'ระยะเวลาตั้งแต่เข้ามาได้จนถึงวันลงมือ มักกินเวลาหลายวันถึงหลายสัปดาห์', { size: 13.5, color: INK2 }) +
    t(12, 220, 'จุดที่ต้องตัดวงจรให้ได้คือขั้นที่ 4 — สำเนาสำรองต้องแยกออกจากเครือข่าย', {
      size: 13.5, color: CRIM, weight: 600,
    }) +
    t(12, 242, 'สำรองข้อมูลไว้บนไดรฟ์ที่เสียบต่ออยู่ตลอดเวลา จึงยังไม่นับว่าปลอดภัย', { size: 13, color: INK3 })
);

F.mfaFactors = svg(
  660,
  230,
  ARROWS +
    box(14, 20, 200, 150, [], { fill: '#fff', stroke: INK }) +
    box(230, 20, 200, 150, [], { fill: '#fff', stroke: GOLD }) +
    box(446, 20, 200, 150, [], { fill: '#fff', stroke: TEAL }) +
    t(114, 52, 'สิ่งที่คุณรู้', { anchor: 'middle', size: 16, weight: 600, color: INK, display: true }) +
    t(330, 52, 'สิ่งที่คุณมี', { anchor: 'middle', size: 16, weight: 600, color: GOLD, display: true }) +
    t(546, 52, 'สิ่งที่คุณเป็น', { anchor: 'middle', size: 16, weight: 600, color: TEAL, display: true }) +
    [
      [114, ['รหัสผ่าน', 'PIN', 'คำถามกู้คืนบัญชี']],
      [330, ['แอป Authenticator', 'กุญแจ USB', 'OTP ทาง SMS (อ่อนที่สุด)']],
      [546, ['ลายนิ้วมือ', 'ใบหน้า', 'ม่านตา']],
    ]
      .map(([cx, arr]) =>
        arr.map((s, i) => t(cx, 82 + i * 26, s, { anchor: 'middle', size: 13.5, color: INK2 })).join('')
      )
      .join('') +
    box(14, 186, 632, 38, ['MFA ที่แท้จริง = ผสมอย่างน้อยสองกล่องที่ต่างกัน · รหัสผ่าน + คำถามลับ ไม่ใช่ MFA เพราะอยู่กล่องเดียวกัน'], {
      fill: PAPER, stroke: LINE, color: INK2, size: 13.5,
    })
);

F.hashVsEncrypt = svg(
  660,
  280,
  ARROWS +
    t(12, 24, 'การเข้ารหัส — ย้อนกลับได้ด้วยกุญแจ', { size: 15, weight: 600, color: INK, display: true }) +
    box(12, 38, 130, 50, ['ข้อความเดิม'], { fill: '#fff', stroke: LINE, color: INK2, size: 13 }) +
    line(148, 63, 190, 63, { m: 'ar' }) +
    box(196, 38, 120, 50, ['เข้ารหัส', 'AES-256'], { fill: GOLDL, stroke: GOLD, color: GOLD, size: 13, weight: 600, lh: 16 }) +
    line(322, 63, 364, 63, { m: 'ar' }) +
    box(370, 38, 130, 50, ['ข้อความลับ'], { fill: '#fff', stroke: LINE, color: INK2, size: 13 }) +
    line(506, 63, 548, 63, { m: 'ar' }) +
    box(554, 38, 94, 50, ['ถอดกลับ', 'ได้'], { fill: TEALL, stroke: TEAL, color: TEAL, size: 13, weight: 600, lh: 16 }) +
    `<path d="M12 108 L648 108" stroke="${LINE}" stroke-width="1.5"/>` +
    t(12, 140, 'การแฮช — เป็นทางเดียว ถอดกลับไม่ได้', { size: 15, weight: 600, color: INK, display: true }) +
    box(12, 154, 130, 50, ['รหัสผ่าน'], { fill: '#fff', stroke: LINE, color: INK2, size: 13 }) +
    line(148, 179, 190, 179, { m: 'ar' }) +
    box(196, 154, 120, 50, ['แฮช', 'SHA-256 / bcrypt'], { fill: GOLDL, stroke: GOLD, color: GOLD, size: 12, weight: 600, lh: 16 }) +
    line(322, 179, 364, 179, { m: 'ar' }) +
    box(370, 154, 180, 50, ['ค่าแฮชความยาวคงที่'], { fill: '#fff', stroke: LINE, color: INK2, size: 13 }) +
    line(600, 179, 566, 179, { m: 'arc', color: CRIM, dash: '5 4' }) +
    t(648, 174, 'ถอดกลับ', { anchor: 'end', size: 13, color: CRIM, weight: 600 }) +
    t(648, 192, 'ไม่ได้', { anchor: 'end', size: 13, color: CRIM, weight: 600 }) +
    box(12, 224, 636, 44, ['ระบบที่ออกแบบดีจะเก็บ “ค่าแฮช” ของรหัสผ่าน ไม่ใช่ตัวรหัสผ่าน — เว็บที่ส่งรหัสผ่านเดิมกลับมาให้ทางอีเมล คือเว็บที่เก็บรหัสผ่านแบบไม่ปลอดภัย'], {
      fill: PAPER, stroke: LINE, color: INK2, size: 13,
    })
);

F.backup321 = svg(
  660,
  250,
  ARROWS +
    box(14, 24, 200, 150, [], { fill: '#fff', stroke: LINE }) +
    box(230, 24, 200, 150, [], { fill: '#fff', stroke: LINE }) +
    box(446, 24, 200, 150, [], { fill: '#fff', stroke: CRIM, sw: 2 }) +
    [
      [114, '3', 'สามสำเนา', ['ตัวจริง 1', 'สำเนา 2'], INK],
      [330, '2', 'สองชนิดสื่อ', ['ฮาร์ดดิสก์', 'คลาวด์ หรือเทป'], GOLD],
      [546, '1', 'หนึ่งชุดแยกออก', ['ออฟไลน์ทั้งหมด', 'หรือเก็บนอกสถานที่'], CRIM],
    ]
      .map(
        ([cx, n, head, arr, c]) =>
          `<circle cx="${cx}" cy="58" r="21" fill="${c}"/>` +
          t(cx, 65, n, { anchor: 'middle', color: '#fff', weight: 700, size: 20, display: true }) +
          t(cx, 104, head, { anchor: 'middle', size: 15, weight: 600, color: c, display: true }) +
          arr.map((s, i) => t(cx, 128 + i * 22, s, { anchor: 'middle', size: 13, color: INK2 })).join('')
      )
      .join('') +
    box(14, 190, 632, 48, ['ชุดที่แยกออกจากเครือข่ายคือชุดเดียวที่แรนซัมแวร์เข้าไปลบไม่ได้', 'และสำเนาสำรองที่ไม่เคยทดสอบกู้คืน ยังไม่นับว่าเป็นสำเนาสำรอง'], {
      fill: CRIML, stroke: CRIM, color: CRIM, size: 13.5, lh: 19, weight: 600,
    })
);

F.urlAnatomy = svg(
  660,
  260,
  ARROWS +
    box(14, 20, 632, 62, [], { fill: PAPER, stroke: LINE }) +
    `<text x="30" y="58" font-family="IBM Plex Mono, monospace" font-size="17" fill="${INK2}">https://<tspan fill="${INK3}">vec.go.th.</tspan><tspan fill="${CRIM}" font-weight="700">login-secure.com</tspan><tspan fill="${INK3}">/verify?id=88</tspan></text>` +
    line(120, 96, 120, 78, { m: 'ar' }) +
    t(120, 118, 'ซับโดเมน', { anchor: 'middle', size: 13, color: INK3 }) +
    t(120, 136, 'ใครก็ตั้งได้', { anchor: 'middle', size: 12.5, color: INK3 }) +
    line(268, 96, 268, 78, { m: 'arc', color: CRIM }) +
    t(268, 118, 'โดเมนจริง', { anchor: 'middle', size: 13.5, color: CRIM, weight: 600 }) +
    t(268, 136, 'เจ้าของเว็บตัวจริง', { anchor: 'middle', size: 12.5, color: CRIM }) +
    line(430, 96, 430, 78, { m: 'ar' }) +
    t(430, 118, 'เส้นทางและพารามิเตอร์', { anchor: 'middle', size: 13, color: INK3 }) +
    box(14, 158, 632, 44, ['อ่านจากขวาไปซ้าย ดูสองส่วนสุดท้ายก่อนเครื่องหมายทับแรก นั่นคือเจ้าของตัวจริง'], {
      fill: GOLDL, stroke: GOLD, color: INK, size: 14.5, weight: 600,
    }) +
    box(14, 212, 632, 40, ['กุญแจ HTTPS บอกแค่ว่าการเชื่อมต่อถูกเข้ารหัส ไม่ได้บอกว่าปลายทางเป็นเว็บที่ดี'], {
      fill: '#fff', stroke: LINE, color: INK2, size: 13.5,
    })
);

/* ══════════════ CS-101 ระดับก้าวหน้า ══════════════ */

F.symmetricVsAsymmetric = svg(
  660,
  330,
  ARROWS +
    t(12, 22, 'กุญแจสมมาตร — กุญแจดอกเดียวใช้ทั้งล็อกและปลด', { size: 15, weight: 600, color: INK, display: true }) +
    box(12, 34, 118, 46, ['ผู้ส่ง'], { fill: '#fff', stroke: LINE, color: INK2, size: 13 }) +
    box(530, 34, 118, 46, ['ผู้รับ'], { fill: '#fff', stroke: LINE, color: INK2, size: 13 }) +
    line(136, 57, 260, 57, { m: 'ar' }) +
    box(266, 34, 130, 46, ['กุญแจ K'], { fill: GOLDL, stroke: GOLD, color: GOLD, size: 14, weight: 600 }) +
    line(402, 57, 524, 57, { m: 'ar' }) +
    t(12, 100, 'เร็วมาก เหมาะกับข้อมูลก้อนใหญ่ แต่ปัญหาคือจะส่งกุญแจให้กันอย่างปลอดภัยได้อย่างไร', { size: 13, color: CRIM }) +
    `<path d="M12 118 L648 118" stroke="${LINE}" stroke-width="1.5"/>` +
    t(12, 148, 'กุญแจอสมมาตร — กุญแจสาธารณะกับกุญแจส่วนตัวเป็นคู่กัน', { size: 15, weight: 600, color: INK, display: true }) +
    box(12, 162, 118, 60, ['ผู้ส่ง'], { fill: '#fff', stroke: LINE, color: INK2, size: 13 }) +
    box(180, 162, 150, 60, ['ล็อกด้วย', 'กุญแจสาธารณะ', 'ของผู้รับ'], { fill: TEALL, stroke: TEAL, color: TEAL, size: 12.5, weight: 600, lh: 16 }) +
    box(360, 162, 150, 60, ['ปลดด้วย', 'กุญแจส่วนตัว', 'ของผู้รับเท่านั้น'], { fill: GOLDL, stroke: GOLD, color: GOLD, size: 12.5, weight: 600, lh: 16 }) +
    box(536, 162, 112, 60, ['ผู้รับ'], { fill: '#fff', stroke: LINE, color: INK2, size: 13 }) +
    line(136, 192, 174, 192, { m: 'ar' }) +
    line(336, 192, 354, 192, { m: 'ar' }) +
    line(516, 192, 530, 192, { m: 'ar' }) +
    t(12, 244, 'ช้ากว่ามาก จึงไม่ใช้เข้ารหัสข้อมูลทั้งก้อน', { size: 13, color: INK2 }) +
    box(12, 258, 636, 62, [
      'ของจริงใช้ผสมกัน — ใช้กุญแจอสมมาตรเพื่อ “แลกกุญแจสมมาตร” กันก่อน',
      'จากนั้นจึงรับส่งข้อมูลจริงด้วยกุญแจสมมาตรที่เร็วกว่า นี่คือหลักการเบื้องหลัง HTTPS',
    ], { fill: PAPER, stroke: LINE, color: INK, size: 13.5, lh: 20, weight: 600 })
);

F.tlsHandshake = svg(
  660,
  340,
  ARROWS +
    box(20, 14, 170, 40, ['เบราว์เซอร์'], { fill: INK, stroke: INK, color: '#fff', size: 14, weight: 600, display: true }) +
    box(470, 14, 170, 40, ['เซิร์ฟเวอร์'], { fill: INK, stroke: INK, color: '#fff', size: 14, weight: 600, display: true }) +
    `<path d="M105 60 L105 320" stroke="${LINE}" stroke-width="2" stroke-dasharray="4 4"/>` +
    `<path d="M555 60 L555 320" stroke="${LINE}" stroke-width="2" stroke-dasharray="4 4"/>` +
    [
      [86, '1', 'ขอเชื่อมต่อ พร้อมบอกว่ารองรับอัลกอริทึมใดบ้าง', 1],
      [136, '2', 'ส่งใบรับรองดิจิทัลกลับมา พร้อมกุญแจสาธารณะ', 0],
      [186, '3', 'ตรวจว่าใบรับรองออกโดย CA ที่เชื่อถือได้ ยังไม่หมดอายุ และชื่อโดเมนตรงกัน', 1],
      [236, '4', 'ตกลงกุญแจสมมาตรสำหรับเซสชันนี้โดยเฉพาะ', 0],
      [286, '5', 'รับส่งข้อมูลจริงด้วยกุญแจสมมาตรที่ตกลงกันแล้ว', 1],
    ]
      .map(([y, n, label, dir]) => {
        const a = dir ? line(112, y, 548, y, { m: 'arg', color: GOLD }) : line(548, y, 112, y, { m: 'art', color: TEAL });
        return (
          a +
          `<circle cx="${dir ? 122 : 538}" cy="${y - 20}" r="12" fill="${dir ? GOLD : TEAL}"/>` +
          t(dir ? 122 : 538, y - 15, n, { anchor: 'middle', color: '#fff', weight: 700, size: 12, display: true }) +
          t(330, y - 12, label, { anchor: 'middle', size: 12.5, color: INK2 })
        );
      })
      .join('') +
    t(330, 330, 'ถ้าขั้นที่ 3 ไม่ผ่าน เบราว์เซอร์จะขึ้นคำเตือน — อย่ากดข้ามโดยไม่อ่าน', {
      anchor: 'middle', size: 13.5, color: CRIM, weight: 600,
    })
);

F.digitalSignature = svg(
  660,
  260,
  ARROWS +
    t(12, 22, 'ฝั่งผู้ลงนาม', { size: 14.5, weight: 600, color: INK, display: true }) +
    box(12, 34, 120, 46, ['เอกสาร'], { fill: '#fff', stroke: LINE, color: INK2, size: 13 }) +
    line(138, 57, 168, 57, { m: 'ar' }) +
    box(174, 34, 110, 46, ['แฮช'], { fill: PAPER, stroke: LINE, color: INK2, size: 13 }) +
    line(290, 57, 320, 57, { m: 'ar' }) +
    box(326, 34, 190, 46, ['ล็อกค่าแฮชด้วย', 'กุญแจส่วนตัวผู้ลงนาม'], { fill: GOLDL, stroke: GOLD, color: GOLD, size: 12.5, weight: 600, lh: 16 }) +
    line(522, 57, 552, 57, { m: 'ar' }) +
    box(558, 34, 90, 46, ['ลายเซ็น'], { fill: INK, stroke: INK, color: '#fff', size: 13, weight: 600 }) +
    `<path d="M12 100 L648 100" stroke="${LINE}" stroke-width="1.5"/>` +
    t(12, 128, 'ฝั่งผู้ตรวจสอบ', { size: 14.5, weight: 600, color: INK, display: true }) +
    box(12, 140, 190, 46, ['ปลดลายเซ็นด้วย', 'กุญแจสาธารณะผู้ลงนาม'], { fill: TEALL, stroke: TEAL, color: TEAL, size: 12.5, weight: 600, lh: 16 }) +
    line(208, 163, 238, 163, { m: 'ar' }) +
    box(244, 140, 150, 46, ['ได้ค่าแฮชเดิม'], { fill: '#fff', stroke: LINE, color: INK2, size: 13 }) +
    line(400, 163, 430, 163, { m: 'ar' }) +
    box(436, 140, 212, 46, ['เทียบกับค่าแฮชของเอกสารที่ได้รับ'], { fill: '#fff', stroke: LINE, color: INK2, size: 12.5 }) +
    box(12, 202, 636, 48, [
      'ตรงกัน = เอกสารไม่ถูกแก้ (Integrity) และมาจากเจ้าของกุญแจส่วนตัวจริง (Authenticity)',
      'สังเกตว่าลายเซ็นดิจิทัลไม่ได้ปิดบังเนื้อหา ถ้าต้องการความลับด้วย ต้องเข้ารหัสเพิ่มอีกชั้น',
    ], { fill: PAPER, stroke: LINE, color: INK, size: 13, lh: 19 })
);

F.networkZones = svg(
  660,
  300,
  ARROWS +
    `<rect x="12" y="16" width="636" height="230" rx="12" fill="${PAPER}" stroke="${LINE}" stroke-width="1.5"/>` +
    t(26, 38, 'เครือข่ายของสถานศึกษา', { size: 13, color: INK3, weight: 600 }) +
    box(30, 52, 180, 80, ['วงนักเรียน', 'Wi-Fi และห้องปฏิบัติการ', 'ความเสี่ยงสูงที่สุด'], {
      fill: '#fff', stroke: CRIM, color: CRIM, size: 12.5, weight: 600, lh: 17,
    }) +
    box(240, 52, 180, 80, ['วงบุคลากร', 'เครื่องครูและสำนักงาน'], {
      fill: '#fff', stroke: GOLD, color: GOLD, size: 12.5, weight: 600, lh: 17,
    }) +
    box(450, 52, 178, 80, ['วงเซิร์ฟเวอร์', 'ทะเบียน การเงิน', 'เข้าถึงได้เฉพาะที่จำเป็น'], {
      fill: '#fff', stroke: TEAL, color: TEAL, size: 12.5, weight: 600, lh: 17,
    }) +
    box(30, 156, 598, 44, ['ไฟร์วอลล์ภายในกำหนดว่าวงไหนคุยกับวงไหนได้บ้าง และคุยได้เฉพาะพอร์ตใด'], {
      fill: INK, stroke: INK, color: '#fff', size: 13.5, weight: 600,
    }) +
    line(120, 152, 120, 136, { m: 'ar', arrow: true }) +
    line(330, 152, 330, 136, { m: 'ar' }) +
    line(539, 136, 539, 152, { m: 'ar' }) +
    box(30, 208, 598, 30, ['ค่าตั้งต้นควรเป็น “ปฏิเสธทั้งหมด” แล้วค่อยเปิดเฉพาะเส้นทางที่จำเป็น'], {
      fill: '#fff', stroke: LINE, color: INK2, size: 13,
    }) +
    t(12, 268, 'ถ้าไม่แยกวง เครื่องนักเรียนเครื่องเดียวที่ติดมัลแวร์ จะเห็นเซิร์ฟเวอร์ทะเบียนโดยตรง', {
      size: 13.5, color: CRIM, weight: 600,
    }) +
    t(12, 292, 'การแยกวงจึงเป็นมาตรการที่ลดความเสียหายได้มากที่สุดต่อค่าใช้จ่ายที่ลงไป', { size: 13, color: INK3 })
);

F.zeroTrust = svg(
  660,
  270,
  ARROWS +
    t(12, 22, 'แบบเดิม — เชื่อทุกอย่างที่อยู่ในกำแพง', { size: 14.5, weight: 600, color: CRIM, display: true }) +
    `<rect x="12" y="32" width="300" height="84" rx="10" fill="${CRIML}" stroke="${CRIM}" stroke-width="1.5"/>` +
    t(162, 58, 'กำแพงรอบนอก (ไฟร์วอลล์)', { anchor: 'middle', size: 12.5, color: CRIM, weight: 600 }) +
    t(162, 82, 'ผ่านเข้ามาได้แล้ว = ไว้ใจได้', { anchor: 'middle', size: 12.5, color: INK2 }) +
    t(162, 104, 'ผู้โจมตีที่เข้ามาได้จึงเดินได้ทั่ว', { anchor: 'middle', size: 12.5, color: CRIM }) +
    t(348, 22, 'Zero Trust — ไม่เชื่ออะไรโดยอัตโนมัติ', { size: 14.5, weight: 600, color: TEAL, display: true }) +
    `<rect x="348" y="32" width="300" height="84" rx="10" fill="${TEALL}" stroke="${TEAL}" stroke-width="1.5"/>` +
    t(498, 58, 'ตรวจสอบทุกคำขอ ทุกครั้ง', { anchor: 'middle', size: 12.5, color: TEAL, weight: 600 }) +
    t(498, 82, 'ไม่ว่าคำขอจะมาจากในหรือนอกองค์กร', { anchor: 'middle', size: 12.5, color: INK2 }) +
    t(498, 104, 'ให้สิทธิ์เท่าที่จำเป็นและหมดอายุได้', { anchor: 'middle', size: 12.5, color: INK2 }) +
    t(12, 148, 'สามคำถามที่ระบบต้องตอบก่อนอนุญาตทุกครั้ง', { size: 14.5, weight: 600, color: INK, display: true }) +
    box(12, 160, 205, 62, ['ผู้ใช้คนนี้เป็นใคร', 'และยืนยันตัวตนแน่นหนาพอไหม'], { fill: '#fff', stroke: LINE, color: INK2, size: 12.5, lh: 17 }) +
    box(228, 160, 205, 62, ['อุปกรณ์ที่ใช้', 'อยู่ในสภาพที่ปลอดภัยไหม'], { fill: '#fff', stroke: LINE, color: INK2, size: 12.5, lh: 17 }) +
    box(444, 160, 204, 62, ['สิ่งที่ขอเข้าถึง', 'จำเป็นต่องานจริงหรือไม่'], { fill: '#fff', stroke: LINE, color: INK2, size: 12.5, lh: 17 }) +
    box(12, 232, 636, 32, ['สถานศึกษาเริ่มได้จากสองอย่าง คือ บังคับ MFA ทุกบัญชี และแยกวงเครือข่ายตามความอ่อนไหวของข้อมูล'], {
      fill: PAPER, stroke: LINE, color: INK, size: 13, weight: 600,
    })
);

F.logPipeline = svg(
  660,
  250,
  ARROWS +
    [
      ['อุปกรณ์ปลายทาง', 'เครื่องครู เซิร์ฟเวอร์'],
      ['อุปกรณ์เครือข่าย', 'ไฟร์วอลล์ เราเตอร์'],
      ['บริการคลาวด์', 'อีเมล พื้นที่จัดเก็บ'],
    ]
      .map(([a, b], i) => box(12, 20 + i * 62, 170, 52, [a, b], { fill: '#fff', stroke: LINE, color: INK2, size: 12.5, lh: 17 }))
      .join('') +
    [46, 108, 170].map((y) => line(188, y, 232, 112, { m: 'ar' })).join('') +
    box(238, 76, 150, 72, ['ศูนย์รวม log', 'ตั้งเวลาตรงกัน', 'ห้ามแก้ไขย้อนหลัง'], {
      fill: INK, stroke: INK, color: '#fff', size: 12.5, weight: 600, lh: 17,
    }) +
    line(394, 112, 434, 71, { m: 'ar' }) +
    line(394, 112, 434, 153, { m: 'ar' }) +
    box(440, 40, 208, 62, ['เฝ้าระวังและแจ้งเตือน', 'พฤติกรรมที่ผิดปกติ'], { fill: TEALL, stroke: TEAL, color: TEAL, size: 12.5, weight: 600, lh: 17 }) +
    box(440, 122, 208, 62, ['สืบสวนย้อนหลัง', 'เมื่อเกิดเหตุการณ์'], { fill: GOLDL, stroke: GOLD, color: GOLD, size: 12.5, weight: 600, lh: 17 }) +
    box(12, 200, 636, 42, ['log ที่ไม่ผูกกับตัวบุคคล และเวลาที่ไม่ตรงกันระหว่างอุปกรณ์ ทำให้สืบย้อนหลังไม่ได้จริงเมื่อถึงเวลาต้องใช้'], {
      fill: CRIML, stroke: CRIM, color: CRIM, size: 13, weight: 600,
    })
);

/* ══════════════ CS-401 ความปลอดภัยเครือข่าย ══════════════ */

F.tcpipModel = svg(
  660,
  300,
  ARROWS +
    t(12, 22, 'แบบจำลอง TCP/IP 4 ชั้น', { size: 15, weight: 600, color: INK, display: true }) +
    t(400, 22, 'ตัวอย่างสิ่งที่อยู่ในชั้นนั้น', { size: 15, weight: 600, color: INK3, display: true }) +
    [
      ['Application', 'HTTP, HTTPS, DNS, SMTP', 'ข้อมูลที่แอปเข้าใจ', INK],
      ['Transport', 'TCP, UDP + หมายเลขพอร์ต', 'แบ่งเป็นเซกเมนต์ ระบุว่าเป็นของโปรแกรมใด', GOLD],
      ['Internet', 'IP, ICMP + หมายเลขไอพี', 'เลือกเส้นทางข้ามเครือข่าย', TEAL],
      ['Network Access', 'Ethernet, Wi-Fi + MAC address', 'ส่งจริงบนสายหรือคลื่น', CRIM],
    ]
      .map(([name, ex, note, c], i) => {
        const y = 34 + i * 62;
        return (
          box(12, y, 190, 52, [name], { fill: '#fff', stroke: c, color: c, weight: 600, display: true, size: 16 }) +
          box(214, y, 434, 52, [ex, note], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 17 })
        );
      })
      .join('') +
    line(107, 292, 107, 90, { m: 'arg', color: GOLD }) +
    t(120, 288, 'ข้อมูลถูกห่อเพิ่มทีละชั้นเมื่อส่งออก และแกะออกทีละชั้นเมื่อรับเข้า', { size: 13, color: INK2 })
);

F.packetLayers = svg(
  660,
  230,
  ARROWS +
    box(12, 30, 636, 96, [], { fill: CRIML, stroke: CRIM }) +
    t(24, 50, 'Ethernet Frame — MAC ต้นทาง/ปลายทาง', { size: 12.5, color: CRIM, weight: 600 }) +
    box(30, 58, 600, 60, [], { fill: TEALL, stroke: TEAL }) +
    t(42, 76, 'IP Packet — ไอพีต้นทาง/ปลายทาง', { size: 12.5, color: TEAL, weight: 600 }) +
    box(48, 82, 564, 28, [], { fill: GOLDL, stroke: GOLD }) +
    t(60, 100, 'TCP Segment — พอร์ตต้นทาง/ปลายทาง  |  ข้อมูลจริงของแอปพลิเคชันอยู่ในสุด', {
      size: 12, color: GOLD, weight: 600,
    }) +
    t(12, 22, 'ข้อมูลหนึ่งชิ้นถูกห่อซ้อนกันหลายชั้น', { size: 15, weight: 600, color: INK, display: true }) +
    box(12, 142, 636, 74, [
      'นี่คือเหตุผลที่ Wireshark แสดงผลเป็นชั้น ๆ ให้กดขยายดูได้',
      'และเป็นเหตุผลที่ไฟร์วอลล์ธรรมดากรองได้แค่ชั้น IP กับ TCP',
      'ส่วนการดูว่าเนื้อหาข้างในคืออะไร ต้องใช้อุปกรณ์ที่อ่านถึงชั้นแอปพลิเคชัน',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 13, lh: 20 })
);

F.tcpHandshake = svg(
  660,
  280,
  ARROWS +
    box(20, 14, 170, 40, ['ไคลเอนต์'], { fill: INK, stroke: INK, color: '#fff', size: 14, weight: 600, display: true }) +
    box(470, 14, 170, 40, ['เซิร์ฟเวอร์'], { fill: INK, stroke: INK, color: '#fff', size: 14, weight: 600, display: true }) +
    `<path d="M105 60 L105 214" stroke="${LINE}" stroke-width="2" stroke-dasharray="4 4"/>` +
    `<path d="M555 60 L555 214" stroke="${LINE}" stroke-width="2" stroke-dasharray="4 4"/>` +
    line(112, 92, 548, 92, { m: 'arg', color: GOLD }) +
    t(330, 82, 'SYN — ขอเปิดการเชื่อมต่อ', { anchor: 'middle', size: 13, color: GOLD, weight: 600 }) +
    line(548, 142, 112, 142, { m: 'art', color: TEAL }) +
    t(330, 132, 'SYN-ACK — รับทราบและตอบกลับ', { anchor: 'middle', size: 13, color: TEAL, weight: 600 }) +
    line(112, 192, 548, 192, { m: 'arg', color: GOLD }) +
    t(330, 182, 'ACK — ยืนยัน เชื่อมต่อสำเร็จ', { anchor: 'middle', size: 13, color: GOLD, weight: 600 }) +
    box(12, 226, 636, 44, ['พอร์ตที่ตอบ SYN-ACK คือพอร์ตที่ “เปิด” ซึ่งเป็นหลักการที่ Nmap ใช้ตรวจว่าพอร์ตไหนเปิดอยู่'], {
      fill: GOLDL, stroke: GOLD, color: INK, size: 13.5, weight: 600,
    })
);

F.portsCommon = svg(
  660,
  260,
  ARROWS +
    t(12, 22, 'พอร์ตที่พบบ่อยและควรจำ', { size: 15, weight: 600, color: INK, display: true }) +
    [
      ['20/21', 'FTP', 'ไม่เข้ารหัส', CRIM],
      ['22', 'SSH', 'เข้ารหัส ใช้แทน Telnet', TEAL],
      ['23', 'Telnet', 'ไม่เข้ารหัส ห้ามใช้แล้ว', CRIM],
      ['25', 'SMTP', 'ส่งอีเมล', INK2],
      ['53', 'DNS', 'แปลงชื่อเป็นไอพี', INK2],
      ['80', 'HTTP', 'ไม่เข้ารหัส', CRIM],
      ['443', 'HTTPS', 'เข้ารหัส', TEAL],
      ['445', 'SMB', 'แชร์ไฟล์ ห้ามเปิดออกเน็ต', CRIM],
      ['3306', 'MySQL', 'ฐานข้อมูล', GOLD],
      ['3389', 'RDP', 'รีโมตเดสก์ท็อป เป้าโจมตียอดฮิต', CRIM],
    ]
      .map(([p_, svc, note, c], i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 12 + col * 322;
        const y = 34 + row * 40;
        return (
          box(x, y, 62, 32, [p_], { fill: c === INK2 ? PAPER : c, stroke: c === INK2 ? LINE : c, color: c === INK2 ? INK2 : '#fff', size: 13, weight: 700, display: true, r: 6 }) +
          t(x + 74, y + 14, svc, { size: 13.5, weight: 600, color: INK }) +
          t(x + 74, y + 29, note, { size: 12, color: INK3 })
        );
      })
      .join('') +
    box(12, 238, 636, 0, [], { fill: 'none', stroke: 'none' })
);

F.captureSpot = svg(
  660,
  270,
  ARROWS +
    box(12, 30, 150, 56, ['เครื่องนักเรียน'], { fill: '#fff', stroke: LINE, color: INK2, size: 13 }) +
    box(12, 110, 150, 56, ['เครื่องครู'], { fill: '#fff', stroke: LINE, color: INK2, size: 13 }) +
    box(250, 66, 150, 64, ['สวิตช์'], { fill: INK, stroke: INK, color: '#fff', size: 14, weight: 600, display: true }) +
    box(488, 66, 160, 64, ['เราเตอร์ / อินเทอร์เน็ต'], { fill: '#fff', stroke: LINE, color: INK2, size: 12.5 }) +
    line(168, 58, 244, 88, { m: 'ar' }) +
    line(168, 138, 244, 110, { m: 'ar' }) +
    line(406, 98, 482, 98, { m: 'ar' }) +
    box(250, 176, 150, 56, ['เครื่องที่ใช้ดักจับ', 'พอร์ต Mirror / SPAN'], { fill: GOLDL, stroke: GOLD, color: GOLD, size: 12, weight: 600, lh: 16 }) +
    line(325, 134, 325, 170, { m: 'arg', color: GOLD, dash: '5 4' }) +
    t(12, 250, 'สวิตช์ส่งข้อมูลเฉพาะไปยังปลายทางที่ถูกต้อง จึงต้องตั้งค่าพอร์ต Mirror ก่อน มิฉะนั้นจะเห็นแต่ทราฟฟิกของเครื่องตัวเอง', {
      size: 12.5, color: INK2,
    }) +
    t(12, 266, 'การดักจับทราฟฟิกของผู้อื่นโดยไม่ได้รับอนุญาต เข้าข่ายความผิดตามมาตรา 8 ของ พ.ร.บ.คอมพิวเตอร์', {
      size: 12.5, color: CRIM, weight: 600,
    })
);

F.nmapFlow = svg(
  660,
  240,
  ARROWS +
    [
      ['1', 'ค้นหาเครื่องที่มีชีวิต', '-sn', 'มีเครื่องอะไรอยู่ในวงบ้าง'],
      ['2', 'สแกนพอร์ต', '-sS / -sT', 'พอร์ตไหนเปิดอยู่'],
      ['3', 'ระบุบริการและเวอร์ชัน', '-sV', 'พอร์ตนั้นรันอะไร เวอร์ชันอะไร'],
      ['4', 'เดาระบบปฏิบัติการ', '-O', 'เครื่องนั้นใช้ระบบอะไร'],
    ]
      .map(([n, title, flag, why], i) => {
        const x = 12 + i * 162;
        return (
          box(x, 46, 148, 96, [flag, why], { fill: '#fff', stroke: LINE, color: INK2, size: 12, lh: 17 }) +
          `<circle cx="${x + 74}" cy="30" r="15" fill="${INK}"/>` +
          t(x + 74, 35, n, { anchor: 'middle', color: '#fff', weight: 700, size: 13, display: true }) +
          t(x + 74, 68, title, { anchor: 'middle', size: 13, weight: 600, color: INK, display: true }) +
          (i < 3 ? line(x + 150, 100, x + 160, 100, { m: 'ar' }) : '')
        );
      })
      .join('') +
    box(12, 158, 636, 70, [
      'ยิ่งลงลึกยิ่งส่งเสียงดังและถูกตรวจจับง่ายขึ้น การสแกนที่ครบทุกขั้นจะปรากฏใน log ของเป้าหมายชัดเจน',
      'สแกนได้เฉพาะระบบที่เป็นของตนเองหรือได้รับอนุญาตเป็นลายลักษณ์อักษรเท่านั้น',
      'การสแกนระบบของผู้อื่นโดยไม่ได้รับอนุญาต มีความเสี่ยงเข้าข่ายความผิดตามกฎหมาย',
    ], { fill: CRIML, stroke: CRIM, color: CRIM, size: 12.5, lh: 20, weight: 600 })
);

F.aclDecision = svg(
  660,
  280,
  ARROWS +
    box(12, 110, 110, 50, ['แพ็กเก็ตเข้า'], { fill: '#fff', stroke: LINE, color: INK2, size: 13 }) +
    line(128, 135, 158, 135, { m: 'ar' }) +
    [
      ['บรรทัดที่ 1', 'ตรงเงื่อนไขไหม'],
      ['บรรทัดที่ 2', 'ตรงเงื่อนไขไหม'],
      ['บรรทัดที่ 3', 'ตรงเงื่อนไขไหม'],
    ]
      .map(([a, b], i) => {
        const x = 164 + i * 132;
        return (
          box(x, 108, 118, 54, [a, b], { fill: PAPER, stroke: LINE, color: INK2, size: 12, lh: 16 }) +
          line(x + 59, 104, x + 59, 66, { m: 'art', color: TEAL }) +
          t(x + 59, 58, 'ตรง → ทำตามทันที', { anchor: 'middle', size: 11.5, color: TEAL, weight: 600 }) +
          t(x + 59, 42, 'แล้วหยุดตรวจ', { anchor: 'middle', size: 11.5, color: TEAL }) +
          (i < 2 ? line(x + 120, 135, x + 130, 135, { m: 'ar' }) : '')
        );
      })
      .join('') +
    line(560, 135, 590, 135, { m: 'arc', color: CRIM }) +
    box(596, 108, 52, 54, ['ทิ้ง'], { fill: CRIML, stroke: CRIM, color: CRIM, size: 13, weight: 600 }) +
    t(622, 178, 'implicit deny', { anchor: 'middle', size: 11.5, color: CRIM }) +
    box(12, 200, 636, 70, [
      'ตรวจจากบนลงล่าง เจอบรรทัดแรกที่ตรงเงื่อนไขแล้วหยุดทันที ลำดับจึงสำคัญกว่าเนื้อหาของกฎ',
      'ถ้าวางกฎอนุญาตกว้าง ๆ ไว้บรรทัดบน กฎปฏิเสธที่เจาะจงด้านล่างจะไม่มีวันถูกใช้',
      'ท้ายรายการมี deny ซ่อนอยู่เสมอ จึงต้องมีกฎ permit อย่างน้อยหนึ่งบรรทัด ไม่งั้นตัดขาดทุกอย่าง',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, lh: 20 })
);

F.idsIps = svg(
  660,
  280,
  ARROWS +
    t(12, 22, 'IDS — วางข้างทาง เห็นแต่ไม่ขวาง', { size: 15, weight: 600, color: TEAL, display: true }) +
    box(12, 34, 120, 44, ['อินเทอร์เน็ต'], { fill: '#fff', stroke: LINE, color: INK2, size: 12.5 }) +
    line(138, 56, 208, 56, { m: 'ar' }) +
    box(214, 34, 120, 44, ['สวิตช์'], { fill: INK, stroke: INK, color: '#fff', size: 12.5, weight: 600 }) +
    line(340, 56, 410, 56, { m: 'ar' }) +
    box(416, 34, 120, 44, ['เครือข่ายภายใน'], { fill: '#fff', stroke: LINE, color: INK2, size: 12.5 }) +
    box(214, 96, 120, 40, ['IDS'], { fill: TEALL, stroke: TEAL, color: TEAL, size: 13, weight: 600, display: true }) +
    line(274, 82, 274, 90, { m: 'art', color: TEAL, dash: '4 3' }) +
    t(348, 116, 'ได้สำเนาทราฟฟิก แจ้งเตือนอย่างเดียว ไม่หน่วงเครือข่าย', { size: 12, color: INK2 }) +
    `<path d="M12 152 L648 152" stroke="${LINE}" stroke-width="1.5"/>` +
    t(12, 180, 'IPS — วางคั่นกลาง ขวางได้แต่ถ้าพังเครือข่ายหยุด', { size: 15, weight: 600, color: CRIM, display: true }) +
    box(12, 192, 120, 44, ['อินเทอร์เน็ต'], { fill: '#fff', stroke: LINE, color: INK2, size: 12.5 }) +
    line(138, 214, 190, 214, { m: 'ar' }) +
    box(196, 192, 120, 44, ['IPS'], { fill: CRIML, stroke: CRIM, color: CRIM, size: 13, weight: 600, display: true }) +
    line(322, 214, 374, 214, { m: 'ar' }) +
    box(380, 192, 156, 44, ['เครือข่ายภายใน'], { fill: '#fff', stroke: LINE, color: INK2, size: 12.5 }) +
    t(12, 262, 'Snort และ Suricata เป็นได้ทั้งสองโหมด ต่างกันที่ตำแหน่งการวางและการตั้งค่า ไม่ใช่ตัวโปรแกรมคนละตัว', {
      size: 13, color: INK, weight: 600,
    })
);

F.snortRule = svg(
  660,
  250,
  ARROWS +
    box(12, 24, 636, 52, [], { fill: PAPER, stroke: LINE }) +
    `<text x="26" y="46" font-family="IBM Plex Mono, monospace" font-size="13.5" fill="${INK2}"><tspan fill="${CRIM}" font-weight="700">alert tcp</tspan> <tspan fill="${TEAL}">$EXTERNAL_NET any -&gt; $HOME_NET 3389</tspan></text>` +
    `<text x="26" y="66" font-family="IBM Plex Mono, monospace" font-size="13.5" fill="${INK2}">( <tspan fill="${GOLD}">msg:"พยายามเข้า RDP จากภายนอก"</tspan>; <tspan fill="${INK}">flow:to_server; threshold:count 5, seconds 60;</tspan> <tspan fill="${GOLD}">sid:1000001; rev:1;</tspan> )</text>` +
    [
      ['ส่วนหัวของกฎ', 'ทำอะไร (alert/drop) · โปรโตคอล · ต้นทาง → ปลายทาง · พอร์ต', CRIM],
      ['ส่วนตัวเลือก', 'ข้อความแจ้งเตือน เงื่อนไขเนื้อหา และเกณฑ์ความถี่', GOLD],
      ['sid และ rev', 'หมายเลขกฎที่ต้องไม่ซ้ำ และเลขรุ่นของกฎ ใช้เลขตั้งแต่ 1000000 สำหรับกฎที่เขียนเอง', INK],
    ]
      .map(([a, b, c], i) =>
        box(12, 96 + i * 50, 636, 42, [], { fill: '#fff', stroke: c }) +
        t(28, 112 + i * 50, a, { size: 13, weight: 600, color: c }) +
        t(28, 130 + i * 50, b, { size: 12, color: INK2 })
      )
      .join('') +
    t(12, 244, 'กฎที่แจ้งเตือนบ่อยเกินจนไม่มีใครอ่าน มีค่าน้อยกว่าไม่มีกฎเลย เพราะทำให้เหตุจริงถูกกลบ', {
      size: 13, color: CRIM, weight: 600,
    })
);

F.cvssBands = svg(
  660,
  250,
  ARROWS +
    t(12, 22, 'ระดับความรุนแรงตาม CVSS v3.1', { size: 15, weight: 600, color: INK, display: true }) +
    [
      ['0.1–3.9', 'Low', TEAL, 'ตามรอบปกติ'],
      ['4.0–6.9', 'Medium', '#8A8A2E', 'ภายในรอบถัดไป'],
      ['7.0–8.9', 'High', GOLD, 'ภายในไม่กี่วัน'],
      ['9.0–10.0', 'Critical', CRIM, 'ทันที'],
    ]
      .map(([range, name, c, act], i) => {
        const x = 12 + i * 162;
        return (
          box(x, 34, 148, 82, [range, act], { fill: '#fff', stroke: c, color: INK2, size: 12.5, lh: 17 }) +
          `<rect x="${x}" y="34" width="148" height="26" rx="9" fill="${c}"/>` +
          t(x + 74, 53, name, { anchor: 'middle', color: '#fff', weight: 700, size: 14, display: true })
        );
      })
      .join('') +
    box(12, 132, 636, 106, [
      'คะแนน CVSS เป็นเพียงจุดตั้งต้น ไม่ใช่ลำดับความสำคัญสำเร็จรูป',
      'ต้องถ่วงน้ำหนักด้วยบริบทของเราเสมอ เช่น เครื่องนั้นเปิดออกอินเทอร์เน็ตหรือไม่',
      'มีข้อมูลสำคัญอยู่บนเครื่องนั้นไหม และมีโค้ดโจมตีเผยแพร่ต่อสาธารณะแล้วหรือยัง',
      'ช่องโหว่คะแนน 7.5 บนเซิร์ฟเวอร์ทะเบียนที่เปิดสู่อินเทอร์เน็ต เร่งด่วนกว่าคะแนน 9.8 บนเครื่องที่ไม่ต่อเน็ต',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 20 })
);

F.vulnCycle = svg(
  660,
  230,
  ARROWS +
    [
      ['1', 'สำรวจสินทรัพย์', 'รู้ก่อนว่ามีเครื่องอะไร'],
      ['2', 'สแกนหาช่องโหว่', 'ตามรอบที่กำหนด'],
      ['3', 'จัดลำดับตามบริบท', 'ไม่ใช่ตามคะแนนล้วน'],
      ['4', 'แก้ไขหรือลดความเสี่ยง', 'แพตช์ ปิดบริการ จำกัดการเข้าถึง'],
      ['5', 'สแกนซ้ำเพื่อยืนยัน', 'ปิดจริงหรือแค่คิดว่าปิด'],
    ]
      .map(([n, title, note], i) => {
        const x = 12 + i * 129;
        return (
          box(x, 46, 116, 84, [note], { fill: '#fff', stroke: LINE, color: INK2, size: 11.5, lh: 16 }) +
          `<circle cx="${x + 58}" cy="30" r="15" fill="${GOLD}"/>` +
          t(x + 58, 35, n, { anchor: 'middle', color: '#fff', weight: 700, size: 13, display: true }) +
          t(x + 58, 70, title, { anchor: 'middle', size: 12.5, weight: 600, color: INK, display: true }) +
          (i < 4 ? line(x + 118, 88, x + 127, 88, { m: 'arg', color: GOLD }) : '')
        );
      })
      .join('') +
    `<path d="M70 140 L70 158 L590 158 L590 140" stroke="${GOLD}" stroke-width="1.6" fill="none" stroke-dasharray="5 4" marker-end="url(#arg)"/>` +
    t(330, 176, 'วนซ้ำเป็นรอบ ไม่ใช่ทำครั้งเดียวจบ', { anchor: 'middle', size: 13, color: GOLD, weight: 600 }) +
    box(12, 190, 636, 34, ['ขั้นที่ 5 คือขั้นที่ถูกข้ามบ่อยที่สุด และเป็นขั้นเดียวที่พิสูจน์ว่าการแก้ไขได้ผลจริง'], {
      fill: PAPER, stroke: LINE, color: INK2, size: 13,
    })
);

F.labTopology = svg(
  660,
  290,
  ARROWS +
    `<rect x="12" y="20" width="636" height="196" rx="12" fill="${CRIML}" stroke="${CRIM}" stroke-width="2" stroke-dasharray="7 5"/>` +
    t(28, 42, 'เครือข่ายแล็บที่แยกขาดจากเครือข่ายจริง (Host-only / Internal Network)', {
      size: 13, color: CRIM, weight: 600,
    }) +
    box(34, 58, 180, 66, ['เครื่องโจมตี', 'Kali Linux'], { fill: '#fff', stroke: INK, color: INK, size: 13, weight: 600, lh: 18 }) +
    box(240, 58, 180, 66, ['เครื่องเป้าหมาย', 'Metasploitable / DVWA'], { fill: '#fff', stroke: LINE, color: INK2, size: 12.5, lh: 17 }) +
    box(446, 58, 180, 66, ['เครื่องเฝ้าระวัง', 'Snort หรือ Suricata'], { fill: '#fff', stroke: TEAL, color: TEAL, size: 12.5, weight: 600, lh: 17 }) +
    line(220, 91, 234, 91, { m: 'ar' }) +
    line(426, 91, 440, 91, { m: 'ar', dash: '4 3' }) +
    box(34, 146, 592, 56, [
      'สแนปช็อตทุกเครื่องก่อนเริ่ม เพื่อย้อนกลับได้ในหนึ่งคลิกเมื่อทดลองเสร็จ',
      'ห้ามเปิดการ์ดเครือข่ายแบบ Bridged และห้ามชี้เป้าหมายไปยังไอพีนอกวงแล็บโดยเด็ดขาด',
    ], { fill: '#fff', stroke: LINE, color: INK2, size: 12.5, lh: 19 }) +
    line(330, 236, 330, 220, { m: 'arc', color: CRIM, dash: '5 4' }) +
    t(330, 256, 'เครือข่ายจริงของสถานศึกษาอยู่นอกกรอบนี้ และต้องไม่มีเส้นทางเชื่อมถึงกัน', {
      anchor: 'middle', size: 13, color: CRIM, weight: 600,
    }) +
    t(330, 278, 'ผิดพลาดเพียงครั้งเดียวที่ตั้งค่าเป็น Bridged อาจกลายเป็นการโจมตีระบบจริงโดยไม่ตั้งใจ', {
      anchor: 'middle', size: 12.5, color: INK3,
    })
);

/* ══════════════ CS-201 กฎหมาย ══════════════ */

F.lawMap = svg(
  660,
  300,
  ARROWS +
    [
      ['พ.ร.บ.คอมพิวเตอร์', 'พ.ศ. 2550 / 2560', 'ระบบและข้อมูลคอมพิวเตอร์', 'ใครทำผิด และรับโทษอย่างไร', CRIM],
      ['พ.ร.บ.ไซเบอร์', 'พ.ศ. 2562', 'ความมั่นคงของประเทศ', 'เตรียมพร้อมและรับมืออย่างไร', TEAL],
      ['PDPA', 'พ.ศ. 2562', 'สิทธิของเจ้าของข้อมูล', 'ใช้ข้อมูลของคนอื่นได้แค่ไหน', GOLD],
    ]
      .map(([name, year, protect, ask, c], i) => {
        const x = 12 + i * 216;
        return (
          box(x, 24, 204, 168, [], { fill: '#fff', stroke: c, sw: 2 }) +
          `<rect x="${x}" y="24" width="204" height="40" rx="9" fill="${c}"/>` +
          t(x + 102, 43, name, { anchor: 'middle', color: '#fff', weight: 700, size: 15, display: true }) +
          t(x + 102, 58, year, { anchor: 'middle', color: '#fff', size: 11.5 }) +
          t(x + 102, 88, 'คุ้มครองอะไร', { anchor: 'middle', size: 11.5, color: INK3 }) +
          t(x + 102, 108, protect, { anchor: 'middle', size: 13, color: INK, weight: 600 }) +
          t(x + 102, 138, 'ตอบคำถามว่า', { anchor: 'middle', size: 11.5, color: INK3 }) +
          t(x + 102, 158, ask, { anchor: 'middle', size: 12.5, color: INK2 })
        );
      })
      .join('') +
    box(12, 206, 636, 80, [
      'เหตุการณ์เดียวอาจเข้าข่ายได้หลายฉบับพร้อมกัน',
      'เช่น มีผู้เจาะระบบทะเบียนแล้วนำข้อมูลนักเรียนไปเผยแพร่',
      'ผู้กระทำผิดตาม พ.ร.บ.คอมพิวเตอร์ · สถานศึกษามีหน้าที่แจ้งเหตุตาม PDPA',
      'และหากเป็นบริการสำคัญของประเทศ ก็เข้าสู่กลไกของ พ.ร.บ.ไซเบอร์ด้วย',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 19 })
);

F.lawPenalty = svg(
  660,
  310,
  ARROWS +
    t(12, 22, 'ลำดับความรุนแรงของโทษตาม พ.ร.บ.คอมพิวเตอร์ (โดยสังเขป)', {
      size: 15, weight: 600, color: INK, display: true,
    }) +
    [
      ['ม.5', 'เข้าถึงระบบโดยมิชอบ', 'จำคุกไม่เกิน 6 เดือน', 0.18],
      ['ม.7', 'เข้าถึงข้อมูลโดยมิชอบ', 'จำคุกไม่เกิน 2 ปี', 0.36],
      ['ม.8', 'ดักรับข้อมูลระหว่างส่ง', 'จำคุกไม่เกิน 3 ปี', 0.5],
      ['ม.16', 'ตัดต่อภาพให้ผู้อื่นเสียชื่อเสียง', 'จำคุกไม่เกิน 3 ปี และปรับ', 0.55],
      ['ม.9', 'แก้ไขหรือทำลายข้อมูล', 'จำคุกไม่เกิน 5 ปี', 0.82],
      ['ม.10', 'ทำให้ระบบใช้งานไม่ได้', 'จำคุกไม่เกิน 5 ปี', 0.82],
      ['ม.14', 'นำเข้าข้อมูลอันเป็นเท็จ', 'จำคุกไม่เกิน 5 ปี', 0.82],
    ]
      .map(([sec, act, pen, w], i) => {
        const y = 36 + i * 36;
        const bw = Math.round(300 * w);
        const c = w < 0.4 ? GOLD : w < 0.7 ? '#C0392B' : CRIM;
        return (
          t(12, y + 20, sec, { size: 13.5, weight: 700, color: INK, display: true }) +
          t(56, y + 20, act, { size: 13, color: INK2 }) +
          `<rect x="300" y="${y + 6}" width="${bw}" height="20" rx="5" fill="${c}"/>` +
          t(306 + bw + 6, y + 20, pen, { size: 12, color: INK2 })
        );
      })
      .join('') +
    box(12, 292, 636, 0, [], { fill: 'none', stroke: 'none' }) +
    t(12, 300, 'ตัวเลขเป็นกรอบคร่าว ๆ เพื่อให้เห็นลำดับความรุนแรง ควรตรวจตัวบทฉบับเต็มก่อนอ้างอิงในเอกสารทางการ', {
      size: 12, color: INK3,
    })
);

F.ncsaStructure = svg(
  660,
  300,
  ARROWS +
    box(180, 20, 300, 52, ['กมช.', 'คณะกรรมการการรักษาความมั่นคงปลอดภัยไซเบอร์แห่งชาติ'], {
      fill: INK, stroke: INK, color: '#fff', size: 12, weight: 600, lh: 17,
    }) +
    t(490, 44, 'ระดับนโยบาย', { size: 12, color: INK3 }) +
    line(330, 78, 330, 96, { m: 'ar' }) +
    box(180, 100, 300, 48, ['กบส. — คณะกรรมการกำกับดูแล', 'สั่งการเมื่อเกิดเหตุ'], {
      fill: '#fff', stroke: GOLD, color: GOLD, size: 12, weight: 600, lh: 16,
    }) +
    line(330, 154, 330, 172, { m: 'ar' }) +
    box(180, 176, 300, 54, ['สกมช. (NCSA)', 'สำนักงานปฏิบัติ เฝ้าระวัง แจ้งเตือน สนับสนุนเทคนิค'], {
      fill: TEALL, stroke: TEAL, color: TEAL, size: 12, weight: 600, lh: 17,
    }) +
    box(12, 176, 152, 54, ['หน่วยงาน CII', 'มีหน้าที่เพิ่มตามกฎหมาย'], { fill: '#fff', stroke: LINE, color: INK2, size: 11.5, lh: 16 }) +
    box(496, 176, 152, 54, ['หน่วยงานทั่วไป', 'ใช้แนวปฏิบัติเป็นแนวทาง'], { fill: '#fff', stroke: LINE, color: INK2, size: 11.5, lh: 16 }) +
    line(176, 203, 168, 203, { m: 'ar' }) +
    line(484, 203, 492, 203, { m: 'ar' }) +
    box(12, 244, 636, 46, ['สถานศึกษาทั่วไปที่ไม่ได้ถูกกำหนดเป็น CII ได้รับผลจากกฎหมายนี้ผ่านแนวปฏิบัติและประกาศแจ้งเตือนของ สกมช. เป็นหลัก'], {
      fill: PAPER, stroke: LINE, color: INK2, size: 13,
    })
);

F.pdpaRoles = svg(
  660,
  280,
  ARROWS +
    box(12, 60, 168, 76, ['เจ้าของข้อมูล', 'นักเรียน ผู้ปกครอง บุคลากร'], {
      fill: '#fff', stroke: TEAL, color: TEAL, size: 13, weight: 600, lh: 18,
    }) +
    line(186, 82, 244, 82, { m: 'ar' }) +
    t(215, 74, 'ให้ข้อมูล', { anchor: 'middle', size: 11.5, color: INK3 }) +
    box(250, 60, 176, 76, ['ผู้ควบคุมข้อมูล', 'สถานศึกษา', 'เป็นผู้ตัดสินใจ'], {
      fill: INK, stroke: INK, color: '#fff', size: 13, weight: 600, lh: 18,
    }) +
    line(432, 98, 490, 98, { m: 'ar' }) +
    t(461, 90, 'สั่งการ', { anchor: 'middle', size: 11.5, color: INK3 }) +
    box(496, 60, 152, 76, ['ผู้ประมวลผล', 'ผู้รับจ้างดูแลระบบ', 'ทำตามคำสั่งเท่านั้น'], {
      fill: '#fff', stroke: LINE, color: INK2, size: 12, lh: 17,
    }) +
    `<path d="M338 142 L338 168 L96 168 L96 142" stroke="${TEAL}" stroke-width="1.6" fill="none" marker-end="url(#art)"/>` +
    t(217, 186, 'ต้องรองรับสิทธิ 8 ประการของเจ้าของข้อมูล', { anchor: 'middle', size: 12.5, color: TEAL, weight: 600 }) +
    box(12, 200, 636, 68, [
      'เส้นแบ่งอยู่ที่ “ใครเป็นผู้ตัดสินใจ” ไม่ใช่ใครเป็นคนลงมือ',
      'สถานศึกษาตัดสินใจว่าจะเก็บอะไร ใช้ทำอะไร และเก็บนานเท่าไร จึงเป็นผู้ควบคุมข้อมูล',
      'บริษัทที่รับจ้างดูแลระบบทะเบียนทำตามที่สถานศึกษาสั่ง จึงเป็นผู้ประมวลผล',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 19 }) +
    t(330, 30, 'สามบทบาทตาม PDPA', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true })
);

F.pdpaBases = svg(
  660,
  300,
  ARROWS +
    t(12, 22, 'เจ็ดฐานทางกฎหมายที่ใช้เก็บและใช้ข้อมูลได้', { size: 15, weight: 600, color: INK, display: true }) +
    [
      ['หน้าที่ตามกฎหมาย', 'ทะเบียนนักเรียนตามระเบียบราชการ', TEAL],
      ['ภารกิจของรัฐ', 'การจัดการศึกษาตามอำนาจหน้าที่', TEAL],
      ['สัญญา', 'ข้อมูลบุคลากรเพื่อการจ้างงาน', TEAL],
      ['ประโยชน์โดยชอบด้วยกฎหมาย', 'กล้องวงจรปิดเพื่อความปลอดภัย', GOLD],
      ['ประโยชน์สำคัญต่อชีวิต', 'เปิดข้อมูลสุขภาพเมื่อฉุกเฉิน', GOLD],
      ['จดหมายเหตุ วิจัย สถิติ', 'งานวิจัยที่มีมาตรการคุ้มครอง', GOLD],
      ['ความยินยอม', 'นำภาพนักเรียนไปประชาสัมพันธ์', CRIM],
    ]
      .map(([name, ex, c], i) => {
        const y = 34 + i * 33;
        return (
          `<rect x="12" y="${y}" width="6" height="26" rx="3" fill="${c}"/>` +
          t(28, y + 18, name, { size: 13.5, weight: 600, color: INK }) +
          t(300, y + 18, ex, { size: 12.5, color: INK2 })
        );
      })
      .join('') +
    box(12, 272, 636, 24, ['ความยินยอมเป็นฐานสุดท้ายที่ควรเลือก เพราะถอนได้ทุกเมื่อ ทำให้ภารกิจสะดุด'], {
      fill: CRIML, stroke: CRIM, color: CRIM, size: 12.5, weight: 600,
    })
);

F.breach72 = svg(
  660,
  240,
  ARROWS +
    `<path d="M40 96 L620 96" stroke="${LINE}" stroke-width="3"/>` +
    [
      [40, 'ชั่วโมงที่ 0', 'ทราบเหตุละเมิด', CRIM],
      [230, 'ทันที', 'จำกัดความเสียหาย\nและประเมินขอบเขต', GOLD],
      [420, 'ภายใน 72 ชม.', 'แจ้งสำนักงาน\nคณะกรรมการฯ', CRIM],
      [610, 'หากเสี่ยงสูง', 'แจ้งเจ้าของข้อมูล\nพร้อมแนวทางเยียวยา', CRIM],
    ]
      .map(([x, when, what, c]) => {
        const lines = what.split('\n');
        return (
          `<circle cx="${x}" cy="96" r="11" fill="${c}"/>` +
          t(x, 72, when, { anchor: 'middle', size: 13, weight: 700, color: c, display: true }) +
          lines
            .map((l, i) => t(x, 128 + i * 18, l, { anchor: 'middle', size: 12, color: INK2 }))
            .join('')
        );
      })
      .join('') +
    box(12, 176, 636, 56, [
      'กรอบเวลานี้นับจากเวลาที่ “ทราบเหตุ” ไม่ใช่เวลาที่เหตุเกิด',
      'สถานศึกษาจึงต้องรู้ล่วงหน้าว่าใครรับแจ้ง ใครตัดสินใจ และใช้เอกสารอะไร ไม่ใช่มาเริ่มคิดตอนเกิดเหตุ',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, lh: 19 }) +
    t(330, 26, 'เส้นเวลาการแจ้งเหตุละเมิดข้อมูลส่วนบุคคล', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true })
);

/* ══════════════ CS-301 มาตรฐาน ══════════════ */

F.pdcaCycle = svg(
  660,
  290,
  ARROWS +
    [
      ['Plan', 'กำหนดขอบเขต ประเมินความเสี่ยง เลือกมาตรการ', 0],
      ['Do', 'นำมาตรการไปปฏิบัติจริง และอบรมผู้เกี่ยวข้อง', 1],
      ['Check', 'ตรวจติดตามภายใน วัดผล ทบทวนโดยฝ่ายบริหาร', 2],
      ['Act', 'แก้ไขสิ่งที่ไม่เป็นไปตามข้อกำหนด ปรับปรุงต่อเนื่อง', 3],
    ]
      .map(([name, desc, i]) => {
        const col = i % 2;
        const row = i > 1 ? 1 : 0;
        const x = 12 + col * 330;
        const y = 30 + row * 110;
        const c = [INK, GOLD, TEAL, CRIM][i];
        return (
          box(x, y, 306, 92, [], { fill: '#fff', stroke: c, sw: 2 }) +
          `<circle cx="${x + 34}" cy="${y + 34}" r="18" fill="${c}"/>` +
          t(x + 34, y + 40, String(i + 1), { anchor: 'middle', color: '#fff', weight: 700, size: 16, display: true }) +
          t(x + 62, y + 40, name, { size: 18, weight: 700, color: c, display: true }) +
          t(x + 20, y + 72, desc, { size: 12.5, color: INK2 })
        );
      })
      .join('') +
    line(318, 76, 340, 76, { m: 'ar' }) +
    line(318, 186, 296, 186, { m: 'ar' }) +
    line(600, 122, 600, 140, { m: 'ar' }) +
    `<path d="M60 122 L60 140" stroke="${INK3}" stroke-width="1.6" fill="none" marker-end="url(#ar)" transform="translate(0,0) scale(1,-1) translate(0,-262)"/>` +
    box(12, 250, 636, 32, ['ISO/IEC 27001 เป็นระบบที่หมุนเป็นวงจร ไม่ใช่โครงการที่ทำครั้งเดียวจบ'], {
      fill: PAPER, stroke: LINE, color: INK, size: 13, weight: 600,
    })
);

F.isoAnnexA = svg(
  660,
  270,
  ARROWS +
    t(12, 22, 'มาตรการควบคุม 93 ข้อ ใน 4 หมวด (ฉบับปี 2022)', { size: 15, weight: 600, color: INK, display: true }) +
    [
      ['Organizational', 'ด้านองค์กร', 37, INK],
      ['People', 'ด้านบุคลากร', 8, TEAL],
      ['Physical', 'ด้านกายภาพ', 14, GOLD],
      ['Technological', 'ด้านเทคโนโลยี', 34, CRIM],
    ]
      .map(([en, th, n, c], i) => {
        const y = 36 + i * 52;
        const bw = Math.round((n / 37) * 380);
        return (
          t(12, y + 26, th, { size: 14, weight: 600, color: c, display: true }) +
          t(12, y + 42, en, { size: 11, color: INK3 }) +
          `<rect x="150" y="${y + 12}" width="${bw}" height="26" rx="6" fill="${c}"/>` +
          t(150 + bw + 10, y + 30, n + ' ข้อ', { size: 13, weight: 600, color: INK2 })
        );
      })
      .join('') +
    box(12, 246, 636, 22, [], { fill: 'none', stroke: 'none' }) +
    t(12, 258, 'ด้านองค์กรกับด้านบุคลากรรวมกัน 45 ข้อ มากกว่าด้านเทคโนโลยี ตอกย้ำว่าไม่ใช่งานของฝ่ายไอทีลำพัง', {
      size: 12.5, color: GOLD, weight: 600,
    })
);

F.nistCsf = svg(
  660,
  340,
  ARROWS +
    `<circle cx="330" cy="170" r="150" fill="none" stroke="${LINE}" stroke-width="1.5" stroke-dasharray="5 5"/>` +
    [
      ['Identify', 'ระบุ', -90, TEAL],
      ['Protect', 'ป้องกัน', -18, TEAL],
      ['Detect', 'ตรวจจับ', 54, GOLD],
      ['Respond', 'ตอบสนอง', 126, CRIM],
      ['Recover', 'ฟื้นฟู', 198, CRIM],
    ]
      .map(([en, th, deg, c]) => {
        const r = (deg * Math.PI) / 180;
        const cx = 330 + 150 * Math.cos(r);
        const cy = 170 + 150 * Math.sin(r);
        return (
          box(cx - 66, cy - 26, 132, 52, [en, th], {
            fill: '#fff', stroke: c, color: c, size: 14, weight: 600, display: true, lh: 18,
          })
        );
      })
      .join('') +
    `<circle cx="330" cy="170" r="62" fill="${INK}"/>` +
    t(330, 164, 'Govern', { anchor: 'middle', color: GOLD, weight: 700, size: 18, display: true }) +
    t(330, 186, 'กำกับดูแล', { anchor: 'middle', color: '#fff', size: 13 }) +
    t(330, 24, 'NIST CSF 2.0 — หกฟังก์ชัน', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    t(330, 332, 'Govern เป็นแกนกลางที่ครอบคลุมอีกห้าฟังก์ชัน สะท้อนว่าเป็นความรับผิดชอบระดับการบริหาร', {
      anchor: 'middle', size: 12.5, color: INK2,
    })
);

F.cisPyramid = svg(
  660,
  270,
  ARROWS +
    `<path d="M330 24 L470 100 L190 100 Z" fill="${CRIM}" stroke="${CRIM}"/>` +
    `<path d="M190 104 L470 104 L540 176 L120 176 Z" fill="${GOLD}" stroke="${GOLD}"/>` +
    `<path d="M120 180 L540 180 L610 250 L50 250 Z" fill="${TEAL}" stroke="${TEAL}"/>` +
    t(330, 82, 'IG3', { anchor: 'middle', color: '#fff', weight: 700, size: 17, display: true }) +
    t(330, 146, 'IG2', { anchor: 'middle', color: '#fff', weight: 700, size: 19, display: true }) +
    t(330, 222, 'IG1', { anchor: 'middle', color: '#fff', weight: 700, size: 21, display: true }) +
    t(486, 76, 'รับมือผู้โจมตีที่มีความสามารถสูง', { size: 12, color: CRIM, weight: 600 }) +
    t(556, 146, 'มีทีมเฉพาะ', { size: 12, color: GOLD, weight: 600 }) +
    t(556, 162, 'ข้อมูลอ่อนไหวมากขึ้น', { size: 12, color: GOLD }) +
    t(50, 224, 'สุขอนามัยพื้นฐาน', { size: 12.5, color: TEAL, weight: 600, anchor: 'start' }) +
    t(50, 240, 'สถานศึกษาตั้งเป้าที่นี่ก่อน', { size: 12, color: TEAL }) +
    t(330, 264, 'ทำ IG1 ให้ครบก่อน แล้วจึงขยับขึ้น ไม่ใช่กระโดดข้าม', {
      anchor: 'middle', size: 13, color: INK, weight: 600,
    })
);

F.riskMatrix = svg(
  660,
  330,
  ARROWS +
    t(330, 20, 'ตารางความเสี่ยง 5 × 5', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    (() => {
      let out = '';
      const cell = 46;
      const x0 = 120;
      const y0 = 34;
      for (let L = 5; L >= 1; L--) {
        for (let I = 1; I <= 5; I++) {
          const s = L * I;
          const c = s >= 20 ? '#8E1F17' : s >= 12 ? '#C0392B' : s >= 6 ? GOLD : TEAL;
          const x = x0 + (I - 1) * cell;
          const y = y0 + (5 - L) * cell;
          out +=
            `<rect x="${x}" y="${y}" width="${cell - 2}" height="${cell - 2}" rx="4" fill="${c}"/>` +
            t(x + cell / 2 - 1, y + cell / 2 + 4, String(s), {
              anchor: 'middle', color: '#fff', weight: 700, size: 14, display: true,
            });
        }
        out += t(112, y0 + (5 - L) * cell + cell / 2 + 4, String(L), {
          anchor: 'end', size: 13, weight: 600, color: INK2,
        });
      }
      for (let I = 1; I <= 5; I++) {
        out += t(x0 + (I - 1) * cell + cell / 2 - 1, y0 + 5 * cell + 18, String(I), {
          anchor: 'middle', size: 13, weight: 600, color: INK2,
        });
      }
      return out;
    })() +
    t(72, 152, 'โอกาส', { anchor: 'middle', size: 13, weight: 600, color: INK, display: true }) +
    t(72, 170, 'เกิด', { anchor: 'middle', size: 13, weight: 600, color: INK, display: true }) +
    t(235, 292, 'ผลกระทบ', { anchor: 'middle', size: 13, weight: 600, color: INK, display: true }) +
    [
      ['1–5 ต่ำ', TEAL],
      ['6–11 กลาง', GOLD],
      ['12–19 สูง', '#C0392B'],
      ['20–25 สูงมาก', '#8E1F17'],
    ]
      .map(([label, c], i) =>
        `<rect x="400" y="${50 + i * 40}" width="26" height="22" rx="5" fill="${c}"/>` +
        t(436, 66 + i * 40, label, { size: 13, color: INK2 })
      )
      .join('') +
    box(400, 214, 248, 76, ['สี่ทางเลือกในการจัดการ', 'ลด · โอนย้าย · หลีกเลี่ยง · ยอมรับ', '“ยอมรับ” ต้องบันทึกและได้รับอนุมัติ'], {
      fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 19,
    })
);

F.incidentLifecycle = svg(
  660,
  260,
  ARROWS +
    [
      ['1', 'เตรียมความพร้อม', 'แผน ทีม ช่องทางแจ้งเหตุ ซ้อมแผน', TEAL],
      ['2', 'ตรวจจับและวิเคราะห์', 'ยืนยันเหตุ จัดระดับ เก็บหลักฐาน', GOLD],
      ['3', 'จำกัด กำจัด กู้คืน', 'ตัดการแพร่ ล้างสิ่งตกค้าง คืนบริการ', CRIM],
      ['4', 'ถอดบทเรียน', 'หาสาเหตุราก ปรับปรุงมาตรการ', INK],
    ]
      .map(([n, title, desc, c], i) => {
        const x = 12 + i * 162;
        return (
          box(x, 46, 148, 92, [desc], { fill: '#fff', stroke: c, color: INK2, size: 11.5, lh: 16 }) +
          `<circle cx="${x + 74}" cy="30" r="15" fill="${c}"/>` +
          t(x + 74, 35, n, { anchor: 'middle', color: '#fff', weight: 700, size: 13, display: true }) +
          t(x + 74, 70, title, { anchor: 'middle', size: 12.5, weight: 600, color: c, display: true }) +
          (i < 3 ? line(x + 150, 92, x + 160, 92, { m: 'ar' }) : '')
        );
      })
      .join('') +
    `<path d="M86 148 L86 172 L574 172 L574 148" stroke="${TEAL}" stroke-width="1.6" fill="none" stroke-dasharray="5 4" marker-start="url(#art)"/>` +
    t(330, 192, 'บทเรียนป้อนกลับไปปรับปรุงการเตรียมพร้อมรอบถัดไป', {
      anchor: 'middle', size: 13, color: TEAL, weight: 600,
    }) +
    box(12, 206, 636, 44, ['ข้อผิดพลาดที่พบบ่อยคือรีบล้างเครื่องทันที ทำให้หลักฐานหายและไม่รู้ว่าความเสียหายลามไปถึงไหน'], {
      fill: CRIML, stroke: CRIM, color: CRIM, size: 13, weight: 600,
    })
);

F.rtoRpo = svg(
  660,
  260,
  ARROWS +
    `<path d="M40 130 L620 130" stroke="${LINE}" stroke-width="3"/>` +
    `<circle cx="200" cy="130" r="10" fill="${TEAL}"/>` +
    t(200, 112, 'สำรองข้อมูลครั้งล่าสุด', { anchor: 'middle', size: 12, color: TEAL, weight: 600 }) +
    `<circle cx="330" cy="130" r="12" fill="${CRIM}"/>` +
    t(330, 106, 'เกิดเหตุ', { anchor: 'middle', size: 13, color: CRIM, weight: 700, display: true }) +
    `<circle cx="520" cy="130" r="10" fill="${GOLD}"/>` +
    t(520, 112, 'ระบบกลับมาให้บริการ', { anchor: 'middle', size: 12, color: GOLD, weight: 600 }) +
    `<path d="M200 168 L330 168" stroke="${TEAL}" stroke-width="2" marker-start="url(#art)" marker-end="url(#art)"/>` +
    t(265, 190, 'RPO', { anchor: 'middle', size: 15, weight: 700, color: TEAL, display: true }) +
    t(265, 208, 'ข้อมูลที่ยอมให้หายได้', { anchor: 'middle', size: 12, color: INK2 }) +
    `<path d="M330 168 L520 168" stroke="${GOLD}" stroke-width="2" marker-start="url(#arg)" marker-end="url(#arg)"/>` +
    t(425, 190, 'RTO', { anchor: 'middle', size: 15, weight: 700, color: GOLD, display: true }) +
    t(425, 208, 'เวลาที่ยอมให้ระบบหยุดได้', { anchor: 'middle', size: 12, color: INK2 }) +
    t(330, 30, 'RPO กับ RTO ต่างกันอย่างไร', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    box(12, 224, 636, 30, ['RPO 4 ชั่วโมง แปลว่าต้องสำรองข้อมูลอย่างน้อยทุก 4 ชั่วโมง ส่วน RTO 8 ชั่วโมง แปลว่าต้องกู้ระบบเสร็จภายใน 8 ชั่วโมง'], {
      fill: PAPER, stroke: LINE, color: INK2, size: 12.5,
    })
);

/* ══════════════ CS-501 เครือข่ายคอมพิวเตอร์ ══════════════ */

F.dataCommSystem = svg(
  660,
  240,
  ARROWS +
    box(12, 60, 116, 62, ['ผู้ส่ง', 'Sender'], { fill: '#fff', stroke: INK, color: INK, size: 13, weight: 600, lh: 17 }) +
    line(134, 91, 168, 91, { m: 'ar' }) +
    box(174, 60, 116, 62, ['ข้อมูล', 'Message'], { fill: GOLDL, stroke: GOLD, color: GOLD, size: 13, weight: 600, lh: 17 }) +
    line(296, 91, 330, 91, { m: 'ar' }) +
    box(336, 60, 130, 62, ['สื่อกลาง', 'Medium'], { fill: TEALL, stroke: TEAL, color: TEAL, size: 13, weight: 600, lh: 17 }) +
    line(472, 91, 506, 91, { m: 'ar' }) +
    box(512, 60, 136, 62, ['ผู้รับ', 'Receiver'], { fill: '#fff', stroke: INK, color: INK, size: 13, weight: 600, lh: 17 }) +
    box(174, 140, 292, 42, ['โปรโตคอล — ข้อตกลงร่วมที่ทั้งสองฝ่ายต้องใช้ชุดเดียวกัน'], {
      fill: INK, stroke: INK, color: '#fff', size: 12.5, weight: 600,
    }) +
    line(320, 138, 320, 128, { m: 'ar' }) +
    t(330, 30, 'ห้าองค์ประกอบของระบบสื่อสารข้อมูล', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    t(330, 208, 'ขาดองค์ประกอบใดไปแม้เพียงอย่างเดียว การสื่อสารก็เกิดขึ้นไม่ได้', {
      anchor: 'middle', size: 13, color: INK2,
    }) +
    t(330, 230, 'โปรโตคอลคือองค์ประกอบที่มองไม่เห็น แต่เป็นตัวที่ทำให้อีกสี่อย่างทำงานร่วมกันได้', {
      anchor: 'middle', size: 12.5, color: GOLD, weight: 600,
    })
);

F.osiLayers = svg(
  660,
  400,
  ARROWS +
    t(12, 22, 'OSI 7 ชั้น', { size: 15, weight: 600, color: INK, display: true }) +
    t(470, 22, 'เทียบกับ TCP/IP', { size: 15, weight: 600, color: INK3, display: true }) +
    [
      ['7', 'Application', 'บริการที่ผู้ใช้เห็น', 'Application'],
      ['6', 'Presentation', 'แปลงรูปแบบ เข้ารหัส บีบอัด', 'Application'],
      ['5', 'Session', 'เปิดปิดและควบคุมวาระการคุย', 'Application'],
      ['4', 'Transport', 'ส่งถึงโปรเซส แบ่งเซกเมนต์ ใช้พอร์ต', 'Transport'],
      ['3', 'Network', 'เลือกเส้นทางข้ามเครือข่าย ใช้ไอพี', 'Internet'],
      ['2', 'Data Link', 'ส่งเฟรมในวงเดียวกัน ใช้ MAC', 'Network Access'],
      ['1', 'Physical', 'บิตจริงบนสายหรือคลื่น', 'Network Access'],
    ]
      .map(([n, name, desc, tcp], i) => {
        const y = 34 + i * 50;
        const c = [INK, INK, INK, GOLD, TEAL, CRIM, CRIM][i];
        return (
          box(12, y, 44, 42, [n], { fill: c, stroke: c, color: '#fff', size: 16, weight: 700, display: true, r: 7 }) +
          box(62, y, 190, 42, [name], { fill: '#fff', stroke: c, color: c, size: 14, weight: 600, display: true }) +
          t(262, y + 26, desc, { size: 12.5, color: INK2 }) +
          box(500, y, 148, 42, [tcp], { fill: PAPER, stroke: LINE, color: INK3, size: 12, r: 7 })
        );
      })
      .join('') +
    t(12, 392, 'จำลำดับด้วยประโยค All People Seem To Need Data Processing โดยไล่จากชั้น 7 ลงมาชั้น 1', {
      size: 12.5, color: GOLD, weight: 600,
    })
);

F.topologies = svg(
  660,
  330,
  ARROWS +
    (() => {
      const node = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 9}" fill="${INK}"/>`;
      const wire = (x1, y1, x2, y2, c) =>
        `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${c || INK3}" stroke-width="2" fill="none"/>`;
      let o = '';
      // บัส
      o += t(80, 30, 'แบบบัส (Bus)', { anchor: 'middle', size: 14, weight: 600, color: INK, display: true });
      o += wire(14, 90, 146, 90, GOLD);
      [30, 60, 90, 120].forEach((x) => { o += wire(x, 90, x, 62); o += node(x, 56); });
      o += t(80, 118, 'สายเส้นเดียวขาดแล้วล่มทั้งวง', { anchor: 'middle', size: 11.5, color: CRIM });
      // ดาว
      o += t(240, 30, 'แบบดาว (Star)', { anchor: 'middle', size: 14, weight: 600, color: INK, display: true });
      o += `<rect x="222" y="72" width="36" height="24" rx="5" fill="${GOLD}"/>`;
      [[240, 46], [196, 92], [284, 92], [240, 118]].forEach(([x, y]) => { o += wire(240, 84, x, y); o += node(x, y); });
      o += t(240, 140, 'นิยมที่สุดในปัจจุบัน', { anchor: 'middle', size: 11.5, color: TEAL });
      // ริง
      o += t(410, 30, 'แบบวงแหวน (Ring)', { anchor: 'middle', size: 14, weight: 600, color: INK, display: true });
      o += `<circle cx="410" cy="88" r="40" fill="none" stroke="${GOLD}" stroke-width="2"/>`;
      [[410, 48], [450, 88], [410, 128], [370, 88]].forEach(([x, y]) => { o += node(x, y); });
      o += t(410, 150, 'ข้อมูลวนไปทางเดียว', { anchor: 'middle', size: 11.5, color: INK3 });
      // เมช
      o += t(575, 30, 'แบบเมช (Mesh)', { anchor: 'middle', size: 14, weight: 600, color: INK, display: true });
      const pts = [[575, 50], [620, 90], [600, 130], [550, 130], [530, 90]];
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) o += wire(pts[i][0], pts[i][1], pts[j][0], pts[j][1], '#C8D4DE');
      pts.forEach(([x, y]) => { o += node(x, y, 7); });
      o += t(575, 152, 'ทนทานสูงแต่แพงมาก', { anchor: 'middle', size: 11.5, color: INK3 });
      return o;
    })() +
    box(12, 176, 636, 62, [
      'จำนวนสายที่ต้องใช้ในแบบเมชเต็มรูปคือ n(n−1)/2 เส้น',
      'เครือข่าย 10 เครื่องจึงต้องใช้ 45 เส้น และ 20 เครื่องต้องใช้ถึง 190 เส้น',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 13, lh: 20 }) +
    box(12, 248, 636, 70, [
      'ในทางปฏิบัติสถานศึกษาเกือบทั้งหมดใช้แบบดาวที่มีสวิตช์เป็นศูนย์กลาง',
      'เพราะเครื่องหนึ่งเสียไม่กระทบเครื่องอื่น หาจุดเสียง่าย และขยายเพิ่มได้ทีละเครื่อง',
      'ข้อเสียเดียวคือถ้าสวิตช์ศูนย์กลางเสีย วงนั้นจะล่มทั้งวง',
    ], { fill: TEALL, stroke: TEAL, color: '#0E5F58', size: 12.5, lh: 20 })
);

F.lanDevices = svg(
  660,
  310,
  ARROWS +
    t(12, 22, 'อุปกรณ์เชื่อมต่อเครือข่าย แยกตามชั้นที่ทำงาน', { size: 15, weight: 600, color: INK, display: true }) +
    [
      ['ฮับ (Hub)', 'ชั้น 1 Physical', 'ทวนสัญญาณออกทุกพอร์ต', 'เลิกใช้แล้ว เพราะดักข้อมูลง่ายและชนกันบ่อย', CRIM],
      ['สวิตช์ (Switch)', 'ชั้น 2 Data Link', 'ส่งเฉพาะพอร์ตปลายทางโดยดูจาก MAC', 'มาตรฐานของเครือข่ายท้องถิ่นในปัจจุบัน', TEAL],
      ['เราเตอร์ (Router)', 'ชั้น 3 Network', 'เลือกเส้นทางข้ามเครือข่ายโดยดูจากไอพี', 'เชื่อมวงต่างเครือข่ายและออกอินเทอร์เน็ต', GOLD],
      ['เกตเวย์ / ไฟร์วอลล์', 'ชั้น 4 ขึ้นไป', 'ตัดสินใจจากพอร์ตหรือเนื้อหา', 'กรองและควบคุมการเข้าถึง', INK],
    ]
      .map(([name, layer, work, use, c], i) => {
        const y = 36 + i * 62;
        return (
          box(12, y, 168, 52, [name, layer], { fill: '#fff', stroke: c, color: c, size: 13, weight: 600, lh: 17 }) +
          t(194, y + 22, work, { size: 12.5, color: INK }) +
          t(194, y + 40, use, { size: 12, color: INK3 })
        );
      })
      .join('') +
    box(12, 290, 636, 0, [], { fill: 'none', stroke: 'none' }) +
    t(12, 298, 'ยิ่งทำงานที่ชั้นสูงขึ้น ยิ่งตัดสินใจได้ละเอียดขึ้น แต่ก็ยิ่งช้าและแพงขึ้นตามไปด้วย', {
      size: 12.5, color: GOLD, weight: 600,
    })
);

F.netScales = svg(
  660,
  250,
  ARROWS +
    [
      ['PAN', 'รอบตัวบุคคล', 'ไม่กี่เมตร', 'Bluetooth หูฟังไร้สาย', TEAL],
      ['LAN', 'ในอาคารเดียว', 'ไม่กี่ร้อยเมตร', 'เครือข่ายในวิทยาลัย', INK],
      ['MAN', 'ทั่วเมือง', 'หลายกิโลเมตร', 'เชื่อมวิทยาเขตในจังหวัดเดียวกัน', GOLD],
      ['WAN', 'ข้ามเมืองข้ามประเทศ', 'ไม่จำกัด', 'อินเทอร์เน็ต', CRIM],
    ]
      .map(([n, scope, dist, ex, c], i) => {
        const x = 12 + i * 162;
        const hgt = 40 + i * 22;
        return (
          `<rect x="${x}" y="${170 - hgt}" width="148" height="${hgt}" rx="8" fill="${c}"/>` +
          t(x + 74, 170 - hgt / 2 + 6, n, { anchor: 'middle', color: '#fff', weight: 700, size: 20, display: true }) +
          t(x + 74, 190, scope, { anchor: 'middle', size: 12.5, weight: 600, color: c }) +
          t(x + 74, 208, dist, { anchor: 'middle', size: 11.5, color: INK3 }) +
          t(x + 74, 228, ex, { anchor: 'middle', size: 11.5, color: INK2 })
        );
      })
      .join('') +
    t(330, 26, 'ประเภทของเครือข่ายแบ่งตามขนาดพื้นที่', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    t(330, 48, 'เกณฑ์ที่ใช้แบ่งคือระยะทางที่ครอบคลุม ไม่ใช่จำนวนเครื่องหรือความเร็ว', {
      anchor: 'middle', size: 12.5, color: INK3,
    })
);

F.analogDigital = svg(
  660,
  260,
  ARROWS +
    t(12, 22, 'สัญญาณแอนะล็อก — ค่าต่อเนื่อง เปลี่ยนแปลงอย่างราบเรียบ', {
      size: 14.5, weight: 600, color: TEAL, display: true,
    }) +
    `<path d="M20 80 ${Array.from({ length: 60 }, (_, i) => {
      const x = 20 + i * 10;
      const y = 80 - 38 * Math.sin((i / 60) * Math.PI * 5);
      return `L${x} ${y.toFixed(1)}`;
    }).join(' ')}" stroke="${TEAL}" stroke-width="2.5" fill="none"/>` +
    `<path d="M14 80 L648 80" stroke="${LINE}" stroke-width="1"/>` +
    t(12, 148, 'สัญญาณดิจิทัล — มีเฉพาะระดับที่กำหนดไว้ เช่น 0 กับ 1', {
      size: 14.5, weight: 600, color: GOLD, display: true,
    }) +
    (() => {
      const bits = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1];
      let d = 'M20 200';
      bits.forEach((b, i) => {
        const x0 = 20 + i * 62;
        const y = b ? 168 : 200;
        d += ` L${x0} ${y} L${x0 + 62} ${y}`;
      });
      return (
        `<path d="${d}" stroke="${GOLD}" stroke-width="2.5" fill="none"/>` +
        bits
          .map((b, i) => t(51 + i * 62, 220, String(b), { anchor: 'middle', size: 12, color: INK3 }))
          .join('')
      );
    })() +
    t(12, 250, 'คอมพิวเตอร์ทำงานกับสัญญาณดิจิทัล แต่สื่อกลางหลายชนิดส่งได้เฉพาะแอนะล็อก จึงต้องมีอุปกรณ์แปลงสัญญาณคั่นกลาง', {
      size: 12.5, color: INK2,
    })
);

F.transmissionModes = svg(
  660,
  270,
  ARROWS +
    [
      ['Simplex — ทางเดียว', 'ส่งได้ทิศเดียวตลอด', ['a'], 'วิทยุกระจายเสียง จอภาพ', TEAL],
      ['Half-duplex — สองทางสลับกัน', 'ส่งได้สองทาง แต่ทีละทาง', ['a', 'b'], 'วิทยุสื่อสารที่ต้องกดพูด', GOLD],
      ['Full-duplex — สองทางพร้อมกัน', 'ส่งและรับพร้อมกันได้', ['both'], 'โทรศัพท์ สายแลนสมัยใหม่', CRIM],
    ]
      .map(([name, desc, dirs, ex, c], i) => {
        const y = 30 + i * 78;
        let arrows = '';
        if (dirs[0] === 'both') {
          arrows =
            line(300, y + 26, 420, y + 26, { m: 'arc', color: c }) +
            line(420, y + 48, 300, y + 48, { m: 'arc', color: c });
        } else if (dirs.length === 2) {
          arrows =
            line(300, y + 26, 420, y + 26, { m: 'arg', color: c }) +
            line(420, y + 48, 300, y + 48, { m: 'arg', color: c, dash: '5 4' });
        } else {
          arrows = line(300, y + 37, 420, y + 37, { m: 'art', color: c });
        }
        return (
          t(12, y + 20, name, { size: 14.5, weight: 600, color: c, display: true }) +
          t(12, y + 40, desc, { size: 12.5, color: INK2 }) +
          t(12, y + 58, 'เช่น ' + ex, { size: 12, color: INK3 }) +
          box(238, y + 16, 60, 42, ['A'], { fill: '#fff', stroke: INK, color: INK, size: 14, weight: 600 }) +
          box(422, y + 16, 60, 42, ['B'], { fill: '#fff', stroke: INK, color: INK, size: 14, weight: 600 }) +
          arrows
        );
      })
      .join('') +
    t(12, 264, 'Half-duplex ใช้เส้นทางร่วมกัน จึงต้องมีกลไกตัดสินว่าใครได้ส่งก่อน ซึ่งนำไปสู่เรื่อง CSMA ในบทอีเทอร์เน็ต', {
      size: 12.5, color: GOLD, weight: 600,
    })
);

F.serialParallel = svg(
  660,
  270,
  ARROWS +
    t(12, 22, 'ส่งแบบขนาน — 8 บิตพร้อมกันบน 8 เส้น', { size: 14.5, weight: 600, color: GOLD, display: true }) +
    box(12, 34, 100, 90, ['ผู้ส่ง'], { fill: '#fff', stroke: INK, color: INK, size: 13 }) +
    box(548, 34, 100, 90, ['ผู้รับ'], { fill: '#fff', stroke: INK, color: INK, size: 13 }) +
    Array.from({ length: 8 }, (_, i) => {
      const y = 42 + i * 11;
      return line(116, y, 544, y, { color: GOLD, w: 1.4, arrow: false });
    }).join('') +
    t(330, 138, 'เร็วในระยะสั้น แต่ระยะไกลบิตมาถึงไม่พร้อมกันและสายแพงมาก', {
      anchor: 'middle', size: 12.5, color: CRIM,
    }) +
    `<path d="M12 154 L648 154" stroke="${LINE}" stroke-width="1.5"/>` +
    t(12, 180, 'ส่งแบบอนุกรม — เรียงทีละบิตบนเส้นเดียว', { size: 14.5, weight: 600, color: TEAL, display: true }) +
    box(12, 192, 100, 52, ['ผู้ส่ง'], { fill: '#fff', stroke: INK, color: INK, size: 13 }) +
    box(548, 192, 100, 52, ['ผู้รับ'], { fill: '#fff', stroke: INK, color: INK, size: 13 }) +
    line(116, 218, 544, 218, { m: 'art', color: TEAL }) +
    [0, 1, 1, 0, 1, 0, 0, 1]
      .map((b, i) => t(160 + i * 46, 210, String(b), { anchor: 'middle', size: 13, color: INK2, weight: 600 }))
      .join('') +
    t(330, 258, 'ใช้สายน้อย ส่งได้ไกล เป็นวิธีที่ใช้จริงเกือบทั้งหมดในปัจจุบัน รวมถึง USB และอีเทอร์เน็ต', {
      anchor: 'middle', size: 12.5, color: TEAL, weight: 600,
    })
);

F.impairment = svg(
  660,
  280,
  ARROWS +
    t(330, 24, 'ความสูญเสียของสัญญาณสามแบบ', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    [
      ['การลดทอน', 'Attenuation', 'สัญญาณอ่อนลงตามระยะทาง', 'แก้ด้วยตัวทวนสัญญาณหรือขยายสัญญาณ', TEAL],
      ['ความเพี้ยน', 'Distortion', 'ความถี่ต่างกันเดินทางถึงไม่พร้อมกัน รูปคลื่นจึงเปลี่ยนไป', 'แก้ด้วยการออกแบบสื่อกลางและอุปกรณ์ให้เหมาะสม', GOLD],
      ['สัญญาณรบกวน', 'Noise', 'มีสัญญาณแปลกปลอมเข้ามาปน เช่น จากมอเตอร์หรือสายไฟ', 'แก้ด้วยสายหุ้มฉนวน สายตีเกลียว หรือเปลี่ยนไปใช้ใยแก้ว', CRIM],
    ]
      .map(([th, en, what, fix, c], i) => {
        const y = 40 + i * 78;
        return (
          box(12, y, 150, 62, [th, en], { fill: '#fff', stroke: c, color: c, size: 13.5, weight: 600, lh: 18 }) +
          t(178, y + 26, what, { size: 13, color: INK }) +
          t(178, y + 46, fix, { size: 12, color: INK3 })
        );
      })
      .join('') +
    box(12, 276, 636, 0, [], { fill: 'none', stroke: 'none' })
);

F.mediaTypes = svg(
  660,
  300,
  ARROWS +
    t(12, 22, 'เปรียบเทียบสื่อกลางส่งข้อมูล', { size: 15, weight: 600, color: INK, display: true }) +
    [
      ['UTP (สายตีเกลียวไม่หุ้มฉนวน)', 100, 1, 2, 'ใช้ในอาคารทั่วไป ราคาถูก ติดตั้งง่าย'],
      ['STP (สายตีเกลียวหุ้มฉนวน)', 100, 2, 3, 'ทนสัญญาณรบกวนกว่า UTP แต่แข็งและแพงกว่า'],
      ['Coaxial (สายโคแอกเชียล)', 500, 2, 3, 'ใช้กับเคเบิลทีวีและกล้องวงจรปิด'],
      ['Fiber Optic (ใยแก้วนำแสง)', 40000, 5, 5, 'ไกลและเร็วที่สุด ไม่ถูกรบกวนด้วยคลื่นแม่เหล็กไฟฟ้า'],
      ['Wireless (คลื่นวิทยุ)', 100, 1, 1, 'ไม่ต้องเดินสาย แต่ถูกรบกวนง่ายและดักฟังได้ง่ายที่สุด'],
    ]
      .map(([name, dist, secu, spd, note], i) => {
        const y = 36 + i * 52;
        const bar = Math.round((Math.log10(dist) / Math.log10(40000)) * 200);
        return (
          t(12, y + 18, name, { size: 13, weight: 600, color: INK }) +
          t(12, y + 36, note, { size: 11.5, color: INK3 }) +
          `<rect x="326" y="${y + 6}" width="${bar}" height="16" rx="4" fill="${TEAL}"/>` +
          t(534, y + 19, dist >= 1000 ? dist / 1000 + ' กม.' : dist + ' ม.', { size: 11.5, color: INK2 }) +
          t(600, y + 19, '🔒'.repeat(0) + '★'.repeat(secu), { size: 12, color: GOLD })
        );
      })
      .join('') +
    t(326, 32, 'ระยะทางสูงสุดโดยประมาณ', { size: 11.5, color: INK3 }) +
    t(600, 32, 'ความปลอดภัย', { size: 11.5, color: INK3 }) +
    box(12, 298, 636, 0, [], { fill: 'none', stroke: 'none' })
);

F.multiplexing = svg(
  660,
  300,
  ARROWS +
    t(12, 22, 'FDM — แบ่งตามความถี่ ทุกช่องส่งพร้อมกันคนละย่าน', {
      size: 14.5, weight: 600, color: GOLD, display: true,
    }) +
    [0, 1, 2].map((i) =>
      `<rect x="120" y="${36 + i * 26}" width="420" height="20" rx="4" fill="${[GOLD, '#D4A93C', '#E8C874'][i]}"/>` +
      t(112, 51 + i * 26, 'ช่อง ' + (i + 1), { anchor: 'end', size: 12, color: INK2 })
    ).join('') +
    t(552, 76, 'ใช้กับวิทยุ ทีวี', { size: 12, color: INK3 }) +
    `<path d="M12 128 L648 128" stroke="${LINE}" stroke-width="1.5"/>` +
    t(12, 154, 'TDM — แบ่งตามเวลา ผลัดกันใช้ทั้งช่องสัญญาณคนละช่วงเวลา', {
      size: 14.5, weight: 600, color: TEAL, display: true,
    }) +
    Array.from({ length: 9 }, (_, i) =>
      `<rect x="${120 + i * 47}" y="168" width="43" height="26" rx="4" fill="${[TEAL, '#3E9B92', '#6DBAB2'][i % 3]}"/>` +
      t(141 + i * 47, 186, String((i % 3) + 1), { anchor: 'middle', color: '#fff', size: 13, weight: 700, display: true })
    ).join('') +
    t(112, 186, 'เวลา →', { anchor: 'end', size: 12, color: INK2 }) +
    t(120, 214, 'ใช้กับสายโทรศัพท์ดิจิทัลและเครือข่ายคอมพิวเตอร์', { size: 12, color: INK3 }) +
    box(12, 232, 636, 58, [
      'WDM เป็น FDM รูปแบบหนึ่งที่ใช้กับใยแก้วนำแสง โดยแบ่งตามความยาวคลื่นแสงแทนความถี่',
      'ทำให้ใยแก้วเส้นเดียวส่งข้อมูลได้หลายสิบช่องพร้อมกัน เป็นเทคโนโลยีเบื้องหลังอินเทอร์เน็ตข้ามทวีป',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 20 })
);

F.errorDetection = svg(
  660,
  290,
  ARROWS +
    t(330, 24, 'สามวิธีตรวจจับข้อผิดพลาด', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    [
      ['Parity Bit', 'เติม 1 บิตให้จำนวนเลข 1 เป็นคู่หรือคี่ตามที่ตกลง', 'ง่ายและเร็วที่สุด', 'จับไม่ได้ถ้าผิดพร้อมกันเป็นจำนวนคู่', TEAL],
      ['Checksum', 'บวกค่าทุกส่วนแล้วส่งผลรวมไปด้วย', 'คำนวณง่าย ใช้ในส่วนหัวของ IP และ TCP', 'จับข้อผิดพลาดบางรูปแบบไม่ได้', GOLD],
      ['CRC', 'หารข้อมูลด้วยพหุนามที่กำหนด แล้วส่งเศษไปด้วย', 'จับข้อผิดพลาดเป็นชุดได้ดีมาก ใช้ในเฟรมอีเทอร์เน็ต', 'คำนวณซับซ้อนกว่า แต่ทำในฮาร์ดแวร์ได้เร็ว', CRIM],
    ]
      .map(([name, how, good, bad, c], i) => {
        const y = 40 + i * 80;
        return (
          box(12, y, 130, 64, [name], { fill: c, stroke: c, color: '#fff', size: 15, weight: 700, display: true }) +
          t(156, y + 20, how, { size: 12.5, color: INK }) +
          t(156, y + 40, '+ ' + good, { size: 12, color: TEAL }) +
          t(156, y + 58, '− ' + bad, { size: 12, color: CRIM })
        );
      })
      .join('') +
    box(12, 282, 636, 0, [], { fill: 'none', stroke: 'none' })
);

F.arqCompare = svg(
  660,
  330,
  ARROWS +
    t(12, 22, 'Stop-and-Wait — ส่งทีละเฟรมแล้วรอตอบรับ', { size: 14.5, weight: 600, color: CRIM, display: true }) +
    `<path d="M100 40 L100 140" stroke="${LINE}" stroke-width="2" stroke-dasharray="4 4"/>` +
    `<path d="M540 40 L540 140" stroke="${LINE}" stroke-width="2" stroke-dasharray="4 4"/>` +
    line(106, 56, 534, 70, { m: 'arc', color: CRIM }) +
    t(320, 52, 'เฟรม 1', { anchor: 'middle', size: 12, color: CRIM }) +
    line(534, 86, 106, 100, { m: 'art', color: TEAL }) +
    t(320, 82, 'ACK 1', { anchor: 'middle', size: 12, color: TEAL }) +
    line(106, 116, 534, 130, { m: 'arc', color: CRIM }) +
    t(320, 112, 'เฟรม 2', { anchor: 'middle', size: 12, color: CRIM }) +
    t(12, 158, 'เสียเวลารอมาก ยิ่งระยะทางไกลยิ่งช้า', { size: 12.5, color: CRIM }) +
    `<path d="M12 172 L648 172" stroke="${LINE}" stroke-width="1.5"/>` +
    t(12, 198, 'Sliding Window — ส่งได้หลายเฟรมก่อนรอตอบรับ', { size: 14.5, weight: 600, color: TEAL, display: true }) +
    `<path d="M100 212 L100 306" stroke="${LINE}" stroke-width="2" stroke-dasharray="4 4"/>` +
    `<path d="M540 212 L540 306" stroke="${LINE}" stroke-width="2" stroke-dasharray="4 4"/>` +
    [0, 1, 2, 3]
      .map((i) => line(106, 224 + i * 14, 534, 236 + i * 14, { m: 'art', color: TEAL }))
      .join('') +
    t(320, 220, 'เฟรม 1 ถึง 4 ทยอยส่งต่อเนื่องโดยไม่ต้องรอ', { anchor: 'middle', size: 12, color: TEAL }) +
    line(534, 292, 106, 300, { m: 'arg', color: GOLD }) +
    t(320, 290, 'ACK รวม', { anchor: 'middle', size: 12, color: GOLD }) +
    t(12, 324, 'ใช้ช่องสัญญาณได้เต็มประสิทธิภาพกว่ามาก เป็นวิธีที่ TCP ใช้จริง', {
      size: 12.5, color: TEAL, weight: 600,
    })
);

F.ethernetFrame = svg(
  660,
  270,
  ARROWS +
    t(12, 22, 'โครงสร้างเฟรมอีเทอร์เน็ต (IEEE 802.3)', { size: 15, weight: 600, color: INK, display: true }) +
    (() => {
      const fields = [
        ['Preamble', '7', INK3],
        ['SFD', '1', INK3],
        ['MAC ปลายทาง', '6', CRIM],
        ['MAC ต้นทาง', '6', CRIM],
        ['Type/Length', '2', GOLD],
        ['ข้อมูล (Payload)', '46–1500', TEAL],
        ['FCS', '4', INK],
      ];
      const total = fields.reduce((a, f) => a + (f[0].includes('Payload') ? 8 : +f[1]), 0);
      let x = 12;
      return fields
        .map(([name, size, c]) => {
          const w = Math.round((( name.includes('Payload') ? 8 : +size) / total) * 636);
          const o =
            `<rect x="${x}" y="36" width="${w - 2}" height="46" rx="5" fill="${c}"/>` +
            t(x + w / 2 - 1, 58, name.length > 12 ? name.slice(0, 11) + '…' : name, {
              anchor: 'middle', color: '#fff', size: 10.5, weight: 600,
            }) +
            t(x + w / 2 - 1, 74, size + ' ไบต์', { anchor: 'middle', color: '#fff', size: 9.5 });
          x += w;
          return o;
        })
        .join('');
    })() +
    box(12, 96, 636, 66, [
      'ขนาดเฟรมรวมอยู่ระหว่าง 64 ถึง 1518 ไบต์ ถ้าข้อมูลน้อยกว่า 46 ไบต์ต้องเติมบิตให้ครบ',
      'ค่า MTU ที่ได้ยินบ่อยคือ 1500 ไบต์ ซึ่งหมายถึงขนาดของส่วนข้อมูลเท่านั้น ไม่รวมส่วนหัว',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 20 }) +
    t(12, 188, 'โครงสร้างของ MAC Address ขนาด 48 บิต', { size: 14.5, weight: 600, color: INK, display: true }) +
    `<rect x="12" y="200" width="300" height="38" rx="6" fill="${GOLD}"/>` +
    `<rect x="316" y="200" width="300" height="38" rx="6" fill="${TEAL}"/>` +
    t(162, 224, 'OUI — รหัสผู้ผลิต 24 บิต', { anchor: 'middle', color: '#fff', size: 13, weight: 600 }) +
    t(466, 224, 'หมายเลขเครื่อง 24 บิต', { anchor: 'middle', color: '#fff', size: 13, weight: 600 }) +
    t(12, 260, 'ตัวอย่าง 00:1A:2B:3C:4D:5E — สามคู่แรกบอกยี่ห้อผู้ผลิต จึงใช้ตรวจสอบอุปกรณ์แปลกปลอมในเครือข่ายได้', {
      size: 12.5, color: INK2,
    })
);

F.csma = svg(
  660,
  300,
  ARROWS +
    t(12, 22, 'CSMA/CD — ใช้กับสายแลน ตรวจจับการชนแล้วแก้ทีหลัง', {
      size: 14.5, weight: 600, color: GOLD, display: true,
    }) +
    [
      ['ฟังสายก่อน', 'ว่างไหม'],
      ['ส่งข้อมูล', 'พร้อมฟังต่อ'],
      ['ตรวจพบการชน', 'ส่งสัญญาณเตือน'],
      ['รอสุ่มเวลา', 'แล้วลองใหม่'],
    ]
      .map(([a, b], i) => {
        const x = 12 + i * 162;
        return (
          box(x, 36, 148, 54, [a, b], { fill: '#fff', stroke: GOLD, color: INK2, size: 12, lh: 16 }) +
          (i < 3 ? line(x + 150, 63, x + 160, 63, { m: 'arg', color: GOLD }) : '')
        );
      })
      .join('') +
    t(12, 112, 'ตรวจจับการชนได้เพราะฟังสายไปพร้อมกับส่ง สายเดียวรับส่งได้ทั้งสองทิศ', { size: 12, color: INK3 }) +
    `<path d="M12 128 L648 128" stroke="${LINE}" stroke-width="1.5"/>` +
    t(12, 154, 'CSMA/CA — ใช้กับไร้สาย เลี่ยงการชนตั้งแต่ต้น', {
      size: 14.5, weight: 600, color: TEAL, display: true,
    }) +
    [
      ['ฟังคลื่นก่อน', 'ว่างไหม'],
      ['รอช่วงเวลา', 'บวกเวลาสุ่ม'],
      ['ขออนุญาตส่ง', 'RTS / CTS'],
      ['ส่งแล้วรอ ACK', 'ไม่มี ACK = ส่งซ้ำ'],
    ]
      .map(([a, b], i) => {
        const x = 12 + i * 162;
        return (
          box(x, 168, 148, 54, [a, b], { fill: '#fff', stroke: TEAL, color: INK2, size: 12, lh: 16 }) +
          (i < 3 ? line(x + 150, 195, x + 160, 195, { m: 'art', color: TEAL }) : '')
        );
      })
      .join('') +
    box(12, 236, 636, 56, [
      'ไร้สายตรวจจับการชนไม่ได้ เพราะสัญญาณที่ส่งออกไปแรงกว่าสัญญาณที่รับเข้ามามาก',
      'และเพราะปัญหาโหนดซ่อน คือสองเครื่องที่ต่างเห็นจุดกระจายสัญญาณแต่มองไม่เห็นกันเอง',
    ], { fill: TEALL, stroke: TEAL, color: '#0E5F58', size: 12.5, lh: 20 })
);

F.wifiTopology = svg(
  660,
  280,
  ARROWS +
    t(12, 22, 'แบบมีโครงสร้างพื้นฐาน (Infrastructure)', { size: 14.5, weight: 600, color: TEAL, display: true }) +
    box(240, 36, 170, 48, ['Access Point', 'ประกาศชื่อ SSID'], {
      fill: TEAL, stroke: TEAL, color: '#fff', size: 12.5, weight: 600, lh: 17,
    }) +
    [
      [60, 118],
      [180, 132],
      [470, 132],
      [590, 118],
    ]
      .map(([x, y]) => box(x - 42, y - 20, 84, 40, ['เครื่องลูกข่าย'], { fill: '#fff', stroke: LINE, color: INK2, size: 11 }) + line(x, y - 22, 300, 88, { m: 'art', color: TEAL, dash: '4 3', arrow: false }))
      .join('') +
    line(325, 88, 325, 100, { m: 'art', color: TEAL }) +
    box(255, 104, 140, 32, ['ออกสู่เครือข่ายมีสาย'], { fill: PAPER, stroke: LINE, color: INK2, size: 11.5 }) +
    t(12, 178, 'ทุกเครื่องคุยผ่านจุดกระจายสัญญาณเสมอ แม้จะคุยกับเครื่องที่นั่งอยู่ข้าง ๆ ก็ตาม', {
      size: 12.5, color: INK2,
    }) +
    box(12, 194, 636, 74, [
      'สิ่งที่ต้องสอนคู่กันเสมอคือความปลอดภัย เพราะคลื่นแพร่ออกไปนอกอาคารด้วย',
      'ให้ใช้ WPA3 หรืออย่างน้อย WPA2 และห้ามใช้ WEP ซึ่งถูกถอดรหัสได้ในไม่กี่นาที',
      'การซ่อนชื่อ SSID ไม่ใช่มาตรการความปลอดภัย เพราะเครื่องมือทั่วไปตรวจพบได้อยู่ดี',
    ], { fill: CRIML, stroke: CRIM, color: CRIM, size: 12.5, lh: 20 })
);

F.ipv4Classes = svg(
  660,
  300,
  ARROWS +
    t(12, 22, 'การจัดสรรไอพีแบบใช้คลาส', { size: 15, weight: 600, color: INK, display: true }) +
    [
      ['A', '1–126', '/8', '16,777,214', INK],
      ['B', '128–191', '/16', '65,534', TEAL],
      ['C', '192–223', '/24', '254', GOLD],
      ['D', '224–239', 'มัลติแคสต์', '—', INK3],
      ['E', '240–255', 'สงวนไว้วิจัย', '—', INK3],
    ]
      .map(([cls, range, mask, hosts, c], i) => {
        const y = 36 + i * 38;
        return (
          box(12, y, 52, 30, [cls], { fill: c, stroke: c, color: '#fff', size: 15, weight: 700, display: true, r: 6 }) +
          t(78, y + 20, 'ออกเทตแรก ' + range, { size: 13, color: INK }) +
          t(268, y + 20, mask, { size: 13, color: INK2 }) +
          t(400, y + 20, hosts === '—' ? '' : 'โฮสต์ต่อเครือข่าย ' + hosts, { size: 12.5, color: INK3 })
        );
      })
      .join('') +
    t(12, 246, 'ช่วงไอพีส่วนตัวที่ใช้ภายในองค์กรและออกอินเทอร์เน็ตตรงไม่ได้', {
      size: 14, weight: 600, color: CRIM, display: true,
    }) +
    [
      ['10.0.0.0/8', 'องค์กรขนาดใหญ่'],
      ['172.16.0.0/12', 'องค์กรขนาดกลาง'],
      ['192.168.0.0/16', 'บ้านและสำนักงานเล็ก'],
    ]
      .map(([r, use], i) =>
        box(12 + i * 216, 256, 204, 36, [r], { fill: CRIML, stroke: CRIM, color: CRIM, size: 13, weight: 600 }) +
        t(114 + i * 216, 300, use, { anchor: 'middle', size: 11, color: INK3 })
      )
      .join('') +
    t(12, 232, '127.0.0.0/8 สงวนไว้สำหรับ loopback จึงไม่ปรากฏในตารางคลาส A', { size: 12, color: INK3 })
);

F.natFlow = svg(
  660,
  290,
  ARROWS +
    box(12, 60, 130, 60, ['เครื่องในองค์กร', '192.168.1.10'], { fill: '#fff', stroke: TEAL, color: TEAL, size: 12, weight: 600, lh: 17 }) +
    line(148, 90, 208, 90, { m: 'ar' }) +
    t(178, 78, 'ต้นทาง', { anchor: 'middle', size: 11, color: INK3 }) +
    box(214, 52, 150, 76, ['เราเตอร์ที่ทำ NAT', 'แปลงไอพีต้นทาง', 'และจดจำไว้ในตาราง'], {
      fill: INK, stroke: INK, color: '#fff', size: 12, weight: 600, lh: 17,
    }) +
    line(370, 90, 430, 90, { m: 'ar' }) +
    box(436, 60, 212, 60, ['อินเทอร์เน็ตเห็นเป็น', '203.0.113.5 เพียงไอพีเดียว'], {
      fill: GOLDL, stroke: GOLD, color: GOLD, size: 12, weight: 600, lh: 17,
    }) +
    t(12, 30, 'NAT แปลงไอพีส่วนตัวให้เป็นไอพีสาธารณะ', { size: 15, weight: 600, color: INK, display: true }) +
    t(12, 164, 'ตารางการแปลงที่เราเตอร์เก็บไว้', { size: 13.5, weight: 600, color: INK, display: true }) +
    (() => {
      const rows = [
        ['192.168.1.10:51200', '203.0.113.5:40001'],
        ['192.168.1.11:49888', '203.0.113.5:40002'],
        ['192.168.1.12:52310', '203.0.113.5:40003'],
      ];
      return (
        box(12, 176, 300, 28, ['ภายใน (ไอพี:พอร์ต)'], { fill: PAPER, stroke: LINE, color: INK2, size: 12, weight: 600, r: 6 }) +
        box(318, 176, 300, 28, ['ภายนอก (ไอพี:พอร์ต)'], { fill: PAPER, stroke: LINE, color: INK2, size: 12, weight: 600, r: 6 }) +
        rows
          .map(([a, b], i) =>
            box(12, 208 + i * 26, 300, 24, [a], { fill: '#fff', stroke: LINE, color: INK2, size: 12, r: 5 }) +
            box(318, 208 + i * 26, 300, 24, [b], { fill: '#fff', stroke: LINE, color: INK2, size: 12, r: 5 })
          )
          .join('')
      );
    })() +
    t(12, 288, 'หมายเลขพอร์ตคือกุญแจที่ทำให้แยกออกว่าข้อมูลขากลับเป็นของเครื่องใด', {
      size: 12.5, color: GOLD, weight: 600,
    })
);

F.tcpVsUdp = svg(
  660,
  290,
  ARROWS +
    t(12, 22, 'TCP กับ UDP ต่างกันอย่างไร', { size: 15, weight: 600, color: INK, display: true }) +
    box(12, 36, 316, 200, [], { fill: '#fff', stroke: TEAL, sw: 2 }) +
    box(332, 36, 316, 200, [], { fill: '#fff', stroke: GOLD, sw: 2 }) +
    `<rect x="12" y="36" width="316" height="36" rx="9" fill="${TEAL}"/>` +
    `<rect x="332" y="36" width="316" height="36" rx="9" fill="${GOLD}"/>` +
    t(170, 60, 'TCP — เชื่อถือได้', { anchor: 'middle', color: '#fff', size: 16, weight: 700, display: true }) +
    t(490, 60, 'UDP — เร็ว', { anchor: 'middle', color: '#fff', size: 16, weight: 700, display: true }) +
    [
      ['ต้องจับมือสามทางก่อนส่ง', 'ยิงออกไปได้ทันที'],
      ['รับประกันว่าถึงครบและเรียงลำดับ', 'ไม่รับประกันอะไรเลย'],
      ['ส่งซ้ำเมื่อข้อมูลหาย', 'หายก็หายไป'],
      ['มีการควบคุมความคับคั่ง', 'ไม่มี ส่งเต็มที่ตลอด'],
      ['ส่วนหัว 20 ไบต์', 'ส่วนหัว 8 ไบต์'],
      ['เว็บ อีเมล โอนไฟล์', 'DNS สตรีมมิง เกม เสียง'],
    ]
      .map(([a, b], i) => {
        const y = 92 + i * 24;
        return (
          t(28, y, '• ' + a, { size: 12.5, color: i === 5 ? TEAL : INK2, weight: i === 5 ? 600 : 400 }) +
          t(348, y, '• ' + b, { size: 12.5, color: i === 5 ? GOLD : INK2, weight: i === 5 ? 600 : 400 })
        );
      })
      .join('') +
    box(12, 248, 636, 34, ['เลือก TCP เมื่อความถูกต้องสำคัญกว่าความเร็ว และเลือก UDP เมื่อความเร็วสำคัญกว่าความครบถ้วน'], {
      fill: PAPER, stroke: LINE, color: INK, size: 13, weight: 600,
    })
);

F.dnsResolution = svg(
  660,
  320,
  ARROWS +
    t(12, 22, 'ขั้นตอนการแปลงชื่อโดเมนเป็นไอพี', { size: 15, weight: 600, color: INK, display: true }) +
    box(12, 130, 120, 56, ['เครื่องผู้ใช้'], { fill: '#fff', stroke: INK, color: INK, size: 13 }) +
    box(168, 130, 140, 56, ['DNS Resolver', 'ของผู้ให้บริการ'], {
      fill: INK, stroke: INK, color: '#fff', size: 12, weight: 600, lh: 16,
    }) +
    [
      ['Root', 'บอกว่าไปถาม .th ต่อ', 40],
      ['TLD .th', 'บอกว่าไปถาม ac.th ต่อ', 130],
      ['Authoritative', 'ตอบไอพีจริงของโดเมน', 220],
    ]
      .map(([name, note, y], i) => {
        return (
          box(392, y, 160, 60, [name, note], { fill: '#fff', stroke: [CRIM, GOLD, TEAL][i], color: [CRIM, GOLD, TEAL][i], size: 12, weight: 600, lh: 16 }) +
          line(312, 152, 386, y + 30, { m: ['arc', 'arg', 'art'][i], color: [CRIM, GOLD, TEAL][i] }) +
          t(566, y + 34, String(i + 1), { size: 15, weight: 700, color: [CRIM, GOLD, TEAL][i], display: true })
        );
      })
      .join('') +
    line(136, 146, 162, 146, { m: 'ar' }) +
    line(162, 172, 136, 172, { m: 'ar' }) +
    t(150, 208, 'ถาม', { anchor: 'middle', size: 11, color: INK3 }) +
    box(12, 288, 636, 28, ['Resolver จะเก็บคำตอบไว้ในแคชตามเวลา TTL ครั้งต่อไปจึงตอบได้ทันทีโดยไม่ต้องถามใหม่ทั้งหมด'], {
      fill: PAPER, stroke: LINE, color: INK2, size: 12.5,
    }) +
    t(12, 248, 'คำสั่ง ipconfig /flushdns คือการล้างแคชชั้นในเครื่องของเราเอง', { size: 12, color: GOLD, weight: 600 })
);

F.firewallTypes = svg(
  660,
  310,
  ARROWS +
    t(12, 22, 'ไฟร์วอลล์สี่ระดับ เรียงตามความละเอียดในการตัดสินใจ', {
      size: 15, weight: 600, color: INK, display: true,
    }) +
    [
      ['Packet Filter', 'ชั้น 3–4', 'ดูไอพีและพอร์ตทีละแพ็กเก็ต ไม่จำบริบท', 'เร็วที่สุด แต่หลอกได้ง่าย', TEAL],
      ['Stateful Inspection', 'ชั้น 3–4', 'จำสถานะการเชื่อมต่อไว้ รู้ว่าแพ็กเก็ตนี้เป็นขากลับของใคร', 'มาตรฐานขั้นต่ำในปัจจุบัน', GOLD],
      ['Proxy / Application Gateway', 'ชั้น 7', 'รับแทนแล้วส่งต่อ อ่านเนื้อหาระดับแอปพลิเคชันได้', 'ช้ากว่า แต่ควบคุมได้ละเอียด', CRIM],
      ['Next-Generation Firewall', 'ชั้น 3–7', 'รวมทุกอย่างเข้าด้วยกัน พร้อมระบุผู้ใช้และตรวจจับการบุกรุก', 'แพงและต้องมีคนดูแล', INK],
    ]
      .map(([name, layer, work, note, c], i) => {
        const y = 36 + i * 66;
        return (
          box(12, y, 176, 56, [name, layer], { fill: '#fff', stroke: c, color: c, size: 12.5, weight: 600, lh: 17 }) +
          t(204, y + 24, work, { size: 12.5, color: INK }) +
          t(204, y + 44, note, { size: 12, color: INK3 }) +
          `<rect x="12" y="${y}" width="6" height="56" rx="3" fill="${c}"/>`
        );
      })
      .join('') +
    box(12, 300, 636, 0, [], { fill: 'none', stroke: 'none' })
);

/* ══════════════ CS-601 เตรียมแข่ง CTF ══════════════ */

F.ctfCategories = svg(
  660,
  330,
  ARROWS +
    t(330, 24, 'เจ็ดหมวดโจทย์ในการแข่งขัน', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    [
      ['Web', 'เจาะเว็บแอปพลิเคชัน', CRIM],
      ['Forensics', 'กู้และแกะหลักฐานดิจิทัล', TEAL],
      ['Rev & Pwn', 'แกะไบนารีและเจาะโปรแกรม', INK],
      ['Network', 'วิเคราะห์แพ็กเก็ต', GOLD],
      ['Mobile', 'เจาะแอปมือถือ', '#7B4B94'],
      ['Crypto', 'ถอดรหัสและซ่อนข้อมูล', '#0E6E6E'],
      ['Prog & Other', 'เขียนโปรแกรม AI IoT', '#B5651D'],
    ]
      .map(([name, desc, c], i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 12 + col * 162;
        const y = 40 + row * 96;
        return (
          box(x, y, 148, 78, [], { fill: '#fff', stroke: c, sw: 2 }) +
          `<rect x="${x}" y="${y}" width="148" height="28" rx="9" fill="${c}"/>` +
          t(x + 74, y + 19, name, { anchor: 'middle', color: '#fff', size: 14, weight: 700, display: true }) +
          t(x + 74, y + 52, desc.length > 18 ? desc.slice(0, 17) + '…' : desc, {
            anchor: 'middle', size: 11.5, color: INK2,
          })
        );
      })
      .join('') +
    box(12, 240, 636, 76, [
      'รูปแบบ Jeopardy คือมีกระดานโจทย์แยกตามหมวดและคะแนน เลือกทำข้อไหนก่อนก็ได้',
      'ทุกข้อจบด้วยการหาสตริงที่เรียกว่า flag แล้วนำไปส่งในระบบเพื่อรับคะแนน',
      'ไม่มีการโจมตีทีมอื่น ต่างจากรูปแบบ Attack-Defense ที่แต่ละทีมมีเซิร์ฟเวอร์ของตัวเอง',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 20 })
);

F.ctfWorkflow = svg(
  660,
  260,
  ARROWS +
    [
      ['1', 'อ่านโจทย์', 'ชื่อโจทย์มักเป็นคำใบ้'],
      ['2', 'สำรวจไฟล์', 'file, strings, exiftool'],
      ['3', 'ตั้งสมมติฐาน', 'น่าจะเป็นเทคนิคอะไร'],
      ['4', 'ทดลอง', 'ลองแล้วดูผล'],
      ['5', 'หา flag', 'ค้นด้วยรูปแบบธง'],
    ]
      .map(([n, title, note], i) => {
        const x = 12 + i * 129;
        return (
          box(x, 60, 116, 74, [note], { fill: '#fff', stroke: LINE, color: INK2, size: 11.5, lh: 16 }) +
          `<circle cx="${x + 58}" cy="44" r="16" fill="${GOLD}"/>` +
          t(x + 58, 49, n, { anchor: 'middle', color: '#fff', weight: 700, size: 14, display: true }) +
          t(x + 58, 84, title, { anchor: 'middle', size: 13, weight: 600, color: INK, display: true }) +
          (i < 4 ? line(x + 118, 97, x + 127, 97, { m: 'arg', color: GOLD }) : '')
        );
      })
      .join('') +
    `<path d="M70 142 L70 166 L590 166 L590 142" stroke="${INK3}" stroke-width="1.6" fill="none" stroke-dasharray="5 4" marker-end="url(#ar)"/>` +
    t(330, 184, 'ถ้าติดตัน ให้กลับไปขั้นที่ 3 แล้วตั้งสมมติฐานใหม่ อย่าดันสมมติฐานเดิมนานเกิน 20 นาที', {
      anchor: 'middle', size: 12.5, color: INK2,
    }) +
    t(330, 24, 'ขั้นตอนการเข้าโจทย์ที่ใช้ได้กับทุกหมวด', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    box(12, 198, 636, 50, [
      'คำสั่งแรกที่ควรรันกับไฟล์ทุกไฟล์คือ file แล้วตามด้วย strings',
      'เพราะโจทย์ระดับคะแนนน้อยจำนวนมากจบได้ด้วยสองคำสั่งนี้',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, lh: 19, weight: 600 })
);

F.cryptoDecision = svg(
  660,
  340,
  ARROWS +
    t(330, 24, 'เจอข้อความประหลาด จะเริ่มถอดจากตรงไหน', {
      anchor: 'middle', size: 15, weight: 600, color: INK, display: true,
    }) +
    box(240, 38, 180, 40, ['ดูหน้าตาข้อความก่อน'], { fill: INK, stroke: INK, color: '#fff', size: 13, weight: 600 }) +
    [
      ['มีแต่ A-Z a-z 0-9 + / และลงท้าย =', 'Base64', TEAL, 30],
      ['มีแต่ 0-9 a-f และความยาวเป็นเลขคู่', 'Hex', TEAL, 190],
      ['ยาว 32 หรือ 40 หรือ 64 ตัวพอดี', 'ค่าแฮช ลองค้นในฐานข้อมูล', GOLD, 350],
      ['เป็นคำอ่านออกแต่สลับตัวอักษร', 'รหัสแทนที่ ลองซีซาร์หรือวิเคราะห์ความถี่', CRIM, 510],
    ]
      .map(([cond, ans, c, x], i) => {
        return (
          line(330, 82, x + 70, 116, { m: 'ar' }) +
          box(x - 68 + 68, 120, 140, 78, [], { fill: '#fff', stroke: c, sw: 2 }) +
          t(x + 70, 140, cond.length > 22 ? cond.slice(0, 21) + '…' : cond, {
            anchor: 'middle', size: 10.5, color: INK3,
          }) +
          t(x + 70, 168, ans.split(' ')[0], { anchor: 'middle', size: 15, weight: 700, color: c, display: true }) +
          t(x + 70, 188, ans.split(' ').slice(1).join(' ').slice(0, 24), {
            anchor: 'middle', size: 10.5, color: INK2,
          })
        );
      })
      .join('') +
    box(12, 214, 636, 54, [
      'ถ้ายังไม่เข้าเงื่อนไขใดเลย ให้ลอง ROT13 แล้ว Base32 แล้ว Base85 ตามลำดับ',
      'และอย่าลืมว่าโจทย์มักซ้อนหลายชั้น ถอดชั้นหนึ่งแล้วผลลัพธ์อาจยังเป็นรหัสอีกชั้น',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 19 }) +
    box(12, 278, 636, 54, [
      'ข้อควรระวังที่สุด — Base64 ไม่ใช่การเข้ารหัส แต่เป็นการเข้ารหัสอักขระ ใครก็ถอดได้',
      'การใช้ Base64 เก็บรหัสผ่านจึงเท่ากับเก็บเป็นข้อความธรรมดา',
    ], { fill: CRIML, stroke: CRIM, color: CRIM, size: 12.5, lh: 19, weight: 600 })
);

F.webAttackSurface = svg(
  660,
  330,
  ARROWS +
    box(12, 50, 130, 70, ['เบราว์เซอร์', 'ของผู้โจมตี'], { fill: '#fff', stroke: INK, color: INK, size: 12.5, weight: 600, lh: 17 }) +
    line(148, 85, 200, 85, { m: 'ar' }) +
    box(206, 40, 150, 90, ['เว็บเซิร์ฟเวอร์', 'โค้ดแอปพลิเคชัน'], {
      fill: CRIML, stroke: CRIM, color: CRIM, size: 12.5, weight: 600, lh: 17,
    }) +
    line(362, 85, 414, 85, { m: 'ar' }) +
    box(420, 50, 130, 70, ['ฐานข้อมูล'], { fill: '#fff', stroke: TEAL, color: TEAL, size: 13, weight: 600 }) +
    box(560, 50, 88, 70, ['ระบบไฟล์', 'และ OS'], { fill: '#fff', stroke: GOLD, color: GOLD, size: 11.5, weight: 600, lh: 16 }) +
    line(362, 110, 556, 110, { m: 'ar', dash: '4 3' }) +
    t(330, 24, 'ช่องโหว่เว็บเกิดตรงไหนได้บ้าง', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    [
      ['ฝั่งผู้ใช้', 'XSS, CSRF, Clickjacking', 12, INK],
      ['ฝั่งแอปพลิเคชัน', 'IDOR, Auth Bypass, SSTI, Upload', 176, CRIM],
      ['ไปยังฐานข้อมูล', 'SQL Injection, NoSQL Injection', 340, TEAL],
      ['ไปยังระบบปฏิบัติการ', 'Command Injection, LFI, SSRF', 504, GOLD],
    ]
      .map(([zone, list, x, c]) =>
        box(x, 152, 144, 60, [zone], { fill: c, stroke: c, color: '#fff', size: 12.5, weight: 600 }) +
        t(x + 72, 230, list.split(', ').slice(0, 2).join(', '), { anchor: 'middle', size: 10.5, color: INK2 }) +
        t(x + 72, 246, list.split(', ').slice(2).join(', '), { anchor: 'middle', size: 10.5, color: INK2 })
      )
      .join('') +
    box(12, 264, 636, 58, [
      'รากของช่องโหว่เกือบทั้งหมดคือเรื่องเดียวกัน คือแอปพลิเคชันเชื่อข้อมูลที่ผู้ใช้ส่งมา',
      'ทุกอย่างที่มาจากฝั่งผู้ใช้ ไม่ว่าจะเป็นพารามิเตอร์ คุกกี้ ส่วนหัว หรือชื่อไฟล์ ล้วนแก้ไขได้ทั้งหมด',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, lh: 20, weight: 600 })
);

F.forensicsFlow = svg(
  660,
  300,
  ARROWS +
    t(330, 24, 'ลำดับการตรวจไฟล์ปริศนาในหมวด Forensics', {
      anchor: 'middle', size: 15, weight: 600, color: INK, display: true,
    }) +
    box(255, 40, 150, 40, ['ไฟล์ปริศนา'], { fill: INK, stroke: INK, color: '#fff', size: 13, weight: 600 }) +
    [
      ['file', 'ไฟล์นี้เป็นชนิดใดจริง', -10],
      ['strings', 'มีข้อความอ่านได้ไหม', 160],
      ['exiftool', 'ดู metadata', 330],
      ['binwalk', 'มีไฟล์ซ่อนข้างในไหม', 500],
    ]
      .map(([cmd, note, x], i) => {
        return (
          line(330, 82, x + 78, 118, { m: 'ar' }) +
          box(x + 8, 122, 140, 62, [note], { fill: '#fff', stroke: LINE, color: INK2, size: 11.5, lh: 16 }) +
          `<rect x="${x + 8}" y="122" width="140" height="26" rx="8" fill="${[CRIM, GOLD, TEAL, '#7B4B94'][i]}"/>` +
          t(x + 78, 140, cmd, { anchor: 'middle', color: '#fff', size: 12.5, weight: 700 })
        );
      })
      .join('') +
    box(12, 202, 636, 50, [
      'ถ้า binwalk พบไฟล์ซ่อน ให้ใช้ binwalk -e หรือ foremost แยกออกมา',
      'ถ้าเป็นภาพ ให้ลองเครื่องมือ steganography เช่น zsteg สำหรับ PNG และ steghide สำหรับ JPG',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, lh: 19, weight: 600 }) +
    box(12, 258, 636, 34, ['กฎเหล็กของหมวดนี้คือ ทำงานกับสำเนาเสมอ อย่าแก้ไขไฟล์ต้นฉบับที่เป็นหลักฐาน'], {
      fill: CRIML, stroke: CRIM, color: CRIM, size: 12.5, weight: 600,
    })
);

F.stego = svg(
  660,
  260,
  ARROWS +
    t(12, 22, 'การซ่อนข้อมูลในภาพด้วยเทคนิค LSB', { size: 15, weight: 600, color: INK, display: true }) +
    t(12, 48, 'พิกเซลปกติหนึ่งจุด สีแดง =', { size: 13, color: INK2 }) +
    (() => {
      const bits = ['1', '0', '1', '1', '0', '1', '0', '0'];
      return bits
        .map((b, i) =>
          `<rect x="${300 + i * 34}" y="34" width="30" height="30" rx="4" fill="${i === 7 ? GOLD : PAPER}" stroke="${i === 7 ? GOLD : LINE}"/>` +
          t(315 + i * 34, 54, b, { anchor: 'middle', size: 15, weight: 700, color: i === 7 ? '#fff' : INK, display: true })
        )
        .join('');
    })() +
    t(315 + 7 * 34, 82, 'บิตสุดท้าย', { anchor: 'middle', size: 10.5, color: GOLD, weight: 600 }) +
    t(12, 110, 'เปลี่ยนเฉพาะบิตสุดท้ายเพื่อซ่อนข้อมูล', { size: 13, color: INK2 }) +
    (() => {
      const bits = ['1', '0', '1', '1', '0', '1', '0', '1'];
      return bits
        .map((b, i) =>
          `<rect x="${300 + i * 34}" y="96" width="30" height="30" rx="4" fill="${i === 7 ? TEAL : PAPER}" stroke="${i === 7 ? TEAL : LINE}"/>` +
          t(315 + i * 34, 116, b, { anchor: 'middle', size: 15, weight: 700, color: i === 7 ? '#fff' : INK, display: true })
        )
        .join('');
    })() +
    t(315 + 7 * 34, 144, 'เปลี่ยนเป็น 1', { anchor: 'middle', size: 10.5, color: TEAL, weight: 600 }) +
    box(12, 158, 636, 44, [
      'ตาคนแทบมองไม่เห็นความต่างของสีที่เปลี่ยนไปเพียงบิตเดียว',
      'แต่ถ้ารวบรวมบิตสุดท้ายของทุกพิกเซลมาต่อกัน จะได้ข้อความที่ซ่อนไว้',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 19 }) +
    box(12, 208, 636, 42, ['เครื่องมือที่ใช้แกะ LSB คือ zsteg สำหรับ PNG และ BMP ส่วน steghide ใช้กับ JPG ที่ตั้งรหัสผ่านไว้'], {
      fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, weight: 600,
    })
);

F.revProcess = svg(
  660,
  280,
  ARROWS +
    t(12, 22, 'จากซอร์สโค้ดสู่ไฟล์รัน และการแกะย้อนกลับ', {
      size: 15, weight: 600, color: INK, display: true,
    }) +
    box(12, 40, 130, 44, ['ซอร์สโค้ด', 'ภาษา C'], { fill: '#fff', stroke: TEAL, color: TEAL, size: 12.5, weight: 600, lh: 16 }) +
    line(146, 62, 186, 62, { m: 'ar' }) +
    t(166, 52, 'compile', { anchor: 'middle', size: 10, color: INK3 }) +
    box(192, 40, 130, 44, ['ไฟล์รัน', 'binary'], { fill: INK, stroke: INK, color: '#fff', size: 12.5, weight: 600, lh: 16 }) +
    line(258, 90, 258, 118, { m: 'arc', color: CRIM }) +
    t(300, 108, 'disassemble / decompile', { size: 10.5, color: CRIM }) +
    box(192, 124, 130, 44, ['assembly', 'หรือ pseudo-code'], { fill: CRIML, stroke: CRIM, color: CRIM, size: 12, weight: 600, lh: 16 }) +
    t(12, 108, 'reverse', { size: 12, color: CRIM, weight: 600 }) +
    t(12, 126, 'engineering', { size: 12, color: CRIM, weight: 600 }) +
    box(12, 190, 636, 44, [
      'compile คือทางเดียว แปลงกลับเป๊ะไม่ได้ แต่ decompiler อย่าง Ghidra สร้างโค้ดที่ใกล้เคียงพอให้อ่านเข้าใจได้',
      'โจทย์ Reverse มักซ่อนเงื่อนไขตรวจธงไว้ในโค้ด ให้หาจุดที่โปรแกรมเทียบข้อความ',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 19 }) +
    t(12, 254, 'Pwnable ต่างจาก Reverse ตรงที่ต้องเจาะช่องโหว่ให้โปรแกรมทำงานผิดไปจากที่ตั้งใจ เช่น buffer overflow', {
      size: 12.5, color: GOLD, weight: 600,
    }) +
    box(360, 118, 180, 56, ['หาเงื่อนไขตรวจธง', 'เช่น strcmp กับค่าคงที่'], {
      fill: '#fff', stroke: GOLD, color: GOLD, size: 12, weight: 600, lh: 16,
    }) +
    line(322, 146, 356, 146, { m: 'arg', color: GOLD })
);

F.bufferOverflow = svg(
  660,
  270,
  ARROWS +
    t(12, 22, 'Buffer Overflow คืออะไร', { size: 15, weight: 600, color: INK, display: true }) +
    t(12, 48, 'สภาพปกติ บัฟเฟอร์รับข้อมูลได้พอดี', { size: 13, color: INK2 }) +
    (() => {
      const cells = [['buffer', TEAL], ['buffer', TEAL], ['buffer', TEAL], ['return addr', GOLD]];
      return cells
        .map(([label, c], i) =>
          `<rect x="${180 + i * 110}" y="58" width="104" height="34" rx="4" fill="${c}"/>` +
          t(232 + i * 110, 80, label, { anchor: 'middle', color: '#fff', size: 12, weight: 600 })
        )
        .join('');
    })() +
    t(12, 122, 'เมื่อป้อนข้อมูลยาวเกิน มันล้นไปทับ return address', { size: 13, color: CRIM }) +
    (() => {
      const cells = [['AAAA', CRIM], ['AAAA', CRIM], ['AAAA', CRIM], ['ที่อยู่ที่ผู้โจมตีกำหนด', '#8E1F17']];
      return cells
        .map(([label, c], i) =>
          `<rect x="${180 + i * 110}" y="132" width="104" height="34" rx="4" fill="${c}"/>` +
          t(232 + i * 110, 154, label.length > 10 ? label.slice(0, 9) + '…' : label, { anchor: 'middle', color: '#fff', size: 10.5, weight: 600 })
        )
        .join('');
    })() +
    box(12, 184, 636, 46, [
      'return address คือที่อยู่ที่โปรแกรมจะกระโดดไปทำงานต่อเมื่อฟังก์ชันจบ',
      'ถ้าผู้โจมตีเขียนทับค่านี้ได้ ก็บังคับให้โปรแกรมกระโดดไปรันโค้ดที่ต้องการได้',
    ], { fill: CRIML, stroke: CRIM, color: CRIM, size: 12.5, lh: 19, weight: 600 }) +
    box(12, 236, 636, 30, ['การป้องกันคือใช้ฟังก์ชันที่จำกัดความยาว และเปิด ASLR กับ Stack Canary ที่ระบบสมัยใหม่มีให้'], {
      fill: PAPER, stroke: LINE, color: INK2, size: 12.5,
    })
);

F.apkStructure = svg(
  660,
  290,
  ARROWS +
    box(255, 30, 150, 40, ['ไฟล์ app.apk'], { fill: INK, stroke: INK, color: '#fff', size: 13, weight: 600 }) +
    t(330, 90, 'จริง ๆ แล้วเป็นไฟล์ ZIP แตกออกดูได้', { anchor: 'middle', size: 12.5, color: INK3 }) +
    [
      ['AndroidManifest.xml', 'สิทธิ์ที่แอปขอ และหน้าจอเริ่มต้น', TEAL],
      ['classes.dex', 'โค้ดที่คอมไพล์แล้ว แกะด้วย jadx', CRIM],
      ['resources', 'รูป ข้อความ และค่าคงที่ มักมีความลับซ่อน', GOLD],
      ['lib', 'โค้ดเนทีฟภาษา C ถ้ามี', '#7B4B94'],
    ]
      .map(([name, note, c], i) => {
        const y = 108 + i * 42;
        return (
          line(330, 74, 90, y + 18, { m: 'ar', arrow: i === 0, dash: '3 3' }) +
          box(90, y, 200, 34, [name], { fill: '#fff', stroke: c, color: c, size: 12, weight: 600 }) +
          t(300, y + 21, note, { size: 11.5, color: INK2 })
        );
      })
      .join('') +
    t(12, 24, 'โครงสร้างภายในไฟล์ APK', { size: 15, weight: 600, color: INK, display: true }) +
    box(12, 284, 636, 0, [], { fill: 'none', stroke: 'none' })
);

/* ══════════════ CS-610 Web Application Security ══════════════ */

F.httpAnatomy = svg(
  660,
  330,
  ARROWS +
    t(12, 22, 'โครงสร้างของ HTTP Request และ Response', {
      size: 15, weight: 600, color: INK, display: true,
    }) +
    box(12, 34, 316, 150, [], { fill: '#fff', stroke: CRIM }) +
    `<rect x="12" y="34" width="316" height="26" rx="9" fill="${CRIM}"/>` +
    t(170, 52, 'Request จากเบราว์เซอร์', { anchor: 'middle', color: '#fff', size: 13, weight: 600 }) +
    t(24, 80, 'GET /search?q=test HTTP/1.1', { size: 11, color: INK, weight: 600 }) +
    t(24, 98, 'Host: example.com', { size: 11, color: INK2 }) +
    t(24, 114, 'Cookie: session=abc123', { size: 11, color: GOLD, weight: 600 }) +
    t(24, 130, 'User-Agent: Mozilla/5.0', { size: 11, color: INK2 }) +
    t(24, 154, '(บรรทัดว่าง แล้วตามด้วย body ถ้ามี)', { size: 10.5, color: INK3 }) +
    box(344, 34, 304, 150, [], { fill: '#fff', stroke: TEAL }) +
    `<rect x="344" y="34" width="304" height="26" rx="9" fill="${TEAL}"/>` +
    t(496, 52, 'Response จากเซิร์ฟเวอร์', { anchor: 'middle', color: '#fff', size: 13, weight: 600 }) +
    t(356, 80, 'HTTP/1.1 200 OK', { size: 11, color: INK, weight: 600 }) +
    t(356, 98, 'Content-Type: text/html', { size: 11, color: INK2 }) +
    t(356, 114, 'Set-Cookie: session=abc123', { size: 11, color: GOLD, weight: 600 }) +
    t(356, 138, '<html>...เนื้อหาหน้าเว็บ...</html>', { size: 11, color: INK2 }) +
    box(12, 198, 636, 56, [
      'ทุกส่วนของ request แก้ไขได้ทั้งหมด ทั้ง path พารามิเตอร์ คุกกี้ และส่วนหัว',
      'เบราว์เซอร์แค่ช่วยสร้าง request ให้สะดวก แต่ผู้โจมตีส่ง request ที่แก้เองด้วย curl หรือ Burp ได้',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, lh: 19, weight: 600 }) +
    (() => {
      const codes = [['2xx', 'สำเร็จ', TEAL], ['3xx', 'เปลี่ยนเส้นทาง', INK3], ['4xx', 'ผู้ใช้ผิด', GOLD], ['5xx', 'เซิร์ฟเวอร์ผิด', CRIM]];
      return codes
        .map(([c, d, col], i) =>
          `<rect x="${12 + i * 160}" y="266" width="150" height="50" rx="8" fill="#fff" stroke="${col}"/>` +
          t(87 + i * 160, 288, c, { anchor: 'middle', size: 15, weight: 700, color: col, display: true }) +
          t(87 + i * 160, 306, d, { anchor: 'middle', size: 11.5, color: INK2 })
        )
        .join('');
    })()
);

F.sqliTypes = svg(
  660,
  300,
  ARROWS +
    t(330, 24, 'สี่ชนิดของ SQL Injection แยกตามวิธีเห็นผลลัพธ์', {
      anchor: 'middle', size: 15, weight: 600, color: INK, display: true,
    }) +
    [
      ['In-band (UNION)', 'ผลลัพธ์แสดงบนหน้าเว็บโดยตรง', 'ง่ายที่สุด ใช้ UNION SELECT ดึงข้อมูลมาแสดง', TEAL],
      ['Error-based', 'บังคับให้เกิด error ที่มีข้อมูลปนมา', 'อ่านข้อมูลจากข้อความ error ที่เซิร์ฟเวอร์คืนมา', GOLD],
      ['Blind Boolean', 'หน้าเว็บเปลี่ยนตามจริงหรือเท็จ', 'ถามทีละบิต จริงหน้าปกติ เท็จหน้าต่าง', CRIM],
      ['Blind Time-based', 'วัดจากเวลาตอบสนอง', 'สั่งให้หน่วงเวลาถ้าเงื่อนไขจริง ช้าสุดแต่ใช้ได้เสมอ', '#7B4B94'],
    ]
      .map(([name, how, note, c], i) => {
        const y = 40 + i * 62;
        return (
          box(12, y, 176, 54, [name], { fill: c, stroke: c, color: '#fff', size: 13, weight: 600 }) +
          t(204, y + 22, how, { size: 12.5, color: INK, weight: 600 }) +
          t(204, y + 42, note, { size: 11.5, color: INK3 })
        );
      })
      .join('') +
    box(12, 290, 636, 0, [], { fill: 'none', stroke: 'none' })
);

F.xssFlow = svg(
  660,
  290,
  ARROWS +
    t(12, 22, 'Stored XSS ทำงานอย่างไร', { size: 15, weight: 600, color: INK, display: true }) +
    box(12, 44, 130, 56, ['ผู้โจมตี', 'ฝังสคริปต์'], { fill: CRIML, stroke: CRIM, color: CRIM, size: 12.5, weight: 600, lh: 17 }) +
    line(146, 72, 210, 72, { m: 'arc', color: CRIM }) +
    t(178, 62, 'โพสต์คอมเมนต์', { anchor: 'middle', size: 10, color: INK3 }) +
    box(216, 44, 150, 56, ['เซิร์ฟเวอร์', 'เก็บสคริปต์ไว้'], { fill: INK, stroke: INK, color: '#fff', size: 12.5, weight: 600, lh: 17 }) +
    line(300, 106, 300, 140, { arrow: false, color: LINE }) +
    box(216, 144, 150, 50, ['ฐานข้อมูล'], { fill: '#fff', stroke: LINE, color: INK2, size: 12.5 }) +
    box(430, 44, 130, 56, ['เหยื่อ', 'เปิดหน้าเว็บ'], { fill: TEALL, stroke: TEAL, color: TEAL, size: 12.5, weight: 600, lh: 17 }) +
    line(430, 72, 372, 72, { m: 'art', color: TEAL }) +
    t(400, 62, 'ขอหน้า', { anchor: 'middle', size: 10, color: INK3 }) +
    line(372, 90, 430, 90, { m: 'arc', color: CRIM }) +
    t(400, 108, 'ส่งสคริปต์กลับ', { anchor: 'middle', size: 10, color: CRIM }) +
    line(560, 72, 610, 72, { m: 'arc', color: CRIM }) +
    box(586, 44, 62, 56, ['สคริปต์', 'ทำงาน'], { fill: CRIML, stroke: CRIM, color: CRIM, size: 11, weight: 600, lh: 15 }) +
    box(12, 210, 636, 44, [
      'จุดที่อันตรายคือ เหยื่อทุกคนที่เปิดหน้านั้นจะโดนสคริปต์ทำงานในเบราว์เซอร์ของตน',
      'มักใช้ขโมยคุกกี้เซสชันแล้วส่งไปยังเซิร์ฟเวอร์ของผู้โจมตี ทำให้สวมรอยเป็นเหยื่อได้',
    ], { fill: CRIML, stroke: CRIM, color: CRIM, size: 12.5, lh: 19, weight: 600 }) +
    box(12, 260, 636, 30, ['ป้องกันด้วย output encoding ก่อนแสดงผล ตั้ง HttpOnly ที่คุกกี้ และใช้ Content Security Policy'], {
      fill: PAPER, stroke: LINE, color: INK2, size: 12.5,
    })
);

F.authFlow = svg(
  660,
  300,
  ARROWS +
    t(12, 22, 'ความต่างของ Authentication กับ Authorization', {
      size: 15, weight: 600, color: INK, display: true,
    }) +
    box(12, 38, 312, 110, [], { fill: '#fff', stroke: TEAL, sw: 2 }) +
    `<rect x="12" y="38" width="312" height="28" rx="9" fill="${TEAL}"/>` +
    t(168, 57, 'Authentication — คุณคือใคร', { anchor: 'middle', color: '#fff', size: 13, weight: 600 }) +
    t(28, 86, 'ตรวจว่าเป็นเจ้าของบัญชีจริงไหม', { size: 12, color: INK }) +
    t(28, 106, 'ช่องโหว่: เดารหัสผ่าน, เลี่ยงล็อกอิน,', { size: 11.5, color: CRIM }) +
    t(28, 122, 'session ที่คาดเดาได้, JWT ที่ไม่ตรวจ signature', { size: 11.5, color: CRIM }) +
    box(344, 38, 304, 110, [], { fill: '#fff', stroke: GOLD, sw: 2 }) +
    `<rect x="344" y="38" width="304" height="28" rx="9" fill="${GOLD}"/>` +
    t(496, 57, 'Authorization — คุณทำอะไรได้', { anchor: 'middle', color: '#fff', size: 13, weight: 600 }) +
    t(360, 86, 'ตรวจว่ามีสิทธิ์เข้าถึงสิ่งนั้นไหม', { size: 12, color: INK }) +
    t(360, 106, 'ช่องโหว่: IDOR, การเลี่ยงสิทธิ์,', { size: 11.5, color: CRIM }) +
    t(360, 122, 'เข้าหน้า admin โดยไม่มีสิทธิ์', { size: 11.5, color: CRIM }) +
    box(12, 164, 636, 50, [
      'ลำดับที่ถูกคือ ยืนยันตัวตนก่อน แล้วจึงตรวจสิทธิ์ทุกครั้งที่เข้าถึงข้อมูล',
      'ช่องโหว่ที่พบบ่อยคือ ยืนยันตัวตนแล้วแต่ลืมตรวจสิทธิ์ ทำให้ใครที่ล็อกอินก็เข้าถึงข้อมูลของคนอื่นได้',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, lh: 19, weight: 600 }) +
    box(12, 222, 636, 68, [
      'การจัดการ session มีสองแบบหลัก',
      'แบบ 1 เก็บ session id ในคุกกี้ แล้วเซิร์ฟเวอร์จำสถานะไว้ ต้องสุ่ม id ให้เดาไม่ได้',
      'แบบ 2 ใช้ JWT ที่เก็บข้อมูลไว้ในตัว token เอง เซิร์ฟเวอร์ต้องตรวจ signature ทุกครั้ง ห้ามรับ alg none',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 20 })
);

F.owaspTop = svg(
  660,
  340,
  ARROWS +
    t(330, 24, 'ช่องโหว่เว็บที่พบบ่อยและควรรู้จัก', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    [
      ['Broken Access Control', 'เข้าถึงสิ่งที่ไม่ควรได้ เช่น IDOR'],
      ['Injection', 'SQL, Command, NoSQL injection'],
      ['Cryptographic Failures', 'เก็บหรือส่งข้อมูลลับแบบไม่ปลอดภัย'],
      ['Security Misconfiguration', 'ตั้งค่าผิด เปิด debug ทิ้งไว้'],
      ['SSRF', 'หลอกเซิร์ฟเวอร์ให้ยิงคำขอแทนเรา'],
      ['Vulnerable Components', 'ใช้ไลบรารีเก่าที่มีช่องโหว่'],
    ]
      .map(([name, note], i) => {
        const y = 40 + i * 46;
        return (
          `<rect x="12" y="${y}" width="30" height="30" rx="6" fill="${INK}"/>` +
          t(27, y + 20, String(i + 1), { anchor: 'middle', color: GOLD, size: 15, weight: 700, display: true }) +
          t(54, y + 14, name, { size: 13.5, weight: 600, color: INK }) +
          t(54, y + 31, note, { size: 11.5, color: INK3 })
        );
      })
      .join('') +
    box(12, 318, 636, 0, [], { fill: 'none', stroke: 'none' }) +
    t(12, 330, 'อ้างอิงแนวทาง OWASP ซึ่งรวบรวมช่องโหว่เว็บที่พบบ่อยที่สุดไว้เป็นมาตรฐานสากล', {
      size: 12, color: INK3,
    })
);

/* ══════════════ CS-611 Cryptography ══════════════ */

F.cryptoMap = svg(
  660,
  330,
  ARROWS +
    t(330, 24, 'แผนที่ของวิทยาการเข้ารหัส', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    box(255, 38, 150, 36, ['Cryptography'], { fill: INK, stroke: INK, color: '#fff', size: 14, weight: 700, display: true }) +
    [
      ['Encoding', 'ไม่ใช่การเข้ารหัสลับ', 'Base64, Hex, URL', INK3, 20],
      ['Symmetric', 'กุญแจเดียว', 'AES, DES, XOR', TEAL, 190],
      ['Asymmetric', 'กุญแจคู่', 'RSA, ECC', GOLD, 360],
      ['Hashing', 'ทางเดียว', 'MD5, SHA, bcrypt', CRIM, 510],
    ]
      .map(([name, sub, ex, c, x]) => {
        return (
          line(330, 78, x + 70, 104, { m: 'ar' }) +
          box(x, 108, 140, 74, [], { fill: '#fff', stroke: c, sw: 2 }) +
          `<rect x="${x}" y="108" width="140" height="26" rx="8" fill="${c}"/>` +
          t(x + 70, 126, name, { anchor: 'middle', color: '#fff', size: 13, weight: 700, display: true }) +
          t(x + 70, 152, sub, { anchor: 'middle', size: 11.5, color: INK2, weight: 600 }) +
          t(x + 70, 170, ex, { anchor: 'middle', size: 10.5, color: INK3 })
        );
      })
      .join('') +
    box(12, 200, 636, 52, [
      'ในการแข่ง CTF ทักษะที่สำคัญที่สุดไม่ใช่การจำอัลกอริทึม',
      'แต่คือการจำแนกว่าข้อความที่เห็นเป็นประเภทใดในสี่กลุ่มนี้ แล้วจึงเลือกวิธีถอดที่เหมาะสม',
    ], { fill: PAPER, stroke: LINE, color: INK, size: 12.5, lh: 20, weight: 600 }) +
    box(12, 258, 636, 60, [
      'ลำดับความยากของโจทย์ Crypto',
      'ง่าย: encoding ชั้นเดียวหรือหลายชั้น และรหัสคลาสสิก',
      'ยาก: ช่องโหว่ในการใช้งาน RSA หรือ AES เช่น เลือกพารามิเตอร์ผิด',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, lh: 19 })
);

F.xorMechanics = svg(
  660,
  260,
  ARROWS +
    t(12, 22, 'XOR ทำงานอย่างไร และทำไมถอดกลับได้', { size: 15, weight: 600, color: INK, display: true }) +
    (() => {
      const rows = [
        ['A', '0', '1', '1', '0'],
        ['กุญแจ K', '1', '1', '0', '0'],
        ['A xor K', '1', '0', '1', '0'],
      ];
      let o = '';
      rows.forEach((r, ri) => {
        const y = 42 + ri * 40;
        const c = ri === 2 ? GOLD : ri === 1 ? TEAL : INK;
        o += t(20, y + 22, r[0], { size: 13, weight: 600, color: c });
        for (let i = 1; i < 5; i++) {
          o += `<rect x="${140 + (i - 1) * 44}" y="${y}" width="38" height="32" rx="5" fill="${ri === 2 ? GOLDL : '#fff'}" stroke="${c}"/>`;
          o += t(159 + (i - 1) * 44, y + 21, r[i], { anchor: 'middle', size: 15, weight: 700, color: c, display: true });
        }
      });
      return o;
    })() +
    t(340, 84, 'เหมือนกัน = 0  ต่างกัน = 1', { size: 12.5, color: INK2 }) +
    box(340, 108, 308, 56, [
      'ถ้านำผลลัพธ์ A xor K มา xor กับ K อีกครั้ง',
      'จะได้ A กลับคืนมา นี่คือเหตุผลที่ถอดกลับได้',
    ], { fill: TEALL, stroke: TEAL, color: '#0E5F58', size: 12, lh: 18 }) +
    box(12, 178, 636, 72, [
      'ในโจทย์ CTF การหากุญแจ XOR ทำได้หลายวิธี',
      'ถ้ารู้ส่วนหนึ่งของข้อความเดิม เช่น รู้ว่าขึ้นต้นด้วย STDiO ให้ xor กับข้อความเข้ารหัสจะได้กุญแจ',
      'ถ้ากุญแจเป็นไบต์เดียว ให้ลองครบทั้ง 256 ค่า เรียกว่า brute force แล้วดูว่าค่าไหนอ่านออก',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 20 })
);

F.rsaFlow = svg(
  660,
  310,
  ARROWS +
    t(12, 22, 'RSA ทำงานอย่างไร และช่องโหว่ในโจทย์ CTF', {
      size: 15, weight: 600, color: INK, display: true,
    }) +
    box(12, 40, 200, 90, ['สร้างกุญแจ', 'เลือกจำนวนเฉพาะ p, q', 'n = p × q', 'กุญแจสาธารณะคือ (n, e)'], {
      fill: '#fff', stroke: GOLD, color: INK2, size: 11.5, lh: 17,
    }) +
    line(216, 85, 256, 85, { m: 'ar' }) +
    box(262, 40, 180, 90, ['เข้ารหัส', 'c = m^e mod n', 'ใช้กุญแจสาธารณะ'], {
      fill: TEALL, stroke: TEAL, color: TEAL, size: 12, weight: 600, lh: 18,
    }) +
    line(446, 85, 486, 85, { m: 'ar' }) +
    box(492, 40, 156, 90, ['ถอดรหัส', 'm = c^d mod n', 'ใช้กุญแจส่วนตัว d'], {
      fill: '#fff', stroke: INK, color: INK2, size: 12, weight: 600, lh: 18,
    }) +
    t(12, 156, 'ความปลอดภัยอยู่ที่การแยกตัวประกอบ n กลับเป็น p กับ q ซึ่งยากมากเมื่อ n ใหญ่', {
      size: 12.5, color: INK2,
    }) +
    box(12, 172, 636, 78, [
      'ช่องโหว่ที่พบบ่อยในโจทย์ CTF',
      'n เล็กเกินไป: แยกตัวประกอบได้ด้วยเครื่องมือหรือฐานข้อมูลออนไลน์',
      'e เล็กมาก เช่น e=3 กับข้อความสั้น: ถอดรากที่สามได้ตรง ๆ',
      'ใช้ p หรือ q ซ้ำระหว่างกุญแจสองอัน: หา GCD ได้ตัวประกอบร่วมทันที',
    ], { fill: CRIML, stroke: CRIM, color: CRIM, size: 12, lh: 19, weight: 600 }) +
    box(12, 256, 636, 46, [
      'เครื่องมือหลักคือ Python ไลบรารี PyCryptodome และ SageMath',
      'เว็บ factordb.com เก็บผลการแยกตัวประกอบของ n ที่รู้จักไว้แล้ว ลองค้นก่อนเสมอ',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 19 })
);

F.aesModes = svg(
  660,
  280,
  ARROWS +
    t(12, 22, 'AES โหมด ECB มีจุดอ่อนที่มองเห็นได้', { size: 15, weight: 600, color: INK, display: true }) +
    t(12, 48, 'ECB เข้ารหัสแต่ละบล็อกแยกกัน บล็อกที่เหมือนกันให้ผลเหมือนกัน', { size: 12.5, color: INK2 }) +
    (() => {
      // จำลองภาพที่เข้ารหัสด้วย ECB ยังเห็นรูปเดิม
      let o = '';
      const pattern = [
        '11111',
        '10001',
        '10001',
        '11111',
        '10000',
      ];
      pattern.forEach((row, r) => {
        [...row].forEach((cell, c) => {
          const on = cell === '1';
          o += `<rect x="${30 + c * 22}" y="${72 + r * 22}" width="20" height="20" fill="${on ? INK : '#E8EDF2'}"/>`;
        });
      });
      o += t(85, 200, 'ต้นฉบับ', { anchor: 'middle', size: 11.5, color: INK3 });
      // ECB ยังเห็นรูป
      pattern.forEach((row, r) => {
        [...row].forEach((cell, c) => {
          const on = cell === '1';
          o += `<rect x="${190 + c * 22}" y="${72 + r * 22}" width="20" height="20" fill="${on ? '#6B4E9E' : '#D8CCEC'}"/>`;
        });
      });
      o += t(245, 200, 'ECB ยังเห็นรูป', { anchor: 'middle', size: 11.5, color: CRIM, weight: 600 });
      // CBC เป็น noise
      for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++)
        o += `<rect x="${350 + c * 22}" y="${72 + r * 22}" width="20" height="20" fill="${['#147D74','#B8860F','#0F2338','#A8342A','#35506D'][(r*5+c)%5]}"/>`;
      o += t(405, 200, 'CBC เป็นสัญญาณรบกวน', { anchor: 'middle', size: 11.5, color: TEAL, weight: 600 });
      return o;
    })() +
    box(12, 216, 636, 58, [
      'บทเรียน: อย่าใช้โหมด ECB เพราะรูปแบบข้อมูลเดิมยังปรากฏในผลลัพธ์',
      'โจทย์ CTF ที่ให้ไฟล์ภาพเข้ารหัสแล้วยังเห็นเค้าโครงรูป มักเป็นสัญญาณว่าใช้ ECB',
      'ควรใช้โหมดที่มี IV เช่น CBC หรือ GCM ที่ทำให้บล็อกเดิมให้ผลต่างกัน',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12, lh: 19, weight: 600 })
);

F.freqAnalysis = svg(
  660,
  270,
  ARROWS +
    t(12, 22, 'การวิเคราะห์ความถี่ถอดรหัสแทนที่ได้', { size: 15, weight: 600, color: INK, display: true }) +
    t(12, 46, 'ความถี่ตัวอักษรในภาษาอังกฤษ เรียงจากมากไปน้อย', { size: 12, color: INK2 }) +
    (() => {
      const freq = [['E', 90], ['T', 66], ['A', 60], ['O', 56], ['I', 51], ['N', 50], ['S', 46], ['R', 44]];
      return freq
        .map(([ch, h_], i) => {
          const x = 30 + i * 76;
          return (
            `<rect x="${x}" y="${170 - h_}" width="50" height="${h_}" rx="4" fill="${GOLD}"/>` +
            t(x + 25, 186, ch, { anchor: 'middle', size: 14, weight: 700, color: INK, display: true })
          );
        })
        .join('');
    })() +
    box(12, 200, 636, 62, [
      'รหัสแทนที่ทุกแบบมีจุดอ่อนเดียวกัน คือตัวอักษรที่พบบ่อยในภาษาต้นฉบับ',
      'จะยังพบบ่อยในข้อความที่เข้ารหัส นับความถี่แล้วจับคู่กับลำดับนี้จึงเริ่มถอดได้',
      'เครื่องมือ quipqiup ทำการวิเคราะห์ความถี่ให้อัตโนมัติ เหมาะกับข้อความยาว',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 20 })
);

/* ══════════════ CS-612 Digital Forensics ══════════════ */

F.forensicsMap = svg(
  660,
  320,
  ARROWS +
    t(330, 24, 'ขอบเขตของ Digital Forensics ในการแข่ง', {
      anchor: 'middle', size: 15, weight: 600, color: INK, display: true,
    }) +
    box(255, 38, 150, 36, ['หลักฐานดิจิทัล'], { fill: INK, stroke: INK, color: '#fff', size: 13, weight: 700, display: true }) +
    [
      ['File Analysis', 'แกะไฟล์', 'binwalk, foremost', TEAL, 20],
      ['Steganography', 'ซ่อนในสื่อ', 'zsteg, steghide', GOLD, 190],
      ['Memory', 'ดัมป์หน่วยความจำ', 'Volatility', CRIM, 360],
      ['Disk & Log', 'ดิสก์และบันทึก', 'Autopsy, grep', '#7B4B94', 510],
    ]
      .map(([name, sub, tool, c, x]) => {
        return (
          line(330, 78, x + 70, 104, { m: 'ar' }) +
          box(x, 108, 140, 76, [], { fill: '#fff', stroke: c, sw: 2 }) +
          `<rect x="${x}" y="108" width="140" height="26" rx="8" fill="${c}"/>` +
          t(x + 70, 126, name, { anchor: 'middle', color: '#fff', size: 12.5, weight: 700, display: true }) +
          t(x + 70, 152, sub, { anchor: 'middle', size: 11.5, color: INK2, weight: 600 }) +
          t(x + 70, 172, tool, { anchor: 'middle', size: 10, color: INK3 })
        );
      })
      .join('') +
    box(12, 202, 636, 46, [
      'กฎเหล็กสองข้อของหมวดนี้ คือ ทำงานกับสำเนาเสมอ และทำทีละขั้นอย่างเป็นระบบ',
      'อย่าข้ามขั้น เพราะเบาะแสมักอยู่ในขั้นที่ดูธรรมดาที่สุด',
    ], { fill: CRIML, stroke: CRIM, color: CRIM, size: 12.5, lh: 19, weight: 600 }) +
    box(12, 254, 636, 58, [
      'ลำดับที่ควรทำเสมอ',
      'ขั้นแรก: file แล้ว strings แล้ว exiftool กับทุกไฟล์',
      'ขั้นสอง: binwalk หาไฟล์ซ่อน แล้วจึงลงเครื่องมือเฉพาะทางตามชนิดไฟล์',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, lh: 19 })
);

F.fileStructure = svg(
  660,
  290,
  ARROWS +
    t(12, 22, 'โครงสร้างของไฟล์และ magic bytes', { size: 15, weight: 600, color: INK, display: true }) +
    box(12, 40, 636, 60, [], { fill: PAPER, stroke: LINE }) +
    box(20, 52, 130, 36, ['magic bytes', 'ต้นไฟล์'], { fill: CRIM, stroke: CRIM, color: '#fff', size: 11, weight: 600, lh: 15 }) +
    box(158, 52, 300, 36, ['เนื้อหาไฟล์'], { fill: TEAL, stroke: TEAL, color: '#fff', size: 12, weight: 600 }) +
    box(466, 52, 174, 36, ['footer / trailer', 'ท้ายไฟล์ (บางชนิด)'], { fill: GOLD, stroke: GOLD, color: '#fff', size: 10.5, weight: 600, lh: 14 }) +
    t(12, 124, 'magic bytes ที่ควรจำ', { size: 13.5, weight: 600, color: INK, display: true }) +
    (() => {
      const sigs = [
        ['89 50 4E 47', 'PNG'], ['FF D8 FF', 'JPG'], ['50 4B 03 04', 'ZIP / APK / DOCX'],
        ['25 50 44 46', 'PDF'], ['7F 45 4C 46', 'ELF (ไฟล์รัน Linux)'], ['1F 8B', 'GZIP'],
      ];
      return sigs
        .map(([hex, name], i) => {
          const x = 12 + (i % 3) * 216;
          const y = 138 + Math.floor(i / 3) * 40;
          return (
            `<rect x="${x}" y="${y}" width="130" height="30" rx="5" fill="#fff" stroke="${INK}"/>` +
            t(x + 65, y + 20, hex, { anchor: 'middle', size: 11, color: INK, weight: 600 }) +
            t(x + 150, y + 20, name, { size: 11.5, color: INK2 })
          );
        })
        .join('');
    })() +
    box(12, 228, 636, 54, [
      'คำสั่ง file อ่าน magic bytes จึงบอกชนิดไฟล์จริงได้แม้นามสกุลจะโกหก',
      'การซ่อนไฟล์ ZIP ต่อท้ายไฟล์ PNG เป็นกลลวงยอดฮิต binwalk จะเห็น PK magic ที่กลางไฟล์',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 20 })
);

F.stegoLayers = svg(
  660,
  300,
  ARROWS +
    t(12, 22, 'ที่ซ่อนข้อมูลในไฟล์ภาพและเสียง', { size: 15, weight: 600, color: INK, display: true }) +
    [
      ['metadata', 'ในส่วน EXIF ของภาพ', 'exiftool', TEAL],
      ['LSB', 'บิตสุดท้ายของแต่ละพิกเซล', 'zsteg (PNG), stegsolve', GOLD],
      ['ต่อท้ายไฟล์', 'ข้อมูลแนบหลังจุดจบไฟล์จริง', 'binwalk, foremost', CRIM],
      ['ชั้นสีและช่อง', 'ซ่อนในชั้นสีใดชั้นหนึ่ง', 'stegsolve เปิดทีละชั้น', '#7B4B94'],
      ['spectrogram', 'เป็นรูปในภาพความถี่เสียง', 'Audacity, Sonic Visualiser', '#0E6E6E'],
    ]
      .map(([name, where, tool, c], i) => {
        const y = 40 + i * 44;
        return (
          box(12, y, 130, 36, [name], { fill: c, stroke: c, color: '#fff', size: 12.5, weight: 600 }) +
          t(156, y + 15, where, { size: 12, color: INK }) +
          t(156, y + 31, 'เครื่องมือ: ' + tool, { size: 11, color: INK3 })
        );
      })
      .join('') +
    box(12, 266, 636, 30, ['เมื่อได้ไฟล์ภาพหรือเสียงในหมวด Forensics ให้ไล่ตรวจทั้งห้าที่นี้ตามลำดับ'], {
      fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, weight: 600,
    })
);

F.memoryForensics = svg(
  660,
  280,
  ARROWS +
    t(12, 22, 'การวิเคราะห์ดัมป์หน่วยความจำด้วย Volatility', {
      size: 15, weight: 600, color: INK, display: true,
    }) +
    box(12, 42, 150, 50, ['memory dump', 'ไฟล์ .raw / .mem'], { fill: INK, stroke: INK, color: '#fff', size: 12, weight: 600, lh: 16 }) +
    line(166, 67, 206, 67, { m: 'ar' }) +
    box(212, 42, 130, 50, ['หา profile', 'imageinfo'], { fill: GOLD, stroke: GOLD, color: '#fff', size: 12, weight: 600, lh: 16 }) +
    line(346, 67, 386, 67, { m: 'ar' }) +
    box(392, 42, 256, 50, ['วิเคราะห์ตาม plugin'], { fill: TEAL, stroke: TEAL, color: '#fff', size: 12.5, weight: 600 }) +
    t(12, 116, 'plugin ที่ใช้บ่อย', { size: 13.5, weight: 600, color: INK, display: true }) +
    [
      ['pslist / pstree', 'ดูโปรเซสที่กำลังทำงานตอนดัมป์'],
      ['cmdline', 'ดูคำสั่งที่แต่ละโปรเซสถูกเรียก'],
      ['filescan / dumpfiles', 'หาและดึงไฟล์ที่อยู่ในหน่วยความจำ'],
      ['netscan', 'ดูการเชื่อมต่อเครือข่าย'],
      ['hashdump', 'ดึงค่าแฮชรหัสผ่านของผู้ใช้'],
    ]
      .map(([p, d], i) =>
        `<rect x="12" y="${132 + i * 26}" width="170" height="22" rx="5" fill="${PAPER}"/>` +
        t(97, 147 + i * 26, p, { anchor: 'middle', size: 11, color: INK, weight: 600 }) +
        t(194, 147 + i * 26, d, { size: 11.5, color: INK2 })
      )
      .join('') +
    box(12, 268, 636, 0, [], { fill: 'none', stroke: 'none' })
);

F.forensicsTimeline = svg(
  660,
  240,
  ARROWS +
    t(12, 22, 'การสร้างเส้นเวลาจากบันทึกเหตุการณ์', {
      size: 15, weight: 600, color: INK, display: true,
    }) +
    `<path d="M40 90 L620 90" stroke="${LINE}" stroke-width="3"/>` +
    [
      [90, 'ล็อกอิน', TEAL, 'auth.log'],
      [230, 'ดาวน์โหลดไฟล์', GOLD, 'access.log'],
      [370, 'รันคำสั่งผิดปกติ', CRIM, 'bash_history'],
      [510, 'ส่งข้อมูลออก', '#8E1F17', 'firewall.log'],
    ]
      .map(([x, label, c, src]) =>
        `<circle cx="${x}" cy="90" r="10" fill="${c}"/>` +
        t(x, 68, label, { anchor: 'middle', size: 12, weight: 600, color: c }) +
        t(x, 116, src, { anchor: 'middle', size: 10.5, color: INK3 })
      )
      .join('') +
    box(12, 140, 636, 90, [
      'หัวใจของการสืบสวนคือเรียงเหตุการณ์จากหลายแหล่งบันทึกให้เป็นเส้นเวลาเดียว',
      'เพื่อตอบว่า ใคร ทำอะไร เมื่อไร และผลเป็นอย่างไร',
      'ในโจทย์ CTF ธงมักซ่อนอยู่ในบรรทัดที่ผิดปกติจากบันทึก เช่น คำสั่งแปลก ๆ ใน bash_history',
      'หรือ URL ที่ถูกเข้ารหัสอักขระใน access.log ตามที่เรียนในหมวด CS-601',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 20 })
);

/* ══════════════ CS-613 Reverse Engineering และ Pwnable ══════════════ */

F.revMap = svg(
  660,
  300,
  ARROWS +
    t(330, 24, 'สองด้านของหมวดนี้', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    box(30, 44, 280, 120, [], { fill: '#fff', stroke: TEAL, sw: 2 }) +
    `<rect x="30" y="44" width="280" height="30" rx="9" fill="${TEAL}"/>` +
    t(170, 64, 'Reverse Engineering', { anchor: 'middle', color: '#fff', size: 14, weight: 700, display: true }) +
    t(48, 94, 'แกะว่าโปรแกรมทำงานอย่างไร', { size: 12.5, color: INK }) +
    t(48, 114, 'โดยไม่มีซอร์สโค้ด', { size: 12.5, color: INK2 }) +
    t(48, 138, 'มักหาจุดที่โปรแกรมเทียบธง', { size: 12, color: INK3 }) +
    t(48, 156, 'เครื่องมือ: Ghidra, gdb, strings', { size: 11.5, color: INK3 }) +
    box(350, 44, 280, 120, [], { fill: '#fff', stroke: CRIM, sw: 2 }) +
    `<rect x="350" y="44" width="280" height="30" rx="9" fill="${CRIM}"/>` +
    t(490, 64, 'Pwnable', { anchor: 'middle', color: '#fff', size: 14, weight: 700, display: true }) +
    t(368, 94, 'หาช่องโหว่แล้วทำให้โปรแกรม', { size: 12.5, color: INK }) +
    t(368, 114, 'ทำงานผิดจากที่ตั้งใจ', { size: 12.5, color: INK2 }) +
    t(368, 138, 'มักได้สิทธิ์รันคำสั่งบนเครื่อง', { size: 12, color: INK3 }) +
    t(368, 156, 'เครื่องมือ: gdb+pwndbg, pwntools', { size: 11.5, color: INK3 }) +
    box(12, 180, 636, 46, [
      'ทั้งสองใช้พื้นฐานร่วมกัน คือเข้าใจว่าโปรแกรมทำงานในระดับล่างอย่างไร',
      'Reverse เน้นอ่านและเข้าใจ ส่วน Pwn เน้นหาจุดอ่อนแล้วใช้ประโยชน์',
    ], { fill: PAPER, stroke: LINE, color: INK, size: 12.5, lh: 19, weight: 600 }) +
    box(12, 232, 636, 60, [
      'กฎทองของ Reverse ระดับต้น',
      'ลอง strings และ ltrace ก่อนเปิด Ghidra เสมอ',
      'เพราะธงหรือรหัสที่โปรแกรมเทียบ มักโผล่มาโดยไม่ต้องอ่าน assembly เลย',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, lh: 19 })
);

F.compilePipeline = svg(
  660,
  260,
  ARROWS +
    t(12, 22, 'จากซอร์สโค้ดสู่ไฟล์รัน และการแกะย้อนกลับ', {
      size: 15, weight: 600, color: INK, display: true,
    }) +
    box(12, 44, 120, 44, ['ซอร์ส .c'], { fill: TEAL, stroke: TEAL, color: '#fff', size: 12.5, weight: 600 }) +
    line(136, 66, 172, 66, { m: 'ar' }) +
    box(178, 44, 120, 44, ['assembly'], { fill: '#fff', stroke: LINE, color: INK2, size: 12.5 }) +
    line(302, 66, 338, 66, { m: 'ar' }) +
    box(344, 44, 130, 44, ['machine code', 'ไฟล์รัน'], { fill: INK, stroke: INK, color: '#fff', size: 11.5, weight: 600, lh: 15 }) +
    t(240, 36, 'compile', { anchor: 'middle', size: 10, color: INK3 }) +
    t(408, 36, 'assemble', { anchor: 'middle', size: 10, color: INK3 }) +
    // ย้อนกลับ
    line(404, 100, 250, 130, { m: 'arc', color: CRIM }) +
    t(340, 112, 'decompile ด้วย Ghidra', { size: 11, color: CRIM, weight: 600 }) +
    box(130, 132, 240, 44, ['pseudo-code คล้าย C', 'อ่านเข้าใจได้แต่ไม่เป๊ะ'], {
      fill: CRIML, stroke: CRIM, color: CRIM, size: 11.5, weight: 600, lh: 15,
    }) +
    box(12, 190, 636, 60, [
      'compile เป็นทางเดียว แปลงกลับให้เหมือนเดิมเป๊ะไม่ได้ เพราะชื่อตัวแปรและคอมเมนต์หายไป',
      'แต่ decompiler สร้างโค้ดที่ใกล้เคียงพอให้เข้าใจตรรกะ',
      'ตัวแปรจะถูกตั้งชื่อใหม่เป็น local_1, iVar2 ผู้แกะต้องเดาความหมายจากบริบทเอง',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 20 })
);

F.regStack = svg(
  660,
  310,
  ARROWS +
    t(12, 22, 'รีจิสเตอร์และสแตกที่ต้องรู้จัก', { size: 15, weight: 600, color: INK, display: true }) +
    // registers
    t(12, 46, 'รีจิสเตอร์สำคัญ (x86-64)', { size: 13, weight: 600, color: INK }) +
    [
      ['RAX', 'ค่าที่ฟังก์ชันคืน และตัวคำนวณ'],
      ['RDI RSI RDX', 'อาร์กิวเมนต์ที่ส่งให้ฟังก์ชัน'],
      ['RSP', 'ชี้ยอดสแตกปัจจุบัน'],
      ['RBP', 'ชี้ฐานของเฟรมฟังก์ชัน'],
      ['RIP', 'ชี้คำสั่งถัดไปที่จะรัน'],
    ]
      .map(([r, d], i) =>
        `<rect x="12" y="${58 + i * 30}" width="130" height="24" rx="5" fill="${PAPER}"/>` +
        t(77, 74 + i * 30, r, { anchor: 'middle', size: 11.5, color: INK, weight: 600 }) +
        t(154, 74 + i * 30, d, { size: 11.5, color: INK2 })
      )
      .join('') +
    // stack diagram
    t(430, 46, 'โครงสร้างสแตก', { size: 13, weight: 600, color: INK }) +
    (() => {
      const cells = [['อาร์กิวเมนต์', GOLD], ['return address', CRIM], ['saved RBP', INK3], ['ตัวแปรในฟังก์ชัน', TEAL], ['buffer', TEAL]];
      return cells
        .map(([label, c], i) =>
          `<rect x="430" y="${58 + i * 34}" width="200" height="30" rx="4" fill="#fff" stroke="${c}" stroke-width="1.6"/>` +
          t(530, 78 + i * 34, label, { anchor: 'middle', size: 11.5, color: c === INK3 ? INK2 : c, weight: 600 })
        )
        .join('');
    })() +
    t(640, 74, 'สูง', { anchor: 'end', size: 10, color: INK3 }) +
    t(640, 220, 'ต่ำ', { anchor: 'end', size: 10, color: INK3 }) +
    box(12, 236, 636, 62, [
      'สแตกโตจากที่อยู่สูงลงมาต่ำ แต่การเขียน buffer เขียนจากต่ำขึ้นสูง',
      'เมื่อเขียนเกินขนาด buffer จึงล้นขึ้นไปทับ return address ที่อยู่ด้านบน',
      'return address คือที่อยู่ที่โปรแกรมจะกระโดดไปเมื่อฟังก์ชันจบ ควบคุมมันได้เท่ากับควบคุมโปรแกรม',
    ], { fill: CRIML, stroke: CRIM, color: CRIM, size: 12.5, lh: 20, weight: 600 })
);

F.bofExploit = svg(
  660,
  300,
  ARROWS +
    t(12, 22, 'ขั้นตอนการเจาะ Buffer Overflow อย่างง่าย', {
      size: 15, weight: 600, color: INK, display: true,
    }) +
    [
      ['1', 'หา offset', 'ป้อนข้อมูลยาวขึ้นเรื่อย ๆ จนโปรแกรมพัง หาว่ากี่ไบต์ถึงทับ return address'],
      ['2', 'หาที่จะกระโดดไป', 'หาที่อยู่ของฟังก์ชันหรือโค้ดที่ต้องการรัน เช่น ฟังก์ชัน win'],
      ['3', 'สร้าง payload', 'ขยะเท่า offset ตามด้วยที่อยู่เป้าหมาย'],
      ['4', 'ส่งและได้ผล', 'ส่ง payload โปรแกรมกระโดดไปรันโค้ดที่ต้องการ'],
    ]
      .map(([n, title, desc], i) => {
        const y = 42 + i * 48;
        return (
          `<circle cx="30" cy="${y + 16}" r="15" fill="${GOLD}"/>` +
          t(30, y + 21, n, { anchor: 'middle', color: '#fff', weight: 700, size: 14, display: true }) +
          t(56, y + 12, title, { size: 13, weight: 600, color: INK }) +
          t(56, y + 30, desc, { size: 11.5, color: INK2 })
        );
      })
      .join('') +
    box(12, 240, 636, 58, [
      'เครื่องมือช่วย: cyclic ของ pwntools สร้างรูปแบบไม่ซ้ำเพื่อหา offset ได้แม่นยำ',
      'ระบบสมัยใหม่มีการป้องกัน เช่น ASLR สุ่มที่อยู่ และ Stack Canary ตรวจการล้น',
      'โจทย์ระดับต้นมักปิดการป้องกันเหล่านี้ไว้ให้ฝึกก่อน',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, lh: 19, weight: 600 })
);

F.gdbFlow = svg(
  660,
  250,
  ARROWS +
    t(12, 22, 'คำสั่ง gdb ที่ใช้บ่อยในการแกะและดีบัก', {
      size: 15, weight: 600, color: INK, display: true,
    }) +
    [
      ['break main', 'ตั้งจุดหยุดที่ฟังก์ชัน main'],
      ['run', 'เริ่มรันโปรแกรมจนถึงจุดหยุด'],
      ['disassemble', 'ดู assembly ของฟังก์ชันปัจจุบัน'],
      ['info registers', 'ดูค่าในรีจิสเตอร์ทั้งหมด'],
      ['x/20x $rsp', 'ดูข้อมูลในหน่วยความจำที่ยอดสแตก'],
      ['step / next', 'รันทีละบรรทัด เข้าฟังก์ชันหรือข้าม'],
      ['continue', 'รันต่อจนจบหรือถึงจุดหยุดถัดไป'],
    ]
      .map(([cmd, desc], i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 12 + col * 322;
        const y = 44 + row * 38;
        return (
          `<rect x="${x}" y="${y}" width="150" height="28" rx="5" fill="${INK}"/>` +
          t(x + 75, y + 19, cmd, { anchor: 'middle', size: 11, color: '#fff', weight: 600 }) +
          t(x + 160, y + 19, desc, { size: 11, color: INK2 })
        );
      })
      .join('') +
    box(12, 214, 636, 30, ['ส่วนเสริม pwndbg ทำให้ gdb แสดงสแตก รีจิสเตอร์ และ assembly พร้อมกันในหน้าเดียว อ่านง่ายขึ้นมาก'], {
      fill: PAPER, stroke: LINE, color: INK2, size: 12.5,
    })
);

/* ══════════════ CS-614 Network Security ══════════════ */

F.netMap = svg(
  660,
  300,
  ARROWS +
    t(330, 24, 'หมวด Network ในการแข่ง CTF', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    box(255, 38, 150, 36, ['ไฟล์ pcap'], { fill: INK, stroke: INK, color: '#fff', size: 13, weight: 700, display: true }) +
    [
      ['อ่านโปรโตคอล', 'HTTP FTP DNS', TEAL, 30],
      ['ประกอบ stream', 'Follow Stream', GOLD, 200],
      ['ดึงไฟล์', 'Export Objects', CRIM, 370],
      ['หาสิ่งผิดปกติ', 'Statistics', '#7B4B94', 510],
    ]
      .map(([name, tool, c, x]) => {
        return (
          line(330, 78, x + 65, 104, { m: 'ar' }) +
          box(x, 108, 130, 66, [], { fill: '#fff', stroke: c, sw: 2 }) +
          `<rect x="${x}" y="108" width="130" height="26" rx="8" fill="${c}"/>` +
          t(x + 65, 126, name, { anchor: 'middle', color: '#fff', size: 12, weight: 700, display: true }) +
          t(x + 65, 152, tool, { anchor: 'middle', size: 11, color: INK3 })
        );
      })
      .join('') +
    box(12, 192, 636, 46, [
      'เครื่องมือหลักคือ Wireshark สำหรับดูด้วยตา และ tshark กับ tcpdump สำหรับสคริปต์',
      'ทักษะนี้ต่อยอดจากหมวด CS-401 และ CS-501 โดยตรง',
    ], { fill: PAPER, stroke: LINE, color: INK, size: 12.5, lh: 19, weight: 600 }) +
    box(12, 244, 636, 46, [
      'กฎทองของหมวดนี้: อย่าเพิ่งไล่ดูแพ็กเก็ตทีละบรรทัด',
      'เปิด Statistics ดู Protocol Hierarchy ก่อน เพื่อหาโปรโตคอลที่ผิดปกติจากส่วนอื่น',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, lh: 19 })
);

F.pcapWorkflow = svg(
  660,
  260,
  ARROWS +
    t(12, 22, 'เวิร์กโฟลว์การวิเคราะห์ไฟล์ pcap', { size: 15, weight: 600, color: INK, display: true }) +
    [
      ['1', 'Protocol Hierarchy', 'ดูว่าทราฟฟิกส่วนใหญ่เป็นอะไร หาสิ่งผิดปกติ'],
      ['2', 'ค้นด้วย filter', 'frame contains STDiO หาธงตรง ๆ ก่อน'],
      ['3', 'Follow Stream', 'ประกอบบทสนทนาที่น่าสนใจทั้งชุด'],
      ['4', 'Export Objects', 'ดึงไฟล์ที่ส่งผ่านออกมาตรวจต่อ'],
    ]
      .map(([n, title, desc], i) => {
        const y = 42 + i * 46;
        return (
          `<circle cx="30" cy="${y + 15}" r="15" fill="${GOLD}"/>` +
          t(30, y + 20, n, { anchor: 'middle', color: '#fff', weight: 700, size: 14, display: true }) +
          t(56, y + 11, title, { size: 13, weight: 600, color: INK }) +
          t(56, y + 29, desc, { size: 11.5, color: INK2 })
        );
      })
      .join('') +
    box(12, 232, 636, 22, [], { fill: 'none', stroke: 'none' }) +
    t(12, 244, 'โจทย์หา flag มักใช้โปรโตคอลไม่เข้ารหัส เพราะ HTTPS อ่านตรง ๆ ไม่ได้เว้นแต่โจทย์ให้กุญแจมา', {
      size: 12, color: CRIM, weight: 600,
    })
);

F.wiresharkFilters = svg(
  660,
  290,
  ARROWS +
    t(12, 22, 'display filter ที่ใช้บ่อยในหมวด Network', {
      size: 15, weight: 600, color: INK, display: true,
    }) +
    [
      ['http', 'ทราฟฟิกเว็บที่ไม่เข้ารหัส'],
      ['ftp', 'การโอนไฟล์ มักมีรหัสผ่าน cleartext'],
      ['dns', 'การสอบถามชื่อโดเมน หา exfiltration'],
      ['tcp.port == 23', 'Telnet ส่งทุกอย่างเป็นข้อความ'],
      ['frame contains "STDiO"', 'ค้นหาธงในทุกแพ็กเก็ตทันที'],
      ['http.request.method == "POST"', 'ข้อมูลที่ส่งจากฟอร์ม เช่น ล็อกอิน'],
      ['tcp.flags.syn == 1', 'หาร่องรอยการสแกนพอร์ต'],
      ['ip.addr == 10.0.0.5', 'สนใจเฉพาะเครื่องหนึ่ง'],
    ]
      .map(([f, d], i) => {
        const y = 42 + i * 29;
        return (
          `<rect x="12" y="${y}" width="290" height="24" rx="5" fill="${INK}"/>` +
          t(20, y + 16, f, { size: 11, color: '#F0D48A', weight: 600 }) +
          t(316, y + 16, d, { size: 11.5, color: INK2 })
        );
      })
      .join('') +
    box(12, 280, 636, 0, [], { fill: 'none', stroke: 'none' })
);

F.tlsInspect = svg(
  660,
  270,
  ARROWS +
    t(12, 22, 'ทำไม HTTPS อ่านไม่ได้ และเมื่อไรอ่านได้', {
      size: 15, weight: 600, color: INK, display: true,
    }) +
    box(12, 44, 300, 90, [], { fill: CRIML, stroke: CRIM }) +
    `<rect x="12" y="44" width="300" height="26" rx="9" fill="${CRIM}"/>` +
    t(162, 62, 'ปกติ อ่านไม่ได้', { anchor: 'middle', color: '#fff', size: 13, weight: 600 }) +
    t(28, 90, 'TLS เข้ารหัสเนื้อหาไว้', { size: 12, color: INK }) +
    t(28, 110, 'เห็นแค่ว่าคุยกับเซิร์ฟเวอร์ไหน', { size: 12, color: INK2 }) +
    t(28, 126, 'แต่ไม่เห็นเนื้อหาข้างใน', { size: 12, color: INK2 }) +
    box(348, 44, 300, 90, [], { fill: TEALL, stroke: TEAL }) +
    `<rect x="348" y="44" width="300" height="26" rx="9" fill="${TEAL}"/>` +
    t(498, 62, 'อ่านได้ถ้าโจทย์ให้กุญแจ', { anchor: 'middle', color: '#fff', size: 13, weight: 600 }) +
    t(364, 90, 'ถ้ามีไฟล์ SSLKEYLOGFILE', { size: 12, color: INK }) +
    t(364, 110, 'ใส่ใน Wireshark จะถอดรหัสให้', { size: 12, color: INK2 }) +
    t(364, 126, 'แล้วเห็นเนื้อหา HTTPS ได้', { size: 12, color: INK2 }) +
    box(12, 150, 636, 50, [
      'ในโจทย์ CTF ถ้าเจอทราฟฟิกที่เข้ารหัสทั้งหมด ให้มองหาไฟล์กุญแจที่โจทย์แนบมาด้วย',
      'ชื่อไฟล์มักลงท้าย .log หรือมีคำว่า keylog หรือ premaster',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, lh: 19, weight: 600 }) +
    box(12, 208, 636, 46, [
      'ถ้าไม่มีกุญแจ ทราฟฟิก TLS อ่านเนื้อหาไม่ได้จริง ๆ',
      'โจทย์จึงมักใช้ HTTP, FTP, Telnet หรือ DNS ที่ไม่เข้ารหัสแทน',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 19 })
);

F.attackSignatures = svg(
  660,
  290,
  ARROWS +
    t(330, 24, 'ลายเซ็นของการโจมตีที่เห็นในทราฟฟิก', {
      anchor: 'middle', size: 15, weight: 600, color: INK, display: true,
    }) +
    [
      ['Port Scan', 'SYN จำนวนมากไปหลายพอร์ตจากไอพีเดียว', CRIM],
      ['Brute Force', 'ล็อกอินล้มเหลวซ้ำ ๆ ถี่มาก', GOLD],
      ['SQL Injection', 'URL มีคำว่า UNION SELECT หรือ OR 1=1', CRIM],
      ['DNS Exfiltration', 'ซับโดเมนยาวผิดปกติที่เป็น hex หรือ base32', '#7B4B94'],
      ['C2 Beacon', 'ติดต่อปลายทางเดิมเป็นจังหวะสม่ำเสมอ', '#8E1F17'],
    ]
      .map(([name, sig, c], i) => {
        const y = 42 + i * 44;
        return (
          box(12, y, 170, 36, [name], { fill: c, stroke: c, color: '#fff', size: 12.5, weight: 600 }) +
          t(196, y + 23, sig, { size: 12, color: INK2 })
        );
      })
      .join('') +
    box(12, 266, 636, 0, [], { fill: 'none', stroke: 'none' }) +
    t(12, 278, 'ในโจทย์ Forensics เชิงเครือข่าย มักให้หาว่าเกิดการโจมตีแบบใดและธงซ่อนอยู่ในทราฟฟิกที่ผิดปกติ', {
      size: 12, color: INK3,
    })
);

/* ══════════════ CS-615 Mobile Security ══════════════ */

F.mobileMap = svg(
  660,
  300,
  ARROWS +
    t(330, 24, 'หมวด Mobile Security ในการแข่ง', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    box(255, 38, 150, 36, ['ไฟล์ APK'], { fill: INK, stroke: INK, color: '#fff', size: 13, weight: 700, display: true }) +
    [
      ['แตกไฟล์', 'unzip / apktool', TEAL, 30],
      ['อ่านโค้ด', 'jadx', CRIM, 200],
      ['ตรวจ resource', 'strings.xml', GOLD, 370],
      ['วิเคราะห์ตอนรัน', 'Frida', '#7B4B94', 510],
    ]
      .map(([name, tool, c, x]) => {
        return (
          line(330, 78, x + 65, 104, { m: 'ar' }) +
          box(x, 108, 130, 66, [], { fill: '#fff', stroke: c, sw: 2 }) +
          `<rect x="${x}" y="108" width="130" height="26" rx="8" fill="${c}"/>` +
          t(x + 65, 126, name, { anchor: 'middle', color: '#fff', size: 12, weight: 700, display: true }) +
          t(x + 65, 152, tool, { anchor: 'middle', size: 11, color: INK3 })
        );
      })
      .join('') +
    box(12, 192, 636, 46, [
      'ข่าวดีคือ APK จริง ๆ แล้วเป็นไฟล์ ZIP ที่แตกดูได้ และโค้ดแกะกลับมาอ่านได้ค่อนข้างง่าย',
      'ต่างจากไบนารีเนทีฟที่ต้องอ่าน assembly',
    ], { fill: PAPER, stroke: LINE, color: INK, size: 12.5, lh: 19, weight: 600 }) +
    box(12, 244, 636, 46, [
      'บทเรียนหลักของหมวดนี้: ทุกอย่างที่ฝังในแอปแกะออกมาดูได้ทั้งหมด',
      'จึงไม่ควรฝังกุญแจ รหัสผ่าน หรือ URL ลับไว้ในแอป',
    ], { fill: CRIML, stroke: CRIM, color: CRIM, size: 12.5, lh: 19, weight: 600 })
);

F.apkAnatomy = svg(
  660,
  300,
  ARROWS +
    t(12, 22, 'ภายในไฟล์ APK มีอะไรบ้าง', { size: 15, weight: 600, color: INK, display: true }) +
    box(255, 38, 150, 34, ['app.apk = ZIP'], { fill: INK, stroke: INK, color: '#fff', size: 12.5, weight: 600 }) +
    [
      ['AndroidManifest.xml', 'สิทธิ์ที่ขอ หน้าจอเริ่มต้น component', TEAL],
      ['classes.dex', 'โค้ดที่คอมไพล์ แกะด้วย jadx เป็น Java', CRIM],
      ['res/ และ resources.arsc', 'รูป ข้อความ ค่าคงที่ มักมีความลับ', GOLD],
      ['assets/', 'ไฟล์ดิบที่แอปใช้ เช่น ฐานข้อมูล', '#7B4B94'],
      ['lib/', 'โค้ดเนทีฟภาษา C ถ้ามี', INK3],
    ]
      .map(([name, note, c], i) => {
        const y = 88 + i * 40;
        return (
          line(330, 74, 100, y + 16, { m: 'ar', dash: '3 3', arrow: i === 0 }) +
          box(100, y, 210, 32, [name], { fill: '#fff', stroke: c, color: c, size: 11.5, weight: 600 }) +
          t(322, y + 20, note, { size: 11, color: INK2 })
        );
      })
      .join('') +
    box(12, 292, 636, 0, [], { fill: 'none', stroke: 'none' })
);

F.mobileVulns = svg(
  660,
  270,
  ARROWS +
    t(330, 24, 'ช่องโหว่ที่พบบ่อยในแอปมือถือ', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    [
      ['Hardcoded Secrets', 'กุญแจ API รหัสผ่าน URL ลับ ฝังในโค้ดหรือ resource', CRIM],
      ['Insecure Storage', 'เก็บข้อมูลลับในที่อ่านได้ เช่น SharedPreferences', GOLD],
      ['Weak Crypto', 'ใช้การเข้ารหัสอ่อนหรือกุญแจฝังในแอป', GOLD],
      ['Insecure Communication', 'ส่งข้อมูลแบบไม่เข้ารหัส หรือไม่ตรวจใบรับรอง', CRIM],
      ['Exported Components', 'เปิด component ให้แอปอื่นเรียกโดยไม่ตรวจสิทธิ์', '#7B4B94'],
    ]
      .map(([name, note, c], i) => {
        const y = 40 + i * 42;
        return (
          box(12, y, 190, 34, [name], { fill: c, stroke: c, color: '#fff', size: 11.5, weight: 600 }) +
          t(216, y + 22, note, { size: 11.5, color: INK2 })
        );
      })
      .join('') +
    box(12, 254, 636, 0, [], { fill: 'none', stroke: 'none' }) +
    t(12, 266, 'อ้างอิงแนวทาง OWASP Mobile ซึ่งรวบรวมความเสี่ยงของแอปมือถือไว้เป็นมาตรฐาน', {
      size: 11.5, color: INK3,
    })
);

/* ══════════════ CS-616 Programming และหัวข้อพิเศษ ══════════════ */

F.progMap = svg(
  660,
  290,
  ARROWS +
    t(330, 24, 'หมวด Programming และหัวข้อพิเศษ', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    [
      ['Programming', 'เขียนสคริปต์แก้โจทย์', 'ประมวลผลข้อมูลมาก เร็ว', TEAL, 30],
      ['AI', 'หลอกหรือดึงข้อมูลจากโมเดล', 'prompt injection', GOLD, 200],
      ['IoT', 'วิเคราะห์ firmware อุปกรณ์', 'ใช้ทักษะร่วม Forensics', CRIM, 370],
      ['System', 'โจทย์ระบบและ misc', 'สคริปต์และตรรกะ', '#7B4B94', 510],
    ]
      .map(([name, sub, note, c, x]) => {
        return (
          box(x, 44, 130, 82, [], { fill: '#fff', stroke: c, sw: 2 }) +
          `<rect x="${x}" y="44" width="130" height="26" rx="8" fill="${c}"/>` +
          t(x + 65, 62, name, { anchor: 'middle', color: '#fff', size: 12.5, weight: 700, display: true }) +
          t(x + 65, 88, sub, { anchor: 'middle', size: 11, color: INK, weight: 600 }) +
          t(x + 65, 108, note, { anchor: 'middle', size: 10, color: INK3 })
        );
      })
      .join('') +
    box(12, 142, 636, 46, [
      'ทักษะแกนคือเขียน Python ให้คล่อง เพราะโจทย์มักให้ทำสิ่งที่มนุษย์ทำไม่ทัน',
      'ทั้งด้านปริมาณข้อมูลและความเร็วในการตอบ',
    ], { fill: PAPER, stroke: LINE, color: INK, size: 12.5, lh: 19, weight: 600 }) +
    box(12, 194, 636, 46, [
      'pwntools ช่วยเชื่อมต่อเซิร์ฟเวอร์โจทย์และรับส่งข้อความอัตโนมัติ',
      'เป็นทักษะที่ใช้ข้ามหมวด ทั้ง Pwn, Crypto และ Programming',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, lh: 19 }) +
    box(12, 246, 636, 34, ['หัวข้อพิเศษเปลี่ยนไปตามยุค ปัจจุบันเน้น AI มากขึ้น โดยเฉพาะการโจมตีโมเดลภาษา'], {
      fill: CRIML, stroke: CRIM, color: CRIM, size: 12, weight: 600,
    })
);

F.pwntoolsFlow = svg(
  660,
  250,
  ARROWS +
    t(12, 22, 'การเชื่อมต่อเซิร์ฟเวอร์โจทย์ด้วย pwntools', {
      size: 15, weight: 600, color: INK, display: true,
    }) +
    box(12, 44, 130, 44, ['สคริปต์', 'ของเรา'], { fill: TEAL, stroke: TEAL, color: '#fff', size: 12.5, weight: 600, lh: 16 }) +
    line(146, 58, 206, 58, { m: 'art', color: TEAL }) +
    t(176, 48, 'recv โจทย์', { anchor: 'middle', size: 10, color: INK3 }) +
    box(212, 44, 130, 44, ['เซิร์ฟเวอร์', 'โจทย์'], { fill: INK, stroke: INK, color: '#fff', size: 12.5, weight: 600, lh: 16 }) +
    line(212, 78, 146, 78, { m: 'arg', color: GOLD }) +
    t(180, 96, 'send คำตอบ', { anchor: 'middle', size: 10, color: INK3 }) +
    box(400, 44, 248, 44, ['วนซ้ำจนกว่าจะได้ธง'], { fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, weight: 600 }) +
    line(342, 66, 396, 66, { arrow: false }) +
    box(12, 108, 636, 62, [
      'โจทย์มักส่งคำถามมาแล้วให้ตอบภายในเวลาจำกัด เช่น แก้โจทย์คณิตศาสตร์ 500 ข้อใน 10 วินาที',
      'ทำมือไม่ทัน ต้องเขียนสคริปต์ที่รับคำถาม คำนวณ แล้วส่งคำตอบอัตโนมัติวนไป',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 20 }) +
    box(12, 178, 636, 62, [
      'โครงสร้างสคริปต์พื้นฐาน',
      'r = remote(host, port) เชื่อมต่อ',
      'r.recvline() รับบรรทัด แล้วประมวลผล จากนั้น r.sendline(answer) ส่งคำตอบ วนจนเจอ STDiO',
    ], { fill: GOLDL, stroke: GOLD, color: INK, size: 12, lh: 20 })
);

F.aiAttacks = svg(
  660,
  260,
  ARROWS +
    t(330, 24, 'การโจมตีโมเดล AI ในโจทย์ CTF', { anchor: 'middle', size: 15, weight: 600, color: INK, display: true }) +
    [
      ['Prompt Injection', 'ใส่คำสั่งซ้อนเพื่อให้โมเดลทำนอกเหนือที่ตั้งใจ เช่น เผยระบบ prompt', CRIM],
      ['Jailbreak', 'หลอกให้โมเดลข้ามข้อจำกัดที่ตั้งไว้', GOLD],
      ['System Prompt Leak', 'ดึงคำสั่งระบบที่ซ่อนธงไว้ออกมา', CRIM],
      ['Model Evasion', 'แต่งข้อมูลให้โมเดลจำแนกผิด', '#7B4B94'],
    ]
      .map(([name, note, c], i) => {
        const y = 40 + i * 46;
        return (
          box(12, y, 200, 36, [name], { fill: c, stroke: c, color: '#fff', size: 12, weight: 600 }) +
          t(226, y + 23, note, { size: 11.5, color: INK2 })
        );
      })
      .join('') +
    box(12, 232, 636, 0, [], { fill: 'none', stroke: 'none' }) +
    t(12, 244, 'โจทย์ AI ที่พบบ่อยคือ prompt injection ซึ่งธงมักถูกซ่อนใน system prompt ให้หลอกโมเดลเผยออกมา', {
      size: 11.5, color: INK3,
    })
);

/* ══════════════ CS-402 บทเพิ่มเติม (หนึ่งภาคเรียน) ══════════════ */

F.wiresharkDeep = svg(
  660,
  290,
  ARROWS +
    t(12, 22, 'การวิเคราะห์เชิงลึกด้วย Wireshark', { size: 15, weight: 600, color: INK, display: true }) +
    [
      ['Follow Stream', 'ประกอบบทสนทนา TCP ทั้งชุดให้อ่านเป็นเรื่องเดียว', TEAL],
      ['Statistics', 'ดูภาพรวม โปรโตคอล คู่สนทนา และปริมาณ', GOLD],
      ['Export Objects', 'ดึงไฟล์ที่ถูกส่งผ่านเครือข่ายออกมา', CRIM],
      ['IO Graph', 'วาดกราฟปริมาณทราฟฟิกตามเวลา หาจุดผิดปกติ', '#7B4B94'],
      ['Expert Info', 'สรุปปัญหาที่ Wireshark ตรวจพบ เช่น การส่งซ้ำ', '#0E6E6E'],
    ]
      .map(([name, desc, c], i) => {
        const y = 40 + i * 42;
        return (
          box(12, y, 170, 34, [name], { fill: c, stroke: c, color: '#fff', size: 12, weight: 600 }) +
          t(196, y + 22, desc, { size: 11.5, color: INK2 })
        );
      })
      .join('') +
    box(12, 254, 636, 30, ['ผู้เชี่ยวชาญเปิด Statistics และ Expert Info ก่อนไล่ดูแพ็กเก็ตทีละบรรทัดเสมอ'], {
      fill: GOLDL, stroke: GOLD, color: INK, size: 12.5, weight: 600,
    })
);

F.vlanTrunk = svg(
  660,
  300,
  ARROWS +
    t(12, 22, 'VLAN และ Trunk เชื่อมสวิตช์หลายตัว', { size: 15, weight: 600, color: INK, display: true }) +
    box(40, 60, 150, 60, ['สวิตช์ A'], { fill: INK, stroke: INK, color: '#fff', size: 13, weight: 600, display: true }) +
    box(470, 60, 150, 60, ['สวิตช์ B'], { fill: INK, stroke: INK, color: '#fff', size: 13, weight: 600, display: true }) +
    line(190, 90, 470, 90, { m: 'ar', color: CRIM, w: 3 }) +
    t(330, 80, 'Trunk พา VLAN หลายวง', { anchor: 'middle', size: 12, color: CRIM, weight: 600 }) +
    box(20, 150, 90, 40, ['VLAN 10', 'นักเรียน'], { fill: TEALL, stroke: TEAL, color: TEAL, size: 11, weight: 600, lh: 14 }) +
    box(120, 150, 90, 40, ['VLAN 20', 'ครู'], { fill: GOLDL, stroke: GOLD, color: GOLD, size: 11, weight: 600, lh: 14 }) +
    box(450, 150, 90, 40, ['VLAN 10', 'นักเรียน'], { fill: TEALL, stroke: TEAL, color: TEAL, size: 11, weight: 600, lh: 14 }) +
    box(550, 150, 90, 40, ['VLAN 20', 'ครู'], { fill: GOLDL, stroke: GOLD, color: GOLD, size: 11, weight: 600, lh: 14 }) +
    line(65, 150, 90, 122, { arrow: false, color: TEAL }) +
    line(165, 150, 140, 122, { arrow: false, color: GOLD }) +
    line(495, 150, 520, 122, { arrow: false, color: TEAL }) +
    line(595, 150, 570, 122, { arrow: false, color: GOLD }) +
    box(12, 210, 636, 78, [
      'VLAN แบ่งสวิตช์หนึ่งตัวเป็นหลายวงเครือข่ายเชิงตรรกะ แยกนักเรียนกับครูได้โดยไม่ต้องซื้อสวิตช์เพิ่ม',
      'access port ผูกกับ VLAN เดียว ต่อกับเครื่องปลายทาง',
      'trunk port พา VLAN หลายวงข้ามสวิตช์ ใช้มาตรฐาน 802.1Q เติมแท็กบอกว่าเฟรมเป็นของ VLAN ใด',
    ], { fill: PAPER, stroke: LINE, color: INK2, size: 12.5, lh: 20 })
);

F.snortTuning = svg(
  660,
  270,
  ARROWS +
    t(12, 22, 'วงจรปรับจูนกฎ IDS ให้ใช้งานได้จริง', { size: 15, weight: 600, color: INK, display: true }) +
    [
      ['1', 'เปิดกฎชุดเล็ก', 'เริ่มจากกฎที่จำเป็นก่อน ไม่เปิดทั้งหมด'],
      ['2', 'สังเกตการแจ้งเตือน', 'ดูว่ามี false positive มากแค่ไหน'],
      ['3', 'ปรับกฎ', 'เพิ่ม threshold หรือ suppress กฎที่ดังเกิน'],
      ['4', 'เพิ่มกฎชุดถัดไป', 'เมื่อชุดเดิมนิ่งแล้วจึงขยาย'],
    ]
      .map(([n, title, desc], i) => {
        const x = 12 + i * 162;
        return (
          box(x, 46, 148, 74, [desc], { fill: '#fff', stroke: LINE, color: INK2, size: 11, lh: 15 }) +
          `<circle cx="${x + 74}" cy="30" r="15" fill="${TEAL}"/>` +
          t(x + 74, 35, n, { anchor: 'middle', color: '#fff', weight: 700, size: 14, display: true }) +
          t(x + 74, 66, title, { anchor: 'middle', size: 12, weight: 600, color: INK, display: true }) +
          (i < 3 ? line(x + 150, 90, x + 160, 90, { m: 'art', color: TEAL }) : '')
        );
      })
      .join('') +
    `<path d="M86 128 L86 150 L574 150 L574 128" stroke="${TEAL}" stroke-width="1.6" fill="none" stroke-dasharray="5 4" marker-end="url(#art)"/>` +
    t(330, 168, 'วนซ้ำเรื่อย ๆ กฎที่ดีคือกฎที่คนยังอ่านการแจ้งเตือนอยู่', {
      anchor: 'middle', size: 12.5, color: TEAL, weight: 600,
    }) +
    box(12, 184, 636, 76, [
      'ระบบที่แจ้งเตือนวันละสามพันครั้งจะถูกปิดเสียงในสัปดาห์แรก',
      'เป้าหมายไม่ใช่จับให้ได้ทุกอย่าง แต่คือแจ้งเตือนเฉพาะสิ่งที่ควรดูจริง',
      'threshold จำกัดความถี่ ส่วน suppress ปิดกฎเฉพาะต้นทางหรือปลายทางที่รู้ว่าปลอดภัย',
    ], { fill: CRIML, stroke: CRIM, color: CRIM, size: 12.5, lh: 20, weight: 600 })
);

F.reportFlow = svg(
  660,
  280,
  ARROWS +
    t(12, 22, 'โครงสร้างรายงานผลการทดสอบความปลอดภัย', {
      size: 15, weight: 600, color: INK, display: true,
    }) +
    [
      ['บทสรุปผู้บริหาร', 'สรุปสั้นสำหรับผู้ไม่ใช่สายเทคนิค ความเสี่ยงโดยรวม', INK],
      ['ขอบเขตและวิธีการ', 'ทดสอบอะไร ช่วงเวลาใด ด้วยวิธีใด', TEAL],
      ['สิ่งที่พบ', 'ช่องโหว่แต่ละรายการ ระดับความรุนแรง หลักฐาน', CRIM],
      ['ผลกระทบ', 'ถ้าถูกโจมตีจริงจะเกิดอะไร', GOLD],
      ['ข้อเสนอแนะ', 'วิธีแก้ที่ทำได้จริง เรียงตามความสำคัญ', '#0E6E6E'],
    ]
      .map(([name, desc, c], i) => {
        const y = 40 + i * 42;
        return (
          box(12, y, 170, 34, [name], { fill: c, stroke: c, color: '#fff', size: 12, weight: 600 }) +
          t(196, y + 22, desc, { size: 11.5, color: INK2 })
        );
      })
      .join('') +
    box(12, 254, 636, 22, [], { fill: 'none', stroke: 'none' }) +
    t(12, 266, 'ส่วนที่มีค่าที่สุดคือข้อเสนอแนะ เพราะบอกว่าต้องทำอะไรต่อ ไม่ใช่แค่บอกว่ามีปัญหา', {
      size: 12, color: GOLD, weight: 600,
    })
);

F.blueRedTeam = svg(
  660,
  280,
  ARROWS +
    t(330, 24, 'มุมมองสองด้าน ผู้โจมตีและผู้ป้องกัน', {
      anchor: 'middle', size: 15, weight: 600, color: INK, display: true,
    }) +
    box(30, 44, 280, 130, [], { fill: '#fff', stroke: CRIM, sw: 2 }) +
    `<rect x="30" y="44" width="280" height="30" rx="9" fill="${CRIM}"/>` +
    t(170, 64, 'Red Team ผู้โจมตี', { anchor: 'middle', color: '#fff', size: 13, weight: 700, display: true }) +
    t(48, 94, 'สำรวจ หาช่องโหว่ เจาะเข้า', { size: 12, color: INK }) +
    t(48, 114, 'ใช้ Nmap, Kali, Metasploit', { size: 11.5, color: INK2 }) +
    t(48, 138, 'เป้าหมาย: พิสูจน์ว่าเข้าได้', { size: 11.5, color: INK3 }) +
    t(48, 158, 'คิดแบบผู้บุกรุก', { size: 11.5, color: CRIM, weight: 600 }) +
    box(350, 44, 280, 130, [], { fill: '#fff', stroke: TEAL, sw: 2 }) +
    `<rect x="350" y="44" width="280" height="30" rx="9" fill="${TEAL}"/>` +
    t(490, 64, 'Blue Team ผู้ป้องกัน', { anchor: 'middle', color: '#fff', size: 13, weight: 700, display: true }) +
    t(368, 94, 'เฝ้าระวัง ตรวจจับ รับมือ', { size: 12, color: INK }) +
    t(368, 114, 'ใช้ Snort, Wireshark, log', { size: 11.5, color: INK2 }) +
    t(368, 138, 'เป้าหมาย: จับให้ได้ก่อนเสียหาย', { size: 11.5, color: INK3 }) +
    t(368, 158, 'คิดแบบผู้เฝ้าประตู', { size: 11.5, color: TEAL, weight: 600 }) +
    box(12, 190, 636, 78, [
      'เครื่องมือที่เรียนมาทั้งหมดใช้ได้ทั้งสองด้าน ต่างที่มุมมองและเป้าหมาย',
      'ผู้ป้องกันที่ดีต้องเข้าใจวิธีคิดของผู้โจมตี จึงจะรู้ว่าต้องเฝ้าระวังอะไร',
      'นี่คือเหตุผลที่การเรียนเชิงรุกในแล็บที่แยกขาด ทำให้เป็นผู้ป้องกันที่เก่งขึ้น',
    ], { fill: PAPER, stroke: LINE, color: INK, size: 12.5, lh: 20, weight: 600 })
);

module.exports = F;
