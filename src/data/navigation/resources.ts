import type { ResourceCategoryItem } from '../../types/navigation';

export const RESOURCE_CATEGORIES: ResourceCategoryItem[] = [
  {
    id: 'fiches-pratiques',
    title: 'Fiches Pratiques Canoniques (Architecture, Conception & Vente)',
    description:
      'Les 10 fiches de synthèse opérationnelles pour guider chaque étape du parcours V2, de l’analyse de document à la livraison Chariow.',
    items: [
      {
        id: 'fiche-01-analyse-document',
        title: 'Fiche 01 : Analyse de document et potentiel interactif',
        format: 'Markdown',
        description:
          'Méthode pour explorer son document source (guide PDF, tableur, méthode), extraire la matière brute et repérer les zones de friction à transformer en interactions.',
        downloadFilename: 'fiche-01-analyse-document.md',
        content: `# Fiche 01 : Analyse de Document et Potentiel Interactif

## 1. Explorer et inventorier son document source
- Identifiez les parties purement descriptives (à conserver en texte clair) et les blocs fonctionnels (règles de calcul, listes à cocher, étapes chronologiques, grilles de diagnostic).
- Repérez la friction manuelle : où l'utilisateur d'un document statique doit-il sortir une calculatrice, imprimer une page ou faire un tri manuel ?

## 2. Matrice de transformation Document-First
- **Texte théorique** -> Accordéons ou cartes synthétiques dépliables.
- **Formule ou barème chiffré** -> Calculateur interactif avec curseurs réactifs.
- **Processus séquentiel** -> Hub de parcours ou guide étape par étape avec indicateur de progression.
- **Checklist statique** -> Cases à cocher interactives avec compteur d'accomplissement mémorisé.`,
      },
      {
        id: 'fiche-02-quatre-modeles',
        title: 'Fiche 02 : Les 4 modèles de produits interactifs',
        format: 'Markdown',
        description:
          'Présentation détaillée des 4 architectures structurées (Calculateur interactif, Hub de parcours, Guide quotidien, Page de marque interactive) et du Choix libre.',
        downloadFilename: 'fiche-02-quatre-modeles.md',
        content: `# Fiche 02 : Les 4 Modèles de Produits Interactifs

Le cursus AI CREATOR Studio propose 4 modèles d'architecture de départ (définis dans \`src/data/productModels.ts\`) complétés par une option de conception libre :

### 1. Calculateur interactif (\`interactive-calculator\`)
- **Pour quel document** : Tableaux chiffrés, grilles tarifaires, simulateurs financiers, barèmes de devis ou règles logiques.
- **Mécanismes clés** : Curseurs et entrées numériques, calcul instantané côté navigateur sans rechargement, tableau de bord de 3 KPIs avec jauges, alertes contextuelles selon les seuils.

### 2. Hub de parcours (\`journey-hub\`)
- **Pour quel document** : Syllabus de formation, programmes d'onboarding, méthodes pas-à-pas, feuilles de route opérationnelles.
- **Mécanismes clés** : Arborescence séquentielle de jalons, déblocage progressif, fiches récapitulatives avec livrables, checklists mémorisées localement.

### 3. Guide quotidien (\`daily-guide\`)
- **Pour quel document** : Défis (ex. 30 jours), rituels d'exercices, routines de travail, plans d'action quotidiens.
- **Mécanismes clés** : Sélecteur de timeline jour par jour, consigne de mission courte (15 min), journal de bord personnel, compteur de régularité (streak).

### 4. Page de marque interactive (\`interactive-brand-page\`)
- **Pour quel document** : Catalogues de services, portfolios, chartes professionnelles, offres d'accompagnement sur-mesure.
- **Mécanismes clés** : Section hero immersive avec promesse claire, configurateur de profil ou de besoin en 2 questions, vitrine personnalisée, bouton d'action direct qualifié.

### 5. Choix libre (architecture personnalisée) (\`custom-architecture\`)
- **Pour quel document** : Concepts hybrides ou méthodologies propriétaires combinant plusieurs logiques.
- **Mécanismes clés** : Architecture sur-mesure définie librement dans le brief fonctionnel de l'apprenant.`,
      },
      {
        id: 'fiche-03-direction-artistique',
        title: 'Fiche 03 : Direction artistique propre pour votre produit',
        format: 'Markdown',
        description:
          'Règles pour choisir une palette harmonieuse, des typographies lisibles et des contrastes conformes WCAG AA sans copier la charte du Studio.',
        downloadFilename: 'fiche-03-direction-artistique.md',
        content: `# Fiche 03 : Direction Artistique Propre pour Votre Produit

## 1. Principe d'indépendance graphique
Votre produit s'adresse à votre marché : il ne doit pas reprendre les couleurs Néo-Brutalistes Rouge Brique et Crème d'AI CREATOR Studio. Vous définirez votre propre univers au Jour 4.

## 2. Les 4 teintes fondamentales
- **Fond de page** : Teinte douce, claire et reposante (ex. écru, ardoise très claire, sable).
- **Surface des cartes** : Blanc pur ou teinte contrastée pour faire ressortir les blocs interactifs.
- **Accentuation (CTA)** : Couleur vive et franche réservée aux boutons d'action et indicateurs actifs.
- **Encre de texte** : Teinte très sombre (noir chaud, gris anthracite profond) garantissant un contraste supérieur à 4.5:1 (norme WCAG AA).

## 3. Typographie et ergonomie mobile
- Taille de texte minimale de 15px pour la lecture mobile courante.
- Hauteur de clic minimale de 44px pour chaque bouton ou zone tactile.`,
      },
      {
        id: 'fiche-04-master-prompt',
        title: 'Fiche 04 : Le Master Prompt Claude',
        format: 'Markdown',
        description:
          'Structure en balises XML du prompt directeur utilisé au Jour 5 pour générer l’application autonome complète avec Claude.',
        downloadFilename: 'fiche-04-master-prompt.md',
        content: `# Fiche 04 : Le Master Prompt Claude

## Structure canonique en balises XML
Un prompt de création d'application interactive doit structurer rigoureusement les instructions pour éviter les hallucinations et les omissions :

1. \`<role>\` : Définit la posture de Claude (expert front-end UI/UX et formateur méthodologique).
2. \`<context>\` : Injecte le domaine de l'apprenant, l'acheteur cible, le modèle interactif choisi et les règles métier issues du document source.
3. \`<design_tokens>\` : Précise les codes couleurs hexadécimaux, polices de caractères, arrondis et niveau de densité confirmés dans le dossier.
4. \`<functional_specs>\` : Décrit les champs d'entrées, formules de calcul, étapes et sorties attendues.
5. \`<technical_constraints>\` : Impose un fichier unique HTML5/CSS/JS standard, sans backend, avec persistance localStorage sécurisée par \`try/catch\`.
6. \`<output_format>\` : Exige le code source complet prêt à l'emploi.`,
      },
      {
        id: 'fiche-05-iteration-claude',
        title: 'Fiche 05 : Méthode d’itération et correction avec Claude',
        format: 'Markdown',
        description:
          'Guide pour dialoguer efficacement avec Claude lors de la phase d’amélioration : ajustements ciblés, correction de bugs et ajout de composants.',
        downloadFilename: 'fiche-05-iteration-claude.md',
        content: `# Fiche 05 : Méthode d'Itération et Correction avec Claude

## 1. La règle d'un ajustement à la fois
Ne demandez pas 10 changements simultanés dans un même message. Procédez par étapes ordonnées :
1. Valider d'abord le fonctionnement des calculs et de la logique métier.
2. Ajuster ensuite l'ergonomie, les espacements et les libellés.
3. Peaufiner enfin les détails visuels et les contrastes.

## 2. Comment signaler un bug à Claude
- Décrivez exactement l'action effectuée : « Lorsque je saisis la valeur 20 dans le curseur X... »
- Précisez le résultat obtenu vs le résultat attendu : « Le résultat affiche NaN au lieu de calculer 1 200 € ».
- Fournissez l'erreur console exacte si le navigateur en signale une.`,
      },
      {
        id: 'fiche-06-tests-produit',
        title: 'Fiche 06 : Protocole de tests produit et robustesse',
        format: 'Markdown',
        description:
          'Checklist méthodique pour vérifier le comportement sur smartphone, le mode hors ligne et la sécurité du stockage local.',
        downloadFilename: 'fiche-06-tests-produit.md',
        content: `# Fiche 06 : Protocole de Tests Produit et Robustesse

## 1. Test responsive sur mobile (largeur 375px)
- Ouvrez les outils de développement de votre navigateur (Touche F12 ou clic droit > Inspecter).
- Activez la vue mobile et sélectionnez une largeur standard de 375px (iPhone SE / format standard).
- Vérifiez qu'aucun défilement horizontal parasite n'apparaît et que chaque bouton fait au moins 44px de hauteur.

## 2. Test du mode hors-ligne
- Coupez votre connexion internet (ou basculez sur l'état « Offline » dans l'onglet Network).
- Vérifiez que les calculs, tris et sélecteurs continuent de réagir instantanément.

## 3. Sécurisation du stockage LocalStorage
- Encapsulez chaque lecture et écriture dans un bloc \`try { ... } catch (e) { ... }\`.
- Testez l'ouverture en navigation privée pour vous assurer qu'aucune exception ne bloque l'interface.`,
      },
      {
        id: 'fiche-07-export-html',
        title: 'Fiche 07 : Export HTML autonome (CSS/JS intégrés)',
        format: 'Markdown',
        description:
          'Règles pour exporter un fichier HTML autonome intégrant l’ensemble de ses styles et scripts, prêt pour l’hébergement statique. [Statut : Procédure à confirmer par test]',
        downloadFilename: 'fiche-07-export-html.md',
        content: `# Fiche 07 : Export HTML Autonome (CSS/JS Intégrés)

> **Statut : Procédure à confirmer par test** (à valider sur votre propre environnement de déploiement).

## 1. Architecture d'un fichier autonome
Pour que l'outil fonctionne de manière fiable sur n'importe quel ordinateur ou smartphone sans installation logicielle complexe, l'ensemble du code doit être regroupé dans un fichier unique \`index.html\` :
- Balise \`<style>\` interne regroupant toutes les règles CSS, variables de couleurs et styles responsive.
- Balise \`<script>\` standard intégrant toute la logique JavaScript (fonctions de calcul, gestionnaires d'événements, sauvegarde locale).
- Polices de caractères système ou polices web chargées avec repli propre.

## 2. Absence de dépendance serveur
Le fichier doit pouvoir être ouvert aussi bien directement dans un navigateur via double-clic qu'hébergé sur un serveur statique HTTPS.`,
      },
      {
        id: 'fiche-08-publication-netlify',
        title: 'Fiche 08 : Publication sur Netlify Drop',
        format: 'Markdown',
        description:
          'Guide pour publier son fichier HTML sur Netlify Drop et réclamer le site avec son compte gratuit pour obtenir une URL HTTPS pérenne. [Statut : Procédure à confirmer par test]',
        downloadFilename: 'fiche-08-publication-netlify.md',
        content: `# Fiche 08 : Publication sur Netlify Drop

> **Statut : Procédure à confirmer par test** (les conditions et interfaces des hébergeurs tiers évoluent régulièrement).

## 1. Déploiement par glisser-déposer
1. Rendez-vous sur l'interface de dépôt statique Netlify Drop (\`app.netlify.com/drop\`).
2. Déposez votre dossier contenant votre fichier \`index.html\`.
3. Netlify déploie immédiatement le site et attribue une adresse web sécurisée (HTTPS) aléatoire.

## 2. Réclamer son site (Claim) avec un compte gratuit
- **Recommandation critique** : Créez au préalable un compte Netlify gratuit et connectez-vous.
- Lorsque vous déposez un projet en étant connecté, le site est rattaché à votre compte sans risque d'expiration.
- Personnalisez le sous-domaine dans les paramètres du site (ex. \`votre-outil.netlify.app\`) pour une URL propre à partager dans votre guide d'accès.`,
      },
      {
        id: 'fiche-09-pdf-acces',
        title: 'Fiche 09 : PDF d’accès client généré par Claude',
        format: 'Markdown',
        description:
          'Comment rédiger et mettre en page avec Claude un document d’accès élégant remis à vos clients après achat, sans outil tiers. [Statut : Procédure à confirmer par test]',
        downloadFilename: 'fiche-09-pdf-acces.md',
        content: `# Fiche 09 : PDF d'Accès Client Généré par Claude

> **Statut : Procédure à confirmer par test** (à adapter selon les consignes spécifiques de votre produit).

## 1. Rôle du document d'accès
Le document d'accès est le livrable officiel remis à l'acheteur final lors de sa commande sur Chariow. Il remplace avantageusement une archive ZIP souvent difficile à décompresser sur smartphone.

## 2. Contenu indispensable du document
- **Titre du produit** et confirmation de la commande.
- **Lien direct cliquable (HTTPS)** vers votre application interactive hébergée en ligne.
- **Code d'accès éventuel** (si vous avez configuré une protection par code dans l'application).
- **Mode d'emploi en 3 étapes** pour utiliser l'outil et enregistrer ses données.
- **Contact d'assistance** (adresse e-mail de support).

## 3. Génération directe avec Claude
Demandez à Claude de rédiger le contenu complet au format document ou page imprimable HTML stylisée, prête à être enregistrée en PDF via la commande Imprimer > Enregistrer au format PDF de votre navigateur.`,
      },
      {
        id: 'fiche-10-livraison-chariow',
        title: 'Fiche 10 : Configuration de la livraison sur Chariow',
        format: 'Markdown',
        description:
          'Étapes pour configurer un produit de type « Fichiers », uploader le PDF d’accès et renseigner les instructions après achat. [Statut : Procédure à confirmer par test]',
        downloadFilename: 'fiche-10-livraison-chariow.md',
        content: `# Fiche 10 : Configuration de la Livraison sur Chariow

> **Statut : Procédure à confirmer par test** (d'après le Centre d'aide Chariow, articles officiels 68af1f08f62cc186f76fa970 et 68b18efa57eacfedfebe86d4).

## 1. Création d'un produit de type « Fichiers »
1. Dans le tableau de bord Chariow, accédez au menu **Produits** > **Créer un nouveau produit**.
2. Choisissez la carte **Fichiers** et cliquez sur **Continuer**.
3. Renseignez le nom commercial, la catégorie et le modèle de tarification (paiement unique ou prix promotionnel).

## 2. Déposer le livrable et configurer l'accès
- **Contenu du produit** : Uploadez votre guide d'accès PDF généré avec Claude.
- **Instructions après achat (Onglet Informations)** : Rédigez le message affiché immédiatement à l'acheteur dès la confirmation du paiement, contenant le lien direct et la consigne de téléchargement du PDF.
- **Accès acheteur** : Les clients retrouvent leurs achats et fichiers téléchargeables sur leur espace client.`,
      },
    ],
  },
  {
    id: 'templates-code',
    title: 'Prototypes & Démonstrations de Référence',
    description:
      'Comparez le support statique initial et le produit interactif témoin autonome.',
    items: [
      {
        id: 'demo-pdf-to-hub-apres',
        title: 'Produit Témoin : Hub Interactif Autonome (Exemple fictif)',
        format: 'HTML autonome',
        description:
          'Prototype de référence du Module 02 : identité visuelle propre (Ardoise & Émeraude), calculateur en direct, checklist et sauvegarde locale.',
        url: '/demos/pdf-to-hub/apres-hub-interactif.html',
      },
      {
        id: 'demo-pdf-to-hub-avant',
        title: 'Matériau de départ : Guide PDF Statique (Exemple fictif)',
        format: 'HTML de lecture',
        description:
          'Exemple pédagogique fictif simulant un guide PDF de 5 pages pour illustrer l’extraction de la matière brute.',
        url: '/demos/pdf-to-hub/avant-pdf-statique.html',
      },
    ],
  },
  {
    id: 'checklists-vente',
    title: 'Checklists de Validation & Pré-Lancement',
    description:
      'Listes de contrôle pour vérifier votre produit interactif, votre document d’accès et votre fiche Chariow avant publication.',
    items: [
      {
        id: 'checklist-pre-lancement',
        title: 'Checklist : Contrôle qualité avant publication sur Chariow',
        format: 'Markdown',
        description:
          'Validation des interactions, du rendu mobile 375px, du document d’accès PDF et des options Chariow.',
        downloadFilename: 'checklist-pre-lancement.md',
        content: `# Checklist de Contrôle Qualité Avant Mise en Vente

- [ ] Les calculs, diagnostics et interactions fonctionnent sans erreur dans le navigateur
- [ ] L'affichage a été testé et validé sur écran mobile (375px de large)
- [ ] L'accès au stockage local est protégé par try / catch
- [ ] L'outil est déployé sur une URL HTTPS stable sur Netlify Drop
- [ ] Le produit possède sa propre identité visuelle (adaptée à votre audience)
- [ ] Le document d'accès PDF contient le lien HTTPS direct, les consignes et le contact support
- [ ] La fiche produit de type « Fichiers » est configurée sur Chariow avec ses instructions après achat`,
      },
    ],
  },
];
