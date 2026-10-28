import { Button, ColorPicker, Flex, Form, Select, Table, Tag, Typography } from "antd";
import { Field, HexInput, RulesEditor } from "../components/fields";
import { buildScales, checkContrast, resolveRef, type Scales } from "../lib/color";
import { ROLE_USAGE } from "../model/labels";
import {
  COLOR_KEYS,
  ROLE_KEYS,
  SCALE_STEPS,
  type ColorKey,
  type ColorRef,
  type Mode,
  type RoleKey,
} from "../model/types";
import { useGuide } from "../wizard/GuideContext";

export function Swatch({ color, size = 16 }: { color: string; size?: number }) {
  return <span className="swatch" style={{ background: color, width: size, height: size }} />;
}

function refOptions(scales: Scales) {
  const refs: ColorRef[] = [
    "white",
    "black",
    ...COLOR_KEYS.flatMap((k) => SCALE_STEPS.map((s): ColorRef => `${k}-${s}`)),
  ];
  return refs.map((ref) => ({
    value: ref,
    label: (
      <Flex align="center" gap={8}>
        <Swatch color={resolveRef(ref, scales)} />
        {ref}
      </Flex>
    ),
  }));
}

export default function ColorStep() {
  const { guide, update } = useGuide();
  const colors = guide.colors;
  const scales = buildScales(colors);
  const options = refOptions(scales);
  const checks = checkContrast(guide, scales);

  const setRole = (mode: Mode, role: RoleKey, ref: ColorRef) =>
    update("colors", {
      roles: { ...colors.roles, [mode]: { ...colors.roles[mode], [role]: ref } },
    });

  const setOverride = (key: ColorKey, step: number, hex: string) =>
    update("colors", {
      overrides: { ...colors.overrides, [key]: { ...colors.overrides[key], [step]: hex } },
    });

  return (
    <Form layout="vertical" component="div">
      <Typography.Title level={4}>Base colors</Typography.Title>
      <Typography.Paragraph type="secondary">
        Each base color becomes an 11-step scale. Your exact color lands on the step closest to its
        lightness.
      </Typography.Paragraph>
      <Flex wrap gap={16}>
        {COLOR_KEYS.map((key) => (
          <Field key={key} label={key}>
            {(id) => (
              <HexInput
                id={id}
                value={colors.base[key]}
                onChange={(hex) => update("colors", { base: { ...colors.base, [key]: hex } })}
              />
            )}
          </Field>
        ))}
      </Flex>

      <Typography.Title level={4}>Scales</Typography.Title>
      <Typography.Paragraph type="secondary">
        Click a step to override it. Overridden steps are outlined.
      </Typography.Paragraph>
      <div className="scales">
        {COLOR_KEYS.map((key) => (
          <div key={key} className="scale-row">
            <span className="scale-name">{key}</span>
            {SCALE_STEPS.map((step) => {
              const overridden = colors.overrides[key]?.[step] !== undefined;
              return (
                <ColorPicker
                  key={step}
                  value={scales[key][step]}
                  disabledAlpha
                  onChangeComplete={(c) => setOverride(key, step, c.toHexString())}
                >
                  <button
                    type="button"
                    className={`scale-step${overridden ? " is-overridden" : ""}`}
                    style={{ background: scales[key][step] }}
                    aria-label={`${key}-${step} ${scales[key][step]}`}
                    title={`${key}-${step} ${scales[key][step]}`}
                  />
                </ColorPicker>
              );
            })}
            {colors.overrides[key] && Object.keys(colors.overrides[key]).length > 0 && (
              <Button
                size="small"
                type="link"
                onClick={() => {
                  const { [key]: _, ...rest } = colors.overrides;
                  update("colors", { overrides: rest });
                }}
              >
                Reset {key}
              </Button>
            )}
          </div>
        ))}
      </div>

      <Typography.Title level={4}>Semantic roles</Typography.Title>
      <Typography.Paragraph type="secondary">
        Roles are what agents use for UI. Each points at a palette step for light and dark mode.
      </Typography.Paragraph>
      <Table
        size="small"
        pagination={false}
        rowKey="role"
        scroll={{ x: true }}
        dataSource={ROLE_KEYS.map((role) => ({ role }))}
        columns={[
          {
            title: "Role",
            dataIndex: "role",
            render: (role: RoleKey) => (
              <>
                <Typography.Text code>{role}</Typography.Text>
                <div className="muted small">{ROLE_USAGE[role]}</div>
              </>
            ),
          },
          ...(["light", "dark"] as const).map((mode) => ({
            title: mode === "light" ? "Light" : "Dark",
            key: mode,
            render: (_: unknown, { role }: { role: RoleKey }) => (
              <Select
                aria-label={`${role} (${mode})`}
                showSearch={{ optionFilterProp: "value" }}
                value={colors.roles[mode][role]}
                options={options}
                style={{ minWidth: 170 }}
                onChange={(ref: ColorRef) => setRole(mode, role, ref)}
              />
            ),
          })),
        ]}
      />

      <Typography.Title level={4}>Contrast</Typography.Title>
      <Typography.Paragraph type="secondary">
        Checked against WCAG {guide.accessibility.target} (set it in Components &amp; a11y).
      </Typography.Paragraph>
      <Table
        size="small"
        pagination={false}
        rowKey={(c) => `${c.mode}-${c.fg}-${c.bg}`}
        scroll={{ x: true }}
        dataSource={checks}
        columns={[
          {
            title: "Pair",
            render: (_, c) => (
              <Flex align="center" gap={6}>
                <span
                  className="contrast-sample"
                  style={{
                    color: resolveRef(colors.roles[c.mode][c.fg], scales),
                    background: resolveRef(colors.roles[c.mode][c.bg], scales),
                  }}
                >
                  Aa
                </span>
                {c.fg} on {c.bg}
              </Flex>
            ),
          },
          { title: "Mode", dataIndex: "mode" },
          { title: "Ratio", render: (_, c) => `${c.ratio.toFixed(2)}:1` },
          {
            title: "Result",
            render: (_, c) =>
              c.pass ? (
                <Tag color="success">Pass</Tag>
              ) : (
                <Flex align="center" gap={6} wrap>
                  <Tag color="error">Needs {c.required}:1</Tag>
                  {c.suggestion && (
                    <Button size="small" onClick={() => setRole(c.mode, c.fg, c.suggestion!)}>
                      Use {c.suggestion}
                    </Button>
                  )}
                </Flex>
              ),
          },
        ]}
      />

      <RulesEditor section="color" title="Color" />
    </Form>
  );
}
