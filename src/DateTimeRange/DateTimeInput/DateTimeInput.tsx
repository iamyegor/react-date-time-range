import { KeyboardEvent, useRef } from "react";
import { useAppSelector } from "../../redux/hooks.ts";
import { selectUseAMPM } from "../../redux/dateTimeRangeSlice.ts";
import { Time } from "types.tsx";
import {
    updateInputContents,
    updateInputContentsAndHighlight,
} from "./utils/inputContentsUpdater.ts";
import { Section } from "./enums/Section.ts";
import { resolveSectionBy, resolveSectionInfo } from "./utils/sectionResolver.ts";
import { canNavigateWithArrows, navigateInputWithArrows } from "./features/navigateInput.ts";
import {
    adjustSectionWithArrows,
    canAdjustSectionWithArrows,
} from "./features/adjustSectionWithArrows.ts";
import {
    adjustSectionWithNumbers,
    canAdjustSectionWithNumbers,
} from "./features/adjustSectionWithNumbers.ts";
import { canSwitchAmPm, switchAmPm } from "./features/switchAmPm.ts";
import { canEraseSection, eraseSection } from "./features/eraseSection.ts";
import { SectionInfo } from "./types/SectionInfo.ts";
import useUpdateValueBasedOnDateTime from "./hooks/useUpdateValueBasedOnDateTime.ts";

interface DateTimeInputProps {
    date: Date | null;
    time: Time | null;
    value: string;
    updateValue: (value: string) => void;
}

export default function DateTimeInput({ date, time, value, updateValue }: DateTimeInputProps) {
    const isAmPm = useAppSelector(selectUseAMPM);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useUpdateValueBasedOnDateTime(date, time, value, updateInputValue, isAmPm)

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
        e.preventDefault();

        const currentSection: Section | null = getSelectedSection();
        const pressedKey: string = e.key;

        if (!currentSection) {
            return;
        }

        if (canNavigateWithArrows(pressedKey)) {
            navigateInputWithArrows(inputRef.current, pressedKey, currentSection, isAmPm);
        } else if (canAdjustSectionWithArrows(pressedKey)) {
            adjustSectionWithArrows(pressedKey, currentSection, value, isAmPm, updateInputValue);
        } else if (canAdjustSectionWithNumbers(pressedKey, currentSection)) {
            adjustSectionWithNumbers(
                pressedKey,
                currentSection,
                value,
                updateInputValueAndHighlight,
                isAmPm,
            );
        } else if (canSwitchAmPm(pressedKey, currentSection)) {
            switchAmPm(pressedKey, currentSection, value, updateInputValue);
        } else if (canEraseSection(pressedKey)) {
            eraseSection(pressedKey, currentSection, value, updateInputValue);
        }
    }

    function updateInputValue(newValue: string): void {
        updateInputContents(inputRef.current, newValue);
        updateValue(newValue);
    }

    function updateInputValueAndHighlight(newValue: string, sectionToHighlight: Section): void {
        updateInputContentsAndHighlight(inputRef.current, newValue, sectionToHighlight);
        updateValue(newValue);
    }

    function highlightSection(): void {
        const selectedSection: Section | null = getSelectedSection();
        if (!selectedSection) {
            return;
        }

        const sectionInfo: SectionInfo = resolveSectionInfo(selectedSection);
        inputRef.current!.setSelectionRange(sectionInfo.start, sectionInfo.end);
    }

    function getSelectedSection(): Section | null {
        if (!inputRef.current) {
            return null;
        }

        const cursorPosition: number = inputRef.current.selectionStart || 0;
        return resolveSectionBy(cursorPosition);
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
