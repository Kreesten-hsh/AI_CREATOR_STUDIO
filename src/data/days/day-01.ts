import type { Day } from '../../types/course';

export const MASTER_PROMPT_1_XML = `<prompt id="PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE" version="2.3">
  <role>
    Tu es un Directeur Artistique Digital Senior et Principal Frontend Designer pour AI CREATOR Studio.
    Ta mission est d'analyser le document métier fourni par l'apprenant, de mener avec lui un parcours structuré en deux phases dans cette même conversation (Phase 1 : cadrage fonctionnel en Leçon 2 ; Phase 2 : direction artistique en Leçon 3), puis de formaliser ses documents de référence :
    1. Mon plan d'application (Product Blueprint : structure, logique, formules, interactions, code d'accès acheteur).
    2. Les règles de mon document (Source Fidelity Mapping : matrice des règles source préservées).
    3. Ma fiche de style (Visual Direction Brief : spécification complète du design validé et de l'écran de verrouillage).
  </role>

  <skill_activation_check>
    INSTRUCTION PRIORITAIRE :
    1. Charge et applique le skill ai-creator-design-intelligence (notamment references/art-direction.md, references/app-interface-design.md et references/design-system.md).
    2. Commence obligatoirement ta première réponse par l'une de ces deux mentions exactes :
       - [STATUT SKILL : ACTIF - ai-creator-design-intelligence charge] si les fichiers du skill sont accessibles dans cette session.
       - [STATUT SKILL : NON DETECTE - Application des regles directrices embarquees] si le skill n'est pas détecté.
  </skill_activation_check>

  <context>
    L'apprenant apporte son propre document métier (PDF, guide, tableur, méthode, checklist, fiche pratique d'une page, support de formation). Il ne possède pas de compétences en programmation ni en design d'interface. Tu dois le guider pas à pas avec clarté, pertinence et pédagogie, en nommant toujours ses documents avec des mots simples : « Mon plan d'application », « Les règles de mon document » et « Ma fiche de style ».
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
      Formule une recommandation argumentée vers l'un des trois concepts et invite l'apprenant à choisir son concept d'interaction, à préciser son public et à indiquer le code d'accès (ex : CREATOR2026) que ses acheteurs utiliseront pour déverrouiller l'application.
    </step>

    <step id="3" name="VALIDATION DU CONCEPT ET DOCUMENTS FONCTIONNELS">
      Dès que l'apprenant a confirmé son choix de concept fonctionnel, génère sans délai les deux documents fonctionnels :
      - Livrable 1 : Mon plan d'application (Product Blueprint : Nom public, promesse utilisateur, public cible, typologie d'application, code d'accès acheteur retenu [ou proposition d'un code pertinent non trivial comme CREATOR2026 si l'apprenant ne l'a pas précisé], spécification des entrées utilisateur, moteur logique avec formules exactes et alertes, stratégie de sauvegarde [mémoire vive volatile ou localStorage avec export/import JSON manuel], restitution des sorties).
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
      4. Esprit typographique en termes simples (ex : ronde et moderne, élégante avec empattements, manuscrite chaleureuse).
      5. Composition générale de l'écran et mise en scène du résultat principal.
      6. Justification expliquant pourquoi ce style convient au document et à son public.
      Termine en recommandant l'une des 3 pistes avec ton argumentation de Directeur Artistique, puis invite l'apprenant à choisir son style ou à demander un ajustement.
    </step>

    <step id="6" name="SELECTION, AFFINAGE ET LIVRABLE 3 (FICHE DE STYLE)">
      Dès que l'apprenant a indiqué son choix et ses éventuels ajustements (couleurs, polices, densité), formalise le troisième livrable complet :
      - Livrable 3 : Ma fiche de style (Visual Direction Brief : spécification complète du design validé, tokens CSS :root, typographies sculptées, mise en scène de l'écran de verrouillage par code d'accès (.gate), pièce maîtresse interactive, équilibre spatial, responsive 375 px et gestion d'état).
      Cette fiche servira de référence technique au Prompt 2 pour générer le code.

      Conclus impérativement en annonçant :
      « Votre style visuel et votre plan d'application sont validés ! Vos documents fondateurs sont prêts. Vous pouvez maintenant copier et coller le deuxième prompt (PROMPT 2 : GENERATION DU PRODUIT HTML) dans cette même conversation pour générer votre application interactive complète. »
    </step>
  </process_flow>
</prompt>`;

export const PROMPT_ANALYSE_DOC = MASTER_PROMPT_1_XML;

export const PROMPT_CHOIX_IDEE = `Je choisis l'idée numéro [1 / 2 / 3].

Précisions souhaitées pour mon application :
- Public visé : [Ex : créateurs, artisans, formateurs, indépendants]
- Fonction principale : [Ex : calculer automatiquement son prix de vente et son bénéfice net en FCFA ou en euros]
- Code d'accès choisi pour mes acheteurs : [Ex : CREATOR2026]

Formalise maintenant mes deux documents fonctionnels :
1. Mon plan d'application (ce que l'utilisateur saisit, le fonctionnement logique, le résultat affiché et le code d'accès réservé aux acheteurs).
2. Les règles de mon document (le tableau de toutes les formules, seuils et règles à conserver à 100 %).

N'émets aucun code informatique pour le moment et indique-moi quand tout est prêt pour passer au style.`;

export const day01: Day = {
  id: 'day-01',
  dayNumber: 1,
  moduleId: 'module-01',
  title: 'Journée 1 : Choisir',
  objective:
    'Choisir ton document, équiper Claude du Skill gratuit et sélectionner ton idée pour obtenir ton plan d’application et tes règles.',
  deliverableSummary:
    'Un document sélectionné, le Skill gratuit activé dans Claude et deux textes sauvegardés : Mon plan d’application et Les règles de mon document.',
  lessons: [
    {
      id: 'lesson-01',
      lessonNumber: 1,
      moduleId: 'module-01',
      dayId: 'day-01',
      dayNumber: 1,
      navigationTitle: 'Préparer ton document',
      title: 'Préparer son document et configurer Claude',
      italicTitleWord: 'configurer',
      duration: '~15 min',
      objective:
        'Sélectionner ton document existant, importer le Skill gratuit dans Claude en 7 gestes et vérifier tes outils.',
      deliverableSummary:
        'Un document prêt sur ton ordinateur, un compte Claude gratuit ouvert et le Skill installé et actif.',
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
                "Une fiche pratique d'une page ou un tableau avec formules visibles suffit.",
              paragraphs: [
                'Choisis un document existant sur ton ordinateur sans chercher à en rédiger un nouveau.',
              ],
              bullets: [
                'Utilise un document texte, un PDF ou un tableau dont les formules restent visibles.',
                'Si ton guide dépasse 30 pages, garde uniquement le chapitre le plus utile.',
                "Si le texte d'un PDF ne se sélectionne pas, copie ou retranscris les passages utiles.",
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Vouloir rédiger un nouveau document complet avant de commencer.',
                correction:
                  "Prends un support existant contenant des règles claires, même s'il tient sur une seule page.",
              },
              {
                mistake: 'Envoyer un PDF scanné dont le texte ne peut pas être sélectionné.',
                correction:
                  'Récupère une version texte exploitable ou recopie simplement les règles et passages utiles.',
              },
            ],
            tips: [
              'Une fiche pratique d’une page ou un tableau de calcul donne d’excellents outils interactifs.',
            ],
          },
        },
        {
          id: 'lesson-01-step-02',
          number: 2,
          title: 'Le Skill',
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
                'Importe ce pack dans Claude en sept gestes pour éviter les interfaces banales.',
              ],
              bullets: [
                "1-2. Ouvre Settings > Capabilities et active 'Code execution and file creation'.",
                "3-6. Ouvre Customize > Skills, clique sur '+', puis '+ Create skill' et 'Upload a skill'.",
                "7. Sélectionne l'archive ZIP téléchargée sans la décompresser, puis vérifie que le Skill est actif.",
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
                  "1. Ouvre Settings > Capabilities et 2. active d'abord 'Code execution and file creation'.",
              },
              {
                mistake: "Décompresser l'archive avant de l'importer dans Claude.",
                correction:
                  "Dans Customize > Skills > + > + Create skill > Upload a skill, sélectionne le fichier .zip sans le décompresser.",
              },
            ],
            tips: [
              'Une fois le fichier importé, vérifie que le bouton du Skill est bien activé dans la liste.',
            ],
          },
        },
        {
          id: 'lesson-01-step-03',
          number: 3,
          title: 'Prêt',
          subtitle: 'Vérification',
          completionLabel: 'Terminer la Leçon 1',
          blocks: [
            {
              id: 'l1-s3-prose-check',
              type: 'prose',
              title: 'VÉRIFIER TES',
              italicAccent: 'outils',
              highlightPill:
                'Tu peux suivre tout ce parcours avec un compte Claude gratuit.',
              paragraphs: [
                'Vérifie ces trois points rapides sur ton poste avant de passer à la Leçon 2.',
              ],
            },
            {
              id: 'l1-s3-checklist-ready',
              type: 'checklist',
              title: 'Vérifications de départ',
              description:
                'Coche ces 3 points pour confirmer que tout est prêt.',
              items: [
                {
                  id: 'chk-doc-ready',
                  label: 'Mon document est prêt sur mon ordinateur.',
                  detail:
                    'Fiche pratique d’une page, document texte/PDF ou tableau avec formules visibles.',
                },
                {
                  id: 'chk-claude-ready',
                  label: 'Mon compte Claude Free est accessible.',
                  detail:
                    'Tu es connecté et prêt à ouvrir une nouvelle conversation.',
                },
                {
                  id: 'chk-skill-imported',
                  label: 'Le Skill est installé et actif.',
                  detail:
                    'Vérifié dans Settings > Capabilities et Customize > Skills.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Changer de conversation Claude en cours de route.',
                correction:
                  'Dès la Leçon 2, garde la même discussion ouverte pour que Claude conserve ton document.',
              },
            ],
            tips: [
              'Garde la fenêtre Claude ouverte à côté de ce cours pour copier les messages facilement.',
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
      navigationTitle: 'Choisir ton idée',
      title: 'Analyser son document, identifier 3 interactions et choisir',
      italicTitleWord: 'choisir',
      duration: '~30 min',
      objective:
        'Faire analyser ton document par Claude, choisir parmi 3 idées d’outils avec ton code d’accès acheteur et sauvegarder tes deux premiers textes.',
      deliverableSummary:
        'Une idée d’outil retenue avec son code d’accès et deux textes sauvegardés : Mon plan d’application et Les règles de mon document.',
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
                'Claude lit ton document et te propose 3 concepts d’outils interactifs distincts.',
              paragraphs: [
                'Ouvre une nouvelle conversation Claude, joins ton document et envoie ce premier message.',
              ],
              bullets: [
                'Confirme que le Skill est bien actif dans ton compte Claude.',
                'Joins ton document existant et colle le Master Prompt 1 sans le modifier.',
                'Claude propose 3 idées de produits interactifs distinctes sans générer de code.',
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
                'Joins ton document dans Claude en même temps que tu envoies ce message.',
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Envoyer le message sans joindre son document.',
                correction:
                  'Ajoute ton fichier dans la zone de message Claude avant d’envoyer le prompt.',
              },
              {
                mistake: 'Demander du code HTML dès cette première étape.',
                correction:
                  'Choisis d’abord ton idée parmi les 3 propositions avant toute création de code.',
              },
            ],
            tips: [
              'Si aucune des 3 idées ne te convient, demande simplement à Claude 2 nouvelles pistes.',
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
                'CREATOR2026 est un code d’exemple : tu peux le conserver ou le remplacer.',
              paragraphs: [
                'Notre fiche pratique d’une page devient un calculateur de prix en FCFA et euros.',
              ],
              bullets: [
                'La fiche « Fixer un prix qui respecte ton temps et ton travail » demande coût de création ou de matière, temps passé, tarif horaire et frais de vente.',
                'L’outil affiche aussitôt le prix conseillé et le bénéfice par vente.',
                'Indique l’idée retenue, ton public et le code d’accès acheteur (ex. CREATOR2026).',
              ],
            },
            {
              id: 'l2-s2-copy-prompt-choix',
              type: 'copy',
              title: 'Message pour valider ton choix',
              label: 'MESSAGE-CHOIX-IDEE',
              content: PROMPT_CHOIX_IDEE,
              notes:
                'Précise le numéro de l’idée retenue, ton public et le code d’accès que tes acheteurs utiliseront (CREATOR2026 sert d’exemple si tu n’en proposes aucun).',
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake:
                  'Choisir l’idée la plus compliquée en pensant qu’elle aura plus de valeur.',
                correction:
                  'Privilégie l’outil qui donne un résultat clair et rapide à ton acheteur.',
              },
              {
                mistake: 'Oublier de préciser le code d’accès destiné aux acheteurs.',
                correction:
                  'Indique ton propre code dans le message ou garde le code d’exemple CREATOR2026.',
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
          title: 'Ton plan',
          subtitle: 'Préparer la suite',
          completionLabel: 'Terminer le Jour 1',
          blocks: [
            {
              id: 'l2-s3-prose-validate',
              type: 'prose',
              title: 'GARDER TON',
              italicAccent: 'plan',
              highlightPill:
                'Sauvegarde Mon plan d’application et Les règles de mon document sur ton ordinateur.',
              paragraphs: [
                'Relis les deux textes produits par Claude et vérifie qu’il n’a rien inventé.',
              ],
              bullets: [
                'Contrôle tes règles, tes formules et le code d’accès acheteur retenu.',
                'Enregistre Mon plan d’application et Les règles de mon document sur ton ordinateur.',
                'Garde cette discussion dans ton historique Claude pour envoyer : Plan et règles validés, passons au style.',
              ],
            },
            {
              id: 'l2-s3-checklist-finish',
              type: 'checklist',
              title: 'Validation du Jour 1',
              description:
                'Coche ces 3 points avant de passer à la Leçon 3.',
              items: [
                {
                  id: 'chk-idea-chosen',
                  label: 'J’ai choisi mon idée parmi les 3 propositions et défini mon code d’accès acheteur.',
                  detail:
                    'Le code choisi (ou CREATOR2026 par défaut) figure bien dans Mon plan d’application.',
                },
                {
                  id: 'chk-rules-verified',
                  label:
                    'J’ai relu les règles et formules extraites sans aucun ajout inventé par Claude.',
                  detail:
                    'Mon plan d’application et Les règles de mon document sont complets et fidèles.',
                },
                {
                  id: 'chk-work-saved',
                  label:
                    'J’ai sauvegardé ces deux textes sur mon ordinateur et je garde la même conversation Claude.',
                  detail:
                    'Le signal de passage à la Leçon 3 sera : Plan et règles validés, passons au style.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake:
                  'Quitter Claude sans enregistrer les deux textes sur son ordinateur.',
                correction:
                  'Copie Mon plan d’application et Les règles de mon document dans deux fichiers locaux.',
              },
            ],
            tips: [
              'Au début de la Leçon 3, tu répondras simplement dans cette même discussion : Plan et règles validés, passons au style.',
            ],
          },
        },
      ],
    },
  ],
};
