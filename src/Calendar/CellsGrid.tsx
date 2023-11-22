import React from "react";
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

interface CellsGridProps {
  currentMonth: Date;
}

function CellsGrid({ currentMonth }: CellsGridProps) {
  const monthStart = startOfMonth(currentMonth);
  const endDate = endOfWeek(endOfMonth(monthStart));

  function generateMonthRows() {
    let rows = [];
    let day = startOfWeek(monthStart);

    while (day <= endDate) {
      const days = generateWeekDays(day);
      rows.push(
        <div className="flex flex-row justify-between" key={day.toString()}>
          {days}
        </div>
      );
      day = addDays(day, 7);
    }

    return rows;
  }

  function generateWeekDays(startDay: Date) {
    let days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = addDays(startDay, i);
      days.push(renderDayCell(currentDay));
    }
    return days;
  }

  function renderDayCell(day: Date) {
    const dayNumber = format(day, "d");
    const isCurrentMonth = isSameMonth(day, monthStart);
    const isToday = isSameDay(day, new Date());

    return (
      <div
        className={`w-full h-12 flex justify-center items-center ${
          isCurrentMonth ? "bg-white" : "bg-gray-200"
        } ${
          isToday ? "text-white bg-green-500" : "text-gray-700"
        } rounded-full`}
        key={day.toDateString()}
      >
        <span>{isCurrentMonth ? dayNumber : ""}</span>
      </div>
    );
  }

  return <div className="grid grid-cols-7 gap-1">{generateMonthRows()}</div>;
}

export default CellsGrid;
