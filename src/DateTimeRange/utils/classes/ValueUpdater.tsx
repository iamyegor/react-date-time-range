import React from "react";

export default class ValueUpdater {
    private readonly inputRef: React.RefObject<HTMLInputElement>;
    private readonly onValueChange: (value: string) => void;

    constructor(
        inputRef: React.RefObject<HTMLInputElement>,
        onValueChange: (value: string) => void,
    ) {
        this.inputRef = inputRef;
        this.onValueChange = onValueChange;
    }

    public updateValue(
        updatedSection: { start: number; end: number },
        newSectionValue: string | number,
        highlightSection?: { start: number; end: number } | null,
    ) {
        const { start, end } = updatedSection;
        if (!this.inputRef.current) {
            return;
        }

        const { value } = this.inputRef.current;
        const updatedValue =
            value.slice(0, start) + newSectionValue + value.slice(end);

        this.updateInputValue(updatedValue, highlightSection || updatedSection);
        this.onValueChange(updatedValue);
    }

    private updateInputValue(
        newValue: string,
        highlight: { start: number; end: number },
    ) {
        if (this.inputRef.current) {
            this.inputRef.current.value = newValue;
            this.inputRef.current.setSelectionRange(
                highlight.start,
                highlight.end,
            );
        }
    }
}
