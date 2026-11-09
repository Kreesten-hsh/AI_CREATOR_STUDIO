import { useState } from 'react';
import { Compass, Copy, Check, Sparkles, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import type { CompetitivePromptResource } from '../../types/marketing';

interface CompetitivePromptCardProps {
  promptConfig: CompetitivePromptResource;
}

export function CompetitivePromptCard({ promptConfig }: CompetitivePromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async () => {
    const textToCopy = promptConfig.fullPrompt;
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

  return (
    <article
      aria-label={promptConfig.title}
      className="brutal-card rounded-brutal-card bg-surface border-2 border-ink shadow-brutal overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Bandeau latéral gauche décoratif */}
        <div className="lg:col-span-3 bg-checkerboard-pink p-6 flex flex-col items-center justify-center text-center border-b-2 lg:border-b-0 lg:border-r-2 border-ink min-h-[140px]">
          <div className="bg-surface border-2 border-ink rounded-brutal-card shadow-brutal px-4 py-3 -rotate-1">
            <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary-red">
              RESSOURCE CLÉ
            </span>
            <Compass className="w-8 h-8 text-primary-red mx-auto my-1.5" aria-hidden="true" />
            <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-ink/75">
              VEILLE MARCHÉ
            </span>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-9 p-6 sm:p-7 flex flex-col justify-between gap-4">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary-red text-surface border border-ink rounded-brutal-tag font-mono text-[11px] font-bold uppercase shadow-brutal-xs">
                <Sparkles className="w-3 h-3 text-surface" aria-hidden="true" />
                {promptConfig.badge}
              </span>
              <span className="font-mono text-xs text-ink/70">
                Claude & ChatGPT avec recherche Web
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-ink leading-tight">
              {promptConfig.title}
            </h3>

            <p className="font-serif text-sm text-ink/80 leading-relaxed max-w-3xl">
              {promptConfig.description}
            </p>
          </div>

          {/* Règles d’or et boutons d’action */}
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-serif text-ink/85">
              <div className="p-2.5 bg-cream border border-ink/40 rounded-brutal-btn flex items-start gap-2">
                <span className="font-mono font-bold text-primary-red">✓</span>
                <span>Sources Web réelles, informations vérifiables et hypothèses clairement séparées.</span>
              </div>
              <div className="p-2.5 bg-cream border border-ink/40 rounded-brutal-btn flex items-start gap-2">
                <span className="font-mono font-bold text-primary-red">✓</span>
                <span>Distinction stricte des faits observés et hypothèses stratégiques.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="brutal-btn rounded-brutal-btn px-4 py-2.5 min-h-[42px] font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 bg-primary-red text-surface border-2 border-ink hover:bg-dark-red shadow-brutal-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-surface stroke-[2.5]" aria-hidden="true" />
                    <span>Prompt copié dans le presse-papier !</span>
                  </>
                ) : copyError ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-surface" aria-hidden="true" />
                    <span>Échec de la copie</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-surface stroke-[2]" aria-hidden="true" />
                    <span>Copier le prompt universel</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="brutal-btn rounded-brutal-btn px-3.5 py-2.5 min-h-[42px] font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-1.5 bg-surface text-ink border-2 border-ink hover:bg-cream"
              >
                <span>{isExpanded ? 'Masquer le prompt' : 'Afficher le prompt complet'}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                )}
              </button>
            </div>

            {copyError && (
              <p className="text-xs font-mono text-primary-red bg-pale-pink/60 p-2 rounded border border-ink/30">
                La copie automatique a échoué. Veuillez afficher le prompt complet et le copier manuellement.
              </p>
            )}

            {/* Vue dépliante du prompt */}
            {isExpanded && (
              <div className="mt-3 p-4 bg-ink text-surface rounded-brutal-card border-2 border-ink space-y-3 font-mono text-xs leading-relaxed overflow-x-auto max-h-[400px]">
                <div className="flex items-center justify-between border-b border-surface/20 pb-2">
                  <span className="text-[11px] uppercase tracking-wider text-dusty-pink font-bold">
                    PROMPT COMPLET PRÊT À L'EMPLOI
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2 py-1 bg-surface text-ink text-[10px] font-bold uppercase border border-surface rounded hover:bg-cream"
                  >
                    {copied ? 'Copié !' : 'Copier'}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-surface/90">
                  {promptConfig.fullPrompt}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
