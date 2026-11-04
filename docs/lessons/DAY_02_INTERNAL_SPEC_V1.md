# SPÉCIFICATIONS TECHNIQUES & MATRICE DE CONFORMITÉ : JOUR 02 (VERSION RÉVISÉE MISSION 05-C)
## Documentation d'ingénierie interne pour l'intégration React

> **Statut** : Document technique interne de référence pour les développeurs.  
> **Source éditoriale associée** : `docs/lessons/DAY_02_PEDAGOGICAL_CONTENT_V1.md`.  
> **Registre de recherche associé** : `docs/research/DAY_02_RESEARCH_REGISTER.md`.  
> **Architecture parente** : `docs/PEDAGOGICAL_ARCHITECTURE_V1.md` & `docs/RESEARCH_DRIVEN_PEDAGOGICAL_PRODUCTION_PROTOCOL.md`.

---

## 1. Table de correspondance technique vers les composants existants (`src/types/course.ts`)

L'intégration du Jour 02 dans `src/data/days/day-02.ts` réutilise exclusivement les composants existants du moteur sans créer aucun composant nouveau, sans altérer les composants génériques, et sans insérer de `VideoBlock` fictif ni de faux callouts décoratifs :

| Étape canonique | ID de bloc | Type de bloc React | Rôle pédagogique et données associées | Liaisons dynamiques (`profileBinding` / LocalStorage) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Comprendre** | `day02-step1-buyer-vs-audience` | `ProseBlock` | Distinction Audience globale vs Acheteur en situation, panorama des formats de produits digitaux (PDF, templates, calculateurs, cours vidéo, outils interactifs) et rôle réel de l'interactivité. | Aucun |
| **1. Comprendre** | `day02-step1-forces-of-progress` | `ProseBlock` | Les 5 Anneaux d'Insights d'Achat (Adele Revella) avec rôle nuancé de la démographie, distinction Acheteur vs Utilisateur, et modèle qualitatif des 4 Forces du Changement (Bob Moesta). | Aucun |
| **1. Comprendre** | `day02-step1-rings-and-objections` | `ProseBlock` | Identification des déclencheurs internes et externes, barrières perçues, et recherche client non biaisée (*The Mom Test* de Rob Fitzpatrick) pour extraire le vocabulaire brut (*Voice of Customer*). | Aucun |
| **1. Comprendre** | `day02-step1-concept-quiz` | `QuizBlock` | Quiz de 4 questions situationnelles (Démographie vs Contexte d'action, Forces de Moesta, Mom Test de Fitzpatrick, Acheteur vs Utilisateur). | `state.quizStates['day02-step1-concept-quiz']` |
| **2. Prompt Claude** | `day02-step2-explainer` | `ProseBlock` | Principes de prompt engineering qualitatif (rôle d'auditeur critique, étanchéité XML, diagnostic initial de la matière selon deux voies pédagogiques, negative prompting). | Aucun |
| **2. Prompt Claude** | `day02-step2-master-prompt` | `PromptBuilderBlock` | Compilateur dynamique du Prompt Maître avec balisage XML complet, ciblage `sales-copy`, et synchronisation avec les variables de profil. Supporte le cas avec matière client existante et le cas démarrage sans clients. | `targetAudience` (`profileBinding: 'targetAudience'`), `business` (`profileBinding: 'business'`) |
| **2. Prompt Claude** | `day02-step2-followups` | `ProseBlock` | Guide d'exécution (Voie 1 retours clients vs Voie 2 démarrage) et bibliothèque de 4 relances ciblées (recadrage concret, objection cachée, nettoyage de jargon, test terrain Mom Test). | Aucun |
| **3. Exemple guidé** | `day02-step3-context-ethics` | `ProseBlock` | Avertissement déontologique rigoureux : `avant-pdf-statique.html` (Alexandre V.) est une démonstration interne à 5 pages visibles (1/12 à 5/12). Refus formel d'inventer des comportements ou des anecdotes non attestés. | Aucun |
| **3. Exemple guidé** | `day02-step3-analysis-8points` | `ProseBlock` | Grille de Vérité Documentaire en 3 colonnes (Fait documentaire vérifiable, Déduction raisonnable sur le format, Hypothèse à vérifier auprès d'acheteurs) et formulation de 4 questions d'entretiens *Mom Test* recommandées. | Aucun |
| **3. Exemple guidé** | `day02-step3-pitfalls` | `ProseBlock` | Déconstruction critique de l'hypothèse de l'abonnement SaaS mensuel à 29 euros (rejetée comme fait et rétrogradée en hypothèse) et analyse des 3 pièges de modélisation (prix vs valeur, projection de ses goûts, verbatims stylisés). | Aucun |
| **4. À vous de jouer** | `day02-step4-intro` | `ProseBlock` | Consigne générale de l'atelier personnel et adaptation aux deux profils d'apprenants (vendeurs actifs avec retours réels vs débutants avec entretiens exploratoires ou avis publics). | Aucun |
| **4. À vous de jouer** | `day02-deliverable-a-situation` | `TextExerciseBlock` | Livrable A : Situation de départ de l'acheteur (contexte, outils actuels, contrainte de fond). | `state.exerciseAnswers['day02-deliverable-a-situation']` |
| **4. À vous de jouer** | `day02-deliverable-b-frustrations` | `TextExerciseBlock` | Livrable B : Matrice des 5 frustrations concrètes avec statut [FAIT DOCUMENTÉ] ou [HYPOTHÈSE À VÉRIFIER]. | `state.exerciseAnswers['day02-deliverable-b-frustrations']` |
| **4. À vous de jouer** | `day02-deliverable-c-triggers` | `TextExerciseBlock` | Livrable C : Les déclencheurs d'achat (Trigger interne + Trigger externe). | `state.exerciseAnswers['day02-deliverable-c-triggers']` |
| **4. À vous de jouer** | `day02-deliverable-d-objections` | `TextExerciseBlock` | Livrable D : Les 3 objections majeures et leurs désamorçages rationnels. | `state.exerciseAnswers['day02-deliverable-d-objections']` |
| **4. À vous de jouer** | `day02-deliverable-e-vocabulary` | `TextExerciseBlock` | Livrable E : Vocabulaire brut et expressions authentiques (*Voice of Customer*). | `state.exerciseAnswers['day02-deliverable-e-vocabulary']` |
| **4. À vous de jouer** | `day02-deliverable-final-card` | `TextExerciseBlock` | Livrable Final : Synthèse de la fiche acheteur qualitative complète. | `state.exerciseAnswers['day02-deliverable-final-card']` |
| **4. À vous de jouer** | `day02-step4-checklist` | `StepChecklistBlock` | Checklist d'auto-validation en 8 critères observables axée sur l'honnêteté épistémique et la traçabilité. | `state.checklistAnswers['day02-step4-checklist']` |
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
