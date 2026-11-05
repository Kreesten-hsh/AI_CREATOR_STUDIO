import { motion } from 'framer-motion';
import { CheckCircle2, Target, Calendar, Sparkles } from 'lucide-react';
import { COURSE_DATA } from '../../data/course';
import { useProgress } from '../../hooks/useProgress';
import type { Day, Sprint } from '../../types/course';
import type { DailyProgressResult } from '../../utils/progressCalculator';
import { ALL_DOSSIER_FIELD_KEYS } from '../../types/dossier';

export interface DayHeaderProps {
  day: Partial<Day> & { dayNumber: number };
  sprint?: Sprint;
  progress?: DailyProgressResult;
  completedDaysOverride?: number[];
  validFieldsOverride?: string[];
}

// Labels courts en français pour les champs du dossier
const FIELD_SHORT_LABELS: Record<string, string> = {
  documentAnalysis: 'Analyse document',
  functionalBrief: 'Brief fonctionnel',
  targetAudience: 'Cible',
  solutionPromise: 'Promesse',
  productIdentity: 'Identité produit',
  artisticDirection: 'Direction artistique',
  chosenProductModel: 'Modèle de produit',
  coreDataSchema: 'Schéma de données',
  promptWorkflow: 'Flux de prompts',
  conversionCopy: 'Copywriting',
  distributionPlan: 'Plan distribution',
  salesArguments: 'Arguments de vente',
  monetizationSetup: 'Monétisation',
  pricingStrategy: 'Tarification',
  objectionHandling: 'Objections',
  retentionLoop: 'Boucle rétention',
  legalNotice: 'Mentions légales',
  feedbackLoop: 'Boucle feedback',
};

export function DayHeader({
  day,
  sprint,
  progress: progressProp,
  completedDaysOverride,
  validFieldsOverride,
}: DayHeaderProps) {
  const { state, globalProgress, getDayProgress } = useProgress();

  const dayNumber = day.dayNumber;
  const paddedDay = String(dayNumber).padStart(2, '0');
  const totalLessons = COURSE_DATA.totalDays;

  // Progression de la leçon courante (fournie ou calculée)
  const currentProgress = progressProp ?? getDayProgress(dayNumber);

  // 1. Calcul des validations préalables (Règle 6)
  const completedDays = completedDaysOverride ?? globalProgress?.completedDayNumbers ?? [];
  const validFieldsFromDossier = ALL_DOSSIER_FIELD_KEYS.filter(
    (key) => state.dossier?.fields?.[key]?.status === 'valid'
  );
  const validFields = validFieldsOverride ?? validFieldsFromDossier;

  // Texte pour le titre éditorial
  const renderEditorialTitle = () => {
    const title = day.title || `Leçon ${paddedDay}`;
    if (!day.italicTitleWord) {
      return title;
    }
    const regex = new RegExp(`(${day.italicTitleWord})`, 'i');
    const parts = title.split(regex);
    if (parts.length === 1) {
      return (
        <>
          {title}{' '}
          <span className="font-serif italic font-normal lowercase text-2xl sm:text-3xl lg:text-4xl underline decoration-2 underline-offset-4 text-pale-pink">
            {day.italicTitleWord}
          </span>
        </>
      );
    }
    return parts.map((part, idx) =>
      part.toLowerCase() === day.italicTitleWord?.toLowerCase() ? (
        <span
          key={idx}
          className="font-serif italic font-normal lowercase text-2xl sm:text-3xl lg:text-4xl underline decoration-2 underline-offset-4 text-pale-pink mx-0.5"
        >
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  };

  // Replis gracieux pour l'objectif et le livrable (Règle 6)
  const objectiveText =
    day.objective?.trim() ||
    'Découvrir, pratiquer et valider les compétences clés de la leçon avec Claude.';
  const deliverableText =
    day.deliverableSummary?.trim() ||
    'Un livrable concret validé et consigné dans votre dossier de projet.';

  const stepsCount = day.steps?.length ?? 0;

  return (
    <header className="space-y-4">
      {/* Panneau Principal Éditorial */}
      <div className="brutal-card rounded-brutal-card overflow-hidden border-2 border-ink shadow-brutal select-none">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Panneau gauche : Numéro de leçon */}
          <div className="md:col-span-4 lg:col-span-3 bg-checkerboard-pink p-5 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-ink min-h-[140px]">
            <div className="bg-surface border-2 border-ink rounded-brutal-card shadow-brutal px-5 py-3 text-center -rotate-2">
              <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ink/75">
                LEÇON
              </span>
              <span className="block font-serif text-4xl sm:text-5xl leading-none text-ink my-0.5">
                {paddedDay}
              </span>
              <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-primary-red">
                SUR {totalLessons}
              </span>
            </div>
          </div>

          {/* Panneau droit : Titre & Objectif */}
          <div className="md:col-span-8 lg:col-span-9 bg-primary-red text-surface p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 bg-surface text-ink border border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase shadow-brutal-xs">
                  LEÇON {dayNumber} SUR {totalLessons}
                </span>
                {sprint && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-ink text-surface border border-surface/40 rounded-brutal-tag font-mono text-[11px] font-bold uppercase">
                    MODULE 0{sprint.sprintNumber}
                  </span>
                )}
                {currentProgress.isCompleted && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-pale-pink text-ink border border-ink rounded-brutal-tag font-mono text-[11px] font-bold uppercase">
                    LEÇON TERMINÉE
                  </span>
                )}
              </div>

              <h2 className="font-display text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight leading-tight text-surface">
                {renderEditorialTitle()}
              </h2>

              <p className="mt-1.5 text-xs sm:text-sm text-surface/90 max-w-2xl leading-relaxed">
                {objectiveText}
              </p>
            </div>

            {/* Barre de progression des étapes */}
            <div className="pt-2 border-t border-surface/20 flex items-center gap-3">
              <span className="font-mono text-[11px] font-bold uppercase shrink-0 text-surface">
                {stepsCount} {stepsCount <= 1 ? 'étape dans cette leçon' : 'étapes dans cette leçon'}
              </span>
              <div className="flex-1 h-2.5 bg-cream border border-ink rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={false}
                  animate={{ width: `${currentProgress.percentage}%` }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="h-full bg-primary-red rounded-full"
                />
              </div>
              <span className="font-mono text-[11px] font-bold shrink-0 text-surface">
                {currentProgress.completedCount}/{currentProgress.total || stepsCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cadre de Suivi Pédagogique à 4 Ancres (Règle 6 & Étape 6) */}
      <section
        aria-label="Cadre de suivi pédagogique de la leçon"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {/* Ancre 1 : Ce que vous avez validé */}
        <div className="brutal-card rounded-brutal-card p-3.5 bg-surface border-2 border-ink shadow-brutal-xs flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink">
                Acquis validés
              </span>
            </div>

            <div className="text-xs text-ink/85 space-y-1">
              {/* Leçons préalables */}
              {completedDays.length > 0 ? (
                <p className="font-mono text-[11px]">
                  <strong>{completedDays.length}</strong> leçon
                  {completedDays.length > 1 ? 's' : ''} terminée
                  {completedDays.length > 1 ? 's' : ''}{' '}
                  <span className="text-ink/60">
                    ({completedDays.map((d) => `L${String(d).padStart(2, '0')}`).join(', ')})
                  </span>
                </p>
              ) : (
                <p className="text-[11px] text-ink/70 italic">
                  Début de parcours (aucune leçon précédente requise).
                </p>
              )}

              {/* Livrables de dossier validés */}
              <p className="font-mono text-[11px]">
                <strong>{validFields.length}</strong> livrable
                {validFields.length > 1 ? 's' : ''} validé
                {validFields.length > 1 ? 's' : ''} au dossier
                {validFields.length > 0 && (
                  <span className="block text-[10px] text-ink/60 mt-0.5 truncate">
                    {validFields
                      .slice(0, 3)
                      .map((k) => FIELD_SHORT_LABELS[k] ?? k)
                      .join(', ')}
                    {validFields.length > 3 ? '…' : ''}
                  </span>
                )}
              </p>

              {/* Contexte éditorial optionnel (complète sans remplacer) */}
              {day.completedContext && (
                <p className="text-[11px] text-ink/80 pt-1 border-t border-ink/10 italic">
                  {day.completedContext}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Ancre 2 : Ce que vous faites aujourd'hui */}
        <div className="brutal-card rounded-brutal-card p-3.5 bg-pale-pink border-2 border-ink shadow-brutal-xs flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-ink">
              <Target className="w-4 h-4 shrink-0 text-primary-red" aria-hidden="true" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink">
                Aujourd’hui
              </span>
            </div>
            <p className="text-xs text-ink/90 font-medium leading-relaxed">
              {day.todayAction?.trim() || objectiveText}
            </p>
          </div>
        </div>

        {/* Ancre 3 : Ce que vous aurez ce soir */}
        <div className="brutal-card rounded-brutal-card p-3.5 bg-cream border-2 border-ink shadow-brutal-xs flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-ink">
              <Calendar className="w-4 h-4 shrink-0 text-ink" aria-hidden="true" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink">
                Ce soir
              </span>
            </div>
            <p className="text-xs text-ink/90 leading-relaxed font-mono">
              {day.eveningDeliverable?.trim() || deliverableText}
            </p>
          </div>
        </div>

        {/* Ancre 4 : À quoi cela servira demain */}
        <div className="brutal-card rounded-brutal-card p-3.5 bg-surface border-2 border-ink shadow-brutal-xs flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-primary-red">
              <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink">
                Utilité demain
              </span>
            </div>
            <p className="text-xs text-ink/85 leading-relaxed">
              {day.tomorrowUtility?.trim() ||
                'Ce livrable servira directement de matière brute pour les prochaines étapes de conception et de publication.'}
            </p>
          </div>
        </div>
      </section>
    </header>
  );
}
