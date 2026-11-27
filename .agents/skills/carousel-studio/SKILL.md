---
name: carousel-studio
description: "Conçoit, rédige, audite (Scorecard 7 règles) et produit des carrousels Instagram (1080×1440 3:4 par défaut, ou 1080×1350 4:5) au standard Studio Lin Éditorial Sobre (zéro néo-brutalisme par défaut) pour AI CREATOR Studio, exclusivement centrés sur les produits digitaux interactifs."
---

# Carousel Studio • AI CREATOR Studio (`Studio Lin Éditorial Sobre`)

Skill de conception, copywriting et rendu PNG de carrousels (`1080×1440` `3:4` par défaut, ou `1080×1350` `4:5` via `--size 1080x1350`).

> **Règle d'or** : L'idée centrale (100 % **produits digitaux interactifs**) et la copie décident ; le design éditorial sobre met en valeur sans surcharger. Ne lance jamais le rendu PNG final tant que le texte n'est pas validé.

---

## Lecture Préalable & Garde-Fous

1. `video-studio/docs/CONTENT_OPERATING_SYSTEM.md` (Règle Éditoriale Absolue, Pont `Attraction → Confiance → Conversion`, Audiences A/B, brief court 7 lignes).
2. `video-studio/docs/VOICE_AND_COPY_BIBLE.md` (voix orale humaine, zéro jargon dev, zéro prix organique, zéro `3 à 5×` généralisé, zéro tiret cadratin `—`).
3. `references/design-studio-lin.md` (**DA Éditoriale Sobre par défaut** : `#EAE3D5`, `#FFFDFC`, `#171313`, `#B63131` ; zéro bordure noire épaisse, zéro ombre dure décalée, zéro carte imbriquée, zéro fausse fenêtre, sauf demande explicite `data-variant="brutalist"`).

**Garde-fous** :
- **`SOLDE.`** est un exemple disponible dans la bibliothèque, jamais automatique. Tout exemple porte son vrai statut (`IDÉE`, `PROTOTYPE`, `TESTÉ EN INTERNE`, `TESTÉ AVEC UTILISATEURS`, `VALIDÉ COMMERCIALEMENT`).
- **Zéro « lien en bio »**, **ManyChat = commentaires Facebook → Messenger uniquement**, **100 % images**.

---

## Les 3 Modes

### Mode 1 — Création depuis une Idée ou un Brief Court
1. **Cadrage** : vérifie que le sujet parle d'un **produit digital interactif** à des **créateurs ou futurs créateurs** (`Audience A` / `B`), son **Rôle dans le Pont** (`Attraction` / `Confiance` / `Conversion`) et la question ouverte vers la suite — jamais un conseil généraliste pour consommateurs finaux.
2. **Format adapté** : consulte `references/formats-niche-matrix.md` selon ce que l'idée demande (sans imposer de format fixe).
3. **Hooks & Texte** : propose **3 à 5 hooks réellement différents** (ou reprends le hook validé ; 10 uniquement sur demande), rédige les slides (`<= 25 mots/slide`, 1 idée/slide, Slide 2 utile immédiatement, 1 phrase mémorable, `2 à 3` illustrations max si conceptuel). **Attends validation du texte avant le rendu PNG.**
4. **Rédaction & Design** : applique `references/copy-rules.md` puis construis `video-studio/carousels/<slug>/slide-01.html`..`slide-NN.html` selon `references/design-studio-lin.md`.

### Mode 2 — Remix Cross-Niche (*« Emprunte la structure, jamais les mots »*)
Extrais uniquement la mécanique d'un carrousel outlier (Slide 1, rythme, bascule Slide 1 → Slide 2) et adapte-la aux **6 familles autour des produits digitaux interactifs**, en DA Éditoriale Sobre.

### Mode 3 — Audit 7 Règles
Évalue tout brouillon sur les **7 Règles** de `references/copy-rules.md` (`PASS` / `FAIL` + correctif ciblé) + vérification anti-répétition et rigueur factuelle.

---

## Moteur de Production (`video-studio/carousels/`)

```bash
node video-studio/carousels/render_carousel.mjs video-studio/carousels/<slug>
```

- **Inspection visuelle obligatoire** : ouvre `/tmp/carousel-audit/<slug>/sheet.png` via `read_file`. Vérifie **`0` contour rouge `#FF2D2D`** (`check.js`), équilibre typographique, espaces blancs généreux et zéro style néo-brutaliste non demandé.
- **Livrable** : chemins PNG (`video-studio/carousels/<slug>/png/`), phrase mémorable + n° de slide, légende `120–250 mots` (sans répéter les slides mot pour mot, CTA unique adapté, `3–5` hashtags max, zéro « lien en bio »).

---

## Fichiers de Référence

- `references/formats-niche-matrix.md` — Formats carrousel adaptés aux 6 familles produits digitaux interactifs
- `references/copy-rules.md` — 7 Règles + rigueur factuelle + Scorecard
- `references/design-studio-lin.md` — DA Éditoriale Sobre Studio Lin par défaut (`1080×1440`)
- `references/references-workflow.md` — Acquisition d'outliers hors niche
