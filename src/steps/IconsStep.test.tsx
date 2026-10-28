import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderStep } from "../test/utils";

beforeEach(() => localStorage.clear());

test("edits icon settings; stroke hides for filled icons", async () => {
  const { saved } = await renderStep("icons");
  await userEvent.type(screen.getByLabelText("Icon library"), "luc");
  await userEvent.click(await screen.findByTitle("Lucide"));
  const stroke = screen.getByLabelText("Stroke width");
  await userEvent.clear(stroke);
  await userEvent.type(stroke, "2");
  await userEvent.clear(stroke);
  const sizes = screen.getByLabelText("Sizes (px)");
  await userEvent.clear(sizes);
  await userEvent.type(sizes, "16, 24");
  await userEvent.tab();
  await userEvent.click(screen.getByText("Filled"));
  expect(screen.queryByLabelText("Stroke width")).not.toBeInTheDocument();
  expect(saved().icons).toEqual({
    library: "Lucide",
    style: "filled",
    sizes: [16, 24],
    stroke: 1.5,
  });
});
