import { downloadFile, mimeFor } from "./download";

test("mimeFor maps known extensions", () => {
  expect(mimeFor("STYLEGUIDE.md")).toBe("text/markdown");
  expect(mimeFor("tailwind.config.js")).toBe("text/javascript");
  expect(mimeFor("x.unknown")).toBe("text/plain");
});

test("downloadFile clicks a temporary object-URL link", () => {
  vi.useFakeTimers();
  URL.createObjectURL = vi.fn(() => "blob:x");
  URL.revokeObjectURL = vi.fn();
  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  downloadFile("a.css", "body{}", "text/css");
  expect(click).toHaveBeenCalled();
  vi.runAllTimers();
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:x");
  vi.useRealTimers();
});
