import { configureStore } from "@reduxjs/toolkit";
import {
  cleanup,
  fireEvent,
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
import { Provider } from "react-redux";
import dateTimeRangeSlice from "../../features/dateTimeRangeSlice";
import { DATE_PLACEHOLDER, getDateTimePlaceholder } from "../../globals";
import convertTo2DigitString from "../../utils";
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
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: dateTimeRangeSlice,
    });
    renderDateTimeRange({ useAMPM: true });
  });

  afterEach(() => {
    store.dispatch({ type: "RESET" });
  });

  function renderDateTimeRange({
    useAMPM = false,
    minDate,
    maxDate,
    minTime,
  }: {
    useAMPM?: boolean;
    minDate?: Date;
    maxDate?: Date;
    minTime?: Date;
  } = {}) {
    cleanup();
    return render(
      <Provider store={store}>
        <DateTimeRange
          inputText={{ start: "Start Date", end: "End Date" }}
          useAMPM={useAMPM}
          minDate={minDate}
          maxDate={maxDate}
          minTime={minTime}
        />
      </Provider>
    );
  }

  async function clickHour(hour: number) {
    const hourOptions = screen.getAllByTestId("hour-option");

    const hourElement = hourOptions.filter((option) => {
      return option.textContent === convertTo2DigitString(hour);
    })[0];

    await userEvent.click(hourElement);
  }

  async function clickAMPMOption(option: string) {
    const periodOptions = screen.getAllByTestId("period-option");
    const AMPMOption = periodOptions.find(
      (o) => o.textContent === option
    ) as HTMLElement;
    await userEvent.click(AMPMOption);
  }

  function expectFirstInputToBeInvalid() {
    const firstInput = screen.getAllByTestId("date-time-input")[0];
    expect(firstInput).toHaveClass("invalid-input");
  }

  function expectMinutesToBeDisabled(minutes: number) {
    const minuteOptions = screen.getAllByTestId("minute-option");
    for (let i = 0; i < minutes; i++) {
      expect(minuteOptions[i]).toHaveClass("disabled-item");
      expect(minuteOptions[i]).toBeDisabled();
    }
  }

  function expectHoursToBeDisabled(hours: number) {
    const hourOptions = screen.getAllByTestId("hour-option");
    for (let i = 0; i < hours; i++) {
      expect(hourOptions[i]).toHaveClass("disabled-item");
      expect(hourOptions[i]).toBeDisabled();
    }
  }

  function expectMinutesToBeEnabled(minutes: number) {
    const minutesOptions = screen.getAllByTestId("minute-option");
    for (let i = 0; i < minutes; i++) {
      expect(minutesOptions[i]).not.toHaveClass("disabled-item");
      expect(minutesOptions[i]).not.toBeDisabled();
    }
  }

  function expectDashedBorderToBeHidden() {
    expect(screen.queryAllByTestId("dashed-border")).toHaveLength(0);
  }

  function expectSecondInputToHaveValue(value: string) {
    const secondContainer = screen.getByTestId("second-date-time-container");
    expect(within(secondContainer).getByDisplayValue(value)).toBeDefined();
  }

  function expectFirstInputToHaveValue(value: string) {
    const firstContainer = screen.getByTestId("first-date-time-container");
    expect(within(firstContainer).getByDisplayValue(value)).toBeDefined();
  }

  function renderWithMinDate(day: number) {
    const minDate = changeDayInCurrentMonth(day);
    renderDateTimeRange({ minDate: minDate, useAMPM: true });
    return minDate;
  }

  function renderWithMaxDate(day: number) {
    const maxDate = changeDayInCurrentMonth(day);
    renderDateTimeRange({ maxDate: maxDate, useAMPM: true });
    return maxDate;
  }

  function changeDayInCurrentMonth(day: number) {
    const currentMonth = new Date();
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return newDate;
  }

  function expectCellsToBeSelected(first: number, second: number) {
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

  async function clickCell(cell: string) {
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
      return option.textContent === convertTo2DigitString(hour);
    })[0];

    await userEvent.click(hourElement);
  }

  async function selectMinute(minute: number) {
    const minuteOptions = screen.getAllByTestId("minute-option");

    const minuteElement = minuteOptions.filter((option) => {
      return option.textContent === convertTo2DigitString(minute);
    })[0];

    await userEvent.click(minuteElement);
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
    await clickCell("15");

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

    const selectedCell = await clickCell("15");

    expectOnlyCellIsSelected(selectedCell);
  });

  it(`displays appropriate dashed border dates when first date is selected 
  and second input is active`, async () => {
    await clickFirstInput();
    await clickCell("15");

    expectDashedBorderToBeHidden();

    await clickSecondInput();
    await hoverCell("18");

    expectDashedBorderAroundDates(["16", "17", "18"]);
  });

  it(`displays appropriate dashed border dates when second date is selected 
  and first input is active`, async () => {
    await clickSecondInput();
    await clickCell("15");

    expectDashedBorderToBeHidden();

    await clickFirstInput();
    await hoverCell("12");

    expectDashedBorderAroundDates(["12", "13", "14"]);
  });

  it(`displays appropriate dashed border dates when both dates are selected 
  and second input is active`, async () => {
    await clickFirstInput();
    await clickCell("15");

    await clickSecondInput();
    await clickCell("17");

    await hoverCell("20");

    expectDashedBorderAroundDates(["18", "19", "20"]);
  });

  it(`displays appropriate dashed border dates when both dates are selected 
  and first input is active`, async () => {
    await clickFirstInput();
    await clickCell("15");

    await clickSecondInput();
    await clickCell("17");

    await clickFirstInput();
    await hoverCell("12");

    expectDashedBorderAroundDates(["12", "13", "14"]);
  });

  it(`removes the date from the second input and keeps the time when 
  user selects the first date that is greater than the second date`, async () => {
    await clickFirstInput();
    await clickCell("15");

    await clickSecondInput();
    await clickCell("17");
    await selectHour(7);

    await clickFirstInput();
    await clickCell("20");

    expectSecondInputToHaveValue(DATE_PLACEHOLDER + " 07:00 AM");
  });

  it(`removes the second date highlight when user selects the first date 
  that is greater than the second date`, async () => {
    await clickFirstInput();
    await clickCell("15");

    await clickSecondInput();
    await clickCell("17");

    await clickFirstInput();
    const selectedCell = await clickCell("20");

    expectOnlyCellIsSelected(selectedCell);
  });

  it(`removes the date from the second input and keeps the time when user 
  selects the second date that is lesser than the first date`, async () => {
    await clickFirstInput();
    await clickCell("15");

    await clickSecondInput();
    await clickCell("17");
    await selectHour(7);

    await clickSecondInput();
    await clickCell("10");

    expectSecondInputToHaveValue(DATE_PLACEHOLDER + " 07:00 AM");
  });

  it(`removes the second date highlight when user selects the second date that 
  is lesser than the first date`, async () => {
    await clickFirstInput();
    await clickCell("15");

    await clickSecondInput();
    await clickCell("17");

    await clickSecondInput();
    const selectedCell = await clickCell("10");

    expectOnlyCellIsSelected(selectedCell);
  });

  it(`displays highlight for dates between selected dates`, async () => {
    await clickFirstInput();
    await clickCell("15");

    await clickSecondInput();
    await clickCell("19");

    expectDatesHighlighted(["15", "16", "17", "18", "19"]);
  });

  it("highlight first and second date when user selects both", async () => {
    await clickFirstInput();
    await clickCell("15");

    await clickSecondInput();
    await clickCell("19");

    expectCellsToBeSelected(15, 19);
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

  it(`doesn't select date that is less that the min date when first input
  is active`, async () => {
    renderWithMinDate(15);
    await clickFirstInput();

    await userEvent.click(getCell(14));

    expect(getCell(14)).not.toHaveClass("selected-cell");
    expectFirstInputToHaveValue(getDateTimePlaceholder(true));
  });

  it(`doesn't select date that is less that the min date when second input
  is active`, async () => {
    renderWithMinDate(15);
    await clickFirstInput();
    await clickSecondInput();

    await clickCell("14");

    expect(getCell(14)).not.toHaveClass("selected-cell");
    expectSecondInputToHaveValue(getDateTimePlaceholder(true));
  });

  it(`doesn't show dashed border when date that is lesser than the min date 
  is hovered`, async () => {
    renderWithMinDate(15);
    await clickSecondInput();
    await clickCell("16");

    await clickFirstInput();
    await userEvent.hover(getCell(13));
    expectDashedBorderToBeHidden();
  });

  it(`doesn't allow drag and drop on dates that are lesser than the min date
  when the first input is active`, async () => {
    renderWithMinDate(15);
    await clickFirstInput();
    await clickCell("16");

    const selectedCell = getCell(16);
    fireEvent.mouseDown(selectedCell);

    const disabledCell = getCell(14);
    fireEvent.mouseEnter(disabledCell);

    expect(disabledCell).not.toHaveClass("selected-cell");
    expect(selectedCell).toHaveClass("selected-cell");
    expectFirstInputToHaveValue(getInputValue(16));
  });

  it(`doesn't allow drag and drop on dates that are lesser than the min date 
  when the second input is active`, async () => {
    renderWithMinDate(15);
    await clickSecondInput();
    await clickCell("16");

    fireEvent.mouseDown(getCell(16));
    fireEvent.mouseEnter(getCell(14));

    expect(getCell(14)).not.toHaveClass("selected-cell");
    expect(getCell(16)).toHaveClass("selected-cell");
    expectSecondInputToHaveValue(getInputValue(16));
  });

  it(`doesn't select date that is greater than the max date when the first input
  is active`, async () => {
    renderWithMaxDate(15);
    await clickFirstInput();

    await userEvent.click(getCell(16));

    expect(getCell(16)).not.toHaveClass("selected-cell");
    expectFirstInputToHaveValue(getDateTimePlaceholder(true));
  });

  it(`doesn't select date that is greater than the max date when the second input
  is active`, async () => {
    renderWithMaxDate(15);
    await clickSecondInput();

    await userEvent.click(getCell(16));

    expect(getCell(16)).not.toHaveClass("selected-cell");
    expectSecondInputToHaveValue(getDateTimePlaceholder(true));
  });

  it(`doesn't show dashed border when date that is greater than the max date
  is hovered`, async () => {
    renderWithMaxDate(15);
    await clickFirstInput();
    await clickCell("14");

    await clickSecondInput();
    await userEvent.hover(getCell(16));
    expectDashedBorderToBeHidden();
  });

  it(`doesn't allow drag and drop on dates that are greater than the max date
  when the first input is active`, async () => {
    renderWithMaxDate(15);
    await clickFirstInput();
    await clickCell("15");

    fireEvent.mouseDown(getCell(15));
    fireEvent.mouseEnter(getCell(16));

    expect(getCell(16)).not.toHaveClass("selected-cell");
    expect(getCell(15)).toHaveClass("selected-cell");
    expectFirstInputToHaveValue(getInputValue(15));
  });

  it(`doesn't allow drag and drop on dates that are greater than the max date
  when the second input is active`, async () => {
    renderWithMaxDate(15);
    await clickSecondInput();
    await clickCell("15");

    fireEvent.mouseDown(getCell(15));
    fireEvent.mouseEnter(getCell(16));

    expect(getCell(16)).not.toHaveClass("selected-cell");
    expect(getCell(15)).toHaveClass("selected-cell");
    expectSecondInputToHaveValue(getInputValue(15));
  });

  it(`disables the date if it's greater than the max date`, async () => {
    const maxDate = renderWithMaxDate(15);
    await clickFirstInput();

    for (let i = maxDate.getDate() + 1; i <= 31; i++) {
      expect(getCell(i)).toHaveClass("disabled-cell");
    }
  });

  it(`disables the right arrow button if the max date is in the current month`, async () => {
    renderWithMaxDate(15);
    await clickFirstInput();

    expect(screen.getByTestId("next-month-button")).toBeDisabled();
  });

  it(`disables the time if it's less than the minTime for 24 hours system`, async () => {
    const minutes = 23;
    const hours = 7;
    renderDateTimeRange({
      useAMPM: false,
      minTime: new Date(0, 0, 0, hours, minutes),
    });
    await clickFirstInput();

    expectHoursToBeDisabled(hours - 1);
    expectMinutesToBeEnabled(minutes);

    await selectHour(hours);

    expectMinutesToBeDisabled(minutes);
  });

  it(`enables the minutes if the current hour is greater than the min time hour
  for 24 hours system`, async () => {
    const minutes = 23;
    const hours = 7;
    renderDateTimeRange({
      useAMPM: false,
      minTime: new Date(0, 0, 0, hours, minutes),
    });
    await clickFirstInput();
    await selectHour(hours);
    await selectHour(hours + 1);

    expectMinutesToBeEnabled(minutes);
  });

  it(`disables selected minute if it's less than the min time minute for
  24 hours system`, async () => {
    const minutes = 23;
    const hours = 7;
    renderDateTimeRange({
      useAMPM: false,
      minTime: new Date(0, 0, 0, hours, minutes),
    });
    await clickFirstInput();
    await selectMinute(minutes - 1);
    await selectHour(hours);

    const minutesOptions = screen.getAllByTestId("minute-option");
    const selectedMinute = minutesOptions.find((option) => {
      return option.textContent === convertTo2DigitString(minutes - 1);
    });

    expect(selectedMinute).toHaveClass("disabled-selected-item");
    expect(selectedMinute).not.toHaveClass("selected-item");
  });

  it(`invalidates the input when the time is less than the min time 
  for 24 hours system`, async () => {
    const minutes = 23;
    const hours = 7;
    renderDateTimeRange({
      useAMPM: false,
      minTime: new Date(0, 0, 0, hours, minutes),
    });
    await clickFirstInput();
    await selectMinute(minutes - 1);
    await selectHour(hours);

    expectFirstInputToBeInvalid();
  });

  it(`disables the time if it's less than the minTime for AM/PM system when
  minTime hour is AM and user has no (AM/PM) selected`, async () => {
    const minutes = 23;
    const hours = 7;
    renderDateTimeRange({
      useAMPM: true,
      minTime: new Date(0, 0, 0, hours, minutes),
    });
    await clickFirstInput();
    // we don't do hours - 1 because there is 12 at the beginning of the list
    expectHoursToBeDisabled(hours);
  });

  it(`disables the time if it's less than the min time for AM/PM system when
  minTime hour is PM and user has no (AM/PM) selected`, async () => {
    const minutes = 23;
    const hours = 19;
    renderDateTimeRange({
      useAMPM: true,
      minTime: new Date(0, 0, 0, hours, minutes),
    });
    await clickFirstInput();

    expectHoursToBeDisabled(12);
  });

  it(`disables the time if it's less than the min time for AM/PM system when
  minTime hour is PM and user has AM selected`, async () => {
    const minutes = 23;
    const hours = 19;
    renderDateTimeRange({
      useAMPM: true,
      minTime: new Date(0, 0, 0, hours, minutes),
    });
    await clickFirstInput();
    await clickAMPMOption("AM");

    expectHoursToBeDisabled(12);
  });

  it(`disables the time if it's less than the min time for AM/PM system when
  minTime hour is AM and user has AM selected`, async () => {
    const minutes = 23;
    const hours = 7;
    renderDateTimeRange({
      useAMPM: true,
      minTime: new Date(0, 0, 0, hours, minutes),
    });
    await clickFirstInput();
    await clickAMPMOption("AM");

    expectHoursToBeDisabled(hours);
  });

  it(`disables the time if it's less than the min time for AM/PM system when
  minTime hour is PM and user has PM selected`, async () => {
    const minutes = 23;
    const hours = 19;
    renderDateTimeRange({
      useAMPM: true,
      minTime: new Date(0, 0, 0, hours, minutes),
    });
    await clickFirstInput();
    await clickAMPMOption("PM");

    expectHoursToBeDisabled(hours - 12);
  });

  it(`disables all minutes if the minTime hour is PM and user has no (AM/PM) 
  selected`, async () => {
    const minutes = 23;
    const hours = 12;
    renderDateTimeRange({
      useAMPM: true,
      minTime: new Date(0, 0, 0, hours, minutes),
    });
    await clickFirstInput();

    expectMinutesToBeDisabled(60);
  });

  it(`disables minutes if the current hour is equal to the minTime hour for
  AM/PM system when minTime hour is AM`, async () => {
    const minutes = 23;
    const hours = 7;
    renderDateTimeRange({
      useAMPM: true,
      minTime: new Date(0, 0, 0, hours, minutes),
    });
    await clickFirstInput();
    await clickHour(hours);

    expectMinutesToBeDisabled(minutes);
  });

  it(`disables minutes if the current hour is equal to the minTime hour for AM/PM
  system and minTime hour is 12 PM`, async () => {
    const minutes = 23;
    const hours = 12;
    renderDateTimeRange({
      useAMPM: true,
      minTime: new Date(0, 0, 0, hours, minutes),
    });
    await clickFirstInput();

    await clickAMPMOption("PM");
    await clickHour(hours);

    expectMinutesToBeDisabled(minutes);
  });
});
