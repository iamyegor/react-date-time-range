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
    setFirstDate,
    setSecondDate,
    hoveredDate,
    draggedDate,
    setDraggedDate,
    setShadowSelectedDate,
    isDragging,
    setDateChangedWhileDragging,
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

  useEffect(() => {
    if (hoveredDate && isDragging) {
      if (firstDateBeforeDrag) {
        if (!isEqual(firstDateBeforeDrag, hoveredDate)) {
          setDateChangedWhileDragging(true);
        }
      } else if (secondDateBeforeDrag) {
        if (!isEqual(secondDateBeforeDrag, hoveredDate)) {
          setDateChangedWhileDragging(true);
        }
      }
    }
  }, [hoveredDate, isDragging]);

  useEffect(() => {
    if (isDragging) {
      if (draggedDate === DraggedDate.First) {
        setShadowSelectedDate(firstDate);
      }
      if (draggedDate === DraggedDate.Second) {
        setShadowSelectedDate(secondDate);
      }
    } else {
      setShadowSelectedDate(null);
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      setFirstDateBeforeDrag(firstDate);
      setSecondDateBeforeDrag(secondDate);
    } else {
      setFirstDateBeforeDrag(null);
      setSecondDateBeforeDrag(null);

      setDateChangedWhileDragging(false);
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
