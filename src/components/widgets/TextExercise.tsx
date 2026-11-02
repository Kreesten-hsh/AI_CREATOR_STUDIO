import { Check, FileEdit } from 'lucide-react';
import type { TextExerciseBlock } from '../../types/course';
import { useProgress } from '../../hooks/useProgress';

export function TextExercise({ block }: { block: TextExerciseBlock }) {
  const { state, saveExerciseAnswer, updateProfileField } = useProgress();

  const currentAnswer =
    state.exerciseAnswers[block.id] ??
    (block.profileBinding ? state.profile[block.profileBinding] : '') ??
    '';

  const maxLength = block.maxLength ?? 1500;
  const charCount = currentAnswer.length;
  const isSaved = currentAnswer.trim().length > 0;

  const handleMainChange = (val: string) => {
    const clipped = val.slice(0, maxLength);
    saveExerciseAnswer(block.id, clipped, block.profileBinding);
  };

  return (
    <section className="brutal-card rounded-brutal-card p-5 md:p-6 space-y-5" aria-label={block.title}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-ink">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pale-pink border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase text-ink">
            <FileEdit className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
            ESPACE DE TRAVAIL PRATIQUE
          </span>
          <h3 className="font-display text-lg md:text-xl uppercase tracking-tight mt-2 text-ink">
            {block.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {isSaved ? (
            <span
              role="status"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-pale-pink border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase text-ink"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5] text-primary-red" aria-hidden="true" />
              Enregistré automatiquement
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-cream border-2 border-ink rounded-brutal-tag font-mono text-xs uppercase text-ink/70">
              En attente de saisie
            </span>
          )}
        </div>
      </div>

      <p className="text-sm md:text-base text-ink/85 leading-relaxed">{block.instructions}</p>

      <div>
        <label
          htmlFor={`exercise-textarea-${block.id}`}
          className="font-mono text-xs font-bold uppercase block mb-1.5 text-ink"
        >
          {block.profileBinding
            ? `Réponse principale (liée à la variable {{${block.profileBinding}}})`
            : 'Vos notes et livrables'}
        </label>
        <textarea
          id={`exercise-textarea-${block.id}`}
          rows={4}
          value={currentAnswer}
          onChange={(e) => handleMainChange(e.target.value)}
          placeholder={block.placeholder}
          className="w-full p-3.5 bg-cream border-2 border-ink rounded-brutal-btn font-sans text-sm md:text-base text-ink placeholder:text-ink/45 focus:bg-surface leading-relaxed"
        />
        <div className="flex items-center justify-between mt-1.5 font-mono text-xs text-ink/70">
          <span>
            {block.profileBinding
              ? `Synchronisé avec : {{${block.profileBinding}}}`
              : 'Sauvegardé automatiquement'}
          </span>
          <span>
            {charCount} / {maxLength} caractères
          </span>
        </div>
      </div>

      {block.secondaryFields && block.secondaryFields.length > 0 && (
        <div className="pt-4 border-t-2 border-ink grid grid-cols-1 md:grid-cols-2 gap-4">
          {block.secondaryFields.map((field) => {
            const fieldId = `${block.id}-secondary-${field.key}`;
            const val = state.profile[field.key] ?? '';
            return (
              <div key={field.key} className="flex flex-col">
                <label
                  htmlFor={fieldId}
                  className="font-mono text-xs font-bold uppercase mb-1.5 text-ink"
                >
                  {field.label}
                </label>
                <input
                  id={fieldId}
                  type="text"
                  value={val}
                  onChange={(e) => updateProfileField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="px-3.5 py-2.5 bg-cream border-2 border-ink rounded-brutal-btn text-sm text-ink placeholder:text-ink/45 focus:bg-surface min-h-[44px]"
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
