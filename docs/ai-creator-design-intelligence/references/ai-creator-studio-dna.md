# ADN AI CREATOR Studio : Emprunter l'Exigence sans Copier la Charte

La plateforme AI CREATOR Studio possède sa propre direction artistique (**Néo-Brutaliste Éditoriale** : fond crème `#FAF6F0`, bordeaux `#B63131`, bordures `2px solid #171313`, ombres décalées franches `4px 4px 0px #171313`).

Conformément à l'exigence **`REQ-PED-04`**, **l'application d'un apprenant ne doit jamais cloner mécaniquement les couleurs Burgundy/Cream de la plateforme formatrice**, mais elle doit hériter de son **niveau d'exigence graphique et éditorial**.

---

## 1. Ce que l'on Emprunte vs Ce qui Change à Chaque Projet

| Ce que l'on emprunte (Le Savoir-Faire Structurel) | Ce qui change à chaque projet (L'Identité du Produit Apprenant) |
| :--- | :--- |
| • **Franchise des contours** : délimitation nette des zones par des bordures affirmées (`1.5px` ou `2px`) ou des contrastes de surface francs.<br>• **Hiérarchie éditoriale dramatique** : grand titre expressif, numérotation claire (`01`, `02`), contraste fort entre le titre et les étiquettes techniques.<br>• **Tactilité des contrôles** : boutons et cartes qui réagissent physiquement à l'interaction.<br>• **Mise en scène du résultat** : un panneau de verdict traité comme un objet précieux (ticket, certificat, carte héroïque). | • **La palette de couleurs complète** : dérivée uniquement de l'univers métier de l'apprenant (forêt/ivoire, bleu nuit/pierre, prune/sable, ardoise/émeraude, etc.).<br>• **La métaphore visuelle centrale** : adaptée à l'outil (calculateur financier, atelier d'écriture RH, matrice énergétique).<br>• **Le curseur d'intensité brutaliste/éditoriale** : modulé selon la gravité et le public cible du sujet. |

---

## 2. Les 3 Niveaux d'Intensité Structurelle (À choisir en L3)

Pour adapter cette grammaire à tous les métiers sans uniformité, calibre l'interface sur l'un des **3 niveaux d'intensité** suivants :

### Niveau 1 — Intensité Forte (*Néo-Brutaliste Éditorial Affirmé*)
- **Idéal pour** : hubs de défis, outils créatifs, planificateurs d'énergie, calculateurs grand public ou solo-entrepreneurs.
- **Signature visuelle** :
  - Bordures structurelles `2px solid var(--border-strong)` sur les panneaux, cartes et boutons.
  - Ombres décalées dures sans flou : `box-shadow: 4px 4px 0px var(--border-strong)`.
  - Effet d'enfoncement mécanique au survol/clic : `transform: translate(2px, 2px); box-shadow: 2px 2px 0px var(--border-strong);`.
  - Badges et stickers d'état à fort contraste (ex. fond jaune d'or `#FACC15` ou vert lime `#A3E635` avec texte et bordure noirs).

### Niveau 2 — Intensité Moyenne (*Éditorial Structuré & Tactile* — Recommandé par défaut)
- **Idéal pour** : simulateurs financiers PME (Marc), assistants RH et management (Claire), outils de conseil et d'audit.
- **Signature visuelle** :
  - Bordures nettes (`1.5px` ou `2px solid`) sur le **Ticket de Verdict / Pièce Maîtresse** et les contrôles actifs ; bordures plus calmes (`1px solid var(--border-subtle)`) sur les sous-éléments internes.
  - Ombre décalée franche réservée à la **Pièce Maîtresse** et au bouton d'action primaire (`3px 3px 0px` ou `4px 4px 0px`), évitant d'alourdir chaque champ de saisie.
  - Contraste fort entre une surface de travail claire teintée (`--bg-surface`) et un panneau de résultat à fond plein profond (`--bg-spotlight`).
  - Filets horizontaux d'inspiration édition/presse (`border-bottom: 2px solid var(--border-strong)`) pour rythmer les sections.

### Niveau 3 — Intensité Légère (*Précision Helvétique & Institutionnelle*)
- **Idéal pour** : conformité réglementaire, reporting exécutif dense, grilles d'analyse clinique ou juridique.
- **Signature visuelle** :
  - Zéro ombre portée décalée ; toute la hiérarchie repose sur la **grille typographique**, les filets de séparation (`1px` et `2px`), et les aplats de couleur sémantiques.
  - Alignements tabulaires stricts, numérotation de clauses (`§ 01`, `§ 02`), et panneau de synthèse encadré d'un filet double ou d'une bordure supérieure épaisse (`border-top: 4px solid var(--accent-primary)`).
