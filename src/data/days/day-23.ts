import { buildDayFromBlueprint } from './dayFactory';

export const day23 = buildDayFromBlueprint({
  dayNumber: 23,
  sprintId: 'sprint-5',
  title: 'POSTS D\'AUTORITÉ & ÉTUDES DE CAS',
  italicTitleWord: 'AUTORITÉ',
  objective: 'Transformer la méthodologie de votre produit en publications écrites percutantes intégrant des mots-clés d\'automatisation.',
  deliverableSummary: '5 publications éditoriales avec déclencheurs d\'automatisation',
  deliverableTarget: 'sales-copy',
  stepSubtitles: ['Rédaction axée sur la preuve', 'Prompt de matrice de contenu', 'Anatomie d\'un post haute valeur', 'Générer vos 5 publications de lancement'],
  promptGoal: 'Générer 5 publications éducatives illustrant mon framework et se terminant par un mot-clé déclencheur pour ma messagerie privée automatisée.',
});
