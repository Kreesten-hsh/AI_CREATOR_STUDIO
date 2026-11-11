import '@testing-library/jest-dom/vitest';
import React, { StrictMode } from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';
import type { DotLottie, DotLottieReactProps } from '@lottiefiles/dotlottie-react';
import { ALL_LESSONS } from '../data/course';
import { BONUSES } from '../data/navigation/bonuses';
import { COURSE_MODULES } from '../data/sprints';
import { STORAGE_KEY } from '../utils/storage';
import type { LessonId, ModuleId } from '../types/course';

type MockEventType = 'complete' | 'loadError' | 'renderError';
type MockEventHandler = (event: { type: MockEventType; error?: Error }) => void;

interface MockDotLottieInstance {
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  emit: (type: MockEventType, error?: Error) => void;
  getListenerCount: (type: MockEventType) => number;
}

const lottieMocks = vi.hoisted(() => {
  const capturedProps: Partial<DotLottieReactProps>[] = [];
  const setWasmUrlSpy = vi.fn();
  const dotLottieRenderSpy = vi.fn();
  let latestInstance: MockDotLottieInstance | null = null;

  const createInstance = (): MockDotLottieInstance => {
    const listeners = new Map<MockEventType, Set<MockEventHandler>>();

    const addEventListener = vi.fn((type: MockEventType, handler: MockEventHandler) => {
      if (!listeners.has(type)) {
        listeners.set(type, new Set());
      }
      listeners.get(type)?.add(handler);
    });

    const removeEventListener = vi.fn((type: MockEventType, handler?: MockEventHandler) => {
      if (!handler) {
        listeners.delete(type);
        return;
      }
      listeners.get(type)?.delete(handler);
    });

    const emit = (type: MockEventType, error?: Error) => {
      const set = listeners.get(type);
      if (!set) return;
      for (const listener of Array.from(set)) {
        listener({ type, error });
      }
    };

    const getListenerCount = (type: MockEventType) => listeners.get(type)?.size ?? 0;

    return {
      addEventListener,
      removeEventListener,
      emit,
      getListenerCount,
    };
  };

  return {
    capturedProps,
    setWasmUrlSpy,
    dotLottieRenderSpy,
    getLatestInstance: () => latestInstance,
    setLatestInstance: (inst: MockDotLottieInstance | null) => {
      latestInstance = inst;
    },
    createInstance,
  };
});

vi.mock('@lottiefiles/dotlottie-react', () => {
  const MockDotLottieReact = (props: DotLottieReactProps) => {
    lottieMocks.dotLottieRenderSpy(props);
    lottieMocks.capturedProps.push(props);

    const instanceRef = React.useRef<MockDotLottieInstance | null>(null);
    if (!instanceRef.current) {
      instanceRef.current = lottieMocks.createInstance();
      lottieMocks.setLatestInstance(instanceRef.current);
    }

    const callbackRef = React.useRef(props.dotLottieRefCallback);
    callbackRef.current = props.dotLottieRefCallback;

    React.useEffect(() => {
      const instance = instanceRef.current;
      if (!instance) return;
      callbackRef.current?.(instance as unknown as DotLottie);
      return () => {
        callbackRef.current?.(null);
      };
    }, []);

    return (
      <canvas
        data-testid="mock-dotlottie-canvas"
        aria-hidden={props['aria-hidden']}
        data-src={props.src ?? ''}
        data-autoplay={String(Boolean(props.autoplay))}
        data-loop={String(Boolean(props.loop))}
      />
    );
  };

  return {
    DotLottieReact: MockDotLottieReact,
    setWasmUrl: lottieMocks.setWasmUrlSpy,
  };
});

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return {
    ...actual,
    useReducedMotion: () =>
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches),
  };
});

import { App } from '../app/App';
import { CourseWorkspaceRouter } from '../app/routes';
import { CompletionButton } from '../components/course/CompletionButton';
import { resolvePublicAssetUrl } from '../components/course/ConfettiAnimation';
import {
  MODULE_CELEBRATION_CONTENT,
  ModuleCompletionDialog,
} from '../components/course/ModuleCompletionDialog';
import { StepTabs } from '../components/layout/StepTabs';
import { ProgressProvider, type ProgressContextValue } from '../context/ProgressContext';
import { useProgress } from '../hooks/useProgress';
import * as soundEffects from '../utils/soundEffects';

function installMatchMediaMock(prefersReducedMotion: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches:
        prefersReducedMotion && query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function getModuleStepPairs(moduleId: ModuleId): Array<{ lessonId: LessonId; stepId: string }> {
  const mod = COURSE_MODULES.find((m) => m.id === moduleId);
  if (!mod) {
    throw new Error(`Module introuvable: ${moduleId}`);
  }
  const pairs: Array<{ lessonId: LessonId; stepId: string }> = [];
  for (const lessonId of mod.lessonIds) {
    const lesson = ALL_LESSONS.find((l) => l.id === lessonId);
    if (!lesson) continue;
    for (const step of lesson.steps) {
      pairs.push({ lessonId, stepId: step.id });
    }
  }
  return pairs;
}

function createHarness() {
  let latestCtx: ProgressContextValue | null = null;

  function Capture() {
    latestCtx = useProgress();
    return null;
  }

  function renderWithStrictProvider(strict = false) {
    const content = (
      <ProgressProvider>
        <Capture />
        <ModuleCompletionDialog />
      </ProgressProvider>
    );
    return render(strict ? <StrictMode>{content}</StrictMode> : content);
  }

  return {
    getCtx: () => {
      if (!latestCtx) {
        throw new Error('ProgressContext non initialisé');
      }
      return latestCtx;
    },
    renderWithStrictProvider,
  };
}

function completeStepsBatch(
  ctx: ProgressContextValue,
  steps: Array<{ lessonId: LessonId; stepId: string }>
) {
  for (const pair of steps) {
    ctx.completeStep(pair.lessonId, pair.stepId, false);
  }
}

describe('MI02 Lot 02 — Célébrations de fin de module & Motion Design', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.style.overflow = '';
    installMatchMediaMock(false);
    lottieMocks.capturedProps.length = 0;
    lottieMocks.setWasmUrlSpy.mockReset();
    lottieMocks.dotLottieRenderSpy.mockReset();
    lottieMocks.setLatestInstance(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = '';
  });

  describe('1. Déclenchement (7 tests)', () => {
    it("1.1 — n'émet aucune célébration à la validation d'une étape ordinaire du Module 01", () => {
      const harness = createHarness();
      harness.renderWithStrictProvider(true);
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        harness.getCtx().completeStep(m1Steps[0].lessonId, m1Steps[0].stepId);
      });

      expect(harness.getCtx().moduleCompletionEvent).toBeNull();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it("1.2 — n'émet aucune célébration à l'avant-dernière étape du Module 01", () => {
      const harness = createHarness();
      harness.renderWithStrictProvider(true);
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps.slice(0, -1));
      });

      expect(harness.getCtx().getModuleProgress('module-01').isCompleted).toBe(false);
      expect(harness.getCtx().moduleCompletionEvent).toBeNull();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it("1.3 — déclenche la célébration uniquement sur la dernière étape complétant module-01 (y compris sous StrictMode)", async () => {
      const harness = createHarness();
      harness.renderWithStrictProvider(true);
      const m1Steps = getModuleStepPairs('module-01');
      const finalStep = m1Steps[m1Steps.length - 1];

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps.slice(0, -1));
      });
      expect(harness.getCtx().moduleCompletionEvent).toBeNull();

      act(() => {
        harness.getCtx().completeStep(finalStep.lessonId, finalStep.stepId);
      });

      expect(harness.getCtx().getModuleProgress('module-01').isCompleted).toBe(true);
      expect(harness.getCtx().moduleCompletionEvent).toEqual({
        id: 1,
        moduleId: 'module-01',
      });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByTestId('confetti-animation')).toBeInTheDocument();
      });
    });

    it('1.4 — vérifie le moduleId et les contenus contractuels exacts du Module 01', () => {
      const harness = createHarness();
      harness.renderWithStrictProvider();
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps);
      });

      const dialog = screen.getByRole('dialog');
      const expected = MODULE_CELEBRATION_CONTENT['module-01'];
      expect(harness.getCtx().moduleCompletionEvent?.moduleId).toBe('module-01');
      expect(within(dialog).getByText(expected.badge)).toBeInTheDocument();
      expect(within(dialog).getByRole('heading', { name: expected.title })).toBeInTheDocument();
      expect(within(dialog).getByText(expected.message)).toBeInTheDocument();
      expect(within(dialog).getByText(expected.nextObjective)).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Continuer' })).toBeInTheDocument();
      expect(within(dialog).queryByRole('button', { name: /^Fermer$/i })).not.toBeInTheDocument();
    });

    it("1.5 — dismissModuleCompletion supprime l'événement et ferme la modale", () => {
      const harness = createHarness();
      harness.renderWithStrictProvider();
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps);
      });
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      act(() => {
        harness.getCtx().dismissModuleCompletion();
      });

      expect(harness.getCtx().moduleCompletionEvent).toBeNull();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('1.6 — déclenche la célébration du Module 02 avec ses textes contractuels exacts', () => {
      const harness = createHarness();
      harness.renderWithStrictProvider(true);
      const m2Steps = getModuleStepPairs('module-02');

      act(() => {
        completeStepsBatch(harness.getCtx(), m2Steps.slice(0, -1));
      });
      expect(harness.getCtx().moduleCompletionEvent).toBeNull();

      act(() => {
        const last = m2Steps[m2Steps.length - 1];
        harness.getCtx().completeStep(last.lessonId, last.stepId);
      });

      expect(harness.getCtx().moduleCompletionEvent?.moduleId).toBe('module-02');
      const dialog = screen.getByRole('dialog');
      const expected = MODULE_CELEBRATION_CONTENT['module-02'];
      expect(within(dialog).getByText(expected.badge)).toBeInTheDocument();
      expect(within(dialog).getByRole('heading', { name: expected.title })).toBeInTheDocument();
      expect(within(dialog).getByText(expected.message)).toBeInTheDocument();
      expect(within(dialog).getByText(expected.nextObjective)).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Continuer' })).toBeInTheDocument();
      expect(within(dialog).queryByRole('button', { name: /^Fermer$/i })).not.toBeInTheDocument();
    });

    it('1.7 — déclenche la célébration du Module 03 avec le message officiel révisé', () => {
      const harness = createHarness();
      harness.renderWithStrictProvider(true);
      const m3Steps = getModuleStepPairs('module-03');

      act(() => {
        completeStepsBatch(harness.getCtx(), m3Steps.slice(0, -1));
      });
      expect(harness.getCtx().moduleCompletionEvent).toBeNull();

      act(() => {
        const last = m3Steps[m3Steps.length - 1];
        harness.getCtx().completeStep(last.lessonId, last.stepId);
      });

      expect(harness.getCtx().moduleCompletionEvent?.moduleId).toBe('module-03');
      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText('MODULE 03 · VALIDÉ')).toBeInTheDocument();
      expect(
        within(dialog).getByRole('heading', { name: 'Félicitations, tu es arrivé au bout !' })
      ).toBeInTheDocument();
      expect(
        within(dialog).getByText(
          "Tu as terminé les trois modules d'AI CREATOR Studio. Tu as préparé ton application, sa publication et les éléments nécessaires à sa livraison."
        )
      ).toBeInTheDocument();
      expect(
        within(dialog).getByText('Tu peux revoir ton parcours ou consulter tes résultats.')
      ).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Accueil' })).toBeInTheDocument();
      expect(within(dialog).queryByRole('button', { name: /^Fermer$/i })).not.toBeInTheDocument();
    });
  });

  describe('2. Idempotence & Anti-répétition (5 tests)', () => {
    it("2.1 — revisiter un module déjà terminé après fermeture ne re-déclenche aucune célébration", () => {
      const harness = createHarness();
      harness.renderWithStrictProvider();
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps);
      });
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      act(() => {
        harness.getCtx().dismissModuleCompletion();
        harness.getCtx().navigateToCourse('module-02');
        harness.getCtx().navigateToCourse('module-01');
        harness.getCtx().navigateToLesson('lesson-02');
      });

      expect(harness.getCtx().moduleCompletionEvent).toBeNull();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it("2.2 — recharger l'application depuis localStorage avec un module à 100% n'émet rien et ne persiste jamais l'événement", () => {
      const harness1 = createHarness();
      const view1 = harness1.renderWithStrictProvider();
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness1.getCtx(), m1Steps);
      });

      const persistedRaw = localStorage.getItem(STORAGE_KEY);
      expect(persistedRaw).toBeTruthy();
      expect(persistedRaw).not.toContain('moduleCompletionEvent');
      expect(persistedRaw).not.toContain('celebration');

      view1.unmount();

      // Simule un rechargement complet de page depuis le localStorage V4
      const harness2 = createHarness();
      harness2.renderWithStrictProvider();

      expect(harness2.getCtx().getModuleProgress('module-01').isCompleted).toBe(true);
      expect(harness2.getCtx().moduleCompletionEvent).toBeNull();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('2.3 — re-valider une étape déjà terminée ou double-cliquer rapidement ne crée jamais de second événement', () => {
      const harness = createHarness();
      harness.renderWithStrictProvider(true);
      const m1Steps = getModuleStepPairs('module-01');
      const finalStep = m1Steps[m1Steps.length - 1];

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps.slice(0, -1));
      });

      // Double validation simultanée (simulation double-clic rapide avant re-render)
      act(() => {
        harness.getCtx().completeStep(finalStep.lessonId, finalStep.stepId);
        harness.getCtx().completeStep(finalStep.lessonId, finalStep.stepId);
      });

      expect(harness.getCtx().moduleCompletionEvent).toEqual({
        id: 1,
        moduleId: 'module-01',
      });

      act(() => {
        harness.getCtx().dismissModuleCompletion();
        harness.getCtx().completeStep(m1Steps[0].lessonId, m1Steps[0].stepId);
        harness.getCtx().completeStep(finalStep.lessonId, finalStep.stepId);
      });

      expect(harness.getCtx().moduleCompletionEvent).toBeNull();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it("2.4 — importer une sauvegarde JSON contenant un module terminé n'émet aucune célébration", () => {
      const harness1 = createHarness();
      const view1 = harness1.renderWithStrictProvider();
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness1.getCtx(), m1Steps);
      });
      const backupJson = harness1.getCtx().exportBackup();
      view1.unmount();
      localStorage.clear();

      const harness2 = createHarness();
      harness2.renderWithStrictProvider();

      let importedOk = false;
      act(() => {
        importedOk = harness2.getCtx().importBackup(backupJson);
      });

      expect(importedOk).toBe(true);
      expect(harness2.getCtx().getModuleProgress('module-01').isCompleted).toBe(true);
      expect(harness2.getCtx().moduleCompletionEvent).toBeNull();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('2.5 — resetAllProgress réinitialise la progression et efface toute célébration sans en émettre', () => {
      const harness = createHarness();
      harness.renderWithStrictProvider();
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps);
      });
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      act(() => {
        harness.getCtx().resetAllProgress();
      });

      expect(harness.getCtx().getModuleProgress('module-01').isCompleted).toBe(false);
      expect(harness.getCtx().moduleCompletionEvent).toBeNull();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('3. Navigation (5 tests)', () => {
    it('3.1 — le CTA du Module 01 redirige vers module-02 (lesson-03) et ferme la modale', () => {
      const harness = createHarness();
      harness.renderWithStrictProvider();
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps);
      });

      const cta = screen.getByRole('button', { name: 'Continuer' });
      fireEvent.click(cta);

      expect(harness.getCtx().state.activeRoute).toEqual({
        kind: 'lesson',
        lessonId: 'lesson-03',
      });
      expect(harness.getCtx().moduleCompletionEvent).toBeNull();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('3.2 — le CTA du Module 02 redirige vers module-03 (lesson-06) et ferme la modale', () => {
      const harness = createHarness();
      harness.renderWithStrictProvider();
      const m2Steps = getModuleStepPairs('module-02');

      act(() => {
        completeStepsBatch(harness.getCtx(), m2Steps);
      });

      const cta = screen.getByRole('button', { name: 'Continuer' });
      fireEvent.click(cta);

      expect(harness.getCtx().state.activeRoute).toEqual({
        kind: 'lesson',
        lessonId: 'lesson-06',
      });
      expect(harness.getCtx().moduleCompletionEvent).toBeNull();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('3.3 — le CTA du Module 03 redirige vers le sommaire (home) et ferme la modale', () => {
      const harness = createHarness();
      harness.renderWithStrictProvider();
      const m3Steps = getModuleStepPairs('module-03');

      act(() => {
        harness.getCtx().navigateToLesson('lesson-07');
        completeStepsBatch(harness.getCtx(), m3Steps);
      });

      const cta = screen.getByRole('button', { name: 'Accueil' });
      fireEvent.click(cta);

      expect(harness.getCtx().state.activeRoute).toEqual({ kind: 'home' });
      expect(harness.getCtx().moduleCompletionEvent).toBeNull();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('3.4 — la fermeture par la croix (X) conserve la route courante et les 100% de progression sans bouton Fermer secondaire', () => {
      const harness = createHarness();
      harness.renderWithStrictProvider();
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        harness.getCtx().navigateToLesson('lesson-02');
        completeStepsBatch(harness.getCtx(), m1Steps);
      });

      expect(screen.queryByRole('button', { name: /^Fermer$/i })).not.toBeInTheDocument();
      const closeBtn = screen.getByRole('button', {
        name: 'Fermer la fenêtre de félicitations',
      });
      fireEvent.click(closeBtn);

      expect(harness.getCtx().state.activeRoute).toEqual({
        kind: 'lesson',
        lessonId: 'lesson-02',
      });
      expect(harness.getCtx().getModuleProgress('module-01').isCompleted).toBe(true);
      expect(harness.getCtx().getModuleProgress('module-01').percentage).toBe(100);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it("3.5 — la modale reste montée et stable même si la route change avant sa fermeture", () => {
      let capturedCtx: ProgressContextValue | null = null;

      function ContextSpy() {
        capturedCtx = useProgress();
        return null;
      }

      function TestApp() {
        return (
          <ProgressProvider>
            <CourseWorkspaceRouter />
            <ContextSpy />
            <ModuleCompletionDialog />
          </ProgressProvider>
        );
      }

      render(<TestApp />);
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(capturedCtx!, m1Steps);
      });

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      act(() => {
        capturedCtx!.navigateToHome();
        capturedCtx!.navigateToBonus(BONUSES[0].id);
      });

      const dialogAfterRouteChanges = screen.getByRole('dialog');
      expect(dialogAfterRouteChanges).toBeInTheDocument();
      expect(
        within(dialogAfterRouteChanges).getByText('MODULE 01 · VALIDÉ')
      ).toBeInTheDocument();
    });
  });

  describe('4. Cycle de vie Lottie & Résilience (6 tests)', () => {
    it('4.1 — vérifie intégrité locale de public/animations/confetti.json (1920x1080, 25 FPS, frames 0-126) et résolution BASE_URL', () => {
      const assetPath = path.resolve(process.cwd(), 'public/animations/confetti.json');
      expect(fs.existsSync(assetPath)).toBe(true);

      const parsed = JSON.parse(fs.readFileSync(assetPath, 'utf-8')) as Record<string, unknown>;
      expect(parsed.w).toBe(1920);
      expect(parsed.h).toBe(1080);
      expect(parsed.fr).toBe(25);
      expect(parsed.ip).toBe(0);
      expect(parsed.op).toBe(126);

      expect(resolvePublicAssetUrl('animations/confetti.json', '/')).toBe('/animations/confetti.json');
      expect(resolvePublicAssetUrl('animations/confetti.json', '/ai-creator-studio/')).toBe(
        '/ai-creator-studio/animations/confetti.json'
      );
      expect(resolvePublicAssetUrl('/animations/confetti.json', '/sub')).toBe(
        '/sub/animations/confetti.json'
      );
    });

    it("4.2 — charge Lottie paresseusement uniquement à l'ouverture de la célébration (absent sur Accueil, Bonus et Leçon ordinaire)", async () => {
      render(<App />);

      expect(lottieMocks.dotLottieRenderSpy).not.toHaveBeenCalled();
      expect(screen.queryByTestId('confetti-animation')).not.toBeInTheDocument();

      // Navigue sur une page Bonus et vérifie qu'aucun lecteur Lottie n'est monté
      const firstBonusBtn = screen.getAllByRole('button', {
        name: /AUTOMATISATION MANYCHAT/i,
      })[0];
      fireEvent.click(firstBonusBtn);

      expect(lottieMocks.dotLottieRenderSpy).not.toHaveBeenCalled();
      expect(screen.queryByTestId('confetti-animation')).not.toBeInTheDocument();

      // Navigue sur le Module 01 (Leçon 01) : toujours aucun lecteur Lottie
      const moduleOneBtn = screen.getAllByRole('button', {
        name: /CHOISIR/i,
      })[0];
      fireEvent.click(moduleOneBtn);

      expect(lottieMocks.dotLottieRenderSpy).not.toHaveBeenCalled();
      expect(screen.queryByTestId('confetti-animation')).not.toBeInTheDocument();
    });

    it('4.3 — configure le lecteur avec autoplay=true, loop=false, fond transparent, aria-hidden=true et pointer-events-none', async () => {
      const harness = createHarness();
      harness.renderWithStrictProvider();
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps);
      });

      const wrapper = await waitFor(() => screen.getByTestId('confetti-animation'));
      expect(wrapper).toHaveAttribute('aria-hidden', 'true');
      expect(wrapper.className).toContain('pointer-events-none');

      const latestProps = lottieMocks.capturedProps[lottieMocks.capturedProps.length - 1];
      expect(latestProps.src).toBe('/animations/confetti.json');
      expect(latestProps.autoplay).toBe(true);
      expect(latestProps.loop).toBe(false);
      expect(latestProps.backgroundColor).toBe('transparent');
      expect(latestProps.layout).toEqual({ fit: 'cover', align: [0.5, 0.5] });
    });

    it("4.4 — l'événement complete démonte immédiatement le composant Lottie du DOM et nettoie les écouteurs", async () => {
      const harness = createHarness();
      harness.renderWithStrictProvider();
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps);
      });

      await waitFor(() => expect(screen.getByTestId('confetti-animation')).toBeInTheDocument());
      const instance = lottieMocks.getLatestInstance();
      expect(instance).not.toBeNull();
      expect(instance?.getListenerCount('complete')).toBe(1);

      act(() => {
        instance?.emit('complete');
      });

      expect(screen.queryByTestId('confetti-animation')).not.toBeInTheDocument();
      expect(instance?.getListenerCount('complete')).toBe(0);
      expect(instance?.getListenerCount('loadError')).toBe(0);
      expect(instance?.getListenerCount('renderError')).toBe(0);
      // La modale reste intacte et l'accent statique est visible
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByTestId('completion-static-accent')).toBeInTheDocument();
    });

    it("4.5 — la fermeture anticipée avant complete démonte Lottie et nettoie tous ses écouteurs", async () => {
      const harness = createHarness();
      harness.renderWithStrictProvider();
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps);
      });

      await waitFor(() => expect(screen.getByTestId('confetti-animation')).toBeInTheDocument());
      const instance = lottieMocks.getLatestInstance();
      expect(instance?.getListenerCount('complete')).toBe(1);
      expect(instance?.getListenerCount('loadError')).toBe(1);

      fireEvent.click(screen.getByRole('button', { name: 'Fermer la fenêtre de félicitations' }));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByTestId('confetti-animation')).not.toBeInTheDocument();
      expect(instance?.getListenerCount('complete')).toBe(0);
      expect(instance?.getListenerCount('loadError')).toBe(0);
      expect(instance?.getListenerCount('renderError')).toBe(0);
    });

    it("4.6 — zéro requête CDN externe et repli propre avec coche statique en cas de loadError ou d'erreur WASM", async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');

      const harness = createHarness();
      harness.renderWithStrictProvider();
      const m1Steps = getModuleStepPairs('module-01');
      const m2Steps = getModuleStepPairs('module-02');

      // Cas A : loadError émis par le lecteur DotLottie
      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps);
      });

      await waitFor(() => expect(screen.getByTestId('confetti-animation')).toBeInTheDocument());

      expect(lottieMocks.setWasmUrlSpy).toHaveBeenCalledTimes(1);
      const configuredWasmUrl = String(lottieMocks.setWasmUrlSpy.mock.calls[0]?.[0] ?? '');
      expect(configuredWasmUrl).not.toMatch(/jsdelivr|unpkg|lottie\.host/i);

      const instance = lottieMocks.getLatestInstance();
      act(() => {
        instance?.emit('loadError', new Error('Simulated load error'));
      });

      expect(screen.queryByTestId('confetti-animation')).not.toBeInTheDocument();
      expect(screen.getByTestId('completion-static-accent')).toBeInTheDocument();
      expect(instance?.getListenerCount('loadError')).toBe(0);

      // Le CTA principal reste immédiatement utilisable malgré l'échec Lottie
      fireEvent.click(screen.getByRole('button', { name: 'Continuer' }));
      expect(harness.getCtx().state.activeRoute).toEqual({ kind: 'lesson', lessonId: 'lesson-03' });

      // Cas B : erreur synchrone lors de l'initialisation WASM (setWasmUrl lance une exception)
      lottieMocks.setWasmUrlSpy.mockImplementationOnce(() => {
        throw new Error('WASM init blocked');
      });

      act(() => {
        completeStepsBatch(harness.getCtx(), m2Steps);
      });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByTestId('completion-static-accent')).toBeInTheDocument();
      });
      expect(screen.queryByTestId('confetti-animation')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Continuer' })).toBeEnabled();
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('5. Micro-interactions (3 tests)', () => {
    it("5.1 — CompletionButton anime la coche uniquement lors d'une transition live false → true, jamais au montage initial ni au changement de stepKey", () => {
      // Montage déjà terminé : aucune animation de validation live
      const { unmount } = render(
        <CompletionButton
          stepKey="step-done"
          isCompleted={true}
          label="Valider"
          onComplete={vi.fn()}
        />
      );
      expect(screen.getByTestId('completion-check-icon')).toHaveAttribute(
        'data-just-completed',
        'false'
      );
      unmount();

      // Transition live false -> true puis changement vers une autre étape déjà complétée
      const { rerender } = render(
        <CompletionButton
          stepKey="step-1"
          isCompleted={false}
          label="Valider l'étape"
          onComplete={vi.fn()}
        />
      );
      expect(screen.getByTestId('completion-check-icon')).toHaveAttribute(
        'data-just-completed',
        'false'
      );

      rerender(
        <CompletionButton
          stepKey="step-1"
          isCompleted={true}
          label="Valider l'étape"
          onComplete={vi.fn()}
        />
      );
      expect(screen.getByTestId('completion-check-icon')).toHaveAttribute(
        'data-just-completed',
        'true'
      );

      rerender(
        <CompletionButton
          stepKey="step-2"
          isCompleted={true}
          label="Valider l'étape 2"
          onComplete={vi.fn()}
        />
      );
      expect(screen.getByTestId('completion-check-icon')).toHaveAttribute(
        'data-just-completed',
        'false'
      );
    });

    it("5.2 — StepTabs préserve ses états FAIT / actif, sa dimension fixe et toute sa navigation clavier WAI-ARIA", () => {
      const steps = ALL_LESSONS[0].steps;
      const onSelectStep = vi.fn();

      const { rerender } = render(
        <StepTabs
          steps={steps}
          activeStepId={steps[0].id}
          completedStepIds={[]}
          onSelectStep={onSelectStep}
        />
      );

      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[0]).toHaveAttribute('tabindex', '0');
      expect(tabs[1]).toHaveAttribute('tabindex', '-1');

      // Navigation clavier flèche droite et Fin
      fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
      expect(onSelectStep).toHaveBeenCalledWith(steps[1].id);

      fireEvent.keyDown(tabs[0], { key: 'End' });
      expect(onSelectStep).toHaveBeenCalledWith(steps[steps.length - 1].id);

      // Mise à jour avec étape complétée : dimensions du cercle intactes et badge FAIT présent
      rerender(
        <StepTabs
          steps={steps}
          activeStepId={steps[1].id}
          completedStepIds={[steps[0].id]}
          onSelectStep={onSelectStep}
        />
      );

      expect(within(tabs[0]).getByText('FAIT')).toBeInTheDocument();
      expect(tabs[0].querySelector('.w-6.h-6.shrink-0')).not.toBeNull();
    });

    it('5.3 — les actions des boutons principaux restent réactives et fonctionnelles sans latence bloquante', () => {
      const onComplete = vi.fn();
      render(
        <CompletionButton
          stepKey="step-1"
          isCompleted={false}
          label="Valider cette étape"
          onComplete={onComplete}
        />
      );

      const btn = screen.getByRole('button', { name: /Valider cette étape/i });
      fireEvent.click(btn);
      fireEvent.click(btn);

      expect(onComplete).toHaveBeenCalledTimes(2);
    });
  });

  describe('6. Accessibilité WAI-ARIA & Reduced Motion (5 tests)', () => {
    it('6.1 — capture le focus initial dans la modale et assure un focus trap complet Tab / Shift+Tab', () => {
      const harness = createHarness();
      harness.renderWithStrictProvider();
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps);
      });

      const dialog = screen.getByRole('dialog');
      const primaryCta = within(dialog).getByRole('button', { name: 'Continuer' });
      const headerClose = within(dialog).getByRole('button', {
        name: 'Fermer la fenêtre de félicitations',
      });
      expect(within(dialog).queryByRole('button', { name: /^Fermer$/i })).not.toBeInTheDocument();

      // Focus initial automatique sur le CTA principal
      expect(document.activeElement).toBe(primaryCta);

      // Tab sur le dernier élément focusable (primaryCta) boucle vers le premier (headerClose)
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(document.activeElement).toBe(headerClose);

      // Shift+Tab sur le premier élément (headerClose) boucle vers le dernier (primaryCta)
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(primaryCta);
      expect(dialog.contains(document.activeElement)).toBe(true);
    });

    it("6.2 — la touche Escape ferme la modale et restaure le overflow du document", () => {
      document.body.style.overflow = 'auto';
      const harness = createHarness();
      harness.renderWithStrictProvider();
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps);
      });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(document.body.style.overflow).toBe('hidden');

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(document.body.style.overflow).toBe('auto');
    });

    it('6.3 — restaure exactement le focus sur le bouton déclencheur à la fermeture', () => {
      function TriggerHarness() {
        const { completeStep } = useProgress();
        const m1Steps = getModuleStepPairs('module-01');

        const handleTriggerClick = () => {
          completeStepsBatch(
            { completeStep } as unknown as ProgressContextValue,
            m1Steps.slice(0, -1)
          );
          const finalStep = m1Steps[m1Steps.length - 1];
          completeStep(finalStep.lessonId, finalStep.stepId, false);
        };

        return (
          <CompletionButton
            stepKey="final-step"
            isCompleted={false}
            label="Terminer le module"
            onComplete={handleTriggerClick}
          />
        );
      }

      render(
        <ProgressProvider>
          <TriggerHarness />
          <ModuleCompletionDialog />
        </ProgressProvider>
      );

      const triggerBtn = screen.getByRole('button', { name: /Terminer le module/i });
      triggerBtn.focus();
      expect(document.activeElement).toBe(triggerBtn);

      fireEvent.click(triggerBtn);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(document.activeElement).not.toBe(triggerBtn);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(document.activeElement).toBe(triggerBtn);
    });

    it("6.4 — respecte prefers-reduced-motion: reduce en n'important ni montant jamais Lottie tout en affichant l'accent statique", () => {
      installMatchMediaMock(true);
      lottieMocks.dotLottieRenderSpy.mockClear();
      lottieMocks.setWasmUrlSpy.mockClear();

      const harness = createHarness();
      harness.renderWithStrictProvider(true);
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps);
      });

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(screen.getByTestId('completion-static-accent')).toBeInTheDocument();
      expect(screen.queryByTestId('confetti-animation')).not.toBeInTheDocument();
      expect(lottieMocks.dotLottieRenderSpy).not.toHaveBeenCalled();
      expect(lottieMocks.setWasmUrlSpy).not.toHaveBeenCalled();
    });

    it('6.5 — garantit une intelligibilité et sémantique WAI-ARIA complètes sans animation (aria-modal, aria-labelledby, aria-describedby)', () => {
      installMatchMediaMock(true);

      const harness = createHarness();
      harness.renderWithStrictProvider();
      const m2Steps = getModuleStepPairs('module-02');

      act(() => {
        completeStepsBatch(harness.getCtx(), m2Steps);
      });

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');

      const labelledBy = dialog.getAttribute('aria-labelledby');
      const describedBy = dialog.getAttribute('aria-describedby');
      expect(labelledBy).toBeTruthy();
      expect(describedBy).toBeTruthy();

      const headingEl = document.getElementById(labelledBy!);
      const messageEl = document.getElementById(describedBy!);
      expect(headingEl?.textContent).toBe(MODULE_CELEBRATION_CONTENT['module-02'].title);
      expect(messageEl?.textContent).toBe(MODULE_CELEBRATION_CONTENT['module-02'].message);
      expect(
        within(dialog).getByRole('button', {
          name: MODULE_CELEBRATION_CONTENT['module-02'].primaryCta,
        })
      ).toBeEnabled();
    });
  });

  describe('7. Son de succès local (Web Audio API & prefers-reduced-motion)', () => {
    it('7.1 — joue playSuccessChime une seule fois à l’ouverture sous StrictMode sans reduced-motion', () => {
      installMatchMediaMock(false);
      const chimeSpy = vi.spyOn(soundEffects, 'playSuccessChime').mockImplementation(() => {});

      const harness = createHarness();
      harness.renderWithStrictProvider(true);
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps);
      });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(chimeSpy).toHaveBeenCalledTimes(1);
      chimeSpy.mockRestore();
    });

    it('7.2 — coupe complètement playSuccessChime lorsque prefers-reduced-motion: reduce est actif', () => {
      installMatchMediaMock(true);
      const chimeSpy = vi.spyOn(soundEffects, 'playSuccessChime').mockImplementation(() => {});

      const harness = createHarness();
      harness.renderWithStrictProvider(true);
      const m1Steps = getModuleStepPairs('module-01');

      act(() => {
        completeStepsBatch(harness.getCtx(), m1Steps);
      });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(chimeSpy).not.toHaveBeenCalled();
      chimeSpy.mockRestore();
    });

    it('7.3 — playSuccessChime synthétise 3 notes douces avec AudioContext et gère sans exception l’absence d’API', () => {
      const originalAudioContext = (window as unknown as { AudioContext?: unknown }).AudioContext;
      try {
        // Cas sans AudioContext
        delete (window as unknown as { AudioContext?: unknown }).AudioContext;
        expect(() => soundEffects.playSuccessChime()).not.toThrow();

        // Cas avec AudioContext mocké
        const oscStartSpy = vi.fn();
        const oscStopSpy = vi.fn();
        const createOscillatorSpy = vi.fn(() => ({
          type: 'sine',
          frequency: { setValueAtTime: vi.fn() },
          connect: vi.fn(),
          start: oscStartSpy,
          stop: oscStopSpy,
        }));
        const createGainSpy = vi.fn(() => ({
          gain: {
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
        }));
        const closeSpy = vi.fn().mockResolvedValue(undefined);

        class FakeAudioContext {
          currentTime = 0;
          state = 'running';
          destination = {};
          resume = vi.fn().mockResolvedValue(undefined);
          createOscillator = createOscillatorSpy;
          createGain = createGainSpy;
          close = closeSpy;
        }

        (window as unknown as { AudioContext?: unknown }).AudioContext = FakeAudioContext;
        soundEffects.playSuccessChime();
        expect(createOscillatorSpy).toHaveBeenCalledTimes(3);
        expect(createGainSpy).toHaveBeenCalledTimes(3);
        expect(oscStartSpy).toHaveBeenCalledTimes(3);
        expect(oscStopSpy).toHaveBeenCalledTimes(3);
      } finally {
        (window as unknown as { AudioContext?: unknown }).AudioContext = originalAudioContext;
      }
    });
  });
});
