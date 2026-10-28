import { RULE_SECTIONS, type Guide, type Roles, type RuleSection, type Rules } from "./types";

export const SANS_FALLBACK = "system-ui, -apple-system, 'Segoe UI', sans-serif";
export const SERIF_FALLBACK = "Georgia, 'Times New Roman', serif";
export const MONO_FALLBACK = "ui-monospace, SFMono-Regular, Menlo, monospace";

export const DEFAULT_LIGHT_ROLES: Roles = {
  bg: "white",
  surface: "neutral-50",
  text: "neutral-900",
  textMuted: "neutral-700",
  border: "neutral-200",
  primary: "primary-600",
  onPrimary: "white",
  link: "primary-600",
  success: "success-700",
  warning: "warning-700",
  danger: "danger-600",
  info: "info-700",
};

export const DEFAULT_DARK_ROLES: Roles = {
  bg: "neutral-950",
  surface: "neutral-900",
  text: "neutral-50",
  textMuted: "neutral-400",
  border: "neutral-800",
  primary: "primary-400",
  onPrimary: "neutral-950",
  link: "primary-300",
  success: "success-400",
  warning: "warning-400",
  danger: "danger-400",
  info: "info-400",
};

export function emptyRules(): Record<RuleSection, Rules> {
  const rules = {} as Record<RuleSection, Rules>;
  for (const s of RULE_SECTIONS) rules[s] = { do: [], dont: [] };
  return rules;
}

export function newId(): string {
  return crypto.randomUUID();
}

/** Everything a guide needs, with neutral defaults. Presets layer on top of this. */
export function defaultGuide(): Guide {
  const now = Date.now();
  return {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    basics: {
      name: "Untitled brand",
      description: "",
      audience: "",
      personality: [],
      voice: "",
      writingDo: [],
      writingDont: [],
    },
    colors: {
      base: {
        primary: "#4F46E5",
        secondary: "#0EA5E9",
        accent: "#F59E0B",
        neutral: "#64748B",
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
        info: "#2563EB",
      },
      overrides: {},
      roles: { light: { ...DEFAULT_LIGHT_ROLES }, dark: { ...DEFAULT_DARK_ROLES } },
    },
    typography: {
      heading: { name: "Inter", source: "google", weights: [600, 700], fallback: SANS_FALLBACK },
      body: { name: "Inter", source: "google", weights: [400, 500], fallback: SANS_FALLBACK },
      mono: { name: "JetBrains Mono", source: "google", weights: [400], fallback: MONO_FALLBACK },
      baseSize: 16,
      ratio: 1.25,
      overrides: {},
    },
    layout: {
      spacingBase: 4,
      spacingScale: [0, 1, 2, 3, 4, 6, 8, 12, 16, 24],
      radius: { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
      shadow: {
        sm: { y: 1, blur: 2, spread: 0, opacity: 0.06 },
        md: { y: 4, blur: 12, spread: -2, opacity: 0.1 },
        lg: { y: 12, blur: 32, spread: -4, opacity: 0.14 },
      },
      duration: { fast: 120, normal: 200, slow: 320 },
      easing: {
        standard: [0.2, 0, 0, 1],
        enter: [0, 0, 0, 1],
        exit: [0.3, 0, 1, 1],
      },
      breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 },
    },
    logo: {
      variants: [],
      minSize: "",
      clearSpace: "",
      misuse: [],
    },
    icons: { library: "", style: "outline", sizes: [16, 20, 24], stroke: 1.5 },
    imagery: { style: "" },
    components: { notes: { button: "", input: "", card: "", alert: "", nav: "" } },
    accessibility: {
      target: "AA",
      focusStyle: "2px solid outline in the link role color, offset 2px",
      reducedMotion: true,
    },
    rules: emptyRules(),
    outputs: { markdown: true, css: true, tailwind: "v4", dtcg: true },
  };
}
