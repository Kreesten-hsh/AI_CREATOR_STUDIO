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
 * Résout l'identifiant de formation (courseId) correspondant à une journée,
 * avec fallback sécurisé.
 */
export function resolveCourseIdForDay(
  dayNumber: number,
  fallbackCourseId = 'course-01'
): string {
  const course = getCourseByDayNumber(dayNumber);
  return course?.id ?? fallbackCourseId;
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
