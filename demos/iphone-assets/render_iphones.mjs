import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');
const OUT_PNG_DIR = path.join(__dirname, 'png');
const AUDIT_DIR = '/tmp/iphone18-assets-audit';

const CHROME = path.join(
  ROOT,
  'video-studio/node_modules/.remotion/chrome-headless-shell/linux64/chrome-headless-shell-linux64/chrome-headless-shell'
);

const require = createRequire(import.meta.url);
function findPlaywright() {
  const localCandidate = path.join(ROOT, 'node_modules/playwright-core/index.js');
  if (fs.existsSync(localCandidate)) return require(localCandidate);
  const npxDir = path.join(process.env.HOME || '', '.npm', '_npx');
  if (fs.existsSync(npxDir)) {
    for (const entry of fs.readdirSync(npxDir)) {
      const candidate = path.join(npxDir, entry, 'node_modules', 'playwright-core', 'index.js');
      if (fs.existsSync(candidate)) return require(candidate);
    }
  }
  throw new Error('playwright-core introuvable (ni local, ni dans ~/.npm/_npx)');
}

const playwright = findPlaywright();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.svg': 'image/svg+xml',
};

const SCREEN_W = 440;
const SCREEN_H = 956;
const SCALE = 3;

// Dimensions physiques du gabarit de référence (style iPhone 15/16 Pro · Titane Naturel · Bezel noir pur)
const BEZEL = 11.5;
const FRAME = 5.5;
const OUTER_W = SCREEN_W + (BEZEL + FRAME) * 2; // 474 CSS px
const OUTER_H = SCREEN_H + (BEZEL + FRAME) * 2; // 990 CSS px
const MARGIN_X = 112;
const MARGIN_TOP = 110;
const MARGIN_BOTTOM = 134;
const CANVAS_W = OUTER_W + MARGIN_X * 2; // 698 CSS px -> 2094 px @3x
const CANVAS_H = OUTER_H + MARGIN_TOP + MARGIN_BOTTOM; // 1234 CSS px -> 3702 px @3x

const APPS = [
  {
    id: 'mijote',
    label: 'Mijote',
    urlPath: '/demos/apps/mijote/index.html',
    outFile: 'iphone18-mijote.png',
    statusTheme: 'dark',
    homeTheme: 'dark',
    cssOverride: `
      .top-header { padding-top: 68px !important; }
      :root { --safe-bottom: 18px !important; }
    `,
  },
  {
    id: 'kinetik',
    label: 'Kinetik',
    urlPath: '/demos/apps/kinetik/index.html',
    outFile: 'iphone18-kinetik.png',
    statusTheme: 'light',
    homeTheme: 'light',
    cssOverride: `
      .topbar { padding-top: 64px !important; }
      .hero-card {
        margin-top: -122px !important;
        min-height: clamp(680px, 79dvh, 770px) !important;
      }
      .tabbar { padding-bottom: 22px !important; }
    `,
  },
  {
    id: 'onda',
    label: 'Onda',
    urlPath: '/demos/apps/onda/index.html',
    outFile: 'iphone18-onda.png',
    statusTheme: 'dark',
    homeTheme: 'dark',
    cssOverride: `
      .top-bar { padding-top: 70px !important; }
    `,
  },
  {
    id: 'solde',
    label: 'SOLDE.',
    urlPath: '/demos/apps/solde/index.html',
    outFile: 'iphone18-solde.png',
    statusTheme: 'light',
    homeTheme: 'dark',
    unlockStorage: { solde_access: 'ok' },
    injectLocalSoldeFonts: true,
    cssOverride: `
      .hero-backdrop { padding-top: 66px !important; }
      .mobile-dock { bottom: 26px !important; }
    `,
  },
];

function startStaticServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const filePath = path.resolve(ROOT, `.${urlPath}`);
    if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

function buildMockupHtml({ screenDataUri, statusTheme, homeTheme, label }) {
  const isLightStatus = statusTheme === 'light';
  const isLightHome = (homeTheme || statusTheme) === 'light';
  const fg = isLightStatus ? '#FFFFFF' : '#111111';
  const homeBg = isLightHome ? 'rgba(255, 255, 255, 0.90)' : 'rgba(17, 17, 17, 0.86)';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: ${CANVAS_W}px;
    height: ${CANVAS_H}px;
    background: transparent !important;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .stage {
    width: ${CANVAS_W}px;
    height: ${CANVAS_H}px;
    padding: ${MARGIN_TOP}px ${MARGIN_X}px ${MARGIN_BOTTOM}px ${MARGIN_X}px;
    background: transparent !important;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  /* Châssis externe Titane Naturel fidèle à la référence */
  .chassis {
    position: relative;
    width: ${OUTER_W}px;
    height: ${OUTER_H}px;
    border-radius: 66px;
    padding: ${FRAME}px;
    background:
      linear-gradient(145deg,
        #E4E4E2 0%,
        #B5B4B1 16%,
        #DEDDD9 34%,
        #8D8C89 56%,
        #C7C6C2 78%,
        #9F9E9B 92%,
        #D5D4D0 100%
      );
    box-shadow:
      0 26px 48px -10px rgba(0, 0, 0, 0.20),
      0 10px 22px -4px rgba(0, 0, 0, 0.12),
      0 0 0 1px rgba(0, 0, 0, 0.22),
      inset 0 0 0 1px rgba(255, 255, 255, 0.62);
  }

  /* Reflet micro-brossé subtil sur la tranche métallique */
  .chassis::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 66px;
    background: repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.03) 0px,
      rgba(0, 0, 0, 0.02) 1px,
      transparent 2px,
      transparent 4px
    );
    pointer-events: none;
  }

  /* Bandes d'antenne discrètes sur les tranches haut/bas du titane */
  .antenna {
    position: absolute;
    height: 2.5px;
    width: 5.5px;
    background: rgba(96, 95, 92, 0.55);
    z-index: 4;
  }
  .ant-tl { left: 0; top: 76px; }
  .ant-tr { right: 0; top: 76px; }
  .ant-bl { left: 0; bottom: 76px; }
  .ant-br { right: 0; bottom: 76px; }

  /* Boutons latéraux matériels fidèles (3 à gauche · 1 Power à droite) */
  .btn-hw {
    position: absolute;
    background: linear-gradient(180deg, #C7C6C2 0%, #8C8B88 22%, #B5B4B0 50%, #7C7B78 82%, #B9B8B4 100%);
    z-index: 1;
  }
  .btn-left {
    left: -3px;
    width: 3.2px;
    border-radius: 2px 0 0 2px;
    box-shadow:
      -0.5px 0 0 rgba(0, 0, 0, 0.28),
      inset 1px 0 1px rgba(255, 255, 255, 0.55);
  }
  .btn-action { top: 150px; height: 30px; }
  .btn-vol-up { top: 204px; height: 56px; }
  .btn-vol-dn { top: 274px; height: 56px; }

  .btn-power {
    right: -3px;
    width: 3.2px;
    top: 230px;
    height: 86px;
    border-radius: 0 2px 2px 0;
    box-shadow:
      0.5px 0 0 rgba(0, 0, 0, 0.28),
      inset -1px 0 1px rgba(255, 255, 255, 0.55);
  }

  /* Bezel noir OLED pur sans halo interne */
  .bezel {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 60.5px;
    padding: ${BEZEL}px;
    background: #040404;
    box-shadow: 0 0 0 0.75px rgba(0, 0, 0, 0.75);
  }

  /* Écran 440×956 px */
  .screen {
    position: relative;
    width: ${SCREEN_W}px;
    height: ${SCREEN_H}px;
    border-radius: 49px;
    overflow: hidden;
    background: #000000;
  }

  .screen-img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Dynamic Island large fidèle (~132 × 38 px) */
  .dynamic-island {
    position: absolute;
    top: 13px;
    left: 50%;
    transform: translateX(-50%);
    width: 132px;
    height: 38px;
    border-radius: 999px;
    background: #020203;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 11px;
  }

  /* Micro-lentille FaceTime saphir sombre */
  .camera-lens {
    width: 13.5px;
    height: 13.5px;
    border-radius: 50%;
    background: radial-gradient(circle at 38% 38%, #1E325B 0%, #0B1224 55%, #030407 100%);
    box-shadow:
      inset 0 0 0 0.75px rgba(255, 255, 255, 0.08),
      0 0 0 1px #08080B;
    position: relative;
  }
  .camera-lens::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3.5px;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(145, 185, 255, 0.36);
  }

  /* Barre d'état iOS fidèle à la référence (9:41 agrandi · Signal + Wi-Fi + Batterie sans 5G) */
  .status-bar {
    position: absolute;
    top: 13px;
    left: 0;
    right: 0;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${fg};
    z-index: 28;
    pointer-events: none;
    font-family: 'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif;
  }

  .status-wing-left {
    width: 154px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 38px;
  }

  .status-time {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.025em;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  .status-wing-right {
    width: 154px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    padding-left: 16px;
  }

  /* Home Indicator */
  .home-indicator {
    position: absolute;
    bottom: 9px;
    left: 50%;
    transform: translateX(-50%);
    width: 154px;
    height: 5px;
    border-radius: 999px;
    background: ${homeBg};
    z-index: 30;
    pointer-events: none;
  }
</style>
</head>
<body>
  <div class="stage" aria-label="iPhone Pro - ${label}">
    <div class="chassis">
      <div class="antenna ant-tl"></div>
      <div class="antenna ant-tr"></div>
      <div class="antenna ant-bl"></div>
      <div class="antenna ant-br"></div>

      <div class="btn-hw btn-left btn-action"></div>
      <div class="btn-hw btn-left btn-vol-up"></div>
      <div class="btn-hw btn-left btn-vol-dn"></div>
      <div class="btn-hw btn-power"></div>

      <div class="bezel">
        <div class="screen">
          <img class="screen-img" src="${screenDataUri}" alt="${label}" />

          <div class="status-bar">
            <div class="status-wing-left">
              <span class="status-time">9:41</span>
            </div>
            <div class="status-wing-right">
              <!-- Signal cellulaire 4 barres agrandi -->
              <svg width="21" height="14.5" viewBox="0 0 21 14.5" fill="none" aria-hidden="true">
                <rect x="0.5" y="9.2" width="3.7" height="5.3" rx="1.2" fill="currentColor" />
                <rect x="5.9" y="6.6" width="3.7" height="7.9" rx="1.2" fill="currentColor" />
                <rect x="11.3" y="3.7" width="3.7" height="10.8" rx="1.2" fill="currentColor" />
                <rect x="16.7" y="0.6" width="3.7" height="13.9" rx="1.2" fill="currentColor" />
              </svg>
              <!-- Wi-Fi -->
              <svg width="19" height="14.5" viewBox="0 0 19 14.5" fill="none" aria-hidden="true">
                <path d="M9.5 11.4C10.35 11.4 11.05 12.1 11.05 12.95C11.05 13.8 10.35 14.5 9.5 14.5C8.65 14.5 7.95 13.8 7.95 12.95C7.95 12.1 8.65 11.4 9.5 11.4Z" fill="currentColor"/>
                <path d="M5.8 9.35C6.78 8.38 8.07 7.85 9.5 7.85C10.93 7.85 12.22 8.38 13.2 9.35" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
                <path d="M3.1 6.65C4.82 4.95 7.05 4.0 9.5 4.0C11.95 4.0 14.18 4.95 15.9 6.65" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
                <path d="M0.75 4.25C3.1 1.9 6.18 0.65 9.5 0.65C12.82 0.65 15.9 1.9 18.25 4.25" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
              </svg>
              <!-- Batterie iOS pleine épaisse fidèle -->
              <svg width="34" height="16" viewBox="0 0 34 16" fill="none" aria-hidden="true">
                <rect x="0.8" y="0.8" width="28.6" height="14.4" rx="4.4" stroke="currentColor" stroke-opacity="0.38" stroke-width="1.4"/>
                <rect x="2.8" y="2.8" width="24.6" height="10.4" rx="2.7" fill="currentColor"/>
                <path d="M31.0 5.3C32.25 5.5 33.1 6.62 33.1 8.0C33.1 9.38 32.25 10.5 31.0 10.7V5.3Z" fill="currentColor" fill-opacity="0.42"/>
              </svg>
            </div>
          </div>

          <div class="dynamic-island">
            <div class="camera-lens"></div>
          </div>

          <div class="home-indicator"></div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function captureAppScreen(browser, baseUrl, app) {
  const ctx = await browser.newContext({
    viewport: { width: SCREEN_W, height: SCREEN_H },
    deviceScaleFactor: SCALE,
  });

  if (app.unlockStorage) {
    const entries = app.unlockStorage;
    await ctx.addInitScript((kv) => {
      try {
        for (const [k, v] of Object.entries(kv)) {
          window.localStorage.setItem(k, v);
        }
      } catch {
        // ignore
      }
    }, entries);
  }

  const page = await ctx.newPage();
  const url = `${baseUrl}${app.urlPath}`;

  // Pour SOLDE., on bloque les appels CDN externes afin de garantir une capture offline instantanee + polices locales
  if (app.injectLocalSoldeFonts) {
    await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
    await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
  }

  await page.goto(url, { waitUntil: 'load' });

  if (app.injectLocalSoldeFonts) {
    await page.addStyleTag({
      content: `
        @font-face {
          font-family: 'Plus Jakarta Sans';
          src: url('${baseUrl}/public/fonts/PlusJakartaSans-latin.woff2') format('woff2');
          font-weight: 400 800;
          font-style: normal;
        }
        @font-face {
          font-family: 'Plus Jakarta Sans';
          src: url('${baseUrl}/public/fonts/PlusJakartaSans-latin-ext.woff2') format('woff2');
          font-weight: 400 800;
          font-style: normal;
        }
        @font-face {
          font-family: 'JetBrains Mono';
          src: url('${baseUrl}/public/fonts/JetBrainsMono-Regular.ttf') format('truetype');
          font-weight: 400 600;
          font-style: normal;
        }
        @font-face {
          font-family: 'JetBrains Mono';
          src: url('${baseUrl}/public/fonts/JetBrainsMono-Bold.ttf') format('truetype');
          font-weight: 700;
          font-style: normal;
        }
      `,
    });
  }

  await page.addStyleTag({ content: app.cssOverride });
  await page.evaluate(() => document.fonts.ready);

  // Verifie que 100 % des <img> possedant une src sont completement chargees et haute resolution (naturalWidth >= 400)
  const imgAudit = await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img')).filter((img) => {
      const s = img.getAttribute('src');
      return s && s.trim().length > 0;
    });
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.addEventListener('load', res, { once: true });
              img.addEventListener('error', res, { once: true });
            })
      )
    );
    return imgs.map((img) => ({
      src: img.getAttribute('src'),
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    }));
  });

  const failedImgs = imgAudit.filter((i) => !i.complete || i.naturalWidth < 400);
  if (failedImgs.length > 0) {
    throw new Error(`[${app.id}] Images non valides / < 400px: ${JSON.stringify(failedImgs)}`);
  }

  await page.waitForTimeout(350);
  const screenBuf = await page.screenshot({ type: 'png' });
  await ctx.close();

  return {
    screenDataUri: `data:image/png;base64,${screenBuf.toString('base64')}`,
    imgCount: imgAudit.length,
    minImgWidth: imgAudit.length ? Math.min(...imgAudit.map((i) => i.naturalWidth)) : null,
  };
}

async function renderTransparentAsset(browser, app, screenDataUri) {
  const ctx = await browser.newContext({
    viewport: { width: CANVAS_W, height: CANVAS_H },
    deviceScaleFactor: SCALE,
  });
  const page = await ctx.newPage();
  const html = buildMockupHtml({
    screenDataUri,
    statusTheme: app.statusTheme,
    homeTheme: app.homeTheme,
    label: app.label,
  });

  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(120);

  const outPath = path.join(OUT_PNG_DIR, app.outFile);
  await page.screenshot({
    path: outPath,
    omitBackground: true,
    type: 'png',
  });
  await ctx.close();
  return outPath;
}

async function verifyPngTransparencyAndSize(browser, pngPath) {
  const dataUri = `data:image/png;base64,${fs.readFileSync(pngPath).toString('base64')}`;
  const ctx = await browser.newContext({ viewport: { width: 100, height: 100 } });
  const page = await ctx.newPage();
  const stats = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
    });
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const c = canvas.getContext('2d');
    c.drawImage(img, 0, 0);
    const { data } = c.getImageData(0, 0, w, h);

    const alphaAt = (x, y) => data[(y * w + x) * 4 + 3];
    const cornerAlpha = alphaAt(0, 0);

    let edgeMaxAlpha = 0;
    for (let x = 0; x < w; x++) {
      edgeMaxAlpha = Math.max(edgeMaxAlpha, alphaAt(x, 0), alphaAt(x, h - 1));
    }
    for (let y = 0; y < h; y++) {
      edgeMaxAlpha = Math.max(edgeMaxAlpha, alphaAt(0, y), alphaAt(w - 1, y));
    }

    return { width: w, height: h, cornerAlpha, edgeMaxAlpha };
  }, dataUri);
  await ctx.close();

  if (stats.width < 1400) {
    throw new Error(`Largeur insuffisante pour ${pngPath}: ${stats.width}`);
  }
  if (stats.cornerAlpha !== 0) {
    throw new Error(`Pixel (0,0) non transparent pour ${pngPath}: alpha=${stats.cornerAlpha}`);
  }
  if (stats.edgeMaxAlpha !== 0) {
    throw new Error(`Ombre/contenu touche un bord sur ${pngPath}: edgeMaxAlpha=${stats.edgeMaxAlpha}`);
  }
  return stats;
}

async function buildPreviewSheet(browser, pngPaths) {
  const toDataUri = (fp) => `data:image/png;base64,${fs.readFileSync(fp).toString('base64')}`;
  const ctx = await browser.newContext({ viewport: { width: 1960, height: 1040 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  const cards = pngPaths
    .map(
      ({ label, pngPath, dims }) => `
      <div class="card">
        <img src="${toDataUri(pngPath)}" alt="${label}" />
        <div class="meta">
          <div class="title">${label}</div>
          <div class="dims">${dims.width} × ${dims.height} px · α(0,0)=${dims.cornerAlpha} · bords α=${dims.edgeMaxAlpha}</div>
        </div>
      </div>`
    )
    .join('');

  await page.setContent(
    `<!doctype html><html><head><style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        width: 1960px;
        height: 1040px;
        padding: 36px 48px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        background-color: #EEF0F3;
        background-image:
          linear-gradient(45deg, #E2E5EA 25%, transparent 25%),
          linear-gradient(-45deg, #E2E5EA 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #E2E5EA 75%),
          linear-gradient(-45deg, transparent 75%, #E2E5EA 75%);
        background-size: 32px 32px;
        background-position: 0 0, 0 16px, 16px -16px, -16px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }
      .hdr {
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 999px;
        padding: 10px 24px;
        font-size: 16px;
        font-weight: 700;
        color: #14171A;
        letter-spacing: -0.01em;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
        width: 100%;
        align-items: center;
      }
      .card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
      .card img {
        width: 100%;
        height: 820px;
        object-fit: contain;
        display: block;
      }
      .meta {
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 12px;
        padding: 8px 14px;
        text-align: center;
      }
      .title { font-size: 15px; font-weight: 800; color: #111; }
      .dims { font-size: 12px; font-weight: 600; color: #555; font-variant-numeric: tabular-nums; margin-top: 2px; }
    </style></head><body>
      <div class="hdr">Planche de contrôle · 4 Assets iPhone Pro PNG transparents (Titane Naturel · Gabarit référence)</div>
      <div class="grid">${cards}</div>
    </body></html>`,
    { waitUntil: 'load' }
  );

  const previewPath = path.join(AUDIT_DIR, 'preview-sheet.png');
  await page.screenshot({ path: previewPath });
  await ctx.close();
  return previewPath;
}

fs.mkdirSync(OUT_PNG_DIR, { recursive: true });
fs.mkdirSync(AUDIT_DIR, { recursive: true });

const { server, baseUrl } = await startStaticServer();
const browser = await playwright.chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
});

try {
  const results = [];
  for (const app of APPS) {
    const cap = await captureAppScreen(browser, baseUrl, app);
    const pngPath = await renderTransparentAsset(browser, app, cap.screenDataUri);
    const dims = await verifyPngTransparencyAndSize(browser, pngPath);
    const fileSizeKb = Math.round(fs.statSync(pngPath).size / 1024);
    results.push({ id: app.id, label: app.label, pngPath, dims, fileSizeKb, imgCount: cap.imgCount, minImgWidth: cap.minImgWidth });
    console.log(
      `OK ${app.id.padEnd(7)} -> ${path.relative(ROOT, pngPath)} | ${dims.width}x${dims.height}px (${fileSizeKb} KB) | alpha(0,0)=${dims.cornerAlpha} | edgeMaxAlpha=${dims.edgeMaxAlpha} | imgs=${cap.imgCount} (minW=${cap.minImgWidth})`
    );
  }

  const previewPath = await buildPreviewSheet(browser, results);
  console.log(`PREVIEW_SHEET -> ${previewPath}`);
} finally {
  await browser.close();
  server.close();
}
