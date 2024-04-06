import { KeyboardEvent, useRef } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUseAMPM } from "../features/dateTimeRangeSlice";
import { sections } from "../globals";
import { SectionInfo, Time } from "types.tsx";
import useUpdateValueBasedOnTime from "./hooks/useUpdateValueBasedOnTime.tsx";
import useUpdateValueBasedOnDate from "./hooks/useUpdateValueBasedOnDate.tsx";
import {
    updateInputContents,
    updateInputContentsAndHighlight,
} from "./utils/functions/inputContentsUpdater.ts";
import { Section } from "./enums/sections.ts";
import { resolveSection, resolveSectionInfo } from "./utils/functions/sectionResolver.ts";
import {
    adjustSectionWithArrows,
    canAdjustSectionWithArrows,
} from "./utils/functions/sectionValueAdjuster.ts";
import { canNavigateWithArrows, navigateWithArrows } from "./utils/functions/inputNavigator.ts";

interface DateTimeInputProps {
    date: Date | null;
    time: Time | null;
    value: string;
    updateValue: (value: string) => void;
}

export default function DateTimeInput({ date, time, value, updateValue }: DateTimeInputProps) {
    const isAmPm = useAppSelector(selectUseAMPM);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useUpdateValueBasedOnDate(date, value, updateInputValue);
    useUpdateValueBasedOnTime(time, value, updateInputValue, isAmPm);

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
        e.preventDefault();

        const currentSection: Section | null = getSelectedSection();
        const pressedKey: string = e.key;

        if (!currentSection) {
            return;
        }

        if (canNavigateWithArrows(pressedKey)) {
            navigateWithArrows(inputRef.current, pressedKey, currentSection, isAmPm);
        } else if (canAdjustSectionWithArrows(pressedKey)) {
            adjustSectionWithArrows(currentSection, pressedKey, value, isAmPm, updateInputValue);
        } else if (canAdjustSectionWithNumbers(pressedKey)) {
            adjustSectionWithNumbers()
        }
        // if (sectionNavigation.canNavigate(currentSection, pressedKey)) {
        //     sectionNavigation.navigate(currentSection, pressedKey);
        // }
        // if (sectionAdjusterWithArrows.canAdjust(currentSection, pressedKey)) {
        //     sectionAdjusterWithArrows.adjust(currentSection, pressedKey);
        // }
        // if (sectionAdjusterWithNumbers.canAdjust(currentSection, pressedKey)) {
        //     sectionAdjusterWithNumbers.adjust(currentSection, pressedKey);
        // }
        // if (amPmSwitcher.canSwitch(currentSection, pressedKey)) {
        //     amPmSwitcher.switch(currentSection, pressedKey);
        // }
        // if (sectionEraser.canErase(currentSection, pressedKey)) {
        //     sectionEraser.erase(currentSection, pressedKey);
        // }
    }

    function updateInputValue(newValue: string): void {
        updateInputContents(inputRef.current, newValue);
        updateValue(newValue);
    }

    function updateInputValueAndHighlight(newValue: string, sectionToHighlight: Section) {
        updateInputContentsAndHighlight(inputRef.current, newValue, sectionToHighlight);
        updateValue(newValue);
    }

    function highlightSection(): void {
        const currentSection: Section | null = getSelectedSection();
        if (!currentSection) {
            return;
        }

        const sectionInfo = resolveSectionInfo(currentSection);
        inputRef.current!.setSelectionRange(sectionInfo.start, sectionInfo.end);
    }

    function getSelectedSection(): Section | null {
        if (!inputRef.current) {
            return null;
        }

        const cursorPosition = inputRef.current.selectionStart || 0;

        const sectionInfo: SectionInfo | undefined = sections.find(
            (s) => cursorPosition >= s.start && cursorPosition <= s.end,
        );

        if (sectionInfo) {
            return resolveSection(sectionInfo);
        }

        return null;
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
