import type { ContentBlock, CourseModule, StepHelpConfig } from './course';

export type CourseModuleItem = CourseModule;

/**
 * Grande partie éditoriale d'une leçon de bonus.
 * Les trois parties d'une même leçon sont rendues simultanément sur une page unique
 * dans un flux vertical continu sans onglets ni navigation par étapes.
 */
export interface BonusLessonPart {
  id: string;
  title: string;
  subtitle?: string;
  blocks: ContentBlock[];
  help?: StepHelpConfig;
}

/**
 * Leçon autonome d'un bonus (5 leçons pour le Bonus 01).
 * Chaque leçon contient exactement trois grandes parties éditoriales.
 */
export interface BonusLesson {
  id: string;
  lessonNumber: 1 | 2 | 3 | 4 | 5;
  title: string;
  duration: string;
  objective: string;
  deliverable: string;
  parts: [BonusLessonPart, BonusLessonPart, BonusLessonPart];
}

export interface BonusItem {
  id: string;
  orderNumber: string; // "Bonus 01"
  title: string;
  subtitle: string;
  duration: string;
  deliverable: string;
  description: string;
  keyTopics: string[];
  blocks?: ContentBlock[];
  lessons?: BonusLesson[];
}

