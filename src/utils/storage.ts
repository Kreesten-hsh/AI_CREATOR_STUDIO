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
import { normalizeStepList, TOTAL_COURSE_DAYS } from './progressCalculator';
import { normalizeActiveRoute } from './courseNavigation';

export const STORAGE_KEY = 'ai_creator_studio_progress_v1';
export const V1_BACKUP_STORAGE_KEY = 'ai_creator_studio_progress_v1_backup';
export const CURRENT_SCHEMA_VERSION = 2 as const;

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

/**
 * Construit le registre exact des blocs conservés entre V1 et V2 (Leçons 1 à 3 + Orientation startHere).
 */
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

/**
 * Construit le registre complet de tous les blocs actifs de la V2 (Leçons 1 à 9 + Orientation + Bonus).
 */
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
    activeStepByDay: {},
    completedStartHereIds: [],
    completedStepsByDay: {},
    checklistAnswers: {},
    exerciseAnswers: {},
    quizStates: {},
    savedPrompts: {},
    customPromptInputs: {},
    profile: {
      ...DEFAULT_STUDENT_PROFILE,
      vibe: { ...DEFAULT_STUDENT_PROFILE.vibe },
      customVariables: {},
    },
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

  // Neutralise uniquement la valeur par défaut exacte du Studio (conserve tout style personnalisé par l'apprenant)
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
      customVariables,
    },
    archivedStudioBrandStyle,
  };
}

/**
 * Sauvegarde l'état V1 dans `ai_creator_studio_progress_v1_backup` uniquement s'il n'existe pas déjà,
 * et vérifie par relecture que la sauvegarde est bien écrite.
 */
export function ensureV1BackupWritten(rawV1: Record<string, unknown>, rawSerialized?: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    const existingBackup = window.localStorage.getItem(V1_BACKUP_STORAGE_KEY);
    if (existingBackup !== null && existingBackup.length > 0) {
      // Ne jamais écraser une sauvegarde V1 existante
      return true;
    }
    const payload = rawSerialized ?? JSON.stringify(rawV1);
    window.localStorage.setItem(V1_BACKUP_STORAGE_KEY, payload);
    const readBack = window.localStorage.getItem(V1_BACKUP_STORAGE_KEY);
    return readBack === payload;
  } catch {
    return false;
  }
}

/**
 * Migre un état V1 (`schemaVersion === 1`) vers le schéma V2 (`schemaVersion === 2`) :
 * 1. Crée et vérifie la sauvegarde `ai_creator_studio_progress_v1_backup` sans jamais l'écraser.
 * 2. Vérifie la correspondance exacte des identifiants d'exercices, checklists, quiz et prompts avec les leçons 1 à 3 et startHere.
 * 3. Préserve le profil et isole toutes les données incompatibles (jours 4 à 25 ou anciens IDs) dans `legacyArchive` sans suppression silencieuse.
 */
export function migrateV1ToV2(
  rawV1: Record<string, unknown>,
  rawSerialized?: string
): StudentProgress {
  ensureV1BackupWritten(rawV1, rawSerialized);

  const registry = buildPreservedV1BlockRegistry();
  const activeRoute = normalizeActiveRoute(rawV1.activeRoute);
  const unmappedData: Record<string, unknown> = {};

  // 1. Progression par jour : conserver uniquement les leçons 1 à 3, isoler 4 à 25
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

  // 2. Étape active par jour : conserver uniquement les leçons 1 à 3, isoler le reste
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

  // 3. Orientation startHere
  const VALID_START_HERE_IDS = new Set(COURSE_DATA.startHere.map((l) => l.id));
  const completedStartHereIds: string[] = [];
  const unmappedStartHereIds: unknown[] = [];
  if (Array.isArray(rawV1.completedStartHereIds)) {
    for (const item of rawV1.completedStartHereIds) {
      if (typeof item === 'string' && VALID_START_HERE_IDS.has(item)) {
        completedStartHereIds.push(item);
      } else {
        unmappedStartHereIds.push(item);
      }
    }
  }
  if (unmappedStartHereIds.length > 0) {
    unmappedData.completedStartHereIds = unmappedStartHereIds;
  }

  // 4. Réponses aux exercices (vérifiées contre les blocs réels des leçons 1..3 et startHere)
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

  // 5. États des checklists (vérifiés par bloc et par item)
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

  // 6. États des quiz
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

  // 7. Prompts sauvegardés et variables locales de prompts
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

  const migratedState: StudentProgress = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    activeRoute,
    activeStepByDay,
    completedStartHereIds,
    completedStepsByDay,
    checklistAnswers,
    exerciseAnswers,
    quizStates,
    savedPrompts,
    customPromptInputs,
    profile,
    ...(Object.keys(unmappedData).length > 0
      ? {
          legacyArchive: {
            migratedFromSchemaVersion: 1,
            migratedAt: new Date().toISOString(),
            ...unmappedData,
          },
        }
      : {}),
    lastUpdated: new Date().toISOString(),
  };

  saveProgressToStorage(migratedState);
  return migratedState;
}

export function sanitizeProgressState(raw: unknown, rawSerialized?: string): StudentProgress {
  const fallback = createInitialProgress();
  if (!raw || typeof raw !== 'object') {
    return fallback;
  }

  const data = raw as Record<string, unknown>;

  if (data.schemaVersion === 1) {
    return migrateV1ToV2(data, rawSerialized);
  }

  if (data.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    return fallback;
  }

  const activeRoute = normalizeActiveRoute(data.activeRoute);

  const completedStepsByDay: Record<number, StepType[]> = {};
  if (data.completedStepsByDay && typeof data.completedStepsByDay === 'object') {
    for (const [dayKey, steps] of Object.entries(
      data.completedStepsByDay as Record<string, unknown>
    )) {
      const dayNum = Number(dayKey);
      if (
        Number.isInteger(dayNum) &&
        dayNum >= 1 &&
        dayNum <= TOTAL_COURSE_DAYS &&
        Array.isArray(steps)
      ) {
        completedStepsByDay[dayNum] = normalizeStepList(steps as StepType[]);
      }
    }
  }

  const activeStepByDay: Record<number, StepType> = {};
  if (data.activeStepByDay && typeof data.activeStepByDay === 'object') {
    for (const [dayKey, stepVal] of Object.entries(
      data.activeStepByDay as Record<string, unknown>
    )) {
      const dayNum = Number(dayKey);
      if (
        Number.isInteger(dayNum) &&
        dayNum >= 1 &&
        dayNum <= TOTAL_COURSE_DAYS &&
        typeof stepVal === 'string' &&
        ALL_STEP_TYPES.includes(stepVal as StepType)
      ) {
        activeStepByDay[dayNum] = stepVal as StepType;
      }
    }
  }

  const completedStartHereIds = Array.isArray(data.completedStartHereIds)
    ? data.completedStartHereIds.filter((item): item is string => typeof item === 'string')
    : [];

  const { profile } = sanitizeProfile(data.profile, false);

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    activeRoute,
    activeStepByDay,
    completedStartHereIds,
    completedStepsByDay,
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
    ...(data.legacyArchive && typeof data.legacyArchive === 'object'
      ? { legacyArchive: data.legacyArchive as Record<string, unknown> }
      : {}),
    lastUpdated:
      typeof data.lastUpdated === 'string' ? data.lastUpdated : new Date().toISOString(),
  };
}

export function loadProgressFromStorage(): StudentProgress {
  if (typeof window === 'undefined' || !window.localStorage) {
    return createInitialProgress();
  }
  try {
    const serialized = window.localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return createInitialProgress();
    }
    const parsed: unknown = JSON.parse(serialized);
    return sanitizeProgressState(parsed, serialized);
  } catch {
    return createInitialProgress();
  }
}

export function saveProgressToStorage(state: StudentProgress): boolean {
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
    if (candidate.schemaVersion !== CURRENT_SCHEMA_VERSION && candidate.schemaVersion !== 1) {
      return null;
    }
    return sanitizeProgressState(parsed, jsonString);
  } catch {
    return null;
  }
}
