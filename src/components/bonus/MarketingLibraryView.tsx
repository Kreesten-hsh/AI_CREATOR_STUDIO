import { useMemo, useState } from 'react';
import { ArrowLeft, Gift, Sparkles, FolderKanban } from 'lucide-react';
import { BONUS_MARKETING_DATA } from '../../data/bonuses/bonus-marketing';
import { useProgress } from '../../hooks/useProgress';
import type { MarketingCategory, MarketingResource } from '../../types/marketing';
import { MarketingFilterBar } from './MarketingFilterBar';
import { MarketingResourceCard } from './MarketingResourceCard';
import { CompetitivePromptCard } from './CompetitivePromptCard';
import { ExternalNovitckiiCard } from './ExternalNovitckiiCard';
import { MarketingDetailModal } from './MarketingDetailModal';

export function MarketingLibraryView() {
  const { navigateToHome } = useProgress();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MarketingCategory>('all');
  const [selectedResource, setSelectedResource] = useState<MarketingResource | null>(null);

  // Filtrage combiné : catégorie + recherche textuelle
  const filteredSkills = useMemo(() => {
    return BONUS_MARKETING_DATA.skills.filter((skill) => {
      // Filtre catégorie
      if (selectedCategory !== 'all' && skill.category !== selectedCategory) {
        return false;
      }

      // Filtre recherche textuelle
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = skill.title.toLowerCase().includes(query);
        const matchesTechName = skill.technicalName.toLowerCase().includes(query);
        const matchesDesc = skill.shortDescription.toLowerCase().includes(query);
        const matchesProblem = skill.concreteProblem.toLowerCase().includes(query);
        const matchesCategory = skill.categoryLabel.toLowerCase().includes(query);

        return (
          matchesTitle ||
          matchesTechName ||
          matchesDesc ||
          matchesProblem ||
          matchesCategory
        );
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  // Détermine si la carte spéciale de veille doit être affichée (catégorie 'all' ou 'strategy' et correspond à la recherche)
  const showCompetitivePrompt = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'strategy') {
      return false;
    }
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    return (
      BONUS_MARKETING_DATA.competitivePrompt.title.toLowerCase().includes(query) ||
      BONUS_MARKETING_DATA.competitivePrompt.description.toLowerCase().includes(query) ||
      'recherche concurrentielle'.includes(query) ||
      'veille'.includes(query)
    );
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* 1. Bouton retour au sommaire */}
      <button
        type="button"
        onClick={navigateToHome}
        className="group inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ink/75 hover:text-primary-red transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
        <span>RETOUR AU SOMMAIRE DE LA FORMATION</span>
      </button>

      {/* 2. Bannière éditoriale néo-brutaliste du Bonus 02 */}
      <header className="brutal-card rounded-brutal-card overflow-hidden border-2 border-ink shadow-brutal">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Panneau gauche : Macaron néo-brutaliste */}
          <div className="md:col-span-4 lg:col-span-3 bg-checkerboard-pink p-6 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-ink min-h-[160px]">
            <div className="bg-surface border-2 border-ink rounded-brutal-card shadow-brutal px-5 py-3 text-center -rotate-2">
              <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ink/75">
                BONUS PRATIQUE
              </span>
              <span className="block font-serif text-3xl sm:text-4xl leading-none text-ink my-1">
                {BONUS_MARKETING_DATA.header.orderNumber}
              </span>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary-red">
                9 SKILLS + 1 PROMPT
              </span>
            </div>
          </div>

          {/* Panneau droit : Titre et positionnement */}
          <div className="md:col-span-8 lg:col-span-9 bg-surface p-6 md:p-8 flex flex-col justify-between gap-4">
            <div>
              {/* Badges de contexte */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-pale-pink text-ink border border-ink rounded-brutal-tag font-mono text-[11px] font-bold uppercase">
                  <Gift className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
                  {BONUS_MARKETING_DATA.header.orderNumber}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cream text-ink border border-ink rounded-brutal-tag font-mono text-[11px] font-bold uppercase">
                  <Sparkles className="w-3 h-3 text-primary-red" aria-hidden="true" />
                  Claude & ChatGPT
                </span>
                <span className="inline-flex items-center px-2 py-0.5 bg-surface text-ink border border-ink rounded-brutal-tag font-mono text-[11px] font-bold uppercase">
                  Usage textuel direct • Importation selon plateforme
                </span>
                <span className="inline-flex items-center px-2 py-0.5 bg-surface text-ink border border-ink rounded-brutal-tag font-mono text-[11px] font-bold uppercase">
                  Scénario pédagogique fictif : Pack Freelance
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight leading-tight text-ink">
                {BONUS_MARKETING_DATA.header.title}
              </h1>

              <p className="font-serif text-sm md:text-base text-ink/80 mt-2 leading-relaxed max-w-3xl">
                {BONUS_MARKETING_DATA.header.description}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Barre de recherche et sélection des catégories */}
      <MarketingFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={BONUS_MARKETING_DATA.categories}
        totalResults={filteredSkills.length + (showCompetitivePrompt ? 1 : 0)}
      />

      {/* 4. Section spéciale : Prompt Universel de Veille Concurrentielle */}
      {showCompetitivePrompt && (
        <section aria-label="Ressource spéciale de recherche">
          <CompetitivePromptCard promptConfig={BONUS_MARKETING_DATA.competitivePrompt} />
        </section>
      )}

      {/* 5. Grille des cartes de Skills marketing */}
      <section aria-label="Catalogue des Skills marketing">
        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSkills.map((skill) => (
              <MarketingResourceCard
                key={skill.id}
                resource={skill}
                onOpenDetails={setSelectedResource}
              />
            ))}
          </div>
        ) : (
          !showCompetitivePrompt && (
            <div className="p-8 sm:p-12 bg-surface border-2 border-ink rounded-brutal-card shadow-brutal text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-pale-pink border-2 border-ink rounded-brutal-btn shadow-brutal-xs">
                <FolderKanban className="w-6 h-6 text-primary-red" aria-hidden="true" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="font-display text-lg uppercase text-ink">
                  Aucune ressource ne correspond à votre recherche
                </h3>
                <p className="font-serif text-xs text-ink/75 leading-relaxed">
                  Essayez un autre mot-clé ou réinitialisez les filtres pour afficher l'ensemble des 9 Skills.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="brutal-btn rounded-brutal-btn px-4 py-2 font-mono text-xs font-bold uppercase bg-primary-red text-surface border-2 border-ink hover:bg-dark-red shadow-brutal-xs"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )
        )}
      </section>

      {/* 6. Section externe Novitckii (« Pour aller plus loin ») */}
      <section aria-label="Pour aller plus loin">
        <ExternalNovitckiiCard resource={BONUS_MARKETING_DATA.externalResource} />
      </section>

      {/* 7. Modale de détail d'une ressource */}
      <MarketingDetailModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </div>
  );
}
