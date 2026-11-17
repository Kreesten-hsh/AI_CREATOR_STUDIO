# EP02 • Les Bonnes Instructions avec Claude (`N°07` • Verrouillé Mot pour Mot)

## Hook (< 800 ms)
Voici ce qui se passe quand tu demande à Claude de te généré un produit digital.

## Contrarian Snapback (1–9 s)
Il te donne un document générique et ennuyeux que personne ne prend le temps de lire.

## Transformation • Bonnes Instructions (9–17 s)
Alors qu'avec les bonnes instructions , la même idée devient un vrai produit interactif.

## Preuve & Valeur d'Usage (17–26 s)
- Ce que les gens veulent, c'est tester, cliquer et avoir un résultat immédiat.
- Un outil qu'on utilise a beaucoup plus de valeur qu'un simple fichier texte.
- Tu peux créer ça avec Claude même sans abonnement et sans coder.

## CTA Commentaire ManyChat (26–32 s)
Commente CLAUDE, et je t'envoie mon mini-cours en privé pour créer le tien.

---

## Script Brut Verrouillé (À lire tel quel pour `voix_ep02.wav`)

```text
Voici ce qui se passe quand tu demande à Claude de te généré un produit digital.
Il te donne un document générique et ennuyeux que personne ne prend le temps de lire.
Alors qu'avec les bonnes instructions , la même idée devient un vrai produit interactif.
Ce que les gens veulent, c'est tester, cliquer et avoir un résultat immédiat.
Un outil qu'on utilise a beaucoup plus de valeur qu'un simple fichier texte.
Tu peux créer ça avec Claude même sans abonnement et sans coder.
Commente CLAUDE, et je t'envoie mon mini-cours en privé pour créer le tien.
```

## Notes de Direction Artistique (`Studio Lin` + Connecteurs 1 & 4)
- **Ouverture (`none_illustrated`)** : `SquareIconCard` Claude + curseur sur `Générer` → document gris `#E3DDD1` (`ep01/pdf1-page1-portrait.png` désaturé) qui tombe à plat (`error_buzz.wav`) • On-screen : `Claude te sort un PDF nul`.
- **Scène 2 (`3–9 s`)** : `AvatarBustStage` (`03_thinking_chin.png` puis `07_facepalm_oops.png`) + `SingleLineSubtitle` `Document générique ennuyeux`.
- **Scène 3 (`9–17 s`, Connecteur 1)** : le document gris reste visible en haut à gauche quand la carte `Bonnes Instructions` `#B63131` trace une flèche animée vers `<OffthreadVideo>` `ep01/demo-interactive-clean.mp4` (`click.wav` + `chime_success.wav`).
- **Scène 4 (`17–26 s`, Connecteur 4)** : `MathStackCards` empilées (`Tester • Cliquer` + `Résultat immédiat` = `Vraie valeur` `#B63131`) + `AvatarBustStage` (`05_eureka_snap.png`) + badge `Sans abonnement • Sans coder`.
- **Scène 5 (`26–32 s`)** : Carte commentaire ManyChat `#FFFDFC` avec mot-clé `CLAUDE` surligné `#B63131`.
- **Règle Audio** : dès réception de `voix_ep02.wav` (ElevenLabs brut), utiliser la piste brute sans `prepare_audio.mjs` ni `silenceremove`, puis mettre à jour `durationSec` dans `meta.json` et caler `transcript.json`.
