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

const clip = (cuesManifest.clips as Record<string, RawDesktopClip>).miniCoursDesktop;

export const DEMO_MINI_COURS_16X9_FRAMES = clip?.frames ?? 645;

export const DemoMiniCoursComposition: React.FC = () => {
  const filename = clip?.video.split('/').pop() ?? 'raw-mini-cours-desktop.mp4';
  const track = clip?.mouseTrack ?? [];

  return <DemoStage videoSrc={`demos/${filename}`} mouseTrack={track} />;
};
