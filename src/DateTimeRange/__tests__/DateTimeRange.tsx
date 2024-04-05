import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { addMonths, format, subMonths } from "date-fns";
import { ReactNode } from "react";
import { DATE_PLACEHOLDER, getDateTimePlaceholder } from "../../globals";
import convertTo2DigitString from "../../utils";
import {
    clickAMPMOption,
    clickCell,
    clickFirstInput,
    clickHour,
    clickMinute,
    clickSecondInput,
    expectCellsToBeSelected,
    expectDashedBorderAroundDates,
    expectDashedBorderToBeHidden,
    expectDatesHighlighted,
    expectFirstInputToBeInvalid,
    expectFirstInputToHaveValue,
    expectHourToBeDisabled,
    expectHourToBeEnabled,
    expectHoursToBeDisabledInRange,
    expectHoursToBeDisabledUpTo,
    expectHoursToBeEnabledUpTo,
    expectMinutesToBeDisabledInRange,
    expectMinutesToBeDisabledUpTo,
    expectMinutesToBeEnabled,
    expectOnlyCellIsSelected,
    expectSecondInputToBeInvalid,
    expectSecondInputToHaveValue,
    getCell,
    getEmptyCellsFor,
    getInputValue,
    hoverCell,
    renderDateTimeRange,
    renderWithMaxDate,
    renderWithMinDate,
} from "../../test/helpers.tsx";

Element.prototype.scrollTo = () => {};
vi.mock("react-transition-group", () => {
    return {
        CSSTransition: ({ children, in: inProp = true }: { children: ReactNode; in: boolean }) => {
            return inProp ? children : null;
        },
        TransitionGroup: ({ children }: { children: ReactNode }) => children,
    };
});

describe("DateTimeRange", () => {
    beforeEach(() => {
        renderDateTimeRange({ useAMPM: true });
    });

    it("displays input text", () => {
        expect(screen.getByText("Start Date")).toBeInTheDocument();
        expect(screen.getByText("End Date")).toBeInTheDocument();
    });

    it("displays date time placeholder with AMPM when first input is focused", async () => {
        expect(screen.queryByDisplayValue(getDateTimePlaceholder(true))).toBeNull();

        await clickFirstInput();
        expect(screen.getByDisplayValue(getDateTimePlaceholder(true))).toBeInTheDocument();
    });

    it("displays date time placeholder with AMPM when second input is focused", async () => {
        expect(screen.queryByDisplayValue(getDateTimePlaceholder(true))).toBeNull();

        await clickSecondInput();
        expect(screen.getByDisplayValue(getDateTimePlaceholder(true))).toBeInTheDocument();
    });

    it("displays date time placeholder without AMPM when AMPM is disabled and first input is focused", async () => {
        renderDateTimeRange({ useAMPM: false });

        expect(screen.queryByDisplayValue(getDateTimePlaceholder(false))).toBeNull();

        await clickFirstInput();
        expect(screen.getByDisplayValue(getDateTimePlaceholder(false))).toBeInTheDocument();
    });

    it("displays date time placeholder without AMPM when AMPM is disabled and second input is focused", async () => {
        renderDateTimeRange({ useAMPM: false });

        expect(screen.queryByDisplayValue(getDateTimePlaceholder(false))).toBeNull();

        await clickSecondInput();
        expect(screen.getByDisplayValue(getDateTimePlaceholder(false))).toBeInTheDocument();
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

        await waitFor(() => expect(screen.queryByTestId("date-time-picker")).toBeNull());
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
        await clickHour(7);

        const expectedInputValue = getInputValue(new Date().getDate(), 7);

        screen.debug(screen.getByTestId("first-date-time-container"));
        expect(screen.getByDisplayValue(expectedInputValue)).toBeInTheDocument();
    });

    it(`highlights selected date in the calendar when a time is chosen from the
  time picker`, async () => {
        await clickFirstInput();
        await clickHour(7);

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
        await clickHour(7);

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
        await clickHour(7);

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

        expectHoursToBeDisabledUpTo(hours - 1);
        expectMinutesToBeEnabled(minutes - 1);

        await clickHour(hours);

        expectMinutesToBeDisabledUpTo(minutes - 1);
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
        await clickHour(hours);
        await clickHour(hours + 1);

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
        await clickMinute(minutes - 1);
        await clickHour(hours);

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
        await clickMinute(minutes - 1);
        await clickHour(hours);

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

        expectHoursToBeDisabledUpTo(hours - 1);
        expectHourToBeDisabled(12);
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

        expectHoursToBeDisabledUpTo(12);
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

        expectHoursToBeDisabledUpTo(12);
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

        expectHoursToBeDisabledUpTo(hours - 1);
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

        expectHoursToBeDisabledUpTo(hours - 12 - 1);
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

        expectMinutesToBeDisabledUpTo(59);
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

        expectMinutesToBeDisabledUpTo(minutes - 1);
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

        expectMinutesToBeDisabledUpTo(minutes - 1);
    });

    it(`disables the time if it's more than the maxTime for AM/PM system when
  maxTime hour is AM`, async () => {
        const minutes = 23;
        const hours = 7;
        renderDateTimeRange({
            useAMPM: true,
            maxTime: new Date(0, 0, 0, hours, minutes),
        });
        await clickFirstInput();
        expectHoursToBeDisabledInRange(hours + 1, 11);

        await clickHour(hours);
        expectMinutesToBeDisabledInRange(minutes + 1, 59);
    });

    it(`disables the time if it's more than the maxTime for AM/PM system when
  maxTime hour is PM`, async () => {
        const minutes = 23;
        const hours = 19;
        renderDateTimeRange({
            useAMPM: true,
            maxTime: new Date(0, 0, 0, hours, minutes),
        });
        await clickFirstInput();
        expectHourToBeEnabled(12);
        expectHoursToBeEnabledUpTo(11);

        await clickAMPMOption("PM");
        expectHoursToBeDisabledInRange(8, 11);

        await clickHour(7);
        expectMinutesToBeDisabledInRange(24, 59);
    });

    it(`disables the time when both minTime and maxTime are set for AM/PM`, async () => {
        renderDateTimeRange({
            useAMPM: true,
            minTime: new Date(0, 0, 0, 7, 23),
            maxTime: new Date(0, 0, 0, 19, 23),
        });
        await clickFirstInput();
        expectHoursToBeDisabledInRange(1, 6);

        await clickHour(7);
        expectMinutesToBeDisabledInRange(0, 22);

        await clickAMPMOption("PM");
        expectHoursToBeDisabledInRange(8, 11);

        await clickHour(7);
        expectMinutesToBeDisabledInRange(24, 59);
    });

    it(`disables the time when both minTime and maxTime are set for 24 hours`, async () => {
        renderDateTimeRange({
            useAMPM: false,
            minTime: new Date(0, 0, 0, 7, 23),
            maxTime: new Date(0, 0, 0, 19, 23),
        });
        await clickFirstInput();
        expectHoursToBeDisabledInRange(0, 6);

        await clickHour(7);
        expectMinutesToBeDisabledInRange(0, 22);

        await clickHour(19);
        expectMinutesToBeDisabledInRange(24, 59);
    });

    it(`invalidates input when the time is greater than the max time`, async () => {
        renderDateTimeRange({
            useAMPM: false,
            maxTime: new Date(0, 0, 0, 7, 23),
        });
        await clickFirstInput();
        await clickMinute(24);

        expectFirstInputToBeInvalid();
    });
});
