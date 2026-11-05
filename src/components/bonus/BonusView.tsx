import { ArrowLeft, Gift, Construction } from 'lucide-react';
import { BONUSES } from '../../data/navigation/bonuses';
import { useProgress } from '../../hooks/useProgress';

interface BonusViewProps {
  bonusId: string;
}

export function BonusView({ bonusId }: BonusViewProps) {
  const { navigateToHome } = useProgress();
  const bonus = BONUSES.find((b) => b.id === bonusId) ?? BONUSES[0];

  return (
    <div className="space-y-6">
      {/* Bouton retour */}
      <button
        type="button"
        onClick={navigateToHome}
        className="group inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ink/75 hover:text-primary-red transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
        <span>RETOUR AU SOMMAIRE DE LA FORMATION</span>
      </button>

      {/* Bannière du Bonus */}
      <header className="brutal-card rounded-brutal-card overflow-hidden border-2 border-ink shadow-brutal">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Panneau gauche */}
          <div className="md:col-span-4 lg:col-span-3 bg-checkerboard-pink p-6 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-ink min-h-[140px]">
            <div className="bg-surface border-2 border-ink rounded-brutal-card shadow-brutal px-5 py-3 text-center -rotate-2">
              <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ink/75">
                BONUS PRATIQUE
              </span>
              <span className="block font-serif text-3xl leading-none text-ink my-1">
                {bonus.orderNumber}
              </span>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary-red">
                INCLUS
              </span>
            </div>
          </div>

          {/* Panneau droit */}
          <div className="md:col-span-8 lg:col-span-9 bg-surface p-6 md:p-8 flex flex-col justify-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pale-pink text-ink border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase">
                <Gift className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
                {bonus.orderNumber}
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight leading-tight text-ink">
              {bonus.title}
            </h2>
          </div>
        </div>
      </header>

      {/* État vide en cours de reconstruction */}
      <section
        aria-label="État du bonus"
        className="brutal-card rounded-brutal-card bg-surface p-8 sm:p-12 border-2 border-ink shadow-brutal text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 bg-pale-pink border-2 border-ink rounded-brutal-btn shadow-brutal-xs">
          <Construction className="w-7 h-7 text-primary-red" aria-hidden="true" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="font-display text-xl uppercase tracking-tight text-ink">
            Contenu en cours de reconstruction.
          </h3>
          <p className="font-serif text-sm text-ink/75 leading-relaxed">
            Ce bonus pratique fait partie du cursus et son contenu sera intégré dans la prochaine phase.
          </p>
        </div>
      </section>
    </div>
  );
}
