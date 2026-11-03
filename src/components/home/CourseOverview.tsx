import { ArrowRight, BookOpen } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { MAIN_COURSES } from '../../data/navigation/mainCourses';
import { BONUSES } from '../../data/navigation/bonuses';

export function CourseOverview() {
  const { navigateToCourse, navigateToBonus, navigateToResources } = useProgress();

  return (
    <div className="space-y-8 select-none">
      {/* 1. Section : Formations */}
      <section aria-label="Les 5 modules" className="space-y-3">
        <h3 className="font-display text-xl uppercase tracking-tight text-ink">
          Vos formations
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {MAIN_COURSES.map((course) => (
            <div
              key={course.id}
              className="brutal-card rounded-brutal-card p-4 bg-surface border-2 border-ink shadow-brutal-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-cream border border-ink rounded-brutal-tag shrink-0">
                  {course.orderNumber}
                </span>
                <span className="font-display text-sm uppercase tracking-tight text-ink">
                  {course.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigateToCourse(course.id, course.dayRange?.[0] ?? 1)}
                className="brutal-btn rounded-brutal-btn bg-surface hover:bg-pale-pink text-ink px-3 py-1.5 font-mono text-xs font-bold uppercase inline-flex items-center gap-1.5 border border-ink shrink-0 min-h-[34px]"
              >
                <span>Ouvrir</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Section : Bonus */}
      <section aria-label="Bonus" className="space-y-3">
        <h3 className="font-display text-xl uppercase tracking-tight text-ink">
          Bonus
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {BONUSES.map((bonus) => (
            <div
              key={bonus.id}
              className="brutal-card rounded-brutal-card bg-surface p-4 border-2 border-ink shadow-brutal-xs flex flex-col justify-between gap-3"
            >
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-pale-pink border border-ink rounded-brutal-tag text-ink uppercase">
                  {bonus.orderNumber}
                </span>
                <h4 className="font-display text-sm uppercase tracking-tight text-ink leading-tight pt-1">
                  {bonus.title}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => navigateToBonus(bonus.id)}
                className="brutal-btn rounded-brutal-btn bg-cream hover:bg-pale-pink text-ink px-3 py-1.5 font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-1.5 border border-ink w-full min-h-[34px]"
              >
                <span>Accéder</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Section : Ressources */}
      <section aria-label="Ressources" className="space-y-3">
        <div className="brutal-card rounded-brutal-card bg-surface p-5 border-2 border-ink shadow-brutal-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-display text-base uppercase tracking-tight text-ink">
              Ressources et fiches pratiques
            </h4>
            <p className="font-serif text-xs text-ink/75 mt-0.5">
              Aide-mémoires techniques, directives d&apos;anti-slop et templates de code.
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
