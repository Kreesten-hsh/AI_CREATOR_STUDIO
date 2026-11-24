# Catalogue des Composants Éditoriaux, Primitives & Poses Avatar

## 1. Composants Éditoriaux par Défaut (`engine/theme.ts` & `engine/components/Primitives.tsx`)

> **Règle (2026-11-24)** : Les nouvelles compositions (`EP03+`) utilisent par défaut le style **éditorial sobre** (`DEFAULT_VISUAL_STYLE = 'editorial'`, tokens `EDITORIAL` : `borderWidth: 1`, `shadow: 'none'`). Les composants néo-brutalistes historiques restent réservés aux archives `EP01`/`EP02` ou à une demande explicite (`variant="brutalist"`).

- **`EditorialCanvas`** : Toile fixe Studio Lin `#EAE3D5` **100 % plate et unie (zéro halo radial)**, centrée dans `SAFE_ZONES` (`y = 180..1560`).
- **`EditorialSurface`** : Surface ivoire `#FFFDFC` sobre par défaut (`border: 1px solid rgba(23, 19, 19, 0.14)`, `borderRadius: 16`, `boxShadow: 'none'`, zéro barre de titre logiciel).
- **`KineticWordLine` / `SingleLineSubtitle`** : Légende horizontale sur **une seule ligne** (`Plus Jakarta Sans 800`, `58px`, casse normale, mot-clé `#B63131`, espaces insécables `\u00A0`).
- **`WhipStageTransition`** : Transition directionnelle amortie avec `whoosh_soft.wav` sans cut sec.
- **`DemoStage`** : Mise en scène plein écran de démonstrations vidéo avec suivi caméra ressort critique.
- **`BadgePill`, `AccentBanner`, `SquareIconCard`, `MathStackCards`** : Rendu **éditorial sobre par défaut** (`variant = 'editorial'`, zéro ombre dure, zéro bordure épaisse).
- **`OfficialClaudeLogoSvg`** : Icône vectorielle officielle Claude.

## 2. Composants Historiques / Legacy (`EP01`, `EP02`, `template-showcase`)

*(Conservés uniquement pour rétrocompatibilité des archives — ne pas utiliser par défaut sur les nouveaux épisodes sans demande explicite.)*
- `RetroWindow` (`@deprecated` — chrome logiciel avec en-tête), `SHADOWS.brutal` (`6px 6px 0px #171313`), `FramedMediaCard` & `BrutalStackBar` (spécifiques à `Ep01Composition.tsx`).

## 3. Blueprints Remotion (`engine/blueprints/CoreBlueprints.tsx`)

- `BpHookQuestion` · `BpSplitTimeline` · `BpFrictionStack` · `BpCodeWindow` · `BpStatShock` · `BpVersusCompare` · `BpGrid2x2` · `BpLogoCarousel` · `BpDualCanvasMotion` · `BpKineticStrobe` · `BpCtaConversion`.
*(Adapter leur habillage à la DA Éditoriale Sobre et au CTA exact du brief avant utilisation dans un nouvel épisode.)*

## 4. Poses Avatar 3D (`AVATAR_POSES`, facultatif `20–30 %` max)

- `hookLeanIn` · `talkingConfident` · `thinkingChin` · `stopWarning` · `eurekaSnap` · `workingTablet` · `facepalmOops` · `amazedWow` · `armsCrossed` · `headBadge` · `workingLaptop`.
