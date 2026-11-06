import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CORRUPTED_BACKUP_STORAGE_KEY,
  createInitialProgress,
  CURRICULUM_MODEL,
  CURRENT_SCHEMA_VERSION,
  ensureRawBackupWritten,
  ensureUnrecognizedBackupWritten,
  exportProgressJson,
  importProgressJson,
  loadProgressFromStorage,
  migrateV1ToV4,
  migrateV2ToV4,
  migrateV3ToV4,
  RAW_BACKUP_V1_STORAGE_KEY,
  RAW_BACKUP_V2_STORAGE_KEY,
  RAW_BACKUP_V3_STORAGE_KEY,
  RAW_BACKUP_V4_INCOMPATIBLE_STORAGE_KEY,
  safeResetActiveRouteToHome,
  UNRECOGNIZED_BACKUP_STORAGE_KEY,
  saveProgressToStorage,
  STORAGE_KEY,
} from '../utils/storage';

describe('Persistance V4 (3m-3d-7l) & Chaîne de migration résiliente V1/V2/V3 -> V4', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Sauvegardes brutes versionnées & Protection contre l écrasement (Mission 02-D)', () => {
    it('1. Sauvegarde absente : écrit et vérifie par relecture strictement identique (résultat true)', () => {
      const v1Data = JSON.stringify({ schemaVersion: 1, test: 'v1_clean' });
      expect(ensureRawBackupWritten(1, v1Data)).toBe(true);
      expect(window.localStorage.getItem(RAW_BACKUP_V1_STORAGE_KEY)).toBe(v1Data);
    });

    it('2. Sauvegarde déjà présente avec le même payload : résultat true', () => {
      const v2Data = JSON.stringify({ schemaVersion: 2, test: 'v2_identical' });
      expect(ensureRawBackupWritten(2, v2Data)).toBe(true);
      expect(ensureRawBackupWritten(2, v2Data)).toBe(true);
      expect(window.localStorage.getItem(RAW_BACKUP_V2_STORAGE_KEY)).toBe(v2Data);
    });

    it('3 & 4. Sauvegarde déjà présente avec un payload différent : résultat false et contenu strictement préservé', () => {
      const v1Original = JSON.stringify({ schemaVersion: 1, test: 'v1_original_untouched' });
      expect(ensureRawBackupWritten(1, v1Original)).toBe(true);

      const v1Different = JSON.stringify({ schemaVersion: 1, test: 'v1_different_tampered' });
      expect(ensureRawBackupWritten(1, v1Different)).toBe(false);
      // La sauvegarde originale n'a jamais été remplacée
      expect(window.localStorage.getItem(RAW_BACKUP_V1_STORAGE_KEY)).toBe(v1Original);
    });

    it('applique le même principe strict de non-écrasement à ensureUnrecognizedBackupWritten', () => {
      const unrecOriginal = JSON.stringify({ randomField: 'first_unrecognized' });
      expect(ensureUnrecognizedBackupWritten(unrecOriginal)).toBe(true);
      expect(window.localStorage.getItem(UNRECOGNIZED_BACKUP_STORAGE_KEY)).toBe(unrecOriginal);

      // Même payload : true
      expect(ensureUnrecognizedBackupWritten(unrecOriginal)).toBe(true);

      // Payload différent : false et sauvegarde originale préservée
      const unrecDifferent = JSON.stringify({ randomField: 'second_different_unrecognized' });
      expect(ensureUnrecognizedBackupWritten(unrecDifferent)).toBe(false);
      expect(window.localStorage.getItem(UNRECOGNIZED_BACKUP_STORAGE_KEY)).toBe(unrecOriginal);
    });

    it('5. Migration V3 avec une ancienne sauvegarde V3 différente du payload courant : persistenceDisabled = true et STORAGE_KEY inchangé', () => {
      const ancientV3Backup = JSON.stringify({
        schemaVersion: 3,
        marker: 'ANCIENT_V3_SAVED_BACKUP',
      });
      window.localStorage.setItem(RAW_BACKUP_V3_STORAGE_KEY, ancientV3Backup);

      const currentV3State = {
        schemaVersion: 3,
        completedStepIdsByDay: { 1: ['day-01-step-1'] },
        profile: { studentName: 'Apprenant V3 Actuel' },
      };
      const currentSerialized = JSON.stringify(currentV3State);
      window.localStorage.setItem(STORAGE_KEY, currentSerialized);

      const loaded = loadProgressFromStorage();
      expect(loaded.persistenceDisabled).toBe(true);
      // Le stockage principal n'est JAMAIS remplacé par l'état migré
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(currentSerialized);
      // L'ancienne sauvegarde est strictement préservée
      expect(window.localStorage.getItem(RAW_BACKUP_V3_STORAGE_KEY)).toBe(ancientV3Backup);
    });

    it('6. Migration V4 incompatible avec une sauvegarde V4 différente du payload courant : persistenceDisabled = true et STORAGE_KEY inchangé', () => {
      const ancientV4IncompatibleBackup = JSON.stringify({
        schemaVersion: 4,
        curriculumModel: 'incompatible-alpha',
        marker: 'ANCIENT_V4_INCOMPATIBLE_BACKUP',
      });
      window.localStorage.setItem(
        RAW_BACKUP_V4_INCOMPATIBLE_STORAGE_KEY,
        ancientV4IncompatibleBackup
      );

      const currentIncompatibleV4 = {
        schemaVersion: 4,
        curriculumModel: 'incompatible-beta',
        profile: { studentName: 'Apprenant Incompatible Courant' },
      };
      const currentSerialized = JSON.stringify(currentIncompatibleV4);
      window.localStorage.setItem(STORAGE_KEY, currentSerialized);

      const loaded = loadProgressFromStorage();
      expect(loaded.persistenceDisabled).toBe(true);
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(currentSerialized);
      expect(window.localStorage.getItem(RAW_BACKUP_V4_INCOMPATIBLE_STORAGE_KEY)).toBe(
        ancientV4IncompatibleBackup
      );
    });

    it('7. Échec de relecture : aucune écriture de l état migré dans STORAGE_KEY et passage en persistenceDisabled', () => {
      const originalGetItem = Storage.prototype.getItem;
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (
        this: Storage,
        key: string
      ) {
        if (key === RAW_BACKUP_V3_STORAGE_KEY) {
          return null; // simule un échec de relecture
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

    it('rejette l import d un JSON avec un schemaVersion inconnu sans modifier l état courant', () => {
      const unknownJson = JSON.stringify({
        schemaVersion: 99,
        profile: { studentName: 'Pirate' },
      });
      expect(importProgressJson(unknownJson)).toBeNull();
    });

    it('rejette l import d un JSON à racine invalide (tableau ou primitif)', () => {
      expect(importProgressJson(JSON.stringify(['element-1']))).toBeNull();
      expect(importProgressJson(JSON.stringify('simple-string'))).toBeNull();
    });
  });

  describe('Mission 02-C : États non reconnus & Migration V4 incompatible', () => {
    it('isole un JSON valide avec schemaVersion inconnue sous UNRECOGNIZED_BACKUP sans écraser STORAGE_KEY et avec persistenceDisabled', () => {
      const unknownSchemaJson = JSON.stringify({
        schemaVersion: 99,
        curriculumModel: 'future-curriculum',
        completedStepIdsByLesson: { 'lesson-01': ['step-1'] },
        profile: { studentName: 'Voyageur du Futur' },
      });
      window.localStorage.setItem(STORAGE_KEY, unknownSchemaJson);

      const loaded = loadProgressFromStorage();
      expect(loaded.persistenceDisabled).toBe(true);
      expect(loaded.schemaVersion).toBe(4);
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(unknownSchemaJson);
      expect(window.localStorage.getItem(UNRECOGNIZED_BACKUP_STORAGE_KEY)).toBe(unknownSchemaJson);
      expect(saveProgressToStorage(loaded)).toBe(false);
    });

    it('isole un JSON valide dont la structure racine est un tableau ou un primitif avec persistenceDisabled', () => {
      const arrayJson = JSON.stringify([{ id: 'unrecognized-array' }]);
      window.localStorage.setItem(STORAGE_KEY, arrayJson);

      const loaded = loadProgressFromStorage();
      expect(loaded.persistenceDisabled).toBe(true);
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(arrayJson);
      expect(window.localStorage.getItem(UNRECOGNIZED_BACKUP_STORAGE_KEY)).toBe(arrayJson);
      expect(saveProgressToStorage(loaded)).toBe(false);
    });

    it('migre un état V4 à modèle incompatible sans jamais le classifier en V3 et archive les validations par leçon', () => {
      const incompatibleV4 = {
        schemaVersion: 4,
        curriculumModel: 'incompatible-legacy-model',
        activeRoute: { kind: 'lesson', lessonId: 'lesson-08' },
        activeStepIdByLesson: { 'lesson-08': 'step-2' },
        completedStepIdsByLesson: {
          'lesson-01': ['old-step-1', 'old-step-2'],
          'lesson-08': ['step-1'],
        },
        profile: { studentName: 'Apprenant V4 Incompatible' },
      };
      const serialized = JSON.stringify(incompatibleV4);
      window.localStorage.setItem(STORAGE_KEY, serialized);

      const loaded = loadProgressFromStorage();
      expect(loaded.schemaVersion).toBe(4);
      expect(loaded.curriculumModel).toBe('3m-3d-7l');
      expect(loaded.completedStepIdsByLesson).toEqual({});
      expect(loaded.activeStepIdByLesson).toEqual({});
      expect(loaded.profile.studentName).toBe('Apprenant V4 Incompatible');

      // Classification rigoureuse V4 (jamais présentée comme V3)
      expect(loaded.legacyArchive?.migratedFromSchemaVersion).toBe(4);
      expect(loaded.legacyArchive?.incompatibleCurriculumModel).toBe('incompatible-legacy-model');
      expect(loaded.legacyArchive?.completedStepIdsByLesson).toEqual({
        'lesson-01': ['old-step-1', 'old-step-2'],
        'lesson-08': ['step-1'],
      });
      expect(loaded.legacyArchive?.activeStepIdByLesson).toEqual({ 'lesson-08': 'step-2' });

      // Sauvegarde brute vérifiée sous la clé dédiée
      expect(window.localStorage.getItem(RAW_BACKUP_V4_INCOMPATIBLE_STORAGE_KEY)).toBe(serialized);
    });

    it('active persistenceDisabled et préserve STORAGE_KEY si la sauvegarde brute V4 incompatible échoue', () => {
      const originalGetItem = Storage.prototype.getItem;
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (
        this: Storage,
        key: string
      ) {
        if (key === RAW_BACKUP_V4_INCOMPATIBLE_STORAGE_KEY) {
          return null; // simule un échec de relecture
        }
        return originalGetItem.call(this, key);
      });

      const incompatibleV4 = {
        schemaVersion: 4,
        curriculumModel: 'broken-model',
        profile: { studentName: 'Test Quota' },
      };
      const serialized = JSON.stringify(incompatibleV4);
      window.localStorage.setItem(STORAGE_KEY, serialized);

      const result = loadProgressFromStorage();
      expect(result.persistenceDisabled).toBe(true);
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(serialized);
    });
  });

  describe('Sécurisation de la récupération ErrorBoundary & App : safeResetActiveRouteToHome (Mission 02-D)', () => {
    it('1. V4 compatible : ramène activeRoute à home et préserve strictement toutes les validations, profil et réponses', () => {
      const validV4State = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        curriculumModel: CURRICULUM_MODEL,
        activeRoute: { kind: 'lesson', lessonId: 'lesson-04' },
        activeStepIdByLesson: { 'lesson-04': 'step-2' },
        completedStepIdsByLesson: {
          'lesson-01': ['s1', 's2'],
          'lesson-02': ['s1'],
        },
        exerciseAnswers: { 'block-ex-1': 'Réponse intacte' },
        checklistAnswers: { 'block-chk-1': { item1: true } },
        quizStates: { 'block-quiz-1': { score: 10, passed: true } },
        savedPrompts: { 'prompt-1': 'Prompt sauvegardé' },
        profile: {
          studentName: 'Élève Assidu',
          business: 'Formation Continue',
          vibeConfirmed: true,
        },
        legacyArchive: { previous: 'data' },
      };

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validV4State));

      const success = safeResetActiveRouteToHome();
      expect(success).toBe(true);

      const updated = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}');
      expect(updated.activeRoute).toEqual({ kind: 'home' });
      // Toutes les autres données sont rigoureusement intactes
      expect(updated.completedStepIdsByLesson).toEqual(validV4State.completedStepIdsByLesson);
      expect(updated.activeStepIdByLesson).toEqual(validV4State.activeStepIdByLesson);
      expect(updated.exerciseAnswers).toEqual(validV4State.exerciseAnswers);
      expect(updated.checklistAnswers).toEqual(validV4State.checklistAnswers);
      expect(updated.quizStates).toEqual(validV4State.quizStates);
      expect(updated.savedPrompts).toEqual(validV4State.savedPrompts);
      expect(updated.profile).toEqual(validV4State.profile);
      expect(updated.legacyArchive).toEqual(validV4State.legacyArchive);
    });

    it('2. V4 avec persistenceDisabled = true : refuse toute écriture et retourne false', () => {
      const protectedV4State = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        curriculumModel: CURRICULUM_MODEL,
        persistenceDisabled: true,
        activeRoute: { kind: 'lesson', lessonId: 'lesson-03' },
        profile: { studentName: 'Profil Protégé' },
      };
      const serialized = JSON.stringify(protectedV4State);
      window.localStorage.setItem(STORAGE_KEY, serialized);

      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      const success = safeResetActiveRouteToHome();
      expect(success).toBe(false);
      expect(setItemSpy).not.toHaveBeenCalled();
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(serialized);
    });

    it('3. V4 avec curriculumModel incompatible : refuse toute écriture et retourne false', () => {
      const incompatibleModelV4 = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        curriculumModel: 'incompatible-legacy-curriculum',
        activeRoute: { kind: 'day', dayNumber: 5 },
      };
      const serialized = JSON.stringify(incompatibleModelV4);
      window.localStorage.setItem(STORAGE_KEY, serialized);

      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      const success = safeResetActiveRouteToHome();
      expect(success).toBe(false);
      expect(setItemSpy).not.toHaveBeenCalled();
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(serialized);
    });

    it('4. Schéma inconnu (ex: schemaVersion = 99) : refuse toute écriture et retourne false', () => {
      const unknownSchema = {
        schemaVersion: 99,
        curriculumModel: CURRICULUM_MODEL,
        activeRoute: { kind: 'unknown' },
      };
      const serialized = JSON.stringify(unknownSchema);
      window.localStorage.setItem(STORAGE_KEY, serialized);

      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      const success = safeResetActiveRouteToHome();
      expect(success).toBe(false);
      expect(setItemSpy).not.toHaveBeenCalled();
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(serialized);
    });

    it('5. JSON corrompu : n effectue aucune modification et retourne false', () => {
      const corruptedJson = '{"schemaVersion": 4, "broken: json...';
      window.localStorage.setItem(STORAGE_KEY, corruptedJson);

      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      const success = safeResetActiveRouteToHome();
      expect(success).toBe(false);
      expect(setItemSpy).not.toHaveBeenCalled();
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(corruptedJson);
    });

    it('6. Route déjà à l accueil : évite toute réécriture inutile (setItem non appelé) et retourne true', () => {
      const alreadyHomeState = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        curriculumModel: CURRICULUM_MODEL,
        activeRoute: { kind: 'home' },
        profile: { studentName: 'Déjà Accueil' },
      };
      const serialized = JSON.stringify(alreadyHomeState);
      window.localStorage.setItem(STORAGE_KEY, serialized);

      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      const success = safeResetActiveRouteToHome();
      expect(success).toBe(true);
      // Aucune réécriture superflue
      expect(setItemSpy).not.toHaveBeenCalled();
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(serialized);
    });

    it('7. Racine invalide (tableau ou primitive) ou stockage vide : retourne false sans crash', () => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['array_root']));
      expect(safeResetActiveRouteToHome()).toBe(false);

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify('string_root'));
      expect(safeResetActiveRouteToHome()).toBe(false);

      window.localStorage.removeItem(STORAGE_KEY);
      expect(safeResetActiveRouteToHome()).toBe(false);
    });
  });
});
