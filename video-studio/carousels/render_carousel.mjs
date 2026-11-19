#!/usr/bin/env node
/**
 * video-studio/carousels/render_carousel.mjs
 *
 * Rend toutes les slides `slide-*.html` d'un dossier carrousel en PNG haute définition
 * (1080x1350 par défaut, ou `--size 1080x1440`), exécute l'audit DOM anti-débordement
 * (`check.js`) et génère une planche contact annotée dans `/tmp/carousel-audit/<slug>/sheet.png`.
 *
 * Usage :
 *   node video-studio/carousels/render_carousel.mjs video-studio/carousels/c1-7-types-produits
 *   node video-studio/carousels/render_carousel.mjs video-studio/carousels/c1-7-types-produits --size 1080x1440
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studioDir = path.resolve(__dirname, '..');

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
  ).sort(
    (a, b) =>
      (a.includes('chrome-headless-shell') ? -1 : 1) -
      (b.includes('chrome-headless-shell') ? -1 : 1)
  );

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

function parseArgs(argv) {
  const args = argv.slice(2);
  let folder = '';
  let size = '1080x1350';
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--size' && args[i + 1]) {
      size = args[i + 1];
      i += 1;
    } else if (!args[i].startsWith('--') && !folder) {
      folder = args[i];
    }
  }
  if (!folder) {
    console.error('Usage: node video-studio/carousels/render_carousel.mjs <dossier-carrousel> [--size 1080x1350]');
    process.exit(1);
  }
  const [wStr, hStr] = size.toLowerCase().split('x');
  const width = Number.parseInt(wStr, 10);
  const height = Number.parseInt(hStr, 10);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    console.error(`Dimensions invalides : "${size}". Exemple : --size 1080x1350`);
    process.exit(1);
  }
  return { folder: path.resolve(folder), width, height };
}

function startCarouselServer(deckDir, slides, width, height, contactHtml) {
  const isInsideStudio = deckDir.startsWith(studioDir + path.sep);

  const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url || '/', 'http://127.0.0.1');
    const urlPath = decodeURIComponent(reqUrl.pathname);

    if (urlPath === '/__sheet.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(contactHtml);
      return;
    }

    let safePath;
    if (isInsideStudio) {
      const rel = urlPath.replace(/^\/+/, '');
      safePath = path.resolve(studioDir, rel);
      if (!safePath.startsWith(studioDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
    } else if (urlPath.startsWith('/__deck/')) {
      const rel = urlPath.slice('/__deck/'.length).replace(/^\/+/, '');
      safePath = path.resolve(deckDir, rel);
      if (!safePath.startsWith(deckDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
    } else {
      const rel = urlPath.replace(/^\/+/, '');
      safePath = path.resolve(studioDir, rel);
      if (!safePath.startsWith(studioDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
    }

    if (!fs.existsSync(safePath) || fs.statSync(safePath).isDirectory()) {
      res.writeHead(404);
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
      const urlPrefix = isInsideStudio
        ? '/' + path.relative(studioDir, deckDir).split(path.sep).join('/') + '/'
        : '/__deck/';
      resolve({ server, port: addr.port, urlPrefix });
    });
  });
}

function readPngDimensions(buffer) {
  const signature = buffer.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') {
    throw new Error(`En-tête PNG invalide (${signature})`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function buildContactSheetHtml(slideUrls, slideNames, width, height) {
  const cols = slideUrls.length > 6 ? 4 : Math.min(slideUrls.length, 3);
  const rows = Math.ceil(slideUrls.length / cols);
  const tw = 360;
  const th = Math.round((tw * height) / width);
  const gap = 28;
  const labelH = 38;
  const sheetWidth = cols * tw + (cols + 1) * gap;
  const sheetHeight = rows * (th + labelH) + (rows + 1) * gap;

  const cells = slideUrls
    .map(
      (url, i) => `
      <div class="cell">
        <div class="thumb">
          <iframe src="${url}#check" width="${width}" height="${height}" scrolling="no"></iframe>
        </div>
        <div class="label">${i + 1}. ${slideNames[i]}</div>
      </div>`
    )
    .join('');

  const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <style>
    body {
      margin: 0;
      background: #171313;
      color: #EAE3D5;
      font: 700 18px/1.2 'JetBrains Mono', monospace, sans-serif;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(${cols}, ${tw}px);
      gap: ${gap}px;
      padding: ${gap}px;
    }
    .thumb {
      width: ${tw}px;
      height: ${th}px;
      overflow: hidden;
      border-radius: 10px;
      border: 2px solid #EAE3D5;
      background: #EAE3D5;
    }
    iframe {
      border: 0;
      transform: scale(${tw / width});
      transform-origin: 0 0;
      pointer-events: none;
    }
    .label {
      height: ${labelH}px;
      padding-top: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  </style>
</head>
<body>
  <div class="grid">${cells}</div>
</body>
</html>`;

  return { html, sheetWidth, sheetHeight };
}

export async function renderCarousel() {
  const { folder, width, height } = parseArgs(process.argv);
  if (!fs.existsSync(folder)) {
    throw new Error(`Dossier introuvable : ${folder}`);
  }

  const slideFiles = fs
    .readdirSync(folder)
    .filter((f) => /^slide-\d+\.html$/i.test(f))
    .sort();

  if (slideFiles.length === 0) {
    throw new Error(`Aucun fichier slide-XX.html trouvé dans ${folder}`);
  }

  const pngDir = path.join(folder, 'png');
  fs.mkdirSync(pngDir, { recursive: true });

  const slug = path.basename(folder);
  const auditDir = path.join('/tmp/carousel-audit', slug);
  fs.mkdirSync(auditDir, { recursive: true });

  const isInsideStudio = folder.startsWith(studioDir + path.sep);
  const urlPrefix = isInsideStudio
    ? '/' + path.relative(studioDir, folder).split(path.sep).join('/') + '/'
    : '/__deck/';
  const slideUrls = slideFiles.map((name) => `${urlPrefix}${name}`);
  const { html: contactHtml, sheetWidth, sheetHeight } = buildContactSheetHtml(
    slideUrls,
    slideFiles,
    width,
    height
  );

  const { chromium } = await loadPlaywright();
  const executablePath = findChromiumExecutable();
  const { server, port } = await startCarouselServer(folder, slideFiles, width, height, contactHtml);

  let browser;
  const auditFindings = [];
  const renderedSlides = [];

  try {
    browser = await chromium.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });

    const context = await browser.newContext({
      viewport: { width, height },
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

    for (const fileName of slideFiles) {
      const baseUrl = `http://127.0.0.1:${port}${urlPrefix}${fileName}`;

      // 1. Audit DOM en mode #check
      await page.goto(`${baseUrl}#check`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(async (expectedH) => {
        await document.fonts.ready;
        const slide = document.querySelector('.slide');
        if (slide) {
          slide.style.setProperty('--h', `${expectedH}px`);
        }
      }, height);
      await page.waitForTimeout(160);

      const checkResult = await page.evaluate(() => ({
        problems: Number.parseInt(document.documentElement.dataset.problems || '0', 10),
        report: JSON.parse(document.documentElement.dataset.report || '[]'),
      }));

      if (checkResult.problems > 0) {
        auditFindings.push({ fileName, issues: checkResult.report });
      }

      // 2. Capture PNG propre (sans overlays #check)
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      const loadedFonts = await page.evaluate(async (expectedH) => {
        await document.fonts.ready;
        const slide = document.querySelector('.slide');
        if (slide) {
          slide.style.setProperty('--h', `${expectedH}px`);
        }
        const imgs = Array.from(document.querySelectorAll('img'));
        for (const img of imgs) {
          if (!img.complete) {
            await new Promise((r) => {
              img.addEventListener('load', r, { once: true });
              img.addEventListener('error', r, { once: true });
            });
          }
          if (img.naturalWidth === 0) {
            throw new Error(`Image cassée : ${img.getAttribute('src')}`);
          }
        }
        return Array.from(
          new Set(
            Array.from(document.fonts)
              .filter((f) => f.status === 'loaded')
              .map((f) => f.family.replace(/['"]/g, ''))
          )
        );
      }, height);
      await page.waitForTimeout(80);

      const outName = fileName.replace(/\.html$/i, '.png');
      const outPath = path.join(pngDir, outName);
      await page.locator('.slide').screenshot({ path: outPath, animations: 'disabled' });

      const buf = fs.readFileSync(outPath);
      const dims = readPngDimensions(buf);
      if (dims.width !== width || dims.height !== height) {
        throw new Error(
          `Dimensions PNG inattendues pour ${outName} : ${dims.width}x${dims.height} (attendu ${width}x${height})`
        );
      }

      renderedSlides.push({
        file: outName,
        width: dims.width,
        height: dims.height,
        kb: Number((buf.length / 1024).toFixed(1)),
        fonts: loadedFonts,
      });
    }

    await context.close();

    // 3. Planche contact d'audit dans /tmp/carousel-audit/<slug>/sheet.png
    const sheetContext = await browser.newContext({
      viewport: { width: sheetWidth, height: sheetHeight },
      deviceScaleFactor: 1,
      locale: 'fr-FR',
    });
    const sheetPage = await sheetContext.newPage();
    await sheetPage.route('**/*', (route) => {
      const url = route.request().url();
      if (url.startsWith(`http://127.0.0.1:${port}`) || url.startsWith('data:') || url.startsWith('blob:')) {
        return route.continue();
      }
      return route.abort();
    });
    await sheetPage.goto(`http://127.0.0.1:${port}/__sheet.html`, { waitUntil: 'networkidle' });
    await sheetPage.evaluate(async () => {
      await document.fonts.ready;
    });
    await sheetPage.waitForTimeout(350);

    const sheetPath = path.join(auditDir, 'sheet.png');
    await sheetPage.screenshot({ path: sheetPath, fullPage: true, animations: 'disabled' });
    await sheetContext.close();

    console.log(`✅ Carrousel rendu (${renderedSlides.length} slides ${width}×${height} px) :`);
    console.log(`   Polices locales : ${(renderedSlides[0]?.fonts || []).join(', ')}`);
    for (const s of renderedSlides) {
      console.log(`   - ${path.join('png', s.file).padEnd(22)} ${s.width} × ${s.height} px (${s.kb} Ko)`);
    }
    console.log(`   Planche contact audit : ${sheetPath}`);
    console.log(`   Débordements / anomalies DOM détectées : ${auditFindings.length}`);

    if (auditFindings.length > 0) {
      for (const f of auditFindings) {
        console.error(`   ❌ ${f.fileName} : ${JSON.stringify(f.issues)}`);
      }
      process.exitCode = 1;
    }
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

renderCarousel().catch((err) => {
  console.error(`❌ Erreur rendu carrousel : ${err.message}`);
  process.exit(1);
});
