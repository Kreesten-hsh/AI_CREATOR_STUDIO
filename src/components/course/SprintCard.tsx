import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Day, Sprint } from '../../types/course';
import type { DailyProgressResult } from '../../utils/progressCalculator';
import { DayCard } from './DayCard';

interface SprintCardProps {
  sprint: Sprint;
  days: Day[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeDayNumber: number | null;
  getDayProgress: (dayNumber: number) => DailyProgressResult;
  onSelectDay: (dayNumber: number) => void;
}

export function SprintCard({
  sprint,
  days,
  isExpanded,
  onToggleExpand,
  activeDayNumber,
  getDayProgress,
  onSelectDay,
}: SprintCardProps) {
  const completedInSprint = days.filter((d) => getDayProgress(d.dayNumber).isCompleted).length;
  const allCompleted = completedInSprint === days.length;

  return (
    <div className="border-2 border-ink bg-surface rounded-brutal-card shadow-brutal-xs overflow-hidden">
      <button
        type="button"
        onClick={onToggleExpand}
        aria-expanded={isExpanded}
        className={`w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 transition-colors min-h-[48px] ${
          allCompleted ? 'bg-pale-pink/50' : 'bg-surface hover:bg-cream'
        }`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 bg-ink text-surface rounded-brutal-tag">
              MODULE 0{sprint.sprintNumber}
            </span>
            <span className="font-mono text-[10px] font-bold text-ink/70">
              {completedInSprint}/{days.length} VALIDÉES
            </span>
          </div>
          <p className="font-display text-xs uppercase tracking-tight mt-1 truncate text-ink">
            {sprint.title}
          </p>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 shrink-0 text-ink" aria-hidden="true" />
        ) : (
          <ChevronRight className="w-4 h-4 shrink-0 text-ink" aria-hidden="true" />
        )}
      </button>

      {isExpanded && (
        <div className="p-2 bg-cream border-t-2 border-ink space-y-1.5">
          <p className="px-1 py-1 text-[11px] text-ink/75 leading-snug border-b border-ink/20 mb-1.5">
            <strong>Livrable attendu :</strong> {sprint.deliverable}
          </p>
          {days.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              progress={getDayProgress(day.dayNumber)}
              isActive={activeDayNumber === day.dayNumber}
              onSelect={() => onSelectDay(day.dayNumber)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
