# Snapshot editorial Styleguide

> Written for AI coding agents and the developers working with them. Every value below is a
> design token: **reference the token, never the raw value.** If you need something this guide
> doesn't cover, use the closest token and flag the gap instead of inventing a new value.

## Overview

_No description yet._

**Personality:** Thoughtful, Refined, Authoritative

## Voice and tone

Considered and articulate. Write like a good magazine: specific, vivid, never padded.

**Do**

- Use specific, concrete details
- Write headlines in sentence case

**Don't**

- Use clickbait headlines

## Using these tokens

| File | Purpose |
| --- | --- |
| `tokens.css` | CSS custom properties, with dark-mode overrides. Import once, globally. |
| `tailwind.css` | Tailwind v4 CSS entry (`@theme`). Use instead of tokens.css in Tailwind projects. |
| `tokens.json` | W3C Design Tokens (DTCG) for Style Dictionary, Figma plugins and other tools. |

- Style with CSS custom properties (`var(--color-primary)`, `var(--space-4)`, `var(--radius-md)`) or the matching Tailwind utilities listed in each table.
- Never hardcode a hex code, px size, font name, shadow or easing that a token already represents.
- Use **role** colors (`--color-bg`, `--color-text`, `--color-link`...) for UI. They switch automatically in dark mode. Use raw palette steps only for illustrations, charts and one-off accents.
- Dark mode is driven by `data-theme="dark"` on `<html>`, falling back to the OS preference unless `data-theme="light"` is set.

## Color

### Semantic roles

| Role | Use for | Light | Dark | CSS variable | Tailwind |
| --- | --- | --- | --- | --- | --- |
| `bg` | Page background | white | `--color-neutral-950` | `var(--color-bg)` | `*-bg` |
| `surface` | Cards, panels, menus and other raised areas | `--color-neutral-50` | `--color-neutral-900` | `var(--color-surface)` | `*-surface` |
| `text` | Body text and headings | `--color-neutral-900` | `--color-neutral-50` | `var(--color-text)` | `*-text` |
| `textMuted` | Secondary text, captions, placeholders | `--color-neutral-700` | `--color-neutral-400` | `var(--color-text-muted)` | `*-text-muted` |
| `border` | Dividers and input/card borders | `--color-neutral-200` | `--color-neutral-800` | `var(--color-border)` | `*-border` |
| `primary` | Fill for primary actions and selected states | `--color-primary-600` | `--color-primary-400` | `var(--color-primary)` | `*-primary` |
| `onPrimary` | Text and icons placed on a primary fill | white | `--color-neutral-950` | `var(--color-on-primary)` | `*-on-primary` |
| `link` | Links, focus rings, current nav item, brand-colored text and icons on the background | `--color-primary-600` | `--color-primary-300` | `var(--color-link)` | `*-link` |
| `success` | Success messages and icons | `--color-success-700` | `--color-success-400` | `var(--color-success)` | `*-success` |
| `warning` | Warning messages and icons | `--color-warning-700` | `--color-warning-400` | `var(--color-warning)` | `*-warning` |
| `danger` | Errors, destructive actions | `--color-danger-600` | `--color-danger-400` | `var(--color-danger)` | `*-danger` |
| `info` | Informational messages and icons | `--color-info-700` | `--color-info-400` | `var(--color-info)` | `*-info` |

### Palette

Each color has an 11-step scale. Token: `--color-<name>-<step>`, Tailwind `*-<name>-<step>`.

| Step | primary | secondary | accent | neutral | success | warning | danger | info |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 50 | `#fff4f4` | `#f3f7ff` | `#fff5e8` | `#f8f6f5` | `#e8feeb` | `#fff5ed` | `#fff4f2` | `#f3f7ff` |
| 100 | `#ffe3e5` | `#e2ebff` | `#ffe7c7` | `#edebe9` | `#d2f6d7` | `#ffe6d4` | `#ffe4e0` | `#e1ecff` |
| 200 | `#ffc9cd` | `#c9d9fb` | `#f7d3a0` | `#dcd8d6` | `#b3e9bb` | `#ffcea9` | `#ffcbc4` | `#c6daff` |
| 300 | `#f6a9af` | `#acc1ee` | `#e8b871` | `#c4c0bd` | `#8bd699` | `#f7af76` | `#ffa69b` | `#a0c1ff` |
| 400 | `#e0828c` | `#87a1d9` | `#ca8a04` | `#a6a09c` | `#55ba6d` | `#d97706` | `#fa7064` | `#6e9fff` |
| 500 | `#cb5f6d` | `#6884c4` | `#b27900` | `#8b8580` | `#16a34a` | `#c66b00` | `#e6433b` | `#447ef9` |
| 600 | `#b63e53` | `#4e6cb1` | `#946400` | `#78716c` | `#008539` | `#a45800` | `#dc2626` | `#2563eb` |
| 700 | `#9f1239` | `#3856a0` | `#7a5200` | `#605955` | `#006e2d` | `#884800` | `#ac0310` | `#174ec7` |
| 800 | `#88022d` | `#1e3a8a` | `#614000` | `#4c4643` | `#005722` | `#6c3800` | `#8b0009` | `#0a3ba5` |
| 900 | `#6d0022` | `#173079` | `#4d3200` | `#3c3734` | `#00451a` | `#562b00` | `#6f0006` | `#022b8a` |
| 950 | `#4a0014` | `#0a1c58` | `#332000` | `#272321` | `#002d0e` | `#391b00` | `#4b0003` | `#001a61` |

### Contrast

Target: **WCAG AA**. Text needs 4.5:1; UI elements such as primary-on-background need 3:1.

| Foreground | Background | Mode | Ratio | Required | Result |
| --- | --- | --- | --- | --- | --- |
| `text` | `bg` | light | 11.74:1 | 4.5:1 | Pass |
| `text` | `surface` | light | 10.90:1 | 4.5:1 | Pass |
| `textMuted` | `bg` | light | 6.87:1 | 4.5:1 | Pass |
| `textMuted` | `surface` | light | 6.38:1 | 4.5:1 | Pass |
| `onPrimary` | `primary` | light | 5.52:1 | 4.5:1 | Pass |
| `link` | `bg` | light | 5.52:1 | 4.5:1 | Pass |
| `link` | `surface` | light | 5.13:1 | 4.5:1 | Pass |
| `success` | `bg` | light | 6.43:1 | 4.5:1 | Pass |
| `warning` | `bg` | light | 7.06:1 | 4.5:1 | Pass |
| `danger` | `bg` | light | 4.83:1 | 4.5:1 | Pass |
| `info` | `bg` | light | 7.12:1 | 4.5:1 | Pass |
| `text` | `bg` | dark | 14.45:1 | 4.5:1 | Pass |
| `text` | `surface` | dark | 10.90:1 | 4.5:1 | Pass |
| `textMuted` | `bg` | dark | 6.03:1 | 4.5:1 | Pass |
| `textMuted` | `surface` | dark | 4.55:1 | 4.5:1 | Pass |
| `onPrimary` | `primary` | dark | 5.74:1 | 4.5:1 | Pass |
| `link` | `bg` | dark | 8.31:1 | 4.5:1 | Pass |
| `link` | `surface` | dark | 6.27:1 | 4.5:1 | Pass |
| `success` | `bg` | dark | 6.40:1 | 4.5:1 | Pass |
| `warning` | `bg` | dark | 4.89:1 | 4.5:1 | Pass |
| `danger` | `bg` | dark | 5.61:1 | 4.5:1 | Pass |
| `info` | `bg` | dark | 5.98:1 | 4.5:1 | Pass |

**Do**

- Use `var(--color-primary)` as the fill for the single most important action on a screen, and put its text and icons in `var(--color-on-primary)`.
- Use `var(--color-link)` (not `primary`) for links, focus rings, the current nav item and brand-colored text or icons on the background.
- Only pair foreground and background roles that pass in the contrast table.

**Don't**

- Hardcode hex values, even ones that match a palette step.
- Use a raw palette step where a role exists; it won't adapt to dark mode.
- Use `primary` as a large background fill; it is an accent.
- Signal state with color alone; pair it with an icon or text.

## Typography

| Use | Family | Weights | CSS variable | Tailwind | Load from |
| --- | --- | --- | --- | --- | --- |
| Headings | Playfair Display | 600, 700 | `var(--font-heading)` | `font-heading` | [Google Fonts](https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap) |
| Body | Source Serif 4 | 400, 600 | `var(--font-body)` | `font-body` | [Google Fonts](https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap) |
| Code | IBM Plex Mono | 400 | `var(--font-mono)` | `font-mono` | [Google Fonts](https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&display=swap) |

### Type scale

Base size 18px, ratio 1.333. Use `--text-<step>` with its companion `--text-<step>--line-height`, `--letter-spacing` and `--font-weight` variables (Tailwind `text-<step>` applies all four).

| Step | Size | Line height | Weight | Letter spacing | CSS variable |
| --- | --- | --- | --- | --- | --- |
| `xs` | 11px / 0.6875rem | 1.5 | 400 | 0em | `var(--text-xs)` |
| `sm` | 13.5px / 0.8438rem | 1.5 | 400 | 0em | `var(--text-sm)` |
| `base` | 18px / 1.125rem | 1.6 | 400 | 0em | `var(--text-base)` |
| `lg` | 23.99px / 1.4994rem | 1.5 | 400 | 0em | `var(--text-lg)` |
| `xl` | 31.98px / 1.9988rem | 1.35 | 700 | -0.01em | `var(--text-xl)` |
| `2xl` | 42.63px / 2.6644rem | 1.25 | 700 | -0.01em | `var(--text-2xl)` |
| `3xl` | 56.83px / 3.5519rem | 1.15 | 700 | -0.02em | `var(--text-3xl)` |
| `4xl` | 75.76px / 4.735rem | 1.1 | 700 | -0.02em | `var(--text-4xl)` |

### Elements

| Element | Step | Family |
| --- | --- | --- |
| h1 | `4xl` | `var(--font-heading)` |
| h2 | `3xl` | `var(--font-heading)` |
| h3 | `2xl` | `var(--font-heading)` |
| h4 | `xl` | `var(--font-heading)` |
| Lead paragraph | `lg` | `var(--font-body)` |
| Body | `base` | `var(--font-body)` |
| Small / UI labels | `sm` | `var(--font-body)` |
| Caption | `xs` | `var(--font-body)` |

**Do**

- Use `var(--font-heading)` for h1–h4 and `var(--font-body)` for everything else.
- Use `var(--font-mono)` only for code, keyboard keys and tabular IDs.
- Keep body text measure between 60 and 75 characters

**Don't**

- Introduce font families or font sizes that are not in this guide.
- Use weights that are not loaded (heading and body use 400, 600, 700).
- Set body text below the base step for paragraphs.

## Spacing and layout

### Spacing

Multiples of 4px. Tailwind spacing utilities use the same numbers (`p-4` = `--space-4`).

| Token | Value |
| --- | --- |
| `var(--space-0)` | 0px / 0rem |
| `var(--space-1)` | 4px / 0.25rem |
| `var(--space-2)` | 8px / 0.5rem |
| `var(--space-3)` | 12px / 0.75rem |
| `var(--space-4)` | 16px / 1rem |
| `var(--space-6)` | 24px / 1.5rem |
| `var(--space-8)` | 32px / 2rem |
| `var(--space-12)` | 48px / 3rem |
| `var(--space-16)` | 64px / 4rem |
| `var(--space-24)` | 96px / 6rem |

### Radius

| Token | Value | Tailwind |
| --- | --- | --- |
| `var(--radius-none)` | 0px | `rounded-none` |
| `var(--radius-sm)` | 2px | `rounded-sm` |
| `var(--radius-md)` | 2px | `rounded-md` |
| `var(--radius-lg)` | 4px | `rounded-lg` |
| `var(--radius-xl)` | 6px | `rounded-xl` |
| `var(--radius-full)` | 9999px | `rounded-full` |

### Elevation

| Token | Value | Tailwind |
| --- | --- | --- |
| `var(--shadow-sm)` | `0 1px 2px 0px rgb(0 0 0 / 0.06)` | `shadow-sm` |
| `var(--shadow-md)` | `0 4px 12px -2px rgb(0 0 0 / 0.1)` | `shadow-md` |
| `var(--shadow-lg)` | `0 12px 32px -4px rgb(0 0 0 / 0.14)` | `shadow-lg` |

### Motion

| Token | Value |
| --- | --- |
| `var(--duration-fast)` | 120ms |
| `var(--duration-normal)` | 200ms |
| `var(--duration-slow)` | 320ms |
| `var(--ease-standard)` | `cubic-bezier(0.2, 0, 0, 1)` |
| `var(--ease-enter)` | `cubic-bezier(0, 0, 0, 1)` |
| `var(--ease-exit)` | `cubic-bezier(0.3, 0, 1, 1)` |

### Breakpoints

Mobile-first: write base styles for small screens, then add `min-width` media queries.

| Name | Min width |
| --- | --- |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |

**Do**

- Use spacing tokens for every margin, padding and gap.
- Use `--ease-enter` for things appearing, `--ease-exit` for things leaving, `--ease-standard` otherwise.

**Don't**

- Use arbitrary px values for spacing, radius or shadows.
- Animate layout properties (width, height, top) when a transform or opacity change would do.

## Iconography

- **Library:** not specified
- **Style:** outline
- **Sizes:** 16px, 20px, 24px
- **Stroke width:** 1.5px

**Do**

- Use icons in the outline style at one of the listed sizes.
- Color icons with currentColor so they inherit the text role.
- Give icon-only buttons an accessible label.

**Don't**

- Mix icon libraries or styles.
- Scale icons with CSS transforms; use the right size from the scale.

## Components

### Button

- **Primary:** background `var(--color-primary)`, text `var(--color-on-primary)`, radius `var(--radius-md)`, padding `var(--space-2)` `var(--space-4)`, `var(--font-body)` at `--text-sm` weight 600.
- **Hover:** background `--color-primary-700` (light) / `--color-primary-300` (dark). **Active:** one step further. **Disabled:** 50% opacity, no pointer events.
- **Secondary:** transparent background, 1px `var(--color-border)` border, text `var(--color-text)`.
- **Destructive:** background `var(--color-danger)`, text white.
- Transition background-color over `var(--duration-fast)` `var(--ease-standard)`.

### Text input

- Background `var(--color-bg)`, 1px `var(--color-border)` border, radius `var(--radius-md)`, padding `var(--space-2)` `var(--space-3)`, `--text-base`.
- Label above the field in `--text-sm`, weight 500. Help text below in `var(--color-text-muted)`.
- **Focus:** border `var(--color-link)` plus the focus ring. **Error:** border and message in `var(--color-danger)`.

### Card

- Background `var(--color-surface)`, 1px `var(--color-border)` border, radius `var(--radius-lg)`, padding `var(--space-6)`, shadow `var(--shadow-sm)`.
- Interactive cards raise to `var(--shadow-md)` on hover.

### Alert

- Background `var(--color-surface)`, 1px border and leading icon in the status role (`--color-success`, `--color-warning`, `--color-danger`, `--color-info`), text `var(--color-text)`, radius `var(--radius-md)`, padding `var(--space-3)` `var(--space-4)`.
- Always include a text label for the status, not just the color.

### Navigation bar

- Background `var(--color-bg)` with a 1px `var(--color-border)` bottom border.
- Links in `var(--color-text-muted)`, `var(--color-text)` on hover, `var(--color-link)` for the current page (also mark it with `aria-current="page"`).

## Accessibility

- Meet **WCAG 2.2 AA**.
- **Focus:** 2px solid outline in the link role color, offset 2px. Show it on `:focus-visible`; never remove outlines without a replacement.
- Interactive targets are at least 24×24px.
- Respect `prefers-reduced-motion`: wrap non-essential animation in `@media (prefers-reduced-motion: no-preference)`.
- Use semantic HTML first; add ARIA only when no native element fits.

## Code-review checklist

Flag any of these in a change:

- A hardcoded color, size, font, radius, shadow, duration or easing that a token covers.
- A raw palette step used for text or backgrounds where a role token exists.
- A foreground/background pair that fails the contrast table.
- `primary` used as a large fill instead of an accent.
- A font family, weight or size outside this guide.
- Spacing that isn't on the spacing scale.
- Icons from another library or style, or icons resized with CSS transforms.
- A missing or removed focus indicator.
- Animation that ignores prefers-reduced-motion.
- UI copy that breaks the voice and tone rules.
