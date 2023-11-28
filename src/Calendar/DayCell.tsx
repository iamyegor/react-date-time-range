import classNames from "classnames";
import {
  format,
  isSameMonth
} from "date-fns";
import { ReactElement } from "react";
import DashedBorder from "./DashedBorder";
import EmptyCell from "./EmptyCell";
import FilledCell from "./FilledCell";
import Highlighted from "./Highlighted";
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
    />
  );
}

export default DayCell;
