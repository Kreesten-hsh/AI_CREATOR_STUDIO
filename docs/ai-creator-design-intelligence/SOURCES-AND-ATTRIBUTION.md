# Audit des Sources, Licences, Exclusions et Attributions

Ce document retrace l'audit méthodologique et juridique réalisé pour concevoir le skill **`ai-creator-design-intelligence`** sans aucune copie de code, de script ou de texte propriétaire externe.

---

## 1. Tableau d'Audit des Référentiels Examinés

| Référentiel examiné | Licence identifiée | Idées méthodologiques générales retenues (Réécriture 100 % originale en français) | Éléments exclus (Propriétaires ou incompatibles avec Claude.ai Free) |
| :--- | :--- | :--- | :--- |
| **`impeccable`** (v4.7.0) | **Apache License 2.0** | • Distinction des modes d'utilisation d'une interface (*Opérer un outil*, *Vivre une expérience*, *Hybride*).<br>• Principe des surfaces secondaires teintées dans la température du fond (*Tinted Neutrals*).<br>• Finition des états natifs du navigateur (`::selection`, `:focus-visible`, `font-variant-numeric: tabular-nums`).<br>• Engagement de la palette sur le panneau principal de restitution. | • Exécutables et scripts CLI (`npx impeccable`, `.agent/skills/impeccable/scripts/impeccable`).<br>• Sous-commandes d'agent local et fichiers Markdown anglais originaux. |
| **`design-taste-frontend`** (*tasteskill v2*) | Non déclarée dans le frontmatter (Droit d'auteur par défaut) | • Démarche consistant à dresser un inventaire concret du sujet avant tout choix esthétique.<br>• Formulation d'une phrase conceptuelle reliant un objet du métier au cœur de l'interface.<br>• Mise en scène d'une pièce maîtresse interactive unique plutôt qu'un pavage uniforme.<br>• Équilibre entre densité utile et zone de respiration. | • Scripts Node 22+ (`scripts/draw.mjs`, `inspect.mjs`, `lint.mjs`, `assets.mjs`).<br>• Bibliothèque `library/*` et rédaction anglaise originale. |
| **`ui-ux-pro-max`** | Non déclarée dans le frontmatter (Droit d'auteur par défaut) | • Hiérarchisation des priorités d'ingénierie UI (Accessibilité WCAG AA $\rightarrow$ Cibles tactiles & Interaction $\rightarrow$ Responsive $\rightarrow$ Typographie & Couleur).<br>• Complétude des états de composants (initial, focus, cas limite, vide, confirmation). | • Moteur de recherche Python `search.py` (`${CLAUDE_PLUGIN_ROOT}`).<br>• Tables de données CSV/JSON propriétaires et textes originaux. |
| **`antislop` & `antislop-ui`** | Non déclarée dans le frontmatter (Droit d'auteur par défaut) | • Approche par *Présomption de défaut / Pourquoi cela nuit / Exception fonctionnelle légitime* pour éviter les automatismes génériques (dégradés décoratifs sans fonction, cartes monotones, emojis comme icônes structurelles). | • Assistant `First-Run Install Wizard`, système de numérotation `R-XX` et textes anglais originaux. |
| **`antislop-copywriting`** | Non déclarée dans le frontmatter (Droit d'auteur par défaut) | • Hygiène rédactionnelle appliquée au français : interdiction d'inventer des faits/statistiques absents du document source, élimination des formules promotionnelles creuses, libellés d'action explicites. | • Exemples et textes anglais originaux. |
| **`DESIGN.md` & `docs/COURSE_PRD.md`** *(Interne AI CREATOR Studio)* | **Propriété du dépôt AI CREATOR Studio** | • Grammaire structurelle **Néo-Brutaliste Éditoriale** déclinée en 3 intensités (*Forte*, *Moyenne*, *Légère*) : bordures franches, ombres décalées nettes, retour tactile, tout en imposant l'indépendance chromatique de chaque produit apprenant (`REQ-PED-04`). | • Stack React / Vite / Tailwind CSS de la plateforme de cours (les applications générées sont en HTML/CSS/JS Vanilla dans un fichier unique `index.html`). |

---

## 2. Garanties de Propriété Intellectuelle et de Portabilité

1. **Zéro copie de fichiers ou de textes tiers** :
   Aucun fichier, script, tableau CSV ni paragraphe issu des 5 skills étudiés n'a été copié ou traduit littéralement dans `ai-creator-design-intelligence/`. L'intégralité des 8 fichiers du skill a été conçue et rédigée spécifiquement en français pour le parcours pédagogique L1–L5 d'AI CREATOR Studio.
2. **Zéro dépendance à un environnement d'exécution externe** :
   Toutes les instructions reposent exclusivement sur les capacités natives de génération HTML5, CSS3 et JavaScript ES6+ de Claude.ai Free.
