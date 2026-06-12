import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { BRAND } from "../brand";

const CROWN = "M4 24 L4 9 L12 16 L18 5 L24 16 L32 9 L32 24 Z";

export const Crown: React.FC<{
  size?: number;
  trace?: boolean;
  glow?: boolean;
  loopFrames?: number;
}> = ({ size = 240, trace = true, glow = true, loopFrames = 90 }) => {
  const frame = useCurrentFrame();
  const offset = interpolate(frame % loopFrames, [0, loopFrames], [128, 0]);

  return (
    <svg
      width={size}
      height={(size * 30) / 36}
      viewBox="0 0 36 30"
      fill="none"
      style={{
        filter: glow ? "drop-shadow(0 0 6px rgba(255,45,149,.55))" : undefined,
      }}
    >
      <path
        d={CROWN}
        stroke={BRAND.pink}
        strokeWidth={0.55}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.18}
      />
      <line
        x1="7"
        y1="28"
        x2="29"
        y2="28"
        stroke={BRAND.pink}
        strokeWidth={0.55}
        strokeLinecap="round"
        opacity={0.18}
      />
      {trace && (
        <path
          d={CROWN}
          stroke={BRAND.pink}
          strokeWidth={0.7}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="8 120"
          strokeDashoffset={offset}
        />
      )}
    </svg>
  );
};
