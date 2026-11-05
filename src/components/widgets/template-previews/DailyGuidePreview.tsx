import { useState } from 'react';
import { Calendar, Flame, Check, Sparkles } from 'lucide-react';

interface DayItem {
  dayNumber: number;
  title: string;
  action: string;
  duration: string;
}

const SAMPLE_DAYS: DayItem[] = [
  { dayNumber: 1, title: 'Définir sa cible', action: 'Rédiger le portrait de votre acheteur en 3 phrases.', duration: '12 min' },
  { dayNumber: 2, title: 'Cibler le problème', action: 'Formuler l’obstacle numéro 1 rencontré sur le terrain.', duration: '15 min' },
  { dayNumber: 3, title: 'Mécanisme de calcul', action: 'Écrire la formule mathématique ou logique sur papier.', duration: '10 min' },
  { dayNumber: 4, title: 'Maquette Claude', action: 'Générer le premier artifact autonome avec le prompt type.', duration: '20 min' },
  { dayNumber: 5, title: 'Test utilisateur', action: 'Faire tester l’outil à 1 personne en situation réelle.', duration: '15 min' },
];

export function DailyGuidePreview() {
  const [activeDay, setActiveDay] = useState(2);
  const [completedDays, setCompletedDays] = useState<number[]>([1]);
  const streak = completedDays.length;

  const currentDayData = SAMPLE_DAYS.find((d) => d.dayNumber === activeDay) ?? SAMPLE_DAYS[1];
  const isDone = completedDays.includes(activeDay);

  const toggleDayCompletion = () => {
    if (isDone) {
      setCompletedDays(completedDays.filter((d) => d !== activeDay));
    } else {
      setCompletedDays([...completedDays, activeDay]);
    }
  };

  return (
    <div className="p-4 sm:p-5 bg-surface border-2 border-ink rounded-brutal-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-primary-red text-surface border border-ink rounded-brutal-tag flex items-center justify-center font-bold text-xs">
            <Calendar className="w-4 h-4" aria-hidden="true" />
          </span>
          <div>
            <h5 className="font-display text-sm sm:text-base uppercase tracking-tight text-ink">
              Défi Quotidien 5 Jours
            </h5>
            <p className="text-[11px] text-ink/75">1 micro-action opérationnelle par jour</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-pale-pink border border-ink rounded-brutal-tag font-mono text-xs font-bold text-primary-red">
            <Flame className="w-3.5 h-3.5 fill-primary-red" aria-hidden="true" />
            STREAK : {streak} JOURS
          </span>
          <span className="px-2 py-0.5 bg-cream border border-ink rounded-brutal-tag font-mono text-[10px] font-bold uppercase text-ink">
            EXEMPLE FICTIF
          </span>
        </div>
      </div>

      {/* Sélecteur de timeline */}
      <div className="grid grid-cols-5 gap-2">
        {SAMPLE_DAYS.map((d) => {
          const isActive = d.dayNumber === activeDay;
          const completed = completedDays.includes(d.dayNumber);
          return (
            <button
              key={d.dayNumber}
              type="button"
              onClick={() => setActiveDay(d.dayNumber)}
              className={`p-2 text-center border-2 border-ink rounded-brutal-btn transition-all ${
                isActive
                  ? 'bg-primary-red text-surface shadow-brutal'
                  : completed
                  ? 'bg-pale-pink text-ink hover:bg-surface'
                  : 'bg-cream text-ink hover:bg-surface'
              }`}
            >
              <span className="block font-mono text-xs font-bold">J{d.dayNumber}</span>
              <span className="block text-[10px] mt-0.5 truncate">{completed ? '✓ Fait' : d.duration}</span>
            </button>
          );
        })}
      </div>

      {/* Action concrète du jour actif */}
      <div className="p-4 bg-cream border-2 border-ink rounded-brutal-card space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold uppercase text-primary-red flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Action du Jour {currentDayData.dayNumber} : {currentDayData.title}
          </span>
          <span className="font-mono text-[11px] px-2 py-0.5 bg-surface border border-ink rounded-brutal-tag">
            Durée : {currentDayData.duration}
          </span>
        </div>
        <p className="text-xs text-ink/85 leading-relaxed font-medium">
          {currentDayData.action}
        </p>

        <button
          type="button"
          onClick={toggleDayCompletion}
          className={`w-full py-2.5 px-4 border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${
            isDone
              ? 'bg-emerald-600 text-surface shadow-brutal-xs'
              : 'bg-primary-red text-surface hover:bg-dark-red shadow-brutal'
          }`}
        >
          <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
          {isDone ? 'Journée validée ! (Cliquer pour annuler)' : 'Marquer cette journée comme terminée'}
        </button>
      </div>
    </div>
  );
}
