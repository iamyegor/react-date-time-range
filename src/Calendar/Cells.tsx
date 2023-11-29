import {
  addDays,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ReactElement, useEffect, useMemo } from "react";
import { DraggedDate } from "../types";
import { useCalendar } from "./CalendarProvider";
import WeekRow from "./WeekRow";

interface CellsProps {
  currentMonth: Date;
  firstDate: Date | null;
  secondDate: Date | null;
  setFirstDate: (day: Date) => void;
  setSecondDate: (day: Date) => void;
}

const DAYS_IN_A_WEEK = 7;

function Cells({
  currentMonth,
  firstDate,
  secondDate,
  setFirstDate,
  setSecondDate,
}: CellsProps): ReactElement {
  const { hoveredDate, draggedDate, setDraggedDate } = useCalendar();

  useEffect(() => {
    if (hoveredDate) {
      if (draggedDate === DraggedDate.First) {
        if (secondDate && hoveredDate > secondDate) {
          setFirstDate(secondDate);
          setSecondDate(hoveredDate);
          setDraggedDate(DraggedDate.Second);
        } else {
          setFirstDate(hoveredDate);
        }
      } else if (draggedDate === DraggedDate.Second) {
        if (firstDate && hoveredDate < firstDate) {
          setSecondDate(firstDate);
          setFirstDate(hoveredDate);
          setDraggedDate(DraggedDate.First);
        } else {
          setSecondDate(hoveredDate);
        }
      }
    }
  }, [hoveredDate, draggedDate]);

  const rows = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    let weeks: ReactElement[] = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      weeks.push(
        <WeekRow
          key={currentDate.toDateString()}
          startOfWeek={currentDate}
          currentMonth={currentMonth}
        />
      );
      currentDate = addDays(currentDate, DAYS_IN_A_WEEK);
    }
    return weeks;
  }, [currentMonth, firstDate, secondDate, hoveredDate]);

  return (
    <div
      className={`flex-shrink-0 w-full ${
        draggedDate !== DraggedDate.None ? "cursor-grabbing" : ""
      }`}
    >
      {rows}
    </div>
  );
}

export default Cells;
