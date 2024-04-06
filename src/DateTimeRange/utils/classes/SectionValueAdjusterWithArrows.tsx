import { Section } from "types";
import { sections } from "globals";
import ValueUpdater from "./ValueUpdater.tsx";

export default class SectionValueAdjusterWithArrows {
    private readonly value: string;
    private readonly useAMPM: boolean;
    private readonly valueUpdater: ValueUpdater;

    constructor(value: string, valueUpdater: ValueUpdater, useAMPM: boolean) {
        this.value = value;
        this.valueUpdater = valueUpdater;
        this.useAMPM = useAMPM;
    }

    public adjust(currentSection: Section | null, pressedKey: string) {
        const { start, end, min }: { start: number; end: number; min?: number } = currentSection!;

        if (!this.canAdjust(currentSection, pressedKey)) {
            return;
        }

        if (start === 17 && end === 19) {
            const isCurrentlyPM = this.value.slice(start, end) === "PM";
            this.valueUpdater.update(sections[5], isCurrentlyPM ? "AM" : "PM");

            return;
        }

        let currentValue: number = parseInt(this.value.slice(start, end)) || 0;
        currentValue = pressedKey == "ArrowUp" ? currentValue + 1 : currentValue - 1;

        const minThreshold: number = min ?? 1;
        const maxThreshold: number = this.getMaxPossibleValueForSection(currentSection!);

        if (currentValue < minThreshold) {
            currentValue = maxThreshold;
        }
        if (currentValue > maxThreshold) {
            currentValue = minThreshold;
        }

        const pads: number = end - start;
        this.valueUpdater.update(currentSection!, currentValue.toString().padStart(pads, "0"));
    }

    public canAdjust(currentSection: Section | null, pressedKey: string): boolean {
        if (!currentSection) {
            return false;
        }

        return pressedKey === "ArrowUp" || pressedKey === "ArrowDown";
    }

    private getMaxPossibleValueForSection(section: Section): number {
        if (section === sections[3]) {
            return this.useAMPM ? 12 : 23;
        }

        return section.max;
    }
}
