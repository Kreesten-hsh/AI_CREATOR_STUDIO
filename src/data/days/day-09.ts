import type { Day } from '../../types/course';

export const day09: Day = {
  id: 'day-09',
  dayNumber: 9,
  sprintId: 'module-03',
  title: 'CRÉER SES CONTENUS DE LANCEMENT ET DE PROMOTION',
  italicTitleWord: 'PROMOTION',
  objective:
    "Construire votre premier kit promotionnel autour de la démonstration concrète de votre produit en action : un script de vidéo courte (Reel / TikTok), un carrousel pédagogique et une publication commerciale avec un appel à l'action clair.",
  deliverableSummary:
    'Premier kit promotionnel : script vidéo, carrousel et publication commerciale',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-09-step-1',
      type: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: 'La démonstration produit comme levier de vente honnête',
      completionLabel: "Valider l'étape 1 : Comprendre",
      blocks: [
        {
          id: 'day09-step1-product-demo',
          type: 'prose',
          eyebrow: '1.1 MONTRER PLUTÔT QUE PROMETTRE',
          title: 'Pourquoi la démonstration visuelle est votre meilleur argument',
          highlightPill: 'Problème vécu -> Saisie en direct -> Résultat immédiat -> Appel à l’action',
          paragraphs: [
            "L'avantage majeur d'un produit digital interactif au moment de la promotion est qu'il se montre en action. Là où un document classique oblige souvent à décrire longuement une promesse abstraite, vous pouvez filmer votre écran pendant 30 secondes pour montrer comment une saisie concrète produit instantanément un résultat utile.",
            "Aucune promesse de viralité ni aucun artifice publicitaire ne remplace la clarté d'une démonstration. Vos contenus de lancement reposent sur 4 briques :",
          ],
          bullets: [
            "1. L'accroche orientée problème (Hook) : nommez dès la première phrase la situation précise où votre acheteur bloque (identifiée à la Leçon 01) en utilisant son vrai vocabulaire (Leçon 02).",
            "2. Le contraste d'usage : montrez brièvement pourquoi la méthode manuelle habituelle (calcul à la main, tableur confus, notes dispersées) fait perdre du temps ou génère des erreurs.",
            "3. La démonstration en direct de votre produit : montrez l'écran de votre outil (sur téléphone ou ordinateur), modifiez 1 ou 2 valeurs et laissez le spectateur voir le diagnostic, le calcul ou le plan s'afficher instantanément.",
            "4. L'appel à l'action clair (CTA) : indiquez une seule action simple pour accéder à la fiche Chariow (lien en bio, lien direct dans la publication ou mot-clé en commentaire si vous utilisez le Bonus ManyChat).",
          ],
        },
        {
          id: 'day09-step1-three-formats',
          type: 'prose',
          eyebrow: '1.2 LES 3 CONTENUS FONDAMENTAUX DE VOTRE KIT DE LANCEMENT',
          title: 'Script vidéo courte, Carrousel et Publication écrite',
          paragraphs: [
            "Pour lancer votre produit sans vous disperser, préparez trois formats complémentaires adaptés aux habitudes de consommation de votre audience :",
          ],
          bullets: [
            "Format 1 : Le Script de Reel / TikTok / Short (30 à 45 secondes) : filmé en capture d'écran mobile ou face caméra avec incrustation de l'outil. Structure : Accroche (0-3s) -> Friction manuelle (3-10s) -> Démonstration de l'outil en 3 clics (10-35s) -> Appel à l'action (35-45s).",
            "Format 2 : Le Carrousel pédagogique (6 à 8 slides) : Slide 1 (Titre problème) -> Slide 2 (Pourquoi la méthode habituelle bloque) -> Slides 3 à 5 (Explication de votre mécanisme et captures d'écran d'un cas concret dans l'outil) -> Slide 6 (Récapitulatif de ce que contient l'outil) -> Slide 7 (Appel à l'action).",
            "Format 3 : La Publication commerciale directe (Post écrit / Message de lancement) : un texte structuré présentant le problème, la genèse de l'outil, un exemple concret de résultat obtenu, le détail de l'offre (avec le tarif de lancement) et le lien direct vers votre page Chariow.",
          ],
        },
        {
          id: 'day09-step1-callout-honesty',
          type: 'callout',
          variant: 'important',
          title: 'Intégrité marketing : zéro faux témoignage, zéro statistique inventée',
          content:
            "Lors d'un premier lancement, vous n'avez pas encore des centaines d'avis clients : c'est parfaitement normal. Ne fabriquez jamais de faux témoignages ni de statistiques inventées. Montrez le fonctionnement réel de votre outil sur un cas pratique transparent : la preuve par la démonstration suffit à convaincre les acheteurs concernés par le problème.",
        },
      ],
    },
    {
      id: 'day-09-step-2',
      type: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: 'Générer votre kit promotionnel de lancement sur mesure',
      completionLabel: "Valider l'étape 2 : Prompt Claude",
      blocks: [
        {
          id: 'day09-step2-master-prompt',
          type: 'prompt-builder',
          title: 'Compilateur du Prompt de Kit Promotionnel de Lancement (Leçon 09)',
          description:
            "Utilisez ce prompt dans Claude pour générer votre script vidéo de démonstration, votre carrousel et votre publication de lancement alignés avec votre fiche Chariow.",
          deliverableTarget: 'sales-copy',
          fields: [
            {
              key: 'business',
              label: "Votre domaine d'expertise",
              placeholder: 'Ex. Conseil RH, Gestion financière, Productivité...',
              profileBinding: 'business',
            },
            {
              key: 'targetAudience',
              label: 'Votre audience cible',
              placeholder: 'Ex. Consultants indépendants, Dirigeants de PME...',
              profileBinding: 'targetAudience',
            },
            {
              key: 'productType',
              label: 'Nom et format de votre produit interactif',
              placeholder: 'Ex. Le Système de Création Régulière (Calculateur & Plan 30 jours)',
              profileBinding: 'productType',
            },
            {
              key: 'mainObjective',
              label: 'Action concrète démontrée à l’écran',
              placeholder: 'Ex. Calculer ses heures disponibles et obtenir son plan éditorial en 30 secondes',
              profileBinding: 'mainObjective',
            },
          ],
          template: `<role>
Tu es un Directeur de Création Contenu & Démonstration Produit.
Tu conçois des contenus de lancement sobres, concrets et centrés sur la démonstration visuelle d'un produit interactif en action.
Tu refuses tout jargon d'IA, toute fausse urgence, toute statistique inventée et toute promesse de viralité ou de revenus garantis.
</role>

<context>
- Domaine : {{business}}
- Audience visée : {{targetAudience}}
- Produit interactif : {{productType}}
- Action clé démontrée à l'écran : {{mainObjective}}
</context>

<launch_parameters>
[PRÉCISEZ ICI :
1. Le cas concret que vous allez saisir à l'écran pendant la démonstration (ex. valeurs d'entrée -> résultat affiché)
2. Votre prix de lancement et le lien ou mot-clé d'appel à l'action choisi]
</launch_parameters>

<constraints>
- N'invente aucun témoignage client ni aucun chiffre de marché non sourcé.
- Rédige dans un français naturel, direct et oral pour le script vidéo.
- N'utilise aucun tiret cadratin.
</constraints>

<output_format>
Produis mon Kit Promotionnel de Lancement complet en 4 parties :

### 1. 3 Accroches (Hooks) orientées problème et démonstration
- Accroche A (Situation bloquante vécue)
- Accroche B (Erreur fréquente de calcul ou de méthode manuelle)
- Accroche C (Démonstration directe : "Voici comment calculer / diagnostiquer [X] en 2 minutes")

### 2. Script complet de Reel / TikTok de démonstration (35 à 45 secondes)
Tableau ou liste séquencée indiquant pour chaque segment (0-3s, 3-12s, 12-35s, 35-45s) :
- **[VISUEL À L'ÉCRAN]** : ce que l'on filme précisément dans l'outil interactif.
- **[VOIX OFF & SOUS-TITRES]** : le texte exact prononcé.

### 3. Structure complète d'un Carrousel en 7 slides
- Pour chaque slide (Slide 1 à Slide 7) : Titre visuel court, texte explicatif concis (max 35 mots par slide) et indication du visuel ou de la capture d'écran de l'outil à insérer.

### 4. Publication commerciale de lancement (Post écrit)
- Texte complet structuré : Problème concret -> Pourquoi j'ai conçu cet outil interactif -> Ce qui se passe quand on l'utilise (exemple chiffré) -> Ce qui est inclus + Tarif de lancement -> Appel à l'action clair vers la boutique Chariow.
</output_format>`,
        },
      ],
    },
    {
      id: 'day-09-step-3',
      type: 'example',
      number: 3,
      title: 'Exemple guidé',
      subtitle: 'Script de démonstration et carrousel du cas fil rouge',
      completionLabel: "Valider l'étape 3 : Exemple guidé",
      blocks: [
        {
          id: 'day09-step3-promo-example',
          type: 'prose',
          eyebrow: '3.1 DÉMONSTRATION DU KIT DE LANCEMENT',
          title: 'Exemple de script Reel (40s) pour le produit témoin',
          paragraphs: [
            "Voici comment le produit témoin (`/demos/pdf-to-hub/apres-hub-interactif.html`) est présenté en vidéo courte sans aucune surpromesse :",
          ],
          bullets: [
            "0-3s [Accroche] : Visuel sur l'agenda chargé d'un consultant. Voix : « Pourquoi votre planning de création de contenu saute dès que vous signez un nouveau client ? »",
            "3-10s [Friction] : Visuel sur la page 2 du PDF statique avec sa formule à calculer à la main. Voix : « Parce qu'on vous donne souvent des rythmes théoriques fixes sans tenir compte de vos heures facturables réelles. »",
            "10-32s [Démonstration de l'outil] : Capture d'écran mobile du Hub interactif (Ardoise & Émeraude). Le doigt sélectionne « Freelance Solo », saisit 40h travaillées, 28h clients et 6h admin. Le compteur affiche instantanément « 3.9 h protégées : 1 publication pilier + 2 déclinaisons », puis bascule sur l'onglet Boîte à Prompts déjà pré-rempli. Voix : « J'ai transformé ma méthode en un calculateur interactif : vous entrez vos heures de la semaine, il calcule votre capacité soutenable, adapte vos 3 piliers et génère votre feuille de route 30 jours sauvegardable en JSON. »",
            "32-40s [Appel à l'action] : Visuel de la fiche produit Chariow avec le palier de lancement. Voix : « L'outil est disponible en téléchargement immédiat (14 900 FCFA pour les 30 premiers accès). Le lien est dans ma bio, ou commentez SYSTÈME pour recevoir le lien en message privé. »",
          ],
        },
      ],
    },
    {
      id: 'day-09-step-4',
      type: 'your-turn',
      number: 4,
      title: 'À vous de jouer',
      subtitle: 'Assembler et valider votre premier kit promotionnel',
      completionLabel: "Valider l'étape 4 : À vous de jouer",
      blocks: [
        {
          id: 'day09-launch-kit',
          type: 'text-exercise',
          title: 'Exercice principal : Votre Kit Promotionnel de Lancement',
          instructions:
            "Exécutez le prompt de l'étape 2 dans Claude, adaptez les textes à votre ton personnel et collez ci-dessous vos 3 livrables finaux prêts à publier : 1) votre script vidéo de démonstration, 2) le plan de vos 7 slides de carrousel, et 3) votre publication écrite de lancement.",
          placeholder:
            "1. Script Vidéo Reel / TikTok (35-45s avec indications visuelles) :\n\n2. Structure du Carrousel (Slides 1 à 7) :\n\n3. Publication commerciale de lancement (avec appel à l'action vers Chariow) :",
          minLength: 90,
          maxLength: 6000,
        },
        {
          id: 'day09-checklist',
          type: 'checklist',
          title: 'Critères de validation observables (Leçon 09)',
          description:
            'Vérifiez ces 4 points avant de publier vos premiers contenus et de passer aux Bonus.',
          items: [
            {
              id: 'chk-d09-real-demo',
              label: 'Démonstration réelle de l’outil au cœur des contenus',
              detail:
                'Le script et le carrousel montrent concrètement le passage d’une saisie utilisateur au résultat dans votre produit.',
            },
            {
              id: 'chk-d09-audience-vocab',
              label: 'Accroche formulée avec le vocabulaire réel de l’acheteur',
              detail:
                'Aucun jargon d’IA : l’accroche décrit la situation précise identifiée au Module 01.',
            },
            {
              id: 'chk-d09-no-fake-proof',
              label: 'Zéro faux témoignage et zéro promesse financière',
              detail:
                'Les arguments reposent exclusivement sur l’utilité vérifiable de l’outil.',
            },
            {
              id: 'chk-d09-clear-cta',
              label: 'Appel à l’action unique et fonctionnel',
              detail:
                'Chaque contenu oriente clairement vers votre lien Chariow (ou vers le mot-clé DM configuré avec le Bonus ManyChat).',
            },
          ],
        },
      ],
    },
  ],
};
