import { AlertTriangle } from 'lucide-react';
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
        <p className="text-xs text-ink">
          Une capture d’écran requiert une description textuelle complète de ce qui est visible à l’écran.
        </p>
      </div>
    );
  }

  return (
    <figure
      className="brutal-card rounded-brutal-card overflow-hidden bg-surface border-2 border-ink shadow-brutal"
      aria-label={block.caption}
    >
      {/* Barre supérieure minimaliste avec pastilles décoratives */}
      <div className="px-4 py-2 bg-ink text-surface border-b-2 border-ink flex items-center justify-start">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/90 border border-ink/40 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90 border border-ink/40 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90 border border-ink/40 inline-block" />
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
      <figcaption className="p-3.5 bg-surface text-xs font-mono text-ink">
        <span className="font-bold text-ink">{block.caption}</span>
      </figcaption>
    </figure>
  );
}
