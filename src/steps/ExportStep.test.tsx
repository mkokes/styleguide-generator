import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as download from "../lib/download";
import { renderStep } from "../test/utils";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

function mockClipboard(impl: () => Promise<void>) {
  const writeText = vi.fn(impl);
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  return writeText;
}

test("downloads, copies and previews the outputs", async () => {
  const dl = vi.spyOn(download, "downloadFile").mockImplementation(() => {});
  const writeText = mockClipboard(() => Promise.resolve());
  await renderStep("export", (g) => (g.basics.name = "Acme"));

  await userEvent.click(screen.getByRole("button", { name: /Download .zip/ }));
  expect(dl).toHaveBeenCalledWith("acme-styleguide.zip", expect.any(Uint8Array), "application/zip");
  await userEvent.click(screen.getByRole("button", { name: /Export project file/ }));
  expect(dl).toHaveBeenCalledWith(
    "acme.styleguide.json",
    expect.stringContaining('"app"'),
    "application/json",
  );

  await userEvent.click(screen.getByRole("button", { name: /Copy share link/ }));
  expect(writeText).toHaveBeenCalledWith(expect.stringContaining("#/import?d="));
  expect(await screen.findByText("Share link copied")).toBeInTheDocument();

  expect(screen.getByLabelText("STYLEGUIDE.md contents")).toHaveTextContent("# Acme Styleguide");
  await userEvent.click(screen.getByRole("tab", { name: "tokens.css" }));
  const panel = screen.getByRole("tabpanel", { name: "tokens.css" });
  await userEvent.click(panel.querySelector("button")!);
  expect(writeText).toHaveBeenLastCalledWith(expect.stringContaining(":root {"));
  await userEvent.click(screen.getAllByRole("button", { name: /Download$/ }).at(-1)!);
  expect(dl).toHaveBeenLastCalledWith("tokens.css", expect.stringContaining(":root"), "text/css");
});

test("clipboard failures are reported", async () => {
  mockClipboard(() => Promise.reject(new Error("denied")));
  await renderStep("export", (g) => (g.logo.previewDataUrl = "data:image/png;base64,AA"));
  expect(screen.getByText("Share links leave out the uploaded logo image.")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: /Copy share link/ }));
  expect(await screen.findByText(/Couldn't copy/)).toBeInTheDocument();
});

test("output toggles change the file list", async () => {
  const { saved } = await renderStep("export");
  await userEvent.click(screen.getByText("v3"));
  expect(screen.getByRole("tab", { name: "tailwind.config.js" })).toBeInTheDocument();
  await userEvent.click(screen.getByText("Off"));
  for (const label of ["STYLEGUIDE.md", "tokens.css", "tokens.json (DTCG)"]) {
    await userEvent.click(screen.getByRole("checkbox", { name: label }));
  }
  expect(screen.getByText("Pick at least one output.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Download .zip/ })).toBeDisabled();
  expect(saved().outputs).toEqual({ markdown: false, css: false, tailwind: "off", dtcg: false });
});
