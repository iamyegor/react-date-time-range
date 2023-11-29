import classNames from "classnames";
import {
  format,
  isEqual,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { ReactElement } from "react";
import DashedBorder from "./DashedBorder";
import EmptyCell from "./EmptyCell";
import FilledCell from "./FilledCell";
import Highlighted from "./Highlighted";
import "./styles/DayCell.css";
import { DraggedDate } from "../types";
import { useCalendar } from "./CalendarProvider";

interface DayCellProps {
  day: Date;
  currentMonth: Date;
  firstDate: Date | null;
  secondDate: Date | null;
  hoveredDate: Date | null;
  onCellClick: (day: Date) => void;
  onHover: (day: Date | null) => void;
}

function DayCell({
  day,
  currentMonth,
  firstDate,
  secondDate,
  hoveredDate,
  onCellClick,
  onHover,
}: DayCellProps): ReactElement {
  const { draggedDate, setDraggedDate } = useCalendar();

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

  const formattedDate = format(day, "d");
  const classes = getDayCellClasses();

  const handleClick = () => onCellClick(day);
  const handleMouseEnter = () => onHover(day);
  const handleMouseLeave = () => onHover(null);

  if (!isSameMonth(day, currentMonth)) {
    return <EmptyCell />;
  }

  return (
    <FilledCell
      dashedBorder={
        <DashedBorder
          firstDate={firstDate}
          secondDate={secondDate}
          hoveredDate={hoveredDate}
          day={day}
        />
      }
      highlighted={
        <Highlighted firstDate={firstDate} secondDate={secondDate} day={day} />
      }
      classes={classes}
      formattedDate={formattedDate}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      handleDateDrag={() => {
        if (firstDate && isEqual(firstDate, day)) {
          console.log(setDraggedDate);
          setDraggedDate(DraggedDate.First);
        } else if (secondDate && isEqual(secondDate, day)) {
          setDraggedDate(DraggedDate.Second);
        }
      }}
      handleDateRelease={() => setDraggedDate(DraggedDate.None)}
    />
  );
}

export default DayCell;
