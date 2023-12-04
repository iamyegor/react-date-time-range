import { ActiveInput } from "../types";
import { useDateTimeRange } from "./DateTimeRangeProvider";
import HighlightBase from "./HighlightBase";

export default function HoverHighlight({ day }: { day: Date }) {
  const { firstDate, secondDate, hoveredDate, activeInput } =
    useDateTimeRange();
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
