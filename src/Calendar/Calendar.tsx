import { addMonths, subMonths } from "date-fns";
import { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CellsGrid from "./CellsGrid";
import DaysRow from "./DaysRow";
import "./Calendar.css";

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  function onPrevMonthClick() {
    setCurrentMonth(subMonths(currentMonth, 1));
  }

  function onNextMonthClick() {
    setCurrentMonth(addMonths(currentMonth, 1));
  }

  return (
    <div className="calendar">
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonthClick={onPrevMonthClick}
        onNextMonthClick={onNextMonthClick}
      />
      <DaysRow currentMonth={currentMonth} />
      <CellsGrid currentMonth={currentMonth} />
    </div>
  );
}

export default Calendar;
