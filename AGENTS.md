# AGENTS.md

Context for AI coding agents working in this repo. Human-facing overview: [README.md](README.md). The app's own visual style: [STYLEGUIDE.md](STYLEGUIDE.md).

## What this is

A client-side React + Ant Design wizard that builds a brand styleguide and exports an agent-oriented `STYLEGUIDE.md`, `tokens.css`, a Tailwind v4/v3 theme, and DTCG `tokens.json`. There is no backend. Guides live in `localStorage`. The app deploys to GitHub Pages as a PWA.

## Layout

```
index.html              Inline script sets data-theme before first paint
pwa-manifest.ts         Web app manifest (vite-plugin-pwa)
vite.config.ts          Vite + Vitest config (base path, coverage thresholds, test timeout)
scripts/fetch-google-fonts.mjs   Refreshes src/data/google-fonts.json (`npm run fonts`)
src/
  main.tsx              Entry: HashRouter, Inter font, global CSS
  App.tsx               Routes (list, wizard [lazy], import, 404) + app theme
  theme.ts, index.css   App chrome palette (keep in sync) and layout CSS
  useThemeMode.ts       light / system / dark preference for the app itself
  model/                Guide types, defaults, presets, normalize (fills gaps in old/partial data), labels
  lib/                  Pure logic: color (OKLCH scales, roles, contrast), typeScale, tokens (CSS var names
                        and values), storage, share links, project files, fonts catalog, download
  generators/           Guide → file content: markdown, css, tailwind, dtcg; files.ts (enabled outputs), bundle.ts (zip)
  wizard/               GuideContext (reducer + debounced autosave), state.ts, steps.tsx (step list + status)
  steps/                One component per wizard step
  components/           Shared form controls (fields.tsx) and FontPicker
  preview/              SamplePage live preview (styled only via the guide's CSS variables)
  pages/                GuideList, Wizard, ImportShared, NotFound
  test/                 Test helpers (renderAt, seedGuide, renderStep, MockColorPicker)
  data/google-fonts.json  Committed Google Fonts snapshot, lazy-loaded
```

## Commands

```bash
npm ci                  # install (Node 22, as in CI)
npm run dev             # Vite dev server at /styleguide-generator/
npm test                # Vitest, single run
npm run test:coverage   # Vitest with 100% coverage thresholds
npm run lint            # oxlint
npm run format          # oxfmt (write)
npm run format:check    # oxfmt (check)
npm run build           # tsc -b && vite build
npm run fonts           # refresh the Google Fonts snapshot (network)
```

The Husky pre-push hook runs `lint`, `format:check` and `test:coverage`. CI (`.github/workflows/pages.yml`) runs those plus `build` on every PR and deploys `main` to GitHub Pages.

## Conventions

- **One source of truth for tokens.** CSS variable names and values come from `src/lib/tokens.ts`. The CSS and Tailwind generators and the live preview all use it, so change naming there, not in a generator.
- **Generators are pure** (`Guide → string`). Their output is pinned by file snapshots in `src/generators/__snapshots__/`. When a change is intended, run `npx vitest run src/generators -u` and review the diff, since those snapshots are the product.
- **Guide shape changes:** add the field to `model/types.ts` and `model/defaults.ts`. `normalizeGuide` fills it in for data saved before the change. Only bump `FILE_VERSION` in `lib/projectFile.ts` for breaking changes.
- **Wizard edits** go through `useGuide().update(section, partial)`, which shallow-merges one section. Nested records (roles, overrides, rules) must be spread by the caller.
- **Inputs that edit non-text values** (hex, number lists, easings) keep local text through `useDraft` in `components/fields.tsx` and commit only when the value is valid.
- **Tests** sit next to the code and use Testing Library role/label queries. Coverage must stay at 100%, or CI and pre-push fail.
- Wrap `localStorage` access in try/catch (see `lib/storage.ts`).
- Formatting is oxfmt; snapshots and the fonts JSON are excluded from it.

## Gotchas

- Routing uses `HashRouter`. Share links are `#/import?d=<lz-string>` and leave out the logo upload.
- antd `Segmented` radios have `pointer-events: none`. In tests, click the option's `<label>` or its text.
- antd `ColorPicker` can't be driven in jsdom. Tests swap it for `MockColorPicker` with `vi.mock("antd", ...)`.
- rc-upload replaces its `<input type="file">` after each upload, so re-query it before uploading again.
- The preview has its own headings. When waiting for the wizard in tests, query the Back button or use `level: 2` together with a name.
- `src/setupTests.ts` stubs `matchMedia`, `scrollTo` and `ResizeObserver`, and raises Testing Library's async timeout. Wizard tests are slow under parallel coverage runs, so `testTimeout` is 30s.
