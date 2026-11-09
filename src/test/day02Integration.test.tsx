import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import * as fs from 'fs';
import * as path from 'path';
import { ProgressProvider } from '../context/ProgressContext';
import { CourseWorkspaceRouter } from '../app/routes';
import { CourseSidebar } from '../components/course/CourseSidebar';
import { COURSE_DATA } from '../data/course';
import { createInitialProgress, saveProgressToStorage } from '../utils/storage';
import {
  day02,
  MASTER_PROMPT_2_XML,
  PROMPT_SIGNAL_STYLE,
  PROMPT_RETOUCHE_CIBLEE,
} from '../data/days/day-02';
import type {
  CopyBlockConfig,
  StepChecklistBlock,
  ProseBlock,
} from '../types/course';

describe('Journée 2 (Module 2 : CRÉER) : Conception Pédagogique et Intégration (Mission 05)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Intégrité curriculaire et titres de navigation', () => {
    it('comporte exactement 3 leçons actives avec leurs titres officiels et leurs navigationTitle courts', () => {
      expect(day02.lessons).toHaveLength(3);

      const [l3, l4, l5] = day02.lessons;

      // Lesson 03
      expect(l3.id).toBe('lesson-03');
      expect(l3.lessonNumber).toBe(3);
      expect(l3.moduleId).toBe('module-02');
      expect(l3.dayId).toBe('day-02');
      expect(l3.title).toBe('Définir sa direction artistique indépendante');
      expect(l3.navigationTitle).toBe('Créer le style');
      expect(l3.duration).toBe('~20 min');
      expect(l3.isSkeletonPlaceholder).toBe(false);
      expect(l3.steps).toHaveLength(3);
      expect(l3.steps.map((s) => s.id)).toEqual([
        'lesson-03-step-01',
        'lesson-03-step-02',
        'lesson-03-step-03',
      ]);

      // Lesson 04
      expect(l4.id).toBe('lesson-04');
      expect(l4.lessonNumber).toBe(4);
      expect(l4.moduleId).toBe('module-02');
      expect(l4.dayId).toBe('day-02');
      expect(l4.title).toBe('Générer la première version (V1) de son application');
      expect(l4.navigationTitle).toBe('Générer');
      expect(l4.duration).toBe('~40 min');
      expect(l4.isSkeletonPlaceholder).toBe(false);
      expect(l4.steps).toHaveLength(3);
      expect(l4.steps.map((s) => s.id)).toEqual([
        'lesson-04-step-01',
        'lesson-04-step-02',
        'lesson-04-step-03',
      ]);

      // Lesson 05
      expect(l5.id).toBe('lesson-05');
      expect(l5.lessonNumber).toBe(5);
      expect(l5.moduleId).toBe('module-02');
      expect(l5.dayId).toBe('day-02');
      expect(l5.title).toBe('Effectuer des retouches ciblées, corriger et tester');
      expect(l5.navigationTitle).toBe('Améliorer');
      expect(l5.duration).toBe('~30 min');
      expect(l5.isSkeletonPlaceholder).toBe(false);
      expect(l5.steps).toHaveLength(3);
      expect(l5.steps.map((s) => s.id)).toEqual([
        'lesson-05-step-01',
        'lesson-05-step-02',
        'lesson-05-step-03',
      ]);
    });

    it('affiche les titres courts de navigation de la Journée 2 dans CourseSidebar', () => {
      const initial = createInitialProgress();
      initial.activeRoute = {
        kind: 'lesson',
        lessonId: 'lesson-03',
      };
      saveProgressToStorage(initial);

      render(
        <ProgressProvider>
          <CourseSidebar course={COURSE_DATA} />
        </ProgressProvider>
      );

      expect(screen.getByText(/Créer le style/i)).toBeInTheDocument();
      expect(screen.getByText(/Générer/i)).toBeInTheDocument();
      expect(screen.getByText(/Améliorer/i)).toBeInTheDocument();
    });

    it('respecte la règle R1 (One Card, One Action) avec ouverture stricte entre 10 et 18 mots et max 80 mots de texte pédagogique', () => {
      const allSteps = [
        ...day02.lessons[0].steps,
        ...day02.lessons[1].steps,
        ...day02.lessons[2].steps,
      ];

      expect(allSteps).toHaveLength(9);

      allSteps.forEach((step) => {
        expect(step.blocks.length).toBeGreaterThanOrEqual(1);
        expect(step.blocks.length).toBeLessThanOrEqual(2);

        const firstBlock = step.blocks[0] as ProseBlock;
        expect(firstBlock.type).toBe('prose');
        expect(firstBlock.title).toBeDefined();
        expect(firstBlock.italicAccent).toBeDefined();
        expect(firstBlock.highlightPill).toBeDefined();
        expect(firstBlock.eyebrow).toBeUndefined();

        // Contrôle strict du nombre de mots d'ouverture : entre 10 et 18 mots
        const opening = firstBlock.paragraphs[0];
        const wordCount = opening.trim().split(/\s+/).length;
        expect(
          wordCount,
          `Ouverture de ${step.id} hors limites (${wordCount} mots) : "${opening}"`
        ).toBeGreaterThanOrEqual(10);
        expect(
          wordCount,
          `Ouverture de ${step.id} trop longue (${wordCount} mots) : "${opening}"`
        ).toBeLessThanOrEqual(18);

        // Calcul du total des mots de prose pédagogique visible
        let totalProseWords = wordCount;
        if (firstBlock.paragraphs.length > 1) {
          for (let i = 1; i < firstBlock.paragraphs.length; i++) {
            totalProseWords += firstBlock.paragraphs[i].trim().split(/\s+/).length;
          }
        }
        if (firstBlock.bullets) {
          for (const b of firstBlock.bullets) {
            totalProseWords += b.trim().split(/\s+/).length;
          }
        }
        expect(
          totalProseWords,
          `Total de prose de ${step.id} dépasse 80 mots (${totalProseWords} mots)`
        ).toBeLessThanOrEqual(80);

        if (step.blocks.length === 2) {
          const secondBlock = step.blocks[1];
          expect(['copy', 'checklist']).toContain(secondBlock.type);
        }
      });
    });

    it('respecte la règle R4 stricte (Titres <= 2 mots / < 18 car. et sous-titres <= 3 mots / < 22 car.)', () => {
      const allSteps = [
        ...day02.lessons[0].steps,
        ...day02.lessons[1].steps,
        ...day02.lessons[2].steps,
      ];

      allSteps.forEach((step) => {
        expect(step.title.length).toBeLessThan(18);
        const titleWords = step.title.trim().split(/\s+/).length;
        expect(
          titleWords,
          `Titre de ${step.id} dépasse 2 mots ("${step.title}")`
        ).toBeLessThanOrEqual(2);

        if (step.subtitle) {
          expect(step.subtitle.length).toBeLessThan(22);
          const subtitleWords = step.subtitle.trim().split(/\s+/).length;
          expect(
            subtitleWords,
            `Sous-titre de ${step.id} dépasse 3 mots ("${step.subtitle}")`
          ).toBeLessThanOrEqual(3);
        }
      });
    });
  });

  describe('2. Absence de jargon technique et charte anti-slop', () => {
    it('garantit l’absence TOTALE des 15 termes interdits dans tout le contenu textuel affiché à l’élève', () => {
      const blacklistedTerms = [
        'invariant',
        'invariants',
        'logique métier',
        'Source Fidelity Mapping',
        'SFM',
        'Product Blueprint',
        'Blueprint',
        'Visual Direction Brief',
        'VDB',
        'artefact',
        'nœuds clés',
        'matrice conceptuelle',
        'transcription accessible',
        'repère pédagogique',
        'mythe du document parfait',
        'persistance volatile',
        'monofichier',
      ];

      const visibleStrings: string[] = [
        day02.title,
        day02.objective,
        day02.deliverableSummary,
      ];

      day02.lessons.forEach((lesson) => {
        visibleStrings.push(
          lesson.title,
          lesson.navigationTitle ?? '',
          lesson.objective,
          lesson.deliverableSummary
        );

        lesson.steps.forEach((step) => {
          visibleStrings.push(step.title, step.subtitle ?? '', step.completionLabel);

          step.blocks.forEach((block) => {
            if (block.type === 'prose') {
              if (block.eyebrow) visibleStrings.push(block.eyebrow);
              if (block.title) visibleStrings.push(block.title);
              if (block.italicAccent) visibleStrings.push(block.italicAccent);
              if (block.highlightPill) visibleStrings.push(block.highlightPill);
              block.paragraphs.forEach((p) => visibleStrings.push(p));
              block.bullets?.forEach((b) => visibleStrings.push(b));
            } else if (block.type === 'copy') {
              visibleStrings.push(block.title, block.label);
              if (block.notes) visibleStrings.push(block.notes);
              if (block.buttonText) visibleStrings.push(block.buttonText);
            } else if (block.type === 'checklist') {
              visibleStrings.push(block.title);
              if (block.description) visibleStrings.push(block.description);
              block.items.forEach((item) => {
                visibleStrings.push(item.label);
                if (item.detail) visibleStrings.push(item.detail);
              });
            }
          });

          if (step.help) {
            step.help.frequentMistakes?.forEach((m) => {
              visibleStrings.push(m.mistake, m.correction);
            });
            step.help.tips?.forEach((t) => visibleStrings.push(t));
          }
        });
      });

      const fullVisibleText = visibleStrings.join(' \n ');

      blacklistedTerms.forEach((term) => {
        const regex = new RegExp(`\\b${term}\\b`, 'i');
        const found = regex.test(fullVisibleText);
        expect(
          found,
          `Le terme interdit "${term}" a été détecté dans le contenu visible de l'élève en Journée 2 !`
        ).toBe(false);
      });
    });

    it('garantit l’absence formelle de blocs parasites dans day-02 (zéro diagram, quiz, callout, text-exercise)', () => {
      const allSteps = [
        ...day02.lessons[0].steps,
        ...day02.lessons[1].steps,
        ...day02.lessons[2].steps,
      ];
      const bannedTypes = ['diagram', 'quiz', 'callout', 'text-exercise'];

      allSteps.forEach((step) => {
        step.blocks.forEach((block) => {
          expect(bannedTypes.includes(block.type)).toBe(false);
        });
      });
    });

    it('respecte la charte anti-slop sans aucun tiret cadratin dans day-02.ts', () => {
      const day02FilePath = path.resolve(process.cwd(), 'src/data/days/day-02.ts');
      const day02FileContent = fs.readFileSync(day02FilePath, 'utf-8');
      expect(day02FileContent.includes('\u2014')).toBe(false);
      expect(day02FileContent.includes('—')).toBe(false);
    });
  });

  describe('3. Parité documentaire et réconciliation des prompts', () => {
    it('garantit la parité exacte entre docs/prompts/PROMPT-GENERATION-PRODUIT-HTML.md et MASTER_PROMPT_2_XML', () => {
      const promptDocPath = path.resolve(
        process.cwd(),
        'docs/prompts/PROMPT-GENERATION-PRODUIT-HTML.md'
      );
      const promptDocContent = fs.readFileSync(promptDocPath, 'utf-8');

      const match = promptDocContent.match(
        /(<prompt id="PROMPT-GENERATION-PRODUIT-HTML".*?<\/prompt>)/s
      );
      expect(match).not.toBeNull();
      const extractedFromDoc = match![1];

      expect(MASTER_PROMPT_2_XML).toBe(extractedFromDoc);
    });

    it('équipe la Leçon 3 du signal court en Étape 1 et garantit ZÉRO CopyBlock en Étape 2 (conversation directe)', () => {
      const l3Step1 = day02.lessons[0].steps[0];
      const copyBlock1 = l3Step1.blocks.find(
        (b) => b.type === 'copy'
      ) as CopyBlockConfig | undefined;

      expect(copyBlock1).toBeDefined();
      expect(copyBlock1?.label).toBe('SIGNAL VISUEL');
      expect(copyBlock1?.content).toBe(PROMPT_SIGNAL_STYLE);
      expect(copyBlock1?.content).toBe('Plan et règles validés, passons au style.');
      expect(copyBlock1?.defaultExpanded).toBe(true);

      const l3Step2 = day02.lessons[0].steps[1];
      const copyBlock2 = l3Step2.blocks.find((b) => b.type === 'copy');
      expect(
        copyBlock2,
        'L3 Étape 2 ne doit comporter aucun CopyBlock : l’élève dialogue directement avec Claude.'
      ).toBeUndefined();

      const l3Step3 = day02.lessons[0].steps[2];
      const checklist3 = l3Step3.blocks.find(
        (b) => b.type === 'checklist'
      ) as StepChecklistBlock | undefined;
      expect(checklist3).toBeDefined();
      expect(checklist3?.items).toHaveLength(3);
    });

    it('équipe la Leçon 4 avec le Master Prompt 2 replié par défaut (defaultExpanded: false) en Étape 1', () => {
      const l4Step1 = day02.lessons[1].steps[0];
      const copyBlock = l4Step1.blocks.find(
        (b) => b.type === 'copy'
      ) as CopyBlockConfig | undefined;

      expect(copyBlock).toBeDefined();
      expect(copyBlock?.label).toBe('PROMPT 2');
      expect(copyBlock?.title).toBe('Génération du code HTML complet');
      expect(copyBlock?.buttonText).toBe('Copier le prompt');
      expect(copyBlock?.defaultExpanded).toBe(false);
      expect(copyBlock?.content).toBe(MASTER_PROMPT_2_XML);
    });

    it('isole et encapsule le jargon technique de Prompt 2 dans un bloc masqué par défaut', () => {
      const l4Step1 = day02.lessons[1].steps[0];
      const copyBlock = l4Step1.blocks.find(
        (b) => b.type === 'copy'
      ) as CopyBlockConfig;

      // Le prompt Claude encapsule les spécifications techniques de production
      expect(copyBlock.content).toContain('Product Blueprint');
      expect(copyBlock.content).toContain('Source Fidelity Mapping');
      expect(copyBlock.content).toContain('Visual Direction Brief');

      // Mais ces termes sont isolés dans le CopyBlock replié par défaut
      expect(copyBlock.defaultExpanded).toBe(false);
      expect(copyBlock.notes).not.toMatch(/Blueprint|SFM|VDB|invariant/i);
    });

    it('équipe la Leçon 5 avec la trame de retouche chirurgicale en Étape 2 et la checklist conditionnelle en Étape 3', () => {
      const l5Step2 = day02.lessons[2].steps[1];
      expect(l5Step2.completionLabel).toBe('Contrôle terminé');
      const copyBlock = l5Step2.blocks.find(
        (b) => b.type === 'copy'
      ) as CopyBlockConfig | undefined;

      expect(copyBlock).toBeDefined();
      expect(copyBlock?.label).toBe('MESSAGE DE RETOUCHE');
      expect(copyBlock?.content).toBe(PROMPT_RETOUCHE_CIBLEE);
      expect(copyBlock?.content).toContain('Comportement actuel');
      expect(copyBlock?.content).toContain('Comportement attendu');
      expect(copyBlock?.content).toContain('Zone concernée');
      expect(copyBlock?.defaultExpanded).toBe(true);

      const l5Step3 = day02.lessons[2].steps[2];
      expect(l5Step3.completionLabel).toBe('Module 02 terminé');
      const proseBlock = l5Step3.blocks[0] as ProseBlock;
      expect(proseBlock.paragraphs[0]).toMatch(/^Quand tes contrôles sont terminés/i);

      const chkBlock = l5Step3.blocks[1] as StepChecklistBlock;
      expect(chkBlock).toBeDefined();
      expect(chkBlock.items).toHaveLength(3);
    });
  });

  describe('4. Vérité technique, protocole QA et ergonomie sans pièges', () => {
    it('distingue rigoureusement l’exécution locale du 100% hors-ligne en L4', () => {
      const l4Step1 = day02.lessons[1].steps[0];
      const prose1 = l4Step1.blocks[0] as ProseBlock;
      expect(prose1.highlightPill).toContain('sans installer de serveur');

      const l4Step3 = day02.lessons[1].steps[2];
      const prose3 = l4Step3.blocks[0] as ProseBlock;
      // Ouverture locale sans serveur
      expect(prose3.paragraphs[0]).toContain('sans installer de serveur');
      // Mention explicite des dépendances externes possibles
      expect(
        prose3.bullets?.some((b) => b.includes('nécessiter une connexion Internet'))
      ).toBe(true);
      // Absence formelle de promesse universelle hors ligne
      expect(
        prose3.bullets?.some((b) => b.includes('sans nécessiter de connexion internet'))
      ).toBe(false);
    });

    it('fournit le guide d’enregistrement anti-pièges (.txt) en L4 Étape 2', () => {
      const l4Step2 = day02.lessons[1].steps[1];
      const prose = l4Step2.blocks[0] as ProseBlock;
      const chk = l4Step2.blocks[1] as StepChecklistBlock;

      expect(prose.bullets?.some((b) => b.includes('index.html.txt'))).toBe(true);
      expect(chk.items.some((i) => i.label.includes('index.html'))).toBe(true);
      expect(l4Step2.help?.frequentMistakes?.some((m) => m.mistake.includes('index.html.txt'))).toBe(true);
    });

    it('impose un protocole QA en 3 dimensions sans données personnelles en L5 Étape 1', () => {
      const l5Step1 = day02.lessons[2].steps[0];
      const prose = l5Step1.blocks[0] as ProseBlock;
      const chk = l5Step1.blocks[1] as StepChecklistBlock;

      expect(prose.highlightPill).toContain('Ne transmets jamais de données confidentielles');
      expect(chk.items).toHaveLength(3);
      expect(chk.items[0].label).toContain('résultats correspondent');
      expect(chk.items[1].label).toContain('saisie vide ou incomplète');
      expect(chk.items[2].label).toContain('375 px');
      expect(chk.items[2].label).toContain('768 px');
      expect(chk.items[2].label).toContain('1280 px');
      expect(l5Step1.help?.frequentMistakes?.some((m) => m.mistake.includes('personnelles sensibles'))).toBe(true);
    });
  });

  describe('5. Rendu UI, navigation et complétion des 3 leçons du Module 02', () => {
    it('affiche la Leçon 03 et permet de naviguer dans ses 3 étapes', () => {
      const initial = createInitialProgress();
      initial.activeRoute = {
        kind: 'lesson',
        lessonId: 'lesson-03',
      };
      saveProgressToStorage(initial);

      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      expect(screen.getByText('03')).toBeInTheDocument();
      expect(screen.getByText(/MODULE 2 : CRÉER/i)).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2 })
      ).toHaveTextContent(/Définir sa direction artistique indépendante/i);

      // Étape 1 active par défaut
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
      expect(tabs[0]).toHaveTextContent(/Le signal/i);
      expect(tabs[1]).toHaveTextContent(/3 styles/i);
      expect(tabs[2]).toHaveTextContent(/Fiche prête/i);
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText(/Plan et règles validés, passons au style/i)).toBeInTheDocument();

      // Navigation vers Étape 2
      fireEvent.click(tabs[1]);
      expect(screen.getByText(/CHOISIR TON/i)).toBeInTheDocument();
      expect(screen.queryByText(/PROMPT 1/i)).not.toBeInTheDocument();

      // Navigation vers Étape 3
      fireEvent.click(tabs[2]);
      expect(screen.getByText(/GARDER TA/i)).toBeInTheDocument();
      expect(screen.getByText(/Contrôle de ta fiche de style/i)).toBeInTheDocument();
    });

    it('affiche la Leçon 04 avec le Prompt 2 replié par défaut et permet de le déplier au clic', () => {
      const initial = createInitialProgress();
      initial.activeRoute = {
        kind: 'lesson',
        lessonId: 'lesson-04',
      };
      saveProgressToStorage(initial);

      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      expect(screen.getByText('04')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2 })
      ).toHaveTextContent(/Générer la première version \(V1\) de son application/i);
      expect(screen.getByText('PROMPT 2')).toBeInTheDocument();

      // Le prompt 2 est masqué par défaut
      expect(screen.queryByText(/PROMPT-GENERATION-PRODUIT-HTML/)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Voir le contenu/i })).toBeInTheDocument();

      // Clic pour déplier
      fireEvent.click(screen.getByRole('button', { name: /Voir le contenu/i }));

      // Maintenant le XML complet est visible
      expect(screen.getByText(/PROMPT-GENERATION-PRODUIT-HTML/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Masquer le contenu/i })).toBeInTheDocument();
    });

    it('affiche la Leçon 05 et permet d’accéder à la trame de retouche chirurgicale', () => {
      const initial = createInitialProgress();
      initial.activeRoute = {
        kind: 'lesson',
        lessonId: 'lesson-05',
      };
      saveProgressToStorage(initial);

      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      expect(screen.getByText('05')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2 })
      ).toHaveTextContent(/Effectuer des retouches ciblées, corriger et tester/i);

      // Étape 1 : grille QA
      expect(screen.getByText(/Grille de contrôle en 3 dimensions/i)).toBeInTheDocument();

      // Navigation vers Étape 2 : trame de retouche
      fireEvent.click(screen.getByRole('tab', { name: /Une retouche/i }));
      expect(screen.getByText(/MESSAGE DE RETOUCHE/i)).toBeInTheDocument();
      expect(screen.getByText(/Voici une retouche précise à apporter/i)).toBeInTheDocument();

      // Navigation vers Étape 3 : validation finale
      fireEvent.click(screen.getByRole('tab', { name: /Fichier prêt/i }));
      expect(screen.getByText(/Validation du produit fini/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Module 02 terminé/i })).toBeInTheDocument();
    });
  });
});
