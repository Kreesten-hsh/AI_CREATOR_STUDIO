import { useState, useEffect } from 'react';
import { Check, Compass, Sparkles } from 'lucide-react';
import type { Course } from '../../types/course';
import { useProgress } from '../../hooks/useProgress';
import { ProgressGrid } from './ProgressGrid';
import { SprintCard } from '../course/SprintCard';

interface SidebarProps {
  course: Course;
  onAfterNavigate?: () => void;
}

export function Sidebar({ course, onAfterNavigate }: SidebarProps) {
  const {
    state,
    globalProgress,
    getDayProgress,
    navigateToStartHere,
    navigateToDay,
    isStartHereCompleted,
  } = useProgress();

  const activeDayNumber =
    state.activeRoute.kind === 'day' ? state.activeRoute.dayNumber : null;

  const findSprintForDay = (dayNumber: number | null): string => {
    if (!dayNumber) return 'sprint-1';
    const found = course.sprints.find(
      (s) => dayNumber >= s.dayRange[0] && dayNumber <= s.dayRange[1]
    );
    return found ? found.id : 'sprint-1';
  };

  const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>(() => {
    const activeSprintId = findSprintForDay(activeDayNumber);
    return {
      'sprint-1': true,
      [activeSprintId]: true,
    };
  });

  useEffect(() => {
    if (activeDayNumber) {
      const sprintId = findSprintForDay(activeDayNumber);
      setExpandedSprints((prev) => (prev[sprintId] ? prev : { ...prev, [sprintId]: true }));
    }
  }, [activeDayNumber]);

  const toggleSprint = (sprintId: string) => {
    setExpandedSprints((prev) => ({
      ...prev,
      [sprintId]: !prev[sprintId],
    }));
  };

  const handleSelectStartHere = (lessonId: string) => {
    navigateToStartHere(lessonId);
    onAfterNavigate?.();
  };

  const handleSelectDay = (dayNumber: number) => {
    navigateToDay(dayNumber);
    onAfterNavigate?.();
  };

  return (
    <aside
      aria-label="Navigation du parcours"
      className="w-full h-full bg-cream border-r-2 border-ink flex flex-col select-none"
    >
      {/* 1. Logo épuré : AI CREATOR Studio */}
      <div className="p-5 bg-surface border-b-2 border-ink">
        <h1 className="font-display text-2xl uppercase tracking-tight leading-none text-ink">
          AI CREATOR{' '}
          <span className="font-serif italic font-normal lowercase text-3xl text-primary-red">
            studio
          </span>
        </h1>
      </div>

      {/* Corps de navigation défilable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* 2. Progression globale & Grille 5x5 */}
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
              {globalProgress.completedDaysCount}{' '}
              {globalProgress.completedDaysCount > 1 ? 'leçons validées' : 'leçon validée'}
            </span>
          </div>

          {/* Barre de progression */}
          <div className="w-full h-2.5 bg-cream border-2 border-ink mb-3 rounded-full overflow-hidden">
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

        {/* 3. BIEN COMMENCER : MAÎTRISER CLAUDE */}
        <section aria-label="Bien commencer" className="space-y-1.5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-ink">
              <Compass className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
              BIEN COMMENCER : MAÎTRISER CLAUDE
            </span>
            <span className="font-mono text-[10px] font-bold text-ink/70">
              {state.completedStartHereIds.length}/2
            </span>
          </div>

          <div className="space-y-1.5">
            {course.startHere.map((lesson) => {
              const isActive =
                state.activeRoute.kind === 'start-here' &&
                state.activeRoute.lessonId === lesson.id;
              const isDone = isStartHereCompleted(lesson.id);

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => handleSelectStartHere(lesson.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left px-3 py-2.5 border-2 border-ink rounded-brutal-btn transition-all flex items-center justify-between gap-2 min-h-[44px] ${
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

        {/* 4. Cinq modules d'apprentissage */}
        <section aria-label="5 modules d'apprentissage" className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-ink">
              <Sparkles className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
              5 MODULES D&apos;APPRENTISSAGE
            </span>
          </div>

          <div className="space-y-2.5">
            {course.sprints.map((sprint) => {
              const sprintDays = course.days.filter((d) => d.sprintId === sprint.id);
              return (
                <SprintCard
                  key={sprint.id}
                  sprint={sprint}
                  days={sprintDays}
                  isExpanded={Boolean(expandedSprints[sprint.id])}
                  onToggleExpand={() => toggleSprint(sprint.id)}
                  activeDayNumber={activeDayNumber}
                  getDayProgress={getDayProgress}
                  onSelectDay={handleSelectDay}
                />
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
}
