import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { CourseWorkspaceRouter } from '../app/routes';
import { createInitialProgress, saveProgressToStorage } from '../utils/storage';

describe('Journée 3 (Module 3 — PUBLIER ET LIVRER) : Leçons 06 et 07 en état squelette', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('affiche la Leçon 06 (Journée 3, Module 3 : PUBLIER ET LIVRER)', () => {
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
    expect(
      screen.getByText(/Publier son application sur/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText('Cette leçon est en cours de reconstruction.')
    ).toBeInTheDocument();
  });

  it('affiche la Leçon 07 (Journée 3, Module 3 : PUBLIER ET LIVRER) sans bouton de complétion', () => {
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
    expect(
      screen.getByText(/Organiser la livraison via Chariow/i)
    ).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /valider/i })).not.toBeInTheDocument();
  });
});
