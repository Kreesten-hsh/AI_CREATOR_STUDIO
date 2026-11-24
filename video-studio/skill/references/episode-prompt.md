# Prompt Maître pour Générer une Nouvelle Vidéo en 1 Fois

Copie-colle ce prompt quand tu as ton script validé + ta piste `voix_epXX.wav` (ElevenLabs brute) + ton `transcript.json` :

```text
Utilise le Skill `ai-creator-video-studio` (`.agents/skills/ai-creator-video-studio/SKILL.md`).

Voici le nouvel épisode à réaliser :
- Slug : epXX_titre_court
- Pilier & Niveau de conscience : [Éduquer / Inspirer / Divertir / Vendre] • [Niveau 1..5]
- Secteur & Statut exemple : [ex. Cuisine & alimentation • PROTOTYPE testé en interne]
- Script parlé & timeline : [COLLE ICI ou chemin du fichier]
- Audio : [chemin voix_epXX.wav brute — NE JAMAIS passer prepare_audio.mjs ni silenceremove sur ElevenLabs]
- CTA unique défini par le brief : [ex. Abonnement / Commentaire secteur / Découverte offre]

Contraintes impératives :
1. Lis `video-studio/docs/CONTENT_OPERATING_SYSTEM.md`, `video-studio/docs/STUDIO_BIBLE.md`, `video-studio/docs/VOICE_AND_COPY_BIBLE.md`, le planning actif (`video-studio/docs/CONTENT_PLAN_WEEK_XX.md`) et `video-studio/episodes/HISTORY.md` (aucune redite d'EP01 ou EP02).
2. Applique la DA Éditoriale Sobre Studio Lin par défaut : fond beige lin `#EAE3D5` 100 % plat et uni, palette `#EAE3D5` / `#FFFDFC` / `#171313` / `#B63131` (zéro rose), zéro bordure noire épaisse, zéro ombre dure décalée (`SHADOWS.brutal`), zéro fausse fenêtre (`RetroWindow`) ni `BrutalStackBar` sauf demande explicite, zéro prix en public.
3. Utilise les tokens `EDITORIAL` de `engine/theme.ts`, `EditorialCanvas`, `EditorialSurface`, `KineticWordLine` / `SingleLineSubtitle` et les vraies captures/démos du prototype du secteur traité.
4. Applique la Loi des Éléments Connectés (« Zéro élément isolé ») avec au moins un des 5 Connecteurs Visuels de `STUDIO_BIBLE.md` en version épurée (filets fins `1px`, flèches simples).
5. Conserve la piste ElevenLabs `voix_epXX.wav` brute sans `prepare_audio.mjs` ni `silenceremove` ; cale chaque événement sur un `SfxCue` (`pop`, `click`, `stamp`, `whoosh`, `error_buzz`, `chime_success`).
6. Mets à jour `meta.json`, exécute `node scripts/audit_episode.mjs episodes/epXX_titre_court` (>= 90/100) et `npx tsc --noEmit`, enregistre la composition dans `engine/Root.tsx` et ajoute la ligne dans `episodes/HISTORY.md`.
```
