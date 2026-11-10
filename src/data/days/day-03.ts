import type { Day } from '../../types/course';

// Les chemins d'interface Netlify et Chariow cités ci-dessous restent à confirmer
// avec les captures réelles réalisées par l'utilisateur au LOT C.

export const PROMPT_L6_NETLIFY_HELP = `Mon déploiement sur Netlify Drop affiche une erreur 404 (Page Not Found).
Voici l'organisation de mes fichiers : mon dossier [nom du dossier] contient [nom et emplacement exacts des fichiers].
Comment corriger mon dossier pour que la page s'affiche ?`;

export const TEXTE_INSTRUCTIONS_POST_ACHAT = `Merci pour votre achat !

Voici comment accéder à votre application :
1. Ouvrez votre lien d'accès direct : [VOTRE LIEN NETLIFY]
2. Saisissez votre code d'accès sur l'écran d'accueil : [VOTRE CODE D'ACCÈS]
3. Ajoutez cette adresse à vos favoris pour la retrouver en un clic.
4. Téléchargez votre Guide d'Accès PDF depuis les fichiers disponibles après votre achat.

Vos données ne sont pas synchronisées automatiquement entre vos appareils. Leur mode de conservation dépend du fonctionnement de l'application : consultez la section “Sauvegarde des données” de votre Guide d'Accès pour connaître les modalités applicables.

En cas de question, contactez-moi à [VOTRE EMAIL].`;

export const day03: Day = {
  id: 'day-03',
  dayNumber: 3,
  moduleId: 'module-03',
  title: 'Journée 3 : Publier et livrer',
  objective:
    'Mettre ton application en ligne sur Netlify, préparer ta livraison sur Chariow avec ton Guide d’Accès PDF et vérifier le parcours d’achat.',
  deliverableSummary:
    'Une adresse Netlify publique protégée par ton écran de code et un produit Chariow qui livre ton Guide d’Accès PDF et tes instructions.',
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
        'Déposer ton dossier mon-application sur Netlify Drop, régler sa visibilité sur Public et tester ton écran de code en ligne.',
      deliverableSummary:
        'Mon adresse Netlify en HTTPS : publique, avec l’écran de code d’accès testé sur ordinateur et smartphone.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-06-step-01',
          number: 1,
          title: 'Ton dossier',
          subtitle: 'Racine du dossier',
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
                'Le nom s’écrit exactement index.html, en minuscules.',
                'Aucun sous-dossier supplémentaire et aucun fichier personnel.',
                'Utilise le dossier décompressé, jamais une archive .zip.',
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
                  detail: 'Il n’est enfermé dans aucun sous-dossier supplémentaire.',
                },
                {
                  id: 'l6-c2',
                  label: 'Le nom s’écrit entièrement en minuscules sans extension .txt masquée.',
                  detail: 'Ton ordinateur le reconnaît comme un document HTML.',
                },
                {
                  id: 'l6-c3',
                  label: 'Le dossier mon-application ne contient aucun fichier personnel.',
                  detail: 'Seul le fichier de ton application est envoyé en ligne.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Nommer le fichier Index.html avec une majuscule ou laisser un sous-dossier.',
                correction:
                  'Renomme le fichier en index.html, en minuscules, et place-le à la racine du dossier.',
              },
              {
                mistake: 'Compresser le dossier en fichier .zip avant le dépôt.',
                correction:
                  'Netlify Drop accepte directement le dossier décompressé.',
              },
            ],
            tips: [
              'Garde ce dossier ouvert sur ton bureau pour le glisser en un geste à l’étape suivante.',
            ],
          },
        },
        {
          id: 'lesson-06-step-02',
          number: 2,
          title: 'En ligne',
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
                'Glisse ton dossier sur Netlify Drop pour obtenir une adresse HTTPS en quelques secondes.',
              ],
              bullets: [
                'Ouvre app.netlify.com/drop dans ton navigateur et connecte-toi.',
                'Glisse le dossier mon-application dans la zone de dépôt, puis attends la fin de la publication.',
                'Copie l’adresse générée qui se termine par netlify.app.',
              ],
            },
            {
              id: 'l6-s2-checklist',
              type: 'checklist',
              title: 'Contrôles de mise en ligne',
              description: 'Vérifie la bonne publication de ton application.',
              items: [
                {
                  id: 'l6-d1',
                  label: 'Le dossier a été déposé dans la zone Netlify Drop sans interruption.',
                  detail: 'Netlify indique que la publication est terminée.',
                },
                {
                  id: 'l6-d2',
                  label: 'L’adresse publique en netlify.app s’affiche à l’écran.',
                  detail: 'Copie-la : tu en auras besoin pour ton guide et ta livraison.',
                },
                {
                  id: 'l6-d3',
                  label: 'Le lien s’ouvre en HTTPS dans un nouvel onglet et affiche l’écran de code.',
                  detail: 'La page réagit comme lors de ton test au double-clic.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Une page 404 Page Not Found apparaît à l’ouverture de l’adresse.',
                correction:
                  'Vérifie que index.html était à la racine du dossier déposé et non dans un sous-dossier.',
              },
              {
                mistake: 'Le dépôt reste bloqué sans démarrer.',
                correction:
                  'Vérifie ta connexion Internet et glisse à nouveau le dossier sur la page.',
              },
            ],
            tips: [
              'Pour publier une nouvelle version, redépose ton dossier corrigé dans l’onglet Deploys de ton projet.',
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
          title: 'Accès client',
          subtitle: 'Public et code',
          completionLabel: 'Leçon 06 validée',
          blocks: [
            {
              id: 'l6-s3-prose-public',
              type: 'prose',
              title: 'OUVRIR AUX',
              italicAccent: 'acheteurs',
              highlightPill:
                'Netlify rend ta page publique ; ton écran de code réserve ensuite l’usage aux acheteurs.',
              paragraphs: [
                'Règle la visibilité de ton projet Netlify sur Public, puis teste ton écran de code en ligne.',
              ],
              bullets: [
                'Dans Project configuration > General > Visitor access, choisis Public, sans mot de passe Netlify.',
                'Ton code d’accès est une barrière JavaScript dissuasive, pas une authentification serveur.',
                'Teste en navigation privée et sur smartphone : mauvais code refusé, bon code accepté.',
              ],
            },
            {
              id: 'l6-s3-checklist',
              type: 'checklist',
              title: 'Contrôles de l’accès client',
              description: 'Vérifie ces 4 points avant de passer à la vente.',
              items: [
                {
                  id: 'l6-p1',
                  label: 'L’adresse HTTPS en netlify.app s’ouvre et le projet est réglé sur Public.',
                  detail: 'Aucun mot de passe Netlify ne bloque tes futurs acheteurs.',
                },
                {
                  id: 'l6-p2',
                  label: 'La page affiche l’écran de code d’accès avant tout contenu.',
                  detail: 'C’est l’écran .gate prévu dans ton application.',
                },
                {
                  id: 'l6-p3',
                  label: 'Un mauvais code est refusé et le bon code déverrouille l’application.',
                  detail: 'Le code est celui que tu transmettras à tes acheteurs.',
                },
                {
                  id: 'l6-p4',
                  label: 'Le test fonctionne sur ordinateur en navigation privée et sur smartphone.',
                  detail: 'Les boutons réagissent au doigt et rien ne déborde de l’écran.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Activer une protection par mot de passe dans Netlify.',
                correction:
                  'Laisse le projet en Public : seul ton écran de code doit demander le code acheteur.',
              },
              {
                mistake: 'Le nom personnalisé choisi est déjà utilisé par un autre projet Netlify.',
                correction:
                  'Ajoute un suffixe simple, comme ton prénom ou ton activité.',
              },
            ],
            tips: [
              'Pour renommer ton adresse, passe par Project Overview > Customize > Manage project name and cover image.',
              'Le HTTPS est fourni automatiquement, sans configuration manuelle.',
              'Les intitulés des menus Netlify peuvent varier légèrement selon la version de l’interface.',
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
        'Créer ton produit Fichiers sur Chariow, personnaliser ton Guide d’Accès PDF, préparer les instructions après achat et tester la livraison.',
      deliverableSummary:
        'Mon produit Chariow publié avec mon Guide d’Accès PDF personnalisé, mes instructions après achat et un test de livraison documenté.',
      isSkeletonPlaceholder: false,
      steps: [
        {
          id: 'lesson-07-step-01',
          number: 1,
          title: 'Ton offre',
          subtitle: 'Produit Fichiers',
          completionLabel: 'Offre créée',
          blocks: [
            {
              id: 'l7-s1-prose-offre',
              type: 'prose',
              title: 'CRÉER TON',
              italicAccent: 'offre',
              highlightPill:
                'Le modèle de Guide d’Accès PDF se personnalise avant d’être remis à tes clients.',
              paragraphs: [
                'Crée ton produit de type Fichiers sur Chariow, puis télécharge le modèle de guide ci-dessous.',
              ],
              bullets: [
                'Dans Produits > Créer un nouveau produit, choisis Fichiers, puis indique nom, description, catégorie et prix.',
                'Ajoute une miniature (600 × 600 px minimum) et une bannière (702 × 260 px minimum) aux couleurs de ton application.',
                'Vérifie le récapitulatif, puis clique sur Publier.',
              ],
            },
            {
              id: 'l7-s1-resource-guide',
              type: 'resource',
              title: 'Modèle de Guide d’Accès PDF',
              description:
                'Modèle à personnaliser à l’étape suivante, à ne pas envoyer tel quel.',
              resources: [
                {
                  id: 'res-guide-acces-modele',
                  title: 'GUIDE-ACCES-CLIENT-MODELE.pdf',
                  category: 'guide',
                  description:
                    'Champs entre crochets à remplacer : nom, lien Netlify, code d’accès et contact.',
                  format: 'PDF',
                  externalUrl: '/downloads/GUIDE-ACCES-CLIENT-MODELE.pdf',
                  downloadFilename: 'GUIDE-ACCES-CLIENT-MODELE.pdf',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Choisir le type Licences en pensant verrouiller l’accès à son site.',
                correction:
                  'Choisis le type Fichiers : ton guide est livré, et ton écran de code protège l’application.',
              },
              {
                mistake: 'Ajouter des visuels flous ou aux couleurs du cours.',
                correction:
                  'Respecte au minimum 600 × 600 px et 702 × 260 px, et n’utilise pas la charte Burgundy/Cream du studio.',
              },
            ],
            tips: [
              'Les intitulés des menus Chariow peuvent varier légèrement selon la version de l’interface.',
            ],
          },
        },
        {
          id: 'lesson-07-step-02',
          number: 2,
          title: 'La livraison',
          subtitle: 'Guide et message',
          completionLabel: 'Livraison configurée',
          blocks: [
            {
              id: 'l7-s2-prose-livraison',
              type: 'prose',
              title: 'PRÉPARER LA',
              italicAccent: 'livraison',
              highlightPill:
                'Chariow livre ton guide et ton message ; il ne redirige pas automatiquement vers Netlify.',
              paragraphs: [
                'Personnalise le modèle téléchargé, exporte ton propre PDF, puis prépare ton message après achat.',
              ],
              bullets: [
                'Remplace tous les champs entre crochets : ton lien HTTPS, ton code d’accès et ton adresse de contact.',
                'Exporte ton guide en PDF et téléverse-le dans le contenu de ton produit Fichiers.',
                'Dans Produits > Modifier > Informations, colle le message ci-dessous complété, puis enregistre.',
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
                'Remplace les crochets par ton lien Netlify, ton code d’accès et ton e-mail avant de coller ce texte.',
              content: TEXTE_INSTRUCTIONS_POST_ACHAT,
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake:
                  'Penser que Chariow redirige automatiquement le client vers Netlify avec le type Files.',
                correction:
                  'Le type Files livre un document : place ton lien et ton code dans le guide et dans les instructions après achat.',
              },
              {
                mistake: 'Téléverser le modèle sans remplacer les champs entre crochets.',
                correction:
                  'Relis ton PDF exporté : aucun crochet ne doit rester avant de le téléverser.',
              },
            ],
            tips: [
              'Tu peux personnaliser le modèle dans Word, Google Docs ou Canva, puis l’exporter en PDF.',
            ],
          },
        },
        {
          id: 'lesson-07-step-03',
          number: 3,
          title: 'Achat test',
          subtitle: 'Vérifier la livraison',
          completionLabel: 'Contrôles terminés',
          blocks: [
            {
              id: 'l7-s3-prose-test',
              type: 'prose',
              title: 'VALIDER LE',
              italicAccent: 'parcours',
              highlightPill:
                'Si Chariow refuse la commande à 0 €, ne paie pas : arrête-toi au panier et désactive le code.',
              paragraphs: [
                'Teste ta page produit en navigation privée avec un code promotionnel à 100 % réservé au test.',
              ],
              bullets: [
                'Limite le code à ton produit, à 1 utilisation totale et 1 par client.',
                'Si la commande à 0 € passe, vérifie instructions, guide, lien Netlify et déverrouillage avec ton code.',
                'Ensuite, désactive impérativement le code dans Marketing > Réductions.',
              ],
            },
            {
              id: 'l7-s3-checklist',
              type: 'checklist',
              title: 'Vérifications du parcours client',
              description: 'Valide ces 5 points selon la réponse de Chariow.',
              items: [
                {
                  id: 'l7-t1',
                  label: 'Ma fiche produit Fichiers est publiée avec nom, catégorie, prix et visuels aux bonnes dimensions.',
                  detail: 'La description correspond fidèlement à ce que fait ton application.',
                },
                {
                  id: 'l7-t2',
                  label: 'Le code promo test est restreint au produit, avec 1 utilisation maximale et 1 par client.',
                  detail: 'Ces restrictions évitent tout usage non prévu pendant ton test.',
                },
                {
                  id: 'l7-t3',
                  label: 'Si la commande à 0 € est validée : les instructions s’affichent et le guide est téléchargé.',
                  detail: 'Le lien Netlify s’ouvre et ton code d’accès déverrouille l’application.',
                },
                {
                  id: 'l7-t4',
                  label: 'Si la commande à 0 € est refusée : je me suis arrêté au panier, sans payer mon propre produit.',
                  detail: 'Note simplement que la livraison après achat n’a pas pu être testée.',
                },
                {
                  id: 'l7-t5',
                  label: 'Le code promotionnel a été désactivé immédiatement dans Marketing > Réductions.',
                  detail: 'Ta boutique est protégée contre tout usage non autorisé du code.',
                },
              ],
            },
          ],
          help: {
            frequentMistakes: [
              {
                mistake: 'Payer son propre produit au prix normal si la plateforme refuse le code à 0 €.',
                correction:
                  'Ne fais aucun paiement : constate le refus, arrête-toi au panier et désactive le code.',
              },
              {
                mistake: 'Laisser un code promo à 100 % actif après le test.',
                correction:
                  'Désactive le code immédiatement dans Marketing > Réductions.',
              },
              {
                mistake: 'Faire le test en restant connecté à son compte vendeur Chariow.',
                correction:
                  'Ouvre une fenêtre de navigation privée pour voir le parcours d’un nouveau client.',
              },
            ],
            tips: [
              'Si la livraison n’a pas pu être testée, relis ton guide et ton message après achat avant ta première vente.',
            ],
          },
        },
      ],
    },
  ],
};
