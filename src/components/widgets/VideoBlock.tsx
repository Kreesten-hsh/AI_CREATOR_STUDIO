import { Film, Clock, BookOpen, AlertCircle } from 'lucide-react';
import type { VideoBlockConfig } from '../../types/course';

export const DEFAULT_ALLOWED_VIDEO_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'player.vimeo.com',
  'loom.com',
  'www.loom.com',
];

export function isValidVideoUrl(
  urlStr: string | undefined,
  allowedHosts: readonly string[] = DEFAULT_ALLOWED_VIDEO_HOSTS
): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim();

  // Règle de sécurité : https uniquement (Adjustment 7)
  if (!trimmed.startsWith('https://')) return false;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return false;
    const hostname = parsed.hostname.toLowerCase();
    return allowedHosts.some((h) => hostname === h || hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export function VideoBlock({
  block,
  allowedHosts = DEFAULT_ALLOWED_VIDEO_HOSTS,
}: {
  block: VideoBlockConfig;
  allowedHosts?: readonly string[];
}) {
  const hasValidPlayer = isValidVideoUrl(block.videoUrl, allowedHosts);

  return (
    <section
      className="brutal-card rounded-brutal-card overflow-hidden bg-surface"
      aria-label={block.title}
    >
      {/* Barre d'en-tête du bloc vidéo */}
      <div className="px-5 py-3.5 bg-ink text-surface border-b-2 border-ink flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-dusty-pink shrink-0" aria-hidden="true" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider">
            {hasValidPlayer ? 'LEÇON VIDÉO' : 'MODULE VIDÉO • EN ATTENTE'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {block.duration && (
            <span className="inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 bg-primary-red text-surface font-bold rounded-brutal-tag">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {block.duration}
            </span>
          )}
        </div>
      </div>

      {/* Rendu conditionnel strict (URL valide ou état vidéo prévue sans faux lecteur) */}
      {hasValidPlayer ? (
        <div className="aspect-video w-full bg-ink border-b-2 border-ink">
          <iframe
            src={block.videoUrl}
            title={block.title || 'Lecteur vidéo pédagogique'}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        /* État "Vidéo prévue" explicite : ZÉRO faux bouton play, ZÉRO faux iframe */
        <div className="bg-pale-pink/40 p-6 sm:p-8 border-b-2 border-ink flex flex-col items-center justify-center text-center">
          <div className="max-w-md w-full space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase text-ink">
              <AlertCircle className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
              VIDÉO PRÉVUE • EN COURS DE PRODUCTION
            </span>
            <h4 className="font-display text-base sm:text-lg uppercase text-ink leading-tight">
              {block.posterLabel || block.title}
            </h4>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
              Ce module fera l’objet d’un tutoriel vidéo pas-à-pas dédié. En attendant sa mise en ligne,
              suivez la progression méthodique et les exercices guidés ci-dessous.
            </p>
          </div>
        </div>
      )}

      {/* Synthèse pédagogique & Points clés */}
      <div className="p-5 md:p-6 bg-surface space-y-3">
        <div>
          <h3 className="font-display text-lg md:text-xl uppercase tracking-tight text-ink">
            {block.title}
          </h3>
          {block.description && (
            <p className="text-sm text-ink/80 mt-1 leading-relaxed">
              {block.description}
            </p>
          )}
        </div>

        {block.keyTakeaways && block.keyTakeaways.length > 0 && (
          <div className="pt-3 border-t-2 border-ink/20">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-ink mb-2">
              <BookOpen className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
              <span>Points clés à retenir :</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-ink/90 list-disc list-inside">
              {block.keyTakeaways.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
