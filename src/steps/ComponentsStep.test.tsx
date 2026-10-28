import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderStep } from "../test/utils";

beforeEach(() => localStorage.clear());

test("edits accessibility settings and component notes", async () => {
  const { saved } = await renderStep("components");
  await userEvent.click(screen.getByText("AAA"));
  const focus = screen.getByLabelText("Focus indicator");
  await userEvent.clear(focus);
  await userEvent.type(focus, "3px ring");
  await userEvent.click(screen.getByLabelText("Respect reduced-motion preference"));
  await userEvent.type(screen.getByLabelText("Buttons"), "Pill");
  const g = saved();
  expect(g.accessibility).toEqual({ target: "AAA", focusStyle: "3px ring", reducedMotion: false });
  expect(g.components.notes.button).toBe("Pill");
});
