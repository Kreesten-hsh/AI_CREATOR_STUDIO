import { buildDayFromBlueprint } from './dayFactory';

export const day24 = buildDayFromBlueprint({
  dayNumber: 24,
  sprintId: 'sprint-5',
  title: 'CONTRÔLE QUALITÉ & ACCÈS CLIENT',
  italicTitleWord: 'QUALITÉ',
  objective: 'Préparer votre guide interactif, votre page de vente et l\'espace d\'accueil client pour un accès fluide et instantané.',
  deliverableSummary: 'Portail de bienvenue client et liste de contrôle qualité pré-lancement',
  deliverableTarget: 'html-app',
  stepSubtitles: ['Livraison client fluide', 'Prompt de portail de bienvenue', 'Exemple d\'expérience d\'accès', 'Finaliser le contrôle qualité'],
  promptGoal: 'Créer une carte de bienvenue néo-brutaliste et des instructions d\'accès claires pour que les clients ouvrent et enregistrent immédiatement leur produit interactif.',
});
