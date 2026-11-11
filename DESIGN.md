# AI CREATOR STUDIO : Design System & Visual Architecture

## 1. Identité Visuelle et Personnalité

- **Plateforme** : **AI CREATOR Studio** (Mini-cours pratique : 3 Modules • 3 Journées • 7 Leçons • 2 Bonus).
- **Titre du cours** : *« Utiliser Claude pour créer un produit digital qui ne ressemble pas à de la merde générée par l'IA »*.
- **Direction esthétique** : **Néo-Brutaliste Éditorial** (Inspiration print tactile, journaux indépendants, blocs structurés au scalpel, contrastes nets, zéro slop générique).
- **Tonalité** : Pragmatique, rigoureuse, directe, épurée, concrète.

---

## 2. Principe Fondamental : Indépendance Graphique

> [!IMPORTANT]
> **La charte graphique d'AI CREATOR Studio n'est JAMAIS imposée au produit de l'apprenant.**

- **AI CREATOR Studio (Plateforme)** : Utilise l'esthétique Néo-Brutaliste Éditoriale détaillée ci-dessous (Burgundy, Cream, Dusty Pink, Ink, bordures 2px, ombres dures décalées).
- **Produit de l'Élève (Application finale)** : L'élève choisit librement sa direction artistique dans le cadre de sa conception (palettes personnalisées, typographies adaptées, arrondis et contrastes WCAG AA).

---

## 3. Système de Couleurs de la Plateforme (AI CREATOR Studio)

Les couleurs canoniques de l'application sont définies dans `tailwind.config.js` et `src/styles/globals.css` :

- **Cream (`#FAF6F0`)** : Fond principal de la page, canevas et surfaces secondaires.
- **Burgundy / Primary Red (`#B63131`)** : Accent de marque principal, en-têtes majeurs, boutons d'action CTA et barres de progression.
- **Dark Red (`#922626`)** : État hover / actif des boutons principaux.
- **Dusty Pink (`#E6A0A8`)** : Accent tertiaire, tags et séparateurs décoratifs.
- **Pale Pink (`#F7E0E2`)** : Fond de la barre latérale, panneaux d'alerte doux et damiers.
- **Ink (`#171313`)** : Encre de texte principale, bordures structurelles (`2px solid #171313`) et ombres décalées (`4px 4px 0px #171313`).
- **Surface (`#FFFDFC`)** : Fond des cartes interactives, panneaux de lecture et zones de contenu.

---

## 4. Typographie

- **Display Headings** : `Archivo Black`, `Syne` (Titres de sections, grands chiffres et en-têtes en casse normale lisible dès 375px).
- **Editorial Accent** : `Instrument Serif`, `Playfair Display` (Italique éditoriale pour créer un contraste tactile sur les mots-clés).
- **Body Copy** : `Plus Jakarta Sans`, `Inter` (Grotesque éditoriale à haute lisibilité, interlignage confortable).
- **Technical & Labels** : `JetBrains Mono` (Badges, tags, numéros d'étapes et compteurs).

---

## 5. Composants et Ossature d'Interface

- **Bordures et Ombres** :
  - `border-2 border-ink` (`#171313`)
  - `shadow-brutal` (`4px 4px 0px #171313`)
  - `shadow-brutal-xs` (`2px 2px 0px #171313`)
- **Rayons de courbure** :
  - Cartes : `8px` (`rounded-brutal-card`)
  - Boutons : `6px` (`rounded-brutal-btn`)
  - Tags / Badges : `4px` (`rounded-brutal-tag`)
- **Structure de navigation** :
  - **Accueil** (`CourseHomePage` : `CourseHero` avec `CourseProgressCircle`)
  - **3 Modules** (Sidebar persistante desktop `MainSidebar` / `CourseSidebar` en `lg+`, et tiroir mobile fluide `MobileNavigation` sous `lg` avec croix de fermeture `X` alignée à côté du logo `AI CREATOR studio`, gestion du focus et verrouillage du scroll : `CHOISIR`, `CRÉER`, `PUBLIER ET LIVRER`)
  - **7 Leçons** (En-tête `DayHeader`, onglets `StepTabs`, conteneur responsive sans débordement dès `320 px` et bouton d'action linéaire `CompletionButton` permettant d'enchaîner les étapes, les leçons et les journées)
  - **2 Bonus** (`BonusView` & `MarketingLibraryView`)

---

## 6. Mouvement et Retours Visuels

- **Configuration globale** : Animations pilotées par Framer Motion 11 et encadrées par `<MotionConfig reducedMotion="user">` dans `src/app/App.tsx`.
- **États de pression** : Les boutons et cartes interactives utilisent un effet tactile brutaliste (`active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`) avec cibles tactiles conformes (≥ 44 px).
- **Transitions et micro-interactions** : Transitions de vues et de panneaux d'étapes sobres (`180 ms`, translation verticale `6 px`), coche animée dans `StepTabs`, micro-retour sur `CompletionButton` et remontée fluide en haut de page entre étapes et leçons.
- **Modale de célébration (`ModuleCompletionDialog`)** : Affichée de façon strictement éphémère lors de la première transition `incomplet → terminé` d'un module (jamais persistée dans `StudentProgress` V4 / `localStorage`), avec un CTA principal unique (`Continuer` pour les Modules 01–02, `Accueil` pour le Module 03) et une croix de fermeture `X`.
- **Confettis & retour audio sobres** : Chargement paresseux et auto-hébergé de `ConfettiAnimation` (`@lottiefiles/dotlottie-react`, `public/animations/confetti.json` et WASM local sans CDN, avec repli vers une coche statique en cas d'erreur), combiné à une brève sonnerie ascendante synthétisée via Web Audio API (`playSuccessChime`, sans fichier externe).
- **Accessibilité & `prefers-reduced-motion: reduce`** : Contrastes WCAG AA renforcés sur la hiérarchie éditoriale ; lorsque l'utilisateur active la réduction des animations, aucun lecteur Lottie n'est importé ni monté, la coche statique s'affiche immédiatement, les transitions basculent en opacité douce (`100 ms`) et le son de succès est désactivé.
