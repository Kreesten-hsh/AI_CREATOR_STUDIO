# AI CREATOR Studio • Video & Carousel Studio (`video-studio/`)

Studio de production **vidéo 9:16 / 16:9** (Remotion) et **Carrousels 3:4 (`1080×1440` par défaut, ou `4:5` via `--size 1080x1350`)** 100 % isolé du code de l'application racine (`src/`, `package.json`, `netlify.toml`).

Direction artistique par défaut pour toutes les futures créations organiques : **Studio Lin Éditorial Sobre** (fond beige lin `#EAE3D5` 100 % plat, ivoire `#FFFDFC`, noir encre `#171313`, bordeaux `#B63131` ; grandes typographies, espaces blancs, filets fins `1px`, zéro néo-brutalisme par défaut).

## Structure

- `docs/` — Documents stratégiques & techniques :
  - [`CONTENT_OPERATING_SYSTEM.md`](./docs/CONTENT_OPERATING_SYSTEM.md) — Source de vérité éditoriale (Règle Éditoriale Absolue, Pont `Attraction → Confiance → Conversion`, Audiences A/B, 3 marchés terrains de démo, structure 8 temps, brief court 7 lignes)
  - [`VOICE_AND_COPY_BIBLE.md`](./docs/VOICE_AND_COPY_BIBLE.md) — Voix orale au tutoiement, rigueur factuelle, zéro jargon développeur, zéro prix en public, CTAs reliés au Pont
  - [`STUDIO_BIBLE.md`](./docs/STUDIO_BIBLE.md) — DA **Éditoriale Sobre Studio Lin par défaut**, audit `/100`, système Carrousel `3:4` et 5 Connecteurs Visuels
  - [`CONTENT_IDEAS_BANK.md`](./docs/CONTENT_IDEAS_BANK.md) — Banque d'idées organisée selon le Pont `Attraction → Confiance → Conversion`
  - [`voice.md`](./docs/voice.md) — Périmètre distinct consacré aux publicités payantes (Meta Ads)
- `carousels/` — Moteur HTML/PNG (`carousel.css` en mode éditorial sobre par défaut, `slide.html`, audit DOM `check.js`, rendu `render_carousel.mjs`)
- `engine/` — Moteur Remotion (`theme.ts` avec `DEFAULT_VISUAL_STYLE = 'editorial'` et `EDITORIAL`, `Primitives.tsx`, `DemoStage.tsx`, `CoreBlueprints.tsx`, `Root.tsx`)
- `episodes/` — Compositions et rendus (`template-showcase`, `ep01_produits_interactifs`, `ep02_bonnes_instructions`, `demo_mini_cours`, `demo_solde`) + journal `HISTORY.md`
- `ads/` — Créations publicitaires statiques (`ad-01` à `ad-07`)
- `assets/` — Avatars 3D (`avatar/`), preuves `ep01/`, démos `demos/`, polices locales (`fonts/`), bruitages WAV (`sfx/`)
- `scripts/` — Utilitaires (`audit_episode.mjs`, `new_episode.mjs`, `process_avatar.py`, `prepare_audio.mjs` réservé uniquement aux micros humains bruts, jamais sur ElevenLabs)
- `skill/` — Skill Remotion (`SKILL.md` + `references/`) synchronisé avec `.agents/skills/ai-creator-video-studio/`

## Démarrage rapide

Tout s'exécute **depuis ce dossier** (`cd video-studio`) :

```bash
# 1. Installer les dépendances Remotion isolées (une seule fois)
cd video-studio
npm install

# 2. Ouvrir le studio de prévisualisation dans le navigateur
npm run dev

# 3. Initialiser un nouvel épisode vidéo
node scripts/new_episode.mjs ep03_mon_sujet

# 4. Rendre un carrousel 3:4 (1080×1440 par défaut) + planche contact d'audit
node carousels/render_carousel.mjs carousels/<slug>

# 5. Auditer un épisode (doit atteindre >= 90/100) et vérifier TypeScript
node scripts/audit_episode.mjs episodes/<slug>
npm run typecheck

# 6. Lancer les rendus Remotion (vidéo 9:16 ou démos 16:9)
npx remotion render engine/index.ts Showcase9x16 episodes/ep03_mon_sujet/output.mp4
npm run render:demo-cours-16x9
npm run render:demo-solde-16x9
```
