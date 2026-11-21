import type { Day } from '../../types/course';

export const MASTER_PROMPT_2_XML = `<prompt id="PROMPT-GENERATION-PRODUIT-HTML" version="2.3">
  <role>
    Tu es un Principal Frontend Engineer et Directeur Artistique pour AI CREATOR Studio.
    Ta mission est d'écrire l'intégralité d'une application web interactive autonome dans un fichier unique \`index.html\`, fidèle à 100 % au plan, aux règles et au style validés juste au-dessus dans cette conversation, impeccable sur smartphone comme sur ordinateur.
  </role>

  <skill_activation_check>
    INSTRUCTION PRIORITAIRE :
    1. Charge et applique le skill \`ai-creator-design-intelligence\` (\`references/frontend-craft.md\`, \`references/design-system.md\`, \`references/app-interface-design.md\`, \`references/visual-quality-checklist.md\`).
    2. Commence ta réponse par l'une de ces deux mentions exactes :
       - \`[STATUT SKILL : ACTIF - ai-creator-design-intelligence chargé]\`
       - \`[STATUT SKILL : NON DÉTECTÉ - Application des règles directrices embarquées]\`
  </skill_activation_check>

  <context>
    Appuie-toi directement sur toute la discussion précédente :
    - Le document ou les réponses fournies au départ.
    - Le plan et les règles validés en Phase 1.
    - Le style visuel validé en Phase 2.
  </context>

  <anti_truncation_protocol>
    Pour que tout le fichier \`index.html\` tienne sans coupure dans la réponse :
    - Code HTML/CSS/JS Vanilla propre, factorisé et concis (zéro commentaire décoratif ni remplissage).
    - Émets le code complet de \`<!DOCTYPE html>\` jusqu'à \`</html>\` sans blabla inutile autour.
  </anti_truncation_protocol>

  <strict_rules>
    <rule id="R1">FICHIER UNIQUE AUTONOME : HTML sémantique, tout le CSS dans \`<style>\`, tout le JavaScript Vanilla dans \`<script>\` (plus le script synchrone de verrouillage dans \`<head>\`). Aucun Node.js, npm, Vite, React ni CDN Tailwind. Doit fonctionner directement au double-clic (\`file:///\`) et sur Netlify.</rule>
    <rule id="R2">ZÉRO PLACEHOLDER NI TRONCATURE : aucun \`// ... reste inchangé\`, \`/* TODO */\` ou ellipse. Le fichier doit être 100 % complet jusqu'à \`</html>\`.</rule>
    <rule id="R3">FIDÉLITÉ AUX RÈGLES VALIDÉES : toutes les formules, seuils, étapes, exemples pré-remplis, simulations et conseils validés doivent fonctionner réellement à l'écran, sans rien inventer ni supprimer.</rule>
    <rule id="R4">STYLE COHÉRENT DE BOUT EN BOUT : applique exactement le style validé à l'écran d'accueil/code d'accès, aux formulaires, aux graphiques/jauges SVG, aux résultats et aux boutons, sans retomber dans un modèle générique à cartes blanches.</rule>
    <rule id="R5">PRÉCISION & ROBUSTESSE : valide les saisies proprement (support virgule et point pour les nombres, protection contre division par zéro, message clair en français en cas d'erreur sans effacer la saisie de l'utilisateur).</rule>
    <rule id="R6">SAUVEGARDE ADAPTÉE À L'OUTIL :
      - Outil ponctuel : pas d'enregistrement superflu.
      - Planificateur / simulateur / suivi : sauvegarde automatique sur l'appareil (\`localStorage\` avec repli mémoire sécurisé) + boutons simples pour sauvegarder/restaurer un fichier de secours et copier le résumé en 1 clic si pertinent.</rule>
    <rule id="R7">MOBILE & ACCESSIBILITÉ :
      - Aucun débordement horizontal sur téléphone (\`375 px\` et plus), sans \`overflow-x: hidden\` sur \`html\`/\`body\`.
      - Champs \`>= 16px\` (pas de zoom forcé sur iPhone), boutons et onglets \`>= 44×44 px\`, résultat principal visible rapidement dès l'ouverture, contrastes lisibles, prise en compte de \`prefers-reduced-motion\`.</rule>
    <rule id="R8">ÉCRAN DE CODE D'ACCÈS ACHETEUR :
      - Script synchrone dans \`<head>\` vérifiant l'accès avant d'afficher l'application (\`html.locked .app-shell { display: none }\`, \`html:not(.locked) .gate { display: none }\`), avec clé unique dérivée du nom du produit (\`<slug_produit>_access\`) et le code d'accès validé (tolérant majuscules/minuscules et espaces autour).
      - Même style visuel que l'application, champ clair, bouton pour entrer, message d'erreur lisible si mauvais code, et bouton discret « Verrouiller » dans l'outil.</rule>
  </strict_rules>

  <output_format>
    1. Mention \`[STATUT SKILL : ...]\`
    2. Un bloc de code unique complet commençant par \`<!DOCTYPE html>\` et finissant par \`</html>\`.
    3. En dessous, 3 lignes simples en français pour rappeler à l'apprenant comment ouvrir/télécharger son fichier \`index.html\` et quel code d'accès tester.
  </output_format>
</prompt>`;

export const PROMPT_SIGNAL_STYLE = 'Plan et règles validés, passons au style.';

export const PROMPT_REPRISE_SESSION = `On reprend la création de mon application ici. Active le skill ai-creator-design-intelligence et indique ton statut dès la première ligne.

Voici mon document de départ [joint si besoin] et ce que nous avons déjà validé ensemble :
[Colle ici le plan, les règles ou le style validés dans l'autre conversation]

Confirme en 2 lignes que tu as tout repris, puis attends mon prochain message.`;

export const PROMPT_AJUSTEMENT_STYLE = `J'aime bien la piste n° [1 / 2 / 3], mais j'aimerais ces petits changements :
- Couleurs / ambiance : [Ex : un fond plus clair et chaleureux, moins sombre]
- Lisibilité : [Ex : un résultat bien visible tout de suite sur téléphone]

Propose-moi la version ajustée ou valide le style si tout est bon.`;

export const PROMPT_RETOUCHE_CIBLEE = `Voici mon fichier \`index.html\` actuel [joint en pièce jointe] (et une capture d'écran si besoin).

Applique UNIQUEMENT les modifications suivantes :
1. [Décris simplement ce que tu veux changer, ex. agrandir la taille du résultat principal sur téléphone]
2. [Décris un deuxième ajustement si besoin, ex. changer la couleur du bouton principal en vert sapin]

Consignes importantes :
- Garde intact tout le reste de l'application (calculs, règles, boutons, sauvegarde et écran de code d'accès).
- Vérifie que tout reste parfaitement lisible sur téléphone comme sur ordinateur.
- Renvoie le fichier \`index.html\` complet du début (\`<!DOCTYPE html>\`) à la fin (\`</html>\`), sans aucun raccourci.`;

export const day02: Day = {
  id: 'day-02',
  dayNumber: 2,
  moduleId: 'module-02',
  title: 'Journée 2 : Créer',
  objective:
    'Choisir un style visuel adapté à ton sujet, générer ton application en un seul fichier et ajuster les derniers détails.',
  deliverableSummary: 'Ton application complète enregistrée sous le nom index.html.',
  lessons: [
    {
      id: 'lesson-03',
      lessonNumber: 3,
      moduleId: 'module-02',
      dayId: 'day-02',
      dayNumber: 2,
      navigationTitle: 'Créer ton style',
      title: 'Définir sa direction artistique indépendante',
      italicTitleWord: 'artistique',
      duration: '~20 min',
      objective:
        'Discuter rapidement avec Claude pour obtenir 3 styles adaptés à ton produit et choisir celui qui donne envie à tes acheteurs.',
      deliverableSummary: 'Un style visuel validé prêt pour la création.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-03-step-01',
          number: 1,
          title: 'Le style',
          subtitle: 'Lancer la discussion',
          completionLabel: 'Signal envoyé',
          blocks: [
            {
              id: 'l3-s1-prose-signal',
              type: 'prose',
              title: 'PASSER AU',
              italicAccent: 'style visuel',
              highlightPill:
                'Reste dans la même discussion Claude : il connaît déjà ton document et ton plan.',
              paragraphs: [
                'Envoie simplement la petite phrase ci-dessous pour que Claude te pose 1 ou 2 questions d’ambiance avant de te proposer 3 styles visuels.',
              ],
            },
            {
              id: 'l3-s1-copy-signal',
              type: 'copy',
              title: 'Phrase à envoyer pour passer au style',
              label: 'MESSAGE TRANSITION',
              buttonText: 'Copier la phrase',
              defaultExpanded: true,
              content: PROMPT_SIGNAL_STYLE,
            },
            {
              id: 'l3-s1-copy-reprise',
              type: 'copy',
              title: 'Message de secours (uniquement si Claude coupe pour limite de longueur)',
              label: 'REPRISE SESSION',
              buttonText: 'Copier le message',
              defaultExpanded: false,
              content: PROMPT_REPRISE_SESSION,
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Ouvrir un nouveau chat sans raison entre la Leçon 2 et la Leçon 3.',
                correction:
                  'Continue dans la même discussion : c’est plus rapide et tu n’as rien à recoller.',
              },
            ],
            tips: [
              'Si Claude te demande « Que veux-tu comme couleurs ? » dès le départ, précise-lui simplement ton public et l’ambiance souhaitée (calme, sérieuse, énergique…).',
            ],
          },
        },
        {
          id: 'lesson-03-step-02',
          number: 2,
          title: '3 univers',
          subtitle: 'Choisir le style',
          completionLabel: 'Style choisi',
          blocks: [
            {
              id: 'l3-s2-prose-3styles',
              type: 'prose',
              title: 'COMPARER',
              italicAccent: '3 ambiances',
              highlightPill:
                'Ton produit aura sa propre personnalité, sans copier les couleurs de ce cours.',
              paragraphs: [
                'Réponds aux questions de Claude : il te présente alors **3 styles bien différents** (couleurs, ambiance, mise en page sur téléphone et ordinateur).',
              ],
              bullets: [
                'Choisis celui qui met le mieux en confiance ton public.',
                'Si tu veux modifier une couleur ou rendre l’affichage plus aéré, utilise le message ci-dessous.',
              ],
            },
            {
              id: 'l3-s2-copy-ajustement',
              type: 'copy',
              title: 'Message pour choisir ou ajuster une couleur / ambiance',
              label: 'CHOIX DU STYLE',
              buttonText: 'Copier le message',
              defaultExpanded: true,
              content: PROMPT_AJUSTEMENT_STYLE,
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Accepter un style sombre ou illisible par peur de contredire Claude.',
                correction:
                  'Demande sans hésiter un fond plus clair ou plus contrasté : c’est ton produit.',
              },
            ],
            tips: [
              'Un fond clair et doux (crème, sable, gris très léger) rend presque toujours la lecture plus agréable sur téléphone.',
            ],
          },
        },
        {
          id: 'lesson-03-step-03',
          number: 3,
          title: 'Valider',
          subtitle: 'Confirmer le design',
          completionLabel: 'Style validé',
          blocks: [
            {
              id: 'l3-s3-prose-fiche',
              type: 'prose',
              title: 'VALIDER',
              italicAccent: 'ton design',
              highlightPill:
                'Dès que Claude te dit « Ton style est validé ! », tu es prêt à générer l’application.',
              paragraphs: [
                'Vérifie juste ces 3 détails rapides dans le résumé que Claude vient d’afficher :',
              ],
              bullets: [
                'Les couleurs et l’ambiance te plaisent et correspondent bien à ton sujet.',
                'Le résultat principal de ton outil est annoncé comme bien visible dès l’ouverture.',
                'L’écran de code d’accès reprend bien le même style.',
              ],
            },
            {
              id: 'l3-s3-checklist',
              type: 'checklist',
              title: 'Validation avant création',
              description: 'Confirme ces 3 points avant de générer l’application.',
              items: [
                {
                  id: 'l3-c1',
                  label: 'J’ai choisi un des 3 styles proposés (avec mes ajustements si besoin).',
                  detail: 'L’ambiance correspond à mes clients.',
                },
                {
                  id: 'l3-c2',
                  label: 'Claude m’a confirmé que le style est validé, sans générer de code avant l’heure.',
                  detail: 'La suite se fait toujours dans la même conversation.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Passer à la Leçon 4 avant que Claude ait validé tes changements de couleur.',
                correction:
                  'Attends qu’il te confirme le style final avant d’envoyer le Prompt 2.',
              },
            ],
            tips: [
              'Aucune inquiétude si tu veux encore changer un détail plus tard : tu pourras ajuster facilement en Leçon 5.',
            ],
          },
        },
      ],
    },
    {
      id: 'lesson-04',
      lessonNumber: 4,
      moduleId: 'module-02',
      dayId: 'day-02',
      dayNumber: 2,
      navigationTitle: 'Générer ton app',
      title: 'Générer la première version (V1) de son application',
      italicTitleWord: 'première version',
      duration: '~40 min',
      objective:
        'Donner vie à ton application avec le Prompt 2, télécharger ton fichier index.html et tester l’écran de code d’accès.',
      deliverableSummary: 'Ton fichier index.html téléchargé et fonctionnel.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-04-step-01',
          number: 1,
          title: 'Générer',
          subtitle: 'Envoyer Prompt 2',
          completionLabel: 'Application générée',
          blocks: [
            {
              id: 'l4-s1-prose-gen',
              type: 'prose',
              title: 'CRÉER',
              italicAccent: 'ton application',
              highlightPill:
                'Colle le Prompt 2 dans la même conversation : Claude fabrique toute ton application en une seule fois.',
              paragraphs: [
                'Laisse Claude écrire jusqu’au bout. Selon la taille de ton outil, la génération prend entre 30 secondes et 2 minutes.',
              ],
              bullets: [
                'Copie le **Prompt 2** ci-dessous et envoie-le.',
                'Attends que l’aperçu visuel s’affiche ou que le code soit entièrement terminé.',
              ],
            },
            {
              id: 'l4-s1-callout-continuer',
              type: 'callout',
              variant: 'warning',
              title: 'Si Claude s’arrête en plein milieu',
              content:
                'Sur un compte gratuit, il arrive que Claude mette la réponse en pause avant la fin. Écris-lui simplement : « Continuer » et appuie sur Entrée pour qu’il termine proprement.',
            },
            {
              id: 'l4-s1-copy-prompt2',
              type: 'copy',
              title: 'Prompt 2 : Créer mon application complète',
              label: 'PROMPT 2',
              buttonText: 'Copier le prompt',
              defaultExpanded: false,
              content: MASTER_PROMPT_2_XML,
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Copier un morceau incomplet si Claude s’est arrêté avant la fin.',
                correction:
                  'Envoie « Continuer » dès qu’il s’arrête pour obtenir l’application complète.',
              },
            ],
            tips: [
              'Sur téléphone comme sur ordinateur, tu peux souvent tester l’application directement dans la fenêtre d’aperçu de Claude.',
            ],
          },
        },
        {
          id: 'lesson-04-step-02',
          number: 2,
          title: 'Télécharger',
          subtitle: 'Garder index.html',
          completionLabel: 'Fichier téléchargé',
          blocks: [
            {
              id: 'l4-s2-prose-save',
              type: 'prose',
              title: 'TÉLÉCHARGER',
              italicAccent: 'ton fichier',
              highlightPill:
                'Utilise toujours le bouton Télécharger de Claude plutôt que de copier-coller le code à la main.',
              paragraphs: [
                'Une fois l’application générée, récupère le fichier prêt à publier sur ton téléphone ou ton ordinateur :',
              ],
              bullets: [
                '1. En haut à droite de l’aperçu Claude, clique sur la petite flèche **`⌄`** à côté de **`Copier`**, puis sur **`Télécharger au format HTML`**.',
                '2. Renomme ce fichier exactement **`index.html`** (en tout petit, sans majuscule).',
                '3. Ouvre-le dans ton navigateur (Chrome, Safari…) pour vérifier qu’il s’affiche bien.',
              ],
            },
            {
              id: 'l4-s2-callout-extension',
              type: 'callout',
              variant: 'tip',
              title: 'Vérifie bien le nom du fichier',
              content:
                'Pour que Netlify affiche ton site sans erreur tout à l’heure, le fichier doit s’appeler exactement `index.html` (et pas `index.html.txt` ni `mon-app.html`).',
            },
            {
              id: 'l4-s2-screen-download',
              type: 'screenshot',
              src: '/screenshots/module-02/l4-claude-code-download.png',
              alt: 'Menu déroulant à côté de Copier en haut à droite de Claude montrant Télécharger au format HTML',
              caption: 'Clique sur la flèche à côté de Copier puis « Télécharger au format HTML »',
              capturedAt: '21 novembre 2026',
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Sauvegarder la page avec une extension .txt cachée ou avec une majuscule (Index.html).',
                correction:
                  'Renomme toujours le fichier téléchargé depuis Claude en `index.html` tout en minuscules.',
              },
            ],
            tips: [
              'Sur iPhone ou Android, appuie sur « Enregistrer dans Fichiers » ou « Téléchargements » pour retrouver facilement ton `index.html` lors de la Leçon 6.',
            ],
          },
        },
        {
          id: 'lesson-04-step-03',
          number: 3,
          title: 'Le code',
          subtitle: 'Tester l’ouverture',
          completionLabel: 'Accès validé',
          blocks: [
            {
              id: 'l4-s3-prose-gate',
              type: 'prose',
              title: 'TESTER',
              italicAccent: 'l’écran d’accès',
              highlightPill:
                'Au premier lancement, seul l’écran de code d’accès doit être visible.',
              paragraphs: [
                'Ouvre ton application dans ton navigateur (ou dans l’aperçu Claude) et fais ces 3 tests rapides en 30 secondes :',
              ],
              bullets: [
                '**Mauvais code** : tape un code au hasard et vérifie qu’un message clair refuse l’accès.',
                '**Bon code** : tape ton vrai code et vérifie que l’application s’ouvre immédiatement.',
                '**Actions principales** : teste les boutons, exemples ou calculs clés pour voir si tout répond normalement.',
              ],
            },
            {
              id: 'l4-s3-screen-gate',
              type: 'screenshot',
              src: '/screenshots/module-02/l4-solde-gate-screen.png',
              alt: 'Exemple d écran de code d accès stylisé avant l ouverture de l application',
              caption: 'Exemple (SOLDE) : écran de code d’accès propre qui accueille ton client',
              capturedAt: '21 novembre 2026',
            },
            {
              id: 'l4-s3-checklist',
              type: 'checklist',
              title: 'Contrôles de premier test',
              description: 'Valide ces points avant d’ajuster les détails.',
              items: [
                {
                  id: 'l4-g1',
                  label: 'Un faux code est bien refusé à l’ouverture.',
                  detail: 'L’application reste bloquée tant que le bon code n’est pas saisi.',
                },
                {
                  id: 'l4-g2',
                  label: 'Mon vrai code débloque tout l’outil correctement.',
                  detail: 'Même après avoir rechargé la page, je reste connecté.',
                },
                {
                  id: 'l4-g3',
                  label: 'Les actions principales de mon application fonctionnent.',
                  detail: 'Aucun bouton ne reste sans réaction.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Voir l’application s’ouvrir directement sans demander le code.',
                correction:
                  'Demande simplement à Claude d’ajouter ou réactiver l’écran de code d’accès au lancement avec le message de retouche de la Leçon 5.',
              },
            ],
            tips: [
              'Si tu ouvres le fichier localement depuis l’app Fichiers sur iPhone, certains navigateurs limitent les boutons : tu pourras faire le test final sur le vrai lien Netlify en Leçon 6.',
            ],
          },
        },
      ],
    },
    {
      id: 'lesson-05',
      lessonNumber: 5,
      moduleId: 'module-02',
      dayId: 'day-02',
      dayNumber: 2,
      navigationTitle: 'Tester et ajuster',
      title: 'Effectuer des retouches ciblées, corriger et tester',
      italicTitleWord: 'retouches',
      duration: '~30 min',
      objective:
        'Vérifier que ton application est agréable sur téléphone comme sur ordinateur et demander tes retouches sans rien casser.',
      deliverableSummary: 'Ton application finalisée prête pour la mise en ligne.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-05-step-01',
          number: 1,
          title: 'Vérifier',
          subtitle: 'Téléphone et écran',
          completionLabel: 'Affichage vérifié',
          blocks: [
            {
              id: 'l5-s1-prose-qa',
              type: 'prose',
              title: 'TESTER SUR',
              italicAccent: 'téléphone',
              highlightPill:
                'La majorité de tes clients ouvriront ton application sur leur smartphone : vérifie toujours l’écran en format vertical.',
              paragraphs: [
                'Parcours ton application comme un vrai acheteur et note uniquement ce qui te gêne ou ce qui semble coupé :',
              ],
              bullets: [
                '**Lisibilité mobile** : sur ton téléphone (ou en réduisant la fenêtre sur ordinateur), rien ne doit dépasser sur le côté ni se chevaucher.',
                '**Résultat bien visible** : on doit comprendre et voir l’essentiel sans chercher partout.',
                '**Simplicité d’usage** : tous les champs se remplissent facilement au doigt et les boutons réagissent tout de suite.',
              ],
            },
            {
              id: 'l5-s1-screen-mobile',
              type: 'screenshot',
              src: '/screenshots/module-02/l5-solde-devtools-375px.png',
              alt: 'Exemple d affichage clair et lisible sur écran de téléphone',
              caption: 'Exemple (SOLDE) : interface nette sur téléphone, zéro texte coupé',
              capturedAt: '21 novembre 2026',
            },
            {
              id: 'l5-s1-checklist',
              type: 'checklist',
              title: 'Vérification rapide',
              description: 'Coche ce qui est déjà bon avant de demander tes éventuelles retouches.',
              items: [
                {
                  id: 'l5-q1',
                  label: 'Tout est propre et lisible sur téléphone, sans glisser horizontalement.',
                  detail: 'Les textes, cartes et boutons rentrent bien dans l’écran.',
                },
                {
                  id: 'l5-q2',
                  label: 'Tous les calculs, boutons ou étapes de mon document marchent bien.',
                  detail: 'Le résultat change bien quand je modifie mes choix.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Valider l’application sans jamais l’avoir regardée sur un petit écran.',
                correction:
                  'Prends 1 minute pour regarder sur ton téléphone : c’est là que tes clients passeront le plus de temps.',
              },
            ],
            tips: [
              'Si tout te semble déjà propre et fonctionnel, tu peux passer directement à la Leçon 6 !',
            ],
          },
        },
        {
          id: 'lesson-05-step-02',
          number: 2,
          title: 'Retouches',
          subtitle: 'Corriger sans casser',
          completionLabel: 'Retouches terminées',
          blocks: [
            {
              id: 'l5-s2-prose-fix',
              type: 'prose',
              title: 'AJUSTER SANS',
              italicAccent: 'tout casser',
              highlightPill:
                'Ne dis jamais « Refais tout » : demande uniquement la modification précise sur le fichier existant.',
              paragraphs: [
                'Si tu veux agrandir un texte, changer une couleur ou corriger un bug, envoie ton fichier `index.html` à Claude (ou reste dans la même discussion) avec ce court message :',
              ],
            },
            {
              id: 'l5-s2-copy-retouche',
              type: 'copy',
              title: 'Message pour demander une retouche précise',
              label: 'RETOUCHE CIBLÉE',
              buttonText: 'Copier le message',
              defaultExpanded: true,
              content: PROMPT_RETOUCHE_CIBLEE,
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Envoyer juste « le bouton ne marche pas » sans capture ni précision.',
                correction:
                  'Joins une capture d’écran ou dis exactement sur quel bouton tu as cliqué : Claude corrige du premier coup.',
              },
            ],
            tips: [
              'Garde ton ancien fichier `index.html` dans tes téléchargements avant d’enregistrer le nouveau, au cas où tu préférerais revenir en arrière.',
            ],
          },
        },
        {
          id: 'lesson-05-step-03',
          number: 3,
          title: 'Finaliser',
          subtitle: 'Version finale',
          completionLabel: 'Module 02 terminé',
          blocks: [
            {
              id: 'l5-s3-prose-final',
              type: 'prose',
              title: 'VERSION',
              italicAccent: 'finale prête',
              highlightPill:
                'Ton fichier index.html est maintenant complet, testé et prêt à être mis en ligne.',
              paragraphs: [
                'Télécharge ta version corrigée et vérifie qu’elle porte bien le nom **`index.html`**. Tu es prêt pour le dernier module : mettre l’outil en ligne gratuitement et le livrer sur Chariow.',
              ],
            },
            {
              id: 'l5-s3-screen-desktop',
              type: 'screenshot',
              src: '/screenshots/module-02/l5-solde-desktop-final.png',
              alt: 'Exemple final d application interactive propre et aboutie sur ordinateur',
              caption: 'Exemple (SOLDE) : résultat final prêt pour la mise en ligne',
              capturedAt: '21 novembre 2026',
            },
            {
              id: 'l5-s3-checklist',
              type: 'checklist',
              title: 'Validation finale',
              description: 'Confirme ces 2 derniers points avant la Leçon 6.',
              items: [
                {
                  id: 'l5-f1',
                  label: 'J’ai testé ma version finale et tout fonctionne correctement.',
                  detail: 'Écran de code d’accès, affichage mobile et actions principales.',
                },
                {
                  id: 'l5-f2',
                  label: 'Mon fichier s’appelle bien `index.html`.',
                  detail: 'Prêt à être publié sur Netlify.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Déployer une ancienne version par erreur (ex. index (1).html).',
                correction:
                  'Supprime les anciens brouillons inutiles pour garder uniquement ton bon `index.html`.',
              },
            ],
            tips: [
              'Passons maintenant à la mise en ligne gratuite en 3 minutes dans le Module 03.',
            ],
          },
        },
      ],
    },
  ],
};
