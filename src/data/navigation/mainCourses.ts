import type { CourseModuleItem } from '../../types/navigation';

export const MAIN_COURSES: CourseModuleItem[] = [
  {
    id: 'course-01',
    orderNumber: '01',
    title: 'COMMENCER ICI',
    subtitle: 'Offre, expertise, produit interactif & page de vente',
    lessonCount: 15,
    available: true,
    dayRange: [1, 15],
    badge: 'PARCOURS ACTIF',
    description:
      'Passer d\'une expertise brute à un produit digital interactif autonome et à sa page de vente éditoriale assemblée avec Claude Artifacts.',
  },
  {
    id: 'course-02',
    orderNumber: '02',
    title: 'PARLONS-EN',
    subtitle: 'Extraction d\'expertise & rédaction humaine anti-slop',
    lessonCount: 2,
    available: true,
    dayRange: [16, 17],
    badge: 'MODULE SPÉCIALISÉ',
    description:
      'Extraire son savoir tacite par interview socratique avec Claude et maîtriser la rédaction humaine sans tics d\'écriture d\'IA.',
  },
  {
    id: 'course-03',
    orderNumber: '03',
    title: 'FAITES-LE VÔTRE',
    subtitle: 'Couleurs, typographie & Design System personnel',
    lessonCount: 3,
    available: true,
    dayRange: [18, 20],
    badge: 'MODULE SPÉCIALISÉ',
    description:
      'Construire une identité visuelle sur-mesure (palette, typographie, hiérarchie) et fixer des instructions de style permanentes pour Claude.',
  },
  {
    id: 'course-04',
    orderNumber: '04',
    title: 'CONCEVOIR + CONSTRUIRE',
    subtitle: 'Diagnostics, arbres de décision, calculateurs & exports',
    lessonCount: 3,
    available: true,
    dayRange: [21, 23],
    badge: 'MODULE AVANCÉ',
    description:
      'Développer une logique interactive avancée : diagnostics à score, arbres conditionnels, calculateurs multi-variables et exports de livrables.',
  },
  {
    id: 'course-05',
    orderNumber: '05',
    title: 'HÉBERGEZ-LE',
    subtitle: 'Hébergement, domaine, paiement & délivrance',
    lessonCount: 2,
    available: true,
    dayRange: [24, 25],
    badge: 'LIVRAISON FINALE',
    description:
      'Déployer sur domaine personnalisé avec expérience d\'accès client, intégrer le paiement et contrôler le parcours d\'achat de bout en bout.',
  },
];
