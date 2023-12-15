import classNames from "classnames";
import {
  addDays,
  endOfMonth,
  isEqual,
  isSaturday,
  isSunday,
  startOfMonth,
  subDays,
} from "date-fns";
import { useAppSelector } from "../app/hooks";
import {
  selectActiveInput,
  selectDashedBorderDirection,
  selectEdgeSelectedDate,
  selectFirstDate,
  selectHoveredDate,
  selectIsDragging,
  selectMaxDate,
  selectMinDate,
  selectSecondDate,
} from "../features/dateTimeRangeSlice";
import { ActiveInput, DashedBorderDirection } from "../types";

const BORDER_DASHED = "border-dashed border-t-2 border-b-2 border-gray-300";
const BORDER_LEFT = "border-l-2 rounded-l-full left-[6px]";
const BORDER_RIGHT = "border-r-2 rounded-r-full right-[6px]";
const BORDER_LENGTHENED_LEFT = "-left-6";
const BORDER_LENGTHENED_RIGHT = "-right-6";

export default function DashedBorder({ day }: { day: Date }) {
  const firstDate = useAppSelector(selectFirstDate);
  const secondDate = useAppSelector(selectSecondDate);
  const hoveredDate = useAppSelector(selectHoveredDate);
  const activeInput = useAppSelector(selectActiveInput);
  const isDragging = useAppSelector(selectIsDragging);
  const edgeSelectedDate = useAppSelector(selectEdgeSelectedDate);
  const dashedBorderDirection = useAppSelector(selectDashedBorderDirection);
  const minDate = useAppSelector(selectMinDate);
  const maxDate = useAppSelector(selectMaxDate);

  function isDisabled() {
    if (hoveredDate) {
      return (
        (minDate && hoveredDate < minDate) || (maxDate && hoveredDate > maxDate)
      );
    }
  }

  function shouldApplyDashedBorder() {
    if (!hoveredDate || isDragging || !edgeSelectedDate || isDisabled()) {
      return false;
    }

    if (
      (dashedBorderDirection === DashedBorderDirection.Left && !secondDate) ||
      (dashedBorderDirection === DashedBorderDirection.Right && !firstDate)
    ) {
      return false;
    }

    if (dashedBorderDirection === DashedBorderDirection.Left) {
      if (day < edgeSelectedDate && day >= hoveredDate) {
        return true;
      }
    } else if (dashedBorderDirection === DashedBorderDirection.Right) {
      if (day > edgeSelectedDate && day <= hoveredDate) {
        return true;
      }
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
    if (edgeSelectedDate) {
      if (dashedBorderDirection === DashedBorderDirection.Right) {
        if (isEqual(day, addDays(edgeSelectedDate, 1))) {
          return BORDER_LENGTHENED_LEFT;
        }
      }
    }
    return "left-[1px]";
  }

  function getLengthenedRightBorder() {
    if (edgeSelectedDate) {
      if (dashedBorderDirection === DashedBorderDirection.Left) {
        if (isEqual(day, subDays(edgeSelectedDate, 1))) {
          return BORDER_LENGTHENED_RIGHT;
        }
      }
    }
    return "right-[1px]";
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
      className={`absolute top-[3px] bottom-[3px]  
        flex items-center justify-center ${getDashedBorder()}`}
      data-testid={`${
        shouldApplyDashedBorder() ? "dashed-border" : "no-dashed-border"
      }`}
    ></div>
  );
}
