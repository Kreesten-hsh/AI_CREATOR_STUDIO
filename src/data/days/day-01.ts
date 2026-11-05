import type { Day } from '../../types/course';

export const day01: Day = {
  id: 'day-01',
  dayNumber: 1,
  sprintId: 'module-01',
  title: 'PARTIR DE SON EXPERTISE ET IDENTIFIER UN PROBLÈME',
  italicTitleWord: 'PROBLÈME',
  objective:
    "Identifier à partir de sa propre matière de départ (écrite ou non) un problème client concret, observable et prioritaire, sans présupposer qu'une demande commerciale est déjà validée.",
  deliverableSummary:
    'Matière de départ structurée, problèmes candidats et niche orientée problème',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-01-step-1',
      legacyType: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: "Comprendre ce qu'est une vraie niche",
      completionLabel: "Valider l'étape 1 : Comprendre",
      blocks: [
        {
          id: 'day01-step1-clarity-chain',
          type: 'prose',
          eyebrow: '1.1 FONDATIONS DE CLARTÉ',
          title: "La chaîne de clarté de l'offre",
          highlightPill: 'Expertise -> Audience -> Problème -> Mécanisme -> Produit interactif',
          paragraphs: [
            "La cause la plus fréquente d'échec lors de la création d'un premier produit digital réside dans la confusion entre les termes fondamentaux de l'offre. Beaucoup de créateurs conçoivent un produit pour leur « sujet » général au lieu de le concevoir pour résoudre un blocage précis rencontré par une personne en situation.",
            "Pour construire un produit utile qui remplace les hésitations de votre utilisateur, vous devez aligner cinq maillons indispensables :",
          ],
          bullets: [
            "Votre Expertise (ou matière de départ) : Ce que vous maîtrisez, formalisé dans des notes, un guide, une méthode d'accompagnement ou une pratique professionnelle vécue. C'est le socle, pas le produit.",
            "Votre Audience Cible : Un groupe d'individus partageant un contexte opérationnel identique et des contraintes comparables (pas une catégorie sociologique abstraite, mais des professionnels ou individus confrontés aux mêmes tâches).",
            "Le Problème Précis : Une friction concrète, répétée et pénible qui interrompt ou ralentit cette audience dans l'accomplissement d'une action.",
            "La Solution (Mécanisme) : La logique intellectuelle qui résout ce blocage (trier, calculer, diagnostiquer, prioriser, éliminer une incertitude).",
            "Le Produit Digital Interactif : L'outil web autonome qui applique cette solution de manière interactive, en évitant à l'utilisateur les calculs manuels et les hésitations.",
          ],
        },
        {
          id: 'day01-step1-static-vs-interactive',
          type: 'prose',
          eyebrow: '1.2 NATURE DU PRODUIT',
          title: 'Document statique versus Produit digital interactif',
          paragraphs: [
            "Comprenez bien la complémentarité et la différence d'usage entre ces deux supports :",
            "Un document statique (PDF, ebook, livre, guide de référence) reste un format pertinent et très vendu lorsqu'il s'agit de transmettre un savoir linéaire à lire, étudier ou archiver. En revanche, dès que le lecteur doit effectuer des calculs à la main, diagnostiquer son propre cas ou filtrer de nombreuses options, le support statique lui laisse toute la charge d'adaptation.",
            "Un produit digital interactif apporte une valeur réelle lorsqu'il facilite directement une action : calculer, diagnostiquer, personnaliser, organiser, générer ou prendre une décision.",
            "À la Leçon 01, votre objectif n'est pas encore de décider de la forme technique de votre produit (calculateur, diagnostic, générateur ou parcours guidé). Ce choix d'architecture aura lieu à la Leçon 04. Aujourd'hui, vous devez identifier le blocage réel du quotidien qui justifiera une interaction utile.",
          ],
        },
        {
          id: 'day01-step1-camera-test',
          type: 'prose',
          eyebrow: '1.3 OBSERVATION DU TERRAIN',
          title: 'Le Test de la Caméra et les contournements actuels',
          highlightPill: 'Filmer une scène physique, pas une intention abstraite',
          paragraphs: [
            "Le piège le plus séduisant consiste à démarrer par ce que l'on veut construire : « Je vais créer une application qui fait X ». C'est le biais de la solution prématurée. Dans ce cursus, nous inversons la démarche : nous partons toujours d'une friction documentée. Si le problème n'existe pas dans le quotidien de l'acheteur, le produit le plus soigné restera sans usage.",
            "Une audience ne ressent pas un problème dans l'abstrait. Elle le vit à un instant précis, dans un lieu précis, au milieu d'une action interrompue. Pour savoir si votre problème est exploitable, appliquez le Test de la Caméra : Si je plaçais une caméra vidéo dans la pièce ou un enregistreur d'écran sur l'ordinateur de cette personne, pourrais-je filmer des comportements visibles qui prouvent son blocage ?",
            "On ne peut pas filmer : « elle manque de confiance », « elle veut optimiser son organisation », « elle a un mauvais mindset ». On peut filmer : « à 18h45, elle ouvre 14 onglets dans son navigateur, copie un chiffre dans Excel, efface sa formule avec la touche retour, pousse un soupir et referme son écran sans envoyer son devis ».",
            "Pour qu'un problème vaille la peine d'être résolu, il doit engendrer des conséquences directes : du temps perdu constatable, des erreurs de calcul, du stress opérationnel ou l'abandon pur et simple de l'action. N'inventez jamais de conséquences financières fantaisistes (comme « vous perdez 10 000 euros par mois ») : restez ancré dans des faits vérifiables.",
            "Repérez également les solutions de contournement existantes : quand une personne prend le temps de bricoler une réponse imparfaite (un carnet papier, un tableur Excel bancal, une calculatrice de bureau, des copier-coller de vieux fichiers), elle démontre concrètement que le besoin est déjà actif. Votre futur produit remplacera ce bricolage fastidieux par une expérience fluide et immédiate.",
          ],
        },
        {
          id: 'day01-step1-epistemic-rules',
          type: 'prose',
          eyebrow: '1.4 RIGUEUR ANALYTIQUE',
          title: 'Grille de vérité épistémique et déclaration de niche',
          paragraphs: [
            "Pour éviter l'auto-illusion, vous devez adopter une rigueur épistémique totale en classant chaque affirmation dans l'une de ces trois catégories :",
            "1. OBSERVATION (Le Fait) : Ce que vous avez vu, lu ou mesuré sans interprétation (ex. 8 clients sur 10 m'ont demandé par e-mail comment calculer leur taux net).",
            "2. DÉDUCTION (La Conséquence Logique) : Le lien rationnel direct tiré d'une observation (ex. Comme ils n'ont pas la formule, ils utilisent un calcul approximatif trouvé sur un blog qui omet les cotisations).",
            "3. HYPOTHÈSE (La Supposition à Vérifier) : Ce qui vous paraît probable mais qui n'a pas encore été validé par un fait (ex. Ces indépendants utiliseraient un simulateur web si celui-ci calculait automatiquement leurs charges).",
            "Règle d'or sur la volonté de payer : Ne présentez jamais la volonté de payer comme un fait acquis simplement parce qu'un problème semble douloureux. Savoir si des clients achèteront votre solution reste une hypothèse tant que votre offre n'est pas confrontée à de vrais acheteurs au Module 03 (Leçons 07 à 09).",
            "Une fois ce travail d'observation mené, formulez votre déclaration de niche en une seule phrase : « J'aide [Audience cible en situation] à résoudre [Problème précis et observable] sans [Pénibilité du contournement actuel]. »",
            "Pour choisir votre problème prioritaire (Rang 1) parmi vos pistes, évaluez chaque friction sur 4 dimensions : sa fréquence d'apparition, la gravité de sa conséquence immédiate, la pénibilité de son contournement actuel, et la disponibilité de votre méthode pour le résoudre.",
          ],
        },
        {
          id: 'day01-step1-quiz',
          type: 'quiz',
          title: 'Validation des acquis : Fondations et Niche',
          description:
            'Testez votre capacité à distinguer faits, hypothèses et situations observables avant de passer au prompt Claude.',
          questions: [
            {
              id: 'q1-epistemic-distinction',
              question:
                'Un formateur déclare : « Les graphistes débutants veulent tous un générateur interactif de tarifs pour arrêter de sous-facturer à 15 euros de l\'heure. » Comment qualifiez-vous rigoureusement cette affirmation ?',
              options: [
                'C\'est un fait observé, car la sous-facturation des freelances est un problème fréquent.',
                'C\'est une hypothèse non vérifiée, car elle mélange une situation constatée (la sous-facturation) avec une supposition sur le désir d\'utiliser un outil interactif précis.',
                'C\'est une déduction logique directe, car tout professionnel mal payé cherche immédiatement à acheter une solution technique.',
                'C\'est une preuve de marché suffisante pour commencer à programmer l\'outil.',
              ],
              correctIndex: 1,
              explanation:
                "Confondre l'existence d'une difficulté sur le terrain (la sous-facturation) avec l'adoption d'un outil particulier (le générateur interactif) est l'archétype de la supposition non vérifiée. Rien ne prouve à ce stade que le générateur est la réponse souhaitée par les graphistes.",
            },
            {
              id: 'q2-camera-test',
              question:
                'Laquelle de ces propositions décrit un problème répondant parfaitement au « Test de la Caméra » ?',
              options: [
                '« Mon audience manque cruellement de confiance en elle lors des négociations salariales. »',
                '« Les managers de proximité ont besoin d\'aligner leur vision stratégique avec les enjeux de l\'entreprise. »',
                '« Le responsable d\'équipe ouvre son fichier Excel d\'évaluation, hésite pendant 20 minutes sur la formulation d\'un retour, efface 3 fois son texte et reporte l\'entretien individuel au lendemain. »',
                '« Les micro-entrepreneurs devraient mieux valoriser leur expertise sur le marché. »',
              ],
              correctIndex: 2,
              explanation:
                "La proposition C décrit des actions physiques, temporelles et matérielles immédiatement vérifiables par un observateur externe (hésitation mesurable en minutes, texte effacé, report de l'entretien). Les autres propositions emploient des termes abstraits non observables directement.",
            },
            {
              id: 'q3-premature-format',
              question:
                'Pourquoi est-il déconseillé de décider au Jour 01 que son produit sera « un parcours interactif en 5 étapes avec sauvegarde locale et export PDF » ?',
              options: [
                'Parce que Claude ne sait pas générer de fichiers HTML interactifs.',
                'Parce que le format technique découle du mécanisme de résolution du problème (Jour 04), et que figer la forme avant d\'avoir cerné la douleur risque de fabriquer un gadget inutile.',
                'Parce qu\'il faut obligatoirement créer un PDF avant de faire un site internet.',
                'Parce que la technologie web coûte trop cher pour un débutant.',
              ],
              correctIndex: 1,
              explanation:
                "Le format technique d'un produit n'a de sens que s'il est le plus court chemin pour débloquer l'utilisateur. Fixer le contenant au Jour 01 distrait l'attention de l'analyse fondamentale de la friction client.",
            },
            {
              id: 'q4-workaround-value',
              question:
                'Pourquoi l\'existence d\'un fichier Excel bricolé ou d\'un carnet de notes papier chez votre client cible est-elle un signal encourageant pour votre futur produit ?',
              options: [
                'Parce que vous pourrez copier-coller le code du fichier Excel directement dans Claude.',
                'Parce que cela montre que le client a déjà investi du temps pour tenter de répondre à sa difficulté : le besoin est donc réel et récurrent.',
                'Parce que les utilisateurs de papier n\'achètent jamais de produits digitaux.',
                'Parce que cela démontre que le client refuse catégoriquement d\'utiliser l\'informatique.',
              ],
              correctIndex: 1,
              explanation:
                "Un utilisateur qui prend la peine de fabriquer un contournement imparfait démontre par son comportement que la tâche fait partie de son quotidien. Votre produit aura pour rôle de rendre ce travail plus direct, lisible et fiable.",
            },
          ],
        },
      ],
    },
    {
      id: 'day-01-step-2',
      legacyType: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: "Prompt d'extraction de niche",
      completionLabel: "Valider l'étape 2 : Prompt Claude",
      blocks: [
        {
          id: 'day01-step2-explainer',
          type: 'prose',
          eyebrow: '2.1 MÉTHODE DE PILOTAGE',
          title: 'Comment piloter Claude pour auditer votre matière',
          paragraphs: [
            "Pour obtenir une analyse produit rigoureuse et non une réponse complaisante de l'IA, le prompt du Jour 01 combine quatre exigences d'ingénierie :",
            "1. Un rôle d'analyste critique : Claude est positionné en auditeur qui refuse les flatteries marketing, traque les généralités et teste la réalité opérationnelle du problème.",
            "2. Un cloisonnement par balises XML : Les balises isolent vos données brutes des consignes de traitement, évitant que Claude ne confonde votre contexte avec ses ordres d'exécution.",
            "3. Un protocole socratique adaptatif : Si votre matière de départ est incomplète ou si vous partez de votre pratique sans notes rédigées, Claude a pour consigne de poser une seule question ciblée à la fois (jusqu'à 3 questions) avant de produire la synthèse.",
            "4. Des contraintes négatives strictes : Interdiction formelle d'inventer des études de marché, des pourcentages imaginaires, de faux témoignages ou d'imposer prématurément un format d'outil.",
          ],
        },
        {
          id: 'day01-step2-master-prompt',
          type: 'prompt-builder',
          title: 'Prompt Maître : Extraction et hiérarchisation des problèmes cibles',
          description:
            'Ajustez votre thématique et votre audience cible ci-dessous. Le prompt XML compilé se met à jour instantanément, prêt à être copié dans Claude (offre gratuite).',
          deliverableTarget: 'sales-copy',
          fields: [
            {
              key: 'business',
              label: "Votre thématique ou domaine d'expertise",
              placeholder: 'Ex. Nutrition et organisation des repas, Conseil B2B...',
              profileBinding: 'business',
            },
            {
              key: 'targetAudience',
              label: 'Votre audience cible visée',
              placeholder: 'Ex. Salariés en télétravail avec moins de 30 min de pause...',
              profileBinding: 'targetAudience',
            },
          ],
          template: `<role>
Tu es un Directeur Produit Senior et Analyste Spécialisé en Problem Discovery.
Ton rôle n'est pas d'écrire du texte marketing ni de flatter l'utilisateur, mais de déconstruire avec rigueur une matière de départ pour en extraire des problèmes clients réels, observables et prioritaires.
Tu appliques une épistémologie stricte : tu distingues systématiquement les faits prouvés, les déductions logiques et les simples hypothèses non vérifiées.
</role>

<context>
Je démarre la création d'un produit digital interactif destiné à résoudre une friction concrète pour mon audience.
Voici les données initiales de mon projet :
- Domaine d'activité ou thématique : {{business}}
- Audience cible visée : {{targetAudience}}
</context>

<source_material>
[COLLEZ ICI VOTRE MATIÈRE BRUTE :
- Extrait de document, tableur ou guide existant
OU
- Vos notes personnelles décrivant ce que vous faites pour vos clients
OU
- Si vous partez de votre pratique sans notes, écrivez simplement : "Je pars d'une expertise implicite non rédigée, pose-moi tes questions."]
</source_material>

<epistemic_rules>
1. OBSERVATION (Fait) : Élément textuel explicitement présent dans la matière source fournie ou comportement physique directement constatable sur le terrain.
2. DÉDUCTION : Conséquence logique directe découlant d'une observation, sans extrapolation hasardeuse.
3. HYPOTHÈSE À VÉRIFIER : Toute supposition, tout besoin présumé, toute intention d'achat ou tout comportement qui n'est pas formellement attesté par la matière.
</epistemic_rules>

<constraints>
RÈGLES D'INTERDICTION FORMELLES (NEGATIVE PROMPTING) :
- INTERDICTION d'inventer des études de marché, des pourcentages, des ratios ou des statistiques chiffrées (pas de "85 % des gens pensent que...").
- INTERDICTION de fabriquer des témoignages d'acheteurs fictifs ou de faux verbatim de clients.
- INTERDICTION d'affirmer qu'une audience est "prête à payer" ou de formuler une certitude sur la volonté de payer sans preuve de transaction réelle.
- INTERDICTION de choisir ou de suggérer prématurément le format technique final du produit (calculateur, quiz, mini-app, etc. : ce choix est réservé au Jour 04).
- INTERDICTION de générer du code (HTML, CSS, JavaScript).
- INTERDICTION de suggérer ou d'imposer un prix de vente.
- INTERDICTION d'imposer une quelconque palette de couleurs ou style graphique.
- INTERDICTION d'utiliser des tirets cadratins dans ta réponse en français (utilise des deux-points, parenthèses ou virgules).
- INTERDICTION d'employer du jargon creux ou des clichés d'IA ("révolutionnaire", "game-changer", "booster son potentiel", "optimiser le mindset").
</constraints>

<task>
PROTOCOLE D'EXÉCUTION CONDITIONNEL :

ÉTAPE PRÉALABLE D'ÉVALUATION :
Examine la section <source_material>.
- CAS 1 (Matière incomplète ou expertise non rédigée) : Si la matière fournie ne contient pas assez d'éléments concrets pour identifier une situation précise et des contournements existants, NE GÉNÈRE PAS la synthèse tout de suite. Pose-moi UNE SEULE question ciblée (la plus importante) pour comprendre ce qui bloque réellement mes clients sur le terrain. Attends ma réponse avant d'enchaîner (3 questions au maximum, une par une).
- CAS 2 (Matière suffisante) : Si la matière contient déjà des descriptions de situations, de méthodes ou d'erreurs réelles, produis directement l'analyse complète selon le format de sortie ci-dessous.
</task>

<output_format>
Quand tu rédiges la synthèse finale, respecte rigoureusement cette structure en 6 parties :

### 1. Diagnostic de la matière source
- Synthèse objective de ce qui est présent dans la source (faits observés).
- Relevé des manques majeurs et des affirmations d'auteur non sourcées à écarter.

### 2. Les 3 Problèmes Candidats Identifiés
Pour chacun des 3 problèmes distincts :
- **Intitulé du problème** : Formulé de manière sobre et concrète.
- **Situation observable (Test de la Caméra)** : Scène précise dans l'espace et le temps où la personne subit le blocage.
- **Conséquences concrètes** : Temps perdu, erreurs, stress ou abandons directs (sans promesses financières inventées).
- **Solution et contournement actuels** : Ce que la personne utilise aujourd'hui faute de mieux (carnet, tableur bancal, calculatrice, recherche manuelle).
- **Grille de vérité** :
  * [OBSERVATIONS / FAITS] : Ce qui est attesté.
  * [DÉDUCTIONS] : Ce qui découle logiquement.
  * [HYPOTHÈSES À VÉRIFIER] : Ce qui reste à prouver sur le terrain.

### 3. Classement argumenté des problèmes selon leur urgence
- **Rang 1 (Problème Prioritaire Retenu)** : Justification selon la fréquence, la gravité de la conséquence, la pénibilité de la solution actuelle et la faisabilité avec la matière disponible.
- **Rang 2** : Pourquoi ce problème passe en second.
- **Rang 3** : Pourquoi ce problème passe en troisième.

### 4. Déclaration de niche orientée problème (en une seule phrase)
Rédige une proposition synthétique pour le problème de Rang 1 suivant la structure :
"J'aide [Audience en situation] à résoudre [Problème précis] sans [Pénibilité du contournement actuel]."

### 5. Ce que le produit ne doit PAS faire (Périmètre négatif)
- 3 dérives ou pièges de complexité à proscrire absolument lors des étapes suivantes.

### 6. Liste des informations manquantes à vérifier auprès de vraies personnes
- 3 questions factuelles que je dois aller poser à de vrais utilisateurs de mon audience pour valider mes hypothèses.
</output_format>`,
        },
        {
          id: 'day01-step2-followups',
          type: 'prose',
          eyebrow: '2.2 UTILISATION ET RELANCES',
          title: "Guide d'exécution et bibliothèque de relances",
          paragraphs: [
            "Collez le prompt dans une nouvelle conversation avec Claude. Deux cas se présentent :",
            "- Cas A (Vous avez un document ou des notes) : Collez vos notes dans la zone <source_material>. Claude générera directement la synthèse en 6 parties.",
            "- Cas B (Vous partez de votre pratique sans notes) : Laissez l'instruction par défaut. Claude vous posera une question ciblée à la fois. Répondez simplement avec vos mots habituels. Après 2 ou 3 échanges, il produira votre synthèse.",
            "Si la réponse de Claude nécessite un ajustement, utilisez l'une de ces 4 relances ciblées :",
          ],
          bullets: [
            "Si la situation reste trop théorique : « Ta description du problème de Rang 1 est encore trop théorique. Applique le Test de la Caméra : réécris cette situation en décrivant les gestes physiques exacts, l'heure de la journée, le logiciel ou le support papier que la personne a sous les yeux au moment où elle s'arrête de travailler. »",
            "Si Claude a glissé une supposition dans les faits : « Dans ton tableau de vérité du Problème 2, tu as classé l'affirmation [citer l'affirmation] dans les observations. Or aucun document ne prouve ce fait. Rétrograde cette affirmation dans les hypothèses à vérifier et ajuste ta déduction. »",
            "Si deux problèmes candidats se ressemblent trop : « Les problèmes 1 et 2 traitent de la même difficulté sous deux angles différents. Conserve le problème 1, élimine le problème 2, et propose un troisième problème candidat radicalement distinct, touchant une autre étape du travail de cette audience. »",
            "Pour affûter la déclaration de niche : « Propose-moi 3 variantes de la déclaration de niche en une seule phrase pour le problème de Rang 1 : Variante A focalisée sur l'économie de temps, Variante B focalisée sur l'élimination des erreurs, Variante C concise (moins de 20 mots). Sans tiret cadratin ni superlatif. »",
          ],
        },
      ],
    },
    {
      id: 'day-01-step-3',
      legacyType: 'example',
      number: 3,
      title: 'Exemple guidé',
      subtitle: "Analyse d'un modèle concret",
      completionLabel: "Valider l'étape 3 : Exemple guidé",
      blocks: [
        {
          id: 'day01-step3-context-ethics',
          type: 'prose',
          eyebrow: "3.1 ANALYSE D'UN CAS D'ÉCOLE FICTIF",
          title: 'Démonstration et déconstruction critique',
          paragraphs: [
            "Pour illustrer concrètement la démarche, nous analysons un exemple pédagogique fictif disponible dans le dépôt : public/demos/pdf-to-hub/avant-pdf-statique.html (« Le Système de Création Régulière », exemple pédagogique fictif simulant un guide PDF de 5 pages).",
            "Avertissement pédagogique : Ce document est un cas d'école expressément fictif conçu pour illustrer les frictions pratiques et ergonomiques de la lecture passive d'un document statique. Il ne constitue ni une étude de marché réelle, ni une promesse commerciale. Nous l'analysons avec la même neutralité critique que n'importe quel document brut.",
            "À la Page 2 de ce document, on relève deux affirmations types : « L'erreur commise par 90 % des professionnels... » et « Tout créateur qui dépasse 15 % de son temps court au découragement ».",
            "L'analyse critique produit : D'où provient ce chiffre de 90 % ? Existe-t-il une étude statistique rigoureuse avec échantillon représentatif et intervalle de confiance ? Non. C'est une formule rhétorique classique d'auteur visant à donner du poids à une opinion personnelle. Grâce à nos règles épistémiques :",
          ],
          bullets: [
            "Le chiffre 90 % est déclassé immédiatement en affirmation d'auteur non prouvée.",
            "Le fait réel sous-jacent est simplement : l'auteur observe que beaucoup de créateurs s'épuisent en voulant copier le rythme de créateurs à temps plein.",
            "L'hypothèse de travail devient : les indépendants ont besoin d'adapter leur volume de création à leur charge client réelle pour ne pas abandonner.",
          ],
        },
        {
          id: 'day01-step3-analysis-8points',
          type: 'prose',
          eyebrow: '3.2 DÉROULÉ EN 8 POINTS',
          title: "L'audit complet du document en 8 étapes",
          paragraphs: [
            "Voici comment le protocole s'applique concrètement sur cette matière :",
            "1. Matière de départ : Un document de 5 pages contenant une formule de calcul horaire manuelle, un tableau statique à 3 profils (Solo, Formateur, Coach), une matrice 3 piliers, une feuille de route 30 jours avec des cases vides à cocher au stylo, et un prompt textuel entre crochets.",
            "2. Informations retenues vs rejetées : Retenus comme faits : la formule de capacité (Heures dispo = Heures totales - Clients - Admin), l'existence de 3 profils distincts et les 11 étapes d'action. Rejetées : les statistiques non sourcées (« 90 % », « 15 % du temps »).",
            "3. Les 3 problèmes candidats identifiés : Problème A (Capacité fluctuante : impossibilité de connaître son temps réel de création selon sa charge client sans recalculer à chaque fois), Problème B (Déséquilibre éditorial : difficulté à répartir ses contenus entre confiance, expertise et vente), Problème C (Perte du fil d'exécution : incapacité de suivre un plan sur 30 jours sur un document imprimé non synchronisé).",
            "4. Situations observables (Test de la Caméra) : Pour le Problème A : le lundi matin à 9h00, un freelance ouvre son agenda, constate 3 réunions clients imprévues, sort la calculatrice de son smartphone, tente d'estimer ses heures disponibles, hésite 25 minutes et finit par ouvrir sa boîte mail en repoussant son travail d'écriture.",
            "5. Solutions de contournement actuelles : Le document impose lui-même des bricolages : sortir une calculatrice physique (Pages 1 et 2), ouvrir un carnet ou un tableur annexe, imprimer la page 4 pour cocher au stylo bille, et copier-coller manuellement un prompt dans un traitement de texte.",
            "6. Tableau de vérité : La présence d'une formule en 3 étapes est un fait observé ; la nécessité d'un calcul arithmétique pour progresser est une déduction logique ; le fait que les lecteurs abandonnent à cause de ce calcul manuel est une hypothèse à vérifier sur le terrain.",
            "7. Classement d'urgence : Rang 1 pour le Problème A (Calcul de capacité). C'est le goulot d'étranglement initial et récurrent de chaque semaine. Si le temps disponible n'est pas clarifié, ni la planification (Problème B) ni le suivi à 30 jours (Problème C) ne peuvent fonctionner.",
            "8. Déclaration de niche finale : « J'aide les consultants et freelances en prestation à déterminer leur capacité hebdomadaire réelle de création sans devoir manipuler de calculatrice ni tenir un carnet de calculs statique. »",
          ],
        },
        {
          id: 'day01-step3-pitfalls',
          type: 'prose',
          eyebrow: '3.3 VIGILANCE',
          title: 'Les 3 pièges fréquents de formulation à éviter',
          paragraphs: [
            "Lors de la rédaction de votre propre déclaration de niche, prenez garde à ces trois dérives :",
          ],
          bullets: [
            "Vouloir tout embrasser dans la niche : Dire « J'aide à calculer la capacité, équilibrer les piliers ET suivre le plan 30 jours ». En voulant tout inclure, vous diluez la clarté. Choisissez un seul angle prioritaire pour votre promesse de départ ; les autres facettes enrichiront votre produit sous forme de modules secondaires.",
            "Réintroduire la technologie dans la promesse : Dire « J'aide à calculer sa capacité grâce à un script JavaScript interactif ». Votre utilisateur achète la fin de son incertitude, pas votre pile technologique.",
            "Oublier le contournement actuel : Omettre la fin de la phrase (« sans calculatrice ni carnet bancal »), ce qui prive votre offre de son contraste frappant avec la friction vécue aujourd'hui par l'acheteur.",
          ],
        },
      ],
    },
    {
      id: 'day-01-step-4',
      legacyType: 'your-turn',
      number: 4,
      title: 'À vous de jouer',
      subtitle: 'Formuler votre problème cible',
      completionLabel: "Valider l'étape 4 : À vous de jouer",
      blocks: [
        {
          id: 'day01-step4-intro',
          type: 'prose',
          eyebrow: '4.1 ATELIER PERSONNEL',
          title: 'Vos 4 livrables du Jour 01 et étalonnage',
          paragraphs: [
            "C'est votre tour d'appliquer cette méthode à votre propre domaine. Vous allez renseigner et enregistrer quatre livrables distincts dans les espaces ci-dessous :",
            "- Livrable A : Votre inventaire structuré de matière de départ.",
            "- Livrable B : Vos 3 problèmes candidats.",
            "- Livrable C : Votre classement d'urgence argumenté (Rang 1, 2, 3).",
            "- Livrable D : Votre déclaration de niche en une seule phrase.",
            "Pour étalonner votre niveau d'exigence, comparez ces deux formulations :",
            "Formulation insuffisante : « J'aide les gens qui ont mal au dos à retrouver une posture parfaite grâce à ma méthode interactive. » (Audience floue, symptôme médical large, promesse absolue invérifiable, mention prématurée du format).",
            "Formulation acceptable : « J'aide les développeurs et professionnels assis plus de 7 heures par jour sur écran à corriger les réglages erronés de leur poste responsables de leurs douleurs cervicales à 17h, sans avoir à acheter de siège à 800 euros ni lire un manuel de 60 pages. » (Audience en situation, scène observable en fin de journée, cause précise, contournements coûteux écartés).",
          ],
        },
        {
          id: 'day01-deliverable-a',
          type: 'text-exercise',
          title: 'Livrable A : Votre matière de départ structurée',
          instructions:
            'Rassemblez votre matière de départ : collez ici les extraits clés de votre support (guide, notes de consultation, tableur) ou résumez en une dizaine de lignes le problème récurrent que vous traitez le plus souvent avec vos clients.',
          placeholder:
            "Exemple : Notes sur les 3 questions que me posent systématiquement mes clients au démarrage, extrait de mon tableau de chiffrage ou description de ma pratique orale...",
          maxLength: 2000,
        },
        {
          id: 'day01-deliverable-b',
          type: 'text-exercise',
          title: 'Livrable B : Fiche descriptive de vos 3 problèmes candidats',
          instructions:
            'Pour chacun de vos 3 problèmes candidats, détaillez : intitulé court, situation concrète observable (Test de la Caméra : qui, quand, où, quelle action physique ?), conséquences réelles (temps, erreurs, stress, abandon), solution de contournement actuelle, et grille épistémique (1 fait, 1 déduction, 1 hypothèse).',
          placeholder: `PROBLÈME CANDIDAT 1 :
- Intitulé :
- Situation observable (Test de la Caméra) :
- Conséquences réelles (temps, erreurs, stress, abandon) :
- Contournement actuel (papier, tableur, calculatrice) :
- Faits observés / Déductions / Hypothèses :

PROBLÈME CANDIDAT 2 :
- Intitulé :
- Situation observable :
- Conséquences réelles :
- Contournement actuel :
- Faits / Déductions / Hypothèses :

PROBLÈME CANDIDAT 3 :
- Intitulé :
- Situation observable :
- Conséquences réelles :
- Contournement actuel :
- Faits / Déductions / Hypothèses :`,
          maxLength: 3000,
        },
        {
          id: 'day01-deliverable-c',
          type: 'text-exercise',
          title: 'Livrable C : Classement d\'urgence argumenté (Rang 1, 2, 3)',
          instructions:
            'Désignez votre problème de Rang 1 (le cœur de votre futur premier produit digital). Justifiez votre arbitrage selon sa fréquence, sa gravité immédiate, la pénibilité de son contournement et la disponibilité de votre méthode. Précisez pourquoi les deux autres passent en réserve.',
          placeholder: `RANG 1 (Problème prioritaire retenu) :
[Intitulé du problème]
Justification rationnelle (fréquence, gravité, pénibilité du contournement) :

RANG 2 (En réserve pour module ultérieur) :
[Intitulé] - Pourquoi ce problème passe en second :

RANG 3 (En réserve pour module ultérieur) :
[Intitulé] - Pourquoi ce problème passe en troisième :`,
          maxLength: 1500,
        },
        {
          id: 'day01-deliverable-d',
          type: 'text-exercise',
          title: 'Livrable D : Déclaration de niche en une seule phrase',
          instructions:
            'Rédigez votre déclaration de niche finale suivant la structure canonique, sans mentionner de format technique prématuré : « J\'aide [Audience cible en situation] à résoudre [Problème de Rang 1] sans [Pénibilité du contournement actuel]. »',
          placeholder:
            "J'aide [Audience cible en situation] à [résoudre le problème de Rang 1] sans [pénibilité du contournement actuel].",
          maxLength: 500,
        },
        {
          id: 'day01-step4-checklist',
          type: 'checklist',
          title: 'Checklist d\'auto-validation en 8 critères observables',
          description:
            'Vérifiez point par point la solidité de votre niche avant de valider cette première journée de formation.',
          items: [
            {
              id: 'item-c1-audience',
              label: 'Audience identifiable en situation',
              detail:
                "Mon audience n'est pas une catégorie démographique abstraite, mais un groupe de personnes partageant une situation de travail ou de vie similaire.",
            },
            {
              id: 'item-c2-camera-test',
              label: 'Test de la caméra réussi',
              detail:
                'Mon problème de Rang 1 décrit une scène qu\'un observateur externe pourrait filmer et constater dans le monde réel (gestes, logiciels ouverts, temps d\'hésitation).',
            },
            {
              id: 'item-c3-sober-vocabulary',
              label: 'Vocabulaire sobre et concret',
              detail:
                'Ma description ne comporte aucun superlatif promotionnel, aucun mot creux d\'IA ("révolutionnaire", "magique", "mindset", "booster").',
            },
            {
              id: 'item-c4-measurable-consequences',
              label: 'Conséquences directes et mesurables',
              detail:
                'J\'ai identifié des conséquences opérationnelles directes (temps perdu, erreurs, abandon) sans inventer de pertes financières imaginaires.',
            },
            {
              id: 'item-c5-existing-workaround',
              label: 'Contournement actuel vérifié',
              detail:
                'J\'ai nommé au moins une méthode imparfaite que mon audience utilise aujourd\'hui pour se débrouiller seule (feuille papier, tableur, calculatrice, copier-coller).',
            },
            {
              id: 'item-c6-epistemic-honesty',
              label: 'Honnêteté épistémique respectée',
              detail:
                'Mes affirmations sont classées rigoureusement entre faits avérés, déductions logiques et hypothèses à vérifier sur le terrain.',
            },
            {
              id: 'item-c7-rational-hierarchy',
              label: 'Hiérarchie d\'urgence rationnelle',
              detail:
                'Mes 3 problèmes sont ordonnés selon leur fréquence et leur gravité, avec une justification claire du choix du Rang 1.',
            },
            {
              id: 'item-c8-technical-neutrality',
              label: 'Neutralité technique de la déclaration',
              detail:
                'Ma déclaration finale tient en une seule phrase claire et n\'enferme pas prématurément le produit dans un format technique qui relève du Jour 04.',
            },
          ],
        },
        {
          id: 'day01-step4-resources',
          type: 'resource',
          title: 'Fiches pratiques & Outils de travail du Jour 01',
          description:
            'Téléchargez ces deux supports au format Markdown pour conserver vos analyses et vérifier les réponses fournies par Claude.',
          resources: [
            {
              id: 'fiche-definition-niche-problemes',
              title: 'Fiche pratique : Définition de niche et des 3 problèmes candidats',
              category: 'template',
              format: 'Markdown (.md)',
              description:
                'Matrice complète pour consigner vos informations générales, la décomposition de vos 3 problèmes candidats et votre déclaration finale.',
              downloadFilename: 'fiche-definition-niche-problemes-j01.md',
              downloadContent: `# FICHE PRATIQUE : DÉFINITION DE NICHE ET DES 3 PROBLÈMES CANDIDATS
## AI CREATOR Studio : Jour 01

### 1. INFORMATIONS GÉNÉRALES DU CRÉATEUR
- Nom ou Studio : 
- Thématique / Domaine d'expertise ({{business}}) : 
- Nature de la matière de départ (notes, guide, tableur, savoir oral) : 
- Audience cible visée ({{targetAudience}}) : 

### 2. ANALYSE DU TERRAIN ET DU CONTEXTE DE L'AUDIENCE
- Contexte d'action habituel de l'audience : 
- Moment précis où le blocage principal apparaît : 
- Solution de contournement actuellement utilisée par défaut : 

### 3. MATRICE DES 3 PROBLÈMES CANDIDATS

#### PROBLÈME CANDIDAT 1 :
- Intitulé court : 
- Situation observable (Test de la Caméra) : 
- Conséquences réelles (Temps, Erreurs, Stress, Abandon) : 
- Solution de contournement actuelle : 
- Faits observés : 
- Déductions : 
- Hypothèses à vérifier : 

#### PROBLÈME CANDIDAT 2 :
- Intitulé court : 
- Situation observable (Test de la Caméra) : 
- Conséquences réelles : 
- Solution de contournement actuelle : 
- Faits observés : 
- Déductions : 
- Hypothèses à vérifier : 

#### PROBLÈME CANDIDAT 3 :
- Intitulé court : 
- Situation observable (Test de la Caméra) : 
- Conséquences réelles : 
- Solution de contournement actuelle : 
- Faits observés : 
- Déductions : 
- Hypothèses à vérifier : 

### 4. CLASSEMENT PAR ORDRE D'URGENCE RATIONNELLE
- RANG 1 (Retenu pour le premier produit) : 
  * Justification rationnelle (Fréquence, Gravité, Pénibilité du contournement) : 
- RANG 2 (Réserve pour enrichissement ultérieur) : 
- RANG 3 (Réserve pour enrichissement ultérieur) : 

### 5. DÉCLARATION DE NICHE EN UNE PHRASE
"J'aide [Audience cible en situation] à résoudre [Problème de Rang 1] sans [Pénibilité du contournement actuel]."

### 6. PÉRIMÈTRE NÉGATIF (CE QUE LE PRODUIT NE FERA PAS)
- 1 : 
- 2 : 
- 3 : 

### 7. QUESTIONS FACTUELLES À POSER À DES UTILISATEURS RÉELS
- Question 1 : 
- Question 2 : 
- Question 3 : 
`,
            },
            {
              id: 'fiche-verification-claude',
              title: 'Grille d\'audit anti-hallucination du résultat produit par Claude',
              category: 'checklist',
              format: 'Markdown (.md)',
              description:
                'Grille de contrôle éditorial en 7 points pour auditer la rigueur des réponses de Claude et éliminer toute hallucination.',
              downloadFilename: 'fiche-verification-claude-j01.md',
              downloadContent: `# GRILLE D'AUDIT ANTI-HALLUCINATION DU RÉSULTAT DE CLAUDE
## Contrôle qualité éditorial : Jour 01

Avant de valider l'analyse produite par Claude, vérifiez chaque point ci-dessous. Si une seule case est cochée "NON", appliquez la consigne de correction correspondante :

1. [OUI / NON] La réponse ne contient aucune statistique chiffrée, aucun pourcentage inventé (ex. "80 % des professionnels").
   -> Si NON : Demandez à Claude de supprimer le chiffre et de le requalifier en hypothèse non mesurée.

2. [OUI / NON] Les situations de blocage sont concrètes et visuelles (réussite au Test de la Caméra).
   -> Si NON : Demandez à Claude de réécrire la situation en décrivant l'action physique et l'heure de la scène.

3. [OUI / NON] Claude n'a inventé aucun témoignage d'acheteur ni aucun faux verbatim de client.
   -> Si NON : Supprimez immédiatement les citations inventées.

4. [OUI / NON] Claude n'a pas prétendu savoir si l'audience est "prête à payer" ou "très demandeuse".
   -> Si NON : Reclassez cette mention dans les hypothèses à vérifier sur le terrain.

5. [OUI / NON] Aucun choix de format technique prématuré n'est imposé (pas de mention de calculateur React, de dashboard complexe, etc.).
   -> Si NON : Rappelez à Claude que le format d'outil sera déterminé uniquement au Jour 04.

6. [OUI / NON] Aucun tiret cadratin n'est présent dans le texte français produit.
   -> Si NON : Demandez le remplacement par des deux-points ou des parenthèses.

7. [OUI / NON] Les termes creux de marketing d'IA ("révolutionnaire", "game-changer", "booster votre plein potentiel") sont totalement absents.
   -> Si NON : Appliquez le filtre anti-slop et exigez un vocabulaire sobre et professionnel.
`,
            },
          ],
        },
      ],
    },
  ],
};
