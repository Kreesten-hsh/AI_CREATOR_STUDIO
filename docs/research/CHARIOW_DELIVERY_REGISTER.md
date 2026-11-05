# REGISTRE DE RECHERCHE DOCUMENTAIRE : CHARIOW (LIVRAISON, PRODUITS ET CONFIGURATION)
## AI CREATOR Studio : Traçabilité Factuelle de la Vente et de la Distribution de Produits Numériques

> **Objet** : Traçabilité factuelle et déontologique de la plateforme de commerce numérique Chariow pour le Module 3 (Jour 08).  
> **Protocole associé** : `docs/RESEARCH_DRIVEN_PEDAGOGICAL_PRODUCTION_PROTOCOL.md`.  
> **Principe absolu** : Citer des articles du centre d'aide avec identifiant exact et date de consultation. Zéro invention sur les flux financiers ou techniques.

---

## 1. TABLEAU SYNTHÉTIQUE DES SOURCES ET FAITS CONTRÔLÉS

| # | Sujet | Information vérifiée | Source primaire ou URL exacte | Organisme / Auteur | Date consultation | Version / Plan concerné | Destination dans le cours |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | Produit Fichier | Le type « Fichiers » permet de vendre des ressources numériques téléchargeables après confirmation de paiement. Accepte jusqu'à 5 fichiers de 1 Go chacun (PDF, archives, audio, etc.) | Centre d'aide Chariow, Article `68af1f08f62cc186f76fa970` (*Créer un produit téléchargeable (Fichier)*) | Chariow Support | 2026-11-05 | Tout compte vendeur Chariow | J08 (Vendre sur Chariow) & Fiche Ressource 10 |
| **02** | Configuration avancée | Onglet *Informations* : permet de configurer les *Instructions après achat* (affichées immédiatement après paiement), l'URL personnalisée, la protection par mot de passe et les variantes de prix | Centre d'aide Chariow, Article `68b18efa57eacfedfebe86d4` (*Configuration et gestion avancée des produits téléchargeables*) | Chariow Support | 2026-11-05 | Tout compte vendeur Chariow | J08 & Fiche Ressource 10 |
| **03** | Portail Client acheteur | Les acheteurs finaux accèdent à leurs téléchargements, factures et instructions post-achat sur **`https://app.ateliat.com/`** en se connectant avec l'e-mail utilisé lors de l'achat | Centre d'aide Chariow, Article `69aea75894d0c20f75a0e161` (*Bienvenue sur votre Espace Client Chariow*) | Chariow Support | 2026-11-05 | Espace acheteur | J08 & `docs/PRODUCT_DELIVERY_DECISION.md` |
| **04** | Modèle tarifaire | Aucun abonnement fixe mensuel. Plan Starter : 15 % de commission sur chaque vente tant que le chiffre d'affaires cumulé est inférieur à 5 000 USD. Plan Growth : passage automatique à 10 % au-delà de 5 000 USD | Centre d'aide Chariow, Article `689df05638505caf2e7a826d` (*Modèle de tarification sur Chariow*) | Chariow Support | 2026-11-05 | Plan Starter / Growth | J07 (Pricing) & J08 |
| **05** | Retraits et Wallet | Les fonds sont crédités sur le Wallet Axa Zara dans un délai maximal annoncé de 72 heures après la transaction. Retrait vers Mobile Money en quelques heures à 72 heures | Centre d'aide Chariow, Article `689df05638505caf2e7a826d` | Chariow Support | 2026-11-05 | Wallet Axa Zara | J08 |
| **06** | Couverture géographique | La disponibilité des moyens de paiement (cartes bancaires, Mobile Money Wave/Orange/MTN) dépend du pays de l'acheteur et de la couverture effective consultable sur `https://chariow.com/coverage` | Centre d'aide Chariow & page officielle de couverture | Chariow Documentation | 2026-11-05 | International / Afrique subsaharienne | J08 |

---

## 2. INFORMATIONS CONFIRMÉES (FACTUEL)

1. **Parcours de vente d'un produit interactif sur Chariow** :
   - Le créateur crée un produit de type **Fichiers**.
   - Il renseigne le titre, la description commerciale rédigée au Jour 07 et téléverse la vignette carrée (minimum 600x600 px).
   - Il dépose comme fichier livrable le **PDF d'accès généré par Claude** au Jour 08.
   - Dans l'onglet **Informations**, il renseigne les **Instructions après achat** en y collant le lien public Netlify Drop de son application interactive et les consignes d'utilisation.
2. **Double délivrabilité pour l'acheteur** :
   - L'acheteur voit ses instructions et son lien d'accès s'afficher immédiatement sur l'écran de remerciement post-paiement.
   - Il reçoit en parallèle un e-mail de confirmation lui permettant de se connecter à son Espace Client sur **`https://app.ateliat.com/`** pour retrouver son PDF et ses instructions en permanence.
3. **Absence d'archive ZIP obligatoire** :
   - Contrairement à l'ancienne version du cours qui exigeait un packaging ZIP complexe, l'acheteur n'a pas besoin de décompresser une archive sur son téléphone. Il clique sur le lien HTTPS ou ouvre son PDF d'accès pour lancer l'application en plein écran.

---

## 3. LIMITES DE SÉCURITÉ ET NUANCES ÉPISTÉMIQUES

1. **Limites de la protection côté navigateur** :
   - L'ajout d'un mot de passe ou d'un code d'accès dans l'application HTML cliente constitue une barrière de courtoisie (pour éviter le partage accidentel), mais ne constitue pas une authentification cryptographique côté serveur.
   - Protéger le fichier PDF sur Chariow sécurise le téléchargement du document, mais ne rend pas privée une URL Netlify publique si l'acheteur décide de la transférer à un tiers.
2. **Moyens de paiement variables selon le pays** :
   - Le cours rappelle à l'élève de ne pas présumer que tous les opérateurs de Mobile Money sont disponibles dans tous les pays : il doit vérifier sur `https://chariow.com/coverage`.

---

## 4. DÉCISIONS PÉDAGOGIQUES APPLIQUÉES DANS LE COURS

1. **J08 (Créer la livraison et vendre sur Chariow)** :
   - Guide pas à pas basé sur le type **Fichiers** et le portail `https://app.ateliat.com/`.
   - Utilisation de Claude pour rédiger et mettre en page le PDF d'accès sans recours obligatoire à des logiciels tiers (Canva).
   - Configuration soignée du champ *Instructions après achat* dans l'onglet *Informations*.
