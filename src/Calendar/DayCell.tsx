import classNames from "classnames";
import {
  addDays,
  endOfMonth,
  format,
  isEqual,
  isSameMonth,
  isSaturday,
  isSunday,
} from "date-fns";
import { ReactElement } from "react";
import EmptyCell from "./EmptyCell";
import FilledCell from "./FilledCell";
import "./styles/DayCell.css";

interface DayCellProps {
  day: Date;
  currentMonth: Date;
  firstDate: Date | null;
  secondDate: Date | null;
  hoveredDate: Date | null;
  onCellClick: (day: Date) => void;
  onHover: (day: Date | null) => void;
  getClassesForDay: (props: { day: Date; currentMonth: Date }) => string;
}

function DayCell({
  day,
  currentMonth,
  firstDate,
  secondDate,
  hoveredDate,
  onCellClick,
  onHover,
  getClassesForDay,
}: DayCellProps): ReactElement {
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

  function getDottedBorder(): string {
    let dottedBorder = "border-dotted border-t-2 border-b-2 border-gray-400";
    let hasDottedBorder = false;

    if (firstDate && hoveredDate) {
      const comparisonDate = secondDate || firstDate;
      if (day > comparisonDate && day <= hoveredDate) {
        hasDottedBorder = true;
      }
    }

    if (!hasDottedBorder) {
      return "";
    }

    return applyBorderStyling(dottedBorder);
  }

  function applyBorderStyling(dottedBorder: string): string {
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
      dottedBorder = classNames(dottedBorder, "-left-2");
    }
    return dottedBorder;
  }

  const formattedDate = format(day, "d");
  const classes = getDayCellClasses();
  const dottedBorder = getDottedBorder();

  const handleClick = () => onCellClick(day);
  const handleMouseEnter = () => onHover(day);
  const handleMouseLeave = () => onHover(null);

  if (!isSameMonth(day, currentMonth)) {
    return <EmptyCell />;
  }

  return (
    <FilledCell
      dottedBorder={dottedBorder}
      classes={classes}
      formattedDate={formattedDate}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}

export default DayCell;
