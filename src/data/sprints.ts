import type { Sprint } from '../types/course';

export const SPRINTS: Sprint[] = [
  {
    id: 'module-01',
    sprintNumber: 1,
    title: "L'OPPORTUNITÉ & LE POSITIONNEMENT",
    subtitle: 'Leçons 01 à 03',
    dayRange: [1, 3],
    deliverable:
      'Problème client priorisé, fiche acheteur documentée et promesse de transformation vérifiable.',
  },
  {
    id: 'module-02',
    sprintNumber: 2,
    title: 'CONCEVOIR & CRÉER AVEC CLAUDE',
    subtitle: 'Leçons 04 à 06',
    dayRange: [4, 6],
    deliverable:
      'Produit digital interactif personnel, personnalisé, testé (hors ligne, HTTPS mobile et JSON) et exporté en ZIP.',
  },
  {
    id: 'module-03',
    sprintNumber: 3,
    title: 'VENDRE & PROMOUVOIR',
    subtitle: 'Leçons 07 à 09',
    dayRange: [7, 9],
    deliverable:
      'Offre structurée, fiche produit Chariow configurée et kit promotionnel de lancement.',
  },
];
