import { beforeEach, describe, expect, it } from 'vitest';
import {
  createEmptyDossier,
  DOSSIER_PRE_IMPORT_BACKUP_KEY,
  exportDossierJson,
  importDossierJson,
} from '../utils/dossierStorage';

describe('Export & Import du Dossier de Projet', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('Export JSON', () => {
    it('génère un nom de fichier lisible et horodaté incluant le nom de l apprenant', () => {
      const dossier = createEmptyDossier();
      const { filename, jsonString } = exportDossierJson(dossier, 'Jean Dupont');
      const today = new Date().toISOString().split('T')[0];

      expect(filename).toBe(`dossier-projet-jean-dupont-${today}.json`);
      const parsed = JSON.parse(jsonString);
      expect(parsed.app).toBe('AI_CREATOR_STUDIO');
      expect(parsed.kind).toBe('project_dossier');
      expect(parsed.version).toBe(1);
      expect(parsed.dossier).toBeDefined();
    });

    it('génère un nom de fichier générique si le nom de l apprenant est vide', () => {
      const dossier = createEmptyDossier();
      const { filename } = exportDossierJson(dossier, '');
      const today = new Date().toISOString().split('T')[0];
      expect(filename).toBe(`dossier-projet-${today}.json`);
    });
  });

  describe('Import JSON & Sécurité', () => {
    it('importe avec succès un dossier valide lorsque confirmOverwrite est true', () => {
      const dossier = createEmptyDossier();
      dossier.fields.buyerProfile = {
        value: 'Coachs indépendants',
        status: 'valid',
        updatedAt: new Date().toISOString(),
      };

      const { jsonString } = exportDossierJson(dossier, 'Test');
      const result = importDossierJson(jsonString, { confirmOverwrite: true });

      expect(result.success).toBe(true);
      expect(result.dossier?.fields.buyerProfile.value).toBe('Coachs indépendants');
      expect(result.dossier?.fields.buyerProfile.status).toBe('valid');
    });

    it('exige une confirmation explicite et refuse d écraser si confirmOverwrite est false', () => {
      const dossier = createEmptyDossier();
      const { jsonString } = exportDossierJson(dossier);

      const result = importDossierJson(jsonString, { confirmOverwrite: false });
      expect(result.success).toBe(false);
      expect(result.requireConfirmation).toBe(true);
      expect(result.error).toContain('Confirmation requise');
    });

    it('sauvegarde automatiquement le dossier courant sous DOSSIER_PRE_IMPORT_BACKUP_KEY avant écrasement', () => {
      const currentDossier = createEmptyDossier();
      currentDossier.fields.priorityProblem.value = 'Problème existant avant import';

      const newDossier = createEmptyDossier();
      newDossier.fields.priorityProblem.value = 'Nouveau problème importé';
      const { jsonString } = exportDossierJson(newDossier);

      const result = importDossierJson(jsonString, {
        confirmOverwrite: true,
        currentDossier,
      });

      expect(result.success).toBe(true);

      const backupRaw = window.localStorage.getItem(DOSSIER_PRE_IMPORT_BACKUP_KEY);
      expect(backupRaw).not.toBeNull();
      const backupParsed = JSON.parse(backupRaw!);
      expect(backupParsed.dossier.fields.priorityProblem.value).toBe('Problème existant avant import');
    });

    it('rejette les injections de prototype (__proto__ et constructor)', () => {
      const maliciousJson = '{"version": 1, "__proto__": {"polluted": true}, "fields": {}}';
      const result = importDossierJson(maliciousJson, { confirmOverwrite: true });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Structure JSON non sécurisée détectée');
    });

    it('rejette les clés inconnues ne figurant pas dans la liste blanche canonique des 17 champs', () => {
      const dossierWithUnknown = {
        version: 1,
        fields: {
          buyerProfile: { value: 'OK', status: 'valid' },
          unknownHackedField: { value: 'Infiltré', status: 'valid' },
        },
      };

      const result = importDossierJson(JSON.stringify(dossierWithUnknown), { confirmOverwrite: true });
      expect(result.success).toBe(false);
      expect(result.error).toContain("Clé inconnue ou non autorisée dans le dossier importé : 'unknownHackedField'");
    });

    it('rejette les fichiers ayant une version incompatible', () => {
      const incompatible = {
        version: 99,
        fields: {},
      };

      const result = importDossierJson(JSON.stringify(incompatible), { confirmOverwrite: true });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Version de schéma incompatible (99 au lieu de 1)');
    });
  });
});
