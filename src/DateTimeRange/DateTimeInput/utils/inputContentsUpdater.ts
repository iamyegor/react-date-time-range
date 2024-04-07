import { Section } from "../enums/Section.ts";
import { resolveSectionInfo } from "./sectionResolver.ts";
import { SectionInfo } from "../types/SectionInfo.ts";

// Updates the content of the specified input field with a new value and
// maintains the user's cursor position. Without this function, just modifying
// the value state variable would cause the cursor to jump to the beginning of the input field,
// which disrupts the user experience.
// Optionally, a section of the text can be highlighted. If no section is specified,
// the function attempts to preserve the current highlight.
export function updateInputContents(input: HTMLInputElement | null, newValue: string) {
    if (!input) {
        return;
    }

    const sectionToHighlight = {
        start: input.selectionStart || 0,
        end: input.selectionEnd || 0,
    };

    input.value = newValue;
    input.setSelectionRange(sectionToHighlight.start, sectionToHighlight.end);
}

export function updateInputContentsAndHighlight(
    input: HTMLInputElement | null,
    newValue: string,
    sectionToHighlight: Section,
) {
    if (!input) {
        return;
    }

    input.value = newValue;

    const sectionInfo: SectionInfo = resolveSectionInfo(sectionToHighlight);
    input.setSelectionRange(sectionInfo.start, sectionInfo.end);
}
