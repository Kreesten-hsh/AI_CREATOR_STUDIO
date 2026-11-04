import type { Day } from '../../types/course';

export const day08: Day = {
  id: 'day-08',
  dayNumber: 8,
  sprintId: 'sprint-2',
  title: 'CALCULATEURS, DIAGNOSTICS & PERSISTANCE LOCALSTORAGE',
  italicTitleWord: 'LOCALSTORAGE',
  objective: 'Intégrer des composants actifs à forte valeur perçue (calculateur interactif, questionnaire diagnostique, checklist) avec sauvegarde automatique dans localStorage.',
  deliverableSummary: 'Outil interactif avec persistance locale et calculateur fonctionnel',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-08-step-1',
      type: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: 'La persistance locale sans serveur ni base de données',
      completionLabel: 'Valider l\'étape 1 : Comprendre',
      blocks: [
        {
          id: 'day-08-prose-1',
          type: 'prose',
          eyebrow: 'LEÇON 08 : COMPRENDRE LES FONDATIONS',
          title: 'Le super-pouvoir du stockage local (localStorage)',
          italicAccent: 'Mémoire',
          highlightPill: 'La règle clé : donner à votre produit une mémoire instantanée sans abonnement de base de données ni identifiant utilisateur.',
          paragraphs: [
            'L\'un des plus grands freins au développement de logiciels pour les non-programmeurs a toujours été la gestion des bases de données et des comptes utilisateurs. Dès qu\'un outil nécessite un serveur, un hébergement backend et un système d\'authentification par mot de passe, les coûts explosent et la maintenance devient complexe.',
            'L\'API native localStorage des navigateurs web résout intégralement ce problème pour les produits numériques. Elle permet à votre application de stocker des données directement dans la mémoire du navigateur de votre client sous forme de paires clé/valeur.',
            'Chaque fois que l\'acheteur coche une action sur sa feuille de route, ajuste un curseur de calcul ou renseigne un profil, l\'information est enregistrée silencieusement. Lorsqu\'il ferme son navigateur et revient le lendemain ou trois semaines plus tard, l\'application recharge instantanément ses données exactes. C\'est ce qui transforme un simple document en un véritable espace de travail personnel.',
            'Techniquement, le fonctionnement repose sur deux fonctions standards : les données saisies sont converties en texte avec JSON.stringify() pour être stockées dans localStorage, puis réinjectées dans l\'interface avec JSON.parse() dès l\'ouverture de la page.',
          ],
          bullets: [
            'Zéro coût de serveur et zéro infrastructure technique à maintenir.',
            'Confidentialité absolue : les données saisies par vos clients restent sur leur appareil et ne transitent sur aucun serveur externe.',
            'Fonctionnement ultra-rapide et compatible hors ligne une fois le fichier ouvert.',
          ],
        },
        {
          id: 'day-08-quiz-1',
          type: 'quiz',
          title: 'Validation de la persistance locale',
          description: 'Testez votre compréhension du stockage local.',
          questions: [
            {
              id: 'q8-1',
              question: 'Que se passe-t-il si un utilisateur ferme son navigateur après avoir coché des cases dans un outil utilisant localStorage ?',
              options: [
                'Toutes les cases restent cochées lorsqu\'il rouvre la page sur le même appareil',
                'Tout est effacé et il doit recommencer',
                'Il reçoit une facture pour l\'hébergement de ses données',
              ],
              correctIndex: 0,
              explanation: 'Le navigateur conserve les données associées à la page. Au rechargement, le script relit localStorage et restaure l\'état exact.',
            },
            {
              id: 'q8-2',
              question: 'Pourquoi ce système est-il idéal pour vendre un produit numérique à des particuliers ou indépendants ?',
              options: [
                'Parce qu\'il ne nécessite aucun serveur payant, aucun mot de passe à gérer et garantit la confidentialité totale',
                'Parce qu\'il permet de pirater les ordinateurs des clients',
                'Parce qu\'il remplace le système d\'exploitation',
              ],
              correctIndex: 0,
              explanation: 'Pour le créateur, les coûts de fonctionnement sont nuls. Pour l\'acheteur, l\'accès est instantané sans mot de passe oublié.',
            },
          ],
        },
      ],
    },
    {
      id: 'day-08-step-2',
      type: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: 'Prompt d\'injection de calculateur et persistance',
      completionLabel: 'Valider l\'étape 2 : Prompt Claude',
      blocks: [
        {
          id: 'day-08-prompt-builder',
          type: 'prompt-builder',
          title: 'Prompt d\'Enrichissement Interactif & Sauvegarde Locale',
          description:
            'Ce prompt demande à Claude d\'insérer un calculateur personnalisé et une liste d\'actions persistante dans votre application existante. Si vous avez une formule mathématique précise (ex. Tarif Journalier = (Revenu Souhaité + Charges) / Jours Travaillés), écrivez-la clairement dans le prompt pour une implémentation exacte.',
          deliverableTarget: 'claude-artifact',
          fields: [
            {
              key: 'business',
              label: 'Thématique / Niche ({{business}})',
              placeholder: 'Votre domaine d\'expertise',
              profileBinding: 'business',
            },
            {
              key: 'targetAudience',
              label: 'Audience cible ({{targetAudience}})',
              placeholder: 'Vos clients idéaux',
              profileBinding: 'targetAudience',
            },
            {
              key: 'mainObjective',
              label: 'Objectif du calcul ({{mainObjective}})',
              placeholder: 'ex. Calculer le tarif horaire minimum rentable ou le volume de prospects à contacter',
              profileBinding: 'mainObjective',
            },
          ],
          template: `Tu es un Ingénieur Frontend Senior expert en JavaScript vanille et ergonomie d'outils numériques.

CONTEXTE DU PROJET :
- Activité : {{business}}
- Audience : {{targetAudience}}
- Objectif clé du calculateur : {{mainObjective}}

MISSION :
À partir du code HTML de mon application interactive, intègre deux composants interactifs majeurs dotés d'une persistance locale totale via localStorage :

1. LE CALCULATEUR INTERACTIF EN TEMPS RÉEL :
   - Crée un composant de calcul dédié à mon sujet comprenant 3 champs de saisie numériques intuitifs avec valeurs par défaut réalistes.
   - Branche un écouteur d'événement sur chaque champ (input) qui recalcule et affiche immédiatement le résultat clé en gros caractères (font-size: 36px+, couleur d'accent issue de la palette) sans recharger la page.
   - Ajoute une interprétation textuelle personnalisée sous le chiffre (ex. recommandation de volume, alerte ou conseil d'action).

2. LA FEUILLE DE ROUTE D'ACTIONS AVEC SAUVEGARDE AUTOMATIQUE :
   - Crée une checklist de 8 à 10 actions concrètes découpées par étapes logiques.
   - Chaque case à cocher doit être cliquable sur toute la largeur de sa carte.
   - L'état de chaque case (cochée ou non) doit être sauvegardé automatiquement dans localStorage sous la clé unique de mon projet.
   - Ajoute les deux fonctions universelles JavaScript : saveState() et loadState(), et appelle loadState() dès le chargement de la page pour restaurer instantanément les coches de l'utilisateur.

3. BOUTON DE RÉINITIALISATION SÉCURISÉ :
   - Ajoute un bouton discret permettant à l'utilisateur de réinitialiser toutes ses cases avec une confirmation par boîte de dialogue (confirm).

Fournis le code complet mis à jour dans un Artifact unique, propre, documenté et sans framework externe.`,
        },
      ],
    },
    {
      id: 'day-08-step-3',
      type: 'example',
      number: 3,
      title: 'Exemple guidé',
      subtitle: 'Le code JavaScript exact de sauvegarde d\'apres-hub-interactif.html',
      completionLabel: 'Valider l\'étape 3 : Exemple guidé',
      blocks: [
        {
          id: 'day-08-example-prose',
          type: 'prose',
          eyebrow: 'LE MODÈLE TECHNIQUE PROUVÉ',
          title: 'Comment apres-hub-interactif.html gère la persistance',
          italicAccent: 'Fiabilité',
          paragraphs: [
            'Dans notre démonstration phare, la persistance repose sur un objet JavaScript checkedTasks qui associe chaque identifiant de tâche à sa valeur (true ou false).',
            'Dès que l\'utilisateur clique sur une tâche, la fonction toggleTask(taskId) inverse la valeur, met à jour la classe visuelle .checked, recalcule le pourcentage de la barre de progression, et appelle immédiatement saveState().',
            'La fonction saveState() prend cet objet, le transforme en chaîne JSON et l\'écrit dans localStorage. C\'est simple, fiable, robuste, et cela ne génère aucune erreur même si la connexion Internet est coupée.',
          ],
        },
        {
          id: 'day-08-example-copy',
          type: 'copy',
          title: 'Le Pattern Universel de Sauvegarde Locale',
          label: 'PATTERN-LOCALSTORAGE-UNIVERSAL.JS',
          content: `const STORAGE_KEY = 'mon_produit_interactif_v1';
let checkedTasks = {};

// Charger les données sauvegardées à l'ouverture de la page
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.checkedTasks) checkedTasks = parsed.checkedTasks;
    }
  } catch (e) {
    console.error('Erreur lecture localStorage', e);
  }
}

// Enregistrer les données immédiatement après chaque action
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ checkedTasks }));
  } catch (e) {
    console.error('Erreur écriture localStorage', e);
  }
}

// Inverser une case et sauvegarder
function toggleTask(taskId) {
  checkedTasks[taskId] = !checkedTasks[taskId];
  const el = document.getElementById(taskId);
  if (el) el.classList.toggle('checked', Boolean(checkedTasks[taskId]));
  saveState();
}`,
          notes: 'Ce patron de code est le standard utilisé dans les meilleurs micro-logiciels indépendants.',
        },
        {
          id: 'day-08-example-resources',
          type: 'resource',
          title: 'Ressources Pédagogiques Associées',
          description: 'Accédez aux extraits de code pour accélérer votre développement avec Claude.',
          resources: [
            {
              id: 'res-snippet-calc',
              title: 'Extrait Calculateur & Écouteurs Input',
              category: 'template',
              description: 'Exemple de fonction de calcul dynamique sans rechargement de page.',
              format: 'JavaScript',
              downloadFilename: 'calculateur-vanilla-exemple.js',
              downloadContent: `function calculate() {\n  const valA = parseFloat(document.getElementById('input-a').value) || 0;\n  const valB = parseFloat(document.getElementById('input-b').value) || 0;\n  const result = valA * valB;\n  document.getElementById('result-display').textContent = result.toFixed(2);\n}\n`,
            },
          ],
        },
      ],
    },
    {
      id: 'day-08-step-4',
      type: 'your-turn',
      number: 4,
      title: 'À vous de jouer',
      subtitle: 'Ajoutez le calculateur et la persistance dans votre application',
      completionLabel: 'Valider le livrable de la Leçon 08',
      blocks: [
        {
          id: 'day-08-exercise-1',
          type: 'text-exercise',
          title: 'Espace de Travail Pratique : Votre Composant Actif',
          instructions: 'Collez ci-dessous le code de votre calculateur et confirmez que la persistance fonctionne en cochant des cases dans l\'onglet Preview de Claude, en rafraîchissant l\'aperçu, et en constatant que vos sélections restent mémorisées.',
          placeholder: 'Détaillez ici les variables de votre calculateur et confirmez le test de persistance au rafraîchissement...',
          maxLength: 3000,
        },
        {
          id: 'day-08-checklist-1',
          type: 'checklist',
          title: 'Vérification de Fin de Leçon 08',
          description: 'Validez chaque test avant de passer à la gamification et aux barres de progression (Leçon 09).',
          items: [
            {
              id: 'chk-08-1',
              label: 'Mon calculateur met à jour son résultat en temps réel dès que je modifie une valeur',
            },
            {
              id: 'chk-08-2',
              label: 'Mes cases à cocher restent mémorisées lorsque je rafraîchis l\'aperçu de la page',
            },
            {
              id: 'chk-08-3',
              label: 'Le bouton de réinitialisation fonctionne et remet les compteurs à zéro après confirmation',
            },
          ],
        },
      ],
    },
  ],
};
