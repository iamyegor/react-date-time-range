import { useDateTimeRange } from "./DateTimeRangeProvider";
import HighlightBase from "./HighlightBase";

export default function Highlight({ day }: { day: Date }) {
  const { firstDate, secondDate } = useDateTimeRange();

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
