// Dosya #13 "Kırık Vitrin" — VAKA
const L = TL.lines;
const wT = (i, w, end = false) => { const x = L[i].words.find(v => v[0].toLowerCase().startsWith(w.toLowerCase())); return x ? x[end ? 2 : 1] : L[i].start; };
const speaking = (i, t) => L[i].words.some(w => t >= w[1] - .02 && t <= w[2] + .02);
const cut = i => (L[i].end + L[i + 1].start) / 2;

function titleBlock(t, y = 210) {
  const k = ease.out(prog(t, 0, .5)), out = 1 - prog(t, 5.2, 5.6);
  return `<g opacity="${k * out}" transform="translate(0 ${(1 - k) * -30})">
   ${txt(W / 2, y, 'SİZCE', { size: 84, fill: C.cream, stroke: '#0b1222', sw: 8 })}
   ${txt(W / 2, y + 112, 'HIRSIZ KİM?', { size: 124, fill: C.red, stroke: '#0b1222', sw: 10 })}
   ${txt(W / 2, y + 172, '— DOSYA #13 · GAZİANTEP —', { size: 30, fill: '#8d96ad', family: MONO, weight: 700, ls: 6 })}</g>`;
}

// ---------- scenes ----------
const S = [];
// 0: Bakırcılar Çarşısı before dawn
S.push({ a: 0, b: cut(0), draw: (t) => {
  let s = `<rect width="${W}" height="${H}" fill="url(#dawn)"/>`;
  // arcade wall
  s += `<rect x="0" y="420" width="${W}" height="860" fill="#3a2f35"/>`;
  for (let i = 0; i < 4; i++) {
    const x = 20 + i * 270;
    s += `<path d="M${x} 1280 L${x} 640 Q${x + 115} 470 ${x + 230} 640 L${x + 230} 1280Z" fill="#1a1520"/>
          <path d="M${x - 8} 640 Q${x + 115} 450 ${x + 238} 640" stroke="#5a4848" stroke-width="16" fill="none"/>`;
  }
  s += `<rect x="0" y="420" width="${W}" height="60" fill="#4b3d42"/>`;
  // lanterns
  [[150, 700], [930, 700]].forEach(([x, y], i) => { const f = .8 + .2 * Math.sin(t * 6 + i * 2); s += `<circle cx="${x}" cy="${y}" r="120" fill="url(#lamp)" opacity="${.5 * f}"/><rect x="${x - 18}" y="${y - 30}" width="36" height="56" rx="6" fill="#f3c46a"/><path d="M${x} ${y - 30} L${x} ${y - 90}" stroke="#222" stroke-width="3"/>`; });
  // hanging copper
  s += copperPot(110, 560, .9, 0) + copperPot(250, 590, .8, 1) + copperPot(840, 575, .85, 2) + copperPot(980, 560, .8, 1);
  // shop in center arch
  s += shopFront(t, 540, 640, .62, { alarm: t > wT(0, 'alarm') - .1 });
  // street
  s += cobbles(1280, H, 3) + `<rect x="0" y="1280" width="${W}" height="16" fill="#000" opacity=".35"/>`;
  s += dust(t, 4, 25, .35);
  s += tag(t, wT(0, 'Gün'), 820, 470, 'GÜN DOĞMADAN', { bg: C.navy, rot: 4, size: 34 });
  s += titleBlock(t, 190);
  return s + caption(t, L[0], 1440);
} });
// 1: storefront close-up
S.push({ a: cut(0), b: cut(1), draw: (t) => {
  let s = `<rect width="${W}" height="${H}" fill="#120e14"/>` + shopFront(t, 560, 330, 1.18, { alarm: true }) + cobbles(1240, H, 6);
  s += tag(t, wT(1, 'sigortalı'), 300, 1170, 'SİGORTALI', { bg: C.blue, rot: -4 });
  s += tag(t, wT(1, 'çalınmıştı'), 700, 1090, 'ALTIN SİKKELER YOK', { rot: 3 });
  s += `<g transform="translate(150 1700) scale(.62)">${kuzgun(t)}</g>`;
  return s + caption(t, L[1], 1440);
} });
// 2: pavement full of glass (and a clean shop floor, quietly)
S.push({ a: cut(1), b: cut(2), zoom: t => 1.02 + .05 * prog(t, cut(1), cut(2)), draw: (t) => {
  let s = `<rect width="${W}" height="${H}" fill="#120e14"/>`;
  // shop interior through open door (clean checkered floor)
  s += `<rect x="560" y="200" width="460" height="900" fill="#24170f"/><rect x="590" y="230" width="400" height="870" fill="#2a2230"/>`;
  for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) s += `<rect x="${590 + c * 80}" y="${780 + r * 54}" width="80" height="54" fill="${(r + c) % 2 ? '#d8cfbd' : '#3d3440'}" opacity=".85"/>`;
  s += `<rect x="640" y="560" width="300" height="200" fill="#5a1626"/>` + copperPot(700, 520, .6, 1) + copperPot(880, 530, .6, 0);
  // broken window from outside: dark display inside, jagged glass left only at the frame
  s += `<rect x="0" y="200" width="540" height="760" fill="#0f1420"/>
    <rect x="40" y="700" width="460" height="200" fill="#5a1626"/><rect x="40" y="700" width="460" height="16" fill="#7a2236"/>`;
  for (let i = 0; i < 5; i++) s += `<circle cx="${100 + i * 85}" cy="790" r="26" fill="none" stroke="#c98a9a" stroke-width="3" stroke-dasharray="6 6"/>`;
  s += `<path d="M0 200 L540 200 L540 260 L470 230 L420 300 L360 240 L300 280 L230 225 L170 310 L110 240 L40 290 L0 250Z" fill="#cfeaff" opacity=".35" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
    <path d="M0 250 L40 330 L0 420Z M540 260 L490 380 L540 470Z M0 960 L60 900 L120 960Z M540 960 L470 890 L420 960Z" fill="#cfeaff" opacity=".35" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
    <rect x="0" y="960" width="560" height="40" fill="#5b3a22"/><rect x="540" y="200" width="30" height="900" fill="#3c2a1e"/>`;
  // sidewalk
  s += cobbles(1100, H, 9, '#312e38') + `<rect x="0" y="1100" width="${W}" height="14" fill="#000" opacity=".3"/>`;
  s += shards(t, 20, 1130, 1040, 640, 120, 21);
  s += tag(t, wT(2, 'cam'), 300, 1060, 'KALDIRIM CAM DOLU', { rot: -3 });
  return s + caption(t, L[2], 1500);
} });
// 3..6 interrogations
const SUS = [
  { line: 3, head: 'DÜKKÂN SAHİBİ', name: 'NURETTİN', role: 'ANTİKACI', col: '#d9b25a', num: 0, tag: 'MAĞDUR', accent: '#d9b25a',
    look: LOOK.nurettin },
  { line: 4, head: 'ŞÜPHELİ 1/3', name: 'CABBAR', role: 'KOVULAN ÇIRAK', col: '#3a7bff', num: 1, tag: 'GEÇEN HAFTA KOVULDU', accent: C.blue,
    look: LOOK.cabbar },
  { line: 5, head: 'ŞÜPHELİ 2/3', name: 'SEVDA', role: 'RAKİP ANTİKACI', col: C.green, num: 2, tag: 'SİKKELERE TALİPTİ', accent: C.green,
    look: LOOK.sevda },
  { line: 6, head: 'ŞÜPHELİ 3/3', name: 'RIZA', role: 'GECE BEKÇİSİ', col: C.orange, num: 3, tag: 'ALARMA İLK O KOŞTU', accent: C.orange,
    look: LOOK.riza },
];
SUS.forEach((p, i) => {
  S.push({ a: cut(2 + i), b: cut(3 + i), draw: (t) => {
    let s = interroWall() + spotlight();
    s += header(p.head, 300);
    s += `<g transform="translate(540 ${770 + Math.sin(t * 1.2) * 4}) scale(1.3)">${person(t, Object.assign({ speaking: speaking(p.line, t) }, p.look))}</g>`;
    s += plate(540, 1210, p.name, p.role, p.col, p.num);
    s += tag(t, L[p.line].start - .1, 540, 1305, p.tag, { rot: -2, size: 32 });
    s += statement(t, L[p.line], 90, 1370, 900, 330, { accent: p.accent });
    return s;
  } });
});
// 7: Kuzgun's note
S.push({ a: cut(6), b: cut(7), draw: (t) => {
  let s = interroWall() + spotlight(.8) + header("KUZGUN'UN NOTU", 300, C.gold);
  s += `<g transform="translate(540 790) scale(1.2)">${kuzgun(t, { speaking: speaking(7, t) })}</g>`;
  const a1 = wT(7, 'Dört'), a2 = wT(7, 'Biri');
  if (t > a1) s += `<g opacity="${prog(t, a1, a1 + .2)}">${txt(540, 1330, 'DÖRT İFADE.', { size: 72, fill: C.cream, stroke: '#0b1222', sw: 10 })}</g>`;
  if (t > a2) s += `<g transform="translate(540 1450) scale(${lerp(1.4, 1, ease.out(prog(t, a2, a2 + .25)))})">${txt(0, 0, 'BİRİ MASAL ANLATTI', { size: 80, fill: C.red, stroke: '#0b1222', sw: 10 })}</g>`;
  return s;
} });
// 8: final question
S.push({ a: cut(7), b: TL.duration, shake: .6, draw: (t) => {
  const t0 = cut(7);
  let s = `<rect width="${W}" height="${H}" fill="#0c1324"/>` + dust(t, 9, 30, .25);
  s += txt(W / 2, 270, 'SİZCE', { size: 76, fill: C.cream }) + txt(W / 2, 370, 'HIRSIZ KİM?', { size: 104, fill: C.red });
  const cards = [['Cabbar', 1, C.blue, SUS[1].look, 'Bir'], ['Sevda', 2, C.green, SUS[2].look, 'iki'], ['Rıza', 3, C.orange, SUS[3].look, 'üç']];
  cards.forEach(([n, num, col, look, w], i) => {
    const ta = t0 + .15 * i, k = ease.back(prog(t, ta, ta + .3));
    const hw = wT(8, w), hot = t > hw && t < hw + .9;
    s += `<g transform="translate(${170 + i * 245} 620) scale(${k * (hot ? 1.08 : 1)})">${polaroid(t, 0, 0, 220, n, tt => person(tt, look), { num, numColor: col, rot: [-3, 2, -2][i], border: hot ? col : 'none' })}</g>`;
  });
  { // "none of them" card
    const ta = t0 + .45, k = ease.back(prog(t, ta, ta + .3)), hw = wT(8, 'hiçbiri'), hot = t > hw && t < hw + 1.2;
    s += `<g transform="translate(905 620) rotate(3) scale(${k * (hot ? 1.08 : 1)})"><rect x="-110" y="-130" width="220" height="260" fill="#141c30" stroke="${hot ? C.yellow : '#8d96ad'}" stroke-width="5" stroke-dasharray="14 10"/>
      ${txt(0, 10, '?', { size: 140, fill: hot ? C.yellow : '#8d96ad' })}${txt(0, 95, 'HİÇBİRİ', { size: 34, fill: hot ? C.yellow : C.cream, ls: 2 })}</g>`;
  }
  // clue panel: storefront + pavement
  const kp = ease.out(prog(t, t0 + .6, t0 + 1));
  s += `<g opacity="${kp}"><rect x="140" y="800" width="800" height="360" rx="8" fill="#120e14" stroke="#3a4560" stroke-width="4"/>
    <clipPath id="cp"><rect x="140" y="800" width="800" height="360" rx="8"/></clipPath><g clip-path="url(#cp)">
    ${shopFront(t, 540, 820, .36, { alarm: false })}${cobbles(1092, 1160, 2, '#312e38')}${shards(t, 160, 1098, 760, 56, 50, 31, .45)}</g>
    ${txt(170, 836, 'BAKIRCILAR ÇARŞISI · 05:10', { size: 22, fill: '#8d96ad', family: MONO, weight: 700, anchor: 'start', ls: 2 })}</g>`;
  s += `<g opacity="${prog(t, t0 + .8, t0 + 1.1)}">${txt(W / 2, 1265, '1, 2, 3 YA DA HİÇBİRİ?', { size: 66, fill: C.yellow })}${txt(W / 2, 1335, 'YORUMA YAZ', { size: 50, fill: C.cream, ls: 3 })}</g>`;
  const k1 = wT(9, 'Kuzgun'), k2 = wT(9, 'Sen');
  if (t > k1) s += `<g opacity="${prog(t, k1, k1 + .2)}">${txt(W / 2, 1440, 'KUZGUN HER ŞEYİ GÖRÜR.', { size: 46, fill: C.cream })}</g>`;
  if (t > k2) s += `<g opacity="${prog(t, k2, k2 + .2)}">${txt(W / 2, 1500, 'SEN DE GÖRDÜN MÜ?', { size: 46, fill: '#6fb0ff' })}</g>`;
  const pk = ease.back(prog(t, t0 + 1, t0 + 1.3));
  s += `<g transform="translate(${W / 2} 1610) scale(${pk})">${pill(0, 0, 'ÇÖZÜM YARIN · 19:30')}</g>`;
  return s;
} });

function renderAt(t) {
  const i = Math.max(0, S.findIndex(s => t >= s.a && t < s.b));
  const sc = S[i < 0 ? S.length - 1 : i];
  const over = progressBar(t, i, S.length, prog(t, sc.a, sc.b)) + (t > TL.duration - .4 ? `<rect width="${W}" height="${H}" fill="#000" opacity="${prog(t, TL.duration - .4, TL.duration)}"/>` : '');
  return frame(t, compose(t, S), over);
}
