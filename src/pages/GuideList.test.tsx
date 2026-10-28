import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as download from "../lib/download";
import { serializeProject } from "../lib/projectFile";
import { listGuides } from "../lib/storage";
import { createGuide } from "../model/presets";
import { renderAt, seedGuide } from "../test/utils";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

test("empty state offers to create a guide", async () => {
  renderAt("/");
  expect(screen.getByText("No styleguides yet")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Create your first guide" }));
  expect(screen.getByRole("dialog", { name: "New styleguide" })).toBeInTheDocument();
});

test("creating from a preset saves it and opens the wizard", async () => {
  renderAt("/");
  await userEvent.click(screen.getByRole("button", { name: /New guide/ }));
  await userEvent.click(screen.getByRole("button", { name: "Editorial" }));
  expect(
    await screen.findByRole("heading", { name: "Basics & voice", level: 2 }),
  ).toBeInTheDocument();
  expect(listGuides()).toHaveLength(1);
});

test("creating a blank guide, and closing the dialog", async () => {
  renderAt("/");
  await userEvent.click(screen.getByRole("button", { name: /New guide/ }));
  await userEvent.click(screen.getByRole("button", { name: "Close" }));
  await userEvent.click(screen.getByRole("button", { name: /New guide/ }));
  await userEvent.click(screen.getByRole("button", { name: "Blank" }));
  expect(
    await screen.findByRole("heading", { name: "Basics & voice", level: 2 }),
  ).toBeInTheDocument();
});

test("a storage failure keeps the user on the list", async () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("quota");
  });
  renderAt("/");
  await userEvent.click(screen.getByRole("button", { name: /New guide/ }));
  await userEvent.click(screen.getByRole("button", { name: "Blank" }));
  expect(await screen.findByText("Couldn't save to this browser's storage.")).toBeInTheDocument();
});

test("duplicate, export and delete a guide", async () => {
  const g = seedGuide((x) => (x.basics.name = "Acme"));
  const dl = vi.spyOn(download, "downloadFile").mockImplementation(() => {});
  renderAt("/");
  await userEvent.click(screen.getByRole("button", { name: /Duplicate/ }));
  expect(screen.getByText("Acme (copy)")).toBeInTheDocument();

  await userEvent.click(screen.getAllByRole("button", { name: /Export/ })[1]);
  expect(dl).toHaveBeenCalledWith(
    "acme.styleguide.json",
    expect.stringContaining(g.id),
    "application/json",
  );

  await userEvent.click(screen.getAllByRole("button", { name: /Delete/ })[1]);
  await userEvent.click(await screen.findByRole("button", { name: "Delete" }));
  await waitFor(() => expect(screen.queryByRole("link", { name: "Acme" })).not.toBeInTheDocument());
  expect(screen.getByText("Acme (copy)")).toBeInTheDocument();
});

test("actions on a guide that vanished from storage do nothing", async () => {
  const g = seedGuide();
  const dl = vi.spyOn(download, "downloadFile").mockImplementation(() => {});
  renderAt("/");
  localStorage.removeItem(`sg:guide:${g.id}`);
  await userEvent.click(screen.getByRole("button", { name: /Duplicate/ }));
  await userEvent.click(screen.getByRole("button", { name: /Export/ }));
  expect(dl).not.toHaveBeenCalled();
});

test("importing a project file opens it; a bad file shows the error", async () => {
  renderAt("/");
  const input = screen.getByTestId("import-input");
  fireEvent.change(input, { target: { files: [] } });
  fireEvent.change(input, { target: { files: [new File(["nope"], "x.json")] } });
  expect(await screen.findByText("That file isn't valid JSON.")).toBeInTheDocument();
  const g = createGuide();
  g.basics.name = "Imported";
  fireEvent.change(input, { target: { files: [new File([serializeProject(g)], "x.json")] } });
  expect(
    await screen.findByRole("heading", { name: "Basics & voice", level: 2 }),
  ).toBeInTheDocument();
  expect(listGuides()[0].name).toBe("Imported");
});

test("the import button opens the file chooser", async () => {
  renderAt("/");
  const click = vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => {});
  await userEvent.click(screen.getByRole("button", { name: /Import file/ }));
  expect(click).toHaveBeenCalled();
});
