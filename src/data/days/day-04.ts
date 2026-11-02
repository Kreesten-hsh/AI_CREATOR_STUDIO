import { buildDayFromBlueprint } from './dayFactory';

export const day04 = buildDayFromBlueprint({
  dayNumber: 4,
  sprintId: 'sprint-1',
  title: 'FORMAT DU PRODUIT INTERACTIF',
  italicTitleWord: 'FORMAT',
  objective: 'Choisir le format interactif idéal (starter kit, suite de calculateurs ou parcours guidé pas à pas).',
  deliverableSummary: 'Format du produit interactif et spécification fonctionnelle',
  deliverableTarget: 'claude-artifact',
  stepSubtitles: ['Choisir le bon support', 'Prompt d\'architecture de format', 'Exemples de formats', 'Sélectionner votre format'],
  focusVariable: 'productType',
  promptGoal: 'Concevoir la spécification structurelle de mon produit digital interactif, incluant la navigation et 3 micro-outils interactifs intégrés.',
});
