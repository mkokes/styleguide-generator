import { strToU8, zipSync } from "fflate";
import type { Guide } from "../model/types";
import { generateCss } from "./css";
import { generateDtcg } from "./dtcg";
import { outputFiles, type OutputFile, type OutputKind } from "./files";
import { generateMarkdown } from "./markdown";
import { generateTailwind } from "./tailwind";

const GENERATORS: Record<OutputKind, (g: Guide) => string> = {
  markdown: generateMarkdown,
  css: generateCss,
  tailwind: generateTailwind,
  dtcg: generateDtcg,
};

export interface GeneratedFile extends OutputFile {
  content: string;
}

export function generateFiles(guide: Guide): GeneratedFile[] {
  return outputFiles(guide).map((f) => ({ ...f, content: GENERATORS[f.kind](guide) }));
}

export function slug(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "styleguide"
  );
}

function dataUrlBytes(dataUrl: string): Uint8Array {
  const binary = atob(dataUrl.slice(dataUrl.indexOf(",") + 1));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

/** A plain file name for a zip entry: no directories, no `..`, no hidden files. */
export function safeFileName(name: string | undefined): string {
  const base = (name ?? "")
    .split(/[\\/]/)
    .pop()!
    .replace(/[^\w.-]/g, "_")
    .replace(/^\.+/, "");
  return base.slice(0, 100) || "logo";
}

/** All enabled outputs (plus the uploaded logo, if any) in a folder named after the brand. */
export function buildZip(guide: Guide): Uint8Array {
  const dir = slug(guide.basics.name);
  const entries: Record<string, Uint8Array> = {};
  for (const f of generateFiles(guide)) entries[`${dir}/${f.name}`] = strToU8(f.content);
  const { previewDataUrl, previewFileName } = guide.logo;
  if (previewDataUrl) {
    // The file name can come from an imported project file, so it must not escape the folder.
    entries[`${dir}/logo/${safeFileName(previewFileName)}`] = dataUrlBytes(previewDataUrl);
  }
  return zipSync(entries);
}
