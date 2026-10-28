import {
  COLOR_KEYS,
  ROLE_KEYS,
  SCALE_STEPS,
  TYPE_STEPS,
  type ColorRef,
  type ComponentKey,
  type Guide,
  type RoleKey,
  type Rules,
} from "../model/types";
import { buildScales, checkContrast, parseRef } from "../lib/color";
import { ELEMENT_STEPS, buildTypeScale } from "../lib/typeScale";
import { commentSafe, easingCss, kebab, rem, roleVar, shadowCss, spaceName } from "../lib/tokens";
import { fontCssUrl } from "../lib/fonts";
import { outputFiles } from "./files";
import { ROLE_USAGE } from "../model/labels";

const code = (s: string | number) => `\`${s}\``;
const v = (name: string) => code(`var(${name})`);

export function table(headers: string[], rows: (string | number)[][]): string {
  const esc = (c: string | number) => String(c).replace(/\|/g, "\\|").replace(/\n/g, " ");
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.map(esc).join(" | ")} |`),
  ].join("\n");
}

export function list(items: string[]): string {
  return items.map((i) => `- ${i}`).join("\n");
}

function section(title: string, ...parts: (string | false | undefined)[]): string {
  return [`## ${title}`, ...parts.filter(Boolean)].join("\n\n");
}

function rulesBlock(auto: Rules, user: Rules): string | false {
  const dos = [...auto.do, ...user.do];
  const donts = [...auto.dont, ...user.dont];
  if (!dos.length && !donts.length) return false;
  return [dos.length && `**Do**\n\n${list(dos)}`, donts.length && `**Don't**\n\n${list(donts)}`]
    .filter(Boolean)
    .join("\n\n");
}

/** Moves a palette ref `delta` steps along its scale, clamped to the ends. */
export function shiftRef(ref: ColorRef, delta: number): ColorRef {
  const parsed = parseRef(ref);
  if (!parsed) return ref;
  const i = Math.min(Math.max(SCALE_STEPS.indexOf(parsed.step) + delta, 0), SCALE_STEPS.length - 1);
  return `${parsed.color}-${SCALE_STEPS[i]}`;
}

function refName(ref: ColorRef): string {
  return ref === "white" || ref === "black" ? ref : code(`--color-${ref}`);
}

export function generateMarkdown(guide: Guide): string {
  const { basics, typography: t, layout: l } = guide;
  const scales = buildScales(guide.colors);
  const type = buildTypeScale(t);
  const tw = guide.outputs.tailwind;
  const twRole = (r: RoleKey) => code(`*-${tw === "v3" ? "role-" : ""}${kebab(r)}`);
  const user = guide.rules;

  // Nearest available spacing token to a multiplier, so recipes never cite a missing token.
  const sp = (m: number) =>
    v(
      spaceName(
        l.spacingScale.reduce(
          (a, b) => (Math.abs(b - m) < Math.abs(a - m) ? b : a),
          l.spacingScale[0] ?? 0,
        ),
      ),
    );

  const out: string[] = [];

  out.push(
    `# ${commentSafe(basics.name)} Styleguide`,
    [
      "> Written for AI coding agents and the developers working with them. Every value below is a",
      "> design token: **reference the token, never the raw value.** If you need something this guide",
      "> doesn't cover, use the closest token and flag the gap instead of inventing a new value.",
    ].join("\n"),
  );

  // Overview and voice
  const meta = [
    basics.audience && `**Audience:** ${basics.audience}`,
    basics.personality.length > 0 && `**Personality:** ${basics.personality.join(", ")}`,
  ].filter(Boolean) as string[];
  out.push(
    section(
      "Overview",
      basics.description || "_No description yet._",
      meta.length > 0 && meta.join("  \n"),
    ),
  );
  if (basics.voice || basics.writingDo.length || basics.writingDont.length) {
    out.push(
      section(
        "Voice and tone",
        basics.voice,
        rulesBlock({ do: [], dont: [] }, { do: basics.writingDo, dont: basics.writingDont }),
      ),
    );
  }

  // How to use the tokens
  const files = outputFiles(guide).filter((f) => f.name !== "STYLEGUIDE.md");
  out.push(
    section(
      "Using these tokens",
      files.length > 0 &&
        table(
          ["File", "Purpose"],
          files.map((f) => [code(f.name), f.purpose]),
        ),
      list([
        `Style with CSS custom properties (${v("--color-primary")}, ${v("--space-4")}, ${v("--radius-md")})${tw !== "off" ? " or the matching Tailwind utilities listed in each table" : ""}.`,
        "Never hardcode a hex code, px size, font name, shadow or easing that a token already represents.",
        `Use **role** colors (${code("--color-bg")}, ${code("--color-text")}, ${code("--color-link")}...) for UI. They switch automatically in dark mode. Use raw palette steps only for illustrations, charts and one-off accents.`,
        `Dark mode is driven by ${code('data-theme="dark"')} on ${code("<html>")}, falling back to the OS preference unless ${code('data-theme="light"')} is set.`,
      ]),
    ),
  );

  // Color
  const contrast = checkContrast(guide, scales);
  const colorAuto: Rules = {
    do: [
      `Use ${v("--color-primary")} as the fill for the single most important action on a screen, and put its text and icons in ${v("--color-on-primary")}.`,
      `Use ${v("--color-link")} (not ${code("primary")}) for links, focus rings, the current nav item and brand-colored text or icons on the background.`,
      "Only pair foreground and background roles that pass in the contrast table.",
    ],
    dont: [
      "Hardcode hex values, even ones that match a palette step.",
      "Use a raw palette step where a role exists; it won't adapt to dark mode.",
      `Use ${code("primary")} as a large background fill; it is an accent.`,
      "Signal state with color alone; pair it with an icon or text.",
    ],
  };
  out.push(
    section(
      "Color",
      "### Semantic roles",
      table(
        ["Role", "Use for", "Light", "Dark", "CSS variable", ...(tw !== "off" ? ["Tailwind"] : [])],
        ROLE_KEYS.map((r) => [
          code(r),
          ROLE_USAGE[r],
          refName(guide.colors.roles.light[r]),
          refName(guide.colors.roles.dark[r]),
          v(roleVar(r)),
          ...(tw !== "off" ? [twRole(r)] : []),
        ]),
      ),
      "### Palette",
      `Each color has an 11-step scale. Token: ${code("--color-<name>-<step>")}${tw !== "off" ? `, Tailwind ${code("*-<name>-<step>")}` : ""}.`,
      table(
        ["Step", ...COLOR_KEYS],
        SCALE_STEPS.map((s) => [s, ...COLOR_KEYS.map((k) => code(scales[k][s]))]),
      ),
      "### Contrast",
      `Target: **WCAG ${guide.accessibility.target}**. Text needs ${guide.accessibility.target === "AAA" ? "7" : "4.5"}:1; UI elements such as primary-on-background need 3:1.`,
      table(
        ["Foreground", "Background", "Mode", "Ratio", "Required", "Result"],
        contrast.map((c) => [
          code(c.fg),
          code(c.bg),
          c.mode,
          `${c.ratio.toFixed(2)}:1`,
          `${c.required}:1`,
          c.pass ? "Pass" : `**Fail**${c.suggestion ? ` (use ${code(c.suggestion)})` : ""}`,
        ]),
      ),
      rulesBlock(colorAuto, user.color),
    ),
  );

  // Typography
  const fams = [
    ["Headings", t.heading, "--font-heading", "font-heading"],
    ["Body", t.body, "--font-body", "font-body"],
    ["Code", t.mono, "--font-mono", "font-mono"],
  ] as const;
  const usedWeights = [...new Set([...t.heading.weights, ...t.body.weights])].sort((a, b) => a - b);
  out.push(
    section(
      "Typography",
      table(
        [
          "Use",
          "Family",
          "Weights",
          "CSS variable",
          ...(tw !== "off" ? ["Tailwind"] : []),
          "Load from",
        ],
        fams.map(([use, f, token, cls]) => [
          use,
          f.name,
          f.weights.join(", "),
          v(token),
          ...(tw !== "off" ? [code(cls)] : []),
          f.source === "google" ? `[Google Fonts](${fontCssUrl([f])})` : "Self-hosted / licensed",
        ]),
      ),
      "### Type scale",
      `Base size ${t.baseSize}px, ratio ${t.ratio}. Use ${code("--text-<step>")} with its companion ${code("--text-<step>--line-height")}, ${code("--letter-spacing")} and ${code("--font-weight")} variables${tw === "v4" ? ` (Tailwind ${code("text-<step>")} applies all four)` : ""}.`,
      table(
        ["Step", "Size", "Line height", "Weight", "Letter spacing", "CSS variable"],
        TYPE_STEPS.map((k) => {
          const s = type[k];
          return [
            code(k),
            `${s.size}px / ${rem(s.size)}`,
            s.lineHeight,
            s.weight,
            `${s.letterSpacing}em`,
            v(`--text-${k}`),
          ];
        }),
      ),
      "### Elements",
      table(
        ["Element", "Step", "Family"],
        ELEMENT_STEPS.map((e) => [e.element, code(e.step), v(`--font-${e.font}`)]),
      ),
      rulesBlock(
        {
          do: [
            `Use ${v("--font-heading")} for h1–h4 and ${v("--font-body")} for everything else.`,
            `Use ${v("--font-mono")} only for code, keyboard keys and tabular IDs.`,
          ],
          dont: [
            "Introduce font families or font sizes that are not in this guide.",
            `Use weights that are not loaded (heading and body use ${usedWeights.join(", ")}).`,
            "Set body text below the base step for paragraphs.",
          ],
        },
        user.typography,
      ),
    ),
  );

  // Layout
  out.push(
    section(
      "Spacing and layout",
      `### Spacing\n\nMultiples of ${l.spacingBase}px.${tw !== "off" ? ` Tailwind spacing utilities use the same numbers (${code("p-4")} = ${code("--space-4")}).` : ""}`,
      table(
        ["Token", "Value"],
        l.spacingScale.map((m) => [
          v(spaceName(m)),
          `${m * l.spacingBase}px / ${rem(m * l.spacingBase)}`,
        ]),
      ),
      "### Radius",
      table(
        ["Token", "Value", ...(tw !== "off" ? ["Tailwind"] : [])],
        Object.entries(l.radius).map(([k, val]) => [
          v(`--radius-${k}`),
          `${val}px`,
          ...(tw !== "off" ? [code(`rounded-${k}`)] : []),
        ]),
      ),
      "### Elevation",
      table(
        ["Token", "Value", ...(tw !== "off" ? ["Tailwind"] : [])],
        Object.entries(l.shadow).map(([k, s]) => [
          v(`--shadow-${k}`),
          code(shadowCss(s)),
          ...(tw !== "off" ? [code(`shadow-${k}`)] : []),
        ]),
      ),
      "### Motion",
      table(
        ["Token", "Value"],
        [
          ...Object.entries(l.duration).map(([k, val]) => [v(`--duration-${k}`), `${val}ms`]),
          ...Object.entries(l.easing).map(([k, e]) => [v(`--ease-${k}`), code(easingCss(e))]),
        ],
      ),
      "### Breakpoints",
      `Mobile-first: write base styles for small screens, then add ${code("min-width")} media queries.`,
      table(
        ["Name", "Min width"],
        Object.entries(l.breakpoints).map(([k, val]) => [code(k), `${val}px`]),
      ),
      rulesBlock(
        {
          do: [
            "Use spacing tokens for every margin, padding and gap.",
            `Use ${code("--ease-enter")} for things appearing, ${code("--ease-exit")} for things leaving, ${code("--ease-standard")} otherwise.`,
          ],
          dont: [
            "Use arbitrary px values for spacing, radius or shadows.",
            "Animate layout properties (width, height, top) when a transform or opacity change would do.",
          ],
        },
        user.layout,
      ),
    ),
  );

  // Logo
  const logo = guide.logo;
  if (
    logo.variants.length ||
    logo.minSize ||
    logo.clearSpace ||
    logo.misuse.length ||
    user.logo.do.length ||
    user.logo.dont.length
  ) {
    out.push(
      section(
        "Logo",
        logo.variants.length > 0 &&
          table(
            ["Variant", "File", "Use on"],
            logo.variants.map((x) => [
              x.name,
              code(x.path),
              x.background === "any" ? "Any background" : `${x.background} backgrounds`,
            ]),
          ),
        (logo.minSize || logo.clearSpace) &&
          list(
            [
              logo.minSize && `**Minimum size:** ${logo.minSize}`,
              logo.clearSpace && `**Clear space:** ${logo.clearSpace}`,
            ].filter(Boolean) as string[],
          ),
        rulesBlock(
          {
            do: ["Use the provided logo files as-is; pick the variant made for the background."],
            dont: logo.misuse,
          },
          user.logo,
        ),
      ),
    );
  }

  // Iconography
  const ic = guide.icons;
  out.push(
    section(
      "Iconography",
      list(
        [
          ic.library ? `**Library:** ${ic.library}` : "**Library:** not specified",
          `**Style:** ${ic.style}`,
          `**Sizes:** ${ic.sizes.map((s) => `${s}px`).join(", ")}`,
          ic.style !== "filled" ? `**Stroke width:** ${ic.stroke}px` : "",
        ].filter(Boolean),
      ),
      rulesBlock(
        {
          do: [
            `Use ${ic.library ? `${ic.library} icons` : "icons"} in the ${ic.style} style at one of the listed sizes.`,
            "Color icons with currentColor so they inherit the text role.",
            "Give icon-only buttons an accessible label.",
          ],
          dont: [
            "Mix icon libraries or styles.",
            "Scale icons with CSS transforms; use the right size from the scale.",
          ],
        },
        user.icons,
      ),
    ),
  );

  // Imagery
  if (guide.imagery.style || user.imagery.do.length || user.imagery.dont.length) {
    out.push(
      section("Imagery", guide.imagery.style, rulesBlock({ do: [], dont: [] }, user.imagery)),
    );
  }

  // Components
  const light = guide.colors.roles.light;
  const dark = guide.colors.roles.dark;
  const hover = `${code(`--color-${shiftRef(light.primary, 1)}`)} (light) / ${code(`--color-${shiftRef(dark.primary, -1)}`)} (dark)`;
  const recipes: Record<ComponentKey, string[]> = {
    button: [
      `**Primary:** background ${v("--color-primary")}, text ${v("--color-on-primary")}, radius ${v("--radius-md")}, padding ${sp(2)} ${sp(4)}, ${v("--font-body")} at ${code("--text-sm")} weight 600.`,
      `**Hover:** background ${hover}. **Active:** one step further. **Disabled:** 50% opacity, no pointer events.`,
      `**Secondary:** transparent background, 1px ${v("--color-border")} border, text ${v("--color-text")}.`,
      `**Destructive:** background ${v("--color-danger")}, text white.`,
      `Transition background-color over ${v("--duration-fast")} ${v("--ease-standard")}.`,
    ],
    input: [
      `Background ${v("--color-bg")}, 1px ${v("--color-border")} border, radius ${v("--radius-md")}, padding ${sp(2)} ${sp(3)}, ${code("--text-base")}.`,
      `Label above the field in ${code("--text-sm")}, weight 500. Help text below in ${v("--color-text-muted")}.`,
      `**Focus:** border ${v("--color-link")} plus the focus ring. **Error:** border and message in ${v("--color-danger")}.`,
    ],
    card: [
      `Background ${v("--color-surface")}, 1px ${v("--color-border")} border, radius ${v("--radius-lg")}, padding ${sp(6)}, shadow ${v("--shadow-sm")}.`,
      `Interactive cards raise to ${v("--shadow-md")} on hover.`,
    ],
    alert: [
      `Background ${v("--color-surface")}, 1px border and leading icon in the status role (${["success", "warning", "danger", "info"].map((s) => code(`--color-${s}`)).join(", ")}), text ${v("--color-text")}, radius ${v("--radius-md")}, padding ${sp(3)} ${sp(4)}.`,
      "Always include a text label for the status, not just the color.",
    ],
    nav: [
      `Background ${v("--color-bg")} with a 1px ${v("--color-border")} bottom border.`,
      `Links in ${v("--color-text-muted")}, ${v("--color-text")} on hover, ${v("--color-link")} for the current page (also mark it with ${code('aria-current="page"')}).`,
    ],
  };
  const recipeTitles: Record<ComponentKey, string> = {
    button: "Button",
    input: "Text input",
    card: "Card",
    alert: "Alert",
    nav: "Navigation bar",
  };
  out.push(
    section(
      "Components",
      ...(Object.keys(recipes) as ComponentKey[]).map((k) =>
        [
          `### ${recipeTitles[k]}`,
          list(recipes[k]),
          guide.components.notes[k] && `**Notes:** ${guide.components.notes[k]}`,
        ]
          .filter(Boolean)
          .join("\n\n"),
      ),
      rulesBlock({ do: [], dont: [] }, user.components),
    ),
  );

  // Accessibility
  const a = guide.accessibility;
  out.push(
    section(
      "Accessibility",
      list(
        [
          `Meet **WCAG 2.2 ${a.target}**.`,
          `**Focus:** ${a.focusStyle}. Show it on ${code(":focus-visible")}; never remove outlines without a replacement.`,
          `Interactive targets are at least ${a.target === "AAA" ? "44" : "24"}×${a.target === "AAA" ? "44" : "24"}px.`,
          a.reducedMotion
            ? `Respect ${code("prefers-reduced-motion")}: wrap non-essential animation in ${code("@media (prefers-reduced-motion: no-preference)")}.`
            : "",
          "Use semantic HTML first; add ARIA only when no native element fits.",
        ].filter(Boolean),
      ),
    ),
  );

  // Checklist
  out.push(
    section(
      "Code-review checklist",
      "Flag any of these in a change:",
      list([
        "A hardcoded color, size, font, radius, shadow, duration or easing that a token covers.",
        "A raw palette step used for text or backgrounds where a role token exists.",
        "A foreground/background pair that fails the contrast table.",
        `${code("primary")} used as a large fill instead of an accent.`,
        "A font family, weight or size outside this guide.",
        "Spacing that isn't on the spacing scale.",
        "Icons from another library or style, or icons resized with CSS transforms.",
        "A missing or removed focus indicator.",
        ...(a.reducedMotion ? ["Animation that ignores prefers-reduced-motion."] : []),
        ...(basics.writingDont.length ? ["UI copy that breaks the voice and tone rules."] : []),
      ]),
    ),
  );

  return out.join("\n\n") + "\n";
}
