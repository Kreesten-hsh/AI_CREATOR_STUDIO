import {
  ALL_STEP_TYPES,
  type ContentBlock,
  type QuizAttemptState,
  type StepType,
  type StudentProfile,
  type StudentProgress,
} from '../types/course';
import { COURSE_DATA } from '../data/course';
import { BONUSES } from '../data/navigation/bonuses';
import { normalizeStepIdList, normalizeStepList, TOTAL_COURSE_DAYS } from './progressCalculator';
import { normalizeActiveRoute } from './courseNavigation';
import { createEmptyDossier, importDossierJson } from './dossierStorage';
import type { ProjectDossier } from '../types/dossier';

export const STORAGE_KEY = 'ai_creator_studio_progress_v1';
export const RAW_BACKUP_V1_STORAGE_KEY = 'ai_creator_studio_raw_backup_v1';
export const RAW_BACKUP_V2_STORAGE_KEY = 'ai_creator_studio_raw_backup_v2';
export const CORRUPTED_BACKUP_STORAGE_KEY = 'ai_creator_studio_corrupted_backup';
export const V1_BACKUP_STORAGE_KEY = RAW_BACKUP_V1_STORAGE_KEY; // Alias de compatibilité
export const CURRENT_SCHEMA_VERSION = 3 as const;

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
    } else if (block.type === 'prompt-builder') {
      registry.promptIds.add(block.id);
    }
  }
}

export function buildPreservedV1BlockRegistry(): BlockIdRegistry {
  const registry: BlockIdRegistry = {
    exerciseIds: new Set<string>(),
    checklistItemsByBlockId: new Map<string, Set<string>>(),
    quizIds: new Set<string>(),
    promptIds: new Set<string>(),
  };

  for (const startLesson of COURSE_DATA.startHere) {
    collectBlocksIntoRegistry(startLesson.blocks, registry);
  }

  for (const day of COURSE_DATA.days) {
    if (day.dayNumber >= 1 && day.dayNumber <= 3) {
      for (const step of day.steps) {
        collectBlocksIntoRegistry(step.blocks, registry);
      }
    }
  }

  return registry;
}

export function buildFullV2BlockRegistry(): BlockIdRegistry {
  const registry = buildPreservedV1BlockRegistry();

  for (const day of COURSE_DATA.days) {
    if (day.dayNumber >= 4 && day.dayNumber <= TOTAL_COURSE_DAYS) {
      for (const step of day.steps) {
        collectBlocksIntoRegistry(step.blocks, registry);
      }
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
    activeRoute: { kind: 'home' },
    activeStepIdByDay: {},
    completedStartHereIds: [],
    completedStepIdsByDay: {},
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
    dossier: createEmptyDossier(),
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
 * Sauvegarde l'état brut versionné (v1 ou v2) sous sa clé dédiée.
 * Ne l'écrase JAMAIS si elle existe déjà, et vérifie par relecture immédiate la validité de l'écriture.
 */
export function ensureRawBackupWritten(version: 1 | 2, payload: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  const targetKey = version === 1 ? RAW_BACKUP_V1_STORAGE_KEY : RAW_BACKUP_V2_STORAGE_KEY;
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

/**
 * Rétro-compatibilité pour l'ancienne fonction ensureV1BackupWritten.
 */
export function ensureV1BackupWritten(rawV1: Record<string, unknown>, rawSerialized?: string): boolean {
  const payload = rawSerialized ?? JSON.stringify(rawV1);
  return ensureRawBackupWritten(1, payload);
}

/**
 * Migre un état intermédiaire V2 vers le schéma V3 :
 * - Migration des étapes terminées uniquement en cas de correspondance non ambiguë (legacyType -> step.id)
 * - Archivage sans perte dans legacyArchive pour toute donnée non appariée
 * - Initialisation du dossier de projet versionné
 */
export function migrateV2ToV3(
  rawV2: Record<string, unknown>,
  rawSerialized?: string
): StudentProgress {
  let persistenceDisabled = false;
  if (rawSerialized) {
    const backupSuccess = ensureRawBackupWritten(2, rawSerialized);
    if (!backupSuccess) {
      persistenceDisabled = true;
    }
  }

  const activeRoute = normalizeActiveRoute(rawV2.activeRoute);
  const unmappedData: Record<string, unknown> = {};

  // 1. Migration des étapes complétées par journée (legacyType -> step.id)
  const completedStepIdsByDay: Record<number, string[]> = {};
  const unmappedCompletedSteps: Record<string, unknown> = {};

  if (rawV2.completedStepsByDay && typeof rawV2.completedStepsByDay === 'object') {
    for (const [dayKey, steps] of Object.entries(
      rawV2.completedStepsByDay as Record<string, unknown>
    )) {
      const dayNum = Number(dayKey);
      if (
        Number.isInteger(dayNum) &&
        dayNum >= 1 &&
        dayNum <= TOTAL_COURSE_DAYS &&
        Array.isArray(steps)
      ) {
        const day = COURSE_DATA.days.find((d) => d.dayNumber === dayNum);
        const mappedIds: string[] = [];
        const unmappedList: unknown[] = [];

        for (const item of steps) {
          if (typeof item === 'string') {
            // Recherche par legacyType (ou id direct si déjà présent)
            const matchById = day?.steps.find((s) => s.id === item);
            if (matchById) {
              mappedIds.push(matchById.id);
              continue;
            }
            const matchingSteps = day?.steps.filter((s) => s.legacyType === item) ?? [];
            if (matchingSteps.length === 1) {
              mappedIds.push(matchingSteps[0].id);
            } else {
              unmappedList.push(item);
            }
          } else {
            unmappedList.push(item);
          }
        }

        if (mappedIds.length > 0) {
          completedStepIdsByDay[dayNum] = normalizeStepIdList(mappedIds);
        }
        if (unmappedList.length > 0) {
          unmappedCompletedSteps[dayKey] = unmappedList;
        }
      } else {
        unmappedCompletedSteps[dayKey] = steps;
      }
    }
  }

  if (Object.keys(unmappedCompletedSteps).length > 0) {
    unmappedData.completedStepsByDay = unmappedCompletedSteps;
  }

  // 2. Migration de l'étape active par journée (legacyType -> step.id)
  const activeStepIdByDay: Record<number, string> = {};
  const unmappedActiveSteps: Record<string, unknown> = {};

  if (rawV2.activeStepByDay && typeof rawV2.activeStepByDay === 'object') {
    for (const [dayKey, stepVal] of Object.entries(
      rawV2.activeStepByDay as Record<string, unknown>
    )) {
      const dayNum = Number(dayKey);
      if (
        Number.isInteger(dayNum) &&
        dayNum >= 1 &&
        dayNum <= TOTAL_COURSE_DAYS &&
        typeof stepVal === 'string'
      ) {
        const day = COURSE_DATA.days.find((d) => d.dayNumber === dayNum);
        const matchById = day?.steps.find((s) => s.id === stepVal);
        if (matchById) {
          activeStepIdByDay[dayNum] = matchById.id;
          continue;
        }
        const matchingSteps = day?.steps.filter((s) => s.legacyType === stepVal) ?? [];
        if (matchingSteps.length === 1) {
          activeStepIdByDay[dayNum] = matchingSteps[0].id;
        } else {
          unmappedActiveSteps[dayKey] = stepVal;
          if (day?.steps[0]) {
            activeStepIdByDay[dayNum] = day.steps[0].id;
          }
        }
      } else {
        unmappedActiveSteps[dayKey] = stepVal;
      }
    }
  }

  if (Object.keys(unmappedActiveSteps).length > 0) {
    unmappedData.activeStepByDay = unmappedActiveSteps;
  }

  // 3. Orientation
  const completedStartHereIds = Array.isArray(rawV2.completedStartHereIds)
    ? rawV2.completedStartHereIds.filter((item): item is string => typeof item === 'string')
    : [];

  // 4. Profil
  const { profile, archivedStudioBrandStyle } = sanitizeProfile(rawV2.profile, false);
  if (archivedStudioBrandStyle) {
    unmappedData.archivedStudioBrandStyle = archivedStudioBrandStyle;
  }

  // 5. Dossier de projet (chargement existant ou initialisation vierge)
  let dossier: ProjectDossier = createEmptyDossier();
  if (rawV2.dossier && typeof rawV2.dossier === 'object') {
    const importRes = importDossierJson(JSON.stringify(rawV2.dossier), { confirmOverwrite: true });
    if (importRes.success && importRes.dossier) {
      dossier = importRes.dossier;
    }
  }

  const existingArchive =
    rawV2.legacyArchive && typeof rawV2.legacyArchive === 'object'
      ? (rawV2.legacyArchive as Record<string, unknown>)
      : {};

  const migratedState: StudentProgress = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    activeRoute,
    activeStepIdByDay,
    completedStartHereIds,
    completedStepIdsByDay,
    checklistAnswers:
      rawV2.checklistAnswers && typeof rawV2.checklistAnswers === 'object'
        ? (rawV2.checklistAnswers as Record<string, Record<string, boolean>>)
        : {},
    exerciseAnswers:
      rawV2.exerciseAnswers && typeof rawV2.exerciseAnswers === 'object'
        ? (rawV2.exerciseAnswers as Record<string, string>)
        : {},
    quizStates:
      rawV2.quizStates && typeof rawV2.quizStates === 'object'
        ? (rawV2.quizStates as StudentProgress['quizStates'])
        : {},
    savedPrompts:
      rawV2.savedPrompts && typeof rawV2.savedPrompts === 'object'
        ? (rawV2.savedPrompts as Record<string, string>)
        : {},
    customPromptInputs:
      rawV2.customPromptInputs && typeof rawV2.customPromptInputs === 'object'
        ? (rawV2.customPromptInputs as Record<string, Record<string, string>>)
        : {},
    profile,
    dossier,
    persistenceDisabled: persistenceDisabled || Boolean(rawV2.persistenceDisabled),
    ...(Object.keys(unmappedData).length > 0 || Object.keys(existingArchive).length > 0
      ? {
          legacyArchive: {
            ...existingArchive,
            migratedToSchemaVersion: 3,
            migratedAt: new Date().toISOString(),
            ...unmappedData,
          },
        }
      : {}),
    lastUpdated: new Date().toISOString(),
  };

  if (!migratedState.persistenceDisabled) {
    saveProgressToStorage(migratedState);
  }
  return migratedState;
}

/**
 * Chaîne complète de migration V1 -> V2 -> V3.
 */
export function migrateV1ToV3(rawV1: Record<string, unknown>, rawSerialized?: string): StudentProgress {
  const payload = rawSerialized ?? JSON.stringify(rawV1);
  let persistenceDisabled = false;
  const backupSuccess = ensureRawBackupWritten(1, payload);
  if (!backupSuccess) {
    persistenceDisabled = true;
  }

  const activeRoute = normalizeActiveRoute(rawV1.activeRoute);
  const unmappedData: Record<string, unknown> = {
    migratedFromSchemaVersion: 1,
    migratedAt: new Date().toISOString(),
  };

  const completedStepsByDay: Record<number, StepType[]> = {};
  const unmappedCompletedStepsByDay: Record<string, unknown> = {};
  if (rawV1.completedStepsByDay && typeof rawV1.completedStepsByDay === 'object') {
    for (const [dayKey, steps] of Object.entries(
      rawV1.completedStepsByDay as Record<string, unknown>
    )) {
      const dayNum = Number(dayKey);
      if (Number.isInteger(dayNum) && dayNum >= 1 && dayNum <= 3 && Array.isArray(steps)) {
        completedStepsByDay[dayNum] = normalizeStepList(steps as StepType[]);
      } else {
        unmappedCompletedStepsByDay[dayKey] = steps;
      }
    }
  }
  if (Object.keys(unmappedCompletedStepsByDay).length > 0) {
    unmappedData.completedStepsByDay = unmappedCompletedStepsByDay;
  }

  const activeStepByDay: Record<number, StepType> = {};
  const unmappedActiveStepByDay: Record<string, unknown> = {};
  if (rawV1.activeStepByDay && typeof rawV1.activeStepByDay === 'object') {
    for (const [dayKey, stepVal] of Object.entries(
      rawV1.activeStepByDay as Record<string, unknown>
    )) {
      const dayNum = Number(dayKey);
      if (
        Number.isInteger(dayNum) &&
        dayNum >= 1 &&
        dayNum <= 3 &&
        typeof stepVal === 'string' &&
        ALL_STEP_TYPES.includes(stepVal as StepType)
      ) {
        activeStepByDay[dayNum] = stepVal as StepType;
      } else {
        unmappedActiveStepByDay[dayKey] = stepVal;
      }
    }
  }
  if (Object.keys(unmappedActiveStepByDay).length > 0) {
    unmappedData.activeStepByDay = unmappedActiveStepByDay;
  }

  const registry = buildPreservedV1BlockRegistry();

  // 4. Réponses aux exercices
  const exerciseAnswers: Record<string, string> = {};
  const unmappedExerciseAnswers: Record<string, unknown> = {};
  if (rawV1.exerciseAnswers && typeof rawV1.exerciseAnswers === 'object') {
    for (const [exId, val] of Object.entries(rawV1.exerciseAnswers as Record<string, unknown>)) {
      if (registry.exerciseIds.has(exId) && typeof val === 'string') {
        exerciseAnswers[exId] = val;
      } else {
        unmappedExerciseAnswers[exId] = val;
      }
    }
  }
  if (Object.keys(unmappedExerciseAnswers).length > 0) {
    unmappedData.exerciseAnswers = unmappedExerciseAnswers;
  }

  // 5. Checklists
  const checklistAnswers: Record<string, Record<string, boolean>> = {};
  const unmappedChecklistAnswers: Record<string, unknown> = {};
  if (rawV1.checklistAnswers && typeof rawV1.checklistAnswers === 'object') {
    for (const [chkId, rawItems] of Object.entries(
      rawV1.checklistAnswers as Record<string, unknown>
    )) {
      const validItemSet = registry.checklistItemsByBlockId.get(chkId);
      if (validItemSet && rawItems && typeof rawItems === 'object') {
        const keptItems: Record<string, boolean> = {};
        const droppedItems: Record<string, unknown> = {};
        for (const [itemId, checked] of Object.entries(rawItems as Record<string, unknown>)) {
          if (validItemSet.has(itemId) && typeof checked === 'boolean') {
            keptItems[itemId] = checked;
          } else {
            droppedItems[itemId] = checked;
          }
        }
        if (Object.keys(keptItems).length > 0) {
          checklistAnswers[chkId] = keptItems;
        }
        if (Object.keys(droppedItems).length > 0) {
          unmappedChecklistAnswers[chkId] = droppedItems;
        }
      } else {
        unmappedChecklistAnswers[chkId] = rawItems;
      }
    }
  }
  if (Object.keys(unmappedChecklistAnswers).length > 0) {
    unmappedData.checklistAnswers = unmappedChecklistAnswers;
  }

  // 6. Quiz
  const quizStates: Record<string, QuizAttemptState> = {};
  const unmappedQuizStates: Record<string, unknown> = {};
  if (rawV1.quizStates && typeof rawV1.quizStates === 'object') {
    for (const [qId, qState] of Object.entries(rawV1.quizStates as Record<string, unknown>)) {
      if (registry.quizIds.has(qId) && qState && typeof qState === 'object') {
        quizStates[qId] = qState as QuizAttemptState;
      } else {
        unmappedQuizStates[qId] = qState;
      }
    }
  }
  if (Object.keys(unmappedQuizStates).length > 0) {
    unmappedData.quizStates = unmappedQuizStates;
  }

  // 7. Prompts
  const savedPrompts: Record<string, string> = {};
  const unmappedSavedPrompts: Record<string, unknown> = {};
  if (rawV1.savedPrompts && typeof rawV1.savedPrompts === 'object') {
    for (const [pId, pVal] of Object.entries(rawV1.savedPrompts as Record<string, unknown>)) {
      if (registry.promptIds.has(pId) && typeof pVal === 'string') {
        savedPrompts[pId] = pVal;
      } else {
        unmappedSavedPrompts[pId] = pVal;
      }
    }
  }
  if (Object.keys(unmappedSavedPrompts).length > 0) {
    unmappedData.savedPrompts = unmappedSavedPrompts;
  }

  const customPromptInputs: Record<string, Record<string, string>> = {};
  const unmappedCustomPromptInputs: Record<string, unknown> = {};
  if (rawV1.customPromptInputs && typeof rawV1.customPromptInputs === 'object') {
    for (const [pId, pFields] of Object.entries(
      rawV1.customPromptInputs as Record<string, unknown>
    )) {
      if (registry.promptIds.has(pId) && pFields && typeof pFields === 'object') {
        customPromptInputs[pId] = pFields as Record<string, string>;
      } else {
        unmappedCustomPromptInputs[pId] = pFields;
      }
    }
  }
  if (Object.keys(unmappedCustomPromptInputs).length > 0) {
    unmappedData.customPromptInputs = unmappedCustomPromptInputs;
  }

  // 8. Profil
  const { profile, archivedStudioBrandStyle } = sanitizeProfile(rawV1.profile, true);
  if (archivedStudioBrandStyle) {
    unmappedData.archivedStudioBrandStyle = archivedStudioBrandStyle;
  }

  const intermediateV2 = {
    schemaVersion: 2,
    activeRoute,
    completedStepsByDay,
    activeStepByDay,
    completedStartHereIds: Array.isArray(rawV1.completedStartHereIds) ? rawV1.completedStartHereIds : [],
    checklistAnswers,
    exerciseAnswers,
    quizStates,
    savedPrompts,
    customPromptInputs,
    profile,
    legacyArchive: unmappedData,
    persistenceDisabled,
  };

  return migrateV2ToV3(intermediateV2, JSON.stringify(intermediateV2));
}

/**
 * Migration de compatibilité V1 vers V2 (conservée pour l'export/import d'anciens formats).
 */
export function migrateV1ToV2(rawV1: Record<string, unknown>, rawSerialized?: string): StudentProgress {
  return migrateV1ToV3(rawV1, rawSerialized);
}

export function sanitizeProgressState(raw: unknown, rawSerialized?: string): StudentProgress {
  const fallback = createInitialProgress();
  if (!raw || typeof raw !== 'object') {
    return fallback;
  }

  const data = raw as Record<string, unknown>;

  if (data.schemaVersion === 1) {
    return migrateV1ToV3(data, rawSerialized);
  }

  if (data.schemaVersion === 2) {
    return migrateV2ToV3(data, rawSerialized);
  }

  if (data.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    return fallback;
  }

  const activeRoute = normalizeActiveRoute(data.activeRoute);

  const completedStepIdsByDay: Record<number, string[]> = {};
  if (data.completedStepIdsByDay && typeof data.completedStepIdsByDay === 'object') {
    for (const [dayKey, steps] of Object.entries(
      data.completedStepIdsByDay as Record<string, unknown>
    )) {
      const dayNum = Number(dayKey);
      if (
        Number.isInteger(dayNum) &&
        dayNum >= 1 &&
        dayNum <= TOTAL_COURSE_DAYS &&
        Array.isArray(steps)
      ) {
        completedStepIdsByDay[dayNum] = normalizeStepIdList(steps as string[]);
      }
    }
  }

  const activeStepIdByDay: Record<number, string> = {};
  if (data.activeStepIdByDay && typeof data.activeStepIdByDay === 'object') {
    for (const [dayKey, stepVal] of Object.entries(
      data.activeStepIdByDay as Record<string, unknown>
    )) {
      const dayNum = Number(dayKey);
      if (
        Number.isInteger(dayNum) &&
        dayNum >= 1 &&
        dayNum <= TOTAL_COURSE_DAYS &&
        typeof stepVal === 'string'
      ) {
        activeStepIdByDay[dayNum] = stepVal;
      }
    }
  }

  const completedStartHereIds = Array.isArray(data.completedStartHereIds)
    ? data.completedStartHereIds.filter((item): item is string => typeof item === 'string')
    : [];

  const { profile } = sanitizeProfile(data.profile, false);

  let dossier: ProjectDossier = createEmptyDossier();
  if (data.dossier && typeof data.dossier === 'object') {
    const importRes = importDossierJson(JSON.stringify(data.dossier), { confirmOverwrite: true });
    if (importRes.success && importRes.dossier) {
      dossier = importRes.dossier;
    }
  }

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    activeRoute,
    activeStepIdByDay,
    completedStartHereIds,
    completedStepIdsByDay,
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
    dossier,
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
    return sanitizeProgressState(parsed, serialized);
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
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    const candidate = parsed as Record<string, unknown>;
    if (
      candidate.schemaVersion !== CURRENT_SCHEMA_VERSION &&
      candidate.schemaVersion !== 2 &&
      candidate.schemaVersion !== 1
    ) {
      return null;
    }
    return sanitizeProgressState(parsed, jsonString);
  } catch {
    return null;
  }
}
