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
  const row1Days = Array.from({ length: 9 }, (_, idx) => idx + 1);
  const row2Days = Array.from({ length: 9 }, (_, idx) => idx + 10);
  const row3Days = Array.from({ length: 7 }, (_, idx) => idx + 19);

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
        className={`w-4 h-4 sm:w-[17px] sm:h-[17px] rounded-[2px] border transition-all flex items-center justify-center shrink-0 ${
          isCompleted
            ? 'bg-primary-red border-ink text-surface'
            : isActive
            ? 'bg-cream border-2 border-primary-red ring-1 ring-primary-red'
            : 'bg-surface border-ink/80 hover:border-ink hover:bg-pale-pink'
        }`}
      >
        {isCompleted && (
          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" aria-hidden="true" />
        )}
      </button>
    );
  };

  return (
    <div
      aria-label="Grille de progression des 25 jours"
      className="space-y-1.5 select-none py-0.5 w-full"
    >
      {/* Ligne 1 : Jours 1 à 9 */}
      <div className="flex items-center gap-1.5">
        {row1Days.map(renderCell)}
      </div>

      {/* Ligne 2 : Jours 10 à 18 */}
      <div className="flex items-center gap-1.5">
        {row2Days.map(renderCell)}
      </div>

      {/* Ligne 3 : Jours 19 à 25 */}
      <div className="flex items-center gap-1.5">
        {row3Days.map(renderCell)}
      </div>
    </div>
  );
}
