import {
  addDays,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek
} from "date-fns";
import { ReactElement, useEffect, useMemo, useState } from "react";
import WeekRow from "./WeekRow";

interface CellsProps {
  currentMonth: Date;
  firstDate: Date | null;
  secondDate: Date | null;
  handleFirstDateSelect: (day: Date) => void;
  handleSecondDateSelect: (day: Date) => void;
}

const DAYS_IN_A_WEEK = 7;

export enum DraggedDate {
  First = "first",
  Second = "second",
  None = "none",
}

function Cells({
  currentMonth,
  firstDate,
  secondDate,
  handleFirstDateSelect,
  handleSecondDateSelect,
}: CellsProps): ReactElement {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [draggedDate, setDraggedDate] = useState<DraggedDate>(DraggedDate.None);

  useEffect(() => {
    if (hoveredDate) {
      if (draggedDate === DraggedDate.First) {
        if (secondDate && hoveredDate > secondDate) {
          handleFirstDateSelect(secondDate);
          handleSecondDateSelect(hoveredDate);
          setDraggedDate(DraggedDate.Second);
        } else {
          handleFirstDateSelect(hoveredDate);
        }
      } else if (draggedDate === DraggedDate.Second) {
        if (firstDate && hoveredDate < firstDate) {
          handleSecondDateSelect(firstDate);
          handleFirstDateSelect(hoveredDate);
          setDraggedDate(DraggedDate.First);
        } else {
          handleSecondDateSelect(hoveredDate);
        }
      }
    }
  }, [hoveredDate, draggedDate]);

  function handleDateDrag(draggedDate: DraggedDate) {
    setDraggedDate(draggedDate);
  }

  function handleDateRelease() {
    setDraggedDate(DraggedDate.None);
  }

  const handleCellClick = (day: Date) => {
    if (firstDate) {
      if (day < firstDate) {
        handleFirstDateSelect(day);
      } else {
        handleSecondDateSelect(day);
      }
    } else {
      handleFirstDateSelect(day);
    }
  };

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
          firstDate={firstDate}
          secondDate={secondDate}
          hoveredDate={hoveredDate}
          onCellClick={handleCellClick}
          onHover={setHoveredDate}
          handleDateDrag={handleDateDrag}
          handleDateRelease={handleDateRelease}
          draggedDate={draggedDate}
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
