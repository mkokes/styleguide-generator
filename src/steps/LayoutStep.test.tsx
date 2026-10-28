import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderStep } from "../test/utils";

beforeEach(() => localStorage.clear());

test("edits spacing, radius, shadows, motion and breakpoints", async () => {
  const { saved } = await renderStep("layout");
  const base = screen.getByLabelText("Base unit");
  await userEvent.clear(base);
  await userEvent.type(base, "8");
  await userEvent.clear(base);
  await userEvent.tab();
  const scale = screen.getByLabelText("Scale (multiples of the base unit)");
  await userEvent.clear(scale);
  await userEvent.type(scale, "0, 1, x, 2,, 4");
  await userEvent.tab();
  expect(scale).toHaveValue("0, 1, 2, 4");

  const md = screen.getAllByLabelText("md")[0];
  await userEvent.clear(md);
  await userEvent.type(md, "10");
  await userEvent.clear(screen.getByLabelText("lg shadow blur"));
  await userEvent.type(screen.getByLabelText("lg shadow blur"), "40");
  await userEvent.clear(screen.getByLabelText("sm shadow opacity"));

  const fast = screen.getByLabelText("fast");
  await userEvent.clear(fast);
  await userEvent.type(fast, "100");

  const ease = screen.getByLabelText("standard easing");
  await userEvent.clear(ease);
  await userEvent.type(ease, "0.4, 0");
  expect(ease).toHaveClass("ant-input-status-error");
  await userEvent.tab();
  await userEvent.clear(ease);
  await userEvent.type(ease, "0.4, 0, 0.2, 1");
  await userEvent.tab();

  const xl = screen.getAllByLabelText("xl")[1];
  await userEvent.clear(xl);
  await userEvent.type(xl, "1440");

  const l = saved().layout;
  expect(l.spacingBase).toBe(4);
  expect(l.spacingScale).toEqual([0, 1, 2, 4]);
  expect(l.radius.md).toBe(10);
  expect(l.shadow.lg.blur).toBe(40);
  expect(l.shadow.sm.opacity).toBe(0.06);
  expect(l.duration.fast).toBe(100);
  expect(l.easing.standard).toEqual([0.4, 0, 0.2, 1]);
  expect(l.breakpoints.xl).toBe(1440);
});
