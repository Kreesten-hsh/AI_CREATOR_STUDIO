import { buildDayFromBlueprint } from './dayFactory';

export const day08 = buildDayFromBlueprint({
  dayNumber: 8,
  sprintId: 'sprint-2',
  title: 'CALCULATEURS & OUTILS DIAGNOSTIQUES',
  italicTitleWord: 'CALCULATEURS',
  objective: 'Intégrer un calculateur sur mesure, un questionnaire ou un diagnostic interactif dans votre guide.',
  deliverableSummary: 'Composant interactif de diagnostic ou de calcul intégré',
  deliverableTarget: 'html-app',
  stepSubtitles: ['Micro-outils à forte valeur', 'Prompt de génération d\'outils', 'Exemple de diagnostic interactif', 'Créer votre composant personnalisé'],
  promptGoal: 'Créer un questionnaire diagnostique interactif ou un calculateur de retour sur investissement autonome adapté à l\'objectif principal de mon audience.',
});
