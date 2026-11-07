# Système de Design : Tokens CSS, Typographie & Accessibilité WCAG AA

Ce guide définit l'architecture des tokens CSS, la stratégie typographique (polices système autonomes par défaut vs Google Fonts optionnelles) et les règles de contraste obligatoires pour chaque application générée.

---

## 1. Architecture des Variables CSS Sémantiques (`:root`)

Aucune couleur hexadécimale brute ne doit être dispersée au hasard dans les règles CSS des composants. Toute application déclare un bloc `:root` complet structuré selon les rôles suivants :

```css
:root {
  /* 1. Surfaces (Teintées selon la température de la direction artistique — zéro gris mort) */
  --bg-canvas: #FAF6F0;           /* Fond général de la page */
  --bg-surface: #FFFDFC;          /* Surface des panneaux de saisie et cartes */
  --bg-elevated: #F2ECE1;         /* Surface secondaire (bandeaux, en-têtes de groupe, zones passives) */
  --bg-spotlight: #0F291E;        /* Surface pleine engagée pour la Pièce Maîtresse / Ticket de Verdict */

  /* 2. Typographie & Encre */
  --text-primary: #141413;        /* Encre principale (Ratio >= 4.5:1 sur --bg-canvas, --bg-surface, --bg-elevated) */
  --text-secondary: #4A4842;      /* Texte secondaire teinté (Ratio >= 4.5:1 sur surfaces claires) */
  --text-on-spotlight: #FAF6F0;   /* Texte clair sur la surface --bg-spotlight (Ratio >= 4.5:1) */

  /* 3. Accents & Actions */
  --accent-primary: #0F52BA;      /* Couleur d'action primaire (Ratio >= 4.5:1 avec son texte associé) */
  --accent-primary-hover: #0A3B8C;
  --accent-on-primary: #FFFFFF;
  --accent-highlight: #FACC15;    /* Surlignage éditorial (bandeau de profit/verdict, badge clé — texte sombre dessus) */

  /* 4. Statuts Sémantiques Métier (Toujours accompagnés d'un libellé explicite, jamais la couleur seule) */
  --status-success-bg: #DCFCE7;
  --status-success-text: #14532D; /* Ratio >= 4.5:1 */
  --status-success-border: #166534;

  --status-warning-bg: #FEF3C7;
  --status-warning-text: #78350F; /* Ratio >= 4.5:1 */
  --status-warning-border: #B45309;

  --status-danger-bg: #FEE2E2;
  --status-danger-text: #7F1D1D;  /* Ratio >= 4.5:1 */
  --status-danger-border: #991B1B;

  /* 5. Bordures, Rayons & Élévation */
  --border-subtle: #D6D0C4;
  --border-strong: #141413;       /* Bordure structurelle franche (1.5px ou 2px) */
  --border-width: 2px;
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --shadow-offset: 4px 4px 0px #141413; /* Ombre franche sans flou (ou ombre douce selon l'intensité choisie) */
}
```

### La Règle des Surfaces Teintées (*Tinted Neutrals*)
Ne mélange jamais un fond chaud avec un gris froid standard (`#E5E7EB` ou `#6B7280`), ni un fond ardoise froid avec un beige aléatoire.
- **Si la palette est chaude** (ivoire, crème, terre cuite, forêt, brique) : teinte les gris et bordures avec une pointe d'ocre ou de pierre chaude (`#4A4842`, `#D6D0C4`).
- **Si la palette est froide** (bleu nuit, acier, cobalt, émeraude) : teinte les surfaces et textes secondaires avec une pointe d'ardoise bleutée (`#F1F5F9`, `#334155`, `#CBD5E1`).

---

## 2. Stratégie Typographique et Autonomie Hors-Ligne

La typographie représente 70 % de la personnalité d'une interface. Dans AI CREATOR Studio, le choix typographique obéit à une règle stricte de transparence réseau :

### Option 1 — Piles de Polices Système Sculptées (Choix Autonome par Défaut — 100 % Hors-Ligne)
C'est l'option recommandée par défaut pour garantir que le fichier `index.html` fonctionne **100 % hors-ligne** au double-clic local sans aucune requête externe :

- **Voix Éditoriale / Financière / Conseil (Contraste Serif + Sans + Mono)** :
  ```css
  --font-display: 'Iowan Old Style', 'Palatino Linotype', 'URW Palladio L', P052, Georgia, ui-serif, serif;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', ui-monospace, monospace;
  ```
- **Voix Néo-Brutaliste / Impact / Studio (Sans Géométrique Lourde + Mono)** :
  ```css
  --font-display: 'Arial Black', 'Avenir Next Condensed', Impact, system-ui, sans-serif;
  --font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', ui-monospace, monospace;
  ```

> **Comment donner du caractère à une pile système ?**
> Ce n'est pas le fichier de police seul qui crée l'effet « designé », mais **le contraste d'échelle et de mise en forme** :
> - Grands montants ou verdicts en `--font-display` à `clamp(2.25rem, 4vw, 3.5rem)`, `font-weight: 800`, `line-height: 1.05`, `letter-spacing: -0.03em`.
> - Étiquettes de section en `--font-mono`, `0.75rem` (`12px`), `text-transform: uppercase`, `letter-spacing: 0.08em`, `font-weight: 700`.
> - Chiffres alignés avec `font-variant-numeric: tabular-nums` sur tous les montants, pourcentages, compteurs et tableaux.

### Option 2 — Polices Externes Google Fonts (Facultative et Explicitement Déclarée)
Si la direction artistique choisie en L3 fait appel à Google Fonts (ex. `Fraunces`, `Instrument Serif`, `Syne`, `Space Grotesk`, `Plus Jakarta Sans`, `JetBrains Mono`) :
1. **Déclaration obligatoire** : le Style Sheet Descriptor (L3) doit mentionner explicitement : *« Dépendance réseau optionnelle : Google Fonts (avec fallback système calibré pour l'usage hors-ligne) »*.
2. **Ne jamais présenter l'application comme 100 % sans réseau** sans préciser que les polices personnalisées nécessitent un accès Internet initial et basculent sur les polices système hors-ligne.
3. **Préservation de la hiérarchie en Fallback** : chaque déclaration `font-family` utilisant une police Google Fonts doit être suivie de la pile système équivalente (ex. `'Fraunces', 'Iowan Old Style', Georgia, serif`) et les tailles `clamp()`, graisses et espacements doivent garantir une hiérarchie visuelle intacte même si le réseau est coupé.

---

## 3. Échelle Typographique & Lisibilité Mobile

- **Corps de texte et champs de saisie (`input`, `select`, `textarea`)** : minimum **`1rem` (`16px`)** obligatoire. Une taille inférieure à `16px` sur un champ de formulaire déclenche un zoom automatique intrusif sur iOS Safari.
- **Hauteur de ligne (`line-height`)** : `1.5` à `1.6` pour le texte courant ; `1.1` à `1.2` pour les grands titres et montants clés.
- **Longueur de ligne maximale** : `60ch` à `72ch` pour les paragraphes explicatifs ou les trames générées (ne jamais étirer un paragraphe sur `1200 px` de large).

---

## 4. Exigences Strictes de Contraste WCAG AA

Chaque couple `(texte, fond)` défini dans `:root` doit respecter les seuils WCAG 2.1 niveau AA :
- **Texte standard ($< 18\text{ pt}$ ou $< 14\text{ pt}$ gras)** : ratio de contraste $\ge \mathbf{4.5:1}$.
- **Grands titres ($\ge 24\text{ px}$ ou $\ge 18.66\text{ px}$ gras), bordures fonctionnelles d'inputs et composants graphiques** : ratio de contraste $\ge \mathbf{3.0:1}$.
- **Piège classique à proscrire** : texte blanc `#FFFFFF` sur fond jaune/orange/vert clair ou sur un cyan/turquoise trop lumineux (ex. `#0D9488` ou `#0891B2` échouent sous `4.5:1` avec du blanc ; utiliser `#0F766E` ou `#0E7490`, ou placer une encre sombre `#141413` sur les couleurs d'accent lumineuses comme l'or `#FACC15` ou le vert lime `#A3E635`).
