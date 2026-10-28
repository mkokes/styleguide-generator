import {
  COLOR_KEYS,
  ROLE_KEYS,
  SCALE_STEPS,
  TYPE_STEPS,
  type ColorRef,
  type Easing,
  type FontFamily,
  type Guide,
  type Mode,
  type RoleKey,
  type Shadow,
} from "../model/types";
import { buildScales, type Scales } from "./color";
import { buildTypeScale } from "./typeScale";

/** A CSS custom property as [name, value], e.g. ["--color-primary-500", "#4f46e5"]. */
export type Var = [string, string];

export function kebab(s: string): string {
  return s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

export function rem(px: number): string {
  return `${Math.round((px / 16) * 10000) / 10000}rem`;
}

export function fontStack(f: FontFamily): string {
  const name = /^[\w-]+$/.test(f.name) ? f.name : `"${f.name}"`;
  return f.fallback ? `${name}, ${f.fallback}` : name;
}

export function shadowCss(s: Shadow): string {
  return `0 ${s.y}px ${s.blur}px ${s.spread}px rgb(0 0 0 / ${s.opacity})`;
}

export function easingCss(e: Easing): string {
  return `cubic-bezier(${e.join(", ")})`;
}

export function roleVar(role: RoleKey): string {
  return `--color-${kebab(role)}`;
}

/** The var() expression a role points at, so roles stay linked to the palette. */
export function refValue(ref: ColorRef): string {
  if (ref === "white") return "#ffffff";
  if (ref === "black") return "#000000";
  return `var(--color-${ref})`;
}

export function spaceName(multiplier: number): string {
  return `--space-${String(multiplier).replace(".", "_")}`;
}

export function paletteVars(scales: Scales): Var[] {
  return COLOR_KEYS.flatMap((key) =>
    SCALE_STEPS.map((step): Var => [`--color-${key}-${step}`, scales[key][step]]),
  );
}

export function roleVars(guide: Guide, mode: Mode): Var[] {
  return ROLE_KEYS.map((role) => [roleVar(role), refValue(guide.colors.roles[mode][role])]);
}

export function fontVars(guide: Guide): Var[] {
  const t = guide.typography;
  return [
    ["--font-heading", fontStack(t.heading)],
    ["--font-body", fontStack(t.body)],
    ["--font-mono", fontStack(t.mono)],
  ];
}

export function textVars(guide: Guide): Var[] {
  const scale = buildTypeScale(guide.typography);
  return TYPE_STEPS.flatMap((key): Var[] => {
    const s = scale[key];
    return [
      [`--text-${key}`, rem(s.size)],
      [`--text-${key}--line-height`, String(s.lineHeight)],
      [`--text-${key}--letter-spacing`, `${s.letterSpacing}em`],
      [`--text-${key}--font-weight`, String(s.weight)],
    ];
  });
}

export function layoutVars(guide: Guide): Var[] {
  const l = guide.layout;
  return [
    ...l.spacingScale.map((m): Var => [spaceName(m), rem(m * l.spacingBase)]),
    ...Object.entries(l.radius).map(([k, v]): Var => [`--radius-${k}`, `${v}px`]),
    ...Object.entries(l.shadow).map(([k, v]): Var => [`--shadow-${k}`, shadowCss(v)]),
    ...Object.entries(l.duration).map(([k, v]): Var => [`--duration-${k}`, `${v}ms`]),
    ...Object.entries(l.easing).map(([k, v]): Var => [`--ease-${k}`, easingCss(v)]),
    ...Object.entries(l.breakpoints).map(([k, v]): Var => [`--breakpoint-${k}`, `${v}px`]),
  ];
}

/** Every mode-independent variable, in output order. */
export function baseVars(guide: Guide, scales = buildScales(guide.colors)): Var[] {
  return [...paletteVars(scales), ...fontVars(guide), ...textVars(guide), ...layoutVars(guide)];
}

/** All variables for one mode as a React style object (used by the live preview). */
export function styleObject(guide: Guide, mode: Mode): Record<string, string> {
  return Object.fromEntries([...baseVars(guide), ...roleVars(guide, mode)]);
}
