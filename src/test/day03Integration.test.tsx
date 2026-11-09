import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { CourseWorkspaceRouter } from '../app/routes';
import { CourseSidebar } from '../components/course/CourseSidebar';
import { COURSE_DATA } from '../data/course';
import { createInitialProgress, saveProgressToStorage, loadProgressFromStorage } from '../utils/storage';
import { day03, PROMPT_L6_NETLIFY_HELP, TEXTE_INSTRUCTIONS_POST_ACHAT } from '../data/days/day-03';
import type { CopyBlockConfig, StepChecklistBlock, ProseBlock } from '../types/course';

describe('Journée 3 (Module 3 : PUBLIER ET LIVRER) : Conception Pédagogique et Intégration (Mission 06)', () => {
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
      expect(l6.navigationTitle).toBe('Publier');
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
      expect(l7.navigationTitle).toBe('Vendre');
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

      expect(screen.getByText(/^Publier$/i)).toBeInTheDocument();
      expect(screen.getByText(/^Vendre$/i)).toBeInTheDocument();
    });
  });

  describe('2. Standard éditorial Abigail Peugh (Concision, titres courts et rythme cognitif)', () => {
    it('applique des titres d’étape de 2 mots maximum et des sous-titres de 3 mots maximum', () => {
      for (const lesson of day03.lessons) {
        for (const step of lesson.steps) {
          const titleWords = step.title.trim().split(/\s+/).length;
          expect(titleWords).toBeLessThanOrEqual(2);

          if (step.subtitle) {
            const subtitleWords = step.subtitle.trim().split(/\s+/).length;
            expect(subtitleWords).toBeLessThanOrEqual(3);
          }
        }
      }
    });

    it('débute chaque étape par une phrase d’ouverture active de 10 à 18 mots', () => {
      for (const lesson of day03.lessons) {
        for (const step of lesson.steps) {
          const proseBlock = step.blocks.find((b) => b.type === 'prose') as ProseBlock | undefined;
          expect(proseBlock).toBeDefined();
          expect(proseBlock?.paragraphs.length).toBeGreaterThanOrEqual(1);

          const opener = proseBlock!.paragraphs[0];
          const wordCount = opener.trim().split(/\s+/).length;
          expect(
            wordCount,
            `L'ouverture de l'étape "${step.title}" (${lesson.id}) doit compter entre 10 et 18 mots (actuel: ${wordCount} mots: "${opener}")`
          ).toBeGreaterThanOrEqual(10);
          expect(
            wordCount,
            `L'ouverture de l'étape "${step.title}" (${lesson.id}) doit compter entre 10 et 18 mots (actuel: ${wordCount} mots: "${opener}")`
          ).toBeLessThanOrEqual(18);
        }
      }
    });

    it('respecte un plafond strict de 80 mots de prose visible par étape', () => {
      for (const lesson of day03.lessons) {
        for (const step of lesson.steps) {
          const proseBlocks = step.blocks.filter((b) => b.type === 'prose') as ProseBlock[];
          let totalProseWords = 0;

          for (const block of proseBlocks) {
            for (const p of block.paragraphs) {
              totalProseWords += p.trim().split(/\s+/).length;
            }
            if (block.bullets) {
              for (const bullet of block.bullets) {
                totalProseWords += bullet.trim().split(/\s+/).length;
              }
            }
          }

          expect(
            totalProseWords,
            `Le texte de l'étape "${step.title}" (${lesson.id}) dépasse la limite de 80 mots (actuel: ${totalProseWords} mots)`
          ).toBeLessThanOrEqual(80);
        }
      }
    });

    it('équipe chaque étape d’un highlightPill thématique et d’au plus un bloc d’action immédiate', () => {
      for (const lesson of day03.lessons) {
        for (const step of lesson.steps) {
          const proseBlock = step.blocks.find((b) => b.type === 'prose') as ProseBlock | undefined;
          expect(proseBlock?.highlightPill).toBeTruthy();

          const actionBlocks = step.blocks.filter(
            (b) => b.type === 'checklist' || b.type === 'copy'
          );
          expect(
            actionBlocks.length,
            `L'étape "${step.title}" (${lesson.id}) doit comporter au maximum 1 bloc d'action immédiate`
          ).toBeLessThanOrEqual(1);
        }
      }
    });
  });

  describe('3. Contenu et rigueur technique de la Leçon 06 (Publier)', () => {
    it('cadre la structure du dossier mon-application et de index.html en Étape 1', () => {
      const step1 = day03.lessons[0].steps[0];
      const prose = step1.blocks[0] as ProseBlock;
      const chk = step1.blocks[1] as StepChecklistBlock;

      expect(prose.highlightPill).toMatch(/Ne dépose jamais un fichier isolé/i);
      expect(chk.items.some((i) => i.label.includes('index.html'))).toBe(true);
      expect(chk.items.some((i) => i.label.includes('minuscules'))).toBe(true);

      const mistakes = step1.help?.frequentMistakes ?? [];
      expect(mistakes.some((m) => m.mistake.includes('Index.html') || m.mistake.includes('majuscule'))).toBe(true);
      expect(mistakes.some((m) => m.mistake.includes('.zip'))).toBe(true);
    });

    it('cadre le déploiement sur Netlify Drop et mentionne la limite mensuelle de crédits avec pause en Étape 2', () => {
      const step2 = day03.lessons[0].steps[1];
      const prose = step2.blocks[0] as ProseBlock;

      // Limite des crédits mensuels et mise en pause dans le highlightPill
      expect(prose.highlightPill).toMatch(/quota mensuel de crédits : les projets peuvent être mis en pause/i);
      expect(prose.bullets?.some((b) => b.includes('app.netlify.com/drop'))).toBe(true);

      // Présence du prompt de dépannage 404
      const prompts = step2.help?.troubleshootingPrompts ?? [];
      expect(prompts).toHaveLength(1);
      expect(prompts[0].id).toBe('l6-troubleshoot-404');
      expect(prompts[0].prompt).toBe(PROMPT_L6_NETLIFY_HELP);
    });

    it('cadre la personnalisation du nom, la visibilité publique, le paramétrage par défaut d’équipe et HTTPS sans config manuelle en Étape 3', () => {
      const step3 = day03.lessons[0].steps[2];
      const prose = step3.blocks[0] as ProseBlock;
      const chk = step3.blocks[1] as StepChecklistBlock;

      // Affirme le statut d'application web statique publique
      expect(prose.highlightPill).toMatch(/ton application statique reste publique/i);

      // Chemin complet de renommage
      expect(prose.bullets?.some((b) => b.includes('Project Overview > Customize > Manage project name and cover image'))).toBe(true);

      // Chemin complet de visibilité publique
      expect(prose.bullets?.some((b) => b.includes('Project configuration > General > Visitor access > Project visibility la valeur Public'))).toBe(true);

      // Mention des projets privés par défaut selon l'équipe
      expect(prose.bullets?.some((b) => b.includes('privés par défaut selon l’équipe'))).toBe(true);

      // Certificat HTTPS provisionné automatiquement sans configuration manuelle
      expect(prose.bullets?.some((b) => b.includes('certificat sécurisé HTTPS est provisionné automatiquement sans aucune configuration manuelle'))).toBe(true);

      // Test en navigation privée et smartphone
      expect(prose.bullets?.some((b) => b.includes('navigation privée et sur smartphone'))).toBe(true);

      // Checklist mobile & HTTPS
      expect(chk.items.some((i) => i.label.includes('netlify.app'))).toBe(true);
      expect(chk.items.some((i) => i.label.includes('navigation privée'))).toBe(true);
      expect(chk.items.some((i) => i.label.includes('smartphone'))).toBe(true);
    });
  });

  describe('4. Contenu et rigueur commerciale de la Leçon 07 (Vendre)', () => {
    it('utilise exclusivement le type Files, requiert les dimensions visuelles minimales et le clic sur Publier en Étape 1', () => {
      const step1 = day03.lessons[1].steps[0];
      const prose = step1.blocks[0] as ProseBlock;
      const chk = step1.blocks[1] as StepChecklistBlock;

      expect(prose.bullets?.some((b) => b.includes('Fichiers'))).toBe(true);
      expect(prose.bullets?.some((b) => b.includes('600 × 600 px') && b.includes('702 × 260 px'))).toBe(true);
      expect(prose.bullets?.some((b) => b.includes('Publier'))).toBe(true);
      expect(chk.items.some((i) => i.label.includes('Fichiers'))).toBe(true);

      // Règle de design : interdiction d'imposer la charte Burgundy/Cream du studio
      expect(prose.highlightPill).toMatch(/n’utilise pas la charte Burgundy\/Cream/i);

      // Anti-piège : ne pas prétendre utiliser Licences pour verrouiller
      const mistakes = step1.help?.frequentMistakes ?? [];
      expect(mistakes.some((m) => m.mistake.includes('Licences'))).toBe(true);
      expect(mistakes.some((m) => m.correction.includes('600 × 600 px') && m.correction.includes('702 × 260 px'))).toBe(true);
    });

    it('fournit le Guide PDF et la trame d’instructions après achat sans fausse redirection ni mention ci-joint en Étape 2', () => {
      const step2 = day03.lessons[1].steps[1];
      const prose = step2.blocks[0] as ProseBlock;
      const copy = step2.blocks[1] as CopyBlockConfig;

      // Clarification de la non-protection du site statique
      expect(prose.highlightPill).toMatch(/l’adresse Netlify reste publique/i);

      // CopyBlock des instructions post-achat
      expect(copy.type).toBe('copy');
      expect(copy.id).toBe('l7-s2-copy-instructions');
      expect(copy.content).toBe(TEXTE_INSTRUCTIONS_POST_ACHAT);
      expect(copy.content).toMatch(/Merci pour votre achat/i);
      expect(copy.content).toMatch(/\[VOTRE LIEN NETLIFY\]/i);

      // Formulation exacte : "depuis les fichiers disponibles après votre achat" et bannissement de "ci-joint"
      expect(copy.content).toMatch(/Téléchargez votre Guide d'Accueil PDF depuis les fichiers disponibles après votre achat/i);
      expect(copy.content).not.toMatch(/ci-joint/i);

      // Anti-piège : pas de redirection automatique universelle
      const mistakes = step2.help?.frequentMistakes ?? [];
      expect(mistakes.some((m) => m.mistake.includes('redirige automatiquement'))).toBe(true);
    });

    it('cadre le coupon test à 100 % avec 3 restrictions, désactivation obligatoire et distinction Cas A / Cas B en Étape 3', () => {
      const step3 = day03.lessons[1].steps[2];
      const prose = step3.blocks[0] as ProseBlock;
      const chk = step3.blocks[1] as StepChecklistBlock;

      // Libellé de fin loyal
      expect(step3.completionLabel).toBe('Contrôles terminés');

      // Vérité sur le test à 0 € dans highlightPill
      expect(prose.highlightPill).toMatch(/Si Chariow refuse la commande à 0 €, valide le panier sans payer puis désactive le code/i);

      // Les 3 restrictions du code promo (limité au produit, 1 utilisation totale, 1 par client)
      expect(prose.bullets?.some((b) => b.includes('limité à ton produit') && b.includes('1 utilisation totale') && b.includes('1 par client'))).toBe(true);
      expect(prose.bullets?.some((b) => b.includes('ne paie pas') && b.includes('s’arrête au panier'))).toBe(true);
      expect(prose.bullets?.some((b) => b.includes('Désactive impérativement') && b.includes('Marketing > Réductions'))).toBe(true);

      // Checklist de contrôle du parcours acheteur distinguant Cas A et Cas B
      expect(chk.items).toHaveLength(5);
      expect(chk.items.some((i) => i.label.includes('aux bonnes dimensions'))).toBe(true);
      expect(chk.items.some((i) => i.label.includes('restreint au produit') && i.label.includes('1 utilisation maximale') && i.label.includes('1 par client'))).toBe(true);
      
      // Cas A : commande validée
      expect(chk.items.some((i) => i.label.includes('Si la commande à 0 € est validée') && i.label.includes('guide est téléchargé'))).toBe(true);

      // Cas B : commande refusée sans payer son propre produit
      expect(chk.items.some((i) => i.label.includes('Si la commande à 0 € est refusée') && i.label.includes('sans payer son propre produit'))).toBe(true);

      // Désactivation finale
      expect(chk.items.some((i) => i.label.includes('désactivé immédiatement'))).toBe(true);

      // Anti-piège : ne pas payer son propre produit
      const mistakes = step3.help?.frequentMistakes ?? [];
      expect(mistakes.some((m) => m.mistake.includes('Payer son propre produit'))).toBe(true);
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

      // En-tête de la leçon 06
      expect(screen.getByText('06')).toBeInTheDocument();
      expect(screen.getByText(/MODULE 3 : PUBLIER ET LIVRER/i)).toBeInTheDocument();
      expect(screen.getByText(/Publier son/i)).toBeInTheDocument();

      // HelpPanel replié par défaut (le contenu rétractable n'est pas visible)
      expect(screen.getByText(/Besoin d’aide pour cette étape/i)).toBeInTheDocument();
      expect(screen.queryByText(/Erreurs fréquentes à éviter/i)).not.toBeInTheDocument();

      // Étape 1 active
      expect(screen.getByText(/Contrôles du dossier/i)).toBeInTheDocument();
      const validerBtn = screen.getByRole('button', { name: /Dossier vérifié/i });
      expect(validerBtn).toBeInTheDocument();

      // Validation de l'étape 1
      fireEvent.click(validerBtn);

      const saved1 = loadProgressFromStorage();
      expect(saved1.completedStepIdsByLesson['lesson-06']).toContain('lesson-06-step-01');

      // Navigation vers l'étape 2 via l'onglet
      const tabStep2 = screen.getByRole('tab', { name: /Déployer/i });
      fireEvent.click(tabStep2);

      expect(screen.getByText(/Contrôles de mise en ligne/i)).toBeInTheDocument();
      const btnStep2 = screen.getByRole('button', { name: /Application déployée/i });
      fireEvent.click(btnStep2);

      const saved2 = loadProgressFromStorage();
      expect(saved2.completedStepIdsByLesson['lesson-06']).toContain('lesson-06-step-02');

      // Navigation vers l'étape 3
      const tabStep3 = screen.getByRole('tab', { name: /Rendre public/i });
      fireEvent.click(tabStep3);

      expect(screen.getByText(/Contrôles d’accessibilité mondiale/i)).toBeInTheDocument();
      const btnStep3 = screen.getByRole('button', { name: /Leçon 06 validée/i });
      fireEvent.click(btnStep3);

      const saved3 = loadProgressFromStorage();
      expect(saved3.completedStepIdsByLesson['lesson-06']).toContain('lesson-06-step-03');
    });

    it('affiche la Leçon 07, permet d’utiliser le CopyBlock et de valider ses 3 étapes jusqu’à complétion finale', () => {
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

      // En-tête de la leçon 07
      expect(screen.getByText('07')).toBeInTheDocument();
      expect(screen.getByText(/MODULE 3 : PUBLIER ET LIVRER/i)).toBeInTheDocument();
      expect(screen.getByText(/Organiser la/i)).toBeInTheDocument();

      // Étape 1 active
      expect(screen.getByText(/Contrôles de la fiche produit/i)).toBeInTheDocument();
      const btnStep1 = screen.getByRole('button', { name: /Offre créée/i });
      fireEvent.click(btnStep1);

      // Navigation vers l'étape 2
      const tabStep2 = screen.getByRole('tab', { name: /La livraison/i });
      fireEvent.click(tabStep2);

      // Vérification du CopyBlock sur l'étape 2
      expect(screen.getByText(/Trame des instructions après achat/i)).toBeInTheDocument();
      expect(screen.getByText(/Copier les instructions/i)).toBeInTheDocument();

      const btnStep2 = screen.getByRole('button', { name: /Livraison configurée/i });
      fireEvent.click(btnStep2);

      // Navigation vers l'étape 3
      const tabStep3 = screen.getByRole('tab', { name: /Tester l’achat/i });
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
});
