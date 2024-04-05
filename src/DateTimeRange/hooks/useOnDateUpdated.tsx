import { useEffect } from "react";
import {
    extractPosition,
    getSameHighlight,
    getSectionValue,
} from "../utils/functions/sectionUtils.tsx";
import { DATE_PLACEHOLDER, sections } from "../../globals.ts";
import ValueUpdater from "../utils/classes/ValueUpdater.tsx";

export default function useOnDateUpdated(
    date: Date | null,
    value: string,
    isDateInvalid: boolean,
    valueUpdater: ValueUpdater,
    inputElement: HTMLInputElement | null,
) {
    useEffect(() => {
        const dateSection: { start: number; end: number } = extractPosition(
            sections[0],
            sections[2],
        );

        let newDateValue: string;
        if (date) {
            const month: string = (date.getMonth() + 1).toString().padStart(2, "0");
            const day: string = date.getDate().toString().padStart(2, "0");
            const year: string = date.getFullYear().toString().padStart(4, "0");

            newDateValue = `${month}/${day}/${year}`;
        } else {
            const dateValue: string = getSectionValue(value, dateSection);

            if (dateValue && isDateInvalid) {
                newDateValue = dateValue;
            } else {
                newDateValue = DATE_PLACEHOLDER;
            }
        }

        valueUpdater.updateValue(dateSection, newDateValue, getSameHighlight(inputElement));
    }, [date]);
}
