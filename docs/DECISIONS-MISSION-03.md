# DÉCISIONS STRUCTURANTES & CAPITALISATION — MISSION 03

Ce document consigne les décisions architecturales, méthodologiques, pédagogiques et techniques définitivement adoptées à l'issue de la **Mission 03** d'**AI CREATOR Studio**.

Il constitue la référence permanente pour le développement futur de la plateforme et l'élaboration des contenus de formation.

---

## 1. Vision Produit Retenue

**AI CREATOR Studio** permet à tout créateur, formateur, consultant ou expert métier de convertir un document existant (guide PDF, méthode opérationnelle, tableur financier, checklist, trame de coaching) en un produit digital interactif, personnalisé et directement exploitable par ses clients.

### Promesse Fondatrice :
> *« Transforme ton document existant en application interactive à ton image et publie-la en ligne en 3 jours, sans coder. »*

Le produit final remis à l'utilisateur final n'est ni un simple PDF statique ni une coquille Notion : c'est une véritable application web monopage, fluide, responsive, esthétiquement soignée et parfaitement fidèle aux règles métier de son créateur.

---

## 2. Méthode de Transformation Retenue

La méthode industrielle de conversion s'articule en **7 étapes linéaires et rigoureuses** :

```mermaid
flowchart LR
    D["1. Document Source"] --> A["2. Analyse"]
    A --> B["3. Product Blueprint"]
    B --> SFM["4. Source Fidelity Mapping"]
    SFM --> DA["5. Direction Artistique"]
    DA --> GEN["6. Génération HTML"]
    GEN --> PUB["7. Publication & Vente"]
```

1. **Document Source** : L'apprenant fournit sa matière première brute sans préparation technique préalable (PDF, Markdown, texte ou tableur).
2. **Analyse Invisible** : L'IA identifie l'essence opérationnelle, les données manipulées, les logiques de calcul et les cas limites sans solliciter inutilement l'utilisateur.
3. **Product Blueprint** : Modélisation formelle de l'application (identité, 3 étapes du parcours, liste fermée des entrées, moteur de calcul interne, restitution des résultats).
4. **Source Fidelity Mapping (SFM)** : Matrice d'intégrité garantissant que 100 % des formules, distinctions subtiles, avertissements et cas limites du document source sont intégralement retranscrits dans le Blueprint.
5. **Entretien de Direction Artistique** : Dialogue guidé et non technique proposant 3 pistes esthétiques contrastées, nées de la personnalité du sujet, aboutissant au *Visual Direction Brief* (VDB).
6. **Génération HTML Monofichier** : Production autonome du code source complet (`index.html`) intégrant styles, scripts, balisage et auto-critique visuelle préalable.
7. **Tests, Publication & Vente** : Validation par double-clic local, déploiement instantané sur Netlify Drop et configuration de la livraison commerciale sur Chariow.

---

## 3. Parcours Apprenant Final : Les Deux Prompts Maîtres

Pour supprimer toute friction cognitive, la chaîne modulaire exploratoire (prompts L1 à L5) a été unifiée en **deux prompts maîtres standardisés**, exécutés successivement au sein de la **même conversation Claude** :

### Prompt 1 — Entretien de Direction Artistique (`PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE.md`)
- **Rôle** : Cadrer, analyser, questionner et formaliser le design avant toute écriture de code.
- **Déroulement** :
  1. Claude confirme sa compréhension du document source sans afficher de code.
  2. Il pose une à deux questions ciblées sur l'univers visuel souhaité.
  3. Il propose **3 directions artistiques distinctes et adaptées au document** (ex. carnet d'atelier tactile, univers éditorial typographique, console technique épurée).
  4. L'apprenant valide sa direction ou demande des ajustements.
  5. Claude délivre les 3 livrables fondateurs : **Product Blueprint**, **Source Fidelity Mapping** et **Visual Direction Brief**.
- **Règle absolue** : Aucun code HTML n'est produit lors du Prompt 1.

### Prompt 2 — Génération du Produit HTML (`PROMPT-GENERATION-PRODUIT-HTML.md`)
- **Rôle** : Produire l'application finale autonome.
- **Déroulement** :
  1. Exécuté impérativement dans la continuité de la même session Claude (préservation de l'état contextuel).
  2. Claude applique intégralement les invariants du Blueprint, les 11 règles du SFM et le Visual Direction Brief validé.
  3. Il exécute un contrôle d'auto-critique pré-livraison en 5 points.
  4. Il émet le code intégral du fichier unique `index.html`.

---

## 4. Rôle du Skill `ai-creator-design-intelligence`

Le skill `ai-creator-design-intelligence` arme Claude des compétences avancées d'un Lead Designer et d'un Senior Frontend Craft Engineer :
- **Neutralisation de la généricité IA** : Interdiction absolue des cartes blanches uniformes, des fonds gris froids `#F3F4F6` impersonnels, des ombres floues par défaut et des dégradés violets/bleus stéréotypés.
- **Direction artistique dérivée du sujet** : La palette, le contraste d'échelle, les textures et la tonalité éditoriale doivent impérativement découler du thème métier du document source.
- **Règle d'or anti-standardisation** : **Ne jamais imposer la charte graphique Burgundy / Cream d'AI CREATOR Studio aux apprenants**. Chaque produit créé doit arborer une identité qui lui est propre.

---

## 5. Principes de Conception Définitivement Retenus

1. **Identité Visuelle Forte & Mémorable** : Tout produit généré doit posséder une présence graphique remarquable dès le premier coup d'œil.
2. **Fidélité Fonctionnelle Absolue** : Zéro régression, omission ou approximation sur les règles métier du document source.
3. **Design Adapté à la Typologie d'Outil** : Une calculatrice financière n'adopte pas les mêmes codes visuels qu'une trame d'évaluation RH ou un carnet d'organisation hebdomadaire.
4. **Composition & Typographie Travaillées** : Contraste d'échelle marqué (`clamp()`), typographies avec forte personnalité (Serif de titrage, Monospace technique), rythme asymétrique et aération spatiale.
5. **Responsive Mobile-First Exigeant** : Pièce maîtresse (ticket, verdict ou dashboard) accessible immédiatement sur écran tactile (`375 px`), cibles tactiles $\ge 44\text{ px}$, polices de saisie $\ge 16\text{ px}$ (anti-zoom iOS), zéro débordement horizontal.
6. **Accessibilité & Ergonomie** : Ratios de contraste WCAG AA rigoureusement mesurés ($\ge 4,5:1$), focus outline visible de 3px, labels explicites et retour d'état immédiat.
7. **Simplicité Technique pour Non-Développeur** : Utilisation directe sans terminal, sans Node.js, sans git et sans étape de compilation locale.

---

## 6. Architecture Technique Retenue

- **Monofichier Autonome (`index.html`)** : Tout le code (HTML5 sémantique, CSS3 moderne et Vanilla JavaScript ES6+) est encapsulé dans un unique fichier livrable.
- **Zero-Build & Vanilla JS Prioritaire** : Aucun bundler (Vite, Webpack) ni framework lourd requis pour l'application apprenant.
- **Exclusion des CDN Fragiles** : Rejet de Tailwind CDN (`cdn.tailwindcss.com`) pour éviter tout flash de style non mis en forme (FOUC) ou rupture hors-ligne.
- **Transparence Réseau & Autonomie** : Piles de polices système sculptées en priorité pour un fonctionnement autonome sans dépendance Google Fonts. Distinction explicite entre un fichier local et une application 100 % hors-ligne.
- **Persistance Conditionnelle** : Implémentation du pattern `StorageAdapter` avec bascule transparente en mémoire volatile lorsque le stockage local `localStorage` est restreint ou sous protocole `file://`.
- **Canaux de Diffusion** : Publication web instantanée en HTTPS via Netlify Drop et packaging commercial / monétisation via Chariow.

---

## 7. Standards de Validation (Assurance Qualité)

L'évaluation d'un produit généré sépare rigoureusement la conformité technique de la qualité esthétique :

### A. QA Technique & Fonctionnelle (Invariants)
- Conformité intégrale au Product Blueprint.
- Préservation des 11 règles du Source Fidelity Mapping (SFM).
- Absence totale d'erreurs JavaScript en console (`0 erreur`).
- Robustesse arithmétique : traitement exact en centimes, rejet explicite des saisies invalides avec conservation de la valeur brute dans le champ et suspension des calculs.
- Gestion élégante des cas limites (`CA = 0`, passif circulant nul, valeurs négatives) sans `NaN` ni `Infinity`.
- Cibles tactiles $\ge 44\text{ px}$ et conformité WCAG AA sur les contrastes.

### B. QA Visuelle (Design Quality Gate)
Évaluation sur **35 points** répartis en 7 critères fondamentaux (notés de 1 à 5) :
1. Identité visuelle et mémorabilité
2. Hiérarchie typographique et contraste d'échelle
3. Harmonie chromatique et traitement des surfaces
4. Composition, asymétrie et rythme spatial
5. Qualité et finition des composants d'interface
6. Cohérence stylistique avec le sujet métier
7. Équilibre et finition sur mobile (`375 px`)

**Seuil d'acceptabilité retenu** : Score global $\ge 28 / 35$, avec une note minimale d'au moins **3 / 5 sur chaque critère**.

---

## 8. Conclusion du Test Marc V2 (Preuve de Concept)

Le prototype **Marc V2** (`docs/examples/marc-v2/`) constitue l'unique preuve de concept conservée :
- **Faisabilité Établie** : Il prouve qu'un document financier brut peut être transformé, via Claude Free assisté du skill, en un simulateur de trésorerie à forte identité visuelle (carnet d'audit fiduciaire sombre et crème), réactif, tactile et précis.
- **Statut Honnête & Réserves** :
  - Le score de 35/35 reflète une auto-évaluation interne réussie, démontrant un bond qualitatif majeur par rapport au prototype Marc V1 (13/35).
  - La présence d'un plafond à 1 milliard d'euros (`CAP = 99999999900`) et le centrage géométrique de la jauge SVG (axe à 164 px sur un viewBox de 328 px traversant les lignes textuelles) ont été documentés comme des limites techniques spécifiques.
  - Marc V2 démontre le potentiel du système sans constituer une garantie automatique d'infaillibilité pour tous les futurs produits d'apprenants.

---

## 9. Décisions Reportées & Clôture de la Phase Exploratoire

- **Arrêt des prototypes Claire et Sophie** : Les prototypes Claire (RH) et Sophie (Organisation) ne sont pas poursuivis. Leurs documents sources, journaux et ébauches sont définitivement archivés/supprimés.
- **Fin des prototypes exploratoires** : Aucun nouveau prototype n'est planifié ni requis.
- **Reprise du développement normal** : La phase expérimentale est formellement close. Les efforts de l'équipe se concentrent désormais sur :
  1. L'intégration des deux prompts maîtres et du guide apprenant dans le curriculum de la plateforme.
  2. La finalisation des modules pédagogiques (Modules 1, 2 et 3) d'AI CREATOR Studio.
  3. La robustesse de l'expérience d'apprentissage interactive.
