import { buildDayFromBlueprint } from './dayFactory';

export const day03 = buildDayFromBlueprint({
  dayNumber: 3,
  sprintId: 'sprint-1',
  title: 'POSITIONNEMENT & PROMESSE',
  italicTitleWord: 'POSITIONNEMENT',
  objective: 'Formuler un positionnement percutant qui distingue nettement votre produit interactif d\'un simple document PDF.',
  deliverableSummary: 'Proposition de valeur unique et promesse de l\'offre',
  deliverableTarget: 'sales-copy',
  stepSubtitles: ['Se démarquer de la concurrence', 'Prompt de positionnement stratégique', 'Comparatif des offres', 'Valider votre promesse'],
  focusVariable: 'mainObjective',
  promptGoal: 'Générer 5 angles de positionnement distincts contrastant un PDF statique rébarbatif avec une expérience de studio digital interactif.',
});
