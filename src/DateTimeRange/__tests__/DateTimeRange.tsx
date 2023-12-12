import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ReactNode } from "react";
import { DATE_PLACEHOLDER, getDateTimePlaceholder } from "../../globals";
import DateTimeRange from "../DateTimeRange";

Element.prototype.scrollTo = () => {};
vi.mock("react-transition-group", () => {
  return {
    CSSTransition: ({
      children,
      in: inProp = true,
    }: {
      children: ReactNode;
      in: boolean;
    }) => {
      return inProp ? children : null;
    },
    TransitionGroup: ({ children }: { children: ReactNode }) => children,
  };
});

describe("DateTimeRange", () => {
  beforeEach(() => {
    renderDateTimeRange({ useAMPM: true });
  });

  function renderWithMinDate(day: number) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const minDate = new Date(year, month, day);

    renderDateTimeRange({ minDate: minDate, useAMPM: true });
    return minDate;
  }

  function expectSelected(first: number, second: number) {
    const cells = screen.getByTestId("cells");
    const firstSelectedCell = within(cells).getByText(first.toString());
    const secondSelectedCell = within(cells).getByText(second.toString());

    expect(firstSelectedCell).toEqual(
      screen.getAllByTestId("selected-cell")[0]
    );
    expect(secondSelectedCell).toEqual(
      screen.getAllByTestId("selected-cell")[1]
    );
  }

  function getCell(day: number) {
    const cells = screen.getByTestId("cells");
    return within(cells).getByText(day.toString());
  }

  function getEmptyCellsFor(month: Date): number {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return (
      differenceInCalendarDays(monthStart, startDate) +
      differenceInCalendarDays(endDate, monthEnd)
    );
  }

  function renderDateTimeRange({
    useAMPM = false,
    minDate,
  }: { useAMPM?: boolean; minDate?: Date } = {}) {
    cleanup();
    return render(
      <DateTimeRange
        inputText={{ start: "Start Date", end: "End Date" }}
        useAMPM={useAMPM}
        minDate={minDate}
      />
    );
  }

  async function selectCell(cell: string) {
    const cells = screen.getByTestId("cells");
    const selectedDate = within(cells).getByText(cell);
    await userEvent.click(selectedDate);
    return selectedDate;
  }

  async function clickFirstInput() {
    return await userEvent.click(screen.getByText("Start Date"));
  }

  async function clickSecondInput() {
    return await userEvent.click(screen.getByText("End Date"));
  }

  function expectDashedBorderAroundDates(datesToCheck: string[]) {
    const cells = screen.getByTestId("cells");

    datesToCheck.forEach((date, i) => {
      const dashedBorder = screen.getAllByTestId("dashed-border")[i];
      const selectedCell = within(cells).getByText(date);

      expect(dashedBorder.parentElement).toEqual(selectedCell.parentElement);
    });
  }

  async function hoverCell(cell: string) {
    const cells = screen.getByTestId("cells");
    const hoveredCell = within(cells).getByText(cell);
    await userEvent.hover(hoveredCell);
  }

  async function selectHour(hour: number) {
    const hourOptions = screen.getAllByTestId("hour-option");

    const hourElement = hourOptions.filter((option) => {
      return option.textContent === hour.toString().padStart(2, "0");
    })[0];

    await userEvent.click(hourElement);
  }

  function expectOnlyCellIsSelected(cell: HTMLElement) {
    expect(screen.getByTestId("selected-cell")).toEqual(cell);
  }

  function getInputValue(day: number, hour: number = 12) {
    const date = new Date();

    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hourWithPads = hour.toString().padStart(2, "0");
    return `${month}/${day}/${year} ${hourWithPads}:00 AM`;
  }

  function expectDatesHighlighted(dates: string[]) {
    const cells = screen.getByTestId("cells");
    dates.forEach((date, i) => {
      const highlight = screen.getAllByTestId("highlight-between-dates")[i];
      const selectedCell = within(cells).getByText(date);

      expect(highlight.parentElement).toEqual(selectedCell.parentElement);
    });
  }

  it("displays input text", () => {
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("End Date")).toBeInTheDocument();
  });

  it("displays date time placeholder with AMPM when first input is focused", async () => {
    expect(screen.queryByDisplayValue(getDateTimePlaceholder(true))).toBeNull();

    await clickFirstInput();
    expect(
      screen.getByDisplayValue(getDateTimePlaceholder(true))
    ).toBeInTheDocument();
  });

  it("displays date time placeholder with AMPM when second input is focused", async () => {
    expect(screen.queryByDisplayValue(getDateTimePlaceholder(true))).toBeNull();

    await clickSecondInput();
    expect(
      screen.getByDisplayValue(getDateTimePlaceholder(true))
    ).toBeInTheDocument();
  });

  it("displays date time placeholder without AMPM when AMPM is disabled and first input is focused", async () => {
    renderDateTimeRange({ useAMPM: false });

    expect(
      screen.queryByDisplayValue(getDateTimePlaceholder(false))
    ).toBeNull();

    await clickFirstInput();
    expect(
      screen.getByDisplayValue(getDateTimePlaceholder(false))
    ).toBeInTheDocument();
  });

  it("displays date time placeholder without AMPM when AMPM is disabled and second input is focused", async () => {
    renderDateTimeRange({ useAMPM: false });

    expect(
      screen.queryByDisplayValue(getDateTimePlaceholder(false))
    ).toBeNull();

    await clickSecondInput();
    expect(
      screen.getByDisplayValue(getDateTimePlaceholder(false))
    ).toBeInTheDocument();
  });

  it("displays new month in the header when next month button is clicked", async () => {
    const nextMonthObj = addMonths(new Date(), 1);
    const nextMonth = format(nextMonthObj, "MMMM yyyy");

    await clickFirstInput();
    await userEvent.click(screen.getByTestId("next-month-button"));

    expect(screen.getByText(nextMonth)).toBeInTheDocument();
  });

  it("displays previous month in the header when previous month button is clicked", async () => {
    const previousMonthObj = addMonths(new Date(), -1);
    const previousMonth = format(previousMonthObj, "MMMM yyyy");

    await clickFirstInput();
    await userEvent.click(screen.getByTestId("prev-month-button"));

    expect(screen.getByText(previousMonth)).toBeInTheDocument();
  });

  it("changes to the previous month in the calendar when previous button is clicked", async () => {
    await clickFirstInput();
    await userEvent.click(screen.getByTestId("prev-month-button"));

    const prevMonth = subMonths(new Date(), 1);
    const expectedEmptyCells = getEmptyCellsFor(prevMonth);

    expect(screen.getAllByTestId("empty-cell").length).toBe(expectedEmptyCells);
  });

  it("changes to the next month in the calendar when next button is clicked", async () => {
    await clickFirstInput();
    await userEvent.click(screen.getByTestId("prev-month-button"));

    const nextMonth = subMonths(new Date(), 1);
    const expectedEmptyCells = getEmptyCellsFor(nextMonth);

    expect(screen.getAllByTestId("empty-cell").length).toBe(expectedEmptyCells);
  });

  it("displays a list with 23 hours when AMPM is disabled", async () => {
    renderDateTimeRange({ useAMPM: false });
    await clickFirstInput();

    expect(screen.getAllByTestId("hour-option").length).toBe(23);
  });

  it("displays a list with 12 hours when AMPM is enabled", async () => {
    await clickFirstInput();

    expect(screen.getAllByTestId("hour-option").length).toBe(12);
  });

  it("displays a list with 60 minutes", async () => {
    await clickFirstInput();

    expect(screen.getAllByTestId("minute-option").length).toBe(60);
  });

  it("doesn't display AM/PM section in time picker when AMPM is disabled", async () => {
    renderDateTimeRange({ useAMPM: false });
    await clickFirstInput();

    expect(screen.queryByTestId("period-option")).toBeNull();
  });

  it("displays AM/PM section in time picker when AMPM is enabled", async () => {
    await clickFirstInput();

    expect(screen.getAllByTestId("period-option")).toHaveLength(2);
  });

  it("closes the date time picker when ok button is clicked and nothing is selected", async () => {
    await clickFirstInput();

    expect(screen.getByTestId("date-time-picker")).toBeInTheDocument();
    await userEvent.click(screen.getByText(/ok/i));

    await waitFor(() =>
      expect(screen.queryByTestId("date-time-picker")).toBeNull()
    );
  });

  it("updates input with selected date and default time when a date is chosen from the calendar", async () => {
    await clickFirstInput();
    await selectCell("15");

    const expectedInputValue = getInputValue(15);

    expect(screen.getByDisplayValue(expectedInputValue)).toBeInTheDocument();
  });

  it(`updates input with today's date and selected time when a time is chosen 
  from the time picker`, async () => {
    await clickFirstInput();
    await selectHour(7);

    const expectedInputValue = getInputValue(new Date().getDate(), 7);

    screen.debug(screen.getByTestId("first-date-time-container"));
    expect(screen.getByDisplayValue(expectedInputValue)).toBeInTheDocument();
  });

  it(`highlights selected date in the calendar when a time is chosen from the
  time picker`, async () => {
    await clickFirstInput();
    await selectHour(7);

    expectOnlyCellIsSelected(getCell(new Date().getDate()));
  });

  it("highlights selected date in the calendar", async () => {
    await clickFirstInput();
    expect(screen.queryByTestId("selected-cell")).toBeNull();

    const selectedCell = await selectCell("15");

    expectOnlyCellIsSelected(selectedCell);
  });

  it(`displays appropriate dashed border dates when first date is selected 
  and second input is active`, async () => {
    await clickFirstInput();
    await selectCell("15");

    expect(screen.queryAllByTestId("dashed-border")).toHaveLength(0);

    await clickSecondInput();
    await hoverCell("18");

    expectDashedBorderAroundDates(["16", "17", "18"]);
  });

  it(`displays appropriate dashed border dates when second date is selected 
  and first input is active`, async () => {
    await clickSecondInput();
    await selectCell("15");

    expect(screen.queryAllByTestId("dashed-border")).toHaveLength(0);

    await clickFirstInput();
    await hoverCell("12");

    expectDashedBorderAroundDates(["12", "13", "14"]);
  });

  it(`displays appropriate dashed border dates when both dates are selected 
  and second input is active`, async () => {
    await clickFirstInput();
    await selectCell("15");

    await clickSecondInput();
    await selectCell("17");

    await hoverCell("20");

    expectDashedBorderAroundDates(["18", "19", "20"]);
  });

  it(`displays appropriate dashed border dates when both dates are selected 
  and first input is active`, async () => {
    await clickFirstInput();
    await selectCell("15");

    await clickSecondInput();
    await selectCell("17");

    await clickFirstInput();
    await hoverCell("12");

    expectDashedBorderAroundDates(["12", "13", "14"]);
  });

  it(`removes the date from the second input and keeps the time when 
  user selects the first date that is greater than the second date`, async () => {
    await clickFirstInput();
    await selectCell("15");

    await clickSecondInput();
    await selectCell("17");
    await selectHour(7);

    await clickFirstInput();
    await selectCell("20");

    within(screen.getByTestId("second-date-time-container")).getByDisplayValue(
      DATE_PLACEHOLDER + " " + "07:00 AM"
    );
  });

  it(`removes the second date highlight when user selects the first date 
  that is greater than the second date`, async () => {
    await clickFirstInput();
    await selectCell("15");

    await clickSecondInput();
    await selectCell("17");

    await clickFirstInput();
    const selectedCell = await selectCell("20");

    expectOnlyCellIsSelected(selectedCell);
  });

  it(`removes the date from the second input and keeps the time when user 
  selects the second date that is lesser than the first date`, async () => {
    await clickFirstInput();
    await selectCell("15");

    await clickSecondInput();
    await selectCell("17");
    await selectHour(7);

    await clickSecondInput();
    await selectCell("10");

    within(screen.getByTestId("second-date-time-container")).getByDisplayValue(
      DATE_PLACEHOLDER + " " + "07:00 AM"
    );
  });

  it(`removes the second date highlight when user selects the second date that 
  is lesser than the first date`, async () => {
    await clickFirstInput();
    await selectCell("15");

    await clickSecondInput();
    await selectCell("17");

    await clickSecondInput();
    const selectedCell = await selectCell("10");

    expectOnlyCellIsSelected(selectedCell);
  });

  it(`displays highlight for dates between selected dates`, async () => {
    await clickFirstInput();
    await selectCell("15");

    await clickSecondInput();
    await selectCell("19");

    expectDatesHighlighted(["15", "16", "17", "18", "19"]);
  });

  it("highlight first and second date when user selects both", async () => {
    await clickFirstInput();
    await selectCell("15");

    await clickSecondInput();
    await selectCell("19");

    expectSelected(15, 19);
  });

  it("disables the date if it's lesser than the min date", async () => {
    const minDate = renderWithMinDate(15);
    await clickFirstInput();

    for (let i = 1; i < minDate.getDate(); i++) {
      expect(getCell(i)).toHaveClass("disabled-cell");
    }
  });

  it("disables the left arrow button if the min date is in the current month", async () => {
    renderWithMinDate(15);
    await clickFirstInput();

    expect(screen.getByTestId("prev-month-button")).toBeDisabled();
  });

  it("doesn't select date that is lesser that the min date", async () => {
    renderWithMinDate(15);
    await clickFirstInput();

    const cell = getCell(14);
    await userEvent.click(cell);
    expect(cell).not.toHaveClass("selected-cell");

    const firstContainer = screen.getByTestId("first-date-time-container");
    expect(
      within(firstContainer).getByDisplayValue(getDateTimePlaceholder(true))
    ).toBeDefined();
  });

  it(`doesn't visually indicate that date that is lesser that the min date 
  is hovered`, async () => {
    renderWithMinDate(15);
    await clickFirstInput();

    const cell = getCell(14);
    await userEvent.hover(getCell(14));
    expect(cell).not.toHaveClass("hovered-cell");
  });

  it(`doesn't show dashed border when date that is lesser than the min date 
  is hovered`, async () => {
    renderWithMinDate(15);
    await clickSecondInput();
    await selectCell("16");

    await clickFirstInput();
    await userEvent.hover(getCell(13));
    expect(screen.queryAllByTestId("dashed-border")).toHaveLength(0);
  });
});
