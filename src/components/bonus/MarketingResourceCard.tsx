import { ArrowUpRight, Download } from 'lucide-react';
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
      onClick={() => onOpenDetails(resource)}
      className="brutal-card rounded-brutal-card bg-surface border-2 border-ink shadow-brutal flex flex-col justify-between p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-brutal cursor-pointer"
    >
      <div className="space-y-3">
        {/* 1. Badge de catégorie rose poudré */}
        <div>
          <span className="inline-block px-2.5 py-0.5 bg-pale-pink text-ink border border-ink rounded-full font-mono text-[11px] font-bold uppercase">
            {resource.categoryLabel}
          </span>
        </div>

        {/* 2. Titre */}
        <h3 className="font-display text-lg sm:text-xl uppercase tracking-tight text-ink leading-snug">
          {resource.title}
        </h3>

        {/* 3. Description courte */}
        <p className="font-serif text-xs sm:text-sm text-ink leading-relaxed line-clamp-3">
          {resource.shortDescription}
        </p>
      </div>

      {/* 4. Statut discret & 5. Action d'ouverture */}
      <div className="pt-4 mt-4 border-t border-ink/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {resource.download.isAvailable ? (
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-ink">
            <Download className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
            <span>ZIP inclus ({resource.download.fileSize})</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-ink">
            <span>Prompt direct</span>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(resource);
          }}
          className="brutal-btn rounded-brutal-btn px-3.5 py-2 min-h-[44px] font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-1.5 bg-primary-red text-surface border-2 border-ink hover:bg-dark-red shadow-brutal-xs"
        >
          <span>Consulter la fiche</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
