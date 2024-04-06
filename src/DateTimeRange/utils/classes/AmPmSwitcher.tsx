import { Section } from "types.tsx";
import { sections } from "globals.ts";
import ValueUpdater from "./ValueUpdater.tsx";

export default class AmPmSwitcher {
    private readonly valueUpdater: ValueUpdater;

    constructor(valueUpdater: ValueUpdater) {
        this.valueUpdater = valueUpdater;
    }

    public switch(section: Section | null, pressedKey: string) {
        if (this.canSwitch(section, pressedKey)) {
            const newAmPmValue: string = pressedKey == "a" ? "AM" : "PM";
            this.valueUpdater.update(section!, newAmPmValue);
        }
    }

    public canSwitch(currentSection: Section | null, pressedKey: string): boolean {
        if (currentSection != sections[5]) {
            return false;
        }

        return pressedKey.toLowerCase() === "a" || pressedKey.toLowerCase() === "p";
    }
}
