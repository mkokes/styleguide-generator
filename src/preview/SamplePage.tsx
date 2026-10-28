import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import { useState } from "react";
import { styleObject } from "../lib/tokens";
import type { Guide, Mode } from "../model/types";
import { useFontLinks } from "./useFontLinks";
import "./preview.css";

/**
 * A small mock site styled only through the guide's CSS variables, so what you see is what an
 * agent following the generated guide would build.
 */
export default function SamplePage({ guide }: { guide: Guide }) {
  const [mode, setMode] = useState<Mode>("light");
  useFontLinks(guide.typography);
  const name = guide.basics.name;

  return (
    <div className="preview-frame">
      <div className="preview-toolbar">
        <span>Preview</span>
        <Segmented<Mode>
          size="small"
          aria-label="Preview theme"
          value={mode}
          onChange={setMode}
          options={[
            { value: "light", icon: <SunOutlined />, title: "Light" },
            { value: "dark", icon: <MoonOutlined />, title: "Dark" },
          ]}
        />
      </div>
      <div className="sgp" data-testid="sample-page" style={styleObject(guide, mode)}>
        <header className="sgp-nav">
          {guide.logo.previewDataUrl ? (
            <img src={guide.logo.previewDataUrl} alt={name} className="sgp-logo" />
          ) : (
            <strong className="sgp-wordmark">{name}</strong>
          )}
          <nav>
            <a href="#preview" aria-current="page" onClick={(e) => e.preventDefault()}>
              Home
            </a>
            <a href="#preview" onClick={(e) => e.preventDefault()}>
              Pricing
            </a>
            <a href="#preview" onClick={(e) => e.preventDefault()}>
              About
            </a>
          </nav>
        </header>

        <section className="sgp-hero">
          <h1>Build something people love</h1>
          <p className="sgp-lead">
            {guide.basics.description || "A short line about what you do and who it's for."}
          </p>
          <div className="sgp-row">
            <button type="button" className="sgp-btn">
              Get started
            </button>
            <button type="button" className="sgp-btn sgp-btn-secondary">
              Learn more
            </button>
            <button type="button" className="sgp-btn" disabled>
              Disabled
            </button>
          </div>
        </section>

        <section className="sgp-grid">
          <article className="sgp-card">
            <h3>Card title</h3>
            <p>
              Body text on a surface.{" "}
              <a href="#preview" onClick={(e) => e.preventDefault()}>
                A link
              </a>
              .
            </p>
            <p className="sgp-muted">Muted caption text</p>
          </article>
          <form className="sgp-card" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="sgp-email">Email</label>
            <input id="sgp-email" className="sgp-input" placeholder="you@example.com" />
            <span className="sgp-help">We'll never share it.</span>
            <code className="sgp-code">npm install</code>
          </form>
        </section>

        <section className="sgp-alerts">
          {(["success", "warning", "danger", "info"] as const).map((s) => (
            <div key={s} className={`sgp-alert sgp-alert-${s}`} role="status">
              <strong>{s[0].toUpperCase() + s.slice(1)}:</strong> This is a {s} message.
            </div>
          ))}
        </section>

        <section className="sgp-type">
          <h2>Heading two</h2>
          <h4>Heading four</h4>
          <p>
            Body copy at the base step. The quick brown fox jumps over the lazy dog, then settles in
            for a well-earned nap.
          </p>
          <small>Small text for labels and captions.</small>
        </section>
      </div>
    </div>
  );
}
