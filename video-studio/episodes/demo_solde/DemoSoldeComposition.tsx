import React from 'react';
import cuesManifest from '../../assets/demos/demo-cues.json';
import { DemoStage, type MouseSample } from '../../engine/components/DemoStage';

interface RawDesktopClip {
  video: string;
  width: number;
  height: number;
  durationMs: number;
  frames: number;
  mouseTrack?: MouseSample[];
}

const clip = (cuesManifest.clips as Record<string, RawDesktopClip>).soldeDesktop;

export const DEMO_SOLDE_16X9_FRAMES = clip?.frames ?? 645;

export const DemoSoldeComposition: React.FC = () => {
  const filename = clip?.video.split('/').pop() ?? 'raw-solde-desktop.mp4';
  const track = clip?.mouseTrack ?? [];

  return <DemoStage videoSrc={`demos/${filename}`} mouseTrack={track} />;
};
