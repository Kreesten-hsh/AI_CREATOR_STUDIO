#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const slug = process.argv[2];

if (!slug || !/^[a-z0-9_-]+$/i.test(slug)) {
  console.error('Usage: node scripts/new_episode.mjs <epXX_slug>');
  process.exit(1);
}

const epDir = path.join(rootDir, 'episodes', slug);
if (fs.existsSync(epDir)) {
  console.error(`Episode folder already exists: ${epDir}`);
  process.exit(1);
}

fs.mkdirSync(epDir, { recursive: true });

fs.writeFileSync(
  path.join(epDir, 'meta.json'),
  JSON.stringify(
    {
      id: slug,
      title: 'Nouveau script viral AI CREATOR Studio',
      funnelStage: 'TOFU',
      intention: 'Eduquer',
      format: '05_illustrated_grid',
      style: 'ledevultime_minimal_grid',
      openingPose: 'none_illustrated',
      durationSec: 30,
      ctaKeyword: 'CLAUDE',
      customScenesCount: 2,
      hookInFirstFrame: true,
      hasContrarianSnapback: true,
      openLoopsAtSec: [10, 22],
      maxStaticStretchSec: 1.8,
      mentionsForbiddenChallengeWord: false,
      usesSafeZones: true,
    },
    null,
    2
  )
);

fs.writeFileSync(
  path.join(epDir, 'script.md'),
  `# ${slug}\n\n## Hook (< 800ms)\n\n## Snapback (1-3s)\n\n## Body + Open Loops (~10s, ~22s)\n\n## Payoff + CTA Commentaire ManyChat\n`
);

fs.writeFileSync(
  path.join(epDir, 'transcript.json'),
  JSON.stringify(
    [
      { word: 'Remplace', start: 0.0, end: 0.4 },
      { word: 'avec', start: 0.4, end: 0.7 },
      { word: 'tes', start: 0.7, end: 1.0 },
      { word: 'timecodes', start: 1.0, end: 1.6 },
    ],
    null,
    2
  )
);

console.log(`Initialized episode workspace: ${epDir}`);
