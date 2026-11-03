import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { CourseProgressCircle } from './CourseProgressCircle';

export function CourseHero() {
  const {
    globalProgress,
    navigateToStartHere,
    navigateToDay,
    isStartHereCompleted,
  } = useProgress();

  // Déterminer la prochaine étape pédagogique recommandée
  const getNextStepInfo = () => {
    if (!isStartHereCompleted('introduction')) {
      return {
        label: 'À suivre : Orientation initiale (Introduction)',
        action: () => navigateToStartHere('introduction'),
        buttonText: 'Commencer ici',
      };
    }
    if (!isStartHereCompleted('setup')) {
      return {
        label: 'À suivre : Configuration du profil & style',
        action: () => navigateToStartHere('setup'),
        buttonText: 'Continuer l\'orientation',
      };
    }

    // Trouver le premier jour non complété
    for (let day = 1; day <= 25; day++) {
      if (!globalProgress.completedDayNumbers.includes(day)) {
        return {
          label: `À suivre : Module 01, Leçon ${String(day).padStart(2, '0')}`,
          action: () => navigateToDay(day),
          buttonText: day === 1 ? 'Commencer la Leçon 01' : `Reprendre la Leçon ${String(day).padStart(2, '0')}`,
        };
      }
    }

    return {
      label: 'Félicitations : Parcours principal validé à 100% !',
      action: () => navigateToDay(1),
      buttonText: 'Revoir le parcours',
    };
  };

  const nextStep = getNextStepInfo();

  return (
    <section
      aria-label="Présentation principale du mini-cours"
      className="brutal-card rounded-brutal-card bg-surface p-6 sm:p-8 lg:p-10 border-2 border-ink shadow-brutal space-y-8"
    >
      {/* En-tête : Badge & Catégorie */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink/15 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-pale-pink text-ink font-mono text-xs font-bold uppercase border-2 border-ink rounded-brutal-tag">
            MINI-COURS
          </span>
          <span className="px-2.5 py-1 bg-cream text-ink/80 font-mono text-xs font-bold uppercase border border-ink/40 rounded-brutal-tag">
            PARCOURS PRATIQUE INTENSIF
          </span>
        </div>

        <span className="font-mono text-xs font-bold text-ink/70 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
          5 MODULES : 25 JOURS : 3 BONUS
        </span>
      </div>

      {/* Titre Principal Officiel & Lead */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-[1.08] uppercase tracking-tight text-ink">
            UTILISER CLAUDE POUR CRÉER DES PRODUITS DIGITAUX QUI NE RESSEMBLENT PAS À DE LA MERDE GÉNÉRÉE PAR L&apos;IA
          </h2>

          <p className="text-base sm:text-lg text-ink/85 leading-relaxed max-w-2xl font-serif">
            La méthode complète pour transformer des documents statiques ordinaires en applications web interactives,
            automatisations concrètes et interfaces à haute valeur perçue grâce à Claude Artifacts.
          </p>

          {/* Rappel étape suivante & Bouton CTA direct */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              type="button"
              onClick={nextStep.action}
              className="brutal-btn rounded-brutal-btn bg-primary-red text-surface hover:bg-dark-red px-6 py-3.5 min-h-[50px] font-mono text-sm font-bold uppercase inline-flex items-center justify-center gap-2.5 shadow-brutal hover:shadow-brutal-xs transition-all shrink-0"
            >
              <span>{nextStep.buttonText}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-ink/75 bg-cream px-3 py-2 border border-ink rounded-brutal-tag">
              <Compass className="w-4 h-4 text-primary-red shrink-0" aria-hidden="true" />
              <span>{nextStep.label}</span>
            </div>
          </div>
        </div>

        {/* Jauge Circulaire de Progression globale */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-cream border-2 border-ink rounded-brutal-card shadow-brutal-xs">
          <CourseProgressCircle
            percentage={globalProgress.percentage}
            completedCount={globalProgress.completedDaysCount}
            totalCount={25}
            size={150}
            strokeWidth={12}
          />
        </div>
      </div>
    </section>
  );
}
