import { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Construction,
} from 'lucide-react';
import { BONUSES } from '../../data/navigation/bonuses';
import { useProgress } from '../../hooks/useProgress';
import { LessonRenderer } from '../course/LessonRenderer';
import { HelpPanel } from '../widgets/HelpPanel';
import { MarketingLibraryView } from './MarketingLibraryView';
import type { BonusLesson } from '../../types/navigation';
import type { StepHelpConfig, TroubleshootingPrompt } from '../../types/course';

interface BonusViewProps {
  bonusId: string;
}

export function BonusView({ bonusId }: BonusViewProps) {
  // Respect strict des Rules of Hooks : délégation inconditionnelle si bonus-marketing
  if (bonusId === 'bonus-marketing') {
    return <MarketingLibraryView />;
  }

  return <ManyChatBonusView bonusId={bonusId} />;
}

function ManyChatBonusView({ bonusId }: { bonusId: string }) {
  const { navigateToHome } = useProgress();
  const bonus = BONUSES.find((b) => b.id === bonusId) ?? BONUSES[0];

  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  const lessons: BonusLesson[] = bonus.lessons ?? [];
  const hasLessons = lessons.length > 0;
  const currentLesson: BonusLesson | undefined = lessons[activeLessonIndex] ?? lessons[0];

  const handleSelectLesson = (index: number) => {
    setActiveLessonIndex(index);
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        // Environnements sans scrollTo (ex. jsdom)
      }
    }
  };

  const handlePreviousLesson = () => {
    if (activeLessonIndex > 0) {
      handleSelectLesson(activeLessonIndex - 1);
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < lessons.length - 1) {
      handleSelectLesson(activeLessonIndex + 1);
    }
  };

  // Fallback si bonus en reconstruction
  if (!hasLessons) {
    return (
      <div className="space-y-6">
        <header className="brutal-card rounded-brutal-card overflow-hidden border-2 border-ink shadow-brutal">
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-4 lg:col-span-3 bg-checkerboard-pink p-6 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-ink min-h-[140px]">
              <div className="bg-surface border-2 border-ink rounded-brutal-card shadow-brutal px-5 py-3 text-center -rotate-2">
                <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ink">
                  BONUS
                </span>
                <span className="block font-serif text-3xl leading-none text-ink my-1">
                  01
                </span>
              </div>
            </div>
            <div className="md:col-span-8 lg:col-span-9 bg-primary-red text-surface p-6 md:p-8 flex flex-col justify-center gap-3">
              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight leading-tight text-surface">
                {bonus.title}
              </h2>
            </div>
          </div>
        </header>

        <section
          aria-label="État du bonus"
          className="brutal-card rounded-brutal-card bg-surface p-8 sm:p-12 border-2 border-ink shadow-brutal text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-pale-pink border-2 border-ink rounded-brutal-btn shadow-brutal-xs">
            <Construction className="w-7 h-7 text-primary-red" aria-hidden="true" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="font-display text-xl uppercase tracking-tight text-ink">
              Contenu en cours de reconstruction.
            </h3>
            <p className="font-serif text-sm text-ink leading-relaxed">
              Ce bonus pratique fait partie du cursus et son contenu sera intégré dans la prochaine phase.
            </p>
          </div>
        </section>
      </div>
    );
  }

  // Consolidation de l'aide des 3 parties de la leçon active (Règle B4)
  const consolidatedHelp: StepHelpConfig | undefined = (() => {
    if (!currentLesson) return undefined;
    const allMistakes: { mistake: string; correction: string }[] = [];
    const allTips: string[] = [];
    const allPrompts: TroubleshootingPrompt[] = [];

    currentLesson.parts.forEach((part) => {
      if (part.help?.frequentMistakes) {
        allMistakes.push(...part.help.frequentMistakes);
      }
      if (part.help?.tips) {
        allTips.push(...part.help.tips);
      }
      if (part.help?.troubleshootingPrompts) {
        part.help.troubleshootingPrompts.forEach((prompt) => {
          allPrompts.push({
            ...prompt,
            id: `${part.id}-${prompt.id}`,
          });
        });
      }
    });

    if (allMistakes.length === 0 && allTips.length === 0 && allPrompts.length === 0) {
      return undefined;
    }

    return {
      frequentMistakes: allMistakes,
      tips: allTips,
      troubleshootingPrompts: allPrompts,
    };
  })();

  const renderEditorialBonusTitle = () => {
    const title = bonus.title;
    const match = title.match(/(ManyChat)/i);
    if (!match) return title;

    const parts = title.split(/(ManyChat)/i);
    return parts.map((part, idx) =>
      part.toLowerCase() === 'manychat' ? (
        <span
          key={idx}
          className="font-serif italic font-normal lowercase text-2xl sm:text-3xl text-cream mx-1"
        >
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* 1. Bannière Hero éditoriale du Bonus 01 (B1) */}
      <header className="brutal-card rounded-brutal-card overflow-hidden border-2 border-ink shadow-brutal">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Panneau gauche : damier rose sobre */}
          <div className="md:col-span-4 lg:col-span-3 bg-checkerboard-pink p-6 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-ink min-h-[150px]">
            <div className="bg-surface border-2 border-ink rounded-brutal-card shadow-brutal px-5 py-3 text-center -rotate-2">
              <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ink">
                BONUS
              </span>
              <span className="block font-serif text-3xl sm:text-4xl leading-none text-ink my-1">
                01
              </span>
            </div>
          </div>

          {/* Panneau droit : fond rouge brique épuré */}
          <div className="md:col-span-8 lg:col-span-9 bg-primary-red text-surface p-6 sm:p-7 md:p-8 flex flex-col justify-between gap-3">
            <div>
              <h2 className="font-display text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight leading-tight text-surface">
                {renderEditorialBonusTitle()}
              </h2>

              {bonus.subtitle && (
                <p className="font-serif text-sm sm:text-base text-surface mt-2.5 leading-relaxed max-w-2xl">
                  {bonus.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Navigation compacte des 5 leçons sans conteneur englobant */}
      <nav
        aria-label="Navigation des 5 leçons"
        className="w-full space-y-2.5"
      >
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-[11px] font-bold uppercase text-ink tracking-wider">
            PARCOURS CONVERSATIONNEL
          </span>
          <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 bg-surface border-2 border-ink rounded-full text-ink shadow-brutal-xs">
            Leçon 0{activeLessonIndex + 1} / 05
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
          {lessons.map((lesson, idx) => {
            const isActive = idx === activeLessonIndex;

            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => handleSelectLesson(idx)}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3 py-2.5 text-left border-2 border-ink rounded-brutal-btn transition-all flex items-center gap-2.5 min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary-red ${isActive
                    ? 'bg-primary-red text-surface shadow-brutal-xs font-bold -translate-y-0.5'
                    : 'bg-surface text-ink hover:bg-cream shadow-brutal-xs'
                  }`}
              >
                <span
                  className={`w-7 h-7 shrink-0 border-2 border-ink rounded-brutal-tag font-mono text-[10px] font-bold flex items-center justify-center ${isActive ? 'bg-surface text-primary-red' : 'bg-cream text-ink'
                    }`}
                  aria-hidden="true"
                >
                  L0{lesson.lessonNumber}
                </span>

                <div className="min-w-0 flex-1">
                  <span className="text-[11px] sm:text-xs font-bold uppercase leading-snug line-clamp-2 break-words block">
                    {lesson.title}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-medium block ${isActive ? 'text-surface/95' : 'text-ink/80'
                      }`}
                  >
                    {lesson.duration}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Page complète de la leçon sélectionnée */}
      {currentLesson && (
        <article
          aria-label={`Leçon 0${currentLesson.lessonNumber} : ${currentLesson.title}`}
          className="space-y-8"
        >
          {/* En-tête fusionné de la leçon active (B3) */}
          <header className="brutal-card rounded-brutal-card p-5 sm:p-6 md:p-7 bg-surface border-2 border-ink shadow-brutal space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/20 pb-2.5">
              <span className="font-mono text-[11px] font-bold uppercase px-2.5 py-0.5 bg-primary-red text-surface border border-ink rounded-full shadow-brutal-xs">
                LEÇON 0{currentLesson.lessonNumber} / 05
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-ink">
                <Clock className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
                Durée : {currentLesson.duration}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-ink leading-tight">
                {currentLesson.title}
              </h3>

              <p className="font-serif text-sm sm:text-base text-ink leading-relaxed">
                {currentLesson.objective}
              </p>

              {currentLesson.deliverable && (
                <div className="pt-1">
                  <span className="inline-block px-3 py-1.5 bg-cream border border-ink rounded-brutal-tag font-mono text-xs font-medium text-ink leading-relaxed break-words">
                    <strong className="text-primary-red font-bold">À la fin : </strong>
                    {currentLesson.deliverable}
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* Rendu vertical continu des 3 grandes parties éditoriales */}
          <div className="space-y-10">
            {currentLesson.parts.map((part, pIdx) => {
              return (
                <section
                  key={part.id}
                  id={part.id}
                  aria-label={part.title}
                  className="space-y-6"
                >
                  {/* Séparateur éditorial discret entre grandes parties */}
                  {pIdx > 0 && (
                    <div className="pt-4 pb-1 flex items-center gap-3" aria-hidden="true">
                      <div className="h-[1px] flex-1 bg-ink/20" />
                      <div className="w-2 h-2 rotate-45 border border-ink/40 bg-pale-pink" />
                      <div className="h-[1px] flex-1 bg-ink/20" />
                    </div>
                  )}

                  {/* En-tête de partie */}
                  <div className="border-l-4 border-primary-red pl-3.5 py-0.5 space-y-0.5">
                    <h4 className="font-display text-lg sm:text-xl uppercase tracking-tight text-ink">
                      {part.title}
                    </h4>
                    {part.subtitle && (
                      <p className="font-serif text-xs sm:text-sm text-ink/90 font-medium">
                        {part.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Blocs pédagogiques de la partie */}
                  <LessonRenderer blocks={part.blocks} />
                </section>
              );
            })}
          </div>

          {/* 4. HelpPanel UNIQUE consolidé pour la leçon (B4) */}
          {consolidatedHelp && (
            <HelpPanel
              help={consolidatedHelp}
              stepTitle={`Leçon 0${currentLesson.lessonNumber}`}
              defaultOpen={false}
            />
          )}

          {/* 5. Navigation linéaire précédente / suivante sans carte englobante */}
          <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-2 w-full">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink block">
                NAVIGATION DANS LE BONUS
              </span>
              <p className="font-display text-sm sm:text-base uppercase text-ink mt-0.5">
                Leçon 0{activeLessonIndex + 1} sur 05 : {currentLesson.title}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {activeLessonIndex > 0 && (
                <button
                  type="button"
                  onClick={handlePreviousLesson}
                  className="brutal-btn rounded-brutal-btn px-4 py-2.5 min-h-[44px] font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-1.5 flex-1 sm:flex-initial bg-surface text-ink border-2 border-ink hover:bg-cream"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                  <span>Leçon précédente</span>
                </button>
              )}

              {activeLessonIndex < lessons.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextLesson}
                  className="brutal-btn rounded-brutal-btn px-5 py-2.5 min-h-[44px] font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-1.5 flex-1 sm:flex-initial bg-primary-red text-surface border-2 border-ink hover:bg-dark-red shadow-brutal-xs"
                >
                  <span>Leçon suivante</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={navigateToHome}
                  className="brutal-btn rounded-brutal-btn px-5 py-2.5 min-h-[44px] font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-1.5 flex-1 sm:flex-initial bg-primary-red text-surface border-2 border-ink hover:bg-dark-red shadow-brutal-xs"
                >
                  <span>Terminer le bonus & retour au sommaire</span>
                  <ArrowLeft className="w-4 h-4 stroke-[2.5] rotate-180" aria-hidden="true" />
                </button>
              )}
            </div>
          </footer>
        </article>
      )}
    </div>
  );
}
