# Direction Artistique Éditoriale Sobre • Studio Lin (`video-studio/carousels/`)

Architecture visuelle **par défaut** pour **AI CREATOR Studio** : éditoriale, minimaliste, élégante, moderne, lisible en 1 seconde sur mobile et modifiable calque par calque.

> **Règle absolue** : le style éditorial sobre est le défaut obligatoire sur tous les carrousels, vidéos faceless, illustrations et visuels organiques. Le néo-brutalisme (bordures épaisses `4px`, ombres dures décalées `7px 7px 0px #171313`, cartes imbriquées) est **interdit par défaut** et disponible uniquement sous `<div class="slide" data-variant="brutalist">` sur demande explicite.

---

## 1. Dimensions & Marges de Sécurité

- **Format par défaut (`3:4` Instagram)** : **`1080×1440 px`**.
- **Format alternatif (`4:5`)** : **`1080×1350 px`** via `node video-studio/carousels/render_carousel.mjs <dossier> --size 1080x1350`.
- **Zone active Studio Lin** :
  - Marges latérales généreuses : `left >= 84px`, `width <= 912px` (`--pad: 84px`).
  - Zone verticale sûre : `top >= 64px` jusqu'à `bottom <= 1310px` sur `1080×1440` (ou `<= 1220px` sur `1080×1350`), pour laisser respirer la signature Bordeaux fine (`12px`) et le pied de page `.foot-progress`.
- **Règle typographique non négociable** : **zéro texte `< 28px`** sur toile `1080px` (`check.js` bloque toute police `< 27.5px`).

---

## 2. Les 6 Règles Visuelles Éditoriales par Défaut

1. **Palette Studio Lin préservée** :
   - Beige lin `#EAE3D5` (toile par défaut, 100 % plate), Ivoire `#FFFDFC` (`data-theme="ivory"` ou surfaces douces), Noir encre `#171313` (typographie et filets fins `1px`), Bordeaux `#B63131` (accent rare et précis).
2. **Zéro bordure épaisse & zéro ombre dure décalée** : jamais de `border: 4px solid #171313` ni de `box-shadow: 7px 7px 0px #171313`. Utiliser les surfaces ouvertes (`.open-block`), les filets fins (`.rule`, `.compare-grid`) ou au besoin une surface calme bordée à `1px solid rgba(23, 19, 19, 0.14)`.
3. **Zéro surcharge structurelle** :
   - Aucune carte imbriquée dans une carte.
   - Aucune fausse fenêtre de navigateur ou de logiciel (`RetroWindow`, 3 points, barre d'URL).
   - Aucun badge ou kicker décoratif en capitales espacées (`eyebrow` banni) : commencer directement par le titre ou l'idée.
   - Aucun élément décoratif destiné à remplir le vide : l'espace blanc fait partie du design.
4. **Typographie dominante & respirante** :
   - **`.hook`** : `Plus Jakarta Sans 800`, `68px`, `line-height: 1.08`, `text-wrap: balance`, casse phrase naturelle.
   - **`.h1` / `.h2`** : `Plus Jakarta Sans 800/700`, `46px–60px`.
   - **`.body`** : `Plus Jakarta Sans 500`, `38px`, `line-height: 1.42` (fort contraste poids `500` vs `800`).
   - Jamais un seul mot italique isolé au milieu d'un titre roman.
5. **Illustrations épurées avec parcimonie** :
   - **`2 à 3 illustrations maximum`** sur l'ensemble d'un carrousel introductif ou conceptuel, dessinées au trait fin (`1.5px–2px`), sans ombre dure ni chrome inutile.
   - Sur un carrousel démonstration, montrer uniquement les vraies captures de l'outil concerné sans multiplier les mockups d'appareils superflus.
6. **Compositions ouvertes & cohérence entre slides (`Anchor Slide`)** :
   - Préférer les grilles ouvertes à filets fins (`.compare-grid`, `.rule`, `.list` numérotée `01` sans boîte) aux empilements de cartes encadrées.
   - Conserver les mêmes marges (`84px`) et le même rythme d'une slide à l'autre. Pas de flèche de swipe sur la dernière slide.

---

## 3. Architecture par Calques `.L`

Chaque bloc d'une slide est un calque autonome positionné (`left`, `top`, `width` inline) directement dans `<div class="slide" data-theme="lin">` :

```html
<div class="slide" data-theme="lin">
  <h1 class="L hook" style="left:84px; top:220px; width:912px">Titre éditorial court et lisible</h1>
  <div class="L rule-accent" style="left:84px; top:430px"></div>
  <p class="L body" style="left:84px; top:480px; width:912px">
    Une seule idée claire par slide, sans carte superflue.
  </p>

  <div class="L foot-progress">
    <span class="foot-handle">AI CREATOR Studio</span>
    <div class="foot-track"><div class="foot-fill" style="width:12%"></div></div>
    <span class="foot-count">1/8</span>
  </div>
</div>
```

---

## 4. Option « Mini-Canva HTML » (À la demande)

Si l'utilisateur demande à modifier les textes au clic avant export PNG, générer une page mono-fichier dans `/tmp/carousel-audit/<slug>/studio.html` (zéro pollution du dépôt) intégrant `contenteditable="true"` sur les calques `.L`, puis répercuter les valeurs validées dans `slide-XX.html`.
