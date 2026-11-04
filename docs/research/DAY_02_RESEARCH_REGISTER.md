# REGISTRE DE RECHERCHE DOCUMENTAIRE : JOUR 02
## Formation 01 : COMMENCER ICI | Bloc A : Fondations et Offre
### Thématique : Psychologie et Leviers d'Achat (L'acheteur : situation, frustrations et déclencheurs)

> **Objet** : Traçabilité factuelle et déontologique des sources préalables à la rédaction pédagogique du Jour 02.  
> **Protocole associé** : `docs/RESEARCH_DRIVEN_PEDAGOGICAL_PRODUCTION_PROTOCOL.md`.  
> **Principe directeur** : « Tu ne vas pas apprendre à créer notre plateforme. Tu vas apprendre à créer la tienne. » Zéro information inventée.

---

## 1. TABLEAU SYNTHÉTIQUE DES SOURCES ET FAITS CONTRÔLÉS

| # | Sujet | Information vérifiée | Source primaire ou URL exacte | Auteur / Organisme | Date source / Date consultation | Version / Plan concerné | Destination dans le cours |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | Forces du Changement (*Forces of Progress*) | Le passage à l'acte d'achat n'est pas déterminé par des traits démographiques mais par l'équilibre dynamique entre 4 forces : Push de la situation actuelle, Pull de la solution, Anxiété du nouveau et Habitude du statu quo. Formule : $(Push + Pull) > (Anxiety + Habit)$. | *The Rewired Group / Jobs to be Done Framework* (`https://jobstobedone.org/`) | Bob Moesta & Clayton Christensen | 2016 (rev. 2020) / 2026-11-04 | Méthodologie universelle JTBD | Étape 1 (Comprendre) & Étape 4 (Checklist) |
| **02** | Recherche Utilisateur sans Biais (*The Mom Test*) | 3 règles fondamentales pour éliminer les faux positifs de politesse : 1) Parler de leur vie passée et non de votre idée ; 2) Interroger sur des faits et comportements passés précis plutôt que sur des intentions futures ; 3) Parler moins de 30 % du temps et écouter le vocabulaire réel. | *The Mom Test: How to talk to customers & learn if your business is a good idea when everyone is lying to you* (ISBN: 978-1490159973) | Rob Fitzpatrick | 2013 / 2026-11-04 | Standard Customer Discovery | Étape 1 (Vocabulaire et entretien) & Fiche ressource 2 |
| **03** | Remplacement des Personas Démographiques | Les personas basées sur l'âge, le genre ou le titre de poste sont trompeuses pour concevoir des offres. Les 5 anneaux d'insights d'achat (*5 Buyer Insight Rings*) opérationnels sont : 1) Initiatives prioritaires (Triggers) ; 2) Facteurs de succès ; 3) Barrières perçues (Objections) ; 4) Parcours d'évaluation ; 5) Critères de décision. | *Buyer Personas: How to Gain Insight into your Customer's Expectations, Align your Marketing Strategies, and Win More Business* (Wiley, ISBN: 978-1118961506) | Adele Revella (Buyer Persona Institute) | 2015 / 2026-11-04 | Standard B2B / B2C qualitatif | Étape 1 & Étape 4 (Structure Fiche acheteur) |
| **04** | Ingénierie de Prompt Qualitatif (Claude) | Délimitation étanche des consignes et du matériel brut via des balises XML (`<context>`, `<audience>`, `<source_material>`, `<evidence_rules>`, `<constraints>`, `<output_format>`). L'assignation d'un rôle d'auditeur critique et l'obligation de justifier chaque point par un fait textuel limitent les hallucinations de conformisme. | *Anthropic Official Documentation : Prompt Engineering Guide & Qualitative Analysis Patterns* (`https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering`) | Anthropic | 2025-2026 / 2026-11-04 | Claude 3.5 Sonnet / Claude 3 Haiku (Gratuit & Pro) | Étape 2 (Prompt Maître XML) |
| **05** | Distinction Acheteur (*Buyer*) vs Utilisateur (*User*) | La personne qui décide du budget et valide l'achat n'est pas nécessairement celle qui utilise l'outil au quotidien. En B2B (consultants, équipes) comme en B2C (famille, formation), leurs critères de valeur divergent : l'acheteur cherche un retour sur investissement et la réduction du risque, l'utilisateur cherche l'ergonomie et l'économie de friction immédiate. | *Lean Customer Development* (O'Reilly Media) | Cindy Alvarez | 2014 (rev. 2021) / 2026-11-04 | Méthodologie Product Strategy | Étape 1 (Comprendre, Section 1.3) |
| **06** | Analyse du Document Réel du Dépôt | Le document `avant-pdf-statique.html` simule un guide de 12 pages d'Alexandre V. ciblant 3 profils d'activité réels (Solo, Formateur, Coach) avec des charges clients de 15h à 30h/sem, confrontés à une friction hebdomadaire de calcul de capacité manuelle et à la perte de leur carnet d'action. | `public/demos/pdf-to-hub/avant-pdf-statique.html` | Alexandre V. (Démonstration interne Studio) | Création 2026 / 2026-11-04 | Matériau interne vérifié | Étape 3 (Exemple guidé) |

---

## 2. INFORMATIONS CONFIRMÉES (FACTUEL)

1. **Inutilité des personas démographiques pour les produits digitaux** :
   Les données démographiques (âge, situation de famille, localisation) ne corrèlent pas avec la décision d'adopter un outil interactif. Ce qui déclenche l'achat, c'est l'apparition d'un événement perturbateur dans un contexte opérationnel donné (*Priority Initiative* chez Revella, *Push* chez Moesta).
2. **Mécanique des Forces du Changement (Moesta)** :
   Une personne n'abandonne son contournement actuel (ex: tableur bancal, carnet de notes) que si la somme du mécontentement actuel (*Push*) et de l'attrait de la nouvelle promesse (*Pull*) surpasse l'anxiété de l'échec (*Anxiety*) et la force d'inertie de l'habitude (*Habit*).
3. **Le piège des faux positifs de politesse (Fitzpatrick)** :
   Demander à un prospect s'il « achèterait un outil qui fait X » produit 90 % de réponses positives polies mais 0 % d'engagement réel. Les seules données fiables sont les comportements passés : le temps déjà passé, l'argent déjà dépensé, et les contournements déjà bricolés par la personne.
4. **Cloisonnement XML indispensable dans Claude (Anthropic)** :
   Lorsqu'un prompt traite des retours clients bruts ou des notes non structurées, l'absence de balises XML étanches favorise la confusion entre les instructions du prompt et le contenu des notes, augmentant le risque d'inventions ou de complaisance.

---

## 3. INFORMATIONS À NUANCER (CONTEXTE, QUOTAS & LIMITES)

1. **Accès et capacités sur Claude gratuit** :
   Le prompt du Jour 02 doit fonctionner intégralement sur l'interface de discussion standard de Claude (offre gratuite). Il ne doit exiger aucun connecteur d'API payant, aucun upload de fichiers volumineux dépassant les quotas, ni aucune fonction de recherche web payante.
2. **Nature des données exploitables au Jour 02** :
   L'apprenant ne dispose pas toujours de dizaines d'entretiens enregistrés. Le protocole doit accepter une matière brute modeste : 2 ou 3 échanges e-mails, des notes de consultation informelles, des commentaires publics observés sur des forums ou des avis Amazon. Si la matière est très réduite, les points non prouvés doivent rester étiquetés comme *Hypothèses* à vérifier.
3. **Différence entre B2B et B2C** :
   Si l'acheteur et l'utilisateur sont la même personne (ex: freelance solo, passionné de cuisine, particulier), la charge cognitive et la friction d'usage priment. Si l'acheteur finance l'outil pour un tiers (ex: manager pour son équipe, parent pour son enfant), l'acheteur exige une preuve de résultat visible et un compte-rendu mesurable.

---

## 4. HYPOTHÈSES DE TRAVAIL (À VALIDER SUR LE TERRAIN)

1. **Hypothèse de friction principale des indépendants (Alexandre V.)** :
   On suppose que la raison majeure pour laquelle un indépendant abandonne sa routine de publication est la variabilité de sa charge client d'une semaine sur l'autre (validée comme observation d'Alexandre V., mais restant une hypothèse générale pour chaque apprenant sur sa propre niche).
2. **Hypothèse de résistance au changement (*Anxiety*)** :
   On pose l'hypothèse que la première objection non exprimée d'un acheteur face à un produit digital interactif est la peur de devoir apprendre un logiciel complexe ou d'y passer trop de temps au quotidien.

---

## 5. DÉCISIONS PÉDAGOGIQUES ET TECHNIQUES

1. **Orientation du cours** :
   Remplacer l'approche conventionnelle du « portrait-robot persona » par la cartographie des 5 composantes d'action : Situation de départ, 5 Frustrations concrètes, Déclencheurs (Triggers), Objections cachées, et Vocabulaire brut (*Voice of Customer*).
2. **Architecture du Prompt Maître XML** :
   Intégrer les balises `<role>`, `<context>`, `<audience>`, `<source_material>`, `<evidence_rules>`, `<analysis_method>`, `<constraints>`, `<task>`, `<output_format>`. Configurer un mode socratique adaptatif si les notes sont incomplètes.
3. **Cas d'exemple guidé (Étape 3)** :
   Poursuivre sur la démonstration d'Alexandre V. (`avant-pdf-statique.html`) pour extraire la fiche acheteur complète du freelance submergé, tout en rejetant explicitement une supposition non prouvée (la volonté d'acheter un abonnement SaaS).
4. **Livrables apprenants (Étape 4)** :
   Structurer l'atelier en 6 champs indépendants (`day02-deliverable-a-situation`, `day02-deliverable-b-frustrations`, `day02-deliverable-c-triggers`, `day02-deliverable-d-objections`, `day02-deliverable-e-vocabulary`, `day02-deliverable-final-card`), associés à une checklist de 8 critères et à 2 fiches Markdown téléchargeables.

---

## 6. SOURCES ANALYSÉES ET ÉCARTÉES

| Source écartée | Motif de rejet | Risque pédagogique évité |
| :--- | :--- | :--- |
| Modèles de personas génériques Hubspot / Canva (âge, hobbies, photo de stock) | Focalisation sur des détails cosmétiques déconnectés de la décision d'achat | Fabrication de fiches d'empathie stériles sans aucun lien avec le déclenchement de la vente |
| Articles de blogs affirmant des « taux d'objection universels » (ex: 80 % des acheteurs bloquent sur le prix) | Statistiques gratuites invérifiables, non sourcées | Croyance erronée que le prix est l'unique objection d'une offre |
| Prompts génériques d'IA « Donne-moi la psychologie de mon client cible » | Réponses complaisantes, clichés d'IA et hallucinations psychologiques | Illusion de connaissance client sans aucune observation réelle du terrain |
