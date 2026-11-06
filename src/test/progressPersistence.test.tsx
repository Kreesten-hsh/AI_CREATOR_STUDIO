import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { useProgress } from '../hooks/useProgress';
import {
  STORAGE_KEY,
  V1_BACKUP_STORAGE_KEY,
  RAW_BACKUP_V2_STORAGE_KEY,
  RAW_BACKUP_V3_STORAGE_KEY,
  CURRENT_SCHEMA_VERSION,
  CURRICULUM_MODEL,
  STUDIO_LEGACY_BRAND_STYLE,
  loadProgressFromStorage,
} from '../utils/storage';
import type { QuizAttemptState } from '../types/course';

describe('V4 : Student Progress, State Persistence & V1/V2/V3 -> V4 Migration Suite', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  function StateConsumer({
    onState,
  }: {
    onState: (value: ReturnType<typeof useProgress>) => void;
  }) {
    const progress = useProgress();
    onState(progress);
    return null;
  }

  // =========================================================================
  // SECTION A : Persistance courante V4
  // =========================================================================
  it('1. persiste et restaure fidèlement les réponses aux exercices textuels en V4', () => {
    let capturedProgress!: ReturnType<typeof useProgress>;

    const { unmount } = render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (capturedProgress = p)} />
      </ProgressProvider>
    );

    act(() => {
      capturedProgress.saveExerciseAnswer('lesson02-exercise-choice', 'Interaction retenue');
    });

    unmount();

    const rawStorage = window.localStorage.getItem(STORAGE_KEY);
    expect(rawStorage).not.toBeNull();
    const parsed = JSON.parse(rawStorage!);
    expect(parsed.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(parsed.schemaVersion).toBe(4);
    expect(parsed.curriculumModel).toBe(CURRICULUM_MODEL);
    expect(parsed.exerciseAnswers['lesson02-exercise-choice']).toBe('Interaction retenue');

    let restoredProgress!: ReturnType<typeof useProgress>;
    render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (restoredProgress = p)} />
      </ProgressProvider>
    );

    expect(restoredProgress.state.exerciseAnswers['lesson02-exercise-choice']).toBe(
      'Interaction retenue'
    );
  });

  it('2. persiste et restaure les validations de checklists, quiz, prompts et profil en V4', () => {
    let capturedProgress!: ReturnType<typeof useProgress>;

    const { unmount } = render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (capturedProgress = p)} />
      </ProgressProvider>
    );

    const quizAttempt: QuizAttemptState = {
      answers: { q1: 1, q2: 0 },
      submitted: true,
      score: 2,
      total: 2,
    };

    act(() => {
      capturedProgress.toggleChecklistItem('lesson04-checklist-v1', 'chk-l04-standalone');
      capturedProgress.saveQuizAttempt('lesson01-quiz', quizAttempt);
      capturedProgress.saveCustomPromptInput(
        'lesson01-master-prompt',
        'business',
        'Cabinet Comptable PME'
      );
      capturedProgress.updateProfileField('studentName', 'Camille');
      capturedProgress.updateProfileField('business', 'Studio Vélo');
      capturedProgress.updateVibeSelection(
        {
          paletteId: 'slate-emerald',
          styleId: 'clean-modern-cards',
          typographyId: 'inter-system',
        },
        'Ardoise & Émeraude'
      );
      capturedProgress.updateCustomVariable('customNicheKey', 'B2B Playbook');
    });

    unmount();

    let restoredProgress!: ReturnType<typeof useProgress>;
    render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (restoredProgress = p)} />
      </ProgressProvider>
    );

    expect(
      restoredProgress.state.checklistAnswers['lesson04-checklist-v1']?.['chk-l04-standalone']
    ).toBe(true);
    expect(restoredProgress.state.quizStates['lesson01-quiz']).toEqual(quizAttempt);
    expect(
      restoredProgress.state.customPromptInputs['lesson01-master-prompt']?.['business']
    ).toBe('Cabinet Comptable PME');
    expect(restoredProgress.state.profile.studentName).toBe('Camille');
    expect(restoredProgress.state.profile.business).toBe('Studio Vélo');
    expect(restoredProgress.state.profile.brandStyle).toBe('Ardoise & Émeraude');
    expect(restoredProgress.state.profile.customVariables['customNicheKey']).toBe('B2B Playbook');
  });

  // =========================================================================
  // SECTION B : Scénarios de migration V1 / V2 / V3 -> V4 sans conversion fictive
  // =========================================================================
  describe('Scénarios de migration LocalStorage vers V4 (3m-3d-7l)', () => {
    it('Scénario 1 : Stockage V1 valide (sauvegarde brute V1, profil préservé, anciennes validations archivées dans legacyArchive sans conversion fictive vers les 7 leçons)', () => {
      const validV1State = {
        schemaVersion: 1,
        activeRoute: {
          kind: 'course',
          courseId: 'course-01',
          dayNumber: 2,
        },
        completedStepsByDay: {
          1: ['concept', 'prompt', 'example', 'your-turn'],
          2: ['concept', 'prompt'],
        },
        exerciseAnswers: {
          'day01-deliverable-a': 'Matière brute conservée du Jour 01',
        },
        profile: {
          studentName: 'Dr. Valérie',
          business: 'Cabinet Santé Préventive',
          brandStyle: STUDIO_LEGACY_BRAND_STYLE,
          vibe: {
            paletteId: 'editorial-brique',
            styleId: 'neo-brutalist-print',
            typographyId: 'archivo-instrument',
          },
          customVariables: {
            specialite: 'Cardiologie',
          },
        },
      };

      const rawSerialized = JSON.stringify(validV1State);
      window.localStorage.setItem(STORAGE_KEY, rawSerialized);

      const migrated = loadProgressFromStorage();

      // 1. Sauvegarde V1 intacte
      expect(window.localStorage.getItem(V1_BACKUP_STORAGE_KEY)).toBe(rawSerialized);

      // 2. Schéma passé en V4 (3m-3d-7l) et route ramenée à l'accueil
      expect(migrated.schemaVersion).toBe(4);
      expect(migrated.curriculumModel).toBe('3m-3d-7l');
      expect(migrated.activeRoute).toEqual({ kind: 'home' });

      // 3. Aucune validation fictive sur les 7 nouvelles leçons
      expect(migrated.completedStepIdsByLesson).toEqual({});

      // 4. Profil préservé et charte par défaut du Studio neutralisée
      expect(migrated.profile.studentName).toBe('Dr. Valérie');
      expect(migrated.profile.business).toBe('Cabinet Santé Préventive');
      expect(migrated.profile.brandStyle).toBe('');
      expect(migrated.profile.vibe.paletteId).toBe('slate-emerald');
      expect(migrated.profile.customVariables['specialite']).toBe('Cardiologie');

      // 5. Isolation dans legacyArchive
      expect(migrated.legacyArchive).toBeDefined();
      expect(migrated.legacyArchive?.migratedFromSchemaVersion).toBe(1);
      expect(migrated.legacyArchive?.migratedToSchemaVersion).toBe(4);
      expect(migrated.legacyArchive?.archivedStudioBrandStyle).toBe(STUDIO_LEGACY_BRAND_STYLE);
    });

    it('Scénario 2 : Stockage V3 valide (sauvegarde brute V3, archivage de completedStepIdsByDay dans legacyArchive et remise à 0 % des 7 nouvelles leçons)', () => {
      const validV3State = {
        schemaVersion: 3,
        activeRoute: { kind: 'course', courseId: 'module-02', dayNumber: 5 },
        completedStepIdsByDay: {
          1: ['day-01-step-1', 'day-01-step-2', 'day-01-step-3', 'day-01-step-4'],
          5: ['day-05-step-1', 'day-05-step-2', 'day-05-step-3'],
        },
        activeStepIdByDay: { 5: 'day-05-step-2' },
        exerciseAnswers: { 'day05-ex': 'Mon code HTML' },
        profile: {
          studentName: 'Koffi',
          business: 'Formation Fiscalité',
          brandStyle: 'Cobalt & Papier',
        },
      };

      const rawSerialized = JSON.stringify(validV3State);
      window.localStorage.setItem(STORAGE_KEY, rawSerialized);

      const migrated = loadProgressFromStorage();

      expect(window.localStorage.getItem(RAW_BACKUP_V3_STORAGE_KEY)).toBe(rawSerialized);
      expect(migrated.schemaVersion).toBe(4);
      expect(migrated.curriculumModel).toBe('3m-3d-7l');
      expect(migrated.activeRoute).toEqual({ kind: 'home' });
      expect(migrated.completedStepIdsByLesson).toEqual({});
      expect(migrated.profile.studentName).toBe('Koffi');
      expect(migrated.legacyArchive?.migratedFromSchemaVersion).toBe(3);
      expect(migrated.legacyArchive?.completedStepIdsByDay).toEqual(
        validV3State.completedStepIdsByDay
      );
    });

    it('Scénario 3 : Stockage corrompu (repli propre en V4 avec persistenceDisabled: true)', () => {
      window.localStorage.setItem(STORAGE_KEY, '{corrupted_json_payload');
      const recovered = loadProgressFromStorage();
      expect(recovered.schemaVersion).toBe(4);
      expect(recovered.persistenceDisabled).toBe(true);
      expect(recovered.activeRoute).toEqual({ kind: 'home' });
    });

    it('Scénario 4 : Sauvegardes brutes V1/V2/V3 déjà existantes ne sont jamais écrasées', () => {
      const originalBackupPayload = JSON.stringify({
        schemaVersion: 3,
        marker: 'ORIGINAL_UNTOUCHED_V3_BACKUP',
      });
      window.localStorage.setItem(RAW_BACKUP_V3_STORAGE_KEY, originalBackupPayload);

      const newerV3State = {
        schemaVersion: 3,
        activeRoute: { kind: 'day', dayNumber: 7 },
        profile: { studentName: 'Nadia' },
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newerV3State));

      const migrated = loadProgressFromStorage();
      expect(migrated.schemaVersion).toBe(4);
      expect(migrated.profile.studentName).toBe('Nadia');
      expect(window.localStorage.getItem(RAW_BACKUP_V3_STORAGE_KEY)).toBe(originalBackupPayload);
    });

    it('Scénario 5 : Stockage vide initialise directement en schemaVersion 4 sans créer de backup inutile', () => {
      window.localStorage.clear();
      const fresh = loadProgressFromStorage();
      expect(fresh.schemaVersion).toBe(4);
      expect(fresh.curriculumModel).toBe('3m-3d-7l');
      expect(fresh.activeRoute).toEqual({ kind: 'home' });
      expect(window.localStorage.getItem(V1_BACKUP_STORAGE_KEY)).toBeNull();
      expect(window.localStorage.getItem(RAW_BACKUP_V2_STORAGE_KEY)).toBeNull();
      expect(window.localStorage.getItem(RAW_BACKUP_V3_STORAGE_KEY)).toBeNull();
    });

    it("Scénario 6 : QuotaExceededError lors de la sauvegarde de migration préserve les anciennes données dans STORAGE_KEY et retourne l'état V4 en mémoire avec persistenceDisabled: true", () => {
      const v3Data = {
        schemaVersion: 3,
        activeRoute: { kind: 'bonus', bonusId: 'bonus-01' },
        completedStepIdsByDay: { 1: ['day-01-step-1'] },
        profile: {
          studentName: 'Amina',
          business: 'Coaching Carrière',
        },
      };
      const rawV3 = JSON.stringify(v3Data);
      window.localStorage.setItem(STORAGE_KEY, rawV3);

      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      });

      expect(() => loadProgressFromStorage()).not.toThrow();
      const inMemoryMigrated = loadProgressFromStorage();
      expect(inMemoryMigrated.schemaVersion).toBe(4);
      expect(inMemoryMigrated.persistenceDisabled).toBe(true);
      expect(inMemoryMigrated.activeRoute).toEqual({
        kind: 'bonus',
        bonusId: 'bonus-manychat',
      });
      expect(inMemoryMigrated.profile.studentName).toBe('Amina');
      // Les anciennes données n'ont pas été écrasées
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(rawV3);
    });
  });
});
