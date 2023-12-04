import classNames from "classnames";
import { format, isEqual, isSameDay, isWithinInterval } from "date-fns";
import { ReactElement } from "react";
import { DraggedDate } from "../types";
import { useDateTimeRange } from "./DateTimeRangeProvider";
import DashedBorder from "./DashedBorder";
import Highlighted from "./Highlighted";
import "./styles/DayCell.css";

interface FilledCellProps {
  day: Date;
}

function FilledCell({ day }: FilledCellProps): ReactElement {
  const {
    firstDate,
    secondDate,
    setDraggedDate,
    handleCellClick,
    setHoveredDate,
    shadowSelectedDate,
    isDragging,
    setIsDragging,
  } = useDateTimeRange();

  const isDateSelected = (date: Date) =>
    ((firstDate && isSameDay(date, firstDate)) ||
      (secondDate && isSameDay(date, secondDate))) &&
    date instanceof Date;

  const isToday = isSameDay(day, new Date());

  function getClassesForDay(): string {
    return classNames({
      "selected-cell": isDateSelected(day),
      "hover:cursor-grabbing": isDragging,
      "hover:cursor-grab": !isDragging && isDateSelected(day),
      "hover:cursor-pointer": !isDateSelected(day),
      "border border-gray-300 rounded-full": isToday,
      "border bg-blue-400/50 text-white":
        shadowSelectedDate && isSameDay(day, shadowSelectedDate),
    });
  }

  function getDayCellClasses(): string {
    return classNames(getClassesForDay(), {
      "group-hover:bg-blue-400 group-hover:border-none": isDateSelected(day),
      "group-hover:border group-hover:bg-blue-100/40 group-hover:border-gray-200":
        !isDateSelected(day),
      "group-hover:bg-blue-300/50":
        firstDate && secondDate && day > firstDate && day < secondDate,
    });
  }

  function handleMouseDown() {
    if (firstDate && isEqual(firstDate, day)) {
      setIsDragging(true);
      setDraggedDate(DraggedDate.First);
    } else if (secondDate && isEqual(secondDate, day)) {
      setIsDragging(true);
      setDraggedDate(DraggedDate.Second);
    }
  }

  function getCursorWhenDragging(): string {
    return isDragging ? "cursor-grabbing" : "";
  }

  return (
    <div
      data-testid="filled-cell"
      className={`flex-1 py-1 flex justify-center items-center group relative 
      ${getCursorWhenDragging()}`}
      onClick={() => handleCellClick(day)}
      onMouseEnter={() => setHoveredDate(day)}
      onMouseLeave={() => setHoveredDate(null)}
      onMouseDown={handleMouseDown}
    >
      <DashedBorder day={day} />
      <div
        className={`w-9 h-9 flex items-center justify-center text-xs
        transition-all rounded-full ${getDayCellClasses()} z-10 `}
      >
        <span>{format(day, "d")}</span>
      </div>
      <Highlighted day={day} />
    </div>
  );
}

export default FilledCell;
