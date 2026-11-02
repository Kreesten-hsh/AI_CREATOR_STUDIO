import type { Day } from '../../types/course';

export const day10: Day = {
  id: 'day-10',
  dayNumber: 10,
  sprintId: 'sprint-2',
  title: 'EXPORTATION, DÉPLOIEMENT GRATUIT & VALIDATION MOBILE',
  italicTitleWord: 'DÉPLOIEMENT',
  objective: 'Exporter son fichier HTML/JS depuis Claude Artifacts, le déployer gratuitement en ligne via Netlify Drop ou GitHub Pages, et valider l\'expérience sur smartphone.',
  deliverableSummary: 'URL publique en ligne du produit numérique interactif, testé et prêt pour la vente',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-10-step-1',
      type: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: 'Démystifier l\'hébergement web pour les non-développeurs',
      completionLabel: 'Valider l\'étape 1 : Comprendre',
      blocks: [
        {
          id: 'day-10-prose-1',
          type: 'prose',
          eyebrow: 'LEÇON 10 : COMPRENDRE LES FONDATIONS',
          title: 'Livrer votre produit au monde sans barrière technique',
          italicAccent: 'Publication',
          highlightPill: 'La réalité moderne : votre fichier interactif peut être mis en ligne gratuitement et sécurisé en HTTPS par un simple glisser-déposer.',
          paragraphs: [
            'Beaucoup de créateurs pensent encore que publier un outil sur Internet nécessite d\'acheter un serveur, de configurer des DNS complexes ou de payer un abonnement mensuel d\'hébergement. C\'est faux pour les applications web autonomes.',
            'Parce que votre application est contenue dans un fichier HTML unique intégrant tous ses styles et scripts, elle n\'a besoin d\'aucun serveur d\'exécution backend. Elle est ce qu\'on appelle un actif web statique côté client.',
            'Des services modernes et réputés comme Netlify proposent une fonctionnalité entièrement gratuite appelée Netlify Drop. Le principe est d\'une simplicité désarmante : vous glissez votre dossier contenant index.html dans votre navigateur, et Netlify génère instantanément une adresse web publique sécurisée en HTTPS (par exemple https://votre-produit.netlify.app). Vos clients peuvent alors y accéder depuis n\'importe quel ordinateur, tablette ou smartphone.',
          ],
          bullets: [
            'Télécharger ou copier votre fichier index.html depuis le panneau de l\'Artifact Claude.',
            'Tester le fichier en local sur votre ordinateur en double-cliquant dessus dans votre explorateur de fichiers.',
            'Le glisser-déposer sur un service d\'hébergement statique gratuit pour obtenir une URL permanente.',
            'Vérifier que les zones tactiles et la lisibilité sont impeccables sur smartphone.',
          ],
        },
        {
          id: 'day-10-callout-1',
          type: 'callout',
          variant: 'important',
          title: 'Pourquoi une URL publique en HTTPS est indispensable',
          content: 'Disposer d\'une adresse web publique en HTTPS rassure vos acheteurs, évite les avertissements de sécurité des navigateurs et vous permet d\'intégrer facilement le lien d\'accès dans vos emails de confirmation de commande (Systeme.io, Chariow, Stan Store, Podia ou Stripe).',
        },
        {
          id: 'day-10-quiz-1',
          type: 'quiz',
          title: 'Validation des connaissances de déploiement',
          description: 'Vérifiez la compréhension du processus de mise en ligne.',
          questions: [
            {
              id: 'q10-1',
              question: 'Qu\'est-ce que Netlify Drop ?',
              options: [
                'Une interface permettant d\'héberger gratuitement un site web en glissant simplement un dossier contenant index.html',
                'Un langage de programmation payant',
                'Une clé USB spéciale pour stocker des fichiers',
              ],
              correctIndex: 0,
              explanation: 'Netlify Drop analyse le dossier glissé, le déploie sur son réseau mondial et fournit une URL HTTPS sécurisée sans ligne de commande.',
            },
            {
              id: 'q10-2',
              question: 'Quel test fondamental devez-vous réaliser avant de vendre votre outil ?',
              options: [
                'Ouvrir l\'URL sur son propre smartphone et vérifier que les boutons sont facilement cliquables avec le pouce',
                'Imprimer le code sur papier A4',
                'Attendre un an pour voir si le fichier expire',
              ],
              correctIndex: 0,
              explanation: 'La majorité de vos prospects découvriront votre offre depuis leur téléphone. L\'expérience mobile doit être irréprochable.',
            },
          ],
        },
      ],
    },
    {
      id: 'day-10-step-2',
      type: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: 'Prompt d\'audit mobile et d\'exportation finale',
      completionLabel: 'Valider l\'étape 2 : Prompt Claude',
      blocks: [
        {
          id: 'day-10-prompt-builder',
          type: 'prompt-builder',
          title: 'Prompt d\'Audit de Finition Mobile & Préparation au Déploiement',
          description: 'Ce prompt demande à Claude de passer votre code en revue pour garantir une ergonomie mobile parfaite et un fichier prêt pour Netlify Drop.',
          deliverableTarget: 'html-app',
          fields: [
            {
              key: 'productType',
              label: 'Titre de votre produit ({{productType}})',
              placeholder: 'Nom de votre outil interactif',
              profileBinding: 'productType',
            },
            {
              key: 'brandStyle',
              label: 'Direction visuelle ({{brandStyle}})',
              placeholder: 'ex. Néo-Brutaliste Éditorial',
              profileBinding: 'brandStyle',
            },
          ],
          template: `Tu es un Ingénieur Qualité Web et Expert en Ergonomie Mobile.

OBJECTIF :
Auditer, peaufiner et finaliser le code HTML/CSS/JS de notre produit interactif ({{productType}}) avant son déploiement public en ligne.

POINTS DE CONTRÔLE STRICTS À VÉRIFIER & CORRIGER :
1. BALISE VIEWPORT & RESPONSIVITÉ MOBILE :
   - Assure-toi de la présence exacte de la balise : <meta name="viewport" content="width=device-width, initial-scale=1.0">.
   - Vérifie qu'aucun élément ne dépasse en largeur (max-width: 100%, box-sizing: border-box sur tous les éléments).
   - Ajuste les grilles et conteneurs pour qu'ils s'affichent proprement sur une seule colonne sur les écrans étroits (max-width: 640px).
2. ZONES TACTILES & CONFORT DE FRAPPE :
   - Vérifie que tous les boutons d'onglets, cases à cocher et champs de saisie ont une hauteur minimale de 44px à 48px pour être actionnables sans effort avec le pouce.
   - Ajoute des marges intérieures confortables (padding) et un curseur pointeur (cursor: pointer).
3. EXPORTATION DE DONNÉES EN OPTION :
   - Ajoute un bouton discret "Exporter ma synthèse (Fichier Texte)" qui génère un fichier texte formaté (.txt) à partir des données renseignées par l'utilisateur grâce à l'API Blob du navigateur.
4. VALIDITÉ DU FICHIER MONOBLOC :
   - Assure-toi que toutes les balises HTML, styles CSS et scripts JS sont correctement fermés et prêts pour un hébergement direct sous le nom index.html.

Génère la version finale complète et impeccable de mon fichier dans un Artifact unique.`,
        },
        {
          id: 'day-10-callout-tip',
          type: 'callout',
          variant: 'tip',
          title: 'Nommer impérativement le fichier index.html',
          content: 'Pour que les serveurs web (comme Netlify ou GitHub Pages) sachent quelle page afficher par défaut, votre fichier principal doit obligatoirement être nommé index.html (en minuscules, sans espace ni accent).',
        },
      ],
    },
    {
      id: 'day-10-step-3',
      type: 'example',
      number: 3,
      title: 'Exemple guidé',
      subtitle: 'Le tutoriel pas à pas : Déployer sur Netlify Drop',
      completionLabel: 'Valider l\'étape 3 : Exemple guidé',
      blocks: [
        {
          id: 'day-10-example-prose',
          type: 'prose',
          eyebrow: 'TUTORIEL DE MISE EN LIGNE RÉELLE',
          title: 'Le protocole de déploiement pas à pas',
          italicAccent: 'Pratique',
          paragraphs: [
            'Voici la procédure exacte pour publier votre fichier et obtenir votre URL sécurisée :',
            '1. Exportez le code de Claude : dans le panneau Artifact de Claude, cliquez sur l\'icône de téléchargement. Votre navigateur enregistre un fichier sur votre ordinateur.',
            '2. Préparez votre dossier local : créez un nouveau dossier sur votre bureau (nommez-le par exemple mon-produit-interactif). Déplacez votre fichier à l\'intérieur et vérifiez qu\'il s\'appelle bien index.html.',
            '3. Rendez-vous sur Netlify Drop : ouvrez votre navigateur et allez à l\'adresse https://app.netlify.com/drop. Si vous n\'avez pas de compte, vous pouvez créer un compte gratuit en quelques clics.',
            '4. Glissez le dossier : faites glisser l\'intégralité du dossier mon-produit-interactif dans le cadre de dépôt sur la page de Netlify. L\'envoi prend quelques secondes.',
            '5. Récupérez votre URL : Netlify vous affiche immédiatement le lien public sécurisé en HTTPS (ex. https://youthful-curie-123456.netlify.app). Vous pouvez ensuite aller dans les paramètres du site (Site Settings > Change site name) pour lui donner un nom élégant (ex. https://mon-outil-expertise.netlify.app).',
          ],
        },
        {
          id: 'day-10-example-copy',
          type: 'copy',
          title: 'Protocole de Contrôle Qualité Pré-Lancement',
          label: 'CHECKLIST-PRE-LANCEMENT.TXT',
          content: `[ ] Le fichier local s'appelle bien index.html (sans majuscule)
[ ] L'application a été ouverte d'un double-clic dans Chrome, Firefox ou Safari
[ ] Les boutons et onglets répondent instantanément
[ ] Une case a été cochée, la page a été rafraîchie, la coche est toujours là
[ ] Le dossier a été déposé sur app.netlify.com/drop
[ ] L'URL publique HTTPS s'ouvre correctement depuis une fenêtre privée
[ ] L'URL a été envoyée sur votre smartphone et testée avec les doigts`,
          notes: 'Validez ces 7 points pour avoir la certitude mathématique que votre produit fonctionnera parfaitement pour vos acheteurs.',
        },
        {
          id: 'day-10-example-resources',
          type: 'resource',
          title: 'Liens & Outils d\'Hébergement Recommandés',
          description: 'Accédez aux plateformes d\'hébergement statique gratuit sans ligne de commande.',
          resources: [
            {
              id: 'res-netlify-drop',
              title: 'Netlify Drop (Interface de Glisser-Déposer)',
              category: 'guide',
              description: 'Lien direct vers l\'outil officiel de déploiement par glisser-déposer de Netlify.',
              format: 'Lien Web',
              externalUrl: 'https://app.netlify.com/drop',
            },
            {
              id: 'res-tiiny-host',
              title: 'Tiiny Host (Alternative Monopage)',
              category: 'guide',
              description: 'Solution alternative pour héberger un fichier HTML unique en quelques secondes.',
              format: 'Lien Web',
              externalUrl: 'https://tiiny.host',
            },
          ],
        },
      ],
    },
    {
      id: 'day-10-step-4',
      type: 'your-turn',
      number: 4,
      title: 'À vous de jouer',
      subtitle: 'Publiez votre outil et enregistrez votre livrable officiel',
      completionLabel: 'Valider le livrable du Module 02',
      blocks: [
        {
          id: 'day-10-exercise-1',
          type: 'text-exercise',
          title: 'Espace de Validation Officielle du Module 02',
          instructions: 'Collez ci-dessous l\'URL publique de votre produit interactif hébergé (Netlify Drop ou autre) et notez vos observations suite à votre test réel sur smartphone.',
          placeholder: 'URL publique de mon produit : https://...\nObservations du test mobile : [Affichage des onglets, confort tactile, persistance confirmée]',
          maxLength: 3000,
        },
        {
          id: 'day-10-checklist-1',
          type: 'checklist',
          title: 'Validation Finale du Module 02',
          description: 'Cochez chaque point pour officialiser la complétion de votre deuxième grand module.',
          items: [
            {
              id: 'chk-10-1',
              label: 'Mon produit interactif est déployé sur le web et accessible via une URL sécurisée en HTTPS',
            },
            {
              id: 'chk-10-2',
              label: 'J\'ai testé le lien sur mon smartphone et l\'ergonomie est fluide sans débordement horizontal',
            },
            {
              id: 'chk-10-3',
              label: 'Mon livrable du Module 02 est achevé et prêt à être intégré sur ma future page de vente (Module 03)',
            },
          ],
        },
      ],
    },
  ],
};
