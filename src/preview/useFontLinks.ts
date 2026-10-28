import { useEffect } from "react";
import { fontCssUrl } from "../lib/fonts";
import type { Guide } from "../model/types";

/** Loads the guide's Google Fonts into the page through a single, updated <link>. */
export function useFontLinks(typography: Guide["typography"]): void {
  const href = fontCssUrl([typography.heading, typography.body, typography.mono]);
  useEffect(() => {
    if (!href) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.preview = "fonts";
    document.head.appendChild(link);
    return () => link.remove();
  }, [href]);
}
