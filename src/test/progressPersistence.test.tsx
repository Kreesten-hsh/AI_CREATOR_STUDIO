import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { useProgress } from '../hooks/useProgress';
import {
  STORAGE_KEY,
  V1_BACKUP_STORAGE_KEY,
  CURRENT_SCHEMA_VERSION,
  STUDIO_LEGACY_BRAND_STYLE,
  loadProgressFromStorage,
} from '../utils/storage';
import type { QuizAttemptState } from '../types/course';

describe('V2 : Student Progress, State Persistence & Blinded V1->V2 Migration Suite', () => {
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
  // SECTION A : Persistance courante V2
  // =========================================================================
  it('1. persiste et restaure fidèlement les réponses aux exercices textuels en V2', () => {
    let capturedProgress!: ReturnType<typeof useProgress>;

    const { unmount } = render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (capturedProgress = p)} />
      </ProgressProvider>
    );

    act(() => {
      capturedProgress.saveExerciseAnswer('day04-exercise-product-spec', 'Spécification V1 prête');
    });

    unmount();

    const rawStorage = window.localStorage.getItem(STORAGE_KEY);
    expect(rawStorage).not.toBeNull();
    const parsed = JSON.parse(rawStorage!);
    expect(parsed.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(parsed.exerciseAnswers['day04-exercise-product-spec']).toBe('Spécification V1 prête');

    let restoredProgress!: ReturnType<typeof useProgress>;
    render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (restoredProgress = p)} />
      </ProgressProvider>
    );

    expect(restoredProgress.state.exerciseAnswers['day04-exercise-product-spec']).toBe(
      'Spécification V1 prête'
    );
  });

  it('2. persiste et restaure les validations de checklists, quiz, prompts et profil en V2', () => {
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
      capturedProgress.toggleChecklistItem('day05-checklist-build', 'chk-d05-standalone');
      capturedProgress.saveQuizAttempt('day01-step1-quiz', quizAttempt);
      capturedProgress.saveCustomPromptInput(
        'day01-step2-master-prompt',
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
      restoredProgress.state.checklistAnswers['day05-checklist-build']?.['chk-d05-standalone']
    ).toBe(true);
    expect(restoredProgress.state.quizStates['day01-step1-quiz']).toEqual(quizAttempt);
    expect(
      restoredProgress.state.customPromptInputs['day01-step2-master-prompt']?.['business']
    ).toBe('Cabinet Comptable PME');
    expect(restoredProgress.state.profile.studentName).toBe('Camille');
    expect(restoredProgress.state.profile.business).toBe('Studio Vélo');
    expect(restoredProgress.state.profile.brandStyle).toBe('Ardoise & Émeraude');
    expect(restoredProgress.state.profile.customVariables['customNicheKey']).toBe('B2B Playbook');
  });

  // =========================================================================
  // SECTION B : Les 7 scénarios obligatoires de migration LocalStorage V1 -> V2
  // =========================================================================
  describe('7 Scénarios obligatoires de migration LocalStorage (schemaVersion 1 -> 2)', () => {
    it('Scénario 1 : Stockage V1 valide (préserve leçons 1-3 & profil, neutralise le style Studio par défaut, isole jours 4-25 dans legacyArchive et écrit la sauvegarde V1)', () => {
      const validV1State = {
        schemaVersion: 1,
        activeRoute: {
          kind: 'course',
          courseId: 'course-01',
          dayNumber: 2,
        },
        activeStepByDay: {
          1: 'concept',
          2: 'prompt',
          16: 'example',
        },
        completedStartHereIds: ['introduction', 'obsolete-orientation'],
        completedStepsByDay: {
          1: ['concept', 'prompt', 'example', 'your-turn'],
          2: ['concept', 'prompt'],
          6: ['concept', 'prompt', 'example', 'your-turn'],
          16: ['concept'],
        },
        checklistAnswers: {
          'day01-step4-checklist': {
            'item-c1-audience': true,
            'chk-obsolete-item': true,
          },
          'chk-day-07-obsolete': {
            'item-1': true,
          },
        },
        exerciseAnswers: {
          'day01-deliverable-a': 'Matière brute conservée du Jour 01',
          'day02-deliverable-final-card': 'Fiche acheteur conservée du Jour 02',
          'day03-deliverable-c-positioning': 'Positionnement conservé du Jour 03',
          'exercise-day-06-obsolete': 'Ancien exercice du Jour 06 archivé sans perte',
        },
        quizStates: {
          'day01-step1-quiz': { answers: { q1: 2 }, submitted: true, score: 1, total: 4 },
          'quiz-day-06-obsolete': { answers: { q1: 1 }, submitted: true, score: 1, total: 1 },
        },
        savedPrompts: {
          'day01-step2-master-prompt': 'Prompt J01 personnalisé',
          'prompt-day-07-obsolete': 'Ancien prompt J07',
        },
        customPromptInputs: {
          'day02-step2-master-prompt': { business: 'Conseil RH' },
          'prompt-day-08-obsolete': { theme: 'Obsolete' },
        },
        profile: {
          studentName: 'Dr. Valérie',
          business: 'Cabinet Santé Préventive',
          targetAudience: 'Patients chroniques',
          productType: 'Carnet de suivi interactif',
          brandStyle: STUDIO_LEGACY_BRAND_STYLE,
          mainObjective: 'Lancer sur Chariow',
          vibe: {
            paletteId: 'editorial-brique',
            styleId: 'neo-brutalist-print',
            typographyId: 'archivo-instrument',
          },
          customVariables: {
            specialite: 'Cardiologie',
          },
        },
        lastUpdated: '2026-10-01T10:00:00.000Z',
      };

      const rawSerialized = JSON.stringify(validV1State);
      window.localStorage.setItem(STORAGE_KEY, rawSerialized);

      const migrated = loadProgressFromStorage();

      // 1. La sauvegarde V1 est créée et strictement identique au payload V1 d'origine
      expect(window.localStorage.getItem(V1_BACKUP_STORAGE_KEY)).toBe(rawSerialized);

      // 2. Schéma passé en V3 et route normalisée vers module-01 leçon 2
      expect(migrated.schemaVersion).toBe(3);
      expect(migrated.activeRoute).toEqual({
        kind: 'course',
        courseId: 'module-01',
        dayNumber: 2,
      });

      // 3. Leçons 1 à 3 et leurs exercices/checklists/quiz/prompts valides sont préservés
      expect(migrated.completedStepIdsByDay[1]).toEqual([
        'day-01-step-1',
        'day-01-step-2',
        'day-01-step-3',
        'day-01-step-4',
      ]);
      expect(migrated.completedStepIdsByDay[2]).toEqual(['day-02-step-1', 'day-02-step-2']);
      expect(migrated.completedStepIdsByDay[6]).toBeUndefined();
      expect(migrated.completedStepIdsByDay[16]).toBeUndefined();

      expect(migrated.exerciseAnswers['day01-deliverable-a']).toBe(
        'Matière brute conservée du Jour 01'
      );
      expect(migrated.exerciseAnswers['day02-deliverable-final-card']).toBe(
        'Fiche acheteur conservée du Jour 02'
      );
      expect(migrated.exerciseAnswers['day03-deliverable-c-positioning']).toBe(
        'Positionnement conservé du Jour 03'
      );
      expect(migrated.exerciseAnswers['exercise-day-06-obsolete']).toBeUndefined();

      expect(migrated.checklistAnswers['day01-step4-checklist']).toEqual({
        'item-c1-audience': true,
      });
      expect(migrated.quizStates['day01-step1-quiz']?.score).toBe(1);
      expect(migrated.savedPrompts['day01-step2-master-prompt']).toBe('Prompt J01 personnalisé');
      expect(migrated.customPromptInputs['day02-step2-master-prompt']?.business).toBe('Conseil RH');

      // 4. Profil préservé mais charte par défaut du Studio neutralisée
      expect(migrated.profile.studentName).toBe('Dr. Valérie');
      expect(migrated.profile.business).toBe('Cabinet Santé Préventive');
      expect(migrated.profile.brandStyle).toBe('');
      expect(migrated.profile.vibe.paletteId).toBe('slate-emerald');
      expect(migrated.profile.customVariables['specialite']).toBe('Cardiologie');

      // 5. Isolation dans legacyArchive sans suppression silencieuse
      expect(migrated.legacyArchive).toBeDefined();
      expect(migrated.legacyArchive?.migratedFromSchemaVersion).toBe(1);
      expect(migrated.legacyArchive?.archivedStudioBrandStyle).toBe(STUDIO_LEGACY_BRAND_STYLE);
      expect(
        (migrated.legacyArchive?.exerciseAnswers as Record<string, unknown>)?.[
          'exercise-day-06-obsolete'
        ]
      ).toBe('Ancien exercice du Jour 06 archivé sans perte');
      expect(
        (migrated.legacyArchive?.completedStepsByDay as Record<string, unknown>)?.['6']
      ).toEqual(['concept', 'prompt', 'example', 'your-turn']);
    });

    it('Scénario 2 : Stockage V1 corrompu (JSON invalide ou structure corrompue -> repli propre en V2 sans crash)', () => {
      window.localStorage.setItem(STORAGE_KEY, '{corrupted_v1_json_payload');
      const recoveredFromInvalidJson = loadProgressFromStorage();
      expect(recoveredFromInvalidJson.schemaVersion).toBe(3);
      expect(recoveredFromInvalidJson.activeRoute).toEqual({ kind: 'home' });

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify('not-an-object'));
      const recoveredFromPrimitive = loadProgressFromStorage();
      expect(recoveredFromPrimitive.schemaVersion).toBe(3);
      expect(recoveredFromPrimitive.completedStepIdsByDay).toEqual({});
    });

    it('Scénario 3 : Sauvegarde ai_creator_studio_progress_v1_backup déjà existante (ne jamais écraser la sauvegarde existante)', () => {
      const originalBackupPayload = JSON.stringify({
        schemaVersion: 1,
        marker: 'ORIGINAL_UNTOUCHED_BACKUP',
      });
      window.localStorage.setItem(V1_BACKUP_STORAGE_KEY, originalBackupPayload);

      const newerV1State = {
        schemaVersion: 1,
        activeRoute: { kind: 'course', courseId: 'course-04', dayNumber: 22 },
        profile: { studentName: 'Nadia' },
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newerV1State));

      const migrated = loadProgressFromStorage();
      expect(migrated.schemaVersion).toBe(3);
      expect(migrated.activeRoute).toEqual({ kind: 'home' });
      expect(migrated.profile.studentName).toBe('Nadia');

      // La sauvegarde existante n'a JAMAIS été écrasée
      expect(window.localStorage.getItem(V1_BACKUP_STORAGE_KEY)).toBe(originalBackupPayload);
    });

    it('Scénario 4 : Stockage vide (initialisation directe en schemaVersion 3 sans créer de backup V1 inutile)', () => {
      window.localStorage.clear();
      const fresh = loadProgressFromStorage();
      expect(fresh.schemaVersion).toBe(3);
      expect(fresh.activeRoute).toEqual({ kind: 'home' });
      expect(fresh.profile.brandStyle).toBe('');
      expect(window.localStorage.getItem(V1_BACKUP_STORAGE_KEY)).toBeNull();
    });

    it('Scénario 5 : Migration partiellement interrompue (backup déjà présent mais clé principale encore en V1 -> achève la migration sans écraser le backup)', () => {
      const firstBackup = JSON.stringify({
        schemaVersion: 1,
        profile: { studentName: 'Premier Snapshot V1' },
      });
      window.localStorage.setItem(V1_BACKUP_STORAGE_KEY, firstBackup);

      const interruptedMainV1 = {
        schemaVersion: 1,
        activeRoute: { kind: 'bonus', bonusId: 'bonus-01' },
        completedStepsByDay: { 1: ['concept', 'prompt', 'example', 'your-turn'] },
        profile: {
          studentName: 'Élève Interrompu',
          brandStyle: 'Palette Personnalisée Océan',
        },
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(interruptedMainV1));

      const completedMigration = loadProgressFromStorage();
      expect(completedMigration.schemaVersion).toBe(3);
      expect(completedMigration.activeRoute).toEqual({
        kind: 'bonus',
        bonusId: 'bonus-manychat',
      });
      expect(completedMigration.profile.brandStyle).toBe('Palette Personnalisée Océan');
      expect(window.localStorage.getItem(V1_BACKUP_STORAGE_KEY)).toBe(firstBackup);

      const persistedMain = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
      expect(persistedMain.schemaVersion).toBe(3);
    });

    it('Scénario 6 : Stockage déjà en V2 (lecture idempotente sans relancer la migration)', () => {
      const existingV2 = {
        schemaVersion: 2,
        activeRoute: { kind: 'course', courseId: 'module-03', dayNumber: 8 },
        activeStepByDay: { 8: 'your-turn' },
        completedStartHereIds: ['introduction', 'setup'],
        completedStepsByDay: {
          8: ['concept', 'prompt', 'example', 'your-turn'],
        },
        checklistAnswers: {},
        exerciseAnswers: {
          'day08-exercise-chariow-checkout': 'Mon offre Chariow configurée',
        },
        quizStates: {},
        savedPrompts: {},
        customPromptInputs: {},
        profile: {
          studentName: 'Koffi',
          business: 'Formation Fiscalité',
          targetAudience: 'Commerçants',
          productType: 'Simulateur de taxes',
          brandStyle: 'Cobalt & Papier',
          mainObjective: 'Vendre sur Chariow',
          vibe: {
            paletteId: 'cobalt-folio',
            styleId: 'structured-grid',
            typographyId: 'serif-editorial',
          },
          customVariables: {},
        },
        lastUpdated: '2026-11-04T12:00:00.000Z',
      };

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existingV2));

      const loaded = loadProgressFromStorage();
      expect(loaded.schemaVersion).toBe(3);
      expect(loaded.activeRoute).toEqual({
        kind: 'course',
        courseId: 'module-03',
        dayNumber: 8,
      });
      expect(loaded.completedStepIdsByDay[8]).toEqual([
        'day-08-step-1',
        'day-08-step-2',
        'day-08-step-3',
        'day-08-step-4',
      ]);
      expect(loaded.exerciseAnswers['day08-exercise-chariow-checkout']).toBe(
        'Mon offre Chariow configurée'
      );
      expect(window.localStorage.getItem(V1_BACKUP_STORAGE_KEY)).toBeNull();
    });

    it("Scénario 7 : Espace localStorage insuffisant (QuotaExceededError sur setItem -> retourne l'état V3 migré en mémoire sans crasher)", () => {
      const v1Data = {
        schemaVersion: 1,
        activeRoute: { kind: 'course', courseId: 'course-01', dayNumber: 3 },
        completedStepsByDay: { 3: ['concept', 'prompt'] },
        profile: {
          studentName: 'Amina',
          business: 'Coaching Carrière',
          targetAudience: 'Cadres',
          productType: 'Diagnostic interactif',
          brandStyle: 'Forêt & Crème',
          mainObjective: 'Lancer en 7 jours',
          vibe: {
            paletteId: 'forest-editorial',
            styleId: 'warm-editorial',
            typographyId: 'system-clean',
          },
          customVariables: {},
        },
      };

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(v1Data));

      // Simuler un QuotaExceededError sur toute nouvelle écriture localStorage
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        const quotaErr = new DOMException('QuotaExceededError', 'QuotaExceededError');
        throw quotaErr;
      });

      expect(() => loadProgressFromStorage()).not.toThrow();
      const inMemoryMigrated = loadProgressFromStorage();
      expect(inMemoryMigrated.schemaVersion).toBe(3);
      expect(inMemoryMigrated.activeRoute).toEqual({
        kind: 'course',
        courseId: 'module-01',
        dayNumber: 3,
      });
      expect(inMemoryMigrated.profile.studentName).toBe('Amina');
      expect(inMemoryMigrated.completedStepIdsByDay[3]).toEqual([
        'day-03-step-1',
        'day-03-step-2',
      ]);
    });
  });
});
