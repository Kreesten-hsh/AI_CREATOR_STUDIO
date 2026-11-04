import type { Day } from '../../types/course';

export const day06: Day = {
  id: 'day-06',
  dayNumber: 6,
  sprintId: 'module-02',
  title: 'PERSONNALISER, TESTER ET EXPORTER SON PRODUIT',
  italicTitleWord: 'EXPORTER',
  objective:
    "Appliquer votre propre identité visuelle à votre produit, valider son fonctionnement sur mobile et ordinateur via un hébergement HTTPS stable, et assembler l'archive ZIP finale prête pour la livraison commerciale.",
  deliverableSummary: 'Produit interactif finalisé, personnalisé, testé et exporté',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-06-step-1',
      type: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: 'Identité visuelle propre, déploiement HTTPS et pack ZIP',
      completionLabel: "Valider l'étape 1 : Comprendre",
      blocks: [
        {
          id: 'day06-step1-visual-identity',
          type: 'prose',
          eyebrow: '1.1 VOTRE IDENTITÉ VISUELLE PROPRE',
          title: 'Adapter le design à votre domaine sans jamais copier AI CREATOR Studio',
          highlightPill: 'Couleurs, typographies et contrastes au service de votre audience',
          paragraphs: [
            "Votre produit interactif doit refléter l'univers professionnel de votre activité et inspirer confiance à votre acheteur final. Il ne doit jamais reprendre la charte graphique d'AI CREATOR Studio (ni son rouge brique, ni son rose poudré, ni son style néo-brutaliste).",
            "Pour personnaliser efficacement votre interface avec Claude, définissez 4 paramètres simples dans vos consignes de style :",
          ],
          bullets: [
            "Une couleur de fond neutre et reposante (ex. albâtre `#F8FAFC`, sable doux `#FDFBF7` ou sauge pâle `#F7F9F6`) associée à des cartes blanches `#FFFFFF`.",
            "Une couleur d'action principale franche réservée aux boutons, résultats clés et barres de progression (ex. émeraude `#0F766E`, bleu outremer `#1D4ED8`, terracotta `#C2410C` ou vert forêt `#166534`).",
            "Une couleur d'encre très foncée pour garantir un contraste de lecture optimal sur tous les écrans.",
            "Une hiérarchie typographique lisible : tailles confortables sur téléphone (minimum `15px` pour le corps de texte et `44px` de hauteur minimale pour les zones cliquables).",
          ],
        },
        {
          id: 'day06-step1-https-and-zip',
          type: 'prose',
          eyebrow: '1.2 DOUBLE LIVRAISON : URL HTTPS STABLE + ARCHIVE ZIP',
          title: 'Comment préparer un parcours d’utilisation irréprochable sur ordinateur et téléphone',
          paragraphs: [
            "Pour offrir à votre acheteur une expérience fluide sur tous ses appareils, combinez deux supports complémentaires :",
          ],
          bullets: [
            "1. L'hébergement en ligne sur une origine HTTPS stable : en déposant gratuitement votre dossier (contenant `index.html`) sur un service d'hébergement statique comme Netlify Drop (`app.netlify.com/drop`) ou Cloudflare Pages, vous obtenez une adresse `https://...` stable. Sur cette adresse HTTPS, votre client peut ouvrir l'outil d'un simple clic sur son smartphone et bénéficier de la sauvegarde automatique `localStorage` sur son navigateur.",
            "2. L'archive `.zip` téléchargeable (livrée via Chariow) : compressez dans un fichier `.zip` votre application `index.html`, un fichier `LISEZ-MOI.html` (ou `.pdf`) contenant le lien HTTPS pour mobile ainsi que le mode d'emploi de la sauvegarde portable `.json`. Ainsi, l'acheteur possède physiquement son outil et peut l'utiliser même sans connexion Internet.",
          ],
        },
        {
          id: 'day06-step1-qa-protocol',
          type: 'callout',
          variant: 'important',
          title: 'Les 4 tests obligatoires avant d’exporter votre archive ZIP',
          content:
            "Avant d'empaqueter votre produit, testez systématiquement : 1) les valeurs extrêmes (0, nombres élevés, champs vides) dans vos calculateurs ; 2) l'ouverture du fichier `index.html` hors connexion ; 3) l'export puis la réimportation d'une sauvegarde `.json` ; 4) l'affichage et le clic des boutons sur un vrai écran de téléphone via l'URL HTTPS.",
        },
      ],
    },
    {
      id: 'day-06-step-2',
      type: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: 'Habiller votre produit et générer son guide d’accès client',
      completionLabel: "Valider l'étape 2 : Prompt Claude",
      blocks: [
        {
          id: 'day06-step2-vibe-selector',
          type: 'vibe-picker',
          title: 'Choisir ou ajuster la direction visuelle propre à votre produit',
          description:
            "Sélectionnez l'une de ces harmonies professionnelles (ou saisissez directement vos codes couleurs dans le compilateur ci-dessous) pour personnaliser votre outil.",
        },
        {
          id: 'day06-step2-master-prompt',
          type: 'prompt-builder',
          title: 'Compilateur du Prompt de Personnalisation Visuelle & Finition QA (Leçon 06)',
          description:
            "Utilisez ce prompt dans votre conversation Claude pour appliquer votre identité visuelle à votre code de la Leçon 05 et générer la fiche d'instructions client à joindre dans votre archive ZIP.",
          deliverableTarget: 'html-app',
          fields: [
            {
              key: 'productType',
              label: 'Nom commercial de votre produit',
              placeholder: 'Ex. Le Système de Création Régulière',
              profileBinding: 'productType',
            },
            {
              key: 'targetAudience',
              label: 'Audience utilisatrice',
              placeholder: 'Ex. Consultants et formateurs indépendants',
              profileBinding: 'targetAudience',
            },
            {
              key: 'brandStyle',
              label: 'Votre direction visuelle (couleurs, style et typographie)',
              placeholder: 'Ex. Palette Ardoise #0F172A & Émeraude #0F766E sur fond #F8FAFC, cartes épurées',
              profileBinding: 'brandStyle',
            },
          ],
          template: `<role>
Tu es un Designer UI/UX Senior et Ingénieur Assurance Qualité Frontend.
</role>

<context>
Nous finalisons la version commercialisable de mon produit interactif :
- Nom du produit : {{productType}}
- Destinataires : {{targetAudience}}
- Identité visuelle propre à appliquer : {{brandStyle}}
</context>

<instructions>
À partir du code \`index.html\` fonctionnel que nous avons construit à l'étape précédente, effectue exactement ces 3 opérations sans altérer aucune règle de calcul ni la sauvegarde JSON :

1. PERSONNALISATION VISUELLE SUR MESURE :
- Applique dans les variables CSS (\`:root\`) mon identité visuelle : {{brandStyle}}.
- Vérifie que les contrastes texte/fond respectent l'accessibilité visuelle et que le design est totalement distinct de toute autre marque.
- Assure-toi qu'en largeur mobile (375px), les grilles passent sur une seule colonne sans débordement horizontal et que chaque bouton mesure au moins 44px de hauteur.

2. BLINDAGE DES VALEURS LIMITES :
- Vérifie que si l'utilisateur vide un champ numérique ou saisit une valeur négative, le calcul affiche \`0\` proprement sans jamais afficher \`NaN\` ni \`Infinity\`.

3. FICHE D'ACCÈS CLIENT (\`LISEZ-MOI.html\`) :
- Après le code complet de \`index.html\`, fournis un court fichier \`LISEZ-MOI.html\` (avec la même identité visuelle) expliquant à mon acheteur :
  a) Comment utiliser l'outil en ligne sur téléphone et ordinateur via le lien HTTPS : \`[INSÉRER_LIEN_HTTPS_ICI]\`
  b) Comment ouvrir \`index.html\` hors ligne sur ordinateur.
  c) Comment utiliser les boutons "Exporter mes données (.json)" et "Importer une sauvegarde (.json)" pour conserver et transférer ses données entre appareils.
- N'utilise aucun tiret cadratin.
</instructions>`,
        },
      ],
    },
    {
      id: 'day-06-step-3',
      type: 'example',
      number: 3,
      title: 'Exemple guidé',
      subtitle: 'Structure de l’archive ZIP prête pour Chariow',
      completionLabel: "Valider l'étape 3 : Exemple guidé",
      blocks: [
        {
          id: 'day06-step3-zip-structure',
          type: 'prose',
          eyebrow: '3.1 DÉMONSTRATION DU PACKAGING FINAL',
          title: 'Ce que contient le pack ZIP livré à l’acheteur',
          paragraphs: [
            "Voici comment est structuré le dossier final du cas fil rouge avant d'être compressé en fichier `.zip` pour être déposé sur Chariow :",
          ],
          bullets: [
            "1. Hébergement HTTPS en 30 secondes : le dossier contenant `index.html` est glissé-déposé sur Netlify Drop (`https://app.netlify.com/drop`). L'outil reçoit une adresse HTTPS stable (ex. `https://systeme-creation-alexandrev.netlify.app`). Ce lien est testé sur smartphone : le calculateur, les onglets et le `localStorage` fonctionnent immédiatement.",
            "2. Insertion du lien HTTPS dans `LISEZ-MOI.html` : l'adresse HTTPS obtenue est collée dans le fichier `LISEZ-MOI.html` pour que l'acheteur puisse ouvrir la version mobile en un clic.",
            "3. Contenu exact de l'archive `Pack-Systeme-Creation-Reguliere.zip` : `index.html` (l'application interactive habillée en Ardoise `#0F172A` et Émeraude `#0F766E`), `LISEZ-MOI.html` (le guide de démarrage rapide avec le lien HTTPS mobile) et `exemple-sauvegarde.json` (un fichier JSON de démonstration).",
          ],
        },
      ],
    },
    {
      id: 'day-06-step-4',
      type: 'your-turn',
      number: 4,
      title: 'À vous de jouer',
      subtitle: 'Valider, héberger en HTTPS et compresser votre archive ZIP',
      completionLabel: "Valider l'étape 4 : À vous de jouer",
      blocks: [
        {
          id: 'day06-export-validation',
          type: 'text-exercise',
          title: 'Exercice principal : Fiche de validation technique et d’export de votre produit',
          instructions:
            "Appliquez votre identité visuelle avec le prompt de l'étape 2, hébergez votre fichier sur une URL HTTPS statique gratuite, testez-le sur téléphone et créez votre archive `.zip`. Consignez ci-dessous vos paramètres finaux :",
          placeholder:
            "1. Palette de couleurs et typographie appliquées à mon produit :\n2. URL HTTPS hébergée (pour l'accès mobile et localStorage en ligne) :\n3. Nom exact de mon archive .zip prête à livrer :\n4. Résultat des tests (valeurs extrêmes, ouverture hors ligne, export/import .json et affichage mobile) :",
          minLength: 60,
          maxLength: 5000,
          profileBinding: 'brandStyle',
        },
        {
          id: 'day06-checklist',
          type: 'checklist',
          title: 'Critères de validation observables (Leçon 06)',
          description:
            'Votre produit est prêt à être mis en vente au Module 03 dès que ces 5 points sont vérifiés.',
          items: [
            {
              id: 'chk-d06-own-brand',
              label: 'Identité visuelle 100 % personnelle',
              detail:
                "Votre produit utilise vos propres couleurs et typographies, sans aucune trace de la charte d'AI CREATOR Studio.",
            },
            {
              id: 'chk-d06-edge-cases',
              label: 'Aucun bug sur champs vides ou valeurs extrêmes',
              detail:
                "Vider un champ ou saisir 0 n'affiche jamais `NaN` et la réinitialisation fonctionne proprement.",
            },
            {
              id: 'chk-d06-json-verified',
              label: 'Sauvegarde portable JSON testée',
              detail:
                "L'export et l'import du fichier `.json` restaurent parfaitement toutes les données de l'utilisateur.",
            },
            {
              id: 'chk-d06-https-mobile',
              label: 'URL HTTPS testée sur téléphone',
              detail:
                "Le produit est accessible via une adresse `https://` stable, sans débordement d'écran sur mobile.",
            },
            {
              id: 'chk-d06-zip-ready',
              label: 'Archive .zip finale assemblée',
              detail:
                "Votre archive `.zip` contient `index.html` et le guide d'accès client expliquant le lien HTTPS et la sauvegarde JSON.",
            },
          ],
        },
        {
          id: 'day06-resource-pack',
          type: 'resource',
          title: 'Gabarit téléchargeable : Guide d’accès client à inclure dans votre ZIP',
          description:
            'Téléchargez ce modèle prêt à personnaliser pour accompagner votre fichier `index.html` dans votre archive `.zip`.',
          resources: [
            {
              id: 'res-d06-readme-template',
              title: 'Modèle de Guide de Démarrage Client (Markdown / HTML)',
              category: 'template',
              description:
                'Instructions claires expliquant à votre acheteur comment ouvrir son outil en ligne (HTTPS), hors ligne et sauvegarder ses données en JSON.',
              format: 'MD',
              downloadFilename: 'guide-acces-client-template.md',
              downloadContent: `# Guide d'Accès et d'Utilisation : [NOM DE VOTRE PRODUIT]

Merci pour votre acquisition. Votre produit interactif fonctionne aussi bien en ligne (sur téléphone et ordinateur) que hors connexion.

## 1. Accès rapide en ligne (Téléphone, Tablette et Ordinateur)
Cliquez sur le lien sécurisé ci-dessous pour utiliser l'outil depuis votre navigateur :
👉 **[INSÉRER VOTRE LIEN HTTPS ICI]**
*(Astuce : ajoutez cette page à vos favoris ou à l'écran d'accueil de votre téléphone. Sur ce lien, vos saisies sont mémorisées automatiquement dans votre navigateur).*

## 2. Utilisation hors connexion sur ordinateur
1. Décompressez (extraire tout) l'archive \`.zip\` téléchargée depuis votre espace client Chariow.
2. Double-cliquez sur le fichier **\`index.html\`** : il s'ouvre directement dans votre navigateur habituel (Chrome, Safari, Edge, Firefox), même sans connexion Internet.

## 3. Sauvegarder et transférer vos données entre appareils (Format .JSON)
Pour conserver une copie de sécurité de vos données ou passer de votre ordinateur à votre téléphone :
- Cliquez sur **« Exporter mes données (.json) »** en haut de l'outil : un fichier de sauvegarde est téléchargé sur votre appareil.
- Pour reprendre votre travail plus tard ou sur un autre appareil, cliquez sur **« Importer une sauvegarde (.json) »** et sélectionnez ce fichier.

## 4. Support et contact
En cas de question, contactez-nous à : **[VOTRE ADRESSE EMAIL OU CONTACT SUPPORT]**
`,
            },
          ],
        },
      ],
    },
  ],
};
