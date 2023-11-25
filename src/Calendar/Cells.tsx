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
import { ReactElement, useMemo, useState } from "react";

const DAYS_IN_A_WEEK = 7;

interface CellsProps {
  currentMonth: Date;
}

interface GetClassesForDayProps {
  day: Date;
  currentMonth: Date;
}

function Cells({ currentMonth }: CellsProps): ReactElement {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const rows = useMemo(
    () => generateWeeks(currentMonth),
    [currentMonth, selectedDate]
  );

  function getClassesForDay({
    day,
    currentMonth,
  }: GetClassesForDayProps): string {
    const monthStart = startOfMonth(currentMonth);
    const dayIsSameMonth = isSameMonth(day, monthStart);
    const dayIsToday = isSameDay(day, new Date());
    const isDaySelected = isSameDay(day, selectedDate);

    if (!dayIsSameMonth) return "text-gray-400";
    if (isDaySelected) return "bg-blue-500 text-white rounded-full";
    if (dayIsToday) return "border border-gray-400 rounded-full";
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
    return (
      <div
        className="flex-1 py-1 flex justify-center items-center hover:cursor-pointer"
        key={day.toDateString()}
        onClick={() => setSelectedDate(day)}
      >
        <div
          className={`w-8 h-8 flex items-center justify-center text-xs ${getClassesForDay(
            { day, currentMonth }
          )}`}
        >
          <span>{formattedDate}</span>
        </div>
      </div>
    );
  }

  return <div className="flex-shrink-0 w-full">{rows}</div>;
}

export default Cells;
