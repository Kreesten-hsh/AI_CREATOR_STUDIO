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
  CalloutBlock,
  CopyBlockConfig,
  ResourceBlock,
  StepChecklistBlock,
  ProseBlock,
  ScreenshotBlockConfig,
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
          strings.push(
            block.title ?? '',
            block.italicAccent ?? '',
            block.highlightPill ?? '',
            ...block.paragraphs,
            ...(block.bullets ?? [])
          );
        } else if (block.type === 'callout') {
          strings.push(block.title, block.content);
        } else if (block.type === 'diagram') {
          strings.push(block.title ?? '', block.accessibleDescription);
          block.data.nodes.forEach((n) => strings.push(n.label, n.description ?? '', n.tag ?? ''));
        } else if (block.type === 'checklist') {
          strings.push(block.title, block.description ?? '');
          block.items.forEach((item) => strings.push(item.label, item.detail ?? ''));
        } else if (block.type === 'copy') {
          strings.push(block.title, block.label, block.notes ?? '', block.buttonText ?? '');
        } else if (block.type === 'resource') {
          strings.push(block.title, block.description ?? '');
          block.resources.forEach((res) => strings.push(res.title, res.description));
        } else if (block.type === 'screenshot') {
          strings.push(block.alt, block.caption);
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
  expect(countWords(step.title), `Titre de ${step.id} > 2 mots ("${step.title}")`).toBeLessThanOrEqual(2);
  if (step.subtitle) {
    expect(step.subtitle.length, `Sous-titre trop long : ${step.id}`).toBeLessThan(24);
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

  expect((prose.bullets ?? []).length, `${step.id} dépasse 5 puces`).toBeLessThanOrEqual(5);

  const visibleWords = [prose.highlightPill ?? '', ...prose.paragraphs, ...(prose.bullets ?? [])]
    .map(countWords)
    .reduce((a, b) => a + b, 0);
  expect(visibleWords, `Prose visible de ${step.id} = ${visibleWords} mots`).toBeLessThanOrEqual(220);

  const actionBlocks = step.blocks.filter((b) => ACTION_BLOCK_TYPES.includes(b.type));
  expect(actionBlocks.length, `${step.id} dépasse 2 blocs d'action`).toBeLessThanOrEqual(2);

  const calloutOrDiagramBlocks = step.blocks.filter(
    (b) => b.type === 'callout' || b.type === 'diagram'
  );
  expect(calloutOrDiagramBlocks.length, `${step.id} dépasse 1 bloc callout/diagram`).toBeLessThanOrEqual(1);

  const screenshotBlocks = step.blocks.filter((b) => b.type === 'screenshot') as ScreenshotBlockConfig[];
  expect(screenshotBlocks.length, `${step.id} dépasse 2 captures`).toBeLessThanOrEqual(2);

  expect(step.blocks.length, `${step.id} dépasse 5 blocs`).toBeLessThanOrEqual(5);

  // Ordre cohérent : prose en premier, puis éventuellement callout/diagram, puis screenshots, puis actions
  const orderWeight = (type: string): number => {
    if (type === 'prose') return 0;
    if (type === 'callout' || type === 'diagram') return 1;
    if (type === 'screenshot') return 2;
    return 3;
  };
  for (let i = 1; i < step.blocks.length; i++) {
    expect(
      orderWeight(step.blocks[i].type),
      `Ordre incohérent dans ${step.id} (${step.blocks[i - 1].type} -> ${step.blocks[i].type})`
    ).toBeGreaterThanOrEqual(orderWeight(step.blocks[i - 1].type));
  }
}

describe('Journée 1 (Module 1 : CHOISIR) : Refonte Pédagogique SOLDE & Intégration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Intégrité curriculaire et standard éditorial assoupli', () => {
    it('comporte exactement 2 leçons actives avec leurs titres officiels et 3 étapes chacune', () => {
      expect(day01.lessons).toHaveLength(2);

      const [l1, l2] = day01.lessons;
      expect(l1.id).toBe('lesson-01');
      expect(l1.title).toBe('Préparer son document et configurer Claude');
      expect(l1.navigationTitle).toBe('Préparer ton document');
      expect(l1.duration).toBe('~15 min');
      expect(l1.isSkeletonPlaceholder).toBe(false);
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

    it('applique le standard éditorial aux 6 étapes (<= 220 mots, callout/diagram autorisés, ordre cohérent)', () => {
      const allSteps = day01.lessons.flatMap((l) => l.steps);
      expect(allSteps).toHaveLength(6);
      allSteps.forEach(assertEditorialStandard);
    });
  });

  describe('2. Absence de jargon, de tiret cadratin et migration vers SOLDE', () => {
    it('garantit l’absence des 18 termes interdits dans tout le contenu visible', () => {
      const fullVisibleText = collectVisibleStrings(day01).join(' \n ');
      BLACKLISTED_TERMS.forEach((term) => {
        expect(
          containsTerm(fullVisibleText, term),
          `Le terme interdit "${term}" a été détecté dans day-01 !`
        ).toBe(false);
      });
    });

    it('propose le document SOLDE comme exemple facultatif et évite le jargon technique et fichiers .txt dans les leçons', () => {
      const fullVisibleText = collectVisibleStrings(day01).join(' \n ');
      [
        'Marc V2',
        'BFR',
        'FRNG',
        'Trésorerie PME',
        'Fixer un prix qui respecte ton temps',
        'CREATOR2026',
        'mon-projet-app',
        'regles-document.txt',
        '375 px',
        'Au-delà de 30 pages',
      ].forEach((term) => {
        expect(fullVisibleText.includes(term), `Contenu technique ou obsolète "${term}" détecté`).toBe(false);
      });

      const l1Step1 = day01.lessons[0].steps[0];
      const soldeResource = l1Step1.blocks.find((b) => b.type === 'resource') as ResourceBlock | undefined;
      expect(soldeResource).toBeDefined();
      expect(soldeResource?.resources[0].externalUrl).toBe(
        '/downloads/demo-pdfs/SOLDE-EBOOK-BUDGET-MENSUEL-OBJECTIFS.pdf'
      );

      const pdfPath = path.resolve(
        process.cwd(),
        'public/downloads/demo-pdfs/SOLDE-EBOOK-BUDGET-MENSUEL-OBJECTIFS.pdf'
      );
      expect(fs.existsSync(pdfPath)).toBe(true);
    });

    it('respecte la charte anti-slop sans aucun tiret cadratin dans day-01.ts', () => {
      const day01FilePath = path.resolve(process.cwd(), 'src/data/days/day-01.ts');
      const day01FileContent = fs.readFileSync(day01FilePath, 'utf-8');
      expect(day01FileContent.includes('\u2014')).toBe(false);
    });
  });

  describe('3. Parité documentaire et prompts v2.5 simplifiés', () => {
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
      expect(MASTER_PROMPT_1_XML).toBe(match![1]);
      expect(PROMPT_ANALYSE_DOC).toBe(MASTER_PROMPT_1_XML);
      expect(MASTER_PROMPT_1_XML).toContain('version="2.5"');
      expect(MASTER_PROMPT_1_XML).toContain('Pour qui est ce produit exactement');
      expect(MASTER_PROMPT_1_XML).toContain('Quel problème précis aide-t-il à résoudre');
      expect(MASTER_PROMPT_1_XML).toContain('Quel résultat concret');
    });

    it('équipe L1-S2 de l’alerte Safari et du Skill ZIP à importer tel quel', () => {
      const l1Step2 = day01.lessons[0].steps[1];
      const safariCallout = l1Step2.blocks.find((b) => b.type === 'callout') as CalloutBlock | undefined;
      expect(safariCallout).toBeDefined();
      expect(safariCallout?.content).toMatch(/Safari/i);

      const prose = l1Step2.blocks[0] as ProseBlock;
      const bulletText = prose.bullets?.join(' ') ?? '';
      expect(bulletText).toContain('Paramètres > Capacités');
      expect(bulletText).toContain('Création et modification de fichiers');
      expect(bulletText).toContain('Plug-ins');
      expect(bulletText).toContain('Skills');
      expect(bulletText).toContain('sans le décompresser');

      const resourceBlock = l1Step2.blocks.find((b) => b.type === 'resource') as ResourceBlock | undefined;
      expect(resourceBlock?.resources[0].externalUrl).toBe('/downloads/AI-CREATOR-DESIGN-INTELLIGENCE.zip');
    });

    it('équipe L2-S1 du Prompt 1 v2.5, L2-S2 du message de choix et L2-S3 de la relecture sans fichier .txt', () => {
      const copy1 = day01.lessons[1].steps[0].blocks.find((b) => b.type === 'copy') as CopyBlockConfig;
      expect(copy1.label).toBe('PROMPT 1');
      expect(copy1.defaultExpanded).toBe(false);
      expect(copy1.content).toBe(MASTER_PROMPT_1_XML);

      const copy2 = day01.lessons[1].steps[1].blocks.find((b) => b.type === 'copy') as CopyBlockConfig;
      expect(copy2.label).toBe('MESSAGE-CHOIX-IDEE');
      expect(copy2.content).toBe(PROMPT_CHOIX_IDEE);

      const l2Step3 = day01.lessons[1].steps[2];
      const chk = l2Step3.blocks.find((b) => b.type === 'checklist') as StepChecklistBlock;
      expect(chk.items).toHaveLength(3);
      expect(JSON.stringify(l2Step3)).not.toContain('.txt');
    });
  });

  describe('4. Rendu UI & Captures d’écran du Jour 1', () => {
    it('affiche la Leçon 01 et la Leçon 02 avec navigation entre étapes et prompts', () => {
      const initial = createInitialProgress();
      initial.activeRoute = { kind: 'lesson', lessonId: 'lesson-02' };
      saveProgressToStorage(initial);

      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      expect(screen.getByText('02')).toBeInTheDocument();
      expect(screen.getByText('PROMPT 1')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('tab', { name: /Ton choix/i }));
      expect(screen.getByText('MESSAGE-CHOIX-IDEE')).toBeInTheDocument();
    });

    it('vérifie que toutes les captures référencées dans day-01 existent et sont des PNG valides', () => {
      const screenshots = day01.lessons
        .flatMap((l) => l.steps)
        .flatMap((s) => s.blocks.filter((b) => b.type === 'screenshot')) as ScreenshotBlockConfig[];
      expect(screenshots.length).toBeGreaterThanOrEqual(3);

      const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      screenshots.forEach((sc) => {
        const filePath = path.resolve(process.cwd(), 'public', sc.src.replace(/^\//, ''));
        expect(fs.existsSync(filePath), `Fichier ${sc.src} introuvable`).toBe(true);
        const fd = fs.openSync(filePath, 'r');
        const buffer = Buffer.alloc(8);
        fs.readSync(fd, buffer, 0, 8, 0);
        fs.closeSync(fd);
        expect(buffer.equals(pngHeader), `${sc.src} n'est pas un PNG valide`).toBe(true);
        expect(sc.alt.trim().length).toBeGreaterThan(15);
        expect(sc.caption.trim().length).toBeGreaterThan(10);
      });
    });
  });
});
