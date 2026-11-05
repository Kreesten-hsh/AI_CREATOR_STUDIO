import { ALL_STEP_TYPES, type StepType } from '../types/course';

export const TOTAL_COURSE_DAYS = 9;
export const DEFAULT_STEPS_PER_DAY = 4;
export const STEPS_PER_DAY = DEFAULT_STEPS_PER_DAY;

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

export function isDayCompleted(
  completedSteps: readonly StepType[] | undefined,
  totalSteps: number = DEFAULT_STEPS_PER_DAY
): boolean {
  const normalized = normalizeStepList(completedSteps);
  return normalized.length >= totalSteps && totalSteps > 0;
}

export function calculateDailyProgress(
  completedSteps: readonly StepType[] | undefined,
  totalSteps: number = DEFAULT_STEPS_PER_DAY
): DailyProgressResult {
  const normalized = normalizeStepList(completedSteps);
  const safeTotal = totalSteps > 0 ? totalSteps : DEFAULT_STEPS_PER_DAY;
  const completedCount = Math.min(normalized.length, safeTotal);
  const percentage = Math.round((completedCount / safeTotal) * 100);

  return {
    completedCount,
    total: safeTotal,
    percentage,
    isCompleted: completedCount >= safeTotal,
  };
}

export function calculateGlobalProgress(
  completedStepsByDay: Readonly<Record<number, StepType[]>> | undefined,
  totalStepsByDay?: Readonly<Record<number, number>>
): GlobalProgressResult {
  if (!completedStepsByDay || typeof completedStepsByDay !== 'object') {
    return {
      completedDaysCount: 0,
      totalDays: TOTAL_COURSE_DAYS,
      percentage: 0,
      completedDayNumbers: [],
    };
  }

  const completedDayNumbers: number[] = [];

  for (let dayNum = 1; dayNum <= TOTAL_COURSE_DAYS; dayNum += 1) {
    const stepsForDay = completedStepsByDay[dayNum];
    const totalSteps = totalStepsByDay?.[dayNum] ?? DEFAULT_STEPS_PER_DAY;
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
