import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface CompletionButtonProps {
  isCompleted: boolean;
  label: string;
  nextLabel?: string;
  onComplete: () => void;
}

export function CompletionButton({
  isCompleted,
  label,
  nextLabel,
  onComplete,
}: CompletionButtonProps) {
  return (
    <div className="brutal-card rounded-brutal-card p-5 md:p-6 bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-cream border border-ink rounded-brutal-tag">
          {isCompleted ? 'ÉTAPE VALIDÉE' : 'ACTION REQUISE'}
        </span>
        <p className="font-display text-base md:text-lg uppercase mt-1.5">
          {isCompleted
            ? 'Cette étape est enregistrée dans votre progression.'
            : 'Prêt à valider cette étape et poursuivre ?'}
        </p>
      </div>

      <button
        type="button"
        onClick={onComplete}
        className={`brutal-btn rounded-brutal-btn px-5 py-3 min-h-[48px] font-mono text-xs md:text-sm font-bold uppercase inline-flex items-center justify-center gap-2 shrink-0 ${
          isCompleted ? 'bg-cream text-ink hover:bg-pale-pink' : 'bg-primary-red text-surface hover:bg-dark-red'
        }`}
      >
        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
        <span>{isCompleted ? nextLabel ?? 'Étape validée (Continuer)' : label}</span>
        <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
      </button>
    </div>
  );
}
