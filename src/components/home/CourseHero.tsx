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
            {/* Tag MINI-COURS GUIDÉ */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block px-2.5 py-0.5 bg-surface text-ink border border-ink rounded-brutal-tag font-mono text-[11px] font-bold uppercase shadow-brutal-xs">
                MINI-COURS GUIDÉ : 3 MODULES • 3 JOURS • 7 LEÇONS • 2 BONUS
              </span>
            </div>

            {/* Titre officiel en casse normale lisible dès 375px */}
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight text-surface">
              {COURSE_TITLE}
            </h2>

            {/* Sous-titre officiel */}
            <p className="text-sm sm:text-base text-surface/90 font-serif leading-relaxed max-w-2xl">
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
