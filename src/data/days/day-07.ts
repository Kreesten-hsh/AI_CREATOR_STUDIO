import { buildDayFromBlueprint } from './dayFactory';

export const day07 = buildDayFromBlueprint({
  dayNumber: 7,
  sprintId: 'sprint-2',
  title: 'ARCHITECTURE CLAUDE ARTIFACTS',
  italicTitleWord: 'ARTIFACTS',
  objective: 'Générer l\'ossature principale et la barre latérale de navigation de votre guide interactif dans Claude.',
  deliverableSummary: 'Squelette de guide interactif (Claude Artifact / HTML)',
  deliverableTarget: 'claude-artifact',
  stepSubtitles: ['Architecture fichier unique', 'Prompt de génération de squelette', 'Analyse du code du squelette', 'Générer votre application'],
  promptGoal: 'Générer l\'ossature complète d\'un guide interactif autonome en HTML/CSS/JS avec barre latérale persistante, barre de progression et sélecteur de modules.',
});
