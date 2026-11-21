import React, { useState } from 'react';
import { Check, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import type { CopyBlockConfig } from '../../types/course';

/**
 * Met uniquement en évidence les champs [...] à personnaliser dans le prompt.
 */
function renderHighlightedCode(text: string): React.ReactNode {
  const parts = text.split(/(\[[^\]\n]{1,120}\])/g);
  return parts.map((part, idx) => {
    if (part.startsWith('[') && part.endsWith(']') && part.length > 2) {
      return (
        <mark
          key={idx}
          className="bg-pale-pink text-primary-red font-bold px-1 py-0.5 rounded-[3px] border border-primary-red/45"
        >
          {part}
        </mark>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export function CopyBlock({ block }: { block: CopyBlockConfig }) {
  const [copied, setCopied] = useState(false);
  const lineCount = block.content.split('\n').length;
  const isCollapsible = block.defaultExpanded !== undefined || lineCount > 15;
  const [isExpanded, setIsExpanded] = useState(block.defaultExpanded ?? !isCollapsible);
  const isPrompt = block.label.toLowerCase().includes('prompt');

  const buttonText =
    block.buttonText ?? (isPrompt ? 'Copier le prompt' : "Copier l'extrait");
  const copiedText = buttonText.toLowerCase().includes('prompt')
    ? 'Prompt copié'
    : 'Extrait copié';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(block.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = block.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section
      className="brutal-card rounded-brutal-card overflow-hidden border-2 border-ink shadow-brutal bg-surface"
      aria-label={block.title}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-pale-pink border-b-2 border-ink">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-surface text-ink border border-ink rounded-brutal-tag shrink-0">
            {block.label}
          </span>
          <span className="font-display text-xs md:text-sm uppercase text-ink font-bold leading-snug break-words">
            {block.title}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:shrink-0">
          {isCollapsible && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Masquer le contenu' : 'Voir le contenu'}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 min-h-[44px] border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase bg-surface text-ink hover:bg-cream transition-colors shadow-brutal-xs"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Masquer</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isPrompt ? 'Voir le prompt' : 'Voir le contenu'}</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? `${copiedText} dans le presse-papier` : buttonText}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[44px] border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase transition-colors shadow-brutal-xs ${
              copied
                ? 'bg-ink text-surface'
                : 'bg-primary-red text-surface hover:bg-dark-red'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                <span>{copiedText}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
                <span>{buttonText}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <pre className="p-4 md:p-5 bg-cream/70 font-mono text-xs md:text-sm text-ink overflow-x-auto max-h-72 sm:max-h-80 overflow-y-auto leading-relaxed whitespace-pre-wrap break-words">
          <code>{renderHighlightedCode(block.content)}</code>
        </pre>
      )}
    </section>
  );
}
