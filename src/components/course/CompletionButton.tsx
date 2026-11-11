import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface CompletionButtonProps {
  isCompleted: boolean;
  label: string;
  nextLabel?: string;
  stepKey?: string;
  onComplete: () => void;
}

export function CompletionButton({
  isCompleted,
  label,
  nextLabel,
  stepKey,
  onComplete,
}: CompletionButtonProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const prevStepKeyRef = useRef(stepKey);
  const prevCompletedRef = useRef(isCompleted);
  const [justCompleted, setJustCompleted] = useState(false);

  // Detect live false -> true validation only; never fire on initial mount or when switching steps.
  useEffect(() => {
    if (prevStepKeyRef.current !== stepKey) {
      prevStepKeyRef.current = stepKey;
      prevCompletedRef.current = isCompleted;
      setJustCompleted(false);
      return;
    }

    if (!prevCompletedRef.current && isCompleted) {
      setJustCompleted(true);
    } else if (!isCompleted && prevCompletedRef.current) {
      setJustCompleted(false);
    }
    prevCompletedRef.current = isCompleted;
  }, [isCompleted, stepKey]);

  return (
    <div className="flex items-center justify-end pt-4 pb-2 w-full">
      <motion.button
        type="button"
        onClick={onComplete}
        whileHover={shouldReduceMotion ? undefined : { y: -1 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className={`rounded-brutal-btn px-6 py-3 min-h-[48px] font-mono text-xs md:text-sm font-bold uppercase inline-flex items-center justify-center gap-2 transition-colors duration-200 border-2 border-ink shadow-brutal-xs w-full sm:w-auto ${
          isCompleted
            ? 'bg-cream text-ink hover:bg-pale-pink'
            : 'bg-primary-red text-surface hover:bg-dark-red'
        }`}
      >
        <motion.span
          data-testid="completion-check-icon"
          data-just-completed={justCompleted ? 'true' : 'false'}
          initial={false}
          animate={
            justCompleted && !shouldReduceMotion
              ? { scale: [0.8, 1.08, 1], opacity: [0.65, 1, 1] }
              : { scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="inline-flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
        </motion.span>
        <span>{isCompleted ? nextLabel ?? 'Étape validée (Continuer)' : label}</span>
        <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
      </motion.button>
    </div>
  );
}
