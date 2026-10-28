import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Grid } from "antd";
import { loadGuide } from "../lib/storage";
import { renderAt, seedGuide } from "../test/utils";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

const h2 = (name: string) => screen.findByRole("heading", { name, level: 2 });

test("an unknown guide id shows not found", async () => {
  renderAt("/guide/missing/basics");
  expect(
    await screen.findByText("That styleguide doesn't exist on this device"),
  ).toBeInTheDocument();
});

test("a missing or unknown step redirects to the first step", async () => {
  const g = seedGuide();
  renderAt(`/guide/${g.id}/bogus`);
  expect(await h2("Basics & voice")).toBeInTheDocument();
});

test("next/back and the step list navigate", async () => {
  vi.spyOn(Grid, "useBreakpoint").mockReturnValue({ lg: true });
  const g = seedGuide();
  renderAt(`/guide/${g.id}`);
  expect(await h2("Basics & voice")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Back/ })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: /Next: Color/ }));
  expect(await h2("Color")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: /Back/ }));
  expect(await h2("Basics & voice")).toBeInTheDocument();
  const nav = screen.getByRole("navigation", { name: "Styleguide sections" });
  await userEvent.click(within(nav).getByText("Review & export"));
  expect(await h2("Review & export")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Next/ })).not.toBeInTheDocument();
});

test("small screens pick steps from a dropdown", async () => {
  vi.spyOn(Grid, "useBreakpoint").mockReturnValue({ lg: false });
  const g = seedGuide();
  renderAt(`/guide/${g.id}/basics`);
  await userEvent.click(await screen.findByRole("combobox", { name: "Section" }));
  await userEvent.click(await screen.findByTitle("6. Iconography"));
  expect(await h2("Iconography")).toBeInTheDocument();
});

test("step status reflects the guide", async () => {
  vi.spyOn(Grid, "useBreakpoint").mockReturnValue({ lg: true });
  const g = seedGuide((x) => {
    x.colors.roles.light.text = "neutral-100";
    x.basics.description = "d";
    x.basics.voice = "v";
    x.icons.library = "Lucide";
    x.imagery.style = "s";
  });
  renderAt(`/guide/${g.id}/layout`);
  await h2("Spacing & motion");
  const items = screen
    .getByRole("navigation", { name: "Styleguide sections" })
    .querySelectorAll(".ant-steps-item");
  const cls = [...items].map((i) => i.className);
  expect(cls[0]).toContain("finish");
  expect(cls[1]).toContain("error");
  expect(cls[3]).toContain("process");
  expect(cls[4]).toContain("finish");
  expect(cls[5]).toContain("finish");
  expect(cls[7]).toContain("wait");
});

test("edits autosave, and pending edits flush when leaving", async () => {
  const g = seedGuide();
  const { unmount } = renderAt(`/guide/${g.id}/basics`);
  const name = await screen.findByLabelText("Brand or product name");
  await userEvent.clear(name);
  await userEvent.type(name, "Acme");
  await waitFor(() => expect(loadGuide(g.id)!.basics.name).toBe("Acme"));
  await userEvent.type(name, "!");
  unmount();
  expect(loadGuide(g.id)!.basics.name).toBe("Acme!");
});

test("a failed autosave shows a warning", async () => {
  const g = seedGuide();
  renderAt(`/guide/${g.id}/basics`);
  const name = await screen.findByLabelText("Brand or product name");
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("quota");
  });
  await userEvent.type(name, "x");
  expect(await screen.findByText(/Couldn't save to this browser/)).toBeInTheDocument();
});
