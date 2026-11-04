import { Check, ChevronLeft } from 'lucide-react';
import type { Course } from '../../types/course';
import { useProgress } from '../../hooks/useProgress';
import { ProgressGrid } from '../layout/ProgressGrid';
import {
  formatCourseDayRangeTitle,
  getCourseById,
  getCourseDays,
  resolveActiveCourseId,
} from '../../utils/courseNavigation';

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
    navigateToDay,
  } = useProgress();

  const activeDayNumber =
    state.activeRoute.kind === 'day'
      ? state.activeRoute.dayNumber
      : state.activeRoute.kind === 'course' && state.activeRoute.dayNumber
      ? state.activeRoute.dayNumber
      : 1;

  const handleGoHome = () => {
    navigateToHome();
    onAfterNavigate?.();
  };

  const handleSelectDay = (dayNumber: number) => {
    navigateToDay(dayNumber);
    onAfterNavigate?.();
  };

  const activeCourseId = resolveActiveCourseId(state.activeRoute) ?? 'module-01';
  const currentCourse = getCourseById(activeCourseId);
  const currentCourseDays = getCourseDays(course.days, activeCourseId);
  const dayRangeTitle = formatCourseDayRangeTitle(currentCourse?.dayRange);

  return (
    <aside
      aria-label="Navigation du cours"
      className="w-full h-full bg-pale-pink border-r-2 border-ink flex flex-col select-none overflow-x-hidden"
    >
      {/* 1. En-tête avec logo et retour Accueil */}
      <div className="p-4 bg-pale-pink border-b-2 border-ink space-y-2">
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
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-4 overflow-x-hidden">
        {/* 2. Barre de progression & Grille compacte des 9 leçons */}
        <section
          aria-label="Progression globale"
          className="p-3 bg-surface border-2 border-ink rounded-brutal-card shadow-brutal-xs space-y-2"
        >
          <div className="flex items-center justify-between gap-2 whitespace-nowrap">
            <span className="font-mono text-[10px] font-bold uppercase text-ink/75 tracking-wider">
              Votre progression
            </span>
            <span
              data-testid="sidebar-global-progress-label"
              className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-pale-pink border border-ink text-ink rounded-brutal-tag shrink-0"
            >
              {globalProgress.completedDaysCount} sur {globalProgress.totalDays} leçons
            </span>
          </div>

          <ProgressGrid
            completedDayNumbers={globalProgress.completedDayNumbers}
            activeDayNumber={activeDayNumber}
            onSelectDay={handleSelectDay}
          />
        </section>

        {/* 3. Section dynamique des leçons du module actif */}
        <section aria-label={dayRangeTitle} className="space-y-1.5">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink/75 px-1 block">
            {currentCourse ? `MODULE ${currentCourse.orderNumber} • ${dayRangeTitle}` : dayRangeTitle}
          </span>

          <div className="space-y-1.5">
            {currentCourseDays.map((day) => {
              const isActive = activeDayNumber === day.dayNumber;
              const dayProgress = getDayProgress(day.dayNumber);
              const isDone = dayProgress.isCompleted;

              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => handleSelectDay(day.dayNumber)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left px-2.5 sm:px-3 py-2 border-2 border-ink rounded-brutal-btn transition-all flex items-center justify-between gap-2 min-h-[40px] ${
                    isActive
                      ? 'bg-primary-red text-surface font-bold shadow-brutal-xs'
                      : isDone
                      ? 'bg-surface text-ink hover:bg-pale-pink/50'
                      : 'bg-surface text-ink hover:bg-cream'
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border border-ink rounded-brutal-tag shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-surface text-ink'
                          : isDone
                          ? 'bg-ink text-surface'
                          : 'bg-cream text-ink'
                      }`}
                    >
                      Leçon {day.dayNumber}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold uppercase leading-snug break-words">
                      {day.title}
                    </span>
                  </div>

                  <span
                    className={`w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0 border border-ink rounded-[3px] flex items-center justify-center ${
                      isDone
                        ? isActive
                          ? 'bg-surface text-primary-red'
                          : 'bg-primary-red text-surface'
                        : 'bg-cream'
                    }`}
                    aria-hidden="true"
                  >
                    {isDone && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />}
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
