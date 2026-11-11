import React from 'react';
import type { ContentBlock, ProseBlock } from '../../types/course';
import { CalloutBox } from '../widgets/CalloutBox';
import { CopyBlock } from '../widgets/CopyBlock';
import { QuizWidget } from '../widgets/QuizWidget';
import { ResourceCard } from '../widgets/ResourceCard';
import { StepChecklist } from '../widgets/StepChecklist';
import { TextExercise } from '../widgets/TextExercise';
import { VideoBlock } from '../widgets/VideoBlock';
import { ImageBlock } from '../widgets/media/ImageBlock';
import { ScreenshotBlock } from '../widgets/media/ScreenshotBlock';
import { DiagramBlock } from '../widgets/media/DiagramBlock';

/**
 * Interprète les marqueurs d'emphase simples (**gras** et *italique*)
 * sans ajouter de dépendance externe Markdown.
 */
function renderFormattedInlineText(text: string): React.ReactNode {
  if (!text) return null;
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);

  return boldParts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldContent = part.slice(2, -2);
      return (
        <strong key={i} className="font-semibold text-ink">
          {boldContent}
        </strong>
      );
    }

    const italicParts = part.split(/(\*[^*]+\*)/g);
    if (italicParts.length > 1) {
      return italicParts.map((sub, j) => {
        if (sub.startsWith('*') && sub.endsWith('*')) {
          return (
            <em key={`${i}-${j}`} className="italic font-medium">
              {sub.slice(1, -1)}
            </em>
          );
        }
        return sub;
      });
    }

    return part;
  });
}

function ProseSection({ block }: { block: ProseBlock }) {
  const [openingParagraph, ...secondaryParagraphs] = block.paragraphs;

  return (
    <article className="brutal-card rounded-brutal-card overflow-hidden bg-surface border-2 border-ink shadow-brutal p-6 sm:p-7 md:p-8 space-y-5">
      {/* En-tête éditorial intégré directement sur fond blanc */}
      {(block.eyebrow || block.title) && (
        <div className="space-y-1.5 pb-4 border-b border-ink/15">
          {block.eyebrow && (
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink block">
              {block.eyebrow}
            </span>
          )}
          {block.title && (
            <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-ink">
              {block.title}{' '}
              {block.italicAccent && (
                <span className="font-serif italic font-normal lowercase text-2xl sm:text-3xl text-primary-red ml-1.5">
                  {block.italicAccent}
                </span>
              )}
            </h3>
          )}
        </div>
      )}

      {/* Phrase d'ouverture expressive en Instrument Serif */}
      {openingParagraph && (
        <p className="font-serif text-lg sm:text-xl text-ink leading-relaxed">
          {renderFormattedInlineText(openingParagraph)}
        </p>
      )}

      {/* HighlightPill immédiatement après la première phrase */}
      {block.highlightPill && (
        <div>
          <span className="inline-block bg-pale-pink border-2 border-ink rounded-brutal-card px-4 py-2 font-bold text-xs sm:text-sm text-ink shadow-brutal-xs">
            {block.highlightPill}
          </span>
        </div>
      )}

      {/* Paragraphes secondaires en typographie normale */}
      {secondaryParagraphs.length > 0 && (
        <div className="space-y-3 pt-1">
          {secondaryParagraphs.map((p, idx) => (
            <p
              key={idx}
              className="text-sm md:text-base text-ink leading-relaxed max-w-3xl"
            >
              {renderFormattedInlineText(p)}
            </p>
          ))}
        </div>
      )}

      {/* Listes à puces avec petits points ronds rouge brique */}
      {block.bullets && block.bullets.length > 0 && (
        <ul className="space-y-2 pt-2">
          {block.bullets.map((bullet, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-sm md:text-base font-medium text-ink"
            >
              <span
                className="mt-2 w-2 h-2 rounded-full bg-primary-red shrink-0"
                aria-hidden="true"
              />
              <span>{renderFormattedInlineText(bullet)}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function LessonRenderer({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        switch (block.type) {
          case 'prose':
            return <ProseSection key={block.id} block={block} />;
          case 'checklist':
            return <StepChecklist key={block.id} block={block} />;
          case 'callout':
            return <CalloutBox key={block.id} block={block} />;
          case 'quiz':
            return <QuizWidget key={block.id} block={block} />;
          case 'text-exercise':
            return <TextExercise key={block.id} block={block} />;
          case 'video':
            return <VideoBlock key={block.id} block={block} />;
          case 'image':
            return <ImageBlock key={block.id} block={block} />;
          case 'screenshot':
            return <ScreenshotBlock key={block.id} block={block} />;
          case 'diagram':
            return <DiagramBlock key={block.id} block={block} />;
          case 'resource':
            return <ResourceCard key={block.id} block={block} />;
          case 'copy':
            return <CopyBlock key={block.id} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
