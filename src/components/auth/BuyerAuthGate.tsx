import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { normalizeSixDigitCode } from '../../utils/supabaseClient';

export interface BuyerAuthGateProps {
  children: React.ReactNode;
}

export function BuyerAuthGate({ children }: BuyerAuthGateProps) {
  const { authRequired, isAuthenticated, verifyCode, requestNewCode } = useAuth();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendConfirmation, setResendConfirmation] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  if (!authRequired || isAuthenticated) {
    return <>{children}</>;
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(normalizeSixDigitCode(e.target.value));
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setResendConfirmation(null);
    setIsSubmitting(true);

    try {
      const result = await verifyCode(email, code);
      if (!result.ok) {
        setErrorMessage(
          result.error ??
            "Impossible de vérifier ton code d'accès. Vérifie ton e-mail et ton code à 6 chiffres."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestNewCode = async () => {
    setErrorMessage(null);
    setResendConfirmation(null);
    setIsResending(true);

    try {
      const result = await requestNewCode(email);
      if (result.ok) {
        setResendConfirmation(
          result.message ??
            "Si un achat est associé à cet e-mail, un nouveau code à usage unique vient de t'être envoyé."
        );
      } else {
        setErrorMessage(
          result.error ?? "Saisis d'abord l'adresse e-mail utilisée lors de ton achat sur Chariow."
        );
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      data-testid="buyer-auth-gate"
      className="min-h-screen bg-cream text-ink flex items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-sm bg-surface border-2 border-ink rounded-brutal-card shadow-brutal p-6 space-y-5">
        {/* En-tête minimaliste de connexion */}
        <header className="space-y-1 text-center border-b border-ink/15 pb-4">
          <p className="font-display text-lg uppercase tracking-tight text-ink">
            AI CREATOR{' '}
            <span className="font-serif italic font-normal lowercase text-2xl text-primary-red">
              studio
            </span>
          </p>
          <h1 className="font-sans text-sm font-semibold text-ink/80">
            Connexion à ton espace
          </h1>
        </header>

        {/* Formulaire de connexion simple */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label
              htmlFor="buyer-purchase-email"
              className="block font-sans text-xs font-semibold text-ink"
            >
              E-mail d&apos;achat
            </label>
            <input
              id="buyer-purchase-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={handleEmailChange}
              placeholder="ton-email@gmail.com"
              className="w-full h-11 px-3 bg-cream text-ink font-sans text-sm border-2 border-ink rounded-brutal-btn placeholder:text-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="buyer-one-time-code"
              className="block font-sans text-xs font-semibold text-ink"
            >
              Code d&apos;accès (6 chiffres)
            </label>
            <input
              id="buyer-one-time-code"
              name="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={handleCodeChange}
              placeholder="849201"
              className="w-full h-11 px-3 bg-cream text-ink font-mono text-base font-bold tracking-widest border-2 border-ink rounded-brutal-btn placeholder:font-normal placeholder:tracking-normal placeholder:text-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-red"
            />
          </div>

          {errorMessage && (
            <div
              role="alert"
              data-testid="buyer-auth-error"
              className="p-2.5 bg-pale-pink border border-ink rounded-brutal-btn text-xs font-sans font-medium text-ink"
            >
              {errorMessage}
            </div>
          )}

          {resendConfirmation && (
            <div
              role="status"
              data-testid="buyer-auth-resend-confirmation"
              className="p-2.5 bg-emerald-50 border border-emerald-800 rounded-brutal-btn text-xs font-sans font-medium text-emerald-900"
            >
              {resendConfirmation}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 px-4 brutal-btn bg-primary-red hover:bg-dark-red text-surface font-sans text-sm font-bold disabled:opacity-60"
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={handleRequestNewCode}
            disabled={isResending}
            className="text-xs font-sans text-ink/70 hover:text-primary-red underline underline-offset-4 transition-colors disabled:opacity-60"
          >
            Renvoyer un code par mail
          </button>
        </div>
      </div>
    </div>
  );
}
