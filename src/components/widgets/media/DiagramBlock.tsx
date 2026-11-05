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
        <p className="text-xs text-ink/80">
          Un schéma ou diagramme interactif doit impérativement fournir une alternative textuelle structurée (accessibleDescription).
        </p>
      </div>
    );
  }

  const { kind, nodes, links } = block.data;

  return (
    <figure
      className="brutal-card rounded-brutal-card overflow-hidden bg-surface space-y-0"
      aria-label={block.title || 'Schéma explicatif'}
    >
      {/* En-tête du diagramme */}
      <div className="px-5 py-3.5 bg-cream border-b-2 border-ink flex flex-wrap items-center justify-between gap-2">
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
        <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-pale-pink border border-ink rounded-brutal-tag text-ink">
          {nodes.length} NŒUDS CLÉS
        </span>
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
                    {node.description && <p className="text-xs text-ink/80 mt-0.5">{node.description}</p>}
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
          <div className="space-y-4" aria-label="Flux logique entre les composants">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="p-4 border-2 border-ink rounded-brutal-card bg-cream shadow-brutal-xs flex flex-col justify-between"
                >
                  <div>
                    {node.tag && (
                      <span className="font-mono text-[10px] font-bold uppercase text-primary-red block mb-1">
                        {node.tag}
                      </span>
                    )}
                    <h5 className="font-display text-sm uppercase text-ink font-bold">{node.label}</h5>
                    {node.description && <p className="text-xs text-ink/80 mt-1">{node.description}</p>}
                  </div>
                </div>
              ))}
            </div>

            {links && links.length > 0 && (
              <div className="p-3 bg-pale-pink/50 border border-ink/40 rounded text-xs font-mono space-y-1">
                <span className="font-bold uppercase text-ink/75 block mb-1">Relations et transitions :</span>
                {links.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-ink/90">
                    <span className="font-bold">{link.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary-red shrink-0" aria-hidden="true" />
                    <span className="font-bold">{link.to}</span>
                    {link.label && <span className="text-ink/70">({link.label})</span>}
                  </div>
                ))}
              </div>
            )}
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
                {node.description && <p className="text-xs text-ink/80 leading-relaxed">{node.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Description textuelle accessible obligatoire pour lecteurs d'écran */}
      <figcaption className="p-4 bg-cream border-t-2 border-ink text-xs text-ink/85 leading-relaxed">
        <strong className="font-mono font-bold uppercase block text-ink mb-1">
          Transcription accessible du schéma :
        </strong>
        <span>{accessibleDesc}</span>
      </figcaption>
    </figure>
  );
}
