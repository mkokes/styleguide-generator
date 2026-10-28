import { compressToEncodedURIComponent } from "lz-string";
import { createGuide } from "../model/presets";
import { decodeGuide, encodeGuide, shareUrl } from "./share";

test("round-trips a guide without the logo upload", () => {
  const g = createGuide("minimal");
  g.logo = { ...g.logo, previewDataUrl: "data:image/png;base64,AAAA", previewFileName: "logo.png" };
  const back = decodeGuide(encodeGuide(g));
  expect(back.id).not.toBe(g.id);
  expect(back.colors).toEqual(g.colors);
  expect(back.logo.previewDataUrl).toBeUndefined();
  expect(back.logo.previewFileName).toBeUndefined();
});

test("shareUrl points at the import route", () => {
  const url = shareUrl(createGuide(), { origin: "https://x.dev", pathname: "/app/" });
  expect(url.startsWith("https://x.dev/app/#/import?d=")).toBe(true);
});

test("damaged links throw a readable error", () => {
  expect(() => decodeGuide("")).toThrow("incomplete or damaged");
  expect(() => decodeGuide(compressToEncodedURIComponent("not json"))).toThrow(
    "incomplete or damaged",
  );
  expect(() => decodeGuide(compressToEncodedURIComponent("[1]"))).toThrow("incomplete or damaged");
});
