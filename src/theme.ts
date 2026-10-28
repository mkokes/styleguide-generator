import { theme, type ThemeConfig } from "antd";

export type ThemePref = "light" | "dark" | "system";

// Also read by the inline script in index.html, which sets the theme before first paint.
export const THEME_KEY = "theme";

// Hex mirror of the mk-styleguide role tokens (styleguide/tokens.css). antd needs real colors to
// derive hover/active shades, so it can't read the CSS variables; keep these in step with the tokens.
export const palette = {
  light: {
    bg: "#FFFFFF", // --color-bg
    surface: "#F7F7F7", // --color-surface (neutral-50)
    text: "#242424", // --color-text (neutral-950)
    textMuted: "#6E6E6E", // --color-text-muted (neutral-600)
    border: "#D9D9D9", // --color-border (neutral-200)
    link: "#476700", // --color-link (primary-700)
  },
  dark: {
    bg: "#242424",
    surface: "#383838", // neutral-900
    text: "#F7F7F7", // neutral-50
    textMuted: "#C1C1C1", // neutral-300
    border: "#484848", // neutral-800
    link: "#BAFF39", // primary-100
  },
};

// The lime fill is the same in both modes: --color-primary (primary-100) with --color-on-primary text.
export const lime = {
  fill: "#BAFF39",
  hover: "#B0F22F", // primary-200
  active: "#9AD816", // primary-300
  onFill: "#242424",
};

export function themeConfig(mode: "light" | "dark"): ThemeConfig {
  const c = palette[mode];
  return {
    algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      // antd's "primary" drives links, focus, checkboxes and selected states: the link role.
      colorPrimary: c.link,
      colorLink: c.link,
      colorBgLayout: c.bg,
      colorBgContainer: c.bg,
      colorBgElevated: mode === "dark" ? c.surface : c.bg,
      colorText: c.text,
      colorTextSecondary: c.textMuted,
      colorBorder: c.border,
      colorBorderSecondary: c.border,
      // Text on solid primary (checkbox ticks, step numbers): dark on lime in dark mode.
      ...(mode === "dark" && { colorTextLightSolid: lime.onFill }),
      borderRadius: 10, // --radius-md
      borderRadiusLG: 16, // --radius-lg
      borderRadiusSM: 6, // --radius-sm
      fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
      fontFamilyCode: '"JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace',
      motionDurationFast: "0.1s", // --duration-fast
      motionDurationMid: "0.18s", // --duration-normal
      motionDurationSlow: "0.28s", // --duration-slow
    },
    components: {
      // Primary buttons are a lime fill with dark text, and every button is a pill.
      Button: {
        colorPrimary: lime.fill,
        colorPrimaryHover: lime.hover,
        colorPrimaryActive: lime.active,
        primaryColor: lime.onFill,
        primaryShadow: "none",
        borderRadius: 9999,
        borderRadiusLG: 9999,
        borderRadiusSM: 9999,
        fontWeight: 600,
      },
      Card: { colorBgContainer: c.surface },
      Layout: { headerBg: c.bg, headerPadding: "0 16px", bodyBg: c.bg },
    },
  };
}
