import classNames from "classnames";
import { format, isEqual, isSameDay } from "date-fns";
import { ReactElement } from "react";
import { DraggedDate } from "../types";
import { useCalendar } from "./CalendarProvider";
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
    draggedDate,
    setDraggedDate,
    handleCellClick,
    setHoveredDate,
  } = useCalendar();

  const isDateSelected = (date: Date) =>
    ((firstDate && isSameDay(date, firstDate)) ||
      (secondDate && isSameDay(date, secondDate))) &&
    date instanceof Date;

  const isToday = isSameDay(day, new Date());

  function getClassesForDay(): string {
    return classNames({
      "cursor-grabbing": draggedDate != DraggedDate.None,
      "selected-cell cursor-grab": isDateSelected(day),
      "border border-gray-300 rounded-full": isToday,
    });
  }

  function getDayCellClasses(): string {
    return classNames(getClassesForDay(), {
      "group-hover:bg-blue-400 group-hover:border-none":
        isDateSelected(day) && day instanceof Date,
    });
  }

  function handleMouseDown() {
    if (firstDate && isEqual(firstDate, day)) {
      setDraggedDate(DraggedDate.First);
    } else if (secondDate && isEqual(secondDate, day)) {
      setDraggedDate(DraggedDate.Second);
    }
  }

  return (
    <div
      data-testid="filled-cell"
      className="flex-1 py-1 flex justify-center items-center group relative"
      onClick={() => handleCellClick(day)}
      onMouseEnter={() => setHoveredDate(day)}
      onMouseLeave={() => setHoveredDate(null)}
      onMouseDown={handleMouseDown}
      onMouseUp={() => setDraggedDate(DraggedDate.None)}
    >
      <DashedBorder day={day} />
      <div
        className={`w-9 h-9 flex items-center justify-center text-xs
        hover:cursor-pointer group-hover:border group-hover:bg-blue-200/50
        rounded-full group-hover:border-gray-400 ${getDayCellClasses()} z-10 `}
      >
        <span>{format(day, "d")}</span>
      </div>
      <Highlighted day={day} />
    </div>
  );
}

export default FilledCell;
