# VISUAL DA BIBLE • AI CREATOR STUDIO (VIDÉO 9:16)

> Standard visuel minimaliste, géométrique et symétrique de `@ledevultime` transposé à la DA d'**AI CREATOR Studio** pour le format vertical **1080×1920 px @ 30fps** (TikTok, Instagram Reels, YouTube Shorts, LinkedIn).

---

## 1. Les 7 Lois Visuelles Absolues

1. **Décor unique et fixe (« Studio Lin & Spotlight »)** : du premier au dernier frame (`00:00` à la fin), la toile est **toujours et uniquement** le lin sable chaud `#EAE3D5` éclairé par un halo central radial blanc `#FFFDFC` et encadré en haut et en bas par deux bandeaux `20px` Bordeaux `#B63131`. Aucun quadrillage technique ni changement de couleur de fond entre les scènes.
2. **Palette stricte Homme Chic (zéro rose)** :
   - **Toile & Cartes** : `#EAE3D5` (lin sable chaud & en-têtes éditoriaux), `#FFFDFC` (cartes lumineuses et projecteur central), `#E3DDD1` (surfaces ternes désaturées pour les mauvais exemples PDF).
   - **Structure & Texte** : Noir Encre `#171313` pour tous les titres principaux, bordures (`3.5px solid #171313`) et ombres nettes (`6px 6px 0px #171313`).
   - **Accent Unique Bordeaux** : `#B63131` (filets haut/bas, bannières, mots-clés forts, barres de progression, boîte finale `=`, étoile Claude). **Zéro rose, zéro violet ni bleu néon.**
3. **Symétrie & Cartes Éditoriales Adoucies (zéro chrome logiciel)** : toutes les cartes (`820px`, coins arrondis `14px–20px`, pastilles `999px`), piles d'équations (`800px`) et titres sont parfaitement centrés horizontalement et verticalement dans le canvas `1080×1920`, **sans les 3 petits carrés type fenêtre d'ordinateur**.
4. **4 Primitives d'Illustration Standardisées** : `RetroWindow`, `SquareIconCard`, `MathStackCards` et `ImpactTitleScreen` (sans italique illisible).
5. **Avatar 3D Ponctuel à Double Contour** : utilisé uniquement sur **20 % à 30 % des plans** pour incarner une réaction ou un pivot fort, centré horizontalement (`560–640px`) avec **double contour circulaire franc** (`14px` blanc `#FFFFFF` + `6px` noir `#171313`) et **une courte phrase (3 à 5 mots)** au-dessus de la tête.
6. **Zéro sous-titres karaoké parasites** : l'illustration centrale et les mots-clés mis en scène portent la lecture visuelle (aucun bloc de sous-titres collé en bas par-dessus les scènes).
7. **Zéro double barre oblique** : l'usage de ce séparateur de code est banni dans tous les titres, tags et textes affichés. Utiliser uniquement le point médian `•` ou un espace.

---

## 2. Typographie & Tailles `1080×1920`

Les polices sont embarquées hors-ligne dans `assets/fonts/` :

1. **Display Massif — `Archivo Black`** :
   - Écrans d'impact (`ImpactTitleScreen`) : `64px–76px`, `line-height: 1.05`, uppercase, mots-clés accentués directement en `#B63131`.
   - Bannières `AccentBanner` : `40px`, `#FFFDFC` sur `#B63131`.
2. **Corps, En-têtes & Étiquettes — `Plus Jakarta Sans` (`700/800`)** :
   - Barre de fenêtre `RetroWindow`, étiquettes `MathStackCards`, titres au-dessus de l'avatar (`44px–48px`) et cartes `>= 24px` (lisibilité mobile irréprochable).
3. **Chiffres & Code — `JetBrains Mono` (`500/700`)** :
   - Identifiants d'étapes (`01 •`, noms de fichiers `.pdf`, terminal) en `24px–27px`.

---

## 3. Géométrie & Safe Zones `1080×1920`

```text
+------------------------------------------+  y = 0
|        ZONE INTERDITE HAUT (180 px)      |  UI plateforme / recherche
+------------------------------------------+  y = 180
|                                          |
|      ZONE ACTIVE CENTRÉE (1080 px)       |
|   RetroWindow (820 px) • MathStack (800) |
|    SquareIconCard • AvatarScene centré   |
|                                          |
+------------------------------------------+  y = 1560
|        ZONE INTERDITE BAS (360 px)       |  Compte, description, barre audio
+------------------------------------------+  y = 1920
```

---

## 4. Rythme & Motion Language (Stabilité Pixel-Perfect)

- **Courbes tactiles sans rebond** : `spring({ damping: 28, stiffness: 300, mass: 0.7, overshootClamping: true })` avec verrouillage strict à `transform: 'none'` dès stabilisation (`frame - enterFrame >= 8` ou `s >= 0.995`) pour éviter toute vibration sous-pixel sur les bordures de `3,5 px`.
- **Zéro flottement & zéro saut Flexbox** : aucun `Math.sin` sur l'avatar ; les bannières (`AccentBanner`) et cartes DM dynamiques réservent toujours leur espace dès frame 0 via `visibility: 'hidden'`.
- **Zéro crochets `[` `]` à l'écran** : n'encadrer aucun titre, badge ou bannière de crochets.
- **Clics simulés** : translation exacte vers l'ombre dure (`translate(5px, 5px)`, `boxShadow: none`) pendant `5–6 frames`, synchronisée sur `click.wav`.
- **Cadence** : un nouvel événement visuel ou appui `SfxCue` toutes les `1,0 à 2,2 secondes` maximum.
