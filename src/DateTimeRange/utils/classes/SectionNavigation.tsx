import { Section } from "../../types.tsx";
import React from "react";

export default class SectionNavigation {
    private readonly inputElement: React.MutableRefObject<HTMLInputElement | null>;
    private readonly sections: Section[];
    private readonly useAMPM: boolean;

    constructor(
        inputElement: React.MutableRefObject<HTMLInputElement | null>,
        sections: Section[],
        useAMPM: boolean,
    ) {
        this.inputElement = inputElement;
        this.sections = sections;
        this.useAMPM = useAMPM;
    }

    public navigate(currentSection: Section | null, pressedKey: string): void {
        if (this.canNavigate(currentSection, pressedKey)) {
            const isNext = pressedKey === "ArrowRight";
            this.moveToDifferentSection(this.sections.indexOf(currentSection!), isNext);
        }
    }

    public canNavigate(section: Section | null, pressedKey: string): boolean {
        if (!section) return false;
        return pressedKey === "ArrowLeft" || pressedKey === "ArrowRight";
    }

    private moveToDifferentSection(currentSectionIndex: number, isNext: boolean): void {
        const nextSectionIndex = isNext ? currentSectionIndex + 1 : currentSectionIndex - 1;

        const sectionsLength = this.useAMPM ? this.sections.length - 1 : this.sections.length - 2;

        if (nextSectionIndex < 0 || nextSectionIndex > sectionsLength) {
            return;
        }

        const nextSection = this.sections[nextSectionIndex];
        this.inputElement.current?.setSelectionRange(nextSection.start, nextSection.end);
    }
}
