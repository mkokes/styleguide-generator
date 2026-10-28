import { PlusOutlined } from "@ant-design/icons";
import { Button, ColorPicker, Flex, Form, Input, InputNumber, Space, Tag, Typography } from "antd";
import { useId, useState } from "react";
import { isHex } from "../lib/color";
import type { RuleSection } from "../model/types";
import { useGuide } from "../wizard/GuideContext";

/**
 * Local text for an input that edits a non-text value. Resets when the value changes from outside
 * (adjusting state during render rather than in an effect, as React recommends).
 */
export function useDraft<T>(value: T, format: (v: T) => string): [string, (s: string) => void] {
  const [source, setSource] = useState(value);
  const [draft, setDraft] = useState(() => format(value));
  if (source !== value) {
    setSource(value);
    setDraft(format(value));
  }
  return [draft, setDraft];
}

/** A labelled form row whose label is tied to the control through `id`. */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <Form.Item label={label} htmlFor={id} extra={hint}>
      {children(id)}
    </Form.Item>
  );
}

/** Edits a list of short strings: type, press Enter or Add; remove with the tag's close button. */
export function ListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  };
  return (
    <Field label={label}>
      {(id) => (
        <>
          <Space.Compact block>
            <Input
              id={id}
              value={draft}
              placeholder={placeholder ?? "Type and press Enter"}
              onChange={(e) => setDraft(e.target.value)}
              onPressEnter={(e) => {
                e.preventDefault();
                add();
              }}
            />
            <Button icon={<PlusOutlined />} onClick={add} aria-label={`Add to ${label}`} />
          </Space.Compact>
          {items.length > 0 && (
            <Flex wrap gap={6} className="list-items">
              {items.map((item, i) => (
                <Tag
                  key={`${i}-${item}`}
                  closable
                  closeIcon={<span aria-label={`Remove ${item}`}>×</span>}
                  onClose={(e) => {
                    e.preventDefault();
                    onChange(items.filter((_, j) => j !== i));
                  }}
                >
                  {item}
                </Tag>
              ))}
            </Flex>
          )}
        </>
      )}
    </Field>
  );
}

/** Do/Don't lists for one guide section. */
export function RulesEditor({ section, title }: { section: RuleSection; title: string }) {
  const { guide, update } = useGuide();
  const rules = guide.rules[section];
  const set = (patch: Partial<typeof rules>) =>
    update("rules", { [section]: { ...rules, ...patch } });
  return (
    <section className="rules">
      <Typography.Title level={4}>{title} rules</Typography.Title>
      <Typography.Paragraph type="secondary">
        Added to the generated guide alongside the standard rules for this section.
      </Typography.Paragraph>
      <ListEditor label="Do" items={rules.do} onChange={(v) => set({ do: v })} />
      <ListEditor label="Don't" items={rules.dont} onChange={(v) => set({ dont: v })} />
    </section>
  );
}

/** A color swatch picker plus a hex text box; the text commits once it's a valid hex. */
export function HexInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const [draft, setDraft] = useDraft(value, String);
  return (
    <Space.Compact>
      <ColorPicker
        value={value}
        disabledAlpha
        onChangeComplete={(c) => onChange(c.toHexString())}
      />
      <Input
        id={id}
        value={draft}
        status={isHex(draft) ? undefined : "error"}
        style={{ width: 110 }}
        onChange={(e) => {
          setDraft(e.target.value);
          if (isHex(e.target.value)) onChange(e.target.value);
        }}
      />
    </Space.Compact>
  );
}

/** One number input per key of a record, e.g. radius sizes or breakpoints. */
export function NumberGrid<K extends string>({
  values,
  onChange,
  unit,
  min = 0,
  step = 1,
}: {
  values: Record<K, number>;
  onChange: (values: Record<K, number>) => void;
  unit?: string;
  min?: number;
  step?: number;
}) {
  return (
    <Flex wrap gap={12}>
      {(Object.keys(values) as K[]).map((k) => (
        <Field key={k} label={k}>
          {(id) => (
            <InputNumber
              id={id}
              value={values[k]}
              min={min}
              step={step}
              suffix={unit}
              style={{ width: 120 }}
              onChange={(v) => onChange({ ...values, [k]: v ?? 0 })}
            />
          )}
        </Field>
      ))}
    </Flex>
  );
}

/** Parses "1, 2, 3" into numbers, dropping anything that isn't one. */
export function parseNumberList(text: string): number[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "")
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

/** A comma-separated number list input that commits on blur. */
export function NumberListInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: number[];
  onChange: (v: number[]) => void;
}) {
  const [draft, setDraft] = useDraft(value, (v) => v.join(", "));
  return (
    <Input
      id={id}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => onChange(parseNumberList(draft))}
    />
  );
}
