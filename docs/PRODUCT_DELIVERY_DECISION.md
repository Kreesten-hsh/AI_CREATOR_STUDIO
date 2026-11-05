# Décision Technique V2 : Création, Sauvegarde et Livraison du Produit Apprenant

## 1. Contexte et Objectifs de Livraison

Les apprenants d'AI CREATOR Studio créent des produits digitaux destinés à être vendus à des clients finaux via la plateforme Chariow. La grande majorité des acheteurs finaux consultent et consomment leurs achats sur **smartphone**.

La méthode de livraison doit concilier trois impératifs :
1. **Zéro barrière technique pour l'acheteur sur smartphone** : Pas de manipulation d'archive ZIP complexe sur mobile.
2. **Autonomie et absence d'abonnement tiers** : Le créateur ne doit pas avoir à payer d'infrastructure serveur mensuelle ni de base de données.
3. **Simplicité de fabrication avec Claude** : Le code généré tient dans un fichier unique HTML/CSS/JS standard.

---

## 2. Le Parcours de Livraison Officiel V2

Le parcours standard enseigné dans les Leçons 05, 06 et 08 repose sur la chaîne suivante :

```
[Matière du Document]
         │
         ▼
[1. Création avec Claude] ──> Fichier unique index.html (HTML5 + CSS + JS)
         │
         ▼
[2. Publication Statique] ──> Déploiement sur Netlify Drop (URL HTTPS stable et réclamée)
         │
         ▼
[3. Génération du PDF d'accès] ──> Guide d'accès client généré avec Claude (sans Canva)
         │
         ▼
[4. Mise en vente Chariow] ──> Produit de type « Fichiers » distribuant le PDF d'accès
         │
         ▼
[5. Réception par l'acheteur] ──> Téléchargement immédiat du PDF & ouverture en 1 clic sur mobile
```

### Détail des 5 maillons de la chaîne :
1. **Création du code avec Claude** : Claude génère le code source complet de l'application interactive dans un fichier autonome `index.html`. Toute la logique (calculs, formulaires, affichage conditionnel, styles) s'exécute côté navigateur sans dépendance serveur.
2. **Publication en ligne sur Netlify Drop** : L'apprenant dépose son fichier ou dossier sur Netlify Drop en étant connecté à son compte Netlify gratuit. Cela attribue une URL HTTPS stable et permanente à son outil (ex. `https://mon-outil.netlify.app`), sans risque de suppression prématurée.
3. **Génération du PDF d'accès avec Claude** : L'apprenant demande à Claude de rédiger et styliser son guide d'accès client (format A4 épuré), contenant le lien direct vers l'application, un mot d'accueil, les instructions d'usage et le contact d'assistance. Le fichier est exporté en PDF via la fonction standard du navigateur (Imprimer > Enregistrer en PDF), sans recours à Canva ni logiciel graphique payant.
4. **Configuration du produit sur Chariow** : L'apprenant crée un produit de type « Fichiers » sur Chariow, y dépose son document d'accès PDF et renseigne les instructions après achat dans l'onglet *Informations*.
5. **Expérience de l'acheteur final** : Dès la validation du paiement, l'acheteur reçoit son reçu, ses instructions après achat et télécharge immédiatement son PDF d'accès. Il clique sur le lien HTTPS et accède instantanément à l'outil sur son smartphone ou ordinateur.

---

## 3. Limites Techniques et Transparence Déontologique

Conformément à nos règles de rigueur, le cours expose en toute transparence les limites du modèle choisi :

### 3.1 Limite du code d'accès côté navigateur
- Lorsqu'un créateur souhaite réserver son outil à ses clients, Claude peut intégrer un écran de verrouillage demandant un code d'accès.
- **Règle de sécurité** : Ce code d'accès exécuté côté navigateur (en JavaScript client) constitue une **barrière visuelle légère**, et non un système d'authentification cryptographique serveur. Il n'empêche pas un utilisateur avancé d'inspecter le code source ou de partager l'URL directe. Il décourage l'usage non autorisé occasionnel, mais ne doit jamais être présenté comme une sécurité bancaire ou inviolable.

### 3.2 Limite du stockage LocalStorage
- L'application mémorise les données de l'acheteur dans le `localStorage` de son navigateur.
- **Isolement par appareil et par navigateur** : Les données saisies sur Safari Mobile ne sont pas synchronisées avec Chrome sur ordinateur. Si l'utilisateur vide l'historique ou le cache de son navigateur, les données locales sont réinitialisées.
- **Pont de portabilité** : Pour pallier cette limite, chaque outil intègre les boutons **Exporter mes données (`.json`)** et **Importer une sauvegarde (`.json`)**, permettant à l'acheteur de conserver un fichier de sauvegarde sur son appareil et de le transférer entre ses terminaux.

### 3.3 Abandon du ZIP obligatoire
- Dans l'ancienne architecture, la distribution d'une archive `.zip` était imposée. Sur smartphone (iOS et Android), la décompression d'une archive `.zip` représente un point de friction majeur pour les acheteurs non techniques.
- Dans l'architecture V2, **le PDF d'accès direct est le mode de livraison standard**. L'archive `.zip` contenant le code source reste une option facultative pour les créateurs qui souhaitent proposer un accès hors-ligne aux utilisateurs sur ordinateur, mais elle n'est plus obligatoire pour commercialiser l'outil.
