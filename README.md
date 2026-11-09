# AI CREATOR STUDIO

> **Mini-cours pratique** : Transformez votre document existant en une expérience interactive personnalisée avec Claude, publiez-la et apprenez à la vendre.

**AI CREATOR Studio** est la plateforme interactive d'apprentissage conçue pour guider les formateurs, consultants, coachs et créateurs dans la transformation de leur matière existante (guide PDF, feuille de calcul, méthode opérationnelle) en un produit digital interactif autonome.

---

## 1. Architecture du Programme

Le cursus est structuré en **3 modules thématiques**, totalisant **3 journées** et **7 leçons pratiques** (répartition 2 + 3 + 2), complétées par **2 bonus** pratiques :

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

### Les 2 Bonus
- **Bonus 01** : LE SYSTÈME MANYCHAT AUTOMATISÉ AVEC CLAUDE (5 leçons pratiques, 5 prompts Claude Free, qualification sans Tags obligatoires, conformité ManyChat Free 4 automatisations & WhatsApp par message livré)
- **Bonus 02** : MARKETING LIBRARY (9 Skills IA originaux en téléchargement direct, 1 prompt universel de recherche concurrentielle et boîte à outils opérationnelle)

---

## 2. Identité Visuelle et Design

L'application adopte une esthétique **Néo-Brutaliste Éditoriale** :
- **Couleurs canoniques** : Cream (`#FAF6F0`), Burgundy (`#B63131`), Dusty Pink (`#E6A0A8`), Pale Pink (`#F7E0E2`), Ink (`#171313`) et Surface (`#FFFDFC`).
- **Typographie** : `Archivo Black` / `Syne` (Display), `Instrument Serif` (Serif éditorial), `Plus Jakarta Sans` (Corps), `JetBrains Mono` (Technique).
- **Bordures et ombres** : Contours noirs nets (`2px solid #171313`), ombres dures décalées (`4px 4px 0px #171313`).

---

## 3. Stack Technique et Commandes

- **Framework** : React 19 + TypeScript strict
- **Build Tool** : Vite 6
- **Styling** : Tailwind CSS + Framer Motion + Lucide React
- **Tests** : Vitest + Testing Library (17 fichiers de tests, 205 tests passants)

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement local
npm run dev

# Vérifier le typage strict TypeScript
npm run typecheck

# Packager le Skill ai-creator-design-intelligence et synchroniser l'archive
npm run package:skill

# Exécuter les tests unitaires et d'intégration
npm test

# Compiler le bundle de production
npm run build
```

---

## 4. Documentation Technique

- [`docs/COURSE_PRD.md`](docs/COURSE_PRD.md) : Document de référence canonique (PRD) pour l'architecture pédagogique, la roadmap et les spécifications.
- [`docs/ai-creator-design-intelligence/`](docs/ai-creator-design-intelligence/) : Skill autonome pour Claude Free (`SKILL.md`, références, archive ZIP et guide d'installation).
- [`docs/prompts/`](docs/prompts/) : Les deux prompts maîtres du parcours standard (Entretien de direction artistique et Génération du produit HTML).
- [`docs/guides/GUIDE-PARCOURS-APPRENANT.md`](docs/guides/GUIDE-PARCOURS-APPRENANT.md) : Guide d'utilisation pas-à-pas du parcours apprenant.
- [`docs/examples/marc-v2/`](docs/examples/marc-v2/) : Preuve de concept unique (application interactive Marc V2 et rapport de validation technique).
- [`DESIGN.md`](DESIGN.md) : Spécification complète du design system et des règles visuelles de la plateforme.
- [`graphify-out/`](graphify-out/) : Graphe de connaissances architectural avec visualiseur interactif HTML (`graph.html`) et rapport de navigation (`GRAPH_REPORT.md`).

---

## 5. Feuille de Route des Missions (11 Missions)

Le pilotage du projet s'articule en **11 missions ordonnées** respectant les dépendances techniques et pédagogiques réelles :

| Mission | Intitulé | Statut | Périmètre |
|---|---|---|---|
| **Mission 01** | PRD Canonique | **Terminée** | Spécifications complètes du cours, architecture curriculaire et standard pédagogique. |
| **Mission 02** | Refactoring Modèle & Routes | **Terminée** | Architecture 3 Modules / 3 Journées / 7 Leçons, typages stricts et assainissement des routes. |
| **Mission 03** | Prototypage Moteur & DA | **Terminée** | Validation empirique du Master Prompt, Source Fidelity Mapping et prototype Marc V2. |
| **Mission 04** | Contenu Module 01 (CHOISIR) | **Terminée** | Rédaction et intégration des leçons L1 & L2 (standard Abigail Peugh). |
| **Mission 05** | Contenu Module 02 (CRÉER) | **Terminée** | Rédaction et intégration des leçons L3, L4 & L5, Skill Claude Free et trousseau de reprise. |
| **Mission 06** | Contenu Module 03 (PUBLIER & LIVRER) | **Terminée** | Rédaction et intégration des leçons L6 & L7 (Netlify Drop, offre Chariow Files). |
| **Mission 07** | Bonus 01 : ManyChat Automation System | **Terminée** | Système d'automatisation conversationnelle Claude Free + ManyChat (FB Messenger, qualification sans Tags, conformité Meta 24h & Free 4 automatisations). |
| **Mission 08** | Bonus 02 : Marketing Library | **Terminée** | Bibliothèque de 9 Skills IA originaux téléchargeables, prompt universel de recherche concurrentielle et modal interactive. |
| **Mission 09** | Mission Intermédiaire 01 : Contenu & Livraison | **Prochaine Mission** | Enrichissement éditorial L1–L7, production & intégration des captures d'écran réelles, cadrage du Guide d'Accès PDF et validation multi-appareils. |
| **Mission 10** | Mission Intermédiaire 02 : Affinage UI/UX | **Planifiée** | Audit ergonomique, hiérarchie visuelle, micro-interactions sobres, conformité responsive et accessibilité WCAG AA. |
| **Mission 11** | Harness Simulateur & Validation Humaine | **Mission Finale** | Harness d'évaluation automatisé (3 personas Claire, Marc, Sophie), tests Playwright/Vitest et recette cohorte réelle (5 créateurs). |
