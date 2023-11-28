import { addDays } from "date-fns";
import { ReactElement } from "react";
import DayCell from "./DayCell";
import { DraggedDate } from "./Cells";

interface WeekRowProps {
  startOfWeek: Date;
  currentMonth: Date;
  firstDate: Date | null;
  secondDate: Date | null;
  hoveredDate: Date | null;
  onCellClick: (day: Date) => void;
  onHover: (day: Date | null) => void;
  getClassesForDay: (props: { day: Date; currentMonth: Date }) => string;
  handleDateDrag: (draggedDate: DraggedDate) => void;
  handleDateRelease: () => void;
  draggedDate: DraggedDate;
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
  handleDateDrag,
  handleDateRelease,
  draggedDate,
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
        handleDateDrag={handleDateDrag}
        handleDateRelease={handleDateRelease}
        draggedDate={draggedDate}
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
