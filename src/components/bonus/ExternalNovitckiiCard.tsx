import { ExternalLink } from 'lucide-react';
import type { ExternalResourceInfo } from '../../types/marketing';

interface ExternalNovitckiiCardProps {
  resource: ExternalResourceInfo;
}

export function ExternalNovitckiiCard({ resource }: ExternalNovitckiiCardProps) {
  return (
    <aside
      aria-label="Ressource externe complémentaire"
      className="brutal-card rounded-brutal-card bg-pale-pink/40 border-2 border-ink shadow-brutal p-6 sm:p-7 space-y-4"
    >
      <div className="space-y-2">
        <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-ink">
          {resource.title}
        </h3>
        <p className="font-serif text-sm text-ink leading-relaxed max-w-3xl">
          {resource.description}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-ink/20">
        <span className="font-serif text-xs text-ink font-medium italic">
          Ressource externe indépendante, non auditée par AI CREATOR Studio.
        </span>

        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="brutal-btn rounded-brutal-btn px-4 py-2.5 min-h-[44px] font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 bg-surface text-ink border-2 border-ink hover:bg-cream shadow-brutal-xs transition-all"
        >
          <span>Accéder à la bibliothèque Novitckii</span>
          <ExternalLink className="w-4 h-4 stroke-[2.5] text-primary-red" aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}
