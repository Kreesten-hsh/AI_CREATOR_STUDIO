import type { StartHereLesson } from '../../types/course';

export const SETUP_LESSON: StartHereLesson = {
  id: 'setup',
  lessonNumber: 2,
  title: 'CONFIGURER VOTRE PROFIL PROJET',
  italicTitleWord: 'PROFIL',
  subtitle: 'START HERE : VARIABLES DE CONTEXTE MÉTIER',
  objective:
    'Renseigner votre domaine d’expertise, votre audience cible et votre objectif initial afin que les compilateurs de prompts des 9 leçons s’adaptent à votre document.',
  blocks: [
    {
      id: 'setup-prose-1',
      type: 'prose',
      eyebrow: 'VARIABLES DYNAMIQUES DU PROJET',
      title: 'Renseignez votre contexte initial',
      italicAccent: 'Personnalisation directe',
      highlightPill:
        'Vos variables alimentent {{business}}, {{targetAudience}}, {{productType}} et {{mainObjective}} dans les prompts des 9 leçons.',
      paragraphs: [
        'Pour vous éviter de ressaisir votre contexte à chaque prompt, AI CREATOR Studio injecte automatiquement les informations de votre profil dans les générateurs de prompts.',
        'Complétez les champs ci-dessous avec les informations tirées de votre document existant. Vous pourrez les affiner librement à tout moment au fil du parcours.',
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
      id: 'setup-prompt-test',
      type: 'prompt-builder',
      title: 'Étape 2 : Vérifier l’injection de vos variables',
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
      title: 'Direction artistique au Jour 4',
      content:
        'Rappel : le choix de votre palette de couleurs, typographies et style visuel se fera au Jour 4 avec la maquette interactive. Vous n’avez aucune contrainte de style à définir aujourd’hui.',
    },
  ],
};
