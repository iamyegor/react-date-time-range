import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Cells from "../Cells";

describe("Cells component", () => {
  let currentMonth: Date;

  beforeEach(() => {
    currentMonth = new Date(2023, 6, 15);
    render(
      <Cells
        currentMonth={currentMonth}
        firstDate={null}
        secondDate={null}
        setFirstDate={() => {}}
        setSecondDate={() => {}}
      />
    );
  });

  it("renders correct number of day elements for a given month", () => {
    const dayElements = screen.getAllByText(/^\d+$/);

    expect(dayElements.length).toBe(31);
  });
});
