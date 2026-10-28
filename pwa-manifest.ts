import type { ManifestOptions } from "vite-plugin-pwa";

export const manifest: Partial<ManifestOptions> = {
  id: "./",
  start_url: "./",
  name: "Styleguide Generator",
  short_name: "Styleguide",
  description: "Build an agent-ready brand styleguide and design tokens, step by step.",
  categories: ["design", "developer", "productivity"],
  theme_color: "#6D4AFF",
  background_color: "#F7F6FB",
  display: "standalone",
  orientation: "any",
  icons: [{ src: "favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
};
