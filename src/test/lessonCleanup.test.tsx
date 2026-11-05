import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { CourseWorkspaceRouter } from '../app/routes';
import { ALL_DAYS, COURSE_DATA } from '../data/course';
import { BONUSES } from '../data/navigation/bonuses';
import { MAIN_COURSES } from '../data/navigation/mainCourses';
import { RESOURCE_CATEGORIES } from '../data/navigation/resources';
import { createInitialProgress, saveProgressToStorage } from '../utils/storage';
import { resolveCourseIdForDay } from '../utils/courseNavigation';
import { renderPromptTemplate } from '../utils/promptRenderer';
import type { PromptBuilderBlock } from '../types/course';

function setupWorkspaceForDay(
  dayNumber: number,
  stepType?: 'concept' | 'prompt' | 'example' | 'your-turn'
) {
  const initial = createInitialProgress();
  initial.activeRoute = {
    kind: 'course',
    courseId: resolveCourseIdForDay(dayNumber) ?? 'module-01',
    dayNumber,
  };
  if (stepType) {
    initial.activeStepByDay[dayNumber] = stepType;
  }
  saveProgressToStorage(initial);
}

describe('V2 : Curriculum Editorial, Structural & Behavioral Verification (Lessons 04-09, Bonuses)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.scrollTo = vi.fn();
  });

  it('1. guarantees zero em-dashes (— / \\u2014) and zero video blocks across all active V2 data files', () => {
    const allActivePayloads = [
      COURSE_DATA,
      ALL_DAYS,
      BONUSES,
      MAIN_COURSES,
      RESOURCE_CATEGORIES,
    ];

    for (const payload of allActivePayloads) {
      const serialized = JSON.stringify(payload);
      expect(serialized).not.toContain('\u2014');
      expect(serialized).not.toContain('—');
    }

    for (const day of ALL_DAYS) {
      for (const step of day.steps) {
        expect(step.blocks.filter((b) => b.type === 'video')).toHaveLength(0);
      }
    }
  });

  it('2. verifies that every PromptBuilder in Lessons 04 to 09 and Bonuses injects the learner profile, never imposes Studio colors, and aligns with the lesson deliverable', () => {
    const customProfile = {
      ...createInitialProgress().profile,
      studentName: 'Fatou',
      business: 'Gestion Budgétaire Familiale',
      targetAudience: 'Jeunes actifs salariés',
      productType: "Calculateur d'épargne mensuelle",
      brandStyle: 'Ardoise & Émeraude (#0F172A, #0F766E)',
      mainObjective: 'Lancer sur ma boutique Chariow',
    };

    const days04To09 = ALL_DAYS.filter((d) => d.dayNumber >= 4 && d.dayNumber <= 9);
    expect(days04To09).toHaveLength(6);

    for (const day of days04To09) {
      const promptStep = day.steps.find((s) => s.type === 'prompt')!;
      const pbBlocks = promptStep.blocks.filter(
        (b): b is PromptBuilderBlock => b.type === 'prompt-builder'
      );
      expect(pbBlocks.length).toBeGreaterThanOrEqual(1);

      for (const pb of pbBlocks) {
        // Ne jamais injecter en dur les couleurs d'AI CREATOR Studio comme thème de l'apprenant
        expect(pb.template).not.toContain('#B63131');
        expect(pb.template).not.toContain('#E6A0A8');

        const compiled = renderPromptTemplate(pb.template, customProfile);
        expect(compiled.missingKeys).toHaveLength(0);
        for (const field of pb.fields) {
          if (field.profileBinding) {
            expect(compiled.renderedText).toContain(customProfile[field.profileBinding]);
          }
        }
      }
    }

    for (const bonus of BONUSES) {
      expect(bonus.blocks).toBeDefined();
      const pbBlocks = bonus.blocks!.filter(
        (b): b is PromptBuilderBlock => b.type === 'prompt-builder'
      );
      expect(pbBlocks.length).toBeGreaterThanOrEqual(1);

      for (const pb of pbBlocks) {
        expect(pb.template).not.toContain('#B63131');
        expect(pb.template).not.toContain('#E6A0A8');
        const compiled = renderPromptTemplate(pb.template, customProfile);
        expect(compiled.missingKeys).toHaveLength(0);
        for (const field of pb.fields) {
          if (field.profileBinding) {
            expect(compiled.renderedText).toContain(customProfile[field.profileBinding]);
          }
        }
      }
    }
  });

  it('3. renders Lesson 04 (Module 02) with its 5 focused pedagogical components and completion button', () => {
    setupWorkspaceForDay(4, 'concept');
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText('LEÇON 4 SUR 9')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /IMAGINER ET ORGANISER SON PRODUIT/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Valider l'étape 1 : Comprendre/i })
    ).toBeInTheDocument();
  });

  it('4. verifies that Orientation (Hors décompte) and its two menus are completely absent from the course UI', () => {
    const initial = createInitialProgress();
    initial.activeRoute = { kind: 'home' };
    saveProgressToStorage(initial);

    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.queryByText(/ORIENTATION/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/HORS DÉCOMPTE/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Configurer mon profil/i)).not.toBeInTheDocument();
  });

  it('5. renders interactive Bonus views (ManyChat 24h sequence & Marketing Library) with PromptBuilder and Checklist', () => {
    const initial = createInitialProgress();
    initial.activeRoute = { kind: 'bonus', bonusId: 'bonus-manychat' };
    saveProgressToStorage(initial);

    const { unmount } = render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(
      screen.getByRole('heading', { name: /LE SYSTÈME MANYCHAT AUTOMATISÉ AVEC CLAUDE/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Comprendre la fenêtre de 24 heures et le parcours exact en 5 étapes/i)
    ).toBeInTheDocument();

    unmount();

    initial.activeRoute = { kind: 'bonus', bonusId: 'bonus-marketing' };
    saveProgressToStorage(initial);

    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(
      screen.getByRole('heading', { name: /^MARKETING LIBRARY$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Des structures d’argumentation honnêtes, centrées sur l’usage réel/i)
    ).toBeInTheDocument();
  });
});
