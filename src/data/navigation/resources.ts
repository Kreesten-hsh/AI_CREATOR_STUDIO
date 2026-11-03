import type { ResourceCategoryItem } from '../../types/navigation';

export const RESOURCE_CATEGORIES: ResourceCategoryItem[] = [
  {
    id: 'fiches-pratiques',
    title: 'Fiches Pratiques Claude & Artifacts',
    description: 'Aide-mémoires condensés pour maîtriser l\'environnement de code Claude sans erreurs.',
    items: [
      {
        id: 'cheat-sheet-artifacts',
        title: 'Aide-mémoire : Structure parfaite d\'un Artifact HTML/CSS/JS',
        format: 'Markdown / PDF',
        description:
          'Les règles de cadrage pour obtenir une application autonome, Tailwind CSS en CDN, persistance localStorage et zéro troncature.',
        downloadFilename: 'fiche-claude-artifacts-structure.md',
        content: `# Fiche Pratique : Structure d'un Artifact Claude Autonome

## 1. En-tête obligatoire
Toujours demander un fichier HTML unique intégrant Tailwind via CDN :
\`\`\`html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
\`\`\`

## 2. Persistance sans backend
Stockez l'état de l'apprenant dans localStorage avec une clé avec préfixe unique.

## 3. Gestion de l'interactivité
Préférez Vanilla JS propre ou Alpine.js pour les interactions légères sans étape de compilation.`,
      },
      {
        id: 'cheat-sheet-prompts-system',
        title: 'Guide d\'anti-slop visuel : Éliminer le design IA générique',
        format: 'Guide PDF',
        description:
          'Comment forcer Claude à abandonner les dégradés violets génériques, les cartes à coins trop arrondis et les polices fades.',
        downloadFilename: 'guide-anti-slop-visuel.md',
        content: `# Guide Anti-Slop Visuel pour Claude

1. BANNIR les dégradés violets/bleus froids génériques.
2. IMPOSER une palette éditoriale restreinte (4 couleurs max).
3. EXIGER des bordures nettes (2px solides) et des ombres décalées nettes (box-shadow brutal).
4. COMBINER une typographie display uppercase avec une police sérif italique pour les contrastes.`,
      },
    ],
  },
  {
    id: 'templates-code',
    title: 'Templates & Démonstrations Déployables',
    description: 'Fichiers sources et démonstrations réelles prêtes à être déployées sur Netlify ou Vercel.',
    items: [
      {
        id: 'demo-pdf-to-hub-apres',
        title: 'Démo Phare : Hub Interactif 5 Jours (HTML/JS complet)',
        format: 'HTML autonome',
        description:
          'Le livrable complet issu du Module 02 : barre de progression, check-lists interactives et sauvegarde locale.',
        url: '/demos/pdf-to-hub/apres-hub-interactif.html',
      },
      {
        id: 'demo-pdf-to-hub-avant',
        title: 'Démo Phare : Guide Statique de Référence (Version Avant)',
        format: 'HTML de lecture',
        description:
          'La version document statique traditionnelle servant de base de comparaison pour apprécier le saut qualitatif.',
        url: '/demos/pdf-to-hub/avant-pdf-statique.html',
      },
    ],
  },
  {
    id: 'checklists-vente',
    title: 'Checklists de Vente & Lancement',
    description: 'Listes de contrôle étape par étape pour ne rien oublier avant de partager votre produit digital.',
    items: [
      {
        id: 'checklist-pre-lancement',
        title: 'Checklist : Les 12 points avant publication d\'un produit interactif',
        format: 'Checklist interactive',
        description:
          'Test de compatibilité mobile, validation de la persistance locale, formulaires et boutons de contact testés.',
        downloadFilename: 'checklist-pre-lancement.md',
        content: `# Checklist Pré-Lancement

- [ ] L'application s'affiche correctement sur mobile (375px et 414px)
- [ ] Le stockage localStorage conserve les saisies après rafraîchissement
- [ ] Aucun texte placeholder n'est resté visible
- [ ] Les liens externes s'ouvrent dans un nouvel onglet avec rel="noopener"
- [ ] Le contraste texte / fond respecte la norme WCAG AA
- [ ] La page se charge en moins de 2 secondes sur une connexion 4G`,
      },
    ],
  },
];
