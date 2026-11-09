import { ArrowUpRight, Download, Sparkles } from 'lucide-react';
import type { MarketingResource } from '../../types/marketing';

interface MarketingResourceCardProps {
  resource: MarketingResource;
  onOpenDetails: (resource: MarketingResource) => void;
}

export function MarketingResourceCard({
  resource,
  onOpenDetails,
}: MarketingResourceCardProps) {
  return (
    <article
      aria-label={`Ressource : ${resource.title}`}
      className="brutal-card rounded-brutal-card bg-surface border-2 border-ink shadow-brutal flex flex-col justify-between p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-brutal"
    >
      <div className="space-y-3.5">
        {/* En-tête : catégorie et nom technique discret */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-pale-pink text-ink border border-ink rounded-brutal-tag font-mono text-[11px] font-bold uppercase">
            {resource.categoryLabel}
          </span>
          <span className="font-mono text-[11px] font-bold text-ink/60 bg-cream px-2 py-0.5 border border-ink/40 rounded-brutal-tag">
            {resource.technicalName}
          </span>
        </div>

        {/* Titre et description */}
        <div className="space-y-1.5">
          <h3 className="font-display text-lg sm:text-xl uppercase tracking-tight text-ink leading-snug">
            {resource.title}
          </h3>
          <p className="font-serif text-xs sm:text-sm text-ink/80 leading-relaxed line-clamp-2">
            {resource.shortDescription}
          </p>
        </div>

        {/* Problème concret résolu */}
        <div className="p-3 bg-cream/70 border border-ink/40 rounded-brutal-card space-y-1">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary-red block">
            Problème résolu
          </span>
          <p className="font-serif text-xs text-ink/90 leading-relaxed line-clamp-2">
            {resource.concreteProblem}
          </p>
        </div>
      </div>

      {/* Pied de carte avec action et indicateur de disponibilité */}
      <div className="pt-4 mt-4 border-t-2 border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {resource.download.isAvailable ? (
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink/75">
            <Download className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
            <span>ZIP inclus ({resource.download.fileSize})</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink/60">
            <span>Prompt autonome direct</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => onOpenDetails(resource)}
          className="brutal-btn rounded-brutal-btn px-3.5 py-2 min-h-[38px] font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-1.5 bg-primary-red text-surface border-2 border-ink hover:bg-dark-red shadow-brutal-xs"
        >
          <Sparkles className="w-3 h-3 text-surface" aria-hidden="true" />
          <span>Consulter la fiche</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
