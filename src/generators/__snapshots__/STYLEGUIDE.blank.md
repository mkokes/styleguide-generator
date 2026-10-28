# Snapshot blank Styleguide

> Written for AI coding agents and the developers working with them. Every value below is a
> design token: **reference the token, never the raw value.** If you need something this guide
> doesn't cover, use the closest token and flag the gap instead of inventing a new value.

## Overview

_No description yet._

## Using these tokens

| File | Purpose |
| --- | --- |
| `tokens.css` | CSS custom properties, with dark-mode overrides. Import once, globally. |
| `tailwind.css` | Tailwind v4 CSS entry (`@theme`). Use instead of tokens.css in Tailwind projects. |
| `tokens.json` | W3C Design Tokens (DTCG) for Style Dictionary, Figma plugins and other tools. |

- Style with CSS custom properties (`var(--color-primary)`, `var(--space-4)`, `var(--radius-md)`) or the matching Tailwind utilities listed in each table.
- Never hardcode a hex code, px size, font name, shadow or easing that a token already represents.
- Use **role** colors (`--color-bg`, `--color-text`, `--color-primary`...) for UI. They switch automatically in dark mode. Use raw palette steps only for illustrations, charts and one-off accents.
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
| `primary` | Primary actions, links, focus rings, selected states | `--color-primary-600` | `--color-primary-400` | `var(--color-primary)` | `*-primary` |
| `onPrimary` | Text and icons placed on a primary background | white | `--color-neutral-950` | `var(--color-on-primary)` | `*-on-primary` |
| `success` | Success messages and icons | `--color-success-700` | `--color-success-400` | `var(--color-success)` | `*-success` |
| `warning` | Warning messages and icons | `--color-warning-700` | `--color-warning-400` | `var(--color-warning)` | `*-warning` |
| `danger` | Errors, destructive actions | `--color-danger-600` | `--color-danger-400` | `var(--color-danger)` | `*-danger` |
| `info` | Informational messages and icons | `--color-info-700` | `--color-info-400` | `var(--color-info)` | `*-info` |

### Palette

Each color has an 11-step scale. Token: `--color-<name>-<step>`, Tailwind `*-<name>-<step>`.

| Step | primary | secondary | accent | neutral | success | warning | danger | info |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 50 | `#f4f6ff` | `#eff8ff` | `#fff5ea` | `#f4f7fc` | `#e8feeb` | `#fff5ed` | `#fff4f2` | `#f3f7ff` |
| 100 | `#e6eaff` | `#d8efff` | `#ffe7cc` | `#e6ecf4` | `#d2f6d7` | `#ffe6d4` | `#ffe4e0` | `#e1ecff` |
| 200 | `#cfd7ff` | `#b2e0ff` | `#ffd099` | `#d2dae5` | `#b3e9bb` | `#ffcea9` | `#ffcbc4` | `#c6daff` |
| 300 | `#b1bcff` | `#78cbff` | `#f59e0b` | `#b7c2d1` | `#8bd699` | `#f7af76` | `#ffa69b` | `#a0c1ff` |
| 400 | `#8a96ff` | `#0ea5e9` | `#dd8d00` | `#95a3b6` | `#55ba6d` | `#d97706` | `#fa7064` | `#6e9fff` |
| 500 | `#6c73fa` | `#0090cd` | `#b87500` | `#78879d` | `#16a34a` | `#c66b00` | `#e6433b` | `#447ef9` |
| 600 | `#4f46e5` | `#0077aa` | `#996000` | `#64748b` | `#008539` | `#a45800` | `#dc2626` | `#2563eb` |
| 700 | `#463bd1` | `#00628d` | `#7e4f00` | `#4e5c70` | `#006e2d` | `#884800` | `#ac0310` | `#174ec7` |
| 800 | `#3729ae` | `#004d71` | `#653e00` | `#3c485a` | `#005722` | `#6c3800` | `#8b0009` | `#0a3ba5` |
| 900 | `#2a1a91` | `#003d59` | `#503000` | `#2e3948` | `#00451a` | `#562b00` | `#6f0006` | `#022b8a` |
| 950 | `#1b056b` | `#00273c` | `#351e00` | `#1c2531` | `#002d0e` | `#391b00` | `#4b0003` | `#001a61` |

### Contrast

Target: **WCAG AA**. Text needs 4.5:1; UI elements such as primary-on-background need 3:1.

| Foreground | Background | Mode | Ratio | Required | Result |
| --- | --- | --- | --- | --- | --- |
| `text` | `bg` | light | 11.70:1 | 4.5:1 | Pass |
| `text` | `surface` | light | 10.90:1 | 4.5:1 | Pass |
| `textMuted` | `bg` | light | 6.80:1 | 4.5:1 | Pass |
| `textMuted` | `surface` | light | 6.33:1 | 4.5:1 | Pass |
| `onPrimary` | `primary` | light | 6.29:1 | 4.5:1 | Pass |
| `primary` | `bg` | light | 6.29:1 | 3:1 | Pass |
| `success` | `bg` | light | 6.43:1 | 4.5:1 | Pass |
| `warning` | `bg` | light | 7.06:1 | 4.5:1 | Pass |
| `danger` | `bg` | light | 4.83:1 | 4.5:1 | Pass |
| `info` | `bg` | light | 7.12:1 | 4.5:1 | Pass |
| `text` | `bg` | dark | 14.40:1 | 4.5:1 | Pass |
| `text` | `surface` | dark | 10.90:1 | 4.5:1 | Pass |
| `textMuted` | `bg` | dark | 6.03:1 | 4.5:1 | Pass |
| `textMuted` | `surface` | dark | 4.56:1 | 4.5:1 | Pass |
| `onPrimary` | `primary` | dark | 5.81:1 | 4.5:1 | Pass |
| `primary` | `bg` | dark | 5.81:1 | 3:1 | Pass |
| `success` | `bg` | dark | 6.35:1 | 4.5:1 | Pass |
| `warning` | `bg` | dark | 4.85:1 | 4.5:1 | Pass |
| `danger` | `bg` | dark | 5.57:1 | 4.5:1 | Pass |
| `info` | `bg` | dark | 5.94:1 | 4.5:1 | Pass |

**Do**

- Use `var(--color-primary)` for the single most important action on a screen, links and focus rings.
- Put text on `primary` backgrounds in `var(--color-on-primary)`.
- Only pair foreground and background roles that pass in the contrast table.

**Don't**

- Hardcode hex values, even ones that match a palette step.
- Use a raw palette step where a role exists; it won't adapt to dark mode.
- Use `primary` as a large background fill; it is an accent.
- Signal state with color alone; pair it with an icon or text.

## Typography

| Use | Family | Weights | CSS variable | Tailwind | Load from |
| --- | --- | --- | --- | --- | --- |
| Headings | Inter | 600, 700 | `var(--font-heading)` | `font-heading` | [Google Fonts](https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap) |
| Body | Inter | 400, 500 | `var(--font-body)` | `font-body` | [Google Fonts](https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap) |
| Code | JetBrains Mono | 400 | `var(--font-mono)` | `font-mono` | [Google Fonts](https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap) |

### Type scale

Base size 16px, ratio 1.25. Use `--text-<step>` with its companion `--text-<step>--line-height`, `--letter-spacing` and `--font-weight` variables (Tailwind `text-<step>` applies all four).

| Step | Size | Line height | Weight | Letter spacing | CSS variable |
| --- | --- | --- | --- | --- | --- |
| `xs` | 11px / 0.6875rem | 1.5 | 400 | 0em | `var(--text-xs)` |
| `sm` | 12.8px / 0.8rem | 1.5 | 400 | 0em | `var(--text-sm)` |
| `base` | 16px / 1rem | 1.6 | 400 | 0em | `var(--text-base)` |
| `lg` | 20px / 1.25rem | 1.5 | 400 | 0em | `var(--text-lg)` |
| `xl` | 25px / 1.5625rem | 1.35 | 700 | -0.01em | `var(--text-xl)` |
| `2xl` | 31.25px / 1.9531rem | 1.25 | 700 | -0.01em | `var(--text-2xl)` |
| `3xl` | 39.06px / 2.4413rem | 1.15 | 700 | -0.02em | `var(--text-3xl)` |
| `4xl` | 48.83px / 3.0519rem | 1.1 | 700 | -0.02em | `var(--text-4xl)` |

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

**Don't**

- Introduce font families or font sizes that are not in this guide.
- Use weights that are not loaded (heading and body use 400, 500, 600, 700).
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
| `var(--radius-sm)` | 4px | `rounded-sm` |
| `var(--radius-md)` | 8px | `rounded-md` |
| `var(--radius-lg)` | 12px | `rounded-lg` |
| `var(--radius-xl)` | 16px | `rounded-xl` |
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
- **Focus:** border `var(--color-primary)` plus the focus ring. **Error:** border and message in `var(--color-danger)`.

### Card

- Background `var(--color-surface)`, 1px `var(--color-border)` border, radius `var(--radius-lg)`, padding `var(--space-6)`, shadow `var(--shadow-sm)`.
- Interactive cards raise to `var(--shadow-md)` on hover.

### Alert

- Background `var(--color-surface)`, 1px border and leading icon in the status role (`--color-success`, `--color-warning`, `--color-danger`, `--color-info`), text `var(--color-text)`, radius `var(--radius-md)`, padding `var(--space-3)` `var(--space-4)`.
- Always include a text label for the status, not just the color.

### Navigation bar

- Background `var(--color-bg)` with a 1px `var(--color-border)` bottom border.
- Links in `var(--color-text-muted)`, `var(--color-text)` on hover, `var(--color-primary)` for the current page (also mark it with `aria-current="page"`).

## Accessibility

- Meet **WCAG 2.2 AA**.
- **Focus:** 2px solid outline in the primary role color, offset 2px. Show it on `:focus-visible`; never remove outlines without a replacement.
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
