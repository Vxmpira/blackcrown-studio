import React from "react";
import { Composition } from "remotion";
import { BlackCrownAd } from "./BlackCrownAd";
import { ads, adDuration } from "./data";
import { FPS, W, H } from "./brand";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {ads.map((ad) => (
        <Composition
          key={ad.id}
          id={ad.id}
          component={BlackCrownAd}
          durationInFrames={adDuration(ad)}
          fps={FPS}
          width={W}
          height={H}
          defaultProps={{ ad }}
        />
      ))}
    </>
  );
};
