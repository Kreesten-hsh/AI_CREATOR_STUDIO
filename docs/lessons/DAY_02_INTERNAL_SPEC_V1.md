# SPÉCIFICATIONS TECHNIQUES & MATRICE DE CONFORMITÉ : JOUR 02
## Documentation d'ingénierie interne pour l'intégration React (Mission 05)

> **Statut** : Document technique interne de référence pour les développeurs.  
> **Source éditoriale associée** : `docs/lessons/DAY_02_PEDAGOGICAL_CONTENT_V1.md`.  
> **Registre de recherche associé** : `docs/research/DAY_02_RESEARCH_REGISTER.md`.  
> **Architecture parente** : `docs/PEDAGOGICAL_ARCHITECTURE_V1.md` & `docs/RESEARCH_DRIVEN_PEDAGOGICAL_PRODUCTION_PROTOCOL.md`.

---

## 1. Table de correspondance technique vers les composants existants (`src/types/course.ts`)

L'intégration du Jour 02 dans `src/data/days/day-02.ts` réutilise exclusivement les composants existants du moteur sans créer aucun composant nouveau, sans altérer les composants génériques, et sans insérer de `VideoBlock` fictif ni de faux callouts décoratifs :

| Étape canonique | ID de bloc | Type de bloc React | Rôle pédagogique et données associées | Liaisons dynamiques (`profileBinding` / LocalStorage) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Comprendre** | `day02-step1-buyer-vs-audience` | `ProseBlock` | Distinction Audience globale vs Acheteur en situation, fin du persona démographique (Adele Revella), et différence Acheteur vs Utilisateur (Cindy Alvarez). | Aucun |
| **1. Comprendre** | `day02-step1-forces-of-progress` | `ProseBlock` | Modèle des 4 Forces du Changement de Bob Moesta (Push, Pull, Anxiété, Habitude), équation du passage à l'acte, et définition de la situation de départ. | Aucun |
| **1. Comprendre** | `day02-step1-rings-and-objections` | `ProseBlock` | Identification des 5 frustrations distinctes, Triggers internes/externes, les 4 familles d'objections d'usage, et règles du Mom Test pour le vocabulaire brut (*Voice of Customer*). | Aucun |
| **1. Comprendre** | `day02-step1-concept-quiz` | `QuizBlock` | Quiz de 4 questions situationnelles (Démographie vs Contexte, Forces de Moesta, Mom Test de Fitzpatrick, Acheteur vs Utilisateur). | `state.quizStates['day02-step1-concept-quiz']` |
| **2. Prompt Claude** | `day02-step2-explainer` | `ProseBlock` | Principes de prompt engineering qualitatif (rôle d'auditeur UX, étanchéité XML, protocole socratique adaptatif si données manquantes, negative prompting). | Aucun |
| **2. Prompt Claude** | `day02-step2-master-prompt` | `PromptBuilderBlock` | Compilateur dynamique du Prompt Maître avec balisage XML complet, ciblage `sales-copy`, et synchronisation avec les variables de profil. | `targetAudience` (`profileBinding: 'targetAudience'`), `business` (`profileBinding: 'business'`) |
| **2. Prompt Claude** | `day02-step2-followups` | `ProseBlock` | Guide d'exécution (Cas avec verbatims vs Cas d'expérience orale) et bibliothèque de 4 relances ciblées (recadrage concret, objection cachée, nettoyage de jargon, test terrain). | Aucun |
| **3. Exemple guidé** | `day02-step3-context-ethics` | `ProseBlock` | Avertissement déontologique sur le statut de démonstration interne de `avant-pdf-statique.html` (Alexandre V.) et continuité curriculaire depuis le Jour 01. | Aucun |
| **3. Exemple guidé** | `day02-step3-analysis-8points` | `ProseBlock` | Déroulé complet de l'extraction en 8 points : Situation de départ (expert au forfait), 5 frustrations réelles (charge fluctuante, temps protégé, etc.), Triggers, Objections, Vocabulaire brut, et Fiche acheteur résultante. | Aucun |
| **3. Exemple guidé** | `day02-step3-pitfalls` | `ProseBlock` | Analyse des 3 pièges fréquents (confondre prix et valeur, projection de ses préférences, verbatims stylisés artificiellement) et rejet d'une fausse hypothèse de volonté de payer (abonnement SaaS). | Aucun |
| **4. À vous de jouer** | `day02-step4-intro` | `ProseBlock` | Consigne générale de l'atelier personnel et grille d'étalonnage comparative (formulations insuffisantes vs acceptables dans le Conseil B2B). | Aucun |
| **4. À vous de jouer** | `day02-deliverable-a-situation` | `TextExerciseBlock` | Livrable A : Situation de départ de l'acheteur (contexte, outils actuels, contrainte de fond). | `state.exerciseAnswers['day02-deliverable-a-situation']` |
| **4. À vous de jouer** | `day02-deliverable-b-frustrations` | `TextExerciseBlock` | Livrable B : Matrice des 5 frustrations distinctes avec statut [FAIT AVÉRÉ] ou [HYPOTHÈSE À VÉRIFIER]. | `state.exerciseAnswers['day02-deliverable-b-frustrations']` |
| **4. À vous de jouer** | `day02-deliverable-c-triggers` | `TextExerciseBlock` | Livrable C : Les déclencheurs d'achat (Trigger interne + Trigger externe). | `state.exerciseAnswers['day02-deliverable-c-triggers']` |
| **4. À vous de jouer** | `day02-deliverable-d-objections` | `TextExerciseBlock` | Livrable D : Les 3 objections majeures et leurs désamorçages rationnels. | `state.exerciseAnswers['day02-deliverable-d-objections']` |
| **4. À vous de jouer** | `day02-deliverable-e-vocabulary` | `TextExerciseBlock` | Livrable E : Vocabulaire brut et expressions authentiques (*Voice of Customer*). | `state.exerciseAnswers['day02-deliverable-e-vocabulary']` |
| **4. À vous de jouer** | `day02-deliverable-final-card` | `TextExerciseBlock` | Livrable Final : Synthèse de la fiche acheteur qualitative complète. | `state.exerciseAnswers['day02-deliverable-final-card']` |
| **4. À vous de jouer** | `day02-step4-checklist` | `StepChecklistBlock` | Checklist d'auto-validation en 8 critères observables pour contrôler la robustesse de la fiche avant passage au Jour 03. | `state.checklistAnswers['day02-step4-checklist']` |
| **4. À vous de jouer** | `day02-step4-resources` | `ResourceBlock` | Fiches Markdown téléchargeables (`fiche-acheteur-qualitative-j02.md` et `grille-audit-mom-test-forces-j02.md`). | Aucun |

---

## 2. Matrice de transition curriculaire vers le Jour 03

Le Jour 02 alimente directement les journées suivantes sans empiéter sur leurs périmètres :

| Donnée produite au Jour 02 | Rôle au Jour 03 (Positionnement & Promesse) | Rôle au Jour 04 (Format & Prix) | Rôle au Jour 11-15 (Page de vente) |
| :--- | :--- | :--- | :--- |
| **Situation de départ & Outils actuels** | Contraste de la promesse (avant/après) | Benchmark des alternatives bricolées | Section Hero & Récit de transformation |
| **5 Frustrations concrètes** | Cible de la promesse de transformation | Définition des fonctionnalités minimales | Sections Problème et Agitation |
| **Triggers d'achat** | Accroche contextuelle | Priorisation des parcours d'usage | Titres d'ouverture de la page de vente |
| **Objections & Anxiétés** | Réassurance et garanties de simplicité | Limitation de la complexité technique | Section FAQ et désamorçage |
| **Vocabulaire brut (*VoC*)** | Ton et formules d'impact | Noms des boutons et actions | Copywriting authentique des titres et boutons |
