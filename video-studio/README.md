# AI CREATOR Studio • Video Studio (`video-studio/`)

Studio de production vidéo **9:16 (1080×1920)** 100 % isolé du code de l'application formatrice racine (`src/`, `docs/`, `package.json`, `netlify.toml`).

Conçu pour générer des vidéos faceless virales à haute rétention (cartes éditoriales centrées sur décor Studio Lin & Spotlight `#EAE3D5`, halo `#FFFDFC`, filets Bordeaux `#B63131` et avatar 3D double contour ponctuel) sans jamais produire deux vidéos identiques.

## Structure

- `assets/avatar/` — Pack d'avatar 3D faceless (10 poses PNG RGBA avec double contour circulaire `14px` blanc + `6px` noir `#171313`) + `manifest.json`
- `assets/fonts/` — Polices locales de la DA (`Archivo Black`, `Instrument Serif`, `Plus Jakarta Sans`, `JetBrains Mono`, `Caveat`, `Gaegu`)
- `assets/sfx/` — Kit de bruitages UI calibrés (WAV)
- `docs/` — Bibles stratégiques et DA adaptées (`VISUAL_DA_BIBLE.md`, `VIRAL_VIDEO_ENGINE.md`, `CAROUSEL_ENGINE.md`)
- `engine/` — Moteur Remotion (DA Homme Chic verrouillée `#EAE3D5` / `#FFFDFC` / `#171313` / `#B63131`, 4 primitives éditoriales arrondies sans chrome logiciel, 11 blueprints)
- `episodes/` — 1 dossier par vidéo (composition sur mesure, `transcript.json`, audio, rendu `.mp4`) + journal `HISTORY.md`
- `scripts/` — Utilitaires (`prepare_audio.mjs`, `audit_episode.mjs`, `new_episode.mjs`, `process_avatar.py`)
- `skill/` — Skill Claude dédié (`SKILL.md` + `references/`) pour générer une vidéo originale en 1 prompt

## Démarrage rapide

Tout s'exécute **depuis ce dossier** (`cd video-studio`) :

```bash
# 1. Installer les dépendances Remotion isolées (une seule fois)
cd video-studio
npm install

# 2. Ouvrir le studio de prévisualisation dans le navigateur
npm run dev

# 3. Initialiser un nouvel épisode
node scripts/new_episode.mjs ep01_mon_sujet

# 4. Nettoyer les silences d'une note vocale (nécessite ffmpeg)
node scripts/prepare_audio.mjs episodes/ep01_mon_sujet/raw_audio.wav

# 5. Auditer l'épisode (doit atteindre >= 90/100)
node scripts/audit_episode.mjs episodes/ep01_mon_sujet

# 6. Lancer le rendu MP4 Full HD 1080×1920 @ 30fps
npx remotion render Showcase9x16 episodes/ep01_mon_sujet/output.mp4
```
