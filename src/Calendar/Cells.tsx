import {
  addDays,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ReactElement, useMemo, useState } from "react";
import WeekRow from "./WeekRow";

interface CellsProps {
  currentMonth: Date;
  firstDate: Date | null;
  onFirstDateSelect: (date: Date) => void;
  secondDate: Date | null;
  onSecondDateSelect: (date: Date) => void;
}

const DAYS_IN_A_WEEK = 7;

function Cells({
  currentMonth,
  firstDate,
  onFirstDateSelect,
  secondDate,
  onSecondDateSelect,
}: CellsProps): ReactElement {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const handleCellClick = (day: Date) => {
    if (firstDate) {
      if (day < firstDate) {
        onFirstDateSelect(day);
      } else {
        onSecondDateSelect(day);
      }
    } else {
      onFirstDateSelect(day);
    }
  };

  const getClassesForDay = ({
    day,
    currentMonth,
  }: {
    day: Date;
    currentMonth: Date;
  }): string => {
    const monthStart = startOfMonth(currentMonth);
    const isDaySameMonth = isSameMonth(day, monthStart);
    const isToday = isSameDay(day, new Date());
    let isSelected = firstDate && isSameDay(day, firstDate);
    if (!isSelected) {
      isSelected = secondDate && isSameDay(day, secondDate);
    }

    if (!isDaySameMonth) return "text-gray-400";
    if (isSelected) return "selected-cell";
    if (isToday) return "border border-gray-400 rounded-full";
    return "";
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
          getClassesForDay={getClassesForDay}
        />
      );
      currentDate = addDays(currentDate, DAYS_IN_A_WEEK);
    }
    return weeks;
  }, [currentMonth, firstDate, secondDate, hoveredDate]);

  return <div className="flex-shrink-0 w-full">{rows}</div>;
}

export default Cells;
