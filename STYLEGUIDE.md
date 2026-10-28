# Styleguide Generator: app styleguide

The app's own interface follows the shared **mk-styleguide** design system. Its full guide is vendored at [styleguide/STYLEGUIDE.md](styleguide/STYLEGUIDE.md), and its tokens at [styleguide/tokens.css](styleguide/tokens.css), which is loaded globally in `src/main.tsx`. Follow that guide. This file only covers how it maps onto this app. This file is about the app's interface, not the guides the app generates. For code conventions see [AGENTS.md](AGENTS.md).

## How the tokens are wired

- **Plain CSS** (`src/index.css`) uses the role variables directly: `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-link`, `--font-heading` and so on. They follow `<html data-theme>`, which `useThemeMode` sets.
- **antd** can't read CSS variables, so `src/theme.ts` holds a hex mirror of the same roles (`palette`, `lime`). Keep it in step with `styleguide/tokens.css`.
  - antd's `colorPrimary` is the **link** role: olive `#476700` in light mode, lime in dark. This drives links, focus, checkboxes, steps and selected states.
  - Primary buttons override it to the **lime fill** (`#BAFF39`) with dark text. All buttons are pills.
  - Cards use the surface color. Inputs and the page use the background color.
- **Headings** (h1–h4, including antd `Typography.Title`) use Poppins. Everything else uses Inter. File previews use JetBrains Mono.

## App-specific rules

- Everything inside `.sgp` (the live preview) is styled only by the guide being edited, whose variables are set inline on `.sgp`. Never use the app's own tokens or antd tokens there. Outside `.sgp`, never use the edited guide's values.
- Icons are `@ant-design/icons`, outlined variants only. The mk-styleguide calls for Lucide, but antd's icons are kept here to match its components.
