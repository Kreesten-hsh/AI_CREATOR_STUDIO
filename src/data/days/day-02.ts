import type { Day } from '../../types/course';

export const day02: Day = {
  id: 'day-02',
  dayNumber: 2,
  sprintId: 'sprint-1',
  title: 'PSYCHOLOGIE & LEVIERS D\'ACHAT',
  italicTitleWord: 'PSYCHOLOGIE',
  objective:
    "Décrire l'acheteur par ses situations, frustrations, déclencheurs d'achat et objections, plutôt que par des données démographiques.",
  deliverableSummary:
    "Fiche acheteur qualitative complète et cartographie des leviers d'achat",
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-02-step-1',
      type: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: "Psychologie de l'acheteur",
      completionLabel: "Valider l'étape 1 : Comprendre",
      blocks: [
        {
          id: 'day02-step1-buyer-vs-audience',
          type: 'prose',
          eyebrow: '1.1 FONDATIONS DE L\'ACHAT',
          title: "Audience globale versus Acheteur en situation",
          highlightPill: 'Remplacer le portrait-robot démographique par le contexte d\'action',
          paragraphs: [
            "Au Jour 01, vous avez délimité votre niche : un groupe de personnes confronté à un problème précis. Cependant, au sein d'une même audience, toutes les personnes ne sont pas prêtes à acquérir un outil pour résoudre leur blocage. Une audience globale désigne un ensemble d'individus partageant un métier (ex. « les designers » ou « les professionnels en télétravail »). Un acheteur en situation désigne un membre de cette audience qui subit actuellement une friction aiguë, dont l'inertie a été rompue par un événement précis, et qui cherche activement à supprimer cette souffrance opérationnelle.",
            "Pendant des décennies, le marketing traditionnel a enseigné la création de « personas » fondés sur des traits démographiques (âge, situation familiale, loisirs). Comme l'a démontré la chercheuse Adele Revella (Buyer Persona Institute), ces critères n'expliquent jamais pourquoi une personne décide d'acheter une solution. Deux individus ayant exactement le même âge et le même revenu peuvent avoir des comportements d'achat opposés.",
            "Ce qui déclenche la décision d'achat, ce sont les cinq anneaux d'insights d'achat : 1) Les initiatives prioritaires (l'événement déclencheur) ; 2) Les facteurs de succès (le résultat concret attendu) ; 3) Les barrières perçues (les craintes qui font hésiter) ; 4) Le parcours d'évaluation ; 5) Les critères précis de décision.",
            "Clarifiez également si l'acheteur est l'utilisateur final. Dans la majorité des contextes solos et B2C, la même personne achète et manipule l'outil. Dans les contextes B2B et familiaux, l'acheteur (décideur financier) cherche la rentabilité et la réduction du risque, tandis que l'utilisateur au quotidien recherche la simplicité immédiate et l'absence d'effort.",
          ],
        },
        {
          id: 'day02-step1-forces-of-progress',
          type: 'prose',
          eyebrow: '1.2 MÉCANIQUE DU CHANGEMENT',
          title: 'Les 4 Forces du Changement (Modèle de Bob Moesta)',
          highlightPill: '(Push + Pull) > (Anxiété + Habitude) = Passage à l\'action',
          paragraphs: [
            "Pourquoi votre futur client tolère-t-il un tableur Excel bancal ou un carnet de notes imparfait depuis six mois sans changer ? Le chercheur Bob Moesta (co-créateur du framework Jobs to be Done) a modélisé la décision sous forme de 4 forces en tension constante :",
            "1. Le Push du présent : La saturation, la friction et la douleur vécues avec la situation actuelle (« Ça ne peut plus durer comme ça »).",
            "2. Le Pull du produit nouveau : Le magnétisme et la promesse d'une vie professionnelle simplifiée (« Imagine si je pouvais régler ça en 3 clics »).",
            "3. L'Anxiété de la nouveauté : La peur de l'inconnu, du temps perdu ou de la complexité technique (« Et si je n'y arrive pas ? Et si c'est trop compliqué ? »).",
            "4. L'Habitude du statu quo : L'inertie du confort acquis (« Même si mon vieux tableur a des défauts, je connais ses raccourcis par cœur »).",
            "Le passage à l'acte a lieu uniquement lorsque la somme des forces qui poussent vers l'avant (Push + Pull) surpasse les forces de résistance (Anxiété + Habitude). La plupart des créateurs se concentrent uniquement sur le Pull. Votre mission au Jour 02 est d'identifier le Push (les 5 frustrations) et les Anxiétés (les objections réelles) pour concevoir une offre qui lève les freins.",
          ],
        },
        {
          id: 'day02-step1-rings-and-objections',
          type: 'prose',
          eyebrow: '1.3 TRIGGERS, OBJECTIONS ET VOCABULAIRE',
          title: 'Déclencheurs, objections réelles et Voice of Customer',
          paragraphs: [
            "L'acheteur ne cherche pas une solution chaque matin. Ce qui provoque le passage à l'action, c'est l'événement déclencheur (Trigger). On distingue : le déclencheur interne (l'incident de trop, comme une erreur sur un devis ou un week-end gâché par l'administratif) et le déclencheur externe (l'échéance imposée, comme l'arrivée d'une date limite ou la fin d'un gros contrat client).",
            "Les objections ne sont pas des refus arbitraires : elles expriment l'anxiété de la nouveauté. Les 4 familles d'objections les plus courantes face à un outil digital sont : 1) L'effort et le temps d'apprentissage perçus (« Je n'ai pas le temps de configurer un logiciel ») ; 2) La spécificité (« Mon métier est trop particulier ») ; 3) La légitimité (« Je ne suis pas à l'aise avec la technique ») ; 4) La crainte d'abandon (« J'ai déjà délaissé 3 templates Notion l'an dernier »).",
            "Pour que votre futur acheteur se reconnaisse instantanément, appliquez les principes de The Mom Test (Rob Fitzpatrick) : relevez le vocabulaire brut réellement employé par l'audience (Voice of Customer), avec ses métaphores concrètes (« la tête dans le guidon », « naviguer à vue », « bricolage sur un coin de table »), et bannissez les termes marketing creux d'IA.",
            "Règle épistémique : Chaque élément de votre fiche acheteur doit être classé entre Fait avéré (attesté par un retour client ou une observation réelle), Déduction logique, ou marqué explicitement comme [HYPOTHÈSE À VÉRIFIER].",
          ],
        },
        {
          id: 'day02-step1-concept-quiz',
          type: 'quiz',
          title: 'Validation des acquis : Psychologie et Leviers d\'Achat',
          description:
            'Testez votre maîtrise des forces de décision, du Mom Test et de la psychologie de l\'acheteur avant de configurer le prompt Claude.',
          questions: [
            {
              id: 'q1-demography-vs-context',
              question:
                'Une formatrice définit son acheteur ainsi : « Femmes de 30 à 45 ans, urbaines, cadre moyen ou supérieur, intéressées par le développement personnel ». Pourquoi cette définition est-elle inadéquate pour construire un produit digital interactif ?',
              options: [
                'Parce que les femmes de moins de 30 ans achètent plus de produits digitaux que les femmes de 45 ans.',
                'Parce que ces critères socio-démographiques n\'indiquent ni l\'action concrète interrompue, ni le problème opérationnel urgent, ni la situation qui déclenche l\'acte d\'achat.',
                'Parce que Claude ne sait pas traiter les profils féminins dans ses prompts.',
                'Parce qu\'il faut obligatoirement inclure les hommes pour avoir une offre rentable.',
              ],
              correctIndex: 1,
              explanation:
                "Les données démographiques décrivent une population générale sans renseigner sur le moment où survient la friction ni sur les solutions actuellement bricolées. Seule la situation concrète permet de calibrer un produit interactif pertinent.",
            },
            {
              id: 'q2-forces-of-progress',
              question:
                'Un indépendant adore la promesse d\'un nouveau simulateur web (attrait / Pull élevé), mais hésite depuis deux semaines à l\'utiliser parce qu\'il maîtrise déjà les raccourcis de son vieux fichier Excel bancal. Quelle force psychologique bloque ici la décision ?',
              options: [
                'Le Push du présent.',
                'L\'Habitude du statu quo.',
                'L\'absence d\'intérêt pour le produit.',
                'L\'absence totale de budget.',
              ],
              correctIndex: 1,
              explanation:
                "L'habitude du statu quo représente l'inertie des réflexes acquis. Même lorsqu'un outil existant est médiocre ou fastidieux, l'utilisateur en connaît les défauts par cœur ; quitter cette zone de confort demande un effort que le nouveau produit doit minimiser.",
            },
            {
              id: 'q3-mom-test-rules',
              question:
                'Vous échangez avec un client potentiel pour identifier ses objections. Laquelle de ces questions devez-vous poser pour obtenir une information factuelle et non un faux avis poli ?',
              options: [
                '« Est-ce que tu trouverais génial d\'avoir un outil interactif qui automatise ton suivi ? »',
                '« Combien serais-tu prêt à payer pour une application web qui résout ce problème ? »',
                '« La dernière fois que ce blocage est survenu, qu\'as-tu concrètement fait et combien de temps as-tu passé à réparer l\'erreur ? »',
                '« Penses-tu que ce produit intéresserait d\'autres professionnels de ton entourage ? »',
              ],
              correctIndex: 2,
              explanation:
                "Cette question interroge sur une action passée réelle et vérifiable. Les autres questions demandent des prédictions ou des avis hypothétiques qui déclenchent des réponses polies mais fausses (piège des faux positifs de The Mom Test).",
            },
            {
              id: 'q4-buyer-vs-user',
              question:
                'Dans quel cas est-il impératif de distinguer les motivations de l\'acheteur de celles de l\'utilisateur ?',
              options: [
                'Uniquement lorsque le produit coûte plus de 1 000 euros.',
                'Lorsque la personne qui valide le budget ou prend la décision d\'achat n\'est pas celle qui utilisera l\'outil au quotidien (ex. un dirigeant pour son équipe, un parent pour son enfant).',
                'Jamais, car les besoins d\'un utilisateur et d\'un acheteur sont toujours strictement identiques.',
                'Uniquement dans les applications mobiles téléchargeables sur l\'App Store.',
              ],
              correctIndex: 1,
              explanation:
                "Lorsque le décideur financier est distinct de l'utilisateur final, l'acheteur évalue la conformité, le risque et la rentabilité globale, tandis que l'utilisateur juge l'effort de prise en main et le confort immédiat. L'offre doit répondre aux deux exigences.",
            },
          ],
        },
      ],
    },
    {
      id: 'day-02-step-2',
      type: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: "Prompt de recherche d'audience",
      completionLabel: "Valider l'étape 2 : Prompt Claude",
      blocks: [
        {
          id: 'day02-step2-explainer',
          type: 'prose',
          eyebrow: '2.1 INGÉNIERIE DE PROMPT QUALITATIF',
          title: "Piloter Claude en auditeur de psychologie d'achat",
          paragraphs: [
            "Pour extraire la psychologie réelle d'un acheteur sans inventer de faux portraits flatteurs, le Prompt Maître du Jour 02 applique les standards stricts du protocole de recherche :",
            "1. Un rôle d'auditeur en Customer Discovery : Claude adopte la posture d'un chercheur UX neutre qui analyse des données brutes sans projeter de complaisance marketing.",
            "2. Un cloisonnement étanche par balises XML : Les balises isolent vos notes clients ou verbatims bruts des consignes de traitement pour éliminer les confusions de contexte.",
            "3. L'obligation d'extraire des verbatims réels : Claude doit justifier chaque frustration par un fait ou une citation textuelle issue de votre matière source.",
            "4. Un protocole socratique adaptatif : Si votre matière de départ est incomplète, Claude a pour consigne de vous poser une seule question ciblée à la fois sur vos échanges passés avant de générer la fiche.",
            "5. Des contraintes négatives absolues : Interdiction formelle de fabriquer de fausses citations, d'inventer des personas démographiques superficielles ou d'imposer un format technique prématuré.",
          ],
        },
        {
          id: 'day02-step2-master-prompt',
          type: 'prompt-builder',
          title: 'Prompt Maître : Cartographie de l\'Acheteur, Frustrations et Déclencheurs',
          description:
            'Ajustez votre thématique et votre audience cible ci-dessous. Le prompt XML compilé se met à jour en direct, prêt à être copié dans Claude (offre gratuite).',
          deliverableTarget: 'sales-copy',
          fields: [
            {
              key: 'targetAudience',
              label: 'Votre audience cible en situation',
              placeholder: 'Ex. Consultants solos en prestation, Salariés en télétravail...',
              profileBinding: 'targetAudience',
            },
            {
              key: 'business',
              label: "Votre thématique ou domaine d'expertise",
              placeholder: 'Ex. Organisation éditoriale B2B, Nutrition rapide...',
              profileBinding: 'business',
            },
          ],
          template: `<role>
Tu es un Directeur de Recherche en Customer Discovery et Analyste Spécialisé en Psychologie d'Achat et Modélisation Jobs to Be Done.
Ton rôle est de déconstruire des données qualitatives brutes (notes, verbatims, avis, messages, observations de terrain) pour cartographier le profil réel de l'acheteur en situation.
Tu appliques une rigueur épistémique totale : tu distingues systématiquement les faits attestés par des citations réelles, les déductions logiques directes et les simples hypothèses non vérifiées.
Tu refuses la complaisance, les portraits démographiques inutiles et les clichés psychologiques.
</role>

<context>
Je poursuis la conception d'un produit digital interactif engagée au Jour 01.
Voici les données de contexte de mon projet :
- Domaine d'activité ou thématique : {{business}}
- Audience cible en situation : {{targetAudience}}
</context>

<source_material>
[COLLEZ ICI VOTRE MATIÈRE CLIENT BRUTE :
- Extraits de messages, e-mails reçus, commentaires LinkedIn ou avis clients
OU
- Retours d'expériences ou notes de consultations passées
OU
- Commentaires publics observés sur des forums ou groupes professionnels
OU
- Si vous n'avez pas de notes rédigées, écrivez simplement : "Je pars de mon expérience directe avec mes clients sans notes d'entretiens, pose-moi tes questions."]
</source_material>

<evidence_rules>
1. FAIT OBSERVÉ / VERBATIM : Mot, expression ou comportement explicitement présent dans la matière source fournie.
2. DÉDUCTION LOGIQUE : Conséquence directe d'un fait observé, sans extrapolation hasardeuse.
3. HYPOTHÈSE À VÉRIFIER : Toute supposition sur les motivations profondes, les freins ou les déclencheurs qui n'est pas directement étayée par la matière.
</evidence_rules>

<constraints>
RÈGLES D'INTERDICTION FORMELLES (NEGATIVE PROMPTING) :
- INTERDICTION d'inventer des citations de clients ou de fabriquer de faux verbatims entre guillemets.
- INTERDICTION de créer un portrait démographique superficiel (âge, situation familiale, loisirs imaginaires).
- INTERDICTION d'affirmer que l'acheteur est "prêt à payer" ou de formuler une certitude financière sans preuve de transaction réelle.
- INTERDICTION de suggérer ou d'anticiper le format technique du produit (calculateur, mini-app, quiz : réservé au Jour 04).
- INTERDICTION de rédiger des promesses commerciales ou du texte publicitaire (réservé au Jour 03).
- INTERDICTION d'utiliser des tirets cadratins dans ta réponse en français (utilise des deux-points, parenthèses ou virgules).
- INTERDICTION d'employer du jargon creux d'IA ("révolutionnaire", "game-changer", "mindset de croissance", "booster son impact").
</constraints>

<task>
PROTOCOLE D'EXÉCUTION CONDITIONNEL :

ÉVALUATION INITIALE DE LA MATIÈRE SOURCE :
Examine la section <source_material>.
- CAS 1 (Matière orale ou insuffisante) : Si la matière fournie ne contient pas assez d'échanges réels pour identifier 5 frustrations distinctes et des objections, NE GÉNÈRE PAS la fiche tout de suite. Pose-moi UNE SEULE question ciblée sur la dernière fois où un client ou un collègue m'a exposé sa difficulté. Attends ma réponse avant d'enchaîner (jusqu'à 3 questions ciblées, une par une).
- CAS 2 (Matière suffisante) : Si la matière comporte déjà des échanges, avis ou notes de terrain, produis directement l'analyse complète selon le format de sortie ci-dessous.
</task>

<output_format>
Quand tu rédiges la synthèse finale, respecte rigoureusement cette structure en 6 sections :

### 1. Situation de départ de l'acheteur
- Description du contexte opérationnel quotidien de la personne avant la crise.
- Ses outils actuels par défaut (tableur bancal, carnet, recherche manuelle).
- Sa contrainte de fond non négociable (temps, budget, charge client).
- Clarification du rôle : l'acheteur est-il également l'utilisateur final ?

### 2. Les 5 Frustrations concrètes et distinctes
Pour chacune des 5 frustrations :
- **Intitulé de la friction** : Formulé sobrement.
- **Scène vécue concrète** : Ce qui se passe sur le terrain au moment du blocage.
- **Niveau de preuve** : [FAIT AVÉRÉ avec citation si présente] OU [HYPOTHÈSE À VÉRIFIER].

### 3. Les Déclencheurs d'achat (Triggers)
- **Déclencheur interne (L'incident de trop)** : L'événement ou la goutte d'eau qui brise l'inertie habituelle.
- **Déclencheur externe (L'échéance imposée)** : La date limite, l'obligation client ou réglementaire qui force l'action.
- **Niveau de preuve** : [FAIT AVÉRÉ] OU [HYPOTHÈSE À VÉRIFIER].

### 4. Les Objections et Barrières perçues (Forces de résistance)
- **Objection 1 (Effort et temps d'apprentissage)** : La crainte de complexité.
- **Objection 2 (Spécificité du contexte)** : Le doute sur l'adéquation au cas particulier.
- **Objection 3 (Peur de l'abandon)** : Le souvenir d'anciens outils délaissés.
- **Commentaire de désamorçage rationnel** : Ce que la solution devra prouver pour lever ce doute.

### 5. Vocabulaire brut de l'audience (Voice of Customer)
- Relevé de 5 à 8 expressions, mots ou métaphores effectivement employés par cette audience pour décrire sa situation, sans vocabulaire marketing d'expert.

### 6. Matrice de transition vers le Jour 03
- Synthèse des 3 éléments prioritaires de cette fiche qui serviront à formuler la promesse de transformation au Jour 03.
- Liste des 2 informations manquantes à vérifier auprès de vraies personnes.
</output_format>`,
        },
        {
          id: 'day02-step2-followups',
          type: 'prose',
          eyebrow: '2.2 UTILISATION ET RELANCES',
          title: "Guide d'exécution et bibliothèque de relances ciblées",
          paragraphs: [
            "Collez le prompt dans Claude. Deux cas d'usage se présentent :",
            "- Cas A (Vous avez des avis, e-mails ou verbatims réels) : Collez vos textes dans la zone <source_material>. Claude générera l'audit en 6 sections.",
            "- Cas B (Vous partez de votre expérience orale) : Laissez l'instruction par défaut. Claude amorcera une interview socratique en vous posant une question à la fois. Répondez avec des anecdotes réelles vécues avec vos clients.",
            "Si la réponse de Claude nécessite un ajustement, utilisez l'une de ces 4 relances ciblées :",
          ],
          bullets: [
            "Si les frustrations restent trop abstraites : « Tes frustrations 2 et 4 restent trop théoriques. Réécris-les en décrivant une action concrète qui s'arrête net : quel document ou écran la personne regarde-t-elle, quelle erreur constate-t-elle et quelle est sa réaction immédiate ? Sans tiret cadratin. »",
            "Si une objection ressemble à une excuse de complaisance : « L'objection 1 que tu as rédigée est trop générique ('c'est trop cher'). Remplis-la avec la vraie anxiété d'usage : quelle est la peur cachée de l'utilisateur vis-à-vis de son temps ou de sa compétence technique ? »",
            "Si le vocabulaire extrait contient du jargon marketing d'IA : « Le vocabulaire que tu as listé dans la section 5 contient des termes de communicant ('optimiser', 'scalabilité', 'mindset'). Remplace-les par les mots simples et familiers qu'un indépendant utilise réellement quand il se plaint à un collègue. »",
            "Pour tester la solidité d'une hypothèse : « Dans la section Déclencheurs, tu as classé [citer l'élément] comme fait avéré. Indique-moi l'extrait exact de ma source qui le prouve. Si aucun extrait ne l'atteste, requalifie-le en hypothèse et propose une question du Mom Test pour aller le vérifier sur le terrain. »",
          ],
        },
      ],
    },
    {
      id: 'day-02-step-3',
      type: 'example',
      number: 3,
      title: 'Exemple guidé',
      subtitle: "Analyse du profil type",
      completionLabel: "Valider l'étape 3 : Exemple guidé",
      blocks: [
        {
          id: 'day02-step3-context-ethics',
          type: 'prose',
          eyebrow: '3.1 ANALYSE DU MATÉRIAU SOURCE',
          title: "Continuité de l'exemple guidé (Cas Alexandre V.)",
          paragraphs: [
            "Pour illustrer concrètement la démarche, nous poursuivons l'analyse du document réel du dépôt utilisé au Jour 01 : public/demos/pdf-to-hub/avant-pdf-statique.html (« Le Système de Création Régulière », par Alexandre V.).",
            "Avertissement déontologique : Ce fichier reste un matériau de démonstration interne créé pour illustrer les limites techniques d'un PDF statique. Nous l'analysons sous l'angle exclusif de la psychologie d'achat de son lecteur cible, sans fabriquer de fausses données commerciales.",
            "En Page 1 et Page 2, le profil de l'acheteur cible est documenté : freelances en mission (25 à 30h/sem de prestation), formateurs (15 à 20h/sem) et coachs (20 à 25h/sem). Voyons comment extraire sa fiche qualitative complète sans inventer de traits imaginaires.",
          ],
        },
        {
          id: 'day02-step3-analysis-8points',
          type: 'prose',
          eyebrow: '3.2 EXTRACTION EN 8 POINTS',
          title: "L'analyse complète de l'acheteur en 8 étapes",
          paragraphs: [
            "Voici comment le protocole s'applique sur la matière d'Alexandre V. :",
            "1. Situation de départ : Consultant solo vendant des prestations au forfait, travaillant avec un carnet papier, une calculatrice et des tableurs bricolés. L'acheteur est directement l'utilisateur final : il recherche la fin de son incertitude hebdomadaire.",
            "2. Frustration 1 (Temps / Charge) [FAIT] : Devoir recalculer manuellement sa capacité chaque lundi parce que la charge client varie d'une semaine sur l'autre (Page 2).",
            "3. Frustration 2 (Erreur / Insécurité) [FAIT] : La violation systématique du temps protégé par une urgence client le mardi matin, annulant la séance de création sans possibilité de rattrapage (Page 2).",
            "4. Frustration 3 (Déséquilibre éditorial) [FAIT] : La tendance à ne publier que des contenus de vision par pudeur sans jamais proposer son offre, laissant l'activité sans nouveaux prospects (Page 3).",
            "5. Frustration 4 (Dispersion / Discontinuité) [FAIT] : L'obligation d'imprimer la feuille de route sur papier A4 pour cocher des cases au stylo, feuille qui finit perdue sous les dossiers en cours en Semaine 2 (Page 4).",
            "6. Frustration 5 (Bricolage textuel) [FAIT] : Le copier-coller fastidieux d'un prompt entre crochets dans un traitement de texte externe sans sauvegarde (Page 5).",
            "7. Déclencheurs d'achat (Triggers) : Trigger interne [HYPOTHÈSE] : l'épuisement d'un dimanche soir passé à hésiter sur son carnet sans rien produire. Trigger externe [FAIT DÉDUIT] : la fin imminente d'une grosse mission client à 30 jours avec un pipeline commercial vide suite à 2 mois sans publication.",
            "8. Objections réelles : « Je suis déjà sous l'eau, je n'ai pas le temps de configurer un outil » (anxiété d'effort) ; « J'ai déjà abandonné 3 templates Notion » (crainte d'inutilité) ; « Mon planning est imprévisible d'un jour à l'autre » (peur de rigidité).",
          ],
        },
        {
          id: 'day02-step3-pitfalls',
          type: 'prose',
          eyebrow: '3.3 VIGILANCE ET ANTI-HALLUCINATION',
          title: 'Déconstruction critique et pièges à éviter',
          paragraphs: [
            "Dans de nombreux cours de marketing génériques, on affirmerait ici : « Les consultants sont prêts à payer un abonnement de 29 euros par mois pour un outil de gestion éditoriale ». Existe-t-il la moindre preuve de transaction dans notre document source ? Non. Au contraire, saturés par les abonnements logiciels sous-utilisés, beaucoup développent une aversion pour les prélèvements récurrents. Cette supposition est donc rejetée et rétrogradée en simple hypothèse de travail.",
            "Prenez garde à ces trois pièges fréquents lors de la rédaction de votre fiche acheteur :",
          ],
          bullets: [
            "Confondre une objection sur le prix avec une objection sur la valeur : Quand un prospect dit « c'est trop cher », cela signifie presque toujours : « Je ne suis pas certain que cet outil va me faire gagner plus de temps que mon vieux tableur gratuit ». Traitez d'abord l'anxiété d'efficacité.",
            "Projeter ses propres habitudes sur son client : Parce que vous aimez configurer des outils complexes, ne présumez pas que votre acheteur partage cette passion. Votre acheteur veut que son blocage disparaisse en 3 clics.",
            "Inventer des verbatims stylisés : Ne récrivez pas les propos de vos clients pour les rendre plus élégants. Les expressions familières ou agacées (« la tête dans le guidon », « naviguer à vue », « bricolage sur un coin de table ») sont les meilleurs révélateurs de la friction réelle.",
          ],
        },
      ],
    },
    {
      id: 'day-02-step-4',
      type: 'your-turn',
      number: 4,
      title: 'À vous de jouer',
      subtitle: 'Cartographier votre acheteur',
      completionLabel: "Valider l'étape 4 : À vous de jouer",
      blocks: [
        {
          id: 'day02-step4-intro',
          type: 'prose',
          eyebrow: '4.1 ATELIER PERSONNEL',
          title: 'Vos livrables du Jour 02 et étalonnage',
          paragraphs: [
            "C'est votre tour de cartographier la psychologie et les leviers d'achat de votre propre audience cible. Vous allez renseigner et enregistrer cinq livrables distincts et une synthèse finale dans les espaces ci-dessous :",
            "- Livrable A : Situation de départ de votre acheteur en action.",
            "- Livrable B : Vos 5 frustrations concrètes (avec statut Fait ou Hypothèse).",
            "- Livrable C : Vos déclencheurs d'achat (1 Trigger interne + 1 Trigger externe).",
            "- Livrable D : Vos 3 objections majeures et leurs désamorçages rationnels.",
            "- Livrable E : Vocabulaire brut authentique (5 à 8 expressions réelles).",
            "- Livrable Final : Votre fiche acheteur qualitative complète.",
            "Pour étalonner votre niveau d'exigence, comparez ces deux formulations :",
            "Formulation insuffisante : « Des consultants qui veulent trouver des clients sur internet mais manquent d'organisation et sont souvent stressés par leur prospection. » (Symptôme abstrait, aucun outil actuel cité, aucune scène observable).",
            "Formulation acceptable : « Consultant solo en prestation 4 jours sur 5, utilisant un carnet papier et des messages LinkedIn improvisés le vendredi à 16h30, bloqué 40 minutes à hésiter devant son écran par peur de paraître insistant, et forcé d'agir par la fin d'un contrat représentant 60 % de son chiffre d'affaires. » (Situation ancrée dans l'action, outils réels, scène précise, déclencheur net).",
          ],
        },
        {
          id: 'day02-deliverable-a-situation',
          type: 'text-exercise',
          title: 'Livrable A : Situation de départ de votre acheteur',
          instructions:
            'Décrivez le contexte opérationnel habituel de votre acheteur avant la crise : quel est son métier, quels outils utilise-t-il aujourd\'hui par défaut (tableur bancal, carnet, calculatrice), quelle est sa contrainte de fond non négociable, et est-il également l\'utilisateur final ?',
          placeholder:
            "Exemple : Consultant indépendant facturant 20h/sem au forfait, utilisant un carnet papier et une calculatrice de bureau, disposant de moins de 3 heures par semaine pour son administratif, et achetant l'outil pour son usage personnel...",
          maxLength: 1500,
        },
        {
          id: 'day02-deliverable-b-frustrations',
          type: 'text-exercise',
          title: 'Livrable B : Matrice des 5 frustrations concrètes',
          instructions:
            'Détaillez 5 frictions distinctes (Temps/Charge, Erreur/Insécurité, Inertie/Retard, Dispersion, Culpabilité). Précisez pour chacune la scène vécue sur le terrain et son statut épistémique : [FAIT AVÉRÉ avec source] ou [HYPOTHÈSE À VÉRIFIER].',
          placeholder: `FRUSTRATION 1 (Temps / Charge) :
- Scène vécue :
- Statut : [FAIT AVÉRÉ] ou [HYPOTHÈSE À VÉRIFIER]

FRUSTRATION 2 (Erreur / Insécurité) :
- Scène vécue :
- Statut :

FRUSTRATION 3 (Inertie / Retard) :
- Scène vécue :
- Statut :

FRUSTRATION 4 (Dispersion / Discontinuité) :
- Scène vécue :
- Statut :

FRUSTRATION 5 (Culpabilité / Comparaison) :
- Scène vécue :
- Statut :`,
          maxLength: 2500,
        },
        {
          id: 'day02-deliverable-c-triggers',
          type: 'text-exercise',
          title: 'Livrable C : Déclencheurs d\'achat (Triggers)',
          instructions:
            'Identifiez ce qui brise l\'inertie habituelle de l\'acheteur : 1) Déclencheur interne (l\'incident de trop ou la goutte d\'eau opérationnelle) ; 2) Déclencheur externe (l\'échéance imposée, fin de contrat ou date limite réglementaire). Précisez leur niveau de preuve.',
          placeholder: `DÉCLENCHEUR INTERNE (L'incident de trop) :
- Événement précis :
- Statut : [FAIT AVÉRÉ] ou [HYPOTHÈSE À VÉRIFIER]

DÉCLENCHEUR EXTERNE (L'échéance non négociable) :
- Événement précis :
- Statut : [FAIT AVÉRÉ] ou [HYPOTHÈSE À VÉRIFIER]`,
          maxLength: 1500,
        },
        {
          id: 'day02-deliverable-d-objections',
          type: 'text-exercise',
          title: 'Livrable D : Objections majeures et désamorçages',
          instructions:
            'Formulez les 3 anxiétés d\'usage les plus fortes chez votre acheteur (effort d\'apprentissage, doute sur la spécificité de son cas, crainte d\'abandon préalable) et notez pour chacune la réponse ou preuve rationnelle requise pour la désamorcer.',
          placeholder: `OBJECTION 1 (Effort et temps d'apprentissage) :
- Ce que craint l'acheteur :
- Preuve rationnelle requise pour désamorcer :

OBJECTION 2 (Spécificité du contexte) :
- Ce que craint l'acheteur :
- Preuve rationnelle requise pour désamorcer :

OBJECTION 3 (Crainte d'abandon passé) :
- Ce que craint l'acheteur :
- Preuve rationnelle requise pour désamorcer :`,
          maxLength: 2000,
        },
        {
          id: 'day02-deliverable-e-vocabulary',
          type: 'text-exercise',
          title: 'Livrable E : Vocabulaire brut authentique (Voice of Customer)',
          instructions:
            'Listez 5 à 8 expressions, mots ou métaphores réellement employés par votre audience pour décrire son problème, sans vocabulaire marketing d\'expert ni termes creux d\'IA. Indiquez la source de chaque expression (échange oral, avis public, commentaire).',
          placeholder: `1. « expression 1 » (Source : échange client du ...)
2. « expression 2 » (Source : commentaire forum ...)
3. « expression 3 » (Source : avis client ...)
4. « expression 4 »
5. « expression 5 »
6. « expression 6 »`,
          maxLength: 1500,
        },
        {
          id: 'day02-deliverable-final-card',
          type: 'text-exercise',
          title: 'Livrable Final : Synthèse de la fiche acheteur qualitative',
          instructions:
            'Rassemblez l\'ensemble de vos éléments dans cette fiche synthétique prête à l\'emploi. Cette fiche servira de référence directe pour formuler votre promesse au Jour 03 et structurer votre page de vente au Jour 11.',
          placeholder: `FICHE ACHETEUR QUALITATIVE & LEVIERS D'ACHAT :
1. Situation de départ (contexte, outils actuels, contrainte de fond) :
...

2. Frustrations prioritaires :
- Frustration 1 :
- Frustration 2 :
- Frustration 3 :
- Frustration 4 :
- Frustration 5 :

3. Déclencheur principal d'achat (Trigger) :
...

4. Objection majeure à désamorcer en priorité :
...

5. Expressions clés de l'audience à réutiliser :
...`,
          maxLength: 3500,
        },
        {
          id: 'day02-step4-checklist',
          type: 'checklist',
          title: 'Checklist d\'auto-validation en 8 critères observables',
          description:
            'Vérifiez point par point la solidité de votre fiche acheteur avant de valider cette deuxième journée de formation.',
          items: [
            {
              id: 'item-c1-situation-action',
              label: 'Situation ancrée dans l\'action réelle',
              detail:
                "Ma situation de départ décrit une personne dans son contexte d'activité quotidien, avec ses outils habituels et ses contraintes matérielles.",
            },
            {
              id: 'item-c2-five-distinct-frustrations',
              label: 'Cinq frustrations concrètes et distinctes',
              detail:
                'Mes 5 frustrations traitent de frictions différentes (temps, erreurs, retard, dispersion, culpabilité) et ne répètent pas la même idée.',
            },
            {
              id: 'item-c3-triggers-identified',
              label: 'Déclencheurs d\'achat identifiés',
              detail:
                'J\'ai identifié au moins un déclencheur interne (l\'incident de trop) et un déclencheur externe (l\'échéance ou contrainte imposée).',
            },
            {
              id: 'item-c4-real-objections',
              label: 'Objections réelles et anxiétés formulées',
              detail:
                'Mes objections portent sur des doutes d\'usage concrets (effort d\'apprentissage, spécificité, abandon passé) et non sur de simples refus superficiels.',
            },
            {
              id: 'item-c5-voice-of-customer',
              label: 'Vocabulaire brut authentifié (Voice of Customer)',
              detail:
                'J\'ai relevé au moins 5 expressions ou métaphores réellement employées par mon audience, sans jargon marketing artificiel.',
            },
            {
              id: 'item-c6-epistemic-honesty',
              label: 'Honnêteté épistémique respectée',
              detail:
                'Chaque élément est soit rattaché à une observation directe (avis, e-mail, échange), soit explicitement marqué comme [HYPOTHÈSE À VÉRIFIER].',
            },
            {
              id: 'item-c7-buyer-vs-user',
              label: 'Rôle Acheteur vs Utilisateur clarifié',
              detail:
                'J\'ai précisé si mon acheteur est également l\'utilisateur final ou s\'il s\'agit d\'un décideur finançant pour un tiers.',
            },
            {
              id: 'item-c8-offer-neutrality',
              label: 'Neutralité d\'offre respectée',
              detail:
                'Ma fiche acheteur ne mentionne prématurément ni promesse commerciale (Jour 03), ni format d\'outil interactif (Jour 04), ni prix (Jour 04).',
            },
          ],
        },
        {
          id: 'day02-step4-resources',
          type: 'resource',
          title: 'Fiches pratiques & Outils de travail du Jour 02',
          description:
            'Téléchargez ces deux supports au format Markdown pour conserver votre analyse acheteur et auditer la qualité de vos données clients.',
          resources: [
            {
              id: 'fiche-acheteur-qualitative',
              title: 'Fiche pratique : Fiche acheteur qualitative et leviers d\'achat',
              category: 'template',
              format: 'Markdown (.md)',
              description:
                'Matrice complète pour consigner la situation de départ, les 5 frustrations, les forces de Moesta, les déclencheurs et le vocabulaire brut.',
              downloadFilename: 'fiche-acheteur-qualitative-j02.md',
              downloadContent: `# FICHE ACHETEUR QUALITATIVE & LEVIERS D'ACHAT
## AI CREATOR Studio : Jour 02

### 1. CONTEXTE GÉNÉRAL ET RÔLE
- Thématique ({{business}}) : 
- Audience cible en situation ({{targetAudience}}) : 
- Rôle : [ ] L'acheteur est l'utilisateur final / [ ] L'acheteur décide pour un tiers
- Situation de départ concrète (contexte, outils actuels, contrainte de fond) : 

### 2. MATRICE DES 5 FRUSTRATIONS CONCRÈTES
- FRUSTRATION 1 (Temps / Charge) : 
  * Statut : [ ] FAIT AVÉRÉ (Source : ) / [ ] HYPOTHÈSE À VÉRIFIER
- FRUSTRATION 2 (Erreur / Insécurité) : 
  * Statut : [ ] FAIT AVÉRÉ (Source : ) / [ ] HYPOTHÈSE À VÉRIFIER
- FRUSTRATION 3 (Inertie / Retard) : 
  * Statut : [ ] FAIT AVÉRÉ (Source : ) / [ ] HYPOTHÈSE À VÉRIFIER
- FRUSTRATION 4 (Dispersion / Discontinuité) : 
  * Statut : [ ] FAIT AVÉRÉ (Source : ) / [ ] HYPOTHÈSE À VÉRIFIER
- FRUSTRATION 5 (Culpabilité / Comparaison) : 
  * Statut : [ ] FAIT AVÉRÉ (Source : ) / [ ] HYPOTHÈSE À VÉRIFIER

### 3. LES FORCES DU CHANGEMENT (BOB MOESTA)
- PUSH DU PRÉSENT (Pourquoi le statu quo devient intolérable) : 
- PULL DE LA SOLUTION (Ce que le résultat attendu permet concrètement) : 
- ANXIÉTÉ DU CHANGEMENT (Peurs, doutes, barrières de l'inconnu) : 
- HABITUDE DU STATU QUO (Réflexes et bricolages conservés par confort) : 

### 4. DÉCLENCHEURS D'ACHAT (TRIGGERS)
- Déclencheur interne (L'incident de trop) : 
- Déclencheur externe (L'échéance non négociable) : 

### 5. LES 3 OBJECTIONS MAJEURES & DÉSAMORÇAGES
- Objection 1 (Effort et temps) : 
  * Réponse / Preuve rationnelle requise : 
- Objection 2 (Spécificité du cas) : 
  * Réponse / Preuve rationnelle requise : 
- Objection 3 (Crainte d'abandon) : 
  * Réponse / Preuve rationnelle requise : 

### 6. VOCABULAIRE AUTHENTIQUE (Voice of Customer)
- Expression 1 : 
- Expression 2 : 
- Expression 3 : 
- Expression 4 : 
- Expression 5 : 
- Expression 6 : 

### 7. ÉLÉMENTS TRANSFÉRÉS AU JOUR 03 (PROMESSE & POSITIONNEMENT)
- La frustration prioritaire à éliminer : 
- Le résultat concret attendu par l'acheteur : 
- L'alternative bricolée à remplacer définitivement : 
`,
            },
            {
              id: 'grille-audit-mom-test-forces',
              title: 'Grille d\'audit : The Mom Test & Forces du Changement',
              category: 'checklist',
              format: 'Markdown (.md)',
              description:
                'Grille de contrôle éditorial en 6 points pour éliminer les faux positifs de politesse et vérifier la solidité de votre analyse acheteur.',
              downloadFilename: 'grille-audit-mom-test-forces-j02.md',
              downloadContent: `# GRILLE D'AUDIT : THE MOM TEST & FORCES DU CHANGEMENT
## Contrôle qualité de la recherche acheteur : Jour 02

Avant de valider les affirmations de votre fiche acheteur, passez chaque élément au crible de cette grille :

1. [OUI / NON] Les frustrations sont formulées avec des mots simples de tous les jours et ne contiennent aucun mot creux d'IA ("booster", "mindset", "optimiser son plein potentiel").
   -> Si NON : Réécrivez la friction en observant l'action physique qui s'arrête.

2. [OUI / NON] Aucune question hypothétique sur l'avenir n'a été utilisée pour valider le besoin (application stricte de The Mom Test).
   -> Si NON : Supprimez les promesses futures ("j'achèterais bien...") et cherchez ce que la personne a déjà fait dans le passé.

3. [OUI / NON] Les objections portent sur de réelles anxiétés d'effort, de temps ou de spécificité (pas seulement sur le prix facial).
   -> Si NON : Identifiez la peur cachée de l'utilisateur face à la complexité de l'outil.

4. [OUI / NON] Le déclencheur externe est une échéance ou une contrainte de calendrier vérifiable dans le monde réel.
   -> Si NON : Cherchez l'événement extérieur qui oblige à agir maintenant.

5. [OUI / NON] Les affirmations non prouvées par une citation ou une observation directe sont explicitement marquées [HYPOTHÈSE À VÉRIFIER].
   -> Si NON : Apposez immédiatement l'étiquette pour ne pas vous auto-illusionner.

6. [OUI / NON] Aucun choix prématuré de format d'outil (calculateur, quiz, mini-app) ni de prix de vente n'a été introduit dans la fiche acheteur.
   -> Si NON : Retirez toute mention technique qui relève du Jour 04.
`,
            },
          ],
        },
      ],
    },
  ],
};
