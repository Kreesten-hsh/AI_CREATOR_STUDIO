import { Download, ExternalLink } from 'lucide-react';
import type { ResourceBlock, ResourceItem } from '../../types/course';

export function ResourceCard({ block }: { block: ResourceBlock }) {
  const handleDownload = (res: ResourceItem) => {
    const content =
      res.downloadContent ??
      `# ${res.title}\n\n${res.description}\n\nFormat : ${res.format}\n`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = res.downloadFilename ?? `${res.id}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      className="brutal-card rounded-brutal-card overflow-hidden border-2 border-ink shadow-brutal bg-surface"
      aria-label={block.title}
    >
      <div className="px-4 py-3 bg-pale-pink border-b-2 border-ink flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3">
        <h3 className="font-display text-xs md:text-sm uppercase tracking-tight text-ink font-bold">
          {block.title}
        </h3>
        {block.description && (
          <p className="text-xs text-ink font-medium break-words">{block.description}</p>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        {block.resources.map((res) => (
          <div
            key={res.id}
            className="p-3.5 sm:p-4 bg-cream border-2 border-ink rounded-brutal-card shadow-brutal-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 bg-surface border border-ink rounded-brutal-tag text-ink shrink-0">
                  {res.format}
                </span>
                <h4 className="font-display text-sm uppercase text-ink font-bold leading-snug break-words">
                  {res.title}
                </h4>
              </div>
              <p className="text-xs text-ink leading-relaxed">{res.description}</p>
            </div>

            <div className="shrink-0">
              {res.externalUrl ? (
                <a
                  href={res.externalUrl}
                  download={res.downloadFilename}
                  target={res.externalUrl.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="brutal-btn bg-primary-red text-surface px-4 py-2.5 min-h-[44px] rounded-brutal-btn font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 hover:bg-dark-red shadow-brutal-xs w-full sm:w-auto text-left whitespace-normal break-words"
                >
                  {res.downloadFilename ? (
                    <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>
                    {res.downloadFilename
                      ? `Télécharger (${res.downloadFilename})`
                      : 'Ouvrir la ressource'}
                  </span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDownload(res)}
                  className="brutal-btn bg-primary-red text-surface px-4 py-2.5 min-h-[44px] rounded-brutal-btn font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 hover:bg-dark-red shadow-brutal-xs w-full sm:w-auto text-left whitespace-normal break-words"
                >
                  <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Télécharger ({res.downloadFilename ?? 'Fichier'})</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
