import { Flex, Form, Input, InputNumber, Typography } from "antd";
import {
  Field,
  NumberGrid,
  NumberListInput,
  RulesEditor,
  parseNumberList,
  useDraft,
} from "../components/fields";
import { easingCss } from "../lib/tokens";
import type { Easing, Guide, Shadow } from "../model/types";
import { useGuide } from "../wizard/GuideContext";

type Layout = Guide["layout"];

function EasingInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: Easing;
  onChange: (e: Easing) => void;
}) {
  const [draft, setDraft] = useDraft(value, (v) => v.join(", "));
  const parsed = parseNumberList(draft);
  const valid = parsed.length === 4;
  return (
    <Input
      id={id}
      value={draft}
      status={valid ? undefined : "error"}
      style={{ width: 200 }}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => valid && onChange(parsed as Easing)}
    />
  );
}

export default function LayoutStep() {
  const { guide, update } = useGuide();
  const l = guide.layout;
  const set = (patch: Partial<Layout>) => update("layout", patch);

  const setShadow = (key: keyof Layout["shadow"], field: keyof Shadow, value: number) =>
    set({ shadow: { ...l.shadow, [key]: { ...l.shadow[key], [field]: value } } });

  return (
    <Form layout="vertical" component="div">
      <Typography.Title level={4}>Spacing</Typography.Title>
      <div className="inline-fields">
        <Field label="Base unit">
          {(id) => (
            <InputNumber
              id={id}
              min={1}
              suffix="px"
              value={l.spacingBase}
              onChange={(v) => set({ spacingBase: v ?? 4 })}
            />
          )}
        </Field>
        <Field
          label="Scale (multiples of the base unit)"
          hint="Comma-separated, e.g. 0, 1, 2, 4, 8"
        >
          {(id) => (
            <NumberListInput
              id={id}
              value={l.spacingScale}
              onChange={(spacingScale) => set({ spacingScale })}
            />
          )}
        </Field>
      </div>
      <Flex wrap gap={4} align="end" className="spacing-demo" aria-hidden>
        {l.spacingScale.map((m) => (
          <span
            key={m}
            style={{ width: m * l.spacingBase, height: m * l.spacingBase }}
            title={`${m}`}
          />
        ))}
      </Flex>

      <Typography.Title level={4}>Corner radius</Typography.Title>
      <NumberGrid unit="px" values={l.radius} onChange={(radius) => set({ radius })} />

      <Typography.Title level={4}>Elevation</Typography.Title>
      {(Object.keys(l.shadow) as (keyof Layout["shadow"])[]).map((key) => (
        <Flex key={key} wrap gap={12} align="center" className="shadow-row">
          <span
            className="shadow-demo"
            style={{
              boxShadow: `0 ${l.shadow[key].y}px ${l.shadow[key].blur}px ${l.shadow[key].spread}px rgb(0 0 0 / ${l.shadow[key].opacity})`,
            }}
          >
            {key}
          </span>
          {(["y", "blur", "spread", "opacity"] as const).map((field) => (
            <InputNumber
              key={field}
              aria-label={`${key} shadow ${field}`}
              prefix={field}
              size="small"
              step={field === "opacity" ? 0.01 : 1}
              min={field === "opacity" ? 0 : undefined}
              max={field === "opacity" ? 1 : undefined}
              value={l.shadow[key][field]}
              style={{ width: 120 }}
              onChange={(v) => v !== null && setShadow(key, field, v)}
            />
          ))}
        </Flex>
      ))}

      <Typography.Title level={4}>Motion</Typography.Title>
      <NumberGrid
        unit="ms"
        step={10}
        values={l.duration}
        onChange={(duration) => set({ duration })}
      />
      <Flex wrap gap={12}>
        {(Object.keys(l.easing) as (keyof Layout["easing"])[]).map((key) => (
          <Field key={key} label={`${key} easing`} hint={easingCss(l.easing[key])}>
            {(id) => (
              <EasingInput
                id={id}
                value={l.easing[key]}
                onChange={(e) => set({ easing: { ...l.easing, [key]: e } })}
              />
            )}
          </Field>
        ))}
      </Flex>

      <Typography.Title level={4}>Breakpoints</Typography.Title>
      <NumberGrid
        unit="px"
        step={8}
        values={l.breakpoints}
        onChange={(breakpoints) => set({ breakpoints })}
      />

      <RulesEditor section="layout" title="Layout" />
    </Form>
  );
}
