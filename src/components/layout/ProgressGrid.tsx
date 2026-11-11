import { Check } from 'lucide-react';
import { COURSE_DATA } from '../../data/course';
import { MAIN_COURSES } from '../../data/navigation/mainCourses';

export interface ProgressGridProps {
  completedLessonNumbers?: number[];
  activeLessonNumber?: number | null;
  onSelectLesson?: (lessonNumber: number) => void;
  /** Alias de compatibilité tests unitaires */
  completedDayNumbers?: number[];
  activeDayNumber?: number | null;
  onSelectDay?: (lessonNumber: number) => void;
}

export function ProgressGrid({
  completedLessonNumbers,
  activeLessonNumber,
  onSelectLesson,
  completedDayNumbers,
  activeDayNumber,
  onSelectDay,
}: ProgressGridProps) {
  const completedNumbers = completedLessonNumbers ?? completedDayNumbers ?? [];
  const activeNum = activeLessonNumber ?? activeDayNumber ?? null;
  const handleSelect = onSelectLesson ?? onSelectDay ?? (() => undefined);

  const completedSet = new Set(completedNumbers);
  const totalLessons = COURSE_DATA.totalLessons;

  const renderCell = (lessonNum: number) => {
    const isCompleted = completedSet.has(lessonNum);
    const isActive = activeNum === lessonNum;

    return (
      <button
        key={lessonNum}
        type="button"
        onClick={() => handleSelect(lessonNum)}
        title={`Leçon ${lessonNum}${isCompleted ? ' (Validée)' : ''}${isActive ? ' (En cours)' : ''}`}
        aria-label={`Leçon ${lessonNum}${isCompleted ? ' (Validée)' : ''}${isActive ? ' (En cours)' : ''}`}
        aria-current={isActive ? 'page' : undefined}
        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-[3px] border transition-all flex items-center justify-center shrink-0 font-mono text-[10px] font-bold ${
          isCompleted
            ? 'bg-primary-red border-ink text-surface'
            : isActive
            ? 'bg-cream border-2 border-primary-red ring-1 ring-primary-red text-ink'
            : 'bg-surface border-ink hover:bg-pale-pink text-ink'
        }`}
      >
        {isCompleted ? (
          <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
        ) : (
          <span>{lessonNum}</span>
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
        const [start, end] = moduleItem.lessonRange;
        const moduleLessonNumbers = COURSE_DATA.lessons
          .filter((l) => l.lessonNumber >= start && l.lessonNumber <= end)
          .map((l) => l.lessonNumber);

        return (
          <div
            key={moduleItem.id}
            className="flex items-center gap-1"
            role="group"
            aria-label={`Module ${moduleItem.orderNumber}`}
          >
            {moduleLessonNumbers.map(renderCell)}
          </div>
        );
      })}
    </div>
  );
}
