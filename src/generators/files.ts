import type { Guide } from "../model/types";
import { tailwindFileName } from "./tailwind";

export type OutputKind = "markdown" | "css" | "tailwind" | "dtcg";

export interface OutputFile {
  kind: OutputKind;
  name: string;
  purpose: string;
}

/** The files the guide's output settings enable, in display order. */
export function outputFiles(guide: Guide): OutputFile[] {
  const o = guide.outputs;
  const files: OutputFile[] = [];
  if (o.markdown) {
    files.push({ kind: "markdown", name: "STYLEGUIDE.md", purpose: "This guide" });
  }
  if (o.css) {
    files.push({
      kind: "css",
      name: "tokens.css",
      purpose: "CSS custom properties, with dark-mode overrides. Import once, globally.",
    });
  }
  if (o.tailwind !== "off") {
    files.push({
      kind: "tailwind",
      name: tailwindFileName(guide),
      purpose:
        o.tailwind === "v4"
          ? "Tailwind v4 CSS entry (`@theme`). Use instead of tokens.css in Tailwind projects."
          : "Tailwind v3 config. Load tokens.css too: role colors read its variables.",
    });
  }
  if (o.dtcg) {
    files.push({
      kind: "dtcg",
      name: "tokens.json",
      purpose: "W3C Design Tokens (DTCG) for Style Dictionary, Figma plugins and other tools.",
    });
  }
  return files;
}
