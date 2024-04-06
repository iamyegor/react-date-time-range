import { Section } from "../../enums/sections.ts";
import { decrementValueIn, incrementValueIn } from "./sectionIncrementer.ts";
import { resolveSectionInfo } from "./sectionResolver.ts";
import { updateSectionIn } from "./sectionUpdater.ts";
import { toggleAmPm } from "./amPmToggler.ts";

export function adjustSectionWithArrows(
    section: Section,
    pressedKey: string,
    value: string,
    isAmPm: boolean,
    updateInputValue: (newValue: string) => void,
): void {
    if (!canAdjustSectionWithArrows(pressedKey)) {
        return;
    }
    
    let newSectionValue: string | number;

    if (section == Section.AmPm) {
        newSectionValue = toggleAmPm(value);
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

export function canAdjustSectionWithArrows(pressedKey:string): boolean {
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
