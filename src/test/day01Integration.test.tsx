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
  day01,
  PROMPT_ANALYSE_DOC,
  PROMPT_CHOIX_IDEE,
  MASTER_PROMPT_1_XML,
} from '../data/days/day-01';
import type {
  CopyBlockConfig,
  ResourceBlock,
  StepChecklistBlock,
  ProseBlock,
} from '../types/course';

describe('Journée 1 (Module 1 : CHOISIR) : Finition Éditoriale et Cohérence (Mission 04-C)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Intégrité curriculaire et titres de navigation (Tâches 3 & 8)', () => {
    it('comporte exactement 2 leçons actives avec leurs titres officiels et leurs navigationTitle courts', () => {
      expect(day01.lessons).toHaveLength(2);

      const l1 = day01.lessons[0];
      const l2 = day01.lessons[1];

      expect(l1.id).toBe('lesson-01');
      expect(l1.title).toBe('Préparer son document et configurer Claude');
      expect(l1.navigationTitle).toBe('Préparer');
      expect(l1.duration).toBe('~15 min');
      expect(l1.isSkeletonPlaceholder).toBe(false);
      expect(l1.steps).toHaveLength(3);
      expect(l1.steps.map((s) => s.id)).toEqual([
        'lesson-01-step-01',
        'lesson-01-step-02',
        'lesson-01-step-03',
      ]);

      expect(l2.id).toBe('lesson-02');
      expect(l2.title).toBe('Analyser son document, identifier 3 interactions et choisir');
      expect(l2.navigationTitle).toBe('Choisir');
      expect(l2.duration).toBe('~30 min');
      expect(l2.isSkeletonPlaceholder).toBe(false);
      expect(l2.steps).toHaveLength(3);
      expect(l2.steps.map((s) => s.id)).toEqual([
        'lesson-02-step-01',
        'lesson-02-step-02',
        'lesson-02-step-03',
      ]);
    });

    it('affiche les titres courts de navigation dans CourseSidebar', () => {
      render(
        <ProgressProvider>
          <CourseSidebar course={COURSE_DATA} />
        </ProgressProvider>
      );

      expect(screen.getByText(/Préparer/i)).toBeInTheDocument();
      expect(screen.getByText(/Choisir/i)).toBeInTheDocument();
    });

    it('respecte la règle R1 (One Card, One Action) avec ouverture stricte entre 10 et 18 mots', () => {
      const allSteps = [...day01.lessons[0].steps, ...day01.lessons[1].steps];

      allSteps.forEach((step) => {
        expect(step.blocks.length).toBeGreaterThanOrEqual(1);
        expect(step.blocks.length).toBeLessThanOrEqual(2);

        const firstBlock = step.blocks[0] as ProseBlock;
        expect(firstBlock.type).toBe('prose');
        expect(firstBlock.title).toBeDefined();
        expect(firstBlock.italicAccent).toBeDefined();
        expect(firstBlock.highlightPill).toBeDefined();
        expect(firstBlock.eyebrow).toBeUndefined();

        // Contrôle strict du nombre de mots : exactement entre 10 et 18 mots max
        const opening = firstBlock.paragraphs[0];
        const wordCount = opening.trim().split(/\s+/).length;
        expect(
          wordCount,
          `Ouverture de ${step.id} trop courte (${wordCount} mots) : "${opening}"`
        ).toBeGreaterThanOrEqual(10);
        expect(
          wordCount,
          `Ouverture de ${step.id} trop longue (${wordCount} mots) : "${opening}"`
        ).toBeLessThanOrEqual(18);

        if (step.blocks.length === 2) {
          const secondBlock = step.blocks[1];
          expect(['resource', 'copy', 'checklist']).toContain(secondBlock.type);
        }
      });
    });

    it('respecte la règle R4 stricte (Titres <= 3 mots / < 18 car. et sous-titres <= 3 mots / < 22 car.)', () => {
      const allSteps = [...day01.lessons[0].steps, ...day01.lessons[1].steps];

      allSteps.forEach((step) => {
        expect(step.title.length).toBeLessThan(18);
        const titleWords = step.title.trim().split(/\s+/).length;
        expect(
          titleWords,
          `Titre de ${step.id} dépasse 3 mots ("${step.title}")`
        ).toBeLessThanOrEqual(3);

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

  describe('2. Absence de jargon technique dans le contenu visible de l’élève (Règle R3)', () => {
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

      // Extraction de toutes les chaînes destinées à être affichées à l'écran
      const visibleStrings: string[] = [
        day01.title,
        day01.objective,
        day01.deliverableSummary,
      ];

      day01.lessons.forEach((lesson) => {
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
              visibleStrings.push(
                block.title ?? '',
                block.italicAccent ?? '',
                block.highlightPill ?? '',
                ...block.paragraphs,
                ...(block.bullets ?? [])
              );
            } else if (block.type === 'checklist') {
              visibleStrings.push(block.title, block.description ?? '');
              block.items.forEach((item) => {
                visibleStrings.push(item.label, item.detail ?? '');
              });
            } else if (block.type === 'copy') {
              visibleStrings.push(block.title, block.label, block.notes ?? '');
            } else if (block.type === 'resource') {
              visibleStrings.push(block.title, block.description ?? '');
              block.resources.forEach((res) => {
                visibleStrings.push(res.title, res.description);
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
          `Le terme interdit "${term}" a été détecté dans le contenu visible de l’élève !`
        ).toBe(false);
      });
    });

    it('garantit l’absence formelle de blocs parasites dans day-01 (zéro diagram, quiz, callout, text-exercise)', () => {
      const allSteps = [...day01.lessons[0].steps, ...day01.lessons[1].steps];
      const bannedTypes = ['diagram', 'quiz', 'callout', 'text-exercise'];

      allSteps.forEach((step) => {
        step.blocks.forEach((block) => {
          expect(bannedTypes.includes(block.type)).toBe(false);
        });
      });
    });

    it('respecte la charte anti-slop sans aucun tiret cadratin dans day-01.ts', () => {
      const day01FilePath = path.resolve(process.cwd(), 'src/data/days/day-01.ts');
      const day01FileContent = fs.readFileSync(day01FilePath, 'utf-8');
      expect(day01FileContent.includes('\u2014')).toBe(false);
      expect(day01FileContent.includes('—')).toBe(false);
    });
  });

  describe('3. Parité documentaire et réconciliation des prompts (Tâches 2 & 7)', () => {
    it('garantit la parité exacte entre docs/prompts/PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE.md et MASTER_PROMPT_1_XML', () => {
      const promptDocPath = path.resolve(
        process.cwd(),
        'docs/prompts/PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE.md'
      );
      const promptDocContent = fs.readFileSync(promptDocPath, 'utf-8');

      const match = promptDocContent.match(
        /(<prompt id="PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE".*?<\/prompt>)/s
      );
      expect(match).not.toBeNull();
      const extractedFromDoc = match![1];

      expect(MASTER_PROMPT_1_XML).toBe(extractedFromDoc);
      expect(PROMPT_ANALYSE_DOC).toBe(MASTER_PROMPT_1_XML);
    });

    it('équipe la Leçon 2 avec le Master Prompt 1 en Étape 1 et le suivi de choix en Étape 2', () => {
      const l2Step1 = day01.lessons[1].steps[0];
      const copyBlock1 = l2Step1.blocks.find(
        (b) => b.type === 'copy'
      ) as CopyBlockConfig | undefined;

      expect(copyBlock1).toBeDefined();
      expect(copyBlock1?.label).toBe('PROMPT 1');
      expect(copyBlock1?.title).toBe('À copier dans Claude');
      expect(copyBlock1?.buttonText).toBe('Copier le prompt');
      expect(copyBlock1?.defaultExpanded).toBe(false);
      expect(copyBlock1?.content).toBe(MASTER_PROMPT_1_XML);

      const l2Step2 = day01.lessons[1].steps[1];
      const copyBlock2 = l2Step2.blocks.find(
        (b) => b.type === 'copy'
      ) as CopyBlockConfig | undefined;

      expect(copyBlock2).toBeDefined();
      expect(copyBlock2?.label).toBe('MESSAGE-CHOIX-IDEE');
      expect(copyBlock2?.content).toBe(PROMPT_CHOIX_IDEE);

      // Vérifie que les consignes à Claude demandent les noms de livrables simples pour l'élève
      expect(MASTER_PROMPT_1_XML).toContain('Mon plan d\'application');
      expect(MASTER_PROMPT_1_XML).toContain('Les règles de mon document');
      expect(MASTER_PROMPT_1_XML).toContain('Ma fiche de style');

      // Vérifie le point de passage vers la Leçon 3
      expect(MASTER_PROMPT_1_XML).toContain('Plan et règles validés, passons au style');
    });

    it('isole et documente formellement l’exception lexicale du prompt technique destiné à Claude', () => {
      const l2Step1 = day01.lessons[1].steps[0];
      const copyBlock1 = l2Step1.blocks.find(
        (b) => b.type === 'copy'
      ) as CopyBlockConfig;

      // Le prompt Claude encapsule les spécifications avancées nécessaires au moteur IA
      expect(copyBlock1.content).toContain('Product Blueprint');
      expect(copyBlock1.content).toContain('Source Fidelity Mapping');
      expect(copyBlock1.content).toContain('Visual Direction Brief');

      // Mais ces termes sont isolés et masqués par défaut pour protéger l'élève du jargon technique
      expect(copyBlock1.defaultExpanded).toBe(false);
      expect(copyBlock1.label).toBe('PROMPT 1');
      expect(copyBlock1.title).toBe('À copier dans Claude');
      expect(copyBlock1.notes).not.toMatch(/Blueprint|SFM|VDB|invariant/i);
    });

    it('vérifie la consigne de conservation du travail en fin de Leçon 2 (Tâche 7)', () => {
      const l2Step3 = day01.lessons[1].steps[2];
      const proseBlock = l2Step3.blocks[0] as ProseBlock;
      const chkBlock = l2Step3.blocks[1] as StepChecklistBlock;

      expect(proseBlock.bullets?.some((b) => b.includes('ordinateur'))).toBe(true);
      expect(proseBlock.bullets?.some((b) => b.includes('historique Claude'))).toBe(true);
      expect(chkBlock.items.some((item) => item.label.includes('ordinateur'))).toBe(true);
    });
  });

  describe('4. Procédure d’installation en 7 gestes et ressource ZIP (Tâche 1)', () => {
    it('expose la procédure officielle actuelle en 7 gestes dans les instructions et l’aide de L1 Étape 2', () => {
      const l1Step2 = day01.lessons[0].steps[1];
      const prose = l1Step2.blocks[0] as ProseBlock;
      const bulletText = prose.bullets?.join(' ') ?? '';

      expect(bulletText).toContain('Settings > Capabilities');
      expect(bulletText).toContain('Code execution and file creation');
      expect(bulletText).toContain('Customize > Skills');
      expect(bulletText).toContain('Upload a skill');

      const helpText = JSON.stringify(l1Step2.help);
      expect(helpText).toContain('Settings > Capabilities');
      expect(helpText).toContain('Code execution and file creation');
    });

    it('expose l’archive ZIP officielle dans public/downloads/ et dans le ResourceBlock de L1 Étape 2', () => {
      const zipPath = path.resolve(
        process.cwd(),
        'public/downloads/AI-CREATOR-DESIGN-INTELLIGENCE.zip'
      );
      expect(fs.existsSync(zipPath)).toBe(true);

      const l1Step2 = day01.lessons[0].steps[1];
      const resourceBlock = l1Step2.blocks.find(
        (b) => b.type === 'resource'
      ) as ResourceBlock | undefined;

      expect(resourceBlock).toBeDefined();
      const zipRes = resourceBlock?.resources.find((r) => r.id === 'res-skill-zip');
      expect(zipRes?.externalUrl).toBe('/downloads/AI-CREATOR-DESIGN-INTELLIGENCE.zip');
    });
  });

  describe('5. Rendu UI, repliement HelpPanel et navigation (Tâches 4, 5 & 6)', () => {
    it('affiche la Leçon 01 avec HelpPanel replié par défaut et guide l’élève jusqu’au Skill', () => {
      const initial = createInitialProgress();
      initial.activeRoute = {
        kind: 'lesson',
        lessonId: 'lesson-01',
      };
      saveProgressToStorage(initial);

      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      // En-tête de leçon
      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByText(/SUR 07/i)).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2 })
      ).toHaveTextContent(/Préparer son document et configurer Claude/i);

      // HelpPanel replié par défaut (Tâche 4)
      expect(screen.queryByText(/Autonomie garantie/i)).not.toBeInTheDocument();
      const helpToggleBtn = screen.getByRole('button', { name: /Besoin d’aide pour cette étape/i });
      expect(helpToggleBtn).toBeInTheDocument();

      // Dépliement en un clic
      fireEvent.click(helpToggleBtn);
      expect(screen.getByText(/Autonomie garantie/i)).toBeInTheDocument();

      // Onglets d'étapes (StepTabs)
      const tabsL1 = screen.getAllByRole('tab');
      expect(tabsL1).toHaveLength(3);
      expect(tabsL1[0]).toHaveTextContent(/Ton document/i);
      expect(tabsL1[1]).toHaveTextContent(/Le Skill Claude/i);
      expect(tabsL1[2]).toHaveTextContent(/Prêt à lancer/i);

      // Étape 1 : Prose
      expect(
        screen.getByRole('heading', { level: 3, name: /CHOISIR TON document/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /J['’]ai mon document/i })
      ).toBeInTheDocument();

      // Navigation vers Étape 2 (tabsL1[1]) : Fichier ZIP et bouton de téléchargement allégé (Tâche 5)
      fireEvent.click(tabsL1[1]);
      expect(
        screen.getByRole('heading', { level: 3, name: /INSTALLER LE skill/i })
      ).toBeInTheDocument();
      expect(
        screen.getAllByText(/AI-CREATOR-DESIGN-INTELLIGENCE\.zip/i).length
      ).toBeGreaterThanOrEqual(1);
      const downloadLink = screen.getByRole('link', { name: /Télécharger/i });
      expect(downloadLink).toHaveAttribute(
        'href',
        '/downloads/AI-CREATOR-DESIGN-INTELLIGENCE.zip'
      );
      expect(
        screen.getByRole('button', { name: /Le Skill est activé/i })
      ).toBeInTheDocument();

      // Navigation vers Étape 3 (tabsL1[2]) : Contrôle de départ et checklist
      fireEvent.click(tabsL1[2]);
      expect(
        screen.getByRole('heading', { level: 3, name: /VÉRIFIER TES outils/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/Vérifications de départ/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Terminer la Leçon 1/i })
      ).toBeInTheDocument();
    });

    it('affiche la Leçon 02 avec le cas Marc corrigé, le Prompt 1 et la sauvegarde du travail (Tâches 6 & 7)', () => {
      const initial = createInitialProgress();
      initial.activeRoute = {
        kind: 'lesson',
        lessonId: 'lesson-02',
      };
      saveProgressToStorage(initial);

      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      // En-tête de leçon
      expect(screen.getByText('02')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2 })
      ).toHaveTextContent(/Analyser son document, identifier 3 interactions et choisir/i);

      const tabsL2 = screen.getAllByRole('tab');
      expect(tabsL2).toHaveLength(3);
      expect(tabsL2[0]).toHaveTextContent(/Tes idées/i);
      expect(tabsL2[0]).toHaveTextContent(/3 options/i);
      expect(tabsL2[1]).toHaveTextContent(/Mon exemple/i);
      expect(tabsL2[2]).toHaveTextContent(/Valider le plan/i);

      // Étape 1 : Prompt maître à copier avec CopyBlock épuré et replié par défaut
      expect(
        screen.getByRole('heading', { level: 3, name: /TROUVER TON idée/i })
      ).toBeInTheDocument();
      expect(screen.getByText('PROMPT 1')).toBeInTheDocument();
      expect(screen.getByText(/À copier dans Claude/i)).toBeInTheDocument();
      const copyBtn1 = screen.getByRole('button', { name: /Copier le prompt/i });
      expect(copyBtn1).toBeInTheDocument();

      // Le contenu XML complet est masqué par défaut derrière le lien discret
      expect(screen.getByRole('button', { name: /Voir le contenu/i })).toBeInTheDocument();
      expect(screen.queryByText(/Directeur Artistique Digital Senior/i)).not.toBeInTheDocument();

      // Dépliement sur clic pour consultation
      fireEvent.click(screen.getByRole('button', { name: /Voir le contenu/i }));
      expect(screen.getByText(/Directeur Artistique Digital Senior/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Masquer le contenu/i })).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: /Claude a proposé 3 idées/i })
      ).toBeInTheDocument();

      // Navigation vers Étape 2 (tabsL2[1]) : Cas Marc corrigé sans client réel (Tâche 6)
      fireEvent.click(tabsL2[1]);
      expect(
        screen.getByRole('heading', { level: 3, name: /CHOISIR LE meilleur/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Pour notre exemple, partons d’une grille d’évaluation de trésorerie contenant huit données d’entrée/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Choisis l’outil qui apporte le résultat le plus utile à ton utilisateur, sans compliquer inutilement son utilisation/i)
      ).toBeInTheDocument();
      expect(screen.queryByText(/moins de deux minutes/i)).not.toBeInTheDocument();
      expect(screen.getByText(/MESSAGE-CHOIX-IDEE/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /J['’]ai choisi mon idée/i })
      ).toBeInTheDocument();

      // Navigation vers Étape 3 (tabsL2[2]) : Validation du plan et sauvegarde
      fireEvent.click(tabsL2[2]);
      expect(
        screen.getByRole('heading', { level: 3, name: /GARDER TON plan/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/Validation du Jour 1/i)).toBeInTheDocument();
      expect(
        screen.getByText(/J['’]ai choisi mon idée parmi les 3 propositions/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Terminer le Jour 1/i })
      ).toBeInTheDocument();
    });
  });
});
