import type { BonusLesson } from '../../types/navigation';
import type { DiagramBlockConfig } from '../../types/course';

export const BONUS_MANYCHAT_META = {
  id: 'bonus-manychat',
  orderNumber: 'Bonus 01',
  title: 'LE SYSTÈME MANYCHAT AUTOMATISÉ AVEC CLAUDE',
  subtitle: 'Capturez et qualifiez vos prospects Facebook Messenger sans coder grâce à Claude Free et ManyChat.',
  duration: '2h 15min',
  description: 'Un mini-cours pratique en 5 leçons pour concevoir avec Claude Free et déployer sur ManyChat un assistant commercial conversationnel sans budget publicitaire obligatoire.',
  keyTopics: [
    'Automatisation conversationnelle sans code',
    'Déclencheur Commentaire Facebook organique',
    'Single Private Reply et Fenêtre des 24 heures Meta',
    'Arbre de qualification et orientation commerciale',
    'Relais humain Live Chat et sécurisation du Handover',
    'Extension Facebook Ads Click-to-Messenger',
  ],
};

// =============================================================================
// RESSOURCES PÉDAGOGIQUES INTÉGRÉES
// =============================================================================

// Schéma officiel du parcours Commentaire → Messenger → Conversion
export const DIAGRAM_PARCOURS_CONVERSION: DiagramBlockConfig = {
  id: 'diagram-manychat-flow',
  type: 'diagram',
  title: 'Parcours Commentaire Facebook → Messenger → Conversion',
  accessibleDescription:
    'Flux séquentiel en 6 étapes : 1. Publication Facebook invitant à commenter un mot-clé. 2. Détection ManyChat et envoi de la réponse privée unique (Single Private Reply sous 7 jours). 3. Interaction volontaire du prospect (clic sur un bouton Messenger ou réponse textuelle) ouvrant la fenêtre officielle des 24 heures Meta. 4. Question de qualification avec boutons Quick Replies (20 caractères maximum, espaces compris) et orientation par branche directe. 5. Présentation de l’offre adaptée avec lien d’action. 6. Conversion finale ou passage de relais humain Live Chat.',
  data: {
    kind: 'flow',
    nodes: [
      {
        id: 'node-post',
        label: '1. Post Facebook',
        description: 'Publication invitant à commenter un mot-clé précis (ex. GUIDE) sous le post.',
        tag: 'Organique (0 €)',
      },
      {
        id: 'node-reply',
        label: '2. Single Private Reply',
        description: 'Réponse privée unique envoyée sous 7 jours. N’ouvre PAS encore la fenêtre 24h.',
        tag: 'Délai 7j max',
      },
      {
        id: 'node-click',
        label: '3. Clic Prospect',
        description: 'Le prospect clique sur un bouton Messenger ou répond : la fenêtre 24h Meta s’ouvre enfin.',
        tag: 'Fenêtre 24h Meta',
      },
      {
        id: 'node-qualif',
        label: '4. Qualification',
        description: 'Question ciblée avec Quick Replies (20 caractères maximum, espaces compris) et orientation par branche directe.',
        tag: 'Orientation Free',
      },
      {
        id: 'node-offer',
        label: '5. Présentation Offre',
        description: 'Message avec lien vers l’offre adaptée au profil identifié.',
        tag: 'Recommandation',
      },
      {
        id: 'node-convert',
        label: '6. Conversion / Relais',
        description: 'Achat en ligne ou transfert au conseiller dans l’Inbox Live Chat.',
        tag: 'Action finale',
      },
    ],
    links: [
      { from: '1. Post Facebook', to: '2. Single Private Reply', label: 'Commentaire mot-clé' },
      { from: '2. Single Private Reply', to: '3. Clic Prospect', label: 'Message privé reçu' },
      { from: '3. Clic Prospect', to: '4. Qualification', label: 'Fenêtre 24h activée' },
      { from: '4. Qualification', to: '5. Présentation Offre', label: 'Réponse rapide choisie' },
      { from: '5. Présentation Offre', to: '6. Conversion / Relais', label: 'Décision prospect' },
    ],
  },
};

// Glossaire officiel des termes ManyChat
export const MANYCHAT_GLOSSARY = [
  {
    term: 'Flow (Flux)',
    definition: 'L’arbre conversationnel visuel complet composé de nœuds et blocs connectés entre eux sur la toile infinie.',
  },
  {
    term: 'Trigger (Déclencheur)',
    definition: 'L’événement externe qui lance automatiquement le flux (ex. commentaire d’un mot-clé sous une publication Facebook).',
  },
  {
    term: 'Single Private Reply',
    definition: 'L’unique message privé autorisé par Meta en réponse à un commentaire Facebook sous 7 jours max. Marqué Comment Reply, il n’ouvre pas la fenêtre 24h sans interaction volontaire.',
  },
  {
    term: '24-Hour Messaging Window',
    definition: 'Fenêtre officielle Meta autorisant les échanges automatisés durant 24 heures suite à une interaction explicite du prospect dans Messenger.',
  },
  {
    term: 'Quick Reply (Réponse Rapide)',
    definition: 'Bouton éphémère suggérant une réponse (limité techniquement à 20 caractères maximum, espaces compris par Meta) qui disparaît dès le clic.',
  },
  {
    term: 'Button (Bouton permanent)',
    definition: 'Bouton persistant fixé sous la bulle de message pouvant ouvrir une URL externe, un appel téléphonique ou un autre bloc.',
  },
  {
    term: 'Tag (Étiquette)',
    definition: 'Marqueur optionnel pour mémoriser un segment sur un contact. Disponible selon le plan ManyChat souscrit (plan Essential/Pro) ; non requis pour le parcours gratuit.',
  },
  {
    term: 'Handover & Live Chat',
    definition: 'Protocole de relais humain regroupé dans un nœud Action pour ouvrir la discussion dans l’Inbox (Mark conversation as Open) et, si le plan le permet, suspendre les flux (Pause all automations).',
  },
];

// Fiche technique sur les 4 catégories de coûts (Vérifié selon documentation officielle ManyChat mise à jour le 29 octobre 2026)
export const MANYCHAT_PRICING_FACTS = [
  {
    category: '1. Abonnement ManyChat',
    details: 'Nouveau modèle tarifaire Free (0 $/mois) : jusqu’à 25 contacts actifs par mois (un contact actif est une personne ayant interagi avec l’activité via ManyChat pendant le mois de facturation), 2 canaux max parmi Messenger, Instagram, TikTok et Telegram, jusqu’à 4 automatisations actives simultanément, 1 utilisateur, 1 siège Inbox et présence de la marque ManyChat dans le premier message. Ce quota mensuel se distingue du plafond historique de 1 000 contacts documenté dans les archives FAQ. Pour vérifier les spécificités et quotas appliqués à votre compte, consultez Settings → Subscription dans votre interface Manychat. Plans supérieurs payants selon grille locale. WhatsApp non inclus en Free. (Vérifié documentation officielle ManyChat 29 octobre 2026).',
    badge: 'Free : 25 contacts actifs/mois',
  },
  {
    category: '2. Budget Publicitaire Meta',
    details: 'Strictement distinct de l’abonnement ManyChat. Zéro euro requis pour le parcours principal organique enseigné (publication Facebook gratuite). Nécessaire uniquement pour l’extension payante Facebook Ads Click-to-Messenger programmée dans Meta Ads Manager.',
    badge: '0 € requis en organique',
  },
  {
    category: '3. Frais de Messagerie Meta',
    details: 'Facebook Messenger : sans frais de messagerie standards pour les échanges d’une Page professionnelle dans la fenêtre habituelle des 24 heures autorisée par Meta (à distinguer de l’abonnement ManyChat et d’éventuelles fonctions payantes avancées). WhatsApp : non inclus dans le plan Manychat Free ; son utilisation nécessite un plan Manychat compatible. Sa tarification s’effectue par message livré (et non par conversation). Les messages modèles sont facturés lorsqu’ils sont délivrés à l’utilisateur selon leur catégorie et le marché de destination. Depuis le 1er octobre 2026, les messages de service délivrés pendant la fenêtre de service client sont également facturés. Chaque numéro WhatsApp Business bénéficie d’une allocation de 1 000 messages de service gratuits par mois calendaire applicable à l’ensemble des pays de destination (à partir du 1 001e message de service, les messages supplémentaires sont facturés). Les messages entrants envoyés par les utilisateurs à l’entreprise sont gratuits, et les messages Marketing, Utility et Service délivrés pendant une fenêtre Free Entry Point ouverte restent gratuits selon les conditions Meta. Consultez le guide officiel et le calculateur Manychat avant d’activer cette extension.',
    badge: 'Messenger sans frais Meta sous 24h',
  },
  {
    category: '4. Outils Tiers Optionnels',
    details: 'Outils d’automatisation externe (Zapier, Make), CRM ou passerelles SMS. Strictement facultatifs : le système fonctionne de bout en bout sans aucun abonnement tiers.',
    badge: 'Facultatif',
  },
];

// Fiche de dépannage rapide des blocages fréquents
export const TROUBLESHOOTING_TIPS = [
  {
    title: 'Problème 1 : ManyChat ne réagit pas lorsque je commente ma publication',
    cause: 'Le commentaire a été publié au nom de la Page elle-même, ou le test a déjà été réalisé une fois par cet utilisateur.',
    solution: 'Le déclencheur requiert un commentaire provenant d’un profil Facebook personnel distinct de l’identité de la Page. Les commentaires publiés au nom de la Page ne déclenchent pas le flux. De plus, en raison des limitations de l’API Meta, le test ne peut être réalisé qu’une seule fois par profil utilisateur : pour retester, utilisez un autre profil personnel ou supprimez les interactions de test précédentes.',
  },
  {
    title: 'Problème 2 : Le bouton Publish dans ManyChat refuse de valider mon flux',
    cause: 'Un bouton, une réponse rapide ou un embranchement n’est relié à aucun bloc suivant (nœud orphelin).',
    solution: 'Parcourez votre toile Flow Builder pour repérer les voyants rouges d’avertissement. Reliez chaque connecteur orphelin à un message ou supprimez les boutons inutilisés.',
  },
  {
    title: 'Problème 3 : Ma Page Facebook n’apparaît pas dans la liste de connexion ManyChat',
    cause: 'Permissions insuffisantes ou rôle non reconnu sur Meta Business Suite.',
    solution: 'Rendez-vous dans Meta Business Suite > Paramètres de la Page > Accès à la Page. Vérifiez que votre profil détient le « Contrôle total » et non un simple accès partiel aux tâches.',
  },
];

// =============================================================================
// LES 5 LEÇONS DU BONUS 01 (3 GRANDES PARTIES ÉDITORIALES PAR PAGE)
// =============================================================================

export const BONUS_MANYCHAT_LESSONS: BonusLesson[] = [
  // ===========================================================================
  // LEÇON 01 — COMPRENDRE ET CONCEVOIR SON SYSTÈME
  // ===========================================================================
  {
    id: 'bonus-manychat-l01',
    lessonNumber: 1,
    title: 'Comprendre et concevoir son système',
    duration: '20 min',
    objective: 'Comprendre les possibilités de ManyChat et identifier une situation commerciale qui justifie une automatisation.',
    deliverable: 'Un plan d’automatisation précisant le problème commercial, le déclencheur, le parcours conversationnel et le résultat attendu.',
    parts: [
      // PARTIE 1
      {
        id: 'bm-l01-p01',
        title: 'Mécanisme Conversationnel & Parcours Messenger',
        subtitle: 'De la publication Facebook à l’action commerciale sans coder',
        blocks: [
          {
            id: 'bm-l01-p01-prose',
            type: 'prose',
            title: 'Le rôle de l’automatisation conversationnelle',
            highlightPill: 'CONVERSION CONVERSATIONNELLE',
            paragraphs: [
              'Une automatisation commerciale réussie ne tente pas d’imiter maladroitement une longue discussion humaine. Son rôle est de guider un prospect intéressé vers une décision claire, en lui apportant immédiatement la bonne ressource ou la bonne réponse sans délai d’attente.',
              'Le mécanisme central repose sur un déclencheur simple et gratuit : un utilisateur commente un mot-clé précis sous une publication Facebook organique de votre Page professionnelle. ManyChat détecte instantanément ce commentaire et lui adresse une réponse privée dans Facebook Messenger.',
            ],
            bullets: [
              'Capture instantanée des prospects chauds au moment exact où leur intérêt est maximal.',
              'Suppression des pertes de contacts causées par des délais de réponse manuelle de plusieurs heures.',
              'Qualification sans friction grâce à des boutons fermés plutôt que de longs formulaires rébarbatifs.',
            ],
          },
          DIAGRAM_PARCOURS_CONVERSION,
          {
            id: 'bm-l01-p01-callout',
            type: 'callout',
            variant: 'tip',
            title: 'Parcours guidé versus Chatbot ouvert',
            content:
              'Ne cherchez pas à construire une intelligence artificielle conversationnelle ouverte capable de répondre à tout. Plus vous proposez de choix fermés (boutons, réponses rapides), plus le prospect avance vite vers votre offre commerciale.',
          },
        ],
        help: {
          tips: [
            'Une seule publication organique et un seul mot-clé suffisent pour valider la rentabilité d’un premier flux.',
            'Facebook Messenger offre des taux d’ouverture généralement supérieurs à 80 %, loin devant les e-mails traditionnels.',
          ],
          frequentMistakes: [
            {
              mistake: 'Vouloir créer un robot encyclopédique qui répond à toutes les questions possibles de l’entreprise.',
              correction: 'Concentrez le flux sur un objectif commercial unique : délivrer un guide, qualifier le besoin et orienter vers l’achat.',
            },
          ],
        },
      },
      // PARTIE 2
      {
        id: 'bm-l01-p02',
        title: 'Diagnostic Commercial avec Claude Free',
        subtitle: 'Identifier les fuites de prospects et sélectionner son premier parcours',
        blocks: [
          {
            id: 'bm-l01-p02-prose',
            type: 'prose',
            title: 'Analyser son activité avant de construire',
            highlightPill: 'DIAGNOSTIC CLAUDE FREE',
            paragraphs: [
              'Avant de manipuler l’interface de ManyChat, vous devez cibler la friction commerciale la plus coûteuse de votre activité : les commentaires sous publications qui restent sans réponse, les demandes de tarifs répétitives ou les prospects qui abandonnent faute d’orientation.',
              'Utilisez Claude Free comme copilote stratégique. Le prompt ci-dessous analyse vos offres, vos clients idéaux et vos goulots d’étranglement pour vous recommander les 3 automatisations les plus rentables.',
            ],
          },
          {
            id: 'bm-l01-p02-copy',
            type: 'copy',
            title: 'Prompt 01 — Diagnostic Commercial ManyChat',
            label: 'PROMPT CLAUDE FREE',
            buttonText: 'Copier le Prompt 01',
            defaultExpanded: false,
            content: `Tu es un expert en marketing direct et automatisation conversationnelle sur Facebook Messenger.

Je souhaite concevoir ma première automatisation commerciale avec ManyChat et Claude Free. Ton rôle est de diagnostiquer mon activité pour identifier la meilleure opportunité d'automatisation.

Pour m'aider, pose-moi d'abord ces 5 questions précises et attends mes réponses :
1. Quelle est ton activité et quelle offre principale souhaites-tu mettre en avant ?
2. Quel est le profil type de tes clients idéaux (débutants, professionnels, particuliers) ?
3. Quelles sont les 3 questions ou demandes de prix que tu reçois le plus souvent ?
4. Où perds-tu le plus de prospects aujourd'hui (commentaires sous publications oubliés, messages privés sans suivi, devis en attente) ?
5. Quel est ton objectif prioritaire pour ce premier système (distribuer un guide gratuit, qualifier des demandes, planifier des appels de conseil, vendre un produit direct) ?

Dès que j'aurai répondu, analyse ma situation et propose-moi :
- Trois scénarios d'automatisation adaptés avec leurs avantages, leurs limites et leur complexité.
- Ta recommandation argumentée sur le parcours le plus simple et le plus rentable pour débuter immédiatement sans budget publicitaire.
- Le problème commercial précis résolu par cette automatisation.`,
          },
        ],
        help: {
          tips: [
            'Répondez précisément aux 5 questions de Claude : plus vos détails métier sont concrets, plus ses recommandations seront adaptées.',
            'Privilégiez un parcours basé sur la remise d’une ressource offerte (guide PDF, checklist, coupon) pour maximiser les commentaires.',
          ],
        },
      },
      // PARTIE 3
      {
        id: 'bm-l01-p03',
        title: 'Cadrage du Plan d’Automatisation & Glossaire',
        subtitle: 'Valider ses paramètres clés et maîtriser le vocabulaire ManyChat',
        blocks: [
          {
            id: 'bm-l01-p03-prose',
            type: 'prose',
            title: 'Les repères indispensables avant l’installation',
            highlightPill: 'CADRAGE STRATÉGIQUE',
            paragraphs: [
              'Ne démarrez jamais la configuration technique sans avoir formalisé votre plan d’action sur papier ou dans vos notes. Ce cadrage servira de cahier des charges direct pour les leçons suivantes.',
              'Familiarisez-vous également avec le vocabulaire technique de ManyChat pour naviguer facilement dans l’interface.',
            ],
          },
          {
            id: 'bm-l01-p03-checklist',
            type: 'checklist',
            title: 'Checklist de Cadrage du Plan d’Automatisation',
            description: 'Validez chaque paramètre avant de passer à l’installation technique :',
            items: [
              {
                id: 'bm-chk-01',
                label: 'Problème commercial ciblé',
                detail: 'Une friction précise est identifiée (ex. délai de réponse trop long sur les demandes de documentation produit).',
              },
              {
                id: 'bm-chk-02',
                label: 'Déclencheur et mot-clé définis',
                detail: 'Le mot-clé de commentaire est court, percutant et sans accent (ex. GUIDE, INFO ou TARIF).',
              },
              {
                id: 'bm-chk-03',
                label: 'Ressource ou offre promise prête',
                detail: 'Le lien vers votre produit, votre guide d’entretien ou votre calendrier de réservation est fonctionnel.',
              },
              {
                id: 'bm-chk-04',
                label: 'Objectif chiffré mesurable',
                detail: 'Un indicateur clair est fixé (ex. générer 15 prospects qualifiés par semaine sans pub).',
              },
            ],
          },
          {
            id: 'bm-l01-p03-glossary',
            type: 'callout',
            variant: 'tip',
            title: 'Repères : Glossaire Essentiel ManyChat',
            content:
              '• Flow : l’arbre conversationnel visuel complet.\n• Trigger : l’événement déclencheur (ex. commentaire sous publication).\n• Single Private Reply : l’unique message privé autorisé par Meta sous 7 jours max (marqué Comment Reply, n’ouvre pas les 24h sans interaction).\n• Fenêtre 24h Meta : la période d’échange libre ouverte au clic Messenger ou à la réponse du prospect.\n• Quick Reply : bouton de réponse rapide éphémère (20 caractères maximum, espaces compris).\n• Tag : marqueur optionnel de segmentation (disponible selon plan, non requis en Free).\n• Live Chat : la boîte de réception Inbox pour reprendre la main manuellement.',
          },
        ],
        help: {
          tips: [
            'Conservez ce cadrage sous les yeux : vous l’utiliserez directement dans la Leçon 03 pour guider la rédaction.',
          ],
        },
      },
    ],
  },

  // ===========================================================================
  // LEÇON 02 — INSTALLER ET CONNECTER MANYCHAT
  // ===========================================================================
  {
    id: 'bonus-manychat-l02',
    lessonNumber: 2,
    title: 'Installer et connecter ManyChat',
    duration: '25 min',
    objective: 'Disposer d’un environnement opérationnel et sécurisé relié à votre Page Facebook professionnelle.',
    deliverable: 'Un compte ManyChat connecté à une Page Facebook professionnelle et au canal Messenger.',
    parts: [
      // PARTIE 1
      {
        id: 'bm-l02-p01',
        title: 'Création de Compte & Cadre Budgétaire Réel',
        subtitle: 'Page professionnelle requise, sécurité des identifiants et coûts vérifiés',
        blocks: [
          {
            id: 'bm-l02-p01-prose',
            type: 'prose',
            title: 'Les prérequis de connexion et la vérité sur les coûts',
            highlightPill: 'SÉCURITÉ & BUDGET',
            paragraphs: [
              'ManyChat se connecte exclusivement à une **Page Facebook professionnelle**. Il est techniquement impossible d’automatiser un profil Facebook personnel en raison des politiques de confidentialité strictes de Meta.',
              'La création du compte s’effectue en vous identifiant via le profil Facebook administrateur de votre Page. L’authentification se fait entièrement dans la fenêtre sécurisée officielle de Meta : vous ne devez jamais communiquer vos identifiants ou mots de passe à Claude ni à un tiers.',
            ],
          },
          {
            id: 'bm-l02-p01-pricing',
            type: 'callout',
            variant: 'important',
            title: 'Cadre Budgétaire Réel — Vérifié Documentation ManyChat 29 Octobre 2026',
            content:
              '1. ManyChat Free : 0 $/mois pour 25 contacts actifs par mois (un contact actif est une personne ayant interagi avec l’activité pendant le mois de facturation), 2 canaux max (Messenger, Instagram, TikTok, Telegram), 4 automatisations actives simultanément, 1 siège Inbox et présence du badge ManyChat dans le premier message. À distinguer de l’ancien modèle historique à 1 000 contacts mentionné dans certaines archives FAQ. Vérifiez les paramètres de votre compte dans Settings → Subscription. Suffisant pour apprendre, expérimenter et tester le parcours principal à faible volume.\n2. Budget Publicitaire Meta : Strictement distinct. 0 € requis pour notre parcours organique sur publication gratuite.\n3. Messagerie Meta : Facebook Messenger s’utilise sans frais de messagerie standards dans la fenêtre des 24 heures autorisée par Meta. WhatsApp n’est pas inclus dans le plan Manychat Free (son utilisation nécessite un plan compatible et une tarification par message livré, avec 1 000 messages de service gratuits par numéro WhatsApp Business et par mois calendaire applicables à tous les pays de destination).\n4. Outils tiers : Totalement facultatifs (aucun compte Zapier ou Make n’est exigé).',
          },
        ],
        help: {
          frequentMistakes: [
            {
              mistake: 'Tenter de connecter un profil Facebook personnel au lieu d’une Page professionnelle.',
              correction: 'Créez gratuitement une Page Facebook professionnelle depuis facebook.com/pages/create si vous n’en avez pas encore.',
            },
          ],
        },
      },
      // PARTIE 2
      {
        id: 'bm-l02-p02',
        title: 'Connexion de la Page Facebook & Messenger',
        subtitle: 'Valider les permissions de messagerie et obtenir le statut Connected',
        blocks: [
          {
            id: 'bm-l02-p02-prose',
            type: 'prose',
            title: 'Liaison officielle dans ManyChat',
            highlightPill: 'CONNEXION OFFICIELLE',
            paragraphs: [
              'Rendez-vous sur manychat.com et cliquez sur Get Started Free. Choisissez l’authentification par Facebook. Sélectionnez votre Page professionnelle dans la liste et accordez l’ensemble des autorisations demandées.',
              'Ces autorisations permettent à ManyChat de lire les commentaires déposés sur vos publications et d’envoyer la réponse privée au nom de votre Page.',
            ],
          },
          {
            id: 'bm-l02-p02-checklist',
            type: 'checklist',
            title: 'Checklist de Connexion Facebook',
            description: 'Vérifiez chaque point d’autorisation dans l’assistant de configuration ManyChat :',
            items: [
              {
                id: 'bm-chk-conn-01',
                label: 'Accès administrateur complet',
                detail: 'Votre profil personnel détient le contrôle total sur la Page ciblée dans Meta Business Suite.',
              },
              {
                id: 'bm-chk-conn-02',
                label: 'Sélection de la Page dans ManyChat',
                detail: 'La Page professionnelle apparaît avec le statut actif et le bouton Connect.',
              },
              {
                id: 'bm-chk-conn-03',
                label: 'Autorisations de messagerie accordées',
                detail: 'Toutes les cases relatives aux messages, commentaires et notifications de Page sont cochées.',
              },
              {
                id: 'bm-chk-conn-04',
                label: 'Voyant vert Connected confirmé',
                detail: 'Dans ManyChat > Settings > Channels, la ligne Facebook Messenger affiche le statut Connected.',
              },
            ],
          },
        ],
        help: {
          tips: [
            'Si votre Page n’apparaît pas dans la liste, vérifiez dans Meta Business Suite que l’authentification à deux facteurs est activée sur votre profil.',
          ],
        },
      },
      // PARTIE 3
      {
        id: 'bm-l02-p03',
        title: 'Découverte du Flow Builder & Composants Visuels',
        subtitle: 'Maîtriser la toile infinie, les déclencheurs et les blocs d’action',
        blocks: [
          {
            id: 'bm-l02-p03-prose',
            type: 'prose',
            title: 'L’environnement visuel de construction',
            highlightPill: 'FLOW BUILDER VISUEL',
            paragraphs: [
              'Le Flow Builder de ManyChat est un éditeur visuel basé sur une toile infinie. Vous construisez vos conversations en reliant des blocs d’action avec votre souris, exactement comme un schéma décisionnel.',
              'Dans le plan gratuit, vous pouvez créer jusqu’à 4 automatisations actives simultanées. C’est amplement suffisant pour déployer votre premier assistant de conversion complet.',
            ],
            bullets: [
              'Triggers (Déclencheurs) : le signal d’entrée qui démarre le parcours (ex. User comments on a post).',
              'Send Message : le bloc qui délivre votre texte dans Messenger, avec ses boutons ou réponses rapides.',
              'Actions : les opérations en coulisses (attribuer un Tag, mettre en pause le bot, basculer vers le Live Chat).',
            ],
          },
          {
            id: 'bm-l02-p03-callout',
            type: 'callout',
            variant: 'tip',
            title: 'Repères d’utilisation du Flow Builder',
            content:
              'Pour naviguer facilement dans l’éditeur visuel : maintenez le clic gauche sur l’espace vide pour déplacer la toile, utilisez la molette pour zoomer ou dézoomer, et cliquez sur n’importe quel bloc pour ouvrir son volet de configuration latéral.',
          },
        ],
        help: {
          tips: [
            'Ne tentez pas d’ajouter des blocs complexes de paiement direct ou d’API externe pour commencer : restez sur l’essentiel.',
          ],
        },
      },
    ],
  },

  // ===========================================================================
  // LEÇON 03 — CRÉER SON PREMIER SYSTÈME DE CONVERSION (CŒUR DU BONUS)
  // ===========================================================================
  {
    id: 'bonus-manychat-l03',
    lessonNumber: 3,
    title: 'Créer son premier système de conversion',
    duration: '35 min',
    objective: 'Construire une automatisation réelle à partir des commentaires Facebook organiques jusqu’à Messenger.',
    deliverable: 'Une automatisation Facebook Commentaire → Messenger fonctionnelle et testée par l’apprenant.',
    parts: [
      // PARTIE 1
      {
        id: 'bm-l03-p01',
        title: 'Déclencheur Commentaire & Règles de Messagerie Meta',
        subtitle: 'Le cas Atelier Botanica, mot-clé GUIDE et le fonctionnement réel de la fenêtre des 24h',
        blocks: [
          {
            id: 'bm-l03-p01-prose',
            type: 'prose',
            title: 'Le cas pratique fil rouge : Atelier Botanica',
            highlightPill: 'CAS PRATIQUE FIL ROUGE',
            paragraphs: [
              'Pour illustrer chaque étape, nous suivons l’entreprise fictive **Atelier Botanica**, spécialisée dans la création de terrariums et kits DIY. Son objectif est de promouvoir son Kit Débutant à 39 €.',
              'Sur sa Page Facebook, elle publie une publication montrant un terrarium réussi avec ce texte d’accroche : *« Envie de créer votre propre écosystème végétal autonome ? Commentez GUIDE sous ce post pour recevoir gratuitement notre fiche complète d’entretien et nos conseils de composition ! »*. Le mot-clé surveillé est **GUIDE**.',
            ],
          },
          {
            id: 'bm-l03-p01-callout',
            type: 'callout',
            variant: 'important',
            title: 'Règles Officielles Meta Messenger : Single Private Reply vs Fenêtre des 24 Heures',
            content:
              'Attention au fonctionnement officiel Meta (Source : help.manychat.com/en/articles/17742196) :\n• Déclencheur sur Page professionnelle : fonctionne exclusivement sur les publications de la Page connectée (les profils personnels, groupes, ainsi que les publications Event, Offer et Job ne sont pas pris en charge). Les commentaires postés au nom de la Page elle-même ne déclenchent aucune réponse, et les commentaires antérieurs à l’activation ne sont pas traités rétroactivement.\n• Single Private Reply (Réponse Privée Unique) : suite au commentaire, ManyChat dispose d’un délai de 7 jours max pour envoyer un seul message privé, explicitement marqué comme réponse à un commentaire (« Comment Reply »).\n• L’envoi de la Single Private Reply N’OUVRE PAS la fenêtre des 24 heures.\n• La fenêtre des 24 heures s’active UNIQUEMENT si le prospect effectue une action volontaire : répondre textuellement dans Messenger ou cliquer sur un bouton poursuivant l’interaction dans Messenger.\n• Règle capitale : un bouton « Open Website » (lien web externe) NE CONSTITUE PAS une interaction ouvrant la fenêtre des 24 heures et ne doit jamais servir de mécanisme d’opt-in.\n• Restriction de test : le déclencheur peut être limité à un seul test par utilisateur/profil selon les contraintes de l’API Facebook.',
          },
        ],
        help: {
          frequentMistakes: [
            {
              mistake: 'Croire qu’un bouton « Open Website » dans la Single Private Reply suffit pour ouvrir la fenêtre de 24 heures.',
              correction: 'Un lien web externe (Open Website) ne compte pas comme interaction Messenger pour Meta. Vous devez utiliser un bouton de type message (Quick Reply ou bouton de flux) qui poursuit l’échange dans Messenger.',
            },
            {
              mistake: 'Penser que l’envoi de la Single Private Reply autorise plusieurs messages de relance automatique.',
              correction: 'Avant l’interaction explicite du prospect dans Messenger, Meta interdit strictement tout second message automatisé.',
            },
          ],
        },
      },
      // PARTIE 2
      {
        id: 'bm-l03-p02',
        title: 'Architecture Conversationnelle avec Claude Free',
        subtitle: 'Transformer son offre en un arbre logique structuré avec le Prompt 02',
        blocks: [
          {
            id: 'bm-l03-p02-prose',
            type: 'prose',
            title: 'Structurer l’arbre de conversation avant la rédaction',
            highlightPill: 'PROMPT 02 ARCHITECTURE',
            paragraphs: [
              'Un flux ManyChat bien conçu suit une arborescence claire : Déclencheur commentaire $\rightarrow$ Réponse publique courtoise $\rightarrow$ Réponse privée avec bouton $\rightarrow$ Clic $\rightarrow$ Question de qualification $\rightarrow$ Recommandation d’offre adaptée $\rightarrow$ Option de relais humain.',
              'Utilisez Claude Free pour formaliser l’arbre exact de votre activité. Le Prompt 02 garantit le respect de la règle Meta des 24 heures et prévoit toutes les branches nécessaires.',
            ],
          },
          {
            id: 'bm-l03-p02-copy',
            type: 'copy',
            title: 'Prompt 02 — Architecture Conversationnelle ManyChat',
            label: 'PROMPT CLAUDE FREE',
            buttonText: 'Copier le Prompt 02',
            defaultExpanded: false,
            content: `Tu es un architecte d'expériences conversationnelles expert en ManyChat et en marketing direct sur Facebook Messenger.

Je veux concevoir l'arborescence complète de mon automatisation Facebook Commentaire -> Messenger.

Voici les données de mon activité :
- Mon activité : [Ex: Atelier Botanica, terrariums et kits DIY pour particuliers]
- Mon offre phare : [Ex: Kit Terrarium Débutant à 39 € comprenant bocal, plantes et terreau]
- La ressource promise sous le post Facebook : [Ex: Guide PDF d'entretien offert]
- Le mot-clé de déclenchement : [Ex: GUIDE]
- Le lien vers mon offre : [Ex: https://mon-site.com/kit-debutant]

Conçois pour moi l'arborescence complète (Flow Tree) en détaillant précisément :
1. Déclencheur : configuration du mot-clé exact et du filtre de publication sur la Page Facebook professionnelle.
2. Réponse publique sous le commentaire : 3 variantes chaleureuses invitant à vérifier ses messages Messenger.
3. Réponse privée initiale (Single Private Reply marquée Comment Reply) : formulation avec bouton interactif Messenger (et non un bouton Open Website qui n'ouvre pas la fenêtre) invitant à déclencher l'ouverture de la fenêtre officielle des 24 heures Meta.
4. Nœud de qualification : la question stratégique posée immédiatement après le premier clic et 3 réponses rapides (Quick Replies de 20 caractères maximum, espaces compris).
5. Branches de recommandation : les 3 parcours personnalisés menant directement à l'offre commerciale adaptée selon le choix (sans dépendance obligatoire aux tags).
6. Option de relais humain : la porte de sortie vers un conseiller dans l'Inbox Live Chat (message de transition rassurant suivi du bloc Action Mark conversation as Open et mise en pause des automatisations si disponible).`,
          },
        ],
        help: {
          tips: [
            'Adaptez les paramètres d’Atelier Botanica à votre propre secteur (consulting, formation, commerce local, artisanat).',
          ],
        },
      },
      // PARTIE 3
      {
        id: 'bm-l03-p03',
        title: 'Rédaction des Messages & Publication ManyChat',
        subtitle: 'Rédiger avec le Prompt 03, respecter la limite des 20 caractères et publier',
        blocks: [
          {
            id: 'bm-l03-p03-prose',
            type: 'prose',
            title: 'Des messages concis orientés vers l’action',
            highlightPill: 'PROMPT 03 RÉDACTION & PUBLISH',
            paragraphs: [
              'Dans Messenger, la concision est la clé. Les pavés de texte découragent la lecture sur smartphone. Les libellés des boutons **Quick Replies** sont quant à eux soumis à une limite technique stricte de **20 caractères maximum, espaces compris** fixée par Meta.',
              'Le Prompt 03 produit l’intégralité des textes prêts à coller dans ManyChat. Une fois vos blocs assemblés, vous vérifiez qu’aucun connecteur n’est orphelin et vous cliquez sur le bouton bleu **Publish**.',
            ],
          },
          {
            id: 'bm-l03-p03-copy',
            type: 'copy',
            title: 'Prompt 03 — Rédaction des Messages Messenger',
            label: 'PROMPT CLAUDE FREE',
            buttonText: 'Copier le Prompt 03',
            defaultExpanded: false,
            content: `Tu es un copywriter d'élite spécialisé dans les messages conversationnels Messenger et l'engagement mobile.

Rédige l'intégralité des messages à copier-coller dans ManyChat pour mon automatisation.

Données de mon projet :
- Entreprise : [Ex: Atelier Botanica]
- Ressource offerte : [Ex: Guide PDF d'entretien de terrarium]
- Offre commerciale : [Ex: Kit Débutant à 39 €]
- Question de qualification : [Ex: Quel est votre niveau en terrarium ?]
- Les 3 options de qualification : [Option A: Débutant / Option B: Expérimenté / Option C: Pour offrir]

Consignes strictes de rédaction :
1. Ton naturel, direct, chaleureux et non robotique.
2. Messages courts et lisibles sur écran de smartphone (recommandation éditoriale de clarté).
3. Règle impérative : tous les libellés de Quick Replies doivent faire 20 caractères maximum, espaces compris (limite technique Meta).
4. Premier message privé (Single Private Reply marqué Comment Reply) : courtois et centré sur la remise de la ressource, avec un bouton interactif Messenger (et non un lien Open Website qui n'ouvre pas la fenêtre) pour déclencher l'ouverture de la fenêtre des 24 heures Meta.
5. Message pour chaque branche : félicitations pour le choix, présentation de l'offre adaptée avec bouton menant au lien du site.
6. Message de relais humain : texte rassurant prévenant qu'un conseiller reprend la discussion dans l'Inbox Live Chat.`,
          },
          {
            id: 'bm-l03-p03-checklist',
            type: 'checklist',
            title: 'Checklist de Publication ManyChat',
            description: 'Contrôlez votre flux dans ManyChat avant de cliquer sur Publish :',
            items: [
              {
                id: 'bm-chk-pub-01',
                label: 'Déclencheur lié au post Facebook',
                detail: 'Le mot-clé GUIDE est renseigné sans faute et configuré pour s’activer sur la publication de la Page.',
              },
              {
                id: 'bm-chk-pub-02',
                label: 'Premier message privé avec bouton d’action',
                detail: 'La Single Private Reply est marquée Comment Reply et contient un bouton interactif Messenger (pas un lien Open Website) pour déclencher la fenêtre 24h.',
              },
              {
                id: 'bm-chk-pub-03',
                label: 'Aucun connecteur orphelin',
                detail: 'Tous les boutons et branches pointent vers une étape valide dans le Flow Builder.',
              },
              {
                id: 'bm-chk-pub-04',
                label: 'Statut Published confirmé',
                detail: 'Le bouton bleu Publish affiche la confirmation verte Content Published sans avertissement rouge.',
              },
            ],
          },
        ],
        help: {
          frequentMistakes: [
            {
              mistake: 'Dépasser la limite de 20 caractères maximum, espaces compris sur une réponse rapide (Quick Reply).',
              correction: 'ManyChat refusera de publier ou tronquera le bouton. Utilisez des libellés ultra-courts (ex. « Débutant », « Pour offrir »).',
            },
          ],
        },
      },
    ],
  },

  // ===========================================================================
  // LEÇON 04 — AUTOMATISER LA QUALIFICATION ET LA CONVERSION
  // ===========================================================================
  {
    id: 'bonus-manychat-l04',
    lessonNumber: 4,
    title: 'Automatiser la qualification et la conversion',
    duration: '30 min',
    objective: 'Construire un assistant commercial complet avec qualification des besoins et relais humain sécurisé.',
    deliverable: 'Un assistant commercial structuré avec plusieurs chemins de conversation et transfert Live Chat maîtrisé.',
    parts: [
      // PARTIE 1
      {
        id: 'bm-l04-p01',
        title: 'Architecture du Menu d’Orientation',
        subtitle: 'Aiguiller les prospects chauds, curieux et demandes spécifiques',
        blocks: [
          {
            id: 'bm-l04-p01-prose',
            type: 'prose',
            title: 'Structurer l’accueil pour réduire les frictions',
            highlightPill: 'ORIENTATION RAPIDE',
            paragraphs: [
              'Lorsqu’un prospect entre dans votre assistant, il a un niveau d’intention variable : certains veulent acheter immédiatement, d’autres souhaitent comparer les prix, et d’autres ont une question spécifique.',
              'Un bon menu d’accueil propose 3 ou 4 options claires pour canaliser immédiatement chaque visiteur vers le parcours qui correspond à son intention.',
            ],
            bullets: [
              '« Découvrir l’offre » : mène directement à la présentation de votre produit ou service phare.',
              '« Obtenir des conseils » : démarre la séquence de qualification pour orienter le visiteur.',
              '« Parler à un humain » : active immédiatement le protocole de relais vers votre équipe.',
            ],
          },
          {
            id: 'bm-l04-p01-callout',
            type: 'callout',
            variant: 'tip',
            title: 'Recommandation d’ergonomie conversationnelle',
            content:
              'Placez toujours l’action d’achat ou de découverte en première position dans vos boutons. Veillez à ce que chaque intitulé respecte la règle de 20 caractères maximum, espaces compris pour éviter toute troncature sur smartphone.',
          },
        ],
        help: {
          tips: [
            'Évitez les menus à plus de 4 boutons : la surcharge de choix provoque l’abandon.',
          ],
        },
      },
      // PARTIE 2
      {
        id: 'bm-l04-p02',
        title: 'Configuration Guidée de la Qualification',
        subtitle: 'Qualifier par branches directes en Free et intégrer les tags en option payante',
        blocks: [
          {
            id: 'bm-l04-p02-prose',
            type: 'prose',
            title: 'Qualifier et orienter sans dépendre des Tags',
            highlightPill: 'PARCOURS FREE SANS TAGS',
            paragraphs: [
              'Le parcours principal ManyChat Free ne dépend d’aucun Tag : chaque réponse rapide (Quick Reply) relie directement le prospect à la branche conversationnelle et à l’offre commerciale adaptées à son choix.',
              'Dans notre cas Atelier Botanica, la question de qualification est : *« Quel est votre niveau en terrarium ? »*. Trois boutons de réponses rapides (20 caractères maximum, espaces compris) sont proposés : *Débutant*, *Expérimenté*, *Pour offrir*. Chaque bouton pointe directement vers un bloc Send Message spécifique présentant l’offre idoine, sans imposer de création d’étiquettes.',
              'Extension payante facultative : la création et l’attribution de Tags (ex. `tag-debutant`, `tag-cadeau`) font partie des fonctionnalités ajoutées par ManyChat à partir du plan Essential. Si vous disposez d’un plan compatible, vous pouvez insérer un bloc Action « Add Tag » sur le connecteur pour segmenter vos contacts dans votre CRM ManyChat. Cette étape reste purement optionnelle.',
            ],
          },
          {
            id: 'bm-l04-p02-copy',
            type: 'copy',
            title: 'Prompt 04 — Configuration Guidée de Qualification',
            label: 'PROMPT CLAUDE FREE',
            buttonText: 'Copier le Prompt 04',
            defaultExpanded: false,
            content: `Tu es un architecte ManyChat expérimenté.

Je veux configurer dans ManyChat un système de qualification et d'orientation commerciale pour mon activité.

Mes données de configuration :
- Activité : [Ex: Atelier Botanica]
- Question de qualification : [Ex: Quel est votre niveau en terrarium ?]
- Les 3 options de réponses rapides (Quick Replies de 20 caractères maximum, espaces compris) :
  * Option 1 : [Ex: Débutant -> orienter vers le Kit Découverte à 39 €]
  * Option 2 : [Ex: Expérimenté -> orienter vers les Plantes rares et accessoires]
  * Option 3 : [Ex: Pour offrir -> orienter vers la Carte Cadeau personnalisée]
- Option de contact humain : [Ex: Bouton "Parler à un conseiller"]

Fournis-moi la procédure de configuration pas à pas dans le Flow Builder de ManyChat :
1. Parcours principal par défaut (compatible 100 % ManyChat Free, sans aucun Tag obligatoire) :
   - Quels blocs Send Message créer et comment connecter directement chaque Quick Reply à sa branche de recommandation dédiée.
   - Comment insérer le lien externe vers l'offre dans chaque message de recommandation.
   - Comment structurer le bouton de relais humain vers l'Inbox Live Chat.
2. Extension conditionnelle facultative (réservée aux comptes avec plan Essential/Pro) :
   - Si mon plan ManyChat supporte la segmentation par étiquettes : comment insérer une action optionnelle "Add Tag" (ex. tag-debutant) sur le connecteur avant le message d'offre, sans bloquer le parcours principal.`,
          },
        ],
        help: {
          tips: [
            'Dans le plan Free, reliez simplement le connecteur de chaque Quick Reply au bloc Send Message de l’offre correspondante : aucune création de Tag n’est exigée pour valider votre parcours.',
          ],
        },
      },
      // PARTIE 3
      {
        id: 'bm-l04-p03',
        title: 'Relais Humain Live Chat & Sécurisation du Handover',
        subtitle: 'Message de transition, actions Inbox groupées et règles d’exécution',
        blocks: [
          {
            id: 'bm-l04-p03-prose',
            type: 'prose',
            title: 'Le protocole de passage de relais sans friction',
            highlightPill: 'LIVE CHAT & HANDOVER',
            paragraphs: [
              'Lorsqu’un prospect demande à parler à un conseiller ou pose une question spécifique, l’automatisation doit céder la place à l’opérateur humain pour éviter que le robot ne réponde par-dessus les messages de l’équipe.',
              'Dans le Flow Builder ManyChat, ce transfert s’articule en une architecture claire : d’abord un message de transition rassurant, puis un nœud Action regroupant les opérations Inbox, sans aucun nœud raccordé après la pause.',
            ],
          },
          {
            id: 'bm-l04-p03-callout',
            type: 'callout',
            variant: 'important',
            title: 'Architecture et règles officielles du relais humain (Flow Builder ManyChat)',
            content:
              '1. Message de transition préalable : envoyez toujours un message texte rassurant prévenant le prospect qu’un conseiller prend le relais (ex. « Un membre de notre équipe vous répond ici très vite ») AVANT le nœud Action.\n2. Nœud Action unique pour la gestion Inbox : raccordez la sortie du message de transition à un seul bloc Action regroupant les opérations.\n3. Action « Mark conversation as Open » (base du parcours gratuit) : l’action Mark conversation as Open marque la discussion comme ouverte dans l’Inbox Manychat afin qu’un conseiller puisse la retrouver et la prendre en charge. Elle définit le statut de la conversation dans l’Inbox et ne constitue pas à elle seule une notification d’alerte.\n4. Action « Pause all automations » (selon plan ManyChat compatible) : configurez cette action dans le MÊME nœud Action si votre plan le propose. Elle suspend les automatisations sur ce contact pour la durée choisie (ex. 60 min ou 24h). Les autres actions du nœud s’exécutent avant que la pause prenne effet. Si cette action n’est pas disponible sur votre compte Free, la relève s’effectue manuellement dans l’Inbox.\n5. Règle absolue du Flow Builder : AUCUN NŒUD ne peut être ajouté après le nœud contenant Pause all automations.\n6. Suivi opérationnel : l’action Mark conversation as Open définit le statut dans l’Inbox sans déclencher d’alerte automatique. Les alertes Notify Admins sont temporairement indisponibles sur Messenger en raison des politiques Meta, et Notify Assignees relève d’un mécanisme distinct de notification par email ou SMS lorsque compatible. Le traitement des demandes de conseil se fait donc directement depuis l’Inbox ManyChat sur ordinateur ou via l’application mobile.',
          },
          {
            id: 'bm-l04-p03-checklist',
            type: 'checklist',
            title: 'Checklist de l’Assistant Commercial',
            description: 'Vérifiez la solidité de votre parcours de qualification avant déploiement :',
            items: [
              {
                id: 'bm-chk-asst-01',
                label: 'Menu d’accueil équilibré',
                detail: 'Le message d’accueil présente les 3 choix principaux de façon lisible et sans jargon.',
              },
              {
                id: 'bm-chk-asst-02',
                label: 'Branches de qualification connectées',
                detail: 'Chaque réponse rapide connecte directement au message d’offre adapté (les Tags restant une extension facultative).',
              },
              {
                id: 'bm-chk-asst-03',
                label: 'Liens de conversion fonctionnels',
                detail: 'Les boutons d’achat ouvrent bien l’URL de votre catalogue ou calendrier.',
              },
              {
                id: 'bm-chk-asst-04',
                label: 'Séquence de relais humain conforme',
                detail: 'Message de transition placé avant le nœud Action regroupant Mark conversation as Open (et pause si disponible), sans aucun bloc raccordé après la pause.',
              },
            ],
          },
        ],
        help: {
          tips: [
            'Sur le plan Free, surveillez l’Inbox ManyChat sur ordinateur ou téléchargez l’application mobile pour répondre en direct aux prospects sans frais additionnels.',
          ],
        },
      },
    ],
  },

  // ===========================================================================
  // LEÇON 05 — TESTER, OPTIMISER ET DÉPLOYER
  // ===========================================================================
  {
    id: 'bonus-manychat-l05',
    lessonNumber: 5,
    title: 'Tester, optimiser et déployer',
    duration: '25 min',
    objective: 'Vérifier la fiabilité du système avec un protocole de test rigoureux et l’adapter à votre activité.',
    deliverable: 'Un système Facebook Messenger documenté, testé et prêt à être utilisé dans votre activité.',
    parts: [
      // PARTIE 1
      {
        id: 'bm-l05-p01',
        title: 'Protocole de Recette Terrain & Dépannage',
        subtitle: 'Tester avec un compte externe distinct et résoudre les erreurs courantes',
        blocks: [
          {
            id: 'bm-l05-p01-prose',
            type: 'prose',
            title: 'La règle d’or de la recette opérationnelle',
            highlightPill: 'RECETTE TERRAIN',
            paragraphs: [
              'Pour tester votre automatisation de commentaire, utilisez un profil Facebook personnel distinct de l’identité de la Page : les commentaires publiés au nom de la Page elle-même ne déclenchent pas le système.',
              'Notez également qu’en raison des limitations de l’API Meta, le test de commentaire ne peut être effectué qu’une seule fois par profil utilisateur. Veillez donc à tester depuis un profil Facebook personnel distinct (le vôtre en tant que profil personnel ou celui d’un proche ou collaborateur) sur une publication standard de la Page professionnelle.',
            ],
          },
          {
            id: 'bm-l05-p01-checklist',
            type: 'checklist',
            title: 'Protocole de Recette Opérationnelle',
            description: 'Réalisez ces 4 tests avec un profil externe pour valider l’automatisation :',
            items: [
              {
                id: 'bm-chk-test-01',
                label: 'Test avec profil personnel distinct de la Page',
                detail: 'Le test est réalisé depuis un profil Facebook personnel distinct de l’identité de la Page, en son nom propre.',
              },
              {
                id: 'bm-chk-test-02',
                label: 'Détection du mot-clé de commentaire',
                detail: 'La publication du mot-clé GUIDE déclenche la réponse publique et la Single Private Reply sous 30 secondes.',
              },
              {
                id: 'bm-chk-test-03',
                label: 'Activation de la fenêtre 24h au premier clic',
                detail: 'Le clic sur le bouton du message privé délivre le guide et débloque la question de qualification.',
              },
              {
                id: 'bm-chk-test-04',
                label: 'Vérification de l’ensemble des branches',
                detail: 'Chaque Quick Reply affiche l’offre adéquate par sa branche dédiée (Tags optionnels selon plan) et le bouton conseiller permet de retrouver la conversation marquée comme ouverte dans l’Inbox Manychat pour la prendre en charge manuellement.',
              },
            ],
          },
          {
            id: 'bm-l05-p01-troubleshoot',
            type: 'callout',
            variant: 'tip',
            title: 'Fiche de Dépannage Rapide des Blocages Fréquents',
            content:
              '• Problème : ManyChat ne réagit pas au commentaire -> Causes possibles : commentaire posté au nom de la Page elle-même (le système requiert un profil personnel distinct de l’identité de la Page) ; test déjà exécuté une fois avec ce profil utilisateur (limitation API Meta à une seule exécution de test par profil) ; restrictions d’âge ou de pays configurées sur la Page empêchant l’accès ; publication de type Event, Offer ou Job (non prises en charge) ; publication effectuée sur un groupe ou profil personnel plutôt qu’une Page professionnelle ; repost ou partage non pris en charge ; ou commentaire antérieur à l’activation du flux (pas de rétroactivité). Solution : commenter depuis un profil Facebook personnel distinct de la Page sur une publication standard de la Page professionnelle, sans restriction bloquante.\n• Problème : La fenêtre de 24h ne s’active pas -> Cause : le premier message utilise un lien externe « Open Website » (qui n’ouvre pas les 24h) ou ne propose pas de bouton Messenger clair. Solution : utiliser un bouton interactif Messenger marqué Comment Reply pour inciter à une réponse ou un clic dans la discussion.\n• Problème : Le bouton Publish refuse de valider -> Cause : bouton ou connecteur orphelin non relié. Solution : supprimer les connecteurs vides signalés en rouge.\n• Problème : Page introuvable dans ManyChat -> Cause : permissions insuffisantes. Solution : vérifier le contrôle total dans Meta Business Suite > Paramètres de la Page.',
          },
        ],
        help: {
          frequentMistakes: [
            {
              mistake: 'Déclarer que le système ne fonctionne pas après avoir commenté au nom de la Page ou avoir répété le test avec le même profil.',
              correction: 'Les commentaires publiés au nom de la Page ne déclenchent pas le flux, et l’API Meta limite le test à une seule exécution par profil utilisateur. Utilisez un profil Facebook personnel distinct de l’identité de la Page.',
            },
          ],
        },
      },
      // PARTIE 2
      {
        id: 'bm-l05-p02',
        title: 'Audit & Optimisation avec Claude Free',
        subtitle: 'Détecter les frictions, vérifier la conformité Meta et optimiser avec le Prompt 05',
        blocks: [
          {
            id: 'bm-l05-p02-prose',
            type: 'prose',
            title: 'La boucle d’optimisation en 5 temps',
            highlightPill: 'PROMPT 05 AUDIT',
            paragraphs: [
              'Une automatisation n’est pas figée : ses performances s’améliorent par retouches successives. ManyChat fournit des statistiques détaillées au-dessus de chaque bloc (nombre d’envois, taux d’ouverture, taux de clics).',
              'Appliquez la méthode d’optimisation en 5 temps : 1. Observer les données $\rightarrow$ 2. Repérer le bloc où les prospects arrêtent de cliquer $\rightarrow$ 3. Comprendre la cause de la friction $\rightarrow$ 4. Modifier un seul paramètre (texte ou bouton) $\rightarrow$ 5. Tester à nouveau.',
            ],
          },
          {
            id: 'bm-l05-p02-copy',
            type: 'copy',
            title: 'Prompt 05 — Audit et Optimisation Conversationnelle',
            label: 'PROMPT CLAUDE FREE',
            buttonText: 'Copier le Prompt 05',
            defaultExpanded: false,
            content: `Tu es un auditeur expert en tunnels conversationnels ManyChat et en conformité Meta Messenger.

Je viens de construire et tester mon automatisation. Voici le descriptif exact de ma configuration :
- Déclencheur : [Ex: Commentaire du mot-clé GUIDE sous la publication Facebook d'Atelier Botanica]
- Single Private Reply : [Colle ici ton premier message Messenger marqué Comment Reply]
- Libellé du bouton initial : [Ex: "Recevoir mon guide" - bouton interactif Messenger (pas un lien Open Website)]
- Question de qualification : [Ex: "Quel est votre niveau en terrarium ?"]
- Libellés des 3 Quick Replies (20 caractères maximum, espaces compris) : [Ex: "Débutant", "Expérimenté", "Pour offrir"]
- Messages des branches et liens d'offre : [Colle ici tes messages de recommandation par branche directe]
- Relais humain : [Ex: Message de transition rassurant -> Bloc Action avec Mark conversation as Open (+ Pause all automations si supportée par le plan, sans aucun bloc raccordé après la pause)]

Analyse rigoureusement ce dispositif et fournis-moi :
1. Diagnostic de conformité Meta : ce flux respecte-t-il scrupuleusement la règle des 24 heures et la Single Private Reply ? Le bouton initial poursuit-il l'échange dans Messenger sans dépendre d'Open Website ? Y a-t-il un risque de blocage ?
2. Audit des règles ManyChat et ergonomie : les Quick Replies respectent-elles la limite stricte de 20 caractères maximum, espaces compris ? Le parcours fonctionne-t-il sans imposer de Tags payants ? Le relais humain est-il correctement configuré sans aucun bloc après la pause et sans Notify Admin sur Messenger ?
3. Détection des frictions : y a-t-il des textes trop longs ou confus qui risquent de faire chuter le taux de clic sur smartphone ?
4. Trois recommandations concrètes d'optimisation : propose 3 modifications textuelles ou structurelles immédiates pour maximiser la conversion vers l'offre finale.`,
          },
        ],
        help: {
          tips: [
            'Attendez d’avoir enregistré au moins 20 commentaires réels avant de procéder à des modifications de votre parcours.',
          ],
        },
      },
      // PARTIE 3
      {
        id: 'bm-l05-p03',
        title: 'Extensions Stratégiques : Publicité Meta Ads & Multi-canaux',
        subtitle: 'Facebook Ads Click-to-Messenger, Instagram, TikTok et WhatsApp',
        blocks: [
          {
            id: 'bm-l05-p03-prose',
            type: 'prose',
            title: 'Élargir la portée de son système conversationnel',
            highlightPill: 'EXTENSIONS PAYANTES & CANAUX',
            paragraphs: [
              'Une fois votre automatisation organique validée et rentable sur publication gratuite, vous pouvez étendre sa portée grâce à la publicité payante et aux canaux complémentaires.',
              'La publicité reste une extension optionnelle : elle nécessite un budget publicitaire distinct à programmer dans Meta Ads Manager.',
            ],
            bullets: [
              'Facebook Ads Click-to-Messenger : l’utilisateur clique sur une publicité Facebook ou Instagram et arrive directement dans Messenger.',
              'Instagram : automatisation des commentaires sous les Reels et publications, ainsi que des réponses aux Stories (compte professionnel requis).',
              'TikTok & WhatsApp : extensions avancées. WhatsApp n’est pas inclus dans le plan Manychat Free et requiert un plan compatible. Sa tarification s’applique par message livré : les messages modèles sont facturés lorsqu’ils sont délivrés selon leur catégorie et leur pays de destination. Depuis le 1er octobre 2026, les messages de service délivrés sous 24h sont également facturés au-delà de l’allocation de 1 000 messages de service gratuits par numéro WhatsApp Business et par mois calendaire applicable à l’ensemble des pays de destination (à partir du 1 001e message, ils sont facturés). Les messages entrants et les messages Marketing, Utility et Service délivrés pendant une fenêtre Free Entry Point ouverte restent gratuits. Consultez le guide officiel et le calculateur Manychat avant d’utiliser cette extension.',
            ],
          },
          {
            id: 'bm-l05-p03-callout',
            type: 'callout',
            variant: 'tip',
            title: 'Déroulement technique de l’extension Facebook Ads Click-to-Messenger',
            content:
              'Procédure officielle documentée (Source : help.manychat.com/en/articles/17742200) :\n1. Dans ManyChat : créez une automatisation avec le déclencheur « User clicks a Facebook Ad ».\n2. Rédigez le message initial Messenger avec au moins un bouton ou une Quick Reply (attention : les variables de personnalisation comme le prénom ne sont pas prises en charge dans le message initial de ce déclencheur).\n3. Publiez impérativement l’automatisation avec « Set Live » (ou Publish) : le flux doit être actif pour être visible dans Meta Ads Manager.\n4. Dans Meta Ads Manager : créez votre campagne avec l’objectif Traffic, Engagement ou Sales.\n5. Dans les paramètres du groupe d’annonces : sélectionnez la destination « Message destinations » et choisissez le bouton d’action « Send Message ».\n6. Dans le volet de création de publicité : sous « Message templates » ou « Chat builders », sélectionnez ManyChat comme application partenaire et choisissez votre flux publié.\n7. Publiez votre campagne publicitaire.\n8. Interaction requise : le prospect qui clique sur la publicité arrive dans Messenger et doit interagir (clic sur un bouton ou réponse) pour devenir un contact ManyChat et déclencher la suite du parcours conversationnel.\n9. Rappel budgétaire : le budget publicitaire est réglé à Meta et reste strictement distinct de votre abonnement ManyChat.',
          },
          {
            id: 'bm-l05-p03-checklist',
            type: 'checklist',
            title: 'Checklist Finale de Déploiement et d’Exploitation',
            description: 'Validez votre dispositif avant son exploitation commerciale continue :',
            items: [
              {
                id: 'bm-chk-dep-01',
                label: 'Flux publié et actif',
                detail: 'Le statut de l’automatisation est Published et le déclencheur de commentaire est enclenché.',
              },
              {
                id: 'bm-chk-dep-02',
                label: 'Publication Facebook en ligne',
                detail: 'Le post Facebook invitant au commentaire GUIDE est visible publiquement sur la Page.',
              },
              {
                id: 'bm-chk-dep-03',
                label: 'Live Chat et suivi Inbox configurés',
                detail: 'Vous consultez régulièrement l’Inbox ManyChat sur ordinateur ou mobile pour prendre le relais des prospects.',
              },
              {
                id: 'bm-chk-dep-04',
                label: 'Indicateurs de suivi prêts',
                detail: 'Vous suivez hebdomadairement les commentaires reçus, les guides distribués et les commandes générées.',
              },
            ],
          },
        ],
        help: {
          tips: [
            'Ne lancez jamais de publicité payante avant d’avoir constaté que votre flux convertit naturellement sur publication gratuite.',
          ],
        },
      },
    ],
  },
];
