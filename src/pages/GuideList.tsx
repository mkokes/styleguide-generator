import {
  CopyOutlined,
  DeleteOutlined,
  ImportOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { App, Button, Card, Empty, Flex, Modal, Popconfirm, Typography } from "antd";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { slug } from "../generators/bundle";
import { downloadFile } from "../lib/download";
import { parseProject, serializeProject, withNewId } from "../lib/projectFile";
import { deleteGuide, listGuides, loadGuide, saveGuide } from "../lib/storage";
import { PRESETS, createGuide } from "../model/presets";
import type { Guide } from "../model/types";

export default function GuideList() {
  const [guides, setGuides] = useState(listGuides);
  const [creating, setCreating] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const open = (guide: Guide) => {
    if (!saveGuide(guide)) {
      message.error("Couldn't save to this browser's storage.");
      return;
    }
    navigate(`/guide/${guide.id}/basics`);
  };

  const duplicate = (id: string) => {
    const g = loadGuide(id);
    if (!g) return;
    saveGuide(withNewId({ ...g, basics: { ...g.basics, name: `${g.basics.name} (copy)` } }));
    setGuides(listGuides());
  };

  const remove = (id: string) => {
    deleteGuide(id);
    setGuides(listGuides());
  };

  const exportProject = (id: string) => {
    const g = loadGuide(id);
    if (g)
      downloadFile(
        `${slug(g.basics.name)}.styleguide.json`,
        serializeProject(g),
        "application/json",
      );
  };

  const importFile = async (file: File) => {
    try {
      open(parseProject(await file.text()));
    } catch (e) {
      message.error((e as Error).message);
    }
  };

  return (
    <div className="page">
      <Flex justify="space-between" align="center" wrap gap={12}>
        <div>
          <Typography.Title level={2}>Your styleguides</Typography.Title>
          <Typography.Paragraph type="secondary">
            Build an agent-ready STYLEGUIDE.md and design tokens, one section at a time. Everything
            is saved in this browser.
          </Typography.Paragraph>
        </div>
        <Flex gap={8}>
          <Button icon={<ImportOutlined />} onClick={() => fileInput.current?.click()}>
            Import file
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreating(true)}>
            New guide
          </Button>
        </Flex>
        <input
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          hidden
          data-testid="import-input"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void importFile(file);
          }}
        />
      </Flex>

      {guides.length === 0 ? (
        <Empty description="No styleguides yet" className="section-gap">
          <Button type="primary" onClick={() => setCreating(true)}>
            Create your first guide
          </Button>
        </Empty>
      ) : (
        <div className="card-grid section-gap">
          {guides.map((g) => (
            <Card
              key={g.id}
              title={<Link to={`/guide/${g.id}/basics`}>{g.name}</Link>}
              actions={[
                <Button
                  key="dup"
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={() => duplicate(g.id)}
                >
                  Duplicate
                </Button>,
                <Button
                  key="exp"
                  type="text"
                  icon={<SaveOutlined />}
                  onClick={() => exportProject(g.id)}
                >
                  Export
                </Button>,
                <Popconfirm
                  key="del"
                  title={`Delete "${g.name}"?`}
                  description="This can't be undone."
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => remove(g.id)}
                >
                  <Button type="text" danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>,
              ]}
            >
              <Typography.Text type="secondary">
                Updated {new Date(g.updatedAt).toLocaleString()}
              </Typography.Text>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title="New styleguide"
        open={creating}
        footer={null}
        onCancel={() => setCreating(false)}
        width={720}
      >
        <Typography.Paragraph type="secondary">
          Start blank or from a template. Every value stays editable.
        </Typography.Paragraph>
        <div className="card-grid">
          <Card hoverable onClick={() => open(createGuide())} role="button" aria-label="Blank">
            <Card.Meta title="Blank" description="Neutral defaults. You fill in the brand." />
          </Card>
          {PRESETS.map((p) => (
            <Card
              key={p.key}
              hoverable
              onClick={() => open(createGuide(p.key))}
              role="button"
              aria-label={p.label}
            >
              <Card.Meta title={p.label} description={p.description} />
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
}
