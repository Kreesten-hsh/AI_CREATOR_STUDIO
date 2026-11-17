# Prompt Maître pour Générer une Nouvelle Vidéo en 1 Fois

Copie-colle ce prompt quand tu as ton script + ta piste `voix_epXX.wav` (ElevenLabs brute) + ton `transcript.json` :

```text
Utilise le Skill `ai-creator-video-studio` (`video-studio/skill/SKILL.md`).

Voici le nouvel épisode à réaliser :
- Slug : epXX_titre_court
- Funnel & Intention : [TOFU / MOFU / BOFU] • [Éduquer / Inspirer / Divertir / Vendre]
- Script parlé & timeline : [COLLE ICI ou chemin du fichier]
- Audio : [chemin voix_epXX.wav brute — NE JAMAIS passer prepare_audio.mjs ni silenceremove sur ElevenLabs]
- CTA mot-clé ManyChat : [ex. CLAUDE / PRODUIT]

Contraintes impératives :
1. Lis `video-studio/docs/STUDIO_BIBLE.md`, `video-studio/docs/VOICE_AND_COPY_BIBLE.md`, `video-studio/docs/CONTENT_PLAN_14_DAYS.md` et `video-studio/episodes/HISTORY.md` (choisis une ouverture + combinaison de scènes différente des 3 derniers épisodes).
2. Respecte strictement la DA de `STUDIO_BIBLE.md` : fond beige lin `#EAE3D5` 100 % plat et uni (zéro halo radial blanc), encadré uniquement par les 2 bandes `20px` Bordeaux `#B63131`, palette `#EAE3D5` / `#FFFDFC` / `#171313` / `#B63131` (zéro rose), symétrie centrée et zéro prix en public.
3. Utilise les composants éprouvés sur `Ep01Composition.tsx` (`SingleLineSubtitle`, `FramedMediaCard` sans barre de titre de fenêtre, `GiantBanner`, `BrutalStackBar`, `AvatarBustStage` `width: 840px, bottom: -16px`, `AvatarHeadCenter` `width: 460px`, `OfficialClaudeLogoSvg`) et nos vrais assets (`assets/ep01/`).
4. Applique la Loi des Éléments Connectés (« Zéro élément isolé ») avec au moins un des 5 Connecteurs Visuels de `STUDIO_BIBLE.md`.
5. Conserve la piste ElevenLabs `voix_epXX.wav` brute sans `prepare_audio.mjs` ni `silenceremove` pour préserver les pauses naturelles ; cale chaque événement sur un `SfxCue` (`pop`, `click`, `stamp`, `whoosh`, `error_buzz`, `chime_success`).
6. Mets à jour `meta.json`, exécute `node scripts/audit_episode.mjs episodes/epXX_titre_court` (>= 90/100), enregistre la composition dans `engine/Root.tsx` et ajoute la ligne dans `episodes/HISTORY.md`.
```
