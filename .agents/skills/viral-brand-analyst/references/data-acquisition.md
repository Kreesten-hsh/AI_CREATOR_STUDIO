# Acquisition des Données (Routes Antigravity)

Quatre routes ordonnées par fiabilité. Ne monte jamais dans la hiérarchie : travaille toujours du plus direct au moins direct.

**Hiérarchie des preuves :**
1. **Posts lus directement sur plateforme** (avec chiffres visibles et transcription/visuels).
2. **Analytics propres à l'utilisateur** (captures Instagram/TikTok/YouTube Insights).
3. **Discussions de créateurs** (Reddit, communautés spécialisées).
4. **Articles / listicles marketing** (vocabulaire uniquement, jamais une preuve).

---

## Route 1 — Contenu collé par l'utilisateur (La plus rapide)

Quand l'utilisateur fournit un lien, des captures, une transcription ou des chiffres :
Demande en **un seul message** ce qui manque :
1. Le post lui-même (vidéo, captures des 3 premières secondes, ou transcription).
2. Les chiffres visibles (vues, likes, commentaires, partages, enregistrements, abonnés).
3. La légende complète verbatim (avec retours à la ligne).
4. Les vues de 5 à 10 posts récents non épinglés du même compte (pour la médiane).

---

## Route 2 — Scripts Python locaux (0 Apify, sans login)

### Instagram Reels (`scripts/ig_competitor_spy.py`)
- **Mode `spy`** : scanne les comptes, calcule la médiane hors épinglés (`is_pinned=False`), isole les outliers `>= 2.0x`, télécharge les MP4 dans `/tmp/ig-spy-cache/`, transcrit 100 % de l'audio via `faster-whisper` (`0-3s Hook`, `3-15s Mécanisme`, `15s-Fin CTA`) et génère `storyboard.jpg`.
- **Mode `discover`** : vérifie abonnés (`1 000–150 000`) et médianes d'une liste de candidats.

### YouTube Shorts & Long-form (`grid_harvest.py` & `videos_harvest.py`)
- Extrait `ytInitialData` sans login.
- Calcule médiane + multiple par vidéo.
- **Limites à mentionner dans le rapport** : Shorts = proxy pour Reels/TikTok ; titre de grille ≠ hook parlé ; pas de date par Short sur la grille.

### Meta Ad Library (`facebook-ads` MCP / `facebook-ad-library-cli`)
- `search_ads`, `list_advertisers`, `diff_advertiser`.
- Cibler les publicités actives depuis **`>= 30` jours** (`days_active >= 30`), relever les URLs de landing page, offres et CTAs.

---

## Route 3 — Navigateur & Scraping Antigravity

- **Subagent `browser` ou MCP `invisible-playwright`** : pour lire des grilles Instagram/TikTok connectées, capturer les frames d'une vidéo et lire les **sections commentaires** (source n°1 pour trouver les trous de marché et les indices d'attribution type *« je viens de chez @... »*).
- **Règles strictes navigateur** : lecture seule (jamais liker, commenter, suivre ou modifier), ouvrir un nouvel onglet, stopper après 2–3 échecs (mur de login ou rate-limit) et demander à l'utilisateur de coller les captures.
- **`firecrawl_search` / `firecrawl_scrape` / `search_web`** : utile pour l'attribution (repost, actu), le contexte de marque, Reddit (`site:reddit.com`) et les pages YouTube. Inutile sur Instagram/TikTok derrière un mur de connexion.

---

## Route 4 — Analytics de l'utilisateur

Demander des captures d'écran natives (Instagram Insights, YouTube Studio, TikTok Analytics). En cas d'écart entre vues publiques et portée native, les analytics natifs font foi (signale l'écart dans le rapport).

---

## Journal d'observation

Note pour chaque donnée : la source, la valeur exacte et la date d'observation. Toute donnée non vérifiée est marquée `non vérifié` en ligne.
