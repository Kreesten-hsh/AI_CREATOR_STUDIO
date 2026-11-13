import type { ReactNode } from 'react';
import { Check, ChevronLeft } from 'lucide-react';
import type { Course } from '../../types/course';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../hooks/useProgress';
import { ProgressGrid } from '../layout/ProgressGrid';
import {
  formatCourseLessonRangeTitle,
  getCourseById,
  getCourseLessons,
  resolveActiveCourseId,
  resolveActiveLesson,
} from '../../utils/courseNavigation';

interface CourseSidebarProps {
  course: Course;
  onAfterNavigate?: () => void;
  mobileCloseButton?: ReactNode;
}

export function CourseSidebar({
  course,
  onAfterNavigate,
  mobileCloseButton,
}: CourseSidebarProps) {
  const { buyerEmail } = useAuth();
  const {
    state,
    globalProgress,
    getLessonProgress,
    navigateToHome,
    navigateToLesson,
  } = useProgress();

  const activeLesson =
    resolveActiveLesson(state.activeRoute) ?? course.lessons[0];
  const activeLessonNumber = activeLesson?.lessonNumber ?? 1;

  const handleGoHome = () => {
    navigateToHome();
    onAfterNavigate?.();
  };

  const handleSelectLesson = (lessonNumber: number) => {
    navigateToLesson(lessonNumber);
    onAfterNavigate?.();
  };

  const activeCourseId = resolveActiveCourseId(state.activeRoute) ?? 'module-01';
  const currentCourse = getCourseById(activeCourseId);
  const currentCourseLessons = getCourseLessons(course.lessons, activeCourseId);
  const lessonRangeTitle = formatCourseLessonRangeTitle(currentCourse?.lessonRange);

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
          className="group inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ink hover:text-primary-red transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
          <span>RETOUR À L&apos;ACCUEIL</span>
        </button>

        <div className="flex items-center justify-between gap-2">
          <h1
            className={`font-display uppercase tracking-tight leading-none text-ink min-w-0 ${
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
          {mobileCloseButton}
        </div>
      </div>

      {/* Corps défilable */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-4 overflow-x-hidden">
        {/* 2. Barre de progression & Grille compacte des 7 leçons */}
        <section
          aria-label="Progression globale"
          className="p-3 bg-surface border-2 border-ink rounded-brutal-card shadow-brutal-xs space-y-2"
        >
          <div className="flex items-center justify-between gap-2 whitespace-nowrap">
            <span className="font-mono text-[10px] font-bold uppercase text-ink tracking-wider">
              Votre progression
            </span>
            <span
              data-testid="sidebar-global-progress-label"
              className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-pale-pink border border-ink text-ink rounded-brutal-tag shrink-0"
            >
              {globalProgress.completedLessonsCount} sur {globalProgress.totalLessons} leçons
            </span>
          </div>

          <ProgressGrid
            completedLessonNumbers={globalProgress.completedLessonNumbers}
            activeLessonNumber={activeLessonNumber}
            onSelectLesson={handleSelectLesson}
          />
        </section>

        {/* 3. Section dynamique des leçons du module actif */}
        <section aria-label={lessonRangeTitle} className="space-y-1.5">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink px-1 block">
            {lessonRangeTitle}
          </span>

          <div className="space-y-1.5">
            {currentCourseLessons.map((lesson) => {
              const isActive = activeLessonNumber === lesson.lessonNumber;
              const lessonProgress = getLessonProgress(lesson.id);
              const isDone = lessonProgress.isCompleted;

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => handleSelectLesson(lesson.lessonNumber)}
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
                      Leçon {lesson.lessonNumber}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold uppercase leading-snug break-words">
                      {lesson.navigationTitle ?? lesson.title}
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
        </section>
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
