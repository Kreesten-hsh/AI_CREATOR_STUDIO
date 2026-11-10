# RAPPORT DE VALIDATION TECHNIQUE & PÉDAGOGIQUE — CALCULATEUR DE PRIX & RENTABILITÉ

Ce document constitue le dossier de référence du prototype **Calculateur de Prix & Rentabilité** (`docs/examples/pricing-calculator/index.html`), exemple fil rouge universel d'AI CREATOR Studio issu de la fiche pratique d'une page `docs/examples/pricing-calculator/SOURCE-FICHE-PRIX.md`.

---

## 1. Contexte Pédagogique & Universalité de l'Exemple

- **Document source** : `SOURCE-FICHE-PRIX.md` (*« Fixer un prix qui respecte ton temps et ton travail »* — fiche méthodologique d'une page).
- **Public cible** : Créateurs, artisans, formateurs, coachs et indépendants commercialisant un produit physique ou digital en Afrique francophone (`FCFA`) ou en Europe (`€`).
- **Objectif pédagogique** : Démontrer concrètement qu'une simple fiche pratique d'une page contenant une méthode de calcul et deux conseils métier devient, grâce au parcours en 2 prompts sur Claude Free et au Skill `ai-creator-design-intelligence`, une application web interactive dotée d'une direction artistique affirmée, d'un sélecteur de devise (`FCFA` | `€`) et d'un écran de verrouillage acheteur (`CREATOR2026`).

---

## 2. Direction Artistique & Identité Visuelle Indépendante (`REQ-PED-04`)

L'application illustre une direction artistique **Éditoriale Chaleureuse & Tactile** en **Bleu Cobalt, Crème & Jaune Soleil**, 100 % distincte de la charte Burgundy/Cream d'AI CREATOR Studio :

- **Palette sémantique (`:root`)** :
  - `--blue: #2563eb` (Bleu Cobalt primaire) & `--blue-hover: #1d4ed8`
  - `--blue-line: #93c5fd` (Filets et bordures secondaires Bleu Ciel)
  - `--cream: #fdf0e0` & `--bg-page: #fff7ef` (Surfaces papier chaud)
  - `--yellow: #ffd65c` (Jaune Soleil pour les badges `.tag` et l'encadré de Bénéfice Net `.profit`)
  - `--ink: #1e293b` (Encre ardoise profonde, contraste WCAG AA vérifié)
  - `--danger: #b3123b` (Indication d'erreur et marge négative)
- **Typographie** :
  - Titrage et grands montants : `Fraunces` (avec fallback `Georgia, serif`)
  - Badges manuscrits (`.tag`, `.k`) : `Gaegu` (avec fallback `'Comic Sans MS', cursive`)
  - Interface et contrôles numériques : `DM Sans` (avec fallback `system-ui, sans-serif`) et `font-variant-numeric: tabular-nums`.
- **Architecture de surface** :
  - Double cadre `.frame` / `.wrap` avec badge `.tag` incliné (`À ton tour`).
  - Panneau de résultat `.result` engagé sur fond plein Bleu Cobalt (`#2563eb`) à droite.
  - Encadré `.profit` Jaune Soleil mettant en scène le bénéfice net par vente en sus du temps déjà rémunéré.

---

## 3. Barrière d'Accès par Mot de Passe JavaScript Obligatoire (`DEC-ARB-13`)

Conformément à la règle `R9` du Master Prompt 2 (`PROMPT-GENERATION-PRODUIT-HTML` v2.1) :
- **Constante de déverrouillage en tête de script** :
  ```javascript
  var ACCESS_CODE = "CREATOR2026", KEY = "pricing_access";
  ```
- **Verrouillage avant premier rendu** : Le script synchrone dans `<head>` applique `document.documentElement.classList.add("locked")` si le code n'est pas présent, masquant `.frame` et affichant uniquement l'écran `.gate`.
- **Gestion d'erreur accessible** : En cas de code erroné, le champ passe à `aria-invalid="true"` et affiche l'alerte `Ce code n'est pas valide. Vérifie-le dans ton Guide d'Accès et réessaie.` reliée via `aria-describedby="gateErr"`.
- **Bouton « Verrouiller » intégré** : Situé dans l'en-tête à droite du sélecteur de devise, il permet à l'apprenant et à l'acheteur de refermer la session (`localStorage.removeItem(KEY)`) et de retester immédiatement l'écran `.gate`.

---

## 4. Fidélité Mathématique au Document Source & Conversion de Devise

Toutes les formules de `SOURCE-FICHE-PRIX.md` sont implémentées sans simplification :
1. `coutTemps = (minutes / 60) * hourly`
2. `coutRevientUnitaire = material + packaging + shipping + coutTemps`
3. `margeCible = coutRevientUnitaire * (margin / 100)`
4. `tauxFrais = (pFee / 100) + (sTax / 100)`
5. **Prix de vente conseillé (`P`)** :
   $$P = \frac{\text{coutRevientUnitaire} + \text{margeCible} + \text{pFlat}}{1 - \text{tauxFrais}}$$
   *(Calcul suspendu si `coutRevientUnitaire <= 0` ou `tauxFrais >= 1`).*
6. **Bénéfice Net par vente (`beneficeNet`)** :
   $$\text{beneficeNet} = P - \text{coutRevientUnitaire} - (\text{fraisPlateforme} + \text{fraisTaxes})$$

### Source Officielle de la Parité Fixe EUR / XOF
- **Source officielle** : [BCEAO — Cours de référence des principales devises contre Franc CFA](https://downloads.bceao.int/index.php/fr/cours/cours-de-reference-des-principales-devises-contre-Franc-CFA)
- **Taux de parité fixe utilisé** : **1 EUR = 655,957 FCFA** (exactement).
- **Représentation canonique interne (micro-FCFA)** :
  - `1 FCFA = 100 000 unités internes`
  - `1 centime EUR = 655 957 unités internes` (soit `1 EUR = 65 595 700 unités internes`)
  - Cette granularité entière élimine toute dérive ou érosion cumulative d'arrondi lors d'allers-retours répétés `FCFA ↔ EUR ↔ FCFA`.
  - La mise à jour de l'unité canonique intervient exclusivement lors de la saisie manuelle de l'utilisateur ou du chargement explicite d'un exemple.

### Vecteurs de Test Vérifiés (Scénarios de Démonstration)

| Mode Devise | Valeurs de Démonstration | Coût de Revient Unitaire | Prix de Vente Conseillé (`P`) | Bénéfice Net par Vente |
| :--- | :--- | :--- | :--- | :--- |
| **`FCFA`** | Matière `3 500`, Emballage `1 000`, Temps `30 min` à `4 000 FCFA/h` (`2 000`), Marge `50 %`, Livraison `0`, Frais `5 % + 100 FCFA`, Taxe `0 %` | **6 500 FCFA** | **10 368 FCFA** | **3 250 FCFA** |
| **`€ (EUR)`** | Matière `6,50 €`, Emballage `1,50 €`, Temps `30 min` à `20 €/h` (`10,00 €`), Marge `50 %`, Livraison `0 €`, Frais `5 % + 0,25 €`, Taxe `0 %` | **18,00 €** | **28,68 €** | **9,00 €** |

---

## 5. Parseur Déterministe & Gestion des Erreurs

- **Parseur strict (`STRICT_NUM_RE`)** :
  - Accepte : nombres bruts sans séparateur (`1000`, `12500`) ou avec groupement de milliers de 3 chiffres séparés par espace simple ou insécable (`1 000`, `12 500`, `1 250 000`), suivis éventuellement d'une partie décimale avec virgule `,` ou point `.`.
  - Rejette : formats ambigus (`1 00`, `12 34`, `1 2 3`), caractères corrompus (`12abc`, `12..5`), nombres négatifs (`-5`).
- **Précision par champ** :
  - `FCFA` : montants entiers stricts (pas de centimes).
  - `EUR` : jusqu'à 2 décimales.
  - `minutes`, `margin` : entiers stricts. La valeur `margin = 0 %` est explicitement autorisée.
  - `pFee`, `sTax` : jusqu'à 2 décimales entre 0 et 99,99 %.
  - `packaging = 0`, `shipping = 0`, `pFlat = 0` : explicitement autorisés.
- **Erreurs locales vs conditions globales** :
  - En cas d'erreur locale sur un champ : `aria-invalid="true"`, bordure rouge `.has-err`, message d'erreur textuel dans `.field-err` relié par `aria-describedby="err-[id]"`.
  - En cas de condition globale (`tauxFrais >= 100 %` ou `coutRevientUnitaire <= 0`) : aucun champ n'est marqué en erreur ; un message explicite apparaît dans `#globalAlert`.
  - Bouton « Vider pour mon produit » : réinitialise toutes les erreurs sans afficher d'avalanche de messages rouges ; présente un état neutre invitant à la saisie.

---

## 6. Conformité Ergonomique & Audit Navigateur Réel (`375 px`, `768 px`, `1280 px`)

Les contrôles ergonomiques et responsives ont été mesurés et validés dans un navigateur réel (Chromium / Playwright) sur les trois viewports prescrits :

- **Hauteurs des `<input>`** : **44 px** effectifs (`min-height: 44px; height: 44px;`) avec conteneurs `.field` à **46 px**.
- **Taille de police des champs** : **16 px** effectifs (`font-size: 16px;`), éliminant tout zoom automatique indésirable sur iOS Safari et Android.
- **Cibles tactiles interactives $\ge 44 \times 44\text{ px}$** :
  - Sélecteur de devise `#bFCFA` (`68 × 44 px`), `#bEUR` (`85 × 44 px`).
  - Bouton de verrouillage `#lockBtn` (`100 × 44 px`).
  - Bouton de déverrouillage `.gate .go` (`width: 100%`, `height: 44 px`).
  - Boutons d'action `#clear` (`187 × 44 px`), `#example` (`269 × 44 px`).
  - Volet de configuration `<summary>` (`height: 58 px`).
- **Absence de scroll horizontal parasite** :
  - `scrollWidth == clientWidth` vérifié à **375 px** (`375 / 375`), **768 px** (`768 / 768`) et **1280 px** (`1280 / 1280`), sans recours à `overflow-x: hidden` sur `html` ou `body`.
- **Persistance 100 % mémoire vive (RAM)** : Aucune donnée métier n'est stockée dans `localStorage` ou `sessionStorage`. Seul le jeton de déverrouillage `pricing_access` est conservé localement.
