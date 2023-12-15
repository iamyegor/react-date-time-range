import { useAppSelector } from "../app/hooks";
import { selectFirstDate, selectSecondDate } from "../features/dateTimeRangeSlice";
import HighlightBase from "./HighlightBase";

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
