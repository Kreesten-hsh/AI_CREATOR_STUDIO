#!/usr/bin/env node
/**
 * scripts/generate-chariow-sales-page.js
 * Genere tous les livrables finaux Chariow d'AI CREATOR Studio :
 * - 10 exports PNG Retina Ultra-HD (1200 px de large @2x) de la page de vente
 * - La vignette carree Chariow (1200 x 1200 px @2x)
 * - La banniere horizontale Chariow (1404 x 520 px @2x)
 * - Le Guide d'Acces Officiel PDF A4 (1 page exacte)
 *
 * Sortie : public/downloads/chariow-sales-page/
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const publicDir = path.join(rootDir, 'public');
const docsDir = path.join(rootDir, 'docs');
const sourceHtmlPath = path.join(publicDir, 'demos', 'chariow-sales-page.html');
const guideHtmlPath = path.join(docsDir, 'guides', 'GUIDE-ACCES-MINI-COURS-CLAUDE.html');
const outputDir = path.join(publicDir, 'downloads', 'chariow-sales-page');

export const COVER_PNG_NAME = 'chariow-cover-square-1200x1200.png';
export const BANNER_PNG_NAME = 'chariow-banner-1404x520.png';
export const ACCESS_PDF_NAME = 'GUIDE-ACCES-MINI-COURS-INTERACTIF-CLAUDE.pdf';

export const EXPECTED_SLICES = [
  '01-hero-transformation',
  '02-mockup-studio-interieur',
  '03-storytelling-constat',
  '04-piliers-interactivite',
  '05-preuve-sociale-retours',
  '06-tout-ce-qui-est-inclus',
  '07-avant-apres-calculateur',
  '08-pour-qui-et-faq',
  '09-investissement-14900-fcfa',
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8',
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
      // Continue searching
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
      // Continue searching
    }
  }

  throw new Error(
    'Impossible de localiser playwright ou playwright-core. Installez playwright-core ou executez npx playwright.'
  );
}

function findChromiumExecutable() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }

  const msPlaywrightCache = path.join(os.homedir(), '.cache', 'ms-playwright');
  const cachedHeadless = walkFiles(
    msPlaywrightCache,
    (_fullPath, name) => name === 'chrome-headless-shell' || name === 'chrome'
  ).sort((a, b) => (a.includes('chrome-headless-shell') ? -1 : 1) - (b.includes('chrome-headless-shell') ? -1 : 1));

  if (cachedHeadless.length > 0) {
    return cachedHeadless[0];
  }

  for (const bin of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    try {
      const resolved = execSync(`command -v "${bin}"`, {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (resolved && fs.existsSync(resolved)) {
        return resolved;
      }
    } catch {
      // Continue searching
    }
  }

  return undefined;
}

const SHARED_FONTS_AND_TOKENS_CSS = `
  @font-face {
    font-family: 'Instrument Serif';
    font-style: normal;
    font-weight: 400;
    font-display: block;
    src: url('/fonts/InstrumentSerif-Regular.ttf') format('truetype');
  }
  @font-face {
    font-family: 'Instrument Serif';
    font-style: italic;
    font-weight: 400;
    font-display: block;
    src: url('/fonts/InstrumentSerif-Italic.ttf') format('truetype');
  }
  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-style: normal;
    font-weight: 400 800;
    font-display: block;
    src: url('/fonts/PlusJakartaSans-latin-ext.woff2') format('woff2');
    unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-style: normal;
    font-weight: 400 800;
    font-display: block;
    src: url('/fonts/PlusJakartaSans-latin.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  @font-face {
    font-family: 'JetBrains Mono';
    font-style: normal;
    font-weight: 400 500;
    font-display: block;
    src: url('/fonts/JetBrainsMono-Regular.ttf') format('truetype');
  }
  @font-face {
    font-family: 'JetBrains Mono';
    font-style: normal;
    font-weight: 700;
    font-display: block;
    src: url('/fonts/JetBrainsMono-Bold.ttf') format('truetype');
  }
  @font-face {
    font-family: 'Archivo Black';
    font-style: normal;
    font-weight: 400;
    font-display: block;
    src: url('/fonts/ArchivoBlack-latin.woff2') format('woff2');
  }

  :root {
    --red: #B63131;
    --cream: #FAF6F0;
    --pale-pink: #F7E0E2;
    --surface: #FFFDFC;
    --ink: #171313;
    --font-serif: 'Instrument Serif', Georgia, serif;
    --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --font-display: 'Archivo Black', Impact, sans-serif;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: var(--cream);
    color: var(--ink);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
`;

const STUDIO_MACBOOK_CSS = `
  .macbook-scale-host {
    position: relative;
    transform-origin: top left;
  }

  .macbook-wrap {
    width: 398px;
    position: relative;
  }

  .macbook-lid {
    background: #1B1717;
    border-radius: 13px 13px 3px 3px;
    padding: 8px 8px 6px;
    border: 1.5px solid var(--ink);
    position: relative;
  }

  .macbook-notch {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 46px;
    height: 7px;
    background: #1B1717;
    border-radius: 0 0 5px 5px;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .macbook-cam {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #463E3E;
  }

  .macbook-screen {
    background: var(--cream);
    border-radius: 6px;
    overflow: hidden;
    text-align: left;
    border: 1px solid #312B2B;
  }

  .macbook-base {
    width: 422px;
    margin-left: -12px;
    height: 11px;
    background: #CFC8C0;
    border-radius: 0 0 8px 8px;
    border: 1px solid var(--ink);
    border-top: 1px solid #8E867E;
    position: relative;
  }

  .macbook-thumb {
    width: 66px;
    height: 4px;
    background: #9B938B;
    border-radius: 0 0 4px 4px;
    margin: 0 auto;
  }

  .studio-topbar {
    background: var(--pale-pink);
    border-bottom: 1.5px solid var(--ink);
    padding: 6px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .studio-logo {
    font-family: var(--font-display);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    color: var(--ink);
    line-height: 1;
  }

  .studio-logo span {
    font-family: var(--font-serif);
    font-style: italic;
    font-weight: 400;
    text-transform: lowercase;
    color: var(--red);
    font-size: 11.5px;
  }

  .studio-top-meta {
    font-family: var(--font-mono);
    font-size: 6.5px;
    font-weight: 700;
    color: var(--ink);
    background: var(--surface);
    border: 1px solid var(--ink);
    border-radius: 999px;
    padding: 1.5px 6px;
  }

  .studio-body {
    display: grid;
    grid-template-columns: 108px 1fr;
    min-height: 200px;
  }

  .studio-sidebar {
    background: var(--pale-pink);
    border-right: 1.5px solid var(--ink);
    padding: 8px 6px;
    display: flex;
    flex-direction: column;
    gap: 6.5px;
  }

  .studio-nav-home {
    background: var(--red);
    color: var(--surface);
    border: 1.5px solid var(--ink);
    border-radius: 4px;
    padding: 4px 6px;
    font-family: var(--font-mono);
    font-size: 7px;
    font-weight: 700;
    text-transform: uppercase;
    box-shadow: 1.5px 1.5px 0 var(--ink);
  }

  .studio-nav-group-title {
    font-family: var(--font-mono);
    font-size: 6px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--ink);
    padding: 2px 2px 0;
  }

  .studio-nav-item {
    background: var(--surface);
    border: 1px solid var(--ink);
    border-radius: 4px;
    padding: 3.5px 5px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 6.5px;
    font-weight: 700;
    letter-spacing: 0.015em;
    word-spacing: 0.08em;
    color: var(--ink);
    line-height: 1.1;
  }

  .studio-nav-num {
    background: rgba(230, 160, 168, 0.55);
    border: 1px solid var(--ink);
    border-radius: 2px;
    padding: 1px 3px;
    font-family: var(--font-mono);
    font-size: 5.5px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .studio-nav-bonus {
    background: var(--surface);
    border: 1px solid var(--ink);
    border-radius: 4px;
    padding: 3px 5px;
    font-size: 6.3px;
    font-weight: 700;
    color: var(--ink);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .studio-nav-bonus-tag {
    font-family: var(--font-mono);
    font-size: 5.5px;
    color: var(--red);
  }

  .studio-main {
    background: var(--cream);
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .studio-hero-card {
    background: var(--red);
    border: 1.5px solid var(--ink);
    border-radius: 6px;
    box-shadow: 2.5px 2.5px 0 var(--ink);
    overflow: hidden;
  }

  .studio-hero-checker {
    height: 7px;
    border-bottom: 1.5px solid var(--ink);
    background-color: var(--pale-pink);
    background-image:
      linear-gradient(45deg, rgba(230, 160, 168, 0.65) 25%, transparent 25%),
      linear-gradient(-45deg, rgba(230, 160, 168, 0.65) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, rgba(230, 160, 168, 0.65) 75%),
      linear-gradient(-45deg, transparent 75%, rgba(230, 160, 168, 0.65) 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0;
  }

  .studio-hero-inner {
    padding: 8px 9px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
  }

  .studio-hero-pill {
    display: inline-block;
    background: var(--surface);
    color: var(--ink);
    border: 1px solid var(--ink);
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: 5.5px;
    font-weight: 700;
    padding: 1px 6px;
    box-shadow: 1px 1px 0 var(--ink);
  }

  .studio-hero-h {
    margin-top: 4px;
    font-family: var(--font-display);
    font-size: 7.6px;
    line-height: 1.15;
    color: var(--surface);
    text-transform: uppercase;
    letter-spacing: -0.02em;
  }

  .studio-hero-sub {
    margin-top: 3.5px;
    font-family: var(--font-sans);
    font-size: 6.4px;
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: 0.01em;
    color: rgba(255, 253, 252, 0.94);
  }

  .studio-hero-cta {
    margin-top: 5px;
    display: inline-block;
    background: var(--surface);
    color: var(--ink);
    border: 1px solid var(--ink);
    border-radius: 3px;
    padding: 2px 5.5px;
    font-family: var(--font-mono);
    font-size: 5.6px;
    font-weight: 700;
    text-transform: uppercase;
    box-shadow: 1px 1px 0 var(--ink);
  }

  .studio-circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--surface);
    border: 1.5px solid var(--ink);
    box-shadow: 2px 2px 0 var(--ink);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .studio-circle-pct {
    font-family: var(--font-display);
    font-size: 12px;
    line-height: 1;
    color: var(--ink);
  }

  .studio-circle-lbl {
    font-family: var(--font-mono);
    font-size: 5.2px;
    font-weight: 700;
    color: var(--ink);
    margin-top: 2px;
  }

  .studio-affiliate-card {
    background: var(--surface);
    border: 1.5px solid var(--ink);
    border-radius: 6px;
    padding: 6.5px 8px;
    box-shadow: 2px 2px 0 var(--ink);
    width: 96%;
  }

  .studio-affiliate-tag {
    font-family: var(--font-mono);
    font-size: 5.5px;
    font-weight: 700;
    color: var(--red);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .studio-affiliate-title {
    font-family: var(--font-serif);
    font-size: 11.5px;
    line-height: 1.1;
    color: var(--ink);
    margin-top: 1px;
  }

  .studio-affiliate-desc {
    font-size: 6px;
    line-height: 1.32;
    letter-spacing: 0.01em;
    word-spacing: 0.08em;
    color: rgba(23, 19, 19, 0.78);
    margin-top: 2px;
  }
`;

function renderStudioMacbookMarkup() {
  return `
    <div class="macbook-wrap">
      <div class="macbook-lid">
        <div class="macbook-notch" aria-hidden="true"><span class="macbook-cam"></span></div>
        <div class="macbook-screen">
          <div class="studio-topbar">
            <div class="studio-logo">AI CREATOR <span>studio</span></div>
            <div class="studio-top-meta">0% COMPLÉTÉ</div>
          </div>
          <div class="studio-body">
            <div class="studio-sidebar">
              <div class="studio-nav-home">Accueil du cours</div>
              <div class="studio-nav-group-title">LA FORMATION</div>
              <div class="studio-nav-item"><span class="studio-nav-num">01</span><span>CHOISIR</span></div>
              <div class="studio-nav-item"><span class="studio-nav-num">02</span><span>CRÉER</span></div>
              <div class="studio-nav-item"><span class="studio-nav-num">03</span><span>PUBLIER ET LIVRER</span></div>
              <div class="studio-nav-group-title">BONUS</div>
              <div class="studio-nav-bonus"><span>Bonus 01</span><span class="studio-nav-bonus-tag">ManyChat</span></div>
              <div class="studio-nav-bonus"><span>Bonus 02</span><span class="studio-nav-bonus-tag">Marketing</span></div>
            </div>
            <div class="studio-main">
              <div class="studio-hero-card">
                <div class="studio-hero-checker"></div>
                <div class="studio-hero-inner">
                  <div>
                    <span class="studio-hero-pill">MINI-COURS</span>
                    <div class="studio-hero-h">
                      UTILISER CLAUDE POUR CRÉER DES PRODUITS DIGITAUX...
                    </div>
                    <div class="studio-hero-sub">
                      Transforme ton document existant en expérience interactive.
                    </div>
                    <div class="studio-hero-cta">Commencer la Leçon 01</div>
                  </div>
                  <div class="studio-circle">
                    <span class="studio-circle-pct">0%</span>
                    <span class="studio-circle-lbl">FAIT</span>
                  </div>
                </div>
              </div>
              <div class="studio-affiliate-card">
                <div class="studio-affiliate-tag">AFFILIATION</div>
                <div class="studio-affiliate-title">Partage ce cours + gagne 20%</div>
                <div class="studio-affiliate-desc">
                  Recommande le mini-cours à ton audience et perçois ta commission automatiquement.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="macbook-base"><div class="macbook-thumb"></div></div>
    </div>
  `;
}

function buildCoverHtml() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Mini-Cours Interactif Claude • Vignette Chariow</title>
  <style>
    ${SHARED_FONTS_AND_TOKENS_CSS}
    ${STUDIO_MACBOOK_CSS}

    .cover-canvas {
      width: 600px;
      height: 600px;
      background: var(--cream);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .cover-frame {
      position: absolute;
      inset: 20px;
      border: 1.5px solid var(--ink);
      pointer-events: none;
      z-index: 1;
    }

    .cover-header {
      padding-top: 56px;
      position: relative;
      z-index: 2;
      max-width: 490px;
    }

    .cover-eyebrow {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--red);
    }

    .cover-title {
      font-family: var(--font-serif);
      font-weight: 400;
      font-size: 56px;
      line-height: 1.02;
      color: var(--ink);
      margin-top: 10px;
    }

    .cover-title em {
      font-style: italic;
      color: var(--red);
    }

    .cover-subtitle {
      font-family: var(--font-sans);
      font-size: 13.5px;
      line-height: 1.45;
      letter-spacing: 0.01em;
      word-spacing: 0.05em;
      color: rgba(23, 19, 19, 0.78);
      margin-top: 12px;
    }

    .cover-stage {
      margin-top: 42px;
      width: 446px;
      height: 266px;
      position: relative;
      z-index: 2;
    }

    .cover-macbook {
      position: absolute;
      left: 0;
      top: 22px;
      z-index: 2;
      width: 398px;
      transform: scale(0.84);
      transform-origin: top left;
    }

    .cover-iphone-img {
      display: block;
      width: 116px;
      height: auto;
      aspect-ratio: 490 / 1024;
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 4;
      border-radius: 19px;
      box-shadow: -8px 12px 24px rgba(23, 19, 19, 0.22);
    }
  </style>
</head>
<body>
  <main id="cover-canvas" class="cover-canvas">
    <div class="cover-frame" aria-hidden="true"></div>

    <header class="cover-header">
      <div class="cover-eyebrow">AI CREATOR STUDIO</div>
      <h1 class="cover-title">
        Mini-Cours <em>Interactif</em><br />
        Claude
      </h1>
      <p class="cover-subtitle">
        Transformer un simple document en produit digital interactif.
      </p>
    </header>

    <div class="cover-stage">
      <div class="cover-macbook">
        ${renderStudioMacbookMarkup()}
      </div>

      <img
        class="cover-iphone-img"
        src="/demos/assets/iphone-studio-lesson.jpg"
        alt="Aperçu mobile de la Leçon 01 d'AI CREATOR Studio sur iPhone"
        width="116"
        height="242"
      />
    </div>
  </main>
</body>
</html>`;
}

function buildBannerHtml() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Mini-Cours Interactif Claude • Bannière Chariow</title>
  <style>
    ${SHARED_FONTS_AND_TOKENS_CSS}
    ${STUDIO_MACBOOK_CSS}

    .banner-canvas {
      width: 702px;
      height: 260px;
      display: grid;
      grid-template-columns: 1.08fr 0.92fr;
      border: 1.5px solid var(--ink);
      overflow: hidden;
      background: var(--cream);
    }

    .banner-left {
      background: var(--red);
      color: var(--cream);
      padding: 34px 36px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-right: 1.5px solid var(--ink);
    }

    .banner-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .banner-eyebrow {
      font-family: var(--font-mono);
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--pale-pink);
    }

    .banner-title {
      font-family: var(--font-serif);
      font-weight: 400;
      font-size: 40px;
      line-height: 1.03;
      color: var(--cream);
    }

    .banner-title em {
      font-style: italic;
      color: var(--pale-pink);
    }

    .banner-sub-wrap {
      border-top: 1px solid rgba(250, 246, 240, 0.3);
      padding-top: 11px;
    }

    .banner-sub {
      font-family: var(--font-sans);
      font-size: 12px;
      line-height: 1.45;
      letter-spacing: 0.01em;
      word-spacing: 0.05em;
      color: rgba(250, 246, 240, 0.92);
    }

    .banner-right {
      background: var(--cream);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px 10px;
    }

    .banner-stage {
      position: relative;
      width: 299px;
      height: 230px;
    }

    .banner-macbook {
      position: absolute;
      left: 0;
      top: 38px;
      z-index: 2;
      width: 398px;
      transform: scale(0.55);
      transform-origin: top left;
    }

    .banner-iphone-img {
      display: block;
      width: 86px;
      height: auto;
      aspect-ratio: 490 / 1024;
      position: absolute;
      right: 0;
      bottom: 8px;
      z-index: 4;
      border-radius: 14px;
      box-shadow: -6px 8px 18px rgba(23, 19, 19, 0.22);
    }
  </style>
</head>
<body>
  <main id="banner-canvas" class="banner-canvas">
    <section class="banner-left">
      <div class="banner-top">
        <span class="banner-eyebrow">AI CREATOR STUDIO</span>
      </div>

      <h1 class="banner-title">
        Mini-Cours <em>Interactif</em> Claude
      </h1>

      <div class="banner-sub-wrap">
        <p class="banner-sub">
          Transforme tes guides PDF ennuyeux en un produit digital interactif.
        </p>
      </div>
    </section>

    <section class="banner-right">
      <div class="banner-stage">
        <div class="banner-macbook">
          ${renderStudioMacbookMarkup()}
        </div>
        <img
          class="banner-iphone-img"
          src="/demos/assets/iphone-studio-lesson.jpg"
          alt="Aperçu mobile du Mini-Cours Interactif Claude sur iPhone"
          width="86"
          height="180"
        />
      </div>
    </section>
  </main>
</body>
</html>`;
}

function startStaticServer(publicBaseDir, docsBaseDir) {
  const virtualRoutes = new Map([
    ['/__chariow-cover.html', buildCoverHtml()],
    ['/__chariow-banner.html', buildBannerHtml()],
  ]);

  const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url || '/', 'http://127.0.0.1');
    const urlPath = decodeURIComponent(reqUrl.pathname);

    if (virtualRoutes.has(urlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(virtualRoutes.get(urlPath));
      return;
    }

    let safePath;
    if (urlPath.startsWith('/docs/')) {
      const relDocs = urlPath.slice('/docs/'.length).replace(/^\/+/, '');
      safePath = path.resolve(docsBaseDir, relDocs);
      if (!safePath.startsWith(docsBaseDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
      }
    } else if (urlPath.startsWith('/public/')) {
      const relPub = urlPath.slice('/public/'.length).replace(/^\/+/, '');
      safePath = path.resolve(publicBaseDir, relPub);
      if (!safePath.startsWith(publicBaseDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
      }
    } else {
      const relPath = urlPath.replace(/^\/+/, '');
      safePath = path.resolve(publicBaseDir, relPath);
      if (!safePath.startsWith(publicBaseDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
      }
    }

    if (!fs.existsSync(safePath) || fs.statSync(safePath).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(safePath).pipe(res);
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, port: addr.port });
    });
  });
}

export function readPngDimensions(buffer) {
  const signatureHex = buffer.subarray(0, 8).toString('hex');
  if (signatureHex !== '89504e470d0a1a0a') {
    throw new Error(`Signature PNG invalide : ${signatureHex}`);
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

export function countPdfPages(pdfBuffer) {
  const ascii = pdfBuffer.toString('latin1');
  if (!ascii.startsWith('%PDF-')) {
    throw new Error('En-tete PDF invalide (%PDF- manquant).');
  }
  const countMatches = Array.from(ascii.matchAll(/\/Type\s*\/Pages\b[\s\S]{0,120}?\/Count\s+(\d+)/g));
  if (countMatches.length > 0) {
    return Math.max(...countMatches.map((m) => Number.parseInt(m[1], 10)));
  }
  const leafPages = ascii.match(/\/Type\s*\/Page\b(?!s)/g);
  return leafPages ? leafPages.length : 0;
}

async function waitForPageAssets(page, containerSelector) {
  return page.evaluate(async (selector) => {
    await document.fonts.ready;

    const container = document.querySelector(selector);
    if (!container) {
      throw new Error(`Conteneur introuvable : ${selector}`);
    }

    const imgs = Array.from(container.querySelectorAll('img'));
    const imageResults = await Promise.all(
      imgs.map(async (img) => {
        const src = img.getAttribute('src') || '';
        if (!img.complete) {
          await new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          });
        }
        if (typeof img.decode === 'function') {
          try {
            await img.decode();
          } catch {
            // Checked via naturalWidth below
          }
        }
        return {
          src,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
        };
      })
    );

    const brokenImages = imageResults.filter((item) => !item.complete || item.naturalWidth === 0);
    if (brokenImages.length > 0) {
      throw new Error(`Image(s) non chargee(s) dans ${selector} : ${brokenImages.map((b) => b.src).join(', ')}`);
    }

    const loadedFamilies = Array.from(
      new Set(
        Array.from(document.fonts)
          .filter((f) => f.status === 'loaded')
          .map((f) => f.family.replace(/['"]/g, ''))
      )
    );

    return {
      loadedFamilies,
      loadedImages: imageResults.length,
    };
  }, containerSelector);
}

async function captureCoverAndBanner(browser, port) {
  const targets = [
    {
      route: '/__chariow-cover.html',
      selector: '#cover-canvas',
      viewport: { width: 600, height: 600 },
      file: COVER_PNG_NAME,
      expectedWidth: 1200,
      expectedHeight: 1200,
    },
    {
      route: '/__chariow-banner.html',
      selector: '#banner-canvas',
      viewport: { width: 702, height: 260 },
      file: BANNER_PNG_NAME,
      expectedWidth: 1404,
      expectedHeight: 520,
    },
  ];

  const results = [];
  for (const target of targets) {
    const context = await browser.newContext({
      viewport: target.viewport,
      deviceScaleFactor: 2,
      locale: 'fr-FR',
    });

    try {
      const page = await context.newPage();
      await page.route('**/*', (route) => {
        const url = route.request().url();
        if (url.startsWith(`http://127.0.0.1:${port}`) || url.startsWith('data:') || url.startsWith('blob:')) {
          return route.continue();
        }
        return route.abort();
      });

      await page.goto(`http://127.0.0.1:${port}${target.route}`, { waitUntil: 'domcontentloaded' });
      const summary = await waitForPageAssets(page, target.selector);
      if (summary.loadedImages < 1) {
        throw new Error(`Capture iPhone manquante dans ${target.file}.`);
      }

      const outPath = path.join(outputDir, target.file);
      await page.locator(target.selector).screenshot({
        path: outPath,
        animations: 'disabled',
      });

      const buffer = fs.readFileSync(outPath);
      const { width, height } = readPngDimensions(buffer);
      if (width !== target.expectedWidth || height !== target.expectedHeight) {
        throw new Error(
          `Dimensions PNG inattendues pour ${target.file} : ${width}x${height} (attendu ${target.expectedWidth}x${target.expectedHeight}).`
        );
      }

      results.push({
        file: target.file,
        width,
        height,
        kb: Number((buffer.length / 1024).toFixed(1)),
      });
    } finally {
      await context.close();
    }
  }

  return results;
}

async function generateAccessGuidePdf(browser, port) {
  if (!fs.existsSync(guideHtmlPath)) {
    throw new Error(`Source HTML du Guide d'Acces introuvable : ${guideHtmlPath}`);
  }

  const context = await browser.newContext({
    viewport: { width: 794, height: 1123 },
    deviceScaleFactor: 2,
    locale: 'fr-FR',
  });

  try {
    const page = await context.newPage();
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (url.startsWith(`http://127.0.0.1:${port}`) || url.startsWith('data:') || url.startsWith('blob:')) {
        return route.continue();
      }
      return route.abort();
    });

    await page.goto(`http://127.0.0.1:${port}/docs/guides/GUIDE-ACCES-MINI-COURS-CLAUDE.html`, {
      waitUntil: 'domcontentloaded',
    });
    await waitForPageAssets(page, '.a4-sheet');

    const pdfPath = path.join(outputDir, ACCESS_PDF_NAME);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    });

    const pdfBuffer = fs.readFileSync(pdfPath);
    const pageCount = countPdfPages(pdfBuffer);
    if (pageCount !== 1) {
      throw new Error(`Le PDF ${ACCESS_PDF_NAME} fait ${pageCount} page(s) au lieu d'exactement 1 page A4.`);
    }

    return {
      file: ACCESS_PDF_NAME,
      pages: pageCount,
      kb: Number((pdfBuffer.length / 1024).toFixed(1)),
    };
  } finally {
    await context.close();
  }
}

export async function generateSalesPagePngs() {
  if (!fs.existsSync(sourceHtmlPath)) {
    throw new Error(`Page HTML source introuvable : ${sourceHtmlPath}`);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const { chromium } = await loadPlaywright();
  const executablePath = findChromiumExecutable();
  const { server, port } = await startStaticServer(publicDir, docsDir);

  let browser;
  try {
    browser = await chromium.launch({
      executablePath,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const context = await browser.newContext({
      viewport: { width: 600, height: 900 },
      deviceScaleFactor: 2,
      locale: 'fr-FR',
    });

    const page = await context.newPage();

    // Garantit un rendu 100% deterministe sur les polices locales sans attendre d'eventuels timeouts reseau externes
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (url.startsWith(`http://127.0.0.1:${port}`) || url.startsWith('data:') || url.startsWith('blob:')) {
        return route.continue();
      }
      return route.abort();
    });

    const targetUrl = `http://127.0.0.1:${port}/demos/chariow-sales-page.html?export=1`;
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    const assetSummary = await waitForPageAssets(page, '#sales-column');
    const domMetrics = await page.evaluate(() => {
      // Verrouille chaque tranche sur une hauteur entiere en pixels CSS pour eliminer tout debordement sous-pixel entre sections
      const sliceSections = Array.from(document.querySelectorAll('section[data-slice]'));
      for (const section of sliceSections) {
        const rectHeight = section.getBoundingClientRect().height;
        section.style.height = `${Math.ceil(rectHeight)}px`;
      }

      const columnWidth = document.getElementById('sales-column')?.getBoundingClientRect().width || 0;
      const sliceNames = sliceSections.map((el) => el.getAttribute('data-slice'));
      return { columnWidth, sliceNames };
    });

    if (assetSummary.loadedImages < 2) {
      throw new Error(
        `Nombre d'images iPhone insuffisant dans #sales-column : ${assetSummary.loadedImages} (attendu >= 2).`
      );
    }

    if (Math.round(domMetrics.columnWidth) !== 600) {
      throw new Error(`Largeur #sales-column inattendue : ${domMetrics.columnWidth}px (attendu 600px).`);
    }

    for (const expectedSlice of EXPECTED_SLICES) {
      if (!domMetrics.sliceNames.includes(expectedSlice)) {
        throw new Error(`Tranche obligatoire manquante dans le DOM : ${expectedSlice}`);
      }
    }

    const generated = [];

    // 1. Capture complete continue
    const fullPath = path.join(outputDir, '00-full-sales-page.png');
    await page.locator('#sales-column').screenshot({
      path: fullPath,
      animations: 'disabled',
    });
    generated.push({ file: '00-full-sales-page.png', filePath: fullPath });

    // 2. Capture des 9 tranches individuelles
    for (const sliceName of EXPECTED_SLICES) {
      const sliceFile = `${sliceName}.png`;
      const slicePath = path.join(outputDir, sliceFile);
      await page.locator(`section[data-slice="${sliceName}"]`).screenshot({
        path: slicePath,
        animations: 'disabled',
      });
      generated.push({ file: sliceFile, filePath: slicePath });
    }

    await context.close();

    const report = generated.map(({ file, filePath }) => {
      const buffer = fs.readFileSync(filePath);
      const { width, height } = readPngDimensions(buffer);
      if (width !== 1200) {
        throw new Error(`Largeur PNG Retina invalide pour ${file} : ${width}px (attendu 1200px).`);
      }
      return {
        file,
        width,
        height,
        bytes: buffer.length,
        kb: Number((buffer.length / 1024).toFixed(1)),
      };
    });

    // 3. Vignette (1200x1200) et Banniere (1404x520) Chariow
    const coverAndBanner = await captureCoverAndBanner(browser, port);

    // 4. Guide d'Acces Client PDF (1 page A4 exacte)
    const pdfReport = await generateAccessGuidePdf(browser, port);

    console.log('✅ Page de vente Chariow exportee en Retina Ultra-HD (@2x, 1200px) :');
    console.log(`   Polices chargees : ${assetSummary.loadedFamilies.join(', ')}`);
    console.log(`   Images chargees  : ${assetSummary.loadedImages}`);
    for (const item of report) {
      console.log(`   - ${item.file.padEnd(48)} ${item.width} × ${item.height} px   (${item.kb} Ko)`);
    }
    console.log('✅ Visuels de couverture Chariow (@2x) :');
    for (const item of coverAndBanner) {
      console.log(`   - ${item.file.padEnd(48)} ${item.width} × ${item.height} px   (${item.kb} Ko)`);
    }
    console.log('✅ Guide d Acces PDF acheteur :');
    console.log(`   - ${pdfReport.file.padEnd(48)} ${pdfReport.pages} page A4        (${pdfReport.kb} Ko)`);

    return { fontSummary: assetSummary, report, coverAndBanner, pdfReport };
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  generateSalesPagePngs().catch((err) => {
    console.error(`❌ Echec export PNG Chariow : ${err.message}`);
    process.exit(1);
  });
}
