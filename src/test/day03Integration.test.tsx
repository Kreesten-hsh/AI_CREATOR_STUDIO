import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import * as fs from 'fs';
import * as path from 'path';
import { ProgressProvider } from '../context/ProgressContext';
import { CourseWorkspaceRouter } from '../app/routes';
import { CourseSidebar } from '../components/course/CourseSidebar';
import { CourseLayout } from '../components/layout/CourseLayout';
import { COURSE_DATA } from '../data/course';
import { createInitialProgress, saveProgressToStorage, loadProgressFromStorage } from '../utils/storage';
import {
  day03,
  PROMPT_L6_NETLIFY_HELP,
  PROMPT_FICHE_CHARIOW,
  PROMPT_PERSONNALISER_GUIDE,
  TEXTE_INSTRUCTIONS_POST_ACHAT,
} from '../data/days/day-03';
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
    expect(step.subtitle.length, `Sous-titre trop long : ${step.id}`).toBeLessThan(26);
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
  expect(actionBlocks.length, `${step.id} dépasse 3 blocs d'action`).toBeLessThanOrEqual(3);
  expect(step.blocks.length, `${step.id} dépasse 6 blocs`).toBeLessThanOrEqual(6);
}

describe('Journée 3 (Module 3 : PUBLIER ET LIVRER) : Refonte Netlify, Guide A4 & Chariow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Intégrité curriculaire, standard éditorial et anti-slop', () => {
    it('comporte exactement 2 leçons actives et 6 étapes conformes sans jargon ni tiret cadratin', () => {
      expect(day03.lessons).toHaveLength(2);
      const [l6, l7] = day03.lessons;

      expect(l6.id).toBe('lesson-06');
      expect(l6.title).toBe('Publier son application sur Netlify');
      expect(l7.id).toBe('lesson-07');
      expect(l7.title).toBe("Organiser la livraison via Chariow et tester le parcours d'achat");

      const allSteps = day03.lessons.flatMap((l) => l.steps);
      expect(allSteps).toHaveLength(6);
      allSteps.forEach(assertEditorialStandard);

      const fullVisibleText = collectVisibleStrings(day03).join(' \n ');
      BLACKLISTED_TERMS.forEach((term) => {
        expect(containsTerm(fullVisibleText, term), `Terme interdit "${term}" dans day-03`).toBe(false);
      });

      const day03FileContent = fs.readFileSync(
        path.resolve(process.cwd(), 'src/data/days/day-03.ts'),
        'utf-8'
      );
      expect(day03FileContent.includes('\u2014')).toBe(false);
    });

    it('affiche les titres courts de navigation dans CourseSidebar', () => {
      const initial = createInitialProgress();
      initial.activeRoute = { kind: 'lesson', lessonId: 'lesson-06' };
      saveProgressToStorage(initial);

      render(
        <ProgressProvider>
          <CourseSidebar course={COURSE_DATA} />
        </ProgressProvider>
      );

      expect(screen.getByText('Mettre en ligne')).toBeInTheDocument();
      expect(screen.getByText('Vendre sur Chariow')).toBeInTheDocument();
    });
  });

  describe('2. Rigueur technique L6 (Netlify) et ordre logique L7 (Chariow + Guide A4)', () => {
    it('prépare le compte Netlify + fichier index.html en L6-S1 sans dossier mon-app, puis Make public en L6-S2/L6-S3', () => {
      const l6s1 = day03.lessons[0].steps[0];
      const l6s1Text = JSON.stringify(l6s1);
      expect(l6s1Text).toContain('app.netlify.com');
      expect(l6s1Text).toContain('index.html');
      expect(l6s1Text).not.toContain('mon-app');
      expect(l6s1Text).not.toContain('Bon format vs erreurs fréquentes');
      expect(l6s1.blocks.some((b) => b.type === 'diagram')).toBe(false);
      expect(l6s1.blocks.some((b) => b.type === 'callout')).toBe(true);
      const l6s1Callout = l6s1.blocks.find((b) => b.type === 'callout') as CalloutBlock;
      expect(l6s1Callout.content).toContain('24 heures');

      const l6s2Text = JSON.stringify(day03.lessons[0].steps[1]);
      expect(l6s2Text).toContain('compte Netlify gratuit');
      expect(l6s2Text).toContain('Dropped files');
      expect(l6s2Text).toContain('Deploys');
      expect(l6s2Text).not.toContain('mon dossier');
      expect(day03.lessons[0].steps[1].help?.troubleshootingPrompts?.[0].prompt).toBe(
        PROMPT_L6_NETLIFY_HELP
      );

      const l6s3Text = JSON.stringify(day03.lessons[0].steps[2]);
      expect(l6s3Text).toContain('Make public');
      expect(l6s3Text).toContain('Website URL');
      expect(l6s3Text).toContain('Your project is public');
    });

    it('affiche le footer WhatsApp 24/24 pointant vers +229 0161905259 dans CourseLayout', () => {
      render(
        <ProgressProvider>
          <CourseLayout course={COURSE_DATA}>
            <div>Contenu test</div>
          </CourseLayout>
        </ProgressProvider>
      );

      expect(
        screen.getByText('Un problème ? Contactez-nous directement 24/24')
      ).toBeInTheDocument();
      const waLink = screen.getByRole('link', { name: /WhatsApp/i });
      expect(waLink).toHaveAttribute('href', 'https://wa.me/2290161905259');
      expect(waLink).toHaveAttribute('target', '_blank');
    });

    it('corrige l’ordre Chariow (Brouillon en L7-S1 -> Guide A4 HTML+PDF + Publier en L7-S2 -> Coupon 100 % en L7-S3)', () => {
      const l7s1 = day03.lessons[1].steps[0];
      const l7s1Prose = l7s1.blocks[0] as ProseBlock;
      expect(l7s1Prose.highlightPill).toMatch(/Brouillon/i);
      const copyChariow = l7s1.blocks.find((b) => b.type === 'copy') as CopyBlockConfig;
      expect(copyChariow.content).toBe(PROMPT_FICHE_CHARIOW);

      const l7s2 = day03.lessons[1].steps[1];
      const resource = l7s2.blocks.find((b) => b.type === 'resource') as ResourceBlock;
      expect(resource.resources.some((r) => r.externalUrl === '/downloads/GUIDE-ACCES-CLIENT-MODELE.html')).toBe(true);
      expect(resource.resources.some((r) => r.externalUrl === '/downloads/GUIDE-ACCES-CLIENT-MODELE.pdf')).toBe(true);

      const copyBlocks = l7s2.blocks.filter((b) => b.type === 'copy') as CopyBlockConfig[];
      expect(copyBlocks.some((b) => b.content === PROMPT_PERSONNALISER_GUIDE)).toBe(true);
      expect(copyBlocks.some((b) => b.content === TEXTE_INSTRUCTIONS_POST_ACHAT)).toBe(true);
      expect(TEXTE_INSTRUCTIONS_POST_ACHAT).toContain('[VOTRE LIEN NETLIFY]');
      expect(TEXTE_INSTRUCTIONS_POST_ACHAT).toContain("[VOTRE CODE D'ACCÈS]");
      expect(TEXTE_INSTRUCTIONS_POST_ACHAT).toContain('Spams');

      const l7s3Chk = day03.lessons[1].steps[2].blocks.find((b) => b.type === 'checklist') as StepChecklistBlock;
      expect(l7s3Chk.items).toHaveLength(4);
    });

    it('valide les fichiers du nouveau Guide d’Accès Client (HTML neutre + PDF 1 page A4 sans #B63131)', () => {
      const htmlSourcePath = path.resolve(process.cwd(), 'docs/guides/GUIDE-ACCES-CLIENT-MODELE.html');
      const htmlPublicPath = path.resolve(process.cwd(), 'public/downloads/GUIDE-ACCES-CLIENT-MODELE.html');
      const pdfPath = path.resolve(process.cwd(), 'public/downloads/GUIDE-ACCES-CLIENT-MODELE.pdf');

      expect(fs.existsSync(htmlSourcePath)).toBe(true);
      expect(fs.existsSync(htmlPublicPath)).toBe(true);
      expect(fs.existsSync(pdfPath)).toBe(true);

      const htmlContent = fs.readFileSync(htmlSourcePath, 'utf-8');
      expect(htmlContent).not.toContain('#B63131');
      expect(htmlContent).not.toContain('CREATOR2026');
      expect(htmlContent).toContain("--guide-accent:");

      const pdfBuffer = fs.readFileSync(pdfPath);
      expect(pdfBuffer.subarray(0, 5).toString('ascii')).toBe('%PDF-');
      expect(pdfBuffer.length).toBeGreaterThan(5000);
      const pageMatches = pdfBuffer.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? [];
      expect(pageMatches.length).toBe(1);
    });
  });

  describe('3. Rendu UI & Captures d’écran du Jour 3', () => {
    it('permet de parcourir et valider les 3 étapes de la Leçon 07', () => {
      const initial = createInitialProgress();
      initial.activeRoute = { kind: 'lesson', lessonId: 'lesson-07' };
      saveProgressToStorage(initial);

      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      expect(screen.getByText('07')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /Brouillon prêt/i }));
      fireEvent.click(screen.getByRole('tab', { name: /Le Guide/i }));
      expect(screen.getAllByText(/GUIDE-ACCES-CLIENT-MODELE\.html/i).length).toBeGreaterThanOrEqual(1);
      fireEvent.click(screen.getByRole('button', { name: /Produit publié/i }));
      fireEvent.click(screen.getByRole('tab', { name: /Vérifier/i }));
      fireEvent.click(screen.getByRole('button', { name: /Terminer le cours/i }));

      const finalProgress = loadProgressFromStorage();
      expect(finalProgress.completedStepIdsByLesson['lesson-07']).toEqual([
        'lesson-07-step-01',
        'lesson-07-step-02',
        'lesson-07-step-03',
      ]);
    });

    it('vérifie que toutes les captures référencées dans day-03 existent et sont des PNG valides', () => {
      const screenshots = day03.lessons
        .flatMap((l) => l.steps)
        .flatMap((s) => s.blocks.filter((b) => b.type === 'screenshot')) as ScreenshotBlockConfig[];
      expect(screenshots.length).toBeGreaterThanOrEqual(7);

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
