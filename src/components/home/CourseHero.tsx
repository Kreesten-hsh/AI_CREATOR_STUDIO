import { ArrowRight } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { CourseProgressCircle } from './CourseProgressCircle';

export function CourseHero() {
  const { globalProgress, navigateToDay } = useProgress();

  // Déterminer la prochaine étape pédagogique exacte
  const getNextStepInfo = () => {
    for (let day = 1; day <= 25; day++) {
      if (!globalProgress.completedDayNumbers.includes(day)) {
        return {
          label: `À suivre : Jour ${day}`,
          action: () => navigateToDay(day),
          buttonText: day === 1 ? 'Commencer ici' : 'Continuer',
        };
      }
    }

    return {
      label: 'Parcours complété',
      action: () => navigateToDay(1),
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
            {/* Tag MINI-COURS */}
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-surface text-ink border border-ink rounded-brutal-tag font-mono text-[11px] font-bold uppercase shadow-brutal-xs">
                MINI-COURS
              </span>
            </div>

            {/* Titre officiel en exactement trois lignes sur desktop */}
            <h2 className="font-display text-2xl sm:text-3xl md:text-[34px] lg:text-[36px] leading-[1.12] uppercase tracking-tight text-surface">
              UTILISER <span className="font-serif italic font-normal text-cream lowercase text-3xl sm:text-4xl md:text-[40px]">Claude</span> POUR CRÉER
              <br className="hidden md:inline" />
              <span className="font-extrabold text-white">DES PRODUITS DIGITAUX</span>
              <br className="hidden md:inline" />
              QUI NE RESSEMBLENT PAS À DE LA <span className="font-serif italic font-normal text-pale-pink lowercase text-3xl sm:text-4xl md:text-[40px]">merde générée par l&apos;ia</span>
            </h2>

            {/* Description officielle en environ deux lignes */}
            <p className="text-sm sm:text-base text-surface/90 font-serif leading-relaxed max-w-2xl">
              La méthode complète pour transformer des documents statiques ordinaires en applications web interactives,
              automatisations concrètes et interfaces à haute valeur perçue grâce à Claude Artifacts.
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

          {/* Tampon circulaire minimal intégré directement sans conteneur externe */}
          <div className="self-center lg:self-center shrink-0">
            <CourseProgressCircle percentage={globalProgress.percentage} />
          </div>
        </div>
      </div>
    </section>
  );
}
