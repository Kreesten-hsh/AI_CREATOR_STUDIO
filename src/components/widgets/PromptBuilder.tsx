import { useState } from 'react';
import { AlertTriangle, Check, Copy, Info, RotateCcw, Sliders, Wand2 } from 'lucide-react';
import type { ProfileVariableKey, PromptBuilderBlock } from '../../types/course';
import { useProgress } from '../../hooks/useProgress';
import { renderPromptTemplate } from '../../utils/promptRenderer';
import { resolveDossierFieldKey } from '../../types/dossier';

const TARGET_BADGES: Record<PromptBuilderBlock['deliverableTarget'], string> = {
  'claude-artifact': 'CIBLE : ARTIFACT CLAUDE',
  'html-app': 'APPLICATION HTML/CSS/JS AUTONOME',
  'sales-copy': 'COPYWRITING & STRATÉGIE ÉDITORIALE',
  'automation-json': "SPÉCIFICATION D'AUTOMATISATION MANYCHAT / N8N",
};

export function PromptBuilder({ block }: { block: PromptBuilderBlock }) {
  const {
    state,
    updateProfileField,
    saveCustomPromptInput,
    resetPromptInputs,
  } = useProgress();
  const [copied, setCopied] = useState(false);

  const localOverrides = state.customPromptInputs[block.id] ?? {};

  const fallbackPlaceholders: Record<string, string> = {};
  for (const field of block.fields) {
    fallbackPlaceholders[field.key] = field.placeholder;
  }

  const {
    renderedText,
    missingKeys,
    draftWarnings,
  } = renderPromptTemplate(block.template, {
    profile: state.profile,
    dossier: state.dossier,
    localOverrides,
    fallbackPlaceholders,
  });

  const getFieldValue = (fieldKey: string, profileBinding?: ProfileVariableKey): string => {
    if (localOverrides[fieldKey] !== undefined) {
      return localOverrides[fieldKey];
    }
    if (profileBinding) {
      return state.profile[profileBinding] ?? '';
    }
    if (fieldKey.startsWith('dossier.')) {
      const canonical = resolveDossierFieldKey(fieldKey.slice('dossier.'.length));
      if (canonical && state.dossier?.fields?.[canonical]) {
        return state.dossier.fields[canonical].value ?? '';
      }
    }
    return state.profile.customVariables[fieldKey] ?? '';
  };

  const handleFieldChange = (
    fieldKey: string,
    value: string,
    profileBinding?: ProfileVariableKey
  ) => {
    if (profileBinding) {
      updateProfileField(profileBinding, value);
    } else {
      saveCustomPromptInput(block.id, fieldKey, value);
    }
  };

  const handleReset = () => {
    const boundKeys = block.fields
      .map((f) => f.profileBinding)
      .filter((k): k is ProfileVariableKey => Boolean(k));
    resetPromptInputs(block.id, boundKeys);
  };

  const isCopyDisabled = missingKeys.length > 0;

  const handleCopyPrompt = async () => {
    if (isCopyDisabled) return;
    try {
      await navigator.clipboard.writeText(renderedText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = renderedText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section className="brutal-card rounded-brutal-card overflow-hidden" aria-label={block.title}>
      {/* Barre d'en-tête */}
      <div className="p-5 md:p-6 bg-cream border-b-2 border-ink flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pale-pink border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase text-ink">
              <Wand2 className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
              GÉNÉRATEUR DE PROMPT DYNAMIQUE
            </span>
            <span className="px-2.5 py-1 bg-surface border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase text-ink">
              {TARGET_BADGES[block.deliverableTarget]}
            </span>
          </div>
          <h3 className="font-display text-xl md:text-2xl uppercase tracking-tight text-ink">
            {block.title}
          </h3>
          <p className="text-sm text-ink/80 mt-1">{block.description}</p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="brutal-btn bg-surface px-3 py-2 font-mono text-xs font-bold uppercase inline-flex items-center gap-1.5 min-h-[40px] rounded-brutal-btn"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Réinitialiser les variables
        </button>
      </div>

      {/* Saisie des variables modifiables */}
      <div className="p-5 md:p-6 bg-surface border-b-2 border-ink space-y-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-ink">
            <Sliders className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
            Variables de contexte (synchronisées profil & dossier)
          </h4>
          {missingKeys.length > 0 ? (
            <span className="font-mono text-xs font-bold text-primary-red bg-pale-pink px-2 py-0.5 border border-ink rounded-brutal-tag flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {missingKeys.length} MANQUANTE{missingKeys.length > 1 ? 'S' : ''} (COPIE BLOQUÉE)
            </span>
          ) : (
            <span className="font-mono text-xs font-bold text-ink bg-pale-pink px-2 py-0.5 border border-ink rounded-brutal-tag">
              TOUTES LES VARIABLES SONT RENSEIGNÉES
            </span>
          )}
        </div>

        {missingKeys.length > 0 && (
          <div
            data-testid="missing-variables-banner"
            className="p-3 bg-pale-pink border-2 border-primary-red rounded-brutal-tag flex items-start gap-2.5 text-xs font-mono text-ink"
          >
            <AlertTriangle className="w-4 h-4 text-primary-red shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold">Variables obligatoires manquantes :</span>{' '}
              {missingKeys.map((k) => `{{${k}}}`).join(', ')}
              <p className="mt-1 font-sans text-ink/80">
                Renseignez ces champs ci-dessous, dans votre profil ou dans votre dossier de projet pour débloquer la copie du prompt.
              </p>
            </div>
          </div>
        )}

        {draftWarnings.length > 0 && (
          <div
            data-testid="draft-variables-banner"
            className="p-2.5 bg-cream border border-ink rounded-brutal-tag flex items-start gap-2 text-xs font-mono text-ink"
          >
            <Info className="w-3.5 h-3.5 text-ink/70 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold">Champs en brouillon :</span>{' '}
              {draftWarnings.map((w) => w.key).join(', ')} (inclus dans le prompt avec statut provisoire).
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {block.fields.map((field) => {
            const inputId = `${block.id}-field-${field.key}`;
            const val = getFieldValue(field.key, field.profileBinding);
            return (
              <div key={field.key} className="flex flex-col">
                <label
                  htmlFor={inputId}
                  className="font-mono text-xs font-bold uppercase mb-1.5 text-ink"
                >
                  {field.label}
                </label>
                <input
                  id={inputId}
                  type="text"
                  value={val}
                  onChange={(e) =>
                    handleFieldChange(field.key, e.target.value, field.profileBinding)
                  }
                  placeholder={field.placeholder}
                  className="px-3.5 py-2.5 bg-cream border-2 border-ink rounded-brutal-btn font-sans text-sm text-ink placeholder:text-ink/45 focus:bg-surface min-h-[44px]"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Affichage du prompt compilé */}
      <div className="bg-ink text-surface p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-surface/20">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-dusty-pink">
            PROMPT CLAUDE COMPILÉ (APERÇU EN DIRECT)
          </span>
          <button
            type="button"
            onClick={handleCopyPrompt}
            disabled={isCopyDisabled}
            title={
              isCopyDisabled
                ? 'Complétez toutes les variables manquantes pour débloquer la copie'
                : 'Copier le prompt dans le presse-papiers'
            }
            className={`brutal-btn px-4 py-2 min-h-[42px] font-mono text-xs font-bold uppercase inline-flex items-center gap-2 rounded-brutal-btn transition-opacity ${
              isCopyDisabled
                ? 'opacity-40 cursor-not-allowed bg-cream text-ink border-2 border-surface/40'
                : copied
                ? 'bg-surface text-ink'
                : 'bg-primary-red hover:bg-dark-red text-surface'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                Prompt copié !
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 stroke-[2.2]" aria-hidden="true" />
                Copier le prompt
              </>
            )}
          </button>
        </div>

        <pre
          data-testid={`compiled-prompt-${block.id}`}
          className="font-mono text-xs md:text-sm text-cream leading-relaxed whitespace-pre-wrap overflow-x-auto p-4 bg-ink border-2 border-surface/30 rounded-brutal-btn"
        >
          {renderedText}
        </pre>
      </div>
    </section>
  );
}
