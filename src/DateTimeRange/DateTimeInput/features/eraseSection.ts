import { Section } from "../enums/Section.ts";
import { replaceSectionValue } from "../utils/sectionUpdater.ts";
import { resolveSectionInfo } from "../utils/sectionResolver.ts";
import { SectionInfo } from "../types/SectionInfo.ts";

export function canEraseSection(pressedKey: string) {
    return pressedKey === "Backspace";
}
export function eraseSection(
    pressedKey: string,
    section: Section,
    value: string,
    updateInputValue: (newValue: string) => void,
): void {
    if (!canEraseSection(pressedKey)) {
        return;
    }

    const { name }: { name: string } = resolveSectionInfo(section);
    const newInputValue: string = replaceSectionValue(value, section, name);
    updateInputValue(newInputValue);
}
