import { ReactElement, createContext, useContext, useState } from "react";
import { DraggedDate } from "../types";

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

  function handleCellClick(day: Date) {
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
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
