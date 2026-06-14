import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND } from "../brand";
import { display, mono } from "../fonts";
import type { Scene } from "../data";

export const Reveal: React.FC<{
  delay?: number;
  children: React.ReactNode;
}> = ({ delay = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Higher mass + gentle stiffness = a slower, smoother glide in (no snap).
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, mass: 1.6, stiffness: 90 },
  });
  const opacity = interpolate(s, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(s, [0, 1], [42, 0]);
  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>
  );
};

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Reveal>
    <div
      style={{
        fontFamily: mono,
        fontSize: 30,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: BRAND.pink,
        textShadow: BRAND.glowPink,
        marginBottom: 30,
      }}
    >
      {children}
    </div>
  </Reveal>
);

export const SceneCard: React.FC<{
  scene: Scene;
  durationInFrames: number;
}> = ({ scene, durationInFrames }) => {
  const frame = useCurrentFrame();
  // Ease the whole card out over the last ~18 frames so the cut to the next
  // scene reads as a soft cross-dissolve instead of a hard blink.
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames - 3],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 80px",
        opacity: fadeOut,
      }}
    >
      <div style={{ width: "100%" }}>
        {scene.eyebrow ? <Eyebrow>{scene.eyebrow}</Eyebrow> : null}
        {scene.lines.map((line, li) => (
          <Reveal key={li} delay={(scene.eyebrow ? 10 : 0) + li * 9}>
            <div
              style={{
                fontFamily: display,
                fontWeight: 700,
                fontSize: 92,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
                marginBottom: 6,
              }}
            >
              {line.map((seg, si) => (
                <span
                  key={si}
                  style={{
                    color: seg.accent ? BRAND.pink : BRAND.white,
                    textShadow: seg.accent ? BRAND.glowPink : BRAND.glowWhite,
                  }}
                >
                  {seg.t}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </AbsoluteFill>
  );
};
