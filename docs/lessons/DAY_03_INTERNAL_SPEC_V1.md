# SPÉCIFICATIONS TECHNIQUES & MATRICE DE CONFORMITÉ : JOUR 03 (MISSION 06)
## Documentation d'ingénierie interne pour l'intégration React

> **Statut** : Document technique interne de référence pour les développeurs.  
> **Source éditoriale associée** : `docs/lessons/DAY_03_PEDAGOGICAL_CONTENT_V1.md`.  
> **Registre de recherche associé** : `docs/research/DAY_03_RESEARCH_REGISTER.md`.  
> **Architecture parente** : `docs/PEDAGOGICAL_ARCHITECTURE_V1.md` & `docs/RESEARCH_DRIVEN_PEDAGOGICAL_PRODUCTION_PROTOCOL.md`.

---

## 1. TABLE DE CORRESPONDANCE TECHNIQUE VERS LES COMPOSANTS EXISTANTS (`src/types/course.ts`)

L'intégration du Jour 03 dans `src/data/days/day-03.ts` réutilise exclusivement les composants existants du moteur sans créer aucun composant nouveau, sans altérer les composants génériques, et sans insérer de `VideoBlock` fictif ni de faux callouts décoratifs :

| Étape canonique | ID de bloc | Type de bloc React | Rôle pédagogique et données associées | Liaisons dynamiques (`profileBinding` / LocalStorage) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Comprendre** | `day03-step1-context-failure` | `ProseBlock` | Pourquoi d'excellents produits échouent lorsqu'ils sont mal positionnés (le rôle du contexte de référence selon April Dunford, orientation des attentes de l'acheteur). | Aucun |
| **1. Comprendre** | `day03-step1-four-distinctions` | `ProseBlock` | Les distinctions cardinales : Positionnement stratégique vs Messaging vs Slogan publicitaire vs Storytelling ; Proposition de valeur (Strategyzer) vs Liste de fonctionnalités ; Promesse de transformation vs Garantie de revenu. | Aucun |
| **1. Comprendre** | `day03-step1-dunford-components` | `ProseBlock` | Les 5 composantes du positionnement selon April Dunford (Alternatives concurrentes réelles, Capacités différenciantes, Valeur pour le client, Segmentation des clients cibles, Catégorie de marché). | Aucun |
| **1. Comprendre** | `day03-step1-alternatives-matrix` | `ProseBlock` | Matrice comparative d'arbitrage face aux alternatives réelles (statu quo, PDF statique, tableur, cours vidéo) avec preuves et hypothèses. | Aucun |
| **1. Comprendre** | `day03-step1-interactive-value-nuance` | `ProseBlock` | La valeur de l'interactivité sans dogmatisme : un PDF n'est pas un mauvais produit, l'interactivité ne vaut que si elle élimine une friction (calcul, personnalisation, sauvegarde). Format et prix réservés au Jour 04. | Aucun |
| **1. Comprendre** | `day03-step1-promise-formula` | `ProseBlock` | Les 4 règles d'or d'une promesse de transformation professionnelle, crédible, mesurable et vérifiable, sans surpromesse financière. | Aucun |
| **1. Comprendre** | `day03-step1-concept-quiz` | `QuizBlock` | Quiz de 4 questions situationnelles (Alternatives réelles, Différenciation vs Valeur, Positionnement vs Slogan, Déontologie de la promesse). | `state.quizStates['day03-step1-concept-quiz']` |
| **2. Prompt Claude** | `day03-step2-explainer` | `ProseBlock` | Principes du Prompt Maître XML de positionnement (rôle d'auditeur critique, distinction CAS A données réelles vs CAS B démarrage avec hypothèses, interdiction formelle de prix et format). | Aucun |
| **2. Prompt Claude** | `day03-step2-master-prompt` | `PromptBuilderBlock` | Compilateur dynamique du Prompt Maître avec balisage XML complet, ciblage `sales-copy`, et synchronisation avec les variables de profil. | `targetAudience` (`profileBinding: 'targetAudience'`), `business` (`profileBinding: 'business'`), `mainObjective` (`profileBinding: 'mainObjective'`), `productType` (`profileBinding: 'productType'`) |
| **2. Prompt Claude** | `day03-step2-followups` | `ProseBlock` | Guide d'exécution et bibliothèque de 4 relances chirurgicales (slogan creux vers capacité concrète, concurrents fantômes vers bricolage réel, caractéristique vers valeur, traque des surpromesses). | Aucun |
| **3. Exemple guidé** | `day03-step3-context-ethics` | `ProseBlock` | Avertissement déontologique rigoureux : `avant-pdf-statique.html` (Alexandre V.) est une démonstration interne à 5 pages visibles (1/12 à 5/12). Rejet de toute extrapolation non documentée. | Aucun |
| **3. Exemple guidé** | `day03-step3-alexandre-v-case` | `ProseBlock` | Déconstruction complète du Cas Alexandre V. en 7 volets : alternatives réelles, problème documentaire, capacité différenciante, valeur concrète, preuves vs hypothèses, positionnement provisoire, promesse de transformation. | Aucun |
| **3. Exemple guidé** | `day03-step3-sectorial-examples` | `ProseBlock` | Deux mini-exemples sectoriels distincts présentés comme illustrations fictives pédagogiques : 1) Formation en ligne / Concours professionnel ; 2) Nutrition / Organisation familiale. | Aucun |
| **3. Exemple guidé** | `day03-step3-pitfalls` | `ProseBlock` | Déconstruction des 3 pièges fréquents : concurrent fantôme (*Phantom Competitor*), fonctionnalité orpheline sans besoin client, promesse de revenu miraculeuse. | Aucun |
| **4. À vous de jouer** | `day03-step4-intro` | `ProseBlock` | Consigne générale de l'atelier personnel et distinction des deux voies (Voie 1 preuves documentées vs Voie 2 hypothèses étiquetées `[HYPOTHÈSE À VÉRIFIER]`). | Aucun |
| **4. À vous de jouer** | `day03-deliverable-a-alternatives` | `TextExerciseBlock` | Livrable A : Matrice des alternatives réelles (statu quo, PDF statiques, tableurs/outils génériques, limites constatées). | `state.exerciseAnswers['day03-deliverable-a-alternatives']` |
| **4. À vous de jouer** | `day03-deliverable-b-differentiation` | `TextExerciseBlock` | Livrable B : Capacités différenciantes et valeur client (différence concrète et test du « Et alors ? »). | `state.exerciseAnswers['day03-deliverable-b-differentiation']` |
| **4. À vous de jouer** | `day03-deliverable-c-positioning` | `TextExerciseBlock` | Livrable C : Énoncé de positionnement stratégique provisoire (structure canonique Pour / Confronté à / Produit / Valeur / Contrairement à / Grâce à). | `state.exerciseAnswers['day03-deliverable-c-positioning']` |
| **4. À vous de jouer** | `day03-deliverable-d-promise` | `TextExerciseBlock` | Livrable D : Promesse de transformation vérifiable (résultat opérationnel mesurable, conditions d'usage, gardes-fous). | `state.exerciseAnswers['day03-deliverable-d-promise']` |
| **4. À vous de jouer** | `day03-deliverable-e-evidence-hypotheses` | `TextExerciseBlock` | Livrable E : Balance des preuves disponibles versus hypothèses restantes à tester sur le terrain. | `state.exerciseAnswers['day03-deliverable-e-evidence-hypotheses']` |
| **4. À vous de jouer** | `day03-step4-checklist` | `StepChecklistBlock` | Checklist d'auto-validation en 8 critères observables couvrant la rigueur du positionnement, l'absence de surpromesse et l'indépendance de format. | `state.checklistAnswers['day03-step4-checklist']` |
| **4. À vous de jouer** | `day03-step4-resources` | `ResourceBlock` | Fiches Markdown téléchargeables (`guide-positionnement-promesse-j03.md` et `matrice-differenciation-promesse-j03.md`). | Téléchargement local |

---

## 2. MATRICE DE TRANSITION CURRICULAIRE VERS LES JOURS SUIVANTS

Le Jour 03 alimente rigoureusement la suite du parcours sans empiéter sur leurs décisions :

| Livrable produit au Jour 03 | Rôle au Jour 04 (Format & Hypothèse de prix) | Rôle au Jour 05 (Architecture produit) | Rôle aux Jours 11-15 (Page de vente & Lancement) |
| :--- | :--- | :--- | :--- |
| **Alternatives réelles & Limites** | Évalue si le format doit être un hub, un calculateur ou une mini-app pour battre le statu quo. Détermine la référence de valeur pour l'hypothèse de prix. | Décide des flux d'écrans nécessaires pour éliminer la friction comparée. | Structure les sections comparatives et de mise en contraste ("Avant / Après"). |
| **Capacités différenciantes & Valeur** | Sélectionne le gabarit technique optimal capable d'héberger ces capacités. | Définit les composants interactifs indispensables (calculateur, sélecteur, jauge). | Rédige les puces de bénéfices axées sur la transformation réelle. |
| **Énoncé de positionnement** | Fixe le cadre mental de l'offre pour justifier le modèle économique (one-off, pack, abonnement). | Assure la cohérence fonctionnelle globale du produit. | Établit l'accroche principale (*Hero Section*) et le sous-titre de la page de vente. |
| **Promesse de transformation** | Calibre l'étendue du produit nécessaire pour tenir la promesse sans dispersion. | Détermine le livrable final produit par l'utilisateur à l'issue de son parcours. | Formule le titre principal et la garantie de satisfaction de l'offre. |
| **Preuves & Hypothèses restantes** | Oriente les questions de validation tarifaire à tester. | Isole les fonctionnalités à développer en priorité face aux options secondaires. | Sélectionne les éléments de preuve sociale et études de cas à présenter. |

---

## 3. RÈGLES DE CONFORMITÉ TECHNIQUE ET NON-RÉGRESSION

1. **Suppression du statut de squelette** :
   Dans `src/data/days/day-03.ts`, `isSkeletonPlaceholder` doit être explicitement positionné à `false`.
2. **Synchronisation des listes de jours** :
   Dans `src/test/courseEngine.test.ts`, le jour `3` doit être retiré de `skeletonDayNumbers` et ajouté à `developedDayNumbers`.
3. **Maintien des tests de nettoyage éditorial** :
   Dans `src/test/lessonCleanup.test.tsx`, le test contrôlant qu'un jour squelette n'affiche aucun contenu factice doit désormais cibler le jour `4` (ou `5`) comme représentant des squelettes.
4. **Indépendance visuelle et persistance** :
   Toutes les saisies des apprenants sur les 5 blocs `text-exercise` doivent être persistées dans `window.localStorage` sous la clé `ai-creator-studio-progress-v1`.
5. **Absence de toute régression visuelle ou débordement** :
   Aucun composant de `day-03.ts` ne doit comporter de largeur fixe en pixels supérieure à 320 px, garantissant une parfaite fluidité sur viewport 375 px (mobile) et 1440 px (desktop).
