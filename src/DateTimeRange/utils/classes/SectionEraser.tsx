import ValueUpdater from "./ValueUpdater.tsx";
import { Section } from "../../enums/sections.ts";

export default class SectionEraser {
    private readonly valueUpdater: ValueUpdater;

    constructor(valueUpdater: ValueUpdater) {
        this.valueUpdater = valueUpdater;
    }

    public erase(currentSection: Section | null, pressedKey: string): void {
        if (this.canErase(currentSection, pressedKey)) {
            this.valueUpdater.update(currentSection!, currentSection!.name);
        }
    }

    public canErase(currentSection: Section | null, pressedKey: string): boolean {
        if (!currentSection) {
            return false;
        }

        return pressedKey === "Backspace";
    }
}
