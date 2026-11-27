# Grille d'Autopsie (Teardown Framework)

Procède dans l'ordre. Chaque couche éclaire la suivante. Saute une section si elle ne s'applique pas (en l'indiquant) plutôt que de broder.

## 1. Autopsie du Hook (`0–3s`)

Capture **verbatim** :
- **Première phrase parlée** (mots exacts).
- **Premier frame (`0:00`)** : ce qui est réellement à l'écran (échelle, cadrage, sujet, décor).
- **Texte à l'écran** : mots exacts, position, style d'entrée.
- **Premier cut** : timestamp exact (`< 1s` = urgence ; `> 3s` = assurance).

Questions diagnostiques :
- Quelle tension est ouverte et à quel timestamp se ferme-t-elle ?
- Démarre-t-il **en pleine action** ou à l'arrêt ?
- L'affirmation est-elle **contestable** (génère des commentaires) ou **promesse de résultat** (génère du watch time) ?
- Est-ce un hook qui récompense l'algorithme (choc visuel vide) ou l'humain (promesse tenue) ?

## 2. Map de Beats Timée

Tableau complet du début à la fin : `Début | Durée | Ce qui se passe (audio) | Ce qui est à l'écran | Rôle structurel (hook, re-hook, preuve, bascule, payoff, CTA, loop)`.

À vérifier sur la map :
- **Re-hooks** : où l'enjeu est relancé (espacement régulier ou non).
- **Position du payoff** : un payoff à 80 % suivi d'une longue traîne fait chuter la rétention.
- **Loop** : la dernière frame renvoie-t-elle à `0:00` ?
- **Courbe de rythme** : quand le rythme change brusquement, cela coïncide-t-il avec le virage du propos ?

## 3. Grammaire Visuelle

Décris le **système**, pas l'esthétique vague :
- Format, ratio et respect des zones libres UI (bas/droite).
- Typographie (poids, taille, le texte répète-t-il la voix ou ajoute-t-il un 2e canal ?).
- Palette et contraste sur téléphone à faible luminosité.
- Style de coupe dominant et **coût minimal de production** (téléphone seul vs motion design Remotion).

## 4. Son

- Audio tendance ou voix originale (si son tendance, fenêtre de fraîcheur déjà passée = conditionnel).
- **Survie en mode muet** : la vidéo reste-t-elle compréhensible sans le son ?
- Traitement voix off (écrite comme un texte lu vs parlée naturellement).
- Sound design (`whoosh`, `pop`, `stamp`, silence avant le payoff).

## 5. Légende & Ingénierie des Commentaires

- **Première ligne de légende** (avant « voir plus ») : répète le hook, l'étend, ajoute le contexte ou pose une question ?
- **Commentaire épinglé** : souvent là où vit le vrai CTA.
- **Section commentaires** : cite 3–5 vrais commentaires verbatim (langage exact de l'audience, questions non répondues, tags d'amis, indices d'attribution).

## 6. Positionnement

*« Une personne qui n'a vu que cette vidéo : que croit-elle maintenant de la marque ? »*
Si la réponse est « rien », c'est de la portée creuse (*hollow reach*).

## 7. Carrousels (`4:5`)

- **Slide 1** = le hook (doit être visiblement incomplète).
- **Slide 2** = le test de rétention (la plus grosse chute est `1 → 2`).
- **Map slide par slide** : chaque slide ouvre-t-elle la suivante ?
- **Métrique reine** : les **enregistrements** (contenu de référence) > likes.

## 8. Analyser un Flop

Mêmes couches, question inversée (*« Où les a-t-on perdus ? »*) : hook trop lent, aucune tension ouverte, illisible sans son, payoff absent, mauvaise audience, ou simple variance statistique (si le post est propre, le dire franchement).
