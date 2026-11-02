import { buildDayFromBlueprint } from './dayFactory';

export const day18 = buildDayFromBlueprint({
  dayNumber: 18,
  sprintId: 'sprint-4',
  title: 'WEBHOOK N8N & ROUTAGE DES PROSPECTS',
  italicTitleWord: 'ROUTAGE',
  objective: 'Connecter votre formulaire interactif ou capture de messages à un pipeline d\'automatisation n8n.',
  deliverableSummary: 'Schéma de workflow n8n pour capture et segmentation des prospects',
  deliverableTarget: 'automation-json',
  stepSubtitles: ['Interconnexion des outils', 'Prompt de workflow n8n', 'Exemple de données webhook', 'Configurer le routage des leads'],
  promptGoal: 'Générer une spécification de workflow n8n et un schéma de payload webhook capturant les réponses de mon outil interactif pour les étiqueter par segment.',
});
