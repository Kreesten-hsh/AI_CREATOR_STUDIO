#!/usr/bin/env node
/**
 * scripts/package-skill.js
 * Packaging déterministe du Skill ai-creator-design-intelligence.
 * 
 * Génère l'archive AI-CREATOR-DESIGN-INTELLIGENCE.zip avec la racine
 * `ai-creator-design-intelligence/` et synchronise les copies dans :
 * 1. docs/ai-creator-design-intelligence/AI-CREATOR-DESIGN-INTELLIGENCE.zip
 * 2. public/downloads/AI-CREATOR-DESIGN-INTELLIGENCE.zip
 */

import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const docsDir = path.join(rootDir, 'docs');
const sourceFolder = 'ai-creator-design-intelligence';
const targetZipDocs = path.join(docsDir, sourceFolder, 'AI-CREATOR-DESIGN-INTELLIGENCE.zip');
const targetZipPublic = path.join(rootDir, 'public', 'downloads', 'AI-CREATOR-DESIGN-INTELLIGENCE.zip');

function calculateHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function packageSkill() {
  console.log('📦 Début du packaging du Skill ai-creator-design-intelligence...');

  const tempZip = path.join(rootDir, 'temp-skill-package.zip');
  if (fs.existsSync(tempZip)) {
    fs.unlinkSync(tempZip);
  }

  // Création de l'archive zip depuis `docs` pour obtenir le préfixe de dossier attendu
  const cmd = `cd "${docsDir}" && zip -q -r -X "${tempZip}" "${sourceFolder}" -x "*.zip" -x "*/.*" -x "*/__MACOSX*"`;
  execSync(cmd, { stdio: 'inherit' });

  // S'assurer que le répertoire de destination public existe
  const publicDownloadsDir = path.dirname(targetZipPublic);
  if (!fs.existsSync(publicDownloadsDir)) {
    fs.mkdirSync(publicDownloadsDir, { recursive: true });
  }

  // Copie vers les deux cibles officielles
  fs.copyFileSync(tempZip, targetZipDocs);
  fs.copyFileSync(tempZip, targetZipPublic);
  fs.unlinkSync(tempZip);

  const hashDocs = calculateHash(targetZipDocs);
  const hashPublic = calculateHash(targetZipPublic);

  if (hashDocs !== hashPublic) {
    throw new Error(`Désynchronisation critique : SHA-256 différent entre docs (${hashDocs}) et public (${hashPublic})`);
  }

  const stat = fs.statSync(targetZipDocs);
  console.log(`✅ Archive générée avec succès !`);
  console.log(`   - Poids : ${stat.size} octets`);
  console.log(`   - SHA-256 : ${hashDocs}`);
  console.log(`   - Cible 1 : ${path.relative(rootDir, targetZipDocs)}`);
  console.log(`   - Cible 2 : ${path.relative(rootDir, targetZipPublic)}`);
}

packageSkill();
