import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useState } from "react";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="flex justify-between items-center py-2 px-4">
        <div className="cursor-pointer" onClick={onPrevMonthClick}>
          &lt;
        </div>
        <div>
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className="cursor-pointer" onClick={onNextMonthClick}>
          &gt;
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEEEEE";
    const days = [];
    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          className="flex-1 py-2 text-center uppercase font-semibold text-sm"
          key={i}
        >
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="flex">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);

        days.push(
          <div
            className={`flex-1 py-1 flex justify-center items-center`}
            key={day.toDateString()}
          >
            <div
              className={`w-9 h-9 flex items-center justify-center ${getClassesFor(
                day
              )}`}
            >
              <span>{formattedDate}</span>
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="flex" key={day.toDateString()}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="flex-1">{rows}</div>;
  };

  function getClassesFor(day: Date) {
    const monthStart = startOfMonth(currentMonth);
    const dayIsSameMonth = isSameMonth(day, monthStart);
    const dayIsToday = isSameDay(day, new Date());

    if (!dayIsSameMonth) {
      return "text-gray-400";
    } else if (dayIsToday) {
      return "bg-blue-500 text-white rounded-full";
    } else {
      return "text-gray-700";
    }
  }

  const onPrevMonthClick = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const onNextMonthClick = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="font-sans border border-gray-300 max-w-xs mx-auto rounded-lg overflow-hidden shadow-lg">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
