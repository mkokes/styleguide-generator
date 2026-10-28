// Writes a trimmed snapshot of the Google Fonts catalogue to src/data/google-fonts.json.
// Run with `npm run fonts` when the snapshot should be refreshed; the output is committed.
import { writeFile } from "node:fs/promises";

const res = await fetch("https://fonts.google.com/metadata/fonts");
if (!res.ok) throw new Error(`Google Fonts metadata request failed: ${res.status}`);
// The response may be prefixed with an anti-JSON-hijacking guard.
const body = (await res.text()).replace(/^\)\]\}'\s*/, "");
const { familyMetadataList } = JSON.parse(body);

const fonts = familyMetadataList
  .map((f) => ({
    family: f.family,
    category: f.category,
    weights: Object.keys(f.fonts)
      .filter((k) => !k.endsWith("i"))
      .map(Number)
      .sort((a, b) => a - b),
  }))
  .filter((f) => f.weights.length > 0)
  .sort((a, b) => a.family.localeCompare(b.family));

await writeFile(
  new URL("../src/data/google-fonts.json", import.meta.url),
  JSON.stringify(fonts) + "\n",
);
console.log(`Wrote ${fonts.length} families`);
