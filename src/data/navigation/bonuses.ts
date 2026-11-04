import type { BonusItem } from '../../types/navigation';

export const BONUSES: BonusItem[] = [
  {
    id: 'bonus-manychat',
    orderNumber: 'Bonus 01',
    title: 'LE SYSTÈME MANYCHAT AUTOMATISÉ AVEC CLAUDE',
    subtitle: 'Du commentaire Instagram au lien Chariow dans le respect des règles Meta',
    duration: '45 min',
    deliverable: 'Une automatisation DM personnalisée, fonctionnelle et testée.',
    description:
      'Concevoir avec Claude et configurer dans ManyChat une automatisation Instagram qui transforme les commentaires sous vos publications en conversations privées qualifiées orientées vers votre fiche produit Chariow.',
    keyTopics: [
      'Prérequis : Compte Instagram Professionnel lié à une Page Facebook',
      'Parcours exact en 5 étapes conforme à la fenêtre de messagerie Meta de 24 heures',
      'Distinction Quick Reply / Bouton classique vs Bouton « Open website »',
      'Gestion obligatoire de la non-interaction (arrêt strict sans relance)',
      'Conception de l’arbre conversationnel avec Claude (sans API temps réel)',
      'Protocole de test réel avant publication',
    ],
    blocks: [
      {
        id: 'bonus-mc-prose-rules',
        type: 'prose',
        eyebrow: '1. CADRE TECHNIQUE ET RÈGLES OFFICIELLES META / MANYCHAT',
        title: 'Comprendre la fenêtre de 24 heures et le parcours exact en 5 étapes',
        highlightPill: '1er commentaire -> 1er DM privé -> Interaction Quick Reply -> Fenêtre 24h -> Lien Chariow',
        paragraphs: [
          "Dans ce bonus, Claude est utilisé comme votre architecte conversationnel : il rédige vos messages, vos boutons de réponses rapides et vos branches de qualification que vous copiez ensuite dans ManyChat. Vous n'avez pas besoin de connecter une API Claude payante en temps réel à ManyChat.",
          "Avant de construire votre flux, vous devez connaître les règles techniques officielles de l'API Instagram Messaging (Meta) et de ManyChat :",
        ],
        bullets: [
          "Prérequis de compte : votre compte Instagram doit être un compte Professionnel (Creator ou Business) relié à une Page Facebook.",
          "Règle du premier commentaire : le déclencheur de commentaires (Comment Trigger) ne s'active que pour le premier commentaire d'un utilisateur sous la publication concernée.",
          "Le premier DM privé n'ouvre PAS la fenêtre de 24 heures : lorsqu'un prospect commente votre mot-clé, Meta autorise l'envoi d'un seul message privé initial (Private Reply). Ce premier envoi ne vous autorise pas encore à dérouler une séquence de plusieurs messages.",
          "Comment s'ouvre la fenêtre de 24 heures : le prospect doit impérativement répondre par texte ou cliquer sur une Quick Reply (réponse rapide) ou un bouton classique dans votre premier DM. Attention : un bouton de type « Open website » (lien externe direct) ne constitue pas une interaction d'opt-in et n'ouvre pas la fenêtre de 24 heures.",
          "Cas où le prospect ne clique jamais sur le premier DM : si le prospect lit ou ignore votre premier DM sans cliquer ni répondre, la fenêtre de 24 heures reste fermée. Votre automatisation doit s'arrêter là : vous ne devez programmer aucune relance automatique après un premier DM resté sans réponse.",
        ],
      },
      {
        id: 'bonus-mc-prose-5steps',
        type: 'prose',
        eyebrow: '2. ARCHITECTURE DU FLUX CONVERSATIONNEL',
        title: 'Les 5 étapes du parcours ManyChat à configurer',
        paragraphs: [
          "Voici l'enchaînement exact qui respecte les règles Meta tout en qualifiant naturellement votre acheteur :",
        ],
        bullets: [
          "Étape 1 (Commentaire sous une publication) : à la fin de votre Reel ou carrousel de démonstration (Leçon 09), vous invitez l'audience à commenter un mot-clé précis (ex. « OUTIL » ou « CALCUL »). Le prospect écrit ce mot-clé en commentaire.",
          "Étape 2 (Premier DM privé) : ManyChat répond publiquement au commentaire (« Je viens de vous envoyer un message privé ») et envoie 1 seul DM court contenant une question fermée accompagnée d'une Quick Reply (ex. « Souhaitez-vous recevoir le lien de l'outil interactif ? [Oui, voir l'outil] »). Si le prospect n'interagit pas ici, le flux s'arrête définitivement sans relance.",
          "Étape 3 (Interaction du prospect) : le prospect clique sur la Quick Reply « Oui, voir l'outil » ou répond par message.",
          "Étape 4 (Fenêtre de 24 heures ouverte : Qualification et présentation) : la fenêtre de 24 heures étant désormais ouverte, ManyChat pose une question de profilage rapide avec 2 ou 3 Quick Replies correspondant aux cas d'usage de votre produit, puis présente le bénéfice exact de l'outil pour ce profil.",
          "Étape 5 (Lien vers Chariow) : le message final affiche le bouton menant directement vers votre fiche produit Chariow (ainsi qu'une option « Poser une question » si le prospect hésite).",
        ],
      },
      {
        id: 'bonus-mc-callout-limits',
        type: 'callout',
        variant: 'warning',
        title: 'Vigilance opérationnelle : pas de promesse d’automatisation illimitée',
        content:
          "Une automatisation DM ne remplace pas la qualité de votre démonstration produit et ne garantit pas des ventes automatiques 24h/24 sans suivi. Chez les personnes qui ne suivent pas encore votre compte Instagram, le premier DM arrive dans l'onglet « Demandes de messages » (Message Requests). Testez toujours votre flux avec un compte tiers avant de publier.",
      },
      {
        id: 'bonus-mc-prompt',
        type: 'prompt-builder',
        title: 'Compilateur du Prompt Architecte de Flux ManyChat (Bonus 01)',
        description:
          'Générez avec Claude tous les messages courts, boutons Quick Reply et branches conditionnelles prêts à copier dans le Flow Builder de ManyChat.',
        deliverableTarget: 'automation-json',
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
            label: 'Votre produit interactif vendu sur Chariow',
            placeholder: 'Ex. Calculateur de Capacité & Feuille de Route 30 Jours',
            profileBinding: 'productType',
          },
          {
            key: 'mainObjective',
            label: 'Résultat concret apporté par le produit',
            placeholder: 'Ex. Calculer sa capacité réelle et organiser 30 jours de publication en 10 minutes',
            profileBinding: 'mainObjective',
          },
        ],
        template: `<role>
Tu es un Spécialiste en Automatisation Conversationnelle Instagram (ManyChat) maîtrisant parfaitement les règles de conformité de l'API Meta.
Ton rôle est de rédiger les textes exacts d'un flux ManyChat en 5 étapes orientant vers une fiche produit Chariow.
</role>

<context>
- Domaine : {{business}}
- Audience : {{targetAudience}}
- Produit : {{productType}}
- Bénéfice concret : {{mainObjective}}
</context>

<constraints>
- Respecte strictement la règle Meta : le Message Privé n°1 (envoyé après le commentaire) doit être unique, court (moins de 300 caractères) et se terminer par une Quick Reply (ou un bouton classique d'interaction, JAMAIS un bouton "Open website") afin d'ouvrir la fenêtre de 24 heures.
- Indique explicitement qu'aucune relance automatique ne doit être attachée au Message Privé n°1 si le prospect ne clique pas.
- Rédige des messages naturels, courtois et sans pression commerciale artificielle.
- N'utilise aucun tiret cadratin.
</constraints>

<output_format>
Fournis le plan complet à copier dans ManyChat :

### Étape 1 : Configuration du déclencheur (Comment Trigger)
- Mot-clé recommandé à faire commenter sous le Reel ou le carrousel.
- 3 variantes de réponses publiques automatiques sous le commentaire (pour varier les réponses).

### Étape 2 : Premier DM privé (Ouverture de la fenêtre de 24h)
- Texte exact du Message Privé n°1.
- Libellé exact de la Quick Reply d'opt-in (max 20 caractères).
- Règle de sécurité : mention d'arrêt du flux en cas de non-clic (0 relance hors fenêtre 24h).

### Étape 3 & 4 : Qualification par Quick Replies (Fenêtre de 24h ouverte)
- Question de qualification simple identifiant la situation du prospect, avec 2 réponses rapides (Branche A et Branche B).
- Message personnalisé pour la Branche A présentant comment l'outil résout ce cas précis.
- Message personnalisé pour la Branche B présentant comment l'outil résout ce second cas.

### Étape 5 : Orientation vers le lien Chariow et gestion d'objection
- Message final avec bouton vers la fiche Chariow + Quick Reply secondaire "J'ai une question avant".
- Message de réponse automatique si le prospect clique sur "J'ai une question avant" (invitant à poser sa question pour une réponse humaine).
</output_format>`,
      },
      {
        id: 'bonus-mc-copy-flow',
        type: 'copy',
        title: 'Modèle prêt à copier : Flux ManyChat en 5 étapes (Cas fil rouge)',
        label: 'EXEMPLE COMPLET CONFORME META 24H',
        content: `[ÉTAPE 1 : DÉCLENCHEUR COMMENTAIRE]
• Mot-clé : CAPACITÉ (sur le Reel de démonstration)
• Réponses publiques sous le commentaire :
  1) "C'est envoyé ! Vérifiez vos messages privés (et l'onglet Demandes si nous ne sommes pas encore connectés)."
  2) "Je viens de vous transmettre les détails en message privé."

[ÉTAPE 2 : PREMIER DM PRIVÉ (1 SEUL MESSAGE - N'OUVRE PAS ENCORE LA FENÊTRE 24H)]
"Bonjour ! Merci pour votre commentaire sous ma vidéo. Souhaitez-vous voir comment fonctionne le calculateur de capacité hebdomadaire pour votre activité ?"
-> Quick Reply (Bouton d'interaction) : [Oui, me montrer]
(Règle : Si le prospect ne clique pas et ne répond pas, l'automatisation s'arrête ici. Aucune relance.)

[ÉTAPE 3 : CLIC DU PROSPECT SUR "Oui, me montrer" -> OUVERTURE DE LA FENÊTRE DE 24H]

[ÉTAPE 4 : QUALIFICATION RAPIDE DANS LA FENÊTRE DE 24H]
"Parfait ! Pour vous donner l'exemple le plus proche de votre quotidien, quelle est votre activité principale ?"
-> Quick Reply A : [Freelance / Consultant]
-> Quick Reply B : [Formateur / Coach]

[ÉTAPE 5 : PRÉSENTATION CIBLÉE & LIEN CHARIOW]
"C'est noté ! Dans l'outil interactif, il vous suffit d'entrer vos heures travaillées et vos heures clients : il calcule votre créneau protégé, ajuste vos 3 piliers et prépare votre feuille de route 30 jours (utilisable sur téléphone et ordinateur avec sauvegarde JSON).
Vous pouvez accéder à la fiche complète et au téléchargement immédiat sur Chariow ici :"
-> Bouton Lien : [Voir la fiche sur Chariow] (https://votre-boutique.mychariow.shop/...)
-> Quick Reply : [J'ai une question]`,
      },
      {
        id: 'bonus-mc-checklist',
        type: 'checklist',
        title: 'Protocole de vérification et de test de votre automatisation ManyChat',
        description:
          'Ne présentez jamais votre automatisation comme active avant d’avoir validé ces 5 contrôles en conditions réelles.',
        items: [
          {
            id: 'chk-mc-pro-account',
            label: 'Compte Instagram Professionnel relié à une Page Facebook vérifié',
            detail:
              'La connexion ManyChat affiche le statut actif dans Settings > Instagram.',
          },
          {
            id: 'chk-mc-first-dm',
            label: 'Premier DM muni d’une Quick Reply (et non d’un bouton Open website seul)',
            detail:
              'Le clic du prospect sur cette Quick Reply ouvre réglementairement la fenêtre de 24 heures.',
          },
          {
            id: 'chk-mc-no-followup',
            label: 'Aucune relance programmée si le prospect n’interagit pas avec le 1er DM',
            detail:
              'Si le prospect ne clique pas sur le premier message, le flux s’arrête proprement.',
          },
          {
            id: 'chk-mc-chariow-link',
            label: 'Lien vers la fiche produit Chariow vérifié à l’Étape 5',
            detail:
              'Le bouton final ouvre bien la page publique de votre produit sur téléphone.',
          },
          {
            id: 'chk-mc-real-test',
            label: 'Test complet effectué avec un second compte Instagram sous une vraie publication',
            detail:
              'Vous avez posté le commentaire mot-clé depuis un compte tiers et parcouru les 5 étapes jusqu’à la page Chariow.',
          },
        ],
      },
    ],
  },
  {
    id: 'bonus-marketing',
    orderNumber: 'Bonus 02',
    title: 'MARKETING LIBRARY',
    subtitle: 'Modèles personnalisables pour vos campagnes de démonstration et de vente',
    duration: 'Accès permanent',
    deliverable: 'Une bibliothèque marketing organisée, directement exploitable dans l’application.',
    description:
      'Bibliothèque complète de structures personnalisables avec variables d’adaptation : 20 structures d’accroches Reels/TikTok, 5 structures de carrousels, 3 séquences d’emails de lancement, templates DM/objections et scripts de démonstration produit.',
    keyTopics: [
      '20 structures d’accroches (Hooks) pour Reels et TikTok avec variables',
      '5 structures de carrousels pédagogiques et de démonstration',
      '3 séquences d’emails de lancement sobres et factuelles',
      'Templates de messages DM et réponses aux objections fréquentes',
      'Scripts de démonstration produit (30s, 60s et Story 3 étapes)',
    ],
    blocks: [
      {
        id: 'bonus-mkt-intro',
        type: 'prose',
        eyebrow: 'MODE D’EMPLOI DE LA BIBLIOTHÈQUE',
        title: 'Des structures d’argumentation honnêtes, centrées sur l’usage réel',
        highlightPill: 'Remplacez les variables [ENTRE CROCHETS] par les éléments de votre propre produit',
        paragraphs: [
          "Chaque modèle de cette bibliothèque est conçu pour mettre en valeur l'utilité concrète de votre produit interactif. Conformément à nos règles déontologiques, aucun modèle n'utilise de faux témoignages, de statistiques inventées ni de promesses de viralité.",
          "Vous pouvez copier directement chaque section ci-dessous, utiliser le compilateur Claude en bas de page pour adapter instantanément un modèle à votre niche, ou télécharger le recueil complet en Markdown.",
        ],
      },
      {
        id: 'bonus-mkt-copy-hooks',
        type: 'copy',
        title: '1. Les 20 Structures d’Accroches (Hooks) pour Reels et TikTok',
        label: '20 HOOKS AVEC VARIABLES D’ADAPTATION',
        content: `CATÉGORIE A : DIAGNOSTIC D'ERREUR OU DE FRICTION MANUELLE (1 à 5)
1. "Pourquoi votre [MÉTHODE MANUELLE HABITUELLE] finit toujours par bloquer dès que [SITUATION IMPRÉVUE] arrive."
2. "L'erreur de calcul que je vois le plus souvent chez les [AUDIENCE CIBLE] quand ils préparent leur [TÂCHE CLÉ]."
3. "Si vous utilisez encore [OUTIL STATIQUE OU BRICOLAGE] pour [OBJECTIF], voici pourquoi vous perdez du temps à chaque étape."
4. "Avant de [ACTION IMPORTANTE DE L'AUDIENCE], vérifiez toujours ces [NOMBRE] critères (la plupart oublient le dernier)."
5. "Vous n'avez pas un problème de motivation pour [OBJECTIF] : vous manquez juste d'un moyen simple de calculer [VARIABLE CLÉ]."

CATÉGORIE B : DÉMONSTRATION PRODUIT EN DIRECT (6 à 10)
6. "Je vous montre comment passer de [DONNÉE BRUTE CONFUSE] à [RÉSULTAT CLAIR] en moins de [DURÉE EN MINUTES] avec cet outil."
7. "Regardez ce qui se passe quand on entre [VARIABLE 1] et [VARIABLE 2] dans ce calculateur pour [AUDIENCE CIBLE]."
8. "J'ai transformé ma grille de travail sur [SUJET] en un outil interactif : voici un test en direct sur un cas concret."
9. "Comment savoir en 3 clics si votre [PROJET / TARIF / PLANNING] tient vraiment la route."
10. "Plus besoin de recalculer à la main votre [INDICATEUR] : voici comment l'outil ajuste tout dès que votre [CONTRAINTE] change."

CATÉGORIE C : CLARTÉ ET PRISE DE DÉCISION (11 à 15)
11. "Comment arbitrer entre [OPTION A] et [OPTION B] quand on est [AUDIENCE CIBLE] avec [CONTRAINTE FORTE]."
12. "Les 3 questions exactes à trancher avant de lancer votre prochain [ACTION MÉTIER]."
13. "Que faire quand vous avez moins de [TEMPS OU BUDGET DISPONIBLE] par semaine pour gérer votre [DOMAINE] ?"
14. "La méthode pas à pas pour organiser votre [LIVRABLE CLIENT] sans ouvrir un tableur illisible."
15. "Voici comment diagnostiquer précisément où se situe le blocage dans votre [PROCESSUS ACTUEL]."

CATÉGORIE D : COULISSES ET TRANSFORMATION DE MÉTHODE (16 à 20)
16. "Pourquoi j'ai arrêté de donner un simple document figé à mes clients en [DOMAINE] (et ce par quoi je l'ai remplacé)."
17. "La checklist interactive que j'utilise pour vérifier [OPÉRATION CRITIQUE] sans rien oublier."
18. "3 paramètres que chaque [AUDIENCE CIBLE] devrait connaître par cœur avant de fixer son [DÉCISION CLÉ]."
19. "Comment adapter votre [PLAN D'ACTION] en 30 secondes quand votre semaine ne se passe pas comme prévu."
20. "Voici l'outil que j'aurais aimé avoir quand j'ai commencé à [ACTION PRINCIPALE DE L'AUDIENCE]."`,
      },
      {
        id: 'bonus-mkt-copy-carousels',
        type: 'copy',
        title: '2. Les 5 Structures de Carrousels Pédagogiques',
        label: '5 STRUCTURES COMPLÈTES SLIDE PAR SLIDE',
        content: `STRUCTURE CARROUSEL 1 : DU BLOCAGE MANUEL AU RÉSULTAT INTERACTIF (7 SLIDES)
• Slide 1 (Couverture) : Pourquoi [ACTION DE L'AUDIENCE] vous prend encore [DURÉE EXCESSIVE] (et comment réduire ce temps).
• Slide 2 (Le constat) : Quand vous devez [TÂCHE], vous êtes obligé de jongler entre [SUPPORT 1] et [SUPPORT 2].
• Slide 3 (La vraie cause) : Le blocage ne vient pas de la théorie, mais du fait de devoir tout recalculer ou trier à la main.
• Slide 4 (La mécanique) : La formule / règle simple en 3 variables : [VARIABLE A] + [VARIABLE B] -> [RÉSULTAT].
• Slide 5 (Preuve par l'image) : Capture d'écran de votre outil montrant les champs remplis et le résultat affiché.
• Slide 6 (Ce que ça change) : Vous modifiez un chiffre, tout le plan s'adapte et se sauvegarde en JSON.
• Slide 7 (CTA) : L'outil complet [NOM DU PRODUIT] est disponible via le lien en bio (ou commentez [MOT-CLÉ]).

STRUCTURE CARROUSEL 2 : LES 3 ERREURS D'ÉVALUATION MANUELLE (7 SLIDES)
• Slide 1 : Les 3 erreurs fréquentes quand un [AUDIENCE] évalue son [SUJET] à l'œil nu.
• Slide 2 : Erreur n°1 : Ignorer [CONTRAINTE CACHÉE] dans son estimation initiale.
• Slide 3 : Erreur n°2 : Appliquer le même barème à [CAS A] et à [CAS B].
• Slide 4 : Erreur n°3 : Ne pas conserver de trace structurée de ses décisions précédentes.
• Slide 5 : Comment corriger ces 3 biais avec une grille pondérée interactive (Capture de l'outil).
• Slide 6 : Exemple chiffré : Avec [ENTRÉE EXEMPLE], le diagnostic recommande immédiatement [SORTIE EXEMPLE].
• Slide 7 (CTA) : Téléchargez [NOM DU PRODUIT] sur ma boutique Chariow (lien en bio).

STRUCTURE CARROUSEL 3 : SIMULATION D'UN CAS PRATIQUE PAS À PAS (6 SLIDES)
• Slide 1 : Étude de cas pratique : organiser [OBJECTIF] avec la contrainte [CONTRAINTE].
• Slide 2 : Étape 1 : Poser les données de départ ([VALEUR 1], [VALEUR 2]).
• Slide 3 : Étape 2 : Appliquer le filtre / calcul dans [NOM DU PRODUIT] (Capture de l'étape).
• Slide 4 : Étape 3 : Lecture du diagnostic et des [NOMBRE] priorités retenues.
• Slide 5 : Étape 4 : Export du plan d'action pour l'appliquer sur [PÉRIODE].
• Slide 6 (CTA) : Testez le même parcours avec vos propres chiffres : lien en bio.

STRUCTURE CARROUSEL 4 : LA CHECKLIST D'AUTO-CONTRÔLE (6 SLIDES)
• Slide 1 : Avant de valider votre prochain [PROJET / OFFRE / ACTION], passez ce contrôle en [NOMBRE] points.
• Slide 2 : Point 1 : Avez-vous vérifié [CRITÈRE 1] ?
• Slide 3 : Point 2 : Votre [ÉLÉMENT 2] respecte-t-il [SEUIL OU RÈGLE] ?
• Slide 4 : Point 3 : Avez-vous préparé [ÉLÉMENT 3] ?
• Slide 5 : Dans [NOM DU PRODUIT], cette checklist calcule automatiquement votre score de préparation.
• Slide 6 (CTA) : Accès immédiat à l'outil interactif via le lien en bio.

STRUCTURE CARROUSEL 5 : POURQUOI UN OUTIL PLUTÔT QU'UN LONG DISCOURS (6 SLIDES)
• Slide 1 : Vous n'avez pas besoin de lire 200 pages de plus sur [SUJET]. Vous avez besoin de passer à l'action.
• Slide 2 : Lire une méthode est utile pour comprendre. Mais au moment d'agir, on hésite souvent devant la page blanche.
• Slide 3 : C'est pour cela que j'ai condensé ma méthode de [DOMAINE] dans un outil interactif sans bla-bla.
• Slide 4 : Vous ouvrez la page sur téléphone ou ordinateur, vous saisissez votre contexte, vous obtenez votre [LIVRABLE].
• Slide 5 : Fonctionne hors ligne (archive ZIP) et en ligne (HTTPS) avec sauvegarde portable JSON.
• Slide 6 (CTA) : Découvrez [NOM DU PRODUIT] au tarif de lancement de [PRIX] sur ma boutique (lien en bio).`,
      },
      {
        id: 'bonus-mkt-copy-emails',
        type: 'copy',
        title: '3. Les 3 Séquences d’Emails de Lancement',
        label: '3 EMAILS DE LANCEMENT FACTUELS ET STRUCTURÉS',
        content: `EMAIL 1 : LE CONSTAT DE TERRAIN ET LA NOUVELLE APPROCHE
Objet : Le vrai blocage quand on essaie de [OBJECTIF DE L'AUDIENCE]

Bonjour [PRÉNOM],

Quand j'échange avec des [AUDIENCE CIBLE], une même difficulté revient régulièrement : au moment de [ACTION MÉTIER], tout prend trop de temps parce qu'il faut [FRICTION MANUELLE : calculer à la main / trier des notes éparses / adapter un modèle figé].

Un guide écrit reste très utile pour comprendre la théorie. Mais lorsqu'il faut prendre une décision rapide avec ses propres chiffres, on a besoin d'un support qui fait le travail de calcul et de tri avec nous.

C'est la raison pour laquelle j'ai conçu [NOM DU PRODUIT].

Il s'agit d'un outil interactif autonome (utilisable directement dans votre navigateur sur téléphone et ordinateur) qui vous permet de :
- Saisir votre situation actuelle ([ENTRÉES CLÉS]),
- Obtenir immédiatement votre [RÉSULTAT / DIAGNOSTIC / PLAN],
- Sauvegarder et reprendre votre avancement à tout moment.

Vous pouvez découvrir son fonctionnement et y accéder au tarif de lancement ([PRIX DE LANCEMENT] pour les [NOMBRE] premiers accès) ici :
👉 [LIEN FICHE PRODUIT CHARIOW]

À très vite,
[VOTRE SIGNATURE]

---

EMAIL 2 : DÉMONSTRATION SUR UN CAS CONCRET
Objet : Exemple concret : comment calculer / structurer votre [SUJET] en [DURÉE]

Bonjour [PRÉNOM],

Hier, je vous ai présenté [NOM DU PRODUIT]. Pour que vous puissiez juger concrètement de son utilité pour votre activité, voici comment il fonctionne étape par étape sur un cas type :

Imaginons un [PROFIL TYPE DE L'AUDIENCE] qui dispose de [CONTRAINTE CHIFFRÉE 1] et doit gérer [CONTRAINTE CHIFFRÉE 2].

1. Dans le premier panneau de l'outil, il renseigne ces deux valeurs.
2. L'outil calcule instantanément [RÉSULTAT CHIFFRÉ OU DIAGNOSTIC] et écarte les options inadaptées.
3. Dans le panneau suivant, il coche sa feuille de route personnalisée et exporte sa sauvegarde.

Aucun logiciel à installer, aucun abonnement mensuel : vous recevez immédiatement l'archive complète et votre lien d'accès après validation sur Chariow.

👉 Voir la démonstration et accéder à [NOM DU PRODUIT] : [LIEN FICHE PRODUIT CHARIOW]

Bien à vous,
[VOTRE SIGNATURE]

---

EMAIL 3 : RÉPONSES AUX QUESTIONS PRATIQUES ET DERNIERS ACCÈS AU PALIER DE LANCEMENT
Objet : Vos questions sur [NOM DU PRODUIT] (fonctionnement, mobile, livraison)

Bonjour [PRÉNOM],

Suite à la mise en ligne de [NOM DU PRODUIT], voici les réponses aux 3 questions pratiques qui m'ont été posées :

1. "Est-ce que j'ai besoin de connaissances techniques ou d'un logiciel payant ?"
Non. L'outil s'ouvre dans le navigateur web de votre téléphone ou de votre ordinateur (Chrome, Safari, Firefox, Edge), sans aucune installation ni compte tiers.

2. "Comment mes données sont-elles enregistrées ?"
Sur le lien web sécurisé, vos saisies sont mémorisées dans votre navigateur. Et grâce aux boutons Exporter / Importer (.json), vous pouvez sauvegarder vos données dans un fichier sur votre appareil et les transférer d'un téléphone à un ordinateur.

3. "Est-ce adapté si je débute sur [SUJET] ?"
L'outil intègre des valeurs d'exemple pré-remplies et des explications claires à chaque étape pour vous guider dès la première ouverture.

Le tarif de lancement à [PRIX DE LANCEMENT] (au lieu de [PRIX STANDARD]) concerne uniquement les [NOMBRE] premières commandes.

👉 Accéder immédiatement à [NOM DU PRODUIT] : [LIEN FICHE PRODUIT CHARIOW]

À votre disposition si vous avez une question,
[VOTRE SIGNATURE]`,
      },
      {
        id: 'bonus-mkt-copy-dm-objections',
        type: 'copy',
        title: '4. Templates de Messages DM et Réponses aux Objections',
        label: 'CONVERSATIONS PRIVÉES ET RÉPONSES TRANSPARENTES',
        content: `TEMPLATE DM 1 : RÉPONSE SUITE À UNE RÉACTION EN STORY OU UN COMMENTAIRE MANUEL
"Bonjour [PRÉNOM] ! Merci pour votre message au sujet de [SUJET]. Pour vous répondre précisément, quelle est votre principale difficulté aujourd'hui quand vous devez [ACTION CIBLE] ?"

TEMPLATE DM 2 : ORIENTATION VERS L'OUTIL APRÈS ÉCHANGE
"D'après ce que vous me décrivez sur [PROBLÈME EXPRIMÉ], c'est exactement pour éviter [FRICTION] que j'ai construit l'outil interactif [NOM DU PRODUIT]. Vous y entrez vos [VARIABLES D'ENTRÉE] et il génère directement votre [RÉSULTAT]. Voici la fiche détaillée avec l'aperçu complet : [LIEN CHARIOW]. Dites-moi si vous avez la moindre question dessus !"

---

RÉPONSES AUX 4 OBJECTIONS LES PLUS FRÉQUENTES :

OBJECTION 1 : "Quelle est la différence avec un guide PDF ou un ebook classique ?"
Réponse : "Un guide PDF est très bien pour lire une méthode théorique. Mais ici, vous n'avez pas à faire les calculs ou le tri à la main : vous saisissez vos propres données ([EXEMPLE DE VARIABLES]), l'outil applique la méthode automatiquement et affiche votre résultat sur mesure en quelques secondes."

OBJECTION 2 : "Je n'ai pas d'ordinateur en ce moment, est-ce que ça marche sur téléphone ?"
Réponse : "Oui, tout à fait. Dans votre pack téléchargé sur Chariow, vous avez un lien d'accès sécurisé (HTTPS) conçu pour s'adapter à l'écran de votre smartphone, ainsi que la fonction d'export JSON pour conserver vos données."

OBJECTION 3 : "Je manque de temps pour apprendre à utiliser un nouvel outil."
Réponse : "C'est justement fait pour être pris en main en moins de 5 minutes : il n'y a que [NOMBRE] sections simples, avec un exemple déjà pré-rempli à l'ouverture. Vous remplacez simplement les chiffres par les vôtres."

OBJECTION 4 : "Le prix représente un budget pour moi aujourd'hui."
Réponse : "Je comprends tout à fait. Comparez-le simplement au temps que vous passez chaque mois à [FRICTION MANUELLE]. C'est un paiement unique de [PRIX] (sans aucun abonnement) que vous conservez définitivement pour tous vos prochains [PROJETS / CAS]."`,
      },
      {
        id: 'bonus-mkt-copy-demo-scripts',
        type: 'copy',
        title: '5. Les 3 Scripts de Démonstration Produit',
        label: 'SCRIPTS DE DÉMONSTRATION VISUELLE (30S, 60S ET STORIES)',
        content: `SCRIPT DÉMO 1 : FORMAT 30 SECONDES (CAPTURE D'ÉCRAN MOBILE DIRECTE)
• [0-4s | Écran : Titre de l'outil sur smartphone] : "Voici comment je calcule / prépare [OBJECTIF] en moins de 2 minutes sans tableur."
• [4-15s | Écran : Saisie de 2 ou 3 champs dans l'outil] : "J'ouvre [NOM DU PRODUIT], je sélectionne mon profil [EXEMPLE PROFIL] et j'indique [VARIABLE 1] et [VARIABLE 2]."
• [15-24s | Écran : Zoom sur le résultat qui change en direct] : "Instantanément, l'outil me donne [RÉSULTAT CONCRET] et ajuste ma liste d'actions prioritaires."
• [24-30s | Écran : Bouton Exporter JSON & Fiche Chariow] : "Je sauvegarde mes données en un clic. Le lien vers l'outil est dans ma bio (ou commentez [MOT-CLÉ])."

---

SCRIPT DÉMO 2 : FORMAT 60 SECONDES (AVANT / APRÈS SUR UN CAS CLIENT TYPE)
• [0-8s | Face caméra] : "Quand un [AUDIENCE] veut [OBJECTIF], il se retrouve souvent devant une feuille blanche ou des formules compliquées à calculer à la main."
• [8-20s | Écran : Montrer l'ancienne méthode manuelle] : "Avant, il fallait poser manuellement [ÉTAPE MANUELLE 1], puis [ÉTAPE MANUELLE 2], avec le risque de se tromper dès qu'un paramètre change."
• [20-48s | Écran : Démonstration complète de l'outil interactif] : "Dans [NOM DU PRODUIT], toute cette logique est automatisée :
  1) Vous entrez vos données dans l'onglet 1,
  2) Le diagnostic s'affiche en direct avec votre recommandation précise,
  3) Vous suivez votre plan étape par étape et vous exportez votre sauvegarde JSON pour la retrouver sur téléphone ou ordinateur."
• [48-60s | Face caméra / Fiche Chariow] : "L'outil est disponible en téléchargement immédiat sur ma boutique Chariow au tarif de lancement de [PRIX]. Rendez-vous sur le lien en bio."

---

SCRIPT DÉMO 3 : SÉQUENCE DE 3 STORIES INSTAGRAM / WHATSAPP STATUT
• Story 1 (Le problème + Sondage) : Capture d'une situation fréquente de [DOMAINE]. Texte : "Combien de temps passez-vous encore à [TÂCHE MANUELLE PÉNIBLE] ?" + Sondage : [Trop longtemps / Je repousse toujours].
• Story 2 (Vidéo démo de 20s de l'outil) : Enregistrement d'écran montrant la saisie d'un cas réel et le résultat immédiat dans [NOM DU PRODUIT]. Texte : "J'ai transformé ma méthode en un outil interactif qui fait le calcul et le tri en 30 secondes."
• Story 3 (Détail de l'offre + Sticker Lien Chariow) : Aperçu du pack (Outil mobile & PC + Sauvegarde JSON + Guide de démarrage). Texte : "Disponible dès maintenant ([PRIX DE LANCEMENT] pour les [NOMBRE] premiers). Cliquez sur le lien ci-dessous pour le télécharger immédiatement :" + [STICKER LIEN CHARIOW].`,
      },
      {
        id: 'bonus-mkt-prompt',
        type: 'prompt-builder',
        title: 'Compilateur d’Adaptation Rapide de la Marketing Library (Bonus 02)',
        description:
          'Choisissez n’importe quel modèle de la bibliothèque ci-dessus et demandez à Claude de le personnaliser intégralement avec le vocabulaire et les données de votre produit.',
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
            placeholder: 'Ex. Le Système de Création Régulière',
            profileBinding: 'productType',
          },
          {
            key: 'mainObjective',
            label: 'Résultat concret produit par l’outil',
            placeholder: 'Ex. Calculer sa capacité réelle et organiser 30 jours de publication en 10 minutes',
            profileBinding: 'mainObjective',
          },
        ],
        template: `<role>
Tu es un Rédacteur Produit Senior spécialisé dans la communication sobre, démonstrative et éthique.
</role>

<context>
- Domaine : {{business}}
- Audience : {{targetAudience}}
- Produit interactif : {{productType}}
- Bénéfice concret : {{mainObjective}}
</context>

<selected_templates>
[COLLEZ ICI LE OU LES MODÈLES DE LA MARKETING LIBRARY QUE VOUS SOUHAITEZ PERSONNALISER :
Ex. 5 structures d'accroches, 1 structure de carrousel, la séquence de 3 emails ou un script de démonstration]
</selected_templates>

<constraints>
- Remplace toutes les variables entre crochets par des exemples précis et réalistes issus de mon domaine.
- N'invente aucun témoignage client, aucun chiffre d'étude imaginaire et ne promets ni viralité ni revenu garanti.
- N'utilise aucun tiret cadratin.
</constraints>`,
      },
    ],
  },
];
