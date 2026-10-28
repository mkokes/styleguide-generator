import { Form, Input } from "antd";
import { Field, ListEditor } from "../components/fields";
import { useGuide } from "../wizard/GuideContext";

export default function BasicsStep() {
  const { guide, update } = useGuide();
  const b = guide.basics;
  return (
    <Form layout="vertical" component="div">
      <Field label="Brand or product name">
        {(id) => (
          <Input
            id={id}
            value={b.name}
            onChange={(e) => update("basics", { name: e.target.value })}
          />
        )}
      </Field>
      <Field
        label="What it is"
        hint="One or two sentences an agent can use to judge tone and context."
      >
        {(id) => (
          <Input.TextArea
            id={id}
            autoSize={{ minRows: 2 }}
            value={b.description}
            onChange={(e) => update("basics", { description: e.target.value })}
          />
        )}
      </Field>
      <Field label="Audience">
        {(id) => (
          <Input
            id={id}
            value={b.audience}
            placeholder="e.g. Small-business owners managing their own books"
            onChange={(e) => update("basics", { audience: e.target.value })}
          />
        )}
      </Field>
      <ListEditor
        label="Personality"
        placeholder="An adjective, e.g. Friendly"
        items={b.personality}
        onChange={(personality) => update("basics", { personality })}
      />
      <Field label="Voice and tone">
        {(id) => (
          <Input.TextArea
            id={id}
            autoSize={{ minRows: 2 }}
            value={b.voice}
            placeholder="How the brand sounds in UI copy, errors and marketing."
            onChange={(e) => update("basics", { voice: e.target.value })}
          />
        )}
      </Field>
      <ListEditor
        label="Writing: do"
        items={b.writingDo}
        onChange={(writingDo) => update("basics", { writingDo })}
      />
      <ListEditor
        label="Writing: don't"
        items={b.writingDont}
        onChange={(writingDont) => update("basics", { writingDont })}
      />
    </Form>
  );
}
