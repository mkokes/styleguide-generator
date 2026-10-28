import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { NumberGrid, parseNumberList } from "./fields";

test("parseNumberList drops blanks and non-numbers", () => {
  expect(parseNumberList(" 1, 2.5, , x, 4 ")).toEqual([1, 2.5, 4]);
  expect(parseNumberList("")).toEqual([]);
});

test("NumberGrid treats a cleared input as 0", async () => {
  function Harness() {
    const [v, setV] = useState({ a: 5 });
    return (
      <>
        <NumberGrid<"a"> values={v} onChange={setV} />
        <output>{v.a}</output>
      </>
    );
  }
  render(<Harness />);
  await userEvent.clear(screen.getByLabelText("a"));
  expect(screen.getByRole("status")).toHaveTextContent("0");
});
