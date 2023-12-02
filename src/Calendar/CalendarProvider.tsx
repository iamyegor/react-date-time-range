import {
  Dispatch,
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActiveInput, DraggedDate } from "../types";

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
  activeInput: ActiveInput;
  setActiveInput: (activeInput: ActiveInput) => void;
  setDateChangedWhileDragging: (dateChangedWhileDragging: boolean) => void;
};

const CalendarContext = createContext<CalendarContextProps>({
  draggedDate: DraggedDate.First,
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
  activeInput: ActiveInput.None,
  setActiveInput: () => {},
  setDateChangedWhileDragging: () => {},
});

export function useCalendar() {
  return useContext(CalendarContext);
}

interface CalendarProviderProps {
  children: ReactElement;
  firstDate: Date | null;
  setFirstDate: Dispatch<React.SetStateAction<Date | null>>;
  secondDate: Date | null;
  setSecondDate: Dispatch<React.SetStateAction<Date | null>>;
  onFirstDateChange: () => void;
  onSecondDateChange: () => void;
  activeInput: ActiveInput;
  setActiveInput: Dispatch<React.SetStateAction<ActiveInput>>;
}

export default function CalendarProvider({
  children,
  firstDate,
  setFirstDate,
  secondDate,
  setSecondDate,
  onFirstDateChange,
  onSecondDateChange,
  activeInput,
  setActiveInput,
}: CalendarProviderProps) {
  const [draggedDate, setDraggedDate] = useState<DraggedDate>(
    DraggedDate.First
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [shadowSelectedDate, setShadowSelectedDate] = useState<Date | null>(
    null
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dateChangedWhileDragging, setDateChangedWhileDragging] =
    useState<boolean>(false);

  function handleCellClick(day: Date) {
    setDateBasedOnActiveInput(day);
  }

  function setDateBasedOnActiveInput(day: Date) {
    if (activeInput === ActiveInput.First) {
      setFirstDate(day);
      if (secondDate && day > secondDate) {
        setSecondDate(null);
      }
    } else if (activeInput === ActiveInput.Second) {
      if (firstDate && day < firstDate) {
        setFirstDate(day);
        setSecondDate(null);
      } else {
        setSecondDate(day);
      }
    }
  }

  // not including activeInput in the dependency array
  // is essential because otherwise, every time user simply
  // swithes between the inputs this effect will be triggered,
  useEffect(() => {
    if (firstDate && !isDragging && activeInput === ActiveInput.First) {
      onFirstDateChange();
    }
  }, [firstDate, isDragging]);

  useEffect(() => {
    if (secondDate && !isDragging && activeInput === ActiveInput.Second) {
      onSecondDateChange();
    }
  }, [secondDate, isDragging]);

  useEffect(() => {
    if (isDragging && dateChangedWhileDragging) {
      if (draggedDate === DraggedDate.First) {
        setActiveInput(ActiveInput.First);
      } else if (draggedDate === DraggedDate.Second) {
        setActiveInput(ActiveInput.Second);
      }
    }
  }, [draggedDate, isDragging, dateChangedWhileDragging]);

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
        activeInput,
        setActiveInput,
        setDateChangedWhileDragging,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
