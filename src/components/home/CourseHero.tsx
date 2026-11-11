import { ArrowRight } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { COURSE_TITLE, COURSE_SUBTITLE } from '../../data/course';
import { CourseProgressCircle } from './CourseProgressCircle';

export function CourseHero() {
  const { globalProgress, navigateToLesson } = useProgress();

  // Déterminer la prochaine leçon exacte à suivre parmi les 7 leçons
  const getNextStepInfo = () => {
    for (let lessonNum = 1; lessonNum <= globalProgress.totalLessons; lessonNum++) {
      if (!globalProgress.completedLessonNumbers.includes(lessonNum)) {
        return {
          label: `À suivre : Leçon ${lessonNum}`,
          action: () => navigateToLesson(lessonNum),
          buttonText: lessonNum === 1 ? 'Commencer la Leçon 01' : 'Continuer',
        };
      }
    }

    return {
      label: 'Parcours des 7 leçons complété',
      action: () => navigateToLesson(1),
      buttonText: 'Revoir le parcours',
    };
  };

  const nextStep = getNextStepInfo();

  const highlightPhrase = "de la merde générée par l'IA";
  const hasHighlight = COURSE_TITLE.includes(highlightPhrase);
  const titlePrefix = hasHighlight
    ? COURSE_TITLE.replace(highlightPhrase, '').trimEnd()
    : COURSE_TITLE;

  return (
    <section
      aria-label="Présentation de la formation"
      className="rounded-brutal-card bg-primary-red text-surface border-2 border-ink shadow-brutal overflow-hidden"
    >
      {/* Ruban décoratif à damier en bordure supérieure */}
      <div className="h-3.5 bg-checkerboard-pink border-b-2 border-ink w-full" aria-hidden="true" />

      {/* Corps du Hero */}
      <div className="p-6 sm:p-7 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 min-w-0 space-y-4">
            {/* Tag MINI-COURS sobre style Abigail */}
            <div>
              <span className="inline-block px-3 py-0.5 bg-surface text-ink border border-ink rounded-full font-mono text-[10px] font-bold uppercase shadow-brutal-xs">
                MINI-COURS
              </span>
            </div>

            {/* Titre officiel avec accentuation serif crème et filet ondulé organique */}
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight text-surface">
              {titlePrefix}{' '}
              {hasHighlight && (
                <span className="relative inline-block font-serif italic font-normal text-cream">
                  {highlightPhrase}
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-2 text-pale-pink overflow-visible pointer-events-none"
                    viewBox="0 0 100 8"
                    fill="none"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 4 Q 12.5 0, 25 4 T 50 4 T 75 4 T 100 4"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              )}
            </h2>

            {/* Sous-titre officiel */}
            <p className="text-sm sm:text-base text-surface font-serif leading-relaxed max-w-2xl">
              {COURSE_SUBTITLE}
            </p>

            {/* Action principale et indicateur d'étape suivante */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={nextStep.action}
                className="brutal-btn rounded-brutal-btn bg-surface text-ink hover:bg-cream px-5 py-2.5 min-h-[44px] font-mono text-xs font-bold uppercase inline-flex items-center gap-2 border-2 border-ink shadow-brutal-xs transition-all shrink-0"
              >
                <span>{nextStep.buttonText}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
              </button>

              <span className="font-mono text-xs font-bold text-surface tracking-wide">
                {nextStep.label}
              </span>
            </div>
          </div>

          {/* Tampon circulaire minimal */}
          <div className="self-center lg:self-center shrink-0">
            <CourseProgressCircle percentage={globalProgress.percentage} />
          </div>
        </div>
      </div>
    </section>
  );
}
