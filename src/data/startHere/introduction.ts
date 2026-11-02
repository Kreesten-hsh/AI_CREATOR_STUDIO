import type { StartHereLesson } from '../../types/course';

export const INTRODUCTION_LESSON: StartHereLesson = {
  id: 'introduction',
  lessonNumber: 1,
  title: 'BIENVENUE DANS LE STUDIO',
  italicTitleWord: 'STUDIO',
  subtitle: 'BIEN COMMENCER 01 : MAÎTRISER CLAUDE',
  objective:
    'Comprendre la mécanique d\'apprentissage, comment Claude transforme des documents statiques en produits digitaux interactifs, et comment votre progression est enregistrée.',
  blocks: [
    {
      id: 'intro-prose-1',
      type: 'prose',
      eyebrow: 'BRIEFING D\'ORIENTATION',
      title: 'Pourquoi les PDF statiques perdent de la valeur',
      italicAccent: 'L\'interactivité gagne',
      highlightPill:
        'Votre objectif : transformer des contenus ordinaires en expériences interactives que vos clients terminent réellement.',
      paragraphs: [
        'Bienvenue dans AI CREATOR Studio. Au fil de ce parcours d\'apprentissage, vous progressez à travers cinq modules d\'exécution pour passer d\'un concept d\'offre à un produit digital interactif fonctionnel, une page de vente éditoriale et un système d\'automatisation complet.',
        'Chaque leçon suit scrupuleusement le même rythme en quatre étapes : 1. Comprendre (le principe fondamental), 2. Prompt Claude (générer le composant avec Claude), 3. Exemple guidé (analyser un modèle prêt à l\'emploi), et 4. À vous de jouer (valider votre livrable personnel).',
      ],
      bullets: [
        'Module 1 (Leçons 01 à 05) : Offre et Fondations de l\'IA',
        'Module 2 (Leçons 06 à 10) : Du PDF à l\'Expérience Interactive',
        'Module 3 (Leçons 11 à 15) : Pages de Vente Éditoriales',
        'Module 4 (Leçons 16 à 20) : Studio d\'Automatisation (ManyChat / n8n)',
        'Module 5 (Leçons 21 à 25) : Usine à Contenu et Lancement',
      ],
    },
    {
      id: 'intro-callout-distinction',
      type: 'callout',
      variant: 'important',
      title: 'Distinction architecturale clé : Moteur de formation vs Livrables élèves',
      content:
        'Cette plateforme de cours est développée avec React et TypeScript pour structurer votre progression et vos widgets interactifs. En revanche, les créations que VOUS réaliserez avec Claude s\'appuient sur des formats légers et universels : les Claude Artifacts et des applications HTML/CSS/JavaScript autonomes monoblocs, faciles à héberger et à diffuser sans outillage lourd.',
    },
    {
      id: 'intro-resource-demos',
      type: 'resource',
      title: 'La Démonstration Phare du Studio : Avant / Après',
      description: 'Découvrez la preuve concrète de la transformation enseignée dans le Module 02.',
      resources: [
        {
          id: 'res-intro-demo-avant',
          title: 'Version Avant : Guide PDF Statique (12 Pages)',
          category: 'guide',
          description: 'Consultez la version statique réaliste pour mesurer les limites de la lecture passive.',
          format: 'HTML / PDF',
          externalUrl: '/demos/pdf-to-hub/avant-pdf-statique.html',
        },
        {
          id: 'res-intro-demo-apres',
          title: 'Version Après : Hub Interactif Autonome',
          category: 'template',
          description: 'Testez le résultat transformé : sélecteur de statut, calculateur en direct et checklist persistante.',
          format: 'HTML / JS',
          externalUrl: '/demos/pdf-to-hub/apres-hub-interactif.html',
        },
      ],
    },
    {
      id: 'intro-video-overview',
      type: 'video',
      title: 'Visite guidée du Studio et workflow Claude Artifacts',
      description:
        'Vue d\'ensemble pour combiner cet espace de travail avec Claude Artifacts et publier des guides interactifs sans écrire de code fastidieux.',
      duration: '04:15',
      posterLabel: 'BRIEFING D\'ORIENTATION : MAÎTRISER LE STUDIO',
      keyTakeaways: [
        'Gardez Claude ouvert en parallèle d\'AI CREATOR Studio.',
        'Activez la fonctionnalité "Artifacts" dans vos réglages Claude avant d\'aborder le Module 2.',
        'Validez chacune des 4 étapes d\'une leçon pour l\'illuminer en rouge brique dans votre grille de progression.',
      ],
    },
    {
      id: 'intro-quiz-check',
      type: 'quiz',
      title: 'Validation des fondamentaux',
      description: 'Vérifiez la maîtrise du fonctionnement du studio avant de configurer vos variables.',
      questions: [
        {
          id: 'q-output-format',
          question:
            'Quel format cible allez-vous demander à Claude de générer pour vos livrables ?',
          options: [
            'Des Claude Artifacts et des applications HTML/CSS/JavaScript autonomes',
            'Un cluster Kubernetes multi-services',
            'Un document Word imprimé en noir et blanc',
          ],
          correctIndex: 0,
          explanation:
            'Les applications HTML/CSS/JS autonomes et les Claude Artifacts offrent un rendu visuel immédiat, sans compilation ni dépendances complexes pour vos acheteurs.',
        },
        {
          id: 'q-progress-rule',
          question: 'Quand une case de leçon devient-elle rouge brique dans la grille de navigation ?',
          options: [
            'Dès que vous cliquez sur le titre de la leçon',
            'Uniquement quand les 4 étapes (Comprendre, Prompt Claude, Exemple guidé, À vous de jouer) sont validées',
            'Lorsque vous terminez la section Bien commencer',
          ],
          correctIndex: 1,
          explanation:
            'Une leçon est marquée comme validée uniquement après la complétion de ses 4 étapes. Les deux leçons d\'introduction sont gérées séparément pour ne pas fausser le décompte du parcours.',
        },
      ],
    },
    {
      id: 'intro-checklist',
      type: 'checklist',
      title: 'Liste de préparation avant décollage',
      description: 'Cochez chaque point dès que vous êtes prêt à configurer votre espace de travail.',
      items: [
        {
          id: 'chk-claude-account',
          label: 'Compte Claude opérationnel avec la fonction Artifacts activée',
          detail: 'Un compte gratuit ou Pro convient parfaitement ; assurez-vous que les Artifacts sont bien activés.',
        },
        {
          id: 'chk-browser-storage',
          label: 'Compréhension de la sauvegarde locale automatique',
          detail:
            'Votre avancement s\'enregistre en continu et silencieusement dans votre navigateur sans perte de données.',
        },
        {
          id: 'chk-four-steps',
          label: 'Engagement à valider les 4 étapes de chaque leçon',
          detail: 'Comprendre, Prompt Claude, Exemple guidé, et À vous de jouer.',
        },
      ],
    },
  ],
};
