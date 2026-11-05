import React, { useRef } from 'react';
import { Check } from 'lucide-react';
import type { Step } from '../../types/course';

export interface StepTabsProps {
  steps: Step[];
  activeStepId: string;
  completedStepIds: string[];
  onSelectStep: (stepId: string) => void;
}

export function StepTabs({
  steps,
  activeStepId,
  completedStepIds,
  onSelectStep,
}: StepTabsProps) {
  const completedSet = new Set(completedStepIds);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Mise en page responsive adaptée à 1, 2, 3 ou 4 étapes
  const gridLayoutClass =
    steps.length === 1
      ? 'grid-cols-1'
      : steps.length === 2
      ? 'grid-cols-1 sm:grid-cols-2 gap-3'
      : steps.length === 3
      ? 'grid-cols-1 sm:grid-cols-3 gap-3'
      : 'grid-cols-2 sm:grid-cols-4 gap-3';

  // Navigation clavier selon le motif W3C ARIA Tabs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex: number | null = null;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % steps.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + steps.length) % steps.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = steps.length - 1;
    }

    if (nextIndex !== null) {
      const targetStep = steps[nextIndex];
      if (targetStep) {
        onSelectStep(targetStep.id);
        tabRefs.current[nextIndex]?.focus();
      }
    }
  };

  return (
    <nav aria-label="Navigation des étapes de la leçon">
      <div
        role="tablist"
        aria-label="Étapes de la leçon"
        className={`grid ${gridLayoutClass}`}
      >
        {steps.map((step, idx) => {
          const isActive = step.id === activeStepId;
          const isCompleted = completedSet.has(step.id);

          return (
            <button
              key={step.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`step-panel-${step.id}`}
              id={`step-tab-${step.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectStep(step.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`text-left p-3.5 md:p-4 border-2 border-ink rounded-brutal-card transition-all flex items-center gap-3 min-h-[64px] focus:outline-none focus:ring-2 focus:ring-primary-red focus:ring-offset-2 ${
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
                {step.subtitle && (
                  <p
                    className={`text-[11px] md:text-xs truncate mt-0.5 ${
                      isActive ? 'text-surface/85' : 'text-ink/80'
                    }`}
                  >
                    {step.subtitle}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
