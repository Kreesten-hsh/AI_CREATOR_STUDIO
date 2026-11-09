import { Search, X } from 'lucide-react';
import type { MarketingCategory, MarketingCategoryConfig } from '../../types/marketing';

interface MarketingFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: MarketingCategory;
  onCategoryChange: (category: MarketingCategory) => void;
  categories: MarketingCategoryConfig[];
  totalResults: number;
}

export function MarketingFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalResults,
}: MarketingFilterBarProps) {
  return (
    <section
      aria-label="Recherche et filtres de la bibliothèque"
      className="space-y-4 p-4 sm:p-5 bg-surface border-2 border-ink rounded-brutal-card shadow-brutal-xs"
    >
      {/* Barre de recherche */}
      <div className="relative">
        <label htmlFor="marketing-search-input" className="sr-only">
          Rechercher une ressource ou un skill
        </label>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/60">
          <Search className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
        </div>
        <input
          id="marketing-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher par mot-clé, problème, nom technique (ex: pricing, bio, story)..."
          className="w-full pl-10 pr-10 py-2.5 bg-cream border-2 border-ink rounded-brutal-btn font-serif text-sm text-ink placeholder:text-ink/50 focus:outline-none focus:bg-surface focus:shadow-brutal-xs transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Effacer la recherche"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink/60 hover:text-primary-red"
          >
            <X className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Groupe de filtres accessible */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-ink/15">
        <div
          role="group"
          aria-label="Filtrer les ressources par catégorie"
          className="flex flex-wrap items-center gap-2"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onCategoryChange(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all border-2 border-ink rounded-brutal-tag ${
                  isSelected
                    ? 'bg-primary-red text-surface shadow-brutal-xs -translate-y-0.5'
                    : 'bg-cream text-ink hover:bg-surface'
                }`}
              >
                <span>{cat.label}</span>
                {cat.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 border border-ink rounded-full ${
                      isSelected ? 'bg-surface text-ink' : 'bg-pale-pink text-ink'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="font-mono text-xs text-ink/70">
          <span className="font-bold text-ink">{totalResults}</span> ressource{totalResults > 1 ? 's' : ''} trouvée{totalResults > 1 ? 's' : ''}
        </div>
      </div>
    </section>
  );
}
