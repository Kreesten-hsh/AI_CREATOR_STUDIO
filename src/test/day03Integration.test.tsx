import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { CourseWorkspaceRouter } from '../app/routes';
import { day03 } from '../data/days/day-03';
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
      : `day-03-step-${stepType === 'concept' ? '1' : stepType === 'prompt' ? '2' : stepType === 'example' ? '3' : '4'}`;
    initial.activeStepIdByDay[dayNumber] = stepId;
  }
  saveProgressToStorage(initial);
}

describe('MISSION 06 : Day 03 Positioning & Promise Full Integration Suite', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.scrollTo = vi.fn();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. Structure Canonique & Métadonnées
  // =========================================================================
  it('1. possède les métadonnées officielles du Jour 03 et n\'est plus un squelette', () => {
    expect(day03.id).toBe('day-03');
    expect(day03.dayNumber).toBe(3);
    expect(day03.sprintId).toBe('module-01');
    expect(day03.title).toBe('DÉFINIR SON POSITIONNEMENT ET SA PROMESSE');
    expect(day03.italicTitleWord).toBe('POSITIONNEMENT');
    expect(day03.isSkeletonPlaceholder).toBe(false);
    expect(day03.objective).toContain('choisirait votre offre');
    expect(day03.deliverableSummary).toContain('Alternatives réelles');

    expect(day03.steps).toHaveLength(4);
    expect(day03.steps[0].id).toBe('day-03-step-1');
    expect(day03.steps[0].legacyType).toBe('concept');
    expect(day03.steps[0].title).toBe('Comprendre');

    expect(day03.steps[1].id).toBe('day-03-step-2');
    expect(day03.steps[1].legacyType).toBe('prompt');
    expect(day03.steps[1].title).toBe('Prompt Claude');

    expect(day03.steps[2].id).toBe('day-03-step-3');
    expect(day03.steps[2].legacyType).toBe('example');
    expect(day03.steps[2].title).toBe('Exemple guidé');

    expect(day03.steps[3].id).toBe('day-03-step-4');
    expect(day03.steps[3].legacyType).toBe('your-turn');
    expect(day03.steps[3].title).toBe('À vous de jouer');
  });

  // =========================================================================
  // 2. Règle typographique : Zéro tiret cadratin
  // =========================================================================
  it('2. ne contient aucun tiret cadratin dans ses données ou textes', () => {
    const rawData = JSON.stringify(day03);
    expect(rawData).not.toContain('—');
    expect(rawData).not.toContain('\u2014');
  });

  // =========================================================================
  // 3. Règle déontologique : Zéro lecteur vidéo sans URL valide
  // =========================================================================
  it('3. ne contient aucun lecteur vidéo sans URL valide dans aucune des 4 étapes', () => {
    for (const step of day03.steps) {
      const videoBlocks = step.blocks.filter((b): b is VideoBlockConfig => b.type === 'video');
      for (const vb of videoBlocks) {
        expect(isValidVideoUrl(vb.videoUrl)).toBe(true);
      }
    }
  });

  // =========================================================================
  // 4. Étape 1 : Concepts clés de positionnement et de promesse
  // =========================================================================
  it('4. affiche les concepts clés de l\'Étape 1 (April Dunford, Strategyzer, 5 composantes, alternatives réelles, promesse vérifiable)', () => {
    setupWorkspaceForDay(3, 'concept');

    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    // Titres de sections
    expect(screen.getByText(/Pourquoi de bons produits échouent lorsqu'ils sont mal positionnés/i)).toBeInTheDocument();
    expect(screen.getByText(/Positionnement, Proposition de valeur, Promesse et Messaging/i)).toBeInTheDocument();
    expect(screen.getByText(/La mécanique séquentielle du positionnement/i)).toBeInTheDocument();
    expect(screen.getByText(/Matrice comparative face aux alternatives réelles/i)).toBeInTheDocument();
    expect(screen.getByText(/Les 4 règles d'or d'une promesse crédible et vérifiable/i)).toBeInTheDocument();

    // Callout de nuance sur l'interactivité
    expect(screen.getByText(/La valeur réelle de l'interactivité sans dogmatisme/i)).toBeInTheDocument();
    expect(
      screen.getByText(/un document PDF n'est pas un mauvais produit par nature/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Le choix du format technique précis .* et son hypothèse tarifaire seront arbitrés au Jour 04/i)
    ).toBeInTheDocument();
  });

  // =========================================================================
  // 5. Étape 1 : Quiz de validation des acquis (4 questions)
  // =========================================================================
  it('5. affiche le quiz pédagogique de l\'Étape 1 avec exactement 4 questions pertinentes', () => {
    const step1 = day03.steps[0];
    const quizBlock = step1.blocks.find((b) => b.type === 'quiz');
    expect(quizBlock).toBeDefined();

    if (quizBlock && quizBlock.type === 'quiz') {
      expect(quizBlock.questions).toHaveLength(4);
      expect(quizBlock.questions.map((q) => q.id)).toEqual([
        'q1-competitive-alternatives',
        'q2-differentiation-vs-value',
        'q3-positioning-vs-slogan',
        'q4-promise-ethics',
      ]);
      for (const q of quizBlock.questions) {
        expect(q.options).toHaveLength(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(4);
        expect(q.explanation.length).toBeGreaterThan(20);
      }
    }
  });

  // =========================================================================
  // 6. Étape 1 : Interaction et validation du Quiz
  // =========================================================================
  it('6. permet d\'interagir avec le quiz, affiche les explications et le score de réussite', () => {
    setupWorkspaceForDay(3, 'concept');

    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText(/Validation des acquis : Positionnement et Promesse/i)).toBeInTheDocument();
    expect(screen.getByText('SCORE : 0/4')).toBeInTheDocument();

    // Q1: Option 1 (Ce que ses candidats cibles font aujourd'hui...)
    const q1Radio = screen.getByRole('radio', {
      name: /Ce que ses candidats cibles font aujourd'hui pour préparer leurs entretiens/i,
    });
    fireEvent.click(q1Radio);

    expect(screen.getByText('SCORE : 1/4')).toBeInTheDocument();
    expect(screen.getByText(/CORRECT :/i)).toBeInTheDocument();

    // Q2: Option 1 (Lorsque cette caractéristique permet à l'acheteur...)
    const q2Radio = screen.getByRole('radio', {
      name: /Lorsque cette caractéristique permet à l'acheteur de résoudre un problème plus vite/i,
    });
    fireEvent.click(q2Radio);

    expect(screen.getByText('SCORE : 2/4')).toBeInTheDocument();

    // Q3: Option 2 (Une décision stratégique interne définissant...)
    const q3Radio = screen.getByRole('radio', {
      name: /Une décision stratégique interne définissant pour quel profil d'acheteur/i,
    });
    fireEvent.click(q3Radio);

    expect(screen.getByText('SCORE : 3/4')).toBeInTheDocument();

    // Q4: Option 1 (Passez de notes de préparation dispersées...)
    const q4Radio = screen.getByRole('radio', {
      name: /Passez de notes de préparation dispersées à une trame d'entretien/i,
    });
    fireEvent.click(q4Radio);

    // Score parfait et explications affichées
    expect(screen.getByText('SCORE : 4/4')).toBeInTheDocument();
    expect(
      screen.getByText(/L'alternative concurrente réelle est ce que le client fait aujourd'hui en l'absence de votre offre/i)
    ).toBeInTheDocument();
  });

  // =========================================================================
  // 7. Étape 2 : Prompt Maître XML et Balises Canoniques
  // =========================================================================
  it('7. contient le Prompt Maître avec l\'ensemble des balises XML canoniques et les règles de déontologie', () => {
    const step2 = day03.steps[1];
    const promptBlock = step2.blocks.find((b) => b.type === 'prompt-builder') as PromptBuilderBlock;
    expect(promptBlock).toBeDefined();

    const tpl = promptBlock.template;
    expect(tpl).toContain('<role>');
    expect(tpl).toContain('<context>');
    expect(tpl).toContain('<source_material>');
    expect(tpl).toContain('<constraints>');
    expect(tpl).toContain('<instructions>');
    expect(tpl).toContain('<output_format>');

    // Interdictions formelles
    expect(tpl).toContain('INTERDICTION de présenter un positionnement comme validé s\'il ne repose sur aucune preuve empirique');
    expect(tpl).toContain('INTERDICTION de promettre un résultat financier garanti');
    expect(tpl).toContain('INTERDICTION de fixer prématurément le format technique final');
    expect(tpl).toContain('INTERDICTION de rédiger la page de vente ou le texte publicitaire');
    expect(tpl).toContain('CAS A (Données clients ou preuves réelles fournies)');
    expect(tpl).toContain('CAS B (Absence de données clients)');
  });

  // =========================================================================
  // 8. Étape 2 : Compilation dynamique des variables dans le PromptBuilder
  // =========================================================================
  it('8. compile dynamiquement les variables du profil dans le PromptBuilder', () => {
    setupWorkspaceForDay(3, 'prompt');

    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText(/Compilateur du Prompt Maître de Positionnement/i)).toBeInTheDocument();

    // Renseigner les champs du prompt builder
    const audienceInput = screen.getByPlaceholderText(/Consultants indépendants débordés/i);
    fireEvent.change(audienceInput, { target: { value: 'Formateurs FLE pour expatriés' } });

    const objectiveInput = screen.getByPlaceholderText(/Bâtir un calendrier de publication/i);
    fireEvent.change(objectiveInput, { target: { value: 'Évaluer le niveau oral en 15 minutes' } });

    // Vérifier que la compilation met à jour le prompt affiché
    expect(screen.getAllByText(/Formateurs FLE pour expatriés/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Évaluer le niveau oral en 15 minutes/i).length).toBeGreaterThan(0);
  });

  // =========================================================================
  // 9. Étape 2 : Copie dans le presse-papier sans régression
  // =========================================================================
  it('9. permet de copier le prompt compilé dans le presse-papier', async () => {
    setupWorkspaceForDay(3, 'prompt');

    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    const copyBtn = screen.getByRole('button', { name: /Copier le prompt/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(writeTextMock).toHaveBeenCalled();
    expect(screen.getByText(/Copié !/i)).toBeInTheDocument();
  });

  // =========================================================================
  // 10. Étape 2 : Bibliothèque des 4 relances ciblées
  // =========================================================================
  it('10. affiche la bibliothèque des 4 relances ciblées pour piloter Claude', () => {
    setupWorkspaceForDay(3, 'prompt');

    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText(/Guide d'exécution et bibliothèque de relances ciblées/i)).toBeInTheDocument();
    expect(screen.getByText(/Si la promesse ressemble à un slogan publicitaire creux/i)).toBeInTheDocument();
    expect(screen.getByText(/Si les alternatives concurrentes sont des entreprises théoriques/i)).toBeInTheDocument();
    expect(screen.getByText(/Si une caractéristique technique est confondue avec la valeur client/i)).toBeInTheDocument();
    expect(screen.getByText(/Pour traquer toute surpromesse financière ou magique/i)).toBeInTheDocument();
  });

  // =========================================================================
  // 11. Étape 3 : Exemple d'école fictif et transparence sur les 5 pages
  // =========================================================================
  it('11. présente le cas d\'école fictif avec avertissement déontologique (5 pages visibles) et 7 volets de déconstruction', () => {
    setupWorkspaceForDay(3, 'example');

    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText(/Analyse critique du positionnement \(Cas d'école fictif\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Le document comporte physiquement cinq pages visibles/i)).toBeInTheDocument();
    expect(screen.getByText(/De la matière statique au positionnement argumenté/i)).toBeInTheDocument();
    expect(screen.getByText(/L'alternative actuelle de l'acheteur/i)).toBeInTheDocument();
    expect(screen.getByText(/Le problème documentaire identifiable/i)).toBeInTheDocument();
    expect(screen.getByText(/Capacité différenciante proposée/i)).toBeInTheDocument();
    expect(screen.getByText(/Valeur concrète pour l'acheteur/i)).toBeInTheDocument();
    expect(screen.getByText(/Preuves disponibles vs Hypothèses restantes/i)).toBeInTheDocument();
    expect(screen.getByText(/Positionnement provisoire retenu/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Promesse de transformation/i).length).toBeGreaterThan(0);
  });

  // =========================================================================
  // 12. Étape 3 : Deux mini-exemples sectoriels et déconstruction des pièges
  // =========================================================================
  it('12. présente deux mini-exemples sectoriels hors conseil et 3 pièges majeurs', () => {
    setupWorkspaceForDay(3, 'example');

    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    // Mini-exemples sectoriels
    expect(screen.getByText(/Deux mini-exemples d'application hors conseil/i)).toBeInTheDocument();
    expect(screen.getByText(/Formation en ligne \/ Préparation de concours/i)).toBeInTheDocument();
    expect(screen.getByText(/Nutrition & Organisation quotidienne/i)).toBeInTheDocument();

    // Pièges majeurs
    expect(screen.getByText(/Trois pièges majeurs lors du positionnement/i)).toBeInTheDocument();
    expect(screen.getByText(/Le piège du concurrent fantôme \(Phantom Competitor\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Le piège de la fonctionnalité orpheline/i)).toBeInTheDocument();
    expect(screen.getByText(/Le piège de la promesse miraculeuse/i)).toBeInTheDocument();
  });

  // =========================================================================
  // 13. Étape 4 : 5 Livrables TextExercise & Persistance LocalStorage
  // =========================================================================
  it('13. propose 5 blocs TextExercise distincts avec persistance LocalStorage', () => {
    const step4 = day03.steps[3];
    const exercises = step4.blocks.filter((b) => b.type === 'text-exercise') as TextExerciseBlock[];
    expect(exercises).toHaveLength(5);
    expect(exercises.map((e) => e.id)).toEqual([
      'day03-deliverable-a-alternatives',
      'day03-deliverable-b-differentiation',
      'day03-deliverable-c-positioning',
      'day03-deliverable-d-promise',
      'day03-deliverable-e-evidence-hypotheses',
    ]);

    setupWorkspaceForDay(3, 'your-turn');

    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByRole('heading', { name: /Livrable A : Matrice des alternatives réelles/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Livrable B : Capacités différenciantes et Valeur client/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Livrable C : Énoncé de positionnement stratégique provisoire/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Livrable D : Promesse de transformation vérifiable/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Livrable E : Balance des preuves disponibles et hypothèses restantes/i })).toBeInTheDocument();

    // Simulation de saisie sur le Livrable C (Positionnement)
    const textareaC = screen.getByPlaceholderText(/Pour \[Segment d'acheteurs en situation\]/i);
    fireEvent.change(textareaC, {
      target: { value: 'Pour les freelances solos, notre outil est un simulateur de devis...' },
    });

    // Contrôle de persistance dans le LocalStorage
    const rawStorage = window.localStorage.getItem(STORAGE_KEY);
    expect(rawStorage).not.toBeNull();
    const parsed = JSON.parse(rawStorage!);
    expect(parsed.exerciseAnswers['day03-deliverable-c-positioning']).toBe(
      'Pour les freelances solos, notre outil est un simulateur de devis...'
    );
  });

  // =========================================================================
  // 14. Étape 4 : Checklist des 8 critères observables
  // =========================================================================
  it('14. gère la checklist des 8 critères observables avec persistance et progression', () => {
    setupWorkspaceForDay(3, 'your-turn');

    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText(/Checklist de validation du positionnement et de la promesse/i)).toBeInTheDocument();
    expect(screen.getByText('0/8 TERMINÉES (0%)')).toBeInTheDocument();

    // Cocher le critère 1
    const chk1 = screen.getByRole('checkbox', { name: /Alternatives réelles identifiées/i });
    expect(chk1).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(chk1);
    expect(chk1).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('1/8 TERMINÉES (13%)')).toBeInTheDocument();

    // Vérifier persistance
    const rawStorage = window.localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(rawStorage!);
    expect(parsed.checklistAnswers['day03-step4-checklist']['chk-real-alternatives']).toBe(true);
  });

  // =========================================================================
  // 15. Étape 4 : Ressources téléchargeables et complétion
  // =========================================================================
  it('15. propose les 2 ressources téléchargeables et gère la complétion de l\'étape', () => {
    const step4 = day03.steps[3];
    const resBlock = step4.blocks.find((b) => b.type === 'resource') as ResourceBlock;
    expect(resBlock).toBeDefined();
    expect(resBlock.resources).toHaveLength(2);
    expect(resBlock.resources[0].downloadFilename).toBe('guide-positionnement-promesse-j03.md');
    expect(resBlock.resources[1].downloadFilename).toBe('matrice-differenciation-promesse-j03.md');

    setupWorkspaceForDay(3, 'your-turn');

    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText(/Ressources méthodologiques téléchargeables/i)).toBeInTheDocument();
    expect(screen.getByText(/Guide méthodologique : Positionnement et Promesse/i)).toBeInTheDocument();
    expect(screen.getByText(/Matrice de différenciation et Promesse de transformation/i)).toBeInTheDocument();

    // Bouton de complétion
    const completeBtn = screen.getByRole('button', { name: /Valider l'étape 4 : À vous de jouer/i });
    expect(completeBtn).toBeInTheDocument();
    fireEvent.click(completeBtn);

    const rawStorage = window.localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(rawStorage!);
    expect(parsed.completedStepIdsByDay[3]).toContain('day-03-step-4');
  });

  // =========================================================================
  // 16. Respect des contraintes négatives absolues du Jour 03
  // =========================================================================
  it('16. respecte les contraintes négatives (zéro prix fixé, zéro format imposé, zéro promesse de revenus)', () => {
    const raw = JSON.stringify(day03).toLowerCase();

    // Aucune fixation de tarif prématurée dans le livrable
    expect(raw).not.toContain('prix fixé à');
    expect(raw).not.toContain('vendu 49 euros');
    expect(raw).not.toContain('tarif de 29 euros');

    // Aucune promesse de revenus magiques garantie
    expect(raw).not.toContain('revenus garantis');
    expect(raw).not.toContain('gagnez 10 000 euros');
    expect(raw).not.toContain('devenez riche');

    // Indépendance du format technique
    expect(raw).toContain('réservés au jour 04');
  });
});
