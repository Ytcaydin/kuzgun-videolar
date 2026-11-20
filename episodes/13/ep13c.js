// Dosya #13 "Kırık Vitrin" — ÇÖZÜM
const L = TL.lines;
const wT = (i, w, end = false) => { const x = L[i].words.find(v => v[0].toLowerCase().startsWith(w.toLowerCase())); return x ? x[end ? 2 : 1] : L[i].start; };
const speaking = (i, t) => L[i].words.some(w => t >= w[1] - .02 && t <= w[2] + .02);
const cut = i => (L[i].end + L[i + 1].start) / 2;
const CHIP = 'DOSYA #13 · ÇÖZÜM';
const LOOKS_READY = true;

// Side-view diagram: window pane at x=540, outside left (pavement), inside right (shop floor)
function sideView(t, o) {
  let s = `<rect width="${W}" height="${H}" fill="#0e1424"/>
    <rect x="0" y="420" width="540" height="900" fill="#141c30"/><rect x="540" y="420" width="540" height="900" fill="#221a26"/>
    ${txt(270, 500, 'DIŞARI · KALDIRIM', { size: 34, fill: '#8d96ad', ls: 2 })}${txt(810, 500, 'İÇERİ · DÜKKÂN', { size: 34, fill: '#c9a24a', ls: 2 })}
    <rect x="0" y="1180" width="540" height="40" fill="#3a3744"/><rect x="540" y="1180" width="540" height="40" fill="#5a4a3a"/>`;
  for (let c = 0; c < 7; c++) s += `<rect x="${540 + c * 78}" y="1180" width="78" height="40" fill="${c % 2 ? '#d8cfbd' : '#3d3440'}" opacity=".8"/>`;
  s += `<rect x="520" y="420" width="40" height="80" fill="#5b3a22"/><rect x="520" y="1110" width="40" height="70" fill="#5b3a22"/>`;
  const hit = o.hit, dir = o.dir; // dir: +1 = from outside (shards inward), -1 = from inside (shards outward)
  // the pane
  if (t < hit) s += `<rect x="532" y="500" width="16" height="610" fill="#bfe3ff" opacity=".55"/>`;
  else {
    s += `<path d="M532 500 L548 500 L548 600 L532 640Z M532 1110 L548 1110 L548 1040 L532 1000Z" fill="#bfe3ff" opacity=".55"/>`;
    const r = rng(o.seed || 3), k = prog(t, hit, hit + .9);
    for (let i = 0; i < (dir ? 26 : 0); i++) {
      const y0 = 640 + r() * 400, vx = (60 + r() * 260) * dir, land = 1150 + r() * 40, sz = 10 + r() * 18;
      const x = 540 + vx * ease.out(k) * (.6 + r() * .5), y = lerp(y0, land, Math.pow(k, 1.6));
      s += `<polygon points="${x},${y - sz} ${x + sz},${y + sz * .5} ${x - sz * .7},${y + sz * .6}" fill="#cfeaff" opacity=".7" stroke="#fff" stroke-width="2" transform="rotate(${i * 37 + k * 200 * dir} ${x} ${y})"/>`;
    }
  }
  // impact object
  if (o.obj === 'stone' && t < hit + .1) {
    const k = prog(t, hit - .6, hit); s += `<circle cx="${lerp(80, 510, k)}" cy="${lerp(700, 820, k)}" r="34" fill="#7d7a80"/><circle cx="${lerp(80, 510, k) - 8}" cy="${lerp(700, 820, k) - 10}" r="9" fill="#a5a2a8"/>`;
  }
  if (o.obj === 'hammer') {
    const k = prog(t, hit - .5, hit), back = prog(t, hit, hit + .4);
    const x = lerp(900, 570, ease.inOut(k)) + back * 120, rot = lerp(-40, 10, k) - back * 30;
    s += `<g transform="translate(${x} 830) rotate(${rot})"><rect x="0" y="-10" width="240" height="22" rx="6" fill="#7a4a24"/><rect x="-40" y="-46" width="60" height="92" rx="8" fill="#5f6672"/></g>`;
  }
  return s;
}

const S = [];
// 0: trap reveal
S.push({ a: 0, b: cut(0), draw: (t) => {
  let s = `<rect width="${W}" height="${H}" fill="#0c1324"/>` + dust(t, 9, 30, .25) + chip(CHIP, 250);
  s += `<g transform="translate(${W / 2} 380) scale(${lerp(1.3, 1, ease.out(prog(t, 0, .35)))})">${txt(0, 0, 'HIRSIZ KİMDİ?', { size: 110, fill: C.red })}</g>`;
  const cards = [['Cabbar', 1, C.blue, LOOK.cabbar, 'Bir'], ['Sevda', 2, C.green, LOOK.sevda, 'iki'], ['Rıza', 3, C.orange, LOOK.riza, 'üç']];
  const tz = wT(0, 'tuzağa');
  cards.forEach(([n, num, col, look, w], i) => {
    const ta = .2 + .15 * i, k = ease.back(prog(t, ta, ta + .3));
    const hw = wT(0, w), hot = t > hw && t < hw + .6;
    s += `<g transform="translate(${215 + i * 325} 760) scale(${k * (hot ? 1.06 : 1)})">${polaroid(t, 0, 0, 290, n, tt => person(tt, look), { num, numColor: col, rot: [-3, 2, -2][i], border: hot ? col : 'none' })}`;
    if (t > tz - .1 + i * .08) { const kk = ease.out(prog(t, tz - .1 + i * .08, tz + .1 + i * .08)); s += `<path d="M-120 -150 L${lerp(-120, 120, kk)} ${lerp(-150, 150, kk)} M120 -150 L${lerp(120, -120, kk)} ${lerp(-150, 150, kk)}" stroke="${C.red}" stroke-width="20" stroke-linecap="round"/>`; }
    s += '</g>';
  });
  s += stamp(t, tz + .25, W / 2, 1110, 'TUZAK', { size: 130, rot: -6 });
  return s + caption(t, L[0], 1440);
} });
// 1: rule — blueprint: outside hit, shards fall in
function bpPane(t, broken) {
  let g = bpPath('M90,1260H990', 4) + bpPath('M540,400V1270', 2, { dash: '48 12 6 12' });
  if (!broken) g += bpPath('M530,520H550V1180H530Z', 5);
  else g += bpPath('M530,520H550V600L540,640L530,610Z', 5) + bpPath('M530,1180H550V1100L540,1070L530,1110Z', 5);
  g += bpPath('M520,1180H560V1260H520Z', 3) + bpPath('M520,440H560V520H520Z', 3);
  g += bpLabel(290, 470, 'DIŞARI', { size: 44 }) + bpLabel(790, 470, 'İÇERİ', { size: 44 });
  g += bpLabel(290, 1310, 'KALDIRIM', { size: 26 }) + bpLabel(790, 1310, 'DÜKKÂN ZEMİNİ', { size: 26 });
  return g;
}
S.push({ a: cut(0), b: cut(1), draw: (t) => {
  const hit = wT(1, 'kırılırsa'), ki = wT(1, 'içeri');
  let s = blueprintBg({ title: 'DELİL 13-A · CAM KURALI', code: 'ÖLÇEK 1:20' }) + chip(CHIP, 140) + bpLabel(W / 2, 260, 'CAM NASIL KIRILIR?', { size: 48 });
  let g = bpPane(t, t > hit + .1);
  const k1 = prog(t, hit - .6, hit + .1);
  g += bpArrow(120, 820, 515, 820, ease.out(k1), { w: 7 }) + (k1 > 0 ? bpLabel(300, 790, 'DARBE', { size: 36 }) : '');
  const k2 = prog(t, ki - .2, ki + .6);
  if (k2 > 0) for (let i = 0; i < 7; i++) { const y = 640 + i * 70; g += bpArrow(565, y, 700 + (i % 3) * 60, Math.min(1240, y + 160 + i * 30), ease.out(k2), { w: 3, head: 16, dash: '10 7' }); }
  if (k2 > .5) for (let i = 0; i < 9; i++) { const x = 600 + i * 42; g += bpPath(`M${x},1255l12,-18l12,18Z`, 2); }
  s += bpInk(g);
  if (k2 > 0) s += `<g opacity="${k2}">${txt(W / 2, 1460, 'DIŞARIDAN DARBE → KIRIKLAR İÇERİ', { size: 40, fill: '#ffd23f', family: MONO, weight: 700 })}</g>`;
  return s + caption(t, L[1], 1640);
} });
// 2: blueprint — the evidence: inside 0, all outside
S.push({ a: cut(1), b: cut(2), draw: (t) => {
  const k1 = wT(2, 'içinde'), k2 = wT(2, 'Hepsi');
  let s = blueprintBg({ title: 'DELİL 13-B · OLAY YERİ', code: 'NURETTİN ANTİKA · 05:10' }) + chip(CHIP, 140) + bpLabel(W / 2, 260, 'KIRIKLAR NEREDEYDİ?', { size: 48 });
  let g = bpPane(t, true);
  const r = rng(41);
  for (let i = 0; i < 22; i++) { const x = 110 + r() * 380, y = 1250 - r() * 20; g += bpPath(`M${x},${y}l${8 + r() * 10},-${10 + r() * 14}l${8 + r() * 10},${10 + r() * 14}Z`, 2); }
  s += bpInk(g);
  s += bpCircle(790, 1235, 240, 70, prog(t, k1, k1 + .6));
  if (t > k1 + .3) s += txt(790, 1150, 'İÇERİDE: 0 PARÇA', { size: 40, fill: '#ff6a5a', family: MONO, weight: 700 });
  s += bpCircle(300, 1235, 240, 70, prog(t, k2, k2 + .6), '#ffd23f');
  if (t > k2 + .3) s += txt(300, 1150, 'DIŞARIDA: HEPSİ', { size: 40, fill: '#ffd23f', family: MONO, weight: 700 });
  return s + caption(t, L[2], 1640);
} });
// 3: silent-film flashback — broken from inside
const SIL = '<filter id="sil"><feColorMatrix values="0 0 0 0 .05  0 0 0 0 .05  0 0 0 0 .07  0 0 0 1 0"/></filter>';
S.push({ a: cut(2), b: cut(3), draw: (t) => {
  const t0 = cut(2), ft = filmTime(t), hit = wT(3, 'içeriden') + .1, q = wT(3, 'İçeride');
  let s = `<defs>${SIL}</defs><rect width="${W}" height="${H}" fill="#2a2230"/>`;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 9; c++) s += `<rect x="${c * 120}" y="${1250 + r * 90}" width="120" height="90" fill="${(r + c) % 2 ? '#d8cfbd' : '#3d3440'}"/>`;
  s += `<rect x="80" y="420" width="560" height="760" fill="#0b0f18"/><rect x="60" y="1180" width="600" height="30" fill="#5b3a22"/>`;
  if (ft < hit) s += `<rect x="80" y="420" width="560" height="760" fill="url(#glass)"/>`;
  const k = prog(ft, hit - 1, hit), back = prog(ft, hit, hit + .5), px = lerp(900, 840, k) + back * 40;
  const lit = t > q;
  { const hx = lerp(820, 700, ease.inOut(k)) + back * 60, hy = lerp(560, 800, k), hr = (lerp(-60, 0, k) - back * 25) * Math.PI / 180;
    const gx = hx + Math.cos(hr) * 180, gy = hy + Math.sin(hr) * 180;
    s += `<g ${lit ? '' : 'filter="url(#sil)"'}><path d="M${px + 130},1090 Q${(px + 130 + gx) / 2 + 40},${(1090 + gy) / 2 + 30} ${gx},${gy}" stroke="#6b3e26" stroke-width="46" fill="none" stroke-linecap="round"/><circle cx="${gx}" cy="${gy}" r="26" fill="#eebd96"/>
      <g transform="translate(${px} 960) scale(1.05)">${person(ft, Object.assign({ smile: -6 }, LOOK.nurettin))}</g>
      <g transform="translate(${hx} ${hy}) rotate(${hr * 180 / Math.PI})"><rect x="0" y="-10" width="200" height="20" rx="6" fill="#7a4a24"/><rect x="-40" y="-44" width="60" height="88" rx="8" fill="#5f6672"/></g></g>`; }
  if (lit) s += `<circle cx="${px}" cy="900" r="${300}" fill="url(#lamp)" opacity=".35"/>`;
  if (ft >= hit) {
    const r = rng(7), kk = prog(ft, hit, hit + 1.1);
    s += `<path d="M80,420 L640,420 L640,470 L560,450 L500,520 L420,460 L330,540 L250,470 L170,560 L80,500Z" fill="#cfeaff" opacity=".35"/>`;
    for (let i = 0; i < 26; i++) { const y0 = 520 + r() * 600, vx = -(80 + r() * 420); const x = 600 + vx * ease.out(kk), y = lerp(y0, y0 + 200 + r() * 200, kk * kk); s += `<polygon points="${x},${y - 14} ${x + 14},${y + 8} ${x - 10},${y + 9}" fill="#e6f3ff" opacity=".8"/>`; }
  }
  s += txt(W / 2, 330, 'O GECE · 05:09', { size: 48, fill: '#ece8dd', family: SERIF, weight: 700, ls: 6 });
  if (lit) s += txt(840, 1420, '?', { size: 0, fill: '#000' });
  return flashback(t, s, { iris: [t0 - .1, t0 + .45, 99, 100], cx: 520, cy: 860, sepia: true }) + caption(t, L[3], 1640);
} });
// 4: coins never stolen + insurance
S.push({ a: cut(3), b: cut(4), draw: (t) => {
  let s = `<rect width="${W}" height="${H}" fill="#120e14"/>` + chip(CHIP, 250);
  const ks = ease.out(prog(t, cut(3), cut(3) + .5));
  // safe
  s += `<g transform="translate(330 760)"><rect x="-230" y="-260" width="460" height="520" rx="20" fill="#3d4450"/><rect x="-200" y="-230" width="400" height="460" rx="10" fill="#1a1d24"/>`;
  for (let i = 0; i < 12; i++) s += `<circle cx="${-130 + (i % 4) * 86}" cy="${-110 + Math.floor(i / 4) * 90}" r="34" fill="url(#goldg)" stroke="#9a6a10" stroke-width="3"/>`;
  s += `<g transform="translate(-230 -260) scale(${lerp(1, .1, ks)} 1)"><rect x="0" y="0" width="460" height="520" rx="20" fill="#4a5260" stroke="#2a2f38" stroke-width="6"/><circle cx="230" cy="260" r="60" fill="#2a2f38"/><circle cx="230" cy="260" r="40" fill="#8a92a0"/></g></g>`;
  s += tag(t, wT(4, 'çalınmadı'), 330, 1080, 'SİKKELER KASADA', { bg: '#2f7a3a', rot: -3 });
  // policy
  const tp = wT(4, 'sigorta'), kp = ease.out(prog(t, tp - .2, tp + .3));
  if (t > tp - .2) {
    s += `<g transform="translate(${lerp(1300, 760, kp)} 820) rotate(5)"><rect x="-200" y="-280" width="400" height="560" fill="${C.paper}"/>
      ${txt(0, -210, 'SİGORTA POLİÇESİ', { size: 34, fill: C.ink })}${txt(0, -170, 'Nurettin Antika', { size: 30, fill: '#555', family: SERIF, italic: true, weight: 700 })}`;
    for (let i = 0; i < 6; i++) s += `<rect x="-160" y="${-120 + i * 44}" width="${i % 2 ? 240 : 320}" height="14" rx="6" fill="#cfc8b8"/>`;
    s += txt(0, 200, 'TEMİNAT: ALTIN SİKKELER', { size: 26, fill: '#a33', family: MONO, weight: 700 }) + '</g>';
  }
  s += stamp(t, wT(4, 'peşindeydi') + .1, 760, 1000, 'HASAR TALEBİ', { size: 64, rot: -10 });
  return s + caption(t, L[4], 1440);
} });
// 5-6: Nurettin confesses, then the verdict
S.push({ a: cut(4), b: cut(6), draw: (t) => {
  let s = interroWall() + spotlight() + chip(CHIP, 250);
  const sweat = t > L[5].start ? `<path d="M120 -110 q14 24 0 34 q-14 -10 0 -34Z" fill="#9fd4ff" transform="translate(0 ${((t * 40) % 60)})" opacity=".9"/>` : '';
  s += `<g transform="translate(540 ${770 + Math.sin(t * 1.2) * 4}) scale(1.3)">${person(t, Object.assign({ speaking: speaking(5, t), smile: -8 }, LOOK.nurettin))}${sweat}</g>`;
  s += plate(540, 1210, 'NURETTİN', 'DÜKKÂN SAHİBİ', '#d9b25a', 0);
  s += statement(t, L[5], 90, 1300, 900, 200, { accent: '#d9b25a', title: "NURETTİN'İN İFADESİ" });
  s += stamp(t, wT(6, 'Sahte'), 540, 760, 'SAHTE SOYGUN', { size: 104, rot: -9 });
  return s + caption(t, L[6], 1640);
} });
// 7: outro
S.push({ a: cut(6), b: TL.duration, draw: (t) => {
  const t0 = cut(6);
  let s = interroWall() + spotlight(.8) + chip(CHIP, 250);
  s += `<g transform="translate(540 760) scale(1.2)">${kuzgun(t, { speaking: speaking(7, t) })}</g>`;
  s += `<g opacity="${prog(t, t0, t0 + .3)}">${txt(W / 2, 1300, 'DOSYA KAPANDI', { size: 84, fill: C.cream, stroke: '#0b1222', sw: 10 })}${txt(W / 2, 1360, 'DOĞRU BİLENLER YORUMLARDA', { size: 38, fill: C.gold, ls: 1 })}</g>`;
  const tn = L[7].start;
  if (t > tn - .1) {
    const k = ease.out(prog(t, tn - .1, tn + .25));
    s += `<g opacity="${k}">${txt(W / 2, 1500, 'DOSYA #14', { size: 78, fill: C.red })}${txt(W / 2, 1570, 'PAZARTESİ · 19:30', { size: 46, fill: C.cream, ls: 2 })}</g>`;
  }
  return s;
} });

function renderAt(t) {
  const i = Math.max(0, S.findIndex(s => t >= s.a && t < s.b));
  const sc = S[i < 0 ? S.length - 1 : i];
  const over = progressBar(t, i, S.length, prog(t, sc.a, sc.b)) + (t > TL.duration - .5 ? `<rect width="${W}" height="${H}" fill="#000" opacity="${prog(t, TL.duration - .5, TL.duration)}"/>` : '');
  return frame(t, compose(t, S), over);
}
