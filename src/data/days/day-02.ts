import { buildDayFromBlueprint } from './dayFactory';

export const day02 = buildDayFromBlueprint({
  dayNumber: 2,
  sprintId: 'sprint-1',
  title: 'PSYCHOLOGIE & LEVIERS D\'ACHAT',
  italicTitleWord: 'PSYCHOLOGIE',
  objective: 'Cartographier les déclencheurs d\'achat précis, les frustrations et les résultats souhaités par votre audience.',
  deliverableSummary: 'Profil psychologique et déclencheurs d\'achat de l\'audience cible',
  deliverableTarget: 'sales-copy',
  stepSubtitles: ['Psychologie de l\'acheteur', 'Prompt de recherche d\'audience', 'Analyse du profil type', 'Cartographier votre acheteur'],
  focusVariable: 'targetAudience',
  promptGoal: 'Construire un profil psychologique d\'acheteur concret mettant en valeur 5 frustrations quotidiennes et désirs immédiats sans jargon démographique générique.',
});
