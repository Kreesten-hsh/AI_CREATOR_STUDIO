#!/usr/bin/env node
/**
 * scripts/capture-local-screenshots.mjs
 * Automatisation Playwright des captures locales AI CREATOR Studio :
 * - Lot A : Captures réelles SOLDE (gate, mobile 375px, desktop final) + Guide d'Accès A4
 * - Lot S : Fiches schématiques éditoriales PNG pour les emplacements externes en attente (EXT-01..EXT-13)
 * - Lot B (--platform) : Captures QA & marketing de la plateforme compilée (`vite preview`)
 *
 * Usage :
 *   node scripts/capture-local-screenshots.mjs                (Lot A + emplacements manquants)
 *   node scripts/capture-local-screenshots.mjs --platform     (Lot A + Lot B sur `dist/`)
 */

import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
      if (entry.isDirectory()) stack.push(fullPath);
      else if (predicate(fullPath, entry.name)) results.push(fullPath);
    }
  }
  return results;
}

async function loadPlaywright() {
  for (const pkg of ['playwright', 'playwright-core']) {
    try {
      return await import(pkg);
    } catch {
      // continue
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
      // continue
    }
  }
  throw new Error('Playwright introuvable.');
}

function findChromiumExecutable() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }
  const msCache = path.join(os.homedir(), '.cache', 'ms-playwright');
  const cached = walkFiles(
    msCache,
    (_fullPath, name) => name === 'chrome-headless-shell' || name === 'chrome'
  ).sort(
    (a, b) =>
      (a.includes('chrome-headless-shell') ? -1 : 1) -
      (b.includes('chrome-headless-shell') ? -1 : 1)
  );
  if (cached.length > 0) return cached[0];

  for (const bin of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    try {
      const resolved = execSync(`command -v "${bin}"`, {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (resolved && fs.existsSync(resolved)) return resolved;
    } catch {
      // continue
    }
  }
  return undefined;
}

function startStaticServer(baseDir) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      let filePath = path.join(baseDir, urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, ''));
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        // Fallback for /public/... or SPA routes
        const altPath = path.join(rootDir, urlPath.replace(/^\/+/, ''));
        if (fs.existsSync(altPath) && !fs.statSync(altPath).isDirectory()) {
          filePath = altPath;
        } else {
          const idx = path.join(baseDir, 'index.html');
          if (fs.existsSync(idx)) filePath = idx;
          else {
            res.writeHead(404);
            res.end('Not found');
            return;
          }
        }
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

const EXTERNAL_SLOTS = [
  {
    id: 'EXT-01',
    relPath: 'public/screenshots/module-01/l1-claude-capabilities.png',
    tool: 'Claude.ai · Paramètres > Capacités',
    step: 'Leçon 01 · Étape 2',
    title: 'Activer « Exécution de code et création de fichiers »',
    pathHint: 'Profil (bas gauche) → Paramètres → Capacités → Code execution and file creation [ON]',
    checks: [
      'Interrupteur « Exécution de code et création de fichiers » activé (bleu)',
      'Masquer l’adresse e-mail ou les données personnelles du compte',
      'Format recommandé : 1366 × 768 px',
    ],
  },
  {
    id: 'EXT-04',
    relPath: 'public/screenshots/module-01/l2-claude-blueprint-solde.png',
    tool: 'Claude.ai · Réponse après MESSAGE-CHOIX-IDEE',
    step: 'Leçon 02 · Étape 2',
    title: 'Sortie attendue : Mon plan d’application & Les règles (SOLDE)',
    pathHint: 'Conversation SOLDE → Réponse structurée avec Mon plan d’application + Tableau des règles',
    checks: [
      'Titres « Mon plan d’application » et « Les règles de mon document » visibles',
      'Formules SOLDE (50/30/20, score /100, parité 655,957, SOLDE2026)',
      'Zéro code HTML généré à cette étape',
    ],
  },
  {
    id: 'EXT-05',
    relPath: 'public/screenshots/module-02/l3-claude-visual-interview.png',
    tool: 'Claude.ai · Réponse à SIGNAL VISUEL',
    step: 'Leçon 03 · Étape 1',
    title: 'Entretien visuel guidé (1 à 2 questions de cadrage)',
    pathHint: 'Même fil SOLDE → Réponse de Claude posant 1 à 2 questions courtes sur l’ambiance',
    checks: [
      'Signal « Plan et règles validés, passons au style. » visible en haut',
      'Questions imagées et accessibles sans jargon CSS',
      'Format recommandé : 1280 × 680 px',
    ],
  },
  {
    id: 'EXT-06',
    relPath: 'public/screenshots/module-02/l3-claude-three-styles.png',
    tool: 'Claude.ai · Atelier visuel SOLDE',
    step: 'Leçon 03 · Étape 2',
    title: '3 directions artistiques contrastées en 6 points simples',
    pathHint: 'Même fil SOLDE → 3 pistes contrastées dont Minéral Chaleureux & Émeraude',
    checks: [
      'Les 3 noms d’univers et leurs palettes concrètes lisibles',
      'Recommandation argumentée de Claude en bas de réponse',
      'Format recommandé : 1366 × 760 px',
    ],
  },
  {
    id: 'EXT-08',
    relPath: 'public/screenshots/module-03/l6-netlify-subdomain.png',
    tool: 'Netlify · Manage project name',
    step: 'Leçon 06 · Étape 2',
    title: 'Renommer son sous-domaine en adresse propre (.netlify.app)',
    pathHint: 'app.netlify.com → Project Overview → Customize → Manage project name → Save',
    checks: [
      'Champ Project name rempli avec un slug propre (ex. solde-budget)',
      'Aperçu de l’URL finale https://solde-budget.netlify.app',
      'Bouton Save bien visible',
    ],
  },
  {
    id: 'EXT-09',
    relPath: 'public/screenshots/module-03/l6-netlify-visibility-public.png',
    tool: 'Netlify · Visitor access',
    step: 'Leçon 06 · Étape 3',
    title: 'Régler Project visibility sur Public (sans mot de passe Netlify)',
    pathHint: 'app.netlify.com → Project configuration → General → Visitor access → Public',
    checks: [
      'Section complète Visitor access (pas une micro-popup coupée)',
      'Option « Public » sélectionnée et enregistrée',
      'Format recommandé : 1200 × 700 px',
    ],
  },
  {
    id: 'EXT-10',
    relPath: 'public/screenshots/module-03/l7-chariow-product-files.png',
    tool: 'Chariow · Créer un nouveau produit',
    step: 'Leçon 07 · Étape 1',
    title: 'Sélectionner le type « Fichiers » (Brouillon)',
    pathHint: 'Dashboard Chariow → Produits → Créer un nouveau produit → Type : Fichiers',
    checks: [
      'Type « Fichiers » (Files) sélectionné et non Licences',
      'Zones titre, prix et visuels (600×600 / 702×260) visibles',
      'Produit enregistré en Brouillon avant l’étape 2',
    ],
  },
  {
    id: 'EXT-13',
    relPath: 'public/screenshots/module-03/l7-chariow-test-coupon.png',
    tool: 'Chariow · Marketing > Réductions',
    step: 'Leçon 07 · Étape 3',
    title: 'Configurer un code promo test 100 % ultra-restreint',
    pathHint: 'Dashboard Chariow → Marketing → Réductions → Créer un code (100 %, 1 utilisation max)',
    checks: [
      'Réduction 100 % restreinte au produit cible uniquement',
      'Limites : 1 utilisation totale max + 1 par client',
      'Bouton de désactivation visible après test',
    ],
  },
];

function buildExternalSlotHtml(slot, baseUrl) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <style>
    @font-face { font-family: 'Plus Jakarta Sans'; font-weight: 400 800; src: url('${baseUrl}/public/fonts/PlusJakartaSans-latin.woff2') format('woff2'); }
    @font-face { font-family: 'JetBrains Mono'; font-weight: 400 700; src: url('${baseUrl}/public/fonts/JetBrainsMono-Bold.ttf') format('truetype'); }
    @font-face { font-family: 'Instrument Serif'; font-style: italic; src: url('${baseUrl}/public/fonts/InstrumentSerif-Italic.ttf') format('truetype'); }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1280px; height: 720px; background: #FAF6F0; color: #171313;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      display: flex; align-items: center; justify-content: center; padding: 48px;
    }
    .frame {
      width: 100%; height: 100%; background: #FFFDFC;
      border: 2.5px solid #171313; border-radius: 14px;
      box-shadow: 8px 8px 0px #171313;
      display: flex; flex-direction: column; overflow: hidden;
    }
    .chrome {
      background: #171313; color: #FAF6F0; padding: 16px 26px;
      display: flex; align-items: center; justify-content: space-between;
      font-family: 'JetBrains Mono', monospace; font-size: 13px; letter-spacing: 0.08em;
    }
    .dots { display: flex; gap: 8px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; background: #E6A0A8; }
    .dot.red { background: #B63131; }
    .dot.cream { background: #FAF6F0; }
    .body {
      flex: 1; padding: 40px 48px; display: flex; flex-direction: column; justify-content: space-between;
    }
    .meta { display: flex; align-items: center; gap: 12px; }
    .badge {
      background: #B63131; color: #FAF6F0; font-family: 'JetBrains Mono', monospace;
      font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 6px;
      border: 2px solid #171313;
    }
    .badge-soft {
      background: #F7E0E2; color: #171313; font-family: 'JetBrains Mono', monospace;
      font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 6px;
      border: 2px solid #171313;
    }
    h1 { font-size: 38px; line-height: 1.15; font-weight: 800; margin-top: 22px; letter-spacing: -0.02em; }
    .path-box {
      margin-top: 24px; background: #FAF6F0; border: 2px solid #171313;
      border-radius: 10px; padding: 18px 22px;
      font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; color: #B63131;
    }
    .checks { margin-top: 26px; display: flex; flex-direction: column; gap: 12px; }
    .check {
      display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: 500;
    }
    .box {
      width: 24px; height: 24px; border-radius: 6px; border: 2px solid #171313;
      background: #F7E0E2; display: inline-flex; align-items: center; justify-content: center;
      font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: #B63131;
    }
    .footer {
      border-top: 2px dashed rgba(23,19,19,0.22); padding-top: 18px;
      display: flex; justify-content: space-between; align-items: center;
      font-family: 'JetBrains Mono', monospace; font-size: 13px; color: rgba(23,19,19,0.72);
    }
  </style>
</head>
<body>
  <div class="frame">
    <div class="chrome">
      <div class="dots"><span class="dot red"></span><span class="dot"></span><span class="dot cream"></span></div>
      <span>${slot.tool.toUpperCase()}</span>
      <span>${slot.id}</span>
    </div>
    <div class="body">
      <div>
        <div class="meta">
          <span class="badge">REPÈRE VISUEL · ${slot.id}</span>
          <span class="badge-soft">${slot.step}</span>
        </div>
        <h1>${slot.title}</h1>
        <div class="path-box">${slot.pathHint}</div>
        <div class="checks">
          ${slot.checks.map((c) => `<div class="check"><span class="box">✓</span><span>${c}</span></div>`).join('')}
        </div>
      </div>
      <div class="footer">
        <span>Emplacement prêt : ${slot.relPath}</span>
        <span>Remplacer par ta capture réelle (FICHES-CAPTURES-EXTERNES.md)</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function run() {
  const withPlatform = process.argv.includes('--platform');
  const forceSlots = process.argv.includes('--force-slots');

  const pw = await loadPlaywright();
  const executablePath = findChromiumExecutable();
  const browser = await pw.chromium.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const { server: rootServer, baseUrl: rootBaseUrl } = await startStaticServer(rootDir);

  try {
    // =========================================================================
    // LOT A : CAPTURES RÉELLES LOCALES (SOLDE + GUIDE A4)
    // =========================================================================
    console.log('📸 Lot A : Captures locales réelles (SOLDE + Guide A4)...');

    // 1. SOLDE Gate Screen (locked initial state)
    const gateCtx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
    const gatePage = await gateCtx.newPage();
    await gatePage.route('**/*', (route) => {
      const u = route.request().url();
      if (u.startsWith('http://127.0.0.1') || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
      return route.abort();
    });
    await gatePage.goto(`${rootBaseUrl}/demos/apps/solde/index.html`, { waitUntil: 'load' });
    await gatePage.waitForTimeout(300);
    const gateOut = path.join(rootDir, 'public/screenshots/module-02/l4-solde-gate-screen.png');
    ensureDir(gateOut);
    await gatePage.screenshot({ path: gateOut });
    console.log(`   ✅ ${path.relative(rootDir, gateOut)}`);
    await gateCtx.close();

    // 2. SOLDE Mobile 375px unlocked (checks scrollWidth <= 375!)
    const mobCtx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
    const mobPage = await mobCtx.newPage();
    await mobPage.route('**/*', (route) => {
      const u = route.request().url();
      if (u.startsWith('http://127.0.0.1') || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
      return route.abort();
    });
    await mobPage.addInitScript(() => {
      localStorage.setItem('solde_access', 'ok');
    });
    await mobPage.goto(`${rootBaseUrl}/demos/apps/solde/index.html`, { waitUntil: 'load' });
    await mobPage.waitForTimeout(450);
    const overflowMob = await mobPage.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    if (overflowMob.scrollWidth > overflowMob.clientWidth) {
      throw new Error(`Débordement horizontal mobile SOLDE détecté : ${overflowMob.scrollWidth}px > ${overflowMob.clientWidth}px`);
    }
    const mobOut = path.join(rootDir, 'public/screenshots/module-02/l5-solde-devtools-375px.png');
    ensureDir(mobOut);
    await mobPage.screenshot({ path: mobOut });
    // Also mirror to public/demos/assets/iphone-solde-dashboard.png for sales page
    const demoMobOut = path.join(rootDir, 'public/demos/assets/iphone-solde-dashboard.png');
    ensureDir(demoMobOut);
    await mobPage.screenshot({ path: demoMobOut });
    console.log(`   ✅ ${path.relative(rootDir, mobOut)} (scrollWidth=${overflowMob.scrollWidth}px)`);
    await mobCtx.close();

    // 3. SOLDE Desktop Final (1280x840 unlocked, with +15k shock activated to showcase dynamic cockpit)
    const deskCtx = await browser.newContext({ viewport: { width: 1280, height: 880 }, deviceScaleFactor: 2 });
    const deskPage = await deskCtx.newPage();
    await deskPage.route('**/*', (route) => {
      const u = route.request().url();
      if (u.startsWith('http://127.0.0.1') || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
      return route.abort();
    });
    await deskPage.addInitScript(() => {
      localStorage.setItem('solde_access', 'ok');
    });
    await deskPage.goto(`${rootBaseUrl}/demos/apps/solde/index.html`, { waitUntil: 'load' });
    await deskPage.waitForTimeout(450);
    const deskOut = path.join(rootDir, 'public/screenshots/module-02/l5-solde-desktop-final.png');
    ensureDir(deskOut);
    await deskPage.screenshot({ path: deskOut });
    console.log(`   ✅ ${path.relative(rootDir, deskOut)}`);
    await deskCtx.close();

    // 4. Guide d'Accès Client A4 preview (SOLDE edition)
    const guideCtx = await browser.newContext({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
    const guidePage = await guideCtx.newPage();
    await guidePage.route('**/*', (route) => {
      const u = route.request().url();
      if (u.startsWith('http://127.0.0.1') || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
      return route.abort();
    });
    await guidePage.goto(`${rootBaseUrl}/docs/guides/GUIDE-ACCES-SOLDE-EXEMPLE.html`, { waitUntil: 'load' });
    await guidePage.evaluate(() => document.fonts.ready);
    await guidePage.waitForTimeout(250);
    const guideOut = path.join(rootDir, 'public/screenshots/module-03/l7-guide-acces-preview.png');
    ensureDir(guideOut);
    await guidePage.screenshot({ path: guideOut });
    console.log(`   ✅ ${path.relative(rootDir, guideOut)}`);
    await guideCtx.close();

    // =========================================================================
    // LOT B (--platform) : CAPTURES QA & MARKETING DE LA PLATEFORME COMPILÉE
    // =========================================================================
    if (withPlatform) {
      const distDir = path.join(rootDir, 'dist');
      if (!fs.existsSync(distDir)) {
        throw new Error('dist/ introuvable : exécute `npm run build` avant `--platform`.');
      }
      console.log('🖥️  Lot B : Captures QA de la plateforme (dist/)...');
      const { server: distServer, baseUrl: distUrl } = await startStaticServer(distDir);
      const qaDir = path.join(rootDir, 'public/screenshots/platform-qa');
      fs.mkdirSync(qaDir, { recursive: true });

      try {
        const makeState = (activeRoute) =>
          JSON.stringify({
            schemaVersion: 4,
            curriculumModel: '3m-3d-7l',
            activeRoute,
            activeStepIdByLesson: {},
            completedStepIdsByLesson: {
              'lesson-01': ['lesson-01-step-01', 'lesson-01-step-02', 'lesson-01-step-03'],
            },
            checklistAnswers: {},
            exerciseAnswers: {},
            quizStates: {},
            savedPrompts: {},
            customPromptInputs: {},
            profile: {
              studentName: '',
              business: '',
              targetAudience: '',
              productType: '',
              brandStyle: '',
              mainObjective: '',
              vibe: { paletteId: 'studio', styleId: 'brutal', typographyId: 'editorial' },
              customVariables: {},
            },
            lastUpdated: new Date().toISOString(),
          });

        const shots = [
          { name: 'auth-gate-desktop.png', url: `${distUrl}/?login=1`, width: 1440, height: 900, route: null },
          { name: 'auth-gate-mobile.png', url: `${distUrl}/?login=1`, width: 375, height: 812, route: null },
          { name: 'platform-home-desktop.png', url: `${distUrl}/`, width: 1440, height: 900, route: { kind: 'home' }, mirrorDemo: true },
          { name: 'platform-home-mobile.png', url: `${distUrl}/`, width: 375, height: 812, route: { kind: 'home' } },
          { name: 'platform-lesson-solde-desktop.png', url: `${distUrl}/`, width: 1440, height: 900, route: { kind: 'lesson', lessonId: 'lesson-02' } },
          { name: 'platform-lesson-mobile.png', url: `${distUrl}/`, width: 375, height: 812, route: { kind: 'lesson', lessonId: 'lesson-02' } },
          { name: 'platform-bonus-manychat.png', url: `${distUrl}/`, width: 1440, height: 900, route: { kind: 'bonus', bonusId: 'bonus-manychat' } },
          { name: 'platform-bonus-marketing.png', url: `${distUrl}/`, width: 1440, height: 900, route: { kind: 'bonus', bonusId: 'bonus-marketing' } },
        ];

        for (const s of shots) {
          const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: 2 });
          const page = await ctx.newPage();
          if (s.route) {
            const payload = makeState(s.route);
            await page.addInitScript((p) => {
              localStorage.setItem('ai_creator_studio_progress_v1', p);
            }, payload);
          }
          await page.goto(s.url, { waitUntil: 'networkidle' });
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(400);

          const dims = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
          }));
          const out = path.join(qaDir, s.name);
          await page.screenshot({ path: out });
          if (s.mirrorDemo) {
            const demoHome = path.join(rootDir, 'public/demos/assets/platform-home-real.png');
            ensureDir(demoHome);
            await page.screenshot({ path: demoHome });
          }
          console.log(`   ✅ ${path.relative(rootDir, out)} (scrollWidth=${dims.scrollWidth}/${dims.clientWidth})`);
          await ctx.close();
        }
      } finally {
        distServer.close();
      }
    }
  } finally {
    rootServer.close();
    await browser.close();
  }
}

run().catch((err) => {
  console.error('❌ Erreur capture-local-screenshots :', err);
  process.exit(1);
});
