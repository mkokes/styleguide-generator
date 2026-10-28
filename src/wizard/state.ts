import type { Guide, SectionKey } from "../model/types";

export type Action =
  | { [K in SectionKey]: { type: "patch"; section: K; value: Partial<Guide[K]> } }[SectionKey]
  | { type: "replace"; guide: Guide };

export function guideReducer(guide: Guide, action: Action): Guide {
  if (action.type === "replace") return action.guide;
  return {
    ...guide,
    [action.section]: { ...guide[action.section], ...action.value },
    updatedAt: Date.now(),
  };
}
