import type { CourseModuleItem } from '../../types/navigation';

export const MAIN_COURSES: CourseModuleItem[] = [
  {
    id: 'module-01',
    orderNumber: '01',
    title: "L'OPPORTUNITÉ ET LE POSITIONNEMENT",
    subtitle: 'Problème client, profil acheteur et promesse vérifiable',
    lessonCount: 3,
    available: true,
    dayRange: [1, 3],
    badge: 'MODULE 01',
    description:
      'Identifier un problème concret à partir de votre matière, comprendre votre acheteur et définir une proposition de valeur crédible.',
  },
  {
    id: 'module-02',
    orderNumber: '02',
    title: 'CONCEVOIR ET CRÉER AVEC CLAUDE',
    subtitle: 'Architecture, création interactive, personnalisation et mise en ligne',
    lessonCount: 3,
    available: true,
    dayRange: [4, 6],
    badge: 'MODULE 02',
    description:
      "Transformer votre contenu en un produit digital interactif fonctionnel, personnalisé avec votre propre identité et prêt pour la mise en ligne.",
  },
  {
    id: 'module-03',
    orderNumber: '03',
    title: 'VENDRE ET PROMOUVOIR',
    subtitle: 'Offre commerciale, boutique Chariow et contenus de lancement',
    lessonCount: 3,
    available: true,
    dayRange: [7, 9],
    badge: 'MODULE 03',
    description:
      'Construire votre offre et votre prix, configurer votre produit sur votre boutique Chariow et créer vos contenus de démonstration.',
  },
];
