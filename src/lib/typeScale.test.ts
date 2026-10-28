import { createGuide } from "../model/presets";
import { buildTypeScale } from "./typeScale";

test("builds a modular scale around the base size", () => {
  const t = createGuide().typography;
  const s = buildTypeScale(t);
  expect(s.base.size).toBe(16);
  expect(s.lg.size).toBe(20);
  expect(s.sm.size).toBe(12.8);
  expect(s["4xl"].weight).toBe(700);
  expect(s["4xl"].letterSpacing).toBe(-0.02);
  expect(s.xl.letterSpacing).toBe(-0.01);
  expect(s.base.letterSpacing).toBe(0);
});

test("overrides win over generated values", () => {
  const t = { ...createGuide().typography, overrides: { base: { size: 17, weight: 450 } } };
  expect(buildTypeScale(t).base).toMatchObject({ size: 17, weight: 450, lineHeight: 1.6 });
});

test("weights come from the loaded families and small steps have a floor", () => {
  const t = createGuide("minimal").typography;
  const s = buildTypeScale({ ...t, ratio: 1.618 });
  expect(s["4xl"].weight).toBe(600);
  expect(s.base.weight).toBe(400);
  expect(s.xs.size).toBe(11);
  expect(s.sm.size).toBe(12);
  const noWeights = buildTypeScale({
    ...t,
    heading: { ...t.heading, weights: [] },
    body: { ...t.body, weights: [] },
  });
  expect(noWeights["4xl"].weight).toBe(700);
  expect(noWeights.base.weight).toBe(400);
  expect(buildTypeScale({ ...t, body: { ...t.body, weights: [300, 500] } }).base.weight).toBe(300);
});
