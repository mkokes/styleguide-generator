import { clampChroma, formatHex, oklch, wcagContrast } from "culori";
import {
  COLOR_KEYS,
  ROLE_KEYS,
  SCALE_STEPS,
  type ColorKey,
  type ColorRef,
  type Guide,
  type Mode,
  type RoleKey,
  type Roles,
  type ScaleStep,
} from "../model/types";

export type Scale = Record<ScaleStep, string>;
export type Scales = Record<ColorKey, Scale>;

// Target OKLCH lightness for each step, roughly matching Tailwind's palettes.
const TARGET_L: Record<ScaleStep, number> = {
  50: 0.975,
  100: 0.94,
  200: 0.885,
  300: 0.81,
  400: 0.71,
  500: 0.62,
  600: 0.54,
  700: 0.47,
  800: 0.4,
  900: 0.34,
  950: 0.26,
};

export function isHex(value: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
}

/** Generates a 50–950 scale whose closest step is the exact base color. */
export function generateScale(base: string): Scale {
  const parsed = oklch(base) ?? oklch("#808080")!;
  const l = parsed.l;
  const c = parsed.c;
  const h = parsed.h ?? 0;
  const anchor = SCALE_STEPS.reduce((best, step) =>
    Math.abs(TARGET_L[step] - l) < Math.abs(TARGET_L[best] - l) ? step : best,
  );
  const scale = {} as Scale;
  for (const step of SCALE_STEPS) {
    if (step === anchor) {
      scale[step] = formatHex(parsed);
      continue;
    }
    const target = TARGET_L[step];
    // Fade chroma toward white and black so tints and shades don't oversaturate.
    const factor = target > l ? (1 - target) / Math.max(1 - l, 0.01) : target / Math.max(l, 0.01);
    const color = { mode: "oklch" as const, l: target, c: c * Math.min(1, factor ** 0.6), h };
    scale[step] = formatHex(clampChroma(color, "oklch"));
  }
  return scale;
}

/** Generated scales with the user's per-step overrides applied. */
export function buildScales(colors: Guide["colors"]): Scales {
  const scales = {} as Scales;
  for (const key of COLOR_KEYS) {
    scales[key] = { ...generateScale(colors.base[key]), ...colors.overrides[key] };
  }
  return scales;
}

export function parseRef(ref: ColorRef): { color: ColorKey; step: ScaleStep } | null {
  if (ref === "white" || ref === "black") return null;
  const i = ref.lastIndexOf("-");
  return { color: ref.slice(0, i) as ColorKey, step: Number(ref.slice(i + 1)) as ScaleStep };
}

export function resolveRef(ref: ColorRef, scales: Scales): string {
  if (ref === "white") return "#ffffff";
  if (ref === "black") return "#000000";
  const { color, step } = parseRef(ref)!;
  return scales[color][step];
}

export function resolveRoles(roles: Roles, scales: Scales): Record<RoleKey, string> {
  return Object.fromEntries(ROLE_KEYS.map((r) => [r, resolveRef(roles[r], scales)])) as Record<
    RoleKey,
    string
  >;
}

export function contrast(a: string, b: string): number {
  return wcagContrast(a, b);
}

export type PairKind = "text" | "ui";

/** Role pairs an agent will actually put on top of each other. */
export const CONTRAST_PAIRS: { fg: RoleKey; bg: RoleKey; kind: PairKind }[] = [
  { fg: "text", bg: "bg", kind: "text" },
  { fg: "text", bg: "surface", kind: "text" },
  { fg: "textMuted", bg: "bg", kind: "text" },
  { fg: "textMuted", bg: "surface", kind: "text" },
  { fg: "onPrimary", bg: "primary", kind: "text" },
  { fg: "link", bg: "bg", kind: "text" },
  { fg: "link", bg: "surface", kind: "text" },
  { fg: "success", bg: "bg", kind: "text" },
  { fg: "warning", bg: "bg", kind: "text" },
  { fg: "danger", bg: "bg", kind: "text" },
  { fg: "info", bg: "bg", kind: "text" },
];

export function requiredRatio(kind: PairKind, target: "AA" | "AAA"): number {
  if (kind === "ui") return 3;
  return target === "AAA" ? 7 : 4.5;
}

export interface ContrastCheck {
  mode: Mode;
  fg: RoleKey;
  bg: RoleKey;
  kind: PairKind;
  ratio: number;
  required: number;
  pass: boolean;
  /** A step of the foreground's color that would pass, if the current one fails. */
  suggestion: ColorRef | null;
}

/** Nearest step of `fg`'s color (by scale distance) that meets `required` against `bgHex`. */
export function suggestRef(fg: ColorRef, bgHex: string, required: number, scales: Scales) {
  const parsed = parseRef(fg);
  if (!parsed) return null;
  const from = SCALE_STEPS.indexOf(parsed.step);
  const byDistance = [...SCALE_STEPS].sort(
    (a, b) => Math.abs(SCALE_STEPS.indexOf(a) - from) - Math.abs(SCALE_STEPS.indexOf(b) - from),
  );
  const step = byDistance.find((s) => contrast(scales[parsed.color][s], bgHex) >= required);
  return step === undefined ? null : (`${parsed.color}-${step}` as ColorRef);
}

export function checkContrast(guide: Guide, scales = buildScales(guide.colors)): ContrastCheck[] {
  const checks: ContrastCheck[] = [];
  for (const mode of ["light", "dark"] as const) {
    const refs = guide.colors.roles[mode];
    const hex = resolveRoles(refs, scales);
    for (const { fg, bg, kind } of CONTRAST_PAIRS) {
      const ratio = contrast(hex[fg], hex[bg]);
      const required = requiredRatio(kind, guide.accessibility.target);
      const pass = ratio >= required;
      checks.push({
        mode,
        fg,
        bg,
        kind,
        ratio,
        required,
        pass,
        suggestion: pass ? null : suggestRef(refs[fg], hex[bg], required, scales),
      });
    }
  }
  return checks;
}
