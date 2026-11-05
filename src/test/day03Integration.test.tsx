import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { CourseWorkspaceRouter } from '../app/routes';
import { createInitialProgress, saveProgressToStorage } from '../utils/storage';

describe('Jour 03 : Remise à zéro et état vide', () => {
  beforeEach(() => {
    localStorage.clear();
    const initial = createInitialProgress();
    initial.activeRoute = {
      kind: 'course',
      courseId: 'module-01',
      dayNumber: 3,
    };
    saveProgressToStorage(initial);
  });

  it('affiche le titre validé du Jour 03 et le badge de module', () => {
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText(/MODULE 1 : Opportunité et positionnement/i)).toBeInTheDocument();
    expect(
      screen.getByText('Définir sa solution et sa promesse.')
    ).toBeInTheDocument();
  });

  it('affiche le message d état de reconstruction de la leçon', () => {
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(
      screen.getByText('Cette leçon est en cours de reconstruction.')
    ).toBeInTheDocument();
  });

  it('ne propose aucun bouton de complétion ni onglet d étape', () => {
    render(
      <ProgressProvider>
        <CourseWorkspaceRouter />
      </ProgressProvider>
    );

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /valider/i })).not.toBeInTheDocument();
  });
});
