# AI CREATOR Studio • Video Studio (`video-studio/`)

Studio de production vidéo **9:16 (1080×1920)** et Carrousels **4:5 (1080×1350)** 100 % isolé du code de l'application racine (`src/`, `package.json`, `netlify.toml`).

Conçu pour générer des vidéos faceless virales à haute rétention sur le décor fixe **Studio Lin** : fond beige lin `#EAE3D5` **100 % plat et uni (zéro halo radial)**, bandes haut/bas `20px` Bordeaux `#B63131`, cartes ivoire `#FFFDFC`, sous-titres `SingleLineSubtitle`, avatar 3D double contour ponctuel (`AvatarBustStage`, `AvatarHeadCenter`) et loi des **5 Connecteurs Visuels Obligatoires (« Zéro élément isolé »)**.

## Structure

- `assets/avatar/` — Pack d'avatar 3D faceless (11 poses PNG RGBA avec double contour circulaire `14px` blanc + `6px` noir `#171313`) + `manifest.json`
- `assets/ep01/` — Preuves réelles Ep01 (`pdf1-page1-portrait.png`, `pdf2-page1-portrait.png`, `platform-home-real.png`, `demo-interactive-clean.mp4`, `chariow-cover-square-1200x1200.png`, `voix_ep01.wav`)
- `assets/fonts/` — Polices locales de la DA (`Archivo Black`, `Instrument Serif`, `Plus Jakarta Sans`, `JetBrains Mono`, `Caveat`)
- `assets/sfx/` — Kit de bruitages UI calibrés (WAV)
- `docs/` — Exactement **3 documents maîtres** :
  - [`STUDIO_BIBLE.md`](./docs/STUDIO_BIBLE.md) — DA Studio Lin 100 % plat, composants réels Ep01, audit `/100`, système Carrousel 4:5, blueprints `Sketch`, autopsie `/home/hasashi/Vidéos/inspi` & 5 Connecteurs Visuels
  - [`VOICE_AND_COPY_BIBLE.md`](./docs/VOICE_AND_COPY_BIBLE.md) — Voix Abigail Peugh, zéro jargon technique, zéro prix en public, filtre Anti-AI, `MAIS/DONC`, `Voice DNA` & 15 règles d'Antoine BM
  - [`CONTENT_PLAN_14_DAYS.md`](./docs/CONTENT_PLAN_14_DAYS.md) — Planning complet de 20 publications (`N°01` à `N°20`, dont 6 BOFU verrouillés mot pour mot)
- `engine/` — Moteur Remotion (`theme.ts`, primitives, blueprints)
- `episodes/` — 1 dossier par vidéo (composition sur mesure, `transcript.json`, audio, rendu `.mp4`) + journal `HISTORY.md`
- `scripts/` — Utilitaires (`audit_episode.mjs`, `new_episode.mjs`, `process_avatar.py`, et `prepare_audio.mjs` réservé uniquement aux micros humains bruts, jamais sur ElevenLabs)
- `skill/` — Skill Claude dédié (`SKILL.md` + `references/`) synchronisé avec `.agents/skills/ai-creator-video-studio/`

## Démarrage rapide

Tout s'exécute **depuis ce dossier** (`cd video-studio`) :

```bash
# 1. Installer les dépendances Remotion isolées (une seule fois)
cd video-studio
npm install

# 2. Ouvrir le studio de prévisualisation dans le navigateur
npm run dev

# 3. Initialiser un nouvel épisode
node scripts/new_episode.mjs ep02_mon_sujet

# 4. Audio voix off ElevenLabs (voix_epXX.wav) :
# Utiliser la piste ElevenLabs BRUTE sans lancer prepare_audio.mjs ni silenceremove,
# afin de préserver les pauses dramatiques naturelles (la voix commande le montage).

# 5. Auditer l'épisode (doit atteindre >= 90/100)
node scripts/audit_episode.mjs episodes/ep02_mon_sujet

# 6. Lancer le rendu MP4 Full HD 1080×1920 @ 30fps
npx remotion render engine/index.ts Showcase9x16 episodes/ep02_mon_sujet/output.mp4
```
