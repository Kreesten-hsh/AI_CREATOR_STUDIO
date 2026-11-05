import {
  ALL_DOSSIER_FIELD_KEYS,
  getFieldMaxLength,
  MAX_DOSSIER_TOTAL_LENGTH,
  type DossierFieldStatus,
  type DossierFieldValue,
  type ProjectDossier,
  type ProjectDossierFieldKey,
} from '../types/dossier';

export const DOSSIER_PRE_IMPORT_BACKUP_KEY = 'ai_creator_studio_dossier_pre_import_backup';

/**
 * Motifs à forte certitude indiquant la présence d'un secret ou d'un fichier binaire non autorisé.
 * Ne cible PAS les termes usuels comme 'mot de passe' ou 'code d'accès'.
 */
const HIGH_CERTAINTY_SECRET_PATTERNS: readonly RegExp[] = [
  /\bsk-[a-zA-Z0-9_-]{20,}\b/,
  /\bghp_[a-zA-Z0-9]{20,}\b/,
  /-----BEGIN\s+[A-Z\s]*PRIVATE\s+KEY-----/,
  /data:application\/pdf;base64,[A-Za-z0-9+/=]{100,}/,
  /data:[a-zA-Z0-9/+-]+;base64,[A-Za-z0-9+/=]{500,}/,
];

/**
 * Crée un dossier de projet vierge avec les 17 champs initialisés au statut 'empty'.
 */
export function createEmptyDossier(): ProjectDossier {
  const now = new Date().toISOString();
  const fields = {} as Record<ProjectDossierFieldKey, DossierFieldValue>;

  for (const key of ALL_DOSSIER_FIELD_KEYS) {
    fields[key] = {
      value: '',
      status: 'empty',
      updatedAt: now,
    };
  }

  return {
    version: 1,
    updatedAt: now,
    fields,
  };
}

/**
 * Valide le contenu d'un champ individuel du dossier :
 * - Absence de secrets à forte certitude ou PDF base64
 * - Respect de la limite de taille spécifique du champ
 */
export function validateDossierField(
  key: ProjectDossierFieldKey,
  value: string
): { valid: boolean; error?: string } {
  if (typeof value !== 'string') {
    return { valid: false, error: 'La valeur du champ doit être une chaîne de caractères.' };
  }

  const maxLength = getFieldMaxLength(key);
  if (value.length > maxLength) {
    return {
      valid: false,
      error: `Le champ '${key}' dépasse la limite maximale autorisée (${maxLength.toLocaleString('fr-FR')} caractères, reçu : ${value.length.toLocaleString('fr-FR')}).`,
    };
  }

  for (const pattern of HIGH_CERTAINTY_SECRET_PATTERNS) {
    if (pattern.test(value)) {
      return {
        valid: false,
        error: `Le champ '${key}' contient un motif sensible interdit (clé API, token d'accès, clé privée ou blob base64).`,
      };
    }
  }

  return { valid: true };
}

/**
 * Calcule la taille cumulée totale de tous les champs d'un dossier.
 */
export function calculateDossierTotalLength(dossier: ProjectDossier): number {
  let total = 0;
  if (!dossier || !dossier.fields) return 0;
  for (const field of Object.values(dossier.fields)) {
    if (field && typeof field.value === 'string') {
      total += field.value.length;
    }
  }
  return total;
}

/**
 * Exporte le dossier de projet sous forme de chaîne JSON structurée et versionnée,
 * avec un nom de fichier lisible et horodaté.
 */
export function exportDossierJson(
  dossier: ProjectDossier,
  studentName?: string
): { jsonString: string; filename: string } {
  const dateStr = new Date().toISOString().split('T')[0];
  const cleanName = (studentName ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const prefix = cleanName ? `dossier-projet-${cleanName}` : 'dossier-projet';
  const filename = `${prefix}-${dateStr}.json`;

  const payload = {
    app: 'AI_CREATOR_STUDIO',
    kind: 'project_dossier',
    version: dossier.version ?? 1,
    exportedAt: new Date().toISOString(),
    dossier,
  };

  return {
    jsonString: JSON.stringify(payload, null, 2),
    filename,
  };
}

export interface ImportDossierOptions {
  confirmOverwrite: boolean;
  currentDossier?: ProjectDossier;
}

export interface ImportDossierResult {
  success: boolean;
  dossier?: ProjectDossier;
  error?: string;
  requireConfirmation?: boolean;
}

/**
 * Restaure un dossier de projet à partir d'une chaîne JSON :
 * - Liste blanche stricte des 17 clés
 * - Rejet absolu de __proto__, constructor et clés inconnues
 * - Statuts restreints à 'empty' | 'draft' | 'valid'
 * - Sauvegarde préalable dans DOSSIER_PRE_IMPORT_BACKUP_KEY
 * - Exigence de confirmation explicite avant d'écraser
 */
export function importDossierJson(
  rawJson: string,
  options: ImportDossierOptions
): ImportDossierResult {
  if (typeof rawJson !== 'string' || rawJson.trim().length === 0) {
    return { success: false, error: 'Fichier JSON vide ou non textuel.' };
  }

  // Protection contre les injections de prototypes et clés malveillantes
  if (rawJson.includes('__proto__') || rawJson.includes('constructor')) {
    return { success: false, error: 'Structure JSON non sécurisée détectée (clés interdites).' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return { success: false, error: 'Syntaxe JSON corrompue ou invalide.' };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { success: false, error: 'Format de fichier incompatible : objet racine attendu.' };
  }

  const root = parsed as Record<string, unknown>;

  // Extraction du payload dossier (direct ou enveloppé)
  const candidateDossier = (
    root.kind === 'project_dossier' && root.dossier && typeof root.dossier === 'object'
      ? root.dossier
      : root
  ) as Record<string, unknown>;

  if (candidateDossier.version !== 1) {
    return {
      success: false,
      error: `Version de schéma incompatible (${String(candidateDossier.version)} au lieu de 1).`,
    };
  }

  if (!candidateDossier.fields || typeof candidateDossier.fields !== 'object') {
    return { success: false, error: 'Champs du dossier manquants ou structure invalide.' };
  }

  const rawFields = candidateDossier.fields as Record<string, unknown>;
  const allowedKeysSet = new Set<string>(ALL_DOSSIER_FIELD_KEYS);

  // Vérification de la liste blanche : aucune clé inconnue tolérée
  for (const key of Object.keys(rawFields)) {
    if (!allowedKeysSet.has(key)) {
      return {
        success: false,
        error: `Clé inconnue ou non autorisée dans le dossier importé : '${key}'.`,
      };
    }
  }

  const sanitizedFields = {} as Record<ProjectDossierFieldKey, DossierFieldValue>;
  const now = new Date().toISOString();
  let totalLength = 0;

  for (const key of ALL_DOSSIER_FIELD_KEYS) {
    const rawVal = rawFields[key];
    let fieldValue = '';
    let fieldStatus: DossierFieldStatus = 'empty';
    let fieldUpdatedAt = now;

    if (rawVal && typeof rawVal === 'object' && !Array.isArray(rawVal)) {
      const fieldObj = rawVal as Record<string, unknown>;
      if (typeof fieldObj.value === 'string') {
        fieldValue = fieldObj.value;
      }
      if (
        fieldObj.status === 'empty' ||
        fieldObj.status === 'draft' ||
        fieldObj.status === 'valid'
      ) {
        fieldStatus = fieldObj.status;
      } else {
        fieldStatus = fieldValue.trim().length > 0 ? 'draft' : 'empty';
      }
      if (typeof fieldObj.updatedAt === 'string') {
        fieldUpdatedAt = fieldObj.updatedAt;
      }
    } else if (typeof rawVal === 'string') {
      fieldValue = rawVal;
      fieldStatus = fieldValue.trim().length > 0 ? 'draft' : 'empty';
    }

    // Validation individuelle du champ (taille et secrets)
    const fieldValidation = validateDossierField(key, fieldValue);
    if (!fieldValidation.valid) {
      return { success: false, error: fieldValidation.error };
    }

    totalLength += fieldValue.length;
    sanitizedFields[key] = {
      value: fieldValue,
      status: fieldStatus,
      updatedAt: fieldUpdatedAt,
    };
  }

  if (totalLength > MAX_DOSSIER_TOTAL_LENGTH) {
    return {
      success: false,
      error: `Le dossier dépasse le plafond global de taille (${MAX_DOSSIER_TOTAL_LENGTH.toLocaleString('fr-FR')} caractères, total : ${totalLength.toLocaleString('fr-FR')}).`,
    };
  }

  // Vérification de la confirmation explicite
  if (!options.confirmOverwrite) {
    return {
      success: false,
      requireConfirmation: true,
      error: 'Confirmation requise pour écraser le dossier de projet existant.',
    };
  }

  // Sauvegarde automatique pré-import de sécurité
  if (typeof window !== 'undefined' && window.localStorage && options.currentDossier) {
    try {
      window.localStorage.setItem(
        DOSSIER_PRE_IMPORT_BACKUP_KEY,
        JSON.stringify({
          backedUpAt: now,
          dossier: options.currentDossier,
        })
      );
    } catch {
      // Tolérance : ne bloque pas si quota dépassé sur le pré-backup
    }
  }

  const restoredDossier: ProjectDossier = {
    version: 1,
    updatedAt: now,
    fields: sanitizedFields,
  };

  return {
    success: true,
    dossier: restoredDossier,
  };
}
