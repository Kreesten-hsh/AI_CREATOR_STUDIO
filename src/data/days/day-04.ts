import type { Day } from '../../types/course';

export const day04: Day = {
  id: 'day-04',
  dayNumber: 4,
  sprintId: 'module-02',
  title: 'IMAGINER ET ORGANISER SON PRODUIT',
  italicTitleWord: 'ORGANISER',
  objective:
    "Déterminer les actions que votre acheteur final doit accomplir, sélectionner le format interactif adapté et rédiger le cahier des charges fonctionnel (blueprint) de votre produit avant de générer la moindre ligne de code.",
  deliverableSummary: 'Blueprint complet de son propre produit interactif',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-04-step-1',
      legacyType: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: 'De la matière brute au blueprint fonctionnel',
      completionLabel: "Valider l'étape 1 : Comprendre",
      blocks: [
        {
          id: 'day04-step1-when-interactive',
          type: 'prose',
          eyebrow: '1.1 QUAND L’INTERACTIVITÉ APPORTE UNE VALEUR RÉELLE',
          title: 'Choisir le bon format parmi les 7 familles d’interactions',
          highlightPill: 'Entrées utilisateur -> Logique de traitement -> Résultat personnalisé',
          paragraphs: [
            "Un document statique (PDF, ebook, guide écrit) reste un excellent format lorsque votre client cherche une lecture linéaire. En revanche, l'interactivité devient décisive lorsqu'elle facilite une action concrète que le lecteur peine à faire seul : personnaliser un plan, calculer un chiffre, diagnostiquer sa situation, organiser ses priorités ou générer un texte prêt à l'emploi.",
            "Pour concevoir votre propre produit (et non reproduire AI CREATOR Studio), choisissez l'interaction principale (ou la combinaison de 2 interactions complémentaires au maximum) parmi ces 7 formats éprouvés :",
          ],
          bullets: [
            "1. Le Diagnostic à score ou profilage : l'utilisateur répond à une série de questions ciblées et obtient son profil précis avec les 3 actions prioritaires adaptées à son cas.",
            "2. Le Calculateur ou simulateur : l'utilisateur saisit ses variables chiffrées (heures, coûts, tarifs, quantités, apports) et visualise instantanément ses résultats sans formule tableur complexe.",
            "3. Le Générateur de modèles ou de prompts : l'utilisateur remplit quelques champs de contexte et récupère un script, un courrier, un cahier des charges ou un prompt assemblé sur mesure.",
            "4. Le Parcours guidé étape par étape : une méthode découpée en séquences courtes avec validation progressive pour accompagner une exécution sans dispersion.",
            "5. La Checklist dynamique d'audit ou de contrôle : une grille de vérification interactive qui calcule un taux de conformité et liste les points manquants à corriger.",
            "6. La Matrice d'aide à la décision : un comparateur ou trieur multi-critères qui aide l'acheteur à arbitrer entre plusieurs options selon ses contraintes.",
            "7. Le Hub opérationnel de ressources : un tableau de bord réunissant un micro-calculateur, une feuille de route cochable et des modèles copiables en un clic.",
          ],
        },
        {
          id: 'day04-step1-blueprint-anatomy',
          type: 'prose',
          eyebrow: '1.2 STRUCTURE DU BLUEPRINT & PÉRIMÈTRE V1',
          title: 'Définir les entrées, les sorties et ce qui reste hors périmètre',
          paragraphs: [
            "Si vous demandez à Claude : « Crée-moi une application sur mon sujet », il générera une interface générique et superficielle. Pour obtenir un outil pertinent du premier coup, vous devez lui fournir un Blueprint structuré en 5 blocs :",
          ],
          bullets: [
            "Les actions de l'utilisateur final : que fait concrètement votre acheteur dans l'outil en moins de 10 minutes ?",
            "Le flux Entrées -> Traitement -> Sorties : quelles données l'utilisateur saisit-il (Inputs), quelle règle ou formule votre méthode applique-t-elle, et quel résultat visible (Output) obtient-il à l'écran ?",
            "L'organisation des sections : 2 à 4 onglets ou panneaux clairs au maximum pour garder une prise en main immédiate sur téléphone comme sur ordinateur.",
            "Les fonctionnalités indispensables (MVP) : les interactions cœur de métier, complétées par une fonction d'export et d'import en fichier JSON pour permettre à l'acheteur de sauvegarder ses données de façon portable.",
            "Le hors-périmètre strict : aucun serveur backend, aucune base de données externe, aucun système de création de compte avec mot de passe, et aucun appel en direct à une API payante. Toute la logique s'exécute dans le navigateur de votre acheteur.",
            "Une première hypothèse tarifaire : notez dès maintenant un ordre de grandeur de prix à titre de réflexion préliminaire (par exemple entre 10 000 FCFA et 25 000 FCFA selon la valeur d'usage et le temps économisé), que vous affinerez méthodiquement à la Leçon 07.",
          ],
        },
        {
          id: 'day04-step1-callout-scope',
          type: 'callout',
          variant: 'important',
          title: 'Règle de simplicité : 1 problème résolu = 1 parcours fluide',
          content:
            "Un bon produit interactif V1 ne cherche pas à remplacer un logiciel complet. Il prend la méthode que vous avez identifiée au Module 01 et la transforme en un outil ciblé, rapide à comprendre et immédiatement utile pour votre acheteur.",
        },
      ],
    },
    {
      id: 'day-04-step-2',
      legacyType: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: 'Générer le blueprint fonctionnel de votre produit',
      completionLabel: "Valider l'étape 2 : Prompt Claude",
      blocks: [
        {
          id: 'day04-step2-master-prompt',
          type: 'prompt-builder',
          title: 'Compilateur du Prompt Architecte de Blueprint (Leçon 04)',
          description:
            "Vérifiez vos variables ci-dessous, puis copiez ce prompt dans Claude en y joignant le problème, la fiche acheteur et la promesse définis au Module 01.",
          deliverableTarget: 'claude-artifact',
          fields: [
            {
              key: 'business',
              label: "Votre domaine d'expertise",
              placeholder: 'Ex. Conseil en recrutement PME, Coaching budgétaire, Pédagogie...',
              profileBinding: 'business',
            },
            {
              key: 'targetAudience',
              label: 'Votre acheteur cible en situation',
              placeholder: 'Ex. Dirigeants de PME recrutant sans service RH, Freelances...',
              profileBinding: 'targetAudience',
            },
            {
              key: 'mainObjective',
              label: 'Promesse de transformation (issue de la Leçon 03)',
              placeholder: 'Ex. Évaluer objectivement un candidat en 15 minutes avec une grille pondérée...',
              profileBinding: 'mainObjective',
            },
            {
              key: 'productType',
              label: 'Format interactif pressenti',
              placeholder: 'Ex. Calculateur + Checklist dynamique, Diagnostic à score...',
              profileBinding: 'productType',
            },
          ],
          template: `<role>
Tu es un Architecte Produit Digital Senior spécialisé dans la transformation d'expertises métiers en outils web interactifs autonomes (HTML5, CSS, JavaScript standard sans serveur).
Ton rôle est de concevoir le Blueprint fonctionnel complet de mon produit avant sa phase de construction.
</role>

<context>
- Domaine d'expertise : {{business}}
- Acheteur final visé : {{targetAudience}}
- Promesse de transformation : {{mainObjective}}
- Orientation de format envisagée : {{productType}}
</context>

<source_material>
[COLLEZ ICI VOS ÉLÉMENTS DU MODULE 01 :
1. Le problème prioritaire retenu (Leçon 01)
2. Les frustrations et critères de décision de l'acheteur (Leçon 02)
3. Vos règles, formules de calcul, étapes méthodologiques ou grilles d'évaluation]
</source_material>

<constraints>
- Ne génère AUCUN code informatique à cette étape : nous validons d'abord l'architecture fonctionnelle.
- Ne propose aucune fonctionnalité nécessitant un backend, une base de données, des comptes utilisateurs ou une clé API externe.
- Prévois systématiquement dans les fonctionnalités indispensables un mécanisme de sauvegarde portable par export et import de fichier JSON, ainsi qu'une sauvegarde locale en ligne tolérante aux erreurs.
- N'impose aucune charte graphique préconçue : le produit aura ma propre identité visuelle définie pour mon marché.
- N'utilise aucun tiret cadratin dans ta réponse.
</constraints>

<output_format>
Rédige le Blueprint complet de mon produit selon ces 7 sections :

### 1. Format interactif recommandé et justification d'usage
- Choix précis parmi : diagnostic, calculateur, générateur, parcours guidé, checklist dynamique, matrice ou hub de ressources.
- Explication concrète de l'action facilitée par rapport à un document statique.

### 2. Spécification Entrées -> Logique -> Sorties
- **Données d'entrée (Inputs)** : liste exacte des champs, curseurs, sélecteurs ou cases que l'utilisateur manipule (avec leurs valeurs par défaut).
- **Règles de calcul ou de décision** : formules explicites, barèmes de pondération ou conditions logiques appliquées.
- **Résultats produits (Outputs)** : scores, recommandations personnalisées, plan d'action ou textes générés à l'écran.

### 3. Architecture des sections et parcours utilisateur (3 à 4 panneaux maximum)
- Détail de chaque section et de l'enchaînement logique de l'ouverture de l'outil jusqu'au résultat final.

### 4. Fonctionnalités indispensables du MVP
- Liste des 4 à 5 fonctions essentielles, incluant la sauvegarde portable (Export/Import JSON) et l'adaptation mobile.

### 5. Périmètre exclu (Ce que l'outil ne fera pas en V1)
- Liste explicite des éléments exclus pour garantir une livraison simple et fiable.

### 6. Données de démonstration pré-remplies
- Un jeu de valeurs réalistes de mon domaine permettant à mon acheteur de comprendre le fonctionnement dès la première seconde.

### 7. Première hypothèse tarifaire (à titre de réflexion)
- Fourchette de prix exploratoire assortie des arguments d'usage concret (sans promesse de revenus).
</output_format>`,
        },
      ],
    },
    {
      id: 'day-04-step-3',
      legacyType: 'example',
      number: 3,
      title: 'Exemple guidé',
      subtitle: 'Blueprint complet du cas fil rouge',
      completionLabel: "Valider l'étape 3 : Exemple guidé",
      blocks: [
        {
          id: 'day04-step3-example-blueprint',
          type: 'prose',
          eyebrow: "3.1 DÉMONSTRATION COMPLÈTE (CAS D'ÉCOLE FICTIF)",
          title: 'Du guide PDF statique au Blueprint du Hub de Création Régulière',
          highlightPill: 'Exemple illustratif fictif : adaptez la structure à votre propre domaine',
          paragraphs: [
            "Voici comment la matière du guide méthodologique fictif (« Le Système de Création Régulière », analysé au Module 01) est traduite en Blueprint fonctionnel pour concevoir l'application interactive témoin (`/demos/pdf-to-hub/apres-hub-interactif.html`) :",
          ],
          bullets: [
            "1. Format retenu : Hub opérationnel combinant un Calculateur de capacité horaire, un Sélecteur de profil (Freelance / Formateur / Coach), une Checklist 30 jours et un Compilateur de prompt éditorial.",
            "2. Entrées (Inputs) : Choix du profil + 3 champs numériques (Heures travaillées/semaine, Heures facturables clients, Heures administratives) + 11 cases d'actions réparties sur 4 semaines.",
            "3. Logique de calcul : Temps disponible = max(0, Heures totales - Heures clients - Heures admin) ; Capacité protégée = Temps disponible × 0,65. Si capacité < 3h : 1 micro-publication/semaine ; entre 3h et 6h : 1 publication pilier + 2 déclinaisons ; ≥ 6h : 1 publication longue + 4 déclinaisons.",
            "4. Sorties (Outputs) : Affichage immédiat du nombre d'heures protégées, du volume hebdomadaire recommandé, d'exemples adaptés au profil, d'une barre de progression en pourcentage et d'un prompt pré-rempli avec ces chiffres.",
            "5. Fonctionnalités indispensables : Calcul en temps réel sans rechargement, interface fluide et réactive sur mobile, et option de sauvegarde portable (Exporter mes données en `.json` / Importer une sauvegarde `.json`).",
            "6. Hors périmètre V1 : Pas de connexion aux calendriers Google/Outlook, pas de publication directe sur les réseaux sociaux, pas de compte utilisateur avec mot de passe.",
            "7. Première hypothèse tarifaire (réflexion) : 15 000 FCFA à titre d'exemple d'apprentissage, justifié par le gain de temps hebdomadaire immédiat.",
          ],
        },
      ],
    },
    {
      id: 'day-04-step-4',
      legacyType: 'your-turn',
      number: 4,
      title: 'À vous de jouer',
      subtitle: 'Rédiger et valider le blueprint de votre produit',
      completionLabel: "Valider l'étape 4 : À vous de jouer",
      blocks: [
        {
          id: 'day04-blueprint',
          type: 'text-exercise',
          title: 'Exercice principal : Le Blueprint de votre produit interactif',
          instructions:
            "Exécutez le prompt de l'étape 2 dans Claude avec vos éléments du Module 01, ajustez sa proposition si nécessaire, puis collez ci-dessous le Blueprint retenu (format choisi, entrées, logique de calcul/décision, résultats affichés, sections, hors-périmètre et hypothèse tarifaire).",
          placeholder:
            "1. Format interactif choisi :\n2. Données d'entrée (Inputs) :\n3. Règles de traitement / calcul :\n4. Résultats obtenus par l'utilisateur (Outputs) :\n5. Organisation des sections (max 4) :\n6. Fonctionnalités indispensables (dont Export/Import JSON) & Hors-périmètre :\n7. Première hypothèse de prix (à titre de réflexion) :",
          minLength: 80,
          maxLength: 5000,
          profileBinding: 'productType',
        },
        {
          id: 'day04-checklist',
          type: 'checklist',
          title: 'Critères de validation observables (Leçon 04)',
          description:
            'Vérifiez que votre blueprint respecte ces 5 critères avant de passer à la construction avec Claude.',
          items: [
            {
              id: 'chk-d04-action',
              label: 'Action concrète identifiée',
              detail:
                "Le format choisi aide l'acheteur à calculer, diagnostiquer, filtrer, organiser ou générer quelque chose de précis.",
            },
            {
              id: 'chk-d04-io',
              label: 'Flux Entrées -> Logique -> Sorties explicite',
              detail:
                'Toutes les variables saisies par le client et la règle qui produit le résultat sont écrites noir sur blanc.',
            },
            {
              id: 'chk-d04-portable',
              label: 'Sauvegarde portable JSON prévue',
              detail:
                "Le blueprint inclut l'export et l'import des données en fichier JSON pour garantir la portabilité entre appareils.",
            },
            {
              id: 'chk-d04-scope',
              label: 'Zéro dépendance serveur ou compte externe',
              detail:
                "Aucune base de données, aucun compte utilisateur et aucune API payante ne sont requis pour faire tourner l'outil.",
            },
            {
              id: 'chk-d04-price',
              label: 'Première hypothèse tarifaire notée',
              detail:
                'Une première piste de prix est posée à titre exploratoire pour préparer le Module 03.',
            },
          ],
        },
      ],
    },
  ],
};
