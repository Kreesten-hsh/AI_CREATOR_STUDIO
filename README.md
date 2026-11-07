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
- **Bonus 01** : LE SYSTÈME MANYCHAT AUTOMATISÉ AVEC CLAUDE
- **Bonus 02** : MARKETING LIBRARY

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
- **Tests** : Vitest + Testing Library

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement local
npm run dev

# Vérifier le typage strict TypeScript
npm run typecheck

# Exécuter les tests unitaires et d'intégration
npm test

# Compiler le bundle de production
npm run build
```

---

## 4. Documentation Technique

- [`docs/COURSE_PRD.md`](docs/COURSE_PRD.md) : Document de référence canonique (PRD) pour l'architecture pédagogique et fonctionnelle.
- [`docs/DECISIONS-MISSION-03.md`](docs/DECISIONS-MISSION-03.md) : Synthèse d'architecture, méthode de transformation et décisions retenues de la Mission 03.
- [`docs/ai-creator-design-intelligence/`](docs/ai-creator-design-intelligence/) : Skill autonome pour Claude Free (`SKILL.md`, références, archive ZIP et guide d'installation).
- [`docs/prompts/`](docs/prompts/) : Les deux prompts maîtres du parcours standard (Entretien de direction artistique et Génération du produit HTML).
- [`docs/guides/GUIDE-PARCOURS-APPRENANT.md`](docs/guides/GUIDE-PARCOURS-APPRENANT.md) : Guide d'utilisation pas-à-pas du parcours apprenant.
- [`docs/examples/marc-v2/`](docs/examples/marc-v2/) : Preuve de concept unique (application interactive Marc V2 et rapport de validation technique).
- [`DESIGN.md`](DESIGN.md) : Spécification complète du design system et des règles visuelles de la plateforme.
