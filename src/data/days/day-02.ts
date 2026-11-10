import type { Day } from '../../types/course';

export const MASTER_PROMPT_2_XML = `<prompt id="PROMPT-GENERATION-PRODUIT-HTML" version="2.1">
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
    - Le Product Blueprint formalisé à l'étape précédente (incluant le code d'accès acheteur choisi).
    - La matrice Source Fidelity Mapping (SFM).
    - Le Visual Direction Brief (VDB) approuvé par l'apprenant.
  </context>

  <strict_rules>
    <rule id="R1">FICHIER UNIQUE EXCLUSIF : Tout le code réside dans un unique fichier \`index.html\` intégrant le HTML sémantique, tout le CSS dans une balise \`<style>\` unique dans \`<head>\`, et tout le JavaScript Vanilla dans une balise \`<script>\` unique avant \`</body>\` (ainsi que le script synchrone de verrouillage initial dans \`<head>\`).</rule>
    <rule id="R2">ZÉRO OUTIL DE COMPILATION NI FRAMEWORK : Aucun Node.js, npm, Vite, React, Vue ou bibliothèque externe. Interdiction formelle du script Tailwind Play CDN (\`cdn.tailwindcss.com\`). Le fichier doit s'ouvrir et fonctionner au double-clic local sous protocole \`file:///\`.</rule>
    <rule id="R3">ZÉRO PLACEHOLDER NI TRONCATURE : Aucun commentaire de type \`// reste du code ici\`, \`/* TODO */\` ou \`...\` n'est toléré. Émets le code intégral de \`<!DOCTYPE html>\` à \`</html>\`.</rule>
    <rule id="R4">FIDÉLITÉ SOURCE ABSOLUE (100 %) : Conserve l'intégralité des formules mathématiques, règles de calcul, seuils, conditions d'affichage, avertissements, étapes et exercices. Chaque composant doit avoir une correspondance identifiable dans le SFM. N'invente aucune règle métier et ne supprime aucune nuance par commodité.</rule>
    <rule id="R5">APPLICATION INTÉGRALE DE LA DIRECTION ARTISTIQUE : Le Visual Direction Brief n'est pas une suggestion. Il s'applique à l'intégralité du produit : écran de verrouillage (\`.gate\`), en-tête, formulaires, visualisations, tickets de résultat, états d'alerte, boutons et adaptation mobile. Interdiction formelle de retomber dans un tableau de bord générique à cartes blanches après l'en-tête.</rule>
    <rule id="R6">PRÉCISION ARITHMÉTIQUE & INTÉGRITÉ DES SAISIES :
      - Pour les applications financières ou de calcul de prix, garantir une arithmétique exacte (support de la virgule et du point décimal, gestion propre des devises comme FCFA et EUR).
      - Ne JAMAIS convertir silencieusement une saisie invalide en 0 lorsqu'un contrôle de validité explicite est requis.
      - Conserver le texte saisi dans le champ en cas d'erreur pour que l'utilisateur comprenne son erreur (\`aria-invalid="true"\`).
      - Vérifier systématiquement la finitude des calculs (protection contre division par zéro ou taux de frais >= 100 %).
    </rule>
    <rule id="R7">DÉCISION D'ÉTAT CONDITIONNELLE & EXPORT/IMPORT MANUEL :
      - (a) Si l'outil est un calculateur ou simulateur éphémère (ex. calculateur de prix et de rentabilité), maintenir l'état métier 100 % en mémoire vive volatile (confidentialité totale, 0 persistance locale des chiffres saisis, aucun bouton d'export/import JSON inutile).
      - (b) Si l'outil nécessite un suivi dans le temps sur un même appareil (ex. planificateur, checklist de progression, journal), utiliser un \`StorageAdapter\` sécurisé (\`localStorage\` avec fallback mémoire transparent sous \`file:///\`) et indiquer clairement que les données restent sur l'appareil courant.
      - (c) Uniquement lorsque \`localStorage\` est utilisé pour le suivi métier (cas b), intégrer deux contrôles discrets et accessibles (« Exporter ma sauvegarde (.json) » et « Importer une sauvegarde (.json) ») permettant à l'acheteur de transférer manuellement sa progression entre son ordinateur et son smartphone, sans jamais promettre de synchronisation cloud automatique.
    </rule>
    <rule id="R8">ACCESSIBILITÉ & ERGONOMIE PHYSIQUE :
      - Contrôles tactiles et champs \`<input>\` accessibles au doigt ($\\ge 38\\text{ px}$ à $44\\text{ px}$).
      - Anneau \`:focus-visible\` contrasté et visible (ratio $\\ge 3:1$).
      - Ratios de contraste WCAG AA respectés ($\\ge 4.5:1$ sur texte courant, $\\ge 3:1$ sur grands textes et composants).
      - Zéro scroll horizontal à \`375 px\` (\`overflow-x: hidden\` proscrit sur \`body/html\`).
      - Respect strict de \`prefers-reduced-motion\`.
      - Déclaration transparente du statut d'autonomie réseau (100 % hors-ligne ou dépendances Google Fonts signalées avec fallbacks système).
    </rule>
    <rule id="R9">BARRIÈRE D'ACCÈS PAR MOT DE PASSE JAVASCRIPT OBLIGATOIRE (PRODUIT RÉSERVÉ AUX ACHETEURS) :
      - Toutes les applications générées sont des produits réservés aux acheteurs et doivent obligatoirement intégrer un écran de verrouillage par code d'accès (\`.gate\`) au lancement.
      - Exécuter un script synchrone dans \`<head>\` avant le premier rendu qui vérifie \`localStorage.getItem(KEY) === "granted"\` (sous \`try/catch\`) et applique \`document.documentElement.classList.add("locked")\` tant que l'accès n'est pas validé (\`html.locked .frame { display: none }\` / \`html:not(.locked) .gate { display: none }\`).
      - Déclarer clairement en tête de la logique de verrouillage la constante modifiable : \`var ACCESS_CODE = "CREATOR2026", KEY = "pricing_access";\` initialisée avec le code d'accès défini par l'apprenant dans son plan d'application (ou \`CREATOR2026\` par défaut).
      - Styliser l'écran \`.gate\` avec exactement la même Direction Artistique que l'application (badge \`.tag\` « Accès réservé », titre « Entre ton code d'accès », champ mot de passe, bouton « Déverrouiller l'outil », animation \`.bad\` et message d'erreur accessible \`role="alert"\` si le code est erroné).
      - Intégrer dans l'en-tête de l'application un bouton discret « Verrouiller » permettant de réinitialiser \`localStorage.removeItem(KEY)\` et de réafficher immédiatement l'écran \`.gate\` pour faciliter le test par l'apprenant.
      - Rappel d'architecture : cette barrière JavaScript côté client est un filtre d'usage dissuasif et non une authentification cryptographique serveur ; n'inclure aucun secret sensible ni clé d'API privée dans le code.
    </rule>
  </strict_rules>

  <mission>
    1. Indique la ligne \`[STATUT SKILL : ...]\`.
    2. Effectue intérieurement l'**Auto-Critique Visuelle Pré-Livraison en 5 Questions** :
       - *Test d'identité métier* : l'outil ressemble-t-il immédiatement à un objet réel et désirable du domaine (carnet d'atelier, calculateur de créateur, cadran) ?
       - *Test de la pièce maîtresse* : le verdict principal (ex. Prix de vente conseillé et Bénéfice Net) se détache-t-il au premier regard par sa surface et son échelle ?
       - *Test de composition & rythme* : les masses sont-elles asymétriques et aérées sans monotonie de cartes blanches répétées ?
       - *Test de contrastes & surfaces* : les surfaces secondaires sont-elles teintées et les textes lisibles ?
       - *Test d'équilibre mobile \`375 px\`* : la hiérarchie pour le pouce est-elle naturelle avec accès rapide au verdict et à l'écran de déverrouillage ?
    3. Émets le fichier \`index.html\` complet et directement exécutable dans un bloc de code unique.
  </mission>

  <output_format>
    1. Ligne \`[STATUT SKILL : ...]\`
    2. Court résumé d'auto-critique pré-livraison (3-4 puces soulignant les choix clés d'artisanat appliqués).
    3. Bloc de code HTML unique :
       - Le fichier débute obligatoirement par \`<!DOCTYPE html>\`.
       - Il contient le document intégralement (HTML sémantique avec écran \`.gate\` et application principale, CSS complet dans \`<style>\` et JavaScript Vanilla complet dans \`<script>\`).
       - Il s'achève obligatoirement par \`</html>\`.
       - Aucun texte de substitution, commentaire d'omission, ellipse ou fragment fictif ne doit remplacer une partie du code.
    4. Brève consigne d'utilisation pour l'apprenant (rappel du code d'accès configuré dans \`ACCESS_CODE\`, test au double-clic local et préparation au déploiement Netlify).
  </output_format>
</prompt>`;

export const PROMPT_SIGNAL_STYLE = 'Plan et règles validés, passons au style.';

export const PROMPT_RETOUCHE_CIBLEE = `Voici une retouche précise à apporter à mon application :
1. Comportement actuel : [décris ce qui se passe ou ce qui ne s'affiche pas correctement]
2. Comportement attendu : [décris le résultat souhaité d'après le document ou la fiche de style]
3. Zone concernée : [ex. le champ de saisie, le résultat final, l'affichage sur mobile]

Règles à respecter :
- Conserve toutes les règles de calcul, le code d'accès et le design existant sans rien simplifier.
- Renvoie le code complet et corrigé dans le fichier unique index.html, de <!DOCTYPE html> à </html>.`;

export const day02: Day = {
  id: 'day-02',
  dayNumber: 2,
  moduleId: 'module-02',
  title: 'Journée 2 : Créer',
  objective:
    'Créer le style de ton application, générer son fichier index.html et vérifier son écran de code d’accès, ses calculs et son affichage mobile.',
  deliverableSummary:
    'Ma fiche de style sauvegardée et un fichier index.html testé au double-clic, prêt pour la mise en ligne.',
  lessons: [
    {
      id: 'lesson-03',
      lessonNumber: 3,
      moduleId: 'module-02',
      dayId: 'day-02',
      dayNumber: 2,
      navigationTitle: 'Créer ton style',
      title: 'Définir sa direction artistique indépendante',
      italicTitleWord: 'direction',
      duration: '~20 min',
      objective:
        'Reprendre la même conversation Claude, choisir parmi 3 styles contrastés et sauvegarder ta fiche de style.',
      deliverableSummary:
        'Ma fiche de style sauvegardée sur ton ordinateur, à côté de Mon plan d’application et Les règles de mon document.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-03-step-01',
          number: 1,
          title: 'Le signal',
          subtitle: 'Même discussion',
          completionLabel: 'Signal envoyé',
          blocks: [
            {
              id: 'l3-s1-prose-signal',
              type: 'prose',
              title: 'ENVOYER LE',
              italicAccent: 'signal',
              highlightPill:
                'Reste dans la même conversation Claude : ton document et ton plan y sont déjà.',
              paragraphs: [
                'Retrouve ta conversation de la Leçon 2 dans l’historique Claude et envoie ce signal.',
              ],
              bullets: [
                'Ouvre la discussion où tu as validé ton plan d’application et tes règles.',
                'Copie le message ci-dessous et envoie-le tel quel, sans ouvrir de nouvelle discussion.',
                'Claude passe au style et te pose une ou deux questions simples.',
              ],
            },
            {
              id: 'l3-s1-copy-signal',
              type: 'copy',
              title: 'Message à envoyer à Claude',
              label: 'SIGNAL VISUEL',
              notes: 'Envoie cette phrase exacte dans ta discussion existante.',
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
                  'Reviens dans la conversation de la Leçon 2 : Claude y garde ton document et tes règles.',
              },
              {
                mistake: 'Modifier ses règles ou ses formules pendant cette étape.',
                correction:
                  'Concentre-toi sur l’apparence : tes règles sont déjà validées.',
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
                'Choisis le style qui convient à ton public et au sujet de ton document.',
              paragraphs: [
                'Réponds avec tes propres mots aux questions de Claude sur l’ambiance et ton public.',
              ],
              bullets: [
                'Claude propose ensuite trois styles contrastés : ambiance, couleurs, polices et mise en page.',
                'Chaque style est justifié par rapport à ton document et à ton public.',
                'Indique le style retenu ou demande un ajustement précis, par exemple une autre couleur.',
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Choisir un style passe-partout sans personnalité.',
                correction:
                  'Un style marqué rend ton outil reconnaissable et plus facile à vendre.',
              },
              {
                mistake: 'Demander du code dès cette étape.',
                correction:
                  'Fixe d’abord le style : le code arrive en Leçon 4.',
              },
            ],
            tips: [
              'Tu peux combiner deux propositions, par exemple les couleurs du style 1 avec les polices du style 2.',
            ],
          },
        },
        {
          id: 'lesson-03-step-03',
          number: 3,
          title: 'Ta fiche',
          subtitle: 'Garder le style',
          completionLabel: 'Fiche validée',
          blocks: [
            {
              id: 'l3-s3-prose-fiche',
              type: 'prose',
              title: 'GARDER TA',
              italicAccent: 'fiche',
              highlightPill:
                'Tu as maintenant tes trois textes : plan, règles et fiche de style.',
              paragraphs: [
                'Claude rédige Ma fiche de style : relis-la, puis sauvegarde-la avec tes deux autres textes.',
              ],
              bullets: [
                'Vérifie les couleurs, l’ambiance et la mise en page retenues.',
                'Vérifie que l’écran de code d’accès est prévu dans le même style.',
                'Enregistre Ma fiche de style à côté de Mon plan d’application et Les règles de mon document.',
              ],
            },
            {
              id: 'l3-s3-checklist',
              type: 'checklist',
              title: 'Contrôle de ta fiche de style',
              description: 'Coche ces 4 points avant de générer ton application.',
              items: [
                {
                  id: 'l3-c1',
                  label: 'J’ai choisi l’un des 3 styles proposés par Claude.',
                  detail: 'Il convient à ton sujet et à tes futurs acheteurs.',
                },
                {
                  id: 'l3-c2',
                  label: 'Les couleurs et l’ambiance de ma fiche de style sont validées.',
                  detail: 'Fond, boutons, textes et résultat principal sont décrits clairement.',
                },
                {
                  id: 'l3-c3',
                  label: 'L’écran de code d’accès est prévu dans ma fiche de style.',
                  detail: 'Il reprend les couleurs et les polices de l’application.',
                },
                {
                  id: 'l3-c4',
                  label: 'Ma fiche de style est sauvegardée sur mon ordinateur.',
                  detail:
                    'Elle rejoint Mon plan d’application et Les règles de mon document.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Garder sa fiche de style uniquement dans Claude.',
                correction:
                  'Copie-la dans un fichier sur ton ordinateur avec tes deux autres textes.',
              },
            ],
            tips: [
              'Si la conversation devient trop longue, ces trois textes te permettront de reprendre ailleurs.',
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
      italicTitleWord: 'première',
      duration: '~40 min',
      objective:
        'Générer le code complet de ton application avec le Prompt 2, enregistrer ton fichier index.html et tester son écran de code.',
      deliverableSummary:
        'Mon fichier index.html enregistré sur ton ordinateur, avec un écran de code d’accès testé au double-clic.',
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
                'Claude a besoin de ton document et de tes trois textes : reste dans la même conversation.',
              paragraphs: [
                'Colle le Prompt 2 dans la même discussion pour que Claude écrive toute ton application.',
              ],
              bullets: [
                'Claude s’appuie sur ton document, ton plan, tes règles et ta fiche de style.',
                'Si tu dois changer de conversation, joins ton document et colle tes trois textes avant le prompt.',
                'Laisse Claude écrire jusqu’à la dernière ligne du code.',
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
              notes: 'Colle ce message dans ta conversation pour obtenir tout le code de ton application.',
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Coller le prompt dans une conversation vide, sans contexte.',
                correction:
                  'Reste dans la même discussion, ou joins ton document et tes trois textes avant le prompt.',
              },
              {
                mistake: 'Interrompre Claude avant la fin du code.',
                correction:
                  'Attends la dernière ligne, qui se termine par </html>.',
              },
            ],
            tips: [
              'Si la réponse s’arrête en cours de route, clique sur Continuer pour obtenir la fin du code.',
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
                'Ton fichier doit s’appeler exactement index.html, en minuscules, sans espace.',
              paragraphs: [
                'Récupère le code complet de Claude et enregistre-le sur ton ordinateur sous le nom index.html.',
              ],
              bullets: [
                'Si Claude affiche un bouton Télécharger, utilise-le : c’est la méthode la plus sûre.',
                'Sinon, copie tout le code et colle-le dans le Bloc-notes ou TextEdit en texte brut.',
                'Enregistre sous index.html en évitant l’extension cachée index.html.txt.',
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
                  detail: 'Le code est complet, du premier au dernier caractère.',
                },
                {
                  id: 'l4-c2',
                  label: 'Le fichier s’appelle bien index.html (sans .txt à la fin).',
                  detail: 'Vérifie que ton ordinateur n’a pas ajouté une extension texte cachée.',
                },
                {
                  id: 'l4-c3',
                  label: 'Le fichier est enregistré dans un dossier mon-application.',
                  detail: 'Tu retrouveras facilement ton travail pour la mise en ligne.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Avoir un fichier nommé index.html.txt sous Windows.',
                correction:
                  'Dans le Bloc-notes, choisis Tous les fichiers dans Type, puis enregistre sous index.html.',
              },
              {
                mistake: 'Coller du texte enrichi avec TextEdit sur Mac.',
                correction:
                  'Utilise Maj+Cmd+T pour passer en texte brut avant de coller.',
              },
            ],
            tips: [
              'Garde une copie de cette première version dans un autre dossier avant toute retouche.',
            ],
          },
        },
        {
          id: 'lesson-04-step-03',
          number: 3,
          title: 'Le code',
          subtitle: 'Tester le verrou',
          completionLabel: 'Application ouverte',
          blocks: [
            {
              id: 'l4-s3-prose-test',
              type: 'prose',
              title: 'TESTER TON',
              italicAccent: 'code',
              highlightPill:
                'Ce code d’accès est une barrière dissuasive dans la page, pas une sécurité de serveur.',
              paragraphs: [
                'Double-clique sur index.html : ton application s’ouvre dans ton navigateur, sans installer de serveur.',
              ],
              bullets: [
                'L’écran de code apparaît avant tout contenu ; certaines polices peuvent nécessiter une connexion Internet.',
                'Tape un mauvais code : il doit être refusé avec un message clair.',
                'Tape ton code (ex. CREATOR2026), puis vérifie que Verrouiller réaffiche l’écran de code.',
              ],
            },
            {
              id: 'l4-s3-checklist',
              type: 'checklist',
              title: 'Contrôles au double-clic',
              description: 'Vérifie ces 3 points lors de ta première ouverture.',
              items: [
                {
                  id: 'l4-t1',
                  label: 'Le fichier s’ouvre au double-clic et affiche d’abord l’écran de code d’accès.',
                  detail: 'Le contenu de l’application reste masqué tant que le code n’est pas saisi.',
                },
                {
                  id: 'l4-t2',
                  label: 'Un mauvais code est refusé et le bon code déverrouille l’application.',
                  detail: 'C’est le code choisi en Leçon 2, inscrit dans ACCESS_CODE au début du fichier.',
                },
                {
                  id: 'l4-t3',
                  label: 'Le bouton Verrouiller réaffiche immédiatement l’écran de code.',
                  detail: 'Sans ce bouton, le navigateur garde le déverrouillage en mémoire.',
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
                mistake: 'L’application s’affiche directement, sans écran de code.',
                correction:
                  'Clique sur Verrouiller, ou demande à Claude d’ajouter l’écran de code prévu dans ta fiche de style.',
              },
            ],
            tips: [
              'Pour changer ton code plus tard, demande à Claude de modifier la valeur ACCESS_CODE dans ton fichier.',
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
        'Tester ton application avec des valeurs fictives, demander une retouche ciblée si besoin et valider ta version finale.',
      deliverableSummary:
        'Mon application finale vérifiée : calculs, code d’accès, affichage mobile et sauvegarde adaptée, prête pour la mise en ligne.',
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
                'Ne transmets jamais de données confidentielles : teste avec des valeurs fictives ou d’exemple.',
              paragraphs: [
                'Compare chaque résultat de ton application avec les exemples et les règles de ton document.',
              ],
              bullets: [
                'Essaie des valeurs habituelles, un champ vide et un cas extrême.',
                'Vérifie à nouveau le code d’accès : mauvais code refusé, bon code accepté.',
                'Avec F12, teste l’affichage à 375 px et vérifie que chaque bouton se touche facilement au doigt.',
              ],
            },
            {
              id: 'l5-s1-checklist',
              type: 'checklist',
              title: 'Grille de contrôle en 3 dimensions',
              description: 'Valide ces 3 vérifications avant de finaliser.',
              items: [
                {
                  id: 'l5-q1',
                  label: 'Les résultats correspondent aux exemples de mon document ou à mes calculs de référence.',
                  detail: 'Formules, seuils et barèmes sont fidèles à tes règles.',
                },
                {
                  id: 'l5-q2',
                  label: 'Une saisie vide ou incomplète affiche une alerte claire sans casser la page.',
                  detail: 'L’outil guide l’utilisateur en cas de valeur inattendue.',
                },
                {
                  id: 'l5-q3',
                  label: 'L’affichage est vérifié à 375 px (mobile), 768 px (tablette) et 1280 px (ordinateur).',
                  detail: 'Les textes restent lisibles et aucun bouton ne déborde.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Saisir des données personnelles sensibles pour tester.',
                correction:
                  'Utilise des chiffres fictifs ou les exemples de ton document.',
              },
              {
                mistake: 'Tester le mobile en rétrécissant la fenêtre à la main.',
                correction:
                  'Utilise les outils de développement (F12) pour mesurer précisément 375 px.',
              },
            ],
            tips: [
              'Dans Chrome ou Edge, appuie sur F12 puis clique sur l’icône d’écran pour choisir une largeur.',
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
                'Une seule correction par message, sur la dernière version de ton fichier.',
              paragraphs: [
                'Si un détail ne fonctionne pas, décris-le à Claude avec la trame ci-dessous.',
              ],
              bullets: [
                'Joins la dernière version de ton fichier index.html dans la même discussion.',
                'Demande le fichier complet : formules, écran de code, code d’accès et sauvegarde doivent rester intacts.',
                'Reteste après chaque correction ; si tout fonctionne déjà, passe à la suite.',
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
                mistake: 'Demander dix corrections dans un seul message.',
                correction:
                  'Traite un problème après l’autre pour garder le contrôle sur chaque modification.',
              },
              {
                mistake: 'Accepter une version où l’écran de code ou une formule a disparu.',
                correction:
                  'Reviens à ta version précédente et redemande la correction en rappelant ce qui doit rester intact.',
              },
            ],
            tips: [
              'Ajoute une capture d’écran à ton message si le défaut est visuel.',
            ],
          },
        },
        {
          id: 'lesson-05-step-03',
          number: 3,
          title: 'Fichier prêt',
          subtitle: 'Prêt à publier',
          completionLabel: 'Module 02 terminé',
          blocks: [
            {
              id: 'l5-s3-prose-valider',
              type: 'prose',
              title: 'VALIDER TON',
              italicAccent: 'application',
              highlightPill:
                'Le déverrouillage du code d’accès est mémorisé à part de tes données.',
              paragraphs: [
                'Quand tes contrôles sont terminés, vérifie la sauvegarde prévue puis range ton fichier final.',
              ],
              bullets: [
                'Calculateur éphémère : les chiffres disparaissent à la fermeture, sans boutons d’export.',
                'Outil de suivi : les données restent dans le même navigateur, sur le même appareil.',
                'Données de suivi sauvegardées : des boutons d’export et d’import JSON permettent de changer d’appareil.',
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
                  label: 'Les résultats, les interactions et l’affichage mobile sont validés.',
                  detail: 'Les calculs restent justes à 375 px comme sur ordinateur.',
                },
                {
                  id: 'l5-f2',
                  label: 'Le code d’accès fonctionne et la sauvegarde correspond à mon type d’outil.',
                  detail:
                    'Aucun bouton JSON pour un calculateur éphémère ; export et import seulement si les données sont sauvegardées.',
                },
                {
                  id: 'l5-f3',
                  label: 'Mon index.html final est dans le dossier mon-application, avec une copie de secours ailleurs.',
                  detail: 'Ce dossier sera déposé sur Netlify en Leçon 6.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Demander des boutons d’export et d’import JSON pour un simple calculateur.',
                correction:
                  'Un calculateur éphémère ne garde aucune donnée : ces boutons seraient inutiles.',
              },
              {
                mistake: 'Laisser plusieurs versions mélangées dans le dossier mon-application.',
                correction:
                  'Garde uniquement le fichier final index.html dans ce dossier.',
              },
            ],
            tips: [
              'En Leçon 6, tu glisseras simplement ce dossier sur Netlify pour le mettre en ligne.',
            ],
          },
        },
      ],
    },
  ],
};
