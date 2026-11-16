import React from 'react';
import { Composition } from 'remotion';
import { VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH, ensureStudioFontsLoaded } from './theme';
import { ShowcaseComposition } from '../episodes/template-showcase/ShowcaseComposition';
import { Ep01Composition } from '../episodes/ep01_produits_interactifs/Ep01Composition';

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
    </>
  );
};
