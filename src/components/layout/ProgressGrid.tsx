import { Check } from 'lucide-react';

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
  const row1Days = Array.from({ length: 13 }, (_, idx) => idx + 1);
  const row2Days = Array.from({ length: 12 }, (_, idx) => idx + 14);

  const renderCell = (dayNum: number) => {
    const isCompleted = completedSet.has(dayNum);
    const isActive = activeDayNumber === dayNum;

    return (
      <button
        key={dayNum}
        type="button"
        onClick={() => onSelectDay(dayNum)}
        title={`Jour ${dayNum}${isCompleted ? ' (Validé)' : ''}${isActive ? ' (En cours)' : ''}`}
        aria-label={`Jour ${dayNum}${isCompleted ? ' (Validé)' : ''}${isActive ? ' (En cours)' : ''}`}
        aria-current={isActive ? 'page' : undefined}
        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[2px] border transition-all flex items-center justify-center shrink-0 ${
          isCompleted
            ? 'bg-primary-red border-ink text-surface'
            : isActive
            ? 'bg-cream border-2 border-primary-red ring-1 ring-primary-red'
            : 'bg-surface border-ink/80 hover:border-ink hover:bg-pale-pink'
        }`}
      >
        {isCompleted && (
          <Check className="w-2.5 h-2.5 stroke-[3]" aria-hidden="true" />
        )}
      </button>
    );
  };

  return (
    <div
      aria-label="Grille de progression des 25 jours"
      className="space-y-1 select-none py-0.5 w-full overflow-hidden"
    >
      {/* Ligne 1 : Jours 1 à 13 */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap">
        {row1Days.map(renderCell)}
      </div>

      {/* Ligne 2 : Jours 14 à 25 */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap">
        {row2Days.map(renderCell)}
      </div>
    </div>
  );
}
