import { Check, ChevronLeft, Compass, Calendar } from 'lucide-react';
import type { Course } from '../../types/course';
import { useProgress } from '../../hooks/useProgress';
import { ProgressGrid } from '../layout/ProgressGrid';

interface CourseSidebarProps {
  course: Course;
  onAfterNavigate?: () => void;
}

export function CourseSidebar({ course, onAfterNavigate }: CourseSidebarProps) {
  const {
    state,
    globalProgress,
    getDayProgress,
    navigateToHome,
    navigateToStartHere,
    navigateToDay,
    isStartHereCompleted,
  } = useProgress();

  const activeDayNumber =
    state.activeRoute.kind === 'day'
      ? state.activeRoute.dayNumber
      : state.activeRoute.kind === 'course' && state.activeRoute.dayNumber
      ? state.activeRoute.dayNumber
      : null;

  const isStartHereActive = (lessonId: string) => {
    if (state.activeRoute.kind === 'start-here') {
      return state.activeRoute.lessonId === lessonId;
    }
    if (state.activeRoute.kind === 'course') {
      return state.activeRoute.lessonId === lessonId;
    }
    return false;
  };

  const handleGoHome = () => {
    navigateToHome();
    onAfterNavigate?.();
  };

  const handleSelectStartHere = (lessonId: string) => {
    navigateToStartHere(lessonId);
    onAfterNavigate?.();
  };

  const handleSelectDay = (dayNumber: number) => {
    navigateToDay(dayNumber);
    onAfterNavigate?.();
  };

  // Les 15 leçons du premier cours (Jours 01 à 15)
  const course01Days = course.days.filter(
    (d) => d.dayNumber >= 1 && d.dayNumber <= 15
  );

  return (
    <aside
      aria-label="Navigation du cours en cours"
      className="w-full h-full bg-cream border-r-2 border-ink flex flex-col select-none"
    >
      {/* 1. En-tête avec logo et retour Accueil */}
      <div className="p-4 bg-surface border-b-2 border-ink space-y-2">
        <button
          type="button"
          onClick={handleGoHome}
          className="group inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ink/75 hover:text-primary-red transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
          <span>RETOUR À L&apos;ACCUEIL</span>
        </button>

        <h1 className="font-display text-2xl uppercase tracking-tight leading-none text-ink">
          AI CREATOR{' '}
          <span className="font-serif italic font-normal lowercase text-3xl text-primary-red">
            studio
          </span>
        </h1>
      </div>

      {/* Corps défilable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* 2. Barre de progression & Grille 5x5 */}
        <section
          aria-label="Progression globale"
          className="p-3.5 bg-surface border-2 border-ink rounded-brutal-card shadow-brutal-xs"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-mono text-xs font-bold uppercase text-ink">
              VOTRE PROGRESSION
            </span>
            <span
              data-testid="sidebar-global-progress-label"
              className="font-mono text-xs font-bold px-2 py-0.5 bg-pale-pink border border-ink text-ink rounded-brutal-tag"
            >
              {globalProgress.completedDaysCount} sur 25 jours
            </span>
          </div>

          {/* Barre de progression fluide */}
          <div className="w-full h-2 bg-cream border-2 border-ink mb-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-red transition-all duration-300"
              style={{ width: `${globalProgress.percentage}%` }}
            />
          </div>

          <ProgressGrid
            completedDayNumbers={globalProgress.completedDayNumbers}
            activeDayNumber={activeDayNumber}
            onSelectDay={handleSelectDay}
          />
        </section>

        {/* 3. Section COMMENCER ICI */}
        <section aria-label="Bien commencer" className="space-y-1.5">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-ink">
              <Compass className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
              COMMENCER ICI
            </span>
            <span className="font-mono text-[10px] font-bold text-ink/70">
              {state.completedStartHereIds.length}/2
            </span>
          </div>

          <div className="space-y-1.5">
            {course.startHere.map((lesson) => {
              const isActive = isStartHereActive(lesson.id);
              const isDone = isStartHereCompleted(lesson.id);

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => handleSelectStartHere(lesson.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left px-3 py-2 border-2 border-ink rounded-brutal-btn transition-all flex items-center justify-between gap-2 min-h-[40px] ${
                    isActive
                      ? 'bg-primary-red text-surface font-bold shadow-brutal-xs'
                      : isDone
                      ? 'bg-surface text-ink hover:bg-pale-pink/50'
                      : 'bg-surface text-ink hover:bg-cream'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border border-ink rounded-brutal-tag shrink-0 ${
                        isActive ? 'bg-surface text-ink' : 'bg-ink text-surface'
                      }`}
                    >
                      0{lesson.lessonNumber}
                    </span>
                    <span className="text-xs font-bold uppercase truncate">
                      {lesson.title}
                    </span>
                  </div>
                  <span
                    className={`w-5 h-5 shrink-0 border-2 border-ink rounded-brutal-tag flex items-center justify-center ${
                      isDone
                        ? isActive
                          ? 'bg-surface text-primary-red'
                          : 'bg-primary-red text-surface'
                        : 'bg-cream'
                    }`}
                    aria-hidden="true"
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Section JOURS 1 À 15 (Cours 01) */}
        <section aria-label="15 leçons du cours 01" className="space-y-1.5">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-ink">
              <Calendar className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
              JOURS 1 À 15 : COURS 01
            </span>
            <span className="font-mono text-[10px] font-bold text-ink/70">
              15 LEÇONS
            </span>
          </div>

          <div className="space-y-1.5">
            {course01Days.map((day) => {
              const isActive = activeDayNumber === day.dayNumber;
              const dayProgress = getDayProgress(day.dayNumber);
              const isDone = dayProgress.isCompleted;

              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => handleSelectDay(day.dayNumber)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left px-3 py-2 border-2 border-ink rounded-brutal-btn transition-all flex items-center justify-between gap-2 min-h-[42px] ${
                    isActive
                      ? 'bg-primary-red text-surface font-bold shadow-brutal-xs'
                      : isDone
                      ? 'bg-surface text-ink hover:bg-pale-pink/50'
                      : 'bg-surface text-ink hover:bg-cream'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border border-ink rounded-brutal-tag shrink-0 ${
                        isActive
                          ? 'bg-surface text-ink'
                          : isDone
                          ? 'bg-ink text-surface'
                          : 'bg-cream text-ink'
                      }`}
                    >
                      JOUR {day.dayNumber}
                    </span>
                    <span className="text-xs font-bold uppercase truncate">
                      {day.title}
                    </span>
                  </div>

                  <span
                    className={`w-5 h-5 shrink-0 border-2 border-ink rounded-brutal-tag flex items-center justify-center ${
                      isDone
                        ? isActive
                          ? 'bg-surface text-primary-red'
                          : 'bg-primary-red text-surface'
                        : 'bg-cream'
                    }`}
                    aria-hidden="true"
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
}
