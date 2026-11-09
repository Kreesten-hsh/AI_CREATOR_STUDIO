# Guide d'Installation et d'Utilisation sur Claude.ai Free

Ce document explique comment importer, activer et exploiter le skill **`ai-creator-design-intelligence`** sur un compte **Claude.ai Free** (sans abonnement Pro ni fonctionnalite payante *Projects*).

---

## 1. Caracteristiques Techniques du Package

- **Fichier d'archive a importer** : `AI-CREATOR-DESIGN-INTELLIGENCE.zip` (disponible au telechargement direct dans la plateforme ou dans `docs/ai-creator-design-intelligence/`)
- **Dossier racine unique** : `ai-creator-design-intelligence/`
- **Conformite stricte du frontmatter YAML (`SKILL.md`)** :
  - `name` : `ai-creator-design-intelligence` (30 caracteres, limite maximale Claude.ai : 64)
  - `description` : `Direction artistique, design system et execution HTML/CSS/JS pour transformer un document metier en application web interactive distinctive.` (140 caracteres, limite maximale Claude.ai : 200)
- **Portabilite 100 % Web** : Aucun binaire local, aucun appel Bash/Python externe, aucune variable d'environnement locale.

---

## 2. Procedure d'Installation Pas-a-Pas (Les 7 Gestes Officiels)

1. Ouvrir **Settings > Capabilities**.
2. Activer **Code execution and file creation**.
3. Ouvrir **Customize > Skills**.
4. Cliquer sur le bouton **`+`**.
5. Choisir **`+ Create skill`**.
6. Choisir **`Upload a skill`**.
7. Importer le fichier **`AI-CREATOR-DESIGN-INTELLIGENCE.zip`** et verifier que le Skill est **active**.

---

## 3. Le Parcours Standard en Deux Prompts (Conversation Unique)

Le dispositif standard permet de transformer n'importe quel document en application complete en **deux prompts successifs dans une meme conversation** :

### Premier Prompt : Cadrage Fonctionnel & Direction Artistique (`PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE.md`)

Le Prompt 1 s'execute en deux phases distinctes dans la meme session Claude Free :

#### Phase 1 (Lecon 2 : Cadrage Fonctionnel & Fidelite Source)
1. Ouvrir une nouvelle conversation dans Claude Free.
2. Joindre le document source (PDF, tableur, guide, notes).
3. Coller le contenu de `PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE.md`.
4. Claude analyse le document et propose **3 concepts d'interaction fonctionnels** adaptes au metier.
5. Choisir le concept retenu (ou demander des ajustements).
6. Claude genere les deux premiers livrables : le **Product Blueprint** (logique et formules) et le **Source Fidelity Mapping (SFM)** (matrice d'invariants documentes). Aucun code HTML n'est produit a ce stade.
7. Sauvegarder localement le Blueprint et le SFM sur son ordinateur.

#### Phase 2 (Lecon 3 : Direction Artistique Independante)
8. Dans la meme conversation, annoncer a Claude que le Blueprint et le SFM sont valides pour passer a la direction artistique.
9. Claude engage l'entretien visuel (1 ou 2 questions ciblees).
10. Il propose ensuite **3 directions artistiques contrastees** decoulant du document.
11. Choisir et affiner la direction retenue.
12. Claude formalise le troisieme livrable fondateur : le **Visual Direction Brief (VDB)**.

### Deuxieme Prompt : Generation du Produit HTML (`PROMPT-GENERATION-PRODUIT-HTML.md`)
1. Dans la meme conversation, coller le contenu de `PROMPT-GENERATION-PRODUIT-HTML.md` (Lecon 4).
2. Claude s'appuie sur le document source, les invariants du Blueprint, le SFM et le Visual Direction Brief valide.
3. Il execute son auto-critique et produit le code integral du fichier unique `index.html`.
4. Telecharger ou copier le fichier `index.html` : il s'ouvre immediatement par un simple double-clic dans le navigateur, sans aucun serveur ni outil de compilation.

---

## 4. Controle de Disponibilite du Skill en Conversation

Pour garantir la tracabilite de l'activation du Skill :
- Chaque prompt demande a Claude de debuter sa reponse par :
  `[STATUT SKILL : ACTIF - ai-creator-design-intelligence charge]`
- Si le Skill n'a pas ete detecte, il repondra :
  `[STATUT SKILL : NON DETECTE - Application des regles directrices embarquees]`
  Les prompts maitres contiennent directement les regles directrices de secours afin que la qualite visuelle et technique reste assuree meme en mode degrade.

---

## 5. Bibliotheque des Prompts Maitres

Le dispositif permanent repose sur les deux prompts maitres stockes dans `docs/prompts/` :
- `PROMPT-ENTRETIEN-DIRECTION-ARTISTIQUE.md` : Cadrage fonctionnel, Blueprint, SFM, entretien visuel et Visual Direction Brief.
- `PROMPT-GENERATION-PRODUIT-HTML.md` : Generation complete de l'application monofichier avec auto-critique.
