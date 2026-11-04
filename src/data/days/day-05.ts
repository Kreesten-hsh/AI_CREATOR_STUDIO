import type { Day } from '../../types/course';

export const day05: Day = {
  id: 'day-05',
  dayNumber: 5,
  sprintId: 'module-02',
  title: 'PILOTER CLAUDE ET CONSTRUIRE SON PRODUIT',
  italicTitleWord: 'CONSTRUIRE',
  objective:
    "Transmettre votre matière et votre blueprint à Claude pour générer une première version fonctionnelle de votre produit interactif en HTML/CSS/JS autonome, intégrant d'emblée la sauvegarde portable JSON et une gestion résiliente du stockage navigateur.",
  deliverableSummary: 'Première version fonctionnelle du produit interactif personnel',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-05-step-1',
      type: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: 'Génération autonome, stockage et itération chirurgicale',
      completionLabel: "Valider l'étape 1 : Comprendre",
      blocks: [
        {
          id: 'day05-step1-claude-formats',
          type: 'prose',
          eyebrow: '1.1 DISTINCTION CRITIQUE DES FONCTIONNALITÉS CLAUDE',
          title: 'Artifacts classiques, Artifacts propulsés par Claude et HTML autonome',
          highlightPill: 'Vendre un produit qui fonctionne chez votre client sans compte Claude',
          paragraphs: [
            "Dans l'interface de Claude, plusieurs mécanismes coexistent. Les confondre peut bloquer l'utilisation de votre produit chez vos futurs acheteurs :",
          ],
          bullets: [
            "1. Les Artifacts classiques : ils permettent d'afficher un aperçu visuel dans Claude, de consulter le code source, de le copier et de télécharger le fichier brut. Attention : le simple téléchargement d'un Artifact ne garantit pas automatiquement qu'il fonctionne hors ligne s'il dépend de bibliothèques externes mal chargées.",
            "2. Les Artifacts propulsés par Claude (AI-powered Artifacts) : ils intègrent des appels en direct à l'API Claude d'Anthropic. Ils obligent votre acheteur final à posséder son propre compte Claude et ne prennent pas en charge de stockage persistant autonome. Vous ne devez jamais utiliser ce mode pour un produit vendu sur Chariow.",
            "3. Le fichier HTML5 / CSS / JavaScript standard autonome (notre cible) : en demandant explicitement à Claude un fichier unique `.html` contenant son style CSS et sa logique JavaScript standard (Vanilla JS), toute l'intelligence de votre méthode s'exécute directement dans le navigateur de votre client, sur ordinateur comme sur téléphone, sans abonnement ni compte tiers.",
          ],
        },
        {
          id: 'day05-step1-storage-architecture',
          type: 'prose',
          eyebrow: '1.2 ARCHITECTURE DE SAUVEGARDE : POURQUOI COMBINER HTTPS ET JSON',
          title: 'La réalité technique de localStorage et la sauvegarde portable JSON',
          paragraphs: [
            "Comment votre acheteur conserve-t-il les données qu'il saisit dans votre outil ? La documentation technique de référence (MDN Web Docs) établit une distinction fondamentale que vous devez intégrer dès la création :",
          ],
          bullets: [
            "En ligne sur une adresse HTTPS stable (ex. hébergement statique Netlify) : le stockage navigateur (`window.localStorage`) fonctionne de manière persistante sur l'appareil utilisé. Il doit toutefois toujours être entouré d'un bloc de sécurité `try / catch` pour ne jamais bloquer l'outil si l'utilisateur navigue en mode privé.",
            "En ouverture locale directe (`file://`, lorsque l'acheteur ouvre le fichier `.html` décompressé sur son ordinateur) : le comportement de `localStorage` n'est pas garanti et varie selon les navigateurs. En revanche, tous les calculs, diagnostics et filtres JavaScript fonctionnent parfaitement hors ligne.",
            "La solution obligatoire (Sauvegarde portable JSON) : votre produit doit intégrer deux boutons (« Exporter mes données .json » et « Importer mes données .json »). Ainsi, votre client peut télécharger un petit fichier de sauvegarde sur son appareil et restaurer instantanément son travail, même hors ligne ou en passant de son téléphone à son ordinateur.",
          ],
        },
        {
          id: 'day05-step1-iterative-method',
          type: 'callout',
          variant: 'tip',
          title: 'Méthode d’itération chirurgicale : ne régénérez pas tout à l’aveugle',
          content:
            "Construisez d'abord la logique complète (calculs, interactions et sauvegarde JSON) avec une mise en page propre. Si vous repérez une erreur sur une formule ou un bouton, décrivez précisément le comportement observé et le comportement attendu en demandant à Claude de corriger uniquement la fonction concernée sans supprimer le reste des fonctionnalités.",
        },
        {
          id: 'day05-step1-quiz',
          type: 'quiz',
          title: 'Vérification technique avant génération',
          description: 'Validez ces 3 règles d’ingénierie pour éviter tout blocage chez vos futurs clients.',
          questions: [
            {
              id: 'q-d05-ai-artifact',
              question:
                'Pourquoi ne faut-il pas vendre un « Artifact propulsé par l’API Claude » comme produit autonome ?',
              options: [
                'Parce qu’il impose à l’acheteur final d’avoir un compte Claude et ne gère pas de stockage persistant autonome',
                'Parce que Claude interdit d’utiliser la couleur bleue',
                'Parce qu’il ne fonctionne que sur téléviseur',
              ],
              correctIndex: 0,
              explanation:
                'Un produit vendu sur Chariow doit fonctionner immédiatement chez votre client sans lui imposer de créer un compte Claude ni de consommer ses propres quotas.',
            },
            {
              id: 'q-d05-file-protocol',
              question:
                'Pourquoi intégrons-nous systématiquement un bouton Exporter / Importer en `.json` en plus de `localStorage` ?',
              options: [
                'Parce que `localStorage` n’est pas garanti sur un fichier ouvert en `file://` et ne transfère pas les données entre le téléphone et l’ordinateur',
                'Uniquement pour décorer le haut de la page',
                'Parce que le format JSON remplace le CSS',
              ],
              correctIndex: 0,
              explanation:
                'Selon MDN, `localStorage` dépend d’une origine HTTP/HTTPS stable et reste lié à un seul navigateur. L’export/import JSON offre une sauvegarde portable universelle.',
            },
            {
              id: 'q-d05-try-catch',
              question:
                'Que se passe-t-il si votre code appelle `localStorage` sans bloc `try / catch` dans un navigateur qui bloque le stockage ?',
              options: [
                'Le script JavaScript peut s’arrêter avec une erreur `SecurityError` et bloquer les boutons de l’outil',
                'L’ordinateur redémarre automatiquement',
                'Le fichier HTML se transforme en PDF',
              ],
              correctIndex: 0,
              explanation:
                'Encapsuler `localStorage` dans `try / catch` garantit que les calculs et l’export JSON restent 100 % fonctionnels en toutes circonstances.',
            },
          ],
        },
      ],
    },
    {
      id: 'day-05-step-2',
      type: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: 'Générer votre produit interactif V1 avec sauvegarde JSON',
      completionLabel: "Valider l'étape 2 : Prompt Claude",
      blocks: [
        {
          id: 'day05-step2-master-prompt',
          type: 'prompt-builder',
          title: 'Compilateur du Prompt de Construction HTML/CSS/JS Autonome (Leçon 05)',
          description:
            "Copiez ce prompt dans Claude en y insérant votre Blueprint validé à la Leçon 04 et vos règles métiers.",
          deliverableTarget: 'html-app',
          fields: [
            {
              key: 'business',
              label: "Domaine d'expertise",
              placeholder: 'Ex. Conseil RH, Gestion financière, Coaching...',
              profileBinding: 'business',
            },
            {
              key: 'targetAudience',
              label: 'Acheteur final',
              placeholder: 'Ex. Dirigeants de PME, Freelances, Étudiants...',
              profileBinding: 'targetAudience',
            },
            {
              key: 'productType',
              label: 'Nom et format de votre produit',
              placeholder: 'Ex. Calculateur de Capacité & Feuille de Route 30 Jours',
              profileBinding: 'productType',
            },
            {
              key: 'mainObjective',
              label: 'Résultat concret délivré par l’outil',
              placeholder: 'Ex. Calculer sa capacité réelle et obtenir son plan d’action...',
              profileBinding: 'mainObjective',
            },
          ],
          template: `<role>
Tu es un Ingénieur Frontend Senior spécialisé dans la création d'applications web autonomes monofichiers (HTML5, CSS3 embarqué et JavaScript Vanilla ES6+ sans dépendance serveur).
</role>

<context>
Je construis la première version fonctionnelle (V1) de mon produit digital interactif destiné à mes clients :
- Domaine : {{business}}
- Utilisateur final : {{targetAudience}}
- Produit : {{productType}}
- Objectif opérationnel : {{mainObjective}}
</context>

<blueprint_and_source>
[COLLEZ ICI VOTRE BLUEPRINT DE LA LEÇON 04 :
- Données d'entrée (Inputs) et valeurs par défaut
- Formules exactes de calcul, barèmes de diagnostic ou règles de génération
- Résultats attendus (Outputs)
- Sections de l'interface (2 à 4 onglets/panneaux)
- Contenu réel de votre méthode (listes de contrôle, profils, exemples)]
</blueprint_and_source>

<technical_requirements>
Respecte impérativement ces 6 exigences d'architecture :
1. FICHIER UNIQUE AUTONOME : Produis un seul fichier \`index.html\` complet (\`<!DOCTYPE html>\`, \`<style>\` interne, \`<script>\` interne) qui fonctionne hors ligne sans framework externe ni appel API vers Claude.
2. INTERACTIONS RÉELLES : Toutes les formules, jauges, filtres et onglets doivent réagir immédiatement aux saisies de l'utilisateur avec des données par défaut réalistes dès l'ouverture.
3. SAUVEGARDE LOCALE PROTÉGÉE : Utilise \`window.localStorage\` uniquement à l'intérieur de blocs \`try / catch\` afin qu'aucune restriction navigateur (mode privé ou ouverture locale \`file://\`) ne génère d'erreur bloquante. Affiche un discret indicateur d'état du stockage.
4. SAUVEGARDE PORTABLE JSON OBLIGATOIRE : Intègre une barre d'actions permettant à l'utilisateur :
   - De cliquer sur "Exporter mes données (.json)" pour télécharger un fichier JSON contenant toutes ses saisies et cases cochées.
   - De cliquer sur "Importer une sauvegarde (.json)" (\`<input type="file" accept=".json">\`) pour restaurer intégralement son état à l'écran, avec validation du fichier et message de confirmation.
   - De réinitialiser l'outil aux valeurs par défaut.
5. RESPONSIVE DESIGN : Utilise CSS Grid et Flexbox pour que l'outil soit parfaitement lisible et manipulable sur smartphone (375px) comme sur ordinateur.
6. CODE COMPLET : N'utilise aucun commentaire de troncature du type \`// reste du code ici\`. Écris l'intégralité du fichier HTML/CSS/JS prêt à être enregistré et testé. Sans tirets cadratins dans les textes affichés.
</technical_requirements>`,
        },
      ],
    },
    {
      id: 'day-05-step-3',
      type: 'example',
      number: 3,
      title: 'Exemple guidé',
      subtitle: 'Inspection du code de sauvegarde hybride du prototype',
      completionLabel: "Valider l'étape 3 : Exemple guidé",
      blocks: [
        {
          id: 'day05-step3-code-explanation',
          type: 'prose',
          eyebrow: '3.1 DÉMONSTRATION TECHNIQUE',
          title: 'Comment le prototype gère simultanément localStorage et l’export/import JSON',
          paragraphs: [
            "Dans notre produit témoin (`/demos/pdf-to-hub/apres-hub-interactif.html`), l'état complet de l'utilisateur (profil choisi, heures saisies et tâches cochées) est centralisé dans une fonction `getSerializableState()`.",
            "Lorsque l'utilisateur modifie un champ sur une URL HTTPS, `saveState()` enregistre cet objet dans `localStorage` à l'intérieur d'un `try / catch`. S'il ouvre le fichier hors ligne ou change d'appareil, `exportDataJson()` et `importDataJsonString()` lui permettent de conserver et recharger exactement le même objet JSON sans dépendre du navigateur.",
          ],
        },
        {
          id: 'day05-step3-copy-pattern',
          type: 'copy',
          title: 'Bloc de référence : Patron JavaScript de sauvegarde portable JSON + localStorage',
          label: 'PATRON JS VÉRIFIÉ (INTÉGRÉ AU PROTOTYPE TÉMOIN)',
          content: `function getSerializableState() {
  return {
    schemaVersion: 1,
    inputs: currentInputs,
    checkedItems: Object.assign({}, checkedItems),
    exportedAt: new Date().toISOString()
  };
}

function saveState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(getSerializableState()));
  } catch (e) {
    // Mode local file:// ou navigation privée : l'outil continue de fonctionner normalement
  }
}

function exportDataJson() {
  const payload = JSON.stringify(getSerializableState(), null, 2);
  const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sauvegarde-utilisateur.json';
  a.click();
  URL.revokeObjectURL(url);
}`,
          notes:
            "Si Claude oublie l'export/import JSON lors de votre première génération, copiez-lui ce bloc en lui demandant de l'adapter aux variables de votre outil.",
        },
      ],
    },
    {
      id: 'day-05-step-4',
      type: 'your-turn',
      number: 4,
      title: 'À vous de jouer',
      subtitle: 'Générer et vérifier votre première version fonctionnelle',
      completionLabel: "Valider l'étape 4 : À vous de jouer",
      blocks: [
        {
          id: 'day05-product-v1',
          type: 'text-exercise',
          title: 'Exercice principal : Journal de construction de votre V1 fonctionnelle',
          instructions:
            "Exécutez le prompt de l'étape 2 dans Claude, téléchargez ou enregistrez le code généré dans un fichier `index.html` sur votre ordinateur, ouvrez-le dans votre navigateur et décrivez ci-dessous : 1) les interactions qui fonctionnent déjà, 2) le test du bouton Exporter/Importer JSON, et 3) les corrections éventuelles demandées à Claude.",
          placeholder:
            "1. Nom du fichier généré : index.html\n2. Interactions testées dans le navigateur (calculs, onglets, listes) :\n3. Résultat du test Exporter (.json) puis Importer (.json) :\n4. Ajustements demandés à Claude pour obtenir la V1 stable :",
          minLength: 60,
          maxLength: 5000,
        },
        {
          id: 'day05-checklist',
          type: 'checklist',
          title: 'Critères de validation observables (Leçon 05)',
          description:
            'Cochez chaque point après l’avoir constaté en ouvrant votre fichier `index.html` dans votre navigateur.',
          items: [
            {
              id: 'chk-d05-standalone',
              label: 'Fichier HTML unique qui s’ouvre sans erreur',
              detail:
                "Double-cliquer sur `index.html` affiche l'interface complète et les données par défaut sans nécessiter de compte Claude.",
            },
            {
              id: 'chk-d05-interactions',
              label: 'Calculs et interactions exacts hors réseau',
              detail:
                'Modifier les saisies met immédiatement à jour les résultats conformément aux règles de votre blueprint.',
            },
            {
              id: 'chk-d05-json-roundtrip',
              label: 'Cycle Exporter (.json) et Importer (.json) opérationnel',
              detail:
                'Vous pouvez exporter vos saisies en `.json`, réinitialiser la page, puis réimporter le fichier `.json` et retrouver exactement vos données.',
            },
            {
              id: 'chk-d05-no-truncation',
              label: 'Code complet sans section inachevée',
              detail:
                'Tous les onglets et boutons prévus au blueprint sont actifs et remplis avec votre vrai contenu.',
            },
          ],
        },
      ],
    },
  ],
};
