import { ArrowRight, BookOpen, Gift, Sparkles } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { MAIN_COURSES } from '../../data/navigation/mainCourses';
import { BONUSES } from '../../data/navigation/bonuses';

export function CourseOverview() {
  const { navigateToCourse, navigateToBonus, navigateToResources, globalProgress } = useProgress();

  return (
    <div className="space-y-10">
      {/* 1. Section : Les 5 Formations */}
      <section aria-label="Sommaire des 5 formations" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary-red flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              CURRICULUM STRUCTURÉ
            </span>
            <h3 className="font-display text-2xl uppercase tracking-tight text-ink mt-0.5">
              Vos 5 Modules de Formation
            </h3>
          </div>
          <span className="font-mono text-xs font-bold px-3 py-1 bg-surface border-2 border-ink rounded-brutal-tag text-ink/80">
            25 LEÇONS : 100 ÉTAPES PRATIQUES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MAIN_COURSES.map((course) => {
            const isFirst = course.id === 'course-01';
            // Calculer la complétion pour le module
            const isCompleted =
              course.dayRange &&
              Array.from(
                { length: course.dayRange[1] - course.dayRange[0] + 1 },
                (_, i) => course.dayRange![0] + i
              ).every((day) => globalProgress.completedDayNumbers.includes(day));

            return (
              <div
                key={course.id}
                className={`brutal-card rounded-brutal-card p-5 border-2 border-ink transition-all flex flex-col justify-between gap-4 ${
                  isFirst
                    ? 'bg-surface shadow-brutal'
                    : 'bg-surface/90 shadow-brutal-xs hover:shadow-brutal'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-cream border border-ink rounded-brutal-tag">
                      MODULE {course.orderNumber}
                    </span>
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-brutal-tag border border-ink ${
                        isCompleted
                          ? 'bg-ink text-surface'
                          : isFirst
                          ? 'bg-pale-pink text-ink'
                          : 'bg-cream text-ink/70'
                      }`}
                    >
                      {isCompleted ? 'VALIDÉ' : course.badge}
                    </span>
                  </div>

                  <h4 className="font-display text-lg uppercase tracking-tight leading-tight">
                    {course.title}
                  </h4>

                  <p className="font-serif text-sm text-ink/80 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-3 border-t-2 border-ink/10 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-ink/70">
                    {course.lessonCount} leçons
                  </span>

                  <button
                    type="button"
                    onClick={() => navigateToCourse(course.id, course.dayRange?.[0] ?? 1)}
                    className="brutal-btn rounded-brutal-btn bg-surface text-ink hover:bg-pale-pink px-3.5 py-2 font-mono text-xs font-bold uppercase inline-flex items-center gap-1.5 min-h-[38px] border-2 border-ink"
                  >
                    <span>Ouvrir le module</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Section : Les 3 Bonus Offerts */}
      <section aria-label="Bonus inclus" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary-red flex items-center gap-1.5">
              <Gift className="w-4 h-4" aria-hidden="true" />
              ACCÉLÉRATEURS INCLUS
            </span>
            <h3 className="font-display text-2xl uppercase tracking-tight text-ink mt-0.5">
              3 Bonus Pratiques Spécialisés
            </h3>
          </div>
          <span className="font-mono text-xs font-bold px-3 py-1 bg-pale-pink border-2 border-ink rounded-brutal-tag text-ink">
            INCLUS SANS SUPPLÉMENT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BONUSES.map((bonus) => (
            <div
              key={bonus.id}
              className="brutal-card rounded-brutal-card bg-surface p-5 border-2 border-ink shadow-brutal-xs hover:shadow-brutal transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-pale-pink border border-ink rounded-brutal-tag">
                    {bonus.orderNumber}
                  </span>
                  <span className="font-mono text-[10px] text-ink/70 font-bold">
                    {bonus.duration}
                  </span>
                </div>

                <h4 className="font-display text-base uppercase tracking-tight leading-tight">
                  {bonus.title}
                </h4>

                <p className="font-serif text-xs text-ink/80 leading-relaxed">
                  {bonus.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigateToBonus(bonus.id)}
                className="brutal-btn rounded-brutal-btn bg-cream hover:bg-pale-pink text-ink px-3 py-2 font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-1.5 border-2 border-ink w-full min-h-[38px]"
              >
                <span>Accéder au bonus</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Section : Ressources & Fiches Pratiques */}
      <section
        aria-label="Ressources et fiches pratiques"
        className="brutal-card rounded-brutal-card bg-pale-pink/40 p-6 border-2 border-ink shadow-brutal-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6"
      >
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-surface border border-ink rounded-brutal-tag text-ink uppercase">
              BIBLIOTHÈQUE OUTILS
            </span>
            <span className="font-mono text-xs text-ink/75 font-bold">
              Templates, fiches mémo et check-lists
            </span>
          </div>
          <h4 className="font-display text-xl uppercase tracking-tight">
            Ressources &amp; Fiches Pratiques Téléchargeables
          </h4>
          <p className="font-serif text-sm text-ink/85">
            Retrouvez tous les aide-mémoires Claude Artifacts, les directives d&apos;anti-slop visuel,
            et les démonstrations autonomes complètes prêtes au déploiement.
          </p>
        </div>

        <button
          type="button"
          onClick={navigateToResources}
          className="brutal-btn rounded-brutal-btn bg-primary-red text-surface hover:bg-dark-red px-5 py-3 font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 border-2 border-ink shrink-0 min-h-[44px]"
        >
          <BookOpen className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
          <span>Consulter les ressources</span>
        </button>
      </section>
    </div>
  );
}
