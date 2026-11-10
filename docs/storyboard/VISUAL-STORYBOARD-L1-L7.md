# STORYBOARD CANONIQUE DES CAPTURES DE RÉFÉRENCE (LOT C)
## Module 01 à Module 03 (Jours 1 à 3) — Parcours AI CREATOR Studio

---

## 1. Principes Directeurs & Règles d'Authenticité

Ce document constitue la référence canonique de traçabilité des 7 captures d'écran authentiques intégrées dans le tronc commun du cours AI CREATOR Studio.

1. **Zéro Synthèse / Zéro Mockup** :
   - 100 % des captures proviennent d'interfaces réelles en fonctionnement (Claude Free/Pro, DevTools / navigateur mobile réel, Netlify Drop, Chariow Vendeur).
   - Aucune image générée par IA, aucun mockup Figma, aucune reconstitution HTML/CSS artificielle.
2. **Distinction Technique Rigoureuse des Résolutions & Audit Dimensionnel L5** :
   - **Viewport CSS (L × H)** : Dimensions logiques CSS de la fenêtre d'affichage (pour desktop, viewports de 1366 × 768 px à 1440 × 900 px CSS).
   - **Résolution Physique PNG** : Dimensions réelles du fichier image enregistré en pixels physiques.
   - **Facteur d'Échelle (DPR)** : `1x`, `2x` (Retina/HiDPI).
   - **Audit Dimensionnel de la Capture L5 (`l5-devtools-mobile-375px.png`)** :
     - *Dimensions physiques réelles du fichier :* **`792 × 1616 px`** (RGBA 8-bit, 646 Ko).
     - *Origine du rendu :* Navigateur mobile réel (iPhone 14 Pro) avec viewport logique de **`393 × 852 px`** CSS sous un ratio DPR effectif d'environ 2x ($396 \times 808$ px utiles pour $792 \times 1616$ px physiques avec barre système).
     - *Analyse de l'écart documentaire :* Le nom de fichier historique mentionne `375px` car il fait référence à la consigne pédagogique de la leçon L5 qui invite l'apprenant à tester le seuil standard de 375 px CSS dans DevTools. La capture a été exécutée sur device physique réel (iPhone 14 Pro, 393 px CSS).
     - *Décision et arbitrage :* Le calculateur est parfaitement fluide et sans débordement horizontal à 393 px comme à 375 px. Le fichier binaire est maintenu sans altération artificielle, et cet écart est documenté en toute transparence technique.
3. **Horodatage Réel Individualisé & Masquage UI (Ergonomie Cognitive)** :
   - Toutes les captures ont été acquises le **10 novembre 2026**.
   - **Traçabilité technique vs Affichage public :** La date réelle (`capturedAt: '10 novembre 2026'`) est impérativement conservée dans les structures de données (`day-0X.ts`), le contrat d'interface `src/types/course.ts` et ce storyboard pour la traçabilité canonique. En revanche, elle est délibérément masquée dans l'interface apprenant (`ScreenshotBlock.tsx`) afin d'alléger la charge cognitive et d'épurer visuellement le parcours.
4. **Arbitrage Éditorial Validé** :
   - La capture initiale L7-Files (téléversement de bannière et logo Chariow) a été écartée pour éviter de surcharger inutilement l'étape de création produit (`lesson-07-step-01`), qui conserve sa structure épurée (1 prose + 1 ressource guide).
   - L'étape de livraison (`lesson-07-step-02`) reçoit la capture authentique du rattachement effectif du Guide PDF dans Chariow.

---

## 2. Matrice Canonique des 7 Captures (Schéma à 13 Colonnes)

| N° | ID Bloc | Étape Pédagogique | Fichier Image | Interface Source Réelle | Action Pédagogique Observée | Viewport CSS (L × H) | Résolution Physique PNG | Facteur DPR | Texte Alternatif (`alt`) | Légende (`caption`) | Date Réelle (`capturedAt`) | Protocole d'Anonymisation |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- | :--- | :---: | :--- |
| **1** | `l1-s2-screen-skill` | `lesson-01-step-02` | `/screenshots/module-01/l1-claude-skill-install.png` | Claude `Paramètres > Skills` | Activation vérifiée de la compétence ai-creator-design-intelligence sous la section Créé par vous | 1364 × 558 px | 1364 × 558 px | 1x | Interface des paramètres de Claude montrant la compétence ai-creator-design-intelligence active sous la section Créé par vous | Activation de la compétence de design dans les paramètres de Claude | 10 novembre 2026 | Aucun identifiant personnel ni e-mail affiché dans le champ de vision |
| **2** | `l2-s1-screen-concepts` | `lesson-02-step-01` | `/screenshots/module-01/l2-claude-three-concepts.png` | Claude conversation réelle au Prompt 1 | Réception des 3 concepts d interaction fonctionnels (Le Carnet de Prix, Le Prix du Marché Inversé, Les Deux Paliers) décrits sans code | 1366 × 598 px | 1366 × 598 px | 1x | Réponse de Claude détaillant trois concepts d interaction concrets rédigés en langage clair sans code informatique | Trois propositions d interactions concrètes obtenues avec le premier message | 10 novembre 2026 | Aucun nom de compte affiché |
| **3** | `l4-s2-screen-download` | `lesson-04-step-02` | `/screenshots/module-02/l4-claude-code-download.png` | Claude Artifact & Code au Prompt 2 | Affichage du code monofichier index.html et prévisualisation directe de l écran de verrouillage acheteur avec mot de passe | 1366 × 584 px | 1366 × 584 px | 1x | Interface de Claude présentant le code HTML autonome généré et la prévisualisation de l écran d accès réservé avec mot de passe | Code autonome généré dans Claude avec prévisualisation de l écran de verrouillage | 10 novembre 2026 | Aucun jeton ou identifiant de session visible |
| **4** | `l5-s1-screen-responsive` | `lesson-05-step-01` | `/screenshots/module-02/l5-devtools-mobile-375px.png` | Navigateur mobile réel (iPhone 14 Pro, consigne L5 à 375 px) | Rendu mobile complet du calculateur déverrouillé avec CREATOR2026, inputs tactiles lisibles, parité FCFA et zéro débordement | 393 × 852 px | 792 × 1616 px | ~2x | Rendu du calculateur de prix sur écran mobile sans débordement horizontal avec formulaire déverrouillé | Contrôle du rendu mobile du calculateur de prix sans débordement horizontal | 10 novembre 2026 | Environnement de démonstration sans données réelles (audit : 792 × 1616 px physiques pour viewport CSS 393 × 852 px) |
| **5** | `l6-s2-screen-netlify-drop` | `lesson-06-step-02` | `/screenshots/module-03/l6-netlify-drop-upload.png` | Interface réelle Netlify Drop (`app.netlify.com/drop`) | Zone de glisser-déposer pour publier immédiatement un dossier ou un fichier HTML sans ligne de commande | 1344 × 628 px | 1344 × 628 px | 1x | Interface d accueil de Netlify Drop invitant à glisser et déposer un dossier ou un fichier HTML pour une publication immédiate | Zone de dépôt Netlify Drop pour publier un dossier sans ligne de commande | 10 novembre 2026 | Seul l avatar anonyme K est présent, aucun nom d équipe privé |
| **6** | `l6-s3-screen-netlify-public` | `lesson-06-step-03` | `/screenshots/module-03/l6-netlify-visibility-subdomain.png` | Notification de statut Netlify en ligne | Confirmation formelle que le projet de production est public avec son adresse démo darling-starlight-232a12.netlify.app | 599 × 226 px | 599 × 226 px | 1x | Notification de Netlify confirmant que le projet déployé est public avec son adresse en ligne attribuée | Confirmation de la visibilité publique et de l adresse en ligne attribuée sur Netlify | 10 novembre 2026 | Sous-domaine démo anonyme sans données personnelles |
| **7** | `l7-s2-screen-chariow-instructions` | `lesson-07-step-02` | `/screenshots/module-03/l7-chariow-post-purchase.png` | Espace Vendeur Chariow (Upload product content) | Téléversement effectif du Guide Acces Client Modele.pdf (114.54 KB) rattaché aux fichiers numériques de l offre | 995 × 592 px | 995 × 592 px | 1x | Section de téléversement du contenu produit dans Chariow avec le guide d accès client au format PDF rattaché | Rattachement du guide d accès client au format PDF dans l espace vendeur Chariow | 10 novembre 2026 | Aucun solde ni coordonnée bancaire visible |

---

## 3. Protocole de Validation Technique

1. **Vérification Binaire des PNG** :
   - 7/7 fichiers PNG présents dans `public/screenshots/`.
   - Magic numbers PNG validés (`89 50 4E 47 0D 0A 1A 0A`).
   - Tailles de fichiers comprises entre 111 Ko et 646 Ko (aucun fichier vide).
2. **Accessibilité WCAG AA & Anti-Slop** :
   - Attribut `alt` non vide, descriptif et sans jargon banni.
   - Attribut `caption` concis sans tiret cadratin (`—`).
3. **Synchronisation Triple** :
   - Storyboard canonique $\rightarrow$ Données `day-0X.ts` $\rightarrow$ Suites de tests d'intégration.
