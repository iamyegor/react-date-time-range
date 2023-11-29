import { ReactElement, createContext, useContext, useState } from "react";
import { DraggedDate } from "../types";

type CalendarContextProps = {
  draggedDate: DraggedDate;
  setDraggedDate: (draggedDate: DraggedDate) => void;
};

const CalendarContext = createContext<CalendarContextProps>({
  draggedDate: DraggedDate.None,
  setDraggedDate: () => {},
});

export function useCalendar() {
  return useContext(CalendarContext);
}

export default function CalendarProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [draggedDate, setDraggedDate] = useState<DraggedDate>(DraggedDate.None);

  return (
    <CalendarContext.Provider value={{ draggedDate, setDraggedDate }}>
      {children}
    </CalendarContext.Provider>
  );
}
