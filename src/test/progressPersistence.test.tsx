import { describe, it, expect, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { useProgress } from '../hooks/useProgress';
import { STORAGE_KEY } from '../utils/storage';
import type { QuizAttemptState } from '../types/course';

describe('MISSION 02-B : Student Progress & State Persistence Suite', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  // Helper pour lire l'état actuel depuis un ProgressProvider
  function StateConsumer({ onState }: { onState: (value: ReturnType<typeof useProgress>) => void }) {
    const progress = useProgress();
    onState(progress);
    return null;
  }

  it('1. persiste et restaure fidèlement les réponses aux exercices textuels', () => {
    let capturedProgress!: ReturnType<typeof useProgress>;

    // Premier montage : écriture d'une réponse d'exercice
    const { unmount } = render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (capturedProgress = p)} />
      </ProgressProvider>
    );

    act(() => {
      capturedProgress.saveExerciseAnswer('exercise-day-06-audit', 'Audit de mon PDF statique');
    });

    // Démonter le provider
    unmount();

    // Vérifier l'écriture réelle dans window.localStorage
    const rawStorage = window.localStorage.getItem(STORAGE_KEY);
    expect(rawStorage).not.toBeNull();
    const parsed = JSON.parse(rawStorage!);
    expect(parsed.exerciseAnswers['exercise-day-06-audit']).toBe('Audit de mon PDF statique');

    // Second montage indépendant : nouveau provider
    let restoredProgress!: ReturnType<typeof useProgress>;
    render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (restoredProgress = p)} />
      </ProgressProvider>
    );

    expect(restoredProgress.state.exerciseAnswers['exercise-day-06-audit']).toBe(
      'Audit de mon PDF statique'
    );
  });

  it('2. persiste et restaure les validations de checklists', () => {
    let capturedProgress!: ReturnType<typeof useProgress>;

    const { unmount } = render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (capturedProgress = p)} />
      </ProgressProvider>
    );

    act(() => {
      capturedProgress.toggleChecklistItem('checklist-day-07', 'item-html-structure');
      capturedProgress.toggleChecklistItem('checklist-day-07', 'item-inline-css');
    });

    unmount();

    // Nouveau provider après lecture LocalStorage
    let restoredProgress!: ReturnType<typeof useProgress>;
    render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (restoredProgress = p)} />
      </ProgressProvider>
    );

    expect(
      restoredProgress.state.checklistAnswers['checklist-day-07']?.['item-html-structure']
    ).toBe(true);
    expect(
      restoredProgress.state.checklistAnswers['checklist-day-07']?.['item-inline-css']
    ).toBe(true);
  });

  it('3. persiste et restaure les tentatives et scores de quiz', () => {
    let capturedProgress!: ReturnType<typeof useProgress>;

    const { unmount } = render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (capturedProgress = p)} />
      </ProgressProvider>
    );

    const quizAttempt: QuizAttemptState = {
      answers: { q1: 2, q2: 0 },
      submitted: true,
      score: 2,
      total: 2,
    };

    act(() => {
      capturedProgress.saveQuizAttempt('quiz-day-01', quizAttempt);
    });

    unmount();

    let restoredProgress!: ReturnType<typeof useProgress>;
    render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (restoredProgress = p)} />
      </ProgressProvider>
    );

    expect(restoredProgress.state.quizStates['quiz-day-01']).toEqual(quizAttempt);
  });

  it('4. persiste et restaure les prompts générés et sauvegardés', () => {
    // Écriture directe dans localStorage pour vérifier la restauration de savedPrompts
    const initialRaw = {
      schemaVersion: 1,
      activeRoute: { kind: 'home' },
      activeStepByDay: {},
      completedStartHereIds: [],
      completedStepsByDay: {},
      checklistAnswers: {},
      exerciseAnswers: {},
      quizStates: {},
      savedPrompts: {
        'prompt-day-07-system': 'Tu es un architecte frontend expert en Claude Artifacts.',
      },
      customPromptInputs: {},
      profile: {
        studentName: 'Alex',
        business: '',
        targetAudience: '',
        productType: '',
        brandStyle: '',
        mainObjective: '',
        vibe: {
          paletteId: 'editorial-brique',
          styleId: 'neo-brutalist-print',
          typographyId: 'archivo-instrument',
        },
        customVariables: {},
      },
      lastUpdated: new Date().toISOString(),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRaw));

    let restoredProgress!: ReturnType<typeof useProgress>;
    render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (restoredProgress = p)} />
      </ProgressProvider>
    );

    expect(restoredProgress.state.savedPrompts['prompt-day-07-system']).toBe(
      'Tu es un architecte frontend expert en Claude Artifacts.'
    );
  });

  it('5. persiste et restaure les entrées personnalisées de prompts', () => {
    let capturedProgress!: ReturnType<typeof useProgress>;

    const { unmount } = render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (capturedProgress = p)} />
      </ProgressProvider>
    );

    act(() => {
      capturedProgress.saveCustomPromptInput(
        'prompt-block-01',
        'nicheSpecification',
        'Nutrition sportive pour coureurs de trail'
      );
    });

    unmount();

    let restoredProgress!: ReturnType<typeof useProgress>;
    render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (restoredProgress = p)} />
      </ProgressProvider>
    );

    expect(
      restoredProgress.state.customPromptInputs['prompt-block-01']?.['nicheSpecification']
    ).toBe('Nutrition sportive pour coureurs de trail');
  });

  it('6. persiste et restaure les champs du profil et la sélection de vibe', () => {
    let capturedProgress!: ReturnType<typeof useProgress>;

    const { unmount } = render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (capturedProgress = p)} />
      </ProgressProvider>
    );

    act(() => {
      capturedProgress.updateProfileField('studentName', 'Camille');
      capturedProgress.updateProfileField('business', 'Studio Vélo');
      capturedProgress.updateProfileField('targetAudience', 'Cyclistes urbains');
      capturedProgress.updateProfileField('productType', 'Guide interactif de révision');
      capturedProgress.updateProfileField('mainObjective', 'Lancer une V1 en 10 jours');
      capturedProgress.updateVibeSelection(
        {
          paletteId: 'minimal-pastel',
          styleId: 'editorial-clean',
          typographyId: 'serif-modern',
        },
        'Ambiance Minimal Pastel avec typographie sérif moderne'
      );
    });

    unmount();

    let restoredProgress!: ReturnType<typeof useProgress>;
    render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (restoredProgress = p)} />
      </ProgressProvider>
    );

    const profile = restoredProgress.state.profile;
    expect(profile.studentName).toBe('Camille');
    expect(profile.business).toBe('Studio Vélo');
    expect(profile.targetAudience).toBe('Cyclistes urbains');
    expect(profile.productType).toBe('Guide interactif de révision');
    expect(profile.mainObjective).toBe('Lancer une V1 en 10 jours');
    expect(profile.brandStyle).toBe('Ambiance Minimal Pastel avec typographie sérif moderne');
    expect(profile.vibe.paletteId).toBe('minimal-pastel');
    expect(profile.vibe.styleId).toBe('editorial-clean');
    expect(profile.vibe.typographyId).toBe('serif-modern');
  });

  it('7. persiste et restaure les variables personnalisées du profil', () => {
    let capturedProgress!: ReturnType<typeof useProgress>;

    const { unmount } = render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (capturedProgress = p)} />
      </ProgressProvider>
    );

    act(() => {
      capturedProgress.updateCustomVariable('customNicheKey', 'B2B SaaS Sales Playbook');
      capturedProgress.updateCustomVariable('pricingTier', '99 EUR');
    });

    unmount();

    let restoredProgress!: ReturnType<typeof useProgress>;
    render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (restoredProgress = p)} />
      </ProgressProvider>
    );

    expect(restoredProgress.state.profile.customVariables['customNicheKey']).toBe(
      'B2B SaaS Sales Playbook'
    );
    expect(restoredProgress.state.profile.customVariables['pricingTier']).toBe('99 EUR');
  });

  it('8. restaure complètement l\'état après recréation du provider et normalise les routes incohérentes sans perte de données', () => {
    // Injection dans LocalStorage d'un état complet avec le cas obligatoire de route incohérente :
    // activeRoute = { kind: 'course', courseId: 'course-02', dayNumber: 1 }
    const fullStateRaw = {
      schemaVersion: 1,
      activeRoute: {
        kind: 'course',
        courseId: 'course-02',
        dayNumber: 1, // Incohérent : course-02 ne commence qu'au Jour 16 !
      },
      activeStepByDay: {
        16: 'prompt',
      },
      completedStartHereIds: [],
      completedStepsByDay: {
        1: ['concept', 'prompt', 'example', 'your-turn'],
        16: ['concept'],
      },
      checklistAnswers: {
        'chk-16': { 'step-1': true },
      },
      exerciseAnswers: {
        'ex-16': 'Notes sur l\'interview socratique Claude',
      },
      quizStates: {
        'quiz-16': { answers: { 0: 1 }, submitted: true, score: 1, total: 1 },
      },
      savedPrompts: {
        'prompt-master': 'Prompt de personnalisation anti-slop',
      },
      customPromptInputs: {
        'block-expert': { userContext: 'Expertise médicale' },
      },
      profile: {
        studentName: 'Dr. Valérie',
        business: 'Cabinet de Santé',
        targetAudience: 'Patients chroniques',
        productType: 'Journal interactif de suivi',
        brandStyle: 'Éditorial Sérénité',
        mainObjective: 'Autonomie patient',
        vibe: {
          paletteId: 'editorial-brique',
          styleId: 'neo-brutalist-print',
          typographyId: 'archivo-instrument',
        },
        customVariables: {
          specialite: 'Cardiologie préventive',
        },
      },
      lastUpdated: new Date().toISOString(),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fullStateRaw));

    // Nouveau montage propre du provider
    let restoredProgress!: ReturnType<typeof useProgress>;
    render(
      <ProgressProvider>
        <StateConsumer onState={(p) => (restoredProgress = p)} />
      </ProgressProvider>
    );

    // 1. Vérification de la normalisation de la route obligatoire :
    // course-02 avec dayNumber: 1 doit avoir été normalisé vers dayNumber: 16
    expect(restoredProgress.state.activeRoute).toEqual({
      kind: 'course',
      courseId: 'course-02',
      dayNumber: 16,
    });

    // 2. Vérification de l'absence totale de perte de données :
    expect(restoredProgress.state.profile.studentName).toBe('Dr. Valérie');
    expect(restoredProgress.state.profile.customVariables['specialite']).toBe(
      'Cardiologie préventive'
    );
    expect(restoredProgress.state.exerciseAnswers['ex-16']).toBe(
      'Notes sur l\'interview socratique Claude'
    );
    expect(restoredProgress.state.checklistAnswers['chk-16']['step-1']).toBe(true);
    expect(restoredProgress.state.quizStates['quiz-16'].score).toBe(1);
    expect(restoredProgress.state.savedPrompts['prompt-master']).toBe(
      'Prompt de personnalisation anti-slop'
    );
    expect(
      restoredProgress.state.customPromptInputs['block-expert']['userContext']
    ).toBe('Expertise médicale');
    expect(restoredProgress.state.completedStepsByDay[1]).toHaveLength(4);
    expect(restoredProgress.state.completedStepsByDay[16]).toEqual(['concept']);
    expect(restoredProgress.state.activeStepByDay[16]).toBe('prompt');
  });
});
