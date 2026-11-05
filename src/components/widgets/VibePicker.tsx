import { useState, useId, useEffect } from 'react';
import { Palette, Type, LayoutGrid, Check, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import type { VibePickerBlock } from '../../types/course';
import { useStudentProfile } from '../../hooks/useStudentProfile';
import { useProjectDossier } from '../../hooks/useProjectDossier';
import {
  parseArtisticDirection,
  serializeArtisticDirection,
  artisticDirectionToPromptText,
  parseProductIdentity,
  type ArtisticDirectionData,
} from '../../types/dossier';
import { getContrastRatio, isValidHex } from '../../utils/contrast';

export interface VibePresetPalette {
  id: string;
  name: string;
  tagline: string;
  backgroundHex: string;
  surfaceHex: string;
  accentHex: string;
  inkHex: string;
}

export const VIBE_PALETTES: VibePresetPalette[] = [
  {
    id: 'slate-emerald',
    name: 'Cabinet Ardoise & Émeraude',
    tagline: 'Albâtre Froid #F8FAFC + Émeraude Profond #0F766E + Ardoise #0F172A',
    backgroundHex: '#F8FAFC',
    surfaceHex: '#FFFFFF',
    accentHex: '#0F766E',
    inkHex: '#0F172A',
  },
  {
    id: 'cobalt-folio',
    name: 'Studio Outremer & Ivoire',
    tagline: 'Ivoire Clair #FAF8F5 + Bleu Outremer #1D4ED8 + Carbone #111827',
    backgroundHex: '#FAF8F5',
    surfaceHex: '#FFFFFF',
    accentHex: '#1D4ED8',
    inkHex: '#111827',
  },
  {
    id: 'terracotta-sable',
    name: 'Atelier Sable & Terracotta',
    tagline: 'Sable Doux #FDFBF7 + Terracotta #C2410C + Pierre Noire #1C1917',
    backgroundHex: '#FDFBF7',
    surfaceHex: '#FFFFFF',
    accentHex: '#C2410C',
    inkHex: '#1C1917',
  },
  {
    id: 'forest-editorial',
    name: 'Académie Forêt & Sauge',
    tagline: 'Sauge Pâle #F7F9F6 + Vert Forêt #166534 + Encre Végétale #052E16',
    backgroundHex: '#F7F9F6',
    surfaceHex: '#FFFFFF',
    accentHex: '#166534',
    inkHex: '#052E16',
  },
];

export interface SafeFontOption {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
  fallback: string;
  promptDescriptor: string;
}

export const SAFE_FONTS: SafeFontOption[] = [
  {
    id: 'jakarta-inter',
    name: 'Grotesque Contemporaine (Plus Jakarta + Inter)',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    fallback: 'system-ui, sans-serif',
    promptDescriptor: 'Titres modernes en Plus Jakarta Sans associés à un corps fluide en Inter',
  },
  {
    id: 'syne-jakarta',
    name: 'Caractère Contemporain (Syne + Plus Jakarta)',
    headingFont: 'Syne',
    bodyFont: 'Plus Jakarta Sans',
    fallback: 'system-ui, sans-serif',
    promptDescriptor: 'Titres audacieux et structurés en Syne avec corps sobre en Plus Jakarta Sans',
  },
  {
    id: 'playfair-sans',
    name: 'Sérif Éditorial + Sans (Playfair + Plus Jakarta)',
    headingFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans',
    fallback: 'Georgia, serif',
    promptDescriptor: 'Titres éditoriaux élégants en Playfair Display associés à un corps moderne sans-sérif',
  },
  {
    id: 'space-inter',
    name: 'Technique & Structuré (Space Grotesk + Inter)',
    headingFont: 'Space Grotesk',
    bodyFont: 'Inter',
    fallback: 'monospace, sans-serif',
    promptDescriptor: 'Titres géométriques en Space Grotesk associés à un corps net en Inter',
  },
];

export function isFontAvailable(fontName: string): boolean {
  if (typeof document === 'undefined' || !document.fonts?.check) {
    return true;
  }
  try {
    return document.fonts.check(`16px "${fontName}"`);
  } catch {
    return false;
  }
}

export function VibePicker({ block }: { block?: VibePickerBlock }) {
  const { profile, updateVibeSelection } = useStudentProfile();
  const { dossier, setField } = useProjectDossier();

  // Extraction des données enregistrées dans le dossier ou le profil
  const savedArtisticDirection = parseArtisticDirection(dossier.fields?.artisticDirection?.value ?? '');
  const initialConfirmed = Boolean(savedArtisticDirection?.confirmed || profile.vibeConfirmed);

  const initialPalette =
    VIBE_PALETTES.find((p) => p.id === savedArtisticDirection?.paletteId) ??
    VIBE_PALETTES.find((p) => p.id === profile.vibe?.paletteId) ??
    VIBE_PALETTES[0];

  const initialFont =
    SAFE_FONTS.find((f) => f.headingFont === savedArtisticDirection?.headingFont) ??
    SAFE_FONTS[0];

  const [isConfirmed, setIsConfirmed] = useState<boolean>(initialConfirmed);
  const [useCustomColors, setUseCustomColors] = useState<boolean>(
    Boolean(savedArtisticDirection && !savedArtisticDirection.paletteId)
  );

  const [selectedPaletteId, setSelectedPaletteId] = useState<string>(initialPalette.id);
  const [bgHex, setBgHex] = useState<string>(savedArtisticDirection?.backgroundHex ?? initialPalette.backgroundHex);
  const [surfaceHex, setSurfaceHex] = useState<string>(savedArtisticDirection?.surfaceHex ?? initialPalette.surfaceHex);
  const [accentHex, setAccentHex] = useState<string>(savedArtisticDirection?.accentHex ?? initialPalette.accentHex);
  const [inkHex, setInkHex] = useState<string>(savedArtisticDirection?.inkHex ?? initialPalette.inkHex);

  const [selectedFontId, setSelectedFontId] = useState<string>(initialFont.id);
  const [useCustomFont, setUseCustomFont] = useState<boolean>(false);
  const [customHeadingFont, setCustomHeadingFont] = useState<string>(savedArtisticDirection?.headingFont ?? 'Inter');
  const [customBodyFont, setCustomBodyFont] = useState<string>(savedArtisticDirection?.bodyFont ?? 'system-ui');

  const [borderRadius, setBorderRadius] = useState<string>(savedArtisticDirection?.borderRadius ?? '8px');
  const [density, setDensity] = useState<string>(savedArtisticDirection?.density ?? 'balanced');
  const [styleDescriptor, setStyleDescriptor] = useState<string>(
    savedArtisticDirection?.styleDescriptor ?? 'Interface applicative épurée avec cartes structurées et typographie lisible.'
  );

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Vérification de chargement des polices dans le navigateur (Adjustment 4)
  const currentFontOption = SAFE_FONTS.find((f) => f.id === selectedFontId) ?? SAFE_FONTS[0];
  const headingFontToRender = useCustomFont ? customHeadingFont : currentFontOption.headingFont;
  const bodyFontToRender = useCustomFont ? customBodyFont : currentFontOption.bodyFont;

  const [headingLoaded, setHeadingLoaded] = useState<boolean>(true);
  const [bodyLoaded, setBodyLoaded] = useState<boolean>(true);

  useEffect(() => {
    setHeadingLoaded(isFontAvailable(headingFontToRender));
    setBodyLoaded(isFontAvailable(bodyFontToRender));
  }, [headingFontToRender, bodyFontToRender]);

  // Calcul du contraste WCAG
  const bgValid = isValidHex(bgHex);
  const surfaceValid = isValidHex(surfaceHex);
  const inkValid = isValidHex(inkHex);
  const accentValid = isValidHex(accentHex);

  const contrastBgInk = bgValid && inkValid ? getContrastRatio(bgHex, inkHex) : 1;
  const contrastSurfaceInk = surfaceValid && inkValid ? getContrastRatio(surfaceHex, inkHex) : 1;
  const hasContrastWarning = contrastBgInk < 4.5 || contrastSurfaceInk < 4.5;

  const handlePaletteSelect = (palette: VibePresetPalette) => {
    setSelectedPaletteId(palette.id);
    setBgHex(palette.backgroundHex);
    setSurfaceHex(palette.surfaceHex);
    setAccentHex(palette.accentHex);
    setInkHex(palette.inkHex);
    setUseCustomColors(false);
  };

  const handleConfirmVisualIdentity = () => {
    const paletteObj = VIBE_PALETTES.find((p) => p.id === selectedPaletteId);
    const data: ArtisticDirectionData = {
      paletteId: useCustomColors ? undefined : selectedPaletteId,
      paletteName: useCustomColors ? 'Palette personnalisée' : paletteObj?.name,
      backgroundHex: bgValid ? bgHex : '#F8FAFC',
      surfaceHex: surfaceValid ? surfaceHex : '#FFFFFF',
      accentHex: accentValid ? accentHex : '#0F766E',
      inkHex: inkValid ? inkHex : '#0F172A',
      headingFont: headingFontToRender,
      bodyFont: bodyFontToRender,
      borderRadius,
      density,
      styleDescriptor: styleDescriptor.trim(),
      confirmed: true,
    };

    // 1. Sauvegarde dans le dossier (source de vérité unique)
    const serialized = serializeArtisticDirection(data);
    setField('artisticDirection', serialized, 'valid');

    // 2. Synchronisation de profile.vibe et profile.brandStyle (migration douce rétro-compatible)
    const promptText = artisticDirectionToPromptText(data);
    updateVibeSelection(
      {
        paletteId: selectedPaletteId,
        styleId: borderRadius,
        typographyId: selectedFontId,
      },
      promptText
    );

    setIsConfirmed(true);
    setSaveMessage('Identité visuelle confirmée et enregistrée dans votre dossier de projet !');
    window.setTimeout(() => setSaveMessage(null), 4000);
  };

  // Nom de marque ou produit pour l'aperçu
  const productIdentity = parseProductIdentity(dossier.fields?.productIdentity?.value ?? '');
  const brandDisplayName =
    productIdentity.productName ||
    productIdentity.brandName ||
    profile.productType ||
    'VOTRE OUTIL INTERACTIF';

  const previewStyleId = useId();

  return (
    <section
      className="brutal-card rounded-brutal-card p-5 md:p-6 space-y-6"
      aria-label={block?.title ?? "Sélecteur d'identité visuelle"}
    >
      {/* En-tête du widget */}
      <div className="border-b-2 border-ink pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-red text-surface border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase">
            <Palette className="w-3.5 h-3.5" aria-hidden="true" />
            IDENTITÉ VISUELLE PROPRE À VOTRE PRODUIT
          </span>
          {isConfirmed ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-800 rounded-brutal-tag font-mono text-xs font-bold uppercase">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> IDENTITÉ CONFIRMÉE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-800 rounded-brutal-tag font-mono text-xs font-bold uppercase">
              <AlertTriangle className="w-3.5 h-3.5" /> NON CONFIRMÉE PAR DÉFAUT
            </span>
          )}
        </div>
        <h3 className="font-display text-xl md:text-2xl uppercase tracking-tight text-ink">
          {block?.title ?? 'Définissez la direction artistique de votre outil'}
        </h3>
        <p className="text-sm md:text-base text-ink/80 mt-1 leading-relaxed">
          {block?.description ??
            'Choisissez les teintes, la typographie et le style structurel. Aucune couleur de la plateforme AI Creator Studio ne sera injectée dans vos prompts.'}
        </p>
      </div>

      {/* 1. Palette de couleurs & Personnalisation Hex */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary-red" aria-hidden="true" />
            1. Couleurs (Palettes testées ou saisie libre Hex)
          </h4>
          <button
            type="button"
            onClick={() => setUseCustomColors(!useCustomColors)}
            className="text-xs font-mono font-bold uppercase text-primary-red hover:underline"
          >
            {useCustomColors ? '← Choisir parmi les 4 palettes' : 'Personnaliser mes codes Hex →'}
          </button>
        </div>

        {!useCustomColors ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VIBE_PALETTES.map((palette) => {
              const isSelected = !useCustomColors && palette.id === selectedPaletteId;
              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => handlePaletteSelect(palette)}
                  aria-pressed={isSelected}
                  className={`text-left p-4 border-2 border-ink rounded-brutal-btn transition-all ${
                    isSelected
                      ? 'bg-pale-pink shadow-brutal ring-2 ring-primary-red'
                      : 'bg-cream hover:bg-surface shadow-brutal-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-display text-sm uppercase text-ink">{palette.name}</span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-primary-red text-surface border border-ink rounded-brutal-tag font-mono text-[10px] font-bold">
                        <Check className="w-3 h-3 stroke-[3]" /> CHOISIE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink/75 mb-3">{palette.tagline}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 border-2 border-ink rounded-brutal-tag"
                      style={{ backgroundColor: palette.backgroundHex }}
                      title={`Fond : ${palette.backgroundHex}`}
                    />
                    <span
                      className="w-7 h-7 border-2 border-ink rounded-brutal-tag"
                      style={{ backgroundColor: palette.surfaceHex }}
                      title={`Surface : ${palette.surfaceHex}`}
                    />
                    <span
                      className="w-7 h-7 border-2 border-ink rounded-brutal-tag"
                      style={{ backgroundColor: palette.accentHex }}
                      title={`Accent : ${palette.accentHex}`}
                    />
                    <span
                      className="w-7 h-7 border-2 border-ink rounded-brutal-tag"
                      style={{ backgroundColor: palette.inkHex }}
                      title={`Encre : ${palette.inkHex}`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-cream border-2 border-ink rounded-brutal-card space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label htmlFor="hex-bg" className="block font-mono text-xs font-bold uppercase mb-1">
                  Arrière-plan (Fond)
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 border-2 border-ink rounded shrink-0"
                    style={{ backgroundColor: bgValid ? bgHex : '#FFFFFF' }}
                  />
                  <input
                    id="hex-bg"
                    type="text"
                    value={bgHex}
                    onChange={(e) => setBgHex(e.target.value.trim())}
                    placeholder="#F8FAFC"
                    className="w-full font-mono text-xs p-2 border-2 border-ink rounded"
                  />
                </div>
                {!bgValid && <span className="text-[10px] text-primary-red font-mono mt-1 block">Hex invalide</span>}
              </div>

              <div>
                <label htmlFor="hex-surface" className="block font-mono text-xs font-bold uppercase mb-1">
                  Cartes (Surface)
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 border-2 border-ink rounded shrink-0"
                    style={{ backgroundColor: surfaceValid ? surfaceHex : '#FFFFFF' }}
                  />
                  <input
                    id="hex-surface"
                    type="text"
                    value={surfaceHex}
                    onChange={(e) => setSurfaceHex(e.target.value.trim())}
                    placeholder="#FFFFFF"
                    className="w-full font-mono text-xs p-2 border-2 border-ink rounded"
                  />
                </div>
                {!surfaceValid && <span className="text-[10px] text-primary-red font-mono mt-1 block">Hex invalide</span>}
              </div>

              <div>
                <label htmlFor="hex-accent" className="block font-mono text-xs font-bold uppercase mb-1">
                  Couleur d’accent (CTA)
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 border-2 border-ink rounded shrink-0"
                    style={{ backgroundColor: accentValid ? accentHex : '#0F766E' }}
                  />
                  <input
                    id="hex-accent"
                    type="text"
                    value={accentHex}
                    onChange={(e) => setAccentHex(e.target.value.trim())}
                    placeholder="#0F766E"
                    className="w-full font-mono text-xs p-2 border-2 border-ink rounded"
                  />
                </div>
                {!accentValid && <span className="text-[10px] text-primary-red font-mono mt-1 block">Hex invalide</span>}
              </div>

              <div>
                <label htmlFor="hex-ink" className="block font-mono text-xs font-bold uppercase mb-1">
                  Texte & Contours (Encre)
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 border-2 border-ink rounded shrink-0"
                    style={{ backgroundColor: inkValid ? inkHex : '#0F172A' }}
                  />
                  <input
                    id="hex-ink"
                    type="text"
                    value={inkHex}
                    onChange={(e) => setInkHex(e.target.value.trim())}
                    placeholder="#0F172A"
                    className="w-full font-mono text-xs p-2 border-2 border-ink rounded"
                  />
                </div>
                {!inkValid && <span className="text-[10px] text-primary-red font-mono mt-1 block">Hex invalide</span>}
              </div>
            </div>

            {/* Alerte de contraste WCAG AA */}
            {hasContrastWarning && (
              <div
                role="alert"
                className="p-3 bg-amber-100 border-2 border-amber-800 text-amber-950 rounded-brutal-card text-xs flex items-start gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <strong className="block font-bold">Alerte de contraste WCAG AA :</strong>
                  <span>
                    Le contraste entre l’encre et le fond ({contrastBgInk.toFixed(1)}:1) ou la surface (
                    {contrastSurfaceInk.toFixed(1)}:1) est inférieur au seuil recommandé de 4.5:1. Le texte risque d’être
                    difficile à lire pour vos utilisateurs.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Typographie & Vérification de chargement */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
            <Type className="w-4 h-4 text-primary-red" aria-hidden="true" />
            2. Système typographique (Titres & Corps)
          </h4>
          <button
            type="button"
            onClick={() => setUseCustomFont(!useCustomFont)}
            className="text-xs font-mono font-bold uppercase text-primary-red hover:underline"
          >
            {useCustomFont ? '← Choisir parmi les polices sûres' : 'Saisir une police libre →'}
          </button>
        </div>

        {!useCustomFont ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SAFE_FONTS.map((font) => {
              const isSelected = !useCustomFont && font.id === selectedFontId;
              const isHeadingReady = isFontAvailable(font.headingFont);

              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => setSelectedFontId(font.id)}
                  aria-pressed={isSelected}
                  className={`text-left p-3.5 border-2 border-ink rounded-brutal-btn transition-all ${
                    isSelected
                      ? 'bg-pale-pink shadow-brutal ring-2 ring-primary-red'
                      : 'bg-cream hover:bg-surface shadow-brutal-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-ink">{font.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary-red stroke-[3]" />}
                  </div>
                  <p className="font-mono text-[11px] text-ink/75">Titres : {font.headingFont}</p>
                  <p className="font-mono text-[11px] text-ink/75">Corps : {font.bodyFont}</p>
                  {!isHeadingReady && (
                    <span className="inline-block mt-2 font-mono text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-800 rounded">
                      aperçu approximatif ({font.fallback})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-cream border-2 border-ink rounded-brutal-card grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="custom-heading-font" className="block font-mono text-xs font-bold uppercase mb-1">
                Police de titres (ex: Syne, Space Grotesk, Georgia)
              </label>
              <input
                id="custom-heading-font"
                type="text"
                value={customHeadingFont}
                onChange={(e) => setCustomHeadingFont(e.target.value)}
                className="w-full font-mono text-xs p-2 border-2 border-ink rounded"
              />
              {!headingLoaded && (
                <span className="text-[10px] text-amber-800 font-mono mt-1 block">
                  aperçu approximatif (police de secours système)
                </span>
              )}
            </div>
            <div>
              <label htmlFor="custom-body-font" className="block font-mono text-xs font-bold uppercase mb-1">
                Police de corps (ex: Inter, Plus Jakarta Sans, system-ui)
              </label>
              <input
                id="custom-body-font"
                type="text"
                value={customBodyFont}
                onChange={(e) => setCustomBodyFont(e.target.value)}
                className="w-full font-mono text-xs p-2 border-2 border-ink rounded"
              />
              {!bodyLoaded && (
                <span className="text-[10px] text-amber-800 font-mono mt-1 block">
                  aperçu approximatif (police de secours système)
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Formes & Densité */}
      <div className="space-y-3">
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-primary-red" aria-hidden="true" />
          3. Structure & Arrondis
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1.5">
              Arrondi des angles :
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '0px', val: '0px', name: 'Vifs' },
                { label: '8px', val: '8px', name: 'Doux' },
                { label: '14px', val: '14px', name: 'Arrondis' },
                { label: 'Pilule', val: '9999px', name: 'Pilule' },
              ].map((r) => (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => setBorderRadius(r.val)}
                  className={`p-2 text-center border-2 border-ink rounded font-mono text-xs font-bold transition-all ${
                    borderRadius === r.val ? 'bg-primary-red text-surface shadow-brutal' : 'bg-cream text-ink'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1.5">
              Densité d’espacement :
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'compact', name: 'Compacte' },
                { id: 'balanced', name: 'Équilibrée' },
                { id: 'airy', name: 'Aérée' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDensity(d.id)}
                  className={`p-2 text-center border-2 border-ink rounded font-mono text-xs font-bold transition-all ${
                    density === d.id ? 'bg-primary-red text-surface shadow-brutal' : 'bg-cream text-ink'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="style-descriptor-input" className="block font-mono text-xs font-bold uppercase mb-1">
            Descripteur textuel pour vos prompts :
          </label>
          <input
            id="style-descriptor-input"
            type="text"
            value={styleDescriptor}
            onChange={(e) => setStyleDescriptor(e.target.value)}
            className="w-full text-xs p-2.5 border-2 border-ink rounded-brutal-btn bg-cream text-ink font-medium"
          />
        </div>
      </div>

      {/* 4. Aperçu évolutif en direct & Bouton de confirmation obligatoire */}
      <div className="pt-2 border-t-2 border-ink space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary-red" aria-hidden="true" />
            4. Aperçu en direct de votre identité visuelle
          </span>
          <span className="font-mono text-[11px] text-ink/70">
            Source de vérité : <strong className="text-ink">dossier.artisticDirection</strong>
          </span>
        </div>

        {/* Panneau simulant l'ambiance visuelle choisie */}
        <div
          id={previewStyleId}
          className="p-5 sm:p-6 border-2 transition-all"
          style={{
            backgroundColor: bgValid ? bgHex : '#F8FAFC',
            color: inkValid ? inkHex : '#0F172A',
            borderColor: inkValid ? inkHex : '#0F172A',
            borderRadius: borderRadius === '9999px' ? '24px' : borderRadius,
            fontFamily: bodyFontToRender,
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span
              className="px-2.5 py-1 text-xs font-mono font-bold uppercase border"
              style={{
                backgroundColor: accentValid ? accentHex : '#0F766E',
                color: '#FFFFFF',
                borderColor: inkValid ? inkHex : '#0F172A',
                borderRadius: borderRadius === '9999px' ? '9999px' : '4px',
              }}
            >
              PRODUIT INTERACTIF
            </span>
            <span className="font-mono text-xs opacity-75">
              Titres : {headingFontToRender} • Corps : {bodyFontToRender}
            </span>
          </div>

          <div
            className="p-4 border mb-3"
            style={{
              backgroundColor: surfaceValid ? surfaceHex : '#FFFFFF',
              borderColor: inkValid ? inkHex : '#0F172A',
              borderRadius: borderRadius === '9999px' ? '16px' : borderRadius,
            }}
          >
            <h5
              className="text-lg uppercase tracking-tight font-bold mb-1"
              style={{ fontFamily: headingFontToRender }}
            >
              {brandDisplayName}
            </h5>
            <p className="text-xs opacity-85 leading-relaxed">
              {styleDescriptor}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t" style={{ borderColor: inkValid ? `${inkHex}33` : '#0F172A33' }}>
            <span className="text-xs font-mono opacity-80">Densité : {density}</span>
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-bold uppercase border transition-transform active:scale-95"
              style={{
                backgroundColor: accentValid ? accentHex : '#0F766E',
                color: '#FFFFFF',
                borderColor: inkValid ? inkHex : '#0F172A',
                borderRadius: borderRadius === '9999px' ? '9999px' : '6px',
              }}
            >
              Bouton Démo
            </button>
          </div>
        </div>

        {/* Bouton de confirmation obligatoire (Mission A + Adjustment 2) */}
        <div className="pt-2">
          {saveMessage && (
            <div
              role="status"
              className="mb-3 p-3 bg-emerald-100 border-2 border-ink rounded-brutal-card text-xs font-mono font-bold text-ink flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
              <span>{saveMessage}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirmVisualIdentity}
            className={`w-full py-3 px-5 border-2 border-ink rounded-brutal-btn font-mono text-xs sm:text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 ${
              isConfirmed
                ? 'bg-pale-pink text-ink hover:bg-surface shadow-brutal-xs'
                : 'bg-primary-red text-surface hover:bg-dark-red shadow-brutal'
            }`}
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
            <span>
              {isConfirmed
                ? 'Mettre à jour et reconfirmer cette identité visuelle'
                : 'Confirmer et appliquer cette identité visuelle à mon projet'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
