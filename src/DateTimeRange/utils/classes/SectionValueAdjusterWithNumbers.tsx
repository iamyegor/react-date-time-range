import { SectionInfo } from "types.tsx";
import { sections } from "globals.ts";
import ValueUpdater from "./ValueUpdater.tsx";

export default class SectionValueAdjusterWithNumbers {
    private readonly value: string;
    private readonly valueUpdater: ValueUpdater;
    constructor(value: string, valueUpdater: ValueUpdater) {
        this.value = value;
        this.valueUpdater = valueUpdater;
    }

    public adjust(currentSection: SectionInfo | null, pressedKey: string): void {
        if (!this.canAdjust(currentSection, pressedKey)) {
            return;
        }

        const { start, end, max }: { start: number; end: number; max: number } = currentSection!;

        let currentSectionValue = this.value.slice(start, end);
        let newSectionValue: string;
        let newHighlightedSection: SectionInfo;
        const numKey: number = parseInt(pressedKey);

        if (currentSection === sections[2]) {
            newSectionValue = this.calculateNewSectionValueForYear(currentSectionValue, numKey);

            newHighlightedSection = this.calculateNewHighlightedSectionForYear(newSectionValue);
        } else {
            newSectionValue = this.calculateNewSectionValue(
                currentSectionValue,
                max,
                numKey,
                currentSection === sections[4],
            );

            newHighlightedSection = this.calculateNewHighlightedSection(
                sections.indexOf(currentSection!),
                newSectionValue,
                max,
            );
        }

        this.valueUpdater.update(currentSection!, newSectionValue, newHighlightedSection);
    }

    public canAdjust(currentSection: SectionInfo | null, pressedKey: string): boolean {
        if (!currentSection) {
            return false;
        }

        return !isNaN(parseInt(pressedKey));
    }

    private calculateNewSectionValueForYear(currentSectionValue: string, numKey: number) {
        if (currentSectionValue.startsWith("0")) {
            return (currentSectionValue + numKey).slice(-4);
        } else {
            return "000" + numKey.toString();
        }
    }

    private calculateNewHighlightedSectionForYear(currentSectionValue: string) {
        if (currentSectionValue[0] === "0") {
            return sections[2];
        }

        return sections[3];
    }

    private calculateNewSectionValue(
        currentSectionValue: string,
        max: number,
        numKey: number,
        allowZero: boolean = false,
    ): string {
        if (currentSectionValue.length != 2) {
            throw new Error("Invalid section length");
        }

        const currentSecondDigit = parseInt(currentSectionValue[1]);

        if (currentSectionValue.startsWith("0")) {
            // For example the current value is '02' and the user inputs '5', this logic shifts the
            // existing second digit ('2') to become the first digit, which results in 25
            const intendedValue: number = parseInt(`${currentSecondDigit}${numKey}`);
            if (intendedValue > max) {
                return "0" + numKey.toString(); // e.g: 05
            } else {
                return intendedValue.toString();
            }
        } else {
            if (!allowZero && numKey === 0) {
                return currentSectionValue;
            } else {
                return "0" + numKey.toString();
            }
        }
    }

    private calculateNewHighlightedSection(
        currentSectionIndex: number,
        currentSectionValue: string,
        max: number,
    ): SectionInfo {
        const maxAllowedFirstDigit = parseInt(max.toString()[0]);
        const currentFirstDigit = parseInt(currentSectionValue[0]);
        const currentSecondDigit = parseInt(currentSectionValue[1]);

        if (!parseInt(currentSectionValue)) {
            return sections[currentSectionIndex];
        }

        if (currentFirstDigit === 0 && currentSecondDigit <= maxAllowedFirstDigit) {
            return sections[currentSectionIndex];
        }

        return sections[currentSectionIndex + 1];
    }
}
