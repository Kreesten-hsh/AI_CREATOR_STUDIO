import { ArrowLeft, CheckCircle2, Clock, Gift, Sparkles } from 'lucide-react';
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
          <div className="md:col-span-4 lg:col-span-3 bg-checkerboard-pink p-6 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-ink min-h-[160px]">
            <div className="bg-surface border-2 border-ink rounded-brutal-card shadow-brutal px-5 py-4 text-center -rotate-2">
              <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ink/75">
                ACCÉLÉRATEUR
              </span>
              <span className="block font-serif text-4xl leading-none text-ink my-1">
                {bonus.orderNumber}
              </span>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary-red">
                INCLUS
              </span>
            </div>
          </div>

          {/* Panneau droit */}
          <div className="md:col-span-8 lg:col-span-9 bg-surface p-6 md:p-8 flex flex-col justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pale-pink text-ink border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase">
                  <Gift className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
                  {bonus.orderNumber}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cream text-ink border border-ink/40 rounded-brutal-tag font-mono text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-ink/70" aria-hidden="true" />
                  {bonus.duration}
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight leading-tight text-ink">
                {bonus.title}
              </h2>

              <p className="mt-2 text-base text-ink/80 font-serif leading-relaxed">
                {bonus.subtitle}
              </p>
            </div>

            <div className="pt-3 border-t-2 border-ink/10 flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-ink/70">
                Livrable garanti :
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-pale-pink border border-ink rounded-brutal-tag text-ink">
                {bonus.deliverable}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Description & Contenu du Bonus */}
      <div className="brutal-card rounded-brutal-card bg-surface p-6 md:p-8 border-2 border-ink shadow-brutal space-y-6">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary-red flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            VUE D&apos;ENSEMBLE DU BONUS
          </span>
          <h3 className="font-display text-xl uppercase tracking-tight text-ink mt-1">
            Ce que vous allez mettre en place
          </h3>
          <p className="mt-2 font-serif text-base text-ink/85 leading-relaxed">
            {bonus.description}
          </p>
        </div>

        <div className="border-t-2 border-ink/10 pt-6 space-y-4">
          <h4 className="font-display text-lg uppercase tracking-tight text-ink">
            Points clés abordés dans cet accélérateur
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bonus.keyTopics.map((topic, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-cream border-2 border-ink rounded-brutal-btn flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-primary-red shrink-0 mt-0.5" aria-hidden="true" />
                <span className="font-mono text-xs text-ink font-bold leading-snug">
                  {topic}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
