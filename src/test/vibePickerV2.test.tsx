import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { VibePicker, VIBE_PALETTES } from '../components/widgets/VibePicker';
import { getContrastRatio, hexToRgb, isValidHex } from '../utils/contrast';
import { parseArtisticDirection } from '../types/dossier';

describe('VibePicker v2 & Direction Artistique Dossier', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('Utilitaires de contraste WCAG AA', () => {
    it('calcule la luminance et le ratio de contraste fidèlement', () => {
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('invalid')).toBeNull();

      // Noir sur blanc : 21:1
      const maxContrast = getContrastRatio('#000000', '#FFFFFF');
      expect(maxContrast).toBeCloseTo(21, 0);

      // Blanc sur blanc : 1:1
      const noContrast = getContrastRatio('#FFFFFF', '#FFFFFF');
      expect(noContrast).toBeCloseTo(1, 1);

      // Fond ardoise #0F172A sur encre blanche #FFFFFF : supérieur à 10:1
      const highContrast = getContrastRatio('#0F172A', '#FFFFFF');
      expect(highContrast).toBeGreaterThan(10);
    });

    it('valide les chaînes hexadécimales à 3 et 6 caractères', () => {
      expect(isValidHex('#FFF')).toBe(true);
      expect(isValidHex('#123456')).toBe(true);
      expect(isValidHex('#GGGGGG')).toBe(false);
      expect(isValidHex('123456')).toBe(false);
      expect(isValidHex('#12')).toBe(false);
    });
  });

  describe('Composant VibePicker v2', () => {
    it('affiche l état non confirmé par défaut si l apprenant n a rien validé', () => {
      render(
        <ProgressProvider>
          <VibePicker />
        </ProgressProvider>
      );

      expect(screen.getByText(/NON CONFIRMÉE PAR DÉFAUT/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Confirmer et appliquer cette identité visuelle/i })
      ).toBeInTheDocument();
    });

    it('permet la personnalisation hex et déclenche une alerte de contraste si le ratio est inférieur à 4.5:1', () => {
      render(
        <ProgressProvider>
          <VibePicker />
        </ProgressProvider>
      );

      // Basculer en mode couleur personnalisée
      const switchCustomBtn = screen.getByRole('button', { name: /Personnaliser mes codes Hex/i });
      fireEvent.click(switchCustomBtn);

      // Saisir un texte jaune clair sur fond blanc (très mauvais contraste)
      const inkInput = screen.getByLabelText(/Texte & Contours/i);
      fireEvent.change(inkInput, { target: { value: '#FFFFEE' } });

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/Alerte de contraste WCAG AA/i);
    });

    it('enregistre l identité visuelle structurée dans le champ artisticDirection du dossier lors de la confirmation', () => {
      render(
        <ProgressProvider>
          <VibePicker />
        </ProgressProvider>
      );

      // Sélectionner la 2ème palette (Studio Outremer)
      const cobaltBtn = screen.getByRole('button', { name: new RegExp(VIBE_PALETTES[1].name, 'i') });
      fireEvent.click(cobaltBtn);

      // Confirmer
      const confirmBtn = screen.getByRole('button', { name: /Confirmer et appliquer cette identité visuelle/i });
      fireEvent.click(confirmBtn);

      expect(screen.getByText(/IDENTITÉ CONFIRMÉE/i)).toBeInTheDocument();
      expect(screen.getByText(/Identité visuelle confirmée et enregistrée/i)).toBeInTheDocument();

      // Vérifier le stockage localStorage
      const stored = window.localStorage.getItem('ai_creator_studio_progress_v1');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      const artisticDirectionRaw = parsed.dossier.fields.artisticDirection.value;
      const parsedStyle = parseArtisticDirection(artisticDirectionRaw);

      expect(parsedStyle).toBeDefined();
      expect(parsedStyle?.paletteId).toBe('cobalt-folio');
      expect(parsedStyle?.backgroundHex).toBe(VIBE_PALETTES[1].backgroundHex);
      expect(parsedStyle?.confirmed).toBe(true);
    });
  });
});
