import { Home, BookOpen } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { MAIN_COURSES } from '../../data/navigation/mainCourses';
import { BONUSES } from '../../data/navigation/bonuses';

interface MainSidebarProps {
  onAfterNavigate?: () => void;
}

export function MainSidebar({ onAfterNavigate }: MainSidebarProps) {
  const {
    state,
    navigateToHome,
    navigateToCourse,
    navigateToBonus,
    navigateToResources,
  } = useProgress();

  const isHomeActive = state.activeRoute.kind === 'home';
  const isResourcesActive = state.activeRoute.kind === 'resources';

  const getActiveCourseId = (): string | null => {
    if (state.activeRoute.kind === 'course') return state.activeRoute.courseId;
    if (state.activeRoute.kind === 'day' || state.activeRoute.kind === 'start-here') {
      return 'course-01';
    }
    return null;
  };

  const getActiveBonusId = (): string | null => {
    if (state.activeRoute.kind === 'bonus') return state.activeRoute.bonusId;
    return null;
  };

  const activeCourseId = getActiveCourseId();
  const activeBonusId = getActiveBonusId();

  const handleGoHome = () => {
    navigateToHome();
    onAfterNavigate?.();
  };

  const handleSelectCourse = (courseId: string) => {
    navigateToCourse(courseId, 1);
    onAfterNavigate?.();
  };

  const handleSelectBonus = (bonusId: string) => {
    navigateToBonus(bonusId);
    onAfterNavigate?.();
  };

  const handleSelectResources = () => {
    navigateToResources();
    onAfterNavigate?.();
  };

  return (
    <aside
      aria-label="Navigation principale de la formation"
      className="w-full h-full bg-pale-pink border-r-2 border-ink flex flex-col select-none overflow-x-hidden"
    >
      {/* 1. Logo épuré : AI CREATOR Studio */}
      <div className="p-4 bg-pale-pink border-b-2 border-ink">
        <button
          type="button"
          onClick={handleGoHome}
          className="text-left w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red"
        >
          <h1 className="font-display text-2xl uppercase tracking-tight leading-none text-ink group-hover:text-primary-red transition-colors">
            AI CREATOR{' '}
            <span className="font-serif italic font-normal lowercase text-3xl text-primary-red">
              studio
            </span>
          </h1>
        </button>
      </div>

      {/* Corps de navigation défilable */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-5 overflow-x-hidden">
        {/* 2. Accueil direct sans titre redondant */}
        <div>
          <button
            type="button"
            onClick={handleGoHome}
            aria-current={isHomeActive ? 'page' : undefined}
            className={`w-full text-left px-3 py-2 border-2 border-ink rounded-brutal-btn transition-all flex items-center gap-2.5 min-h-[40px] ${
              isHomeActive
                ? 'bg-primary-red text-surface font-bold shadow-brutal-xs'
                : 'bg-surface text-ink hover:bg-pale-pink/50'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="font-mono text-xs uppercase font-bold tracking-wide">
              Accueil
            </span>
          </button>
        </div>

        {/* 3. Section VOS FORMATIONS */}
        <div className="space-y-1.5">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink/75 block px-1">
            VOS FORMATIONS
          </span>

          <div className="space-y-1.5">
            {MAIN_COURSES.map((course) => {
              const isActive = activeCourseId === course.id;
              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => handleSelectCourse(course.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left px-3 py-2 border-2 border-ink rounded-brutal-btn transition-all flex items-center justify-between gap-2 min-h-[40px] ${
                    isActive
                      ? 'bg-primary-red text-surface font-bold shadow-brutal-xs'
                      : 'bg-surface text-ink hover:bg-pale-pink/40'
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border border-ink rounded-brutal-tag shrink-0 mt-0.5 ${
                        isActive ? 'bg-surface text-ink' : 'bg-cream text-ink'
                      }`}
                    >
                      {course.orderNumber}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-tight leading-snug break-words">
                      {course.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Section BONUS */}
        <div className="space-y-1.5">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink/75 block px-1">
            BONUS
          </span>

          <div className="space-y-1.5">
            {BONUSES.map((bonus) => {
              const isActive = activeBonusId === bonus.id;
              return (
                <button
                  key={bonus.id}
                  type="button"
                  onClick={() => handleSelectBonus(bonus.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left px-3 py-2 border-2 border-ink rounded-brutal-btn transition-all flex items-center justify-between gap-2 min-h-[40px] ${
                    isActive
                      ? 'bg-primary-red text-surface font-bold shadow-brutal-xs'
                      : 'bg-surface text-ink hover:bg-pale-pink/40'
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border border-ink rounded-brutal-tag shrink-0 mt-0.5 ${
                        isActive ? 'bg-surface text-ink' : 'bg-pale-pink text-ink'
                      }`}
                    >
                      {bonus.orderNumber.replace('Bonus ', 'B')}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-tight leading-snug break-words">
                      {bonus.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Section RESSOURCES */}
        <div className="space-y-1.5">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink/75 block px-1">
            RESSOURCES
          </span>
          <button
            type="button"
            onClick={handleSelectResources}
            aria-current={isResourcesActive ? 'page' : undefined}
            className={`w-full text-left px-3 py-2 border-2 border-ink rounded-brutal-btn transition-all flex items-center gap-2.5 min-h-[40px] ${
              isResourcesActive
                ? 'bg-primary-red text-surface font-bold shadow-brutal-xs'
                : 'bg-surface text-ink hover:bg-pale-pink/40'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0 text-primary-red" aria-hidden="true" />
            <span className="font-mono text-xs uppercase font-bold tracking-wide">
              Ressources et fiches pratiques
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
