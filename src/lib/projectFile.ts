import { newId } from "../model/defaults";
import { normalizeGuide } from "../model/normalize";
import type { Guide } from "../model/types";

export const APP_ID = "styleguide-generator";
export const FILE_VERSION = 1;

export function serializeProject(guide: Guide): string {
  return JSON.stringify({ app: APP_ID, version: FILE_VERSION, guide }, null, 2);
}

/** Parses an exported project file. The guide gets a fresh id so it never overwrites an existing one. */
export function parseProject(text: string): Guide {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("That file isn't valid JSON.");
  }
  const d = data as { app?: unknown; version?: unknown; guide?: unknown };
  if (d?.app !== APP_ID) throw new Error("That file isn't a Styleguide Generator project.");
  if (typeof d.version !== "number" || d.version > FILE_VERSION) {
    throw new Error("That project was made with a newer version of the app.");
  }
  return withNewId(normalizeGuide(d.guide));
}

export function withNewId(guide: Guide): Guide {
  const now = Date.now();
  return { ...guide, id: newId(), createdAt: now, updatedAt: now };
}
