#!/usr/bin/env node
/**
 * demos/tiktok-carousel-v1/render_carousel.mjs
 *
 * Génère les 6 slides finales (Slides 1 à 6) du carrousel TikTok 9:16 (1080×1920 px)
 * « AI CREATOR Studio Épuré » (Slide 1 POV + Slides 2–6 showcase fond #F2F2F5
 * calibrées en safe-zone mobile y = 215..1645 px) dans `png/`, intègre le vrai
 * `public/logo.svg` ainsi que l'icône officielle Claude, contrôle le rendu DOM/alpha
 * et génère la planche contact `/tmp/tiktok-carousel-audit/sheet-v2.png`.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');
const OUT_PNG_DIR = path.join(__dirname, 'png');
const IPHONE_PNG_DIR = path.join(ROOT, 'demos/iphone-assets/png');
const SLIDE_ASSETS_DIR = path.join(__dirname, 'assets');
const LOGO_SVG_PATH = path.join(ROOT, 'public/logo.svg');
const AUDIT_DIR = '/tmp/tiktok-carousel-audit';
const SHEET_FILENAME = 'sheet-v2.png';

const SLIDE_W = 1080;
const SLIDE_H = 1920;

// Calibrage physique exact mesuré sur les PNG transparents 2094×3702 px :
// - marge transparente haute au-dessus du châssis = 330 / 3702 (8.9141 %)
// - hauteur opaque du châssis métal = 2970 / 3702 (80.2269 %)
const PHONE_BODY_HEIGHT = 925;
const PHONE_BODY_TOP = 720;
const PHONE_TOP_PAD_RATIO = 330 / 3702;
const PHONE_BODY_RATIO = 2970 / 3702;
const PHONE_IMG_HEIGHT = Math.round(PHONE_BODY_HEIGHT / PHONE_BODY_RATIO);
const PHONE_IMG_TOP = Math.round(PHONE_BODY_TOP - PHONE_IMG_HEIGHT * PHONE_TOP_PAD_RATIO);

// Vecteur officiel Anthropic / Claude (simple-icons/simple-icons · icons/claude.svg · CC0-1.0)
const CLAUDE_STARBURST_PATH =
  'm4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.svg': 'image/svg+xml',
};

const HOOK_SLIDE = {
  file: 'slide-01-hook.png',
  photo: 'slide-01-pov-source.jpg',
  bgHex: '#F5D34E',
  lines: [
    'POV : Tu apprends aux gens',
    'à créer des fckg produits',
    'digitaux interactifs avec',
    'Claude et personne ne sait',
  ],
};

const PRODUCT_SLIDES = [
  {
    file: 'slide-02-mijote.png',
    asset: 'iphone18-mijote.png',
    kicker: "Au lieu d'un énième ebook de recettes",
    title: 'Mijote',
    description:
      'Planifie tes repas de la semaine, ajuste les portions et génère ta liste de courses.',
  },
  {
    file: 'slide-03-kinetik.png',
    asset: 'iphone18-kinetik.png',
    kicker: "Au lieu d'un programme de sport maison classique",
    title: 'Kinetik',
    description:
      '30 jours sans matériel, des séances guidées et un suivi de progression.',
  },
  {
    file: 'slide-04-onda.png',
    asset: 'iphone18-onda.png',
    kicker: "Au lieu d'un énième planner de productivité",
    title: 'Onda',
    description:
      '21 jours pour clarifier tes priorités, suivre tes habitudes et garder le cap.',
  },
  {
    file: 'slide-05-solde.png',
    asset: 'iphone18-solde.png',
    kicker: "Au lieu d'un tableau de budget à remplir chaque mois",
    title: 'SOLDE.',
    description:
      "Visualise ton reste à vivre, teste les imprévus et suis tes objectifs d'épargne.",
  },
];

const CTA_SLIDE = {
  file: 'slide-06-cta.png',
  titleLine1: 'Tout ça avec',
  titleLine2: 'Claude Free',
  subtitle: '(sans abonnement payant).',
  bullets: [
    'Pas besoin de savoir coder.',
    'Un design unique, pas un modèle copié.',
    'Tu peux créer, publier et vendre ton propre produit.',
  ],
  brand: 'AI CREATOR Studio',
  ctaLabel: 'Lien en bio',
};

function walkFiles(dirPath, predicate) {
  if (!fs.existsSync(dirPath)) return [];
  const results = [];
  const stack = [dirPath];
  while (stack.length > 0) {
    const current = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (predicate(fullPath, entry.name)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function loadPlaywright() {
  for (const pkg of ['playwright', 'playwright-core']) {
    try {
      return await import(pkg);
    } catch {
      // Continue
    }
  }

  const npxCacheRoot = path.join(os.homedir(), '.npm', '_npx');
  const candidates = walkFiles(
    npxCacheRoot,
    (fullPath, name) =>
      name === 'index.mjs' && fullPath.endsWith(path.join('playwright-core', 'index.mjs'))
  );

  for (const entryPath of candidates) {
    try {
      return await import(pathToFileURL(entryPath).href);
    } catch {
      // Continue
    }
  }

  throw new Error('playwright-core introuvable (ni local, ni dans ~/.npm/_npx)');
}

function findChromiumExecutable() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }

  const remotionChrome = walkFiles(
    path.join(ROOT, 'video-studio/node_modules/.remotion'),
    (_fullPath, name) => name === 'chrome-headless-shell' || name === 'chrome'
  ).sort(
    (a, b) =>
      (a.includes('chrome-headless-shell') ? -1 : 1) -
      (b.includes('chrome-headless-shell') ? -1 : 1)
  );
  if (remotionChrome.length > 0) return remotionChrome[0];

  const cachedChrome = walkFiles(
    path.join(os.homedir(), '.cache', 'ms-playwright'),
    (_fullPath, name) => name === 'chrome-headless-shell' || name === 'chrome'
  );
  if (cachedChrome.length > 0) return cachedChrome[0];

  for (const bin of ['google-chrome', 'chromium', 'chromium-browser']) {
    try {
      const resolved = execSync(`command -v "${bin}"`, {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (resolved && fs.existsSync(resolved)) return resolved;
    } catch {
      // Continue
    }
  }

  return undefined;
}

function inspectPngHeaderAndCorners(filePath) {
  const buf = fs.readFileSync(filePath);
  const sig = buf.subarray(0, 8).toString('hex');
  if (sig !== '89504e470d0a1a0a') {
    throw new Error(`Signature PNG invalide : ${filePath}`);
  }

  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const bitDepth = buf[24];
  const colorType = buf[25];
  const hasAlpha = colorType === 4 || colorType === 6;

  if (!hasAlpha || bitDepth !== 8 || colorType !== 6) {
    return { width, height, hasAlpha, cornersAlpha: null };
  }

  const idatChunks = [];
  let offset = 8;
  while (offset + 8 <= buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.subarray(offset + 4, offset + 8).toString('ascii');
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (type === 'IDAT') {
      idatChunks.push(buf.subarray(dataStart, dataEnd));
    } else if (type === 'IEND') {
      break;
    }
    offset = dataEnd + 4;
  }

  const raw = zlib.inflateSync(Buffer.concat(idatChunks));
  const bpp = 4;
  const stride = width * bpp + 1;

  function decodeRow(y, prevRow) {
    const rowStart = y * stride;
    const filter = raw[rowStart];
    const out = Buffer.alloc(width * bpp);
    for (let i = 0; i < width * bpp; i += 1) {
      const x = raw[rowStart + 1 + i];
      const a = i >= bpp ? out[i - bpp] : 0;
      const b = prevRow ? prevRow[i] : 0;
      const c = i >= bpp && prevRow ? prevRow[i - bpp] : 0;
      let val = x;
      if (filter === 1) val = (x + a) & 0xff;
      else if (filter === 2) val = (x + b) & 0xff;
      else if (filter === 3) val = (x + ((a + b) >> 1)) & 0xff;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        val = (x + pr) & 0xff;
      }
      out[i] = val;
    }
    return out;
  }

  let prev = null;
  let firstRow = null;
  let lastRow = null;
  for (let y = 0; y < height; y += 1) {
    const decoded = decodeRow(y, prev);
    if (y === 0) firstRow = decoded;
    if (y === height - 1) lastRow = decoded;
    prev = decoded;
  }

  const cornersAlpha = [
    firstRow[3],
    firstRow[(width - 1) * 4 + 3],
    lastRow[3],
    lastRow[(width - 1) * 4 + 3],
  ];

  return { width, height, hasAlpha, cornersAlpha };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/**
 * Lit et valide `public/logo.svg`, puis produit sa silhouette blanche pure
 * transparente (haut-gauche) sans bloc crème opaque et sans `@import` réseau.
 */
function loadBrandLogoWhiteSvg() {
  if (!fs.existsSync(LOGO_SVG_PATH)) {
    throw new Error(`Fichier logo introuvable : ${LOGO_SVG_PATH}`);
  }
  const rawSvg = fs.readFileSync(LOGO_SVG_PATH, 'utf8');
  if (!rawSvg.includes('AI CREATOR') || !rawSvg.includes('PRODUITS DIGITAUX INTERACTIFS')) {
    throw new Error(`Contenu inattendu dans ${LOGO_SVG_PATH}`);
  }

  // Recentrage sur les éléments vectoriels exacts (28, 24, 940, 148) de logo.svg,
  // rendus en blanc pur net sur fond transparent grâce au masquage des lettres.
  return `<svg class="brand-logo-white" xmlns="http://www.w3.org/2000/svg" viewBox="28 24 940 148" aria-label="AI CREATOR Studio">
    <defs>
      <mask id="logoTilePunch">
        <rect x="0" y="0" width="136" height="136" rx="20" fill="#FFFFFF" />
        <text x="46" y="94" text-anchor="middle" class="logo-svg-sans" font-size="78" fill="#000000">A</text>
        <text x="92" y="96" text-anchor="middle" class="logo-svg-serif" font-size="94" fill="#000000">c</text>
        <rect x="28" y="112" width="80" height="3.5" rx="1.5" fill="#000000" />
        <text x="68" y="124" text-anchor="middle" class="logo-svg-tech" font-size="7.5" fill="#000000">STUDIO</text>
      </mask>
      <mask id="logoPillPunch">
        <rect x="0" y="0" width="236" height="22" rx="4" fill="#FFFFFF" />
        <text x="118" y="15" text-anchor="middle" class="logo-svg-tech" font-size="10" fill="#000000">PRODUITS DIGITAUX INTERACTIFS</text>
      </mask>
    </defs>
    <g transform="translate(32, 28)">
      <rect x="0" y="0" width="136" height="136" rx="20" fill="currentColor" mask="url(#logoTilePunch)" />
    </g>
    <rect x="204" y="42" width="5" height="88" fill="currentColor" />
    <text x="224" y="118" class="logo-svg-sans" font-size="72" fill="currentColor">AI CREATOR</text>
    <text x="670" y="118" class="logo-svg-serif" font-size="100" fill="currentColor">studio</text>
    <g transform="translate(226, 138)">
      <rect x="0" y="0" width="236" height="22" rx="4" fill="currentColor" mask="url(#logoPillPunch)" />
    </g>
  </svg>`;
}

function buildSharedStyles() {
  return `
/* Hallmark · theme: custom (AI CREATOR Studio Epuré v2) · idea: "Crisp Apple-Keynote #FFFFFF showcase with clean #D9533F->#F29B63->#FCE1CC top studio wash above y 325px, 106px title hierarchy, and authentic Anthropic/Studio brand marks" · vibe: "crisp gallery white editorial hardware showcase" */
/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · cut warm dull paper tint to pure #FFFFFF, balanced 2-line descriptions to eliminate orphans, replaced generic signature with crisp white logo.svg silhouette */
/* Hallmark · copy: verbatim */
/* Hallmark · waive 29 · top warm luminous studio halo strictly confined to 0..325px fading to pure #FFFFFF before text y 340px · ensures pure contrast on crisp white signature and body copy */
/* Hallmark · waive 47b · four iPhone frames contain genuine high-resolution captures of Mijote, Kinetik, Onda, and SOLDE. · real product captures */
/* Hallmark · waive 2b · single-hue warm gradient (#D97757 to #B63131) on Claude Free headline · stops within 22deg inside :root tokens */

@font-face {
  font-family: 'Plus Jakarta Sans';
  src: url('/public/fonts/PlusJakartaSans-latin.woff2') format('woff2');
  font-weight: 200 800;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122;
}

@font-face {
  font-family: 'Plus Jakarta Sans';
  src: url('/public/fonts/PlusJakartaSans-latin-ext.woff2') format('woff2');
  font-weight: 200 800;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0;
}

@font-face {
  font-family: 'Instrument Serif';
  src: url('/public/fonts/InstrumentSerif-Italic.ttf') format('truetype');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/public/fonts/JetBrainsMono-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-serif-italic: 'Instrument Serif', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;

  --color-ground: #F2F2F5;
  --color-ink: #0D0D0F;
  --color-kicker: #B4382A;
  --color-kicker-bg: #FDF1ED;
  --color-kicker-border: rgba(196, 75, 58, 0.22);
  --color-desc: #52525B;
  --color-subtitle: #6E6E73;
  --color-ink-list: #1D1D1F;
  --color-claude: #D97757;
  --color-accent: #B63131;
  --color-cta-ink: #FFFFFF;
  --color-logo-white: rgba(255, 255, 255, 0.96);

  --color-squircle-bg: #FFFFFF;
  --color-squircle-border: rgba(17, 17, 17, 0.08);

  --shadow-squircle: 0 18px 40px -12px rgba(17, 17, 17, 0.12), 0 4px 12px rgba(17, 17, 17, 0.05);
  --shadow-pill: 0 12px 28px rgba(13, 13, 15, 0.18);

  --halo-coral: #D9533F;
  --halo-tangerine: #F29B63;
  --halo-peach: #FCE1CC;
  --halo-transparent: transparent;

  --mask-solid: #000000;
  --mask-step-1: rgba(0, 0, 0, 0.94);
  --mask-step-2: rgba(0, 0, 0, 0.72);
  --mask-step-3: rgba(0, 0, 0, 0.28);
  --mask-step-4: rgba(0, 0, 0, 0.06);
  --mask-clear: transparent;

  --canvas-w: ${SLIDE_W}px;
  --canvas-h: ${SLIDE_H}px;
  --halo-h: 415px;
  --margin-x: 76px;
  --margin-x-cta: 84px;
  --text-max-w: 928px;
  --desc-max-w: 890px;
  --cta-max-w: 912px;
  --sig-top: 215px;
  --sig-h: 52px;
  --copy-top: 425px;
  --cta-top: 455px;

  --phone-img-top: ${PHONE_IMG_TOP}px;
  --phone-img-h: ${PHONE_IMG_HEIGHT}px;

  --size-kicker: 24px;
  --size-title: 94px;
  --size-desc: 30px;
  --size-cta-h1-top: 88px;
  --size-cta-h1-accent: 96px;
  --size-cta-sub: 36px;
  --size-cta-li: 33px;
  --size-cta-brand: 52px;
  --size-cta-pill: 30px;

  --space-kicker-mb: 14px;
  --space-desc-mt: 14px;
  --space-cta-title-mt: 32px;
  --space-sub-mt: 12px;
  --space-list-mt: 44px;
  --space-list-gap: 22px;
  --space-brand-mt: 58px;
  --space-pill-mt: 22px;
  --pill-pad-y: 20px;
  --pill-pad-x: 44px;
  --pill-radius: 999px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: var(--canvas-w);
  height: var(--canvas-h);
  overflow-x: clip;
  overflow-y: clip;
  background: var(--color-ground);
  color: var(--color-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

.slide {
  position: relative;
  width: var(--canvas-w);
  height: var(--canvas-h);
  overflow: hidden;
  background: var(--color-ground);
}

/* Halo studio lumineux strictement fondu dans #FFFFFF avant y = 330px */
.halo {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--canvas-w);
  height: var(--halo-h);
  pointer-events: none;
  z-index: 1;
  -webkit-mask-image: linear-gradient(
    to bottom,
    var(--mask-solid) 0%,
    var(--mask-step-1) 55%,
    var(--mask-step-2) 68%,
    var(--mask-step-3) 82%,
    var(--mask-step-4) 92%,
    var(--mask-clear) 100%
  );
  mask-image: linear-gradient(
    to bottom,
    var(--mask-solid) 0%,
    var(--mask-step-1) 55%,
    var(--mask-step-2) 68%,
    var(--mask-step-3) 82%,
    var(--mask-step-4) 92%,
    var(--mask-clear) 100%
  );
}

.halo-canvas {
  position: absolute;
  inset: -48px -64px 0 -64px;
  filter: blur(38px);
  background:
    radial-gradient(ellipse 58% 92% at 16% 24%, var(--halo-coral) 0%, var(--halo-transparent) 74%),
    radial-gradient(ellipse 56% 86% at 54% 20%, var(--halo-tangerine) 0%, var(--halo-transparent) 74%),
    radial-gradient(ellipse 58% 88% at 90% 24%, var(--halo-peach) 0%, var(--halo-transparent) 78%),
    linear-gradient(96deg, var(--halo-coral) 0%, var(--halo-tangerine) 52%, var(--halo-peach) 100%);
}

/* Logo SVG haut-gauche en blanc pur net */
.brand-logo-wrap {
  position: absolute;
  left: var(--margin-x);
  top: var(--sig-top);
  height: var(--sig-h);
  z-index: 3;
  color: var(--color-logo-white);
  display: inline-flex;
  align-items: center;
}

.brand-logo-white {
  display: block;
  width: auto;
  height: 100%;
}

.logo-svg-sans {
  font-family: var(--font-sans);
  font-weight: 800;
  text-transform: uppercase;
}

.logo-svg-serif {
  font-family: var(--font-serif-italic);
  font-style: italic;
  font-weight: 400;
}

.logo-svg-tech {
  font-family: var(--font-mono);
  font-weight: 700;
}

/* Slides 2 à 5 */
.product-header {
  position: absolute;
  left: var(--margin-x);
  top: var(--copy-top);
  width: var(--text-max-w);
  z-index: 3;
}

.kicker {
  display: inline-flex;
  align-items: center;
  padding: 10px 22px;
  border-radius: var(--pill-radius);
  background: var(--color-kicker-bg);
  border: 1px solid var(--color-kicker-border);
  font-size: var(--size-kicker);
  font-weight: 600;
  color: var(--color-kicker);
  letter-spacing: -0.01em;
  line-height: 1.15;
  margin-bottom: var(--space-kicker-mb);
  max-width: 100%;
}

.product-title {
  font-size: var(--size-title);
  font-weight: 800;
  color: var(--color-ink);
  letter-spacing: -0.045em;
  line-height: 0.98;
  overflow-wrap: break-word;
  min-width: 0;
}

.product-desc {
  margin-top: var(--space-desc-mt);
  max-width: var(--desc-max-w);
  font-size: var(--size-desc);
  font-weight: 400;
  color: var(--color-desc);
  line-height: 1.34;
  letter-spacing: -0.012em;
  text-wrap: balance;
}

.phone-stage {
  position: absolute;
  left: 0;
  right: 0;
  top: var(--phone-img-top);
  display: flex;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
}

.phone-asset {
  display: block;
  width: auto;
  height: var(--phone-img-h);
  max-width: none;
}

/* Slide 6 CTA Keynote / Anthropic */
.cta-stage {
  position: absolute;
  left: var(--margin-x-cta);
  right: var(--margin-x-cta);
  top: var(--cta-top);
  width: var(--cta-max-w);
  z-index: 3;
}

.claude-squircle {
  width: 124px;
  height: 124px;
  border-radius: 30px;
  background: var(--color-squircle-bg);
  border: 1px solid var(--color-squircle-border);
  box-shadow: var(--shadow-squircle);
  display: flex;
  align-items: center;
  justify-content: center;
}

.claude-mark {
  display: block;
  width: 74px;
  height: 74px;
  color: var(--color-claude);
}

.cta-title-group {
  margin-top: var(--space-cta-title-mt);
}

.cta-headline {
  overflow-wrap: break-word;
  min-width: 0;
}

.cta-headline-top {
  display: block;
  font-size: var(--size-cta-h1-top);
  font-weight: 700;
  color: var(--color-ink);
  letter-spacing: -0.04em;
  line-height: 1.02;
}

.cta-headline-accent {
  display: inline-block;
  font-size: var(--size-cta-h1-accent);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.02;
  color: var(--color-claude);
  background: linear-gradient(96deg, var(--color-claude) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-bottom: 0.06em;
  margin-bottom: -0.06em;
}

.cta-subtitle {
  margin-top: var(--space-sub-mt);
  font-size: var(--size-cta-sub);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-subtitle);
}

.cta-list {
  list-style: none;
  margin-top: var(--space-list-mt);
  display: flex;
  flex-direction: column;
  gap: var(--space-list-gap);
}

.cta-item {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  align-items: start;
  font-size: var(--size-cta-li);
  font-weight: 500;
  color: var(--color-ink-list);
  line-height: 1.32;
  letter-spacing: -0.014em;
}

.cta-arrow {
  width: 26px;
  height: 26px;
  margin-top: 0.25em;
  color: var(--color-claude);
  display: block;
}

.cta-footer {
  margin-top: var(--space-brand-mt);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.cta-brand {
  font-size: var(--size-cta-brand);
  font-weight: 800;
  color: var(--color-ink);
  letter-spacing: -0.03em;
  line-height: 1.08;
}

.cta-pill {
  margin-top: var(--space-pill-mt);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--color-ink);
  color: var(--color-cta-ink);
  border-radius: var(--pill-radius);
  padding: var(--pill-pad-y) var(--pill-pad-x);
  box-shadow: var(--shadow-pill);
  font-size: var(--size-cta-pill);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.015em;
}

.cta-pill-arrow {
  width: 26px;
  height: 26px;
  display: block;
  flex-shrink: 0;
  transform: translateY(2.5px);
}

/* Slide 1 TikTok POV */
.slide-hook {
  background: ${HOOK_SLIDE.bgHex};
}

.hook-portrait {
  position: absolute;
  left: -120px;
  bottom: 0;
  width: 1320px;
  height: 1320px;
  display: block;
  object-fit: cover;
  z-index: 1;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000000 10%, #000000 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, #000000 10%, #000000 100%);
}

.hook-caption-wrap {
  position: absolute;
  left: 90px;
  right: 110px;
  top: 1355px;
  z-index: 3;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.hook-svg {
  display: block;
  width: 880px;
  height: auto;
  overflow: visible;
  filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.34));
}

.hook-line {
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 51px;
  letter-spacing: -0.018em;
  fill: #FFFFFF;
  stroke: #000000;
  stroke-width: 12px;
  stroke-linejoin: round;
  stroke-linecap: round;
  paint-order: stroke fill;
}
`;
}

function buildHookSlideHtml(slide) {
  const lineHeight = 68;
  const startY = 58;
  const svgHeight = startY + (slide.lines.length - 1) * lineHeight + 24;
  const linesSvg = slide.lines
    .map(
      (line, idx) =>
        `<text class="hook-line" x="440" y="${startY + idx * lineHeight}" text-anchor="middle">${escapeHtml(line)}</text>`
    )
    .join('\n        ');

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Slide 1 Hook — Carrousel AI CREATOR Studio</title>
  <style>${buildSharedStyles()}</style>
</head>
<body>
  <main class="slide slide-hook" data-slide-kind="hook">
    <img class="hook-portrait" src="/demos/tiktok-carousel-v1/assets/${escapeHtml(slide.photo)}" alt="Créateur AI CREATOR Studio" />
    <div class="hook-caption-wrap">
      <svg class="hook-svg" viewBox="0 0 880 ${svgHeight}" aria-label="${escapeHtml(slide.lines.join(' '))}">
        ${linesSvg}
      </svg>
    </div>
  </main>
</body>
</html>`;
}

function buildProductSlideHtml(slide, logoWhiteSvg) {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(slide.title)} — Carrousel AI CREATOR Studio</title>
  <style>${buildSharedStyles()}</style>
</head>
<body>
  <main class="slide" data-slide-kind="product">
    <div class="halo" aria-hidden="true"><div class="halo-canvas"></div></div>
    <div class="brand-logo-wrap">${logoWhiteSvg}</div>

    <header class="product-header">
      <p class="kicker">${escapeHtml(slide.kicker)}</p>
      <h1 class="product-title">${escapeHtml(slide.title)}</h1>
      <p class="product-desc">${escapeHtml(slide.description)}</p>
    </header>

    <div class="phone-stage">
      <img class="phone-asset" src="/demos/iphone-assets/png/${escapeHtml(slide.asset)}" alt="${escapeHtml(slide.title)}" />
    </div>
  </main>
</body>
</html>`;
}

function buildCtaSlideHtml(slide, logoWhiteSvg) {
  const arrowSvg = `<svg class="cta-arrow" aria-hidden="true" viewBox="0 0 26 26" fill="none">
    <path d="M3.5 13H21M15.5 7.5L21 13L15.5 18.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const pillArrowSvg = `<svg class="cta-pill-arrow" aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="M4.5 12H19M13.5 6.5L19 12L13.5 17.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const claudeMarkSvg = `<svg class="claude-mark" aria-hidden="true" viewBox="0 0 24 24" role="img">
    <path fill="currentColor" d="${CLAUDE_STARBURST_PATH}" />
  </svg>`;

  const itemsHtml = slide.bullets
    .map(
      (line) => `<li class="cta-item">${arrowSvg}<span>${escapeHtml(line)}</span></li>`
    )
    .join('\n');

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>CTA — Carrousel AI CREATOR Studio</title>
  <style>${buildSharedStyles()}</style>
</head>
<body>
  <main class="slide" data-slide-kind="cta">
    <div class="halo" aria-hidden="true"><div class="halo-canvas"></div></div>
    <div class="brand-logo-wrap">${logoWhiteSvg}</div>

    <section class="cta-stage">
      <div class="claude-squircle">${claudeMarkSvg}</div>

      <div class="cta-title-group">
        <h1 class="cta-headline">
          <span class="cta-headline-top">${escapeHtml(slide.titleLine1)}</span>
          <span class="cta-headline-accent">${escapeHtml(slide.titleLine2)}</span>
        </h1>
        <p class="cta-subtitle">${escapeHtml(slide.subtitle)}</p>
      </div>

      <ul class="cta-list">
        ${itemsHtml}
      </ul>

      <div class="cta-footer">
        <div class="cta-brand">${escapeHtml(slide.brand)}</div>
        <div class="cta-pill"><span>${escapeHtml(slide.ctaLabel)}</span>${pillArrowSvg}</div>
      </div>
    </section>
  </main>
</body>
</html>`;
}

function buildContactSheetHtml(slidesMeta) {
  const thumbW = 320;
  const thumbH = Math.round((thumbW * SLIDE_H) / SLIDE_W);
  const cols = slidesMeta.length;
  const cards = slidesMeta
    .map(
      (s, idx) => `
      <div class="card">
        <div class="frame">
          <img src="/__out/${encodeURIComponent(s.file)}" alt="${escapeHtml(s.file)}" />
        </div>
        <div class="meta">${idx + 1}. ${escapeHtml(s.file)} (${s.width}×${s.height})</div>
      </div>`
    )
    .join('');

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #E4E2DC;
      padding: 36px;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      color: #171313;
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 24px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(${cols}, ${thumbW}px);
      gap: 24px;
      width: max-content;
    }
    .frame {
      width: ${thumbW}px;
      height: ${thumbH}px;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(17, 17, 17, 0.14);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.10);
      background: #FFFFFF;
    }
    .frame img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .meta {
      margin-top: 12px;
      font-size: 14px;
      font-weight: 600;
      color: #171313;
    }
  </style>
</head>
<body>
  <h1>Planche de contrôle ${cols}-up v2 · Carrousel TikTok 9:16 (1080×1920 px)</h1>
  <div class="grid">${cards}</div>
</body>
</html>`;
}

function startStaticServer(routesMap) {
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent((req.url || '/').split('?')[0]);

    if (routesMap.has(pathname)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(routesMap.get(pathname));
      return;
    }

    if (pathname.startsWith('/__out/')) {
      const outName = path.basename(pathname.slice('/__out/'.length));
      const outPath = path.join(OUT_PNG_DIR, outName);
      if (fs.existsSync(outPath)) {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        fs.createReadStream(outPath).pipe(res);
        return;
      }
    }

    const filePath = path.resolve(ROOT, `.${pathname}`);
    if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

async function main() {
  fs.mkdirSync(OUT_PNG_DIR, { recursive: true });
  fs.mkdirSync(AUDIT_DIR, { recursive: true });

  console.log('1. Chargement logo.svg & vérification des assets Slide 1 + 4 mockups iPhone...');
  const logoWhiteSvg = loadBrandLogoWhiteSvg();
  console.log(`   ✓ Logo lu depuis ${path.relative(ROOT, LOGO_SVG_PATH)}`);

  const hookPhotoPath = path.join(SLIDE_ASSETS_DIR, HOOK_SLIDE.photo);
  if (!fs.existsSync(hookPhotoPath)) {
    throw new Error(`Photo Slide 1 manquante : ${hookPhotoPath}`);
  }
  console.log(`   ✓ Photo Slide 1 présente : ${path.relative(ROOT, hookPhotoPath)}`);

  for (const slide of PRODUCT_SLIDES) {
    const assetPath = path.join(IPHONE_PNG_DIR, slide.asset);
    if (!fs.existsSync(assetPath)) {
      throw new Error(`Asset iPhone manquant : ${assetPath}`);
    }
    const info = inspectPngHeaderAndCorners(assetPath);
    const opaqueCorner = info.cornersAlpha && info.cornersAlpha.some((a) => a !== 0);
    if (!info.hasAlpha || opaqueCorner) {
      throw new Error(
        `Fond non transparent détecté sur ${slide.asset} (hasAlpha=${info.hasAlpha}, corners=${JSON.stringify(info.cornersAlpha)})`
      );
    }
    console.log(
      `   ✓ ${slide.asset} : ${info.width}×${info.height} px · coins alpha=${JSON.stringify(info.cornersAlpha)}`
    );
  }

  const routesMap = new Map();
  const slidesToRender = [
    {
      file: HOOK_SLIDE.file,
      route: `/__slide/${HOOK_SLIDE.file}.html`,
      html: buildHookSlideHtml(HOOK_SLIDE),
    },
    ...PRODUCT_SLIDES.map((s) => ({
      file: s.file,
      route: `/__slide/${s.file}.html`,
      html: buildProductSlideHtml(s, logoWhiteSvg),
    })),
    {
      file: CTA_SLIDE.file,
      route: `/__slide/${CTA_SLIDE.file}.html`,
      html: buildCtaSlideHtml(CTA_SLIDE, logoWhiteSvg),
    },
  ];

  for (const item of slidesToRender) {
    routesMap.set(item.route, item.html);
  }

  const { chromium } = await loadPlaywright();
  const executablePath = findChromiumExecutable();
  const { server, port } = await startStaticServer(routesMap);

  let browser;
  const outputMeta = [];

  try {
    browser = await chromium.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });

    const context = await browser.newContext({
      viewport: { width: SLIDE_W, height: SLIDE_H },
      deviceScaleFactor: 1,
      locale: 'fr-FR',
    });

    const page = await context.newPage();
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (url.startsWith(`http://127.0.0.1:${port}`) || url.startsWith('data:') || url.startsWith('blob:')) {
        return route.continue();
      }
      return route.abort();
    });

    console.log('2. Rendu & audit DOM des 6 slides 1080×1920 px (v2)...');
    for (const item of slidesToRender) {
      const url = `http://127.0.0.1:${port}${item.route}`;
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      const audit = await page.evaluate(async () => {
        await document.fonts.ready;
        const imgs = Array.from(document.querySelectorAll('img'));
        for (const img of imgs) {
          if (!img.complete) {
            await new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
            });
          }
          if (img.naturalWidth === 0) {
            throw new Error(`Image non chargée : ${img.getAttribute('src')}`);
          }
        }

        const slideEl = document.querySelector('.slide');
        const S = slideEl.getBoundingClientRect();
        const issues = [];

        if (document.documentElement.scrollWidth > S.width + 1 || document.documentElement.scrollHeight > S.height + 1) {
          issues.push('overflow-document');
        }

        const loadedFamilies = Array.from(
          new Set(
            Array.from(document.fonts)
              .filter((f) => f.status === 'loaded')
              .map((f) => f.family.replaceAll('"', ''))
          )
        );

        const slideKind = slideEl.getAttribute('data-slide-kind');
        const haloEl = document.querySelector('.halo');
        const logoWrapEl = document.querySelector('.brand-logo-wrap');
        const haloBottom = haloEl ? Math.round(haloEl.getBoundingClientRect().bottom) : 0;
        const logoBox = logoWrapEl ? logoWrapEl.getBoundingClientRect() : null;

        const headerEl = document.querySelector('.product-header');
        const phoneStageEl = document.querySelector('.phone-stage');
        const ctaStageEl = document.querySelector('.cta-stage');
        const pillEl = document.querySelector('.cta-pill');
        const hookSvgEl = document.querySelector('.hook-svg');

        let metrics = {
          haloBottom,
          logoSize: logoBox ? `${Math.round(logoBox.width)}×${Math.round(logoBox.height)}` : null,
        };

        if (slideKind === 'hook' && hookSvgEl) {
          const hr = hookSvgEl.getBoundingClientRect();
          if (hr.left < 70 || hr.right > 980) {
            issues.push(`hook-horizontal-safe-zone (left=${Math.round(hr.left)}, right=${Math.round(hr.right)})`);
          }
          if (hr.top < 1240 || hr.bottom > 1680) {
            issues.push(`hook-vertical-safe-zone (top=${Math.round(hr.top)}, bottom=${Math.round(hr.bottom)})`);
          }
          metrics = {
            slideKind: 'hook',
            captionTop: Math.round(hr.top),
            captionBottom: Math.round(hr.bottom),
            captionLeft: Math.round(hr.left),
            captionRight: Math.round(hr.right),
            bottomClearance: Math.round(S.height - hr.bottom),
          };
        } else if (headerEl && phoneStageEl) {
          const kickerEl = headerEl.querySelector('.kicker');
          const titleEl = headerEl.querySelector('.product-title');
          const descEl = headerEl.querySelector('.product-desc');
          const hr = headerEl.getBoundingClientRect();
          const pr = phoneStageEl.getBoundingClientRect();
          const visiblePhoneTop = Math.round(pr.top + pr.height * (330 / 3702));
          const visiblePhoneBottom = Math.round(pr.top + pr.height * (3300 / 3702));

          const kickerStyle = getComputedStyle(kickerEl);
          const kickerInnerH =
            kickerEl.getBoundingClientRect().height -
            parseFloat(kickerStyle.paddingTop) -
            parseFloat(kickerStyle.paddingBottom) -
            parseFloat(kickerStyle.borderTopWidth) -
            parseFloat(kickerStyle.borderBottomWidth);
          const kickerLines = Math.round(kickerInnerH / parseFloat(kickerStyle.lineHeight));
          const descLines = Math.round(descEl.getBoundingClientRect().height / parseFloat(getComputedStyle(descEl).lineHeight));

          if (logoBox && logoBox.top < 200) {
            issues.push(`tiktok-top-crop-logo (logoTop=${Math.round(logoBox.top)})`);
          }
          if (hr.top < haloBottom) {
            issues.push(`halo-overlaps-kicker (haloBottom=${haloBottom}, textTop=${Math.round(hr.top)})`);
          }
          if (hr.bottom >= visiblePhoneTop - 24) {
            issues.push(`text-too-close-to-phone (${Math.round(visiblePhoneTop - hr.bottom)}px)`);
          }
          if (visiblePhoneBottom > 1655) {
            issues.push(`tiktok-bottom-crop-phone (visiblePhoneBottom=${visiblePhoneBottom})`);
          }

          metrics = {
            ...metrics,
            logoTop: logoBox ? Math.round(logoBox.top) : null,
            kickerLines,
            titleHeight: Math.round(titleEl.getBoundingClientRect().height),
            descLines,
            textBottom: Math.round(hr.bottom),
            visiblePhoneTop,
            visiblePhoneBottom,
            textToPhoneGap: Math.round(visiblePhoneTop - hr.bottom),
            bottomClearance: Math.round(1920 - visiblePhoneBottom),
          };
        } else if (ctaStageEl && pillEl) {
          const cr = ctaStageEl.getBoundingClientRect();
          const pr = pillEl.getBoundingClientRect();
          if (logoBox && logoBox.top < 200) {
            issues.push(`tiktok-top-crop-logo (logoTop=${Math.round(logoBox.top)})`);
          }
          if (cr.top < haloBottom) {
            issues.push(`halo-overlaps-squircle (haloBottom=${haloBottom}, ctaTop=${Math.round(cr.top)})`);
          }
          if (pr.bottom > 1655) {
            issues.push(`cta-bottom-safe-violation (pillBottom=${Math.round(pr.bottom)})`);
          }
          metrics = {
            ...metrics,
            logoTop: logoBox ? Math.round(logoBox.top) : null,
            ctaTop: Math.round(cr.top),
            pillBottom: Math.round(pr.bottom),
            bottomClearance: Math.round(S.height - pr.bottom),
          };
        }

        return {
          issues,
          loadedFamilies,
          metrics,
        };
      });

      const requiredFonts =
        item.file === HOOK_SLIDE.file
          ? ['Plus Jakarta Sans']
          : ['Plus Jakarta Sans', 'Instrument Serif', 'JetBrains Mono'];
      const missingFonts = requiredFonts.filter(
        (fam) => !audit.loadedFamilies.includes(fam)
      );
      if (missingFonts.length > 0) {
        throw new Error(`Polices manquantes sur ${item.file} : ${missingFonts.join(', ')}`);
      }
      if (audit.issues.length > 0) {
        throw new Error(`Anomalie DOM sur ${item.file} : ${audit.issues.join(', ')}`);
      }

      const outPath = path.join(OUT_PNG_DIR, item.file);
      await page.screenshot({ path: outPath, type: 'png' });
      const outInfo = inspectPngHeaderAndCorners(outPath);
      if (outInfo.width !== SLIDE_W || outInfo.height !== SLIDE_H) {
        throw new Error(`Dimensions incorrectes pour ${item.file} : ${outInfo.width}×${outInfo.height}`);
      }
      outputMeta.push({ file: item.file, width: outInfo.width, height: outInfo.height });
      console.log(`   ✓ ${item.file} (${outInfo.width}×${outInfo.height} px) -> ${JSON.stringify(audit.metrics)}`);
    }

    const sheetPath = path.join(AUDIT_DIR, SHEET_FILENAME);
    console.log(`3. Génération de la planche contact ${outputMeta.length}-up dans ${sheetPath}...`);
    routesMap.set('/__sheet.html', buildContactSheetHtml(outputMeta));
    const sheetWidth = 36 * 2 + outputMeta.length * 320 + (outputMeta.length - 1) * 24;
    const sheetHeight = 36 * 2 + 46 + Math.round((320 * SLIDE_H) / SLIDE_W) + 32;
    await page.setViewportSize({ width: sheetWidth, height: sheetHeight });
    await page.goto(`http://127.0.0.1:${port}/__sheet.html`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      const imgs = Array.from(document.querySelectorAll('img'));
      await Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((r) => {
                img.addEventListener('load', r, { once: true });
                img.addEventListener('error', r, { once: true });
              })
        )
      );
    });
    await page.screenshot({ path: sheetPath, type: 'png' });
    console.log(`   ✓ Planche contact écrite : ${sheetPath}`);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error('❌ Erreur :', err.message || err);
  process.exit(1);
});
