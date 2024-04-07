import { Section } from "../../enums/sections.ts";
import { decrementValueIn, incrementValueIn } from "../../utils/functions/sectionIncrementer.ts";
import { getSectionContentIn, resolveSectionInfo } from "../../utils/functions/sectionResolver.ts";
import { updateSectionIn } from "../../utils/functions/sectionUpdater.ts";

export function adjustSectionWithArrows(
    pressedKey: string,
    section: Section,
    value: string,
    isAmPm: boolean,
    updateInputValue: (newValue: string) => void,
): void {
    if (!canAdjustSectionWithArrows(pressedKey)) {
        return;
    }

    let newSectionValue: string | number;

    if (section == Section.AmPm) {
        newSectionValue = toggleAmPmIn(value);
    } else {
        if (pressedKey == "ArrowUp") {
            newSectionValue = incrementValueIn(section, value, isAmPm);
        } else {
            newSectionValue = decrementValueIn(section, value, isAmPm);
        }
    }

    const newSectionWithPads: string = addPadsBasedOnSection(newSectionValue, section);
    const newValue: string = updateSectionIn(value, section, newSectionWithPads)!;
    updateInputValue(newValue);
}

export function toggleAmPmIn(inputValue: string): string {
    const amPm: string = getSectionContentIn(inputValue, Section.AmPm);

    if (amPm == "AM") {
        return "PM";
    } else {
        return "AM";
    }
}

export function canAdjustSectionWithArrows(pressedKey: string): boolean {
    return pressedKey == "ArrowUp" || pressedKey == "ArrowDown";
}

function addPadsBasedOnSection(newValue: string | number, section: Section): string {
    if (section == Section.AmPm) {
        return newValue as string;
    }

    const sectionInfo = resolveSectionInfo(section);
    const pads: number = sectionInfo.end - sectionInfo.start;

    return newValue.toString().padStart(pads, "0");
}
