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
import { AVATAR_POSES, COLORS, FONTS, SHADOWS } from '../../engine/theme';
import { EditorialCanvas, SfxCue, settledProgress } from '../../engine/components/Primitives';

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

const IdeaBulbIcon: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="22" cy="18" r="11" fill={COLORS.sand} stroke={COLORS.ink} strokeWidth="3" />
    <rect x="17" y="29" width="10" height="7" rx="2" fill={COLORS.surface} stroke={COLORS.ink} strokeWidth="2.8" />
    <line x1="19" y1="39" x2="25" y2="39" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
    <line x1="22" y1="2" x2="22" y2="5" stroke={COLORS.burgundy} strokeWidth="3" strokeLinecap="round" />
    <line x1="8" y1="10" x2="11" y2="12" stroke={COLORS.burgundy} strokeWidth="3" strokeLinecap="round" />
    <line x1="36" y1="10" x2="33" y2="12" stroke={COLORS.burgundy} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const InteractiveCursorIcon: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
    <rect
      x="4"
      y="6"
      width="28"
      height="24"
      rx="4"
      fill={COLORS.surface}
      stroke={COLORS.ink}
      strokeWidth="2.8"
    />
    <line x1="9" y1="14" x2="27" y2="14" stroke={COLORS.burgundy} strokeWidth="3" />
    <rect x="17" y="10" width="7" height="8" rx="2" fill={COLORS.burgundy} stroke={COLORS.ink} strokeWidth="2" />
    <path d="M20 20 L20 31 L24 27 L27 32 L30 30 L27 25 L31 25 Z" fill={COLORS.ink} />
  </svg>
);

const ProfileIcon: React.FC<{ size?: number }> = ({ size = 62 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ flexShrink: 0 }}>
    <rect x="2" y="2" width="44" height="44" rx="11" fill={COLORS.ink} />
    <circle cx="24" cy="18" r="8" fill={COLORS.surface} />
    <path d="M10 42 C10 32, 38 32, 38 42" fill={COLORS.surface} />
  </svg>
);

const MouseCursorSvg: React.FC<{ size?: number }> = ({ size = 72 }) => (
  <svg width={size} height={Math.round(size * 1.08)} viewBox="0 0 40 44" fill="none">
    <path
      d="M4 3 L4 35 L13 26 L20 40 L26 37 L19 23 L32 23 Z"
      fill={COLORS.ink}
      stroke={COLORS.surface}
      strokeWidth="2.8"
      strokeLinejoin="round"
    />
  </svg>
);

const GiantBanner: React.FC<{
  text: string;
  enterFrame?: number;
  fontSize?: number;
  bg?: string;
  color?: string;
}> = ({ text, enterFrame = 0, fontSize = 52, bg = COLORS.burgundy, color = COLORS.surface }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enterFrame > 0 ? settledProgress(frame, fps, enterFrame) : 1;
  const scale = enterFrame > 0 && frame >= enterFrame && p < 1 ? interpolate(p, [0, 1], [1.07, 1]) : 1;
  const visible = enterFrame <= 0 || frame >= enterFrame;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        color,
        border: `4px solid ${COLORS.ink}`,
        boxShadow: '7px 7px 0px #171313',
        borderRadius: 14,
        padding: '16px 40px',
        fontFamily: FONTS.display,
        fontSize,
        lineHeight: 1.02,
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

/* Style @ledevultime: crisp single-line horizontal subtitle with non-breaking spaces */
const SingleLineSubtitle: React.FC<{
  before?: string;
  highlight?: string;
  after?: string;
  fontSize?: number;
}> = ({ before = '', highlight = '', after = '', fontSize = 58 }) => {
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
        letterSpacing: '-0.01em',
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

const FramedMediaCard: React.FC<{
  width: number;
  height?: number;
  children: React.ReactNode;
  bannerText?: string;
  bannerEnterFrame?: number;
  bannerFontSize?: number;
  overlayBannerText?: string;
  overlayBannerEnterFrame?: number;
}> = ({
  width,
  height,
  children,
  bannerText,
  bannerEnterFrame = 0,
  bannerFontSize = 50,
  overlayBannerText,
  overlayBannerEnterFrame = 0,
}) => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width,
    }}
  >
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: COLORS.surface,
        border: '4px solid #171313',
        borderRadius: 18,
        boxShadow: '8px 8px 0px #171313',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>

    {overlayBannerText && (
      <div
        style={{
          position: 'absolute',
          bottom: -30,
          zIndex: 5,
        }}
      >
        <GiantBanner
          text={overlayBannerText}
          enterFrame={overlayBannerEnterFrame}
          fontSize={bannerFontSize}
        />
      </div>
    )}

    {bannerText && (
      <div style={{ marginTop: 30 }}>
        <GiantBanner
          text={bannerText}
          enterFrame={bannerEnterFrame}
          fontSize={bannerFontSize}
        />
      </div>
    )}
  </div>
);

const AvatarBustStage: React.FC<{
  pose: keyof typeof AVATAR_POSES;
  caption: React.ReactNode;
  captionTop?: number;
  avatarWidth?: number;
}> = ({ pose, caption, captionTop = 480, avatarWidth = 840 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = settledProgress(frame, fps, 0);
  const scale = p < 1 ? interpolate(p, [0, 1], [0.95, 1]) : 1;

  return (
    <AbsoluteFill>
      <EditorialCanvas>
        <></>
      </EditorialCanvas>
      <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden', zIndex: 10 }}>
        <div
          style={{
            position: 'absolute',
            top: captionTop,
            left: 44,
            right: 44,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {caption}
        </div>
        <Img
          src={staticFile(AVATAR_POSES[pose])}
          style={{
            position: 'absolute',
            bottom: -16,
            left: '50%',
            width: avatarWidth,
            height: 'auto',
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: 'bottom center',
            zIndex: 15,
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
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const AvatarHeadCenter: React.FC<{
  caption: React.ReactNode;
  headWidth?: number;
}> = ({ caption, headWidth = 460 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = settledProgress(frame, fps, 0);
  const scale = p < 1 ? interpolate(p, [0, 1], [0.92, 1]) : 1;

  return (
    <EditorialCanvas>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
        }}
      >
        {caption}
        <Img
          src={staticFile(AVATAR_POSES.headBadge)}
          style={{
            width: headWidth,
            height: 'auto',
            transform: scale === 1 ? 'none' : `scale(${scale})`,
          }}
        />
      </div>
    </EditorialCanvas>
  );
};

const BrutalStackBar: React.FC<{
  icon: React.ReactNode;
  titleText: string;
  inverted?: boolean;
  mutedStrike?: boolean;
  enterFrame?: number;
  fontSize?: number;
}> = ({
  icon,
  titleText,
  inverted = false,
  mutedStrike = false,
  enterFrame = 0,
  fontSize = 50,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const visible = enterFrame <= 0 || frame >= enterFrame;
  const p = enterFrame > 0 ? settledProgress(frame, fps, enterFrame) : 1;
  const scale = enterFrame > 0 && frame >= enterFrame && p < 1 ? interpolate(p, [0, 1], [0.94, 1]) : 1;

  const bg = inverted ? COLORS.burgundy : mutedStrike ? '#E3DDD1' : COLORS.surface;
  const textColor = inverted ? COLORS.surface : mutedStrike ? '#6A615B' : COLORS.ink;

  return (
    <div
      style={{
        width: 920,
        height: 140,
        backgroundColor: bg,
        border: '4px solid #171313',
        boxShadow: mutedStrike ? '4px 4px 0px #171313' : '8px 8px 0px #171313',
        borderRadius: 16,
        padding: '0 36px',
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        boxSizing: 'border-box',
        transform: scale === 1 ? 'none' : `scale(${scale})`,
        visibility: visible ? 'visible' : 'hidden',
      }}
    >
      {icon}
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize,
          lineHeight: 1.0,
          letterSpacing: '-0.015em',
          color: textColor,
          textTransform: 'uppercase',
          textDecoration: mutedStrike ? 'line-through' : 'none',
          textDecorationThickness: mutedStrike ? 5 : undefined,
        }}
      >
        {titleText}
      </div>
    </div>
  );
};

/* 1. 0.00s -> 2.83s (0..85) */
const Scene1HookAvatar: React.FC = () => {
  const frame = useCurrentFrame();

  let caption: React.ReactNode;
  if (frame < 32) {
    caption = <SingleLineSubtitle before="Si tes" highlight="produits digitaux" />;
  } else if (frame < 60) {
    caption = <SingleLineSubtitle before="générés avec" highlight="l'IA" />;
  } else {
    caption = <SingleLineSubtitle before="ressemblent" highlight="encore" />;
  }

  return <AvatarBustStage pose="hookLeanIn" caption={caption} avatarWidth={840} />;
};

/* 2. 2.83s -> 4.53s (85..136) */
const Scene2Pdf1Portrait: React.FC = () => (
  <EditorialCanvas>
    <FramedMediaCard
      width={840}
      height={1120}
      overlayBannerText="EN 2026"
      overlayBannerEnterFrame={15}
      bannerFontSize={52}
    >
      <Img
        src={staticFile('ep01/pdf1-page1-portrait.png')}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </FramedMediaCard>
  </EditorialCanvas>
);

/* 3. 4.53s -> 5.53s (136..166) */
const Scene3Pdf2Portrait: React.FC = () => (
  <EditorialCanvas>
    <FramedMediaCard width={840} height={1120}>
      <Img
        src={staticFile('ep01/pdf2-page1-portrait.png')}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </FramedMediaCard>
  </EditorialCanvas>
);

/* 4. 5.53s -> 6.63s (166..199) */
const Scene4HeadTease: React.FC = () => {
  const frame = useCurrentFrame();

  const caption =
    frame < 17 ? (
      <SingleLineSubtitle before="alors qu'ils" highlight="pourraient" />
    ) : (
      <SingleLineSubtitle highlight="ressembler..." />
    );

  return <AvatarHeadCenter caption={caption} headWidth={460} />;
};

/* 5. 6.63s -> 7.73s (199..232) */
const Scene5PlatformHome: React.FC = () => (
  <EditorialCanvas>
    <FramedMediaCard
      width={920}
      height={980}
      bannerText="PRODUIT INTERACTIF"
      bannerEnterFrame={3}
      bannerFontSize={50}
    >
      <Img
        src={staticFile('ep01/platform-home-real.png')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top left',
          display: 'block',
        }}
      />
    </FramedMediaCard>
  </EditorialCanvas>
);

/* 6. 7.73s -> 9.50s (232..285) */
const Scene6ReassureAvatar: React.FC = () => {
  const frame = useCurrentFrame();

  const caption =
    frame < 23 ? (
      <SingleLineSubtitle before="tu es" highlight="exactement" />
    ) : (
      <SingleLineSubtitle before="au" highlight="bon endroit." />
    );

  return <AvatarBustStage pose="talkingConfident" caption={caption} avatarWidth={840} />;
};

/* 7. 9.50s -> 12.20s (285..366) */
const Scene7StopWarning: React.FC = () => {
  const frame = useCurrentFrame();

  let caption: React.ReactNode;
  if (frame < 30) {
    caption = <SingleLineSubtitle before="Aujourd'hui," highlight="plus personne" />;
  } else if (frame < 57) {
    caption = <SingleLineSubtitle before="n'a envie" highlight="d'acheter" />;
  } else {
    caption = <SingleLineSubtitle before="un" highlight="PDF" />;
  }

  return <AvatarBustStage pose="stopWarning" caption={caption} avatarWidth={840} />;
};

/* 8. 12.20s -> 13.20s (366..396) */
const Scene8FiftyPagesSlam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = settledProgress(frame, fps, 0);
  const scale = p < 1 ? interpolate(p, [0, 1], [1.08, 1]) : 1;

  return (
    <EditorialCanvas>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          transform: scale === 1 ? 'none' : `scale(${scale})`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 72,
            lineHeight: 1.0,
            color: COLORS.ink,
            textTransform: 'uppercase',
          }}
        >
          UN PDF DE
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 132,
            lineHeight: 0.96,
            color: COLORS.burgundy,
            textTransform: 'uppercase',
            letterSpacing: '-0.025em',
          }}
        >
          50 PAGES
        </div>
      </div>
    </EditorialCanvas>
  );
};

/* 9. 13.20s -> 14.07s (396..422) */
const Scene9FacepalmAiSlop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = settledProgress(frame, fps, 0);
  const shockScale = p < 1 ? interpolate(p, [0, 1], [1.08, 1]) : 1;

  return (
    <AvatarBustStage
      pose="facepalmOops"
      avatarWidth={840}
      caption={
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 92,
            lineHeight: 0.98,
            color: COLORS.burgundy,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            transform: shockScale === 1 ? 'none' : `scale(${shockScale})`,
          }}
        >
          {"QUI PUE L'IA"}
        </div>
      }
    />
  );
};

/* 10. 14.07s -> 18.80s (422..564) */
const Scene10InteractiveVideoDemo: React.FC = () => {
  const frame = useCurrentFrame();

  let topCaption: React.ReactNode;
  if (frame < 35) {
    topCaption = <SingleLineSubtitle before="Les gens veulent" highlight="un outil" fontSize={54} />;
  } else if (frame < 80) {
    topCaption = <SingleLineSubtitle before="original et" highlight="interactif" fontSize={58} />;
  } else if (frame < 103) {
    topCaption = <SingleLineSubtitle before="qu'ils peuvent" highlight="toucher" fontSize={58} />;
  } else {
    topCaption = <SingleLineSubtitle before="et utiliser" highlight="tout de suite" fontSize={58} />;
  }

  return (
    <EditorialCanvas>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 44,
        }}
      >
        {topCaption}
        <FramedMediaCard width={960} height={608}>
          <OffthreadVideo
            src={staticFile('ep01/demo-interactive-clean.mp4')}
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </FramedMediaCard>
      </div>
    </EditorialCanvas>
  );
};

/* 11. 18.80s -> 21.00s (564..630) */
const Scene11ChariowCoverHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = settledProgress(frame, fps, 0);
  const scale = p < 1 ? interpolate(p, [0, 1], [0.95, 1]) : 1;

  return (
    <EditorialCanvas>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 36,
        }}
      >
        <SingleLineSubtitle before="Condensé dans" highlight="un mini-cours" />
        <div style={{ transform: scale === 1 ? 'none' : `scale(${scale})` }}>
          <FramedMediaCard width={820} height={820}>
            <Img
              src={staticFile('ep01/chariow-cover-square-1200x1200.png')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1.08)',
                display: 'block',
              }}
            />
          </FramedMediaCard>
        </div>
      </div>
    </EditorialCanvas>
  );
};

/* 12. 21.00s -> 24.27s (630..728) */
const Scene12MethodBars: React.FC = () => (
  <EditorialCanvas>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28,
      }}
    >
      <BrutalStackBar
        icon={<IdeaBulbIcon size={64} />}
        titleText="1. TON IDÉE"
        enterFrame={15}
        fontSize={52}
      />
      <BrutalStackBar
        icon={<InteractiveCursorIcon size={64} />}
        titleText="2. PRODUIT INTERACTIF"
        enterFrame={48}
        fontSize={48}
      />
      <BrutalStackBar
        icon={<OfficialClaudeLogoSvg size={58} color="#FFFDFC" />}
        titleText="3. AVEC CLAUDE"
        inverted
        enterFrame={70}
        fontSize={52}
      />
    </div>
  </EditorialCanvas>
);

/* 13. 24.27s -> 25.60s (728..768) */
const Scene13NoSubscription: React.FC = () => (
  <EditorialCanvas>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 30,
      }}
    >
      <BrutalStackBar
        mutedStrike
        fontSize={46}
        icon={
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              backgroundColor: COLORS.surface,
              border: '3px solid #6A615B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONTS.display,
              fontSize: 40,
              color: '#6A615B',
              flexShrink: 0,
            }}
          >
            ✕
          </div>
        }
        titleText="ABONNEMENT PAYANT"
      />
      <BrutalStackBar
        inverted
        enterFrame={2}
        fontSize={50}
        icon={<OfficialClaudeLogoSvg size={50} color="#FFFDFC" />}
        titleText="CLAUDE GRATUIT ✓"
      />
    </div>
  </EditorialCanvas>
);

/* 14. 25.60s -> 27.27s (768..818) */
const Scene14NoCodeLaptop: React.FC = () => {
  const frame = useCurrentFrame();
  const revealCoder = frame >= 12;

  return (
    <AvatarBustStage
      pose="workingLaptop"
      avatarWidth={840}
      caption={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.sans,
              fontWeight: 800,
              fontSize: revealCoder ? 56 : 64,
              lineHeight: 1.08,
              color: COLORS.ink,
            }}
          >
            et même
          </div>
          {revealCoder && (
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 92,
                lineHeight: 0.96,
                color: COLORS.burgundy,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
              }}
            >
              SANS SAVOIR CODER
            </div>
          )}
        </div>
      }
    />
  );
};

/* 15. 27.27s -> 30.87s (818..926) */
const Scene15ManyChatCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const keyword = 'CLAUDE';
  const typedCount = Math.floor(
    interpolate(frame, [28, 48], [0, keyword.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const shownText = keyword.slice(0, typedCount);

  const cursorX = interpolate(frame, [42, 50], [180, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorY = interpolate(frame, [42, 50], [110, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const clickDip = frame >= 50 && frame < 56 ? 0.86 : 1;

  const replyVisible = frame >= 64;
  const replyP = replyVisible ? settledProgress(frame, fps, 64) : 1;
  const replyScale = replyVisible && replyP < 1 ? interpolate(replyP, [0, 1], [0.94, 1]) : 1;

  return (
    <EditorialCanvas>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 34,
          width: 920,
        }}
      >
        <GiantBanner text="ABONNE-TOI & COMMENTE" fontSize={44} />

        <div
          style={{
            position: 'relative',
            width: 920,
            backgroundColor: COLORS.surface,
            border: '4px solid #171313',
            boxShadow: '8px 8px 0px #171313',
            borderRadius: 18,
            padding: '28px 34px',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            boxSizing: 'border-box',
          }}
        >
          <ProfileIcon size={62} />
          <div
            style={{
              flex: 1,
              textAlign: 'left',
              fontFamily: FONTS.display,
              fontSize: 58,
              lineHeight: 1.0,
              color: COLORS.ink,
              minHeight: 60,
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
              border: '3px solid #171313',
              boxShadow: SHADOWS.brutalSm,
              borderRadius: 12,
              padding: '14px 26px',
              fontFamily: FONTS.sans,
              fontWeight: 800,
              fontSize: 28,
              textTransform: 'uppercase',
            }}
          >
            ENVOYER
          </div>

          {frame >= 40 && frame < 62 && (
            <div
              style={{
                position: 'absolute',
                right: 76,
                bottom: -24,
                transform: `translate(${cursorX}px, ${cursorY}px) scale(${clickDip})`,
                pointerEvents: 'none',
              }}
            >
              <MouseCursorSvg size={72} />
            </div>
          )}
        </div>

        <div
          style={{
            width: 920,
            backgroundColor: COLORS.surface,
            border: '4px solid #171313',
            boxShadow: '8px 8px 0px #171313',
            borderRadius: 18,
            padding: '26px 34px',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            boxSizing: 'border-box',
            visibility: replyVisible ? 'visible' : 'hidden',
            transform: replyScale === 1 ? 'none' : `scale(${replyScale})`,
          }}
        >
          <Img
            src={staticFile('avatar/mini.png')}
            style={{
              width: 92,
              height: 92,
              borderRadius: 16,
              border: '3px solid #171313',
              backgroundColor: COLORS.sand,
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontFamily: FONTS.sans,
              fontWeight: 800,
              fontSize: 34,
              lineHeight: 1.24,
              color: COLORS.ink,
              textAlign: 'left',
            }}
          >
            {"Je t'envoie le lien du Mini-Cours en DM"}
          </div>
        </div>
      </div>
    </EditorialCanvas>
  );
};

export const Ep01Composition: React.FC = () => (
  <AbsoluteFill>
    <Audio src={staticFile('ep01/voix_ep01.wav')} />

    <SfxCue name="pop" atFrame={85} volume={0.44} />
    <SfxCue name="stamp" atFrame={100} volume={0.5} />
    <SfxCue name="whoosh" atFrame={136} volume={0.44} />
    <SfxCue name="click" atFrame={142} volume={0.42} />
    <SfxCue name="pop" atFrame={199} volume={0.45} />
    <SfxCue name="chime_success" atFrame={204} volume={0.5} />
    <SfxCue name="pop" atFrame={232} volume={0.42} />
    <SfxCue name="stamp" atFrame={368} volume={0.52} />
    <SfxCue name="error_buzz" atFrame={398} volume={0.46} />
    <SfxCue name="pop" atFrame={422} volume={0.44} />
    <SfxCue name="click" atFrame={507} volume={0.46} />
    <SfxCue name="chime_success" atFrame={525} volume={0.54} />
    <SfxCue name="pop" atFrame={564} volume={0.44} />
    <SfxCue name="click" atFrame={645} volume={0.45} />
    <SfxCue name="click" atFrame={678} volume={0.45} />
    <SfxCue name="pop" atFrame={700} volume={0.48} />
    <SfxCue name="click" atFrame={730} volume={0.46} />
    <SfxCue name="pop" atFrame={780} volume={0.48} />
    <SfxCue name="whoosh" atFrame={818} volume={0.4} />
    <SfxCue name="click" atFrame={868} volume={0.48} />
    <SfxCue name="chime_success" atFrame={882} volume={0.52} />

    <Sequence from={0} durationInFrames={85}>
      <Scene1HookAvatar />
    </Sequence>
    <Sequence from={85} durationInFrames={51}>
      <Scene2Pdf1Portrait />
    </Sequence>
    <Sequence from={136} durationInFrames={30}>
      <Scene3Pdf2Portrait />
    </Sequence>
    <Sequence from={166} durationInFrames={33}>
      <Scene4HeadTease />
    </Sequence>
    <Sequence from={199} durationInFrames={33}>
      <Scene5PlatformHome />
    </Sequence>
    <Sequence from={232} durationInFrames={53}>
      <Scene6ReassureAvatar />
    </Sequence>
    <Sequence from={285} durationInFrames={81}>
      <Scene7StopWarning />
    </Sequence>
    <Sequence from={366} durationInFrames={30}>
      <Scene8FiftyPagesSlam />
    </Sequence>
    <Sequence from={396} durationInFrames={26}>
      <Scene9FacepalmAiSlop />
    </Sequence>
    <Sequence from={422} durationInFrames={142}>
      <Scene10InteractiveVideoDemo />
    </Sequence>
    <Sequence from={564} durationInFrames={66}>
      <Scene11ChariowCoverHero />
    </Sequence>
    <Sequence from={630} durationInFrames={98}>
      <Scene12MethodBars />
    </Sequence>
    <Sequence from={728} durationInFrames={40}>
      <Scene13NoSubscription />
    </Sequence>
    <Sequence from={768} durationInFrames={50}>
      <Scene14NoCodeLaptop />
    </Sequence>
    <Sequence from={818} durationInFrames={108}>
      <Scene15ManyChatCta />
    </Sequence>
  </AbsoluteFill>
);
