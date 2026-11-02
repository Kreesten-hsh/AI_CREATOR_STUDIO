import type { StartHereLesson } from '../../types/course';

export const SETUP_LESSON: StartHereLesson = {
  id: 'setup',
  lessonNumber: 2,
  title: 'CONFIGURER LE STUDIO & L\'IDENTITÉ',
  italicTitleWord: 'L\'IDENTITÉ',
  subtitle: 'BIEN COMMENCER 02 : PROFIL & DIRECTION VISUELLE',
  objective:
    'Définir votre profil de créateur, les paramètres de votre offre et votre esthétique visuelle afin que chaque générateur de prompt s\'alimente automatiquement au cours des leçons.',
  blocks: [
    {
      id: 'setup-prose-1',
      type: 'prose',
      eyebrow: 'MOTEUR DE VARIABLES DYNAMIQUES',
      title: 'Définissez une fois, injectez dans toutes les leçons',
      italicAccent: 'Zéro saisie répétitive',
      highlightPill:
        'Les variables enregistrées ici alimentent {{business}}, {{targetAudience}}, {{productType}}, {{brandStyle}} et {{mainObjective}} à travers l\'ensemble du studio.',
      paragraphs: [
        'Au lieu de copier des invites génériques et de remplacer manuellement des crochets chaque jour, AI CREATOR Studio injecte directement le contexte de votre projet dans le compilateur d\'invites.',
        'Complétez les champs fondamentaux de votre profil ci-dessous, sélectionnez votre direction graphique dans le sélecteur d\'identité, et prévisualisez le compilateur en temps réel en bas de page.',
      ],
    },
    {
      id: 'setup-profile-exercise',
      type: 'text-exercise',
      title: 'Étape 1 : Variables de profil et fondations de votre offre',
      instructions:
        'Saisissez votre thématique ou activité ci-dessous, puis renseignez les variables complémentaires. Chaque modification s\'enregistre instantanément dans votre navigateur.',
      placeholder:
        'ex. Studio de coaching postural pour ingénieurs logiciels travaillant à distance souhaitant soulager le mal de dos',
      maxLength: 300,
      profileBinding: 'business',
      secondaryFields: [
        {
          key: 'studentName',
          label: 'Votre prénom ou nom de studio',
          placeholder: 'ex. Alex Rivera',
        },
        {
          key: 'targetAudience',
          label: 'Audience cible ({{targetAudience}})',
          placeholder: 'ex. Professionnels du numérique de 28 à 45 ans travaillant sur écran',
        },
        {
          key: 'productType',
          label: 'Format du produit digital ({{productType}})',
          placeholder: 'ex. Starter Kit interactif de mobilité et renforcement',
        },
        {
          key: 'mainObjective',
          label: 'Objectif principal du parcours ({{mainObjective}})',
          placeholder: 'ex. Transformer mon guide PDF statique en une application web interactive vendue à 49 €',
        },
      ],
    },
    {
      id: 'setup-vibe-picker',
      type: 'vibe-picker',
      title: 'Étape 2 : Choisir votre direction visuelle',
      description:
        'Sélectionnez la palette, le style structurel et les polices éditoriales pour les guides interactifs et pages de vente générés avec Claude. Ce choix met automatiquement à jour votre variable {{brandStyle}}.',
    },
    {
      id: 'setup-prompt-test',
      type: 'prompt-builder',
      title: 'Étape 3 : Tester le compilateur de prompt en direct',
      description:
        'Vérifiez comment les variables de votre profil et votre identité visuelle s\'injectent dynamiquement dans un prompt système destiné à Claude.',
      deliverableTarget: 'claude-artifact',
      fields: [
        {
          key: 'business',
          label: 'Activité / Niche ({{business}})',
          placeholder: 'Votre domaine ou thématique',
          profileBinding: 'business',
        },
        {
          key: 'targetAudience',
          label: 'Audience cible ({{targetAudience}})',
          placeholder: 'Pour qui vous créez ce produit',
          profileBinding: 'targetAudience',
        },
        {
          key: 'productType',
          label: 'Type de produit ({{productType}})',
          placeholder: 'Guide interactif, boîte à outils ou mini-formation',
          profileBinding: 'productType',
        },
        {
          key: 'brandStyle',
          label: 'Direction visuelle ({{brandStyle}})',
          placeholder: 'Généré par le sélecteur d\'identité',
          profileBinding: 'brandStyle',
        },
        {
          key: 'mainObjective',
          label: 'Objectif principal ({{mainObjective}})',
          placeholder: 'Résultat concret apporté à l\'acheteur',
          profileBinding: 'mainObjective',
        },
      ],
      template: `Tu es mon Architecte Produit Interactif Senior et Designer d'Interface Éditoriale.

CONTEXTE DU PROJET :
- Activité / Niche : {{business}}
- Audience cible : {{targetAudience}}
- Format du produit digital : {{productType}}
- Direction visuelle : {{brandStyle}}
- Transformation majeure de l'acheteur : {{mainObjective}}

MISSION :
Propose une architecture d'application web interactive en 5 modules (application autonome en HTML/CSS/JS ou Claude Artifact) destinée à remplacer un document PDF statique pour cette audience exacte. Intègre 3 micro-outils interactifs (calculateurs, listes d'évaluation ou générateurs dynamiques) conçus sur mesure pour leur objectif principal.`,
    },
    {
      id: 'setup-callout-tip',
      type: 'callout',
      variant: 'pro-insight',
      title: 'Conseil pratique : Ajuster vos variables à tout moment',
      content:
        'Au fur et à mesure que vous affinez votre positionnement dans le Module 1 (Leçons 01 à 05), vous pouvez modifier n\'importe quelle variable directement dans chaque composant de prompt ou revenir sur cette page de configuration.',
    },
  ],
};
