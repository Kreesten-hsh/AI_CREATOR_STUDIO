import type { StartHereLesson } from '../../types/course';

export const SETUP_LESSON: StartHereLesson = {
  id: 'setup',
  lessonNumber: 2,
  title: 'CONFIGURER VOTRE PROFIL PROJET',
  italicTitleWord: 'PROFIL',
  subtitle: 'ORIENTATION 02 : VARIABLES & IDENTITÉ PROPRE',
  objective:
    'Renseigner votre thématique, votre audience cible et votre propre direction visuelle afin que les générateurs de prompts des 9 leçons s’adaptent automatiquement à votre projet.',
  blocks: [
    {
      id: 'setup-prose-1',
      type: 'prose',
      eyebrow: 'VARIABLES DYNAMIQUES DU PROJET',
      title: 'Renseignez votre contexte une fois pour tout le parcours',
      italicAccent: 'Personnalisation directe',
      highlightPill:
        'Vos variables alimentent {{business}}, {{targetAudience}}, {{productType}}, {{brandStyle}} et {{mainObjective}} dans les prompts des 9 leçons.',
      paragraphs: [
        'Pour vous éviter de ressaisir votre contexte à chaque leçon, AI CREATOR Studio injecte automatiquement les informations de votre profil dans les compilateurs de prompts.',
        'Complétez les champs ci-dessous avec vos informations actuelles (même provisoires : vous les affinerez au fil du Module 01) et choisissez une direction visuelle propre à votre futur produit.',
      ],
    },
    {
      id: 'setup-profile-exercise',
      type: 'text-exercise',
      title: 'Étape 1 : Vos variables de départ',
      instructions:
        'Saisissez votre thématique ou domaine d’expertise ci-dessous, puis complétez les champs secondaires. Vos réponses sont enregistrées automatiquement.',
      placeholder:
        'Ex. Conseil en organisation financière pour indépendants, Formation en recrutement PME, Coaching nutritionnel...',
      maxLength: 300,
      profileBinding: 'business',
      secondaryFields: [
        {
          key: 'studentName',
          label: 'Votre prénom ou nom professionnel',
          placeholder: 'Ex. Samira K.',
        },
        {
          key: 'targetAudience',
          label: 'Votre audience cible ({{targetAudience}})',
          placeholder: 'Ex. Dirigeants de PME recrutant sans service RH interne',
        },
        {
          key: 'productType',
          label: 'Idée de format initial ({{productType}})',
          placeholder: 'Ex. Calculateur, diagnostic interactif ou parcours guidé',
        },
        {
          key: 'mainObjective',
          label: 'Résultat concret visé pour l’acheteur ({{mainObjective}})',
          placeholder: 'Ex. Évaluer objectivement un candidat en 15 minutes avec une grille pondérée',
        },
      ],
    },
    {
      id: 'setup-vibe-picker',
      type: 'vibe-picker',
      title: 'Étape 2 : Choisir la direction visuelle de votre futur produit',
      description:
        'Sélectionnez une harmonie de couleurs, une structure et une typographie adaptées à VOTRE audience. Ce choix remplit la variable {{brandStyle}} utilisée à la Leçon 06.',
    },
    {
      id: 'setup-prompt-test',
      type: 'prompt-builder',
      title: 'Étape 3 : Vérifier l’injection de vos variables',
      description:
        'Observez comment vos données remplacent automatiquement les variables dans le prompt ci-dessous.',
      deliverableTarget: 'claude-artifact',
      fields: [
        {
          key: 'business',
          label: 'Activité / Domaine ({{business}})',
          placeholder: 'Votre domaine d’expertise',
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
          label: 'Format envisagé ({{productType}})',
          placeholder: 'Diagnostic, calculateur, générateur, checklist...',
          profileBinding: 'productType',
        },
        {
          key: 'brandStyle',
          label: 'Identité visuelle propre ({{brandStyle}})',
          placeholder: 'Définie via le sélecteur ci-dessus ou vos propres couleurs',
          profileBinding: 'brandStyle',
        },
        {
          key: 'mainObjective',
          label: 'Objectif client ({{mainObjective}})',
          placeholder: 'Action concrète facilitée par votre outil',
          profileBinding: 'mainObjective',
        },
      ],
      template: `<context>
- Domaine d'expertise : {{business}}
- Acheteur cible : {{targetAudience}}
- Format interactif envisagé : {{productType}}
- Identité visuelle propre au produit : {{brandStyle}}
- Résultat concret recherché : {{mainObjective}}
</context>

<instruction>
Résume en 3 points comment un outil interactif sur mesure peut aider cette audience à atteindre cet objectif plus facilement qu'avec un support passif.
</instruction>`,
    },
    {
      id: 'setup-callout-tip',
      type: 'callout',
      variant: 'pro-insight',
      title: 'Liberté totale d’évolution',
      content:
        'Ces variables ne sont jamais figées : vous pourrez les modifier directement dans chaque leçon au fur et à mesure que votre positionnement et votre blueprint se précisent.',
    },
  ],
};
