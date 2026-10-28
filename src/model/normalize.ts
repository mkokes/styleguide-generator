import { defaultGuide, emptyRules } from "./defaults";
import { RULE_SECTIONS, type Guide } from "./types";

const isObject = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);

/**
 * Fills anything missing from a stored, imported or shared guide with defaults, so data from older
 * versions of the app still loads. Throws if the input isn't a guide at all.
 */
// Only inline images; never a remote URL that would be fetched when the preview renders.
const SAFE_IMAGE = /^data:image\/(png|jpeg|gif|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/;

export function normalizeGuide(raw: unknown): Guide {
  if (!isObject(raw) || !isObject(raw.basics)) throw new Error("Not a styleguide");
  const d = defaultGuide();
  const r = raw as Partial<Guide>;
  const merge = <K extends keyof Guide>(key: K): Guide[K] =>
    ({ ...(d[key] as object), ...(isObject(r[key]) ? (r[key] as object) : {}) }) as Guide[K];

  const colors = merge("colors");
  const rawRoles: Partial<Guide["colors"]["roles"]> = isObject(r.colors?.roles)
    ? r.colors.roles
    : {};
  const rules = emptyRules();
  for (const s of RULE_SECTIONS) {
    rules[s] = { ...rules[s], ...(isObject(r.rules?.[s]) ? r.rules[s] : {}) };
  }

  return {
    id: typeof r.id === "string" ? r.id : d.id,
    createdAt: typeof r.createdAt === "number" ? r.createdAt : d.createdAt,
    updatedAt: typeof r.updatedAt === "number" ? r.updatedAt : d.updatedAt,
    basics: merge("basics"),
    colors: {
      ...colors,
      base: { ...d.colors.base, ...colors.base },
      roles: {
        light: { ...d.colors.roles.light, ...rawRoles.light },
        dark: { ...d.colors.roles.dark, ...rawRoles.dark },
      },
    },
    typography: merge("typography"),
    layout: merge("layout"),
    logo: safeLogo(merge("logo")),
    icons: merge("icons"),
    imagery: merge("imagery"),
    components: { notes: { ...d.components.notes, ...r.components?.notes } },
    accessibility: merge("accessibility"),
    rules,
    outputs: merge("outputs"),
  };
}

function safeLogo(logo: Guide["logo"]): Guide["logo"] {
  if (typeof logo.previewDataUrl === "string" && SAFE_IMAGE.test(logo.previewDataUrl)) return logo;
  const { previewDataUrl: _, previewFileName: __, ...rest } = logo;
  return rest;
}
