import { Section, SectionGroup } from "../../enums/sections.ts";
import { resolveSectionInfo, resolveSectionGroup } from "./sectionResolver.ts";

export function updateSectionIn(
    inputValue: string | null,
    sectionToUpdate: Section | SectionGroup,
    newSectionValue: string | number,
): string | null {
    if (!inputValue) {
        return null;
    }

    const section: { start: number; end: number } = isSectionGroup(sectionToUpdate)
        ? resolveSectionGroup(sectionToUpdate as SectionGroup)
        : resolveSectionInfo(sectionToUpdate as Section);

    return inputValue.slice(0, section.start) + newSectionValue + inputValue.slice(section.end);
}

function isSectionGroup(sectionOrSectionGroup: Section | SectionGroup) {
    return Object.values(SectionGroup).includes(sectionOrSectionGroup as SectionGroup);
}
