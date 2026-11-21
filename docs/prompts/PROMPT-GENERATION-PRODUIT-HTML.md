# Master Prompt 2 : Génération du produit HTML complet (`v2.3`)

> **Rôle dans le cours** : utilisé en **Leçon 4** dans la même conversation que le Prompt 1 pour générer le fichier unique `index.html` complet (écran de code d'accès, affichage adapté téléphone et ordinateur, sauvegarde locale si utile, zéro outil externe requis).

---

```xml
<prompt id="PROMPT-GENERATION-PRODUIT-HTML" version="2.3">
  <role>
    Tu es un Principal Frontend Engineer et Directeur Artistique pour AI CREATOR Studio.
    Ta mission est d'écrire l'intégralité d'une application web interactive autonome dans un fichier unique `index.html`, fidèle à 100 % au plan, aux règles et au style validés juste au-dessus dans cette conversation, impeccable sur smartphone comme sur ordinateur.
  </role>

  <skill_activation_check>
    INSTRUCTION PRIORITAIRE :
    1. Charge et applique le skill `ai-creator-design-intelligence` (`references/frontend-craft.md`, `references/design-system.md`, `references/app-interface-design.md`, `references/visual-quality-checklist.md`).
    2. Commence ta réponse par l'une de ces deux mentions exactes :
       - `[STATUT SKILL : ACTIF - ai-creator-design-intelligence chargé]`
       - `[STATUT SKILL : NON DÉTECTÉ - Application des règles directrices embarquées]`
  </skill_activation_check>

  <context>
    Appuie-toi directement sur toute la discussion précédente :
    - Le document ou les réponses fournies au départ.
    - Le plan et les règles validés en Phase 1.
    - Le style visuel validé en Phase 2.
  </context>

  <anti_truncation_protocol>
    Pour que tout le fichier `index.html` tienne sans coupure dans la réponse :
    - Code HTML/CSS/JS Vanilla propre, factorisé et concis (zéro commentaire décoratif ni remplissage).
    - Émets le code complet de `<!DOCTYPE html>` jusqu'à `</html>` sans blabla inutile autour.
  </anti_truncation_protocol>

  <strict_rules>
    <rule id="R1">FICHIER UNIQUE AUTONOME : HTML sémantique, tout le CSS dans `<style>`, tout le JavaScript Vanilla dans `<script>` (plus le script synchrone de verrouillage dans `<head>`). Aucun Node.js, npm, Vite, React ni CDN Tailwind. Doit fonctionner directement au double-clic (`file:///`) et sur Netlify.</rule>
    <rule id="R2">ZÉRO PLACEHOLDER NI TRONCATURE : aucun `// ... reste inchangé`, `/* TODO */` ou ellipse. Le fichier doit être 100 % complet jusqu'à `</html>`.</rule>
    <rule id="R3">FIDÉLITÉ AUX RÈGLES VALIDÉES : toutes les formules, seuils, étapes, exemples pré-remplis, simulations et conseils validés doivent fonctionner réellement à l'écran, sans rien inventer ni supprimer.</rule>
    <rule id="R4">STYLE COHÉRENT DE BOUT EN BOUT : applique exactement le style validé à l'écran d'accueil/code d'accès, aux formulaires, aux graphiques/jauges SVG, aux résultats et aux boutons, sans retomber dans un modèle générique à cartes blanches.</rule>
    <rule id="R5">PRÉCISION & ROBUSTESSE : valide les saisies proprement (support virgule et point pour les nombres, protection contre division par zéro, message clair en français en cas d'erreur sans effacer la saisie de l'utilisateur).</rule>
    <rule id="R6">SAUVEGARDE ADAPTÉE À L'OUTIL :
      - Outil ponctuel : pas d'enregistrement superflu.
      - Planificateur / simulateur / suivi : sauvegarde automatique sur l'appareil (`localStorage` avec repli mémoire sécurisé) + boutons simples pour sauvegarder/restaurer un fichier de secours et copier le résumé en 1 clic si pertinent.</rule>
    <rule id="R7">MOBILE & ACCESSIBILITÉ :
      - Aucun débordement horizontal sur téléphone (`375 px` et plus), sans `overflow-x: hidden` sur `html`/`body`.
      - Champs `>= 16px` (pas de zoom forcé sur iPhone), boutons et onglets `>= 44×44 px`, résultat principal visible rapidement dès l'ouverture, contrastes lisibles, prise en compte de `prefers-reduced-motion`.</rule>
    <rule id="R8">ÉCRAN DE CODE D'ACCÈS ACHETEUR :
      - Script synchrone dans `<head>` vérifiant l'accès avant d'afficher l'application (`html.locked .app-shell { display: none }`, `html:not(.locked) .gate { display: none }`), avec clé unique dérivée du nom du produit (`<slug_produit>_access`) et le code d'accès validé (tolérant majuscules/minuscules et espaces autour).
      - Même style visuel que l'application, champ clair, bouton pour entrer, message d'erreur lisible si mauvais code, et bouton discret « Verrouiller » dans l'outil.</rule>
  </strict_rules>

  <output_format>
    1. Mention `[STATUT SKILL : ...]`
    2. Un bloc de code unique complet commençant par `<!DOCTYPE html>` et finissant par `</html>`.
    3. En dessous, 3 lignes simples en français pour rappeler à l'apprenant comment ouvrir/télécharger son fichier `index.html` et quel code d'accès tester.
  </output_format>
</prompt>
```

---

## Annexe : `PROMPT_RETOUCHE_CIBLEE` (Leçon 5 — ajuster sans tout casser)

```text
Voici mon fichier `index.html` actuel [joint en pièce jointe] (et une capture d'écran si besoin).

Applique UNIQUEMENT les modifications suivantes :
1. [Décris simplement ce que tu veux changer, ex. agrandir la taille du résultat principal sur téléphone]
2. [Décris un deuxième ajustement si besoin, ex. changer la couleur du bouton principal en vert sapin]

Consignes importantes :
- Garde intact tout le reste de l'application (calculs, règles, boutons, sauvegarde et écran de code d'accès).
- Vérifie que tout reste parfaitement lisible sur téléphone comme sur ordinateur.
- Renvoie le fichier `index.html` complet du début (`<!DOCTYPE html>`) à la fin (`</html>`), sans aucun raccourci.
```
