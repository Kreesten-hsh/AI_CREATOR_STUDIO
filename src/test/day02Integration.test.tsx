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

describe('MISSION 05-D : Day 02 Epistemic Finalization & Full Integration Suite', () => {
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
  it('4. affiche les concepts clés de l\'Étape 1 (Audience vs Acheteur, formats digitaux, 5 Anneaux de Revella, 4 Forces de Moesta)', () => {
    setupWorkspaceForDay(2, 'concept');
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText('Audience globale versus Acheteur en situation')).toBeInTheDocument();
    expect(screen.getByText('Les 5 Anneaux d\'Insights d\'Achat et les 4 Forces de Moesta')).toBeInTheDocument();
    expect(screen.getByText('Déclencheurs, objections réelles et Voice of Customer')).toBeInTheDocument();
    expect(
      screen.getByText(/l'apprenant d'AI CREATOR Studio .* ne doit jamais être confondu avec votre acheteur final/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Un PDF n'est pas un mauvais produit par défaut, et une page interactive n'est pas supérieure par essence/i)
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

    expect(screen.getByText(/Une créatrice de contenu définit son acheteur cible ainsi/i)).toBeInTheDocument();
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
      name: /Parce que ces critères démographiques ne renseignent ni sur la friction concrète vécue/i,
    });
    fireEvent.click(optQ1);

    expect(screen.getByText('SCORE : 1/4')).toBeInTheDocument();
    expect(screen.getByText(/CORRECT :/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Les données démographiques peuvent encadrer un contexte matériel ou financier/i)
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
  it('7. contient le Prompt Maître avec l\'ensemble des balises XML canoniques et les deux voies d\'exécution', () => {
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

    // Vérifier la présence des deux voies (CAS A matière réelle vs CAS B démarrage sans clients)
    expect(template).toContain('CAS A (Matière client réelle ou avis publics fournis)');
    expect(template).toContain('CAS B (Absence de matière client / Démarrage)');

    // Vérifier l'intégration complète des 5 anneaux d'Adele Revella dans l'output format
    expect(template).toContain('articulant les 5 Anneaux d\'Adele Revella');
    expect(template).toContain('### 5. Critères de décision (Anneau 4)');
    expect(template).toContain('### 6. Parcours d\'achat (Anneau 5)');

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

    fireEvent.change(audienceInput, { target: { value: 'Formateurs en ligne indépendants' } });
    fireEvent.change(businessInput, { target: { value: 'Conception d\'ateliers interactifs' } });

    const compiledPrompt = screen.getByTestId('compiled-prompt-day02-step2-master-prompt');
    expect(compiledPrompt).toHaveTextContent('Audience cible en situation : Formateurs en ligne indépendants');
    expect(compiledPrompt).toHaveTextContent("Domaine d'activité ou thématique : Conception d'ateliers interactifs");
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
    expect(screen.getByText(/Si une objection ressemble à une excuse de politesse/i)).toBeInTheDocument();
    expect(screen.getByText(/Si le vocabulaire extrait contient du jargon marketing d'IA/i)).toBeInTheDocument();
    expect(screen.getByText(/Pour tester la solidité d'une affirmation/i)).toBeInTheDocument();
  });

  // =========================================================================
  // 11. Étape 3 : Exemple guidé et Grille de Vérité en 3 colonnes
  // =========================================================================
  it('11. présente le cas Alexandre V. avec avertissement déontologique (5 pages visibles) et Grille de Vérité en 3 colonnes', () => {
    setupWorkspaceForDay(2, 'example');
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText("Analyse critique du matériau interne (Cas Alexandre V.)")).toBeInTheDocument();
    expect(
      screen.getByText(/le code HTML ne contient physiquement que cinq blocs de pages visibles \(Pages 1\/12 à 5\/12\)/i)
    ).toBeInTheDocument();
    expect(screen.getByText("La Grille de Vérité Documentaire et questions de terrain")).toBeInTheDocument();
    expect(screen.getByText(/Page 1 \(Couverture\) : \[FAIT DOCUMENTÉ\]/i)).toBeInTheDocument();
    expect(screen.getByText(/Page 2 \(Diagnostic de capacité\) : \[FAIT DOCUMENTÉ\]/i)).toBeInTheDocument();
    expect(screen.getByText(/Page 5 \(Prompt & Limites du format\) : \[FAIT DOCUMENTÉ\]/i)).toBeInTheDocument();

    // Vérifier la formulation de l'invitation à imprimer (sans contrainte physique imposée)
    expect(screen.getByText(/invitant expressément à imprimer la page pour cocher au stylo, tout en laissant la possibilité de reporter les tâches sur un autre support/i)).toBeInTheDocument();
    expect(screen.queryByText(/impose une rupture physique/i)).not.toBeInTheDocument();

    // Vérifier l'absence des anciennes allégations non fondées labellisées faits
    expect(screen.queryByText(/Frustration 2 \(Erreur \/ Insécurité\) \[FAIT\] : La violation systématique du temps protégé par une urgence client le mardi matin/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Trigger interne \[HYPOTHÈSE\] : l'épuisement d'un dimanche soir passé à hésiter/i)).not.toBeInTheDocument();
  });

  // =========================================================================
  // 12. Étape 3 : Déconstruction critique et questions Mom Test
  // =========================================================================
  it('12. déconstruit l\'hypothèse d\'abonnement SaaS et propose les questions Mom Test de terrain', () => {
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
    expect(screen.getByText(/Questions d'entretiens recommandées \(The Mom Test\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Quand tu as téléchargé un guide PDF comprenant une feuille de route ces derniers mois, qu'as-tu fait concrètement de ce plan \? L'as-tu imprimé, recopié dans un outil de gestion, ou laissé dans le fichier \?/i)).toBeInTheDocument();
    expect(screen.queryByText(/abonnements logiciels dormants/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Confondre une objection sur le prix avec une objection sur la valeur/i)).toBeInTheDocument();
    expect(screen.getByText(/Projeter ses propres habitudes sur son client/i)).toBeInTheDocument();
  });

  // =========================================================================
  // 13. Étape 4 : 6 Livrables TextExercise & Deux Voies Pédagogiques
  // =========================================================================
  it('13. propose 6 blocs TextExercise distincts avec deux voies d\'exécution et persistance LocalStorage', () => {
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

    expect(screen.getByText(/Voie 1 \(Vous vendez déjà ou disposez de retours clients réels\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Voie 2 \(Vous êtes en phase de conception ou de lancement\)/i)).toBeInTheDocument();
    expect(screen.queryByText(/Profil [ABCD]/i)).not.toBeInTheDocument();

    const finalCard = exercises[5];
    expect(finalCard.placeholder).toContain("LES 5 ANNEAUX D'INSIGHTS D'ACHAT");
    expect(finalCard.placeholder).toContain("Initiatives prioritaires & Déclencheurs (Anneau 1");
    expect(finalCard.placeholder).toContain("Facteurs de succès attendus (Anneau 2");
    expect(finalCard.placeholder).toContain("Freins perçus & Objections majeures (Anneau 3");
    expect(finalCard.placeholder).toContain("Critères de décision (Anneau 4");
    expect(finalCard.placeholder).toContain("Parcours d'achat (Anneau 5");

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

    fireEvent.change(textareaA, { target: { value: 'Formateur en ligne avec fiches statiques' } });
    fireEvent.change(textareaB, { target: { value: '5 frictions identifiées avec statuts' } });
    fireEvent.change(textareaC, { target: { value: 'Trigger externe : nouvelle session dans 15 jours' } });
    fireEvent.change(textareaD, { target: { value: 'Objection 1 : manque de temps' } });
    fireEvent.change(textareaE, { target: { value: '1. « naviguer à vue sur mes modules »' } });
    fireEvent.change(textareaFinal, { target: { value: 'Fiche acheteur finale validée' } });

    unmount();

    // Vérification LocalStorage
    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.exerciseAnswers['day02-deliverable-a-situation']).toBe('Formateur en ligne avec fiches statiques');
    expect(parsed.exerciseAnswers['day02-deliverable-b-frustrations']).toBe('5 frictions identifiées avec statuts');
    expect(parsed.exerciseAnswers['day02-deliverable-c-triggers']).toBe('Trigger externe : nouvelle session dans 15 jours');
    expect(parsed.exerciseAnswers['day02-deliverable-d-objections']).toBe('Objection 1 : manque de temps');
    expect(parsed.exerciseAnswers['day02-deliverable-e-vocabulary']).toBe('1. « naviguer à vue sur mes modules »');
    expect(parsed.exerciseAnswers['day02-deliverable-final-card']).toBe('Fiche acheteur finale validée');

    // Remontage et vérification de la restauration
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByDisplayValue('Formateur en ligne avec fiches statiques')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5 frictions identifiées avec statuts')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Fiche acheteur finale validée')).toBeInTheDocument();
  });

  // =========================================================================
  // 14. Étape 4 : Checklist des 8 critères avec persistance et pourcentage
  // =========================================================================
  it('14. gère la checklist des 8 critères observables avec persistance et progression', () => {
    setupWorkspaceForDay(2, 'your-turn');
    const { unmount } = render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText("Checklist d'auto-validation en 8 critères observables")).toBeInTheDocument();
    expect(screen.getByText('0/8 TERMINÉES (0%)')).toBeInTheDocument();

    const item1 = screen.getByRole('checkbox', { name: /Situation ancrée dans l'action réelle et rôle clarifié/i });
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
    const restoredItem1 = screen.getByRole('checkbox', { name: /Situation ancrée dans l'action réelle et rôle clarifié/i });
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
    expect(res1.downloadContent).toContain("FICHE ACHETEUR QUALITATIVE & LES 5 ANNEAUX D'INSIGHTS D'ACHAT");
    expect(res1.downloadContent).toContain("ANNEAU 1 : INITIATIVES PRIORITAIRES & FRUSTRATIONS");
    expect(res1.downloadContent).toContain("ANNEAU 4 : CRITÈRES DE DÉCISION");
    expect(res1.downloadContent).toContain("ANNEAU 5 : PARCOURS D'ACHAT");

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
