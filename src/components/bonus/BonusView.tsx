import { useState } from 'react';
import {
  ArrowLeft,
  Gift,
  Construction,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  Target,
  FileCheck2,
} from 'lucide-react';
import { BONUSES } from '../../data/navigation/bonuses';
import { useProgress } from '../../hooks/useProgress';
import { LessonRenderer } from '../course/LessonRenderer';
import { HelpPanel } from '../widgets/HelpPanel';
import type { BonusLesson } from '../../types/navigation';

interface BonusViewProps {
  bonusId: string;
}

export function BonusView({ bonusId }: BonusViewProps) {
  const { navigateToHome } = useProgress();
  const bonus = BONUSES.find((b) => b.id === bonusId) ?? BONUSES[0];

  // Index de la leçon actuellement ouverte (0 à 4)
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
        // Environnements sans implémentation complète de scrollTo (ex. jsdom)
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

  // Rendu de l'état "en cours de reconstruction" pour les bonus sans leçons (ex: Bonus 02)
  if (!hasLessons) {
    return (
      <div className="space-y-6">
        {/* Bouton retour au sommaire */}
        <button
          type="button"
          onClick={navigateToHome}
          className="group inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ink/75 hover:text-primary-red transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
          <span>RETOUR AU SOMMAIRE DE LA FORMATION</span>
        </button>

        {/* Bannière du Bonus */}
        <header className="brutal-card rounded-brutal-card overflow-hidden border-2 border-ink shadow-brutal">
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-4 lg:col-span-3 bg-checkerboard-pink p-6 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-ink min-h-[140px]">
              <div className="bg-surface border-2 border-ink rounded-brutal-card shadow-brutal px-5 py-3 text-center -rotate-2">
                <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ink/75">
                  BONUS PRATIQUE
                </span>
                <span className="block font-serif text-3xl leading-none text-ink my-1">
                  {bonus.orderNumber}
                </span>
                <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary-red">
                  INCLUS
                </span>
              </div>
            </div>

            <div className="md:col-span-8 lg:col-span-9 bg-surface p-6 md:p-8 flex flex-col justify-center gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pale-pink text-ink border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase">
                  <Gift className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
                  {bonus.orderNumber}
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight leading-tight text-ink">
                {bonus.title}
              </h2>
            </div>
          </div>
        </header>

        {/* État vide en cours de reconstruction */}
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
            <p className="font-serif text-sm text-ink/75 leading-relaxed">
              Ce bonus pratique fait partie du cursus et son contenu sera intégré dans la prochaine phase.
            </p>
          </div>
        </section>
      </div>
    );
  }

  // Rendu complet du Bonus 01 (ManyChat Automation System)
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

      {/* 2. Bannière éditoriale néo-brutaliste du Bonus 01 */}
      <header className="brutal-card rounded-brutal-card overflow-hidden border-2 border-ink shadow-brutal">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Panneau gauche */}
          <div className="md:col-span-4 lg:col-span-3 bg-checkerboard-pink p-6 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-ink min-h-[160px]">
            <div className="bg-surface border-2 border-ink rounded-brutal-card shadow-brutal px-5 py-3 text-center -rotate-2">
              <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ink/75">
                MINI-COURS BONUS
              </span>
              <span className="block font-serif text-3xl sm:text-4xl leading-none text-ink my-1">
                {bonus.orderNumber}
              </span>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary-red">
                5 LEÇONS PRATIQUES
              </span>
            </div>
          </div>

          {/* Panneau droit */}
          <div className="md:col-span-8 lg:col-span-9 bg-surface p-6 md:p-8 flex flex-col justify-between gap-4">
            <div>
              {/* Badges de stack */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-pale-pink text-ink border border-ink rounded-brutal-tag font-mono text-[11px] font-bold uppercase">
                  <Gift className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
                  {bonus.orderNumber}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cream text-ink border border-ink rounded-brutal-tag font-mono text-[11px] font-bold uppercase">
                  <Sparkles className="w-3 h-3 text-primary-red" aria-hidden="true" />
                  Claude Free + ManyChat Free
                </span>
                <span className="inline-flex items-center px-2 py-0.5 bg-surface text-ink border border-ink rounded-brutal-tag font-mono text-[11px] font-bold uppercase">
                  Durée globale : {bonus.duration}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 bg-surface text-ink border border-ink rounded-brutal-tag font-mono text-[11px] font-bold uppercase">
                  0 € de budget pub requis
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight leading-tight text-ink">
                {bonus.title}
              </h2>

              {bonus.subtitle && (
                <p className="font-serif text-sm md:text-base text-ink/80 mt-2 leading-relaxed">
                  {bonus.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 3. Sélecteur horizontal des 5 leçons */}
      <section
        aria-label="Navigation des 5 leçons"
        className="p-3 bg-surface border-2 border-ink rounded-brutal-card shadow-brutal-xs"
      >
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="font-mono text-[11px] font-bold uppercase text-ink/75 tracking-wider">
            PARCOURS CONVERSATIONNEL
          </span>
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-cream border border-ink rounded-brutal-tag text-ink">
            Leçon 0{activeLessonIndex + 1} / 05
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {lessons.map((lesson, idx) => {
            const isActive = idx === activeLessonIndex;

            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => handleSelectLesson(idx)}
                aria-current={isActive ? 'page' : undefined}
                className={`p-3 text-left border-2 border-ink rounded-brutal-btn transition-all flex flex-col justify-between min-h-[64px] ${
                  isActive
                    ? 'bg-primary-red text-surface shadow-brutal-xs font-bold -translate-y-0.5'
                    : 'bg-cream text-ink hover:bg-surface'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border border-ink rounded-brutal-tag ${
                      isActive ? 'bg-surface text-ink' : 'bg-surface text-ink'
                    }`}
                  >
                    L0{lesson.lessonNumber}
                  </span>
                  <span className="font-mono text-[10px] opacity-80">
                    {lesson.duration}
                  </span>
                </div>
                <span className="text-[11px] font-bold uppercase leading-tight line-clamp-1 mt-1.5">
                  {lesson.title}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Page complète de la leçon sélectionnée (3 grandes parties dans un flux vertical) */}
      {currentLesson && (
        <article
          aria-label={`Leçon 0${currentLesson.lessonNumber} : ${currentLesson.title}`}
          className="space-y-8"
        >
          {/* En-tête éditorial de la leçon */}
          <header className="brutal-card rounded-brutal-card p-6 md:p-8 bg-surface border-2 border-ink shadow-brutal space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase px-2.5 py-1 bg-primary-red text-surface border border-ink rounded-brutal-tag">
                  LEÇON 0{currentLesson.lessonNumber} / 05
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-ink/75">
                  <Clock className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
                  Durée estimée : {currentLesson.duration}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-ink leading-tight">
                {currentLesson.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-cream border border-ink rounded-brutal-card space-y-1">
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-primary-red tracking-wider">
                    <Target className="w-3 h-3" aria-hidden="true" />
                    Objectif pédagogique
                  </span>
                  <p className="font-serif text-xs md:text-sm text-ink/90 leading-relaxed">
                    {currentLesson.objective}
                  </p>
                </div>

                <div className="p-3.5 bg-pale-pink/50 border border-ink rounded-brutal-card space-y-1">
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-primary-red tracking-wider">
                    <FileCheck2 className="w-3 h-3" aria-hidden="true" />
                    Livrable attendu
                  </span>
                  <p className="font-serif text-xs md:text-sm text-ink/90 leading-relaxed">
                    {currentLesson.deliverable}
                  </p>
                </div>
              </div>
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
                  {/* Séparateur visuel éditorial élégant entre grandes parties */}
                  {pIdx > 0 && (
                    <div className="pt-6 pb-2 flex items-center gap-3" aria-hidden="true">
                      <div className="h-[2px] flex-1 bg-ink/15" />
                      <div className="w-2.5 h-2.5 rotate-45 border-2 border-ink/30 bg-pale-pink" />
                      <div className="h-[2px] flex-1 bg-ink/15" />
                    </div>
                  )}

                  {/* En-tête thématique propre à chaque partie */}
                  <div className="border-l-4 border-primary-red pl-4 py-1 space-y-1">
                    <h4 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-ink">
                      {part.title}
                    </h4>
                    {part.subtitle && (
                      <p className="font-serif text-sm text-ink/75">
                        {part.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Blocs pédagogiques de la partie */}
                  <LessonRenderer blocks={part.blocks} />

                  {/* Aide contextuelle de la partie si définie */}
                  {part.help && (
                    <HelpPanel
                      help={part.help}
                      stepTitle={part.title}
                      defaultOpen={false}
                    />
                  )}
                </section>
              );
            })}
          </div>

          {/* 5. Navigation linéaire précédente / suivante */}
          <footer className="brutal-card rounded-brutal-card p-5 md:p-6 bg-surface flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-ink shadow-brutal">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink/75 block">
                NAVIGATION DANS LE BONUS
              </span>
              <p className="font-display text-base uppercase text-ink mt-0.5">
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
