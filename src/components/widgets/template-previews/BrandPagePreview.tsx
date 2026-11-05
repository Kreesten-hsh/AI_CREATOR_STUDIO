import { useState } from 'react';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';

type Persona = 'solo' | 'pme' | 'dirigeant';

interface PersonaSolution {
  title: string;
  badge: string;
  summary: string;
  price: string;
  cta: string;
}

const SOLUTIONS: Record<Persona, PersonaSolution> = {
  solo: {
    title: 'Kit Démarrage Solo & Freelance',
    badge: 'FORMAT ATELIER 1:1',
    summary: 'Structurez votre offre phare et transformez vos tableurs en un produit interactif prêt à vendre en 14 jours.',
    price: '950 € HT',
    cta: 'Réserver un créneau de cadrage solo',
  },
  pme: {
    title: 'Accompagnement Équipe & Studio',
    badge: 'INTERVENTION INTENSIVE',
    summary: 'Digitalisez les méthodes d’expertise de vos consultants dans un portail client sur-mesure déployé en production.',
    price: '3 800 € HT',
    cta: 'Demander un devis pour votre équipe',
  },
  dirigeant: {
    title: 'Conseil Stratégique & Monétisation',
    badge: 'PARTENARIAT ANNUEL',
    summary: 'Stratégie de packaging d’expertise, validation de proposition de valeur et monétisation de logiciels propriétaires.',
    price: 'Sur devis',
    cta: 'Planifier un échange confidentiel',
  },
};

export function BrandPagePreview() {
  const [selectedPersona, setSelectedPersona] = useState<Persona>('solo');
  const solution = SOLUTIONS[selectedPersona];

  return (
    <div className="p-4 sm:p-5 bg-surface border-2 border-ink rounded-brutal-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-primary-red text-surface border border-ink rounded-brutal-tag flex items-center justify-center font-bold text-xs">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </span>
          <div>
            <h5 className="font-display text-sm sm:text-base uppercase tracking-tight text-ink">
              Page de Marque Interactive
            </h5>
            <p className="text-[11px] text-ink/75">Configurateur d’offre dynamique</p>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-pale-pink border border-ink rounded-brutal-tag font-mono text-[10px] font-bold uppercase text-ink">
          EXEMPLE FICTIF
        </span>
      </div>

      {/* Hero minimal */}
      <div className="p-4 bg-ink text-surface border-2 border-ink rounded-brutal-card">
        <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-primary-red text-surface rounded-brutal-tag inline-block mb-1.5">
          POSITIONNEMENT DE VOTRE MARQUE
        </span>
        <h6 className="font-display text-base sm:text-lg uppercase text-surface leading-tight">
          Transformez votre expertise métier en outils interactifs à forte valeur perçue
        </h6>
      </div>

      {/* Sélecteur de persona */}
      <div>
        <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-2">
          Sélectionnez votre situation :
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['solo', 'pme', 'dirigeant'] as Persona[]).map((p) => {
            const isSelected = p === selectedPersona;
            const label = p === 'solo' ? 'Freelance / Solo' : p === 'pme' ? 'PME & Équipe' : 'Dirigeant';
            return (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPersona(p)}
                className={`py-2 px-2 text-center border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase transition-all ${
                  isSelected
                    ? 'bg-primary-red text-surface shadow-brutal'
                    : 'bg-cream text-ink hover:bg-surface'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Solution recommandée dynamique */}
      <div className="p-4 bg-pale-pink border-2 border-ink rounded-brutal-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-surface border border-ink rounded-brutal-tag text-ink">
            {solution.badge}
          </span>
          <span className="font-display text-sm font-bold text-primary-red">{solution.price}</span>
        </div>
        <div>
          <h6 className="font-display text-sm sm:text-base uppercase text-ink font-bold">{solution.title}</h6>
          <p className="text-xs text-ink/80 mt-1 leading-relaxed">{solution.summary}</p>
        </div>
        <button
          type="button"
          className="w-full py-2 px-3 bg-surface text-ink hover:bg-cream border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 shadow-brutal-xs"
        >
          <UserCheck className="w-4 h-4 text-primary-red" aria-hidden="true" />
          <span>{solution.cta}</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
