import type { ContentBlock, CourseModule } from './course';

export type CourseModuleItem = CourseModule;

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
}
