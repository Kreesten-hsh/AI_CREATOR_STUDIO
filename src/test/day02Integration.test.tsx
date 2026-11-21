import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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
  PROMPT_REPRISE_SESSION,
  PROMPT_AJUSTEMENT_STYLE,
  PROMPT_RETOUCHE_CIBLEE,
} from '../data/days/day-02';
import type {
  CalloutBlock,
  CopyBlockConfig,
  StepChecklistBlock,
  ProseBlock,
  ScreenshotBlockConfig,
  Day,
  Step,
} from '../types/course';

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

  expect(step.blocks.length, `${step.id} dépasse 5 blocs`).toBeLessThanOrEqual(5);
}

describe('Journée 2 (Module 2 : CRÉER) : Refonte Pédagogique SOLDE & Intégration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Intégrité curriculaire et standard éditorial', () => {
    it('comporte exactement 3 leçons actives avec leurs titres officiels et 9 étapes conformes', () => {
      expect(day02.lessons).toHaveLength(3);
      const [l3, l4, l5] = day02.lessons;

      expect(l3.id).toBe('lesson-03');
      expect(l3.title).toBe('Définir sa direction artistique indépendante');
      expect(l4.id).toBe('lesson-04');
      expect(l4.title).toBe('Générer la première version (V1) de son application');
      expect(l5.id).toBe('lesson-05');
      expect(l5.title).toBe('Effectuer des retouches ciblées, corriger et tester');

      const allSteps = day02.lessons.flatMap((l) => l.steps);
      expect(allSteps).toHaveLength(9);
      allSteps.forEach(assertEditorialStandard);
    });

    it('affiche les titres courts de navigation dans CourseSidebar', () => {
      const initial = createInitialProgress();
      initial.activeRoute = { kind: 'lesson', lessonId: 'lesson-03' };
      saveProgressToStorage(initial);

      render(
        <ProgressProvider>
          <CourseSidebar course={COURSE_DATA} />
        </ProgressProvider>
      );

      expect(screen.getByText('Créer ton style')).toBeInTheDocument();
      expect(screen.getByText('Générer ton app')).toBeInTheDocument();
      expect(screen.getByText('Tester et ajuster')).toBeInTheDocument();
    });
  });

  describe('2. Absence de jargon, de tiret cadratin et parité Prompt 2 v2.2', () => {
    it('garantit l’absence des 18 termes interdits dans le contenu visible et zéro tiret cadratin', () => {
      const fullVisibleText = collectVisibleStrings(day02).join(' \n ');
      BLACKLISTED_TERMS.forEach((term) => {
        expect(containsTerm(fullVisibleText, term), `Terme interdit "${term}" dans day-02`).toBe(false);
      });

      const day02FileContent = fs.readFileSync(
        path.resolve(process.cwd(), 'src/data/days/day-02.ts'),
        'utf-8'
      );
      expect(day02FileContent.includes('\u2014')).toBe(false);
    });

    it('garantit la parité exacte entre docs/prompts/PROMPT-GENERATION-PRODUIT-HTML.md et MASTER_PROMPT_2_XML', () => {
      const promptDocContent = fs.readFileSync(
        path.resolve(process.cwd(), 'docs/prompts/PROMPT-GENERATION-PRODUIT-HTML.md'),
        'utf-8'
      );
      const match = promptDocContent.match(
        /(<prompt id="PROMPT-GENERATION-PRODUIT-HTML".*?<\/prompt>)/s
      );
      expect(match).not.toBeNull();
      expect(MASTER_PROMPT_2_XML).toBe(match![1]);
      expect(MASTER_PROMPT_2_XML).toContain('version="2.3"');
      expect(MASTER_PROMPT_2_XML).toContain('<slug_produit>_access');
      expect(MASTER_PROMPT_2_XML).not.toContain('pricing_access');
    });

    it('équipe L3 de PROMPT_REPRISE_SESSION, d’une direction visuelle sans jargon et de PROMPT_AJUSTEMENT_STYLE', () => {
      const l3Step1 = day02.lessons[0].steps[0];
      const copyBlocks1 = l3Step1.blocks.filter((b) => b.type === 'copy') as CopyBlockConfig[];
      expect(copyBlocks1.some((b) => b.content === PROMPT_SIGNAL_STYLE)).toBe(true);
      expect(copyBlocks1.some((b) => b.content === PROMPT_REPRISE_SESSION)).toBe(true);

      const l3Step2 = day02.lessons[0].steps[1];
      const copy2 = l3Step2.blocks.find((b) => b.type === 'copy') as CopyBlockConfig | undefined;
      expect(copy2?.content).toBe(PROMPT_AJUSTEMENT_STYLE);
    });

    it('garde les essentiels pratiques sans jargon technique visible (Continuer L4-S1, index.html L4-S2, téléphone L5-S1, retouche L5-S2)', () => {
      const l4Step1Callout = day02.lessons[1].steps[0].blocks.find((b) => b.type === 'callout') as CalloutBlock;
      expect(l4Step1Callout.content).toContain('Continuer');

      const l4Step2Text = JSON.stringify(day02.lessons[1].steps[1]);
      expect(l4Step2Text).toContain('index.html');
      expect(l4Step2Text).toContain('Télécharger');

      const visibleDay02 = collectVisibleStrings(day02).join(' \n ');
      ['375 px', 'Cmd + Opt + I', 'index-v1-backup.html', 'localStorage'].forEach((term) => {
        expect(visibleDay02).not.toContain(term);
      });

      const l5Step1Text = JSON.stringify(day02.lessons[2].steps[0]);
      expect(l5Step1Text).toMatch(/téléphone/i);

      expect(PROMPT_RETOUCHE_CIBLEE).toContain('<!DOCTYPE html>');

      const l5Step3Chk = day02.lessons[2].steps[2].blocks.find((b) => b.type === 'checklist') as StepChecklistBlock;
      expect(l5Step3Chk.items).toHaveLength(2);
    });
  });

  describe('3. Rendu UI et captures d’écran du Jour 2', () => {
    it('affiche la Leçon 04 avec Prompt 2 replié par défaut et la Leçon 05 avec trame de retouche', () => {
      const initial = createInitialProgress();
      initial.activeRoute = { kind: 'lesson', lessonId: 'lesson-04' };
      saveProgressToStorage(initial);

      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      expect(screen.getByText('PROMPT 2')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Voir le contenu/i })).toBeInTheDocument();
    });

    it('vérifie que toutes les captures référencées dans day-02 existent et sont des PNG valides', () => {
      const screenshots = day02.lessons
        .flatMap((l) => l.steps)
        .flatMap((s) => s.blocks.filter((b) => b.type === 'screenshot')) as ScreenshotBlockConfig[];
      expect(screenshots.length).toBeGreaterThanOrEqual(4);

      const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      screenshots.forEach((sc) => {
        const filePath = path.resolve(process.cwd(), 'public', sc.src.replace(/^\//, ''));
        expect(fs.existsSync(filePath), `Fichier ${sc.src} introuvable`).toBe(true);
        const fd = fs.openSync(filePath, 'r');
        const buffer = Buffer.alloc(8);
        fs.readSync(fd, buffer, 0, 8, 0);
        fs.closeSync(fd);
        expect(buffer.equals(pngHeader), `${sc.src} n'est pas un PNG valide`).toBe(true);
      });
    });
  });
});
