import { ArrowRight } from 'lucide-react';

/**
 * URL officielle du programme d'affiliation Chariow de la boutique AI CREATOR STUDIO
 * (offre active afp_w34936qbvl1k sur le produit prd_mnk5kr0q, commission 15 %).
 */
export const CHARIOW_AFFILIATION_URL = 'https://gqqyuklr.mychariow.store/affiliation';

/**
 * Encart d'affiliation Chariow compacté et placé sous la feuille de route
 * afin de prioriser le démarrage du cours sur le premier écran.
 */
export function CourseAffiliateCard() {
  return (
    <section
      aria-label="Programme d'affiliation Chariow"
      className="rounded-brutal-card bg-surface text-ink border-2 border-ink shadow-brutal overflow-hidden"
    >
      <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-block px-2.5 py-0.5 bg-pale-pink text-ink border border-ink rounded-full font-mono text-[10px] font-bold uppercase tracking-wider shadow-brutal-xs">
            LANCEMENT UNIQUEMENT · CHARIOW
          </span>

          <h2 className="font-serif text-xl sm:text-2xl leading-tight text-ink">
            Partage ce cours + gagne{' '}
            <span className="italic text-primary-red">15%</span>
          </h2>

          <p className="font-sans text-xs sm:text-sm text-ink leading-relaxed">
            En achetant ce mini-cours, tu es déjà automatiquement affilié sur Chariow : il te
            suffit de récupérer ton lien personnel. Partage-le pendant la période de lancement et
            touche une commission sur chaque vente générée grâce à toi.
          </p>
        </div>

        <div className="shrink-0">
          <a
            href={CHARIOW_AFFILIATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-btn rounded-brutal-btn bg-primary-red hover:bg-dark-red text-surface px-4 py-2.5 min-h-[44px] font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 border-2 border-ink shadow-brutal-xs transition-all w-full md:w-auto"
          >
            <span>Récupérer mon lien Chariow</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
