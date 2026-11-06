import { motion } from 'framer-motion';
import { TOTAL_COURSE_LESSONS } from '../../data/course';
import { useProgress } from '../../hooks/useProgress';
import type { CourseModule, Lesson } from '../../types/course';
import type { DailyProgressResult, LessonProgressResult } from '../../utils/progressCalculator';

export interface DayHeaderProps {
  lesson?: Partial<Lesson> & { lessonNumber: number };
  day?: {
    id?: string;
    dayNumber?: number;
    lessonNumber?: number;
    title?: string;
    italicTitleWord?: string;
  };
  sprint?: CourseModule;
  progress?: LessonProgressResult | DailyProgressResult;
  completedDaysOverride?: number[];
}

export function DayHeader({
  lesson,
  day,
  sprint,
  progress: progressProp,
}: DayHeaderProps) {
  const { getLessonProgress } = useProgress();

  const lessonNumber =
    lesson?.lessonNumber ??
    day?.lessonNumber ??
    day?.dayNumber ??
    1;
  const dayNumber =
    lesson?.dayNumber ??
    day?.dayNumber ??
    sprint?.dayNumber ??
    1;
  const paddedLesson = String(lessonNumber).padStart(2, '0');
  const totalLessons = TOTAL_COURSE_LESSONS;

  const currentProgress = progressProp ?? getLessonProgress(lessonNumber);

  const titleSource: string = lesson?.title || day?.title || `Leçon ${paddedLesson}`;
  const italicWord: string | undefined = lesson?.italicTitleWord ?? day?.italicTitleWord;

  const renderEditorialTitle = () => {
    if (!italicWord) {
      return titleSource;
    }
    const regex = new RegExp(`(${italicWord})`, 'i');
    const parts: string[] = titleSource.split(regex);
    if (parts.length === 1) {
      return (
        <>
          {titleSource}{' '}
          <span className="font-serif italic font-normal lowercase text-2xl sm:text-3xl lg:text-4xl underline decoration-2 underline-offset-4 text-pale-pink">
            {italicWord}
          </span>
        </>
      );
    }
    return parts.map((part: string, idx: number) =>
      part.toLowerCase() === italicWord.toLowerCase() ? (
        <span
          key={idx}
          className="font-serif italic font-normal lowercase text-2xl sm:text-3xl lg:text-4xl underline decoration-2 underline-offset-4 text-pale-pink mx-0.5"
        >
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  };

  return (
    <header className="space-y-4">
      {/* Panneau Principal Éditorial */}
      <div className="brutal-card rounded-brutal-card overflow-hidden border-2 border-ink shadow-brutal select-none">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Panneau gauche : Numéro de leçon */}
          <div className="md:col-span-4 lg:col-span-3 bg-checkerboard-pink p-5 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-ink min-h-[140px]">
            <div className="bg-surface border-2 border-ink rounded-brutal-card shadow-brutal px-5 py-3 text-center -rotate-2">
              <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ink/75">
                LEÇON
              </span>
              <span className="block font-serif text-4xl sm:text-5xl leading-none text-ink my-0.5">
                {paddedLesson}
              </span>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary-red">
                SUR {String(totalLessons).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Panneau droit : Titre et Module */}
          <div className="md:col-span-8 lg:col-span-9 bg-surface p-5 sm:p-6 md:p-7 flex flex-col justify-between gap-4">
            <div>
              {/* Badges contextuels */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                {sprint && (
                  <span className="px-2.5 py-0.5 bg-pale-pink text-ink border border-ink rounded-brutal-tag font-mono text-[11px] font-bold uppercase">
                    MODULE {sprint.moduleNumber} : {sprint.title}
                  </span>
                )}
                <span className="px-2 py-0.5 bg-cream text-ink border border-ink/40 rounded-brutal-tag font-mono text-[10px] font-bold uppercase">
                  JOURNÉE {dayNumber} • LEÇON {paddedLesson}
                </span>
              </div>

              {/* Titre structurant */}
              <h2 className="font-display text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight text-ink leading-tight">
                {renderEditorialTitle()}
              </h2>
            </div>

            {/* Jauge de progression locale */}
            <div className="pt-3 border-t-2 border-ink/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <span className="text-ink/80 font-bold uppercase">
                État de la leçon
              </span>
              <span className="font-bold text-ink bg-pale-pink px-2 py-0.5 rounded-brutal-tag border border-ink">
                {currentProgress.percentage}% complété
              </span>
            </div>
          </div>
        </div>

        {/* Ruban jauge de progression animée */}
        <div
          role="progressbar"
          aria-valuenow={currentProgress.percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progression de la leçon ${paddedLesson}`}
          className="h-2.5 bg-cream border-t-2 border-ink w-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-primary-red"
            initial={{ width: 0 }}
            animate={{ width: `${currentProgress.percentage}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>
      </div>
    </header>
  );
}
