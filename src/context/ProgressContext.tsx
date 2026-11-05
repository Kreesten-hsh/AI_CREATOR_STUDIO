import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type {
  ActiveRoute,
  ProfileVariableKey,
  QuizAttemptState,
  StudentProgress,
  VibeSelection,
} from '../types/course';
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
import { getCourseById, resolveCourseIdForDay } from '../utils/courseNavigation';
import { COURSE_DATA } from '../data/course';

export interface ProgressContextValue {
  state: StudentProgress;
  globalProgress: GlobalProgressResult;
  getDayProgress: (dayNumber: number) => DailyProgressResult;
  getActiveStepIdForDay: (dayNumber: number) => string;
  getActiveStepForDay: (dayNumber: number) => string;
  navigateToHome: () => void;
  navigateToCourse: (courseId: string, dayNumber?: number, lessonId?: string) => void;
  navigateToBonus: (bonusId: string) => void;
  navigateToResources: () => void;
  navigateToPracticalSheets: () => void;
  navigateToStartHere: (lessonId: string) => void;
  navigateToDay: (dayNumber: number, stepId?: string) => void;
  setActiveStepIdForDay: (dayNumber: number, stepId: string) => void;
  setActiveStepForDay: (dayNumber: number, stepId: string) => void;
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

  const globalProgress = useMemo<GlobalProgressResult>(() => {
    const totalStepsByDay: Record<number, number> = {};
    for (const d of COURSE_DATA.days) {
      totalStepsByDay[d.dayNumber] = d.steps.length;
    }
    return calculateGlobalProgress(state.completedStepIdsByDay, totalStepsByDay);
  }, [state.completedStepIdsByDay]);

  const getDayProgress = useCallback(
    (dayNumber: number): DailyProgressResult => {
      const day = COURSE_DATA.days.find((d) => d.dayNumber === dayNumber);
      const totalSteps = day ? day.steps.length : 0;
      return calculateDailyProgress(state.completedStepIdsByDay[dayNumber], totalSteps);
    },
    [state.completedStepIdsByDay]
  );

  const getActiveStepIdForDay = useCallback(
    (dayNumber: number): string => {
      const day = COURSE_DATA.days.find((d) => d.dayNumber === dayNumber);
      if (!day) return '';
      const explicit = state.activeStepIdByDay[dayNumber];
      if (explicit && day.steps.some((s) => s.id === explicit)) {
        return explicit;
      }
      return day.steps[0]?.id ?? '';
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
    (courseId: string, targetDayNumber?: number, _lessonId?: string) => {
      setState((prev) => {
        const course = getCourseById(courseId);
        const startDay = course?.dayRange?.[0] ?? 1;
        const endDay = course?.dayRange?.[1] ?? TOTAL_COURSE_DAYS;
        let dayNum = targetDayNumber ?? startDay;
        if (dayNum < startDay || dayNum > endDay) {
          dayNum = startDay;
        }

        const day = COURSE_DATA.days.find((d) => d.dayNumber === dayNum);
        const activeStepId = prev.activeStepIdByDay[dayNum] ?? day?.steps[0]?.id ?? '';

        return {
          ...prev,
          activeRoute: {
            kind: 'course',
            courseId,
            dayNumber: dayNum,
          },
          activeStepIdByDay: {
            ...prev.activeStepIdByDay,
            [dayNum]: activeStepId,
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

  const navigateToPracticalSheets = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeRoute: { kind: 'practical-sheets' },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const navigateToStartHere = useCallback((lessonId: string) => {
    const validLessonId = lessonId === 'setup' ? 'setup' : 'introduction';
    const nextRoute: ActiveRoute = {
      kind: 'start-here' as const,
      lessonId: validLessonId,
    } as unknown as ActiveRoute;
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
      const next = exists
        ? prev.completedStartHereIds.filter((id) => id !== lessonId)
        : [...prev.completedStartHereIds, lessonId];
      return {
        ...prev,
        completedStartHereIds: next,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const isStartHereCompleted = useCallback(
    (lessonId: string) => state.completedStartHereIds.includes(lessonId),
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
          brandStyle: brandStyleSummary,
          vibeConfirmed: true,
        },
        lastUpdated: new Date().toISOString(),
      }));
    },
    []
  );

  const toggleChecklistItem = useCallback((checklistId: string, itemId: string) => {
    setState((prev) => {
      const currentMap = prev.checklistAnswers[checklistId] ?? {};
      const currentVal = currentMap[itemId] ?? false;
      return {
        ...prev,
        checklistAnswers: {
          ...prev.checklistAnswers,
          [checklistId]: {
            ...currentMap,
            [itemId]: !currentVal,
          },
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const saveExerciseAnswer = useCallback(
    (exerciseId: string, answer: string, profileBinding?: ProfileVariableKey) => {
      setState((prev) => ({
        ...prev,
        exerciseAnswers: {
          ...prev.exerciseAnswers,
          [exerciseId]: answer,
        },
        ...(profileBinding
          ? {
              profile: {
                ...prev.profile,
                [profileBinding]: answer,
              },
            }
          : {}),
        lastUpdated: new Date().toISOString(),
      }));
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
      setState((prev) => {
        const currentInputs = prev.customPromptInputs[blockId] ?? {};
        return {
          ...prev,
          customPromptInputs: {
            ...prev.customPromptInputs,
            [blockId]: {
              ...currentInputs,
              [fieldKey]: value,
            },
          },
          lastUpdated: new Date().toISOString(),
        };
      });
    },
    []
  );

  const resetPromptInputs = useCallback(
    (blockId: string, fieldKeysToClear?: ProfileVariableKey[]) => {
      setState((prev) => {
        const nextCustomPromptInputs = { ...prev.customPromptInputs };
        delete nextCustomPromptInputs[blockId];

        const nextProfile = { ...prev.profile };
        if (fieldKeysToClear && fieldKeysToClear.length > 0) {
          for (const key of fieldKeysToClear) {
            nextProfile[key] = '';
          }
        }

        return {
          ...prev,
          customPromptInputs: nextCustomPromptInputs,
          profile: nextProfile,
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
      getActiveStepIdForDay,
      getActiveStepForDay: getActiveStepIdForDay,
      navigateToHome,
      navigateToCourse,
      navigateToBonus,
      navigateToResources,
      navigateToPracticalSheets,
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
      navigateToPracticalSheets,
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
      exportBackup,
      importBackup,
      resetAllProgress,
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
