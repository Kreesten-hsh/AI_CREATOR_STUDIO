import { AlertTriangle, Image as ImageIcon } from 'lucide-react';
import type { ImageBlockConfig } from '../../../types/course';

export function ImageBlock({ block }: { block: ImageBlockConfig }) {
  const altText = block.alt?.trim();

  // Règle stricte d'accessibilité : texte alternatif obligatoire
  if (!altText) {
    return (
      <div
        role="alert"
        className="p-4 bg-red-100 border-2 border-primary-red rounded-brutal-card text-ink space-y-1"
      >
        <div className="flex items-center gap-2 text-primary-red font-mono text-xs font-bold uppercase">
          <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Erreur d’accessibilité : Texte alternatif (alt) obligatoire manquant</span>
        </div>
        <p className="text-xs text-ink/80">
          Chaque visuel doit obligatoirement comporter un attribut alt explicite pour être intelligible par les technologies d’assistance.
        </p>
      </div>
    );
  }

  return (
    <figure
      className="brutal-card rounded-brutal-card overflow-hidden bg-surface"
      aria-label={block.caption || altText}
    >
      <div className="relative border-b-2 border-ink bg-cream flex items-center justify-center min-h-[160px]">
        <img
          src={block.src}
          alt={altText}
          loading="lazy"
          className="w-full h-auto max-h-[500px] object-contain"
        />
      </div>

      {block.caption && (
        <figcaption className="p-3 bg-surface border-t border-ink/20 flex items-center gap-2 font-mono text-xs text-ink/80 italic">
          <ImageIcon className="w-3.5 h-3.5 text-primary-red shrink-0" aria-hidden="true" />
          <span>{block.caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
