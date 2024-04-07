import { useEffect } from "react";
import { Time } from "../../../types.tsx";
import { parseTimeToString } from "../utils/timeParser.ts";
import { SectionGroup } from "../enums/Section.ts";
import { updateSectionGroupIn } from "../utils/sectionUpdater.ts";

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

        const newValue: string | null = updateSectionGroupIn(
            currentInputValue,
            isAmPm ? SectionGroup.TimeAmPm : SectionGroup.Time24,
            parseTimeToString(time, isAmPm),
        );

        if (newValue) {
            updateInputValue(newValue);
        }
    }, [time]);
}
