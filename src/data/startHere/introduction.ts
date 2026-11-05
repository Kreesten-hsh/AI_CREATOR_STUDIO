import type { StartHereLesson } from '../../types/course';

export const INTRODUCTION_LESSON: StartHereLesson = {
  id: 'introduction',
  lessonNumber: 1,
  title: 'BIENVENUE DANS LE STUDIO',
  italicTitleWord: 'STUDIO',
  subtitle: 'START HERE : DU DOCUMENT EXISTANT AU PRODUIT INTERACTIF',
  objective:
    'Comprendre l’approche Document-First, les outils requis, la progression en 3 modules et 9 journées, et le fonctionnement du dossier de projet.',
  blocks: [
    {
      id: 'intro-prose-1',
      type: 'prose',
      eyebrow: 'APPROCHE DOCUMENT-FIRST & RÉSULTAT FINAL',
      title: 'Transformer votre document existant en produit interactif',
      italicAccent: 'Votre matière, votre outil',
      highlightPill:
        'Approche Document-First : Vous partez de votre document existant pour créer une application interactive utile et prête à vendre.',
      paragraphs: [
        'Bienvenue dans le parcours. Le principe fondateur est le Document-First : chaque élève arrive avec un document existant (guide PDF, ebook, tableur, grille de calcul, workbook ou notes méthodologiques). Aucun parcours ne part d’une page blanche : votre document contient déjà votre expertise, vos règles métier et votre structure.',
        'Le résultat final est une application interactive autonome (HTML, CSS et JavaScript dans un fichier unique) conçue avec Claude, publiée gratuitement en ligne avec Netlify Drop, et vendue sur Chariow grâce à un guide d’accès PDF généré par Claude. L’interactivité élimine la friction manuelle de calcul, de diagnostic ou de tri pour votre acheteur.',
      ],
      bullets: [
        'Module 01 (Leçons 01 à 03) : L’Opportunité et le Positionnement (analyser le document, cerner l’acheteur et le problème prioritaire, formuler la promesse)',
        'Module 02 (Leçons 04 à 06) : Concevoir et Créer avec Claude (choisir parmi les 4 modèles de produits interactifs, piloter Claude avec le Master Prompt, tester, exporter et publier en ligne)',
        'Module 03 (Leçons 07 à 09) : Vendre et Promouvoir (structurer l’offre et le prix, créer la livraison Chariow avec PDF d’accès, kit de lancement et démonstrations)',
        'Bonus 01 : Le Système ManyChat Automatisé avec Claude (flux Instagram conforme à la fenêtre Meta de 24h)',
        'Bonus 02 : Marketing Library (structures d’accroches, carrousels, emails de lancement et scripts de démonstration)',
      ],
    },
    {
      id: 'intro-callout-prereq',
      type: 'callout',
      variant: 'important',
      title: 'Prérequis obligatoire : Avoir son document de départ sous la main',
      content:
        'Avant de démarrer la Leçon 01, assurez-vous d’avoir votre document source accessible : un guide PDF, un document texte, un tableur ou un support de formation existant. Le parcours n’enseigne pas à inventer un produit dans le vide, mais à donner une seconde vie interactive à une matière réelle.',
    },
    {
      id: 'intro-checklist-tools',
      type: 'checklist',
      title: 'Les 4 outils nécessaires pour suivre le parcours',
      description: 'Vérifiez la disponibilité de vos 4 outils de travail avant de démarrer.',
      items: [
        {
          id: 'chk-tool-claude',
          label: 'Compte Claude (Anthropic)',
          detail: 'Gardez Claude ouvert dans un onglet dédié pour exécuter les prompts et générer vos composants.',
        },
        {
          id: 'chk-tool-browser',
          label: 'Navigateur web moderne',
          detail: 'Chrome, Safari, Firefox ou Edge pour ouvrir, tester et interagir avec votre application.',
        },
        {
          id: 'chk-tool-netlify',
          label: 'Compte Netlify (gratuit)',
          detail: 'Indispensable pour déposer votre application sur Netlify Drop et réclamer votre site afin de lui attribuer une URL HTTPS permanente.',
        },
        {
          id: 'chk-tool-chariow',
          label: 'Compte Chariow',
          detail: 'Pour configurer votre fiche produit téléchargeable de type Fichiers et distribuer votre PDF d’accès à vos acheteurs.',
        },
      ],
    },
    {
      id: 'intro-callout-dossier',
      type: 'callout',
      variant: 'pro-insight',
      title: 'Dossier de projet et sauvegarde locale continue',
      content:
        'Chaque leçon alimente directement une section de votre Dossier de Projet (accessible via l’onglet « Mon Projet » dans la barre latérale). Vos données sont enregistrées en local dans votre navigateur. Vous pouvez à tout moment exporter un fichier de sauvegarde JSON portable pour conserver vos livrables ou les restaurer sur un autre appareil.',
    },
    {
      id: 'intro-quiz-check',
      type: 'quiz',
      title: 'Vérification des principes du parcours',
      description: 'Validez votre compréhension du cadre avant de démarrer le Module 01.',
      questions: [
        {
          id: 'q-document-first',
          question: 'Quelle est la matière première indispensable pour débuter ce parcours ?',
          options: [
            'Un document existant (guide PDF, tableur, ebook, notes de méthode)',
            'Une idée vague sans aucun support écrit préalable',
            'Un code source déjà programmé en JavaScript',
          ],
          correctIndex: 0,
          explanation:
            'L’approche Document-First repose sur un document existant que vous allez convertir en outil interactif.',
        },
        {
          id: 'q-design-timing',
          question: 'Quand définirez-vous l’identité visuelle et le design de votre produit ?',
          options: [
            'Au Jour 4, lors du choix du modèle et de la conception de l’expérience interactive',
            'Dès maintenant, en recopiant obligatoirement les couleurs d’AI CREATOR Studio',
            'Après la mise en vente sur Chariow',
          ],
          correctIndex: 0,
          explanation:
            'Aucune direction artistique n’est imposée au départ : vous choisirez vos propres couleurs et votre typographie au Jour 4, selon votre audience.',
        },
      ],
    },
  ],
};
