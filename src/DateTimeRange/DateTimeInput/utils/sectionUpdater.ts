import { Section, SectionGroup } from "../enums/sections.ts";
import { isSectionGroup, resolveSectionStartEnd, resolveSectionInfo } from "./sectionResolver.ts";

export function updateSectionIn(
    inputValue: string,
    sectionToUpdate: Section | SectionGroup,
    newSectionValue: string | number,
): string {
    const section: { start: number; end: number } = isSectionGroup(sectionToUpdate)
        ? resolveSectionStartEnd(sectionToUpdate as SectionGroup)
        : resolveSectionInfo(sectionToUpdate as Section);

    return inputValue.slice(0, section.start) + newSectionValue + inputValue.slice(section.end);
}

