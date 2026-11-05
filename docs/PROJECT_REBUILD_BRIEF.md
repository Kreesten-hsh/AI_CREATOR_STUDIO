# PROJECT REBUILD BRIEF : AI CREATOR STUDIO

> Document de référence canonique pour la reconstruction pédagogique d'AI CREATOR Studio.

---

## 1. Finalité Actuelle du Projet

**AI CREATOR Studio** est une plateforme web interactive d'apprentissage conçue pour accompagner les formateurs, consultants, coachs et créateurs dans la transformation d'un document existant (guide PDF, feuille de calcul, méthode opérationnelle) en un produit digital interactif autonome, hébergé sur le web et commercialisé via Chariow.

L'application sert de cadre structuré, épuré et autonome guidant l'apprenant à travers un parcours progressif en 3 modules, 9 journées et 2 bonus pratiques.

---

## 2. Structure Pédagogique et Architecture du Cursus

Le cursus complet est organisé en **3 modules thématiques**, comprenant chacun **3 leçons**, soit **9 journées d'apprentissage au total**, complétées par **2 bonus pratiques** et deux sections d'accompagnement.

### Module 1 : Opportunité et positionnement
- **Jour 01** : Analyser son document et identifier son potentiel interactif.
- **Jour 02** : Comprendre son acheteur et le problème à résoudre.
- **Jour 03** : Définir sa solution et sa promesse.

### Module 2 : Concevoir et créer avec Claude
- **Jour 04** : Concevoir son expérience interactive.
- **Jour 05** : Créer son application avec Claude.
- **Jour 06** : Personnaliser, tester et publier son application.

### Module 3 : Vendre et promouvoir
- **Jour 07** : Construire son offre commerciale.
- **Jour 08** : Créer son dispositif de livraison et publier sur Chariow.
- **Jour 09** : Présenter et promouvoir son application.

### Les 2 Bonus Pratiques
- **Bonus 01** : LE SYSTÈME MANYCHAT AUTOMATISÉ AVEC CLAUDE
- **Bonus 02** : MARKETING LIBRARY

### Sections d'Accompagnement
- **Ressources** : Outils techniques, modèles de code et directives de production.
- **Fiches pratiques** : Synthèses méthodologiques et repères pour chaque étape du parcours.

---

## 3. Choix Visuels et Identité Graphique à Préserver

L'identité visuelle d'AI CREATOR Studio est arrêtée et validée. Elle repose sur un style **Néo-Brutaliste Éditorial** sobre, tactile et structuré, garantissant une clarté de lecture maximale sur desktop comme sur mobile.

### Palette de Couleurs Officielles
- **Cream (`#FAF6F0`)** : Fond principal de la page, canevas et surfaces secondaires.
- **Burgundy / Primary Red (`#B63131`)** : Accent principal, boutons d'action majeurs, badges d'état et barres de progression.
- **Dusty Pink (`#E6A0A8`)** : Accent tertiaire, tags et rubans décoratifs.
- **Pale Pink (`#F7E0E2`)** : Fond de la barre latérale et cartes d'accentuation.
- **Ink (`#171313`)** : Encre de texte principale, bordures franches (2px) et ombres dures décalées.
- **Surface (`#FFFDFC`)** : Fond des cartes principales, panneaux d'exercices et fenêtres de lecture.

### Typographie
- **Display** : `Archivo Black`, `Syne` (Titres de sections et d'en-têtes).
- **Serif Éditorial** : `Instrument Serif`, `Playfair Display` (Italiques et contrastes tactiles).
- **Corps de texte** : `Plus Jakarta Sans`, `Inter` (Lecture courante, lisibilité haute densité).
- **Monospace** : `JetBrains Mono` (Tags, badges, métriques et données de code).

### Principes d'Ergonomie et de Rendu
- Bordures franches : `2px solid #171313`.
- Ombres décalées dures : `4px 4px 0px #171313` (`shadow-brutal`), sans flou.
- Rayons de courbure maîtrisés : `8px` (`rounded-brutal-card`), `6px` (`rounded-brutal-btn`), `4px` (`rounded-brutal-tag`).
- Rendu responsive strict : ergonomie tactile testée avec zones de clic minimales de 44px.

---

## 4. Règles de Reconstruction Future

Toute future réintégration de contenu pédagogique dans AI CREATOR Studio devra respecter rigoureusement les principes directeurs suivants :

1. **Aucun départ de zéro (Approche Document-First)** :
   Chaque leçon doit partir de la matière existante de l'apprenant pour la transformer pas à pas en livrable concret.

2. **Autonomie et clarté** :
   Les leçons doivent délivrer des instructions explicites, guidées et immédiatement testables avec Claude, sans présupposer de compétences préalables en programmation.

3. **Indépendance graphique du produit final** :
   La charte graphique d'AI CREATOR Studio (Burgundy, Cream, Ink) ne doit jamais être imposée au produit créé par l'apprenant. L'apprenant définit sa propre direction artistique.

4. **Simplicité technique et maintenabilité** :
   - Fichiers de données structurés et typés sous `src/data/days/`.
   - Pas de sur-architecture, pas de duplication, pas de code mort.
   - Validation stricte TypeScript et tests automatisés systématiques.
