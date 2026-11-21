# Artisanat Frontend : Fichier Unique `index.html`, CSS Natif & Vanilla JS

Ce guide établit les standards techniques, visuels et arithmétiques d'implémentation pour que le fichier unique `index.html` généré fonctionne immédiatement par simple double-clic local (`file:///`), sans outil de compilation et avec une finition irréprochable sur mobile (`375 px`) comme sur desktop.

---

## 1. Architecture Stricte du Fichier Unique (`REQ-GEN-01` à `REQ-GEN-04`)

1. **Un seul fichier autonome** : tout le HTML, tout le CSS (`<style>` dans `<head>`) et tout le JavaScript (`<script>` en fin de `<body>`, plus le script anti-FOUC dans `<head>`) résident dans `index.html`.
2. **Interdiction formelle de Tailwind Play CDN** (`https://cdn.tailwindcss.com`) et de tout framework JS externe (React, Vue, Alpine, jQuery, Chart.js CDN).
3. **Balise Viewport mobile obligatoire** :
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
   ```
4. **Zéro troncature et zéro placeholder** : aucun commentaire de type `/* TODO */`, `// reste du code ici`, `// ... reste inchangé` ou `...` n'est toléré.

---

## 2. Finition CSS & Surfaces du Navigateur (*Craft Floor*)

```css
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background-color: var(--bg-canvas);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.55;
  min-height: 100dvh;
}

/* Prévention structurelle du débordement horizontal (JAMAIS overflow-x: hidden sur html/body) */
img, svg, canvas, video {
  max-width: 100%;
  display: block;
}

main, section, article, .panel, .grid > * {
  min-width: 0;
  max-width: 100%;
}

/* Harmonisation de la sélection de texte */
::selection {
  background-color: var(--accent-highlight, #FACC15);
  color: var(--text-primary, #141413);
}

/* Anneau de focus clavier franc et contrasté (ratio >= 3:1) */
:focus-visible {
  outline: 3px solid var(--focus-ring, var(--accent-primary));
  outline-offset: 2px;
}

/* Alignement tabulaire de toutes les valeurs chiffrées */
.tabular-nums,
input[inputmode="decimal"],
input[type="number"],
.metric-value,
.receipt-row {
  font-variant-numeric: tabular-nums;
}
```

### Contrôles de Formulaire Tactiles & Accessibilité Physique
- **Hauteur effective $\ge 44\text{ px}$** : Chaque `<input>`, `<select>`, `<button>`, onglet `role="tab"` et curseur `<input type="range">` doit offrir une cible tactile d'au moins `44×44 px` (`min-height: 44px; min-width: 44px;`).
- **Taille de police $\ge 1\text{rem}$ ($16\text{ px}$)** sur tous les champs (`input`, `select`, `textarea`) pour empêcher le zoom automatique imposé par Safari iOS.
- Pour les champs monétaires avec unité (`FCFA`, `€`, `%`), utiliser un conteneur avec unité intégrée et `:focus-within` contrasté.
- Chaque champ possède son `<label for="...">` explicite et un message d'aide ou d'erreur lié par `aria-describedby`.

---

## 3. Précision Numérique & Arithmétique Financière Sécurisée

> [!IMPORTANT]
> **Règles d'or arithmétiques** :
> 1. Ne **JAMAIS** convertir silencieusement une saisie invalide en `0`.
> 2. Ne **JAMAIS** tronquer silencieusement les décimales saisies par l'utilisateur.
> 3. Conserver le texte brut saisi dans le champ en cas d'erreur (`aria-invalid="true"`) pour permettre à l'utilisateur de se corriger.
> 4. Ne **PAS** exécuter les calculs dépendants tant qu'un champ requis est invalide.

### A. Arithmétique Exacte `micro-FCFA` (`1 EUR = 655.957 FCFA`) & Centimes Entiers
Pour éliminer les erreurs de virgule flottante (`0.1 + 0.2 !== 0.3`) et les dérives lors des allers-retours `FCFA ↔ €` (modèle **SOLDE**) :
- Utiliser une unité interne entière en **micro-FCFA** (`1 FCFA = 1 000 micro-FCFA`, `1 EUR = 655 957 micro-FCFA` exactement, puisque la parité fixe CFA/EUR est `1 EUR = 655.957 FCFA`) :
  ```javascript
  var FCFA_PER_EUR = 655.957;
  var MICRO_PER_FCFA = 1000;
  var MICRO_PER_EUR = 655957; // Exactement 655.957 * 1000

  function fcfaToMicro(fcfa) { return Math.round(fcfa * MICRO_PER_FCFA); }
  function eurToMicro(eur) { return Math.round(eur * MICRO_PER_EUR); }
  function microToFcfa(micro) { return Math.round(micro / MICRO_PER_FCFA); }
  function microToEur(micro) { return Math.round((micro * 100) / MICRO_PER_EUR) / 100; }
  ```
- Pour les applications mono-devise en euros, calculer en **centimes entiers** (`Math.floor(Number.MAX_SAFE_INTEGER / 100)`), en vérifiant chaque résultat avec `Number.isSafeInteger()`.

### B. Parseur Financier Robuste (`parseFrenchFinancialInput`)
Ce parseur accepte la virgule française `,` et le point `.`, tolère les séparateurs de milliers standards (espaces, insécables `\u00A0`, fines `\u202F`), et rejette rigoureusement les formats ambigus :

```javascript
var MAX_SAFE_EUROS = Math.floor(Number.MAX_SAFE_INTEGER / 100);

function parseFrenchFinancialInput(raw, allowNegative) {
  if (raw === null || raw === undefined) return { valid: false, empty: true, cents: 0, text: '' };
  var str = String(raw).trim();
  if (str === '') return { valid: false, empty: true, cents: 0, text: '' };

  var norm = str.replace(/[\u00A0\u202F]/g, ' ');

  if (/\d+\s+\d{1,2}\s+\d+/.test(norm) || /\d+\s+\d{4,}/.test(norm)) {
    return { valid: false, empty: false, text: str, error: 'Format de milliers invalide (ex: 12 500).' };
  }

  var clean = norm.replace(/\s/g, '');
  var sepCount = (clean.match(/[,.]/g) || []).length;
  if (sepCount > 1) {
    return { valid: false, empty: false, text: str, error: 'Format invalide : plusieurs séparateurs décimaux.' };
  }

  clean = clean.replace(',', '.');

  if (!/^-?\d+(\.\d+)?$/.test(clean)) {
    return { valid: false, empty: false, text: str, error: 'Caractères non numériques détectés.' };
  }

  var isNeg = clean.startsWith('-');
  if (isNeg && !allowNegative) {
    return { valid: false, empty: false, text: str, error: 'Ce montant ne peut pas être négatif.' };
  }

  var parts = clean.split('.');
  var integerPart = parts[0];
  var decimalPart = parts[1] || '';

  if (decimalPart.length > 2) {
    decimalPart = decimalPart.substring(0, 2);
  } else while (decimalPart.length < 2) {
    decimalPart += '0';
  }

  var cents = Number(integerPart + decimalPart);
  if (!Number.isSafeInteger(cents)) {
    return { valid: false, empty: false, text: str, error: 'Montant supérieur au plafond sécurisé.' };
  }

  return { valid: true, empty: false, cents: cents, euros: cents / 100, text: str };
}
```

---

## 4. Graphiques & Jauges SVG Inline Accessibles

Pour les jauges, anneaux de répartition et comparatifs :
1. **Séparation géométrique stricte** : Ne jamais superposer un texte de légende sur une barre graphique. Disposer les libellés sur une bande ou légende dédiée.
2. **Gestion de l'état nul ou déséquilibré** : Si le revenu ou le total est `0`, afficher un anneau ou axe neutre lisible sans division par zéro (`NaN`).
3. **Accessibilité SVG** :
   - `<svg role="img" aria-labelledby="chartTitle chartDesc" viewBox="...">`
   - Balise `<title id="chartTitle">` et résumé textuel dynamique mis à jour dans `<desc id="chartDesc">`.

---

## 5. Responsive `375 px` Intrinsèque, Cockpit Mobile & Safe Areas

- **Interdiction absolue de `overflow-x: hidden` sur `html` ou `body`** (`REQ-MOB-01`).
- **Grille asymétrique desktop + barre collante safe-area sur mobile** :
  ```css
  .layout-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;
  }

  .mobile-dock {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom, 0px));
    z-index: 40;
  }

  @media (min-width: 960px) {
    .layout-grid {
      grid-template-columns: minmax(0, 7fr) minmax(340px, 5fr);
      align-items: start;
    }
    .bilan-panel {
      position: sticky;
      top: 1.5rem;
    }
    .mobile-dock,
    .mobile-tabs {
      display: none;
    }
  }
  ```
- Sur mobile `375 px`, s'assurer que le verdict principal est visible au-dessus de la ligne de flottaison (directement pour un petit outil `<= 5` champs, ou via Résumé mobile + Onglets `Saisie`/`Bilan` + Barre collante pour un Cockpit Dual-Mode type SOLDE).

---

## 6. Mouvement Réduit (`prefers-reduced-motion`)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. Patron d'Écran de Code d'Accès Acheteur (`.gate` & `ACCESS_CODE`)

Chaque application générée intègre obligatoirement la barrière d'accès dissuasive par code d'accès JavaScript sans clignotement ni dépendance serveur (`DEC-ARB-08`, `DEC-ARB-13`).
**Règle critique** : `KEY` doit toujours être dérivé du slug du produit (`"<slug_produit>_access"`, ex. `"solde_access"`), afin que deux applications hébergées ou testées localement n'entrent jamais en collision.

### Script synchrone de pré-rendu dans `<head>` (Zéro Flash FOUC)
```html
<script>
  var ACCESS_CODE = "SOLDE2026", KEY = "solde_access";
  try {
    if (localStorage.getItem(KEY) !== "granted") {
      document.documentElement.classList.add("locked");
    }
  } catch (e) {
    document.documentElement.classList.add("locked");
  }
</script>
```

### Formulaire `.gate`, validation tolérante `.trim().toUpperCase()`, accessibilité `aria-invalid` et `#lockBtn`
```javascript
var gateForm = document.getElementById("gateForm");
var gateCode = document.getElementById("gateCode");
var gateErr = document.getElementById("gateErr");
var gateCard = document.getElementById("gateCard");
var lockBtn = document.getElementById("lockBtn");

if (gateForm && gateCode) {
  gateForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var val = gateCode.value || "";
    if (val.trim().toUpperCase() === ACCESS_CODE.toUpperCase()) {
      gateCode.removeAttribute("aria-invalid");
      if (gateErr) gateErr.textContent = "";
      try { localStorage.setItem(KEY, "granted"); } catch (err) {}
      document.documentElement.classList.remove("locked");
      var firstInput = document.querySelector("main input, main button");
      if (firstInput) firstInput.focus();
    } else {
      gateCode.setAttribute("aria-invalid", "true");
      if (gateErr) gateErr.textContent = "Code d'accès incorrect. Vérifie ton guide d'accès et réessaie.";
      if (gateCard) {
        gateCard.classList.remove("shake");
        void gateCard.offsetWidth;
        gateCard.classList.add("shake");
      }
      gateCode.focus();
    }
  });

  gateCode.addEventListener("input", function () {
    gateCode.removeAttribute("aria-invalid");
    if (gateErr) gateErr.textContent = "";
  });
}

if (lockBtn) {
  lockBtn.addEventListener("click", function () {
    try { localStorage.removeItem(KEY); } catch (err) {}
    document.documentElement.classList.add("locked");
    if (gateCode) {
      gateCode.value = "";
      gateCode.removeAttribute("aria-invalid");
      gateCode.focus();
    }
    if (gateErr) gateErr.textContent = "";
  });
}
```

---

## 8. Patron `StorageAdapter` & Export/Import JSON Manuel Conditionnel

> [!IMPORTANT]
> **Condition d'activation** : Activer ce patron pour les **Simulateurs / Planificateurs sauvegardés** (modèle SOLDE, niveau b) et les **Journaux / Suivis multi-jours** (niveau c). Pour un outil ponctuel éphémère (niveau a), seul `.gate` utilise `localStorage` et les boutons d'export/import JSON restent absents.

### Wrapper sécurisé `StorageAdapter` sous `try/catch`
```javascript
var memoryStore = {};
var StorageAdapter = {
  get: function (key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
    }
  },
  set: function (key, val) {
    try {
      localStorage.setItem(key, String(val));
    } catch (e) {
      memoryStore[key] = String(val);
    }
  },
  remove: function (key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      delete memoryStore[key];
    }
  }
};
```

### Fonctions d'export (`Blob` JSON) et d'import (`FileReader` + `JSON.parse` sécurisé)
```javascript
function exportStateAsJson(stateObj, filename) {
  var dataStr = JSON.stringify(stateObj, null, 2);
  var blob = new Blob([dataStr], { type: "application/json;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename || "sauvegarde-solde.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importStateFromJson(onSuccess, onError) {
  var fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json,application/json";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  fileInput.addEventListener("change", function () {
    var file = fileInput.files && fileInput.files[0];
    if (!file) {
      document.body.removeChild(fileInput);
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var parsed = JSON.parse(e.target.result);
        if (typeof onSuccess === "function") onSuccess(parsed);
      } catch (err) {
        if (typeof onError === "function") onError(err);
      } finally {
        document.body.removeChild(fileInput);
      }
    };
    reader.onerror = function (err) {
      if (typeof onError === "function") onError(err);
      document.body.removeChild(fileInput);
    };
    reader.readAsText(file);
  });

  fileInput.click();
}
```

---

## 9. Patrons Craft Modernes Extraits de SOLDE

Ces 6 patrons natifs (zéro dépendance, compatibles `file:///`) élèvent immédiatement la qualité perçue et la fluidité tactile :

### A. Requêtes de Conteneur CSS (`@container`)
Permet aux cartes de métriques et panneaux de s'adapter à leur propre largeur plutôt qu'à celle du viewport :
```css
.metric-shell {
  container-type: inline-size;
  container-name: metric;
}

.metric-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@container metric (min-width: 420px) {
  .metric-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

### B. Range Slider Tactile Accessible avec Piste Peinte Dynamiquement
Cible tactile `>= 44 px` de haut et progression visuelle synchronisée via variable CSS `--pct` :
```css
input[type="range"].craft-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  min-height: 44px;
  background: transparent;
  cursor: pointer;
}

input[type="range"].craft-slider::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    var(--accent-primary) 0%,
    var(--accent-primary) var(--pct, 50%),
    var(--border-subtle) var(--pct, 50%),
    var(--border-subtle) 100%
  );
}

input[type="range"].craft-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  margin-top: -8px;
  border-radius: 50%;
  background: var(--bg-surface);
  border: 2px solid var(--border-strong);
}
```
```javascript
function paintRangeSlider(el) {
  var min = Number(el.min || 0), max = Number(el.max || 100), val = Number(el.value || 0);
  var pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
  el.style.setProperty("--pct", Math.max(0, Math.min(100, pct)) + "%");
}
```

### C. Donut SVG `stroke-dasharray` avec Transitions `cubic-bezier`
Idéal pour visualiser une répartition budgétaire (ex. 3 enveloppes SOLDE : Besoins, Envies, Épargne) sans bibliothèque graphique :
```css
.donut-seg {
  fill: none;
  stroke-width: 18;
  transition: stroke-dasharray 0.45s cubic-bezier(0.22, 1, 0.36, 1),
              stroke-dashoffset 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
```
```javascript
function updateDonutSegments(segments, radius) {
  var C = 2 * Math.PI * radius;
  var offset = 0;
  segments.forEach(function (seg) {
    var len = (Math.max(0, seg.pct) / 100) * C;
    seg.el.setAttribute("stroke-dasharray", len.toFixed(2) + " " + C.toFixed(2));
    seg.el.setAttribute("stroke-dashoffset", (-offset).toFixed(2));
    offset += len;
  });
}
```

### D. Batching des Rendus via `requestAnimationFrame`
Évite les recalculs saccadés lors du glissement continu d'un curseur ou d'une saisie rapide :
```javascript
var rafPending = false;
function scheduleRender(renderFn) {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(function () {
    rafPending = false;
    renderFn();
  });
}
```

### E. `<dialog>` Natif Accessible + Repli Safari / Navigateurs Anciens
Pour une modale de confirmation, d'import ou d'explication de méthode sans dépendance :
```javascript
function openModal(dialogEl) {
  if (!dialogEl) return;
  if (typeof dialogEl.showModal === "function") {
    if (!dialogEl.open) dialogEl.showModal();
  } else {
    dialogEl.setAttribute("open", "");
    dialogEl.classList.add("dialog-fallback-open");
  }
}

function closeModal(dialogEl) {
  if (!dialogEl) return;
  if (typeof dialogEl.close === "function" && dialogEl.open) {
    dialogEl.close();
  } else {
    dialogEl.removeAttribute("open");
    dialogEl.classList.remove("dialog-fallback-open");
  }
}
```

### F. Copie Fiable `copyReliable()` Compatible `file:///`
Sous protocole local `file:///`, `navigator.clipboard.writeText` peut être bloqué selon le navigateur ; ce helper assure une copie fiable dans 100 % des contextes :
```javascript
function copyReliable(text, onDone) {
  function fallbackCopy() {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    if (typeof onDone === "function") onDone(ok);
  }

  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function" && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(function () {
      if (typeof onDone === "function") onDone(true);
    }).catch(fallbackCopy);
  } else {
    fallbackCopy();
  }
}
```
