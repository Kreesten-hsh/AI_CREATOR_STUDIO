import React from 'react';
import { Composition } from 'remotion';
import { VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH, ensureStudioFontsLoaded } from './theme';
import { ShowcaseComposition } from '../episodes/template-showcase/ShowcaseComposition';
import { Ep01Composition } from '../episodes/ep01_produits_interactifs/Ep01Composition';
import { EP02_DURATION_FRAMES, Ep02Composition } from '../episodes/ep02_bonnes_instructions/Ep02Composition';
import {
  DEMO_MINI_COURS_16X9_FRAMES,
  DemoMiniCoursComposition,
} from '../episodes/demo_mini_cours/DemoMiniCoursComposition';
import {
  DEMO_SOLDE_16X9_FRAMES,
  DemoSoldeComposition,
} from '../episodes/demo_solde/DemoSoldeComposition';

export const RemotionRoot: React.FC = () => {
  ensureStudioFontsLoaded();

  return (
    <>
      <Composition
        id="Showcase9x16"
        component={ShowcaseComposition}
        durationInFrames={720}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="Ep01ProduitsInteractifs"
        component={Ep01Composition}
        durationInFrames={926}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="Ep02BonnesInstructions"
        component={Ep02Composition}
        durationInFrames={EP02_DURATION_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="DemoMiniCours16x9"
        component={DemoMiniCoursComposition}
        durationInFrames={DEMO_MINI_COURS_16X9_FRAMES}
        fps={VIDEO_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="DemoSolde16x9"
        component={DemoSoldeComposition}
        durationInFrames={DEMO_SOLDE_16X9_FRAMES}
        fps={VIDEO_FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
