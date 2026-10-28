import { createGuide } from "../model/presets";
import {
  baseVars,
  easingCss,
  fontStack,
  kebab,
  refValue,
  rem,
  roleVars,
  shadowCss,
  spaceName,
  styleObject,
} from "./tokens";

test("helpers format values", () => {
  expect(kebab("textMuted")).toBe("text-muted");
  expect(rem(12)).toBe("0.75rem");
  expect(shadowCss({ y: 1, blur: 2, spread: 0, opacity: 0.1 })).toBe(
    "0 1px 2px 0px rgb(0 0 0 / 0.1)",
  );
  expect(easingCss([0.2, 0, 0, 1])).toBe("cubic-bezier(0.2, 0, 0, 1)");
  expect(spaceName(0.5)).toBe("--space-0_5");
  expect(refValue("white")).toBe("#ffffff");
  expect(refValue("black")).toBe("#000000");
  expect(refValue("primary-600")).toBe("var(--color-primary-600)");
});

test("fontStack quotes multi-word names and handles empty fallbacks", () => {
  expect(fontStack({ name: "Inter", source: "google", weights: [], fallback: "sans-serif" })).toBe(
    "Inter, sans-serif",
  );
  expect(fontStack({ name: "Source Serif 4", source: "google", weights: [], fallback: "" })).toBe(
    '"Source Serif 4"',
  );
});

test("vars cover palette, fonts, type, layout and roles", () => {
  const g = createGuide();
  const names = baseVars(g).map(([k]) => k);
  expect(names).toContain("--color-primary-500");
  expect(names).toContain("--font-heading");
  expect(names).toContain("--text-xl--line-height");
  expect(names).toContain("--space-4");
  expect(names).toContain("--radius-md");
  expect(names).toContain("--shadow-lg");
  expect(names).toContain("--ease-standard");
  expect(names).toContain("--breakpoint-md");
  expect(roleVars(g, "dark")).toContainEqual(["--color-bg", "var(--color-neutral-950)"]);
  expect(styleObject(g, "light")["--color-on-primary"]).toBe("#ffffff");
});
