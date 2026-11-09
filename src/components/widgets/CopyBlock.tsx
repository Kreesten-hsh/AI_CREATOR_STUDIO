import { useState } from 'react';
import { Check, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import type { CopyBlockConfig } from '../../types/course';

export function CopyBlock({ block }: { block: CopyBlockConfig }) {
  const [copied, setCopied] = useState(false);
  const isCollapsible = block.defaultExpanded !== undefined || block.content.split('\n').length > 15;
  const [isExpanded, setIsExpanded] = useState(block.defaultExpanded ?? !isCollapsible);

  const buttonText =
    block.buttonText ??
    (block.label.toLowerCase().includes('prompt') ? 'Copier le prompt' : "Copier l'extrait");
  const copiedText = buttonText.toLowerCase().includes('prompt') ? 'Prompt copié' : 'Extrait copié';

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
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-surface text-ink border border-ink rounded-brutal-tag shrink-0">
            {block.label}
          </span>
          <span className="font-display text-xs md:text-sm uppercase text-ink truncate font-bold">
            {block.title}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? `${copiedText} dans le presse-papier` : buttonText}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 min-h-[36px] border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase transition-colors shadow-brutal-xs ${
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

      {isCollapsible && (
        <div className="px-4 py-2 bg-cream/40 flex items-center justify-between text-xs border-b-2 border-ink/10">
          <span className="font-mono text-[11px] text-ink/70">
            {isExpanded ? 'Contenu complet affiché' : 'Contenu masqué pour plus de clarté'}
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="inline-flex items-center gap-1 font-mono text-xs font-bold text-ink hover:text-primary-red underline cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Masquer le contenu</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Voir le contenu</span>
              </>
            )}
          </button>
        </div>
      )}

      {isExpanded && (
        <pre className="p-4 md:p-5 bg-cream/70 font-mono text-xs md:text-sm text-ink overflow-x-auto max-h-72 sm:max-h-80 overflow-y-auto leading-relaxed whitespace-pre-wrap">
          <code>{block.content}</code>
        </pre>
      )}

      {block.notes && (
        <div className="px-4 py-2.5 bg-surface border-t-2 border-ink text-xs font-medium text-ink/80 flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 bg-cream border border-ink/40 rounded-brutal-tag text-ink">
            Note
          </span>
          <span>{block.notes}</span>
        </div>
      )}
    </section>
  );
}
