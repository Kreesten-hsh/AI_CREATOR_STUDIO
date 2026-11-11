import { useMemo, useState } from 'react';
import { FolderKanban } from 'lucide-react';
import { BONUS_MARKETING_DATA } from '../../data/bonuses/bonus-marketing';
import type { MarketingCategory, MarketingResource } from '../../types/marketing';
import { MarketingFilterBar } from './MarketingFilterBar';
import { MarketingResourceCard } from './MarketingResourceCard';
import { CompetitivePromptCard } from './CompetitivePromptCard';
import { ExternalNovitckiiCard } from './ExternalNovitckiiCard';
import { MarketingDetailModal } from './MarketingDetailModal';

export function MarketingLibraryView() {
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

  // Détermine si la carte spéciale de veille doit être affichée
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
    <>
      <div className="space-y-8">
        {/* 1. Bannière éditoriale néo-brutaliste du Bonus 02 (Hero C1) */}
        <header className="brutal-card rounded-brutal-card overflow-hidden border-2 border-ink shadow-brutal">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Panneau gauche : damier rose sobre */}
            <div className="md:col-span-4 lg:col-span-3 bg-checkerboard-pink p-6 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-ink min-h-[150px]">
              <div className="bg-surface border-2 border-ink rounded-brutal-card shadow-brutal px-5 py-3 text-center -rotate-2">
                <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ink">
                  BONUS
                </span>
                <span className="block font-serif text-3xl sm:text-4xl leading-none text-ink my-1">
                  02
                </span>
              </div>
            </div>

            {/* Panneau droit : fond rouge brique épuré */}
            <div className="md:col-span-8 lg:col-span-9 bg-primary-red text-surface p-6 sm:p-7 md:p-8 flex flex-col justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight leading-tight text-surface">
                  MARKETING{' '}
                  <span className="font-serif italic font-normal lowercase text-cream text-3xl sm:text-4xl lg:text-5xl">
                    library
                  </span>
                </h1>

                <p className="font-serif text-sm sm:text-base text-surface mt-2.5 leading-relaxed max-w-2xl">
                  9 compétences IA et un prompt de recherche et veille concurrentielle pour mieux vendre votre produit numérique.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* 2. Barre de recherche et sélection des catégories */}
        <MarketingFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={BONUS_MARKETING_DATA.categories}
          totalResults={filteredSkills.length + (showCompetitivePrompt ? 1 : 0)}
        />

        {/* 3. Section spéciale : Prompt Universel de Veille Concurrentielle */}
        {showCompetitivePrompt && (
          <section aria-label="Ressource spéciale de recherche">
            <CompetitivePromptCard promptConfig={BONUS_MARKETING_DATA.competitivePrompt} />
          </section>
        )}

        {/* 4. Grille des cartes de Skills marketing */}
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
                  <p className="font-serif text-xs text-ink font-medium leading-relaxed">
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

        {/* 5. Section externe Novitckii (« Pour aller plus loin ») */}
        <section aria-label="Pour aller plus loin">
          <ExternalNovitckiiCard resource={BONUS_MARKETING_DATA.externalResource} />
        </section>
      </div>

      {/* 6. Modale de détail d'une ressource rendue hors flux space-y */}
      <MarketingDetailModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </>
  );
}
