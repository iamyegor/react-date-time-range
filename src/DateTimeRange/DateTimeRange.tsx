import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import DateTimeRangeProvider from "../Calendar/DateTimeRangeProvider";
import arrowBetweenDates from "../assets/icons/arrow-between-dates.svg";
import useOutsideClick from "../hooks/useOutsideClick";
import { ActiveInput, Time } from "../types";
import DateTimeContainer from "./DateTimeContainer";
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
  const [isFirstInputValid, setIsFirstInputValid] = useState<boolean>(true);
  const [isSecondInputValid, setIsSecondInputValid] = useState<boolean>(true);

  useEffect(() => {
    if (!showDateTime) {
      setActiveInput(ActiveInput.None);
    }
  }, [showDateTime]);

  function handleInputFocus(input: ActiveInput) {
    setActiveInput(input);
    setShowDateTime(true);
  }

  function handleOKButtonClick() {
    const areFirstDateAndTimeSelected = firstDate && firstSelectedTime;
    const areSecondDateAndTimeSelected = secondDate && secondSelectedTime;

    if (!areFirstDateAndTimeSelected && !areSecondDateAndTimeSelected) {
      setShowDateTime(false);
    } else if (
      activeInput === ActiveInput.First &&
      !areSecondDateAndTimeSelected
    ) {
      setActiveInput(ActiveInput.Second);
    } else if (
      activeInput === ActiveInput.Second &&
      !areFirstDateAndTimeSelected
    ) {
      setActiveInput(ActiveInput.First);
    } else {
      setShowDateTime(false);
    }
  }

  function handleFirstTimeChange(time: Time | null) {
    setFirstSelectedTime(time);
  }

  function handleSecondTimeChange(time: Time | null) {
    setSecondSelectedTime(time);
  }

  function handleFirstDateChange(date: Date | null) {
    setFirstDate(date);
  }

  function handleSecondDateChange(date: Date | null) {
    setSecondDate(date);
  }

  function handleActiveInputChange(input: ActiveInput) {
    setActiveInput(input);
  }

  function handleIsFirstInputValidChange(isValid: boolean) {
    setIsFirstInputValid(isValid);
  }

  function handleIsSecondInputValidChange(isValid: boolean) {
    setIsSecondInputValid(isValid);
  }

  return (
    <DateTimeRangeProvider
      firstDate={firstDate}
      secondDate={secondDate}
      activeInput={activeInput}
      onActiveInputChange={handleActiveInputChange}
      onFirstDateChange={handleFirstDateChange}
      onSecondDateChange={handleSecondDateChange}
      firstSelectedTime={firstSelectedTime}
      onFirstSelectedTimeChange={handleFirstTimeChange}
      secondSelectedTime={secondSelectedTime}
      onSecondSelectedTimeChange={handleSecondTimeChange}
    >
      <div ref={containerRef} style={{ userSelect: "none" }}>
        <div className="flex items-center justify-center mb-2">
          <DateTimeContainer
            isActive={activeInput === ActiveInput.First}
            text="Start Date"
            date={firstDate}
            onDateChange={handleFirstDateChange}
            time={firstSelectedTime}
            onTimeChange={handleFirstTimeChange}
            onFocus={() => handleInputFocus(ActiveInput.First)}
            isInputValid={isFirstInputValid}
            onIsInputValidChange={handleIsFirstInputValidChange}
          />
          <img src={arrowBetweenDates} alt="dash" className="mx-2 w-5 h-5" />
          <DateTimeContainer
            isActive={activeInput === ActiveInput.Second}
            text="End Date"
            date={secondDate}
            onDateChange={setSecondDate}
            time={secondSelectedTime}
            onTimeChange={handleSecondTimeChange}
            onFocus={() => handleInputFocus(ActiveInput.Second)}
            isInputValid={isSecondInputValid}
            onIsInputValidChange={handleIsSecondInputValidChange}
          />
        </div>
        <CSSTransition
          in={showDateTime}
          timeout={200}
          classNames="date-time"
          unmountOnExit
        >
          <DateTime onOkButtonClick={() => handleOKButtonClick()} />
        </CSSTransition>
      </div>
    </DateTimeRangeProvider>
  );
}
