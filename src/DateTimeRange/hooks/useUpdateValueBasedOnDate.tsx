import { useEffect } from "react";
import { updateSectionIn, SectionGroup } from "../utils/functions/updateSectionIn.ts";
import { parseDateToString } from "../utils/functions/dateParser.ts";

export default function useUpdateValueBasedOnDate(
    date: Date | null,
    currentInputValue: string,
    updateInputValue: (newValue: string) => void,
) {
    useEffect(() => {
        if (!date) {
            return;
        }

        const newValue: string | null = updateSectionIn(
            currentInputValue,
            SectionGroup.Date,
            parseDateToString(date),
        );

        if (newValue) {
            updateInputValue(newValue);
        }
    }, [date]);
}
