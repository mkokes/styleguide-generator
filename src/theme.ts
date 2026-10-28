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
    danger: "#DC2626", // --color-danger (danger-600)
  },
  dark: {
    bg: "#242424",
    surface: "#383838", // neutral-900
    text: "#F7F7F7", // neutral-50
    textMuted: "#C1C1C1", // neutral-300
    border: "#484848", // neutral-800
    link: "#BAFF39", // primary-100
    danger: "#FA7064", // danger-400
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
      // The danger role, so solid danger buttons pass contrast with their text in both modes.
      colorError: c.danger,
      colorBgLayout: c.bg,
      colorBgContainer: c.bg,
      colorBgElevated: mode === "dark" ? c.surface : c.bg,
      colorText: c.text,
      colorTextSecondary: c.textMuted,
      // Typography type="secondary" reads colorTextDescription, so it gets the muted role too.
      colorTextDescription: c.textMuted,
      colorBorder: c.border,
      colorBorderSecondary: c.border,
      // Text on solid primary (checkbox ticks, step numbers): dark on lime in dark mode.
      ...(mode === "dark" && { colorTextLightSolid: lime.onFill }),
      borderRadius: 10, // --radius-md
      borderRadiusLG: 16, // --radius-lg
      borderRadiusSM: 6, // --radius-sm
      fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
      fontFamilyCode: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
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
        // The lime overrides above also drive default-button hover; keep that on the link role.
        defaultHoverColor: c.link,
        defaultHoverBorderColor: c.link,
        defaultActiveColor: c.link,
        defaultActiveBorderColor: c.link,
        // Pin solid danger buttons to the danger role: antd's dark algorithm would shift colorError
        // and drop the text contrast below 4.5:1.
        colorError: c.danger,
        colorErrorHover: c.danger,
        colorErrorActive: c.danger,
        dangerColor: mode === "dark" ? lime.onFill : "#FFFFFF",
        primaryShadow: "none",
        borderRadius: 9999,
        borderRadiusLG: 9999,
        borderRadiusSM: 9999,
        fontWeight: 600,
      },
      Card: { colorBgContainer: c.surface },
      // antd draws checkmarks in colorWhite; on the dark-mode lime box it must be dark.
      Checkbox: { colorWhite: mode === "dark" ? lime.onFill : "#FFFFFF" },
      Layout: { headerBg: c.bg, headerPadding: "0 16px", bodyBg: c.bg },
    },
  };
}
