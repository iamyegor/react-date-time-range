import classNames from "classnames";
import {
  format,
  isEqual,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { ReactElement } from "react";
import { DraggedDate } from "../types";
import { useCalendar } from "./CalendarProvider";
import DashedBorder from "./DashedBorder";
import Highlighted from "./Highlighted";

interface FilledCellProps {
  day: Date;
}

function FilledCell({ day }: FilledCellProps): ReactElement {
  const {
    firstDate,
    secondDate,
    draggedDate,
    setDraggedDate,
    currentMonth,
    handleCellClick,
    setHoveredDate,
  } = useCalendar();

  function getClassesForDay({
    day,
    currentMonth,
  }: {
    day: Date;
    currentMonth: Date;
  }): string {
    const monthStart = startOfMonth(currentMonth);
    let className = "";

    if (draggedDate != DraggedDate.None) {
      className = "cursor-grabbing";
    }

    if (!isSameMonth(day, monthStart)) {
      return classNames("text-gray-400", className);
    } else if (
      (firstDate && isSameDay(day, firstDate)) ||
      (secondDate && isSameDay(day, secondDate))
    ) {
      return classNames("selected-cell cursor-grab", className);
    } else if (isSameDay(day, new Date())) {
      return classNames("border border-gray-300 rounded-full", className);
    }

    return className;
  }

  function getDayCellClasses(): string {
    let classes = getClassesForDay({ day, currentMonth });

    if (classes.includes("selected-cell")) {
      classes = classNames(
        classes,
        "group-hover:bg-blue-400 group-hover:border-none"
      );
    }

    return classes;
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
      onMouseDown={() => handleMouseDown()}
      onMouseUp={() => setDraggedDate(DraggedDate.None)}
    >
      <DashedBorder day={day} />
      <div
        className={`w-8 h-8 flex items-center justify-center text-xs 
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
