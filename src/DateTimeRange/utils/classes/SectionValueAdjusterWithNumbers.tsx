import { Section } from "../../types.tsx";
import { sections } from "../../globals.ts";
import ValueUpdater from "./ValueUpdater.tsx";

export default class SectionValueAdjusterWithNumbers {
    private readonly value: string;
    private readonly valueUpdater: ValueUpdater;
    constructor(value: string, valueUpdater: ValueUpdater) {
        this.value = value;
        this.valueUpdater = valueUpdater;
    }

    public adjust(currentSection: Section | null, pressedKey: string): void {
        if (!this.canAdjust(currentSection, pressedKey)) {
            return;
        }

        const { start, end, max }: { start: number; end: number; max: number } =
            currentSection!;

        let currentSectionValue = this.value.slice(start, end);
        let newSectionValue: string;
        let newHighlightedSection: Section;
        const numKey: number = parseInt(pressedKey);

        if (currentSection === sections[2]) {
            newSectionValue = this.calculateNewSectionValueForYear(
                currentSectionValue,
                numKey,
            );

            newHighlightedSection =
                this.calculateNewHighlightedSectionForYear(newSectionValue);
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

        this.valueUpdater.updateValue(
            currentSection!,
            newSectionValue,
            newHighlightedSection,
        );
    }

    public canAdjust(
        currentSection: Section | null,
        pressedKey: string,
    ): boolean {
        if (!currentSection) {
            return false;
        }

        return !isNaN(parseInt(pressedKey));
    }

    private calculateNewSectionValueForYear(
        currentSectionValue: string,
        numKey: number,
    ) {
        if (currentSectionValue[0] !== "0") {
            return "000" + numKey.toString();
        } else {
            return (currentSectionValue + numKey).slice(-4);
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
    ) {
        const maxFirstDigit = parseInt(max.toString()[0]);
        const maxSecondDigit = parseInt(max.toString()[1]);
        const secondDigit = parseInt(currentSectionValue[1]);

        if (currentSectionValue[0] === "0") {
            if (
                secondDigit < maxFirstDigit ||
                (secondDigit === maxFirstDigit && numKey <= maxSecondDigit)
            ) {
                return currentSectionValue[1] + numKey.toString();
            }
        }

        if (!allowZero) {
            if (numKey === 0) {
                return currentSectionValue;
            }
        }

        return "0" + numKey.toString();
    }

    private calculateNewHighlightedSection(
        currentSectionIndex: number,
        currentSectionValue: string,
        max: number,
    ) {
        const maxFirstDigit = parseInt(max.toString()[0]);
        const secondDigit = parseInt(currentSectionValue[1]);

        if (
            (currentSectionValue[0] === "0" && secondDigit <= maxFirstDigit) ||
            !parseInt(currentSectionValue)
        ) {
            return sections[currentSectionIndex];
        }

        return sections[currentSectionIndex + 1];
    }
}
