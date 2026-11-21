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
 * Interprète les marqueurs d'emphase simples (`code`, **gras** et *italique*)
 * sans ajouter de dépendance externe Markdown.
 */
export function renderFormattedInlineText(text: string): React.ReactNode {
  if (!text) return null;

  const tokenParts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return tokenParts.map((part, idx) => {
    if (!part) return null;

    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 mx-0.5 bg-cream border border-ink/35 rounded-brutal-tag font-mono text-[0.85em] font-semibold text-ink break-words"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-bold text-ink">
          {renderFormattedInlineText(part.slice(2, -2))}
        </strong>
      );
    }

    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} className="italic font-medium">
          {part.slice(1, -1)}
        </em>
      );
    }

    return part;
  });
}

function renderParagraphOrList(paragraph: string, keyPrefix: string): React.ReactNode {
  const lines = paragraph
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length > 1 && lines.every((l) => /^\d+\.\s+/.test(l))) {
    return (
      <ol key={keyPrefix} className="space-y-2 pt-1 max-w-3xl">
        {lines.map((line, i) => (
          <li
            key={`${keyPrefix}-ol-${i}`}
            className="flex items-start gap-2.5 text-sm md:text-base font-sans text-ink leading-relaxed"
          >
            <span className="mt-0.5 w-6 h-6 rounded-brutal-tag bg-pale-pink border border-ink font-mono text-[11px] font-bold text-ink flex items-center justify-center shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0 flex-1">
              {renderFormattedInlineText(line.replace(/^\d+\.\s+/, ''))}
            </span>
          </li>
        ))}
      </ol>
    );
  }

  if (lines.length > 1 && lines.every((l) => /^-\s+/.test(l))) {
    return (
      <ul key={keyPrefix} className="space-y-2 pt-1 max-w-3xl">
        {lines.map((line, i) => (
          <li
            key={`${keyPrefix}-ul-${i}`}
            className="flex items-start gap-2.5 text-sm md:text-base font-sans text-ink leading-relaxed"
          >
            <span
              className="mt-2 w-2 h-2 rounded-full bg-primary-red shrink-0"
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1">
              {renderFormattedInlineText(line.replace(/^-\s+/, ''))}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p
      key={keyPrefix}
      className="font-sans text-sm md:text-base text-ink leading-relaxed max-w-3xl"
    >
      {renderFormattedInlineText(paragraph)}
    </p>
  );
}

function ProseSection({ block }: { block: ProseBlock }) {
  const [openingParagraph, ...secondaryParagraphs] = block.paragraphs;
  const bullets = block.bullets ?? [];
  const isNumberedBullets =
    bullets.length > 0 && bullets.every((item) => /^\d+\.\s+/.test(item.trim()));

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

      {/* Phrase d'ouverture lisible en Plus Jakarta Sans */}
      {openingParagraph && (
        <p className="font-sans text-base sm:text-lg font-medium text-ink leading-relaxed max-w-3xl">
          {renderFormattedInlineText(openingParagraph)}
        </p>
      )}

      {/* HighlightPill immédiatement après la première phrase */}
      {block.highlightPill && (
        <div>
          <span className="inline-block bg-pale-pink border-2 border-ink rounded-brutal-card px-4 py-2 font-sans font-bold text-xs sm:text-sm text-ink shadow-brutal-xs">
            {renderFormattedInlineText(block.highlightPill)}
          </span>
        </div>
      )}

      {/* Paragraphes secondaires (avec support listes numérotées et puces) */}
      {secondaryParagraphs.length > 0 && (
        <div className="space-y-3 pt-1">
          {secondaryParagraphs.map((p, idx) =>
            renderParagraphOrList(p, `${block.id}-p-${idx}`)
          )}
        </div>
      )}

      {/* Listes numérotées ou à puces */}
      {bullets.length > 0 &&
        (isNumberedBullets ? (
          <ol className="space-y-2.5 pt-2">
            {bullets.map((bullet, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm md:text-base font-sans font-medium text-ink leading-relaxed"
              >
                <span className="mt-0.5 w-6 h-6 rounded-brutal-tag bg-pale-pink border border-ink font-mono text-[11px] font-bold text-ink flex items-center justify-center shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  {renderFormattedInlineText(bullet.trim().replace(/^\d+\.\s+/, ''))}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <ul className="space-y-2 pt-2">
            {bullets.map((bullet, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm md:text-base font-sans font-medium text-ink leading-relaxed"
              >
                <span
                  className="mt-2 w-2 h-2 rounded-full bg-primary-red shrink-0"
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  {renderFormattedInlineText(bullet.replace(/^-\s+/, ''))}
                </span>
              </li>
            ))}
          </ul>
        ))}
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
