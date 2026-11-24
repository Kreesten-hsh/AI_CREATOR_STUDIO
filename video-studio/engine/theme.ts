import { continueRender, delayRender, staticFile } from 'remotion';

export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;

export type VisualStyleVariant = 'editorial' | 'brutalist';

/** Direction artistique par défaut sur toutes les nouvelles productions organiques. */
export const DEFAULT_VISUAL_STYLE: VisualStyleVariant = 'editorial';

/* Palette verrouillée Studio Lin : Beige Lin + Ivoire + Noir Encre + Bordeaux */
export const COLORS = {
  sand: '#EAE3D5',
  cream: '#FAF6F0',
  surface: '#FFFDFC',
  windowHeader: '#EAE3D5',
  burgundy: '#B63131',
  darkRed: '#922626',
  dustyPink: '#E6A0A8',
  palePink: '#F7E0E2',
  ink: '#171313',
  muted: '#5C544D',
  staleGray: '#E3DDD1',
} as const;

/** Tokens éditoriaux sobres par défaut (zéro bordure épaisse, zéro ombre dure décalée). */
export const EDITORIAL = {
  borderWidth: 1,
  borderColor: 'rgba(23, 19, 19, 0.14)',
  borderStrong: 'rgba(23, 19, 19, 0.28)',
  radius: 16,
  shadow: 'none',
  accentBandHeight: 14,
} as const;

/**
 * @deprecated Tokens néo-brutalistes conservés uniquement pour compatibilité
 * avec les épisodes archivés (EP01, EP02, template-showcase) ou demande explicite.
 */
export const BORDER_WIDTH = 3.5;

/* Symmetrical canvas framing respecting vertical UI zones */
export const SAFE_ZONES = {
  top: 180,
  bottom: 360,
  side: 100,
  width: 880,
  height: 1380,
} as const;

/**
 * @deprecated Ombres dures décalées réservées aux archives (EP01, EP02)
 * ou à une variante explicitement demandée. Utiliser `EDITORIAL.shadow` par défaut.
 */
export const SHADOWS = {
  brutal: `6px 6px 0px ${COLORS.ink}`,
  brutalSm: `5px 5px 0px ${COLORS.ink}`,
} as const;

export const FONTS = {
  display: '"Archivo Black", Impact, sans-serif',
  serif: '"Instrument Serif", Georgia, serif',
  sans: '"Plus Jakarta Sans", system-ui, sans-serif',
  mono: '"JetBrains Mono", monospace',
  hand: '"Caveat", cursive',
} as const;

export const AVATAR_POSES = {
  hookLeanIn: 'avatar/01_hook_lean_in.png',
  talkingConfident: 'avatar/02_talking_confident.png',
  thinkingChin: 'avatar/03_thinking_chin.png',
  stopWarning: 'avatar/04_stop_warning.png',
  eurekaSnap: 'avatar/05_eureka_snap.png',
  workingTablet: 'avatar/06_working_tablet.png',
  facepalmOops: 'avatar/07_facepalm_oops.png',
  amazedWow: 'avatar/08_amazed_wow.png',
  armsCrossed: 'avatar/09_relaxed_arms_crossed.png',
  headBadge: 'avatar/10_head_badge.png',
  workingLaptop: 'avatar/11_working_laptop.png',
} as const;

export type AvatarPoseKey = keyof typeof AVATAR_POSES;

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  highlight?: boolean;
}

let fontsLoaded = false;

export const ensureStudioFontsLoaded = (): void => {
  if (fontsLoaded || typeof document === 'undefined' || typeof FontFace === 'undefined') {
    return;
  }
  fontsLoaded = true;
  const handle = delayRender('Loading AI CREATOR Studio fonts');

  const specs: Array<[string, string, FontFaceDescriptors]> = [
    ['Archivo Black', 'fonts/ArchivoBlack-latin.woff2', { weight: '900', style: 'normal' }],
    ['Instrument Serif', 'fonts/InstrumentSerif-Regular.ttf', { weight: '400', style: 'normal' }],
    ['Instrument Serif', 'fonts/InstrumentSerif-Italic.ttf', { weight: '400', style: 'italic' }],
    ['Plus Jakarta Sans', 'fonts/PlusJakartaSans-latin.woff2', { weight: '400 800', style: 'normal' }],
    ['Plus Jakarta Sans', 'fonts/PlusJakartaSans-latin-ext.woff2', { weight: '400 800', style: 'normal' }],
    ['JetBrains Mono', 'fonts/JetBrainsMono-Regular.ttf', { weight: '400', style: 'normal' }],
    ['JetBrains Mono', 'fonts/JetBrainsMono-Bold.ttf', { weight: '700', style: 'normal' }],
    ['Caveat', 'fonts/Caveat-700-latin.woff2', { weight: '700', style: 'normal' }],
    ['Caveat', 'fonts/Caveat-700-latin-ext.woff2', { weight: '700', style: 'normal' }],
  ];

  Promise.all(
    specs.map(async ([family, file, descriptors]) => {
      const face = new FontFace(family, `url(${staticFile(file)})`, descriptors);
      await face.load();
      document.fonts.add(face);
    })
  )
    .catch((err) => {
      console.error('Font preload error:', err);
    })
    .finally(() => {
      continueRender(handle);
    });
};
