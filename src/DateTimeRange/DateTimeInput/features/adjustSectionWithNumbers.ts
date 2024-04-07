import { Section } from "../enums/Section.ts";
import { updateSectionIn } from "../utils/sectionUpdater.ts";
import {
    getNextSectionInfo,
    getSectionContentIn,
    resolveSection,
    resolveSectionInfo,
} from "../utils/sectionResolver.ts";

import { SectionInfo } from "../types/SectionInfo.ts";

export function canAdjustSectionWithNumbers(pressedKey: string, currentSection: Section): boolean {
    return !isNaN(parseInt(pressedKey, 10)) && currentSection !== Section.AmPm;
}

export function adjustSectionWithNumbers(
    pressedKey: string,
    currentSection: Section,
    value: string,
    updateInputValueAndHighlight: (newValue: string, sectionToHighlight: Section) => void,
    isAmPm: boolean,
): void {
    if (!canAdjustSectionWithNumbers(pressedKey, currentSection)) {
        return;
    }

    const numKey: number = parseInt(pressedKey);

    const updatedContentOfSection: string =
        currentSection == Section.Year
            ? updateYearSectionContent(currentSection, numKey, value)
            : update2DigitSectionContent(currentSection, numKey, value);

    const sectionToHighlight: Section =
        currentSection == Section.Year
            ? updateYearSectionHighlight(updatedContentOfSection)
            : update2DigitSectionHighlight(updatedContentOfSection, currentSection, isAmPm);

    const newInputValue: string = updateSectionIn(value, currentSection, updatedContentOfSection)!;
    updateInputValueAndHighlight(newInputValue, sectionToHighlight);
}

function updateYearSectionContent(currentSection: Section, numKey: number, value: string): string {
    const currentSectionContent: string = getSectionContentIn(value, currentSection);

    if (currentSectionContent.startsWith("0")) {
        return (currentSectionContent + numKey).slice(-4);
    } else {
        return "000" + numKey.toString();
    }
}

function update2DigitSectionContent(
    currentSection: Section,
    numKey: number,
    value: string,
): string {
    const currentSectionContent: string = getSectionContentIn(value, currentSection);
    const sectionInfo: SectionInfo = resolveSectionInfo(currentSection);
    const currentSecondDigit: string = currentSectionContent.charAt(1);

    if (currentSectionContent.startsWith("0")) {
        // E.g. the current value is '02' if user inputs '5', it results in 25
        const intendedValue: number = parseInt(`${currentSecondDigit}${numKey}`);
        if (intendedValue > sectionInfo.max) {
            return "0" + numKey.toString();
        } else {
            return intendedValue.toString();
        }
    } else {
        if (currentSection != Section.Minute && numKey === 0) {
            return currentSectionContent;
        } else {
            return "0" + numKey.toString();
        }
    }
}
function updateYearSectionHighlight(updatedSectionValue: string): Section {
    if (updatedSectionValue.startsWith("0")) {
        return Section.Year;
    }

    return Section.Hour; // next section
}

function update2DigitSectionHighlight(
    updatedSectionValue: string,
    section: Section,
    isAmPm: boolean,
): Section {
    const { max }: { max: number } = resolveSectionInfo(section);

    const maxAllowedFirstDigit: number = parseInt(max.toString().charAt(0));
    const currentSecondDigit: number = parseInt(updatedSectionValue.charAt(1));

    if (!parseInt(updatedSectionValue)) {
        return section;
    }

    if (updatedSectionValue.startsWith("0") && currentSecondDigit <= maxAllowedFirstDigit) {
        return section;
    }

    const sectionInfo: SectionInfo | null = getNextSectionInfo(section, isAmPm);
    return sectionInfo ? resolveSection(sectionInfo) : section;
}
