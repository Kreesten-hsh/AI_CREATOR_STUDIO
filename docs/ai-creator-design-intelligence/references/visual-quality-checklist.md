# Grille d'Auto-Critique Visuelle Pré-Livraison & Revue sur Capture

Ce protocole doit être exécuté systématiquement par Claude **avant d'émettre le code final en L4** et **lors de toute retouche visuelle en L5**.

---

## 1. Les 5 Questions d'Auto-Critique Pré-Livraison (Étape E de L4)

Avant d'écrire la balise `<!DOCTYPE html>`, passe mentalement l'interface conçue au crible de ces 5 questions. Si une réponse est négative, **corrige les 3 éléments les plus génériques avant de livrer le code** :

1. **Test d'Identité Métier (Contre le syndrome du dashboard anonyme)** :
   *Si je masque le titre principal, devine-t-on immédiatement de quel outil métier il s'agit (un bordereau de solvabilité, un carnet d'entretien RH, un plateau de charge énergétique) ?*
   - *Correction immédiate si non* : transformer la zone de résultat en un composant signature nommé et structuré comme un objet réel du métier (ticket, feuille éditoriale, baromètre).
2. **Test de la Pièce Maîtresse (Contre l'aplatissement visuel)** :
   *Le verdict principal (ex. la Trésorerie Nette ou la trame générée) se détache-t-il au premier coup d'œil par sa surface (`--bg-spotlight`), sa bordure et son échelle typographique (`clamp(2rem, 4vw, 3.25rem)`) ?*
   - *Correction immédiate si non* : engager une couleur de fond pleine sur le panneau de verdict et doubler l'écart d'échelle entre le chiffre/résultat roi et les sous-indicateurs.
3. **Test d'Asymétrie et de Rythme (Contre la monotonie des grilles)** :
   *Ai-je empilé 3 ou 4 cartes blanches identiques sans variation de rôle ou d'importance ?*
   - *Correction immédiate si non* : regrouper les indicateurs secondaires dans une table/bordereau structuré à filets et réserver la carte héroïque au seul verdict décisif.
4. **Test de Contraste & Surfaces Teintées (Contre les gris morts et l'illisibilité)** :
   *Toutes mes surfaces secondaires sont-elles teintées dans la température de la palette, et chaque texte respecte-t-il au minimum `4.5:1` sur son fond exact ?*
   - *Correction immédiate si non* : remplacer tout gris neutre générique par une teinte chaude ou ardoise cohérente et foncer les textes/fonds d'accent douteux.
5. **Test d'Équilibre Mobile `375 px` (Contre l'écrasement responsive)** :
   *À `375 px` de large, l'application respire-t-elle sans débordement horizontal, avec des champs `>= 16px`, des cibles `>= 44px` et un accès rapide au résultat ?*
   - *Correction immédiate si non* : passer les grilles multi-colonnes en `1fr` sous `768px`, réduire les paddings externes excessifs (`16px` sur mobile au lieu de `40px`) et rendre les étiquettes concises.

---

## 2. Protocole d'Inspection sur Captures d'Écran (Étape L5)

Lorsque l'apprenant ou le testeur QA fournit une capture d'écran (`375 px`, `768 px` ou `1280 px`) ou décrit un rendu jugé décevant :

1. **Observer avant de toucher au code** :
   - Où le regard se pose-t-il en premier sur la capture ?
   - Y a-t-il une collision de texte, un chiffre tronqué ou un alignement cassé ?
   - Les bordures et contrastes de surface sont-ils suffisamment francs sur un écran réel ?
2. **Formuler 3 corrections visuelles ciblées** :
   Annoncer clairement en 3 puces ce qui va être modifié (ex. *« 1. Passage du panneau de résultat sur fond plein `#0F291E` avec montant en Serif `48px` ; 2. Regroupement des 6 champs en 2 blocs bilanciels numérotés ; 3. Ajout d'une barre visuelle FRNG vs BFR »*).
3. **Préserver 100 % des formules et identifiants logiques** :
   Une retouche visuelle en L5 ne doit jamais altérer une équation mathématique, supprimer un cas limite (`CA = 0`, `Dettes CT = 0`) ni casser le `StorageAdapter`.
