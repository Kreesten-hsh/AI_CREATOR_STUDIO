import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { CourseWorkspaceRouter } from '../app/routes';
import { day02 } from '../data/days/day-02';
import { createInitialProgress, saveProgressToStorage, STORAGE_KEY } from '../utils/storage';
import { resolveCourseIdForDay } from '../utils/courseNavigation';
import type { PromptBuilderBlock, ResourceBlock, TextExerciseBlock } from '../types/course';

function setupWorkspaceForDay(dayNumber: number, stepType?: 'concept' | 'prompt' | 'example' | 'your-turn') {
  const initial = createInitialProgress();
  initial.activeRoute = {
    kind: 'course',
    courseId: resolveCourseIdForDay(dayNumber) ?? 'course-01',
    dayNumber,
  };
  if (stepType) {
    initial.activeStepByDay[dayNumber] = stepType;
  }
  saveProgressToStorage(initial);
}

describe('MISSION 05 : Day 02 Full React Integration Suite', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.scrollTo = vi.fn();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. Structure Canonique & Métadonnées
  // =========================================================================
  it('1. possède les métadonnées officielles du Jour 02 et n\'est plus un squelette', () => {
    expect(day02.id).toBe('day-02');
    expect(day02.dayNumber).toBe(2);
    expect(day02.sprintId).toBe('sprint-1');
    expect(day02.title).toBe("PSYCHOLOGIE & LEVIERS D'ACHAT");
    expect(day02.italicTitleWord).toBe('PSYCHOLOGIE');
    expect(day02.isSkeletonPlaceholder).toBe(false);
    expect(day02.objective).toContain("Décrire l'acheteur");
    expect(day02.deliverableSummary).toContain('Fiche acheteur qualitative');

    expect(day02.steps).toHaveLength(4);
    expect(day02.steps[0].id).toBe('day-02-step-1');
    expect(day02.steps[0].type).toBe('concept');
    expect(day02.steps[0].title).toBe('Comprendre');

    expect(day02.steps[1].id).toBe('day-02-step-2');
    expect(day02.steps[1].type).toBe('prompt');
    expect(day02.steps[1].title).toBe('Prompt Claude');

    expect(day02.steps[2].id).toBe('day-02-step-3');
    expect(day02.steps[2].type).toBe('example');
    expect(day02.steps[2].title).toBe('Exemple guidé');

    expect(day02.steps[3].id).toBe('day-02-step-4');
    expect(day02.steps[3].type).toBe('your-turn');
    expect(day02.steps[3].title).toBe('À vous de jouer');
  });

  // =========================================================================
  // 2. Règle R-02 : Zéro tiret cadratin
  // =========================================================================
  it('2. ne contient aucun tiret cadratin dans ses données ou textes', () => {
    const day02String = JSON.stringify(day02);
    expect(day02String).not.toContain('\u2014');
  });

  // =========================================================================
  // 3. Règle R-03 : Zéro bloc vidéo
  // =========================================================================
  it('3. ne contient aucun bloc vidéo dans aucune des 4 étapes', () => {
    for (const step of day02.steps) {
      const videoBlocks = step.blocks.filter((b) => b.type === 'video');
      expect(videoBlocks).toHaveLength(0);
    }
  });

  // =========================================================================
  // 4. Étape 1 : Prose pédagogique fondamentale
  // =========================================================================
  it('4. affiche les concepts clés de l\'Étape 1 (Audience vs Acheteur, 4 Forces de Moesta, Voice of Customer)', () => {
    setupWorkspaceForDay(2, 'concept');
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText('Audience globale versus Acheteur en situation')).toBeInTheDocument();
    expect(screen.getByText('Les 4 Forces du Changement (Modèle de Bob Moesta)')).toBeInTheDocument();
    expect(screen.getByText('Déclencheurs, objections réelles et Voice of Customer')).toBeInTheDocument();
    expect(
      screen.getByText(/Ce qui déclenche la décision d'achat, ce sont les cinq anneaux d'insights d'achat/i)
    ).toBeInTheDocument();
  });

  // =========================================================================
  // 5. Étape 1 : Quiz pédagogique (4 questions)
  // =========================================================================
  it('5. affiche le quiz pédagogique de l\'Étape 1 avec exactement 4 questions pertinentes', () => {
    setupWorkspaceForDay(2, 'concept');
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(
      screen.getByText("Validation des acquis : Psychologie et Leviers d'Achat")
    ).toBeInTheDocument();

    expect(screen.getByText(/Une formatrice définit son acheteur ainsi/i)).toBeInTheDocument();
    expect(screen.getByText(/Un indépendant adore la promesse d'un nouveau simulateur web/i)).toBeInTheDocument();
    expect(screen.getByText(/Vous échangez avec un client potentiel pour identifier ses objections/i)).toBeInTheDocument();
    expect(screen.getByText(/Dans quel cas est-il impératif de distinguer les motivations de l'acheteur/i)).toBeInTheDocument();
  });

  // =========================================================================
  // 6. Étape 1 : Interaction Quiz & Calcul de Score
  // =========================================================================
  it('6. permet d\'interagir avec le quiz, affiche les explications et le score de réussite', () => {
    setupWorkspaceForDay(2, 'concept');
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText('SCORE : 0/4')).toBeInTheDocument();

    // Q1 : Réponse correcte (index 1)
    const optQ1 = screen.getByRole('radio', {
      name: /Parce que ces critères socio-démographiques n'indiquent ni l'action concrète interrompue/i,
    });
    fireEvent.click(optQ1);

    expect(screen.getByText('SCORE : 1/4')).toBeInTheDocument();
    expect(screen.getByText(/CORRECT :/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Les données démographiques décrivent une population générale sans renseigner sur le moment où survient la friction/i)
    ).toBeInTheDocument();

    // Q2 : Réponse incorrecte (index 0)
    const optQ2Bad = screen.getByRole('radio', {
      name: /Le Push du présent\./i,
    });
    fireEvent.click(optQ2Bad);

    expect(screen.getByText(/PAS TOUT À FAIT :/i)).toBeInTheDocument();
    expect(screen.getByText('SCORE : 1/4')).toBeInTheDocument();

    // Bouton recommencer apparaît et réinitialise le quiz
    const retryBtn = screen.getByRole('button', { name: /Recommencer/i });
    fireEvent.click(retryBtn);
    expect(screen.getByText('SCORE : 0/4')).toBeInTheDocument();
  });

  // =========================================================================
  // 7. Étape 2 : Structure XML du Prompt Maître
  // =========================================================================
  it('7. contient le Prompt Maître avec l\'ensemble des balises XML canoniques', () => {
    const step2 = day02.steps[1];
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
    expect(template).toContain('<evidence_rules>');
    expect(template).toContain('</evidence_rules>');
    expect(template).toContain('<constraints>');
    expect(template).toContain('</constraints>');
    expect(template).toContain('<task>');
    expect(template).toContain('</task>');
    expect(template).toContain('<output_format>');
    expect(template).toContain('</output_format>');

    // Vérifier les variables dynamiques
    expect(template).toContain('{{business}}');
    expect(template).toContain('{{targetAudience}}');
  });

  // =========================================================================
  // 8. Étape 2 : Compilation dynamique des variables dans PromptBuilder
  // =========================================================================
  it('8. compile dynamiquement les variables du profil dans le PromptBuilder', () => {
    setupWorkspaceForDay(2, 'prompt');
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(
      screen.getByText("Prompt Maître : Cartographie de l'Acheteur, Frustrations et Déclencheurs")
    ).toBeInTheDocument();

    const audienceInput = screen.getByLabelText('Votre audience cible en situation');
    const businessInput = screen.getByLabelText("Votre thématique ou domaine d'expertise");

    fireEvent.change(audienceInput, { target: { value: 'Comptables indépendants surchargés' } });
    fireEvent.change(businessInput, { target: { value: 'Clôture fiscale sans stress' } });

    const compiledPrompt = screen.getByTestId('compiled-prompt-day02-step2-master-prompt');
    expect(compiledPrompt).toHaveTextContent('Audience cible en situation : Comptables indépendants surchargés');
    expect(compiledPrompt).toHaveTextContent("Domaine d'activité ou thématique : Clôture fiscale sans stress");
  });

  // =========================================================================
  // 9. Étape 2 : Action de copie du prompt
  // =========================================================================
  it('9. permet de copier le prompt compilé dans le presse-papier sans régression', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    setupWorkspaceForDay(2, 'prompt');
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
    expect(copiedText).toContain('<output_format>');
    expect(copiedText).toContain("### 1. Situation de départ de l'acheteur");
  });

  // =========================================================================
  // 10. Étape 2 : Bibliothèque de relances ciblées
  // =========================================================================
  it('10. affiche la bibliothèque des 4 relances ciblées pour piloter Claude', () => {
    setupWorkspaceForDay(2, 'prompt');
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText("Guide d'exécution et bibliothèque de relances ciblées")).toBeInTheDocument();
    expect(screen.getByText(/Si les frustrations restent trop abstraites/i)).toBeInTheDocument();
    expect(screen.getByText(/Si une objection ressemble à une excuse de complaisance/i)).toBeInTheDocument();
    expect(screen.getByText(/Si le vocabulaire extrait contient du jargon marketing d'IA/i)).toBeInTheDocument();
    expect(screen.getByText(/Pour tester la solidité d'une hypothèse/i)).toBeInTheDocument();
  });

  // =========================================================================
  // 11. Étape 3 : Exemple guidé (Cas Alexandre V.)
  // =========================================================================
  it('11. déconstruit le document avant-pdf-statique.html en 8 points d\'analyse', () => {
    setupWorkspaceForDay(2, 'example');
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText("Continuité de l'exemple guidé (Cas Alexandre V.)")).toBeInTheDocument();
    expect(screen.getByText(/avant-pdf-statique\.html/i)).toBeInTheDocument();
    expect(screen.getByText("L'analyse complète de l'acheteur en 8 étapes")).toBeInTheDocument();
    expect(screen.getByText(/Frustration 1 \(Temps \/ Charge\) \[FAIT\]/i)).toBeInTheDocument();
    expect(screen.getByText(/Frustration 5 \(Bricolage textuel\) \[FAIT\]/i)).toBeInTheDocument();
  });

  // =========================================================================
  // 12. Étape 3 : Déconstruction critique et pièges à éviter
  // =========================================================================
  it('12. déconstruit l\'hypothèse d\'abonnement SaaS et alerte sur les 3 pièges de modélisation', () => {
    setupWorkspaceForDay(2, 'example');
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText('Déconstruction critique et pièges à éviter')).toBeInTheDocument();
    expect(
      screen.getByText(/Dans de nombreux cours de marketing génériques, on affirmerait ici : « Les consultants sont prêts à payer un abonnement de 29 euros/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Confondre une objection sur le prix avec une objection sur la valeur/i)).toBeInTheDocument();
    expect(screen.getByText(/Projeter ses propres habitudes sur son client/i)).toBeInTheDocument();
    expect(screen.getByText(/Inventer des verbatims stylisés/i)).toBeInTheDocument();
  });

  // =========================================================================
  // 13. Étape 4 : 6 Livrables TextExercise & Persistance LocalStorage
  // =========================================================================
  it('13. propose 6 blocs TextExercise distincts avec persistance LocalStorage indépendante', () => {
    const step4 = day02.steps[3];
    const exercises = step4.blocks.filter((b) => b.type === 'text-exercise') as TextExerciseBlock[];
    expect(exercises).toHaveLength(6);
    expect(exercises.map((e) => e.id)).toEqual([
      'day02-deliverable-a-situation',
      'day02-deliverable-b-frustrations',
      'day02-deliverable-c-triggers',
      'day02-deliverable-d-objections',
      'day02-deliverable-e-vocabulary',
      'day02-deliverable-final-card',
    ]);

    // Vérifier qu'aucun profileBinding n'écrase artificiellement le profil
    for (const ex of exercises) {
      expect(ex.profileBinding).toBeUndefined();
    }

    setupWorkspaceForDay(2, 'your-turn');
    const { unmount } = render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    const textareaA = screen.getByLabelText(/Vos notes et livrables/i, {
      selector: '#exercise-textarea-day02-deliverable-a-situation',
    });
    const textareaB = screen.getByLabelText(/Vos notes et livrables/i, {
      selector: '#exercise-textarea-day02-deliverable-b-frustrations',
    });
    const textareaC = screen.getByLabelText(/Vos notes et livrables/i, {
      selector: '#exercise-textarea-day02-deliverable-c-triggers',
    });
    const textareaD = screen.getByLabelText(/Vos notes et livrables/i, {
      selector: '#exercise-textarea-day02-deliverable-d-objections',
    });
    const textareaE = screen.getByLabelText(/Vos notes et livrables/i, {
      selector: '#exercise-textarea-day02-deliverable-e-vocabulary',
    });
    const textareaFinal = screen.getByLabelText(/Vos notes et livrables/i, {
      selector: '#exercise-textarea-day02-deliverable-final-card',
    });

    fireEvent.change(textareaA, { target: { value: 'Consultant solo avec carnet papier' } });
    fireEvent.change(textareaB, { target: { value: '5 frustrations distinctes rédigées' } });
    fireEvent.change(textareaC, { target: { value: 'Trigger interne : dimanche soir épuisant' } });
    fireEvent.change(textareaD, { target: { value: 'Objection 1 : manque de temps' } });
    fireEvent.change(textareaE, { target: { value: '1. « la tête dans le guidon »' } });
    fireEvent.change(textareaFinal, { target: { value: 'Synthèse fiche acheteur terminée' } });

    unmount();

    // Vérification LocalStorage
    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.exerciseAnswers['day02-deliverable-a-situation']).toBe('Consultant solo avec carnet papier');
    expect(parsed.exerciseAnswers['day02-deliverable-b-frustrations']).toBe('5 frustrations distinctes rédigées');
    expect(parsed.exerciseAnswers['day02-deliverable-c-triggers']).toBe('Trigger interne : dimanche soir épuisant');
    expect(parsed.exerciseAnswers['day02-deliverable-d-objections']).toBe('Objection 1 : manque de temps');
    expect(parsed.exerciseAnswers['day02-deliverable-e-vocabulary']).toBe('1. « la tête dans le guidon »');
    expect(parsed.exerciseAnswers['day02-deliverable-final-card']).toBe('Synthèse fiche acheteur terminée');

    // Remontage et vérification de la restauration
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByDisplayValue('Consultant solo avec carnet papier')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5 frustrations distinctes rédigées')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Synthèse fiche acheteur terminée')).toBeInTheDocument();
  });

  // =========================================================================
  // 14. Étape 4 : Checklist des 8 critères avec persistance et pourcentage
  // =========================================================================
  it('14. gère la checklist des 8 critères avec persistance et calcul de progression', () => {
    setupWorkspaceForDay(2, 'your-turn');
    const { unmount } = render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText("Checklist d'auto-validation en 8 critères observables")).toBeInTheDocument();
    expect(screen.getByText('0/8 TERMINÉES (0%)')).toBeInTheDocument();

    const item1 = screen.getByRole('checkbox', { name: /Situation ancrée dans l'action réelle/i });
    const item2 = screen.getByRole('checkbox', { name: /Cinq frustrations concrètes et distinctes/i });

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
    const restoredItem1 = screen.getByRole('checkbox', { name: /Situation ancrée dans l'action réelle/i });
    expect(restoredItem1).toHaveAttribute('aria-checked', 'true');
  });

  // =========================================================================
  // 15. Étape 4 : Fiches téléchargeables et bouton de validation d'étape
  // =========================================================================
  it('15. propose les 2 ressources téléchargeables et gère la complétion de l\'étape', () => {
    setupWorkspaceForDay(2, 'your-turn');
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText('Fiches pratiques & Outils de travail du Jour 02')).toBeInTheDocument();
    expect(
      screen.getByText("Fiche pratique : Fiche acheteur qualitative et leviers d'achat")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Grille d'audit : The Mom Test & Forces du Changement")
    ).toBeInTheDocument();

    const step4 = day02.steps[3];
    const resourceBlock = step4.blocks.find((b) => b.type === 'resource') as ResourceBlock;
    expect(resourceBlock.resources).toHaveLength(2);

    const [res1, res2] = resourceBlock.resources;
    expect(res1.downloadFilename).toBe('fiche-acheteur-qualitative-j02.md');
    expect(res1.downloadContent).toContain("FICHE ACHETEUR QUALITATIVE & LEVIERS D'ACHAT");
    expect(res1.downloadContent).toContain('MATRICE DES 5 FRUSTRATIONS CONCRÈTES');

    expect(res2.downloadFilename).toBe('grille-audit-mom-test-forces-j02.md');
    expect(res2.downloadContent).toContain("GRILLE D'AUDIT : THE MOM TEST & FORCES DU CHANGEMENT");
    expect(res2.downloadContent).toContain("Contrôle qualité de la recherche acheteur");

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

    // Bouton de validation d'étape
    const validateBtn = screen.getByRole('button', { name: /Valider l'étape 4 : À vous de jouer/i });
    expect(validateBtn).toBeInTheDocument();
    fireEvent.click(validateBtn);

    // Après validation de l'étape finale, le bouton passe en "Leçon 02 terminée !"
    expect(screen.getByRole('button', { name: /Leçon 02 terminée !/i })).toBeInTheDocument();
  });
});
