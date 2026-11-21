# Grille d'Auto-Critique Visuelle Pré-Livraison & Revue sur Capture

Ce protocole doit être exécuté systématiquement par Claude **avant d'émettre le code final en Leçon 4** et **lors de toute retouche visuelle en Leçon 5**.

---

## 1. Les 5 Questions d'Auto-Critique Pré-Livraison (Étape E de Leçon 4)

Avant d'écrire la balise `<!DOCTYPE html>`, passe mentalement l'interface conçue au crible de ces 5 questions. Si une réponse est négative, **corrige les 3 éléments les plus génériques avant de livrer le code** :

1. **Test d'Identité Métier (Contre le syndrome du dashboard anonyme)** :
   *Si je masque le titre principal, devine-t-on immédiatement de quel outil métier il s'agit (un carnet budgétaire SOLDE, un carnet de coaching, un dossier de diagnostic RH) ?*
   - *Correction immédiate si non* : transformer la zone de résultat en un composant signature nommé et structuré comme un objet réel du métier (bilan d'enveloppes, feuille éditoriale, baromètre).
2. **Test de la Pièce Maîtresse (Contre l'aplatissement visuel)** :
   *Le verdict principal (ex. le Reste libre mensuel et le Score budgétaire `/100` dans SOLDE, ou le diagnostic final) se détache-t-il au premier coup d'œil par sa surface (`--bg-spotlight`), sa bordure et son échelle typographique (`clamp(2rem, 4vw, 3.25rem)`) ?*
   - *Correction immédiate si non* : engager une couleur de fond pleine sur le panneau de verdict et doubler l'écart d'échelle entre le chiffre/résultat roi et les sous-indicateurs.
3. **Test d'Asymétrie et de Rythme (Contre la monotonie des grilles)** :
   *Ai-je empilé 3 ou 4 cartes blanches identiques sans variation de rôle ou d'importance ?*
   - *Correction immédiate si non* : regrouper les indicateurs secondaires dans une table/bordereau structuré à filets et réserver la carte héroïque au seul verdict décisif.
4. **Test de Contraste & Surfaces Teintées (Contre les gris morts et l'illisibilité)** :
   *Toutes mes surfaces secondaires sont-elles teintées dans la température de la palette, et chaque texte respecte-t-il au minimum `4.5:1` sur son fond exact ?*
   - *Correction immédiate si non* : remplacer tout gris neutre générique par une teinte chaude ou ardoise cohérente et foncer les textes/fonds d'accent douteux.
5. **Test d'Équilibre Mobile `375 px` & Verdict visible au-dessus de la ligne de flottaison** :
   *À `375 px` de large, le verdict principal est-il visible au-dessus de la ligne de flottaison dès l'ouverture (directement pour un petit outil `<= 5` champs, ou via le Résumé mobile + Onglets `Saisie`/`Bilan` + Barre collante avec `env(safe-area-inset-bottom)` en Cockpit Dual-Mode Mobile), avec zéro scroll horizontal sans `overflow-x: hidden` sur `html`/`body`, champs `>= 16px` et cibles tactiles `>= 44×44 px` ?*
   - *Correction immédiate si non* : activer le résumé mobile en tête d'écran + barre collante d'accès au bilan, passer les grilles multi-colonnes en `minmax(0, 1fr)`, appliquer `min-width: 0` sur les enfants de grille et réduire les marges externes (`16px` sur mobile).

---

## 2. Protocole d'Inspection sur Captures d'Écran (Leçon 5)

Lorsque l'apprenant ou le testeur QA fournit une capture d'écran (`375 px`, `768 px` ou `1280 px`) ou décrit un rendu jugé décevant :

1. **Observer avant de toucher au code** :
   - Où le regard se pose-t-il en premier sur la capture ?
   - Sur mobile `375 px`, le verdict est-il visible au-dessus de la ligne de flottaison sans scroller ?
   - Y a-t-il une collision de texte, un chiffre tronqué, un débordement latéral ou un alignement cassé ?
   - Les bordures et contrastes de surface sont-ils suffisamment francs sur un écran réel ?
2. **Formuler 3 corrections visuelles ciblées** :
   Annoncer clairement en 3 puces ce qui va être modifié (ex. *« 1. Mise en avant du Reste libre et du Score /100 dans un bandeau héroïque visible dès 375 px ; 2. Passage du bilan sur surface engagée vert forêt `#123829` avec donut SVG animé ; 3. Regroupement des enveloppes et du crash-test d'imprévu dans deux blocs distincts »*).
3. **Préserver 100 % des formules et identifiants logiques** :
   Une retouche visuelle en Leçon 5 ne doit jamais altérer une équation mathématique, supprimer un cas limite (`revenu = 0`, imprévu supérieur au reste libre) ni casser le `StorageAdapter`, les boutons Export/Import JSON ou `ACCESS_CODE` / `KEY`.
