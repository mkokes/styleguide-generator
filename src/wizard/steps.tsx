import { checkContrast } from "../lib/color";
import type { Guide } from "../model/types";
import BasicsStep from "../steps/BasicsStep";
import ColorStep from "../steps/ColorStep";
import ComponentsStep from "../steps/ComponentsStep";
import ExportStep from "../steps/ExportStep";
import IconsStep from "../steps/IconsStep";
import LayoutStep from "../steps/LayoutStep";
import LogoImageryStep from "../steps/LogoImageryStep";
import TypographyStep from "../steps/TypographyStep";

export type StepStatus = "finish" | "wait" | "error";

export interface StepDef {
  key: string;
  title: string;
  description: string;
  Component: () => React.ReactNode;
  status: (g: Guide) => StepStatus;
}

const done = (ok: boolean): StepStatus => (ok ? "finish" : "wait");

export const STEPS: StepDef[] = [
  {
    key: "basics",
    title: "Basics & voice",
    description: "Who the brand is for and how it sounds.",
    Component: BasicsStep,
    status: (g) => done(Boolean(g.basics.description && g.basics.voice)),
  },
  {
    key: "color",
    title: "Color",
    description: "Base colors, generated scales, semantic roles and contrast.",
    Component: ColorStep,
    status: (g) => (checkContrast(g).every((c) => c.pass) ? "finish" : "error"),
  },
  {
    key: "typography",
    title: "Typography",
    description: "Font families and the type scale.",
    Component: TypographyStep,
    status: (g) => done(Boolean(g.typography.heading.name && g.typography.body.name)),
  },
  {
    key: "layout",
    title: "Spacing & motion",
    description: "Spacing, radius, elevation, motion and breakpoints.",
    Component: LayoutStep,
    status: (g) => done(g.layout.spacingScale.length > 0),
  },
  {
    key: "logo",
    title: "Logo & imagery",
    description: "Logo files and usage rules, and photography style.",
    Component: LogoImageryStep,
    status: (g) => done(g.logo.variants.length > 0 || Boolean(g.imagery.style)),
  },
  {
    key: "icons",
    title: "Iconography",
    description: "Icon library, style and sizes.",
    Component: IconsStep,
    status: (g) => done(Boolean(g.icons.library)),
  },
  {
    key: "components",
    title: "Components & a11y",
    description: "Component notes and accessibility targets.",
    Component: ComponentsStep,
    status: () => "finish",
  },
  {
    key: "export",
    title: "Review & export",
    description: "Choose output formats, then copy or download.",
    Component: ExportStep,
    status: () => "wait",
  },
];
