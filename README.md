# AI CREATOR STUDIO

> **Mini-cours pratique** : Transformez votre document existant en une expérience interactive personnalisée avec Claude, publiez-la et apprenez à la vendre.

**AI CREATOR Studio** est la plateforme interactive d'apprentissage conçue pour guider les formateurs, consultants, coachs et créateurs dans la transformation directe de leur matière existante (guide PDF, feuille de calcul, méthode opérationnelle) en un produit digital interactif autonome.

Le flux de delivery canonique enseigné aux apprenants s'articule en 4 étapes simples :
$$\text{Document source} \longrightarrow \text{Claude (Skill + Master Prompts)} \longrightarrow \text{Netlify Drop} \longrightarrow \text{Chariow Files}$$

---

## 1. Architecture du Programme

Le cursus est structuré en **3 modules thématiques**, totalisant **3 journées**, **7 leçons pratiques** (21 étapes au standard *One Card, One Action*), complétées par **2 bonus** pratiques accessibles sans condition :

### Module 1 : CHOISIR (Journée 1)
- **Leçon 01** : Préparer son document et configurer Claude (~15 min)
- **Leçon 02** : Analyser son document, identifier 3 interactions et choisir (~30 min)

### Module 2 : CRÉER (Journée 2)
- **Leçon 03** : Définir sa direction artistique indépendante (~20 min)
- **Leçon 04** : Générer la première version (V1) de son application (~40 min)
- **Leçon 05** : Effectuer des retouches ciblées, corriger et tester (~30 min)

### Module 3 : PUBLIER ET LIVRER (Journée 3)
- **Leçon 06** : Publier son application sur Netlify (~25 min)
- **Leçon 07** : Organiser la livraison via Chariow et tester le parcours d'achat (~35 min)

### Les 2 Bonus Pratiques
- **Bonus 01** : LE SYSTÈME MANYCHAT AUTOMATISÉ AVEC CLAUDE (5 leçons pratiques, 5 prompts Claude Free, qualification sans Tags obligatoires, conformité ManyChat Free 4 automatisations & WhatsApp par message livré).
- **Bonus 02** : MARKETING LIBRARY (Bibliothèque de 9 ressources de Skills marketing, avec 2 archives ZIP téléchargeables, 1 prompt universel de recherche concurrentielle et boîte à outils opérationnelle).

---

## 2. Identité Visuelle et Design

L'application adopte une esthétique **Néo-Brutaliste Éditoriale** :
- **Couleurs canoniques** : Cream (`#FAF6F0`), Burgundy (`#B63131`), Dusty Pink (`#E6A0A8`), Pale Pink (`#F7E0E2`), Ink (`#171313`) et Surface (`#FFFDFC`).
- **Typographie** : `Archivo Black` / `Syne` (Display), `Instrument Serif` (Serif éditorial), `Plus Jakarta Sans` (Corps), `JetBrains Mono` (Technique).
- **Bordures et ombres** : Contours noirs nets (`2px solid #171313`), ombres dures décalées (`4px 4px 0px #171313`).

---

## 3. Architecture Technique et Commandes

Le projet établit une dichotomie stricte entre la plateforme et les applications livrées :
- **Plateforme formatrice AI CREATOR Studio** : React 19, TypeScript strict, Vite 6, Tailwind CSS, Framer Motion, Lucide React.
- **Applications générées pour les acheteurs finaux** : Fichier unique `index.html`, Zero-Build, HTML5 sémantique, CSS moderne inline (`<style>`), JavaScript Vanilla pur inline (`<script>`). Interdiction totale de React, Vue ou de bibliothèques tierces chargées via CDN.
- **Suite de tests automatisés** : Vitest + Testing Library (**18 fichiers de tests, 223 tests passants**, vérifiés en novembre 2026).

### Installation des dépendances

```bash
npm install
```

### Scripts de développement et de build

```bash
# Démarrer le serveur de développement local avec HMR
npm run dev

# Compiler le bundle de production de la plateforme
npm run build

# Prévisualiser localement le build de production
npm run preview

# Vérifier le typage strict TypeScript
npm run typecheck

# Exécuter l'intégralité des tests unitaires et d'intégration
npm test

# Packager le Skill ai-creator-design-intelligence et synchroniser l'archive ZIP
npm run package:skill

# Régénérer le modèle de Guide d'Accès Client au format PDF
npm run generate:guide-pdf
```

---

## 4. Documentation Technique et Ressources

- [`docs/COURSE_PRD.md`](docs/COURSE_PRD.md) : Document de référence canonique (PRD v1.2.0-CANONICAL) pour l'architecture pédagogique, la roadmap et les spécifications techniques.
- [`docs/ai-creator-design-intelligence/SKILL.md`](docs/ai-creator-design-intelligence/SKILL.md) : Fichier maître du Skill autonome pour Claude Free (avec son [dossier de références](docs/ai-creator-design-intelligence/)).
- [`public/downloads/AI-CREATOR-DESIGN-INTELLIGENCE.zip`](public/downloads/AI-CREATOR-DESIGN-INTELLIGENCE.zip) : Archive ZIP téléchargeable du Skill Claude autonome.
- [`docs/prompts/`](docs/prompts/) : Les deux prompts maîtres du parcours standard (Entretien de direction artistique v2.3 et Génération du produit HTML v2.1).
- [`docs/guides/GUIDE-PARCOURS-APPRENANT.md`](docs/guides/GUIDE-PARCOURS-APPRENANT.md) : Guide d'utilisation pas-à-pas du parcours apprenant.
- [`docs/guides/GUIDE-ACCES-CLIENT-SOURCE.md`](docs/guides/GUIDE-ACCES-CLIENT-SOURCE.md) : Modèle source Markdown du Guide d'Accès Client remis après achat.
- [`public/downloads/GUIDE-ACCES-CLIENT-MODELE.pdf`](public/downloads/GUIDE-ACCES-CLIENT-MODELE.pdf) : Spécimen PDF modèle téléchargeable pour les acheteurs finaux.
- [`docs/examples/pricing-calculator/`](docs/examples/pricing-calculator/) : Prototype de référence validé (calculateur de prix interactif `index.html`, `SOURCE-FICHE-PRIX.md` et `VALIDATION.md`).
- [`docs/storyboard/VISUAL-STORYBOARD-L1-L7.md`](docs/storyboard/VISUAL-STORYBOARD-L1-L7.md) : Storyboard visuel complet des 7 leçons et des 7 captures d'écran réelles.
- [`DESIGN.md`](DESIGN.md) : Spécification complète du design system néo-brutaliste et des règles visuelles de la plateforme.

---

## 5. Feuille de Route des Missions (11 Missions)

Le pilotage du projet s'articule en **11 missions ordonnées** respectant les dépendances techniques et pédagogiques réelles :

| Mission | Intitulé | Statut | Périmètre |
|---|---|---|---|
| **Mission 01** | PRD Canonique | **Terminée** | Spécifications complètes du cours, architecture curriculaire et standard pédagogique. |
| **Mission 02** | Refactoring Modèle & Routes | **Terminée** | Architecture 3 Modules / 3 Journées / 7 Leçons, typages stricts et assainissement des routes. |
| **Mission 03** | Prototypage Moteur & DA | **Terminée** | Validation empirique du Master Prompt, Source Fidelity Mapping et prototype de référence (`pricing-calculator/`). |
| **Mission 04** | Contenu Module 01 (CHOISIR) | **Terminée** | Rédaction et intégration des leçons L1 & L2 (standard Abigail Peugh, *One Card, One Action*). |
| **Mission 05** | Contenu Module 02 (CRÉER) | **Terminée** | Rédaction et intégration des leçons L3, L4 & L5, Skill Claude Free et protocole de continuité « Continue ». |
| **Mission 06** | Contenu Module 03 (PUBLIER & LIVRER) | **Terminée** | Rédaction et intégration des leçons L6 & L7 (Netlify Drop, offre Chariow Files). |
| **Mission 07** | Bonus 01 : ManyChat Automation System | **Terminée** | Système d'automatisation conversationnelle Claude Free + ManyChat (FB Messenger, qualification sans Tags, conformité Meta 24h & Free 4 automatisations). |
| **Mission 08** | Bonus 02 : Marketing Library | **Terminée** | Bibliothèque de 9 ressources de Skills marketing (dont 2 archives ZIP téléchargeables et 7 fiches avec prompts prêts à l'emploi), prompt universel de recherche concurrentielle et modal interactive. |
| **Mission 09** | Mission Intermédiaire 01 : Contenu & Livraison | **Terminée** | Lot A (Prompts v2 & Skill v2), Lot B (Refonte 7 leçons & Guide d'Accès PDF), Lot C (7 captures réelles & Storyboard), Lot D (Alignement PRD/README & recette globale). |
| **Mission 10** | Mission Intermédiaire 02 : Affinage UI/UX | **Active** | Audit ergonomique, hiérarchie visuelle, micro-interactions sobres, conformité responsive et accessibilité WCAG AA. |
| **Mission 11** | Harness Simulateur & Validation Humaine | **Mission Finale** | Harness d'évaluation automatisé (3 personas Claire, Marc, Sophie), tests Playwright/Vitest et recette cohorte réelle (5 créateurs). |
