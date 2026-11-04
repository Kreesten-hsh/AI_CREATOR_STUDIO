# AI CREATOR Studio (V2)

> « Tu ne vas pas apprendre à créer notre plateforme. Tu vas apprendre à créer la tienne. »

Mini-cours pratique conçu pour apprendre aux créateurs, formateurs, coachs et consultants à utiliser **Claude** afin de transformer leur propre contenu, leur expertise ou leurs documents existants en un **produit digital interactif, personnalisé et commercialisable sur Chariow**, sans prérequis en programmation.

---

## 1. Architecture du Programme V2 (3 Modules, 9 Leçons, 2 Bonus)

Le cursus est structuré en **3 modules opérationnels (9 leçons de 4 étapes chacune)** et **2 bonus complets indépendants** :

### Module 01 : L'OPPORTUNITÉ & LE POSITIONNEMENT (Leçons 01 à 03)
- **Leçon 01 : De son expertise au problème client** (`day-01`)
  - *Livrable* : Matière de départ structurée, problèmes candidats et niche orientée problème.
- **Leçon 02 : Comprendre son acheteur et ses motivations** (`day-02`)
  - *Livrable* : Fiche acheteur (situation, frustrations, déclencheurs, objections, critères de décision et vocabulaire réel).
- **Leçon 03 : Positionnement et promesse de transformation** (`day-03`)
  - *Livrable* : Alternatives réelles, valeur différenciante, positionnement provisoire et promesse vérifiable.

### Module 02 : CONCEVOIR & CRÉER AVEC CLAUDE (Leçons 04 à 06)
- **Leçon 04 : Choisir le format interactif et concevoir son blueprint** (`day-04`)
  - *Livrable* : Blueprint complet de son propre produit interactif.
- **Leçon 05 : Construire son produit avec Claude** (`day-05`)
  - *Livrable* : Première version fonctionnelle de son propre produit interactif (`index.html`).
- **Leçon 06 : Personnaliser, tester et exporter son produit** (`day-06`)
  - *Livrable* : Produit finalisé avec sa propre identité visuelle, sauvegarde portable JSON (`.json`), hébergement HTTPS et archive `.zip` prête à livrer.

### Module 03 : VENDRE & PROMOUVOIR (Leçons 07 à 09)
- **Leçon 07 : Structurer son offre et son prix** (`day-07`)
  - *Livrable* : Offre complète et argumentaire produit (grille en FCFA ou EUR).
- **Leçon 08 : Mettre son produit en vente sur Chariow** (`day-08`)
  - *Livrable* : Produit prêt à être publié et vendu sur Chariow (`Fichiers` `.zip`, portail client `app.ateliat.com`).
- **Leçon 09 : Créer son contenu de lancement et ses démonstrations** (`day-09`)
  - *Livrable* : Kit de lancement (accroches, script de démonstration, publication et plan 7 jours).

### Les 2 Bonus Indépendants
- **Bonus 01 : Le Système ManyChat Automatisé avec Claude** (`bonus-manychat`)
  - Séquence conforme aux règles Meta/Instagram en 5 étapes (Commentaire -> 1er DM privé -> Interaction Quick Reply ouvrant la fenêtre de 24h -> Qualification -> Lien Chariow, avec arrêt strict sans relance en cas de non-interaction).
- **Bonus 02 : Marketing Library** (`bonus-marketing`)
  - Bibliothèque directement exploitable : 20 structures d'accroches Reels/TikTok, 5 structures de carrousels, 3 séquences d'emails de lancement, templates DM/objections et scripts de démonstration produit.

---

## 2. Architecture Technique & Distribution des Produits Apprenants

Chaque produit créé par un apprenant suit une architecture testée et reproductible (documentée dans `docs/PRODUCT_DELIVERY_DECISION.md` et démontrée par `public/demos/pdf-to-hub/apres-hub-interactif.html`) :

| Dimension | Solution Technique Retenue |
| :--- | :--- |
| **Création** | Claude génère le code dans un fichier autonome `index.html` (HTML5 + CSS + Vanilla JS) avec la propre identité visuelle de l'apprenant |
| **Utilisation en ligne** | Hébergement statique sur une origine HTTPS stable (ex. Netlify Drop) |
| **Sauvegarde en ligne** | `localStorage` sur l'origine HTTPS, encapsulé dans un bloc `try / catch` |
| **Utilisation hors ligne** | Fonctionnement intégral des interactions (calculs, diagnostics, filtres) sans dépendre de `localStorage` sur `file://` |
| **Sauvegarde portable** | Boutons **Exporter (`.json`)** et **Importer (`.json`)** intégrés pour sauvegarder et restaurer ses données entre appareils ou navigateurs |
| **Livraison commerciale** | Archive `.zip` livrée automatiquement via Chariow (produit de type `Fichiers`) |
| **Accès mobile** | URL HTTPS hébergée et testée sur smartphone |

---

## 3. Migration LocalStorage Blindée (`schemaVersion: 1 -> 2`)

Le module `src/utils/storage.ts` assure une migration sans perte de données depuis la V1 :
1. Création et vérification par relecture d'une sauvegarde `ai_creator_studio_progress_v1_backup` (sans jamais écraser une sauvegarde existante).
2. Validation des identifiants d'exercices, checklists, quiz et prompts conservés dans les Leçons 01 à 03.
3. Neutralisation de l'ancienne direction artistique par défaut du Studio (`brandStyle: ''`) tout en préservant tout style personnalisé par l'apprenant.
4. Isolation des anciennes données hors périmètre (jours 4 à 25 V1) dans `legacyArchive`.
5. Gestion résiliente des erreurs `QuotaExceededError`.

---

## 4. Stack Technique & Commandes

- **Framework** : React 19 + TypeScript strict (`tsc --noEmit`)
- **Build** : Vite 6 + Tailwind CSS + Framer Motion + Lucide React
- **Tests** : Vitest + Testing Library

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Vérifier le typage TypeScript strict
npm run typecheck

# Exécuter l'intégralité de la suite de tests Vitest
npx vitest run

# Compiler le bundle de production
npm run build
```

---

## 5. Documentation d'Architecture V2

- `docs/PRODUCT_DELIVERY_DECISION.md` : Décision d'architecture et de distribution du produit de l'apprenant.
- `docs/PEDAGOGICAL_ARCHITECTURE_V2.md` : Principes directeurs et structure pédagogique V2.
- `docs/CURRICULUM_BLUEPRINT_V2.md` : Plan détaillé des 3 modules, 9 leçons et 2 bonus.
- `docs/research/CLAUDE_ARTIFACTS_EXPORT_REGISTER.md` : Registre documentaire Claude Artifacts / Exports HTML.
- `docs/research/CHARIOW_DELIVERY_REGISTER.md` : Registre documentaire Chariow (`Fichiers`, commissions Starter 15 % / Growth 10 %, Wallet Axa Zara, `app.ateliat.com`).
- `docs/research/MANYCHAT_META_REGISTER.md` : Registre documentaire ManyChat & règles Meta (fenêtre de 24h, Quick Reply vs Open website).
