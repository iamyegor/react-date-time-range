import { render, screen } from "@testing-library/react";
import {
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { beforeEach, describe, expect, it } from "vitest";
import Cells from "../Cells";

describe("Cells component", () => {
  let currentMonth: Date;

  beforeEach(() => {
    currentMonth = new Date(2023, 6, 15);
    render(
      <Cells
        currentMonth={currentMonth}
        selectedDate={new Date()}
        onDateSelect={() => {}}
      />
    );
  });

  it("renders correct number of day elements for a given month", () => {
    const startDay = startOfWeek(startOfMonth(currentMonth));
    const endDay = endOfWeek(endOfMonth(currentMonth));
    const totalDays = differenceInCalendarDays(endDay, startDay) + 1;

    const dayElements = screen.getAllByText(/^\d+$/);

    expect(dayElements.length).toBe(totalDays);
  });
});
