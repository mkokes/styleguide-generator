import { createGuide } from "../model/presets";
import { guideReducer } from "./state";

test("patch merges into one section and bumps updatedAt", () => {
  const g = { ...createGuide(), updatedAt: 0 };
  const next = guideReducer(g, { type: "patch", section: "basics", value: { name: "Acme" } });
  expect(next.basics).toEqual({ ...g.basics, name: "Acme" });
  expect(next.colors).toBe(g.colors);
  expect(next.updatedAt).toBeGreaterThan(0);
});

test("replace swaps the whole guide", () => {
  const a = createGuide();
  const b = createGuide("playful");
  expect(guideReducer(a, { type: "replace", guide: b })).toBe(b);
});
