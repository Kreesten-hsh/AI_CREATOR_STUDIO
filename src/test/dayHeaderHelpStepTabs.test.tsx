import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { DayHeader } from '../components/layout/DayHeader';
import { HelpPanel } from '../components/widgets/HelpPanel';
import { StepTabs } from '../components/layout/StepTabs';
import { ProgressProvider } from '../context/ProgressContext';
import { STORAGE_KEY, createInitialProgress } from '../utils/storage';
import type { Day, StepHelpConfig, Step } from '../types/course';

describe('Suivi et Aide : DayHeader, HelpPanel & StepTabs', () => {
  beforeEach(() => {
    localStorage.clear();
    const initial = createInitialProgress();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  });

  describe('DayHeader', () => {
    it('affiche le numéro de leçon, le titre et la progression', () => {
      const mockDay: Day = {
        id: 'day-03',
        dayNumber: 3,
        sprintId: 'module-01',
        title: 'Architecture du Produit',
        italicTitleWord: 'Architecture',
        objective: 'Structurer les écrans clés de votre produit.',
        deliverableSummary: 'Arborescence validée des 3 vues principales.',
        isSkeletonPlaceholder: false,
        steps: [],
      };

      render(
        <ProgressProvider>
          <DayHeader day={mockDay} />
        </ProgressProvider>
      );

      // Titre & badges
      expect(screen.getAllByText(/LEÇON/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('03')).toBeInTheDocument();
      expect(screen.getByText(/SUR 09/i)).toBeInTheDocument();
      expect(screen.getByText(/Architecture/i)).toBeInTheDocument();
    });

    it('gère gracieusement les données partielles ou manquantes sans erreur', () => {
      const partialDay: Partial<Day> & { dayNumber: number } = {
        dayNumber: 5,
        title: 'Leçon en cours',
      };

      render(
        <ProgressProvider>
          <DayHeader day={partialDay} />
        </ProgressProvider>
      );

      expect(screen.getAllByText(/LEÇON/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('05')).toBeInTheDocument();
      expect(screen.getByText(/Leçon en cours/i)).toBeInTheDocument();
    });
  });

  describe('HelpPanel', () => {
    it('affiche le disclaimer strict d autonomie (aucune promesse de support humain)', () => {
      render(<HelpPanel stepTitle="Étape 1" />);

      expect(
        screen.getByText(/AI Creator Studio est conçu pour vous rendre 100% autonome avec Claude/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Aucun support humain n’intervient dans ce parcours/i)).toBeInTheDocument();
    });

    it('affiche les erreurs fréquentes, conseils et permet de copier les prompts de dépannage', async () => {
      const mockHelp: StepHelpConfig = {
        frequentMistakes: [
          {
            mistake: 'Coller le prompt sans remplacer la variable {targetAudience}.',
            correction: 'Renseignez d’abord votre cible dans l’onglet Mon Projet.',
          },
        ],
        tips: ['Exécutez toujours le prompt dans un chat Claude neuf.'],
        troubleshootingPrompts: [
          {
            id: 'fix-prompt-1',
            title: 'Prompt de correction de syntaxe',
            description: 'Utilisez si Claude génère du TypeScript non valide.',
            prompt: 'Claude, corrige le code ci-dessus pour respecter TypeScript strict.',
          },
        ],
      };

      // Mock navigator.clipboard
      const writeTextSpy = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextSpy,
        },
      });

      render(<HelpPanel help={mockHelp} stepTitle="Génération du calculateur" />);

      // Erreur fréquente & solution
      expect(screen.getByText(/Coller le prompt sans remplacer/i)).toBeInTheDocument();
      expect(screen.getByText(/Renseignez d’abord votre cible/i)).toBeInTheDocument();

      // Conseil
      expect(screen.getByText(/Exécutez toujours le prompt dans un chat Claude neuf./i)).toBeInTheDocument();

      // Prompt de dépannage et copie
      expect(screen.getByText(/Prompt de correction de syntaxe/i)).toBeInTheDocument();
      const copyBtn = screen.getByRole('button', { name: /Copier/i });
      fireEvent.click(copyBtn);

      expect(writeTextSpy).toHaveBeenCalledWith(
        'Claude, corrige le code ci-dessus pour respecter TypeScript strict.'
      );
      expect(await screen.findByText('Copié !')).toBeInTheDocument();
    });

    it('permet de replier et déplier le panneau d aide', () => {
      render(<HelpPanel stepTitle="Étape Test" defaultOpen={true} />);

      const toggleButton = screen.getByRole('button', { name: /Besoin d’aide pour cette étape/i });
      expect(screen.getByText(/Autonomie garantie/i)).toBeInTheDocument();

      // Replier
      fireEvent.click(toggleButton);
      expect(screen.queryByText(/Autonomie garantie/i)).not.toBeInTheDocument();

      // Déplier
      fireEvent.click(toggleButton);
      expect(screen.getByText(/Autonomie garantie/i)).toBeInTheDocument();
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

    it('s adapte correctement avec 1 seule étape', () => {
      const steps = makeSteps(1);
      const onSelect = vi.fn();

      render(
        <StepTabs
          steps={steps}
          activeStepId="step-1"
          completedStepIds={[]}
          onSelectStep={onSelect}
        />
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('grid-cols-1');
      expect(screen.getByRole('tab', { name: /Étape 1/i })).toBeInTheDocument();
    });

    it('s adapte correctement avec 2 étapes', () => {
      const steps = makeSteps(2);
      const onSelect = vi.fn();

      render(
        <StepTabs
          steps={steps}
          activeStepId="step-1"
          completedStepIds={[]}
          onSelectStep={onSelect}
        />
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('grid-cols-1 sm:grid-cols-2');
      expect(screen.getAllByRole('tab')).toHaveLength(2);
    });

    it('s adapte correctement avec 3 étapes', () => {
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

      const tab1 = screen.getByRole('tab', { name: /Étape 1/i });
      const tab2 = screen.getByRole('tab', { name: /Étape 2/i });
      const tab3 = screen.getByRole('tab', { name: /Étape 3/i });

      expect(tab1).toHaveAttribute('aria-selected', 'false');
      expect(tab1).toHaveAttribute('tabIndex', '-1');

      expect(tab2).toHaveAttribute('aria-selected', 'true');
      expect(tab2).toHaveAttribute('tabIndex', '0');

      expect(tab3).toHaveAttribute('aria-selected', 'false');
      expect(tab3).toHaveAttribute('tabIndex', '-1');
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

      // Flèche droite -> passe à l'étape 2
      fireEvent.keyDown(tab1, { key: 'ArrowRight' });
      expect(onSelect).toHaveBeenCalledWith('step-2');

      // Flèche gauche depuis étape 1 -> cycle vers étape 3 (la dernière)
      fireEvent.keyDown(tab1, { key: 'ArrowLeft' });
      expect(onSelect).toHaveBeenCalledWith('step-3');

      // Touche End -> passe à étape 3
      fireEvent.keyDown(tab1, { key: 'End' });
      expect(onSelect).toHaveBeenCalledWith('step-3');

      // Touche Home -> passe à étape 1
      fireEvent.keyDown(tab1, { key: 'Home' });
      expect(onSelect).toHaveBeenCalledWith('step-1');
    });
  });
});
