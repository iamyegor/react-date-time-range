import { Section } from "../enums/sections.ts";
import { updateSectionIn } from "../utils/sectionUpdater.ts";
import { SectionInfo } from "../../../types.tsx";
import { resolveSectionInfo } from "../utils/sectionResolver.ts";

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
    const newInputValue: string = updateSectionIn(value, section, name);
    updateInputValue(newInputValue);
}
