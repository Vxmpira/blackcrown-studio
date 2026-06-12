// BlackCrown brand system, mirrored exactly from blackcrownvxj.com

export const BRAND = {
  vanta: "#000000",
  ink2: "#060608",
  ink3: "#0A0A0D",
  white: "#FFFFFF",
  bone: "#E8E8EF",
  mute: "#85838F",
  pink: "#FF2D95",
  pinkSoft: "#FF6FB6",
  pinkDeep: "#C81E73",
  line: "rgba(255,45,149,0.20)",
  glowPink: "0 0 6px rgba(255,45,149,.36), 0 0 18px rgba(255,45,149,.16)",
  glowWhite: "0 0 8px rgba(255,255,255,.24)",
  logoGlow: "0 0 11px rgba(255,255,255,.38)",
} as const;

// Vertical 9:16 at 1080x1920, 30fps
export const FPS = 30;
export const W = 1080;
export const H = 1920;

// How long the closing brand card holds (frames)
export const END_FRAMES = 66;

// Film-grain texture, same source used on the site
export const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
