import { describe, expect, it } from 'vitest';
import {
  createEmptyDossier,
  validateDossierField,
  calculateDossierTotalLength,
} from '../utils/dossierStorage';
import {
  ALL_DOSSIER_FIELD_KEYS,
  resolveDossierFieldKey,
  serializeProductIdentity,
  parseProductIdentity,
  artisticDirectionToPromptText,
  serializeArtisticDirection,
  type ProjectDossierFieldKey,
  type ArtisticDirectionData,
} from '../types/dossier';

describe('Dossier de projet de l apprenant (structure, limites & anti-secrets)', () => {
  it('initialise exactement 18 champs au statut empty incluant productIdentity', () => {
    const dossier = createEmptyDossier();
    expect(dossier.version).toBe(1);
    expect(Object.keys(dossier.fields)).toHaveLength(18);
    expect(Object.keys(dossier.fields).sort()).toEqual([...ALL_DOSSIER_FIELD_KEYS].sort());
    expect(dossier.fields.productIdentity).toBeDefined();
    expect(dossier.fields.productIdentity.status).toBe('empty');

    for (const key of ALL_DOSSIER_FIELD_KEYS) {
      expect(dossier.fields[key as ProjectDossierFieldKey].status).toBe('empty');
      expect(dossier.fields[key as ProjectDossierFieldKey].value).toBe('');
      expect(dossier.fields[key as ProjectDossierFieldKey].updatedAt).toBeDefined();
    }
  });

  describe('Limites de taille par champ', () => {
    it('autorise jusqu à 40 000 caractères pour documentAnalysis, essentialContents et creationPrompt', () => {
      const valid40k = 'A'.repeat(40_000);
      expect(validateDossierField('documentAnalysis', valid40k).valid).toBe(true);
      expect(validateDossierField('essentialContents', valid40k).valid).toBe(true);
      expect(validateDossierField('creationPrompt', valid40k).valid).toBe(true);

      const invalid40k = 'A'.repeat(40_001);
      const res = validateDossierField('documentAnalysis', invalid40k);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('dépasse la limite maximale autorisée (40\u202f000 caractères');
    });

    it('limite à 10 000 caractères les autres champs', () => {
      const valid10k = 'B'.repeat(10_000);
      expect(validateDossierField('buyerProfile', valid10k).valid).toBe(true);
      expect(validateDossierField('solutionPromise', valid10k).valid).toBe(true);

      const invalid10k = 'B'.repeat(10_001);
      const res = validateDossierField('buyerProfile', invalid10k);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('dépasse la limite maximale autorisée (10\u202f000 caractères');
    });
  });

  describe('Anti-secrets à forte certitude', () => {
    it('rejette les clés API OpenAI / Anthropic (sk-...)', () => {
      const text = 'Voici ma clé sk-ant-api03-abcdef1234567890abcdef123456 pour tester';
      const res = validateDossierField('creationPrompt', text);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('motif sensible interdit');
    });

    it('rejette les Personal Access Tokens GitHub (ghp_...)', () => {
      const text = 'Mon token ghp_123456789012345678901234567890';
      const res = validateDossierField('functionalBrief', text);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('motif sensible interdit');
    });

    it('rejette les clés privées (-----BEGIN PRIVATE KEY-----)', () => {
      const text = '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0...';
      const res = validateDossierField('documentAnalysis', text);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('motif sensible interdit');
    });

    it('rejette les blobs PDF encodés en base64', () => {
      const fakePdf = 'data:application/pdf;base64,' + 'A'.repeat(120);
      const res = validateDossierField('accessPdf', fakePdf);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('motif sensible interdit');
    });

    it('ACCEPTE les formulations légitimes contenant mot de passe ou code d accès sans faux positif', () => {
      const naturalText =
        "L'application propose un formulaire de réinitialisation de mot de passe et un code d'accès par SMS pour sécuriser l'espace membre.";
      const res = validateDossierField('functionalBrief', naturalText);
      expect(res.valid).toBe(true);
      expect(res.error).toBeUndefined();
    });
  });

  describe('Plafond global cumulé du dossier', () => {
    it('calcule la longueur totale exacte de tous les champs', () => {
      const dossier = createEmptyDossier();
      dossier.fields.buyerProfile.value = '12345';
      dossier.fields.solutionPromise.value = '67890';
      expect(calculateDossierTotalLength(dossier)).toBe(10);
    });
  });

  describe('Résolution d alias français', () => {
    it('résout correctement les alias français vers les clés canoniques', () => {
      expect(resolveDossierFieldKey('acheteur')).toBe('buyerProfile');
      expect(resolveDossierFieldKey('analyse')).toBe('documentAnalysis');
      expect(resolveDossierFieldKey('contenus')).toBe('essentialContents');
      expect(resolveDossierFieldKey('solution')).toBe('solutionPromise');
      expect(resolveDossierFieldKey('modele')).toBe('chosenProductModel');
      expect(resolveDossierFieldKey('brief')).toBe('functionalBrief');
      expect(resolveDossierFieldKey('style')).toBe('artisticDirection');
      expect(resolveDossierFieldKey('url')).toBe('publishedUrl');
      expect(resolveDossierFieldKey('identite_produit')).toBe('productIdentity');
      expect(resolveDossierFieldKey('nom_produit')).toBe('productIdentity');
      expect(resolveDossierFieldKey('marque')).toBe('productIdentity');
    });
  });

  describe('productIdentity & artisticDirection (sérialisation, parsing et prompt)', () => {
    it('sérialise et parse productIdentity sans perte', () => {
      const data = {
        productName: 'SimuFacture Pro',
        brandName: 'Cabinet Chiffrage',
        shortHook: 'Chiffrez vos missions en 2 minutes chrono',
      };
      const raw = serializeProductIdentity(data);
      expect(parseProductIdentity(raw)).toEqual(data);
    });

    it('génère un texte de prompt complet pour artisticDirection', () => {
      const styleData: ArtisticDirectionData = {
        paletteId: 'custom-slate',
        paletteName: 'Ardoise & Émeraude',
        backgroundHex: '#0F172A',
        surfaceHex: '#1E293B',
        accentHex: '#10B981',
        inkHex: '#F8FAFC',
        headingFont: 'Plus Jakarta Sans',
        bodyFont: 'Inter',
        monoFont: 'JetBrains Mono',
        borderRadius: '8px',
        density: 'balanced',
        styleDescriptor: 'Bordures nettes de 1px avec contraste prononcé',
      };
      const promptText = artisticDirectionToPromptText(serializeArtisticDirection(styleData));
      expect(promptText).toContain('Palette : Fond #0F172A');
      expect(promptText).toContain('Accent #10B981');
      expect(promptText).toContain('Plus Jakarta Sans');
      expect(promptText).toContain('Coins doux et structurés (8px)');
      expect(promptText).toContain('Densité équilibrée et fluide');
    });
  });
});
