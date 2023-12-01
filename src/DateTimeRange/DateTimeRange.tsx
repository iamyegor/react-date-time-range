import { useEffect, useRef, useState } from "react";
import CalendarProvider from "../Calendar/CalendarProvider";
import useOutsideClick from "../hooks/useOutsideClick";
import DateInput from "./DateInput";
import DateTime from "./DateTime";
import dashIcon from "../assets/icons/dash.svg";
import { ActiveInput } from "../types";

export default function DateTimeRange() {
  const [firstDate, setFirstDate] = useState<Date | null>(null);
  const [secondDate, setSecondDate] = useState<Date | null>(null);
  const [activeInput, setActiveInput] = useState<ActiveInput>(ActiveInput.None);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isVisible: showDateTime, setIsVisible: setShowDateTime } =
    useOutsideClick(containerRef.current);

  function handleInputFocus(input: ActiveInput) {
    setActiveInput(input);
    setShowDateTime(true);
  }

  useEffect(() => {
    if (!showDateTime) {
      setActiveInput(ActiveInput.None);
    }
  }, [showDateTime]);

  function handleFirstDateChange() {
    setActiveInput(ActiveInput.Second);
  }

  function handleSecondDateChange() {
    if (firstDate) {
      setActiveInput(ActiveInput.None);
      setShowDateTime(false);
    } else {
      setActiveInput(ActiveInput.First);
    }
  }

  return (
    <div ref={containerRef}>
      <div className="flex items-center justify-center">
        <DateInput
          isActive={activeInput === ActiveInput.First}
          text="Start Date"
          date={firstDate}
          onFocus={() => handleInputFocus(ActiveInput.First)}
        />
        <img src={dashIcon} alt="dash" className="mx-2 w-[12px] h-[12px]" />
        <DateInput
          isActive={activeInput === ActiveInput.Second}
          text="End Date"
          date={secondDate}
          onFocus={() => handleInputFocus(ActiveInput.Second)}
        />
      </div>
      <CalendarProvider
        firstDate={firstDate}
        secondDate={secondDate}
        activeInput={activeInput}
        setActiveInput={setActiveInput}
        setFirstDate={setFirstDate}
        setSecondDate={setSecondDate}
        onFirstDateChange={() => handleFirstDateChange()}
        onSecondDateChange={() => handleSecondDateChange()}
      >
        {showDateTime ? <DateTime /> : <></>}
      </CalendarProvider>
    </div>
  );
}
