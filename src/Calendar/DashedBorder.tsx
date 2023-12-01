import classNames from "classnames";
import {
  addDays,
  endOfMonth,
  isEqual,
  isSameMonth,
  isSaturday,
  isSunday,
  startOfMonth,
  subDays,
} from "date-fns";
import { ActiveInput } from "../types";
import { useCalendar } from "./CalendarProvider";

const BORDER_DASHED = "border-dashed border-t-2 border-b-2 border-gray-300";
const BORDER_LEFT = "border-l-2 rounded-l-full left-[6px]";
const BORDER_RIGHT = "border-r-2 rounded-r-full right-[6px]";
const BORDER_LENGTHENED_LEFT = "-left-6";
const BORDER_LENGTHENED_RIGHT = "-right-6";

export default function DashedBorder({ day }: { day: Date }) {
  const { firstDate, secondDate, hoveredDate, activeInput } = useCalendar();

  function shouldApplyDashedBorder() {
    if (!firstDate || !hoveredDate || !(secondDate || firstDate)) {
      return false;
    }

    if (activeInput === ActiveInput.First) {
      if (!secondDate) {
        return false;
      }
      return day < firstDate && day >= hoveredDate;
    } else {
      const comparisonDate = secondDate || firstDate;
      return day > comparisonDate && day <= hoveredDate;
    }
  }

  function getLeftBorderStyling() {
    const isThisDayHovered = hoveredDate && isEqual(hoveredDate, day);

    if (
      isSunday(day) ||
      isEqual(day, startOfMonth(day)) ||
      (activeInput === ActiveInput.First && isThisDayHovered)
    ) {
      return BORDER_LEFT;
    }
    return "";
  }

  function getRightBorderStyling() {
    const isThisDayHovered = hoveredDate && isEqual(hoveredDate, day);
    console.log(day);
    console.log(endOfMonth(day));

    if (
      isSaturday(day) ||
      day.getDate() === endOfMonth(day).getDate() ||
      (activeInput === ActiveInput.Second && isThisDayHovered)
    ) {
      return BORDER_RIGHT;
    }
    return "";
  }

  function getLengthenedLeftBorder() {
    if (
      (secondDate && isNextDay(secondDate)) ||
      (firstDate && isNextDay(firstDate))
    ) {
      return BORDER_LENGTHENED_LEFT;
    }
    return "left-[1px]";
  }

  function getLengthenedRightBorder() {
    const dayBeforeFirstDate = firstDate && isEqual(day, subDays(firstDate, 1));

    if (dayBeforeFirstDate) {
      return BORDER_LENGTHENED_RIGHT;
    }
    return "right-[1px]";
  }

  function isNextDay(date: Date) {
    return (
      isEqual(day, addDays(date, 1)) && isSameMonth(day, date) && !isSunday(day)
    );
  }

  function getDashedBorder() {
    if (!shouldApplyDashedBorder()) {
      return "";
    }

    let borderStyle = BORDER_DASHED;
    borderStyle = classNames(borderStyle, getLeftBorderStyling());
    borderStyle = classNames(borderStyle, getRightBorderStyling());
    borderStyle = classNames(borderStyle, getLengthenedRightBorder());
    borderStyle = classNames(borderStyle, getLengthenedLeftBorder());

    return borderStyle;
  }

  return (
    <div
      className={`absolute top-[3px] bottom-[3px] right-[1px] 
        flex items-center justify-center ${getDashedBorder()}`}
    ></div>
  );
}
