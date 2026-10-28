import { Button, Form, InputNumber, Select, Table, Typography } from "antd";
import FontPicker, { useCatalog } from "../components/FontPicker";
import { Field, RulesEditor } from "../components/fields";
import { fontStack } from "../lib/tokens";
import { RATIOS, buildTypeScale } from "../lib/typeScale";
import { TYPE_STEPS, type TypeStep, type TypeStepKey } from "../model/types";
import { useGuide } from "../wizard/GuideContext";

const COLUMNS: { field: keyof TypeStep; title: string; step: number; unit?: string }[] = [
  { field: "size", title: "Size", step: 1, unit: "px" },
  { field: "lineHeight", title: "Line height", step: 0.05 },
  { field: "weight", title: "Weight", step: 100 },
  { field: "letterSpacing", title: "Tracking", step: 0.005, unit: "em" },
];

export default function TypographyStep() {
  const { guide, update } = useGuide();
  const t = guide.typography;
  const catalog = useCatalog();
  const scale = buildTypeScale(t);
  const hasOverrides = Object.keys(t.overrides).length > 0;

  const setOverride = (key: TypeStepKey, field: keyof TypeStep, value: number) =>
    update("typography", {
      overrides: { ...t.overrides, [key]: { ...t.overrides[key], [field]: value } },
    });

  return (
    <Form layout="vertical" component="div">
      <FontPicker
        label="Headings"
        catalog={catalog}
        value={t.heading}
        onChange={(heading) => update("typography", { heading })}
      />
      <FontPicker
        label="Body"
        catalog={catalog}
        value={t.body}
        onChange={(body) => update("typography", { body })}
      />
      <FontPicker
        label="Code"
        catalog={catalog}
        value={t.mono}
        onChange={(mono) => update("typography", { mono })}
      />

      <Typography.Title level={4}>Type scale</Typography.Title>
      <div className="inline-fields">
        <Field label="Base size">
          {(id) => (
            <InputNumber
              id={id}
              min={10}
              max={32}
              suffix="px"
              value={t.baseSize}
              onChange={(v) => update("typography", { baseSize: v ?? 16 })}
            />
          )}
        </Field>
        <Field label="Scale ratio">
          {(id) => (
            <Select
              id={id}
              style={{ width: 240 }}
              value={t.ratio}
              options={RATIOS}
              onChange={(ratio: number) => update("typography", { ratio })}
            />
          )}
        </Field>
        {hasOverrides && (
          <Button type="link" onClick={() => update("typography", { overrides: {} })}>
            Reset step overrides
          </Button>
        )}
      </div>
      <Table
        size="small"
        pagination={false}
        rowKey="key"
        scroll={{ x: true }}
        dataSource={TYPE_STEPS.map((key) => ({ key, ...scale[key] }))}
        columns={[
          {
            title: "Step",
            dataIndex: "key",
            render: (key: TypeStepKey) => <Typography.Text code>{key}</Typography.Text>,
          },
          ...COLUMNS.map((c) => ({
            title: c.title,
            key: c.field,
            render: (_: unknown, row: TypeStep & { key: TypeStepKey }) => (
              <InputNumber
                aria-label={`${row.key} ${c.title}`}
                size="small"
                step={c.step}
                suffix={c.unit}
                value={row[c.field]}
                style={{ width: 100 }}
                onChange={(v) => v !== null && setOverride(row.key, c.field, v)}
              />
            ),
          })),
          {
            title: "Sample",
            key: "sample",
            render: (_: unknown, row: TypeStep & { key: TypeStepKey }) => (
              <span
                className="type-sample"
                style={{
                  fontFamily: fontStack(row.size >= scale.xl.size ? t.heading : t.body),
                  fontSize: row.size,
                  lineHeight: row.lineHeight,
                  fontWeight: row.weight,
                  letterSpacing: `${row.letterSpacing}em`,
                }}
              >
                Aa Quick brown fox
              </span>
            ),
          },
        ]}
      />

      <RulesEditor section="typography" title="Typography" />
    </Form>
  );
}
