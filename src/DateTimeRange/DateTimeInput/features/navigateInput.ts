import { Section } from "../enums/Section.ts";
import { getNextSectionInfo, getPreviousSectionInfo } from "../utils/sectionResolver.ts";
import { SectionInfo } from "../types/SectionInfo.ts";

export function navigateInputWithArrows(
    input: HTMLInputElement | null,
    pressedKey: string,
    currentSection: Section,
    isAmPm: boolean,
) {
    if (!canNavigateWithArrows(pressedKey)) {
        return;
    }

    let sectionToHighlight: SectionInfo | null;
    if (pressedKey === "ArrowLeft") {
        sectionToHighlight = getPreviousSectionInfo(currentSection);
    } else {
        sectionToHighlight = getNextSectionInfo(currentSection, isAmPm);
    }

    if (!sectionToHighlight) {
        return;
    }

    input?.setSelectionRange(sectionToHighlight.start, sectionToHighlight.end);
}

export function canNavigateWithArrows(pressedKey: string) {
    return pressedKey === "ArrowLeft" || pressedKey === "ArrowRight";
}
