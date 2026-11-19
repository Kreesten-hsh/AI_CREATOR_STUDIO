#!/usr/bin/env node
/**
 * Visual DOM & Contact Sheet Audit for AI CREATOR Studio Remotion episodes.
 *
 * Usage:
 *   node scripts/visual_audit.mjs <CompositionId> <episode_slug>
 *   node scripts/visual_audit.mjs episodes/<episode_slug>
 *
 * Generates an annotated 4-column contact sheet exclusively in:
 *   /tmp/remotion-audit/<episode_slug>_planche.jpg
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { bundle } from '@remotion/bundler';
import {
  RenderInternals,
  openBrowser,
  renderStill,
  selectComposition,
} from '@remotion/renderer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studioRoot = path.resolve(__dirname, '..');
const AUDIT_ROOT = '/tmp/remotion-audit';

const KNOWN_EPISODE_COMPOSITIONS = {
  ep01_produits_interactifs: 'Ep01ProduitsInteractifs',
  ep02_bonnes_instructions: 'Ep02BonnesInstructions',
  'template-showcase': 'Showcase9x16',
};

function findBrowserExecutable() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }

  const localRemotionChrome = path.join(
    studioRoot,
    'node_modules',
    '.remotion',
    'chrome-headless-shell',
    'linux64',
    'chrome-headless-shell-linux64',
    'chrome-headless-shell'
  );
  if (fs.existsSync(localRemotionChrome)) {
    return localRemotionChrome;
  }

  const pwCache = path.join(os.homedir(), '.cache', 'ms-playwright');
  if (fs.existsSync(pwCache)) {
    const dirs = fs.readdirSync(pwCache).filter((d) => d.startsWith('chromium_headless_shell'));
    for (const dir of dirs) {
      const candidate = path.join(pwCache, dir, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
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
      // Ignore missing binary
    }
  }

  return undefined;
}

function resolveCompositionFromRootTsx(slug) {
  const rootFile = path.join(studioRoot, 'engine', 'Root.tsx');
  if (!fs.existsSync(rootFile)) return null;
  const source = fs.readFileSync(rootFile, 'utf-8');

  const importMatch = source.match(
    new RegExp(`import\\s*\\{[^}]*?\\b([A-Za-z0-9_]+)\\b[^}]*\\}\\s*from\\s*['"][^'"]*${slug}[^'"]*['"]`)
  );
  if (!importMatch) return null;

  const componentName = importMatch[1];
  const compMatch = source.match(
    new RegExp(`<Composition[\\s\\S]*?id=["']([^"']+)["'][\\s\\S]*?component=\\{${componentName}\\}`)
  );
  return compMatch ? compMatch[1] : null;
}

function resolveTarget(args) {
  if (args.length >= 2 && !args[0].startsWith('--') && !args[1].startsWith('--')) {
    return {
      compositionId: args[0],
      slug: path.basename(args[1].replace(/\/+$/, '')),
    };
  }

  const single = args.find((a) => !a.startsWith('--'));
  if (!single) {
    console.error(
      'Usage: node scripts/visual_audit.mjs <CompositionId> <episode_slug>\n   or: node scripts/visual_audit.mjs episodes/<episode_slug>'
    );
    process.exit(1);
  }

  const slug = path.basename(single.replace(/\/+$/, ''));
  const compositionId =
    KNOWN_EPISODE_COMPOSITIONS[slug] || resolveCompositionFromRootTsx(slug);

  if (!compositionId) {
    console.error(
      `Unable to resolve Remotion Composition ID for "${slug}". Pass both arguments explicitly:\n  node scripts/visual_audit.mjs <CompositionId> ${slug}`
    );
    process.exit(1);
  }

  return { compositionId, slug };
}

function computeKeyFrames(totalFrames, fps, slug, targetCount = 12) {
  const maxFrame = Math.max(0, totalFrames - 1);
  const clampFrame = (f) => Math.min(maxFrame, Math.max(0, Math.round(f)));
  const candidates = new Set([
    clampFrame(2),
    clampFrame(Math.min(24, maxFrame)),
    clampFrame(Math.min(54, maxFrame)),
    clampFrame(totalFrames * 0.82),
    clampFrame(totalFrames * 0.90),
    clampFrame(totalFrames * 0.96),
  ]);

  const metaPath = path.join(studioRoot, 'episodes', slug, 'meta.json');
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      if (Array.isArray(meta.openLoopsAtSec)) {
        for (const sec of meta.openLoopsAtSec) {
          if (typeof sec === 'number' && Number.isFinite(sec)) {
            candidates.add(clampFrame(sec * fps));
          }
        }
      }
    } catch {
      // Ignore malformed meta.json
    }
  }

  for (let i = 1; i <= targetCount; i++) {
    if (candidates.size >= targetCount) break;
    const ratio = i / (targetCount + 1);
    candidates.add(clampFrame(totalFrames * ratio));
  }

  const sorted = [...candidates].sort((a, b) => a - b);
  if (sorted.length <= targetCount) {
    return sorted;
  }

  const sampled = [];
  for (let i = 0; i < targetCount; i++) {
    const idx = Math.round((i * (sorted.length - 1)) / (targetCount - 1));
    sampled.push(sorted[idx]);
  }
  return [...new Set(sampled)];
}

async function waitForRemotionReady(page, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const state = await page.evaluate(() => ({
      ready: window.remotion_renderReady === true,
      err: window.remotion_cancelledError,
    }));
    if (state.err) {
      throw new Error(`Remotion render error: ${state.err}`);
    }
    if (state.ready) {
      await page.evaluate(() => document.fonts.ready.then(() => true));
      return;
    }
    await new Promise((r) => setTimeout(r, 40));
  }
  throw new Error(`Timeout (${timeoutMs}ms) waiting for Remotion DOM ready`);
}

function domAuditEvaluator() {
  const issues = {
    truncatedText: [],
    outOfBounds: [],
    safeZoneViolations: [],
  };

  function effOpacity(el) {
    let o = 1;
    for (let cur = el; cur && cur !== document.body; cur = cur.parentElement) {
      const cs = getComputedStyle(cur);
      if (cs.display === 'none' || cs.visibility === 'hidden') return 0;
      o *= Number(cs.opacity ?? 1);
    }
    return o;
  }

  function labelFor(el) {
    const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 42);
    const cls = typeof el.className === 'string' && el.className.trim()
      ? `.${el.className.trim().split(/\s+/)[0]}`
      : '';
    return `${el.tagName.toLowerCase()}${cls}${text ? ` "${text}"` : ''}`;
  }

  function isEdgeBar(el, r) {
    return r.height <= 24 && r.width >= 900 && (r.top <= 4 || r.bottom >= 1916);
  }

  function isAvatarImage(el) {
    if (el.tagName !== 'IMG') return false;
    const src = el.getAttribute('src') || '';
    return src.includes('avatar/') || src.includes('/avatar/');
  }

  const all = Array.from(document.querySelectorAll('#remotion-container *, body *'));
  const seen = new Set();

  for (const el of all) {
    if (seen.has(el)) continue;
    seen.add(el);

    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'LINK') continue;
    if (el.closest('svg') && el.tagName !== 'svg') continue;
    if (effOpacity(el) < 0.6) continue;

    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;

    const cs = getComputedStyle(el);
    const hasText = el.children.length === 0 && (el.textContent || '').trim().length > 0;

    // 1. Check truncated text (scrollWidth > clientWidth + 2)
    if (
      hasText &&
      !el.closest('.kinetic-word-mask') &&
      (cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.textOverflow === 'ellipsis') &&
      el.clientWidth > 0 &&
      el.scrollWidth > el.clientWidth + 2
    ) {
      issues.truncatedText.push(
        `TEXTE COUPÉ ${labelFor(el)} (scrollWidth=${el.scrollWidth} > clientWidth=${el.clientWidth})`
      );
    }

    // 2. Check out-of-bounds 1080x1920 for elements visibly inside stage
    const isFullStage = r.width >= 1070 && r.height >= 1900;
    const partlyInside = r.right > 40 && r.left < 1040 && r.bottom > 40 && r.top < 1880;
    if (
      !isFullStage &&
      !isAvatarImage(el) &&
      partlyInside &&
      (r.left < -4 || r.right > 1084 || r.top < -4 || r.bottom > 1924)
    ) {
      issues.outOfBounds.push(
        `HORS CADRE ${labelFor(el)} [${Math.round(r.left)},${Math.round(r.top)} -> ${Math.round(r.right)},${Math.round(r.bottom)}]`
      );
    }

    // 3. Check Safe Zones (top >= 174, bottom <= 1566) on leaf text & bounded content boxes
    const isBoundedCard =
      (hasText || (cs.borderStyle !== 'none' && parseFloat(cs.borderTopWidth || '0') >= 2)) &&
      r.width < 1070 &&
      r.height < 1600;
    if (
      isBoundedCard &&
      partlyInside &&
      !isEdgeBar(el, r) &&
      !isAvatarImage(el) &&
      !el.closest('[data-avatar-stage="true"]')
    ) {
      if (r.top < 174 || r.bottom > 1566) {
        issues.safeZoneViolations.push(
          `SAFE ZONE ${labelFor(el)} [top=${Math.round(r.top)}, bottom=${Math.round(r.bottom)}]`
        );
      }
    }
  }

  return {
    truncatedText: [...new Set(issues.truncatedText)].slice(0, 25),
    outOfBounds: [...new Set(issues.outOfBounds)].slice(0, 25),
    safeZoneViolations: [...new Set(issues.safeZoneViolations)].slice(0, 25),
  };
}

async function runDomAuditAcrossFrames(browser, server, composition, frames) {
  const page = await browser.newPage({
    context: server.sourceMap,
    logLevel: 'error',
    indent: false,
    pageIndex: 0,
    onBrowserLog: null,
    onLog: () => {},
  });

  const frameReports = [];
  try {
    await page.setViewport({
      width: composition.width,
      height: composition.height,
      deviceScaleFactor: 1,
    });

    await page.evaluateOnNewDocument(
      (initialFrame, proxyPort) => {
        window.remotion_puppeteerTimeout = 30000;
        window.remotion_isMainTab = true;
        window.remotion_mediaCacheSizeInBytes = null;
        window.remotion_preferredEffectBackend = 'auto';
        window.remotion_disableWebGpuEffects = false;
        window.remotion_initialMemoryAvailable = null;
        window.remotion_sampleRate = 48000;
        window.remotion_inputProps = '{}';
        window.remotion_initialFrame = initialFrame;
        window.remotion_attempt = 1;
        window.remotion_proxyPort = proxyPort;
        window.remotion_audioEnabled = false;
        window.remotion_videoEnabled = true;
        window.remotion_logLevel = 'error';
        window.remotion_broadcastChannel = new BroadcastChannel('remotion-video-frame-extraction');
        window.process = window.process || { env: {} };
        window.process.env = window.process.env || {};
        window.process.env.NODE_ENV = 'production';
      },
      frames[0] ?? 0,
      server.offthreadPort
    );

    await page.goto({ url: server.serveUrl, timeout: 30000 });
    await page.evaluate(
      (comp) => {
        window.remotion_setBundleMode({
          type: 'composition',
          compositionName: comp.id,
          serializedResolvedPropsWithSchema: JSON.stringify(comp.resolvedProps ?? {}),
          compositionDurationInFrames: comp.durationInFrames,
          compositionFps: comp.fps,
          compositionHeight: comp.height,
          compositionWidth: comp.width,
          compositionDefaultCodec: comp.defaultCodec,
          compositionDefaultOutName: comp.defaultOutName,
          compositionDefaultVideoImageFormat: comp.defaultVideoImageFormat,
          compositionDefaultPixelFormat: comp.defaultPixelFormat,
          compositionDefaultProResProfile: comp.defaultProResProfile,
          compositionDefaultSampleRate: comp.defaultSampleRate,
        });
      },
      {
        id: composition.id,
        resolvedProps: composition.resolvedProps ?? {},
        durationInFrames: composition.durationInFrames,
        fps: composition.fps,
        height: composition.height,
        width: composition.width,
        defaultCodec: composition.defaultCodec,
        defaultOutName: composition.defaultOutName,
        defaultVideoImageFormat: composition.defaultVideoImageFormat,
        defaultPixelFormat: composition.defaultPixelFormat,
        defaultProResProfile: composition.defaultProResProfile,
        defaultSampleRate: composition.defaultSampleRate,
      }
    );

    await waitForRemotionReady(page);

    for (const frame of frames) {
      await page.evaluate(
        (f, compId) => {
          window.remotion_setMediaEnabled(true, false);
          window.remotion_setFrame(f, compId, 0);
        },
        frame,
        composition.id
      );
      await waitForRemotionReady(page);
      const res = await page.evaluate(domAuditEvaluator);
      frameReports.push({ frame, ...res });
    }
  } finally {
    await page.close();
  }

  return frameReports;
}

async function buildContactSheet(browser, server, items, workDir, outPath) {
  const cols = Math.min(4, items.length);
  const rows = Math.ceil(items.length / cols);
  const tileW = 270;
  const tileH = 480;
  const labelH = 38;
  const gap = 12;
  const width = cols * tileW + (cols + 1) * gap;
  const height = rows * (tileH + labelH) + (rows + 1) * gap;

  const cardsHtml = items
    .map((item, idx) => {
      const b64 = fs.readFileSync(item.filePath).toString('base64');
      const sec = (item.frame / item.fps).toFixed(2);
      return `<div class="tile">
        <img src="data:image/jpeg;base64,${b64}" width="${tileW}" height="${tileH}" />
        <div class="meta">#${String(idx + 1).padStart(2, '0')} · f${String(item.frame).padStart(4, '0')} · ${sec}s</div>
      </div>`;
    })
    .join('');

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${width}px;
    height: ${height}px;
    background: #171313;
    padding: ${gap}px;
    display: grid;
    grid-template-columns: repeat(${cols}, ${tileW}px);
    gap: ${gap}px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  .tile {
    width: ${tileW}px;
    height: ${tileH + labelH}px;
    background: #231D1D;
    border: 2px solid #B63131;
    border-radius: 8px;
    overflow: hidden;
  }
  .tile img {
    display: block;
    width: ${tileW}px;
    height: ${tileH}px;
    object-fit: cover;
  }
  .meta {
    height: ${labelH}px;
    line-height: ${labelH}px;
    padding: 0 10px;
    color: #FAF6F0;
    font-size: 13px;
    font-weight: 700;
    background: #171313;
  }
</style>
</head>
<body>${cardsHtml}</body>
</html>`;

  const sheetHtmlPath = path.join(workDir, 'sheet.html');
  fs.writeFileSync(sheetHtmlPath, html, 'utf-8');

  const page = await browser.newPage({
    context: server.sourceMap,
    logLevel: 'error',
    indent: false,
    pageIndex: 1,
    onBrowserLog: null,
    onLog: () => {},
  });

  try {
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto({ url: pathToFileURL(sheetHtmlPath).href, timeout: 30000 });
    await page.evaluate(async () => {
      await Promise.all(
        Array.from(document.images).map((img) =>
          img.complete ? Promise.resolve() : img.decode().catch(() => {})
        )
      );
    });

    const client = page._client();
    const target = page.target();
    await client.send('Target.activateTarget', { targetId: target._targetId });
    const { value } = await client.send('Page.captureScreenshot', {
      format: 'jpeg',
      quality: 88,
      clip: { x: 0, y: 0, width, height, scale: 1 },
      captureBeyondViewport: true,
      fromSurface: true,
    });
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, Buffer.from(value.data, 'base64'));
  } finally {
    await page.close();
  }
}

async function main() {
  const { compositionId, slug } = resolveTarget(process.argv.slice(2));
  const browserExecutable = findBrowserExecutable();
  const workDir = path.join(AUDIT_ROOT, slug);
  const bundleOutDir = path.join(AUDIT_ROOT, `${slug}-bundle`);
  const plancheOutPath = path.join(AUDIT_ROOT, `${slug}_planche.jpg`);

  fs.rmSync(workDir, { recursive: true, force: true });
  fs.rmSync(bundleOutDir, { recursive: true, force: true });
  fs.mkdirSync(workDir, { recursive: true });

  let browser;
  let cleanupServer;
  try {
    const serveDir = await bundle({
      entryPoint: path.join(studioRoot, 'engine', 'index.ts'),
      publicDir: path.join(studioRoot, 'assets'),
      outDir: bundleOutDir,
      symlinkPublicDir: true,
    });

    browser = await openBrowser('chrome', {
      browserExecutable,
      logLevel: 'error',
    });

    const serverBundle = await RenderInternals.makeOrReuseServer(
      undefined,
      {
        webpackConfigOrServeUrl: serveDir,
        port: null,
        remotionRoot: studioRoot,
        offthreadVideoThreads: 1,
        logLevel: 'error',
        indent: false,
        offthreadVideoCacheSizeInBytes: null,
        binariesDirectory: null,
        forceIPv4: false,
        sampleRate: 48000,
      },
      { onDownload: null }
    );
    const server = serverBundle.server;
    cleanupServer = serverBundle.cleanupServer;

    const composition = await selectComposition({
      serveUrl: server.serveUrl,
      id: compositionId,
      puppeteerInstance: browser,
      browserExecutable,
      logLevel: 'error',
    });

    const keyFrames = computeKeyFrames(composition.durationInFrames, composition.fps, slug, 12);
    const renderedItems = [];

    for (let i = 0; i < keyFrames.length; i++) {
      const frame = keyFrames[i];
      const filePath = path.join(workDir, `frame_${String(i).padStart(2, '0')}.jpg`);
      await renderStill({
        composition,
        serveUrl: server.serveUrl,
        frame,
        output: filePath,
        imageFormat: 'jpeg',
        jpegQuality: 88,
        overwrite: true,
        puppeteerInstance: browser,
        browserExecutable,
        logLevel: 'error',
      });
      renderedItems.push({ frame, fps: composition.fps, filePath });
    }

    const domReports = await runDomAuditAcrossFrames(browser, server, composition, keyFrames);
    await buildContactSheet(browser, server, renderedItems, workDir, plancheOutPath);

    let truncatedTotal = 0;
    let outOfBoundsTotal = 0;
    let safeZoneTotal = 0;

    console.log(`\n=== AUDIT VISUEL DOM : ${compositionId} (${slug}) ===`);
    console.log(`Frames auditees (${keyFrames.length}) : ${keyFrames.join(', ')}`);

    for (const rep of domReports) {
      truncatedTotal += rep.truncatedText.length;
      outOfBoundsTotal += rep.outOfBounds.length;
      safeZoneTotal += rep.safeZoneViolations.length;
      const problems = [...rep.truncatedText, ...rep.outOfBounds, ...rep.safeZoneViolations];
      if (problems.length > 0) {
        console.log(`  [WARN] frame ${rep.frame} (${(rep.frame / composition.fps).toFixed(2)}s):`);
        for (const msg of problems) {
          console.log(`    - ${msg}`);
        }
      }
    }

    console.log(
      `Bilan DOM : texte coupe=${truncatedTotal} | hors cadre 1080x1920=${outOfBoundsTotal} | safe zones=${safeZoneTotal}`
    );
    console.log(`PLANCHE CONTACT : ${plancheOutPath}\n`);

    if (truncatedTotal > 0 || outOfBoundsTotal > 0) {
      process.exitCode = 1;
    }
  } finally {
    if (cleanupServer) {
      await cleanupServer(true).catch(() => {});
    }
    if (browser) {
      await browser.close({ silent: true }).catch(() => {});
    }
    fs.rmSync(workDir, { recursive: true, force: true });
    fs.rmSync(bundleOutDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(`Visual audit failed: ${err.message}`);
  process.exit(1);
});
