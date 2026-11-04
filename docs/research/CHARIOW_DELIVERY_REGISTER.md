# Registre de Recherche : Chariow (Produits Fichiers, Tarification et Livraison)

## 1. Sources Officielles Consultées
- **Centre d'aide officiel Chariow (`help.chariow.com/fr`)** :
  - *Créer un produit sur Chariow* (`id: 689b4bd6008872b497196800`)
  - *Créer un produit téléchargeable (Fichier)* (`id: 68af1f08f62cc186f76fa970`)
  - *Configuration et gestion avancée des produits téléchargeables* (`id: 68b18efa57eacfedfebe86d4`)
  - *Modèle de tarification sur Chariow* (`id: 689df05638505caf2e7a826d`)
  - *Bienvenue sur votre Espace Client Chariow* (`id: 69aea75894d0c20f75a0e161`)
  - Spécifications des produits téléchargeables et limites de fichiers.

## 2. Faits Vérifiés

### 2.1 Produits de type « Fichiers » et capacité
- Le type de produit **« Fichiers »** est conçu pour vendre des ressources numériques livrées automatiquement dès la confirmation du paiement.
- Il accepte les archives **`.zip`**, les documents **`.pdf`**, les fichiers audio et autres formats standards.
- Un produit payant peut recevoir **jusqu'à 5 fichiers de 1 Go chacun**.

### 2.2 Parcours de configuration en 6 étapes sur Chariow
1. **Sélection du type de produit** : Menu *Produits* -> *Créer un nouveau produit* -> Carte *Fichiers* -> *Continuer*.
2. **Détails et tarification** : Nom du produit, catégorie (attention : la catégorie choisie à la création est définitive et ne peut plus être modifiée ensuite), modèle de tarification (paiement unique, gratuit ou prix libre), prix et éventuel prix promotionnel.
3. **Description du produit** : Présentation détaillée des bénéfices et du contenu de l'offre.
4. **Personnalisation visuelle** :
   - **Vignette** : image carrée (JPG ou PNG, minimum `600x600 px`).
   - **Bannière** : image rectangulaire (minimum `702x260 px`).
5. **Contenu du produit** : Upload du ou des fichiers livrables (ex. le pack `.zip` du produit interactif et le guide d'accès `.pdf`).
6. **Vérification et publication** : Résumé de l'offre, recommandations et mise en ligne (*Publier*).

### 2.3 Options avancées, Portail Client et Paiements
- **Options avancées (Onglet Informations)** : URL personnalisée du produit, *Instructions après achat* (affichées immédiatement après le paiement), texte du bouton d'achat, protection des fichiers par mot de passe, filigrane sur les documents compatibles, limite d'achat (stock numérique), section FAQ et variantes de prix.
- **Portail client acheteur** : Les clients accèdent à l'ensemble de leurs achats, fichiers téléchargeables, factures et instructions du vendeur sur **`https://app.ateliat.com/`** en se connectant avec l'adresse e-mail utilisée lors de la commande.
- **Moyens de paiement** : Les moyens de paiement proposés au checkout (Mobile Money, cartes bancaires, etc.) dépendent du pays de l'acheteur et des options effectivement disponibles au moment du paiement (`https://chariow.com/coverage`). Le vendeur n'a pas à intégrer lui-même d'API de paiement.
- **Commissions et versements** :
  - Aucun abonnement mensuel fixe.
  - **Plan Starter** : **15 % de commission** sur chaque vente tant que le chiffre d'affaires cumulé est inférieur à 5 000 USD.
  - **Plan Growth** : passage automatique à **10 % de commission** dès que le chiffre d'affaires cumulé dépasse 5 000 USD (et plan Scale sur mesure au-delà de 15 000 USD).
  - **Délais de disponibilité** : les gains sont transférés au **Wallet Axa Zara** dans un délai maximal annoncé de **72 heures** après la vente. Le retrait vers Mobile Money peut ensuite prendre **quelques heures à 72 heures**.

## 3. Règles de Précision Appliquées dans la Leçon 08
1. Ne pas formuler d'affirmation non sourcée publiquement sur les entités internes de traitement de paiement.
2. Ne jamais affirmer que tous les moyens de paiement sont disponibles dans tous les pays : inviter l'apprenant à vérifier le checkout réel et la couverture géographique.
3. Distinguer clairement la sécurité du téléchargement Chariow (qui protège le fichier `.zip` hébergé sur Chariow) et l'URL publique d'un hébergement statique (Netlify) : protéger le `.zip` sur Chariow ne rend jamais privée une URL publique externe.
