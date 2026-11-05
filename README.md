# Utiliser Claude pour créer un produit digital qui ne ressemble pas à de la merde générée par l'IA

> Transformez votre document existant en une expérience interactive personnalisée avec Claude, publiez-la et apprenez à la vendre.

**AI CREATOR Studio** est la plateforme interactive d'apprentissage conçue pour guider les formateurs, consultants, coachs et créateurs dans la transformation de leur matière existante (guide PDF, ebook, tableur, grille de calcul ou méthode) en un produit digital interactif autonome, hébergé sur le web et commercialisé sur Chariow.

---

## 1. Architecture du Programme V2 (Approche Document-First)

Le parcours est structuré en **3 modules de 3 leçons (9 leçons au total)** avec livrables continus, complétés par **2 bonus indépendants** :

### Module 01 : L'OPPORTUNITÉ & LE POSITIONNEMENT (Leçons 01 à 03)
- **Leçon 01 : Analyser son document et identifier son potentiel interactif** (`day-01`)
  - *Livrable* : Matrice de transformation, matière extraite et potentiel interactif identifié.
- **Leçon 02 : Comprendre son acheteur et le problème** (`day-02`)
  - *Livrable* : Fiche acheteur, problème prioritaire, faits documentés vs hypothèses.
- **Leçon 03 : Définir la solution et la promesse** (`day-03`)
  - *Livrable* : Mécanisme de résolution, proposition de valeur et promesse de transformation vérifiable.

### Module 02 : CONCEVOIR & CRÉER AVEC CLAUDE (Leçons 04 à 06)
- **Leçon 04 : Concevoir l'expérience interactive** (`day-04`)
  - *Livrable* : Choix parmi les 4 modèles de produits interactifs, parcours fonctionnel, identité visuelle propre et brief complet.
- **Leçon 05 : Créer son application avec Claude** (`day-05`)
  - *Livrable* : Application V1 fonctionnelle générée via le Master Prompt Claude.
- **Leçon 06 : Personnaliser, tester et publier** (`day-06`)
  - *Livrable* : Application testée (mobile et desktop), export HTML autonome, publication en ligne sur Netlify Drop avec URL HTTPS permanente.

### Module 03 : VENDRE & PROMOUVOIR (Leçons 07 à 09)
- **Leçon 07 : Construire son offre** (`day-07`)
  - *Livrable* : Offre commerciale complète, prix et conditions de support.
- **Leçon 08 : Créer la livraison et vendre sur Chariow** (`day-08`)
  - *Livrable* : PDF d'accès client généré par Claude (sans outil tiers), produit de type « Fichiers » configuré sur Chariow avec instructions après achat.
- **Leçon 09 : Présenter et promouvoir** (`day-09`)
  - *Livrable* : Kit de promotion, démonstration produit et calendrier de lancement.

### Les 2 Bonus Indépendants
- **Bonus 01 : Le Système ManyChat Automatisé avec Claude** (`bonus-manychat`)
  - Séquence conforme aux règles officielles de l'API Meta/Instagram en 5 étapes (Commentaire -> 1er DM privé -> Quick Reply ouvrant la fenêtre de 24h -> Qualification -> Lien Chariow, avec arrêt strict sans relance en cas de non-interaction).
- **Bonus 02 : Marketing Library** (`bonus-marketing`)
  - Recueil opérationnel : 20 structures d'accroches, 5 carrousels de démonstration, 3 séquences d'emails et scripts vidéo sans faux chiffres ni promesses irréalistes.

---

## 2. Parcours Technique de Livraison du Produit Apprenant

Chaque produit créé par un élève suit un chemin de livraison épuré et accessible sur smartphone :

| Étape | Rôle & Solution Technique Retenue |
| :--- | :--- |
| **1. Création avec Claude** | Génération d'une application autonome dans un fichier unique `index.html` (HTML5 + CSS + JavaScript standard) avec l'identité visuelle propre à l'apprenant. |
| **2. Hébergement Web** | Déploiement statique sur **Netlify Drop** réclamé avec un compte gratuit pour obtenir une URL HTTPS pérenne. |
| **3. Persistance Hybride** | `localStorage` rattaché à l'origine HTTPS sécurisé par `try/catch` + boutons **Exporter (`.json`)** et **Importer (`.json`)** pour la portabilité inter-appareils. |
| **4. PDF d'accès généré par Claude** | Document d'accès remis au client (titre, lien HTTPS direct, instructions et contact) généré directement avec Claude (sans Canva). |
| **5. Distribution Chariow** | Fiche produit de type « Fichiers » distribuant le PDF d'accès avec instructions après achat. Pas de ZIP obligatoire. |

---

## 3. Dossier de Projet & Persistance Locale (`schemaVersion: 3`)

L'espace **Mon Projet** centralise les 18 champs du Dossier de Projet de l'apprenant :
- Validation stricte de chaque champ (détection et rejet de secrets d'API, de clés privées et de data URIs base64).
- Plafonds de taille stricts (40 000 caractères pour l'analyse, les contenus essentiels et le prompt de création ; 10 000 pour les autres champs ; 200 000 au total).
- Export et Import JSON sécurisés avec sauvegarde de pré-import automatique (`ai_creator_studio_dossier_pre_import_backup`).
- Rétro-compatibilité et résilience face aux restrictions de quota (`QuotaExceededError`).

---

## 4. Stack Technique & Commandes

- **Framework** : React 19 + TypeScript strict (`tsc --noEmit`)
- **Build & Dev** : Vite 6 + Tailwind CSS + Framer Motion + Lucide React
- **Tests** : Vitest + Testing Library

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Vérifier le typage TypeScript strict
npm run typecheck

# Exécuter la suite complète de tests Vitest
npm test

# Compiler le bundle de production
npm run build
```

---

## 5. Documentation d'Architecture V2

- `docs/PEDAGOGICAL_ARCHITECTURE_V2.md` : Architecture canonique souveraine du parcours V2.
- `docs/PRODUCT_DELIVERY_DECISION.md` : Décision d'architecture et de livraison du produit apprenant.
- `docs/RESEARCH_DRIVEN_PEDAGOGICAL_PRODUCTION_PROTOCOL.md` : Protocole directeur de recherche et rigueur épistémique.
- `docs/PROJECT_DOSSIER_V2.md` : Spécification technique du Dossier de Projet (18 champs, validation, migrations).
- `docs/MEDIA_PRODUCTION_PLAN_V2.md` : Inventaire des schémas, captures et vidéos du cours.
- `docs/research/CLAUDE_ARTIFACTS_EXPORT_REGISTER.md` : Registre Claude Artifacts et exports HTML.
- `docs/research/CHARIOW_DELIVERY_REGISTER.md` : Registre Chariow (produits Fichiers, commissions, instructions après achat).
- `docs/research/MANYCHAT_META_REGISTER.md` : Registre ManyChat et conformité API Meta 24h.
- `docs/research/DAY_02_RESEARCH_REGISTER.md` : Registre documentaire du Jour 02.
- `docs/research/DAY_03_RESEARCH_REGISTER.md` : Registre documentaire du Jour 03.
- `DESIGN.md` : Charte visuelle de la plateforme et liberté d'identité des produits créés.
