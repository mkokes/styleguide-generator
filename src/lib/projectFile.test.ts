import { createGuide } from "../model/presets";
import { parseProject, serializeProject } from "./projectFile";

test("round-trips a guide with a fresh id", () => {
  const g = createGuide("editorial");
  const back = parseProject(serializeProject(g));
  expect(back.id).not.toBe(g.id);
  expect(back.typography).toEqual(g.typography);
  expect(back.basics).toEqual(g.basics);
});

test("rejects bad files with a readable message", () => {
  expect(() => parseProject("nope")).toThrow("isn't valid JSON");
  expect(() => parseProject("null")).toThrow("isn't a Styleguide Generator project");
  expect(() => parseProject('{"app":"other"}')).toThrow("isn't a Styleguide Generator project");
  expect(() => parseProject('{"app":"styleguide-generator","version":"1"}')).toThrow(
    "newer version",
  );
  expect(() => parseProject('{"app":"styleguide-generator","version":99}')).toThrow(
    "newer version",
  );
  expect(() => parseProject('{"app":"styleguide-generator","version":1,"guide":{}}')).toThrow(
    "Not a styleguide",
  );
});
