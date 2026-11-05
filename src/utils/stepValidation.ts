import type { Day } from '../types/course';

/**
 * Liste explicite des journées encore en transition legacy (comportant 4 étapes),
 * en attente de leur réécriture en 1 à 3 étapes lors de la Mission C.
 * Cette liste ne fait que rétrécir au fil des missions.
 */
export const LEGACY_DAYS_PENDING_REWRITE: readonly number[] = [1, 2, 3, 4, 7, 8];

export interface DayValidationResult {
  valid: boolean;
  errors: string[];
}

export interface CourseValidationResult {
  valid: boolean;
  errors: string[];
  duplicateIds: string[];
}

/**
 * Valide la structure des étapes d'une journée :
 * - Une journée doit comporter entre 1 et 3 étapes (ou 4 uniquement si elle figure dans LEGACY_DAYS_PENDING_REWRITE).
 * - Les identifiants d'étapes doivent être non vides et uniques au sein de la journée.
 */
export function validateDaySteps(day: Day): DayValidationResult {
  const errors: string[] = [];

  if (!day || !Array.isArray(day.steps)) {
    return {
      valid: false,
      errors: [`Journée ${day?.dayNumber ?? 'inconnue'} : structure d'étapes absente ou invalide.`],
    };
  }

  const stepCount = day.steps.length;
  const isLegacyPending = LEGACY_DAYS_PENDING_REWRITE.includes(day.dayNumber);
  const maxAllowedSteps = isLegacyPending ? 4 : 3;

  if (day.isSkeletonPlaceholder && stepCount === 0) {
    return {
      valid: true,
      errors: [],
    };
  }

  if (stepCount < 1) {
    errors.push(
      `Journée ${day.dayNumber} : doit comporter au moins 1 étape (actuellement ${stepCount}).`
    );
  } else if (stepCount > maxAllowedSteps) {
    errors.push(
      `Journée ${day.dayNumber} : dépasse le maximum de ${maxAllowedSteps} étapes (actuellement ${stepCount}).`
    );
  }

  const seenIds = new Set<string>();
  for (const step of day.steps) {
    if (!step.id || step.id.trim().length === 0) {
      errors.push(`Journée ${day.dayNumber} : une étape possède un identifiant vide.`);
      continue;
    }
    if (seenIds.has(step.id)) {
      errors.push(
        `Journée ${day.dayNumber} : identifiant d'étape dupliqué '${step.id}'.`
      );
    }
    seenIds.add(step.id);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valide l'unicité globale des identifiants d'étapes sur l'ensemble du cours.
 */
export function validateCourseStepIds(days: readonly Day[]): CourseValidationResult {
  const errors: string[] = [];
  const seenIds = new Map<string, number>(); // id -> dayNumber
  const duplicateIdsSet = new Set<string>();

  for (const day of days) {
    const dayResult = validateDaySteps(day);
    if (!dayResult.valid) {
      errors.push(...dayResult.errors);
    }

    if (Array.isArray(day.steps)) {
      for (const step of day.steps) {
        if (!step.id) continue;
        if (seenIds.has(step.id)) {
          const firstDay = seenIds.get(step.id)!;
          duplicateIdsSet.add(step.id);
          errors.push(
            `Identifiant d'étape '${step.id}' dupliqué entre la Journée ${firstDay} et la Journée ${day.dayNumber}.`
          );
        } else {
          seenIds.set(step.id, day.dayNumber);
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
