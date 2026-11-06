import { useState } from 'react';
import {
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Terminal,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import type { StepHelpConfig, TroubleshootingPrompt } from '../../types/course';

export interface HelpPanelProps {
  help?: StepHelpConfig;
  stepTitle?: string;
  defaultOpen?: boolean;
}

export function HelpPanel({ help, stepTitle, defaultOpen = true }: HelpPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const hasMistakes = (help?.frequentMistakes?.length ?? 0) > 0;
  const hasTips = (help?.tips?.length ?? 0) > 0;
  const hasPrompts = (help?.troubleshootingPrompts?.length ?? 0) > 0;
  const hasContent = hasMistakes || hasTips || hasPrompts;

  const handleCopyPrompt = async (item: TroubleshootingPrompt) => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopiedPromptId(item.id);
      window.setTimeout(() => {
        setCopiedPromptId((prev) => (prev === item.id ? null : prev));
      }, 2500);
    } catch {
      // Fallback si le clipboard n'est pas accessible
      setCopiedPromptId(item.id);
    }
  };

  return (
    <aside
      aria-label="Aide et auto-dépannage pour cette étape"
      className="brutal-card rounded-brutal-card border-2 border-ink bg-surface shadow-brutal overflow-hidden"
    >
      {/* En-tête cliquable */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="help-panel-content"
        className="w-full text-left p-4 sm:p-4.5 bg-pale-pink border-b-2 border-ink flex items-center justify-between gap-3 hover:bg-pale-pink/80 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-brutal-tag bg-surface border-2 border-ink flex items-center justify-center text-primary-red shrink-0 shadow-brutal-xs">
            <HelpCircle className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base uppercase tracking-tight text-ink font-bold">
              Besoin d’aide pour cette étape ?
            </h3>
            {stepTitle && (
              <p className="text-[11px] font-mono text-ink/75 truncate">
                Ressources d’auto-dépannage pour : {stepTitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-surface text-ink border border-ink rounded-brutal-tag hidden sm:inline">
            {isOpen ? 'Masquer' : 'Afficher'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-ink" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-5 h-5 text-ink" aria-hidden="true" />
          )}
        </div>
      </button>

      {/* Contenu rétractable */}
      {isOpen && (
        <div id="help-panel-content" className="p-4 sm:p-5 space-y-5">
          {/* Avertissement d'autonomie stricte : aucune promesse de support humain */}
          <div className="p-3 bg-cream border border-ink rounded-brutal-btn flex items-start gap-2.5 text-xs text-ink/90 leading-relaxed font-mono">
            <Info className="w-4 h-4 text-primary-red shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              <strong>Autonomie garantie :</strong> AI Creator Studio est conçu pour vous rendre
              100% autonome avec Claude. Aucun support humain n’intervient dans ce parcours :
              consultez les points ci-dessous ou injectez directement les prompts de dépannage dans
              votre conversation.
            </p>
          </div>

          {/* 1. Erreurs fréquentes & corrections */}
          {hasMistakes && (
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <span>Erreurs fréquentes & solutions</span>
              </h4>

              <div className="space-y-2.5">
                {help?.frequentMistakes?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-ink rounded-brutal-card bg-surface space-y-1.5 text-xs"
                  >
                    <div className="flex items-start gap-2 text-primary-red font-mono">
                      <span className="font-bold shrink-0">✕ Erreur :</span>
                      <span className="text-ink/80">{item.mistake}</span>
                    </div>
                    <div className="flex items-start gap-2 text-emerald-700 font-mono pt-1 border-t border-ink/10">
                      <span className="font-bold shrink-0">✓ Solution :</span>
                      <span className="text-ink">{item.correction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Conseils méthodologiques */}
          {hasTips && (
            <div className="space-y-2">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" aria-hidden="true" />
                <span>Conseils & bonnes pratiques</span>
              </h4>

              <ul className="space-y-1.5 list-none pl-0">
                {help?.tips?.map((tip, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-ink/85 flex items-start gap-2 bg-pale-pink/30 p-2.5 rounded-brutal-btn border border-ink/20"
                  >
                    <span className="font-mono font-bold text-primary-red">›</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. Prompts de dépannage copiables */}
          {hasPrompts && (
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-primary-red" aria-hidden="true" />
                <span>Prompts de dépannage prêts à l’emploi</span>
              </h4>

              <div className="space-y-3">
                {help?.troubleshootingPrompts?.map((item) => {
                  const isCopied = copiedPromptId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="border-2 border-ink rounded-brutal-card bg-cream p-3 sm:p-3.5 space-y-2 shadow-brutal-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h5 className="font-display text-xs uppercase font-bold text-ink">
                            {item.title}
                          </h5>
                          {item.description && (
                            <p className="text-[11px] text-ink/75 font-mono">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(item)}
                          className={`brutal-btn px-2.5 py-1.5 rounded-brutal-btn font-mono text-[11px] font-bold uppercase inline-flex items-center gap-1.5 shrink-0 transition-colors ${
                            isCopied
                              ? 'bg-ink text-surface'
                              : 'bg-primary-red text-surface hover:bg-dark-red shadow-brutal-xs'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                              <span>Copié !</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copier</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="p-2.5 bg-surface border border-ink rounded text-[11px] font-mono text-ink overflow-x-auto whitespace-pre-wrap leading-relaxed select-all max-h-36">
                        {item.prompt}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Repli universel si aucune donnée spécifique à l'étape */}
          {!hasContent && (
            <div className="space-y-2 text-xs font-mono text-ink/80 bg-pale-pink/20 p-3 rounded-brutal-card border border-ink/20">
              <p className="font-bold text-ink">Conseils généraux pour cette étape :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Relisez attentivement la consigne et le résultat attendu.</li>
                <li>
                  En cas de doute sur la réponse de Claude, demandez-lui : « Explique-moi étape par
                  étape ce que tu as généré et comment le tester ».
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
