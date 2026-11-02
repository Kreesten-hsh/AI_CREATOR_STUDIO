import { motion } from 'framer-motion';
import { TOTAL_COURSE_DAYS } from '../../utils/progressCalculator';

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
  const days = Array.from({ length: TOTAL_COURSE_DAYS }, (_, idx) => idx + 1);

  return (
    <div aria-label="Grille de progression des 25 leçons">
      <div className="grid grid-cols-5 gap-1.5">
        {days.map((dayNum) => {
          const isCompleted = completedSet.has(dayNum);
          const isActive = activeDayNumber === dayNum;
          const padded = String(dayNum).padStart(2, '0');

          return (
            <motion.button
              key={dayNum}
              type="button"
              whileTap={{ scale: 0.94 }}
              animate={
                isCompleted
                  ? { backgroundColor: '#B63131', color: '#FFFDFC' }
                  : { backgroundColor: '#FAF6F0', color: '#171313' }
              }
              transition={{ duration: 0.2 }}
              onClick={() => onSelectDay(dayNum)}
              aria-label={`Leçon ${padded}${isCompleted ? ' (Terminée)' : ''}${
                isActive ? ' (En cours)' : ''
              }`}
              aria-current={isActive ? 'page' : undefined}
              className={`h-8 border-2 border-ink rounded-brutal-tag font-mono text-[11px] font-bold flex items-center justify-center transition-all ${
                isActive
                  ? 'ring-2 ring-ink ring-offset-1 ring-offset-cream shadow-brutal-xs font-extrabold'
                  : 'hover:bg-pale-pink'
              }`}
            >
              {padded}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
