import { describe, expect, it } from 'vitest';
import { COURSE_DATA } from '../data/course';
import {
  validateCourseStepIds,
  validateLessonSteps,
} from '../utils/stepValidation';
import type { Lesson } from '../types/course';

describe('Validation des étapes des 7 leçons (1 à 3 étapes & unicité des IDs)', () => {
  it('valide toutes les 7 leçons squelettes actuelles de COURSE_DATA', () => {
    expect(COURSE_DATA.lessons).toHaveLength(7);
    for (const lesson of COURSE_DATA.lessons) {
      const result = validateLessonSteps(lesson);
      expect(
        result.valid,
        `Erreurs pour la leçon ${lesson.lessonNumber}: ${result.errors.join(', ')}`
      ).toBe(true);
      expect(result.errors).toHaveLength(0);
    }
  });

  it('échoue si une leçon active dépasse 3 étapes', () => {
    const lessonWith4Steps: Lesson = {
      ...COURSE_DATA.lessons[0],
      isSkeletonPlaceholder: false,
      steps: [
        { id: 'l1-s1', number: 1, title: 'Step 1', completionLabel: 'OK 1', blocks: [] },
        { id: 'l1-s2', number: 2, title: 'Step 2', completionLabel: 'OK 2', blocks: [] },
        { id: 'l1-s3', number: 3, title: 'Step 3', completionLabel: 'OK 3', blocks: [] },
        { id: 'l1-s4', number: 4, title: 'Step 4', completionLabel: 'OK 4', blocks: [] },
      ],
    };

    const result = validateLessonSteps(lessonWith4Steps);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('dépasse le maximum de 3 étapes'))).toBe(true);
  });

  it('échoue si une leçon non-squelette a 0 étape', () => {
    const emptyActiveLesson: Lesson = {
      ...COURSE_DATA.lessons[0],
      isSkeletonPlaceholder: false,
      steps: [],
    };

    const result = validateLessonSteps(emptyActiveLesson);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('au moins 1 étape'))).toBe(true);
  });

  it('échoue si une leçon contient deux étapes avec le même identifiant', () => {
    const duplicateLesson: Lesson = {
      ...COURSE_DATA.lessons[1],
      isSkeletonPlaceholder: false,
      steps: [
        { id: 'step-duplicate-id', number: 1, title: 'Step 1', completionLabel: 'OK', blocks: [] },
        { id: 'step-duplicate-id', number: 2, title: 'Step 2', completionLabel: 'OK', blocks: [] },
      ],
    };

    const result = validateLessonSteps(duplicateLesson);
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.includes("identifiant d'étape dupliqué 'step-duplicate-id'"))
    ).toBe(true);
  });

  it("garantit l'unicité stricte de tous les identifiants d'étapes sur l'ensemble des 7 leçons", () => {
    const courseValidation = validateCourseStepIds(COURSE_DATA.lessons);
    expect(courseValidation.valid).toBe(true);
    expect(courseValidation.duplicateIds).toHaveLength(0);
    expect(courseValidation.errors).toHaveLength(0);
  });
});
