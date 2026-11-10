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
  Day,
  Step,
} from '../types/course';

// Liste noire commune aux trois journées (18 termes).
const BLACKLISTED_TERMS = [
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
  'heuristique',
  'nœuds clés',
  'matrice conceptuelle',
  'transcription accessible',
  'repère pédagogique',
  'mythe du document parfait',
  'persistance volatile',
  'monofichier',
];

const ACTION_BLOCK_TYPES = ['resource', 'copy', 'checklist'];

const countWords = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

const containsTerm = (text: string, term: string): boolean =>
  new RegExp(`(^|[^\\p{L}])${term}([^\\p{L}]|$)`, 'iu').test(text);

// Contenu visible de l'apprenant, hors contenu des prompts copiables.
function collectVisibleStrings(day: Day): string[] {
  const strings: string[] = [day.title, day.objective, day.deliverableSummary];
  day.lessons.forEach((lesson) => {
    strings.push(lesson.title, lesson.navigationTitle ?? '', lesson.objective, lesson.deliverableSummary);
    lesson.steps.forEach((step) => {
      strings.push(step.title, step.subtitle ?? '', step.completionLabel);
      step.blocks.forEach((block) => {
        if (block.type === 'prose') {
          strings.push(block.title ?? '', block.italicAccent ?? '', block.highlightPill ?? '', ...block.paragraphs, ...(block.bullets ?? []));
        } else if (block.type === 'checklist') {
          strings.push(block.title, block.description ?? '');
          block.items.forEach((item) => strings.push(item.label, item.detail ?? ''));
        } else if (block.type === 'copy') {
          strings.push(block.title, block.label, block.notes ?? '', block.buttonText ?? '');
        } else if (block.type === 'resource') {
          strings.push(block.title, block.description ?? '');
          block.resources.forEach((res) => strings.push(res.title, res.description));
        }
      });
      step.help?.frequentMistakes?.forEach((m) => strings.push(m.mistake, m.correction));
      step.help?.tips?.forEach((t) => strings.push(t));
      step.help?.troubleshootingPrompts?.forEach((p) => strings.push(p.title, p.description));
    });
  });
  return strings;
}

function assertEditorialStandard(step: Step): void {
  expect(step.title.length, `Titre trop long : ${step.id}`).toBeLessThan(18);
  expect(countWords(step.title), `Titre de ${step.id} > 2 mots (\"${step.title}\")`).toBeLessThanOrEqual(2);
  if (step.subtitle) {
    expect(step.subtitle.length, `Sous-titre trop long : ${step.id}`).toBeLessThan(22);
    expect(countWords(step.subtitle), `Sous-titre de ${step.id} > 3 mots`).toBeLessThanOrEqual(3);
  }

  const proseBlocks = step.blocks.filter((b) => b.type === 'prose') as ProseBlock[];
  expect(proseBlocks, `${step.id} doit avoir une seule carte prose`).toHaveLength(1);
  const prose = proseBlocks[0];
  expect(step.blocks[0]).toBe(prose);
  expect(prose.title).toBeTruthy();
  expect(prose.italicAccent).toBeTruthy();
  expect(prose.highlightPill).toBeTruthy();
  expect(prose.eyebrow).toBeUndefined();

  const openingWords = countWords(prose.paragraphs[0]);
  expect(openingWords, `Ouverture de ${step.id} (${openingWords} mots)`).toBeGreaterThanOrEqual(10);
  expect(openingWords, `Ouverture de ${step.id} (${openingWords} mots)`).toBeLessThanOrEqual(18);

  expect((prose.bullets ?? []).length, `${step.id} dépasse 3 puces`).toBeLessThanOrEqual(3);

  const visibleWords = [prose.highlightPill ?? '', ...prose.paragraphs, ...(prose.bullets ?? [])]
    .map(countWords)
    .reduce((a, b) => a + b, 0);
  expect(visibleWords, `Prose visible de ${step.id} = ${visibleWords} mots`).toBeLessThanOrEqual(80);

  const actionBlocks = step.blocks.filter((b) => ACTION_BLOCK_TYPES.includes(b.type));
  expect(actionBlocks.length, `${step.id} a plus d'un bloc d'action`).toBeLessThanOrEqual(1);
  expect(step.blocks.length, `${step.id} contient un bloc non autorisé`).toBe(1 + actionBlocks.length);
}

describe('Journée 1 (Module 1 : CHOISIR) : Finition Éditoriale et Cohérence (Mission 09 LOT B)', () => {
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
      expect(l1.navigationTitle).toBe('Préparer ton document');
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
      expect(l2.navigationTitle).toBe('Choisir ton idée');
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

      expect(screen.getByText('Préparer ton document')).toBeInTheDocument();
      expect(screen.getByText('Choisir ton idée')).toBeInTheDocument();
    });

    it('applique le standard éditorial aux 6 étapes (titres, ouverture, 80 mots, 3 puces, une carte, une action)', () => {
      const allSteps = day01.lessons.flatMap((l) => l.steps);
      expect(allSteps).toHaveLength(6);
      allSteps.forEach(assertEditorialStandard);
    });
  });

  describe('2. Absence de jargon technique dans le contenu visible de l’élève (Règle R4)', () => {
    it('garantit l’absence des 18 termes interdits dans tout le contenu visible (hors prompts copiables)', () => {
      const fullVisibleText = collectVisibleStrings(day01).join(' \n ');

      BLACKLISTED_TERMS.forEach((term) => {
        expect(
          containsTerm(fullVisibleText, term),
          `Le terme interdit "${term}" a été détecté dans le contenu visible de l’élève !`
        ).toBe(false);
      });
    });

    it('n’utilise que le fil rouge du calculateur de prix et aucun ancien exemple financier', () => {
      const fullVisibleText = collectVisibleStrings(day01).join(' \n ');
      ['Marc V2', 'BFR', 'FRNG', 'Trésorerie PME', 'Passif circulant'].forEach((term) => {
        expect(containsTerm(fullVisibleText, term), `Ancien exemple "${term}" détecté`).toBe(false);
      });

      const example = day01.lessons[1].steps[1].blocks[0] as ProseBlock;
      const exampleText = [example.highlightPill, ...example.paragraphs, ...(example.bullets ?? [])].join(' ');
      expect(exampleText).toContain('Fixer un prix qui respecte ton temps et ton travail');
      expect(exampleText).toContain('FCFA');
      expect(exampleText).toContain('euros');
      expect(exampleText).toContain('coût de création ou de matière');
      expect(exampleText).toContain('temps passé');
      expect(exampleText).toContain('tarif horaire');
      expect(exampleText).toContain('frais de vente');
      expect(exampleText).toContain('prix conseillé');
      expect(exampleText).toContain('bénéfice par vente');
    });

    it('présente CREATOR2026 comme un code d’exemple que l’apprenant peut conserver ou remplacer', () => {
      const example = day01.lessons[1].steps[1].blocks[0] as ProseBlock;
      expect(example.highlightPill).toMatch(/CREATOR2026 est un code d’exemple/);
      expect(example.highlightPill).toMatch(/conserver ou le remplacer/);
      expect(example.bullets?.some((b) => b.includes('ton public') && b.includes('code d’accès'))).toBe(true);
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

    it('vérifie la sauvegarde des deux premiers livrables et le signal exact en fin de Leçon 2 (Tâche 7)', () => {
      const l2Step3 = day01.lessons[1].steps[2];
      const proseBlock = l2Step3.blocks[0] as ProseBlock;
      const chkBlock = l2Step3.blocks[1] as StepChecklistBlock;

      expect(proseBlock.bullets?.some((b) => b.includes('ordinateur'))).toBe(true);
      expect(proseBlock.bullets?.some((b) => b.includes('historique Claude'))).toBe(true);
      expect(chkBlock.items.some((item) => item.label.includes('ordinateur'))).toBe(true);

      const stepText = JSON.stringify(l2Step3);
      expect(stepText).toContain('Mon plan d’application');
      expect(stepText).toContain('Les règles de mon document');
      expect(stepText).toContain('code d’accès acheteur');
      expect(stepText).toContain('Plan et règles validés, passons au style.');
      expect(stepText).not.toMatch(/Ma fiche de style/);
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
      expect(bulletText).toContain("'+'");
      expect(bulletText).toContain('+ Create skill');
      expect(bulletText).toContain('Upload a skill');
      expect(bulletText).toContain('sans la décompresser');
      expect(bulletText).toContain('actif');

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
      expect(tabsL1[1]).toHaveTextContent(/Le Skill/i);
      expect(tabsL1[2]).toHaveTextContent(/Prêt/i);

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

    it('affiche la Leçon 02 avec le Calculateur de Prix, le Prompt 1 et la sauvegarde du travail (Tâches 6 & 7)', () => {
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
      expect(tabsL2[2]).toHaveTextContent(/Ton plan/i);

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

      // Navigation vers Étape 2 (tabsL2[1]) : Exemple du Calculateur de Prix & Rentabilité
      fireEvent.click(tabsL2[1]);
      expect(
        screen.getByRole('heading', { level: 3, name: /CHOISIR LE meilleur/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Notre fiche pratique d’une page devient un calculateur de prix en FCFA et euros/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/CREATOR2026 est un code d’exemple : tu peux le conserver ou le remplacer/i)
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
