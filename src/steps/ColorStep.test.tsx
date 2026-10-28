import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockColorPicker } from "../test/mockColorPicker";
import { renderStep } from "../test/utils";

vi.mock("antd", async (orig) => ({
  ...(await orig<typeof import("antd")>()),
  ColorPicker: MockColorPicker,
}));

beforeEach(() => localStorage.clear());

test("base colors change through the hex box and the picker", async () => {
  const { saved } = await renderStep("color");
  const primary = screen.getByLabelText("primary");
  await userEvent.clear(primary);
  await userEvent.type(primary, "#zz");
  expect(primary).toHaveClass("ant-input-status-error");
  await userEvent.clear(primary);
  await userEvent.type(primary, "#0f766e");
  await userEvent.click(screen.getByText("pick #2563EB"));
  const c = saved().colors;
  expect(c.base.primary).toBe("#0f766e");
  expect(c.base.info).toBe("#123456");
});

test("scale steps can be overridden and reset", async () => {
  const { saved } = await renderStep("color");
  const pickFor = (title: RegExp) =>
    within(screen.getByTitle(title).parentElement!).getByText(/^pick/);
  await userEvent.click(pickFor(/^accent-100 /));
  await userEvent.click(pickFor(/^accent-200 /));
  expect(screen.getByTitle("accent-100 #123456")).toHaveClass("is-overridden");
  // Re-picking an overridden step replaces it.
  await userEvent.click(pickFor(/^accent-100 #123456/));
  await userEvent.click(screen.getByText("Reset accent"));
  expect(screen.queryByText("Reset accent")).not.toBeInTheDocument();
  expect(saved().colors.overrides).toEqual({});
});

test("roles can be remapped and contrast fixes applied", async () => {
  const { saved } = await renderStep("color", (g) => {
    g.colors.roles.light.textMuted = "neutral-300";
    g.colors.roles.dark.text = "black";
  });
  expect(screen.getAllByText(/Needs 4.5:1/).length).toBeGreaterThan(0);
  // Text queries: role/name queries over this step's ~200 buttons take seconds in jsdom.
  await userEvent.click(screen.getAllByText(/^Use neutral-/)[0]);

  const combo = screen.getByRole("combobox", { name: "border (dark)" });
  await userEvent.click(combo);
  fireEvent.change(combo, { target: { value: "neutral-700" } });
  await userEvent.click((await screen.findAllByText("neutral-700")).at(-1)!);
  const roles = saved().colors.roles;
  expect(roles.light.textMuted).not.toBe("neutral-300");
  expect(roles.dark.border).toBe("neutral-700");
});

test("color rules are editable", async () => {
  const { saved } = await renderStep("color");
  await userEvent.type(screen.getByLabelText("Do"), "Use sparingly{Enter}");
  await userEvent.type(screen.getByLabelText("Don't"), "Use red{Enter}");
  expect(saved().rules.color).toEqual({ do: ["Use sparingly"], dont: ["Use red"] });
});
