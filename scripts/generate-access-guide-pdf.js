#!/usr/bin/env node
/**
 * scripts/generate-access-guide-pdf.js
 * Génération reproductible du modèle de Guide d'Accès Client PDF (1 page A4 exacte)
 * via Playwright Chromium à partir de `docs/guides/GUIDE-ACCES-CLIENT-MODELE.html`.
 *
 * Produit : `public/downloads/GUIDE-ACCES-CLIENT-MODELE.pdf`
 * Optionnel : `--input <chemin-html>` et `--preview <chemin-png>` pour inspection visuelle.
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
const defaultSourceHtmlPath = path.join(docsDir, 'guides', 'GUIDE-ACCES-CLIENT-MODELE.html');
const defaultOutputPdfPath = path.join(publicDir, 'downloads', 'GUIDE-ACCES-CLIENT-MODELE.pdf');

const REQUIRED_PLACEHOLDERS = [
  '[NOM DE TON APPLICATION]',
  '[PROMESSE EN UNE PHRASE]',
  "[VOTRE CODE D'ACCÈS]",
  '[VOTRE LIEN NETLIFY]',
  '[VOTRE EMAIL SUPPORT]',
  '[VOTRE DÉLAI DE RÉPONSE]',
  '[VOTRE NOM / MARQUE]',
];

const FORBIDDEN_STRINGS = [
  { token: 'CREATOR2026', reason: 'Ne jamais imposer CREATOR2026 comme code client.' },
  { token: '#B63131', reason: 'Indépendance graphique : #B63131 (Burgundy AI CREATOR Studio) interdit dans le modèle client.' },
  { token: '#FAF6F0', reason: 'Indépendance graphique : #FAF6F0 (Cream AI CREATOR Studio) interdit dans le modèle client.' },
  { token: '#F7E0E2', reason: 'Indépendance graphique : #F7E0E2 (Pale Pink AI CREATOR Studio) interdit dans le modèle client.' },
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
    'Impossible de localiser playwright ou playwright-core. Installez playwright-core ou exécutez npx playwright.'
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

function startStaticServer(publicBaseDir, docsBaseDir) {
  const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url || '/', 'http://127.0.0.1');
    const urlPath = decodeURIComponent(reqUrl.pathname);

    let safePath;
    if (urlPath.startsWith('/docs/')) {
      const relPath = urlPath.slice('/docs/'.length);
      safePath = path.resolve(docsBaseDir, relPath);
      if (!safePath.startsWith(docsBaseDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
      }
    } else if (urlPath.startsWith('/public/')) {
      const relPath = urlPath.slice('/public/'.length);
      safePath = path.resolve(publicBaseDir, relPath);
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

export function countPdfPages(pdfBuffer) {
  const ascii = pdfBuffer.toString('latin1');
  if (!ascii.startsWith('%PDF-')) {
    throw new Error('En-tête PDF invalide (%PDF- manquant).');
  }
  const countMatches = Array.from(ascii.matchAll(/\/Type\s*\/Pages\b[\s\S]{0,120}?\/Count\s+(\d+)/g));
  if (countMatches.length > 0) {
    return Math.max(...countMatches.map((m) => Number.parseInt(m[1], 10)));
  }
  const leafPages = ascii.match(/\/Type\s*\/Page\b(?!s)/g);
  return leafPages ? leafPages.length : 0;
}

export function validateGuideHtml(htmlContent, { requirePlaceholders = true } = {}) {
  if (requirePlaceholders) {
    for (const placeholder of REQUIRED_PLACEHOLDERS) {
      if (!htmlContent.includes(placeholder)) {
        throw new Error(
          `Placeholder obligatoire manquant dans GUIDE-ACCES-CLIENT-MODELE.html : "${placeholder}"`
        );
      }
    }
  }

  const upperHtml = htmlContent.toUpperCase();
  for (const { token, reason } of FORBIDDEN_STRINGS) {
    if (upperHtml.includes(token.toUpperCase())) {
      throw new Error(`Contenu interdit détecté ("${token}") : ${reason}`);
    }
  }
}

function parseCliArgs(argv) {
  const options = {
    input: defaultSourceHtmlPath,
    output: defaultOutputPdfPath,
    preview: null,
    skipPlaceholderCheck: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--input' && argv[i + 1]) {
      options.input = path.resolve(rootDir, argv[i + 1]);
      options.skipPlaceholderCheck = options.input !== defaultSourceHtmlPath;
      i += 1;
    } else if (arg === '--output' && argv[i + 1]) {
      options.output = path.resolve(rootDir, argv[i + 1]);
      i += 1;
    } else if (arg === '--preview' && argv[i + 1]) {
      options.preview = path.resolve(argv[i + 1]);
      i += 1;
    }
  }

  return options;
}

export async function generateAccessGuidePdf(options = {}) {
  const sourceHtmlPath = options.input || defaultSourceHtmlPath;
  const outputPdfPath = options.output || defaultOutputPdfPath;
  const previewPngPath = options.preview || null;
  const requirePlaceholders = options.requirePlaceholders ?? !options.skipPlaceholderCheck;

  console.log("📄 Génération du Guide d'Accès Client PDF (1 page A4 via Playwright Chromium)...");

  if (!fs.existsSync(sourceHtmlPath)) {
    throw new Error(`Fichier source HTML introuvable : ${sourceHtmlPath}`);
  }

  const htmlContent = fs.readFileSync(sourceHtmlPath, 'utf-8');
  validateGuideHtml(htmlContent, { requirePlaceholders });

  const relFromDocs = path.relative(docsDir, sourceHtmlPath);
  const relFromPublic = path.relative(publicDir, sourceHtmlPath);
  let routePath;
  if (!relFromDocs.startsWith('..')) {
    routePath = `/docs/${relFromDocs.split(path.sep).join('/')}`;
  } else if (!relFromPublic.startsWith('..')) {
    routePath = `/public/${relFromPublic.split(path.sep).join('/')}`;
  } else {
    throw new Error(`Le fichier HTML doit se trouver dans docs/ ou public/ : ${sourceHtmlPath}`);
  }

  const outputDir = path.dirname(outputPdfPath);
  fs.mkdirSync(outputDir, { recursive: true });

  const { chromium } = await loadPlaywright();
  const executablePath = findChromiumExecutable();
  const { server, port } = await startStaticServer(publicDir, docsDir);

  let browser;
  try {
    browser = await chromium.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });

    const context = await browser.newContext({
      viewport: { width: 794, height: 1123 },
      deviceScaleFactor: 2,
      locale: 'fr-FR',
    });

    const page = await context.newPage();

    // Rendu 100 % déterministe sur les polices locales sans dépendance réseau externe
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (url.startsWith(`http://127.0.0.1:${port}`) || url.startsWith('data:') || url.startsWith('blob:')) {
        return route.continue();
      }
      return route.abort();
    });

    await page.goto(`http://127.0.0.1:${port}${routePath}`, { waitUntil: 'domcontentloaded' });

    const metrics = await page.evaluate(async () => {
      await document.fonts.ready;
      const sheet = document.querySelector('.a4-sheet');
      if (!sheet) {
        throw new Error('Conteneur .a4-sheet introuvable dans le HTML source.');
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
        scrollHeight: sheet.scrollHeight,
        clientHeight: sheet.clientHeight,
        overflowPx: Math.max(0, sheet.scrollHeight - sheet.clientHeight),
      };
    });

    if (metrics.overflowPx > 2) {
      throw new Error(
        `Débordement détecté sur .a4-sheet (+${metrics.overflowPx}px : scrollHeight=${metrics.scrollHeight}, clientHeight=${metrics.clientHeight}).`
      );
    }

    if (previewPngPath) {
      fs.mkdirSync(path.dirname(previewPngPath), { recursive: true });
      await page.locator('.a4-sheet').screenshot({
        path: previewPngPath,
        animations: 'disabled',
      });
    }

    if (fs.existsSync(outputPdfPath)) {
      fs.unlinkSync(outputPdfPath);
    }

    await page.pdf({
      path: outputPdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    });

    await context.close();

    if (!fs.existsSync(outputPdfPath)) {
      throw new Error("Le fichier PDF n'a pas été créé.");
    }

    const pdfBuffer = fs.readFileSync(outputPdfPath);
    if (pdfBuffer.length <= 5120) {
      throw new Error(`Le fichier PDF généré est trop petit (${pdfBuffer.length} octets, attendu > 5120).`);
    }

    const header = pdfBuffer.subarray(0, 5).toString('ascii');
    if (header !== '%PDF-') {
      throw new Error(`En-tête PDF invalide : reçu "${header}", attendu "%PDF-".`);
    }

    const pageCount = countPdfPages(pdfBuffer);
    if (pageCount !== 1) {
      throw new Error(`Le PDF fait ${pageCount} page(s) au lieu d'exactement 1 page A4.`);
    }

    console.log("✅ Modèle de Guide d'Accès Client PDF généré avec succès !");
    console.log(`   - Source   : ${path.relative(rootDir, sourceHtmlPath)}`);
    console.log(`   - Sortie   : ${path.relative(rootDir, outputPdfPath)}`);
    console.log(`   - Pages    : ${pageCount} page A4 exacte (débordement : ${metrics.overflowPx}px)`);
    console.log(`   - Taille   : ${pdfBuffer.length} octets (${(pdfBuffer.length / 1024).toFixed(1)} Ko)`);
    console.log(`   - Polices  : ${metrics.loadedFamilies.join(', ')}`);
    if (previewPngPath) {
      console.log(`   - Aperçu   : ${previewPngPath}`);
    }

    return {
      source: sourceHtmlPath,
      output: outputPdfPath,
      pages: pageCount,
      bytes: pdfBuffer.length,
      loadedFamilies: metrics.loadedFamilies,
    };
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const cliOptions = parseCliArgs(process.argv.slice(2));
  generateAccessGuidePdf(cliOptions).catch((err) => {
    console.error(`❌ Échec de la génération du Guide d'Accès PDF : ${err.message}`);
    process.exit(1);
  });
}
