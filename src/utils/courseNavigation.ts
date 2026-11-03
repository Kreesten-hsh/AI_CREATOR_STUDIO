import { MAIN_COURSES } from '../data/navigation/mainCourses';
import type { CourseModuleItem } from '../types/navigation';
import type { ActiveRoute, Day } from '../types/course';

/**
 * Récupère les métadonnées d'une formation à partir de son identifiant officiel.
 */
export function getCourseById(courseId: string): CourseModuleItem | undefined {
  return MAIN_COURSES.find((c) => c.id === courseId);
}

/**
 * Identifie la formation à laquelle appartient une journée à partir de son numéro (1 à 25).
 */
export function getCourseByDayNumber(dayNumber: number): CourseModuleItem | undefined {
  return MAIN_COURSES.find((c) => {
    if (!c.dayRange) return false;
    const [start, end] = c.dayRange;
    return dayNumber >= start && dayNumber <= end;
  });
}

/**
 * Vérifie si un numéro de journée appartient à la plage officielle d'une formation.
 */
export function isDayInCourse(dayNumber: number, courseId: string): boolean {
  const course = getCourseById(courseId);
  if (!course?.dayRange) return false;
  const [start, end] = course.dayRange;
  return dayNumber >= start && dayNumber <= end;
}

/**
 * Résout l'identifiant de formation (courseId) correspondant à une journée.
 * Si la journée n'est attribuée à aucune formation (ex. hors de 1 à 25),
 * retourne le fallback explicite s'il est fourni, sinon null.
 * Élimine le comportement qui masquait silencieusement un jour invalide vers course-01.
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
 * Valide l'intégrité structurelle des formations :
 * - Exactement 5 formations
 * - Identifiants uniques et conformes ('course-01' à 'course-05')
 * - Plages valides (start <= end, entiers positifs)
 * - Couverture exhaustive de chaque journée de 1 à 25
 * - Absence de chevauchement entre formations
 * - Absence de trou dans la numérotation
 */
export function validateCourseIntegrity(
  courses: CourseModuleItem[] = MAIN_COURSES
): CourseIntegrityResult {
  const errors: string[] = [];
  const EXPECTED_IDS = [
    'course-01',
    'course-02',
    'course-03',
    'course-04',
    'course-05',
  ];

  if (courses.length !== 5) {
    errors.push(`Attendu 5 formations exactement, reçu ${courses.length}`);
  }

  const ids = courses.map((c) => c.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== courses.length) {
    errors.push('Identifiants de formation dupliqués détectés');
  }

  for (const expectedId of EXPECTED_IDS) {
    if (!uniqueIds.has(expectedId)) {
      errors.push(`Identifiant officiel manquant : ${expectedId}`);
    }
  }

  // Vérification de chaque plage
  const dayCoverage = new Map<number, string[]>();

  for (const course of courses) {
    if (!course.dayRange || course.dayRange.length !== 2) {
      errors.push(`Plage manquante ou invalide pour la formation ${course.id}`);
      continue;
    }

    const [start, end] = course.dayRange;
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || start > end) {
      errors.push(
        `Plage invalide [${start}, ${end}] pour la formation ${course.id}`
      );
      continue;
    }

    for (let day = start; day <= end; day++) {
      const assigned = dayCoverage.get(day) ?? [];
      assigned.push(course.id);
      dayCoverage.set(day, assigned);
    }
  }

  // Vérification de la couverture complète 1..25 sans trou ni chevauchement
  for (let day = 1; day <= 25; day++) {
    const assignedCourses = dayCoverage.get(day);
    if (!assignedCourses || assignedCourses.length === 0) {
      errors.push(`Jour ${day} non attribué à aucune formation (trou détecté)`);
    } else if (assignedCourses.length > 1) {
      errors.push(
        `Jour ${day} attribué à plusieurs formations : ${assignedCourses.join(', ')} (chevauchement)`
      );
    }
  }

  // Vérification qu'aucun jour hors 1..25 n'est déclaré
  for (const [day, assignedCourses] of dayCoverage.entries()) {
    if (day < 1 || day > 25) {
      errors.push(
        `Jour ${day} hors de la plage officielle [1, 25] attribué à ${assignedCourses.join(', ')}`
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

/**
 * Normalise rigoureusement une route active (notamment lors de la restauration depuis LocalStorage).
 * Garantit qu'aucune incohérence entre la formation active et le jour du workspace ne subsiste.
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

  if (candidate.kind === 'bonus') {
    if (typeof candidate.bonusId === 'string' && candidate.bonusId.trim().length > 0) {
      return { kind: 'bonus', bonusId: candidate.bonusId.trim() };
    }
    return { kind: 'home' };
  }

  if (candidate.kind === 'start-here') {
    if (candidate.lessonId === 'introduction' || candidate.lessonId === 'setup') {
      return { kind: 'start-here', lessonId: candidate.lessonId };
    }
    return { kind: 'course', courseId: 'course-01', dayNumber: 1 };
  }

  if (candidate.kind === 'day') {
    const dayNum = candidate.dayNumber;
    if (typeof dayNum === 'number' && Number.isInteger(dayNum) && dayNum >= 1 && dayNum <= 25) {
      const courseId = resolveCourseIdForDay(dayNum) ?? 'course-01';
      return { kind: 'course', courseId, dayNumber: dayNum };
    }
    return { kind: 'course', courseId: 'course-01', dayNumber: 1 };
  }

  if (candidate.kind === 'course') {
    const candidateCourseId =
      typeof candidate.courseId === 'string' ? candidate.courseId.trim() : '';
    const course = getCourseById(candidateCourseId);

    if (course && course.dayRange) {
      const [startDay, endDay] = course.dayRange;
      const rawDay = candidate.dayNumber;
      let targetDay: number;

      if (
        typeof rawDay === 'number' &&
        Number.isInteger(rawDay) &&
        rawDay >= startDay &&
        rawDay <= endDay
      ) {
        targetDay = rawDay;
      } else {
        // dayNumber absent ou hors plage : assigne la première journée officielle de la formation
        targetDay = startDay;
      }

      return {
        kind: 'course',
        courseId: course.id,
        dayNumber: targetDay,
        lessonId: typeof candidate.lessonId === 'string' ? candidate.lessonId : undefined,
      };
    }

    // courseId inconnu ou absent, mais dayNumber valide (1 à 25)
    const rawDay = candidate.dayNumber;
    if (typeof rawDay === 'number' && Number.isInteger(rawDay) && rawDay >= 1 && rawDay <= 25) {
      const resolvedCourseId = resolveCourseIdForDay(rawDay) ?? 'course-01';
      return {
        kind: 'course',
        courseId: resolvedCourseId,
        dayNumber: rawDay,
      };
    }

    // Cas où courseId et dayNumber sont tous deux invalides
    return { kind: 'course', courseId: 'course-01', dayNumber: 1 };
  }

  return { kind: 'home' };
}

/**
 * Détermine l'identifiant de la formation active à partir de la route courante.
 * Retourne null si l'utilisateur est sur l'accueil, un bonus ou les ressources.
 */
export function resolveActiveCourseId(route: ActiveRoute): string | null {
  if (route.kind === 'course') {
    if (route.courseId && getCourseById(route.courseId)) {
      return route.courseId;
    }
    if (route.dayNumber) {
      return resolveCourseIdForDay(route.dayNumber);
    }
    return 'course-01';
  }

  if (route.kind === 'day') {
    return resolveCourseIdForDay(route.dayNumber);
  }

  if (route.kind === 'start-here') {
    return 'course-01';
  }

  return null;
}

/**
 * Filtre la liste complète des journées pour n'extraire que celles
 * appartenant à la formation demandée.
 */
export function getCourseDays(allDays: Day[], courseId: string): Day[] {
  const course = getCourseById(courseId);
  if (!course?.dayRange) {
    return [];
  }
  const [startDay, endDay] = course.dayRange;
  return allDays.filter(
    (d) => d.dayNumber >= startDay && d.dayNumber <= endDay
  );
}

/**
 * Formate le titre de la section de journées pour la barre latérale du cours.
 * Ex. : "JOURS 1 À 15", "JOURS 16 À 17"
 */
export function formatCourseDayRangeTitle(dayRange?: [number, number]): string {
  if (!dayRange) {
    return 'JOURS';
  }
  return `JOURS ${dayRange[0]} À ${dayRange[1]}`;
}
