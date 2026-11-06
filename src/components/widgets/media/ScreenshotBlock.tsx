import { AlertTriangle, Calendar, Monitor } from 'lucide-react';
import type { ScreenshotBlockConfig } from '../../../types/course';

export function ScreenshotBlock({ block }: { block: ScreenshotBlockConfig }) {
  const altText = block.alt?.trim();

  // Règle stricte d'accessibilité
  if (!altText) {
    return (
      <div
        role="alert"
        className="p-4 bg-red-100 border-2 border-primary-red rounded-brutal-card text-ink space-y-1"
      >
        <div className="flex items-center gap-2 text-primary-red font-mono text-xs font-bold uppercase">
          <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Erreur d’accessibilité : Texte alternatif (alt) obligatoire manquant pour la capture</span>
        </div>
        <p className="text-xs text-ink/80">
          Une capture d’écran requiert une description textuelle complète de ce qui est visible à l’écran.
        </p>
      </div>
    );
  }

  return (
    <figure
      className="brutal-card rounded-brutal-card overflow-hidden bg-surface"
      aria-label={block.caption}
    >
      {/* Cadre de fenêtre de navigateur - ZÉRO fausse URL */}
      <div className="px-4 py-2.5 bg-ink text-surface border-b-2 border-ink flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-red-400 border border-ink/40 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-400 border border-ink/40 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-400 border border-ink/40 inline-block" />
        </div>

        {/* Contexte explicite de l'interface SANS fausse URL */}
        <div className="flex items-center gap-2 px-3 py-1 bg-surface/10 rounded border border-surface/20 text-xs font-mono text-surface/90 max-w-md truncate">
          <Monitor className="w-3.5 h-3.5 text-dusty-pink shrink-0" aria-hidden="true" />
          <span className="truncate">Capture d’écran de référence • Interface réelle</span>
        </div>

        {/* Date de capture visible */}
        <div className="flex items-center gap-1 font-mono text-[11px] text-pale-pink shrink-0">
          <Calendar className="w-3 h-3" aria-hidden="true" />
          <span>{block.capturedAt}</span>
        </div>
      </div>

      {/* Image de capture */}
      <div className="bg-cream flex items-center justify-center border-b-2 border-ink min-h-[180px]">
        <img
          src={block.src}
          alt={altText}
          loading="lazy"
          className="w-full h-auto max-h-[550px] object-contain"
        />
      </div>

      {/* Légende explicative */}
      <figcaption className="p-3.5 bg-surface flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-ink/80">
        <span className="font-bold text-ink">{block.caption}</span>
        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-pale-pink border border-ink rounded-brutal-tag text-ink">
          Date de capture : {block.capturedAt}
        </span>
      </figcaption>
    </figure>
  );
}
