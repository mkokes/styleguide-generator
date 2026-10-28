import {
  CopyOutlined,
  DownloadOutlined,
  FileZipOutlined,
  LinkOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { App, Button, Checkbox, Flex, Form, Segmented, Tabs, Typography } from "antd";
import { buildZip, generateFiles, slug } from "../generators/bundle";
import { downloadFile, mimeFor } from "../lib/download";
import { serializeProject } from "../lib/projectFile";
import { shareUrl } from "../lib/share";
import type { Guide } from "../model/types";
import { useGuide } from "../wizard/GuideContext";

export default function ExportStep() {
  const { guide, update } = useGuide();
  const { message } = App.useApp();
  const o = guide.outputs;
  const files = generateFiles(guide);

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success(`${what} copied`);
    } catch {
      message.error("Couldn't copy. Your browser blocked clipboard access.");
    }
  };

  return (
    <Form layout="vertical" component="div">
      <Typography.Title level={4}>Outputs</Typography.Title>
      <Flex wrap gap={24} align="center">
        <Checkbox
          checked={o.markdown}
          onChange={(e) => update("outputs", { markdown: e.target.checked })}
        >
          STYLEGUIDE.md
        </Checkbox>
        <Checkbox checked={o.css} onChange={(e) => update("outputs", { css: e.target.checked })}>
          tokens.css
        </Checkbox>
        <Checkbox checked={o.dtcg} onChange={(e) => update("outputs", { dtcg: e.target.checked })}>
          tokens.json (DTCG)
        </Checkbox>
        <Flex gap={8} align="center">
          Tailwind
          <Segmented<Guide["outputs"]["tailwind"]>
            aria-label="Tailwind output"
            value={o.tailwind}
            onChange={(tailwind) => update("outputs", { tailwind })}
            options={[
              { value: "off", label: "Off" },
              { value: "v4", label: "v4" },
              { value: "v3", label: "v3" },
            ]}
          />
        </Flex>
      </Flex>

      <Flex wrap gap={8} className="section-gap">
        <Button
          type="primary"
          icon={<FileZipOutlined />}
          disabled={files.length === 0}
          onClick={() =>
            downloadFile(
              `${slug(guide.basics.name)}-styleguide.zip`,
              buildZip(guide) as BlobPart,
              "application/zip",
            )
          }
        >
          Download .zip
        </Button>
        <Button
          icon={<LinkOutlined />}
          onClick={() => copy(shareUrl(guide, window.location), "Share link")}
        >
          Copy share link
        </Button>
        <Button
          icon={<SaveOutlined />}
          onClick={() =>
            downloadFile(
              `${slug(guide.basics.name)}.styleguide.json`,
              serializeProject(guide),
              "application/json",
            )
          }
        >
          Export project file
        </Button>
      </Flex>
      {guide.logo.previewDataUrl && (
        <Typography.Paragraph type="secondary" className="small">
          Share links leave out the uploaded logo image.
        </Typography.Paragraph>
      )}

      {files.length === 0 ? (
        <Typography.Paragraph type="secondary">Pick at least one output.</Typography.Paragraph>
      ) : (
        <Tabs
          className="section-gap"
          items={files.map((f) => ({
            key: f.name,
            label: f.name,
            children: (
              <>
                <Flex gap={8} className="file-actions">
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => copy(f.content, f.name)}
                  >
                    Copy
                  </Button>
                  <Button
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={() => downloadFile(f.name, f.content, mimeFor(f.name))}
                  >
                    Download
                  </Button>
                </Flex>
                <pre className="file-preview" tabIndex={0} aria-label={`${f.name} contents`}>
                  {f.content}
                </pre>
              </>
            ),
          }))}
        />
      )}
    </Form>
  );
}
