# Catalogue des Composants Réels, Primitives, Blueprints & Poses Avatar 3D

## 1. Composants Éprouvés d'`Ep01Composition.tsx` (Standard Production)

- **`EditorialCanvas`** : Toile fixe unique Studio Lin `#EAE3D5` **100 % plate et unie (zéro halo radial)** + 2 bandes haut/bas `20px` Bordeaux `#B63131`, centrée dans `SAFE_ZONES` (`y = 180..1560`).
- **`SingleLineSubtitle`** : Légende horizontale sur **une seule ligne** (`Plus Jakarta Sans 800`, `58px`, casse normale, mot-clé en `#B63131`, espaces insécables `\u00A0`).
- **`FramedMediaCard`** : Carte `#FFFDFC` (`border: 4px solid #171313`, `boxShadow: 8px 8px 0px #171313`, `borderRadius: 18`, **sans barre de titre de fenêtre**), avec `bannerText` ou `overlayBannerText` (`GiantBanner`).
- **`GiantBanner`** : Cartouche Bordeaux `#B63131` (`Archivo Black`, `52px`, ombre dure `7px 7px 0px #171313`).
- **`BrutalStackBar`** : Barre horizontale empilable (`920×140px`, états neutre `#FFFDFC`, grisé `#E3DDD1`, inversé `#B63131`).
- **`AvatarBustStage`** : Buste 3D ancré en bas (`width: 840px`, `bottom: -16px`) + légende au-dessus (`captionTop = 480`).
- **`AvatarHeadCenter`** : Tête 3D détourée (`AVATAR_POSES.headBadge`, `headWidth = 460px`) centrée avec légende.
- **`OfficialClaudeLogoSvg`** : Logo vectoriel officiel Claude.

## 2. Primitives Complémentaires (`engine/components/Primitives.tsx`)

- **`RetroWindow`** : Carte éditoriale centrée `820px` (`#FFFDFC`, coins `20px`, en-tête `#EAE3D5` avec filet vertical `#B63131` sans carrés logiciel, ombre `6px 6px 0px #171313`).
- **`SquareIconCard`** : Carte icône `260×260px` centrée (`borderRadius: 20`) + SVG vectoriel + grand titre `54px` + `AccentBanner`.
- **`MathStackCards`** : 3 cartes `800px` (`borderRadius: 16`) empilées verticalement (dont boîte 3 en `#B63131`).
- **`ImpactTitleScreen`** : Titre punchline centré `Archivo Black` sans italique avec mot-clé `#B63131`.
- **`AvatarScene`** : Avatar 3D double contour centré (`560–640px`) + courte phrase (3–5 mots) au-dessus de la tête (à limiter à 20–30 % des plans).

## 3. Blueprints Remotion disponibles (`engine/blueprints/CoreBlueprints.tsx`)

- `BpHookQuestion` — Badge + `ImpactTitleScreen` (ou `AvatarBustStage` / `AvatarScene` ponctuelle).
- `BpSplitTimeline` — Comparatif 2 colonnes (`#E3DDD1` statique vs `#FFFDFC` actif) reliées par flèche `#B63131`.
- `BpFrictionStack` — Empilement en cascade de frictions barrées en `#B63131`.
- `BpCodeWindow` — Console sombre `#171313` ligne par ligne.
- `BpStatShock` — Compteur animé centré dans un cadre blanc `#FFFDFC` à ombre dure.
- `BpVersusCompare` — Comparaison structurée via `MathStackCards` ou `BrutalStackBar`.
- `BpGrid2x2` — Grille 4 tuiles symétriques `>= 24px` allumées séquentiellement (Connecteur 5).
- `BpLogoCarousel` — Bandeau horizontal animé de tuiles arrondies (`14px`).
- `BpDualCanvasMotion` — Dual PDF brut vs Guide interactif connecté.
- `BpKineticStrobe` — Alternance rapide d'`ImpactTitleScreen` sur le même fond `#EAE3D5` plat.
- `BpCtaConversion` — Carte centrée + `GiantBanner` / `AccentBanner` pour mot-clé ManyChat (`CLAUDE` / `PRODUIT`).

## 4. Les 11 Poses Avatar 3D Double Contour (`AVATAR_POSES`)

- `hookLeanIn` : penché avant, index levé — accroche directe.
- `talkingConfident` : paume ouverte, sourire posé — confiance & studio.
- `thinkingChin` : main au menton — diagnostic / réflexion.
- `stopWarning` : main en avant « Stop » — alerte anti-slop.
- `eurekaSnap` : claquement de doigt — déclic « zéro prise de tête technique ».
- `workingTablet` : concentré sur tablette — création avec Claude.
- `facepalmOops` : main sur le front — erreur PDF mort.
- `amazedWow` : ébahi, mains ouvertes — choc de résultat.
- `armsCrossed` : bras croisés confiants — autorité / clôture.
- `headBadge` : tête seule détourée — pivot rapide & bulle DM (`AvatarHeadCenter`).
- `workingLaptop` : concentré sur ordinateur — mise en place tranquille le soir.
