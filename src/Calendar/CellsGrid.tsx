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
import { classNames } from "primereact/utils";

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
        <div className="row" key={rows.length}>
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
    return isSameMonth(day, monthStart) ? (
      <div
        className={`col cell ${getClassForToday(day)}`}
        key={day.toDateString()}
      >
        <span className="number">{format(day, "d")}</span>
      </div>
    ) : (
      <div className="col cell"></div>
    );
  }

  function getClassForToday(day: Date) {
    if (isSameDay(day, new Date())) {
      return "selected";
    }
  }

  return <div className="body">{generateMonthRows()}</div>;
}

export default CellsGrid;
