import type { Day } from '../../types/course';

export const day08: Day = {
  id: 'day-08',
  dayNumber: 8,
  sprintId: 'module-03',
  title: 'PUBLIER SON PRODUIT ET CONFIGURER SA BOUTIQUE CHARIOW',
  italicTitleWord: 'CHARIOW',
  objective:
    "Créer votre produit de type « Fichiers » dans Chariow, rédiger sa fiche de présentation, uploader votre archive ZIP, configurer les instructions après achat et vérifier le parcours réel de paiement et de livraison.",
  deliverableSummary: 'Fiche Chariow configurée et parcours de livraison testé',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-08-step-1',
      type: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: 'Fonctionnement vérifié de Chariow : Fichiers, paiements et sécurité',
      completionLabel: "Valider l'étape 1 : Comprendre",
      blocks: [
        {
          id: 'day08-step1-chariow-workflow',
          type: 'prose',
          eyebrow: '1.1 LE TYPE DE PRODUIT « FICHIERS » SUR CHARIOW',
          title: 'Les 6 étapes officielles pour publier votre archive ZIP',
          highlightPill: 'Jusqu’à 5 fichiers de 1 Go chacun • Livraison automatique post-paiement',
          paragraphs: [
            "Sur Chariow, la vente d'un produit digital téléchargeable passe par la catégorie **« Fichiers »**. Selon la documentation officielle Chariow, ce format assure la livraison automatique de vos ressources dès la confirmation du paiement et accepte jusqu'à **5 fichiers de 1 Go chacun** pour un produit payant.",
            "Voici le parcours exact de création dans votre tableau de bord Chariow :",
          ],
          bullets: [
            "Étape 1 (Sélection du type) : Dans le menu latéral gauche, ouvrez l'onglet « Produits », cliquez sur créer un nouveau produit, sélectionnez la carte « Fichiers » puis cliquez sur « Continuer ».",
            "Étape 2 (Détails et tarification) : Saisissez le nom du produit, choisissez sa catégorie (attention : la catégorie choisie lors de la création est définitive et ne peut plus être modifiée ensuite), sélectionnez le modèle de tarification (Paiement unique) et indiquez votre prix (ainsi qu'un éventuel prix promotionnel ou une limite d'achat pour votre palier de lancement).",
            "Étape 3 (Description) : Rédigez la présentation claire de votre offre, des bénéfices concrets et du contenu inclus.",
            "Étape 4 (Personnalisation visuelle) : Ajoutez une Vignette carrée (JPG ou PNG, minimum `600x600 px`) et une Bannière rectangulaire (minimum `702x260 px`) reflétant l'identité visuelle propre à votre produit.",
            "Étape 5 (Contenu du produit) : Cliquez sur « Choisir un fichier » et déposez votre archive `.zip` préparée à la Leçon 06.",
            "Étape 6 (Options avancées et publication) : Dans l'onglet « Informations » du produit, renseignez le champ « Instructions après achat » (pour guider immédiatement votre acheteur), ajoutez une section FAQ, puis cliquez sur « Publier ».",
          ],
        },
        {
          id: 'day08-step1-payments-and-security',
          type: 'prose',
          eyebrow: '1.2 PAIEMENTS, COMMISSIONS, PORTAIL CLIENT ET SÉCURITÉ',
          title: 'Ce que vous devez vérifier avec précision avant de lancer',
          paragraphs: [
            "Pour gérer votre boutique professionnellement et informer correctement vos acheteurs, retenez ces quatre réalités documentées de la plateforme Chariow :",
          ],
          bullets: [
            "1. Disponibilité des moyens de paiement au checkout : vous n'avez pas de passerelle technique à programmer vous-même. Les moyens de paiement proposés à votre client (Mobile Money, carte bancaire, etc.) dépendent du pays de l'acheteur et des options effectivement disponibles au checkout (consultables sur `https://chariow.com/coverage`). Vérifiez toujours votre page de paiement en conditions réelles.",
            "2. Modèle de commissions et délais de versement : Chariow ne facture aucun abonnement mensuel fixe. Le plan Starter applique une commission de 15 % sur chaque vente sous 5 000 dollars de chiffre d'affaires cumulé, puis le plan Growth passe à 10 % au-delà de ce seuil. Les gains sont transférés à votre Wallet Axa Zara dans un délai maximal annoncé de 72 heures après la vente ; le retrait vers Mobile Money peut ensuite prendre de quelques heures jusqu'à 72 heures.",
            "3. Portail client de livraison : après son achat, votre client reçoit un accès immédiat au téléchargement et peut retrouver à tout moment ses fichiers, ses instructions et sa facture sur le portail client officiel `https://app.ateliat.com/` en se connectant avec l'adresse e-mail utilisée lors de la commande.",
            "4. Distinction entre la protection Chariow et votre URL publique : Chariow permet de protéger le téléchargement de vos fichiers (mot de passe, limitation d'achat, filigrane sur les documents compatibles). Mais attention : protéger votre archive `.zip` sur Chariow ne rend jamais privée une URL publique hébergée sur Netlify. Le `.zip` téléchargé via Chariow reste le livrable officiel protégé par votre boutique.",
          ],
        },
        {
          id: 'day08-step1-quiz',
          type: 'quiz',
          title: 'Vérification des règles Chariow',
          description: 'Assurez-vous de maîtriser les paramètres réels de publication et de livraison.',
          questions: [
            {
              id: 'q-d08-zip-vs-url',
              question:
                'Activer la protection par mot de passe sur votre fichier dans Chariow rend-il privée votre URL publique hébergée sur Netlify ?',
              options: [
                'Non : la protection Chariow sécurise uniquement le téléchargement du fichier sur Chariow, elle ne protège pas une URL publique externe',
                'Oui, Chariow bloque automatiquement tous les sites Netlify du monde',
                'Oui, mais uniquement le week-end',
              ],
              correctIndex: 0,
              explanation:
                'Il ne faut jamais confondre la sécurité du téléchargement Chariow (sur le fichier .zip) avec l’accessibilité d’une adresse web statique publique.',
            },
            {
              id: 'q-d08-commissions-wallet',
              question:
                'Quel est le fonctionnement documenté des commissions Starter/Growth et du transfert vers le Wallet Axa Zara sur Chariow ?',
              options: [
                '15 % de commission en Starter (< 5 000 $ cumulés), 10 % en Growth (> 5 000 $), et transfert des gains au Wallet dans un délai maximal annoncé de 72h',
                '0 % de commission et virement bancaire instantané en 3 secondes',
                'Un abonnement fixe de 150 000 FCFA par mois obligatoire avant la première vente',
              ],
              correctIndex: 0,
              explanation:
                'Chariow fonctionne sans abonnement mensuel, avec une commission de 15 % en Starter (puis 10 % en Growth) et un délai maximal annoncé de 72h vers le Wallet Axa Zara.',
            },
            {
              id: 'q-d08-customer-portal',
              question:
                'Sur quel portail vos acheteurs peuvent-ils retrouver leurs fichiers achetés et télécharger leur facture ?',
              options: [
                'Sur `https://app.ateliat.com/` en utilisant l’adresse e-mail renseignée lors de l’achat',
                'Uniquement par courrier postal',
                'Sur le compte personnel Claude du vendeur',
              ],
              correctIndex: 0,
              explanation:
                'Le portail client `app.ateliat.com` centralise tous les achats, téléchargements, instructions après achat et factures des clients Chariow.',
            },
          ],
        },
      ],
    },
    {
      id: 'day-08-step-2',
      type: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: 'Rédiger votre fiche produit Chariow, votre FAQ et vos instructions après achat',
      completionLabel: "Valider l'étape 2 : Prompt Claude",
      blocks: [
        {
          id: 'day08-step2-master-prompt',
          type: 'prompt-builder',
          title: 'Compilateur du Prompt de Fiche Produit Chariow (Leçon 08)',
          description:
            "Générez avec Claude tous les textes prêts à copier-coller dans les champs de configuration de votre produit « Fichiers » sur Chariow.",
          deliverableTarget: 'sales-copy',
          fields: [
            {
              key: 'productType',
              label: 'Nom de votre produit',
              placeholder: 'Ex. Le Système de Création Régulière (Outil Interactif)',
              profileBinding: 'productType',
            },
            {
              key: 'targetAudience',
              label: 'Acheteur cible',
              placeholder: 'Ex. Consultants, freelances et formateurs',
              profileBinding: 'targetAudience',
            },
            {
              key: 'mainObjective',
              label: 'Résultat concret apporté par le produit',
              placeholder: 'Ex. Calculer sa capacité réelle et organiser 30 jours de publication en 10 minutes',
              profileBinding: 'mainObjective',
            },
          ],
          template: `<role>
Tu es un Spécialiste E-Commerce Digital expert de la plateforme Chariow.
Tu rédiges des fiches produits claires, structurées et rassurantes qui expliquent exactement comment fonctionne le produit interactif et comment l'acheteur le reçoit.
</role>

<context>
- Nom du produit : {{productType}}
- Acheteur cible : {{targetAudience}}
- Promesse vérifiable : {{mainObjective}}
</context>

<offer_input>
[COLLEZ ICI VOTRE FICHE D'OFFRE DE LA LEÇON 07 :
- Prix choisi (et éventuel palier de lancement)
- Contenu exact du pack .zip
- Les 3 bénéfices concrets]
</offer_input>

<constraints>
- Ne promets aucun revenu garanti ni résultat magique.
- Explique clairement que le produit s'utilise sur téléphone et ordinateur via un simple navigateur web, avec sauvegarde portable JSON.
- N'utilise aucun tiret cadratin.
</constraints>

<output_format>
Fournis les textes exacts prêts à coller dans les champs de configuration de mon produit « Fichiers » sur Chariow :

### 1. Titre du produit et URL personnalisée (Slug)
- 3 propositions de titres explicites et 1 slug URL court.

### 2. Description complète de la page produit Chariow
- **Accroche orientée problème** : la friction vécue aujourd'hui par l'acheteur.
- **Ce que fait concrètement l'outil interactif** : comment l'utilisateur passe de ses saisies à son résultat en quelques minutes.
- **Ce qui est inclus dans le téléchargement immédiat** : détail de l'archive \`.zip\`, de l'accès mobile et de la sauvegarde portable \`.json\`.
- **Pour qui cet outil est conçu (et pour qui il n'est pas adapté)**.

### 3. Texte du champ « Instructions après achat » (Onglet Informations)
- Message court affiché juste après le paiement expliquant : 1) comment télécharger et extraire le \`.zip\`, 2) où trouver le lien d'accès rapide dans le guide inclus, et 3) comment retrouver son achat à tout moment sur \`https://app.ateliat.com/\`.

### 4. Section FAQ Produit (4 questions/réponses)
- Q1 : Ai-je besoin d'installer un logiciel ou de savoir coder ?
- Q2 : Puis-je utiliser l'outil sur mon téléphone et mon ordinateur ?
- Q3 : Comment mes données sont-elles sauvegardées ?
- Q4 : Comment se passe la livraison après le paiement ?

### 5. Brief pour la Vignette (600x600 px min) et la Bannière (702x260 px min)
- Textes courts et composition visuelle à faire figurer sur les deux visuels de la fiche Chariow.
</output_format>`,
        },
      ],
    },
    {
      id: 'day-08-step-3',
      type: 'example',
      number: 3,
      title: 'Exemple guidé',
      subtitle: 'Configuration Chariow complète du cas fil rouge',
      completionLabel: "Valider l'étape 3 : Exemple guidé",
      blocks: [
        {
          id: 'day08-step3-chariow-example',
          type: 'prose',
          eyebrow: '3.1 DÉMONSTRATION DE CONFIGURATION',
          title: 'Paramètres renseignés sur Chariow pour le produit témoin',
          paragraphs: [
            "Voici comment les champs de la fiche Chariow sont remplis pour la mise en ligne du produit témoin d'Alexandre V. :",
          ],
          bullets: [
            "Type de produit : Fichiers (Catégorie : Productivité / Business).",
            "Tarification : Paiement unique à 24 900 FCFA, avec un prix promotionnel de lancement affiché à 14 900 FCFA et une limite d'achat initiale fixée à 30 exemplaires dans l'onglet Informations.",
            "Fichier uploadé : `Pack-Systeme-Creation-Reguliere.zip` (contenant `index.html`, `LISEZ-MOI.html` et `exemple-sauvegarde.json`).",
            "Visuels : Vignette carrée `1080x1080 px` et Bannière `1404x520 px` montrant une capture d'écran réelle du calculateur en couleurs Ardoise & Émeraude sur ordinateur et smartphone.",
            "Instructions après achat : « Merci pour votre commande ! 1) Téléchargez votre pack .ZIP ci-dessous. 2) Ouvrez le fichier LISEZ-MOI.html pour accéder en un clic à la version mobile HTTPS ou lancez index.html sur votre ordinateur. 3) Vous pouvez retrouver vos fichiers et votre facture à tout moment sur https://app.ateliat.com/ avec votre adresse e-mail d'achat. »",
          ],
        },
      ],
    },
    {
      id: 'day-08-step-4',
      type: 'your-turn',
      number: 4,
      title: 'À vous de jouer',
      subtitle: 'Configurer votre fiche Chariow et vérifier le parcours',
      completionLabel: "Valider l'étape 4 : À vous de jouer",
      blocks: [
        {
          id: 'day08-chariow-setup',
          type: 'text-exercise',
          title: 'Exercice principal : Récapitulatif de votre fiche produit Chariow',
          instructions:
            "Générez vos textes avec le prompt de l'étape 2, configurez votre produit de type « Fichiers » dans Chariow et collez ci-dessous : 1) le titre et l'URL de votre fiche Chariow, 2) votre texte d'instructions après achat, et 3) les moyens de paiement constatés sur votre page de checkout.",
          placeholder:
            "1. Titre du produit et lien Chariow :\n2. Fichier(s) uploadé(s) dans l'étape Contenu :\n3. Texte configuré dans 'Instructions après achat' :\n4. Vérification de l'affichage mobile de la page de vente et des options de paiement au checkout :",
          minLength: 60,
          maxLength: 5000,
        },
        {
          id: 'day08-checklist',
          type: 'checklist',
          title: 'Critères de validation observables (Leçon 08)',
          description:
            'Validez chaque point directement sur votre boutique Chariow avant de lancer votre promotion.',
          items: [
            {
              id: 'chk-d08-type-files',
              label: 'Produit créé sous le type « Fichiers » avec l’archive .zip uploadée',
              detail:
                'Votre archive .zip (inférieure à 1 Go) est bien attachée au produit.',
            },
            {
              id: 'chk-d08-visuals',
              label: 'Vignette (min 600x600 px) et Bannière (min 702x260 px) en ligne',
              detail:
                'Les visuels montrent un aperçu honnête et lisible de votre produit interactif.',
            },
            {
              id: 'chk-d08-post-purchase',
              label: 'Instructions après achat et FAQ renseignées',
              detail:
                'L’acheteur sait immédiatement comment ouvrir son outil et comment accéder à `app.ateliat.com`.',
            },
            {
              id: 'chk-d08-checkout-tested',
              label: 'Page de vente et écran de checkout vérifiés sur téléphone',
              detail:
                'Le lien public de la fiche produit s’ouvre sans erreur et affiche le prix ainsi que les moyens de paiement disponibles.',
            },
          ],
        },
      ],
    },
  ],
};
