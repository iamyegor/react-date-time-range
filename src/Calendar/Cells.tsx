import {
  addDays,
  endOfMonth,
  endOfWeek,
  isEqual,
  startOfMonth,
  startOfWeek
} from "date-fns";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { DraggedDate } from "../types";
import { useDateTimeRange } from "./DateTimeRangeProvider";
import WeekRow from "./WeekRow";

interface CellsProps {
  currentMonth: Date;
}

const DAYS_IN_A_WEEK = 7;

function Cells({ currentMonth }: CellsProps): ReactElement {
  const {
    firstDate,
    secondDate,
    onFirstDateChange,
    onSecondDateChange,
    hoveredDate,
    draggedDate,
    onDraggedDateChange,
    onShadowSelectedDateChange,
    isDragging,
    onDateChangedWhileDraggingChange,
  } = useDateTimeRange();
  const [firstDateBeforeDrag, setFirstDateBeforeDrag] = useState<Date | null>(
    null
  );
  const [secondDateBeforeDrag, setSecondDateBeforeDrag] = useState<Date | null>(
    null
  );

  useEffect(() => {
    if (hoveredDate && isDragging) {
      if (draggedDate === DraggedDate.First) {
        if (secondDate && hoveredDate > secondDate) {
          onFirstDateChange(secondDate);
          onSecondDateChange(hoveredDate);
          onDraggedDateChange(DraggedDate.Second);
        } else {
          onFirstDateChange(hoveredDate);
        }
      } else if (draggedDate === DraggedDate.Second) {
        if (firstDate && hoveredDate < firstDate) {
          onSecondDateChange(firstDate);
          onFirstDateChange(hoveredDate);
          onDraggedDateChange(DraggedDate.First);
        } else {
          onSecondDateChange(hoveredDate);
        }
      }
    }
  }, [hoveredDate, draggedDate]);

  useEffect(() => {
    if (hoveredDate && isDragging) {
      if (firstDateBeforeDrag) {
        if (!isEqual(firstDateBeforeDrag, hoveredDate)) {
          onDateChangedWhileDraggingChange(true);
        }
      } else if (secondDateBeforeDrag) {
        if (!isEqual(secondDateBeforeDrag, hoveredDate)) {
          onDateChangedWhileDraggingChange(true);
        }
      }
    }
  }, [hoveredDate, isDragging]);

  useEffect(() => {
    if (isDragging) {
      if (draggedDate === DraggedDate.First) {
        onShadowSelectedDateChange(firstDate);
      }
      if (draggedDate === DraggedDate.Second) {
        onShadowSelectedDateChange(secondDate);
      }
    } else {
      onShadowSelectedDateChange(null);
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      setFirstDateBeforeDrag(firstDate);
      setSecondDateBeforeDrag(secondDate);
    } else {
      setFirstDateBeforeDrag(null);
      setSecondDateBeforeDrag(null);

      onDateChangedWhileDraggingChange(false);
    }
  }, [isDragging]);

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

  return <div className={`flex-shrink-0 w-full`}>{rows}</div>;
}

export default Cells;
