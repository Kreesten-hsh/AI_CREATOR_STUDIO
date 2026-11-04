import { ArrowRight } from 'lucide-react';
import { COURSE_DATA } from '../data/course';
import { useProgress } from '../hooks/useProgress';
import { DayBanner } from '../components/layout/DayBanner';
import { StepTabs } from '../components/layout/StepTabs';
import { LessonRenderer } from '../components/course/LessonRenderer';
import { CompletionButton } from '../components/course/CompletionButton';
import { CourseHomePage } from '../components/home/CourseHomePage';
import { BonusView } from '../components/bonus/BonusView';
import { ResourcesView } from '../components/resources/ResourcesView';
import { ALL_STEP_TYPES, type Day } from '../types/course';
import { getCourseById } from '../utils/courseNavigation';

function DayWorkspaceView({ day }: { day: Day }) {
  const {
    state,
    getDayProgress,
    getActiveStepForDay,
    setActiveStepForDay,
    completeStep,
    navigateToDay,
  } = useProgress();

  const sprint = COURSE_DATA.sprints.find((s) => s.id === day.sprintId);
  const progress = getDayProgress(day.dayNumber);
  const activeStepType = getActiveStepForDay(day.dayNumber);
  const completedSteps = state.completedStepsByDay[day.dayNumber] ?? [];

  const activeStepObj =
    day.steps.find((s) => s.type === activeStepType) ?? day.steps[0];
  const isCurrentStepCompleted = completedSteps.includes(activeStepObj.type);
  const isSkeletonStepWithoutContent =
    day.isSkeletonPlaceholder && (!activeStepObj.blocks || activeStepObj.blocks.length === 0);

  const handleCompleteCurrentStep = () => {
    const currentIdx = ALL_STEP_TYPES.indexOf(activeStepObj.type);
    const isLastStepOfDay = currentIdx === ALL_STEP_TYPES.length - 1;

    completeStep(day.dayNumber, activeStepObj.type, !isLastStepOfDay);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <DayBanner day={day} sprint={sprint} progress={progress} />

      <StepTabs
        steps={day.steps}
        activeStep={activeStepObj.type}
        completedSteps={completedSteps}
        onSelectStep={(step) => setActiveStepForDay(day.dayNumber, step)}
      />

      <div
        role="tabpanel"
        id={`step-panel-${activeStepObj.type}`}
        aria-labelledby={`step-tab-${activeStepObj.type}`}
        className="space-y-6"
      >
        <LessonRenderer blocks={activeStepObj.blocks} />

        {!isSkeletonStepWithoutContent && (
          <CompletionButton
            isCompleted={isCurrentStepCompleted}
            label={activeStepObj.completionLabel}
            nextLabel={
              activeStepObj.number < 4
                ? `Étape ${activeStepObj.number} validée : Passer à l'étape ${
                    activeStepObj.number + 1
                  }`
                : `Leçon ${String(day.dayNumber).padStart(2, '0')} terminée !`
            }
            onComplete={handleCompleteCurrentStep}
          />
        )}

        {progress.isCompleted && day.dayNumber < 25 && (
          <div className="brutal-card rounded-brutal-card p-5 bg-primary-red text-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase px-2 py-0.5 bg-surface text-ink border border-ink rounded-brutal-tag">
                4 ÉTAPES VALIDÉES
              </span>
              <p className="font-display text-lg uppercase mt-1">
                La Leçon {String(day.dayNumber).padStart(2, '0')} est validée et enregistrée dans votre parcours !
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigateToDay(day.dayNumber + 1, 'concept');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="brutal-btn rounded-brutal-btn bg-surface text-ink hover:bg-pale-pink px-4 py-2.5 min-h-[44px] font-mono text-xs font-bold uppercase inline-flex items-center gap-2 shrink-0"
            >
              <span>Passer à la Leçon {String(day.dayNumber + 1).padStart(2, '0')}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
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

  if (route.kind === 'resources') {
    return <ResourcesView />;
  }

  if (route.kind === 'course') {
    const course = getCourseById(route.courseId);
    const startDay = course?.dayRange?.[0] ?? 1;
    const endDay = course?.dayRange?.[1] ?? 15;
    let dayNumber = route.dayNumber ?? startDay;
    if (dayNumber < startDay || dayNumber > endDay) {
      dayNumber = startDay;
    }
    const day =
      COURSE_DATA.days.find((d) => d.dayNumber === dayNumber) ??
      COURSE_DATA.days[0];
    return <DayWorkspaceView day={day} />;
  }

  if (route.kind === 'start-here') {
    const day = COURSE_DATA.days[0];
    return <DayWorkspaceView day={day} />;
  }

  const day =
    COURSE_DATA.days.find((d) => d.dayNumber === route.dayNumber) ??
    COURSE_DATA.days[0];

  return <DayWorkspaceView day={day} />;
}
