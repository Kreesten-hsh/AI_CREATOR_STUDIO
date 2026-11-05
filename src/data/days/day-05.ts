import type { Day } from '../../types/course';

export const day05: Day = {
  id: 'day-05',
  dayNumber: 5,
  sprintId: 'module-02',
  title: 'CRÉER SON PRODUIT AVEC CLAUDE',
  italicTitleWord: 'CRÉER',
  objective:
    "Transmettre votre matière et votre blueprint à Claude pour concevoir une première version interactive et fonctionnelle de votre produit, directement manipulable dans le navigateur.",
  deliverableSummary: 'Première version fonctionnelle du produit interactif personnel',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-05-step-1',
      legacyType: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: 'Création itérative dans Claude et fonctionnement dans le navigateur',
      completionLabel: "Valider l'étape 1 : Comprendre",
      blocks: [
        {
          id: 'day05-step1-claude-formats',
          type: 'prose',
          eyebrow: '1.1 DE L’APERÇU CLAUDE AU PRODUIT AUTONOME',
          title: 'Comment votre produit prend vie sans infrastructure technique',
          highlightPill: 'Un produit qui s’exécute immédiatement dans le navigateur de votre acheteur',
          paragraphs: [
            "L'un des plus grands atouts de Claude pour les créateurs réside dans sa capacité à produire une application web complète (HTML, styles visuels et logique interactive) directement visible dans son interface.",
            "Pour que votre produit fonctionne sans friction chez votre futur acheteur, trois principes fondamentaux doivent être respectés dès la conception :",
          ],
          bullets: [
            "1. Fonctionnement 100 % côté client (navigateur) : votre produit ne nécessite aucun serveur backend, aucune base de données payante ni aucun compte utilisateur complexe. Dès qu'un utilisateur ouvre votre outil, toute la logique s'exécute directement sur son appareil (ordinateur ou smartphone).",
            "2. Aperçu interactif immédiat : Claude vous présente l'application dans son volet d'aperçu (Artifact ou vue interactive). Vous pouvez tester immédiatement les boutons, saisir des données et observer les calculs sans devoir configurer d'environnement de développement.",
            "3. Indépendance vis-à-vis de Claude pour votre acheteur : votre produit final doit fonctionner chez votre client sans que celui-ci ait besoin d'un compte Claude. Le code généré est un standard web autonome (HTML5, CSS, JavaScript).",
          ],
        },
        {
          id: 'day05-step1-storage-architecture',
          type: 'prose',
          eyebrow: '1.2 SAUVEGARDE ET CONFORT D’USAGE',
          title: 'Comment votre acheteur retrouve ses données sans complication',
          paragraphs: [
            "Lorsqu'un acheteur utilise votre outil interactif (diagnostic, plan d'action, calculateur), il souhaite retrouver ses informations lors de sa prochaine visite :",
          ],
          bullets: [
            "En ligne via votre lien d'accès : le navigateur de votre client conserve naturellement ses saisies grâce au stockage local standard (`localStorage`). Ce mécanisme doit toujours être entouré d'une protection de sécurité (`try / catch`) pour fonctionner même en mode de navigation privée.",
            "Option de sauvegarde portable (Fichier JSON) : pour les utilisateurs prévoyants ou ceux qui changent d'appareil, votre outil peut proposer deux boutons discrets (« Exporter ma sauvegarde » et « Importer ma sauvegarde »). Cela permet de conserver un fichier léger sur son ordinateur ou son téléphone sans dépendre du navigateur.",
          ],
        },
        {
          id: 'day05-step1-iterative-method',
          type: 'callout',
          variant: 'tip',
          title: 'Méthode d’itération ciblée : ne régénérez jamais tout à l’aveugle',
          content:
            "Lorsque vous demandez un ajustement à Claude, ne lui redemandez pas de tout réécrire depuis le début. Décrivez précisément l'élément à modifier (ex. : « Quand l'utilisateur choisit le profil Coach, augmente la capacité hebdomadaire recommandée de 20 % »). Claude ajustera uniquement la fonction concernée sans dégrader le reste de l'interface.",
        },
        {
          id: 'day05-step1-quiz',
          type: 'quiz',
          title: 'Vérification avant création',
          description: 'Validez ces points clés pour aborder sereinement la génération avec Claude.',
          questions: [
            {
              id: 'q-d05-client-side',
              question:
                'Pourquoi privilégions-nous un produit qui s’exécute entièrement dans le navigateur de l’acheteur ?',
              options: [
                'Parce qu’il fonctionne immédiatement sans serveur, sans base de données et sans abonnement technique payant',
                'Parce que le HTML ne fonctionne que si un serveur coûteux est allumé',
                'Parce que cela oblige l’acheteur à acheter un compte Claude',
              ],
              correctIndex: 0,
              explanation:
                'Une application monofichier autonome s’exécute directement dans le navigateur du client, ce qui garantit un coût technique nul et une prise en main instantanée.',
            },
            {
              id: 'q-d05-iteration',
              question:
                'Quelle est la bonne méthode si un calcul de votre outil donne un résultat imprécis lors de votre test dans Claude ?',
              options: [
                'Indiquer à Claude la valeur entrée, le résultat observé et le résultat attendu pour qu’il corrige la formule ciblée',
                'Effacer toute la conversation et abandonner son projet',
                'Régénérer tout le projet avec un prompt généraliste sans précision',
              ],
              correctIndex: 0,
              explanation:
                'L’itération chirurgicale consiste à guider Claude avec des cas de test concrets (entrées, comportement constaté, comportement attendu).',
            },
          ],
        },
      ],
    },
    {
      id: 'day-05-step-2',
      legacyType: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: 'Générer votre produit interactif fonctionnel',
      completionLabel: "Valider l'étape 2 : Prompt Claude",
      blocks: [
        {
          id: 'day05-step2-master-prompt',
          type: 'prompt-builder',
          title: 'Compilateur du Prompt de Construction de votre Produit (Leçon 05)',
          description:
            "Remplissez les informations de votre projet puis copiez le prompt complet dans Claude pour générer votre première version fonctionnelle.",
          deliverableTarget: 'html-app',
          fields: [
            {
              key: 'business',
              label: "Domaine d'expertise",
              placeholder: 'Ex. Conseil en productivité, Nutrition sportive, Gestion financière...',
              profileBinding: 'business',
            },
            {
              key: 'targetAudience',
              label: 'Acheteur final',
              placeholder: 'Ex. Consultants indépendants, Athlètes amateurs, Jeunes actifs...',
              profileBinding: 'targetAudience',
            },
            {
              key: 'productType',
              label: 'Nom et format de votre produit',
              placeholder: 'Ex. Simulateur de Planification & Diagnostic Hebdomadaire',
              profileBinding: 'productType',
            },
            {
              key: 'mainObjective',
              label: 'Résultat concret apporté par l’outil',
              placeholder: 'Ex. Calculer sa capacité réelle et structurer ses priorités en 10 minutes...',
              profileBinding: 'mainObjective',
            },
          ],
          template: `<role>
Tu es un ingénieur produit et développeur web expert dans la création d'applications monofichiers (HTML5, CSS moderne et JavaScript standard sans dépendance externe).
Ton objectif est de créer une application interactive, élégante, simple et immédiatement utilisable dans le navigateur.
Si une information essentielle manque dans mon cahier des charges, pose-moi 2 ou 3 questions courtes avant de générer.
</role>

<context>
Je construis la première version fonctionnelle de mon produit digital pour mes clients :
- Domaine d'expertise : {{business}}
- Public cible : {{targetAudience}}
- Nom du produit : {{productType}}
- Objectif opérationnel pour l'utilisateur : {{mainObjective}}
</context>

<blueprint>
[INSÉREZ ICI LES ÉLÉMENTS CLÉS DE VOTRE BLUEPRINT DE LA LEÇON 04 :
- Les données que l'utilisateur saisit (champs de formulaire, sélecteurs, curseurs)
- La règle métier ou la formule de calcul à appliquer
- Les résultats affichés (diagnostics, listes dynamiques, synthèses)
- La structure souhaitée (2 à 3 sections ou onglets maximum)]
</blueprint>

<technical_instructions>
1. Code autonome : Fournis un code complet dans un fichier HTML unique intégrant la structure, le style CSS et la logique JavaScript standard.
2. Clarté et fluidité : Prévois des valeurs d'exemple réalistes par défaut pour que l'outil produise un résultat pertinent dès son ouverture.
3. Résilience : Entoure les sauvegardes de confort (\`window.localStorage\`) de blocs \`try / catch\` pour que rien ne plante en navigation privée.
4. Adaptabilité mobile : L'interface doit être ergonomique et lisible sur smartphone comme sur ordinateur.
5. Zéro jargon inutile : Les intitulés de boutons et les messages doivent être formulés dans un langage clair et professionnel. Sans tirets cadratins.
</technical_instructions>`,
        },
      ],
    },
    {
      id: 'day-05-step-3',
      legacyType: 'your-turn',
      number: 3,
      title: 'Tester et itérer',
      subtitle: 'Tester son produit dans Claude et valider son bon fonctionnement',
      completionLabel: "Valider la Leçon 05 : Première version fonctionnelle prête",
      blocks: [
        {
          id: 'day05-step3-guidelines',
          type: 'prose',
          eyebrow: '3.1 PROTOCOLE DE TEST IMMÉDIAT',
          title: 'Comment tester et affiner votre première version',
          paragraphs: [
            "Dès que Claude a produit votre application dans son aperçu interactif, effectuez ce test en 3 étapes :",
          ],
          bullets: [
            "1. Test des entrées : modifiez les champs ou déplacez les curseurs. Les résultats (chiffres, jauges, diagnostics) s'ajustent-ils instantanément ?",
            "2. Test des valeurs limites : laissez un champ vide ou saisissez un zéro. L'application reste-t-elle stable sans afficher de message d'erreur bizarre (comme `NaN` ou `undefined`) ?",
            "3. Test de clarté : un acheteur qui ne connaît pas votre méthode comprendrait-il immédiatement ce qu'il doit renseigner ?",
          ],
        },
        {
          id: 'day05-step3-copy-refinements',
          type: 'copy',
          title: 'Modèles de relances ciblées pour corriger rapidement un comportement',
          label: 'RELANCES CHIRURGICALES CLAUDE',
          content: `RELANCE 1 : CORRIGER UN CALCUL OU UNE FORMULE
"Dans le volet de calcul, quand je choisis [OPTION A] et que j'indique [VALEUR], le résultat affiche [VALEUR OBSERVÉE]. Le calcul exact selon ma méthode doit être [FORMULE ATTENDUE]. Ajuste uniquement cette règle de calcul sans modifier le reste du code."

RELANCE 2 : SÉCURISER LES VALEURS PAR DÉFAUT
"Quand un champ est vidé, l'affichage montre parfois un résultat vide ou non défini. Ajoute une valeur par défaut de repli pour que l'interface reste toujours propre et compréhensible."

RELANCE 3 : SIMPLIFIER L'AFFICHAGE SUR MOBILE
"Rends la disposition des sections plus compacte sur écran de smartphone : affiche les contrôles principaux au-dessus du résultat avec une taille de texte bien lisible."`,
          notes:
            "Utilisez ces formulations directes pour ajuster votre outil en 1 ou 2 échanges rapides avec Claude.",
        },
        {
          id: 'day05-checklist',
          type: 'checklist',
          title: 'Critères de validation observables (Leçon 05)',
          description:
            'Cochez chaque point constaté lors de votre manipulation directe dans Claude ou votre navigateur.',
          items: [
            {
              id: 'chk-d05-standalone',
              label: 'Application interactive visible et manipulable',
              detail:
                "L'interface s'affiche correctement avec ses boutons, ses champs de saisie et ses résultats par défaut.",
            },
            {
              id: 'chk-d05-interactions',
              label: 'Calculs et interactions réactifs',
              detail:
                'Modifier une saisie met à jour immédiatement les résultats conformément à votre blueprint.',
            },
            {
              id: 'chk-d05-edge-cases',
              label: 'Comportement stable sur saisies vides ou partielles',
              detail:
                "L'outil reste lisible sans afficher d'erreurs techniques lorsque des champs sont effacés.",
            },
            {
              id: 'chk-d05-complete-scope',
              label: 'Contenu métier fidèle à votre méthode',
              detail:
                'Les intitulés, les options et les résultats correspondent fidèlement à votre expertise personnelle.',
            },
          ],
        },
      ],
    },
  ],
};
