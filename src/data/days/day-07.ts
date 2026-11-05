import type { Day } from '../../types/course';

export const day07: Day = {
  id: 'day-07',
  dayNumber: 7,
  sprintId: 'module-03',
  title: 'CONSTRUIRE SON OFFRE ET FIXER SON PRIX',
  italicTitleWord: 'OFFRE',
  objective:
    "Transformer votre fichier technique exporté en une offre commerciale claire, définir votre prix de vente en cohérence avec les alternatives du marché et poser des conditions de vente et de support transparentes.",
  deliverableSummary: 'Offre commerciale structurée, prix choisi et argumentaire de valeur',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-07-step-1',
      legacyType: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: 'De l’outil technique à l’offre commerciale crédible',
      completionLabel: "Valider l'étape 1 : Comprendre",
      blocks: [
        {
          id: 'day07-step1-offer-structure',
          type: 'prose',
          eyebrow: '1.1 CE QUI EST RÉELLEMENT VENDU',
          title: 'Structurer la valeur d’usage de votre produit interactif',
          highlightPill: 'Livrable principal + Bénéfices d’action + Conditions claires',
          paragraphs: [
            "Vos acheteurs n'achètent pas du code HTML ou du JavaScript : ils achètent la résolution rapide et fiable d'un problème concret. Pour construire une offre solide sans gonfler artificiellement son contenu, présentez clairement 4 éléments :",
          ],
          bullets: [
            "1. Le cœur de l'offre (ce que le client reçoit immédiatement) : l'outil interactif fonctionnel (accessible sur téléphone via le lien HTTPS et téléchargeable en archive `.zip` pour un usage hors ligne), accompagné de son système de sauvegarde portable `.json` et de son guide de démarrage rapide.",
            "2. Les bénéfices opérationnels concrets : le temps économisé, les erreurs de calcul ou d'arbitrage évitées et la clarté du résultat obtenu dès la première utilisation.",
            "3. Les éléments complémentaires éventuels : n'ajoutez un complément (ex. une fiche de synthèse PDF, une checklist d'entretien ou 3 modèles prêts à copier) que s'il accélère directement l'utilisation de l'outil principal.",
            "4. Les conditions de vente et de support : précisez honnêtement ce qui est inclus (accès au téléchargement Chariow, sauvegarde JSON, adresse e-mail de contact en cas de problème technique de téléchargement) et ce qui ne l'est pas (pas de coaching individuel illimité si vous vendez un produit autonome).",
          ],
        },
        {
          id: 'day07-step1-pricing-strategy',
          type: 'prose',
          eyebrow: '1.2 FIXER SON PRIX ET DÉFINIR UN OBJECTIF COMMERCIAL',
          title: 'Comparer les alternatives et structurer ses paliers tarifaires',
          paragraphs: [
            "Pour fixer votre prix, comparez votre produit aux alternatives réelles identifiées à la Leçon 03 : d'un côté, le bricolage manuel gratuit mais coûteux en temps et en erreurs ; de l'autre, une prestation de conseil sur mesure ou un logiciel par abonnement mensuel beaucoup plus onéreux.",
            "Une méthode pragmatique pour lancer un nouveau produit digital consiste à définir un tarif d'accès anticipé pour les premiers acheteurs, suivi d'un tarif standard de référence :",
          ],
          bullets: [
            "Exemple de structuration par paliers : fixer un premier palier d'accès anticipé (par exemple à 12 000 FCFA ou 15 000 FCFA), puis passer au tarif standard (par exemple à 19 000 FCFA ou 25 000 FCFA). Cela permet de récompenser les premiers clients tout en testant la réception du produit.",
            "Repères de marché pour les outils interactifs : un mini-outil ou une checklist interactive ciblée se positionne souvent entre 5 000 et 15 000 FCFA ; un calculateur ou simulateur opérationnel complet entre 15 000 et 35 000 FCFA ; un système métier complet avec modèles entre 25 000 et 50 000 FCFA.",
            "Règle de lucidité commerciale : tout chiffre de vente prévisionnel constitue une projection arithmétique de planification, jamais un résultat garanti. Votre volume réel dépendra de la pertinence du problème résolu, de la clarté de votre offre et de vos actions de promotion.",
          ],
        },
        {
          id: 'day07-step1-callout-ethics',
          type: 'callout',
          variant: 'important',
          title: 'Zéro promesse de revenu ou de résultat magique',
          content:
            "Dans votre argumentaire de valeur, vendez toujours une capacité d'action vérifiable (« Calculez votre seuil de rentabilité en 5 minutes », « Évaluez vos candidats selon 8 critères pondérés ») et ne promettez jamais à votre client un gain financier garanti.",
        },
      ],
    },
    {
      id: 'day-07-step-2',
      legacyType: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: 'Structurer votre offre, votre prix et votre argumentaire',
      completionLabel: "Valider l'étape 2 : Prompt Claude",
      blocks: [
        {
          id: 'day07-step2-master-prompt',
          type: 'prompt-builder',
          title: 'Compilateur du Prompt d’Architecture d’Offre & Prix (Leçon 07)',
          description:
            "Utilisez ce prompt dans Claude pour formaliser votre offre commerciale complète, votre grille de prix et vos conditions de vente.",
          deliverableTarget: 'sales-copy',
          fields: [
            {
              key: 'business',
              label: "Domaine d'expertise",
              placeholder: 'Ex. Conseil RH, Gestion financière, Productivité...',
              profileBinding: 'business',
            },
            {
              key: 'targetAudience',
              label: 'Acheteur cible',
              placeholder: 'Ex. Dirigeants de PME, Freelances, Formateurs...',
              profileBinding: 'targetAudience',
            },
            {
              key: 'productType',
              label: 'Votre produit interactif finalisé (Leçon 06)',
              placeholder: 'Ex. Calculateur de Capacité & Feuille de Route 30 Jours',
              profileBinding: 'productType',
            },
            {
              key: 'mainObjective',
              label: 'Transformation concrète apportée',
              placeholder: 'Ex. Déterminer sa capacité hebdomadaire et suivre son plan en 10 minutes',
              profileBinding: 'mainObjective',
            },
          ],
          template: `<role>
Tu es un Stratège Commercial Senior spécialisé dans le packaging et la tarification de produits digitaux pratiques.
Tu construis des offres transparentes, ancrées dans la valeur d'usage réelle, sans fausse urgence ni promesse mensongère.
</role>

<context>
- Domaine : {{business}}
- Acheteur final : {{targetAudience}}
- Produit interactif créé : {{productType}}
- Résultat concret : {{mainObjective}}
</context>

<product_details>
[PRÉCISEZ ICI :
1. Ce que contient votre archive .zip (fichier HTML autonome, lien HTTPS mobile, sauvegarde JSON, guide d'accès)
2. Les alternatives actuelles de votre acheteur et leur coût en temps ou en argent
3. La devise et la fourchette de prix que vous envisagez (ex. en FCFA ou en EUR)]
</product_details>

<constraints>
- Ne formule aucune promesse de gain financier garanti ni de résultat automatique sans action de l'acheteur.
- Présente toute projection de ventes comme un objectif commercial arithmétique et non comme une certitude.
- N'utilise aucun tiret cadratin.
</constraints>

<output_format>
Structure ma fiche d'offre commerciale en 6 parties :

### 1. Définition claire de ce qui est vendu
- Présentation factuelle de l'outil interactif, de ses modes d'accès (en ligne HTTPS mobile/desktop et hors ligne via archive ZIP) et de sa sauvegarde portable JSON.

### 2. Les 3 bénéfices concrets d'utilisation
- Gain de temps, réduction des erreurs ou clarté décisionnelle observables dès la première session.

### 3. Contenu détaillé de l'offre et complément éventuel
- Livrable principal + 1 élément complémentaire pertinent (uniquement s'il facilite l'exécution).

### 4. Comparaison honnête avec les alternatives du marché
- Tableau comparant : 1) Faire seul manuellement ; 2) Prestation externe / logiciel lourd ; 3) Cet outil interactif autonome.

### 5. Stratégie de prix et simulation d'objectif commercial
- Tarif de lancement recommandé (ex. pour les X premières ventes) et tarif standard.
- Simulation arithmétique claire de l'objectif commercial brut (présentée explicitement comme un objectif de pilotage).

### 6. Conditions de vente, livraison et périmètre du support
- Modalités d'accès immédiat après paiement, prérequis techniques (un simple navigateur web) et cadre précis du support client.
</output_format>`,
        },
      ],
    },
    {
      id: 'day-07-step-3',
      legacyType: 'example',
      number: 3,
      title: 'Exemple guidé',
      subtitle: 'Fiche d’offre et tarification du cas fil rouge',
      completionLabel: "Valider l'étape 3 : Exemple guidé",
      blocks: [
        {
          id: 'day07-step3-offer-example',
          type: 'prose',
          eyebrow: '3.1 DÉMONSTRATION COMPLÈTE',
          title: 'Offre structurée pour « Le Système de Création Régulière »',
          paragraphs: [
            "Voici comment se traduit l'offre commerciale pour le cas d'école fictif du cours avant sa mise en vente sur Chariow :",
          ],
          bullets: [
            "Ce qui est vendu : L'outil interactif « Le Système de Création Régulière » (Calculateur de capacité horaire + Matrice des 3 Piliers selon le profil + Feuille de route 30 jours + Compilateur de prompt), accessible directement en ligne avec lien web et option de sauvegarde.",
            "Complément inclus : Le document méthodologique de synthèse pour ceux qui souhaitent consulter les principes fondateurs au calme avant d'utiliser le simulateur.",
            "Comparaison des alternatives : Bricoler seul sur un carnet prend 1 à 2 heures chaque mois avec des calculs approximatifs ; un accompagnement individuel coûte plusieurs centaines de milliers de FCFA ; l'outil interactif offre le diagnostic et le plan d'action en 10 minutes.",
            "Grille tarifaire retenue à titre d'exemple : 15 000 FCFA pour le palier de lancement anticipé, puis 22 000 FCFA en tarif normal.",
            "Conditions et support : Accès immédiat après paiement sur Chariow ; fonctionnement sur tout navigateur (téléphone et ordinateur) sans abonnement ; assistance par e-mail en cas de difficulté d'accès.",
          ],
        },
      ],
    },
    {
      id: 'day-07-step-4',
      legacyType: 'your-turn',
      number: 4,
      title: 'À vous de jouer',
      subtitle: 'Formaliser votre offre et fixer votre prix',
      completionLabel: "Valider l'étape 4 : À vous de jouer",
      blocks: [
        {
          id: 'day07-offer-sheet',
          type: 'text-exercise',
          title: 'Exercice principal : Votre fiche d’offre commerciale et votre prix',
          instructions:
            "Exécutez le prompt de l'étape 2 dans Claude et rédigez ci-dessous la synthèse finale de votre offre : contenu exact livré au client, 3 bénéfices concrets, comparaison aux alternatives, prix retenu (avec ou sans palier de lancement) et conditions de support.",
          placeholder:
            "1. Nom commercial de l'offre et contenu exact du pack :\n2. Les 3 bénéfices concrets pour l'acheteur :\n3. Comparaison face aux alternatives actuelles :\n4. Prix choisi (tarif de lancement / tarif standard) et objectif commercial :\n5. Conditions de livraison et périmètre du support :",
          minLength: 70,
          maxLength: 5000,
        },
        {
          id: 'day07-checklist',
          type: 'checklist',
          title: 'Critères de validation observables (Leçon 07)',
          description:
            'Vérifiez que votre offre commerciale est prête à être publiée sur Chariow à la Leçon 08.',
          items: [
            {
              id: 'chk-d07-clear-deliverable',
              label: 'Contenu livré explicite et sans ambiguïté',
              detail:
                "L'acheteur comprend immédiatement qu'il reçoit un outil interactif utilisable sur mobile et ordinateur.",
            },
            {
              id: 'chk-d07-concrete-benefits',
              label: 'Bénéfices ancrés dans l’action (zéro promesse irréaliste)',
              detail:
                'Aucun revenu garanti ni résultat magique : uniquement le gain pratique procuré par votre outil.',
            },
            {
              id: 'chk-d07-price-set',
              label: 'Prix de vente fixé et argumenté',
              detail:
                'Votre tarif est cohérent avec la friction résolue et positionné clairement face aux alternatives.',
            },
            {
              id: 'chk-d07-support-terms',
              label: 'Cadre de support et prérequis définis',
              detail:
                'Les conditions d’utilisation et de contact support sont rédigées noir sur blanc.',
            },
          ],
        },
      ],
    },
  ],
};
