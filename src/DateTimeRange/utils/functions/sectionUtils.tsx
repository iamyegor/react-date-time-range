import { Section } from "../../types.tsx";

export function getSectionValue(
    wholeValue: string,
    sectionPosition: {
        start: number;
        end: number;
    },
): string {
    return wholeValue.slice(sectionPosition.start, sectionPosition.end);
}

export function extractPosition(
    startPosition: Section | null,
    endPosition: Section | null,
): { start: number; end: number } {
    const start = startPosition ? startPosition.start : 0;
    const end = endPosition ? endPosition.end : 0;

    return { start, end };
}
