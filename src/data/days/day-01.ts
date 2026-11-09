import type { Day } from '../../types/course';

export const MASTER_PROMPT_1_XML = `<prompt id="PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE" version="2.2">
  <role>
    Tu es un Directeur Artistique Digital Senior et Principal Frontend Designer pour AI CREATOR Studio.
    Ta mission est d'analyser le document métier fourni par l'apprenant, de mener avec lui un parcours structuré en deux phases dans cette même conversation (Phase 1 : cadrage fonctionnel en Leçon 2 ; Phase 2 : direction artistique en Leçon 3), puis de formaliser ses documents de référence :
    1. Mon plan d'application (Product Blueprint : structure, logique, formules, interactions).
    2. Les règles de mon document (Source Fidelity Mapping : matrice des règles source préservées).
    3. Ma fiche de style (Visual Direction Brief : spécification complète du design validé).
  </role>

  <skill_activation_check>
    INSTRUCTION PRIORITAIRE :
    1. Charge et applique le skill ai-creator-design-intelligence (notamment references/art-direction.md, references/app-interface-design.md et references/design-system.md).
    2. Commence obligatoirement ta première réponse par l'une de ces deux mentions exactes :
       - [STATUT SKILL : ACTIF - ai-creator-design-intelligence charge] si les fichiers du skill sont accessibles dans cette session.
       - [STATUT SKILL : NON DETECTE - Application des regles directrices embarquees] si le skill n'est pas détecté.
  </skill_activation_check>

  <context>
    L'apprenant apporte son propre document métier (PDF, guide, tableur, méthode, checklist, support de formation). Il ne possède pas de compétences en programmation ni en design d'interface. Tu dois le guider pas à pas avec clarté, pertinence et pédagogie, en nommant toujours ses documents avec des mots simples : « Mon plan d'application », « Les règles de mon document » et « Ma fiche de style ».
  </context>

  <strict_rules>
    <rule id="R1">INTERDICTION ABSOLUE D'EMETTRE DU CODE HTML/JS DANS CE PROMPT : Tu ne dois sous aucun prétexte générer de code HTML, de balises CSS ou de scripts JavaScript à cette étape. L'objectif exclusif est l'analyse, la sélection fonctionnelle, l'échange visuel et la formalisation des spécifications.</rule>
    <rule id="R2">INTERDICTION DE LA QUESTION GENERIQUE : Ne commence JAMAIS par demander platement « Quel design souhaitez-vous ? » ou « Quelles couleurs voulez-vous ? ». L'apprenant utilise ce système pour être guidé avec des propositions concrètes.</rule>
    <rule id="R3">PROGRESSIVITE ET DEUX PHASES DISTINCTES : Exécute rigoureusement la Phase 1 (fonctionnelle) avant d'aborder la Phase 2 (visuelle). Pose au maximum 1 ou 2 questions courtes à la fois.</rule>
    <rule id="R4">DIRECTIONS ARTISTIQUES ADAPTATIVES ET CONTRASTEES : Les 3 concepts visuels de la Phase 2 doivent découler organiquement du document analysé, du public cible et des réponses de l'apprenant. Ne propose JAMAIS mécaniquement les mêmes 3 styles d'un projet à l'autre.</rule>
    <rule id="R5">SANCTUARISATION DE LA FIDELITE SOURCE : Aucune formule, règle, condition, étape ou nuance du document source ne doit être supprimée ou simplifiée au nom de l'esthétique. Toutes les règles doivent figurer dans le document « Les règles de mon document ».</rule>
  </strict_rules>

  <process_flow>
    <!-- ======================================================== -->
    <!-- PHASE 1 : CADRAGE FONCTIONNEL & FIDELITE SOURCE (LECON 2) -->
    <!-- ======================================================== -->

    <step id="1" name="ANALYSE DOCUMENTAIRE SILENCIEUSE ET SYNTHESE">
      Examine intégralement le document joint :
      - Sujet, finalité et public visé.
      - Sections et contenus essentiels.
      - Données, tableaux, formules mathématiques, règles de calcul, seuils d'alerte et cas limites.
      - Processus, étapes méthodologiques ou grilles d'évaluation.
      Débute ta première réponse par le statut d'activation du Skill, suivi d'une synthèse visible en 3 ou 4 lignes confirmant ta compréhension de la matière source.
    </step>

    <step id="2" name="PROPOSITION DE 3 CONCEPTS D'INTERACTION FONCTIONNELS">
      Dans cette même première réponse, présente 3 concepts d'interaction fonctionnels profondément différents pour exploiter le document :
      Pour chaque concept, précise :
      1. Nom évocateur du concept.
      2. Problème résolu pour l'utilisateur final.
      3. Mécanique d'interaction concrète (saisies, contrôles, mode de calcul ou d'exploration).
      4. Règles du document directement exploitées.
      5. Forces et limites de l'approche.
      Formule une recommandation argumentée vers l'un des trois concepts et invite l'apprenant à choisir son concept d'interaction ou à proposer un ajustement.
    </step>

    <step id="3" name="VALIDATION DU CONCEPT ET DOCUMENTS FONCTIONNELS">
      Dès que l'apprenant a confirmé son choix de concept fonctionnel, génère sans délai les deux documents fonctionnels :
      - Livrable 1 : Mon plan d'application (Product Blueprint : Nom public, promesse utilisateur, public cible, typologie d'application, spécification des entrées utilisateur, moteur logique avec formules exactes et alertes, restitution des sorties).
      - Livrable 2 : Les règles de mon document (Source Fidelity Mapping : Tableau exhaustif reliant chaque élément clé du document original à sa règle de transcription et son mode de contrôle).

      Conclus impérativement cette Phase 1 par le point de passage vers la Leçon 3 :
      « Vos deux documents fonctionnels (« Mon plan d'application » et « Les règles de mon document ») sont formalisés. Veuillez vérifier qu'aucune règle de votre document n'a été oubliée et sauvegarder ces textes sur votre ordinateur. Dès que vous êtes prêt pour la suite, répondez simplement dans cette conversation : "Plan et règles validés, passons au style." »
    </step>

    <!-- ======================================================== -->
    <!-- PHASE 2 : DIRECTION ARTISTIQUE INDEPENDANTE (LECON 3)    -->
    <!-- ======================================================== -->

    <step id="4" name="ENTRETIEN VISUEL CONVERSATIONNEL">
      Dès que l'apprenant envoie le signal de passage à la direction artistique, engage le dialogue visuel :
      - Pose 1 ou 2 questions ciblées sur l'esprit visuel recherché (personnalité, tonalité, univers sensoriel, posture du public).
      - Propose des options contrastées et concrètes tirées du Quadrilatère de dérivation du Skill (Forme, Lumière, Typographie, Matériau).
      - Attends la réponse de l'apprenant.
    </step>

    <step id="5" name="PROPOSITION DE 3 DIRECTIONS ARTISTIQUES CONTRASTEES">
      Sur la base des réponses de l'apprenant, présente 3 directions artistiques radicalement différentes et adaptées au document.
      Pour chaque direction, présente uniquement ces 6 points simples et visuels (sans tokens CSS ni jargon technique) :
      1. Nom court et évocateur.
      2. Phrase décrivant l'ambiance et la personnalité.
      3. Palette visuelle (teintes concrètes de fond, surface, texte et accent).
      4. Esprit typographique en termes simples (ex : ronde et moderne, élégante avec empattements, technique et carrée).
      5. Composition générale de l'écran et mise en scène du résultat principal.
      6. Justification expliquant pourquoi ce style convient au document et à son public.
      Termine en recommandant l'une des 3 pistes avec ton argumentation de Directeur Artistique, puis invite l'apprenant à choisir son style ou à demander un ajustement.
    </step>

    <step id="6" name="SELECTION, AFFINAGE ET LIVRABLE 3 (FICHE DE STYLE)">
      Dès que l'apprenant a indiqué son choix et ses éventuels ajustements (couleurs, polices, densité), formalise le troisième livrable complet :
      - Livrable 3 : Ma fiche de style (Visual Direction Brief : spécification complète du design validé, tokens CSS :root, typographies sculptées, pièce maîtresse interactive, équilibre spatial, responsive 375 px et gestion d'état).
      Cette fiche servira de référence technique au Prompt 2 pour générer le code.

      Conclus impérativement en annonçant :
      « Votre style visuel et votre plan d'application sont validés ! Vos documents fondateurs sont prêts. Vous pouvez maintenant copier et coller le deuxième prompt (PROMPT 2 : GENERATION DU PRODUIT HTML) dans cette même conversation pour générer votre application interactive complète. »
    </step>
  </process_flow>
</prompt>`;

export const PROMPT_ANALYSE_DOC = MASTER_PROMPT_1_XML;

export const PROMPT_CHOIX_IDEE = `Je choisis l'idée numéro [1 / 2 / 3].

Précisions souhaitées pour mon application :
- Public visé : [Ex : dirigeants de TPE, indépendants, clients]
- Fonction principale : [Ex : calcul automatique du besoin de trésorerie]

Formalise maintenant mes deux documents fonctionnels :
1. Mon plan d'application (ce que l'utilisateur saisit, le fonctionnement logique et le résultat affiché).
2. Les règles de mon document (le tableau de toutes les formules, seuils et règles à conserver à 100 %).

N'émets aucun code informatique pour le moment et indique-moi quand tout est prêt pour passer au style.`;

export const day01: Day = {
  id: 'day-01',
  dayNumber: 1,
  moduleId: 'module-01',
  title: 'Journée 1 : Choisir',
  objective:
    'Choisir ton document, équiper Claude du Skill gratuit et sélectionner ton concept pour obtenir ton plan d’application et tes règles.',
  deliverableSummary:
    'Un document sélectionné, le Skill gratuit activé dans Claude et deux documents validés : Mon plan d’application et Les règles de mon document.',
  lessons: [
    {
      id: 'lesson-01',
      lessonNumber: 1,
      moduleId: 'module-01',
      dayId: 'day-01',
      dayNumber: 1,
      navigationTitle: 'Préparer',
      title: 'Préparer son document et configurer Claude',
      italicTitleWord: 'configurer',
      duration: '~15 min',
      objective:
        'Sélectionner ton document, importer le Skill gratuit dans Claude en 7 gestes et préparer tes outils.',
      deliverableSummary:
        'Un document prêt sur ton ordinateur, le Skill activé et une nouvelle conversation ouverte dans Claude.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-01-step-01',
          number: 1,
          title: 'Ton document',
          subtitle: 'Quoi utiliser',
          completionLabel: "J'ai mon document",
          blocks: [
            {
              id: 'l1-s1-prose-doc',
              type: 'prose',
              title: 'CHOISIR TON',
              italicAccent: 'document',
              highlightPill:
                "Un document existant d'une seule page ou un simple tableau Excel suffit si son contenu est utile.",
              paragraphs: [
                "On commence avec un support existant : inutile d'écrire un nouveau document de zéro.",
              ],
              bullets: [
                'PDF, Word ou notes : tu le glisseras tel quel dans Claude.',
                'Tableau Excel : vérifie simplement que tes formules sont bien visibles.',
                'Long guide (+30 pages) : garde uniquement le chapitre le plus pratique pour créer un outil ciblé.',
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Vouloir créer un nouveau document parfait avant de démarrer.',
                correction:
                  "Prends un fichier existant avec des règles claires, même s'il fait une seule page.",
              },
              {
                mistake: 'Choisir un document scanné sans texte sélectionnable.',
                correction:
                  "Vérifie que tu peux copier le texte à la souris avant de l'envoyer à Claude.",
              },
            ],
            tips: [
              'Un simple tableau avec des formules donne souvent les meilleurs outils interactifs.',
            ],
          },
        },
        {
          id: 'lesson-01-step-02',
          number: 2,
          title: 'Le Skill Claude',
          subtitle: 'Installer le zip',
          completionLabel: 'Le Skill est activé',
          blocks: [
            {
              id: 'l1-s2-prose-skill',
              type: 'prose',
              title: 'INSTALLER LE',
              italicAccent: 'skill',
              highlightPill:
                'Ce fichier gratuit apprend à Claude à concevoir des écrans modernes et soignés.',
              paragraphs: [
                'Ce pack donne à Claude le sens du design pour éviter les interfaces génériques.',
              ],
              bullets: [
                "Dans Settings > Capabilities, active 'Code execution and file creation'.",
                "Dans Customize > Skills, clique sur '+' puis choisis '+ Create skill' et 'Upload a skill'.",
                "Sélectionne l'archive ZIP téléchargée ci-dessous et vérifie que le Skill est actif.",
              ],
            },
            {
              id: 'l1-s2-resource-skill-zip',
              type: 'resource',
              title: 'Fichier du Skill',
              description: 'Archive officielle à importer directement dans Claude.',
              resources: [
                {
                  id: 'res-skill-zip',
                  title: 'AI-CREATOR-DESIGN-INTELLIGENCE.zip',
                  category: 'template',
                  description: 'Archive officielle à importer sans la décompresser.',
                  format: 'ZIP',
                  externalUrl: '/downloads/AI-CREATOR-DESIGN-INTELLIGENCE.zip',
                  downloadFilename: 'AI-CREATOR-DESIGN-INTELLIGENCE.zip',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: "Importer le ZIP sans activer l'exécution de code.",
                correction:
                  "Ouvre Settings > Capabilities et active d'abord 'Code execution and file creation'.",
              },
              {
                mistake: "Décompresser l'archive avant de l'importer dans Claude.",
                correction:
                  'Importe directement le fichier .zip téléchargé sans le décompresser.',
              },
            ],
            tips: [
              "Dans Customize > Skills, utilise '+ Create skill' puis 'Upload a skill' pour téléverser le ZIP.",
            ],
          },
        },
        {
          id: 'lesson-01-step-03',
          number: 3,
          title: 'Prêt à lancer',
          subtitle: 'Vérification',
          completionLabel: 'Terminer la Leçon 1',
          blocks: [
            {
              id: 'l1-s3-prose-check',
              type: 'prose',
              title: 'VÉRIFIER TES',
              italicAccent: 'outils',
              highlightPill:
                'Tu peux suivre ce parcours avec un compte Claude gratuit.',
              paragraphs: [
                "Trois vérifications rapides avant de commencer l'analyse de ton document dans Claude.",
              ],
            },
            {
              id: 'l1-s3-checklist-ready',
              type: 'checklist',
              title: 'Vérifications de départ',
              description:
                'Coche ces 3 points pour valider la préparation de tes outils.',
              items: [
                {
                  id: 'chk-doc-ready',
                  label: 'Mon document est prêt sur mon ordinateur.',
                  detail:
                    'Fichier PDF, texte ou tableau avec des formules visibles.',
                },
                {
                  id: 'chk-claude-ready',
                  label: 'Mon compte Claude gratuit est ouvert.',
                  detail:
                    'Une nouvelle conversation vierge est prête à être utilisée.',
                },
                {
                  id: 'chk-skill-imported',
                  label: 'Le fichier ZIP du Skill est importé et actif.',
                  detail:
                    'Vérifié dans Settings > Capabilities et Customize > Skills.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Changer de conversation Claude entre les étapes.',
                correction:
                  'Garde la même discussion ouverte pour que Claude conserve la mémoire de ton document.',
              },
            ],
            tips: [
              'Garde la fenêtre Claude ouverte à côté de cette page pour travailler confortablement.',
            ],
          },
        },
      ],
    },
    {
      id: 'lesson-02',
      lessonNumber: 2,
      moduleId: 'module-01',
      dayId: 'day-01',
      dayNumber: 1,
      navigationTitle: 'Choisir',
      title: 'Analyser son document, identifier 3 interactions et choisir',
      italicTitleWord: 'choisir',
      duration: '~30 min',
      objective:
        'Analyser ton document dans Claude, explorer 3 idées d’outils et valider ton plan d’application ainsi que les règles à conserver.',
      deliverableSummary:
        'Une idée d’outil retenue et deux documents validés : Mon plan d’application et Les règles de mon document.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-02-step-01',
          number: 1,
          title: 'Tes idées',
          subtitle: '3 options',
          completionLabel: 'Claude a proposé 3 idées',
          blocks: [
            {
              id: 'l2-s1-prose-analyse',
              type: 'prose',
              title: 'TROUVER TON',
              italicAccent: 'idée',
              highlightPill:
                'Claude lit ton document et te propose 3 concepts d’outils concrets.',
              paragraphs: [
                'Ouvre une conversation, glisse ton document et colle ce message pour explorer 3 pistes.',
              ],
              bullets: [
                'Glisse ton fichier dans une nouvelle discussion Claude.',
                'Colle le prompt maître ci-dessous sans rien modifier.',
                'Claude analyse ton contenu sans générer de code pour le moment.',
              ],
            },
            {
              id: 'l2-s1-copy-prompt-analyse',
              type: 'copy',
              title: 'À copier dans Claude',
              label: 'PROMPT 1',
              buttonText: 'Copier le prompt',
              defaultExpanded: false,
              content: MASTER_PROMPT_1_XML,
              notes:
                'Glisse ton document dans Claude en même temps que tu colles ce message.',
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Envoyer le message sans joindre son fichier.',
                correction:
                  'Glisse ton document dans la boîte de saisie Claude avant d’envoyer le message.',
              },
              {
                mistake: 'Laisser Claude générer du code tout de suite.',
                correction:
                  'Prends d’abord le temps de choisir la meilleure idée d’outil parmi les 3 propositions.',
              },
            ],
            tips: [
              'Si les 3 idées ne te plaisent pas, demande simplement à Claude 2 nouvelles propositions.',
            ],
          },
        },
        {
          id: 'lesson-02-step-02',
          number: 2,
          title: 'Mon exemple',
          subtitle: 'Comment choisir',
          completionLabel: "J'ai choisi mon idée",
          blocks: [
            {
              id: 'l2-s2-prose-choose',
              type: 'prose',
              title: 'CHOISIR LE',
              italicAccent: 'meilleur',
              highlightPill:
                'Choisis l’outil qui apporte le résultat le plus utile à ton utilisateur, sans compliquer inutilement son utilisation.',
              paragraphs: [
                'Pour notre exemple, partons d’une grille d’évaluation de trésorerie contenant huit données d’entrée.',
                'Elle peut devenir un simulateur qui calcule la situation financière à partir des chiffres saisis.',
              ],
              bullets: [
                'Privilégie l’idée la plus utile pour ton public au quotidien.',
                'Vérifie que tes formules et calculs importants sont bien conservés.',
                'L’utilisateur doit comprendre son résultat sans notice.',
              ],
            },
            {
              id: 'l2-s2-copy-prompt-choix',
              type: 'copy',
              title: 'Message pour valider ton choix',
              label: 'MESSAGE-CHOIX-IDEE',
              content: PROMPT_CHOIX_IDEE,
              notes:
                'Indique à Claude le numéro de l’idée que tu préfères (1, 2 ou 3).',
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake:
                  'Choisir l’idée la plus complexe en pensant qu’elle aura plus de valeur.',
                correction:
                  'Les outils les plus utilisés sont souvent les plus simples et rapides.',
              },
            ],
            tips: [
              'Tu peux demander à Claude de combiner des éléments de deux idées différentes.',
            ],
          },
        },
        {
          id: 'lesson-02-step-03',
          number: 3,
          title: 'Valider le plan',
          subtitle: 'Préparer la suite',
          completionLabel: 'Terminer le Jour 1',
          blocks: [
            {
              id: 'l2-s3-prose-validate',
              type: 'prose',
              title: 'GARDER TON',
              italicAccent: 'plan',
              highlightPill:
                'Conserve ton plan et tes règles sur ton ordinateur avant de passer au Jour 2.',
              paragraphs: [
                'Relis le plan rédigé par Claude pour t’assurer que tes règles importantes y figurent toutes.',
              ],
              bullets: [
                'Enregistre ton document original, ton plan d’application et la liste de tes règles dans un dossier sur ton ordinateur.',
                'Retrouve cette même conversation dans ton historique Claude au Jour 2. Ne recommence pas une nouvelle discussion.',
                'Si un calcul ou une règle manque dans le texte de Claude, demande-lui de l’ajouter.',
              ],
            },
            {
              id: 'l2-s3-checklist-finish',
              type: 'checklist',
              title: 'Validation du Jour 1',
              description:
                'Coche ces 3 points pour valider la première journée du programme.',
              items: [
                {
                  id: 'chk-idea-chosen',
                  label: 'J’ai choisi mon idée parmi les 3 propositions.',
                  detail:
                    'Le concept répond au besoin direct de mes utilisateurs.',
                },
                {
                  id: 'chk-rules-verified',
                  label:
                    'Toutes mes formules et règles figurent bien dans le plan de Claude.',
                  detail:
                    'Mon plan d’application et les règles de mon document sont vérifiés.',
                },
                {
                  id: 'chk-work-saved',
                  label:
                    'J’ai sauvegardé mon plan et mes règles sur mon ordinateur et je reprendrai cette même discussion au Jour 2.',
                  detail:
                    'Tous les documents sont en sécurité sur mon poste pour aborder le Jour 2.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake:
                  'Fermer la discussion Claude sans sauvegarder ses textes sur son ordinateur.',
                correction:
                  'Copie le texte de ton plan d’application et de tes règles dans des fichiers locaux.',
              },
            ],
            tips: [
              'Félicitations, tu as terminé le Jour 1 ! Tes documents sont validés pour le style au Jour 2.',
            ],
          },
        },
      ],
    },
  ],
};
