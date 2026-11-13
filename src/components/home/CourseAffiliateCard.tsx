import { ArrowRight } from 'lucide-react';

/**
 * Encart d'affiliation Chariow affiché sous le Hero sur la page d'accueil.
 * Transforme chaque élève en affilié dès son achat pendant la campagne de lancement.
 */
export function CourseAffiliateCard() {
  return (
    <section
      aria-label="Programme d'affiliation Chariow"
      className="rounded-brutal-card bg-surface text-ink border-2 border-ink shadow-brutal overflow-hidden"
    >
      <div className="p-6 sm:p-7 md:p-8 space-y-4 max-w-2xl">
        <div>
          <span className="inline-block px-3 py-0.5 bg-pale-pink text-ink border border-ink rounded-full font-mono text-[10px] font-bold uppercase tracking-wider shadow-brutal-xs">
            LANCEMENT UNIQUEMENT · CHARIOW
          </span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl leading-tight text-ink">
          Partage ce cours + gagne{' '}
          <span className="italic text-primary-red">15%</span>
        </h2>

        <p className="text-sm sm:text-base text-ink leading-relaxed">
          En achetant ce mini-cours, tu es déjà automatiquement affilié sur Chariow : il te
          suffit de récupérer ton lien personnel. Partage-le pendant la période de lancement et
          touche une commission sur chaque vente générée grâce à toi.
        </p>

        {/* Aucune action câblée volontairement avant branchement du lien d'affiliation Chariow */}
        <div className="pt-1">
          <button
            type="button"
            className="brutal-btn rounded-brutal-btn bg-primary-red hover:bg-dark-red text-surface px-5 py-2.5 min-h-[44px] font-mono text-xs font-bold uppercase inline-flex items-center gap-2 border-2 border-ink shadow-brutal-xs transition-all"
          >
            <span>Récupérer mon lien Chariow</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
