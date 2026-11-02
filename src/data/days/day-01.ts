import { buildDayFromBlueprint } from './dayFactory';

export const day01 = buildDayFromBlueprint({
  dayNumber: 1,
  sprintId: 'sprint-1',
  title: 'NICHE & PROBLÈME CIBLE',
  italicTitleWord: 'PROBLÈME',
  objective: 'Identifier le problème précis et urgent que votre produit digital résout et définir l\'audience concernée.',
  deliverableSummary: 'Déclaration de niche orientée problème et matrice de friction client',
  deliverableTarget: 'sales-copy',
  stepSubtitles: ['Comprendre ce qu\'est une vraie niche', 'Prompt d\'extraction de niche', 'Analyse d\'un modèle concret', 'Formuler votre problème cible'],
  focusVariable: 'business',
  promptGoal: 'Analyser mon domaine et extraire 3 problèmes urgents que mon audience cible est prête à résoudre avec une boîte à outils digitale interactive.',
});
