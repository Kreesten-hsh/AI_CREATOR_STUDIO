# PLAN DE PRODUCTION MÉDIA V2 : SCHÉMAS, CAPTURES ET VIDÉOS
## AI CREATOR Studio : Inventaire Opérationnel par Journée (Jours 01 à 09)

> **Statut** : Document de planification multimédia permanent.  
> **Périmètre** : Architecture V2 en 9 journées (3 modules) + Bonus.  
> **Règle de production** : Pas de vidéo décorative ni de capture d'écran générique. Chaque média illustre une action technique exacte ou un modèle conceptuel concret.

---

## 1. PRINCIPES DIRECTEURS DE PRODUCTION

1. **Format des vidéos** : Screencasts commentés courts (2 à 4 minutes maximum), focalisés sur une manipulation réelle, sans monologue de remplissage.
2. **Format des schémas** : Diagrammes Mermaid ou SVG vectoriels intégrés directement dans les composants de leçons (`DiagramBlock` / `ModelVisualizerBlock`).
3. **Format des captures d'écran** : Résolution standardisée (minimum 1280x720 ou 1920x1080), avec zones interactives ou encadrés d'attention sur les boutons réels.
4. **Indépendance visuelle** : Les démos d'applications élèves montrent des thèmes variés (ex. palette Slate-Emerald ou Warm-Bronze) et n'imposent jamais la charte de la plateforme.
5. **Statuts possibles** :
   - `prévu` : Média spécifié, en attente d'enregistrement ou de dessin vectoriel.
   - `enregistré` : Média produit brut, en cours de montage ou d'optimisation de format.
   - `intégré` : Fichier physique présent dans `public/` ou composant React rendu dans l'application.

---

## 2. INVENTAIRE OPÉRATIONNEL PAR JOURNÉE

### MODULE 1 : L'OPPORTUNITÉ ET LE POSITIONNEMENT

#### Jour 01 : Analyser son document et identifier son potentiel interactif
- **Asset ID : `SCH-J01-01` (Schéma - Priorité Haute)**
  - *Type* : Diagramme conceptuel (SVG / Mermaid).
  - *Objectif* : Visualiser les 3 couches d'un document (Structure linéaire vs Logique métier sous-jacente vs Données variables).
  - *Description* : Entonnoir montrant la transformation d'un document statique (PDF de 15 pages) en extraction de règles, puis en application interactive.
  - *Statut* : `prévu`.
- **Asset ID : `VID-J01-01` (Vidéo - Priorité Critique)**
  - *Type* : Démo vidéo commentée (Screencast).
  - *Durée cible* : 3 min 15 s.
  - *Objectif* : Montrer comment survoler et décomposer un document réel en 15 minutes chrono.
  - *Écran à montrer* : Double écran : PDF ouvert dans un lecteur à gauche, éditeur de texte / bloc-notes à droite.
  - *Script / Actions filmées* : 1) Défilement rapide pour repérer les sommaires et titres. 2) Identification d'un tableau à 3 colonnes et d'une formule de calcul. 3) Copie des passages clés dans le bloc-notes. 4) Remplissage de la matrice de transformation.
  - *Statut* : `prévu`.
- **Asset ID : `CAP-J01-01` (Capture d'écran)**
  - *Type* : Capture annotée.
  - *Objectif* : Montrer un exemple de document annoté avec les 4 types de matière première (règles, calculs, diagnostics, étapes).
  - *Statut* : `prévu`.

---

#### Jour 02 : Comprendre son acheteur et le problème prioritaire
- **Asset ID : `SCH-J02-01` (Schéma)**
  - *Type* : Matrice des 4 Forces du Changement (Bob Moesta / Rewired Group).
  - *Objectif* : Illustrer la tension Push (friction actuelle) + Pull (attrait de la nouveauté) vs Anxiété + Habitude.
  - *Description* : Balance dynamique montrant pourquoi l'acheteur n'agit pas tant que la friction n'est pas insoutenable.
  - *Statut* : `prévu`.
- **Asset ID : `VID-J02-01` (Vidéo)**
  - *Type* : Démo vidéo commentée.
  - *Durée cible* : 3 min 00 s.
  - *Objectif* : Remplir la fiche acheteur et isoler le problème prioritaire sans inventer de faux besoins.
  - *Écran à montrer* : Interface Claude avec le prompt de détection des frictions et le Dossier de Projet.
  - *Script / Actions filmées* : 1) Copier les verbatims d'un élève ou d'un client. 2) Lancer le prompt d'analyse d'irritants. 3) Valider le problème prioritaire dans le dossier.
  - *Statut* : `prévu`.

---

#### Jour 03 : Définir la solution et la promesse
- **Asset ID : `SCH-J03-01` (Schéma)**
  - *Type* : Schéma de positionnement April Dunford vs Value Proposition Canvas.
  - *Objectif* : Montrer le croisement entre les alternatives réelles (ce que fait le client aujourd'hui) et la promesse de transformation.
  - *Statut* : `prévu`.
- **Asset ID : `CAP-J03-01` (Capture d'écran)**
  - *Type* : Exemple comparatif avant / après d'une promesse floue (« Devenez plus productif ») transformée en promesse vérifiable (« Calculez votre charge hebdomadaire réelle et générez votre planning en 3 clics »).
  - *Statut* : `prévu`.

---

### MODULE 2 : CONCEVOIR ET CRÉER AVEC CLAUDE

#### Jour 04 : Concevoir l'expérience interactive
- **Asset ID : `SCH-J04-01` (Schéma - Priorité Critique)**
  - *Type* : Arbre visuel des 4 modèles canoniques de produits digitaux.
  - *Objectif* : Aider l'élève à orienter son document vers le bon modèle interactif :
    1. Calculateur interactif (chiffré, curseurs, résultats en direct).
    2. Hub de parcours (étapes guidées, modules, validation progressive).
    3. Guide quotidien (rituel, actions journalières, suivi de régularité).
    4. Page de marque interactive (vitrine, diagnostic d'entrée, prise de contact qualifiée).
  - *Statut* : `intégré` (composant `ModelVisualizerBlock` dans l'application).
- **Asset ID : `VID-J04-01` (Vidéo - Priorité Haute)**
  - *Type* : Screencast de structuration du brief fonctionnel.
  - *Durée cible* : 3 min 30 s.
  - *Objectif* : Rédiger le cahier des charges de son application en 3 écrans sans sur-ingénierie.
  - *Écran à montrer* : Dossier de projet (champ `functionalBrief`) et schéma de flux utilisateur.
  - *Script / Actions filmées* : 1) Définition de l'écran d'accueil (titre, promesse, saisie). 2) Définition de l'écran de traitement (calculs, diagnostic). 3) Définition de l'écran de résultat (plan d'action, bouton d'export).
  - *Statut* : `prévu`.
- **Asset ID : `CAP-J04-01` (Capture d'écran)**
  - *Type* : Sélecteur de direction artistique montrant les palettes et typographies pour l'application élève.
  - *Statut* : `prévu`.

---

#### Jour 05 : Créer son application avec Claude
- **Asset ID : `VID-J05-01` (Vidéo - Priorité Critique)**
  - *Type* : Screencast complet de session Claude avec Artifact.
  - *Durée cible* : 4 min 00 s.
  - *Objectif* : Observer la génération complète de l'application V1 dans Claude Artifacts, l'inspection du rendu et la première boucle d'itération.
  - *Écran à montrer* : Interface web Claude (`claude.ai`).
  - *Script / Actions filmées* : 1) Coller le Master Prompt XML assemblé depuis le Studio. 2) Observer l'ouverture automatique de l'Artifact interactif. 3) Tester un curseur et un bouton dans l'Artifact. 4) Demander un prompt d'ajustement ciblé à Claude (« Corrige le calcul du palier 2 et arrondis à l'entier »). 5) Constater la mise à jour immédiate de l'Artifact.
  - *Statut* : `prévu`.
- **Asset ID : `CAP-J05-01` (Capture d'écran)**
  - *Type* : Capture de l'onglet Code vs Rendu de l'Artifact dans Claude avec le bouton « Télécharger » (icône flèche vers le bas).
  - *Statut* : `prévu`.

---

#### Jour 06 : Personnaliser, tester et publier
- **Asset ID : `SCH-J06-01` (Schéma)**
  - *Type* : Schéma de distribution web : Claude Artifact (Code HTML) -> Netlify Drop (Hébergement HTTPS) -> URL publique distribuée à l'acheteur.
  - *Statut* : `prévu`.
- **Asset ID : `VID-J06-01` (Vidéo - Priorité Critique)**
  - *Type* : Screencast du processus complet d'export et publication sur Netlify Drop.
  - *Durée cible* : 3 min 45 s.
  - *Objectif* : Exporter le fichier HTML autonome depuis Claude, vérifier le fonctionnement local, puis le déployer sur Netlify Drop sous son compte pour obtenir une URL HTTPS sécurisée.
  - *Écran à montrer* : Claude.ai, explorateur de fichiers local, navigateur en mode responsive mobile, puis `app.netlify.com/drop`.
  - *Script / Actions filmées* : 1) Téléchargement du fichier `index.html` depuis Claude. 2) Ouverture dans Chrome avec test du responsive (375 px). 3) Connexion au compte gratuit Netlify. 4) Glisser-déposer du dossier contenant `index.html` sur Netlify Drop. 5) Copie de l'URL attribuée et test en ligne sur smartphone. 6) Collage de l'URL dans le champ `publishedUrl` du Dossier de Projet.
  - *Statut* : `prévu`.
- **Asset ID : `CAP-J06-01` (Capture d'écran)**
  - *Type* : Capture d'écran de l'interface `app.netlify.com/drop` avec la zone de glisser-déposer mise en surbrillance.
  - *Statut* : `prévu`.

---

### MODULE 3 : VENDRE ET PROMOUVOIR

#### Jour 07 : Construire son offre
- **Asset ID : `SCH-J07-01` (Schéma)**
  - *Type* : Schéma de composition de l'offre (Accès à l'application interactive + Guide d'accompagnement + Mises à jour).
  - *Statut* : `prévu`.
- **Asset ID : `CAP-J07-01` (Capture d'écran)**
  - *Type* : Modèle de fiche offre commerciale complétée dans le Dossier de Projet.
  - *Statut* : `prévu`.

---

#### Jour 08 : Créer la livraison et vendre sur Chariow
- **Asset ID : `VID-J08-01` (Vidéo - Priorité Critique)**
  - *Type* : Screencast de bout en bout de la mise en vente sur Chariow.
  - *Durée cible* : 4 min 00 s.
  - *Objectif* : Générer le PDF d'accès avec Claude, créer le produit de type « Fichiers » sur Chariow, configurer les instructions post-achat et tester le tunnel.
  - *Écran à montrer* : Claude pour la génération du texte PDF, outil d'impression PDF du navigateur, puis tableau de bord Chariow (`help.chariow.com`).
  - *Script / Actions filmées* : 1) Prompt Claude pour générer la page d'accès avec le lien Netlify et le code d'accès. 2) Impression en PDF propre depuis le navigateur. 3) Chariow : menu *Produits* -> *Créer un produit* -> type *Fichiers*. 4) Renseignement du prix et de la description. 5) Upload du PDF d'accès. 6) Renseignement des *Instructions après achat* dans l'onglet *Informations*. 7) Publication et test de la page de commande.
  - *Statut* : `prévu`.
- **Asset ID : `CAP-J08-01` (Capture d'écran)**
  - *Type* : Capture annotée de l'onglet *Informations* sur Chariow avec la case « Instructions après achat » et le champ d'upload de fichiers.
  - *Statut* : `prévu`.
- **Asset ID : `CAP-J08-02` (Capture d'écran)**
  - *Type* : Capture de l'Espace Client acheteur Chariow (`https://app.ateliat.com/`) montrant où l'acheteur retrouve son document et ses consignes.
  - *Statut* : `prévu`.

---

#### Jour 09 : Présenter et promouvoir
- **Asset ID : `SCH-J09-01` (Schéma)**
  - *Type* : Matrice des 3 angles de démonstration d'un produit digital interactif (Le problème avant vs Le soulagement immédiat pendant vs Le résultat tangible après).
  - *Statut* : `prévu`.
- **Asset ID : `VID-J09-01` (Vidéo)**
  - *Type* : Screencast de réalisation d'un clip de démonstration en 60 secondes (enregistrement d'écran du simulateur en action sur mobile).
  - *Durée cible* : 2 min 45 s.
  - *Statut* : `prévu`.

---

### BONUS AUTONOMES

#### Bonus 01 : ManyChat avec Claude
- **Asset ID : `SCH-BON-01` (Schéma)**
  - *Type* : Diagramme de flux de conversation Instagram DM / WhatsApp -> mot-clé déclencheur -> qualification -> livraison du lien d'achat Chariow.
  - *Statut* : `prévu`.
- **Asset ID : `CAP-BON-01` (Capture d'écran)**
  - *Type* : Capture de l'éditeur d'automatisations ManyChat avec respect des règles de messagerie Meta.
  - *Statut* : `prévu`.

#### Bonus 02 : Marketing Library
- **Asset ID : `CAP-BON-02` (Capture d'écran)**
  - *Type* : Vue d'ensemble des gabarits d'accroches et formats de posts prêts à l'emploi.
  - *Statut* : `prévu`.

---

## 3. TABLEAU RÉCAPITULATIF DES ASSETS CRITIQUES

| ID | Jour | Rôle / Type | Durée / Format | Statut actuel | Responsable de livraison |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`SCH-J01-01`** | J1 | Décomposition d'un document en 3 couches | SVG interactif | Prévu | Graphiste / Designer |
| **`VID-J01-01`** | J1 | Analyse d'un document réel en 15 min | Screencast 3'15 | Prévu | Formateur Studio |
| **`SCH-J04-01`** | J4 | Les 4 modèles interactifs canoniques | Composant React | **Intégré** | Équipe Dev |
| **`VID-J04-01`** | J4 | Structuration du brief fonctionnel | Screencast 3'30 | Prévu | Formateur Studio |
| **`VID-J05-01`** | J5 | Session de création d'Artifact dans Claude | Screencast 4'00 | Prévu | Formateur Studio |
| **`VID-J06-01`** | J6 | Export HTML et publication sur Netlify Drop | Screencast 3'45 | Prévu | Formateur Studio |
| **`VID-J08-01`** | J8 | Génération PDF Claude et configuration Chariow | Screencast 4'00 | Prévu | Formateur Studio |
