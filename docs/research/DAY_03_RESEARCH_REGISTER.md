# REGISTRE DE RECHERCHE DOCUMENTAIRE : JOUR 03
## Formation AI CREATOR Studio | Sprint 1 : FONDATIONS & STRATÉGIE PRODUIT | Jour 03 : POSITIONNEMENT & PROMESSE

> **Objet** : Traçabilité factuelle, méthodologique et déontologique des sources préalables à la conception pédagogique du Jour 03.  
> **Protocole associé** : `docs/RESEARCH_DRIVEN_PEDAGOGICAL_PRODUCTION_PROTOCOL.md`.  
> **Principe absolu** : Vérifier avant d'affirmer. Zéro information inventée. Distinction stricte entre faits documentés, déductions méthodologiques, interprétations et hypothèses à valider sur le terrain.

---

## 1. PÉRIMÈTRE ET OBJECTIF DE LA RECHERCHE

Le Jour 03 a pour mission d'apprendre à chaque apprenant d'AI CREATOR Studio à positionner son propre produit digital auprès de son acheteur final et à formuler une promesse de transformation vérifiable, en s'appuyant sur les livrables acquis aux Jours 01 et 02.

Le périmètre de recherche couvre :
1. Les fondations du positionnement stratégique selon April Dunford (*Obviously Awesome*).
2. La conception de proposition de valeur selon Strategyzer (Alex Osterwalder, Yves Pigneur et al.).
3. L'articulation avec les insights d'achat acquis au Jour 02 (Adele Revella, Bob Moesta).
4. L'ingénierie de prompt avec Claude selon la documentation officielle Anthropic (prompting structuré XML, distinctions épistémiques et gestion du statut Cas A / Cas B).
5. L'audit critique et déontologique du support de démonstration interne `public/demos/pdf-to-hub/avant-pdf-statique.html`.

---

## 2. TABLEAU SYNTHÉTIQUE DES SOURCES CONSULTÉES ET AUDITÉES

| # | Sujet / Cadre | Source & URL exacte | Auteur / Organisme | Date source / Date consultation | Type de source & Méthodologie | Données & Notions vérifiées | Limites & Précautions déontologiques | Destination dans le cours |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | Positionnement produit | *A Quickstart Guide to Positioning* (`https://www.aprildunford.com/post/a-quickstart-guide-to-positioning`) | April Dunford | 15 mars 2021 / 2026-11-04 | Publication méthodologique basée sur l'expérience en marketing B2B et lancements de startups | Les 5 composantes du positionnement : 1) Alternatives concurrentes réelles (ce que ferait le client si la solution n'existait pas, y compris statu quo ou tableur) ; 2) Capacités ou caractéristiques différenciantes uniques ; 3) Valeur pour les clients (bénéfice permis par ces capacités) ; 4) Segmentation des clients cibles qui accordent une forte valeur à ces bénéfices ; 5) Catégorie de marché (contexte qui rend la valeur évidente).<br>Pièges : concurrents fantômes ("phantom competitors") et volonté prématurée de créer une nouvelle catégorie. | Cadre pragmatique issu du B2B logiciel ; ne constitue pas une loi scientifique universelle mais un outil d'arbitrage logique. | Étape 1 (Comprendre : Fondations et composantes du positionnement) & Étape 4 (Exercice) |
| **02** | Positionnement vs Messaging | *An Introduction to Positioning* (`https://www.aprildunford.com/post/an-introduction-to-positioning`) | April Dunford | 4 mai 2020 / 2026-11-04 | Article de cadrage stratégique | Distinction formelle : le positionnement n'est ni le messaging, ni un slogan (tagline), ni le storytelling de marque, ni la vision ou mission. C'est le cadre de référence amont qui définit sur quel marché l'offre gagne et pourquoi. | À ne pas confondre avec un exercice de remplissage type "Mad Libs" sans validation terrain. | Étape 1 (Distinctions cardinales) |
| **03** | Proposition de valeur (VPC) | *The Value Proposition Canvas* (`https://www.strategyzer.com/library/the-value-proposition-canvas`) | Strategyzer AG (Alex Osterwalder et al.) | 2025-2026 / 2026-11-04 | Cadre de conception et documentation officielle | Profil client (Customer Jobs : fonctionnels, sociaux, émotionnels ; Pains : risques, frictions, coûts ; Gains : bénéfices attendus et désirés) et Carte de valeur (Produits & Services ; Pain Relievers ; Gain Creators). Adéquation ("Fit") traitée comme une hypothèse tant que le client ne l'a pas confirmée par des preuves. | Un canevas seul ne fait pas une stratégie de positionnement. Le VPC zoome sur la valeur perçue, Dunford zoome sur l'arbitrage face aux alternatives. | Étape 1 (Proposition de valeur) & Étape 2 (Prompt Claude) |
| **04** | Caractéristiques de la valeur | *Value proposition: the key to winning customers and driving business growth* (`https://www.strategyzer.com/value-proposition`) | Strategyzer AG | 5 février 2025 / 2026-11-04 | Analyse détaillée de la valeur client et des erreurs d'adéquation | Les 10 caractéristiques d'une proposition de valeur robuste (se concentrer sur un nombre restreint de jobs/pains majeurs, s'aligner sur la mesure du succès du client, se différencier sur ce qui compte, surpasser la concurrence sur au moins une dimension). Les 5 erreurs fréquentes (mélanger les segments, projeter sa propre vision, oublier le social/émotionnel). | Approche qualitative ; nécessite une confrontation continue avec des retours terrain réels. | Étape 1 & Étape 3 (Déconstruction) |
| **05** | Insights d'achat & Forces | Réutilisation des livrables J02 : *5 Rings of Buying Insight™* (Adele Revella) & *Four Forces of Progress* (Bob Moesta) | Buyer Persona Institute & Rewired Group | 2015-2023 / 2026-11-04 | Cadres validés au Jour 02 | Le positionnement s'enracine dans les 5 Anneaux du Jour 02 : Initiatives prioritaires (déclencheur), Facteurs de succès (gains), Freins perçus (objections), Critères de décision (comparaison des alternatives), Parcours d'achat. Tension entre Push de l'existant et Pull de la nouveauté. | L'apprenant ne doit pas réinventer sa recherche client mais réutiliser directement sa fiche du Jour 02. | Étape 1, Étape 2 (Prompt) & Étape 4 (Exercice) |
| **06** | Ingénierie de prompt & Rôles | *Claude Prompt Engineering Best Practices* (`https://platform.claude.com/docs/fr/build-with-claude/prompt-engineering/claude-prompting-best-practices`) | Anthropic | 2025-2026 / 2026-11-04 | Documentation technique officielle des modèles Claude | Structuration par balises XML (`<context>`, `<instructions>`, `<source_material>`, `<constraints>`, `<output_format>`). Définition explicite du rôle et instructions sans préambule. Ancrage dans des citations et éléments de preuve. | Les balises XML organisent rigoureusement les données mais ne garantissent pas à elles seules l'exactitude sans contraintes d'évidence strictes. | Étape 2 (Prompt Maître XML du Jour 03) |
| **07** | Support de démonstration interne | `public/demos/pdf-to-hub/avant-pdf-statique.html` (*Guide Pratique d'Organisation Professionnelle*, Thomas R. - Exemple didactique fictif) | Studio AI CREATOR | Édition interne 2026 / 2026-11-04 | Fichier HTML de démonstration ergonomique | Support comportant physiquement 5 pages visibles (Pages 1/12 à 5/12). Formule de capacité manuelle, tableau à 3 profils statiques, matrice des 3 piliers, feuille de route imprimable, prompt textuel à crochets. | **Avertissement déontologique rigoureux** : ce fichier est une maquette interne de simulation, pas une étude de marché, ni une preuve de vente, ni un recueil de verbatims clients authentifiés. | Étape 3 (Exemple guidé Cas d'école didactique) |

---

## 3. CONCEPTS VALIDÉS ET DISTINCTIONS CARDINALES

### 3.1 Positionnement vs Messaging vs Slogan
- **Positionnement** : Définition stratégique interne de la façon dont le produit est le meilleur choix pour un groupe d'acheteurs précis face à des alternatives réelles qu'ils utilisent déjà. Il répond aux questions : Pour qui ? Dans quelle situation ? Face à quoi ? Avec quelle différence utile ? Pour quelle valeur clé ? Dans quel cadre de référence (catégorie) ?
- **Messaging** : La façon d'exprimer ce positionnement en langage clair à destination du public (arguments, hiérarchie de messages).
- **Slogan / Tagline** : Phrase publicitaire courte, mémorable, issue du messaging mais ne constituant en aucun cas le positionnement lui-même.
- **Storytelling** : Narration de la marque ou du créateur.

### 3.2 Proposition de valeur vs Liste de fonctionnalités
- Une fonctionnalité est une caractéristique technique du produit (ex. : « Calculateur JavaScript avec curseurs et enregistrement dans le LocalStorage »).
- La proposition de valeur est le soulagement d'une friction ou l'accès à un bénéfice concret pour l'acheteur (ex. : « Connaître son temps de création hebdomadaire réel sans calculatrice ni carnet, et sans risque d'erreur de planification »).
- Une caractéristique n'est différenciante que si elle est comparée à ce que le client utilise réellement (tableur, carnet, PDF statique, abandon). Si l'acheteur n'accorde aucune importance à cette caractéristique, elle ne crée aucune valeur.

### 3.3 Promesse de transformation vs Garantie absolue de résultat
- **Promesse de transformation** : Le résultat opérationnel ou la nouvelle capacité concrète que l'acheteur peut raisonnablement obtenir ou accomplir en appliquant le produit dans des conditions normales d'usage.
- **Règles de crédibilité d'une promesse** :
  1. Spécifique : résultat tangible et identifiable.
  2. Conditionnée : liée à l'application de la méthode par l'utilisateur (absence de promesse magique).
  3. Vérifiable : l'utilisateur peut constater par lui-même si le résultat est atteint.
  4. Réaliste : exempte de toute promesse financière garantie ou irresponsable (« Gagnez 10 000 € en 30 jours » proscrit).

### 3.4 Les véritables alternatives concurrentes
L'alternative réelle n'est pas uniquement un produit identique vendu par un concurrent commercial direct :
1. Le statu quo (continuer de bricoler avec son habitude actuelle, ne rien changer).
2. Les guides ou ebooks PDF déjà téléchargés ou gratuits.
3. Les tableurs (Excel, Google Sheets).
4. Les carnets papier et calculatrices manuelles.
5. Les templates Notion ou outils génériques.
6. Le recours à un prestataire ou à un pair.

---

## 4. FAITS DOCUMENTÉS, INTERPRÉTATIONS ET HYPOTHÈSES

### 4.1 Faits documentés [FAIT DOCUMENTÉ]
- April Dunford a documenté qu'une caractéristique technique n'est reconnue comme avantage que par rapport aux alternatives réelles envisagées par le client, et que le statu quo représente une part majeure des arbitrages (dans le logiciel B2B, environ 25 % des opportunités se soldent par « aucune décision »).
- Strategyzer a documenté que la grande majorité des propositions de valeur échouent lorsqu'elles sont conçues à travers le prisme des fonctionnalités du concepteur plutôt que des tâches et frictions du client (« 6 idées sur 10 échouent dans le monde réel »).
- Le document `avant-pdf-statique.html` comporte physiquement 5 pages visibles contenant une formule de calcul horaire manuelle, un tableau fixe de 3 profils, une répartition 40/40/20, une feuille de route 4 semaines à cases imprimées et un prompt textuel entre crochets.

### 4.2 Interprétations pédagogiques [INTERPRÉTATION MÉTHODOLOGIQUE]
- L'approche en 5 composantes d'April Dunford s'applique directement aux créateurs de produits digitaux (qu'ils vendent des guides, des cours, des templates ou des outils interactifs), car elle évite le piège des formulations marketing vides.
- Le croisement du Value Proposition Canvas (Customer Profile <-> Value Map) avec la fiche acheteur du Jour 02 permet une transition fluide sans déperdition d'information ni duplication de travail.

### 4.3 Hypothèses de travail [HYPOTHÈSE À VALIDER SUR LE TERRAIN]
- *Hypothèse 1* : Les acheteurs de guides méthodologiques valorisent l'adaptation personnalisée à leur profil et l'automatisation des calculs par rapport à un tableau statique, mais cette valorisation varie selon leur degré d'aisance avec les tableurs.
- *Hypothèse 2* : Les créateurs de cours qui positionnent leur produit comme un « atelier d'application guidée » enregistrent une meilleure clarté perçue que ceux qui se positionnent dans la catégorie générique « cours en ligne ».

---

## 5. DÉCISIONS PÉDAGOGIQUES ET ARCHITECTURALES POUR LE JOUR 03

1. **Continuité rigoureuse avec les Jours 01 et 02** :
   L'apprenant réutilise obligatoirement son problème cible (J01) et sa fiche acheteur (J02). Il ne recommence aucune étape de zéro.
2. **Double voie Cas A / Cas B préservée** :
   - *Cas A* : Apprenant disposant de clients, de ventes ou d'avis -> positionnement fondé sur les preuves disponibles.
   - *Cas B* : Apprenant débutant ou en phase de conception -> positionnement formulé sous forme d'hypothèses étiquetées `[HYPOTHÈSE À VÉRIFIER]`, sans blocage.
3. **Périmètre strict du Jour 03 respecté** :
   - Choix du format technique final (mini-app, hub, calculateur) : réservé au Jour 04.
   - Hypothèse de prix : réservée au Jour 04.
   - Architecture du produit : réservée au Jour 05.
   - Page de vente et copywriting publicitaire : réservés aux Jours 11 à 15.
4. **Zéro dogmatisme sur les formats** :
   Un PDF n'est pas qualifié de mauvais produit. L'interactivité est enseignée comme un levier de valeur uniquement lorsqu'elle élimine une friction concrète (calcul manuel, recherche fastidieuse, manque de personnalisation).
5. **Composants React** :
   Réutilisation exclusive des composants existants du studio (`prose`, `callout`, `quiz`, `prompt-builder`, `copy`, `text-exercise`, `checklist`, `resource`). 0 bloc vidéo, 0 nouveau composant.

---

## 6. SOURCES ANALYSÉES ET ÉCARTÉES

| Source écartée | Motif de rejet | Risque pédagogique évité |
| :--- | :--- | :--- |
| Générateurs automatiques de "Unique Selling Proposition" en 1 clic | Formulations marketing creuses et génériques, sans prise en compte des alternatives réelles | Apprenant produisant un slogan superficiel au lieu d'un positionnement stratégique |
| Méthodes promettant un "chiffre d'affaires garanti en 30 jours" | Manque total de rigueur éthique et légale, promesses irréalistes | Mise en danger financière et perte de crédibilité professionnelle de l'apprenant |
| Modèles imposant d'emblée la création d'une nouvelle catégorie ("Category Creation") | Comme le rappelle April Dunford, 90 % des succès s'enracinent d'abord dans une catégorie existante avant d'évoluer | Épuisement des ressources de l'apprenant à expliquer un terme abstrait que personne ne recherche |
