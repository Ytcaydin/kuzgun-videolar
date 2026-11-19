// Characters: Komiser Kuzgun + parametric suspect busts.
// All drawn around (0,0); caller wraps in translate/scale.

function blinkK(t, seed = 0) { const p = (t + seed * 1.37) % 3.6; return p < .12 ? Math.abs(p - .06) / .06 : 1; }
function talkK(t, speaking) { return speaking ? .35 + .65 * Math.abs(Math.sin(t * 13) * Math.sin(t * 7.3 + 1)) : 0; }

function kuzgun(t, o = {}) {
  const bl = blinkK(t, 2), talk = talkK(t, o.speaking), glow = .75 + .25 * Math.sin(t * 2.2);
  const crowBob = Math.sin(t * 1.7) * 4 + (Math.floor(t * .7) % 4 === 0 ? Math.sin(t * 20) * 3 : 0);
  return `<g>
  <!-- coat -->
  <path d="M-330 340 C-320 170 -230 110 -120 90 L120 90 C230 110 320 170 330 340 Z" fill="#262c3b"/>
  <path d="M-120 92 L-40 300 L0 160 L40 300 L120 92 L70 80 L0 150 L-70 80 Z" fill="#363e54"/>
  <path d="M-60 95 L0 160 L60 95 L40 88 L0 125 L-40 88 Z" fill="#f2efe8"/>
  <path d="M0 128 L-16 150 L-9 330 L0 345 L9 330 L16 150 Z" fill="#c4202b"/>
  <path d="M-12 128 L12 128 L8 148 L-8 148 Z" fill="#9d1820"/>
  <!-- neck -->
  <rect x="-48" y="40" width="96" height="70" fill="#a98d72"/>
  <!-- head -->
  <path d="M-108 -110 C-112 -10 -95 60 -55 88 C-25 108 25 108 55 88 C95 60 112 -10 108 -110 Z" fill="#c8a889"/>
  <path d="M-100 -20 C-95 50 -60 92 0 100 C60 92 95 50 100 -20 C80 30 50 55 0 58 C-50 55 -80 30 -100 -20Z" fill="#7d6a5a" opacity=".45" filter="url(#grainy)"/>
  <ellipse cx="-112" cy="-40" rx="16" ry="30" fill="#b89878"/><ellipse cx="112" cy="-40" rx="16" ry="30" fill="#b89878"/>
  <!-- brows -->
  <path d="M-82 -78 L-20 -62 L-22 -50 L-84 -64Z" fill="#2a2018"/><path d="M82 -78 L20 -62 L22 -50 L84 -64Z" fill="#2a2018"/>
  <!-- eyes -->
  <g transform="translate(0 -38) scale(1 ${bl})" filter="url(#glow)">
    <path d="M-76 0 Q-50 -16 -24 -2 Q-50 10 -76 0Z" fill="#ffe14a" opacity="${glow}"/>
    <path d="M76 0 Q50 -16 24 -2 Q50 10 76 0Z" fill="#ffe14a" opacity="${glow}"/>
  </g>
  <!-- nose -->
  <path d="M-4 -40 L-18 18 L4 22 Z" fill="#a98a6d"/>
  <!-- mustache + mouth -->
  <path d="M-58 44 C-30 28 30 28 58 44 C40 50 20 44 0 46 C-20 44 -40 50 -58 44Z" fill="#2a2018" transform="translate(0 ${-talk * 3})"/>
  <ellipse cx="0" cy="${60 + talk * 3}" rx="${22 - talk * 6}" ry="${2 + talk * 7}" fill="#3a1e18"/>
  <!-- hat -->
  <ellipse cx="0" cy="-118" rx="190" ry="34" fill="#14151b"/>
  <path d="M-118 -120 C-120 -200 -95 -250 0 -255 C95 -250 120 -200 118 -120 Z" fill="#1b1c24"/>
  <path d="M-40 -250 C-20 -232 20 -232 40 -250" stroke="#0c0d12" stroke-width="10" fill="none"/>
  <path d="M-119 -150 L119 -150 L118 -122 L-118 -122Z" fill="#b3202a"/>
  <ellipse cx="0" cy="-122" rx="190" ry="10" fill="#0c0d12" opacity=".6"/>
  <!-- crow on right shoulder -->
  <g transform="translate(230 ${120 + crowBob})">
    <path d="M-60 60 C-70 0 -30 -40 10 -40 C50 -40 70 0 60 60 C30 90 -30 90 -60 60Z" fill="#101118"/>
    <path d="M40 40 L110 110 L30 80Z" fill="#0b0c11"/>
    <g transform="rotate(${Math.sin(t * 1.3) * 6} 0 -50)">
      <circle cx="0" cy="-60" r="40" fill="#121319"/>
      <path d="M-34 -64 L-80 -52 L-34 -46Z" fill="#2a2b33"/>
      <circle cx="-14" cy="-68" r="7" fill="#ffd23f"/>
    </g>
    <path d="M-10 86 L-14 110 M14 86 L18 110" stroke="#2a2b33" stroke-width="6"/>
  </g>
  </g>`;
}

// Parametric suspect bust. o: {skin, hair, style, mustache, glasses, top, topType, hat, earrings, necklace, flour, beard}
function person(t, o = {}) {
  const skin = o.skin || C.skin, hair = o.hair || '#2b1d14', bl = blinkK(t, o.seed || 0), talk = talkK(t, o.speaking);
  const top = o.top || '#5a6b8a';
  let s = '<g>';
  // body / clothing
  if (o.topType === 'vest') {
    s += `<path d="M-210 330 C-205 180 -150 120 -70 105 L70 105 C150 120 205 180 210 330Z" fill="#f4f1ea"/>
      <path d="M-210 330 C-205 180 -150 120 -70 105 L-25 330Z" fill="${top}"/><path d="M210 330 C205 180 150 120 70 105 L25 330Z" fill="${top}"/>
      <circle cx="-38" cy="230" r="6" fill="#d9b25a"/><circle cx="-42" cy="285" r="6" fill="#d9b25a"/>
      <path d="M-30 108 L0 150 L30 108" fill="none" stroke="#d8d2c4" stroke-width="6"/>
      <path d="M150 210 Q170 200 175 230" stroke="#d9b25a" stroke-width="4" fill="none"/>`;
  } else if (o.topType === 'blazer') {
    s += `<path d="M-210 330 C-205 180 -150 120 -70 105 L70 105 C150 120 205 180 210 330Z" fill="${top}"/>
      <path d="M-60 105 L0 230 L60 105Z" fill="#f1e6da"/>
      <path d="M-70 105 L-10 250 L-60 330 L-110 140Z" fill="#000" opacity=".18"/><path d="M70 105 L10 250 L60 330 L110 140Z" fill="#000" opacity=".18"/>`;
  } else if (o.topType === 'uniform') {
    s += `<path d="M-210 330 C-205 180 -150 120 -70 105 L70 105 C150 120 205 180 210 330Z" fill="${top}"/>
      <path d="M-48 105 L0 160 L48 105 L30 100 L0 132 L-30 100Z" fill="#c9d2e6"/>
      <path d="M0 160 L0 330" stroke="#0e1830" stroke-width="5"/>
      <circle cx="0" cy="200" r="7" fill="#d9b25a"/><circle cx="0" cy="260" r="7" fill="#d9b25a"/><circle cx="0" cy="318" r="7" fill="#d9b25a"/>
      <rect x="-150" y="190" width="100" height="40" rx="6" fill="#d9b25a"/>${txt(-100, 220, 'BEKÇİ', { size: 24, fill: '#1a2744' })}
      <path d="M60 200 Q110 230 120 290" stroke="#c9c9c9" stroke-width="4" fill="none"/><rect x="108" y="285" width="34" height="16" rx="6" fill="#c9c9c9"/>
      <path d="M-200 200 L-150 150 M200 200 L150 150" stroke="#d9b25a" stroke-width="10"/>`;
  } else if (o.topType === 'baker') {
    s += `<path d="M-210 330 C-205 180 -150 120 -70 105 L70 105 C150 120 205 180 210 330Z" fill="#f2f0ea"/>
      <path d="M-40 105 Q0 135 40 105" stroke="#d0ccc0" stroke-width="8" fill="none"/>
      <circle cx="-90" cy="240" r="30" fill="#fff" opacity=".7"/><circle cx="110" cy="200" r="22" fill="#fff" opacity=".7"/><circle cx="60" cy="290" r="18" fill="#e9e3d2"/>
      <path d="M-140 330 L-120 200 M140 330 L120 200" stroke="#d6d1c3" stroke-width="5"/>`;
  } else {
    s += `<path d="M-210 330 C-205 180 -150 120 -70 105 L70 105 C150 120 205 180 210 330Z" fill="${top}"/>`;
  }
  if (o.necklace) s += `<path d="M-55 112 Q0 175 55 112" stroke="#f5f0e0" stroke-width="9" stroke-dasharray="2 12" stroke-linecap="round" fill="none"/>`;
  // neck & head
  s += `<rect x="-42" y="50" width="84" height="66" fill="${skin}"/><rect x="-42" y="50" width="84" height="22" fill="#000" opacity=".12"/>`;
  if (o.style === 'bob') s += `<path d="M-138 -40 C-150 -170 150 -170 138 -40 L140 90 L80 90 L80 -40 L-80 -40 L-80 90 L-140 90Z" fill="${hair}"/>`;
  s += `<ellipse cx="-118" cy="-10" rx="20" ry="30" fill="${skin}"/><ellipse cx="118" cy="-10" rx="20" ry="30" fill="${skin}"/>
        <ellipse cx="0" cy="-20" rx="120" ry="130" fill="${skin}"/>`;
  // hair styles
  if (o.style === 'bald') s += `<path d="M-122 -10 C-128 -60 -110 -95 -92 -100 L-88 -40 C-100 -30 -110 -20 -122 -10Z" fill="${hair}"/><path d="M122 -10 C128 -60 110 -95 92 -100 L88 -40 C100 -30 110 -20 122 -10Z" fill="${hair}"/>
        <path d="M-60 -125 Q0 -150 60 -125" stroke="#fff" stroke-width="8" opacity=".25" fill="none"/>`;
  if (o.style === 'messy') s += `<path d="M-125 -40 C-140 -120 -80 -175 0 -170 C90 -175 140 -120 125 -40 C110 -90 90 -100 60 -95 L70 -120 L30 -100 L20 -130 L-10 -100 L-30 -125 L-50 -95 C-90 -100 -110 -80 -125 -40Z" fill="${hair}"/>`;
  if (o.style === 'short') s += `<path d="M-122 -30 C-130 -130 -60 -165 0 -162 C60 -165 130 -130 122 -30 C110 -80 90 -100 0 -105 C-90 -100 -110 -80 -122 -30Z" fill="${hair}"/>`;
  if (o.style === 'bob') s += `<path d="M-125 -20 C-135 -140 -40 -170 20 -160 C100 -155 140 -110 125 -20 C110 -90 60 -120 -10 -110 C-60 -100 -100 -70 -125 -20Z" fill="${hair}"/>`;
  // face
  const ey = -10;
  s += `<path d="M-72 ${ey - 42} L-28 ${ey - 38}" stroke="${o.brow || hair}" stroke-width="10" stroke-linecap="round"/><path d="M72 ${ey - 42} L28 ${ey - 38}" stroke="${o.brow || hair}" stroke-width="10" stroke-linecap="round"/>`;
  s += `<g transform="translate(0 ${ey}) scale(1 ${bl})"><ellipse cx="-48" cy="0" rx="11" ry="13" fill="#1b1410"/><ellipse cx="48" cy="0" rx="11" ry="13" fill="#1b1410"/>
        <circle cx="-44" cy="-4" r="3.5" fill="#fff"/><circle cx="52" cy="-4" r="3.5" fill="#fff"/></g>`;
  if (o.glasses) s += `<g fill="none" stroke="#2a2a2a" stroke-width="7"><circle cx="-48" cy="${ey}" r="32"/><circle cx="48" cy="${ey}" r="32"/><path d="M-16 ${ey - 4} L16 ${ey - 4}"/></g>`;
  if (o.lines) s += `<path d="M-78 ${ey + 18} q8 6 0 12 M78 ${ey + 18} q-8 6 0 12 M-40 -112 q40 -10 80 0" stroke="#000" opacity=".18" stroke-width="4" fill="none"/>`;
  s += `<path d="M-6 ${ey + 20} Q-14 ${ey + 48} 4 ${ey + 50}" stroke="#000" opacity=".25" stroke-width="5" fill="none"/>`;
  s += `<ellipse cx="-74" cy="${ey + 50}" rx="20" ry="11" fill="#e8707a" opacity=".45"/><ellipse cx="74" cy="${ey + 50}" rx="20" ry="11" fill="#e8707a" opacity=".45"/>`;
  if (o.beard) s += `<path d="M-100 20 C-90 110 -40 125 0 125 C40 125 90 110 100 20 C80 70 40 85 0 85 C-40 85 -80 70 -100 20Z" fill="${hair}" opacity=".35"/>`;
  const my = ey + 82;
  if (o.mustache) s += `<path d="M-50 ${my - 12} C-30 ${my - 28} 30 ${my - 28} 50 ${my - 12} C30 ${my - 6} 0 ${my - 14} -50 ${my - 12}Z" fill="${o.mustache}" transform="translate(0 ${-talk * 3})"/>`;
  s += talk > .05 ? `<ellipse cx="0" cy="${my + 4}" rx="${20 - talk * 4}" ry="${3 + talk * 10}" fill="#5a1f1f"/>` : `<path d="M-22 ${my} Q0 ${my + (o.smile || 6)} 22 ${my}" stroke="#5a1f1f" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  if (o.lipstick) s = s.replace(/#5a1f1f/g, '#b0303c');
  if (o.earrings) s += `<circle cx="-118" cy="22" r="10" fill="url(#goldg)"/><circle cx="118" cy="22" r="10" fill="url(#goldg)"/>`;
  if (o.flour) s += `<circle cx="70" cy="-60" r="10" fill="#fff" opacity=".75"/><circle cx="84" cy="-46" r="6" fill="#fff" opacity=".6"/>`;
  // hats
  if (o.hat === 'bekci') s += `<path d="M-128 -86 C-120 -170 120 -170 128 -86Z" fill="#1d2b4f"/><rect x="-140" y="-96" width="280" height="26" rx="8" fill="#13203d"/>
      <path d="M-120 -72 Q0 -40 120 -72 L130 -60 Q0 -20 -130 -60Z" fill="#0b1226"/><circle cx="0" cy="-122" r="18" fill="#d9b25a"/>`;
  if (o.hat === 'cap') s += `<path d="M-125 -70 C-125 -175 125 -175 125 -70Z" fill="${o.hatColor || '#333'}"/><path d="M-125 -72 L-200 -60 L-125 -52Z" fill="${o.hatColor || '#333'}"/>`;
  return s + '</g>';
}

// Polaroid card with portrait
function polaroid(t, x, y, w, name, drawFn, o = {}) {
  const h = w * 1.18, rot = o.rot || 0;
  let s = `<g transform="translate(${x} ${y}) rotate(${rot})">
   <rect x="${-w / 2 + 6}" y="${-h / 2 + 10}" width="${w}" height="${h}" fill="#000" opacity=".35"/>
   <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#f6f2e8" stroke="${o.border || 'none'}" stroke-width="8"/>
   <rect x="${-w / 2 + 14}" y="${-h / 2 + 14}" width="${w - 28}" height="${w - 28}" fill="#0f1628"/>
   <clipPath id="pc${name}"><rect x="${-w / 2 + 14}" y="${-h / 2 + 14}" width="${w - 28}" height="${w - 28}"/></clipPath>
   <g clip-path="url(#pc${name})"><g transform="translate(0 ${-h / 2 + 14 + (w - 28) * .62}) scale(${(w - 28) / 520})">${drawFn(t)}</g></g>
   ${txt(0, h / 2 - 26, name, { size: w * .15, fill: '#333', family: SERIF, weight: 700, italic: true })}`;
  if (o.num) s += `<circle cx="${w / 2 - 8}" cy="${-h / 2 + 8}" r="${w * .1}" fill="${o.numColor || C.blue}" stroke="#fff" stroke-width="5"/>${txt(w / 2 - 8, -h / 2 + 8 + w * .055, String(o.num), { size: w * .13, fill: '#fff' })}`;
  return s + '</g>';
}
// Name plate under interrogation bust
function plate(x, y, name, role, color, num) {
  const w = 420, h = 96;
  let s = `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#0b0f18" stroke="${color}" stroke-width="5"/>
   ${txt(0, 6, name, { size: 56, fill: color, ls: 1 })}${txt(0, 36, role, { size: 20, fill: '#cfd6e6', family: MONO, weight: 700, ls: 3 })}`;
  if (num) s += `<circle cx="${-w / 2 - 20}" cy="-8" r="34" fill="${color}" stroke="#fff" stroke-width="5"/>${txt(-w / 2 - 20, 6, String(num), { size: 40, fill: '#fff' })}`;
  return s + '</g>';
}
