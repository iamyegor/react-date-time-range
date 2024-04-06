import { SectionGroup } from "../../enums/sections.ts";
import { resolveSectionGroup } from "./sectionResolver.ts";

export function extractSectionContentIn(valueToExtractFrom: string, section: SectionGroup): string {
    const { start, end } = resolveSectionGroup(section);
    return valueToExtractFrom.slice(start, end);
}

export function getSameHighlight(
    inputElement: HTMLInputElement | null,
): { start: number; end: number } | null {
    if (!inputElement) {
        return null;
    }

    return {
        start: inputElement.selectionStart || 0,
        end: inputElement.selectionEnd || 0,
    };
}
