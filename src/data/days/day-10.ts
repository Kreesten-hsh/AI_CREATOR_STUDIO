import { buildDayFromBlueprint } from './dayFactory';

export const day10 = buildDayFromBlueprint({
  dayNumber: 10,
  sprintId: 'sprint-2',
  title: 'FINITIONS DU GUIDE INTERACTIF',
  italicTitleWord: 'FINITIONS',
  objective: 'Peaufiner la responsivité mobile, la typographie et le confort tactile de votre guide interactif.',
  deliverableSummary: 'Guide digital interactif finalisé et prêt à l\'emploi',
  deliverableTarget: 'html-app',
  stepSubtitles: ['Audit responsif', 'Prompt de finitions d\'interface', 'Comparatif avant/après', 'Finaliser le guide du Module 2'],
  promptGoal: 'Auditer et perfectionner mon guide digital interactif pour l\'affichage mobile, l\'accessibilité au clavier et la finition visuelle néo-brutaliste.',
});
