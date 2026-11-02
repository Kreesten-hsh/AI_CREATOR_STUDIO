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
    id: 'editorial-brique',
    name: 'Néo-Brutaliste Éditorial',
    tagline: 'Crème Papier #FAF6F0 + Rouge Brique #B63131 + Rose Poudré #E6A0A8 + Encre Profonde #171313',
    background: '#FAF6F0',
    surface: '#FFFDFC',
    accent: '#B63131',
    ink: '#171313',
  },
  {
    id: 'swiss-crimson',
    name: 'Archive Suisse Imprimée',
    tagline: 'Papier Journal Chaud #F5F2EB + Rouge International #E62E2D + Carbone #141413',
    background: '#F5F2EB',
    surface: '#FFFDFC',
    accent: '#E62E2D',
    ink: '#141413',
  },
  {
    id: 'acid-citron',
    name: 'Laboratoire Industriel',
    tagline: 'Blanc Craie #F7F7F2 + Citron Vif #D4FF00 + Obsidienne #111111',
    background: '#F7F7F2',
    surface: '#FFFDFC',
    accent: '#D4FF00',
    ink: '#111111',
  },
  {
    id: 'cobalt-folio',
    name: 'Portfolio Architectural',
    tagline: 'Albâtre #FAF8F5 + Bleu Outremer #0047FF + Anthracite Profond #121316',
    background: '#FAF8F5',
    surface: '#FFFDFC',
    accent: '#0047FF',
    ink: '#121316',
  },
];

export const VIBE_STYLES: VibeStyleOption[] = [
  {
    id: 'neo-brutalist-print',
    name: 'Édition Néo-Brutaliste Nette',
    description: 'Bordures noires nettes de 2px, ombres dures décalées de 4px sans flou, étiquettes asymétriques.',
    borderRadius: '0px',
    shadowStyle: '4px 4px 0px #171313',
    promptDescriptor:
      'Mise en page Néo-Brutaliste Éditoriale avec bordures de 2px, ombres dures de 4px, accents en damier et boutons tactiles',
  },
  {
    id: 'tactile-starter-kit',
    name: 'Starter Kit Tactile Adouci',
    description: 'Bordures nettes de 2px avec angles adoucis de 8px et tampons de leçon inclinés.',
    borderRadius: '8px',
    shadowStyle: '3px 3px 0px #171313',
    promptDescriptor:
      'Starter Kit Éditorial Tactile avec bordures de 2px, arrondis de 8px, tampons de leçon et cartes d’étapes structurées',
  },
  {
    id: 'swiss-grid-ledger',
    name: 'Grille Modulaire Suisse',
    description: 'Lignes de séparation structurelles franches de 2px, numérotation surdimensionnée, rigueur architecturale.',
    borderRadius: '0px',
    shadowStyle: '2px 2px 0px #171313',
    promptDescriptor:
      'Mise en page en grille modulaire suisse avec séparateurs structurels de 2px, numéros d’index géants et hiérarchie éditoriale contrastée',
  },
];

export const VIBE_TYPOGRAPHY: VibeTypographyOption[] = [
  {
    id: 'archivo-instrument',
    name: 'Archivo Black + Instrument Serif',
    headingFont: 'Archivo Black & Instrument Serif Italic',
    bodyFont: 'Plus Jakarta Sans',
    monoFont: 'JetBrains Mono',
    promptDescriptor:
      'Titres majuscules imposants associés à des accents en italique avec empattements et compteurs à espacement fixe',
  },
  {
    id: 'syne-inter',
    name: 'Syne ExtraBold + Grotesque',
    headingFont: 'Syne ExtraBold',
    bodyFont: 'Inter / System Grotesque',
    monoFont: 'JetBrains Mono',
    promptDescriptor:
      'Titres larges et architecturaux en Syne associés à un texte courant neutre et étiquettes techniques',
  },
  {
    id: 'playfair-mono',
    name: 'Sérif Haute Élégance + Mono',
    headingFont: 'Playfair Display Black',
    bodyFont: 'Plus Jakarta Sans',
    monoFont: 'Fira Code',
    promptDescriptor:
      'Titres façon magazine en sérif à fort contraste associés à un corps de texte sans empattement net et badges de métadonnées mono',
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
          SÉLECTEUR D'IDENTITÉ VISUELLE
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
          1. Choisir la palette de couleurs
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
                      <Check className="w-3 h-3 stroke-[3]" /> ACTIF
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
          3. Choisir le système typographique éditorial
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
          <span>APERÇU EN DIRECT DU LIVRABLE</span>
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
              className="px-2.5 py-1 text-xs font-mono font-bold uppercase border-2 border-ink rounded-brutal-tag"
              style={{
                backgroundColor: selectedPalette.accent,
                color:
                  selectedPalette.id === 'cobalt-folio' || selectedPalette.id === 'swiss-crimson' || selectedPalette.id === 'editorial-brique'
                    ? '#FFFFFF'
                    : '#111111',
              }}
            >
              APERÇU DU STARTER KIT INTERACTIF
            </span>
            <span className="font-mono text-xs font-bold">
              {selectedPalette.name.toUpperCase()}
            </span>
          </div>
          <h4 className="font-display text-xl md:text-2xl uppercase tracking-tight mb-2">
            {profile.productType || 'VOTRE GUIDE DIGITAL INTERACTIF'}{' '}
            <span className="font-serif italic font-normal lowercase text-2xl md:text-3xl">
              édition
            </span>
          </h4>
          <p className="text-sm opacity-90 mb-4 max-w-2xl">
            Conçu pour{' '}
            <strong>{profile.targetAudience || 'votre audience cible'}</strong> avec{' '}
            {selectedStyle.name.toLowerCase()} et {selectedTypography.name}.
          </p>
          <div className="p-3 bg-surface border-2 border-ink rounded-brutal-btn font-mono text-xs break-words text-ink">
            <strong>Valeur compilée &#123;&#123;brandStyle&#125;&#125; :</strong> {profile.brandStyle}
          </div>
        </div>
      </div>
    </section>
  );
}
