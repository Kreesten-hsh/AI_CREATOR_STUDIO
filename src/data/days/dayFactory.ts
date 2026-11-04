import type { Day, ProfileVariableKey } from '../../types/course';

export interface DayBlueprint {
  dayNumber: number;
  sprintId: 'sprint-1' | 'sprint-2' | 'sprint-3' | 'sprint-4' | 'sprint-5';
  title: string;
  italicTitleWord: string;
  objective: string;
  deliverableSummary: string;
  deliverableTarget: 'claude-artifact' | 'html-app' | 'sales-copy' | 'automation-json';
  stepSubtitles: [string, string, string, string];
  focusVariable?: ProfileVariableKey;
  promptGoal: string;
}

/**
 * Construit une journée dont le contenu pédagogique n'a pas encore été produit.
 * Les étapes restent présentes (navigation, progression) mais sans aucun bloc :
 * un contenu absent reste absent jusqu'à sa véritable production.
 * Les champs `deliverableTarget`, `focusVariable` et `promptGoal` du blueprint
 * sont conservés comme cahier des charges pour la rédaction future.
 */
export function buildDayFromBlueprint(bp: DayBlueprint): Day {
  const padded = String(bp.dayNumber).padStart(2, '0');
  const dayId = `day-${padded}`;

  return {
    id: dayId,
    dayNumber: bp.dayNumber,
    sprintId: bp.sprintId,
    title: bp.title,
    italicTitleWord: bp.italicTitleWord,
    objective: bp.objective,
    deliverableSummary: bp.deliverableSummary,
    isSkeletonPlaceholder: true,
    steps: [
      {
        id: `${dayId}-step-1`,
        type: 'concept',
        number: 1,
        title: 'Comprendre',
        subtitle: bp.stepSubtitles[0],
        completionLabel: `Valider l'étape 1 : Comprendre`,
        blocks: [],
      },
      {
        id: `${dayId}-step-2`,
        type: 'prompt',
        number: 2,
        title: 'Prompt Claude',
        subtitle: bp.stepSubtitles[1],
        completionLabel: `Valider l'étape 2 : Prompt Claude`,
        blocks: [],
      },
      {
        id: `${dayId}-step-3`,
        type: 'example',
        number: 3,
        title: 'Exemple guidé',
        subtitle: bp.stepSubtitles[2],
        completionLabel: `Valider l'étape 3 : Exemple guidé`,
        blocks: [],
      },
      {
        id: `${dayId}-step-4`,
        type: 'your-turn',
        number: 4,
        title: 'À vous de jouer',
        subtitle: bp.stepSubtitles[3],
        completionLabel: `Valider l'étape 4 : À vous de jouer`,
        blocks: [],
      },
    ],
  };
}
