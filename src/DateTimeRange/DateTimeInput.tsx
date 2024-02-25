import { isValid } from "date-fns";
import { KeyboardEvent, useEffect, useMemo, useRef } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUseAMPM } from "../features/dateTimeRangeSlice";
import {
    DATE_PLACEHOLDER,
    getDateTimePlaceholder,
    sections,
    TIME_PLACEHOLDER_24,
    TIME_PLACEHOLDER_AMPM,
} from "../globals";
import { Section, Time } from "../types";
import SectionNavigation from "./utility-classes/SectionNavigation.tsx";
import SectionValueAdjusterWithArrows from "./utility-classes/SectionValueAdjusterWithArrows.tsx";
import SectionValueAdjusterWithNumbers from "./utility-classes/SectionValueAdjusterWithNumbers.tsx";
import AmPmSwitcher from "./utility-classes/AmPmSwitcher.tsx";
import SectionEraser from "./utility-classes/SectionEraser.tsx";

interface DateTimeInputProps {
    date: Date | null;
    onDateChange: (date: Date | null) => void;
    time: Time | null;
    onTimeChange: (time: Time | null) => void;
    value: string;
    onValueChange: (value: string) => void;
    isDateInvalid: boolean;
    onIsDateInvalidChange: (isInvalid: boolean) => void;
    isTimeInvalid: boolean;
    onIsTimeInvalidChange: (isInvalid: boolean) => void;
}

function DateTimeInput({
    isTimeInvalid,
    onIsTimeInvalidChange,
    isDateInvalid,
    onIsDateInvalidChange,
    date,
    time,
    onDateChange,
    onTimeChange,
    value,
    onValueChange,
}: DateTimeInputProps) {
    const useAMPM = useAppSelector(selectUseAMPM);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const sectionNavigation = useMemo(
        () => new SectionNavigation(inputRef, sections, useAMPM),
        [inputRef, sections, useAMPM],
    );

    const sectionAdjusterWithArrows = useMemo(
        () =>
            new SectionValueAdjusterWithArrows(
                inputRef,
                value,
                onValueChange,
                useAMPM,
            ),
        [inputRef, value, onValueChange, useAMPM],
    );

    const amPmSwitcher = useMemo(
        () => new AmPmSwitcher(inputRef, onValueChange),
        [inputRef, onValueChange],
    );

    const sectionAdjusterWithNumbers = useMemo(
        () =>
            new SectionValueAdjusterWithNumbers(value, inputRef, onValueChange),
        [value, inputRef, onValueChange],
    );

    const sectionEraser = useMemo(
        () => new SectionEraser(inputRef, onValueChange),
        [inputRef, onValueChange],
    );

    useEffect(() => {
        const dateFromValue = queryDateFromValue();
        const timeFromValue = queryTimeFromValue();

        if (date && isValid(dateFromValue)) {
            onDateChange(dateFromValue);
            onIsDateInvalidChange(false);
        } else {
            onDateChange(null);
            onIsDateInvalidChange(!isValuePlaceholder());
        }

        if (timeFromValue) {
            onTimeChange(timeFromValue);
            onIsTimeInvalidChange(false);
        } else {
            onTimeChange(null);
            onIsTimeInvalidChange(!isValuePlaceholder());
        }
    }, [value]);

    function isValuePlaceholder() {
        const section = { start: sections[0].start, end: sections[5].end };
        const value = getSectionValue(section);
        return value === getDateTimePlaceholder(useAMPM);
    }

    function queryDateFromValue() {
        const month = parseInt(getSectionValue(sections[0]));
        const day = parseInt(getSectionValue(sections[1]));
        const year = parseInt(getSectionValue(sections[2]));

        if (year > 1899 && year < 2101) {
            return new Date(year, month - 1, day);
        }

        return null;
    }

    function queryTimeFromValue() {
        const hours = parseInt(getSectionValue(sections[3]));
        const minutes = parseInt(getSectionValue(sections[4]));
        const ampm = useAMPM ? getSectionValue(sections[5]) : "24";

        if (isTimeValid(hours, minutes, ampm)) {
            return { hours, minutes, ampm } as Time;
        }

        return null;
    }

    function getSectionValue({ start, end }: { start: number; end: number }) {
        return value.slice(start, end);
    }

    function isTimeValid(hours: number, minutes: number, ampm: string) {
        if (ampm === "24") {
            return !(
                isNaN(hours) ||
                isNaN(minutes) ||
                hours > 23 ||
                hours < 1 ||
                minutes < 0 ||
                minutes > 59
            );
        } else {
            return !(
                isNaN(hours) ||
                isNaN(minutes) ||
                hours < 1 ||
                hours > 12 ||
                minutes < 0 ||
                minutes > 59 ||
                (ampm !== "AM" && ampm !== "PM")
            );
        }
    }

    useEffect(() => {
        changeDateInValue();
    }, [date]);

    function changeDateInValue() {
        const start = sections[0].start;
        const end = sections[2].end;
        const newDateValue = calculateNewDateValue({ start, end });
        updateValue({ start, end }, newDateValue, getSameHighlight());
    }

    function calculateNewDateValue(section: { start: number; end: number }) {
        if (date) {
            return formatDate(date);
        } else {
            const dateValue = getSectionValue(section);
            if (dateValue && isDateInvalid) {
                return dateValue;
            } else {
                return DATE_PLACEHOLDER;
            }
        }
    }

    function formatDate(date: Date) {
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const year = date.getFullYear().toString().padStart(4, "0");
        return `${month}/${day}/${year}`;
    }

    useEffect(() => {
        updateTimeInValue();
    }, [time]);

    function updateTimeInValue(): void {
        const sectionStart = sections[3].start;
        const sectionEnd = useAMPM ? sections[5].end : sections[4].end;
        const formattedTime = getFormattedTime(sectionStart, sectionEnd);

        updateValueWithTime(sectionStart, sectionEnd, formattedTime);
    }

    function getFormattedTime(start: number, end: number) {
        return useAMPM
            ? getFormattedTimeAMPM(start, end)
            : getFormattedTime24(start, end);
    }

    function getFormattedTime24(start: number, end: number) {
        return time
            ? formatTime24(time)
            : getTimeValueOrDefault(start, end, TIME_PLACEHOLDER_24);
    }

    function getFormattedTimeAMPM(start: number, end: number) {
        return time
            ? formatTimeAM(time)
            : getTimeValueOrDefault(start, end, TIME_PLACEHOLDER_AMPM);
    }

    function getTimeValueOrDefault(
        start: number,
        end: number,
        placeholder: string,
    ) {
        const timeValue = getSectionValue({ start, end });
        return timeValue && isTimeInvalid ? timeValue : placeholder;
    }

    function updateValueWithTime(
        start: number,
        end: number,
        timeValue: string,
    ) {
        const shouldAddSpace = value.slice(start - 1, start) !== " ";
        const spaceOrEmpty = shouldAddSpace ? " " : "";
        const newValue = `${spaceOrEmpty}${timeValue}`;

        updateValue({ start, end }, newValue, getSameHighlight());
    }

    function formatTime24(time: Time) {
        return formatTime(time, "");
    }

    function formatTimeAM(time: Time) {
        return formatTime(time, ` ${time.ampm}`);
    }

    function formatTime(time: Time, suffix: string) {
        const hours = time.hours.toString().padStart(2, "0");
        const minutes = time.minutes.toString().padStart(2, "0");
        return `${hours}:${minutes}${suffix}`;
    }

    function getSameHighlight() {
        if (inputRef.current) {
            return {
                start: inputRef.current.selectionStart || 0,
                end: inputRef.current.selectionEnd || 0,
            };
        }
        return undefined;
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
        e.preventDefault();
        const cursorPosition = inputRef.current?.selectionStart || 0;
        const currentSection: Section | null = sections.find(
            (sec) => cursorPosition >= sec.start && cursorPosition <= sec.end,
        ) as Section | null;

        const pressedKey: string = e.key;

        if (sectionNavigation.canNavigate(currentSection, pressedKey)) {
            sectionNavigation.navigate(currentSection, pressedKey);
        }
        if (sectionAdjusterWithArrows.canAdjust(currentSection, pressedKey)) {
            sectionAdjusterWithArrows.adjust(currentSection, pressedKey);
        }
        if (sectionAdjusterWithNumbers.canAdjust(currentSection, pressedKey)) {
            sectionAdjusterWithNumbers.adjust(currentSection, pressedKey);
        }
        if (amPmSwitcher.canSwitch(currentSection, pressedKey)) {
            amPmSwitcher.switch(currentSection, pressedKey);
        }
        if (sectionEraser.canErase(currentSection, pressedKey)) {
            sectionEraser.erase(currentSection, pressedKey);
        }
    }

    function updateValue(
        updatedSection: { start: number; end: number },
        newSectionValue: string | number,
        highlightSection?: { start: number; end: number },
    ) {
        const { start, end } = updatedSection;
        if (!inputRef.current) {
            return;
        }

        const { value } = inputRef.current;
        const updatedValue =
            value.slice(0, start) + newSectionValue + value.slice(end);

        updateInputValue(updatedValue, highlightSection || updatedSection);
        onValueChange(updatedValue);
    }

    function updateInputValue(
        newValue: string,
        highlight: { start: number; end: number },
    ) {
        if (inputRef.current) {
            inputRef.current.value = newValue;
            inputRef.current.setSelectionRange(highlight.start, highlight.end);
        }
    }

    function highlightSection() {
        if (!inputRef.current) return;
        const cursorPosition = inputRef.current.selectionStart || 0;
        const currentSection: Section | null = sections.find(
            (sec) => cursorPosition >= sec.start && cursorPosition <= sec.end,
        ) as Section | null;

        if (currentSection) {
            inputRef.current.setSelectionRange(
                currentSection.start,
                currentSection.end,
            );
        }
    }

    return (
        <input
            ref={inputRef}
            className="w-full h-full bg-transparent border-none hover:outline-none 
                outline-none z-10 pl-2"
            value={value}
            spellCheck={false}
            onChange={() => {}}
            onSelect={highlightSection}
            onKeyDown={handleKeyDown}
            data-testid="date-time-input"
        />
    );
}

export default DateTimeInput;
