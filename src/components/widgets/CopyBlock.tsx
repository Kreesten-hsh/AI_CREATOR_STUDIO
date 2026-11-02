import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import type { CopyBlockConfig } from '../../types/course';

export function CopyBlock({ block }: { block: CopyBlockConfig }) {
  const [copied, setCopied] = useState(false);

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
    <section className="brutal-card rounded-brutal-card overflow-hidden" aria-label={block.title}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-ink text-surface border-b-2 border-ink">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-dusty-pink shrink-0" aria-hidden="true" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-cream">
            {block.label}
          </span>
          <span className="text-xs text-cream/70 hidden sm:inline">({block.title})</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] border-2 border-surface rounded-brutal-btn font-mono text-xs font-bold uppercase transition-colors ${
            copied
              ? 'bg-primary-red text-surface border-surface'
              : 'bg-surface text-ink hover:bg-pale-pink'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
              Extrait copié
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
              Copier l&apos;extrait
            </>
          )}
        </button>
      </div>
      <pre className="p-4 md:p-5 bg-cream font-mono text-xs md:text-sm text-ink overflow-x-auto leading-relaxed whitespace-pre-wrap">
        <code>{block.content}</code>
      </pre>
      {block.notes && (
        <div className="px-4 py-2.5 bg-surface border-t-2 border-ink text-xs font-medium text-ink/80">
          {block.notes}
        </div>
      )}
    </section>
  );
}
