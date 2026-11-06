import type { Course, Day, Lesson } from '../types/course';
import { COURSE_MODULES } from './sprints';
import { day01 } from './days/day-01';
import { day02 } from './days/day-02';
import { day03 } from './days/day-03';

export const COURSE_TITLE =
  "Utiliser Claude pour créer un produit digital qui ne ressemble pas à de la merde générée par l'IA";

export const COURSE_META_TITLE =
  "Utiliser Claude pour créer un produit digital qui ne ressemble pas à de la merde générée par l'IA";

export const COURSE_SUBTITLE =
  'Transformez votre document existant en une expérience interactive personnalisée avec Claude, publiez-la et apprenez à la vendre.';

export const ALL_DAYS: readonly Day[] = [day01, day02, day03];

export const ALL_LESSONS: readonly Lesson[] = ALL_DAYS.flatMap((day) => day.lessons);

export const TOTAL_COURSE_MODULES = COURSE_MODULES.length;
export const TOTAL_COURSE_DAYS = ALL_DAYS.length;
export const TOTAL_COURSE_LESSONS = ALL_LESSONS.length;

export const COURSE_DATA: Course = {
  id: 'ai-creator-studio-v2',
  title: 'AI CREATOR STUDIO',
  modules: COURSE_MODULES,
  days: ALL_DAYS,
  lessons: ALL_LESSONS,
  totalModules: TOTAL_COURSE_MODULES,
  totalDays: TOTAL_COURSE_DAYS,
  totalLessons: TOTAL_COURSE_LESSONS,
};
