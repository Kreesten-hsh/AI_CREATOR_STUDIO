import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
  const shouldReduceMotion = Boolean(useReducedMotion());
  const hasMountedRef = useRef(false);

  useEffect(() => {
    hasMountedRef.current = true;
  }, []);

  // Mise en page compacte dès 375 px pour éviter l'empilement vertical sur mobile
  const gridLayoutClass =
    steps.length === 1
      ? 'grid-cols-1'
      : steps.length === 2
      ? 'grid-cols-2'
      : steps.length === 3
      ? 'grid-cols-3'
      : 'grid-cols-2 sm:grid-cols-4';

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
    <nav
      aria-label="Navigation des étapes de la leçon"
      className="w-full"
    >
      <div
        role="tablist"
        aria-label="Étapes de la leçon"
        className={`grid ${gridLayoutClass} gap-1.5 sm:gap-3`}
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
              className={`px-2 py-2 sm:px-3.5 sm:py-2.5 border-2 border-ink rounded-brutal-btn sm:rounded-full transition-colors duration-200 flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-1 sm:gap-2.5 min-h-[48px] sm:min-h-[46px] focus:outline-none focus:ring-2 focus:ring-primary-red focus:ring-offset-2 ${
                isActive
                  ? 'bg-primary-red text-surface shadow-brutal-xs font-bold -translate-y-0.5'
                  : isCompleted
                  ? 'bg-surface text-ink shadow-brutal-xs hover:bg-pale-pink/40'
                  : 'bg-surface text-ink hover:bg-cream shadow-brutal-xs'
              }`}
            >
              <span
                className={`w-6 h-6 shrink-0 border-2 border-ink rounded-full font-mono text-[11px] font-bold flex items-center justify-center transition-colors duration-200 ${
                  isCompleted
                    ? 'bg-ink text-surface'
                    : isActive
                    ? 'bg-surface text-primary-red'
                    : 'bg-cream text-ink'
                }`}
                aria-hidden="true"
              >
                {isCompleted ? (
                  <motion.span
                    key={`check-${step.id}`}
                    initial={
                      hasMountedRef.current && !shouldReduceMotion
                        ? { opacity: 0, scale: 0.75 }
                        : false
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.18,
                      ease: 'easeOut',
                    }}
                    className="inline-flex items-center justify-center"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </motion.span>
                ) : (
                  step.number
                )}
              </span>

              <div className="min-w-0 w-full sm:flex-1">
                <div className="flex items-center justify-center sm:justify-between gap-1">
                  <span className="font-display text-[11px] sm:text-xs uppercase tracking-tight truncate block">
                    {step.title}
                  </span>
                  {isCompleted && (
                    <span className="font-mono text-[9px] font-bold uppercase px-1.5 py-0.2 bg-ink text-surface rounded-full hidden md:inline shrink-0">
                      FAIT
                    </span>
                  )}
                </div>
                {step.subtitle && (
                  <p
                    className={`sr-only sm:not-sr-only sm:block text-[11px] font-sans font-medium truncate leading-tight ${
                      isActive ? 'text-surface' : 'text-ink/85'
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
