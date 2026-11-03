import { motion } from 'framer-motion';
import type { Day, Sprint } from '../../types/course';
import type { DailyProgressResult } from '../../utils/progressCalculator';

interface DayBannerProps {
  day: Day;
  sprint?: Sprint;
  progress: DailyProgressResult;
}

export function DayBanner({ day, progress }: DayBannerProps) {
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
          <span className="font-serif italic font-normal lowercase text-2xl sm:text-3xl lg:text-4xl underline decoration-2 underline-offset-4 text-pale-pink">
            {day.italicTitleWord}
          </span>
        </>
      );
    }
    return parts.map((part, idx) =>
      part.toLowerCase() === day.italicTitleWord?.toLowerCase() ? (
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
    <header className="brutal-card rounded-brutal-card overflow-hidden border-2 border-ink shadow-brutal select-none">
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Panneau gauche : Damier rose poudré avec carte calendrier inclinée */}
        <div className="md:col-span-4 lg:col-span-3 bg-checkerboard-pink p-5 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-ink min-h-[140px]">
          <div className="bg-surface border-2 border-ink rounded-brutal-card shadow-brutal px-5 py-3 text-center -rotate-2">
            <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ink/75">
              JOUR
            </span>
            <span className="block font-serif text-4xl sm:text-5xl leading-none text-ink my-0.5">
              {paddedDay}
            </span>
            <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-primary-red">
              SUR 25
            </span>
          </div>
        </div>

        {/* Panneau droit : Titre éditorial sur fond rouge brique */}
        <div className="md:col-span-8 lg:col-span-9 bg-primary-red text-surface p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 bg-surface text-ink border border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase shadow-brutal-xs">
                JOUR {day.dayNumber} SUR 25
              </span>
              {progress.isCompleted && (
                <span className="inline-flex items-center px-2 py-0.5 bg-pale-pink text-ink border border-ink rounded-brutal-tag font-mono text-[11px] font-bold uppercase">
                  LEÇON TERMINÉE
                </span>
              )}
            </div>

            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight leading-tight text-surface">
              {renderEditorialTitle()}
            </h2>

            <p className="mt-1.5 text-xs sm:text-sm text-surface/90 max-w-2xl leading-relaxed">
              {day.objective}
            </p>
          </div>

          {/* Barre de progression des 4 étapes */}
          <div className="pt-2 border-t border-surface/20 flex items-center gap-3">
            <span className="font-mono text-[11px] font-bold uppercase shrink-0 text-surface">
              4 étapes aujourd&apos;hui
            </span>
            <div className="flex-1 h-2.5 bg-cream border border-ink rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={false}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="h-full bg-ink rounded-full"
              />
            </div>
            <span
              data-testid="day-banner-step-counter"
              className="font-mono text-xs font-bold px-2 py-0.5 bg-surface text-ink border border-ink rounded-brutal-tag shadow-brutal-xs shrink-0"
            >
              {progress.completedCount}/4
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
