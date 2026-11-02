import type { ProfileVariableKey, StudentProfile } from '../types/course';

const PROFILE_KEYS: readonly ProfileVariableKey[] = [
  'studentName',
  'business',
  'targetAudience',
  'productType',
  'brandStyle',
  'mainObjective',
] as const;

export interface PromptRenderResult {
  renderedText: string;
  missingKeys: string[];
  resolvedVariables: Record<string, string>;
}

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

export function renderPromptTemplate(
  template: string,
  profile: StudentProfile,
  localOverrides?: Readonly<Record<string, string>>,
  fallbackPlaceholders?: Readonly<Record<string, string>>
): PromptRenderResult {
  const resolvedVariables = buildVariableMap(profile, localOverrides);
  const missingKeysSet = new Set<string>();

  const renderedText = template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, rawKey: string) => {
    const value = resolvedVariables[rawKey];
    if (value && value.length > 0) {
      return value;
    }

    missingKeysSet.add(rawKey);
    const placeholder = fallbackPlaceholders?.[rawKey];
    return placeholder ? `[${placeholder}]` : `[DÉFINIR ${rawKey.toUpperCase()}]`;
  });

  return {
    renderedText,
    missingKeys: Array.from(missingKeysSet),
    resolvedVariables,
  };
}
