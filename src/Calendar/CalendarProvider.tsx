import { ReactElement, createContext, useContext, useState } from "react";
import { DraggedDate } from "../types";
import { isSameDay } from "date-fns";

type CalendarContextProps = {
  draggedDate: DraggedDate;
  setDraggedDate: (draggedDate: DraggedDate) => void;
  handleCellClick: (day: Date) => void;
  firstDate: Date | null;
  secondDate: Date | null;
  setFirstDate: (day: Date) => void;
  setSecondDate: (day: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (month: Date) => void;
  hoveredDate: Date | null;
  setHoveredDate: (day: Date | null) => void;
  shadowSelectedDate: Date | null;
  setShadowSelectedDate: (day: Date | null) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
};

const CalendarContext = createContext<CalendarContextProps>({
  draggedDate: DraggedDate.None,
  setDraggedDate: () => {},
  handleCellClick: () => {},
  firstDate: null,
  secondDate: null,
  setFirstDate: () => {},
  setSecondDate: () => {},
  currentMonth: new Date(),
  setCurrentMonth: () => {},
  hoveredDate: null,
  setHoveredDate: () => {},
  shadowSelectedDate: null,
  setShadowSelectedDate: () => {},
  isDragging: false,
  setIsDragging: () => {},
});

export function useCalendar() {
  return useContext(CalendarContext);
}

export default function CalendarProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [firstDate, setFirstDate] = useState<Date | null>(null);
  const [secondDate, setSecondDate] = useState<Date | null>(null);
  const [draggedDate, setDraggedDate] = useState<DraggedDate>(DraggedDate.None);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [shadowSelectedDate, setShadowSelectedDate] = useState<Date | null>(
    null
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);

  function handleCellClick(day: Date) {
    // drag date and drop on the same date
    if (shadowSelectedDate && isSameDay(day, shadowSelectedDate)) {
      return;
    }

    if (firstDate) {
      if (day < firstDate) {
        setFirstDate(day);
      } else {
        setSecondDate(day);
      }
    } else {
      setFirstDate(day);
    }
  }

  return (
    <CalendarContext.Provider
      value={{
        draggedDate,
        setDraggedDate,
        handleCellClick,
        firstDate,
        secondDate,
        setFirstDate,
        setSecondDate,
        currentMonth,
        setCurrentMonth,
        hoveredDate,
        setHoveredDate,
        shadowSelectedDate,
        setShadowSelectedDate,
        isDragging,
        setIsDragging,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
