import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Copy,
  Check,
  Download,
  AlertTriangle,
} from 'lucide-react';
import type { MarketingResource } from '../../types/marketing';

interface MarketingDetailModalProps {
  resource: MarketingResource | null;
  onClose: () => void;
}

export function MarketingDetailModal({ resource, onClose }: MarketingDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Capture, restauration du focus et réinitialisation de l'état de copie
  useEffect(() => {
    setCopied(false);
    setCopyError(false);
    if (resource) {
      triggerElementRef.current = document.activeElement as HTMLElement | null;
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);
    } else if (triggerElementRef.current) {
      triggerElementRef.current.focus();
    }
  }, [resource]);

  // Focus trap, touche Escape et verrouillage du scroll arrière-plan
  useEffect(() => {
    if (!resource) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
        );

        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [resource, onClose]);

  if (!resource) return null;

  const handleCopyPrompt = async () => {
    const textToCopy = resource.readyPrompt.fullPrompt;
    let successful = false;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        successful = true;
      } catch {
        // Fallback ci-dessous
      }
    }

    if (!successful) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        successful = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        successful = false;
      }
    }

    if (successful) {
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  const modalNode = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-resource-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-ink/75"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-4xl bg-surface border-2 border-ink rounded-brutal-card shadow-brutal overflow-hidden max-h-[90vh] flex flex-col focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête de la modale ancré en haut */}
        <header className="shrink-0 p-5 sm:p-6 border-b-2 border-ink bg-cream flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-primary-red text-surface font-mono text-[11px] font-bold uppercase rounded-full border border-ink shadow-brutal-xs">
                {resource.categoryLabel}
              </span>
            </div>

            <h2
              id="modal-resource-title"
              className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-ink leading-tight"
            >
              {resource.title}
            </h2>

            <p className="font-serif text-sm text-ink leading-relaxed">
              {resource.shortDescription}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Fermer la fiche"
            className="p-2 border-2 border-ink rounded-brutal-btn bg-surface text-ink hover:bg-pale-pink shadow-brutal-xs shrink-0 transition-transform active:translate-x-[1px] active:translate-y-[1px] focus:outline-2 focus:outline-primary-red min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
          </button>
        </header>

        {/* Corps scrollable autonome de la fiche */}
        <div className="flex-1 min-h-0 p-5 sm:p-6 md:p-8 overflow-y-auto space-y-7 font-serif text-ink">
          {/* Note spécifique d'accompagnement si applicable */}
          {resource.specificNotice && (
            <div className="p-4 bg-pale-pink/50 border-2 border-ink rounded-brutal-card flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-primary-red shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-0.5 text-xs sm:text-sm">
                <span className="font-mono font-bold uppercase tracking-wider text-primary-red block">
                  Consigne pédagogique spécifique
                </span>
                <p className="text-ink leading-relaxed font-medium">
                  {resource.specificNotice}
                </p>
              </div>
            </div>
          )}

          {/* Section A & B : Problème résolu & Quand l'utiliser */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="p-4 bg-cream border border-ink/40 rounded-brutal-card space-y-2">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                Problème résolu
              </h3>
              <p className="text-xs sm:text-sm text-ink leading-relaxed font-sans">
                {resource.concreteProblem}
              </p>
            </section>

            <section className="p-4 bg-cream border border-ink/40 rounded-brutal-card space-y-2">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                Quand l'utiliser
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-ink font-sans">
                {resource.whenToUse.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono font-bold text-primary-red">0{idx + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Section C : Exemple fictif */}
          <section className="p-5 bg-surface border-2 border-ink rounded-brutal-card space-y-2.5 shadow-brutal-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/20 pb-2">
              <span className="inline-block px-2 py-0.5 bg-pale-pink text-ink border border-ink rounded-full font-mono text-[10px] font-bold uppercase">
                Exemple fictif
              </span>
              <span className="font-serif text-xs text-ink font-medium italic">
                {resource.digitalProductScenario.productName}
              </span>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="text-ink leading-relaxed font-sans">
                <strong className="text-ink font-bold">Le défi : </strong>
                {resource.digitalProductScenario.context}
              </p>
              <p className="text-ink leading-relaxed bg-cream/70 p-3 rounded-brutal-card border border-ink/40 font-sans">
                <strong className="text-ink font-bold">Application du Skill : </strong>
                {resource.digitalProductScenario.execution}
              </p>
            </div>
          </section>

          {/* Section D : Prompt prêt à copier */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-lg uppercase tracking-tight text-ink">
                  Prompt prêt à copier
                </h3>
                <p className="text-xs text-ink font-medium font-sans">
                  {resource.readyPrompt.mission}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyPrompt}
                className="brutal-btn rounded-brutal-btn px-4 py-2 min-h-[44px] font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-1.5 bg-primary-red text-surface border-2 border-ink hover:bg-dark-red shadow-brutal-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-surface stroke-[2.5]" aria-hidden="true" />
                    <span>Prompt copié !</span>
                  </>
                ) : copyError ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-surface" aria-hidden="true" />
                    <span>Échec copie</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-surface stroke-[2]" aria-hidden="true" />
                    <span>Copier le prompt</span>
                  </>
                )}
              </button>
            </div>

            {copyError && (
              <p className="text-xs font-mono text-primary-red bg-pale-pink/60 p-2 rounded border border-ink/30">
                La copie automatique a échoué. Veuillez sélectionner et copier le texte manuellement ci-dessous.
              </p>
            )}

            {/* Bloc de code prompt */}
            <div className="p-4 bg-ink text-surface rounded-brutal-card border-2 border-ink font-mono text-xs leading-relaxed overflow-x-auto max-h-[340px]">
              <pre className="whitespace-pre-wrap text-[11px] sm:text-xs text-surface">
                {resource.readyPrompt.fullPrompt}
              </pre>
            </div>
            <p className="font-serif text-xs text-ink font-medium italic">
              {resource.readyPrompt.explanation}
            </p>
          </section>

          {/* Section E : Résultat attendu */}
          <section className="p-4 sm:p-5 bg-pale-pink/35 border border-ink/40 rounded-brutal-card space-y-2">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
              Résultat attendu
            </h3>
            <p className="text-xs sm:text-sm text-ink leading-relaxed font-sans">
              {resource.expectedResult.summary}
            </p>
            <div className="p-3 bg-surface border border-ink/40 rounded text-xs font-mono text-ink whitespace-pre-line leading-relaxed">
              {resource.expectedResult.sampleOutput}
            </div>
          </section>

          {/* Section F & G : Télécharger et utiliser */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-ink/20">
            {/* Téléchargement ou Statut de distribution sobre */}
            <section className="md:col-span-5 p-4 bg-cream border border-ink/40 rounded-brutal-card flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                  Télécharger et utiliser
                </h3>

                {resource.download.isAvailable && resource.download.downloadUrl ? (
                  <>
                    <span className="font-mono text-xs font-semibold text-ink block">
                      {resource.download.fileName} {resource.download.fileSize ? `(${resource.download.fileSize})` : ''}
                    </span>
                    <div className="text-[11px] text-ink font-mono">
                      Fichiers de référence :
                      <ul className="list-disc list-inside">
                        {resource.download.includedFiles.map((file, i) => (
                          <li key={i} className="break-all sm:break-words">{file}</li>
                        ))}
                      </ul>
                    </div>

                    {resource.download.licenseInfo && (
                      <p className="text-[11px] font-mono text-ink pt-1 border-t border-ink/25">
                        {resource.download.licenseInfo}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="space-y-1.5 pt-1">
                    <span className="font-mono text-[11px] font-bold text-ink block">
                      Prompt direct · Archive non distribuée.
                    </span>
                    <p className="text-[11px] font-serif text-ink leading-relaxed">
                      {resource.download.statusNote ||
                        'Téléchargement de l’archive ZIP indisponible (en attente de clarification des droits de redistribution).'}
                    </p>
                    {resource.download.licenseInfo && (
                      <p className="text-[11px] font-mono text-ink pt-1 border-t border-ink/25">
                        {resource.download.licenseInfo}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {resource.download.isAvailable && resource.download.downloadUrl && (
                <a
                  href={resource.download.downloadUrl}
                  download
                  className="brutal-btn rounded-brutal-btn px-4 py-2.5 min-h-[44px] font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 bg-surface text-ink border-2 border-ink hover:bg-pale-pink shadow-brutal-xs"
                >
                  <Download className="w-4 h-4 text-primary-red stroke-[2.5]" aria-hidden="true" />
                  <span>Télécharger l'archive</span>
                </a>
              )}
            </section>

            {/* Guide d'utilisation */}
            <section className="md:col-span-7 p-4 bg-surface border border-ink/40 rounded-brutal-card space-y-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink block">
                Guide d'utilisation & compatibilité
              </span>
              <ol className="space-y-1 text-xs text-ink font-sans">
                {resource.usageInstructions.quickStart.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="font-mono font-bold text-primary-red">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="text-[11px] text-ink pt-1 border-t border-ink/20 font-sans font-medium">
                {resource.usageInstructions.compatibilityNotes}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalNode, document.body);
  }

  return modalNode;
}
