import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CORRUPTED_BACKUP_STORAGE_KEY,
  createInitialProgress,
  ensureRawBackupWritten,
  exportProgressJson,
  importProgressJson,
  loadProgressFromStorage,
  migrateV1ToV3,
  migrateV2ToV3,
  RAW_BACKUP_V1_STORAGE_KEY,
  RAW_BACKUP_V2_STORAGE_KEY,
  saveProgressToStorage,
  STORAGE_KEY,
} from '../utils/storage';

describe('Persistance V3 & Chaîne de migration résiliente', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Sauvegardes brutes versionnées', () => {
    it('écrit et vérifie par relecture la sauvegarde brute V1 et V2 sans jamais les écraser', () => {
      const v1Data = JSON.stringify({ schemaVersion: 1, test: 'v1_original' });
      expect(ensureRawBackupWritten(1, v1Data)).toBe(true);
      expect(window.localStorage.getItem(RAW_BACKUP_V1_STORAGE_KEY)).toBe(v1Data);

      // Deuxième tentative avec un payload différent : ne doit pas écraser !
      const v1Tampered = JSON.stringify({ schemaVersion: 1, test: 'v1_tampered' });
      expect(ensureRawBackupWritten(1, v1Tampered)).toBe(true);
      expect(window.localStorage.getItem(RAW_BACKUP_V1_STORAGE_KEY)).toBe(v1Data);

      // Sauvegarde brute V2
      const v2Data = JSON.stringify({ schemaVersion: 2, test: 'v2_original' });
      expect(ensureRawBackupWritten(2, v2Data)).toBe(true);
      expect(window.localStorage.getItem(RAW_BACKUP_V2_STORAGE_KEY)).toBe(v2Data);
    });

    it("bascule en persistenceDisabled si la relecture de la sauvegarde brute échoue", () => {
      // Simule un échec de relecture (getItem renvoie null pour la clé de backup)
      const originalGetItem = Storage.prototype.getItem;
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key: string) {
        if (key === RAW_BACKUP_V2_STORAGE_KEY) {
          return null; // Échec de vérification
        }
        return originalGetItem.call(this, key);
      });

      const rawV2 = {
        schemaVersion: 2,
        completedStepsByDay: { 1: ['concept'] },
      };

      const result = migrateV2ToV3(rawV2, JSON.stringify(rawV2));
      expect(result.persistenceDisabled).toBe(true);
      // N'a pas pollué la clé principale
      expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe('Migration V2 -> V3', () => {
    it('migre les étapes complétées de StepType vers les identifiants réels sans ambiguïté', () => {
      const rawV2 = {
        schemaVersion: 2,
        activeRoute: { kind: 'course', courseId: 'module-01', dayNumber: 1 },
        activeStepByDay: {
          1: 'prompt',
        },
        completedStepsByDay: {
          1: ['concept', 'prompt'],
          5: ['concept'],
        },
        exerciseAnswers: {
          'day01-deliverable-a': 'Mon analyse d expertise',
        },
        profile: {
          studentName: 'Alexandre',
          vibeConfirmed: true,
        },
      };

      const migrated = migrateV2ToV3(rawV2, JSON.stringify(rawV2));

      expect(migrated.schemaVersion).toBe(3);
      expect(migrated.profile.studentName).toBe('Alexandre');
      expect(migrated.profile.vibeConfirmed).toBe(true);
      expect(migrated.exerciseAnswers['day01-deliverable-a']).toBe('Mon analyse d expertise');

      // Jour 1 : 'concept' -> 'day-01-step-1', 'prompt' -> 'day-01-step-2'
      expect(migrated.completedStepIdsByDay[1]).toEqual(['day-01-step-1', 'day-01-step-2']);
      expect(migrated.activeStepIdByDay[1]).toBe('day-01-step-2');

      // Jour 5 : 'concept' -> 'day-05-step-1'
      expect(migrated.completedStepIdsByDay[5]).toEqual(['day-05-step-1']);

      // Dossier initialisé proprement
      expect(migrated.dossier).toBeDefined();
      expect(migrated.dossier.version).toBe(1);
    });

    it('archive dans legacyArchive toute étape non appariée sans suppression silencieuse', () => {
      const rawV2 = {
        schemaVersion: 2,
        completedStepsByDay: {
          1: ['concept', 'unknown-future-step'],
          99: ['concept'], // Jour inexistant
        },
      };

      const migrated = migrateV2ToV3(rawV2, JSON.stringify(rawV2));

      // L'étape valide est migrée
      expect(migrated.completedStepIdsByDay[1]).toEqual(['day-01-step-1']);

      // Les données inconnues sont archivées
      expect(migrated.legacyArchive).toBeDefined();
      const archive = migrated.legacyArchive as Record<string, unknown>;
      expect(archive.migratedToSchemaVersion).toBe(3);
      expect(archive.completedStepsByDay).toBeDefined();
    });
  });

  describe('Migration V1 -> V3', () => {
    it('exécute la chaîne 1 -> 2 -> 3 complète sans perte', () => {
      const rawV1 = {
        schemaVersion: 1,
        activeRoute: { kind: 'course', courseId: 'module-01', dayNumber: 2 },
        completedStepsByDay: {
          1: ['concept', 'prompt', 'example', 'your-turn'],
        },
        exerciseAnswers: {
          'day01-deliverable-a': 'Valeur V1',
        },
        profile: {
          studentName: 'Élève V1',
        },
      };

      const migrated = migrateV1ToV3(rawV1, JSON.stringify(rawV1));
      expect(migrated.schemaVersion).toBe(3);
      expect(migrated.profile.studentName).toBe('Élève V1');
      expect(migrated.exerciseAnswers['day01-deliverable-a']).toBe('Valeur V1');
      expect(migrated.completedStepIdsByDay[1]).toEqual([
        'day-01-step-1',
        'day-01-step-2',
        'day-01-step-3',
        'day-01-step-4',
      ]);
      expect(window.localStorage.getItem(RAW_BACKUP_V1_STORAGE_KEY)).not.toBeNull();
    });
  });

  describe('Gestion du JSON corrompu & tolérance aux pannes', () => {
    it('isole le JSON corrompu sous la clé dédiée et active persistenceDisabled sans écraser la clé principale', () => {
      const corruptedJson = '{"schemaVersion": 2, malformed JSON';
      window.localStorage.setItem(STORAGE_KEY, corruptedJson);

      const loaded = loadProgressFromStorage();
      expect(loaded.persistenceDisabled).toBe(true);
      expect(loaded.schemaVersion).toBe(3);

      // La sauvegarde corrompue a été isolée
      expect(window.localStorage.getItem(CORRUPTED_BACKUP_STORAGE_KEY)).toBe(corruptedJson);

      // La clé principale n'a pas été écrasée
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(corruptedJson);

      // Tentative d'écriture en mode persistenceDisabled : bloquée
      expect(saveProgressToStorage(loaded)).toBe(false);
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(corruptedJson);
    });

    it('gère gracieusement le mode privé ou les exceptions de quota localStorage', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const progress = createInitialProgress();
      expect(saveProgressToStorage(progress)).toBe(false); // N'a pas levé d'exception non capturée
    });
  });

  describe('Export et Import JSON V3', () => {
    it('exporte et importe fidèlement un état v3 avec dossier', () => {
      const original = createInitialProgress();
      original.profile.studentName = 'Sophie';
      original.completedStepIdsByDay[1] = ['day-01-step-1'];
      original.dossier.fields.buyerProfile = {
        value: 'Solopreneurs créatifs',
        status: 'valid',
        updatedAt: new Date().toISOString(),
      };

      const exported = exportProgressJson(original);
      const imported = importProgressJson(exported);

      expect(imported).not.toBeNull();
      expect(imported?.profile.studentName).toBe('Sophie');
      expect(imported?.completedStepIdsByDay[1]).toEqual(['day-01-step-1']);
      expect(imported?.dossier.fields.buyerProfile.value).toBe('Solopreneurs créatifs');
    });
  });
});
