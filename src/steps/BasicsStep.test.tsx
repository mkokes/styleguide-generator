import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderStep } from "../test/utils";

beforeEach(() => localStorage.clear());

test("edits every basics field", async () => {
  const { saved } = await renderStep("basics");
  await userEvent.type(screen.getByLabelText("What it is"), "Books for humans");
  await userEvent.type(screen.getByLabelText("Audience"), "Freelancers");
  await userEvent.type(screen.getByLabelText("Voice and tone"), "Warm");
  await userEvent.type(screen.getByLabelText("Personality"), "Friendly{Enter}");
  await userEvent.type(screen.getByLabelText("Personality"), "   {Enter}");
  await userEvent.type(screen.getByLabelText("Personality"), "Calm");
  await userEvent.click(screen.getByRole("button", { name: "Add to Personality" }));
  await userEvent.click(screen.getByLabelText("Remove Friendly"));
  await userEvent.type(screen.getByLabelText("Writing: do"), "Be brief{Enter}");
  await userEvent.type(screen.getByLabelText("Writing: don't"), "Shout{Enter}");
  const b = saved().basics;
  expect(b).toMatchObject({
    description: "Books for humans",
    audience: "Freelancers",
    voice: "Warm",
    personality: ["Calm"],
    writingDo: ["Be brief"],
    writingDont: ["Shout"],
  });
});
