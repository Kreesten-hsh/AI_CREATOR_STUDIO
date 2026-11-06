import {
  ALL_LESSON_IDS,
  type ContentBlock,
  type LessonId,
  type QuizAttemptState,
  type StudentProfile,
  type StudentProgress,
} from '../types/course';
import { ALL_LESSONS } from '../data/course';
import { BONUSES } from '../data/navigation/bonuses';
import { normalizeStepIdList } from './progressCalculator';
import { normalizeActiveRoute, normalizeLessonId } from './courseNavigation';

export const STORAGE_KEY = 'ai_creator_studio_progress_v1';
export const RAW_BACKUP_V1_STORAGE_KEY = 'ai_creator_studio_raw_backup_v1';
export const RAW_BACKUP_V2_STORAGE_KEY = 'ai_creator_studio_raw_backup_v2';
export const RAW_BACKUP_V3_STORAGE_KEY = 'ai_creator_studio_raw_backup_v3';
export const CORRUPTED_BACKUP_STORAGE_KEY = 'ai_creator_studio_corrupted_backup';
export const V1_BACKUP_STORAGE_KEY = RAW_BACKUP_V1_STORAGE_KEY;
export const CURRENT_SCHEMA_VERSION = 4 as const;
export const CURRICULUM_MODEL = '3m-3d-7l' as const;

export const STUDIO_LEGACY_BRAND_STYLE =
  'Néo-Brutaliste Éditorial (Crème Papier #FAF6F0, Rouge Brique #B63131, Rose Poudré #E6A0A8, Encre Profonde #171313)';

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  studentName: '',
  business: '',
  targetAudience: '',
  productType: '',
  brandStyle: '',
  mainObjective: '',
  vibe: {
    paletteId: 'slate-emerald',
    styleId: 'clean-modern-cards',
    typographyId: 'inter-system',
  },
  vibeConfirmed: false,
  customVariables: {},
};

interface BlockIdRegistry {
  exerciseIds: Set<string>;
  checklistItemsByBlockId: Map<string, Set<string>>;
  quizIds: Set<string>;
  promptIds: Set<string>;
}

function collectBlocksIntoRegistry(blocks: readonly ContentBlock[], registry: BlockIdRegistry): void {
  for (const block of blocks) {
    if (block.type === 'text-exercise') {
      registry.exerciseIds.add(block.id);
    } else if (block.type === 'checklist') {
      const itemSet = registry.checklistItemsByBlockId.get(block.id) ?? new Set<string>();
      for (const item of block.items) {
        itemSet.add(item.id);
      }
      registry.checklistItemsByBlockId.set(block.id, itemSet);
    } else if (block.type === 'quiz') {
      registry.quizIds.add(block.id);
    } else if (block.type === 'copy') {
      registry.promptIds.add(block.id);
    }
  }
}

export function buildCurrentCurriculumBlockRegistry(): BlockIdRegistry {
  const registry: BlockIdRegistry = {
    exerciseIds: new Set<string>(),
    checklistItemsByBlockId: new Map<string, Set<string>>(),
    quizIds: new Set<string>(),
    promptIds: new Set<string>(),
  };

  for (const lesson of ALL_LESSONS) {
    for (const step of lesson.steps) {
      collectBlocksIntoRegistry(step.blocks, registry);
    }
  }

  for (const bonus of BONUSES) {
    if (bonus.blocks) {
      collectBlocksIntoRegistry(bonus.blocks, registry);
    }
  }

  return registry;
}

export function createInitialProgress(): StudentProgress {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    curriculumModel: CURRICULUM_MODEL,
    activeRoute: { kind: 'home' },
    activeStepIdByLesson: {},
    completedStepIdsByLesson: {},
    checklistAnswers: {},
    exerciseAnswers: {},
    quizStates: {},
    savedPrompts: {},
    customPromptInputs: {},
    profile: {
      ...DEFAULT_STUDENT_PROFILE,
      vibe: { ...DEFAULT_STUDENT_PROFILE.vibe },
      vibeConfirmed: false,
      customVariables: {},
    },
    persistenceDisabled: false,
    lastUpdated: new Date().toISOString(),
  };
}

function sanitizeProfile(
  rawProfileInput: unknown,
  isMigratingFromV1: boolean
): { profile: StudentProfile; archivedStudioBrandStyle?: string } {
  const fallback = createInitialProgress().profile;
  const rawProfile =
    rawProfileInput && typeof rawProfileInput === 'object'
      ? (rawProfileInput as Record<string, unknown>)
      : {};
  const rawVibe =
    rawProfile.vibe && typeof rawProfile.vibe === 'object'
      ? (rawProfile.vibe as Record<string, unknown>)
      : {};

  let brandStyle =
    typeof rawProfile.brandStyle === 'string' ? rawProfile.brandStyle : fallback.brandStyle;
  let archivedStudioBrandStyle: string | undefined;

  if (brandStyle === STUDIO_LEGACY_BRAND_STYLE) {
    archivedStudioBrandStyle = brandStyle;
    brandStyle = '';
  }

  const rawPaletteId =
    typeof rawVibe.paletteId === 'string' ? rawVibe.paletteId : fallback.vibe.paletteId;
  const rawStyleId = typeof rawVibe.styleId === 'string' ? rawVibe.styleId : fallback.vibe.styleId;
  const rawTypoId =
    typeof rawVibe.typographyId === 'string' ? rawVibe.typographyId : fallback.vibe.typographyId;

  const isLegacyDefaultVibe =
    isMigratingFromV1 &&
    rawPaletteId === 'editorial-brique' &&
    rawStyleId === 'neo-brutalist-print' &&
    rawTypoId === 'archivo-instrument';

  const customVariables: Record<string, string> = {};
  if (rawProfile.customVariables && typeof rawProfile.customVariables === 'object') {
    for (const [k, v] of Object.entries(rawProfile.customVariables as Record<string, unknown>)) {
      if (typeof v === 'string') {
        customVariables[k] = v;
      }
    }
  }

  const vibeConfirmed =
    typeof rawProfile.vibeConfirmed === 'boolean'
      ? rawProfile.vibeConfirmed
      : !isLegacyDefaultVibe &&
        (rawPaletteId !== fallback.vibe.paletteId ||
          rawStyleId !== fallback.vibe.styleId ||
          rawTypoId !== fallback.vibe.typographyId);

  return {
    profile: {
      studentName:
        typeof rawProfile.studentName === 'string'
          ? rawProfile.studentName
          : fallback.studentName,
      business:
        typeof rawProfile.business === 'string' ? rawProfile.business : fallback.business,
      targetAudience:
        typeof rawProfile.targetAudience === 'string'
          ? rawProfile.targetAudience
          : fallback.targetAudience,
      productType:
        typeof rawProfile.productType === 'string'
          ? rawProfile.productType
          : fallback.productType,
      brandStyle,
      mainObjective:
        typeof rawProfile.mainObjective === 'string'
          ? rawProfile.mainObjective
          : fallback.mainObjective,
      vibe: isLegacyDefaultVibe
        ? { ...fallback.vibe }
        : {
            paletteId: rawPaletteId,
            styleId: rawStyleId,
            typographyId: rawTypoId,
          },
      vibeConfirmed,
      customVariables,
    },
    archivedStudioBrandStyle,
  };
}

/**
 * Sauvegarde l'état brut versionné (v1, v2 ou v3) sous sa clé dédiée.
 * Ne l'écrase JAMAIS si elle existe déjà, et vérifie par relecture immédiate la validité de l'écriture.
 */
export function ensureRawBackupWritten(version: 1 | 2 | 3, payload: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  const targetKey =
    version === 1
      ? RAW_BACKUP_V1_STORAGE_KEY
      : version === 2
      ? RAW_BACKUP_V2_STORAGE_KEY
      : RAW_BACKUP_V3_STORAGE_KEY;

  try {
    const existing = window.localStorage.getItem(targetKey);
    if (existing !== null && existing.length > 0) {
      return true;
    }
    window.localStorage.setItem(targetKey, payload);
    const readBack = window.localStorage.getItem(targetKey);
    return readBack === payload;
  } catch {
    return false;
  }
}

export function ensureV1BackupWritten(rawV1: Record<string, unknown>, rawSerialized?: string): boolean {
  const payload = rawSerialized ?? JSON.stringify(rawV1);
  return ensureRawBackupWritten(1, payload);
}

/**
 * Migre un ancien état (V1, V2 ou V3 à 9 jours) vers le schéma V4 ('3m-3d-7l').
 * - Sauvegarde brute vérifiée avant remplacement.
 * - Aucune conversion fictive des anciennes journées en nouvelles leçons :
 *   completedStepIdsByLesson et activeStepIdByLesson sont initialisés à {}.
 * - Archivage intégral sans perte dans legacyArchive.
 */
export function migrateLegacyToV4(
  rawLegacy: Record<string, unknown>,
  fromVersion: 1 | 2 | 3,
  rawSerialized?: string,
  persistToStorage = true
): StudentProgress {
  let persistenceDisabled = Boolean(rawLegacy.persistenceDisabled);
  const serializedPayload = rawSerialized ?? JSON.stringify(rawLegacy);

  if (persistToStorage) {
    const backupSuccess = ensureRawBackupWritten(fromVersion, serializedPayload);
    if (!backupSuccess) {
      persistenceDisabled = true;
    }
  }

  const activeRoute = normalizeActiveRoute(rawLegacy.activeRoute);
  const { profile, archivedStudioBrandStyle } = sanitizeProfile(
    rawLegacy.profile,
    fromVersion === 1
  );

  const archivedFields: Record<string, unknown> = {
    migratedFromSchemaVersion: fromVersion,
    migratedToSchemaVersion: CURRENT_SCHEMA_VERSION,
    migratedAt: new Date().toISOString(),
  };

  if (rawLegacy.activeRoute !== undefined) {
    archivedFields.previousActiveRoute = rawLegacy.activeRoute;
  }
  if (rawLegacy.completedStepsByDay !== undefined) {
    archivedFields.completedStepsByDay = rawLegacy.completedStepsByDay;
  }
  if (rawLegacy.completedStepIdsByDay !== undefined) {
    archivedFields.completedStepIdsByDay = rawLegacy.completedStepIdsByDay;
  }
  if (rawLegacy.activeStepByDay !== undefined) {
    archivedFields.activeStepByDay = rawLegacy.activeStepByDay;
  }
  if (rawLegacy.activeStepIdByDay !== undefined) {
    archivedFields.activeStepIdByDay = rawLegacy.activeStepIdByDay;
  }
  if (rawLegacy.completedStartHereIds !== undefined) {
    archivedFields.completedStartHereIds = rawLegacy.completedStartHereIds;
  }
  if (archivedStudioBrandStyle) {
    archivedFields.archivedStudioBrandStyle = archivedStudioBrandStyle;
  }

  const registry = buildCurrentCurriculumBlockRegistry();

  // Tri des réponses aux exercices : conserver si le bloc existe dans le cursus actuel, sinon archiver
  const exerciseAnswers: Record<string, string> = {};
  const archivedExercises: Record<string, unknown> = {};
  if (rawLegacy.exerciseAnswers && typeof rawLegacy.exerciseAnswers === 'object') {
    for (const [exId, val] of Object.entries(rawLegacy.exerciseAnswers as Record<string, unknown>)) {
      if (registry.exerciseIds.has(exId) && typeof val === 'string') {
        exerciseAnswers[exId] = val;
      } else {
        archivedExercises[exId] = val;
      }
    }
  }
  if (Object.keys(archivedExercises).length > 0) {
    archivedFields.exerciseAnswers = archivedExercises;
  }

  // Tri des checklists
  const checklistAnswers: Record<string, Record<string, boolean>> = {};
  const archivedChecklists: Record<string, unknown> = {};
  if (rawLegacy.checklistAnswers && typeof rawLegacy.checklistAnswers === 'object') {
    for (const [chkId, rawItems] of Object.entries(
      rawLegacy.checklistAnswers as Record<string, unknown>
    )) {
      const validItemSet = registry.checklistItemsByBlockId.get(chkId);
      if (validItemSet && rawItems && typeof rawItems === 'object') {
        const kept: Record<string, boolean> = {};
        const dropped: Record<string, unknown> = {};
        for (const [itemId, checked] of Object.entries(rawItems as Record<string, unknown>)) {
          if (validItemSet.has(itemId) && typeof checked === 'boolean') {
            kept[itemId] = checked;
          } else {
            dropped[itemId] = checked;
          }
        }
        if (Object.keys(kept).length > 0) {
          checklistAnswers[chkId] = kept;
        }
        if (Object.keys(dropped).length > 0) {
          archivedChecklists[chkId] = dropped;
        }
      } else {
        archivedChecklists[chkId] = rawItems;
      }
    }
  }
  if (Object.keys(archivedChecklists).length > 0) {
    archivedFields.checklistAnswers = archivedChecklists;
  }

  // Tri des quiz
  const quizStates: Record<string, QuizAttemptState> = {};
  const archivedQuizzes: Record<string, unknown> = {};
  if (rawLegacy.quizStates && typeof rawLegacy.quizStates === 'object') {
    for (const [qId, qState] of Object.entries(rawLegacy.quizStates as Record<string, unknown>)) {
      if (registry.quizIds.has(qId) && qState && typeof qState === 'object') {
        quizStates[qId] = qState as QuizAttemptState;
      } else {
        archivedQuizzes[qId] = qState;
      }
    }
  }
  if (Object.keys(archivedQuizzes).length > 0) {
    archivedFields.quizStates = archivedQuizzes;
  }

  // Tri des prompts sauvegardés
  const savedPrompts: Record<string, string> = {};
  const archivedPrompts: Record<string, unknown> = {};
  if (rawLegacy.savedPrompts && typeof rawLegacy.savedPrompts === 'object') {
    for (const [pId, pVal] of Object.entries(rawLegacy.savedPrompts as Record<string, unknown>)) {
      if (registry.promptIds.has(pId) && typeof pVal === 'string') {
        savedPrompts[pId] = pVal;
      } else {
        archivedPrompts[pId] = pVal;
      }
    }
  }
  if (Object.keys(archivedPrompts).length > 0) {
    archivedFields.savedPrompts = archivedPrompts;
  }

  const customPromptInputs: Record<string, Record<string, string>> = {};
  const archivedCustomInputs: Record<string, unknown> = {};
  if (rawLegacy.customPromptInputs && typeof rawLegacy.customPromptInputs === 'object') {
    for (const [pId, pFields] of Object.entries(
      rawLegacy.customPromptInputs as Record<string, unknown>
    )) {
      if (registry.promptIds.has(pId) && pFields && typeof pFields === 'object') {
        customPromptInputs[pId] = pFields as Record<string, string>;
      } else {
        archivedCustomInputs[pId] = pFields;
      }
    }
  }
  if (Object.keys(archivedCustomInputs).length > 0) {
    archivedFields.customPromptInputs = archivedCustomInputs;
  }

  const existingArchive =
    rawLegacy.legacyArchive && typeof rawLegacy.legacyArchive === 'object'
      ? (rawLegacy.legacyArchive as Record<string, unknown>)
      : {};

  const migratedState: StudentProgress = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    curriculumModel: CURRICULUM_MODEL,
    activeRoute,
    activeStepIdByLesson: {},
    completedStepIdsByLesson: {},
    checklistAnswers,
    exerciseAnswers,
    quizStates,
    savedPrompts,
    customPromptInputs,
    profile,
    persistenceDisabled,
    legacyArchive: {
      ...existingArchive,
      ...archivedFields,
    },
    lastUpdated: new Date().toISOString(),
  };

  if (persistToStorage && !migratedState.persistenceDisabled) {
    const saved = saveProgressToStorage(migratedState);
    if (!saved) {
      migratedState.persistenceDisabled = true;
    }
  }

  return migratedState;
}

export function migrateV3ToV4(
  rawV3: Record<string, unknown>,
  rawSerialized?: string,
  persistToStorage = true
): StudentProgress {
  return migrateLegacyToV4(rawV3, 3, rawSerialized, persistToStorage);
}

export function migrateV2ToV4(
  rawV2: Record<string, unknown>,
  rawSerialized?: string,
  persistToStorage = true
): StudentProgress {
  return migrateLegacyToV4(rawV2, 2, rawSerialized, persistToStorage);
}

export function migrateV1ToV4(
  rawV1: Record<string, unknown>,
  rawSerialized?: string,
  persistToStorage = true
): StudentProgress {
  return migrateLegacyToV4(rawV1, 1, rawSerialized, persistToStorage);
}

export const migrateV2ToV3 = migrateV2ToV4;
export const migrateV1ToV3 = migrateV1ToV4;
export const migrateV1ToV2 = migrateV1ToV4;

export function sanitizeProgressState(
  raw: unknown,
  rawSerialized?: string,
  persistToStorage = true
): StudentProgress {
  const fallback = createInitialProgress();
  if (!raw || typeof raw !== 'object') {
    return fallback;
  }

  const data = raw as Record<string, unknown>;

  if (data.schemaVersion === 1) {
    return migrateV1ToV4(data, rawSerialized, persistToStorage);
  }

  if (data.schemaVersion === 2) {
    return migrateV2ToV4(data, rawSerialized, persistToStorage);
  }

  if (data.schemaVersion === 3) {
    return migrateV3ToV4(data, rawSerialized, persistToStorage);
  }

  if (data.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    return fallback;
  }

  // Si un objet V4 ne porte pas le modèle de cursus canonique '3m-3d-7l',
  // on n'accepte aucune validation de leçon non vérifiée.
  if (data.curriculumModel !== CURRICULUM_MODEL) {
    return migrateLegacyToV4(data, 3, rawSerialized, persistToStorage);
  }

  const activeRoute = normalizeActiveRoute(data.activeRoute);
  const validLessonIdSet = new Set<string>(ALL_LESSON_IDS);

  const completedStepIdsByLesson: Partial<Record<LessonId, string[]>> = {};
  if (data.completedStepIdsByLesson && typeof data.completedStepIdsByLesson === 'object') {
    for (const [lessonKey, steps] of Object.entries(
      data.completedStepIdsByLesson as Record<string, unknown>
    )) {
      const normalizedId = normalizeLessonId(lessonKey);
      if (normalizedId && validLessonIdSet.has(normalizedId) && Array.isArray(steps)) {
        const normalizedSteps = normalizeStepIdList(steps as string[]);
        if (normalizedSteps.length > 0) {
          completedStepIdsByLesson[normalizedId] = normalizedSteps;
        }
      }
    }
  }

  const activeStepIdByLesson: Partial<Record<LessonId, string>> = {};
  if (data.activeStepIdByLesson && typeof data.activeStepIdByLesson === 'object') {
    for (const [lessonKey, stepVal] of Object.entries(
      data.activeStepIdByLesson as Record<string, unknown>
    )) {
      const normalizedId = normalizeLessonId(lessonKey);
      if (
        normalizedId &&
        validLessonIdSet.has(normalizedId) &&
        typeof stepVal === 'string' &&
        stepVal.trim().length > 0
      ) {
        activeStepIdByLesson[normalizedId] = stepVal.trim();
      }
    }
  }

  const { profile } = sanitizeProfile(data.profile, false);

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    curriculumModel: CURRICULUM_MODEL,
    activeRoute,
    activeStepIdByLesson,
    completedStepIdsByLesson,
    checklistAnswers:
      data.checklistAnswers && typeof data.checklistAnswers === 'object'
        ? (data.checklistAnswers as Record<string, Record<string, boolean>>)
        : {},
    exerciseAnswers:
      data.exerciseAnswers && typeof data.exerciseAnswers === 'object'
        ? (data.exerciseAnswers as Record<string, string>)
        : {},
    quizStates:
      data.quizStates && typeof data.quizStates === 'object'
        ? (data.quizStates as StudentProgress['quizStates'])
        : {},
    savedPrompts:
      data.savedPrompts && typeof data.savedPrompts === 'object'
        ? (data.savedPrompts as Record<string, string>)
        : {},
    customPromptInputs:
      data.customPromptInputs && typeof data.customPromptInputs === 'object'
        ? (data.customPromptInputs as Record<string, Record<string, string>>)
        : {},
    profile,
    persistenceDisabled: false,
    ...(data.legacyArchive && typeof data.legacyArchive === 'object'
      ? { legacyArchive: data.legacyArchive as Record<string, unknown> }
      : {}),
    lastUpdated:
      typeof data.lastUpdated === 'string' ? data.lastUpdated : new Date().toISOString(),
  };
}

/**
 * Charge la progression depuis localStorage avec gestion intégrale des pannes :
 * - Mode privé, quota ou exception système
 * - Sauvegarde du JSON corrompu sous CORRUPTED_BACKUP_STORAGE_KEY sans écraser STORAGE_KEY
 * - Activation de persistenceDisabled si l'intégrité de la persistance est compromise
 */
export function loadProgressFromStorage(): StudentProgress {
  if (typeof window === 'undefined' || !window.localStorage) {
    const fallback = createInitialProgress();
    fallback.persistenceDisabled = true;
    return fallback;
  }

  let serialized: string | null = null;
  try {
    serialized = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    const fallback = createInitialProgress();
    fallback.persistenceDisabled = true;
    return fallback;
  }

  if (!serialized) {
    return createInitialProgress();
  }

  try {
    const parsed: unknown = JSON.parse(serialized);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return createInitialProgress();
    }
    return sanitizeProgressState(parsed, serialized, true);
  } catch {
    // Le JSON est corrompu : isolation sous la clé dédiée et verrouillage de sécurité
    try {
      const existingCorrupted = window.localStorage.getItem(CORRUPTED_BACKUP_STORAGE_KEY);
      if (!existingCorrupted) {
        window.localStorage.setItem(CORRUPTED_BACKUP_STORAGE_KEY, serialized);
      }
    } catch {
      // Ignorer si écriture impossible
    }

    const safeFallback = createInitialProgress();
    safeFallback.persistenceDisabled = true;
    return safeFallback;
  }
}

/**
 * Enregistre l'état dans localStorage :
 * - N'écrit JAMAIS si persistenceDisabled est actif (pour protéger les données utilisateur)
 * - Tolère les erreurs de quota sans faire planter l'application
 */
export function saveProgressToStorage(state: StudentProgress): boolean {
  if (state.persistenceDisabled) {
    return false;
  }
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    const serialized = JSON.stringify(state);
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing === serialized) {
      return true;
    }
    window.localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch {
    return false;
  }
}

export function exportProgressJson(state: StudentProgress): string {
  return JSON.stringify(state, null, 2);
}

export function importProgressJson(jsonString: string): StudentProgress | null {
  try {
    const parsed: unknown = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }
    const candidate = parsed as Record<string, unknown>;
    if (
      candidate.schemaVersion !== CURRENT_SCHEMA_VERSION &&
      candidate.schemaVersion !== 3 &&
      candidate.schemaVersion !== 2 &&
      candidate.schemaVersion !== 1
    ) {
      return null;
    }
    return sanitizeProgressState(parsed, jsonString, false);
  } catch {
    return null;
  }
}
