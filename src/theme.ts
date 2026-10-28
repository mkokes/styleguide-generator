import { theme, type ThemeConfig } from "antd";

export type ThemePref = "light" | "dark" | "system";

// Also read by the inline script in index.html, which sets the theme before first paint.
export const THEME_KEY = "theme";

// Keep in sync with the CSS custom properties in index.css.
export const palette = {
  light: {
    primary: "#6D4AFF",
    bg: "#F7F6FB",
    surface: "#FFFFFF",
    text: "#1E1B2E",
    textSecondary: "#5F5A73",
    border: "#E6E3EF",
  },
  dark: {
    primary: "#A08BFF",
    bg: "#16141F",
    surface: "#1F1C2B",
    text: "#ECEAF4",
    textSecondary: "#A9A4BC",
    border: "#2F2B3F",
  },
};

export function themeConfig(mode: "light" | "dark"): ThemeConfig {
  const c = palette[mode];
  return {
    algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: c.primary,
      colorBgLayout: c.bg,
      colorBgContainer: c.surface,
      colorBgElevated: c.surface,
      colorText: c.text,
      colorTextSecondary: c.textSecondary,
      colorBorderSecondary: c.border,
      borderRadius: 8,
      fontFamily: '"Inter Variable", system-ui, sans-serif',
    },
    components: {
      Layout: { headerBg: c.surface, headerPadding: "0 16px", bodyBg: c.bg },
    },
  };
}
