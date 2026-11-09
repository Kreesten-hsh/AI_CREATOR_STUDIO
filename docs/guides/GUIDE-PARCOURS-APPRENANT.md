# GUIDE D'UTILISATION DU PARCOURS APPRENANT

**Promesse de la méthode** :  
> *« Transforme ton document existant en application interactive à ton image et publie-la en ligne en 3 jours, sans coder. »*

Ce guide explique pas à pas comment utiliser le dispositif AI CREATOR Studio pour convertir n'importe quel document métier (guide, workbook, méthode, tableur financier, checklist, support de formation) en une application web remarquable.

---

## Les 3 Piliers de la Méthode

1. **Aucune compétence en programmation requise** : Tout le code HTML/CSS/JS est généré par l'IA sous forme d'un unique fichier autonome `index.html`.
2. **Direction artistique sur mesure** : Votre produit ne ressemblera pas à un tableau de bord générique d'IA. Il aura une véritable identité visuelle dérivée de votre sujet.
3. **Fidélité absolue à votre contenu** : 100 % de vos formules, étapes, méthodes et avertissements sont scrupuleusement conservés.

---

## Le Parcours en 4 Étapes Pratiques

```mermaid
flowchart LR
    E1["Étape 1 : Préparation<br>• Ton document<br>• Import du Skill"]
    E2["Étape 2 : Entretien DA<br>• Prompt 1<br>• Choix parmi 3 styles<br>• 3 Livrables fondateurs"]
    E3["Étape 3 : Génération HTML<br>• Prompt 2 (même session)<br>• Fichier index.html unique"]
    E4["Étape 4 : Publication & Vente<br>• Double-clic & Netlify<br>• Livraison Chariow"]

    E1 --> E2 --> E3 --> E4
```

---

### Étape 1 : Préparer son document et importer le Skill (10 min)

1. **Préparez votre document source** :
   - Rassemblez votre contenu sous forme de fichier PDF, Word, texte, Markdown ou tableur.
   - Assurez-vous que vos formules, règles métier et étapes clés y figurent clairement.
2. **Importez le Skill dans Claude.ai Free** :
   - Connectez-vous à votre compte gratuit sur [claude.ai](https://claude.ai).
   - Rendez-vous dans **Settings** $\rightarrow$ **Skills** $\rightarrow$ **Upload a skill**.
   - Sélectionnez le fichier `AI-CREATOR-DESIGN-INTELLIGENCE.zip` fourni avec la formation.
   - Vérifiez que le skill apparaît avec le statut **Activé (ON)**.

---

### Étape 2 : L'Entretien de Direction Artistique (Prompt 1) (15-20 min)

1. Ouvrez une **nouvelle conversation** dans Claude.
2. Glissez ou joignez votre document source dans le champ de saisie.
3. Copiez et collez l'intégralité du fichier [`PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE.md`](../prompts/PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE.md).
4. **Le dialogue s'engage** :
   - Claude confirme sa compréhension de votre document sans afficher de code.
   - Il vous pose une ou deux questions ciblées sur l'esprit visuel recherché (personnalité, ambiance, public cible) avec des choix concrets.
   - Répondez simplement en quelques phrases ou choisissez parmi ses suggestions.
5. **Découverte des 3 directions artistiques** :
   - Claude vous soumet 3 concepts visuels réellement différents nés de votre sujet, présentés en **6 points simples et visuels** sans code ni jargon technique.
   - Choisissez votre direction préférée ou demandez des ajustements avec vos propres mots (ex. *« J'aime la piste 1 mais avec des tons plus chauds »*).
6. **Réception des Livrables Fondateurs** :
   Claude valide vos choix et formalise :
   - Le **Product Blueprint** (Mon plan d'application).
   - Le **Source Fidelity Mapping** (Les règles de mon document).
   - Le **Visual Direction Brief** (Ma fiche de style technique complète).
   
> [!NOTE]
> Claude s'arrête ici et **n'émet aucun code HTML à ce stade**. C'est parfaitement normal !

---

### Étape 3 : La Génération de l'Application HTML (Prompt 2) (5 min)

1. **Restez impérativement dans la même conversation Claude** (ne créez pas de nouvelle session afin de conserver la mémoire des décisions).
2. Copiez et collez l'intégralité du fichier [`PROMPT-GENERATION-PRODUIT-HTML.md`](../prompts/PROMPT-GENERATION-PRODUIT-HTML.md).
3. Claude applique scrupuleusement votre brief visuel et vos règles métier.
4. Il effectue son auto-critique et émet le code complet de `<!DOCTYPE html>` à `</html>` dans un fichier nommé exactement `index.html`.

---

### Étape 4 : Tester, Publier et Organiser la Livraison (Jour 3)

1. **Tester immédiatement sur votre ordinateur** :
   - Enregistrez le code dans un dossier local `mon-application/` sous le nom `index.html` (sans extension `.txt`).
   - Faites un simple **double-clic** sur le fichier : il s'ouvre directement dans votre navigateur par défaut sans serveur local (`file:///`).
   - Vérifiez que tous les boutons, calculs et formulaires fonctionnent (notez qu'une connexion Internet reste nécessaire pour charger les polices web externes comme Google Fonts).
2. **Publier gratuitement sur Netlify Drop** :
   - Glissez simplement le dossier `mon-application` contenant votre fichier `index.html` à la racine sur [app.netlify.com/drop](https://app.netlify.com/drop).
   - Personnalisez votre sous-domaine via `Project Overview > Customize > Manage project name and cover image`.
   - Contrôlez la visibilité publique dans `Project configuration > General > Visitor access > Project visibility` en vérifiant la valeur **Public** (certains projets pouvant être privés par défaut selon votre équipe).
   - Le certificat HTTPS est activé automatiquement. Notez que le forfait gratuit utilise un quota mensuel de crédits (les projets peuvent être mis en pause temporairement si le quota est épuisé jusqu'au renouvellement mensuel).
3. **Organiser la livraison commerciale sur Chariow** :
   - Créez un produit téléchargeable de type **Fichiers** sur Chariow avec ses visuels minimaux (carré 600 × 600 px, bannière 702 × 260 px), téléversez votre Guide d'Accueil PDF et cliquez sur **Publier**.
   - Renseignez votre lien public Netlify et vos conseils dans le champ `Instructions après achat` (`Produits > ⋮ > Modifier > Informations`). Vos clients téléchargent leur Guide PDF depuis les fichiers disponibles après l'achat et accèdent au lien sans dépendre d'une redirection automatique.
   - Validez le parcours d'achat avec un code promo de test à 100 % strictement limité (1 utilisation totale, 1 par client, restreint au produit) : testez en navigation privée (commande à 0 € acceptée ou arrêt au panier sans payer votre propre produit si refusée), puis désactivez immédiatement le code.

---

## Foire Aux Questions & Dépannage Rapide

### Que faire si Claude interrompt son code au milieu du fichier ?
Collez simplement la consigne :  
*« Continue exactement là où tu t'es arrêté, sans répéter les lignes précédentes, jusqu'à la fermeture `</html>`. »*

### Mes données financières ou personnelles sont-elles envoyées sur un serveur ?
**Non.** Les applications générées fonctionnent entièrement dans votre navigateur. Aucun compte ni serveur externe n'est requis pour exécuter les calculs.

### Puis-je modifier une couleur ou un texte après la génération ?
Oui ! Il vous suffit de demander à Claude dans la même conversation :  
*« Applique une retouche : remplace le bouton or par un bouton émeraude et renvoie-moi le fichier `index.html` complet. »*
