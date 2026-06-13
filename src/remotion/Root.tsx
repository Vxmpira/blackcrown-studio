import React from "react";
import { Composition } from "remotion";
import { BlackCrownAd } from "./BlackCrownAd";
import { ads, adDuration } from "./data";
import { FPS, W, H } from "./brand";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Generic composition. It renders ANY ad handed to it as inputProps,
          and computes its own length from that ad. This is what the studio
          renders through, so newly generated ads work with no redeploy. */}
      <Composition
        id="ad"
        component={BlackCrownAd}
        durationInFrames={adDuration(ads[0])}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ ad: ads[0] }}
        calculateMetadata={({ props }) => ({
          durationInFrames: adDuration(props.ad),
        })}
      />

      {/* Starter ads, still registered by name for reference. */}
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
