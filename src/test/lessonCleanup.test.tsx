import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { CourseWorkspaceRouter } from '../app/routes';
import { ALL_DAYS } from '../data/course';
import { createInitialProgress, saveProgressToStorage } from '../utils/storage';
import { resolveCourseIdForDay } from '../utils/courseNavigation';

function setupWorkspaceForDay(dayNumber: number) {
  saveProgressToStorage({
    ...createInitialProgress(),
    activeRoute: {
      kind: 'course',
      courseId: resolveCourseIdForDay(dayNumber) ?? 'course-01',
      dayNumber,
    },
  });
}

describe('MISSION 03-B : Editorial and Structural Cleanup Verification', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('1. Day 04 (Skeleton) renders tabs and banner, but NO fake content, NO empty-block card, and NO completion button', () => {
    const day04 = ALL_DAYS.find((d) => d.dayNumber === 4);
    expect(day04?.isSkeletonPlaceholder).toBe(true);
    for (const step of day04!.steps) {
      expect(step.blocks).toEqual([]);
    }

    setupWorkspaceForDay(4);

    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    // Day banner and tabs exist
    const heading = screen.getByRole('heading', { name: /FORMAT/i });
    expect(heading).toHaveTextContent(/FORMAT/i);
    expect(screen.getByText('Comprendre')).toBeInTheDocument();
    expect(screen.getByText('Prompt Claude')).toBeInTheDocument();
    expect(screen.getByText('Exemple guidé')).toBeInTheDocument();
    expect(screen.getByText('À vous de jouer')).toBeInTheDocument();

    // The old generic filler message must be absent
    expect(
      screen.queryByText(/Aucun bloc de contenu configuré pour cette étape/i)
    ).not.toBeInTheDocument();

    // Fake callout, fake video and fake quiz must be absent
    expect(screen.queryByText(/Structure pédagogique : Leçon/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/LEÇON VIDÉO/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Briefing vidéo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/NOTE IMPORTANTE/i)).not.toBeInTheDocument();

    // Completion button must NOT be rendered on empty skeleton steps
    expect(screen.queryByRole('button', { name: /Valider l'étape/i })).not.toBeInTheDocument();
  });

  it('2. Day 06 (Developed) renders full content, quiz, and completion button without redundant NOTE IMPORTANTE callout', () => {
    const day06 = ALL_DAYS.find((d) => d.dayNumber === 6);
    expect(day06?.isSkeletonPlaceholder).toBe(false);

    setupWorkspaceForDay(6);

    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    // Developed title and prose
    const heading = screen.getByRole('heading', { name: /DÉCONSTRUCTION/i });
    expect(heading).toHaveTextContent(/DÉCONSTRUCTION/i);
    expect(heading).toHaveTextContent(/CONTENU STATIQUE/i);
    expect(
      screen.getByText("L'inertie du document statique face à l'outil actif")
    ).toBeInTheDocument();

    // Redundant callout must be absent from Step 1
    expect(screen.queryByText(/NOTE IMPORTANTE/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Distinction clé : Document d'information versus Outil de décision/i)
    ).not.toBeInTheDocument();

    // The explanation was integrated directly into prose
    expect(
      screen.getByText(/La distinction fondamentale est simple : un document d'information transmet des notions/i)
    ).toBeInTheDocument();

    // Quiz is present
    expect(screen.getByText("Validation de la méthode UAM")).toBeInTheDocument();

    // Completion button IS present on developed days
    expect(
      screen.getByRole('button', { name: /Valider l'étape 1 : Comprendre/i })
    ).toBeInTheDocument();
  });

  it('3. Days 06 to 10 have zero video blocks and zero unverified Claude Pro claims', () => {
    const developed = ALL_DAYS.filter((d) => d.dayNumber >= 6 && d.dayNumber <= 10);
    expect(developed).toHaveLength(5);

    for (const day of developed) {
      for (const step of day.steps) {
        expect(step.blocks.filter((b) => b.type === 'video')).toHaveLength(0);
        // Verify no CalloutBox with variant 'important' exists in steps 1 and 2
        const importantCallouts = step.blocks.filter(
          (b) => b.type === 'callout' && b.variant === 'important'
        );
        expect(importantCallouts).toHaveLength(0);
      }
    }

    // Day 07 specific: verify unverified Claude Pro claim and studio brand colors are removed
    const day07 = ALL_DAYS.find((d) => d.dayNumber === 7)!;
    const day07Text = JSON.stringify(day07);
    expect(day07Text).not.toContain('fenêtre de contexte plus large');
    expect(day07Text).not.toContain('#B63131');
    expect(day07Text).not.toContain('#E6A0A8');

    // Day 09 specific: verify studio brand colors are removed from downloadable CSS
    const day09 = ALL_DAYS.find((d) => d.dayNumber === 9)!;
    const day09Text = JSON.stringify(day09);
    expect(day09Text).not.toContain('#B63131');
    expect(day09Text).not.toContain('#E6A0A8');
  });
});
