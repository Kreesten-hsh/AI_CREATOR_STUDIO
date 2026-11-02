import { buildDayFromBlueprint } from './dayFactory';

export const day06 = buildDayFromBlueprint({
  dayNumber: 6,
  sprintId: 'sprint-2',
  title: 'DÉCONSTRUCTION DU CONTENU STATIQUE',
  italicTitleWord: 'DÉCONSTRUCTION',
  objective: 'Auditer et décomposer un document PDF ou texte brut en blocs d\'apprentissage interactifs.',
  deliverableSummary: 'Matrice de transformation du contenu vers des composants interactifs',
  deliverableTarget: 'claude-artifact',
  stepSubtitles: ['Auditer le texte statique', 'Prompt de déconstruction', 'Passage du PDF à l\'interface', 'Structurer vos blocs de contenu'],
  promptGoal: 'Transformer le plan brut de mon sujet pour convertir les paragraphes passifs en listes d\'actions, onglets et exercices dynamiques.',
});
