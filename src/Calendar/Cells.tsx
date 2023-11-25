import classNames from "classnames";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ReactElement, useMemo } from "react";
import "./styles/Cells.css";

const DAYS_IN_A_WEEK = 7;

interface CellsProps {
  currentMonth: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

interface GetClassesForDayProps {
  day: Date;
  currentMonth: Date;
}

function Cells({
  currentMonth,
  selectedDate: selectedDate,
  onDateSelect,
}: CellsProps): ReactElement {
  const rows = useMemo(
    () => generateWeeks(currentMonth),
    [currentMonth, selectedDate]
  );

  function getClassesForDay({
    day,
    currentMonth,
  }: GetClassesForDayProps): string {
    const monthStart = startOfMonth(currentMonth);
    const isDaySameMonth = isSameMonth(day, monthStart);
    const isToday = isSameDay(day, new Date());
    const isSelected = selectedDate && isSameDay(day, selectedDate);

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
    const formattedDate = format(day, dateFormat);
    let classes = getClassesForDay({ day, currentMonth });

    if (classes.includes("selected-cell")) {
      classes = classNames(
        classes,
        "group-hover:bg-blue-400 group-hover:border-none"
      );
    }

    return (
      <div
        className="flex-1 py-1 flex justify-center items-center 
        hover:cursor-pointer group"
        key={day.toDateString()}
        onClick={() => onDateSelect(day)}
      >
        <div
          className={`w-8 h-8 flex items-center justify-center text-xs 
          group-hover:border group-hover:bg-blue-200/50 rounded-full
          group-hover:border-gray-400 ${classes} group-ho`}
        >
          <span>{formattedDate}</span>
        </div>
      </div>
    );
  }

  return <div className="flex-shrink-0 w-full">{rows}</div>;
}

export default Cells;
