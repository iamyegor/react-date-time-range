import {
  Dispatch,
  ReactElement,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActiveInput, DraggedDate, Time } from "../types";
import { getDefaultSelectedTime } from "../utils";
import { startOfDay } from "date-fns";

type DateTimeRangeContextProps = {
  draggedDate: DraggedDate;
  setDraggedDate: Dispatch<SetStateAction<DraggedDate>>;
  handleCellClick: (day: Date) => void;
  firstDate: Date | null;
  secondDate: Date | null;
  setFirstDate: Dispatch<SetStateAction<Date | null>>;
  setSecondDate: Dispatch<SetStateAction<Date | null>>;
  currentMonth: Date;
  setCurrentMonth: Dispatch<SetStateAction<Date>>;
  hoveredDate: Date | null;
  setHoveredDate: Dispatch<SetStateAction<Date | null>>;
  shadowSelectedDate: Date | null;
  setShadowSelectedDate: Dispatch<SetStateAction<Date | null>>;
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  activeInput: ActiveInput;
  setActiveInput: (activeInput: ActiveInput) => void;
  setDateChangedWhileDragging: Dispatch<SetStateAction<boolean>>;
  firstSelectedTime: Time | null;
  setFirstSelectedTime: Dispatch<SetStateAction<Time | null>>;
  secondSelectedTime: Time | null;
  setSecondSelectedTime: Dispatch<SetStateAction<Time | null>>;
};

const DateTimeRangeContext = createContext<DateTimeRangeContextProps>({
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
  firstSelectedTime: null,
  setFirstSelectedTime: () => {},
  secondSelectedTime: null,
  setSecondSelectedTime: () => {},
});

export function useDateTimeRange() {
  return useContext(DateTimeRangeContext);
}

interface DateTimeRangeProviderProps {
  children: ReactElement;
  firstDate: Date | null;
  setFirstDate: Dispatch<React.SetStateAction<Date | null>>;
  secondDate: Date | null;
  setSecondDate: Dispatch<React.SetStateAction<Date | null>>;
  activeInput: ActiveInput;
  setActiveInput: Dispatch<React.SetStateAction<ActiveInput>>;
  firstSelectedTime: Time | null;
  setFirstSelectedTime: Dispatch<React.SetStateAction<Time | null>>;
  secondSelectedTime: Time | null;
  setSecondSelectedTime: Dispatch<React.SetStateAction<Time | null>>;
}

export default function DateTimeRangeProvider({
  children,
  firstDate,
  setFirstDate,
  secondDate,
  setSecondDate,
  firstSelectedTime,
  setFirstSelectedTime,
  secondSelectedTime,
  setSecondSelectedTime,
  activeInput,
  setActiveInput,
}: DateTimeRangeProviderProps) {
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

  useEffect(() => {
    if (firstDate && !firstSelectedTime) {
      setFirstSelectedTime(getDefaultSelectedTime());
    }
  }, [firstDate]);

  useEffect(() => {
    if (secondDate && !secondSelectedTime) {
      setSecondSelectedTime(getDefaultSelectedTime());
    }
  }, [secondDate]);

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
    <DateTimeRangeContext.Provider
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
        firstSelectedTime,
        setFirstSelectedTime,
        secondSelectedTime,
        setSecondSelectedTime,
      }}
    >
      {children}
    </DateTimeRangeContext.Provider>
  );
}
