import { motion } from 'framer-motion';
import { TOTAL_COURSE_LESSONS } from '../../data/course';
import type { CourseModule, Day, Lesson } from '../../types/course';
import type { DailyProgressResult, LessonProgressResult } from '../../utils/progressCalculator';

interface DayBannerProps {
  lesson?: Lesson;
  day?: Day | Lesson;
  sprint?: CourseModule;
  progress: LessonProgressResult | DailyProgressResult;
}

export function DayBanner({ lesson, day, sprint: _sprint, progress }: DayBannerProps) {
  const target = lesson ?? day;
  const lessonNumber =
    target && 'lessonNumber' in target
      ? target.lessonNumber
      : target && 'dayNumber' in target
        ? target.dayNumber
        : 1;
  const paddedLesson = String(lessonNumber).padStart(2, '0');
  const totalLessons = TOTAL_COURSE_LESSONS;
  const totalSteps =
    target && 'steps' in target && Array.isArray(target.steps)
      ? target.steps.length
      : progress.total;

  const renderEditorialTitle = () => {
    const title = target?.title ?? `Leçon ${paddedLesson}`;
    const italicWord =
      target && 'italicTitleWord' in target ? target.italicTitleWord : undefined;
    if (!italicWord) {
      return title;
    }
    const regex = new RegExp(`(${italicWord})`, 'i');
    const parts: string[] = title.split(regex);
    if (parts.length === 1) {
      return (
        <>
          {title}{' '}
          <span className="font-serif italic font-normal lowercase text-2xl sm:text-3xl lg:text-4xl text-cream underline decoration-pale-pink/80 decoration-2 underline-offset-4">
            {italicWord}
          </span>
        </>
      );
    }
    return parts.map((part: string, idx: number) =>
      part.toLowerCase() === italicWord.toLowerCase() ? (
        <span
          key={idx}
          className="font-serif italic font-normal lowercase text-2xl sm:text-3xl lg:text-4xl text-cream underline decoration-pale-pink/80 decoration-2 underline-offset-4 mx-0.5"
        >
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  };

  return (
    <header className="brutal-card rounded-brutal-card overflow-hidden border-2 border-ink shadow-brutal select-none">
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Panneau gauche : Damier rose poudré avec carte leçon inclinée */}
        <div className="md:col-span-4 lg:col-span-3 bg-checkerboard-pink p-5 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-ink min-h-[140px]">
          <div className="bg-surface border-2 border-ink rounded-brutal-card shadow-brutal px-5 py-3 text-center -rotate-2">
            <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ink">
              LEÇON
            </span>
            <span className="block font-serif text-4xl sm:text-5xl leading-none text-ink my-0.5">
              {paddedLesson}
            </span>
            <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-primary-red">
              SUR {String(totalLessons).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Panneau droit : Titre éditorial sur fond rouge brique épuré style Abigail */}
        <div className="md:col-span-8 lg:col-span-9 bg-primary-red text-surface p-6 sm:p-7 md:p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-block bg-surface text-ink border border-ink rounded-full px-3 py-0.5 font-mono text-[11px] font-bold uppercase shadow-brutal-xs">
                LEÇON {paddedLesson} SUR {String(totalLessons).padStart(2, '0')}
              </span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight leading-tight text-surface">
              {renderEditorialTitle()}
            </h2>

            {target?.objective && (
              <p className="mt-2.5 text-sm sm:text-base text-surface font-serif max-w-2xl leading-relaxed">
                {target.objective}
              </p>
            )}
          </div>

          {/* Barre de progression des étapes style Abigail SANS trait séparateur gris */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span className="font-mono text-[11px] font-bold uppercase shrink-0 text-surface">
              {totalSteps} {totalSteps > 1 ? 'étapes dans cette leçon' : 'étape dans cette leçon'}
            </span>
            <div className="flex-1 min-w-[140px] h-2 bg-surface/25 rounded-full overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="h-full bg-surface rounded-full"
              />
            </div>
            <span
              data-testid="day-banner-step-counter"
              className="font-mono text-xs font-bold px-2.5 py-0.5 bg-surface text-ink border border-ink rounded-full shadow-brutal-xs shrink-0"
            >
              {progress.completedCount}/{totalSteps}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
