import type { ProfileVariableKey, StudentProfile } from '../types/course';
import type { ProjectDossier } from '../types/dossier';
import {
  artisticDirectionToPromptText,
  formatProductIdentityForPrompt,
  parseProductIdentity,
  resolveDossierFieldKey,
} from '../types/dossier';

const PROFILE_KEYS: readonly ProfileVariableKey[] = [
  'studentName',
  'business',
  'targetAudience',
  'productType',
  'brandStyle',
  'mainObjective',
] as const;

export interface DraftFieldWarning {
  key: string;
  canonicalKey: string;
  message: string;
}

export interface PromptRenderResult {
  renderedText: string;
  missingKeys: string[]; // Variables obligatoires non renseignées (bloque la copie)
  optionalMissingKeys: string[]; // Variables optionnelles non renseignées (non bloquant)
  draftWarnings: DraftFieldWarning[]; // Champs en statut 'draft' utilisés
  resolvedVariables: Record<string, string>;
}

export interface PromptRenderContext {
  profile: StudentProfile;
  dossier?: ProjectDossier;
  localOverrides?: Readonly<Record<string, string>>;
  fallbackPlaceholders?: Readonly<Record<string, string>>;
  optionalKeys?: ReadonlySet<string> | readonly string[];
}

/**
 * Résout une variable individuelle selon l'ordre strict de priorité :
 * 1. Valeur locale saisie (localOverrides)
 * 2. Dossier de projet (dossier.buyerProfile, dossier.acheteur, etc.)
 * 3. Profil de l'apprenant (profile.business, customVariables)
 */
export function resolveVariableValue(
  rawKey: string,
  context: PromptRenderContext
): { value?: string; isDraft?: boolean; canonicalDossierKey?: string } {
  const { profile, dossier, localOverrides } = context;

  // 1. Valeur saisie localement dans le bloc
  if (localOverrides && typeof localOverrides[rawKey] === 'string') {
    const val = localOverrides[rawKey].trim();
    if (val.length > 0) {
      return { value: val };
    }
  }

  // 2. Dossier de projet (gestion du préfixe "dossier." ou résolution directe)
  if (dossier && dossier.fields) {
    let dossierTarget = '';
    if (rawKey.startsWith('dossier.')) {
      dossierTarget = rawKey.slice('dossier.'.length);
    } else if (rawKey.startsWith('dossier_')) {
      dossierTarget = rawKey.slice('dossier_'.length);
    }

    if (dossierTarget.length > 0) {
      const canonical = resolveDossierFieldKey(dossierTarget);
      if (canonical && dossier.fields[canonical]) {
        const field = dossier.fields[canonical];
        const val = typeof field.value === 'string' ? field.value.trim() : '';
        if (field.status !== 'empty' && val.length > 0) {
          let formattedVal = val;
          if (canonical === 'artisticDirection') {
            formattedVal = artisticDirectionToPromptText(val);
          } else if (canonical === 'productIdentity') {
            const pid = parseProductIdentity(val);
            formattedVal = pid.productName || formatProductIdentityForPrompt(val);
          }
          return {
            value: formattedVal,
            isDraft: field.status === 'draft',
            canonicalDossierKey: canonical,
          };
        }
        // Champ vide ou absent dans le dossier
        return {};
      }
    }

    // Dérivation transparente depuis le dossier pour les variables canoniques du profil
    if (rawKey === 'brandStyle') {
      const artField = dossier.fields.artisticDirection;
      if (artField && artField.status !== 'empty' && artField.value.trim().length > 0) {
        return {
          value: artisticDirectionToPromptText(artField.value),
          isDraft: artField.status === 'draft',
          canonicalDossierKey: 'artisticDirection',
        };
      }
    }

    if (rawKey === 'productType') {
      const idField = dossier.fields.productIdentity;
      if (idField && idField.status !== 'empty' && idField.value.trim().length > 0) {
        const pid = parseProductIdentity(idField.value);
        if (pid.productName) {
          return {
            value: pid.productName,
            isDraft: idField.status === 'draft',
            canonicalDossierKey: 'productIdentity',
          };
        }
      }
    }
  }

  // 3. Profil de l'apprenant
  if (PROFILE_KEYS.includes(rawKey as ProfileVariableKey)) {
    const rawVal = profile[rawKey as ProfileVariableKey];
    if (typeof rawVal === 'string' && rawVal.trim().length > 0) {
      return { value: rawVal.trim() };
    }
  }

  if (profile.customVariables && typeof profile.customVariables[rawKey] === 'string') {
    const val = profile.customVariables[rawKey].trim();
    if (val.length > 0) {
      return { value: val };
    }
  }

  return {};
}

/**
 * Compile un gabarit de prompt en injectant les variables résolues.
 * Conserve la syntaxe standard {{variable}}, supporte les préfixes {{dossier.variable}}
 * et la notation de variable optionnelle {{?variable}}.
 * Ne remplace JAMAIS une variable manquante par une valeur inventée.
 */
export function renderPromptTemplate(
  template: string,
  profileOrContext: StudentProfile | PromptRenderContext,
  legacyOverrides?: Readonly<Record<string, string>>,
  legacyPlaceholders?: Readonly<Record<string, string>>
): PromptRenderResult {
  // Support de la signature enrichie ou signature historique (compatibilité)
  const context: PromptRenderContext =
    'studentName' in profileOrContext
      ? {
          profile: profileOrContext,
          localOverrides: legacyOverrides,
          fallbackPlaceholders: legacyPlaceholders,
        }
      : profileOrContext;

  const optionalKeysSet = new Set<string>();
  if (context.optionalKeys) {
    for (const k of context.optionalKeys) {
      optionalKeysSet.add(k);
    }
  }

  const missingKeysSet = new Set<string>();
  const optionalMissingKeysSet = new Set<string>();
  const draftWarningsMap = new Map<string, DraftFieldWarning>();
  const resolvedVariables: Record<string, string> = {};

  // Supporte {{variable}}, {{dossier.cle}}, {{?variable_optionnelle}}
  const renderedText = template.replace(
    /\{\{\s*(\??)\s*([a-zA-Z0-9_.]+)\s*\}\}/g,
    (_match, optPrefix: string, rawKey: string) => {
      const isOptional = optPrefix === '?' || optionalKeysSet.has(rawKey);
      const resolution = resolveVariableValue(rawKey, context);

      if (resolution.value !== undefined && resolution.value.length > 0) {
        resolvedVariables[rawKey] = resolution.value;
        if (resolution.isDraft && resolution.canonicalDossierKey) {
          draftWarningsMap.set(rawKey, {
            key: rawKey,
            canonicalKey: resolution.canonicalDossierKey,
            message: `Le champ du dossier '${rawKey}' est actuellement au statut 'Brouillon' (draft).`,
          });
        }
        return resolution.value;
      }

      if (isOptional) {
        optionalMissingKeysSet.add(rawKey);
        const placeholder = context.fallbackPlaceholders?.[rawKey];
        return placeholder ? `[Optionnel : ${placeholder}]` : `[Optionnel : ${rawKey}]`;
      }

      missingKeysSet.add(rawKey);
      const placeholder = context.fallbackPlaceholders?.[rawKey];
      return placeholder ? `[${placeholder}]` : `[DÉFINIR ${rawKey.toUpperCase()}]`;
    }
  );

  return {
    renderedText,
    missingKeys: Array.from(missingKeysSet),
    optionalMissingKeys: Array.from(optionalMissingKeysSet),
    draftWarnings: Array.from(draftWarningsMap.values()),
    resolvedVariables,
  };
}

/**
 * Construit un dictionnaire plat de toutes les variables résolues (conservé pour compatibilité).
 */
export function buildVariableMap(
  profile: StudentProfile,
  localOverrides?: Readonly<Record<string, string>>
): Record<string, string> {
  const map: Record<string, string> = {};

  for (const key of PROFILE_KEYS) {
    const rawValue = profile[key];
    if (typeof rawValue === 'string' && rawValue.trim().length > 0) {
      map[key] = rawValue.trim();
    }
  }

  if (profile.customVariables) {
    for (const [key, value] of Object.entries(profile.customVariables)) {
      if (typeof value === 'string' && value.trim().length > 0) {
        map[key] = value.trim();
      }
    }
  }

  if (localOverrides) {
    for (const [key, value] of Object.entries(localOverrides)) {
      if (typeof value === 'string' && value.trim().length > 0) {
        map[key] = value.trim();
      }
    }
  }

  return map;
}
