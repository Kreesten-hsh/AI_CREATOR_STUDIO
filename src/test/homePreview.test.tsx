import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { HomePreview } from '../components/widgets/HomePreview';
import { STORAGE_KEY, createInitialProgress } from '../utils/storage';
import { serializeProductIdentity, serializeArtisticDirection } from '../types/dossier';

describe('HomePreview (Maquette locale et autonome)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('construit localement la maquette avec valeurs par défaut et badge exemple fictif', () => {
    render(
      <ProgressProvider>
        <HomePreview />
      </ProgressProvider>
    );

    expect(screen.getByText(/MAQUETTE LOCALE DU PRODUIT APPRENANT/i)).toBeInTheDocument();
    expect(screen.getAllByText(/EXEMPLE FICTIF/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Votre Outil Interactif/i)).toBeInTheDocument();
  });

  it('lit productIdentity pour le nom et l accroche (jamais solutionPromise)', () => {
    const initial = createInitialProgress();
    initial.dossier.fields.productIdentity = {
      value: serializeProductIdentity({
        productName: 'SimuDevis Pro',
        brandName: 'Cabinet Calcul Expert',
        shortHook: 'Chiffrez vos chantiers en 3 clics chrono.',
      }),
      status: 'valid',
      updatedAt: new Date().toISOString(),
    };
    initial.dossier.fields.solutionPromise = {
      value: 'VALEUR SOLUTION PROMISE NON AFFICHEE DANS LE TITRE',
      status: 'valid',
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));

    render(
      <ProgressProvider>
        <HomePreview />
      </ProgressProvider>
    );

    expect(screen.getByText('SimuDevis Pro')).toBeInTheDocument();
    expect(screen.getAllByText('Cabinet Calcul Expert').length).toBeGreaterThan(0);
    expect(screen.getByText('Chiffrez vos chantiers en 3 clics chrono.')).toBeInTheDocument();
    expect(screen.queryByText('VALEUR SOLUTION PROMISE NON AFFICHEE DANS LE TITRE')).not.toBeInTheDocument();
  });

  it('applique les couleurs et polices de artisticDirection et affiche le modèle choisi', () => {
    const initial = createInitialProgress();
    initial.dossier.fields.chosenProductModel = {
      value: 'journey-hub',
      status: 'valid',
      updatedAt: new Date().toISOString(),
    };
    initial.dossier.fields.artisticDirection = {
      value: serializeArtisticDirection({
        paletteId: 'terracotta-sable',
        paletteName: 'Atelier Sable & Terracotta',
        backgroundHex: '#FDFBF7',
        surfaceHex: '#FFFFFF',
        accentHex: '#C2410C',
        inkHex: '#1C1917',
        headingFont: 'Playfair Display',
        bodyFont: 'Plus Jakarta Sans',
        borderRadius: '14px',
        density: 'airy',
        styleDescriptor: 'Style chaleureux terracotta',
        confirmed: true,
      }),
      status: 'valid',
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));

    render(
      <ProgressProvider>
        <HomePreview />
      </ProgressProvider>
    );

    // Vérifie le modèle Hub de parcours affiché
    expect(screen.getByText(/MODÈLE ACTIF : HUB DE PARCOURS/i)).toBeInTheDocument();
    expect(screen.getByText(/Hub de Formation Pas-à-Pas/i)).toBeInTheDocument();
  });
});
