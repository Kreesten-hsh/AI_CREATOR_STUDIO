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
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 940,
        height: 940,
        transform: 'translate(-50%, -48%)',
        borderRadius: '50%',
        backgroundImage:
          'radial-gradient(circle, rgba(255, 253, 252, 0.96) 0%, rgba(255, 253, 252, 0.62) 46%, rgba(234, 227, 213, 0) 76%)',
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

export type SfxName = 'pop' | 'click' | 'stamp' | 'whoosh' | 'error_buzz' | 'chime_success';

export const SfxCue: React.FC<{
  name: SfxName;
  atFrame: number;
  volume?: number;
}> = ({ name, atFrame, volume = 0.7 }) => (
  <Sequence from={Math.max(0, Math.round(atFrame))} durationInFrames={30}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);
