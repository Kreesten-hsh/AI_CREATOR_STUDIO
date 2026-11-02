import { buildDayFromBlueprint } from './dayFactory';

export const day16 = buildDayFromBlueprint({
  dayNumber: 16,
  sprintId: 'sprint-4',
  title: 'LEAD MAGNET & MICRO-EXPÉRIENCE',
  italicTitleWord: 'MICRO-EXPÉRIENCE',
  objective: 'Extraire un micro-outil interactif de 60 secondes de votre produit pour capter des prospects qualifiés.',
  deliverableSummary: 'Micro-outil interactif de capture de prospects',
  deliverableTarget: 'claude-artifact',
  stepSubtitles: ['Capture de leads interactive', 'Prompt de micro-outil', 'Anatomie du lead magnet', 'Créer votre micro-expérience'],
  promptGoal: 'Concevoir une évaluation interactive de 60 secondes ou un mini-générateur apportant une valeur immédiate et menant naturellement vers mon produit digital principal.',
});
