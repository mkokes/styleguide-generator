import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Button, Flex, Form, Input, Select, Typography, Upload } from "antd";
import { Field, ListEditor, RulesEditor } from "../components/fields";
import type { LogoVariant } from "../model/types";
import { useGuide } from "../wizard/GuideContext";

export const MAX_LOGO_BYTES = 512 * 1024;

export function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function LogoImageryStep() {
  const { guide, update } = useGuide();
  const { message } = App.useApp();
  const logo = guide.logo;

  const setVariant = (i: number, patch: Partial<LogoVariant>) =>
    update("logo", { variants: logo.variants.map((v, j) => (j === i ? { ...v, ...patch } : v)) });

  return (
    <Form layout="vertical" component="div">
      <Typography.Title level={4}>Logo files</Typography.Title>
      <Typography.Paragraph type="secondary">
        List each logo variant and where it lives in the codebase, so agents use the real file.
      </Typography.Paragraph>
      {logo.variants.map((v, i) => (
        <Flex key={i} wrap gap={8} className="variant-row">
          <Input
            aria-label={`Variant ${i + 1} name`}
            placeholder="Name, e.g. Full color"
            value={v.name}
            style={{ width: 180 }}
            onChange={(e) => setVariant(i, { name: e.target.value })}
          />
          <Input
            aria-label={`Variant ${i + 1} path`}
            placeholder="src/assets/logo.svg"
            value={v.path}
            style={{ width: 240 }}
            onChange={(e) => setVariant(i, { path: e.target.value })}
          />
          <Select
            aria-label={`Variant ${i + 1} background`}
            value={v.background}
            style={{ width: 170 }}
            onChange={(background: LogoVariant["background"]) => setVariant(i, { background })}
            options={[
              { value: "light", label: "Light backgrounds" },
              { value: "dark", label: "Dark backgrounds" },
              { value: "any", label: "Any background" },
            ]}
          />
          <Button
            aria-label={`Remove variant ${i + 1}`}
            icon={<DeleteOutlined />}
            onClick={() => update("logo", { variants: logo.variants.filter((_, j) => j !== i) })}
          />
        </Flex>
      ))}
      <Button
        icon={<PlusOutlined />}
        onClick={() =>
          update("logo", {
            variants: [...logo.variants, { name: "", path: "", background: "light" }],
          })
        }
      >
        Add variant
      </Button>

      <Flex wrap gap={16} className="section-gap">
        <Field label="Minimum size">
          {(id) => (
            <Input
              id={id}
              value={logo.minSize}
              placeholder="e.g. 24px tall on screen"
              onChange={(e) => update("logo", { minSize: e.target.value })}
            />
          )}
        </Field>
        <Field label="Clear space">
          {(id) => (
            <Input
              id={id}
              value={logo.clearSpace}
              placeholder="e.g. Half the logo's height on all sides"
              style={{ width: 300 }}
              onChange={(e) => update("logo", { clearSpace: e.target.value })}
            />
          )}
        </Field>
      </Flex>
      <ListEditor
        label="Never do this to the logo"
        placeholder="e.g. Stretch, recolor or add effects"
        items={logo.misuse}
        onChange={(misuse) => update("logo", { misuse })}
      />

      <Field
        label="Logo preview (optional)"
        hint="Shown in the live preview and included in the .zip. Kept in this browser only; max 512 KB."
      >
        {(id) => (
          <Flex gap={12} align="center">
            <Upload
              id={id}
              accept="image/*"
              showUploadList={false}
              beforeUpload={async (file) => {
                if (file.size > MAX_LOGO_BYTES) {
                  message.error("That image is over 512 KB.");
                } else {
                  update("logo", {
                    previewDataUrl: await readAsDataUrl(file),
                    previewFileName: file.name,
                  });
                }
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Choose image</Button>
            </Upload>
            {logo.previewDataUrl && (
              <>
                <img src={logo.previewDataUrl} alt="Logo preview" className="logo-thumb" />
                <Button
                  onClick={() =>
                    update("logo", { previewDataUrl: undefined, previewFileName: undefined })
                  }
                >
                  Remove
                </Button>
              </>
            )}
          </Flex>
        )}
      </Field>

      <RulesEditor section="logo" title="Logo" />

      <Typography.Title level={4}>Imagery</Typography.Title>
      <Field label="Photography and illustration style">
        {(id) => (
          <Input.TextArea
            id={id}
            autoSize={{ minRows: 3 }}
            value={guide.imagery.style}
            placeholder="e.g. Natural light, real customers, warm tones. Flat illustrations with 2px strokes."
            onChange={(e) => update("imagery", { style: e.target.value })}
          />
        )}
      </Field>
      <RulesEditor section="imagery" title="Imagery" />
    </Form>
  );
}
