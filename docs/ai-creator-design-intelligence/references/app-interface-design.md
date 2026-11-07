# Architecture Visuelle & Stratégie d'État par Famille d'Applications

Une application interactive n'est pas une page d'accueil marketing : l'utilisateur vient y **accomplir un travail précis**. Ce guide adapte la mise en scène visuelle et la gestion de l'état aux 4 grandes familles d'applications créées dans AI CREATOR Studio.

---

## 1. Choisir le Mode de Surface

Avant d'agencer l'écran, identifie le mode dominant du produit :

| Mode de surface | Objectif principal | Où placer l'audace visuelle ? | Où garder de la retenue ? |
| :--- | :--- | :--- | :--- |
| **`Operate`** *(Calculateur, Simulateur, Planificateur)* | Saisir, simuler, arbitrer rapidement sans erreur de lecture. | Dans l'**en-tête éditorial** et surtout dans la **Pièce Maîtresse de Verdict** (ticket de résultat, jauge de synthèse, bandeau d'alerte). | Dans les **champs de saisie et listes de données** : alignements nets, labels explicites, contrastes élevés, zéro distraction. |
| **`Experience`** *(Hub de parcours, Défi interactif, Guide vivant)* | Engager, motiver, matérialiser une progression étape par étape. | Dans la **carte héroïque de statut**, l'anneau ou la barre de progression, les **badges/stickers** d'étapes et les transitions d'état. | Dans la navigation secondaire et les textes de consigne qui doivent rester immédiatement scannables. |
| **`Hybride`** *(Générateur de contenu, Diagnostic expert, Audit)* | Configurer un cas concret puis lire/exploiter un livrable sur mesure. | Dans le **contraste physique entre l'Atelier de Paramétrage** (boutons tactiles, sélecteurs) et la **Feuille de Restitution** (mise en page de document précieux). | Dans la structure du texte généré : hiérarchie typographique irréprochable, copie en 1 clic. |

---

## 2. Décision d'État & Persistance Conditionnelle (*Storage Strategy*)

> [!IMPORTANT]
> **Interdiction du stockage forcé ou dogmatique** :  
> Ne jamais imposer mécaniquement un `localStorage` ou un `StorageAdapter` à toutes les applications. L'architecture de données doit découler rigoureusement de la nature du document et du besoin réel de l'utilisateur.

### Matrice de Décision d'État :
1. **Outil Éphémère / Simulateur Temps Réel (ex. Marc V2)** :
   - **Besoin** : Tester des hypothèses à la volée, comparer des scénarios, sans trace persistante.
   - **Stratégie** : **Mémoire vive volatile pure (`in-memory`)**.
   - **Avantage** : Zéro risque de blocage `localStorage` sous `file://` (mode privé, restrictions iframe), confidentialité financière absolue (rien n'est stocké sur le disque).
   - **Transparence produit** : Mention explicite sous les résultats : *« Données traitées 100 % en mémoire vive : aucune information n'est conservée après fermeture de l'onglet. »*
2. **Plateforme Pédagogique / Checklist de Progression / Défi sur plusieurs jours** :
   - **Besoin** : Reprendre son avancement là où on s'était arrêté.
   - **Stratégie** : **Persistance locale ciblée avec fallback mémoire transparent** (`StorageAdapter`).
   - **Transparence produit** : Expliquer clairement ce qui est sauvegardé (ex. *« Vos cases cochées sont enregistrées localement dans votre navigateur sur cet appareil. »*).
   - **Avertissement de sécurité** : Ne jamais présenter le `localStorage` comme un coffre-fort sécurisé ou un système d'authentification.
3. **Atelier de Rédaction / Générateur Éditorial (ex. Claire)** :
   - **Besoin** : Produire une trame d'entretien ou un document finalisé.
   - **Stratégie** : Mémoire vive + action d'exportation externe (bouton *« Copier dans le presse-papier »* ou téléchargement d'un fichier `.txt` / `.md`).

---

## 3. Les 4 Blueprints d'Interfaces AI CREATOR Studio

### Famille A — Le Calculateur / Simulateur Financier ou Technique (ex. Marc)
- **En-tête de Poste de Pilotage** : Titre éditorial fort, promesse métier, et sélecteurs de scénarios de référence.
- **Disposition asymétrique en 2 zones sur Desktop (`1280 px`, ratio `7:5`)** :
  - *Gauche — L'Atelier de Saisie Structurée* : Champs groupés par logique métier avec numérotation (`01`, `02`), unités explicites, et aide contextuelle.
  - *Droite (Sticky) — Le Ticket de Verdict (*Pièce Maîtresse*)* : Panneau à fond plein engagé (`--bg-spotlight`), indicateur roi en grand corps, bandeau d'état sémantique, bordereau à filets pointillés et jauge comparative SVG inline (FRNG vs BFR).

### Famille B — Le Générateur / Assistant Éditorial Structuré (ex. Claire)
- **L'Atelier de Contexte Tactile** : Cartes de sélection cliquables plutôt que menus déroulants tristes, badges de statut contextuels.
- **La Feuille de Conduite Générée (*Pièce Maîtresse*)** : Traitée comme un véritable document éditorial encadré (fond papier, étapes numérotées, encadré d'avertissements, critères de conformité).
- **Barre d'exploitation** : Copie intégrale ou copie étape par étape en 1 clic avec toast de confirmation.

### Famille C — Le Plateau d'Organisation / Matrice à Cadrans (ex. Sophie)
- **Le Baromètre de Charge en En-Tête (*Pièce Maîtresse*)** : Jauge haute visibilité avec seuil d'alerte critique tiré du document.
- **Le Plateau Tactique à 4 Cadrans (`Q1` à `Q4`)** : Grille `2×2` desktop / accordéons mobiles avec code couleur de bordure, règle d'action explicite et compteurs.

### Famille D — Le Diagnostic / Parcours d'Évaluation par Étapes
- **Barre de progression éditoriale** (`Étape 02 / 05` + jauge de complétion).
- **Cartes de réponse tactiles** (retour visuel franc à la sélection, bordures affirmées).
- **Panneau de synthèse final** : Diagnostic typé, profil et recommandations fidèles au document source.

---

## 4. Degrés d'Autonomie Réseau & Transparence

Une application produite doit déclarer son niveau d'indépendance réseau :
1. **Niveau 1 — 100 % Hors-Ligne & Zéro Build (Standard Recommandé par Défaut)** :
   - Fichier unique `index.html`.
   - Polices système sculptées (zéro requête Google Fonts).
   - SVG vectoriels inline (zéro image externe).
   - Fonctionne parfaitement en mode avion et sous protocole local `file:///`.
2. **Niveau 2 — Hybride avec Dépendance Réseau Déclarée (Optionnel)** :
   - Fichier unique `index.html`.
   - Utilisation optionnelle d'une police Google Fonts pour renforcer le caractère éditorial.
   - **Exigence impérative** : Déclarer explicitement la dépendance dans l'en-tête ou le pied de page, et prévoir une pile de polices système de repli (*fallback*) qui préserve intégralement la hiérarchie visuelle hors-ligne.
