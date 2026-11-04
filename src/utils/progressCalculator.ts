import { ALL_STEP_TYPES, type StepType } from '../types/course';

export const TOTAL_COURSE_DAYS = 9;
export const STEPS_PER_DAY = 4;

export interface DailyProgressResult {
  completedCount: number;
  total: 4;
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

export function isDayCompleted(completedSteps: readonly StepType[] | undefined): boolean {
  const normalized = normalizeStepList(completedSteps);
  return normalized.length === STEPS_PER_DAY;
}

export function calculateDailyProgress(
  completedSteps: readonly StepType[] | undefined
): DailyProgressResult {
  const normalized = normalizeStepList(completedSteps);
  const completedCount = normalized.length;
  const percentage = Math.round((completedCount / STEPS_PER_DAY) * 100);

  return {
    completedCount,
    total: STEPS_PER_DAY,
    percentage,
    isCompleted: completedCount === STEPS_PER_DAY,
  };
}

export function calculateGlobalProgress(
  completedStepsByDay: Readonly<Record<number, StepType[]>> | undefined
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
    if (isDayCompleted(stepsForDay)) {
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
