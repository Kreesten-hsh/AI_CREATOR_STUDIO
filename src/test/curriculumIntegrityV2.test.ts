import { describe, expect, it } from 'vitest';
import {
  COURSE_TITLE,
  COURSE_META_TITLE,
  COURSE_SUBTITLE,
  ALL_DAYS,
  ALL_LESSONS,
  COURSE_DATA,
  TOTAL_COURSE_MODULES,
  TOTAL_COURSE_DAYS,
  TOTAL_COURSE_LESSONS,
} from '../data/course';
import { BONUSES } from '../data/navigation/bonuses';
import { MAIN_COURSES } from '../data/navigation/mainCourses';
import { COURSE_MODULES } from '../data/sprints';
import { validateCourseIntegrity } from '../utils/courseNavigation';
import type { Day, Lesson } from '../types/course';

describe('Intégrité Curriculaire Canonique (3 Modules • 3 Journées • 7 Leçons)', () => {
  describe('1. Constantes de Titre et Sous-Titre Centralisées', () => {
    it('définit COURSE_TITLE et COURSE_META_TITLE avec la valeur officielle exacte', () => {
      const expectedTitle =
        "Utiliser Claude pour créer un produit digital qui ne ressemble pas à de la merde générée par l'IA";
      expect(COURSE_TITLE).toBe(expectedTitle);
      expect(COURSE_META_TITLE).toBe(expectedTitle);
    });

    it('définit COURSE_SUBTITLE avec la formulation officielle Document-First', () => {
      const expectedSubtitle =
        'Transformez votre document existant en une expérience interactive personnalisée avec Claude, publiez-la et apprenez à la vendre.';
      expect(COURSE_SUBTITLE).toBe(expectedSubtitle);
    });
  });

  describe('2. Structure des 3 Modules, 3 Journées et 7 Leçons (Répartition 2 + 3 + 2)', () => {
    it('contient exactement 3 modules dans MAIN_COURSES et COURSE_MODULES sans duplication', () => {
      expect(TOTAL_COURSE_MODULES).toBe(3);
      expect(MAIN_COURSES).toHaveLength(3);
      expect(COURSE_DATA.modules).toHaveLength(3);
      expect(MAIN_COURSES).toBe(COURSE_MODULES);

      expect(MAIN_COURSES[0]).toMatchObject({
        id: 'module-01',
        moduleNumber: 1,
        title: 'CHOISIR',
        dayId: 'day-01',
        dayNumber: 1,
        lessonIds: ['lesson-01', 'lesson-02'],
        lessonRange: [1, 2],
      });
      expect(MAIN_COURSES[1]).toMatchObject({
        id: 'module-02',
        moduleNumber: 2,
        title: 'CRÉER',
        dayId: 'day-02',
        dayNumber: 2,
        lessonIds: ['lesson-03', 'lesson-04', 'lesson-05'],
        lessonRange: [3, 5],
      });
      expect(MAIN_COURSES[2]).toMatchObject({
        id: 'module-03',
        moduleNumber: 3,
        title: 'PUBLIER ET LIVRER',
        dayId: 'day-03',
        dayNumber: 3,
        lessonIds: ['lesson-06', 'lesson-07'],
        lessonRange: [6, 7],
      });
    });

    it('contient exactement 3 journées qui regroupent uniquement leurs leçons (aucun steps sur Day)', () => {
      expect(TOTAL_COURSE_DAYS).toBe(3);
      expect(ALL_DAYS).toHaveLength(3);
      expect(COURSE_DATA.days).toHaveLength(3);

      expect(ALL_DAYS[0].id).toBe('day-01');
      expect(ALL_DAYS[0].dayNumber).toBe(1);
      expect(ALL_DAYS[0].moduleId).toBe('module-01');
      expect(ALL_DAYS[0].lessons.map((l) => l.id)).toEqual(['lesson-01', 'lesson-02']);
      expect('steps' in ALL_DAYS[0]).toBe(false);

      expect(ALL_DAYS[1].id).toBe('day-02');
      expect(ALL_DAYS[1].dayNumber).toBe(2);
      expect(ALL_DAYS[1].moduleId).toBe('module-02');
      expect(ALL_DAYS[1].lessons.map((l) => l.id)).toEqual(['lesson-03', 'lesson-04', 'lesson-05']);
      expect('steps' in ALL_DAYS[1]).toBe(false);

      expect(ALL_DAYS[2].id).toBe('day-03');
      expect(ALL_DAYS[2].dayNumber).toBe(3);
      expect(ALL_DAYS[2].moduleId).toBe('module-03');
      expect(ALL_DAYS[2].lessons.map((l) => l.id)).toEqual(['lesson-06', 'lesson-07']);
      expect('steps' in ALL_DAYS[2]).toBe(false);
    });

    it('contient exactement 7 leçons actives avec les titres et durées officiels du PRD (L1 à L7 complètes)', () => {
      expect(TOTAL_COURSE_LESSONS).toBe(7);
      expect(ALL_LESSONS).toHaveLength(7);
      expect(COURSE_DATA.lessons).toHaveLength(7);

      const expectedLessons = [
        {
          id: 'lesson-01',
          lessonNumber: 1,
          moduleId: 'module-01',
          dayId: 'day-01',
          title: 'Préparer son document et configurer Claude',
          duration: '~15 min',
        },
        {
          id: 'lesson-02',
          lessonNumber: 2,
          moduleId: 'module-01',
          dayId: 'day-01',
          title: 'Analyser son document, identifier 3 interactions et choisir',
          duration: '~30 min',
        },
        {
          id: 'lesson-03',
          lessonNumber: 3,
          moduleId: 'module-02',
          dayId: 'day-02',
          title: 'Définir sa direction artistique indépendante',
          duration: '~20 min',
        },
        {
          id: 'lesson-04',
          lessonNumber: 4,
          moduleId: 'module-02',
          dayId: 'day-02',
          title: 'Générer la première version (V1) de son application',
          duration: '~40 min',
        },
        {
          id: 'lesson-05',
          lessonNumber: 5,
          moduleId: 'module-02',
          dayId: 'day-02',
          title: 'Effectuer des retouches ciblées, corriger et tester',
          duration: '~30 min',
        },
        {
          id: 'lesson-06',
          lessonNumber: 6,
          moduleId: 'module-03',
          dayId: 'day-03',
          title: 'Publier son application sur Netlify',
          duration: '~25 min',
        },
        {
          id: 'lesson-07',
          lessonNumber: 7,
          moduleId: 'module-03',
          dayId: 'day-03',
          title: "Organiser la livraison via Chariow et tester le parcours d'achat",
          duration: '~35 min',
        },
      ];

      ALL_LESSONS.forEach((lesson, index) => {
        expect(lesson).toMatchObject(expectedLessons[index]);
        expect(lesson.isSkeletonPlaceholder).toBe(false);
        expect(lesson.steps).toHaveLength(3);
      });
    });

    it("garantit des identifiants d'étapes non vides et globalement uniques sur les 7 leçons", () => {
      const seenStepIds = new Set<string>();
      for (const lesson of ALL_LESSONS) {
        expect(lesson.steps.length).toBeGreaterThanOrEqual(1);
        expect(lesson.steps.length).toBeLessThanOrEqual(3);
        for (const step of lesson.steps) {
          expect(step.id.trim().length).toBeGreaterThan(0);
          expect(seenStepIds.has(step.id), `step.id dupliqué : ${step.id}`).toBe(false);
          seenStepIds.add(step.id);
        }
      }
      expect(seenStepIds.size).toBe(21);
    });
  });

  describe('3. Les 2 Bonus Différés Préservés', () => {
    it('contient exactement 2 bonus avec leurs intitulés officiels et contenu vidé', () => {
      expect(BONUSES).toHaveLength(2);
      expect(BONUSES[0].title).toBe('LE SYSTÈME MANYCHAT AUTOMATISÉ AVEC CLAUDE');
      expect(BONUSES[1].title).toBe('MARKETING LIBRARY');
      expect(BONUSES[0].blocks).toHaveLength(0);
      expect(BONUSES[1].blocks).toHaveLength(0);
    });
  });

  describe('4. Renforcement des Assertions d Intégrité (Mission 02-C)', () => {
    it('valide l intégrité complète du cursus officiel canonique', () => {
      const integrity = validateCourseIntegrity(MAIN_COURSES, ALL_DAYS);
      expect(integrity.isValid).toBe(true);
      expect(integrity.errors).toHaveLength(0);
    });

    it('détecte une discordance entre lesson.id et lesson.lessonNumber', () => {
      const corruptedDays: Day[] = ALL_DAYS.map((day) => {
        if (day.id === 'day-01') {
          return {
            ...day,
            lessons: day.lessons.map((lesson) =>
              lesson.id === 'lesson-01' ? ({ ...lesson, lessonNumber: 2 } as Lesson) : lesson
            ),
          };
        }
        return day;
      });

      const result = validateCourseIntegrity(MAIN_COURSES, corruptedDays);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((err) =>
          err.includes("Discordance d'identifiant pour la leçon : lesson-01 ne correspond pas à son numéro 2")
        )
      ).toBe(true);
    });

    it('détecte une incohérence entre module.lessonIds et les leçons effectives de sa journée', () => {
      const corruptedModules = MAIN_COURSES.map((mod) =>
        mod.id === 'module-01'
          ? { ...mod, lessonIds: ['lesson-01' as const] }
          : mod
      );

      const result = validateCourseIntegrity(corruptedModules, ALL_DAYS);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((err) =>
          err.includes('ne correspondent pas exactement aux leçons de sa journée')
        )
      ).toBe(true);
    });

    it('détecte une incohérence entre module.dayId / module.dayNumber et Day', () => {
      const corruptedModules = MAIN_COURSES.map((mod) =>
        mod.id === 'module-01'
          ? { ...mod, dayNumber: 2 as const }
          : mod
      );

      const result = validateCourseIntegrity(corruptedModules, ALL_DAYS);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((err) =>
          err.includes('incohérence de numéro de journée')
        )
      ).toBe(true);
    });

    it('détecte une violation de la répartition canonique 2 + 3 + 2', () => {
      // Déplacement artificiel de la leçon 3 dans le jour 1 (3 + 2 + 2)
      const lesson3 = ALL_DAYS[1].lessons[0];
      const corruptedDays: Day[] = [
        {
          ...ALL_DAYS[0],
          lessons: [...ALL_DAYS[0].lessons, { ...lesson3, dayId: 'day-01', dayNumber: 1, moduleId: 'module-01' }],
        },
        {
          ...ALL_DAYS[1],
          lessons: ALL_DAYS[1].lessons.slice(1),
        },
        ALL_DAYS[2],
      ];

      const result = validateCourseIntegrity(MAIN_COURSES, corruptedDays);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((err) =>
          err.includes('attendu exactement 2 leçons (répartition 2+3+2), reçu 3')
        )
      ).toBe(true);
    });
  });
});
