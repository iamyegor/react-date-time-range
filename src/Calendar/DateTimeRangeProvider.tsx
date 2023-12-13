import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import useCurrentDirection from "../hooks/useCurrentDirection.tsx";
import useEdgeSelectedDate from "../hooks/useEdgeSelectedDate.tsx";
import useFirstDateTimeIsGreater from "../hooks/useFirstDateTimeIsGreater.tsx";
import {
  ActiveInput,
  DashedBorderDirection,
  DraggedDate,
  Time,
} from "../types";
import { getDefaultSelectedTime } from "../utils";

type DateTimeRangeContextProps = {
  draggedDate: DraggedDate;
  onDraggedDateChange: (date: DraggedDate) => void;
  handleCellClick: (day: Date) => void;
  firstDate: Date | null;
  secondDate: Date | null;
  onFirstDateChange: (date: Date | null) => void;
  onSecondDateChange: (date: Date | null) => void;
  currentMonth: Date;
  onCurrentMonthChange: (date: Date) => void;
  hoveredDate: Date | null;
  onHoveredDateChange: (date: Date | null) => void;
  shadowSelectedDate: Date | null;
  onShadowSelectedDateChange: (date: Date | null) => void;
  isDragging: boolean;
  onIsDraggingChange: (isDragging: boolean) => void;
  activeInput: ActiveInput;
  onActiveInputChange: (activeInput: ActiveInput) => void;
  onDateChangedWhileDraggingChange: (dateChangedWhileDragging: boolean) => void;
  firstSelectedTime: Time | null;
  onFirstSelectedTimeChange: (time: Time | null) => void;
  secondSelectedTime: Time | null;
  onSecondSelectedTimeChange: (time: Time | null) => void;
  firstDateTimeIsGreater: boolean;
  edgeSelectedDate: Date | null;
  dashedBorderDirection: DashedBorderDirection;
  bannedDates: Date[];
  useAMPM: boolean;
  minDate?: Date;
  maxDate?: Date;
};

const DateTimeRangeContext = createContext<DateTimeRangeContextProps>({
  maxDate: undefined,
  minDate: undefined,
  draggedDate: DraggedDate.First,
  onDraggedDateChange: () => {},
  handleCellClick: () => {},
  firstDate: null,
  secondDate: null,
  onFirstDateChange: () => {},
  onSecondDateChange: () => {},
  currentMonth: new Date(),
  onCurrentMonthChange: () => {},
  hoveredDate: null,
  onHoveredDateChange: () => {},
  shadowSelectedDate: null,
  onShadowSelectedDateChange: () => {},
  isDragging: false,
  onIsDraggingChange: () => {},
  activeInput: ActiveInput.None,
  onActiveInputChange: () => {},
  onDateChangedWhileDraggingChange: () => {},
  firstSelectedTime: null,
  onFirstSelectedTimeChange: () => {},
  secondSelectedTime: null,
  onSecondSelectedTimeChange: () => {},
  firstDateTimeIsGreater: false,
  edgeSelectedDate: null,
  dashedBorderDirection: DashedBorderDirection.Left,
  bannedDates: [],
  useAMPM: false,
});

export function useDateTimeRange() {
  return useContext(DateTimeRangeContext);
}

interface DateTimeRangeProviderProps {
  children: ReactElement;
  firstDate: Date | null;
  onFirstDateChange: (date: Date | null) => void;
  secondDate: Date | null;
  onSecondDateChange: (date: Date | null) => void;
  activeInput: ActiveInput;
  onActiveInputChange: (date: ActiveInput) => void;
  firstSelectedTime: Time | null;
  onFirstSelectedTimeChange: (time: Time | null) => void;
  secondSelectedTime: Time | null;
  onSecondSelectedTimeChange: (time: Time | null) => void;
  bannedDates: Date[];
  useAMPM: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export default function DateTimeRangeProvider({
  maxDate,
  minDate,
  useAMPM,
  bannedDates,
  children,
  firstDate,
  onFirstDateChange,
  secondDate,
  onSecondDateChange,
  firstSelectedTime,
  onFirstSelectedTimeChange,
  secondSelectedTime,
  onSecondSelectedTimeChange,
  activeInput,
  onActiveInputChange,
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
  const firstDateTimeIsGreater = useFirstDateTimeIsGreater(
    firstDate,
    secondDate,
    firstSelectedTime,
    secondSelectedTime
  );

  const dashedBorderDirection = useCurrentDirection(activeInput);

  const edgeSelectedDate = useEdgeSelectedDate(
    firstDate,
    secondDate,
    dashedBorderDirection
  );

  function handleCellClick(day: Date) {
    setDateBasedOnActiveInput(day);
    setTimeIfNotSet();
  }

  function setTimeIfNotSet() {
    if (activeInput === ActiveInput.First && !firstSelectedTime) {
      onFirstSelectedTimeChange(getDefaultSelectedTime(useAMPM));
    } else if (activeInput === ActiveInput.Second && !secondSelectedTime) {
      onSecondSelectedTimeChange(getDefaultSelectedTime(useAMPM));
    }
  }

  function setDateBasedOnActiveInput(day: Date) {
    if (activeInput === ActiveInput.First) {
      setDateForFirstInput(day);
    } else if (activeInput === ActiveInput.Second) {
      setDateForSecondInput(day);
    }
  }

  function setDateForFirstInput(day: Date) {
    onFirstDateChange(day);
    if (secondDate && day > secondDate) {
      onSecondDateChange(null);
    }
  }

  function setDateForSecondInput(day: Date) {
    if (firstDate && day < firstDate) {
      onFirstDateChange(day);
      onSecondDateChange(null);
    } else {
      onSecondDateChange(day);
    }
  }

  useEffect(() => {
    if (isDragging && dateChangedWhileDragging) {
      if (draggedDate === DraggedDate.First) {
        onActiveInputChange(ActiveInput.First);
      } else if (draggedDate === DraggedDate.Second) {
        onActiveInputChange(ActiveInput.Second);
      }
    }
  }, [draggedDate, isDragging, dateChangedWhileDragging]);

  function handleDraggedDateChange(date: DraggedDate) {
    setDraggedDate(date);
  }

  function handleCurrentMonthChange(date: Date) {
    setCurrentMonth(date);
  }

  function handleHoveredDateChange(date: Date | null) {
    setHoveredDate(date);
  }

  function handleShadowSelectedDateChange(date: Date | null) {
    setShadowSelectedDate(date);
  }

  function handleIsDraggingChange(isDragging: boolean) {
    setIsDragging(isDragging);
  }

  function handleDateChangedWhileDraggingChange(
    dateChangedWhileDragging: boolean
  ) {
    setDateChangedWhileDragging(dateChangedWhileDragging);
  }

  return (
    <DateTimeRangeContext.Provider
      value={{
        draggedDate,
        onDraggedDateChange: handleDraggedDateChange,
        handleCellClick,
        firstDate,
        secondDate,
        onFirstDateChange,
        onSecondDateChange,
        currentMonth,
        onCurrentMonthChange: handleCurrentMonthChange,
        hoveredDate,
        onHoveredDateChange: handleHoveredDateChange,
        shadowSelectedDate,
        onShadowSelectedDateChange: handleShadowSelectedDateChange,
        isDragging,
        onIsDraggingChange: handleIsDraggingChange,
        activeInput,
        onActiveInputChange,
        onDateChangedWhileDraggingChange: handleDateChangedWhileDraggingChange,
        firstSelectedTime,
        onFirstSelectedTimeChange,
        secondSelectedTime,
        onSecondSelectedTimeChange,
        firstDateTimeIsGreater,
        edgeSelectedDate,
        dashedBorderDirection,
        bannedDates,
        useAMPM,
        minDate,
        maxDate,
      }}
    >
      {children}
    </DateTimeRangeContext.Provider>
  );
}
