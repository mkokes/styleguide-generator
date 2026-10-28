import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Alert, Button, Flex, Grid, Select, Steps, Typography } from "antd";
import { useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { loadGuide } from "../lib/storage";
import SamplePage from "../preview/SamplePage";
import { GuideProvider, useGuide } from "../wizard/GuideContext";
import { STEPS } from "../wizard/steps";
import NotFound from "./NotFound";

export default function Wizard() {
  const { id = "", step } = useParams();
  const initial = useMemo(() => loadGuide(id), [id]);
  if (!initial) return <NotFound title="That styleguide doesn't exist on this device" />;
  const index = STEPS.findIndex((s) => s.key === step);
  if (index === -1) return <Navigate to={`/guide/${id}/${STEPS[0].key}`} replace />;
  return (
    <GuideProvider key={id} initial={initial}>
      <WizardBody index={index} />
    </GuideProvider>
  );
}

function WizardBody({ index }: { index: number }) {
  const { guide, saved } = useGuide();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const go = (i: number) => navigate(`/guide/${guide.id}/${STEPS[i].key}`);
  const current = STEPS[index];
  const { Component } = current;

  return (
    <div className="wizard">
      <nav className="wizard-steps" aria-label="Styleguide sections">
        <Typography.Title level={5} className="wizard-name" ellipsis>
          {guide.basics.name}
        </Typography.Title>
        {screens.lg ? (
          <Steps
            orientation="vertical"
            size="small"
            current={index}
            onChange={go}
            items={STEPS.map((s, i) => ({
              title: s.title,
              status: i === index ? "process" : s.status(guide),
            }))}
          />
        ) : (
          <Select
            aria-label="Section"
            value={index}
            onChange={go}
            style={{ width: "100%" }}
            options={STEPS.map((s, i) => ({ value: i, label: `${i + 1}. ${s.title}` }))}
          />
        )}
        <Link to="/" className="wizard-back">
          <ArrowLeftOutlined /> All guides
        </Link>
      </nav>

      <main className="wizard-main">
        {!saved && (
          <Alert
            type="warning"
            showIcon
            title="Couldn't save to this browser. Export a project file from the last step to keep your work."
          />
        )}
        <Typography.Title level={2}>{current.title}</Typography.Title>
        <Typography.Paragraph type="secondary">{current.description}</Typography.Paragraph>
        <Component />
        <Flex justify="space-between" className="wizard-nav">
          <Button icon={<ArrowLeftOutlined />} disabled={index === 0} onClick={() => go(index - 1)}>
            Back
          </Button>
          {index < STEPS.length - 1 && (
            <Button type="primary" onClick={() => go(index + 1)}>
              Next: {STEPS[index + 1].title} <ArrowRightOutlined />
            </Button>
          )}
        </Flex>
      </main>

      <aside className="wizard-preview" aria-label="Live preview">
        <SamplePage guide={guide} />
      </aside>
    </div>
  );
}
