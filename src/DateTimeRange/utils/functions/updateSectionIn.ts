import { sections } from "../../../globals.ts";

export function updateSectionIn(
    inputValue: string | null,
    sectionToUpdate: Section | SectionGroup,
    newSectionValue: string | number,
): string | null {
    const { start, end } = resolveSection(sectionToUpdate);

    if (!inputValue) {
        return null;
    }

    return inputValue.slice(0, start) + newSectionValue + inputValue.slice(end);
}

function resolveSection(sectionOrSectionGroup: Section | SectionGroup): {
    start: number;
    end: number;
} {
    if (sectionOrSectionGroup == Section.Month) {
        return sections[0];
    } else if (sectionOrSectionGroup == Section.Day) {
        return sections[1];
    } else if (sectionOrSectionGroup == Section.Year) {
        return sections[2];
    } else if (sectionOrSectionGroup == Section.Hour) {
        return sections[3];
    } else if (sectionOrSectionGroup == Section.Minute) {
        return sections[4];
    } else if (sectionOrSectionGroup == SectionGroup.Date) {
        return { start: sections[0].start, end: sections[2].end };
    } else if (sectionOrSectionGroup == SectionGroup.Time24) {
        return { start: sections[3].start, end: sections[4].end };
    } else if (sectionOrSectionGroup == SectionGroup.TimeAmPm) {
        return { start: sections[3].start, end: sections[5].end };
    }

    throw new Error("Should never get here!");
}

export enum SectionGroup {
    Date,
    Time24,
    TimeAmPm,
}

export enum Section {
    Month,
    Day,
    Year,
    Hour,
    Minute,
}
