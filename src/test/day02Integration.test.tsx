import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { CourseWorkspaceRouter } from '../app/routes';
import { createInitialProgress, saveProgressToStorage } from '../utils/storage';

describe('Journée 2 (Module 2 — CRÉER) : Leçons 03, 04 et 05 en état squelette', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('affiche la Leçon 03 (Journée 2, Module 2 : CRÉER)', () => {
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
      screen.getByText(/Définir sa direction artistique/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText('Cette leçon est en cours de reconstruction.')
    ).toBeInTheDocument();
  });

  it('affiche les Leçons 04 et 05 (Journée 2, Module 2 : CRÉER) sans onglet ni bouton de validation', () => {
    const initial = createInitialProgress();
    initial.activeRoute = {
      kind: 'lesson',
      lessonId: 'lesson-04',
    };
    saveProgressToStorage(initial);

    const { unmount } = render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText('04')).toBeInTheDocument();
    expect(
      screen.getByText(/Générer la première version \(V1\)/i)
    ).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();

    unmount();

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
      screen.getByText(/Effectuer des retouches ciblées/i)
    ).toBeInTheDocument();
  });
});
