import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { BonusView } from '../components/bonus/BonusView';
import { BONUS_MARKETING_DATA } from '../data/bonuses/bonus-marketing';

beforeAll(() => {
  window.scrollTo = () => {};
});

describe('Intégration du Bonus 02 : Marketing Library', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock du presse-papier
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  const renderBonusMarketing = () =>
    render(
      <ProgressProvider>
        <BonusView bonusId="bonus-marketing" />
      </ProgressProvider>
    );

  describe('1. Rendu global et conformité du catalogue', () => {
    it('affiche le header officiel du Bonus 02 et les badges de contexte sobres', () => {
      renderBonusMarketing();

      expect(screen.getByText('MARKETING LIBRARY')).toBeInTheDocument();
      expect(screen.getByText('9 SKILLS + 1 PROMPT')).toBeInTheDocument();
      expect(
        screen.getByText('Usage textuel direct • Importation selon plateforme')
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Scénario pédagogique fictif : Pack Freelance/i)
      ).toBeInTheDocument();
    });

    it('affiche les compteurs de catégories exacts (Stratégie & Psychologie = 4, Total = 10)', () => {
      renderBonusMarketing();

      // Stratégie & Psychologie inclut les 3 skills + 1 prompt de veille = 4
      const strategyCategory = BONUS_MARKETING_DATA.categories.find(
        (c) => c.id === 'strategy'
      );
      expect(strategyCategory?.count).toBe(4);

      const allCategory = BONUS_MARKETING_DATA.categories.find((c) => c.id === 'all');
      expect(allCategory?.count).toBe(10);
      expect(BONUS_MARKETING_DATA.header.totalResourcesCount).toBe(10);
    });

    it('affiche exactement les 9 cartes de Skills autorisés', () => {
      renderBonusMarketing();

      for (const skill of BONUS_MARKETING_DATA.skills) {
        expect(screen.getByText(skill.title)).toBeInTheDocument();
        expect(screen.getByText(skill.technicalName)).toBeInTheDocument();
      }

      // Exactement 9 compétences
      expect(BONUS_MARKETING_DATA.skills).toHaveLength(9);
    });

    it('affiche le prompt universel de recherche avec formulation rigoureuse (sans terme "zéro hallucination")', () => {
      renderBonusMarketing();

      expect(
        screen.getByText('Cartographie de Marché & Analyse Concurrentielle')
      ).toBeInTheDocument();
      expect(screen.getByText('PROMPT UNIVERSEL PRÊT À L’EMPLOI')).toBeInTheDocument();

      // Règle d'or rigoureuse
      expect(
        screen.getByText(
          'Sources Web réelles, informations vérifiables et hypothèses clairement séparées.'
        )
      ).toBeInTheDocument();

      // Vérifie l'absence de l'ancien terme absolu
      expect(screen.queryByText(/zéro hallucination/i)).not.toBeInTheDocument();
    });

    it('affiche la ressource externe Novitckii avec label sobre et mention non auditée', () => {
      renderBonusMarketing();

      expect(screen.getByText('Bibliothèque de ressources Novitckii')).toBeInTheDocument();
      expect(screen.getByText('Ressource externe')).toBeInTheDocument();
      expect(
        screen.getByText(/Veille indépendante non auditée par AI CREATOR STUDIO/i)
      ).toBeInTheDocument();

      const novitckiiLink = screen.getByRole('link', {
        name: /Accéder à la bibliothèque Novitckii/i,
      });
      expect(novitckiiLink).toHaveAttribute('href', 'https://novitckii.com/resources/');
      expect(novitckiiLink).toHaveAttribute('target', '_blank');
      expect(novitckiiLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('2. Recherche et Filtrage accessible par groupe de boutons', () => {
    it('utilise un groupe de boutons avec aria-pressed pour le filtrage par catégorie', () => {
      renderBonusMarketing();

      const filterGroup = screen.getByRole('group', {
        name: 'Filtrer les ressources par catégorie',
      });
      expect(filterGroup).toBeInTheDocument();

      const allBtn = within(filterGroup).getByRole('button', {
        name: /Toutes les ressources/i,
      });
      expect(allBtn).toHaveAttribute('aria-pressed', 'true');

      const copywritingBtn = within(filterGroup).getByRole('button', {
        name: /Copywriting & Contenu/i,
      });
      expect(copywritingBtn).toHaveAttribute('aria-pressed', 'false');

      fireEvent.click(copywritingBtn);
      expect(copywritingBtn).toHaveAttribute('aria-pressed', 'true');
      expect(allBtn).toHaveAttribute('aria-pressed', 'false');

      // Doit afficher les 2 skills copywriting
      expect(
        screen.getByText('Éliminer les Tics IA & Humaniser son Style')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Rédiger des Textes de Vente sans Clichés ni Slop IA')
      ).toBeInTheDocument();

      // Ne doit pas afficher les autres catégories
      expect(
        screen.queryByText('Scénariser ses Stories Instagram pour Vendre en DM')
      ).not.toBeInTheDocument();
    });

    it('filtre les ressources par recherche textuelle en direct', () => {
      renderBonusMarketing();

      const searchInput = screen.getByPlaceholderText(/Rechercher par mot-clé/i);
      fireEvent.change(searchInput, { target: { value: 'pricing' } });

      expect(
        screen.getByText('Fixer et Optimiser le Prix de son Produit Numérique')
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Comprendre la Psychologie d’Achat & Biais Cognitifs')
      ).not.toBeInTheDocument();
    });

    it('affiche un état vide soigné lorsque la recherche ne donne aucun résultat et permet la réinitialisation', () => {
      renderBonusMarketing();

      const searchInput = screen.getByPlaceholderText(/Rechercher par mot-clé/i);
      fireEvent.change(searchInput, { target: { value: 'mot-cle-inexistant-xyz' } });

      expect(
        screen.getByText('Aucune ressource ne correspond à votre recherche')
      ).toBeInTheDocument();

      const resetBtn = screen.getByRole('button', { name: /Réinitialiser les filtres/i });
      fireEvent.click(resetBtn);

      expect(
        screen.getByText('Comprendre la Psychologie d’Achat & Biais Cognitifs')
      ).toBeInTheDocument();
    });
  });

  describe('3. Modale de détail, accessibilité et gestion des droits', () => {
    it('ouvre la fiche marketing-psychology et affiche la mention de téléchargement indisponible', () => {
      renderBonusMarketing();

      const openButtons = screen.getAllByRole('button', { name: /Consulter la fiche/i });
      fireEvent.click(openButtons[0]);

      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();

      // Titre et sections
      expect(
        screen.getAllByText('Comprendre la Psychologie d’Achat & Biais Cognitifs').length
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Problème concret résolu')).toBeInTheDocument();
      expect(screen.getByText('Quand utiliser ce Skill ?')).toBeInTheDocument();
      expect(
        screen.getByText(/Scénario pédagogique fictif : Pack « Freelance Prospector »/i)
      ).toBeInTheDocument();

      // Téléchargement indisponible pour droits non établis
      expect(screen.getByText(/Statut de distribution/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Téléchargement de l’archive ZIP indisponible/i)
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: /Télécharger l'archive/i })
      ).not.toBeInTheDocument();
    });

    it('affiche le bouton de téléchargement officiel et la licence MIT pour humanizer', () => {
      renderBonusMarketing();

      // Filtrer sur humanizer
      const searchInput = screen.getByPlaceholderText(/Rechercher par mot-clé/i);
      fireEvent.change(searchInput, { target: { value: 'humanizer' } });

      const openBtn = screen.getByRole('button', { name: /Consulter la fiche/i });
      fireEvent.click(openBtn);

      const downloadLink = screen.getByRole('link', { name: /Télécharger l'archive/i });
      expect(downloadLink).toHaveAttribute('href', '/downloads/skills/humanizer.zip');
      expect(
        screen.getByText(/Licence open-source MIT — Copyright \(c\) 2025 Siqi Chen/i)
      ).toBeInTheDocument();
    });

    it('copie le prompt dans le presse-papier avec confirmation visuelle', async () => {
      renderBonusMarketing();

      const openButtons = screen.getAllByRole('button', { name: /Consulter la fiche/i });
      fireEvent.click(openButtons[0]);

      const modal = screen.getByRole('dialog');
      const copyBtn = within(modal).getByRole('button', { name: /^Copier le prompt$/i });
      fireEvent.click(copyBtn);

      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      await waitFor(() => {
        expect(within(modal).getByText('Prompt copié !')).toBeInTheDocument();
      });
    });

    it('utilise le fallback execCommand si navigator.clipboard échoue', async () => {
      document.execCommand = vi.fn().mockReturnValue(true);
      // Simule un échec de clipboard.writeText
      (navigator.clipboard.writeText as any).mockRejectedValueOnce(new Error('Permission denied'));

      renderBonusMarketing();

      const openButtons = screen.getAllByRole('button', { name: /Consulter la fiche/i });
      fireEvent.click(openButtons[0]);

      const modal = screen.getByRole('dialog');
      const copyBtn = within(modal).getByRole('button', { name: /^Copier le prompt$/i });
      fireEvent.click(copyBtn);

      await waitFor(() => {
        expect(document.execCommand).toHaveBeenCalledWith('copy');
        expect(within(modal).getByText('Prompt copié !')).toBeInTheDocument();
      });
    });

    it('affiche un message d’erreur si la copie échoue totalement', async () => {
      document.execCommand = vi.fn().mockReturnValue(false);
      (navigator.clipboard.writeText as any).mockRejectedValueOnce(new Error('Permission denied'));

      renderBonusMarketing();

      const openButtons = screen.getAllByRole('button', { name: /Consulter la fiche/i });
      fireEvent.click(openButtons[0]);

      const modal = screen.getByRole('dialog');
      const copyBtn = within(modal).getByRole('button', { name: /^Copier le prompt$/i });
      fireEvent.click(copyBtn);

      await waitFor(() => {
        expect(within(modal).getByText('Échec copie')).toBeInTheDocument();
        expect(
          within(modal).getByText(/La copie automatique a échoué/i)
        ).toBeInTheDocument();
      });
    });

    it('ferme la modale avec la touche Escape et restaure le focus', () => {
      renderBonusMarketing();

      const openButtons = screen.getAllByRole('button', { name: /Consulter la fiche/i });
      openButtons[0].focus();
      fireEvent.click(openButtons[0]);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Fermeture par la touche Escape
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('intercepte Tab dans la modale pour former un focus trap', () => {
      renderBonusMarketing();

      const openButtons = screen.getAllByRole('button', { name: /Consulter la fiche/i });
      fireEvent.click(openButtons[0]);

      const modal = screen.getByRole('dialog');
      const focusable = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      // Tab depuis le dernier élément renvoie au premier
      lastElement.focus();
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });

      // Shift+Tab depuis le premier élément renvoie au dernier
      firstElement.focus();
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    });

    it('affiche la consigne spécifique pour pricing et antislop', () => {
      renderBonusMarketing();

      const searchInput = screen.getByPlaceholderText(/Rechercher par mot-clé/i);
      fireEvent.change(searchInput, { target: { value: 'pricing' } });

      const openBtn = screen.getByRole('button', { name: /Consulter la fiche/i });
      fireEvent.click(openBtn);

      expect(
        screen.getByText(/Adapté aux produits numériques vendus à l’unité/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/churn mensuel, MRR, coût par siège/i)
      ).toBeInTheDocument();
    });
  });

  describe('4. Dépliage et copie du Prompt de Veille Concurrentielle', () => {
    it('permet de déplier le prompt complet et de le copier', async () => {
      renderBonusMarketing();

      const expandBtn = screen.getByRole('button', {
        name: /Afficher le prompt complet/i,
      });
      fireEvent.click(expandBtn);

      expect(screen.getByText(/Tu agis en tant qu'Analyste Stratégique/i)).toBeInTheDocument();

      const copyCompetitiveBtn = screen.getByRole('button', {
        name: /Copier le prompt universel/i,
      });
      fireEvent.click(copyCompetitiveBtn);

      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.getByText(/Prompt copié dans le presse-papier !/i)).toBeInTheDocument();
      });
    });
  });
});
