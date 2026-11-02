import { buildDayFromBlueprint } from './dayFactory';

export const day12 = buildDayFromBlueprint({
  dayNumber: 12,
  sprintId: 'sprint-3',
  title: 'SECTION HERO & APERÇU INTERACTIF',
  italicTitleWord: 'HERO',
  objective: 'Créer une section hero audacieuse permettant aux acheteurs de tester immédiatement un extrait du produit.',
  deliverableSummary: 'Section Hero éditoriale avec aperçu produit interactif',
  deliverableTarget: 'html-app',
  stepSubtitles: ['Démontrer plutôt qu\'affirmer', 'Prompt de création de Hero', 'Anatomie d\'un Hero interactif', 'Construire votre section Hero'],
  promptGoal: 'Générer une section hero responsive avec typographie percutante et un mini-aperçu interactif de mon guide digital.',
});
