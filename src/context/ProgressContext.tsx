import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ALL_STEP_TYPES,
  type ActiveRoute,
  type ProfileVariableKey,
  type QuizAttemptState,
  type StepType,
  type StudentProfile,
  type StudentProgress,
  type VibeSelection,
} from '../types/course';
import {
  calculateDailyProgress,
  calculateGlobalProgress,
  normalizeStepList,
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
import { getCourseById, resolveCourseIdForDay } from '../utils/courseNavigation';

export interface ProgressContextValue {
  state: StudentProgress;
  globalProgress: GlobalProgressResult;
  getDayProgress: (dayNumber: number) => DailyProgressResult;
  getActiveStepForDay: (dayNumber: number) => StepType;
  navigateToHome: () => void;
  navigateToCourse: (courseId: string, dayNumber?: number, lessonId?: string) => void;
  navigateToBonus: (bonusId: string) => void;
  navigateToResources: () => void;
  navigateToStartHere: (lessonId: string) => void;
  navigateToDay: (dayNumber: number, step?: StepType) => void;
  setActiveStepForDay: (dayNumber: number, step: StepType) => void;
  completeStep: (dayNumber: number, step: StepType, advanceToNext?: boolean) => void;
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

  const globalProgress = useMemo(
    () => calculateGlobalProgress(state.completedStepsByDay),
    [state.completedStepsByDay]
  );

  const getDayProgress = useCallback(
    (dayNumber: number): DailyProgressResult => {
      return calculateDailyProgress(state.completedStepsByDay[dayNumber]);
    },
    [state.completedStepsByDay]
  );

  const getActiveStepForDay = useCallback(
    (dayNumber: number): StepType => {
      return state.activeStepByDay[dayNumber] ?? 'concept';
    },
    [state.activeStepByDay]
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
        const validCourseId = course?.id ?? 'course-01';
        const [startDay, endDay] = course?.dayRange ?? [1, 15];

        let targetDay = dayNumber ?? startDay;
        if (targetDay < startDay || targetDay > endDay) {
          targetDay = startDay;
        }

        const targetStep = prev.activeStepByDay[targetDay] ?? 'concept';
        return {
          ...prev,
          activeRoute: {
            kind: 'course',
            courseId: validCourseId,
            dayNumber: targetDay,
            lessonId,
          },
          activeStepByDay: {
            ...prev.activeStepByDay,
            [targetDay]: targetStep,
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

  const navigateToStartHere = useCallback((lessonId: string) => {
    const nextRoute: ActiveRoute = {
      kind: 'course',
      courseId: 'course-01',
      lessonId,
    };
    setState((prev) => ({
      ...prev,
      activeRoute: nextRoute,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const navigateToDay = useCallback((dayNumber: number, step?: StepType) => {
    setState((prev) => {
      const safeDay = Math.max(1, Math.min(25, dayNumber));
      const courseId = resolveCourseIdForDay(safeDay);
      const nextStep = step ?? prev.activeStepByDay[safeDay] ?? 'concept';

      return {
        ...prev,
        activeRoute: { kind: 'course', courseId, dayNumber: safeDay },
        activeStepByDay: {
          ...prev.activeStepByDay,
          [safeDay]: nextStep,
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const setActiveStepForDay = useCallback((dayNumber: number, step: StepType) => {
    setState((prev) => ({
      ...prev,
      activeStepByDay: {
        ...prev.activeStepByDay,
        [dayNumber]: step,
      },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const completeStep = useCallback(
    (dayNumber: number, step: StepType, advanceToNext = true) => {
      setState((prev) => {
        const existingSteps = prev.completedStepsByDay[dayNumber] ?? [];
        const updatedSteps = normalizeStepList([...existingSteps, step]);
        const currentIdx = ALL_STEP_TYPES.indexOf(step);
        const nextStep: StepType =
          advanceToNext && currentIdx >= 0 && currentIdx < ALL_STEP_TYPES.length - 1
            ? ALL_STEP_TYPES[currentIdx + 1]
            : step;

        return {
          ...prev,
          completedStepsByDay: {
            ...prev.completedStepsByDay,
            [dayNumber]: updatedSteps,
          },
          activeStepByDay: {
            ...prev.activeStepByDay,
            [dayNumber]: nextStep,
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
    (lessonId: string) => state.completedStartHereIds.includes(lessonId),
    [state.completedStartHereIds]
  );

  const updateProfileField = useCallback((key: ProfileVariableKey, value: string) => {
    setState((prev) => {
      const updatedProfile: StudentProfile = {
        ...prev.profile,
        [key]: value,
      };
      return {
        ...prev,
        profile: updatedProfile,
        lastUpdated: new Date().toISOString(),
      };
    });
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
          brandStyle: brandStyleSummary,
        },
        lastUpdated: new Date().toISOString(),
      }));
    },
    []
  );

  const toggleChecklistItem = useCallback((checklistId: string, itemId: string) => {
    setState((prev) => {
      const currentList = prev.checklistAnswers[checklistId] ?? {};
      const nextValue = !currentList[itemId];
      return {
        ...prev,
        checklistAnswers: {
          ...prev.checklistAnswers,
          [checklistId]: {
            ...currentList,
            [itemId]: nextValue,
          },
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const saveExerciseAnswer = useCallback(
    (exerciseId: string, answer: string, profileBinding?: ProfileVariableKey) => {
      setState((prev) => {
        const updatedProfile = profileBinding
          ? { ...prev.profile, [profileBinding]: answer }
          : prev.profile;
        return {
          ...prev,
          profile: updatedProfile,
          exerciseAnswers: {
            ...prev.exerciseAnswers,
            [exerciseId]: answer,
          },
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
      getActiveStepForDay,
      navigateToHome,
      navigateToCourse,
      navigateToBonus,
      navigateToResources,
      navigateToStartHere,
      navigateToDay,
      setActiveStepForDay,
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
      exportBackup,
      importBackup,
      resetAllProgress,
    }),
    [
      state,
      globalProgress,
      getDayProgress,
      getActiveStepForDay,
      navigateToHome,
      navigateToCourse,
      navigateToBonus,
      navigateToResources,
      navigateToStartHere,
      navigateToDay,
      setActiveStepForDay,
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
      exportBackup,
      importBackup,
      resetAllProgress,
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
