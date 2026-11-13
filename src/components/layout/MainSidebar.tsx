import type { ReactNode } from 'react';
import { Check, Gift, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../hooks/useProgress';
import { MAIN_COURSES } from '../../data/navigation/mainCourses';
import { BONUSES } from '../../data/navigation/bonuses';
import { resolveActiveCourseId } from '../../utils/courseNavigation';

interface MainSidebarProps {
  onAfterNavigate?: () => void;
  mobileCloseButton?: ReactNode;
}

export function MainSidebar({
  onAfterNavigate,
  mobileCloseButton,
}: MainSidebarProps) {
  const { buyerEmail } = useAuth();
  const {
    state,
    navigateToHome,
    navigateToCourse,
    navigateToBonus,
    getModuleProgress,
  } = useProgress();

  const isHomeActive = state.activeRoute.kind === 'home';

  const activeCourseId = resolveActiveCourseId(state.activeRoute);
  const activeBonusId =
    state.activeRoute.kind === 'bonus' ? state.activeRoute.bonusId : null;

  const handleGoHome = () => {
    navigateToHome();
    onAfterNavigate?.();
  };

  const handleSelectCourse = (courseId: string) => {
    navigateToCourse(courseId);
    onAfterNavigate?.();
  };

  const handleSelectBonus = (bonusId: string) => {
    navigateToBonus(bonusId);
    onAfterNavigate?.();
  };

  return (
    <aside
      aria-label="Navigation principale de la formation"
      className="w-full h-full bg-pale-pink border-r-2 border-ink flex flex-col select-none overflow-x-hidden"
    >
      {/* 1. Logo épuré : AI CREATOR Studio */}
      <div className="p-4 bg-pale-pink border-b-2 border-ink flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleGoHome}
          className="text-left min-w-0 flex-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red"
        >
          <h1
            className={`font-display uppercase tracking-tight leading-none text-ink group-hover:text-primary-red transition-colors ${
              mobileCloseButton ? 'text-xl min-[360px]:text-2xl' : 'text-2xl'
            }`}
          >
            AI CREATOR{' '}
            <span
              className={`font-serif italic font-normal lowercase text-primary-red ${
                mobileCloseButton ? 'text-2xl min-[360px]:text-3xl' : 'text-3xl'
              }`}
            >
              studio
            </span>
          </h1>
        </button>
        {mobileCloseButton}
      </div>

      {/* Corps de navigation défilable */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-5 overflow-x-hidden">
        {/* 2. Accueil */}
        <div className="space-y-1.5">
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

        {/* 3. Section LA FORMATION (3 modules épurés style Abigail) */}
        <div className="space-y-1.5">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink block px-1">
            LA FORMATION
          </span>

          <div className="space-y-1.5">
            {MAIN_COURSES.map((course) => {
              const isActive = activeCourseId === course.id;
              const modProgress = getModuleProgress(course.id);
              const isDone = modProgress.isCompleted;

              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => handleSelectCourse(course.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left px-3 py-2 border-2 border-ink rounded-brutal-btn transition-all flex items-center justify-between gap-2.5 min-h-[40px] ${
                    isActive
                      ? 'bg-primary-red text-surface font-bold shadow-brutal-xs'
                      : 'bg-surface text-ink hover:bg-pale-pink/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span
                      className={`font-mono text-[10px] font-bold w-6 h-6 border border-ink rounded-brutal-tag flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-surface text-ink' : 'bg-dusty-pink/60 text-ink'
                      }`}
                    >
                      {course.orderNumber}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-tight leading-snug truncate">
                      {course.title}
                    </span>
                  </div>

                  <span
                    className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      isDone
                        ? isActive
                          ? 'bg-surface border-ink text-primary-red'
                          : 'bg-primary-red border-ink text-surface'
                        : isActive
                        ? 'border-surface/60 bg-primary-red/50'
                        : 'border-ink/35 bg-surface/60'
                    }`}
                    aria-hidden="true"
                  >
                    {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Section BONUS (2 bonus épurés sans préfixe B01/B02) */}
        <div className="space-y-1.5">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink block px-1">
            BONUS
          </span>

          <div className="space-y-1.5">
            {BONUSES.map((bonus) => {
              const isActive = activeBonusId === bonus.id;
              const displayTitle =
                bonus.id === 'bonus-manychat'
                  ? 'AUTOMATISATION MANYCHAT'
                  : bonus.title;

              return (
                <button
                  key={bonus.id}
                  type="button"
                  onClick={() => handleSelectBonus(bonus.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left px-3 py-2 border-2 border-ink rounded-brutal-btn transition-all flex items-center justify-between gap-2.5 min-h-[40px] ${
                    isActive
                      ? 'bg-primary-red text-surface font-bold shadow-brutal-xs'
                      : 'bg-surface text-ink hover:bg-pale-pink/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span
                      className={`w-6 h-6 border border-ink rounded-brutal-tag flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-surface' : 'bg-dusty-pink/60'
                      }`}
                    >
                      <Gift
                        className={`w-3.5 h-3.5 ${isActive ? 'text-primary-red' : 'text-ink'}`}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-tight leading-snug truncate">
                      {displayTitle}
                    </span>
                  </div>

                  <span
                    className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      isActive
                        ? 'border-surface/60 bg-primary-red/50'
                        : 'border-ink/35 bg-surface/60'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {buyerEmail && (
        <div
          data-testid="sidebar-buyer-session"
          className="p-3 bg-pale-pink border-t-2 border-ink flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" aria-hidden="true" />
          <span
            className="font-mono text-[11px] font-medium text-ink truncate min-w-0"
            title={buyerEmail}
          >
            {buyerEmail}
          </span>
        </div>
      )}
    </aside>
  );
}
