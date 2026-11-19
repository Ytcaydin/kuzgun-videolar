// Dosya #13 shared art
// ---------- art ----------
function cobbles(y0, y1, seed = 5, col = '#2b2a33') {
  let s = `<rect x="0" y="${y0}" width="${W}" height="${y1 - y0}" fill="${col}"/>`;
  const r = rng(seed);
  for (let y = y0 + 10; y < y1; y += 46) for (let x = -40 + ((y / 46) % 2) * 40; x < W + 40; x += 82)
    s += `<rect x="${x + r() * 6}" y="${y + r() * 4}" width="${70 + r() * 8}" height="${36}" rx="12" fill="#ffffff" opacity="${.04 + r() * .05}"/>`;
  return s;
}
function shards(t, x0, y0, w, h, n, seed = 11, scale = 1) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * w, y = y0 + Math.pow(r(), .7) * h, sz = (8 + r() * 26) * scale, a = r() * 360;
    const pts = [0, 1, 2].map(k => { const ang = (a + k * 120 + r() * 50) * Math.PI / 180, rr = sz * (.5 + r() * .6); return `${(x + Math.cos(ang) * rr).toFixed(1)},${(y + Math.sin(ang) * rr * .55).toFixed(1)}`; }).join(' ');
    s += `<polygon points="${pts}" fill="#cfeaff" opacity="${.35 + r() * .4}" stroke="#ffffff" stroke-opacity=".6" stroke-width="1.5"/>`;
    const tw_ = Math.sin(t * (3 + r() * 4) + i * 1.7);
    if (tw_ > .93) s += `<path d="M${x - 14 * scale} ${y} L${x + 14 * scale} ${y} M${x} ${y - 14 * scale} L${x} ${y + 14 * scale}" stroke="#fff" stroke-width="${3 * scale}" opacity="${(tw_ - .93) * 14}"/>`;
  }
  return s;
}
function copperPot(x, y, s = 1, kind = 0) {
  const g = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -120 L0 -40" stroke="#5a4636" stroke-width="3"/>`;
  if (kind === 0) return g + `<path d="M-40 -40 L40 -40 L46 -30 C70 0 60 50 0 55 C-60 50 -70 0 -46 -30Z" fill="url(#copper)"/><rect x="-46" y="-46" width="92" height="10" rx="4" fill="#e9a26a"/></g>`;
  if (kind === 1) return g + `<path d="M-14 -40 L14 -40 L18 -10 C50 10 46 60 0 64 C-46 60 -50 10 -18 -10Z" fill="url(#copper)"/><path d="M18 0 C50 -6 60 -30 70 -36" stroke="#c86a32" stroke-width="7" fill="none"/></g>`;
  return g + `<ellipse cx="0" cy="0" rx="58" ry="20" fill="url(#copper)"/><path d="M-58 0 C-50 40 50 40 58 0" fill="#a8562a"/></g>`;
}
function shopFront(t, x, y, s, o = {}) {
  // storefront centered at x, top y, width 700*s
  const al = o.alarm ? (Math.sin(t * 9) > 0 ? 1 : .25) : 0;
  let g = `<g transform="translate(${x} ${y}) scale(${s})">
   <rect x="-370" y="0" width="740" height="760" fill="#3c2a1e"/>
   <rect x="-350" y="20" width="700" height="110" fill="#1d3a2e" stroke="#c9a24a" stroke-width="6"/>
   ${txt(0, 92, 'NURETTİN ANTİKA', { size: 64, fill: '#e8c766', family: SERIF, weight: 700, ls: 4 })}
   <rect x="-340" y="160" width="430" height="440" fill="#0f1420"/>
   <rect x="120" y="160" width="220" height="560" fill="#24170f"/>
   <rect x="134" y="176" width="192" height="300" fill="#0d121c"/>
   <circle cx="300" cy="440" r="8" fill="#d9b25a"/>`;
  // window contents: stand + antiques
  g += `<rect x="-300" y="430" width="350" height="120" fill="#5a1626"/><rect x="-300" y="430" width="350" height="14" fill="#7a2236"/>`;
  if (o.coins) for (let i = 0; i < 5; i++) g += `<circle cx="${-262 + i * 70}" cy="490" r="22" fill="url(#goldg)"/>`;
  else for (let i = 0; i < 5; i++) g += `<circle cx="${-262 + i * 70}" cy="490" r="22" fill="none" stroke="#c98a9a" stroke-width="3" stroke-dasharray="6 6" opacity=".8"/>`;
  g += copperPot(-250, 380, .7, 1) + `<g transform="translate(-60 300)"><circle r="46" fill="#d9c9a0"/><circle r="38" fill="#f4ecd6"/><path d="M0 0 L0 -26 M0 0 L18 8" stroke="#333" stroke-width="5"/></g>`;
  // glass + crack
  if (o.broken !== false) {
    g += `<rect x="-340" y="160" width="430" height="440" fill="url(#glass)"/>
     <path d="M-150 300 L-110 270 L-70 290 L-60 340 L-90 380 L-140 372 L-170 340 Z" fill="#05070c"/>
     <g stroke="#e6f3ff" stroke-width="3" opacity=".75" fill="none">
     <path d="M-110 270 L-60 160 M-70 290 L90 220 M-60 340 L90 420 M-90 380 L-40 600 M-140 372 L-340 520 M-170 340 L-340 300 M-150 300 L-260 160"/>
     <path d="M-82 236 L-40 252 M-20 268 L0 300 M10 380 L40 392 M-62 470 L-30 466 M-240 448 L-220 476 M-250 318 L-230 300"/></g>`;
  } else g += `<rect x="-340" y="160" width="430" height="440" fill="url(#glass)"/>`;
  g += `<rect x="-350" y="600" width="450" height="22" fill="#5b3a22"/>`;
  // alarm beacon
  g += `<rect x="-20" y="-50" width="40" height="40" rx="8" fill="#5a0e12"/><circle cx="0" cy="-30" r="14" fill="${al ? '#ff3a3a' : '#7a1a1a'}"/>`;
  if (al) g += `<circle cx="0" cy="-30" r="${220}" fill="url(#alarmg)" opacity="${al * .8}"/>`;
  return g + '</g>';
}

const LOOK = {
  nurettin: { skin: '#eebd96', hair: '#b9b4ad', style: 'bald', mustache: '#cfc9c0', glasses: true, topType: 'vest', top: '#6b3e26', lines: true, seed: 1 },
  cabbar: { skin: '#e9b48a', hair: '#1c140f', style: 'messy', topType: 'baker', flour: true, seed: 2 },
  sevda: { skin: '#f0c4a0', hair: '#7a2e1c', style: 'bob', topType: 'blazer', top: '#6a1f35', earrings: true, necklace: true, lipstick: true, seed: 3 },
  riza: { skin: '#d9a47c', hair: '#2b2018', style: 'short', mustache: '#2b2018', topType: 'uniform', top: '#1d2b4f', hat: 'bekci', seed: 4 },
};
