# SPÉCIFICATION TECHNIQUE ET CANONIQUE : DOSSIER DE PROJET V2
## AI CREATOR Studio : Architecture, Schémas, Sécurité et Persistance

> **Statut** : Document de référence technique permanent.  
> **Code source associé** : `src/types/dossier.ts`, `src/utils/dossierStorage.ts`, `src/utils/storage.ts`.  
> **Principe fondamental** : Le Dossier de Projet constitue l'unique source de vérité pour le produit digital développé par l'apprenant tout au long des 9 journées.

---

## 1. RÔLE DU DOSSIER DE PROJET

Dans l'approche **Document-First**, l'élève n'effectue pas d'exercices déconnectés. Chaque journée produit une brique concrète enregistrée dans le **Dossier de Projet**.  
Ce dossier :
1. Stocke l'état d'avancement des livrables de l'élève (statuts : `empty`, `draft`, `valid`).
2. Fournit les variables injectées dynamiquement dans les **Master Prompts Claude** (ex. `{{dossier.documentAnalysis}}`, `{{dossier.functionalBrief}}`).
3. Permet l'exportation et la sauvegarde locale en fichier JSON autonome pour ne jamais perdre son travail.
4. Assure la continuité pédagogique entre les 3 modules (Analyse -> Conception -> Vente).

---

## 2. STRUCTURE ET SCHÉMA VERSIONNÉ

### 2.1 Versions de schéma
- **Version du dossier (`dossier.version`)** : `1` (schéma structuré avec champs typés et métadonnées d'horodatage).
- **Version globale du stockage (`schemaVersion`)** : `CURRENT_SCHEMA_VERSION = 3` (dans `ai_creator_studio_progress_v1`).

### 2.2 Interface TypeScript canonique (`src/types/dossier.ts`)

```typescript
export type DossierFieldStatus = 'empty' | 'draft' | 'valid';

export interface DossierFieldValue {
  value: string;
  status: DossierFieldStatus;
  updatedAt: string; // ISO 8601
}

export interface ProjectDossier {
  version: 1;
  updatedAt: string;
  fields: Record<ProjectDossierFieldKey, DossierFieldValue>;
}
```

---

## 3. LES 18 CHAMPS CANONIQUES ET ALIAS FRANÇAIS

Le dossier comporte exactement **18 champs canoniques** (`ProjectDossierFieldKey`) correspondant aux étapes des 9 journées :

| Clé canonique | Jour | Description du livrable | Limite max | Alias français principaux |
| :--- | :--- | :--- | :--- | :--- |
| `documentAnalysis` | J1 | Analyse complète et typologie du document initial | 40 000 car. | `analyse`, `analyse_document` |
| `essentialContents` | J1 | Matière brute, formules, tableaux et règles extraites | 40 000 car. | `contenus`, `contenus_essentiels` |
| `interactivePotential` | J1 | Matrice de transformation et points de friction résolus | 10 000 car. | `potentiel`, `potentiel_interactif` |
| `buyerProfile` | J2 | Fiche synthétique de l'acheteur cible et contexte | 10 000 car. | `acheteur`, `profil_acheteur` |
| `priorityProblem` | J2 | Le problème prioritaire que l'outil résout | 10 000 car. | `probleme`, `probleme_prioritaire` |
| `solutionPromise` | J3 | Promesse de transformation mesurable et positionnement | 10 000 car. | `solution`, `promesse`, `solution_promesse` |
| `productIdentity` | J4 | Identité structurée : nom du produit, marque, accroche | 10 000 car. | `identite`, `nom_produit`, `marque`, `accroche` |
| `chosenProductModel` | J4 | Modèle interactif sélectionné parmi les 4 canoniques | 10 000 car. | `modele`, `modele_produit` |
| `functionalBrief` | J4 | Cahier des charges fonctionnel, écrans et interactions | 10 000 car. | `brief`, `brief_fonctionnel` |
| `artisticDirection` | J4 | Charte visuelle structurée (palette, polices, rayons) | 10 000 car. | `direction_artistique`, `style`, `vibe` |
| `creationPrompt` | J5 | Master Prompt Claude généré pour coder l'application | 40 000 car. | `prompt`, `prompt_creation` |
| `applicationState` | J5 | Historique de versions, état du code et retours de tests | 10 000 car. | `etat`, `etat_application` |
| `publishedUrl` | J6 | URL publique HTTPS hébergée sur Netlify Drop | 10 000 car. | `url`, `url_publiee` |
| `commercialOffer` | J7 | Descriptif complet de l'offre commerciale et bénéfices | 10 000 car. | `offre`, `offre_commerciale` |
| `pricingConditions` | J7 | Prix, modèle de tarification et conditions de vente | 10 000 car. | `prix`, `conditions`, `prix_conditions` |
| `accessPdf` | J8 | Contenu et structure du PDF d'accès généré par Claude | 10 000 car. | `pdf`, `pdf_acces` |
| `chariowSheet` | J8 | Paramétrage Chariow (vignette, instructions post-achat) | 10 000 car. | `chariow`, `fiche_chariow` |
| `promotionalContent` | J9 | Angles marketing, accroches et plan de démonstration | 10 000 car. | `promo`, `contenus_promotionnels` |

---

## 4. DONNÉES STRUCTURÉES EMBARQUÉES

Deux champs du dossier utilisent une sérialisation JSON interne avec des utilitaires de parsing résilients :

### 4.1 Identité de Produit (`productIdentity`)
Structure TypeScript :
```typescript
export interface ProductIdentityData {
  productName: string;
  brandName: string;
  shortHook: string;
}
```
- Fonctions : `parseProductIdentity(raw)`, `serializeProductIdentity(data)`, `formatProductIdentityForPrompt(data)`.
- Si le champ contient du texte brut non-JSON, le parseur l'interprète de manière transparente comme le nom du produit sans lever d'erreur.

### 4.2 Direction Artistique de l'Outil (`artisticDirection`)
Structure TypeScript :
```typescript
export interface ArtisticDirectionData {
  paletteId?: string;
  paletteName?: string;
  backgroundHex: string;
  surfaceHex: string;
  accentHex: string;
  inkHex: string;
  headingFont: string;
  bodyFont: string;
  monoFont?: string;
  borderRadius: string; // e.g. "0px" | "8px" | "14px" | "9999px"
  density: string;      // e.g. "compact" | "balanced" | "airy"
  styleDescriptor: string;
  confirmed?: boolean;
}
```
- Fonctions : `parseArtisticDirection(raw)`, `serializeArtisticDirection(data)`, `artisticDirectionToPromptText(data)`.
- Le dossier de projet est la **seule source de vérité** pour l'apparence du produit de l'apprenant. La charte Néo-Brutaliste de la plateforme AI CREATOR Studio ne lui est jamais imposée.

---

## 5. RÈGLES DE SÉCURITÉ ET FILTRAGE ANTI-SECRETS

Pour éviter que l'apprenant ne colle accidentellement des clés privées, des jetons d'accès ou des fichiers volumineux dans son dossier, la fonction `validateDossierField` applique un contrôle strict basé sur des motifs à forte certitude :

### Motifs strictement rejetés (`HIGH_CERTAINTY_SECRET_PATTERNS`) :
1. Clés API OpenAI / Anthropic : `/\bsk-[a-zA-Z0-9_-]{20,}\b/`
2. Personal Access Tokens GitHub : `/\bghp_[a-zA-Z0-9]{20,}\b/`
3. Clés privées RSA / OpenSSH : `/-----BEGIN\s+[A-Z\s]*PRIVATE\s+KEY-----/`
4. Blobs PDF encodés en base64 : `/data:application\/pdf;base64,[A-Za-z0-9+/=]{100,}/`
5. Blobs binaires volumineux : `/data:[a-zA-Z0-9/+-]+;base64,[A-Za-z0-9+/=]{500,}/`

### Absence de faux positifs :
Les formulations naturelles légitimes contenant les expressions comme « mot de passe », « code d'accès » ou « identifiant » sont expressément **autorisées** et ne déclenchent aucun rejet.

---

## 6. LIMITES DE TAILLE ET PLAFONDS

- **Champs volumineux (40 000 caractères)** : `documentAnalysis`, `essentialContents`, `creationPrompt`.  
  Permet d'accueillir des analyses approfondies de documents denses et des Master Prompts complets sans troncature.
- **Champs standards (10 000 caractères)** : Tous les autres champs.
- **Plafond global cumulé (`MAX_DOSSIER_TOTAL_LENGTH`)** : **200 000 caractères**.  
  Garantit que le stockage LocalStorage reste très en deçà du quota habituel du navigateur (5 Mo).

---

## 7. EXPORT, IMPORT ET RÉSILIENCE

### 7.1 Export JSON structuré (`exportDossierJson`)
- Génère un fichier nommé `dossier-projet-[nom-apprenant]-[AAAA-MM-JJ].json`.
- Enveloppe le dossier dans une structure contenant l'identifiant d'application, la version et l'horodatage d'export.

### 7.2 Import JSON sécurisé (`importDossierJson`)
1. **Protection contre l'injection de prototypes** : rejet systématique de tout payload contenant `__proto__` ou `constructor`.
2. **Liste blanche stricte** : rejet immédiat si le JSON contient une clé inconnue en dehors des 18 champs officiels.
3. **Contrôle de version** : refus si `version !== 1`.
4. **Validation des statuts** : seuls les statuts `'empty'`, `'draft'` et `'valid'` sont acceptés.
5. **Sauvegarde préventive automatique** : avant tout écrasement, le dossier actuel est sauvegardé dans la clé `ai_creator_studio_dossier_pre_import_backup`.
6. **Confirmation explicite** : l'écrasement est refusé si le drapeau `confirmOverwrite` n'est pas fourni à `true`.

### 7.3 Résilience et chaîne de migration
- **Stockage principal** : Clé `ai_creator_studio_progress_v1`.
- **Sauvegardes brutes inviolables** : `ai_creator_studio_raw_backup_v1` et `ai_creator_studio_raw_backup_v2`. Une fois écrites et vérifiées par relecture, elles ne sont plus jamais écrasées, protégeant l'apprenant contre toute corruption ultérieure.
- **Gestion des dépassements de quota (`QuotaExceededError`)** : en cas d'erreur de stockage, l'interface avertit l'apprenant sans crasher et propose l'exportation JSON immédiate pour préserver son travail.
