import React from 'react';
import { Audio } from '@remotion/media';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS, SHADOWS } from '../../engine/theme';
import {
  EditorialCanvas,
  OfficialClaudeLogoSvg,
  SfxCue,
  settledProgress,
} from '../../engine/components/Primitives';

export const EP02_DURATION_FRAMES = 810;

export const EP02_TIMING = {
  hasVoiceover: true,
  act1: { from: 0, end: 125, typeStart: 24, typeEnd: 76, clickFrame: 84 },
  act2: { from: 125, end: 245, p2Frame: 142, errFrame: 158, p4Frame: 176, dimFrame: 204 },
  act3: {
    from: 245,
    end: 376,
    mod1: 248,
    mod2: 260,
    mod3: 272,
    btnClick: 286,
    scanStart: 300,
    scanBarStart: 312,
    scanBarEnd: 340,
  },
  act4: {
    from: 376,
    end: 605,
    ripple1: 412,
    ripple2: 428,
    ripple3: 454,
    compareStart: 500,
    pdfSinkFrame: 558,
  },
  act5: {
    from: 605,
    end: 810,
    toggle1: 638,
    toggle2: 666,
    dmStart: 702,
    typeStart: 703,
    typeEnd: 719,
    sendClick: 723,
    liftStart: 724,
    dmOpen: 734,
  },
} as const;

const ACT1_KEY_FRAMES = [24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76] as const;
const ACT5_KEY_FRAMES = [704, 707, 710, 713, 716, 719] as const;

const Ep02Subtitle: React.FC<{
  before?: string;
  highlight?: string;
  after?: string;
  fontSize?: number;
}> = ({ before = '', highlight = '', after = '', fontSize = 54 }) => {
  const b = before.trim();
  const h = highlight.trim();
  const a = after.trim();

  return (
    <div
      style={{
        fontFamily: FONTS.sans,
        fontWeight: 800,
        fontSize,
        lineHeight: 1.15,
        letterSpacing: '-0.015em',
        color: COLORS.ink,
        textAlign: 'center',
      }}
    >
      {b ? <span>{`${b}\u00A0`}</span> : null}
      {h ? <span style={{ color: COLORS.burgundy }}>{h}</span> : null}
      {a ? <span>{`\u00A0${a}`}</span> : null}
    </div>
  );
};

const Ep02PointerSvg: React.FC<{ size?: number }> = ({ size = 68 }) => (
  <svg width={size} height={Math.round(size * 1.1)} viewBox="0 0 40 44" fill="none">
    <path
      d="M5 4 L5 35 L14 26 L21 40 L27 37 L20 23 L32 23 Z"
      fill={COLORS.ink}
      stroke={COLORS.surface}
      strokeWidth="3"
      strokeLinejoin="round"
    />
  </svg>
);

const RipplePulse: React.FC<{
  frame: number;
  triggerFrame: number;
  x: number;
  y: number;
}> = ({ frame, triggerFrame, x, y }) => {
  if (frame < triggerFrame || frame > triggerFrame + 24) {
    return null;
  }
  const progress = interpolate(frame, [triggerFrame, triggerFrame + 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const radius = interpolate(progress, [0, 1], [16, 118]);
  const opacity = interpolate(progress, [0, 0.25, 1], [0.95, 0.75, 0]);
  const innerRadius = interpolate(progress, [0, 1], [8, 66]);

  return (
    <svg
      width={260}
      height={260}
      viewBox="-130 -130 260 260"
      style={{
        position: 'absolute',
        left: x - 130,
        top: y - 130,
        pointerEvents: 'none',
        zIndex: 12,
      }}
    >
      <circle
        cx="0"
        cy="0"
        r={radius}
        fill="none"
        stroke={COLORS.burgundy}
        strokeWidth="6"
        opacity={opacity}
      />
      <circle
        cx="0"
        cy="0"
        r={innerRadius}
        fill={COLORS.burgundy}
        opacity={opacity * 0.35}
      />
    </svg>
  );
};

const StageLayer: React.FC<{
  children: React.ReactNode;
  zIndex?: number;
}> = ({ children, zIndex = 10 }) => (
  <AbsoluteFill
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex,
      pointerEvents: 'none',
    }}
  >
    {children}
  </AbsoluteFill>
);

/* ACTE 1 (0..124) & ACTE 2 (125..244) : Interface Claude -> Cascade 4 Vraies Pages PDF epuree */
const Act1And2ClaudeToPdf: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { typeStart, typeEnd, clickFrame } = EP02_TIMING.act1;
  const { from: act2From, end: act2End, p2Frame, errFrame, p4Frame, dimFrame } = EP02_TIMING.act2;

  if (frame >= act2End) {
    return null;
  }

  const isAct2 = frame >= act2From;
  const promptText = 'Crée-moi un produit digital';
  const typedChars = Math.floor(
    interpolate(frame, [typeStart, typeEnd], [0, promptText.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const typedSlice = promptText.slice(0, typedChars);
  const caretVisible = frame < clickFrame && Math.floor(frame / 7) % 2 === 0;

  const cursorMove = interpolate(frame, [typeEnd - 4, clickFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorX = interpolate(cursorMove, [0, 1], [130, 0]);
  const cursorY = interpolate(cursorMove, [0, 1], [105, 0]);
  const isClicking = frame >= clickFrame && frame < clickFrame + 6;
  const clickScale = isClicking ? 0.88 : 1;
  const showCursor = frame >= typeEnd - 4 && frame < clickFrame + 14;

  const sentP = frame >= clickFrame + 1 ? settledProgress(frame, fps, clickFrame + 1) : 0;
  const bubbleY = sentP > 0 ? interpolate(sentP, [0, 1], [120, 0]) : 120;
  const showGenerating = frame >= clickFrame + 1;
  const dotPhase = Math.floor(frame / 6) % 3;

  const act2EnterP = isAct2 ? settledProgress(frame, fps, act2From) : 1;
  const act2EnterScale = isAct2 && act2EnterP < 1 ? interpolate(act2EnterP, [0, 1], [0.94, 1]) : 1;
  const act2EnterY = isAct2 && act2EnterP < 1 ? interpolate(act2EnterP, [0, 1], [36, 0]) : 0;

  const p1 = frame >= act2From ? settledProgress(frame, fps, act2From) : 0;
  const p2 = frame >= p2Frame ? settledProgress(frame, fps, p2Frame) : 0;
  const p3 = frame >= errFrame ? settledProgress(frame, fps, errFrame) : 0;
  const p4 = frame >= p4Frame ? settledProgress(frame, fps, p4Frame) : 0;

  const isDimmed = frame >= dimFrame;
  const dimP = isDimmed ? settledProgress(frame, fps, dimFrame) : 0;
  const stackSagY = isDimmed ? interpolate(dimP, [0, 1], [0, 16]) : 0;
  const xDrawP = interpolate(frame, [dimFrame, dimFrame + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  let topSubtitle: React.ReactNode;
  if (frame < 34) {
    topSubtitle = <Ep02Subtitle before="Voici ce qui" highlight="se passe" fontSize={56} />;
  } else if (frame < 63) {
    topSubtitle = <Ep02Subtitle before="quand tu demandes" highlight="à Claude" fontSize={54} />;
  } else if (frame < act2From) {
    topSubtitle = <Ep02Subtitle before="de te générer" highlight="un produit digital" fontSize={52} />;
  } else if (frame < 154) {
    topSubtitle = <Ep02Subtitle before="Il te donne" highlight="un document" fontSize={54} />;
  } else if (frame < 176) {
    topSubtitle = <Ep02Subtitle before="générique et" highlight="ennuyeux" fontSize={54} />;
  } else if (frame < 204) {
    topSubtitle = <Ep02Subtitle before="que" highlight="personne" after="ne prend" fontSize={52} />;
  } else {
    topSubtitle = <Ep02Subtitle before="le temps" highlight="de lire." fontSize={56} />;
  }

  return (
    <StageLayer zIndex={10}>
      <div
        style={{
          position: 'relative',
          width: 920,
          height: 1260,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform:
            act2EnterScale === 1 && act2EnterY === 0
              ? 'none'
              : `translateY(${act2EnterY}px) scale(${act2EnterScale})`,
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 25,
            width: 920,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 28,
          }}
        >
          {topSubtitle}
        </div>

        <div
          style={{
            position: 'relative',
            width: 920,
            height: 1120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!isAct2 && (
            <div
              style={{
                position: 'absolute',
                width: 920,
                backgroundColor: COLORS.surface,
                border: '4px solid #171313',
                boxShadow: '8px 8px 0px #171313',
                borderRadius: 22,
                overflow: 'hidden',
                boxSizing: 'border-box',
                zIndex: 4,
              }}
            >
              <div
                style={{
                  height: 92,
                  backgroundColor: COLORS.sand,
                  borderBottom: '4px solid #171313',
                  padding: '0 32px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                }}
              >
                <OfficialClaudeLogoSvg size={48} color="#D97757" />
                <span
                  style={{
                    fontFamily: FONTS.sans,
                    fontWeight: 800,
                    fontSize: 30,
                    color: COLORS.ink,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Claude • Nouvelle discussion
                </span>
              </div>

              <div
                style={{
                  minHeight: 460,
                  padding: '38px 34px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: sentP > 0 ? 'flex-start' : 'center',
                  gap: 32,
                  boxSizing: 'border-box',
                }}
              >
                {sentP === 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 20,
                    }}
                  >
                    <OfficialClaudeLogoSvg size={84} color="#D97757" />
                    <div
                      style={{
                        fontFamily: FONTS.sans,
                        fontWeight: 800,
                        fontSize: 34,
                        color: COLORS.muted,
                        textAlign: 'center',
                      }}
                    >
                      Que veux-tu créer aujourd&apos;hui ?
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        alignSelf: 'flex-end',
                        backgroundColor: COLORS.sand,
                        border: '3.5px solid #171313',
                        boxShadow: SHADOWS.brutalSm,
                        borderRadius: 18,
                        padding: '20px 28px',
                        fontFamily: FONTS.sans,
                        fontWeight: 800,
                        fontSize: 34,
                        color: COLORS.ink,
                        transform: bubbleY === 0 ? 'none' : `translateY(${bubbleY}px)`,
                      }}
                    >
                      {promptText}
                    </div>

                    {showGenerating && (
                      <div
                        style={{
                          alignSelf: 'flex-start',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 20,
                          backgroundColor: COLORS.cream,
                          border: '3.5px solid #171313',
                          borderRadius: 18,
                          padding: '22px 28px',
                        }}
                      >
                        <OfficialClaudeLogoSvg size={44} color="#D97757" />
                        <span
                          style={{
                            fontFamily: FONTS.sans,
                            fontWeight: 800,
                            fontSize: 30,
                            color: COLORS.burgundy,
                          }}
                        >
                          {`Génération du document${'.'.repeat(dotPhase + 1)}`}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div
                style={{
                  borderTop: '4px solid #171313',
                  backgroundColor: COLORS.cream,
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    minHeight: 74,
                    backgroundColor: COLORS.surface,
                    border: '3.5px solid #171313',
                    borderRadius: 14,
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: FONTS.sans,
                    fontWeight: 800,
                    fontSize: 34,
                    color: COLORS.ink,
                    textAlign: 'left',
                  }}
                >
                  <span>{frame <= clickFrame ? typedSlice : ''}</span>
                  {caretVisible && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: 5,
                        height: 38,
                        backgroundColor: COLORS.burgundy,
                        marginLeft: 4,
                      }}
                    />
                  )}
                </div>

                <div
                  style={{
                    backgroundColor: COLORS.burgundy,
                    color: COLORS.surface,
                    border: '3.5px solid #171313',
                    boxShadow: isClicking ? 'none' : SHADOWS.brutalSm,
                    borderRadius: 14,
                    padding: '18px 28px',
                    fontFamily: FONTS.sans,
                    fontWeight: 800,
                    fontSize: 28,
                    textTransform: 'uppercase',
                    transform: isClicking ? 'translate(4px, 4px)' : 'none',
                    flexShrink: 0,
                  }}
                >
                  ENVOYER
                </div>

                {showCursor && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 78,
                      bottom: -18,
                      transform: `translate(${cursorX}px, ${cursorY}px) scale(${clickScale})`,
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  >
                    <Ep02PointerSvg size={68} />
                  </div>
                )}
              </div>
            </div>
          )}

          {isAct2 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                borderRadius: 20,
                zIndex: 6,
                transform: stackSagY === 0 ? 'none' : `translateY(${stackSagY}px)`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 44,
                  width: 480,
                  height: 600,
                  backgroundColor: COLORS.staleGray,
                  border: '4px solid #171313',
                  boxShadow: '8px 8px 0px #171313',
                  borderRadius: 16,
                  overflow: 'hidden',
                  opacity: Math.max(0.85, p1),
                  transform: `translateY(${interpolate(p1, [0, 1], [-120, 0])}px) rotate(-3deg)`,
                  zIndex: 2,
                }}
              >
                <Img
                  src={staticFile('ep01/pdf2-page1-portrait.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: isDimmed ? 'grayscale(70%) brightness(0.84)' : 'grayscale(45%)',
                  }}
                />
              </div>

              {frame >= p2Frame && (
                <div
                  style={{
                    position: 'absolute',
                    top: 135,
                    right: 40,
                    width: 480,
                    height: 600,
                    backgroundColor: COLORS.staleGray,
                    border: '4px solid #171313',
                    boxShadow: '8px 8px 0px #171313',
                    borderRadius: 16,
                    overflow: 'hidden',
                    opacity: p2,
                    transform: `translateY(${interpolate(p2, [0, 1], [-200, 0])}px) rotate(2.5deg)`,
                    zIndex: 3,
                  }}
                >
                  <Img
                    src={staticFile('ep01/pdf1-page1-portrait.png')}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: isDimmed ? 'grayscale(70%) brightness(0.84)' : 'grayscale(45%)',
                    }}
                  />
                </div>
              )}

              {frame >= errFrame && (
                <div
                  style={{
                    position: 'absolute',
                    top: 340,
                    left: 30,
                    width: 495,
                    height: 620,
                    backgroundColor: COLORS.staleGray,
                    border: '4px solid #171313',
                    boxShadow: '8px 8px 0px #171313',
                    borderRadius: 16,
                    overflow: 'hidden',
                    opacity: p3,
                    transform: `translateY(${interpolate(p3, [0, 1], [-220, 0])}px) rotate(-2deg)`,
                    zIndex: 4,
                  }}
                >
                  <Img
                    src={staticFile('ep01/pdf2-page2-portrait.png')}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: isDimmed
                        ? 'grayscale(70%) brightness(0.84)'
                        : 'grayscale(50%) contrast(0.95)',
                    }}
                  />
                </div>
              )}

              {frame >= p4Frame && (
                <div
                  style={{
                    position: 'absolute',
                    top: 490,
                    right: 30,
                    width: 500,
                    height: 625,
                    backgroundColor: COLORS.staleGray,
                    border: '4px solid #171313',
                    boxShadow: '8px 8px 0px #171313',
                    borderRadius: 16,
                    overflow: 'hidden',
                    opacity: p4,
                    transform: `translateY(${interpolate(p4, [0, 1], [-220, 0])}px) rotate(1.8deg)`,
                    zIndex: 5,
                  }}
                >
                  <Img
                    src={staticFile('ep01/pdf1-page2-portrait.png')}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: isDimmed
                        ? 'grayscale(70%) brightness(0.84)'
                        : 'grayscale(50%) contrast(0.95)',
                    }}
                  />
                </div>
              )}

              {isDimmed && (
                <svg
                  width="560"
                  height="560"
                  viewBox="0 0 560 560"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20,
                    pointerEvents: 'none',
                  }}
                >
                  <line
                    x1="60"
                    y1="60"
                    x2="500"
                    y2="500"
                    stroke={COLORS.burgundy}
                    strokeWidth="26"
                    strokeLinecap="round"
                    strokeDasharray="625"
                    strokeDashoffset={625 * (1 - Math.min(1, xDrawP * 1.8))}
                  />
                  <line
                    x1="500"
                    y1="60"
                    x2="60"
                    y2="500"
                    stroke={COLORS.burgundy}
                    strokeWidth="26"
                    strokeLinecap="round"
                    strokeDasharray="625"
                    strokeDashoffset={625 * (1 - Math.max(0, (xDrawP - 0.35) / 0.65))}
                  />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </StageLayer>
  );
};

/* ACTE 3 (245..375) : Instructions Claude (245..299) -> Scanner Laser Pur Avant/Apres (300..375) */
const Act3BlueprintAndScanTransform: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { from, end, mod1, mod2, mod3, btnClick, scanStart, scanBarStart, scanBarEnd } =
    EP02_TIMING.act3;

  if (frame < from || frame >= end) {
    return null;
  }

  const isPhase3B = frame >= scanStart;

  if (!isPhase3B) {
    const enterP = settledProgress(frame, fps, from);
    const enterY = enterP < 1 ? interpolate(enterP, [0, 1], [36, 0]) : 0;
    const enterScale = enterP < 1 ? interpolate(enterP, [0, 1], [0.94, 1]) : 1;

    const m1P = frame >= mod1 ? settledProgress(frame, fps, mod1) : 0;
    const m2P = frame >= mod2 ? settledProgress(frame, fps, mod2) : 0;
    const m3P = frame >= mod3 ? settledProgress(frame, fps, mod3) : 0;

    const btnActiveState = frame >= btnClick - 4;
    const isClicking = frame >= btnClick && frame < btnClick + 6;
    const cursorMove = interpolate(frame, [btnClick - 8, btnClick], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const cursorX = interpolate(cursorMove, [0, 1], [160, 0]);
    const cursorY = interpolate(cursorMove, [0, 1], [110, 0]);
    const showCursor = frame >= btnClick - 8;

    const railProgress = interpolate(frame, [mod1, mod3 + 8], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const railLen = 460;
    const railOffset = railLen * (1 - railProgress);

    const modules = [
      { label: '01 • STRUCTURE INTERACTIVE', p: m1P, visible: frame >= mod1 },
      { label: '02 • DESIGN SUR-MESURE', p: m2P, visible: frame >= mod2 },
      { label: '03 • PARCOURS PAR ONGLETS', p: m3P, visible: frame >= mod3 },
    ];

    const sub3A =
      frame < 268 ? (
        <Ep02Subtitle before="Alors qu'avec" highlight="les bonnes" fontSize={54} />
      ) : (
        <Ep02Subtitle before="bonnes" highlight="instructions" fontSize={56} />
      );

    return (
      <StageLayer zIndex={12}>
        <div
          style={{
            width: 920,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 34,
            transform:
              enterScale === 1 && enterY === 0
                ? 'none'
                : `translateY(${enterY}px) scale(${enterScale})`,
          }}
        >
          {sub3A}

          <div
            style={{
              position: 'relative',
              width: 920,
              backgroundColor: COLORS.surface,
              border: '4px solid #171313',
              boxShadow: '8px 8px 0px #171313',
              borderRadius: 22,
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                height: 88,
                backgroundColor: COLORS.sand,
                borderBottom: '4px solid #171313',
                padding: '0 32px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <OfficialClaudeLogoSvg size={46} color="#B63131" />
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 700,
                  fontSize: 28,
                  color: COLORS.ink,
                }}
              >
                INSTRUCTIONS CLAUDE
              </span>
            </div>

            <div
              style={{
                position: 'relative',
                padding: '40px 36px 36px 96px',
                display: 'flex',
                flexDirection: 'column',
                gap: 28,
              }}
            >
              <svg
                width="64"
                height="480"
                viewBox="0 0 64 480"
                style={{
                  position: 'absolute',
                  left: 34,
                  top: 38,
                  pointerEvents: 'none',
                }}
              >
                <line
                  x1="28"
                  y1="32"
                  x2="28"
                  y2="430"
                  stroke={COLORS.burgundy}
                  strokeWidth="5"
                  strokeDasharray={railLen}
                  strokeDashoffset={railOffset}
                  strokeLinecap="round"
                />
                {modules.map((m, idx) => (
                  <g key={idx} opacity={m.visible ? 1 : 0.25}>
                    <line
                      x1="28"
                      y1={46 + idx * 142}
                      x2="58"
                      y2={46 + idx * 142}
                      stroke={COLORS.ink}
                      strokeWidth="4"
                    />
                    <circle
                      cx="28"
                      cy={46 + idx * 142}
                      r="12"
                      fill={m.visible ? COLORS.burgundy : COLORS.sand}
                      stroke={COLORS.ink}
                      strokeWidth="4"
                    />
                  </g>
                ))}
              </svg>

              {modules.map((mod, idx) => {
                const shiftX = mod.visible ? interpolate(mod.p, [0, 1], [65, 0]) : 65;
                return (
                  <div
                    key={idx}
                    style={{
                      height: 114,
                      backgroundColor: mod.visible ? COLORS.cream : COLORS.sand,
                      border: '4px solid #171313',
                      boxShadow: mod.visible ? SHADOWS.brutalSm : 'none',
                      borderRadius: 16,
                      padding: '0 28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      visibility: mod.visible ? 'visible' : 'hidden',
                      transform: shiftX === 0 ? 'none' : `translateX(${shiftX}px)`,
                      boxSizing: 'border-box',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONTS.sans,
                        fontWeight: 800,
                        fontSize: 32,
                        color: COLORS.ink,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {mod.label}
                    </span>
                    <span
                      style={{
                        fontFamily: FONTS.display,
                        fontSize: 32,
                        color: COLORS.burgundy,
                      }}
                    >
                      ✓
                    </span>
                  </div>
                );
              })}

              <div style={{ position: 'relative', marginTop: 12 }}>
                <div
                  style={{
                    height: 94,
                    backgroundColor: btnActiveState ? COLORS.burgundy : COLORS.staleGray,
                    color: btnActiveState ? COLORS.surface : '#6A615B',
                    border: '4px solid #171313',
                    boxShadow: isClicking ? 'none' : btnActiveState ? SHADOWS.brutal : 'none',
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONTS.display,
                    fontSize: 36,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    transform: isClicking ? 'translate(4px, 4px)' : 'none',
                  }}
                >
                  TRANSFORMER L&apos;IDÉE
                </div>

                {showCursor && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 120,
                      bottom: -24,
                      transform: `translate(${cursorX}px, ${cursorY}px) scale(${isClicking ? 0.86 : 1})`,
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  >
                    <Ep02PointerSvg size={68} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </StageLayer>
    );
  }

  /* Phase 3B (300..375) : Scanner Laser Pur Avant -> Apres (900x960) */
  const scanEnterP = settledProgress(frame, fps, scanStart);
  const scanEnterScale = scanEnterP < 1 ? interpolate(scanEnterP, [0, 1], [0.94, 1]) : 1;
  const scanEnterY = scanEnterP < 1 ? interpolate(scanEnterP, [0, 1], [36, 0]) : 0;

  const scanPct = interpolate(frame, [scanBarStart, scanBarEnd], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const showScanBar = frame >= scanBarStart && frame <= scanBarEnd + 2;

  const sub3B =
    frame < 330 ? (
      <Ep02Subtitle before="la même" highlight="idée devient" fontSize={54} />
    ) : (
      <Ep02Subtitle before="un vrai" highlight="produit interactif" fontSize={54} />
    );

  return (
    <StageLayer zIndex={14}>
      <div
        style={{
          width: 900,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          transform:
            scanEnterScale === 1 && scanEnterY === 0
              ? 'none'
              : `translateY(${scanEnterY}px) scale(${scanEnterScale})`,
        }}
      >
        {sub3B}

        <div
          style={{
            position: 'relative',
            width: 900,
            height: 960,
            backgroundColor: COLORS.surface,
            border: '4px solid #171313',
            boxShadow: '8px 8px 0px #171313',
            borderRadius: 20,
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ position: 'absolute', inset: 0 }}>
            <Img
              src={staticFile('ep01/pdf1-page1-portrait.png')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(55%) contrast(0.95)',
                display: 'block',
              }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: `inset(0 0 ${100 - scanPct}% 0)`,
            }}
          >
            <Img
              src={staticFile('ep01/platform-home-real.png')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                display: 'block',
              }}
            />
          </div>

          {showScanBar && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${scanPct}%`,
                height: 8,
                backgroundColor: COLORS.burgundy,
                boxShadow: '0 0 22px 4px rgba(182, 49, 49, 0.72)',
                transform: 'translateY(-50%)',
                zIndex: 15,
              }}
            />
          )}
        </div>
      </div>
    </StageLayer>
  );
};

/* ACTE 4 (376..604) : Demo Interactive Pure (376..499) -> 2 Cartes Epurees (500..604) */
const Act4InteractiveAndValueBalance: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { from, end, ripple1, ripple2, ripple3, compareStart, pdfSinkFrame } = EP02_TIMING.act4;

  if (frame < from || frame >= end) {
    return null;
  }

  const isPhase4B = frame >= compareStart;

  if (!isPhase4B) {
    const enterP = settledProgress(frame, fps, from);
    const enterY = enterP < 1 ? interpolate(enterP, [0, 1], [36, 0]) : 0;
    const enterScale = enterP < 1 ? interpolate(enterP, [0, 1], [0.94, 1]) : 1;

    let subtitle: React.ReactNode;
    if (frame < 407) {
      subtitle = <Ep02Subtitle before="Ce que les gens" highlight="veulent," fontSize={54} />;
    } else if (frame < 427) {
      subtitle = <Ep02Subtitle before="c'est" highlight="tester," fontSize={56} />;
    } else if (frame < 450) {
      subtitle = <Ep02Subtitle highlight="cliquer" after="et avoir" fontSize={56} />;
    } else {
      subtitle = <Ep02Subtitle before="un résultat" highlight="immédiat." fontSize={54} />;
    }

    return (
      <StageLayer zIndex={16}>
        <div
          style={{
            width: 920,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 32,
            transform:
              enterScale === 1 && enterY === 0
                ? 'none'
                : `translateY(${enterY}px) scale(${enterScale})`,
          }}
        >
          {subtitle}

          <div
            style={{
              position: 'relative',
              width: 920,
              height: 680,
              backgroundColor: COLORS.surface,
              border: '4px solid #171313',
              boxShadow: '8px 8px 0px #171313',
              borderRadius: 20,
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <Sequence from={from} durationInFrames={compareStart - from} layout="none">
              <OffthreadVideo
                src={staticFile('ep01/demo-interactive-clean.mp4')}
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: COLORS.surface,
                  display: 'block',
                }}
              />
            </Sequence>

            <RipplePulse frame={frame} triggerFrame={ripple1} x={270} y={260} />
            <RipplePulse frame={frame} triggerFrame={ripple2} x={500} y={350} />
            <RipplePulse frame={frame} triggerFrame={ripple3} x={680} y={440} />
          </div>
        </div>
      </StageLayer>
    );
  }

  /* Phase 4B (500..604) : 2 Cartes Epurees Sans Jauges */
  const enter4BP = settledProgress(frame, fps, compareStart);
  const enter4BY = enter4BP < 1 ? interpolate(enter4BP, [0, 1], [36, 0]) : 0;
  const enter4BScale = enter4BP < 1 ? interpolate(enter4BP, [0, 1], [0.94, 1]) : 1;

  const rightRiseY = interpolate(enter4BP, [0, 1], [14, -14]);
  const rightScale = interpolate(enter4BP, [0, 1], [0.96, 1.03]);

  const arrowDraw = interpolate(frame, [compareStart + 8, compareStart + 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isStruck = frame >= pdfSinkFrame;
  const sinkP = isStruck ? settledProgress(frame, fps, pdfSinkFrame) : 0;
  const leftSinkY = isStruck ? interpolate(sinkP, [0, 1], [0, 24]) : 0;
  const leftScale = isStruck ? interpolate(sinkP, [0, 1], [1.0, 0.88]) : 1;

  let sub4B: React.ReactNode;
  if (frame < 530) {
    sub4B = <Ep02Subtitle before="Un outil" highlight="qu'on utilise" fontSize={54} />;
  } else if (frame < 556) {
    sub4B = <Ep02Subtitle before="a beaucoup plus" highlight="de valeur" fontSize={54} />;
  } else {
    sub4B = <Ep02Subtitle before="qu'un simple" highlight="fichier texte." fontSize={54} />;
  }

  return (
    <StageLayer zIndex={16}>
      <div
        style={{
          width: 920,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 44,
          transform:
            enter4BScale === 1 && enter4BY === 0
              ? 'none'
              : `translateY(${enter4BY}px) scale(${enter4BScale})`,
        }}
      >
        {sub4B}

        <div
          style={{
            width: 920,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left Card (416x540) : FICHIER TEXTE */}
          <div
            style={{
              width: 416,
              height: 540,
              backgroundColor: COLORS.staleGray,
              border: '4px solid #6A615B',
              boxShadow: '6px 6px 0px #171313',
              borderRadius: 20,
              padding: 20,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              transform: `translateY(${leftSinkY}px) scale(${leftScale})`,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.sans,
                fontWeight: 800,
                fontSize: 28,
                lineHeight: 1.15,
                color: '#5C544E',
                textAlign: 'center',
                textDecoration: isStruck ? 'line-through' : 'none',
                textDecorationThickness: '4px',
                textDecorationColor: COLORS.burgundy,
              }}
            >
              FICHIER TEXTE
            </div>

            <div
              style={{
                width: '100%',
                flex: 1,
                borderRadius: 14,
                border: '3px solid #6A615B',
                overflow: 'hidden',
                backgroundColor: COLORS.sand,
              }}
            >
              <Img
                src={staticFile('ep01/pdf2-page1-portrait.png')}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: isStruck ? 'grayscale(75%)' : 'grayscale(45%)',
                  opacity: isStruck ? 0.78 : 0.94,
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Connector Arrow */}
          <div style={{ width: 68, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="64" height="44" viewBox="0 0 64 44">
              <line
                x1="4"
                y1="22"
                x2="50"
                y2="22"
                stroke={COLORS.burgundy}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="48"
                strokeDashoffset={48 * (1 - arrowDraw)}
              />
              {arrowDraw > 0.7 && (
                <path
                  d="M40 10 L54 22 L40 34"
                  fill="none"
                  stroke={COLORS.burgundy}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </div>

          {/* Right Card (436x560) : OUTIL INTERACTIF */}
          <div
            style={{
              width: 436,
              height: 560,
              backgroundColor: COLORS.surface,
              border: '4px solid #171313',
              boxShadow: '10px 10px 0px #171313',
              borderRadius: 20,
              padding: 20,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              transform: `translateY(${rightRiseY}px) scale(${rightScale})`,
            }}
          >
            <div
              style={{
                width: '100%',
                backgroundColor: COLORS.burgundy,
                color: COLORS.surface,
                border: '3px solid #171313',
                borderRadius: 12,
                padding: '12px 16px',
                fontFamily: FONTS.sans,
                fontWeight: 800,
                fontSize: 28,
                lineHeight: 1.15,
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
            >
              OUTIL INTERACTIF ✓
            </div>

            <div
              style={{
                width: '100%',
                flex: 1,
                borderRadius: 14,
                border: '3.5px solid #171313',
                overflow: 'hidden',
              }}
            >
              <Img
                src={staticFile('ep01/platform-home-real.png')}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: COLORS.surface,
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </StageLayer>
  );
};

/* ACTE 5 (605..810) : Toggles Epures (605..701) -> Commentaire + Carte DM Epuree (702..810) */
const Act5TogglesAndDmReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { from, toggle1, toggle2, dmStart, typeStart, typeEnd, sendClick, liftStart, dmOpen } =
    EP02_TIMING.act5;

  if (frame < from) {
    return null;
  }

  const isDmPhase = frame >= dmStart;

  if (!isDmPhase) {
    const enter5AP = settledProgress(frame, fps, from);
    const y5A = enter5AP < 1 ? interpolate(enter5AP, [0, 1], [36, 0]) : 0;
    const scale5A = enter5AP < 1 ? interpolate(enter5AP, [0, 1], [0.94, 1]) : 1;

    const t1P = frame >= toggle1 ? settledProgress(frame, fps, toggle1) : 0;
    const t2P = frame >= toggle2 ? settledProgress(frame, fps, toggle2) : 0;
    const t1On = frame >= toggle1;
    const t2On = frame >= toggle2;

    const rows = [
      { label: 'SANS ABONNEMENT', on: t1On, progress: t1P },
      { label: 'SANS CODER', on: t2On, progress: t2P },
    ];

    let sub5A: React.ReactNode;
    if (frame < toggle1) {
      sub5A = <Ep02Subtitle before="Tu peux créer ça" highlight="avec Claude" fontSize={54} />;
    } else if (frame < toggle2) {
      sub5A = <Ep02Subtitle before="même" highlight="sans abonnement" fontSize={54} />;
    } else {
      sub5A = <Ep02Subtitle before="et" highlight="sans coder." fontSize={54} />;
    }

    return (
      <StageLayer zIndex={18}>
        <div
          style={{
            width: 920,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 40,
            transform: scale5A === 1 && y5A === 0 ? 'none' : `translateY(${y5A}px) scale(${scale5A})`,
          }}
        >
          {sub5A}

          <div
            style={{
              width: 920,
              backgroundColor: COLORS.surface,
              border: '4px solid #171313',
              boxShadow: '8px 8px 0px #171313',
              borderRadius: 24,
              padding: '46px 40px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 36,
            }}
          >
            <div
              style={{
                width: 132,
                height: 132,
                borderRadius: 28,
                backgroundColor: COLORS.sand,
                border: '4px solid #171313',
                boxShadow: SHADOWS.brutalSm,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <OfficialClaudeLogoSvg size={84} color="#D97757" />
            </div>

            {rows.map((row, idx) => {
              const knobX = Math.round(interpolate(row.progress, [0, 1], [0, 68]));
              return (
                <div
                  key={idx}
                  style={{
                    width: '100%',
                    backgroundColor: row.on ? COLORS.cream : COLORS.sand,
                    border: '4px solid #171313',
                    boxShadow: row.on ? SHADOWS.brutalSm : 'none',
                    borderRadius: 20,
                    padding: '30px 32px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONTS.sans,
                      fontWeight: 800,
                      fontSize: 34,
                      color: row.on ? COLORS.burgundy : COLORS.ink,
                      textAlign: 'left',
                    }}
                  >
                    {row.label}
                  </span>

                  <div
                    style={{
                      position: 'relative',
                      width: 144,
                      height: 76,
                      borderRadius: 999,
                      backgroundColor: row.on ? COLORS.burgundy : COLORS.staleGray,
                      border: '4px solid #171313',
                      flexShrink: 0,
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: COLORS.surface,
                        border: '3.5px solid #171313',
                        transform: `translateX(${knobX}px)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </StageLayer>
    );
  }

  /* Phase 5B (702..810) : Sous-titre en haut + Saisie CLAUDE -> Remontee vers DM epure */
  const enterDmP = settledProgress(frame, fps, dmStart);
  const enterDmY = enterDmP < 1 ? interpolate(enterDmP, [0, 1], [36, 0]) : 0;
  const enterDmScale = enterDmP < 1 ? interpolate(enterDmP, [0, 1], [0.94, 1]) : 1;

  const liftProgress = interpolate(frame, [liftStart, dmOpen], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const easedLift = liftProgress * liftProgress * (3 - 2 * liftProgress);
  const commentBlockY = interpolate(easedLift, [0, 1], [150, 0]);

  const keyword = 'CLAUDE';
  const typedCount = Math.floor(
    interpolate(frame, [typeStart, typeEnd], [0, keyword.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const shownText = keyword.slice(0, typedCount);

  const cursorMove = interpolate(frame, [typeEnd - 4, sendClick], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorX = interpolate(cursorMove, [0, 1], [150, 0]);
  const cursorY = interpolate(cursorMove, [0, 1], [95, 0]);
  const isClicking = frame >= sendClick && frame < sendClick + 6;
  const showCursor = frame >= typeEnd - 4 && frame < sendClick + 12;

  const arrowP = interpolate(frame, [liftStart, dmOpen], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dmCardVisible = frame >= dmOpen;
  const dmCardP = dmCardVisible ? settledProgress(frame, fps, dmOpen) : 0;
  const dmCardScale = dmCardVisible ? interpolate(dmCardP, [0, 1], [0.93, 1]) : 1;

  let sub5B: React.ReactNode;
  if (frame < 726) {
    sub5B = <Ep02Subtitle before="Commente" highlight="CLAUDE," fontSize={54} />;
  } else if (frame < 762) {
    sub5B = <Ep02Subtitle before="je t'envoie" highlight="mon mini-cours" fontSize={52} />;
  } else {
    sub5B = <Ep02Subtitle before="en privé pour" highlight="créer le tien." fontSize={54} />;
  }

  return (
    <StageLayer zIndex={20}>
      <div
        style={{
          width: 920,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          transform:
            enterDmScale === 1 && enterDmY === 0
              ? 'none'
              : `translateY(${enterDmY}px) scale(${enterDmScale})`,
        }}
      >
        {sub5B}

        <div
          style={{
            width: 920,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 22,
          }}
        >
          <div
            style={{
              width: 920,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: commentBlockY === 0 ? 'none' : `translateY(${commentBlockY}px)`,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 920,
                backgroundColor: COLORS.surface,
                border: '4px solid #171313',
                boxShadow: '8px 8px 0px #171313',
                borderRadius: 18,
                padding: '24px 32px',
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 14,
                  backgroundColor: COLORS.ink,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 5H20V16H9L4 20V5Z"
                    stroke={COLORS.surface}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div
                style={{
                  flex: 1,
                  textAlign: 'left',
                  fontFamily: FONTS.display,
                  fontSize: 54,
                  lineHeight: 1.0,
                  color: COLORS.ink,
                  minHeight: 56,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {shownText || ' '}
              </div>

              <div
                style={{
                  backgroundColor: COLORS.burgundy,
                  color: COLORS.surface,
                  border: '3.5px solid #171313',
                  boxShadow: isClicking ? 'none' : SHADOWS.brutalSm,
                  borderRadius: 12,
                  padding: '16px 28px',
                  fontFamily: FONTS.sans,
                  fontWeight: 800,
                  fontSize: 28,
                  textTransform: 'uppercase',
                  transform: isClicking ? 'translate(4px, 4px)' : 'none',
                }}
              >
                ENVOYER
              </div>

              {showCursor && (
                <div
                  style={{
                    position: 'absolute',
                    right: 76,
                    bottom: -22,
                    transform: `translate(${cursorX}px, ${cursorY}px) scale(${isClicking ? 0.86 : 1})`,
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                >
                  <Ep02PointerSvg size={68} />
                </div>
              )}
            </div>
          </div>

          <svg
            width="64"
            height="72"
            viewBox="0 0 64 72"
            style={{ visibility: arrowP > 0 ? 'visible' : 'hidden' }}
          >
            <line
              x1="32"
              y1="2"
              x2="32"
              y2="56"
              stroke={COLORS.burgundy}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="56"
              strokeDashoffset={56 * (1 - arrowP)}
            />
            {arrowP > 0.7 && (
              <path
                d="M16 44 L32 62 L48 44"
                fill="none"
                stroke={COLORS.burgundy}
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>

          <div
            style={{
              width: 920,
              backgroundColor: COLORS.surface,
              border: '4px solid #171313',
              boxShadow: '8px 8px 0px #171313',
              borderRadius: 22,
              padding: 32,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 36,
              visibility: dmCardVisible ? 'visible' : 'hidden',
              transform: dmCardScale === 1 ? 'none' : `scale(${dmCardScale})`,
            }}
          >
            <Img
              src={staticFile('ep01/chariow-cover-square-1200x1200.png')}
              style={{
                width: 280,
                height: 280,
                borderRadius: 16,
                border: '3.5px solid #171313',
                boxShadow: SHADOWS.brutalSm,
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />

            <div
              style={{
                flex: 1,
                fontFamily: FONTS.sans,
                fontWeight: 800,
                fontSize: 38,
                lineHeight: 1.25,
                color: COLORS.ink,
                textAlign: 'left',
              }}
            >
              Je t&apos;envoie mon Mini-Cours en privé
            </div>
          </div>
        </div>
      </div>
    </StageLayer>
  );
};

export const Ep02Composition: React.FC = () => (
  <AbsoluteFill>
    {EP02_TIMING.hasVoiceover && <Audio src={staticFile('ep02/voix_ep02.wav')} />}

    {/* Acte 1 Keyboard Ticks & Send Click */}
    {ACT1_KEY_FRAMES.map((kf) => (
      <SfxCue key={`a1k-${kf}`} name="key_tick" atFrame={kf} volume={0.28} />
    ))}
    <SfxCue name="click" atFrame={84} volume={0.48} />

    {/* Acte 2 SFX */}
    <SfxCue name="pop" atFrame={125} volume={0.44} />
    <SfxCue name="pop" atFrame={142} volume={0.42} />
    <SfxCue name="error_buzz" atFrame={158} volume={0.48} />
    <SfxCue name="pop" atFrame={176} volume={0.42} />

    {/* Acte 3 SFX */}
    <SfxCue name="pop" atFrame={248} volume={0.46} />
    <SfxCue name="click" atFrame={260} volume={0.46} />
    <SfxCue name="click" atFrame={272} volume={0.46} />
    <SfxCue name="click" atFrame={286} volume={0.48} />
    <SfxCue name="whoosh" atFrame={312} volume={0.46} />
    <SfxCue name="chime_success" atFrame={338} volume={0.52} />

    {/* Acte 4 SFX */}
    <SfxCue name="pop" atFrame={376} volume={0.44} />
    <SfxCue name="click" atFrame={412} volume={0.48} />
    <SfxCue name="click" atFrame={428} volume={0.48} />
    <SfxCue name="chime_success" atFrame={454} volume={0.54} />
    <SfxCue name="pop" atFrame={500} volume={0.46} />
    <SfxCue name="error_buzz" atFrame={558} volume={0.48} />

    {/* Acte 5 SFX & Keyboard Ticks */}
    <SfxCue name="pop" atFrame={605} volume={0.46} />
    <SfxCue name="click" atFrame={638} volume={0.48} />
    <SfxCue name="click" atFrame={666} volume={0.48} />
    <SfxCue name="whoosh" atFrame={702} volume={0.42} />
    {ACT5_KEY_FRAMES.map((kf) => (
      <SfxCue key={`a5k-${kf}`} name="key_tick" atFrame={kf} volume={0.32} />
    ))}
    <SfxCue name="click" atFrame={723} volume={0.48} />
    <SfxCue name="chime_success" atFrame={734} volume={0.54} />

    {/* Single Fixed Studio Lin Canvas with 5 Non-Overlapping Acts */}
    <EditorialCanvas>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Act1And2ClaudeToPdf />
        <Act3BlueprintAndScanTransform />
        <Act4InteractiveAndValueBalance />
        <Act5TogglesAndDmReveal />
      </div>
    </EditorialCanvas>
  </AbsoluteFill>
);
