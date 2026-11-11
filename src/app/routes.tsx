import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Construction } from 'lucide-react';
import { ALL_LESSONS } from '../data/course';
import { useProgress } from '../hooks/useProgress';
import { DayHeader } from '../components/layout/DayHeader';
import { StepTabs } from '../components/layout/StepTabs';
import { LessonRenderer } from '../components/course/LessonRenderer';
import { CompletionButton } from '../components/course/CompletionButton';
import { HelpPanel } from '../components/widgets/HelpPanel';
import { CourseHomePage } from '../components/home/CourseHomePage';
import { BonusView } from '../components/bonus/BonusView';
import type { Lesson } from '../types/course';
import {
  getCourseById,
  getDayById,
  getLessonById,
  getLessonByNumber,
} from '../utils/courseNavigation';

function scrollViewportToTop(shouldReduceMotion: boolean): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
  if (navigator.userAgent?.includes('jsdom')) return;
  window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
}

function LessonWorkspaceView({ lesson }: { lesson: Lesson }) {
  const day = getDayById(lesson.dayId);
  const sprint = getCourseById(lesson.moduleId);
  const {
    getLessonProgress,
    getActiveStepIdForLesson,
    setActiveStepIdForLesson,
    completeStep,
    navigateToLesson,
    navigateToHome,
  } = useProgress();

  const progress = getLessonProgress(lesson.id);
  const activeStepId = getActiveStepIdForLesson(lesson.id);
  const activeStep =
    lesson.steps.find((step) => step.id === activeStepId) ?? lesson.steps[0];
  const activeStepIdx = activeStep
    ? lesson.steps.findIndex((step) => step.id === activeStep.id)
    : -1;
  const isLastStepOfLesson =
    activeStepIdx >= 0 && activeStepIdx === lesson.steps.length - 1;
  const isActiveStepCompleted = activeStep
    ? progress.completedStepIds.includes(activeStep.id)
    : false;
  const nextLesson = getLessonByNumber(lesson.lessonNumber + 1);
  const paddedLesson = String(lesson.lessonNumber).padStart(2, '0');
  const shouldReduceMotion = Boolean(useReducedMotion());
  const hasMountedRef = useRef(false);

  useEffect(() => {
    hasMountedRef.current = true;
  }, []);

  const navigateAfterLessonEnd = () => {
    if (nextLesson) {
      navigateToLesson(nextLesson.id, nextLesson.steps[0]?.id);
    } else {
      navigateToHome();
    }
    scrollViewportToTop(shouldReduceMotion);
  };

  const handleCompletionAction = () => {
    if (!activeStep) return;

    if (!isLastStepOfLesson) {
      completeStep(lesson.id, activeStep.id, true);
      scrollViewportToTop(shouldReduceMotion);
      return;
    }

    if (isActiveStepCompleted) {
      navigateAfterLessonEnd();
      return;
    }

    const { triggeredModuleCompletion } = completeStep(lesson.id, activeStep.id, true);
    if (!triggeredModuleCompletion) {
      navigateAfterLessonEnd();
    }
  };

  if (lesson.isSkeletonPlaceholder && lesson.steps.length === 0) {
    return (
      <div className="space-y-6">
        <DayHeader lesson={lesson} day={day} sprint={sprint} progress={progress} />

        <section
          aria-label={`Contenu de la Leçon ${paddedLesson}`}
          className="brutal-card rounded-brutal-card bg-surface p-8 sm:p-12 border-2 border-ink shadow-brutal text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-pale-pink border-2 border-ink rounded-brutal-btn shadow-brutal-xs">
            <Construction className="w-7 h-7 text-primary-red" aria-hidden="true" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="font-display text-xl uppercase tracking-tight text-ink">
              Cette leçon est en cours de reconstruction.
            </h3>
            <p className="font-serif text-sm text-ink leading-relaxed">
              Le contenu pédagogique et les exercices pratiques de cette leçon seront définis dans la prochaine phase.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DayHeader lesson={lesson} day={day} sprint={sprint} progress={progress} />

      {lesson.steps.length > 0 && activeStep && (
        <>
          <StepTabs
            steps={lesson.steps}
            activeStepId={activeStep.id}
            completedStepIds={progress.completedStepIds}
            onSelectStep={(stepId) => setActiveStepIdForLesson(lesson.id, stepId)}
          />

          <motion.div
            key={activeStep.id}
            role="tabpanel"
            id={`step-panel-${activeStep.id}`}
            aria-labelledby={`step-tab-${activeStep.id}`}
            initial={
              hasMountedRef.current
                ? shouldReduceMotion
                  ? { opacity: 0.9 }
                  : { opacity: 0, y: 6 }
                : false
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.18, ease: 'easeOut' }}
            className="space-y-6"
          >
            <LessonRenderer blocks={activeStep.blocks} />

            <HelpPanel help={activeStep.help} stepTitle={activeStep.title} defaultOpen={false} />

            <CompletionButton
              stepKey={activeStep.id}
              isCompleted={isActiveStepCompleted}
              label={activeStep.completionLabel || 'Valider cette étape'}
              onComplete={handleCompletionAction}
            />
          </motion.div>
        </>
      )}
    </div>
  );
}

export function CourseWorkspaceRouter() {
  const { state } = useProgress();
  const route = state.activeRoute;
  const shouldReduceMotion = Boolean(useReducedMotion());
  const hasMountedRef = useRef(false);

  useEffect(() => {
    hasMountedRef.current = true;
  }, []);

  const routeKey =
    route.kind === 'home'
      ? 'route:home'
      : route.kind === 'bonus'
      ? `route:bonus:${route.bonusId}`
      : `route:lesson:${route.lessonId}`;

  let content = null;
  if (route.kind === 'home') {
    content = <CourseHomePage />;
  } else if (route.kind === 'bonus') {
    content = <BonusView bonusId={route.bonusId} />;
  } else {
    const lesson = getLessonById(route.lessonId) ?? ALL_LESSONS[0];
    content = <LessonWorkspaceView lesson={lesson} />;
  }

  return (
    <motion.div
      key={routeKey}
      initial={
        hasMountedRef.current
          ? shouldReduceMotion
            ? { opacity: 0.92 }
            : { opacity: 0, y: 6 }
          : false
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.18, ease: 'easeOut' }}
    >
      {content}
    </motion.div>
  );
}
