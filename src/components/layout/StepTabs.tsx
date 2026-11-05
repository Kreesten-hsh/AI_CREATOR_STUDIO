import { Check } from 'lucide-react';
import type { Step, StepType } from '../../types/course';

interface StepTabsProps {
  steps: Step[];
  activeStep: StepType;
  completedSteps: StepType[];
  onSelectStep: (step: StepType) => void;
}

export function StepTabs({
  steps,
  activeStep,
  completedSteps,
  onSelectStep,
}: StepTabsProps) {
  const completedSet = new Set(completedSteps);
  const gridLayoutClass =
    steps.length === 3
      ? 'grid-cols-1 sm:grid-cols-3 gap-3'
      : 'grid-cols-2 lg:grid-cols-4 gap-3';

  return (
    <nav aria-label="Navigation des étapes de la leçon">
      <div
        role="tablist"
        aria-label="Étapes de la leçon"
        className={`grid ${gridLayoutClass}`}
      >
        {steps.map((step) => {
          const isActive = step.type === activeStep;
          const isCompleted = completedSet.has(step.type);

          return (
            <button
              key={step.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`step-panel-${step.type}`}
              id={`step-tab-${step.type}`}
              onClick={() => onSelectStep(step.type)}
              className={`text-left p-3.5 md:p-4 border-2 border-ink rounded-brutal-card transition-all flex items-center gap-3 min-h-[64px] ${
                isActive
                  ? 'bg-primary-red text-surface shadow-brutal -translate-y-0.5'
                  : isCompleted
                  ? 'bg-surface text-ink shadow-brutal-xs hover:bg-pale-pink/40'
                  : 'bg-cream text-ink shadow-brutal-xs hover:bg-surface'
              }`}
            >
              <span
                className={`w-8 h-8 shrink-0 border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold flex items-center justify-center ${
                  isCompleted
                    ? 'bg-ink text-surface'
                    : isActive
                    ? 'bg-surface text-primary-red'
                    : 'bg-surface text-ink'
                }`}
                aria-hidden="true"
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-display text-xs md:text-sm uppercase tracking-tight truncate">
                    {step.title}
                  </span>
                  {isCompleted && (
                    <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 bg-ink text-surface rounded-brutal-tag hidden sm:inline">
                      TERMINÉ
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] md:text-xs truncate mt-0.5 ${
                    isActive ? 'text-surface/85' : 'text-ink/80'
                  }`}
                >
                  {step.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
