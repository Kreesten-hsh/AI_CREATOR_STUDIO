import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { CourseWorkspaceRouter } from '../app/routes';
import { createInitialProgress, saveProgressToStorage } from '../utils/storage';

describe('Journée 1 (Module 1 — CHOISIR) : Leçons 01 et 02 en état squelette', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('affiche la Leçon 01 (Journée 1, Module 1 : CHOISIR) et son état de reconstruction', () => {
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

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText(/SUR 07/i)).toBeInTheDocument();
    expect(screen.getByText(/MODULE 1 : CHOISIR/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Préparer son document et configurer/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText('Cette leçon est en cours de reconstruction.')
    ).toBeInTheDocument();
  });

  it('affiche la Leçon 02 (Journée 1, Module 1 : CHOISIR) sans bouton de complétion ni onglet d étape', () => {
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

    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText(/MODULE 1 : CHOISIR/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Analyser son document, identifier 3 interactions/i)
    ).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /valider/i })).not.toBeInTheDocument();
  });
});
