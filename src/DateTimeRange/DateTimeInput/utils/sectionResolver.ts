import { sections } from "../../../globals.ts";
import { Section, SectionGroup } from "../enums/sections.ts";
import { SectionInfo } from "../../../types.tsx";

export function resolveSectionInfo(section: Section): SectionInfo {
    if (section == Section.Month) {
        return sections[0];
    } else if (section == Section.Day) {
        return sections[1];
    } else if (section == Section.Year) {
        return sections[2];
    } else if (section == Section.Hour) {
        return sections[3];
    } else if (section == Section.Minute) {
        return sections[4];
    } else if (section == Section.AmPm) {
        return sections[5];
    }

    throw new Error("Should never get here!");
}

export function resolveSection(section: SectionInfo): Section {
    if (sameSection(section, sections[0])) {
        return Section.Month;
    } else if (sameSection(section, sections[1])) {
        return Section.Day;
    } else if (sameSection(section, sections[2])) {
        return Section.Year;
    } else if (sameSection(section, sections[3])) {
        return Section.Hour;
    } else if (sameSection(section, sections[4])) {
        return Section.Minute;
    } else if (sameSection(section, sections[5])) {
        return Section.AmPm;
    }

    throw new Error("Should never get here!");
}

export function resolveSectionBy(position: number): Section | null {
    const sectionInfo: SectionInfo | undefined = sections.find(
        (s) => position >= s.start && position <= s.end,
    );

    return sectionInfo ? resolveSection(sectionInfo) : null;
}

export function getNextSectionInfo(section: Section, isAmPm: boolean): SectionInfo | null {
    const sectionInfo: SectionInfo = resolveSectionInfo(section);

    const nextSectionIndex = sections.indexOf(sectionInfo) + 1;
    const numberOfSections = isAmPm ? sections.length : sections.length - 1;

    return nextSectionIndex > numberOfSections ? null : sections[nextSectionIndex];
}

export function getPreviousSectionInfo(section: Section): SectionInfo | null {
    const sectionInfo: SectionInfo = resolveSectionInfo(section);

    const previousSectionIndex = sections.indexOf(sectionInfo) - 1;

    if (previousSectionIndex < 0) {
        return null;
    }

    return sections[previousSectionIndex];
}

export function getSectionContentIn(
    inputValue: string,
    sectionOrSectionGroup: Section | SectionGroup,
): string {
    let sectionInfo: { start: number; end: number };

    if (isSectionGroup(sectionOrSectionGroup)) {
        sectionInfo = resolveStartEndOf(sectionOrSectionGroup as SectionGroup);
    } else {
        sectionInfo = resolveSectionInfo(sectionOrSectionGroup as Section);
    }

    return inputValue.slice(sectionInfo.start, sectionInfo.end);
}

function sameSection(section1: SectionInfo, section2: SectionInfo) {
    return section1.start === section2.start && section1.end === section2.end;
}

export function resolveStartEndOf(sectionGroup: SectionGroup): { start: number; end: number } {
    if (sectionGroup == SectionGroup.Date) {
        return { start: sections[0].start, end: sections[2].end };
    } else if (sectionGroup == SectionGroup.Time24) {
        return { start: sections[3].start, end: sections[4].end };
    } else if (sectionGroup == SectionGroup.TimeAmPm) {
        return { start: sections[3].start, end: sections[5].end };
    }

    throw new Error("Should never get here!");
}

export function isSectionGroup(sectionOrSectionGroup: Section | SectionGroup) {
    return Object.values(SectionGroup).includes(sectionOrSectionGroup as SectionGroup);
}
