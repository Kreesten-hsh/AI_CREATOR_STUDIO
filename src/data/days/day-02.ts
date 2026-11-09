import type { Day } from '../../types/course';

export const MASTER_PROMPT_2_XML = `<prompt id="PROMPT-GENERATION-PRODUIT-HTML" version="2.0">
  <role>
    Tu es un Principal Frontend Engineer et Directeur Artistique pour AI CREATOR Studio.
    Ta mission est d'écrire l'intégralité du code d'une application web interactive autonome dans un fichier unique \`index.html\`, en combinant une direction artistique remarquable et une fidélité fonctionnelle absolue au document source.
  </role>

  <skill_activation_check>
    INSTRUCTION PRIORITAIRE :
    1. Charge et applique le skill \`ai-creator-design-intelligence\` (notamment \`references/frontend-craft.md\`, \`references/design-system.md\`, \`references/app-interface-design.md\` et \`references/visual-quality-checklist.md\`).
    2. Commence obligatoirement ta réponse par l'une de ces deux mentions exactes :
       - \`[STATUT SKILL : ACTIF - ai-creator-design-intelligence chargé]\` si les fichiers du skill sont accessibles dans cette session.
       - \`[STATUT SKILL : NON DÉTECTÉ - Application des règles directrices embarquées]\` si le skill n'est pas détecté.
  </skill_activation_check>

  <context>
    Tu t'appuies sur l'ensemble de la conversation courante :
    - Le document source original joint au départ.
    - Ton analyse documentaire initiale.
    - Le Product Blueprint formalisé à l'étape précédente.
    - La matrice Source Fidelity Mapping (SFM).
    - Le Visual Direction Brief (VDB) approuvé par l'apprenant.
  </context>

  <strict_rules>
    <rule id="R1">FICHIER UNIQUE EXCLUSIF : Tout le code réside dans un unique fichier \`index.html\` intégrant le HTML sémantique, tout le CSS dans une balise \`<style>\` unique dans \`<head>\`, et tout le JavaScript Vanilla dans une balise \`<script>\` unique avant \`</body>\`.</rule>
    <rule id="R2">ZÉRO OUTIL DE COMPILATION NI FRAMEWORK : Aucun Node.js, npm, Vite, React, Vue ou bibliothèque externe. Interdiction formelle du script Tailwind Play CDN (\`cdn.tailwindcss.com\`). Le fichier doit s'ouvrir et fonctionner au double-clic local sous protocole \`file:///\`.</rule>
    <rule id="R3">ZÉRO PLACEHOLDER NI TRONCATURE : Aucun commentaire de type \`// reste du code ici\`, \`/* TODO */\` ou \`...\` n'est toléré. Émets le code intégral de \`<!DOCTYPE html>\` à \`</html>\`.</rule>
    <rule id="R4">FIDÉLITÉ SOURCE ABSOLUE (100 %) : Conserve l'intégralité des formules mathématiques, règles de calcul, seuils, conditions d'affichage, avertissements, étapes et exercices. Chaque composant doit avoir une correspondance identifiable dans le SFM. N'invente aucune règle métier et ne supprime aucune nuance par commodité.</rule>
    <rule id="R5">APPLICATION INTÉGRALE DE LA DIRECTION ARTISTIQUE : Le Visual Direction Brief n'est pas une suggestion. Il s'applique à l'intégralité du produit : en-tête, formulaires, visualisations, tickets de résultat, états d'alerte, boutons et adaptation mobile. Interdiction formelle de retomber dans un tableau de bord générique à cartes blanches après l'en-tête.</rule>
    <rule id="R6">PRÉCISION ARITHMÉTIQUE & INTÉGRITÉ DES SAISIES :
      - Pour les applications financières ou de calcul, utiliser un calcul en centimes entiers pour éliminer les erreurs de virgule flottante.
      - Ne JAMAIS convertir silencieusement une saisie invalide en 0.
      - Conserver le texte saisi dans le champ en cas d'erreur pour que l'utilisateur comprenne son erreur (\`aria-invalid="true"\`).
      - Ne PAS exécuter les calculs dépendants tant qu'un champ obligatoire comporte une saisie invalide.
      - Vérifier systématiquement \`Number.isSafeInteger\` sur les montants et opérations intermédiaires.
    </rule>
    <rule id="R7">DÉCISION D'ÉTAT CONDITIONNELLE : Si l'outil est un simulateur éphémère (ex. calcul de trésorerie), maintenir l'état 100 % en mémoire vive volatile (confidentialité totale, 0 persistance). Si une persistance est requise (ex. checklist de progression), utiliser un \`StorageAdapter\` sécurisé avec fallback mémoire transparent et mention explicite des données conservées.</rule>
    <rule id="R8">ACCESSIBILITÉ & ERGONOMIE PHYSIQUE :
      - Contrôles tactiles et champs \`<input>\` avec une hauteur effective réelle $\\ge 44\\text{ px}$.
      - Taille de police $\\ge 1\\text{rem}$ ($16\\text{ px}$) sur les inputs (anti-zoom iOS).
      - Anneau \`:focus-visible\` contrasté et visible (ratio $\\ge 3:1$).
      - Ratios de contraste WCAG AA respectés ($\\ge 4.5:1$ sur texte courant, $\\ge 3:1$ sur grands textes et composants).
      - Zéro scroll horizontal à \`375 px\` (\`overflow-x: hidden\` proscrit sur \`body/html\`).
      - Respect strict de \`prefers-reduced-motion\`.
      - Déclaration transparente du statut d'autonomie réseau (100 % hors-ligne ou dépendances Google Fonts signalées).
    </rule>
  </strict_rules>

  <mission>
    1. Indique la ligne \`[STATUT SKILL : ...]\`.
    2. Effectue intérieurement l'**Auto-Critique Visuelle Pré-Livraison en 5 Questions** :
       - *Test d'identité métier* : l'outil ressemble-t-il immédiatement à un objet réel du domaine (ticket, carnet, cadran) ?
       - *Test de la pièce maîtresse* : le verdict principal se détache-t-il au premier regard par sa surface et son échelle ?
       - *Test de composition & rythme* : les masses sont-elles asymétriques et aérées sans monotonie de cartes répétées ?
       - *Test de contrastes & surfaces* : les surfaces secondaires sont-elles teintées et les textes lisibles ?
       - *Test d'équilibre mobile \`375 px\`* : la hiérarchie pour le pouce est-elle naturelle avec accès rapide au verdict ?
    3. Émets le fichier \`index.html\` complet et directement exécutable dans un bloc de code unique.
  </mission>

  <output_format>
    1. Ligne \`[STATUT SKILL : ...]\`
    2. Court résumé d'auto-critique pré-livraison (3-4 puces soulignant les choix clés d'artisanat appliqués).
    3. Bloc de code HTML unique :
       - Le fichier débute obligatoirement par \`<!DOCTYPE html>\`.
       - Il contient le document intégralement (HTML sémantique, CSS complet dans \`<style>\` et JavaScript Vanilla complet dans \`<script>\`).
       - Il s'achève obligatoirement par \`</html>\`.
       - Aucun texte de substitution, commentaire d'omission, ellipse ou fragment fictif ne doit remplacer une partie du code.
    4. Brève consigne d'utilisation pour l'apprenant (double-clic local et préparation au déploiement Netlify).
  </output_format>
</prompt>`;

export const PROMPT_SIGNAL_STYLE = 'Plan et règles validés, passons au style.';

export const PROMPT_RETOUCHE_CIBLEE = `Voici une retouche précise à apporter à mon application :
1. Comportement actuel : [décris ce qui se passe ou ce qui ne s'affiche pas correctement]
2. Comportement attendu : [décris le résultat souhaité d'après le document ou la fiche de style]
3. Zone concernée : [ex. le champ de saisie, le résultat final, l'affichage sur mobile]

Règles à respecter :
- Conserve toutes les règles de calcul et le design existant sans rien simplifier.
- Renvoie le code complet et corrigé dans le fichier unique index.html, de <!DOCTYPE html> à </html>.`;

export const day02: Day = {
  id: 'day-02',
  dayNumber: 2,
  moduleId: 'module-02',
  title: 'Journée 2 : Créer',
  objective:
    'Définir l’identité visuelle de ton application, générer son code autonome dans un fichier unique et vérifier son bon fonctionnement.',
  deliverableSummary:
    'Une fiche de style personnalisée, un fichier index.html fonctionnel au double-clic et une application vérifiée sur ton ordinateur.',
  lessons: [
    {
      id: 'lesson-03',
      lessonNumber: 3,
      moduleId: 'module-02',
      dayId: 'day-02',
      dayNumber: 2,
      navigationTitle: 'Créer le style',
      title: 'Définir sa direction artistique indépendante',
      italicTitleWord: 'direction',
      duration: '~20 min',
      objective:
        'Reprendre l’échange avec Claude, explorer 3 univers visuels contrastés et valider ta fiche de style.',
      deliverableSummary:
        'Ma fiche de style : un document de référence clair précisant tes couleurs, tes polices et tes composants.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-03-step-01',
          number: 1,
          title: 'Le signal',
          subtitle: "Reprendre l'échange",
          completionLabel: 'Signal envoyé',
          blocks: [
            {
              id: 'l3-s1-prose-signal',
              type: 'prose',
              title: 'ENVOYER LE',
              italicAccent: 'signal',
              highlightPill:
                'Ne crée pas de nouvelle discussion : reste dans la même conversation pour conserver ton plan.',
              paragraphs: [
                'Retrouve ta conversation Claude de la veille dans ton historique pour continuer ton projet.',
              ],
              bullets: [
                "Ouvre la discussion où tu as validé ton plan d'application et tes règles.",
                'Copie le court message ci-dessous et envoie-le directement à Claude.',
                'Claude passe immédiatement à la phase visuelle en te posant une ou deux questions simples.',
              ],
            },
            {
              id: 'l3-s1-copy-signal',
              type: 'copy',
              title: 'Message à envoyer à Claude',
              label: 'SIGNAL VISUEL',
              notes: 'Envoie cette phrase dans ta discussion existante pour démarrer le travail sur le style.',
              content: PROMPT_SIGNAL_STYLE,
              buttonText: 'Copier le message',
              defaultExpanded: true,
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Ouvrir une nouvelle discussion pour choisir son style.',
                correction:
                  'Reste dans la même conversation pour que Claude conserve ton document et tes règles.',
              },
              {
                mistake: 'Modifier les règles validées la veille pendant cette étape.',
                correction:
                  "Reste concentré sur l'apparence visuelle et les couleurs sans retoucher aux formules.",
              },
            ],
            tips: [
              'Si tu as fermé ton navigateur, retrouve ta conversation dans la colonne de gauche de Claude.',
            ],
          },
        },
        {
          id: 'lesson-03-step-02',
          number: 2,
          title: '3 styles',
          subtitle: "Choisir l'univers",
          completionLabel: 'Univers choisi',
          blocks: [
            {
              id: 'l3-s2-prose-styles',
              type: 'prose',
              title: 'CHOISIR TON',
              italicAccent: 'univers',
              highlightPill:
                "Choisis l'univers qui allie ta sensibilité de créateur et le confort de tes futurs utilisateurs.",
              paragraphs: [
                'Réponds avec tes propres mots aux questions de Claude sur ton public cible.',
              ],
              bullets: [
                'Claude te présente 3 propositions contrastées avec une ambiance, des couleurs et des polices adaptées.',
                'Chaque concept est expliqué simplement en 6 points sans aucun code informatique.',
                "Indique à Claude le numéro ou le nom de l'ambiance que tu préfères, ou demande un ajustement.",
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Chercher un style passe-partout sans personnalité.',
                correction:
                  'Une identité visuelle marquée rend ton outil mémorable et plus attrayant à vendre.',
              },
              {
                mistake: 'Demander du code informatique dès cette étape.',
                correction:
                  "Prends d'abord le temps de fixer l'ambiance visuelle avant de passer à la fabrication.",
              },
            ],
            tips: [
              'Tu peux combiner deux propositions : par exemple les couleurs du style 1 avec les polices du style 2.',
            ],
          },
        },
        {
          id: 'lesson-03-step-03',
          number: 3,
          title: 'Fiche prête',
          subtitle: 'Garder le style',
          completionLabel: 'Fiche validée',
          blocks: [
            {
              id: 'l3-s3-prose-fiche',
              type: 'prose',
              title: 'GARDER TA',
              italicAccent: 'fiche',
              highlightPill:
                'Ta fiche de style est prête : elle donne à ton outil une identité soignée et mémorable.',
              paragraphs: [
                'Claude formalise ta fiche de style avec tes couleurs, tes polices et tes composants.',
              ],
              bullets: [
                "Ce document résume l'ambiance retenue, les boutons, les cartes et la mise en page.",
                'Copie et conserve ce texte dans tes notes pour garder une trace claire de tes choix.',
                'Tu disposes désormais de tous les éléments nécessaires pour lancer la fabrication de ton application.',
              ],
            },
            {
              id: 'l3-s3-checklist',
              type: 'checklist',
              title: 'Contrôle de ta fiche de style',
              description: 'Coche ces 3 points pour valider ton identité visuelle avant la génération.',
              items: [
                {
                  id: 'l3-c1',
                  label: "J'ai choisi l'une des 3 ambiances proposées par Claude.",
                  detail: 'Le concept retenu est adapté à ton sujet et à tes futurs utilisateurs.',
                },
                {
                  id: 'l3-c2',
                  label: 'Claude a rédigé ma fiche de style avec mes couleurs et mes polices.',
                  detail: 'Le texte détaille le fond, les cartes, les boutons et les contrastes.',
                },
                {
                  id: 'l3-c3',
                  label: 'J’ai copié et sauvegardé le texte de ma fiche de style dans mes notes.',
                  detail: 'Ce texte servira de repère lors des retouches et des évolutions futures.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Oublier de sauvegarder la fiche de style hors de Claude.',
                correction:
                  'Conserve toujours une copie du texte dans une note personnelle sur ton ordinateur.',
              },
            ],
            tips: [
              'Ta fiche de style servira de guide exact lors de la génération de ton application en Leçon 4.',
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
      navigationTitle: 'Générer',
      title: 'Générer la première version (V1) de son application',
      italicTitleWord: 'première',
      duration: '~40 min',
      objective:
        'Générer le code complet de ton application avec le Prompt 2, créer ton fichier index.html et l’ouvrir au double-clic.',
      deliverableSummary:
        'Mon fichier index.html V1 : une vraie application web interactive enregistrée sur ton ordinateur et fonctionnelle au double-clic.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-04-step-01',
          number: 1,
          title: 'Le prompt',
          subtitle: 'Génération HTML',
          completionLabel: 'Prompt envoyé',
          blocks: [
            {
              id: 'l4-s1-prose-prompt',
              type: 'prose',
              title: 'LANCER LA',
              italicAccent: 'génération',
              highlightPill:
                'Tu peux ouvrir ton fichier directement dans ton navigateur, sans installer de serveur ni d’outil de code.',
              paragraphs: [
                'Claude réunit ton document, ton plan et ton style pour fabriquer toute ton application.',
              ],
              bullets: [
                'Copie le Prompt 2 officiel ci-dessous et colle-le dans la même discussion continue.',
                'Claude écrit l’intégralité du code HTML, CSS et JavaScript dans un seul bloc continu.',
                'La rédaction prend un instant : laisse Claude rédiger jusqu’au bout sans interrompre.',
              ],
            },
            {
              id: 'l4-s1-copy-prompt2',
              type: 'copy',
              title: 'Génération du code HTML complet',
              label: 'PROMPT 2',
              buttonText: 'Copier le prompt',
              defaultExpanded: false,
              content: MASTER_PROMPT_2_XML,
              notes: 'Colle ce message dans ta conversation continue pour obtenir tout le code de ton application.',
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Coller le prompt dans une nouvelle conversation vide.',
                correction:
                  'Reste dans la même discussion : Claude a besoin de ton plan et de ta fiche de style.',
              },
              {
                mistake: 'Interrompre Claude avant la fin du bloc de code.',
                correction:
                  'Patiente jusqu’à la balise de fin pour obtenir un fichier complet sans morceau manquant.',
              },
            ],
            tips: [
              'Si la réponse s’arrête en cours de route, clique simplement sur Continuer pour obtenir la fin du code.',
            ],
          },
        },
        {
          id: 'lesson-04-step-02',
          number: 2,
          title: 'Ton fichier',
          subtitle: 'Créer index.html',
          completionLabel: 'Fichier créé',
          blocks: [
            {
              id: 'l4-s2-prose-fichier',
              type: 'prose',
              title: 'CRÉER TON',
              italicAccent: 'fichier',
              highlightPill:
                'Ton fichier doit s’appeler exactement index.html en minuscules, sans espace ni accent.',
              paragraphs: [
                'Récupère le code produit par Claude pour enregistrer ton application sur ton ordinateur.',
              ],
              bullets: [
                'Méthode rapide : si un bouton Télécharger apparaît au-dessus du code dans Claude, clique dessus.',
                'Méthode universelle : copie tout le code, ouvre le Bloc-notes ou TextEdit en mode texte brut, et colle-le.',
                'Enregistre sous le nom index.html en évitant l’extension cachée index.html.txt sur Windows.',
              ],
            },
            {
              id: 'l4-s2-checklist',
              type: 'checklist',
              title: 'Vérification de ton fichier',
              description: 'Contrôle ces 3 points pour t’assurer que ton fichier est prêt.',
              items: [
                {
                  id: 'l4-c1',
                  label: 'Le code commence bien par <!DOCTYPE html> et se termine par </html>.',
                  detail: 'Le code est complet du premier au dernier caractère, sans coupure.',
                },
                {
                  id: 'l4-c2',
                  label: 'Le fichier s’appelle bien index.html (sans .txt à la fin).',
                  detail: 'Vérifie que Windows ou macOS n’a pas ajouté une extension texte cachée.',
                },
                {
                  id: 'l4-c3',
                  label: 'Le fichier est enregistré dans un dossier dédié sur ton ordinateur.',
                  detail: 'Crée par exemple un dossier mon-application pour retrouver facilement ton travail.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Avoir un fichier nommé index.html.txt sous Windows.',
                correction:
                  'Dans le Bloc-notes, choisis Tous les fichiers dans Type puis enregistre sous index.html.',
              },
              {
                mistake: 'Coller du texte enrichi avec TextEdit sur Mac.',
                correction:
                  'Utilise le raccourci Maj+Cmd+T pour convertir le document en texte brut avant de coller.',
              },
            ],
            tips: [
              'Si Claude te propose un bouton de téléchargement direct, utilise-le : c’est la méthode la plus sûre.',
            ],
          },
        },
        {
          id: 'lesson-04-step-03',
          number: 3,
          title: 'Premier test',
          subtitle: 'Double-clic local',
          completionLabel: 'Application ouverte',
          blocks: [
            {
              id: 'l4-s3-prose-test',
              type: 'prose',
              title: 'OUVRIR TON',
              italicAccent: 'application',
              highlightPill:
                'Ton document devient une application réelle exécutable localement, sans aucun serveur ni outil de code.',
              paragraphs: [
                'Ton application s’ouvre directement depuis ton ordinateur, sans installer de serveur ni d’outil de développement.',
              ],
              bullets: [
                'Double-clique sur ton fichier index.html pour charger immédiatement ton application dans ton navigateur par défaut.',
                'Certaines polices, images ou ressources externes peuvent toutefois nécessiter une connexion Internet.',
                'Vérifie que l’en-tête, les couleurs choisies et l’interaction principale réagissent bien à tes clics.',
              ],
            },
            {
              id: 'l4-s3-checklist',
              type: 'checklist',
              title: 'Contrôles au double-clic',
              description: 'Vérifie ces 3 éléments lors de ta première ouverture.',
              items: [
                {
                  id: 'l4-t1',
                  label: 'Le fichier s’ouvre directement dans Chrome, Safari, Edge ou Firefox.',
                  detail: 'L’application démarre en local depuis ton ordinateur sans installer de serveur.',
                },
                {
                  id: 'l4-t2',
                  label: 'L’écran affiche l’interface complète sans page blanche ni message d’erreur.',
                  detail: 'Le titre, les formulaires et les boutons sont bien visibles à l’écran.',
                },
                {
                  id: 'l4-t3',
                  label: 'L’interaction principale fonctionne (calcul, case à cocher ou bouton cliquable).',
                  detail: 'Une première action produit immédiatement une mise à jour sur l’écran.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Voir le code brut au lieu de la page interactive.',
                correction:
                  'Renomme ton fichier pour retirer l’extension .txt et garder uniquement .html.',
              },
              {
                mistake: 'Une page blanche s’affiche à l’ouverture.',
                correction:
                  'Fais un clic droit sur le fichier puis Ouvrir avec pour essayer un autre navigateur.',
              },
            ],
            tips: [
              'Tu peux garder ton fichier ouvert dans un onglet et le rafraîchir avec F5 à chaque modification.',
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
      navigationTitle: 'Améliorer',
      title: 'Effectuer des retouches ciblées, corriger et tester',
      italicTitleWord: 'retouches',
      duration: '~30 min',
      objective:
        'Tester ton application avec des données types, effectuer les ajustements nécessaires et valider ton fichier final.',
      deliverableSummary:
        'Mon application finale vérifiée : un fichier index.html testé sur ordinateur et mobile, prêt pour la mise en ligne.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-05-step-01',
          number: 1,
          title: 'Tout tester',
          subtitle: 'Calculs et mobile',
          completionLabel: 'Tests effectués',
          blocks: [
            {
              id: 'l5-s1-prose-qa',
              type: 'prose',
              title: 'TESTER TON',
              italicAccent: 'application',
              highlightPill:
                'Ne transmets jamais de données confidentielles : utilise toujours des valeurs fictives ou d’exemple.',
              paragraphs: [
                'Utilise les exemples de ton document ou des données fictives pour effectuer tes tests.',
              ],
              bullets: [
                'Compare les résultats avec les exemples de ton document ou des valeurs recalculées selon ses règles.',
                'Teste un cas extrême ou laisse un champ vide pour vérifier que l’outil affiche une alerte claire.',
                'Ouvre les outils de développement de Chrome ou Edge pour tester précisément 375 px, 768 px et 1280 px.',
              ],
            },
            {
              id: 'l5-s1-checklist',
              type: 'checklist',
              title: 'Grille de contrôle en 3 dimensions',
              description: 'Valide ces 3 vérifications essentielles avant de finaliser.',
              items: [
                {
                  id: 'l5-q1',
                  label: 'Les résultats correspondent aux exemples de mon document ou à mes calculs de référence.',
                  detail: 'Les formules, seuils et barèmes sont justes et fidèles à tes règles d’origine.',
                },
                {
                  id: 'l5-q2',
                  label: 'Une saisie vide ou incomplète affiche une alerte claire sans casser la page.',
                  detail: 'L’outil guide l’utilisateur avec bienveillance en cas de valeur inattendue.',
                },
                {
                  id: 'l5-q3',
                  label: 'L’affichage est vérifié aux trois largeurs clés : 375 px (mobile), 768 px (tablette) et 1280 px (ordinateur).',
                  detail: 'Les textes restent lisibles et aucun bouton ne déborde de l’écran.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Saisir des données personnelles sensibles pour tester.',
                correction:
                  'Utilise toujours des chiffres fictifs ou les valeurs données en exemple dans ton support.',
              },
              {
                mistake: 'Tester uniquement en rétrécissant grossièrement la fenêtre à la main.',
                correction:
                  'Utilise les outils de développement pour mesurer précisément 375 px, 768 px et 1280 px.',
              },
            ],
            tips: [
              'Dans Chrome ou Edge, appuie sur F12 puis clique sur l’icône d’écran pour tester 375 px, 768 px et 1280 px.',
            ],
          },
        },
        {
          id: 'lesson-05-step-02',
          number: 2,
          title: 'Une retouche',
          subtitle: 'Message ciblé',
          completionLabel: 'Contrôle terminé',
          blocks: [
            {
              id: 'l5-s2-prose-retouche',
              type: 'prose',
              title: 'DEMANDER UNE',
              italicAccent: 'retouche',
              highlightPill:
                'Cette étape est facultative : si tout fonctionne déjà correctement, tu peux passer à la suite.',
              paragraphs: [
                'Si tu constates un petit défaut, demande une retouche ciblée dans ta discussion continue.',
              ],
              bullets: [
                'Travaille toujours à partir de la dernière version de ton fichier index.html.',
                'Tu peux joindre ton fichier actuel à Claude et ajouter une capture d’écran si le défaut est visuel.',
                'Demande une seule correction à la fois, exige le fichier complet et reteste chaque modification.',
                'Si ton application fonctionne déjà comme prévu, termine cette étape sans inventer de retouche.',
              ],
            },
            {
              id: 'l5-s2-copy-retouche',
              type: 'copy',
              title: 'Trame pour corriger un point précis',
              label: 'MESSAGE DE RETOUCHE',
              buttonText: 'Copier la trame',
              defaultExpanded: true,
              content: PROMPT_RETOUCHE_CIBLEE,
              notes: 'Complète les crochets avec tes observations et envoie ce message dans ta conversation.',
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Demander dix corrections en même temps dans un seul message.',
                correction:
                  'Traite un problème après l’autre pour garder le contrôle sur chaque modification.',
              },
              {
                mistake: 'Tenter de modifier le code à la main sans maîtriser la programmation.',
                correction:
                  'Laisse Claude corriger et réclame toujours le fichier complet prêt à l’emploi.',
              },
            ],
            tips: [
              'Tu peux réutiliser cette même trame plusieurs fois si tu as deux ou trois détails distincts à ajuster.',
            ],
          },
        },
        {
          id: 'lesson-05-step-03',
          number: 3,
          title: 'Fichier prêt',
          subtitle: 'Valider pour Netlify',
          completionLabel: 'Module 02 terminé',
          blocks: [
            {
              id: 'l5-s3-prose-valider',
              type: 'prose',
              title: 'RÉSERVER TON',
              italicAccent: 'application',
              highlightPill:
                'Si tes vérifications sont concluantes, ton application est prête pour la mise en ligne au Jour 3.',
              paragraphs: [
                'Quand tes contrôles sont terminés et concluants, range ton fichier final dans le dossier mon-application.',
              ],
              bullets: [
                'Crée un dossier nommé mon-application et glisses-y ton fichier index.html final.',
                'Conserve précieusement une copie de sauvegarde de ta première version dans un autre dossier.',
                'Ton produit est prêt à être hébergé dès que tous tes contrôles ont été validés.',
              ],
            },
            {
              id: 'l5-s3-checklist',
              type: 'checklist',
              title: 'Validation du produit fini',
              description: 'Vérifie ces 3 derniers points pour clore le Module 02.',
              items: [
                {
                  id: 'l5-f1',
                  label: 'Mes contrôles de calculs et d’affichages ont été effectués avec satisfaction.',
                  detail: 'Ton application réagit conformément aux règles et aux exemples testés.',
                },
                {
                  id: 'l5-f2',
                  label: 'Mon fichier index.html final est rangé dans un dossier mon-application.',
                  detail: 'Ce dossier sera déposé en un clic sur Netlify lors du Jour 3.',
                },
                {
                  id: 'l5-f3',
                  label: 'Une copie de sauvegarde de ma première version est conservée en sécurité.',
                  detail: 'Tu disposes d’un historique propre en cas de fausse manipulation future.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Laisser traîner plusieurs versions mélangées dans son dossier Téléchargements.',
                correction:
                  'Crée un dossier dédié mon-application et n’y garde que le fichier définitif.',
              },
            ],
            tips: [
              'Au Jour 3, tu glisseras simplement ce dossier sur la plateforme d’hébergement pour le rendre public.',
            ],
          },
        },
      ],
    },
  ],
};
