# AI CREATOR STUDIO : Design System & Visual Architecture (V2)

## 1. Identity & Visual Personality

- **Platform**: **AI CREATOR Studio** (Plateforme de formation interactive Document-First en 9 journées).
- **Course Title**: *« Utiliser Claude pour créer un produit digital qui ne ressemble pas à de la merde générée par l'IA »*.
- **Platform Aesthetic Direction**: **Néo-Brutaliste Éditorial** (Inspiration print tactile, journaux indépendants, blocs structurés au scalpel, zéro slop générique d'IA).
- **Tone**: Pragmatique, rigoureux, direct, exigeant, concret.

---

## 2. Cardinal Principle : Separation of Visual Identities

> [!IMPORTANT]
> **La charte graphique d'AI CREATOR Studio n'est JAMAIS imposée au produit de l'apprenant.**

- **AI CREATOR Studio (Plateforme)** : Utilise l'esthétique Néo-Brutaliste Éditoriale détaillée ci-dessous (Crème Papier, Orange Vif, Bordures noires franches 2px, Ombres dures 4px).
- **Produit de l'Élève (Application Finale)** : L'élève choisit librement sa direction artistique au **Jour 04** dans son Dossier de Projet (`artisticDirection`). Il dispose de palettes professionnelles complètes (Slate Emerald, Warm Bronze, Cyber Indigo, Classic Monochrome, etc.), de styles typographiques adaptés à sa cible (Inter, Plus Jakarta Sans, DM Serif, Playfair, etc.) et de rayons de bordures personnalisés (strict 0px, doux 8px, moderne 14px ou pilule).

---

## 3. Platform Color System (AI CREATOR Studio)

- **Paper Cream (`#FAF6F0`)** : Fond principal du canevas et surfaces secondaires.
- **Vivid Orange (`#FF4D00`)** : Accent de marque principal, états actifs/complétés, badges d'action et boutons CTA majeurs.
- **Deep Black (`#111111`)** : Encre de texte principale, bordures structurelles franches (`2px solid #111111`), ombres décalées dures (`4px 4px 0px #111111`).
- **Pure White (`#FFFFFF`)** : Cartes interactives élevées, formulaires de saisie, zones de code et conteneurs d'exercices.
- **Muted Gray (`#E5E0D8`)** : Séparateurs et états désactivés.
- **Success Green (`#16A34A`)** : Validation de livrables et états 'valid' du dossier.

---

## 4. Typography (Platform)

- **Display Headings** : `Archivo Black` / `Syne` (Titres structuraux en casse normale lisible, jamais de forçage en majuscules non désiré sur mobile).
- **Editorial Accent** : `Instrument Serif` / `Newsreader` (Italique éditoriale pour créer un contraste tactile sur les mots-clés).
- **Body Copy** : `Plus Jakarta Sans` (Grotesque éditoriale à haute lisibilité, interlignage confortable).
- **Technical / Prompts / Variables** : `JetBrains Mono` (Variables dynamiques `{{dossier.champ}}`, extraits de code HTML/CSS/JS, compteurs de caractères et badges d'étapes).

---

## 5. Layout & Components

- **Rythme en 3 Modules (9 Journées)** :
  - Module 1 : L'opportunité et le positionnement (J1 à J3).
  - Module 2 : Concevoir et créer avec Claude (J4 à J6).
  - Module 3 : Vendre et promouvoir (J7 à J9).
- **Découpage d'une journée** :
  - **3 étapes maximum** par journée (onglets horizontaux clairs, progression séquentielle).
  - En-tête de journée avec rappel du livrable officiel à produire.
  - Sauvegarde locale automatique et synchronisation bidirectionnelle avec le Dossier de Projet.
- **Composants clés** :
  - `CourseHero` : Titre officiel lisible sur mobile dès 375 px, sans citation obsolète.
  - `ProjectDossier` : Tiroir et page dédiée avec 18 champs canoniques, jauges de taille, indicateur anti-secrets et export/import JSON.
  - `MasterPromptBlock` : Boîte de prompt XML stylisée avec copie en un clic et coloration syntaxique des variables injectées.
  - `ModelVisualizerBlock` : Présentation interactive des 4 modèles canoniques au Jour 04.

---

## 6. Motion & Feedback

- **Transitions** : Animations de transition légères au changement d'étape et d'onglet (Framer Motion).
- **États de pression** : Les boutons et cartes interactives utilisent un effet tactile brutaliste (`active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`).
- **Indicateur de sauvegarde** : Retour visuel immédiat lors de l'enregistrement dans le LocalStorage.
