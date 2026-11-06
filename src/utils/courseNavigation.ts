import { MAIN_COURSES } from '../data/navigation/mainCourses';
import { BONUSES } from '../data/navigation/bonuses';
import { ALL_DAYS, ALL_LESSONS, TOTAL_COURSE_DAYS, TOTAL_COURSE_LESSONS, TOTAL_COURSE_MODULES } from '../data/course';
import {
  ALL_DAY_IDS,
  ALL_LESSON_IDS,
  ALL_MODULE_IDS,
  type ActiveRoute,
  type CourseModule,
  type Day,
  type Lesson,
  type LessonId,
  type ModuleId,
} from '../types/course';

const VALID_LESSON_ID_SET = new Set<string>(ALL_LESSON_IDS);
const VALID_BONUS_IDS = new Set<string>(BONUSES.map((b) => b.id));

/**
 * Normalise un identifiant de leçon s'il correspond à l'une des 7 leçons officielles.
 */
export function normalizeLessonId(rawId: unknown): LessonId | null {
  if (typeof rawId !== 'string') {
    return null;
  }
  const normalized = rawId.trim().toLowerCase();
  if (VALID_LESSON_ID_SET.has(normalized)) {
    return normalized as LessonId;
  }
  return null;
}

/**
 * Récupère un module à partir de son identifiant officiel ('module-01' à 'module-03').
 */
export function getCourseById(courseId: string): CourseModule | undefined {
  return MAIN_COURSES.find((c) => c.id === courseId);
}

/**
 * Récupère une journée à partir de son identifiant ('day-01' à 'day-03').
 */
export function getDayById(dayId: string): Day | undefined {
  return ALL_DAYS.find((d) => d.id === dayId);
}

/**
 * Récupère une journée à partir de son numéro temporel (1 à 3).
 */
export function getDayByNumber(dayNumber: number): Day | undefined {
  return ALL_DAYS.find((d) => d.dayNumber === dayNumber);
}

/**
 * Récupère une leçon à partir de son identifiant ('lesson-01' à 'lesson-07').
 */
export function getLessonById(lessonId: string): Lesson | undefined {
  const validId = normalizeLessonId(lessonId);
  if (!validId) return undefined;
  return ALL_LESSONS.find((l) => l.id === validId);
}

/**
 * Récupère une leçon à partir de son numéro séquentiel (1 à 7).
 */
export function getLessonByNumber(lessonNumber: number): Lesson | undefined {
  if (!Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > TOTAL_COURSE_LESSONS) {
    return undefined;
  }
  return ALL_LESSONS.find((l) => l.lessonNumber === lessonNumber);
}

/**
 * Identifie le module auquel appartient une journée (1 à 3).
 */
export function getCourseByDayNumber(dayNumber: number): CourseModule | undefined {
  return MAIN_COURSES.find((c) => c.dayNumber === dayNumber);
}

/**
 * Identifie le module auquel appartient une leçon par son identifiant ('lesson-01' à 'lesson-07').
 */
export function getCourseByLessonId(lessonId: string): CourseModule | undefined {
  const lesson = getLessonById(lessonId);
  if (!lesson) return undefined;
  return getCourseById(lesson.moduleId);
}

/**
 * Identifie le module auquel appartient une leçon par son numéro (1 à 7).
 */
export function getCourseByLessonNumber(lessonNumber: number): CourseModule | undefined {
  const lesson = getLessonByNumber(lessonNumber);
  if (!lesson) return undefined;
  return getCourseById(lesson.moduleId);
}

/**
 * Vérifie si une leçon (par identifiant ou numéro) appartient à un module donné.
 */
export function isLessonInCourse(lessonIdOrNumber: string | number, courseId: string): boolean {
  const course = getCourseById(courseId);
  if (!course) return false;
  if (typeof lessonIdOrNumber === 'number') {
    const [start, end] = course.lessonRange;
    return lessonIdOrNumber >= start && lessonIdOrNumber <= end;
  }
  const normalized = normalizeLessonId(lessonIdOrNumber);
  return normalized ? course.lessonIds.includes(normalized) : false;
}

/**
 * Vérifie si un numéro de journée (1 à 3) correspond au module donné.
 */
export function isDayInCourse(dayNumber: number, courseId: string): boolean {
  const course = getCourseById(courseId);
  if (!course) return false;
  return course.dayNumber === dayNumber;
}

/**
 * Résout l'identifiant de module correspondant à une leçon (par ID ou par numéro 1..7).
 * Retourne le fallback explicite s'il est fourni, sinon null.
 */
export function resolveCourseIdForLesson(
  lessonIdOrNumber: string | number,
  fallbackCourseId?: ModuleId
): ModuleId | null {
  const course =
    typeof lessonIdOrNumber === 'number'
      ? getCourseByLessonNumber(lessonIdOrNumber)
      : getCourseByLessonId(lessonIdOrNumber);
  if (course) {
    return course.id;
  }
  return fallbackCourseId ?? null;
}

/**
 * Résout l'identifiant de module correspondant à une journée (1 à 3).
 */
export function resolveCourseIdForDay(
  dayNumber: number,
  fallbackCourseId?: ModuleId
): ModuleId | null {
  const course = getCourseByDayNumber(dayNumber);
  if (course) {
    return course.id;
  }
  return fallbackCourseId ?? null;
}

export interface CourseIntegrityResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valide l'intégrité structurelle stricte du cursus canonique :
 * - Exactement 3 modules ('module-01' à 'module-03')
 * - Exactement 3 journées ('day-01' à 'day-03') sans tableau steps
 * - Exactement 7 leçons ('lesson-01' à 'lesson-07') réparties en 2 + 3 + 2
 * - Absence de chevauchement ou de trou dans les numéros et identifiants
 */
export function validateCourseIntegrity(
  modules: readonly CourseModule[] = MAIN_COURSES,
  days: readonly Day[] = ALL_DAYS
): CourseIntegrityResult {
  const errors: string[] = [];

  if (modules.length !== TOTAL_COURSE_MODULES) {
    errors.push(`Attendu ${TOTAL_COURSE_MODULES} modules exactement, reçu ${modules.length}`);
  }

  if (days.length !== TOTAL_COURSE_DAYS) {
    errors.push(`Attendu ${TOTAL_COURSE_DAYS} journées exactement, reçu ${days.length}`);
  }

  const moduleIds = modules.map((m) => m.id);
  const uniqueModuleIds = new Set(moduleIds);
  if (uniqueModuleIds.size !== modules.length) {
    errors.push('Identifiants de module dupliqués détectés');
  }

  for (const expectedModId of ALL_MODULE_IDS) {
    if (!uniqueModuleIds.has(expectedModId)) {
      errors.push(`Identifiant officiel de module manquant : ${expectedModId}`);
    }
  }

  const dayIds = days.map((d) => d.id);
  const uniqueDayIds = new Set(dayIds);
  if (uniqueDayIds.size !== days.length) {
    errors.push('Identifiants de journée dupliqués détectés');
  }

  for (const expectedDayId of ALL_DAY_IDS) {
    if (!uniqueDayIds.has(expectedDayId)) {
      errors.push(`Identifiant officiel de journée manquant : ${expectedDayId}`);
    }
  }

  const lessonCoverageByModule = new Map<number, string[]>();

  for (const mod of modules) {
    if (!mod.lessonRange || mod.lessonRange.length !== 2) {
      errors.push(`Plage de leçons manquante ou invalide pour le module ${mod.id}`);
      continue;
    }

    const [start, end] = mod.lessonRange;
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || start > end) {
      errors.push(`Plage invalide [${start}, ${end}] pour le module ${mod.id}`);
      continue;
    }

    for (let lessonNum = start; lessonNum <= end; lessonNum++) {
      const assigned = lessonCoverageByModule.get(lessonNum) ?? [];
      assigned.push(mod.id);
      lessonCoverageByModule.set(lessonNum, assigned);
    }
  }

  for (let lessonNum = 1; lessonNum <= TOTAL_COURSE_LESSONS; lessonNum++) {
    const assignedModules = lessonCoverageByModule.get(lessonNum);
    if (!assignedModules || assignedModules.length === 0) {
      errors.push(`Leçon ${lessonNum} non attribuée à aucun module (trou détecté)`);
    } else if (assignedModules.length > 1) {
      errors.push(
        `Leçon ${lessonNum} attribuée à plusieurs modules : ${assignedModules.join(', ')} (chevauchement)`
      );
    }
  }

  for (const [lessonNum, assignedModules] of lessonCoverageByModule.entries()) {
    if (lessonNum < 1 || lessonNum > TOTAL_COURSE_LESSONS) {
      errors.push(
        `Leçon ${lessonNum} hors de la plage officielle [1, ${TOTAL_COURSE_LESSONS}] attribuée à ${assignedModules.join(', ')}`
      );
    }
  }

  const allLessonsFromDays = days.flatMap((d) => d.lessons ?? []);
  if (allLessonsFromDays.length !== TOTAL_COURSE_LESSONS) {
    errors.push(
      `Attendu ${TOTAL_COURSE_LESSONS} leçons au total dans les journées, reçu ${allLessonsFromDays.length}`
    );
  }

  const seenLessonIds = new Set<string>();
  for (const day of days) {
    if ('steps' in (day as unknown as Record<string, unknown>)) {
      errors.push(`La journée ${day.id} ne doit pas posséder un tableau steps parallèle.`);
    }
    for (const lesson of day.lessons) {
      if (seenLessonIds.has(lesson.id)) {
        errors.push(`Identifiant de leçon dupliqué : ${lesson.id}`);
      }
      seenLessonIds.add(lesson.id);

      if (lesson.dayId !== day.id || lesson.dayNumber !== day.dayNumber) {
        errors.push(
          `Incohérence de rattachement journalier pour la leçon ${lesson.id} dans ${day.id}`
        );
      }
      if (lesson.moduleId !== day.moduleId) {
        errors.push(
          `Incohérence de rattachement modulaire pour la leçon ${lesson.id} dans ${day.id}`
        );
      }
    }
  }

  for (const expectedLessonId of ALL_LESSON_IDS) {
    if (!seenLessonIds.has(expectedLessonId)) {
      errors.push(`Identifiant officiel de leçon manquant : ${expectedLessonId}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Lève une exception si l'intégrité du cursus est violée.
 */
export function assertCourseIntegrity(
  modules: readonly CourseModule[] = MAIN_COURSES,
  days: readonly Day[] = ALL_DAYS
): void {
  const result = validateCourseIntegrity(modules, days);
  if (!result.isValid) {
    throw new Error(
      `Violation de l'intégrité du cursus : ${result.errors.join(' ; ')}`
    );
  }
}

/**
 * Normalise rigoureusement une route active vers l'unique forme canonique :
 * - { kind: 'home' }
 * - { kind: 'lesson', lessonId: 'lesson-01'..'lesson-07' }
 * - { kind: 'bonus', bonusId: 'bonus-manychat' | 'bonus-marketing' }
 *
 * Toutes les anciennes routes ('resources', 'practical-sheets', 'start-here', 'course', 'day')
 * sont ramenées vers { kind: 'home' } sans réinterprétation arbitraire.
 */
export function normalizeActiveRoute(rawRoute: unknown): ActiveRoute {
  if (!rawRoute || typeof rawRoute !== 'object') {
    return { kind: 'home' };
  }

  const candidate = rawRoute as Record<string, unknown>;

  if (candidate.kind === 'home') {
    return { kind: 'home' };
  }

  if (candidate.kind === 'lesson') {
    const validLessonId = normalizeLessonId(candidate.lessonId);
    if (validLessonId) {
      return { kind: 'lesson', lessonId: validLessonId };
    }
    return { kind: 'home' };
  }

  if (candidate.kind === 'bonus') {
    const rawBonusId = typeof candidate.bonusId === 'string' ? candidate.bonusId.trim() : '';
    if (VALID_BONUS_IDS.has(rawBonusId)) {
      return { kind: 'bonus', bonusId: rawBonusId };
    }
    if (rawBonusId === 'bonus-01') {
      return { kind: 'bonus', bonusId: 'bonus-manychat' };
    }
    if (rawBonusId === 'bonus-03') {
      return { kind: 'bonus', bonusId: 'bonus-marketing' };
    }
    return { kind: 'home' };
  }

  // Anciennes routes supprimées ou issues de l'ancien cursus à 9 journées :
  // 'resources', 'practical-sheets', 'start-here', 'course', 'day' -> retour à l'accueil
  return { kind: 'home' };
}

/**
 * Résout la leçon active à partir de la route canonique.
 */
export function resolveActiveLesson(route: ActiveRoute): Lesson | null {
  if (route.kind === 'lesson') {
    return getLessonById(route.lessonId) ?? null;
  }
  return null;
}

/**
 * Résout la journée active à partir de la route canonique.
 */
export function resolveActiveDay(route: ActiveRoute): Day | null {
  const lesson = resolveActiveLesson(route);
  if (!lesson) return null;
  return getDayById(lesson.dayId) ?? null;
}

/**
 * Détermine l'identifiant du module actif à partir de la route courante.
 * Retourne null si l'utilisateur est sur l'accueil ou sur un bonus.
 */
export function resolveActiveCourseId(route: ActiveRoute): ModuleId | null {
  const lesson = resolveActiveLesson(route);
  if (lesson) {
    return lesson.moduleId;
  }
  return null;
}

/**
 * Filtre la liste des leçons pour n'extraire que celles appartenant au module demandé.
 */
export function getCourseLessons(
  allLessons: readonly Lesson[],
  courseId: string
): Lesson[] {
  const course = getCourseById(courseId);
  if (!course) {
    return [];
  }
  const allowedSet = new Set<string>(course.lessonIds);
  return allLessons.filter((l) => allowedSet.has(l.id));
}

export const getCourseDays = getCourseLessons;

/**
 * Filtre la liste des leçons pour n'extraire que celles appartenant à la journée demandée.
 */
export function getDayLessons(
  allLessons: readonly Lesson[],
  dayNumberOrId: number | string
): Lesson[] {
  if (typeof dayNumberOrId === 'number') {
    return allLessons.filter((l) => l.dayNumber === dayNumberOrId);
  }
  return allLessons.filter((l) => l.dayId === dayNumberOrId);
}

/**
 * Formate le titre de la plage de leçons pour la barre latérale du module.
 * Ex. : "LEÇONS 1 À 2", "LEÇONS 3 À 5", "LEÇONS 6 À 7"
 */
export function formatCourseLessonRangeTitle(
  lessonRange?: readonly [number, number]
): string {
  if (!lessonRange) {
    return 'LEÇONS';
  }
  return `LEÇONS ${lessonRange[0]} À ${lessonRange[1]}`;
}

export const formatCourseDayRangeTitle = formatCourseLessonRangeTitle;
