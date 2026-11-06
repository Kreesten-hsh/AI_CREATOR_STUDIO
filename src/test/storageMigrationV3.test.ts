import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CORRUPTED_BACKUP_STORAGE_KEY,
  createInitialProgress,
  ensureRawBackupWritten,
  exportProgressJson,
  importProgressJson,
  loadProgressFromStorage,
  migrateV1ToV4,
  migrateV2ToV4,
  migrateV3ToV4,
  RAW_BACKUP_V1_STORAGE_KEY,
  RAW_BACKUP_V2_STORAGE_KEY,
  RAW_BACKUP_V3_STORAGE_KEY,
  saveProgressToStorage,
  STORAGE_KEY,
} from '../utils/storage';

describe('Persistance V4 (3m-3d-7l) & Chaîne de migration résiliente V1/V2/V3 -> V4', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Sauvegardes brutes versionnées (V1, V2, V3)', () => {
    it('écrit et vérifie par relecture les sauvegardes brutes V1, V2 et V3 sans jamais les écraser', () => {
      const v1Data = JSON.stringify({ schemaVersion: 1, test: 'v1_original' });
      expect(ensureRawBackupWritten(1, v1Data)).toBe(true);
      expect(window.localStorage.getItem(RAW_BACKUP_V1_STORAGE_KEY)).toBe(v1Data);

      const v1Tampered = JSON.stringify({ schemaVersion: 1, test: 'v1_tampered' });
      expect(ensureRawBackupWritten(1, v1Tampered)).toBe(true);
      expect(window.localStorage.getItem(RAW_BACKUP_V1_STORAGE_KEY)).toBe(v1Data);

      const v2Data = JSON.stringify({ schemaVersion: 2, test: 'v2_original' });
      expect(ensureRawBackupWritten(2, v2Data)).toBe(true);
      expect(window.localStorage.getItem(RAW_BACKUP_V2_STORAGE_KEY)).toBe(v2Data);

      const v3Data = JSON.stringify({ schemaVersion: 3, test: 'v3_original' });
      expect(ensureRawBackupWritten(3, v3Data)).toBe(true);
      expect(window.localStorage.getItem(RAW_BACKUP_V3_STORAGE_KEY)).toBe(v3Data);
    });

    it('bascule en persistenceDisabled si la relecture de la sauvegarde brute V3 échoue et préserve STORAGE_KEY', () => {
      const originalGetItem = Storage.prototype.getItem;
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (
        this: Storage,
        key: string
      ) {
        if (key === RAW_BACKUP_V3_STORAGE_KEY) {
          return null;
        }
        return originalGetItem.call(this, key);
      });

      const rawV3 = {
        schemaVersion: 3,
        completedStepIdsByDay: { 1: ['day-01-step-1'] },
      };

      const result = migrateV3ToV4(rawV3, JSON.stringify(rawV3));
      expect(result.persistenceDisabled).toBe(true);
      expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe('Migrations V1 / V2 / V3 -> V4 sans conversion arbitraire', () => {
    it('archive les anciennes progressions V1, V2 et V3 dans legacyArchive sans valider artificiellement les 7 nouvelles leçons', () => {
      const rawV1 = {
        schemaVersion: 1,
        completedStepsByDay: { 1: ['concept', 'prompt'] },
        profile: { studentName: 'Élève V1' },
      };
      const migratedV1 = migrateV1ToV4(rawV1, JSON.stringify(rawV1));
      expect(migratedV1.schemaVersion).toBe(4);
      expect(migratedV1.curriculumModel).toBe('3m-3d-7l');
      expect(migratedV1.completedStepIdsByLesson).toEqual({});
      expect(migratedV1.legacyArchive?.migratedFromSchemaVersion).toBe(1);

      const rawV2 = {
        schemaVersion: 2,
        completedStepsByDay: { 5: ['concept'] },
        profile: { studentName: 'Samira', vibeConfirmed: true },
      };
      const migratedV2 = migrateV2ToV4(rawV2, JSON.stringify(rawV2));
      expect(migratedV2.schemaVersion).toBe(4);
      expect(migratedV2.completedStepIdsByLesson).toEqual({});
      expect(migratedV2.profile.vibeConfirmed).toBe(true);
      expect(migratedV2.legacyArchive?.migratedFromSchemaVersion).toBe(2);

      const rawV3 = {
        schemaVersion: 3,
        completedStepIdsByDay: { 1: ['day-01-step-1', 'day-01-step-2'] },
        profile: { studentName: 'Lucas' },
      };
      const migratedV3 = migrateV3ToV4(rawV3, JSON.stringify(rawV3));
      expect(migratedV3.schemaVersion).toBe(4);
      expect(migratedV3.completedStepIdsByLesson).toEqual({});
      expect(migratedV3.legacyArchive?.migratedFromSchemaVersion).toBe(3);
      expect(migratedV3.legacyArchive?.completedStepIdsByDay).toEqual({
        1: ['day-01-step-1', 'day-01-step-2'],
      });
    });
  });

  describe('Gestion du JSON corrompu & tolérance aux pannes', () => {
    it('isole le JSON corrompu sous la clé dédiée et active persistenceDisabled sans écraser la clé principale', () => {
      const corruptedJson = '{"schemaVersion": 3, malformed JSON';
      window.localStorage.setItem(STORAGE_KEY, corruptedJson);

      const loaded = loadProgressFromStorage();
      expect(loaded.persistenceDisabled).toBe(true);
      expect(loaded.schemaVersion).toBe(4);

      expect(window.localStorage.getItem(CORRUPTED_BACKUP_STORAGE_KEY)).toBe(corruptedJson);
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(corruptedJson);
      expect(saveProgressToStorage(loaded)).toBe(false);
    });

    it('gère gracieusement les exceptions de quota localStorage', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const progress = createInitialProgress();
      expect(saveProgressToStorage(progress)).toBe(false);
    });
  });

  describe('Export et Import JSON (V4 et anciens exports V1/V2/V3)', () => {
    it('exporte et importe fidèlement un état V4', () => {
      const original = createInitialProgress();
      original.profile.studentName = 'Sophie';
      original.completedStepIdsByLesson['lesson-01'] = ['lesson-01-step-1'];

      const exported = exportProgressJson(original);
      const imported = importProgressJson(exported);

      expect(imported).not.toBeNull();
      expect(imported?.schemaVersion).toBe(4);
      expect(imported?.curriculumModel).toBe('3m-3d-7l');
      expect(imported?.profile.studentName).toBe('Sophie');
      expect(imported?.completedStepIdsByLesson['lesson-01']).toEqual(['lesson-01-step-1']);
    });

    it('applique les mêmes règles de migration V4 lors de l import JSON d une ancienne progression V3', () => {
      const oldV3Json = JSON.stringify({
        schemaVersion: 3,
        activeRoute: { kind: 'day', dayNumber: 8 },
        completedStepIdsByDay: { 8: ['day-08-step-1', 'day-08-step-2'] },
        profile: { studentName: 'Import V3' },
      });

      const imported = importProgressJson(oldV3Json);
      expect(imported).not.toBeNull();
      expect(imported?.schemaVersion).toBe(4);
      expect(imported?.curriculumModel).toBe('3m-3d-7l');
      expect(imported?.activeRoute).toEqual({ kind: 'home' });
      expect(imported?.completedStepIdsByLesson).toEqual({});
      expect(imported?.profile.studentName).toBe('Import V3');
      expect(imported?.legacyArchive?.migratedFromSchemaVersion).toBe(3);
    });
  });
});
