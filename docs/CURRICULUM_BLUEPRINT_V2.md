# Curriculum Blueprint V2 : 3 Modules, 9 Leçons et 2 Bonus

## Vue d'ensemble du Programme

Ce document détaille le plan directeur de la version V2 d'AI CREATOR Studio. Chaque leçon est conçue pour produire un livrable concret avec une charge cognitive maîtrisée (1 explication claire, 1 prompt Claude utilisable, 1 démonstration complète, 1 exercice principal et 1 critère de validation observable).

---

## MODULE 01 (`module-01`) : L'OPPORTUNITÉ & LE POSITIONNEMENT
**Objectif du module** : Identifier un problème concret, comprendre l'acheteur et définir une proposition de valeur crédible.

### Leçon 01 (`day-01`) : De son expertise au problème client
- **Périmètre** :
  - Structurer sa matière de départ (document existant, méthode, pratique professionnelle).
  - Identifier 3 problèmes candidats observables chez l'audience cible.
  - Hiérarchiser selon la fréquence, la pénibilité du contournement actuel et la faisabilité.
  - Formuler une déclaration de niche orientée problème sans affirmer que la demande commerciale est déjà validée et sans dénigrer les supports PDF statiques.
- **Livrable** : Matière de départ structurée, problèmes candidats et niche orientée problème.

### Leçon 02 (`day-02`) : Comprendre son acheteur et ses motivations
- **Périmètre** :
  - Cartographier la situation réelle de l'acheteur final et ses outils actuels.
  - Identifier ses déclencheurs d'achat, ses frustrations concrètes, ses objections et ses critères de décision.
  - Extraire son vocabulaire réel (ou formuler des hypothèses étiquetées accompagnées de questions d'entretiens de type *The Mom Test*).
- **Livrable** : Fiche acheteur : situation, frustrations, déclencheurs, objections, critères de décision et vocabulaire réel.

### Leçon 03 (`day-03`) : Positionnement et promesse de transformation
- **Périmètre** :
  - Analyser les alternatives concurrentes réelles (statu quo, guides statiques, tableurs, cours vidéo).
  - Définir les attributs différenciants de son futur produit et la valeur concrète qu'ils apportent à l'acheteur.
  - Choisir un angle de positionnement provisoire et formuler une promesse de transformation vérifiable (sans garantie financière ni preuve inventée).
- **Livrable** : Alternatives réelles, valeur différenciante, positionnement provisoire et promesse vérifiable.

---

## MODULE 02 (`module-02`) : CONCEVOIR & CRÉER AVEC CLAUDE
**Objectif du module** : Transformer le contenu personnel de l'apprenant en produit digital interactif fonctionnel et personnalisé.

### Leçon 04 (`day-04`) : Choisir le format interactif et concevoir son blueprint
- **Périmètre** :
  - Déterminer les actions concrètes que l'acheteur final doit accomplir.
  - Choisir le format interactif adapté parmi les 7 familles : diagnostic, calculateur, générateur, parcours guidé, checklist dynamique, matrice ou hub de ressources.
  - Définir les données d'entrée (Inputs), les règles de traitement et les résultats obtenus (Outputs).
  - Organiser les sections, le parcours utilisateur, les fonctionnalités indispensables (incluant la sauvegarde portable `.json`) et les éléments hors périmètre (pas de compte utilisateur, pas de backend, pas d'Artifact propulsé par l'API Claude).
  - Poser une première hypothèse tarifaire uniquement à titre de réflexion.
- **Livrable** : Blueprint complet de son propre produit interactif.

### Leçon 05 (`day-05`) : Piloter Claude et construire son produit
- **Périmètre** :
  - Distinguer les Artifacts classiques, les exports HTML et les Artifacts propulsés par Claude (à exclure pour un produit vendu à des tiers).
  - Transmettre sa matière source, son contexte, son audience, sa promesse et le blueprint de la Leçon 04 à Claude.
  - Construire progressivement le produit en HTML/CSS/JS standard autonome.
  - Intégrer la sauvegarde en ligne (`localStorage` protégé par `try / catch`) et la sauvegarde portable obligatoire (**Exporter / Importer en `.json`**).
  - Itérer de manière chirurgicale à partir de résultats observables sans régénérer inutilement tout le projet.
- **Livrable** : Première version fonctionnelle du produit interactif personnel.

### Leçon 06 (`day-06`) : Personnaliser, tester et exporter son produit
- **Périmètre** :
  - Appliquer sa propre identité visuelle (couleurs, typographies, composants et contenus adaptés à son domaine, sans copier la charte d'AI CREATOR Studio).
  - Vérifier le fonctionnement des interactions hors ligne, l'exactitude des calculs et le cycle complet d'export/import `.json`.
  - Déployer sur un hébergement statique à origine HTTPS stable (ex. Netlify Drop) pour activer le `localStorage` en ligne et tester l'affichage mobile et desktop.
  - Assembler l'archive `.zip` destinée à la livraison commerciale.
- **Livrable** : Produit interactif finalisé, personnalisé, testé et exporté.

---

## MODULE 03 (`module-03`) : VENDRE & PROMOUVOIR
**Objectif du module** : Préparer l'offre, la distribution et les premiers contenus de commercialisation.

### Leçon 07 (`day-07`) : Construire son offre et fixer son prix
- **Périmètre** :
  - Définir précisément ce qui est vendu (l'outil interactif, son accès HTTPS mobile, son pack `.zip` et son guide de démarrage) et identifier les bénéfices concrets.
  - Définir les éventuels éléments complémentaires utiles et comparer honnêtement avec les alternatives du marché.
  - Formuler son hypothèse de prix (avec présentation de la structuration par paliers d'accès anticipé et tarif standard de référence, présenté comme projection de planification et jamais comme résultat garanti).
  - Structurer les conditions de vente et de support.
- **Livrable** : Offre commerciale structurée, prix choisi et argumentaire de valeur.

### Leçon 08 (`day-08`) : Publier son produit et configurer sa boutique Chariow
- **Périmètre** :
  - Créer un produit de type **« Fichiers »** dans Chariow (jusqu'à 5 fichiers de 1 Go chacun).
  - Rédiger le titre, la description orientée bénéfices et les instructions après achat.
  - Ajouter les visuels et aperçus, déposer l'archive `.zip` et comprendre la différence entre la protection du fichier téléchargé sur Chariow et une URL publique hébergée.
  - Vérifier les moyens de paiement réellement proposés au checkout selon le pays, le fonctionnement des commissions (15 % Starter, 10 % Growth au-delà de 5 000 USD), le délai de transfert vers le Wallet Axa Zara (jusqu'à 72h) et le portail client `app.ateliat.com`.
- **Livrable** : Fiche Chariow configurée et parcours de livraison testé.

### Leçon 09 (`day-09`) : Créer ses contenus de lancement et de promotion
- **Périmètre** :
  - Comprendre le principe de la démonstration produit en action (montrer la transformation d'une saisie en résultat utile).
  - Construire une accroche pertinente pour son audience.
  - Rédiger un script de Reel ou TikTok, un carrousel pédagogique et une publication commerciale avec appel à l'action clair.
- **Livrable** : Premier kit promotionnel : script vidéo, carrousel et publication commerciale.

---

## BONUS INDÉPENDANTS

### Bonus 01 (`bonus-manychat`) : LE SYSTÈME MANYCHAT AUTOMATISÉ AVEC CLAUDE
- **Objectif** : Concevoir et configurer une automatisation Instagram permettant de transformer des interactions sous les publications en conversations privées orientées vers l'offre Chariow.
- **Parcours exact enseigné** :
  1. Commentaire du prospect sous une publication (activé uniquement au premier commentaire de l'utilisateur sous le post).
  2. Envoi du premier DM privé contenant une question ou un bouton d'interaction (Quick Reply ou bouton classique, jamais un bouton « Open website »).
  3. Interaction explicite du prospect (clic sur Quick Reply/bouton ou réponse texte).
  4. Ouverture de la fenêtre de 24 heures permettant la qualification et la présentation de l'offre.
  5. Envoi du lien vers la fiche produit Chariow (avec arrêt strict sans relance si le prospect n'interagit pas avec le premier DM).
- **Livrable** : Une automatisation DM personnalisée, fonctionnelle et testée.

### Bonus 02 (`bonus-marketing`) : MARKETING LIBRARY
- **Objectif** : Fournir une bibliothèque de modèles personnalisables pour préparer les campagnes de vente sans promesses de viralité ni preuves inventées.
- **Contenu** :
  - 20 structures d'accroches pour Reels et TikTok.
  - 5 structures de carrousels.
  - 3 séquences d'emails de lancement.
  - Templates de messages DM et de réponses aux objections.
  - Scripts de démonstration produit.
- **Livrable** : Une bibliothèque marketing organisée, directement exploitable dans l'application.
