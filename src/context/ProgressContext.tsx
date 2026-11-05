import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type {
  ActiveRoute,
  ProfileVariableKey,
  QuizAttemptState,
  StudentProgress,
  VibeSelection,
} from '../types/course';
import type {
  DossierFieldStatus,
  DossierFieldValue,
  ProjectDossier,
  ProjectDossierFieldKey,
} from '../types/dossier';
import {
  calculateDailyProgress,
  calculateGlobalProgress,
  normalizeStepIdList,
  TOTAL_COURSE_DAYS,
  type DailyProgressResult,
  type GlobalProgressResult,
} from '../utils/progressCalculator';
import {
  createInitialProgress,
  exportProgressJson,
  importProgressJson,
  loadProgressFromStorage,
  saveProgressToStorage,
} from '../utils/storage';
import { createEmptyDossier, validateDossierField } from '../utils/dossierStorage';
import { getCourseById, resolveCourseIdForDay } from '../utils/courseNavigation';
import { COURSE_DATA } from '../data/course';

export interface ProgressContextValue {
  state: StudentProgress;
  globalProgress: GlobalProgressResult;
  getDayProgress: (dayNumber: number) => DailyProgressResult;
  getActiveStepIdForDay: (dayNumber: number) => string;
  getActiveStepForDay: (dayNumber: number) => string; // Alias rétro-compatible
  navigateToHome: () => void;
  navigateToCourse: (courseId: string, dayNumber?: number, lessonId?: string) => void;
  navigateToBonus: (bonusId: string) => void;
  navigateToResources: () => void;
  navigateToProject: () => void;
  navigateToStartHere: (lessonId: string) => void;
  navigateToDay: (dayNumber: number, stepId?: string) => void;
  setActiveStepIdForDay: (dayNumber: number, stepId: string) => void;
  setActiveStepForDay: (dayNumber: number, stepId: string) => void; // Alias rétro-compatible
  completeStep: (
    dayNumber: number,
    stepId: string,
    advanceToNext?: boolean,
    explicitNextStepId?: string
  ) => void;
  toggleStartHereComplete: (lessonId: string) => void;
  isStartHereCompleted: (lessonId: string) => boolean;
  updateProfileField: (key: ProfileVariableKey, value: string) => void;
  updateCustomVariable: (key: string, value: string) => void;
  updateVibeSelection: (vibe: VibeSelection, brandStyleSummary: string) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
  saveExerciseAnswer: (exerciseId: string, answer: string, profileBinding?: ProfileVariableKey) => void;
  saveQuizAttempt: (quizId: string, attempt: QuizAttemptState) => void;
  saveCustomPromptInput: (blockId: string, fieldKey: string, value: string) => void;
  resetPromptInputs: (blockId: string, fieldKeysToClear?: ProfileVariableKey[]) => void;
  updateDossierField: (
    key: ProjectDossierFieldKey,
    value: string,
    status?: DossierFieldStatus
  ) => { success: boolean; error?: string };
  setDossier: (dossier: ProjectDossier) => void;
  resetDossier: () => void;
  exportBackup: () => string;
  importBackup: (rawJson: string) => boolean;
  resetAllProgress: () => void;
}

export const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StudentProgress>(() => loadProgressFromStorage());

  useEffect(() => {
    saveProgressToStorage(state);
  }, [state]);

  const stepCountByDay = useMemo(() => {
    const map: Record<number, number> = {};
    for (const d of COURSE_DATA.days) {
      map[d.dayNumber] = d.steps.length;
    }
    return map;
  }, []);

  const globalProgress = useMemo(
    () => calculateGlobalProgress(state.completedStepIdsByDay, stepCountByDay),
    [state.completedStepIdsByDay, stepCountByDay]
  );

  const getDayProgress = useCallback(
    (dayNumber: number): DailyProgressResult => {
      const day = COURSE_DATA.days.find((d) => d.dayNumber === dayNumber);
      const totalSteps = day?.steps.length ?? 3;
      return calculateDailyProgress(state.completedStepIdsByDay[dayNumber], totalSteps);
    },
    [state.completedStepIdsByDay]
  );

  const getActiveStepIdForDay = useCallback(
    (dayNumber: number): string => {
      const day = COURSE_DATA.days.find((d) => d.dayNumber === dayNumber);
      return state.activeStepIdByDay[dayNumber] ?? day?.steps[0]?.id ?? '';
    },
    [state.activeStepIdByDay]
  );

  const navigateToHome = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeRoute: { kind: 'home' },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const navigateToCourse = useCallback(
    (courseId: string, dayNumber?: number, lessonId?: string) => {
      setState((prev) => {
        const course = getCourseById(courseId);
        const validCourseId = course?.id ?? 'module-01';
        const [startDay, endDay] = course?.dayRange ?? [1, 3];

        let targetDay = dayNumber ?? startDay;
        if (targetDay < startDay || targetDay > endDay) {
          targetDay = startDay;
        }

        const day = COURSE_DATA.days.find((d) => d.dayNumber === targetDay);
        const targetStepId = prev.activeStepIdByDay[targetDay] ?? day?.steps[0]?.id ?? '';

        return {
          ...prev,
          activeRoute: {
            kind: 'course',
            courseId: validCourseId,
            dayNumber: targetDay,
            lessonId,
          },
          activeStepIdByDay: {
            ...prev.activeStepIdByDay,
            [targetDay]: targetStepId,
          },
          lastUpdated: new Date().toISOString(),
        };
      });
    },
    []
  );

  const navigateToBonus = useCallback((bonusId: string) => {
    setState((prev) => ({
      ...prev,
      activeRoute: { kind: 'bonus', bonusId },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const navigateToResources = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeRoute: { kind: 'resources' },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const navigateToProject = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeRoute: { kind: 'project' },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const navigateToStartHere = useCallback((lessonId: string) => {
    const validLessonId = lessonId === 'setup' ? 'setup' : 'introduction';
    const nextRoute: ActiveRoute = {
      kind: 'start-here',
      lessonId: validLessonId,
    };
    setState((prev) => ({
      ...prev,
      activeRoute: nextRoute,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const navigateToDay = useCallback((dayNumber: number, stepId?: string) => {
    setState((prev) => {
      const safeDay = Math.max(1, Math.min(TOTAL_COURSE_DAYS, dayNumber));
      const courseId = resolveCourseIdForDay(safeDay) ?? 'module-01';
      const day = COURSE_DATA.days.find((d) => d.dayNumber === safeDay);
      const nextStepId = stepId ?? prev.activeStepIdByDay[safeDay] ?? day?.steps[0]?.id ?? '';

      return {
        ...prev,
        activeRoute: { kind: 'course', courseId, dayNumber: safeDay },
        activeStepIdByDay: {
          ...prev.activeStepIdByDay,
          [safeDay]: nextStepId,
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const setActiveStepIdForDay = useCallback((dayNumber: number, stepId: string) => {
    setState((prev) => ({
      ...prev,
      activeStepIdByDay: {
        ...prev.activeStepIdByDay,
        [dayNumber]: stepId,
      },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const completeStep = useCallback(
    (
      dayNumber: number,
      stepId: string,
      advanceToNext = true,
      explicitNextStepId?: string
    ) => {
      setState((prev) => {
        const existingSteps = prev.completedStepIdsByDay[dayNumber] ?? [];
        const updatedSteps = normalizeStepIdList([...existingSteps, stepId]);
        const day = COURSE_DATA.days.find((d) => d.dayNumber === dayNumber);

        let nextStepId: string = stepId;
        if (advanceToNext) {
          if (explicitNextStepId) {
            nextStepId = explicitNextStepId;
          } else if (day) {
            const currentIdx = day.steps.findIndex((s) => s.id === stepId);
            if (currentIdx >= 0 && currentIdx < day.steps.length - 1) {
              nextStepId = day.steps[currentIdx + 1].id;
            }
          }
        }

        return {
          ...prev,
          completedStepIdsByDay: {
            ...prev.completedStepIdsByDay,
            [dayNumber]: updatedSteps,
          },
          activeStepIdByDay: {
            ...prev.activeStepIdByDay,
            [dayNumber]: nextStepId,
          },
          lastUpdated: new Date().toISOString(),
        };
      });
    },
    []
  );

  const toggleStartHereComplete = useCallback((lessonId: string) => {
    setState((prev) => {
      const exists = prev.completedStartHereIds.includes(lessonId);
      const nextIds = exists
        ? prev.completedStartHereIds.filter((id) => id !== lessonId)
        : [...prev.completedStartHereIds, lessonId];
      return {
        ...prev,
        completedStartHereIds: nextIds,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const isStartHereCompleted = useCallback(
    (lessonId: string): boolean => {
      return state.completedStartHereIds.includes(lessonId);
    },
    [state.completedStartHereIds]
  );

  const updateProfileField = useCallback((key: ProfileVariableKey, value: string) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value,
      },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const updateCustomVariable = useCallback((key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        customVariables: {
          ...prev.profile.customVariables,
          [key]: value,
        },
      },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const updateVibeSelection = useCallback(
    (vibe: VibeSelection, brandStyleSummary: string) => {
      setState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          vibe,
          vibeConfirmed: true,
          brandStyle: brandStyleSummary,
        },
        lastUpdated: new Date().toISOString(),
      }));
    },
    []
  );

  const toggleChecklistItem = useCallback((checklistId: string, itemId: string) => {
    setState((prev) => {
      const currentChecklist = prev.checklistAnswers[checklistId] ?? {};
      const currentVal = Boolean(currentChecklist[itemId]);
      return {
        ...prev,
        checklistAnswers: {
          ...prev.checklistAnswers,
          [checklistId]: {
            ...currentChecklist,
            [itemId]: !currentVal,
          },
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const saveExerciseAnswer = useCallback(
    (exerciseId: string, answer: string, profileBinding?: ProfileVariableKey) => {
      setState((prev) => {
        const nextProfile = profileBinding
          ? { ...prev.profile, [profileBinding]: answer }
          : prev.profile;

        return {
          ...prev,
          exerciseAnswers: {
            ...prev.exerciseAnswers,
            [exerciseId]: answer,
          },
          profile: nextProfile,
          lastUpdated: new Date().toISOString(),
        };
      });
    },
    []
  );

  const saveQuizAttempt = useCallback((quizId: string, attempt: QuizAttemptState) => {
    setState((prev) => ({
      ...prev,
      quizStates: {
        ...prev.quizStates,
        [quizId]: attempt,
      },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const saveCustomPromptInput = useCallback(
    (blockId: string, fieldKey: string, value: string) => {
      setState((prev) => ({
        ...prev,
        customPromptInputs: {
          ...prev.customPromptInputs,
          [blockId]: {
            ...(prev.customPromptInputs[blockId] ?? {}),
            [fieldKey]: value,
          },
        },
        lastUpdated: new Date().toISOString(),
      }));
    },
    []
  );

  const resetPromptInputs = useCallback(
    (blockId: string, fieldKeysToClear?: ProfileVariableKey[]) => {
      setState((prev) => {
        const nextCustomInputs = { ...prev.customPromptInputs };
        delete nextCustomInputs[blockId];

        const nextProfile = { ...prev.profile };
        if (fieldKeysToClear) {
          for (const key of fieldKeysToClear) {
            nextProfile[key] = '';
          }
        }

        return {
          ...prev,
          profile: nextProfile,
          customPromptInputs: nextCustomInputs,
          lastUpdated: new Date().toISOString(),
        };
      });
    },
    []
  );

  const updateDossierField = useCallback(
    (
      key: ProjectDossierFieldKey,
      value: string,
      status?: DossierFieldStatus
    ): { success: boolean; error?: string } => {
      const validation = validateDossierField(key, value);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      setState((prev) => {
        const currentDossier = prev.dossier ?? createEmptyDossier();
        const deducedStatus: DossierFieldStatus =
          status ?? (value.trim().length > 0 ? 'draft' : 'empty');

        const updatedFields: Record<ProjectDossierFieldKey, DossierFieldValue> = {
          ...currentDossier.fields,
          [key]: {
            value,
            status: deducedStatus,
            updatedAt: new Date().toISOString(),
          },
        };

        return {
          ...prev,
          dossier: {
            ...currentDossier,
            updatedAt: new Date().toISOString(),
            fields: updatedFields,
          },
          lastUpdated: new Date().toISOString(),
        };
      });

      return { success: true };
    },
    []
  );

  const setDossier = useCallback((newDossier: ProjectDossier) => {
    setState((prev) => ({
      ...prev,
      dossier: newDossier,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const resetDossier = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dossier: createEmptyDossier(),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const exportBackup = useCallback(() => {
    return exportProgressJson(state);
  }, [state]);

  const importBackup = useCallback((rawJson: string): boolean => {
    const imported = importProgressJson(rawJson);
    if (!imported) {
      return false;
    }
    setState(imported);
    return true;
  }, []);

  const resetAllProgress = useCallback(() => {
    const fresh = createInitialProgress();
    setState(fresh);
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      globalProgress,
      getDayProgress,
      getActiveStepIdForDay,
      getActiveStepForDay: getActiveStepIdForDay,
      navigateToHome,
      navigateToCourse,
      navigateToBonus,
      navigateToResources,
      navigateToProject,
      navigateToStartHere,
      navigateToDay,
      setActiveStepIdForDay,
      setActiveStepForDay: setActiveStepIdForDay,
      completeStep,
      toggleStartHereComplete,
      isStartHereCompleted,
      updateProfileField,
      updateCustomVariable,
      updateVibeSelection,
      toggleChecklistItem,
      saveExerciseAnswer,
      saveQuizAttempt,
      saveCustomPromptInput,
      resetPromptInputs,
      updateDossierField,
      setDossier,
      resetDossier,
      exportBackup,
      importBackup,
      resetAllProgress,
    }),
    [
      state,
      globalProgress,
      getDayProgress,
      getActiveStepIdForDay,
      navigateToHome,
      navigateToCourse,
      navigateToBonus,
      navigateToResources,
      navigateToProject,
      navigateToStartHere,
      navigateToDay,
      setActiveStepIdForDay,
      completeStep,
      toggleStartHereComplete,
      isStartHereCompleted,
      updateProfileField,
      updateCustomVariable,
      updateVibeSelection,
      toggleChecklistItem,
      saveExerciseAnswer,
      saveQuizAttempt,
      saveCustomPromptInput,
      resetPromptInputs,
      updateDossierField,
      setDossier,
      resetDossier,
      exportBackup,
      importBackup,
      resetAllProgress,
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
