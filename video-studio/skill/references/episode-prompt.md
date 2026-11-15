# Prompt Maître pour Générer une Nouvelle Vidéo en 1 Fois

Copie-colle ce prompt quand tu as ton nouveau script + ta piste `voix_clean.wav` + ton `transcript.json` :

```text
Utilise le Skill `ai-creator-video-studio` (`video-studio/skill/SKILL.md`).

Voici le nouvel épisode à réaliser :
- Slug : epXX_titre_court
- Funnel & Intention : [TOFU / MOFU / BOFU] — [Éduquer / Inspirer / Divertir / Vendre]
- Script parlé & timeline : [COLLE ICI ou chemin du fichier]
- Audio : [chemin voix_clean.wav si présent]
- CTA mot-clé ManyChat : [ex. CLAUDE / STUDIO]

Contraintes impératives :
1. Lis `video-studio/episodes/HISTORY.md` et choisis une ouverture + combinaison de scènes différente des 3 derniers épisodes.
2. Respecte strictement la DA de `VISUAL_DA_BIBLE.md` : décor fixe Studio Lin & Spotlight (`#EAE3D5` + halo `#FFFDFC` + filets `#B63131`) unique du début à la fin, palette Homme Chic (zéro rose : `#EAE3D5`, `#FFFDFC`, `#171313`, `#B63131`), symétrie centrée, cartes arrondies sans chrome logiciel et textes `>= 24px`.
3. N'affiche l'avatar 3D (`AvatarScene`) que sur 20 % à 30 % des plans (centré, avec une courte phrase de 3 à 5 mots au-dessus de sa tête) et privilégie `RetroWindow`, `SquareIconCard`, `MathStackCards` et des scènes vectorielles sur mesure.
4. N'utilise jamais de sous-titres karaoké superposés (`KineticCaptions` banni) ni de double barre oblique, et cale chaque événement sur un `SfxCue` (`pop`, `click`, `stamp`, `whoosh`, `error_buzz`, `chime_success`).
5. Mets à jour `meta.json`, exécute `node scripts/audit_episode.mjs episodes/epXX_titre_court` (>= 90/100), enregistre la composition dans `engine/Root.tsx` et ajoute la ligne dans `episodes/HISTORY.md`.
```
