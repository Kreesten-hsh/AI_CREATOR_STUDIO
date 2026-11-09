import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { BONUS_MARKETING_DATA } from '../data/bonuses/bonus-marketing';

describe('Vérification des droits et intégrité des archives officielles de Skills Marketing', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const downloadsDir = path.join(rootDir, 'public', 'downloads', 'skills');

  const VERIFIED_ARCHIVES = [
    {
      name: 'humanizer.zip',
      requiredFiles: ['humanizer/SKILL.md', 'humanizer/LICENSE'],
      expectedAuthor: 'Siqi Chen',
    },
    {
      name: 'antislop-copywriting.zip',
      requiredFiles: [
        'antislop-copywriting/SKILL.md',
        'antislop-copywriting/antislop.md',
        'antislop-copywriting/LICENSE',
      ],
      expectedAuthor: 'Miqdad Badjuber',
    },
  ];

  const UNVERIFIED_SKILL_NAMES = [
    'marketing-psychology',
    'pricing',
    'prompt-engineering',
    'ig-profile',
    'li-profile',
    'ig-story',
    'li-inbox',
  ];

  it('les archives vérifiées (humanizer, antislop-copywriting) existent et sont intègres (unzip -t)', () => {
    expect(fs.existsSync(downloadsDir)).toBe(true);

    for (const archive of VERIFIED_ARCHIVES) {
      const archivePath = path.join(downloadsDir, archive.name);
      expect(
        fs.existsSync(archivePath),
        `L'archive autorisée ${archive.name} doit exister dans public/downloads/skills/`
      ).toBe(true);

      const stat = fs.statSync(archivePath);
      expect(stat.size).toBeGreaterThan(1000);

      // Test d'intégrité de l'archive ZIP via unzip -t
      const testResult = execSync(`unzip -t "${archivePath}"`, { encoding: 'utf-8' });
      expect(testResult).toContain('No errors detected in compressed data');
    }
  });

  it('chaque archive vérifiée contient ses fichiers requis et son attribution de licence', () => {
    for (const archive of VERIFIED_ARCHIVES) {
      const archivePath = path.join(downloadsDir, archive.name);
      const listOutput = execSync(`unzip -l "${archivePath}"`, { encoding: 'utf-8' });

      for (const reqFile of archive.requiredFiles) {
        expect(
          listOutput.includes(reqFile),
          `L'archive ${archive.name} doit contenir le fichier ${reqFile}`
        ).toBe(true);
      }

      // Vérification du contenu du fichier de licence
      const licensePath = `${archive.name.replace('.zip', '')}/LICENSE`;
      const licenseContent = execSync(`unzip -p "${archivePath}" "${licensePath}"`, { encoding: 'utf-8' });
      expect(licenseContent).toContain('MIT License');
      expect(licenseContent).toContain(archive.expectedAuthor);
    }

    // Vérification spécifique de l'attribution Humanizer (Siqi Chen + Wikipedia WikiProject AI Cleanup)
    const humanizerZip = path.join(downloadsDir, 'humanizer.zip');
    const humanizerLicense = execSync(`unzip -p "${humanizerZip}" "humanizer/LICENSE"`, { encoding: 'utf-8' });
    expect(humanizerLicense).toContain('Copyright (c) 2025 Siqi Chen');
    expect(humanizerLicense).toContain('Wikipedia: Signs of AI writing');
    expect(humanizerLicense).toContain('WikiProject AI Cleanup');
  });

  it('les 7 compétences sans droits de redistribution établis ne sont pas publiées en téléchargement', () => {
    for (const skillName of UNVERIFIED_SKILL_NAMES) {
      const archivePath = path.join(downloadsDir, `${skillName}.zip`);
      expect(
        fs.existsSync(archivePath),
        `L'archive non autorisée ${skillName}.zip ne doit PAS être publiée dans public/downloads/skills/`
      ).toBe(false);
    }
  });

  it('les métadonnées des 9 fiches reflètent fidèlement la disponibilité des téléchargements', () => {
    expect(BONUS_MARKETING_DATA.skills.length).toBe(9);

    for (const skill of BONUS_MARKETING_DATA.skills) {
      if (skill.technicalName === 'humanizer' || skill.technicalName === 'antislop-copywriting') {
        expect(skill.download.isAvailable).toBe(true);
        expect(skill.download.downloadUrl).toMatch(/^\/downloads\/skills\//);
        expect(skill.download.licenseInfo).toBeDefined();
      } else {
        expect(skill.download.isAvailable).toBe(false);
        expect(skill.download.downloadUrl).toBe('');
        expect(skill.download.statusNote).toMatch(/indisponible.*droits de redistribution/i);
      }
    }
  });
});
