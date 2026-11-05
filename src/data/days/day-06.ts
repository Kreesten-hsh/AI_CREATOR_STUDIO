import type { Day } from '../../types/course';

export const day06: Day = {
  id: 'day-06',
  dayNumber: 6,
  sprintId: 'module-02',
  title: 'PERSONNALISER, TESTER ET PUBLIER SON PRODUIT',
  italicTitleWord: 'PUBLIER',
  objective:
    "Appliquer votre propre identité visuelle à votre produit avec Claude, vérifier son ergonomie sur smartphone et ordinateur, et le mettre en ligne facilement avec un lien d'accès prêt pour la vente.",
  deliverableSummary: 'Produit personnalisé, testé sur mobile et mis en ligne avec lien d’accès',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-06-step-1',
      legacyType: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: 'Identité visuelle propre, ergonomie mobile et mise en ligne simple',
      completionLabel: "Valider l'étape 1 : Comprendre",
      blocks: [
        {
          id: 'day06-step1-visual-identity',
          type: 'prose',
          eyebrow: '1.1 VOTRE IDENTITÉ VISUELLE PROPRE',
          title: 'Adapter le design à votre univers sans jamais copier AI CREATOR Studio',
          highlightPill: 'Couleurs, typographies et clarté au service de votre audience',
          paragraphs: [
            "Votre produit interactif doit refléter votre univers professionnel et inspirer une confiance immédiate à votre acheteur. Il ne doit jamais reprendre la charte graphique d'AI CREATOR Studio (ni son rouge brique, ni son style visuel néo-brutaliste).",
            "Pour habiller élégamment votre outil avec Claude, privilégiez 4 repères simples :",
          ],
          bullets: [
            "Une couleur de fond neutre et reposante (ex. albâtre `#F8FAFC`, sable doux `#FDFBF7` ou sauge pâle `#F7F9F6`) avec des cartes intérieures blanches `#FFFFFF` pour aérer la lecture.",
            "Une couleur d'accentuation franche pour les boutons d'action et les indicateurs clés (ex. émeraude `#0F766E`, bleu outremer `#1D4ED8`, terracotta `#C2410C` ou vert forêt `#166534`).",
            "Un texte contrasté très lisible : un corps de texte sombre (`#1E293B` ou `#0F172A`) garantissant un confort de lecture optimal sur tous les écrans.",
            "Des zones de clic confortables sur téléphone : des boutons de 44 px de hauteur minimum pour que l'acheteur puisse interagir aisément avec le pouce.",
          ],
        },
        {
          id: 'day06-step1-delivery-journey',
          type: 'prose',
          eyebrow: '1.2 LE PARCOURS D’ACCÈS CLIENT',
          title: 'Offrir un accès immédiat à votre acheteur sans barrière technique',
          paragraphs: [
            "Pour qu'un acheteur soit ravi de son achat dès les premières secondes, l'accès à votre produit doit être instantané :",
          ],
          bullets: [
            "La voie directe recommandée (Lien d'accès web) : votre produit est hébergé en ligne via un hébergement statique gratuit en 1 clic (comme Tiiny Host, Netlify Drop ou un lien de prévisualisation partagé). Votre client clique sur le lien depuis son téléphone ou son ordinateur et utilise immédiatement l'outil.",
            "L'option d'approfondissement (Fichier autonome & Archive ZIP) : pour les créateurs qui souhaitent offrir une version hors ligne, l'acheteur peut aussi télécharger le fichier HTML autonome et l'ouvrir sur son ordinateur sans connexion.",
          ],
        },
        {
          id: 'day06-step1-qa-protocol',
          type: 'callout',
          variant: 'important',
          title: 'Les 3 vérifications indispensables avant de mettre en vente',
          content:
            "Prenez 5 minutes pour tester : 1) la lisibilité et l'ergonomie des boutons sur votre propre smartphone ; 2) la saisie de valeurs inhabituelles (zéro, texte dans un champ de nombre, suppression d'une valeur) pour vérifier qu'aucune anomalie ne s'affiche ; 3) la clarté du premier écran pour un utilisateur qui découvre votre méthode.",
        },
      ],
    },
    {
      id: 'day-06-step-2',
      legacyType: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: 'Appliquer votre style et parfaire l’ergonomie de votre outil',
      completionLabel: "Valider l'étape 2 : Prompt Claude",
      blocks: [
        {
          id: 'day06-step2-vibe-selector',
          type: 'vibe-picker',
          title: 'Harmonies visuelles prêtes à l’emploi pour votre univers',
          description:
            "Choisissez une palette adaptée à votre thématique (ou définissez vos couleurs personnalisées) pour guider Claude.",
        },
        {
          id: 'day06-step2-master-prompt',
          type: 'prompt-builder',
          title: 'Compilateur du Prompt de Personnalisation Visuelle & Finitions (Leçon 06)',
          description:
            "Transmettez ce prompt à Claude dans la suite de votre conversation de la Leçon 05 pour habiller votre outil à vos couleurs.",
          deliverableTarget: 'html-app',
          fields: [
            {
              key: 'productType',
              label: 'Nom commercial de votre produit',
              placeholder: 'Ex. Matrice de Planification Hebdomadaire',
              profileBinding: 'productType',
            },
            {
              key: 'brandStyle',
              label: 'Ambiance visuelle et couleurs souhaitées',
              placeholder: 'Ex. Minimaliste moderne, fond crème doux, boutons vert émeraude...',
              profileBinding: 'brandStyle',
            },
          ],
          template: `<role>
Tu es un designer d'interface (UI/UX) et développeur frontend senior.
Ton rôle est de sublimer l'aspect visuel et l'ergonomie de l'application monofichier que nous venons de créer, sans casser aucune de ses interactions fonctionnelles.
</role>

<instructions_de_style>
1. IDENTITÉ VISUELLE :
- Nom affiché : {{productType}}
- Style et palette : {{brandStyle}}
- N'utilise jamais la charte graphique d'AI CREATOR Studio (ni rouge brique, ni néo-brutalisme criard). Crée une identité propre, sobre et professionnelle adaptée à mon domaine.

2. ERGONOMIE ET LISIBILITÉ :
- Contraste impeccable entre le texte et le fond.
- Espacements aérés, typographie claire et hiérarchisée.
- Hauteur minimale des boutons d'action : 44px pour un confort tactile sur smartphone.
- Structure responsive soignée : sur mobile, les cartes et champs s'empilent naturellement sans débordement horizontal.

3. CODE LIVRÉ :
- Conserve l'intégralité du code HTML, CSS et JavaScript dans le fichier unique autonome.
- Assure-toi que tous les calculs, formulaires et options de sauvegarde fonctionnent exactement comme avant.
- Sans tirets cadratins dans les textes d'interface.
</instructions_de_style>`,
        },
      ],
    },
    {
      id: 'day-06-step-3',
      legacyType: 'your-turn',
      number: 3,
      title: 'Publier et vérifier',
      subtitle: 'Mettre en ligne son produit et vérifier son lien d’accès',
      completionLabel: "Valider la Leçon 06 : Produit publié et prêt pour la vente",
      blocks: [
        {
          id: 'day06-step3-publish-guide',
          type: 'prose',
          eyebrow: '3.1 MISE EN LIGNE GUIDÉE EN 1 CLIC',
          title: 'Obtenir votre adresse web en moins de 2 minutes',
          paragraphs: [
            "Pour que votre produit dispose d'une adresse web sécurisée (HTTPS) à communiquer à vos futurs acheteurs, choisissez l'une de ces méthodes simples :",
          ],
          bullets: [
            "Méthode 1 (Glisser-déposer sans configuration) : enregistrez le code généré par Claude dans un fichier `index.html`. Rendez-vous sur un service statique gratuit comme Netlify Drop (`app.netlify.com/drop`) ou Tiiny Host (`tiiny.host`), glissez-y votre dossier : vous obtenez instantanément une adresse web sécurisée (ex. `https://mon-outil-interactif.netlify.app`).",
            "Méthode 2 (Lien direct de prévisualisation) : si vous utilisez la fonction de partage d'aperçu web dans Claude, vous pouvez générer directement un lien d'accès public partageable sans aucune manipulation de fichier.",
            "Option avancée (Archive ZIP & hors ligne) : pour les créateurs qui veulent également offrir une version téléchargeable, regroupez votre fichier `index.html` et une note d'accueil dans un fichier `.zip`. Cette option est facultative et n'est pas requise pour lancer votre boutique.",
          ],
        },
        {
          id: 'day06-step3-mobile-check',
          type: 'callout',
          variant: 'tip',
          title: 'Le test ultime : ouvrez votre lien sur votre smartphone',
          content:
            "Copiez votre adresse web et ouvrez-la sur votre téléphone. Remplissez un champ, cliquez sur un bouton d'action et vérifiez que l'écran reste parfaitement stable sans zoom intempestif. Si tout fonctionne sur votre téléphone, votre produit est prêt à être mis en vente sur Chariow !",
        },
        {
          id: 'day06-checklist',
          type: 'checklist',
          title: 'Critères de validation observables (Leçon 06)',
          description:
            'Votre produit est prêt pour le Module 03 dès que ces 4 critères sont validés.',
          items: [
            {
              id: 'chk-d06-own-brand',
              label: 'Identité visuelle propre et personnalisée',
              detail:
                "L'interface reflète vos couleurs et votre univers professionnel, sans aucun élément visuel du Studio.",
            },
            {
              id: 'chk-d06-edge-cases',
              label: 'Stabilité ergonomique sur valeurs limites',
              detail:
                "Effacer un champ ou saisir des valeurs extrêmes ne produit aucun bug d'affichage.",
            },
            {
              id: 'chk-d06-mobile-verified',
              label: 'Affichage fluide sur téléphone portable',
              detail:
                "L'application est testée et manipulable sur smartphone sans débordement horizontal d'écran.",
            },
            {
              id: 'chk-d06-public-link',
              label: 'Lien d’accès en ligne fonctionnel',
              detail:
                "Votre outil dispose d'une adresse web active et accessible prête à être insérée dans votre fiche Chariow.",
            },
          ],
        },
      ],
    },
  ],
};
