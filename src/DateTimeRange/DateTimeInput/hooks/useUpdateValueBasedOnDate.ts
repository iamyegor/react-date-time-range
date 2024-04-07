import { useEffect } from "react";
import { parseDateToString } from "../utils/dateParser.ts";
import { updateSectionGroupIn, updateSectionIn } from "../utils/sectionUpdater.ts";
import { SectionGroup } from "../enums/sections.ts";

export default function useUpdateValueBasedOnDate(
    date: Date | null,
    currentInputValue: string,
    updateInputValue: (newValue: string) => void,
) {
    useEffect(() => {
        if (!date) {
            return;
        }

        const newValue: string | null = updateSectionGroupIn(
            currentInputValue,
            SectionGroup.Date,
            parseDateToString(date),
        );

        if (newValue) {
            updateInputValue(newValue);
        }
    }, [date]);
}
