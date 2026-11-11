import type { CalloutBlock, CalloutVariant } from '../../types/course';

const VARIANT_CONFIG: Record<
  CalloutVariant,
  {
    badgeClass: string;
    cardBg: string;
    accentClass: string;
    label: string;
  }
> = {
  important: {
    badgeClass: 'bg-primary-red text-surface',
    cardBg: 'bg-pale-pink/45',
    accentClass: 'border-l-4 border-l-primary-red',
    label: 'À retenir',
  },
  warning: {
    badgeClass: 'bg-ink text-surface',
    cardBg: 'bg-cream',
    accentClass: 'border-l-4 border-l-primary-red',
    label: 'Attention',
  },
  tip: {
    badgeClass: 'bg-surface text-ink border border-ink/40',
    cardBg: 'bg-surface',
    accentClass: 'border-l-4 border-l-dusty-pink',
    label: 'Conseil',
  },
  'pro-insight': {
    badgeClass: 'bg-pale-pink text-ink border border-ink/40',
    cardBg: 'bg-cream/90',
    accentClass: 'border-l-4 border-l-primary-red',
    label: 'Astuce',
  },
};

export function CalloutBox({ block }: { block: CalloutBlock }) {
  const config = VARIANT_CONFIG[block.variant] ?? VARIANT_CONFIG.important;

  return (
    <aside
      aria-label={`${config.label} : ${block.title}`}
      className={`${config.cardBg} border-2 border-ink ${config.accentClass} rounded-brutal-card shadow-brutal p-5 sm:p-6 space-y-2`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider ${config.badgeClass}`}
        >
          {config.label}
        </span>
      </div>
      <h3 className="font-display text-base sm:text-lg text-ink uppercase tracking-tight">
        {block.title}
      </h3>
      <p className="text-sm md:text-base text-ink leading-relaxed font-sans">
        {block.content}
      </p>
    </aside>
  );
}
