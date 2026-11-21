import type { Day } from '../../types/course';

export const PROMPT_L6_NETLIFY_HELP = `Mon lien Netlify affiche une erreur 404 (Page Not Found).
Voici le nom exact du fichier HTML que j'ai envoyé : [ex. Solde 1.html ou index (1).html].
Dis-moi simplement comment corriger ça pour que mon application s'affiche.`;

export const PROMPT_FICHE_CHARIOW = `Tu es un spécialiste de la vente de produits digitaux simples et concrets.
Rédige ma fiche produit Chariow pour mon application interactive (en français naturel, sans jargon technique ni promesse exagérée) :

Mes informations :
- Nom de l'application : [Ex : Mon Planificateur / Outil]
- Pour qui : [Ex : personnes qui veulent passer à l'action facilement]
- Problème résolu : [Ex : gagner du temps / éviter de tout faire à la main]
- Ce que fait l'application : [Décris en 2 lignes ce que fait ton outil]
- Prix : [Ex : 9 900 FCFA / 15 €]

Donne-moi :
1. 3 idées de titres clairs orientés bénéfice.
2. Une description courte en 4 blocs (Le problème, Ce que vous obtenez tout de suite, Pour qui c'est fait, Comment ça fonctionne sur téléphone et ordinateur).
3. 4 questions-réponses simples (fonctionne sur téléphone, paiement en une fois, accès immédiat après achat).`;

export const PROMPT_PERSONNALISER_GUIDE = `Personnalise le fichier GUIDE-ACCES-CLIENT-MODELE.html joint pour créer le Guide d'Accès Client final de mon application.

Voici mes informations exactes :
- Nom de l'application : [NOM DE MON APPLICATION]
- Promesse en 1 phrase : [PROMESSE EN 1 PHRASE]
- Lien Netlify complet : [MON LIEN NETLIFY]
- Code d'accès client : [MON CODE D'ACCÈS]
- Email support (et délai de réponse) : [MON EMAIL SUPPORT]
- Ce qu'il faut préciser sur les données : [Ex : sauvegarde automatique sur l'appareil, ou outil instantané sans sauvegarde]

Consignes :
1. Reprends exactement les couleurs de mon fichier index.html joint, avec un texte bien lisible.
2. Remplace tous les champs entre crochets (y compris le lien du bouton d'accès, le code et le titre de la page).
3. Adapte l'étape 03 selon ma précision sur les données.
4. Garde la mise en page exacte pour que le document tienne proprement sur une seule page A4 sans déborder.
5. Renvoie-moi le fichier HTML complet prêt à ouvrir dans mon navigateur pour l'enregistrer en PDF.`;

export const TEXTE_INSTRUCTIONS_POST_ACHAT = `Merci pour votre achat !

Voici comment accéder à votre application en 30 secondes :
1. Ouvrez votre lien d'accès direct : [VOTRE LIEN NETLIFY]
2. Saisissez votre code d'accès sur l'écran d'accueil : [VOTRE CODE D'ACCÈS]
3. Ajoutez la page à l'écran d'accueil de votre téléphone (ou aux favoris de votre ordinateur) pour la retrouver en un clic.
4. Téléchargez votre Guide d'Accès PDF depuis les fichiers disponibles après votre achat (pensez aussi à vérifier votre dossier Spams si vous ne voyez pas l'e-mail de confirmation).

Une question ou un souci d'accès ? Écrivez-moi à [VOTRE EMAIL] (réponse sous [VOTRE DÉLAI DE RÉPONSE]).`;

export const day03: Day = {
  id: 'day-03',
  dayNumber: 3,
  moduleId: 'module-03',
  title: 'Journée 3 : Publier et livrer',
  objective:
    'Mettre ton application en ligne gratuitement sur Netlify, créer un Guide d’Accès PDF propre et lancer ta fiche produit sur Chariow.',
  deliverableSummary: 'Un lien Netlify en ligne et une fiche produit Chariow prête à vendre.',
  lessons: [
    {
      id: 'lesson-06',
      lessonNumber: 6,
      moduleId: 'module-03',
      dayId: 'day-03',
      dayNumber: 3,
      navigationTitle: 'Mettre en ligne',
      title: 'Publier son application sur Netlify',
      italicTitleWord: 'application',
      duration: '~25 min',
      objective:
        'Déposer ton fichier index.html sur Netlify gratuitement, choisir un nom de lien propre et tester le résultat sur ton téléphone.',
      deliverableSummary: 'Un lien Netlify public prêt à partager.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-06-step-01',
          number: 1,
          title: 'Préparer',
          subtitle: 'Compte et fichier',
          completionLabel: 'Prêt pour Netlify',
          blocks: [
            {
              id: 'l6-s1-prose-dossier',
              type: 'prose',
              title: 'PRÉPARER',
              italicAccent: 'ton envoi',
              highlightPill:
                'Aucun dossier à fabriquer : le fichier HTML généré par Claude s’envoie directement tel quel dans Netlify Drop.',
              paragraphs: [
                'Avant de mettre ton application en ligne, fais juste ces 2 préparatifs rapides en 1 minute :',
              ],
              bullets: [
                '**Crée ton compte Netlify gratuit** : rends-toi sur **`app.netlify.com`** et connecte-toi avec Google ou ton e-mail pour que ton futur lien reste actif sans limite de durée.',
                '**Retrouve ton fichier HTML** : repère le fichier téléchargé depuis Claude dans tes *Téléchargements* (ou *Fichiers* sur téléphone). S’il ne s’appelle pas encore **`index.html`**, renomme-le simplement **`index.html`** en minuscules.',
              ],
            },
            {
              id: 'l6-s1-callout-account',
              type: 'callout',
              variant: 'tip',
              title: 'Pourquoi se connecter avant d’envoyer ?',
              content:
                'Un envoi sans compte sur Netlify Drop expire automatiquement au bout de 24 heures. En te connectant d’abord gratuitement, ton application reste en ligne durablement et tu peux la mettre à jour à tout moment sans changer de lien.',
            },
            {
              id: 'l6-s1-checklist',
              type: 'checklist',
              title: 'Contrôles rapides',
              description: 'Valide ces 2 points avant d’ouvrir Netlify Drop.',
              items: [
                {
                  id: 'l6-c1',
                  label: 'Mon compte gratuit sur app.netlify.com est créé et connecté.',
                  detail: 'Mon futur lien ne risque pas d’expirer après 24 heures.',
                },
                {
                  id: 'l6-c2',
                  label: 'J’ai retrouvé mon fichier index.html prêt à envoyer.',
                  detail: 'Prêt pour l’envoi direct sur Netlify Drop.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Envoyer un fichier qui s’appelle encore Solde 1.html ou index (1).html.',
                correction:
                  'Renomme simplement ton fichier en `index.html` avant de l’envoyer sur Netlify Drop pour éviter une page 404.',
              },
            ],
            tips: [
              'Sur téléphone comme sur ordinateur, tout se fait directement depuis ton navigateur sur app.netlify.com.',
            ],
          },
        },
        {
          id: 'lesson-06-step-02',
          number: 2,
          title: 'En ligne',
          subtitle: 'Déployer sur Netlify',
          completionLabel: 'Application en ligne',
          blocks: [
            {
              id: 'l6-s2-prose-deploiement',
              type: 'prose',
              title: 'PUBLIER SUR',
              italicAccent: 'Netlify',
              highlightPill:
                'Connecte-toi toujours à ton compte Netlify gratuit avant d’envoyer ton fichier pour que ton lien reste actif durablement.',
              paragraphs: [
                'En 2 minutes, ton application devient un vrai site web accessible partout :',
              ],
              bullets: [
                '1. Ouvre **`app.netlify.com/drop`** depuis ton compte connecté.',
                '2. Glisse ou sélectionne directement ton fichier **`index.html`** dans la zone *Drag & drop to publish instantly*.',
                '3. Une fois **`Dropped files`** affiché, clique sur **le nom du projet en haut à gauche** (voir la flèche) pour ouvrir sa fiche.',
                '4. **Mises à jour plus tard** : si tu modifies `index.html`, tu pourras redéposer la nouvelle version dans l’onglet **`Deploys`** sans changer ton lien.',
              ],
            },
            {
              id: 'l6-s2-callout-quota',
              type: 'callout',
              variant: 'tip',
              title: 'À savoir sur l’hébergement gratuit',
              content:
                'Le plan gratuit Netlify suffit largement pour héberger une application légère comme la tienne (sans aucun frais mensuel tant que tu restes dans le quota gratuit).',
            },
            {
              id: 'l6-s2-screen-netlify-drop',
              type: 'screenshot',
              src: '/screenshots/module-03/l6-netlify-drop-upload.png',
              alt: 'Zone Netlify Drop Drag and drop to publish instantly pour déposer son fichier HTML',
              caption: 'Zone Netlify Drop : glisse ou sélectionne ton fichier index.html ici',
              capturedAt: '21 novembre 2026',
            },
            {
              id: 'l6-s2-screen-netlify-project-select',
              type: 'screenshot',
              src: '/screenshots/module-03/l6-netlify-project-select.png',
              alt: 'Aperçu Netlify après dépôt montrant une flèche sur le nom du projet en haut à gauche',
              caption: 'Une fois déposé, clique sur le nom du projet en haut à gauche pour ouvrir ses réglages',
              capturedAt: '21 novembre 2026',
            },
            {
              id: 'l6-s2-checklist',
              type: 'checklist',
              title: 'Mise en ligne validée',
              description: 'Confirme ces points avant de rendre le lien public.',
              items: [
                {
                  id: 'l6-d1',
                  label: 'J’ai envoyé mon fichier index.html sur mon compte Netlify connecté.',
                  detail: 'Mon lien ne risque pas d’expirer.',
                },
                {
                  id: 'l6-d2',
                  label: 'J’ai cliqué sur le nom du projet en haut à gauche pour ouvrir sa fiche.',
                  detail: 'Je suis prêt à passer le projet en Public.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Déposer sur Netlify Drop sans être connecté (le lien expire en 24h).',
                correction:
                  'Connecte-toi toujours à ton compte Netlify gratuit avant de publier, ou clique sur « Claim site ».',
              },
              {
                mistake: 'Une page 404 apparaît quand tu ouvres le lien.',
                correction:
                  'Vérifie que le fichier envoyé s’appelle bien `index.html` en minuscules.',
              },
            ],
            tips: [
              'Si le nom souhaité est déjà pris sur Netlify, ajoute simplement `-app` ou le nom de ta marque.',
            ],
            troubleshootingPrompts: [
              {
                id: 'l6-troubleshoot-404',
                title: 'Dépannage erreur 404',
                description: 'Message court pour demander de l’aide à Claude si une page 404 s’affiche.',
                prompt: PROMPT_L6_NETLIFY_HELP,
              },
            ],
          },
        },
        {
          id: 'lesson-06-step-03',
          number: 3,
          title: 'Tester',
          subtitle: 'Vérifier le lien',
          completionLabel: 'Leçon 06 validée',
          blocks: [
            {
              id: 'l6-s3-prose-public',
              type: 'prose',
              title: 'TESTER TON',
              italicAccent: 'lien public',
              highlightPill:
                'Laisse ton projet Public sur Netlify : c’est ton écran de code d’accès qui protège l’outil.',
              paragraphs: [
                'Par défaut, ton nouveau site Netlify est en mode **Private**. Passe-le en **Public** et personnalise son lien en 2 clics :',
              ],
              bullets: [
                '1. Sur la fiche du projet, clique sur le bouton bleu **`Make public`**.',
                '2. Dans la fenêtre qui s’ouvre, clique sur le petit crayon à côté de **`Website URL`** si tu veux personnaliser ton nom en `.netlify.app`, laisse **`Public (Anyone on the internet)`**, puis clique sur **`Make public`**.',
                '3. Dès que **`Your project is public`** s’affiche, ouvre ton lien sur ton téléphone pour tester ton code d’accès et tes boutons.',
              ],
            },
            {
              id: 'l6-s3-screen-netlify-make-public-btn',
              type: 'screenshot',
              src: '/screenshots/module-03/l6-netlify-make-public-btn.png',
              alt: 'Fiche projet Netlify en statut Private avec flèche vers le bouton Make public',
              caption: 'Étape 1 : clique sur le bouton « Make public » sur la fiche de ton projet',
              capturedAt: '21 novembre 2026',
            },
            {
              id: 'l6-s3-screen-netlify-make-public-modal',
              type: 'screenshot',
              src: '/screenshots/module-03/l6-netlify-make-public-modal.png',
              alt: 'Fenêtre Make public montrant Website URL modifiable au crayon et le choix Public Anyone on the internet',
              caption: 'Étape 2 : modifie ton lien si besoin avec le crayon, garde Public puis clique sur « Make public »',
              capturedAt: '21 novembre 2026',
            },
            {
              id: 'l6-s3-screen-netlify-public-confirm',
              type: 'screenshot',
              src: '/screenshots/module-03/l6-netlify-public-confirm.png',
              alt: 'Fenêtre de confirmation Your project is public avec le lien netlify.app actif',
              caption: 'Étape 3 : ton site est officiellement public et accessible via son lien .netlify.app',
              capturedAt: '21 novembre 2026',
            },
            {
              id: 'l6-s3-checklist',
              type: 'checklist',
              title: 'Tests en ligne réussis',
              description: 'Dernière vérification avant la mise en vente sur Chariow.',
              items: [
                {
                  id: 'l6-p1',
                  label: 'Mon projet est bien Public (écran « Your project is public ») et j’ai copié mon lien final.',
                  detail: 'Seul mon propre écran de code d’accès s’affiche à l’ouverture.',
                },
                {
                  id: 'l6-p2',
                  label: 'J’ai testé le lien sur mon téléphone : code d’accès, affichage et actions tout est bon.',
                  detail: 'L’expérience client est prête.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Oublier de cliquer sur Make public après le dépôt sur Netlify Drop.',
                correction:
                  'Tant que le badge affiche Private, tes clients ne pourront pas ouvrir le lien : clique sur Make public pour le rendre accessible.',
              },
            ],
            tips: [
              'Ton application est désormais accessible partout dans le monde sur un lien sécurisé (`https://`).',
            ],
          },
        },
      ],
    },
    {
      id: 'lesson-07',
      lessonNumber: 7,
      moduleId: 'module-03',
      dayId: 'day-03',
      dayNumber: 3,
      navigationTitle: 'Vendre sur Chariow',
      title: "Organiser la livraison via Chariow et tester le parcours d'achat",
      italicTitleWord: 'livraison',
      duration: '~35 min',
      objective:
        'Créer ta fiche produit sur Chariow, préparer un joli Guide d’Accès PDF en 1 page pour tes clients et tester la livraison.',
      deliverableSummary: 'Ta fiche produit Chariow publiée et prête à encaisser.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-07-step-01',
          number: 1,
          title: 'Ta fiche',
          subtitle: 'Créer en brouillon',
          completionLabel: 'Brouillon prêt',
          blocks: [
            {
              id: 'l7-s1-prose-offre',
              type: 'prose',
              title: 'CRÉER TA',
              italicAccent: 'fiche Chariow',
              highlightPill:
                'Enregistre d’abord en Brouillon : tu publieras à l’étape suivante dès que ton Guide PDF d’accès sera ajouté.',
              paragraphs: [
                'Connecte-toi à ton tableau de bord Chariow et prépare la fiche de vente de ton produit :',
              ],
              bullets: [
                '1. Va dans **`Produits > Créer un nouveau produit`** et choisis le type **`Fichiers`** (`Files`).',
                '2. Ajoute ton titre, une description claire (tu peux t’aider du prompt ci-dessous), ton prix et de jolies captures de ton application.',
                '3. **Enregistre en Brouillon** sans publier encore.',
              ],
            },
            {
              id: 'l7-s1-screen-product-files',
              type: 'screenshot',
              src: '/screenshots/module-03/l7-chariow-product-files.png',
              alt: 'Écran Chariow Quel type de produit désirez-vous créer avec la carte Fichiers cochée en jaune',
              caption: 'Sélectionne le type « Fichiers » lors de la création de ton produit Chariow',
              capturedAt: '21 novembre 2026',
            },
            {
              id: 'l7-s1-copy-chariow',
              type: 'copy',
              title: 'Prompt optionnel pour rédiger ta description Chariow',
              label: 'FICHE CHARIOW',
              buttonText: 'Copier le prompt',
              defaultExpanded: false,
              content: PROMPT_FICHE_CHARIOW,
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Publier tout de suite avant d’avoir ajouté le Guide d’Accès PDF.',
                correction:
                  'Garde la fiche en Brouillon jusqu’à la fin de l’étape 2 pour qu’aucun client n’achète sans recevoir son accès.',
              },
            ],
            tips: [
              'Prends 2 captures d’écran propres de ton application (sur téléphone et ordinateur) comme images produit.',
            ],
          },
        },
        {
          id: 'lesson-07-step-02',
          number: 2,
          title: 'Le Guide',
          subtitle: 'Préparer et publier',
          completionLabel: 'Produit publié',
          blocks: [
            {
              id: 'l7-s2-prose-livraison',
              type: 'prose',
              title: 'PRÉPARER TON',
              italicAccent: 'guide d’accès',
              highlightPill:
                'Tes clients reçoivent un joli Guide PDF 1 page avec le lien cliquable et leur code d’accès : zéro confusion après paiement.',
              paragraphs: [
                'Télécharge notre modèle 1 page, laisse Claude l’adapter aux couleurs de ton application, puis enregistre-le en PDF :',
              ],
              bullets: [
                '1. Télécharge **`GUIDE-ACCES-CLIENT-MODELE.html`** ci-dessous.',
                '2. Dans Claude, joins ce fichier + ton `index.html` et envoie le prompt **`PERSONNALISER GUIDE`** avec ton lien Netlify et ton code.',
                '3. Ouvre le fichier renvoyé dans ton navigateur, fais **Imprimer > Enregistrer au format PDF** (1 page A4, sans marges, en cochant *Graphiques d’arrière-plan*).',
                '4. Ajoute ce PDF dans Chariow (**`Digital Files`**), colle les **Instructions après achat** dans les informations du produit, puis clique sur **Publier**.',
              ],
            },
            {
              id: 'l7-s2-screen-guide-preview',
              type: 'screenshot',
              src: '/screenshots/module-03/l7-guide-acces-preview.png',
              alt: 'Aperçu du Guide d Accès Client 1 page A4 personnalisé avec lien et code',
              caption: 'Aperçu du Guide d’Accès Client 1 page personnalisé (exemple SOLDE)',
              capturedAt: '21 novembre 2026',
            },
            {
              id: 'l7-s2-screen-chariow-instructions',
              type: 'screenshot',
              src: '/screenshots/module-03/l7-chariow-post-purchase.png',
              alt: 'Ajout du Guide d Accès PDF dans la section Digital Files sur Chariow',
              caption: 'Téléverse ton Guide d’Accès PDF dans Digital Files sur Chariow',
              capturedAt: '10 novembre 2026',
            },
            {
              id: 'l7-s2-resource-guide',
              type: 'resource',
              title: 'Modèle de Guide d’Accès Client (1 page)',
              description:
                'Télécharge le fichier HTML à personnaliser avec Claude (et l’aperçu PDF neutre).',
              resources: [
                {
                  id: 'res-guide-acces-html',
                  title: 'GUIDE-ACCES-CLIENT-MODELE.html',
                  category: 'template',
                  description:
                    'Modèle 1 page à confier à Claude pour reprendre tes couleurs puis enregistrer en PDF.',
                  format: 'HTML',
                  externalUrl: '/downloads/GUIDE-ACCES-CLIENT-MODELE.html',
                  downloadFilename: 'GUIDE-ACCES-CLIENT-MODELE.html',
                },
                {
                  id: 'res-guide-acces-modele',
                  title: 'GUIDE-ACCES-CLIENT-MODELE.pdf',
                  category: 'guide',
                  description:
                    'Aperçu PDF du rendu neutre avant personnalisation.',
                  format: 'PDF',
                  externalUrl: '/downloads/GUIDE-ACCES-CLIENT-MODELE.pdf',
                  downloadFilename: 'GUIDE-ACCES-CLIENT-MODELE.pdf',
                },
              ],
            },
            {
              id: 'l7-s2-copy-guide',
              type: 'copy',
              title: 'Prompt pour personnaliser ton Guide d’Accès',
              label: 'PERSONNALISER GUIDE',
              buttonText: 'Copier le prompt',
              defaultExpanded: false,
              content: PROMPT_PERSONNALISER_GUIDE,
            },
            {
              id: 'l7-s2-copy-instructions',
              type: 'copy',
              title: 'Instructions après achat (à coller dans Chariow)',
              label: 'INSTRUCTIONS APRÈS ACHAT',
              buttonText: 'Copier le texte',
              defaultExpanded: true,
              content: TEXTE_INSTRUCTIONS_POST_ACHAT,
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Oublier d’activer les couleurs / graphiques d’arrière-plan au moment d’enregistrer en PDF.',
                correction:
                  'Coche « Graphiques d’arrière-plan » et règle les marges sur Aucune pour garder le beau rendu 1 page.',
              },
            ],
            tips: [
              'Vérifie toujours ton PDF final avant de le téléverser sur Chariow en cliquant sur le bouton d’accès pour être sûr qu’il ouvre ton site.',
            ],
          },
        },
        {
          id: 'lesson-07-step-03',
          number: 3,
          title: 'Vérifier',
          subtitle: 'Tester et lancer',
          completionLabel: 'Terminer le cours',
          blocks: [
            {
              id: 'l7-s3-prose-test',
              type: 'prose',
              title: 'TESTER LA',
              italicAccent: 'livraison',
              highlightPill:
                'Fais un test rapide avec un code promo à 100 % limité à 1 seule utilisation, puis désactive-le aussitôt.',
              paragraphs: [
                'Dernier contrôle pour être sûr à 100 % que ton premier vrai acheteur reçoive son accès sans aucun souci :',
              ],
              bullets: [
                '1. Dans **`Marketing > Réductions`** sur Chariow, crée un coupon à **`100 %`** limité à **ton produit** et à **`1` seule utilisation**.',
                '2. Ouvre ta page produit en navigation privée et teste le coupon.',
                '3. **Si la commande gratuite passe** : vérifie le téléchargement de ton Guide PDF, le lien cliquable et le code d’accès. **Si Chariow bloque les commandes à 0 €** : ne paie pas ton propre produit, relis simplement ton PDF et tes instructions manuellement.',
                '4. **Désactive tout de suite le code promo** une fois le test fini.',
              ],
            },
            {
              id: 'l7-s3-checklist',
              type: 'checklist',
              title: 'Derniers contrôles avant lancement',
              description: 'Valide ces 4 points : ta boutique est prête !',
              items: [
                {
                  id: 'l7-t1',
                  label: 'Ma fiche Chariow est publiée avec mon Guide PDF personnalisé et mes instructions.',
                  detail: 'Tous les crochets [...] ont bien été remplacés.',
                },
                {
                  id: 'l7-t2',
                  label: 'J’ai vérifié que mon Guide PDF ouvre bien mon application et que le code fonctionne.',
                  detail: 'Lien Netlify + code d’accès testés.',
                },
                {
                  id: 'l7-t3',
                  label: 'Si j’ai créé un coupon de test à 100 %, je l’ai bien désactivé.',
                  detail: 'Aucun code gratuit ne reste actif par oubli.',
                },
                {
                  id: 'l7-t4',
                  label: 'Mon produit est officiellement prêt à être partagé et vendu !',
                  detail: 'Félicitations pour la création complète de ton application.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Oublier de désactiver son code promo de test à 100 %.',
                correction:
                  'Retourne tout de suite dans Marketing > Réductions pour supprimer ou désactiver ce code après ton essai.',
              },
            ],
            tips: [
              'Découvre maintenant les Bonus sur la page d’accueil pour promouvoir et vendre ton application chaque semaine.',
            ],
          },
        },
      ],
    },
  ],
};
