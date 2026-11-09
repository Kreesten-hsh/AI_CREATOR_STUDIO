import { describe, expect, it } from 'vitest';
import {
  calculateDailyProgress,
  calculateDayProgress,
  calculateGlobalProgress,
  calculateLessonProgress,
  calculateModuleProgress,
  isDayCompleted,
  isLessonCompleted,
  normalizeStepIdList,
} from '../utils/progressCalculator';
import { ALL_DAYS, ALL_LESSONS } from '../data/course';
import { COURSE_MODULES } from '../data/sprints';
import type { CourseModule, Day, Lesson } from '../types/course';

describe('Calculateur de progression V4 (7 leçons • 3 journées • 3 modules)', () => {
  const createPopulatedLesson = (lessonId: Lesson['id'], stepCount: number): Lesson => {
    const base = ALL_LESSONS.find((l) => l.id === lessonId) ?? ALL_LESSONS[0];
    return {
      ...base,
      id: lessonId,
      isSkeletonPlaceholder: false,
      steps: Array.from({ length: stepCount }, (_, idx) => ({
        id: `${lessonId}-step-${idx + 1}`,
        number: idx + 1,
        title: `Étape ${idx + 1}`,
        completionLabel: 'Valider',
        blocks: [],
      })),
    };
  };

  describe('normalizeStepIdList', () => {
    it('supprime les doublons et les valeurs vides', () => {
      const input = ['step-1', 'step-2', 'step-1', '', '   ', 'step-3'];
      expect(normalizeStepIdList(input)).toEqual(['step-1', 'step-2', 'step-3']);
    });

    it('gère les entrées undefined ou non-tableaux', () => {
      expect(normalizeStepIdList(undefined)).toEqual([]);
      expect(normalizeStepIdList([] as string[])).toEqual([]);
    });
  });

  describe('calculateLessonProgress & isLessonCompleted', () => {
    it('retourne toujours 0 % et isCompleted: false pour une leçon sans étape (squelette)', () => {
      const skeletonLesson = createPopulatedLesson('lesson-06', 0);
      const res = calculateLessonProgress(skeletonLesson, [`${skeletonLesson.id}-step-1`, 'fake-step']);
      expect(res.totalSteps).toBe(0);
      expect(res.completedCount).toBe(0);
      expect(res.percentage).toBe(0);
      expect(res.isCompleted).toBe(false);
      expect(isLessonCompleted(skeletonLesson, [`${skeletonLesson.id}-step-1`])).toBe(false);
    });

    it('ignore les stepIds inconnus ou dupliqués et ne dépasse jamais 100 %', () => {
      const lesson = createPopulatedLesson('lesson-01', 2);
      const resPartial = calculateLessonProgress(lesson, [
        'lesson-01-step-1',
        'lesson-01-step-1',
        'unknown-step-99',
      ]);
      expect(resPartial.completedCount).toBe(1);
      expect(resPartial.totalSteps).toBe(2);
      expect(resPartial.percentage).toBe(50);
      expect(resPartial.isCompleted).toBe(false);

      const resFull = calculateLessonProgress(lesson, [
        'lesson-01-step-1',
        'lesson-01-step-2',
        'unknown-step-99',
      ]);
      expect(resFull.completedCount).toBe(2);
      expect(resFull.percentage).toBe(100);
      expect(resFull.isCompleted).toBe(true);
    });
  });

  describe('calculateDayProgress (dérivée des leçons de la journée)', () => {
    it('termine une journée uniquement lorsque toutes ses leçons sont terminées', () => {
      const l1 = createPopulatedLesson('lesson-01', 2);
      const l2 = createPopulatedLesson('lesson-02', 2);
      const day1: Day = { ...ALL_DAYS[0], lessons: [l1, l2] };

      const partialDay = calculateDayProgress(day1, {
        'lesson-01': ['lesson-01-step-1', 'lesson-01-step-2'],
        'lesson-02': ['lesson-02-step-1'],
      });
      expect(partialDay.completedLessonsCount).toBe(1);
      expect(partialDay.totalLessons).toBe(2);
      expect(partialDay.percentage).toBe(50);
      expect(partialDay.isCompleted).toBe(false);

      const completedDay = calculateDayProgress(day1, {
        'lesson-01': ['lesson-01-step-1', 'lesson-01-step-2'],
        'lesson-02': ['lesson-02-step-1', 'lesson-02-step-2'],
      });
      expect(completedDay.completedLessonsCount).toBe(2);
      expect(completedDay.percentage).toBe(100);
      expect(completedDay.isCompleted).toBe(true);
    });

    it('protège contre la division par zéro si une journée ne contient aucune leçon', () => {
      const emptyDay: Day = { ...ALL_DAYS[0], lessons: [] };
      const res = calculateDayProgress(emptyDay, {});
      expect(res.totalLessons).toBe(0);
      expect(res.completedLessonsCount).toBe(0);
      expect(res.percentage).toBe(0);
      expect(res.isCompleted).toBe(false);
    });
  });

  describe('calculateModuleProgress (dérivée des leçons du module)', () => {
    it('termine un module uniquement lorsque toutes ses leçons sont terminées (ex: J2 = 3 leçons)', () => {
      const l3 = createPopulatedLesson('lesson-03', 1);
      const l4 = createPopulatedLesson('lesson-04', 1);
      const l5 = createPopulatedLesson('lesson-05', 1);
      const allLessons = [l3, l4, l5];

      const mod2 = COURSE_MODULES[1]; // lesson-03, lesson-04, lesson-05
      const partialMod = calculateModuleProgress(
        mod2,
        {
          'lesson-03': ['lesson-03-step-1'],
          'lesson-04': ['lesson-04-step-1'],
        },
        allLessons
      );
      expect(partialMod.completedLessonsCount).toBe(2);
      expect(partialMod.totalLessons).toBe(3);
      expect(partialMod.percentage).toBe(67);
      expect(partialMod.isCompleted).toBe(false);

      const fullMod = calculateModuleProgress(
        mod2,
        {
          'lesson-03': ['lesson-03-step-1'],
          'lesson-04': ['lesson-04-step-1'],
          'lesson-05': ['lesson-05-step-1'],
        },
        allLessons
      );
      expect(fullMod.completedLessonsCount).toBe(3);
      expect(fullMod.percentage).toBe(100);
      expect(fullMod.isCompleted).toBe(true);
    });

    it('protège contre la division par zéro si un module ne référence aucune leçon', () => {
      const emptyModule: CourseModule = {
        ...COURSE_MODULES[0],
        lessonIds: [],
      };
      const res = calculateModuleProgress(emptyModule, {}, ALL_LESSONS);
      expect(res.totalLessons).toBe(0);
      expect(res.percentage).toBe(0);
      expect(res.isCompleted).toBe(false);
    });
  });

  describe('calculateGlobalProgress (sur les 7 leçons)', () => {
    it('calcule la progression globale sur 7 leçons et ignore les identifiants inconnus', () => {
      const populatedLessons = ALL_LESSONS.map((l) => createPopulatedLesson(l.id, 2));
      const populatedDays = ALL_DAYS.map((d) => ({
        ...d,
        lessons: populatedLessons.filter((l) => l.dayId === d.id),
      }));

      const completedByLesson = {
        'lesson-01': ['lesson-01-step-1', 'lesson-01-step-2'],
        'lesson-02': ['lesson-02-step-1', 'lesson-02-step-2'],
        'lesson-03': ['lesson-03-step-1'], // partielle -> non comptée
        'lesson-99': ['fake-step-1'], // id inconnu -> ignoré
      } as Record<string, string[]>;

      const res = calculateGlobalProgress(completedByLesson, populatedLessons, populatedDays);
      expect(res.completedLessonsCount).toBe(2);
      expect(res.totalLessons).toBe(7);
      expect(res.completedLessonIds).toEqual(['lesson-01', 'lesson-02']);
      expect(res.completedLessonNumbers).toEqual([1, 2]);
      expect(res.completedDaysCount).toBe(1); // Journée 1 (L1+L2) terminée
      expect(res.totalDays).toBe(3);
      expect(res.percentage).toBe(Math.round((2 / 7) * 100)); // 29%
    });

    it('renvoie 0 % sur le cursus squelette actuel (0 étape dans les 7 leçons)', () => {
      const res = calculateGlobalProgress({
        'lesson-01': ['some-step'],
      });
      expect(res.completedLessonsCount).toBe(0);
      expect(res.totalLessons).toBe(7);
      expect(res.percentage).toBe(0);
    });
  });

  describe('Fonctions utilitaires par nombre d étapes (calculateDailyProgress / isDayCompleted)', () => {
    it('calcule la progression pour 0, 1, 2 ou 3 étapes sans division par zéro', () => {
      expect(calculateDailyProgress(['s1'], 0)).toEqual({
        completedStepIds: [],
        completedCount: 0,
        totalSteps: 0,
        total: 0,
        percentage: 0,
        isCompleted: false,
      });
      expect(isDayCompleted(['s1'], 0)).toBe(false);
      expect(isDayCompleted(['s1', 's1'], 2)).toBe(false);
      expect(isDayCompleted(['s1', 's2'], 2)).toBe(true);
    });
  });
});
