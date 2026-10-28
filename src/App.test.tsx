import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "./test/utils";
import { THEME_KEY } from "./theme";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

// antd Segmented radios ignore pointer events; click the option's label instead.
const pick = (title: string) => userEvent.click(screen.getByTitle(title).closest("label")!);

test("renders the guide list at the root", () => {
  renderAt("/");
  expect(screen.getByRole("heading", { name: "Your styleguides" })).toBeInTheDocument();
});

test("unknown routes show not found", () => {
  renderAt("/nowhere");
  expect(screen.getByText("Page not found")).toBeInTheDocument();
});

test("theme preference is applied and remembered", async () => {
  renderAt("/");
  expect(document.documentElement.dataset.theme).toBe("light");
  await pick("Dark");
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  await pick("System");
  expect(localStorage.getItem(THEME_KEY)).toBeNull();
  expect(document.documentElement.dataset.theme).toBe("light");
});

test("system preference changes are followed", () => {
  let listener: (e: { matches: boolean }) => void = () => {};
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({
        matches: true,
        media: query,
        addEventListener: (_: string, l: typeof listener) => (listener = l),
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );
  renderAt("/");
  expect(document.documentElement.dataset.theme).toBe("dark");
  act(() => listener({ matches: false }));
  expect(document.documentElement.dataset.theme).toBe("light");
});

test("a stored preference is read, and storage errors fall back to system", async () => {
  localStorage.setItem(THEME_KEY, "dark");
  const { unmount } = renderAt("/");
  expect(document.documentElement.dataset.theme).toBe("dark");
  unmount();
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  renderAt("/");
  expect(document.documentElement.dataset.theme).toBe("light");
  await pick("Dark");
  expect(document.documentElement.dataset.theme).toBe("dark");
});
