# Architecture Pédagogique V2 : AI CREATOR Studio

## 1. Vision Produit et Approche Document-First

**AI CREATOR Studio** enseigne à utiliser **Claude** pour convertir un document existant (guide PDF, ebook, tableur, grille de calcul, workbook ou notes méthodologiques) en une application interactive autonome, hébergée sur le web et commercialisée sur Chariow.

### 1.1 Principe fondamental : Document-First
- **Aucun départ d'une page blanche** : Chaque apprenant arrive avec sa matière première existante. Le cours n'enseigne pas à inventer un sujet spéculatif ou une promesse fictive, mais à extraire l'expertise déjà consignée dans un document pour éliminer les frictions de lecture passive.
- **Résultat final concret** : L'apprenant crée une application interactive autonome dans un fichier unique (HTML5, CSS et JavaScript), la déploie sur le web via Netlify Drop (avec URL HTTPS stable), génère un guide d'accès client au format PDF avec Claude (sans outil tiers comme Canva), et configure la vente sur Chariow via un produit de type « Fichiers » avec instructions après achat.
- **Propriété intellectuelle et indépendance graphique** : L'apprenant conçoit son propre outil, pour son audience et dans son domaine professionnel. Il ne reproduit jamais la charte Néo-Brutaliste du Studio (Rouge Brique `#B63131`, Vieux Rose `#E6A0A8`, Crème `#FAF6F0`). Le choix de sa direction artistique intervient au Jour 4, lors de la conception de l'expérience utilisateur.

### 1.2 Distinction Apprenant vs Acheteur Final
- L'**apprenant** est le créateur, formateur, consultant ou expert qui suit le cursus sur AI CREATOR Studio.
- L'**acheteur final** est le client qui achètera le produit interactif sur la boutique Chariow de l'apprenant et l'utilisera dans son navigateur web.

### 1.3 Pertinence fonctionnelle de l'interactivité
- Les PDF, ebooks et documents statiques conservent toute leur pertinence pour la lecture linéaire, l'assimilation conceptuelle ou l'archivage.
- L'interactivité apporte une valeur distinctive mesurable uniquement lorsqu'elle élimine une friction active : calculs automatisés, diagnostic de situation, sélection personnalisée, planification séquentielle ou mémorisation de progression.

---

## 2. Déontologie, Épistémologie et Éthique

### 2.1 Discipline épistémique dans le pilotage de Claude
Chaque consigne et chaque prompt fourni dans le parcours astreint Claude à distinguer :
1. **Les faits observables et documentés** : Données textuelles, formules ou tableaux explicitement présents dans le document source de l'élève.
2. **Les déductions mécaniques** : Conséquences logiques directes des formats ou des règles de calcul.
3. **Les hypothèses de travail** : Besoins supposés de l'audience, objections anticipées ou estimations de prix, devant être impérativement étiquetées comme telles tant qu'une confrontation au marché réel n'a pas eu lieu.

### 2.2 Rejet absolu des promesses de gains et faux chiffres
- Tout chiffre d'affaires ou tarif mentionné dans les exemples constitue une **illustration didactique** ou une **projection de planification**, jamais une garantie de résultat.
- Interdiction formelle de promouvoir de faux témoignages, de fausses statistiques de marché (« 90 % des gens... ») ou des affirmations de revenus garantis.

---

## 3. Structure du Cursus : 3 Modules, 9 Leçons et 2 Bonus

Le parcours abandonne l'ancienne arborescence de 25 jours théoriques pour se concentrer sur **9 leçons orientées livrable**, découpées en 3 modules progressifs et complétées par 2 bonus opérationnels.

### Sobriété pédagogique : 3 étapes maximum par journée
Chaque journée s'organise avec souplesse autour de **3 étapes maximum** articulées autour d'une tâche ciblée (*un prompt = une tâche*) :
1. **Comprendre & Préparer** : Analyse du document source, extraction de la logique métier et repérage des cas limites.
2. **Créer avec Claude** : Exécution d'un prompt structuré injectant le contexte du dossier de projet pour produire la version du livrable.
3. **Valider & Enregistrer** : Contrôle qualité par critères observables et intégration dans le champ correspondant du Dossier de Projet.

---

## 4. Programme Détaillé des 9 Leçons

### MODULE 01 : L'OPPORTUNITÉ ET LE POSITIONNEMENT (`module-01`)
*Objectif : Transformer la matière brute du document en un positionnement orienté problème et une promesse de valeur crédible.*

- **Leçon 01 : Analyser son document et identifier son potentiel interactif (`day-01`)**
  - *Périmètre* : Importer et explorer son document source ; extraire les blocs informatifs et les règles fonctionnelles ; identifier le potentiel interactif (points où l'acheteur bénéficie d'un calcul, tri ou suivi).
  - *Livrable* : Matrice de transformation du document (champs `documentAnalysis`, `essentialContents`, `interactivePotential`).
- **Leçon 02 : Comprendre son acheteur et le problème (`day-02`)**
  - *Périmètre* : Cartographier la situation de l'acheteur final, ses blocages concrets et ses habitudes ; séparer strictement les faits attestés des hypothèses à valider (questions type *The Mom Test*).
  - *Livrable* : Fiche acheteur et problème prioritaire (champs `buyerProfile`, `priorityProblem`).
- **Leçon 03 : Définir la solution et la promesse (`day-03`)**
  - *Périmètre* : Définir le résultat attendu, le mécanisme de résolution interactif et la proposition de valeur face aux alternatives existantes (papier, tableur, lecture passive) ; promesse vérifiable sans garantie financière imaginaire.
  - *Livrable* : Promesse de transformation (champ `solutionPromise`).

---

### MODULE 02 : CONCEVOIR ET CRÉER AVEC CLAUDE (`module-02`)
*Objectif : Transformer le brief en une application interactive autonome fonctionnelle, testée et publiée sur le web.*

- **Leçon 04 : Concevoir l'expérience interactive (`day-04`)**
  - *Périmètre* : Choisir son modèle interactif parmi les 4 modèles structurés du studio (`interactive-calculator`, `journey-hub`, `daily-guide`, `interactive-brand-page`) ou l'architecture sur-mesure (`custom-architecture`) ; organiser le parcours et les fonctionnalités ; définir l'identité visuelle propre (palette, polices, contrastes WCAG AA) et tester la maquette locale.
  - *Livrable* : Brief complet et identité de produit (champs `productIdentity`, `chosenProductModel`, `functionalBrief`, `artisticDirection`).
- **Leçon 05 : Créer son application avec Claude (`day-05`)**
  - *Périmètre* : Préparer l'environnement de génération ; compiler le Master Prompt XML complet ; piloter Claude pour obtenir le code HTML5/CSS/JS standard autonome ; examiner le résultat et itérer chirurgicalement sur les calculs et l'ergonomie.
  - *Livrable* : Première version fonctionnelle du produit interactif (champs `creationPrompt`, `applicationState`).
- **Leçon 06 : Personnaliser, tester et publier (`day-06`)**
  - *Périmètre* : Tester la réactivité mobile (375px), les calculs et la tolérance du stockage local (encapsulation `try/catch`) ; exporter le code en fichier HTML autonome ; publier gratuitement sur Netlify Drop avec compte pour obtenir une URL HTTPS stable et pérenne.
  - *Livrable* : Application en ligne testée et accessible (champ `publishedUrl`).

---

### MODULE 03 : VENDRE ET PROMOUVOIR (`module-03`)
*Objectif : Construire l'offre commerciale, configurer la livraison sur Chariow et préparer les contenus de lancement.*

- **Leçon 07 : Construire son offre (`day-07`)**
  - *Périmètre* : Définir ce que reçoit exactement l'acheteur (accès web sécurisé mobile/desktop, guide d'utilisation) ; formuler son hypothèse de prix (paliers de lancement et tarif de référence comme repères de planification) ; rédiger l'offre et les conditions de support.
  - *Livrable* : Offre commerciale structurée (champs `commercialOffer`, `pricingConditions`).
- **Leçon 08 : Créer la livraison et vendre sur Chariow (`day-08`)**
  - *Périmètre* : Générer avec Claude un guide d'accès client élégant au format PDF (sans Canva) contenant le lien HTTPS direct, les consignes d'utilisation et le support ; configurer la fiche produit de type « Fichiers » sur Chariow ; renseigner les instructions après achat et tester le parcours complet.
  - *Livrable* : Parcours d'achat et de livraison configuré (champs `accessPdf`, `chariowSheet`).
- **Leçon 09 : Présenter et promouvoir (`day-09`)**
  - *Périmètre* : Choisir l'action clé à démontrer à l'écran (passage d'une entrée confuse à un résultat immédiat) ; concevoir les accroches et les scripts de démonstration (vidéo 30-60s, carrousel étape par étape) ; planifier le calendrier de lancement.
  - *Livrable* : Kit promotionnel de lancement (champ `promotionalContent`).

---

## 5. Les Bonus Indépendants

### Bonus 01 : Le Système ManyChat Automatisé avec Claude (`bonus-manychat`)
Automatisation DM Instagram en 5 étapes rigoureusement conforme aux règles de l'API Meta :
1. Déclencheur sur commentaire de mot-clé (activé uniquement sur le 1er commentaire par utilisateur).
2. Premier message privé (Private Reply) contenant une question fermée et une **Quick Reply d'interaction**.
3. Clic d'opt-in de l'utilisateur qui **ouvre la fenêtre réglementaire de 24 heures** (arrêt strict sans relance si pas de clic).
4. Qualification rapide et présentation ciblée pendant la fenêtre ouverte.
5. Bouton final orientant vers la fiche produit Chariow.

### Bonus 02 : Marketing Library (`bonus-marketing`)
Bibliothèque prête à l'emploi avec variables d'adaptation `[NOM DU PRODUIT]` :
- 20 structures d'accroches (Hooks) pour Reels et TikTok classées en 4 catégories.
- 5 structures de carrousels pédagogiques complets slide par slide.
- 3 séquences d'emails de lancement factuelles et sobres.
- Modèles de messages privés DM et réponses aux 4 objections majeures.
- 3 scripts de démonstration produit (30s, 60s et Stories).

---

## 6. Continuité et Dossier de Projet de l'Apprenant

Le parcours assure une continuité sans rupture grâce au **Dossier de Projet** (`src/types/dossier.ts`), structuré en 18 champs canoniques enregistrés dans le navigateur :
- Chaque exercice valide et alimente directement le champ correspondant du dossier.
- Les compilateurs de prompts réutilisent automatiquement les données validées (`{{dossier.analyse}}`, `{{dossier.acheteur}}`, `{{dossier.promesse}}`, etc.).
- L'apprenant peut à tout moment exporter son dossier en fichier JSON portable et le réimporter pour reprendre sa progression sur n'importe quel ordinateur ou navigateur.
