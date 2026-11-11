import type { StepChecklistBlock } from '../../types/course';
import { useProgress } from '../../hooks/useProgress';

export function StepChecklist({ block }: { block: StepChecklistBlock }) {
  const { state, toggleChecklistItem } = useProgress();
  const checkedMap = state.checklistAnswers[block.id] ?? {};

  const totalItems = block.items.length;
  const completedItems = block.items.filter((item) => Boolean(checkedMap[item.id])).length;

  return (
    <section className="brutal-card rounded-brutal-card p-5 md:p-6" aria-label={block.title}>
      {/* En-tête épuré sans badge superfétatoire */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-ink">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg md:text-xl uppercase tracking-tight text-ink">
            {block.title}
          </h3>
          {block.description && (
            <p className="text-sm text-ink mt-0.5">{block.description}</p>
          )}
        </div>

        {/* Compteur sobre style Abigail */}
        <div className="px-2.5 py-1 bg-cream border border-ink rounded-full font-mono text-xs font-bold text-ink shrink-0 shadow-brutal-xs">
          {completedItems}/{totalItems}
        </div>
      </div>

      <ul className="space-y-3" role="list">
        {block.items.map((item) => {
          const isChecked = Boolean(checkedMap[item.id]);
          return (
            <li key={item.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => toggleChecklistItem(block.id, item.id)}
                className={`w-full text-left p-3.5 md:p-4 border-2 border-ink rounded-brutal-btn transition-all flex items-start gap-3.5 min-h-[48px] ${
                  isChecked
                    ? 'bg-pale-pink shadow-brutal-xs'
                    : 'bg-cream hover:bg-surface shadow-brutal-xs'
                }`}
              >
                {/* Carré CSS net avec coche fine SVG */}
                <span
                  className={`mt-0.5 w-5 h-5 shrink-0 flex items-center justify-center border-2 border-ink rounded-[4px] transition-colors ${
                    isChecked ? 'bg-primary-red text-surface' : 'bg-surface'
                  }`}
                  aria-hidden="true"
                >
                  {isChecked && (
                    <svg
                      className="w-3.5 h-3.5 stroke-current"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-bold text-sm md:text-base ${
                      isChecked ? 'line-through text-ink/85' : 'text-ink'
                    }`}
                  >
                    {item.label}
                  </p>
                  {item.detail && (
                    <p className="text-xs md:text-sm text-ink mt-1 leading-relaxed">
                      {item.detail}
                    </p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
