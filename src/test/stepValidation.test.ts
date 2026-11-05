import { describe, expect, it } from 'vitest';
import { COURSE_DATA } from '../data/course';
import {
  LEGACY_DAYS_PENDING_REWRITE,
  validateCourseStepIds,
  validateDaySteps,
} from '../utils/stepValidation';
import type { Day } from '../types/course';

describe('Validation des étapes du cours (1 à 3 étapes & unicité des IDs)', () => {
  it('confirme que la liste LEGACY_DAYS_PENDING_REWRITE contient exactement les jours de transition [1, 2, 3, 4, 7, 8]', () => {
    expect(LEGACY_DAYS_PENDING_REWRITE).toEqual([1, 2, 3, 4, 7, 8]);
  });

  it('valide toutes les leçons actuelles de COURSE_DATA (1 à 9)', () => {
    for (const day of COURSE_DATA.days) {
      const result = validateDaySteps(day);
      expect(result.valid, `Erreurs pour le jour ${day.dayNumber}: ${result.errors.join(', ')}`).toBe(true);
      expect(result.errors).toHaveLength(0);
    }
  });

  it('échoue si une journée HORS de la liste legacy dépasse 3 étapes', () => {
    // Le jour 5 a 3 étapes et n'est pas dans LEGACY_DAYS_PENDING_REWRITE
    const day5Copy: Day = {
      ...COURSE_DATA.days.find((d) => d.dayNumber === 5)!,
      steps: [
        { id: 'd5-s1', number: 1, title: 'Step 1', completionLabel: 'OK 1', blocks: [] },
        { id: 'd5-s2', number: 2, title: 'Step 2', completionLabel: 'OK 2', blocks: [] },
        { id: 'd5-s3', number: 3, title: 'Step 3', completionLabel: 'OK 3', blocks: [] },
        { id: 'd5-s4', number: 4, title: 'Step 4', completionLabel: 'OK 4', blocks: [] },
      ],
    };

    const result = validateDaySteps(day5Copy);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('dépasse le maximum de 3 étapes'))).toBe(true);
  });

  it('échoue si une journée a 0 étape', () => {
    const emptyDay: Day = {
      id: 'day-empty',
      dayNumber: 5,
      sprintId: 'module-02',
      title: 'Jour vide',
      objective: 'Aucun',
      deliverableSummary: 'Aucun',
      isSkeletonPlaceholder: false,
      steps: [],
    };

    const result = validateDaySteps(emptyDay);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('au moins 1 étape'))).toBe(true);
  });

  it('échoue si une journée contient deux étapes avec le même identifiant', () => {
    const duplicateDay: Day = {
      id: 'day-dup',
      dayNumber: 6,
      sprintId: 'module-02',
      title: 'Jour dupliqué',
      objective: 'Test',
      deliverableSummary: 'Test',
      isSkeletonPlaceholder: false,
      steps: [
        { id: 'step-duplicate-id', number: 1, title: 'Step 1', completionLabel: 'OK', blocks: [] },
        { id: 'step-duplicate-id', number: 2, title: 'Step 2', completionLabel: 'OK', blocks: [] },
      ],
    };

    const result = validateDaySteps(duplicateDay);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("identifiant d'étape dupliqué 'step-duplicate-id'"))).toBe(true);
  });

  it("garantit l'unicité stricte de tous les identifiants d'étapes sur l'ensemble du cours", () => {
    const courseValidation = validateCourseStepIds(COURSE_DATA.days);
    expect(courseValidation.valid).toBe(true);
    expect(courseValidation.duplicateIds).toHaveLength(0);
    expect(courseValidation.errors).toHaveLength(0);
  });
});
