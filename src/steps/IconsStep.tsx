import { AutoComplete, Form, InputNumber, Segmented } from "antd";
import { Field, NumberListInput, RulesEditor } from "../components/fields";
import type { Guide } from "../model/types";
import { useGuide } from "../wizard/GuideContext";

const LIBRARIES = [
  "Lucide",
  "Heroicons",
  "Material Symbols",
  "Phosphor",
  "Tabler Icons",
  "Font Awesome",
  "Ant Design Icons",
  "Custom SVG set",
];

export default function IconsStep() {
  const { guide, update } = useGuide();
  const ic = guide.icons;
  return (
    <Form layout="vertical" component="div">
      <Field label="Icon library">
        {(id) => (
          <AutoComplete
            id={id}
            value={ic.library}
            style={{ width: 280 }}
            placeholder="e.g. Lucide"
            options={LIBRARIES.map((value) => ({ value }))}
            showSearch={{
              filterOption: (input, option) =>
                option!.value.toLowerCase().includes(input.toLowerCase()),
            }}
            onChange={(library: string) => update("icons", { library })}
          />
        )}
      </Field>
      <Field label="Style">
        {() => (
          <Segmented<Guide["icons"]["style"]>
            aria-label="Icon style"
            value={ic.style}
            onChange={(style) => update("icons", { style })}
            options={[
              { value: "outline", label: "Outline" },
              { value: "filled", label: "Filled" },
              { value: "duotone", label: "Duotone" },
            ]}
          />
        )}
      </Field>
      <Field label="Sizes (px)" hint="Comma-separated, e.g. 16, 20, 24">
        {(id) => (
          <NumberListInput
            id={id}
            value={ic.sizes}
            onChange={(sizes) => update("icons", { sizes })}
          />
        )}
      </Field>
      {ic.style !== "filled" && (
        <Field label="Stroke width">
          {(id) => (
            <InputNumber
              id={id}
              min={0.5}
              max={4}
              step={0.25}
              suffix="px"
              value={ic.stroke}
              onChange={(v) => update("icons", { stroke: v ?? 1.5 })}
            />
          )}
        </Field>
      )}
      <RulesEditor section="icons" title="Iconography" />
    </Form>
  );
}
