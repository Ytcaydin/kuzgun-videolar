// Komiser Kuzgun render kit — shared helpers for every episode.
// Every scene is a pure function of time t (seconds) that returns an SVG string.
const W = 1080, H = 1920;
const C = {
  bg: '#0b1222', bg2: '#141d33', navy: '#1a2744', gold: '#e8b923', yellow: '#ffd23f',
  red: '#d42a32', red2: '#c8242e', cream: '#efe6d6', paper: '#f4efe2', ink: '#1b1b1b',
  blue: '#2f6fdb', green: '#2fae4e', orange: '#f08a1c', wood: '#5b3a22', skin: '#f2c49b'
};
const FONT = "Inter, 'Inter Display', sans-serif";
const MONO = "'Courier 10 Pitch', Courier, monospace";
const SERIF = "'Crimson Text', Gelasio, serif";

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const ease = {
  out: k => 1 - Math.pow(1 - k, 3),
  inOut: k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2,
  back: k => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
};
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909), (s ^= s >>> 16) >>> 0) / 4294967296); }
function noise1(t, seed = 0) { return (Math.sin(t * 1.3 + seed) * .5 + Math.sin(t * 2.7 + seed * 2.1) * .3 + Math.sin(t * 5.1 + seed * 3.7) * .2); }
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---------- text helpers ----------
function txt(x, y, s, o = {}) {
  const size = o.size || 60, fill = o.fill || '#fff', anchor = o.anchor || 'middle', weight = o.weight || 900;
  const fam = o.family || FONT, ls = o.ls != null ? o.ls : 0;
  const stroke = o.stroke ? `stroke="${o.stroke}" stroke-width="${o.sw || 10}" stroke-linejoin="round" paint-order="stroke"` : '';
  const op = o.opacity != null ? `opacity="${o.opacity}"` : '';
  const st = o.italic ? 'font-style="italic"' : '';
  const tr = o.rot ? `transform="rotate(${o.rot} ${x} ${y})"` : '';
  return `<text x="${x}" y="${y}" font-family="${fam}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${ls}" ${stroke} ${op} ${st} ${tr} filter="${o.filter || ''}">${esc(s)}</text>`;
}
// approximate text width (Inter Black ~0.62em average caps)
function tw(s, size, k = 0.64) { return s.length * size * k; }

// Tilted label ("tag") that pops in.
function tag(t, t0, x, y, s, o = {}) {
  if (t < t0) return '';
  const k = ease.back(prog(t, t0, t0 + .28));
  const size = o.size || 38, pad = 20, w = tw(s, size, .66) + pad * 2, h = size * 1.45;
  const bg = o.bg || C.red, fg = o.fg || '#fff', rot = o.rot != null ? o.rot : -3;
  const sc = lerp(1.6, 1, k), op = clamp(prog(t, t0, t0 + .12));
  const border = o.border || '#fff';
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})" opacity="${op}">
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${bg}" stroke="${border}" stroke-width="4" rx="4"/>
    ${txt(0, size * .36, s, { size, fill: fg, ls: 1 })}</g>`;
}
// Big rubber stamp
function stamp(t, t0, x, y, s, o = {}) {
  if (t < t0) return '';
  const k = ease.out(prog(t, t0, t0 + .18));
  const size = o.size || 110, w = tw(s, size, .68) + 60, h = size * 1.35, col = o.color || C.red;
  const sc = lerp(2.4, 1, k), op = lerp(0, .92, k), rot = o.rot != null ? o.rot : -8;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})" opacity="${op}" filter="url(#rough)">
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="none" stroke="${col}" stroke-width="12" rx="14"/>
    ${txt(0, size * .36, s, { size, fill: col, ls: 3 })}</g>`;
}
function pill(x, y, s, o = {}) {
  const size = o.size || 44, w = tw(s, size, .64) + 56, h = size * 1.6;
  return `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="10" fill="${o.bg || C.red2}"/>
    ${txt(0, size * .36, s, { size, fill: o.fg || C.cream, ls: 2 })}</g>`;
}

// ---------- captions ----------
// words: [[word, start, end], ...] ; chunked 1-2 words
function chunks(words, maxChars = 13) {
  const out = []; let cur = [];
  for (const w of words) {
    const len = cur.map(c => c[0]).join(' ').length;
    if (cur.length && (len + 1 + w[0].length > maxChars || /[.,!?…:]$/.test(cur[cur.length - 1][0]))) { out.push(cur); cur = []; }
    cur.push(w);
  }
  if (cur.length) out.push(cur);
  return out;
}
function caption(t, line, y = 1290, o = {}) {
  if (!line || t < line.start - .05 || t > line.end + .25) return '';
  const ch = chunks(line.words, o.maxChars || 13);
  let cur = ch[0];
  for (const c of ch) if (t >= c[0][1] - .04) cur = c;
  const size = o.size || 74;
  const appear = ease.back(prog(t, cur[0][1] - .04, cur[0][1] + .12));
  const spans = cur.map(w => { const on = t >= w[1] - .04 && t < w[2] + .08; return `<tspan fill="${on ? (o.hi || C.yellow) : '#fff'}">${esc(w[0])}</tspan>`; }).join(' ');
  let s = `<g transform="translate(${W / 2} ${y}) scale(${lerp(.85, 1, appear)})">
    <text x="0" y="0" font-family="${FONT}" font-size="${size}" font-weight="900" text-anchor="middle" stroke="#111" stroke-width="14" stroke-linejoin="round" paint-order="stroke" filter="url(#cshadow)">${spans}</text>`;
  return s + '</g>';
}

// ---------- typewriter statement card ----------
function statement(t, line, x, y, w, h, o = {}) {
  const accent = o.accent || C.blue;
  let s = `<g transform="translate(${x} ${y})">
   <rect x="6" y="10" width="${w}" height="${h}" fill="#000" opacity=".35"/>
   <rect width="${w}" height="${h}" fill="${C.paper}"/>
   <rect width="12" height="${h}" fill="${accent}"/>
   ${txt(40, 46, o.title || 'İFADE TUTANAĞI', { size: 24, fill: '#a33', anchor: 'start', family: MONO, weight: 700, ls: 2 })}`;
  if (line) {
    const text = '"' + line.text + '"';
    // characters revealed in sync with spoken words
    let n = 1;
    for (const [wd, a, b] of line.words) {
      if (t >= b) { n += wd.length + 1; continue; }
      if (t > a) n += Math.round(wd.length * (t - a) / Math.max(.05, b - a));
      break;
    }
    n = clamp(n, 0, text.length);
    if (t > line.end) n = text.length;
    const shown = text.slice(0, n);
    const size = o.size || 40, perLine = Math.floor((w - 80) / (size * .6));
    const rows = []; let row = '';
    for (const word of shown.split(' ')) {
      if ((row + ' ' + word).trim().length > perLine) { rows.push(row.trim()); row = word; } else row += ' ' + word;
    }
    rows.push(row.trim());
    rows.forEach((r, i) => { s += txt(40, 110 + i * size * 1.3, r, { size, fill: C.ink, anchor: 'start', family: MONO, weight: 700 }); });
    const blink = Math.floor(t * 3) % 2 === 0 && n < text.length;
    if (blink) { const lr = rows[rows.length - 1]; s += `<rect x="${44 + lr.length * size * .6}" y="${110 + (rows.length - 1) * size * 1.3 - size * .8}" width="${size * .5}" height="${size}" fill="${C.ink}"/>`; }
  }
  return s + '</g>';
}

// ---------- shared scene furniture ----------
function progressBar(t, idx, n, k) {
  // dashes at top, gold for completed, current fills
  const w = 860, gap = 14, dw = (w - gap * (n - 1)) / n, x0 = (W - w) / 2, y = 128;
  let s = '';
  for (let i = 0; i < n; i++) {
    const fill = i < idx ? 1 : i === idx ? k : 0;
    s += `<rect x="${x0 + i * (dw + gap)}" y="${y}" width="${dw}" height="8" rx="4" fill="#ffffff" opacity=".18"/>`;
    if (fill > 0) s += `<rect x="${x0 + i * (dw + gap)}" y="${y}" width="${dw * fill}" height="8" rx="4" fill="${C.gold}"/>`;
  }
  return s;
}
function header(s, y = 210, col = '#cfd6e6') { return txt(W / 2, y, s, { size: 44, fill: col, ls: 2 }); }
function chip(s, y = 160) {
  const size = 30, w = tw(s, size, .62) + 40;
  return `<rect x="${W / 2 - w / 2}" y="${y - 30}" width="${w}" height="44" rx="10" fill="${C.red2}"/>` + txt(W / 2, y + 2, s, { size, fill: C.cream, ls: 1 });
}
function spotlight(op = 1) {
  return `<g opacity="${op}"><path d="M470 0 L610 0 L940 1500 L140 1500 Z" fill="url(#beam)"/>
    <ellipse cx="540" cy="0" rx="60" ry="26" fill="#111"/></g>`;
}
function interroWall() {
  let s = `<rect width="${W}" height="${H}" fill="#0d1322"/>`;
  for (let y = 260; y < 1240; y += 62) s += `<rect x="90" y="${y}" width="900" height="3" fill="#ffffff" opacity=".07"/>`;
  s += `<rect y="1290" width="${W}" height="630" fill="url(#woodg)"/>
        <rect y="1290" width="${W}" height="10" fill="#7a5233" opacity=".8"/>`;
  return s;
}
function dust(t, seed = 3, n = 40, op = .5) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const x0 = r() * W, y0 = r() * H, sp = 8 + r() * 25, sz = 1.5 + r() * 3;
    const x = (x0 + Math.sin(t * .4 + i) * 30), y = ((y0 - t * sp) % H + H) % H;
    s += `<circle cx="${x}" cy="${y}" r="${sz}" fill="#fff" opacity="${op * (0.3 + r() * .7)}"/>`;
  }
  return s;
}

// ---------- defs ----------
function defs() {
  return `<defs>
  <filter id="cshadow" x="-20%" y="-50%" width="140%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000" flood-opacity=".6"/></filter>
  <filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5"/></filter>
  <filter id="grainy" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="saturate" values="0" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in" result="gi"/><feBlend in="SourceGraphic" in2="gi" mode="multiply"/></filter>
  <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".55"/><stop offset=".55" stop-color="#ffe9a8" stop-opacity=".16"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></linearGradient>
  <linearGradient id="woodg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3020"/><stop offset="1" stop-color="#1c120b"/></linearGradient>
  <linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b18"/><stop offset=".6" stop-color="#16213f"/><stop offset="1" stop-color="#26335a"/></linearGradient>
  <linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0f22"/><stop offset=".55" stop-color="#2a2f55"/><stop offset=".85" stop-color="#6b4a5e"/><stop offset="1" stop-color="#b0705a"/></linearGradient>
  <radialGradient id="vig" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></radialGradient>
  <radialGradient id="lamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffcf6b" stop-opacity=".9"/><stop offset="1" stop-color="#ffcf6b" stop-opacity="0"/></radialGradient>
  <radialGradient id="alarmg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff2a2a" stop-opacity=".85"/><stop offset="1" stop-color="#ff2a2a" stop-opacity="0"/></radialGradient>
  <linearGradient id="copper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0a86a"/><stop offset=".5" stop-color="#c86a32"/><stop offset="1" stop-color="#7a3a1a"/></linearGradient>
  <linearGradient id="goldg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0a0"/><stop offset=".5" stop-color="#e8b923"/><stop offset="1" stop-color="#9a6a10"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfe3ff" stop-opacity=".35"/><stop offset="1" stop-color="#6fa8d8" stop-opacity=".12"/></linearGradient>
  </defs>`;
}

// ---------- scene sequencing ----------
// scenes: [{a, b, draw(t, lt, k), shake}] ; whip transition at each boundary
function compose(t, scenes, o = {}) {
  let out = '';
  const WH = .2;
  for (let i = 0; i < scenes.length; i++) {
    const sc = scenes[i];
    const a = sc.a - (i ? WH / 2 : 0), b = sc.b + (i < scenes.length - 1 ? WH / 2 : 0);
    if (t < a || t > b) continue;
    let dx = 0, blur = 0;
    if (i && t < sc.a + WH / 2) { const k = prog(t, sc.a - WH / 2, sc.a + WH / 2); dx = lerp(W * .9, 0, ease.out(k)); blur = (1 - k) * 18; }
    if (i < scenes.length - 1 && t > sc.b - WH / 2) { const k = prog(t, sc.b - WH / 2, sc.b + WH / 2); dx = lerp(0, -W * .9, ease.inOut(k)); blur = k * 18; }
    const sh = sc.shake === false ? 0 : (sc.shake || 1);
    const sx = noise1(t * .9, i * 7) * 7 * sh, sy = noise1(t * .8, i * 13 + 2) * 7 * sh, sr = noise1(t * .6, i * 5 + 9) * .35 * sh;
    const zoom = sc.zoom ? sc.zoom(t) : 1 + .025 * prog(t, sc.a, sc.b);
    const lt = t - sc.a, k = prog(t, sc.a, sc.b);
    out += `<g transform="translate(${dx} 0)" ${blur > .5 ? `filter="url(#mb${Math.round(blur)})"` : ''}>
      <g transform="translate(${W / 2 + sx} ${H / 2 + sy}) rotate(${sr}) scale(${zoom}) translate(${-W / 2} ${-H / 2})">${sc.draw(t, lt, k)}</g></g>`;
  }
  return out;
}
function blurDefs() { let s = '<defs>'; for (let i = 1; i <= 18; i++) s += `<filter id="mb${i}" x="-10%" y="0" width="120%" height="100%"><feGaussianBlur stdDeviation="${i} 0"/></filter>`; return s + '</defs>'; }

function frame(t, body, overlay = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs()}${blurDefs()}${typeof fxDefs === 'function' ? fxDefs() : ''}
  <rect width="${W}" height="${H}" fill="${C.bg}"/>${body}${overlay}
  <rect width="${W}" height="${H}" fill="url(#vig)"/></svg>`;
}
function lineAt(TL, i) { return TL.lines[i]; }
