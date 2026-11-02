import { buildDayFromBlueprint } from './dayFactory';

export const day25 = buildDayFromBlueprint({
  dayNumber: 25,
  sprintId: 'sprint-5',
  title: 'LANCEMENT DU PRODUIT & BILAN',
  italicTitleWord: 'LANCEMENT',
  objective: 'Déployer votre plan de lancement sur 7 jours et publier l\'écosystème complet de votre produit digital interactif.',
  deliverableSummary: 'Produit publié, page de vente en ligne et calendrier de lancement sur 7 jours',
  deliverableTarget: 'sales-copy',
  stepSubtitles: ['Lancer avec sérénité', 'Prompt de commande de lancement', 'Calendrier de la semaine de lancement', 'Valider l\'ensemble du parcours'],
  promptGoal: 'Rassembler l\'ensemble de mes créations (Offre, Guide interactif, Page de vente éditoriale, Automatisation et Pack de contenu) dans un planning d\'exécution de lancement sur 7 jours.',
});
