import { describe, expect, it } from 'vitest';
import { renderPromptTemplate } from '../utils/promptRenderer';
import type { StudentProfile } from '../types/course';
import { DEFAULT_STUDENT_PROFILE } from '../utils/storage';

describe('Moteur de variables de prompt V3 (Profil & Résolution)', () => {
  const mockProfile: StudentProfile = {
    ...DEFAULT_STUDENT_PROFILE,
    studentName: 'Clara',
    business: 'Formation en copywriting',
    targetAudience: 'Créateurs de contenu',
    productType: 'Générateur de titres',
    brandStyle: 'Éditorial',
    mainObjective: 'Créer un produit interactif',
  };

  it('résout les variables du profil', () => {
    const res = renderPromptTemplate('Bonjour {{studentName}}, cible : {{targetAudience}}', {
      profile: mockProfile,
    });
    expect(res.renderedText).toBe('Bonjour Clara, cible : Créateurs de contenu');
    expect(res.missingKeys).toHaveLength(0);
  });

  it('permet la surcharge via localOverrides', () => {
    const res = renderPromptTemplate('Cible : {{targetAudience}}', {
      profile: mockProfile,
      localOverrides: {
        targetAudience: 'Solopreneurs créatifs',
      },
    });
    expect(res.renderedText).toBe('Cible : Solopreneurs créatifs');
  });

  it('signale les variables obligatoires manquantes', () => {
    const res = renderPromptTemplate('Domaine : {{unknownVariable}}', {
      profile: mockProfile,
    });
    expect(res.missingKeys).toContain('unknownVariable');
    expect(res.renderedText).toBe('Domaine : [unknownVariable]');
  });
});
