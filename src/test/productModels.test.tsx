import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { PRODUCT_MODELS, getProductModelById } from '../data/productModels';
import { ProgressProvider } from '../context/ProgressContext';
import { TemplatePicker } from '../components/widgets/TemplatePicker';
import { CalculatorPreview } from '../components/widgets/template-previews/CalculatorPreview';
import { JourneyHubPreview } from '../components/widgets/template-previews/JourneyHubPreview';
import { DailyGuidePreview } from '../components/widgets/template-previews/DailyGuidePreview';
import { BrandPagePreview } from '../components/widgets/template-previews/BrandPagePreview';
import { CustomArchitecturePreview } from '../components/widgets/template-previews/CustomArchitecturePreview';
import { STORAGE_KEY, createInitialProgress } from '../utils/storage';

describe('Système de modèles de produit (Données & Aperçus)', () => {
  it('fournit 4 modèles standard plus 1 choix libre avec briefs et fragments provisoires', () => {
    expect(PRODUCT_MODELS).toHaveLength(5);
    const expectedIds = [
      'interactive-calculator',
      'journey-hub',
      'daily-guide',
      'interactive-brand-page',
      'custom-architecture',
    ];
    expect(PRODUCT_MODELS.map((m) => m.id)).toEqual(expectedIds);

    for (const model of PRODUCT_MODELS) {
      expect(model.name).toBeTruthy();
      expect(model.forDocument).toBeTruthy();
      expect(model.defaultFeatures.length).toBeGreaterThan(0);
      expect(model.prefilledBrief.title).toBeTruthy();
      expect(model.prefilledBrief.promise).toBeTruthy();
      expect(model.prefilledBrief.userInputs).toBeTruthy();
      expect(model.prefilledBrief.userOutputs).toBeTruthy();
      expect(model.promptFragment).toContain('[FRAGMENT PROVISOIRE - MISSION C / TEST CLAUDE]');
    }
  });

  it('résout un modèle par son identifiant avec getProductModelById', () => {
    const calc = getProductModelById('interactive-calculator');
    expect(calc).toBeDefined();
    expect(calc?.name).toBe('Calculateur interactif');

    const unknown = getProductModelById('non-existent');
    expect(unknown).toBeUndefined();
  });

  describe('Aperçus visuels internes (exemples fictifs & interactivité)', () => {
    it('rend CalculatorPreview avec badge exemple fictif et calcul réactif', () => {
      render(<CalculatorPreview />);
      expect(screen.getByText(/EXEMPLE FICTIF/i)).toBeInTheDocument();
      expect(screen.getByText(/Simulateur de Revenu Freelance/i)).toBeInTheDocument();

      const slider = screen.getByLabelText(/Tarif \/ Jour/i);
      fireEvent.change(slider, { target: { value: '600' } });
      expect(screen.getByText(/600 €/i)).toBeInTheDocument();
    });

    it('rend JourneyHubPreview avec jalons et badge exemple fictif', () => {
      render(<JourneyHubPreview />);
      expect(screen.getByText(/EXEMPLE FICTIF/i)).toBeInTheDocument();
      expect(screen.getByText(/Hub de Formation Pas-à-Pas/i)).toBeInTheDocument();
      expect(screen.getByText(/JALON 01/i)).toBeInTheDocument();
    });

    it('rend DailyGuidePreview avec streak et sélection de jours', () => {
      render(<DailyGuidePreview />);
      expect(screen.getByText(/EXEMPLE FICTIF/i)).toBeInTheDocument();
      expect(screen.getByText(/STREAK : 1 JOURS/i)).toBeInTheDocument();

      // Clic sur bouton de validation du jour
      const validateBtn = screen.getByRole('button', { name: /Marquer cette journée comme terminée/i });
      fireEvent.click(validateBtn);
      expect(screen.getByText(/Journée validée !/i)).toBeInTheDocument();
    });

    it('rend BrandPagePreview avec configurateur de persona', () => {
      render(<BrandPagePreview />);
      expect(screen.getByText(/EXEMPLE FICTIF/i)).toBeInTheDocument();
      expect(screen.getByText(/Kit Démarrage Solo & Freelance/i)).toBeInTheDocument();

      const pmeBtn = screen.getByRole('button', { name: /PME & Équipe/i });
      fireEvent.click(pmeBtn);
      expect(screen.getByText(/Accompagnement Équipe & Studio/i)).toBeInTheDocument();
    });

    it('rend CustomArchitecturePreview avec briques modulaires activables', () => {
      render(<CustomArchitecturePreview />);
      expect(screen.getByText(/EXEMPLE FICTIF/i)).toBeInTheDocument();
      expect(screen.getByText(/Canevas d’Architecture Sur-Mesure/i)).toBeInTheDocument();
    });
  });
});

describe('Composant TemplatePicker (Accessibilité, Radio et Dossier)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('rend un radiogroup avec 5 options sans contrôles interactifs imbriqués dans les cartes', () => {
    render(
      <ProgressProvider>
        <TemplatePicker />
      </ProgressProvider>
    );

    const radiogroup = screen.getByRole('radiogroup');
    expect(radiogroup).toBeInTheDocument();

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(5);

    // Vérifie que les boutons ne contiennent pas d'autres boutons imbriqués
    for (const radio of radios) {
      expect(radio.querySelectorAll('button')).toHaveLength(0);
    }
  });

  it('sélectionne un modèle et met à jour chosenProductModel dans le dossier', () => {
    render(
      <ProgressProvider>
        <TemplatePicker />
      </ProgressProvider>
    );

    const hubRadio = screen.getByRole('radio', { name: /Hub de parcours/i });
    fireEvent.click(hubRadio);
    expect(hubRadio).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText(/Aperçu interactif du modèle : Hub de parcours/i)).toBeInTheDocument();
  });

  it('applique le brief prérempli directement si le brief existant est vide', () => {
    render(
      <ProgressProvider>
        <TemplatePicker />
      </ProgressProvider>
    );

    const applyBtn = screen.getByRole('button', { name: /Adopter le brief prérempli/i });
    fireEvent.click(applyBtn);

    // Pas de modal si brief initial vide
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText(/a remplacé le contenu du brief/i)).toBeInTheDocument();
  });

  it('demande confirmation via modal si le brief contient déjà du contenu pour éviter tout écrasement silencieux', () => {
    // Initialise avec du contenu dans le brief
    const initial = createInitialProgress();
    initial.dossier.fields.functionalBrief = {
      value: 'Notes existantes rédigées par l apprenant sur son projet.',
      status: 'draft',
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));

    render(
      <ProgressProvider>
        <TemplatePicker />
      </ProgressProvider>
    );

    const applyBtn = screen.getByRole('button', { name: /Adopter le brief prérempli/i });
    fireEvent.click(applyBtn);

    // Modal ouvert
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(screen.getByText(/Votre brief fonctionnel contient déjà du contenu/i)).toBeInTheDocument();

    // Tester Fusionner
    const mergeBtn = screen.getByRole('button', { name: /Fusionner à la suite/i });
    fireEvent.click(mergeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText(/a été fusionné à la suite de vos notes/i)).toBeInTheDocument();
  });
});
