import { normalizeGuide } from "./normalize";
import { createGuide } from "./presets";

test("passes a complete guide through unchanged", () => {
  const g = createGuide("playful");
  expect(normalizeGuide(JSON.parse(JSON.stringify(g)))).toEqual(g);
});

test("fills missing sections and fields from defaults", () => {
  const g = normalizeGuide({
    basics: { name: "Old" },
    colors: { base: { primary: "#000000" }, roles: { light: { bg: "black" } } },
    rules: { color: { do: ["x"] }, layout: "bad" },
    components: { notes: { button: "pill" } },
    layout: "bad",
  });
  expect(g.basics.name).toBe("Old");
  expect(g.basics.voice).toBe("");
  expect(g.colors.base.primary).toBe("#000000");
  expect(g.colors.base.info).toBe("#2563EB");
  expect(g.colors.roles.light.bg).toBe("black");
  expect(g.colors.roles.dark.bg).toBe("neutral-950");
  expect(g.rules.color).toEqual({ do: ["x"], dont: [] });
  expect(g.rules.layout).toEqual({ do: [], dont: [] });
  expect(g.components.notes).toMatchObject({ button: "pill", card: "" });
  expect(g.layout.spacingBase).toBe(4);
  expect(typeof g.id).toBe("string");
});

test("a guide with only basics gets default colors and roles", () => {
  const g = normalizeGuide({ basics: {} });
  expect(g.colors.roles.light.bg).toBe("white");
  expect(g.basics.name).toBe("Untitled brand");
});

test("rejects things that aren't guides", () => {
  expect(() => normalizeGuide(null)).toThrow();
  expect(() => normalizeGuide([])).toThrow();
  expect(() => normalizeGuide({ basics: [] })).toThrow();
});

test("only inline base64 images survive as the logo preview", () => {
  const withLogo = (previewDataUrl: string) =>
    normalizeGuide({ basics: {}, logo: { previewDataUrl, previewFileName: "x.png" } }).logo;
  expect(withLogo("data:image/png;base64,AAAA").previewDataUrl).toBe("data:image/png;base64,AAAA");
  for (const bad of [
    "https://evil.example/pixel.png",
    "javascript:alert(1)",
    "data:text/html;base64,AA",
  ]) {
    expect(withLogo(bad)).not.toHaveProperty("previewDataUrl");
    expect(withLogo(bad)).not.toHaveProperty("previewFileName");
  }
});

test("guides saved before the link role inherit it from primary", () => {
  const g = normalizeGuide({ basics: {}, colors: { roles: { light: { primary: "accent-700" } } } });
  expect(g.colors.roles.light.link).toBe("accent-700");
  expect(g.colors.roles.dark.link).toBe("primary-300");
});
