import type { ProfileVariableKey, StudentProfile } from '../types/course';

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
  missingKeys: string[];
  optionalMissingKeys: string[];
  draftWarnings: DraftFieldWarning[];
  resolvedVariables: Record<string, string>;
}

export interface PromptRenderContext {
  profile: StudentProfile;
  localOverrides?: Readonly<Record<string, string>>;
  fallbackPlaceholders?: Readonly<Record<string, string>>;
  optionalKeys?: ReadonlySet<string> | readonly string[];
}

export function resolveVariableValue(
  rawKey: string,
  context: PromptRenderContext
): { value?: string; isDraft?: boolean; canonicalDossierKey?: string } {
  const { profile, localOverrides } = context;

  // 1. Valeur saisie localement dans le bloc
  if (localOverrides && typeof localOverrides[rawKey] === 'string') {
    const val = localOverrides[rawKey].trim();
    if (val.length > 0) {
      return { value: val };
    }
  }

  // 2. Profil de l'apprenant (champs canoniques)
  if (PROFILE_KEYS.includes(rawKey as ProfileVariableKey)) {
    const canonicalKey = rawKey as ProfileVariableKey;
    const profileVal = profile[canonicalKey];
    if (typeof profileVal === 'string' && profileVal.trim().length > 0) {
      return { value: profileVal.trim() };
    }
  }

  // 3. Variables personnalisées du profil
  if (profile.customVariables && typeof profile.customVariables[rawKey] === 'string') {
    const customVal = profile.customVariables[rawKey].trim();
    if (customVal.length > 0) {
      return { value: customVal };
    }
  }

  return {};
}

export function renderPromptTemplate(
  template: string,
  context: PromptRenderContext
): PromptRenderResult {
  const missingKeys: string[] = [];
  const optionalMissingKeys: string[] = [];
  const draftWarnings: DraftFieldWarning[] = [];
  const resolvedVariables: Record<string, string> = {};

  const optionalKeySet = new Set<string>();
  if (context.optionalKeys) {
    for (const key of context.optionalKeys) {
      optionalKeySet.add(key);
    }
  }

  const renderedText = template.replace(
    /\{\{\s*(\??)([a-zA-Z0-9_.-]+)\s*\}\}/g,
    (_, isExplicitOptional, rawKey) => {
      const isOptional = Boolean(isExplicitOptional) || optionalKeySet.has(rawKey);
      const resolution = resolveVariableValue(rawKey, context);

      if (resolution.value !== undefined && resolution.value.length > 0) {
        resolvedVariables[rawKey] = resolution.value;
        return resolution.value;
      }

      if (context.fallbackPlaceholders && context.fallbackPlaceholders[rawKey]) {
        return context.fallbackPlaceholders[rawKey];
      }

      if (isOptional) {
        if (!optionalMissingKeys.includes(rawKey)) {
          optionalMissingKeys.push(rawKey);
        }
        return '';
      }

      if (!missingKeys.includes(rawKey)) {
        missingKeys.push(rawKey);
      }
      return `[${rawKey}]`;
    }
  );

  return {
    renderedText,
    missingKeys,
    optionalMissingKeys,
    draftWarnings,
    resolvedVariables,
  };
}
