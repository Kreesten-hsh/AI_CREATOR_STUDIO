import { MAIN_COURSES } from '../data/navigation/mainCourses';
import { BONUSES } from '../data/navigation/bonuses';
import type { CourseModuleItem } from '../types/navigation';
import type { ActiveRoute, Day } from '../types/course';
import { TOTAL_COURSE_DAYS } from './progressCalculator';

/**
 * Récupère les métadonnées d'un module à partir de son identifiant officiel.
 */
export function getCourseById(courseId: string): CourseModuleItem | undefined {
  return MAIN_COURSES.find((c) => c.id === courseId);
}

/**
 * Identifie le module auquel appartient une leçon à partir de son numéro (1 à 9).
 */
export function getCourseByDayNumber(dayNumber: number): CourseModuleItem | undefined {
  return MAIN_COURSES.find((c) => {
    if (!c.dayRange) return false;
    const [start, end] = c.dayRange;
    return dayNumber >= start && dayNumber <= end;
  });
}

/**
 * Vérifie si un numéro de leçon appartient à la plage officielle d'un module.
 */
export function isDayInCourse(dayNumber: number, courseId: string): boolean {
  const course = getCourseById(courseId);
  if (!course?.dayRange) return false;
  const [start, end] = course.dayRange;
  return dayNumber >= start && dayNumber <= end;
}

/**
 * Résout l'identifiant de module (courseId) correspondant à une leçon.
 * Si la leçon n'est attribuée à aucun module (ex. hors de 1 à 9),
 * retourne le fallback explicite s'il est fourni, sinon null.
 */
export function resolveCourseIdForDay(
  dayNumber: number,
  fallbackCourseId?: string
): string | null {
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
 * Valide l'intégrité structurelle des modules V2 :
 * - Exactement 3 modules
 * - Identifiants uniques et conformes ('module-01' à 'module-03')
 * - Plages valides (start <= end, entiers positifs)
 * - Couverture exhaustive de chaque leçon de 1 à 9
 * - Absence de chevauchement entre modules
 * - Absence de trou dans la numérotation
 */
export function validateCourseIntegrity(
  courses: CourseModuleItem[] = MAIN_COURSES
): CourseIntegrityResult {
  const errors: string[] = [];
  const EXPECTED_IDS = ['module-01', 'module-02', 'module-03'];

  if (courses.length !== 3) {
    errors.push(`Attendu 3 modules exactement, reçu ${courses.length}`);
  }

  const ids = courses.map((c) => c.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== courses.length) {
    errors.push('Identifiants de module dupliqués détectés');
  }

  for (const expectedId of EXPECTED_IDS) {
    if (!uniqueIds.has(expectedId)) {
      errors.push(`Identifiant officiel manquant : ${expectedId}`);
    }
  }

  const dayCoverage = new Map<number, string[]>();

  for (const course of courses) {
    if (!course.dayRange || course.dayRange.length !== 2) {
      errors.push(`Plage manquante ou invalide pour le module ${course.id}`);
      continue;
    }

    const [start, end] = course.dayRange;
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || start > end) {
      errors.push(`Plage invalide [${start}, ${end}] pour le module ${course.id}`);
      continue;
    }

    for (let day = start; day <= end; day++) {
      const assigned = dayCoverage.get(day) ?? [];
      assigned.push(course.id);
      dayCoverage.set(day, assigned);
    }
  }

  for (let day = 1; day <= TOTAL_COURSE_DAYS; day++) {
    const assignedCourses = dayCoverage.get(day);
    if (!assignedCourses || assignedCourses.length === 0) {
      errors.push(`Leçon ${day} non attribuée à aucun module (trou détecté)`);
    } else if (assignedCourses.length > 1) {
      errors.push(
        `Leçon ${day} attribuée à plusieurs modules : ${assignedCourses.join(', ')} (chevauchement)`
      );
    }
  }

  for (const [day, assignedCourses] of dayCoverage.entries()) {
    if (day < 1 || day > TOTAL_COURSE_DAYS) {
      errors.push(
        `Leçon ${day} hors de la plage officielle [1, ${TOTAL_COURSE_DAYS}] attribuée à ${assignedCourses.join(', ')}`
      );
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
  courses: CourseModuleItem[] = MAIN_COURSES
): void {
  const result = validateCourseIntegrity(courses);
  if (!result.isValid) {
    throw new Error(
      `Violation de l'intégrité du cursus : ${result.errors.join(' ; ')}`
    );
  }
}

const VALID_BONUS_IDS = new Set(BONUSES.map((b) => b.id));

/**
 * Normalise rigoureusement une route active (notamment lors de la restauration ou migration depuis LocalStorage).
 * Règles explicites de redirection V1 -> V2 :
 * - 'bonus-01' (ManyChat V1) -> 'bonus-manychat'
 * - 'bonus-03' (Viral Hooks V1) -> 'bonus-marketing'
 * - 'bonus-02' (Chariow V1, désormais intégré à la Leçon 08) ou bonus inconnu -> { kind: 'home' }
 * - 'course-01' avec dayNumber 1..3 -> { kind: 'course', courseId: 'module-01', dayNumber }
 * - 'course-01' avec dayNumber > 3 ou 'course-02'..'course-05' -> { kind: 'home' }
 */
export function normalizeActiveRoute(rawRoute: unknown): ActiveRoute {
  if (!rawRoute || typeof rawRoute !== 'object') {
    return { kind: 'home' };
  }

  const candidate = rawRoute as Record<string, unknown>;

  if (candidate.kind === 'home') {
    return { kind: 'home' };
  }

  if (candidate.kind === 'resources') {
    return { kind: 'resources' };
  }

  if (candidate.kind === 'practical-sheets') {
    return { kind: 'practical-sheets' };
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
    // bonus-02 ou identifiant sans équivalent direct -> retour explicite à l'accueil
    return { kind: 'home' };
  }

  if (candidate.kind === 'start-here') {
    return { kind: 'home' };
  }

  if (candidate.kind === 'day') {
    const dayNum = candidate.dayNumber;
    if (
      typeof dayNum === 'number' &&
      Number.isInteger(dayNum) &&
      dayNum >= 1 &&
      dayNum <= TOTAL_COURSE_DAYS
    ) {
      const courseId = resolveCourseIdForDay(dayNum) ?? 'module-01';
      return { kind: 'course', courseId, dayNumber: dayNum };
    }
    return { kind: 'home' };
  }

  if (candidate.kind === 'course') {
    const candidateCourseId =
      typeof candidate.courseId === 'string' ? candidate.courseId.trim() : '';

    if (candidate.lessonId === 'introduction' || candidate.lessonId === 'setup') {
      return { kind: 'home' };
    }

    const course = getCourseById(candidateCourseId);

    if (course && course.dayRange) {
      const [startDay, endDay] = course.dayRange;
      const rawDay = candidate.dayNumber;
      const targetDay =
        typeof rawDay === 'number' &&
        Number.isInteger(rawDay) &&
        rawDay >= startDay &&
        rawDay <= endDay
          ? rawDay
          : startDay;

      return {
        kind: 'course',
        courseId: course.id,
        dayNumber: targetDay,
      };
    }

    // Correspondance exacte V1 -> V2 pour course-01 leçons 1, 2 et 3
    if (candidateCourseId === 'course-01') {
      const rawDay = candidate.dayNumber;
      if (typeof rawDay === 'number' && Number.isInteger(rawDay) && rawDay >= 1 && rawDay <= 3) {
        return {
          kind: 'course',
          courseId: 'module-01',
          dayNumber: rawDay,
        };
      }
      return { kind: 'home' };
    }

    // Si courseId est omis mais dayNumber est dans 1..9
    if (!candidateCourseId) {
      const rawDay = candidate.dayNumber;
      if (
        typeof rawDay === 'number' &&
        Number.isInteger(rawDay) &&
        rawDay >= 1 &&
        rawDay <= TOTAL_COURSE_DAYS
      ) {
        const resolvedCourseId = resolveCourseIdForDay(rawDay) ?? 'module-01';
        return {
          kind: 'course',
          courseId: resolvedCourseId,
          dayNumber: rawDay,
        };
      }
    }

    // Anciennes formations V1 (course-02..05) ou identifiants inconnus -> accueil
    return { kind: 'home' };
  }

  return { kind: 'home' };
}

/**
 * Détermine l'identifiant du module actif à partir de la route courante.
 * Retourne null si l'utilisateur est sur l'accueil, l'orientation, un bonus ou les ressources.
 */
export function resolveActiveCourseId(route: ActiveRoute): string | null {
  if (route.kind === 'course') {
    if (route.courseId && getCourseById(route.courseId)) {
      return route.courseId;
    }
    if (route.dayNumber) {
      return resolveCourseIdForDay(route.dayNumber);
    }
    return 'module-01';
  }

  if (route.kind === 'day') {
    return resolveCourseIdForDay(route.dayNumber);
  }

  return null;
}

/**
 * Filtre la liste complète des leçons pour n'extraire que celles
 * appartenant au module demandé.
 */
export function getCourseDays(allDays: Day[], courseId: string): Day[] {
  const course = getCourseById(courseId);
  if (!course?.dayRange) {
    return [];
  }
  const [startDay, endDay] = course.dayRange;
  return allDays.filter((d) => d.dayNumber >= startDay && d.dayNumber <= endDay);
}

/**
 * Formate le titre de la section de leçons pour la barre latérale du module.
 * Ex. : "LEÇONS 1 À 3", "LEÇONS 4 À 6"
 */
export function formatCourseDayRangeTitle(dayRange?: [number, number]): string {
  if (!dayRange) {
    return 'LEÇONS';
  }
  return `LEÇONS ${dayRange[0]} À ${dayRange[1]}`;
}
