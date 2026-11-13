import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import * as fs from 'fs';
import * as path from 'path';
import { ProgressProvider } from '../context/ProgressContext';
import { CourseWorkspaceRouter } from '../app/routes';
import { CourseSidebar } from '../components/course/CourseSidebar';
import { COURSE_DATA } from '../data/course';
import { createInitialProgress, saveProgressToStorage, loadProgressFromStorage } from '../utils/storage';
import { day03, PROMPT_L6_NETLIFY_HELP, TEXTE_INSTRUCTIONS_POST_ACHAT } from '../data/days/day-03';
import type {
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
          strings.push(block.title ?? '', block.italicAccent ?? '', block.highlightPill ?? '', ...block.paragraphs, ...(block.bullets ?? []));
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

  const screenshotBlocks = step.blocks.filter((b) => b.type === 'screenshot') as ScreenshotBlockConfig[];
  expect(screenshotBlocks.length, `${step.id} a plus d'une capture d'écran`).toBeLessThanOrEqual(1);

  // Plafond strict de 3 blocs : 1 prose + (0 ou 1 action) + (0 ou 1 screenshot)
  expect(step.blocks.length, `${step.id} contient un nombre incorrect de blocs`).toBe(
    1 + actionBlocks.length + screenshotBlocks.length
  );
  expect(step.blocks.length, `${step.id} dépasse le plafond de 3 cartes`).toBeLessThanOrEqual(3);

  // Ordre ergonomique immuable : prose en premier, capture au milieu si présente, action à la fin
  expect(step.blocks[0]).toBe(prose);
  if (screenshotBlocks.length === 1 && actionBlocks.length === 1) {
    expect(step.blocks[1]).toBe(screenshotBlocks[0]);
    expect(step.blocks[2]).toBe(actionBlocks[0]);
  } else if (screenshotBlocks.length === 1) {
    expect(step.blocks[1]).toBe(screenshotBlocks[0]);
  } else if (actionBlocks.length === 1) {
    expect(step.blocks[1]).toBe(actionBlocks[0]);
  }
}

describe('Journée 3 (Module 3 : PUBLIER ET LIVRER) : Conception Pédagogique et Intégration (Mission 09 LOT B)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Intégrité curriculaire et titres de navigation', () => {
    it('comporte exactement 2 leçons actives avec leurs titres officiels et leurs navigationTitle courts', () => {
      expect(day03.lessons).toHaveLength(2);

      const [l6, l7] = day03.lessons;

      // Lesson 06
      expect(l6.id).toBe('lesson-06');
      expect(l6.lessonNumber).toBe(6);
      expect(l6.moduleId).toBe('module-03');
      expect(l6.dayId).toBe('day-03');
      expect(l6.title).toBe('Publier son application sur Netlify');
      expect(l6.navigationTitle).toBe('Mettre en ligne');
      expect(l6.duration).toBe('~25 min');
      expect(l6.isSkeletonPlaceholder).toBe(false);
      expect(l6.objective).toBeTruthy();
      expect(l6.deliverableSummary).toBeTruthy();
      expect(l6.steps).toHaveLength(3);
      expect(l6.steps.map((s) => s.id)).toEqual([
        'lesson-06-step-01',
        'lesson-06-step-02',
        'lesson-06-step-03',
      ]);

      // Lesson 07
      expect(l7.id).toBe('lesson-07');
      expect(l7.lessonNumber).toBe(7);
      expect(l7.moduleId).toBe('module-03');
      expect(l7.dayId).toBe('day-03');
      expect(l7.title).toBe("Organiser la livraison via Chariow et tester le parcours d'achat");
      expect(l7.navigationTitle).toBe('Vendre sur Chariow');
      expect(l7.duration).toBe('~35 min');
      expect(l7.isSkeletonPlaceholder).toBe(false);
      expect(l7.objective).toBeTruthy();
      expect(l7.deliverableSummary).toBeTruthy();
      expect(l7.steps).toHaveLength(3);
      expect(l7.steps.map((s) => s.id)).toEqual([
        'lesson-07-step-01',
        'lesson-07-step-02',
        'lesson-07-step-03',
      ]);
    });

    it('affiche les titres courts de navigation de la Journée 3 dans CourseSidebar', () => {
      const initial = createInitialProgress();
      initial.activeRoute = {
        kind: 'lesson',
        lessonId: 'lesson-06',
      };
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

  describe('2. Standard éditorial Abigail Peugh, liste noire et anti-slop', () => {
    it('applique le standard éditorial aux 6 étapes (titres <= 2 mots, sous-titres <= 3 mots, ouverture 10-18 mots, <= 80 mots, <= 3 puces, 1 carte prose, <= 1 bloc action)', () => {
      const allSteps = day03.lessons.flatMap((l) => l.steps);
      expect(allSteps).toHaveLength(6);
      allSteps.forEach(assertEditorialStandard);
    });

    it('garantit l’absence des 18 termes interdits dans tout le contenu visible (hors prompts copiables)', () => {
      const fullVisibleText = collectVisibleStrings(day03).join(' \n ');

      BLACKLISTED_TERMS.forEach((term) => {
        expect(
          containsTerm(fullVisibleText, term),
          `Le terme interdit "${term}" a été détecté dans le contenu visible de l'élève en Journée 3 !`
        ).toBe(false);
      });
    });

    it('garantit l’absence formelle de blocs parasites dans day-03 (zéro diagram, quiz, callout, text-exercise)', () => {
      const allSteps = day03.lessons.flatMap((l) => l.steps);
      const bannedTypes = ['diagram', 'quiz', 'callout', 'text-exercise'];

      allSteps.forEach((step) => {
        step.blocks.forEach((block) => {
          expect(bannedTypes.includes(block.type)).toBe(false);
        });
      });
    });

    it('respecte la charte anti-slop sans aucun tiret cadratin dans day-03.ts', () => {
      const day03FilePath = path.resolve(process.cwd(), 'src/data/days/day-03.ts');
      const day03FileContent = fs.readFileSync(day03FilePath, 'utf-8');
      expect(day03FileContent.includes('\u2014')).toBe(false);
    });
  });

  describe('3. Contenu et rigueur technique de la Leçon 06 (Mettre en ligne)', () => {
    it('cadre la structure du dossier mon-application et de index.html en Étape 1', () => {
      const step1 = day03.lessons[0].steps[0];
      const prose = step1.blocks[0] as ProseBlock;
      const chk = step1.blocks[1] as StepChecklistBlock;

      expect(prose.highlightPill).toMatch(/Ne dépose jamais un fichier isolé/i);
      expect(prose.bullets?.some((b) => b.includes('index.html') && b.includes('minuscules'))).toBe(true);
      expect(prose.bullets?.some((b) => b.includes('décompressé'))).toBe(true);
      expect(chk.items.some((i) => i.label.includes('index.html'))).toBe(true);
      expect(chk.items.some((i) => i.label.includes('minuscules'))).toBe(true);

      const mistakes = step1.help?.frequentMistakes ?? [];
      expect(mistakes.some((m) => m.mistake.includes('Index.html') || m.mistake.includes('majuscule'))).toBe(true);
      expect(mistakes.some((m) => m.mistake.includes('.zip'))).toBe(true);
    });

    it('cadre le déploiement sur Netlify Drop et mentionne la limite mensuelle de crédits avec pause en Étape 2', () => {
      const step2 = day03.lessons[0].steps[1];
      const prose = step2.blocks[0] as ProseBlock;

      expect(prose.highlightPill).toMatch(/quota mensuel de crédits : les projets peuvent être mis en pause/i);
      expect(prose.bullets?.some((b) => b.includes('app.netlify.com/drop'))).toBe(true);

      const prompts = step2.help?.troubleshootingPrompts ?? [];
      expect(prompts).toHaveLength(1);
      expect(prompts[0].id).toBe('l6-troubleshoot-404');
      expect(prompts[0].prompt).toBe(PROMPT_L6_NETLIFY_HELP);
    });

    it('distingue la visibilité Public de Netlify et la barrière .gate par code d’accès en Étape 3', () => {
      const step3 = day03.lessons[0].steps[2];
      const prose = step3.blocks[0] as ProseBlock;
      const chk = step3.blocks[2] as StepChecklistBlock;

      expect(prose.highlightPill).toMatch(/Netlify rend ta page publique/i);
      expect(prose.highlightPill).toMatch(/écran de code/i);

      expect(prose.bullets?.some((b) => b.includes('Public') && b.includes('sans mot de passe Netlify'))).toBe(true);
      expect(prose.bullets?.some((b) => b.includes('barrière JavaScript dissuasive') && b.includes('pas une authentification serveur'))).toBe(true);
      expect(prose.bullets?.some((b) => b.includes('mauvais code refusé') && b.includes('bon code accepté'))).toBe(true);

      expect(chk.items).toHaveLength(4);
      expect(chk.items.some((i) => i.label.includes('HTTPS') && i.label.includes('Public'))).toBe(true);
      expect(chk.items.some((i) => i.label.includes('écran de code') && (i.detail ?? '').includes('.gate'))).toBe(true);
      expect(chk.items.some((i) => i.label.includes('mauvais code est refusé') && i.label.includes('bon code déverrouille'))).toBe(true);
      expect(chk.items.some((i) => i.label.includes('ordinateur') && i.label.includes('smartphone'))).toBe(true);
    });
  });

  describe('4. Contenu, Guide d’Accès PDF et rigueur commerciale de la Leçon 07 (Vendre sur Chariow)', () => {
    it('intègre le téléchargement du modèle de Guide d’Accès PDF et préserve les critères de l’offre Fichiers en Étape 1', () => {
      const step1 = day03.lessons[1].steps[0];
      const prose = step1.blocks[0] as ProseBlock;
      const resourceBlock = step1.blocks[1] as ResourceBlock;

      expect(prose.highlightPill).toContain('Guide d’Accès PDF');
      expect(prose.bullets?.some((b) => b.includes('Fichiers') && b.includes('catégorie') && b.includes('prix'))).toBe(true);
      expect(prose.bullets?.some((b) => b.includes('600 × 600 px') && b.includes('702 × 260 px'))).toBe(true);
      expect(prose.bullets?.some((b) => b.includes('Publier'))).toBe(true);

      expect(resourceBlock).toBeDefined();
      expect(resourceBlock.type).toBe('resource');
      expect(resourceBlock.resources).toHaveLength(1);
      const pdfRes = resourceBlock.resources[0];
      expect(pdfRes.externalUrl).toBe('/downloads/GUIDE-ACCES-CLIENT-MODELE.pdf');
      expect(pdfRes.downloadFilename).toBe('GUIDE-ACCES-CLIENT-MODELE.pdf');
      expect(pdfRes.format).toBe('PDF');

      const mistakes = step1.help?.frequentMistakes ?? [];
      expect(mistakes.some((m) => m.mistake.includes('Licences'))).toBe(true);
      expect(mistakes.some((m) => m.correction.includes('Burgundy/Cream'))).toBe(true);
    });

    it('transmet le lien Netlify, le code d’accès et la disponibilité du Guide d’Accès PDF dans TEXTE_INSTRUCTIONS_POST_ACHAT en Étape 2', () => {
      const step2 = day03.lessons[1].steps[1];
      const prose = step2.blocks[0] as ProseBlock;
      const copy = step2.blocks[2] as CopyBlockConfig;

      expect(prose.highlightPill).toMatch(/ne redirige pas automatiquement vers Netlify/i);
      expect(prose.bullets?.some((b) => b.includes('champs entre crochets') && b.includes('code d’accès'))).toBe(true);

      expect(copy.type).toBe('copy');
      expect(copy.id).toBe('l7-s2-copy-instructions');
      expect(copy.content).toBe(TEXTE_INSTRUCTIONS_POST_ACHAT);
      expect(copy.content).toMatch(/\[VOTRE LIEN NETLIFY\]/);
      expect(copy.content).toMatch(/\[VOTRE CODE D'ACCÈS\]/);
      expect(copy.content).toMatch(/Guide d'Accès PDF depuis les fichiers disponibles après votre achat/);
      expect(copy.content).toMatch(/ne sont pas synchronisées automatiquement/);
      expect(copy.content).not.toMatch(/ci-joint/i);
    });

    it('vérifie l’existence et la validité du fichier GUIDE-ACCES-CLIENT-MODELE.pdf', () => {
      const sourcePath = path.resolve(process.cwd(), 'docs/guides/GUIDE-ACCES-CLIENT-SOURCE.md');
      if (fs.existsSync(sourcePath)) {
        const sourceContent = fs.readFileSync(sourcePath, 'utf-8');

        // Vérifie les 10 sections obligatoires
        expect(sourceContent).toContain('## 1. Présentation du produit');
        expect(sourceContent).toContain('## 2. Lien direct');
        expect(sourceContent).toContain("## 3. Code d'accès");
        expect(sourceContent).toContain('## 4. Utilisation sur ordinateur');
        expect(sourceContent).toContain('## 5. Utilisation sur smartphone et tablette');
        expect(sourceContent).toContain('## 6. Sauvegarde des données');
        expect(sourceContent).toContain('## 7. Export et import JSON');
        expect(sourceContent).toContain('## 8. Dépannage');
        expect(sourceContent).toContain('## 9. Contact');
        expect(sourceContent).toContain('## 10. Mises à jour');

        // Vérifie les champs personnalisables obligatoires et l'absence de CREATOR2026 imposé
        expect(sourceContent).toContain('[NOM DE VOTRE APPLICATION]');
        expect(sourceContent).toContain('[DESCRIPTION DE VOTRE APPLICATION]');
        expect(sourceContent).toContain('[VOTRE LIEN NETLIFY]');
        expect(sourceContent).toContain("[VOTRE CODE D'ACCÈS]");
        expect(sourceContent).toContain('[VOTRE EMAIL]');
        expect(sourceContent).toContain('[VOTRE DÉLAI DE RÉPONSE]');
        expect(sourceContent).not.toContain('CREATOR2026');
        expect(sourceContent).toMatch(/ne sont jamais synchronisées automatiquement/i);
        expect(sourceContent).toMatch(/barrière d'accès dissuasive côté client/i);
      }

      // Vérifie l'existence physique et l'en-tête %PDF- du PDF généré
      const pdfPath = path.resolve(process.cwd(), 'public/downloads/GUIDE-ACCES-CLIENT-MODELE.pdf');
      expect(fs.existsSync(pdfPath)).toBe(true);
      const stat = fs.statSync(pdfPath);
      expect(stat.size).toBeGreaterThan(0);
      const header = fs.readFileSync(pdfPath).subarray(0, 5).toString('ascii');
      expect(header).toBe('%PDF-');
    });

    it('cadre le coupon test à 100 % avec 3 restrictions, désactivation obligatoire et distinction Cas A / Cas B en Étape 3', () => {
      const step3 = day03.lessons[1].steps[2];
      const prose = step3.blocks[0] as ProseBlock;
      const chk = step3.blocks[1] as StepChecklistBlock;

      expect(step3.completionLabel).toBe('Contrôles terminés');
      expect(prose.highlightPill).toMatch(/Si Chariow refuse la commande à 0 €, ne paie pas/i);

      expect(prose.bullets?.some((b) => b.includes('1 utilisation totale') && b.includes('1 par client'))).toBe(true);
      expect(prose.bullets?.some((b) => b.includes('Marketing > Réductions'))).toBe(true);

      expect(chk.items).toHaveLength(5);
      expect(chk.items.some((i) => i.label.includes('Fichiers') && i.label.includes('aux bonnes dimensions'))).toBe(true);
      expect(chk.items.some((i) => i.label.includes('restreint au produit') && i.label.includes('1 utilisation maximale') && i.label.includes('1 par client'))).toBe(true);
      expect(chk.items.some((i) => i.label.includes('Si la commande à 0 € est validée') && i.label.includes('guide est téléchargé'))).toBe(true);
      expect(chk.items.some((i) => i.label.includes('Si la commande à 0 € est refusée') && i.label.includes('sans payer mon propre produit'))).toBe(true);
      expect(chk.items.some((i) => i.label.includes('désactivé immédiatement'))).toBe(true);
    });
  });

  describe('5. Rendu UI, repliement HelpPanel, navigation et complétion des leçons', () => {
    it('affiche la Leçon 06 avec HelpPanel replié par défaut et permet de valider ses 3 étapes', () => {
      const initial = createInitialProgress();
      initial.activeRoute = {
        kind: 'lesson',
        lessonId: 'lesson-06',
      };
      saveProgressToStorage(initial);

      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      expect(screen.getByText('06')).toBeInTheDocument();
      expect(screen.getByText(/MODULE 3 : PUBLIER ET LIVRER/i)).toBeInTheDocument();
      expect(screen.getByText(/Publier son/i)).toBeInTheDocument();

      expect(screen.getByText(/Besoin d’aide pour cette étape/i)).toBeInTheDocument();
      expect(screen.queryByText(/Erreurs fréquentes à éviter/i)).not.toBeInTheDocument();

      expect(screen.getByText(/Contrôles du dossier/i)).toBeInTheDocument();
      const validerBtn = screen.getByRole('button', { name: /Dossier vérifié/i });
      fireEvent.click(validerBtn);

      const saved1 = loadProgressFromStorage();
      expect(saved1.completedStepIdsByLesson['lesson-06']).toContain('lesson-06-step-01');

      const tabStep2 = screen.getByRole('tab', { name: /En ligne/i });
      fireEvent.click(tabStep2);

      expect(screen.getByText(/Contrôles de mise en ligne/i)).toBeInTheDocument();
      const btnStep2 = screen.getByRole('button', { name: /Application déployée/i });
      fireEvent.click(btnStep2);

      const saved2 = loadProgressFromStorage();
      expect(saved2.completedStepIdsByLesson['lesson-06']).toContain('lesson-06-step-02');

      const tabStep3 = screen.getByRole('tab', { name: /Accès client/i });
      fireEvent.click(tabStep3);

      expect(screen.getByText(/Contrôles de l’accès client/i)).toBeInTheDocument();
      const btnStep3 = screen.getByRole('button', { name: /Leçon 06 validée/i });
      fireEvent.click(btnStep3);

      const saved3 = loadProgressFromStorage();
      expect(saved3.completedStepIdsByLesson['lesson-06']).toContain('lesson-06-step-03');
    });

    it('affiche la Leçon 07, permet de télécharger le modèle PDF, d’utiliser le CopyBlock et de valider ses 3 étapes', () => {
      const initial = createInitialProgress();
      initial.activeRoute = {
        kind: 'lesson',
        lessonId: 'lesson-07',
      };
      saveProgressToStorage(initial);

      render(
        <ProgressProvider>
          <CourseWorkspaceRouter />
        </ProgressProvider>
      );

      expect(screen.getByText('07')).toBeInTheDocument();
      expect(screen.getByText(/MODULE 3 : PUBLIER ET LIVRER/i)).toBeInTheDocument();
      expect(screen.getByText(/Organiser la/i)).toBeInTheDocument();

      // Étape 1 active avec téléchargement du modèle de Guide d'Accès PDF
      expect(screen.getAllByText(/Modèle de Guide d’Accès PDF/i).length).toBeGreaterThan(0);
      const downloadLink = screen.getByRole('link', { name: /Télécharger/i });
      expect(downloadLink).toHaveAttribute('href', '/downloads/GUIDE-ACCES-CLIENT-MODELE.pdf');

      const btnStep1 = screen.getByRole('button', { name: /Offre créée/i });
      fireEvent.click(btnStep1);

      // Navigation vers l'étape 2
      const tabStep2 = screen.getByRole('tab', { name: /La livraison Guide et message/i });
      fireEvent.click(tabStep2);

      expect(screen.getByText(/Trame des instructions après achat/i)).toBeInTheDocument();
      expect(screen.getByText(/Copier les instructions/i)).toBeInTheDocument();

      const btnStep2 = screen.getByRole('button', { name: /Livraison configurée/i });
      fireEvent.click(btnStep2);

      // Navigation vers l'étape 3
      const tabStep3 = screen.getByRole('tab', { name: /Achat test/i });
      fireEvent.click(tabStep3);

      expect(screen.getByText(/Vérifications du parcours client/i)).toBeInTheDocument();
      const btnStep3 = screen.getByRole('button', { name: /Contrôles terminés/i });
      fireEvent.click(btnStep3);

      const finalProgress = loadProgressFromStorage();
      expect(finalProgress.completedStepIdsByLesson['lesson-07']).toEqual([
        'lesson-07-step-01',
        'lesson-07-step-02',
        'lesson-07-step-03',
      ]);
    });
  });

  describe('6. Captures d’écran authentiques du Jour 3 (Mission 09 LOT C)', () => {
    it('intègre exactement 3 captures réelles réparties sur L6-S2, L6-S3 et L7-S2 (0 sur les 3 autres)', () => {
      const allSteps = day03.lessons.flatMap((l) => l.steps);
      const stepsWithScreenshots = allSteps.filter((s) => s.blocks.some((b) => b.type === 'screenshot'));
      expect(stepsWithScreenshots).toHaveLength(3);
      expect(stepsWithScreenshots.map((s) => s.id)).toEqual([
        'lesson-06-step-02',
        'lesson-06-step-03',
        'lesson-07-step-02',
      ]);

      const screenshots = allSteps.flatMap((s) => s.blocks.filter((b) => b.type === 'screenshot')) as ScreenshotBlockConfig[];
      expect(screenshots).toHaveLength(3);

      screenshots.forEach((sc) => {
        // Présence physique du fichier PNG
        const filePath = path.resolve(process.cwd(), 'public', sc.src.replace(/^\//, ''));
        expect(fs.existsSync(filePath), `Fichier ${sc.src} introuvable`).toBe(true);

        const stat = fs.statSync(filePath);
        expect(stat.size, `Fichier ${sc.src} est vide`).toBeGreaterThan(0);

        // Magic numbers PNG : 89 50 4E 47 0D 0A 1A 0A
        const fd = fs.openSync(filePath, 'r');
        const buffer = Buffer.alloc(8);
        fs.readSync(fd, buffer, 0, 8, 0);
        fs.closeSync(fd);
        const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
        expect(buffer.equals(pngHeader), `${sc.src} n'est pas un fichier PNG valide`).toBe(true);

        // Qualité de l'accessibilité
        expect(sc.alt.trim().length, `alt manquant pour ${sc.id}`).toBeGreaterThan(15);
        expect(sc.caption.trim().length, `caption manquante pour ${sc.id}`).toBeGreaterThan(10);
        expect(sc.capturedAt).toBe('10 novembre 2026');

        // Zéro terme de la liste noire et zéro tiret cadratin
        BLACKLISTED_TERMS.forEach((term) => {
          expect(containsTerm(sc.alt, term), `Terme "${term}" dans alt de ${sc.id}`).toBe(false);
          expect(containsTerm(sc.caption, term), `Terme "${term}" dans caption de ${sc.id}`).toBe(false);
        });
        expect(sc.alt.includes('—'), `Tiret cadratin dans alt de ${sc.id}`).toBe(false);
        expect(sc.caption.includes('—'), `Tiret cadratin dans caption de ${sc.id}`).toBe(false);
      });
    });
  });
});
