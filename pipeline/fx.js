// Komiser Kuzgun — special scene looks.
// Techniques adapted from deenukhan/animation-styles (MIT, (c) 2026 Deenu Khan): silent-film damage, blueprint drafting.

const hrnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

function fxDefs() {
  return `<defs>
  <filter id="fx-silver" x="0" y="0" width="100%" height="100%">
    <feColorMatrix type="matrix" values=".36 .58 .12 0 .02  .33 .56 .11 0 .015  .28 .48 .09 0 0  0 0 0 1 0"/>
    <feComponentTransfer><feFuncR type="linear" slope="1.18" intercept="-.06"/><feFuncG type="linear" slope="1.18" intercept="-.06"/><feFuncB type="linear" slope="1.18" intercept="-.06"/></feComponentTransfer>
    <feGaussianBlur stdDeviation="1.2"/>
  </filter>
  <radialGradient id="fx-oval" cx="50%" cy="50%" r="62%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="88%" stop-color="#000" stop-opacity=".75"/><stop offset="100%" stop-color="#000" stop-opacity="1"/></radialGradient>
  <pattern id="bp-g" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30,0H0V30" fill="none" stroke="#bcd8ff" stroke-width="1" opacity=".28"/></pattern>
  <pattern id="bp-G" width="150" height="150" patternUnits="userSpaceOnUse"><path d="M150,0H0V150" fill="none" stroke="#d6e7ff" stroke-width="2" opacity=".34"/></pattern>
  <filter id="bp-m" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".004 .009" numOctaves="4" seed="6"/><feColorMatrix values="0 0 0 0 .02  0 0 0 0 .09  0 0 0 0 .3  2.2 0 0 0 -.85"/></filter>
  <filter id="bp-c" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="5" result="n"/><feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 -1.2" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>
  </defs>`;
}

// ---------- SILENT FILM / FLASHBACK ----------
// Wrap any scene drawing. Use filmTime(t) inside the scene for 12 fps stepped motion.
const filmTime = (t, fps = 12) => Math.floor(t * fps) / fps;
function filmDamage(t, o = {}) {
  const n = Math.floor(t * 15), scratch = o.scratch ?? 5, fleck = o.fleck ?? 8, tone = o.tone || '#f4efe2';
  let s = `<filter id="fx-grain${n % 23}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".82" numOctaves="2" seed="${(n % 23) + 1}"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.4 0 0 0 -.55"/></filter>
    <rect width="${W}" height="${H}" filter="url(#fx-grain${n % 23})" opacity="${o.grain ?? .45}" style="mix-blend-mode:overlay"/>`;
  for (let i = 0; i < scratch; i++) {
    if (hrnd(n * 5 + i) <= .35) continue;
    const x = hrnd(n * 3 + i * 7.3) * W;
    s += `<line x1="${x}" x2="${x + (hrnd(i + n) - .5) * 18}" y1="${hrnd(n + i * 2) * 300 - 100}" y2="${H - hrnd(n + i * 4) * 300 + 100}" stroke="${i % 3 ? tone : '#000'}" stroke-width="${.8 + hrnd(i + n * 2) * 2.4}" opacity="${.3 + hrnd(i * 9 + n) * .5}"/>`;
  }
  for (let i = 0; i < fleck; i++) {
    const r = 1 + hrnd(n + i * 8) * 7;
    s += `<ellipse cx="${hrnd(n * 11 + i * 3.1) * W}" cy="${hrnd(n * 13 + i * 5.7) * H}" rx="${r}" ry="${r * (.4 + hrnd(i) * .9)}" fill="${i % 4 === 0 ? '#000' : tone}" opacity=".8"/>`;
  }
  return s;
}
// o: {iris:[openStart, openEnd, closeStart, closeEnd], cx, cy, sepia}
function flashback(t, inner, o = {}) {
  const n = Math.floor(t * 15);
  const wx = (hrnd(n + 1) - .5) * 8, wy = (hrnd(n + 2) - .5) * 10, flick = .04 + hrnd(n + 3) * .18;
  let s = `<g transform="translate(${wx} ${wy})"><g filter="url(#fx-silver)">${inner}</g></g>`;
  if (o.sepia) s += `<rect width="${W}" height="${H}" fill="#7a5a2a" opacity=".18" style="mix-blend-mode:multiply"/>`;
  s += `<rect width="${W}" height="${H}" fill="url(#fx-oval)"/>`;
  if (o.iris) {
    const [a0, a1, c0, c1] = o.iris, cx = o.cx || W / 2, cy = o.cy || H / 2;
    const r = lerp(lerp(160, 1300, ease.out(prog(t, a0, a1))), 0, ease.inOut(prog(t, c0, c1)));
    if (r < 1290) s += `<path fill-rule="evenodd" d="M-20,-20 H${W + 20} V${H + 20} H-20 Z M${cx},${cy - r} a${r},${r} 0 1,0 .1,0 Z" fill="#000"/>`;
  }
  s += `<rect width="${W}" height="${H}" fill="#000" opacity="${flick}"/>` + filmDamage(t, o);
  return s;
}
// Silent-film intertitle card ("O GECE...")
function intertitle(t, lines, o = {}) {
  const ink = '#ece8dd';
  let s = `<rect x="-20" y="-20" width="${W + 40}" height="${H + 40}" fill="#0b0b0b"/>
   <rect x="110" y="560" width="860" height="800" fill="none" stroke="${ink}" stroke-width="6"/>
   <rect x="134" y="584" width="812" height="752" fill="none" stroke="${ink}" stroke-width="2"/>`;
  [[134, 584, 1, 1], [946, 584, -1, 1], [134, 1336, 1, -1], [946, 1336, -1, -1]].forEach(([x, y, a, b]) => {
    s += `<path transform="translate(${x} ${y}) scale(${a} ${b})" d="M0,96 C20,50 50,20 96,0 M26,70 C12,40 40,12 70,26 C80,50 50,76 26,70 Z" fill="none" stroke="${ink}" stroke-width="3"/>`;
  });
  const size = o.size || 96, y0 = 960 - (lines.length - 1) * size * .6;
  lines.forEach((l, i) => { s += txt(W / 2, y0 + i * size * 1.2, l, { size: i === 0 && o.small ? size * .6 : size, fill: ink, family: SERIF, weight: 700, ls: 4 }); });
  s += `<path d="M340,${y0 + lines.length * size * 1.2 - 20} H500 M580,${y0 + lines.length * size * 1.2 - 20} H740" stroke="${ink}" stroke-width="4"/>
        <path d="M540,${y0 + lines.length * size * 1.2 - 34} l14,14 l-14,14 l-14,-14Z" fill="${ink}"/>`;
  return s;
}

// ---------- BLUEPRINT / EVIDENCE DIAGRAM ----------
const BP = '#eef6ff', BPBG = '#123f7f';
function blueprintBg(o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="${BPBG}"/><rect width="${W}" height="${H}" fill="url(#bp-g)"/><rect width="${W}" height="${H}" fill="url(#bp-G)"/>
    <rect width="${W}" height="${H}" filter="url(#bp-m)" opacity=".6"/>`;
  if (o.frame !== false) {
    s += `<g filter="url(#bp-c)"><rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="none" stroke="${BP}" stroke-width="4"/><rect x="50" y="50" width="${W - 100}" height="${H - 100}" fill="none" stroke="${BP}" stroke-width="2"/>`;
    for (let i = 0; i < 7; i++) { const x = 34 + (W - 68) * i / 6; s += `<path d="M${x},34v16M${x},${H - 50}v16" stroke="${BP}" stroke-width="2"/>`; }
    // title block bottom-right
    if (o.title) s += `<rect x="${W - 470}" y="${H - 200}" width="420" height="150" fill="${BPBG}" stroke="${BP}" stroke-width="3"/>
      <path d="M${W - 470},${H - 150}H${W - 50}M${W - 470},${H - 100}H${W - 50}" stroke="${BP}" stroke-width="2"/>
      ${txt(W - 455, H - 164, o.title, { size: 26, fill: BP, anchor: 'start', family: MONO, weight: 700, ls: 2 })}
      ${txt(W - 455, H - 114, o.sub || 'KOMİSER KUZGUN · DELİL', { size: 20, fill: BP, anchor: 'start', family: MONO, weight: 700, ls: 2 })}
      ${txt(W - 455, H - 64, o.code || 'ÖLÇEK 1:20', { size: 20, fill: BP, anchor: 'start', family: MONO, weight: 700, ls: 2 })}`;
    s += '</g>';
  }
  return s;
}
// wrap drafted linework in the chalky line filter
const bpInk = inner => `<g filter="url(#bp-c)">${inner}</g>`;
const bpPath = (d, w = 5, o = {}) => `<path d="${d}" fill="none" stroke="${o.color || BP}" stroke-width="${w}" stroke-linejoin="miter" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''} ${o.draw != null ? `pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - clamp(o.draw)}"` : ''} opacity="${o.opacity ?? 1}"/>`;
function arrowHead(x, y, a, s = 22, col = BP) {
  const c = Math.cos(a), n = Math.sin(a);
  return `<path d="M${x},${y}L${x - c * s - n * s * .3},${y - n * s + c * s * .3}L${x - c * s + n * s * .3},${y - n * s - c * s * .3}Z" fill="${col}"/>`;
}
// arrow from (x1,y1) to (x2,y2), drawn progressively with k
function bpArrow(x1, y1, x2, y2, k = 1, o = {}) {
  const x = lerp(x1, x2, k), y = lerp(y1, y2, k), a = Math.atan2(y2 - y1, x2 - x1), col = o.color || BP;
  return `<path d="M${x1},${y1}L${x},${y}" stroke="${col}" stroke-width="${o.w || 5}" fill="none" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''}/>` + (k > .05 ? arrowHead(x, y, a, o.head || 24, col) : '');
}
// dimension line with label
function bpDim(x1, y1, x2, y2, label, o = {}) {
  const a = Math.atan2(y2 - y1, x2 - x1), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  return `<g opacity="${o.opacity ?? 1}"><path d="M${x1},${y1}L${x2},${y2}" stroke="${BP}" stroke-width="2"/>${arrowHead(x1, y1, a + Math.PI, 18)}${arrowHead(x2, y2, a, 18)}
    <g transform="translate(${mx} ${my}) rotate(${a * 180 / Math.PI})"><rect x="${-tw(label, 24, .62) / 2 - 10}" y="-18" width="${tw(label, 24, .62) + 20}" height="36" fill="${BPBG}"/>${txt(0, 9, label, { size: 24, fill: BP, family: MONO, weight: 700 })}</g></g>`;
}
const bpLabel = (x, y, s, o = {}) => txt(x, y, s, { size: o.size || 30, fill: o.color || BP, family: MONO, weight: 700, ls: 2, anchor: o.anchor || 'middle' });
// hand-circled highlight (drafting red pencil)
function bpCircle(cx, cy, rx, ry, k, col = '#ff6a5a') {
  const d = `M${cx + rx},${cy} A${rx},${ry} 0 1,1 ${cx + rx - 1},${cy - 6}`;
  return `<path d="${d}" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - clamp(k)}"/>`;
}
