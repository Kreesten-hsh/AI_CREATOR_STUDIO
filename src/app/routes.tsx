import { ArrowRight, CheckCircle2, Compass } from 'lucide-react';
import { COURSE_DATA } from '../data/course';
import { useProgress } from '../hooks/useProgress';
import { DayBanner } from '../components/layout/DayBanner';
import { StepTabs } from '../components/layout/StepTabs';
import { LessonRenderer } from '../components/course/LessonRenderer';
import { CompletionButton } from '../components/course/CompletionButton';
import { CourseHomePage } from '../components/home/CourseHomePage';
import { BonusView } from '../components/bonus/BonusView';
import { ResourcesView } from '../components/resources/ResourcesView';
import { ALL_STEP_TYPES, type Day, type StartHereLesson } from '../types/course';

function StartHereView({ lesson }: { lesson: StartHereLesson }) {
  const {
    isStartHereCompleted,
    toggleStartHereComplete,
    navigateToStartHere,
    navigateToDay,
  } = useProgress();

  const isCompleted = isStartHereCompleted(lesson.id);

  const handleComplete = () => {
    if (!isCompleted) {
      toggleStartHereComplete(lesson.id);
    }
    if (lesson.id === 'introduction') {
      navigateToStartHere('setup');
    } else {
      navigateToDay(1, 'concept');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Start Here Banner */}
      <header className="brutal-card rounded-brutal-card overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-3 bg-checkerboard-pink p-6 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-ink min-h-[160px]">
            <div className="bg-surface border-2 border-ink shadow-brutal px-5 py-4 text-center -rotate-2 rounded-brutal-tag">
              <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ink/75">
                BIEN COMMENCER
              </span>
              <span className="block font-serif text-5xl leading-none text-ink my-1">
                0{lesson.lessonNumber}
              </span>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary-red">
                ORIENTATION
              </span>
            </div>
          </div>

          <div className="md:col-span-8 lg:col-span-9 bg-surface text-ink p-6 md:p-8 flex flex-col justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-red text-surface border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase">
                  <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                  {lesson.subtitle}
                </span>
                <span className="px-2.5 py-1 bg-cream border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase">
                  HORS PARCOURS PRINCIPAL
                </span>
                {isCompleted && (
                  <span className="px-2.5 py-1 bg-ink text-surface border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase">
                    TERMINÉ
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight leading-tight">
                {lesson.italicTitleWord &&
                lesson.title.toUpperCase().endsWith(lesson.italicTitleWord.toUpperCase())
                  ? lesson.title
                      .slice(0, lesson.title.length - lesson.italicTitleWord.length)
                      .trim()
                  : lesson.title}{' '}
                {lesson.italicTitleWord && (
                  <span className="font-serif italic font-normal lowercase text-3xl sm:text-4xl lg:text-5xl text-primary-red">
                    {lesson.italicTitleWord}
                  </span>
                )}
              </h2>

              <p className="mt-2.5 text-sm md:text-base text-ink/85 max-w-3xl leading-relaxed">
                {lesson.objective}
              </p>
            </div>
          </div>
        </div>
      </header>

      <LessonRenderer blocks={lesson.blocks} />

      <div className="brutal-card rounded-brutal-card p-5 md:p-6 bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-bold uppercase px-2 py-0.5 bg-cream border border-ink rounded-brutal-tag">
            {isCompleted ? 'ORIENTATION VALIDÉE' : 'ÉTAPE D\'ORIENTATION'}
          </span>
          <p className="font-display text-base md:text-lg uppercase mt-1.5">
            {lesson.id === 'introduction'
              ? 'Étape suivante : Configurer votre profil et sélecteur d\'identité'
              : 'Étape suivante : Entrer dans le Module 1 : Leçon 01 (Offre et Fondations de l\'IA)'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleComplete}
          className="brutal-btn rounded-brutal-btn bg-primary-red text-surface hover:bg-dark-red px-5 py-3 min-h-[48px] font-mono text-xs md:text-sm font-bold uppercase inline-flex items-center justify-center gap-2 shrink-0"
        >
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
          <span>
            {lesson.id === 'introduction'
              ? 'Valider le briefing et passer à la configuration'
              : 'Enregistrer la configuration et commencer la Leçon 01'}
          </span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

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
    if (route.lessonId) {
      const lesson =
        COURSE_DATA.startHere.find((l) => l.id === route.lessonId) ??
        COURSE_DATA.startHere[0];
      return <StartHereView lesson={lesson} />;
    }
    const dayNumber = route.dayNumber ?? 1;
    const day =
      COURSE_DATA.days.find((d) => d.dayNumber === dayNumber) ??
      COURSE_DATA.days[0];
    return <DayWorkspaceView day={day} />;
  }

  if (route.kind === 'start-here') {
    const lesson =
      COURSE_DATA.startHere.find((l) => l.id === route.lessonId) ??
      COURSE_DATA.startHere[0];
    return <StartHereView lesson={lesson} />;
  }

  const day =
    COURSE_DATA.days.find((d) => d.dayNumber === route.dayNumber) ??
    COURSE_DATA.days[0];

  return <DayWorkspaceView day={day} />;
}
