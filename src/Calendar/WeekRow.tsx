import { addDays } from "date-fns";
import { ReactElement } from "react";
import DayCell from "./DayCell";

interface WeekRowProps {
  startOfWeek: Date;
  currentMonth: Date;
  firstDate: Date | null;
  secondDate: Date | null;
  hoveredDate: Date | null;
  onCellClick: (day: Date) => void;
  onHover: (day: Date | null) => void;
  getClassesForDay: (props: { day: Date; currentMonth: Date }) => string;
}

const DAYS_IN_A_WEEK = 7;

function WeekRow({
  startOfWeek,
  currentMonth,
  firstDate,
  secondDate,
  hoveredDate,
  onCellClick,
  onHover,
  getClassesForDay,
}: WeekRowProps): ReactElement {
  let days: ReactElement[] = [];
  let currentDay = startOfWeek;

  for (let i = 0; i < DAYS_IN_A_WEEK; i++) {
    days.push(
      <DayCell
        key={currentDay.toDateString()}
        day={currentDay}
        currentMonth={currentMonth}
        firstDate={firstDate}
        secondDate={secondDate}
        hoveredDate={hoveredDate}
        onCellClick={onCellClick}
        onHover={onHover}
        getClassesForDay={getClassesForDay}
      />
    );
    currentDay = addDays(currentDay, 1);
  }

  return (
    <div className="flex" key={startOfWeek.toDateString()}>
      {days}
    </div>
  );
}

export default WeekRow;
