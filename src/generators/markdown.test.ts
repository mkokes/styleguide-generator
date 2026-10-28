import { createGuide } from "../model/presets";
import type { Guide } from "../model/types";
import { generateMarkdown, list, shiftRef, table } from "./markdown";

const md = (patch: (g: Guide) => void = () => {}) => {
  const g = createGuide("corporate");
  patch(g);
  return generateMarkdown(g);
};

test("matches snapshot for each preset", async () => {
  for (const key of [undefined, "corporate", "playful", "minimal", "editorial"]) {
    const g = createGuide(key);
    g.basics.name = `Snapshot ${key ?? "blank"}`;
    await expect(generateMarkdown(g)).toMatchFileSnapshot(
      `__snapshots__/STYLEGUIDE.${key ?? "blank"}.md`,
    );
  }
});

test("table and list helpers escape pipes and newlines", () => {
  expect(table(["a"], [["x|y\nz"]])).toBe("| a |\n| --- |\n| x\\|y z |");
  expect(list(["a", "b"])).toBe("- a\n- b");
});

test("shiftRef clamps and leaves white/black alone", () => {
  expect(shiftRef("primary-600", 1)).toBe("primary-700");
  expect(shiftRef("primary-950", 1)).toBe("primary-950");
  expect(shiftRef("primary-50", -1)).toBe("primary-50");
  expect(shiftRef("white", 1)).toBe("white");
});

test("covers every section when filled in", () => {
  const out = md((g) => {
    g.basics.description = "Accounting for humans.";
    g.basics.audience = "Freelancers";
    g.logo = {
      variants: [
        { name: "Full", path: "src/logo.svg", background: "light" },
        { name: "Mark", path: "src/mark.svg", background: "any" },
      ],
      minSize: "24px",
      clearSpace: "1x",
      misuse: ["Stretch it"],
    };
    g.imagery.style = "Warm photos.";
    g.icons.library = "Lucide";
    g.components.notes.button = "Pill shaped.";
    g.rules.components.do = ["Keep it simple"];
  });
  for (const s of [
    "Accounting for humans.",
    "**Audience:** Freelancers",
    "## Logo",
    "| Full | `src/logo.svg` | light backgrounds |",
    "Any background",
    "**Minimum size:** 24px",
    "- Stretch it",
    "## Imagery",
    "Warm photos.",
    "Lucide icons",
    "**Notes:** Pill shaped.",
    "- Keep it simple",
    "UI copy that breaks the voice",
    "Tailwind",
  ]) {
    expect(out).toContain(s);
  }
});

test("omits optional sections and adapts to settings", () => {
  const out = md((g) => {
    g.basics = { ...g.basics, voice: "", writingDo: [], writingDont: [], personality: [] };
    g.outputs = { markdown: true, css: false, tailwind: "off", dtcg: false };
    g.icons.style = "filled";
    g.accessibility = { ...g.accessibility, target: "AAA", reducedMotion: false };
    g.typography.heading = { ...g.typography.heading, source: "custom" };
    g.layout.spacingScale = [];
    g.logo.minSize = "";
    g.logo.clearSpace = "";
  });
  expect(out).not.toContain("## Voice and tone");
  expect(out).not.toContain("## Logo");
  expect(out).not.toContain("## Imagery");
  expect(out).not.toContain("| File | Purpose |");
  expect(out).not.toContain("Tailwind");
  expect(out).not.toContain("Stroke width");
  expect(out).not.toContain("prefers-reduced-motion");
  expect(out).toContain("**Library:** not specified");
  expect(out).toContain("Self-hosted / licensed");
  expect(out).toContain("WCAG 2.2 AAA");
  expect(out).toContain("44×44px");
  expect(out).toContain("`var(--space-0)`");
});

test("logo rules alone still produce a logo section, and v3 roles use the role prefix", () => {
  const out = md((g) => {
    g.rules.logo.dont = ["Rotate it"];
    g.rules.imagery.do = ["Real people"];
    g.outputs.tailwind = "v3";
  });
  expect(out).toContain("## Logo");
  expect(out).toContain("- Rotate it");
  expect(out).toContain("## Imagery");
  expect(out).toContain("`*-role-text-muted`");
});

test("failing contrast is flagged with a fix when one exists", () => {
  const out = md((g) => {
    g.colors.roles.light.textMuted = "neutral-300";
    g.colors.roles.dark.onPrimary = "white";
    g.colors.roles.dark.primary = "neutral-50";
  });
  expect(out).toMatch(/\*\*Fail\*\* \(use `neutral-\d+`\)/);
  expect(out).toMatch(
    /\| `onPrimary` \| `primary` \| dark \| [\d.]+:1 \| 4.5:1 \| \*\*Fail\*\* \|/,
  );
});
