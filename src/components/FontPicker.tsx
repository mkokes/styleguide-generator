import { Checkbox, Flex, Input, Segmented, Select } from "antd";
import { useEffect, useState } from "react";
import { fallbackFor, loadCatalog, searchFonts, type GoogleFont } from "../lib/fonts";
import type { FontFamily } from "../model/types";
import { Field } from "./fields";

const ALL_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export function useCatalog(): GoogleFont[] {
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  useEffect(() => {
    let live = true;
    loadCatalog().then((f) => live && setFonts(f));
    return () => {
      live = false;
    };
  }, []);
  return fonts;
}

/** Picks a family from Google Fonts (searchable) or names a custom/licensed one. */
export default function FontPicker({
  label,
  value,
  onChange,
  catalog,
}: {
  label: string;
  value: FontFamily;
  onChange: (f: FontFamily) => void;
  catalog: GoogleFont[];
}) {
  const [query, setQuery] = useState("");
  const match = catalog.find((f) => f.family === value.name);
  const available = value.source === "google" && match ? match.weights : ALL_WEIGHTS;

  return (
    <fieldset className="font-picker">
      <legend>{label}</legend>
      <Segmented<FontFamily["source"]>
        aria-label={`${label} source`}
        value={value.source}
        onChange={(source) => onChange({ ...value, source })}
        options={[
          { value: "google", label: "Google Fonts" },
          { value: "custom", label: "Custom / licensed" },
        ]}
      />
      <Flex wrap gap={16} className="font-picker-row">
        <Field label="Family">
          {(id) =>
            value.source === "google" ? (
              <Select
                id={id}
                showSearch={{ filterOption: false, onSearch: setQuery }}
                value={value.name}
                loading={catalog.length === 0}
                style={{ width: 240 }}
                options={searchFonts(catalog, query).map((f) => ({
                  value: f.family,
                  label: f.family,
                }))}
                onChange={(name: string) => {
                  const font = catalog.find((f) => f.family === name)!;
                  const weights = value.weights.filter((w) => font.weights.includes(w));
                  onChange({
                    ...value,
                    name,
                    weights: weights.length
                      ? weights
                      : [font.weights.includes(400) ? 400 : font.weights[0]],
                    fallback: fallbackFor(font.category),
                  });
                }}
              />
            ) : (
              <Input
                id={id}
                value={value.name}
                style={{ width: 240 }}
                onChange={(e) => onChange({ ...value, name: e.target.value })}
              />
            )
          }
        </Field>
        <Field label="Fallback stack">
          {(id) => (
            <Input
              id={id}
              value={value.fallback}
              style={{ width: 320 }}
              onChange={(e) => onChange({ ...value, fallback: e.target.value })}
            />
          )}
        </Field>
      </Flex>
      <Field label="Weights to load">
        {() => (
          <Checkbox.Group
            aria-label={`${label} weights`}
            value={value.weights}
            options={available.map((w) => ({ value: w, label: String(w) }))}
            onChange={(weights) =>
              onChange({ ...value, weights: [...weights].sort((a, b) => a - b) })
            }
          />
        )}
      </Field>
    </fieldset>
  );
}
