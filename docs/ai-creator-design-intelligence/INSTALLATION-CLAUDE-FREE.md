# Guide d'Installation et d'Utilisation sur Claude.ai Free

Ce document explique comment importer, activer et exploiter le skill **`ai-creator-design-intelligence`** sur un compte **Claude.ai Free** (sans abonnement Pro ni fonctionnalité payante *Projects*).

---

## 1. Caractéristiques Techniques du Package

- **Fichier d'archive à importer** : `AI-CREATOR-DESIGN-INTELLIGENCE.zip` (disponible au téléchargement direct dans la plateforme ou dans `docs/ai-creator-design-intelligence/`)
- **Dossier racine unique** : `ai-creator-design-intelligence/`
- **Conformité stricte du frontmatter YAML (`SKILL.md`)** :
  - `name` : `ai-creator-design-intelligence` (30 caractères, limite maximale Claude.ai : 64)
  - `description` : `Direction artistique, design system et exécution HTML/CSS/JS pour transformer un document métier en application web interactive distinctive.` (140 caractères, limite maximale Claude.ai : 200)
- **Portabilité 100 % Web** : Aucun binaire local, aucun appel Bash/Python externe, aucune variable d'environnement locale.

> [!WARNING]
> **Alerte importante pour les utilisateurs de Safari sur macOS** :
> Par défaut, Safari décompresse automatiquement les fichiers `.zip` en un dossier simple dans *Téléchargements* (ce qui empêche Claude.ai d'accepter l'import, car Claude attend impérativement un fichier `.zip`).
> **3 solutions rapides** :
> 1. Dans Safari : ouvrir `Safari > Réglages > Général` et décocher **« Ouvrir automatiquement les fichiers "fiables" »**, puis retélécharger l'archive.
> 2. Ou faire un clic droit sur le dossier `ai-creator-design-intelligence` décompressé dans le Finder et cliquer sur **« Compresser "ai-creator-design-intelligence" »** pour recréer un `.zip` valide.
> 3. Ou télécharger `AI-CREATOR-DESIGN-INTELLIGENCE.zip` avec Google Chrome ou Firefox.

---

## 2. Procédure d'Installation Pas-à-Pas (Les 7 Gestes Officiels)

Selon la langue de ton interface Claude.ai (Français / Anglais) :

1. Ouvrir **`Paramètres > Capacités`** (*`Settings > Capabilities`*).
2. Activer **`Exécution de code et création de fichiers`** (*`Code execution and file creation`*).
3. Ouvrir **`Personnalisation > Compétences`** (*`Customize > Skills`*).
4. Cliquer sur le bouton **`+`**.
5. Choisir **`+ Créer une compétence`** (*`+ Create skill`*).
6. Choisir **`Importer une compétence`** (*`Upload a skill`*).
7. Sélectionner le fichier **`AI-CREATOR-DESIGN-INTELLIGENCE.zip`** et vérifier que le Skill est bien **activé**.

---

## 3. Le Parcours Standard en Deux Prompts (Conversation Unique)

Le dispositif standard permet de transformer n'importe quelle matière métier (PDF, ebook, tableur, CSV, notes vocales, messages WhatsApp, export Notion ou idée brute) en application complète en **deux prompts successifs dans une même conversation** :

### Premier Prompt : Cadrage Fonctionnel & Direction Artistique (`PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE.md`)

Le Prompt 1 s'exécute en deux phases distinctes dans la même session Claude Free :

#### Phase 1 (Leçon 2 : Cadrage Fonctionnel, Code d'Accès & Fidélité Source)
1. Ouvrir une nouvelle conversation dans Claude Free.
2. Joindre ton document source (par exemple l'ebook de démonstration `SOLDE-EBOOK-BUDGET-MENSUEL-OBJECTIFS.pdf` ou ton propre contenu).
3. Coller l'intégralité de `PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE.md`.
4. Claude analyse la matière sans afficher de code et propose **3 idées d'applications** adaptées au métier (intégrant, lorsque pertinent, profils pré-remplis, simulateur « Et si… » / crash-test, score actionnable ou résumé copiable).
5. Choisir l'idée retenue et indiquer le **code d'accès choisi pour les acheteurs** (ex. `SOLDE2026` ou `[Ex : MONCODE2026]`).
6. Claude rédige tes deux premiers documents en français clair : **« Mon plan d'application »** (incluant l'architecture mobile et la stratégie de sauvegarde) et **« Les règles de mon document »**. Aucun code HTML n'est produit à ce stade.
7. Sauvegarder localement ces deux documents sur ton ordinateur (ils permettent aussi de reprendre dans une nouvelle conversation avec `PROMPT_REPRISE_SESSION` si le chat sature).

#### Phase 2 (Leçon 3 : Direction Artistique Indépendante)
8. Dans la même conversation, envoyer le signal : `Plan et règles validés, passons au style.`
9. Claude engage l'entretien visuel en 1 ou 2 questions ciblées.
10. Il propose ensuite **3 directions artistiques contrastées** en 6 points simples, sans code ni jargon.
11. Choisir sa piste (ou demander un ajustement avec `PROMPT_AJUSTEMENT_STYLE`).
12. Claude formalise le troisième document fondateur : **« Ma fiche de style »** (incluant la mise en scène du résultat principal et de l'écran de code d'accès).

### Deuxième Prompt : Génération du Produit HTML (`PROMPT-GENERATION-PRODUIT-HTML.md`)
1. Dans la même conversation, coller l'intégralité de `PROMPT-GENERATION-PRODUIT-HTML.md` (Leçon 4).
2. Claude s'appuie sur le document source, « Mon plan d'application », « Les règles de mon document » et « Ma fiche de style ».
3. Il exécute son auto-critique en 5 questions et produit le code intégral du fichier unique `index.html`, doté de l'écran de code d'accès (`.gate`, ex. `SOLDE2026` / `KEY = "solde_access"`) et du bouton `Verrouiller`.
4. Enregistrer le fichier sous le nom `index.html` : il s'ouvre immédiatement par un simple double-clic dans le navigateur (`file:///`), sans aucun serveur ni outil de compilation.

---

## 4. Contrôle de Disponibilité du Skill en Conversation

Pour garantir la traçabilité de l'activation du Skill :
- Chaque prompt demande à Claude de débuter sa réponse par :
  `[STATUT SKILL : ACTIF - ai-creator-design-intelligence chargé]`
- Si le Skill n'a pas été détecté, il répondra :
  `[STATUT SKILL : NON DETECTE - Application des règles directrices embarquées]`
  Les prompts maîtres embarquent directement le mode secours complet (Quadrilatère de dérivation, Phrase conceptuelle et règles de qualité) afin que le résultat reste solide même en mode dégradé.

---

## 5. Bibliothèque des Prompts Maîtres

Le dispositif permanent repose sur les deux prompts maîtres stockés dans `docs/prompts/` :
- `PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE.md` (v2.4) : Cadrage fonctionnel, « Mon plan d'application », « Les règles de mon document », entretien visuel, « Ma fiche de style » et annexes (`PROMPT_CHOIX_IDEE`, `PROMPT_SIGNAL_STYLE`, `PROMPT_AJUSTEMENT_STYLE`, `PROMPT_REPRISE_SESSION`).
- `PROMPT-GENERATION-PRODUIT-HTML.md` (v2.2) : Génération complète de l'application monofichier avec auto-critique, protocole anti-troncature et annexe `PROMPT_RETOUCHE_CIBLEE` v2.
