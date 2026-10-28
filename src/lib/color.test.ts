import { createGuide } from "../model/presets";
import { SCALE_STEPS } from "../model/types";
import {
  buildScales,
  checkContrast,
  contrast,
  generateScale,
  isHex,
  parseRef,
  requiredRatio,
  resolveRef,
  resolveRoles,
  suggestRef,
} from "./color";

test("isHex accepts 3 and 6 digit hex only", () => {
  expect(isHex("#abc")).toBe(true);
  expect(isHex("#A1B2C3")).toBe(true);
  expect(isHex("abc")).toBe(false);
  expect(isHex("#abcd")).toBe(false);
});

test("generateScale keeps the exact base on its nearest step and runs light to dark", () => {
  const scale = generateScale("#4F46E5");
  expect(Object.values(scale)).toContain("#4f46e5");
  const lum = SCALE_STEPS.map((s) => contrast(scale[s], "#000000"));
  for (let i = 1; i < lum.length; i++) expect(lum[i]).toBeLessThan(lum[i - 1]);
});

test("generateScale handles grays and invalid input", () => {
  expect(Object.values(generateScale("#808080"))).toHaveLength(11);
  expect(generateScale("not a color")).toEqual(generateScale("#808080"));
  // Extremes exercise the chroma fade on both sides.
  expect(generateScale("#ffffff")[50]).toBe("#ffffff");
  expect(generateScale("#000000")[950]).toMatch(/^#/);
});

test("buildScales applies overrides", () => {
  const g = createGuide();
  g.colors.overrides = { primary: { 500: "#123456" } };
  expect(buildScales(g.colors).primary[500]).toBe("#123456");
});

test("refs resolve to palette colors, white and black", () => {
  const scales = buildScales(createGuide().colors);
  expect(parseRef("white")).toBeNull();
  expect(parseRef("neutral-900")).toEqual({ color: "neutral", step: 900 });
  expect(resolveRef("white", scales)).toBe("#ffffff");
  expect(resolveRef("black", scales)).toBe("#000000");
  expect(resolveRef("primary-500", scales)).toBe(scales.primary[500]);
  expect(resolveRoles(createGuide().colors.roles.light, scales).bg).toBe("#ffffff");
});

test("requiredRatio depends on kind and target", () => {
  expect(requiredRatio("ui", "AAA")).toBe(3);
  expect(requiredRatio("text", "AA")).toBe(4.5);
  expect(requiredRatio("text", "AAA")).toBe(7);
});

test("default guide passes AA in both modes", () => {
  const checks = checkContrast(createGuide());
  expect(checks).toHaveLength(20);
  expect(checks.every((c) => c.pass && c.suggestion === null)).toBe(true);
});

test("failing pairs get the nearest passing step as a suggestion", () => {
  const g = createGuide();
  g.colors.roles.light.textMuted = "neutral-300";
  const fail = checkContrast(g).find(
    (c) => c.mode === "light" && c.fg === "textMuted" && c.bg === "bg",
  )!;
  expect(fail.pass).toBe(false);
  expect(fail.suggestion).toMatch(/^neutral-/);
  const fixed = { ...g.colors.roles.light, textMuted: fail.suggestion! };
  g.colors.roles.light = fixed;
  expect(
    checkContrast(g).find((c) => c.mode === "light" && c.fg === "textMuted" && c.bg === "bg")!.pass,
  ).toBe(true);
});

test("suggestRef returns null for white/black or when nothing passes", () => {
  const scales = buildScales(createGuide().colors);
  expect(suggestRef("white", "#ffffff", 4.5, scales)).toBeNull();
  expect(suggestRef("primary-500", "#777777", 21, scales)).toBeNull();
});
