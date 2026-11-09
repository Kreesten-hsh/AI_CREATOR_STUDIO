import type { Day } from '../../types/course';

export const PROMPT_L6_NETLIFY_HELP = `Mon déploiement sur Netlify Drop affiche une erreur 404 (Page Not Found).
Voici l'organisation de mes fichiers : mon dossier [nom du dossier] contient [nom et emplacement exacts des fichiers].
Comment corriger mon dossier pour que la page s'affiche ?`;

export const TEXTE_INSTRUCTIONS_POST_ACHAT = `Merci pour votre achat !

Voici comment accéder immédiatement à votre application :
1. Cliquez sur votre lien d'accès direct : [VOTRE LIEN NETLIFY]
2. Ajoutez cette adresse à vos favoris pour la retrouver en un clic.
3. Téléchargez votre Guide d'Accueil PDF depuis les fichiers disponibles après votre achat.

En cas de question ou de suggestion, contactez-moi directement à [VOTRE EMAIL].`;

export const day03: Day = {
  id: 'day-03',
  dayNumber: 3,
  moduleId: 'module-03',
  title: 'Journée 3 : Publier et livrer',
  objective:
    'Publier gratuitement son application sur Netlify, configurer sa livraison commerciale sur Chariow et vérifier le parcours d’achat complet.',
  deliverableSummary:
    'Une URL Netlify publique active et une fiche produit Chariow fonctionnelle avec livraison automatique de son Guide d’Accueil PDF.',
  lessons: [
    {
      id: 'lesson-06',
      lessonNumber: 6,
      moduleId: 'module-03',
      dayId: 'day-03',
      dayNumber: 3,
      navigationTitle: 'Publier',
      title: 'Publier son application sur Netlify',
      italicTitleWord: 'application',
      duration: '~25 min',
      objective:
        'Déployer gratuitement son dossier mon-application sur Netlify Drop, personnaliser son adresse web et vérifier son accès public en HTTPS sur mobile.',
      deliverableSummary:
        'Mon URL Netlify publique : une adresse web sécurisée en HTTPS, active et accessible par n’importe quel visiteur sur ordinateur et mobile.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-06-step-01',
          number: 1,
          title: 'Le dossier',
          subtitle: 'Dossier et racine',
          completionLabel: 'Dossier vérifié',
          blocks: [
            {
              id: 'l6-s1-prose-dossier',
              type: 'prose',
              title: 'VÉRIFIER LE',
              italicAccent: 'dossier',
              highlightPill:
                'Ne dépose jamais un fichier isolé : dépose uniquement ton dossier mon-application complet.',
              paragraphs: [
                'Vérifie que ton fichier index.html se trouve directement à la racine de ton dossier mon-application.',
              ],
              bullets: [
                'Retrouve le dossier mon-application préparé lors de la Leçon 05.',
                'Assure-toi que le nom s’écrit exactement index.html en minuscules.',
                'Isole ce dossier pour ne jamais téléverser tes documents personnels.',
              ],
            },
            {
              id: 'l6-s1-checklist',
              type: 'checklist',
              title: 'Contrôles du dossier',
              description: 'Valide ces 3 points pour préparer un dépôt sans erreur.',
              items: [
                {
                  id: 'l6-c1',
                  label: 'Le fichier index.html est situé directement au premier niveau du dossier.',
                  detail: 'Il ne doit être enfermé dans aucun sous-dossier supplémentaire.',
                },
                {
                  id: 'l6-c2',
                  label: 'Le nom s’écrit entièrement en minuscules sans extension .txt masquée.',
                  detail: 'Le type du fichier doit être un Document HTML reconnu par l’ordinateur.',
                },
                {
                  id: 'l6-c3',
                  label: 'Le dossier mon-application ne contient aucun fichier personnel étranger.',
                  detail: 'Seul le code de ton application doit être envoyé vers l’hébergeur.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Nommer le fichier Index.html avec une majuscule ou laisser un sous-dossier.',
                correction:
                  'Renomme le fichier en minuscules strictes index.html et place-le à la racine exacte.',
              },
              {
                mistake: 'Compresser le dossier en fichier .zip avant le dépôt.',
                correction:
                  'Netlify Drop accepte directement le dossier décompressé : n’utilise aucune archive zip.',
              },
            ],
            tips: [
              'Garde ce dossier ouvert sur ton bureau pour le glisser-déposer en un geste à l’étape suivante.',
            ],
          },
        },
        {
          id: 'lesson-06-step-02',
          number: 2,
          title: 'Déployer',
          subtitle: 'Glisser sur Netlify',
          completionLabel: 'Application déployée',
          blocks: [
            {
              id: 'l6-s2-prose-deploiement',
              type: 'prose',
              title: 'GLISSER DANS',
              italicAccent: 'Netlify',
              highlightPill:
                'L’hébergement gratuit utilise un quota mensuel de crédits : les projets peuvent être mis en pause s’il est épuisé.',
              paragraphs: [
                'Connecte-toi à Netlify Drop puis glisse ton dossier complet pour obtenir ton adresse en quelques secondes.',
              ],
              bullets: [
                'Ouvre ton navigateur sur la page app.netlify.com/drop.',
                'Glisse ton dossier mon-application dans la zone de dépôt.',
                'Patiente quelques secondes pendant la publication sans fermer l’onglet.',
                'Copie l’adresse générée se terminant par netlify.app.',
              ],
            },
            {
              id: 'l6-s2-checklist',
              type: 'checklist',
              title: 'Contrôles de mise en ligne',
              description: 'Vérifie la bonne publication de ton site sur Netlify.',
              items: [
                {
                  id: 'l6-d1',
                  label: 'Le dossier a été déposé dans la zone Netlify Drop sans interruption.',
                  detail: 'Le voyant de mise en ligne passe au vert sur le tableau de bord.',
                },
                {
                  id: 'l6-d2',
                  label: 'L’adresse web publique en netlify.app s’affiche sur ton écran.',
                  detail: 'Cette première adresse provisoire prouve que le site est hébergé.',
                },
                {
                  id: 'l6-d3',
                  label: 'L’application s’affiche en ouvrant ce lien dans un nouvel onglet.',
                  detail: 'La page interactive répond normalement comme lors du test local.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Une page 404 Page Not Found apparaît après l’ouverture de l’adresse.',
                correction:
                  'Vérifie que index.html était bien à la racine du dossier déposé et non dans un sous-dossier.',
              },
              {
                mistake: 'Le dépôt reste bloqué sans démarrer.',
                correction:
                  'Vérifie ta connexion Internet et réessaie en glissant à nouveau le dossier sur la page.',
              },
            ],
            tips: [
              'Tu peux mettre à jour ton site à tout moment en redéposant un dossier corrigé dans l’onglet Deploys.',
            ],
            troubleshootingPrompts: [
              {
                id: 'l6-troubleshoot-404',
                title: 'Dépannage page 404 Netlify',
                description: 'Message court à envoyer à Claude si ton site affiche une erreur 404.',
                prompt: PROMPT_L6_NETLIFY_HELP,
              },
            ],
          },
        },
        {
          id: 'lesson-06-step-03',
          number: 3,
          title: 'Rendre public',
          subtitle: 'Nom et mobile',
          completionLabel: 'Leçon 06 validée',
          blocks: [
            {
              id: 'l6-s3-prose-public',
              type: 'prose',
              title: 'CONTRÔLER TON',
              italicAccent: 'adresse',
              highlightPill:
                'Toute personne disposant du lien peut ouvrir l’outil : ton application statique reste publique sur Internet.',
              paragraphs: [
                'Personnalise ton site et vérifie son affichage mobile avant de lancer sa commercialisation.',
              ],
              bullets: [
                'Renomme via Project Overview > Customize > Manage project name and cover image.',
                'Règle dans Project configuration > General > Visitor access > Project visibility la valeur Public.',
                'Certains projets Netlify sont privés par défaut selon l’équipe.',
                'Le certificat sécurisé HTTPS est provisionné automatiquement sans aucune configuration manuelle.',
                'Teste en navigation privée et sur smartphone pour vérifier l’accès réel.',
              ],
            },
            {
              id: 'l6-s3-checklist',
              type: 'checklist',
              title: 'Contrôles d’accessibilité mondiale',
              description: 'Vérifie ces 3 derniers points avant de passer à la vente.',
              items: [
                {
                  id: 'l6-p1',
                  label: 'L’adresse personnalisée en netlify.app est active et lisible.',
                  detail: 'Le nom du site reflète clairement ton outil ou ton activité.',
                },
                {
                  id: 'l6-p2',
                  label: 'La page s’ouvre sans mot de passe en fenêtre de navigation privée.',
                  detail: 'Tout visiteur externe peut utiliser l’application sans compte Netlify.',
                },
                {
                  id: 'l6-p3',
                  label: 'L’affichage sur smartphone est fluide et les boutons réagissent sans débordement.',
                  detail: 'L’outil est prêt pour être distribué à tes futurs clients.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Le site demande un mot de passe ou refuse les visiteurs externes.',
                correction:
                  'Ouvre Visitor access dans les réglages du projet et sélectionne la visibilité publique.',
              },
              {
                mistake: 'Le nom personnalisé choisi est déjà utilisé par un autre projet Netlify.',
                correction:
                  'Ajoute un suffixe simple comme ton prénom ou ton activité pour rendre le sous-domaine unique.',
              },
            ],
            tips: [
              'Envoie le lien sur ton propre smartphone via messagerie pour effectuer un test tactile immédiat.',
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
      navigationTitle: 'Vendre',
      title: "Organiser la livraison via Chariow et tester le parcours d'achat",
      italicTitleWord: 'livraison',
      duration: '~35 min',
      objective:
        'Créer son offre Files sur Chariow, livrer son Guide d’Accueil PDF avec son URL Netlify et vérifier le parcours d’achat en conditions réelles.',
      deliverableSummary:
        'Mon produit Chariow publié : une fiche produit configurée avec son Guide PDF et son parcours client vérifié selon la réponse de la plateforme.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-07-step-01',
          number: 1,
          title: 'Créer l’offre',
          subtitle: 'Fiche produit Files',
          completionLabel: 'Offre créée',
          blocks: [
            {
              id: 'l7-s1-prose-offre',
              type: 'prose',
              title: 'CONFIGURER TON',
              italicAccent: 'produit',
              highlightPill:
                'Les visuels doivent refléter ton application : n’utilise pas la charte Burgundy/Cream du studio.',
              paragraphs: [
                'Ouvre ton tableau de bord vendeur Chariow pour créer ton produit téléchargeable avec son prix et ses visuels.',
              ],
              bullets: [
                'Choisis Produits > Créer un nouveau produit puis sélectionne la carte Fichiers.',
                'Renseigne un titre clair, sélectionne ta catégorie et indique ton tarif.',
                'Ajoute une miniature carrée (minimum 600 × 600 px) et une bannière (minimum 702 × 260 px).',
                'Vérifie le récapitulatif puis clique impérativement sur Publier pour mettre ton offre en ligne.',
              ],
            },
            {
              id: 'l7-s1-checklist',
              type: 'checklist',
              title: 'Contrôles de la fiche produit',
              description: 'Valide ces 3 éléments clés avant d’enregistrer.',
              items: [
                {
                  id: 'l7-o1',
                  label: 'Le type de produit sélectionné sur Chariow est bien Fichiers.',
                  detail: 'Ce format assure la livraison automatique des documents après achat.',
                },
                {
                  id: 'l7-o2',
                  label: 'Le nom, la catégorie et le prix sont clairement renseignés.',
                  detail: 'La promesse de vente correspond fidèlement à ce que fait l’outil.',
                },
                {
                  id: 'l7-o3',
                  label: 'La vignette carrée et la bannière rectangulaire sont ajoutées.',
                  detail: 'Les visuels mettent en valeur l’identité graphique de ton application.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Choisir le type Licences en pensant verrouiller l’accès à son site.',
                correction:
                  'Choisis le type Fichiers : ton application est un site web statique accompagné d’un guide.',
              },
              {
                mistake: 'Uploader des images de couverture floues ou déformées.',
                correction:
                  'Respecte au minimum 600 × 600 px pour le carré et 702 × 260 px pour la bannière.',
              },
            ],
            tips: [
              'Tu peux utiliser l’assistant de rédaction Chariow pour enrichir ta description commerciale.',
            ],
          },
        },
        {
          id: 'lesson-07-step-02',
          number: 2,
          title: 'La livraison',
          subtitle: 'Guide et instructions',
          completionLabel: 'Livraison configurée',
          blocks: [
            {
              id: 'l7-s2-prose-livraison',
              type: 'prose',
              title: 'PRÉPARER LA',
              italicAccent: 'livraison',
              highlightPill:
                'Chariow livre le guide PDF mais ne verrouille pas l’application : l’adresse Netlify reste publique.',
              paragraphs: [
                'Renseigne ton Guide d’Accueil PDF et les instructions affichées à ton acheteur juste après son paiement.',
              ],
              bullets: [
                'Prépare un PDF d’accueil contenant ton adresse Netlify et trois conseils pour commencer.',
                'Téléverse ce fichier PDF dans la section Contenu du produit sur Chariow.',
                'Accède au champ Instructions après achat via Produits > Modifier > Informations.',
                'Colle la trame ci-dessous complétée avec ton lien et enregistre.',
              ],
            },
            {
              id: 'l7-s2-copy-instructions',
              type: 'copy',
              title: 'Trame des instructions après achat',
              label: 'INSTRUCTIONS APRÈS ACHAT',
              buttonText: 'Copier les instructions',
              defaultExpanded: true,
              notes:
                'Remplace les crochets par tes informations et colle ce texte dans les instructions après achat.',
              content: TEXTE_INSTRUCTIONS_POST_ACHAT,
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake:
                  'Penser que Chariow redirige automatiquement le client vers Netlify avec le type Files.',
                correction:
                  'Le type Files livre un document : place le lien dans le PDF et les instructions après achat.',
              },
              {
                mistake: 'Oublier de cliquer sur Enregistrer en bas de page après avoir modifié les instructions.',
                correction:
                  'Valide systématiquement avec le bouton Enregistrer pour appliquer tes réglages.',
              },
            ],
            tips: [
              'Tu peux utiliser Canva, Word ou Google Docs pour exporter ton Guide d’Accueil en format PDF.',
            ],
          },
        },
        {
          id: 'lesson-07-step-03',
          number: 3,
          title: 'Tester l’achat',
          subtitle: 'Vérifier le parcours',
          completionLabel: 'Contrôles terminés',
          blocks: [
            {
              id: 'l7-s3-prose-test',
              type: 'prose',
              title: 'VALIDER LE',
              italicAccent: 'parcours',
              highlightPill:
                'Si Chariow refuse la commande à 0 €, valide le panier sans payer puis désactive le code.',
              paragraphs: [
                'Teste ta page produit en navigation privée pour vérifier la commande et l’accès au guide.',
              ],
              bullets: [
                'Crée un code 100 % limité à ton produit, 1 utilisation totale et 1 par client.',
                'En navigation privée, teste le panier : télécharge le guide si le 0 € est accepté.',
                'Si la commande à 0 € est refusée, ne paie pas : le parcours s’arrête au panier.',
                'Désactive impérativement le code de réduction dans Marketing > Réductions après ton test.',
              ],
            },
            {
              id: 'l7-s3-checklist',
              type: 'checklist',
              title: 'Vérifications du parcours client',
              description: 'Valide ces 5 vérifications pour clore la formation en toute sérénité.',
              items: [
                {
                  id: 'l7-t1',
                  label: 'La fiche produit est publiée avec son titre, son prix et ses visuels aux bonnes dimensions.',
                  detail: 'La description commerciale reflète fidèlement les fonctionnalités de ton application.',
                },
                {
                  id: 'l7-t2',
                  label: 'Le code promo test est restreint au produit, avec 1 utilisation maximale et 1 par client.',
                  detail: 'Ces trois restrictions évitent tout abus commercial pendant ton contrôle technique.',
                },
                {
                  id: 'l7-t3',
                  label: 'Si la commande à 0 € est validée : le guide est téléchargé et le lien Netlify fonctionne.',
                  detail: 'Les instructions après achat s’affichent et le PDF d’accueil ouvre ton site web.',
                },
                {
                  id: 'l7-t4',
                  label: 'Si la commande à 0 € est refusée : le panier est vérifié sans payer son propre produit.',
                  detail: 'Ne réalise aucun faux achat : constate simplement le blocage de la commande à 0 €.',
                },
                {
                  id: 'l7-t5',
                  label: 'Le code promotionnel a été désactivé immédiatement dans Marketing > Réductions.',
                  detail: 'Le coupon test est clos et ta boutique est sécurisée contre tout usage non autorisé.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Payer son propre produit au prix normal si la plateforme refuse le code à 0 €.',
                correction:
                  'Ne réalise pas de faux paiement : constate simplement que la passerelle refuse les paniers à 0 €.',
              },
              {
                mistake: 'Laisser un code promo à 100 % actif et public après les vérifications.',
                correction:
                  'Désactive le code immédiatement dans Marketing > Réductions pour protéger tes futures ventes.',
              },
              {
                mistake: 'Effectuer le test en restant connecté à son compte administrateur Chariow.',
                correction:
                  'Ouvre une fenêtre de navigation privée pour observer l’expérience réelle d’un nouveau client.',
              },
            ],
            tips: [
              'Le portail client Chariow permet à tes acheteurs de retrouver leurs factures et leurs fichiers à tout moment.',
            ],
          },
        },
      ],
    },
  ],
};
