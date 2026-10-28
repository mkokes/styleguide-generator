import { strFromU8, unzipSync } from "fflate";
import { createGuide } from "../model/presets";
import { buildZip, generateFiles, slug } from "./bundle";
import { generateCss } from "./css";
import { buildDtcg, generateDtcg } from "./dtcg";
import { outputFiles } from "./files";
import {
  generateTailwind,
  generateTailwindV3,
  generateTailwindV4,
  tailwindFileName,
} from "./tailwind";

const g = () => {
  const guide = createGuide("playful");
  guide.basics.name = "Snapshot";
  return guide;
};

test("tokens.css has root, dark and media blocks", async () => {
  const css = generateCss(g());
  expect(css).toContain(":root {\n  --color-primary-50:");
  expect(css).toContain('[data-theme="dark"] {\n  --color-bg: var(--color-neutral-950);');
  expect(css).toContain(
    '@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {',
  );
  await expect(css).toMatchFileSnapshot("__snapshots__/tokens.css");
});

test("tailwind v4 uses @theme namespaces", async () => {
  const tw = generateTailwindV4(g());
  expect(tw).toContain('@import "tailwindcss";');
  expect(tw).toContain("--spacing: 0.25rem;");
  expect(tw).toContain("--text-xl--line-height:");
  expect(tw).not.toContain("--space-4:");
  expect(tw).toContain(":root {\n  --duration-fast: 120ms;");
  await expect(tw).toMatchFileSnapshot("__snapshots__/tailwind.css");
});

test("tailwind v3 is a valid config object", async () => {
  const js = generateTailwindV3(g());
  const json = js.slice(js.indexOf("export default ") + 15, js.lastIndexOf(";"));
  const config = JSON.parse(json);
  expect(config.darkMode).toEqual(["selector", '[data-theme="dark"]']);
  expect(config.theme.extend.colors.role["text-muted"]).toBe("var(--color-text-muted)");
  expect(config.theme.extend.fontSize.base[1].lineHeight).toBe("1.6");
  await expect(js).toMatchFileSnapshot("__snapshots__/tailwind.config.js");
});

test("tailwind picks the configured version", () => {
  const guide = g();
  expect(tailwindFileName(guide)).toBe("tailwind.css");
  expect(generateTailwind(guide)).toContain("@theme");
  guide.outputs.tailwind = "v3";
  expect(tailwindFileName(guide)).toBe("tailwind.config.js");
  expect(generateTailwind(guide)).toContain("export default");
});

test("DTCG tokens use aliases and typed values", async () => {
  const guide = g();
  const t = buildDtcg(guide) as Record<string, any>;
  expect(t.color.$type).toBe("color");
  expect(t.role.light.bg.$value).toBe("{color.base.white}");
  expect(t.role.light.text.$value).toBe("{color.neutral.900}");
  expect(t.typography["2xl"].$value.fontFamily).toBe("{font.family.heading}");
  expect(t.typography.base.$value.fontFamily).toBe("{font.family.body}");
  expect(t.font.family.heading.$value[0]).toBe("Fredoka");
  expect(t.font.family.body.$value).toContain("Segoe UI");
  expect(t.shadow.sm.$value.color).toBe("#00000014");
  expect(t.easing.standard.$value).toEqual([0.2, 0, 0, 1]);
  await expect(generateDtcg(guide)).toMatchFileSnapshot("__snapshots__/tokens.json");
});

test("output list follows the toggles", () => {
  const guide = g();
  expect(outputFiles(guide).map((f) => f.name)).toEqual([
    "STYLEGUIDE.md",
    "tokens.css",
    "tailwind.css",
    "tokens.json",
  ]);
  guide.outputs = { markdown: false, css: false, tailwind: "v3", dtcg: false };
  expect(outputFiles(guide)).toEqual([expect.objectContaining({ name: "tailwind.config.js" })]);
  guide.outputs.tailwind = "off";
  expect(generateFiles(guide)).toEqual([]);
});

test("slug", () => {
  expect(slug("Acme & Co.")).toBe("acme-co");
  expect(slug("!!!")).toBe("styleguide");
});

test("zip holds every output and the logo", () => {
  const guide = g();
  guide.logo.previewDataUrl = `data:image/png;base64,${btoa("PNG")}`;
  guide.logo.previewFileName = "logo.png";
  const files = unzipSync(buildZip(guide));
  expect(Object.keys(files).sort()).toEqual([
    "snapshot/STYLEGUIDE.md",
    "snapshot/logo/logo.png",
    "snapshot/tailwind.css",
    "snapshot/tokens.css",
    "snapshot/tokens.json",
  ]);
  expect(strFromU8(files["snapshot/logo/logo.png"])).toBe("PNG");
  delete guide.logo.previewFileName;
  expect(Object.keys(unzipSync(buildZip(guide)))).toContain("snapshot/logo/logo");
});

test("a hostile brand name can't inject code into generated file headers", () => {
  const guide = g();
  guide.basics.name = "X\nrequire('child_process').exec('pwn') */ @import url(evil);";
  guide.outputs.tailwind = "v3";
  const v3 = generateTailwindV3(guide);
  expect(v3.split("\n")[0]).toContain("require(");
  expect(v3.split("\n")[1].startsWith("//")).toBe(true);
  for (const out of [generateCss(guide), generateTailwindV4(guide)]) {
    const header = out.split("\n")[0];
    expect(header.startsWith("/*") && header.endsWith("*/")).toBe(true);
    expect(header.slice(2, -2)).not.toContain("*/");
  }
});
