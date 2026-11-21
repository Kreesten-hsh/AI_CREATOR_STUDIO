import { useContext, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ProgressContext } from '../../context/ProgressContext';
import { getLessonById, getLessonByNumber } from '../../utils/courseNavigation';

interface CompletionButtonProps {
  isCompleted: boolean;
  label: string;
  nextLabel?: string;
  stepKey?: string;
  onComplete: () => void;
  onPrevious?: () => void;
  previousLabel?: string;
}

function scrollTopSafely(shouldReduceMotion: boolean): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
  if (navigator.userAgent?.includes('jsdom')) return;
  window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
}

export function CompletionButton({
  isCompleted,
  label,
  nextLabel,
  stepKey,
  onComplete,
  onPrevious,
  previousLabel,
}: CompletionButtonProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const progressCtx = useContext(ProgressContext);
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

  // Calcule automatiquement l'action « Précédent » (étape ou leçon précédente) dans le contexte du cours
  const computedPrevious = (() => {
    if (onPrevious) {
      return {
        label: previousLabel ?? 'Précédent',
        action: onPrevious,
      };
    }

    if (!progressCtx || progressCtx.state.activeRoute.kind !== 'lesson') {
      return null;
    }

    const currentLesson = getLessonById(progressCtx.state.activeRoute.lessonId);
    if (!currentLesson || currentLesson.steps.length === 0) {
      return null;
    }

    const currentStepId =
      stepKey ?? progressCtx.getActiveStepIdForLesson(currentLesson.id);
    const currentStepIdx = currentLesson.steps.findIndex((s) => s.id === currentStepId);

    if (currentStepIdx > 0) {
      const prevStep = currentLesson.steps[currentStepIdx - 1];
      return {
        label: previousLabel ?? 'Précédent',
        action: () => {
          progressCtx.setActiveStepIdForLesson(currentLesson.id, prevStep.id);
          scrollTopSafely(shouldReduceMotion);
        },
      };
    }

    if (currentLesson.lessonNumber > 1) {
      const prevLesson = getLessonByNumber(currentLesson.lessonNumber - 1);
      if (prevLesson) {
        const lastStepOfPrevLesson = prevLesson.steps[prevLesson.steps.length - 1];
        return {
          label: previousLabel ?? 'Leçon précédente',
          action: () => {
            progressCtx.navigateToLesson(prevLesson.id, lastStepOfPrevLesson?.id);
            scrollTopSafely(shouldReduceMotion);
          },
        };
      }
    }

    return null;
  })();

  return (
    <div
      className={`flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-4 pb-2 w-full ${
        computedPrevious ? 'justify-between' : 'justify-end'
      }`}
    >
      {computedPrevious && (
        <button
          type="button"
          onClick={computedPrevious.action}
          className="brutal-btn rounded-brutal-btn px-4 py-3 min-h-[48px] font-mono text-xs md:text-sm font-bold uppercase inline-flex items-center justify-center gap-2 bg-surface text-ink hover:bg-cream border-2 border-ink shadow-brutal-xs w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5] shrink-0" aria-hidden="true" />
          <span>{computedPrevious.label}</span>
        </button>
      )}

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
