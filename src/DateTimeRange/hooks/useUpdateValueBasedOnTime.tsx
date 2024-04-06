import { useEffect } from "react";
import { Time } from "../../types.tsx";
import { SectionGroup, updateSectionIn } from "../utils/functions/updateSectionIn.ts";
import { parseTimeToString } from "../utils/functions/dateTimeParser.ts";

export default function useUpdateValueBasedOnTime(
    time: Time | null,
    currentInputValue: string,
    updateInputValue: (newValue: string) => void,
    isAmPm: boolean,
) {
    useEffect(() => {
        if (!time) {
            return;
        }

        const newValue: string | null = updateSectionIn(
            currentInputValue,
            isAmPm ? SectionGroup.TimeAmPm : SectionGroup.Time24,
            parseTimeToString(time, isAmPm),
        );

        if (newValue) {
            updateInputValue(newValue);
        }
    }, [time]);
}
