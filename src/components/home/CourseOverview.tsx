import { ArrowRight, BookOpen, FileText, CheckCircle2 } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { MAIN_COURSES } from '../../data/navigation/mainCourses';
import { BONUSES } from '../../data/navigation/bonuses';

export function CourseOverview() {
  const {
    navigateToCourse,
    navigateToBonus,
    navigateToResources,
    navigateToDay,
  } = useProgress();

  return (
    <div className="space-y-8 select-none">
      {/* 0. Section : Start Here & Document-First */}
      <section aria-label="Prérequis et démarrage" className="space-y-3">
        <div className="brutal-card rounded-brutal-card bg-surface p-5 border-2 border-ink shadow-brutal flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-dusty-pink text-ink border border-ink rounded-brutal-tag uppercase">
                START HERE • APPROCHE DOCUMENT-FIRST
              </span>
            </div>
            <h3 className="font-display text-lg sm:text-xl uppercase tracking-tight text-ink">
              Votre document existant est le point de départ
            </h3>
            <p className="font-serif text-sm text-ink/80 leading-relaxed max-w-3xl">
              Vous n’avez pas à inventer un produit à partir d’une page blanche. Munissez-vous d’un guide PDF, d’un ebook, d’un tableur ou de vos notes méthodologiques existantes : c’est cette matière brute que vous allez transformer en outil interactif autonome avec Claude, héberger sur Netlify et vendre sur Chariow.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-ink/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-red shrink-0" aria-hidden="true" />
                <span>Aucun départ de zéro</span>
              </div>
              <div className="flex items-center gap-1.5 text-ink/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-red shrink-0" aria-hidden="true" />
                <span>Design choisi au Jour 4</span>
              </div>
              <div className="flex items-center gap-1.5 text-ink/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-red shrink-0" aria-hidden="true" />
                <span>Sauvegarde dans Mon Projet</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex sm:flex-col gap-2">
            <button
              type="button"
              onClick={() => navigateToDay(1)}
              className="brutal-btn rounded-brutal-btn bg-primary-red text-surface hover:bg-ink px-4 py-2.5 font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 border-2 border-ink shadow-brutal-xs min-h-[42px] transition-all"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>Démarrer avec mon document (J1)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 1. Section : Les 3 Modules */}
      <section aria-label="Les 3 modules" className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-xl uppercase tracking-tight text-ink">
            Vos modules
          </h3>
          <span className="font-mono text-xs font-bold text-ink/70 uppercase">
            3 modules • 9 leçons pratiques
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {MAIN_COURSES.map((course) => (
            <div
              key={course.id}
              className="brutal-card rounded-brutal-card p-4 bg-surface border-2 border-ink shadow-brutal-xs flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-cream border border-ink rounded-brutal-tag shrink-0">
                    MODULE {course.orderNumber}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-ink/70">
                    {course.lessonCount} leçons
                  </span>
                </div>
                <h4 className="font-display text-sm uppercase tracking-tight text-ink leading-snug">
                  {course.title}
                </h4>
                <p className="text-xs text-ink/75 leading-relaxed">
                  {course.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigateToCourse(course.id, course.dayRange?.[0] ?? 1)}
                className="brutal-btn rounded-brutal-btn bg-surface hover:bg-pale-pink text-ink px-3 py-2 font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-1.5 border border-ink w-full min-h-[36px]"
              >
                <span>Ouvrir</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Section : Les 2 Bonus */}
      <section aria-label="Bonus" className="space-y-3">
        <h3 className="font-display text-xl uppercase tracking-tight text-ink">
          Bonus
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {BONUSES.map((bonus) => (
            <div
              key={bonus.id}
              className="brutal-card rounded-brutal-card bg-surface p-4 border-2 border-ink shadow-brutal-xs flex flex-col justify-between gap-3"
            >
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-pale-pink border border-ink rounded-brutal-tag text-ink uppercase">
                  {bonus.orderNumber}
                </span>
                <h4 className="font-display text-sm uppercase tracking-tight text-ink leading-tight pt-1">
                  {bonus.title}
                </h4>
                <p className="text-xs text-ink/75 leading-relaxed">
                  {bonus.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigateToBonus(bonus.id)}
                className="brutal-btn rounded-brutal-btn bg-cream hover:bg-pale-pink text-ink px-3 py-2 font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-1.5 border border-ink w-full min-h-[36px]"
              >
                <span>Accéder</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Section : Ressources */}
      <section aria-label="Ressources">
        <div className="brutal-card rounded-brutal-card bg-surface p-5 border-2 border-ink shadow-brutal-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-pale-pink border border-ink rounded-brutal-tag uppercase">
              BOÎTE À OUTILS
            </span>
            <h4 className="font-display text-base uppercase tracking-tight text-ink mt-2">
              Ressources et fiches pratiques
            </h4>
            <p className="font-serif text-xs text-ink/75 mt-0.5">
              Aide-mémoires d&apos;architecture autonome, prototype de référence et checklist de pré-lancement Chariow.
            </p>
          </div>

          <button
            type="button"
            onClick={navigateToResources}
            className="brutal-btn rounded-brutal-btn bg-surface hover:bg-pale-pink text-ink px-4 py-2 font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 border border-ink shrink-0 min-h-[38px]"
          >
            <BookOpen className="w-4 h-4 text-primary-red" aria-hidden="true" />
            <span>Consulter les ressources</span>
          </button>
        </div>
      </section>
    </div>
  );
}
