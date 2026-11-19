# STUDIO BIBLE • AI CREATOR STUDIO (DA, MOTEUR VIDÉO 9:16, CARROUSEL 4:5 & CONNECTEURS VISUELS)

> Bible technique et artistique unifiée d'**AI CREATOR Studio** (`Studio Lin`).
> Fusionne l'identité visuelle verrouillée, le moteur vidéo Remotion (`Ep01Composition.tsx` & `engine/`), l'audit viral `/100`, le système Carrousel `4:5` (`1080×1350` via `video-studio/carousels/`), les 10 blueprints `Sketch`, l'autopsie des références de `/home/hasashi/Vidéos/inspi` et la **Loi des 5 Connecteurs Visuels Obligatoires (« Zéro élément isolé »)**.
> Complète la bible éditoriale [VOICE_AND_COPY_BIBLE.md](./VOICE_AND_COPY_BIBLE.md) et le planning [CONTENT_PLAN_14_DAYS.md](./CONTENT_PLAN_14_DAYS.md).

---

## Table des Matières

1. [Section 1 : Direction Artistique Verrouillée (« Studio Lin » 100 % Plat)](#section-1--direction-artistique-verrouillée-studio-lin-100--plat)
2. [Section 2 : Architecture Réelle d'`Ep01Composition.tsx`, Primitives & Assets](#section-2--architecture-réelle-dep01compositiontsx-primitives--assets)
3. [Section 3 : Ingénierie Virale 9:16, Grille d'Audit `/100` & Protocole `TRIBE v2`](#section-3--ingénierie-virale-916-grille-daudit-100--protocole-tribe-v2)
4. [Section 4 : Système Complet Carrousel 4:5 (`420×525 → 1080×1350`) & Blueprints `Sketch`](#section-4--système-complet-carrousel-45-420525--10801350--blueprints-sketch)
5. [Section 5 : Cartographie des 16 Ressources Novitckii Auditées](#section-5--cartographie-des-16-ressources-novitckii-auditées)
6. [Section 6 : Autopsie des Vidéos de Référence (`/home/hasashi/Vidéos/inspi`) & Loi des Éléments Connectés](#section-6--autopsie-des-vidéos-de-référence-homehasashividéosinspi--loi-des-éléments-connectés)
7. [Section 7 : Bibliothèque de Mise en Scène Motion Design : 1 Épisode = 1 Univers Narratif Unique](#section-7--bibliothèque-de-mise-en-scène-motion-design--1-épisode--1-univers-narratif-unique)

---

## Section 1 : Direction Artistique Verrouillée (« Studio Lin » 100 % Plat)

Standard visuel minimaliste, géométrique et symétrique **Studio Lin** d'**AI CREATOR Studio** pour le format vertical **1080×1920 px @ 30fps** (Reels, TikTok, Shorts) et le format Carrousel **1080×1350 px (4:5)**.

### 1.1 Les 8 Lois Visuelles Absolues

1. **Décor unique, plat et fixe (« Studio Lin »)** : du premier au dernier frame (`00:00` à la fin), la toile est **toujours et uniquement** le beige lin sable `#EAE3D5` **100 % plat et uni (zéro halo radial blanc)**, encadré uniquement en haut et en bas par deux bandeaux `20px` Bordeaux `#B63131`. Aucun quadrillage technique ni changement de couleur de fond entre les scènes.
2. **Palette stricte Homme Chic (zéro rose)** :
   - **Toile & Surfaces** : `#EAE3D5` (lin sable plat et en-têtes éditoriaux), `#FFFDFC` (cartes lumineuses), `#E3DDD1` (surfaces ternes désaturées pour les mauvais exemples PDF).
   - **Structure & Encre** : Noir Encre `#171313` pour les titres, bordures nettes (`3.5px` à `4px solid #171313`) et ombres dures (`6px 6px 0px #171313` à `8px 8px 0px #171313`).
   - **Accent Unique Bordeaux** : `#B63131` (bandeaux haut/bas `20px`, bannières `GiantBanner`, mots-clés forts, barres de progression, boîte finale, flèches de connexion). **Zéro rose, zéro violet, zéro orange, zéro bleu néon.**
3. **Symétrie & Cartes Éditoriales Adoucies (zéro chrome logiciel)** : toutes les cartes (`FramedMediaCard`, `RetroWindow`, `BrutalStackBar`) sont centrées dans le canvas `1080×1920`, **sans les 3 petits carrés type fenêtre d'ordinateur** (et `FramedMediaCard` supprime même la barre de titre de fenêtre pour laisser respirer la preuve visuelle).
4. **Typographie parlée `SingleLineSubtitle` (zéro karaoké multi-mots)** : pas de boîtes karaoké animées en bas d'écran. Au-dessus des cartes ou de l'avatar, la phrase clé s'affiche sur **une seule ligne horizontale** via `SingleLineSubtitle` (`Plus Jakarta Sans 800`, `58px`, casse normale, mot-clé `#B63131`, espaces insécables `\u00A0`).
5. **Avatar 3D Ponctuel (`20 % à 30 %` des plans)** : utilisé sur les pivots émotionnels via `AvatarBustStage` (`width: 840px, bottom: -16px`) et `AvatarHeadCenter` (`width: 460px`), avec double contour circulaire franc (`14px` blanc `#FFFFFF` + `6px` noir `#171313`) intégré aux PNG de `assets/avatar/`.
6. **Stabilité Pixel-Perfect (zéro flottement, zéro saut Flexbox)** : aucun `Math.sin` sur l'avatar ; ressorts sans rebond (`spring({ damping: 28, stiffness: 300, mass: 0.7, overshootClamping: true })`) verrouillés à `transform: 'none'` dès stabilisation (`frame - enterFrame >= 8` ou `s >= 0.995`) ; bannières réservées dès frame 0 via `visibility: 'hidden'`.
7. **Zéro double barre oblique & zéro crochets `[` `]`** : bannis de tous les textes, titres, tags et badges affichés à l'écran. Utiliser uniquement `•` ou un espace.
8. **Loi d'Épure Visuelle Absolue (Zéro Texte ou Jauge Superflus)** :
   - **Interdiction absolue** d'inventer des jauges de pourcentage (`LECTURE : 0 %`, `VALEUR : 100 %`, `VALEUR : FAIBLE`), des numéros de version (`v2.0`), des sous-bandeaux redondants (`FICHIER PASSIF VS OUTIL ACTIF`), des tampons bruyants qui répètent le sous-titre (`PERSONNE NE LIT ÇA`) ou des parenthèses explicatives (`(GRATUIT)`, `(0 LIGNE)`).
   - Le seul texte directeur d'une scène est le sous-titre `Ep02Subtitle` en haut (synchronisé mot pour mot sur la voix) + le visuel pur au centre.

### 1.2 Typographie & Polices Embarquées (`video-studio/assets/fonts/`)

1. **Display Massif — `Archivo Black`** (`ArchivoBlack-latin.woff2`) :
   - Écrans d'impact (`ImpactTitleScreen`) : `64px–76px`, `line-height: 1.05`, majuscules, mots-clés en `#B63131`.
   - Bannières `GiantBanner` / `AccentBanner` : `40px–52px`, `#FFFDFC` sur `#B63131`.
2. **Corps, Légendes & Étiquettes — `Plus Jakarta Sans` (`700/800`)** :
   - `SingleLineSubtitle` : `58px`, `fontWeight: 800`, `lineHeight: 1.15`, casse normale, espaces insécables `\u00A0`.
   - Cartes et titres secondaires : `>= 24px` (lisibilité mobile garantie).
3. **Chiffres & Horloges — `JetBrains Mono` (`500/700`)** :
   - Numéros d'étapes (`01 •`), compteurs de temps (`06:12`), noms de fichiers `.pdf`.
4. **Annotations éditoriales — `Instrument Serif` (Regular / Italic) & `Caveat` (`700`)** :
   - Étiquettes manuscrites reliées autour de l'avatar (style `video_6` d'Abigail).

### 1.3 Géométrie & Safe Zones `1080×1920` (`SAFE_ZONES` dans `engine/theme.ts`)

```text
+------------------------------------------+  y = 0   (bande Bordeaux 20px)
|        ZONE INTERDITE HAUT (180 px)      |  UI plateforme / recherche
+------------------------------------------+  y = 180
|                                          |
|      ZONE ACTIVE CENTRÉE (880×1380)      |
|  FramedMediaCard • SingleLineSubtitle    |
|  BrutalStackBar • AvatarBustStage        |
|                                          |
+------------------------------------------+  y = 1560
|        ZONE INTERDITE BAS (360 px)       |  Compte, description, barre audio
+------------------------------------------+  y = 1920 (bande Bordeaux 20px)
```

---

## Section 2 : Architecture Réelle d'`Ep01Composition.tsx`, Primitives & Assets

### 2.1 Composants Réels du Handoff Ep01 (`episodes/ep01_produits_interactifs/Ep01Composition.tsx`)

Toute nouvelle composition Remotion (`ep02` à `ep06`, TOFU, MOFU) s'appuie sur ces briques éprouvées en production (`audit 100/100`) :

| Composant | Rôle & Spécifications Exactes |
|---|---|
| **`EditorialCanvas`** | Toile `#EAE3D5` 100 % plate et unie + 2 bandes Bordeaux `#B63131` (`height: 20px`) + conteneur centré respectant `SAFE_ZONES` (`top: 180`, `bottom: 360`). |
| **`SingleLineSubtitle`** | Sous-titre éditorial sur **une seule ligne horizontale** : `Plus Jakarta Sans 800`, `58px`, `lineHeight: 1.15`, `letterSpacing: -0.01em`, casse normale. Props `before`, `highlight` (`#B63131`), `after`, joints par espaces insécables `\u00A0`. |
| **`FramedMediaCard`** | Cadre `#FFFDFC`, `border: 4px solid #171313`, `borderRadius: 18`, `boxShadow: 8px 8px 0px #171313`, **sans barre de titre de fenêtre**. Supporte `bannerText` (en dessous) et `overlayBannerText` (chevauchant le bas à `bottom: -30`). |
| **`GiantBanner`** | Cartouche Bordeaux `#B63131` (`border: 4px solid #171313`, `boxShadow: 7px 7px 0px #171313`, `borderRadius: 14`, `Archivo Black`, `52px` majuscule), avec entrée `settledProgress` et `visibility: 'hidden'` avant `enterFrame`. |
| **`AvatarBustStage`** | Scène buste 3D ancrée en bas (`width: 840px`, `bottom: -16px`, `left: 50%`, `zIndex: 15`) + légende centrée en haut (`captionTop = 480`, `left/right: 44px`), recouverte proprement par la bande Bordeaux basse (`zIndex: 30`). |
| **`AvatarHeadCenter`** | Scène tête détourée (`AVATAR_POSES.headBadge`, `headWidth = 460px`) centrée avec `caption` au-dessus (`gap: 36px`), idéale pour les pivots rapides et bulles DM. |
| **`BrutalStackBar`** | Barre horizontale empilable (`width: 920px`, `height: 140px`, `borderRadius: 16`, `border: 4px solid #171313`), 3 états visuels : neutre (`#FFFDFC`), barré/grisé (`#E3DDD1`), inversé Bordeaux (`#B63131`). |
| **`OfficialClaudeLogoSvg`** | Icône vectorielle officielle Claude (`viewBox="0 0 24 24"`, `#D97757` par défaut ou `#B63131`). |

Les primitives historiques de `engine/components/Primitives.tsx` (`RetroWindow`, `SquareIconCard`, `MathStackCards`, `ImpactTitleScreen`, `AvatarScene`, `SfxCue`, `settledProgress`) et les 11 blueprints de `engine/blueprints/CoreBlueprints.tsx` restent disponibles en complément pour varier les structures entre épisodes.

### 2.2 Assets Réels Vérifiés (`video-studio/assets/`)

- **Preuves Produit & Captures Ep01 (`assets/ep01/`)** :
  - `pdf1-page1-portrait.png` : vrai PDF statique terne (contre-exemple 1).
  - `pdf2-page1-portrait.png` : vrai PDF générique ennuyeux (contre-exemple 2).
  - `platform-home-real.png` : capture réelle de la plateforme/guide interactif.
  - `demo-interactive-clean.mp4` : démonstration vidéo réelle de l'interface interactive (à utiliser avec `<OffthreadVideo>` recadré `4:3` + `MouseCursorSvg`).
  - `chariow-cover-square-1200x1200.png` : visuel officiel de couverture produit Chariow (jamais avec un tarif affiché dans la vidéo).
  - `voix_ep01.wav` : piste voix off ElevenLabs brute.
- **11 Poses Avatar 3D Double Contour (`AVATAR_POSES` dans `engine/theme.ts`)** :
  - `hookLeanIn` (`01_hook_lean_in.png`), `talkingConfident` (`02_talking_confident.png`), `thinkingChin` (`03_thinking_chin.png`), `stopWarning` (`04_stop_warning.png`), `eurekaSnap` (`05_eureka_snap.png`), `workingTablet` (`06_working_tablet.png`), `facepalmOops` (`07_facepalm_oops.png`), `amazedWow` (`08_amazed_wow.png`), `armsCrossed` (`09_relaxed_arms_crossed.png`), `headBadge` (`10_head_badge.png`), `workingLaptop` (`11_working_laptop.png`).
- **Kit SFX (`assets/sfx/`)** : `pop.wav`, `click.wav`, `stamp.wav`, `whoosh.wav`, `error_buzz.wav`, `chime_success.wav`, `key_tick.wav`, `check.wav`, `select.wav`, `whoosh_soft.wav`.

---

## Section 3 : Ingénierie Virale 9:16, Grille d'Audit `/100` & Protocole `TRIBE v2`

### 3.1 Cible, Vérité Produit & Promesses Autorisées

- **Cible 1 (Prioritaire)** : créateurs, coachs, formateurs, consultants, indépendants qui possèdent déjà une expertise, un document ou une méthode à transformer.
- **Cible 2 (Secondaire)** : débutants qui possèdent une compétence ou une idée et veulent lancer leur premier produit digital de manière différenciée.
- **Thèse centrale (Lire vs Utiliser)** : un bon PDF reste utile pour informer (ce que le client **lit**). Un produit digital interactif va plus loin : il permet au client d'**agir immédiatement** (calculer, diagnostiquer, cocher, suivre sa progression) depuis son téléphone.
- **Transformation réelle promise** :
  `Expertise, idée ou guide existant` → `Claude.ai gratuit (sans abonnement payant, sans savoir coder)` → `Produit digital interactif testé` → `Publié et prêt à livrer sur Chariow`.
- **Faits vérifiés du dépôt** :
  - Seul exemple d'application finie livré dans le cours : `Calculateur de Prix & Rentabilité` (conversion `FCFA` / `€` et écran de verrouillage par mot de passe). Tout autre exemple (budget, diagnostic, checklist métier) est présenté uniquement comme une **idée de création possible**.
  - Bonus 01 : automatisation ManyChat pour les **commentaires Facebook vers Messenger uniquement** (jamais Instagram ni TikTok).
  - Bonus 02 : **Marketing Library** (9 ressources de Skills marketing utilisables dans Claude ou ChatGPT + 1 prompt universel de recherche concurrentielle + 1 lien de veille externe `novitckii.com/resources/`).
- **Interdictions strictes** :
  - Jamais promettre de chiffre d'affaires, de ventes garanties ou de revenus automatiques.
  - Jamais appeler le cursus un « challenge » (toujours **Mini-Cours** ou **AI CREATOR Studio**).
  - **Zéro prix, tarif ou devise en public** dans les vidéos et carrousels (le tarif vit uniquement sur Chariow).

### 3.2 Les 3 Lois Physiques de la Rétention Verticale

1. **Loi du Contexte Immédiat (`< 800 ms`)** : dès la frame 1 (`0.0s`), la promesse ou la tension visuelle + la carte comparative centrée s'affichent sur le fond plat `#EAE3D5`.
2. **Loi du Contrarian Snapback (`1–3 s`)** : exposer immédiatement pourquoi les PDF génériques ou textes IA échouent avant de révéler l'alternative interactive.
3. **Loi des Open Loops Récurrentes (`~8–12 s` et `~18–25 s`)** : relancer la curiosité avec un changement de scène connecté (`FramedMediaCard` → `BrutalStackBar` → `AvatarBustStage` → `demo-interactive-clean.mp4` → Carton `CLAUDE` / `PRODUIT`).

### 3.3 Grille d'Audit Viral Obligatoire (Score `/100` • Seuil `>= 90`) & Contrôle Visuel DOM

Chaque épisode doit être contrôlé avant rendu final via `node scripts/audit_episode.mjs <episode>` (et avec `--visual` pour l'inspection DOM + planche contact) :

- **Audit Visuel DOM & Planche Contact obligatoire avant livraison** :
  - Exécuter `node scripts/audit_episode.mjs episodes/<slug> --visual` (ou directement `node scripts/visual_audit.mjs <CompositionId> <slug>`).
  - Le contrôleur inspecte 12 frames clés via Remotion/Chromium headless pour vérifier : **zéro texte coupé** (`scrollWidth <= clientWidth + 2`), **zéro sortie du cadre `1080×1920`**, et **zéro violation des Safe Zones** (`top >= 174` et `bottom <= 1566`, hors bandeaux `20px` `#B63131` et avatar bas).
  - Inspecter obligatoirement `/tmp/remotion-audit/<slug>_planche.jpg` (toujours stocké dans `/tmp/remotion-audit/` pour zéro pollution Git) avant le rendu MP4 final.

| Critère | Exigence bloquante | Points |
|---|---|---:|
| **1. Hook `< 800 ms`** | Sujet + tension ou preuve visuelle visible dès la frame 1 | `15` |
| **2. Contrarian Snapback** | Rupture nette avec une idée reçue dans les `3` premières secondes | `10` |
| **3. Open Loop #1 (`6–15 s`)** | Relance visuelle majeure connectée à la scène précédente | `10` |
| **4. Open Loop #2 (`18–32 s`)** | Preuve concrète (`demo-interactive-clean.mp4`) ou bascule vers le CTA ManyChat | `10` |
| **5. Densité Visuelle** | Aucun plan statique `>= 2,5 s` ; appui visuel ou sonore toutes les `1,0–2,2 s` | `15` |
| **6. Unicité Inter-Épisodes** | Combinaison différente des 3 derniers épisodes de `HISTORY.md` + `>= 2` scènes sur mesure | `15` |
| **7. Fidélité Produit & Zéro Slop** | Promesse fidèle, zéro mot « challenge », zéro prix public, zéro double barre oblique | `10` |
| **8. Symétrie & Safe Zones `9:16`** | Tout élément centré, fond `#EAE3D5` 100 % plat, bandes `20px #B63131`, cartes `#FFFDFC` | `10` |
| **9. CTA Unique & Frictionless** | Une seule consigne claire en fin de vidéo (`CLAUDE`, `PRODUIT`, ou abonnement/enregistrement) | `5` |
| **TOTAL** | **Publication bloquée sous `90/100`** | **`/100`** |

### 3.4 Enseignements `Creator Lab`, `Ad Lab` & Protocole Audio `TRIBE v2`

- **Structures gagnantes (`Creator Lab`, 431 Reels)** : *Steps* (`612,5K` médiane) et *Story* (`494,1K`) surclassent le *Problem → Solution* générique (`315K`). Les enjeux humains vécus (`714K`) battent la théorie business (`338K`). Durée optimale `35–55 s` si chaque seconde montre une preuve.
- **Taxonomie 7 axes (`Ad Lab` / `OpenAI Decisions`)** : `Format • Hook • Angle • Offre • Preuve • Objection traitée • CTA`.
- **Protocole `TRIBE v2` & Règle Audio Non Négociable n°3** :
  - **Piste ElevenLabs brute (`voix_epXX.wav`)** : ne **JAMAIS** exécuter `scripts/prepare_audio.mjs` ni `silenceremove` sur les pistes ElevenLabs afin de préserver les pauses dramatiques naturelles. **C'est la voix qui commande le montage.**
  - Corriger les chutes `0–3 s` (hook `< 12 mots`), injecter des Open Loops à `10–22 s`, interdire tout plan inerte `>= 2,5 s`, et caler chaque `SfxCue` à la frame exacte du `transcript.json`.

---

## Section 4 : Système Complet Carrousel 4:5 (`1080×1350` Plein Format) & Blueprints `Sketch`

### 4.1 Les 10 Lois Algorithmiques (Data 10 743 carrousels)

1. **Chiffre dès la Slide 1** (`24,6 %` vs `21,4 %`) : quantités (`7 types`, `5 signes`, `5 erreurs`), jamais de prix ni de devise.
2. **Longueur standard `10 à 12 slides`** (plage `10–15 slides` : `26,8 %` à `28,0 %` doublent).
3. **Format *Cheat sheet / Checklist* roi** : `37,5 %` de sur-performance (`Liste` `26,1 %`, `Pas-à-pas` `25,1 %`, `Hot take` `24,5 %`, `Storytelling` `23,3 %`).
4. **CTA unique** : sur les posts Découverte (TOFU), demander explicitement **l'enregistrement** (`32,8 %` vs `24,9 %`) ou le partage ; sur les posts Confiance/Vente (MOFU/BOFU), demander de commenter **`CLAUDE`** (ou d'envoyer un message privé).
5. **Couverture ultra-courte (`6 à 10 mots`)** (`25,6 %` vs `20,2 %`).
6. **Mot « GRATUIT » sur Slide 1** uniquement quand il est factuel (*Claude gratuit*, *Checklist gratuite*) (`40,0 %` vs `25,8 %`).
7. **100 % images (zéro vidéo dans un carrousel)** (`26,7 %` images seules vs `21,3 %` avec vidéo).
8. **Légende de `120 à 250 mots`** (`30,3 %` vs `25,3 %`) : apporte du contexte sans répéter les slides.
9. **Bannir « lien en bio » en légende** (`26,5 %` sans lien vs `19,4 %` avec).
10. **Composition `Studio Lin`** : fond `#EAE3D5` plat, cartes `#FFFDFC`, bordures `#171313` (`4px`), ombre dure `7px 7px 0px #171313`, bandes haut/bas Bordeaux `#B63131` (`20px`), une seule idée par slide, connexion visuelle continue entre les slides.

### 4.2 Le Catalogue des 10 Types de Carrousels

| Type Novitckii | Sur-performance | Structure narrative (Slide 1 → Fin) | Usage `AI CREATOR Studio` |
|---|---|---|---|
| **1. Storytelling** | `26×` à `201×` | Scène vécue → blocage (*MAIS*) → pivot (*DONC*) → morale + CTA | Récits de transformation (« Effet Kevin à 6h12 », « Zéro technique »). |
| **2. Cheat Sheet** | **`37,5 %`** | Promesse chiffrée + « GRATUIT » → 1 règle actionnable/carte → checklist | Checklist 7 étapes (`N°12`), flux `Notes → Claude → Glisser-déposer → Chariow`. |
| **3. This-versus-That** | `17×` à `110×` | Opposition frontale → 1 critère comparé par slide (`#E3DDD1` vs `#FFFDFC`) → verdict | Carrousel Fondamental 2 (`N°06`), Océan Rouge vs Océan Bleu (`N°19`). |
| **4. Breakdown** | `14×` à `108×` | Résultat concret → démontage étape par étape → leçon clé | Carrousel Fondamental 1 (`N°02`), Crash-test Note WhatsApp (`N°05`). |
| **5. Step-by-Step** | `50×` à `435×` | Objectif + contrainte levée (« zéro technique ») → `01`, `02`, `03`… → récap | Workflow création sur Claude gratuit. |
| **6. List** | `104×` à `663×` | Nombre exact → 1 cas concret/slide → demande d'enregistrement | 7 Guides Interactifs (`N°09`). |
| **7. Hot Take** | `37×` à `130×` | Affirmation tranchée sur une méthode → preuves → quoi faire ce soir | Fin des ebooks IA génériques (`N°15`). |
| **8. Which-One-Are-You** | `4,7×` à `20×` | `POV : ...` → archétypes hebdomadaires → sortie par le haut | Satire des PDF génériques & tics ChatGPT. |
| **9. Breaking News** | `8,5×` à `48×` | Fait nouveau daté → impact concret → comment en profiter | Nouveautés Claude gratuit. |
| **10. Eye Candy** | `42×` à `131×` | Captures haute netteté avant/après couplées à un Breakdown | Preuves `platform-home-real.png` sur `#EAE3D5`. |

### 4.3 Règles `/carousel-copy`, `/design-taste` & `Anchor Slide`

- **7 Verrous `/carousel-copy`** : (1) Slide 1 = `6–10 mots` sans intro ; (2) jamais de Slide Sommaire, la Slide 2 livre le premier gain ; (3) 1 seule idée par slide ; (4) `<= 25 mots` par slide ; (5) métaphore visuelle connectée sur chaque slide ; (6) au moins 1 phrase *screenshotable* ; (7) dernière slide = 1 seul CTA sans flèche de swipe.
- **Protocole `3 Variantes → Anchor Slide`** : générer 3 variantes structurelles de Slide 1 et de Slide 2 ; la gagnante de Slide 2 devient l'**Anchor Slide** dont les Slides `3..N-1` reproduisent exactement marges, typo et palette en ne changeant que le texte et le schéma central connecté.

### 4.4 Moteur Interne Carrousel 4:5 (`video-studio/carousels/`) & Audit Planche Contact

Le workflow complet est piloté par le skill interne [carousel-studio](file:///home/hasashi/Bureau/AI_CREATOR_STUDIO/.agents/skills/carousel-studio/SKILL.md) et l'architecture par calques de `video-studio/carousels/` :

- **Fichiers du moteur** :
  - `video-studio/carousels/carousel.css` : toile `1080×1350` (ou `1080×1440` via `--size`), thème Studio Lin (`#EAE3D5`, `#FFFDFC`, `#171313`, `#B63131`, `#E3DDD1`), polices locales embarquées (`video-studio/assets/fonts/`).
  - `video-studio/carousels/slide.html` : gabarit par calques `.L` positionnés (`left`, `top`, `width` inline).
  - `video-studio/carousels/check.js` : script d'audit `#check` qui détecte débordements, chevauchements, sorties de marge Studio Lin et textes `< 28px`.
  - `video-studio/carousels/render_carousel.mjs` : rendu PNG haute définition (`<dossier>/png/slide-XX.png`, ignoré par Git via `video-studio/.gitignore`) + planche contact d'audit `/tmp/carousel-audit/<slug>/sheet.png`.
- **Règle Typographique Non Négociable (Zéro texte `< 28px`)** :
  - **Titres principaux** : `Archivo Black` **`64px–74px`** (`line-height: 1.04–1.06`).
  - **Corps & cartes** : `Plus Jakarta Sans 700/800` **`34px–48px`**.
  - **Accents éditoriaux** : `Instrument Serif Italic` (`em.hl`).
  - **Badges, kickers, compteurs** : `JetBrains Mono 700` **`>= 28px`**.
- **Commande standard** :

```bash
node video-studio/carousels/render_carousel.mjs video-studio/carousels/<slug>
```

Inspecter systématiquement `/tmp/carousel-audit/<slug>/sheet.png` pour vérifier l'absence de tout contour rouge `#FF2D2D` avant publication.

### 4.5 Les 10 Blueprints `Sketch` & Réalisme UGC

Verrouiller systématiquement les prompts `Sketch` sur **`#EAE3D5` (lin plat) • `#FFFDFC` (ivoire) • `#171313` (encre noire) • `#B63131` (bordeaux)** :
1. **Vignette / Couverture 9:16** (personnage à gauche + objet contrasté à droite, zone libre en haut).
2. **Slide Carrousel 3 Boîtes** (titre haut + croquis centre + encadré bas).
3. **Diagramme `Boxes + Arrows`** (`Idée` → `Claude Gratuit` → `Guide Interactif`).
4. **Personnage à 3 traits fixes** (lunettes rondes noires, chemise beige sur t-shirt noir, montre poignet gauche).
5. **Mockup Téléphone** (intégrer nos vraies captures sans modifier boutons ni textes).
6. **Affiche Manifeste** (*« LES PDF DORMENT / LES OUTILS CLIQUENT »*).
7. **Wireframe / Interface mobile** (gros boutons tactiles `#FFFDFC` + `#B63131`).
8. **Scène de vie / Bureau matin** (laptop, carnet, lumière du matin).
9. **Symbole / Monogramme** (2 couleurs `#171313` + `#B63131`, lisible en `48px`).
10. **Carte Physique** (table bois clair, lumière douce naturelle).

**Prompt Maître « Croquis Océan Bleu »** : fond lin `#EAE3D5` plat, feutre noir `#171313`, accent unique `#B63131`, zéro dégradé, zone active `9:16` centrée (`18 %` haut / `20 %` bas libres).
**Réalisme UGC (si photo requise)** : micro-pores, brillance naturelle, focale `26mm` iPhone, grain ISO `500–900`, lumière disponible mixte.

---

## Section 5 : Cartographie des 16 Ressources Novitckii Auditées

| # | URL Novitckii (`novitckii.com/resources/...`) | Apport intégré dans `STUDIO_BIBLE.md` & `VOICE_AND_COPY_BIBLE.md` |
|---|---|---|
| 1 | `carousel-types/#storytelling` | Catalogue des 10 formats de carrousels (`#storytelling`, `#this-versus-that`) |
| 2 | `sketch/` | 10 blueprints de croquis convertis aux tokens `Studio Lin` |
| 3 | `editing-skills/` | 6 archétypes de plans (`trial-reels`, `behind-the-person`, `explainer`, `split-screen`, `ranking-list`, `storytelling`) |
| 4 | `claude-carousel-skill` | Moteur HTML par calques `.L` (`1080×1350` / `1080×1440`) + audit DOM `#check` + planche contact (`video-studio/carousels/`) |
| 5 | `how-to-generate-hyper-realistic-ai-images/` | Protocole réalisme UGC (`26mm`, ISO `500–900`, lumière mixte) |
| 6 | `how-to-make-instagram-carousels-with-chatgpt-image/` | Workflow `Reference-First` + `3 Variantes → Anchor Slide` |
| 7 | `ad-lab/#guide` | Benchmarks pub 7 dimensions (`Ad Lab`) |
| 8 | `creator-lab/` | Étude 431 Reels Hormozi (`Steps 612,5K`, `Story 494,1K`, enjeux humains `714K`) |
| 9 | `resources/` | Index des 98 guides du hub |
| 10 | `openai-decisions-marketing/` | Taxonomie `Format • Hook • Angle • Offre • Preuve • Objection • CTA` |
| 11 | `viral-carousels/` | 10 lois chiffrées sur `10 743` carrousels Instagram |
| 12 | `carousel-playbook/` | Scission Copy avant Design (`<= 25 mots/slide`) |
| 13 | `animation-skills/` | 6 skills d'animation faceless transposés à Remotion (`breakdown`, `graph`, etc.) |
| 14 | `viral-engine-the-full-guide/` | Protocole attentionnel `TRIBE v2` |
| 15 | `content-skills/` | Pipeline `dumbify → storytelling MAIS/DONC → viral-hooks → anti-ai-writing → voice-dna` |
| 16 | `anti-ai-writing-rules/` | 5 maladies IA + interdiction du *negative parallelism* + échelle de spécificité |

---

## Section 6 : Autopsie des Vidéos de Référence (`/home/hasashi/Vidéos/inspi`) & Loi des Éléments Connectés

### 6.1 Statut des sources

| Réf. | Fichier | Durée | Créatrice | Statut |
|---|---|---|---|---|
| `video_1` | `As someone that has been selling digital products for 4+ years...mp4` | 01:05 | Abigail Peugh | Transcription fournie |
| `video_2` | `✨ Comment "HOW" and I'll send you my free video...mp4` | 00:48 | Melissa Landry | Visionnée sur disque |
| `video_3` | `Comparing entrepreneurs that sell digital products...mp4` | 00:43 | Melissa Landry | Visionnée sur disque |
| `video_4` | `Digital Products that make...mp4` | 01:00 | Melissa Landry | Visionnée sur disque |
| `video_5` | `Instagram Bio Audit (Nail Tech Edition)...mp4` | 01:21 | Audit au stylet | Transcription fournie |
| `video_6` | `No one's talking about this, so I will.mp4` | 00:47 | Abigail Peugh | Transcription fournie |
| `video_7` | `If I Woke Up Broke...mp4` | 00:55 | @buildwealthwithchels | Transcription fournie |
| `video_8` | `three months ago i was taking notes on other people's launches...mp4` | 01:34 | Abigail Peugh | Transcription fournie |
| Bonus | `Probably the hottest take I've had in a while...mp4` | 01:34 | Abigail Peugh | Visionnée sur disque |
| Océan Bleu | Vidéo française (rasoirs Dollar Shave Club) | 01:54 | Créateur FR | Visionnée |

> Les montants en dollars présents dans les références américaines ne sont **jamais** repris chez nous : ils sont transposés en paliers qualitatifs (`MAUVAIS • MIEUX • LE TOP`, `NIVEAU 1 • 2 • 3`, `PRODUIT QUI DORT • PRODUIT QU'ON UTILISE`).

### 6.2 Fiches d'autopsie (langage parlé + mécanique connectée)

- **`video_1` • Abigail Peugh • « What if instead of this... » (source EP04)** : anaphore répétée → désamorçage (*« I'm not here to scare you »*) → projection du soir. La carte `BEFORE` au-dessus de sa tête se transforme **sur place** en version interactive ; les avis clients s'empilent en cascade à la fin sans s'effacer (`Connecteurs 1 + 4`).
- **`video_2` • Melissa Landry • « BAD / BETTER / BEST »** : répétition ternaire stricte sur 4 cas du quotidien. Bandeau à 3 colonnes **fixe en haut toute la vidéo** (`MAUVAIS • MIEUX • LE TOP`), l'objet central s'upgrade en direct à chaque phrase (`Connecteur 2`).
- **`video_3` • Melissa Landry • 3 créatrices côte à côte** : 3 colonnes fixes (`NIVEAU 1 • 2 • 3`), 3 écrans reliés par des flèches rouges courbes à `0:11`, arbre de décision en losanges à `0:24` (`Connecteurs 2 + 1`).
- **`video_4` • Melissa Landry • 3 niveaux par thème** : double bandeau permanent (`PRODUIT QUI DORT • PRODUIT QU'ON UTILISE` + sous-bandeau `THÈME : CUISINE / COIFFURE / RÉVISIONS / ORGANISATION`), le support évolue à vue (`Connecteur 2`).
- **`video_5` • Audit au stylet** : un seul écran continu du début à la fin ; on entoure en `#B63131` la zone faible puis on trace une flèche vers la version corrigée en gardant les annotations empilées (`Connecteurs 1 + 4`).
- **`video_6` • Abigail Peugh • « Everyone is talking about... » (source EP03)** : étiquettes en `Instrument Serif Italic` reliées au visage par de fins traits `#171313` sur mur de preuves (`Connecteur 3`).
- **`video_7` • @buildwealthwithchels • « Step #1 to Step #5 »** : modèle de référence absolu : la carte A glisse à gauche, une flèche se dessine, la carte B apparaît à droite (**les deux restent visibles**), puis 3 formats (`50 % / 30 % / 20 %`) reliés par flèches courbes vers l'entonnoir (`Connecteur 1`).
- **`video_8` • Abigail Peugh • « Launch Playbook » en 3 étapes** : éventail de 6 cartes (`0:06`), grappe de 5 bulles questions autour d'elle (`0:39`), orbite pointillée reliant `Claude` et `ManyChat` (`0:46`), grille de 12 cartes (`1:01`), dépliage du guide en grille `3×3` de 9 pages connectées (`1:25`) (`Connecteurs 4 + 3 + 5`).
- **Bonus • Abigail Peugh • « Hottest take »** : attaque frontale des PDF qui pourrissent dans la boîte mail ; offre traduite en **Mini-Cours Guidé en 3 jours** (nourrit `N°15`).
- **Océan Bleu • Vidéo FR** : boîtes empilées `1900 → 1950 → 2000` → territoire rouge prolongé dans le même plan vers l'océan bleu → boulanger Kevin à `6h12` (nourrit `N°01`, `Connecteurs 1 + 4`).

### 6.3 La Loi des Éléments Connectés : les 5 connecteurs obligatoires (« Zéro élément isolé »)

Dans toutes nos vidéos Remotion et nos carrousels, **un élément visuel n'apparaît jamais seul pour disparaître sans lien**. Chaque scène utilise au moins un de ces 5 connecteurs :

| # | Connecteur | Règle de mise en scène | Implémentation Studio Lin (`video-studio/engine/`) | Références |
|---|---|---|---|---|
| **1** | **Transformation côte à côte (A → B)** | La carte « Avant » glisse ou reste en place, une flèche animée la relie à la carte « Après ». Les deux restent visibles ensemble. | Carte `#E3DDD1` à gauche, `FramedMediaCard` `#FFFDFC` à droite, flèche SVG `#B63131` tracée par `strokeDashoffset` + `settledProgress`. | `video_1`, `video_5`, `video_7`, Océan Bleu |
| **2** | **Bandeau de comparaison fixe à 3 colonnes** | Le bandeau reste ancré en haut toute la séquence (`MAUVAIS • MIEUX • LE TOP` ou `NIVEAU 1 • 2 • 3`), l'exemple central évolue sous chaque palier. | Bandeau ivoire juste sous la safe zone (`y = 190`), colonne active en `#B63131`, réservé dès frame 0 (`visibility: hidden`). | `video_2`, `video_3`, `video_4` |
| **3** | **Orbite pointillée / réseau connecté** | Autour de l'avatar ou de l'idée centrale, les briques (`Ton savoir`, `Claude`, `Guide interactif`) sont reliées par un tracé pointillé continu. | Cercle SVG `stroke-dasharray: 10 12` en `#171313`, pastilles ivoire sur l'orbite, apparition séquencée au mot près. | `video_6`, `video_8` |
| **4** | **Empilement en cascade (stacking)** | Les preuves, étapes ou questions s'accumulent à l'écran au lieu de se remplacer sèchement. | Cartes ou `BrutalStackBar` décalées avec ombre dure, entrée sur `pop.wav`, aucune sortie avant la fin de la séquence. | `video_1`, `video_5`, `video_8` |
| **5** | **Dépliage en grille (1 carte → 2×2 ou 3×3)** | Une carte centrale s'ouvre en plusieurs écrans connectés pour montrer toute la richesse du parcours. | Carte centrale qui se divise en 4 ou 9 tuiles ivoire reliées par des filets `#171313`, dans la zone active `y = 180..1560`. | `video_8` |

**Règle carrousel** : sur un carrousel 4:5, le connecteur traverse les slides. Un élément de la slide N réapparaît (en miniature, en bandeau ou au bout d'une flèche `#B63131`) sur la slide N+1, pour que le swipe se lise comme un seul plan continu.

---

## Section 7 : Bibliothèque de Mise en Scène Motion Design : 1 Épisode = 1 Univers Narratif Unique

> **Règle Absolue d'AI CREATOR Studio** : *« Une DA commune (`#EAE3D5`, `#FFFDFC`, `#171313`, `#B63131`). Six histoires visuelles différentes. Aucun épisode ne doit ressembler à une déclinaison graphique du précédent. »*

Synthèse opérationnelle extraite des ressources `novitckii.com/resources/animation-styles/`, `editing-skills/` et `animation-skills/` (`claude-animation-skills`), transposée en Remotion sur la toile Studio Lin :

### 7.1 Techniques Programmatiques Maîtresses

| Technique Source | Mécanique Motion Design Concrète | Transposition Remotion (`Studio Lin`) |
|---|---|---|
| **`/minimalistic-graphics`** | Tracés vectoriels progressifs par `strokeDasharray` / `strokeDashoffset`, masques SVG `<mask>` sur tracés pointillés, impulsions concentriques (`ripple` / `pulse`), anticipation & atterrissage amorti, bascule mécanique (toggle switch), morphing continu de cartes et bascule de caméra sans cut sec. | Conduire chaque valeur via `interpolate` + `settledProgress` (zéro timer CSS). Relier les étapes par flèches et rails SVG auto-tracés en `#171313` / `#B63131`, et déclencher un `ripple` concentrique à l'instant exact du clic. |
| **`/breakdown`** | Un objet ou écran plat démarre assemblé, pivote en perspective 3D isométrique, puis se détache en calques échelonnés (`ORDER`) reliés chacun par une ligne de rappel coudée (`leader line` dot → elbow → label numéroté `01..06`) avant réassemblage ou mise en lumière. | Conteneur `perspective: 1200px` + `transformStyle: 'preserve-3d'` combinant `rotateX`, `rotateY` et `translateZ` progressifs par calque, couplés aux connecteurs vectoriels coudés et pastilles numérotées `01 • 02 • 03`. |
| **`animation-styles`** (`low-poly`, `minecraft`, `zach-3d-films`, `kurzgesagt`, `dan-koe`) | Chaque style impose une grammaire spatiale unique : construction bloc par bloc avec flash de finalisation (`minecraft`), ramification progressive à partir d'un nœud (`dan-koe`), comparaison à l'échelle par tags contrastés (`kurzgesagt`), impact ralenti + onde de choc rouge (`zach-3d-films`). | Traduire l'énergie du concept en géométrie 2D/2.5D Studio Lin : onde de choc `#B63131`, construction modulaire aimantée, arborescence SVG ou balance de valeur en perspective plutôt qu'un empilement générique de barres. |
| **`editing-skills`** (`trial-reels`, `behind-the-person`, `explainer`, `split-screen`, `ranking-list`, `storytelling`) | Ancrage temporel strict au mot parlé (`word-timestamp anchoring`), flèche de comparaison auto-tracée entre Avant et Après (`/explainer`), fenêtre d'interaction guidée par curseur + checklist cochée en direct (`/split-screen`), persistance de l'arrière-plan en plan-séquence (`/storytelling`). | Caler chaque événement (`typing`, `click`, `stamp`, `toggle`, `ripple`, `check`, `select`, `whoosh_soft`) sur la frame exacte de `transcript.json`. Relier les actes par glissement/profondeur (`translateY` / `scale` amorti) ou via `WhipStageTransition` pour supprimer les coupes sèches. |
| **Physique Motion Design (`Primitives.tsx`)** | Courbes différenciées (entrée rapide `expoOut`, évacuation accélérée `inQuart`, glissement nerveux `whipProgress`, ressort sous-amorti `snapProgress`, enveloppe `bellCurve`, impact vocal `punchScale`), flou directionnel SVG actif uniquement en mouvement et révélation mot-à-mot par masque vertical. | Utiliser `WhipStageTransition` (avec `whoosh_soft.wav`) pour enchaîner deux actes sans cut sec tout en gardant `filter: 'none'` et `transform: 'none'` au repos, et `KineticWordLine` en variante cinétique sur une ligne du sous-titre haut éditorial (`Plus Jakarta Sans 800`, `58px`, casse normale). |

### 7.2 Verrouillage Anti-Clonage des Épisodes (`EP01` vs `EP02`+)

- **`EP01` (`ep01_produits_interactifs`)** : ouverture avatar `AvatarBustStage` (`hookLeanIn`), portraits PDF plein écran, `BrutalStackBar` empilées et carton ManyChat standard.
- **`EP02` (`ep02_bonnes_instructions`)** : **zéro `AvatarBustStage`, zéro `BrutalStackBar`, zéro texte ou jauge superflu**. Univers en **5 Actes Continus** : ouverture directe sur l'interface Claude (frappe `key_tick.wav` + clic envoi) → cascade verticale des **4 vraies pages PDF** (`pdf1/pdf2` pages 1 & 2) assombries + tracé vectoriel en `X` bordeaux épuré → carte `INSTRUCTIONS CLAUDE` à 3 modules aimantés + clic sur `TRANSFORMER L'IDÉE` + **Scanner Laser Pur Avant → Après** (`900×960px`, ligne laser `8px` `#B63131` sans texte révélant `platform-home-real.png`) → démo live `<OffthreadVideo>` (`920×680px` + `RipplePulse`) + comparatif épuré à 2 cartes (`FICHIER TEXTE` barrée/affaissée vs `OUTIL INTERACTIF ✓`) → 2 interrupteurs mécaniques (`SANS ABONNEMENT`, `SANS CODER`) + saisie `CLAUDE` remontant vers la carte DM ouverte (`chariow-cover-square-1200x1200.png` `280×280px` + phrase unique).
- **Règle pour `EP03`–`EP06`** : ces 4 nouveaux épisodes couvrent chacun un angle inédit (5 types de produits interactifs, signes qu'une fiche mérite de devenir un outil, démo réelle depuis 1 fiche d'une page, visite guidée transparente d'AI CREATOR Studio), sans répéter « PDF générique vs produit interactif » et avec une mécanique d'ouverture et une structure spatiale absentes des 3 lignes précédentes de [HISTORY.md](../episodes/HISTORY.md).
