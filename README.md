# Styleguide Generator

A web app that walks you through defining a brand's visual and verbal style, one section at a time, and produces a **STYLEGUIDE.md written for AI coding agents**, plus matching design tokens. Hand the files to an agent (or drop them in a repo) and it can style a site from tokens instead of guessing colors, fonts and spacing.

Live at **https://mkokes.github.io/styleguide-generator/**. It runs entirely in the browser: no account and no server, and your work is saved in local storage.

## What you get

| File                                  | What it is                                                                                                                                                                                                                                                  |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `STYLEGUIDE.md`                       | The guide: voice, semantic color roles, palette, contrast results, type scale, spacing/radius/shadow/motion, logo and icon rules, component recipes, accessibility, per-section do/don't lists and a code-review checklist. Every value is tied to a token. |
| `tokens.css`                          | CSS custom properties with light/dark role overrides (`[data-theme="dark"]` or the OS preference).                                                                                                                                                          |
| `tailwind.css` / `tailwind.config.js` | Tailwind v4 `@theme` entry, or a v3 config.                                                                                                                                                                                                                 |
| `tokens.json`                         | W3C Design Tokens (DTCG) for Style Dictionary, Figma plugins and similar tools.                                                                                                                                                                             |

Download the files one at a time, or together as a `.zip` that also includes your logo upload.

## The wizard

1. **Basics & voice**: name, description, audience, personality, voice, and writing do/don'ts.
2. **Color**: eight base colors become 11-step OKLCH scales (each step can be overridden). Semantic roles are mapped for light and dark mode, and WCAG contrast is checked, with one-click fixes.
3. **Typography**: Google Fonts search (or custom/licensed fonts), weights, and a modular type scale with per-step overrides.
4. **Spacing & motion**: spacing scale, radius, elevation, durations, easings, and breakpoints.
5. **Logo & imagery**: logo files and paths, minimum size, clear space, misuse rules, and photography style.
6. **Iconography**: library, style, sizes, and stroke.
7. **Components & a11y**: WCAG target, focus style, reduced motion, and notes per component.
8. **Review & export**: choose outputs, then preview, copy or download them.

A live sample page beside the form is styled only by the generated variables, with its own light/dark toggle. You can start from scratch or from one of four presets (Corporate, Playful, Minimal, Editorial). Guides can be duplicated, exported or imported as project files, and shared as a compressed link.

## Development

```bash
npm ci
npm run dev             # http://localhost:5173/styleguide-generator/
npm test
npm run build
```

See [AGENTS.md](AGENTS.md) for project structure and conventions.

## License

[GPL-3.0-or-later](LICENSE)
