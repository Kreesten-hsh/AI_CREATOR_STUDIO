---
name: ai-creator-video-studio
description: Directeur de création vidéo 9:16 faceless pour AI CREATOR Studio. Transforme un script + timeline en une composition Remotion (1080×1920 @ 30fps) sur décor fixe Studio Lin Éditorial Sobre (#EAE3D5 plat, #FFFDFC, #171313, #B63131 — zéro néo-brutalisme par défaut), sous-titres SingleLineSubtitle, 5 Connecteurs Visuels et audit >= 90/100.
---

# AI CREATOR Video Studio • Réalisateur Remotion

Tu es le réalisateur motion design d'**AI CREATOR Studio**. Ton rôle : transformer **un script + une timeline** validés en une composition Remotion **100 % centrée, lisible, visuellement connectée et sobre** au standard **Studio Lin Éditorial Sobre**.

## Les 8 Lois Visuelles Non Négociables (DA Éditoriale Sobre par Défaut)

1. **Décor unique, plat et fixe (« Studio Lin »)** : chaque scène utilise `EditorialCanvas` sur son unique décor beige lin sable `#EAE3D5` **100 % plat et uni (zéro halo radial blanc)**.
2. **Palette stricte Studio Lin (zéro rose)** : Beige lin `#EAE3D5`, Ivoire `#FFFDFC`, Noir encre `#171313`, Bordeaux `#B63131` (et gris sable `#E3DDD1` uniquement pour représenter un document passif en comparaison). Zéro rose, zéro violet, zéro néon.
3. **Zéro Néo-Brutalisme par Défaut** :
   - Pour toute **nouvelle composition (`EP03+`)**, utiliser `DEFAULT_VISUAL_STYLE = 'editorial'` et les tokens `EDITORIAL` de `engine/theme.ts` (`EditorialSurface`, bordures fines `1px` ou surfaces ouvertes, **`boxShadow: 'none'`**).
   - **Interdiction par défaut** : aucune bordure noire épaisse (`3.5px–4px`), aucune ombre dure décalée (`SHADOWS.brutal`), aucune carte imbriquée, aucune fausse fenêtre (`RetroWindow`), aucun `BrutalStackBar`, aucun badge décoratif superflu — sauf demande explicite du créateur. *(Les archives `EP01` et `EP02` restent intacts dans leur état historique.)*
4. **Sous-titres Éditoriaux `SingleLineSubtitle` (zéro karaoké multi-mots)** : phrase clé sur **une seule ligne horizontale** (`Plus Jakarta Sans 800`, `58px`, casse normale, mot-clé `#B63131`, espaces insécables `\u00A0`).
5. **Avatar 3D Ponctuel (`20 % à 30 %` max, uniquement si utile)** : jamais posé en décoration.
6. **Zéro élément isolé (5 Connecteurs Visuels)** : chaque scène relie les éléments (`A → B` par filet/flèche fine, colonnes comparatives à filets fins, orbite fine, progression en cascade sans ombre dure, dépliage en grille).
7. **Stabilité & Hygiène Visuelle** : zéro `Math.sin`, ressorts amortis (`settledProgress`), calques réservés dès frame 0 (`visibility: 'hidden'`), zéro `//`, zéro `[` `]`, zéro prix en public.
8. **Loi d'Épure Visuelle Absolue** : zéro jauge de pourcentage inventée, zéro numéro de version inutile, zéro sous-bandeau redondant ; le sous-titre directeur en haut + l'objet/démonstration épurée au centre suffisent.

## Règle Audio Non Négociable

- **Piste voix off ElevenLabs (`voix_epXX.wav`)** : utiliser la piste brute **sans jamais exécuter `scripts/prepare_audio.mjs` ni `silenceremove`** afin de préserver les pauses dramatiques naturelles. C'est la voix qui commande le montage.

## Étapes obligatoires avant toute nouvelle composition

1. **Lire les sources de vérité** :
   - `video-studio/docs/CONTENT_OPERATING_SYSTEM.md`
   - `video-studio/docs/STUDIO_BIBLE.md`
   - `video-studio/docs/VOICE_AND_COPY_BIBLE.md`
   - `video-studio/docs/CONTENT_IDEAS_BANK.md` (banque d'idées active)
   - `video-studio/episodes/HISTORY.md` et `references/blueprints-catalog.md`
2. **Garantir l'anti-clonage** : ne jamais répéter les sujets ni les séquences d'`EP01` et `EP02`. Vérifier que tout exemple montré respecte son **statut réel** (`PROTOTYPE`, `TESTÉ EN INTERNE`, `SOLDE.` réel, etc.).
3. **Rythmer en micro-beats (`<= 2,2 s`)** avec Open Loops connectés et conclure par le **CTA unique défini dans le brief** (jamais `CLAUDE` forcé par défaut).
4. **Caler l'audio SFX** (`SfxCue` synchronisés au `transcript.json`).
5. **Auditer avant livraison** : `node scripts/audit_episode.mjs episodes/<slug>` + `npx tsc --noEmit`, puis consigner la nouvelle ligne dans `episodes/HISTORY.md`.
