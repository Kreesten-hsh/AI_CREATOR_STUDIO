import type { Day } from '../../types/course';

export const day07: Day = {
  id: 'day-07',
  dayNumber: 7,
  sprintId: 'sprint-2',
  title: 'LE PROMPT MAÎTRE D\'ARCHITECTURE DANS CLAUDE ARTIFACTS',
  italicTitleWord: 'ARCHITECTURE',
  objective: 'Générer l\'ossature complète d\'une application web autonome en un seul fichier (HTML/CSS/JS) dans Claude Artifacts avec une esthétique affirmée.',
  deliverableSummary: 'Squelette fonctionnel d\'application web autonome prévisualisé dans Claude',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-07-step-1',
      type: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: 'Comment fonctionne réellement Claude Artifacts',
      completionLabel: 'Valider l\'étape 1 : Comprendre',
      blocks: [
        {
          id: 'day-07-prose-1',
          type: 'prose',
          eyebrow: 'LEÇON 07 : COMPRENDRE LES FONDATIONS',
          title: 'Maîtriser l\'environnement Claude Artifacts sans coder',
          italicAccent: 'Autonomie',
          highlightPill: 'La règle essentielle : demander un fichier HTML unique intégrant styles et scripts pour un fonctionnement immédiat partout.',
          paragraphs: [
            'La fonctionnalité Artifacts de Claude est un environnement d\'exécution interactif intégré. Dès que Claude génère un extrait de code structuré de plus de 15 lignes, il l\'isole dans un panneau latéral dédié sur la droite de votre écran.',
            'Ce panneau propose deux modes essentiels : l\'onglet « Preview », qui exécute et affiche instantanément votre application dans le navigateur comme un vrai site web, et l\'onglet « Code », qui vous permet de lire, copier ou exporter l\'intégralité du code source en un clic.',
            'Pour qu\'un produit soit commercialisable sans friction auprès de clients non techniques, il doit impérativement être autonome : tout le HTML, le CSS (dans une balise <style>) et le JavaScript (dans une balise <script>) doivent cohabiter dans un seul fichier index.html. Cela garantit que votre client peut ouvrir son guide d\'un double-clic sur son ordinateur sans installer le moindre logiciel.',
          ],
          bullets: [
            'Vérifier que la fonctionnalité Artifacts est bien active dans vos paramètres Claude.',
            'Exiger de Claude un fichier monobloc HTML/CSS/JS sans dépendances externes complexes.',
            'Utiliser le bouton de téléchargement ou de copie dans l\'onglet Code pour récupérer votre fichier.',
          ],
        },
        {
          id: 'day-07-callout-1',
          type: 'callout',
          variant: 'important',
          title: 'Offre gratuite versus Claude Pro',
          content: 'Claude permet de générer, prévisualiser et exporter des Artifacts avec son offre gratuite, dans la limite de ses quotas quotidiens d\'utilisation. Avec un compte Claude Pro, la fenêtre de contexte plus large permet de concevoir des applications plus denses et d\'itérer plus rapidement sans interruption.',
        },
        {
          id: 'day-07-quiz-1',
          type: 'quiz',
          title: 'Validation de l\'environnement Artifacts',
          description: 'Vérifiez la maîtrise des principes de Claude Artifacts.',
          questions: [
            {
              id: 'q7-1',
              question: 'Pourquoi privilégier une application autonome en un seul fichier HTML/CSS/JS ?',
              options: [
                'Pour que le client puisse l\'ouvrir directement dans son navigateur sans serveur ni installation',
                'Parce que Claude refuse d\'écrire plusieurs lignes de code',
                'Pour obliger le client à acheter un logiciel spécialisé',
              ],
              correctIndex: 0,
              explanation: 'Un fichier autonome monobloc s\'exécute partout sans dépendance, fonctionne hors ligne et se déploie en quelques secondes.',
            },
            {
              id: 'q7-2',
              question: 'Où se situe l\'option permettant de voir et copier le code source dans Claude Artifacts ?',
              options: [
                'Dans un menu caché payant',
                'Dans l\'onglet Code situé en haut à droite du panneau de l\'Artifact',
                'Dans les paramètres généraux de votre navigateur',
              ],
              correctIndex: 1,
              explanation: 'L\'Artifact dispose de deux onglets : Preview pour tester l\'interface et Code pour copier ou télécharger le fichier.',
            },
          ],
        },
      ],
    },
    {
      id: 'day-07-step-2',
      type: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: 'Le Prompt Maître d\'Architecture Web Monobloc',
      completionLabel: 'Valider l\'étape 2 : Prompt Claude',
      blocks: [
        {
          id: 'day-07-prompt-builder',
          type: 'prompt-builder',
          title: 'Prompt Maître d\'Architecture Claude Artifacts',
          description: 'Ce prompt complet ordonne à Claude de bâtir l\'ossature complète de votre application web autonome avec navigation par onglets et respect scrupuleux de votre style.',
          deliverableTarget: 'claude-artifact',
          fields: [
            {
              key: 'business',
              label: 'Thématique / Niche ({{business}})',
              placeholder: 'Votre domaine d\'activité',
              profileBinding: 'business',
            },
            {
              key: 'targetAudience',
              label: 'Audience cible ({{targetAudience}})',
              placeholder: 'Vos clients cibles',
              profileBinding: 'targetAudience',
            },
            {
              key: 'productType',
              label: 'Type de produit ({{productType}})',
              placeholder: 'ex. Starter Kit Interactif',
              profileBinding: 'productType',
            },
            {
              key: 'brandStyle',
              label: 'Direction visuelle ({{brandStyle}})',
              placeholder: 'ex. Néo-Brutaliste Éditorial',
              profileBinding: 'brandStyle',
            },
            {
              key: 'mainObjective',
              label: 'Objectif de transformation ({{mainObjective}})',
              placeholder: 'Résultat garanti pour l\'acheteur',
              profileBinding: 'mainObjective',
            },
          ],
          template: `Tu es un Ingénieur Frontend Senior et Architecte d'Applications Web Autonomes.

CONTEXTE DU PROJET :
- Activité / Niche : {{business}}
- Audience cible : {{targetAudience}}
- Format du produit : {{productType}}
- Direction visuelle : {{brandStyle}}
- Résultat promis à l'utilisateur : {{mainObjective}}

MISSION :
Génère dans un Claude Artifact une application web interactive complète et autonome en un SEUL fichier HTML (incluant tout le CSS dans une balise <style> et tout le JavaScript dans une balise <script>).

EXIGENCES TECHNIQUES STRICTES :
1. AUTONOMIE TOTALE : Aucun import de framework externe (pas de React, pas de Tailwind par CDN). Utilise du HTML5 sémantique, du CSS vanille moderne avec variables :root, et du JavaScript vanille pur.
2. DIRECTION ARTISTIQUE NÉO-BRUTALISTE ÉDITORIALE :
   - Palette de couleurs : Rouge Brique (#B63131), Rose Poudré (#E6A0A8), Rose Pâle (#F7E0E2), Crème Papier (#FAF6F0), Encre Profonde (#171313) et Blanc Pur (#FFFDFC).
   - Bordures franches de 2px encre (#171313), ombres dures décalées (4px 4px 0px #171313), angles adoucis (border-radius de 6px à 8px pour les cartes et boutons).
   - Typographie forte, titres en majuscules contrastées, hiérarchie visuelle soignée anti-slop.
3. STRUCTURE DE L'APPLICATION :
   - En-tête éditorial percutant avec badge de méthodologie et titre fort.
   - Barre de sélection de profil en haut de page permettant d'adapter la situation de l'utilisateur.
   - Système de navigation par onglets thématiques fluide (onglets actifs avec état visuel franc).
   - Conteneurs de modules structurés prêts à accueillir les calculateurs et feuilles de route.
   - Barre de progression visuelle en tête de page prête pour le suivi d'actions.
4. ERGONOMIE MOBILE : Design responsive adaptatif avec zones de frappe minimales de 48px et défilement fluide sans débordement horizontal.

Génère le code intégral du fichier de la première à la dernière ligne dans un Artifact unique.`,
        },
        {
          id: 'day-07-callout-tip',
          type: 'callout',
          variant: 'pro-insight',
          title: 'Que faire si Claude s\'arrête en cours d\'écriture ?',
          content: 'Si l\'Artifact s\'interrompt avant d\'avoir fermé les balises en raison de la limite d\'émission par réponse, ne relancez pas tout de zéro. Répondez simplement : « Continue la génération du code exactement à partir de la ligne [indiquer la dernière balise générée] ». Claude poursuivra l\'assemblage sans tronquer le début.',
        },
      ],
    },
    {
      id: 'day-07-step-3',
      type: 'example',
      number: 3,
      title: 'Exemple guidé',
      subtitle: 'Décorticage de l\'architecture d\'apres-hub-interactif.html',
      completionLabel: 'Valider l\'étape 3 : Exemple guidé',
      blocks: [
        {
          id: 'day-07-example-prose',
          type: 'prose',
          eyebrow: 'ANATOMIE D\'UN ARTEFACT DE QUALITÉ',
          title: 'La structure des 3 couches dans un seul fichier',
          italicAccent: 'Clarté',
          paragraphs: [
            'Regardons comment est architecturée notre démonstration phare (apres-hub-interactif.html) :',
            '1. Les variables de style (:root) : toutes les couleurs de notre charte (Rouge Brique, Rose Poudré, Crème) et les ombres franches de 4px sont déclarées au tout début du fichier dans la balise <style>. Cela permet de modifier l\'ambiance visuelle en changeant 3 lignes sans toucher à la logique.',
            '2. Le balisage sémantique : l\'application est découpée en conteneurs clairs : .simulation-bar, .hero-banner, .profile-bar, .progress-bar-container, .tabs-nav, puis les panneaux .tab-panel.',
            '3. La mécanique d\'affichage par onglets : une fonction JavaScript de 6 lignes suffit pour masquer les panneaux inactifs (.tab-panel) et afficher le panneau sélectionné (.tab-panel.active) d\'un clic, avec transition visuelle immédiate.',
          ],
        },
        {
          id: 'day-07-example-copy',
          type: 'copy',
          title: 'Extrait de Navigation par Onglets en JavaScript Vanille',
          label: 'ONGLETS-MINIMAL-ROBUSTE.JS',
          content: `function switchTab(tabId) {
  // 1. Mettre à jour l'état visuel des boutons d'onglets
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-target') === tabId);
  });

  // 2. Afficher uniquement le panneau de contenu correspondant
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === tabId);
  });
}`,
          notes: 'Ce bloc JavaScript élémentaire assure une navigation instantanée sans avoir besoin de la moindre bibliothèque externe.',
        },
        {
          id: 'day-07-example-resources',
          type: 'resource',
          title: 'Ressources Pédagogiques de la Leçon 07',
          description: 'Téléchargez le modèle minimal d\'architecture pour démarrer avec Claude.',
          resources: [
            {
              id: 'res-squelette-html',
              title: 'Gabarit de Squelette HTML Vanille Néo-Brutaliste',
              category: 'template',
              description: 'Modèle de départ avec variables CSS et conteneurs d\'onglets prêts à l\'emploi.',
              format: 'HTML',
              downloadFilename: 'squelette-neo-brutaliste-base.html',
              downloadContent: `<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <title>Application Interactive</title>\n  <style>\n    :root { --primary: #B63131; --bg: #FAF6F0; --ink: #171313; --surface: #FFFDFC; }\n    body { background: var(--bg); color: var(--ink); font-family: sans-serif; padding: 20px; }\n    .tab-panel { display: none; }\n    .tab-panel.active { display: block; }\n  </style>\n</head>\n<body>\n  <h1>Mon Application</h1>\n</body>\n</html>`,
            },
          ],
        },
      ],
    },
    {
      id: 'day-07-step-4',
      type: 'your-turn',
      number: 4,
      title: 'À vous de jouer',
      subtitle: 'Obtenez votre premier prototype dans Claude Artifacts',
      completionLabel: 'Valider le livrable de la Leçon 07',
      blocks: [
        {
          id: 'day-07-exercise-1',
          type: 'text-exercise',
          title: 'Espace de Travail Pratique : Votre Squelette d\'Application',
          instructions: 'Copiez le Prompt Maître compilé ci-dessus, exécutez-le dans Claude, vérifiez que l\'Artifact s\'affiche dans le panneau latéral, puis collez ci-dessous les premières lignes du code produit ou un résumé de la structure obtenue.',
          placeholder: 'Collez ici la structure de votre fichier HTML généré par Claude (titre, onglets prévus et styles validés)...',
          maxLength: 3000,
        },
        {
          id: 'day-07-checklist-1',
          type: 'checklist',
          title: 'Vérification de Fin de Leçon 07',
          description: 'Validez chaque élément avant de passer à l\'étape d\'enrichissement interactif (Leçon 08).',
          items: [
            {
              id: 'chk-07-1',
              label: 'J\'ai généré l\'application dans Claude et l\'Artifact s\'ouvre correctement dans le panneau latéral',
            },
            {
              id: 'chk-07-2',
              label: 'La navigation par onglets fonctionne d\'un clic dans l\'onglet Preview de Claude',
            },
            {
              id: 'chk-07-3',
              label: 'L\'esthétique reprend bien les bordures nettes, ombres franches et la palette choisie',
            },
          ],
        },
      ],
    },
  ],
};
