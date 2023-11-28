import classNames from "classnames";
import { endOfMonth, isEqual, isSaturday, isSunday } from "date-fns";

export default function Highlighted({
  firstDate,
  secondDate,
  day,
}: {
  firstDate: Date | null;
  secondDate: Date | null;
  day: Date;
}) {
  function getHighlighted() {
    const highlighted = "bg-blue-200/50 border-blue-400";
    if (firstDate && secondDate) {
      if (day >= firstDate && day <= secondDate) {
        return getHighlightedStyling(highlighted);
      }
    }

    return "";
  }

  function getHighlightedStyling(highlighted: string) {
    if (
      (firstDate && isEqual(day, firstDate)) ||
      isSunday(day) ||
      day.getDate() === 1
    ) {
      highlighted = classNames(highlighted, "rounded-l-full left-2");
    }
    if (
      (secondDate && isEqual(day, secondDate)) ||
      isSaturday(day) ||
      day.getDate() === endOfMonth(day).getDate()
    ) {
      highlighted = classNames(highlighted, "rounded-r-full right-2");
    }

    return highlighted;
  }

  return (
    <div
      className={`absolute top-[3px] left-0 bottom-[3px] right-0
        flex items-center justify-center ${getHighlighted()}`}
    ></div>
  );
}
