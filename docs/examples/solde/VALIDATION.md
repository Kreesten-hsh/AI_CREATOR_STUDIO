# RAPPORT DE VALIDATION TECHNIQUE & PÉDAGOGIQUE — SOLDE.

Ce document constitue le dossier de référence du produit fil rouge **SOLDE. · Planificateur de Budget & Objectifs** ([index.html](file:///home/hasashi/Bureau/AI_CREATOR_STUDIO/docs/examples/solde/index.html)), application web autonome (HTML/CSS/JS zéro dépendance) distribuée comme exemple canonique d'AI CREATOR Studio.

---

## 1. Direction Artistique & Identité Visuelle

SOLDE applique une direction **Fintech Haut Contraste — Chaleur Minérale & Émeraude** :

- **Palette sémantique (`:root`)** :
  - Surfaces minérales claires : `--bg-canvas: #E8E3D9`, `--bg-surface: #FFFFFF`, `--bg-soft: #F3EFE7`
  - Cockpit & verrou Émeraude profond : `--forest-deep: #071D18`, `--forest: #0C2A23`, `--forest-card: #13382F`
  - Accent menthe / succès : `--mint: #34D399`, `--sage: #0D7A55`, `--sage-soft: #DCF5EB`
  - Sémantique budgétaire : `--coral: #DC6247` / `--coral-text: #A83A22` (Charges fixes & alertes), `--gold: #E5A93B` / `--gold-text: #8A5D08` (Vie & Plaisirs)
  - Encre principale : `--ink: #11211C`, `--ink-secondary: #42554E`, `--ink-muted: #52655E`
- **Typographie** : `Plus Jakarta Sans` (interface & titrage) + `JetBrains Mono` (valeurs tabulaires `font-variant-numeric: tabular-nums`), avec repli système calibré.
- **Ergonomie mobile & desktop** :
  - Grille 2 colonnes à partir de `960 px`, bascule dual-mode mobile (`Mon Budget` / `Bilan & Objectifs`) + dock flottant `.mobile-dock` calé à `bottom: calc(12px + env(safe-area-inset-bottom, 0px))`.
  - Aucun `overflow-x: hidden` sur `html` ou `body`.
  - Respect strict de `@media (prefers-reduced-motion: reduce)`.

### Vérification des Contrastes WCAG AA

| Combinaison (Texte / Fond) | Ratio estimé | Niveau WCAG | Usage |
| :--- | :---: | :---: | :--- |
| `#11211C` sur `#FFFFFF` | **16,2:1** | AAA | Titres, montants et libellés panneau saisie |
| `#42554E` sur `#F3EFE7` | **6,8:1** | AA+ | Sous-titres et chips secondaires |
| `#A83A22` sur `#FFFFFF` | **6,4:1** | AA+ | Erreurs inline (`role="alert"`) panneau clair |
| `#FFFFFF` sur `#0C2A23` | **15,4:1** | AAA | Verrou `.gate` & cockpit Émeraude |
| `#34D399` sur `#0C2A23` | **8,7:1** | AAA | Accents épargne, score positif, badges |
| `#071D18` sur `#34D399` | **9,8:1** | AAA | Boutons primaires (`.btn-primary-mint`, `.mobile-dock-cta`) |
| `#FFA28E` sur `#0C2A23` | **8,1:1** | AAA | Erreurs verrou `.gate`, déficits et alertes cockpit |

---

## 2. Verrou Synchrone au Démarrage (`R9` — `.gate`)

- **Clé dédiée au produit** : `KEY = 'solde_access'` (aucune référence à `pricing_access`).
- **Code canonique** : `ACCESS_CODE = 'SOLDE2026'`.
- **Anti-flash synchrone dans `<head>`** : un script bloquant vérifie `localStorage.getItem('solde_access') === 'ok'` (dans un `try/catch` avec repli mémoire via `StorageAdapter`). Si l'accès n'est pas validé, `document.documentElement.classList.add('locked')` masque immédiatement `.app-workspace` et `.mobile-dock` (`display: none !important`) avant le premier rendu, et n'affiche que l'écran `.gate` plein écran.
- **Validation tolérante de la casse & des espaces** : `input.value.trim().toUpperCase() === ACCESS_CODE.toUpperCase()`.
- **Accessibilité & retour d'erreur** : un code erroné pose `aria-invalid="true"`, affiche un message dans `#gateErr` (`role="alert"`) et anime `.gate-card` avec `.animate-shake`.
- **Reverrouillage** : le bouton `#lockBtn` (`Verrouiller`, `aria-label="Verrouiller l'application"`) dans `.topbar-controls` supprime `solde_access` et réapplique immédiatement `html.locked`.

---

## 3. Parité Exacte `micro-FCFA` & Validation Financière Stricte (`R6`)

### Arithmétique Entière Sans Perte (`1 EUR = 655,957 FCFA`)

- **Constantes canoniques** :
  - `MICRO_PER_FCFA = 1 000 000` (`1 FCFA = 1 000 000 micro-FCFA`)
  - `EUR_RATE = 655.957` (parité fixe officielle BCEAO)
  - `MICRO_PER_EUR = 655 957 000` (`1 EUR = 655 957 000 micro-FCFA`, soit `1 centime EUR = 6 559 570 micro-FCFA` exactement)
- **Invariant zéro dérive** : tous les montants en mémoire (`incomeMicro`, `fixedItems[].amountMicro`, `lifeItems[].amountMicro`, `savingsMicro`, `shockMicro`, `goalTargetMicro`) sont stockés en `micro-FCFA` entiers. Basculer entre `FCFA` et `EUR` recalcule uniquement les chaînes d'affichage sans jamais modifier les entiers canoniques. Un cycle de 5 allers-retours `FCFA → EUR → FCFA` (ou `EUR → FCFA → EUR`) conserve 100 % des valeurs au `micro-FCFA` près.

### Parseur Strict `parseFrenchFinancialInput(raw, options)`

- **Formats acceptés** : entiers (`250000`), milliers groupés par 3 chiffres avec espace normale, insécable (`\u00A0`) ou fine (`\u202F`) (`250 000`, `1 250 000`), décimales avec `,` ou `.` (`381,12`, `381.12`), valeur `0`.
- **Formats rejetés** : chaînes alphabétiques (`abc`, `12abc`), nombres négatifs (`-500`), séparateurs malformés (`12..3`, `12,3,4`, `12.`), groupements ambigus (`1 00`, `12 34`, `1 2 3`).
- **Comportement en erreur** :
  1. Le texte brut saisi par l'utilisateur est conservé tel quel dans l'input (`type="text" inputmode="decimal"`).
  2. L'attribut `aria-invalid="true"` et le message inline (`role="alert"`) sont activés.
  3. L'état canonique et les calculs restent suspendus sur la dernière valeur valide : jamais de `NaN`, jamais de conversion silencieuse en `0`.
  4. Le basculement de devise est bloqué tant qu'une erreur de saisie active subsiste.

---

## 4. Vecteurs Mathématiques de Référence

### Formules Fondamentales

Soient $R$ le revenu mensuel, $F = \sum f_i$ le total des charges fixes, $V = \sum v_i + S_{\text{choc}}$ le total Vie & Plaisirs (incluant le crash-test imprévu), et $E$ l'épargne mensuelle :

1. **Total alloué** : $A = F + V + E$
2. **Reste libre mensuel** : $B = R - A$
3. **Budget libre journalier** : $J = \max(0, B / 30)$
4. **Épargne mensuelle effective** :
   $$E_{\text{eff}} = \begin{cases} E & \text{si } B \ge 0 \\ \max(0, E + B) & \text{si } B < 0 \end{cases}$$
5. **ETA d'objectif** (pour une cible $G > 0$ et $E_{\text{eff}} > 0$) :
   $$M_{\text{ETA}} = \left\lceil \frac{G}{E_{\text{eff}}} \right\rceil \text{ mois}$$
   La date projetée ajoute $M_{\text{ETA}}$ mois au 1er du mois courant (format `Mois Année` en français).

### Formule du Score de Sérénité (`/100` = `35 + 30 + 35`)

Pour $R > 0$ (sinon `score = 0`) :
- **Bloc 1 — Équilibre mensuel (35 pts)** :
  - Si $B \ge 0$ : `+35`
  - Si $B < 0$ : $\max\left(0, \text{round}\left(35 \times (1 - \min(1, |B|/R) \times 2.5)\right)\right)$
- **Bloc 2 — Maîtrise des charges fixes (30 pts)** :
  - Si $p_F = \text{round}(100 \times F / R) \le 50$ : `+30`
  - Sinon : $\max\left(0, \text{round}(30 - (p_F - 50) \times 1.2)\right)$
- **Bloc 3 — Rythme d'épargne effective (35 pts)** :
  - $p_{E,\text{eff}} = 100 \times E_{\text{eff}} / R$
  - $\min\left(35, \text{round}((p_{E,\text{eff}} / 20) \times 35)\right)$

### Vecteurs Vérifiés des 3 Profils (FCFA, sans imprévu)

| Profil | Revenu ($R$) | Fixes ($F$) | Vie ($V$) | Épargne ($E$) | Alloué ($A$) | Reste libre ($B$) | Budget/jour ($J$) | Score | Objectif & ETA |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: | :--- |
| **`standard` (Particulier)** | `250 000` | `125 000` (50%) | `65 000` (26%) | `50 000` (20%) | `240 000` (96%) | `10 000` | `333 FCFA` | **100/100** | Fonds de sécurité `300 000` → **6 mois** |
| **`creator` (Créateur / Freelance)** | `450 000` | `225 000` (50%) | `120 000` (27%) | `90 000` (20%) | `435 000` (97%) | `15 000` | `500 FCFA` | **100/100** | Setup Vidéo & Micro `250 000` → **3 mois** |
| **`student` (Étudiant)** | `100 000` | `50 000` (50%) | `30 000` (30%) | `20 000` (20%) | `100 000` (100%) | `0` | `0 FCFA` | **100/100** | Nouveau Téléphone `150 000` → **8 mois** |

### Vecteurs Crash-Test sur le Profil `standard` (`R = 250 000 FCFA`)

| Scénario Imprévu | Vie totale ($V$) | Alloué ($A$) | Reste libre ($B$) | $E_{\text{eff}}$ | Score (`35 + 30 + 35`) | ETA (`300 000`) | Statut |
| :--- | ---: | ---: | ---: | ---: | :---: | :---: | :--- |
| **`+15 000 FCFA`** | `80 000` (32%) | `255 000` (102%) | `-5 000` | `45 000` | `33 + 30 + 32 = 95` | **7 mois** | Budget dépassé |
| **`+40 000 FCFA`** | `105 000` (42%) | `280 000` (112%) | `-30 000` | `20 000` | `25 + 30 + 14 = 69` | **15 mois** | Budget dépassé |
| **`+80 000 FCFA`** | `145 000` (58%) | `320 000` (128%) | `-70 000` | `0` | `11 + 30 + 0 = 41` | **En pause** | Budget dépassé |

### Règles de Répartition Rapide

- **Équilibré (`50 / 30 / 20`)** : 50 % Fixes, 30 % Vie, 20 % Épargne (arrondi par poste au multiple de 500 FCFA, remise à zéro du crash-test).
- **Prudent (`60 / 20 / 20`)** : 60 % Fixes, 20 % Vie, 20 % Épargne.
- **Épargne max (`45 / 20 / 35`)** : 45 % Fixes, 20 % Vie, 35 % Épargne.

---

## 5. Sauvegarde Portable Export / Import JSON (`R7 b/c`)

- **Persistance locale** : clé `solde_budget_app_v3` via `StorageAdapter` (résilient si `localStorage` est bloqué).
- **Export (`#btnExportJson`)** : génère un fichier `solde-budget-YYYY-MM-DD.json` (`schemaVersion: 2`) contenant la représentation exacte en `micro-FCFA` et sa lecture miroir en `FCFA`.
- **Import (`#btnImportJson` + `#inputImportJson`)** :
  - Valide strictement le schéma via `validateAndNormalizeBudgetPayload` : présence de `incomeMicro` (ou `incomeFcfa` rétro-compatible), tableaux `fixedItems` et `lifeItems` non vides, tous les montants finis et `>= 0`, devise (`FCFA` | `EUR`) et profil valides.
  - En cas de JSON malformé ou corrompu : refuse l'import, préserve intact l'état courant et affiche un toast d'erreur explicite.
