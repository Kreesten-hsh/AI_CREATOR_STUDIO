import type { ContentBlock } from './course';

export interface CourseModuleItem {
  id: string;
  orderNumber: string; // e.g. "01", "02"
  title: string;
  subtitle: string;
  lessonCount: number;
  available: boolean;
  dayRange?: [number, number];
  badge?: string;
  description: string;
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
}

export interface ResourceCategoryItem {
  id: string;
  title: string;
  description: string;
  items: Array<{
    id: string;
    title: string;
    format: string;
    description: string;
    url?: string;
    downloadFilename?: string;
    content?: string;
  }>;
}
