import type { RoleKey } from "./types";

export const ROLE_USAGE: Record<RoleKey, string> = {
  bg: "Page background",
  surface: "Cards, panels, menus and other raised areas",
  text: "Body text and headings",
  textMuted: "Secondary text, captions, placeholders",
  border: "Dividers and input/card borders",
  primary: "Fill for primary actions and selected states",
  onPrimary: "Text and icons placed on a primary fill",
  link: "Links, focus rings, current nav item, brand-colored text and icons on the background",
  success: "Success messages and icons",
  warning: "Warning messages and icons",
  danger: "Errors, destructive actions",
  info: "Informational messages and icons",
};
