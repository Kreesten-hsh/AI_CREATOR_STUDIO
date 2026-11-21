# Architecture Visuelle, Cockpit Mobile & Stratégie d'État par Famille d'Applications

Une application interactive n'est pas une page d'accueil marketing : l'utilisateur vient y **accomplir un travail précis**. Ce guide adapte la mise en scène visuelle, l'architecture mobile (`< 960 px`) et la sauvegarde des données aux grandes familles d'applications créées dans AI CREATOR Studio.

---

## 1. Choisir le Mode de Surface

Avant d'agencer l'écran, identifie le mode dominant du produit :

| Mode de surface | Objectif principal | Où placer l'audace visuelle ? | Où garder de la retenue ? |
| :--- | :--- | :--- | :--- |
| **`Operate`** *(Planificateur SOLDE, Simulateur, Calculateur)* | Saisir, simuler, arbitrer rapidement sans erreur de lecture. | Dans l'**en-tête éditorial** et surtout dans la **Pièce Maîtresse de Verdict** (bilan mensuel, anneau de répartition, score `/100`, bandeau d'alerte). | Dans les **champs de saisie et listes de postes** : alignements nets, labels explicites, contrastes élevés, zéro distraction. |
| **`Experience`** *(Hub de parcours, Défi interactif, Programme coaching)* | Engager, motiver, matérialiser une progression étape par étape. | Dans la **carte héroïque de statut**, l'anneau ou la barre de progression, les **badges** d'étapes et les transitions d'état. | Dans la navigation secondaire et les consignes qui doivent rester immédiatement scannables. |
| **`Hybride`** *(Diagnostic expert, Générateur de plan, Audit)* | Configurer un cas concret puis exploiter un livrable sur mesure. | Dans le **contraste physique entre l'Atelier de Paramétrage** (profils pré-remplis, sélecteurs tactiles) et la **Feuille de Restitution** (document précieux copiable en 1 clic). | Dans la structure du texte ou bilan généré : hiérarchie typographique irréprochable. |

---

## 2. Pattern « Cockpit Dual-Mode Mobile (`< 960 px`) » (Modèle SOLDE)

Sur smartphone (`375 px`), l'erreur la plus fréquente des applications riches (> 5 champs) est de placer tout le formulaire en haut et de reléguer le résultat 1 500 px plus bas.

Pour garantir que le **verdict reste visible au-dessus de la ligne de flottaison dès l'ouverture**, choisis l'une des deux architectures mobiles dans **« Mon plan d'application »** :

1. **Flux linéaire simple (`<= 5` champs courts)** :
   - Saisie compacte et carte de verdict directement empilées dans le flux vertical.
2. **Cockpit Dual-Mode Mobile (`< 960 px`, recommandé pour SOLDE et tout outil > 5 paramètres)** :
   - **Zone 1 — Résumé Héroïque Compact (Hero Summary)** : Affiché tout en haut de l'écran mobile, il présente immédiatement le chiffre/verdict roi (ex. Reste libre mensuel + Score `/100` ou diagnostic global) sans scroller.
   - **Zone 2 — Barre d'Onglets Accessible (`role="tablist"`)** : Permet de basculer d'un pouce entre deux vues focalisées (`Saisie` et `Bilan` / `Résultat`), chacune dotée de boutons `role="tab"` (`min-height: 44px`, `aria-selected`, `aria-controls`) contrôlant deux panneaux `role="tabpanel"`. Sur desktop (`>= 960 px`), les deux panneaux s'affichent côte à côte en grille asymétrique (`minmax(0, 7fr) minmax(340px, 5fr)`).
   - **Zone 3 — Barre Collante Inférieure (Sticky Bottom Dock)** : Fixée en bas sur mobile uniquement (`position: fixed; bottom: calc(12px + env(safe-area-inset-bottom, 0px));`), elle rappelle le verdict en temps réel et propose l'action rapide de bascule (`Voir le bilan` / `Modifier` ou `Copier mon résumé`) avec une cible tactile `>= 44×44 px`. Prévoir un `padding-bottom` suffisant sur le conteneur principal pour ne jamais masquer le dernier élément.

---

## 3. Matrice de Sauvegarde des Données à 3 Modes (*Storage Strategy*)

> [!IMPORTANT]
> **Interdiction du stockage forcé ou dogmatique** :
> L'architecture de données doit découler rigoureusement de la nature du document et du besoin réel de l'utilisateur.

1. **(a) Éphémère / Outil ponctuel** :
   - **Cas d'usage** : Convertisseur express, mini-calculateur ponctuel ou test rapide sans besoin de conserver l'historique.
   - **Stratégie** : **Mémoire vive volatile pure (`in-memory`)** pour les saisies métier (seul le jeton de déverrouillage `<slug_produit>_access` de l'écran `.gate` utilise `localStorage` sous `try/catch`). Aucun bouton d'export/import JSON inutile.
2. **(b) Planificateur / Simulateur sauvegardé (Modèle SOLDE)** :
   - **Cas d'usage** : Planificateur budgétaire mensuel (SOLDE), programme de coaching personnalisé, simulateur stratégique sur lequel l'acheteur revient ajuster ses paramètres.
   - **Stratégie** : **`StorageAdapter`** (`localStorage` avec repli RAM transparent sous `file:///`) **+ boutons « Exporter ma sauvegarde (.json) » et « Importer une sauvegarde (.json) » + bouton « Copier mon résumé »** en 1 clic (`copyReliable()`).
   - **Transparence produit** : Indiquer sobrement que la sauvegarde reste locale au navigateur de cet appareil (jamais de promesse de synchronisation cloud).
3. **(c) Journal / Suivi multi-jours** :
   - **Cas d'usage** : Checklist de progression sur 30 jours, carnet de suivi d'habitudes, journal de coaching ou défi quotidien.
   - **Stratégie** : **`StorageAdapter`** + **Export / Import `.json` obligatoire** (téléchargement horodaté et import `<input type="file" accept=".json">` validé sous `try/catch`) pour permettre à l'acheteur de transférer manuellement son suivi entre ordinateur et smartphone.

---

## 4. Les 4 Blueprints d'Interfaces AI CREATOR Studio

### Famille A — Le Planificateur / Simulateur Stratégique (Modèle SOLDE)
- **En-tête éditorial & Contrôles rapides** : Titre éditorial fort, sélecteur de devise en pilule (`FCFA` | `€ EUR` avec parité exacte `1 € = 655,957 FCFA`), 2–3 **profils pré-remplis en 1 clic**, et bouton `Verrouiller` (`#lockBtn`).
- **Desktop (`>= 960 px`) en duo asymétrique / Mobile (`< 960 px`) en Cockpit Dual-Mode** :
  - *Panneau Saisie* : Revenus, enveloppes ou postes groupés logiquement, curseurs tactiles peints et simulateur **« Et si… » / crash-test**.
  - *Panneau Bilan (*Pièce Maîtresse*)* : Reste libre mensuel, **Donut SVG animé** des 3 enveloppes, **Score de santé `/100`** avec bouton correctif en 1 clic, **projections temporelles** (3 / 6 / 12 mois) et bouton **« Copier mon résumé »**.

### Famille B — Le Générateur / Assistant Éditorial Structuré (Coaching / RH / Conseil)
- **Atelier de Contexte Tactile** : Cartes de sélection cliquables, profils types et badges de statut contextuels.
- **Feuille de Restitution (*Pièce Maîtresse*)** : Traitée comme un véritable document éditorial encadré (étapes numérotées, alertes, critères de conformité).
- **Barre d'exploitation** : Copie intégrale en 1 clic (`copyReliable()`) avec confirmation visuelle.

### Famille C — Le Plateau d'Organisation / Matrice à Cadrans (Productivité / Énergie)
- **Baromètre de Charge en En-Tête (*Pièce Maîtresse*)** : Jauge haute visibilité avec seuil d'alerte critique issu de la source.
- **Plateau Tactique à Cadrans** : Grille `2×2` desktop / onglets ou accordéons mobiles avec code couleur de bordure, règle d'action explicite et compteurs.

### Famille D — Le Diagnostic / Parcours d'Évaluation par Étapes
- **Barre de progression éditoriale** (`Étape 02 / 05` + jauge de complétion).
- **Cartes de réponse tactiles** (`>= 44 px`, retour visuel franc à la sélection).
- **Panneau de synthèse final** : Score global, profil diagnostiqué, plan d'action prioritaire et copie en 1 clic.

---

## 5. Degrés d'Autonomie Réseau & Transparence

Une application produite doit déclarer son niveau d'indépendance réseau :
1. **Niveau 1 — 100 % Hors-Ligne & Zéro Build (Standard Recommandé par Défaut)** :
   - Fichier unique `index.html`, polices système sculptées (zéro requête Google Fonts), SVG vectoriels inline. Fonctionne en mode avion et sous `file:///`.
2. **Niveau 2 — Hybride avec Dépendance Réseau Déclarée (Optionnel)** :
   - Fichier unique `index.html` avec police Google Fonts optionnelle explicitement signalée, toujours accompagnée d'une pile de polices système de repli préservant intégralement la hiérarchie hors-ligne.

---

## 6. Écran de Code d'Accès Acheteur Obligatoire (`.gate` & `ACCESS_CODE`)

Toutes les applications générées dans le cursus AI CREATOR Studio sont des produits réservés aux acheteurs. Elles intègrent systématiquement une barrière d'accès côté client en JavaScript :
1. **Rôle produit** : Offrir une expérience d'accès réservé aux clients qui reçoivent le lien public Netlify et le code d'accès dans leur **Guide d'Accès PDF** et dans les **Instructions après achat Chariow**.
2. **Transparence pédagogique** : Cette barrière côté navigateur est **dissuasive** et ne remplace pas une authentification serveur cryptographique.
3. **Architecture technique** :
   - Script synchrone de pré-rendu dans `<head>` déclarant un identifiant dynamique dérivé du produit : `var ACCESS_CODE = "SOLDE2026", KEY = "solde_access";` (patron général : `KEY = "<slug_produit>_access"`).
   - Validation tolérante aux espaces et à la casse mobile : `val.trim().toUpperCase() === ACCESS_CODE.toUpperCase()`.
   - Superposition `.gate` assortie à la direction artistique (badge *« Accès réservé »*, champ `>= 16px` et `>= 44px`, bouton *« Déverrouiller l'outil »*, erreur accessible `role="alert"`).
   - Bouton discret `Verrouiller` (`#lockBtn`) dans l'en-tête pour tester le verrouillage en 1 clic.
