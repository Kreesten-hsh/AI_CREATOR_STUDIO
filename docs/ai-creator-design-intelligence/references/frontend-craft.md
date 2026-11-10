# Artisanat Frontend : Fichier Unique `index.html`, CSS Natif & Vanilla JS

Ce guide établit les standards techniques, visuels et arithmétiques d'implémentation pour que le fichier unique `index.html` généré fonctionne immédiatement par simple double-clic local (`file://`), sans outil de compilation et avec une finition irréprochable.

---

## 1. Architecture Stricte du Fichier Unique (`REQ-GEN-01` à `REQ-GEN-04`)

1. **Un seul fichier autonome** : tout le HTML, tout le CSS (`<style>` dans `<head>`) et tout le JavaScript (`<script>` en fin de `<body>`) résident dans `index.html`.
2. **Interdiction formelle de Tailwind Play CDN** (`https://cdn.tailwindcss.com`) et de tout framework JS externe (React, Vue, Alpine, jQuery, Chart.js CDN).
3. **Balise Viewport mobile obligatoire** :
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
   ```
4. **Zéro troncature et zéro placeholder** : aucun commentaire de type `/* TODO */`, `// reste du code ici` ou `...` n'est toléré.

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
  min-height: 100vh;
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
- **Hauteur effective $\ge 44\text{ px}$** : L'élément `<input>` ou `<button>` lui-même (et pas uniquement son conteneur parent) doit avoir une hauteur rendue d'au moins `44px` (`min-height: 44px; height: 44px;`).
- **Taille de police $\ge 1\text{rem}$ ($16\text{ px}$)** sur tous les inputs pour empêcher le zoom intempestif imposé par Safari iOS.
- Pour les champs monétaires avec unité (`€`, `%`), utiliser un conteneur d'input avec unité stylisée intégrée (`.iwu`) et préserver le focus visible sur le conteneur (`:focus-within`).
- Chaque champ possède son `<label for="...">` explicite et un texte d'aide ou d'erreur associé (`<p class="help" id="h_...">`).

---

## 3. Précision Numérique & Arithmétique Financière Sécurisée

> [!IMPORTANT]
> **Règles d'or arithmétiques** :  
> 1. Ne **JAMAIS** convertir silencieusement une saisie invalide en 0.  
> 2. Ne **JAMAIS** tronquer silencieusement les décimales saisies par l'utilisateur.  
> 3. Conserver le texte brut saisi dans le champ en cas d'erreur pour permettre à l'utilisateur de se corriger.  
> 4. Ne **PAS** exécuter les calculs dépendants tant qu'un champ requis est invalide.

### A. Représentation Monétaire en Centimes Entiers
Pour éliminer les erreurs de virgule flottante (`0.1 + 0.2 !== 0.3`), toutes les additions et soustractions financières doivent être calculées en **centimes entiers** :
- `12 500,50 €` $\rightarrow$ `1 250 050` centimes.
- La limite sécurisée est `Math.floor(Number.MAX_SAFE_INTEGER / 100)` (soit plus de 90 000 milliards d'euros).
- Chaque calcul intermédiaire est vérifié avec `Number.isSafeInteger(valeurCentimes)`.

### B. Parseur Financier Robuste (`parseFrenchFinancialInput`)
Ce parseur accepte la virgule française `,` et le point `.`, tolère les séparateurs de milliers standards (espaces, insécables `\u00A0`, fines `\u202F`), et rejette rigoureusement les formats ambigus :

```javascript
var MAX_SAFE_EUROS = Math.floor(Number.MAX_SAFE_INTEGER / 100);

function parseFrenchFinancialInput(raw, allowNegative) {
  if (raw === null || raw === undefined) return { valid: false, empty: true, cents: 0, text: '' };
  var str = String(raw).trim();
  if (str === '') return { valid: false, empty: true, cents: 0, text: '' };

  // Normalisation des espaces (espaces simples, insécables standard \u00A0 et fines \u202F)
  var norm = str.replace(/[\u00A0\u202F]/g, ' ');

  // Rejet des groupements de milliers suspects ou mal formés (ex: '12 50 0' ou '12 5')
  if (/\d+\s+\d{1,2}\s+\d+/.test(norm) || /\d+\s+\d{4,}/.test(norm)) {
    return { valid: false, empty: false, text: str, error: 'Format de milliers invalide (ex: 12 500).' };
  }

  var clean = norm.replace(/\s/g, '');

  // Vérification de la présence d'au plus un séparateur décimal
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
    // Conservation de 2 décimales pour les centimes
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

Pour les jauges et comparatifs (ex. Coût de revient vs Marge nette) :
1. **Séparation géométrique stricte** : Ne jamais superposer le calque de texte et le calque de barres. Disposer les libellés sur une bande dédiée au-dessus de chaque barre pour garantir une lisibilité absolue.
2. **Gestion de l'axe zéro** :
   - Échelle dynamique calculée sur `min(0, coutRevient, margeNette)` et `max(0, coutRevient, margeNette)`.
   - Si toutes les valeurs sont nulles (`0 €` ou `0 FCFA`), centrer l'axe zéro (`X = W / 2`) avec un repère `0` parfaitement lisible.
3. **Accessibilité SVG** :
   - `<svg role="img" aria-labelledby="gaugeTitle gaugeDesc" viewBox="...">`
   - Balise `<title id="gaugeTitle">` et résumé textuel dynamique dans `<desc id="gaugeDesc">`.

---

## 5. Responsive `375 px` Intrinsèque & Prévention du Débordement

- **Interdiction de `overflow-x: hidden` sur `html` ou `body`** (`REQ-MOB-01`).
- Grille fluide de repli automatique :
  ```css
  .grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;
  }
  @media (min-width: 960px) {
    .grid {
      grid-template-columns: minmax(0, 7fr) minmax(340px, 5fr);
      align-items: start;
    }
    .ticket {
      position: sticky;
      top: 1.5rem;
    }
  }
  ```
- Sur mobile `375 px`, afficher la Pièce Maîtresse de Verdict en priorité ou juste après les scénarios de référence pour un accès instantané au résultat.

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

## 7. Patron d'Écran de Verrouillage Acheteur (`.gate` & `ACCESS_CODE`)

Chaque application générée intègre obligatoirement la barrière d'accès dissuasive par code d'accès JavaScript sans clignotement ni dépendance serveur (`DEC-ARB-08`, `DEC-ARB-13`).

### Script synchrone de pré-rendu dans `<head>` (Zéro Flash FOUC)
```html
<script>
  var ACCESS_CODE = "CREATOR2026", KEY = "pricing_access";
  try {
    if (localStorage.getItem(KEY) !== "granted") {
      document.documentElement.classList.add("locked");
    }
  } catch (e) {
    document.documentElement.classList.add("locked");
  }
</script>
```

### Formulaire `.gate`, validation `.trim()`, accessibilité `aria-invalid` et reverrouillage `#lockBtn`
```javascript
// Sélection des nœuds DOM du verrou
var gate = document.getElementById("gate");
var gateForm = document.getElementById("gateForm");
var gateCode = document.getElementById("gateCode");
var gateErr = document.getElementById("gateErr");
var gateCard = document.getElementById("gateCard");
var lockBtn = document.getElementById("lockBtn");

// Validation à la soumission
if (gateForm) {
  gateForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var val = (gateCode.value || "").trim();
    if (val.toUpperCase() === ACCESS_CODE.toUpperCase()) {
      gateCode.removeAttribute("aria-invalid");
      if (gateErr) gateErr.textContent = "";
      try { localStorage.setItem(KEY, "granted"); } catch (err) {}
      document.documentElement.classList.remove("locked");
      var firstInput = document.querySelector("main input, .form input");
      if (firstInput) firstInput.focus();
    } else {
      gateCode.setAttribute("aria-invalid", "true");
      if (gateErr) gateErr.textContent = "Code d'accès incorrect. Vérifie les majuscules et réessaie.";
      if (gateCard) {
        gateCard.classList.remove("shake");
        void gateCard.offsetWidth; // Forcer le reflow CSS
        gateCard.classList.add("shake");
      }
      gateCode.focus();
    }
  });
}

// Réinitialisation de l'état d'erreur à la saisie
if (gateCode) {
  gateCode.addEventListener("input", function () {
    gateCode.removeAttribute("aria-invalid");
    if (gateErr) gateErr.textContent = "";
  });
}

// Bouton de reverrouillage explicite dans l'en-tête
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
> **Condition d'activation stricte** : Ce patron ne doit être activé **que lorsque l'application persiste des données métier en `localStorage`** (par exemple un historique d'estimations, un suivi multi-jours ou une checklist de progression). Si l'application est un pur calculateur instantané sans persistance métier, seul le verrou `.gate` utilise `localStorage` et les boutons d'export/import JSON ne doivent pas être affichés.

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
// Export manuel au format JSON
function exportStateAsJson(stateObj, filename) {
  var dataStr = JSON.stringify(stateObj, null, 2);
  var blob = new Blob([dataStr], { type: "application/json;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename || "sauvegarde-donnees.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import manuel avec validation sécurisée
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

## 9. Sélecteur Multi-Devises (`FCFA` / `€`) & Sécurité Arithmétique de Tarification

Pour les calculateurs de prix et de rentabilité (comme `docs/examples/pricing-calculator/index.html`) :
1. **Formatage par devise** :
   - En **`FCFA`** : arrondir à l'entier (`Math.round(n)`) avec séparateur de milliers espace (`15 000 FCFA`), `step="100"` sur les champs monétaires.
   - En **`€`** : afficher deux décimales avec virgule française (`24,50 €`), `step="0.5"` sur les champs monétaires.
2. **Formule de prix de vente conseillé avec couverture des frais** :
   - `coutRevientUnitaire = materiel + emballage + (minutes / 60) * tauxHoraire`
   - `margeCible = coutRevientUnitaire * (margePct / 100)`
   - `tauxFrais = fraisPct / 100`
   - Si `coutRevientUnitaire <= 0 || tauxFrais >= 1`, retourner `0` pour éviter toute division par zéro ou prix négatif absurde.
   - Sinon : `prixConseille = (coutRevientUnitaire + margeCible + fraisFixe) / (1 - tauxFrais)`.
