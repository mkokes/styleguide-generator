export const COLOR_KEYS = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "success",
  "warning",
  "danger",
  "info",
] as const;
export type ColorKey = (typeof COLOR_KEYS)[number];

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type ScaleStep = (typeof SCALE_STEPS)[number];

/** A palette entry such as "primary-600", or plain white/black. */
export type ColorRef = `${ColorKey}-${ScaleStep}` | "white" | "black";

export const ROLE_KEYS = [
  "bg",
  "surface",
  "text",
  "textMuted",
  "border",
  "primary",
  "onPrimary",
  "link",
  "success",
  "warning",
  "danger",
  "info",
] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];
export type Roles = Record<RoleKey, ColorRef>;

export type Mode = "light" | "dark";

export interface FontFamily {
  name: string;
  source: "google" | "custom";
  weights: number[];
  /** CSS fallback stack appended after the family name. */
  fallback: string;
}

export const TYPE_STEPS = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"] as const;
export type TypeStepKey = (typeof TYPE_STEPS)[number];

export interface TypeStep {
  /** px */
  size: number;
  lineHeight: number;
  weight: number;
  /** em */
  letterSpacing: number;
}

export interface Shadow {
  /** px */
  y: number;
  /** px */
  blur: number;
  /** px */
  spread: number;
  /** 0–1, applied to black */
  opacity: number;
}

/** cubic-bezier control points */
export type Easing = [number, number, number, number];

export interface Rules {
  do: string[];
  dont: string[];
}

export const RULE_SECTIONS = [
  "color",
  "typography",
  "layout",
  "logo",
  "icons",
  "imagery",
  "components",
] as const;
export type RuleSection = (typeof RULE_SECTIONS)[number];

export const COMPONENT_KEYS = ["button", "input", "card", "alert", "nav"] as const;
export type ComponentKey = (typeof COMPONENT_KEYS)[number];

export interface LogoVariant {
  name: string;
  path: string;
  background: "light" | "dark" | "any";
}

export interface Guide {
  id: string;
  createdAt: number;
  updatedAt: number;
  basics: {
    name: string;
    description: string;
    audience: string;
    personality: string[];
    voice: string;
    writingDo: string[];
    writingDont: string[];
  };
  colors: {
    base: Record<ColorKey, string>;
    /** Per-step overrides of the generated scales. */
    overrides: Partial<Record<ColorKey, Partial<Record<ScaleStep, string>>>>;
    roles: Record<Mode, Roles>;
  };
  typography: {
    heading: FontFamily;
    body: FontFamily;
    mono: FontFamily;
    /** px */
    baseSize: number;
    ratio: number;
    overrides: Partial<Record<TypeStepKey, Partial<TypeStep>>>;
  };
  layout: {
    /** px; the spacing scale is multiples of this. */
    spacingBase: number;
    spacingScale: number[];
    radius: Record<"none" | "sm" | "md" | "lg" | "xl" | "full", number>;
    shadow: Record<"sm" | "md" | "lg", Shadow>;
    duration: Record<"fast" | "normal" | "slow", number>;
    easing: Record<"standard" | "enter" | "exit", Easing>;
    breakpoints: Record<"sm" | "md" | "lg" | "xl", number>;
  };
  logo: {
    variants: LogoVariant[];
    minSize: string;
    clearSpace: string;
    misuse: string[];
    /** Data URL kept only in the browser; never put in share links. */
    previewDataUrl?: string;
    previewFileName?: string;
  };
  icons: {
    library: string;
    style: "outline" | "filled" | "duotone";
    sizes: number[];
    stroke: number;
  };
  imagery: {
    style: string;
  };
  components: {
    notes: Record<ComponentKey, string>;
  };
  accessibility: {
    target: "AA" | "AAA";
    focusStyle: string;
    reducedMotion: boolean;
  };
  rules: Record<RuleSection, Rules>;
  outputs: {
    markdown: boolean;
    css: boolean;
    tailwind: "v4" | "v3" | "off";
    dtcg: boolean;
  };
}

/** The editable sections of a guide (everything except identity and timestamps). */
export type SectionKey = Exclude<keyof Guide, "id" | "createdAt" | "updatedAt">;
