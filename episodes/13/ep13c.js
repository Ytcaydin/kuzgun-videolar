// Dosya #13 "Kırık Vitrin" — ÇÖZÜM
const L = TL.lines;
const wT = (i, w, end = false) => { const x = L[i].words.find(v => v[0].toLowerCase().startsWith(w.toLowerCase())); return x ? x[end ? 2 : 1] : L[i].start; };
const speaking = (i, t) => L[i].words.some(w => t >= w[1] - .02 && t <= w[2] + .02);
const cut = i => (L[i].end + L[i + 1].start) / 2;
const CHIP = 'DOSYA #13 · ÇÖZÜM';

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
// 1: rule — outside hit, shards fall in
S.push({ a: cut(0), b: cut(1), draw: (t) => {
  const hit = wT(1, 'kırılırsa') + .1;
  let s = sideView(t, { hit, dir: 1, obj: 'stone', seed: 5 }) + chip(CHIP, 250) + header('FİZİK KURALI', 340, C.gold);
  s += tag(t, wT(1, 'Cam'), 270, 640, 'DARBE DIŞARIDAN', { bg: C.navy, rot: -3 });
  s += tag(t, wT(1, 'içeri'), 810, 1060, 'KIRIKLAR İÇERİ', { rot: 3 });
  return s + caption(t, L[1], 1440);
} });
// 2: the actual scene — inside clean, everything outside
S.push({ a: cut(1), b: cut(2), draw: (t) => {
  let s = sideView(t, { hit: -10, dir: 0, seed: 1 }) + chip(CHIP, 250) + header('NURETTİN ANTİKA · 05:10', 340, '#cfd6e6');
  // remove the default shards; draw real evidence
  s += `<rect x="0" y="560" width="${W}" height="610" fill="#0e1424" opacity="0"/>`;
  s += shards(t, 40, 1120, 460, 70, 70, 41, .9);
  const k1 = wT(2, 'içinde'), k2 = wT(2, 'Hepsi');
  if (t > k1) { const k = ease.out(prog(t, k1, k1 + .35)); s += `<ellipse cx="810" cy="1150" rx="${230 * k}" ry="${90 * k}" fill="none" stroke="${C.yellow}" stroke-width="10"/>`; }
  s += tag(t, wT(2, 'parça'), 810, 1010, 'İÇERİDE 0 PARÇA', { bg: C.navy, rot: 3 });
  if (t > k2) { const k = ease.out(prog(t, k2, k2 + .35)); s += `<ellipse cx="270" cy="1150" rx="${250 * k}" ry="${90 * k}" fill="none" stroke="${C.red}" stroke-width="10"/>`; }
  s += tag(t, k2 + .1, 270, 1010, 'HEPSİ DIŞARIDA', { rot: -3 });
  return s + caption(t, L[2], 1440);
} });
// 3: it was broken from inside
S.push({ a: cut(2), b: cut(3), draw: (t) => {
  const hit = wT(3, 'içeriden') + .15, q = wT(3, 'İçeride');
  let s = sideView(t, { hit, dir: -1, obj: 'hammer', seed: 9 }) + chip(CHIP, 250) + header('VİTRİN NASIL KIRILDI?', 340, C.gold);
  s += tag(t, hit + .1, 270, 640, 'İÇERİDEN KIRILDI', { rot: -3 });
  if (t > q) {
    const k = ease.out(prog(t, q, q + .4));
    s += `<g opacity="${k}" transform="translate(830 ${lerp(900, 860, k)}) scale(.95)"><g filter="url(#soft)">${person(t, Object.assign({}, LOOK.nurettin))}</g>
      <rect x="-230" y="-220" width="460" height="560" fill="#05070c" opacity=".55"/>${txt(0, -10, '?', { size: 200, fill: C.yellow })}</g>`;
  }
  return s + caption(t, L[3], 1440);
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
