import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, CheckCircle2, Home, X } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import type { ModuleId } from '../../types/course';
import { playSuccessChime } from '../../utils/soundEffects';

const LazyConfettiAnimation = lazy(() => import('./ConfettiAnimation'));

interface ModuleCelebrationConfig {
  stepIndex: 1 | 2 | 3;
  stampRatio: '01/03' | '02/03' | '03/03';
  badge: string;
  title: string;
  titlePrefix: string;
  titleAccent: string;
  message: string;
  nextObjective: string;
  primaryCta: string;
  nextModuleId?: ModuleId;
}

const MODULE_JOURNEY_STEPS: ReadonlyArray<{
  index: 1 | 2 | 3;
  code: string;
  label: string;
}> = [
  { index: 1, code: '01', label: 'CHOISIR' },
  { index: 2, code: '02', label: 'CRÉER' },
  { index: 3, code: '03', label: 'PUBLIER' },
];

export const MODULE_CELEBRATION_CONTENT: Record<ModuleId, ModuleCelebrationConfig> = {
  'module-01': {
    stepIndex: 1,
    stampRatio: '01/03',
    badge: 'MODULE 01 · VALIDÉ',
    title: 'Ton idée prend forme !',
    titlePrefix: 'Ton idée',
    titleAccent: 'prend forme !',
    message:
      'Tu viens de terminer le premier module. Ton idée et ton document de référence sont prêts pour la création de ton application.',
    nextObjective: 'Module suivant : CRÉER',
    primaryCta: 'Continuer',
    nextModuleId: 'module-02',
  },
  'module-02': {
    stepIndex: 2,
    stampRatio: '02/03',
    badge: 'MODULE 02 · VALIDÉ',
    title: 'Ton application est prête !',
    titlePrefix: 'Ton application',
    titleAccent: 'est prête !',
    message:
      'Tu viens de terminer la création et les tests de ton application. Il est temps de la publier et de préparer sa livraison.',
    nextObjective: 'Module suivant : PUBLIER ET LIVRER',
    primaryCta: 'Continuer',
    nextModuleId: 'module-03',
  },
  'module-03': {
    stepIndex: 3,
    stampRatio: '03/03',
    badge: 'MODULE 03 · VALIDÉ',
    title: 'Félicitations, tu es arrivé au bout !',
    titlePrefix: 'Félicitations,',
    titleAccent: 'tu es arrivé au bout !',
    message:
      "Tu as terminé les trois modules d'AI CREATOR Studio. Tu as préparé ton application, sa publication et les éléments nécessaires à sa livraison.",
    nextObjective: 'Tu peux revoir ton parcours ou consulter tes résultats.',
    primaryCta: 'Accueil',
  },
};

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  const candidates = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  return Array.from(candidates).filter((el) => {
    if (el.hasAttribute('disabled') || el.getAttribute('aria-hidden') === 'true') {
      return false;
    }
    if (el.closest('[aria-hidden="true"]')) {
      return false;
    }
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
}

interface LottieErrorBoundaryProps {
  onError: () => void;
  children: ReactNode;
}

interface LottieErrorBoundaryState {
  hasError: boolean;
}

class LottieErrorBoundary extends Component<
  LottieErrorBoundaryProps,
  LottieErrorBoundaryState
> {
  state: LottieErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): LottieErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(): void {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function isKnownModuleId(moduleId: string): moduleId is ModuleId {
  return moduleId === 'module-01' || moduleId === 'module-02' || moduleId === 'module-03';
}

export function ModuleCompletionDialog() {
  const {
    moduleCompletionEvent,
    dismissModuleCompletion,
    navigateToCourse,
    navigateToHome,
  } = useProgress();
  const shouldReduceMotion = Boolean(useReducedMotion());

  const [confettiStatus, setConfettiStatus] = useState<'playing' | 'completed' | 'failed'>(
    'playing'
  );

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const primaryButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const previousBodyOverflowRef = useRef<string | null>(null);
  const wasOpenRef = useRef(false);
  const isPrimaryNavigationRef = useRef(false);
  const lastPlayedEventIdRef = useRef<string | number | null>(null);

  const titleId = useId();
  const descriptionId = useId();

  const celebrationConfig =
    moduleCompletionEvent && isKnownModuleId(moduleCompletionEvent.moduleId)
      ? MODULE_CELEBRATION_CONTENT[moduleCompletionEvent.moduleId]
      : null;

  const isOpen = Boolean(moduleCompletionEvent && celebrationConfig);

  // Reset Lottie status for each distinct completion event so a subsequent module also plays once.
  useEffect(() => {
    if (moduleCompletionEvent) {
      setConfettiStatus('playing');
    }
  }, [moduleCompletionEvent?.id]);

  // Play a gentle local Web Audio chime once per event, muted when reduced motion is active.
  useEffect(() => {
    if (!isOpen || !moduleCompletionEvent) {
      return;
    }
    if (lastPlayedEventIdRef.current === moduleCompletionEvent.id) {
      return;
    }
    lastPlayedEventIdRef.current = moduleCompletionEvent.id;

    if (!shouldReduceMotion) {
      playSuccessChime();
    }
  }, [isOpen, moduleCompletionEvent, shouldReduceMotion]);

  // Capture/restore trigger focus and lock/restore background body scroll cleanly.
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      wasOpenRef.current = true;
      isPrimaryNavigationRef.current = false;
      previousActiveElementRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      previousBodyOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      if (primaryButtonRef.current) {
        primaryButtonRef.current.focus();
      } else {
        const focusables = getFocusableElements(dialogRef.current);
        focusables[0]?.focus();
      }
      return;
    }

    if (!isOpen && wasOpenRef.current) {
      wasOpenRef.current = false;
      document.body.style.overflow = previousBodyOverflowRef.current ?? '';
      previousBodyOverflowRef.current = null;

      if (!isPrimaryNavigationRef.current && previousActiveElementRef.current?.isConnected) {
        previousActiveElementRef.current.focus();
      }
      isPrimaryNavigationRef.current = false;
      previousActiveElementRef.current = null;
    }
  }, [isOpen]);

  // Safety net if the whole provider/app unmounts while the modal is open.
  useEffect(() => {
    return () => {
      if (wasOpenRef.current) {
        document.body.style.overflow = previousBodyOverflowRef.current ?? '';
        wasOpenRef.current = false;
      }
    };
  }, []);

  const handleSecondaryClose = useCallback(() => {
    isPrimaryNavigationRef.current = false;
    dismissModuleCompletion();
  }, [dismissModuleCompletion]);

  const handlePrimaryAction = useCallback(() => {
    if (!celebrationConfig) return;
    isPrimaryNavigationRef.current = true;
    if (celebrationConfig.nextModuleId) {
      navigateToCourse(celebrationConfig.nextModuleId);
    } else {
      navigateToHome();
    }
    dismissModuleCompletion();
  }, [celebrationConfig, navigateToCourse, navigateToHome, dismissModuleCompletion]);

  const handleConfettiComplete = useCallback(() => {
    setConfettiStatus('completed');
  }, []);

  const handleConfettiError = useCallback(() => {
    setConfettiStatus('failed');
  }, []);

  // WAI-ARIA Escape handling and keyboard focus trap (no offsetParent reliance so JSDOM stays accurate).
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleSecondaryClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = getFocusableElements(dialogRef.current);
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (!active || !dialogRef.current?.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleSecondaryClose]);

  if (!isOpen || !celebrationConfig || !moduleCompletionEvent) {
    return null;
  }

  const shouldMountConfetti = !shouldReduceMotion && confettiStatus === 'playing';
  const isStaticAccentVisible = shouldReduceMotion || confettiStatus !== 'playing';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      data-testid="module-completion-backdrop"
      onClick={handleSecondaryClose}
    >
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.16, ease: 'easeOut' }}
        className="fixed inset-0 bg-ink/75"
      />

      {shouldMountConfetti && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[55] pointer-events-none flex items-center justify-center overflow-hidden"
        >
          <LottieErrorBoundary
            key={moduleCompletionEvent.id}
            onError={handleConfettiError}
          >
            <Suspense fallback={null}>
              <LazyConfettiAnimation
                onComplete={handleConfettiComplete}
                onError={handleConfettiError}
              />
            </Suspense>
          </LottieErrorBoundary>
        </div>
      )}

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.12 : 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-[60] w-full max-w-lg max-h-[92vh] flex flex-col bg-surface border-2 border-ink rounded-brutal-card shadow-brutal text-ink overflow-hidden"
      >
        <div
          className="h-3 bg-checkerboard-pink border-b-2 border-ink shrink-0"
          aria-hidden="true"
        />

        <div className="px-4 py-4 sm:px-6 sm:py-5 bg-primary-red text-surface border-b-2 border-ink space-y-4 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface text-ink border-2 border-ink rounded-full shadow-brutal-xs min-w-0">
              <CheckCircle2
                data-testid={
                  isStaticAccentVisible ? 'completion-static-accent' : 'completion-badge-icon'
                }
                className="w-4 h-4 text-primary-red stroke-[2.5] shrink-0"
                aria-hidden="true"
              />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider truncate">
                {celebrationConfig.badge}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSecondaryClose}
              aria-label="Fermer la fenêtre de félicitations"
              className="p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center bg-surface text-ink border-2 border-ink rounded-brutal-btn shadow-brutal-xs hover:bg-pale-pink transition-colors duration-150 shrink-0 focus:outline-none focus:ring-2 focus:ring-surface focus:ring-offset-2 focus:ring-offset-primary-red"
            >
              <X className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4">
            <div
              className="bg-surface text-ink border-2 border-ink rounded-brutal-card shadow-brutal-xs px-3 py-2 text-center -rotate-2 shrink-0 select-none"
              aria-hidden="true"
            >
              <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-primary-red">
                CAP
              </span>
              <span className="block font-serif text-xl sm:text-2xl leading-none text-ink mt-0.5">
                {celebrationConfig.stampRatio}
              </span>
            </div>

            <h2
              id={titleId}
              className="font-display text-xl sm:text-2xl uppercase tracking-tight leading-tight text-surface"
            >
              {celebrationConfig.titlePrefix}{' '}
              <span className="font-serif italic font-normal lowercase text-2xl sm:text-3xl text-cream underline decoration-pale-pink/80 decoration-2 underline-offset-4">
                {celebrationConfig.titleAccent}
              </span>
            </h2>
          </div>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 bg-surface">
          <p
            id={descriptionId}
            className="font-sans text-sm sm:text-base leading-relaxed text-ink"
          >
            {celebrationConfig.message}
          </p>

          <div className="bg-pale-pink/45 border-2 border-ink rounded-brutal-card p-3.5 sm:p-4 shadow-brutal-xs space-y-3">
            <div
              className="grid grid-cols-3 gap-1.5 sm:gap-2"
              aria-label="Progression du cursus"
            >
              {MODULE_JOURNEY_STEPS.map((step) => {
                const isDone = step.index <= celebrationConfig.stepIndex;
                const isNext = step.index === celebrationConfig.stepIndex + 1;

                return (
                  <div
                    key={step.code}
                    className={`px-1.5 sm:px-2 py-2 rounded-brutal-btn flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-1.5 min-w-0 text-center sm:text-left ${
                      isDone
                        ? 'bg-surface border-2 border-ink shadow-brutal-xs text-ink'
                        : isNext
                        ? 'bg-cream border-2 border-dashed border-ink text-ink'
                        : 'bg-cream/65 border border-ink/40 text-ink/75'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full border border-ink flex items-center justify-center shrink-0 font-mono text-[10px] font-bold ${
                        isDone
                          ? 'bg-primary-red text-surface'
                          : isNext
                          ? 'bg-pale-pink text-ink'
                          : 'bg-surface text-ink'
                      }`}
                      aria-hidden="true"
                    >
                      {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : step.code}
                    </span>
                    <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-tight leading-tight break-words">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2.5 border-t border-ink/20 flex items-start gap-2.5">
              <span
                className="w-5 h-5 rounded-full bg-primary-red border border-ink flex items-center justify-center shrink-0 mt-0.5 text-surface"
                aria-hidden="true"
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <div className="min-w-0">
                <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-primary-red">
                  Prochaine étape
                </span>
                <p className="font-mono text-xs font-bold uppercase tracking-wide text-ink leading-snug break-words">
                  {celebrationConfig.nextObjective}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <motion.button
              ref={primaryButtonRef}
              type="button"
              onClick={handlePrimaryAction}
              whileHover={shouldReduceMotion ? undefined : { y: -1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
              className="w-full px-5 py-3.5 min-h-[48px] bg-primary-red hover:bg-dark-red text-surface font-mono text-xs sm:text-sm font-bold uppercase tracking-wider border-2 border-ink rounded-brutal-btn shadow-brutal-xs transition-colors duration-150 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-red focus:ring-offset-2"
            >
              <span>{celebrationConfig.primaryCta}</span>
              {celebrationConfig.nextModuleId ? (
                <ArrowRight className="w-4 h-4 stroke-[2.5] shrink-0" aria-hidden="true" />
              ) : (
                <Home className="w-4 h-4 stroke-[2.5] shrink-0" aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
