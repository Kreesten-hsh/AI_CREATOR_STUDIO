# Registre de Recherche : Claude Artifacts, Exports HTML et Stockage Navigateur

## 1. Sources Officielles Consultées
- **Anthropic Help Center** : Documentation officielle sur Claude Artifacts (création, prévisualisation, téléchargement de code, publication et Artifacts propulsés par Claude).
- **MDN Web Docs (Mozilla)** : Documentation de référence sur `Window.localStorage` et la spécification Web Storage API concernant les origines `file://`.

## 2. Faits Vérifiés

### 2.1 Distinction entre les formats Claude
1. **Artifacts classiques (Code / HTML / React)** :
   - Permettent d'afficher une prévisualisation interactive dans l'interface Claude, de lire le code source complet, de le copier dans le presse-papiers et de télécharger le fichier brut (`.html`, `.tsx`, `.md`, etc.).
   - Le simple fait de pouvoir télécharger le fichier d'un Artifact ne garantit pas qu'il fonctionnera hors ligne de manière autonome : cela dépend de la façon dont le code a été rédigé (absence d'appels API externes, styles et scripts intégrés dans le fichier).
2. **Artifacts propulsés par Claude (AI-powered Artifacts)** :
   - Utilisent une connexion interne à l'API Claude pour générer du texte à la volée depuis l'Artifact.
   - **Limites bloquantes pour la vente à des tiers** : ils exigent que l'utilisateur final dispose lui-même d'un compte Claude, consomment les quotas d'utilisation Claude de l'utilisateur final et ne prennent pas en charge de stockage persistant autonome hors de l'écosystème Claude.
3. **Exports HTML autonomes / Designs Claude** :
   - Pour distribuer un outil interactif à des clients finaux sur Chariow sans leur imposer de compte Claude ni d'abonnement tiers, le créateur doit demander à Claude un fichier HTML5/CSS/JavaScript standard dont toute la logique métier (calculs, diagnostics, filtres, générateurs basés sur gabarits) s'exécute côté navigateur client.

### 2.2 Comportement de `localStorage` sous `file://` vs `https://`
- **Sur une origine `https://` stable** (ex. hébergement statique Netlify Drop, Cloudflare Pages) : `window.localStorage` est rattaché à l'origine (`protocole + domaine + port`) et conserve les données d'une session à l'autre sur le même navigateur et appareil (sauf navigation privée ou nettoyage manuel du cache).
- **Sur le protocole `file://`** (ouverture directe d'un fichier `.html` décompressé sur l'ordinateur ou le téléphone) : la documentation MDN précise que le comportement de `localStorage` pour les documents chargés via `file://` n'est pas défini par le standard et varie selon les navigateurs (certains isolent chaque chemin de fichier dans une origine opaque temporaire, d'autres effacent les données à la fermeture de l'onglet ou lèvent une exception `SecurityError`).

## 3. Décisions Pédagogiques Appliquées dans le Module 02 (Leçons 04, 05 et 06)
1. **Interdiction de promettre un `localStorage` fiable sur `file://`** : le cours explique clairement cette différence technique avec des mots simples.
2. **Encapsulation `try / catch` obligatoire** : tout appel à `localStorage` généré par Claude est entouré d'un bloc `try / catch` afin que l'outil ne plante jamais, même en navigation privée ou en ouverture locale stricte.
3. **Sauvegarde portable JSON obligatoire** : chaque produit inclut deux boutons (**Exporter mes données `.json`** et **Importer mes données `.json`**) permettant à l'acheteur final de conserver ses données sur son disque ou son téléphone et de les restaurer sur n'importe quel navigateur ou appareil.
4. **Hébergement statique HTTPS gratuit** : la Leçon 06 guide l'apprenant pour héberger gratuitement son fichier sur une origine HTTPS stable afin d'offrir un accès mobile immédiat et une sauvegarde `localStorage` en ligne.
