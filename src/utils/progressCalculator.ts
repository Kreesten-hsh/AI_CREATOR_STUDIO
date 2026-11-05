import { ALL_STEP_TYPES, type StepType } from '../types/course';

export const TOTAL_COURSE_DAYS = 9;

export interface DailyProgressResult {
  completedCount: number;
  total: number;
  percentage: number;
  isCompleted: boolean;
}

export interface GlobalProgressResult {
  completedDaysCount: number;
  totalDays: number;
  percentage: number;
  completedDayNumbers: number[];
}

/**
 * Normalise les identifiants d'étapes terminées en supprimant les doublons
 * et les valeurs non textuelles.
 */
export function normalizeStepIdList(stepIds: readonly string[] | undefined): string[] {
  if (!Array.isArray(stepIds)) {
    return [];
  }
  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const id of stepIds) {
    if (typeof id === 'string' && id.trim().length > 0 && !seen.has(id)) {
      seen.add(id);
      normalized.push(id);
    }
  }
  return normalized;
}

/**
 * Fonction conservée pour la compatibilité de migration V1 / V2.
 */
export function normalizeStepList(steps: readonly StepType[] | undefined): StepType[] {
  if (!Array.isArray(steps)) {
    return [];
  }
  const validSet = new Set<StepType>();
  for (const step of steps) {
    if (ALL_STEP_TYPES.includes(step)) {
      validSet.add(step);
    }
  }
  return ALL_STEP_TYPES.filter((step) => validSet.has(step));
}

/**
 * Détermine si une journée est entièrement terminée.
 * Le nombre total d'étapes provient de la journée réelle (`day.steps.length`), jamais d'une constante.
 */
export function isDayCompleted(
  completedStepIds: readonly string[] | undefined,
  totalSteps: number
): boolean {
  if (!totalSteps || totalSteps <= 0) {
    return false;
  }
  const normalized = normalizeStepIdList(completedStepIds);
  return normalized.length >= totalSteps;
}

/**
 * Calcule la progression quotidienne exacte selon le nombre réel d'étapes (1, 2, 3 ou 4 étapes en transition).
 */
export function calculateDailyProgress(
  completedStepIds: readonly string[] | undefined,
  totalSteps: number
): DailyProgressResult {
  if (!totalSteps || totalSteps <= 0) {
    return {
      completedCount: 0,
      total: 0,
      percentage: 0,
      isCompleted: false,
    };
  }
  const safeTotal = totalSteps;
  const normalized = normalizeStepIdList(completedStepIds);
  const completedCount = Math.min(normalized.length, safeTotal);
  const percentage = Math.round((completedCount / safeTotal) * 100);

  return {
    completedCount,
    total: safeTotal,
    percentage,
    isCompleted: completedCount >= safeTotal,
  };
}

/**
 * Calcule la progression globale du cours en agrégeant les journées validées.
 */
export function calculateGlobalProgress(
  completedStepIdsByDay: Readonly<Record<number, string[]>> | undefined,
  totalStepsByDay: Readonly<Record<number, number>> = {}
): GlobalProgressResult {
  if (!completedStepIdsByDay || typeof completedStepIdsByDay !== 'object') {
    return {
      completedDaysCount: 0,
      totalDays: TOTAL_COURSE_DAYS,
      percentage: 0,
      completedDayNumbers: [],
    };
  }

  const completedDayNumbers: number[] = [];

  for (let dayNum = 1; dayNum <= TOTAL_COURSE_DAYS; dayNum += 1) {
    const stepsForDay = completedStepIdsByDay[dayNum];
    const totalSteps = totalStepsByDay[dayNum] ?? 3;
    if (isDayCompleted(stepsForDay, totalSteps)) {
      completedDayNumbers.push(dayNum);
    }
  }

  const completedDaysCount = completedDayNumbers.length;
  const percentage = Math.round((completedDaysCount / TOTAL_COURSE_DAYS) * 100);

  return {
    completedDaysCount,
    totalDays: TOTAL_COURSE_DAYS,
    percentage,
    completedDayNumbers,
  };
}
