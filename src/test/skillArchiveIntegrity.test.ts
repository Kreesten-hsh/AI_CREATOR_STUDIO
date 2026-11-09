import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Intégrité Binaire et Pédagogique du Skill AI-CREATOR-DESIGN-INTELLIGENCE', () => {
  const rootDir = process.cwd();
  const zipDocs = path.join(
    rootDir,
    'docs',
    'ai-creator-design-intelligence',
    'AI-CREATOR-DESIGN-INTELLIGENCE.zip'
  );
  const zipPublic = path.join(
    rootDir,
    'public',
    'downloads',
    'AI-CREATOR-DESIGN-INTELLIGENCE.zip'
  );

  function getSha256(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  it('les deux archives zip (docs/ et public/downloads/) existent physiquement', () => {
    expect(fs.existsSync(zipDocs)).toBe(true);
    expect(fs.existsSync(zipPublic)).toBe(true);
  });

  it('les deux archives sont binaires et strictement identiques (même SHA-256)', () => {
    const hashDocs = getSha256(zipDocs);
    const hashPublic = getSha256(zipPublic);
    expect(hashDocs).toBe(hashPublic);
    expect(hashDocs.length).toBe(64);
  });

  it('l’archive contient les fichiers fondamentaux du Skill sous le préfixe ai-creator-design-intelligence/', () => {
    const output = execSync(`unzip -l "${zipPublic}"`, { encoding: 'utf-8' });

    expect(output).toContain('ai-creator-design-intelligence/SKILL.md');
    expect(output).toContain('ai-creator-design-intelligence/references/art-direction.md');
    expect(output).toContain('ai-creator-design-intelligence/references/app-interface-design.md');
    expect(output).toContain('ai-creator-design-intelligence/references/design-system.md');
    expect(output).toContain('ai-creator-design-intelligence/references/anti-slop-and-copywriting.md');
  });

  it('le fichier art-direction.md extrait du ZIP applique la scission : 6 points avant choix et fiche technique complète après choix', () => {
    const artDirectionContent = execSync(
      `unzip -p "${zipPublic}" ai-creator-design-intelligence/references/art-direction.md`,
      { encoding: 'utf-8' }
    );

    // Vérification de la phase A : 6 points simples sans code CSS
    expect(artDirectionContent).toContain('Avant le Choix : Les 3 Propositions Adaptatives (6 Points Simples)');
    expect(artDirectionContent).toContain('1. **Nom évocateur**');
    expect(artDirectionContent).toContain('2. **Ambiance et personnalité**');
    expect(artDirectionContent).toContain('3. **Palette visuelle**');
    expect(artDirectionContent).toContain('4. **Style typographique expliqué simplement**');
    expect(artDirectionContent).toContain('5. **Composition générale**');
    expect(artDirectionContent).toContain('6. **Pertinence pour le sujet et le public**');

    // Vérification de la phase B : fiche technique complète après le choix
    expect(artDirectionContent).toContain('Après le Choix : La Fiche de Style Technique Complète');
    expect(artDirectionContent).toContain('--bg-canvas');
    expect(artDirectionContent).toContain('375 px');
  });
});
