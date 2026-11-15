# Catalogue des Primitives, Blueprints & Poses Avatar 3D

## Les 4 Primitives Principales (`engine/components/Primitives.tsx`)

- `EditorialCanvas` : Toile fixe unique Studio Lin & Spotlight (`#EAE3D5` + halo blanc `#FFFDFC` + filets haut/bas `#B63131`) centrée verticalement et horizontalement.
- `RetroWindow` : Carte éditoriale centrée `820px` (`#FFFDFC`, coins `20px`, en-tête `#EAE3D5` avec filet vertical `#B63131` sans carrés logiciel, ombre `6px 6px 0px #171313`) + `AccentBanner` optionnel en dessous.
- `SquareIconCard` : Carte icône `260×260px` centrée (`borderRadius: 20`) + SVG vectoriel net + grand titre `54px` + `AccentBanner`.
- `MathStackCards` : 3 cartes `800px` (`borderRadius: 16`) empilées verticalement (dont boîte 3 en `#B63131` blanc sur bordeaux) pour démontrer une équation de valeur.
- `ImpactTitleScreen` : Titre punchline centré `Archivo Black` sans italique avec mot-clé `#B63131`.
- `AvatarScene` : Avatar 3D double contour centré (`560–640px`) + courte phrase centrée (3–5 mots) au-dessus de la tête (à limiter à 20–30 % des plans).

## Blueprints Remotion disponibles (`engine/blueprints/CoreBlueprints.tsx`)

- `BpHookQuestion` — Badge + `ImpactTitleScreen` (ou `AvatarScene` ponctuelle).
- `BpSplitTimeline` — `RetroWindow` comparative 2 colonnes (`#E3DDD1` statique vs `#FFFDFC` actif).
- `BpFrictionStack` — `RetroWindow` empilant des frictions barrées en `#B63131`.
- `BpCodeWindow` — `RetroWindow` embarquant une console sombre `#171313` ligne par ligne.
- `BpStatShock` — Compteur animé centré dans un cadre blanc `#FFFDFC` à ombre dure.
- `BpVersusCompare` — Comparaison mathématique via `MathStackCards`.
- `BpGrid2x2` — `RetroWindow` 4 tuiles symétriques `>= 24px` allumées séquentiellement.
- `BpLogoCarousel` — Bandeau horizontal animé de tuiles arrondies (`14px`).
- `BpDualCanvasMotion` — `RetroWindow` dual PDF brut vs Outil interactif.
- `BpKineticStrobe` — Alternance rapide d'`ImpactTitleScreen` sur le même décor Studio Lin & Spotlight.
- `BpCtaConversion` — Carte centrée + `AccentBanner` pour mot-clé ManyChat.

## Poses Avatar 3D Double Contour (`AVATAR_POSES`)

- `hookLeanIn` : penché avant, index levé — accroche directe.
- `talkingConfident` : paume ouverte, sourire posé — confiance & studio.
- `thinkingChin` : main au menton — diagnostic / réflexion.
- `stopWarning` : main en avant « Stop » — alerte anti-slop.
- `eurekaSnap` : claquement de doigt — déclic « même sans coder ».
- `workingTablet` : concentré sur tablette — création avec Claude.
- `facepalmOops` : main sur le front — erreur PDF mort.
- `amazedWow` : ébahi, mains ouvertes — choc de résultat.
- `armsCrossed` : bras croisés confiants — autorité / clôture.
- `headBadge` : tête seule détourée — miniature ronde pour bulle de réponse DM.
