import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { safeResetActiveRouteToHome } from '../../utils/storage';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Barrière d'erreur React (ErrorBoundary) avec message utilisateur statique et non technique.
 *
 * Garanties de confidentialité :
 * - N'affiche jamais error.message, error.stack ou componentStack dans le DOM.
 * - N'émet aucune journalisation technique sensible en production.
 *
 * Limites connues (standard React) :
 * - Capture uniquement les erreurs synchrones du rendu, du cycle de vie et des constructeurs enfants.
 * - Ne capture pas les gestionnaires d'événements, les promesses asynchrones non gérées ni les erreurs dans sa propre UI.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(): void {
    // Aucune exposition ni journalisation de stack trace ou de détail technique en production.
  }

  private handleReset = (): void => {
    this.setState({ hasError: false });
    if (this.props.onReset) {
      this.props.onReset();
    } else if (typeof window !== 'undefined') {
      safeResetActiveRouteToHome();
      window.location.href = '/';
    }
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-cream text-ink flex items-center justify-center p-6"
        >
          <div className="brutal-card rounded-brutal-card bg-surface border-2 border-ink shadow-brutal max-w-lg w-full p-8 text-center space-y-5">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-pale-pink border-2 border-ink rounded-brutal-btn shadow-brutal-xs">
              <AlertTriangle className="w-7 h-7 text-primary-red" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-ink">
                Une erreur inattendue est survenue dans l&apos;interface.
              </h1>
              <p className="font-serif text-sm text-ink leading-relaxed">
                Votre progression enregistrée sur cet appareil est préservée. Vous pouvez recharger
                l&apos;espace de formation pour reprendre votre parcours.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="brutal-btn rounded-brutal-btn bg-primary-red text-surface hover:bg-dark-red px-5 py-2.5 min-h-[44px] font-mono text-xs font-bold uppercase inline-flex items-center gap-2 border-2 border-ink shadow-brutal-xs transition-all"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                <span>Retourner à l&apos;accueil</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
