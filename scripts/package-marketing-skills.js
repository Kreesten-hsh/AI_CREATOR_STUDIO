import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'public', 'downloads', 'skills');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Nettoyage préventif des archives non vérifiées pour respecter la conformité légale
const UNVERIFIED_ARCHIVES = [
  'marketing-psychology.zip',
  'pricing.zip',
  'prompt-engineering.zip',
  'ig-profile.zip',
  'li-profile.zip',
  'ig-story.zip',
  'li-inbox.zip',
];

for (const unverified of UNVERIFIED_ARCHIVES) {
  const targetPath = path.join(outputDir, unverified);
  if (fs.existsSync(targetPath)) {
    fs.unlinkSync(targetPath);
    console.log(`🧹 Suppression de l'archive non autorisée à la redistribution : ${unverified}`);
  }
}

// Répertoire temporaire de staging
const stagingBase = path.join(rootDir, 'temp-skills-staging');
if (fs.existsSync(stagingBase)) {
  fs.rmSync(stagingBase, { recursive: true, force: true });
}
fs.mkdirSync(stagingBase, { recursive: true });

const HOME = process.env.HOME || '/home/hasashi';

const HUMANIZER_MIT_LICENSE = `MIT License

Copyright (c) 2025 Siqi Chen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---
Note on attribution:
The patterns and markers implemented in this skill are inspired by Wikipedia: Signs of AI writing, maintained by the WikiProject AI Cleanup community.
`;

const VERIFIED_SKILLS_CONFIG = [
  {
    name: 'humanizer',
    files: [
      { src: path.join(HOME, '.gemini/config/skills/humanizer/SKILL.md'), dest: 'SKILL.md' },
    ],
    inlineFiles: [
      { content: HUMANIZER_MIT_LICENSE, dest: 'LICENSE' },
    ],
  },
  {
    name: 'antislop-copywriting',
    files: [
      { src: path.join(HOME, '.gemini/config/plugins/anti-slop/skills/antislop-copywriting/SKILL.md'), dest: 'SKILL.md' },
      { src: path.join(HOME, '.gemini/config/plugins/anti-slop/antislop.md'), dest: 'antislop.md' },
      { src: path.join(HOME, '.gemini/config/plugins/anti-slop/LICENSE'), dest: 'LICENSE' },
    ],
  },
];

console.log('📦 Début du packaging déterministe des skills marketing aux droits vérifiés...');

for (const skill of VERIFIED_SKILLS_CONFIG) {
  const skillStagingDir = path.join(stagingBase, skill.name);
  fs.mkdirSync(skillStagingDir, { recursive: true });

  for (const item of skill.files) {
    if (!fs.existsSync(item.src)) {
      throw new Error(`Fichier source introuvable pour ${skill.name} : ${item.src}`);
    }
    const destPath = path.join(skillStagingDir, item.dest);
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(item.src, destPath);
  }

  if (skill.inlineFiles) {
    for (const item of skill.inlineFiles) {
      const destPath = path.join(skillStagingDir, item.dest);
      fs.writeFileSync(destPath, item.content, 'utf-8');
    }
  }

  const zipPath = path.join(outputDir, `${skill.name}.zip`);
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  // Crée l'archive avec la racine contenant le nom du dossier du skill
  const cmd = `cd "${stagingBase}" && zip -q -r -X "${zipPath}" "${skill.name}"`;
  execSync(cmd, { stdio: 'inherit' });

  const stat = fs.statSync(zipPath);
  console.log(`✅ Archive autorisée générée : ${skill.name}.zip (${stat.size} octets)`);
}

// Nettoyage du staging
fs.rmSync(stagingBase, { recursive: true, force: true });
console.log('🎉 Packaging conforme terminé avec succès dans public/downloads/skills/ !');
