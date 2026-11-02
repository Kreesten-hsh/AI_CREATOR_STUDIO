import { buildDayFromBlueprint } from './dayFactory';

export const day09 = buildDayFromBlueprint({
  dayNumber: 9,
  sprintId: 'sprint-2',
  title: 'PERSISTENCE LOCALE & PROGRESSION',
  italicTitleWord: 'PERSISTENCE',
  objective: 'Ajouter la sauvegarde automatique en LocalStorage et le suivi de complétion au sein de votre livrable.',
  deliverableSummary: 'Couche de sauvegarde locale de la progression et d\'export des notes',
  deliverableTarget: 'html-app',
  stepSubtitles: ['Gestion d\'état sans backend', 'Prompt d\'intégration de persistence', 'Modèle d\'implémentation LocalStorage', 'Connecter la sauvegarde automatique'],
  promptGoal: 'Intégrer la sauvegarde d\'état dans LocalStorage, le calcul du pourcentage de progression et un bouton d\'exportation JSON/Texte dans mon guide interactif.',
});
