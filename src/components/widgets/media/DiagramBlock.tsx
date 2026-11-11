import { GitCommit, ArrowRight, Network, Layers, AlertTriangle } from 'lucide-react';
import type { DiagramBlockConfig } from '../../../types/course';

export function DiagramBlock({ block }: { block: DiagramBlockConfig }) {
  const accessibleDesc = block.accessibleDescription?.trim();

  // Description accessible obligatoire
  if (!accessibleDesc) {
    return (
      <div
        role="alert"
        className="p-4 bg-red-100 border-2 border-primary-red rounded-brutal-card text-ink space-y-1"
      >
        <div className="flex items-center gap-2 text-primary-red font-mono text-xs font-bold uppercase">
          <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Erreur d’accessibilité : Description textuelle accessible obligatoire manquante</span>
        </div>
        <p className="text-xs text-ink">
          Un schéma ou diagramme interactif doit impérativement fournir une alternative textuelle structurée (accessibleDescription).
        </p>
      </div>
    );
  }

  const { kind, nodes, links } = block.data;
  const descriptionId = `diagram-desc-${block.id}`;

  return (
    <figure
      className="brutal-card rounded-brutal-card overflow-hidden bg-surface border-2 border-ink shadow-brutal space-y-0"
      aria-label={block.title || 'Schéma explicatif'}
      aria-describedby={descriptionId}
    >
      {/* En-tête sobre du diagramme sans faux badge */}
      <div className="px-5 py-3.5 bg-cream border-b-2 border-ink flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {kind === 'steps' ? (
            <GitCommit className="w-4 h-4 text-primary-red" aria-hidden="true" />
          ) : kind === 'flow' ? (
            <Network className="w-4 h-4 text-primary-red" aria-hidden="true" />
          ) : (
            <Layers className="w-4 h-4 text-primary-red" aria-hidden="true" />
          )}
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
            {block.title || `Schéma conceptuel (${kind})`}
          </span>
        </div>
      </div>

      {/* Rendu visuel accessible piloté par les données */}
      <div className="p-5 md:p-6 bg-surface">
        {kind === 'steps' && (
          <ol className="space-y-3" aria-label="Étapes séquentielles du schéma">
            {nodes.map((node, idx) => (
              <li
                key={node.id}
                className="p-3.5 border-2 border-ink rounded-brutal-card bg-cream flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-brutal-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-7 h-7 bg-primary-red text-surface border border-ink rounded-brutal-tag font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className="font-display text-sm uppercase text-ink font-bold">{node.label}</h5>
                    {node.description && <p className="text-xs text-ink mt-0.5">{node.description}</p>}
                  </div>
                </div>
                {node.tag && (
                  <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-surface border border-ink rounded-brutal-tag shrink-0">
                    {node.tag}
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}

        {kind === 'flow' && (
          <div className="space-y-4" aria-label="Flux séquentiel du parcours">
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 list-none p-0 m-0">
              {nodes.map((node, idx) => {
                const stepNum = String(idx + 1).padStart(2, '0');
                const nextLink = links && links[idx];
                const displayLabel = node.label.replace(/^\d+\.\s*/, '');

                return (
                  <li
                    key={node.id}
                    className="p-4 border-2 border-ink rounded-brutal-card bg-cream shadow-brutal-xs flex flex-col justify-between space-y-2.5"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-primary-red text-surface font-mono text-xs font-bold flex items-center justify-center shrink-0 shadow-brutal-xs">
                          {stepNum}
                        </span>
                        {node.tag && (
                          <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-pale-pink border border-ink rounded-full text-ink shrink-0">
                            {node.tag}
                          </span>
                        )}
                      </div>
                      <h5 className="font-display text-sm uppercase text-ink font-bold leading-tight">
                        {displayLabel}
                      </h5>
                      {node.description && (
                        <p className="text-xs text-ink leading-relaxed font-sans">
                          {node.description}
                        </p>
                      )}
                    </div>

                    {nextLink && (
                      <div className="pt-2 border-t border-ink/20 flex items-start gap-1.5 text-[11px] font-mono text-primary-red font-semibold">
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="leading-snug break-words">{nextLink.label}</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {kind === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Matrice de concepts">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="p-4 border-2 border-ink rounded-brutal-card bg-cream shadow-brutal-xs space-y-1"
              >
                {node.tag && (
                  <span className="font-mono text-[10px] font-bold uppercase text-primary-red block">
                    {node.tag}
                  </span>
                )}
                <h5 className="font-display text-sm uppercase text-ink font-bold">{node.label}</h5>
                {node.description && <p className="text-xs text-ink leading-relaxed">{node.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Description textuelle accessible reliée via aria-describedby */}
      <figcaption
        id={descriptionId}
        className={kind === 'flow' ? 'sr-only' : 'p-4 bg-cream border-t-2 border-ink text-xs text-ink leading-relaxed'}
      >
        <strong className="font-mono font-bold uppercase block text-ink mb-1">
          Transcription accessible du schéma :
        </strong>
        <span>{accessibleDesc}</span>
      </figcaption>
    </figure>
  );
}
