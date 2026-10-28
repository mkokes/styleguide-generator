import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderStep } from "../test/utils";
import { readAsDataUrl } from "./LogoImageryStep";

beforeEach(() => localStorage.clear());

test("manages logo variants and rules", async () => {
  const { saved } = await renderStep("logo");
  await userEvent.click(screen.getByRole("button", { name: /Add variant/ }));
  await userEvent.click(screen.getByRole("button", { name: /Add variant/ }));
  await userEvent.type(screen.getByLabelText("Variant 1 name"), "Full");
  await userEvent.type(screen.getByLabelText("Variant 1 path"), "logo.svg");
  await userEvent.click(screen.getByLabelText("Variant 1 background"));
  await userEvent.click(await screen.findByTitle("Dark backgrounds"));
  await userEvent.click(screen.getByLabelText("Remove variant 2"));
  await userEvent.type(screen.getByLabelText("Minimum size"), "24px");
  await userEvent.type(screen.getByLabelText("Clear space"), "1x");
  await userEvent.type(screen.getByLabelText("Never do this to the logo"), "Stretch{Enter}");
  await userEvent.type(screen.getByLabelText("Photography and illustration style"), "Warm");
  const g = saved();
  expect(g.logo).toMatchObject({
    variants: [{ name: "Full", path: "logo.svg", background: "dark" }],
    minSize: "24px",
    clearSpace: "1x",
    misuse: ["Stretch"],
  });
  expect(g.imagery.style).toBe("Warm");
});

test("uploads a small logo preview, rejects large ones, and removes it", async () => {
  const { saved, container } = await renderStep("logo");
  const input = () => container.querySelector<HTMLInputElement>('input[type="file"]')!;
  await userEvent.upload(input(), new File(["png"], "logo.png", { type: "image/png" }));
  expect(await screen.findByAltText("Logo preview")).toBeInTheDocument();
  const big = new File([new Uint8Array(600 * 1024)], "big.png", { type: "image/png" });
  // rc-upload swaps its <input> after each upload, so query it again.
  await userEvent.upload(input(), big);
  expect(await screen.findByText("That image is over 512 KB.")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Remove" }));
  await waitFor(() => expect(screen.queryByAltText("Logo preview")).not.toBeInTheDocument());
  expect(saved().logo.previewDataUrl).toBeUndefined();
});

test("readAsDataUrl rejects on read errors", async () => {
  const proto = FileReader.prototype;
  const orig = proto.readAsDataURL;
  proto.readAsDataURL = function () {
    this.onerror?.(new ProgressEvent("error") as ProgressEvent<FileReader>);
  };
  await expect(readAsDataUrl(new Blob(["x"]))).rejects.toBeNull();
  proto.readAsDataURL = orig;
});
