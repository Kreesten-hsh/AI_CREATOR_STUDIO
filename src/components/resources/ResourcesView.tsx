import { useState } from 'react';
import { ArrowLeft, BookOpen, Check, Copy, Download, ExternalLink } from 'lucide-react';
import { RESOURCE_CATEGORIES } from '../../data/navigation/resources';
import { useProgress } from '../../hooks/useProgress';

export function ResourcesView() {
  const { navigateToHome } = useProgress();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Bouton retour */}
      <button
        type="button"
        onClick={navigateToHome}
        className="group inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ink/75 hover:text-primary-red transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
        <span>RETOUR AU SOMMAIRE DE LA FORMATION</span>
      </button>

      {/* En-tête */}
      <header className="brutal-card rounded-brutal-card bg-surface p-6 sm:p-8 border-2 border-ink shadow-brutal space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-pale-pink text-ink font-mono text-xs font-bold uppercase border-2 border-ink rounded-brutal-tag">
            BOÎTE À OUTILS
          </span>
          <span className="font-mono text-xs font-bold text-ink/70">
            AIDE-MÉMOIRES, TEMPLATES ET DÉMOS
          </span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-ink">
          Ressources &amp; Fiches Pratiques
        </h2>

        <p className="font-serif text-base text-ink/85 max-w-3xl leading-relaxed">
          Toutes les ressources techniques, les directives d&apos;anti-slop visuel pour Claude Artifacts,
          les templates de code autonomes et les check-lists prêtes à l&apos;emploi.
        </p>
      </header>

      {/* Catégories de ressources */}
      <div className="space-y-8">
        {RESOURCE_CATEGORIES.map((category) => (
          <section key={category.id} className="space-y-4">
            <div>
              <h3 className="font-display text-xl uppercase tracking-tight text-ink flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary-red" aria-hidden="true" />
                {category.title}
              </h3>
              <p className="font-serif text-sm text-ink/75 mt-0.5">
                {category.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className="brutal-card rounded-brutal-card bg-surface p-5 border-2 border-ink shadow-brutal-xs flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-cream border border-ink rounded-brutal-tag text-ink uppercase">
                        {item.format}
                      </span>
                    </div>

                    <h4 className="font-display text-base uppercase tracking-tight leading-snug">
                      {item.title}
                    </h4>

                    <p className="font-serif text-xs text-ink/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t-2 border-ink/10 flex flex-wrap items-center gap-2">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="brutal-btn rounded-brutal-btn bg-primary-red text-surface hover:bg-dark-red px-3 py-1.5 font-mono text-xs font-bold uppercase inline-flex items-center gap-1.5 border border-ink min-h-[34px]"
                      >
                        <span>Ouvrir la démo</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    )}

                    {item.content && item.downloadFilename && (
                      <button
                        type="button"
                        onClick={() => handleDownload(item.downloadFilename!, item.content!)}
                        className="brutal-btn rounded-brutal-btn bg-cream hover:bg-pale-pink text-ink px-3 py-1.5 font-mono text-xs font-bold uppercase inline-flex items-center gap-1.5 border border-ink min-h-[34px]"
                      >
                        <Download className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Télécharger</span>
                      </button>
                    )}

                    {item.content && (
                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, item.content!)}
                        className="brutal-btn rounded-brutal-btn bg-surface hover:bg-pale-pink text-ink px-3 py-1.5 font-mono text-xs font-bold uppercase inline-flex items-center gap-1.5 border border-ink min-h-[34px]"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-primary-red stroke-[3]" aria-hidden="true" />
                            <span className="text-primary-red">Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Copier</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
