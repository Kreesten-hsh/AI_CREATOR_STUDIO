import type { CourseModuleItem } from '../../types/navigation';

export const MAIN_COURSES: CourseModuleItem[] = [
  {
    id: 'course-01',
    orderNumber: '01',
    title: 'COMMENCER ICI',
    subtitle: '15 leçons : Fondations, produit interactif & vente',
    lessonCount: 15,
    available: true,
    dayRange: [1, 15],
    badge: 'PARCOURS ACTIF',
    description:
      'Le cœur de la méthode : nicher votre offre, transformer un document passif en application web interactive avec Claude Artifacts, et mettre en place votre page de vente.',
  },
  {
    id: 'course-02',
    orderNumber: '02',
    title: 'PARLONS-EN',
    subtitle: 'Conversation & Personas d\'IA',
    lessonCount: 2,
    available: true,
    dayRange: [16, 17],
    badge: 'MODULE SPÉCIALISÉ',
    description:
      'Créer des agents conversationnels contextuels, structurer les prompts de rôle et intégrer un assistant sur-mesure.',
  },
  {
    id: 'course-03',
    orderNumber: '03',
    title: 'FAITES-LE VÔTRE',
    subtitle: 'Direction Artistique & Custom Vibe',
    lessonCount: 3,
    available: true,
    dayRange: [18, 20],
    badge: 'MODULE SPÉCIALISÉ',
    description:
      'Personnaliser les palettes, typographies et styles néo-brutalistes ou éditoriaux pour bannir tout rendu générique d\'IA.',
  },
  {
    id: 'course-04',
    orderNumber: '04',
    title: 'CONCEVOIR + CONSTRUIRE',
    subtitle: 'Architecture d\'applications complètes',
    lessonCount: 3,
    available: true,
    dayRange: [21, 23],
    badge: 'MODULE AVANCÉ',
    description:
      'Passer du prototype unitaire à un système interactif multi-composants avec persistance locale des données.',
  },
  {
    id: 'course-05',
    orderNumber: '05',
    title: 'HÉBERGEZ-LE',
    subtitle: 'Déploiement Web, domaine & packaging',
    lessonCount: 2,
    available: true,
    dayRange: [24, 25],
    badge: 'LIVRAISON FINALE',
    description:
      'Publier en ligne sans code, configurer un nom de domaine personnalisé et packager le livrable prêt à la vente.',
  },
];
