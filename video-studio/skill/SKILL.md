---
name: ai-creator-video-studio
description: Directeur de création vidéo 9:16 faceless pour AI CREATOR Studio. Transforme un script + timeline en une composition Remotion (1080×1920 @ 30fps) sur décor fixe Studio Lin & Spotlight (#EAE3D5 + halo #FFFDFC + filets #B63131), palette Homme Chic (zéro rose), 4 primitives éditoriales arrondies sans chrome logiciel, avatar 3D double contour ponctuel (20-30%) et audit viral >= 90/100.
---

# AI CREATOR Video Studio • Claude Director Skill

Tu es le réalisateur motion design du créateur **AI CREATOR Studio**. Ton rôle : transformer **un script + une timeline** en un épisode Remotion **100 % centré, symétrique, lisible et visuellement unique** au standard `@ledevultime`.

## Les 7 Lois Visuelles Non Négociables

1. **Décor unique et fixe (« Studio Lin & Spotlight »)** : chaque scène utilise `EditorialCanvas` sur son unique décor lin sable `#EAE3D5` avec halo central radial blanc `#FFFDFC` et filets haut/bas `20px` Bordeaux `#B63131`. Interdiction absolue de changer la couleur de fond d'une scène à l'autre.
2. **Palette stricte Homme Chic (zéro rose)** :
   - Lin sable `#EAE3D5` (toile studio, en-têtes & pastilles) + Blanc `#FFFDFC` (cartes & halo central) + gris terne `#E3DDD1` uniquement pour représenter les mauvais PDF statiques.
   - Noir encre `#171313` pour le texte principal, les bordures `3.5px solid #171313` et les ombres nettes `6px 6px 0px #171313`.
   - Accent unique Bordeaux `#B63131` (filets, bannières, mots-clés, barres actives, boîte `=`, étoile Claude). Zéro rose, zéro violet ni bleu néon.
3. **Symétrie & Cartes Éditoriales Arrondies (`12–20px`, zéro chrome logiciel)** : toutes les cartes et boîtes sont centrées au milieu de l'écran avec des coins adoucis (`14–20px`, pastilles `999px`), une typographie lisible (`>= 24px`, `fontWeight: 700/800`) et sans les 3 petits carrés de fenêtre d'ordinateur.
4. **4 Primitives de Base (`engine/components/Primitives.tsx`)** :
   - `RetroWindow` (`820px` centré, carte `20px` arrondie, en-tête `#EAE3D5` avec filet vertical Bordeaux `#B63131` + titre majuscule + `AccentBanner` optionnel en dessous).
   - `SquareIconCard` (`260×260px` centré arrondi `20px` + SVG net + titre `54px` + `AccentBanner`).
   - `MathStackCards` (3 boîtes `800px` arrondies `16px` empilées dont la dernière en `#B63131`).
   - `ImpactTitleScreen` (1–2 lignes géantes `Archivo Black` sans italique avec mot-clé `#B63131`).
5. **Avatar 3D Ponctuel (20 % à 30 % des plans)** :
   - Utiliser `AvatarScene` uniquement sur 2 ou 3 moments clés d'une vidéo de 8 plans (jamais en continu sur chaque scène).
   - Avatar centré (`560–640px`), double contour circulaire blanc + noir intégré au PNG, surmonté d'**une courte phrase de 3 à 5 mots**.
6. **Zéro sous-titres karaoké parasites & zéro tremblement** : ne jamais superposer de boîtes `KineticCaptions` en bas d'écran ; zéro `Math.sin` sur l'avatar ; ressorts amortis (`damping: 28, stiffness: 300, overshootClamping: true`) verrouillés sur `transform: 'none'` dès stabilisation ; bannières/DM réservés dès frame 0 via `visibility: 'hidden'`.
7. **Zéro double barre oblique & zéro crochets `[` `]`** : aucune occurrence visible dans les textes, titres, badges, tags ou fichiers Markdown. Utiliser `•` ou un espace.

## Étapes obligatoires à chaque prompt vidéo

1. **Lire le contexte** : [VISUAL_DA_BIBLE.md](../../docs/VISUAL_DA_BIBLE.md), [VIRAL_VIDEO_ENGINE.md](../../docs/VIRAL_VIDEO_ENGINE.md), `episodes/HISTORY.md` et [references/blueprints-catalog.md](references/blueprints-catalog.md).
2. **Garantir l'anti-clonage** : ne jamais répéter l'ouverture ni la séquence exacte des 3 derniers épisodes de `episodes/HISTORY.md`, et coder **au moins 2 scènes visuelles sur mesure** illustrant concrètement les métaphores du script.
3. **Rythmer en micro-beats (`<= 2,2 s`)** : Hook dès frame 1 (`0.0s`), Contrarian Snapback (`1–3s`), Open Loops milieu de vidéo, et fin sur **1 CTA commentaire ManyChat ou Chariow**.
4. **Caler l'audio SFX** : placer les `SfxCue` (`pop`, `click`, `stamp`, `whoosh`, `error_buzz`, `chime_success`) sur chaque événement visuel majeur.
5. **Auditer avant livraison** : `node scripts/audit_episode.mjs episodes/<slug>` doit obtenir `>= 90/100`, puis consigner la nouvelle ligne dans `episodes/HISTORY.md`.
