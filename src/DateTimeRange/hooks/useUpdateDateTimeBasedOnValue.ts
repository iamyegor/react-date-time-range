import { useEffect } from "react";
import { isValid } from "date-fns";
import { getDateTimePlaceholder } from "../../globals.ts";
import { extractSectionContentIn } from "../utils/functions/sectionUtils.tsx";
import { Time } from "../../types.tsx";
import { parseStringToTime } from "../utils/functions/timeParser.ts";
import { parseStringToDate } from "../utils/functions/dateParser.ts";
import { SectionGroup } from "../enums/sections.ts";

export default function useUpdateDateTimeBasedOnValue(
    value: string,
    isAmPm: boolean,
    updateDate: (newDate: Date | null) => void,
    updateTime: (newTime: Time | null) => void,
    setIsDateInvalid: (value: boolean) => void,
    setIsTimeInvalid: (value: boolean) => void,
) {
    useEffect(() => {
        const dateFromValue: Date | null = extractDateFrom(value);
        const timeFromValue: Time | null = extractTimeFrom(value);

        if (isValid(dateFromValue)) {
            updateDate(dateFromValue);
            setIsDateInvalid(false);
        } else {
            updateDate(null);
            setIsDateInvalid(!isValuePlaceholder());
        }

        if (timeFromValue) {
            updateTime(timeFromValue);
            setIsTimeInvalid(false);
        } else {
            updateTime(null);
            setIsTimeInvalid(!isValuePlaceholder());
        }
    }, [value]);

    function isValuePlaceholder() {
        return value === getDateTimePlaceholder(isAmPm);
    }

    function extractDateFrom(valueToExtractFrom: string): Date | null {
        const dateString: string = extractSectionContentIn(valueToExtractFrom, SectionGroup.Date);

        return parseStringToDate(dateString);
    }

    function extractTimeFrom(valueToExtractFrom: string): Time | null {
        const timeString: string = extractSectionContentIn(
            valueToExtractFrom,
            isAmPm ? SectionGroup.Time24 : SectionGroup.TimeAmPm,
        );

        return parseStringToTime(timeString);
    }
}
