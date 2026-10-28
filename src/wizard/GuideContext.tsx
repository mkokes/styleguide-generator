import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import type { Guide, SectionKey } from "../model/types";
import { saveGuide } from "../lib/storage";
import { guideReducer } from "./state";

export type Update = <K extends SectionKey>(section: K, value: Partial<Guide[K]>) => void;

interface GuideContextValue {
  guide: Guide;
  update: Update;
  /** False when the last autosave failed (storage full or unavailable). */
  saved: boolean;
}

const GuideContext = createContext<GuideContextValue | null>(null);

export const AUTOSAVE_MS = 400;

export function GuideProvider({
  initial,
  children,
}: {
  initial: Guide;
  children: React.ReactNode;
}) {
  const [guide, dispatch] = useReducer(guideReducer, initial);
  const [saved, setSaved] = useState(true);
  const latest = useRef(guide);
  useEffect(() => {
    latest.current = guide;
  }, [guide]);

  const update = useCallback<Update>(
    (section, value) => dispatch({ type: "patch", section, value } as never),
    [],
  );

  // Debounced autosave; whatever is pending is flushed when the editor closes.
  useEffect(() => {
    if (guide === initial) return;
    const t = setTimeout(() => setSaved(saveGuide(guide)), AUTOSAVE_MS);
    return () => clearTimeout(t);
  }, [guide, initial]);
  useEffect(
    () => () => {
      if (latest.current !== initial) saveGuide(latest.current);
    },
    [initial],
  );

  return <GuideContext.Provider value={{ guide, update, saved }}>{children}</GuideContext.Provider>;
}

export function useGuide(): GuideContextValue {
  const ctx = useContext(GuideContext);
  if (!ctx) throw new Error("useGuide must be used inside GuideProvider");
  return ctx;
}
