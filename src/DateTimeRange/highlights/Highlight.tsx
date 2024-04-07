import { useAppSelector } from "../../redux/hooks.ts";
import { selectFirstDate, selectSecondDate } from "../../redux/dateTimeRangeSlice.ts";
import HighlightBase from "./HighlightBase.tsx";

export default function Highlight({ day }: { day: Date }) {
    const firstDate = useAppSelector(selectFirstDate);
    const secondDate = useAppSelector(selectSecondDate);

    return (
        firstDate &&
        secondDate && (
            <HighlightBase
                day={day}
                stylingClasses="bg-blue-200/50 border-blue-400"
                start={firstDate}
                end={secondDate}
                testid={"highlight-between-dates"}
            />
        )
    );
}
