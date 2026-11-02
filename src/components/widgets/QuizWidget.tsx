import { CheckCircle2, HelpCircle, RotateCcw, XCircle } from 'lucide-react';
import type { QuizBlock } from '../../types/course';
import { useProgress } from '../../hooks/useProgress';

export function QuizWidget({ block }: { block: QuizBlock }) {
  const { state, saveQuizAttempt } = useProgress();
  const savedAttempt = state.quizStates[block.id] ?? {
    answers: {},
    submitted: false,
    score: 0,
    total: block.questions.length,
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    const nextAnswers = {
      ...savedAttempt.answers,
      [questionId]: optionIdx,
    };

    let nextScore = 0;
    for (const q of block.questions) {
      if (nextAnswers[q.id] === q.correctIndex) {
        nextScore += 1;
      }
    }

    const allAnswered = block.questions.every((q) => nextAnswers[q.id] !== undefined);

    saveQuizAttempt(block.id, {
      answers: nextAnswers,
      submitted: allAnswered || savedAttempt.submitted,
      score: nextScore,
      total: block.questions.length,
    });
  };

  const handleRetry = () => {
    saveQuizAttempt(block.id, {
      answers: {},
      submitted: false,
      score: 0,
      total: block.questions.length,
    });
  };

  return (
    <section className="brutal-card rounded-brutal-card p-5 md:p-6 space-y-5" aria-label={block.title}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-ink">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cream border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase text-ink">
            <HelpCircle className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
            VALIDATION DES ACQUIS
          </span>
          <h3 className="font-display text-lg md:text-xl uppercase tracking-tight mt-2 text-ink">
            {block.title}
          </h3>
          {block.description && (
            <p className="text-sm text-ink/80 mt-0.5">{block.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-pale-pink border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase text-ink">
            SCORE : {savedAttempt.score}/{block.questions.length}
          </div>
          {Object.keys(savedAttempt.answers).length > 0 && (
            <button
              type="button"
              onClick={handleRetry}
              className="brutal-btn bg-surface px-3 py-1.5 min-h-[38px] rounded-brutal-btn font-mono text-xs font-bold uppercase inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Recommencer
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {block.questions.map((q, qIdx) => {
          const selectedIdx = savedAttempt.answers[q.id];
          const isAnswered = selectedIdx !== undefined;
          const isCorrect = selectedIdx === q.correctIndex;

          return (
            <div key={q.id} className="p-4 bg-cream border-2 border-ink rounded-brutal-card space-y-3">
              <p className="font-bold text-sm md:text-base text-ink">
                <span className="font-mono text-xs px-1.5 py-0.5 bg-ink text-surface rounded-brutal-tag mr-2">
                  Q{qIdx + 1}
                </span>
                {q.question}
              </p>

              <div className="space-y-2" role="radiogroup" aria-label={q.question}>
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = selectedIdx === optIdx;
                  const isThisCorrectOption = optIdx === q.correctIndex;

                  let buttonStyle = 'bg-surface hover:bg-pale-pink/50 text-ink';
                  if (isAnswered) {
                    if (isThisSelected && isCorrect) {
                      buttonStyle = 'bg-primary-red text-surface font-bold shadow-brutal-xs';
                    } else if (isThisSelected && !isCorrect) {
                      buttonStyle = 'bg-ink text-surface font-bold';
                    } else if (isThisCorrectOption) {
                      buttonStyle = 'bg-pale-pink border-ink font-semibold text-ink';
                    }
                  }

                  return (
                    <button
                      key={`${q.id}-opt-${optIdx}`}
                      type="button"
                      role="radio"
                      aria-checked={isThisSelected}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left px-3.5 py-3 border-2 border-ink rounded-brutal-btn text-xs md:text-sm transition-all flex items-center justify-between gap-3 min-h-[44px] ${buttonStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && isThisSelected && (
                        <span>
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-surface" aria-label="Correct" />
                          ) : (
                            <XCircle
                              className="w-4 h-4 shrink-0 text-dusty-pink"
                              aria-label="Incorrect"
                            />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div
                  role="status"
                  className="p-3 border-2 border-ink rounded-brutal-btn text-xs md:text-sm bg-surface text-ink"
                >
                  <strong className="font-mono uppercase mr-1.5">
                    {isCorrect ? 'CORRECT :' : 'PAS TOUT À FAIT :'}
                  </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
