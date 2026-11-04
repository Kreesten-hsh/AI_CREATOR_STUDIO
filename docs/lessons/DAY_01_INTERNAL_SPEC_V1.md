# SPÉCIFICATIONS TECHNIQUES & MATRICE DE CONFORMITÉ : JOUR 01
## Documentation d'ingénierie interne pour l'intégration React (Mission 04)

> **Statut** : Document technique interne de référence pour les développeurs.  
> **Source éditoriale associée** : `docs/lessons/DAY_01_PEDAGOGICAL_CONTENT_V1.md`.  
> **Architecture parente** : `docs/PEDAGOGICAL_ARCHITECTURE_V1.md`.

---

## 1. Table de correspondance technique vers les composants existants (`src/types/course.ts`)

Lors de la future Mission 04, le contenu pédagogique du Jour 01 sera directement instancié dans `src/data/days/day-01.ts` en utilisant exclusivement les blocs existants du moteur, sans créer aucun composant nouveau et sans insérer de faux `VideoBlock` :

| Étape canonique | ID de bloc proposé | Type de bloc React | Rôle pédagogique et données associées | Liaisons dynamiques (`profileBinding`) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Comprendre** | `day01-intro-prose` | `ProseBlock` | Chaîne de clarté, 5 définitions fondamentales, tableau comparatif multi-secteurs et différence document statique vs produit digital. | Aucun |
| **1. Comprendre** | `day01-camera-test-callout` | `CalloutBlock` (`variant: 'pro-insight'`) | Explication de la méthode du Test de la Caméra et critères d'observation sur le terrain. | Aucun |
| **1. Comprendre** | `day01-epistemic-rules-prose` | `ProseBlock` | Distinction épistémique stricte : Fait observé, Déduction logique, Hypothèse à vérifier. Règle d'or sur la volonté de payer. | Aucun |
| **1. Comprendre** | `day01-concept-quiz` | `QuizBlock` | Quiz de 4 questions situationnelles exigeantes testant la distinction fait/hypothèse, le test de la caméra, l'erreur de format et la valeur des contournements. | `quizStates['day01-concept-quiz']` |
| **2. Prompt Claude** | `day01-prompt-explainer-prose` | `ProseBlock` | Présentation des techniques de prompt engineering mobilisées (Persona, balises XML, mode socratique adaptatif, negative prompting). | Aucun |
| **2. Prompt Claude** | `day01-master-prompt-builder` | `PromptBuilderBlock` | Compilateur du Prompt Maître avec balisage XML, règles épistémiques et protocole d'interview socratique. | `business` (`profileBinding: 'business'`), `targetAudience` (`profileBinding: 'targetAudience'`) |
| **2. Prompt Claude** | `day01-prompt-followups-callout` | `CalloutBlock` (`variant: 'tip'`) | Bibliothèque des 4 prompts de relance (recadrage concret, correction d'hypothèse, différenciation, variantes de niche). | Aucun |
| **3. Exemple guidé** | `day01-demo-source-callout` | `CalloutBlock` (`variant: 'important'`) | Avertissement déontologique sur le statut de démonstration interne de `avant-pdf-statique.html` (zéro garantie commerciale). | Aucun |
| **3. Exemple guidé** | `day01-demo-analysis-prose` | `ProseBlock` | Analyse complète en 8 points du document d'Alexandre V., déconstruction du chiffre non sourcé (« 90 % »), extraction des 3 problèmes et tableau de vérité. | Aucun |
| **3. Exemple guidé** | `day01-demo-errors-callout` | `CalloutBlock` (`variant: 'warning'`) | Analyse des 3 erreurs fréquentes commises par les débutants lors de la formulation de niche. | Aucun |
| **4. À vous de jouer** | `day01-exercise-inputs` | `TextExerciseBlock` | Atelier de production des 4 livrables (matière brute, 3 problèmes candidats, classement et niche en une phrase). | `profileBinding: 'business'` avec champs secondaires `targetAudience` et livrables |
| **4. À vous de jouer** | `day01-criteria-checklist` | `StepChecklistBlock` | Checklist d'auto-validation en 8 critères observables permettant de valider l'étape et la progression du jour. | `checklistAnswers['day01-criteria-checklist']` |
| **4. À vous de jouer** | `day01-resources-block` | `ResourceBlock` | Fiches Markdown téléchargeables (`fiche-definition-niche-problemes-j01.md` et `fiche-verification-claude-j01.md`). | Aucun |

---

## 2. Matrice de conformité intégrale à l'Architecture Pédagogique V1

| Exigence de l'Architecture V1 | Section de référence V1 | Respect dans le Jour 01 | Justification technique et localisation |
| :--- | :--- | :--- | :--- |
| **Principe d'indépendance de marque** | Section 1.6 & 9.2 | Conforme | Aucune couleur, police ou style d'AI CREATOR Studio n'est imposé. Les prompts s'adaptent à toute thématique (`{{business}}`). |
| **Diversité des sources de départ** | Section 1.1 & 5 | Conforme | L'apprenant peut partir d'un PDF, de notes, d'un tableur ou d'une expertise orale (mode socratique adaptatif prévu). |
| **Périmètre strict du Jour 01** | Section 5 & 10.2 (E-12) | Conforme | Traitement exclusif de la niche et du problème cible. Aucun choix de format (réservé au Jour 04) ni de prix (réservé au Jour 04). |
| **Découpage canonique en 4 étapes** | Section 1.4 & 9.1 | Conforme | Étape 1 : Comprendre, Étape 2 : Prompt Claude, Étape 3 : Exemple guidé, Étape 4 : À vous de jouer. |
| **Zéro hallucination et pédagogie de la preuve** | Section 1.5 & 9.3 | Conforme | Déconstruction critique des fausses statistiques dans `avant-pdf-statique.html` (Page 2). Aucune statistique inventée. |
| **Niveau d'offre transparent** | Section 3.3, 3.4 & 5 | Conforme | Exécution garantie sur l'offre gratuite de Claude sans aucun service tiers payant. |
| **Critère de réussite observable** | Section 5 & 9.2 | Conforme | Description d'une situation observable chez l'acheteur et citation d'une solution actuelle de contournement. |
| **Compétences associées** | Section 5 & 8 | Conforme | `C1 Stratégie d'offre` (I) et `C3 Pilotage de Claude` (I). |
| **Règle R-02 (Zéro tiret cadratin)** | Section 1.5, 9.5 & R-02 | Conforme | Zéro tiret cadratin (code unicode U+2014) utilisé. Syntaxe basée sur deux-points, parenthèses et virgules. |
| **Intégration technique standard** | Section 9.4 & 9.5 | Conforme | Zéro composant inventé, aucun VideoBlock fictif sans URL réelle, compatibilité totale avec `src/types/course.ts`. |
