import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { encodeGuide } from "../lib/share";
import { listGuides } from "../lib/storage";
import { createGuide } from "../model/presets";
import { renderAt } from "../test/utils";

beforeEach(() => localStorage.clear());

test("a valid link can be saved as a copy", async () => {
  const g = createGuide("playful");
  g.basics.name = "Shared Co";
  renderAt(`/import?d=${encodeGuide(g)}`);
  expect(screen.getByText("Shared styleguide: Shared Co")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Save a copy" }));
  expect(
    await screen.findByRole("heading", { name: "Basics & voice", level: 2 }),
  ).toBeInTheDocument();
  expect(listGuides()[0].name).toBe("Shared Co");
});

test("a broken or missing link explains itself", () => {
  renderAt("/import");
  expect(screen.getByText("Couldn't open this share link")).toBeInTheDocument();
  expect(screen.getByText("This share link is incomplete or damaged.")).toBeInTheDocument();
});
