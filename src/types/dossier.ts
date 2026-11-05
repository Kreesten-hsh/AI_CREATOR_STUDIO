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
  | 'productIdentity'
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
  'productIdentity',
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
  productidentity: 'productIdentity',
  identite_produit: 'productIdentity',
  identite: 'productIdentity',
  nom_produit: 'productIdentity',
  produit_nom: 'productIdentity',
  marque: 'productIdentity',
  nom_marque: 'productIdentity',
  accroche: 'productIdentity',
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
 * Structure de données pour l'identité de marque et de produit.
 */
export interface ProductIdentityData {
  productName: string;
  brandName: string;
  shortHook: string;
}

export function parseProductIdentity(raw: string): ProductIdentityData {
  if (!raw || typeof raw !== 'string') {
    return { productName: '', brandName: '', shortHook: '' };
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return {
        productName: typeof parsed.productName === 'string' ? parsed.productName : '',
        brandName: typeof parsed.brandName === 'string' ? parsed.brandName : '',
        shortHook: typeof parsed.shortHook === 'string' ? parsed.shortHook : '',
      };
    }
  } catch {
    // Si la valeur est en texte brut, la considérer comme le nom de produit
    return { productName: raw.trim(), brandName: '', shortHook: '' };
  }
  return { productName: '', brandName: '', shortHook: '' };
}

export function serializeProductIdentity(data: Partial<ProductIdentityData>): string {
  return JSON.stringify({
    productName: data.productName?.trim() ?? '',
    brandName: data.brandName?.trim() ?? '',
    shortHook: data.shortHook?.trim() ?? '',
  });
}

export function formatProductIdentityForPrompt(dataOrRaw: ProductIdentityData | string): string {
  const data = typeof dataOrRaw === 'string' ? parseProductIdentity(dataOrRaw) : dataOrRaw;
  const parts: string[] = [];
  if (data.productName) parts.push(`Nom du produit : ${data.productName}`);
  if (data.brandName) parts.push(`Marque : ${data.brandName}`);
  if (data.shortHook) parts.push(`Accroche : ${data.shortHook}`);
  return parts.join(' | ');
}

/**
 * Structure de données pour la direction artistique de l'outil de l'apprenant.
 * Le dossier est l'unique source de vérité.
 */
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
  density: string; // e.g. "compact" | "balanced" | "airy"
  styleDescriptor: string;
  confirmed?: boolean;
}

export function parseArtisticDirection(raw: string): ArtisticDirectionData | null {
  if (!raw || typeof raw !== 'string') return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.accentHex && parsed.backgroundHex) {
      return parsed as ArtisticDirectionData;
    }
  } catch {
    // Rétro-compatibilité : chaîne textuelle brute issue de l'ancienne version
  }
  return null;
}

export function serializeArtisticDirection(data: ArtisticDirectionData): string {
  return JSON.stringify(data);
}

/**
 * Convertit la direction artistique structurée en instructions textuelles propres pour les prompts.
 */
export function artisticDirectionToPromptText(rawOrData: string | ArtisticDirectionData): string {
  if (!rawOrData) return '';
  const data = typeof rawOrData === 'string' ? parseArtisticDirection(rawOrData) : rawOrData;
  if (!data) {
    return typeof rawOrData === 'string' ? rawOrData.trim() : '';
  }

  const radiusDesc =
    data.borderRadius === '0px'
      ? 'Angles stricts et vifs (0px)'
      : data.borderRadius === '14px' || data.borderRadius === '16px'
      ? 'Coins modernes et arrondis (14px)'
      : data.borderRadius === '9999px'
      ? 'Formes pilules très arrondies'
      : 'Coins doux et structurés (8px)';

  const densityDesc =
    data.density === 'compact'
      ? 'Densité compacte et condensée'
      : data.density === 'airy'
      ? 'Densité aérée avec larges espacements'
      : 'Densité équilibrée et fluide';

  const parts = [
    `Palette : Fond ${data.backgroundHex}, Surface ${data.surfaceHex}, Accent ${data.accentHex}, Encre ${data.inkHex}${
      data.paletteName ? ` (${data.paletteName})` : ''
    }`,
    `Typographie : Titres en ${data.headingFont}, Corps en ${data.bodyFont}${
      data.monoFont ? `, Chiffres/Code en ${data.monoFont}` : ''
    }`,
    `Style structurel : ${radiusDesc}, ${densityDesc}`,
  ];

  if (data.styleDescriptor && data.styleDescriptor.trim()) {
    parts.push(`Consignes stylistiques : ${data.styleDescriptor.trim()}`);
  }

  return parts.join(' | ');
}

// Alias toPromptText pour la direction artistique
export const toPromptText = artisticDirectionToPromptText;

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
