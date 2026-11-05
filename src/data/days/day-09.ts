import type { Day } from '../../types/course';

export const day09: Day = {
  id: 'day-09',
  dayNumber: 9,
  sprintId: 'module-03',
  title: 'PRÉSENTER ET PROMOUVOIR SON PRODUIT',
  italicTitleWord: 'PROMOUVOIR',
  objective:
    "Construire votre premier kit de promotion centré sur la démonstration concrète de votre produit en action : un script de vidéo courte (Reel / TikTok), un carrousel pédagogique et une publication claire orientant vers votre boutique Chariow.",
  deliverableSummary:
    'Kit promotionnel complet : script de démonstration, carrousel et publication de vente',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-09-step-1',
      type: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: 'La démonstration produit comme levier de vente honnête',
      completionLabel: "Valider l'étape 1 : Comprendre",
      blocks: [
        {
          id: 'day09-step1-product-demo',
          type: 'prose',
          eyebrow: '1.1 MONTRER PLUTÔT QUE PROMETTRE',
          title: 'Pourquoi la démonstration visuelle est votre meilleur argument',
          highlightPill: 'Problème vécu -> Saisie en direct -> Résultat immédiat -> Appel à l’action',
          paragraphs: [
            "L'avantage majeur d'un produit digital interactif au moment de la promotion est qu'il se montre en action. Là où un document classique oblige souvent à décrire longuement une promesse abstraite, vous pouvez filmer votre écran pendant 30 secondes pour montrer comment une saisie concrète produit instantanément un résultat utile.",
            "Aucune promesse de viralité ni aucun artifice publicitaire ne remplace la clarté d'une démonstration. Vos contenus de lancement reposent sur 4 briques :",
          ],
          bullets: [
            "1. L'accroche orientée problème (Hook) : nommez dès la première phrase la situation précise où votre acheteur bloque (identifiée à la Leçon 01) en utilisant son vrai vocabulaire (Leçon 02).",
            "2. Le contraste d'usage : montrez brièvement pourquoi la méthode manuelle habituelle (calcul à la main, tableur confus, notes dispersées) fait perdre du temps ou génère des erreurs.",
            "3. La démonstration en direct de votre produit : montrez l'écran de votre outil (sur téléphone ou ordinateur), modifiez 1 ou 2 valeurs et laissez le spectateur voir le diagnostic, le calcul ou le plan s'afficher instantanément.",
            "4. L'appel à l'action clair (CTA) : indiquez une seule action simple pour accéder à la fiche Chariow (lien en bio, lien direct dans la publication ou mot-clé en commentaire si vous utilisez le Bonus ManyChat).",
          ],
        },
        {
          id: 'day09-step1-three-formats',
          type: 'prose',
          eyebrow: '1.2 LES 3 CONTENUS FONDAMENTAUX DE VOTRE KIT DE LANCEMENT',
          title: 'Script vidéo courte, Carrousel et Publication écrite',
          paragraphs: [
            "Pour lancer votre produit sans vous disperser, préparez trois formats complémentaires adaptés aux habitudes de consommation de votre audience :",
          ],
          bullets: [
            "Format 1 : Le Script de Reel / TikTok / Short (30 à 45 secondes) : filmé en capture d'écran mobile ou face caméra avec incrustation de l'outil. Structure : Accroche (0-3s) -> Friction manuelle (3-10s) -> Démonstration de l'outil en 3 clics (10-35s) -> Appel à l'action (35-45s).",
            "Format 2 : Le Carrousel pédagogique (6 à 8 slides) : Slide 1 (Titre problème) -> Slide 2 (Pourquoi la méthode habituelle bloque) -> Slides 3 à 5 (Explication de votre mécanisme et captures d'écran d'un cas concret dans l'outil) -> Slide 6 (Récapitulatif de ce que contient l'outil) -> Slide 7 (Appel à l'action).",
            "Format 3 : La Publication commerciale directe (Post écrit / Message de lancement) : un texte structuré présentant le problème, la genèse de l'outil, un exemple concret de résultat obtenu, le détail de l'offre (avec le tarif de lancement) et le lien direct vers votre page Chariow.",
          ],
        },
        {
          id: 'day09-step1-callout-honesty',
          type: 'callout',
          variant: 'important',
          title: 'Intégrité marketing : zéro faux témoignage, zéro statistique inventée',
          content:
            "Lors d'un premier lancement, vous n'avez pas encore des centaines d'avis clients : c'est parfaitement normal. Ne fabriquez jamais de faux témoignages ni de statistiques inventées. Montrez le fonctionnement réel de votre outil sur un cas pratique transparent : la preuve par la démonstration suffit à convaincre les acheteurs concernés par le problème.",
        },
      ],
    },
    {
      id: 'day-09-step-2',
      type: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: 'Générer votre kit promotionnel de lancement sur mesure',
      completionLabel: "Valider l'étape 2 : Prompt Claude",
      blocks: [
        {
          id: 'day09-step2-master-prompt',
          type: 'prompt-builder',
          title: 'Compilateur du Prompt de Kit Promotionnel de Lancement (Leçon 09)',
          description:
            "Utilisez ce prompt dans Claude pour générer votre script vidéo de démonstration, votre carrousel et votre publication de lancement alignés avec votre fiche Chariow.",
          deliverableTarget: 'sales-copy',
          fields: [
            {
              key: 'business',
              label: "Votre domaine d'expertise",
              placeholder: 'Ex. Conseil RH, Gestion financière, Productivité...',
              profileBinding: 'business',
            },
            {
              key: 'targetAudience',
              label: 'Votre audience cible',
              placeholder: 'Ex. Consultants indépendants, Dirigeants de PME...',
              profileBinding: 'targetAudience',
            },
            {
              key: 'productType',
              label: 'Nom et format de votre produit interactif',
              placeholder: 'Ex. Le Système de Création Régulière (Calculateur & Plan 30 jours)',
              profileBinding: 'productType',
            },
            {
              key: 'mainObjective',
              label: 'Action concrète démontrée à l’écran',
              placeholder: 'Ex. Calculer ses heures disponibles et obtenir son plan éditorial en 30 secondes',
              profileBinding: 'mainObjective',
            },
          ],
          template: `<role>
Tu es un concepteur de contenu et stratège de lancement produit spécialisé dans les démonstrations concrètes d'outils interactifs.
Tu conçois des contenus sobres, rythmés et directement compréhensibles par l'acheteur final.
Tu refuses tout jargon artificiel d'IA, toute fausse urgence, toute statistique inventée et toute promesse de gains garantis.
</role>

<context>
Je prépare le lancement de mon produit digital interactif :
- Domaine d'expertise : {{business}}
- Public cible : {{targetAudience}}
- Nom du produit : {{productType}}
- Action clé démontrée : {{mainObjective}}
</context>

<consignes_de_redaction>
Génère pour moi ces 3 contenus de lancement prêts à l'emploi :
1. UN SCRIPT DE VIDÉO COURTE (Reel / TikTok, 35-45s) :
   - Indique précisément le découpage temporel et les consignes visuelles (ce que l'on montre à l'écran).
   - Accroche percutante orientée sur le problème sans verbiage.
   - Saisie en direct dans l'outil et résultat obtenu.
   - Appel à l'action sobre vers le lien Chariow.

2. UN PLAN DE CARROUSEL PÉDAGOGIQUE (7 slides) :
   - Slide 1 : Titre problème engageant
   - Slide 2 : Le blocage rencontré avec les approches traditionnelles
   - Slides 3 à 5 : La logique de résolution avec captures d'écran de l'outil
   - Slide 6 : Le récapitulatif de ce que l'acheteur obtient
   - Slide 7 : Appel à l'action

3. UNE PUBLICATION ÉCRITE DE LANCEMENT :
   - Texte pour LinkedIn, Instagram ou e-mail annonçant la disponibilité de l'outil.
   - Présentation factuelle de la valeur d'usage et mention du tarif de lancement.
   - Sans tirets cadratins dans les textes générés.
</consignes_de_redaction>`,
        },
      ],
    },
    {
      id: 'day-09-step-3',
      type: 'your-turn',
      number: 3,
      title: 'Assembler et promouvoir',
      subtitle: 'Exemple de script et validation de son kit de promotion',
      completionLabel: "Valider le Module 03 : Kit promotionnel prêt",
      blocks: [
        {
          id: 'day09-step3-promo-example',
          type: 'prose',
          eyebrow: '3.1 DÉMONSTRATION D’UN SCRIPT COURT (CAS D’ÉCOLE)',
          title: 'Exemple de script Reel (40s) centré sur l’usage',
          paragraphs: [
            "Voici comment un produit interactif est présenté en vidéo courte sans aucune surpromesse :",
          ],
          bullets: [
            "0-3s [Accroche] : Visuel sur l'agenda chargé d'un indépendant. Voix : « Pourquoi votre planning saute dès que vous signez un nouveau client ? »",
            "3-10s [Friction] : Visuel sur une formule de calcul manuelle sur carnet. Voix : « Parce qu'on vous donne souvent des rythmes théoriques fixes sans tenir compte de vos heures facturables réelles. »",
            "10-32s [Démonstration de l'outil] : Capture d'écran mobile de l'outil interactif. Le doigt sélectionne un profil et saisit les heures de la semaine. Le résultat s'ajuste instantanément. Voix : « J'ai transformé ma méthode en un outil interactif : vous entrez vos heures, il calcule votre capacité réelle et vous donne votre plan d'action immédiatement. »",
            "32-40s [Appel à l'action] : Visuel de la page produit Chariow. Voix : « L'outil est disponible avec son tarif d'accès de lancement. Le lien direct est dans ma bio, ou commentez OUTIL pour le recevoir en message privé. »",
          ],
        },
        {
          id: 'day09-checklist',
          type: 'checklist',
          title: 'Critères de validation observables (Leçon 09)',
          description:
            'Vérifiez ces 4 points avant de publier vos premiers contenus et de passer aux Bonus.',
          items: [
            {
              id: 'chk-d09-real-demo',
              label: 'Démonstration réelle de l’outil au cœur des contenus',
              detail:
                'Le script et le carrousel montrent concrètement le passage d’une saisie utilisateur au résultat dans votre produit.',
            },
            {
              id: 'chk-d09-audience-vocab',
              label: 'Accroche formulée avec le vocabulaire réel de l’acheteur',
              detail:
                'Aucun jargon d’IA : l’accroche décrit la situation précise identifiée au Module 01.',
            },
            {
              id: 'chk-d09-no-fake-proof',
              label: 'Zéro faux témoignage et zéro promesse financière',
              detail:
                'Les arguments reposent exclusivement sur l’utilité vérifiable de l’outil.',
            },
            {
              id: 'chk-d09-clear-cta',
              label: 'Appel à l’action unique et fonctionnel',
              detail:
                'Chaque contenu oriente clairement vers votre lien Chariow (ou vers le mot-clé DM configuré avec le Bonus ManyChat).',
            },
          ],
        },
      ],
    },
  ],
};
