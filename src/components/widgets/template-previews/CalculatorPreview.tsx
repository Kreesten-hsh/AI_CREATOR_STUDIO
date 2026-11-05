import { useState } from 'react';
import { Calculator, TrendingUp, AlertCircle } from 'lucide-react';

export function CalculatorPreview() {
  const [dailyRate, setDailyRate] = useState(450);
  const [billableDays, setBillableDays] = useState(14);
  const [expenses, setExpenses] = useState(1200);

  const grossMonthly = dailyRate * billableDays;
  const netMonthly = Math.max(0, grossMonthly - expenses);
  const breakEvenDays = Math.ceil(expenses / Math.max(1, dailyRate));

  return (
    <div className="p-4 sm:p-5 bg-surface border-2 border-ink rounded-brutal-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-primary-red text-surface border border-ink rounded-brutal-tag flex items-center justify-center font-bold text-xs">
            <Calculator className="w-4 h-4" aria-hidden="true" />
          </span>
          <div>
            <h5 className="font-display text-sm sm:text-base uppercase tracking-tight text-ink">
              Simulateur de Revenu Freelance
            </h5>
            <p className="text-[11px] text-ink/75">Calcul dynamique en direct</p>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-pale-pink border border-ink rounded-brutal-tag font-mono text-[10px] font-bold uppercase text-ink">
          EXEMPLE FICTIF
        </span>
      </div>

      {/* Contrôles de simulation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-cream border border-ink rounded-brutal-card">
          <label htmlFor="prev-daily-rate" className="block font-mono text-[11px] font-bold uppercase text-ink mb-1">
            Tarif / Jour : <span className="text-primary-red font-bold">{dailyRate} €</span>
          </label>
          <input
            id="prev-daily-rate"
            type="range"
            min={200}
            max={1200}
            step={25}
            value={dailyRate}
            onChange={(e) => setDailyRate(Number(e.target.value))}
            className="w-full accent-primary-red cursor-pointer"
          />
        </div>

        <div className="p-3 bg-cream border border-ink rounded-brutal-card">
          <label htmlFor="prev-days" className="block font-mono text-[11px] font-bold uppercase text-ink mb-1">
            Jours Facturés : <span className="text-primary-red font-bold">{billableDays} j</span>
          </label>
          <input
            id="prev-days"
            type="range"
            min={1}
            max={22}
            value={billableDays}
            onChange={(e) => setBillableDays(Number(e.target.value))}
            className="w-full accent-primary-red cursor-pointer"
          />
        </div>

        <div className="p-3 bg-cream border border-ink rounded-brutal-card">
          <label htmlFor="prev-expenses" className="block font-mono text-[11px] font-bold uppercase text-ink mb-1">
            Charges Mensuelles : <span className="text-primary-red font-bold">{expenses} €</span>
          </label>
          <input
            id="prev-expenses"
            type="range"
            min={200}
            max={3000}
            step={100}
            value={expenses}
            onChange={(e) => setExpenses(Number(e.target.value))}
            className="w-full accent-primary-red cursor-pointer"
          />
        </div>
      </div>

      {/* Résultats calculés instantanés */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3 bg-ink text-surface border-2 border-ink rounded-brutal-card text-center">
          <span className="font-mono text-[10px] uppercase font-bold text-dusty-pink block">
            Chiffre d’Affaires Brut
          </span>
          <span className="font-display text-xl sm:text-2xl text-surface font-bold">
            {grossMonthly.toLocaleString('fr-FR')} €
          </span>
        </div>

        <div className="p-3 bg-pale-pink text-ink border-2 border-ink rounded-brutal-card text-center shadow-brutal-xs">
          <span className="font-mono text-[10px] uppercase font-bold text-ink/75 block">
            Bénéfice Net Estimé
          </span>
          <span className="font-display text-xl sm:text-2xl text-primary-red font-bold flex items-center justify-center gap-1">
            <TrendingUp className="w-5 h-5" aria-hidden="true" />
            {netMonthly.toLocaleString('fr-FR')} €
          </span>
        </div>

        <div className="p-3 bg-surface text-ink border-2 border-ink rounded-brutal-card text-center">
          <span className="font-mono text-[10px] uppercase font-bold text-ink/75 block">
            Seuil de Rentabilité
          </span>
          <span className="font-display text-xl sm:text-2xl text-ink font-bold">
            {breakEvenDays} jours / mois
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2 bg-cream border border-ink rounded text-[11px] text-ink/80">
        <AlertCircle className="w-4 h-4 text-primary-red shrink-0" aria-hidden="true" />
        <span>Aperçu interactif : les curseurs simulent la réactivité en direct d’un produit de type calculateur.</span>
      </div>
    </div>
  );
}
