# Présomptions Anti-Slop & Écriture Produit en Français

Ce guide aide à éliminer les réflexes visuels et rédactionnels par défaut des modèles (« AI slop ») tout en respectant une règle d'or : **la fonction métier prime toujours sur les recettes décoratives**.

---

## 1. Philosophie : Présomptions Réfragables (*Purpose Test*)

Une règle anti-slop n'est pas un interdit dogmatique aveugle qui forcerait à déstructurer une interface au détriment de son ergonomie.
Pour chaque choix visuel, applique le **Test d'Intention Fonctionnelle** :
1. **Est-ce un réflexe par défaut du modèle sans lien avec le sujet ?** $\rightarrow$ Remplace-le par une décision issue de la direction artistique.
2. **Est-ce une nécessité fonctionnelle pour comparer, saisir ou lire efficacement ?** $\rightarrow$ Conserve la structure, mais exécute-la avec une typographie, des surfaces teintées et des bordures de haute tenue.

---

## 2. Matrice Visuelle : Présomption / Pourquoi / Exception Légitime & Solution

| Réflexe générique par défaut (Présomption de Slop) | Pourquoi cela affaiblit souvent l'interface | Exception fonctionnelle légitime & Exécution recommandée |
| :--- | :--- | :--- |
| **Grille uniforme de 3 ou 4 cartes blanches identiques sur fond gris `#F8FAFC`** | Écrase la hiérarchie : l'indicateur vital (ex. Trésorerie Nette) a exactement le même poids visuel qu'un sous-total secondaire. | **Exception** : comparer des éléments strictement homologues (ex. les 4 cadrans Q1–Q4 d'une matrice).<br>**Solution** : différencier chaque cadran par un en-tête/bordure sémantique et isoler le verdict principal dans un **Ticket de Verdict** distinct à fond plein engagé. |
| **Dégradés bleu-violet / cyan-indigo ou halos flous décoratifs** | Signature visuelle immédiate des templates SaaS générés par IA ; n'exprime aucune identité métier réelle. | **Exception** : une barre de jauge thermique progressive (vert $\rightarrow$ ambre $\rightarrow$ rouge) matérialisant un seuil critique.<br>**Solution** : utiliser des aplats francs, des surfaces teintées chaudes ou froides et des bordures nettes. |
| **Glassmorphisme généralisé (`backdrop-filter: blur`) et ombres floues grises (`0 10px 25px rgba(0,0,0,0.05)`)** | Rend l'interface molle et brumeuse, réduit le contraste de lecture et manque de caractère graphique. | **Exception** : modale de confirmation superposée.<br>**Solution** : privilégier l'élévation par contraste de surface (`--bg-elevated`, `--bg-spotlight`), bordures franches (`1.5px`–`2px`) ou ombres décalées nettes (`4px 4px 0px`). |
| **Emojis utilisés comme icônes d'interface structurelles (`💰`, `🚀`, `📊`, `⚠️` seuls)** | Rendu incohérent selon l'OS (Windows, macOS, Android), alignement approximatif et aspect amateur dans un outil professionnel. | **Exception** : lorsque le document source de l'apprenant utilise explicitement un code symbolique que l'utilisateur final souhaite retrouver dans du texte exporté.<br>**Solution** : utiliser des **icônes SVG inline** au trait `2px` (`stroke="currentColor"`) ou des badges numérotés typographiques (`01`, `02`, `ÉTAPE A`). |
| **Pilule décorative (« Eyebrow pill ») au-dessus de chaque titre de section** | Répétition mécanique qui crée du bruit visuel lorsque chaque bloc commence par un badge arrondi inutile. | **Exception** : un badge de statut dynamique réel (*« SOLVABLE »*, *« SURCHARGE > 6H »*, *« SCÉNARIO NOMINAL »*).<br>**Solution** : réserver les badges aux véritables indicateurs d'état ou de catégorie métier. |
| **Fonds gris neutres non teintés (`#F5F5F5`, `#E5E7EB`)** | Donnent une impression de feuille de calcul terne et impersonnelle. | **Exception** : interface d'audit exigeant une neutralité lumineuse élevée pour une lecture prolongée.<br>**Solution** : même dans un registre sobre, teinter subtilement la surface (pierre chaude `#FAF6F0` / `#F2ECE1` ou ardoise claire `#F1F5F9`). |

---

## 3. Règles d'Écriture Produit & Copywriting en Français

Le texte affiché dans l'interface fait partie intégrante du design :

1. **Zéro invention de faits, de chiffres ou de témoignages (`REQ-PED-02`)** :
   N'ajoute jamais de fausses statistiques (*« Utilisé par 10 000 PME »*, *« +42 % de productivité »*), de faux avis clients ou de règles métier absentes du document source.
2. **Bannir le vocabulaire promotionnel creux d'IA** :
   Proscrire dans les titres, sous-titres et consignes les formules : *« Plongez dans »*, *« Libérez le plein potentiel de »*, *« Révolutionnez votre gestion »*, *« Une approche holistique et transparente »*, *« Solution tout-en-un »*.
   - *Mauvais* : « Optimisez la synergie de vos flux financiers grâce à notre simulateur intelligent. »
   - *Bon* : « Vérifiez en direct si votre Fonds de Roulement couvre votre Besoin en Fonds de Roulement. »
3. **Libellés de boutons précis et orientés action** :
   - Préférer *« Charger le cas de référence »* à *« Exemple »*.
   - Préférer *« Copier la trame d'entretien »* à *« Copier »*.
   - Préférer *« Effacer mes tâches enregistrées »* à *« Reset »*.
4. **Messages de cas limites explicites et fidèles à la source** :
   Lorsqu'un calcul est mathématiquement impossible ou hors seuil (ex. `CA = 0` ou `Dettes CT = 0`), affiche la formulation métier exacte prévue par le document source plutôt qu'un message générique `Erreur` ou un tiret `-` ambigu.
