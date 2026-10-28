import { checkContrast } from "../lib/color";
import { PRESETS, createGuide } from "./presets";

test.each(PRESETS.map((p) => p.key))("%s preset differs from blank and passes AA", (key) => {
  const g = createGuide(key);
  expect(g.basics.personality.length).toBeGreaterThan(0);
  expect(checkContrast(g).every((c) => c.pass)).toBe(true);
});

test("unknown preset falls back to blank", () => {
  expect(createGuide("nope").basics.personality).toEqual([]);
});
