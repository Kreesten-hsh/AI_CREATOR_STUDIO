import { Check } from 'lucide-react';
import type { Day } from '../../types/course';
import type { DailyProgressResult } from '../../utils/progressCalculator';

interface DayCardProps {
  day: Day;
  progress: DailyProgressResult;
  isActive: boolean;
  onSelect: () => void;
}

export function DayCard({ day, progress, isActive, onSelect }: DayCardProps) {
  const padded = String(day.dayNumber).padStart(2, '0');

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isActive ? 'page' : undefined}
      className={`w-full text-left px-3 py-2.5 border-2 border-ink rounded-brutal-btn transition-all flex items-center justify-between gap-2.5 min-h-[46px] ${
        isActive
          ? 'bg-primary-red text-surface font-bold shadow-brutal-xs'
          : progress.isCompleted
          ? 'bg-surface text-ink hover:bg-pale-pink/40'
          : 'bg-cream text-ink hover:bg-surface'
      }`}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <span
          className={`font-mono text-[11px] font-bold px-1.5 py-0.5 border border-ink rounded-brutal-tag shrink-0 ${
            isActive
              ? 'bg-surface text-ink'
              : progress.isCompleted
              ? 'bg-primary-red text-surface'
              : 'bg-surface text-ink'
          }`}
        >
          L{padded}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-tight truncate">{day.title}</p>
          <p
            className={`font-mono text-[10px] ${
              isActive ? 'text-surface/85' : 'text-ink/75'
            }`}
          >
            {progress.completedCount}/4 ÉTAPES
          </p>
        </div>
      </div>

      <span
        className={`w-5 h-5 shrink-0 border-2 border-ink rounded-brutal-tag flex items-center justify-center ${
          progress.isCompleted
            ? isActive
              ? 'bg-surface text-primary-red'
              : 'bg-primary-red text-surface'
            : isActive
            ? 'bg-surface text-ink'
            : 'bg-surface'
        }`}
        aria-hidden="true"
      >
        {progress.isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
      </span>
    </button>
  );
}
