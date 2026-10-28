import { MONO_FALLBACK, SANS_FALLBACK, SERIF_FALLBACK } from "../model/defaults";
import type { FontFamily } from "../model/types";

export interface GoogleFont {
  family: string;
  category: string;
  weights: number[];
}

let catalog: Promise<GoogleFont[]> | undefined;

/** The bundled Google Fonts snapshot, loaded on first use (~140 KB). */
export function loadCatalog(): Promise<GoogleFont[]> {
  catalog ??= import("../data/google-fonts.json").then((m) => m.default as GoogleFont[]);
  return catalog;
}

export function searchFonts(fonts: GoogleFont[], query: string, limit = 50): GoogleFont[] {
  const q = query.trim().toLowerCase();
  if (!q) return fonts.slice(0, limit);
  const starts = fonts.filter((f) => f.family.toLowerCase().startsWith(q));
  const contains = fonts.filter(
    (f) => !f.family.toLowerCase().startsWith(q) && f.family.toLowerCase().includes(q),
  );
  return [...starts, ...contains].slice(0, limit);
}

/** A Google Fonts CSS2 URL for the given families (Google-sourced ones only), or "" if none. */
export function fontCssUrl(families: FontFamily[]): string {
  const merged = new Map<string, Set<number>>();
  for (const f of families) {
    if (f.source !== "google" || !f.name.trim()) continue;
    const set = merged.get(f.name) ?? new Set<number>();
    f.weights.forEach((w) => set.add(w));
    merged.set(f.name, set);
  }
  if (!merged.size) return "";
  const params = [...merged].map(([name, weights]) => {
    const family = encodeURIComponent(name.trim()).replace(/%20/g, "+");
    const ws = [...weights].sort((a, b) => a - b);
    return `family=${family}${ws.length ? `:wght@${ws.join(";")}` : ""}`;
  });
  return `https://fonts.googleapis.com/css2?${params.join("&")}&display=swap`;
}

/** Category → CSS generic fallback stack. */
export function fallbackFor(category: string): string {
  if (category === "Serif") return SERIF_FALLBACK;
  if (category === "Monospace") return MONO_FALLBACK;
  if (category === "Handwriting") return "cursive";
  return SANS_FALLBACK;
}
