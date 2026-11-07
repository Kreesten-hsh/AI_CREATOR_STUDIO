# RAPPORT DE VALIDATION TECHNIQUE & QUALITÉ — PROTOTYPE MARC V2

Ce document constitue le dossier de traçabilité et de validation du prototype **Marc V2** (`docs/examples/marc-v2/index.html`), unique preuve de concept conservée à l'issue de la phase exploratoire (Mission 03).

Il rapatrie l'ensemble des règles métier, formules et scénarios fondateurs du document source initial afin de servir d'étalon fonctionnel permanent, tout en consignant avec transparence les résultats observés et les limites techniques résiduelles.

---

## 1. Contexte du Test & Objectif du Prototype

- **Sujet Métier** : Trésorerie, BFR et structure financière d'une entreprise commerciale (PME).
- **Public Cible** : Dirigeants de TPE/PME, consultants financiers et créateurs d'entreprise souhaitant évaluer leur santé financière sans ouvrir un tableur complexe.
- **Objectif du Prototype** : Valider qu'un document brut comportant 8 variables d'entrée interdépendantes et 6 indicateurs financiers peut être transformé, via Claude Free assisté du skill `ai-creator-design-intelligence`, en une application monofichier (`index.html`) alliant une **identité visuelle distinctive** et une **fidélité mathématique totale**.

---

## 2. Socle Métier & Invariants Fonctionnels

### A. Les 8 Variables d'Entrée Étanche
1. `CA` : Chiffre d'affaires annuel HT (min 0 €, entier, unité €).
2. `Stocks_Moyens` : Stocks moyens d'exploitation (utilisé pour le calcul du BFR).
3. `Creances` : Créances clients (factures émises non encore encaissées).
4. `Dettes_Fournisseurs` : Dettes fournisseurs d'exploitation (utilisé pour le BFR).
5. `FRNG` : Fonds de roulement net global (ressources stables moins emplois durables ; **valeurs négatives autorisées**).
6. `Stocks_Bilan` : Stocks au bilan de clôture (**strictement distinct** des Stocks Moyens ; utilisé pour l'Actif Circulant).
7. `Treso_Active` : Trésorerie active et disponibilités bancaires.
8. `Dettes_Court_Terme` : Passif circulant total (**strictement distinct** des Dettes Fournisseurs ; dénominateur du ratio de liquidité).

### B. Moteur de Calcul (Formules Fondamentales)
- **Formule 1 — BFR (€)** :  
  $$\text{BFR} = \text{Stocks Moyens} + \text{Créances Clients} - \text{Dettes Fournisseurs}$$
- **Formule 2 — BFR en Jours de CA (base 360 jours)** :  
  $$\text{BFR Jours} = \frac{\text{BFR}}{\text{CA HT}} \times 360$$  
  *Clause limite* : si $\text{CA} = 0$, affiche un message neutre *« Calcul impossible : le chiffre d'affaires annuel HT est nul »* sans `NaN`.
- **Formule 3 — Trésorerie Nette (€)** :  
  $$\text{Trésorerie Nette} = \text{FRNG} - \text{BFR}$$  
  *Interprétation* : $> 0$ : Situation saine (excédent) ; $= 0$ : Équilibre strict ; $< 0$ : Tension de trésorerie.
- **Formule 4 — Actif Circulant (€)** :  
  $$\text{Actif Circulant} = \text{Stocks Bilan} + \text{Créances Clients} + \text{Trésorerie Active}$$
- **Formule 5 — Passif Circulant (€)** :  
  $$\text{Passif Circulant} = \text{Dettes Court Terme}$$
- **Formule 6 — Ratio de Liquidité Générale** :  
  $$\text{Ratio} = \frac{\text{Actif Circulant}}{\text{Passif Circulant}}$$  
  *Clause limite* : si $\text{Dettes Court Terme} = 0$, affiche un message neutre *« Indéterminé : passif circulant nul »* sans `Infinity`.

### C. Matrice de Fidélité Source (SFM — 11 Règles Clés Rapatriées)
1. *Règle 1* : Distinction stricte entre Stocks Moyens (BFR) et Stocks au Bilan (Actif Circulant).
2. *Règle 2* : Distinction stricte entre Dettes Fournisseurs (BFR) et Dettes Court Terme (Liquidité).
3. *Règle 3* : Calcul dynamique exact du BFR d'exploitation.
4. *Règle 4* : Calcul du BFR en jours sur base conventionnelle de 360 jours.
5. *Règle 5* : Neutralisation sécurisée du cas $\text{CA} = 0$ (zéro `NaN`).
6. *Règle 6* : Trésorerie Nette qualifiée en 3 états sémantiques (saine, équilibre, tension).
7. *Règle 7* : Agrégation exacte de l'Actif Circulant.
8. *Règle 8* : Calcul décimal arrondi à 2 chiffres du Ratio de Liquidité.
9. *Règle 9* : Neutralisation sécurisée du cas Passif Circulant nul (zéro `Infinity`).
10. *Règle 10* : Qualification spécifique du BFR négatif en *« Ressource en fonds de roulement »* (excédent de financement).
11. *Règle 11* : Avertissement non bloquant si les dettes fournisseurs excèdent le passif circulant total.

---

## 3. Scénarios de Référence et Résultats Attendus

| Scénario | Données d'Entrée (en € HT) | Résultats Attendus (Vecteurs de Référence) |
| :--- | :--- | :--- |
| **1. Nominal (PME en croissance)** | CA = 360 000, Stocks Moy = 30 000, Créances = 45 000, Dettes Fourn = 25 000, FRNG = 60 000, Stocks Bilan = 30 000, Tréso = 10 000, Dettes CT = 25 000 | • BFR : **50 000 €**<br>• BFR jours : **50 jours**<br>• Trésorerie Nette : **+10 000 €** (Situation saine)<br>• Actif Circulant : **85 000 €**<br>• Passif Circulant : **25 000 €**<br>• Ratio : **3,40** (Excellente couverture) |
| **2. Cas Limite 1 (CA nul)** | Identique au Nominal avec **CA = 0 €** | • BFR : **50 000 €**<br>• BFR jours : **Non calculable** (*« Calcul impossible : le chiffre d'affaires annuel HT est nul »*) sans `NaN`<br>• Trésorerie Nette : **+10 000 €** |
| **3. Cas Limite 2 (Sans dettes CT)** | Identique au Nominal avec **Dettes CT = 0 €** | • BFR : **50 000 €**<br>• Ratio : **Indéterminé** (*« Indéterminé : passif circulant nul »*) sans `Infinity`<br>• Trésorerie Nette : **+10 000 €** |
| **4. Cas Limite 3 (BFR négatif)** | Stocks Moy = 5 000, Créances = 5 000, Dettes Fourn = 30 000, autres champs nominaux | • BFR : **− 20 000 €** (*« Ressource en fonds de roulement : l'exploitation génère un excédent de financement de 20 000 € »*)<br>• Trésorerie Nette : **+80 000 €** ($60 000 - (-20 000)$) |
| **5. Réinitialisation** | Clic sur bouton « Tout effacer » avec confirmation | Tous champs vidés, indicateurs remis à zéro/état neutre |

---

## 4. Comparatif Évolutif : Marc V1 vs Marc V2

| Axe d'Évaluation | Marc V1 (`outputs/marc/`) | Marc V2 (`docs/examples/marc-v2/`) | Statut du Progrès |
| :--- | :--- | :--- | :--- |
| **Identité Graphique** | Archétype SaaS générique (fond blanc/gris, bleu terne, cartes uniformes). | **Carnet d'audit fiduciaire** (toile crème `#EFEBE1`, surface `#FBFAF6`, Ticket sombre `#0F2233`). | **Rupture esthétique majeure** |
| **Typographie** | Police système unique sans hiérarchie. | Titrage d'imprimerie Serif (`Iowan Old Style`, `Palatino`), chiffres tabulaires `tabular-nums`. | **Échelle visuelle affirmée** |
| **Composant Signature** | Aucun composant visuel (texte brut uniquement). | **Jauge SVG dynamique** visualisant l'écart FRNG vs BFR. | **Saut d'incarnation graphique** |
| **Précision Arithmétique** | Flottants IEEE 754 ordinaires. | **Arithmétique en centimes entiers** (`cents = Number(p[0] + d)`). | **Sécurité mathématique** |
| **Ergonomie Tactile** | Champs de formulaire 40px ordinaires. | Champs et boutons $\ge 44\text{ px}$, taille 1.05rem (anti-zoom Safari iOS). | **Conformité tactile mobile** |
| **Disposition Mobile** | Empilement vertical monotone où le verdict est enfoui. | **Ticket de Verdict fixe en bas d'écran** avec tiroir de détails dépliable. | **Ergonomie d'usage immédiat** |

---

## 5. Bilan Factuel des Contrôles & Limites Techniques

### A. Éléments Confirmés et Vérifiés dans le Code Réel
1. **Validation & Saisie Sécurisée** :
   - Support complet de la virgule et du point décimal (`c.replace(',','.')`).
   - Tolérance aux séparateurs de milliers (espaces standards, insécables `\u00A0`, fines `\u202F`).
   - Préservation stricte de la saisie utilisateur brute en cas d'erreur de frappe (pas d'écrasement silencieux).
   - Marquage `aria-invalid="true"` sur les champs invalides et message d'erreur d'assistance explicite.
   - Suspension immédiate des calculs tant qu'une erreur de saisie subsiste (`last = null`, résultats mis à '—', message d'alerte bloquant).
2. **Accessibilité Physique** :
   - Conteneurs `.iwu` et `<input>` stylés à `height: 44px; min-height: 44px;`.
   - Boutons `.btn`, `.chip`, `.tog` avec `min-height: 44px;`.
   - Anneau de focus `:focus-visible` contrasté de 3px.
3. **Multi-Viewports Testés** :
   - `375 px` (Mobile) : Ticket fixe en bas d'écran, tiroir repliable, absence de débordement horizontal.
   - `768 px` (Tablette) : Formulaire aéré en colonnes réactives.
   - `1280 px` (Desktop) : Asymétrie deux colonnes avec Ticket de verdict sticky.

### B. Limites Techniques Réelles Non Résolues
1. **Plafond Numérique Fixe Maintenu** :
   - Le code réel contient : `var CAP = 99999999900; // 999 999 999 € en centimes`.
   - Tout montant supérieur à 999 999 999 € est rejeté (`Montant supérieur au plafond de 999 999 999 €`).
   - Contrairement à l'annonce d'une suppression totale du plafond numérique arbitraire, le plafond de 1 milliard d'euros reste actif dans l'implémentation.
2. **Géométrie SVG & Découplage de la Jauge** :
   - **Spécification initiale / abstraite** : viewBox de 300 px avec centre théorique à 150 px.
   - **Implémentation réelle** : la jauge est générée via `viewBox="0 0 328 100"` (`W = 300`, `pad = 14`, largeur totale $300 + 2 \times 14 = 328\text{ px}$). L'axe centré à $x = 164\text{ px}$ ($328 / 2 = 164$) correspond exactement au **centre géométrique strict** du viewBox réel. Ce n'est donc pas une erreur de calcul.
   - **Découplage vertical partiel** : la ligne d'axe vertical `<line class="gz" x1="164" y1="4" x2="164" y2="90"/>` s'étend de $Y=4$ à $Y=90$. Elle traverse verticalement les zones où sont positionnées les lignes de texte FRNG ($Y=14$) et BFR ($Y=56$). Les barres rectangulaires débutent à $Y=20$ et $Y=62$, mais l'axe vertical traverse les lignes de texte. Même si aucune collision visuelle dégradant la lisibilité n'a été constatée, le découplage géométrique vertical n'est pas absolu.

### C. Statut des Tests Automatisés
Le script de test de laboratoire `marc-v2-prototype.test.ts` présentait **15 échecs et 3 réussis** sur 18 lors de son exécution :
- Les 3 tests réussis concernent les ratios mathématiques de contraste WCAG AA sur les constantes de couleur hexadécimales (test unitaire pur sans DOM).
- Les 15 échecs proviennent :
  1. D'une erreur de chemin `ENOENT` (le fichier réel issu de Claude Free portait le nom `index (1).html` et non `index.html`).
  2. D'une divergence de sélecteurs DOM : le test a été rédigé sur une convention d'identifiants abstraite (`tnBig`, `band`, `rFrng`, `rBfr`, `sc_ca0`, `btnClear`, `gaugeSvg`, `id="CA"`), alors que Claude Free a produit un balisage avec ses propres identifiants (`tnV`, `rV`, `bfrV`, `bjV`, `acV`, `pcV`, `chips`, `clear`, `gT/gD`, `i_ca`).
- **Conclusion** : Le prototype Marc V2 a été vérifié manuellement et structurellement dans un navigateur, mais ne dispose pas d'une suite de tests unitaires automatisés validée au moment de la clôture.

### D. Niveau de Preuve de l'Évaluation Visuelle (35/35)
- Le score de **35 / 35** (7 critères notés 5/5) consigné dans le rapport de la Mission 03 provient de la grille d'auto-évaluation interne (`DESIGN-QUALITY-GATE.md`).
- Il confirme que le prototype franchit largement le seuil d'acceptation ($\ge 28/35$, aucun critère $< 3/5$) en termes d'effort typographique, chromatique et responsive.
- Il s'agit d'une évaluation méthodologique interne, et non d'un audit de conformité certifié par un tiers.

---

## 6. Conclusion

Le prototype Marc V2 valide la faisabilité opérationnelle de la méthode AI CREATOR Studio : un document métier brut peut être converti sans coder en une application web dynamique, esthétique et utilisable sur mobile.

Les limites documentées ci-dessus (plafond de 999 999 999 € et traversée de l'axe vertical de la jauge) constituent des axes d'amélioration identifiés pour les futures itérations pédagogiques, mais n'altèrent en rien la valeur démonstrative du prototype en tant qu'unique preuve de concept permanente du projet.
