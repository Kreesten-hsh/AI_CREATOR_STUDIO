# Registre de Recherche : ManyChat & Règles Officielles Meta (Instagram Messaging)

## 1. Sources Officielles Consultées
- **ManyChat Help Center (`help.manychat.com`)** : Documentation officielle sur *Instagram Comment Automation* (Trigger sur commentaires), *Quick Replies vs Buttons* et la gestion de la fenêtre de messagerie Meta de 24 heures.
- **Meta Developers / Instagram Platform Documentation** : Règles relatives à *Private Replies* sur commentaires Instagram et à la fenêtre standard de messagerie de 24 heures.

## 2. Faits Vérifiés

### 2.1 Prérequis de compte
- L'automatisation des messages privés Instagram via ManyChat nécessite obligatoirement un compte **Instagram Professionnel (Creator ou Business)** connecté à une **Page Facebook** sur laquelle l'utilisateur dispose des droits d'administration. Les comptes personnels Instagram ne peuvent pas utiliser l'API de messagerie.

### 2.2 Règle du Déclencheur de Commentaires (Comment Trigger) et Premier DM Privé
- Lorsqu'un utilisateur publie un commentaire contenant le mot-clé configuré sous un Post ou un Reel Instagram :
  - Le déclencheur ne s'active **que pour le premier commentaire** d'un utilisateur sous la publication concernée (les commentaires multiples du même utilisateur sous le même post ne déclenchent pas de nouveaux envois).
  - L'API Meta autorise l'envoi d'**un seul message privé initial (Private Reply)** en réponse à ce commentaire (dans un délai maximal de 7 jours suivant le commentaire).
  - **Point critique** : Ce premier message privé envoyé automatiquement suite à un commentaire **n'ouvre PAS la fenêtre de messagerie de 24 heures**.

### 2.3 Ouverture de la Fenêtre de Messagerie de 24 Heures
- Pour que la fenêtre standard de 24 heures s'ouvre et permette d'envoyer les étapes suivantes du flux (questions de qualification, présentation de l'offre, lien vers la boutique Chariow), **le prospect doit impérativement interagir avec le premier message privé** :
  - Soit en **cliquant sur une Quick Reply** (réponse rapide) ou un **bouton d'action standard** dans le message.
  - Soit en **répondant par un message texte**.
- **Attention au piège du bouton « Open website »** : Un bouton de type lien externe (*Open website*) placé dans le premier DM **ne constitue pas une interaction d'opt-in** pour ManyChat/Meta et **n'ouvre pas la fenêtre de 24 heures**.
- **Cas où le prospect n'interagit pas** : Si le destinataire ne clique pas sur la Quick Reply / le bouton et ne répond pas au premier DM, la fenêtre de 24 heures ne s'ouvre jamais. Aucune relance automatique ne peut ni ne doit lui être envoyée.

## 3. Séquence Opérationnelle Enseignée dans le Bonus ManyChat (`bonus-manychat`)
1. **Étape 1 (Commentaire sous une publication)** : Le prospect commente le mot-clé défini sous le Reel ou le carrousel.
2. **Étape 2 (Premier DM privé)** : Envoi d'un message court et courtois contenant une question fermée et une **Quick Reply** (ou bouton classique d'interaction).
3. **Étape 3 (Interaction du prospect)** : Le prospect clique sur la Quick Reply ou répond au message (si absence d'interaction : arrêt immédiat du flux, zéro relance).
4. **Étape 4 (Fenêtre de 24 heures ouverte)** : Qualification rapide du besoin et présentation ciblée du produit interactif.
5. **Étape 5 (Lien vers Chariow)** : Envoi du lien direct vers la fiche produit Chariow pour finaliser l'achat.
