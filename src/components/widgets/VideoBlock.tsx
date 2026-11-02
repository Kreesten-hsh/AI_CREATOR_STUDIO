import { useState } from 'react';
import { Film, Play } from 'lucide-react';
import type { VideoBlockConfig } from '../../types/course';

export function VideoBlock({ block }: { block: VideoBlockConfig }) {
  const [showBriefingDetails, setShowBriefingDetails] = useState(false);

  return (
    <section className="brutal-card rounded-brutal-card overflow-hidden" aria-label={block.title}>
      <div className="px-5 py-3.5 bg-ink text-surface border-b-2 border-ink flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-dusty-pink shrink-0" aria-hidden="true" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider">
            LEÇON VIDÉO
          </span>
        </div>
        <span className="font-mono text-xs px-2 py-0.5 bg-primary-red text-surface font-bold rounded-brutal-tag">
          DURÉE : {block.duration}
        </span>
      </div>

      {block.videoUrl ? (
        <div className="aspect-video w-full bg-ink border-b-2 border-ink">
          <iframe
            src={block.videoUrl}
            title={block.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="bg-checkerboard-pink p-6 md:p-10 border-b-2 border-ink flex flex-col items-center justify-center text-center min-h-[220px]">
          <div className="brutal-card rounded-brutal-card p-5 md:p-6 max-w-lg w-full bg-surface">
            <span className="font-mono text-[11px] font-bold uppercase px-2 py-0.5 bg-pale-pink border border-ink rounded-brutal-tag text-ink">
              ESPACE VIDÉO DU MODULE
            </span>
            <p className="font-display text-base md:text-lg uppercase mt-2.5 text-ink">
              {block.posterLabel}
            </p>
            <p className="text-xs text-ink/75 mt-1 mb-4">
              {block.description}
            </p>
            <button
              type="button"
              onClick={() => setShowBriefingDetails((prev) => !prev)}
              aria-expanded={showBriefingDetails}
              className="brutal-btn bg-primary-red text-surface px-4 py-2 min-h-[42px] rounded-brutal-btn font-mono text-xs font-bold uppercase inline-flex items-center gap-2 hover:bg-dark-red"
            >
              <Play className="w-3.5 h-3.5 fill-surface" aria-hidden="true" />
              {showBriefingDetails ? 'Masquer les notes du briefing vidéo' : 'Lire les notes du briefing vidéo'}
            </button>
          </div>
        </div>
      )}

      <div className="p-5 md:p-6 bg-surface">
        <h3 className="font-display text-lg md:text-xl uppercase tracking-tight text-ink">{block.title}</h3>
        <p className="text-sm text-ink/80 mt-1">{block.description}</p>

        {(showBriefingDetails || (block.keyTakeaways && block.keyTakeaways.length > 0)) && (
          <div className="mt-4 pt-3 border-t-2 border-ink">
            <p className="font-mono text-xs font-bold uppercase mb-2 text-ink">
              Points clés à retenir :
            </p>
            <ul className="space-y-1.5 text-xs md:text-sm text-ink/90 list-disc list-inside">
              {(block.keyTakeaways ?? []).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
