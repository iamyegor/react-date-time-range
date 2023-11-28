import classNames from "classnames";
import { addDays, endOfMonth, isEqual, isSunday, isSaturday } from "date-fns";

export default function DashedBorder({
  firstDate,
  secondDate,
  hoveredDate,
  day,
}: {
  firstDate: Date | null;
  secondDate: Date | null;
  hoveredDate: Date | null;
  day: Date;
}) {
  function getDashedBorder(): string {
    let dashedBorder = "border-dashed border-t-2 border-b-2 border-gray-300";

    if (firstDate && hoveredDate) {
      const comparisonDate = secondDate || firstDate;
      if (day > comparisonDate && day <= hoveredDate) {
        return getBorderStyling(dashedBorder);
      }
    }

    return "";
  }

  function getBorderStyling(dottedBorder: string): string {
    if (isSunday(day) || day.getDate() === 1) {
      dottedBorder = classNames(
        dottedBorder,
        "border-l-2 rounded-l-full left-[6px]"
      );
    }
    if (
      isSaturday(day) ||
      day.getDate() === endOfMonth(day).getDate() ||
      (hoveredDate && isEqual(hoveredDate, day))
    ) {
      dottedBorder = classNames(
        dottedBorder,
        "border-r-2 rounded-r-full right-[6px]"
      );
    }
    if (
      (secondDate && isEqual(day, addDays(secondDate, 1))) ||
      (firstDate && isEqual(day, addDays(firstDate, 1)))
    ) {
      dottedBorder = classNames(dottedBorder, "-left-7 rounded-l");
    }
    return dottedBorder;
  }

  return (
    <div
      className={`absolute top-[3px] left-[1px] bottom-[3px] right-[1px] 
        flex items-center justify-center ${getDashedBorder()}`}
    ></div>
  );
}
