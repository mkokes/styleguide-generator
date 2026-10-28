import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { normalizeGuide } from "../model/normalize";
import type { Guide } from "../model/types";
import { withNewId } from "./projectFile";

/** Compresses a guide for a URL. The logo upload is left out to keep links short. */
export function encodeGuide(guide: Guide): string {
  const { previewDataUrl: _, previewFileName: __, ...logo } = guide.logo;
  return compressToEncodedURIComponent(JSON.stringify({ ...guide, logo }));
}

export function decodeGuide(data: string): Guide {
  const json = decompressFromEncodedURIComponent(data);
  if (!json) throw new Error("This share link is incomplete or damaged.");
  try {
    return withNewId(normalizeGuide(JSON.parse(json)));
  } catch {
    throw new Error("This share link is incomplete or damaged.");
  }
}

/** A link that opens the import page for this guide. Uses the app's hash routing. */
export function shareUrl(guide: Guide, location: { origin: string; pathname: string }): string {
  return `${location.origin}${location.pathname}#/import?d=${encodeGuide(guide)}`;
}
