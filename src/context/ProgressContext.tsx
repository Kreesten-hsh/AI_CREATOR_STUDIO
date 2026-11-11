import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  Lesson,
  LessonId,
  ProfileVariableKey,
  QuizAttemptState,
  StudentProgress,
  VibeSelection,
} from '../types/course';
import {
  calculateDayProgress,
  calculateGlobalProgress,
  calculateLessonProgress,
  calculateModuleProgress,
  normalizeStepIdList,
  TOTAL_COURSE_DAYS,
  TOTAL_COURSE_LESSONS,
  type DayProgressResult,
  type GlobalProgressResult,
  type LessonProgressResult,
  type ModuleProgressResult,
} from '../utils/progressCalculator';
import {
  createInitialProgress,
  exportProgressJson,
  importProgressJson,
  loadProgressFromStorage,
  saveProgressToStorage,
} from '../utils/storage';
import {
  getCourseById,
  getDayById,
  getDayByNumber,
  getLessonById,
  getLessonByNumber,
} from '../utils/courseNavigation';
import { ALL_DAYS, ALL_LESSONS } from '../data/course';
import { COURSE_MODULES } from '../data/sprints';

function resolveLessonEntity(lessonIdOrNumber: string | number): Lesson | undefined {
  if (typeof lessonIdOrNumber === 'number') {
    const clamped = Math.max(1, Math.min(TOTAL_COURSE_LESSONS, lessonIdOrNumber));
    return getLessonByNumber(clamped);
  }
  return getLessonById(lessonIdOrNumber);
}

export interface ModuleCompletionEvent {
  id: number;
  moduleId: string;
}

export interface CompleteStepResult {
  triggeredModuleCompletion: boolean;
}

export interface ProgressContextValue {
  state: StudentProgress;
  globalProgress: GlobalProgressResult;
  moduleCompletionEvent: ModuleCompletionEvent | null;
  dismissModuleCompletion: () => void;
  getLessonProgress: (lessonIdOrNumber: string | number) => LessonProgressResult;
  getDayProgress: (dayNumberOrId: number | string) => DayProgressResult;
  getModuleProgress: (moduleId: string) => ModuleProgressResult;
  getActiveStepIdForLesson: (lessonIdOrNumber: string | number) => string;
  navigateToHome: () => void;
  navigateToLesson: (lessonIdOrNumber: string | number, stepId?: string) => void;
  navigateToDay: (dayNumber: number, lessonId?: LessonId) => void;
  navigateToCourse: (courseId: string, lessonIdOrNumber?: string | number) => void;
  navigateToBonus: (bonusId: string) => void;
  setActiveStepIdForLesson: (lessonIdOrNumber: string | number, stepId: string) => void;
  completeStep: (
    lessonIdOrNumber: string | number,
    stepId: string,
    advanceToNext?: boolean,
    explicitNextStepId?: string
  ) => CompleteStepResult;
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
  const [moduleCompletionEvent, setModuleCompletionEvent] =
    useState<ModuleCompletionEvent | null>(null);
  const completedStepsRef = useRef<Record<string, string[]>>(state.completedStepIdsByLesson);
  const eventCounterRef = useRef(0);

  useEffect(() => {
    completedStepsRef.current = state.completedStepIdsByLesson;
    saveProgressToStorage(state);
  }, [state]);

  const globalProgress = useMemo<GlobalProgressResult>(() => {
    return calculateGlobalProgress(state.completedStepIdsByLesson, ALL_DAYS, COURSE_MODULES);
  }, [state.completedStepIdsByLesson]);

  const getLessonProgress = useCallback(
    (lessonIdOrNumber: string | number): LessonProgressResult => {
      const lesson =
        typeof lessonIdOrNumber === 'number'
          ? getLessonByNumber(lessonIdOrNumber)
          : getLessonById(lessonIdOrNumber);
      if (!lesson) {
        return {
          completedStepIds: [],
          completedCount: 0,
          totalSteps: 0,
          total: 0,
          percentage: 0,
          isCompleted: false,
        };
      }
      return calculateLessonProgress(state.completedStepIdsByLesson[lesson.id], lesson.steps);
    },
    [state.completedStepIdsByLesson]
  );

  const getDayProgress = useCallback(
    (dayNumberOrId: number | string): DayProgressResult => {
      const day =
        typeof dayNumberOrId === 'number'
          ? getDayByNumber(dayNumberOrId)
          : getDayById(dayNumberOrId);
      return calculateDayProgress(day, state.completedStepIdsByLesson);
    },
    [state.completedStepIdsByLesson]
  );

  const getModuleProgress = useCallback(
    (moduleId: string): ModuleProgressResult => {
      const mod = getCourseById(moduleId);
      return calculateModuleProgress(mod, ALL_DAYS, state.completedStepIdsByLesson);
    },
    [state.completedStepIdsByLesson]
  );

  const getActiveStepIdForLesson = useCallback(
    (lessonIdOrNumber: string | number): string => {
      const lesson = resolveLessonEntity(lessonIdOrNumber);
      if (!lesson) return '';
      const explicit = state.activeStepIdByLesson[lesson.id];
      if (explicit && lesson.steps.some((s) => s.id === explicit)) {
        return explicit;
      }
      return lesson.steps[0]?.id ?? '';
    },
    [state.activeStepIdByLesson]
  );

  const navigateToHome = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeRoute: { kind: 'home' },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const navigateToLesson = useCallback(
    (lessonIdOrNumber: string | number, stepId?: string) => {
      setState((prev) => {
        const lesson = resolveLessonEntity(lessonIdOrNumber) ?? ALL_LESSONS[0];
        const nextStepId =
          stepId ?? prev.activeStepIdByLesson[lesson.id] ?? lesson.steps[0]?.id ?? '';

        return {
          ...prev,
          activeRoute: { kind: 'lesson', lessonId: lesson.id },
          activeStepIdByLesson: nextStepId
            ? {
                ...prev.activeStepIdByLesson,
                [lesson.id]: nextStepId,
              }
            : prev.activeStepIdByLesson,
          lastUpdated: new Date().toISOString(),
        };
      });
    },
    []
  );

  const navigateToDay = useCallback((dayNumber: number, explicitLessonId?: LessonId) => {
    setState((prev) => {
      const safeDayNum = Math.max(1, Math.min(TOTAL_COURSE_DAYS, dayNumber));
      const day = getDayByNumber(safeDayNum) ?? ALL_DAYS[0];
      const targetLesson =
        (explicitLessonId
          ? day.lessons.find((l) => l.id === explicitLessonId)
          : undefined) ??
        day.lessons[0] ??
        ALL_LESSONS[0];

      const activeStepId =
        prev.activeStepIdByLesson[targetLesson.id] ?? targetLesson.steps[0]?.id ?? '';

      return {
        ...prev,
        activeRoute: { kind: 'lesson', lessonId: targetLesson.id },
        activeStepIdByLesson: activeStepId
          ? {
              ...prev.activeStepIdByLesson,
              [targetLesson.id]: activeStepId,
            }
          : prev.activeStepIdByLesson,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const navigateToCourse = useCallback(
    (courseId: string, lessonIdOrNumber?: string | number) => {
      setState((prev) => {
        const course = getCourseById(courseId) ?? COURSE_MODULES[0];
        let targetLesson: Lesson | undefined;

        if (lessonIdOrNumber !== undefined) {
          const candidate =
            typeof lessonIdOrNumber === 'number'
              ? getLessonByNumber(lessonIdOrNumber)
              : getLessonById(lessonIdOrNumber);
          if (candidate && candidate.moduleId === course.id) {
            targetLesson = candidate;
          }
        }

        if (!targetLesson) {
          targetLesson = getLessonById(course.lessonIds[0]) ?? ALL_LESSONS[0];
        }

        const activeStepId =
          prev.activeStepIdByLesson[targetLesson.id] ?? targetLesson.steps[0]?.id ?? '';

        return {
          ...prev,
          activeRoute: {
            kind: 'lesson',
            lessonId: targetLesson.id,
          },
          activeStepIdByLesson: activeStepId
            ? {
                ...prev.activeStepIdByLesson,
                [targetLesson.id]: activeStepId,
              }
            : prev.activeStepIdByLesson,
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

  const setActiveStepIdForLesson = useCallback(
    (lessonIdOrNumber: string | number, stepId: string) => {
      setState((prev) => {
        const lesson = resolveLessonEntity(lessonIdOrNumber);
        if (!lesson) return prev;
        return {
          ...prev,
          activeStepIdByLesson: {
            ...prev.activeStepIdByLesson,
            [lesson.id]: stepId,
          },
          lastUpdated: new Date().toISOString(),
        };
      });
    },
    []
  );

  const dismissModuleCompletion = useCallback(() => {
    setModuleCompletionEvent(null);
  }, []);

  const completeStep = useCallback(
    (
      lessonIdOrNumber: string | number,
      stepId: string,
      advanceToNext = true,
      explicitNextStepId?: string
    ): CompleteStepResult => {
      let triggeredModuleCompletion = false;
      const targetLesson = resolveLessonEntity(lessonIdOrNumber);
      if (targetLesson) {
        const currentCompletedMap = completedStepsRef.current;
        const existingLessonSteps = currentCompletedMap[targetLesson.id] ?? [];

        if (!existingLessonSteps.includes(stepId)) {
          const updatedLessonSteps = normalizeStepIdList([...existingLessonSteps, stepId]);
          const nextCompletedMap: Record<string, string[]> = {
            ...currentCompletedMap,
            [targetLesson.id]: updatedLessonSteps,
          };
          completedStepsRef.current = nextCompletedMap;

          for (const mod of COURSE_MODULES) {
            const before = calculateModuleProgress(mod, ALL_DAYS, currentCompletedMap);
            const after = calculateModuleProgress(mod, ALL_DAYS, nextCompletedMap);
            if (!before.isCompleted && after.isCompleted) {
              eventCounterRef.current += 1;
              triggeredModuleCompletion = true;
              setModuleCompletionEvent({
                id: eventCounterRef.current,
                moduleId: mod.id,
              });
              break;
            }
          }
        }
      }

      setState((prev) => {
        const lesson = resolveLessonEntity(lessonIdOrNumber);
        if (!lesson) return prev;

        const existingSteps = prev.completedStepIdsByLesson[lesson.id] ?? [];
        const updatedSteps = normalizeStepIdList([...existingSteps, stepId]);

        let nextStepId: string = stepId;
        if (advanceToNext) {
          if (explicitNextStepId) {
            nextStepId = explicitNextStepId;
          } else {
            const currentIdx = lesson.steps.findIndex((s) => s.id === stepId);
            if (currentIdx >= 0 && currentIdx < lesson.steps.length - 1) {
              nextStepId = lesson.steps[currentIdx + 1].id;
            }
          }
        }

        return {
          ...prev,
          completedStepIdsByLesson: {
            ...prev.completedStepIdsByLesson,
            [lesson.id]: updatedSteps,
          },
          activeStepIdByLesson: {
            ...prev.activeStepIdByLesson,
            [lesson.id]: nextStepId,
          },
          lastUpdated: new Date().toISOString(),
        };
      });

      return { triggeredModuleCompletion };
    },
    []
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
    completedStepsRef.current = imported.completedStepIdsByLesson;
    setModuleCompletionEvent(null);
    setState(imported);
    return true;
  }, []);

  const resetAllProgress = useCallback(() => {
    const fresh = createInitialProgress();
    completedStepsRef.current = fresh.completedStepIdsByLesson;
    setModuleCompletionEvent(null);
    setState(fresh);
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      globalProgress,
      moduleCompletionEvent,
      dismissModuleCompletion,
      getLessonProgress,
      getDayProgress,
      getModuleProgress,
      getActiveStepIdForLesson,
      navigateToHome,
      navigateToLesson,
      navigateToDay,
      navigateToCourse,
      navigateToBonus,
      setActiveStepIdForLesson,
      completeStep,
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
      moduleCompletionEvent,
      dismissModuleCompletion,
      getLessonProgress,
      getDayProgress,
      getModuleProgress,
      getActiveStepIdForLesson,
      navigateToHome,
      navigateToLesson,
      navigateToDay,
      navigateToCourse,
      navigateToBonus,
      setActiveStepIdForLesson,
      completeStep,
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
