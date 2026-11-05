/**
 * Types et constantes canoniques pour le Dossier de Projet de l'apprenant.
 * Schéma versionné (v1), structuré, sécurisé et soumis à des limites de taille strictes.
 */

export type DossierFieldStatus = 'empty' | 'draft' | 'valid';

export interface DossierFieldValue {
  value: string;
  status: DossierFieldStatus;
  updatedAt: string; // ISO 8601
}

export type ProjectDossierFieldKey =
  | 'documentAnalysis'
  | 'essentialContents'
  | 'interactivePotential'
  | 'buyerProfile'
  | 'priorityProblem'
  | 'solutionPromise'
  | 'chosenProductModel'
  | 'functionalBrief'
  | 'artisticDirection'
  | 'creationPrompt'
  | 'applicationState'
  | 'publishedUrl'
  | 'commercialOffer'
  | 'pricingConditions'
  | 'accessPdf'
  | 'chariowSheet'
  | 'promotionalContent';

export const ALL_DOSSIER_FIELD_KEYS: readonly ProjectDossierFieldKey[] = [
  'documentAnalysis',
  'essentialContents',
  'interactivePotential',
  'buyerProfile',
  'priorityProblem',
  'solutionPromise',
  'chosenProductModel',
  'functionalBrief',
  'artisticDirection',
  'creationPrompt',
  'applicationState',
  'publishedUrl',
  'commercialOffer',
  'pricingConditions',
  'accessPdf',
  'chariowSheet',
  'promotionalContent',
] as const;

/**
 * Limites strictes de taille par champ (en caractères).
 * 40 000 caractères pour documentAnalysis, essentialContents et creationPrompt.
 * 10 000 pour tous les autres champs.
 */
export const MAX_FIELD_LENGTH_LARGE = 40_000;
export const MAX_FIELD_LENGTH_STANDARD = 10_000;

/** Plafond global cumulé du dossier de projet (en caractères). */
export const MAX_DOSSIER_TOTAL_LENGTH = 200_000;

export function getFieldMaxLength(key: ProjectDossierFieldKey): number {
  if (
    key === 'documentAnalysis' ||
    key === 'essentialContents' ||
    key === 'creationPrompt'
  ) {
    return MAX_FIELD_LENGTH_LARGE;
  }
  return MAX_FIELD_LENGTH_STANDARD;
}

export interface ProjectDossier {
  version: 1;
  updatedAt: string;
  fields: Record<ProjectDossierFieldKey, DossierFieldValue>;
}

/**
 * Table d'alias français vers la clé canonique de ProjectDossier.
 * Permet l'usage convivial dans les prompts (ex: {{dossier.acheteur}} -> buyerProfile).
 */
export const DOSSIER_FIELD_ALIASES: Readonly<Record<string, ProjectDossierFieldKey>> = {
  acheteur: 'buyerProfile',
  profil_acheteur: 'buyerProfile',
  analyse: 'documentAnalysis',
  analyse_document: 'documentAnalysis',
  contenus: 'essentialContents',
  contenus_essentiels: 'essentialContents',
  potentiel: 'interactivePotential',
  potentiel_interactif: 'interactivePotential',
  probleme: 'priorityProblem',
  probleme_prioritaire: 'priorityProblem',
  solution: 'solutionPromise',
  promesse: 'solutionPromise',
  solution_promesse: 'solutionPromise',
  modele: 'chosenProductModel',
  modele_produit: 'chosenProductModel',
  brief: 'functionalBrief',
  brief_fonctionnel: 'functionalBrief',
  direction_artistique: 'artisticDirection',
  style: 'artisticDirection',
  vibe: 'artisticDirection',
  prompt: 'creationPrompt',
  prompt_creation: 'creationPrompt',
  etat: 'applicationState',
  etat_application: 'applicationState',
  url: 'publishedUrl',
  url_publiee: 'publishedUrl',
  offre: 'commercialOffer',
  offre_commerciale: 'commercialOffer',
  prix: 'pricingConditions',
  conditions: 'pricingConditions',
  prix_conditions: 'pricingConditions',
  pdf: 'accessPdf',
  pdf_acces: 'accessPdf',
  chariow: 'chariowSheet',
  fiche_chariow: 'chariowSheet',
  promo: 'promotionalContent',
  contenus_promotionnels: 'promotionalContent',
};

/**
 * Résout une clé canonique à partir d'un nom de champ ou d'un alias.
 */
export function resolveDossierFieldKey(nameOrAlias: string): ProjectDossierFieldKey | undefined {
  if (ALL_DOSSIER_FIELD_KEYS.includes(nameOrAlias as ProjectDossierFieldKey)) {
    return nameOrAlias as ProjectDossierFieldKey;
  }
  const cleanName = nameOrAlias.trim().toLowerCase();
  return DOSSIER_FIELD_ALIASES[cleanName];
}
