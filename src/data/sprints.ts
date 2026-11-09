import type { CourseModule } from '../types/course';

export const COURSE_MODULES: readonly CourseModule[] = [
  {
    id: 'module-01',
    moduleNumber: 1,
    orderNumber: '01',
    badge: 'MODULE 01',
    title: 'CHOISIR',
    subtitle: 'Journée 1 • Leçons 01 à 02',
    description: 'Préparer son document source et valider le Product Blueprint interactif.',
    dayId: 'day-01',
    dayNumber: 1,
    lessonIds: ['lesson-01', 'lesson-02'],
    lessonRange: [1, 2],
    deliverable: 'Product Blueprint validé et Source Fidelity Mapping initial',
    available: true,
  },
  {
    id: 'module-02',
    moduleNumber: 2,
    orderNumber: '02',
    badge: 'MODULE 02',
    title: 'CRÉER',
    subtitle: 'Journée 2 • Leçons 03 à 05',
    description: 'Définir sa direction artistique, générer la V1 et finaliser son application.',
    dayId: 'day-02',
    dayNumber: 2,
    lessonIds: ['lesson-03', 'lesson-04', 'lesson-05'],
    lessonRange: [3, 5],
    deliverable:
      'Application HTML finale testée sur les principales interactions et les formats d’écran prévus',
    available: true,
  },
  {
    id: 'module-03',
    moduleNumber: 3,
    orderNumber: '03',
    badge: 'MODULE 03',
    title: 'PUBLIER ET LIVRER',
    subtitle: 'Journée 3 • Leçons 06 à 07',
    description: 'Publier gratuitement sur Netlify et configurer la livraison client sur Chariow.',
    dayId: 'day-03',
    dayNumber: 3,
    lessonIds: ['lesson-06', 'lesson-07'],
    lessonRange: [6, 7],
    deliverable: 'URL publique HTTPS active et produit Chariow vérifié',
    available: true,
  },
] as const;

export const SPRINTS = COURSE_MODULES;
