import { useEffect } from "react";
import {
    extractPosition,
    getSameHighlight,
    getSectionValue,
} from "../utils/functions/sectionUtils.tsx";
import { sections, TIME_PLACEHOLDER_24, TIME_PLACEHOLDER_AMPM } from "../../globals.ts";
import ValueUpdater from "../utils/classes/ValueUpdater.tsx";
import { Time } from "../../types.tsx";

export default function useOnTimeUpdated(
    time: Time | null,
    value: string,
    isTimeInvalid: boolean,
    inputElement: HTMLInputElement | null,
    useAMPM: boolean,
    valueUpdater: ValueUpdater,
) {
    useEffect(() => {
        const timeSection: { start: number; end: number } = extractPosition(
            sections[3],
            useAMPM ? sections[5] : sections[4],
        );

        let newTimeValue: string;
        if (time) {
            const suffix: string = useAMPM ? ` ${time.ampm}` : "";
            const hours: string = time.hours.toString().padStart(2, "0");
            const minutes: string = time.minutes.toString().padStart(2, "0");

            newTimeValue = `${hours}:${minutes}${suffix}`;
        } else {
            const timeValue = getSectionValue(value, timeSection);

            if (timeValue && isTimeInvalid) {
                newTimeValue = timeValue;
            } else {
                newTimeValue = useAMPM ? TIME_PLACEHOLDER_AMPM : TIME_PLACEHOLDER_24;
            }
        }

        const hasSpaceBetweenDateAndTime = value[sections[2].end] === " ";
        const spaceOrEmpty = hasSpaceBetweenDateAndTime ? "" : " ";
        newTimeValue = `${spaceOrEmpty}${newTimeValue}`;

        valueUpdater.updateValue(timeSection, newTimeValue, getSameHighlight(inputElement));
    }, [time]);
}
