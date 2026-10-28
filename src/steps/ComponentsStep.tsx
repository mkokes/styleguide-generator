import { Form, Input, Segmented, Switch, Typography } from "antd";
import { Field, RulesEditor } from "../components/fields";
import { COMPONENT_KEYS, type ComponentKey, type Guide } from "../model/types";
import { useGuide } from "../wizard/GuideContext";

const LABELS: Record<ComponentKey, string> = {
  button: "Buttons",
  input: "Text inputs",
  card: "Cards",
  alert: "Alerts",
  nav: "Navigation bar",
};

export default function ComponentsStep() {
  const { guide, update } = useGuide();
  const a = guide.accessibility;
  const notes = guide.components.notes;
  return (
    <Form layout="vertical" component="div">
      <Typography.Title level={4}>Accessibility</Typography.Title>
      <Field label="WCAG target" hint="Sets the contrast ratios checked in the Color step.">
        {() => (
          <Segmented<Guide["accessibility"]["target"]>
            aria-label="WCAG target"
            value={a.target}
            onChange={(target) => update("accessibility", { target })}
            options={["AA", "AAA"]}
          />
        )}
      </Field>
      <Field label="Focus indicator">
        {(id) => (
          <Input
            id={id}
            value={a.focusStyle}
            onChange={(e) => update("accessibility", { focusStyle: e.target.value })}
          />
        )}
      </Field>
      <Field label="Respect reduced-motion preference">
        {(id) => (
          <Switch
            id={id}
            checked={a.reducedMotion}
            onChange={(reducedMotion) => update("accessibility", { reducedMotion })}
          />
        )}
      </Field>

      <Typography.Title level={4}>Component notes</Typography.Title>
      <Typography.Paragraph type="secondary">
        The guide includes a token-based recipe for each component. Add anything specific to your
        brand.
      </Typography.Paragraph>
      {COMPONENT_KEYS.map((key) => (
        <Field key={key} label={LABELS[key]}>
          {(id) => (
            <Input.TextArea
              id={id}
              autoSize={{ minRows: 1 }}
              value={notes[key]}
              onChange={(e) => update("components", { notes: { ...notes, [key]: e.target.value } })}
            />
          )}
        </Field>
      ))}
      <RulesEditor section="components" title="Component" />
    </Form>
  );
}
