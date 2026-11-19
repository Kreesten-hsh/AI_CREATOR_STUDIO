import React from 'react';
import { Audio } from '@remotion/media';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  AVATAR_POSES,
  AvatarPoseKey,
  BORDER_WIDTH,
  COLORS,
  FONTS,
  SAFE_ZONES,
  SHADOWS,
} from '../theme';

/* Damped no-overshoot spring so every element locks onto integer pixels cleanly */
export const SETTLED_SPRING_CONFIG = {
  damping: 28,
  stiffness: 300,
  mass: 0.7,
  overshootClamping: true,
} as const;

export const settledProgress = (frame: number, fps: number, enterFrame: number): number => {
  if (frame < enterFrame) return 0;
  if (frame - enterFrame >= 8) return 1;
  const s = spring({
    frame: frame - enterFrame,
    fps,
    config: SETTLED_SPRING_CONFIG,
  });
  return s >= 0.995 ? 1 : s;
};

const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));
const EXP10_NORM = 1 - Math.pow(2, -10);
const SNAP_WD = 10 * Math.sqrt(1 - 0.49);

export const expoOut = (x: number): number => {
  const c = clamp01(x);
  if (c <= 0) return 0;
  if (c >= 1) return 1;
  return (1 - Math.pow(2, -10 * c)) / EXP10_NORM;
};

export const inQuart = (x: number): number => Math.pow(clamp01(x), 4);

export const whipProgress = (
  frame: number,
  startFrame: number,
  durationFrames = 10
): number => {
  if (frame <= startFrame) return 0;
  if (durationFrames <= 0 || frame >= startFrame + durationFrames) return 1;
  const x = clamp01((frame - startFrame) / durationFrames);
  return x < 0.5
    ? Math.pow(2, 16 * x - 8) / 2
    : (2 - Math.pow(2, -16 * x + 8)) / 2;
};

export const snapProgress = (
  frame: number,
  startFrame: number,
  durationFrames = 12
): number => {
  if (frame <= startFrame) return 0;
  if (durationFrames <= 0 || frame >= startFrame + durationFrames) return 1;
  const x = clamp01((frame - startFrame) / durationFrames);
  return (
    1 -
    Math.exp(-7 * x) *
      (Math.cos(SNAP_WD * x) + (7 / SNAP_WD) * Math.sin(SNAP_WD * x))
  );
};

export const bellCurve = (x: number): number => Math.sin(Math.PI * clamp01(x));

export const punchScale = (
  frame: number,
  triggerFrame: number,
  amount = 0.07,
  durationFrames = 9
): number => {
  if (
    durationFrames <= 0 ||
    frame < triggerFrame ||
    frame >= triggerFrame + durationFrames
  ) {
    return 1;
  }
  return 1 + amount * (1 - expoOut((frame - triggerFrame) / durationFrames));
};

export type WhipDirection = 'left' | 'up' | 'right' | 'down';

const WHIP_VECTORS: Record<WhipDirection, readonly [number, number]> = {
  left: [-1, 0],
  right: [1, 0],
  up: [0, -1],
  down: [0, 1],
};

/* Directional whip-pan stage transition with SVG motion blur active only while moving */
export const WhipStageTransition: React.FC<{
  children: React.ReactNode;
  enterFrame?: number;
  exitFrame?: number;
  direction?: WhipDirection;
  durationFrames?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  enterFrame = 0,
  exitFrame,
  direction = 'left',
  durationFrames = 9,
  style,
}) => {
  const frame = useCurrentFrame();
  const rawId = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const filterId = `whip-blur-${rawId}`;
  const [vx, vy] = WHIP_VECTORS[direction];

  const isBeforeEnter = enterFrame > 0 && frame < enterFrame;
  const isAfterExit = exitFrame !== undefined && frame >= exitFrame + durationFrames;
  const hidden = isBeforeEnter || isAfterExit;

  let ki = 1;
  let blurIn = 0;
  if (enterFrame > 0) {
    if (frame < enterFrame) {
      ki = 0;
    } else if (durationFrames > 0 && frame < enterFrame + durationFrames) {
      ki = whipProgress(frame, enterFrame, durationFrames);
      blurIn = Math.round(bellCurve((frame - enterFrame) / durationFrames) * 28);
    }
  }

  let ko = 0;
  let blurOut = 0;
  if (exitFrame !== undefined) {
    if (frame >= exitFrame + durationFrames) {
      ko = 1;
    } else if (durationFrames > 0 && frame >= exitFrame) {
      const rawOut = clamp01((frame - exitFrame) / durationFrames);
      ko = inQuart(rawOut);
      blurOut = Math.round(bellCurve(rawOut) * 28);
    }
  }

  const tx = hidden ? 0 : Math.round((1 - ki) * -vx * 1080 + ko * vx * 1080);
  const ty = hidden ? 0 : Math.round((1 - ki) * -vy * 1920 + ko * vy * 1920);
  const blur = hidden ? 0 : Math.max(blurIn, blurOut);
  const bx = Math.abs(vx) * blur;
  const by = Math.abs(vy) * blur;
  const hasBlur = bx > 0 || by > 0;
  const isSettled = tx === 0 && ty === 0 && !hasBlur;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        visibility: hidden ? 'hidden' : 'visible',
        transform: isSettled ? 'none' : `translate3d(${tx}px, ${ty}px, 0)`,
        filter: hasBlur ? `url(#${filterId})` : 'none',
        ...style,
      }}
    >
      {hasBlur && (
        <svg
          width={0}
          height={0}
          aria-hidden="true"
          style={{ position: 'absolute', pointerEvents: 'none' }}
        >
          <defs>
            <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation={`${bx} ${by}`} />
            </filter>
          </defs>
        </svg>
      )}
      {children}
    </div>
  );
};

export interface KineticWordItem {
  text: string;
  enterFrame?: number;
  highlight?: boolean;
}

/* Word-by-word masked reveal on a single horizontal line in Studio Lin editorial typography */
export const KineticWordLine: React.FC<{
  before?: string;
  highlight?: string;
  after?: string;
  words?: KineticWordItem[];
  enterFrame?: number;
  staggerFrames?: number;
  revealFrames?: number;
  fontSize?: number;
}> = ({
  before = '',
  highlight = '',
  after = '',
  words,
  enterFrame = 0,
  staggerFrames = 2,
  revealFrames = 7,
  fontSize = 58,
}) => {
  const frame = useCurrentFrame();

  const resolvedWords: Array<{ text: string; enterFrame: number; highlight: boolean }> =
    React.useMemo(() => {
      if (words && words.length > 0) {
        return words.map((item, idx) => ({
          text: item.text,
          enterFrame: item.enterFrame ?? enterFrame + idx * staggerFrames,
          highlight: Boolean(item.highlight),
        }));
      }

      const rawSegments: Array<{ text: string; highlight: boolean }> = [];
      for (const token of before.trim().split(/\s+/).filter(Boolean)) {
        rawSegments.push({ text: token, highlight: false });
      }
      for (const token of highlight.trim().split(/\s+/).filter(Boolean)) {
        rawSegments.push({ text: token, highlight: true });
      }
      for (const token of after.trim().split(/\s+/).filter(Boolean)) {
        rawSegments.push({ text: token, highlight: false });
      }

      return rawSegments.map((seg, idx) => ({
        text: seg.text,
        enterFrame: enterFrame + idx * staggerFrames,
        highlight: seg.highlight,
      }));
    }, [words, before, highlight, after, enterFrame, staggerFrames]);

  return (
    <div
      style={{
        fontFamily: FONTS.sans,
        fontWeight: 800,
        fontSize,
        lineHeight: 1.15,
        letterSpacing: '-0.01em',
        color: COLORS.ink,
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {resolvedWords.map((item, idx) => {
        const wEnter = item.enterFrame;
        const progress =
          revealFrames <= 0
            ? frame >= wEnter
              ? 1
              : 0
            : frame <= wEnter
              ? 0
              : frame >= wEnter + revealFrames
                ? 1
                : expoOut((frame - wEnter) / revealFrames);
        const translateY = Number(((1 - progress) * 110).toFixed(2));

        let scale = 1;
        if (item.highlight) {
          const snap = snapProgress(frame, wEnter, 10);
          const punch = punchScale(frame, wEnter, 0.07, 9);
          scale =
            frame < wEnter
              ? 0.88
              : snap === 1 && punch === 1
                ? 1
                : Number(((0.88 + 0.12 * snap) * punch).toFixed(4));
        }

        const isSettled = translateY === 0 && scale === 1;
        const transform = isSettled
          ? 'none'
          : scale === 1
            ? `translateY(${translateY}%)`
            : `translateY(${translateY}%) scale(${scale})`;

        return (
          <React.Fragment key={`${idx}-${item.text}`}>
            {idx > 0 ? '\u00A0' : null}
            <span
              className="kinetic-word-mask"
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                verticalAlign: 'bottom',
                padding: '0.04em 0.04em 0.12em',
                margin: '-0.04em -0.04em -0.12em',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  color: item.highlight ? COLORS.burgundy : COLORS.ink,
                  transform,
                  visibility: frame >= wEnter || progress > 0 ? 'visible' : 'hidden',
                }}
              >
                {item.text}
              </span>
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* Law 1: Fixed Studio Lin & Spotlight backdrop from frame 0 to final frame */
export const EditorialCanvas: React.FC<{
  children: React.ReactNode;
  showSafeZones?: boolean;
}> = ({ children, showSafeZones = false }) => (
  <AbsoluteFill
    style={{
      backgroundColor: COLORS.sand,
      overflow: 'hidden',
      fontFamily: FONTS.sans,
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 20,
        backgroundColor: COLORS.burgundy,
        zIndex: 30,
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 20,
        backgroundColor: COLORS.burgundy,
        zIndex: 30,
      }}
    />

    {/* Law 3: Centered and symmetrical vertical + horizontal container */}
    <div
      style={{
        position: 'absolute',
        top: SAFE_ZONES.top,
        bottom: SAFE_ZONES.bottom,
        left: 0,
        right: 0,
        padding: '0 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>

    {showSafeZones && (
      <div
        style={{
          position: 'absolute',
          top: SAFE_ZONES.top,
          bottom: SAFE_ZONES.bottom,
          left: SAFE_ZONES.side,
          right: SAFE_ZONES.side,
          border: '2px dashed rgba(182, 49, 49, 0.45)',
          pointerEvents: 'none',
        }}
      />
    )}
  </AbsoluteFill>
);

export const BadgePill: React.FC<{
  label: string;
  bg?: string;
  color?: string;
  enterFrame?: number;
}> = ({ label, bg = COLORS.sand, color = COLORS.ink, enterFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enterFrame > 0 ? settledProgress(frame, fps, enterFrame) : 1;
  const scale = enterFrame > 0 && p < 1 ? interpolate(p, [0, 1], [0.92, 1]) : 1;
  const visible = enterFrame <= 0 || frame >= enterFrame;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        color,
        border: `3px solid ${COLORS.ink}`,
        boxShadow: SHADOWS.brutalSm,
        borderRadius: 999,
        padding: '10px 26px',
        fontFamily: FONTS.sans,
        fontWeight: 800,
        fontSize: 25,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        transform: scale === 1 ? 'none' : `scale(${scale})`,
        visibility: visible ? 'visible' : 'hidden',
      }}
    >
      {label}
    </div>
  );
};

export const AccentBanner: React.FC<{
  text: string;
  enterFrame?: number;
  bg?: string;
  color?: string;
}> = ({ text, enterFrame = 0, bg = COLORS.burgundy, color = COLORS.surface }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enterFrame > 0 ? settledProgress(frame, fps, enterFrame) : 1;
  const scale = enterFrame > 0 && frame >= enterFrame && p < 1 ? interpolate(p, [0, 1], [1.06, 1]) : 1;
  const visible = enterFrame <= 0 || frame >= enterFrame;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        color,
        border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
        boxShadow: SHADOWS.brutalSm,
        borderRadius: 12,
        padding: '12px 32px',
        fontFamily: FONTS.display,
        fontSize: 40,
        lineHeight: 1.05,
        textTransform: 'uppercase',
        letterSpacing: '-0.01em',
        transform: scale === 1 ? 'none' : `scale(${scale})`,
        visibility: visible ? 'visible' : 'hidden',
      }}
    >
      {text}
    </div>
  );
};

/* Primitive 1: RetroWindow (Centered Illustration Window with reserved banner space) */
export const RetroWindow: React.FC<{
  title: string;
  children: React.ReactNode;
  width?: number;
  padding?: string | number;
  enterFrame?: number;
  bannerText?: string;
  bannerEnterFrame?: number;
}> = ({
  title,
  children,
  width = 820,
  padding = '28px 30px',
  enterFrame = 0,
  bannerText,
  bannerEnterFrame = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enterFrame > 0 ? settledProgress(frame, fps, enterFrame) : 1;
  const scale = enterFrame > 0 && p < 1 ? interpolate(p, [0, 1], [0.95, 1]) : 1;
  const visible = enterFrame <= 0 || frame >= enterFrame;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width,
        transform: scale === 1 ? 'none' : `scale(${scale})`,
        visibility: visible ? 'visible' : 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          backgroundColor: COLORS.surface,
          border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
          borderRadius: 20,
          boxShadow: SHADOWS.brutal,
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            height: 56,
            backgroundColor: COLORS.sand,
            borderBottom: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
            padding: '0 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              width: 7,
              height: 24,
              backgroundColor: COLORS.burgundy,
              borderRadius: 4,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: FONTS.sans,
              fontSize: 24,
              fontWeight: 800,
              color: COLORS.ink,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              textAlign: 'left',
            }}
          >
            {title}
          </span>
        </div>
        <div style={{ padding, textAlign: 'left' }}>{children}</div>
      </div>

      {bannerText && (
        <div style={{ marginTop: 28 }}>
          <AccentBanner text={bannerText} enterFrame={bannerEnterFrame} />
        </div>
      )}
    </div>
  );
};

/* Primitive 2: SquareIconCard (260x260 Centered Vector Card with reserved banner space) */
export const SquareIconCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  bannerText?: string;
  enterFrame?: number;
}> = ({ icon, title, bannerText, enterFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enterFrame > 0 ? settledProgress(frame, fps, enterFrame) : 1;
  const scale = enterFrame > 0 && p < 1 ? interpolate(p, [0, 1], [0.92, 1]) : 1;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: scale === 1 ? 'none' : `scale(${scale})`,
      }}
    >
      <div
        style={{
          width: 260,
          height: 260,
          backgroundColor: COLORS.surface,
          border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
          borderRadius: 20,
          boxShadow: SHADOWS.brutal,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <div
        style={{
          marginTop: 28,
          fontFamily: FONTS.display,
          fontSize: 54,
          lineHeight: 1.05,
          color: COLORS.ink,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </div>
      {bannerText && (
        <div style={{ marginTop: 22 }}>
          <AccentBanner text={bannerText} enterFrame={enterFrame + 8} />
        </div>
      )}
    </div>
  );
};

export interface MathStackRow {
  label: string;
  operator?: string;
  value: string;
  accent?: boolean;
  enterFrame?: number;
}

/* Primitive 3: MathStackCards (3 Stacked Full-Width Equation Boxes) */
export const MathStackCards: React.FC<{
  rows: MathStackRow[];
  width?: number;
}> = ({ rows, width = 800 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        width,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      {rows.map((row, idx) => {
        const ef = row.enterFrame ?? idx * 14;
        const p = ef > 0 ? settledProgress(frame, fps, ef) : 1;
        const visible = ef <= 0 || frame >= ef;
        const translateY = ef > 0 && p < 1 ? Math.round(interpolate(p, [0, 1], [14, 0])) : 0;
        const isAccent = Boolean(row.accent);
        const bg = isAccent ? COLORS.burgundy : COLORS.surface;
        const fg = isAccent ? COLORS.surface : COLORS.ink;

        return (
          <div
            key={idx}
            style={{
              width: '100%',
              backgroundColor: bg,
              color: fg,
              border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
              borderRadius: 16,
              boxShadow: SHADOWS.brutal,
              padding: '24px 32px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              visibility: visible ? 'visible' : 'hidden',
              transform: translateY === 0 ? 'none' : `translateY(${translateY}px)`,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 25,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                textAlign: 'left',
                color: isAccent ? COLORS.sand : COLORS.muted,
              }}
            >
              {row.label}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: row.operator ? 'space-between' : 'flex-end',
                alignItems: 'baseline',
              }}
            >
              {row.operator && (
                <span
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 58,
                    lineHeight: 1,
                    color: fg,
                  }}
                >
                  {row.operator}
                </span>
              )}
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 64,
                  lineHeight: 1,
                  color: fg,
                }}
              >
                {row.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export interface HeadlineSegment {
  text: string;
  accent?: boolean;
}

/* Primitive 4: ImpactTitleScreen (Bold Centered Punchline Text, Zero Italics) */
export const ImpactTitleScreen: React.FC<{
  lines: HeadlineSegment[][];
  size?: number;
  enterFrame?: number;
}> = ({ lines, size = 72, enterFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enterFrame > 0 ? settledProgress(frame, fps, enterFrame) : 1;
  const scale = enterFrame > 0 && p < 1 ? interpolate(p, [0, 1], [0.94, 1]) : 1;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 6,
        transform: scale === 1 ? 'none' : `scale(${scale})`,
      }}
    >
      {lines.map((segments, li) => (
        <div
          key={li}
          style={{
            fontFamily: FONTS.display,
            fontSize: size,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: COLORS.ink,
          }}
        >
          {segments.map((seg, si) => (
            <span key={si} style={{ color: seg.accent ? COLORS.burgundy : COLORS.ink }}>
              {si > 0 ? ' ' : ''}
              {seg.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

/* Crisp double-outlined 3D avatar sticker (zero Math.sin float, locks onto pixel grid) */
export const AvatarSticker: React.FC<{
  pose: AvatarPoseKey;
  width?: number;
  enterFrame?: number;
  style?: React.CSSProperties;
}> = ({ pose, width = 560, enterFrame = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = settledProgress(frame, fps, enterFrame);
  const scale = p < 1 ? interpolate(p, [0, 1], [0.94, 1]) : 1;

  return (
    <Img
      src={staticFile(AVATAR_POSES[pose])}
      style={{
        width,
        height: 'auto',
        objectFit: 'contain',
        transform: scale === 1 ? 'none' : `scale(${scale})`,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

/* Law 5: AvatarScene used on 20-30% of shots — short 3-5 word headline above centered avatar */
export const AvatarScene: React.FC<{
  pose: AvatarPoseKey;
  lines: HeadlineSegment[][];
  avatarWidth?: number;
}> = ({ pose, lines, avatarWidth = 560 }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 28,
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {lines.map((segments, li) => (
        <div
          key={li}
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 800,
            fontSize: 48,
            lineHeight: 1.12,
            textTransform: 'uppercase',
            color: COLORS.ink,
          }}
        >
          {segments.map((seg, si) => (
            <span key={si} style={{ color: seg.accent ? COLORS.burgundy : COLORS.ink }}>
              {si > 0 ? ' ' : ''}
              {seg.text}
            </span>
          ))}
        </div>
      ))}
    </div>
    <AvatarSticker pose={pose} width={avatarWidth} />
  </div>
);

export type SfxName =
  | 'pop'
  | 'click'
  | 'stamp'
  | 'whoosh'
  | 'error_buzz'
  | 'chime_success'
  | 'key_tick'
  | 'check'
  | 'select'
  | 'whoosh_soft';

export const SfxCue: React.FC<{
  name: SfxName;
  atFrame: number;
  volume?: number;
}> = ({ name, atFrame, volume = 0.7 }) => (
  <Sequence from={Math.max(0, Math.round(atFrame))} durationInFrames={30}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

export const OfficialClaudeLogoSvg: React.FC<{ size?: number; color?: string }> = ({
  size = 64,
  color = '#D97757',
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76.1.129 1.167-.34.602-.881 1.142-1.264 1.451-1.367 1.7-.729.883.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"
      fill={color}
    />
  </svg>
);
