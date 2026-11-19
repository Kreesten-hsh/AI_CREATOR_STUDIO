#!/usr/bin/env node
/**
 * Viral Retention Scorecard Audit (/100) for AI CREATOR Studio episodes.
 * Reads episodes/<slug>/meta.json and validates blocking criteria (>= 90/100 required),
 * including zero forbidden double-slash ("//") in episode files.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const epPath = process.argv[2];
if (!epPath) {
  console.error('Usage: node scripts/audit_episode.mjs <path/to/episode_dir>');
  process.exit(1);
}

const metaFile = path.resolve(epPath, 'meta.json');
if (!fs.existsSync(metaFile)) {
  console.error(`Missing meta.json at ${metaFile}`);
  process.exit(1);
}

const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));

const epFiles = fs
  .readdirSync(path.resolve(epPath))
  .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.json'));

let hasDoubleSlash = false;
let hasBracketLabel = false;
for (const file of epFiles) {
  const raw = fs.readFileSync(path.resolve(epPath, file), 'utf-8');
  if (raw.includes('/' + '/')) {
    hasDoubleSlash = true;
  }
  if (/((?:label|title|bannerText|text)=["'][^"']*[\[\]][^"']*["'])/.test(raw)) {
    hasBracketLabel = true;
  }
}

const checks = [
  { name: '1. Hook < 800ms (visuel + texte frame 1)', pts: 15, ok: Boolean(meta.hookInFirstFrame) },
  { name: '2. Contrarian Snapback (1-3s)', pts: 10, ok: Boolean(meta.hasContrarianSnapback) },
  {
    name: '3. Open Loop #1 (6-15s)',
    pts: 10,
    ok: Array.isArray(meta.openLoopsAtSec) && meta.openLoopsAtSec.some((t) => t >= 6 && t <= 15),
  },
  {
    name: '4. Open Loop #2 (18-32s ou relance milieu)',
    pts: 10,
    ok:
      Array.isArray(meta.openLoopsAtSec) &&
      (meta.durationSec < 22 ? meta.openLoopsAtSec.length >= 1 : meta.openLoopsAtSec.some((t) => t >= 18 && t <= 32)),
  },
  {
    name: '5. Densite visuelle (aucun plan inerte >= 2.5s)',
    pts: 15,
    ok: typeof meta.maxStaticStretchSec === 'number' && meta.maxStaticStretchSec < 2.5,
  },
  {
    name: '6. Unicite & scenes custom (>= 2 scenes sur-mesure)',
    pts: 15,
    ok: typeof meta.customScenesCount === 'number' && meta.customScenesCount >= 2,
  },
  {
    name: '7. Fidelite AI CREATOR Studio (zero "challenge", zero double-slash & zero crochets [ ])',
    pts: 10,
    ok: meta.mentionsForbiddenChallengeWord === false && !hasDoubleSlash && !hasBracketLabel,
  },
  { name: '8. Symetrie & Safe zones 9:16 respectees', pts: 10, ok: Boolean(meta.usesSafeZones) },
  { name: '9. CTA unique ManyChat / Chariow', pts: 5, ok: typeof meta.ctaKeyword === 'string' && meta.ctaKeyword.length > 0 },
];

let score = 0;
console.log(`\n=== AUDIT VIRAL : ${meta.id || epPath} ===`);
for (const c of checks) {
  if (c.ok) score += c.pts;
  console.log(`${c.ok ? '[PASS]' : '[FAIL]'} ${c.name} (${c.ok ? c.pts : 0}/${c.pts})`);
}
console.log(`SCORE TOTAL : ${score}/100 (Minimum requis : 90/100)\n`);

if (score < 90 && !process.argv.includes('--allow-low')) {
  process.exit(1);
}

if (process.argv.includes('--visual')) {
  const slug = path.basename(path.resolve(epPath));
  const visualAuditScript = path.join(__dirname, 'visual_audit.mjs');
  execFileSync(process.execPath, [visualAuditScript, epPath], { stdio: 'inherit' });
  console.log(`Planche contact generee : /tmp/remotion-audit/${slug}_planche.jpg\n`);
}
