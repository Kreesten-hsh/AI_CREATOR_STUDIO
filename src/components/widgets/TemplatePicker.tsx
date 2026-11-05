import { useState } from 'react';
import { Layout, Check, Sparkles, AlertTriangle, FileText, ArrowDown } from 'lucide-react';
import { PRODUCT_MODELS, type ProductModel, type ProductModelBrief } from '../../data/productModels';
import { useProjectDossier } from '../../hooks/useProjectDossier';
import { CalculatorPreview } from './template-previews/CalculatorPreview';
import { JourneyHubPreview } from './template-previews/JourneyHubPreview';
import { DailyGuidePreview } from './template-previews/DailyGuidePreview';
import { BrandPagePreview } from './template-previews/BrandPagePreview';
import { CustomArchitecturePreview } from './template-previews/CustomArchitecturePreview';

function formatBriefText(brief: ProductModelBrief): string {
  return [
    `# ${brief.title}`,
    `**Promesse utilisateur :** ${brief.promise}`,
    `**Entrées utilisateur requises :** ${brief.userInputs}`,
    `**Sorties et résultats livrés :** ${brief.userOutputs}`,
  ].join('\n\n');
}

export function TemplatePicker({
  title = 'Choisissez le modèle d’architecture adapté à votre document',
  description = 'Explorez les 4 modèles éprouvés ou le choix libre. Votre sélection personnalise le brief fonctionnel et les fragments de prompts du cursus.',
}: {
  title?: string;
  description?: string;
}) {
  const { dossier, setField } = useProjectDossier();
  const currentModelId = dossier.fields?.chosenProductModel?.value ?? '';

  const [activeModelId, setActiveModelId] = useState<string>(
    currentModelId || PRODUCT_MODELS[0].id
  );
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [briefNotification, setBriefNotification] = useState<string | null>(null);

  const selectedModel =
    PRODUCT_MODELS.find((m) => m.id === activeModelId) ?? PRODUCT_MODELS[0];

  const handleSelectModel = (model: ProductModel) => {
    setActiveModelId(model.id);
    setField('chosenProductModel', model.id, 'valid');
  };

  const handleApplyBriefClick = () => {
    const existingBrief = dossier.fields?.functionalBrief?.value?.trim() ?? '';
    if (existingBrief.length > 0) {
      setShowBriefModal(true);
    } else {
      executeApplyBrief('replace');
    }
  };

  const executeApplyBrief = (mode: 'replace' | 'merge') => {
    const newBriefContent = formatBriefText(selectedModel.prefilledBrief);
    const existingBrief = dossier.fields?.functionalBrief?.value?.trim() ?? '';

    let finalBrief = newBriefContent;
    if (mode === 'merge' && existingBrief.length > 0) {
      finalBrief = `${existingBrief}\n\n---\n\n## Brief type du modèle : ${selectedModel.name}\n\n${newBriefContent}`;
    }

    setField('functionalBrief', finalBrief, 'draft');
    setShowBriefModal(false);
    setBriefNotification(
      mode === 'replace'
        ? `Le brief type de "${selectedModel.name}" a remplacé le contenu du brief.`
        : `Le brief type de "${selectedModel.name}" a été fusionné à la suite de vos notes.`
    );
    window.setTimeout(() => setBriefNotification(null), 4000);
  };

  return (
    <section
      className="brutal-card rounded-brutal-card p-5 md:p-6 space-y-6"
      aria-label="Sélecteur de modèle de produit interactif"
    >
      {/* En-tête du sélecteur */}
      <div className="border-b-2 border-ink pb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-red text-surface border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase">
          <Layout className="w-3.5 h-3.5" aria-hidden="true" />
          ARCHITECTURE DE VOTRE PRODUIT INTERACTIF
        </span>
        <h3 className="font-display text-xl md:text-2xl uppercase tracking-tight mt-2 text-ink">
          {title}
        </h3>
        <p className="text-sm md:text-base text-ink/80 mt-1 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Grille des cartes radio (AUCUN bouton ou contrôle interactif imbriqué) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-red" aria-hidden="true" />
            1. Choisissez un modèle (ou choix libre)
          </h4>
          <span className="font-mono text-[11px] text-ink/70">
            Zéro IA imposée : choix éclairé par votre matière
          </span>
        </div>

        <div
          role="radiogroup"
          aria-label="Modèles de produits interactifs disponibles"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {PRODUCT_MODELS.map((model) => {
            const isSelected = model.id === activeModelId;
            const isSavedInDossier = model.id === currentModelId;

            return (
              <button
                key={model.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelectModel(model)}
                className={`text-left p-4 border-2 border-ink rounded-brutal-btn transition-all flex flex-col justify-between min-h-[190px] ${
                  isSelected
                    ? 'bg-pale-pink shadow-brutal ring-2 ring-primary-red -translate-y-0.5'
                    : 'bg-cream hover:bg-surface shadow-brutal-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-display text-sm uppercase text-ink font-bold leading-tight">
                      {model.name}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border-2 border-ink flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-primary-red text-surface' : 'bg-surface'
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-surface" />}
                    </span>
                  </div>

                  <p className="text-xs text-ink/80 mb-3 leading-snug">
                    {model.shortDescription}
                  </p>

                  <div className="text-[11px] font-mono text-ink/75 pt-2 border-t border-ink/20">
                    <strong className="text-ink">Document source idéal :</strong> {model.forDocument}
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between mt-2 border-t border-ink/20">
                  <span className="font-mono text-[10px] uppercase font-bold text-ink/70">
                    {model.defaultFeatures.length} fonctionnalités clés
                  </span>
                  {isSavedInDossier && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-ink text-surface rounded-brutal-tag font-mono text-[10px] font-bold">
                      <Check className="w-3 h-3 stroke-[3]" /> ENREGISTRÉ
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Zone séparée pour l'aperçu interactif du modèle choisi */}
      <div className="pt-2 border-t-2 border-ink space-y-4" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
              <ArrowDown className="w-4 h-4 text-primary-red" aria-hidden="true" />
              2. Aperçu interactif du modèle : {selectedModel.name}
            </h4>
            <p className="text-xs text-ink/75 mt-0.5">
              Testez le comportement de ce format d’application pour vérifier son adéquation avec votre document.
            </p>
          </div>

          <button
            type="button"
            onClick={handleApplyBriefClick}
            className="brutal-btn bg-surface text-ink hover:bg-pale-pink px-3.5 py-2 min-h-[40px] rounded-brutal-btn font-mono text-xs font-bold uppercase inline-flex items-center gap-2 border-2 border-ink shadow-brutal-xs"
          >
            <FileText className="w-4 h-4 text-primary-red" aria-hidden="true" />
            <span>Adopter le brief prérempli de ce modèle</span>
          </button>
        </div>

        {briefNotification && (
          <div
            role="status"
            className="p-3 bg-emerald-100 border-2 border-ink rounded-brutal-card text-xs font-mono font-bold text-ink flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
            <span>{briefNotification}</span>
          </div>
        )}

        {/* Composant interactif dynamique dédié au modèle */}
        <div>
          {selectedModel.id === 'interactive-calculator' && <CalculatorPreview />}
          {selectedModel.id === 'journey-hub' && <JourneyHubPreview />}
          {selectedModel.id === 'daily-guide' && <DailyGuidePreview />}
          {selectedModel.id === 'interactive-brand-page' && <BrandPagePreview />}
          {selectedModel.id === 'custom-architecture' && <CustomArchitecturePreview />}
        </div>
      </div>

      {/* Modal de confirmation d'écrasement ou fusion du brief (Adjustment 3) */}
      {showBriefModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="brief-modal-title"
          className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4"
        >
          <div className="bg-surface border-2 border-ink rounded-brutal-card p-5 sm:p-6 max-w-lg w-full shadow-brutal space-y-4">
            <div className="flex items-center gap-2 text-primary-red">
              <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <h5 id="brief-modal-title" className="font-display text-lg uppercase text-ink">
                Votre brief fonctionnel contient déjà du contenu
              </h5>
            </div>

            <p className="text-sm text-ink/80 leading-relaxed">
              Le champ <strong>functionalBrief</strong> de votre dossier contient déjà des informations.
              Pour éviter tout écrasement silencieux, choisissez comment injecter le brief type du modèle{' '}
              <strong>{selectedModel.name}</strong> :
            </p>

            <div className="p-3 bg-cream border border-ink rounded text-xs font-mono text-ink/75 max-h-24 overflow-y-auto">
              {dossier.fields?.functionalBrief?.value}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => executeApplyBrief('replace')}
                className="flex-1 py-2.5 px-3 bg-primary-red text-surface hover:bg-dark-red border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase"
              >
                Remplacer le brief
              </button>
              <button
                type="button"
                onClick={() => executeApplyBrief('merge')}
                className="flex-1 py-2.5 px-3 bg-pale-pink text-ink hover:bg-surface border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase"
              >
                Fusionner à la suite
              </button>
              <button
                type="button"
                onClick={() => setShowBriefModal(false)}
                className="py-2.5 px-3 bg-surface text-ink hover:bg-cream border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
