import { ArrowLeft, FileText, Construction } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';

export function PracticalSheetsView() {
  const { navigateToHome } = useProgress();

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
          <span className="px-3 py-1 bg-cream text-ink font-mono text-xs font-bold uppercase border-2 border-ink rounded-brutal-tag">
            SYNTHÈSES OPÉRATIONNELLES
          </span>
          <span className="font-mono text-xs font-bold text-ink/70">
            REPÈRES MÉTHODOLOGIQUES
          </span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-ink flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary-red" aria-hidden="true" />
          <span>Fiches pratiques</span>
        </h2>
      </header>

      {/* État vide en cours de reconstruction */}
      <section
        aria-label="État de la section"
        className="brutal-card rounded-brutal-card bg-surface p-8 sm:p-12 border-2 border-ink shadow-brutal text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 bg-pale-pink border-2 border-ink rounded-brutal-btn shadow-brutal-xs">
          <Construction className="w-7 h-7 text-primary-red" aria-hidden="true" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="font-display text-xl uppercase tracking-tight text-ink">
            Contenu en cours de reconstruction.
          </h3>
          <p className="font-serif text-sm text-ink/75 leading-relaxed">
            Les fiches pratiques canoniques sont en cours de refonte structurelle.
          </p>
        </div>
      </section>
    </div>
  );
}
