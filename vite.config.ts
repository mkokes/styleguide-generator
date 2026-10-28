/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { manifest } from "./pwa-manifest.ts";

export default defineConfig({
  // Served from https://mkokes.github.io/styleguide-generator/
  base: "/styleguide-generator/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest,
      workbox: {
        // The Google Fonts snapshot chunk is ~140 KB; precache it for offline use.
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    // antd-heavy wizard tests are slow under parallel coverage runs.
    testTimeout: 30000,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/setupTests.ts",
        "src/test/**",
        "src/**/*.test.{ts,tsx}",
        "src/vite-env.d.ts",
      ],
      thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 },
    },
  },
});
