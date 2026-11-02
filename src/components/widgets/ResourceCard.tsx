import { Download, ExternalLink, FileText } from 'lucide-react';
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
    <section className="brutal-card rounded-brutal-card p-5 md:p-6" aria-label={block.title}>
      <div className="pb-3 mb-4 border-b-2 border-ink">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-pale-pink border border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase text-ink">
          <FileText className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
          PACK DE RESSOURCES
        </span>
        <h3 className="font-display text-lg md:text-xl uppercase tracking-tight mt-1.5 text-ink">
          {block.title}
        </h3>
        {block.description && (
          <p className="text-sm text-ink/80 mt-0.5">{block.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {block.resources.map((res) => (
          <div
            key={res.id}
            className="p-4 bg-cream border-2 border-ink rounded-brutal-card shadow-brutal-xs flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] font-bold uppercase px-2 py-0.5 bg-surface border border-ink rounded-brutal-tag text-ink">
                  {res.category}
                </span>
                <span className="font-mono text-[11px] font-bold text-ink/70">
                  {res.format}
                </span>
              </div>
              <h4 className="font-display text-base uppercase text-ink">{res.title}</h4>
              <p className="text-xs md:text-sm text-ink/80 mt-1 leading-relaxed">
                {res.description}
              </p>
            </div>

            {res.externalUrl ? (
              <a
                href={res.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn bg-surface text-ink px-3.5 py-2 min-h-[42px] rounded-brutal-btn font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 hover:bg-pale-pink"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                Ouvrir la ressource
              </a>
            ) : (
              <button
                type="button"
                onClick={() => handleDownload(res)}
                className="brutal-btn bg-primary-red text-surface px-3.5 py-2 min-h-[42px] rounded-brutal-btn font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 hover:bg-dark-red"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                Télécharger la fiche ({res.downloadFilename ?? 'MD'})
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
