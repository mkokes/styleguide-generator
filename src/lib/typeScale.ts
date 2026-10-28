import { TYPE_STEPS, type Guide, type TypeStep, type TypeStepKey } from "../model/types";

export type TypeScale = Record<TypeStepKey, TypeStep>;

/** Which type step each common text element uses. */
export const ELEMENT_STEPS: { element: string; step: TypeStepKey; font: "heading" | "body" }[] = [
  { element: "h1", step: "4xl", font: "heading" },
  { element: "h2", step: "3xl", font: "heading" },
  { element: "h3", step: "2xl", font: "heading" },
  { element: "h4", step: "xl", font: "heading" },
  { element: "Lead paragraph", step: "lg", font: "body" },
  { element: "Body", step: "base", font: "body" },
  { element: "Small / UI labels", step: "sm", font: "body" },
  { element: "Caption", step: "xs", font: "body" },
];

const BASE_INDEX = TYPE_STEPS.indexOf("base");

// Floors keep small steps readable at large ratios.
const MIN_SIZE: Partial<Record<TypeStepKey, number>> = { xs: 11, sm: 12 };

function generatedStep(key: TypeStepKey, i: number, t: Guide["typography"]): TypeStep {
  const offset = i - BASE_INDEX;
  const size = Math.max(Math.round(t.baseSize * t.ratio ** offset * 100) / 100, MIN_SIZE[key] ?? 0);
  // Larger text needs tighter leading and tracking.
  const lineHeight = [1.5, 1.5, 1.6, 1.5, 1.35, 1.25, 1.15, 1.1][i];
  const letterSpacing = offset >= 4 ? -0.02 : offset >= 2 ? -0.01 : 0;
  // Only use weights that are actually loaded: the heaviest heading weight, and regular body text.
  const weight =
    offset >= 2
      ? Math.max(...t.heading.weights, 0) || 700
      : t.body.weights.includes(400)
        ? 400
        : (t.body.weights[0] ?? 400);
  return { size, lineHeight, weight, letterSpacing };
}

export function buildTypeScale(typography: Guide["typography"]): TypeScale {
  const scale = {} as TypeScale;
  TYPE_STEPS.forEach((key, i) => {
    scale[key] = { ...generatedStep(key, i, typography), ...typography.overrides[key] };
  });
  return scale;
}

export const RATIOS: { value: number; label: string }[] = [
  { value: 1.125, label: "1.125 — Major Second" },
  { value: 1.2, label: "1.2 — Minor Third" },
  { value: 1.25, label: "1.25 — Major Third" },
  { value: 1.333, label: "1.333 — Perfect Fourth" },
  { value: 1.414, label: "1.414 — Augmented Fourth" },
  { value: 1.5, label: "1.5 — Perfect Fifth" },
  { value: 1.618, label: "1.618 — Golden Ratio" },
];
