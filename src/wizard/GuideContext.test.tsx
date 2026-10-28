import { render } from "@testing-library/react";
import { useGuide } from "./GuideContext";

test("useGuide outside a provider throws", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  const Bad = () => {
    useGuide();
    return null;
  };
  expect(() => render(<Bad />)).toThrow("useGuide must be used inside GuideProvider");
});
