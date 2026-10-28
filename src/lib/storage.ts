import { normalizeGuide } from "../model/normalize";
import type { Guide } from "../model/types";

// localStorage can throw (private mode, quota, disabled storage); every access is guarded.

export const INDEX_KEY = "sg:index";
export const guideKey = (id: string) => `sg:guide:${id}`;

export interface GuideMeta {
  id: string;
  name: string;
  updatedAt: number;
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Saved guides, most recently updated first. */
export function listGuides(): GuideMeta[] {
  const index = read<GuideMeta[]>(INDEX_KEY);
  return Array.isArray(index) ? [...index].sort((a, b) => b.updatedAt - a.updatedAt) : [];
}

export function loadGuide(id: string): Guide | null {
  const raw = read<unknown>(guideKey(id));
  if (raw === null) return null;
  try {
    return normalizeGuide(raw);
  } catch {
    return null;
  }
}

/** Saves the guide and updates the index. Returns false if storage is unavailable or full. */
export function saveGuide(guide: Guide): boolean {
  if (!write(guideKey(guide.id), guide)) return false;
  const meta: GuideMeta = { id: guide.id, name: guide.basics.name, updatedAt: guide.updatedAt };
  return write(INDEX_KEY, [meta, ...listGuides().filter((m) => m.id !== guide.id)]);
}

export function deleteGuide(id: string): void {
  try {
    localStorage.removeItem(guideKey(id));
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
  write(
    INDEX_KEY,
    listGuides().filter((m) => m.id !== id),
  );
}
