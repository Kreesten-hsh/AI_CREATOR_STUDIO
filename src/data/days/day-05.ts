import { buildDayFromBlueprint } from './dayFactory';

export const day05 = buildDayFromBlueprint({
  dayNumber: 5,
  sprintId: 'sprint-1',
  title: 'PLAN DU PRODUIT DIGITAL',
  italicTitleWord: 'DIGITAL',
  objective: 'Finaliser le plan complet module par module de votre produit, prêt pour la transformation interactive du Module 2.',
  deliverableSummary: 'Plan complet du produit digital et cartographie des modules',
  deliverableTarget: 'claude-artifact',
  stepSubtitles: ['Structuration des modules', 'Prompt de génération du plan', 'Modèle de plan de produit', 'Valider le plan du Module 1'],
  promptGoal: 'Compiler ma niche, mon audience, mon positionnement et le format retenu en un plan d\'architecture complet pour mon produit digital.',
});
