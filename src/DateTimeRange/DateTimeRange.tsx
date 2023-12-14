import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import DateTimeRangeProvider from "../Calendar/DateTimeRangeProvider";
import arrowBetweenDates from "../assets/icons/arrow-between-dates.svg";
import useIsDateLessThanMinDate from "../hooks/useIsDateLessThanMinDate";
import useIsTimeLessThanMinTime from "../hooks/useIsTimeLessThanMinTime";
import useOutsideClick from "../hooks/useOutsideClick";
import { ActiveInput, Time } from "../types";
import { convertTo24HourFormat, formatToTime } from "../utils";
import DateTime from "./DateTime";
import DateTimeContainer from "./DateTimeContainer";
import "./styles/DateTimeRange.css";

interface DateTimeRangeProps {
  bannedDates?: Date[];
  useAMPM?: boolean;
  inputText: { start: string; end: string };
  minDate?: Date;
  maxDate?: Date;
  minTime?: Date;
}

export default function DateTimeRange({
  minTime,
  maxDate,
  minDate,
  bannedDates = [],
  useAMPM = false,
  inputText,
}: DateTimeRangeProps) {
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
  const [isFirtsDateInvalid, setIsFirstDateInvalid] = useState<boolean>(false);
  const [isSecondDateInvalid, setIsSecondDateInvalid] =
    useState<boolean>(false);
  const { isFirstDateLessThanMinDate, isSecondDateLessThanMinDate } =
    useIsDateLessThanMinDate(firstDate, secondDate, minDate || null);
  const [isFirstTimeInvalid, setIsFirstTimeInvalid] = useState<boolean>(false);
  const [isSecondTimeInvalid, setIsSecondTimeInvalid] =
    useState<boolean>(false);
  const { isFirstTimeLessThanMinTime, isSecondTimeLessThanMinTime } =
    useIsTimeLessThanMinTime(
      firstSelectedTime,
      secondSelectedTime,
      minTime ? formatToTime(minTime, useAMPM) : null
    );

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

  function handleIsFirstDateInvalidChange(isInvalid: boolean) {
    setIsFirstDateInvalid(isInvalid);
  }

  function handleIsSecondDateInvalidChange(isInvalid: boolean) {
    setIsSecondDateInvalid(isInvalid);
  }

  function handleIsFirstTimeInvalidChange(isInvalid: boolean) {
    setIsFirstTimeInvalid(isInvalid);
  }

  function handleIsSecondTimeInvalidChange(isInvalid: boolean) {
    setIsSecondTimeInvalid(isInvalid);
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
      bannedDates={bannedDates}
      useAMPM={useAMPM}
      minDate={minDate}
      maxDate={maxDate}
      minTimeIn24Hours={
        minTime
          ? convertTo24HourFormat(formatToTime(minTime, false))
          : undefined
      }
    >
      <div ref={containerRef} style={{ userSelect: "none" }}>
        <div className="flex items-center justify-center mb-2">
          <DateTimeContainer
            isActive={activeInput === ActiveInput.First}
            text={inputText.start}
            date={firstDate}
            onDateChange={handleFirstDateChange}
            time={firstSelectedTime}
            onTimeChange={handleFirstTimeChange}
            onFocus={() => handleInputFocus(ActiveInput.First)}
            testid="first-date-time-container"
            isTimeLessThanMinTime={isFirstTimeLessThanMinTime}
            isDateInvalid={isFirtsDateInvalid}
            onIsDateInvalidChange={handleIsFirstDateInvalidChange}
            isTimeInvalid={isFirstTimeInvalid}
            onIsTimeInvalidChange={handleIsFirstTimeInvalidChange}
            isDateLessThanMinDate={isFirstDateLessThanMinDate}
          />
          <img src={arrowBetweenDates} alt="dash" className="mx-2 w-5 h-5" />
          <DateTimeContainer
            isActive={activeInput === ActiveInput.Second}
            text={inputText.end}
            date={secondDate}
            onDateChange={setSecondDate}
            time={secondSelectedTime}
            onTimeChange={handleSecondTimeChange}
            onFocus={() => handleInputFocus(ActiveInput.Second)}
            testid="second-date-time-container"
            isTimeLessThanMinTime={isSecondTimeLessThanMinTime}
            isDateInvalid={isSecondDateInvalid}
            onIsDateInvalidChange={handleIsSecondDateInvalidChange}
            isTimeInvalid={isSecondTimeInvalid}
            onIsTimeInvalidChange={handleIsSecondTimeInvalidChange}
            isDateLessThanMinDate={isSecondDateLessThanMinDate}
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
