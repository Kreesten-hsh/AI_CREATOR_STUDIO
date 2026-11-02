import { buildDayFromBlueprint } from './dayFactory';

export const day19 = buildDayFromBlueprint({
  dayNumber: 19,
  sprintId: 'sprint-4',
  title: 'SÉQUENCE DE RELANCE AUTOMATISÉE',
  italicTitleWord: 'RELANCE',
  objective: 'Rédiger une séquence de relance en 3 étapes personnalisée selon les réponses de l\'utilisateur au diagnostic.',
  deliverableSummary: 'Séquence de 3 messages automatisés personnalisés',
  deliverableTarget: 'sales-copy',
  stepSubtitles: ['Relance contextuelle ciblée', 'Prompt de rédaction de séquence', 'Exemple de messages de suivi', 'Rédiger vos 3 messages'],
  promptGoal: 'Rédiger une séquence de 3 messages automatisés faisant référence au résultat du diagnostic interactif de l\'utilisateur pour l\'inviter à découvrir le produit complet.',
});
