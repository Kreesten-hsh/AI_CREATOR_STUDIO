import { Check } from 'lucide-react';
import { COURSE_DATA } from '../../data/course';
import { MAIN_COURSES } from '../../data/navigation/mainCourses';

interface ProgressGridProps {
  completedDayNumbers: number[];
  activeDayNumber: number | null;
  onSelectDay: (dayNumber: number) => void;
}

export function ProgressGrid({
  completedDayNumbers,
  activeDayNumber,
  onSelectDay,
}: ProgressGridProps) {
  const completedSet = new Set(completedDayNumbers);
  const totalLessons = COURSE_DATA.totalDays;

  const renderCell = (dayNum: number) => {
    const isCompleted = completedSet.has(dayNum);
    const isActive = activeDayNumber === dayNum;

    return (
      <button
        key={dayNum}
        type="button"
        onClick={() => onSelectDay(dayNum)}
        title={`Leçon ${dayNum}${isCompleted ? ' (Validée)' : ''}${isActive ? ' (En cours)' : ''}`}
        aria-label={`Leçon ${dayNum}${isCompleted ? ' (Validée)' : ''}${isActive ? ' (En cours)' : ''}`}
        aria-current={isActive ? 'page' : undefined}
        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-[3px] border transition-all flex items-center justify-center shrink-0 font-mono text-[10px] font-bold ${
          isCompleted
            ? 'bg-primary-red border-ink text-surface'
            : isActive
            ? 'bg-cream border-2 border-primary-red ring-1 ring-primary-red text-ink'
            : 'bg-surface border-ink/80 hover:border-ink hover:bg-pale-pink text-ink/80'
        }`}
      >
        {isCompleted ? (
          <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
        ) : (
          <span>{dayNum}</span>
        )}
      </button>
    );
  };

  return (
    <div
      aria-label={`Grille de progression des ${totalLessons} leçons`}
      className="flex flex-wrap items-center gap-2 select-none py-0.5 w-full"
    >
      {MAIN_COURSES.map((moduleItem) => {
        const [start, end] = moduleItem.dayRange ?? [1, 3];
        const moduleDays = COURSE_DATA.days
          .filter((d) => d.dayNumber >= start && d.dayNumber <= end)
          .map((d) => d.dayNumber);

        return (
          <div
            key={moduleItem.id}
            className="flex items-center gap-1"
            role="group"
            aria-label={`Module ${moduleItem.orderNumber}`}
          >
            {moduleDays.map(renderCell)}
          </div>
        );
      })}
    </div>
  );
}
