import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import DateTimeRangeProvider from "../Calendar/DateTimeRangeProvider";
import dashIcon from "../assets/icons/dash.svg";
import useOutsideClick from "../hooks/useOutsideClick";
import { ActiveInput, Time } from "../types";
import DateInput from "./DateInput";
import DateTime from "./DateTime";
import "./styles/DateTimeRange.css";

export default function DateTimeRange() {
  const [firstDate, setFirstDate] = useState<Date | null>(null);
  const [secondDate, setSecondDate] = useState<Date | null>(null);
  const [firstSelectedTime, setFirstSelectedTime] = useState<Time | null>(null);
  const [secondSelectedTime, setSecondSelectedTime] = useState<Time | null>(
    null
  );
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
    <div ref={containerRef} style={{ userSelect: "none" }}>
      <div className="flex items-center justify-center">
        <DateInput
          isActive={activeInput === ActiveInput.First}
          text="Start Date"
          date={firstDate}
          time={firstSelectedTime}
          onFocus={() => handleInputFocus(ActiveInput.First)}
        />
        <img src={dashIcon} alt="dash" className="mx-2 w-[12px] h-[12px]" />
        <DateInput
          isActive={activeInput === ActiveInput.Second}
          text="End Date"
          date={secondDate}
          time={secondSelectedTime}
          onFocus={() => handleInputFocus(ActiveInput.Second)}
        />
      </div>
      <DateTimeRangeProvider
        firstDate={firstDate}
        secondDate={secondDate}
        activeInput={activeInput}
        setActiveInput={setActiveInput}
        setFirstDate={setFirstDate}
        setSecondDate={setSecondDate}
        onFirstDateChange={() => handleFirstDateChange()}
        onSecondDateChange={() => handleSecondDateChange()}
        firstSelectedTime={firstSelectedTime}
        setFirstSelectedTime={setFirstSelectedTime}
        secondSelectedTime={secondSelectedTime}
        setSecondSelectedTime={setSecondSelectedTime}
      >
        <CSSTransition
          in={showDateTime}
          timeout={300}
          classNames="date-time"
          unmountOnExit
        >
          <DateTime onOkButtonClick={() => console.log("Ok")} />
        </CSSTransition>
      </DateTimeRangeProvider>
    </div>
  );
}
