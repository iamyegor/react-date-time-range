import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    differenceInCalendarDays,
    endOfMonth,
    endOfWeek,
    startOfMonth,
    startOfWeek,
} from "date-fns";
import { Provider } from "react-redux";
import dateTimeRangeSlice from "../features/dateTimeRangeSlice";
import convertTo2DigitString from "../utils";
import DateTimeRange from "../DateTimeRange/DateTimeRange";

export function expectHourToBeDisabled(hour: number) {
    const hourOptions = screen.getAllByTestId("hour-option");
    const foundHour = hourOptions.find((option) => {
        return option.textContent === convertTo2DigitString(hour);
    });

    expect(foundHour).toHaveClass("disabled-item");
    expect(foundHour).toBeDisabled();
}

export function expectHoursToBeEnabledUpTo(hours: number) {
    expectHoursToBeEnabledInRange(1, hours);
}

export function expectHoursToBeEnabledInRange(from: number, to: number) {
    const hourOptions = screen.getAllByTestId("hour-option");
    expectOptionsToBeEnabledInRange(from, to, hourOptions);
}

export function expectOptionsToBeEnabledInRange(from: number, to: number, options: HTMLElement[]) {
    getOptionsInRange(from, to, options).forEach((option) => {
        expect(option).not.toHaveClass("disabled-item");
        expect(option).not.toBeDisabled();
    });
}

export function getOptionsInRange(from: number, to: number, options: HTMLElement[]) {
    return options.filter((option) => {
        if (option.textContent) {
            const textContentInt = parseInt(option.textContent);
            return textContentInt >= from && textContentInt <= to;
        }
    });
}

export async function clickAMPMOption(option: "AM" | "PM") {
    const periodOptions = screen.getAllByTestId("period-option");
    const AMPMOption = periodOptions.find((o) => o.textContent === option) as HTMLElement;
    await userEvent.click(AMPMOption);
}

export function expectFirstInputToBeInvalid() {
    const firstInputWrapper = screen.getAllByTestId("date-time-input-wrapper")[0];
    expect(firstInputWrapper).toHaveClass("invalid-input");
}

export function expectMinutesToBeDisabledUpTo(minutes: number) {
    expectMinutesToBeDisabledInRange(0, minutes);
}

export function expectMinutesToBeDisabledInRange(from: number, to: number) {
    const minuteOptions = screen.getAllByTestId("minute-option");
    expectOptionsToBeDisabledInRange(from, to, minuteOptions);
}

export function expectHoursToBeDisabledUpTo(hours: number) {
    expectHoursToBeDisabledInRange(1, hours);
}

export function expectHoursToBeDisabledInRange(from: number, to: number) {
    const hourOptions = screen.getAllByTestId("hour-option");
    expectOptionsToBeDisabledInRange(from, to, hourOptions);
}

export function expectOptionsToBeDisabledInRange(from: number, to: number, options: HTMLElement[]) {
    getOptionsInRange(from, to, options).forEach((option) => {
        expect(option).toHaveClass("disabled-item");
        expect(option).toBeDisabled();
    });
}

export function expectMinutesToBeEnabled(minutes: number) {
    const minuteOptions = screen.getAllByTestId("minute-option");
    getOptionsInRange(0, minutes, minuteOptions).forEach((option) => {
        expect(option).not.toHaveClass("disabled-item");
        expect(option).not.toBeDisabled();
    });
}

export function expectDashedBorderToBeHidden() {
    expect(screen.queryAllByTestId("dashed-border")).toHaveLength(0);
}

export function expectSecondInputToHaveValue(value: string) {
    expect(getSecondInput()).toHaveValue(value);
}

function getSecondInput() {
    const secondContainer = screen.getByTestId("second-date-time-container");
    return within(secondContainer).getByTestId("date-time-input");
}

export function expectFirstInputToHaveValue(value: string) {
    expect(getFirstInput()).toHaveValue(value);
}

function getFirstInput() {
    const firstContainer = screen.getByTestId("first-date-time-container");
    return within(firstContainer).getByTestId("date-time-input");
}

export function renderWithMinDate(day: number) {
    const minDate = changeDayInCurrentMonth(day);
    renderDateTimeRange({ minDate: minDate, useAMPM: true });
    return minDate;
}

export function renderWithMaxDate(day: number) {
    const maxDate = changeDayInCurrentMonth(day);
    renderDateTimeRange({ maxDate: maxDate, useAMPM: true });
    return maxDate;
}

export function renderDateTimeRange({
    useAMPM = false,
    minDate,
    maxDate,
    minTime,
    maxTime,
}: {
    useAMPM?: boolean;
    minDate?: Date;
    maxDate?: Date;
    minTime?: Date;
    maxTime?: Date;
} = {}) {
    cleanup();
    const store = configureStore({
        reducer: dateTimeRangeSlice,
    });
    return render(
        <Provider store={store}>
            <DateTimeRange
                inputText={{ start: "Start Date", end: "End Date" }}
                useAMPM={useAMPM}
                minDate={minDate}
                maxDate={maxDate}
                minTime={minTime}
                maxTime={maxTime}
            />
        </Provider>,
    );
}

export function changeDayInCurrentMonth(day: number) {
    const currentMonth = new Date();
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return newDate;
}

export function expectCellsToBeSelected(first: number, second: number) {
    const cells = screen.getByTestId("cells");
    const firstSelectedCell = within(cells).getByText(first.toString());
    const secondSelectedCell = within(cells).getByText(second.toString());

    expect(firstSelectedCell).toEqual(screen.getAllByTestId("selected-cell")[0]);
    expect(secondSelectedCell).toEqual(screen.getAllByTestId("selected-cell")[1]);
}

export function getCell(day: number) {
    const cells = screen.getByTestId("cells");
    return within(cells).getByText(day.toString());
}

export function getEmptyCellsFor(month: Date): number {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return (
        differenceInCalendarDays(monthStart, startDate) +
        differenceInCalendarDays(endDate, monthEnd)
    );
}

export async function clickCell(cell: string) {
    const cells = screen.getByTestId("cells");
    const selectedDate = within(cells).getByText(cell);
    await userEvent.click(selectedDate);
    return selectedDate;
}

export async function clickFirstInput() {
    return await userEvent.click(screen.getByText("Start Date"));
}

export async function clickSecondInput() {
    return await userEvent.click(screen.getByText("End Date"));
}

export function expectDashedBorderAroundDates(datesToCheck: string[]) {
    const cells = screen.getByTestId("cells");

    datesToCheck.forEach((date, i) => {
        const dashedBorder = screen.getAllByTestId("dashed-border")[i];
        const selectedCell = within(cells).getByText(date);

        expect(dashedBorder.parentElement).toEqual(selectedCell.parentElement);
    });
}

export async function hoverCell(cell: string) {
    const cells = screen.getByTestId("cells");
    const hoveredCell = within(cells).getByText(cell);
    await userEvent.hover(hoveredCell);
}

export async function clickHour(hour: number) {
    const hourOption = getHourOption(hour);
    if (hourOption) {
        await userEvent.click(hourOption);
    }
}

export function expectOnlyCellIsSelected(cell: HTMLElement) {
    expect(screen.getByTestId("selected-cell")).toEqual(cell);
}

export function getInputValue(day: number, hour: number = 12) {
    const date = new Date();

    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hourWithPads = hour.toString().padStart(2, "0");
    return `${month}/${day}/${year} ${hourWithPads}:00 AM`;
}

export function expectDatesHighlighted(dates: string[]) {
    const cells = screen.getByTestId("cells");
    dates.forEach((date, i) => {
        const highlight = screen.getAllByTestId("highlight-between-dates")[i];
        const selectedCell = within(cells).getByText(date);

        expect(highlight.parentElement).toEqual(selectedCell.parentElement);
    });
}

export function expectHourToBeEnabled(hour: number) {
    const hourOption = getHourOption(hour);
    expect(hourOption).not.toHaveClass("disabled-item");
    expect(hourOption).not.toBeDisabled();
}

function getHourOption(hour: number) {
    const hourOptions = screen.getAllByTestId("hour-option");
    return hourOptions.find((option) => {
        return option.textContent === convertTo2DigitString(hour);
    });
}

export async function clickMinute(minute: number) {
    const minuteOption = getMinuteOption(minute);
    if (minuteOption) {
        await userEvent.click(minuteOption);
    }
}

function getMinuteOption(minute: number) {
    const minuteOptions = screen.getAllByTestId("minute-option");
    return minuteOptions.find((option) => {
        return option.textContent === convertTo2DigitString(minute);
    });
}

export function expectSecondInputToBeInvalid() {
    const secondInputWrapper = screen.getAllByTestId("date-time-input-wrapper")[1];
    expect(secondInputWrapper).toHaveClass("invalid-input");
}
