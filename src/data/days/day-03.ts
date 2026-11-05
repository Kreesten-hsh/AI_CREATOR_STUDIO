import type { Day } from '../../types/course';

export const day03: Day = {
  id: 'day-03',
  dayNumber: 3,
  sprintId: 'module-01',
  title: 'DÉFINIR SON POSITIONNEMENT ET SA PROMESSE',
  italicTitleWord: 'POSITIONNEMENT',
  objective:
    "Définir pourquoi un acheteur précis choisirait votre offre face aux alternatives qu'il utilise réellement, identifier la différence qui compte pour lui et formuler une promesse de transformation concrète et vérifiable.",
  deliverableSummary:
    'Alternatives réelles, valeur différenciante, positionnement provisoire et promesse vérifiable',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-03-step-1',
      legacyType: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: 'Fondations du positionnement et promesse',
      completionLabel: "Valider l'étape 1 : Comprendre",
      blocks: [
        {
          id: 'day03-step1-context-failure',
          type: 'prose',
          eyebrow: '1.1 FONDATIONS DU POSITIONNEMENT',
          title: "Pourquoi de bons produits échouent lorsqu'ils sont mal positionnés",
          highlightPill: 'Le positionnement comme scène d\'ouverture et contexte de référence',
          paragraphs: [
            "Aux Jours 01 et 02, vous avez identifié le problème à résoudre et cartographié la psychologie de votre acheteur (ses situations, ses frictions, ses déclencheurs et ses critères d'arbitrage). Une question décisive se pose désormais lorsque votre acheteur découvre votre solution : « Pourquoi devrais-je choisir votre offre plutôt que ce que je fais déjà aujourd'hui ? »",
            "Beaucoup de créateurs, d'experts et de formateurs pensent qu'un bon produit se vend tout seul, ou que la solution consiste à empiler des fonctionnalités techniques. D'autres se tournent vers le copywriting agressif et les slogans publicitaires pour masquer une proposition floue.",
            "Comme l'a démontré April Dunford (spécialiste reconnue du positionnement produit et autrice de Obviously Awesome), le positionnement est l'acte de définir le contexte de référence de votre produit. Le positionnement fonctionne exactement comme la scène d'ouverture d'un film : il répond immédiatement aux questions fondamentales de l'acheteur : de quoi s'agit-il, dans quelle catégorie ce produit s'inscrit-il, à quoi dois-je le comparer, et pourquoi est-il supérieur pour une personne dans ma situation ?",
            "Si vous ne définissez pas clairement ce cadre, l'acheteur appliquera ses propres hypothèses par défaut. Et si ces hypothèses sont erronées, votre produit sera jugé trop cher, inadapté ou inutile, même si votre contenu ou votre expertise est remarquable.",
          ],
        },
        {
          id: 'day03-step1-four-distinctions',
          type: 'prose',
          eyebrow: '1.2 DISTINCTIONS CARDINALES',
          title: 'Positionnement, Proposition de valeur, Promesse et Messaging',
          highlightPill: 'Remplacer le verbiage marketing par des paliers de décision rigoureux',
          paragraphs: [
            "Pour construire une offre solide sans tomber dans le verbiage marketing, vous devez maîtriser les distinctions entre quatre notions souvent confondues :",
            "1. Le positionnement n'est pas un slogan (tagline) ni une publicité : Un slogan est une formule courte destinée à capter l'attention. Le positionnement est une décision stratégique interne qui dicte ce que le produit doit contenir et ce qu'il doit exclure.",
            "2. Le positionnement n'est pas du storytelling de marque : Le récit de votre parcours d'expert ou de vos motivations peut humaniser votre communication, mais il n'explique pas à l'acheteur pourquoi votre outil est plus efficace que son vieux tableur ou son guide PDF habituel.",
            "3. La proposition de valeur n'est pas une liste de fonctionnalités : Comme l'enseigne Strategyzer (Value Proposition Design), une fonctionnalité décrit ce que fait l'outil techniquement. La proposition de valeur décrit le bénéfice concret que le client en tire (le soulagement d'une friction ou l'accès à un gain désiré).",
            "4. La promesse de transformation n'est pas une garantie magique de résultat : Une promesse sérieuse engage une responsabilité pédagogique et fonctionnelle. Elle décrit une capacité concrète acquise par l'utilisateur sous réserve qu'il applique la méthode. Elle ne promet jamais un chiffre d'affaires arbitraire ni un succès instantané sans effort.",
          ],
        },
        {
          id: 'day03-step1-dunford-components',
          type: 'prose',
          eyebrow: '1.3 LES 5 COMPOSANTES D\'APRIL DUNFORD',
          title: 'La mécanique séquentielle du positionnement',
          paragraphs: [
            "April Dunford a structuré le positionnement autour de 5 composantes interdépendantes. L'erreur la plus fréquente consiste à partir des fonctionnalités du produit. La démarche rigoureuse part obligatoirement des alternatives concurrentes :",
            "1. Les alternatives concurrentes réelles (Competitive Alternatives) : Que ferait votre acheteur si votre produit n'existait pas ? Ce n'est presque jamais un concurrent direct théorique. C'est le statu quo (ne rien faire), un tableur bricolé, un carnet de notes, un guide PDF gratuit, ou une recherche manuelle laborieuse.",
            "2. Les capacités différenciantes (Differentiated Capabilities) : Qu'est-ce que votre solution possède ou permet d'accomplir que les alternatives réelles ne peuvent pas offrir ? (Ex. : adaptation instantanée selon le profil, calcul automatisé sans risque d'erreur, suivi d'application pas à pas avec sauvegarde).",
            "3. La valeur pour le client (Value for Customers) : Quel est le bénéfice concret et tangible que cette différence apporte à l'acheteur ? (Gain de temps, élimination de l'anxiété de se tromper, clarté mentale, passage à l'action immédiat).",
            "4. La segmentation des clients cibles (Target Customer Segmentation) : Parmi toute votre audience, qui sont les personnes qui accordent le plus de valeur à ce bénéfice spécifique ? (Ceux pour qui le coût de l'erreur ou la perte de temps est le plus insupportable).",
            "5. La catégorie de marché (Market Category) : Quel cadre de référence donne immédiatement du sens à votre offre ? Se positionner comme « un guide de gestion » déclenche des attentes de lecture passive à faible prix ; se positionner comme « un atelier d'application guidée avec simulateur » installe immédiatement une valeur d'outil pratique.",
          ],
        },
        {
          id: 'day03-step1-alternatives-matrix',
          type: 'prose',
          eyebrow: '1.4 ARBITRAGE DES ALTERNATIVES',
          title: 'Matrice comparative face aux alternatives réelles',
          paragraphs: [
            "Pour évaluer la solidité de votre positionnement, confrontez chaque alternative à votre proposition de valeur :",
            "- Face au Statu quo (bricolage manuel) : L'acheteur subit des erreurs de calcul fréquentes et disperse ses notes sur plusieurs supports. Votre capacité : logique de calcul intégrée et centralisée. Sa valeur : sécurité, exactitude, zéro charge mentale.",
            "- Face à un Guide PDF ou ebook existant : L'acheteur subit une lecture passive de 40 pages et des conseils généraux non personnalisés à son profil. Votre capacité : diagnostic guidé avec affichage dynamique selon le statut. Sa valeur : gain de temps massif, pertinence immédiate, zéro tri manuel.",
            "- Face à un Tableur complexe (Excel / Sheets) : L'acheteur subit des formules fragiles, une manipulation austère et une utilisation malcommode sur smartphone. Votre capacité : interface épurée étape par étape, utilisable sans apprentissage technique. Sa valeur : prise en main en 3 minutes sans crainte de casser une cellule.",
            "- Face à une Formation vidéo longue : L'acheteur doit visionner 10 heures de cours avant de produire le moindre livrable. Votre capacité : parcours orienté livrable immédiat avec modèles pré-remplis. Sa valeur : résultat tangible obtenu en une séance de travail.",
          ],
        },
        {
          id: 'day03-step1-interactive-value-nuance',
          type: 'callout',
          variant: 'important',
          title: "La valeur réelle de l'interactivité sans dogmatisme",
          content:
            "Le cœur d'AI CREATOR Studio est d'enseigner la transformation d'expertises et de contenus statiques en produits digitaux interactifs. Cependant, vous devez bannir tout dogmatisme technologique : un document PDF n'est pas un mauvais produit par nature ; pour une lecture réflexive au calme, le format textuel reste parfaitement adapté. Un outil interactif n'est pas supérieur par essence ; ajouter du code ou des boutons sur un contenu qui ne nécessite aucun calcul, aucun tri ni aucune sauvegarde n'apporte aucune valeur ajoutée. La vraie valeur de l'interactivité réside dans la réduction d'effort (calcul automatique, personnalisation immédiate, sauvegarde de progression). Le choix du format technique précis (mini-app, hub de ressources, diagnostic ou calculateur) et son hypothèse tarifaire seront arbitrés au Jour 04.",
        },
        {
          id: 'day03-step1-promise-formula',
          type: 'prose',
          eyebrow: '1.5 LA PROMESSE DE TRANSFORMATION',
          title: 'Les 4 règles d\'or d\'une promesse crédible et vérifiable',
          paragraphs: [
            "Une promesse de transformation réussie répond à une équation rigoureuse : Situation de départ douloureuse -> Nouvelle capacité ou résultat concret vérifiable.",
            "Pour formuler une promesse professionnelle, appliquez ces 4 règles déontologiques :",
            "1. Elle décrit une capacité ou un livrable précis (ex. : « Calculer votre capacité de production hebdomadaire réelle et obtenir votre calendrier éditorial équilibré sur 30 jours »).",
            "2. Elle indique le contexte d'application (ex. : « En une séance de travail de 45 minutes, directement dans votre navigateur »).",
            "3. Elle est conditionnée à l'action de l'utilisateur : elle ne promet pas un miracle passif sans effort de mise en pratique.",
            "4. Elle s'interdit formellement les promesses financières garanties : les mentions telles que « Générez 5 000 € dès le premier mois » détruisent la crédibilité auprès des acheteurs avertis et violent la déontologie du studio.",
          ],
        },
        {
          id: 'day03-step1-concept-quiz',
          type: 'quiz',
          title: 'Validation des acquis : Positionnement et Promesse',
          description:
            'Testez votre maîtrise des concepts de différenciation, des alternatives réelles et de la promesse avant de configurer le prompt Claude.',
          questions: [
            {
              id: 'q1-competitive-alternatives',
              question:
                "Un formateur souhaite lancer un nouvel outil digital d'aide à la préparation d'entretiens d'embauche. Pour identifier ses concurrents réels au sens d'April Dunford, que doit-il observer en priorité ?",
              options: [
                'Les trois plus grandes entreprises mondiales éditant des logiciels RH cotées en bourse.',
                "Ce que ses candidats cibles font aujourd'hui pour préparer leurs entretiens (recherches Google éparses, notes Word, conseils d'amis ou ne rien faire).",
                "Les fonctionnalités des applications mobiles les plus téléchargées sur l'App Store, quel que soit leur domaine.",
                'Les slogans publicitaires utilisés par les cabinets de recrutement sur LinkedIn.',
              ],
              correctIndex: 1,
              explanation:
                "L'alternative concurrente réelle est ce que le client fait aujourd'hui en l'absence de votre offre. Le statu quo, la recherche manuelle et le bricolage représentent les véritables alternatives d'arbitrage.",
            },
            {
              id: 'q2-differentiation-vs-value',
              question:
                'Un concepteur intègre un algorithme complexe de tri matriciel dans son outil. Quand cette caractéristique devient-elle une différenciation stratégique pertinente ?',
              options: [
                'Dès lors que le code a nécessité plusieurs dizaines d\'heures de développement.',
                "Lorsque cette caractéristique permet à l'acheteur de résoudre un problème plus vite ou plus précisément qu'avec ses solutions habituelles, et qu'il accorde de l'importance à ce résultat.",
                "Uniquement si aucun autre créateur dans le monde n'utilise cette bibliothèque logicielle.",
                'Lorsque le créateur peut en faire le sujet d\'un article technique sur les réseaux sociaux.',
              ],
              correctIndex: 1,
              explanation:
                "Une caractéristique n'est différenciante que par rapport aux alternatives réelles, et elle ne devient une valeur que si elle apporte un bénéfice tangible à l'acheteur dans son contexte d'usage.",
            },
            {
              id: 'q3-positioning-vs-slogan',
              question:
                'Quelle proposition illustre fidèlement la nature d\'un positionnement stratégique ?',
              options: [
                'Une phrase percutante de 4 mots affichée en haut d\'une publicité pour attirer l\'attention.',
                'Le récit personnel des épreuves traversées par le formateur avant de créer son entreprise.',
                'Une décision stratégique interne définissant pour quel profil d\'acheteur le produit est le choix supérieur face aux alternatives réelles, et pourquoi.',
                'Une promesse formelle de doubler les revenus de l\'acheteur en moins de trente jours.',
              ],
              correctIndex: 2,
              explanation:
                "Le positionnement est une orientation stratégique amont qui définit le marché visé, les alternatives comparées et la raison objective du choix. Le slogan n'en est qu'une déclinaison publicitaire externe.",
            },
            {
              id: 'q4-promise-ethics',
              question:
                'Parmi ces quatre formulations, laquelle respecte les critères de rigueur et de crédibilité d\'AI CREATOR Studio ?',
              options: [
                'Notre système interactif révolutionnaire vous garantit 10 000 euros de revenus passifs le mois prochain sans compétences techniques.',
                'Passez de notes de préparation dispersées à une trame d\'entretien personnalisée et prête à l\'emploi en 30 minutes, vérifiable étape par étape.',
                'Le meilleur produit digital du marché, conçu avec une IA surpuissante pour changer votre vie.',
                'Téléchargez notre ressource pour devenir immédiatement l\'expert numéro un de votre secteur.',
              ],
              correctIndex: 1,
              explanation:
                "Une promesse crédible décrit une transformation tangible et vérifiable, ancrée dans l'action de l'utilisateur, exempte de jargon creux d'IA et de garanties de revenus irresponsables.",
            },
          ],
        },
      ],
    },
    {
      id: 'day-03-step-2',
      legacyType: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: 'Positionnement stratégique et promesse',
      completionLabel: "Valider l'étape 2 : Prompt Claude",
      blocks: [
        {
          id: 'day03-step2-explainer',
          type: 'prose',
          eyebrow: '2.1 STRATÉGIE DE PROMPTING',
          title: 'Structure du Prompt Maître XML et protocole adaptatif',
          paragraphs: [
            "Le Prompt Maître du Jour 03 transforme la fiche acheteur et le problème cible des Jours 01 et 02 en une stratégie de positionnement étayée et une promesse de transformation vérifiable.",
            "Ce prompt met en œuvre les principes d'ingénierie de prompt recommandés par Anthropic :",
            "- Encadrement par balises XML strictes (<context>, <instructions>, <source_material>, <constraints>, <output_format>).",
            "- Rôle d'auditeur critique et règles de preuves négatives interdisant tout copywriting complaisant.",
            "- Gestion adaptative à deux voies : CAS A (Données réelles disponibles, avec preuves documentées) vs CAS B (Démarrage, avec hypothèses de positionnement étiquetées [HYPOTHÈSE À VÉRIFIER] et questions d'entretiens de validation).",
            "- Interdiction formelle de fixer prématurément le format interactif exact ou le prix (strictement réservés au Jour 04).",
          ],
        },
        {
          id: 'day03-step2-master-prompt',
          type: 'prompt-builder',
          title: 'Compilateur du Prompt Maître de Positionnement',
          description:
            'Complétez ou ajustez les variables ci-dessous pour générer votre prompt stratégique personnalisé prêt à être exécuté dans Claude.',
          deliverableTarget: 'sales-copy',
          fields: [
            {
              key: 'business',
              label: 'Thématique ou domaine d\'activité',
              placeholder: 'Ex. Formation en gestion du temps, Accompagnement nutritionnel, Studio de design...',
              profileBinding: 'business',
            },
            {
              key: 'targetAudience',
              label: 'Acheteur cible en situation',
              placeholder: 'Ex. Consultants indépendants débordés par leur charge client, Candidats préparant un concours...',
              profileBinding: 'targetAudience',
            },
            {
              key: 'mainObjective',
              label: 'Objectif majeur du produit',
              placeholder: 'Ex. Bâtir un calendrier de publication équilibré sans calculatrice, Structurer des révisions ciblées...',
              profileBinding: 'mainObjective',
            },
            {
              key: 'productType',
              label: 'Format envisagé à ce stade',
              placeholder: 'Ex. Atelier interactif, Hub de ressources guidé, Guide pratique avec diagnostic...',
              profileBinding: 'productType',
            },
          ],
          template: `<role>
Tu es un stratège senior en positionnement produit B2B/B2C, expert de la proposition de valeur selon April Dunford (Obviously Awesome) et Strategyzer (Value Proposition Design).
Ton rôle est d'auditer la matière existante d'un créateur de produit digital, d'analyser ses véritables alternatives concurrentes, d'identifier ses capacités réellement différenciantes et de formuler un positionnement stratégique rigoureux assorti d'une promesse de transformation vérifiable.
Tu ne produis aucun copywriting artificiel, aucun slogan creux et aucune promesse financière abusive.
</role>

<context>
Ce travail s'inscrit dans le cadre du Jour 03 d'AI CREATOR Studio (Sprint 1 : Fondations & Stratégie Produit).
L'apprenant crée son propre produit digital pour son propre acheteur final.
Données déjà établies lors des journées précédentes :
- Nom / Thématique de l'apprenant : {{business}}
- Cible d'acheteurs en situation : {{targetAudience}}
- Objectif majeur du produit : {{mainObjective}}
- Type de produit envisagé : {{productType}}
</context>

<source_material>
Insérez ci-dessous vos données acquises aux Jours 01 et 02 :
1. Problème prioritaire retenu (Jour 01) :
[Collez ici la formulation de votre problème prioritaire]

2. Fiche acheteur et déclencheurs (Jour 02) :
- Situation de départ et bricolage actuel : [Ex. guide PDF, tableur, notes éparses, absence d'outil]
- Frustrations majeures constatées : [Collez 2 ou 3 frictions principales]
- Événement déclencheur d'achat (Trigger) : [Incident interne ou contrainte externe]
- Objections et anxiétés d'usage : [Doutes sur l'effort, la pertinence ou l'abandon]
- Critères de décision de l'acheteur : [Ce qui compte pour choisir face aux alternatives]

3. Retours clients et éléments de preuve disponibles (si existants) :
[Collez ici avis reçus, messages d'élèves, observations directes, ou écrivez : AUCUNE DONNÉE CLIENT EXISTANTE - DÉMARRAGE]
</source_material>

<constraints>
RÈGLES D'INTERDICTION ET D'ÉVIDENCE STRICTES :
- INTERDICTION formelle d'inventer des clients, des chiffres de vente ou de faux témoignages.
- INTERDICTION de présenter un positionnement comme validé s'il ne repose sur aucune preuve empirique.
- INTERDICTION de promettre un résultat financier garanti (ex. chiffre d'affaires, taux de conversion garanti).
- INTERDICTION de fixer prématurément le format technique final (mini-app, hub, calculateur) ou son prix (réservés au Jour 04).
- INTERDICTION de rédiger la page de vente ou le texte publicitaire (réservés au Module 03, Leçons 07 à 09).
- INTERDICTION de dénigrer les produits statiques (les guides PDF ont leur utilité ; l'interactivité ne vaut que si elle élimine une friction réelle).
- INTERDICTION d'employer du jargon creux d'IA ("révolutionnaire", "game-changer", "scalable", "mindset", "booster").
- RÈGLE DU VOCABULAIRE : Utilise un français professionnel sobre, précis et direct. Sans tirets cadratins.
</constraints>

<instructions>
Exécute l'analyse selon ce protocole en 6 étapes :

1. AUDIT DE DÉPART & SÉPARATION DU CAS :
- Analyse la section <source_material>.
- CAS A (Données clients ou preuves réelles fournies) : Base ton analyse sur les preuves fournies et signale les faits étayés.
- CAS B (Absence de données clients) : Qualifie l'ensemble des propositions de [HYPOTHÈSES DE POSITIONNEMENT À VÉRIFIER] et précise les points à valider sur le terrain.

2. CARTOGRAPHIE DES ALTERNATIVES CONCURRENTES RÉELLES :
- Identifie ce que fait l'acheteur si cette offre n'existe pas : 1) Le statu quo (bricolage habituel) ; 2) Les ressources statiques existantes (PDF, guides, livres) ; 3) Les outils génériques (tableurs, carnets, templates Notion) ; 4) Les cours vidéo magistraux.
- Pour chaque alternative, dégage la limite majeure vécue par le client.

3. CAPACITÉS DIFFÉRENCIANTES & VALEUR POUR L'ACHETEUR :
- Dresse la liste de 3 capacités que l'offre de l'apprenant possède et que les alternatives n'ont pas.
- Relie chaque capacité à sa valeur directe pour le client (le "Et alors ?" pour l'acheteur).
- Vérifie si cette différence est utile ou s'il s'agit d'une complexité superflue.

4. SEGMENT D'ACHETEURS ACCORDANT LA PLUS FORTE VALEUR :
- Détermine quel sous-groupe précis de l'audience retire le bénéfice maximal de cette valeur.

5. ÉVALUATION DE 3 HYPOTHÈSES DE POSITIONNEMENT :
- Propose 3 angles de positionnement distincts en variant l'alternative de comparaison ou la catégorie de marché.
- Pour chaque angle, évalue : pertinence, différenciation perçue, risque de surpromesse.
- Sélectionne l'angle provisoire le plus solide.

6. PROMESSE DE TRANSFORMATION ET SYNTHÈSE STRATÉGIQUE :
- Formule la promesse de transformation en 1 phrase claire : [Situation initiale douloureuse] vers [Nouvelle capacité concrète ou livrable obtenu], sous condition d'usage, sans garantie financière.
- Dresse la grille des preuves disponibles versus les hypothèses à tester.
</instructions>

<output_format>
Structure ta réponse finale selon ces 7 sections numérotées :

### 1. Statut du positionnement et audit des données
- Indication explicite : CAS A (Fondé sur preuves documentées) OU CAS B (Propositions hypothétiques de démarrage).
- Résumé de l'acheteur en situation et du problème cible.

### 2. Matrice des 4 Alternatives concurrentes réelles
Tableau en 3 colonnes :
- Alternative réelle utilisée.
- Limite opérationnelle constatée chez le client.
- Déclencheur qui rend l'alternative insuffisante.

### 3. Matrice de Différenciation et Valeur client
Pour 3 attributs distincts :
- Capacité ou caractéristique de votre offre.
- Comparaison directe avec l'alternative.
- Valeur concrète pour l'acheteur (soulagement de friction ou gain obtenu).
- Statut : [FAIT ÉTAYÉ / SOURCE] OU [HYPOTHÈSE DE VALEUR].

### 4. Segment cible prioritaire
- Profil exact de l'acheteur chez qui cette valeur est la plus critique.
- Contexte où la non-résolution du problème a le coût le plus élevé.

### 5. Comparatif de 3 Angles de positionnement
Pour chacun des 3 angles :
- Cadre de référence / Catégorie retenue.
- Alternative mise en contraste.
- Bénéfice différenciant.
- Risque ou angle mort à surveiller.
- Recommandation : quel angle provisoire retenir et pourquoi.

### 6. Énoncé de positionnement stratégique provisoire
Formule canonique :
« Pour [Segment cible en situation], confronté à [Friction ou problème aigu], notre produit est un(e) [Catégorie de référence] qui apporte [Valeur clé différenciante], contrairement à [Alternative concurrente réelle] grâce à [Capacité concrète démontrable]. »

### 7. Promesse de transformation & Grille de vérification
- Promesse de transformation officielle formulée en 1 à 2 phrases directes.
- Ce que la promesse engage concrètement.
- Ce que la promesse ne garantit pas (gardes-fous éthiques).
- Liste de 2 hypothèses majeures à tester avant le Jour 04.
</output_format>`,
        },
        {
          id: 'day03-step2-followups',
          type: 'prose',
          eyebrow: '2.2 UTILISATION ET RELANCES',
          title: 'Guide d\'exécution et bibliothèque de relances ciblées',
          paragraphs: [
            "Collez le prompt compilé dans Claude avec vos données des Jours 01 et 02. Examinez la synthèse générée. Si certaines réponses dérivent vers des formulations commerciales génériques, utilisez l'une de ces 4 relances ciblées :",
          ],
          bullets: [
            "Si la promesse ressemble à un slogan publicitaire creux : « Ta promesse de transformation ressemble à un slogan commercial ('Libérez votre plein potentiel et boostez vos résultats'). Réécris-la sous forme d'une capacité opérationnelle concrète : quel résultat précis ou quel livrable tangible l'utilisateur a-t-il entre les mains à la fin de l'utilisation ? Sans superlatif. »",
            "Si les alternatives concurrentes sont des entreprises théoriques : « Tu as cité des logiciels de grandes entreprises comme concurrents. Reviens aux alternatives d'usage réelles de mon acheteur au quotidien : que fait-il avec un fichier PDF, un carnet, un tableur ou ses propres notes quand il est seul devant son écran ? Repars de son bricolage quotidien. »",
            "Si une caractéristique technique est confondue avec la valeur client : « Dans la section 3, tu présentes une caractéristique technique comme un bénéfice. Applique le test du 'Et alors ?' : en quoi cette fonctionnalité change-t-elle concrètement la vie de mon acheteur, quel effort lui épargne-t-elle et pourquoi est-il prêt à y accorder de la valeur ? »",
            "Pour traquer toute surpromesse financière ou magique : « Vérifie rigoureusement la promesse formulée en section 7. Contient-elle une promesse de revenus, un gain de temps fantaisiste ou une illusion d'absence d'effort ? Reformule-la de façon sobre et déontologique en précisant les conditions nécessaires pour que l'utilisateur atteigne ce résultat. »",
          ],
        },
      ],
    },
    {
      id: 'day-03-step-3',
      legacyType: 'example',
      number: 3,
      title: 'Exemple guidé',
      subtitle: "Déconstruction d'un cas d'école fictif",
      completionLabel: "Valider l'étape 3 : Exemple guidé",
      blocks: [
        {
          id: 'day03-step3-context-ethics',
          type: 'prose',
          eyebrow: "3.1 AUDIT D'UN CAS PÉDAGOGIQUE FICTIF",
          title: "Analyse critique du positionnement (Cas d'école fictif)",
          paragraphs: [
            "Pour illustrer pas à pas la construction d'un positionnement et d'une promesse, nous reprenons le document fictif examiné aux Leçons 01 et 02 : public/demos/pdf-to-hub/avant-pdf-statique.html (« Guide d'Organisation & Planification », simulation d'un guide PDF de 5 pages).",
            "Rappel des règles de rigueur déontologique :",
            "1. Ce document est un support pédagogique fictif conçu spécifiquement pour illustrer les limites pratiques d'un PDF statique face à un produit interactif.",
            "2. Il ne s'agit ni d'une étude de marché globale, ni d'un produit commercial ayant enregistré des ventes réelles vérifiées.",
            "3. Le document comporte physiquement cinq pages visibles (Pages 1/12 à 5/12) dans le code HTML. Aucune extrapolation sur de prétendues pages 6 à 12 n'est admise.",
            "4. Par conséquent, toute proposition tirée de cet exemple est traitée comme une hypothèse d'apprentissage, et non comme un résultat commercial établi.",
          ],
        },
        {
          id: 'day03-step3-fictional-case-study',
          type: 'prose',
          eyebrow: "3.2 APPLICATION AU CAS D'ÉCOLE",
          title: 'De la matière statique au positionnement argumenté',
          paragraphs: [
            "Voici comment extraire un positionnement et une promesse rigoureux à partir des cinq pages physiques du document :",
            "1. L'alternative actuelle de l'acheteur : Un consultant indépendant qui veut planifier ses publications utilise aujourd'hui soit un guide PDF méthodologique (lecture passive, calculs manuels sur carnet, cases imprimées), soit un tableur bricolé, soit ne planifie rien par manque de méthode.",
            "2. Le problème documentaire identifiable : Page 2, la formule de calcul de capacité impose de poser une équation manuelle à chaque changement d'emploi du temps. Page 3, la matrice 40/40/20 reste un concept abstrait. Page 4, la feuille de route invite à imprimer du papier. Page 5, le prompt textuel comporte des crochets [Remplacer par...] à éditer manuellement.",
            "3. Capacité différenciante proposée : Transformer ce document en atelier interactif direct : un calculateur dynamique avec curseurs, une répartition visuelle immédiate des 3 piliers selon le statut sélectionné en 1 clic, une feuille de route dont les cases cochées sont mémorisées dans le navigateur, et un générateur de prompt sans crochets.",
            "4. Valeur concrète pour l'acheteur : Élimination de la corvée de calcul (le consultant sait en 30 secondes combien d'heures il peut consacrer à la création), suppression du tri manuel de contenu inutile, continuité de travail sur écran sans papier.",
            "5. Preuves disponibles vs Hypothèses restantes : [FAIT DOCUMENTÉ] Le fichier source comporte des formules manuelles et des cases statiques. [HYPOTHÈSE À VÉRIFIER] Les consultants accordent-ils assez d'importance à cette fluidité pour préférer un outil interactif à leur carnet gratuit ? (À vérifier lors de la mise en vente au Module 03).",
            "6. Positionnement provisoire retenu : « Pour les consultants et formateurs indépendants qui manquent de temps pour organiser leur présence éditoriale, notre produit est un atelier d'application guidée avec simulateur intégré qui leur permet de bâtir et suivre leur calendrier de publication sans quitter leur écran, contrairement aux guides PDF méthodologiques qui exigent de sortir une calculatrice et d'imprimer des feuilles de route papier. »",
            "7. Promesse de transformation : « Évaluer votre capacité de création hebdomadaire réelle sans calcul manuel et obtenir votre calendrier éditorial équilibré sur 30 jours, prêt à l'emploi en moins de 45 minutes dans votre navigateur. »",
          ],
        },
        {
          id: 'day03-step3-sectorial-examples',
          type: 'prose',
          eyebrow: '3.3 ILLUSTRATIONS SECTORIELLES FICTIVES',
          title: 'Deux mini-exemples d\'application hors conseil',
          paragraphs: [
            "Pour vérifier que cette méthode s'applique à tout secteur d'expertise, examinons deux illustrations pédagogiques fictives :",
            "Mini-exemple A (Formation en ligne / Préparation de concours) : L'alternative réelle est un manuel exhaustif de 300 pages avec des fiches manuscrites. La friction : submersion et révision passive inefficace. La capacité différenciante : auto-évaluation diagnostique classant les lacunes par priorité et générant un planning de révision sur 14 jours. La promesse : « Identifier vos 3 points faibles majeurs en 20 minutes et suivre un plan de révision quotidien ciblé de 25 minutes par jour jusqu'au jour de l'épreuve. »",
            "Mini-exemple B (Nutrition & Organisation quotidienne) : L'alternative réelle est un livre de recettes diététiques en PDF ou des posts enregistrés sur Instagram. La friction : 2 heures passées le dimanche à chercher des recettes compatibles et à recalculer les quantités sur un carnet. La capacité différenciante : sélecteur de préférences alimentaires avec liste de courses consolidée par rayon en un clic. La promesse : « Planifier vos repas équilibrés de la semaine et exporter votre liste de courses exacte par rayon en moins de 10 minutes chaque dimanche. »",
          ],
        },
        {
          id: 'day03-step3-pitfalls',
          type: 'prose',
          eyebrow: '3.4 DÉCONSTRUCTION CRITIQUE',
          title: 'Trois pièges majeurs lors du positionnement',
          paragraphs: [
            "Prenez garde à ces trois dérives fréquentes lors de la formalisation de votre offre :",
          ],
          bullets: [
            "Le piège du concurrent fantôme (Phantom Competitor) : Ne vous comparez pas à des logiciels de multinationales que votre client n'envisage même pas. Votre vrai concurrent est son bricolage actuel et le statu quo.",
            "Le piège de la fonctionnalité orpheline : Ne conservez que les caractéristiques qui répondent directement à une souffrance documentée de votre acheteur. Toute fonctionnalité sans valeur d'usage doit être éliminée.",
            "Le piège de la promesse miraculeuse : Ne promettez jamais un chiffre d'affaires garanti, une perte de poids magique ou une réussite passive. Promettez une capacité opérationnelle concrète et vérifiable, conditionnée à l'application de la méthode.",
          ],
        },
      ],
    },
    {
      id: 'day-03-step-4',
      legacyType: 'your-turn',
      number: 4,
      title: 'À vous de jouer',
      subtitle: 'Définir votre positionnement',
      completionLabel: "Valider l'étape 4 : À vous de jouer",
      blocks: [
        {
          id: 'day03-step4-intro',
          type: 'prose',
          eyebrow: '4.1 ATELIER PERSONNEL',
          title: 'Vos livrables du Jour 03 et deux voies d\'exécution',
          paragraphs: [
            "C'est votre tour de poser le positionnement stratégique et la promesse de transformation de votre propre offre. Vous allez renseigner et enregistrer cinq livrables distincts dans les espaces ci-dessous :",
            "- Voie 1 (Vous disposez déjà de clients, de ventes ou d'avis) : Appuyez-vous sur les éléments avérés de votre activité. Renseignez chaque attribut différenciant en indiquant sa source : [FAIT ÉTAYÉ / SOURCE : ...].",
            "- Voie 2 (Vous êtes en phase de création ou de démarrage) : Formulez vos hypothèses de différenciation de manière honnête et étiquetez chaque point sous la mention [HYPOTHÈSE À VÉRIFIER]. Vous utiliserez cette grille lors de vos prochains échanges exploratoires.",
            "- Livrable A : Matrice des alternatives réelles face à votre offre.",
            "- Livrable B : Capacités différenciantes et valeur client associée.",
            "- Livrable C : Énoncé de positionnement stratégique provisoire.",
            "- Livrable D : Promesse de transformation vérifiable.",
            "- Livrable E : Balance des preuves disponibles et hypothèses restantes à tester.",
          ],
        },
        {
          id: 'day03-deliverable-a-alternatives',
          type: 'text-exercise',
          title: 'Livrable A : Matrice des alternatives réelles',
          instructions:
            "Listez les 3 solutions que votre acheteur utilise aujourd'hui si votre offre n'existe pas : 1) Le statu quo / bricolage manuel actuel ; 2) Les documents statiques existants (PDF, ebooks, guides) ; 3) Les outils génériques (tableurs, carnets, templates). Précisez pour chacune la friction majeure vécue par le client.",
          placeholder: `ALTERNATIVE 1 (Statu quo / Bricolage actuel) :
- Solution utilisée :
- Limite ou friction vécue :

ALTERNATIVE 2 (Ressources statiques existantes) :
- Solution utilisée :
- Limite ou friction vécue :

ALTERNATIVE 3 (Outils génériques / Tableurs) :
- Solution utilisée :
- Limite ou friction vécue :`,
          maxLength: 1500,
        },
        {
          id: 'day03-deliverable-b-differentiation',
          type: 'text-exercise',
          title: 'Livrable B : Capacités différenciantes et Valeur client',
          instructions:
            'Détaillez 2 ou 3 capacités précises que votre approche apporte et que les alternatives n\'ont pas. Pour chacune, appliquez le test du « Et alors ? » pour expliciter le bénéfice concret (la valeur) pour l\'acheteur, en précisant son statut : [FAIT ÉTAYÉ] ou [HYPOTHÈSE À VÉRIFIER].',
          placeholder: `CAPACITÉ DIFFÉRENCIANTE 1 :
- Ce que mon produit permet :
- Valeur pour le client (bénéfice concret) :
- Statut : [FAIT ÉTAYÉ / Source : ...] ou [HYPOTHÈSE À VÉRIFIER]

CAPACITÉ DIFFÉRENCIANTE 2 :
- Ce que mon produit permet :
- Valeur pour le client (bénéfice concret) :
- Statut : [FAIT ÉTAYÉ / Source : ...] ou [HYPOTHÈSE À VÉRIFIER]`,
          maxLength: 1500,
        },
        {
          id: 'day03-deliverable-c-positioning',
          type: 'text-exercise',
          title: 'Livrable C : Énoncé de positionnement stratégique provisoire',
          instructions:
            'Rédigez votre énoncé de positionnement en complétant la structure canonique d\'April Dunford. Cet énoncé constitue votre boussole de conception interne.',
          placeholder:
            "Pour [Segment d'acheteurs en situation], confronté à [Friction ou problème aigu], notre produit est un(e) [Catégorie de référence] qui apporte [Valeur clé différenciante], contrairement à [Alternative concurrente réelle] grâce à [Capacité concrète démontrable].",
          maxLength: 1000,
        },
        {
          id: 'day03-deliverable-d-promise',
          type: 'text-exercise',
          title: 'Livrable D : Promesse de transformation vérifiable',
          instructions:
            'Formulez en 1 ou 2 phrases directes la transformation concrète que votre acheteur peut accomplir en utilisant votre produit. Précisez le contexte d\'usage et rappelez expressément ce que la promesse ne garantit pas (gardes-fous éthiques, absence de promesse financière).',
          placeholder:
            "Promesse de transformation : [Passer de ... à ... en X minutes/jours sans ...].\n\nConditions d'usage nécessaires : [Ce que l'utilisateur doit appliquer concrètement].\n\nCe que la promesse ne garantit pas : [Aucun revenu garanti, aucun miracle passif sans travail].",
          maxLength: 1000,
        },
        {
          id: 'day03-deliverable-e-evidence-hypotheses',
          type: 'text-exercise',
          title: 'Livrable E : Balance des preuves disponibles et hypothèses restantes',
          instructions:
            'Séparez ce qui est aujourd\'hui prouvé (observations directes, retours clients, constats documentaires) de ce qui reste une hypothèse à valider sur le terrain avant le Jour 04 (Format et prix).',
          placeholder: `PREUVES DISPONIBLES ([FAITS ÉTAYÉS]) :
- 

HYPOTHÈSES RESTANTES À TESTER ([HYPOTHÈSES À VÉRIFIER]) :
- Hypothèse 1 :
- Hypothèse 2 :`,
          maxLength: 1200,
        },
        {
          id: 'day03-step4-checklist',
          type: 'checklist',
          title: 'Checklist de validation du positionnement et de la promesse',
          description:
            'Vérifiez la solidité méthodologique de vos livrables avant de clôturer votre Jour 03 :',
          items: [
            {
              id: 'chk-real-alternatives',
              label: 'Alternatives réelles identifiées',
              detail:
                "Les solutions comparées correspondent aux pratiques quotidiennes réelles de l'acheteur (statu quo, tableur, PDF, bricolage) sans concurrents fantômes.",
            },
            {
              id: 'chk-useful-difference',
              label: 'Différence utile et non gadget',
              detail:
                'Chaque capacité différenciante répond à une friction réelle identifiée au Jour 02, sans ajout de complexité technique superflue.',
            },
            {
              id: 'chk-customer-value',
              label: "Valeur formulée du point de vue de l'acheteur",
              detail:
                "La valeur exprime un soulagement de douleur ou un gain concret pour le client, et non une simple caractéristique logicielle.",
            },
            {
              id: 'chk-market-category',
              label: 'Catégorie de référence porteuse de sens',
              detail:
                "La catégorie choisie oriente immédiatement l'acheteur vers la bonne comparaison mentale dans son esprit.",
            },
            {
              id: 'chk-verifiable-promise',
              label: 'Promesse concrète et vérifiable',
              detail:
                "La promesse décrit un livrable ou une capacité opérationnelle mesurable par l'utilisateur lui-même.",
            },
            {
              id: 'chk-no-false-promises',
              label: 'Absence de surpromesse financière ou magique',
              detail:
                'Aucune promesse de gain financier garanti, de résultat instantané ni de miracle passif sans effort.',
            },
            {
              id: 'chk-epistemic-distinction',
              label: 'Distinction épistémique rigoureuse',
              detail:
                'Chaque affirmation est clairement identifiée comme fait étayé ou comme hypothèse à tester.',
            },
            {
              id: 'chk-format-independence',
              label: 'Indépendance vis-à-vis du format et du prix',
              detail:
                'Le positionnement pose la valeur sans imposer prématurément le format technique final ni le tarif (réservés au Jour 04).',
            },
          ],
        },
        {
          id: 'day03-step4-resources',
          type: 'resource',
          title: 'Ressources méthodologiques téléchargeables',
          description:
            'Téléchargez ces gabarits opérationnels pour documenter et partager votre stratégie de positionnement :',
          resources: [
            {
              id: 'res-guide-positionnement-promesse',
              title: 'Guide méthodologique : Positionnement et Promesse',
              category: 'guide',
              description:
                'Synthèse des 5 composantes d\'April Dunford, des règles d\'or de la promesse crédible et de la détection des concurrents fantômes.',
              format: 'Markdown (.md)',
              downloadFilename: 'guide-positionnement-promesse-j03.md',
              downloadContent: `# GUIDE MÉTHODOLOGIQUE : POSITIONNEMENT & PROMESSE
Formation AI CREATOR Studio | Jour 03

## 1. LES 5 COMPOSANTES D'APRIL DUNFORD
1. Alternatives concurrentes réelles : Ce que l'acheteur fait si vous n'existez pas (statu quo, carnet, tableur, PDF gratuit).
2. Capacités différenciantes : Ce que votre offre a et que les alternatives n'ont pas.
3. Valeur pour le client : Le bénéfice concret permis par ces capacités (test du « Et alors ? »).
4. Segment cible : Ceux pour qui cette valeur compte le plus.
5. Catégorie de marché : Le contexte qui rend la valeur évidente.

## 2. RÈGLES DE LA PROMESSE CRÉDIBLE
- Décrire une capacité ou un livrable concret.
- Indiquer le contexte d'application.
- Conditionner le résultat à l'action de l'utilisateur.
- Bannir toute promesse financière garantie ou magique.
`,
            },
            {
              id: 'res-matrice-differenciation-promesse',
              title: 'Matrice de différenciation et Promesse de transformation',
              category: 'template',
              description:
                'Trame de travail vierge pour poser le positionnement, comparer les alternatives et formaliser votre promesse de produit digital.',
              format: 'Markdown (.md)',
              downloadFilename: 'matrice-differenciation-promesse-j03.md',
              downloadContent: `# MATRICE DE DIFFÉRENCIATION ET PROMESSE
AI CREATOR Studio | Fiche projet Jour 03

Projet : [Nom du projet]
Acheteur cible en situation : [Cible du Jour 02]

## 1. ALTERNATIVES RÉELLES
- Statu quo (bricolage actuel) :
- Ressource statique (guide/PDF) :
- Outil générique (tableur/Notion) :

## 2. CAPACITÉS DIFFÉRENCIANTES & VALEUR
- Capacité 1 -> Valeur client : [Bénéfice] | Statut : [FAIT ÉTAYÉ / HYPOTHÈSE]
- Capacité 2 -> Valeur client : [Bénéfice] | Statut : [FAIT ÉTAYÉ / HYPOTHÈSE]

## 3. POSITIONNEMENT PROVISOIRE
Pour [Cible], confronté à [Friction], notre produit est un [Catégorie] qui apporte [Valeur], contrairement à [Alternative] grâce à [Capacité].

## 4. PROMESSE DE TRANSFORMATION
[Promesse en 1 phrase directe décrivant la nouvelle capacité opérationnelle].
`,
            },
          ],
        },
      ],
    },
  ],
};
