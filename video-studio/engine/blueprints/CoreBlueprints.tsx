import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { AvatarPoseKey, BORDER_WIDTH, COLORS, FONTS, SHADOWS } from '../theme';
import {
  AccentBanner,
  AvatarScene,
  BadgePill,
  EditorialCanvas,
  HeadlineSegment,
  ImpactTitleScreen,
  MathStackCards,
  MathStackRow,
  RetroWindow,
  SETTLED_SPRING_CONFIG,
  SquareIconCard,
  settledProgress,
} from '../components/Primitives';

/* 1. bp_hook_question */
export const BpHookQuestion: React.FC<{
  badge: string;
  lines: HeadlineSegment[][];
  bannerText?: string;
  pose?: AvatarPoseKey;
}> = ({ badge, lines, bannerText, pose }) => (
  <EditorialCanvas>
    {pose ? (
      <AvatarScene pose={pose} lines={lines} />
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
        <BadgePill label={badge} />
        <ImpactTitleScreen lines={lines} size={68} />
        {bannerText && <AccentBanner text={bannerText} enterFrame={10} />}
      </div>
    )}
  </EditorialCanvas>
);

/* 2. bp_split_timeline */
export const BpSplitTimeline: React.FC<{
  windowTitle: string;
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
  bannerText?: string;
}> = ({ windowTitle, leftTitle, leftItems, rightTitle, rightItems, bannerText }) => (
  <EditorialCanvas>
    <RetroWindow title={windowTitle} bannerText={bannerText}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div
          style={{
            backgroundColor: COLORS.staleGray,
            border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
            borderRadius: 14,
            padding: 22,
          }}
        >
          <div style={{ fontFamily: FONTS.display, fontSize: 28, color: COLORS.ink, marginBottom: 14 }}>
            {leftTitle}
          </div>
          {leftItems.map((it, i) => (
            <div
              key={i}
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: COLORS.muted,
                marginBottom: 12,
                textDecoration: 'line-through',
              }}
            >
              ✕ {it}
            </div>
          ))}
        </div>

        <div
          style={{
            backgroundColor: COLORS.surface,
            border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
            borderRadius: 14,
            boxShadow: SHADOWS.brutalSm,
            padding: 22,
          }}
        >
          <div style={{ fontFamily: FONTS.display, fontSize: 28, color: COLORS.burgundy, marginBottom: 14 }}>
            {rightTitle}
          </div>
          {rightItems.map((it, i) => (
            <div
              key={i}
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: COLORS.ink,
                marginBottom: 12,
              }}
            >
              ✓ {it}
            </div>
          ))}
        </div>
      </div>
    </RetroWindow>
  </EditorialCanvas>
);

/* 3. bp_friction_stack */
export const BpFrictionStack: React.FC<{
  windowTitle: string;
  items: Array<{ tag: string; label: string; crossed?: boolean }>;
  bannerText?: string;
}> = ({ windowTitle, items, bannerText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <EditorialCanvas>
      <RetroWindow title={windowTitle} bannerText={bannerText}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map((item, idx) => {
            const ef = idx * 10 + 4;
            const p = settledProgress(frame, fps, ef);
            const visible = frame >= ef;

            return (
              <div
                key={idx}
                style={{
                  backgroundColor: item.crossed ? COLORS.staleGray : COLORS.surface,
                  border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
                  borderRadius: 14,
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 14,
                  visibility: visible ? 'visible' : 'hidden',
                  opacity: p,
                }}
              >
                <span
                  style={{
                    fontFamily: FONTS.sans,
                    fontWeight: 800,
                    fontSize: 28,
                    color: item.crossed ? COLORS.muted : COLORS.ink,
                    textDecoration: item.crossed ? 'line-through' : 'none',
                    textDecorationColor: COLORS.burgundy,
                    textDecorationThickness: '4px',
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontWeight: 700,
                    fontSize: 24,
                    backgroundColor: item.crossed ? COLORS.burgundy : COLORS.ink,
                    color: COLORS.surface,
                    padding: '6px 14px',
                    borderRadius: 8,
                  }}
                >
                  {item.tag}
                </span>
              </div>
            );
          })}
        </div>
      </RetroWindow>
    </EditorialCanvas>
  );
};

/* 4. bp_code_window */
export const BpCodeWindow: React.FC<{
  title: string;
  lines: string[];
  bannerText?: string;
}> = ({ title, lines, bannerText }) => {
  const frame = useCurrentFrame();
  const visibleLines = Math.min(lines.length, Math.floor(frame / 10) + 1);

  return (
    <EditorialCanvas>
      <RetroWindow title={title} bannerText={bannerText}>
        <div
          style={{
            backgroundColor: COLORS.ink,
            padding: '26px 24px',
            border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
            borderRadius: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {lines.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: FONTS.mono,
                fontSize: 26,
                fontWeight: 700,
                lineHeight: 1.35,
                color: line.startsWith('✓') || line.startsWith('→') ? COLORS.sand : COLORS.surface,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </RetroWindow>
    </EditorialCanvas>
  );
};

/* 5. bp_stat_shock */
export const BpStatShock: React.FC<{
  badge: string;
  fromValue: number;
  toValue: number;
  suffix: string;
  subtitle: string;
}> = ({ badge, fromValue, toValue, suffix, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: SETTLED_SPRING_CONFIG });
  const current = Math.round(interpolate(s, [0, 1], [fromValue, toValue]));

  return (
    <EditorialCanvas>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
        <BadgePill label={badge} />
        <div
          style={{
            backgroundColor: COLORS.surface,
            border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
            boxShadow: SHADOWS.brutal,
            borderRadius: 20,
            padding: '44px 56px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div style={{ fontFamily: FONTS.display, fontSize: 120, lineHeight: 0.95, color: COLORS.ink }}>
            {current.toLocaleString('fr-FR')}
            <span style={{ color: COLORS.burgundy, marginLeft: 12 }}>{suffix}</span>
          </div>
          <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 32, color: COLORS.ink, maxWidth: 680 }}>
            {subtitle}
          </div>
        </div>
      </div>
    </EditorialCanvas>
  );
};

/* 6. bp_versus_compare (Centered Equation or Before/After Window — Zero Violet) */
export const BpVersusCompare: React.FC<{
  windowTitle: string;
  rows: MathStackRow[];
}> = ({ windowTitle, rows }) => (
  <EditorialCanvas>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <BadgePill label={windowTitle} />
      <MathStackCards rows={rows} />
    </div>
  </EditorialCanvas>
);

/* 7. bp_grid_2x2 */
export const BpGrid2x2: React.FC<{
  windowTitle: string;
  cards: Array<{ num: string; title: string; detail: string }>;
  bannerText?: string;
}> = ({ windowTitle, cards, bannerText }) => {
  const frame = useCurrentFrame();
  return (
    <EditorialCanvas>
      <RetroWindow title={windowTitle} bannerText={bannerText}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {cards.slice(0, 4).map((c, idx) => {
            const active = frame >= idx * 14;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: active ? COLORS.surface : COLORS.staleGray,
                  border: `${BORDER_WIDTH}px solid ${active ? COLORS.ink : COLORS.muted}`,
                  boxShadow: active ? SHADOWS.brutalSm : 'none',
                  borderRadius: 14,
                  padding: '22px 20px',
                  opacity: active ? 1 : 0.45,
                }}
              >
                <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 24, color: COLORS.burgundy }}>
                  {c.num}
                </div>
                <div style={{ fontFamily: FONTS.display, fontSize: 26, color: COLORS.ink, margin: '8px 0' }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>{c.detail}</div>
              </div>
            );
          })}
        </div>
      </RetroWindow>
    </EditorialCanvas>
  );
};

/* 8. bp_logo_carousel_rtl */
export const BpLogoCarousel: React.FC<{
  badge: string;
  steps: string[];
}> = ({ badge, steps }) => {
  const frame = useCurrentFrame();
  const shift = -(frame * 4) % 420;
  const doubled = [...steps, ...steps];

  return (
    <EditorialCanvas>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, width: '100%' }}>
        <BadgePill label={badge} />
        <div style={{ overflow: 'hidden', width: 880, padding: '12px 0' }}>
          <div style={{ display: 'flex', gap: 20, transform: `translateX(${shift}px)` }}>
            {doubled.map((step, i) => (
              <div
                key={i}
                style={{
                  minWidth: 260,
                  backgroundColor: COLORS.surface,
                  border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
                  boxShadow: SHADOWS.brutalSm,
                  borderRadius: 14,
                  padding: '22px 24px',
                  fontFamily: FONTS.display,
                  fontSize: 30,
                  color: COLORS.ink,
                  textAlign: 'center',
                }}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    </EditorialCanvas>
  );
};

/* 9. bp_dual_canvas_motion */
export const BpDualCanvasMotion: React.FC<{
  windowTitle: string;
  rawLabel: string;
  rawBody: string;
  studioLabel: string;
  studioBody: string;
}> = ({ windowTitle, rawLabel, rawBody, studioLabel, studioBody }) => (
  <EditorialCanvas>
    <RetroWindow title={windowTitle}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div
          style={{
            backgroundColor: COLORS.staleGray,
            border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
            borderRadius: 14,
            padding: 24,
          }}
        >
          <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 24, color: COLORS.muted }}>
            {rawLabel}
          </div>
          <div style={{ marginTop: 14, fontSize: 24, fontWeight: 700, color: COLORS.ink }}>{rawBody}</div>
        </div>
        <div
          style={{
            backgroundColor: COLORS.surface,
            border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
            boxShadow: SHADOWS.brutalSm,
            borderRadius: 14,
            padding: 24,
          }}
        >
          <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 24, color: COLORS.burgundy }}>
            {studioLabel}
          </div>
          <div style={{ marginTop: 14, fontSize: 24, fontWeight: 800, color: COLORS.ink }}>{studioBody}</div>
        </div>
      </div>
    </RetroWindow>
  </EditorialCanvas>
);

/* 10. bp_kinetic_strobe (Zero background color flip; stays on Studio Lin & Spotlight) */
export const BpKineticStrobe: React.FC<{
  beats: Array<{ lines: HeadlineSegment[][] }>;
  framesPerBeat?: number;
}> = ({ beats, framesPerBeat = 22 }) => {
  const frame = useCurrentFrame();
  const idx = Math.min(beats.length - 1, Math.floor(frame / framesPerBeat));
  return (
    <EditorialCanvas>
      <ImpactTitleScreen lines={beats[idx].lines} size={76} />
    </EditorialCanvas>
  );
};

/* 11. bp_cta_conversion (Centered ManyChat Comment / Icon Conversion) */
export const BpCtaConversion: React.FC<{
  icon: React.ReactNode;
  title: string;
  bannerText: string;
}> = ({ icon, title, bannerText }) => (
  <EditorialCanvas>
    <SquareIconCard icon={icon} title={title} bannerText={bannerText} />
  </EditorialCanvas>
);
