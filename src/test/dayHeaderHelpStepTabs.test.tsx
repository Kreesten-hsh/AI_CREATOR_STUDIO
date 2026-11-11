import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { DayHeader } from '../components/layout/DayHeader';
import { HelpPanel } from '../components/widgets/HelpPanel';
import { StepTabs } from '../components/layout/StepTabs';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';
import { ProgressProvider } from '../context/ProgressContext';
import { STORAGE_KEY, createInitialProgress } from '../utils/storage';
import type { Lesson, StepHelpConfig, Step } from '../types/course';

describe('Suivi, Aide et Résilience : DayHeader, HelpPanel, StepTabs & ErrorBoundary', () => {
  beforeEach(() => {
    localStorage.clear();
    const initial = createInitialProgress();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  });

  describe('DayHeader', () => {
    it('affiche le numéro de leçon sur 07, le titre et la progression', () => {
      const mockLesson: Lesson = {
        id: 'lesson-03',
        lessonNumber: 3,
        moduleId: 'module-02',
        dayId: 'day-02',
        dayNumber: 2,
        title: 'Définir sa direction artistique indépendante',
        italicTitleWord: 'artistique',
        objective: 'Choisir une identité visuelle propre au produit.',
        deliverableSummary: 'Brief de direction artistique.',
        duration: '~20 min',
        isSkeletonPlaceholder: true,
        steps: [],
      };

      render(
        <ProgressProvider>
          <DayHeader lesson={mockLesson} />
        </ProgressProvider>
      );

      expect(screen.getAllByText(/LEÇON/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('03')).toBeInTheDocument();
      expect(screen.getAllByText(/SUR 07/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/artistique/i)).toBeInTheDocument();
    });

    it('gère gracieusement les données partielles ou manquantes sans erreur', () => {
      render(
        <ProgressProvider>
          <DayHeader lesson={{ lessonNumber: 5, title: 'Leçon en cours' }} />
        </ProgressProvider>
      );

      expect(screen.getAllByText(/LEÇON/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('05')).toBeInTheDocument();
      expect(screen.getByText(/Leçon en cours/i)).toBeInTheDocument();
    });
  });

  describe('HelpPanel', () => {
    it('est replié par défaut et n affiche pas son contenu rétractable sans action', () => {
      render(<HelpPanel stepTitle="Étape 1" />);

      expect(screen.queryByText(/Autonomie garantie/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Un blocage \?/i)).toBeInTheDocument();
    });

    it('affiche le titre épuré Un blocage ? et supprime l ancien pavé administratif sans mentionner l ancien onglet « Mon projet »', () => {
      render(<HelpPanel stepTitle="Étape 1" defaultOpen={true} />);

      expect(screen.getByText(/Un blocage \?/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/AI Creator Studio est conçu pour vous rendre 100% autonome avec Claude/i)
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/Autonomie garantie/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Mon projet/i)).not.toBeInTheDocument();
    });

    it('affiche les erreurs fréquentes, conseils et permet de copier les prompts de dépannage', async () => {
      const mockHelp: StepHelpConfig = {
        frequentMistakes: [
          {
            mistake: 'Coller le prompt sans joindre son document source.',
            correction: 'Importez votre document dans Claude avant d envoyer le prompt.',
          },
        ],
        tips: ['Exécutez toujours le prompt dans un chat Claude neuf.'],
        troubleshootingPrompts: [
          {
            id: 'fix-prompt-1',
            title: 'Prompt de correction de syntaxe',
            description: 'Utilisez si Claude génère du code incomplet.',
            prompt: 'Claude, corrige le code ci-dessus pour que l application fonctionne.',
          },
        ],
      };

      const writeTextSpy = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextSpy,
        },
      });

      render(<HelpPanel help={mockHelp} stepTitle="Génération du calculateur" defaultOpen={true} />);

      expect(screen.getByText(/Coller le prompt sans joindre/i)).toBeInTheDocument();
      expect(screen.getByText(/Importez votre document dans Claude/i)).toBeInTheDocument();
      expect(screen.getByText(/Exécutez toujours le prompt dans un chat Claude neuf./i)).toBeInTheDocument();

      expect(screen.getByText(/Prompt de correction de syntaxe/i)).toBeInTheDocument();
      const copyBtn = screen.getByRole('button', { name: /Copier/i });
      fireEvent.click(copyBtn);

      expect(writeTextSpy).toHaveBeenCalledWith(
        'Claude, corrige le code ci-dessus pour que l application fonctionne.'
      );
      expect(await screen.findByText('Copié !')).toBeInTheDocument();
    });

    it('permet de replier et déplier le panneau d aide', () => {
      const mockHelp: StepHelpConfig = {
        tips: ['Conseil de repliement'],
      };

      render(<HelpPanel help={mockHelp} stepTitle="Étape Test" defaultOpen={true} />);

      const toggleButton = screen.getByRole('button', { name: /Un blocage \?/i });
      expect(screen.getByText(/Conseil de repliement/i)).toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(screen.queryByText(/Conseil de repliement/i)).not.toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(screen.getByText(/Conseil de repliement/i)).toBeInTheDocument();
    });
  });

  describe('StepTabs', () => {
    const makeSteps = (count: number): Step[] =>
      Array.from({ length: count }, (_, i) => ({
        id: `step-${i + 1}`,
        number: i + 1,
        title: `Étape ${i + 1}`,
        completionLabel: `Terminer étape ${i + 1}`,
        blocks: [],
      }));

    it('s adapte correctement avec 1, 2 ou 3 étapes', () => {
      const steps = makeSteps(3);
      const onSelect = vi.fn();

      render(
        <StepTabs
          steps={steps}
          activeStepId="step-2"
          completedStepIds={['step-1']}
          onSelectStep={onSelect}
        />
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('grid-cols-1 sm:grid-cols-3');
      expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('gère la navigation clavier accessible selon le motif ARIA Tabs', () => {
      const steps = makeSteps(3);
      const onSelect = vi.fn();

      render(
        <StepTabs
          steps={steps}
          activeStepId="step-1"
          completedStepIds={[]}
          onSelectStep={onSelect}
        />
      );

      const tab1 = screen.getByRole('tab', { name: /Étape 1/i });
      fireEvent.keyDown(tab1, { key: 'ArrowRight' });
      expect(onSelect).toHaveBeenCalledWith('step-2');
      fireEvent.keyDown(tab1, { key: 'ArrowLeft' });
      expect(onSelect).toHaveBeenCalledWith('step-3');
    });
  });

  describe('ErrorBoundary (Sécurité & Confidentialité DOM)', () => {
    it('intercepte une erreur de rendu et affiche un message statique non technique sans exposer error.message ni stack trace', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const CrashingComponent = (): null => {
        throw new Error('SECRET_INTERNAL_STACK_PATH_/home/dev/private_token_12345');
      };

      const onResetMock = vi.fn();

      render(
        <ErrorBoundary onReset={onResetMock}>
          <CrashingComponent />
        </ErrorBoundary>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(
        screen.getByText(/Une erreur inattendue est survenue dans l'interface\./i)
      ).toBeInTheDocument();

      // Vérifie qu'aucun détail interne de l'exception n'apparaît dans le DOM
      expect(screen.queryByText(/SECRET_INTERNAL_STACK_PATH/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/private_token_12345/i)).not.toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it('déclenche onReset lors du clic sur le bouton Retourner à l accueil sans effacer la progression', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const CrashingComponent = (): null => {
        throw new Error('Simulation d erreur de rendu');
      };

      const initialStoredProgress = {
        schemaVersion: 4,
        curriculumModel: '3m-3d-7l',
        activeRoute: { kind: 'lesson', lessonId: 'lesson-02' },
        completedStepIdsByLesson: { 'lesson-01': ['step-1'] },
        profile: { studentName: 'Alex' },
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStoredProgress));

      const onResetMock = vi.fn();

      render(
        <ErrorBoundary onReset={onResetMock}>
          <CrashingComponent />
        </ErrorBoundary>
      );

      const resetButton = screen.getByRole('button', { name: /retourner à l'accueil/i });
      expect(resetButton).toBeInTheDocument();

      fireEvent.click(resetButton);

      expect(onResetMock).toHaveBeenCalledTimes(1);

      // Vérifie que la progression enregistrée est intégralement préservée
      const storedAfterClick = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) ?? '{}'
      );
      expect(storedAfterClick.completedStepIdsByLesson).toEqual({ 'lesson-01': ['step-1'] });
      expect(storedAfterClick.profile.studentName).toBe('Alex');

      consoleErrorSpy.mockRestore();
    });

    it('navigue vers l accueil et réinitialise activeRoute par défaut lorsque onReset n est pas fourni', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const CrashingComponent = (): null => {
        throw new Error('Erreur composant orphelin');
      };

      const initialStoredProgress = {
        schemaVersion: 4,
        curriculumModel: '3m-3d-7l',
        activeRoute: { kind: 'lesson', lessonId: 'lesson-03' },
        completedStepIdsByLesson: { 'lesson-01': ['step-1', 'step-2'] },
        profile: { studentName: 'Fatou' },
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStoredProgress));

      render(
        <ErrorBoundary>
          <CrashingComponent />
        </ErrorBoundary>
      );

      const resetButton = screen.getByRole('button', { name: /retourner à l'accueil/i });
      fireEvent.click(resetButton);

      // Vérifie que activeRoute a été ramenée à home dans localStorage sans perte de progression
      const stored = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) ?? '{}'
      );
      expect(stored.activeRoute).toEqual({ kind: 'home' });
      expect(stored.completedStepIdsByLesson).toEqual({ 'lesson-01': ['step-1', 'step-2'] });
      expect(stored.profile.studentName).toBe('Fatou');

      consoleErrorSpy.mockRestore();
    });

    it('ne modifie pas STORAGE_KEY lors du reset si persistenceDisabled est actif', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const CrashingComponent = (): null => {
        throw new Error('Erreur avec persistance verrouillée');
      };

      const protectedStoredProgress = {
        schemaVersion: 4,
        curriculumModel: '3m-3d-7l',
        persistenceDisabled: true,
        activeRoute: { kind: 'lesson', lessonId: 'lesson-05' },
        profile: { studentName: 'Immuable' },
      };
      const serialized = JSON.stringify(protectedStoredProgress);
      window.localStorage.setItem(STORAGE_KEY, serialized);

      render(
        <ErrorBoundary>
          <CrashingComponent />
        </ErrorBoundary>
      );

      const resetButton = screen.getByRole('button', { name: /retourner à l'accueil/i });
      fireEvent.click(resetButton);

      // Le stockage verrouillé n'a pas été modifié
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(serialized);

      consoleErrorSpy.mockRestore();
    });
  });
});
