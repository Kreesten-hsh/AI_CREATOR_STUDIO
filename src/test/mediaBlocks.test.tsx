import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ImageBlock } from '../components/widgets/media/ImageBlock';
import { ScreenshotBlock } from '../components/widgets/media/ScreenshotBlock';
import { DiagramBlock } from '../components/widgets/media/DiagramBlock';
import { VideoBlock, isValidVideoUrl } from '../components/widgets/VideoBlock';
import { LessonRenderer } from '../components/course/LessonRenderer';
import { ProgressProvider } from '../context/ProgressContext';
import type { ContentBlock } from '../types/course';

describe('Blocs Média & Accessibilité (ImageBlock, ScreenshotBlock, DiagramBlock, VideoBlock)', () => {
  describe('ImageBlock', () => {
    it('refuse et alerte si l attribut alt est manquant ou vide (règle WCAG)', () => {
      render(
        <ImageBlock
          block={{
            id: 'img-1',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1',
            alt: '',
          }}
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/Texte alternatif \(alt\) obligatoire manquant/i);
    });

    it('affiche l image avec alt obligatoire et légende si présents', () => {
      render(
        <ImageBlock
          block={{
            id: 'img-2',
            type: 'image',
            src: 'https://images.unsplash.com/photo-2',
            alt: 'Schéma de la chaîne de clarté de l offre',
            caption: 'Figure 1.1 : De l expertise au produit interactif',
          }}
        />
      );

      const img = screen.getByAltText('Schéma de la chaîne de clarté de l offre');
      expect(img).toBeInTheDocument();
      expect(screen.getByText('Figure 1.1 : De l expertise au produit interactif')).toBeInTheDocument();
    });
  });

  describe('ScreenshotBlock', () => {
    it('refuse et alerte si l attribut alt est manquant', () => {
      render(
        <ScreenshotBlock
          block={{
            id: 'screen-1',
            type: 'screenshot',
            src: 'https://images.unsplash.com/screen-1',
            alt: '   ',
            caption: 'Aperçu de la console',
            capturedAt: 'Novembre 2026',
          }}
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/Texte alternatif \(alt\) obligatoire manquant/i);
    });

    it('affiche la capture sans fausse URL et avec date de capture masquée publiquement', () => {
      render(
        <ScreenshotBlock
          block={{
            id: 'screen-2',
            type: 'screenshot',
            src: 'https://images.unsplash.com/screen-2',
            alt: 'Capture d écran de l artifact Claude avec tableau interactif',
            caption: 'Interface de simulation générée dans Claude Artifacts',
            capturedAt: '05 Novembre 2026',
          }}
        />
      );

      expect(screen.getByAltText('Capture d écran de l artifact Claude avec tableau interactif')).toBeInTheDocument();
      expect(screen.getByText('Interface de simulation générée dans Claude Artifacts')).toBeInTheDocument();
      expect(screen.getByText(/Capture d’écran de référence • Interface réelle/i)).toBeInTheDocument();

      // Assertion négative obligatoire : la date de capture est masquée du DOM
      expect(screen.queryByText(/Date de capture/i)).toBeNull();
      expect(screen.queryByText(/05 Novembre 2026/i)).not.toBeInTheDocument();

      // Vérifie qu'aucune fausse URL (ex: "https://faux-site.com") n'est affichée
      expect(screen.queryByText(/http:\/\/|https:\/\//i)).not.toBeInTheDocument();
    });
  });

  describe('DiagramBlock', () => {
    it('refuse et alerte si la description accessible est manquante', () => {
      render(
        <DiagramBlock
          block={{
            id: 'diag-1',
            type: 'diagram',
            accessibleDescription: '',
            data: {
              kind: 'steps',
              nodes: [{ id: 'n1', label: 'Étape 1' }],
            },
          }}
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/Description textuelle accessible obligatoire manquante/i);
    });

    it('affiche un diagramme en étapes avec alternative accessible complète', () => {
      render(
        <DiagramBlock
          block={{
            id: 'diag-steps',
            type: 'diagram',
            title: 'Parcours de transformation',
            accessibleDescription: 'Le processus comprend 3 phases : Document initial, Extraction des règles, Déploiement.',
            data: {
              kind: 'steps',
              nodes: [
                { id: '1', label: 'Document initial', tag: 'INPUT' },
                { id: '2', label: 'Extraction des règles', description: 'Isoler les formules mathématiques' },
                { id: '3', label: 'Déploiement HTML', tag: 'LIVRABLE' },
              ],
            },
          }}
        />
      );

      expect(screen.getByText('Parcours de transformation')).toBeInTheDocument();
      expect(screen.getByText('Document initial')).toBeInTheDocument();
      expect(screen.getByText('Déploiement HTML')).toBeInTheDocument();
      expect(screen.getByText(/Le processus comprend 3 phases/i)).toBeInTheDocument();
    });
  });

  describe('VideoBlock conditionnel & Sécurité des URLs', () => {
    it('valide uniquement les URLs https appartenant à la liste blanche autorisée', () => {
      // Rejette http non sécurisé
      expect(isValidVideoUrl('http://www.youtube.com/embed/xyz')).toBe(false);

      // Rejette domaine inconnu ou suspect
      expect(isValidVideoUrl('https://malicious-site.com/video.mp4')).toBe(false);
      expect(isValidVideoUrl('javascript:alert(1)')).toBe(false);

      // Accepte les domaines de confiance en https
      expect(isValidVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(true);
      expect(isValidVideoUrl('https://player.vimeo.com/video/123456')).toBe(true);
      expect(isValidVideoUrl('https://www.loom.com/embed/abcdef12345')).toBe(true);
    });

    it('affiche l iframe avec attribut title obligatoire lorsqu une URL https valide est fournie', () => {
      render(
        <VideoBlock
          block={{
            id: 'vid-1',
            type: 'video',
            title: 'Tutoriel officiel Claude Artifacts',
            duration: '08:45',
            videoUrl: 'https://www.youtube.com/embed/valid123',
            posterLabel: 'Tutoriel',
            description: 'Démonstration du flux',
          }}
        />
      );

      const iframe = screen.getByTitle('Tutoriel officiel Claude Artifacts');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/valid123');
      expect(screen.queryByText(/VIDÉO PRÉVUE/i)).not.toBeInTheDocument();
    });

    it('affiche un état "Vidéo prévue" propre (SANS faux bouton play ni faux lecteur) quand l URL est absente ou invalide', () => {
      render(
        <VideoBlock
          block={{
            id: 'vid-2',
            type: 'video',
            title: 'Démonstration du calculateur',
            duration: '10:00',
            posterLabel: 'Briefing vidéo',
            description: 'Guide méthodologique',
            videoUrl: '', // Absente
            keyTakeaways: ['Point clé 1 : valider ses inputs', 'Point clé 2 : tester les limites'],
          }}
        />
      );

      // Pas d'iframe
      expect(screen.queryByRole('iframe')).not.toBeInTheDocument();
      expect(document.querySelector('iframe')).toBeNull();

      // État explicite vidéo prévue
      expect(screen.getByText(/VIDÉO PRÉVUE • EN COURS DE PRODUCTION/i)).toBeInTheDocument();
      expect(screen.getByText(/Ce module fera l’objet d’un tutoriel vidéo/i)).toBeInTheDocument();

      // Vérifie les points clés
      expect(screen.getByText('Point clé 1 : valider ses inputs')).toBeInTheDocument();
    });
  });

  describe('Intégration LessonRenderer', () => {
    it('rend fidèlement les blocs image, screenshot et diagramme via LessonRenderer', () => {
      const blocks: ContentBlock[] = [
        {
          id: 'test-img',
          type: 'image',
          src: 'https://images.unsplash.com/photo-1',
          alt: 'Visuel de test pour LessonRenderer',
          caption: 'Légende image',
        },
        {
          id: 'test-screen',
          type: 'screenshot',
          src: 'https://images.unsplash.com/photo-2',
          alt: 'Capture de test pour LessonRenderer',
          caption: 'Légende capture',
          capturedAt: '2026-11',
        },
        {
          id: 'test-diag',
          type: 'diagram',
          title: 'Diagramme de test',
          accessibleDescription: 'Description accessible du flux',
          data: {
            kind: 'grid',
            nodes: [{ id: 'n1', label: 'Nœud A', tag: 'A' }],
          },
        },
      ];

      render(
        <ProgressProvider>
          <LessonRenderer blocks={blocks} />
        </ProgressProvider>
      );

      expect(screen.getByAltText('Visuel de test pour LessonRenderer')).toBeInTheDocument();
      expect(screen.getByAltText('Capture de test pour LessonRenderer')).toBeInTheDocument();
      expect(screen.getByText('Diagramme de test')).toBeInTheDocument();
    });
  });
});
