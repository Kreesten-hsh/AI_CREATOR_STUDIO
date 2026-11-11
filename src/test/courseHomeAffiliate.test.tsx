import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { CourseHomePage } from '../components/home/CourseHomePage';
import { ProgressProvider } from '../context/ProgressContext';
import { STORAGE_KEY, createInitialProgress, loadProgressFromStorage } from '../utils/storage';

describe("Page d'accueil : Encart Affiliation Chariow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    const initial = createInitialProgress();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  });

  it("affiche le Hero et l'encart d'affiliation Chariow en partie inférieure", () => {
    render(
      <ProgressProvider>
        <CourseHomePage />
      </ProgressProvider>
    );

    expect(screen.getByRole('region', { name: 'Présentation de la formation' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: "Programme d'affiliation Chariow" })).toBeInTheDocument();

    expect(screen.getByText('LANCEMENT UNIQUEMENT · CHARIOW')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Partage ce cours \+ gagne\s*20%/i })).toBeInTheDocument();
    expect(screen.getByText(/automatiquement affilié sur Chariow/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Récupérer mon lien Chariow/i })
    ).toBeInTheDocument();
  });

  it("laisse le bouton d'affiliation sans action câblée ni changement de route au clic", () => {
    render(
      <ProgressProvider>
        <CourseHomePage />
      </ProgressProvider>
    );

    const button = screen.getByRole('button', { name: /Récupérer mon lien Chariow/i });
    expect(button).toHaveAttribute('type', 'button');

    fireEvent.click(button);

    expect(loadProgressFromStorage().activeRoute).toEqual({ kind: 'home' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
