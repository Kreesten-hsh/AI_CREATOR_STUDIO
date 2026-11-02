import { buildDayFromBlueprint } from './dayFactory';

export const day21 = buildDayFromBlueprint({
  dayNumber: 21,
  sprintId: 'sprint-5',
  title: 'MOTEUR DE CAROUSELS ÉDITORIAUX',
  italicTitleWord: 'CAROUSELS',
  objective: 'Générer des carrousels graphiques éditoriaux à fort contraste pour mettre en valeur votre produit interactif.',
  deliverableSummary: 'Modèle de carrousel éditorial en 5 diapositives (HTML/SVG)',
  deliverableTarget: 'html-app',
  stepSubtitles: ['Impact visuel immédiat', 'Prompt de générateur de carrousel', 'Anatomie des diapositives', 'Créer votre premier carrousel'],
  promptGoal: 'Bâtir un template de carrousel réutilisable de 5 diapositives en HTML/CSS aux couleurs de mon identité visuelle pour contraster l\'ancien format PDF et mon nouvel outil interactif.',
});
