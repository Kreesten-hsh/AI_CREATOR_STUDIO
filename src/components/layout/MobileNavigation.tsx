import { useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import type { Course } from '../../types/course';
import { useProgress } from '../../hooks/useProgress';
import { MainSidebar } from './MainSidebar';
import { CourseSidebar } from '../course/CourseSidebar';

interface MobileNavigationProps {
  course: Course;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function MobileNavigation({
  course,
  isOpen,
  onToggle,
  onClose,
}: MobileNavigationProps) {
  const { state, globalProgress } = useProgress();

  const isInsideCourse =
    state.activeRoute.kind === 'course' ||
    state.activeRoute.kind === 'day';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <div className="lg:hidden sticky top-0 z-30 bg-surface border-b-2 border-ink px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls="mobile-sidebar-drawer"
            aria-label={isOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
            className="brutal-btn bg-primary-red text-surface p-2 min-h-[44px] min-w-[44px] rounded-brutal-btn flex items-center justify-center"
          >
            {isOpen ? (
              <X className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
            )}
          </button>
          <div className="min-w-0">
            <span className="font-display text-sm uppercase tracking-tight block truncate">
              AI CREATOR{' '}
              <span className="font-serif italic font-normal lowercase text-base text-primary-red">
                studio
              </span>
            </span>
            <span className="font-mono text-[11px] font-bold text-ink/75 block">
              {globalProgress.completedDaysCount} sur {globalProgress.totalDays} leçons validées
            </span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation mobile du parcours"
          id="mobile-sidebar-drawer"
        >
          <div
            className="fixed inset-0 bg-ink/60"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative z-50 w-80 max-w-[85vw] h-full bg-pale-pink border-r-2 border-ink flex flex-col">
            <div className="p-3 bg-ink text-surface flex items-center justify-between border-b-2 border-ink">
              <span className="font-mono text-xs font-bold uppercase text-pale-pink">
                NAVIGATION DU PARCOURS
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer le tiroir"
                className="px-2.5 py-1 bg-surface text-ink font-mono text-xs font-bold uppercase border border-surface rounded-brutal-tag min-h-[36px]"
              >
                FERMER [ESC]
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isInsideCourse ? (
                <CourseSidebar course={course} onAfterNavigate={onClose} />
              ) : (
                <MainSidebar onAfterNavigate={onClose} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
