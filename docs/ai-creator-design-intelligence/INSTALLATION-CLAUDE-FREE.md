# Guide d'Installation et d'Utilisation sur Claude.ai Free

Ce document explique comment importer, activer et exploiter le skill **`ai-creator-design-intelligence`** sur un compte **Claude.ai Free** (sans abonnement Pro ni fonctionnalité payante *Projects*).

---

## 1. Caractéristiques Techniques du Package

- **Fichier d'archive à importer** : `docs/ai-creator-design-intelligence/AI-CREATOR-DESIGN-INTELLIGENCE.zip`
- **Dossier racine unique** : `ai-creator-design-intelligence/`
- **Conformité stricte du frontmatter YAML (`SKILL.md`)** :
  - `name` : `ai-creator-design-intelligence` (**30 caractères** — limite maximale Claude.ai : `64`)
  - `description` : `Direction artistique, design system et exécution HTML/CSS/JS pour transformer un document métier en application web interactive distinctive.` (**140 caractères** — limite maximale Claude.ai : `200`)
- **Portabilité 100 % Web** : Aucun binaire local, aucun appel Bash/Python externe, aucune variable d'environnement locale.

---

## 2. Procédure d'Installation Pas-à-Pas (7 Étapes)

1. Connecte-toi à ton compte sur **[claude.ai](https://claude.ai)**.
2. Clique sur ton profil (en bas à gauche) puis ouvre **Settings** (*Paramètres*) $\rightarrow$ **Capabilities** (*Capacités* / *Fonctionnalités*).
3. Vérifie que les options **Artifacts** et **Code execution and file creation** (si proposée sur ton interface) sont **activées (ON)**.
4. Dans le menu latéral ou sous **Customize** / **Settings $\rightarrow$ Skills**, repère la section **Skills**.
5. Clique sur le bouton **`+ Create skill`** (ou **`Add skill`**), puis choisis **`Upload a skill`**.
6. Sélectionne le fichier **`AI-CREATOR-DESIGN-INTELLIGENCE.zip`** situé dans `docs/ai-creator-design-intelligence/`.
7. Une fois l'import terminé, vérifie que **`ai-creator-design-intelligence`** apparaît dans ta liste de Skills avec son interrupteur **Activé (ON)**.

---

## 3. Le Parcours Standard en Deux Prompts (Recommandé)

Le dispositif standard permet de transformer n'importe quel document en application complète en **deux prompts successifs dans une même conversation** :

### Étape 1 : Le Premier Prompt — Entretien de Direction Artistique (`PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE.md`)
1. Ouvre une nouvelle conversation dans Claude Free.
2. Glisse ou joins ton document source (PDF, tableur, guide, notes).
3. Colle le contenu de `PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE.md`.
4. Claude analyse silencieusement ton document puis te pose une ou deux questions simples pour cerner l'esprit visuel recherché.
5. Il te propose ensuite **3 directions artistiques adaptatives et contrastées**, argumentées par rapport à ton sujet.
6. Tu choisis ta direction préférée (ou demandes des ajustements de couleurs/typographies).
7. Claude émet les **3 livrables fondateurs** (*Product Blueprint*, *Source Fidelity Mapping*, *Visual Direction Brief*) et t'invite à lancer le deuxième prompt. **Aucun code HTML n'est produit à cette étape.**

### Étape 2 : Le Deuxième Prompt — Génération du Produit HTML (`PROMPT-GENERATION-PRODUIT-HTML.md`)
1. Dans la même conversation, colle le contenu de `PROMPT-GENERATION-PRODUIT-HTML.md`.
2. Claude s'appuie sur le document source, les invariants du Blueprint, le SFM et le Visual Direction Brief validé.
3. Il exécute son auto-critique en 5 questions et émet le code intégral du fichier unique `index.html`.
4. Tu télécharges ou copies le fichier `index.html` : il s'ouvre immédiatement par un simple double-clic dans ton navigateur, sans aucun serveur ni outil de compilation.

---

## 4. Contrôle de Disponibilité du Skill en Conversation

Pour garantir la traçabilité de l'activation du Skill :
- Chaque prompt demande à Claude de débuter sa réponse par :
  `[STATUT SKILL : ACTIF — ai-creator-design-intelligence chargé]`
- Si le Skill n'a pas été détecté, il répondra :
  `[STATUT SKILL : NON DÉTECTÉ — Application des règles directrices embarquées]`
  Les prompts maîtres contiennent directement les règles directrices de secours afin que la qualité visuelle et technique reste assurée même en mode dégradé.

---

## 5. Bibliothèque des Prompts Maîtres

Le dispositif permanent repose sur les deux prompts maîtres stockés dans `docs/prompts/` :
- `PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE.md` : Entretien visuel, Blueprint, SFM et Visual Direction Brief.
- `PROMPT-GENERATION-PRODUIT-HTML.md` : Génération complète de l'application monofichier avec auto-critique.
