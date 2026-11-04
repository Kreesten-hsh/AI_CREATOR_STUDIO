import type { Day } from '../../types/course';

export const day02: Day = {
  id: 'day-02',
  dayNumber: 2,
  sprintId: 'sprint-1',
  title: 'PSYCHOLOGIE & LEVIERS D\'ACHAT',
  italicTitleWord: 'PSYCHOLOGIE',
  objective:
    "Décrire l'acheteur par ses situations, frustrations, déclencheurs d'achat et objections, plutôt que par de simples données démographiques.",
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
            "Au Jour 01, vous avez délimité votre niche : un groupe de personnes confronté à un problème précis. Une distinction fondamentale s'impose immédiatement : l'apprenant d'AI CREATOR Studio (c'est vous, qui construisez votre produit) ne doit jamais être confondu avec votre acheteur final (la personne qui utilisera ou achètera votre création). Que votre offre concerne le fitness, l'apprentissage d'une langue, l'organisation personnelle ou la finance, vous devez analyser la psychologie de votre propre client.",
            "Vous disposez peut-être déjà d'un support existant : un guide PDF, un ebook rédigé, un template Notion, un cahier d'exercices, un tableur avec des formules, ou même des modules de formation générés avec l'aide d'une IA. Vous ne venez pas pour jeter ce travail. Vous venez pour comprendre où se situe la vraie valeur pour votre audience : identifier les parties de votre contenu qui se lisent parfaitement sous forme textuelle, et celles qui génèrent de la friction et appellent une interaction, un calcul ou un diagnostic personnalisé.",
            "Une audience globale désigne un ensemble d'individus partageant une thématique ou un métier (ex. « les professionnels en télétravail » ou « les passionnés de trail »). Un acheteur en situation désigne un membre de cette audience qui subit actuellement une friction aiguë, dont l'inertie habituelle a été rompue par un événement précis, et qui recherche activement une solution opérationnelle pour éliminer cette souffrance.",
            "Sur le marché des produits digitaux, les créateurs utilisent une grande variété de formats : guides PDF, workbooks d'exercices, templates réutilisables, packs de prompts, calculateurs et simulateurs, cours vidéo ou outils web interactifs. Un PDF n'est pas un mauvais produit par défaut, et une page interactive n'est pas supérieure par essence. L'interactivité apporte une valeur réelle uniquement lorsqu'elle automatise un calcul pénible, personnalise instantanément un diagnostic selon le profil ou sauvegarde la progression de l'utilisateur.",
          ],
        },
        {
          id: 'day02-step1-forces-of-progress',
          type: 'prose',
          eyebrow: '1.2 MÉCANIQUE DU CHANGEMENT',
          title: 'Les 5 Anneaux d\'Insights d\'Achat et les 4 Forces de Moesta',
          highlightPill: 'Démographie contextuelle + Tensions d\'arbitrage qualitatives',
          paragraphs: [
            "Pendant des décennies, le marketing traditionnel a enseigné la création de « personas » fondés sur des critères démographiques (âge, situation familiale, loisirs). Comme l'a démontré Adele Revella (Buyer Persona Institute), ces données ne suffisent jamais à expliquer pourquoi une personne décide d'acheter. Les critères démographiques restent utiles pour identifier des contraintes matérielles ou réglementaires, mais la décision d'achat relève des 5 anneaux d'insights d'achat : 1) Les initiatives prioritaires (Priority Initiatives : l'événement ou la rupture qui pousse à agir maintenant) ; 2) Les facteurs de succès (Success Factors : les résultats opérationnels tangibles attendus) ; 3) Les freins perçus (Perceived Barriers : les doutes d'effort, de spécificité ou d'abandon) ; 4) Les critères de décision (Decision Criteria : les attributs précis et comparatifs examinés pour choisir) ; 5) Le parcours d'achat (Buyer's Journey : le cheminement d'évaluation, les influenceurs et les étapes franchies).",
            "Clarifiez également la relation entre acheteur et utilisateur : dans la majorité des contextes solos et B2C, la même personne achète et utilise le produit (recherche de simplicité et de gain de temps immédiat). En B2B ou en contexte familial, l'acheteur valide le budget pour un tiers (recherche de rentabilité, de conformité et de réduction du risque, tandis que l'utilisateur au quotidien exige l'absence de corvée technique).",
            "Pour modéliser cette dynamique, Bob Moesta (Jobs to Be Done) a conceptualisé les 4 Forces du Changement : 1) Le Push du présent (saturation et friction avec le bricolage actuel) ; 2) Le Pull de la solution nouvelle (magnétisme de la vie clarifiée) ; 3) L'Anxiété de la nouveauté (peur de l'échec ou de perdre son temps) ; 4) L'Habitude du statu quo (inertie des réflexes acquis). La relation (Push + Pull) > (Anxiété + Habitude) est une boussole qualitative d'arbitrage humain, et non une formule mathématique prédictive.",
          ],
        },
        {
          id: 'day02-step1-rings-and-objections',
          type: 'prose',
          eyebrow: '1.3 TRIGGERS, OBJECTIONS ET VOCABULAIRE',
          title: 'Déclencheurs, objections réelles et Voice of Customer',
          paragraphs: [
            "Ce qui déclenche la décision d'achat, c'est l'événement déclencheur (Trigger). On distingue : le déclencheur interne (l'incident de trop, comme une erreur sur un calcul ou un temps précieux perdu) et le déclencheur externe (l'échéance non négociable imposée par un calendrier, un contrat ou une obligation réglementaire).",
            "Les objections ne sont pas des refus arbitraires : elles expriment l'anxiété de la nouveauté. Les 3 familles d'objections les plus vives face à un outil numérique sont : 1) L'effort et le temps d'apprentissage perçus (« Je n'ai pas le temps de configurer un nouveau logiciel ») ; 2) La spécificité (« Mon cas est trop particulier pour un modèle générique ») ; 3) La crainte de l'abandon (« J'ai déjà accumulé des guides non lus et des templates inutilisés »).",
            "Pour que votre futur acheteur se reconnaisse instantanément, appliquez les principes de The Mom Test (Rob Fitzpatrick) : appuyez-vous sur des comportements passés réels et des actions vérifiables pour écarter les faux avis de politesse. Relevez le vocabulaire brut réellement employé par l'audience (Voice of Customer) sans verser dans le jargon marketing d'expert ni les formulations creuses d'IA.",
            "Règle épistémique : Chaque élément de votre fiche acheteur doit être classé entre Fait documenté (attesté par un avis, un échange ou une observation traçable), Déduction logique, ou marqué explicitement sous la mention [HYPOTHÈSE À VÉRIFIER].",
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
                'Une créatrice de contenu définit son acheteur cible ainsi : « Femmes de 30 à 45 ans, résidant en métropole, cadres, intéressées par l\'organisation personnelle ». Pourquoi cette approche est-elle insuffisante pour concevoir un produit digital efficace ?',
              options: [
                'Parce que les femmes de moins de 30 ans consomment davantage de produits numériques.',
                'Parce que ces critères démographiques ne renseignent ni sur la friction concrète vécue au quotidien, ni sur l\'outil actuellement bricolé, ni sur l\'événement déclencheur de l\'achat.',
                'Parce que Claude refuse de traiter les profils socio-démographiques dans ses requêtes.',
                'Parce qu\'il est impératif de cibler un public masculin pour rentabiliser un produit digital.',
              ],
              correctIndex: 1,
              explanation:
                "Les données démographiques peuvent encadrer un contexte matériel ou financier, mais elles n'expliquent pas pourquoi un individu décide de passer à l'action à un moment précis. C'est la situation vécue et la rupture du statu quo qui déterminent l'achat.",
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
            "1. Un rôle d'auditeur en Customer Discovery : Claude adopte la posture d'un chercheur neutre qui analyse des données qualitatives sans complaisance marketing.",
            "2. Un diagnostic initial de la matière : le prompt s'adapte que vous disposiez de retours clients réels (Voie 1) ou que vous débutiez sans matière préalable (Voie 2).",
            "3. Un cloisonnement étanche par balises XML : les balises isolent vos notes de contexte des consignes de travail pour éliminer les confusions.",
            "4. L'obligation d'honnêteté épistémique : Claude doit classer chaque élément entre Fait documenté, Déduction logique et Hypothèse à vérifier.",
            "5. Des contraintes négatives absolues : interdiction formelle d'inventer des citations, de fabriquer de fausses certitudes financières ou d'imposer prématurément un format technique ou un prix.",
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
              placeholder: 'Ex. Formateurs en ligne, Salariés en reconversion, Consultants solos...',
              profileBinding: 'targetAudience',
            },
            {
              key: 'business',
              label: "Votre thématique ou domaine d'expertise",
              placeholder: 'Ex. Gestion financière indépendante, Conception pédagogique...',
              profileBinding: 'business',
            },
          ],
          template: `<role>
Tu es un Directeur de Recherche en Customer Discovery et Analyste Spécialisé en Psychologie d'Achat et Modélisation Jobs to Be Done.
Ton rôle est d'analyser des données qualitatives (retours clients, avis, échanges, questions d'élèves ou observations de terrain) pour cartographier le profil réel de l'acheteur d'un produit digital.
Tu appliques une rigueur épistémique totale : tu distingues systématiquement les faits attestés par des observations réelles, les déductions logiques directes et les simples hypothèses non vérifiées.
Tu refuses la complaisance, les portraits démographiques superficiels et les clichés psychologiques.
</role>

<context>
Je poursuis la conception d'un produit digital interactif engagée au Jour 01 d'AI CREATOR Studio.
Voici les données de contexte de mon projet :
- Domaine d'activité ou thématique : {{business}}
- Audience cible en situation : {{targetAudience}}
</context>

<source_material>
[COLLEZ ICI VOTRE MATIÈRE CLIENT BRUTE :
- Extraits de messages, e-mails reçus, commentaires, questions d'élèves ou avis clients
OU
- Retours d'expériences ou notes de consultations passées
OU
- Avis publics et commentaires observés sur des produits concurrents ou des forums spécialisés
OU
- Si vous démarrez sans retours clients formalisés, écrivez simplement : "Je démarre sans données clients directes. Guide-moi pour poser mes hypothèses et préparer mes questions d'entretiens."]
</source_material>

<evidence_rules>
1. FAIT DOCUMENTÉ : Information directement présente dans la matière fournie (citation exacte, avis client identifiable ou comportement vérifiable).
2. DÉDUCTION LOGIQUE : Conséquence directe et raisonnable d'un fait observé, sans extrapolation hasardeuse.
3. HYPOTHÈSE À VÉRIFIER : Toute supposition sur les motivations, freins, déclencheurs ou alternatives qui n'est pas directement attestée par une preuve tangible.
</evidence_rules>

<constraints>
RÈGLES D'INTERDICTION FORMELLES :
- INTERDICTION d'inventer des citations de clients ou de fabriquer de faux verbatims entre guillemets.
- INTERDICTION de créer un portrait démographique superficiel (âge imaginaire, situation de famille sans lien avec l'achat).
- INTERDICTION d'affirmer qu'un acheteur est "prêt à payer" sans trace d'une transaction ou d'un comportement d'achat réel.
- INTERDICTION de fixer prématurément le format technique de l'outil interactif ou son prix (réservé au Jour 04).
- INTERDICTION de rédiger la promesse publicitaire finale (réservée au Jour 03).
- INTERDICTION d'utiliser des tirets cadratins dans ta réponse en français (utilise des deux-points, parenthèses ou virgules).
- INTERDICTION d'employer du jargon creux d'IA ("révolutionnaire", "game-changer", "mindset", "booster son impact").
</constraints>

<task>
PROTOCOLE D'EXÉCUTION ADAPTATIF :

1. ÉVALUATION INITIALE DE LA MATIÈRE :
Examine la section <source_material>.
- CAS A (Matière client réelle ou avis publics fournis) : Réalise directement la cartographie en 6 sections ci-dessous en précisant le niveau de preuve de chaque élément.
- CAS B (Absence de matière client / Démarrage) : Formule 5 hypothèses plausibles pour l'acheteur cible en les marquant explicitement [HYPOTHÈSE À VÉRIFIER], puis propose 4 questions d'entretiens concrètes selon la méthode de The Mom Test pour aller les valider auprès de personnes réelles.
</task>

<output_format>
Structure ta synthèse finale selon ces 8 sections précises (articulant les 5 Anneaux d'Adele Revella et les Forces de Bob Moesta) :

### 1. Situation de départ de l'acheteur
- Description du contexte d'activité concret avant l'apparition de la crise ou du besoin.
- Outils ou contournements actuellement utilisés par défaut (guide PDF existant, tableur, carnet, recherche manuelle, absence d'outil).
- Contrainte majeure non négociable (temps disponible, budget, charge client, niveau technique).
- Rôle : l'acheteur est-il l'utilisateur final direct ou décide-t-il pour un tiers ?

### 2. Initiatives prioritaires & Matrice des 5 Frustrations concrètes (Anneau 1 & Push)
- Déclencheur interne (l'incident de trop, la rupture de patience opérationnelle).
- Déclencheur externe (l'échéance imposée, l'obligation réglementaire, contractuelle ou calendaire).
Pour chacune des 5 frictions :
- Intitulé sobre de la friction.
- Scène vécue concrète (ce qui bloque dans l'action).
- Statut de preuve : [FAIT DOCUMENTÉ avec extrait/source] OU [HYPOTHÈSE À VÉRIFIER].

### 3. Facteurs de succès attendus (Anneau 2 & Pull)
- Résultats opérationnels et personnels concrets que l'acheteur attend de la solution.
- Ce qui lui permet d'affirmer que le problème est résolu de manière tangible.

### 4. Freins perçus et Objections majeures (Anneau 3 & Anxiété)
- Objection 1 (Effort et temps de prise en main perçus).
- Objection 2 (Doute sur la spécificité à son cas particulier).
- Objection 3 (Peur de l'inutilité ou de l'abandon).
- Preuve rationnelle requise pour désamorcer chaque doute.

### 5. Critères de décision (Anneau 4)
- Caractéristiques précises et éléments de comparaison examinés pour choisir une solution face aux alternatives (simplicité, rapidité, indépendance technique, clarté).

### 6. Parcours d'achat (Anneau 5)
- Cheminement d'évaluation, ressources ou avis consultés, personnes influentes dans la décision d'achat.

### 7. Vocabulaire brut de l'audience (Voice of Customer)
- Relevé de 5 à 8 expressions, mots ou métaphores réellement employés par cette audience (si matière fournie), ou 5 formulations à écouter lors des prochains entretiens (si démarrage).

### 8. Matrice de transition vers le Jour 03
- Synthèse de la frustration prioritaire à résoudre pour formuler la promesse au Jour 03.
- Liste des 2 informations manquantes qu'il est indispensable de vérifier auprès d'utilisateurs réels.
</output_format>`,
        },
        {
          id: 'day02-step2-followups',
          type: 'prose',
          eyebrow: '2.2 UTILISATION ET RELANCES',
          title: "Guide d'exécution et bibliothèque de relances ciblées",
          paragraphs: [
            "Collez le prompt dans Claude. Deux voies se présentent selon votre situation :",
            "- Voie 1 (Vous disposez d'avis, d'e-mails ou de retours d'élèves) : Collez vos données dans la zone <source_material>. Claude générera l'audit en précisant les sources textuelles.",
            "- Voie 2 (Vous démarrez sans retours formalisés) : Laissez l'instruction par défaut. Claude formulera des hypothèses étiquetées et préparera vos questions d'entretiens du Mom Test.",
            "Si la réponse de Claude nécessite un ajustement, utilisez l'une de ces 4 relances ciblées :",
          ],
          bullets: [
            "Si les frustrations restent trop abstraites : « Tes frustrations 2 et 4 restent trop générales. Réécris-les en décrivant une action concrète qui s'arrête net : quel document ou écran la personne regarde-t-elle, quelle difficulté rencontre-t-elle et quelle est sa réaction immédiate ? Sans tiret cadratin. »",
            "Si une objection ressemble à une excuse de politesse : « L'objection 1 que tu as rédigée est trop générique ('c'est trop cher'). Remplis-la avec la vraie anxiété d'usage : quelle est la crainte réelle de l'acheteur vis-à-vis de son temps, de son effort ou de sa compétence ? »",
            "Si le vocabulaire extrait contient du jargon marketing d'IA : « Le vocabulaire que tu as listé dans la section 5 contient des termes de communicant ('optimiser', 'scalabilité', 'mindset'). Remplace-les par les mots simples et familiers qu'un professionnel emploie réellement quand il parle de son problème à un pair. »",
            "Pour tester la solidité d'une affirmation : « Dans la section Déclencheurs, tu as classé cet élément comme fait avéré. Indique-moi l'extrait exact de ma source qui l'atteste. Si aucun extrait textuel ne le prouve, requalifie-le en hypothèse et formule une question du Mom Test pour aller le vérifier. »",
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
          eyebrow: '3.1 TRANSPARENCE DÉONTOLOGIQUE',
          title: "Analyse critique du matériau interne (Cas Alexandre V.)",
          paragraphs: [
            "Pour illustrer concrètement la démarche, nous reprenons le fichier de démonstration interne utilisé au Jour 01 : public/demos/pdf-to-hub/avant-pdf-statique.html (« Le Système de Création Régulière », par Alexandre V.).",
            "Avertissement déontologique rigoureux : Ce document est un support de simulation pédagogique conçu pour mettre en évidence les limites interactives d'un fichier PDF statique. Le lecteur affiche une mention « 12 pages », mais le code HTML ne contient physiquement que cinq blocs de pages visibles (Pages 1/12 à 5/12). Nous refusons formellement d'inventer des comportements d'acheteurs réels ou des anecdotes qui ne figurent pas dans le document.",
            "Voici comment extraire une analyse d'acheteur rigoureuse en séparant les faits documentés, les déductions sur le format et les hypothèses à vérifier sur le terrain.",
          ],
        },
        {
          id: 'day02-step3-analysis-8points',
          type: 'prose',
          eyebrow: '3.2 GRILLE DE VÉRITÉ EN 3 COLONNES',
          title: "La Grille de Vérité Documentaire et questions de terrain",
          paragraphs: [
            "1. Page 1 (Couverture) : [FAIT DOCUMENTÉ] Temps de lecture annoncé de 45 minutes, cible nommée (freelances, formateurs, coachs, consultants). L'encadré avertit que l'application nécessite une calculatrice, un carnet ou un tableur annexe. -> Déduction : Le lecteur doit quitter le document pour faire fonctionner la méthode. -> Hypothèse à vérifier : Cette dispersion augmente le taux d'abandon avant la mise en pratique.",
            "2. Page 2 (Diagnostic de capacité) : [FAIT DOCUMENTÉ] Formule de capacité manuelle : (Heures totales - Heures clients - Heures admin) x 0.65 ÷ 2.5h. Tableau statique avec 3 profils. Mention indiquant que tout changement de charge client impose de recalculer manuellement sur carnet. L'affirmation « l'erreur commise par 90 % des professionnels » est une assertion de l'auteur. -> Déduction : Les chiffres sont figés dans un tableau fixe sans adaptation personnalisée. -> Hypothèse à vérifier : Un simulateur interactif calculant automatiquement la capacité hebdomadaire apporterait plus de valeur que la formule statique du PDF.",
            "3. Page 3 (Matrice des 3 Piliers) : [FAIT DOCUMENTÉ] Recommandation d'équilibrer Fondation (40 %), Preuve (40 %) et Conversion (20 %) sur un rythme mardi, jeudi, samedi. -> Déduction : Répartition théorique sans outil pour vérifier le respect du dosage. -> Hypothèse à vérifier : Les créateurs peinent à doser leurs publications et recherchent un outil visuel de catégorisation.",
            "4. Page 4 (Feuille de route 30 jours) : [FAIT DOCUMENTÉ] 11 tâches planifiées sur 4 semaines avec cases à cocher imprimées, invitant expressément à imprimer la page pour cocher au stylo, tout en laissant la possibilité de reporter les tâches sur un autre support. -> Déduction : Le support invite à une rupture physique papier pouvant gêner le travail sur écran s'il préfère un outil numérique interactif. -> Hypothèse à vérifier : L'utilisateur qui ne souhaite pas imprimer abandonne plus facilement le suivi, et une liste interactive avec sauvegarde en ligne réduirait cet abandon.",
            "5. Page 5 (Prompt & Limites du format) : [FAIT DOCUMENTÉ] Un prompt textuel comportant 3 champs entre crochets et un encadré récapitulant les limites du PDF (calculs externes, pas de tri personnalisé, cases non cochables, pas de sauvegarde). -> Déduction : L'utilisateur doit copier-coller manuellement le texte et éditer lui-même les crochets dans une autre fenêtre. -> Hypothèse à vérifier : Un générateur de prompt dynamique avec champs formulaires évite les erreurs de manipulation.",
            "Questions d'entretiens recommandées (The Mom Test) : Pour valider ces hypothèses auprès de professionnels de cette cible sans leur poser de questions suggestives ni présupposer une action, un créateur devrait demander : 1) « La dernière fois que tu as essayé d'organiser ton calendrier de création, comment as-tu évalué ton temps disponible ? » ; 2) « La dernière fois que tu as utilisé une ressource pour organiser ou suivre un plan, comment l'as-tu utilisée concrètement ? » (puis, selon la réponse : « Qu'as-tu fait des outils ou exercices proposés ? ») ; 3) « Quel outil utilises-tu aujourd'hui pour planifier tes tâches et qu'est-ce qui t'agace le plus dans son utilisation ? »",
          ],
        },
        {
          id: 'day02-step3-pitfalls',
          type: 'prose',
          eyebrow: '3.3 VIGILANCE ET ANTI-HALLUCINATION',
          title: 'Déconstruction critique et pièges à éviter',
          paragraphs: [
            "Dans de nombreux cours de marketing génériques, on affirmerait ici : « Les consultants sont prêts à payer un abonnement de 29 euros par mois pour un outil de gestion éditoriale interactif ». Existe-t-il la moindre preuve de vente dans notre document source ? Aucune. Sur le marché des outils professionnels et de la formation, beaucoup d'indépendants manifestent une certaine réserve face à l'accumulation d'abonnements logiciels récurrents peu utilisés. Cette observation générale de marché constitue une hypothèse qualitative plausible pour le studio, mais elle n'est pas issue d'une mesure statistique de notre document test. Elle est donc rejetée comme certitude et conservée comme simple hypothèse de travail, qui sera mise à l'épreuve au Jour 04 (Format et prix) et au Jour 25 (Vente réelle).",
            "Prenez garde à ces trois pièges fréquents lors de la rédaction de votre fiche acheteur :",
          ],
          bullets: [
            "Comprendre la pluralité d'une objection de prix : Quand un prospect dit « c'est trop cher », cette objection peut refléter une perception insuffisante de la valeur, une contrainte budgétaire, une priorité différente, un manque de confiance ou une comparaison avec une alternative. Ne présumez pas systématiquement qu'il s'agit d'un simple problème d'argumentaire de valeur sans vérifier ses contraintes réelles.",
            "Projeter ses propres habitudes sur son client : Parce que vous aimez configurer des outils complexes, ne présumez pas que votre acheteur partage cette passion. Votre acheteur veut que son blocage disparaisse en 3 clics.",
            "Inventer des verbatims stylisés : Ne récrivez pas les propos de vos clients pour les rendre plus élégants. Les expressions familières ou spontanées sont les meilleurs révélateurs de la friction réelle.",
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
          title: 'Vos livrables du Jour 02 et deux voies d\'exécution',
          paragraphs: [
            "C'est votre tour de cartographier la psychologie et les leviers d'achat de votre propre audience cible. Vous allez renseigner et enregistrer cinq livrables distincts et une synthèse finale dans les espaces ci-dessous :",
            "- Voie 1 (Vous vendez déjà ou disposez de retours clients réels) : Appuyez-vous sur des données réelles (e-mails reçus, questions d'élèves, réclamations, commentaires, avis). Renseignez vos livrables en étiquetant chaque fait appuyé sur une source par la mention [FAIT OBSERVÉ / SOURCE : ...].",
            "- Voie 2 (Vous êtes en phase de conception ou de lancement) : Ne fabriquez aucun faux client imaginaire. Formulez des déductions raisonnables et classez chaque point sous la mention [HYPOTHÈSE À VÉRIFIER]. Vous utiliserez cette fiche comme grille d'entretien pour vos futurs échanges exploratoires.",
            "- Livrable A : Situation de départ de votre acheteur en action.",
            "- Livrable B : Vos 5 frustrations concrètes (avec statut Fait documenté ou Hypothèse à vérifier).",
            "- Livrable C : Vos déclencheurs d'achat (1 Trigger interne + 1 Trigger externe).",
            "- Livrable D : Vos 3 objections majeures et leurs désamorçages rationnels.",
            "- Livrable E : Vocabulaire brut authentique (5 à 8 expressions réelles ou à écouter).",
            "- Livrable Final : Votre fiche acheteur qualitative complète.",
          ],
        },
        {
          id: 'day02-deliverable-a-situation',
          type: 'text-exercise',
          title: 'Livrable A : Situation de départ de votre acheteur',
          instructions:
            'Décrivez le contexte d\'activité habituel de votre acheteur avant la crise : quel est son métier ou sa situation, quels outils utilise-t-il aujourd\'hui par défaut (guide PDF existant, tableur bancal, carnet, calculatrice, recherche manuelle), quelle est sa contrainte de fond non négociable (temps, budget, niveau technique), et est-il également l\'utilisateur final ?',
          placeholder:
            "Exemple : Formateur indépendant animant des sessions hebdomadaires, utilisant des fiches PDF statiques et un tableur de notes, disposant de moins de 2 heures pour préparer ses modules, achetant l'outil pour son usage propre...",
          maxLength: 1500,
        },
        {
          id: 'day02-deliverable-b-frustrations',
          type: 'text-exercise',
          title: 'Livrable B : Matrice des 5 frustrations concrètes',
          instructions:
            'Détaillez 5 frictions distinctes rencontrées dans son fonctionnement actuel (temps perdu, risque d\'erreur, retard, dispersion, complexité). Précisez pour chacune la scène vécue sur le terrain et son statut épistémique : [FAIT OBSERVÉ avec source] ou [HYPOTHÈSE À VÉRIFIER].',
          placeholder: `FRUSTRATION 1 (Temps / Charge) :
- Scène vécue :
- Statut : [FAIT OBSERVÉ / Source : ...] ou [HYPOTHÈSE À VÉRIFIER]

FRUSTRATION 2 (Erreur / Insécurité) :
- Scène vécue :
- Statut :

FRUSTRATION 3 (Inertie / Retard) :
- Scène vécue :
- Statut :

FRUSTRATION 4 (Dispersion / Discontinuité) :
- Scène vécue :
- Statut :

FRUSTRATION 5 (Complexité / Abandon) :
- Scène vécue :
- Statut :`,
          maxLength: 2500,
        },
        {
          id: 'day02-deliverable-c-triggers',
          type: 'text-exercise',
          title: 'Livrable C : Déclencheurs d\'achat (Triggers)',
          instructions:
            'Identifiez ce qui brise l\'inertie habituelle de l\'acheteur : 1) Déclencheur interne (l\'incident de trop ou la goutte d\'eau opérationnelle) ; 2) Déclencheur externe (l\'échéance imposée, fin de contrat ou date limite réglementaire). Précisez leur statut de preuve.',
          placeholder: `DÉCLENCHEUR INTERNE (L'incident de trop) :
- Événement précis :
- Statut : [FAIT OBSERVÉ] ou [HYPOTHÈSE À VÉRIFIER]

DÉCLENCHEUR EXTERNE (L'échéance non négociable) :
- Événement précis :
- Statut : [FAIT OBSERVÉ] ou [HYPOTHÈSE À VÉRIFIER]`,
          maxLength: 1500,
        },
        {
          id: 'day02-deliverable-d-objections',
          type: 'text-exercise',
          title: 'Livrable D : Objections majeures et désamorçages',
          instructions:
            'Formulez les 3 anxiétés d\'usage les plus fortes chez votre acheteur (effort d\'apprentissage, doute sur la spécificité de son cas, crainte d\'inutilité ou d\'abandon préalable) et notez pour chacune la réponse ou preuve rationnelle requise pour la désamorcer.',
          placeholder: `OBJECTION 1 (Effort et temps d'apprentissage) :
- Ce que craint l'acheteur :
- Preuve rationnelle requise pour désamorcer :

OBJECTION 2 (Spécificité du contexte) :
- Ce que craint l'acheteur :
- Preuve rationnelle requise pour désamorcer :

OBJECTION 3 (Crainte d'inutilité ou d'abandon) :
- Ce que craint l'acheteur :
- Preuve rationnelle requise pour désamorcer :`,
          maxLength: 2000,
        },
        {
          id: 'day02-deliverable-e-vocabulary',
          type: 'text-exercise',
          title: 'Livrable E : Vocabulaire brut authentique (Voice of Customer)',
          instructions:
            'Listez 5 à 8 expressions, mots ou métaphores réellement employés par votre audience pour décrire son problème, sans vocabulaire marketing d\'expert ni termes creux d\'IA. Indiquez la source de chaque expression ou consignez-la comme formulation à écouter lors de vos entretiens.',
          placeholder: `1. « expression 1 » (Source : retour client du ... OU à écouter en entretien)
2. « expression 2 » (Source : ...)
3. « expression 3 » (Source : ...)
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
            'Rassemblez l\'ensemble de vos éléments dans cette fiche synthétique articulant les 5 Anneaux d\'Adele Revella et les Forces de Moesta. Cette fiche servira de référence directe pour formuler votre promesse au Jour 03 et structurer votre offre au Jour 04.',
          placeholder: `FICHE ACHETEUR QUALITATIVE & LES 5 ANNEAUX D'INSIGHTS D'ACHAT :
1. Situation de départ et Rôle (contexte, outils actuels, contrainte de fond, acheteur vs utilisateur) :
...

2. Initiatives prioritaires & Déclencheurs (Anneau 1 : ce qui rompt le statu quo, incident de trop ou échéance) :
...

3. Facteurs de succès attendus (Anneau 2 : résultats opérationnels et personnels concrets visés) :
...

4. Freins perçus & Objections majeures (Anneau 3 : craintes d'effort, de spécificité, preuves rationnelles) :
...

5. Critères de décision (Anneau 4 : critères comparatifs et ergonomiques clés pour choisir) :
...

6. Parcours d'achat (Anneau 5 : étapes d'évaluation, avis consultés, personnes influentes) :
...

7. Vocabulaire brut retenu (Voice of Customer : expressions spontanées de l'audience) :
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
              label: 'Situation ancrée dans l\'action réelle et rôle clarifié',
              detail:
                "Ma situation de départ décrit une personne dans son contexte d'activité quotidien avec ses outils habituels, et clarifie si l'acheteur est l'utilisateur final ou un tiers.",
            },
            {
              id: 'item-c2-five-distinct-frustrations',
              label: 'Cinq frustrations concrètes et distinctes',
              detail:
                'Mes 5 frustrations traitent de frictions différentes (temps, erreurs, retard, dispersion, complexité) et ne répètent pas la même idée.',
            },
            {
              id: 'item-c3-triggers-identified',
              label: 'Initiatives prioritaires et déclencheurs identifiés (Anneau 1)',
              detail:
                'J\'ai identifié l\'événement qui brise le statu quo : déclencheur interne (incident de trop) et déclencheur externe (échéance ou contrainte imposée).',
            },
            {
              id: 'item-c4-success-factors',
              label: 'Facteurs de succès formulés (Anneau 2)',
              detail:
                'Les résultats opérationnels et personnels concrets que l\'acheteur attend pour considérer son problème résolu sont définis sans promesse creuse.',
            },
            {
              id: 'item-c5-real-objections',
              label: 'Freins perçus et objections désamorcées (Anneau 3)',
              detail:
                'Mes objections portent sur de réelles anxiétés d\'usage (effort d\'apprentissage, spécificité, abandon passé) avec la preuve rationnelle requise.',
            },
            {
              id: 'item-c6-decision-and-journey',
              label: 'Critères de décision et parcours d\'achat précisés (Anneaux 4 & 5)',
              detail:
                'Les critères précis examinés pour comparer les options et le cheminement de décision avec les prescripteurs éventuels sont documentés.',
            },
            {
              id: 'item-c7-voice-of-customer',
              label: 'Vocabulaire brut authentifié ou balisé (Voice of Customer)',
              detail:
                'J\'ai relevé ou ciblé au moins 5 expressions ou métaphores réellement employées par mon audience, sans jargon marketing artificiel.',
            },
            {
              id: 'item-c8-epistemic-and-offer-neutrality',
              label: 'Honnêteté épistémique et neutralité d\'offre',
              detail:
                'Chaque élément est classé entre fait et hypothèse. La fiche ne mentionne prématurément ni promesse commerciale (Jour 03), ni format d\'outil (Jour 04), ni prix (Jour 04).',
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
                'Matrice complète pour consigner la situation de départ, les 5 frustrations étiquetées, les forces de Moesta, les déclencheurs et le vocabulaire brut.',
              downloadFilename: 'fiche-acheteur-qualitative-j02.md',
              downloadContent: `# FICHE ACHETEUR QUALITATIVE & LES 5 ANNEAUX D'INSIGHTS D'ACHAT
## AI CREATOR Studio : Jour 02

### 1. CONTEXTE GÉNÉRAL ET RÔLE (Acheteur vs Utilisateur)
- Thématique ({{business}}) : 
- Audience cible en situation ({{targetAudience}}) : 
- Rôle : [ ] L'acheteur est l'utilisateur final direct / [ ] L'acheteur décide pour un tiers
- Situation de départ concrète (contexte quotidien, outils actuels, contrainte de fond) : 

### 2. ANNEAU 1 : INITIATIVES PRIORITAIRES & FRUSTRATIONS (Push & Triggers)
- Déclencheur interne (L'incident de trop, rupture de patience) : 
- Déclencheur externe (L'échéance non négociable, obligation réglementaire ou calendaire) : 
- FRUSTRATION 1 (Temps / Charge) : 
  * Statut : [ ] FAIT OBSERVÉ (Source : ) / [ ] HYPOTHÈSE À VÉRIFIER
- FRUSTRATION 2 (Erreur / Insécurité) : 
  * Statut : [ ] FAIT OBSERVÉ (Source : ) / [ ] HYPOTHÈSE À VÉRIFIER
- FRUSTRATION 3 (Inertie / Retard) : 
  * Statut : [ ] FAIT OBSERVÉ (Source : ) / [ ] HYPOTHÈSE À VÉRIFIER
- FRUSTRATION 4 (Dispersion / Discontinuité) : 
  * Statut : [ ] FAIT OBSERVÉ (Source : ) / [ ] HYPOTHÈSE À VÉRIFIER
- FRUSTRATION 5 (Complexité / Abandon) : 
  * Statut : [ ] FAIT OBSERVÉ (Source : ) / [ ] HYPOTHÈSE À VÉRIFIER

### 3. ANNEAU 2 : FACTEURS DE SUCCÈS (Success Factors & Pull)
- Résultat opérationnel tangible attendu (ce qui change concrètement dans sa journée) : 
- Critère d'évaluation personnel (soulagement, sérénité, fierté d'accomplissement) : 

### 4. ANNEAU 3 : FREINS PERÇUS & OBJECTIONS MAJEURES (Perceived Barriers & Anxiétés)
- Objection 1 (Effort et temps de prise en main perçus) : 
  * Preuve rationnelle requise pour désamorcer : 
- Objection 2 (Spécificité du contexte de l'acheteur) : 
  * Preuve rationnelle requise pour désamorcer : 
- Objection 3 (Crainte d'inutilité ou d'abandon préalable) : 
  * Preuve rationnelle requise pour désamorcer : 

### 5. ANNEAU 4 : CRITÈRES DE DÉCISION (Decision Criteria)
- Caractéristiques précises examinées pour comparer les solutions (simplicité, rapidité, autonomie, format) : 
- L'alternative bricolée concurrente à remplacer définitivement : 

### 6. ANNEAU 5 : PARCOURS D'ACHAT (Buyer's Journey)
- Étapes de recherche et d'évaluation franchies avant la décision : 
- Ressources, pairs, avis ou influenceurs consultés : 

### 7. VOCABULAIRE AUTHENTIQUE (Voice of Customer)
- Expression 1 : 
- Expression 2 : 
- Expression 3 : 
- Expression 4 : 
- Expression 5 : 

### 8. MATRICE DE TRANSITION VERS LE JOUR 03 (PROMESSE & POSITIONNEMENT)
- La frustration prioritaire à éliminer : 
- La promesse de résultat formulable : 
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
