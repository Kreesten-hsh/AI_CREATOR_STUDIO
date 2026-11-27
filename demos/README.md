# Démos Produits & Assets Marketing — AI CREATOR Studio

Ce dossier regroupe l'ensemble des applications de démonstration autonomes (`index.html`, sans dépendance ni framework) ainsi que les pipelines de rendu dérivés.

## 1. Applications interactives (`demos/apps/`)

| Produit | Description | Fichier principal | Ressources liées |
|---|---|---|---|
| **SOLDE.** *(fil rouge du cours)* | Planificateur de budget & objectifs (`FCFA` / `€`) avec écran d'accès `.gate` (`SOLDE2026`) | [`demos/apps/solde/index.html`](apps/solde/index.html) | [`VALIDATION.md`](apps/solde/VALIDATION.md) |
| **Mijote** | Recettes express & planification des menus de la semaine | [`demos/apps/mijote/index.html`](apps/mijote/index.html) | [`build-pdf.mjs`](apps/mijote/build-pdf.mjs), [`Mijote-Recettes-Express.pdf`](apps/mijote/Mijote-Recettes-Express.pdf) |
| **Kinetik** | Programme sportif guidé 30 jours sans matériel | [`demos/apps/kinetik/index.html`](apps/kinetik/index.html) | [`build-pdf.mjs`](apps/kinetik/build-pdf.mjs), [`Programme-Sport-Maison-30-Jours.pdf`](apps/kinetik/Programme-Sport-Maison-30-Jours.pdf) |
| **Onda** | Reset productivité & clarté quotidienne sur 21 jours | [`demos/apps/onda/index.html`](apps/onda/index.html) | [`build-pdf.mjs`](apps/onda/build-pdf.mjs), [`Programme-Reset-21-Jours.pdf`](apps/onda/Programme-Reset-21-Jours.pdf) |

## 2. Assets & carrousels marketing dérivés

- [`demos/iphone-assets/`](iphone-assets/render_iphones.mjs) : Génère les 4 captures iPhone Pro haute résolution sur fond 100 % transparent (`png/iphone18-{mijote,kinetik,onda,solde}.png`).
  ```bash
  node demos/iphone-assets/render_iphones.mjs
  ```
- [`demos/tiktok-carousel-v1/`](tiktok-carousel-v1/render_carousel.mjs) : Assemble les 5 slides finales TikTok `9:16` (`1080×1920 px`) dans `png/slide-02-mijote.png` à `slide-06-cta.png`.
  ```bash
  node demos/tiktok-carousel-v1/render_carousel.mjs
  ```

> **Note concernant la page de vente du cours** : la page de vente Chariow ([`public/demos/chariow-sales-page.html`](../public/demos/chariow-sales-page.html)) reste volontairement dans `public/demos/` car elle est servie en statique par Vite (`/demos/chariow-sales-page.html`) et exportée par `npm run generate:sales-page`.

