import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// The Eclipse-X Arcade is a Discord Activity, built as its own page with
// relative asset paths so it loads both at /activity/ on the admin domain and
// through Discord's proxy, where the URL mapping roots it at /activity.
export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, "activity"),
  base: "./",
  build: {
    outDir: resolve(__dirname, "dist/activity"),
    emptyOutDir: true,
  },
});
