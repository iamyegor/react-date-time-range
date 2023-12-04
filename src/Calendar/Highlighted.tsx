import classNames from "classnames";
import { endOfMonth, isEqual, isSaturday, isSunday } from "date-fns";
import { useDateTimeRange } from "./DateTimeRangeProvider";

const FIRST_DATE = "rounded-l-full left-2";
const SECOND_DATE = "rounded-r-full right-2";
const LEFT_EDGE = "rounded-l-full left-[0.3rem]";
const RIGHT_EDGE = "rounded-r-full right-[0.3rem]";

export default function Highlighted({ day }: { day: Date }) {
  const { firstDate, secondDate } = useDateTimeRange();
  let leftSideChanged = false;
  let rightSideChanged = false;

  function getHighlightedIfDayIsInRange() {
    let highlighted = "bg-blue-200/50 border-blue-400";
    if (firstDate && secondDate) {
      if (day >= firstDate && day <= secondDate) {
        return classNames(highlighted, getStylingsForDifferentDates());
      }
    }

    return "";
  }

  function getStylingsForDifferentDates() {
    let highlighted = "";
    highlighted = applyStylingForSelectedDates(highlighted);
    highlighted = applyStylingForEdgeDates(highlighted);
    highlighted = applySideOffsetsIfUnchanged(highlighted);
    return highlighted;
  }

  function applyStylingForSelectedDates(style: string) {
    if (firstDate && isEqual(day, firstDate)) {
      style = classNames(style, FIRST_DATE);
      leftSideChanged = true;
    }
    if (secondDate && isEqual(day, secondDate)) {
      style = classNames(style, SECOND_DATE);
      rightSideChanged = true;
    }
    return style;
  }

  function applyStylingForEdgeDates(style: string) {
    if (isSunday(day) || day.getDate() === 1) {
      style = classNames(style, LEFT_EDGE);
      leftSideChanged = true;
    }
    if (isSaturday(day) || day.getDate() === endOfMonth(day).getDate()) {
      style = classNames(style, RIGHT_EDGE);
      rightSideChanged = true;
    }
    return style;
  }

  function applySideOffsetsIfUnchanged(style: string) {
    if (!leftSideChanged) {
      style = classNames(style, "left-0");
    }
    if (!rightSideChanged) {
      style = classNames(style, "right-0");
    }
    return style;
  }

  return (
    <div
      className={`absolute top-[3px] bottom-[3px] flex items-center 
      justify-center ${getHighlightedIfDayIsInRange()}`}
    ></div>
  );
}
