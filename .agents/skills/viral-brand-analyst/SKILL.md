---
name: viral-brand-analyst
description: "Veille concurrentielle et ingénierie inverse virale (Antigravity) en deux modes : DÉCOUVERTE (tendances, formats ascendants/saturés, trous de marché sur YouTube, Instagram et Meta Ad Library) et TEARDOWN (autopsie complète d'un Reel, Short, TikTok ou carrousel : ratio vs médiane hors épinglés, attribution, map de beats timée, verdict de réplicabilité et 3 concepts prêts pour content-script-writer). Utilise scripts/ig_competitor_spy.py (0 Apify), scripts/grid_harvest.py, scripts/videos_harvest.py, le subagent browser / invisible-playwright, firecrawl et facebook-ads."
---

# Viral Brand Analyst • AI CREATOR Studio

Deux missions, une seule discipline : **DÉCOUVERTE** repère ce qui fonctionne maintenant dans ta niche ; **TEARDOWN** explique *pourquoi* un contenu précis a explosé. Ils s'enchaînent : repérer un format ascendant, puis autopsier son meilleur exemple avant de le passer à `content-script-writer`.

Tout ce que l'utilisateur lit (rapport, concepts, accroches, règles) est rédigé en **français**, aligné sur `.agents/perfil.md` et les 3 Bibles de `video-studio/docs/`.

---

## Règles d'Architecture Verrouillées (AI CREATOR Studio)

1. **Zéro pollution du workspace** :
   - Tous les fichiers temporaires (`.mp4`, `.wav`, frames, `storyboard.jpg`, `report.json`, `discover_report.json`, `swipe_report.md`, `yt_out.json`) restent **exclusivement dans `/tmp/ig-spy-cache/`**.
   - **Interdiction absolue** de créer un dossier `video-agent/` ou `relatorios/` dans le dépôt. Pour un rapport HTML autonome, utilise un Artifact ou écris dans `/tmp/ig-spy-cache/`.
2. **Connexion directe à `perfil.md` et aux 3 Bibles maîtresses** :
   - `.agents/perfil.md` : profil créateur, niche, ton, preuves réelles et comptes de référence.
   - `video-studio/docs/STUDIO_BIBLE.md` : DA Studio Lin `#EAE3D5` 100 % plat, `#FFFDFC`, `#171313`, `#B63131`, Loi n°8 Zéro Texte/Jauge Superflus, 5 Connecteurs Visuels Obligatoires, 1 Vidéo = 1 Univers Narratif Unique, Carrousel `3:4` (`1080×1440` par défaut, ou `4:5` `1080×1350`).
   - `video-studio/docs/VOICE_AND_COPY_BIBLE.md` : Règle Éditoriale Absolue (100 % produits digitaux interactifs), voix humaine au tutoiement, liste noire du jargon technique, zéro promesse `3 à 5×` généralisée, zéro prix en public, zéro tiret cadratin (`—`), filtre Anti-AI.
   - `video-studio/docs/CONTENT_IDEAS_BANK.md` : Banque d'idées organisée selon le Pont `Attraction → Confiance → Conversion` pour les **créateurs et futurs créateurs de produits digitaux** (les 3 marchés prioritaires Sport, Cuisine et Dev perso servent uniquement de matière de démonstration, en distinguant toujours preuves vérifiées, estimations tierces et signaux).
3. **Seuil d'Outlier = `2.0x`** (`2x` à `10x` la médiane des publications récentes **non épinglées** `is_pinned=False`).

---

## Choisir le Mode

- **Une niche, un thème ou la veille hebdomadaire** (« Qu'est-ce qui cartonne cette semaine dans perfil.md ? », « Trouve-moi des idées de contenu ») → **MODE DÉCOUVERTE**.
- **Un post, vidéo, profil ou lien précis** (« Fais un teardown de cette vidéo : [LIEN] », « Pourquoi ce Reel a fait 2M ? », « Analyse @compte ») → **MODE TEARDOWN**.
- **Les deux** quand la demande est ouverte : lancer DÉCOUVERTE pour identifier le format le plus fort, puis TEARDOWN sur son meilleur exemple.

Si la demande est ambiguë, pose une seule question courte avant de démarrer.

---

## Discipline de Preuve (Anti-Astrologie)

La plupart des analyses virales relèvent de l'astrologie : on note un hook fort et des cuts rapides sur un post à 400k vues en oubliant que les autres posts du compte ont aussi un hook fort et des cuts rapides à 8k vues. **Une tendance que tu n'as pas observée sur la plateforme est une rumeur.**

Trois garde-fous non négociables :
1. **Médiane avant éloge** : un chiffre brut ne veut rien dire sans la médiane du compte. Chaque performance s'exprime en **multiple de la médiane** (hors épinglés).
2. **Attribution avant prescription** : vérifier si le pic vient du contenu ou de la distribution (collab, repost par un gros compte, actualité, pub, son viral).
3. **Récence stricte** : les sons périment en 2–3 semaines, les formats en 2–3 mois. Date chaque observation. Tout ce qui dépasse ~60 jours est étiqueté ou écarté.

**Discipline sur les chiffres** : chaque métrique est **observée** ou **fournie par l'utilisateur**. N'invente jamais une fourchette « moyenne du secteur (4–6 %) » de mémoire. Si une donnée est inaccessible, écris **`non vérifié`** en ligne à côté de l'affirmation.

---

## Panel Officiel des 10 Concurrents (FR & US)

Référence verrouillée dans `.agents/perfil.md` (comptes niche `< 150K` abonnés + benchmarks haute rétention) :

| # | Compte | Zone | Spécialité & Funnel / Mot-clé |
|---|---|---|---|
| 1 | **`@abigailpeugh`** | US | Produits digitaux interactifs avec Claude + ManyChat `CLAUDE` |
| 2 | **`@wealthqueenera`** | US | Tutoriels écran pas à pas, preuves PDF & ManyChat `BIO` / `PDF` |
| 3 | **`@tenfoldmarc`** | US | Démos visuelles Claude en liste double colonne + ManyChat `STUDIO` |
| 4 | **`@buildwealthwithchels`** | US | Produits digitaux & schémas connectés étape par étape (`Step #1 → #5`) |
| 5 | **`@monetizeyourknowledge`** | US | Stratégies de lancement & monétisation de savoir |
| 6 | **`@haudegeorgelin`** | FR | Systèmes Notion, outils interactifs & produits digitaux |
| 7 | **`@yacinekais`** | FR | Hooks viraux `0–3s`, rupture d'attente & conversion |
| 8 | **`@fruitdetapassion`** | FR | Vente de systèmes digitaux & automatisation IA |
| 9 | **`@supersocialsunset`** | FR | Croissance Instagram & tunnels DM ManyChat `INSTA` |
| 10 | **`@itsmodernmillie`** | US | Éducation créateurs : Split `New vs Pro Creator` & Tableau `Worth It / Not Worth It` |

*(Radar secondaire : `@artem.novitckii` — démo mobile Claude + CTA grille `ANIMATE`.)*

---

# MODE DÉCOUVERTE

Identifier ce qui fonctionne réellement dans la niche maintenant et le transformer en concepts filmables.

## D1 — Définir le Territoire

Lis `.agents/perfil.md` en premier (niche, cible, format Studio Lin faceless, preuves réelles, comptes de référence). Si l'utilisateur ajoute des comptes voisins, garde 1 ou 2 comptes de niches adjacentes : les bons formats arrivent souvent de l'extérieur.

## D2 — Collecter les Plateformes (Hiérarchie des Preuves)

Lis `references/data-acquisition.md`. Travaille de haut en bas, jamais l'inverse :
1. **Posts lus directement** avec chiffres visibles :
   - **Instagram (automatique, 0 Apify)** :
     ```bash
     ~/.local/share/ig-spy-venv/bin/python scripts/ig_competitor_spy.py spy \
       @abigailpeugh @wealthqueenera @tenfoldmarc @buildwealthwithchels @monetizeyourknowledge \
       @haudegeorgelin @yacinekais @fruitdetapassion @supersocialsunset @itsmodernmillie \
       --min-ratio 2.0 --max-outliers 8 --whisper-model base --update-swipe
     ```
     Pour chaque outlier retenu, inspecte visuellement **`storyboard.jpg`** dans `/tmp/ig-spy-cache/runs/.../storyboard.jpg` via `read_file` et lis la transcription segmentée.
   - **YouTube Shorts & Long-form (sans login)** :
     ```bash
     python3 .agents/skills/viral-brand-analyst/scripts/grid_harvest.py @canal1 @canal2 --json /tmp/ig-spy-cache/yt_shorts.json
     python3 .agents/skills/viral-brand-analyst/scripts/videos_harvest.py @canal1 @canal2 --json /tmp/ig-spy-cache/yt_videos.json
     ```
     *(Rappel obligatoire dans le rapport : YouTube Shorts est un **proxy** pour Reels/TikTok, les titres de grille ne sont pas les hooks parlés, et la grille Shorts ne fournit pas les dates par post.)*
   - **Meta Ad Library (pubs actives `>= 30` jours)** :
     Utilise le MCP `facebook-ads` (`search_ads`, `list_advertisers`, `diff_advertiser`) ou `facebook-ad-library-cli` pour repérer les publicités et funnels qui durent.
   - **Navigateur connecté (si nécessaire)** : délègue au subagent `browser` ou utilise le MCP `invisible-playwright` pour lire une grille ou les commentaires derrière un mur de connexion.
2. **Analytics propres à l'utilisateur** (si fournis : captures Insights).
3. **Discussions de créateurs** (`firecrawl_search` / `search_web` sur Reddit ou communautés).
4. **Articles / listicles marketing** (uniquement pour le vocabulaire, jamais comme preuve).

### Découverte de nouveaux comptes `< 150 000` abonnés
1. Collecter 20 à 30 `@handles` via `firecrawl_search` (`site:instagram.com`) et `facebook-ads` (`search_ads`).
2. Filtrer et calculer les médianes automatiquement :
   ```bash
   ~/.local/share/ig-spy-venv/bin/python scripts/ig_competitor_spy.py discover @cand1 @cand2 @cand3 ... \
     --min-followers 1000 --max-followers 150000 --min-ratio 2.0 --limit 8
   ```

## D3 — Séparer la Tendance du Bruit

Un pattern réel apparaît **sur au moins 3 comptes indépendants** (un créateur qui poste 9 fois le même format est *son* format, pas une tendance). Classe chaque pattern observé :
- **Ascendant** : apparaît sur de plus en plus de comptes récemment, encore peu encombré.
- **Saturé** : partout, engagement qui s'aplatit. À éviter sauf angle radicalement neuf.
- **En déclin** : était partout, s'efface. À ignorer.
- **Niche** : fonctionne spécifiquement dans cette niche pour une raison précise.

## D4 — Trouver les Trous de Marché (Gaps)

Cherche dans ces 3 zones :
1. **Questions récurrentes en commentaires** auxquelles aucun post ne répond clairement.
2. **Formats qui cartonnent dans une niche voisine** et n'ont pas encore traversé.
3. **Consensus que personne ne conteste** (prise de position contraire argumentée — uniquement si l'utilisateur peut la défendre honnêtement).

## D5 — Sortie DÉCOUVERTE

Lis `references/artifact-spec.md`.
- **Les hooks sont des mécanismes, jamais des phrases à trous** : cite les vrais hooks verbatim avec source + chiffres, nomme le mécanisme psychologique, puis écris des hooks dans la voix d'AI CREATOR Studio (`VOICE_AND_COPY_BIBLE.md`).
- Propose **3 concepts prêts à adapter** pour AI CREATOR Studio (Place dans le tunnel `TOFU / MOFU / BOFU`, format `Reel Studio Lin 9:16` ou `Carrousel 4:5`, hook verbatim, structure par beats, connecteur visuel `1..5`).

---

# MODE TEARDOWN

Autopsier un contenu précis et livrer un plan directement exploitable par `content-script-writer`.

## T1 — Récupérer la Matière

Lis `references/data-acquisition.md`. Ne devine jamais le contenu d'une vidéo à partir de son URL. Si c'est un Reel public, passe par `scripts/ig_competitor_spy.py` (pour avoir `storyboard.jpg` + transcription Whisper) ou le subagent `browser` / `firecrawl_scrape` (YouTube). Si l'accès échoue, demande à l'utilisateur de coller la transcription ou des captures.

## T2 — Calcul de Baseline (Médiane)

Collecte 10 à 20 posts récents **non épinglés** du même compte, calcule la **médiane** (jamais la moyenne) et le multiple du post ciblé :
- **`< 2x`** : variance normale (bon post, pas un outlier).
- **`2–5x`** : vrai outlier, le plus lisible à étudier.
- **`5–20x`** : rupture de plafond (mécanisme dominant + amplification algo).
- **`> 20x`** : presque toujours un facteur distributionnel (repost, collab, actu, pub).

Vérifie les ratios si disponibles : fort ratio **commentaires/likes** = débat ou question ; fort ratio **partages ou enregistrements/likes** = utilité ou identité.

## T3 — Attribution

Pose la question : *« Est-ce que ce post aurait fonctionné depuis un compte à 0 abonné ? »*
Classe le gain en tête de rapport : **`content-earned`** | **`distribution-assisted`** | **`distribution-driven`** | **`non vérifiable`**.

## T4 — L'Autopsie Complète

Lis `references/teardown-framework.md` et la section correspondante de `references/platform-grammar.md` (ne charge que la plateforme concernée).
- **Timecode tout** (« cuts toutes les 0,8s de 0:00 à 0:04 puis plan de 3,2s à 0:05 », jamais « montage dynamique »).
- **Cite verbatim** la première phrase parlée, le texte à l'écran, la première ligne de légende et le commentaire épinglé.

## T5 — Verdict de Réplicabilité

Classe chaque mécanisme en 3 groupes francs :
- **Réplicable** : transférable tel quel (précise le coût de production, ex. 1h de montage Studio Lin).
- **Conditionnel** : nécessite un prérequis précis (ex. avoir un outil interactif à montrer en 3s).
- **Non replicable** : dépend de la notoriété, du visage, d'un son expiré, d'une actu ou d'un budget pub.

## T6 — Playbook & Handoff

- **4 à 7 règles transférables** formulées comme des contraintes concrètes issues de l'observation.
- **3 concepts prêts à produire** pour AI CREATOR Studio (`TOFU / MOFU / BOFU`, hook en français verbatim, beats timés, traitement visuel Studio Lin + Connecteur `1..5`, CTA ManyChat `CLAUDE` ou `PRODUIT` selon `VOICE_AND_COPY_BIBLE.md`). Ces concepts partent directement dans `content-script-writer`.

---

## Nettoyage du Cache

```bash
~/.local/share/ig-spy-venv/bin/python scripts/ig_competitor_spy.py clean
```

## Fichiers de Référence

- `references/data-acquisition.md` — hiérarchie des preuves et routes Antigravity
- `references/teardown-framework.md` — grille complète d'autopsie (hook, beats, visuel, son, commentaires, flops)
- `references/platform-grammar.md` — normes par plateforme (Reels, Carrousels, TikTok, Shorts, YouTube, LinkedIn)
- `references/artifact-spec.md` — structure et style du rapport final en français
