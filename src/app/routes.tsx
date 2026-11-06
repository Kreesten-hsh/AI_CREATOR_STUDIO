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
} from '../utils/courseNavigation';

function LessonWorkspaceView({ lesson }: { lesson: Lesson }) {
  const day = getDayById(lesson.dayId);
  const sprint = getCourseById(lesson.moduleId);
  const {
    getLessonProgress,
    getActiveStepIdForLesson,
    setActiveStepIdForLesson,
    completeStep,
  } = useProgress();

  const progress = getLessonProgress(lesson.id);
  const activeStepId = getActiveStepIdForLesson(lesson.id);
  const activeStep =
    lesson.steps.find((step) => step.id === activeStepId) ?? lesson.steps[0];
  const paddedLesson = String(lesson.lessonNumber).padStart(2, '0');

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
            <p className="font-serif text-sm text-ink/75 leading-relaxed">
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

          <div
            role="tabpanel"
            id={`step-panel-${activeStep.id}`}
            aria-labelledby={`step-tab-${activeStep.id}`}
            className="space-y-6"
          >
            <LessonRenderer blocks={activeStep.blocks} />

            <HelpPanel help={activeStep.help} stepTitle={activeStep.title} />

            <CompletionButton
              isCompleted={progress.completedStepIds.includes(activeStep.id)}
              label={activeStep.completionLabel || 'Valider cette étape'}
              onComplete={() => completeStep(lesson.id, activeStep.id)}
            />
          </div>
        </>
      )}
    </div>
  );
}

export function CourseWorkspaceRouter() {
  const { state } = useProgress();
  const route = state.activeRoute;

  if (route.kind === 'home') {
    return <CourseHomePage />;
  }

  if (route.kind === 'bonus') {
    return <BonusView bonusId={route.bonusId} />;
  }

  const lesson = getLessonById(route.lessonId) ?? ALL_LESSONS[0];
  return <LessonWorkspaceView lesson={lesson} />;
}
