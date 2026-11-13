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

## 3. Architecture Technique et Sécurité

Le projet établit une dichotomie stricte entre la plateforme et les applications livrées :
- **Plateforme formatrice AI CREATOR Studio** : React 19, TypeScript strict, Vite 6, Tailwind CSS, Framer Motion 11, Lucide React, `@lottiefiles/dotlottie-react`.
- **Authentification Sécurisée Acheteur (Supabase + Gmail SMTP)** :
  - Accès membre protégé par `BuyerAuthGate` (formulaire épuré à 2 champs : E-mail d'achat + Code d'accès à 6 chiffres).
  - Webhook Chariow / Pulse connecté directement à l'Edge Function Supabase `chariow-webhook`.
  - Hachage cryptographique SHA-256 du code à usage unique dans la table `authorized_buyers` (avec RLS actif).
  - Envoi automatisé du code par e-mail via Gmail SMTP (`smtp.gmail.com:465`, TLS) avec salutation personnalisée **« Bonjour Boss, »**.
  - Session élève persistée localement et définitivement (aucun bouton de déconnexion pour l'apprenant).
- **Applications générées pour les acheteurs finaux** : Fichier unique `index.html`, Zero-Build, HTML5 sémantique, CSS moderne inline (`<style>`), JavaScript Vanilla pur inline (`<script>`). Interdiction totale de React, Vue ou de bibliothèques tierces chargées via CDN.
- **Suite de tests automatisés** : Vitest + Testing Library (**20 fichiers de tests, 270 tests passants**, typage TypeScript strict vérifié).

---

## 4. Installation et Commandes

### Installation des dépendances

```bash
npm install
```

### Configuration des variables d'environnement

Copiez `.env.example` en `.env` :

```bash
cp .env.example .env
```

Le fichier `.env` configure l'accès local et la liaison avec Supabase Edge Functions :
- `VITE_SUPABASE_URL` : URL de votre projet Supabase (`https://<project-ref>.supabase.co`).
- `VITE_SUPABASE_ANON_KEY` : Clé publique anon de votre projet Supabase.
- `VITE_AUTH_REQUIRED` : `false` en local pour développer librement, `true` en production.
- `STUDIO_PUBLIC_URL` : URL publique officielle sur Netlify.

### Scripts de développement et de production

```bash
# Démarrer le serveur de développement local avec HMR
npm run dev

# Compiler le bundle de production de la plateforme (dist/)
npm run build

# Prévisualiser localement le build de production
npm run preview

# Vérifier le typage strict TypeScript
npm run typecheck

# Exécuter l'intégralité des 270 tests unitaires et d'intégration
npm test

# Packager le Skill ai-creator-design-intelligence et synchroniser l'archive ZIP
npm run package:skill

# Régénérer le modèle de Guide d'Accès Client au format PDF
npm run generate:guide-pdf

# Générer les visuels Chariow Retina et le Guide d'Accès PDF acheteur officiel (1 page A4)
npm run generate:sales-page
```

---

## 5. Documentation Technique et Ressources

- [`docs/COURSE_PRD.md`](docs/COURSE_PRD.md) : Document de référence canonique (PRD v1.3.0-CANONICAL) pour l'architecture pédagogique, la roadmap et les spécifications techniques.
- [`docs/ai-creator-design-intelligence/SKILL.md`](docs/ai-creator-design-intelligence/SKILL.md) : Fichier maître du Skill autonome pour Claude Free (avec son [dossier de références](docs/ai-creator-design-intelligence/)).
- [`public/downloads/AI-CREATOR-DESIGN-INTELLIGENCE.zip`](public/downloads/AI-CREATOR-DESIGN-INTELLIGENCE.zip) : Archive ZIP téléchargeable du Skill Claude autonome.
- [`docs/prompts/`](docs/prompts/) : Les deux prompts maîtres du parcours standard (Entretien de direction artistique v2.3 et Génération du produit HTML v2.1).
- [`docs/guides/GUIDE-PARCOURS-APPRENANT.md`](docs/guides/GUIDE-PARCOURS-APPRENANT.md) : Guide d'utilisation pas-à-pas du parcours apprenant.
- [`docs/guides/GUIDE-ACCES-MINI-COURS-CLAUDE.html`](docs/guides/GUIDE-ACCES-MINI-COURS-CLAUDE.html) : Source HTML officielle du Guide d'Accès acheteur (1 page A4 épurée).
- [`public/downloads/GUIDE-ACCES-CLIENT-MODELE.pdf`](public/downloads/GUIDE-ACCES-CLIENT-MODELE.pdf) : Spécimen PDF modèle téléchargeable pour les acheteurs finaux.
- [`docs/examples/pricing-calculator/`](docs/examples/pricing-calculator/) : Prototype de référence validé (calculateur de prix interactif `index.html`, `SOURCE-FICHE-PRIX.md` et `VALIDATION.md`).
- [`public/downloads/chariow-sales-page/`](public/downloads/chariow-sales-page/) : Kit complet de mise en ligne sur Chariow pour **`Mini-Cours Interactif Claude`** (10 tranches PNG Retina issues de [`public/demos/chariow-sales-page.html`](public/demos/chariow-sales-page.html), vignette carrée `1200×1200`, bannière `1404×520`, Guide d'Accès PDF acheteur [`GUIDE-ACCES-MINI-COURS-INTERACTIF-CLAUDE.pdf`](public/downloads/chariow-sales-page/GUIDE-ACCES-MINI-COURS-INTERACTIF-CLAUDE.pdf) et fiche d'instructions [`GUIDE-PUBLICATION-CHARIOW.md`](public/downloads/chariow-sales-page/GUIDE-PUBLICATION-CHARIOW.md)).
- [`DESIGN.md`](DESIGN.md) : Spécification complète du design system néo-brutaliste et des règles visuelles de la plateforme.

---

## 6. Déploiement en Production

- **URL de production** : `https://ai-creator-studio-vtma.netlify.app`
- **Hébergement Frontend** : Netlify (Vite static SPA, `netlify.toml`).
- **Backend & Fonctions Serveur** : Supabase Edge Functions (`itmcmzohnjfrkymkcrmj`).
  - `chariow-webhook` : Réception des ventes Chariow, génération du code et envoi Gmail SMTP.
  - `verify-buyer-code` : Vérification du code OTP et ouverture de session JWT.
  - `request-new-code` : Renvoyer un code par mail avec rate-limit anti-abus (60s).
