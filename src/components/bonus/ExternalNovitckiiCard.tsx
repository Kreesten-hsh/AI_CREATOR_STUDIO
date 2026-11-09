import { ExternalLink, BookOpen } from 'lucide-react';
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface text-ink border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase shadow-brutal-xs">
          <BookOpen className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
          {resource.badge}
        </span>
        <span className="font-mono text-xs text-ink/75 font-bold">
          Ressource externe
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-ink">
          {resource.title}
        </h3>
        <p className="font-serif text-sm text-ink/80 leading-relaxed max-w-3xl">
          {resource.description}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-ink/20">
        <span className="font-serif text-xs text-ink/70 italic">
          Veille indépendante non auditée par AI CREATOR STUDIO.
        </span>

        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="brutal-btn rounded-brutal-btn px-4 py-2.5 min-h-[42px] font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 bg-surface text-ink border-2 border-ink hover:bg-cream shadow-brutal-xs transition-all"
        >
          <span>Accéder à la bibliothèque Novitckii</span>
          <ExternalLink className="w-4 h-4 stroke-[2.5] text-primary-red" aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}
