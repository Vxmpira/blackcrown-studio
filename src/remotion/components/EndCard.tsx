import React from "react";
import { AbsoluteFill } from "remotion";
import { BRAND } from "../brand";
import { display, mono } from "../fonts";
import { Crown } from "./Crown";
import { Reveal } from "./SceneCard";

export const EndCard: React.FC<{ cta: string }> = ({ cta }) => {
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <Reveal>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30,
          }}
        >
          <Crown size={300} trace glow />
          <div
            style={{
              fontFamily: display,
              fontWeight: 700,
              fontSize: 86,
              color: BRAND.white,
              textShadow: BRAND.logoGlow,
              letterSpacing: "0.02em",
            }}
          >
            BlackCrown
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 30,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: BRAND.mute,
            }}
          >
            Claim your crown
          </div>
          <div
            style={{
              marginTop: 26,
              fontFamily: mono,
              fontSize: 30,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0A0008",
              background: BRAND.pink,
              padding: "20px 42px",
              borderRadius: 14,
              boxShadow: BRAND.glowPink,
            }}
          >
            {cta}
          </div>
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};
