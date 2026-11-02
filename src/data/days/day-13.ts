import { buildDayFromBlueprint } from './dayFactory';

export const day13 = buildDayFromBlueprint({
  dayNumber: 13,
  sprintId: 'sprint-3',
  title: 'PREUVE VISUELLE & VISITE DU CURRICULUM',
  italicTitleWord: 'VISUELLE',
  objective: 'Présenter l\'intérieur de votre produit à l\'aide d\'onglets interactifs et de cartes de modules.',
  deliverableSummary: 'Composant interactif de visite guidée du produit',
  deliverableTarget: 'html-app',
  stepSubtitles: ['Visite transparente du produit', 'Prompt de découverte interactive', 'Modèle de présentation des modules', 'Intégrer la visite du curriculum'],
  promptGoal: 'Créer une section interactive de découverte du curriculum où les visiteurs peuvent explorer chaque module avant d\'acheter.',
});
