import classNames from "classnames";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isMonday,
  isSameDay,
  isSameMonth,
  isSaturday,
  isSunday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ReactElement, useMemo, useState } from "react";
import "./styles/Cells.css";

const DAYS_IN_A_WEEK = 7;

interface CellsProps {
  currentMonth: Date;
  firstDate: Date | null;
  onFirstDateSelect: (date: Date) => void;
  secondDate: Date | null;
  onSecondDateSelect: (date: Date) => void;
}

interface GetClassesForDayProps {
  day: Date;
  currentMonth: Date;
}

function Cells({
  currentMonth,
  firstDate,
  onFirstDateSelect,
  secondDate,
  onSecondDateSelect,
}: CellsProps): ReactElement {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const rows = generateWeeks(currentMonth);

  function getClassesForDay({
    day,
    currentMonth,
  }: GetClassesForDayProps): string {
    const monthStart = startOfMonth(currentMonth);
    const isDaySameMonth = isSameMonth(day, monthStart);
    const isToday = isSameDay(day, new Date());
    let isSelected = firstDate && isSameDay(day, firstDate);
    if (!isSelected) {
      isSelected = secondDate && isSameDay(day, secondDate);
    }

    if (!isDaySameMonth) return "text-gray-400";
    if (isSelected) return "selected-cell";
    if (isToday) return "border border-gray-400 rounded-full";
    return "";
  }

  function generateWeeks(currentMonth: Date): ReactElement[] {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    let weeks: ReactElement[] = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      weeks.push(generateWeek(currentDate, currentMonth));
      currentDate = addDays(currentDate, DAYS_IN_A_WEEK);
    }
    return weeks;
  }

  function generateWeek(startOfWeek: Date, currentMonth: Date): ReactElement {
    const dateFormat = "d";
    let days: ReactElement[] = [];
    let currentDay = startOfWeek;

    for (let i = 0; i < DAYS_IN_A_WEEK; i++) {
      days.push(renderDay(currentDay, currentMonth, dateFormat));
      currentDay = addDays(currentDay, 1);
    }

    return (
      <div className="flex" key={currentDay.toDateString()}>
        {days}
      </div>
    );
  }

  function renderDay(
    day: Date,
    currentMonth: Date,
    dateFormat: string
  ): ReactElement {
    const isDaySameMonth = isSameMonth(day, startOfMonth(currentMonth));

    if (!isDaySameMonth) {
      return renderEmptyCell();
    }

    let classes = getClassesForDay({ day, currentMonth });

    if (classes.includes("selected-cell")) {
      classes = classNames(
        classes,
        "group-hover:bg-blue-400 group-hover:border-none"
      );
    }

    const formattedDate = format(day, dateFormat);

    let dottedBorder = "border-dotted border-t-2 border-b-2 border-gray-400";
    let hasDottedBorder = false;
    if (firstDate && hoveredDate) {
      if (secondDate) {
        if (day > secondDate && day <= hoveredDate) {
          hasDottedBorder = true;
        }
      } else {
        if (day > firstDate && day <= hoveredDate) {
          hasDottedBorder = true;
        }
      }
    }

    if (hasDottedBorder) {
      if (isSunday(day)) {
        dottedBorder = classNames(
          dottedBorder,
          "border-l-2 rounded-l-full left-[6px]"
        );
      } else if (isSaturday(day)) {
        dottedBorder = classNames(
          dottedBorder,
          "border-r-2 rounded-r-full right-[6px]"
        );
      }
      if (day.getDate() === 1) {
        dottedBorder = classNames(
          dottedBorder,
          "border-l-2 rounded-l-full left-[6px]"
        );
      }
      if (day.getDate() === endOfMonth(day).getDate()) {
        dottedBorder = classNames(
          dottedBorder,
          "border-r-2 rounded-r-full right-[6px]"
        );
      }
      if (hoveredDate?.toDateString() === day.toDateString()) {
        dottedBorder = classNames(
          dottedBorder,
          "border-r-2 rounded-r-full right-[6px]"
        );
      }
    }

    return (
      <div
        data-testid="filled-cell"
        className="flex-1 py-1 flex justify-center items-center 
        hover:cursor-pointer group relative"
        onClick={() => handleCellClick(day)}
        key={day.toDateString()}
        onMouseEnter={() => setHoveredDate(day)}
        onMouseLeave={() => setHoveredDate(null)}
      >
        <div
          className={`absolute top-[3px] left-[1px] bottom-[3px] right-[1px] 
          flex items-center justify-center ${
            hasDottedBorder ? dottedBorder : ""
          }`}
        ></div>
        <div
          className={`w-8 h-8 flex items-center justify-center text-xs 
          group-hover:border group-hover:bg-blue-200/50 rounded-full
          group-hover:border-gray-400 ${classes}`}
        >
          <span>{formattedDate}</span>
        </div>
      </div>
    );
  }

  function renderEmptyCell() {
    return (
      <div data-testid="empty-cell" className="flex-1 py-1">
        <div className="w-8 h-8" />
      </div>
    );
  }

  function handleCellClick(day: Date) {
    if (firstDate) {
      onSecondDateSelect(day);
    } else {
      onFirstDateSelect(day);
    }
  }

  return <div className="flex-shrink-0 w-full">{rows}</div>;
}

export default Cells;
