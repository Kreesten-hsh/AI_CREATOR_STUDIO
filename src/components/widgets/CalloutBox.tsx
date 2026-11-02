import { AlertTriangle, Flame, Info, Sparkles } from 'lucide-react';
import type { CalloutBlock, CalloutVariant } from '../../types/course';

const VARIANT_STYLES: Record<
  CalloutVariant,
  {
    badgeBg: string;
    badgeText: string;
    cardBg: string;
    label: string;
    Icon: typeof Info;
  }
> = {
  important: {
    badgeBg: 'bg-primary-red',
    badgeText: 'text-surface',
    cardBg: 'bg-pale-pink/45',
    label: 'NOTE IMPORTANTE',
    Icon: Flame,
  },
  warning: {
    badgeBg: 'bg-ink',
    badgeText: 'text-surface',
    cardBg: 'bg-cream',
    label: 'RÈGLE ESSENTIELLE',
    Icon: AlertTriangle,
  },
  tip: {
    badgeBg: 'bg-cream',
    badgeText: 'text-ink',
    cardBg: 'bg-surface',
    label: 'CONSEIL PRATIQUE',
    Icon: Info,
  },
  'pro-insight': {
    badgeBg: 'bg-primary-red',
    badgeText: 'text-surface',
    cardBg: 'bg-pale-blue/40',
    label: 'ASTUCE PRO',
    Icon: Sparkles,
  },
};

export function CalloutBox({ block }: { block: CalloutBlock }) {
  const style = VARIANT_STYLES[block.variant];
  const IconComponent = style.Icon;

  return (
    <aside
      aria-label={block.title}
      className={`${style.cardBg} border-2 border-ink rounded-brutal-card shadow-brutal p-5 md:p-6`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase tracking-wider ${style.badgeBg} ${style.badgeText}`}
        >
          <IconComponent className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
          {style.label}
        </span>
      </div>
      <h3 className="font-display text-lg md:text-xl text-ink uppercase tracking-tight mb-2">
        {block.title}
      </h3>
      <p className="text-sm md:text-base text-ink/90 leading-relaxed">{block.content}</p>
    </aside>
  );
}
