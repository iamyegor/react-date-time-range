import { useAppSelector } from "../app/hooks";
import {
    selectActiveInput,
    selectFirstDate,
    selectHoveredDate,
    selectSecondDate,
} from "../features/dateTimeRangeSlice";
import { ActiveInput } from "../types";
import HighlightBase from "./HighlightBase";

export default function HoverHighlight({ day }: { day: Date }) {
    const firstDate = useAppSelector(selectFirstDate);
    const secondDate = useAppSelector(selectSecondDate);
    const hoveredDate = useAppSelector(selectHoveredDate);
    const activeInput = useAppSelector(selectActiveInput);

    let startDate = null;
    let endDate = null;

    if (activeInput === ActiveInput.First) {
        endDate = secondDate;
        if (hoveredDate && firstDate) {
            startDate = hoveredDate >= firstDate ? hoveredDate : null;
        }
    } else if (activeInput === ActiveInput.Second) {
        startDate = firstDate;
        if (hoveredDate && secondDate) {
            endDate = hoveredDate <= secondDate ? hoveredDate : null;
        }
    }

    return (
        startDate &&
        endDate && (
            <HighlightBase
                day={day}
                stylingClasses="bg-blue-400/50 border-blue-400"
                start={startDate}
                end={endDate}
            />
        )
    );
}
