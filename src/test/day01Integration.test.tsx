import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { CourseWorkspaceRouter } from '../app/routes';
import { day01 } from '../data/days/day-01';
import { createInitialProgress, saveProgressToStorage, STORAGE_KEY } from '../utils/storage';
import { resolveCourseIdForDay } from '../utils/courseNavigation';
import type { PromptBuilderBlock, ResourceBlock, TextExerciseBlock, VideoBlockConfig } from '../types/course';
import { isValidVideoUrl } from '../components/widgets/VideoBlock';

function setupWorkspaceForDay(dayNumber: number, stepType?: 'concept' | 'prompt' | 'example' | 'your-turn' | string) {
  const initial = createInitialProgress();
  initial.activeRoute = {
    kind: 'course',
    courseId: resolveCourseIdForDay(dayNumber) ?? 'module-01',
    dayNumber,
  };
  initial.profile.business = "Nutrition et organisation des repas";
  initial.profile.targetAudience = "Salariés en télétravail";
  initial.profile.productType = "Générateur de menus";
  initial.profile.brandStyle = "Éditorial";
  initial.profile.mainObjective = "Lancer un produit interactif";

  if (stepType) {
    const stepId = stepType.startsWith('day-')
      ? stepType
      : `day-01-step-${stepType === 'concept' ? '1' : stepType === 'prompt' ? '2' : stepType === 'example' ? '3' : '4'}`;
    initial.activeStepIdByDay[dayNumber] = stepId;
  }
  saveProgressToStorage(initial);
}

describe('MISSION 04 : Day 01 Full React Integration Suite', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // SECTION 1 : Structure Canonique et Métadonnées
  // =========================================================================
  describe('1. Structure Canonique & Métadonnées', () => {
    it('possède les métadonnées officielles et n\'est plus un squelette', () => {
      expect(day01.id).toBe('day-01');
      expect(day01.dayNumber).toBe(1);
      expect(day01.sprintId).toBe('module-01');
      expect(day01.title).toBe('PARTIR DE SON EXPERTISE ET IDENTIFIER UN PROBLÈME');
      expect(day01.italicTitleWord).toBe('PROBLÈME');
      expect(day01.isSkeletonPlaceholder).toBe(false);
      expect(day01.objective).toContain('problème client concret');
      expect(day01.deliverableSummary).toContain('Matière de départ structurée');
    });

    it('contient exactement 4 étapes canoniques et ordonnées', () => {
      expect(day01.steps).toHaveLength(4);
      expect(day01.steps[0].id).toBe('day-01-step-1');
      expect(day01.steps[0].legacyType).toBe('concept');
      expect(day01.steps[0].title).toBe('Comprendre');

      expect(day01.steps[1].id).toBe('day-01-step-2');
      expect(day01.steps[1].legacyType).toBe('prompt');
      expect(day01.steps[1].title).toBe('Prompt Claude');

      expect(day01.steps[2].id).toBe('day-01-step-3');
      expect(day01.steps[2].legacyType).toBe('example');
      expect(day01.steps[2].title).toBe('Exemple guidé');

      expect(day01.steps[3].id).toBe('day-01-step-4');
      expect(day01.steps[3].legacyType).toBe('your-turn');
      expect(day01.steps[3].title).toBe('À vous de jouer');
    });

    it('ne contient aucun lecteur vidéo sans URL valide ni aucun tiret cadratin dans ses contenus', () => {
      const day01String = JSON.stringify(day01);
      expect(day01String).not.toContain('\u2014');

      for (const step of day01.steps) {
        const videoBlocks = step.blocks.filter((b): b is VideoBlockConfig => b.type === 'video');
        for (const vb of videoBlocks) {
          expect(isValidVideoUrl(vb.videoUrl)).toBe(true);
        }
      }
    });

    it('affiche le bouton de validation d\'étape sur chaque étape développée', () => {
      setupWorkspaceForDay(1, 'concept');
      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );
      expect(
        screen.getByRole('button', { name: /Valider l'étape 1 : Comprendre/i })
      ).toBeInTheDocument();
    });
  });

  // =========================================================================
  // SECTION 2 : Étape 1 - Comprendre & Quiz
  // =========================================================================
  describe('2. Étape 1 : Comprendre & Quiz Pédagogique', () => {
    it('affiche les explications fondamentales sans callouts décoratifs', () => {
      setupWorkspaceForDay(1, 'concept');
      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      // Vérification des concepts clés
      expect(screen.getByText("La chaîne de clarté de l'offre")).toBeInTheDocument();
      expect(screen.getByText('Document statique versus Produit digital interactif')).toBeInTheDocument();
      expect(screen.getByText('Le Test de la Caméra et les contournements actuels')).toBeInTheDocument();
      expect(screen.getByText('Grille de vérité épistémique et déclaration de niche')).toBeInTheDocument();

      // Vérification de l'absence de faux callouts "NOTE IMPORTANTE"
      expect(screen.queryByText(/NOTE IMPORTANTE/i)).not.toBeInTheDocument();
    });

    it('affiche et fait fonctionner le quiz de 4 questions avec rétroaction', () => {
      setupWorkspaceForDay(1, 'concept');
      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      const quizTitle = screen.getByText('Validation des acquis : Fondations et Niche');
      expect(quizTitle).toBeInTheDocument();
      expect(screen.getByText('SCORE : 0/4')).toBeInTheDocument();

      // Répondre correctement à la Q1
      const q1CorrectOption = screen.getByRole('radio', {
        name: /C'est une hypothèse non vérifiée, car elle mélange/i,
      });
      fireEvent.click(q1CorrectOption);

      expect(screen.getByText('SCORE : 1/4')).toBeInTheDocument();
      expect(screen.getByText(/CORRECT :/i)).toBeInTheDocument();
      expect(screen.getByText(/Confondre l'existence d'une difficulté sur le terrain/i)).toBeInTheDocument();

      // Répondre incorrectement à la Q2
      const q2IncorrectOption = screen.getByRole('radio', {
        name: /Mon audience manque cruellement de confiance/i,
      });
      fireEvent.click(q2IncorrectOption);

      expect(screen.getByText(/PAS TOUT À FAIT :/i)).toBeInTheDocument();
      expect(screen.getByText('SCORE : 1/4')).toBeInTheDocument();

      // Bouton recommencer apparaît et réinitialise
      const retryBtn = screen.getByRole('button', { name: /Recommencer/i });
      fireEvent.click(retryBtn);
      expect(screen.getByText('SCORE : 0/4')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // SECTION 3 : Étape 2 - Prompt Claude & PromptBuilder
  // =========================================================================
  describe('3. Étape 2 : Prompt Claude & PromptBuilder', () => {
    it('contient le Prompt Maître avec l\'ensemble des balises XML canoniques', () => {
      const step2 = day01.steps[1];
      const pbBlock = step2.blocks.find((b) => b.type === 'prompt-builder') as PromptBuilderBlock;
      expect(pbBlock).toBeDefined();
      expect(pbBlock.deliverableTarget).toBe('sales-copy');

      const template = pbBlock.template;
      expect(template).toContain('<role>');
      expect(template).toContain('</role>');
      expect(template).toContain('<context>');
      expect(template).toContain('</context>');
      expect(template).toContain('<source_material>');
      expect(template).toContain('</source_material>');
      expect(template).toContain('<epistemic_rules>');
      expect(template).toContain('</epistemic_rules>');
      expect(template).toContain('<constraints>');
      expect(template).toContain('</constraints>');
      expect(template).toContain('<task>');
      expect(template).toContain('</task>');
      expect(template).toContain('<output_format>');
      expect(template).toContain('</output_format>');

      // Vérifier la présence des variables dynamiques
      expect(template).toContain('{{business}}');
      expect(template).toContain('{{targetAudience}}');
    });

    it('compile dynamiquement les variables du profil dans le PromptBuilder', () => {
      setupWorkspaceForDay(1, 'prompt');
      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      // Le PromptBuilder est rendu
      expect(
        screen.getByText('Prompt Maître : Extraction et hiérarchisation des problèmes cibles')
      ).toBeInTheDocument();

      const businessInput = screen.getByLabelText("Votre thématique ou domaine d'expertise");
      const audienceInput = screen.getByLabelText('Votre audience cible visée');

      fireEvent.change(businessInput, { target: { value: 'Menuiserie d\'art' } });
      fireEvent.change(audienceInput, { target: { value: 'Artisans indépendants' } });

      const compiledPrompt = screen.getByTestId('compiled-prompt-day01-step2-master-prompt');
      expect(compiledPrompt).toHaveTextContent('Domaine d\'activité ou thématique : Menuiserie d\'art');
      expect(compiledPrompt).toHaveTextContent('Audience cible visée : Artisans indépendants');
    });

    it('permet de copier le prompt sans régression', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      setupWorkspaceForDay(1, 'prompt');
      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      const copyBtn = screen.getByRole('button', { name: /Copier le prompt/i });
      await act(async () => {
        fireEvent.click(copyBtn);
      });

      expect(writeTextMock).toHaveBeenCalledTimes(1);
      const copiedText = writeTextMock.mock.calls[0][0];
      expect(copiedText).toContain('<role>');
      expect(copiedText).toContain('<constraints>');
    });

    it('affiche la bibliothèque de relances ciblées', () => {
      setupWorkspaceForDay(1, 'prompt');
      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      expect(screen.getByText("Guide d'exécution et bibliothèque de relances")).toBeInTheDocument();
      expect(screen.getByText(/Si la situation reste trop théorique/i)).toBeInTheDocument();
      expect(screen.getByText(/Si Claude a glissé une supposition dans les faits/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // SECTION 4 : Étape 3 - Exemple Guidé
  // =========================================================================
  describe('4. Étape 3 : Exemple Guidé (avant-pdf-statique.html)', () => {
    it('déconstruit le fichier réel du dépôt et respecte la déontologie', () => {
      setupWorkspaceForDay(1, 'example');
      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      expect(screen.getByText('Démonstration et déconstruction critique')).toBeInTheDocument();
      expect(screen.getByText(/avant-pdf-statique\.html/i)).toBeInTheDocument();
      expect(screen.getByText(/cas d'école fictif/i)).toBeInTheDocument();

      // Déconstruction du 90%
      expect(
        screen.getByText(/D'où provient ce chiffre de 90 % \? Existe-t-il une étude statistique rigoureuse/i)
      ).toBeInTheDocument();

      // Audit en 8 points
      expect(screen.getByText("L'audit complet du document en 8 étapes")).toBeInTheDocument();
      expect(screen.getByText(/Problème A \(Capacité fluctuante/i)).toBeInTheDocument();
      expect(screen.getByText(/Déclaration de niche finale/i)).toBeInTheDocument();

      // Les 3 pièges
      expect(screen.getByText('Les 3 pièges fréquents de formulation à éviter')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // SECTION 5 : Étape 4 - À vous de jouer (4 Livrables, Checklist, Ressources)
  // =========================================================================
  describe('5. Étape 4 : À vous de jouer & Persistance', () => {
    it('propose 4 blocs TextExercise distincts avec des identifiants stables', () => {
      const step4 = day01.steps[3];
      const exercises = step4.blocks.filter((b) => b.type === 'text-exercise') as TextExerciseBlock[];
      expect(exercises).toHaveLength(4);
      expect(exercises.map((e) => e.id)).toEqual([
        'day01-deliverable-a',
        'day01-deliverable-b',
        'day01-deliverable-c',
        'day01-deliverable-d',
      ]);

      // Vérifier qu'aucun profileBinding n'écrase artificiellement le profil
      for (const ex of exercises) {
        expect(ex.profileBinding).toBeUndefined();
      }
    });

    it('permet la saisie indépendante des 4 livrables et la persistance LocalStorage', () => {
      setupWorkspaceForDay(1, 'your-turn');
      const { unmount } = render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      const textareaA = screen.getByLabelText(/Vos notes et livrables/i, {
        selector: '#exercise-textarea-day01-deliverable-a',
      });
      const textareaB = screen.getByLabelText(/Vos notes et livrables/i, {
        selector: '#exercise-textarea-day01-deliverable-b',
      });
      const textareaC = screen.getByLabelText(/Vos notes et livrables/i, {
        selector: '#exercise-textarea-day01-deliverable-c',
      });
      const textareaD = screen.getByLabelText(/Vos notes et livrables/i, {
        selector: '#exercise-textarea-day01-deliverable-d',
      });

      fireEvent.change(textareaA, { target: { value: 'Matière A : 3 questions récurrentes' } });
      fireEvent.change(textareaB, { target: { value: 'Problème 1, 2, 3 détaillés' } });
      fireEvent.change(textareaC, { target: { value: 'Rang 1 retenu : calcul de devis' } });
      fireEvent.change(textareaD, { target: { value: "J'aide les menuisiers à chiffrer sans tableur." } });

      unmount();

      // Vérifier le LocalStorage brut
      const raw = window.localStorage.getItem(STORAGE_KEY);
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed.exerciseAnswers['day01-deliverable-a']).toBe('Matière A : 3 questions récurrentes');
      expect(parsed.exerciseAnswers['day01-deliverable-b']).toBe('Problème 1, 2, 3 détaillés');
      expect(parsed.exerciseAnswers['day01-deliverable-c']).toBe('Rang 1 retenu : calcul de devis');
      expect(parsed.exerciseAnswers['day01-deliverable-d']).toBe("J'aide les menuisiers à chiffrer sans tableur.");

      // Remontage et vérification de la restauration
      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      expect(
        screen.getByDisplayValue('Matière A : 3 questions récurrentes')
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('Problème 1, 2, 3 détaillés')
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('Rang 1 retenu : calcul de devis')
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("J'aide les menuisiers à chiffrer sans tableur.")
      ).toBeInTheDocument();
    });

    it('gère la checklist des 8 critères avec persistance et pourcentage', () => {
      setupWorkspaceForDay(1, 'your-turn');
      const { unmount } = render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      const checklistTitle = screen.getByText("Checklist d'auto-validation en 8 critères observables");
      expect(checklistTitle).toBeInTheDocument();
      expect(screen.getByText('0/8 TERMINÉES (0%)')).toBeInTheDocument();

      const item1 = screen.getByRole('checkbox', { name: /Audience identifiable en situation/i });
      const item2 = screen.getByRole('checkbox', { name: /Test de la caméra réussi/i });

      fireEvent.click(item1);
      fireEvent.click(item2);

      expect(screen.getByText('2/8 TERMINÉES (25%)')).toBeInTheDocument();

      unmount();

      // Remontage
      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      expect(screen.getByText('2/8 TERMINÉES (25%)')).toBeInTheDocument();
      const restoredItem1 = screen.getByRole('checkbox', { name: /Audience identifiable en situation/i });
      expect(restoredItem1).toHaveAttribute('aria-checked', 'true');
    });

    it('propose les 2 ressources téléchargeables avec un contenu Markdown complet', () => {
      setupWorkspaceForDay(1, 'your-turn');
      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      expect(screen.getByText('Fiches pratiques & Outils de travail du Jour 01')).toBeInTheDocument();
      expect(
        screen.getByText('Fiche pratique : Définition de niche et des 3 problèmes candidats')
      ).toBeInTheDocument();
      expect(
        screen.getByText("Grille d'audit anti-hallucination du résultat produit par Claude")
      ).toBeInTheDocument();

      const step4 = day01.steps[3];
      const resourceBlock = step4.blocks.find((b) => b.type === 'resource') as ResourceBlock;
      expect(resourceBlock.resources).toHaveLength(2);

      const [res1, res2] = resourceBlock.resources;
      expect(res1.downloadFilename).toBe('fiche-definition-niche-problemes-j01.md');
      expect(res1.downloadContent).toContain('FICHE PRATIQUE : DÉFINITION DE NICHE');
      expect(res1.downloadContent).toContain('MATRICE DES 3 PROBLÈMES CANDIDATS');

      expect(res2.downloadFilename).toBe('fiche-verification-claude-j01.md');
      expect(res2.downloadContent).toContain('GRILLE D\'AUDIT ANTI-HALLUCINATION');
      expect(res2.downloadContent).toContain('Contrôle qualité éditorial');

      // Test du déclenchement du téléchargement
      const createObjectURLMock = vi.fn().mockReturnValue('blob:test-url');
      const revokeObjectURLMock = vi.fn();
      window.URL.createObjectURL = createObjectURLMock;
      window.URL.revokeObjectURL = revokeObjectURLMock;
      const linkClickMock = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

      const downloadBtns = screen.getAllByRole('button', { name: /Télécharger la fiche/i });
      expect(downloadBtns).toHaveLength(2);

      fireEvent.click(downloadBtns[0]);
      expect(createObjectURLMock).toHaveBeenCalledTimes(1);
      expect(linkClickMock).toHaveBeenCalledTimes(1);
    });
  });
});
