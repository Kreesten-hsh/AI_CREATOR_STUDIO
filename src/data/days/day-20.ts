import { buildDayFromBlueprint } from './dayFactory';

export const day20 = buildDayFromBlueprint({
  dayNumber: 20,
  sprintId: 'sprint-4',
  title: 'TEST GLOBAL D\'AUTOMATISATION',
  italicTitleWord: 'AUTOMATISATION',
  objective: 'Tester et valider l\'intégralité du pipeline de capture, de segmentation et de messagerie automatisée.',
  deliverableSummary: 'Système complet et vérifié de capture et messagerie automatisée',
  deliverableTarget: 'automation-json',
  stepSubtitles: ['Test d\'endurance du pipeline', 'Prompt de checklist d\'audit', 'Guide de dépannage', 'Valider le pipeline du Module 4'],
  promptGoal: 'Créer un plan de test complet et une liste de contrôle de gestion des erreurs pour mon workflow de capture de prospects ManyChat et n8n.',
});
