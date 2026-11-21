import React, { useState } from 'react';
import { CheckCircle2, HelpCircle, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { normalizeSixDigitCode } from '../../utils/supabaseClient';

export const SUPPORT_EMAIL = 'aicreatorstudio.support@gmail.com';

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
      <div className="w-full max-w-md bg-surface border-2 border-ink rounded-brutal-card shadow-brutal overflow-hidden">
        <div className="h-3 bg-checkerboard-pink border-b-2 border-ink" aria-hidden="true" />

        <div className="p-6 sm:p-7 space-y-5">
          {/* En-tête minimaliste de connexion */}
          <header className="space-y-1.5 text-center border-b border-ink/15 pb-4">
            <p className="font-display text-xl uppercase tracking-tight text-ink">
              AI CREATOR{' '}
              <span className="font-serif italic font-normal lowercase text-2xl text-primary-red">
                studio
              </span>
            </p>
            <h1 className="font-sans text-sm font-bold text-ink">
              Connexion à ton espace
            </h1>
          </header>

          {/* Formulaire de connexion simple */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="buyer-purchase-email"
                className="block font-sans text-xs font-bold text-ink"
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
                className="w-full min-h-[44px] px-3.5 py-2.5 bg-cream text-ink font-sans text-sm border-2 border-ink rounded-brutal-btn placeholder:text-ink/45 focus:outline-none focus:bg-surface focus-visible:ring-2 focus-visible:ring-primary-red"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="buyer-one-time-code"
                className="block font-sans text-xs font-bold text-ink"
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
                className="w-full min-h-[44px] px-3.5 py-2.5 bg-cream text-ink font-mono text-base font-bold tracking-widest border-2 border-ink rounded-brutal-btn placeholder:font-normal placeholder:tracking-normal placeholder:text-ink/45 focus:outline-none focus:bg-surface focus-visible:ring-2 focus-visible:ring-primary-red"
              />
            </div>

            {errorMessage && (
              <div
                role="alert"
                data-testid="buyer-auth-error"
                className="p-3 bg-pale-pink border-2 border-ink border-l-4 border-l-primary-red rounded-brutal-btn text-xs font-sans font-medium text-ink shadow-brutal-xs"
              >
                {errorMessage}
              </div>
            )}

            {resendConfirmation && (
              <div
                role="status"
                data-testid="buyer-auth-resend-confirmation"
                className="p-3 bg-cream border-2 border-ink border-l-4 border-l-primary-red rounded-brutal-btn text-xs font-sans font-medium text-ink shadow-brutal-xs flex items-start gap-2"
              >
                <CheckCircle2
                  className="w-4 h-4 text-primary-red shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{resendConfirmation}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[46px] px-4 brutal-btn bg-primary-red hover:bg-dark-red text-surface font-mono text-xs sm:text-sm font-bold uppercase tracking-wide disabled:opacity-60"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={handleRequestNewCode}
              disabled={isResending}
              className="min-h-[44px] px-3 text-xs font-sans font-semibold text-ink/80 hover:text-primary-red underline underline-offset-4 transition-colors disabled:opacity-60"
            >
              {isResending ? 'Envoi en cours...' : 'Renvoyer un code par mail'}
            </button>
          </div>

          {/* Encart rassurant d'aide à la connexion */}
          <aside
            aria-label="Aide à la connexion"
            className="p-4 bg-cream border-2 border-ink rounded-brutal-card shadow-brutal-xs space-y-2.5 text-xs font-sans text-ink"
          >
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-primary-red">
              <HelpCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Où trouver ton code à 6 chiffres ?</span>
            </div>

            <p className="leading-relaxed text-ink">
              Ton code a été envoyé par e-mail juste après ton achat sur{' '}
              <strong className="font-semibold">Chariow</strong>. Si tu ne le vois pas dans ta boîte
              principale, vérifie tes dossiers <strong className="font-semibold">Spams</strong> ou{' '}
              <strong className="font-semibold">Promotions</strong>.
            </p>

            <div className="pt-2 border-t border-ink/15 space-y-1.5">
              <p className="flex items-center gap-1.5 font-medium text-ink">
                <ShieldCheck className="w-3.5 h-3.5 text-primary-red shrink-0" aria-hidden="true" />
                <span>Session mémorisée automatiquement sur cet appareil.</span>
              </p>

              <p className="flex flex-wrap items-center gap-1.5 text-ink">
                <Mail className="w-3.5 h-3.5 text-primary-red shrink-0" aria-hidden="true" />
                <span>Support :</span>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-mono text-[11px] font-bold text-primary-red hover:text-dark-red underline underline-offset-2 break-all"
                >
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
