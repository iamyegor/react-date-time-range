import {
  Dispatch,
  ReactElement,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { DraggedDate } from "./Cells";

type CalendarContextProps = {
  firstDate: Date | null;
  secondDate: Date | null;
  setFirstDate: Dispatch<SetStateAction<Date | null>>;
  setSecondDate: Dispatch<SetStateAction<Date | null>>;
  hoveredDate: Date | null;
  setHoveredDate: Dispatch<SetStateAction<Date | null>>;
  draggedDate: DraggedDate;
};

const CalendarContext = createContext<CalendarContextProps>({
  firstDate: null,
  secondDate: null,
  setFirstDate: () => {},
  setSecondDate: () => {},
  hoveredDate: null,
  setHoveredDate: () => {},
  draggedDate: DraggedDate.None,
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

  return (
    <CalendarContext.Provider
      value={{ firstDate, secondDate, setFirstDate, setSecondDate }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
