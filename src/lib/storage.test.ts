import { createGuide } from "../model/presets";
import { INDEX_KEY, deleteGuide, guideKey, listGuides, loadGuide, saveGuide } from "./storage";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

test("save, list, load and delete", () => {
  const a = { ...createGuide(), updatedAt: 1 };
  const b = { ...createGuide("playful"), updatedAt: 2 };
  expect(saveGuide(a)).toBe(true);
  saveGuide(b);
  expect(listGuides().map((m) => m.id)).toEqual([b.id, a.id]);
  expect(loadGuide(a.id)).toEqual(a);
  deleteGuide(a.id);
  expect(loadGuide(a.id)).toBeNull();
  expect(listGuides().map((m) => m.id)).toEqual([b.id]);
});

test("re-saving updates the index entry instead of duplicating it", () => {
  const g = createGuide();
  saveGuide(g);
  saveGuide({ ...g, basics: { ...g.basics, name: "Renamed" } });
  expect(listGuides()).toEqual([{ id: g.id, name: "Renamed", updatedAt: g.updatedAt }]);
});

test("bad data reads as empty", () => {
  localStorage.setItem(INDEX_KEY, "{oops");
  expect(listGuides()).toEqual([]);
  localStorage.setItem(INDEX_KEY, '{"not":"an array"}');
  expect(listGuides()).toEqual([]);
  localStorage.setItem(guideKey("x"), '"just a string"');
  expect(loadGuide("x")).toBeNull();
});

test("storage failures are swallowed", () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("quota");
  });
  vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
    throw new Error("denied");
  });
  expect(saveGuide(createGuide())).toBe(false);
  expect(() => deleteGuide("x")).not.toThrow();
});
