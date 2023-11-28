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
import Highlighted from "./Highlighted";

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
      dottedBorder = classNames(dottedBorder, "-left-2");
    }
    return dottedBorder;
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
      dashedBorder={getDashedBorder()}
      highlighted={
        <Highlighted firstDate={firstDate} secondDate={secondDate} day={day} />
      }
      classes={classes}
      formattedDate={formattedDate}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}

export default DayCell;
