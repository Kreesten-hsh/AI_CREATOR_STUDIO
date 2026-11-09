import type { MarketingLibraryData } from '../../types/marketing';

export const BONUS_MARKETING_DATA: MarketingLibraryData = {
  header: {
    orderNumber: 'Bonus 02',
    title: 'MARKETING LIBRARY',
    subtitle: 'La boîte à outils opérationnelle pour positionner, promouvoir et vendre votre produit numérique.',
    description:
      'Une sélection rigoureuse de 9 Skills IA autonomes, complétée par un prompt universel de recherche concurrentielle et une veille externe. Aucun script complexe requis : chaque ressource est directement exploitable dans Claude ou ChatGPT pour votre propre produit digital.',
    totalResourcesCount: 10,
  },

  categories: [
    { id: 'all', label: 'Toutes les ressources', count: 10 },
    { id: 'strategy', label: 'Stratégie & Psychologie', count: 4 },
    { id: 'copywriting', label: 'Copywriting & Contenu', count: 2 },
    { id: 'visibility', label: 'Visibilité & Profils', count: 2 },
    { id: 'conversation', label: 'Engagement & Conversation', count: 2 },
  ],

  competitivePrompt: {
    id: 'prompt-recherche-concurrentielle',
    title: 'Cartographie de Marché & Analyse Concurrentielle',
    subtitle: 'Prompt Universel pour Claude ou ChatGPT (avec recherche Web activée)',
    badge: 'PROMPT UNIVERSEL PRÊT À L’EMPLOI',
    description:
      'Analysez méthodiquement vos concurrents directs et indirects, décortiquez leurs propositions de valeur, leurs prix et leurs angles marketing, et identifiez les opportunités inexploitées pour différencier votre produit digital.',
    fullPrompt: `<contexte_mission>
Tu agis en tant qu'Analyste Stratégique et Spécialiste en Veille de Marché spécialisé dans les produits numériques (guides, templates, formations, mini-logiciels, ressources pour indépendants).
Ton objectif est de réaliser une étude concurrentielle approfondie et rigoureuse pour mon produit digital.

Informations sur mon produit :
- Nom provisoire (scénario pédagogique fictif) : Pack "Freelance Prospector" (ou remplacez par les données de votre propre produit)
- Format : Pack de 32 modèles Notion + scripts de prospection multicanale + guide de tarification
- Cible : Freelances débutants (développeurs, designers, rédacteurs) qui ont du mal à trouver leurs premières missions sans passer pour des démarcheurs intrusifs
- Hypothèse de prix : 47 € (achat unique, sans abonnement)
- Valeur clé : Passer de l'angoisse de la prospection à une routine quotidienne structurée avec des messages éprouvés.
</contexte_mission>

<instructions_de_recherche>
Si tu disposes de la navigation Web intégrée, utilise-la activement pour examiner les solutions réelles du marché.
Si tu n'as pas accès au Web ou si la recherche est indisponible, préviens-moi immédiatement et demande-moi de te fournir la liste de concurrents ou URLs à analyser plutôt que d'extrapoler des données non vérifiées.

Exécute l'analyse selon les 6 étapes suivantes :

1. IDENTIFICATION DES CONCURRENTS DIRECTS ET INDIRECTS
- Identifie jusqu'à 3 concurrents directs vérifiables (produits numériques similaires, templates, cours payants de prospection pour freelances). Si le marché ne fournit pas 3 acteurs publics documentés, analyse uniquement ceux qui sont vérifiables sans compléter artificiellement avec des acteurs fictifs.
- Identifie jusqu'à 2 concurrents indirects ou solutions de contournement vérifiables (plateformes de freelances, agences de lead-gen, contenu gratuit).

2. ANALYSE COMPARATIVE DES OFFRES (FAITS OBSERVÉS)
Pour chaque acteur identifié :
- Nom et URL de consultation réelle (avec date de consultation).
- Format du produit (ebook, Notion, vidéo, abonnement).
- Prix affiché publiquement (ou modèle économique précis).
- Proposition de valeur principale promise au client.

3. DÉCORTICAGE DU POSITIONNEMENT & ANGLES MARKETING
- Quels sont leurs arguments phares ? (Ex : rapidité, automatisation, volume de leads, posture premium).
- Quels biais cognitifs exploitent-ils ? (Preuve sociale, rareté, urgence, sentiment d'appartenance).

4. ANALYSE DES CRITIQUES, OBJECTIONS ET FRUSTRATIONS PUBLIQUES
- Analyse les retours, avis, commentaires ou discussions publiques disponibles sur les réseaux et forums.
- Quels sont les manques récurrents signalés par les utilisateurs ? (Ex : templates trop rigides, modèles froids impersonnels, contenu trop théorique, outils dépassés).

5. TABLEAU COMPARATIF SYNTHÉTIQUE
Présente une matrice comparative claire avec les colonnes :
| Concurrent | Format | Prix constaté | Promesse clé | Angle dominant | Faiblesse majeure |

6. RECOMMANDATIONS STRATÉGIQUES POUR MON PRODUIT
Sur la base exclusive des données collectées :
- Formule 3 à 5 axes de différenciation concrets et défendables pour mon produit digital.
- Précise quel angle marketing permettra d'éviter la guerre des prix.
- Suggère la formulation exacte de ma proposition de valeur distinctive.
</instructions_de_recherche>

<contraintes_de_fiabilité>
- SOURCES WEB RÉELLES & VÉRIFIABILITÉ : Fournis les liens des sources web réelles consultées avec date d'accès. Sources Web réelles, informations vérifiables et hypothèses clairement séparées.
- OBJECTIF DE RIGUEUR MÉTHODOLOGIQUE : L'absence de données imaginaires constitue un impératif d'exactitude. N'invente aucun concurrent fictif, aucun chiffre d'affaires, aucun avis imaginaire ni aucun faux prix. Si moins d'acteurs sont documentés, limite l'analyse aux données attestées sans remplissage artificiel.
- TRANSPARENCE : Si une information (prix, contenu exact) est indisponible ou masquée derrière un formulaire fermé, signale-la explicitement comme "Non vérifiable publiquement".
- DISTINCTION RIGOUREUSE : Distingue formellement les FAITS VÉRIFIÉS (données brutes affichées), les OBSERVATIONS DE MARCHÉ et tes HYPOTHÈSES / RECOMMANDATIONS.
</contraintes_de_fiabilité>`,
    bestPractices: [
      'Activez la navigation Web dans Claude (Recherche Web) ou ChatGPT (mode Search) pour collecter des sources réelles.',
      'Si un concurrent n’affiche pas ses prix en clair, notez-le : c’est souvent un point de friction que votre produit à tarif transparent (ex: 47 €) peut exploiter.',
      'Examinez les retours négatifs réels trouvés sur les forums ou réseaux : ils constituent des pistes de différenciation majeures par contraste.',
    ],
    reliabilityRules: [
      'Sources Web réelles, informations vérifiables et hypothèses clairement séparées.',
      'Obligation de fournir les liens réels et horodatés des pages consultées.',
      'Signalement systématique des données non vérifiables sans formulaire ou inscription.',
      'Autorisation d’analyser moins de 3 concurrents directs ou 2 indirects sans remplissage artificiel.',
    ],
  },

  externalResource: {
    id: 'ressource-novitckii',
    title: 'Bibliothèque de ressources Novitckii',
    subtitle: 'Curation indépendante de ressources, prompts, skills Claude et workflows IA',
    description:
      'Une sélection externe regroupant des ressources ouvertes autour de l’écosystème IA : prompts avancés, configurations de Skills Claude, systèmes et automatisations pour créateurs. Veille indépendante non auditée par la plateforme AI CREATOR STUDIO.',
    url: 'https://novitckii.com/resources/',
    badge: 'RESSOURCE EXTERNE',
  },

  skills: [
    {
      id: 'skill-marketing-psychology',
      technicalName: 'marketing-psychology',
      title: 'Comprendre la Psychologie d’Achat & Biais Cognitifs',
      category: 'strategy',
      categoryLabel: 'Stratégie & Psychologie',
      shortDescription:
        'Mobilisez les modèles mentaux décisionnels pour comprendre pourquoi les prospects hésitent, comparent et achètent un produit digital.',
      concreteProblem:
        'Les créateurs décrivent souvent les caractéristiques techniques de leur produit numérique au lieu de répondre au travail concret pour lequel le client souhaite « l’engager » (Jobs to Be Done), ce qui génère de l’indifférence et des objections de prix.',
      whenToUse: [
        'Lors de la conception du message de vente avant de rédiger vos premiers contenus promotionnels.',
        'Quand vos prospects trouvent votre produit intéressant mais remettent leur décision d’achat à plus tard.',
        'Pour concevoir des garanties ou des options de packaging sans recourir à une fausse urgence artificielle.',
      ],
      digitalProductScenario: {
        productName: 'Scénario pédagogique fictif : Pack « Freelance Prospector » (47 €)',
        context:
          'Alexandre vend un pack Notion de 32 modèles de prospection. Ses visiteurs lui disent régulièrement « C’est bien fait, mais je peux trouver des templates gratuits sur internet ».',
        execution:
          'En appliquant les modèles Jobs to Be Done et Loss Aversion via ce Skill, Alexandre reformule son offre : il ne vend plus un recueil de modèles, mais une méthode pour structurer sa démarche commerciale et réduire le temps passé chaque semaine devant une page blanche.',
      },
      readyPrompt: {
        mission: 'Analyser les freins psychologiques et reformuler l’angle de valeur d’un produit digital one-off.',
        fullPrompt: `Tu es un expert en psychologie d'achat et en sciences comportementales appliquées au marketing.
J'ai besoin de ton aide pour analyser les freins psychologiques de mes prospects et reformuler la proposition de valeur de mon produit numérique.

Voici les informations sur mon produit :
- Nom (scénario fictif) : Pack "Freelance Prospector"
- Prix : 47 € (paiement unique)
- Format : 32 modèles Notion prêts à l'emploi + matrice de qualification de prospects + guide de relance
- Cible : Développeurs et designers freelances débutants
- Problème ressenti par le prospect : Peur de déranger en prospectant, manque de temps, syndrome de l'imposteur face aux clients
- Objection fréquente : "Je peux trouver des modèles gratuits sur LinkedIn ou ChatGPT"

Mission :
1. Analyse cette situation à travers 4 modèles mentaux clés :
   - Jobs to Be Done (JTBD) : Pour quel travail émotionnel et fonctionnel le client m'engage-t-il vraiment ?
   - Loss Aversion (Aversion à la perte) : Quelle perte concrète (temps, contrats perdus, anxiété) mon produit aide-t-il à limiter ?
   - Anchoring (Effet d'ancrage) : À quoi le prospect compare-t-il les 47 € et comment évaluer cet ancrage en fonction de ses propres paramètres (temps gagné, marge d'une mission) ?
   - Regret Aversion (Réduction du risque) : Comment formuler une réassurance honnête qui désamorce la peur d'un achat inutile ?

2. Fournis 3 formulations concrètes et percutantes de ma promesse principale, en éliminant tout jargon vide.
3. Ne garantis aucun gain de clients et n'invente aucun revenu type. Reste fondé sur une analyse conditionnelle soumise aux données réelles de l'utilisateur.`,
        explanation:
          'Ce prompt guide Claude ou ChatGPT à travers les modèles mentaux structurés pour transformer une offre descriptive en proposition de valeur centrée sur les besoins réels de l’acheteur.',
      },
      expectedResult: {
        summary:
          'Une grille d’analyse conditionnelle des 4 piliers décisionnels invitant l’utilisateur à injecter sa propre marge nette et son temps passé pour calibrer son ancrage de valeur.',
        sampleOutput:
          '• Recadrage Jobs to Be Done : « Le produit ne se positionne pas comme un simple recueil de modèles, mais comme une méthode pour savoir exactement quoi écrire sans hésitation. »\n• Démonstration conditionnelle d’ancrage : « Si votre marge nette sur une mission est par exemple de 500 € et qu’une démarche de relance mieux cadrée vous permet de débloquer une opportunité en attente, le tarif de 47 € se compare au résultat potentiel plutôt qu’à un coût isolé (à adapter selon votre propre taux journalier). »',
      },
      download: {
        fileName: 'marketing-psychology (Archive non distribuée)',
        downloadUrl: '',
        fileSize: 'Non distribué',
        includedFiles: ['marketing-psychology/SKILL.md'],
        isAvailable: false,
        statusNote:
          'Téléchargement de l’archive ZIP indisponible (en attente de clarification des droits de redistribution). Le prompt prêt à l’emploi ci-dessus est utilisable directement sans téléchargement.',
      },
      usageInstructions: {
        quickStart: [
          'Le prompt copiable ci-dessus est utilisable directement dans toute conversation Claude ou ChatGPT sans installation préalable.',
          'Sur Claude : Si la fonctionnalité est disponible, importez une archive ZIP valide via Settings > Capabilities > Skills (contenant le dossier racine et SKILL.md), ou intégrez les consignes dans les documents de projet (Claude Projects) comme contexte.',
          'Sur ChatGPT : Importation native via Plugins > Skills > Create > Upload from your computer (réservée aux comptes éligibles : Business, Enterprise, Healthcare, Edu). Pour les comptes standard, importez le texte comme document de contexte dans un Custom GPT.',
        ],
        compatibilityNotes:
          'Usage textuel direct. Compatible avec tout modèle conversationnel sans installation obligatoire.',
      },
    },

    {
      id: 'skill-pricing',
      technicalName: 'pricing',
      title: 'Fixer et Optimiser le Prix de son Produit Numérique',
      category: 'strategy',
      categoryLabel: 'Stratégie & Psychologie',
      shortDescription:
        'Déterminez le juste palier tarifaire de votre produit numérique vendu à l’unité sans le brader ni paralyser vos acheteurs.',
      concreteProblem:
        'Beaucoup de créateurs hésitent sur leur tarif initial ou fixent un prix arbitraire sans méthodologie, risquant soit de dévaloriser leur travail, soit de créer un point de blocage à l’achat.',
      whenToUse: [
        'Lors du choix du prix de lancement initial d’un pack, template ou ressource numérique.',
        'Pour structurer une offre principale et identifier si une option enrichie est pertinente.',
        'Pour définir les critères et métriques observables qui permettront de valider ou réajuster un tarif.',
      ],
      digitalProductScenario: {
        productName: 'Scénario pédagogique fictif : Pack « Freelance Prospector »',
        context:
          'Alexandre hésite entre plusieurs hypothèses tarifaires (19 €, 47 € ou un bundle plus complet) et cherche à comprendre les implications sur la perception de valeur et la rentabilité.',
        execution:
          'En appliquant les méthodes de tarification à la valeur et d’analyse des alternatives, Alexandre formule plusieurs hypothèses de prix unitaires et liste les données concrètes (taux de conversion observés, retours qualitatifs) nécessaires pour trancher.',
      },
      readyPrompt: {
        mission: 'Calibrer la tarification d’un produit numérique vendu à l’unité en formulant plusieurs hypothèses d’évaluation.',
        fullPrompt: `Tu es un conseiller expert en stratégie de prix et en monétisation de produits digitaux vendus à l'unité.
Je souhaite évaluer plusieurs hypothèses de prix pour mon produit numérique one-off (sans abonnement récurrent).

Voici les caractéristiques de mon offre :
- Type de produit : Pack de modèles de prospection Notion + fiches méthodologiques prêtes à l'emploi
- Coût marginal de distribution : Quasiment nul (produit numérique téléchargeable)
- Alternative gratuite du client : Recherche dispersée sur YouTube ou rédaction sans méthode
- Alternative payante du client : Formations longues ou accompagnement personnalisé
- Profil client visé : Freelances débutants soucieux de leurs dépenses mais ayant un besoin concret d'organisation
- Hypothèses de prix envisagées :
  • Hypothèse A : 19 € (achat d'impulsion)
  • Hypothèse B : 47 € (offre standard à la valeur)
  • Hypothèse C : 97 € (bundle enrichi avec bonus d'application)

Mission :
1. Analyse les avantages, risques et signaux perçus pour chacune de ces 3 hypothèses.
2. Détaille les informations indispensables et les critères d'observation (taux de conversion sur un premier échantillon, retours qualitatifs, panier moyen) requis pour trancher de manière objective.
3. Reste rigoureusement concentré sur la vente d'un produit numérique individuel : n'inclus aucune métrique SaaS (exclus formellement MRR, churn mensuel, ARPU et tarification par siège).`,
        explanation:
          'Ce prompt explore plusieurs hypothèses tarifaires de façon neutre et méthodique, en se concentrant sur les produits numériques vendus à l’unité.',
      },
      expectedResult: {
        summary:
          'Une analyse comparative de plusieurs hypothèses tarifaires avec les critères de validation et les signaux qualitatifs nécessaires pour ajuster le tarif.',
        sampleOutput:
          '• Hypothèse 19 € : Facilite la décision initiale mais exige un volume de trafic important et risque d’associer le produit à une simple ressource d’appoint.\n• Hypothèse 47 € : Positionnement équilibré pour un ensemble structuré d’outils prêts à l’emploi, à tester sur un échantillon de 100 à 200 visiteurs ciblés.\n• Hypothèse Bundle (ex: 80-97 €) : Pertinente si vous disposez de compléments à forte valeur ajoutée (simulateurs personnalisables, guides avancés) pour augmenter le panier moyen.',
      },
      download: {
        fileName: 'pricing (Archive non distribuée)',
        downloadUrl: '',
        fileSize: 'Non distribué',
        includedFiles: [
          'pricing/SKILL.md',
          'pricing/references/pricing-models.md',
          'pricing/references/pricing-page-teardown.md',
          'pricing/references/research-methods.md',
          'pricing/references/tier-structure.md',
        ],
        isAvailable: false,
        statusNote:
          'Téléchargement de l’archive ZIP indisponible (en attente de clarification des droits de redistribution). Le prompt d’évaluation tarifaire ci-dessus est utilisable immédiatement.',
      },
      usageInstructions: {
        quickStart: [
          'Le prompt prêt à l’emploi est utilisable directement dans Claude ou ChatGPT pour évaluer vos options de prix.',
          'Sur Claude : Si vous utilisez le dossier de référence, importez le dossier racine avec SKILL.md et son sous-dossier references/ via Settings > Capabilities > Skills, ou déposez-les comme documents de contexte dans un projet Claude.',
          'Sur ChatGPT : Importation native de Skill pour les espaces éligibles (Business/Enterprise/Edu/Healthcare) ou ajout de SKILL.md comme document de contexte dans un Custom GPT.',
        ],
        compatibilityNotes:
          'Note pédagogique : Cette ressource provient d’un cadre d’ingénierie de prix SaaS. Pour notre contexte de produit digital vendu à l’unité, appliquez en priorité les concepts de valeur perçue, d’ancrage et de packaging, et ignorez les métriques SaaS pures (MRR, churn mensuel).',
      },
      specificNotice:
        'Adapté aux produits numériques vendus à l’unité. Les métriques d’abonnement SaaS (churn mensuel, MRR, coût par siège) sont formellement exclues du périmètre d’analyse.',
    },

    {
      id: 'skill-humanizer',
      technicalName: 'humanizer',
      title: 'Éliminer les Tics IA & Humaniser son Style',
      category: 'copywriting',
      categoryLabel: 'Copywriting & Contenu',
      shortDescription:
        'Détectez et supprimez les 26 tics d’écriture artificielle pour produire des textes marketing authentiques et vivants.',
      concreteProblem:
        'Les textes générés sans filtre par les modèles de langage sont immédiatement repérables : tournures théâtrales, listes forcées en trois points, oppositions artificielles (« pas seulement X mais Y ») et avalanche de tirets cadratins, ce qui décrédibilise l’auteur.',
      whenToUse: [
        'Pour relire et assainir la page de présentation ou l’annonce de lancement de votre produit digital.',
        'Quand vos emails ou publications sur les réseaux sociaux semblent sonner comme un communiqué corporatif creux.',
        'Pour préserver votre voix d’auteur personnelle tout en profitant de l’assistance de l’IA.',
      ],
      digitalProductScenario: {
        productName: 'Scénario pédagogique fictif : Pack « Freelance Prospector »',
        context:
          'Alexandre a demandé à ChatGPT d’écrire l’annonce de son pack. Le texte obtenu commence par « À l’ère du numérique, trouver des clients est devenu un voyage semé d’embûches. Ce pack n’est pas seulement un outil, c’est une révolution... ».',
        execution:
          'En soumettant ce brouillon au Skill humanizer, Alexandre supprime l’emphase ronflante et obtient un texte franc et direct : « Si vous passez du temps à hésiter chaque fois que vous devez envoyer un devis ou relancer un prospect, voici 32 messages concrets pour structurer vos échanges. »',
      },
      readyPrompt: {
        mission: 'Auditer et humaniser un texte marketing en éradiquant les 26 marqueurs d’écriture artificielle.',
        fullPrompt: `Tu es un réviseur éditorial intransigeant utilisant la méthodologie Humanizer (basée sur l'analyse des signes d'écriture IA).
Ta mission est de réécrire le texte de vente ci-dessous pour qu'il sonne comme un texte écrit par un être humain rigoureux et direct.

Voici mon brouillon actuel :
"""
À l'ère où le travail indépendant redéfinit le paysage professionnel, prospecter n'est pas seulement une nécessité, c'est un véritable art. Il est crucial de noter que beaucoup de freelances abandonnent face à l'adversité. Notre pack n'est pas simplement un ensemble de templates ; c'est le catalyseur de votre succès futur. Plongeons dans ses fonctionnalités : innovation, sérénité et efficacité — chaque modèle témoigne de notre engagement envers l'excellence.
"""

Directives de réécriture strictes :
1. Supprime les oppositions artificielles "pas seulement X, mais Y" et les introductions théâtrales ("À l'ère de...", "Plongeons dans...").
2. Élimine les listes de trois termes abstraits ("innovation, sérénité et efficacité") et le vocabulaire creux ("catalyseur", "témoigne de", "paysage professionnel").
3. Remplace chaque tiret cadratin ou tiret double par une virgule ou un point net.
4. Ne fabrique aucun chiffre inventé ni fausse promesse miraculeuse.
5. Produis une version finale épurée, naturelle, percutante, prête à être lue à voix haute.`,
        explanation:
          'Ce prompt force l’IA à appliquer les filtres anti-slop pour transformer une prose boursouflée en message clair, sobre et crédible.',
      },
      expectedResult: {
        summary:
          'Un texte révisé débarrassé de tout artifice, au rythme varié et au ton conversationnel professionnel.',
        sampleOutput:
          '« Trouver des missions quand on débute en freelance est souvent intimidant : on hésite sur chaque phrase et on passe du temps à réécrire le même message. Ce pack rassemble 32 modèles concrets et personnalisables pour contacter vos prospects poliment, les relancer au bon moment et obtenir des réponses claires sans insister lourdement. »',
      },
      download: {
        fileName: 'humanizer.zip',
        downloadUrl: '/downloads/skills/humanizer.zip',
        fileSize: '13.7 Ko',
        includedFiles: ['humanizer/SKILL.md', 'humanizer/LICENSE'],
        isAvailable: true,
        licenseInfo:
          'Licence open-source MIT — Copyright (c) 2025 Siqi Chen (https://github.com/blader/humanizer). Les 26 patterns et marqueurs d’écriture s’inspirent des travaux de Wikipedia: Signs of AI writing, maintenu par WikiProject AI Cleanup.',
      },
      usageInstructions: {
        quickStart: [
          'Le prompt copiable fonctionne directement dans n’importe quelle session de chat.',
          'Pour importer le Skill : Téléchargez l’archive humanizer.zip.',
          'Sur Claude : Importation du ZIP via Settings > Capabilities > Skills, ou ajout de SKILL.md dans les documents de projet.',
          'Sur ChatGPT : Importation de l’archive pour les comptes éligibles (Business/Enterprise/Edu/Healthcare) via Plugins > Skills > Create, ou dépôt de SKILL.md comme contexte dans un Custom GPT.',
        ],
        compatibilityNotes:
          'Distribué sous licence MIT d’origine (Copyright 2025 Siqi Chen). Intègre les 26 marqueurs d’écriture artificielle.',
      },
    },

    {
      id: 'skill-prompt-engineering',
      technicalName: 'prompt-engineering',
      title: 'Structurer des Prompts Marketing Précis et Reproductibles',
      category: 'strategy',
      categoryLabel: 'Stratégie & Psychologie',
      shortDescription:
        'Maîtrisez la décomposition structurée, les critères explicites et les contraintes pour obtenir des réponses marketing précises et réduire significativement les risques d’imprécision et de digression.',
      concreteProblem:
        'Des requêtes vagues (« fais-moi un bon texte pour vendre mon guide ») génèrent des résultats tièdes et génériques, obligeant l’utilisateur à multiplier les relances sans cadrage méthodologique.',
      whenToUse: [
        'Pour créer vos propres générateurs de contenus ou d’idées dans un assistant IA.',
        'Lorsque vous devez confier à l’IA une tâche marketing complexe demandant une décomposition étape par étape.',
        'Pour imposer un format de sortie strict (balises, structure délimitée, critères explicites) sans bavure.',
      ],
      digitalProductScenario: {
        productName: 'Scénario pédagogique fictif : Pack « Freelance Prospector »',
        context:
          'Alexandre souhaite générer 5 idées d’angles d’approche originaux pour promouvoir son pack auprès des développeurs freelances sur les réseaux.',
        execution:
          'Au lieu d’un prompt basique, il décompose sa demande avec une structure claire : rôle précis, délimitation contextuelle par balises, contraintes négatives explicites et critères de synthèse. L’IA lui livre 5 angles ciblés directement exploitables.',
      },
      readyPrompt: {
        mission: 'Construire un métaprompt structuré en appliquant la décomposition méthodique des tâches.',
        fullPrompt: `Tu es un expert en ingénierie de prompts et en architecture d'instructions pour grands modèles de langage.
Applique les principes de décomposition structurée des tâches complexes en français (assignation de rôle, délimitation contextuelle par balises, contraintes négatives, formatage explicite) pour transformer l'instruction suivante en un prompt de haut niveau.

Instruction de départ :
"Donne-moi des idées pour promouvoir mon pack de prospection freelance."

Informations à injecter dans la structure :
- Rôle : Conseiller marketing spécialisé dans les micro-produits digitaux
- Cible : Freelances débutants soucieux de ne pas paraître intrusifs
- Produit : Pack "Freelance Prospector" (47 €, 32 modèles Notion)
- Contraintes négatives : Zéro cliché ("révolutionnaire", "incontournable"), zéro invention de chiffres, pas de conseils génériques
- Format de sortie attendu : Synthèse des étapes, des critères retenus et des justifications utiles, suivie de 5 angles distincts présentés avec [Titre d'accroche], [Problème visé], [Contre-pied adopté], [Appel à l'action sobre]

Livre le prompt final complet, prêt à être copié-collé par un créateur dans son assistant IA.`,
        explanation:
          'Ce prompt mobilise la décomposition structurée pour passer d’une demande floue à une armature technique rigoureuse avec critères de synthèse explicites.',
      },
      expectedResult: {
        summary:
          'Un prompt calibré intégrant balises explicites, critères de synthèse et consignes de formatage garantissant un résultat rigoureux.',
        sampleOutput:
          'Le modèle génère une structure avec balises explicites (`<contexte>`, `<mission>`, `<contraintes>`, `<format_attendu>`) et une synthèse des critères retenus, prête à être injectée dans tout assistant conversationnel.',
      },
      download: {
        fileName: 'prompt-engineering (Archive non distribuée)',
        downloadUrl: '',
        fileSize: 'Non distribué',
        includedFiles: ['prompt-engineering/SKILL.md'],
        isAvailable: false,
        statusNote:
          'Téléchargement de l’archive ZIP indisponible (en attente de clarification des droits de redistribution). Le prompt de structuration ci-dessus est directement utilisable.',
      },
      usageInstructions: {
        quickStart: [
          'Le prompt copiable ci-dessus est utilisable directement dans tout assistant IA.',
          'Consultez la grille de décomposition structurée, de contextualisation par balises et de contraintes négatives.',
          'Sur Claude et ChatGPT : Utilisez les balises pour délimiter les données d’entrée du format de sortie attendu.',
        ],
        compatibilityNotes:
          'Universel. La décomposition structurée et les balises sont parfaitement interprétées par l’ensemble des grands modèles actuels.',
      },
    },

    {
      id: 'skill-antislop-copywriting',
      technicalName: 'antislop-copywriting',
      title: 'Rédiger des Textes de Vente sans Clichés ni Slop IA',
      category: 'copywriting',
      categoryLabel: 'Copywriting & Contenu',
      shortDescription:
        'Concevez des textes de vente nets, factuels et persuasifs en bannissant les promesses creuses et le vocabulaire corporate.',
      concreteProblem:
        'Le copywriting d’intelligence artificielle souffre d’une inflation permanente de superlatifs (« découvrez la puissance inégalée de... ») qui détruit instantanément la crédibilité d’un produit payant.',
      whenToUse: [
        'Lors de la rédaction des puces descriptives et de l’argumentaire de votre produit digital.',
        'Pour rédiger des emails promotionnels qui ne déclenchent pas le filtre mental anti-spam de vos lecteurs.',
        'Pour remplacer des allégations de confiance invérifiables (« utilisé par des milliers de personnes ») par des faits concrets.',
      ],
      digitalProductScenario: {
        productName: 'Scénario pédagogique fictif : Pack « Freelance Prospector »',
        context:
          'Alexandre doit rédiger la section détaillant les 32 modèles de son pack. Son premier jet annonce fièrement « Un système révolutionnaire de premier plan plébiscité par les experts ».',
        execution:
          'Grâce aux règles d’antislop-copywriting, Alexandre remplace cette phrase par la description exacte de ce que l’apprenant reçoit : « 32 modèles organisés par situation : 8 prises de contact sur LinkedIn, 6 relances post-devis, 10 messages après recommandation et 8 réponses aux demandes de réduction tarifaire. »',
      },
      readyPrompt: {
        mission: 'Rédiger une section de présentation factuelle et percutante pour un produit numérique sans aucun cliché IA.',
        fullPrompt: `Tu es un copywriter d'élite respectant les règles strictes d'antislop-copywriting.
Je veux que tu rédiges la présentation du contenu de mon produit digital.

Informations sur le produit :
- Nom (scénario fictif) : Pack "Freelance Prospector"
- Prix : 47 €
- Contenu réel :
  • 32 modèles Notion copiables en un clic
  • 4 scénarios complets (premier contact, relance polie après silence, négociation de budget, demande de recommandation)
  • 1 guide de 12 pages sur la détection des demandes d'informations non sérieuses
  • 1 grille de calcul Notion pour définir son taux journalier minimum

Règles de rédaction obligatoires :
1. Interdiction absolue des buzzwords d'IA : pas de "débloquez", "révolutionnaire", "inégalé", "paysage", "catalyseur", "jeu d'enfant", "voyage".
2. Ne fabrique AUCUN chiffre de taux de réussite, aucun avis d'expert anonyme ("les observateurs s'accordent à dire..."), aucun faux nombre d'utilisateurs.
3. Chaque phrase doit nommer concrètement son acteur et son action.
4. Rédige un titre sobre et 4 descriptions courtes et précises du contenu.`,
        explanation:
          'Ce prompt active les filtres anti-slop pour obtenir un argumentaire commercial honnête, dense en information et respectueux de l’acheteur.',
      },
      expectedResult: {
        summary:
          'Une description limpide, sans superlatif, mettant en valeur la clarté et l’utilité pratique du livrable.',
        sampleOutput:
          '« Ce que contient le pack :\n• 32 modèles rédigés pour des situations réelles : du premier contact froid à la relance post-devis sans insister.\n• 4 parcours pas-à-pas pour savoir quel message envoyer selon la réaction du prospect.\n• Une méthode de 12 pages pour identifier rapidement les demandes de devis non qualifiées.\n• Une grille Notion pour calculer votre taux journalier sans brader votre travail. »',
      },
      download: {
        fileName: 'antislop-copywriting.zip',
        downloadUrl: '/downloads/skills/antislop-copywriting.zip',
        fileSize: '31.6 Ko',
        includedFiles: [
          'antislop-copywriting/SKILL.md',
          'antislop-copywriting/antislop.md',
          'antislop-copywriting/LICENSE',
        ],
        isAvailable: true,
        licenseInfo:
          'Licence open-source MIT — Copyright (c) 2026 Miqdad Badjuber. Inclut obligatoirement son fichier compagnon maître antislop.md.',
      },
      usageInstructions: {
        quickStart: [
          'Le prompt prêt à copier fonctionne immédiatement sans installation de Skill.',
          'Pour importer le Skill complet : Téléchargez l’archive antislop-copywriting.zip qui inclut obligatoirement antislop.md et la licence MIT.',
          'Sur Claude : Importez l’archive ZIP via Settings > Capabilities > Skills, ou déposez SKILL.md et antislop.md dans les fichiers de connaissances de votre projet.',
          'Sur ChatGPT : Importation de l’archive pour les espaces éligibles (Business/Enterprise/Edu/Healthcare) ou ajout des deux fichiers comme contexte documentaire dans un Custom GPT.',
        ],
        compatibilityNotes:
          'Nécessite obligatoirement son noyau compagnon antislop.md pour fonctionner avec la totalité de ses règles.',
      },
      specificNotice:
        'Ressource avancée de copywriting. L’archive ZIP inclut impérativement son noyau compagnon antislop.md ainsi que la licence MIT originale (Copyright 2026 Miqdad Badjuber).',
    },

    {
      id: 'skill-ig-profile',
      technicalName: 'ig-profile',
      title: 'Transformer son Profil Instagram en Écran de Décision',
      category: 'visibility',
      categoryLabel: 'Visibilité & Profils',
      shortDescription:
        'Auditez et optimisez chaque élément de votre profil Instagram pour convertir les visiteurs de passage en acheteurs de votre produit.',
      concreteProblem:
        'Le profil Instagram est trop souvent conçu comme une autobiographie vague. Si un visiteur ne comprend pas immédiatement ce que vous résolvez et pour qui, il repart sans explorer votre offre.',
      whenToUse: [
        'Avant de lancer la promotion de votre produit digital sur Instagram.',
        'Quand vos publications ou stories attirent des visites sur votre profil mais que votre lien n’est pas consulté.',
        'Pour exploiter le champ nom pour le référencement interne de la recherche Instagram.',
      ],
      digitalProductScenario: {
        productName: 'Scénario pédagogique fictif : Pack « Freelance Prospector »',
        context:
          'Le profil d’Alexandre affiche actuellement son nom seul en titre (« Alexandre D. »), une bio disant « Passionné de tech, café & freelance life ☕ » et un arbre à liens avec 6 boutons différents.',
        execution:
          'En s’appuyant sur les critères qualitatifs de rubric.json (champ nom indexé, bio orientée vers le problème résolu, destination unique du lien et sélections d’épinglés), Alexandre restructure son profil pour mettre en avant sa méthode de prospection.',
      },
      readyPrompt: {
        mission: 'Évaluer un profil Instagram selon les critères de rubric.json et réécrire les éléments prioritaires.',
        fullPrompt: `Tu es un expert en optimisation de profils Instagram orientés conversion, appliquant la grille d'évaluation qualitative du Skill ig-profile (rubric.json).
Je te fournis les éléments actuels de mon compte Instagram. Analyse-les méthodiquement selon les critères du Skill, puis propose la réécriture prioritaire pour valoriser mon produit digital.

Mon profil actuel :
- Nom d'utilisateur (handle) : @alex_freelance
- Nom affiché (Name field) : Alexandre D.
- Bio actuelle : "Freelance indépendant 🚀 Partage mes astuces au quotidien. Le café d'abord ☕ DM ouverts !"
- Lien : un lien vers un agrégateur avec 5 boutons
- Épinglés : aucune publication épinglée
- Highlights : 2 bulles ("Voyages", "Mood")

Mon produit à mettre en valeur (scénario fictif) :
- Pack "Freelance Prospector" (47 €, 32 modèles Notion pour trouver des missions)

Consignes :
1. Évalue qualitativement chaque élément selon les critères : pertinence du champ nom pour la recherche, clarté de la promesse en première ligne de bio, pertinence des highlights, lisibilité des couvertures de grille et clarté de la destination du lien unique.
2. Propose 3 options pour le champ Nom (30 caractères max, intégrant les mots clés recherchés par ma cible).
3. Rédige une bio en 150 caractères maximum qui nomme clairement qui j'aide et quel résultat concret j'apporte.
4. Indique les 3 sujets indispensables pour les 3 publications épinglées.`,
        explanation:
          'Ce prompt demande une évaluation qualitative structurée selon les critères du Skill, suivie des réécritures immédiates pour convertir un profil vitrine en écran de décision clair.',
      },
      expectedResult: {
        summary:
          'Une évaluation qualitative structurée selon la grille rubric.json, pointant les éléments à fort impact (champ nom indexé, bio orientée résultat, lien direct).',
        sampleOutput:
          '• Diagnostic qualitatif : Champ nom non optimisé pour la recherche, bio descriptive sans mention du bénéfice client, liens multiples dispersant l’attention.\n• Champ nom recommandé : « Alex | Prospection Freelance » (29 car., indexable dans la recherche Instagram)\n• Bio réécrite (141 car.) : « J’aide les freelances débutants à structurer leurs démarches de prospection sans message intrusif. 32 modèles prêts à l’emploi 👇 »\n• Lien unique : URL directe vers la page de présentation du pack.',
      },
      download: {
        fileName: 'ig-profile (Archive non distribuée)',
        downloadUrl: '',
        fileSize: 'Non distribué',
        includedFiles: ['ig-profile/SKILL.md', 'ig-profile/rubric.json'],
        isAvailable: false,
        statusNote:
          'Téléchargement de l’archive ZIP indisponible (en attente de clarification des droits de redistribution). La grille d’évaluation et le prompt ci-dessus sont utilisables directement.',
      },
      usageInstructions: {
        quickStart: [
          'Le prompt copiable est utilisable directement dans toute conversation pour auditer un profil.',
          'Cette ressource s’appuie sur sa grille de critères rubric.json.',
          'Sur Claude : Importation de l’archive via Settings > Capabilities > Skills si disponible, ou dépôt de SKILL.md et rubric.json comme documents de contexte dans un projet.',
          'Sur ChatGPT : Importation de Skill native pour les espaces éligibles (Business/Enterprise/Edu/Healthcare) ou intégration de SKILL.md et rubric.json dans un Custom GPT.',
        ],
        compatibilityNotes:
          'Nécessite le fichier de grille rubric.json en accompagnement du SKILL.md pour une évaluation complète.',
      },
      specificNotice:
        'Requiert la grille de référence rubric.json pour le calibrage des critères d’évaluation du profil.',
    },

    {
      id: 'skill-li-profile',
      technicalName: 'li-profile',
      title: 'Optimiser son Profil LinkedIn pour Déclencher l’Achat',
      category: 'visibility',
      categoryLabel: 'Visibilité & Profils',
      shortDescription:
        'Transformez votre profil LinkedIn d’un simple CV statique en page de conversion crédible pour votre offre numérique.',
      concreteProblem:
        'La plupart des profils LinkedIn décrivent des historiques de postes au lieu d’expliquer aux prospects quel problème précis le créateur est capable de résoudre pour eux.',
      whenToUse: [
        'Lorsque vous publiez du contenu sur LinkedIn pour faire connaître votre produit numérique.',
        'Pour concevoir une section « Sélection » (Featured) qui dirige efficacement vers votre page de présentation.',
        'Pour rédiger un titre professionnel (Headline) qui interpelle directement votre client idéal.',
      ],
      digitalProductScenario: {
        productName: 'Scénario pédagogique fictif : Pack « Freelance Prospector »',
        context:
          'Sur LinkedIn, le titre d’Alexandre indique « Développeur Full-Stack & Consultant indépendant ». Ses publications attirent des vues, mais les visiteurs de son profil ne savent pas qu’il a conçu un pack méthodologique.',
        execution:
          'Grâce aux principes du Skill li-profile, Alexandre reformule son titre : « Développeur Web | J’aide les indépendants à structurer leur prospection pour obtenir des missions régulières. Créateur du Pack Freelance Prospector. » Sa section Sélection affiche directement un aperçu et le lien vers la ressource.',
      },
      readyPrompt: {
        mission: 'Restructurer les sections clés d’un profil LinkedIn pour positionner un produit numérique.',
        fullPrompt: `Tu es un spécialiste de l'optimisation de profils LinkedIn B2B appliquant les critères du Skill li-profile et de sa grille d'évaluation.
Je souhaite transformer mon profil LinkedIn pour qu'il mette en valeur mon produit digital sans ressembler à un profil de démarchage agressif.

Données actuelles :
- Titre actuel : Développeur Web Indépendant | React & Node.js
- Résumé (About) actuel : "Passionné de technologies depuis 8 ans, j'accompagne les entreprises dans leurs projets numériques..."
- Section Sélection : rien pour l'instant
- Mon produit (scénario fictif) : Pack "Freelance Prospector" (47 €, pack de modèles Notion et scripts pour freelances)

Mission :
1. Propose 3 variantes pour mon titre professionnel (Headline, max 220 caractères) combinant mon métier et la valeur de mon produit digital pour mes pairs.
2. Rédige un résumé (About) en 3 parties courtes :
   - Le problème que rencontrent beaucoup de freelances débutants lors de la prospection.
   - Comment j'ai structuré une démarche méthodologique pour y répondre.
   - Une invitation sobre à découvrir les 32 modèles du pack.
3. Décris précisément ce que je dois placer en élément n°1 de ma section Sélection (Featured).`,
        explanation:
          'Ce prompt guide la refonte des 3 surfaces les plus consultées d’un profil LinkedIn pour diriger l’attention vers l’offre payante.',
      },
      expectedResult: {
        summary:
          'Un titre percutant, un résumé qui explicite la proposition de valeur et un appel à l’action vers la section Sélection.',
        sampleOutput:
          '• Titre recommandé : « Développeur indépendant | J’aide les freelances à structurer leur prospection sans messages intrusifs. Créateur du Pack Freelance Prospector (32 modèles Notion). »\n• Élément Sélection : Un aperçu visuel montrant un exemple de message avant/après avec le lien direct vers la page de commande.',
      },
      download: {
        fileName: 'li-profile (Archive non distribuée)',
        downloadUrl: '',
        fileSize: 'Non distribué',
        includedFiles: ['li-profile/SKILL.md', 'li-profile/rubric.json'],
        isAvailable: false,
        statusNote:
          'Téléchargement de l’archive ZIP indisponible (en attente de clarification des droits de redistribution). Le prompt de restructuration ci-dessus est directement utilisable.',
      },
      usageInstructions: {
        quickStart: [
          'Le prompt copiable fonctionne directement dans n’importe quelle session conversationnelle.',
          'Consultez la grille rubric.json pour analyser la hiérarchie des sections d’un profil LinkedIn.',
          'Sur Claude : Importation de l’archive via Settings > Capabilities > Skills si éligible, ou ajout des fichiers dans les documents de projet.',
          'Sur ChatGPT : Importation de Skill native pour les comptes éligibles (Business/Enterprise/Edu/Healthcare) ou dépôt des fichiers dans un Custom GPT.',
        ],
        compatibilityNotes:
          'Nécessite le fichier rubric.json associé à SKILL.md pour un audit exhaustif des 12 rubriques du profil.',
      },
      specificNotice:
        'S’appuie sur le fichier de référence rubric.json pour le diagnostic structuré du profil LinkedIn.',
    },

    {
      id: 'skill-ig-story',
      technicalName: 'ig-story',
      title: 'Scénariser ses Stories Instagram pour Vendre en DM',
      category: 'conversation',
      categoryLabel: 'Engagement & Conversation',
      shortDescription:
        'Construisez des séquences de stories quotidiennes en 4 à 5 frames qui incitent naturellement vos abonnés à engager la conversation en message privé.',
      concreteProblem:
        'Publier des stories sans structure ou reposter simplement ses posts du fil sans contexte n’apporte que peu d’interactions et ne génère pas de conversations qualifiées.',
      whenToUse: [
        'Pour présenter votre produit digital auprès de vos abonnés existants sans saturer votre fil avec des posts promotionnels.',
        'Pour sonder les besoins réels et objections de votre communauté grâce aux stickers interactifs.',
        'Pour ouvrir des conversations privées naturelles (DM) avec des personnes qui ont manifesté leur intérêt en premier.',
      ],
      digitalProductScenario: {
        productName: 'Scénario pédagogique fictif : Pack « Freelance Prospector »',
        context:
          'Alexandre souhaite parler de son pack à ses abonnés Instagram sans faire un pitch commercial rigide qui ferait chuter ses vues.',
        execution:
          'Il applique la structure en 5 frames du Skill ig-story : Frame 1 (mise en situation sobre), Frame 2 (exemple concret), Frame 3 (explication en une phrase), Frame 4 (sticker sondage), Frame 5 (invitation à répondre pour recevoir le modèle). Plusieurs personnes répondent et engagent l’échange.',
      },
      readyPrompt: {
        mission: 'Scénariser une séquence complète de stories Instagram en 5 frames pour déclencher des conversations d’achat en DM.',
        fullPrompt: `Tu es un créateur spécialisé dans la vente conversationnelle sur Instagram appliquant le Skill ig-story.
Je veux concevoir une séquence de stories pour aujourd'hui afin de susciter l'intérêt pour mon produit numérique.

Mon produit (scénario fictif) :
- Nom : Pack "Freelance Prospector" (47 €)
- Thématique du jour : L'hésitation à relancer un prospect qui n'a pas répondu à un devis
- Règle de base du Skill : L'abonné agit en premier (vote au sticker ou réponse), pas de démarchage non sollicité en DM

Consignes :
1. Rédige une séquence en exactement 5 frames selon la structure imposée :
   - Frame 1 (The Open) : Accroche sous forme de situation concrète ou question directe posée à l'audience
   - Frame 2 & 3 (The Middle) : Le conseil concret ou l'erreur classique démontrée
   - Frame 4 (The Ask) : Un sticker interactif (sondage ou question) facile et rapide à voter
   - Frame 5 (The Close) : L'invitation sobre à répondre un mot-clé pour recevoir la ressource
2. Pour chaque frame, précise : ce qu'on voit à l'écran, le texte affiché, et le sticker utilisé.
3. Formule le message d'accueil exact à envoyer en DM aux personnes qui répondent au sticker.`,
        explanation:
          'Ce prompt structure la séquence narrative exacte pour maximiser la rétention d’écran et générer des interactions qualifiées en message privé.',
      },
      expectedResult: {
        summary:
          'Un script cadre par cadre prêt à publier avec son téléphone, fondé sur une formulation respectueuse et une démarche conversationnelle.',
        sampleOutput:
          '• Frame 1 (Photo bureau) : « Vous arrive-t-il d’hésiter à relancer un prospect qui n’a pas donné suite à un devis depuis plusieurs jours ? »\n• Frame 2 (Texte sur fond sombre) : « Relancer après un silence n’est pas du harcèlement si vous apportez un nouvel élément utile plutôt qu’un simple "Je me permets de vous relancer". »\n• Frame 3 : « La règle des 4 jours : apporter une ressource complémentaire qui enrichit la proposition. »\n• Frame 4 (Sondage) : « Vous avez une proposition en attente en ce moment ? [Oui, j’hésite à relancer] / [Non, tout est calé] »\n• Frame 5 : « Répondez RELANCE et je vous partage la structure de message que j’utilise. »',
      },
      download: {
        fileName: 'ig-story (Archive non distribuée)',
        downloadUrl: '',
        fileSize: 'Non distribué',
        includedFiles: ['ig-story/SKILL.md'],
        isAvailable: false,
        statusNote:
          'Téléchargement de l’archive ZIP indisponible (en attente de clarification des droits de redistribution). Le prompt de scénarisation ci-dessus est utilisable directement.',
      },
      usageInstructions: {
        quickStart: [
          'Le prompt prêt à l’emploi fonctionne directement dans tout assistant IA.',
          'Consultez les recommandations de composition spatiale pour éviter que vos textes ne soient masqués par l’interface Instagram.',
          'Sur Claude et ChatGPT : Utilisez le prompt pour générer vos séquences narratives hebdomadaires.',
        ],
        compatibilityNotes:
          'Aucun outil tiers requis. Les séquences sont conçues pour être publiées directement depuis l’application Instagram.',
      },
    },

    {
      id: 'skill-li-inbox',
      technicalName: 'li-inbox',
      title: 'Trier sa Boîte de Réception LinkedIn & Détecter les Bots',
      category: 'conversation',
      categoryLabel: 'Engagement & Conversation',
      shortDescription:
        'Triez rapidement vos messages et demandes de connexion LinkedIn en 5 catégories pour répondre aux vrais prospects et archiver les spams.',
      concreteProblem:
        'La boîte de réception LinkedIn est souvent encombrée de séquences commerciales automatisées et impersonnelles. Les créateurs perdent du temps à lire ces messages ou laissent dormir des échanges pertinents.',
      whenToUse: [
        'Après avoir publié un contenu promotionnel qui génère un afflux de messages.',
        'Pour repérer rapidement les signaux d’une séquence automatisée (prospection par robot) et l’archiver sans hésitation.',
        'Pour rédiger des réponses soignées et concises aux personnes qui expriment un besoin réel.',
      ],
      digitalProductScenario: {
        productName: 'Scénario pédagogique fictif : Pack « Freelance Prospector »',
        context:
          'Suite à une publication sur la prospection, Alexandre reçoit plusieurs messages privés : questions ciblées, propositions de services automatisées et demandes génériques.',
        execution:
          'En collant le texte de ses messages dans son assistant équipé du Skill li-inbox, l’IA trie les messages en 5 catégories : les séquences automatisées sont archivées rapidement, tandis que les messages pertinents reçoivent une réponse adaptée orientée vers son pack.',
      },
      readyPrompt: {
        mission: 'Analyser et trier un lot de messages LinkedIn entrants, détecter les messages automatisés et rédiger les réponses prioritaires.',
        fullPrompt: `Tu es un gestionnaire de boîte de réception expérimenté appliquant la méthode de triage du Skill li-inbox.
Je vais te coller un lot de messages et demandes de contact reçus sur LinkedIn.

Ta mission :
1. Trie chaque message dans l'une des 5 catégories :
   - LEAD : Personne qui évoque une difficulté que mon produit résout ou demande conseil
   - PEER : Freelance ou pair du même domaine qui souhaite échanger
   - RECRUITER : Proposition de mission ou d'embauche
   - ASK : Demande de conseil gratuit chronophage
   - SPAM : Démarchage automatisé, message générique ("I noticed your profile"), lien direct dès le premier message

2. Donne d'abord le décompte chiffré des messages par catégorie.
3. Pour chaque message classé SPAM, indique le signe révélateur qui indique une démarche automatisée.
4. Rédige le projet de réponse uniquement pour les catégories LEAD et PEER. Les réponses doivent être chaleureuses, concises (2 à 4 phrases) et adaptées à mon offre : le Pack "Freelance Prospector" (47 €).

Voici les messages reçus :
"""
[Colle ici les messages reçus avec le prénom de l'expéditeur]
"""`,
        explanation:
          'Ce prompt permet de trier une boîte de réception LinkedIn avec méthode et de concentrer son énergie sur les conversations authentiques.',
      },
      expectedResult: {
        summary:
          'Une simulation pédagogique de tri d’une boîte de réception fictive, illustrant la catégorisation des messages et la rédaction de réponses personnalisées.',
        sampleOutput:
          'SIMULATION PÉDAGOGIQUE (compte fictif) :\nTotal analysé : 12 messages entrants\n• SPAM (8) : Archivés. Signal récurrent : invitation sans note suivie quelques minutes après d’un lien commercial générique.\n• LEAD (3) : Messages personnalisés abordant une difficulté de prospection, avec proposition de réponse orientée vers le produit.\n• PEER (1) : Échange entre pairs sans visée commerciale immédiate.',
      },
      download: {
        fileName: 'li-inbox (Archive non distribuée)',
        downloadUrl: '',
        fileSize: 'Non distribué',
        includedFiles: ['li-inbox/SKILL.md'],
        isAvailable: false,
        statusNote:
          'Téléchargement de l’archive ZIP indisponible (en attente de clarification des droits de redistribution). Le prompt de tri ci-dessus est utilisable directement.',
      },
      usageInstructions: {
        quickStart: [
          'Le prompt prêt à copier est utilisable directement sans téléchargement de Skill.',
          'Consultez la grille de détection des séquences automatisées dans SKILL.md.',
          'Sur Claude et ChatGPT : Collez régulièrement vos messages entrants dans votre assistant pour traiter vos réponses méthodiquement.',
        ],
        compatibilityNotes:
          'Ne requiert aucun accès ni connexion à votre compte LinkedIn. Le traitement s’effectue entièrement par copier-coller textuel sécurisé.',
      },
    },
  ],
};
