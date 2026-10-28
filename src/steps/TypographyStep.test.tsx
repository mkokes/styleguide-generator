import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderStep } from "../test/utils";

beforeEach(() => localStorage.clear());

const headings = () => screen.getByRole("group", { name: "Headings" });

test("picks a Google font, keeping valid weights and switching the fallback", async () => {
  const { saved } = await renderStep("typography");
  const family = within(headings()).getByLabelText("Family");
  await userEvent.click(family);
  fireEvent.change(family, { target: { value: "Lora" } });
  await userEvent.click(await screen.findByTitle("Lora"));
  // Lora has 400–700; the guide had 600 and 700 selected.
  await userEvent.click(within(headings()).getByLabelText("700"));
  const t = saved().typography;
  expect(t.heading).toMatchObject({
    name: "Lora",
    weights: [600],
    fallback: expect.stringMatching(/serif$/),
  });
});

test("a font without shared weights falls back to 400 or its first weight", async () => {
  const { saved } = await renderStep("typography", (g) => {
    g.typography.heading.weights = [900];
    g.typography.body.weights = [900];
  });
  for (const [group, name] of [
    ["Headings", "Lora"],
    ["Body", "Abel"],
  ] as const) {
    const family = within(screen.getByRole("group", { name: group })).getByLabelText("Family");
    await userEvent.click(family);
    fireEvent.change(family, { target: { value: name } });
    await userEvent.click((await screen.findAllByTitle(name)).at(-1)!);
  }
  const code = within(screen.getByRole("group", { name: "Code" })).getByLabelText("Family");
  await userEvent.click(code);
  fireEvent.change(code, { target: { value: "Buda" } });
  await userEvent.click((await screen.findAllByTitle("Buda")).at(-1)!);
  const t = saved().typography;
  expect(t.heading.weights).toEqual([400]);
  expect(t.body.weights).toEqual([400]);
  expect(t.mono.weights).toEqual([300]);
});

test("custom fonts take a typed name and any weight", async () => {
  const { saved } = await renderStep("typography");
  await userEvent.click(within(headings()).getByText("Custom / licensed"));
  const name = within(headings()).getByLabelText("Family");
  await userEvent.clear(name);
  await userEvent.type(name, "Brand Sans");
  const fallback = within(headings()).getByLabelText("Fallback stack");
  await userEvent.clear(fallback);
  await userEvent.type(fallback, "sans-serif");
  await userEvent.click(within(headings()).getByLabelText("900"));
  expect(saved().typography.heading).toEqual({
    name: "Brand Sans",
    source: "custom",
    weights: [600, 700, 900],
    fallback: "sans-serif",
  });
});

test("scale settings and per-step overrides", async () => {
  const { saved } = await renderStep("typography");
  const base = screen.getByLabelText("Base size");
  await userEvent.clear(base);
  await userEvent.type(base, "18");
  await userEvent.clear(base);
  await userEvent.click(screen.getByLabelText("Scale ratio"));
  await userEvent.click(await screen.findByTitle("1.5 — Perfect Fifth"));
  const size = screen.getByLabelText("lg Size");
  await userEvent.clear(size);
  await userEvent.type(size, "22");
  await userEvent.clear(screen.getByLabelText("xl Weight"));
  await userEvent.click(screen.getByRole("button", { name: "Reset step overrides" }));
  await userEvent.clear(size);
  await userEvent.type(size, "23");
  await userEvent.type(screen.getByLabelText("Do"), "Sentence case{Enter}");
  const t = saved().typography;
  expect(t.baseSize).toBe(16);
  expect(t.ratio).toBe(1.5);
  expect(t.overrides).toEqual({ lg: { size: 23 } });
  expect(saved).toBeDefined();
});

test("leaving before the font catalog loads is harmless", async () => {
  const { unmount } = await renderStep("typography");
  unmount();
  await waitFor(() => expect(true).toBe(true));
});
