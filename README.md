# AI CREATOR Studio

> « Utiliser Claude pour créer des produits digitaux qui ne ressemblent pas à de la merde générée par l'IA »

Plateforme d'apprentissage interactive et studio de création conçu pour transformer des documents statiques (guides PDF, feuilles de calcul, contenus texte) en applications web interactives autonomes, pages éditoriales à fort impact et flux d'automatisation.

L'interface adopte une esthétique **Néo-Brutaliste Éditoriale** inspirée des publications imprimées suisses et des starter kits contemporains (palette rouge brique, rose poudré et crème papier, typographie à fort contraste, bordures nettes de 2px et ombres décalées).

---

## 1. Architecture Produit : Les Deux Expériences

L'application est structurée en deux expériences distinctes et complémentaires :

### Écran A : Accueil de formation (`CourseHomePage`)
- **Barre latérale permanente (`MainSidebar`)** : identité épurée `AI CREATOR studio`, accès direct à l'Accueil, catalogue des 5 formations, raccourcis vers les 3 sections bonus et la bibliothèque de ressources. Masquage propre de la barre de défilement verticale tout en préservant le scroll tactile et molette.
- **Hero Card compacte** : présentation du mini-cours officiel, métadonnées du parcours et accès direct en un clic à la reprise du cours.
- **Grille des 5 formations** : cartes de statut détaillant le volume de leçons, le type de contenu et l'état de déblocage.
- **Sections Bonus & Ressources** : modules d'approfondissement technique et fiches pratiques téléchargeables.

### Écran B : Espace de cours interactif (`CourseWorkspace`)
- **Barre latérale de cours (`CourseSidebar`)** : bouton de retour vers l'accueil, affichage dynamique de la progression globale, grille de progression compacte répartie sur 3 lignes pour les 25 journées sans débordement (avec navigation cross-formation au clic), et filtrage contextuel strict des leçons correspondant à la formation active avec titre de plage dynamique (`formatCourseDayRangeTitle`).
- **Entrée directe au premier jour du cours** : navigation automatique vers la première journée de chaque formation (`dayRange[0]`).
- **Bannière de leçon (`DayBanner`)** : badge du jour, titre en grand format avec typographie contrastée, description de l'objectif et jauge des 4 étapes quotidiennes.
- **Rythme en 4 étapes (`StepTabs`)** :
  1. **Comprendre** : cadrage stratégique, écueils à éviter et vidéo explicative.
  2. **Prompt Claude** : générateur dynamique avec injection des variables du profil apprenant.
  3. **Exemple guidé** : livrable de référence décortiqué et ressources prêtes à l'emploi.
  4. **À vous de jouer** : espace d'application pratique, checklist d'action et bouton de validation d'étape.

---

## 2. Programme Officiel des Formations

Le cursus officiel est articulé autour de 5 grandes formations progressives (répartition validée 15 + 2 + 3 + 3 + 2 = 25 journées) :

### Formations Principales
1. **01 : COMMENCER ICI** (Jours 01 à 15 : 15 leçons)
   - *Parcours* : Des fondations du produit interactif (Jours 01 à 05) à la transformation du savoir en application web autonome (Jours 06 à 10), jusqu'au récit éditorial et à la page de vente (Jours 11 à 15).
2. **02 : PARLONS-EN** (Jours 16 à 17 : 2 leçons)
   - *Parcours* : Extraction de l'expertise personnelle par interview socratique avec Claude (Jour 16) et rédaction humaine anti-slop sans tics IA (Jour 17).
3. **03 : FAITES-LE VÔTRE** (Jours 18 à 20 : 3 leçons)
   - *Parcours* : Psychologie des couleurs et palettes sur-mesure (Jour 18), typographie et hiérarchie éditoriale (Jour 19), et Design System avec consignes permanentes pour Claude (Jour 20).
4. **04 : CONCEVOIR + CONSTRUIRE** (Jours 21 à 23 : 3 leçons)
   - *Parcours* : Arbres de décision et diagnostics à score (Jour 21), calculateurs multi-variables (Jour 22), et exports de livrables TXT, Markdown et PDF imprimable (Jour 23).
5. **05 : HÉBERGEZ-LE** (Jours 24 à 25 : 2 leçons)
   - *Parcours* : Hébergement, nom de domaine et expérience d'accès client (Jour 24), paiement, délivrance et contrôle final du parcours d'achat (Jour 25).

### Modules Bonus & Ressources
- **Bonus 01 : Vidéos sans visage** : Conception de vidéos de contenu et démonstrateurs sans présence physique.
- **Bonus 02 : Automatisations commerciales** : Routage de prospects, ManyChat et webhooks n8n.
- **Bonus 03 : Bibliothèque marketing** : Modèles de carrousels, posts d'autorité et séquences de lancement.
- **Ressources Centralisées** : Bibliothèque d'exemples de code, templates HTML/CSS autonomes et fiches pratiques.

---

## 3. Matrice d'Alignement : Moteur Technique vs Validation Pédagogique

Afin d'assurer une transparence totale entre les développements techniques existants et le cursus pédagogique validé :

| Composant / Donnée | Réalité Technique | Statut Pédagogique |
| :--- | :--- | :--- |
| **Moteur React & Routing** | Routage dynamique par `src/utils/courseNavigation.ts` (`navigateToCourse`, `navigateToDay`, `resolveActiveCourseId`) | Validé et synchronisé avec `MAIN_COURSES.dayRange` |
| **Persistance Locale** | LocalStorage réactif avec clé de versioning et migration automatique | Validé (sauvegarde silencieuse en arrière-plan) |
| **Générateur de Prompts** | Composant `PromptBuilder` avec injection dynamique des variables du profil | Validé (utilisé sur les 25 journées) |
| **Démonstrateur PDF vers Hub** | Fichiers autonomes `avant-pdf-statique.html` et `apres-hub-interactif.html` | Validé (démonstration fil rouge de la formation) |
| **Jours 01 à 15** | Implémentés avec contenu complet, prompts et checklists d'action | Validés dans le cadre de la formation `01 : COMMENCER ICI` |
| **Jours 16 à 25** | Moteur technique opérationnel dans `src/data/days/` | Organisés selon les plages officielles des formations 02 à 05 |
| **Leçons Introductives** | Données conservées dans `src/data/startHere/` pour stabilité des tests | Découplées de l'interface (entrée directe au Jour 01) |

---

## 4. Charte Graphique Néo-Brutaliste

Le design s'appuie sur une palette éditoriale sobre et structurée, sans illustrations superflues ni dégradés génériques :

| Rôle | Teinte | Code Hexadécimal |
| :--- | :--- | :--- |
| **Couleur Primaire** | Rouge brique | `#B63131` |
| **Boutons & Actions sombres** | Rouge brique foncé | `#922626` |
| **Accents & Motifs** | Rose poudré | `#E6A0A8` |
| **Fonds de barres latérales** | Rose pâle apaisé | `#F7E0E2` |
| **Fond d'application** | Crème papier | `#FAF6F0` |
| **Bordures & Typographie** | Encre profonde | `#171313` |
| **Surfaces de cartes** | Blanc pur | `#FFFDFC` |
| **Badges & Infobulles** | Bleu pastel | `#DCE9F7` |

---

## 5. Stack Technique

- **Framework** : React 19
- **Langage** : TypeScript (mode strict, typage exhaustif sans `any`)
- **Build tool** : Vite 6
- **Styling** : Tailwind CSS avec classes utilitaires néo-brutalistes et `.no-scrollbar`
- **Animations** : Framer Motion
- **Iconographie** : Lucide React
- **Tests unitaires & intégration** : Vitest (moteur de progression, routage des cours, persistance et interpolation de prompts)
- **Persistance** : LocalStorage avec synchronisation réactive d'état

---

## 6. Installation & Commandes

```bash
# 1. Cloner le dépôt
git clone https://github.com/Kreesten-hsh/AI_CREATOR_STUDIO.git
cd AI_CREATOR_STUDIO

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement local
npm run dev

# 4. Exécuter la suite de tests unitaires
npm test

# 5. Contrôler le typage TypeScript en mode strict
npm run typecheck

# 6. Compiler pour la production
npm run build
```

---

## 7. Structure des Dossiers

```
src/
├── app/                  # Coquille applicative (App.tsx, routes.tsx)
├── components/
│   ├── bonus/            # Vues des 3 sections bonus
│   ├── course/           # Espace de cours (CourseSidebar, LessonRenderer, CompletionButton)
│   ├── home/             # Écran d'accueil (CourseHero, CourseOverview, CourseProgressCircle)
│   ├── layout/           # Mise en page (CourseLayout, MainSidebar, DayBanner, ProgressGrid, StepTabs)
│   ├── resources/        # Vue de la bibliothèque de ressources
│   └── widgets/          # Composants interactifs (PromptBuilder, VibePicker, QuizWidget, etc.)
├── context/              # Contexte de progression et persistance
├── data/
│   ├── days/             # Données des 25 journées de formation
│   ├── navigation/       # Données des 5 cours, des bonus et des ressources
│   └── startHere/        # Données d'orientation conservées pour les tests
├── hooks/                # Hooks personnalisés (useProgress, useStudentProfile)
├── styles/               # Styles globaux Tailwind et utilitaires néo-brutalistes
├── test/                 # Tests unitaires et d'intégration Vitest (courseEngine, courseNavigation)
├── types/                # Définitions TypeScript strictes (course, navigation)
└── utils/                # Utilitaires de calcul, navigation/routage, interpolation et stockage
```

---

## 8. Licence

MIT © Kreesten AGBOTON
