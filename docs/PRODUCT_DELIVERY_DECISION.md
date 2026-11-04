# Décision Technique V2 : Création, Sauvegarde Portable et Distribution du Produit de l'Apprenant

## 1. Problématique et Exigences de Fiabilité

L'apprenant d'AI CREATOR Studio n'est pas un développeur web. Il utilise Claude pour transformer sa matière (expertise, guide PDF, tableur, méthode) en un produit digital interactif qu'il vendra à ses propres clients via Chariow.

Deux écueils techniques doivent être écartés d'emblée :
1. **La limite de `localStorage` sur le protocole `file://`** : Selon la documentation officielle MDN (Web Storage API), le comportement de `localStorage` pour des fichiers HTML ouverts directement depuis le disque dur (`file://`) n'est pas garanti par le standard et varie selon les navigateurs (origines opaques, nettoyage à la fermeture de l'onglet ou levée d'une `SecurityError`). On ne doit jamais promettre une persistance locale automatique fiable sur `file://`.
2. **La confusion entre les différents formats générés par Claude** :
   - **Artifacts classiques** : permettent de visualiser le rendu, d'inspecter le code source, de le copier et de télécharger le fichier brut. Toutefois, le simple téléchargement d'un Artifact ne garantit pas qu'il soit autonome hors ligne.
   - **Artifacts propulsés par Claude (AI-powered Artifacts)** : intègrent des appels à l'API Claude d'Anthropic. Ils imposent que l'utilisateur final possède un compte Claude et ne prennent pas en charge de stockage persistant autonome. **Ils sont proscrits pour un produit commercialisé à des clients finaux sur Chariow.**
   - **Exports HTML autonomes / Designs Claude** : pour obtenir un produit livrable, le prompt fourni à Claude doit explicitement exiger un fichier HTML5/CSS/JS standard dont les interactions (calculs, diagnostics, tris, checklists) fonctionnent localement sans appel serveur obligatoire.

---

## 2. Architecture Cible Retenue

| Fonctionnement | Solution technique retenue et enseignée |
| :--- | :--- |
| **Création** | Claude génère le produit et son code source (HTML5, CSS embarqué et JavaScript standard) selon le blueprint de l'apprenant. |
| **Utilisation en ligne** | Hébergement statique gratuit sur une **origine HTTPS stable** (ex. Netlify Drop, Cloudflare Pages). |
| **Sauvegarde en ligne** | `localStorage` rattaché à cette origine HTTPS stable, systématiquement encapsulé dans un bloc `try / catch` avec indicateur d'état et dégradation gracieuse en cas de blocage. |
| **Utilisation hors ligne** | Export du produit (`.html`) et fonctionnement intégral des interactions (calculs, diagnostics, filtres, générateurs basés sur règles) indépendamment du réseau. |
| **Sauvegarde portable (Obligatoire)** | Fonctions **Exporter mes données (`.json`)** et **Importer mes données (`.json`)** intégrées à l'interface du produit, permettant à l'acheteur de sauvegarder et restaurer ses données même hors ligne, en navigation privée ou en changeant d'appareil. |
| **Livraison commerciale** | Archive **`.zip` livrée automatiquement via Chariow** (contenant le fichier du produit, le guide d'accès avec le lien HTTPS et le mode d'emploi de la sauvegarde `.json`). |
| **Accès mobile** | **URL HTTPS hébergée**, testée sur téléphone (largeur 375px+). |

---

## 3. Spécification du Module de Persistance Hybride (HTTPS + JSON Portable)

Chaque produit généré au Module 02 intègre un patron JavaScript léger répondant à trois règles :
1. **Encapsulation `try / catch` systématique** autour de `window.localStorage.getItem` et `window.localStorage.setItem` afin qu'aucune restriction navigateur ne bloque les interactions de l'outil.
2. **Sérialisation d'état explicite (`getSerializableState()`)** regroupant les saisies de l'utilisateur, ses choix de profil et ses cases cochées dans un objet JSON versionné (`schemaVersion`).
3. **Export / Import `.json` en un clic** :
   - **Export** : génération d'un `Blob` (`application/json`) téléchargé sous la forme `sauvegarde-[nom-produit].json`.
   - **Import** : lecture locale via `FileReader` (`<input type="file" accept=".json">`), validation de la structure et restauration immédiate de l'interface.

---

## 4. Livraison Commerciale via Chariow et Limites de Sécurité

1. **Configuration Chariow (Produit de type « Fichiers »)** :
   - Chariow accepte les archives `.zip` et assure leur livraison automatique dès la confirmation du paiement.
   - Un produit payant sur Chariow peut recevoir **jusqu'à 5 fichiers de 1 Go chacun**.
   - L'acheteur retrouve ses fichiers et instructions après achat sur le portail client `https://app.ateliat.com/`.
2. **Distinction stricte entre la protection du `.zip` Chariow et l'URL publique** :
   - Les options de sécurité de Chariow (protection par mot de passe, filigrane sur les documents compatibles, limites d'achat) protègent le téléchargement depuis Chariow.
   - En revanche, si l'apprenant déploie une version en ligne sur un hébergeur statique gratuit (comme Netlify Drop), **le `.zip` protégé sur Chariow ne rend pas privée l'URL publique Netlify**. Toute personne disposant de l'URL publique peut y accéder. L'apprenant doit en être informé clairement : l'URL HTTPS sert au confort d'utilisation mobile et à la persistance `localStorage`, tandis que le pack `.zip` constitue le livrable autonome propriétaire.

---

## 5. Validation par Prototype Témoin

Cette architecture est implémentée et validée de bout en bout dans le prototype de référence du dépôt :
- Fichier : `public/demos/pdf-to-hub/apres-hub-interactif.html`
- Suite de tests automatisés : `src/test/learnerProductPrototype.test.ts`
