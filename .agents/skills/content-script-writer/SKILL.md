---
name: content-script-writer
description: "Transforme une idée ou un brief court en script vidéo prêt à produire en français (voix off mot pour mot, minutage 2,5–3 mots/s, 3 à 5 hooks par mécanismes distincts, visuels Studio Lin Éditorial Sobre / SingleLineSubtitle, légende) exclusivement centré sur les produits digitaux interactifs."
---

# Content Script Writer • AI CREATOR Studio

Transforme une idée validée ou un brief court (`community-manager` / `viral-brand-analyst`) en **script prêt à enregistrer et monter** dans `video-studio/episodes/` (`ai-creator-video-studio`).

> **RÈGLE ÉDITORIALE ABSOLUE** : Tout script porte sur les **produits digitaux interactifs** et s'adresse aux **créateurs et futurs créateurs** (`Audience A` + `Audience B`), jamais aux consommateurs finaux. Les 3 marchés prioritaires (Sport, Cuisine, Dev perso) servent uniquement de terrains de démonstration.

---

## Lecture Préalable Courte

1. `video-studio/docs/CONTENT_OPERATING_SYSTEM.md` (Règle Éditoriale Absolue, Pont `Attraction → Confiance → Conversion`, structure 8 temps, garde-fous factuels).
2. `video-studio/docs/VOICE_AND_COPY_BIBLE.md` (voix orale humaine au tutoiement, liste noire jargon dev, zéro prix organique, zéro `3–5×` généralisé, zéro tiret cadratin `—`).
3. `video-studio/episodes/HISTORY.md` (zéro redite d'`EP01` et `EP02`).

---

## Étapes de Rédaction

### 1. Choisir la Forme Selon l'Idée (`references/formats.md`)
Ne force jamais chaque vidéo dans `Hook → Problème → Solution → CTA` :
- **Erreur / Blocage** → mauvaise approche → pourquoi ça coince → bonne approche.
- **Comparaison (`PDF vs Interactif`)** → côte à côte en alternance.
- **Démo / Test Claude** → montrer le résultat interactif dès `0:00`, puis comment on y arrive et les limites réelles.
- **Transformation** → point de départ (document/méthode) → étapes → résultat interactif.

### 2. Rédiger & Minuter (`references/hooks.md` & `references/writing.md`)
1. **3 à 5 Hooks candidats par mécanismes distincts → 1 recommandé** (`< 12` mots parlés en vidéo ; 10 uniquement sur demande explicite).
2. **Voix off mot pour mot (`verbatim`)** : écris exactement ce qui sera dit à voix haute, avec `[pause]` aux respirations.
3. **Minutage réel (`2,5–3 mots/seconde`)** : vérifie que le nombre de mots de chaque beat correspond à sa durée.
4. **Mode muet (`SingleLineSubtitle`)** : une seule ligne horizontale courte en haut, zéro `//`, zéro `[ ]`, zéro jauge inventée, **DA Éditoriale Sobre par défaut** (zéro néo-brutalisme).
5. **Rigueur** : `SOLDE.` jamais automatique, statut réel affiché pour tout exemple (`IDÉE`, `PROTOTYPE`, `TESTÉ EN INTERNE`, etc.), CTA unique adapté au pilier (ManyChat = Facebook → Messenger uniquement).

---

## Format de Sortie

```markdown
SCRIPT : [titre court et spécifique]
FORMAT : [Reel 9:16 Studio Lin Éditorial Sobre • XXs • Direct ou 8 temps Stacked Open Loops]
PONT & AUDIENCE : [Attraction / Confiance / Conversion • Audience A / B / A+B • Question ouverte suivante]
FAMILLE & PILIER : [ex. La transformation • Éduquer]
L'IDÉE : [une phrase — ce que le créateur retient]

### 3 À 5 HOOKS CANDIDATS → RECOMMANDATION (0:00–0:03)
- **Option #1 Recommandée [Mécanisme]** : "[mots exacts]" (Sous-titre : "[ligne courte]")
- **Option #2 [Mécanisme]** : "[mots exacts]" (Sous-titre : "[ligne courte]")
- **Option #3 [Mécanisme]** : "[mots exacts]" (Sous-titre : "[ligne courte]")

### DÉROULÉ TIMÉ
[0:00–0:03] ACCROCHE
VOIX OFF : "[~7–11 mots exacts]"
ÉCRAN (Studio Lin Éditorial Sobre) : [visuel précis dès frame 1]
SOUS-TITRE (1 ligne) : "[texte court]"

[...]

[XX–YY] CTA ADAPTÉ
VOIX OFF : "[CTA unique]"
ÉCRAN : [fin éditoriale sobre]
SOUS-TITRE (1 ligne) : "[CTA court]"

### LÉGENDE
[1re ligne forte avant "voir plus" + corps court + CTA unique, zéro prix, statut exact]

### AUDIO & ROUTAGE
- Voix ElevenLabs brute (sans silences coupés) + SFX calés.
- Prêt pour `ai-creator-video-studio` → `video-studio/episodes/<slug>/`.
```

---

## Relecture Rapide Avant Livraison
1. **Test voix haute** : naturel comme dans une vraie discussion ?
2. **Chronomètre** : `2,5–3 mots/s` respecté ?
3. **Mode muet** : compréhensible sans le son ?
4. **Règle absolue** : 100 % centré sur les produits digitaux interactifs, zéro mot banni, zéro prix, zéro redite `EP01`/`EP02`.

## Fichiers de Référence
- `references/formats.md` — structures `20–35s` et `35–55s` (*Stacked Open Loops*)
- `references/hooks.md` — mécanismes d'accroche (`3 à 5` candidats → 1 recommandé)
- `references/writing.md` — rythme oral, sous-titres 1 ligne et CTAs
