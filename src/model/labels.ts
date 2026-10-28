import type { RoleKey } from "./types";

export const ROLE_USAGE: Record<RoleKey, string> = {
  bg: "Page background",
  surface: "Cards, panels, menus and other raised areas",
  text: "Body text and headings",
  textMuted: "Secondary text, captions, placeholders",
  border: "Dividers and input/card borders",
  primary: "Primary actions, links, focus rings, selected states",
  onPrimary: "Text and icons placed on a primary background",
  success: "Success messages and icons",
  warning: "Warning messages and icons",
  danger: "Errors, destructive actions",
  info: "Informational messages and icons",
};
