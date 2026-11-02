import type { Sprint } from '../types/course';

export const SPRINTS: Sprint[] = [
  {
    id: 'sprint-1',
    sprintNumber: 1,
    title: 'OFFRE & FONDATIONS DE L\'IA',
    subtitle: 'Leçons 01 à 05',
    dayRange: [1, 5],
    deliverable:
      'Opportunité business définie, audience cible, positionnement stratégique et plan du produit digital.',
  },
  {
    id: 'sprint-2',
    sprintNumber: 2,
    title: 'DU PDF À L\'EXPÉRIENCE INTERACTIVE',
    subtitle: 'Leçons 06 à 10',
    dayRange: [6, 10],
    deliverable: 'Un guide digital interactif fonctionnel créé avec Claude et Artifacts.',
  },
  {
    id: 'sprint-3',
    sprintNumber: 3,
    title: 'PAGES DE VENTE ÉDITORIALES',
    subtitle: 'Leçons 11 à 15',
    dayRange: [11, 15],
    deliverable: 'Une page de vente professionnelle et visuellement distinctive pour votre produit digital.',
  },
  {
    id: 'sprint-4',
    sprintNumber: 4,
    title: 'STUDIO D\'AUTOMATISATION',
    subtitle: 'Leçons 16 à 20',
    dayRange: [16, 20],
    deliverable:
      'Un workflow de capture de leads et de messagerie automatisée avec des outils comme ManyChat ou n8n.',
  },
  {
    id: 'sprint-5',
    sprintNumber: 5,
    title: 'USINE À CONTENU & LANCEMENT',
    subtitle: 'Leçons 21 à 25',
    dayRange: [21, 25],
    deliverable: 'Un pack complet de contenus promotionnels et un produit digital prêt pour le lancement.',
  },
];
