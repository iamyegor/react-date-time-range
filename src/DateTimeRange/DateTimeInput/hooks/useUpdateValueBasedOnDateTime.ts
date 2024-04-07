import { Time } from "../../../types.tsx";
import { replaceSectionGroupValue } from "../utils/sectionUpdater.ts";
import { SectionGroup } from "../enums/SectionGroup.ts";
import { parseDateToString } from "../utils/dateParser.ts";
import { useEffect } from "react";
import { parseTimeToString } from "../utils/timeParser.ts";

export default function useUpdateValueBasedOnDateTime(
    date: Date | null,
    time: Time | null,
    inputValue: string,
    updateInputValue: (newValue: string) => void,
    isAmPm: boolean,
) {
    useEffect(() => {
        let newInputValue: string = inputValue;

        if (date) {
            newInputValue = replaceSectionGroupValue(
                newInputValue,
                SectionGroup.Date,
                parseDateToString(date),
            );
        }
        if (time) {
            newInputValue = replaceSectionGroupValue(
                newInputValue,
                isAmPm ? SectionGroup.TimeAmPm : SectionGroup.Time24,
                parseTimeToString(time, isAmPm),
            );
        }

        if (newInputValue !== inputValue) {
            updateInputValue(newInputValue);
        }
    }, [date, time]);
}
