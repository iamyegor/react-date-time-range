import { Section } from "../../enums/sections.ts";
import { updateSectionIn } from "../../utils/functions/sectionUpdater.ts";

export function switchAmPm(
    pressedKey: string,
    currentSection: Section,
    value: string,
    updateInputValue: (newValue: string) => void,
): void {
    if (!canSwitchAmPm(pressedKey, currentSection)) {
        return;
    }

    const newAmPmValue: string = pressedKey == "a" ? "AM" : "PM";
    const newInputValue: string = updateSectionIn(value, currentSection, newAmPmValue);
    updateInputValue(newInputValue);
}

export function canSwitchAmPm(pressedKey: string, currentSection: Section): boolean {
    if (currentSection !== Section.AmPm) {
        return false;
    }

    return pressedKey.toLowerCase() === "a" || pressedKey.toLowerCase() === "p";
}
