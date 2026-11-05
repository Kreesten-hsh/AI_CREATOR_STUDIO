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

function ProseSection({ block }: { block: ProseBlock }) {
  return (
    <article className="brutal-card rounded-brutal-card overflow-hidden">
      {(block.eyebrow || block.title) && (
        <div className="px-5 py-4 bg-cream border-b-2 border-ink flex flex-wrap items-baseline justify-between gap-2">
          <div>
            {block.eyebrow && (
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink/75 block mb-1">
                {block.eyebrow}
              </span>
            )}
            {block.title && (
              <h3 className="font-display text-xl md:text-2xl uppercase tracking-tight text-ink">
                {block.title}{' '}
                {block.italicAccent && (
                  <span className="font-serif italic font-normal lowercase text-2xl md:text-3xl text-primary-red">
                    {block.italicAccent}
                  </span>
                )}
              </h3>
            )}
          </div>
        </div>
      )}

      <div className="p-5 md:p-7 space-y-4 bg-surface">
        {block.highlightPill && (
          <div className="inline-block px-4 py-2 bg-pale-pink border-2 border-ink rounded-brutal-tag font-bold text-sm md:text-base text-ink shadow-brutal-xs">
            {block.highlightPill}
          </div>
        )}

        {block.paragraphs.map((p, idx) => (
          <p
            key={idx}
            className="text-sm md:text-base text-ink/90 leading-relaxed max-w-3xl"
          >
            {p}
          </p>
        ))}

        {block.bullets && block.bullets.length > 0 && (
          <ul className="space-y-2 pt-2">
            {block.bullets.map((bullet, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm md:text-base font-medium text-ink"
              >
                <span
                  className="mt-1.5 w-2.5 h-2.5 bg-primary-red border border-ink rounded-[2px] shrink-0"
                  aria-hidden="true"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
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
