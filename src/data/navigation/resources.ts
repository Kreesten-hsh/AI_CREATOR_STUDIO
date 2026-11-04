import type { ResourceCategoryItem } from '../../types/navigation';

export const RESOURCE_CATEGORIES: ResourceCategoryItem[] = [
  {
    id: 'fiches-pratiques',
    title: 'Fiches Pratiques Claude & Architecture Produit',
    description:
      'Aide-mémoires condensés pour concevoir des produits interactifs autonomes avec sauvegarde portable JSON.',
    items: [
      {
        id: 'cheat-sheet-artifacts',
        title: 'Aide-mémoire : Architecture d’un produit HTML/CSS/JS autonome',
        format: 'Markdown',
        description:
          'Les règles pour obtenir un fichier HTML autonome fonctionnant hors ligne, avec localStorage protégé sur HTTPS et sauvegarde portable JSON.',
        downloadFilename: 'fiche-architecture-produit-autonome.md',
        content: `# Fiche Pratique : Architecture d'un Produit Interactif Autonome

## 1. Fichier unique sans dépendance réseau obligatoire
Demandez à Claude un fichier \`index.html\` intégrant son propre bloc \`<style>\` et son script JavaScript standard afin que les calculs, diagnostics et filtres fonctionnent même hors connexion.

## 2. Sauvegarde en ligne sur origine HTTPS stable
Encapsulez toujours \`window.localStorage\` dans un bloc \`try / catch\` pour éviter toute erreur si le navigateur bloque le stockage ou si le fichier est ouvert localement en \`file://\`.

## 3. Sauvegarde portable JSON obligatoire
Intégrez systématiquement deux boutons (« Exporter mes données .json » et « Importer une sauvegarde .json ») permettant à l'acheteur de sauvegarder et transférer ses données entre appareils.`,
      },
      {
        id: 'cheat-sheet-prompts-system',
        title: 'Guide d’identité visuelle propre : Personnaliser son produit selon son marché',
        format: 'Markdown',
        description:
          'Comment définir vos propres couleurs, typographies et contrastes adaptés à votre audience sans reproduire le style d’une autre plateforme.',
        downloadFilename: 'guide-identite-visuelle-propre.md',
        content: `# Guide d'Identité Visuelle Propre pour Votre Produit

1. Choisissez une palette de 3 à 4 couleurs adaptée à votre secteur d'activité (fond clair reposant, surface de carte nette, couleur d'accentuation franche pour les boutons et encre foncée à fort contraste).
2. Ne copiez jamais la charte graphique d'AI CREATOR Studio : votre produit doit refléter votre propre univers professionnel.
3. Vérifiez que la taille du texte courant est d'au moins 15px sur mobile et que chaque bouton mesure au minimum 44px de hauteur.`,
      },
    ],
  },
  {
    id: 'templates-code',
    title: 'Prototypes & Démonstrations de Référence',
    description:
      'Comparez le support statique de départ et le produit interactif témoin avec sauvegarde JSON portable.',
    items: [
      {
        id: 'demo-pdf-to-hub-apres',
        title: 'Produit Témoin : Hub Interactif Autonome (HTML/JS + Export/Import JSON)',
        format: 'HTML autonome',
        description:
          'Le prototype de référence du Module 02 : identité visuelle propre (Ardoise & Émeraude), calculateur en direct, checklist 30 jours et sauvegarde portable JSON.',
        url: '/demos/pdf-to-hub/apres-hub-interactif.html',
      },
      {
        id: 'demo-pdf-to-hub-avant',
        title: 'Matériau de départ : Guide PDF Statique (Version Avant)',
        format: 'HTML de lecture',
        description:
          'Le support statique initial utilisé comme fil rouge pédagogique pour identifier les actions à rendre interactives.',
        url: '/demos/pdf-to-hub/avant-pdf-statique.html',
      },
    ],
  },
  {
    id: 'checklists-vente',
    title: 'Checklists de Validation & Mise en Vente Chariow',
    description:
      'Listes de contrôle pour vérifier votre produit, votre archive ZIP et votre fiche Chariow avant lancement.',
    items: [
      {
        id: 'checklist-pre-lancement',
        title: 'Checklist : Contrôle qualité avant publication sur Chariow',
        format: 'Markdown',
        description:
          'Validation des interactions hors ligne, du cycle Export/Import JSON, de l’URL HTTPS mobile et du pack ZIP.',
        downloadFilename: 'checklist-pre-lancement.md',
        content: `# Checklist de Contrôle Qualité Avant Mise en Vente

- [ ] Les calculs, diagnostics et filtres fonctionnent hors connexion sans erreur
- [ ] L'export et l'import du fichier .json restaurent intégralement les données de l'utilisateur
- [ ] L'accès localStorage est protégé par try / catch
- [ ] L'outil est déployé sur une URL HTTPS stable et testé sur un écran de téléphone (375px)
- [ ] Le produit possède sa propre identité visuelle (couleurs et typographies propres à votre activité)
- [ ] L'archive .zip contient index.html et le guide d'accès client (avec le lien HTTPS et le mode d'emploi JSON)
- [ ] La fiche produit de type « Fichiers » est configurée sur Chariow avec ses instructions après achat`,
      },
    ],
  },
];
