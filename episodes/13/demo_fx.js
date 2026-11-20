// Demo: blueprint evidence diagram + silent-film flashback (Dosya #13 material)
function bpScene(t) {
  let s = blueprintBg({ title: 'DELİL 13-A · VİTRİN KESİTİ', code: 'ÖLÇEK 1:20' });
  s += chip('DOSYA #13 · ÇÖZÜM', 140) + bpLabel(W / 2, 250, 'KIRIKLAR NEREYE DÜŞER?', { size: 44 });
  let g = '';
  // floor line + pane section
  g += bpPath('M90,1260H990', 4) + bpPath('M540,420V1260', 2, { dash: '48 12 6 12' });
  g += bpPath('M530,520H550V1180H530Z', 5, { draw: prog(t, .2, 1.2) });
  g += bpLabel(290, 470, 'DIŞARI', { size: 44 }) + bpLabel(790, 470, 'İÇERİ', { size: 44 });
  g += bpDim(530, 1215, 550, 1215, '6 mm', { opacity: prog(t, 1, 1.4) }) ;
  // case A: impact from outside
  const k1 = prog(t, 1.4, 2.4);
  g += bpArrow(150, 800, 515, 800, ease.out(k1), { w: 6 }) + (k1 > 0 ? bpLabel(300, 765, 'DARBE', { size: 36 }) : '');
  const k2 = prog(t, 2.4, 3.4);
  if (k2 > 0) for (let i = 0; i < 7; i++) { const y = 640 + i * 70; g += bpArrow(560, y, 560 + 160 + (i % 3) * 40, y + 120 + i * 18, ease.out(k2), { w: 3, head: 16, dash: '10 7' }); }
  if (k2 > 0) g += bpLabel(790, 1320, 'KIRIKLAR İÇERİ DÜŞER', { size: 34 });
  s += bpInk(g);
  // red-pencil verdict: inside floor empty
  s += bpCircle(790, 1235, 250, 70, prog(t, 3.6, 4.3));
  if (t > 4.3) s += txt(W / 2, 1460, 'AMA İÇERİDE 0 PARÇA', { size: 54, fill: '#ff6a5a', family: MONO, weight: 700 });
  return s;
}
function fbScene(t) {
  const ft = filmTime(t);
  if (t < 1.6) return intertitle(t, ['O GECE...', 'Dükkânın içinde'], { size: 92 }) + filmDamage(t, { scratch: 3, fleck: 6 });
  let s = `<rect width="${W}" height="${H}" fill="#2a2230"/>`;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 9; c++) s += `<rect x="${c * 120}" y="${1250 + r * 90}" width="120" height="90" fill="${(r + c) % 2 ? '#d8cfbd' : '#3d3440'}"/>`;
  // window seen from inside (outside = dark street)
  s += `<rect x="80" y="420" width="560" height="760" fill="#0b0f18"/><rect x="80" y="420" width="560" height="760" fill="url(#glass)"/><rect x="60" y="1180" width="600" height="30" fill="#5b3a22"/>`;
  const hit = 3.0;
  // Nurettin swings a hammer from inside
  const k = prog(ft, 2.0, hit), back = prog(ft, hit, hit + .5);
  { const hx = lerp(820, 700, ease.inOut(k)) + back * 60, hy = lerp(560, 800, k), hr = (lerp(-60, 0, k) - back * 25) * Math.PI / 180;
    const gx = hx + Math.cos(hr) * 180, gy = hy + Math.sin(hr) * 180, sx = lerp(900, 840, k) + back * 40 + 130, sy = 1090;
    s += `<path d="M${sx},${sy} Q${(sx + gx) / 2 + 40},${(sy + gy) / 2 + 30} ${gx},${gy}" stroke="#6b3e26" stroke-width="46" fill="none" stroke-linecap="round"/><circle cx="${gx}" cy="${gy}" r="26" fill="#eebd96"/>`; }
  s += `<g transform="translate(${lerp(900, 840, k) + back * 40} 960) scale(1.05)">${person(ft, Object.assign({ smile: -6 }, LOOK.nurettin))}</g>`;
  s += `<g transform="translate(${lerp(820, 700, ease.inOut(k)) + back * 60} ${lerp(560, 800, k)}) rotate(${lerp(-60, 0, k) - back * 25})"><rect x="0" y="-10" width="200" height="20" rx="6" fill="#7a4a24"/><rect x="-40" y="-44" width="60" height="88" rx="8" fill="#5f6672"/></g>`;
  if (ft >= hit) {
    const r = rng(7), kk = prog(ft, hit, hit + 1.1);
    s += `<path d="M80,420 L640,420 L640,470 L560,450 L500,520 L420,460 L330,540 L250,470 L170,560 L80,500Z" fill="#cfeaff" opacity=".35"/>`;
    for (let i = 0; i < 24; i++) { const y0 = 520 + r() * 600, vx = -(80 + r() * 380); const x = 600 + vx * ease.out(kk), y = lerp(y0, y0 + 200 + r() * 200, kk * kk); s += `<polygon points="${x},${y - 14} ${x + 14},${y + 8} ${x - 10},${y + 9}" fill="#e6f3ff" opacity=".8"/>`; }
  }
  return flashback(t, s, { iris: [1.6, 2.1, 5.4, 6.0], cx: 520, cy: 860, sepia: true });
}
function renderAt(t) {
  const body = t < 6 ? bpScene(t) : fbScene(t - 6);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs()}${blurDefs()}${fxDefs()}<rect width="${W}" height="${H}" fill="#000"/>${body}</svg>`;
}
