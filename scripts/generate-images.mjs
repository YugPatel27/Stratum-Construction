/**
 * Generates the placeholder project imagery for the site.
 *
 * Every scene is drawn as an SVG elevation (flat, layered, lit windows) in the Stratum palette,
 * rendered to /public/img/<slug>.webp (1600w) plus a 640w variant, and written into
 * src/data/images.json so imgProps() can build srcset + intrinsic sizes.
 *
 * Replace any of them with a real site photo: drop <slug>.webp (1600w) in /public/img, then run
 * `npm run generate:images -- --manifest-only` is NOT needed; just add the slug to images.json.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'img');
const W = 1600;
const H = 1000;

/* palette */
const C = {
  slab: '#dedbd4', pour: '#c6c2b9', hoarding: '#1b1c1e', deep: '#101113', spruce: '#2b2e31', moss: '#4a4f52',
  ply: '#d9bd8a', plyDark: '#a98a58', survey: '#c9a96e', ink: '#0e0f10', glass: '#8fa1ab', sky: '#c9ccc9', white: '#f2f0ea',
};

/* seeded random so every build produces identical art */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rect = (x, y, w, h, fill, extra = '') => `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${fill}" ${extra}/>`;
const line = (x1, y1, x2, y2, stroke, sw = 2, extra = '') => `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;

function sky(stops, extra = '') {
  const s = stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('');
  return `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">${s}</linearGradient></defs>${rect(0, 0, W, H, 'url(#sky)')}${extra}`;
}

/* faint drawing grid + survey ticks on top of every scene: ties the art to the blueprint motif */
function sheet(rand, tone = 'rgba(255,255,255,.07)') {
  let g = '';
  for (let x = 100; x < W; x += 100) g += line(x, 0, x, H, tone, 1);
  for (let y = 100; y < H; y += 100) g += line(0, y, W, y, tone, 1);
  return g;
}

function sun(cx, cy, r, fill, op = 0.9) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${op}"/>`;
}

/* a facade: floors x bays of windows, some lit */
function facade({ x, y, w, h, floors, bays, rand, body, glass, lit, litChance = 0.28, mullion }) {
  let s = rect(x, y, w, h, body);
  const fh = h / floors;
  const bw = w / bays;
  for (let f = 0; f < floors; f += 1) {
    for (let b = 0; b < bays; b += 1) {
      const isLit = rand() < litChance;
      s += rect(x + b * bw + bw * 0.14, y + f * fh + fh * 0.2, bw * 0.72, fh * 0.6, isLit ? lit : glass, isLit ? '' : 'opacity=".85"');
    }
  }
  if (mullion) for (let f = 1; f < floors; f += 1) s += line(x, y + f * fh, x + w, y + f * fh, mullion, 2);
  return s;
}

function ground(y, fill, extra = '') {
  return rect(0, y, W, H - y, fill) + extra;
}

function crane(x, base, h, color = C.ink, jib = 360) {
  const top = base - h;
  let s = '';
  s += line(x, base, x, top, color, 7);
  s += line(x + 14, base, x + 14, top, color, 7);
  for (let y = base; y > top; y -= 30) s += line(x, y, x + 14, y - 30, color, 2.5) + line(x + 14, y, x, y - 30, color, 2.5);
  s += line(x - jib * 0.28, top, x + jib, top, color, 8);
  s += line(x - jib * 0.28, top - 6, x + 7, top - 70, color, 2.5) + line(x + jib, top, x + 7, top - 70, color, 2.5);
  s += rect(x - jib * 0.28, top, 56, 36, color);
  s += line(x + jib * 0.78, top, x + jib * 0.78, top + 130, color, 2.5);
  s += rect(x + jib * 0.78 - 14, top + 130, 28, 20, C.survey);
  return s;
}

/* ───────── scenes ───────── */

const scenes = {
  'aurora-tower'() {
    const r = rng(11);
    let s = sky([[0, '#f1b9a1'], [0.45, '#f0d0a8'], [1, '#cfe0d6']]);
    s += sun(1180, 330, 130, '#fff3d6', 0.85);
    // back skyline
    for (let i = 0; i < 9; i += 1) {
      const w = 110 + r() * 70; const h = 220 + r() * 260; const x = i * 190 - 40;
      s += facade({ x, y: 820 - h, w, h, floors: Math.round(h / 28), bays: 4, rand: r, body: C.moss, glass: '#4f8a7d', lit: '#ffd9a3', litChance: 0.2 });
    }
    s += `<rect x="0" y="0" width="${W}" height="${H}" fill="${C.hoarding}" opacity=".10"/>`;
    // main tower with setbacks
    const tiers = [[640, 330, 320, 560], [690, 190, 220, 450], [735, 90, 130, 230]];
    tiers.forEach(([x, y, w, h], i) => {
      s += facade({ x, y: 820 - h - (i === 0 ? 0 : 0) - 0, w, h, floors: Math.round(h / 26), bays: 5 + (i === 0 ? 2 : 0), rand: r, body: C.hoarding, glass: '#33454d', lit: C.ply, litChance: 0.3, mullion: 'rgba(255,255,255,.08)' });
    });
    s += line(800, 820 - 560 - 120, 800, 820 - 560, C.ink, 4);
    s += rect(795, 820 - 560 - 120, 10, 10, C.survey);
    // low podium
    s += rect(540, 760, 520, 60, C.ink);
    s += facade({ x: 540, y: 760, w: 520, h: 60, floors: 2, bays: 12, rand: r, body: C.ink, glass: '#4a5a62', lit: C.ply, litChance: 0.5 });
    s += crane(1280, 820, 520, C.ink, 330);
    s += ground(820, C.hoarding);
    s += rect(0, 820, W, 8, C.survey);
    return s + sheet(r);
  },

  'riverline-bridge'() {
    const r = rng(23);
    let s = sky([[0, '#cfe0dc'], [0.55, '#eef0e8'], [1, '#dcdfda']]);
    s += sun(300, 260, 90, '#fff8e6', 0.95);
    // far hills
    s += `<path d="M0 640 C 220 520 380 600 560 560 C 760 520 900 620 1100 570 C 1300 520 1450 600 1600 560 L1600 700 L0 700Z" fill="${C.sky}"/>`;
    // water
    s += rect(0, 700, W, 300, C.spruce);
    for (let i = 0; i < 26; i += 1) s += line(r() * W, 720 + r() * 260, r() * W * 0.2 + 200 + r() * W * 0.8, 720 + r() * 260, 'rgba(255,255,255,.12)', 2);
    // deck
    const deckY = 560;
    s += rect(0, deckY, W, 22, C.hoarding);
    s += rect(0, deckY - 8, W, 8, C.pour);
    // piers
    [380, 800, 1220].forEach((x) => { s += rect(x - 16, deckY, 32, 190, C.pour) + rect(x - 22, 690, 44, 30, C.pour); });
    // towers + cables
    [[560, 150], [1040, 150]].forEach(([x, top]) => {
      s += rect(x - 14, top, 28, deckY - top, C.hoarding) + rect(x - 8, top - 22, 16, 22, C.survey);
      for (let i = 1; i <= 9; i += 1) {
        const t = i / 9;
        s += line(x, top + 40 + t * 110, x - 90 - i * 52, deckY, 'rgba(13,27,24,.75)', 2.2);
        s += line(x, top + 40 + t * 110, x + 90 + i * 52, deckY, 'rgba(13,27,24,.75)', 2.2);
      }
    });
    // railing posts
    for (let x = 10; x < W; x += 26) s += line(x, deckY - 8, x, deckY - 30, C.hoarding, 2);
    s += line(0, deckY - 30, W, deckY - 30, C.hoarding, 2);
    // reflection of towers
    [[560], [1040]].forEach(([x]) => { s += rect(x - 12, 722, 24, 180, 'rgba(255,255,255,.08)'); });
    // traffic
    for (let i = 0; i < 7; i += 1) s += rect(60 + i * 210 + r() * 40, deckY - 30, 54, 22, i % 3 === 0 ? C.survey : i % 3 === 1 ? C.ply : C.white, 'rx="5"');
    return s + sheet(r, 'rgba(13,27,24,.05)');
  },

  'meridian-business-park'() {
    const r = rng(37);
    let s = sky([[0, '#b9d2d0'], [0.7, '#e6ebe3'], [1, '#e6ebe3']]);
    s += sun(1300, 220, 80, '#ffffff', 0.7);
    s += ground(780, C.pour);
    // blocks
    const blocks = [[120, 300, 380, 480], [430, 220, 420, 560], [800, 320, 360, 460], [1110, 250, 400, 530]];
    blocks.forEach(([x, y, w, h], i) => {
      const fl = Math.round(h / 52);
      s += rect(x + 14, y + 10, w, h, 'rgba(13,27,24,.18)');
      s += rect(x, y, w, h, i % 2 ? C.hoarding : C.white);
      for (let f = 0; f < fl; f += 1) {
        s += rect(x, y + f * (h / fl) + (h / fl) * 0.18, w, (h / fl) * 0.58, i % 2 ? '#29655c' : '#9fc1bd');
        if (f % 2 === 0) s += rect(x, y + f * (h / fl) + (h / fl) * 0.78, w, 6, i % 2 ? C.ply : C.pour);
      }
      for (let v = 1; v < 9; v += 1) s += line(x + (w / 9) * v, y, x + (w / 9) * v, y + h, i % 2 ? 'rgba(255,255,255,.14)' : 'rgba(13,27,24,.16)', 2);
      s += rect(x + w * 0.4, y + h - 70, w * 0.2, 70, C.ink);
    });
    // trees
    for (let i = 0; i < 18; i += 1) {
      const x = 30 + i * 90 + r() * 30; const rr = 28 + r() * 22;
      s += rect(x - 3, 760, 6, 36, C.plyDark) + `<circle cx="${x}" cy="${745 - rr * 0.2}" r="${rr}" fill="${i % 3 ? C.moss : C.spruce}"/>`;
    }
    // forecourt lines
    for (let x = 60; x < W; x += 120) s += rect(x, 880, 70, 8, C.white, 'opacity=".7"');
    s += rect(0, 780, W, 6, C.survey);
    return s + sheet(r, 'rgba(13,27,24,.05)');
  },

  'harbor-logistics-hub'() {
    const r = rng(41);
    let s = sky([[0, '#e8c7a0'], [0.55, '#e9d9bd'], [1, '#d6ddd4']]);
    s += sun(1320, 300, 120, '#fff0cc', 0.8);
    s += ground(760, C.pour);
    // sawtooth warehouse
    s += rect(120, 470, 1000, 290, C.hoarding);
    for (let i = 0; i < 7; i += 1) {
      const x = 120 + i * 143;
      s += `<path d="M${x} 470 L${x} 400 L${x + 143} 470Z" fill="${C.spruce}"/>`;
      s += `<path d="M${x} 400 L${x + 143} 470 L${x + 143} 452 L${x + 18} 400Z" fill="${C.glass}" opacity=".7"/>`;
    }
    for (let i = 0; i < 8; i += 1) s += rect(150 + i * 120, 600, 90, 160, C.ink) + rect(156 + i * 120, 606, 78, 154, i % 2 ? C.ply : C.plyDark);
    for (let i = 0; i < 8; i += 1) for (let j = 0; j < 8; j += 1) s += line(156 + i * 120, 606 + j * 19, 234 + i * 120, 606 + j * 19, 'rgba(13,27,24,.35)', 2);
    s += rect(120, 470, 1000, 10, C.survey);
    // container stacks
    const cols = [C.survey, C.ply, C.spruce, C.pour, C.moss, C.white];
    for (let i = 0; i < 6; i += 1) for (let j = 0; j < 3 + (i % 3); j += 1) {
      const x = 1160 + (i % 2) * 150; const y = 700 - j * 56 - Math.floor(i / 2) * 0; const cx = 1160 + (i % 3) * 128;
      s += rect(cx, 704 - j * 58 - (i > 2 ? 0 : 0), 120, 54, cols[(i + j * 2) % cols.length]);
      for (let k = 1; k < 8; k += 1) s += line(cx + k * 15, 704 - j * 58, cx + k * 15, 758 - j * 58, 'rgba(13,27,24,.25)', 2);
    }
    // gantry
    s += rect(1100, 330, 12, 430, C.ink) + rect(1500, 330, 12, 430, C.ink) + rect(1080, 320, 452, 26, C.ink) + rect(1300, 346, 40, 60, C.survey);
    s += line(1320, 406, 1320, 520, C.ink, 3);
    // trucks
    for (let i = 0; i < 3; i += 1) { const x = 160 + i * 340; s += rect(x, 800, 150, 70, C.white) + rect(x + 150, 820, 60, 50, C.survey) + `<circle cx="${x + 30}" cy="876" r="18" fill="${C.ink}"/><circle cx="${x + 130}" cy="876" r="18" fill="${C.ink}"/>`; }
    for (let x = 0; x < W; x += 180) s += rect(x + 20, 930, 100, 10, C.white, 'opacity=".6"');
    return s + sheet(r, 'rgba(13,27,24,.05)');
  },

  'saffron-villas'() {
    const r = rng(53);
    let s = sky([[0, '#f6cf9a'], [0.5, '#f7e3c0'], [1, '#e6e3cf']]);
    s += sun(260, 360, 150, '#fff6df', 0.9);
    s += ground(760, C.moss);
    s += rect(0, 740, W, 30, C.spruce);
    const colors = [C.ply, C.white, C.pour, '#e6c9a0', C.white];
    for (let i = 0; i < 5; i += 1) {
      const x = 70 + i * 300; const w = 250; const h = 220 + (i % 2) * 40;
      const y = 760 - h;
      s += rect(x, y, w, h, colors[i]);
      s += `<path d="M${x - 24} ${y} L${x + w / 2} ${y - 130} L${x + w + 24} ${y}Z" fill="${i % 2 ? C.hoarding : C.plyDark}"/>`;
      s += rect(x + 30, y + 40, 60, 70, C.glass) + rect(x + w - 90, y + 40, 60, 70, C.glass);
      s += line(x + 60, y + 40, x + 60, y + 110, 'rgba(13,27,24,.4)', 2) + line(x + w - 60, y + 40, x + w - 60, y + 110, 'rgba(13,27,24,.4)', 2);
      s += rect(x + w / 2 - 28, y + h - 110, 56, 110, C.ink) + rect(x + w / 2 - 20, y + h - 102, 40, 102, C.survey, 'opacity=".9"');
      s += rect(x + 20, y + h - 18, w - 40, 18, 'rgba(13,27,24,.12)');
      s += rect(x + w - 44, y - 90, 22, 70, C.plyDark);
    }
    for (let i = 0; i < 12; i += 1) { const x = 30 + i * 135 + r() * 40; const rr = 20 + r() * 16; s += rect(x - 3, 790, 6, 40, C.plyDark) + `<circle cx="${x}" cy="780" r="${rr}" fill="${C.hoarding}"/>`; }
    s += rect(0, 880, W, 120, C.pour) + rect(0, 880, W, 6, C.white, 'opacity=".5"');
    return s + sheet(r, 'rgba(13,27,24,.05)');
  },

  'terra-highway-interchange'() {
    const r = rng(67);
    let s = sky([[0, '#d9e6e0'], [0.6, '#f0efe4'], [1, '#e3e2d6']]);
    s += sun(1240, 250, 100, '#ffffff', 0.8);
    s += `<path d="M0 640 C 300 560 560 650 820 600 C 1060 560 1300 640 1600 590 L1600 800 L0 800Z" fill="${C.sky}"/>`;
    s += ground(820, C.moss);
    // lower road
    s += rect(0, 820, W, 40, C.ink) + line(0, 840, W, 840, C.white, 3, 'stroke-dasharray="40 30"');
    // ramps: curved decks
    s += `<path d="M0 560 C 400 560 560 340 800 340 C 1040 340 1200 560 1600 560 L1600 596 C 1200 596 1040 380 800 380 C 560 380 400 596 0 596Z" fill="${C.hoarding}"/>`;
    s += `<path d="M0 560 C 400 560 560 340 800 340 C 1040 340 1200 560 1600 560" fill="none" stroke="${C.survey}" stroke-width="4"/>`;
    // piers
    for (let x = 120; x < W; x += 170) {
      const t = x / W; const yy = 600 + Math.sin(t * Math.PI) * -210 + 0;
      const deck = x < 800 ? 596 - (Math.sin((x / 800) * Math.PI / 2) * 216) : 596 - (Math.sin(((1600 - x) / 800) * Math.PI / 2) * 216);
      s += rect(x - 14, deck, 28, 820 - deck, C.pour) + rect(x - 24, deck, 48, 14, C.pour);
    }
    // straight overpass
    s += rect(0, 700, W, 26, C.spruce) + rect(0, 692, W, 8, C.pour);
    for (let x = 60; x < W; x += 240) s += rect(x, 726, 22, 94, C.pour);
    // vehicles
    for (let i = 0; i < 6; i += 1) s += rect(80 + i * 260 + r() * 40, 664, 56, 26, [C.survey, C.ply, C.white][i % 3], 'rx="6"');
    // lamp posts
    for (let x = 40; x < W; x += 130) s += line(x, 692, x, 640, C.ink, 3) + line(x, 640, x + 18, 640, C.ink, 3);
    return s + sheet(r, 'rgba(13,27,24,.05)');
  },

  'lumen-hospital'() {
    const r = rng(79);
    let s = sky([[0, '#b8d3d6'], [0.65, '#e3ece6'], [1, '#e3ece6']]);
    s += ground(790, C.pour);
    // wings
    s += rect(80, 480, 560, 310, C.white) + rect(960, 480, 560, 310, C.white);
    [[80, 560], [960, 560]].forEach(([x, w]) => {
      for (let f = 0; f < 5; f += 1) {
        s += rect(x, 500 + f * 58, w, 34, '#98bdb8');
        for (let v = 0; v <= 14; v += 1) s += line(x + v * (w / 14), 500 + f * 58, x + v * (w / 14), 534 + f * 58, 'rgba(255,255,255,.7)', 3);
      }
    });
    // central tower
    s += rect(640, 250, 320, 540, C.hoarding);
    for (let f = 0; f < 10; f += 1) for (let b = 0; b < 6; b += 1) s += rect(660 + b * 50, 276 + f * 50, 38, 28, r() < 0.34 ? C.ply : '#33454d');
    // cross
    s += rect(776, 146, 48, 120, C.survey) + rect(740, 182, 120, 48, C.survey);
    s += rect(600, 730, 400, 60, C.slab) + rect(700, 690, 200, 40, C.slab);
    s += rect(740, 700, 120, 90, C.ink) + rect(748, 708, 104, 82, '#8fbab4');
    // canopy
    s += rect(660, 664, 280, 14, C.survey);
    // lawn + path
    s += rect(0, 790, W, 20, C.moss) + rect(0, 810, W, 190, C.pour);
    s += `<path d="M740 810 L860 810 L1020 1000 L580 1000Z" fill="${C.slab}"/>`;
    for (let i = 0; i < 14; i += 1) { const x = 30 + i * 118; s += `<circle cx="${x}" cy="780" r="${20 + (i % 3) * 7}" fill="${C.moss}"/>`; }
    return s + sheet(r, 'rgba(13,27,24,.05)');
  },

  'skyline-metro-station'() {
    const r = rng(83);
    let s = sky([[0, '#16423b'], [0.6, '#3a6e63'], [1, '#e2bb7c']]);
    for (let i = 0; i < 40; i += 1) s += `<circle cx="${r() * W}" cy="${r() * 360}" r="${1 + r() * 1.6}" fill="#fff" opacity="${0.2 + r() * 0.6}"/>`;
    s += sun(1280, 700, 180, '#c9a96e', 0.35);
    // distant towers
    for (let i = 0; i < 12; i += 1) { const w = 70 + r() * 70; const h = 160 + r() * 260; s += facade({ x: i * 140 - 20, y: 800 - h, w, h, floors: Math.round(h / 24), bays: 3, rand: r, body: C.deep, glass: '#26343a', lit: C.ply, litChance: 0.25 }); }
    // arched roof with ribs
    s += `<path d="M120 800 L120 560 C120 360 420 280 800 280 C1180 280 1480 360 1480 560 L1480 800Z" fill="${C.hoarding}"/>`;
    s += `<path d="M180 800 L180 570 C180 410 440 340 800 340 C1160 340 1420 410 1420 570 L1420 800Z" fill="#2c6a62" opacity=".75"/>`;
    for (let i = 0; i <= 14; i += 1) { const x = 180 + i * (1240 / 14); s += line(x, 800, 800 + (x - 800) * 0.92, 342 + Math.abs(x - 800) * 0.0 + (Math.abs(x - 800) / 620) ** 2 * 200, 'rgba(255,255,255,.35)', 3); }
    s += rect(120, 690, 1360, 18, C.survey);
    // entrance
    s += rect(700, 640, 200, 160, C.ink) + rect(712, 652, 176, 148, '#f6d9a0');
    s += ground(800, C.ink);
    s += rect(0, 800, W, 8, C.pour);
    s += rect(0, 880, W, 6, C.survey, 'opacity=".7"') + rect(0, 940, W, 6, C.white, 'opacity=".35"');
    return s + sheet(r, 'rgba(255,255,255,.05)');
  },

  'cedar-court-apartments'() {
    const r = rng(97);
    let s = sky([[0, '#f3d3b6'], [0.5, '#f1e6cf'], [1, '#dde4d8']]);
    s += sun(1180, 300, 110, '#fff7e0', 0.9);
    s += ground(800, C.moss);
    [[150, 450, 520, 'a'], [760, 370, 700, 'b']].forEach(([x, h, w], bi) => {
      const y = 800 - h;
      s += rect(x, y, w, h, bi ? C.white : C.ply);
      const floors = Math.round(h / 62);
      const bays = Math.round(w / 90);
      for (let f = 0; f < floors; f += 1) for (let b = 0; b < bays; b += 1) {
        const wx = x + 18 + b * (w - 36) / bays; const wy = y + 22 + f * (h - 40) / floors;
        s += rect(wx, wy, (w - 36) / bays - 18, 28, r() < 0.3 ? C.ply : '#7d909a');
        s += rect(wx - 4, wy + 34, (w - 36) / bays - 10, 8, C.hoarding);
      }
      s += rect(x - 10, y - 14, w + 20, 14, C.hoarding);
    });
    s += rect(0, 800, W, 16, C.spruce);
    for (let i = 0; i < 11; i += 1) { const x = 40 + i * 150 + r() * 30; s += rect(x - 3, 830, 6, 50, C.plyDark) + `<circle cx="${x}" cy="820" r="${26 + r() * 14}" fill="${C.hoarding}"/>`; }
    s += rect(0, 910, W, 90, C.pour);
    return s + sheet(r, 'rgba(13,27,24,.05)');
  },

  'quarry-road-retail-plaza'() {
    const r = rng(101);
    let s = sky([[0, '#c3dad8'], [0.6, '#eef0e6'], [1, '#eef0e6']]);
    s += ground(760, C.pour);
    // long low blocks with canopy
    const shops = [[80, 300], [380, 240], [620, 340], [960, 260], [1220, 300]];
    shops.forEach(([x, w], i) => {
      const h = 180 + (i % 2) * 60;
      s += rect(x, 760 - h, w - 14, h, [C.white, C.ply, C.hoarding, C.white, C.pour][i]);
      s += rect(x + 14, 760 - h + 70, w - 42, h - 70, C.glass, 'opacity=".75"');
      s += rect(x - 6, 760 - h - 14, w - 2, 20, C.ink);
      s += rect(x - 6, 760 - h + 56, w - 2, 12, i % 2 ? C.survey : C.hoarding);
    });
    s += rect(0, 760, W, 10, C.survey);
    // pylon sign
    s += rect(1500, 420, 18, 340, C.ink) + rect(1470, 380, 78, 120, C.survey) + rect(1480, 392, 58, 20, C.white, 'opacity=".9"');
    for (let x = 40; x < W; x += 140) s += rect(x, 860, 80, 10, C.white, 'opacity=".75"');
    for (let i = 0; i < 6; i += 1) s += rect(90 + i * 240, 820, 70, 26, [C.survey, C.ply, C.hoarding][i % 3], 'rx="6"');
    return s + sheet(r, 'rgba(13,27,24,.05)');
  },

  'greenfield-school'() {
    const r = rng(113);
    let s = sky([[0, '#bfd9e0'], [0.6, '#eaf0e4'], [1, '#eaf0e4']]);
    s += sun(320, 240, 90, '#fffbea', 0.9);
    s += ground(780, C.moss);
    // main block
    s += rect(300, 480, 1000, 300, C.ply) + rect(300, 470, 1000, 18, C.hoarding);
    for (let i = 0; i < 12; i += 1) { s += rect(330 + i * 82, 520, 52, 70, C.glass) + rect(330 + i * 82, 640, 52, 70, C.glass); }
    s += rect(740, 420, 120, 360, C.hoarding) + `<path d="M720 420 L800 340 L880 420Z" fill="${C.survey}"/>`;
    s += rect(770, 640, 60, 140, C.ink);
    s += rect(780, 450, 40, 40, C.slab) + `<circle cx="800" cy="470" r="14" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
    // wings
    s += rect(80, 580, 240, 200, C.white) + rect(1280, 580, 240, 200, C.white);
    [80, 1280].forEach((x) => { for (let i = 0; i < 3; i += 1) s += rect(x + 24 + i * 72, 620, 48, 56, C.glass); s += rect(x - 10, 566, 260, 16, C.plyDark); });
    // flagpole
    s += line(1130, 780, 1130, 340, C.ink, 4) + rect(1132, 344, 74, 44, C.survey);
    for (let i = 0; i < 14; i += 1) { const x = 20 + i * 118 + r() * 30; s += rect(x - 3, 810, 6, 44, C.plyDark) + `<circle cx="${x}" cy="800" r="${22 + r() * 12}" fill="${C.hoarding}"/>`; }
    s += rect(0, 880, W, 120, C.pour);
    // track lines
    s += `<ellipse cx="800" cy="935" rx="520" ry="34" fill="none" stroke="${C.white}" stroke-width="4" opacity=".6"/>`;
    return s + sheet(r, 'rgba(13,27,24,.05)');
  },
};

/* About portrait (4:5): a foundation section drawn on spruce "paper": soil strata, footing, columns, rebar. */
function sectionDrawing() {
  const w = 1200; const h = 1500; const r = rng(131);
  let s = rect(0, 0, w, h, C.hoarding);
  for (let x = 60; x < w; x += 60) s += line(x, 0, x, h, 'rgba(255,255,255,.06)', 1);
  for (let y = 60; y < h; y += 60) s += line(0, y, w, y, 'rgba(255,255,255,.06)', 1);
  // strata
  const strata = [[820, C.spruce], [960, C.moss], [1100, '#3d7a6c'], [1240, '#52897a']];
  strata.forEach(([y, c], i) => {
    s += `<path d="M0 ${y} C 300 ${y - 26 + i * 10} 700 ${y + 30 - i * 8} 1200 ${y - 12}  L1200 ${h} L0 ${h}Z" fill="${c}" opacity=".9"/>`;
    for (let k = 0; k < 44; k += 1) s += `<circle cx="${r() * w}" cy="${y + 20 + r() * 120}" r="${1.5 + r() * 2.4}" fill="rgba(255,255,255,.28)"/>`;
  });
  // footings + columns
  [[300], [600], [900]].forEach(([x]) => {
    s += rect(x - 110, 800, 220, 70, C.pour) + rect(x - 34, 260, 68, 560, C.slab);
    for (let k = -2; k <= 2; k += 1) s += line(x + k * 18, 280, x + k * 18, 860, C.survey, 2.5);
    for (let k = 0; k < 6; k += 1) s += line(x - 100, 812 + k * 10, x + 100, 812 + k * 10, C.survey, 2.5);
  });
  // slab + upper floor
  s += rect(120, 780, 960, 24, C.slab) + rect(120, 520, 960, 20, C.slab) + rect(120, 260, 960, 20, C.slab);
  // dimension lines
  [[120, 1080, 1180]].forEach(([x1, x2, y]) => { s += line(x1, y, x2, y, C.ply, 3) + line(x1, y - 16, x1, y + 16, C.ply, 3) + line(x2, y - 16, x2, y + 16, C.ply, 3); });
  s += line(1130, 260, 1130, 800, C.ply, 3) + line(1114, 260, 1146, 260, C.ply, 3) + line(1114, 800, 1146, 800, C.ply, 3);
  // level markers
  [[260, 120], [520, 120], [800, 120]].forEach(([y, x]) => { s += `<path d="M${x - 40} ${y} L${x} ${y} L${x - 20} ${y - 34}Z" fill="none" stroke="${C.ply}" stroke-width="3"/>`; });
  // crane silhouette
  s += crane(960, 260, 220, 'rgba(255,255,255,.35)', 220);
  s += `<circle cx="1010" cy="140" r="60" fill="${C.survey}" opacity=".9"/>`;
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${s}</svg>`, w, h };
}

/* cinematic grade: muted colour, soft vignette and fine film grain so the artwork reads as a render, not a cartoon */
const gradeLayer = (w, h) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><radialGradient id="v" cx="50%" cy="46%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.45"/></radialGradient><linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1410" stop-opacity="0.18"/><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.28"/></linearGradient><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7"/><feColorMatrix type="saturate" values="0"/></filter></defs><rect width="100%" height="100%" fill="url(#t)"/><rect width="100%" height="100%" fill="url(#v)"/><rect width="100%" height="100%" filter="url(#n)" opacity="0.10"/></svg>`);

async function render(slug, svg, w, h, small = 640) {
  const base = await sharp(Buffer.from(svg), { density: 96 }).resize(w).modulate({ saturation: 0.5, brightness: 0.95 }).linear(1.07, -6)
    .composite([{ input: gradeLayer(w, h) }]).png().toBuffer();
  await sharp(base).webp({ quality: 82, effort: 5 }).toFile(path.join(OUT, `${slug}.webp`));
  await sharp(base).resize(small).webp({ quality: 74, effort: 5 }).toFile(path.join(OUT, `${slug}-${small}.webp`));
  return { w, h: Math.round((w * h) / w), small };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const manifest = {};
  for (const [slug, draw] of Object.entries(scenes)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${draw()}</svg>`;
    manifest[slug] = await render(slug, svg, W, H);
    manifest[slug].h = H;
    console.log('rendered', slug);
  }
  const sec = sectionDrawing();
  manifest['foundation-section'] = await render('foundation-section', sec.svg, sec.w, sec.h);
  manifest['foundation-section'].h = sec.h;
  console.log('rendered foundation-section');
  await writeFile(path.join(ROOT, 'src', 'data', 'images.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log('wrote images.json');
}

main().catch((e) => { console.error(e); process.exit(1); });
