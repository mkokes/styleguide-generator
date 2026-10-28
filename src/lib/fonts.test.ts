import { fallbackFor, fontCssUrl, loadCatalog, searchFonts, type GoogleFont } from "./fonts";

const fonts: GoogleFont[] = [
  { family: "Inter", category: "Sans Serif", weights: [400, 700] },
  { family: "Lora", category: "Serif", weights: [400] },
  { family: "Explora", category: "Handwriting", weights: [400] },
];

test("search ranks prefix matches first and limits results", () => {
  expect(searchFonts(fonts, "lora").map((f) => f.family)).toEqual(["Lora", "Explora"]);
  expect(searchFonts(fonts, " ")).toHaveLength(3);
  expect(searchFonts(fonts, "", 1)).toHaveLength(1);
});

test("css url merges families and skips custom ones", () => {
  const g = (name: string, weights: number[], source: "google" | "custom" = "google") => ({
    name,
    weights,
    source,
    fallback: "",
  });
  expect(
    fontCssUrl([
      g("Source Serif 4", [700, 400]),
      g("Source Serif 4", [400, 600]),
      g("Mine", [400], "custom"),
    ]),
  ).toBe("https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap");
  expect(fontCssUrl([g("Inter", [])])).toBe(
    "https://fonts.googleapis.com/css2?family=Inter&display=swap",
  );
  expect(fontCssUrl([g("", [400]), g("X", [400], "custom")])).toBe("");
});

test("fallback stacks by category", () => {
  expect(fallbackFor("Serif")).toMatch(/serif$/);
  expect(fallbackFor("Monospace")).toMatch(/monospace$/);
  expect(fallbackFor("Handwriting")).toBe("cursive");
  expect(fallbackFor("Display")).toMatch(/sans-serif$/);
});

test("catalog loads once from the bundled snapshot", async () => {
  const a = await loadCatalog();
  expect(a.length).toBeGreaterThan(1000);
  expect(a.find((f) => f.family === "Inter")?.weights).toContain(400);
  expect(loadCatalog()).toBe(loadCatalog());
});

test("font names are URL-encoded", () => {
  expect(fontCssUrl([{ name: "A&b=c", source: "google", weights: [], fallback: "" }])).toBe(
    "https://fonts.googleapis.com/css2?family=A%26b%3Dc&display=swap",
  );
});
