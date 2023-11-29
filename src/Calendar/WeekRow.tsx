import { addDays } from "date-fns";
import { ReactElement } from "react";
import DayCell from "./DayCell";

interface WeekRowProps {
  startOfWeek: Date;
  currentMonth: Date;
  onHover: (day: Date | null) => void;
}

const DAYS_IN_A_WEEK = 7;

function WeekRow({
  startOfWeek,
  currentMonth,
  onHover,
}: WeekRowProps): ReactElement {
  let days: ReactElement[] = [];
  let currentDay = startOfWeek;

  for (let i = 0; i < DAYS_IN_A_WEEK; i++) {
    days.push(
      <DayCell
        key={currentDay.toDateString()}
        day={currentDay}
        currentMonth={currentMonth}
        onHover={onHover}
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
