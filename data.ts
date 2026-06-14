import { END_FRAMES } from "./brand";

// ===========================================================================
// THIS IS THE ONLY FILE YOU EDIT TO MAKE NEW ADS.
// Each ad is a list of scenes. Each scene is one on-screen card.
// A line is an array of segments; set accent:true to make a word neon pink.
// durationInFrames is at 30fps, so 30 = 1 second.
// After adding an ad, it shows up automatically in the studio and renders.
// ===========================================================================

export type Segment = { t: string; accent?: boolean };
export type Scene = {
  eyebrow?: string;
  lines: Segment[][];
  durationInFrames: number;
};
export type Ad = {
  id: string; // becomes the filename: out/<id>.mp4
  scenes: Scene[];
  cta?: string; // closing pill, defaults to the site
  caption: string; // copy for the post itself (not rendered)
  hashtags: string[];
  generated?: boolean; // true if written by the AI generator
};

// Global pacing control. 1 = original speed. Higher = slower, calmer scenes.
// Every scene's on-screen hold is multiplied by this, so one number tunes the
// whole studio (preview, registered ads, and Lambda renders all read from it).
export const PACE = 1.5;

// Effective on-screen frames for a scene, after pacing.
export const sceneFrames = (s: Scene): number =>
  Math.round(s.durationInFrames * PACE);

export const adDuration = (ad: Ad): number =>
  ad.scenes.reduce((sum, s) => sum + sceneFrames(s), 0) + END_FRAMES;

export const ads: Ad[] = [
  {
    id: "ethos-built",
    scenes: [
      {
        eyebrow: "What we stand for",
        lines: [[{ t: "Nobody hands you" }], [{ t: "the edge.", accent: true }]],
        durationInFrames: 56,
      },
      {
        lines: [[{ t: "Not the market." }], [{ t: "Not luck." }]],
        durationInFrames: 50,
      },
      {
        lines: [[{ t: "You " }, { t: "build", accent: true }, { t: " it." }]],
        durationInFrames: 56,
      },
    ],
    cta: "blackcrownvxj.com",
    caption:
      "A crown isn't handed down. It's built. We make tools for operators who'd rather own the outcome than wait on it. Link in bio.",
    hashtags: [
      "#buildinpublic",
      "#indiehacker",
      "#tradingtools",
      "#founders",
      "#BlackCrown",
    ],
  },
  {
    id: "three-tools",
    scenes: [
      {
        eyebrow: "One house",
        lines: [
          [{ t: "Three tools for" }],
          [{ t: "independent operators.", accent: true }],
        ],
        durationInFrames: 60,
      },
      {
        eyebrow: "Korvus",
        lines: [
          [{ t: "Real-time" }],
          [{ t: "market intel.", accent: true }],
        ],
        durationInFrames: 54,
      },
      {
        eyebrow: "Intelligence",
        lines: [
          [{ t: "A personal AI tuned" }],
          [{ t: "to how you think.", accent: true }],
        ],
        durationInFrames: 54,
      },
      {
        eyebrow: "The Collective",
        lines: [
          [{ t: "A private network" }],
          [{ t: "for builders.", accent: true }],
        ],
        durationInFrames: 54,
      },
    ],
    cta: "blackcrownvxj.com",
    caption:
      "BlackCrown is one house for independent operators: market intelligence, a personal AI, and a private network. Built for the trader watching the open and the founder shipping after hours. Link in bio.",
    hashtags: [
      "#trading",
      "#AItools",
      "#startup",
      "#solopreneur",
      "#BlackCrown",
    ],
  },
  {
    id: "the-room",
    scenes: [
      {
        eyebrow: "The Collective",
        lines: [[{ t: "Most people" }], [{ t: "build alone." }]],
        durationInFrames: 50,
      },
      {
        lines: [[{ t: "Then they " }, { t: "burn out", accent: true }, { t: "." }]],
        durationInFrames: 50,
      },
      {
        lines: [
          [{ t: "Share the wins." }],
          [{ t: "Pressure-test the ideas." }],
        ],
        durationInFrames: 56,
      },
      {
        lines: [[{ t: "The door is open." }], [{ t: "For now.", accent: true }]],
        durationInFrames: 56,
      },
    ],
    cta: "Join the Collective",
    caption:
      "You don't have to build alone. The Collective is where independent operators trade ideas and move faster. Come in. Link in bio.",
    hashtags: [
      "#community",
      "#traders",
      "#buildinpublic",
      "#discord",
      "#BlackCrown",
    ],
  },
];
