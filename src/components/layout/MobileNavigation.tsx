import { useEffect, useRef } from 'react';
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
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousBodyOverflowRef = useRef<string | null>(null);
  const wasOpenRef = useRef(false);

  const isInsideCourse = state.activeRoute.kind === 'lesson';

  // Verrouille le scroll arrière-plan et gère le focus à l'ouverture/fermeture du tiroir.
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      wasOpenRef.current = true;
      previousBodyOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
      return;
    }

    if (!isOpen && wasOpenRef.current) {
      wasOpenRef.current = false;
      document.body.style.overflow = previousBodyOverflowRef.current ?? '';
      previousBodyOverflowRef.current = null;
      toggleButtonRef.current?.focus();
    }
  }, [isOpen]);

  // Nettoie le verrouillage si le composant est démonté tiroir ouvert (ex. passage lg).
  useEffect(() => {
    return () => {
      if (wasOpenRef.current) {
        document.body.style.overflow = previousBodyOverflowRef.current ?? '';
        wasOpenRef.current = false;
      }
    };
  }, []);

  const drawerCloseButton = (
    <button
      ref={closeButtonRef}
      type="button"
      onClick={onClose}
      aria-label="Fermer le tiroir"
      className="p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center bg-surface text-ink border-2 border-ink rounded-brutal-btn shadow-brutal-xs hover:bg-cream transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red"
    >
      <X className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
    </button>
  );

  return (
    <>
      <div className="lg:hidden sticky top-0 z-30 bg-surface border-b-2 border-ink px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            ref={toggleButtonRef}
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls="mobile-sidebar-drawer"
            aria-label={isOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
            className="brutal-btn bg-primary-red text-surface p-2 min-h-[44px] min-w-[44px] rounded-brutal-btn flex items-center justify-center shrink-0"
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
            <span className="font-mono text-[11px] font-bold text-ink block">
              {globalProgress.completedLessonsCount} sur {globalProgress.totalLessons} leçons validées
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
          <div className="relative z-50 w-80 max-w-[85vw] h-full bg-pale-pink flex flex-col shadow-brutal">
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
              {isInsideCourse ? (
                <CourseSidebar
                  course={course}
                  onAfterNavigate={onClose}
                  mobileCloseButton={drawerCloseButton}
                />
              ) : (
                <MainSidebar
                  onAfterNavigate={onClose}
                  mobileCloseButton={drawerCloseButton}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
