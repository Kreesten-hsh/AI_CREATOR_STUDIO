import { motion } from 'framer-motion';
import type { Day, Sprint } from '../../types/course';
import type { DailyProgressResult } from '../../utils/progressCalculator';

interface DayBannerProps {
  day: Day;
  sprint?: Sprint;
  progress: DailyProgressResult;
}

export function DayBanner({ day, sprint, progress }: DayBannerProps) {
  const paddedDay = String(day.dayNumber).padStart(2, '0');

  const renderEditorialTitle = () => {
    if (!day.italicTitleWord) {
      return day.title;
    }
    const regex = new RegExp(`(${day.italicTitleWord})`, 'i');
    const parts = day.title.split(regex);
    if (parts.length === 1) {
      return (
        <>
          {day.title}{' '}
          <span className="font-serif italic font-normal lowercase text-3xl sm:text-4xl lg:text-5xl underline decoration-2 underline-offset-4 text-pale-pink">
            {day.italicTitleWord}
          </span>
        </>
      );
    }
    return parts.map((part, idx) =>
      part.toLowerCase() === day.italicTitleWord?.toLowerCase() ? (
        <span
          key={idx}
          className="font-serif italic font-normal lowercase text-3xl sm:text-4xl lg:text-5xl underline decoration-2 underline-offset-4 text-pale-pink mx-0.5"
        >
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  };

  return (
    <header className="brutal-card rounded-brutal-banner overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Panneau gauche : Damier rose poudré avec carte timbre inclinée */}
        <div className="md:col-span-4 lg:col-span-3 bg-checkerboard-pink p-6 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-ink min-h-[170px]">
          <div className="bg-surface border-2 border-ink rounded-brutal-card shadow-brutal px-6 py-4 text-center -rotate-2">
            <span className="block font-mono text-[11px] font-bold uppercase tracking-widest text-ink/75">
              JOUR
            </span>
            <span className="block font-serif text-5xl md:text-6xl leading-none text-ink my-1">
              {paddedDay}
            </span>
            <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary-red">
              SUR 25
            </span>
          </div>
        </div>

        {/* Panneau droit : Titre éditorial sur fond rouge brique #B63131 */}
        <div className="md:col-span-8 lg:col-span-9 bg-primary-red text-surface p-6 md:p-8 flex flex-col justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 bg-surface text-ink border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase shadow-brutal-xs">
                JOUR {day.dayNumber} SUR 25
              </span>
              {sprint && (
                <span className="inline-flex items-center px-2.5 py-1 bg-ink text-surface border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase">
                  MODULE 0{sprint.sprintNumber} : {sprint.title}
                </span>
              )}
              {progress.isCompleted && (
                <span className="inline-flex items-center px-2.5 py-1 bg-pale-pink text-ink border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase">
                  LEÇON TERMINÉE
                </span>
              )}
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight leading-tight text-surface">
              {renderEditorialTitle()}
            </h2>

            <p className="mt-2.5 text-sm md:text-base font-medium text-surface/90 max-w-3xl leading-relaxed">
              {day.objective}
            </p>
          </div>

          {/* Barre de progression des 4 étapes */}
          <div className="pt-3 border-t-2 border-surface/30 flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase shrink-0 text-surface">
              4 ÉTAPES AUJOURD&apos;HUI
            </span>
            <div className="flex-1 h-3.5 bg-cream border-2 border-ink rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={false}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="h-full bg-ink rounded-full"
              />
            </div>
            <span
              data-testid="day-banner-step-counter"
              className="font-mono text-xs font-bold uppercase px-2.5 py-1 bg-surface text-ink border-2 border-ink rounded-brutal-tag shadow-brutal-xs self-start sm:self-auto"
            >
              {progress.completedCount}/4 ({progress.percentage}%)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
