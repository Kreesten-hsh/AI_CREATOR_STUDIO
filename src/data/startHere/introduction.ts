import type { StartHereLesson } from '../../types/course';

export const INTRODUCTION_LESSON: StartHereLesson = {
  id: 'introduction',
  lessonNumber: 1,
  title: 'BIENVENUE DANS LE STUDIO',
  italicTitleWord: 'STUDIO',
  subtitle: 'ORIENTATION 01 : COMPRENDRE LA MÉTHODE V2',
  objective:
    'Comprendre le principe fondamental du Studio (« Tu ne vas pas apprendre à créer notre plateforme, tu vas apprendre à créer la tienne »), la structure en 3 modules et 9 leçons, et quand l’interactivité apporte une valeur réelle.',
  blocks: [
    {
      id: 'intro-prose-1',
      type: 'prose',
      eyebrow: 'BRIEFING D’ORIENTATION (HORS DÉCOMPTE DES 9 LEÇONS)',
      title: 'Créer votre propre produit interactif, dans votre domaine',
      italicAccent: 'Votre expertise, votre outil',
      highlightPill:
        'Principe fondamental : Vous n’allez pas reproduire AI CREATOR Studio. Vous allez concevoir votre propre produit digital pour votre audience.',
      paragraphs: [
        'Bienvenue dans AI CREATOR Studio. Les ebooks, PDF et guides statiques continuent de très bien se vendre lorsqu’ils répondent à un besoin de lecture ou d’apprentissage théorique. L’interactivité n’est jamais automatiquement supérieure à un document.',
        'En revanche, lorsqu’un client doit calculer, diagnostiquer sa situation, filtrer des options, suivre une progression ou générer un plan sur mesure, un outil interactif élimine la friction manuelle. Ce mini-cours de 3 modules et 9 leçons vous apprend à utiliser Claude pour transformer votre matière en un produit interactif personnalisé et commercialisable sur Chariow.',
      ],
      bullets: [
        'Module 01 (Leçons 01 à 03) : L’Opportunité & le Positionnement (problème client, fiche acheteur, promesse vérifiable)',
        'Module 02 (Leçons 04 à 06) : Concevoir & Créer avec Claude (blueprint, construction HTML/JS avec sauvegarde JSON portable, personnalisation et export ZIP)',
        'Module 03 (Leçons 07 à 09) : Vendre & Promouvoir (offre et prix, boutique Chariow, contenus de lancement)',
        'Bonus 01 : Le Système ManyChat Automatisé avec Claude (conforme aux règles Meta et à la fenêtre de 24h)',
        'Bonus 02 : Marketing Library (20 accroches, 5 carrousels, 3 séquences emails, scripts de démonstration)',
      ],
    },
    {
      id: 'intro-callout-distinction',
      type: 'callout',
      variant: 'important',
      title: 'Distinction clé : La plateforme du cours vs Votre produit',
      content:
        'Cette plateforme de formation utilise sa propre direction artistique (Néo-Brutaliste Rouge Brique et Crème). Votre produit ne doit jamais copier ce style ni nos écrans : vous choisirez vos propres couleurs, votre typographie et votre format d’interaction adaptés à votre audience.',
    },
    {
      id: 'intro-resource-demos',
      type: 'resource',
      title: 'La Démonstration Fil Rouge : Du Guide Statique à l’Outil Interactif',
      description:
        'Comparez le guide PDF d’origine et sa transformation en outil interactif doté de sa propre identité visuelle (Ardoise & Émeraude) et d’une sauvegarde portable JSON.',
      resources: [
        {
          id: 'res-intro-demo-avant',
          title: 'Matériau de départ : Guide PDF Statique',
          category: 'guide',
          description:
            'Support de simulation illustrant un guide méthodologique nécessitant des calculs manuels sur papier.',
          format: 'HTML / PDF',
          externalUrl: '/demos/pdf-to-hub/avant-pdf-statique.html',
        },
        {
          id: 'res-intro-demo-apres',
          title: 'Résultat transformé : Outil Interactif Autonome',
          category: 'template',
          description:
            'Testez le calculateur de capacité, le suivi 30 jours et la sauvegarde portable Exporter / Importer JSON.',
          format: 'HTML / JS / JSON',
          externalUrl: '/demos/pdf-to-hub/apres-hub-interactif.html',
        },
      ],
    },
    {
      id: 'intro-quiz-check',
      type: 'quiz',
      title: 'Vérification des principes du parcours',
      description: 'Assurez-vous d’avoir bien intégré la philosophie du Studio avant de démarrer la Leçon 01.',
      questions: [
        {
          id: 'q-output-format',
          question:
            'Quand un format interactif est-il pertinent par rapport à un document PDF statique ?',
          options: [
            'Lorsqu’il facilite réellement une action concrète : calcul, diagnostic, personnalisation, tri ou prise de décision',
            'Systématiquement, car plus personne n’achète de PDF aujourd’hui',
            'Uniquement si l’on programme un serveur backend complexe avec base de données',
          ],
          correctIndex: 0,
          explanation:
            'Les PDF statiques restent pertinents pour la lecture. L’interactivité apporte une valeur distinctive lorsqu’elle aide l’acheteur à accomplir une action concrète.',
        },
        {
          id: 'q-progress-rule',
          question: 'Quelle identité visuelle devez-vous appliquer au produit que vous allez créer ?',
          options: [
            'Exactement les couleurs Rouge Brique et Crème d’AI CREATOR Studio',
            'Votre propre identité visuelle, adaptée à votre domaine et à votre audience',
            'Aucune mise en forme graphique',
          ],
          correctIndex: 1,
          explanation:
            'Vous créez votre propre produit pour votre marché : il doit refléter votre univers professionnel et non celui du Studio.',
        },
      ],
    },
    {
      id: 'intro-checklist',
      type: 'checklist',
      title: 'Liste de préparation avant la Leçon 01',
      description: 'Cochez ces trois points pour confirmer que votre environnement est prêt.',
      items: [
        {
          id: 'chk-claude-account',
          label: 'Compte Claude opérationnel',
          detail: 'Gardez Claude ouvert dans un second onglet pour exécuter les prompts de chaque leçon.',
        },
        {
          id: 'chk-browser-storage',
          label: 'Compréhension de la sauvegarde de votre progression',
          detail:
            'Vos réponses aux exercices des 9 leçons sont sauvegardées localement dans votre navigateur.',
        },
        {
          id: 'chk-four-steps',
          label: 'Progression en 3 modules et 9 leçons',
          detail:
            'Chaque leçon produit un livrable précis qui alimente directement la leçon suivante.',
        },
      ],
    },
  ],
};
