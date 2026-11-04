import { Palette, Type, LayoutGrid, Check } from 'lucide-react';
import type {
  VibePaletteOption,
  VibePickerBlock,
  VibeStyleOption,
  VibeTypographyOption,
} from '../../types/course';
import { useStudentProfile } from '../../hooks/useStudentProfile';

export const VIBE_PALETTES: VibePaletteOption[] = [
  {
    id: 'slate-emerald',
    name: 'Cabinet Ardoise & Émeraude',
    tagline: 'Albâtre Froid #F8FAFC + Émeraude Profond #0F766E + Ardoise #0F172A',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    accent: '#0F766E',
    ink: '#0F172A',
  },
  {
    id: 'cobalt-folio',
    name: 'Studio Outremer & Ivoire',
    tagline: 'Ivoire Clair #FAF8F5 + Bleu Outremer #1D4ED8 + Carbone #111827',
    background: '#FAF8F5',
    surface: '#FFFFFF',
    accent: '#1D4ED8',
    ink: '#111827',
  },
  {
    id: 'terracotta-sable',
    name: 'Atelier Sable & Terracotta',
    tagline: 'Sable Doux #FDFBF7 + Terracotta #C2410C + Pierre Noire #1C1917',
    background: '#FDFBF7',
    surface: '#FFFFFF',
    accent: '#C2410C',
    ink: '#1C1917',
  },
  {
    id: 'forest-editorial',
    name: 'Académie Forêt & Sauge',
    tagline: 'Sauge Pâle #F7F9F6 + Vert Forêt #166534 + Encre Végétale #052E16',
    background: '#F7F9F6',
    surface: '#FFFFFF',
    accent: '#166534',
    ink: '#052E16',
  },
];

export const VIBE_STYLES: VibeStyleOption[] = [
  {
    id: 'clean-modern-cards',
    name: 'Interface SaaS Épurée',
    description: 'Cartes aérées avec bordures fines de 1px, coins arrondis de 10px et ombres douces.',
    borderRadius: '10px',
    shadowStyle: '0 4px 12px rgba(15, 23, 42, 0.08)',
    promptDescriptor:
      'Interface applicative épurée avec cartes structurées, bordures fines de 1px, arrondis de 10px et ombres portées légères',
  },
  {
    id: 'tactile-starter-kit',
    name: 'Carnet Tactile Structuré',
    description: 'Bordures franches de 2px avec angles adoucis de 8px et séparation nette des étapes.',
    borderRadius: '8px',
    shadowStyle: '3px 3px 0px rgba(15, 23, 42, 0.85)',
    promptDescriptor:
      'Carnet interactif structuré avec bordures de 2px, arrondis de 8px et cartes d’étapes clairement délimitées',
  },
  {
    id: 'swiss-grid-ledger',
    name: 'Grille Modulaire Suisse',
    description: 'Lignes de séparation franches, numérotation claire et alignement tabulaire rigoureux.',
    borderRadius: '4px',
    shadowStyle: 'none',
    promptDescriptor:
      'Mise en page en grille modulaire suisse avec séparateurs nets, numéros d’index lisibles et hiérarchie typographique sobre',
  },
];

export const VIBE_TYPOGRAPHY: VibeTypographyOption[] = [
  {
    id: 'inter-system',
    name: 'Grotesque Moderne + Mono',
    headingFont: 'Inter / System Sans Bold',
    bodyFont: 'Inter / System UI',
    monoFont: 'JetBrains Mono',
    promptDescriptor:
      'Typographie sans-serif moderne à haute lisibilité associée à une police monospace pour les chiffres et résultats',
  },
  {
    id: 'syne-inter',
    name: 'Syne Contemporain + Sans',
    headingFont: 'Syne Bold',
    bodyFont: 'Plus Jakarta Sans',
    monoFont: 'JetBrains Mono',
    promptDescriptor:
      'Titres contemporains en Syne associés à un corps de texte fluide en Plus Jakarta Sans',
  },
  {
    id: 'playfair-mono',
    name: 'Sérif Éditorial + Sans',
    headingFont: 'Playfair Display Bold',
    bodyFont: 'Plus Jakarta Sans',
    monoFont: 'Fira Code',
    promptDescriptor:
      'Titres éditoriaux en sérif contrasté associés à un corps de texte sans-serif épuré',
  },
];

export function VibePicker({ block }: { block: VibePickerBlock }) {
  const { profile, updateVibeSelection } = useStudentProfile();
  const currentVibe = profile.vibe;

  const selectedPalette =
    VIBE_PALETTES.find((p) => p.id === currentVibe.paletteId) ?? VIBE_PALETTES[0];
  const selectedStyle =
    VIBE_STYLES.find((s) => s.id === currentVibe.styleId) ?? VIBE_STYLES[0];
  const selectedTypography =
    VIBE_TYPOGRAPHY.find((t) => t.id === currentVibe.typographyId) ?? VIBE_TYPOGRAPHY[0];

  const handleSelect = (
    nextPaletteId = selectedPalette.id,
    nextStyleId = selectedStyle.id,
    nextTypoId = selectedTypography.id
  ) => {
    const pal = VIBE_PALETTES.find((p) => p.id === nextPaletteId) ?? VIBE_PALETTES[0];
    const sty = VIBE_STYLES.find((s) => s.id === nextStyleId) ?? VIBE_STYLES[0];
    const typ = VIBE_TYPOGRAPHY.find((t) => t.id === nextTypoId) ?? VIBE_TYPOGRAPHY[0];

    const summary = `${pal.name} (${pal.tagline}) | ${sty.promptDescriptor} | ${typ.promptDescriptor}`;
    updateVibeSelection(
      {
        paletteId: pal.id,
        styleId: sty.id,
        typographyId: typ.id,
      },
      summary
    );
  };

  return (
    <section className="brutal-card rounded-brutal-card p-5 md:p-6 space-y-6" aria-label={block.title}>
      <div className="border-b-2 border-ink pb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-red text-surface border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase">
          <Palette className="w-3.5 h-3.5" aria-hidden="true" />
          SÉLECTEUR D'IDENTITÉ VISUELLE PROPRE À VOTRE PRODUIT
        </span>
        <h3 className="font-display text-xl md:text-2xl uppercase tracking-tight mt-2">
          {block.title}
        </h3>
        <p className="text-sm md:text-base text-ink/80 mt-1">{block.description}</p>
      </div>

      {/* 1. Palette Selection */}
      <div>
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary-red" aria-hidden="true" />
          1. Choisir une palette de départ pour votre produit (ou saisir la vôtre dans le prompt)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VIBE_PALETTES.map((palette) => {
            const isSelected = palette.id === selectedPalette.id;
            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => handleSelect(palette.id, undefined, undefined)}
                aria-pressed={isSelected}
                className={`text-left p-4 border-2 border-ink rounded-brutal-btn transition-all ${
                  isSelected
                    ? 'bg-pale-pink shadow-brutal ring-2 ring-primary-red'
                    : 'bg-cream hover:bg-surface shadow-brutal-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-display text-sm uppercase">{palette.name}</span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-red text-surface border border-ink rounded-brutal-tag font-mono text-[11px] font-bold">
                      <Check className="w-3 h-3 stroke-[3]" /> SÉLECTIONNÉ
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink/75 mb-3">{palette.tagline}</p>
                <div className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 border-2 border-ink rounded-brutal-tag"
                    style={{ backgroundColor: palette.background }}
                    title={`Arrière-plan : ${palette.background}`}
                  />
                  <span
                    className="w-7 h-7 border-2 border-ink rounded-brutal-tag"
                    style={{ backgroundColor: palette.accent }}
                    title={`Accent : ${palette.accent}`}
                  />
                  <span
                    className="w-7 h-7 border-2 border-ink rounded-brutal-tag"
                    style={{ backgroundColor: palette.ink }}
                    title={`Encre : ${palette.ink}`}
                  />
                  <span
                    className="w-7 h-7 border-2 border-ink rounded-brutal-tag"
                    style={{ backgroundColor: palette.surface }}
                    title={`Surface : ${palette.surface}`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Layout Style Selection */}
      <div>
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-primary-red" aria-hidden="true" />
          2. Choisir le traitement structurel
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {VIBE_STYLES.map((style) => {
            const isSelected = style.id === selectedStyle.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => handleSelect(undefined, style.id, undefined)}
                aria-pressed={isSelected}
                className={`text-left p-4 border-2 border-ink rounded-brutal-btn transition-all ${
                  isSelected
                    ? 'bg-pale-pink shadow-brutal ring-2 ring-primary-red'
                    : 'bg-cream hover:bg-surface shadow-brutal-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-sm">{style.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-primary-red stroke-[3]" />}
                </div>
                <p className="text-xs text-ink/75 leading-relaxed">{style.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Typography Selection */}
      <div>
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
          <Type className="w-4 h-4 text-primary-red" aria-hidden="true" />
          3. Choisir le système typographique
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {VIBE_TYPOGRAPHY.map((typo) => {
            const isSelected = typo.id === selectedTypography.id;
            return (
              <button
                key={typo.id}
                type="button"
                onClick={() => handleSelect(undefined, undefined, typo.id)}
                aria-pressed={isSelected}
                className={`text-left p-4 border-2 border-ink rounded-brutal-btn transition-all ${
                  isSelected
                    ? 'bg-pale-pink shadow-brutal ring-2 ring-primary-red'
                    : 'bg-cream hover:bg-surface shadow-brutal-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-sm">{typo.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-primary-red stroke-[3]" />}
                </div>
                <p className="font-mono text-[11px] text-ink/70">Titres : {typo.headingFont}</p>
                <p className="font-mono text-[11px] text-ink/70">Corps : {typo.bodyFont}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="pt-2">
        <div className="font-mono text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>APERÇU DE L'AMBIANCE VISUELLE DE VOTRE FUTUR OUTIL</span>
          <span className="text-ink/70">ENREGISTRÉ DANS &#123;&#123;brandStyle&#125;&#125;</span>
        </div>
        <div
          className="p-5 md:p-6 border-2 border-ink transition-all rounded-brutal-card"
          style={{
            backgroundColor: selectedPalette.background,
            color: selectedPalette.ink,
            boxShadow: selectedStyle.shadowStyle,
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span
              className="px-2.5 py-1 text-xs font-mono font-bold uppercase rounded-brutal-tag"
              style={{
                backgroundColor: selectedPalette.accent,
                color: '#FFFFFF',
              }}
            >
              APERÇU DE VOTRE PRODUIT
            </span>
            <span className="font-mono text-xs opacity-75">{selectedTypography.name}</span>
          </div>
          <h5 className="font-display text-lg uppercase tracking-tight mb-1">
            {profile.productType || 'VOTRE OUTIL INTERACTIF PERSONNEL'}
          </h5>
          <p className="text-xs opacity-85">
            Conçu pour : {profile.targetAudience || 'votre audience cible'} • Style :{' '}
            {selectedPalette.name}
          </p>
        </div>
      </div>
    </section>
  );
}
