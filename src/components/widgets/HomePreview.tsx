import { useMemo } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { useProjectDossier } from '../../hooks/useProjectDossier';
import { parseProductIdentity, parseArtisticDirection } from '../../types/dossier';
import { getProductModelById } from '../../data/productModels';
import { CalculatorPreview } from './template-previews/CalculatorPreview';
import { JourneyHubPreview } from './template-previews/JourneyHubPreview';
import { DailyGuidePreview } from './template-previews/DailyGuidePreview';
import { BrandPagePreview } from './template-previews/BrandPagePreview';
import { CustomArchitecturePreview } from './template-previews/CustomArchitecturePreview';

export function HomePreview({
  title = 'Aperçu de l’écran d’accueil de votre futur produit',
  description = 'Cette maquette 100% locale simule le rendu de votre page d’accueil à partir de votre identité de marque, de votre modèle choisi et de votre direction artistique.',
}: {
  title?: string;
  description?: string;
}) {
  const { dossier } = useProjectDossier();

  // 1. Identité de marque et produit (Adjustment 1 : lu depuis productIdentity, JAMAIS solutionPromise)
  const productIdentity = useMemo(() => {
    return parseProductIdentity(dossier.fields?.productIdentity?.value ?? '');
  }, [dossier.fields?.productIdentity?.value]);

  const brandName = productIdentity.brandName || 'Votre Marque';
  const productName = productIdentity.productName || 'Votre Outil Interactif';
  const shortHook =
    productIdentity.shortHook ||
    'La solution interactive conçue pour simplifier vos décisions et accélérer vos résultats.';

  // 2. Direction artistique structurée
  const artisticDirection = useMemo(() => {
    return parseArtisticDirection(dossier.fields?.artisticDirection?.value ?? '');
  }, [dossier.fields?.artisticDirection?.value]);

  const bgHex = artisticDirection?.backgroundHex || '#F8FAFC';
  const surfaceHex = artisticDirection?.surfaceHex || '#FFFFFF';
  const accentHex = artisticDirection?.accentHex || '#0F766E';
  const inkHex = artisticDirection?.inkHex || '#0F172A';
  const headingFont = artisticDirection?.headingFont || 'Plus Jakarta Sans, sans-serif';
  const bodyFont = artisticDirection?.bodyFont || 'Inter, sans-serif';
  const borderRadius =
    artisticDirection?.borderRadius === '9999px'
      ? '9999px'
      : artisticDirection?.borderRadius || '8px';

  // 3. Modèle de produit choisi
  const modelId = dossier.fields?.chosenProductModel?.value || 'interactive-calculator';
  const chosenModel = getProductModelById(modelId) ?? getProductModelById('interactive-calculator')!;

  return (
    <section
      className="brutal-card rounded-brutal-card p-5 md:p-6 space-y-6"
      aria-label="Aperçu de l'écran d'accueil du produit"
    >
      {/* En-tête du composant de formation */}
      <div className="border-b-2 border-ink pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-red text-surface border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase">
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            MAQUETTE LOCALE DU PRODUIT APPRENANT
          </span>
          <span className="px-2.5 py-0.5 bg-pale-pink border border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase text-ink">
            EXEMPLE FICTIF • 0 APPEL RÉSEAU
          </span>
        </div>
        <h3 className="font-display text-xl md:text-2xl uppercase tracking-tight text-ink">
          {title}
        </h3>
        <p className="text-sm md:text-base text-ink/80 mt-1 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Cadre de simulation de fenêtre de navigateur */}
      <div
        className="border-2 border-ink rounded-brutal-card overflow-hidden shadow-brutal transition-all"
        style={{ backgroundColor: bgHex, color: inkHex, fontFamily: bodyFont }}
      >
        {/* Barre de fenêtre */}
        <div
          className="px-4 py-2.5 border-b-2 flex items-center justify-between text-xs font-mono"
          style={{ backgroundColor: surfaceHex, borderColor: inkHex }}
        >
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-red-400 border border-ink/40 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-ink/40 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 border border-ink/40 inline-block" />
          </div>
          <span className="font-bold truncate opacity-75">
            Aperçu d’interface produit • {chosenModel.name}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded border" style={{ borderColor: inkHex }}>
            EXEMPLE FICTIF
          </span>
        </div>

        {/* 1. Barre de navigation de la maquette produit */}
        <header
          className="px-5 py-4 border-b flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: `${inkHex}22`, backgroundColor: surfaceHex }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-8 h-8 font-bold flex items-center justify-center text-white border"
              style={{
                backgroundColor: accentHex,
                borderColor: inkHex,
                borderRadius: borderRadius === '9999px' ? '9999px' : '6px',
              }}
            >
              {brandName.charAt(0).toUpperCase()}
            </span>
            <span className="font-bold text-base tracking-tight" style={{ fontFamily: headingFont }}>
              {brandName}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-5 text-xs font-medium opacity-85">
            <span>Fonctionnalités</span>
            <span>Cas d’usage</span>
            <span>Tarifs</span>
            <span>Témoignages</span>
          </nav>

          <button
            type="button"
            className="px-3.5 py-1.5 text-xs font-bold text-white border transition-transform active:scale-95"
            style={{
              backgroundColor: accentHex,
              borderColor: inkHex,
              borderRadius: borderRadius === '9999px' ? '9999px' : '6px',
            }}
          >
            Accéder à l’outil
          </button>
        </header>

        {/* 2. Hero Section de la maquette produit */}
        <div className="px-5 py-8 md:py-12 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border"
            style={{
              backgroundColor: `${accentHex}15`,
              color: accentHex,
              borderColor: `${accentHex}40`,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>MODÈLE ACTIF : {chosenModel.name.toUpperCase()}</span>
          </div>

          <h4
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight leading-tight"
            style={{ fontFamily: headingFont }}
          >
            {productName}
          </h4>

          <p className="text-sm md:text-base opacity-80 max-w-2xl mx-auto leading-relaxed">
            {shortHook}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white border shadow-sm transition-transform active:scale-95"
              style={{
                backgroundColor: accentHex,
                borderColor: inkHex,
                borderRadius: borderRadius === '9999px' ? '9999px' : '6px',
              }}
            >
              Tester l’expérience interactive
            </button>
            <button
              type="button"
              className="px-4 py-2.5 text-xs sm:text-sm font-medium border"
              style={{
                backgroundColor: surfaceHex,
                borderColor: `${inkHex}40`,
                color: inkHex,
                borderRadius: borderRadius === '9999px' ? '9999px' : '6px',
              }}
            >
              En savoir plus
            </button>
          </div>
        </div>

        {/* 3. Démonstration interactive au cœur de la page */}
        <div className="px-4 pb-8 max-w-4xl mx-auto">
          <div
            className="p-4 sm:p-6 border shadow-sm"
            style={{
              backgroundColor: surfaceHex,
              borderColor: `${inkHex}33`,
              borderRadius: borderRadius === '9999px' ? '24px' : borderRadius,
            }}
          >
            <div className="mb-4 text-center">
              <span className="font-mono text-xs font-bold uppercase opacity-75">
                Module interactif embarqué • Exemple fonctionnel
              </span>
            </div>

            {modelId === 'interactive-calculator' && <CalculatorPreview />}
            {modelId === 'journey-hub' && <JourneyHubPreview />}
            {modelId === 'daily-guide' && <DailyGuidePreview />}
            {modelId === 'interactive-brand-page' && <BrandPagePreview />}
            {modelId === 'custom-architecture' && <CustomArchitecturePreview />}
          </div>
        </div>

        {/* 4. Pied de page maquette */}
        <footer
          className="px-5 py-4 border-t text-center text-xs opacity-70"
          style={{ borderColor: `${inkHex}22`, backgroundColor: surfaceHex }}
        >
          <span>© {new Date().getFullYear()} {brandName} — Tous droits réservés. Construit avec AI Creator Studio.</span>
        </footer>
      </div>
    </section>
  );
}
