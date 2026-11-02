import { buildDayFromBlueprint } from './dayFactory';

export const day14 = buildDayFromBlueprint({
  dayNumber: 14,
  sprintId: 'sprint-3',
  title: 'OFFRE, TARIFS & FAQ ANTICIPATION',
  italicTitleWord: 'TARIFS',
  objective: 'Concevoir un bloc tarifaire limpide et une FAQ spécifique répondant aux réelles hésitations d\'achat.',
  deliverableSummary: 'Bloc de décision tarifaire et FAQ de levée des objections',
  deliverableTarget: 'html-app',
  stepSubtitles: ['Architecture de décision claire', 'Prompt de structure d\'offre', 'Analyse de carte tarifaire', 'Finaliser tarifs et FAQ'],
  promptGoal: 'Construire une carte d\'offre contrastée et une FAQ en accordéon traitant les 5 objections les plus réalistes de mon audience.',
});
