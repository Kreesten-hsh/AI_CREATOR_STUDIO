import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X, ZoomIn } from 'lucide-react';
import type { ScreenshotBlockConfig } from '../../../types/course';

export function ScreenshotBlock({ block }: { block: ScreenshotBlockConfig }) {
  const altText = block.alt?.trim();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousOverflowRef = useRef<string | null>(null);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) return;

    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflowRef.current ?? '';
      previousOverflowRef.current = null;
      triggerRef.current?.focus();
    };
  }, [isLightboxOpen, closeLightbox]);

  // Règle stricte d'accessibilité
  if (!altText) {
    return (
      <div
        role="alert"
        className="p-4 bg-pale-pink border-2 border-primary-red rounded-brutal-card text-ink space-y-1"
      >
        <div className="flex items-center gap-2 text-primary-red font-mono text-xs font-bold uppercase">
          <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Erreur d’accessibilité : Texte alternatif (alt) obligatoire manquant pour la capture</span>
        </div>
        <p className="text-xs font-sans text-ink">
          Une capture d’écran requiert une description textuelle complète de ce qui est visible à l’écran.
        </p>
      </div>
    );
  }

  const lightboxModal = isLightboxOpen ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={block.caption}
      data-testid="screenshot-lightbox"
      onClick={closeLightbox}
      className="fixed inset-0 z-50 bg-ink/85 flex items-center justify-center p-3 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl max-h-[92vh] bg-surface border-2 border-ink rounded-brutal-card shadow-brutal overflow-hidden flex flex-col"
      >
        <div className="px-4 py-2.5 bg-ink text-surface border-b-2 border-ink flex items-center justify-between gap-3 shrink-0">
          <span className="font-mono text-xs font-bold truncate">
            {block.caption}
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeLightbox}
            aria-label="Fermer l'aperçu agrandi"
            className="min-w-[44px] min-h-[44px] p-2 bg-surface text-ink border-2 border-ink rounded-brutal-btn hover:bg-pale-pink transition-colors inline-flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 min-h-0 bg-cream p-3 sm:p-5 overflow-auto flex items-center justify-center">
          <img
            src={block.src}
            alt={altText}
            className="max-w-full max-h-[78vh] w-auto h-auto object-contain border border-ink/20 rounded-brutal-tag"
          />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <figure
        className="brutal-card rounded-brutal-card overflow-hidden bg-surface border-2 border-ink shadow-brutal"
        aria-label={block.caption}
      >
        {/* Barre supérieure minimaliste avec pastilles décoratives et indicateur de zoom */}
        <div className="px-4 py-2 bg-ink text-surface border-b-2 border-ink flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/90 border border-ink/40 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90 border border-ink/40 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90 border border-ink/40 inline-block" />
          </div>

          <span
            aria-hidden="true"
            className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-cream/90"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Cliquer pour agrandir</span>
          </span>
        </div>

        {/* Image de capture cliquable pour ouvrir la Lightbox */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label={`Agrandir la capture : ${block.caption}`}
          className="group relative w-full bg-cream flex items-center justify-center border-b-2 border-ink min-h-[180px] cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-red"
        >
          <img
            src={block.src}
            alt={altText}
            loading="lazy"
            className="w-auto max-w-full h-auto max-h-[600px] object-contain"
          />
        </button>

        {/* Légende explicative (capturedAt volontairement masqué) */}
        <figcaption className="p-3.5 bg-surface text-xs font-mono text-ink">
          <span className="font-bold text-ink">{block.caption}</span>
        </figcaption>
      </figure>

      {lightboxModal &&
        (typeof document !== 'undefined'
          ? createPortal(lightboxModal, document.body)
          : lightboxModal)}
    </>
  );
}
