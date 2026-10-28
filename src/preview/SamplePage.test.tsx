import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createGuide } from "../model/presets";
import SamplePage from "./SamplePage";

test("renders with the guide's variables and toggles dark mode", async () => {
  const g = createGuide();
  g.basics.description = "We sell bikes.";
  render(<SamplePage guide={g} />);
  const page = screen.getByTestId("sample-page");
  expect(page.style.getPropertyValue("--color-bg")).toBe("#ffffff");
  expect(screen.getByText("We sell bikes.")).toBeInTheDocument();
  await userEvent.click(screen.getByTitle("Dark").closest("label")!);
  expect(page.style.getPropertyValue("--color-bg")).toBe("var(--color-neutral-950)");
  for (const link of screen.getAllByRole("link")) fireEvent.click(link);
  fireEvent.submit(screen.getByLabelText("Email").closest("form")!);
  expect(window.location.hash).toBe("");
});

test("shows the uploaded logo, loads fonts, and cleans up", () => {
  const g = createGuide();
  g.logo.previewDataUrl = "data:image/png;base64,AA";
  g.basics.name = "Acme";
  const { unmount } = render(<SamplePage guide={g} />);
  expect(screen.getByAltText("Acme")).toBeInTheDocument();
  expect(document.querySelectorAll('link[data-preview="fonts"]')).toHaveLength(1);
  unmount();
  expect(document.querySelectorAll('link[data-preview="fonts"]')).toHaveLength(0);
});

test("loads no font link when every family is custom", () => {
  const g = createGuide();
  for (const k of ["heading", "body", "mono"] as const) g.typography[k].source = "custom";
  render(<SamplePage guide={g} />);
  expect(document.querySelectorAll('link[data-preview="fonts"]')).toHaveLength(0);
});
