import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { CourseHomePage } from '../components/home/CourseHomePage';
import { CHARIOW_AFFILIATION_URL } from '../components/home/CourseAffiliateCard';
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
    expect(screen.getByRole('heading', { name: /Partage ce cours \+ gagne\s*15%/i })).toBeInTheDocument();
    expect(screen.getByText(/automatiquement affilié sur Chariow/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Récupérer mon lien Chariow/i })
    ).toBeInTheDocument();
  });

  it("pointe le CTA vers l'URL officielle Chariow en nouvel onglet sécurisé sans bouton de copie", () => {
    render(
      <ProgressProvider>
        <CourseHomePage />
      </ProgressProvider>
    );

    const affiliateLink = screen.getByRole('link', { name: /Récupérer mon lien Chariow/i });
    expect(affiliateLink).toHaveAttribute('href', CHARIOW_AFFILIATION_URL);
    expect(affiliateLink).toHaveAttribute('href', 'https://gqqyuklr.mychariow.store/affiliation');
    expect(affiliateLink).toHaveAttribute('target', '_blank');
    expect(affiliateLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(screen.queryByRole('button', { name: /Copier le lien/i })).not.toBeInTheDocument();
    expect(loadProgressFromStorage().activeRoute).toEqual({ kind: 'home' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
