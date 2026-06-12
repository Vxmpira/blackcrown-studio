import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadBody } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

// Same three faces as the website: Space Grotesk (display),
// Manrope (body), JetBrains Mono (labels/data).
export const display = loadDisplay().fontFamily;
export const body = loadBody().fontFamily;
export const mono = loadMono().fontFamily;
