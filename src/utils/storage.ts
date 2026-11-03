import {
  ALL_STEP_TYPES,
  type StepType,
  type StudentProfile,
  type StudentProgress,
} from '../types/course';
import { normalizeStepList, TOTAL_COURSE_DAYS } from './progressCalculator';
import { normalizeActiveRoute } from './courseNavigation';

export const STORAGE_KEY = 'ai_creator_studio_progress_v1';
export const CURRENT_SCHEMA_VERSION = 1 as const;

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  studentName: '',
  business: '',
  targetAudience: '',
  productType: '',
  brandStyle: 'Néo-Brutaliste Éditorial (Crème Papier #FAF6F0, Rouge Brique #B63131, Rose Poudré #E6A0A8, Encre Profonde #171313)',
  mainObjective: '',
  vibe: {
    paletteId: 'editorial-brique',
    styleId: 'neo-brutalist-print',
    typographyId: 'archivo-instrument',
  },
  customVariables: {},
};

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
    profile: { ...DEFAULT_STUDENT_PROFILE },
    lastUpdated: new Date().toISOString(),
  };
}


export function sanitizeProgressState(raw: unknown): StudentProgress {
  const fallback = createInitialProgress();
  if (!raw || typeof raw !== 'object') {
    return fallback;
  }

  const data = raw as Record<string, unknown>;
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

  const rawProfile =
    data.profile && typeof data.profile === 'object'
      ? (data.profile as Record<string, unknown>)
      : {};
  const rawVibe =
    rawProfile.vibe && typeof rawProfile.vibe === 'object'
      ? (rawProfile.vibe as Record<string, unknown>)
      : {};

  const profile: StudentProfile = {
    studentName:
      typeof rawProfile.studentName === 'string'
        ? rawProfile.studentName
        : fallback.profile.studentName,
    business:
      typeof rawProfile.business === 'string' ? rawProfile.business : fallback.profile.business,
    targetAudience:
      typeof rawProfile.targetAudience === 'string'
        ? rawProfile.targetAudience
        : fallback.profile.targetAudience,
    productType:
      typeof rawProfile.productType === 'string'
        ? rawProfile.productType
        : fallback.profile.productType,
    brandStyle:
      typeof rawProfile.brandStyle === 'string' && rawProfile.brandStyle.length > 0
        ? rawProfile.brandStyle
        : fallback.profile.brandStyle,
    mainObjective:
      typeof rawProfile.mainObjective === 'string'
        ? rawProfile.mainObjective
        : fallback.profile.mainObjective,
    vibe: {
      paletteId:
        typeof rawVibe.paletteId === 'string'
          ? rawVibe.paletteId
          : fallback.profile.vibe.paletteId,
      styleId:
        typeof rawVibe.styleId === 'string' ? rawVibe.styleId : fallback.profile.vibe.styleId,
      typographyId:
        typeof rawVibe.typographyId === 'string'
          ? rawVibe.typographyId
          : fallback.profile.vibe.typographyId,
    },
    customVariables:
      rawProfile.customVariables && typeof rawProfile.customVariables === 'object'
        ? (rawProfile.customVariables as Record<string, string>)
        : {},
  };

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
    return sanitizeProgressState(parsed);
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
    if (candidate.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      return null;
    }
    return sanitizeProgressState(parsed);
  } catch {
    return null;
  }
}
