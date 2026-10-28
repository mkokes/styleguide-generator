# Styleguide Generator — app styleguide

The visual style of this app's own interface. It does not cover the guides the app generates. See [AGENTS.md](AGENTS.md) for code conventions.

## Color

The palette is defined twice and must match: `palette` in [src/theme.ts](src/theme.ts) feeds the antd theme, and the `--app-*` custom properties in [src/index.css](src/index.css) feed plain CSS.

| Role             | Light     | Dark      | antd token             | CSS variable           |
| ---------------- | --------- | --------- | ---------------------- | ---------------------- |
| Primary / accent | `#6D4AFF` | `#A08BFF` | `colorPrimary`         | (use antd components)  |
| Page background  | `#F7F6FB` | `#16141F` | `colorBgLayout`        | `--app-bg`             |
| Surface          | `#FFFFFF` | `#1F1C2B` | `colorBgContainer`     | `--app-surface`        |
| Text             | `#1E1B2E` | `#ECEAF4` | `colorText`            | `--app-text`           |
| Secondary text   | `#5F5A73` | `#A9A4BC` | `colorTextSecondary`   | `--app-text-secondary` |
| Border           | `#E6E3EF` | `#2F2B3F` | `colorBorderSecondary` | `--app-border`         |

- Use antd components and their tokens first. Use the `--app-*` variables only in `index.css` for layout chrome.
- Keep primary for actions and the current step. Don't use it for large fills.
- Everything inside `.sgp` (the live preview) is styled only by the generated guide's variables. Never style it with app tokens.

## Typography

- **Inter Variable** (`@fontsource-variable/inter`), set as the antd `fontFamily` and on `body`.
- Use antd `Typography` levels for headings: page titles are `level={2}`, sections `level={4}`.

## Shape and spacing

- antd `borderRadius: 8`. Swatches use 4px.
- Spacing follows antd's 8px rhythm (8/12/16/24/32).

## Iconography

- `@ant-design/icons`, outlined variants only.

## Applying this in code review

- No hex values in components. Use antd tokens, or add a variable to both `theme.ts` and `index.css`.
- No new font families.
- No filled or two-tone icon variants.
- Preview styles (`src/preview/preview.css`) must only reference guide tokens (`--color-*`, `--space-*`, ...), with fallbacks where a token may be missing from a user's scale.
