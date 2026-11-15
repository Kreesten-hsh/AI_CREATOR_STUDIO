import React from 'react';
import { Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AVATAR_POSES, BORDER_WIDTH, COLORS, FONTS, SHADOWS } from '../../engine/theme';
import {
  AccentBanner,
  AvatarScene,
  BadgePill,
  EditorialCanvas,
  ImpactTitleScreen,
  MathStackCards,
  RetroWindow,
  SfxCue,
  SquareIconCard,
  settledProgress,
} from '../../engine/components/Primitives';

/* SVG Claude starburst mark in brand Burgundy-Rose */
const ClaudeStarburstIcon: React.FC<{ size?: number }> = ({ size = 148 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <g transform="translate(60, 60)" fill={COLORS.burgundy} stroke={COLORS.ink} strokeWidth="2.5">
      {Array.from({ length: 12 }).map((_, i) => (
        <rect
          key={i}
          x="-6.5"
          y="-46"
          width="13"
          height="36"
          transform={`rotate(${i * 30})`}
        />
      ))}
      <circle cx="0" cy="0" r="14" fill={COLORS.surface} stroke={COLORS.ink} strokeWidth="3.5" />
    </g>
  </svg>
);

/* Crisp SVG document PDF icon (optionally crossed out) */
const PdfDocIcon: React.FC<{ size?: number; crossed?: boolean; stroke?: string }> = ({
  size = 34,
  crossed = false,
  stroke = COLORS.ink,
}) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
    <path d="M8 4 H22 L28 10 V32 H8 Z" fill={COLORS.surface} stroke={stroke} strokeWidth="2.8" />
    <path d="M22 4 V10 H28" stroke={stroke} strokeWidth="2.8" />
    <line x1="12" y1="17" x2="24" y2="17" stroke={stroke} strokeWidth="2.5" />
    <line x1="12" y1="23" x2="21" y2="23" stroke={stroke} strokeWidth="2.5" />
    {crossed && <line x1="5" y1="31" x2="31" y2="5" stroke={COLORS.burgundy} strokeWidth="3.5" />}
  </svg>
);

/* Crisp SVG interactive cursor / slider widget icon */
const InteractiveCursorIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
    <rect x="4" y="6" width="28" height="24" fill={COLORS.surface} stroke={COLORS.ink} strokeWidth="2.8" />
    <line x1="9" y1="14" x2="27" y2="14" stroke={COLORS.burgundy} strokeWidth="3" />
    <rect x="17" y="10" width="7" height="8" fill={COLORS.burgundy} stroke={COLORS.ink} strokeWidth="2" />
    <path d="M20 20 L20 31 L24 27 L27 32 L30 30 L27 25 L31 25 Z" fill={COLORS.ink} />
  </svg>
);

/* Crisp SVG calculator icon */
const CalculatorIcon: React.FC<{ size?: number; accent?: boolean }> = ({ size = 40, accent = false }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
    <rect
      x="7"
      y="4"
      width="26"
      height="32"
      fill={accent ? COLORS.burgundy : COLORS.surface}
      stroke={COLORS.ink}
      strokeWidth="2.8"
    />
    <rect x="11" y="8" width="18" height="8" fill={COLORS.surface} stroke={COLORS.ink} strokeWidth="2" />
    <rect x="11" y="20" width="5" height="4" fill={accent ? COLORS.surface : COLORS.ink} />
    <rect x="18" y="20" width="5" height="4" fill={accent ? COLORS.surface : COLORS.ink} />
    <rect x="25" y="20" width="4" height="4" fill={accent ? COLORS.surface : COLORS.ink} />
    <rect x="11" y="27" width="5" height="4" fill={accent ? COLORS.surface : COLORS.ink} />
    <rect x="18" y="27" width="11" height="4" fill={accent ? COLORS.surface : COLORS.burgundy} />
  </svg>
);

/* Crisp SVG wallet / budget split icon */
const WalletSplitIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
    <rect x="5" y="8" width="30" height="24" fill={COLORS.surface} stroke={COLORS.ink} strokeWidth="2.8" />
    <line x1="15" y1="8" x2="15" y2="32" stroke={COLORS.ink} strokeWidth="2.5" />
    <line x1="25" y1="8" x2="25" y2="32" stroke={COLORS.ink} strokeWidth="2.5" />
    <rect x="17" y="16" width="6" height="8" fill={COLORS.burgundy} stroke={COLORS.ink} strokeWidth="2" />
  </svg>
);

/* Crisp SVG diagnostic target icon */
const TargetIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="20" cy="20" r="14" fill={COLORS.surface} stroke={COLORS.ink} strokeWidth="2.8" />
    <circle cx="20" cy="20" r="8" fill={COLORS.surface} stroke={COLORS.ink} strokeWidth="2.5" />
    <circle cx="20" cy="20" r="3.5" fill={COLORS.burgundy} />
  </svg>
);

/* Crisp SVG calendar checklist icon */
const CalendarChecklistIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
    <rect x="5" y="8" width="30" height="26" fill={COLORS.surface} stroke={COLORS.ink} strokeWidth="2.8" />
    <line x1="5" y1="15" x2="35" y2="15" stroke={COLORS.ink} strokeWidth="2.8" />
    <line x1="13" y1="4" x2="13" y2="10" stroke={COLORS.ink} strokeWidth="3" />
    <line x1="27" y1="4" x2="27" y2="10" stroke={COLORS.ink} strokeWidth="3" />
    <path d="M12 24 L17 29 L28 19" stroke={COLORS.burgundy} strokeWidth="3.2" fill="none" />
  </svg>
);

/* Crisp SVG black user silhouette */
const ProfileIcon: React.FC = () => (
  <svg width="46" height="46" viewBox="0 0 48 48" fill="none">
    <rect x="2" y="2" width="44" height="44" rx="10" fill={COLORS.ink} />
    <circle cx="24" cy="18" r="8" fill={COLORS.surface} />
    <path d="M10 42 C10 32, 38 32, 38 42" fill={COLORS.surface} />
  </svg>
);

/* Sharp black-and-white vector pointer */
const MouseCursorSvg: React.FC = () => (
  <svg width="54" height="58" viewBox="0 0 40 44" fill="none">
    <path
      d="M4 3 L4 35 L13 26 L20 40 L26 37 L19 23 L32 23 Z"
      fill={COLORS.surface}
      stroke={COLORS.ink}
      strokeWidth="3.5"
      strokeLinejoin="miter"
    />
  </svg>
);

/* Plan 01 (0..66): Hook Chiffre + RetroWindow Avant/Apres (Zero Avatar) */
const Plan01HookCompare: React.FC = () => {
  const frame = useCurrentFrame();
  const sliderX = Math.round(
    interpolate(frame, [10, 48], [28, 78], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  return (
    <EditorialCanvas>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
        <BadgePill label="MÊME IDÉE DE DÉPART" />
        <ImpactTitleScreen
          size={64}
          lines={[
            [{ text: '1 VENTE À' }, { text: '15 000 F', accent: true }],
            [{ text: 'AU LIEU DE 5 À 3 000 F' }],
          ]}
        />
        <RetroWindow title="AVANT • APRÈS" enterFrame={0} padding="26px 26px">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div
              style={{
                backgroundColor: COLORS.staleGray,
                border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
                borderRadius: 14,
                padding: '22px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <PdfDocIcon size={32} crossed stroke={COLORS.muted} />
                <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 25, color: COLORS.muted }}>
                  EBOOK PDF
                </div>
              </div>
              <div style={{ fontFamily: FONTS.display, fontSize: 38, color: COLORS.muted }}>2 000 F</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                <div style={{ height: 10, width: '90%', backgroundColor: '#C9C1B4', borderRadius: 999 }} />
                <div style={{ height: 10, width: '75%', backgroundColor: '#C9C1B4', borderRadius: 999 }} />
                <div style={{ height: 10, width: '60%', backgroundColor: '#C9C1B4', borderRadius: 999 }} />
              </div>
            </div>

            <div
              style={{
                backgroundColor: COLORS.surface,
                border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
                borderRadius: 14,
                boxShadow: SHADOWS.brutalSm,
                padding: '22px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <InteractiveCursorIcon size={32} />
                <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 25, color: COLORS.burgundy }}>
                  OUTIL INTERACTIF
                </div>
              </div>
              <div style={{ fontFamily: FONTS.display, fontSize: 38, color: COLORS.ink }}>15 000 F</div>
              <div
                style={{
                  position: 'relative',
                  height: 22,
                  backgroundColor: COLORS.sand,
                  border: `3px solid ${COLORS.ink}`,
                  borderRadius: 999,
                  marginTop: 10,
                }}
              >
                <div style={{ height: '100%', width: `${sliderX}%`, backgroundColor: COLORS.burgundy, borderRadius: 999 }} />
                <div
                  style={{
                    position: 'absolute',
                    top: -7,
                    left: `calc(${sliderX}% - 14px)`,
                    width: 28,
                    height: 30,
                    backgroundColor: COLORS.surface,
                    border: `3.5px solid ${COLORS.ink}`,
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>
          </div>
        </RetroWindow>
      </div>
    </EditorialCanvas>
  );
};

/* Plan 02 (66..135): RetroWindow Produits IA Generiques (Zero Avatar, First Row at Frame 0) */
const Plan02GenericMarket: React.FC = () => {
  const frame = useCurrentFrame();
  const files = [
    { name: 'ebook-chatgpt.pdf', ef: 0, fillPct: 50 },
    { name: 'pack-100-prompts.pdf', ef: 10, fillPct: 68 },
    { name: 'guide-theorique.pdf', ef: 20, fillPct: 84 },
  ];

  return (
    <EditorialCanvas>
      <RetroWindow title="PRODUITS IA GÉNÉRIQUES" bannerText="BRADÉS À 2 000 F" bannerEnterFrame={24}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {files.map((item) => {
            const visible = frame >= item.ef;
            return (
              <div
                key={item.name}
                style={{
                  backgroundColor: COLORS.staleGray,
                  border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
                  borderRadius: 14,
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  visibility: visible ? 'visible' : 'hidden',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <PdfDocIcon size={30} stroke={COLORS.ink} />
                    <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 27, color: COLORS.ink }}>
                      {item.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: FONTS.sans,
                      fontWeight: 800,
                      fontSize: 24,
                      color: COLORS.muted,
                      backgroundColor: COLORS.sand,
                      border: `2.5px solid ${COLORS.ink}`,
                      borderRadius: 8,
                      padding: '4px 12px',
                    }}
                  >
                    2 000 F
                  </span>
                </div>
                <div
                  style={{
                    height: 14,
                    width: '100%',
                    backgroundColor: '#CCC4B7',
                    border: `2.5px solid ${COLORS.ink}`,
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ height: '100%', width: `${item.fillPct}%`, backgroundColor: '#8E8681', borderRadius: 999 }} />
                </div>
              </div>
            );
          })}
        </div>
      </RetroWindow>
    </EditorialCanvas>
  );
};

/* Plan 03 (135..204): Equation Mathematique Empilee (Zero Avatar) */
const Plan03MathEquation: React.FC = () => (
  <EditorialCanvas>
    <MathStackCards
      rows={[
        { label: 'EBOOK CLASSIQUE', value: '3 000 F', enterFrame: 0 },
        { label: 'EFFORT POUR 15 000 F', operator: '×', value: '5 VENTES', enterFrame: 16 },
        { label: 'PRODUIT INTERACTIF', operator: '=', value: '1 SEULE VENTE', accent: true, enterFrame: 32 },
      ]}
    />
  </EditorialCanvas>
);

/* Plan 05 (276..366): Icone Claude puis Fenetre Transformation en 3 Clics (Zero Avatar) */
const Plan05ClaudeStepsWindow: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    {
      num: '1.',
      label: 'Ton document ou ton idée',
      start: 0,
      icon: <PdfDocIcon size={34} />,
    },
    {
      num: '2.',
      label: 'Les 2 Prompts Maîtres',
      start: 12,
      icon: <ClaudeStarburstIcon size={36} />,
    },
    {
      num: '3.',
      label: 'Ton outil interactif prêt à vendre',
      start: 24,
      icon: <CalculatorIcon size={36} accent />,
    },
  ];

  return (
    <RetroWindow title="TRANSFORMATION EN 3 CLICS" padding="28px 28px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {steps.map((st, idx) => {
          const active = frame >= st.start;
          const highlight = idx === 2 && active;

          return (
            <div
              key={st.num}
              style={{
                backgroundColor: highlight ? COLORS.burgundy : COLORS.surface,
                color: highlight ? COLORS.surface : COLORS.ink,
                border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
                borderRadius: 14,
                boxShadow: SHADOWS.brutalSm,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                visibility: active ? 'visible' : 'hidden',
              }}
            >
              {st.icon}
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 32,
                  color: highlight ? COLORS.surface : COLORS.burgundy,
                }}
              >
                {st.num}
              </span>
              <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 27 }}>{st.label}</span>
            </div>
          );
        })}
      </div>
    </RetroWindow>
  );
};

const Plan05ClaudeAndSteps: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={39}>
      <EditorialCanvas>
        <SquareIconCard
          icon={<ClaudeStarburstIcon size={156} />}
          title="CLAUDE"
          bannerText="SKILL DESIGN"
        />
      </EditorialCanvas>
    </Sequence>

    <Sequence from={39} durationInFrames={51}>
      <EditorialCanvas>
        <Plan05ClaudeStepsWindow />
      </EditorialCanvas>
    </Sequence>
  </>
);

/* Plan 06 (366..495): RetroWindow Grille 2x2 Symetrique des 4 Idees (Toutes lisibles + highlight #B63131) */
const Plan06FourIdeasGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const ideas = [
    {
      num: '01',
      title: 'CALCULATEUR DE PRIX',
      price: '12 000 F+',
      icon: <CalculatorIcon size={40} />,
      at: 0,
    },
    {
      num: '02',
      title: 'RÉPARTITEUR BUDGET',
      price: '10 000 F+',
      icon: <WalletSplitIcon size={40} />,
      at: 18,
    },
    {
      num: '03',
      title: 'DIAGNOSTIC CLIENT',
      price: '15 000 F+',
      icon: <TargetIcon size={40} />,
      at: 36,
    },
    {
      num: '04',
      title: 'PLANIFICATEUR REPAS',
      price: '10 000 F+',
      icon: <CalendarChecklistIcon size={40} />,
      at: 54,
    },
  ];

  return (
    <EditorialCanvas>
      <RetroWindow
        title="4 IDÉES À 10 000 F ET PLUS"
        bannerText="CODE D'ACCÈS INCLUS"
        bannerEnterFrame={76}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {ideas.map((item) => {
            const lit = frame >= item.at;
            return (
              <div
                key={item.num}
                style={{
                  backgroundColor: COLORS.surface,
                  border: `${BORDER_WIDTH}px solid ${lit ? COLORS.burgundy : COLORS.ink}`,
                  borderRadius: 14,
                  boxShadow: lit ? SHADOWS.brutalSm : 'none',
                  padding: '20px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.icon}
                  <span
                    style={{
                      fontFamily: FONTS.mono,
                      fontWeight: 700,
                      fontSize: 24,
                      backgroundColor: lit ? COLORS.burgundy : COLORS.staleGray,
                      color: lit ? COLORS.surface : COLORS.ink,
                      border: `2.5px solid ${COLORS.ink}`,
                      borderRadius: 8,
                      padding: '4px 10px',
                    }}
                  >
                    {item.price}
                  </span>
                </div>
                <div style={{ fontFamily: FONTS.display, fontSize: 27, lineHeight: 1.15, color: COLORS.ink }}>
                  {item.title}
                </div>
              </div>
            );
          })}
        </div>
      </RetroWindow>
    </EditorialCanvas>
  );
};

/* Plan 08 (585..720): CTA Commentaires ManyChat (Zero Jump + Cursor Vanishes at frame > 58) */
const Plan08ManyChatCommentCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const keyword = 'CLAUDE';
  const typedCount = Math.min(keyword.length, Math.max(0, Math.floor((frame - 8) / 6)));
  const typedText = keyword.slice(0, typedCount);
  const showCaret = frame < 55 && Math.floor(frame / 8) % 2 === 0;

  const cursorX = Math.round(
    interpolate(frame, [20, 48], [260, 110], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const cursorY = Math.round(
    interpolate(frame, [20, 48], [160, 34], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const isClicking = frame >= 49 && frame <= 55;
  const showCursor = frame <= 58;

  const showDm = frame >= 60;
  const dmProgress = showDm ? settledProgress(frame, fps, 60) : 0;
  const dmTranslateY = showDm && dmProgress < 1 ? Math.round(interpolate(dmProgress, [0, 1], [14, 0])) : 0;

  return (
    <EditorialCanvas>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, width: 780 }}>
        <AccentBanner text="COMMENTAIRES" />

        {/* Input box 780px */}
        <div
          style={{
            position: 'relative',
            width: 780,
            backgroundColor: COLORS.surface,
            border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
            borderRadius: 16,
            boxShadow: isClicking ? 'none' : SHADOWS.brutal,
            padding: '24px 28px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            transform: isClicking ? 'translate(5px, 5px)' : 'none',
          }}
        >
          <ProfileIcon />
          <div
            style={{
              flex: 1,
              textAlign: 'left',
              fontFamily: FONTS.display,
              fontSize: 44,
              letterSpacing: '0.06em',
              color: COLORS.ink,
            }}
          >
            {typedText}
            {showCaret && <span style={{ color: COLORS.burgundy }}>|</span>}
          </div>

          <div
            style={{
              position: 'absolute',
              right: cursorX,
              bottom: -cursorY,
              transform: isClicking ? 'scale(0.86)' : 'none',
              opacity: showCursor ? 1 : 0,
              pointerEvents: 'none',
              zIndex: 20,
            }}
          >
            <MouseCursorSvg />
          </div>
        </div>

        {/* Auto DM reply card slot reserved from frame 0 (zero upward jump at frame 645) */}
        <div
          style={{
            width: 780,
            backgroundColor: COLORS.surface,
            border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
            borderRadius: 16,
            boxShadow: SHADOWS.brutal,
            padding: '24px 28px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            visibility: showDm ? 'visible' : 'hidden',
            transform: dmTranslateY === 0 ? 'none' : `translateY(${dmTranslateY}px)`,
          }}
        >
          <Img
            src={staticFile(AVATAR_POSES.headBadge)}
            style={{
              width: 76,
              height: 76,
              borderRadius: '50%',
              border: `${BORDER_WIDTH}px solid ${COLORS.ink}`,
              backgroundColor: COLORS.sand,
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
          <div
            style={{
              textAlign: 'left',
              fontFamily: FONTS.sans,
              fontWeight: 800,
              fontSize: 28,
              lineHeight: 1.25,
              color: COLORS.ink,
            }}
          >
            Je t&apos;envoie le lien du Mini-Cours en DM
          </div>
        </div>
      </div>
    </EditorialCanvas>
  );
};

export const ShowcaseComposition: React.FC = () => (
  <>
    {/* Plan 01 (0..66 | 0.0-2.2s): Hook Chiffre + Avant/Apres */}
    <Sequence from={0} durationInFrames={66}>
      <Plan01HookCompare />
    </Sequence>

    {/* Plan 02 (66..135 | 2.2-4.5s): Marche Generique + Stamp */}
    <Sequence from={66} durationInFrames={69}>
      <Plan02GenericMarket />
    </Sequence>

    {/* Plan 03 (135..204 | 4.5-6.8s): Equation Mathematique Empilee */}
    <Sequence from={135} durationInFrames={69}>
      <Plan03MathEquation />
    </Sequence>

    {/* Plan 04 (204..276 | 6.8-9.2s): Avatar 1 sur 2 — Le Declic */}
    <Sequence from={204} durationInFrames={72}>
      <EditorialCanvas>
        <AvatarScene
          pose="eurekaSnap"
          lines={[
            [{ text: 'MÊME' }, { text: 'SANS CODER', accent: true }],
            [{ text: 'AVEC CLAUDE GRATUIT' }],
          ]}
        />
      </EditorialCanvas>
    </Sequence>

    {/* Plan 05 (276..366 | 9.2-12.2s): SquareIconCard Claude + RetroWindow 3 Clics */}
    <Sequence from={276} durationInFrames={90}>
      <Plan05ClaudeAndSteps />
    </Sequence>

    {/* Plan 06 (366..495 | 12.2-16.5s): 4 Transformations d'Idees en Grille 2x2 */}
    <Sequence from={366} durationInFrames={129}>
      <Plan06FourIdeasGrid />
    </Sequence>

    {/* Plan 07 (495..585 | 16.5-19.5s): Avatar 2 sur 2 — Studio & Confiance */}
    <Sequence from={495} durationInFrames={90}>
      <EditorialCanvas>
        <AvatarScene
          pose="talkingConfident"
          lines={[[{ text: 'TOUT EST DANS' }, { text: 'LE MINI-COURS', accent: true }]]}
        />
      </EditorialCanvas>
    </Sequence>

    {/* Plan 08 (585..720 | 19.5-24.0s): CTA Commentaire ManyChat */}
    <Sequence from={585} durationInFrames={135}>
      <Plan08ManyChatCommentCta />
    </Sequence>

    {/* Synced UI SFX Timeline (24s / 720 frames) */}
    <SfxCue name="pop" atFrame={2} />
    <SfxCue name="whoosh" atFrame={66} />
    <SfxCue name="stamp" atFrame={90} />
    <SfxCue name="click" atFrame={137} />
    <SfxCue name="click" atFrame={151} />
    <SfxCue name="click" atFrame={167} />
    <SfxCue name="pop" atFrame={204} />
    <SfxCue name="whoosh" atFrame={276} />
    <SfxCue name="click" atFrame={315} />
    <SfxCue name="pop" atFrame={366} />
    <SfxCue name="click" atFrame={384} />
    <SfxCue name="click" atFrame={402} />
    <SfxCue name="click" atFrame={420} />
    <SfxCue name="stamp" atFrame={442} />
    <SfxCue name="pop" atFrame={495} />
    <SfxCue name="whoosh" atFrame={585} />
    <SfxCue name="click" atFrame={634} />
    <SfxCue name="chime_success" atFrame={645} />
  </>
);
