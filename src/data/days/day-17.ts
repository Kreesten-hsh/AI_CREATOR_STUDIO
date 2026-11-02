import { buildDayFromBlueprint } from './dayFactory';

export const day17 = buildDayFromBlueprint({
  dayNumber: 17,
  sprintId: 'sprint-4',
  title: 'FLUX DE MESSAGERIE MANYCHAT',
  italicTitleWord: 'MESSAGERIE',
  objective: 'Bâtir un workflow automatisé du commentaire au message privé pour délivrer le lien d\'accès interactif.',
  deliverableSummary: 'Script et déclencheurs de mots-clés ManyChat pour messages privés',
  deliverableTarget: 'automation-json',
  stepSubtitles: ['Mécanique de messagerie automatisée', 'Prompt de flux ManyChat', 'Exemple de séquence privée', 'Construire votre flux automatisé'],
  promptGoal: 'Rédiger une conversation automatisée en 4 étapes sur ManyChat déclenchée par mot-clé, qui qualifie l\'utilisateur et transmet mon lien interactif.',
});
