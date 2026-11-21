import type { Day } from '../../types/course';

export const MASTER_PROMPT_1_XML = `<prompt id="PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE" version="2.5">
  <role>
    Tu es un Concepteur Produit et Directeur Artistique Digital Senior pour AI CREATOR Studio.
    Ta mission est d'aider l'apprenant (souvent non technique, parfois sur téléphone) à transformer son document (PDF, ebook, guide, notes) ou son idée brute en un plan d'application clair puis en une direction visuelle sur mesure, dans cette même conversation et sans jamais lui demander de créer des fichiers texte ou d'écrire du code.
  </role>

  <skill_activation_check>
    INSTRUCTION PRIORITAIRE :
    1. Charge et applique le skill ai-creator-design-intelligence (notamment references/art-direction.md, references/app-interface-design.md et references/design-system.md).
    2. Commence obligatoirement ta première réponse par l'une de ces deux mentions exactes :
       - [STATUT SKILL : ACTIF - ai-creator-design-intelligence chargé] si les fichiers du skill sont accessibles dans cette session.
       - [STATUT SKILL : NON DETECTE - Application des règles directrices embarquées] si le skill n'est pas détecté.
  </skill_activation_check>

  <fallback_design_rules>
    MODE SECOURS COMPLET (à appliquer silencieusement si [STATUT SKILL : NON DETECTE]) :
    1. Quadrilatère de dérivation (à déduire du sujet avant toute proposition visuelle) :
       - Objet métier : quel objet réel incarne ce domaine ? (carnet, grille de suivi, planificateur, guide de séance…).
       - Moment de vérité : quel résultat concret ou verdict fait la valeur immédiate pour l'acheteur ?
       - Émotion / Registre : quelle ambiance rassure ou motive le public ?
       - Repères visuels : quelles unités, devises, jauges ou étapes appartiennent au sujet ?
    2. Phrase conceptuelle interne : « Dans cette application, [élément distinctif du métier] devient [élément central de l'expérience visuelle]. »
    3. Hygiène visuelle de secours : zéro tableau de bord générique à cartes blanches identiques sur fond gris, zéro dégradé bleu-violet générique, surfaces teintées cohérentes, contrastes lisibles, et résultat principal visible dès l'ouverture sur téléphone comme sur ordinateur.
  </fallback_design_rules>

  <context>
    L'apprenant envoie simplement son fichier (PDF, ebook, document, tableur) ou explique son idée.
    Il n'a pas besoin de compétences techniques ni en design ni en informatique.
    Règle absolue de langage : parle-lui toujours en français simple, direct et chaleureux. N'utilise JAMAIS de jargon anglais ou technique dans tes réponses (jamais de « Product Blueprint », « Source Fidelity Mapping », « localStorage », « .gate », « JSON », « 375 px », ni de demande de créer des fichiers \`.txt\`).
  </context>

  <domain_modeling_patterns>
    MÉCANIQUES À ÉVALUER SILENCIEUSEMENT POUR RENDRE L'OUTIL VRAIMENT UTILE :
    Selon le contenu du document, propose uniquement les mécaniques adaptées parmi :
    1. Exemples ou profils prêts en 1 clic (2 à 3 cas concrets déjà remplis pour démarrer sans hésiter).
    2. Simulateur « Et si… » (tester un changement de situation, un imprévu ou une nouvelle option en direct).
    3. Score, diagnostic ou verdict clair (accompagné d'une piste d'action concrète fidèle à la méthode source).
    4. Récapitulatif ou plan d'action copiable en 1 clic pour l'acheteur.
  </domain_modeling_patterns>

  <strict_rules>
    <rule id="R1">INTERDICTION ABSOLUE D'ÉMETTRE DU CODE HTML/CSS/JS : aucun code informatique à cette étape.</rule>
    <rule id="R2">INTERDICTION DE LA QUESTION GÉNÉRIQUE : ne demande jamais « Quelles couleurs voulez-vous ? » ou « Quel design préférez-vous ? ». Guide toujours avec des propositions concrètes adaptées au sujet.</rule>
    <rule id="R3">ZÉRO DEMANDE DE FICHIER INTERMÉDIAIRE : ne demande jamais à l'apprenant de créer un dossier ou d'enregistrer des fichiers \`.txt\`. Tout reste clair et consultable ici dans la conversation.</rule>
    <rule id="R4">FIDÉLITÉ AU CONTENU SOURCE : préserve toutes les règles, formules, étapes, seuils et conseils importants du document de départ sans rien inventer ni simplifier à tort.</rule>
    <rule id="R5">LANGAGE NATUREL ET CONCIS : va droit au but, sans pavés inutiles ni explications techniques.</rule>
  </strict_rules>

  <process_flow>
    <step id="1" name="EXTRACTION SILENCIEUSE OU 3 QUESTIONS SIMPLES">
      Analyse le document ou les informations envoyés par l'apprenant.
      - Cas A (informations incomplètes, idée trop vague ou document illisible) :
        Affiche [STATUT SKILL : ...], explique brièvement ce que tu as pu lire (ou non) et pose directement ces 3 questions courtes en français simple :
        1. Pour qui est ce produit exactement ?
        2. Quel problème précis aide-t-il à résoudre ?
        3. Quel résultat concret ou outil pratique ton client doit-il obtenir à la fin ?
        Attends sa réponse avant de proposer les 3 idées.
      - Cas B (document ou description suffisamment clair) :
        Affiche [STATUT SKILL : ...], résume en 3 phrases simples ce que tu as compris (public, promesse, règles principales) et passe tout de suite à l'étape 2.
    </step>

    <step id="2" name="PROPOSITION DE 3 IDÉES D'APPLICATIONS">
      Présente 3 façons différentes de transformer ce contenu en application interactive utile :
      Pour chaque idée, explique simplement :
      1. Un nom clair pour l'application.
      2. Ce que ton client y fait concrètement à l'écran.
      3. Pourquoi c'est plus utile qu'un simple PDF.
      Recommande une des 3 idées en 1 phrase, puis demande à l'apprenant de choisir (\`1\`, \`2\` ou \`3\`), de confirmer son public si besoin, et de donner le code d'accès court qu'il veut offrir à ses acheteurs (ex. \`MONCODE2026\`).
    </step>

    <step id="3" name="PLAN SIMPLE ET RÈGLES EXTRAITES (SANS CODE)">
      Dès que l'apprenant valide son choix, présente directement dans le chat (en français simple, sans jargon) :
      1. **Le plan de l'application** : nom, promesse, écrans/onglets prévus, fonctionnement sur téléphone et ordinateur, sauvegarde des choix de l'utilisateur sur son appareil (si utile), et écran de code d'accès avec le mot de passe choisi.
      2. **Les règles retenues du document** : liste claire ou tableau simple de toutes les formules, étapes, seuils et conseils exacts du document qui seront intégrés.

      Termine exactement par :
      « Le plan et les règles de ton application sont prêts. Vérifie que rien d'important de ton contenu ne manque. Dès que c'est bon pour toi, réponds simplement : "Plan et règles validés, passons au style." »
    </step>

    <step id="4" name="ENTRETIEN VISUEL RAPIDE (LEÇON 3)">
      Dès que l'apprenant répond « Plan et règles validés, passons au style. », pose 1 ou 2 questions très simples pour sentir l'ambiance qui correspond le mieux à son public (ex. plutôt calme et sérieux comme un carnet soigné, chaleureux et motivant, ou énergique et direct), avec 2 ou 3 comparaisons concrètes adaptées à son domaine. Attends sa réponse.
    </step>

    <step id="5" name="3 PROPOSITIONS DE STYLE CONTRASTÉES">
      Propose 3 styles visuels vraiment différents adaptés à son sujet.
      Pour chaque style, décris simplement (sans code ni jargon) :
      1. Le nom de l'ambiance.
      2. L'impression donnée dès l'ouverture.
      3. Les couleurs principales (fond, zones importantes, boutons).
      4. Le style d'écriture et la mise en page sur téléphone et ordinateur.
      5. Pourquoi ce choix colle bien à ses clients.
      Recommande un style et invite l'apprenant à choisir (\`1\`, \`2\` ou \`3\`) ou à demander un ajustement de couleur/ton.
    </step>

    <step id="6" name="VALIDATION DU STYLE AVANT CRÉATION">
      Dès que l'apprenant confirme son style (avec d'éventuelles retouches), récapitule clairement son style validé en français simple, puis mémorise silencieusement tous les repères techniques nécessaires pour l'étape suivante (palette exacte avec contrastes lisibles, polices lisibles hors-ligne, organisation téléphone/ordinateur, style de l'écran de code d'accès).

      Termine exactement par :
      « Ton style est validé ! Tu peux maintenant coller le Prompt 2 juste ici pour créer ton application complète. »
    </step>
  </process_flow>
</prompt>`;

export const PROMPT_ANALYSE_DOC = MASTER_PROMPT_1_XML;

export const PROMPT_CHOIX_IDEE = `Je choisis l'idée n° [1 / 2 / 3].

Précisions pour mon application :
- Pour qui : [Ex : des personnes qui veulent passer à l'action facilement sans tableau compliqué]
- Code d'accès pour mes acheteurs : [Ex : MONCODE2026]
- Détail à garder absolument : [Optionnel : supprime cette ligne si tout est déjà bon]

Prépare maintenant le plan de mon application et la liste de mes règles, sans code pour l'instant.`;

export const day01: Day = {
  id: 'day-01',
  dayNumber: 1,
  moduleId: 'module-01',
  title: 'Journée 1 : Choisir',
  objective:
    'Préparer ton point de départ, activer l’aide design gratuite dans Claude et choisir l’idée de ton application.',
  deliverableSummary: 'Ton document prêt et ton plan d’application validé.',
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
        'Partir de ton propre document (ou idée) et ajouter le pack design gratuit dans Claude, sur téléphone comme sur ordinateur.',
      deliverableSummary: 'Ton document prêt et le pack design activé dans Claude.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-01-step-01',
          number: 1,
          title: 'Ton document',
          subtitle: 'Point de départ',
          completionLabel: "J'ai mon document",
          blocks: [
            {
              id: 'l1-s1-prose-doc',
              type: 'prose',
              title: 'PARTIR DE',
              italicAccent: 'ton document',
              highlightPill:
                'Un simple PDF, un ebook, quelques notes ou même une idée suffisent pour démarrer.',
              paragraphs: [
                'Tu pars avant tout de **ton propre contenu**. Tu n’as rien à préparer de compliqué : tu vas simplement l’envoyer à Claude, qui saura lire l’essentiel ou te poser quelques questions simples s’il manque des infos.',
              ],
              bullets: [
                '**PDF ou ebook existant** : garde-le sous la main sur ton téléphone ou ton ordinateur pour l’importer dans Claude.',
                '**Notes ou simple idée** : si tu n’as pas encore de PDF, il te suffira d’expliquer ce que tu veux créer. Claude te demandera *pour qui*, *quel problème* et *quel résultat concret*.',
                '**Besoin d’un exemple ?** Tu peux jeter un œil au PDF d’exemple SOLDE ci-dessous pour voir comment un simple guide devient une vraie application.',
              ],
            },
            {
              id: 'l1-s1-res-solde-pdf',
              type: 'resource',
              title: 'Exemple de document de départ (facultatif)',
              description:
                'Un ebook simple utilisé dans nos exemples si tu veux voir à quoi ressemble un PDF transformé en app.',
              resources: [
                {
                  id: 'res-solde-ebook-pdf',
                  title: 'SOLDE-EBOOK-BUDGET-MENSUEL-OBJECTIFS.pdf',
                  category: 'guide',
                  description:
                    'Document exemple facultatif pour visualiser le passage d’un PDF à une application interactive.',
                  format: 'PDF',
                  externalUrl: '/downloads/demo-pdfs/SOLDE-EBOOK-BUDGET-MENSUEL-OBJECTIFS.pdf',
                  downloadFilename: 'SOLDE-EBOOK-BUDGET-MENSUEL-OBJECTIFS.pdf',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Attendre d’avoir un ebook parfait de 50 pages avant de commencer.',
                correction:
                  'Commence dès maintenant avec ce que tu as : le premier prompt aide justement à clarifier et structurer ton contenu.',
              },
            ],
            tips: [
              'Si tu as déjà un PDF prêt à vendre ou à transformer, garde-le simplement accessible dans tes Téléchargements ou Fichiers.',
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
              title: 'ACTIVER LE',
              italicAccent: 'pack design',
              highlightPill:
                'Ce petit fichier gratuit donne à Claude des règles visuelles propres pour éviter les interfaces fades générées par défaut.',
              paragraphs: [
                'Même avec un compte Claude gratuit, tu peux ajouter ce fichier une seule fois dans tes réglages :',
              ],
              bullets: [
                '1. Télécharge **`AI-CREATOR-DESIGN-INTELLIGENCE.zip`** ci-dessous **sans le décompresser**.',
                '2. Dans Claude, ouvre **Paramètres > Capacités** et active **`Création et modification de fichiers`** (ainsi qu’**`Artéfacts`**).',
                '3. Ouvre **Plug-ins** (ou *Personnalisation*) > onglet **`Skills`**, clique sur **`Ajouter`** en haut à droite pour importer le fichier `.zip`, puis vérifie que **`Ai creator design intelligence`** apparaît sous *Vos plug-ins*.',
              ],
            },
            {
              id: 'l1-s2-callout-safari',
              type: 'callout',
              variant: 'warning',
              title: 'Attention sur iPhone, iPad ou Mac (Safari)',
              content:
                'Safari décompresse parfois les fichiers `.zip` tout seul en un dossier. Dans ce cas, télécharge plutôt le fichier avec Chrome, ou fais un clic droit / appui long sur le dossier pour le recompresser en `.zip` avant de l’importer dans Claude.',
            },
            {
              id: 'l1-s2-screen-capabilities',
              type: 'screenshot',
              src: '/screenshots/module-01/l1-claude-capabilities.png',
              alt: 'Menu Paramètres puis Capacités dans Claude avec Création et modification de fichiers activé',
              caption: 'Dans Paramètres > Capacités : active « Création et modification de fichiers » (requis pour les Skills)',
              capturedAt: '21 novembre 2026',
            },
            {
              id: 'l1-s2-screen-skill',
              type: 'screenshot',
              src: '/screenshots/module-01/l1-claude-skill-install.png',
              alt: 'Page Plug-ins onglet Skills dans Claude montrant le bouton Ajouter et le Skill Ai creator design intelligence actif',
              caption: 'Dans Plug-ins > Skills : clique sur Ajouter pour importer le .zip (ton Skill apparaît dans Vos plug-ins)',
              capturedAt: '21 novembre 2026',
            },
            {
              id: 'l1-s2-resource-skill',
              type: 'resource',
              title: 'Fichier Design à importer dans Claude',
              description: 'Télécharge ce fichier et importe-le tel quel dans Claude.',
              resources: [
                {
                  id: 'res-design-skill-zip',
                  title: 'AI-CREATOR-DESIGN-INTELLIGENCE.zip',
                  category: 'template',
                  description: 'Pack de règles visuelles gratuit à activer une seule fois dans Claude.',
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
                mistake: 'Importer un dossier décompressé au lieu du fichier .zip.',
                correction:
                  'Claude n’accepte que le fichier `.zip`. Si le navigateur l’a ouvert en dossier, utilise Chrome ou compresse-le en `.zip`.',
              },
            ],
            tips: [
              'Si l’option Compétences n’apparaît pas sur ton compte gratuit, pas de blocage : le Prompt 1 contient déjà les consignes essentielles en secours.',
            ],
          },
        },
        {
          id: 'lesson-01-step-03',
          number: 3,
          title: 'Démarrer',
          subtitle: 'Ouvrir Claude',
          completionLabel: 'Terminer la Leçon 1',
          blocks: [
            {
              id: 'l1-s3-prose-claude',
              type: 'prose',
              title: 'OUVRIR UNE',
              italicAccent: 'nouvelle discussion',
              highlightPill:
                'Que tu sois sur ton téléphone ou ton ordinateur, tout se fait au même endroit dans une seule discussion Claude.',
              paragraphs: [
                'Avant de lancer l’analyse de ton document dans la leçon suivante, vérifie simplement ces 3 points rapides :',
              ],
              bullets: [
                '**Une discussion neuve** : ouvre un nouveau chat sur **claude.ai** (ou sur l’application mobile Claude) pour repartir proprement.',
                '**Ton document à portée de main** : vérifie que tu peux joindre ton PDF, ton ebook ou tes notes avec le bouton **`+`**.',
                '**Pack Design activé** : assure-toi d’avoir bien activé le fichier `.zip` à l’étape précédente.',
              ],
            },
            {
              id: 'l1-s3-checklist',
              type: 'checklist',
              title: 'Prêt pour la Leçon 2',
              description: 'Valide ces points rapides avant de passer à la suite.',
              items: [
                {
                  id: 'l1-c1',
                  label: 'J’ai mon document source (PDF, notes ou idée claire) prêt à envoyer.',
                  detail: 'Accessible facilement depuis mon téléphone ou mon ordinateur.',
                },
                {
                  id: 'l1-c2',
                  label: 'J’ai importé et activé le pack design dans Claude.',
                  detail: 'Création de fichiers activée et fichier .zip importé.',
                },
                {
                  id: 'l1-c3',
                  label: 'J’ai ouvert une discussion Claude toute neuve.',
                  detail: 'Prête à recevoir mon document et le Prompt 1.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Revenir dans une vieille discussion Claude déjà très longue.',
                correction:
                  'Ouvre toujours une nouvelle discussion : la limite gratuite est plus confortable et Claude reste plus précis.',
              },
            ],
            tips: [
              'Sur téléphone, l’application officielle Claude ou le navigateur Chrome fonctionnent tous les deux très bien.',
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
        'Envoyer ton contenu à Claude avec le Prompt 1, répondre si besoin à ses questions simples et choisir l’idée d’application à construire.',
      deliverableSummary: 'Un concept d’application et des règles validées avec Claude.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-02-step-01',
          number: 1,
          title: 'Tes idées',
          subtitle: 'Lancer Prompt 1',
          completionLabel: 'Claude a proposé 3 idées',
          blocks: [
            {
              id: 'l2-s1-prose-prompt1',
              type: 'prose',
              title: 'LANCER',
              italicAccent: 'l’analyse',
              highlightPill:
                'Joins ton document (ou explique ton idée) puis colle le Prompt 1 dans le même message.',
              paragraphs: [
                'Claude lit ton contenu, repère ce qui a le plus de valeur pour tes acheteurs et te propose **3 idées d’applications concrètes** (sans aucun code pour l’instant).',
              ],
              bullets: [
                '**Joins ton document** : clique sur `+` dans Claude pour envoyer ton PDF (ou décris simplement ton sujet si tu pars d’une idée).',
                '**Envoie le Prompt 1** : copie le prompt ci-dessous et envoie le tout.',
                '**Réponds si besoin** : si ton contenu est trop court ou flou, Claude te pose **3 questions simples** (*pour qui, quel problème, quel résultat concret ?*). Réponds normalement pour voir tes 3 idées.',
              ],
            },
            {
              id: 'l2-s1-screen-concepts',
              type: 'screenshot',
              src: '/screenshots/module-01/l2-claude-three-concepts.png',
              alt: 'Réponse de Claude Free proposant 3 idées d application à partir du document SOLDE',
              caption: 'Exemple sur Claude Free : 3 idées d’applications claires proposées à partir du document',
              capturedAt: '21 novembre 2026',
            },
            {
              id: 'l2-s1-copy-prompt1',
              type: 'copy',
              title: 'Prompt 1 : Analyser mon document et proposer 3 idées',
              label: 'PROMPT 1',
              buttonText: 'Copier le prompt',
              defaultExpanded: false,
              content: MASTER_PROMPT_1_XML,
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Envoyer le Prompt 1 tout seul sans joindre de PDF ni expliquer son sujet.',
                correction:
                  'Si tu n’as pas encore joint ton document, clique sur `+` ou réponds aux 3 questions simples posées par Claude.',
              },
            ],
            tips: [
              'Regarde tout en haut de la réponse de Claude : la mention `[STATUT SKILL : ACTIF]` confirme que ton pack design est bien pris en compte.',
            ],
          },
        },
        {
          id: 'lesson-02-step-02',
          number: 2,
          title: 'Ton choix',
          subtitle: 'Choisir une idée',
          completionLabel: "J'ai choisi mon idée",
          blocks: [
            {
              id: 'l2-s2-prose-choix',
              type: 'prose',
              title: 'CHOISIR',
              italicAccent: 'ton application',
              highlightPill:
                'Choisis l’idée qui apporte un résultat rapide et concret à ton futur acheteur, et fixe ton code d’accès.',
              paragraphs: [
                'Tu as 3 pistes devant toi. Choisis celle que ton client comprend en 5 secondes, puis complète simplement le court message ci-dessous pour que Claude détaille le plan et les règles.',
              ],
              bullets: [
                '**Indique le numéro choisi** (`1`, `2` ou `3`) et précise ton public si besoin.',
                '**Choisis un code d’accès court** (par exemple `MONCODE2026`) : tes clients l’entreront sur la page d’accueil pour débloquer l’application après l’achat.',
              ],
            },
            {
              id: 'l2-s2-copy-choix',
              type: 'copy',
              title: 'Message pour valider ton idée et ton code d’accès',
              label: 'MESSAGE-CHOIX-IDEE',
              buttonText: 'Copier le message',
              defaultExpanded: true,
              content: PROMPT_CHOIX_IDEE,
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Choisir l’idée la plus complexe en pensant qu’elle aura plus de valeur.',
                correction:
                  'Un outil simple qui donne un résultat immédiat plaît beaucoup plus à tes acheteurs qu’une usine à gaz.',
              },
            ],
            tips: [
              'Prends un code d’accès simple et facile à taper sur téléphone (lettres et chiffres, sans caractères spéciaux).',
            ],
          },
        },
        {
          id: 'lesson-02-step-03',
          number: 3,
          title: 'Valider',
          subtitle: 'Relire le plan',
          completionLabel: 'Terminer la Leçon 2',
          blocks: [
            {
              id: 'l2-s3-prose-audit',
              type: 'prose',
              title: 'RELIRE',
              italicAccent: 'le plan',
              highlightPill:
                'Prends 2 minutes pour vérifier que Claude n’a oublié aucune info clé de ton document.',
              paragraphs: [
                'Claude vient d’afficher le plan de ton application et les règles extraites de ton contenu. Tout reste ici dans ta conversation : **aucun fichier texte à créer**.',
              ],
              bullets: [
                'Vérifie que l’outil correspond bien au problème de tes clients.',
                'Vérifie que les calculs, étapes ou conseils importants de ton document sont bien listés.',
                'Si quelque chose manque ou te semble flou, dis-le simplement à Claude dans le chat avant de passer à la Leçon 3.',
              ],
            },
            {
              id: 'l2-s3-checklist',
              type: 'checklist',
              title: 'Vérifications rapides',
              description: 'Confirme ces 3 points avant de choisir le style visuel.',
              items: [
                {
                  id: 'l2-c1',
                  label: 'Le résultat principal de l’application est clair dès le premier regard.',
                  detail: 'Je sais exactement ce que mon client obtiendra en l’utilisant.',
                },
                {
                  id: 'l2-c2',
                  label: 'Aucune règle ou formule importante de mon contenu n’a été oubliée.',
                  detail: 'Tout ce qui fait la valeur de mon document est présent.',
                },
                {
                  id: 'l2-c3',
                  label: 'Mon code d’accès acheteur est bien noté.',
                  detail: 'Je m’en servirai aussi lors de la mise en vente.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Passer trop vite sans vérifier un calcul ou une étape oubliée.',
                correction:
                  'Écris simplement à Claude « Ajoute aussi telle règle / étape » maintenant : c’est 10 fois plus rapide avant qu’il écrive le code.',
              },
            ],
            tips: [
              'Tu peux déjà passer à la Leçon 3 en gardant exactement la même conversation Claude ouverte.',
            ],
          },
        },
      ],
    },
  ],
};
