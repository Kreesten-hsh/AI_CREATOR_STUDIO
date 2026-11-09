import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BONUSES } from '../data/navigation/bonuses';
import {
  BONUS_MANYCHAT_LESSONS,
  BONUS_MANYCHAT_META,
  DIAGRAM_PARCOURS_CONVERSION,
  MANYCHAT_GLOSSARY,
  MANYCHAT_PRICING_FACTS,
  TROUBLESHOOTING_TIPS,
} from '../data/bonuses/bonus-manychat';
import { ALL_LESSONS } from '../data/course';
import { BonusView } from '../components/bonus/BonusView';
import { ProgressProvider } from '../context/ProgressContext';
import type { CopyBlockConfig } from '../types/course';

beforeAll(() => {
  window.scrollTo = () => {};
});

describe('Bonus 01 : ManyChat Automation System — Intégrité, Pédagogie & UI (Mission 07-A)', () => {
  describe('1. Intégrité des données, leçons et métadonnées épurées', () => {
    it('comporte exactement 2 bonus dans la navigation dont Bonus 01 outillé avec 5 leçons', () => {
      expect(BONUSES).toHaveLength(2);
      expect(BONUSES[0].id).toBe('bonus-manychat');
      expect(BONUSES[1].id).toBe('bonus-marketing');
      expect(BONUSES[0].title).toBe('LE SYSTÈME MANYCHAT AUTOMATISÉ AVEC CLAUDE');
      expect(BONUSES[0].lessons).toHaveLength(5);
      expect(BONUS_MANYCHAT_META.title).toBe('LE SYSTÈME MANYCHAT AUTOMATISÉ AVEC CLAUDE');
      expect(BONUS_MANYCHAT_META.duration).toBe('2h 15min');
    });

    it('supprime la propriété deliverable globale de BONUS_MANYCHAT_META et préserve deliverable vide dans BONUSES[0]', () => {
      // Correction 08 : deliverable supprimé de BONUS_MANYCHAT_META
      expect((BONUS_MANYCHAT_META as Record<string, unknown>).deliverable).toBeUndefined();
      // BONUSES[0].deliverable reste vide pour satisfaire le typage BonusItem
      expect(BONUSES[0].deliverable).toBe('');
    });

    it('chaque leçon possède un titre, un objectif, un livrable individuel préservé et exactement 3 grandes parties éditoriales', () => {
      expect(BONUS_MANYCHAT_LESSONS).toHaveLength(5);

      BONUS_MANYCHAT_LESSONS.forEach((lesson, lIdx) => {
        expect(lesson.lessonNumber).toBe(lIdx + 1);
        expect(lesson.id).toBeTruthy();
        expect(lesson.title.trim().length).toBeGreaterThan(0);
        expect(lesson.duration.trim().length).toBeGreaterThan(0);
        expect(lesson.objective.trim().length).toBeGreaterThan(0);
        // Les 5 livrables individuels des leçons restent strictement préservés
        expect(lesson.deliverable.trim().length).toBeGreaterThan(0);

        // Exactement 3 grandes parties éditoriales
        expect(lesson.parts).toHaveLength(3);

        lesson.parts.forEach((part) => {
          expect(part.id).toBeTruthy();
          expect(part.title.trim().length).toBeGreaterThan(0);
          expect(part.blocks.length).toBeGreaterThan(0);

          // Aucun intitulé artificiel ou générique interdit
          expect(part.title).not.toMatch(/^Partie \d/i);
          expect(part.title).not.toMatch(/^Section \d/i);
          expect(part.title).not.toMatch(/^Étape \d/i);
        });
      });
    });

    it('tous les identifiants de leçons et de parties sont strictement uniques', () => {
      const lessonIds = BONUS_MANYCHAT_LESSONS.map((l) => l.id);
      expect(new Set(lessonIds).size).toBe(5);

      const partIds = BONUS_MANYCHAT_LESSONS.flatMap((l) => l.parts.map((p) => p.id));
      expect(partIds).toHaveLength(15);
      expect(new Set(partIds).size).toBe(15);
    });

    it('BONUSES[0].blocks et BONUSES[1].blocks restent vides pour préserver l’intégrité canonique', () => {
      expect(BONUSES[0].blocks).toEqual([]);
      expect(BONUSES[1].blocks).toEqual([]);
    });
  });

  describe('2. Intégrité des 5 Prompts Claude Free et règles de qualification Free', () => {
    it('héberge les 5 prompts Claude Free complets dans les leçons prévues', () => {
      const allCopyBlocks = BONUS_MANYCHAT_LESSONS.flatMap((lesson) =>
        lesson.parts.flatMap((part) =>
          part.blocks.filter((b): b is CopyBlockConfig => b.type === 'copy')
        )
      );

      // Exactement 5 prompts copiables
      expect(allCopyBlocks).toHaveLength(5);

      // Prompt 01 (Leçon 01)
      const prompt01 = allCopyBlocks.find((b) => b.title.includes('Prompt 01'));
      expect(prompt01).toBeDefined();
      expect(prompt01?.content).toContain('Tu es un expert en marketing direct');
      expect(prompt01?.content).toContain('pose-moi d\'abord ces 5 questions précises');

      // Prompt 02 (Leçon 03)
      const prompt02 = allCopyBlocks.find((b) => b.title.includes('Prompt 02'));
      expect(prompt02).toBeDefined();
      expect(prompt02?.content).toContain('Tu es un architecte d\'expériences conversationnelles');
      expect(prompt02?.content).toContain('Flow Tree');
      expect(prompt02?.content).toContain('GUIDE');
      expect(prompt02?.content).toContain('Comment Reply');

      // Prompt 03 (Leçon 03) - Correction 05 : 20 caractères max, espaces compris
      const prompt03 = allCopyBlocks.find((b) => b.title.includes('Prompt 03'));
      expect(prompt03).toBeDefined();
      expect(prompt03?.content).toContain('Tu es un copywriter d\'élite');
      expect(prompt03?.content).toContain('20 caractères maximum, espaces compris');
      expect(prompt03?.content).not.toContain('STRICTEMENT MOINS DE 20 CARACTÈRES');
      expect(prompt03?.content).toContain('Comment Reply');
      expect(prompt03?.content).toContain('Open Website');

      // Prompt 04 (Leçon 04) - Correction 02 : compatible Free sans tags obligatoires
      const prompt04 = allCopyBlocks.find((b) => b.title.includes('Prompt 04'));
      expect(prompt04).toBeDefined();
      expect(prompt04?.content).toContain('Tu es un architecte ManyChat expérimenté');
      expect(prompt04?.content).toContain('compatible 100 % ManyChat Free, sans aucun Tag obligatoire');
      expect(prompt04?.content).toContain('Extension conditionnelle facultative');

      // Prompt 05 (Leçon 05) - Correction 03 & 04 : conformité 24h, Single Private Reply, relais humain
      const prompt05 = allCopyBlocks.find((b) => b.title.includes('Prompt 05'));
      expect(prompt05).toBeDefined();
      expect(prompt05?.content).toContain('Tu es un auditeur expert en tunnels conversationnels');
      expect(prompt05?.content).toContain('règle des 24 heures');
      expect(prompt05?.content).toContain('Single Private Reply');
      expect(prompt05?.content).toContain('Comment Reply');
      expect(prompt05?.content).toContain('Open Website');
    });
  });

  describe('3. Rigueur technique : Tarification ManyChat Free 2026, Règles Meta & Relais Humain', () => {
    it('intègre la tarification officielle ManyChat Free (Mise à jour 29 octobre 2026)', () => {
      // Correction 01 : 25 contacts actifs / mois, 2 canaux, 4 automatisations actives, vérification Settings -> Subscription
      expect(MANYCHAT_PRICING_FACTS).toHaveLength(4);
      const freeFact = MANYCHAT_PRICING_FACTS[0];
      expect(freeFact.details).toContain('25 contacts actifs par mois');
      expect(freeFact.details).toContain('2 canaux max');
      expect(freeFact.details).toContain('4 automatisations actives simultanément');
      expect(freeFact.details).not.toContain('déclencheurs actifs');
      expect(freeFact.details).not.toContain('live triggers');
      expect(freeFact.details).not.toContain('déployé progressivement');
      expect(freeFact.details).toContain('Settings → Subscription');
      expect(freeFact.details).toContain('1 siège Inbox');
      expect(freeFact.details).toContain('WhatsApp non inclus en Free');
      expect(freeFact.details).toContain('se distingue du plafond historique de 1 000 contacts');
      expect(freeFact.details).not.toContain('Pro dès 15 $/mois pour contacts illimités');
      expect(freeFact.badge).toContain('25 contacts actifs/mois');

      // Frais de messagerie Meta & Nouvelle tarification WhatsApp par message livré (Correction 02)
      const metaMsgFact = MANYCHAT_PRICING_FACTS[2];
      expect(metaMsgFact.details).toContain('Facebook Messenger : sans frais de messagerie standards');
      expect(metaMsgFact.details).toContain('tarification s’effectue par message livré (et non par conversation)');
      expect(metaMsgFact.details).toContain('1 000 messages de service gratuits par mois calendaire applicable à l’ensemble des pays de destination');
      expect(metaMsgFact.details).toContain('1 001e message de service');
      expect(metaMsgFact.details).toContain('Marketing, Utility et Service délivrés pendant une fenêtre Free Entry Point ouverte');
      expect(metaMsgFact.details).not.toContain('1 000 conversations');
      expect(metaMsgFact.details).not.toContain('frais Meta par conversation');
      expect(metaMsgFact.details).toContain('WhatsApp : non inclus dans le plan Manychat Free');
    });

    it('uniformise la règle des Quick Replies « 20 caractères maximum, espaces compris » sur tous les supports (diagramme, prompts, leçons)', () => {
      // Correction 03 : Audit global et harmonisation
      // 1. Diagramme
      expect(DIAGRAM_PARCOURS_CONVERSION.accessibleDescription).toContain('20 caractères maximum, espaces compris');
      expect(DIAGRAM_PARCOURS_CONVERSION.accessibleDescription).not.toContain('20 car. max');
      expect(DIAGRAM_PARCOURS_CONVERSION.data.nodes[3].description).toContain('20 caractères maximum, espaces compris');
      expect(DIAGRAM_PARCOURS_CONVERSION.data.nodes[3].description).not.toContain('20 car. max');

      // 2. Glossaire
      const qr = MANYCHAT_GLOSSARY.find((g) => g.term.includes('Quick Reply'));
      expect(qr?.definition).toContain('20 caractères maximum, espaces compris');

      // 3. Prompts
      const allCopyBlocks = BONUS_MANYCHAT_LESSONS.flatMap((lesson) =>
        lesson.parts.flatMap((part) =>
          part.blocks.filter((b): b is CopyBlockConfig => b.type === 'copy')
        )
      );
      const prompt03 = allCopyBlocks.find((b) => b.title.includes('Prompt 03'));
      const prompt04 = allCopyBlocks.find((b) => b.title.includes('Prompt 04'));
      const prompt05 = allCopyBlocks.find((b) => b.title.includes('Prompt 05'));

      expect(prompt03?.content).toContain('20 caractères maximum, espaces compris');
      expect(prompt04?.content).toContain('20 caractères maximum, espaces compris');
      expect(prompt05?.content).toContain('20 caractères maximum, espaces compris');
      expect(prompt05?.content).not.toContain('<= 20 caractères');
      expect(prompt05?.content).not.toContain('20 caractères max (');

      // 4. Ensemble des leçons : aucune variante interdite
      const allBonusJson = JSON.stringify(BONUS_MANYCHAT_LESSONS);
      expect(allBonusJson).not.toContain('sous la barre des 20 caractères');
    });

    it('documente la distinction Single Private Reply vs Fenêtre 24h et exclut Open Website comme opt-in', () => {
      const l03p01 = BONUS_MANYCHAT_LESSONS[2].parts[0];
      const allText = JSON.stringify(l03p01.blocks);

      expect(allText).toContain('Single Private Reply');
      expect(allText).toContain('7 jours max');
      expect(allText).toContain('Comment Reply');
      expect(allText).toContain('N’OUVRE PAS la fenêtre des 24 heures');
      expect(allText).toContain('Open Website');
      expect(allText).toContain('NE CONSTITUE PAS une interaction ouvrant la fenêtre');
    });

    it('documente les restrictions Meta du déclencheur Commentaire', () => {
      const l03p01 = BONUS_MANYCHAT_LESSONS[2].parts[0];
      const allText = JSON.stringify(l03p01.blocks);

      expect(allText).toContain('Page professionnelle');
      expect(allText).toContain('Event, Offer et Job ne sont pas pris en charge');
      expect(allText).toContain('commentaires antérieurs à l’activation ne sont pas traités rétroactivement');
    });

    it('documente le protocole de relais humain : message de transition, même nœud Action et aucun nœud après pause', () => {
      // Correction 04 : statut Inbox non notifiant, aucun ticket fictif
      const l04p03 = BONUS_MANYCHAT_LESSONS[3].parts[2];
      const allText = JSON.stringify(l04p03.blocks);

      expect(allText).toContain('Mark conversation as Open');
      expect(allText).toContain('marque la discussion comme ouverte dans l’Inbox Manychat afin qu’un conseiller puisse la retrouver');
      expect(allText).toContain('ne constitue pas à elle seule une notification d’alerte');
      expect(allText).toContain('Pause all automations');
      expect(allText).toContain('Message de transition préalable');
      expect(allText).toContain('Nœud Action unique');
      expect(allText).toContain('AUCUN NŒUD ne peut être');
      expect(allText).toContain('Notify Admins');
      expect(allText).toContain('Notify Assignees');
      expect(allText).toContain('temporairement indisponibles sur Messenger');
      expect(allText).not.toContain('alerter l’équipe');

      // Vérification de bm-chk-test-04 dans la Leçon 05 : aucun terme "ticket"
      const l05p01 = BONUS_MANYCHAT_LESSONS[4].parts[0];
      const l05p01Text = JSON.stringify(l05p01.blocks);
      expect(l05p01Text).not.toContain('ticket');
      expect(l05p01Text).toContain('prendre en charge manuellement');
    });

    it('documente la procédure vérifiée de test du déclencheur Facebook sans allégation non vérifiée sur les administrateurs', () => {
      // Correction 05 : profil personnel distinct et limite 1 test/user
      expect(TROUBLESHOOTING_TIPS[0].cause).not.toContain('administrateur de votre propre Page');
      expect(TROUBLESHOOTING_TIPS[0].solution).not.toContain('Facebook bloque par sécurité');
      expect(TROUBLESHOOTING_TIPS[0].solution).toContain('profil Facebook personnel distinct');
      expect(TROUBLESHOOTING_TIPS[0].solution).toContain('une seule fois par profil utilisateur');

      const l05p01 = BONUS_MANYCHAT_LESSONS[4].parts[0];
      const allText = JSON.stringify(l05p01.blocks);
      expect(allText).toContain('profil Facebook personnel distinct');
      expect(allText).toContain('une seule fois par profil utilisateur');
      expect(allText).not.toContain('bloque délibérément les auto-réponses sur les commentaires de l’administrateur');
      expect(allText).not.toContain('Facebook bloque les auto-réponses aux admins');
    });

    it('documente le parcours de qualification Free sans dépendance aux Tags', () => {
      const l04p02 = BONUS_MANYCHAT_LESSONS[3].parts[1];
      const allText = JSON.stringify(l04p02.blocks);

      expect(allText).toContain('ne dépend d’aucun Tag');
      expect(allText).toContain('Extension payante facultative');
    });

    it('intègre le glossaire ManyChat avec définitions actualisées', () => {
      expect(MANYCHAT_GLOSSARY.length).toBeGreaterThanOrEqual(8);
      const terms = MANYCHAT_GLOSSARY.map((g) => g.term);
      expect(terms).toContain('Single Private Reply');
      expect(terms).toContain('24-Hour Messaging Window');
      expect(terms).toContain('Quick Reply (Réponse Rapide)');
      expect(terms).toContain('Tag (Étiquette)');

      const qr = MANYCHAT_GLOSSARY.find((g) => g.term.includes('Quick Reply'));
      expect(qr?.definition).toContain('20 caractères maximum, espaces compris');

      const tag = MANYCHAT_GLOSSARY.find((g) => g.term.includes('Tag'));
      expect(tag?.definition).toContain('non requis pour le parcours gratuit');
    });

    it('documente la procédure officielle Facebook Ads Click-to-Messenger sans JSON obligatoire', () => {
      const l05p03 = BONUS_MANYCHAT_LESSONS[4].parts[2];
      const allText = JSON.stringify(l05p03.blocks);

      expect(allText).toContain('User clicks a Facebook Ad');
      expect(allText).toContain('Set Live');
      expect(allText).toContain('Message destinations');
      expect(allText).toContain('Send Message');
      expect(allText).toContain('variables de personnalisation');
      expect(allText).not.toContain('code JSON fourni par ManyChat');
    });
  });

  describe('4. Rendu interactif du composant BonusView', () => {
    it('rend la bannière, les badges et le sélecteur horizontal des 5 leçons', () => {
      render(
        <ProgressProvider>
          <BonusView bonusId="bonus-manychat" />
        </ProgressProvider>
      );

      // Titre officiel
      expect(screen.getByText('LE SYSTÈME MANYCHAT AUTOMATISÉ AVEC CLAUDE')).toBeInTheDocument();
      // Badges
      expect(screen.getByText('Claude Free + ManyChat Free')).toBeInTheDocument();
      expect(screen.getByText('0 € de budget pub requis')).toBeInTheDocument();
      // Sélecteur des leçons
      expect(screen.getByText('L01')).toBeInTheDocument();
      expect(screen.getByText('L02')).toBeInTheDocument();
      expect(screen.getByText('L03')).toBeInTheDocument();
      expect(screen.getByText('L04')).toBeInTheDocument();
      expect(screen.getByText('L05')).toBeInTheDocument();
      expect(screen.getByText('Leçon 01 / 05')).toBeInTheDocument();
    });

    it('supprime strictement les trois libellés et encarts interdits de l’interface', () => {
      render(
        <ProgressProvider>
          <BonusView bonusId="bonus-manychat" />
        </ProgressProvider>
      );

      // 1. Suppression de « LE MINI-COURS GUIDÉ (5 LEÇONS) »
      expect(screen.queryByText(/LE MINI-COURS GUIDÉ/i)).toBeNull();

      // 2. Suppression de « FICHES & OUTILS DE RÉFÉRENCE »
      expect(screen.queryByText(/FICHES & OUTILS DE RÉFÉRENCE/i)).toBeNull();

      // 3. Suppression de l'encart global « Livrable final : Un système complet Facebook Commentaire → Messenger... »
      expect(
        screen.queryByText(
          /Livrable final : Un système complet Facebook Commentaire → Messenger opérationnel, qualifiant et connecté à vos offres\./i
        )
      ).toBeNull();

      // 4. Suppression du libellé textuel répété « SUITE DU PARCOURS » (Correction 08)
      expect(screen.queryByText(/SUITE DU PARCOURS/i)).toBeNull();

      // Aucun rôle tablist pour les parties
      expect(screen.queryByRole('tablist')).toBeNull();
    });

    it('affiche l’intégralité des 3 parties de la leçon active simultanément sur la même page (flux vertical)', () => {
      render(
        <ProgressProvider>
          <BonusView bonusId="bonus-manychat" />
        </ProgressProvider>
      );

      // En-tête de la Leçon 01
      expect(screen.getByText('LEÇON 01 / 05')).toBeInTheDocument();
      expect(screen.getAllByText('Comprendre et concevoir son système').length).toBeGreaterThanOrEqual(1);

      // Les 3 parties de la Leçon 01 sont visibles ensemble sur la même page
      expect(
        screen.getByRole('heading', { name: /Mécanisme Conversationnel & Parcours Messenger/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /Diagnostic Commercial avec Claude Free/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /Cadrage du Plan d’Automatisation & Glossaire/i })
      ).toBeInTheDocument();

      // Le Prompt 01 est directement accessible sans clic d'étape
      expect(screen.getByText('Prompt 01 — Diagnostic Commercial ManyChat')).toBeInTheDocument();
      expect(screen.getByText('Copier le Prompt 01')).toBeInTheDocument();
    });

    it('permet de naviguer vers une autre leçon via le sélecteur horizontal et les boutons Précédente / Suivante', () => {
      render(
        <ProgressProvider>
          <BonusView bonusId="bonus-manychat" />
        </ProgressProvider>
      );

      // Clic sur L03 (Créer son premier système de conversion)
      const l03Btn = screen.getByText('L03').closest('button');
      expect(l03Btn).toBeTruthy();
      fireEvent.click(l03Btn!);

      // Vérifie l'en-tête de la Leçon 03
      expect(screen.getByText('LEÇON 03 / 05')).toBeInTheDocument();
      expect(screen.getAllByText('Créer son premier système de conversion').length).toBeGreaterThanOrEqual(1);

      // Les 3 parties de la Leçon 03 sont rendues simultanément
      expect(
        screen.getByRole('heading', { name: /Déclencheur Commentaire & Règles de Messagerie Meta/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /Architecture Conversationnelle avec Claude Free/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /Rédaction des Messages & Publication ManyChat/i })
      ).toBeInTheDocument();

      // Navigation avec le bouton "Leçon précédente"
      const prevBtn = screen.getByRole('button', { name: /Leçon précédente/i });
      fireEvent.click(prevBtn);

      // On arrive sur la Leçon 02
      expect(screen.getByText('LEÇON 02 / 05')).toBeInTheDocument();
      expect(screen.getAllByText('Installer et connecter ManyChat').length).toBeGreaterThanOrEqual(1);
    });

    it('affiche le Bonus 02 (Marketing Library) sans régression', () => {
      render(
        <ProgressProvider>
          <BonusView bonusId="bonus-marketing" />
        </ProgressProvider>
      );

      expect(screen.getByText('MARKETING LIBRARY')).toBeInTheDocument();
      expect(screen.getByText('9 SKILLS + 1 PROMPT')).toBeInTheDocument();
    });
  });

  describe('5. Non-régression du cursus principal (3 Modules • 3 Journées • 7 Leçons)', () => {
    it('les 7 leçons du cursus principal restent strictement intactes', () => {
      expect(ALL_LESSONS).toHaveLength(7);
      expect(ALL_LESSONS[0].id).toBe('lesson-01');
      expect(ALL_LESSONS[6].id).toBe('lesson-07');
    });
  });
});
