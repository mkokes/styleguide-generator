import { MONO_FALLBACK, SANS_FALLBACK, SERIF_FALLBACK, defaultGuide } from "./defaults";
import type { FontFamily, Guide } from "./types";

export interface Preset {
  key: string;
  label: string;
  description: string;
  apply: (g: Guide) => Guide;
}

const sans = (name: string, weights: number[]): FontFamily => ({
  name,
  source: "google",
  weights,
  fallback: SANS_FALLBACK,
});
const serif = (name: string, weights: number[]): FontFamily => ({
  name,
  source: "google",
  weights,
  fallback: SERIF_FALLBACK,
});
const mono = (name: string): FontFamily => ({
  name,
  source: "google",
  weights: [400],
  fallback: MONO_FALLBACK,
});

export const PRESETS: Preset[] = [
  {
    key: "corporate",
    label: "Corporate",
    description: "Trustworthy and clear. IBM Plex, deep blue, tight radii.",
    apply: (g) => ({
      ...g,
      basics: {
        ...g.basics,
        personality: ["Trustworthy", "Clear", "Professional"],
        voice: "Clear, confident and professional. Lead with the benefit and keep sentences short.",
        writingDo: ["Use plain language and active voice", "Lead with what the reader gets"],
        writingDont: ["Use jargon or buzzwords", "Use exclamation marks"],
      },
      colors: {
        ...g.colors,
        base: {
          ...g.colors.base,
          primary: "#1D4ED8",
          secondary: "#0F766E",
          accent: "#F59E0B",
          neutral: "#64748B",
        },
      },
      typography: {
        ...g.typography,
        heading: sans("IBM Plex Sans", [600, 700]),
        body: sans("IBM Plex Sans", [400, 500]),
        mono: mono("IBM Plex Mono"),
        ratio: 1.2,
      },
      layout: { ...g.layout, radius: { none: 0, sm: 2, md: 4, lg: 8, xl: 12, full: 9999 } },
      rules: {
        ...g.rules,
        color: { do: ["Keep layouts mostly neutral; let primary mark actions"], dont: [] },
      },
    }),
  },
  {
    key: "playful",
    label: "Playful",
    description: "Friendly and energetic. Rounded type, violet and pink, soft corners.",
    apply: (g) => ({
      ...g,
      basics: {
        ...g.basics,
        personality: ["Friendly", "Energetic", "Optimistic"],
        voice:
          "Warm and upbeat, like a helpful friend. Short sentences, a little humor, never at the user's expense.",
        writingDo: ["Use contractions and second person", "Celebrate the user's progress"],
        writingDont: ["Make jokes in error messages", "Use sarcasm"],
      },
      colors: {
        ...g.colors,
        base: {
          ...g.colors.base,
          primary: "#7C3AED",
          secondary: "#EC4899",
          accent: "#FACC15",
          neutral: "#78716C",
        },
      },
      typography: {
        ...g.typography,
        heading: sans("Fredoka", [600, 700]),
        body: sans("Nunito", [400, 600]),
        mono: mono("JetBrains Mono"),
        ratio: 1.333,
      },
      layout: {
        ...g.layout,
        radius: { none: 0, sm: 8, md: 12, lg: 20, xl: 28, full: 9999 },
        shadow: {
          sm: { y: 2, blur: 4, spread: 0, opacity: 0.08 },
          md: { y: 6, blur: 16, spread: -2, opacity: 0.12 },
          lg: { y: 16, blur: 40, spread: -6, opacity: 0.18 },
        },
      },
      rules: {
        ...g.rules,
        components: { do: ["Prefer pill-shaped (radius full) primary buttons"], dont: [] },
      },
    }),
  },
  {
    key: "minimal",
    label: "Minimal",
    description: "Quiet and precise. Inter, near-black primary, flat surfaces.",
    apply: (g) => ({
      ...g,
      basics: {
        ...g.basics,
        personality: ["Calm", "Precise", "Understated"],
        voice: "Direct and economical. Say it once, in as few words as possible.",
        writingDo: ["Cut every word that doesn't add meaning"],
        writingDont: ["Use marketing superlatives"],
      },
      colors: {
        ...g.colors,
        base: { ...g.colors.base, primary: "#18181B", neutral: "#71717A" },
        roles: {
          light: { ...g.colors.roles.light, primary: "primary-950", onPrimary: "white" },
          dark: { ...g.colors.roles.dark, primary: "primary-50", onPrimary: "primary-950" },
        },
      },
      typography: {
        ...g.typography,
        heading: sans("Inter", [500, 600]),
        body: sans("Inter", [400, 500]),
        mono: mono("JetBrains Mono"),
        ratio: 1.2,
      },
      layout: {
        ...g.layout,
        radius: { none: 0, sm: 2, md: 4, lg: 6, xl: 8, full: 9999 },
        shadow: {
          sm: { y: 1, blur: 1, spread: 0, opacity: 0.04 },
          md: { y: 2, blur: 6, spread: -1, opacity: 0.06 },
          lg: { y: 8, blur: 20, spread: -4, opacity: 0.08 },
        },
      },
      rules: {
        ...g.rules,
        layout: { do: ["Use whitespace, not borders or shadows, to separate content"], dont: [] },
        color: { do: [], dont: ["Use secondary or accent colors for decoration"] },
      },
    }),
  },
  {
    key: "editorial",
    label: "Editorial",
    description: "Literary and refined. Serif type, deep rose, generous reading size.",
    apply: (g) => ({
      ...g,
      basics: {
        ...g.basics,
        personality: ["Thoughtful", "Refined", "Authoritative"],
        voice:
          "Considered and articulate. Write like a good magazine: specific, vivid, never padded.",
        writingDo: ["Use specific, concrete details", "Write headlines in sentence case"],
        writingDont: ["Use clickbait headlines"],
      },
      colors: {
        ...g.colors,
        base: {
          ...g.colors.base,
          primary: "#9F1239",
          secondary: "#1E3A8A",
          accent: "#CA8A04",
          neutral: "#78716C",
        },
      },
      typography: {
        ...g.typography,
        heading: serif("Playfair Display", [600, 700]),
        body: serif("Source Serif 4", [400, 600]),
        mono: mono("IBM Plex Mono"),
        baseSize: 18,
        ratio: 1.333,
      },
      layout: { ...g.layout, radius: { none: 0, sm: 2, md: 2, lg: 4, xl: 6, full: 9999 } },
      rules: {
        ...g.rules,
        typography: { do: ["Keep body text measure between 60 and 75 characters"], dont: [] },
      },
    }),
  },
];

/** A new guide, optionally starting from a preset. */
export function createGuide(presetKey?: string): Guide {
  const base = defaultGuide();
  const preset = PRESETS.find((p) => p.key === presetKey);
  return preset ? preset.apply(base) : base;
}
