import { Section } from "../enums/Section.ts";
import { getSectionContentIn, resolveSectionInfo } from "./sectionResolver.ts";
import { SectionInfo } from "../types/SectionInfo.ts";

export function incrementValueIn(section: Section, inputValue: string, isAmPm: boolean): number {
    if (section == Section.AmPm) {
        throw new Error("Can't increment am pm section");
    }

    const sectionInfo: SectionInfo = resolveSectionInfo(section);

    const currentValue: number = parseInt(getSectionContentIn(inputValue, section)) || 0;
    let incrementedValue: number = currentValue + 1;

    if (incrementedValue > getMaxThreshold(section, isAmPm)) {
        incrementedValue = sectionInfo.min ?? 1;
    }

    return incrementedValue;
}

export function decrementValueIn(section: Section, inputValue: string, isAmPm: boolean): number {
    if (section == Section.AmPm) {
        throw new Error("Can't increment am pm section");
    }

    const sectionInfo: SectionInfo = resolveSectionInfo(section);

    const currentValue: number = parseInt(getSectionContentIn(inputValue, section)) || 0;
    let decrementedValue: number = currentValue - 1;

    if (decrementedValue < (sectionInfo.min ?? 1)) {
        decrementedValue = getMaxThreshold(section, isAmPm);
    }

    return decrementedValue;
}

function getMaxThreshold(section: Section, isAmPm: boolean): number {
    const sectionInfo: SectionInfo = resolveSectionInfo(section);

    if (section != Section.Hour) {
        return sectionInfo.max;
    }

    return isAmPm ? 12 : 23;
}
