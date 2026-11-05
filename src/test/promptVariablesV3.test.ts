import { describe, expect, it } from 'vitest';
import { renderPromptTemplate } from '../utils/promptRenderer';
import { createEmptyDossier } from '../utils/dossierStorage';
import type { StudentProfile } from '../types/course';
import { DEFAULT_STUDENT_PROFILE } from '../utils/storage';

describe('Moteur de variables de prompt V3 (Dossier, Profil, Résolution & Blocage)', () => {
  const mockProfile: StudentProfile = {
    ...DEFAULT_STUDENT_PROFILE,
    studentName: 'Clara',
    business: 'Formation en copywriting',
    targetAudience: 'Créateurs de contenu',
    productType: 'Générateur de titres',
    brandStyle: 'Éditorial',
    mainObjective: 'Créer un produit interactif',
  };

  it('respecte l ordre strict de résolution : override local > dossier de projet > profil', () => {
    const dossier = createEmptyDossier();
    dossier.fields.buyerProfile = {
      value: 'Valeur Dossier Acheteur',
      status: 'valid',
      updatedAt: new Date().toISOString(),
    };

    // Cas 1 : résolution depuis le profil
    const resProfile = renderPromptTemplate('Bonjour {{studentName}}', {
      profile: mockProfile,
      dossier,
    });
    expect(resProfile.renderedText).toBe('Bonjour Clara');
    expect(resProfile.missingKeys).toHaveLength(0);

    // Cas 2 : résolution depuis le dossier
    const resDossier = renderPromptTemplate('Cible : {{dossier.buyerProfile}}', {
      profile: mockProfile,
      dossier,
    });
    expect(resDossier.renderedText).toBe('Cible : Valeur Dossier Acheteur');

    // Cas 3 : override local prévaut sur le dossier
    const resOverride = renderPromptTemplate('Cible : {{dossier.buyerProfile}}', {
      profile: mockProfile,
      dossier,
      localOverrides: {
        'dossier.buyerProfile': 'Valeur Override Prioritaire',
      },
    });
    expect(resOverride.renderedText).toBe('Cible : Valeur Override Prioritaire');
  });

  it('résout les alias français de clés de dossier (ex: {{dossier.acheteur}})', () => {
    const dossier = createEmptyDossier();
    dossier.fields.buyerProfile = {
      value: 'Artisans du bois',
      status: 'valid',
      updatedAt: new Date().toISOString(),
    };
    dossier.fields.solutionPromise = {
      value: 'Calculateur de devis instantané',
      status: 'valid',
      updatedAt: new Date().toISOString(),
    };

    const template = 'Client : {{dossier.acheteur}} | Offre : {{dossier.solution}}';
    const res = renderPromptTemplate(template, {
      profile: mockProfile,
      dossier,
    });

    expect(res.renderedText).toBe('Client : Artisans du bois | Offre : Calculateur de devis instantané');
    expect(res.missingKeys).toHaveLength(0);
  });

  it('considère un champ empty comme manquant et émet un warning pour un champ draft', () => {
    const dossier = createEmptyDossier();
    dossier.fields.buyerProfile = {
      value: '',
      status: 'empty',
      updatedAt: new Date().toISOString(),
    };
    dossier.fields.solutionPromise = {
      value: 'Promesse en cours de rédaction',
      status: 'draft',
      updatedAt: new Date().toISOString(),
    };

    const template = 'Cible : {{dossier.buyerProfile}} | Solution : {{dossier.solutionPromise}}';
    const res = renderPromptTemplate(template, {
      profile: mockProfile,
      dossier,
    });

    // Le champ empty est comptabilisé dans les missingKeys
    expect(res.missingKeys).toContain('dossier.buyerProfile');
    expect(res.renderedText).toContain('[DÉFINIR DOSSIER.BUYERPROFILE]');

    // Le champ draft est utilisé dans le texte mais signale un warning
    expect(res.renderedText).toContain('Solution : Promesse en cours de rédaction');
    expect(res.draftWarnings.some((w) => w.key === 'dossier.solutionPromise')).toBe(true);
  });

  it('gère les variables optionnelles {{?variable}} sans bloquer la copie', () => {
    const dossier = createEmptyDossier();
    const template = 'Mandatoire : {{business}} | Optionnel : {{?dossier.promotionalContent}}';

    const res = renderPromptTemplate(template, {
      profile: mockProfile,
      dossier,
    });

    expect(res.renderedText).toContain('Mandatoire : Formation en copywriting');
    expect(res.renderedText).toContain('[Optionnel : dossier.promotionalContent]');
    expect(res.missingKeys).toHaveLength(0); // Non bloquant !
    expect(res.optionalMissingKeys).toContain('dossier.promotionalContent');
  });

  it('ne remplace jamais une variable manquante par une valeur inventée', () => {
    const emptyProfile: StudentProfile = {
      ...DEFAULT_STUDENT_PROFILE,
    };
    const template = 'Nom du client : {{studentName}}';

    const res = renderPromptTemplate(template, {
      profile: emptyProfile,
    });

    expect(res.missingKeys).toEqual(['studentName']);
    expect(res.renderedText).toBe('Nom du client : [DÉFINIR STUDENTNAME]');
  });
});
