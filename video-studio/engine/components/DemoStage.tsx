import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface MouseSample {
  tMs: number;
  frame: number;
  nx: number;
  ny: number;
  zoom: number;
}

export interface DemoStageProps {
  videoSrc: string;
  mouseTrack: readonly MouseSample[];
}

interface CameraState {
  scale: number;
  focusX: number;
  focusY: number;
}

/**
 * Calcule une trajectoire caméra continue et amortie (ressort critique)
 * qui suit la souris en temps réel sur toute la durée de la vidéo, sans à-coups.
 */
function buildSmoothCameraTrack(
  mouseTrack: readonly MouseSample[],
  totalFrames: number,
  fps: number
): CameraState[] {
  if (totalFrames <= 0) return [];
  if (mouseTrack.length === 0) {
    return Array.from({ length: totalFrames }, () => ({
      scale: 1,
      focusX: 0.5,
      focusY: 0.5,
    }));
  }

  /* 1. Ré-échantillonnage linéaire exact par frame */
  const targets: CameraState[] = new Array(totalFrames);
  let idx = 0;

  for (let f = 0; f < totalFrames; f++) {
    const tMs = (f / fps) * 1000;
    while (idx + 1 < mouseTrack.length && mouseTrack[idx + 1].tMs <= tMs) {
      idx++;
    }
    const curr = mouseTrack[idx];
    const next = mouseTrack[Math.min(idx + 1, mouseTrack.length - 1)];
    if (curr === next || next.tMs <= curr.tMs) {
      targets[f] = { scale: curr.zoom, focusX: curr.nx, focusY: curr.ny };
    } else {
      const ratio = Math.min(1, Math.max(0, (tMs - curr.tMs) / (next.tMs - curr.tMs)));
      targets[f] = {
        scale: curr.zoom + (next.zoom - curr.zoom) * ratio,
        focusX: curr.nx + (next.nx - curr.nx) * ratio,
        focusY: curr.ny + (next.ny - curr.ny) * ratio,
      };
    }
  }

  /* 2. Intégration ressort critique (suivi organique naturel sur la souris) */
  const dt = 1 / fps;
  const omegaPos = 5.4;
  const omegaZoom = 3.6;

  let fx = targets[0].focusX;
  let fy = targets[0].focusY;
  let sc = targets[0].scale;
  let vfx = 0;
  let vfy = 0;
  let vsc = 0;

  const smoothed: CameraState[] = new Array(totalFrames);

  for (let f = 0; f < totalFrames; f++) {
    const t = targets[f];

    /* Critically damped spring step: a = w^2 * (target - x) - 2*w*v */
    const afx = omegaPos * omegaPos * (t.focusX - fx) - 2 * omegaPos * vfx;
    const afy = omegaPos * omegaPos * (t.focusY - fy) - 2 * omegaPos * vfy;
    const asc = omegaZoom * omegaZoom * (t.scale - sc) - 2 * omegaZoom * vsc;

    vfx += afx * dt;
    vfy += afy * dt;
    vsc += asc * dt;

    fx += vfx * dt;
    fy += vfy * dt;
    sc += vsc * dt;

    smoothed[f] = {
      scale: Math.max(1, sc),
      focusX: Math.min(1, Math.max(0, fx)),
      focusY: Math.min(1, Math.max(0, fy)),
    };
  }

  return smoothed;
}

/**
 * Mise en scène 100 % plein écran 1920x1080, silencieuse, sans cadre,
 * sans bordure et sans texte superposé : uniquement la vidéo avec suivi caméra souris.
 */
export const DemoStage: React.FC<DemoStageProps> = ({ videoSrc, mouseTrack }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();

  const cameraTrack = useMemo(
    () => buildSmoothCameraTrack(mouseTrack, durationInFrames, fps),
    [mouseTrack, durationInFrames, fps]
  );

  const cam = cameraTrack[Math.min(frame, cameraTrack.length - 1)] ?? {
    scale: 1,
    focusX: 0.5,
    focusY: 0.5,
  };

  /* Clamp strict pour rester 100 % plein écran bord à bord (zéro marge/fond visible) */
  const rawTx = width * (0.5 - cam.focusX * cam.scale);
  const rawTy = height * (0.5 - cam.focusY * cam.scale);
  const tx = Math.min(0, Math.max(-width * (cam.scale - 1), rawTx));
  const ty = Math.min(0, Math.max(-height * (cam.scale - 1), rawTy));

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
      <div
        style={{
          width,
          height,
          transformOrigin: '0 0',
          transform: `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${cam.scale.toFixed(4)})`,
          willChange: 'transform',
        }}
      >
        <OffthreadVideo
          src={staticFile(videoSrc)}
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
