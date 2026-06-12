import React from "react";
import { AbsoluteFill } from "remotion";
import { BRAND, GRAIN } from "../brand";

export const BrandBackground: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.vanta }}>
      {/* ambient pink aura */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(55% 38% at 50% 34%, rgba(255,45,149,0.16), transparent 70%)",
        }}
      />
      {/* faint market grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,45,149,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,149,0.055) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          opacity: 0.6,
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      {/* film grain */}
      <AbsoluteFill
        style={{
          backgroundImage: GRAIN,
          opacity: 0.05,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
