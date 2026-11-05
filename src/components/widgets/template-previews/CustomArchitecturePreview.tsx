import { useState } from 'react';
import { Layers, Plus, Check, ShieldCheck } from 'lucide-react';

interface FeatureBlock {
  id: string;
  name: string;
  desc: string;
  enabled: boolean;
}

const DEFAULT_BLOCKS: FeatureBlock[] = [
  { id: 'diag', name: 'Module d’Auto-Diagnostic', desc: 'Questionnaire dynamique avec score instantané pondéré', enabled: true },
  { id: 'calc', name: 'Moteur de Calcul Financier', desc: 'Simulateur de ROI avec paramètres modifiables par curseur', enabled: true },
  { id: 'export', name: 'Export de Synthèse Personnalisée', desc: 'Téléchargement de feuille de route imprimable ou PDF', enabled: false },
];

export function CustomArchitecturePreview() {
  const [blocks, setBlocks] = useState<FeatureBlock[]>(DEFAULT_BLOCKS);

  const toggleBlock = (id: string) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)));
  };

  const enabledCount = blocks.filter((b) => b.enabled).length;

  return (
    <div className="p-4 sm:p-5 bg-surface border-2 border-ink rounded-brutal-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-primary-red text-surface border border-ink rounded-brutal-tag flex items-center justify-center font-bold text-xs">
            <Layers className="w-4 h-4" aria-hidden="true" />
          </span>
          <div>
            <h5 className="font-display text-sm sm:text-base uppercase tracking-tight text-ink">
              Canevas d’Architecture Sur-Mesure
            </h5>
            <p className="text-[11px] text-ink/75">Assemblez vos briques fonctionnelles personnalisées</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-pale-pink border border-ink rounded-brutal-tag font-mono text-[10px] font-bold uppercase text-ink">
            {enabledCount} BRIQUES ACTIVES
          </span>
          <span className="px-2 py-0.5 bg-cream border border-ink rounded-brutal-tag font-mono text-[10px] font-bold uppercase text-ink">
            EXEMPLE FICTIF
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`p-3 border-2 border-ink rounded-brutal-card flex items-center justify-between gap-3 transition-all ${
              block.enabled ? 'bg-cream' : 'bg-surface/50 opacity-60'
            }`}
          >
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs sm:text-sm text-ink block">{block.name}</span>
              <span className="text-[11px] text-ink/75 block mt-0.5">{block.desc}</span>
            </div>
            <button
              type="button"
              onClick={() => toggleBlock(block.id)}
              className={`px-3 py-1.5 border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase shrink-0 flex items-center gap-1.5 ${
                block.enabled ? 'bg-primary-red text-surface' : 'bg-surface text-ink hover:bg-cream'
              }`}
            >
              {block.enabled ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                  Activé
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  Activer
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="p-3 bg-pale-pink border border-ink rounded flex items-center gap-2 text-xs text-ink/80">
        <ShieldCheck className="w-4 h-4 text-primary-red shrink-0" aria-hidden="true" />
        <span>Ce format libre s’adapte à toute combinaison de calculs, formulaires et restitutions visuelles.</span>
      </div>
    </div>
  );
}
