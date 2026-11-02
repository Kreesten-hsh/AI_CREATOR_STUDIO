import { CheckSquare, Square } from 'lucide-react';
import type { StepChecklistBlock } from '../../types/course';
import { useProgress } from '../../hooks/useProgress';

export function StepChecklist({ block }: { block: StepChecklistBlock }) {
  const { state, toggleChecklistItem } = useProgress();
  const checkedMap = state.checklistAnswers[block.id] ?? {};

  const totalItems = block.items.length;
  const completedItems = block.items.filter((item) => Boolean(checkedMap[item.id])).length;
  const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <section className="brutal-card rounded-brutal-card p-5 md:p-6" aria-label={block.title}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-ink">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-cream border border-ink rounded-brutal-tag">
            LISTE D'ACTIONS
          </span>
          <h3 className="font-display text-lg md:text-xl uppercase tracking-tight mt-1.5">
            {block.title}
          </h3>
          {block.description && (
            <p className="text-sm text-ink/80 mt-0.5">{block.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 bg-cream px-3 py-1.5 border-2 border-ink shadow-brutal-xs rounded-brutal-btn">
          <span className="font-mono text-xs font-bold uppercase">
            {completedItems}/{totalItems} TERMINÉES ({percentage}%)
          </span>
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
                <span
                  className={`mt-0.5 w-6 h-6 shrink-0 flex items-center justify-center border-2 border-ink rounded-brutal-tag ${
                    isChecked ? 'bg-primary-red text-surface' : 'bg-surface text-ink'
                  }`}
                  aria-hidden="true"
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <Square className="w-4 h-4 stroke-[2]" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-bold text-sm md:text-base ${
                      isChecked ? 'line-through text-ink/75' : 'text-ink'
                    }`}
                  >
                    {item.label}
                  </p>
                  {item.detail && (
                    <p className="text-xs md:text-sm text-ink/75 mt-1 leading-relaxed">
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
