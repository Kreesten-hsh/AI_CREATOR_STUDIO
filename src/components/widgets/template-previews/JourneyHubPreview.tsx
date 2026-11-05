import { useState } from 'react';
import { CheckCircle2, Lock, BookOpen, Compass } from 'lucide-react';

interface Milestone {
  id: string;
  number: string;
  title: string;
  status: 'completed' | 'current' | 'locked';
  deliverable: string;
}

const SAMPLE_MILESTONES: Milestone[] = [
  {
    id: 'm1',
    number: '01',
    title: 'Audit de la matière initiale',
    status: 'completed',
    deliverable: 'Fiche d’inventaire des contenus et problème client prioritaire identifié',
  },
  {
    id: 'm2',
    number: '02',
    title: 'Architecture du produit interactif',
    status: 'current',
    deliverable: 'Spécification fonctionnelle et choix du mécanisme de calcul',
  },
  {
    id: 'm3',
    number: '03',
    title: 'Génération du code autonome',
    status: 'locked',
    deliverable: 'Fichier HTML/JS interactif prêt au test',
  },
];

export function JourneyHubPreview() {
  const [activeMilestoneId, setActiveMilestoneId] = useState('m2');
  const activeMilestone = SAMPLE_MILESTONES.find((m) => m.id === activeMilestoneId) ?? SAMPLE_MILESTONES[1];

  return (
    <div className="p-4 sm:p-5 bg-surface border-2 border-ink rounded-brutal-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-primary-red text-surface border border-ink rounded-brutal-tag flex items-center justify-center font-bold text-xs">
            <Compass className="w-4 h-4" aria-hidden="true" />
          </span>
          <div>
            <h5 className="font-display text-sm sm:text-base uppercase tracking-tight text-ink">
              Hub de Formation Pas-à-Pas
            </h5>
            <p className="text-[11px] text-ink/75">Parcours en 3 jalons séquentiels</p>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-pale-pink border border-ink rounded-brutal-tag font-mono text-[10px] font-bold uppercase text-ink">
          EXEMPLE FICTIF
        </span>
      </div>

      {/* Liste des jalons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SAMPLE_MILESTONES.map((m) => {
          const isSelected = m.id === activeMilestoneId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveMilestoneId(m.id)}
              className={`p-3 text-left border-2 border-ink rounded-brutal-card transition-all ${
                isSelected
                  ? 'bg-pale-pink shadow-brutal ring-2 ring-primary-red'
                  : 'bg-cream hover:bg-surface'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-mono text-xs font-bold text-primary-red">JALON {m.number}</span>
                {m.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-label="Terminé" />}
                {m.status === 'current' && <span className="w-2 h-2 rounded-full bg-primary-red animate-pulse" />}
                {m.status === 'locked' && <Lock className="w-3.5 h-3.5 text-ink/50" aria-label="Verrouillé" />}
              </div>
              <p className="font-bold text-xs text-ink line-clamp-1">{m.title}</p>
            </button>
          );
        })}
      </div>

      {/* Détail du jalon actif */}
      <div className="p-4 bg-cream border-2 border-ink rounded-brutal-card space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary-red" aria-hidden="true" />
          <span className="font-mono text-xs font-bold uppercase text-ink">
            Détail du Jalon {activeMilestone.number} : {activeMilestone.title}
          </span>
        </div>
        <p className="text-xs text-ink/80 leading-relaxed">
          <strong>Livrable attendu :</strong> {activeMilestone.deliverable}
        </p>
        <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-ink/75">
          <span>Statut : {activeMilestone.status === 'completed' ? 'Validé' : activeMilestone.status === 'current' ? 'En cours d’étude' : 'À venir'}</span>
          <span className="text-primary-red font-bold">Progression : 33%</span>
        </div>
      </div>
    </div>
  );
}
