import type { Day } from '../../types/course';

export const day06: Day = {
  id: 'day-06',
  dayNumber: 6,
  sprintId: 'sprint-2',
  title: 'DÉCONSTRUCTION DU CONTENU STATIQUE',
  italicTitleWord: 'DÉCONSTRUCTION',
  objective: 'Auditer un document PDF ou texte brut et convertir les chapitres passifs en Unités d\'Action Minimales interactives.',
  deliverableSummary: 'Matrice de déconstruction et cartographie des 3 modules interactifs du produit',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-06-step-1',
      type: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: 'Pourquoi les PDF s\'accumulent sans être appliqués',
      completionLabel: 'Valider l\'étape 1 : Comprendre',
      blocks: [
        {
          id: 'day-06-prose-1',
          type: 'prose',
          eyebrow: 'LEÇON 06 : COMPRENDRE LES FONDATIONS',
          title: 'L\'inertie du document statique face à l\'outil actif',
          italicAccent: 'Action',
          highlightPill: 'La règle d\'or : transformer chaque chapitre de lecture passive en une décision ou un calcul mesurable.',
          paragraphs: [
            'Le problème d\'un guide PDF ne vient jamais de la qualité du savoir qu\'il contient, mais de la passivité imposée par son format. Lorsqu\'un client télécharge un document de 20 pages, il se retrouve face à un mur de texte uniforme. Il doit lire, extraire mentalement les conseils pertinents pour sa situation, faire les calculs sur une feuille à part et tenter de s\'organiser sans aucun retour en direct.',
            'Résultat : la majorité des documents finissent au fond d\'un dossier sans jamais produire le résultat promis. C\'est ce qui explique le plafond tarifaire historique des PDF sur le web francophone.',
            'Notre méthode pédagogique signature repose sur les Unités d\'Action Minimales (UAM). Chaque section de votre produit doit s\'articuler selon un équilibre strict : 20 % de contexte stratégique (pourquoi cette étape compte), 50 % d\'outil actif (un calculateur, un sélecteur de profil ou un filtre interactif) et 30 % de décision validée (une action concrète enregistrée).',
            'La distinction fondamentale est simple : un document d\'information transmet des notions que le lecteur doit digérer seul, tandis qu\'un outil de décision pose 3 questions à l\'utilisateur, filtre ses contraintes et lui affiche instantanément son plan d\'action personnalisé.',
          ],
          bullets: [
            'Identifier les pavés théoriques qui découragent le lecteur pour les remplacer par des questions à choix ou des curseurs interactifs.',
            'Isoler les formules mathématiques ou règles de calcul pour les confier au navigateur.',
            'Remplacer les listes de conseils génériques par des sélecteurs de profil qui masquent l\'inutile et mettent en valeur l\'essentiel.',
          ],
        },
        {
          id: 'day-06-quiz-1',
          type: 'quiz',
          title: 'Validation de la méthode UAM',
          description: 'Vérifiez votre compréhension de la méthode de déconstruction avant d\'exécuter le prompt Claude.',
          questions: [
            {
              id: 'q6-1',
              question: 'Que signifie transformer un texte en Unité d\'Action Minimale (UAM) ?',
              options: [
                'Découper un chapitre en 20 % de contexte, 50 % d\'outil actif et 30 % de décision validée',
                'Résumer tout le texte en une seule phrase pour faire court',
                'Créer une animation complexe avec du son',
              ],
              correctIndex: 0,
              explanation: 'L\'UAM transforme la passivité en engagement : un cadrage rapide, un composant interactif où l\'utilisateur agit, et une conclusion concrète validée.',
            },
            {
              id: 'q6-2',
              question: 'Dans notre démonstration phare, comment la formule de calcul de capacité du PDF est-elle transformée ?',
              options: [
                'Elle est supprimée car trop compliquée',
                'Elle devient un calculateur interactif avec 3 champs évaluant automatiquement les heures protégées en direct',
                'Elle est copiée à l\'identique sous forme d\'image',
              ],
              correctIndex: 1,
              explanation: 'Dans le hub interactif, l\'utilisateur n\'a plus besoin de calculatrice : le navigateur calcule instantanément sa capacité et son volume de contenu recommandé.',
            },
          ],
        },
      ],
    },
    {
      id: 'day-06-step-2',
      type: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: 'Méga-Prompt de déconstruction et matrice d\'UAM',
      completionLabel: 'Valider l\'étape 2 : Prompt Claude',
      blocks: [
        {
          id: 'day-06-prompt-builder',
          type: 'prompt-builder',
          title: 'Compilateur de Déconstruction de Contenu Statique',
          description:
            'Ce prompt demande à Claude d\'auditer votre sujet, d\'extraire les irritants de lecture et de générer la matrice exacte des 3 modules interactifs à construire. Si vous possédez déjà un PDF ou des notes de cours, glissez le document directement dans votre conversation avec Claude avant d\'envoyer le prompt.',
          deliverableTarget: 'claude-artifact',
          fields: [
            {
              key: 'business',
              label: 'Thématique / Niche ({{business}})',
              placeholder: 'Votre domaine ou activité',
              profileBinding: 'business',
            },
            {
              key: 'targetAudience',
              label: 'Audience cible ({{targetAudience}})',
              placeholder: 'Votre client idéal',
              profileBinding: 'targetAudience',
            },
            {
              key: 'productType',
              label: 'Format cible ({{productType}})',
              placeholder: 'ex. Starter Kit Interactif',
              profileBinding: 'productType',
            },
            {
              key: 'mainObjective',
              label: 'Objectif de transformation ({{mainObjective}})',
              placeholder: 'Résultat concret apporté au client',
              profileBinding: 'mainObjective',
            },
          ],
          template: `Tu es un Ingénieur Pédagogique Senior et Architecte de Produits Numériques Interactifs.

CONTEXTE DE MON PROJET :
- Activité / Niche : {{business}}
- Audience cible : {{targetAudience}}
- Format retenu : {{productType}}
- Objectif majeur : {{mainObjective}}

MISSION :
Analyse mon sujet et déconstruis la transmission traditionnelle de cette expertise pour la transformer en un produit interactif articulé selon notre méthode des Unités d'Action Minimales (UAM).

LIVRABLES ATTENDUS :
1. LE DIAGNOSTIC DES IRRITANTS :
   Identifie 3 obstacles majeurs qui rendent un simple guide PDF inefficace ou décourageant sur ce thème précis.

2. LA MATRICE DES 3 MODULES INTERACTIFS :
   Pour chacun des 3 modules piliers du futur produit, définis :
   - Le titre du module
   - Le composant actif associé (ex. calculateur de rentabilité, questionnaire d'auto-évaluation, sélecteur de cas d'usage, checklist persistante)
   - Les données saisies par l'utilisateur
   - La décision concrète ou le résultat personnalisé affiché immédiatement.

3. LE MÉCANISME DE PERSONNALISATION :
   Propose 3 profils d'utilisateurs distincts permettant de filtrer les recommandations de l'application dès l'en-tête (comme dans notre starter kit de référence).

Sois extrêmement pragmatique, direct, sans bavardage théorique ni jargon superflu.`,
        },
      ],
    },
    {
      id: 'day-06-step-3',
      type: 'example',
      number: 3,
      title: 'Exemple guidé',
      subtitle: 'Étude comparative directe : PDF statique vs Hub interactif',
      completionLabel: 'Valider l\'étape 3 : Exemple guidé',
      blocks: [
        {
          id: 'day-06-example-prose',
          type: 'prose',
          eyebrow: 'ÉTUDE COMPARATIVE AVANT / APRÈS',
          title: 'Analyse du cas réel : Le Système de Création Régulière',
          italicAccent: 'Preuve',
          paragraphs: [
            'Pour comprendre la puissance de cette transformation, comparez directement les deux fichiers de démonstration créés pour cette formation :',
            '1. La version statique (avant-pdf-statique.html) : elle contient d\'excellents conseils mais impose une lecture linéaire de 12 pages. Pour calculer sa capacité (page 2), le lecteur doit sortir un papier et une calculatrice. Pour adapter les conseils à son statut (page 2), il doit trier manuellement le tableau. Pour la feuille de route (page 4), les cases sont imprimées et ne gardent aucune mémoire.',
            '2. La version interactive (apres-hub-interactif.html) : le même contenu devient vivant. Le sélecteur de statut en haut de page adapte instantanément les exemples des piliers. Le calculateur évalue la capacité en direct dès que l\'utilisateur ajuste ses heures. Les cases de la feuille de route se cochent en vert, mettent à jour une jauge de progression et s\'enregistrent automatiquement dans le navigateur.',
          ],
        },
        {
          id: 'day-06-example-copy',
          type: 'copy',
          title: 'Matrice de Conversion Avant / Après',
          label: 'MATRICE-UAM-DEMONSTRATION.TXT',
          content: `SECTION DU GUIDE PDF STATIQUE        -> TRANSFORMATION EN HUB INTERACTIF
Page 2 : Formule de calcul d'heures -> Calculateur interactif en direct avec 3 curseurs
Page 2 : Tableau comparatif statique -> Sélecteur de profil filtrant les conseils
Page 3 : Description des 3 Piliers   -> Onglet thématique avec exemples contextualisés
Page 4 : Checklist 30 jours passive -> Cases à cocher interactives avec persistance localStorage
Page 5 : Prompt texte brut           -> Bloc de copie rapide injectant automatiquement les calculs`,
          notes: 'Ce tableau résume la transformation exacte opérée entre nos deux démonstrations phares.',
        },
        {
          id: 'day-06-example-resources',
          type: 'resource',
          title: 'Fichiers de Démonstration & Outils Associés',
          description: 'Consultez les fichiers réels hébergés dans le dossier public/demos/pdf-to-hub/ pour observer la différence.',
          resources: [
            {
              id: 'res-demo-avant',
              title: 'Version Avant : Guide PDF Statique',
              category: 'guide',
              description: 'Ouvrez avant-pdf-statique.html pour constater la passivité d\'un document sérieux mais figé.',
              format: 'HTML / PDF',
              externalUrl: '/demos/pdf-to-hub/avant-pdf-statique.html',
            },
            {
              id: 'res-demo-apres',
              title: 'Version Après : Hub Interactif Actif',
              category: 'template',
              description: 'Ouvrez apres-hub-interactif.html pour tester le calculateur, le sélecteur et les cases persistantes.',
              format: 'HTML / JS',
              externalUrl: '/demos/pdf-to-hub/apres-hub-interactif.html',
            },
            {
              id: 'res-fiche-uam',
              title: 'Matrice de Déconstruction UAM (Cahier des Charges)',
              category: 'template',
              description: 'Structure Markdown prête à remplir pour préparer votre prompt Claude.',
              format: 'Markdown',
              downloadFilename: 'matrice-uam-modele.md',
              downloadContent: `# Matrice de Déconstruction UAM\n\n## 1. Sujet & Transformation\n- Sujet : [Votre sujet]\n- Cible : [Votre cible]\n\n## 2. Les 3 Unités d'Action Minimales\n- Module 1 : [Composant actif prévu]\n- Module 2 : [Composant actif prévu]\n- Module 3 : [Composant actif prévu]\n`,
            },
          ],
        },
      ],
    },
    {
      id: 'day-06-step-4',
      type: 'your-turn',
      number: 4,
      title: 'À vous de jouer',
      subtitle: 'Validez la matrice de vos 3 modules interactifs',
      completionLabel: 'Valider le livrable de la Leçon 06',
      blocks: [
        {
          id: 'day-06-exercise-1',
          type: 'text-exercise',
          title: 'Espace de Travail Pratique : Votre Matrice UAM',
          instructions: 'Collez ci-dessous le résultat généré par Claude avec vos 3 modules interactifs, leurs composants actifs respectifs (calculateur, diagnostic, sélecteur) et les 3 profils d\'utilisateurs identifiés.',
          placeholder: 'Module 1 : [Titre] + [Composant interactif]\nModule 2 : [Titre] + [Composant interactif]\nModule 3 : [Titre] + [Composant interactif]\nProfils cibles : [Profil 1, Profil 2, Profil 3]',
          maxLength: 3000,
        },
        {
          id: 'day-06-checklist-1',
          type: 'checklist',
          title: 'Vérification de Fin de Leçon 06',
          description: 'Cochez chaque critère avant de valider votre passage à la Leçon 07.',
          items: [
            {
              id: 'chk-06-1',
              label: 'J\'ai identifié au moins un calcul ou un diagnostic manuel à automatiser dans mon produit',
            },
            {
              id: 'chk-06-2',
              label: 'J\'ai exécuté le compilateur de prompt dans Claude et obtenu ma matrice de 3 modules interactifs',
            },
            {
              id: 'chk-06-3',
              label: 'J\'ai défini 2 ou 3 profils d\'utilisateurs permettant d\'adapter les recommandations de l\'outil',
            },
          ],
        },
      ],
    },
  ],
};
