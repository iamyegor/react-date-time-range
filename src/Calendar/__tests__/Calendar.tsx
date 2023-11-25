import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Calendar from "../Calendar"; // Adjust the import path as necessary
import {
  format,
  subMonths,
  addMonths,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  differenceInCalendarDays,
} from "date-fns";
import { ReactNode } from "react";

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

  const countDaysInMonth = (month: Date) => {
    const startDay = startOfWeek(startOfMonth(month));
    const endDay = endOfWeek(endOfMonth(month));
    return differenceInCalendarDays(endDay, startDay) + 1;
  };

  it("changes to the previous month in the calendar when previous button is clicked", async () => {
    const currentMonth = new Date();
    const prevMonth = subMonths(currentMonth, 1);
    const totalDaysPrevMonth = countDaysInMonth(prevMonth);

    await userEvent.click(screen.getByTestId("left-arrow"));
    const dayElements = screen.getAllByText(/^\d+$/);
    expect(dayElements.length).toBe(totalDaysPrevMonth);
  });

  it("changes to the next month in the calendar when next button is clicked", async () => {
    const currentMonth = new Date();
    const nextMonth = addMonths(currentMonth, 1);
    const totalDaysNextMonth = countDaysInMonth(nextMonth);

    await userEvent.click(screen.getByTestId("right-arrow"));
    const dayElements = screen.getAllByText(/^\d+$/);
    expect(dayElements.length).toBe(totalDaysNextMonth);
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
