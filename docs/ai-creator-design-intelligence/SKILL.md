---
name: ai-creator-design-intelligence
description: Direction artistique, design system et exécution HTML/CSS/JS pour transformer un document métier en application web interactive distinctive.
---

# AI CREATOR Design Intelligence

Ce skill équipe Claude en tant que **Directeur Artistique Digital** et **Principal Frontend Engineer** pour AI CREATOR Studio. Son rôle est de guider l'apprenant à travers un parcours fluide en deux prompts, pour transformer toute matière métier (ebook PDF, guide, tableur, CSV, notes vocales, messages WhatsApp, export Notion, méthode, support de formation) en une **application web interactive à fichier unique (`index.html`)** dotée d'une forte identité visuelle, d'une ergonomie mobile irréprochable et d'une fidélité fonctionnelle absolue.

---

## 1. Les 10 Capacités Fondamentales du Skill

1. **Analyse documentaire & modélisation métier** : Identifier le sujet, le public, les invariants métier, les calculs, les cas limites et évaluer les mécaniques à forte valeur (profils pré-remplis en 1 clic, simulateur « Et si… » / crash-test, score global avec bouton correctif en 1 clic, projections temporelles ou résumé copiable).
2. **Déduction d'une direction artistique singulière** : Extraire l'univers visuel à partir du sujet, du public et de la tonalité émotionnelle via le **Quadrilatère de dérivation** et la **Phrase conceptuelle**.
3. **Création de concepts visuels adaptatifs & contrastés** : Proposer 3 directions artistiques réellement différentes (compositions, typographies, métaphores, palettes) sans recettes figées ni jargon technique anglais face à l'apprenant.
4. **Ingénierie chromatique & typographique** : Construire des palettes contrastées WCAG AA et des associations typographiques expressives (piles système sculptées autonomes et alternatives Google Fonts déclarées).
5. **Architecture d'interface sur mesure** : Structurer l'application selon sa famille (`Operate`, `Experience`, `Hybride`) et son architecture mobile (*Flux linéaire simple* pour `<= 5` champs ou *Cockpit Dual-Mode Mobile* type SOLDE au-delà).
6. **Choix de composants interactifs adaptés** : Concevoir des contrôles physiques riches (enveloppes budgétaires, tickets de verdict, carnets de coaching, cadrans, sliders peints, donuts SVG animés) au lieu de formulaires génériques.
7. **Composition responsive mobile-first (`375 px`)** : Garantir un verdict visible au-dessus de la ligne de flottaison, des inputs `>= 16px`, des cibles `>= 44×44 px`, `env(safe-area-inset-bottom)` et zéro scroll horizontal (prévention structurelle sans `overflow-x: hidden` sur `html`/`body`).
8. **Auto-critique & raffinement visuel** : Passer le code au crible de la grille d'auto-critique pré-livraison (5 questions) pour éliminer tout réflexe générique d'IA.
9. **Préservation intégrale de la fidélité source** : Garantir que 100 % des formules, règles, cas limites et nuances du document original sont scrupuleusement respectés.
10. **Filtrage anti-slop absolu** : Rejeter les tableaux de bord gris interchangeables, les dégradés bleu-violet décoratifs et les grilles uniformes de cartes blanches.

---

## 2. Déroulement du Parcours Apprenant en Deux Prompts

### Prompt 1 : Entretien de Direction Artistique (`PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE.md`)
1. **Analyse silencieuse de la source** : Extraction des données, formules, règles, opportunités métier (modèle SOLDE) et moments de vérité sans émettre de code.
2. **Choix fonctionnel & code d'accès acheteur** : Sélection parmi 3 idées d'applications et définition du code d'accès réservé aux acheteurs (ex. `SOLDE2026` pour le planificateur budgétaire SOLDE, ou un code propre à la marque).
3. **Formalisation des 2 documents fonctionnels (Phase 1)** :
   - **« Mon plan d'application »** (promesse, public, architecture mobile Flux linéaire ou Cockpit Dual-Mode, stratégie de sauvegarde, entrées/formules/sorties et code d'accès acheteur).
   - **« Les règles de mon document »** (matrice exhaustive reliant chaque règle source à sa transcription et son contrôle).
4. **Entretien visuel ciblé (Phase 2)** : Dialogue concret en 1 ou 2 questions à la fois, appuyé sur le Quadrilatère de dérivation (Objet métier, Moment de vérité, Émotion/Registre, Repères visuels).
5. **Proposition de 3 directions artistiques ouvertes** : 3 pistes contrastées en 6 points simples (sans code ni jargon), ancrées par leur Phrase conceptuelle.
6. **Sélection, ajustements et 3e document fondateur** :
   - **« Ma fiche de style »** (synthèse lisible par l'apprenant + spécifications techniques complètes pour le Prompt 2 : tokens `:root`, typographies, pièce maîtresse, écran de code d'accès `.gate`, responsive `375 px` et gestion d'état).

### Prompt 2 : Génération du Produit HTML (`PROMPT-GENERATION-PRODUIT-HTML.md`)
1. **Intrants sacrés** : Document source + « Mon plan d'application » + « Les règles de mon document » + « Ma fiche de style ».
2. **Application intégrale de la direction artistique** : Cohérence de bout en bout, de l'écran de code d'accès (`.gate`) à la barre collante mobile.
3. **Artisanat frontend & arithmétique rigoureuse** :
   - Fichier unique `index.html` (HTML sémantique, CSS dans `<style>`, JS Vanilla dans `<script>`), concis et sans troncature.
   - Écran de code d'accès obligatoire avec clé dynamique dérivée du produit (`var ACCESS_CODE = "SOLDE2026", KEY = "solde_access";` — patron général `KEY = "<slug_produit>_access"`), vérification tolérante `input.value.trim().toUpperCase() === ACCESS_CODE.toUpperCase()`, script synchrone anti-FOUC dans `<head>` et bouton `Verrouiller` dans l'en-tête.
   - Cibles tactiles `>= 44×44 px`, inputs `>= 16px`, `:focus-visible` contrasté, `@container`, `requestAnimationFrame` batching, `<dialog>` natif + repli, `copyReliable()` compatible `file:///`.
   - Arithmétique sécurisée (`parseFrenchFinancialInput`, calcul exact en centimes ou `micro-FCFA` avec parité `1 EUR = 655.957 FCFA`).
   - Aucune falsification silencieuse de saisie : préservation du texte saisi sur erreur (`aria-invalid="true"`) et blocage des calculs dépendants tant qu'un champ requis est invalide.
4. **Matrice de sauvegarde des données à 3 niveaux** :
   - *(a) Outil ponctuel* : mémoire vive volatile pure (0 persistance métier, aucun export JSON inutile).
   - *(b) Simulateur / Planificateur sauvegardé (modèle SOLDE)* : `StorageAdapter` (`localStorage` + repli RAM) + boutons **Exporter / Importer `.json`** + bouton **« Copier mon résumé »** en 1 clic.
   - *(c) Journal / Suivi multi-jours* : `StorageAdapter` + Export/Import `.json` obligatoire.
5. **Auto-critique pré-livraison** : Vérification des 5 critères visuels (incluant le verdict visible au-dessus de la ligne de flottaison à `375 px`) avant d'émettre le code complet de `<!DOCTYPE html>` à `</html>`.

---

## 3. Protocole d'Annonce Initiale

Lorsqu'un prompt invoque ce skill, confirme sa disponibilité dès la première ligne de réponse :
`[STATUT SKILL : ACTIF - ai-creator-design-intelligence chargé]`

Consulte les guides du dossier `references/` selon le besoin :
- `references/art-direction.md` : Entretien visuel, Quadrilatère de dérivation, Phrase conceptuelle, 3 pistes ouvertes.
- `references/app-interface-design.md` : Familles de produits, Cockpit Dual-Mode Mobile (`< 960 px`), matrice de sauvegarde à 3 niveaux, autonomie réseau.
- `references/frontend-craft.md` : Parseur monétaire, arithmétique `micro-FCFA`, `@container`, sliders peints, Donut SVG, `rAF` batching, `<dialog>`, `copyReliable()`, `.gate` unifié.
- `references/design-system.md` : Tokens sémantiques, surfaces teintées, WCAG AA.
- `references/anti-slop-and-copywriting.md` : Purpose test, copywriting français.
- `references/ai-creator-studio-dna.md` : Emprunter l'exigence structurelle sans copier la charte.
- `references/visual-quality-checklist.md` : Auto-critique en 5 questions pré-livraison (dont verdict visible à `375 px`).
