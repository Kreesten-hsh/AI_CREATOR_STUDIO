import type { Day, Lesson } from '../types/course';

export const MAX_STEPS_PER_LESSON = 3;

export interface LessonValidationResult {
  valid: boolean;
  errors: string[];
}

export type DayValidationResult = LessonValidationResult;

export interface CourseValidationResult {
  valid: boolean;
  errors: string[];
  duplicateIds: string[];
}

/**
 * Valide la structure des étapes d'une leçon :
 * - Une leçon squelette (isSkeletonPlaceholder: true) avec 0 étape est valide.
 * - Une leçon publiée (isSkeletonPlaceholder: false) doit comporter entre 1 et 3 étapes.
 * - Les identifiants d'étapes doivent être non vides et uniques au sein de la leçon.
 */
export function validateLessonSteps(lesson: Lesson): LessonValidationResult {
  const errors: string[] = [];

  if (!lesson || !Array.isArray(lesson.steps)) {
    return {
      valid: false,
      errors: [`Leçon ${lesson?.lessonNumber ?? 'inconnue'} : structure d'étapes absente ou invalide.`],
    };
  }

  const stepCount = lesson.steps.length;

  if (lesson.isSkeletonPlaceholder && stepCount === 0) {
    return {
      valid: true,
      errors: [],
    };
  }

  if (stepCount < 1) {
    errors.push(
      `Leçon ${lesson.lessonNumber} : doit comporter au moins 1 étape (actuellement ${stepCount}).`
    );
  } else if (stepCount > MAX_STEPS_PER_LESSON) {
    errors.push(
      `Leçon ${lesson.lessonNumber} : dépasse le maximum de ${MAX_STEPS_PER_LESSON} étapes (actuellement ${stepCount}).`
    );
  }

  const seenIds = new Set<string>();
  for (const step of lesson.steps) {
    if (!step.id || step.id.trim().length === 0) {
      errors.push(`Leçon ${lesson.lessonNumber} : une étape possède un identifiant vide.`);
      continue;
    }
    if (seenIds.has(step.id)) {
      errors.push(
        `Leçon ${lesson.lessonNumber} : identifiant d'étape dupliqué '${step.id}'.`
      );
    }
    seenIds.add(step.id);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export const validateDaySteps = validateLessonSteps;

/**
 * Valide l'unicité globale des identifiants d'étapes sur l'ensemble des leçons du cours.
 */
export function validateCourseStepIds(
  lessonsOrDays: readonly Lesson[] | readonly Day[]
): CourseValidationResult {
  const errors: string[] = [];
  const seenIds = new Map<string, number>(); // step.id -> lessonNumber
  const duplicateIdsSet = new Set<string>();

  const lessons: Lesson[] = [];
  for (const item of lessonsOrDays) {
    if ('lessons' in item && Array.isArray(item.lessons)) {
      lessons.push(...item.lessons);
    } else if ('steps' in item) {
      lessons.push(item as Lesson);
    }
  }

  for (const lesson of lessons) {
    const lessonResult = validateLessonSteps(lesson);
    if (!lessonResult.valid) {
      errors.push(...lessonResult.errors);
    }

    if (Array.isArray(lesson.steps)) {
      for (const step of lesson.steps) {
        if (!step.id) continue;
        if (seenIds.has(step.id)) {
          const firstLesson = seenIds.get(step.id)!;
          duplicateIdsSet.add(step.id);
          errors.push(
            `Identifiant d'étape '${step.id}' dupliqué entre la Leçon ${firstLesson} et la Leçon ${lesson.lessonNumber}.`
          );
        } else {
          seenIds.set(step.id, lesson.lessonNumber);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    duplicateIds: Array.from(duplicateIdsSet),
  };
}
