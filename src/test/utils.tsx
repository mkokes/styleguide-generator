import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { loadGuide, saveGuide } from "../lib/storage";
import { createGuide } from "../model/presets";
import type { Guide } from "../model/types";

export function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

/** Saves a guide (blank by default, with optional changes) and returns it. */
export function seedGuide(patch: (g: Guide) => void = () => {}, preset?: string): Guide {
  const g = createGuide(preset);
  patch(g);
  saveGuide(g);
  return g;
}

/** Opens one wizard step for a fresh guide. `saved()` unmounts (flushing autosave) and reloads it. */
export async function renderStep(step: string, patch?: (g: Guide) => void, preset?: string) {
  const g = seedGuide(patch, preset);
  const r = renderAt(`/guide/${g.id}/${step}`);
  await screen.findByRole("button", { name: /Back/ });
  return {
    guide: g,
    ...r,
    saved: () => {
      r.unmount();
      return loadGuide(g.id)!;
    },
  };
}
