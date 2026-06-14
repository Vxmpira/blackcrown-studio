import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { BrandBackground } from "./components/BrandBackground";
import { SceneCard } from "./components/SceneCard";
import { EndCard } from "./components/EndCard";
import { END_FRAMES } from "./brand";
import { body } from "./fonts";
import { sceneFrames } from "./data";
import type { Ad } from "./data";

export const BlackCrownAd: React.FC<{ ad: Ad }> = ({ ad }) => {
  // cumulative start frame for each scene, using paced durations
  let cursor = 0;
  const placed = ad.scenes.map((scene, i) => {
    const dur = sceneFrames(scene);
    const from = cursor;
    cursor += dur;
    return (
      <Sequence key={i} from={from} durationInFrames={dur}>
        <SceneCard scene={scene} durationInFrames={dur} />
      </Sequence>
    );
  });

  return (
    <AbsoluteFill style={{ fontFamily: body }}>
      <BrandBackground />
      {placed}
      <Sequence from={cursor} durationInFrames={END_FRAMES}>
        <EndCard cta={ad.cta ?? "blackcrownvxj.com"} />
      </Sequence>
    </AbsoluteFill>
  );
};
