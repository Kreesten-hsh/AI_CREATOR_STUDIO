import type { CourseModuleItem } from '../../types/navigation';

export const MAIN_COURSES: CourseModuleItem[] = [
  {
    id: 'module-01',
    orderNumber: '01',
    title: 'Opportunité et positionnement',
    subtitle: 'Leçons 01 à 03',
    lessonCount: 3,
    available: true,
    dayRange: [1, 3],
    badge: 'MODULE 01',
    description: 'Opportunité et positionnement',
  },
  {
    id: 'module-02',
    orderNumber: '02',
    title: 'Concevoir et créer avec Claude',
    subtitle: 'Leçons 04 à 06',
    lessonCount: 3,
    available: true,
    dayRange: [4, 6],
    badge: 'MODULE 02',
    description: 'Concevoir et créer avec Claude',
  },
  {
    id: 'module-03',
    orderNumber: '03',
    title: 'Vendre et promouvoir',
    subtitle: 'Leçons 07 à 09',
    lessonCount: 3,
    available: true,
    dayRange: [7, 9],
    badge: 'MODULE 03',
    description: 'Vendre et promouvoir',
  },
];
