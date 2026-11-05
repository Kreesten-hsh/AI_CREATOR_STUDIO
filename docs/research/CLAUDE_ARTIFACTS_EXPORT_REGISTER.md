# REGISTRE DE RECHERCHE DOCUMENTAIRE : CLAUDE ARTIFACTS, TEMPLATES ET EXPORTS WEB
## AI CREATOR Studio : Traçabilité Factuelle des Capacités et Mécanismes d'Export

> **Objet** : Traçabilité factuelle et technique des fonctionnalités d'Anthropic Claude (Artifacts, Templates, Code) et de publication web (Netlify Drop).  
> **Protocole associé** : `docs/RESEARCH_DRIVEN_PEDAGOGICAL_PRODUCTION_PROTOCOL.md`.  
> **Principe absolu** : Citer des sources officielles avec URL et date de consultation. Toute affirmation non formellement attestée est étiquetée « [À VÉRIFIER] ».

---

## 1. TABLEAU SYNTHÉTIQUE DES SOURCES ET FAITS CONTRÔLÉS

| # | Sujet | Information vérifiée | Source primaire ou URL exacte | Organisme / Auteur | Date consultation | Version / Plan concerné | Destination dans le cours |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | Claude Artifacts & Templates | Fonctionnement des Artifacts, distinction legacy vs templates récents | `https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them` (redirigé vers `https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them`) | Anthropic Support Center | 2026-11-05 | Tous plans (Free, Pro, Team, Enterprise) | J05 (Créer avec Claude) & Fiche Ressource 4 |
| **02** | Legacy Artifacts | Les artefacts créés avant le 16 septembre 2026 conservent Code, Copier et Télécharger, mais on ne peut plus en créer de nouveaux sous cette forme historique | `https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them` | Anthropic Support Center | 2026-11-05 | Tous plans | J05 & J06 |
| **03** | Templates & Plans | Les templates Docs, Slides et Design sont disponibles sur tous les plans (y compris Free, soumis aux quotas standards). Dashboards (bêta) requiert Pro/Max/Team/Enterprise. Claude Motion (bêta) requiert Team/Enterprise | `https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them` | Anthropic Support Center | 2026-11-05 | Free, Pro, Team, Enterprise | J04 & J05 |
| **04** | Paramètre Capabilities | L'exécution de code cloud et la création de fichiers doivent être activées dans les paramètres (`Settings > Capabilities` : option "Cloud code execution and file creation" ou "Create and edit files") | `https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them` | Anthropic Support Center | 2026-11-05 | Tous plans | Start Here, J05 & Fiche Ressource 7 |
| **05** | MDN Web Storage | Comportement de `localStorage` : lié au tuple origine `(protocole, domaine, port)` en `https://`. Sur `file://`, l'isolation est indéfinie par le standard W3C et varie selon les navigateurs (origine opaque, purge à fermeture d'onglet ou exception `SecurityError`) | `https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage` | Mozilla Developer Network (MDN) | 2026-11-05 | Tous navigateurs modernes | J06 & `docs/PRODUCT_DELIVERY_DECISION.md` |
| **06** | Netlify Drop & Claim | Déploiement statique par glisser-déposer sur `app.netlify.com/drop`. Recommandation stricte de connexion préalable à un compte gratuit pour pérenniser le site. Délais de purge des drops anonymes non réclamés : informellement estimé à 1 heure sans SLA formel | `https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop` | Netlify Documentation | 2026-11-05 | Compte Netlify gratuit | J06 & Fiche Ressource 8 |

---

## 2. INFORMATIONS CONFIRMÉES (FACTUEL)

1. **Artifacts et génération de code** :
   - Claude génère des applications autonomes sous forme de fichiers HTML5/CSS/JavaScript complets exécutables dans un navigateur sans serveur dynamique.
   - Pour un déploiement fiable chez un acheteur final sans abonnement tiers, le code ne doit dépendre d'aucune clé d'API Claude côté client : toute l'intelligence métier (calculs, diagnostics, recommandations) est exécutée par le moteur JavaScript du navigateur.
2. **Templates Claude (version actuelle documentée au 2026-11-05)** :
   - Les artefacts créés avant le 16 septembre 2026 sont classés « legacy artifacts » : ils restent consultables, partageables et conservent leurs commandes historiques (*Code*, *Copier*, *Télécharger*), mais aucun nouvel artefact ne peut être créé sous ce format legacy.
   - Les templates **Design**, **Slides** et **Docs** sont accessibles sur l'ensemble des formules (y compris le plan gratuit, dans la limite des quotas standards de messages de la session).
   - Le template **Dashboards (bêta)** requiert un abonnement payant (Pro, Max, Ultra, Team ou Enterprise).
   - Le template **Claude Motion (bêta)** requiert un abonnement Team ou Enterprise.
3. **Paramétrage des Capacités Claude** :
   - Pour pouvoir générer et prévisualiser du code et des fichiers interactifs, l'élève doit avoir activé l'exécution de code ou la création de fichiers dans `Settings > Capabilities` (*Cloud code execution and file creation*).
4. **Persistance `localStorage`** :
   - Confirmé par le standard W3C et MDN : `localStorage` requiert une origine HTTPS stable pour conserver l'état de l'application entre les visites. Sur une URL locale `file:///`, le comportement varie et peut échouer.

---

## 3. INFORMATIONS À NUANCER ET POINTS « À VÉRIFIER »

1. **Délai exact de purge des sites non réclamés sur Netlify Drop [À VÉRIFIER]** :
   - Un glisser-déposer anonyme sur `app.netlify.com/drop` sans être connecté génère une URL temporaire. L'interface informelle de Netlify suggère une fenêtre d'environ 1 heure pour « réclamer » (*claim*) le site vers un compte.
   - Toutefois, la documentation officielle de Netlify ne spécifie aucun engagement formel de niveau de service (SLA) sur ce délai de suppression ni sur une éventuelle période de grâce après expiration.
   - **Directive pédagogique rigoureuse** : le cours interdit de déployer de manière anonyme. L'élève doit se connecter préalablement à son compte gratuit Netlify avant de glisser-déposer son dossier, garantissant ainsi que le site est immédiatement rattaché et pérenne.
2. **Plafonds de taille des Artifacts Claude** :
   - La taille maximale d'un fichier généré dans un Artifact est contrainte par la fenêtre de contexte de sortie du modèle Claude (typiquement 8 192 tokens pour Claude 3.5 Sonnet).
   - Les applications trop lourdes doivent être découpées ou générées par modules.

---

## 4. DÉCISIONS PÉDAGOGIQUES ET TECHNIQUES

1. **J05 (Créer avec Claude)** :
   - Intégrer un encadré préalable invitant l'élève à vérifier que son option *Capabilities* est active dans les paramètres de son compte Claude.
   - Fournir un Master Prompt XML exigeant explicitement du code HTML5 autonome intégrant CSS (Tailwind CDN ou styles embarqués) et JavaScript vanille sans dépendance complexe externe.
2. **J06 (Tester et publier)** :
   - Expliquer la différence entre tester en local (ouvrir le fichier HTML) et publier sur une origine HTTPS pérenne.
   - Exiger la connexion à un compte Netlify gratuit avant tout glisser-déposer.
   - Consigner l'URL finale dans le champ `publishedUrl` du Dossier de Projet.
