import { isValid } from "date-fns";
import { KeyboardEvent, useEffect, useMemo, useRef } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUseAMPM } from "../features/dateTimeRangeSlice";
import { DATE_PLACEHOLDER, getDateTimePlaceholder, sections } from "../globals";
import { Section, Time } from "types.tsx";
import SectionNavigation from "./utils/classes/SectionNavigation.tsx";
import SectionValueAdjusterWithArrows from "./utils/classes/SectionValueAdjusterWithArrows.tsx";
import SectionValueAdjusterWithNumbers from "./utils/classes/SectionValueAdjusterWithNumbers.tsx";
import AmPmSwitcher from "./utils/classes/AmPmSwitcher.tsx";
import SectionEraser from "./utils/classes/SectionEraser.tsx";
import ValueUpdater from "./utils/classes/ValueUpdater.tsx";
import {
    extractPosition,
    getSameHighlight,
    getSectionValue,
} from "DateTimeRange/utils/functions/sectionUtils.tsx";
import useTime from "./hooks/useTime.tsx";

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

    const valueUpdater = useMemo(
        () => new ValueUpdater(inputRef, onValueChange),
        [inputRef, onValueChange],
    );

    const sectionNavigation = useMemo(
        () => new SectionNavigation(inputRef, sections, useAMPM),
        [inputRef, sections, useAMPM],
    );

    const sectionAdjusterWithArrows = useMemo(
        () => new SectionValueAdjusterWithArrows(value, valueUpdater, useAMPM),
        [inputRef, value, onValueChange, useAMPM],
    );

    const amPmSwitcher = useMemo(
        () => new AmPmSwitcher(valueUpdater),
        [inputRef, onValueChange],
    );

    const sectionAdjusterWithNumbers = useMemo(
        () => new SectionValueAdjusterWithNumbers(value, valueUpdater),
        [value, inputRef, onValueChange],
    );

    const sectionEraser = useMemo(
        () => new SectionEraser(valueUpdater),
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
        const section = {
            start: sections[0].start,
            end: sections[5].end,
        };

        const allSectionsValue: string = getSectionValue(value, section);
        return allSectionsValue === getDateTimePlaceholder(useAMPM);
    }

    function queryDateFromValue() {
        const month = parseInt(getSectionValue(value, sections[0]));
        const day = parseInt(getSectionValue(value, sections[1]));
        const year = parseInt(getSectionValue(value, sections[2]));

        if (year > 1899 && year < 2101) {
            return new Date(year, month - 1, day);
        }

        return null;
    }

    function queryTimeFromValue() {
        const hours = parseInt(getSectionValue(value, sections[3]));
        const minutes = parseInt(getSectionValue(value, sections[4]));
        const ampm = useAMPM ? getSectionValue(value, sections[5]) : "24";

        if (isTimeValid(hours, minutes, ampm)) {
            return { hours, minutes, ampm } as Time;
        }

        return null;
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
        const dateSection: { start: number; end: number } = extractPosition(
            sections[0],
            sections[2],
        );

        let newDateValue: string;
        if (date) {
            const month: string = (date.getMonth() + 1)
                .toString()
                .padStart(2, "0");
            const day: string = date.getDate().toString().padStart(2, "0");
            const year: string = date.getFullYear().toString().padStart(4, "0");

            newDateValue = `${month}/${day}/${year}`;
        } else {
            const dateValue: string = getSectionValue(value, dateSection);

            if (dateValue && isDateInvalid) {
                newDateValue = dateValue;
            } else {
                newDateValue = DATE_PLACEHOLDER;
            }
        }

        valueUpdater.updateValue(
            dateSection,
            newDateValue,
            getSameHighlight(inputRef.current),
        );
    }, [date]);

    useTime(
        time,
        value,
        isTimeInvalid,
        inputRef.current,
        useAMPM,
        valueUpdater,
    );

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
        e.preventDefault();

        const currentSection: Section | null = getSelectedSection();
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

    function highlightSection(): void {
        const currentSection: Section | null = getSelectedSection();
        if (currentSection) {
            inputRef.current!.setSelectionRange(
                currentSection.start,
                currentSection.end,
            );
        }
    }

    function getSelectedSection(): Section | null {
        if (!inputRef.current) {
            return null;
        }

        const cursorPosition = inputRef.current.selectionStart || 0;

        return sections.find(
            (s) => cursorPosition >= s.start && cursorPosition <= s.end,
        ) as Section | null;
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
