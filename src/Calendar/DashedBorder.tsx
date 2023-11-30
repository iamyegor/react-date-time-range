import classNames from "classnames";
import {
  addDays,
  endOfMonth,
  isEqual,
  isSameMonth,
  isSaturday,
  isSunday,
} from "date-fns";
import { useCalendar } from "./CalendarProvider";

const BORDER_DASHED = "border-dashed border-t-2 border-b-2 border-gray-300";
const BORDER_LEFT = "border-l-2 rounded-l-full left-[6px]";
const BORDER_RIGHT = "border-r-2 rounded-r-full right-[6px]";
const BORDER_LENGTHENED_LEFT = "-left-6";

export default function DashedBorder({ day }: { day: Date }) {
  const { firstDate, secondDate, hoveredDate } = useCalendar();

  function shouldApplyDashedBorder(): boolean {
    if (!firstDate || !hoveredDate || !(secondDate || firstDate)) {
      return false;
    }

    const comparisonDate = secondDate || firstDate;
    return day > comparisonDate && day <= hoveredDate;
  }

  function getLeftBorderStyling(borderStyle: string): string {
    return isSunday(day) || day.getDate() === 1
      ? classNames(borderStyle, BORDER_LEFT)
      : borderStyle;
  }

  function getRightBorderStyling(borderStyle: string): string {
    return isSaturday(day) ||
      day.getDate() === endOfMonth(day).getDate() ||
      (hoveredDate && isEqual(hoveredDate, day))
      ? classNames(borderStyle, BORDER_RIGHT)
      : borderStyle;
  }

  function getAdjustedLeftBorder(borderStyle: string): string {
    return (secondDate && isNextDay(secondDate)) ||
      (firstDate && isNextDay(firstDate))
      ? classNames(borderStyle, BORDER_LENGTHENED_LEFT)
      : classNames(borderStyle, "left-[1px]");
  }

  function isNextDay(date: Date): boolean {
    return (
      isEqual(day, addDays(date, 1)) && isSameMonth(day, date) && !isSunday(day)
    );
  }

  function getDashedBorder(): string {
    if (!shouldApplyDashedBorder()) {
      return "";
    }

    let borderStyle = BORDER_DASHED;
    borderStyle = getLeftBorderStyling(borderStyle);
    borderStyle = getRightBorderStyling(borderStyle);
    borderStyle = getAdjustedLeftBorder(borderStyle);

    return borderStyle;
  }

  return (
    <div
      className={`absolute top-[3px] bottom-[3px] right-[1px] 
        flex items-center justify-center ${getDashedBorder()}`}
    ></div>
  );
}
