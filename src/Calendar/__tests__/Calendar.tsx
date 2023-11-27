import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { addMonths, format, subMonths } from "date-fns";
import { ReactNode } from "react";
import Calendar from "../Calendar"; // Adjust the import path as necessary
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  differenceInCalendarDays,
} from "date-fns";

vi.mock("react-transition-group", () => {
  return {
    CSSTransition: ({ children }: { children: ReactNode }) => children,
    TransitionGroup: ({ children }: { children: ReactNode }) => children,
  };
});

describe("Calendar Component", () => {
  beforeEach(async () => {
    render(<Calendar />);
  });

  function calculateEmptyCellsForMonth(month: Date): number {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return (
      differenceInCalendarDays(monthStart, startDate) +
      differenceInCalendarDays(endDate, monthEnd)
    );
  }

  it("changes to the previous month in the calendar when previous button is clicked", async () => {
    const prevButton = screen.getByTestId("left-arrow");
    await userEvent.click(prevButton);

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const expectedEmptyCells = calculateEmptyCellsForMonth(lastMonth);

    const emptyCells = screen.getAllByTestId("empty-cell");
    expect(emptyCells.length).toBe(expectedEmptyCells);
  });

  it("changes to the next month in the calendar when next button is clicked", async () => {
    const nextButton = screen.getByTestId("right-arrow");
    await userEvent.click(nextButton);

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const expectedEmptyCells = calculateEmptyCellsForMonth(nextMonth);

    const emptyCells = screen.getAllByTestId("empty-cell");
    expect(emptyCells.length).toBe(expectedEmptyCells);
  });

  it("changes to the previous month in the header when previous button is clicked", async () => {
    const currentMonth = new Date();
    await userEvent.click(screen.getByTestId("left-arrow"));

    const prevMonth = format(subMonths(currentMonth, 1), "MMMM yyyy");
    expect(screen.queryByText(prevMonth)).toBeInTheDocument();
  });

  it("changes to the next month  in the headerwhen next button is clicked", async () => {
    const currentMonth = new Date();
    await userEvent.click(screen.getByTestId("right-arrow"));

    const nextMonth = format(addMonths(currentMonth, 1), "MMMM yyyy");
    expect(screen.queryByText(nextMonth)).toBeInTheDocument();
  });
});
