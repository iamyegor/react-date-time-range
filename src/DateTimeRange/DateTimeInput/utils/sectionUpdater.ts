import { Section } from "../enums/Section.ts";
import { SectionGroup } from "../enums/SectionGroup.ts";
import { resolveSectionInfo, resolveStartEndOf } from "./sectionResolver.ts";

export function updateSectionIn(
    inputValue: string,
    section: Section,
    newSectionValue: string | number,
): string {
    const { start, end }: { start: number; end: number } = resolveSectionInfo(section);
    return inputValue.slice(0, start) + newSectionValue + inputValue.slice(end);
}

export function updateSectionGroupIn(
    inputValue: string,
    sectionGroup: SectionGroup,
    newSectionValue: string | number,
) {
    const { start, end }: { start: number; end: number } = resolveStartEndOf(sectionGroup);
    return inputValue.slice(0, start) + newSectionValue + inputValue.slice(end);
}
