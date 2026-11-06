import {
  ALL_STEP_TYPES,
  type CourseModule,
  type Day,
  type DayId,
  type Lesson,
  type LessonId,
  type ModuleId,
  type Step,
  type StepType,
} from '../types/course';
import { ALL_DAYS, ALL_LESSONS } from '../data/course';
import { COURSE_MODULES } from '../data/sprints';

export const TOTAL_COURSE_MODULES = 3;
export const TOTAL_COURSE_DAYS = 3;
export const TOTAL_COURSE_LESSONS = 7;

export interface LessonProgressResult {
  completedStepIds: string[];
  completedCount: number;
  totalSteps: number;
  total: number;
  percentage: number;
  isCompleted: boolean;
}

export type DailyProgressResult = LessonProgressResult;

export interface DayProgressResult {
  dayId: DayId;
  dayNumber: number;
  completedLessonIds: LessonId[];
  completedLessonsCount: number;
  totalLessons: number;
  percentage: number;
  isCompleted: boolean;
}

export interface ModuleProgressResult {
  moduleId: ModuleId;
  completedLessonIds: LessonId[];
  completedLessonsCount: number;
  totalLessons: number;
  completedDayIds: DayId[];
  completedDaysCount: number;
  totalDays: number;
  percentage: number;
  isCompleted: boolean;
}

export interface GlobalProgressResult {
  completedLessonIds: LessonId[];
  completedLessonNumbers: number[];
  completedLessonsCount: number;
  totalLessons: number;
  completedDayIds: DayId[];
  completedDayNumbers: number[];
  completedDaysCount: number;
  totalDays: number;
  completedModuleIds: ModuleId[];
  completedModulesCount: number;
  totalModules: number;
  percentage: number;
}

/**
 * Normalise les identifiants d'étapes terminées en supprimant les doublons
 * et les valeurs non textuelles ou vides.
 */
export function normalizeStepIdList(stepIds: readonly string[] | undefined): string[] {
  if (!Array.isArray(stepIds)) {
    return [];
  }
  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const id of stepIds) {
    if (typeof id === 'string') {
      const trimmed = id.trim();
      if (trimmed.length > 0 && !seen.has(trimmed)) {
        seen.add(trimmed);
        normalized.push(trimmed);
      }
    }
  }
  return normalized;
}

/**
 * Fonction conservée pour l'archivage de migration des anciens formats V1.
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

function computeLessonProgressFromSteps(
  completedStepIds: readonly string[] | undefined,
  steps: readonly Step[]
): LessonProgressResult {
  const normalizedCompleted = normalizeStepIdList(completedStepIds);
  const validStepIds: string[] = [];
  const seenValid = new Set<string>();

  for (const step of steps) {
    if (step && typeof step.id === 'string') {
      const trimmed = step.id.trim();
      if (trimmed.length > 0 && !seenValid.has(trimmed)) {
        seenValid.add(trimmed);
        validStepIds.push(trimmed);
      }
    }
  }

  const total = validStepIds.length;
  if (total === 0) {
    return {
      completedStepIds: [],
      completedCount: 0,
      totalSteps: 0,
      total: 0,
      percentage: 0,
      isCompleted: false,
    };
  }

  const validCompleted = normalizedCompleted.filter((id) => seenValid.has(id));
  const completedCount = validCompleted.length;
  const percentage = Math.round((completedCount / total) * 100);

  return {
    completedStepIds: validCompleted,
    completedCount,
    totalSteps: total,
    total,
    percentage,
    isCompleted: completedCount === total,
  };
}

/**
 * Calcule la progression d'une leçon à partir de ses étapes réelles (ou d'un total d'étapes).
 * - Une leçon sans étape (total === 0) a toujours 0 % de progression et n'est jamais terminée.
 * - Seuls les identifiants appartenant réellement à cette leçon sont comptabilisés.
 */
export function calculateLessonProgress(
  lessonOrCompletedStepIds: Pick<Lesson, 'steps'> | readonly string[] | undefined,
  completedStepIdsOrSteps?: readonly string[] | readonly Step[] | number
): LessonProgressResult {
  // Appel sous la forme (lesson, completedStepIds)
  if (
    lessonOrCompletedStepIds &&
    !Array.isArray(lessonOrCompletedStepIds) &&
    typeof lessonOrCompletedStepIds === 'object' &&
    'steps' in lessonOrCompletedStepIds
  ) {
    const steps = Array.isArray(lessonOrCompletedStepIds.steps)
      ? lessonOrCompletedStepIds.steps
      : [];
    const completed = Array.isArray(completedStepIdsOrSteps)
      ? (completedStepIdsOrSteps as readonly string[])
      : undefined;
    return computeLessonProgressFromSteps(completed, steps);
  }

  // Appel sous la forme (completedStepIds, steps | totalSteps)
  const completedStepIds = Array.isArray(lessonOrCompletedStepIds)
    ? (lessonOrCompletedStepIds as readonly string[])
    : undefined;

  if (Array.isArray(completedStepIdsOrSteps)) {
    return computeLessonProgressFromSteps(
      completedStepIds,
      completedStepIdsOrSteps as readonly Step[]
    );
  }

  const normalizedCompleted = normalizeStepIdList(completedStepIds);
  const totalSteps =
    typeof completedStepIdsOrSteps === 'number' ? completedStepIdsOrSteps : 0;
  if (!Number.isInteger(totalSteps) || totalSteps <= 0) {
    return {
      completedStepIds: [],
      completedCount: 0,
      totalSteps: 0,
      total: 0,
      percentage: 0,
      isCompleted: false,
    };
  }

  const validCompleted = normalizedCompleted.slice(0, totalSteps);
  const completedCount = validCompleted.length;
  const percentage = Math.round((completedCount / totalSteps) * 100);

  return {
    completedStepIds: validCompleted,
    completedCount,
    totalSteps,
    total: totalSteps,
    percentage,
    isCompleted: completedCount >= totalSteps,
  };
}

/**
 * Détermine si une leçon est entièrement terminée.
 * Une leçon sans étape (0 étape) ne peut jamais être considérée comme terminée.
 */
export function isLessonCompleted(
  lessonOrCompletedStepIds: Pick<Lesson, 'steps'> | readonly string[] | undefined,
  completedStepIdsOrSteps?: readonly string[] | readonly Step[] | number
): boolean {
  return calculateLessonProgress(lessonOrCompletedStepIds, completedStepIdsOrSteps).isCompleted;
}

export const calculateDailyProgress = calculateLessonProgress;
export const isDayCompleted = isLessonCompleted;

/**
 * Dérive la progression d'une journée exclusivement à partir des leçons qui lui appartiennent.
 * - Une leçon terminée est comptabilisée une seule fois.
 * - Une journée est terminée uniquement lorsque toutes ses leçons sont terminées.
 * - Une journée sans leçon retourne 0 % et false sans division par zéro.
 */
export function calculateDayProgress(
  day: Pick<Day, 'id' | 'dayNumber' | 'lessons'> | undefined,
  completedStepIdsByLesson: Readonly<Partial<Record<string, readonly string[]>>> | undefined
): DayProgressResult {
  if (!day || !Array.isArray(day.lessons) || day.lessons.length === 0) {
    return {
      dayId: day?.id ?? 'day-01',
      dayNumber: day?.dayNumber ?? 1,
      completedLessonIds: [],
      completedLessonsCount: 0,
      totalLessons: 0,
      percentage: 0,
      isCompleted: false,
    };
  }

  const safeMap =
    completedStepIdsByLesson && typeof completedStepIdsByLesson === 'object'
      ? completedStepIdsByLesson
      : {};

  const uniqueLessons: Lesson[] = [];
  const seenLessonIds = new Set<LessonId>();
  for (const lesson of day.lessons) {
    if (lesson && lesson.id && !seenLessonIds.has(lesson.id)) {
      seenLessonIds.add(lesson.id);
      uniqueLessons.push(lesson);
    }
  }

  const totalLessons = uniqueLessons.length;
  if (totalLessons === 0) {
    return {
      dayId: day.id,
      dayNumber: day.dayNumber,
      completedLessonIds: [],
      completedLessonsCount: 0,
      totalLessons: 0,
      percentage: 0,
      isCompleted: false,
    };
  }

  const completedLessonIds: LessonId[] = [];
  for (const lesson of uniqueLessons) {
    const stepsForLesson = safeMap[lesson.id];
    if (isLessonCompleted(lesson, stepsForLesson)) {
      completedLessonIds.push(lesson.id);
    }
  }

  const completedLessonsCount = completedLessonIds.length;
  const percentage = Math.round((completedLessonsCount / totalLessons) * 100);

  return {
    dayId: day.id,
    dayNumber: day.dayNumber,
    completedLessonIds,
    completedLessonsCount,
    totalLessons,
    percentage,
    isCompleted: completedLessonsCount === totalLessons,
  };
}

/**
 * Dérive la progression d'un module à partir de ses journées et de leurs leçons.
 * - Un module est terminé uniquement lorsque toutes ses leçons sont terminées.
 * - Un module sans leçon retourne 0 % et false sans division par zéro.
 */
export function calculateModuleProgress(
  moduleItem: Pick<CourseModule, 'id' | 'dayId' | 'lessonIds'> | undefined,
  daysOrCompletedMap:
    | readonly Day[]
    | Readonly<Partial<Record<string, readonly string[]>>>
    | undefined,
  completedMapOrLessons?:
    | Readonly<Partial<Record<string, readonly string[]>>>
    | readonly Lesson[]
): ModuleProgressResult {
  if (!moduleItem) {
    return {
      moduleId: 'module-01',
      completedLessonIds: [],
      completedLessonsCount: 0,
      totalLessons: 0,
      completedDayIds: [],
      completedDaysCount: 0,
      totalDays: 0,
      percentage: 0,
      isCompleted: false,
    };
  }

  let days: readonly Day[] = ALL_DAYS;
  let completedStepIdsByLesson: Readonly<Partial<Record<string, readonly string[]>>> = {};
  let explicitLessons: readonly Lesson[] | null = null;

  if (Array.isArray(daysOrCompletedMap)) {
    days = daysOrCompletedMap as readonly Day[];
    if (
      completedMapOrLessons &&
      !Array.isArray(completedMapOrLessons) &&
      typeof completedMapOrLessons === 'object'
    ) {
      completedStepIdsByLesson = completedMapOrLessons as Readonly<
        Partial<Record<string, readonly string[]>>
      >;
    }
  } else {
    if (daysOrCompletedMap && typeof daysOrCompletedMap === 'object') {
      completedStepIdsByLesson = daysOrCompletedMap as Readonly<
        Partial<Record<string, readonly string[]>>
      >;
    }
    if (Array.isArray(completedMapOrLessons)) {
      explicitLessons = completedMapOrLessons as readonly Lesson[];
    }
  }

  const allowedLessonIds = new Set<string>(moduleItem.lessonIds ?? []);
  if (allowedLessonIds.size === 0) {
    return {
      moduleId: moduleItem.id,
      completedLessonIds: [],
      completedLessonsCount: 0,
      totalLessons: 0,
      completedDayIds: [],
      completedDaysCount: 0,
      totalDays: 0,
      percentage: 0,
      isCompleted: false,
    };
  }

  const uniqueLessons: Lesson[] = [];
  const seenLessonIds = new Set<LessonId>();
  const completedDayIds: DayId[] = [];
  let totalDays = 0;

  if (explicitLessons) {
    totalDays = 1;
    for (const lesson of explicitLessons) {
      if (
        lesson &&
        lesson.id &&
        allowedLessonIds.has(lesson.id) &&
        !seenLessonIds.has(lesson.id)
      ) {
        seenLessonIds.add(lesson.id);
        uniqueLessons.push(lesson);
      }
    }
  } else {
    const moduleDays = days.filter(
      (d) => d.moduleId === moduleItem.id || d.id === moduleItem.dayId
    );
    totalDays = moduleDays.length;
    for (const day of moduleDays) {
      const dayResult = calculateDayProgress(day, completedStepIdsByLesson);
      if (dayResult.isCompleted) {
        completedDayIds.push(day.id);
      }
      for (const lesson of day.lessons) {
        if (
          lesson &&
          lesson.id &&
          allowedLessonIds.has(lesson.id) &&
          !seenLessonIds.has(lesson.id)
        ) {
          seenLessonIds.add(lesson.id);
          uniqueLessons.push(lesson);
        }
      }
    }
  }

  const totalLessons = uniqueLessons.length;
  if (totalLessons === 0) {
    return {
      moduleId: moduleItem.id,
      completedLessonIds: [],
      completedLessonsCount: 0,
      totalLessons: 0,
      completedDayIds: [],
      completedDaysCount: 0,
      totalDays,
      percentage: 0,
      isCompleted: false,
    };
  }

  const completedLessonIds: LessonId[] = [];
  for (const lesson of uniqueLessons) {
    if (isLessonCompleted(lesson, completedStepIdsByLesson[lesson.id])) {
      completedLessonIds.push(lesson.id);
    }
  }

  const completedLessonsCount = completedLessonIds.length;
  const percentage = Math.round((completedLessonsCount / totalLessons) * 100);
  if (explicitLessons && completedLessonsCount === totalLessons) {
    completedDayIds.push(moduleItem.dayId);
  }

  return {
    moduleId: moduleItem.id,
    completedLessonIds,
    completedLessonsCount,
    totalLessons,
    completedDayIds,
    completedDaysCount: completedDayIds.length,
    totalDays,
    percentage,
    isCompleted: completedLessonsCount === totalLessons,
  };
}

/**
 * Calcule la progression globale sur les 7 leçons du cursus et dérive
 * l'état de complétion des 3 journées et des 3 modules.
 */
export function calculateGlobalProgress(
  completedStepIdsByLesson: Readonly<Partial<Record<string, readonly string[]>>> | undefined,
  daysOrLessons: readonly Day[] | readonly Lesson[] = ALL_DAYS,
  modulesOrDays: readonly CourseModule[] | readonly Day[] = COURSE_MODULES
): GlobalProgressResult {
  const safeMap =
    completedStepIdsByLesson && typeof completedStepIdsByLesson === 'object'
      ? completedStepIdsByLesson
      : {};

  let lessonsSource: readonly Lesson[] = ALL_LESSONS;
  let daysSource: readonly Day[] = ALL_DAYS;
  let modulesSource: readonly CourseModule[] = COURSE_MODULES;

  if (Array.isArray(daysOrLessons) && daysOrLessons.length > 0) {
    const first = daysOrLessons[0];
    if ('lessons' in first) {
      daysSource = daysOrLessons as readonly Day[];
      lessonsSource = daysSource.flatMap((d) => d.lessons);
    } else if ('steps' in first) {
      lessonsSource = daysOrLessons as readonly Lesson[];
    }
  } else if (Array.isArray(daysOrLessons) && daysOrLessons.length === 0) {
    lessonsSource = [];
    daysSource = [];
  }

  if (Array.isArray(modulesOrDays) && modulesOrDays.length > 0) {
    const first = modulesOrDays[0];
    if ('lessons' in first) {
      daysSource = modulesOrDays as readonly Day[];
    } else if ('moduleNumber' in first) {
      modulesSource = modulesOrDays as readonly CourseModule[];
    }
  }

  const uniqueLessons: Lesson[] = [];
  const seenLessonIds = new Set<LessonId>();

  for (const lesson of lessonsSource) {
    if (lesson && lesson.id && !seenLessonIds.has(lesson.id)) {
      seenLessonIds.add(lesson.id);
      uniqueLessons.push(lesson);
    }
  }

  const totalLessons = uniqueLessons.length;
  const completedLessonIds: LessonId[] = [];
  const completedLessonNumbers: number[] = [];

  for (const lesson of uniqueLessons) {
    if (isLessonCompleted(lesson, safeMap[lesson.id])) {
      completedLessonIds.push(lesson.id);
      completedLessonNumbers.push(lesson.lessonNumber);
    }
  }

  const completedDayIds: DayId[] = [];
  const completedDayNumbers: number[] = [];
  for (const day of daysSource) {
    const dayProg = calculateDayProgress(day, safeMap);
    if (dayProg.isCompleted) {
      completedDayIds.push(day.id);
      completedDayNumbers.push(day.dayNumber);
    }
  }

  const completedModuleIds: ModuleId[] = [];
  for (const mod of modulesSource) {
    const modProg = calculateModuleProgress(mod, daysSource, safeMap);
    if (modProg.isCompleted) {
      completedModuleIds.push(mod.id);
    }
  }

  const completedLessonsCount = completedLessonIds.length;
  const percentage =
    totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  return {
    completedLessonIds,
    completedLessonNumbers,
    completedLessonsCount,
    totalLessons,
    completedDayIds,
    completedDayNumbers,
    completedDaysCount: completedDayIds.length,
    totalDays: TOTAL_COURSE_DAYS,
    completedModuleIds,
    completedModulesCount: completedModuleIds.length,
    totalModules: TOTAL_COURSE_MODULES,
    percentage,
  };
}
